// Genki Fit — прогресивно записване и изпращане. Cloudflare Pages Function.
//
// Обслужва се same-origin на POST /api/genki-fit, в СЪЩИЯ deployment като
// сайта — по шаблона на functions/api/contact.js.
//
// ДВЕ ДЕЙСТВИЯ
//   action: 'step'  — човекът е потвърдил стъпка. Записва се сесията и
//                     се праща моментна снимка до hello@genki.bg.
//   action: 'send'  — човекът сам е поискал своя Fit по имейл.
//
// РЕДЪТ Е ВАЖЕН
//   Първо ЗАПИС в D1, после известие. Провалът на Resend никога не
//   отменя вече записани отговори. Имейлът е известие, не хранилище.
//
// ДВА ИДЕНТИФИКАТОРА
//   fit_code      — публичен, човекът го вижда. РЕФЕРЕНЦИЯ, не разрешение.
//   session_token — таен, висока ентропия. Само с него се променя сесия.
//                   Никога не влиза в имейл към клиента и в URL.
//
// Env (променливи на Pages проекта):
//   • GENKI_FIT_DB      — D1 binding. БЕЗ него прогресивният запис е
//                         изключен и функцията го казва честно.
//   • RESEND_API_KEY    — без него не се твърди успех при изпращане.
//   • CONTACT_FROM / CONTACT_TO / CONTACT_TEST_MODE — както при контакта.
//   • GENKI_RATE        — по желание, KV. Два отделни лимита, виж долу.

import { machineTimestamp } from '../../lib/genki-time.js';
import { validateProgressive, recommend } from '../../lib/genki-fit-logic.js';
import {
  newFitCode, buildCustomerEmail, buildInternalEmail, buildStepNotification,
} from '../../lib/genki-fit-email.js';
import {
  newSessionToken, createSession, getSessionByToken, updateSession,
  setCustomerEmail, setNotifyState, sessionSnapshot, STATUS,
} from '../../lib/genki-fit-store.js';

const MAX = { email: 200, company: 160, token: 64 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Две различни неща, два различни лимита.
//   Стъпките пращат писмо само до нас — по-щедър таван, но пак ограничен.
//   Изпращането към клиента тръгва към ПРОИЗВОЛЕН адрес — остава стегнато.
const RATE = {
  step: { key: 'fitstep:', limit: 60, windowS: 600 },
  send: { key: 'fit:',     limit: 5,  windowS: 600 },
};

const NOTIFY_ATTEMPTS = 3;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function clean(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max + 1) : '';
}

function oneLine(v, max = 300) {
  return String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

/* ==========================================================================
   Валидация на нещата, които не са част от препоръчващата логика
   ========================================================================== */

export function validateCompany(raw) {
  const company = clean(raw && raw.company, MAX.company);
  return { ok: !!company && company.length <= MAX.company, company };
}

export function validateDestination(raw) {
  const email = clean(raw && raw.email, MAX.email);
  const lang = (raw && raw.lang) === 'en' ? 'en' : 'bg';
  const errors = [];
  if (!email || !EMAIL_RE.test(email) || email.length > MAX.email) errors.push('email');
  return { ok: errors.length === 0, email, lang, errors };
}

async function rateLimited(env, ip, kind) {
  const cfg = RATE[kind];
  if (!env || !env.GENKI_RATE || !ip) return false;
  try {
    const key = cfg.key + ip;
    const current = parseInt((await env.GENKI_RATE.get(key)) || '0', 10);
    if (current >= cfg.limit) return true;
    await env.GENKI_RATE.put(key, String(current + 1), { expirationTtl: cfg.windowS });
    return false;
  } catch (e) {
    return false;   // проблем с KV никога не бива да блокира истински човек
  }
}

/* ==========================================================================
   Изпращане през Resend
   ========================================================================== */

function sendMail(env, { to, replyTo, subject, text, html }) {
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

/**
 * Краен брой опита за преходни грешки. Без безкраен цикъл и без опашка,
 * каквато архитектурата не носи. Резултатът се записва в сесията, за да
 * се вижда кои известия не са минали.
 *
 * ВАЖНО: това се вика СЛЕД успешен запис. Каквото и да върне, записаните
 * отговори остават.
 */
async function notifyWithRetry(env, db, fitCode, mail) {
  let attempts = 0;
  let lastError = null;

  while (attempts < NOTIFY_ATTEMPTS) {
    attempts++;
    try {
      const res = await sendMail(env, { to: (env && env.CONTACT_TO) || 'hello@genki.bg', ...mail });
      if (res.ok) {
        if (db) await setNotifyState(db, fitCode, { status: 'sent', attempts, error: null });
        return { ok: true, attempts };
      }
      lastError = 'HTTP ' + res.status;
    } catch (e) {
      lastError = (e && e.message) || 'network';
    }
  }

  console.error('Genki Fit: известието не тръгна', fitCode, lastError);
  if (db) await setNotifyState(db, fitCode, { status: 'failed', attempts, error: lastError });
  return { ok: false, attempts, error: lastError };
}

/** Пуска известието на заден план, когато средата го позволява. */
function scheduleNotify(context, promise) {
  if (context && typeof context.waitUntil === 'function') {
    context.waitUntil(promise.catch(() => {}));
    return Promise.resolve();
  }
  return promise.catch(() => {});
}

/* ==========================================================================
   Помощни
   ========================================================================== */

function sessionToAnswers(s) {
  return {
    q1: { cities: s.q1.cities, sofiaOffices: s.q1.sofiaOffices },
    largestOffice: s.largestOffice,
    q2: s.q2, q3: s.q3, q4: s.q4, q5: s.q5, q6: s.q6,
  };
}

const db = (env) => (env && env.GENKI_FIT_DB) || null;

/* ==========================================================================
   ДЕЙСТВИЕ: потвърдена стъпка
   ========================================================================== */

async function handleStep(context, raw) {
  const { request, env } = context;
  const store = db(env);

  const check = validateProgressive(raw, raw.step);
  const companyCheck = validateCompany(raw);

  const errors = check.errors.slice();
  if (!companyCheck.ok) errors.push('company');

  if (!check.ok || !companyCheck.ok) {
    return json({ ok: false, error: 'validation', fields: errors }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (await rateLimited(env, ip, 'step')) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  if (!store) {
    // Честно: без D1 прогресивният запис просто не съществува. НЕ се
    // твърди, че е записано.
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const lang = (raw && raw.lang) === 'en' ? 'en' : 'bg';
  const token = clean(raw && raw.token, MAX.token);

  let session = null;
  let issuedToken = null;      // връща се САМО при създаване на сесията

  if (token) {
    // Обновяване САМО по таен токен. Публичният Genki Fit код никога не
    // дава право да се пипне чужда сесия.
    session = await getSessionByToken(store, token);
    if (!session) return json({ ok: false, error: 'unknown_session' }, 404);

    session = await updateSession(store, token, {
      company: companyCheck.company,
      answers: check.answers,
      step: check.step,
      lang,
      existing: session,
    });
  } else {
    // Първата потвърдена стъпка ражда сесията. Не при зареждане на
    // страницата, не при фокус, не при натискане на клавиш.
    const fitCode = newFitCode();
    issuedToken = newSessionToken();
    session = await createSession(store, {
      fitCode, token: issuedToken,
      company: companyCheck.company,
      answers: check.answers,
      step: check.step,
      lang,
    });
  }

  // ЗАПИСЪТ Е ГОТОВ. Чак сега известие.
  const kind = session.status === STATUS.COMPLETED && check.step >= 6 ? 'completed' : 'step';
  const mail = buildStepNotification(sessionSnapshot(session), kind);

  if (env && env.CONTACT_TEST_MODE !== '1' && env && env.RESEND_API_KEY) {
    await scheduleNotify(context, notifyWithRetry(env, store, session.fitCode, mail));
  }

  return json({
    ok: true,
    code: session.fitCode,
    // Токенът се връща САМО при създаване и живее само в браузъра за
    // тази сесия. rowToSession нарочно не го чете обратно от базата.
    ...(issuedToken ? { token: issuedToken } : {}),
    step: session.lastCompletedStep,
    status: session.status,
  });
}

/* ==========================================================================
   ДЕЙСТВИЕ: клиентът иска своя Fit по имейл
   ========================================================================== */

async function handleSend(context, raw) {
  const { request, env } = context;
  const store = db(env);

  const dest = validateDestination(raw);
  if (!dest.ok) return json({ ok: false, error: 'validation', fields: dest.errors }, 422);

  const token = clean(raw && raw.token, MAX.token);
  if (!token) return json({ ok: false, error: 'unknown_session' }, 404);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (await rateLimited(env, ip, 'send')) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  if (!store) return json({ ok: false, error: 'not_configured' }, 500);

  let session = await getSessionByToken(store, token);
  if (!session) return json({ ok: false, error: 'unknown_session' }, 404);
  if (session.status !== STATUS.COMPLETED) {
    return json({ ok: false, error: 'not_completed' }, 409);
  }

  // Препоръката се смята НАНОВО от записаните отговори.
  const answers = sessionToAnswers(session);
  const rec = recommend(answers);
  if (!rec) return json({ ok: false, error: 'validation', fields: ['q6'] }, 422);

  // Същият код от първата стъпка. Нов НЕ се генерира.
  const code = session.fitCode;

  if (env && env.CONTACT_TEST_MODE === '1') {
    session = await setCustomerEmail(store, token, dest.email);
    return json({ ok: true, mode: 'test', code, email: dest.email });
  }

  if (!env || !env.RESEND_API_KEY) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const customer = buildCustomerEmail(answers, rec, code, dest.lang);

  let customerRes;
  try {
    customerRes = await sendMail(env, { to: dest.email, ...customer });
  } catch (e) {
    customerRes = null;
  }

  if (!customerRes || !customerRes.ok) {
    console.error('Genki Fit: клиентският имейл не тръгна', code,
      customerRes ? customerRes.status : 'network');
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  // Адресът се пази чак след като писмото наистина е тръгнало.
  session = await setCustomerEmail(store, token, dest.email);

  // Genki научава, че клиентът си е поискал Fit-а — същата сесия, същият код.
  const note = buildStepNotification(sessionSnapshot(session), 'customer-sent');
  await scheduleNotify(context, notifyWithRetry(env, store, code, note));

  return json({ ok: true, code, email: dest.email });
}

/* ==========================================================================
   Handler
   ========================================================================== */

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

  // Honeypot. Ботът си мисли, че е минал; нищо не се записва и не се праща.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return json({ ok: true, mode: 'discarded' });
  }

  try {
    if (raw.action === 'send') return await handleSend(context, raw);
    return await handleStep(context, raw);
  } catch (e) {
    console.error('Genki Fit handler error', e && e.message);
    return json({ ok: false, error: 'server_error' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
  });
}
