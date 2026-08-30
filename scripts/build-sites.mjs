import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'dist');

const sourceFiles = [
  'index.html',
  'how-it-works.html',
  'talent.html',
  'clients.html',
  'protection.html',
  'talent-login.html',
  'talent-signup.html',
  'client-login.html',
  'client-signup.html',
  'talent-dashboard.html',
  'client-dashboard.html',
  'app.js',
  'styles.css',
  'signal-public.css',
  'workspace.js',
  'workspace.css',
  'signal-desk.css',
  'assets/pluto-logo-transparent.png',
];

for (const relativePath of sourceFiles) {
  const destination = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(projectRoot, relativePath), destination);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function collectFiles(directory, relativeDirectory = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (relativePath === 'server' || relativePath.startsWith('server/')) continue;
    if (relativePath === '.openai' || relativePath.startsWith('.openai/')) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}

const deployedFiles = await collectFiles(outputRoot);
const manifest = {};

for (const file of deployedFiles) {
  const extension = path.extname(file.relativePath).toLowerCase();
  manifest[`/${file.relativePath}`] = {
    body: (await readFile(file.absolutePath)).toString('base64'),
    contentType: mimeTypes[extension] || 'application/octet-stream',
  };
}

const workerSource = `const files = ${JSON.stringify(manifest)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const url = new URL(request.url);
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    if (pathname === '/') pathname = '/index.html';
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = files[pathname];
    if (!file) return new Response('Not found', { status: 404 });

    const headers = {
      'Content-Type': file.contentType,
      'Cache-Control': pathname.endsWith('.html') ? 'no-store' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    };
    return new Response(request.method === 'HEAD' ? null : decodeBase64(file.body), { status: 200, headers });
  },
};
`;

const serverDirectory = path.join(outputRoot, 'server');
await rm(serverDirectory, { recursive: true, force: true });
await mkdir(serverDirectory, { recursive: true });
await writeFile(path.join(serverDirectory, 'index.js'), workerSource, 'utf8');

console.log(`Prepared ${Object.keys(manifest).length} Pluto routes and assets for Sites.`);
