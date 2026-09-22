// Genki Fit — уникалният код и двата имейла.
//
// ДВА ИМЕЙЛА, ЕДИН КОД
//   • до клиента — брандиран HTML, на неговия език, само публична
//     информация;
//   • до hello@genki.bg — вътрешният запис с всичко.
//   Един и същ Genki Fit код ги свързва.
//
// ЗАЩО КОПИЕ НА НИЗОВЕТЕ ТУК
//   `js/genki-translations.js` присвоява на `window` и не може да се чете
//   в Cloudflare Worker — там няма файлова система и `new Function` е
//   блокиран. Затова изреченията, които влизат и в страницата, и в
//   имейла, стоят и тук. Дрейфът е закован с тест: `test-genki-fit.mjs`
//   сверява всеки такъв ключ дума по дума срещу `genki-translations.js`
//   и пада, ако се разминат.

import { attendanceBounds } from './genki-fit-logic.js';
import { formatSofiaDateTime } from './genki-time.js';

/* ==========================================================================
   1. GENKI FIT КОД
   ========================================================================== */

// Без O, 0, I, 1, L и U — най-често бърканите на глас и на ръка.
// Остават 30 знака; GF-XXXX-XXXX дава 30^8 ≈ 6,5 × 10^11 възможности.
export const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
export const CODE_PATTERN = /^GF-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}$/;

/**
 * Генерира се на СЪРВЪРА и е случаен. Нарочно НЕ е нарастващ брояч:
 * предсказуем идентификатор издава обем и позволява налучкване.
 * Не носи нито една лична данна.
 */
export function newFitCode(randomSource) {
  const n = 8;
  let bytes;

  const src = randomSource || (typeof crypto !== 'undefined' && crypto.getRandomValues
    ? (arr) => crypto.getRandomValues(arr)
    : null);

  if (src) {
    bytes = new Uint8Array(n);
    src(bytes);
  } else {
    bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 256);
  }

  let out = '';
  for (let i = 0; i < n; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    if (i === 3) out += '-';
  }
  return 'GF-' + out;
}

/* ==========================================================================
   2. НИЗОВЕ

   Ключовете съвпадат едно към едно с js/genki-translations.js. Тестът
   ги сверява — не се редактират само на едно място.
   ========================================================================== */

export const SHARED = {
  'fit.result.c1': { bg: 'Вашият Genki', en: 'Your Genki' },
  'fit.result.c2': { bg: 'Нашата препоръка', en: 'Our recommendation' },
  'fit.result.c3': { bg: 'Защо това е подходящо за вас', en: 'Why this fits your team' },
  'fit.result.caveat': {
    bg: 'Вероятна конфигурация. Точният вариант се потвърждава след кратък оглед на офиса.',
    en: 'A likely configuration. The exact setup is confirmed after a short look at your workplace.' },
  'fit.result.budget': { bg: 'Месечен бюджет на компанията', en: 'Monthly company budget' },

  'fit.hw.mini':   { bg: 'Компактен Genki за офиса ви', en: 'A compact Genki for your workplace' },
  'fit.hw.single': { bg: 'Един Genki smart cooler', en: 'One Genki smart cooler' },
  'fit.hw.duo':    { bg: 'Genki setup за по-голям офис', en: 'A Genki setup for a larger workplace' },
  'fit.hw.multi':  { bg: 'Genki на няколко точки в офиса', en: 'A multi-point Genki setup' },

  'fit.ap.core':          { bg: 'Genki', en: 'Genki' },
  'fit.ap.benefit':       { bg: 'Genki + Benefit', en: 'Genki + Benefit' },
  'fit.ap.price-support': { bg: 'Genki + Price Support', en: 'Genki + Price Support' },
  'fit.ap.both':          { bg: 'Genki + Benefit + Price Support', en: 'Genki + Benefit + Price Support' },

  'fit.why.attendance': {
    bg: 'При {range} души на място в нормален ден този размер Genki обикновено е правилният.',
    en: 'With {range} people on site on a normal day, this is usually the right size of Genki.' },
  'fit.why.coexist': {
    bg: 'Genki не замества това, което вече имате — работи заедно с него и добавя повече за екипа.',
    en: 'Genki doesn’t replace what you already have — it works alongside it and adds more for your team.' },
  'fit.why.fresh': {
    bg: 'В офиса няма нищо постоянно в момента, така че Genki започва от чисто и не измества нищо.',
    en: 'There’s nothing permanent at the office right now, so Genki starts fresh without displacing anything.' },
  'fit.why.benefit': {
    bg: 'Искате по-силен ежедневен benefit, а бюджетът ви покрива точно този слой.',
    en: 'You want a stronger everyday benefit, and your budget covers exactly that layer.' },
  'fit.why.ps': {
    bg: 'Искате по-добри цени за екипа и бюджетът ви позволява реална подкрепа на всяка покупка.',
    en: 'You want better prices for your team, and your budget supports a real contribution on every purchase.' },
  'fit.why.both': {
    bg: 'Бюджетът ви стига и за Benefit слоя, и за подкрепа на цените едновременно.',
    en: 'Your budget covers both the Benefit layer and price support at the same time.' },
  'fit.why.pslater': {
    bg: 'Започваме с Benefit слоя, а подкрепата на цените може да се добави по-късно.',
    en: 'We start with the Benefit layer, and price support can be added later.' },
  'fit.why.core': {
    bg: 'Genki може да работи и без месечна такса за компанията при подходящи локации.',
    en: 'For suitable locations, Genki can work with no monthly company fee.' },
  'fit.why.unsure': {
    bg: 'Още не сте решили каква форма искате — затова предлагаме тази, която пасва на бюджета ви.',
    en: 'You haven’t decided on a format yet, so we’re suggesting the one that fits your budget.' },

  'fit.soft.title': { bg: 'Нека намерим правилния Genki за вашия екип',
                      en: 'Let’s find the right Genki for your team' },
  'fit.soft.p1': {
    bg: 'Вашият офис има малко по-различен профил и не искаме автоматично да ви препоръчаме конфигурация, която може да не е най-подходящата.',
    en: 'Your workplace has a slightly different profile, and we don’t want to automatically recommend a setup that may not be the right one.' },
  'fit.soft.p2': {
    bg: 'Нека разгледаме случая ви заедно и да намерим Genki вариант, който има смисъл за вашия екип и начина, по който работите.',
    en: 'Let’s look at it together and find a Genki setup that makes sense for your team and the way you work.' },
};

/** Низове само за имейла — нямат аналог в страницата. */
export const EMAIL_ONLY = {
  'subject':      { bg: 'Вашият Genki Fit — {code}', en: 'Your Genki Fit — {code}' },
  'preheader':    { bg: 'Ето как бихме изградили Genki за вашия офис.',
                    en: 'Here’s how we would build Genki for your workplace.' },
  'label':        { bg: 'GENKI FIT', en: 'GENKI FIT' },
  'title':        { bg: 'Вашият Genki Fit', en: 'Your Genki Fit' },
  'code.label':   { bg: 'Вашият код', en: 'Your code' },
  'intro':        { bg: 'Благодарим, че отделихте минута. Ето какво бихме направили за вашия офис — и защо.',
                    en: 'Thank you for taking a minute. Here’s what we would build for your workplace — and why.' },
  'office':       { bg: 'Вашият офис', en: 'Your workplace' },
  'office.cities':{ bg: 'Градове', en: 'Cities' },
  'office.size':  { bg: 'Служители', en: 'Employees' },
  'office.att':   { bg: 'На място в нормален ден', en: 'On site on a normal day' },
  'office.now':   { bg: 'В офиса в момента', en: 'At the office right now' },
  'office.budget':{ bg: 'Посочен месечен бюджет', en: 'Monthly budget you selected' },
  'budget.notsure': { bg: 'още не е определен', en: 'not decided yet' },
  'ps':           { bg: 'Препоръчана подкрепа на цената: {pct}%', en: 'Recommended price support: {pct}%' },
  'final':        { bg: 'Точната конфигурация се потвърждава спрямо реалното пространство — етажи, зони и това къде хората минават най-често.',
                    en: 'The exact setup is confirmed against the real space — floors, zones and where people actually pass by.' },
  'keep':         { bg: 'Запазете този код. Ако се свържете с нас по-късно, кажете ни го и ще знаем точно откъде да продължим.',
                    en: 'Keep this code. If you get in touch later, just mention it and we’ll know exactly where to pick up.' },
  'contact':      { bg: 'Имате въпрос? Пишете ни на hello@genki.bg.',
                    en: 'Have a question? Write to us at hello@genki.bg.' },
  'tagline':      { bg: 'По-добрата храна има място в офиса.', en: 'Better food belongs at work.' },
};

const LABELS = {
  city: {
    sofia:   { bg: 'София', en: 'Sofia' },
    plovdiv: { bg: 'Пловдив', en: 'Plovdiv' },
    varna:   { bg: 'Варна', en: 'Varna' },
    burgas:  { bg: 'Бургас', en: 'Burgas' },
    other:   { bg: 'Други градове', en: 'Other cities' },
  },
  q2: {
    'lte50':   { bg: 'До 50', en: 'Up to 50' },
    '51-100':  { bg: '51–100', en: '51–100' },
    '101-150': { bg: '101–150', en: '101–150' },
    '151-300': { bg: '151–300', en: '151–300' },
    '301-500': { bg: '301–500', en: '301–500' },
    '501-999': { bg: '501–999', en: '501–999' },
    '1000+':   { bg: '1,000+', en: '1,000+' },
  },
  q3: {
    'lt25': { bg: 'под 25', en: 'under 25' }, 'lt50': { bg: 'под 50', en: 'under 50' },
    '25-49': { bg: '25–49', en: '25–49' }, '50': { bg: '50', en: '50' },
    '50-74': { bg: '50–74', en: '50–74' }, '75-99': { bg: '75–99', en: '75–99' },
    '75-100': { bg: '75–100', en: '75–100' }, '75-149': { bg: '75–149', en: '75–149' },
    '75-199': { bg: '75–199', en: '75–199' }, '100-150': { bg: '100–150', en: '100–150' },
    '150-199': { bg: '150–199', en: '150–199' }, '200-300': { bg: '200–300', en: '200–300' },
    '200-349': { bg: '200–349', en: '200–349' }, '200-399': { bg: '200–399', en: '200–399' },
    '200-499': { bg: '200–499', en: '200–499' }, '350-500': { bg: '350–500', en: '350–500' },
    '400-699': { bg: '400–699', en: '400–699' }, '500-999': { bg: '500–999', en: '500–999' },
    '700-999': { bg: '700–999', en: '700–999' }, '1000+': { bg: '1,000+', en: '1,000+' },
  },
  q4: {
    canteen: { bg: 'Столова / catering', en: 'Canteen / catering' },
    vending: { bg: 'Vending', en: 'Vending' },
    fruit:   { bg: 'Плодове / snacks', en: 'Fruit / snacks' },
    other:   { bg: 'Друго решение', en: 'Another solution' },
    none:    { bg: 'Нищо постоянно', en: 'Nothing permanent' },
  },
};

/* ==========================================================================
   3. Помощни
   ========================================================================== */

const L = (lang) => (lang === 'en' ? 'en' : 'bg');

function s(table, key, lang, vars) {
  const entry = table[key];
  let out = entry ? entry[L(lang)] : '';
  if (vars) out = out.replace(/\{([a-z]+)\}/gi, (m, n) =>
    Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : m);
  return out;
}

export const t = (key, lang, vars) => s(SHARED, key, lang, vars);
export const te = (key, lang, vars) => s(EMAIL_ONLY, key, lang, vars);

export function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export const money = (n) => '€' + Math.round(n).toLocaleString('en-US');

function lowerFirst(str) {
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}

export function budgetLabel(band, lang) {
  if (!band || band.kind === 'notsure') return te('budget.notsure', lang);
  if (band.max === null) return money(band.min) + '+';
  if (band.min === band.max) return money(band.min);
  return money(band.min) + '–' + money(band.max);
}

/** Същите 2–3 изречения, които човекът вече е видял на екрана. */
export function reasons(answers, rec, lang) {
  const list = [t('fit.why.attendance', lang, {
    range: lowerFirst(LABELS.q3[answers.q3] ? LABELS.q3[answers.q3][L(lang)] : answers.q3),
  })];

  if (answers.q5 === 'unsure') list.push(t('fit.why.unsure', lang));
  else list.push(answers.q4.indexOf('none') !== -1
    ? t('fit.why.fresh', lang) : t('fit.why.coexist', lang));

  if (rec.approach === 'both') list.push(t('fit.why.both', lang));
  else if (rec.approach === 'benefit') {
    list.push(rec.reason === 'benefit-only-ps-later'
      ? t('fit.why.pslater', lang) : t('fit.why.benefit', lang));
  } else if (rec.approach === 'price-support') list.push(t('fit.why.ps', lang));
  else if (rec.approach === 'core') list.push(t('fit.why.core', lang));

  return list.slice(0, 3);
}

/* ==========================================================================
   4. ИМЕЙЛЪТ ДО КЛИЕНТА

   Табличен layout и inline стилове — това е, което имейл клиентите
   рендират надеждно. Без JS, без външни изображения (повечето клиенти
   ги блокират по подразбиране и логото щеше да е празен квадрат), без
   експериментален CSS. Wordmark-ът е текст в брандовото зелено.
   ========================================================================== */

const GREEN = '#1d5329';
const ACCENT = '#218336';
const INK = '#141c17';
const MUTED = '#4d5852';
const TINT = '#f0f9f2';
const BORDER = '#e3e8e4';

export function buildCustomerEmail(answers, rec, code, lang) {
  const lg = L(lang);
  const subject = te('subject', lg, { code });

  const soft = rec.outcome === 'consultation';
  const bounds = attendanceBounds(answers.q3);

  const officeRows = [
    [te('office.cities', lg), answers.q1.cities.map((c) => LABELS.city[c][lg]).join(', ')],
    [te('office.size', lg), LABELS.q2[answers.q2][lg]],
    [te('office.att', lg), LABELS.q3[answers.q3][lg]],
    [te('office.now', lg), answers.q4.map((v) => LABELS.q4[v][lg]).join(', ')],
    [te('office.budget', lg), budgetLabel(rec.budget, lg)],
  ];

  const why = soft ? [] : reasons(answers, rec, lg);

  /* --- текстовата версия --------------------------------------------- */
  const textLines = [
    te('title', lg),
    te('code.label', lg) + ': ' + code,
    '',
    te('intro', lg),
    '',
    te('office', lg),
    ...officeRows.map(([k, v]) => '  ' + k + ': ' + v),
    '',
  ];

  if (soft) {
    textLines.push(t('fit.soft.title', lg), '', t('fit.soft.p1', lg), '', t('fit.soft.p2', lg), '');
  } else {
    textLines.push(
      t('fit.result.c1', lg) + ': ' + t('fit.hw.' + rec.hardware, lg),
      t('fit.result.c2', lg) + ': ' + t('fit.ap.' + rec.approach, lg)
    );
    if (rec.psLevel) textLines.push('  ' + te('ps', lg, { pct: rec.psLevel }));
    if (rec.employerBudget) {
      textLines.push('  ' + t('fit.result.budget', lg) + ': ' +
        (rec.employerBudget.approx ? '≈ ' : '') + money(rec.employerBudget.amount));
    }
    textLines.push('', t('fit.result.c3', lg), ...why.map((w) => '  • ' + w), '');
  }

  textLines.push(te('final', lg), '', te('keep', lg), '', te('code.label', lg) + ': ' + code,
    '', te('contact', lg));

  const text = textLines.join('\n');

  /* --- HTML ------------------------------------------------------------ */
  const row = (k, v) =>
    `<tr><td style="padding:6px 16px 6px 0;color:${MUTED};font-size:14px;vertical-align:top;">${esc(k)}</td>` +
    `<td style="padding:6px 0;color:${INK};font-size:14px;font-weight:600;">${esc(v)}</td></tr>`;

  const h2 = (txt) =>
    `<p style="margin:32px 0 10px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${esc(txt)}</p>`;

  const resultBlock = soft
    ? `<h2 style="margin:24px 0 12px;font-size:22px;line-height:1.25;color:${GREEN};">${esc(t('fit.soft.title', lg))}</h2>
       <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${INK};">${esc(t('fit.soft.p1', lg))}</p>
       <p style="margin:0;font-size:15px;line-height:1.6;color:${INK};">${esc(t('fit.soft.p2', lg))}</p>`
    : `${h2(t('fit.result.c1', lg))}
       <p style="margin:0;font-size:20px;font-weight:700;line-height:1.3;color:${INK};">${esc(t('fit.hw.' + rec.hardware, lg))}</p>
       <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:${MUTED};">${esc(t('fit.result.caveat', lg))}</p>

       <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:24px;background:${TINT};border-radius:12px;">
         <tr><td style="padding:20px 22px;">
           <p style="margin:0 0 8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${esc(t('fit.result.c2', lg))}</p>
           <p style="margin:0;font-size:20px;font-weight:700;line-height:1.3;color:${GREEN};">${esc(t('fit.ap.' + rec.approach, lg))}</p>
           ${rec.psLevel ? `<p style="margin:10px 0 0;font-size:14px;font-weight:600;color:${GREEN};">${esc(te('ps', lg, { pct: rec.psLevel }))}</p>` : ''}
           ${rec.employerBudget ? `<p style="margin:14px 0 0;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${esc(t('fit.result.budget', lg))}</p>
           <p style="margin:2px 0 0;font-size:24px;font-weight:700;color:${GREEN};">${rec.employerBudget.approx ? '≈ ' : ''}${esc(money(rec.employerBudget.amount))}</p>` : ''}
         </td></tr>
       </table>

       ${h2(t('fit.result.c3', lg))}
       ${why.map((w) => `<p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:${INK};">• ${esc(w)}</p>`).join('')}`;

  const html = `<!DOCTYPE html>
<html lang="${lg}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f7f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(te('preheader', lg))}</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7f6;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <tr><td style="padding:32px 32px 0;">
        <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:-.02em;color:${GREEN};">genki</p>
        <p style="margin:20px 0 0;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${esc(te('label', lg))}</p>
        <h1 style="margin:6px 0 0;font-size:28px;line-height:1.2;letter-spacing:-.02em;color:${INK};">${esc(te('title', lg))}</h1>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;border:1px solid ${BORDER};border-radius:12px;">
          <tr><td style="padding:12px 18px;">
            <p style="margin:0;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${esc(te('code.label', lg))}</p>
            <p style="margin:2px 0 0;font-size:22px;font-weight:700;letter-spacing:.06em;color:${ACCENT};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${esc(code)}</p>
          </td></tr>
        </table>

        <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:${INK};">${esc(te('intro', lg))}</p>

        ${h2(te('office', lg))}
        <table role="presentation" cellpadding="0" cellspacing="0">${officeRows.map(([k, v]) => row(k, v)).join('')}</table>

        ${resultBlock}

        <p style="margin:28px 0 0;padding:14px 16px;background:#f6f7f6;border-radius:10px;font-size:13px;line-height:1.6;color:${MUTED};">${esc(te('final', lg))}</p>
      </td></tr>

      <tr><td style="padding:28px 32px 32px;">
        <div style="border-top:1px solid ${BORDER};padding-top:20px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:${INK};">${esc(te('keep', lg))}</p>
          <p style="margin:10px 0 0;font-size:16px;font-weight:700;letter-spacing:.06em;color:${ACCENT};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${esc(code)}</p>
          <p style="margin:18px 0 0;font-size:13px;color:${MUTED};">${esc(te('contact', lg))}</p>
          <p style="margin:18px 0 0;font-size:12px;color:${MUTED};">${esc(te('tagline', lg))}<br>© 2026 Genki · „Нортик Груп“ ЕООД · ЕИК 206451535</p>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject, text, html };
}

/* ==========================================================================
   5. ВЪТРЕШНИЯТ ИМЕЙЛ ДО hello@genki.bg

   Тук вътрешните имена Mini/Single/Duo са допустими — този текст никога
   не стига до посетителя.
   ========================================================================== */

const I = {
  hardware: { mini: 'Mini (вероятен кандидат)', single: 'Single (вероятен кандидат)',
              duo: 'Duo (вероятен кандидат)', multi: 'Няколко точки / комбинация (вероятен кандидат)' },
  approach: { core: 'Genki', benefit: 'Genki + Benefit', 'price-support': 'Genki + Price Support',
              both: 'Genki + Benefit + Price Support', custom: 'Custom / консултация' },
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

export function buildInternalEmail(answers, rec, code, meta) {
  const bounds = attendanceBounds(answers.q3);
  const score = rec.internal.score;
  const oneLine = (v) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 120);

  const subject = `Genki Fit ${code} — ${I.approach[rec.approach]}`;

  const lead = [
    ['Genki Fit код', code],
    ['Email на клиента', meta.email],
    ['Език', meta.lang.toUpperCase()],
    ['Получено (софийско)', formatSofiaDateTime(meta.timestamp, 'bg', { suffix: true })],
    ['Машинно (UTC)', meta.timestamp],
  ];

  const raw = [
    ['Q1 · Градове', answers.q1.cities.join(', ')],
    ['Q1 · Офиси в София', answers.q1.sofiaOffices || '—'],
    ['Q2 · Общо служители', answers.q2],
    ['Q2 · В най-големия офис', answers.largestOffice || '—'],
    ['Q3 · Диапазон', answers.q3],
    ['Q3 · attendanceMin / Max', bounds.min + ' / ' + (bounds.max === null ? 'отворен край' : bounds.max)],
    ['Q4 · В офиса сега', answers.q4.join(', ')],
    ['Q5 · Желана стойност', answers.q5],
    ['Q6 · Лента', rec.budget.id],
    ['Q6 · budgetMin / Max', (rec.budget.min === null ? '—' : rec.budget.min) + ' / ' +
      (rec.budget.max === null ? (rec.budget.kind === 'notsure' ? '—' : 'отворен край') : rec.budget.max)],
  ];

  const derived = [
    ['Изход', rec.outcome === 'recommendation' ? 'Препоръка' : 'Мека консултация'],
    ['Търговски маршрут', I.approach[rec.approach]],
    ['Хардуер', I.hardware[rec.hardware]],
    ['Price Support (вътрешно)', rec.psLevel ? rec.psLevel + '%' : '—'],
    ['Показан бюджет', rec.employerBudget
      ? (rec.employerBudget.approx ? '≈ ' : '') + money(rec.employerBudget.amount) : '—'],
    ['Причина', I.reason[rec.reason] || rec.reason],
    ['Прогнозни продажби', rec.internal.salesMax === null
      ? money(rec.internal.salesMin) + '+ (отворен край)'
      : money(rec.internal.salesMin) + ' – ' + money(rec.internal.salesMax)],
    ['Скор', score ? score.total + ' / 100 · ' + score.tier + (score.complete ? '' : ' (частичен)') : '—'],
  ];

  if (meta.referrer) derived.push(['Referrer', oneLine(meta.referrer)]);
  if (meta.utm) derived.push(['UTM', oneLine(meta.utm)]);

  const block = (title, rs) => title + '\n' + rs.map(([k, v]) => `  ${k}: ${v}`).join('\n');

  const text =
    'Източник: Genki Fit\n\n' +
    block('ЛИЙД', lead) + '\n\n' +
    block('ОТГОВОРИ (сурови)', raw) + '\n\n' +
    block('ИЗВЕДЕНО — не се показва на клиента', derived) + '\n\n' +
    'Прогнозните числа са вътрешно допускане за V1, не гарантиран оборот.\n' +
    'Клиентът получи същия код в своя имейл.';

  const table = (rs) =>
    `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;">${
      rs.map(([k, v]) => `<tr><td style="color:${MUTED};vertical-align:top;">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join('')
    }</table>`;

  const h3 = (x) => `<h3 style="margin:24px 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${esc(x)}</h3>`;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:${INK};max-width:660px;line-height:1.6;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Genki Fit</p>
  <h2 style="margin:0 0 4px;font-size:22px;color:${GREEN};font-family:ui-monospace,Menlo,monospace;">${esc(code)}</h2>
  <p style="margin:0 0 20px;font-size:14px;color:${MUTED};">${esc(I.approach[rec.approach])}</p>
  ${table(lead)}
  ${h3('Отговори (сурови)')}
  ${table(raw)}
  ${h3('Изведено — не се показва на клиента')}
  ${table(derived)}
  <p style="margin:20px 0 0;font-size:12px;color:${MUTED};">Прогнозните числа са вътрешно допускане за V1, не гарантиран оборот. Клиентът получи същия код в своя имейл.</p>
</div>`;

  return { subject, text, html };
}

/* ==========================================================================
   6. ИЗВЕСТИЕ ЗА СТЪПКА — моментна снимка на сесията

   Едно писмо след всяка потвърдена стъпка. Всяко носи ВСИЧКО, което се
   знае дотук, а не само новото — ако човек спре след Q3, това писмо пак
   съдържа Q1, Q2 и Q3.

   Имейлът е ИЗВЕСТИЕ, не хранилище. Каноничният запис е в D1.
   ========================================================================== */

const STEP_TITLES = {
  1: 'Стъпка 1/6 · офиси и компания',
  2: 'Стъпка 2/6 · размер на екипа',
  3: 'Стъпка 3/6 · дневна посещаемост',
  4: 'Стъпка 4/6 · какво има в офиса',
  5: 'Стъпка 5/6 · желана стойност',
  6: 'Стъпка 6/6 · бюджет',
};

function dash(v) {
  return v === null || v === undefined || v === '' ? '—' : v;
}

/**
 * @param {object} snap  моментната снимка от lib/genki-fit-store.js
 * @param {'step'|'completed'|'customer-sent'} kind
 */
export function buildStepNotification(snap, kind, extra) {
  const lg = 'bg';                     // вътрешните писма са на български
  const step = snap.lastCompletedStep;

  const suffix = kind === 'completed'
    ? 'Завършен'
    : kind === 'customer-sent'
      ? 'Клиентът поиска имейл'
      : 'Стъпка ' + step + '/6';

  const subject = `Genki Fit · ${snap.fitCode} · ${suffix}`;

  const known = [
    ['Компания', snap.company],
    ['Q1 · Градове', snap.q1.cities.length
      ? snap.q1.cities.map((c) => LABELS.city[c] ? LABELS.city[c][lg] : c).join(', ') : null],
    ['Q1 · Офиси в София', snap.q1.sofiaOffices],
    ['Q2 · Общо служители', snap.q2 && LABELS.q2[snap.q2] ? LABELS.q2[snap.q2][lg] : snap.q2],
    ['Q2 · В най-големия офис', snap.largestOffice && LABELS.q2[snap.largestOffice]
      ? LABELS.q2[snap.largestOffice][lg] : snap.largestOffice],
    ['Q3 · Дневна посещаемост', snap.q3 && LABELS.q3[snap.q3] ? LABELS.q3[snap.q3][lg] : snap.q3],
    ['Q3 · attendanceMin / Max', snap.q3
      ? snap.attendanceMin + ' / ' + (snap.attendanceMax === null ? 'отворен край' : snap.attendanceMax)
      : null],
    ['Q4 · В офиса сега', snap.q4.length
      ? snap.q4.map((v) => LABELS.q4[v] ? LABELS.q4[v][lg] : v).join(', ') : null],
    ['Q5 · Желана стойност', snap.q5],
    ['Q6 · Лента', snap.q6],
    ['Q6 · budgetMin / Max', snap.q6 && snap.q6 !== 'notsure'
      ? dash(snap.budgetMin) + ' / ' + (snap.budgetMax === null ? 'отворен край' : snap.budgetMax)
      : null],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '');

  const derived = [
    ['Хардуер (вероятен)', snap.hardware],
    ['Търговски маршрут', snap.route],
    ['Price Support (вътрешно)', snap.psLevel ? snap.psLevel + '%' : null],
    ['Изход', snap.outcome],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '');

  const lifecycle = [
    ['Genki Fit код', snap.fitCode],
    ['Състояние', snap.status === 'completed' ? 'Завършен' : 'В процес'],
    ['Докъде е стигнал', step + ' / 6'],
    ['Език на страницата', String(snap.language || 'bg').toUpperCase()],
    ['Създаден', snap.createdAtSofia],
    ['Обновен', snap.updatedAtSofia],
  ];
  if (snap.completedAtSofia) lifecycle.push(['Завършен на', snap.completedAtSofia]);
  if (snap.customerEmail) lifecycle.push(['Email на клиента', snap.customerEmail]);
  if (snap.customerFitSentAt) {
    lifecycle.push(['Fit изпратен на клиента', formatSofiaDateTime(snap.customerFitSentAt, 'bg', { suffix: true })]);
  }
  if (extra && extra.note) lifecycle.push(['Бележка', extra.note]);

  const block = (title, rs) => rs.length
    ? title + '\n' + rs.map(([k, v]) => `  ${k}: ${v}`).join('\n') + '\n\n' : '';

  const headline = kind === 'completed'
    ? 'Genki Fit е завършен.'
    : kind === 'customer-sent'
      ? 'Клиентът поиска своя Genki Fit по имейл.'
      : STEP_TITLES[step] || ('Стъпка ' + step + '/6');

  const text =
    headline + '\n\n' +
    block('СЕСИЯ', lifecycle) +
    block('ОТГОВОРИ ДОТУК', known) +
    block('ИЗВЕДЕНО — не се показва на клиента', derived) +
    'Това е моментна снимка на цялата сесия, не само на последната стъпка.\n' +
    'Каноничният запис е в D1, не в това писмо.';

  const table = (rs) =>
    `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;">${
      rs.map(([k, v]) => `<tr><td style="color:${MUTED};vertical-align:top;white-space:nowrap;">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join('')
    }</table>`;

  const h3 = (x) => `<h3 style="margin:22px 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${esc(x)}</h3>`;

  const pct = Math.round((step / 6) * 100);

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:${INK};max-width:660px;line-height:1.6;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Genki Fit</p>
  <h2 style="margin:0 0 2px;font-size:22px;color:${GREEN};font-family:ui-monospace,Menlo,monospace;">${esc(snap.fitCode)}</h2>
  <p style="margin:0 0 14px;font-size:14px;color:${MUTED};">${esc(headline)}</p>
  <div style="height:4px;background:${BORDER};border-radius:4px;overflow:hidden;margin-bottom:18px;">
    <div style="height:4px;width:${pct}%;background:${ACCENT};"></div>
  </div>
  ${table(lifecycle)}
  ${known.length ? h3('Отговори дотук') + table(known) : ''}
  ${derived.length ? h3('Изведено — не се показва на клиента') + table(derived) : ''}
  <p style="margin:20px 0 0;font-size:12px;color:${MUTED};">Моментна снимка на цялата сесия, не само на последната стъпка. Каноничният запис е в D1, не в това писмо.</p>
</div>`;

  return { subject, text, html };
}
