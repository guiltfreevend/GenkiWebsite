// Genki 2.0 — форма за контакт. Cloudflare Pages Function.
//
// Обслужва се same-origin на POST /api/contact, в СЪЩИЯ deployment като
// сайта — точно както functions/api/qr.js. Нарочно не е нов Worker и не е
// нов доставчик: съществуващият stack вече решава задачата.
//
// Изпраща едно известие през Resend до hello@genki.bg.
//
// Env (променливи на Pages проекта, НИКОГА в репото или в браузъра):
//   • RESEND_API_KEY    — ключ за Resend. Без него функцията отказва да
//                         твърди успех (виж MODE по-долу).
//   • CONTACT_FROM      — по желание. Адрес на изпращача. По подразбиране
//                         'Genki <hello@genki.bg>' — домейнът е верифициран.
//   • CONTACT_TO        — по желание. Получател. По подразбиране hello@genki.bg.
//   • CONTACT_TEST_MODE — '1' спира реалното изпращане и връща
//                         { ok: true, mode: 'test' }. Само за тестове.
//   • GENKI_RATE        — по желание, KV namespace. Ако е вързан, включва
//                         ограничение на честотата по IP. Без него всичко
//                         останало работи.
//
// Контракт:
//   • Приема JSON. Само POST; всичко друго → 405.
//   • Валидира наново на сървъра — клиентската валидация е удобство.
//   • Honeypot: ако е попълнен, отговаря 200 и НЕ праща нищо.
//   • Никога не връща вътрешни грешки или stack trace към браузъра.

const MAX = {
  name: 120,
  company: 160,
  email: 200,
  phone: 40,
  message: 4000,
};

// Същото меко правило като на клиента. По-строгото отхвърля реални адреси.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Ограничение на честотата: 5 заявки от един IP за 10 минути.
const RATE_LIMIT = 5;
const RATE_WINDOW_S = 600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

// Потребителски текст влиза в HTML имейл — екранира се изцяло.
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Заглавието на имейла не бива да носи нови редове — иначе се инжектират
// заглавни полета.
function oneLine(s, max = 120) {
  return String(s || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max + 1);
}

/**
 * Валидира вече изчистен payload.
 * Връща { ok, fields, errors } — errors е списък с имена на полета.
 */
export function validate(raw) {
  const fields = {
    name: clean(raw && raw.name, MAX.name),
    company: clean(raw && raw.company, MAX.company),
    email: clean(raw && raw.email, MAX.email),
    phone: clean(raw && raw.phone, MAX.phone),
    message: clean(raw && raw.message, MAX.message),
    lang: (raw && raw.lang) === 'en' ? 'en' : 'bg',
  };

  const errors = [];
  if (!fields.name) errors.push('name');
  if (!fields.company) errors.push('company');
  if (!fields.email || !EMAIL_RE.test(fields.email)) errors.push('email');
  if (!fields.message) errors.push('message');

  // Над лимита — отрязали сме на max+1, значи е било по-дълго.
  for (const key of ['name', 'company', 'email', 'phone', 'message']) {
    if (fields[key].length > MAX[key]) errors.push(key);
  }

  return { ok: errors.length === 0, fields, errors };
}

async function rateLimited(env, ip) {
  if (!env || !env.GENKI_RATE || !ip) return false;   // няма KV → няма лимит
  try {
    const key = 'contact:' + ip;
    const current = parseInt((await env.GENKI_RATE.get(key)) || '0', 10);
    if (current >= RATE_LIMIT) return true;
    await env.GENKI_RATE.put(key, String(current + 1), { expirationTtl: RATE_WINDOW_S });
    return false;
  } catch (e) {
    return false;   // проблем с KV никога не бива да блокира истински човек
  }
}

export function buildEmail(fields, meta) {
  const subject = `Genki 2.0 Contact Form — ${oneLine(fields.company)}`;

  const rows = [
    ['Име', fields.name],
    ['Компания', fields.company],
    ['Email', fields.email],
    ['Телефон', fields.phone || '—'],
    ['Език на страницата', fields.lang.toUpperCase()],
    ['Получено', meta.timestamp],
  ];

  if (meta.referrer) rows.push(['Referrer', meta.referrer]);
  if (meta.utm) rows.push(['UTM', meta.utm]);

  const text =
    'Източник: Genki 2.0 Contact Form\n\n' +
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    '\n\nСъобщение:\n' + fields.message;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#141c17;max-width:600px;line-height:1.6;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4d5852;">Genki 2.0 Contact Form</p>
  <h2 style="margin:0 0 20px;font-size:20px;color:#1d5329;">${esc(fields.company)}</h2>
  <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
    ${rows.map(([k, v]) => `<tr><td style="color:#4d5852;vertical-align:top;">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join('')}
  </table>
  <h3 style="margin:24px 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4d5852;">Съобщение</h3>
  <div style="white-space:pre-wrap;padding:14px 16px;background:#f0f9f2;border-radius:10px;">${esc(fields.message)}</div>
</div>`;

  return { subject, text, html };
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

  const { ok, fields, errors } = validate(raw);
  if (!ok) {
    return json({ ok: false, error: 'validation', fields: errors }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (await rateLimited(env, ip)) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  const meta = {
    timestamp: new Date().toISOString(),
    // Referrer се взима само ако браузърът вече го е изпратил. Нищо
    // допълнително не се събира „за всеки случай".
    referrer: oneLine(request.headers.get('Referer') || '', 300),
    utm: oneLine(typeof raw.utm === 'string' ? raw.utm : '', 300),
  };

  const { subject, text, html } = buildEmail(fields, meta);

  // Тестов режим: спира реалното изпращане, за да не заливаме пощата при
  // повтарящи се тестове.
  if (env && env.CONTACT_TEST_MODE === '1') {
    return json({ ok: true, mode: 'test' });
  }

  if (!env || !env.RESEND_API_KEY) {
    // Без ключ НЕ твърдим успех — това би било фалшив success state.
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: (env && env.CONTACT_FROM) || 'Genki <hello@genki.bg>',
        to: (env && env.CONTACT_TO) || 'hello@genki.bg',
        reply_to: fields.email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      // Тялото на грешката от Resend остава в лога, не в браузъра.
      console.error('Resend failed', res.status, await res.text());
      return json({ ok: false, error: 'send_failed' }, 502);
    }

    return json({ ok: true });
  } catch (e) {
    console.error('Contact handler error', e && e.message);
    return json({ ok: false, error: 'send_failed' }, 502);
  }
}

// Всичко освен POST се отказва — без да се издава нищо за реализацията.
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
  });
}
