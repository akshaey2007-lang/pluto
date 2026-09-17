import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi, requirePageSession } from './render-api.mjs';
import { migrate } from './db/postgres.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const pages = new Set(['index.html', 'how-it-works.html', 'talent.html', 'clients.html', 'protection.html', 'talent-login.html', 'talent-signup.html', 'client-login.html', 'client-signup.html', 'talent-dashboard.html', 'client-dashboard.html']);
const sourceAssets = new Set(['app.js', 'styles.css', 'signal-public.css', 'workspace.css', 'signal-desk.css', 'account.css', 'account.mjs', 'account-options.mjs', 'login.mjs', 'marketplace.mjs', 'marketplace.css']);
const images = new Set(['pluto-logo-transparent.png', 'pluto-studio-hero.png', 'pluto-workspace-background.png']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp' };

function originOf(req) {
  const host = req.headers.host || 'localhost:3000';
  const scheme = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  return `${scheme}://${host}`;
}
async function webRequest(req, url) {
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > 25000) throw Object.assign(new Error('Request too large.'), { status: 413 }); chunks.push(chunk); }
  return new Request(url, { method: req.method, headers: req.headers, body: chunks.length ? Buffer.concat(chunks) : undefined });
}
async function send(res, response) {
  res.statusCode = response.status;
  for (const [name, value] of response.headers) if (name.toLowerCase() !== 'set-cookie') res.setHeader(name, value);
  const cookies = response.headers.getSetCookie?.() || [];
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  const bytes = Buffer.from(await response.arrayBuffer());
  res.setHeader('Content-Length', bytes.length);
  res.end(bytes);
}

const server = http.createServer(async (req, res) => {
  const origin = originOf(req);
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url || '/', origin).pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.PLUTO_STAGING === '1') res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  try {
    if (pathname.startsWith('/api/')) {
      const response = await handleApi(await webRequest(req, new URL(req.url, origin)));
      await send(res, response); return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    const name = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!pages.has(name) && !sourceAssets.has(name) && !(name.startsWith('assets/') && images.has(name.slice(7)))) { res.writeHead(404); res.end('Not found'); return; }
    if (name === 'client-dashboard.html' || name === 'talent-dashboard.html') {
      const role = name.startsWith('client') ? 'client' : 'talent';
      const user = await requirePageSession(new Request(new URL(req.url, origin), { headers: req.headers }));
      if (!user) { res.writeHead(302, { Location: `/${role}-login.html`, 'Cache-Control': 'no-store' }); res.end(); return; }
      if (user.role !== role) { res.writeHead(302, { Location: `/${user.role}-dashboard.html`, 'Cache-Control': 'no-store' }); res.end(); return; }
    }
    const file = path.join(root, name);
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(name)] || 'application/octet-stream', 'Cache-Control': pages.has(name) ? 'no-store' : 'public, max-age=3600', 'Content-Length': data.length });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    console.error('Pluto request error:', error);
    res.writeHead(error.status || 503, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(error.status ? error.message : 'Service temporarily unavailable');
  }
});

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
if (process.env.DATABASE_URL) await migrate();
server.listen(port, host, () => console.log(`Pluto listening on ${host}:${port}`));
