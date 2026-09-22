/* ==========================================================================
   Genki 2.0 — локален сървър за преглед.

   Пуска се с:
     npm run dev

   После отваря сам браузъра на Genki 2.0 Home. Нищо не се конфигурира,
   няма Cloudflare Access, няма променливи на средата, няма deploy.

   ЗАЩО СОБСТВЕН СЪРВЪР, А НЕ python -m http.server
     Cloudflare Pages разрешава „чисти" адреси: /companies сервира
     companies.html, а /v2/ сервира v2/index.html. Простият статичен
     сървър не го прави и прегледът се разминава с това, което ще види
     човек на живо. Тук същото разрешаване е повторено.

   КАКВО НЕ ПРАВИ
     Pages Functions (/api/*) не се изпълняват тук — те искат Cloudflare
     средата, D1 и Resend. Локалният преглед е за вид, лайаут, copy,
     навигация, езици и отзивчивост. Backend-ът се проверява на
     защитения Preview.
   ========================================================================== */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const PORT = Number(process.env.PORT) || 8765;
const START = '/v2/';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
};

async function fileAt(p) {
  try {
    const s = await stat(p);
    return s.isFile() ? p : null;
  } catch (e) {
    return null;
  }
}

/** Същото разрешаване като Cloudflare Pages: точен файл → /index.html → .html */
async function resolve(pathname) {
  // Никакво излизане извън корена на проекта.
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, clean);

  let hit = await fileAt(base);
  if (hit) return hit;

  if (clean.endsWith('/')) {
    hit = await fileAt(join(base, 'index.html'));
    if (hit) return hit;
  }

  if (!extname(clean)) {
    hit = await fileAt(base + '.html');
    if (hit) return hit;
    hit = await fileAt(join(base, 'index.html'));
    if (hit) return hit;
  }

  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = await resolve(url.pathname);

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html><meta charset="utf-8">
      <style>font-family:system-ui;padding:40px</style>
      <h1>404</h1><p>Няма такъв файл: <code>${url.pathname}</code></p>
      <p><a href="${START}">← Genki 2.0 Home</a></p>`);
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      // Прегледът трябва да показва последната промяна, не кеш.
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500');
  }
});

server.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`
  Genki 2.0 — локален преглед
  ${'─'.repeat(52)}

  Начало            ${base}/v2/
  За компании       ${base}/v2/companies.html
  Как работи        ${base}/v2/how-it-works.html
  Мисия             ${base}/v2/mission.html
  Genki Fit         ${base}/v2/genki-fit.html
  Контакт           ${base}/v2/contact.html

  Езикът се сменя от бутона BG/EN в хедъра.

  Забележка: /api/* НЕ работи тук — Pages Functions искат Cloudflare
  средата, D1 и Resend. Затова Genki Fit ще покаже резултата, но
  изпращането по имейл се проверява на защитения Preview.

  Спиране: Ctrl+C
`);

  // Отваря браузъра сам, за да не се сглобяват адреси на ръка.
  if (process.env.NO_OPEN !== '1') {
    const cmd = process.platform === 'darwin' ? 'open'
      : process.platform === 'win32' ? 'start' : 'xdg-open';
    try {
      spawn(cmd, [base + START], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref();
    } catch (e) { /* без браузър просто се ползва адресът отгоре */ }
  }
});
