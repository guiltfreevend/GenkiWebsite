// Genki Fit — изпращане на резултата. Cloudflare Pages Function.
//
// Обслужва се same-origin на POST /api/genki-fit, в СЪЩИЯ deployment като
// сайта — по същия шаблон като functions/api/contact.js. Нарочно НЕ е нов
// Worker и НЕ е нов доставчик.
//
// КАКВО ПРАВИ
//   1. Проверява отговорите наново и смята препоръката НАНОВО.
//   2. Генерира уникален Genki Fit код — на сървъра, случаен.
//   3. Праща ДВА имейла през Resend: един до клиента (брандиран, на
//      неговия език, само публична информация) и един до hello@genki.bg
//      (вътрешния запис). Един и същ код ги свързва.
//
// КОГА СЕ ВИКА
//   Само когато човекът сам поиска „Изпратете ми този Genki Fit".
//   Резултатът НЕ е заключен зад това — вижда се без никакви контактни
//   данни. Следствие: анонимно завършените Fit-ове не стигат до Genki.
//   Това е съзнателно продуктово решение, не пропуск.
//
// Env (променливи на Pages проекта, НИКОГА в репото или в браузъра):
//   • RESEND_API_KEY    — без него функцията отказва да твърди успех.
//   • CONTACT_FROM      — по желание. По подразбиране 'Genki <hello@genki.bg>'.
//   • CONTACT_TO        — по желание. По подразбиране hello@genki.bg.
//   • CONTACT_TEST_MODE — '1' спира реалното изпращане.
//   • GENKI_RATE        — по желание, KV. Ключ с префикс 'fit:'.
//
// ДОВЕРИЕ
//   Клиентът праща само ОТГОВОРИ и email. Препоръката, икономиката,
//   кодът и вътрешният скор се произвеждат тук. Подхвърлена от клиента
//   препоръка или код се игнорират мълчаливо.

import { machineTimestamp } from '../../lib/genki-time.js';
import { validateAnswers, recommend } from '../../lib/genki-fit-logic.js';
import { newFitCode, buildCustomerEmail, buildInternalEmail } from '../../lib/genki-fit-email.js';

const MAX_EMAIL = 200;

// Същото меко правило като на клиента и като при формата за контакт.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RATE_LIMIT = 5;
const RATE_WINDOW_S = 600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function oneLine(v, max = 300) {
  return String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

/**
 * Проверява само получателя. Име, компания и телефон вече НЕ се събират:
 * единственото, което трябва, за да изпратим Fit-а, е адресът.
 */
export function validateDestination(raw) {
  const email = raw && typeof raw.email === 'string'
    ? raw.email.trim().slice(0, MAX_EMAIL + 1) : '';
  const lang = (raw && raw.lang) === 'en' ? 'en' : 'bg';

  const errors = [];
  if (!email || !EMAIL_RE.test(email) || email.length > MAX_EMAIL) errors.push('email');

  return { ok: errors.length === 0, email, lang, errors };
}

async function rateLimited(env, ip) {
  if (!env || !env.GENKI_RATE || !ip) return false;
  try {
    const key = 'fit:' + ip;
    const current = parseInt((await env.GENKI_RATE.get(key)) || '0', 10);
    if (current >= RATE_LIMIT) return true;
    await env.GENKI_RATE.put(key, String(current + 1), { expirationTtl: RATE_WINDOW_S });
    return false;
  } catch (e) {
    return false;   // проблем с KV никога не бива да блокира истински човек
  }
}

function send(env, { to, replyTo, subject, text, html }) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: (env && env.CONTACT_FROM) || 'Genki <hello@genki.bg>',
      to,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject, text, html,
    }),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let raw;
  try {
    raw = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot. Ботът си мисли, че е минал; нищо не се изпраща.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return json({ ok: true, mode: 'discarded' });
  }

  // Q3 се сверява срещу Q2, а Q6 — срещу лентите, които СЪРВЪРЪТ генерира.
  const answersCheck = validateAnswers(raw);
  const dest = validateDestination(raw);

  if (!answersCheck.ok || !dest.ok) {
    return json({
      ok: false,
      error: 'validation',
      fields: answersCheck.errors.concat(dest.errors),
    }, 422);
  }

  const rec = recommend(answersCheck.answers);
  if (!rec) return json({ ok: false, error: 'validation', fields: ['q6'] }, 422);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (await rateLimited(env, ip)) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  // Кодът се ражда ТУК. Каквото клиентът е пратил като код, се игнорира.
  const code = newFitCode();

  const meta = {
    timestamp: machineTimestamp(),        // UTC, за машини
    email: dest.email,
    lang: dest.lang,
    referrer: oneLine(request.headers.get('Referer') || ''),
    utm: oneLine(typeof raw.utm === 'string' ? raw.utm : ''),
  };

  const customer = buildCustomerEmail(answersCheck.answers, rec, code, dest.lang);
  const internal = buildInternalEmail(answersCheck.answers, rec, code, meta);

  if (env && env.CONTACT_TEST_MODE === '1') {
    return json({ ok: true, mode: 'test', code, email: dest.email });
  }

  if (!env || !env.RESEND_API_KEY) {
    // Без ключ НЕ твърдим успех — това би било фалшив success state.
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  try {
    // Вътрешният тръгва пръв, за да не се губи лийд, ако вторият падне.
    // Но успехът се обявява по КЛИЕНТСКИЯ: на него е дадено обещание.
    const [internalRes, customerRes] = await Promise.allSettled([
      send(env, {
        to: (env && env.CONTACT_TO) || 'hello@genki.bg',
        replyTo: dest.email,
        ...internal,
      }),
      send(env, { to: dest.email, ...customer }),
    ]);

    if (internalRes.status !== 'fulfilled' || !internalRes.value.ok) {
      // Не проваля заявката: човекът пак получава своя Fit. Но се вижда
      // в лога, защото значи изгубена видимост за екипа.
      console.error('Genki Fit: вътрешното известие не тръгна', code,
        internalRes.status === 'fulfilled' ? internalRes.value.status : internalRes.reason);
    }

    if (customerRes.status !== 'fulfilled' || !customerRes.value.ok) {
      console.error('Genki Fit: клиентският имейл не тръгна', code,
        customerRes.status === 'fulfilled'
          ? customerRes.value.status + ' ' + await customerRes.value.text()
          : customerRes.reason);
      return json({ ok: false, error: 'send_failed' }, 502);
    }

    return json({ ok: true, code, email: dest.email });
  } catch (e) {
    console.error('Genki Fit handler error', e && e.message);
    return json({ ok: false, error: 'send_failed' }, 502);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
  });
}
