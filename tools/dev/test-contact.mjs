/* ==========================================================================
   Тестове на сървърния handler за формата за контакт.

   Пуска се с:  node tools/dev/test-contact.mjs

   Тества functions/api/contact.js ИЗОЛИРАНО от интерфейса, с подменен
   fetch. НЕ изпраща нито един реален имейл.
   ========================================================================== */

import { onRequest, onRequestPost, validate, buildEmail } from '../../functions/api/contact.js';

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, detail) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
}

/* --- подменен Resend ----------------------------------------------------- */
let calls = [];
function mockFetch(mode = 'ok') {
  return async (url, opts) => {
    calls.push({ url, body: JSON.parse(opts.body), headers: opts.headers });
    if (mode === 'fail') return { ok: false, status: 500, text: async () => 'mock failure' };
    if (mode === 'throw') throw new Error('network down');
    return { ok: true, status: 200, text: async () => '{}' };
  };
}

function ctx(body, { env = {}, method = 'POST', raw = null, ip = '1.2.3.4' } = {}) {
  return {
    request: {
      method,
      headers: { get: (h) => (h === 'CF-Connecting-IP' ? ip : h === 'Referer' ? '' : null) },
      json: async () => {
        if (raw !== null) throw new Error('bad json');
        return body;
      },
    },
    env,
  };
}

const VALID_BG = {
  name: 'Иван Петров', company: 'Примерна ЕООД',
  email: 'ivan@primerna.bg', phone: '', message: 'Здравейте, имам въпрос.', lang: 'bg',
};
const VALID_EN = {
  name: 'Jane Doe', company: 'Example Ltd',
  email: 'jane@example.com', phone: '+44 20 7946 0000', message: 'Hello, a question.', lang: 'en',
};
const KEY = { RESEND_API_KEY: 'test-key' };

async function body(res) { return JSON.parse(await res.text()); }

console.log('\n=== ВАЛИДАЦИЯ (единично) ===');
{
  check('валиден BG payload минава', validate(VALID_BG).ok);
  check('валиден EN payload минава', validate(VALID_EN).ok);
  check('липсва име', validate({ ...VALID_BG, name: '' }).errors.includes('name'));
  check('липсва компания', validate({ ...VALID_BG, company: '   ' }).errors.includes('company'));
  check('невалиден email', validate({ ...VALID_BG, email: 'not-an-email' }).errors.includes('email'));
  check('email без домейн', validate({ ...VALID_BG, email: 'a@b' }).errors.includes('email'));
  check('липсва съобщение', validate({ ...VALID_BG, message: '' }).errors.includes('message'));
  check('телефонът по желание може да е празен', validate({ ...VALID_BG, phone: '' }).ok);
  check('международен телефон се приема', validate({ ...VALID_BG, phone: '+359 (88) 123-4567' }).ok);
  check('твърде дълго съобщение пада', !validate({ ...VALID_BG, message: 'x'.repeat(5000) }).ok);
  check('whitespace се изрязва', validate({ ...VALID_BG, name: '  Иван  ' }).fields.name === 'Иван');
  check('непознати полета се игнорират',
    validate({ ...VALID_BG, isAdmin: true, role: 'root' }).fields.isAdmin === undefined);
  check('непознат език пада към bg', validate({ ...VALID_BG, lang: 'de' }).fields.lang === 'bg');
  check('апостроф в името минава', validate({ ...VALID_BG, name: "O'Brien" }).ok);
}

console.log('\n=== СЪДЪРЖАНИЕ НА ИМЕЙЛА ===');
{
  const meta = { timestamp: '2026-09-20T10:00:00.000Z', referrer: '', utm: '' };
  const evil = validate({ ...VALID_BG, message: '<script>alert(1)</script>', company: 'A & B "Co"' });
  const mail = buildEmail(evil.fields, meta);
  check('HTML от потребителя е екраниран', !mail.html.includes('<script>') && mail.html.includes('&lt;script&gt;'));
  check('амперсанд и кавички са екранирани', mail.html.includes('A &amp; B &quot;Co&quot;'));
  check('заглавието сочи източника', mail.subject.startsWith('Genki 2.0 Contact Form'));

  const nl = validate({ ...VALID_BG, company: 'Ред1\nРед2' });
  check('нов ред в заглавието е премахнат', !buildEmail(nl.fields, meta).subject.includes('\n'));

  const withPhone = buildEmail(validate(VALID_EN).fields, meta);
  check('попълненият телефон влиза в имейла', withPhone.text.includes('+44 20 7946 0000'));
  const noPhone = buildEmail(validate(VALID_BG).fields, meta);
  check('празният телефон се отбелязва с тире', noPhone.text.includes('Телефон: —'));
  check('езикът на страницата е в имейла', noPhone.text.includes('BG'));
  check('има timestamp', noPhone.text.includes('2026-09-20T10:00:00.000Z'));
  check('съобщението е в текстовата версия', noPhone.text.includes('Здравейте, имам въпрос.'));
}

console.log('\n=== HANDLER ===');
{
  const realFetch = globalThis.fetch;

  /* A. валиден BG submit */
  calls = []; globalThis.fetch = mockFetch('ok');
  let res = await onRequestPost(ctx(VALID_BG, { env: KEY }));
  check('A. валиден BG submit връща 200 ok', res.status === 200 && (await body(res)).ok === true);
  check('A. извикан е точно един Resend call', calls.length === 1);
  check('A. получателят е hello@genki.bg', calls[0] && calls[0].body.to === 'hello@genki.bg');
  check('A. reply_to е адресът на подателя', calls[0] && calls[0].body.reply_to === 'ivan@primerna.bg');
  check('A. from е верифицираният адрес', calls[0] && calls[0].body.from === 'Genki <hello@genki.bg>');
  check('A. ключът пътува в Authorization', calls[0] && calls[0].headers.Authorization === 'Bearer test-key');

  /* B. валиден EN submit */
  calls = [];
  res = await onRequestPost(ctx(VALID_EN, { env: KEY }));
  check('B. валиден EN submit връща 200 ok', res.status === 200 && (await body(res)).ok === true);
  check('B. езикът EN е отразен', calls[0] && calls[0].body.text.includes('EN'));

  /* C-F. валидационни грешки */
  for (const [label, patch, field] of [
    ['C. липсва име', { name: '' }, 'name'],
    ['D. липсва компания', { company: '' }, 'company'],
    ['E. невалиден email', { email: 'nope' }, 'email'],
    ['F. липсва съобщение', { message: '' }, 'message'],
  ]) {
    calls = [];
    res = await onRequestPost(ctx({ ...VALID_BG, ...patch }, { env: KEY }));
    const b = await body(res);
    check(label + ' → 422', res.status === 422 && b.error === 'validation' && b.fields.includes(field));
    check(label + ' → нищо не се изпраща', calls.length === 0);
  }

  /* G/H. телефон */
  calls = [];
  res = await onRequestPost(ctx({ ...VALID_BG, phone: '' }, { env: KEY }));
  check('G. празен телефон минава', res.status === 200 && calls.length === 1);
  calls = [];
  res = await onRequestPost(ctx({ ...VALID_BG, phone: '0888 123 456' }, { env: KEY }));
  check('H. попълнен телефон минава', res.status === 200 && calls[0].body.text.includes('0888 123 456'));

  /* J. Resend отказва */
  calls = []; globalThis.fetch = mockFetch('fail');
  res = await onRequestPost(ctx(VALID_BG, { env: KEY }));
  const jb = await body(res);
  check('J. отказ от Resend → 502', res.status === 502 && jb.ok === false);
  check('J. няма вътрешна информация в отговора',
    !JSON.stringify(jb).includes('mock failure') && !JSON.stringify(jb).includes('stack'));

  /* K. мрежова грешка */
  globalThis.fetch = mockFetch('throw');
  res = await onRequestPost(ctx(VALID_BG, { env: KEY }));
  check('K. мрежова грешка → 502, без изтичане', res.status === 502 && (await body(res)).error === 'send_failed');

  /* L. honeypot */
  calls = []; globalThis.fetch = mockFetch('ok');
  res = await onRequestPost(ctx({ ...VALID_BG, website: 'http://spam.example' }, { env: KEY }));
  check('L. honeypot → 200 без изпращане', res.status === 200 && (await body(res)).ok === true && calls.length === 0);
  calls = [];
  res = await onRequestPost(ctx({ ...VALID_BG, website: '' }, { env: KEY }));
  check('L. празен honeypot не пречи', res.status === 200 && calls.length === 1);

  /* конфигурация */
  calls = [];
  res = await onRequestPost(ctx(VALID_BG, { env: {} }));
  check('без API ключ НЕ се твърди успех',
    res.status === 500 && (await body(res)).ok === false && calls.length === 0);

  calls = [];
  res = await onRequestPost(ctx(VALID_BG, { env: { ...KEY, CONTACT_TEST_MODE: '1' } }));
  const tb = await body(res);
  check('тестов режим не изпраща, но е явен', tb.ok === true && tb.mode === 'test' && calls.length === 0);

  /* метод и формат */
  res = await onRequest(ctx(VALID_BG, { env: KEY, method: 'GET' }));
  check('GET → 405', res.status === 405);
  res = await onRequest(ctx(VALID_BG, { env: KEY, method: 'PUT' }));
  check('PUT → 405', res.status === 405);

  res = await onRequestPost(ctx(null, { env: KEY, raw: 'broken' }));
  check('счупен JSON → 400', res.status === 400);
  res = await onRequestPost(ctx([1, 2, 3], { env: KEY }));
  check('масив вместо обект → 400', res.status === 400);

  /* rate limiting с подменен KV */
  const store = new Map();
  const kvEnv = {
    ...KEY,
    GENKI_RATE: {
      get: async (k) => store.get(k) || null,
      put: async (k, v) => { store.set(k, v); },
    },
  };
  calls = [];
  let limited = 0;
  for (let i = 0; i < 7; i++) {
    const r = await onRequestPost(ctx(VALID_BG, { env: kvEnv }));
    if (r.status === 429) limited++;
  }
  check('rate limit спира след 5 заявки', limited === 2, 'блокирани: ' + limited);

  const noKv = await onRequestPost(ctx(VALID_BG, { env: KEY }));
  check('без KV binding формата пак работи', noKv.status === 200);

  globalThis.fetch = realFetch;
}

console.log('\n' + '─'.repeat(52));
console.log(`РЕЗУЛТАТ: ${pass} минали, ${fail} паднали`);
if (fail) {
  console.log('\nПаднали:');
  failures.forEach((f) => console.log('  • ' + f));
  process.exit(1);
}
console.log('Нито един реален имейл не е изпратен.');
