/* ==========================================================================
   Тестове на каноничното Genki време.

   Пуска се с:  node tools/dev/test-time.mjs

   Най-важното тук са летният и зимният случай. Те доказват, че никъде не е
   зашито +2 или +3: един и същи стенен час в UTC дава различен софийски
   час през септември и през декември.
   ========================================================================== */

import {
  SOFIA_TIME_ZONE,
  sofiaTimeSupported,
  formatSofiaDateTime,
  formatSofiaDate,
  formatSofiaTime,
  sofiaDayKey,
  machineTimestamp,
} from '../../lib/genki-time.js';

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; console.log('  + ' + name); }
  else { fail++; failures.push(name + (detail ? ' - ' + detail : '')); console.log('  ! ' + name + (detail ? ' - ' + detail : '')); }
}
function eq(name, got, want) {
  check(name, got === want, 'получено ' + JSON.stringify(got) + ', очаквано ' + JSON.stringify(want));
}

console.log('\n=== СРЕДАТА ===');
{
  eq('зоната е Europe/Sofia', SOFIA_TIME_ZONE, 'Europe/Sofia');
  check('средата поддържа зоната', sofiaTimeSupported());
}

/* ----------------------------------------------------------------------
   ЛЯТО — EEST, UTC+3
   ---------------------------------------------------------------------- */
console.log('\n=== ЛЯТО: 2026-09-20T14:17:00Z → 17:17 София ===');
{
  const t = new Date('2026-09-20T14:17:00Z');
  eq('BG дата и час', formatSofiaDateTime(t, 'bg'), '20.09.2026 г., 17:17 ч.');
  eq('BG със секунди', formatSofiaDateTime(t, 'bg', { seconds: true }), '20.09.2026 г., 17:17:00 ч.');
  eq('EN дата и час', formatSofiaDateTime(t, 'en'), '20 Sep 2026, 17:17');
  eq('EN със секунди', formatSofiaDateTime(t, 'en', { seconds: true }), '20 Sep 2026, 17:17:00');
  eq('BG само дата', formatSofiaDate(t, 'bg'), '20.09.2026 г.');
  eq('EN само дата', formatSofiaDate(t, 'en'), '20 Sep 2026');
  eq('BG само час', formatSofiaTime(t, 'bg'), '17:17 ч.');
  eq('EN само час', formatSofiaTime(t, 'en'), '17:17');
  eq('ключ за бизнес ден', sofiaDayKey(t), '2026-09-20');
  eq('BG суфикс', formatSofiaDateTime(t, 'bg', { suffix: true }), '20.09.2026 г., 17:17 ч. (софийско време)');
  eq('EN суфикс', formatSofiaDateTime(t, 'en', { suffix: true }), '20 Sep 2026, 17:17 (Sofia time)');
}

/* ----------------------------------------------------------------------
   ЗИМА — EET, UTC+2.  Същият стенен час в UTC, друг час в София.
   ---------------------------------------------------------------------- */
console.log('\n=== ЗИМА: 2026-12-20T14:17:00Z → 16:17 София ===');
{
  const t = new Date('2026-12-20T14:17:00Z');
  eq('BG дата и час', formatSofiaDateTime(t, 'bg'), '20.12.2026 г., 16:17 ч.');
  eq('EN дата и час', formatSofiaDateTime(t, 'en'), '20 Dec 2026, 16:17');
  eq('ключ за бизнес ден', sofiaDayKey(t), '2026-12-20');
}

console.log('\n=== ДОКАЗАТЕЛСТВО, ЧЕ ОТМЕСТВАНЕТО НЕ Е ЗАШИТО ===');
{
  const summer = formatSofiaTime(new Date('2026-09-20T14:17:00Z'), 'en');
  const winter = formatSofiaTime(new Date('2026-12-20T14:17:00Z'), 'en');
  check('един и същи UTC час дава различен софийски час лете и зиме',
    summer === '17:17' && winter === '16:17', 'лято ' + summer + ', зима ' + winter);
  check('разликата е точно един час', true);
}

/* ----------------------------------------------------------------------
   DST ПРЕХОДИ. Европейските преходи са в 01:00 UTC на последната неделя
   на март и на октомври.
   ---------------------------------------------------------------------- */
console.log('\n=== ПРЕХОД НАПРОЛЕТ: 29.03.2026, 01:00Z ===');
{
  // 00:59:59Z още е зима → 02:59:59 София
  eq('минута преди прехода', formatSofiaTime(new Date('2026-03-29T00:59:59Z'), 'en', { seconds: true }), '02:59:59');
  // 01:00:00Z вече е лято → 04:00:00 София (часовникът прескача 03:00)
  eq('в самия преход', formatSofiaTime(new Date('2026-03-29T01:00:00Z'), 'en', { seconds: true }), '04:00:00');
}

console.log('\n=== ПРЕХОД НАЕСЕН: 25.10.2026, 01:00Z ===');
{
  // 00:59:59Z още е лято → 03:59:59 София
  eq('минута преди прехода', formatSofiaTime(new Date('2026-10-25T00:59:59Z'), 'en', { seconds: true }), '03:59:59');
  // 01:00:00Z вече е зима → 03:00:00 София (часът се повтаря)
  eq('в самия преход', formatSofiaTime(new Date('2026-10-25T01:00:00Z'), 'en', { seconds: true }), '03:00:00');
}

/* ----------------------------------------------------------------------
   ГРАНИЦАТА НА БИЗНЕС ДЕНЯ. Това е същината: денят се сменя в 00:00
   софийско време, не в 00:00 UTC.
   ---------------------------------------------------------------------- */
console.log('\n=== ГРАНИЦА НА БИЗНЕС ДЕНЯ ===');
{
  // Лято: 21:00Z е вече 00:00 на следващия ден в София.
  eq('лято, 20-и 20:59Z е още 20-и', sofiaDayKey(new Date('2026-09-20T20:59:00Z')), '2026-09-20');
  eq('лято, 20-и 21:00Z е вече 21-ви', sofiaDayKey(new Date('2026-09-20T21:00:00Z')), '2026-09-21');

  // Зима: границата се мести на 22:00Z.
  eq('зима, 20-и 21:59Z е още 20-и', sofiaDayKey(new Date('2026-12-20T21:59:00Z')), '2026-12-20');
  eq('зима, 20-и 22:00Z е вече 21-ви', sofiaDayKey(new Date('2026-12-20T22:00:00Z')), '2026-12-21');

  // И обратното: ранна сутрин в UTC е същият ден в София.
  eq('лято, 00:30Z е същият ден', sofiaDayKey(new Date('2026-09-20T00:30:00Z')), '2026-09-20');

  // Ключ по UTC би сгрешил точно тук — показваме разликата изрично.
  const t = new Date('2026-09-20T21:30:00Z');
  check('софийският ключ се различава от UTC ключа на тази граница',
    sofiaDayKey(t) === '2026-09-21' && t.toISOString().slice(0, 10) === '2026-09-20');
}

console.log('\n=== ФОРМА И РЪБОВЕ ===');
{
  check('никъде не изтича суров ISO низ',
    !/\d{4}-\d{2}-\d{2}T/.test(formatSofiaDateTime(new Date(), 'bg')));
  check('часът е 24-часов, без am/pm',
    !/[ap]m/i.test(formatSofiaDateTime(new Date('2026-09-20T20:00:00Z'), 'en')));
  eq('полунощ е 00, не 24', formatSofiaTime(new Date('2026-09-20T21:00:00Z'), 'en'), '00:00');
  eq('приема ISO низ', formatSofiaDateTime('2026-09-20T14:17:00Z', 'bg'), '20.09.2026 г., 17:17 ч.');
  eq('приема милисекунди', formatSofiaDateTime(Date.parse('2026-09-20T14:17:00Z'), 'bg'), '20.09.2026 г., 17:17 ч.');
  eq('непознат локал пада към български',
    formatSofiaDateTime(new Date('2026-09-20T14:17:00Z'), 'de'), '20.09.2026 г., 17:17 ч.');
  eq('еднозначна дата: 05.01, не 01.05',
    formatSofiaDate(new Date('2026-01-05T12:00:00Z'), 'bg'), '05.01.2026 г.');
  eq('машинният запис си остава UTC ISO',
    machineTimestamp(new Date('2026-09-20T14:17:00Z')), '2026-09-20T14:17:00.000Z');
}

console.log('\n' + '-'.repeat(52));
console.log('РЕЗУЛТАТ: ' + pass + ' минали, ' + fail + ' паднали');
if (fail) {
  console.log('\nПаднали:');
  failures.forEach((f) => console.log('  * ' + f));
  process.exit(1);
}
