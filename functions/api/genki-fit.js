// Genki Fit — заявка от инструмента. Cloudflare Pages Function.
//
// Обслужва се same-origin на POST /api/genki-fit, в СЪЩИЯ deployment като
// сайта — по същия шаблон като functions/api/contact.js. Нарочно НЕ е нов
// Worker и НЕ е нов доставчик: съществуващият stack вече решава задачата.
//
// Изпраща едно известие през Resend до hello@genki.bg.
//
// Env (променливи на Pages проекта, НИКОГА в репото или в браузъра):
//   • RESEND_API_KEY    — ключ за Resend. Без него функцията отказва да
//                         твърди успех.
//   • CONTACT_FROM      — по желание. По подразбиране 'Genki <hello@genki.bg>'.
//   • CONTACT_TO        — по желание. По подразбиране hello@genki.bg.
//   • CONTACT_TEST_MODE — '1' спира реалното изпращане.
//   • GENKI_RATE        — по желание, KV namespace. Ключът е с префикс
//                         'fit:', отделен от този на формата за контакт.
//
// ДОВЕРИЕ
//   Клиентът праща само ОТГОВОРИ. Препоръката, икономиката и вътрешният
//   скор се смятат НАНОВО тук, от lib/genki-fit-logic.js. Ако клиентът
//   подхвърли своя препоръка, тя се игнорира мълчаливо.

import { formatSofiaDateTime, machineTimestamp } from '../../lib/genki-time.js';
import { validateAnswers, recommend, attendanceBounds } from '../../lib/genki-fit-logic.js';

const MAX = { name: 120, company: 160, email: 200, phone: 40, fitId: 40 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Същото правило като при формата за контакт: 5 заявки от IP за 10 минути.
const RATE_LIMIT = 5;
const RATE_WINDOW_S = 600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function oneLine(s, max = 120) {
  return String(s || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max + 1);
}

/* ==========================================================================
   Етикети за ВЪТРЕШНИЯ имейл.
   Само български — имейлът отива при екипа на Genki, не при клиента.
   Тук е единственото място, където вътрешните имена Mini/Single/Duo са
   допустими: този текст никога не стига до посетителя.
   ========================================================================== */

const L = {
  city: { sofia: 'София', plovdiv: 'Пловдив', varna: 'Варна', burgas: 'Бургас', other: 'Други градове' },
  offices: { '1': '1', '2': '2', '3plus': '3+' },
  q2: {
    'lte50': 'До 50', '51-100': '51–100', '101-150': '101–150', '151-300': '151–300',
    '301-500': '301–500', '501-999': '501–999', '1000+': '1 000+',
  },
  q3: {
    'lt25': 'под 25', '25-49': '25–49', '50': '50', 'lt50': 'под 50', '50-74': '50–74',
    '75-99': '75–99', '75-100': '75–100', '75-149': '75–149', '75-199': '75–199',
    '100-150': '100–150', '150-199': '150–199', '200-300': '200–300', '200-349': '200–349',
    '200-399': '200–399', '200-499': '200–499', '350-500': '350–500', '400-699': '400–699',
    '500-999': '500–999', '700-999': '700–999', '1000+': '1 000+',
  },
  q4: {
    canteen: 'Столова / catering', vending: 'Vending', fruit: 'Плодове / snacks',
    other: 'Друго решение', none: 'Нищо постоянно',
  },
  q5: {
    benefit: 'По-силен ежедневен benefit', 'price-support': 'По-добри цени (Price Support)',
    both: 'И двете', unsure: 'Още не сме сигурни',
  },
  hardware: {
    mini: 'Mini (вероятен кандидат)', single: 'Single (вероятен кандидат)',
    duo: 'Duo (вероятен кандидат)', multi: 'Няколко точки / комбинация (вероятен кандидат)',
  },
  approach: {
    core: 'Genki', benefit: 'Genki + Benefit', 'price-support': 'Genki + Price Support',
    both: 'Genki + Benefit + Price Support', custom: 'Custom / консултация',
  },
  reason: {
    'benefit-fits': 'бюджетът покрива Benefit',
    'benefit-only-ps-later': 'Benefit се побира, PS не — PS може да се добави по-късно',
    'both-fit': 'бюджетът покрива Benefit и ниво PS',
    'ps-fits': 'бюджетът покрива ниво PS',
    'zero-budget-core': '€0 бюджет при посещаемост ≥50 — базов Genki',
    'zero-budget-small': '€0 бюджет при малка посещаемост',
    'ps-below': 'бюджетът не стига и за 10% PS',
    'benefit-not-covered': 'бюджетът не покрива Benefit котвата',
    'benefit-custom': 'Q2 501+ — Benefit е custom, без публична цена',
    'open-ended': 'отворена посещаемост — детерминирана препоръка не е възможна',
    'budget-unknown': 'бюджетът не е посочен',
    ambiguous: 'нееднозначен профил',
  },
};

const money = (n) => '€' + Math.round(n).toLocaleString('en-US');

function budgetLabel(b) {
  if (!b || b.kind === 'notsure') return 'не е посочен';
  if (b.max === null) return money(b.min) + '+';
  if (b.min === b.max) return money(b.min);
  return money(b.min) + '–' + money(b.max);
}

/* ==========================================================================
   Валидация на лийда (отговорите се валидират в logic модула)
   ========================================================================== */

export function validateLead(raw) {
  const fields = {
    name: clean(raw && raw.name, MAX.name),
    company: clean(raw && raw.company, MAX.company),
    email: clean(raw && raw.email, MAX.email),
    phone: clean(raw && raw.phone, MAX.phone),
    fitId: clean(raw && raw.fitId, MAX.fitId),
    lang: (raw && raw.lang) === 'en' ? 'en' : 'bg',
  };

  const errors = [];
  if (!fields.email || !EMAIL_RE.test(fields.email)) errors.push('email');
  if (!fields.name) errors.push('name');
  if (!fields.company) errors.push('company');
  for (const key of ['name', 'company', 'email', 'phone']) {
    if (fields[key].length > MAX[key]) errors.push(key);
  }

  return { ok: errors.length === 0, fields, errors };
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
    return false;
  }
}

/* ==========================================================================
   Имейлът към екипа на Genki
   ========================================================================== */

export function buildFitEmail(answers, rec, lead, meta) {
  const bounds = attendanceBounds(answers.q3);
  const score = rec.internal.score;

  const subject = `Genki Fit — ${oneLine(lead.company)} · ${L.approach[rec.approach]}`;

  const cities = answers.q1.cities.map((c) => L.city[c]).join(', ');
  const psText = rec.psLevel ? rec.psLevel + '%' : '—';
  const budgetText = rec.employerBudget
    ? (rec.employerBudget.approx ? '≈ ' : '') + money(rec.employerBudget.amount)
    : '—';

  const rows = [
    ['Genki Fit ID', meta.fitId || '—'],
    ['Име', lead.name],
    ['Компания', lead.company],
    ['Email', lead.email],
    ['Телефон', lead.phone || '—'],
    ['Език на страницата', meta.lang.toUpperCase()],
    ['Получено', formatSofiaDateTime(meta.timestamp, 'bg', { suffix: true })],
  ];

  const answerRows = [
    ['Q1 · Градове', cities],
    ['Q1 · Офиси в София', answers.q1.sofiaOffices ? L.offices[answers.q1.sofiaOffices] : '—'],
    ['Q2 · Общо служители', L.q2[answers.q2]],
    ['Q2 · В най-големия офис', answers.largestOffice ? L.q2[answers.largestOffice] : '—'],
    ['Q3 · Дневна посещаемост', L.q3[answers.q3]],
    ['Q3 · attendanceMin / Max', bounds.min + ' / ' + (bounds.max === null ? 'отворен край' : bounds.max)],
    ['Q4 · В офиса сега', answers.q4.map((v) => L.q4[v]).join(', ')],
    ['Q5 · Желана стойност', L.q5[answers.q5]],
    ['Q6 · Бюджет', budgetLabel(rec.budget)],
  ];

  const internalRows = [
    ['Изход', rec.outcome === 'recommendation' ? 'Препоръка' : 'Мека консултация'],
    ['Конфигурация', L.approach[rec.approach]],
    ['Хардуер', L.hardware[rec.hardware]],
    ['Price Support', psText],
    ['Показан бюджет', budgetText],
    ['Причина', L.reason[rec.reason] || rec.reason],
    ['Прогнозни продажби', rec.internal.salesMax === null
      ? money(rec.internal.salesMin) + '+ (отворен край)'
      : money(rec.internal.salesMin) + ' – ' + money(rec.internal.salesMax)],
    ['Скор', score ? score.total + ' / 100 · ' + score.tier + (score.complete ? '' : ' (частичен)') : '—'],
  ];

  if (meta.referrer) internalRows.push(['Referrer', meta.referrer]);
  if (meta.utm) internalRows.push(['UTM', meta.utm]);

  const block = (title, rs) =>
    title + '\n' + rs.map(([k, v]) => `  ${k}: ${v}`).join('\n');

  const text =
    'Източник: Genki Fit\n\n' +
    block('ЛИЙД', rows) + '\n\n' +
    block('ОТГОВОРИ', answerRows) + '\n\n' +
    block('ВЪТРЕШНО — не се показва на клиента', internalRows) + '\n\n' +
    'Прогнозните числа са вътрешно допускане за V1, не гарантиран оборот.';

  const table = (rs) =>
    `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;">${
      rs.map(([k, v]) => `<tr><td style="color:#4d5852;vertical-align:top;">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join('')
    }</table>`;

  const h3 = (s) => `<h3 style="margin:24px 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4d5852;">${s}</h3>`;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#141c17;max-width:640px;line-height:1.6;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4d5852;">Genki Fit</p>
  <h2 style="margin:0 0 20px;font-size:20px;color:#1d5329;">${esc(lead.company)}</h2>
  ${table(rows)}
  ${h3('Отговори')}
  ${table(answerRows)}
  ${h3('Вътрешно — не се показва на клиента')}
  ${table(internalRows)}
  <p style="margin:20px 0 0;font-size:12px;color:#4d5852;">Прогнозните числа са вътрешно допускане за V1, не гарантиран оборот.</p>
</div>`;

  return { subject, text, html };
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

  // Honeypot. Ботът си мисли, че е минал; нищо не се изпраща.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return json({ ok: true, mode: 'discarded' });
  }

  // Отговорите се проверяват наново: Q3 срещу Q2, Q6 срещу лентите, които
  // СЪРВЪРЪТ генерира. Клиент не може да си избере несъществуващ бюджет.
  const answersCheck = validateAnswers(raw);
  const leadCheck = validateLead(raw);

  if (!answersCheck.ok || !leadCheck.ok) {
    return json({
      ok: false,
      error: 'validation',
      fields: answersCheck.errors.concat(leadCheck.errors),
    }, 422);
  }

  // Препоръката се смята ТУК. Каквото клиентът е пратил, се игнорира.
  const rec = recommend(answersCheck.answers);
  if (!rec) return json({ ok: false, error: 'validation', fields: ['q6'] }, 422);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (await rateLimited(env, ip)) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  const meta = {
    timestamp: machineTimestamp(),          // UTC, само за машини
    fitId: leadCheck.fields.fitId,
    lang: leadCheck.fields.lang,
    referrer: oneLine(request.headers.get('Referer') || '', 300),
    utm: oneLine(typeof raw.utm === 'string' ? raw.utm : '', 300),
  };

  const { subject, text, html } = buildFitEmail(answersCheck.answers, rec, leadCheck.fields, meta);

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
        reply_to: leadCheck.fields.email,
        subject, text, html,
      }),
    });

    if (!res.ok) {
      console.error('Resend failed', res.status, await res.text());
      return json({ ok: false, error: 'send_failed' }, 502);
    }

    // Нарочно нищо вътрешно в отговора: браузърът вече е показал резултата.
    return json({ ok: true });
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
