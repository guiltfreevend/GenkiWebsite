// Genki — канонично време.
//
// ПРАВИЛОТО
//   Бизнес часовата зона на целия Genki е Europe/Sofia.
//
//   • Абсолютни машинни моменти се пазят в UTC, когато това е полезно —
//     например rec.last в KV. Там UTC е правилният избор.
//   • Всичко, което човек вижда, и всичко, което определя бизнес
//     календарен ден, минава оттук и е в Europe/Sofia.
//   • Никога не се показва суров ISO низ (…Z) на човек.
//   • Никога не се пише +2 или +3 на ръка. Europe/Sofia сама се грижи за
//     лятното часово време: през септември отместването е +3, през
//     декември +2, а DST преходът се сменя по решение на зоната, не по
//     наше предположение.
//
// Защо Intl, а не библиотека: Intl.DateTimeFormat носи пълната база с
// часови зони и е наличен и в Cloudflare Workers, и в браузъра. Няма
// причина да влачим date библиотека само за форматиране.
//
// Форматът се сглобява от части нарочно. Ако разчитахме на подразбиращия
// се изглед на локала, точният вид щеше да зависи от версията на ICU в
// средата — а форматът е договорен: „20.09.2026 г., 17:17 ч." на
// български и „20 Sep 2026, 17:17" на английски.

export const SOFIA_TIME_ZONE = 'Europe/Sofia';

const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// en-GB дава стабилни числови части независимо от версията на ICU.
// Локалът тук е служебен — видимият текст се сглобява по-долу.
function sofiaParts(date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: SOFIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const out = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== 'literal') out[p.type] = p.value;
  }

  // Някои среди дават „24" за полунощ вместо „00".
  if (out.hour === '24') out.hour = '00';

  return out;
}

// Вярно ли работи зоната в тази среда. Проверява се с известен момент:
// 2026-09-20T14:17:00Z е 17:17 в София.
export function sofiaTimeSupported() {
  try {
    const p = sofiaParts(new Date('2026-09-20T14:17:00Z'));
    return p.hour === '17' && p.minute === '17' && p.day === '20';
  } catch (_) {
    return false;
  }
}

// Ако зоната липсва, по-добре явно назован UTC, отколкото час, който
// човекът ще прочете като софийски. Суров ISO низ не се показва никога.
function utcFallback(date, { seconds = false, dateOnly = false, timeOnly = false } = {}) {
  const iso = new Date(date).toISOString();
  const d = iso.slice(0, 10);
  const t = seconds ? iso.slice(11, 19) : iso.slice(11, 16);
  if (dateOnly) return d + ' (UTC)';
  if (timeOnly) return t + ' UTC';
  return d + ' ' + t + ' UTC';
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value == null ? Date.now() : value);
}

/**
 * Дата и час, готови за показване на човек.
 *   bg → „20.09.2026 г., 17:17 ч."
 *   en → „20 Sep 2026, 17:17"
 *
 * @param {Date|string|number} value
 * @param {'bg'|'en'} locale
 * @param {{seconds?: boolean, suffix?: boolean}} opts
 *        seconds — добавя секундите, когато са операционно полезни
 *        suffix  — добавя „(софийско време)" / „(Sofia time)", когато има
 *                  риск от двусмислие
 */
export function formatSofiaDateTime(value, locale = 'bg', opts = {}) {
  const date = toDate(value);
  if (!sofiaTimeSupported()) return utcFallback(date, opts);

  const p = sofiaParts(date);
  const time = p.hour + ':' + p.minute + (opts.seconds ? ':' + p.second : '');

  let out;
  if (locale === 'en') {
    out = Number(p.day) + ' ' + EN_MONTHS[Number(p.month) - 1] + ' ' + p.year + ', ' + time;
  } else {
    out = p.day + '.' + p.month + '.' + p.year + ' г., ' + time + ' ч.';
  }

  if (opts.suffix) out += locale === 'en' ? ' (Sofia time)' : ' (софийско време)';
  return out;
}

/** Само датата. bg → „20.09.2026 г." · en → „20 Sep 2026" */
export function formatSofiaDate(value, locale = 'bg') {
  const date = toDate(value);
  if (!sofiaTimeSupported()) return utcFallback(date, { dateOnly: true });

  const p = sofiaParts(date);
  return locale === 'en'
    ? Number(p.day) + ' ' + EN_MONTHS[Number(p.month) - 1] + ' ' + p.year
    : p.day + '.' + p.month + '.' + p.year + ' г.';
}

/** Само часът, 24-часов. bg → „17:17 ч." · en → „17:17" */
export function formatSofiaTime(value, locale = 'bg', opts = {}) {
  const date = toDate(value);
  if (!sofiaTimeSupported()) return utcFallback(date, { ...opts, timeOnly: true });

  const p = sofiaParts(date);
  const time = p.hour + ':' + p.minute + (opts.seconds ? ':' + p.second : '');
  return locale === 'en' ? time : time + ' ч.';
}

/**
 * Ключ за бизнес ден: YYYY-MM-DD по софийски календар.
 *
 * Това определя кога се сменя денят за броене. Сканиране в 00:30 софийско
 * време принадлежи на новия ден, макар че в UTC още е вчера.
 */
export function sofiaDayKey(value) {
  const date = toDate(value);
  if (!sofiaTimeSupported()) return new Date(date).toISOString().slice(0, 10);

  const p = sofiaParts(date);
  return p.year + '-' + p.month + '-' + p.day;
}

/**
 * Абсолютният момент за машинно съхранение. Нарочно UTC — това е
 * правилното място за UTC и не бива да се показва на човек.
 */
export function machineTimestamp(value) {
  return toDate(value).toISOString();
}
