import { createRemoteJWKSet, jwtVerify } from 'jose';
import { validateProfile, SKILLS } from './account-options.mjs';
import { database } from './db/postgres.mjs';

const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const SESSION = '__Host-pluto_session';
const NONCE = '__Host-pluto_nonce';
const WEEK = 7 * 24 * 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;
const json = (value, status = 200, headers = {}) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
const failure = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const cookie = (key, value, seconds) => `${key}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${seconds}`;
const random = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex');
const hash = async value => Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))).toString('hex');
const cookieValue = (request, name) => (request.headers.get('cookie') || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1) || '';
const isUuid = value => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');
const text = (value, min, max, label) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max ? value.trim() : failure(`${label} must be ${min}–${max} characters.`);
const number = (value, min, max, label) => Number.isSafeInteger(Number(value)) && Number(value) >= min && Number(value) <= max ? Number(value) : failure(`Enter a valid ${label}.`);
const roleOnly = (profile, expected) => { if (profile.role !== expected) failure(`${expected === 'client' ? 'Client' : 'Talent'} account required.`, 403); };
const adminOnly = profile => { if (!process.env.ADMIN_EMAIL || profile.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) failure('Administrator access required.', 403); };
const publicProfile = p => ({ id: p.id, name: p.name, email: p.email, role: p.role, dob: p.dob, education: p.education, phone: p.phone, skills: p.skills, complete: p.complete });
const publicProject = p => ({ ...p, deadline: p.deadline instanceof Date ? p.deadline.toISOString().slice(0, 10) : String(p.deadline).slice(0, 10), budget_paise: Number(p.budget_paise), created_at: Number(p.created_at), updated_at: Number(p.updated_at), proposal_count: Number(p.proposal_count || 0) });
const publicProposal = p => ({ ...p, quote_paise: Number(p.quote_paise), client_fee_paise: Math.round(Number(p.quote_paise) * .1), client_total_paise: Number(p.quote_paise) + Math.round(Number(p.quote_paise) * .1), created_at: Number(p.created_at), updated_at: Number(p.updated_at) });
const publicContract = c => ({ ...c, quote_paise: Number(c.quote_paise), fee_paise: Number(c.fee_paise), total_paise: Number(c.quote_paise) + Number(c.fee_paise), created_at: Number(c.created_at), updated_at: Number(c.updated_at) });

export function validateProject(input) {
  const title = text(input.title, 6, 120, 'Project title');
  const description = text(input.description, 40, 4000, 'Description');
  const category = text(input.category, 2, 60, 'Category');
  const deliverables = text(input.deliverables, 10, 2000, 'Deliverables');
  const budget_paise = number(input.budget_paise, 10000, 100000000, 'budget in paise');
  if (!Array.isArray(input.skills) || !input.skills.length || input.skills.length > 10 || new Set(input.skills).size !== input.skills.length || input.skills.some(x => !SKILLS.includes(x))) failure('Choose 1–10 skills from the list.');
  const deadline = input.deadline;
  const parsedDeadline = typeof deadline === 'string' ? new Date(deadline + 'T00:00:00Z') : null;
  if (typeof deadline !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(deadline) || !Number.isFinite(parsedDeadline.getTime()) || parsedDeadline.toISOString().slice(0, 10) !== deadline || deadline <= new Date().toISOString().slice(0, 10)) failure('Choose a future deadline.');
  return { title, description, category, deliverables, budget_paise, deadline, skills: input.skills };
}
export function validateProposal(input) {
  return { cover_letter: text(input.cover_letter, 40, 2500, 'Proposal'), quote_paise: number(input.quote_paise, 10000, 100000000, 'quote in paise'), delivery_days: number(input.delivery_days, 1, 365, 'delivery time') };
}

async function body(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) failure('JSON required.', 415);
  const raw = await request.text();
  if (raw.length > 20000) failure('Request is too large.', 413);
  try { const data = JSON.parse(raw); if (data && typeof data === 'object' && !Array.isArray(data)) return data; } catch {}
  failure('Invalid request body.');
}
async function rateLimit(db, id, max, windowMs) {
  const now = Date.now();
  const result = await db.query(`INSERT INTO auth_rate_limits(id,count,resets_at) VALUES($1,1,$2)
    ON CONFLICT(id) DO UPDATE SET count=CASE WHEN auth_rate_limits.resets_at<$3 THEN 1 ELSE auth_rate_limits.count+1 END,
    resets_at=CASE WHEN auth_rate_limits.resets_at<$3 THEN $2 ELSE auth_rate_limits.resets_at END
    RETURNING count`, [id, now + windowMs, now]);
  if (result.rows[0].count > max) failure('Too many attempts. Please try again later.', 429);
}
async function verifyGoogle(credential, nonce) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) failure('Google sign-in is not configured.', 503);
  const { payload } = await jwtVerify(credential, googleKeys, { audience: clientId, issuer: ['https://accounts.google.com', 'accounts.google.com'], algorithms: ['RS256'], requiredClaims: ['sub', 'exp', 'iat', 'email', 'nonce'], maxTokenAge: '10m' });
  if (!nonce || payload.nonce !== nonce || payload.email_verified !== true || typeof payload.email !== 'string' || typeof payload.sub !== 'string') failure('Google sign-in could not be verified.', 401);
  return { id: payload.sub, email: payload.email, name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim().slice(0, 100) : payload.email.split('@')[0] };
}
async function currentProfile(request, db) {
  const token = cookieValue(request, SESSION);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const result = await db.query(`SELECT p.*, u.name, u.email FROM sessions s
    JOIN profiles p ON p.id=s.profile_id JOIN users u ON u.id=p.user_id
    WHERE s.token_hash=$1 AND s.expires_at>$2`, [await hash(token), Date.now()]);
  return result.rows[0] || null;
}
async function notify(db, profileId, title, message, link = '') {
  await db.query('INSERT INTO notifications(id,profile_id,title,body,link,created_at) VALUES($1,$2,$3,$4,$5,$6)', [crypto.randomUUID(), profileId, title, message, link, Date.now()]);
}
async function projectFor(db, id) {
  if (!isUuid(id)) failure('Project not found.', 404);
  const { rows } = await db.query(`SELECT p.*, u.name AS client_name, cp.user_id AS client_user_id,
    (SELECT count(*) FROM proposals WHERE project_id=p.id AND status!='withdrawn') AS proposal_count
    FROM projects p JOIN profiles cp ON cp.id=p.client_profile_id JOIN users u ON u.id=cp.user_id WHERE p.id=$1`, [id]);
  if (!rows[0]) failure('Project not found.', 404);
  return rows[0];
}
async function contractFor(db, id, profile) {
  if (!isUuid(id)) failure('Workroom not found.', 404);
  const { rows } = await db.query(`SELECT c.*, p.title AS project_title, p.deliverables, p.deadline,
    cu.name AS client_name, tu.name AS talent_name FROM contracts c
    JOIN projects p ON p.id=c.project_id
    JOIN profiles cp ON cp.id=c.client_profile_id JOIN users cu ON cu.id=cp.user_id
    JOIN profiles tp ON tp.id=c.talent_profile_id JOIN users tu ON tu.id=tp.user_id
    WHERE c.id=$1`, [id]);
  const c = rows[0];
  if (!c || (c.client_profile_id !== profile.id && c.talent_profile_id !== profile.id)) failure('Workroom not found.', 404);
  return c;
}

export async function handleApi(request, db = database()) {
  const path = new URL(request.url).pathname;
  if (!path.startsWith('/api/')) return null;
  try {
    if (!['GET', 'POST', 'PUT', 'PATCH'].includes(request.method)) failure('Method not allowed.', 405);
    if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) failure('Invalid request origin.', 403);
    if (path === '/api/health' && request.method === 'GET') { await db.query('SELECT 1'); return json({ ok: true }); }
    if (path === '/api/auth/config' && request.method === 'GET') {
      await rateLimit(db, `config:${await hash(request.headers.get('x-forwarded-for') || 'local')}`, 40, 600000);
      const nonce = random();
      await db.query('INSERT INTO auth_challenges(token_hash,expires_at) VALUES($1,$2)', [await hash(nonce), Date.now() + 600000]);
      return json({ clientId: process.env.GOOGLE_CLIENT_ID || '', nonce }, 200, { 'Set-Cookie': cookie(NONCE, nonce, 600) });
    }
    if (path === '/api/auth/google' && request.method === 'POST') {
      const data = await body(request);
      if (!['talent', 'client'].includes(data.role) || typeof data.credential !== 'string') failure('Invalid sign-in request.');
      const nonce = cookieValue(request, NONCE);
      if (!nonce) failure('Sign-in expired. Reload and try again.', 401);
      let identity;
      try { identity = await verifyGoogle(data.credential, nonce); } catch (error) { if (error.status === 503) throw error; failure('Google sign-in could not be verified. Reload and try again.', 401); }
      const client = await db.connect();
      let profileId;
      const token = random();
      try {
        await client.query('BEGIN');
        const used = await client.query('DELETE FROM auth_challenges WHERE token_hash=$1 AND expires_at>$2 RETURNING token_hash', [await hash(nonce), Date.now()]);
        if (!used.rowCount) failure('Sign-in expired. Reload and try again.', 401);
        await client.query(`INSERT INTO users(id,email,name,created_at) VALUES($1,$2,$3,$4)
          ON CONFLICT(id) DO UPDATE SET email=EXCLUDED.email,name=EXCLUDED.name`, [identity.id, identity.email, identity.name, Date.now()]);
        await client.query(`INSERT INTO profiles(id,user_id,role,updated_at) VALUES($1,$2,$3,$4)
          ON CONFLICT(user_id,role) DO NOTHING`, [crypto.randomUUID(), identity.id, data.role, Date.now()]);
        profileId = (await client.query('SELECT id FROM profiles WHERE user_id=$1 AND role=$2', [identity.id, data.role])).rows[0].id;
        await client.query('INSERT INTO sessions(token_hash,profile_id,expires_at) VALUES($1,$2,$3)', [await hash(token), profileId, Date.now() + WEEK]);
        await client.query('COMMIT');
      } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
      const response = json({ ok: true, destination: `${data.role}-dashboard.html` });
      response.headers.append('Set-Cookie', cookie(SESSION, token, WEEK / 1000));
      response.headers.append('Set-Cookie', cookie(NONCE, '', 0));
      return response;
    }
    if (path === '/api/auth/logout' && request.method === 'POST') {
      await db.query('DELETE FROM sessions WHERE token_hash=$1', [await hash(cookieValue(request, SESSION))]);
      return json({ ok: true }, 200, { 'Set-Cookie': cookie(SESSION, '', 0) });
    }
    const profile = await currentProfile(request, db);
    if (!profile) failure('Please sign in to continue.', 401);
    if (path === '/api/me' && request.method === 'GET') return json({ profile: publicProfile(profile), admin: !!process.env.ADMIN_EMAIL && profile.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() });
    if (path === '/api/profile' && request.method === 'PUT') {
      let data;
      try { data = validateProfile(await body(request)); } catch (error) { failure(error.message, 400); }
      await db.query('UPDATE profiles SET dob=$1,education=$2,phone=$3,skills=$4,complete=true,updated_at=$5 WHERE id=$6', [data.dob, data.education, data.phone, JSON.stringify(data.skills), Date.now(), profile.id]);
      return json({ ok: true });
    }
    if (path === '/api/summary' && request.method === 'GET') {
      const { rows } = await db.query(`SELECT
        (SELECT count(*) FROM projects WHERE client_profile_id=$1) AS owned_projects,
        (SELECT count(*) FROM proposals WHERE talent_profile_id=$1 AND status!='withdrawn') AS sent_proposals,
        (SELECT count(*) FROM proposals x JOIN projects p ON p.id=x.project_id WHERE p.client_profile_id=$1 AND x.status!='withdrawn') AS received_proposals,
        (SELECT count(*) FROM contracts WHERE client_profile_id=$1 OR talent_profile_id=$1) AS contracts,
        (SELECT count(*) FROM notifications WHERE profile_id=$1 AND read_at IS NULL) AS unread`, [profile.id]);
      return json({ summary: Object.fromEntries(Object.entries(rows[0]).map(([k, v]) => [k, Number(v)])) });
    }
    if (path === '/api/projects' && request.method === 'GET') {
      const url = new URL(request.url);
      const scope = url.searchParams.get('scope') || (profile.role === 'client' ? 'mine' : 'open');
      const search = (url.searchParams.get('search') || '').trim().slice(0, 100);
      const skill = (url.searchParams.get('skill') || '').trim();
      let clause = scope === 'mine' && profile.role === 'client' ? 'p.client_profile_id=$1' : "p.status='open'";
      const args = scope === 'mine' && profile.role === 'client' ? [profile.id] : [];
      if (search) { args.push(`%${search}%`); clause += ` AND (p.title ILIKE $${args.length} OR p.description ILIKE $${args.length})`; }
      if (skill && SKILLS.includes(skill)) { args.push(JSON.stringify([skill])); clause += ` AND p.skills @> $${args.length}::jsonb`; }
      const { rows } = await db.query(`SELECT p.*, u.name AS client_name,
        (SELECT count(*) FROM proposals WHERE project_id=p.id AND status!='withdrawn') AS proposal_count
        FROM projects p JOIN profiles cp ON cp.id=p.client_profile_id JOIN users u ON u.id=cp.user_id
        WHERE ${clause} ORDER BY p.updated_at DESC LIMIT 60`, args);
      return json({ projects: rows.map(publicProject) });
    }
    if (path === '/api/projects' && request.method === 'POST') {
      roleOnly(profile, 'client'); if (!profile.complete) failure('Complete your profile before posting a project.');
      const raw = await body(request); const data = validateProject(raw); const status = raw.status === 'draft' ? 'draft' : 'open'; const id = crypto.randomUUID(); const now = Date.now();
      await db.query(`INSERT INTO projects(id,client_profile_id,title,description,category,skills,budget_paise,deadline,deliverables,status,created_at,updated_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)`, [id, profile.id, data.title, data.description, data.category, JSON.stringify(data.skills), data.budget_paise, data.deadline, data.deliverables, status, now]);
      return json({ ok: true, id }, 201);
    }
    const projectMatch = path.match(/^\/api\/projects\/([^/]+)$/);
    if (projectMatch) {
      const project = await projectFor(db, projectMatch[1]);
      if (request.method === 'GET') {
        if (project.status !== 'open' && project.client_profile_id !== profile.id) {
          const allowed = await db.query('SELECT 1 FROM proposals WHERE project_id=$1 AND talent_profile_id=$2', [project.id, profile.id]);
          if (!allowed.rowCount) failure('Project not found.', 404);
        }
        return json({ project: publicProject(project) });
      }
      if (request.method === 'PUT') {
        roleOnly(profile, 'client'); if (project.client_profile_id !== profile.id) failure('Project not found.', 404);
        if (['hired', 'completed'].includes(project.status)) failure('An active contract cannot be edited.', 409);
        const raw = await body(request); const data = validateProject(raw);
        const status = ['draft', 'open', 'paused', 'closed'].includes(raw.status) ? raw.status : project.status;
        await db.query(`UPDATE projects SET title=$1,description=$2,category=$3,skills=$4,budget_paise=$5,deadline=$6,deliverables=$7,status=$8,updated_at=$9 WHERE id=$10`,
          [data.title, data.description, data.category, JSON.stringify(data.skills), data.budget_paise, data.deadline, data.deliverables, status, Date.now(), project.id]);
        return json({ ok: true });
      }
    }
    const projectProposals = path.match(/^\/api\/projects\/([^/]+)\/proposals$/);
    if (projectProposals) {
      const project = await projectFor(db, projectProposals[1]);
      if (request.method === 'GET') {
        if (project.client_profile_id !== profile.id) failure('Project not found.', 404);
        const { rows } = await db.query(`SELECT x.*, u.name AS talent_name, p.skills AS talent_skills FROM proposals x
          JOIN profiles p ON p.id=x.talent_profile_id JOIN users u ON u.id=p.user_id WHERE x.project_id=$1 ORDER BY x.created_at DESC`, [project.id]);
        return json({ proposals: rows.map(publicProposal) });
      }
      if (request.method === 'POST') {
        roleOnly(profile, 'talent'); if (!profile.complete) failure('Complete your profile before proposing.');
        if (project.status !== 'open') failure('This project is not accepting proposals.', 409);
        if (project.client_user_id === profile.user_id) failure('You cannot propose to your own project.', 403);
        const data = validateProposal(await body(request)); const id = crypto.randomUUID(); const now = Date.now();
        try { await db.query(`INSERT INTO proposals(id,project_id,talent_profile_id,cover_letter,quote_paise,delivery_days,status,created_at,updated_at)
          VALUES($1,$2,$3,$4,$5,$6,'submitted',$7,$7)`, [id, project.id, profile.id, data.cover_letter, data.quote_paise, data.delivery_days, now]); }
        catch (error) { if (error.code === '23505') failure('You already proposed to this project.', 409); throw error; }
        await notify(db, project.client_profile_id, 'New proposal', `${profile.name} sent a proposal for ${project.title}.`, `client-dashboard.html#proposals`);
        return json({ ok: true, id }, 201);
      }
    }
    if (path === '/api/proposals' && request.method === 'GET') {
      roleOnly(profile, 'talent');
      const { rows } = await db.query(`SELECT x.*, p.title AS project_title, p.status AS project_status FROM proposals x JOIN projects p ON p.id=x.project_id
        WHERE x.talent_profile_id=$1 ORDER BY x.updated_at DESC LIMIT 100`, [profile.id]);
      return json({ proposals: rows.map(publicProposal) });
    }
    const proposalMatch = path.match(/^\/api\/proposals\/([^/]+)$/);
    if (proposalMatch && request.method === 'PATCH') {
      if (!isUuid(proposalMatch[1])) failure('Proposal not found.', 404);
      const { rows } = await db.query('SELECT x.*,p.client_profile_id,p.status AS project_status FROM proposals x JOIN projects p ON p.id=x.project_id WHERE x.id=$1', [proposalMatch[1]]);
      const item = rows[0]; if (!item) failure('Proposal not found.', 404);
      const action = (await body(request)).action;
      if (action === 'withdraw' && item.talent_profile_id === profile.id && ['submitted', 'shortlisted'].includes(item.status)) {
        await db.query("UPDATE proposals SET status='withdrawn',updated_at=$1 WHERE id=$2", [Date.now(), item.id]);
      } else if (['shortlist', 'reject'].includes(action) && item.client_profile_id === profile.id && item.project_status === 'open' && ['submitted', 'shortlisted'].includes(item.status)) {
        const status = action === 'shortlist' ? 'shortlisted' : 'rejected';
        await db.query('UPDATE proposals SET status=$1,updated_at=$2 WHERE id=$3', [status, Date.now(), item.id]);
        await notify(db, item.talent_profile_id, status === 'shortlisted' ? 'Proposal shortlisted' : 'Proposal update', `Your proposal was ${status}.`, 'talent-dashboard.html#proposals');
      } else failure('This proposal cannot be updated.', 403);
      return json({ ok: true });
    }
    const acceptMatch = path.match(/^\/api\/proposals\/([^/]+)\/accept$/);
    if (acceptMatch && request.method === 'POST') {
      roleOnly(profile, 'client'); if (!isUuid(acceptMatch[1])) failure('Proposal not found.', 404);
      const client = await db.connect(); let contractId; let talentId;
      try {
        await client.query('BEGIN');
        const { rows } = await client.query(`SELECT x.*,p.client_profile_id,p.status AS project_status,p.title AS project_title FROM proposals x
          JOIN projects p ON p.id=x.project_id WHERE x.id=$1 FOR UPDATE OF p,x`, [acceptMatch[1]]);
        const proposal = rows[0];
        if (!proposal || proposal.client_profile_id !== profile.id) failure('Proposal not found.', 404);
        if (proposal.project_status !== 'open' || !['submitted', 'shortlisted'].includes(proposal.status)) failure('This proposal cannot be accepted.', 409);
        contractId = crypto.randomUUID(); talentId = proposal.talent_profile_id; const now = Date.now();
        const fee = Math.round(Number(proposal.quote_paise) * .1);
        await client.query(`INSERT INTO contracts(id,project_id,proposal_id,client_profile_id,talent_profile_id,quote_paise,fee_paise,status,created_at,updated_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,'awaiting_funding',$8,$8)`, [contractId, proposal.project_id, proposal.id, profile.id, talentId, proposal.quote_paise, fee, now]);
        await client.query(`INSERT INTO milestones(id,contract_id,title,amount_paise,status,created_at,updated_at)
          VALUES($1,$2,'Project delivery',$3,'awaiting_funding',$4,$4)`, [crypto.randomUUID(), contractId, proposal.quote_paise, now]);
        await client.query("UPDATE projects SET status='hired',updated_at=$1 WHERE id=$2", [now, proposal.project_id]);
        await client.query("UPDATE proposals SET status='rejected',updated_at=$1 WHERE project_id=$2 AND id!=$3 AND status IN ('submitted','shortlisted')", [now, proposal.project_id, proposal.id]);
        await client.query("UPDATE proposals SET status='accepted',updated_at=$1 WHERE id=$2", [now, proposal.id]);
        await client.query('COMMIT');
      } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
      await notify(db, talentId, 'Proposal accepted', 'A client accepted your proposal. Funding is required before work begins.', `talent-dashboard.html#work`);
      return json({ ok: true, contractId }, 201);
    }
    if (path === '/api/talent' && request.method === 'GET') {
      roleOnly(profile, 'client'); const search = (new URL(request.url).searchParams.get('search') || '').slice(0, 100);
      const { rows } = await db.query(`SELECT p.id,p.skills,p.education,u.name,
        (SELECT count(*) FROM reviews WHERE subject_profile_id=p.id) AS review_count,
        (SELECT coalesce(avg(rating),0) FROM reviews WHERE subject_profile_id=p.id) AS rating
        FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.role='talent' AND p.complete=true
        AND ($1='' OR u.name ILIKE $2 OR p.skills::text ILIKE $2) ORDER BY u.name LIMIT 60`, [search, `%${search}%`]);
      return json({ talent: rows.map(x => ({ ...x, rating: Number(x.rating), review_count: Number(x.review_count) })) });
    }
    if (path === '/api/contracts' && request.method === 'GET') {
      const { rows } = await db.query(`SELECT c.*,p.title AS project_title,cu.name AS client_name,tu.name AS talent_name FROM contracts c
        JOIN projects p ON p.id=c.project_id JOIN profiles cp ON cp.id=c.client_profile_id JOIN users cu ON cu.id=cp.user_id
        JOIN profiles tp ON tp.id=c.talent_profile_id JOIN users tu ON tu.id=tp.user_id
        WHERE c.client_profile_id=$1 OR c.talent_profile_id=$1 ORDER BY c.updated_at DESC LIMIT 100`, [profile.id]);
      return json({ contracts: rows.map(publicContract) });
    }
    const contractMatch = path.match(/^\/api\/contracts\/([^/]+)$/);
    if (contractMatch && request.method === 'GET') {
      const contract = await contractFor(db, contractMatch[1], profile);
      const milestones = await db.query('SELECT * FROM milestones WHERE contract_id=$1 ORDER BY created_at', [contract.id]);
      const messages = await db.query(`SELECT m.*,u.name AS sender_name FROM messages m JOIN profiles p ON p.id=m.sender_profile_id JOIN users u ON u.id=p.user_id
        WHERE m.contract_id=$1 ORDER BY m.created_at LIMIT 200`, [contract.id]);
      const reviews = await db.query('SELECT * FROM reviews WHERE contract_id=$1 ORDER BY created_at', [contract.id]);
      return json({ contract: publicContract(contract), milestones: milestones.rows.map(m => ({ ...m, amount_paise: Number(m.amount_paise), created_at: Number(m.created_at), updated_at: Number(m.updated_at) })), messages: messages.rows.map(m => ({ ...m, created_at: Number(m.created_at) })), reviews: reviews.rows });
    }
    const messagesMatch = path.match(/^\/api\/contracts\/([^/]+)\/messages$/);
    if (messagesMatch && request.method === 'POST') {
      const contract = await contractFor(db, messagesMatch[1], profile);
      const data = await body(request); const message = text(data.body, 1, 2000, 'Message');
      await db.query('INSERT INTO messages(id,contract_id,sender_profile_id,body,created_at) VALUES($1,$2,$3,$4,$5)', [crypto.randomUUID(), contract.id, profile.id, message, Date.now()]);
      const recipient = profile.id === contract.client_profile_id ? contract.talent_profile_id : contract.client_profile_id;
      await notify(db, recipient, 'New message', `${profile.name} sent a message about ${contract.project_title}.`, `${profile.role === 'client' ? 'talent' : 'client'}-dashboard.html#messages`);
      return json({ ok: true }, 201);
    }
    if (path === '/api/notifications' && request.method === 'GET') {
      const { rows } = await db.query('SELECT * FROM notifications WHERE profile_id=$1 ORDER BY created_at DESC LIMIT 50', [profile.id]);
      return json({ notifications: rows.map(n => ({ ...n, created_at: Number(n.created_at), read_at: n.read_at ? Number(n.read_at) : null })) });
    }
    const notificationMatch = path.match(/^\/api\/notifications\/([^/]+)\/read$/);
    if (notificationMatch && request.method === 'POST') {
      if (!isUuid(notificationMatch[1])) failure('Notification not found.', 404);
      const result = await db.query('UPDATE notifications SET read_at=$1 WHERE id=$2 AND profile_id=$3', [Date.now(), notificationMatch[1], profile.id]);
      if (!result.rowCount) failure('Notification not found.', 404);
      return json({ ok: true });
    }
    if (path === '/api/reports' && request.method === 'POST') {
      const data = await body(request); const reason = text(data.reason, 3, 80, 'Reason'); const details = text(data.details, 10, 1500, 'Details');
      const projectId = data.projectId && isUuid(data.projectId) ? data.projectId : null;
      if (data.projectId && !projectId) failure('Project not found.', 404);
      if (projectId) await projectFor(db, projectId);
      await db.query('INSERT INTO reports(id,reporter_profile_id,project_id,reason,details,created_at) VALUES($1,$2,$3,$4,$5,$6)', [crypto.randomUUID(), profile.id, projectId, reason, details, Date.now()]);
      return json({ ok: true }, 201);
    }
    if (path === '/api/admin/summary' && request.method === 'GET') {
      adminOnly(profile);
      const { rows } = await db.query(`SELECT (SELECT count(*) FROM users) AS users,
        (SELECT count(*) FROM projects) AS projects,
        (SELECT count(*) FROM proposals) AS proposals,
        (SELECT count(*) FROM contracts) AS contracts,
        (SELECT count(*) FROM reports WHERE status!='resolved') AS open_reports`);
      return json({ summary: Object.fromEntries(Object.entries(rows[0]).map(([k, v]) => [k, Number(v)])) });
    }
    if (path === '/api/admin/reports' && request.method === 'GET') {
      adminOnly(profile); const { rows } = await db.query('SELECT * FROM reports ORDER BY created_at DESC LIMIT 100');
      return json({ reports: rows });
    }
    const adminReportMatch = path.match(/^\/api\/admin\/reports\/([^/]+)$/);
    if (adminReportMatch && request.method === 'PATCH') {
      adminOnly(profile);
      if (!isUuid(adminReportMatch[1])) failure('Report not found.', 404);
      const data = await body(request);
      if (!['reviewing', 'resolved'].includes(data.status)) failure('Invalid report status.');
      const result = await db.query('UPDATE reports SET status=$1 WHERE id=$2 RETURNING reporter_profile_id', [data.status, adminReportMatch[1]]);
      if (!result.rowCount) failure('Report not found.', 404);
      await notify(db, result.rows[0].reporter_profile_id, 'Report update', `Your report is now ${data.status}.`);
      return json({ ok: true });
    }
    return json({ error: 'Not found.' }, 404);
  } catch (error) {
    if (!error.status) console.error('Pluto API error:', error);
    return json({ error: error.status ? error.message : 'The service is temporarily unavailable. Please try again.' }, error.status || 503);
  }
}

export async function requirePageSession(request, db = database()) { return currentProfile(request, db); }
