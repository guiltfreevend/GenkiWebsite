// Genki — записване за ранен достъп от Coming Soon страницата.
// Cloudflare Pages Function, same-origin на POST /api/subscribe.
//
// Заменя Formspree (`https://formspree.io/f/mjgokaea`). Причината е проста:
// Formspree е чужд акаунт, чиято доставка не можем да проверим от репото, с
// месечен лимит и с изнасяне на адресите на посетителите навън. Тук пътят е
// същият като на вече живата functions/api/qr.js — собствен deployment,
// собствен Resend, доставка до hello@genki.bg.
//
// Env (променливи на Pages проекта, НИКОГА в репото или в браузъра):
//   • RESEND_API_KEY      — ключ за Resend. Без него функцията отказва да
//                           твърди успех.
//   • SUBSCRIBE_FROM      — по желание. По подразбиране 'Genki <hello@genki.bg>'.
//   • SUBSCRIBE_TO        — по желание. По подразбиране hello@genki.bg.
//   • SUBSCRIBE_TEST_MODE — '1' спира реалното изпращане и връща
//                           { ok: true, mode: 'test' }. Само за тестове.
//   • GENKI_RATE          — по желание, KV namespace. Ако е вързан, включва
//                           ограничение на честотата по IP.
//
// Контракт:
//   • Приема JSON. Само POST; всичко друго → 405.
//   • Валидира наново на сървъра — клиентската валидация е удобство.
//   • Honeypot: ако е попълнен, отговаря 200 и НЕ праща нищо.
//   • Никога не връща вътрешни грешки или stack trace към браузъра.

const MAX_EMAIL = 200;

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

// Взима само познатите полета. Всичко останало се изхвърля мълчаливо —
// нищо от тялото на заявката не се препредава сляпо нататък.
export function validate(payload) {
  const p = payload && typeof payload === 'object' ? payload : {};

  const email = String(p.email == null ? '' : p.email).trim();
  const lang = p.lang === 'en' ? 'en' : 'bg';

  const errors = [];
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) errors.push('email');

  return { ok: errors.length === 0, errors, fields: { email, lang } };
}

export function buildEmail(fields, meta) {
  const subject = ('Genki — ново записване за ранен достъп: ' + fields.email)
    .replace(/[\r\n]+/g, ' ');

  const text = [
    'Ново записване от Coming Soon страницата.',
    '',
    'Имейл:   ' + fields.email,
    'Език:    ' + fields.lang.toUpperCase(),
    'Час:     ' + meta.timestamp,
    'Източник: ' + (meta.referrer || '—'),
  ].join('\n');

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;color:#1f2937;max-width:560px">' +
    '<h2 style="margin:0 0 16px;font-size:18px;color:#1d5329">Ново записване за ранен достъп</h2>' +
    '<table cellpadding="4" cellspacing="0" style="border-collapse:collapse">' +
    '<tr><td style="color:#6b7280">Имейл</td><td><strong><a href="mailto:' + esc(fields.email) + '" style="color:#218336">' + esc(fields.email) + '</a></strong></td></tr>' +
    '<tr><td style="color:#6b7280">Език</td><td>' + esc(fields.lang.toUpperCase()) + '</td></tr>' +
    '<tr><td style="color:#6b7280">Час</td><td>' + esc(meta.timestamp) + '</td></tr>' +
    '<tr><td style="color:#6b7280">Източник</td><td>' + esc(meta.referrer || '—') + '</td></tr>' +
    '</table>' +
    '<p style="margin:18px 0 0;color:#6b7280;font-size:12px">Изпратено от Coming Soon страницата на www.genki.bg</p>' +
    '</div>';

  return { subject, text, html };
}

async function rateLimited(env, ip) {
  if (!env || !env.GENKI_RATE || !ip) return false;
  try {
    const key = 'sub:' + ip;
    const raw = await env.GENKI_RATE.get(key);
    const n = raw ? parseInt(raw, 10) || 0 : 0;
    if (n >= RATE_LIMIT) return true;
    await env.GENKI_RATE.put(key, String(n + 1), { expirationTtl: RATE_WINDOW_S });
    return false;
  } catch (_) {
    // KV проблем не бива да блокира записването.
    return false;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot. Ботът вижда празно поле и го попълва; човек — не.
  // Отговаряме 200, за да не му подскажем, но не изпращаме нищо.
  if (String(payload.website || '').trim() !== '') {
    return json({ ok: true, mode: 'discarded' });
  }

  const v = validate(payload);
  if (!v.ok) return json({ ok: false, error: 'validation', fields: v.errors }, 422);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (await rateLimited(env, ip)) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  if (env && env.SUBSCRIBE_TEST_MODE === '1') {
    return json({ ok: true, mode: 'test' });
  }

  // Без ключ НЕ твърдим успех — по-добре честна грешка, отколкото адрес,
  // който човекът мисли за записан, а никъде не е стигнал.
  if (!env || !env.RESEND_API_KEY) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const mail = buildEmail(v.fields, {
    timestamp: new Date().toISOString(),
    referrer: request.headers.get('Referer') || '',
  });

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: (env && env.SUBSCRIBE_FROM) || 'Genki <hello@genki.bg>',
        to: (env && env.SUBSCRIBE_TO) || 'hello@genki.bg',
        reply_to: v.fields.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
    });

    if (!res.ok) {
      // Подробностите отиват в лога, не към браузъра.
      console.error('subscribe: resend rejected', res.status, await res.text());
      return json({ ok: false, error: 'send_failed' }, 502);
    }
  } catch (err) {
    console.error('subscribe: send threw', err && err.message);
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
