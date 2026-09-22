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
