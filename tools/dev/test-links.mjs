/* ==========================================================================
   Genki 2.0 — цялост на маршрутите и линковете.

   Пуска се с:  node tools/dev/test-links.mjs

   Пази точно проблема, който собственикът хвана на живо: отваряне на
   preview адрес, което показва legacy Genki 1.0 — Desk / Tower / Hub и
   старите цени.

   Проверява две неща:
     1. нито един линк в Genki 2.0 не води към legacy страница в корена;
     2. `_redirects` връща в 2.0 всеки legacy маршрут, към който сочат
        самите legacy страници.
   ========================================================================== */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
}

const V2_PAGES = ['index', 'companies', 'how-it-works', 'mission', 'genki-fit', 'contact'];

/* Legacy страници, които реално стоят в корена на репото. */
const LEGACY_ROOT = [
  'index.html', 'companies.html', 'mission.html', 'contact.html',
  'office.html', 'box-landing.html', 'thank-you-contact.html',
  'thank-you-coming-soon.html',
];

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

/* ======================================================================
   1. Всеки линк в Genki 2.0 остава в Genki 2.0
   ====================================================================== */
console.log('\n=== Линковете в Genki 2.0 ===');
{
  const files = V2_PAGES.map((n) => 'v2/' + n + '.html')
    .concat(['tools/partials/header.html', 'tools/partials/footer.html']);

  let leaks = [];
  let broken = [];

  for (const f of files) {
    for (const h of hrefs(read(f))) {
      if (h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('http')) continue;

      // Абсолютен път — трябва да е споделен ресурс или правната страница,
      // но НИКОГА legacy страница на Genki 1.0.
      if (h.startsWith('/')) {
        const bare = h.replace(/^\//, '');
        const asHtml = bare.endsWith('.html') ? bare : bare + '.html';
        if (LEGACY_ROOT.includes(asHtml) || LEGACY_ROOT.includes(bare)) {
          leaks.push(f + ' → ' + h);
        }
        continue;
      }

      // Относителен път — от v2/ трябва да сочи към съществуващ файл в v2/.
      const target = join(ROOT, 'v2', h.split('#')[0].split('?')[0]);
      if (!existsSync(target)) broken.push(f + ' → ' + h);
    }
  }

  check('нито един линк не води към legacy 1.0', leaks.length === 0, leaks.join(', '));
  check('нито един относителен линк не е счупен', broken.length === 0, broken.join(', '));

  // Шестте страници са относителни нарочно: така навигацията остава в /v2
  // независимо къде е монтирана папката.
  const header = read('tools/partials/header.html');
  const navHrefs = hrefs(header).filter((h) => h.endsWith('.html'));
  check('навигацията ползва относителни линкове',
    navHrefs.length > 0 && navHrefs.every((h) => !h.startsWith('/')), navHrefs.join(','));
  check('навигацията покрива и шестте страници',
    V2_PAGES.every((p) => navHrefs.includes(p + '.html')), navHrefs.join(','));

  // Всяка от шестте страници съществува.
  for (const p of V2_PAGES) {
    check('v2/' + p + '.html съществува', existsSync(join(ROOT, 'v2', p + '.html')));
  }
}

/* ======================================================================
   2. `_redirects` връща legacy маршрутите в Genki 2.0
   ====================================================================== */
console.log('\n=== Маршрути за преглед в _redirects ===');
{
  const lines = read('_redirects').split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const rules = new Map();
  for (const l of lines) {
    const [from, to, code] = l.split(/\s+/);
    if (from && to) rules.set(from, { to, code });
  }

  const EXPECT = {
    '/': '/v2/index.html',
    '/index.html': '/v2/index.html',
    '/companies': '/v2/companies.html',
    '/companies.html': '/v2/companies.html',
    '/how-it-works': '/v2/how-it-works.html',
    '/mission': '/v2/mission.html',
    '/mission.html': '/v2/mission.html',
    '/genki-fit': '/v2/genki-fit.html',
    '/contact': '/v2/contact.html',
    '/contact.html': '/v2/contact.html',
  };

  for (const [from, to] of Object.entries(EXPECT)) {
    const r = rules.get(from);
    check(from + ' → ' + to, r && r.to === to, r ? r.to : 'липсва');
  }

  // 302, не 200: при пренаписване адресът остава в корена и относителните
  // връзки пак падат в legacy.
  const wrong = Object.keys(EXPECT).filter((f) => rules.get(f) && rules.get(f).code !== '302');
  check('всички са 302, не 200', wrong.length === 0, wrong.join(','));

  // Заварените правила не бива да се чупят.
  check('/box остава непокътнат', rules.get('/box') && rules.get('/box').to === '/box-landing');
  check('/products остава непокътнат', rules.get('/products') && rules.get('/products').to === '/');

  // Всеки маршрут, към който сочат самите legacy страници, трябва да е покрит —
  // така и от legacy страница човек се връща в 2.0.
  const legacyTargets = new Set();
  for (const f of ['index.html', 'companies.html', 'mission.html', 'contact.html', 'privacy.html']) {
    if (!existsSync(join(ROOT, f))) continue;
    for (const h of hrefs(read(f))) {
      if (/^\/(companies|mission|contact)$/.test(h)) legacyTargets.add(h);
    }
  }
  const uncovered = [...legacyTargets].filter((t) => !rules.has(t));
  check('всеки legacy nav маршрут връща в 2.0', uncovered.length === 0, uncovered.join(','));
  check('открити са реални legacy маршрути', legacyTargets.size >= 3,
    [...legacyTargets].join(','));
}

/* ======================================================================
   2б. Видимият футър не носи фирмената идентичност

   Решение на собственика 2026-09-23. Юридическите факти остават в
   Privacy Policy — там им е мястото. Нова фирма НЕ се измисля.
   ====================================================================== */
console.log('\n=== Футърът ===');
{
  const LEGAL = /Нортик|Nortik|206451535|ЕИК\s*\d|UIC\s*\d/;
  let dirty = [];
  for (const n of V2_PAGES) {
    if (LEGAL.test(read('v2/' + n + '.html'))) dirty.push(n);
  }
  check('нито една страница не носи фирмената идентичност', dirty.length === 0, dirty.join(','));
  check('партиалът също е чист', !LEGAL.test(read('tools/partials/footer.html')));

  const footer = read('tools/partials/footer.html');
  check('футърът е „© 2026 Genki"', footer.includes('© 2026 Genki'));
  check('Privacy линкът остава', footer.includes('/privacy'));
  check('навигацията във футъра остава',
    ['index.html', 'companies.html', 'contact.html'].every((h) => footer.includes(h)));
  check('контактът остава', footer.includes('mailto:hello@genki.bg'));

  // Правните страници НЕ се пипат — там идентичността трябва да стои.
  check('Privacy пази фирмената идентичност',
    existsSync(join(ROOT, 'privacy.html')) && /ЕИК|UIC/.test(read('privacy.html')));
}

/* ======================================================================
   2в. Размерите на визуалните слотове са съвместими със съотношенията

   Пази конкретния дефект: регистърът носеше класовия размер за
   „full-bleed hero" (2560×1440 = 16:9) върху слотове, чиято композиция
   вече беше сменена на 4:5, 2:1, 3:4 и 3:2 — невъзможни двойки.

   Каноничен източник: docs/GENKI-2.0-VISUAL-ASSET-PRODUCTION-PLAN.md.
   ====================================================================== */
console.log('\n=== Размери на визуалните слотове ===');
{
  const src = read('js/genki-site.js');
  const body = src.slice(src.indexOf('var SLOTS'), src.indexOf('2. <genki-slot>'));
  const re = /([A-Z]\d{2}):\s*\{\s*d:\s*'([^']+)',\s*m:\s*'([^']+)',\s*file:\s*'([^']+)',\s*mfile:\s*'([^']+)'/g;

  const ratioOf = (r) => { const [a, b] = r.split('/').map(Number); return a / b; };
  const pxOf = (p) => { const [a, b] = p.split('×').map(Number); return a / b; };

  const slots = [];
  let m;
  while ((m = re.exec(body))) {
    slots.push({ id: m[1], d: m[2], mo: m[3], file: m[4], mfile: m[5] });
  }
  check('регистърът се чете', slots.length >= 15, String(slots.length));

  const bad = [];
  for (const s of slots) {
    if (Math.abs(ratioOf(s.d) - pxOf(s.file)) > 0.01) bad.push(`${s.id} desktop ${s.d} ≠ ${s.file}`);
    if (Math.abs(ratioOf(s.mo) - pxOf(s.mfile)) > 0.01) bad.push(`${s.id} mobile ${s.mo} ≠ ${s.mfile}`);
  }
  check('всяка двойка съотношение/пиксели е съвместима', bad.length === 0, bad.slice(0, 4).join(' | '));

  // Конкретните четири, които бяха сбъркани.
  const byId = Object.fromEntries(slots.map((s) => [s.id, s]));
  check('H01 вече не е 2560×1440', byId.H01 && byId.H01.file !== '2560×1440', byId.H01 && byId.H01.file);
  check('C01 вече не е 2560×1440', byId.C01 && byId.C01.file !== '2560×1440', byId.C01 && byId.C01.file);
  check('W01 вече не е 2560×1440', byId.W01 && byId.W01.file !== '2560×1440', byId.W01 && byId.W01.file);
  check('M01 вече не е 2560×1440', byId.M01 && byId.M01.file !== '2560×1440', byId.M01 && byId.M01.file);

  // Стойностите съвпадат със заключените в production плана.
  const plan = read('docs/GENKI-2.0-VISUAL-ASSET-PRODUCTION-PLAN.md');
  check('H01 2400×3000 е в плана', plan.includes('2400 × 3000'));
  check('C01 3840×1920 е в плана', plan.includes('3840 × 1920'));
  check('W01 1600×2133 е в плана', plan.includes('1600 × 2133'));
  check('M01 2400×1600 е в плана', plan.includes('2400 × 1600'));

  // Регистърът различава трите неща.
  check('полето за файл се казва file', body.includes('file:'));
  check('полето за екран се казва css', body.includes('css:'));
  check('старите dpx/mpx ги няма', !body.includes('dpx:') && !body.includes('mpx:'));
}

/* ======================================================================
   2г. Mission — на мобилно текстът е преди визуала
   ====================================================================== */
console.log('\n=== Mission mobile ред ===');
{
  const css = read('css/genki-2.css');
  check('има правило за реда на мобилно',
    /@media \(max-width: 767px\)[^}]*\{[^}]*\.hero--editorial__copy\s*\{\s*order:\s*-1/s.test(css) ||
    css.includes('.hero--editorial__copy { order: -1; }'));
  check('правилото е само под 768px', css.includes('@media (max-width: 767px)'));

  // DOM редът НЕ се пипа — визуалът остава пръв, за да е вляво на desktop.
  const html = read('v2/mission.html');
  const vi = html.indexOf('hero--editorial__visual');
  const ci = html.indexOf('hero--editorial__copy');
  check('DOM редът е непроменен (визуалът пръв)', vi > 0 && ci > 0 && vi < ci);
}

/* ======================================================================
   3. Локалният сървър и командата
   ====================================================================== */
console.log('\n=== Локален преглед ===');
{
  check('tools/dev/serve.mjs съществува', existsSync(join(ROOT, 'tools/dev/serve.mjs')));
  const pkg = JSON.parse(read('package.json'));
  check('npm run dev е сървърът', pkg.scripts.dev === 'node tools/dev/serve.mjs', pkg.scripts.dev);
  check('npm run dev:v2 също работи', pkg.scripts['dev:v2'] === 'node tools/dev/serve.mjs');
  check('мъртвият „netlify dev" е махнат', !JSON.stringify(pkg.scripts).includes('netlify'));
}

console.log('\n' + '─'.repeat(52));
console.log(`РЕЗУЛТАТ: ${pass} минали, ${fail} паднали`);
if (fail) {
  console.log('\nПаднали:');
  failures.forEach((f) => console.log('  • ' + f));
  process.exit(1);
}
