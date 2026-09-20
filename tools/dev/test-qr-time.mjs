/* ==========================================================================
   Тестове на времето в известията за сканиране на кутия.

   Пуска се с:  node tools/dev/test-qr-time.mjs

   Извиква истинския functions/api/qr.js с подменени Resend и часовник и
   проверява какво точно влиза в имейла и в брояча по дни. Нито един реален
   имейл и нито едно истинско сканиране.

   Тази система е жива — затова се проверява, че рефакторът към общата
   утилита не е променил нито видимия формат, нито границата на деня.
   ========================================================================== */

import { onRequestPost } from '../../functions/api/qr.js';

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; console.log('  + ' + name); }
  else { fail++; failures.push(name + (detail ? ' - ' + detail : '')); console.log('  ! ' + name + (detail ? ' - ' + detail : '')); }
}

const CODE = 'GK-063FB5';

/* Замразява часовника на известен момент, без да чупи останалите
   възможности на Date. */
function freeze(iso) {
  const Real = Date;
  const fixed = new Real(iso).getTime();
  class Frozen extends Real {
    constructor(...args) {
      if (args.length === 0) super(fixed);
      else super(...args);
    }
    static now() { return fixed; }
  }
  globalThis.Date = Frozen;
  return () => { globalThis.Date = Real; };
}

async function run(iso, { kv = null } = {}) {
  const sent = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    sent.push(JSON.parse(opts.body));
    return { ok: true, status: 200, text: async () => '{}' };
  };
  const unfreeze = freeze(iso);
  try {
    const res = await onRequestPost({
      request: {
        method: 'POST',
        headers: { get: () => null },
        cf: {},
        json: async () => ({ landing_page_code: CODE, is_test: false }),
      },
      env: { RESEND_API_KEY: 'test-key', ...(kv ? { GENKI_SCANS: kv } : {}) },
    });
    return { res, mail: sent[0] };
  } finally {
    unfreeze();
    globalThis.fetch = realFetch;
  }
}

function memKv() {
  const store = new Map();
  return {
    store,
    get: async (k) => store.get(k) || null,
    put: async (k, v) => { store.set(k, v); },
  };
}

console.log('\n=== ЛЯТО: 2026-09-20T14:17:00Z → 17:17 София ===');
{
  const { res, mail } = await run('2026-09-20T14:17:00Z');
  check('връща 204, както преди', res.status === 204);
  check('часът е софийски, не UTC', mail.text.includes('17:17'), JSON.stringify((mail.text.match(/When:.*/) || [])[0]));
  check('НЕ показва UTC часа 14:17', !mail.text.includes('14:17'));
  // Запетаята след деня от седмицата зависи от версията на ICU, затова не
  // се проверява. Важното е, че форматът е дългият — ден от седмицата,
  // число и име на месец — какъвто беше и преди рефактора.
  check('датата е в дългия формат', /Sun,? 20 September/.test(mail.text),
    JSON.stringify((mail.text.match(/When:.*/) || [])[0]));
  check('зоната е назована', mail.text.includes('(Sofia time)'));
  check('суров ISO низ не изтича в имейла',
    !/\d{4}-\d{2}-\d{2}T\d{2}:/.test(mail.text + (mail.html || '')));
}

console.log('\n=== ЗИМА: 2026-12-20T14:17:00Z → 16:17 София ===');
{
  const { mail } = await run('2026-12-20T14:17:00Z');
  check('часът е 16:17, не 17:17 — отместването не е зашито', mail.text.includes('16:17'),
    JSON.stringify((mail.text.match(/When:.*/) || [])[0]));
  check('датата е декемврийска', /20 December/.test(mail.text));
}

console.log('\n=== ГРАНИЦАТА НА БИЗНЕС ДЕНЯ Е 00:00 СОФИЙСКО ===');
{
  // 20-и, 21:30Z е вече 21-ви в София. Броячът трябва да мине на нов ден.
  const kv = memKv();
  await run('2026-09-20T20:30:00Z', { kv });   // 23:30 софийско, още 20-и
  await run('2026-09-20T21:30:00Z', { kv });   // 00:30 софийско, вече 21-ви
  const rec = JSON.parse(kv.store.get(CODE));

  check('двете сканирания са в общия сбор', rec.total === 2, 'total=' + rec.total);
  check('но са в различни дни', Object.keys(rec.days).length === 2, JSON.stringify(rec.days));
  check('първото е на 20-и', rec.days['2026-09-20'] === 1, JSON.stringify(rec.days));
  check('второто е на 21-ви, не на 20-и', rec.days['2026-09-21'] === 1, JSON.stringify(rec.days));
  check('по UTC и двете щяха да паднат на 20-и — точно това поправяме',
    !rec.days['2026-09-20'] || rec.days['2026-09-20'] !== 2);
  check('машинното поле остава UTC ISO', /^\d{4}-\d{2}-\d{2}T.*Z$/.test(rec.last), rec.last);
}

console.log('\n=== „ДНЕС" В ИМЕЙЛА БРОИ ПО СОФИЙСКИ ДЕН ===');
{
  const kv = memKv();
  await run('2026-09-20T06:00:00Z', { kv });   // 09:00 софийско
  await run('2026-09-20T09:00:00Z', { kv });   // 12:00 софийско
  const { mail } = await run('2026-09-20T12:00:00Z', { kv });  // 15:00 софийско
  check('трите сканирания в един софийски ден се броят заедно',
    /3 total · 3 today/.test(mail.text), JSON.stringify((mail.text.match(/Scans:.*/) || [])[0]));

  // А сканиране след софийската полунощ започва нов брояч за деня.
  const { mail: next } = await run('2026-09-20T21:30:00Z', { kv });
  check('след софийската полунощ „днес" се нулира',
    /4 total · 1 today/.test(next.text), JSON.stringify((next.text.match(/Scans:.*/) || [])[0]));
}

console.log('\n' + '-'.repeat(52));
console.log('РЕЗУЛТАТ: ' + pass + ' минали, ' + fail + ' паднали');
if (fail) {
  console.log('\nПаднали:');
  failures.forEach((f) => console.log('  * ' + f));
  process.exit(1);
}
console.log('Нито един реален имейл и нито едно истинско сканиране.');
