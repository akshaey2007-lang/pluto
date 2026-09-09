import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { SignJWT, generateKeyPair, exportJWK, createLocalJWKSet } from 'jose';
import { handleAuth, hash, verifyCredential, GOOGLE_CLIENT_ID } from '../auth-server.mjs';
import { validateProfile } from '../account-options.mjs';

const origin = 'https://pluto.test';
const valid = { dob: '2000-02-29', education: 'BSc Computer Science', phone: '+919876543210', skills: ['Python', 'React'] };
async function setup() {
  const db = new DatabaseSync(':memory:'); db.exec('PRAGMA foreign_keys=ON');
  for (const f of readdirSync(new URL('../drizzle/', import.meta.url)).filter(f => f.endsWith('.sql')).sort()) db.exec(readFileSync(new URL('../drizzle/' + f, import.meta.url), 'utf8'));
  const DB = { prepare(sql) { return { bind(...args) { return { first: async () => db.prepare(sql).get(...args) ?? null, run: async () => ({ meta: db.prepare(sql).run(...args) }) }; } }; }, async batch(statements) { db.exec('BEGIN'); try { const values = []; for (const s of statements) values.push(await s.run()); db.exec('COMMIT'); return values; } catch (e) { db.exec('ROLLBACK'); throw e; } } };
  const token = 'a'.repeat(64);
  db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)').run('one', 'one@example.com', '<Test User>', Date.now());
  db.prepare('INSERT INTO profiles (id, user_id, role, updated_at) VALUES (?, ?, ?, ?)').run('one:talent', 'one', 'talent', Date.now());
  db.prepare('INSERT INTO profiles (id, user_id, role, updated_at) VALUES (?, ?, ?, ?)').run('one:client', 'one', 'client', Date.now());
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(await hash(token), 'one:talent', Date.now() + 60000);
  const request = (path, method='GET', data, headers={}) => new Request(origin + path, { method, headers: { Cookie: '__Host-pluto_session=' + token, Origin: origin, ...(data ? { 'Content-Type': 'application/json' } : {}), ...headers }, body: data ? JSON.stringify(data) : undefined });
  return { db, env: { DB }, request };
}
test('profile validation rejects invalid calendar dates, unknown skills, future DOB and local phone format', () => {
  assert.deepEqual(validateProfile(valid), valid);
  for (const change of [{ dob: '2001-02-29' }, { dob: '2999-01-01' }, { phone: '9876543210' }, { skills: [] }, { skills: ['Invented skill'] }, { education: '' }]) assert.throws(() => validateProfile({ ...valid, ...change }));
});
test('Google verification requires valid signature, audience, expiry, issuer, verified email and matching nonce', async () => {
  const { privateKey, publicKey } = await generateKeyPair('RS256'); const jwk = await exportJWK(publicKey); jwk.kid = 'test';
  const keys = createLocalJWKSet({ keys: [jwk] });
  const sign = changes => new SignJWT({ sub: 'google-id', email: 'real@example.com', name: 'Real Name', email_verified: true, nonce: 'nonce', aud: GOOGLE_CLIENT_ID, iss: 'https://accounts.google.com', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 300, ...changes }).setProtectedHeader({ alg: 'RS256', kid: 'test' }).sign(privateKey);
  assert.equal((await verifyCredential(await sign({}), 'nonce', keys)).name, 'Real Name');
  for (const changes of [{ aud: 'other-app' }, { nonce: 'wrong' }, { email_verified: false }, { exp: 1 }, { iss: 'https://evil.test' }]) await assert.rejects(() => sign(changes).then(token => verifyCredential(token, 'nonce', keys)));
  const token = await sign({}); await assert.rejects(() => verifyCredential(token.slice(0, -5) + 'xxxxx', 'nonce', keys));
});
test('first Google login creates a session and profile, and prevents nonce replay', async () => {
  const { db, env, request } = await setup();
  const configResponse = await handleAuth(request('/api/auth/config'), env);
  const { nonce } = await configResponse.json();
  assert.match(configResponse.headers.get('set-cookie'), /Secure; HttpOnly/);
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey); jwk.kid = 'google-fixture';
  const credential = await new SignJWT({ sub: 'new-google-account', email: 'new@example.com', name: 'New Person', email_verified: true, nonce }).setProtectedHeader({ alg: 'RS256', kid: jwk.kid }).setAudience(GOOGLE_CLIENT_ID).setIssuer('https://accounts.google.com').setIssuedAt().setExpirationTime('5m').sign(privateKey);
  const original = globalThis.fetch;
  globalThis.fetch = async url => {
    assert.equal(String(url), 'https://www.googleapis.com/oauth2/v3/certs');
    return Response.json({ keys: [jwk] });
  };
  try {
    const login = () => handleAuth(request('/api/auth/google', 'POST', { credential, role: 'talent' }, { Cookie: '__Host-pluto_nonce=' + nonce }), env);
    const result = await login(); assert.equal(result.status, 200);
    const session = result.headers.getSetCookie().find(s => s.startsWith('__Host-pluto_session=')).split(';')[0];
    const me = await (await handleAuth(request('/api/me', 'GET', null, { Cookie: session }), env)).json();
    assert.equal(me.profile.name, 'New Person'); assert.equal(me.profile.complete, false); assert.deepEqual(me.profile.skills, []);
    assert.equal((await login()).status, 401);
  } finally { globalThis.fetch = original; db.close(); }
});
test('anonymous, expired and cross-origin requests are rejected', async () => {
  const { db, env, request } = await setup();
  assert.equal((await handleAuth(request('/api/me', 'GET', null, { Cookie: '' }), env)).status, 401);
  assert.equal((await handleAuth(request('/api/profile', 'PUT', valid, { Origin: 'https://evil.test' }), env)).status, 403);
  db.exec('UPDATE sessions SET expires_at=0');
  assert.equal((await handleAuth(request('/api/me'), env)).status, 401); db.close();
});
test('profile saves survive requests and cannot overwrite Google identity or another role', async () => {
  const { db, env, request } = await setup();
  assert.equal((await handleAuth(request('/api/profile', 'PUT', { ...valid, name: 'Fake', user_id: 'other', role: 'client' }), env)).status, 200);
  const profile = (await (await handleAuth(request('/api/me'), env)).json()).profile;
  assert.equal(profile.name, '<Test User>'); assert.equal(profile.role, 'talent'); assert.equal(profile.complete, true); assert.deepEqual(profile.skills, valid.skills);
  assert.equal(db.prepare('SELECT complete FROM profiles WHERE id=?').get('one:client').complete, 0);
  await handleAuth(request('/api/profile', 'PUT', { ...valid, phone: '+919876543211' }), env);
  assert.equal((await (await handleAuth(request('/api/me'), env)).json()).profile.phone, '+919876543211'); db.close();
});
test('logout revokes the stored session and expires its secure cookie', async () => {
  const { db, env, request } = await setup(); const response = await handleAuth(request('/api/auth/logout', 'POST', {}), env);
  assert.match(response.headers.get('set-cookie'), /Secure; HttpOnly; SameSite=Lax; Max-Age=0/);
  assert.equal((await handleAuth(request('/api/me'), env)).status, 401); db.close();
});
