import { createRemoteJWKSet, jwtVerify } from 'jose';
import { validateProfile } from './account-options.mjs';

export const GOOGLE_CLIENT_ID = '922402174418-9vcvmgb1u6al78delh4u9j482ulrtqc2.apps.googleusercontent.com';
const keys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const sessionCookie = '__Host-pluto_session';
const nonceCookie = '__Host-pluto_nonce';
const WEEK = 7 * 86400;
const json = (data, status = 200, headers = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
const cookie = (name, value, age) => `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`;
const random = () => [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('');
const getCookie = (request, name) => (request.headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '='))?.slice(name.length + 1) || '';
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
export async function hash(value) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(b => b.toString(16).padStart(2, '0')).join(''); }

export async function verifyCredential(credential, nonce, jwks = keys) {
  const { payload } = await jwtVerify(credential, jwks, { audience: GOOGLE_CLIENT_ID, issuer: ['https://accounts.google.com', 'accounts.google.com'], algorithms: ['RS256'], requiredClaims: ['sub', 'exp', 'iat', 'email', 'nonce'], maxTokenAge: '10m' });
  if (!nonce || payload.nonce !== nonce || payload.email_verified !== true || typeof payload.email !== 'string' || typeof payload.sub !== 'string') fail('Google sign-in could not be verified.', 401);
  return { id: payload.sub, email: payload.email, name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim().slice(0, 100) : payload.email.split('@')[0] };
}
export async function currentProfile(request, env) {
  const token = getCookie(request, sessionCookie);
  if (!/^[a-f0-9]{64}$/.test(token) || !env.DB) return null;
  return env.DB.prepare('SELECT p.*, u.name, u.email FROM sessions s JOIN profiles p ON p.id = s.profile_id JOIN users u ON u.id = p.user_id WHERE s.token_hash = ? AND s.expires_at > ?').bind(await hash(token), Date.now()).first();
}
const publicProfile = p => ({ name: p.name, email: p.email, role: p.role, dob: p.dob, education: p.education, phone: p.phone, skills: JSON.parse(p.skills), complete: !!p.complete });
async function body(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) fail('JSON required.', 415);
  const raw = await request.text();
  if (raw.length > 16000) fail('Request too large.', 413);
  try { const parsed = JSON.parse(raw); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) fail('Invalid request.'); return parsed; } catch { fail('Invalid request.'); }
}
async function rateLimit(db, id, max, interval, cooldown = 0) {
  const now = Date.now();
  const result = await db.prepare('INSERT INTO otp_limits (id, count, resets_at, last_at) VALUES (?, 1, ?, ?) ON CONFLICT(id) DO UPDATE SET count = CASE WHEN resets_at <= ? THEN 1 ELSE count + 1 END, resets_at = CASE WHEN resets_at <= ? THEN ? ELSE resets_at END, last_at = ? WHERE (resets_at <= ? OR count < ?) AND last_at <= ? RETURNING id')
    .bind(id, now + interval, now, now, now, now + interval, now, now, max, now - cooldown).first();
  if (!result) fail('Please wait before trying again. Too many attempts.', 429);
}
export async function handleAuth(request, env) {
  const path = new URL(request.url).pathname;
  if (!path.startsWith('/api/')) return null;
  try {
    if (!env.DB) fail('Account service is temporarily unavailable.', 503);
    if (!['GET', 'POST', 'PUT'].includes(request.method)) fail('Method not allowed.', 405);
    if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) fail('Invalid request origin.', 403);
    if (path === '/api/auth/config' && request.method === 'GET') {
      await rateLimit(env.DB, 'config:' + await hash(request.headers.get('cf-connecting-ip') || 'local'), 40, 600000);
      const nonce = random();
      await env.DB.prepare('INSERT INTO auth_challenges (token_hash, expires_at) VALUES (?, ?)').bind(await hash(nonce), Date.now() + 600000).run();
      await env.DB.prepare('DELETE FROM auth_challenges WHERE expires_at <= ?').bind(Date.now()).run();
      return json({ clientId: GOOGLE_CLIENT_ID, nonce }, 200, { 'Set-Cookie': cookie(nonceCookie, nonce, 600) });
    }
    if (path === '/api/auth/google' && request.method === 'POST') {
      const data = await body(request);
      if (!['talent', 'client'].includes(data.role) || typeof data.credential !== 'string') fail('Invalid sign-in request.');
      const nonce = getCookie(request, nonceCookie);
      if (!nonce) fail('Sign-in expired. Reload this page and try again.', 401);
      let user;
      try { user = await verifyCredential(data.credential, nonce); } catch { fail('Google sign-in could not be verified. Reload and try again.', 401); }
      const used = await env.DB.prepare('DELETE FROM auth_challenges WHERE token_hash = ? AND expires_at > ? RETURNING token_hash').bind(await hash(nonce), Date.now()).first();
      if (!used) fail('Sign-in expired. Reload and try again.', 401);
      const id = `${user.id}:${data.role}`;
      const token = random();
      await env.DB.batch([
        env.DB.prepare('INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name').bind(user.id, user.email, user.name, Date.now()),
        env.DB.prepare('INSERT INTO profiles (id, user_id, role, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(id, user.id, data.role, Date.now()),
        env.DB.prepare('INSERT INTO sessions (token_hash, profile_id, expires_at) VALUES (?, ?, ?)').bind(await hash(token), id, Date.now() + WEEK * 1000),
        env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(Date.now()),
        env.DB.prepare('DELETE FROM auth_challenges WHERE expires_at <= ?').bind(Date.now()),
      ]);
      const response = json({ ok: true, destination: `${data.role}-dashboard.html` });
      response.headers.append('Set-Cookie', cookie(sessionCookie, token, WEEK));
      response.headers.append('Set-Cookie', cookie(nonceCookie, '', 0));
      return response;
    }
    if (path === '/api/auth/logout' && request.method === 'POST') {
      await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hash(getCookie(request, sessionCookie))).run();
      return json({ ok: true }, 200, { 'Set-Cookie': cookie(sessionCookie, '', 0) });
    }
    const profile = await currentProfile(request, env);
    if (!profile) fail('Please sign in to continue.', 401);
    if (path === '/api/me' && request.method === 'GET') return json({ profile: publicProfile(profile) });
    if (path === '/api/profile' && request.method === 'PUT') {
      let data; try { data = validateProfile(await body(request)); } catch (error) { fail(error.message); }
      await env.DB.prepare('UPDATE profiles SET dob=?, education=?, phone=?, skills=?, complete=1, updated_at=? WHERE id=?').bind(data.dob, data.education, data.phone, JSON.stringify(data.skills), Date.now(), profile.id).run();
      return json({ ok: true });
    }
    return json({ error: 'Not found.' }, 404);
  } catch (error) {
    return json({ error: error.status ? error.message : 'Account service is temporarily unavailable. Please try again.' }, error.status || 503);
  }
}
