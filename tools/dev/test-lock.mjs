/* ==========================================================================
   Тестове на заключването на сайта.

   Пуска се с:  node tools/dev/test-lock.mjs

   Покрива functions/_middleware.js (гейта) и functions/api/subscribe.js
   (записването) ИЗОЛИРАНО, с подменен fetch. НЕ изпраща нито един реален
   имейл.
   ========================================================================== */

import { onRequest as gate } from '../../functions/_middleware.js';
import { onRequest, onRequestPost, validate, buildEmail } from '../../functions/api/subscribe.js';

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; console.log('  + ' + name); }
  else { fail++; failures.push(name + (detail ? ' - ' + detail : '')); console.log('  ! ' + name + (detail ? ' - ' + detail : '')); }
}

/* ---------- гейт ---------- */

function gctx(path, { env = {}, cookie = '', asset = '<html>coming soon</html>' } = {}) {
  let nexted = false;
  const ctx = {
    request: {
      method: 'GET',
      url: 'https://www.genki.bg' + path,
      headers: { get: (h) => (h.toLowerCase() === 'cookie' ? cookie : null) },
    },
    env: {
      ASSETS: { fetch: async () => new Response(asset, { status: 200 }) },
      ...env,
    },
    next: async () => { nexted = true; return new Response('PASSTHROUGH', { status: 200 }); },
  };
  return { ctx, wasNexted: () => nexted };
}

async function gateOf(path, opts) {
  const { ctx, wasNexted } = gctx(path, opts);
  const res = await gate(ctx);
  return { res, passed: wasNexted(), body: await res.clone().text() };
}

console.log('\n=== ГЕЙТ: какво ОСТАВА достъпно ===');
{
  // Живата система за QR кодове по кутии.
  for (const p of ['/box', '/box-landing', '/box-landing.html', '/box/Accedia/', '/box/GK-0001/index.html', '/box/CMYK.bg/']) {
    const r = await gateOf(p);
    check('box системата минава: ' + p, r.passed && r.res.status === 200);
  }
  // Pages Functions.
  for (const p of ['/api/qr', '/api/contact', '/api/subscribe']) {
    const r = await gateOf(p);
    check('function минава: ' + p, r.passed);
  }
  // Статични активи — по разширение, не по списък с папки.
  for (const p of ['/css/custom.css', '/js/translations.js', '/assets/images/genki_logo.png',
                   '/assets/icons/favicon-32x32.png', '/robots.txt', '/favicon.ico',
                   '/Genki Logo Files/logo.svg', '/some/new/folder/file.woff2']) {
    const r = await gateOf(p);
    check('актив минава: ' + p, r.passed);
  }
  // Правни страници.
  for (const p of ['/privacy', '/privacy.html', '/privacy-en', '/privacy-en.html']) {
    const r = await gateOf(p);
    check('правна страница минава: ' + p, r.passed);
  }
}

console.log('\n=== ГЕЙТ: какво СЕ ЗАКЛЮЧВА ===');
{
  // Префиксът /box НЕ бива да е широко отворена врата.
  for (const p of ['/box-landingX', '/boxes', '/box-secret', '/boxoffice.html']) {
    const r = await gateOf(p);
    check('НЕ е дупка: ' + p, !r.passed && r.res.status === 302, 'status ' + r.res.status);
  }

  for (const p of ['/companies.html', '/companies', '/mission', '/mission.html',
                   '/contact', '/contact.html', '/office', '/office.html',
                   '/products', '/thank-you-contact', '/404.html',
                   '/v2/index.html', '/index-main.html', '/каквото-и-да-е']) {
    const r = await gateOf(p);
    check('заключено: ' + p, !r.passed && r.res.status === 302 && r.res.headers.get('Location') === '/',
      'status ' + r.res.status);
  }
}

console.log('\n=== ГЕЙТ: началото сервира Coming Soon ===');
{
  for (const p of ['/', '/index.html']) {
    const r = await gateOf(p);
    check(p + ' връща 200, не пренасочване', r.res.status === 200);
    check(p + ' сервира coming-soon съдържанието', r.body.includes('coming soon'));
    check(p + ' не сервира пълния сайт', !r.body.includes('PASSTHROUGH'));
    check(p + ' не се кешира', /no-cache/.test(r.res.headers.get('Cache-Control') || ''));
  }
  const r = await gateOf('/coming-soon.html');
  check('самата coming-soon.html е достъпна', r.passed);
}

console.log('\n=== ГЕЙТ: преглед от собственика ===');
{
  const env = { PREVIEW_TOKEN: 's3cret' };

  const noToken = await gateOf('/companies.html', { env });
  check('без ключ страницата пак е заключена', !noToken.passed && noToken.res.status === 302);

  const withQuery = await gateOf('/?preview=s3cret', { env });
  check('верен ключ слага бисквитка', /genki_preview=s3cret/.test(withQuery.res.headers.get('Set-Cookie') || ''));
  check('бисквитката е HttpOnly, Secure, SameSite',
    /HttpOnly/.test(withQuery.res.headers.get('Set-Cookie')) &&
    /Secure/.test(withQuery.res.headers.get('Set-Cookie')) &&
    /SameSite=Lax/.test(withQuery.res.headers.get('Set-Cookie')));
  check('ключът се маха от адреса', !(withQuery.res.headers.get('Location') || '').includes('preview'));

  const wrong = await gateOf('/?preview=wrong', { env });
  check('грешен ключ не отключва', wrong.res.status === 200 && wrong.body.includes('coming soon'));

  const cookied = await gateOf('/companies.html', { env, cookie: 'genki_preview=s3cret' });
  check('с бисквитка пълният сайт се вижда', cookied.passed);

  const homeCookied = await gateOf('/', { env, cookie: 'genki_preview=s3cret' });
  check('с бисквитка началото е пълният сайт', homeCookied.passed);

  const badCookie = await gateOf('/companies.html', { env, cookie: 'genki_preview=nope' });
  check('грешна бисквитка не отключва', !badCookie.passed);

  // Без зададена променлива обходен път не съществува.
  const noEnv = await gateOf('/companies.html', { cookie: 'genki_preview=s3cret' });
  check('без PREVIEW_TOKEN бисквитката е безсилна', !noEnv.passed && noEnv.res.status === 302);
  const noEnvQuery = await gateOf('/?preview=anything');
  check('без PREVIEW_TOKEN ключът в адреса е безсилен', noEnvQuery.body.includes('coming soon'));
}

console.log('\n=== ГЕЙТ: изключване ===');
{
  // Стойността идва от таблото на Cloudflare или от .dev.vars, която я
  // подава с кавичките. Изключвателят трябва да работи и в двата случая.
  for (const v of ['0', '"0"', ' 0 ', 'false', 'FALSE', 'off', 'no']) {
    const off = await gateOf('/companies.html', { env: { COMING_SOON: v } });
    check('COMING_SOON=' + JSON.stringify(v) + ' отключва сайта', off.passed);
  }
  const offHome = await gateOf('/', { env: { COMING_SOON: '0' } });
  check('изключен гейт връща истинското начало', offHome.passed);

  // А нещо друго НЕ бива да отключва по случайност.
  for (const v of ['1', 'true', 'on', '', 'yes']) {
    const on = await gateOf('/companies.html', { env: { COMING_SOON: v } });
    check('COMING_SOON=' + JSON.stringify(v) + ' НЕ отключва', !on.passed);
  }
}

/* ---------- записване ---------- */

let calls = [];
function mockFetch(mode = 'ok') {
  return async (url, opts) => {
    calls.push({ url, body: JSON.parse(opts.body), headers: opts.headers });
    if (mode === 'fail') return { ok: false, status: 500, text: async () => 'mock failure' };
    if (mode === 'throw') throw new Error('network down');
    return { ok: true, status: 200, text: async () => '{}' };
  };
}

function sctx(body, { env = {}, method = 'POST', raw = null, ip = '1.2.3.4' } = {}) {
  return {
    request: {
      method,
      headers: { get: (h) => (h === 'CF-Connecting-IP' ? ip : null) },
      json: async () => { if (raw !== null) throw new Error('bad json'); return body; },
    },
    env,
  };
}

const KEY = { RESEND_API_KEY: 'test-key' };
async function jbody(res) { return JSON.parse(await res.text()); }

console.log('\n=== ЗАПИСВАНЕ: валидация ===');
{
  check('валиден имейл минава', validate({ email: 'ivan@primerna.bg' }).ok);
  check('празно поле пада', validate({ email: '' }).errors.includes('email'));
  check('без маймунско пада', validate({ email: 'ivan.primerna.bg' }).errors.includes('email'));
  check('без домейн пада', validate({ email: 'a@b' }).errors.includes('email'));
  check('твърде дълъг пада', !validate({ email: 'x'.repeat(250) + '@a.bg' }).ok);
  check('интервалите се изрязват', validate({ email: '  ivan@primerna.bg ' }).fields.email === 'ivan@primerna.bg');
  check('непознати полета се изхвърлят', validate({ email: 'a@b.bg', isAdmin: true }).fields.isAdmin === undefined);
  check('непознат език пада към bg', validate({ email: 'a@b.bg', lang: 'de' }).fields.lang === 'bg');
  check('en се запазва', validate({ email: 'a@b.bg', lang: 'en' }).fields.lang === 'en');
}

console.log('\n=== ЗАПИСВАНЕ: имейлът ===');
{
  const meta = { timestamp: '2026-09-20T10:00:00.000Z', referrer: 'https://www.genki.bg/' };
  const evil = validate({ email: 'a@b.bg' });
  evil.fields.email = '<script>alert(1)</script>@b.bg';
  const mail = buildEmail(evil.fields, meta);
  check('HTML от потребителя е екраниран', !mail.html.includes('<script>alert') && mail.html.includes('&lt;script&gt;'));
  const nl = buildEmail({ email: 'a@b.bg\nBcc: evil@x.com', lang: 'bg' }, meta);
  check('нов ред в заглавието е премахнат', !nl.subject.includes('\n'));
  const ok = buildEmail(validate({ email: 'ivan@primerna.bg', lang: 'en' }).fields, meta);
  check('адресът е в текста', ok.text.includes('ivan@primerna.bg'));
  check('езикът е в текста', ok.text.includes('EN'));
  // Часът в имейла е софийски, не суров UTC. 10:00Z през септември е 13:00
  // в София. Суровият момент остава в meta, но не се показва.
  check('часът е софийски, не UTC', ok.text.includes('20.09.2026 г., 13:00 ч. (софийско време)'),
    JSON.stringify((ok.text.match(/Час:.*/) || [])[0]));
  check('суров ISO низ не изтича в имейла',
    !/\d{4}-\d{2}-\d{2}T\d{2}:/.test(ok.text + ok.html));
}

console.log('\n=== ЗАПИСВАНЕ: handler ===');
{
  const realFetch = globalThis.fetch;

  calls = []; globalThis.fetch = mockFetch('ok');
  let res = await onRequestPost(sctx({ email: 'ivan@primerna.bg', lang: 'bg' }, { env: KEY }));
  check('валидно записване връща 200 ok', res.status === 200 && (await jbody(res)).ok === true);
  check('точно едно извикване към Resend', calls.length === 1);
  check('получателят е hello@genki.bg', calls[0].body.to === 'hello@genki.bg');
  check('from е верифицираният адрес', calls[0].body.from === 'Genki <hello@genki.bg>');
  check('reply_to е записалият се', calls[0].body.reply_to === 'ivan@primerna.bg');
  check('ключът пътува в Authorization', calls[0].headers.Authorization === 'Bearer test-key');
  check('заявката отива на Resend', calls[0].url === 'https://api.resend.com/emails');

  calls = [];
  res = await onRequestPost(sctx({ email: 'nope' }, { env: KEY }));
  check('невалиден имейл → 422', res.status === 422 && (await jbody(res)).error === 'validation');
  check('невалиден имейл не праща нищо', calls.length === 0);

  calls = [];
  res = await onRequestPost(sctx({ email: 'a@b.bg', website: 'http://spam.example' }, { env: KEY }));
  check('honeypot → 200 без изпращане', res.status === 200 && (await jbody(res)).ok === true && calls.length === 0);

  calls = [];
  res = await onRequestPost(sctx({ email: 'a@b.bg', website: '' }, { env: KEY }));
  check('празен honeypot не пречи', res.status === 200 && calls.length === 1);

  calls = []; globalThis.fetch = mockFetch('fail');
  res = await onRequestPost(sctx({ email: 'a@b.bg' }, { env: KEY }));
  let b = await jbody(res);
  check('отказ от Resend → 502', res.status === 502 && b.ok === false);
  check('няма вътрешна информация в отговора', !JSON.stringify(b).includes('mock failure'));

  globalThis.fetch = mockFetch('throw');
  res = await onRequestPost(sctx({ email: 'a@b.bg' }, { env: KEY }));
  check('мрежова грешка → 502 без изтичане', res.status === 502 && (await jbody(res)).error === 'send_failed');

  calls = []; globalThis.fetch = mockFetch('ok');
  res = await onRequestPost(sctx({ email: 'a@b.bg' }, { env: {} }));
  check('без API ключ НЕ се твърди успех',
    res.status === 500 && (await jbody(res)).ok === false && calls.length === 0);

  calls = [];
  res = await onRequestPost(sctx({ email: 'a@b.bg' }, { env: { ...KEY, SUBSCRIBE_TEST_MODE: '1' } }));
  b = await jbody(res);
  check('тестов режим не изпраща, но е явен', b.ok === true && b.mode === 'test' && calls.length === 0);

  res = await onRequest(sctx({}, { env: KEY, method: 'GET' }));
  check('GET → 405', res.status === 405);
  res = await onRequest(sctx({}, { env: KEY, method: 'PUT' }));
  check('PUT → 405', res.status === 405);

  res = await onRequestPost(sctx(null, { env: KEY, raw: 'broken' }));
  check('счупен JSON → 400', res.status === 400);
  res = await onRequestPost(sctx([1, 2, 3], { env: KEY }));
  check('масив вместо обект → 400', res.status === 400);

  const store = new Map();
  const kvEnv = { ...KEY, GENKI_RATE: {
    get: async (k) => store.get(k) || null,
    put: async (k, v) => { store.set(k, v); },
  } };
  let limited = 0;
  for (let i = 0; i < 7; i++) {
    const r = await onRequestPost(sctx({ email: 'a@b.bg' }, { env: kvEnv }));
    if (r.status === 429) limited++;
  }
  check('rate limit спира след 5 заявки', limited === 2, 'блокирани: ' + limited);

  const noKv = await onRequestPost(sctx({ email: 'a@b.bg' }, { env: KEY }));
  check('без KV binding записването пак работи', noKv.status === 200);

  globalThis.fetch = realFetch;
}

console.log('\n' + '-'.repeat(52));
console.log('РЕЗУЛТАТ: ' + pass + ' минали, ' + fail + ' паднали');
if (fail) {
  console.log('\nПаднали:');
  failures.forEach((f) => console.log('  * ' + f));
  process.exit(1);
}
console.log('Нито един реален имейл не е изпратен.');
