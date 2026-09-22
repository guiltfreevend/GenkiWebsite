/* ==========================================================================
   Genki Fit — тестове на логиката и на сървърния handler.

   Пуска се с:  node tools/dev/test-genki-fit.mjs

   Тества lib/genki-fit-logic.js и functions/api/genki-fit.js ИЗОЛИРАНО от
   интерфейса, с подменен fetch. НЕ изпраща нито един реален имейл.
   ========================================================================== */

import {
  FORECAST, Q2_BANDS, Q3_RANGES_BY_Q2, ATTENDANCE_BOUNDS, HARDWARE_BOUNDARIES,
  q3RangesFor, attendanceBounds, hardwareCandidate, benefitFor,
  round50, expectedSales, psThresholds, budgetBands, findBand,
  recommend, validateAnswers, PS_LEVELS, PS_LEVELS_AUTOMATIC, PS_MAX_AUTOMATIC,
} from '../../lib/genki-fit-logic.js';

import { onRequest, onRequestPost, validateDestination } from '../../functions/api/genki-fit.js';
import {
  newFitCode, CODE_ALPHABET, CODE_PATTERN, buildCustomerEmail, buildInternalEmail, SHARED,
} from '../../lib/genki-fit-email.js';
import { formatSofiaDateTime } from '../../lib/genki-time.js';
import { readFileSync } from 'node:fs';

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, detail) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
}

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const shape = (bands) => bands.filter((b) => b.kind !== 'notsure').map((b) => [b.min, b.max]);

/* ======================================================================
   1. Q3 — ДИНАМИЧНИ ДИАПАЗОНИ ЗА ВСЕКИ Q2
   ====================================================================== */
console.log('\n=== Q3 · диапазони за всеки Q2 (заключени) ===');
{
  const LOCKED = {
    'lte50':   ['lt25', '25-49', '50'],
    '51-100':  ['lt25', '25-49', '50-74', '75-100'],
    '101-150': ['lt25', '25-49', '50-74', '75-99', '100-150'],
    '151-300': ['lt25', '25-49', '50-74', '75-149', '150-199', '200-300'],
    '301-500': ['lt50', '50-74', '75-199', '200-349', '350-500'],
    '501-999': ['lt50', '50-74', '75-199', '200-399', '400-699', '700-999'],
    '1000+':   ['lt50', '50-74', '75-199', '200-499', '500-999', '1000+'],
  };

  for (const q2 of Q2_BANDS) {
    check('Q2 ' + q2 + ' → точните диапазони', eq(q3RangesFor(q2), LOCKED[q2]),
      JSON.stringify(q3RangesFor(q2)));
  }
  check('всеки Q2 band има диапазони', Q2_BANDS.every((b) => q3RangesFor(b) && q3RangesFor(b).length));
  check('непознат Q2 не дава диапазони', q3RangesFor('nonsense') === null);
}

/* ======================================================================
   2. attendanceMin / attendanceMax
   ====================================================================== */
console.log('\n=== Q3 · граници min/max ===');
{
  const EXPECT = {
    'lt25': [1, 24], '25-49': [25, 49], '50': [50, 50], 'lt50': [1, 49],
    '50-74': [50, 74], '75-99': [75, 99], '75-100': [75, 100], '75-149': [75, 149],
    '75-199': [75, 199], '100-150': [100, 150], '150-199': [150, 199],
    '200-300': [200, 300], '200-349': [200, 349], '200-399': [200, 399],
    '200-499': [200, 499], '350-500': [350, 500], '400-699': [400, 699],
    '500-999': [500, 999], '700-999': [700, 999], '1000+': [1000, null],
  };
  for (const [id, [min, max]] of Object.entries(EXPECT)) {
    const b = attendanceBounds(id);
    check(id + ' → ' + min + '/' + max, b && b.min === min && b.max === max, JSON.stringify(b));
  }
  check('„1,000+" няма измислен таван', attendanceBounds('1000+').max === null);
  check('непознат диапазон връща null', attendanceBounds('xx') === null);

  // Всеки диапазон, ползван от някой Q2, трябва да има граници.
  const used = new Set(Object.values(Q3_RANGES_BY_Q2).flat());
  check('всички ползвани диапазони имат граници',
    [...used].every((id) => ATTENDANCE_BOUNDS[id]), [...used].join(','));
}

/* ======================================================================
   3. НИТО ЕДИН ДИАПАЗОН НЕ ПРЕСИЧА ГРАНИЦИТЕ 50 / 75 / 200
   ====================================================================== */
console.log('\n=== Q3 · нито един диапазон не пресича 50 / 75 / 200 ===');
{
  const bandOf = (n) => (n < 50 ? 0 : n < 75 ? 1 : n < 200 ? 2 : 3);
  let crossing = [];
  for (const [q2, ranges] of Object.entries(Q3_RANGES_BY_Q2)) {
    for (const r of ranges) {
      const b = attendanceBounds(r);
      const hi = b.max === null ? Infinity : b.max;
      if (bandOf(b.min) !== bandOf(hi)) crossing.push(q2 + '/' + r);
    }
  }
  check('нула пресичащи диапазона', crossing.length === 0, crossing.join(', '));
  check('границите са точно 50/75/200', eq(HARDWARE_BOUNDARIES, [50, 75, 200]));
}

/* ======================================================================
   4. КОЕФИЦИЕНТЪТ €9,90
   ====================================================================== */
console.log('\n=== Икономика · коефициентът €9,90 ===');
{
  check('коефициентът е 9.90', FORECAST.grossPerAttendeePerMonth === 9.90);
  check('НЕ е старият 15.62', FORECAST.grossPerAttendeePerMonth !== 15.62);
  check('адопция 20%', FORECAST.dailyAdoption === 0.20);
  check('1,3 продукта на купувач', FORECAST.itemsPerBuyer === 1.3);
  check('средна цена €1,73', FORECAST.avgShelfPriceInclVat === 1.73);
  check('22 работни дни', FORECAST.officeDaysPerMonth === 22);

  const derived = FORECAST.dailyAdoption * FORECAST.itemsPerBuyer *
                  FORECAST.avgShelfPriceInclVat * FORECAST.officeDaysPerMonth;
  check('0,26 × 1,73 × 22 ≈ 9,90', Math.abs(derived - 9.90) < 0.02, derived.toFixed(4));
}

/* ======================================================================
   5. salesMin / salesMax — без средна стойност
   ====================================================================== */
console.log('\n=== Икономика · salesMin/salesMax ===');
{
  const s = expectedSales(attendanceBounds('50-74'));
  check('salesMin = 50 × 9,90', Math.abs(s.salesMin - 495) < 0.001, String(s.salesMin));
  check('salesMax = 74 × 9,90', Math.abs(s.salesMax - 732.6) < 0.001, String(s.salesMax));

  const open = expectedSales(attendanceBounds('1000+'));
  check('отворен край → salesMax null', open.salesMax === null);
  check('отворен край пази salesMin', Math.abs(open.salesMin - 9900) < 0.001, String(open.salesMin));

  const single = expectedSales(attendanceBounds('50'));
  check('точна стойност 50 → min === max', single.salesMin === single.salesMax);

  // Никъде не се произвежда средна стойност.
  const keys = Object.keys(s).concat(Object.keys(attendanceBounds('50-74')));
  check('няма ключ за средна стойност',
    !keys.some((k) => /avg|mid|mean|average/i.test(k)), keys.join(','));

  const src = readFileSync(new URL('../../lib/genki-fit-logic.js', import.meta.url), 'utf8');
  check('изходният код не смята среда',
    !/\(\s*min\s*\+\s*max\s*\)\s*\/\s*2|midpoint/i.test(src));
}

/* ======================================================================
   6. round50 и праговете на Price Support
   ====================================================================== */
console.log('\n=== Q6 · round50 и праговете ===');
{
  check('round50(0) = 0', round50(0) === 0);
  check('round50(1) = 50', round50(1) === 50);
  check('round50(50) = 50', round50(50) === 50);
  check('round50(51) = 100', round50(51) === 100);
  check('round50(146.52) = 150', round50(146.52) === 150);
  check('round50(732.6) = 750', round50(732.6) === 750);
  check('няма грозни стойности', round50(146.52) % 50 === 0);

  // 74 присъстващи → salesMax 732,60
  const t = psThresholds(732.6);
  check('T20 = 150', t.t20 === 150, String(t.t20));
  check('T50 = 400', t.t50 === 400, String(t.t50));
  check('T75 = 550', t.t75 === 550, String(t.t75));
  check('вече няма T100', t.t100 === undefined);
}

/* ======================================================================
   7. Q6 · PRICE SUPPORT ONLY
   ====================================================================== */
console.log('\n=== Q6 · само Price Support ===');
{
  const set = budgetBands('101-150', '75-99', 'price-support');
  // salesMax = 99 × 9,90 = 980,10 → T20 200 · T50 500 · T75 750
  check('режим price-support', set.mode === 'price-support');
  check('шест опции (5 ленти + „не сме сигурни")', set.bands.length === 6, String(set.bands.length));
  check('лентите стъпват на T75, не на T100',
    eq(shape(set.bands), [[0, 0], [1, 200], [201, 500], [501, 750], [751, null]]),
    JSON.stringify(shape(set.bands)));
  check('горната граница е T75', set.thresholds.t75 === 750, String(set.thresholds.t75));
  check('първата е точно €0', set.bands[0].kind === 'zero');
  check('втората е „до €T20"', set.bands[1].kind === 'upto');
  check('последната е отворена', set.bands[4].kind === 'open' && set.bands[4].max === null);
  check('има „още не сме сигурни"', set.bands[5].kind === 'notsure');

  // Няма застъпване, няма дупки, няма нулева ширина.
  const b = shape(set.bands);
  let contiguous = true;
  for (let i = 1; i < b.length; i++) if (b[i][0] !== b[i - 1][1] + 1) contiguous = false;
  check('без дупки и без застъпване', contiguous, JSON.stringify(b));
  check('без нулева ширина', b.every(([lo, hi]) => hi === null || hi >= lo));
}

/* ======================================================================
   8. Q6 · САМО BENEFIT — точните заключени таблици
   ====================================================================== */
console.log('\n=== Q6 · само Benefit ===');
{
  const small = ['lte50', '51-100', '101-150'];
  for (const q2 of small) {
    const q3 = q3RangesFor(q2)[1];
    const set = budgetBands(q2, q3, 'benefit');
    check(q2 + ' → €0–599 / €600–899 / €900+',
      eq(shape(set.bands), [[0, 599], [600, 899], [900, null]]),
      JSON.stringify(shape(set.bands)));
  }

  const mid = budgetBands('151-300', '50-74', 'benefit');
  check('151–300 → €0–799 / €800–1199 / €1200+',
    eq(shape(mid.bands), [[0, 799], [800, 1199], [1200, null]]),
    JSON.stringify(shape(mid.bands)));

  const big = budgetBands('301-500', '75-199', 'benefit');
  check('301–500 → €0–999 / €1000–1499 / €1500+',
    eq(shape(big.bands), [[0, 999], [1000, 1499], [1500, null]]),
    JSON.stringify(shape(big.bands)));

  check('таксите са 599/799/999',
    benefitFor('101-150').fee === 599 && benefitFor('151-300').fee === 799 &&
    benefitFor('301-500').fee === 999);
  check('котвите са 600/800/1000',
    benefitFor('101-150').anchor === 600 && benefitFor('151-300').anchor === 800 &&
    benefitFor('301-500').anchor === 1000);
}

/* ======================================================================
   9. Q6 · BOTH — примерът от спецификацията
   ====================================================================== */
console.log('\n=== Q6 · Both ===');
{
  // Q2 51–100 + Q3 50–74: котва 600, T20 150, T50 400, T100 750.
  const set = budgetBands('51-100', '50-74', 'both');
  check('режим both', set.mode === 'both');
  check('праговете са 150/400/550 (T75)',
    set.thresholds.t20 === 150 && set.thresholds.t50 === 400 && set.thresholds.t75 === 550,
    JSON.stringify(set.thresholds));
  check('Both ползва T75 за горната лента',
    eq(shape(set.bands), [[0, 599], [600, 749], [750, 999], [1000, 1149], [1150, null]]),
    JSON.stringify(shape(set.bands)));

  const b = shape(set.bands);
  let contiguous = true;
  for (let i = 1; i < b.length; i++) if (b[i][0] !== b[i - 1][1] + 1) contiguous = false;
  check('без дупки и без застъпване', contiguous);
  check('без дублирани ленти', new Set(b.map(String)).size === b.length);
}

/* ======================================================================
   10. Q6 · UNSURE ползва структурата на Both
   ====================================================================== */
console.log('\n=== Q6 · „още не сме сигурни" ===');
{
  const both = budgetBands('51-100', '50-74', 'both');
  const unsure = budgetBands('51-100', '50-74', 'unsure');
  check('unsure дава същите ленти като both', eq(shape(unsure.bands), shape(both.bands)));
  check('unsure се води режим both', unsure.mode === 'both');

  const u2 = budgetBands('301-500', '200-349', 'unsure');
  const b2 = budgetBands('301-500', '200-349', 'both');
  check('и при по-голям офис съвпадат', eq(shape(u2.bands), shape(b2.bands)));
}

/* ======================================================================
   11. Q2 501+ · Benefit е custom
   ====================================================================== */
console.log('\n=== Q2 501+ · Benefit е custom ===');
{
  check('501–999 няма числова Benefit такса', benefitFor('501-999') === null);
  check('1000+ няма числова Benefit такса', benefitFor('1000+') === null);

  for (const q2 of ['501-999', '1000+']) {
    for (const q5 of ['benefit', 'both', 'unsure']) {
      const set = budgetBands(q2, '75-199', q5);
      check(q2 + ' + ' + q5 + ' → режим custom', set.mode === 'custom');
      check(q2 + ' + ' + q5 + ' → въпросът пак е отговорим', set.bands.length > 1,
        String(set.bands.length));
      const r = recommend({ q1: { cities: ['sofia'], sofiaOffices: '1' }, q2, q3: '75-199', q4: ['none'], q5, q6: 'b3' });
      check(q2 + ' + ' + q5 + ' → консултация', r.outcome === 'consultation' && r.approach === 'custom');
    }
    // Чистият Price Support НЕ е custom — Benefit не участва.
    const ps = budgetBands(q2, '75-199', 'price-support');
    check(q2 + ' + само PS → нормален режим', ps.mode === 'price-support');
  }
}

/* ======================================================================
   12. ОТВОРЕН КРАЙ · attendanceMax === null
   ====================================================================== */
console.log('\n=== Отворен край ===');
{
  const set = budgetBands('1000+', '1000+', 'price-support');
  check('отбелязан е като openEnded', set.openEnded === true);
  // Праговете стъпват на salesMin = 9900, не на измислен таван.
  check('T20 от salesMin', set.thresholds.t20 === round50(9900 * 0.2), String(set.thresholds.t20));
  check('T75 = 7450 от salesMin', set.thresholds.t75 === round50(9900 * 0.75),
    String(set.thresholds.t75));

  const r = recommend({
    q1: { cities: ['sofia'], sofiaOffices: '3plus' }, q2: '1000+', q3: '1000+',
    q4: ['canteen'], q5: 'price-support', q6: 'b2',
  });
  check('отворен край → консултация', r.outcome === 'consultation', r.outcome);
  check('причината е open-ended', r.reason === 'open-ended', r.reason);
  check('attendance.max остава null', r.attendance.max === null);
  check('salesMax остава null', r.internal.salesMax === null);
  check('няма измислено PS ниво', r.psLevel === null);
}

/* ======================================================================
   13. ХАРДУЕР · Mini / Single / Duo / multi
   ====================================================================== */
console.log('\n=== Хардуер ===');
{
  check('1 → mini', hardwareCandidate(1) === 'mini');
  check('49 → mini', hardwareCandidate(49) === 'mini');
  check('50 → single', hardwareCandidate(50) === 'single');
  check('74 → single', hardwareCandidate(74) === 'single');
  check('75 → duo', hardwareCandidate(75) === 'duo');
  check('199 → duo', hardwareCandidate(199) === 'duo');
  check('200 → multi', hardwareCandidate(200) === 'multi');
  check('5000 → multi', hardwareCandidate(5000) === 'multi');

  // През реалните диапазони — всеки диапазон дава едно и също за min и max.
  let stable = true;
  for (const ranges of Object.values(Q3_RANGES_BY_Q2)) {
    for (const r of ranges) {
      const b = attendanceBounds(r);
      const hi = b.max === null ? 100000 : b.max;
      if (hardwareCandidate(b.min) !== hardwareCandidate(hi)) stable = false;
    }
  }
  check('всеки диапазон дава един и същ хардуер за двата си края', stable);
}

/* ======================================================================
   14. ПРЕПОРЪКА · основните пътища
   ====================================================================== */
console.log('\n=== Препоръка ===');
{
  const base = { q1: { cities: ['sofia'], sofiaOffices: '1' }, q4: ['vending'] };

  // Benefit се побира.
  const r1 = recommend({ ...base, q2: '101-150', q3: '75-99', q5: 'benefit', q6: 'b1' });
  check('Benefit при покриваща лента', r1.outcome === 'recommendation' && r1.approach === 'benefit');
  check('показва се закръглен бюджет €600', r1.employerBudget.amount === 600);

  // Benefit НЕ се покрива → консултация, не отказ.
  const r2 = recommend({ ...base, q2: '101-150', q3: '75-99', q5: 'benefit', q6: 'b0' });
  check('под котвата → консултация', r2.outcome === 'consultation');
  check('причината е benefit-not-covered', r2.reason === 'benefit-not-covered');

  // Both: Benefit + най-високото побиращо се PS ниво.
  const r3 = recommend({ ...base, q2: '51-100', q3: '50-74', q5: 'both', q6: 'b4' });
  check('Both при най-горната лента', r3.approach === 'both' && r3.outcome === 'recommendation');
  check('PS нивото е автоматично допустимо', PS_LEVELS_AUTOMATIC.includes(r3.psLevel), String(r3.psLevel));
  check('никога не се препоръчва 100% автоматично', r3.psLevel !== 100);
  check('нивото не надхвърля 75%', r3.psLevel <= PS_MAX_AUTOMATIC, String(r3.psLevel));

  // Свойство на заключената структура на лентите: в режим both лентите се
  // строят НАД котвата на Benefit, при това от самите PS прагове. Следствие
  // — щом Benefit е покрит, винаги остава място поне за 10% Price Support.
  // Затова „само Benefit, PS по-късно" е ЗАЩИТЕН клон, а не реален изход
  // тук. Проверява се, че е точно така, вместо да се твърди обратното.
  let coveredNotBoth = [];
  for (const q2 of Q2_BANDS) {
    const ben = benefitFor(q2);
    if (!ben) continue;
    for (const q3 of q3RangesFor(q2)) {
      const set = budgetBands(q2, q3, 'both');
      for (const bd of set.bands) {
        if (bd.kind === 'notsure' || bd.min < ben.anchor) continue;
        const r = recommend({ ...base, q2, q3, q5: 'both', q6: bd.id });
        if (r.approach !== 'both' || !r.psLevel) coveredNotBoth.push(q2 + '/' + q3 + '/' + bd.id);
      }
    }
  }
  check('покрит Benefit винаги оставя място поне за 10% PS',
    coveredNotBoth.length === 0, coveredNotBoth.slice(0, 3).join(', '));

  // PS-only, който се побира.
  const r5 = recommend({ ...base, q2: '101-150', q3: '75-99', q5: 'price-support', q6: 'b3' });
  check('PS се побира', r5.outcome === 'recommendation' && r5.approach === 'price-support');
  check('има PS ниво', r5.psLevel !== null);

  // Консервативност: requiredMax никога не надхвърля тавана на лентата.
  const set5 = budgetBands('101-150', '75-99', 'price-support');
  const band5 = findBand(set5, 'b3');
  const sales5 = expectedSales(attendanceBounds('75-99'));
  check('requiredMax се побира в тавана',
    sales5.salesMax * (r5.psLevel / 100) <= band5.max,
    (sales5.salesMax * (r5.psLevel / 100)).toFixed(2) + ' ≤ ' + band5.max);
}

/* ======================================================================
   15. МЕКА КОНСУЛТАЦИЯ · маршрут, не отказ
   ====================================================================== */
console.log('\n=== Мека консултация ===');
{
  const base = { q1: { cities: ['plovdiv'] }, q4: ['none'] };

  // PS + €0
  const small0 = recommend({ ...base, q2: 'lte50', q3: 'lt25', q5: 'price-support', q6: 'b0' });
  check('<25 + €0 → консултация', small0.outcome === 'consultation');
  check('причината е zero-budget-small', small0.reason === 'zero-budget-small');

  // <50 НЕ е автоматично лош профил: с бюджет се получава реална препоръка.
  const smallFunded = recommend({ ...base, q2: 'lte50', q3: '25-49', q5: 'price-support', q6: 'b2' });
  check('<50 с бюджет НЕ е отказ', smallFunded.outcome === 'recommendation', smallFunded.reason);
  check('<50 дава Mini кандидат', smallFunded.hardware === 'mini');

  // €0, но посещаемост ≥50 → базов Genki, а не консултация (бриф р. 17).
  const zeroBig = recommend({ ...base, q2: '101-150', q3: '75-99', q5: 'price-support', q6: 'b0' });
  check('€0 при ≥50 → базов Genki', zeroBig.outcome === 'recommendation' && zeroBig.approach === 'core');
  check('бюджетът е €0', zeroBig.employerBudget.amount === 0);

  // „Не сме сигурни" за бюджета
  const uns = recommend({ ...base, q2: '101-150', q3: '75-99', q5: 'both', q6: 'notsure' });
  check('бюджет „не сме сигурни" → консултация', uns.outcome === 'consultation');
  check('причината е budget-unknown', uns.reason === 'budget-unknown');

  // Никой път не връща етикет, който звучи като отказ.
  const BAD = /reject|unsuitable|low.?fit|too.?small|unprofitable|fail/i;
  let clean = true;
  for (const q5 of ['benefit', 'price-support', 'both', 'unsure']) {
    for (const q2 of Q2_BANDS) {
      for (const q3 of q3RangesFor(q2)) {
        const set = budgetBands(q2, q3, q5);
        for (const bd of set.bands) {
          const r = recommend({ ...base, q2, q3, q5, q6: bd.id });
          if (!r) { clean = false; continue; }
          if (BAD.test(r.reason) || BAD.test(r.approach) || BAD.test(r.outcome)) clean = false;
        }
      }
    }
  }
  check('нито един изход не звучи като отказ', clean);
}

/* ======================================================================
   16. ПЪЛНО ОБХОЖДАНЕ · всяка комбинация дава валиден изход
   ====================================================================== */
console.log('\n=== Пълно обхождане на всички комбинации ===');
{
  let total = 0, bad = [], leaked = [];
  const PUBLIC_FORBIDDEN = ['score', 'tier', 'margin'];

  for (const q5 of ['benefit', 'price-support', 'both', 'unsure']) {
    for (const q2 of Q2_BANDS) {
      for (const q3 of q3RangesFor(q2)) {
        const set = budgetBands(q2, q3, q5);
        for (const bd of set.bands) {
          total++;
          const r = recommend({
            q1: { cities: ['sofia'], sofiaOffices: '1' },
            q2, q3, q4: ['vending'], q5, q6: bd.id,
          });
          if (!r) { bad.push([q2, q3, q5, bd.id].join('/')); continue; }
          if (!['recommendation', 'consultation'].includes(r.outcome)) bad.push('outcome ' + r.outcome);
          if (r.outcome === 'recommendation' && r.approach === 'custom') bad.push('custom с препоръка');
          if (r.psLevel !== null && !PS_LEVELS_AUTOMATIC.includes(r.psLevel)) bad.push('PS ' + r.psLevel);
          // Публичната част не бива да носи вътрешни полета.
          const pub = { ...r }; delete pub.internal;
          const s = JSON.stringify(pub);
          for (const f of PUBLIC_FORBIDDEN) if (s.includes(f)) leaked.push(f);
        }
      }
    }
  }
  check('обходени са 180+ комбинации', total >= 180, String(total));
  check('всяка комбинация дава валиден изход', bad.length === 0, bad.slice(0, 5).join(', '));
  check('публичната част не носи вътрешни полета', leaked.length === 0, [...new Set(leaked)].join(','));
}

/* ======================================================================
   17. ВЪТРЕШЕН СКОР · съществува, но не изтича
   ====================================================================== */
console.log('\n=== Вътрешен скор ===');
{
  const r = recommend({
    q1: { cities: ['sofia', 'plovdiv'], sofiaOffices: '2' }, q2: '1000+', q3: '500-999',
    q4: ['canteen'], q5: 'price-support', q6: 'b3',
  });
  const s = r.internal.score;
  check('скорът е между 0 и 100', s.total >= 0 && s.total <= 100, String(s.total));
  check('има вътрешен етикет', ['IDEAL', 'STRONG', 'POSSIBLE', 'LOW'].includes(s.tier), s.tier);
  check('Q2 1000+ дава 20 точки', s.parts.q2 === 20);
  check('Q3 500+ дава 30 точки', s.parts.q3 === 30);
  check('Q5 price-support дава 11 точки', s.parts.q5 === 11);
  check('скорът живее само в internal', r.score === undefined && r.tier === undefined);
}

/* ======================================================================
   18. ВАЛИДАЦИЯ
   ====================================================================== */
console.log('\n=== Валидация ===');
{
  const good = {
    cities: ['sofia'], sofiaOffices: '1', q2: '101-150', q3: '75-99',
    q4: ['vending'], q5: 'both', q6: 'b1',
  };
  check('валиден payload минава', validateAnswers(good).ok);

  check('липсващ град пада', validateAnswers({ ...good, cities: [] }).errors.includes('q1'));
  check('София без брой офиси пада', validateAnswers({ ...good, sofiaOffices: null }).errors.includes('q1offices'));
  check('непознат град се отсява', !validateAnswers({ ...good, cities: ['sofia', 'atlantis'] }).answers.q1.cities.includes('atlantis'));
  check('непознат Q2 пада', validateAnswers({ ...good, q2: 'huge' }).errors.includes('q2'));

  // Q3 се сверява СРЕЩУ Q2.
  check('Q3 от чужд Q2 се отхвърля',
    validateAnswers({ ...good, q2: 'lte50', q3: '700-999' }).errors.includes('q3'));
  check('Q3 от собствения Q2 минава', validateAnswers({ ...good, q3: '50-74' }).ok);

  // Q6 се сверява срещу лентите, които СЪРВЪРЪТ генерира.
  check('измислен Q6 се отхвърля', validateAnswers({ ...good, q6: 'b99' }).errors.includes('q6'));
  check('Q6 „notsure" е валиден', validateAnswers({ ...good, q6: 'notsure' }).ok);

  check('„нищо постоянно" изяжда другите',
    eq(validateAnswers({ ...good, q4: ['vending', 'none'] }).answers.q4, ['none']));
  check('празен Q4 пада', validateAnswers({ ...good, q4: [] }).errors.includes('q4'));
  check('непознат Q5 пада', validateAnswers({ ...good, q5: 'magic' }).errors.includes('q5'));
  check('null payload не хвърля', validateAnswers(null).ok === false);
  check('масив вместо обект не хвърля', validateAnswers([]).ok === false);
  check('непознати полета не влизат',
    validateAnswers({ ...good, isAdmin: true }).answers.isAdmin === undefined);

}

/* ======================================================================
   19. PRICE SUPPORT · таванът е 75%, 100% е премахнато
   ====================================================================== */
console.log('\n=== Price Support · максимум 75% ===');
{
  check('поддържаните нива са точно 10/20/30/50/75', eq(PS_LEVELS, [10, 20, 30, 50, 75]),
    JSON.stringify(PS_LEVELS));
  check('100% не е в списъка', !PS_LEVELS.includes(100));
  check('автоматичните се проверяват отгоре надолу',
    eq(PS_LEVELS_AUTOMATIC, [75, 50, 30, 20, 10]), JSON.stringify(PS_LEVELS_AUTOMATIC));
  check('таванът е 75', PS_MAX_AUTOMATIC === 75);

  // Нито една комбинация не може да произведе ниво над 75.
  let over = [], hundred = [];
  for (const q5 of ['benefit', 'price-support', 'both', 'unsure']) {
    for (const q2 of Q2_BANDS) {
      for (const q3 of q3RangesFor(q2)) {
        const set = budgetBands(q2, q3, q5);
        for (const bd of set.bands) {
          const r = recommend({
            q1: { cities: ['sofia'], sofiaOffices: '1' },
            q2, q3, q4: ['vending'], q5, q6: bd.id,
          });
          if (!r || r.psLevel === null) continue;
          if (r.psLevel > 75) over.push(q2 + '/' + q3 + '/' + q5 + '/' + bd.id + '=' + r.psLevel);
          if (r.psLevel === 100) hundred.push(q2 + '/' + q3 + '/' + q5 + '/' + bd.id);
        }
      }
    }
  }
  check('нито една препоръка не надхвърля 75%', over.length === 0, over.slice(0, 3).join(', '));
  check('100% не се препоръчва никъде', hundred.length === 0, hundred.slice(0, 3).join(', '));

  // Бюджет далеч над нужното за 75% пак спира на 75%.
  const set = budgetBands('101-150', '75-99', 'price-support');
  const top = set.bands.find((b) => b.kind === 'open');
  const rTop = recommend({
    q1: { cities: ['sofia'], sofiaOffices: '1' }, q2: '101-150', q3: '75-99',
    q4: ['vending'], q5: 'price-support', q6: top.id,
  });
  check('най-горната лента дава точно 75%', rTop.psLevel === 75, String(rTop.psLevel));
  check('излишъкът НЕ става 100%', rTop.psLevel !== 100);

  // Много голям бюджет при „И двете" — пак 75%.
  const bset = budgetBands('301-500', '200-349', 'both');
  const btop = bset.bands.find((b) => b.kind === 'open');
  const rB = recommend({
    q1: { cities: ['sofia'], sofiaOffices: '1' }, q2: '301-500', q3: '200-349',
    q4: ['canteen'], q5: 'both', q6: btop.id,
  });
  check('Both при огромен бюджет също спира на 75%', rB.psLevel === 75, String(rB.psLevel));
}

/* ======================================================================
   20. GENKI FIT КОД
   ====================================================================== */
console.log('\n=== Genki Fit код ===');
{
  const code = newFitCode();
  check('форматът е GF-XXXX-XXXX', CODE_PATTERN.test(code), code);
  check('дължината е 12', code.length === 12, String(code.length));
  check('главни букви', code === code.toUpperCase());

  const AMBIGUOUS = ['O', '0', 'I', '1', 'L', 'U'];
  check('азбуката не съдържа двусмислени знаци',
    !AMBIGUOUS.some((c) => CODE_ALPHABET.includes(c)), CODE_ALPHABET);
  check('азбуката е 30 знака', CODE_ALPHABET.length === 30, String(CODE_ALPHABET.length));

  const many = Array.from({ length: 400 }, () => newFitCode());
  check('всички са с правилен формат', many.every((c) => CODE_PATTERN.test(c)));
  check('няма двусмислени знаци в 400 кода',
    !many.some((c) => AMBIGUOUS.some((a) => c.slice(3).includes(a))));
  check('не е нарастващ брояч', new Set(many).size > 395, String(new Set(many).size));
  check('не съдържа лична информация', many.every((c) => /^GF-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(c)));

  // Подаден източник на случайност — за възпроизводимост в тестовете.
  const fixed = newFitCode((arr) => { for (let i = 0; i < arr.length; i++) arr[i] = 0; });
  check('приема подаден източник на случайност', CODE_PATTERN.test(fixed), fixed);
  check('нула дава първия знак от азбуката', fixed === 'GF-2222-2222', fixed);
}

/* ======================================================================
   21. СЪРВЪРЪТ
   ====================================================================== */
console.log('\n=== Сървърен handler ===');
{
  let calls = [];
  const mockFetch = (mode = 'ok') => async (url, opts) => {
    calls.push({ url, body: JSON.parse(opts.body) });
    if (mode === 'fail') return { ok: false, status: 500, text: async () => 'mock failure' };
    if (mode === 'customer-fail') {
      const b = JSON.parse(opts.body);
      const internal = b.to === 'hello@genki.bg';
      return internal
        ? { ok: true, status: 200, text: async () => '{}' }
        : { ok: false, status: 500, text: async () => 'mock failure' };
    }
    if (mode === 'internal-fail') {
      const b = JSON.parse(opts.body);
      const internal = b.to === 'hello@genki.bg';
      return internal
        ? { ok: false, status: 500, text: async () => 'mock failure' }
        : { ok: true, status: 200, text: async () => '{}' };
    }
    return { ok: true, status: 200, text: async () => '{}' };
  };

  const ctx = (body, { env = {}, method = 'POST', badJson = false, ip = '9.9.9.9' } = {}) => ({
    request: {
      method,
      headers: { get: (h) => (h === 'CF-Connecting-IP' ? ip : null) },
      json: async () => { if (badJson) throw new Error('bad json'); return body; },
    },
    env,
  });

  const REQ = {
    cities: ['sofia'], sofiaOffices: '1', q2: '101-150', q3: '75-99',
    q4: ['vending'], q5: 'both', q6: 'b1',
    email: 'hr@primerna.bg', lang: 'bg',
  };
  const KEY = { RESEND_API_KEY: 'test-key' };
  const bodyOf = async (res) => JSON.parse(await res.text());

  const realFetch = globalThis.fetch;
  globalThis.fetch = mockFetch();

  check('GET се отказва', (await onRequest(ctx(REQ, { method: 'GET' }))).status === 405);
  check('счупен JSON → 400', (await onRequestPost(ctx(null, { badJson: true }))).status === 400);
  check('масив вместо обект → 400', (await onRequestPost(ctx([]))).status === 400);

  /* --- валидация на получателя --- */
  check('валиден адрес минава', validateDestination({ email: 'a@b.bg' }).ok);
  check('липсващ адрес пада', !validateDestination({}).ok);
  check('нескопосан адрес пада', !validateDestination({ email: 'nope' }).ok);
  check('адрес без домейн пада', !validateDestination({ email: 'a@b' }).ok);
  check('прекалено дълъг адрес пада',
    !validateDestination({ email: 'a'.repeat(250) + '@b.bg' }).ok);
  check('непознат език пада към bg', validateDestination({ email: 'a@b.bg', lang: 'de' }).lang === 'bg');
  check('en се запазва', validateDestination({ email: 'a@b.bg', lang: 'en' }).lang === 'en');
  check('име и компания вече НЕ се искат',
    validateDestination({ email: 'a@b.bg' }).ok &&
    validateDestination({ email: 'a@b.bg' }).name === undefined);

  const bad = await onRequestPost(ctx({ ...REQ, q3: '700-999' }, { env: KEY }));
  check('Q3 от чужд Q2 → 422', bad.status === 422);

  const noEmail = await onRequestPost(ctx({ ...REQ, email: 'nope' }, { env: KEY }));
  check('невалиден email → 422', noEmail.status === 422);
  check('грешката сочи полето', (await bodyOf(noEmail)).fields.includes('email'));

  calls = [];
  const hp = await onRequestPost(ctx({ ...REQ, website: 'spam' }, { env: KEY }));
  check('honeypot → 200 без изпращане', hp.status === 200 && calls.length === 0);

  /* --- успешен път: ДВА имейла --- */
  calls = [];
  const okRes = await onRequestPost(ctx(REQ, { env: KEY }));
  const okBody = await bodyOf(okRes);
  check('валидна заявка → 200', okRes.status === 200, String(okRes.status));
  check('изпратени са точно два имейла', calls.length === 2, String(calls.length));

  const internalCall = calls.find((c) => c.body.to === 'hello@genki.bg');
  const customerCall = calls.find((c) => c.body.to === 'hr@primerna.bg');
  check('единият отива до hello@genki.bg', !!internalCall);
  check('другият отива до клиента', !!customerCall);
  check('вътрешният има reply_to към клиента', internalCall.body.reply_to === 'hr@primerna.bg');

  check('отговорът носи кода', CODE_PATTERN.test(okBody.code), okBody.code);
  check('отговорът носи адреса', okBody.email === 'hr@primerna.bg');
  check('един и същ код в двата имейла',
    internalCall.body.text.includes(okBody.code) && customerCall.body.text.includes(okBody.code));
  check('кодът е и в темите',
    internalCall.body.subject.includes(okBody.code) && customerCall.body.subject.includes(okBody.code));

  check('отговорът не носи вътрешни полета',
    !JSON.stringify(okBody).match(/score|tier|salesM|threshold|margin/i),
    JSON.stringify(okBody).slice(0, 120));

  /* --- клиентът не може да наложи код или препоръка --- */
  calls = [];
  const forged = await onRequestPost(ctx(
    { ...REQ, code: 'GF-XXXX-XXXX', recommendation: { approach: 'both', psLevel: 100 } },
    { env: KEY }));
  const forgedBody = await bodyOf(forged);
  check('подхвърлен код се игнорира', forgedBody.code !== 'GF-XXXX-XXXX', forgedBody.code);
  check('подхвърлена препоръка се игнорира',
    !calls.some((c) => c.body.text.includes('100%')));

  /* --- два пъти подред дават различни кодове --- */
  const a1 = await bodyOf(await onRequestPost(ctx(REQ, { env: KEY })));
  const a2 = await bodyOf(await onRequestPost(ctx(REQ, { env: KEY })));
  check('всяко изпращане получава нов код', a1.code !== a2.code);

  const noKey = await onRequestPost(ctx(REQ, { env: {} }));
  check('без ключ → 500 not_configured', noKey.status === 500 && (await bodyOf(noKey)).error === 'not_configured');

  const testMode = await onRequestPost(ctx(REQ, { env: { ...KEY, CONTACT_TEST_MODE: '1' } }));
  const tmBody = await bodyOf(testMode);
  check('тестов режим не праща', tmBody.mode === 'test');
  check('тестовият режим пак връща код', CODE_PATTERN.test(tmBody.code));

  /* --- провали --- */
  globalThis.fetch = mockFetch('customer-fail');
  const custFail = await onRequestPost(ctx(REQ, { env: KEY }));
  check('провал на клиентския имейл → 502', custFail.status === 502);
  check('не се твърди успех', (await bodyOf(custFail)).ok === false);

  globalThis.fetch = mockFetch('internal-fail');
  const intFail = await onRequestPost(ctx(REQ, { env: KEY }));
  check('провал само на вътрешния НЕ проваля човека', intFail.status === 200,
    String(intFail.status));

  globalThis.fetch = mockFetch();

  /* --- rate limit --- */
  const store = new Map();
  const kvEnv = {
    ...KEY,
    GENKI_RATE: {
      get: async (k) => store.get(k) || null,
      put: async (k, v) => { store.set(k, v); },
    },
  };
  let limited = 0;
  for (let i = 0; i < 7; i++) {
    const r = await onRequestPost(ctx(REQ, { env: kvEnv }));
    if (r.status === 429) limited++;
  }
  check('rate limit спира след 5 заявки', limited === 2, 'блокирани: ' + limited);
  check('ключът е отделен от този на контакта',
    [...store.keys()].every((k) => k.startsWith('fit:')), [...store.keys()].join(','));

  const noKv = await onRequestPost(ctx(REQ, { env: KEY }));
  check('без KV binding пак работи', noKv.status === 200);

  globalThis.fetch = realFetch;
}

/* ======================================================================
   22. ИМЕЙЛЪТ ДО КЛИЕНТА
   ====================================================================== */
console.log('\n=== Имейл до клиента ===');
{
  const v = validateAnswers({
    cities: ['sofia'], sofiaOffices: '2', q2: '151-300', q3: '150-199',
    q4: ['canteen'], q5: 'both', q6: 'b2',
  });
  const rec = recommend(v.answers);
  const CODE = 'GF-K7M4-P9Q2';

  for (const lg of ['bg', 'en']) {
    const m = buildCustomerEmail(v.answers, rec, CODE, lg);
    check(lg + ': темата носи кода', m.subject.includes(CODE), m.subject);
    check(lg + ': темата е на един ред', !/[\r\n]/.test(m.subject));
    check(lg + ': кодът е в текста', m.text.includes(CODE));
    check(lg + ': кодът е в HTML-а', m.html.includes(CODE));
    check(lg + ': кодът се повтаря към края',
      m.html.split(CODE).length - 1 >= 2, String(m.html.split(CODE).length - 1));
    check(lg + ': има препоръка', m.text.includes(rec.hardware === 'duo'
      ? (lg === 'bg' ? 'по-голям офис' : 'larger workplace') : ''), m.text.slice(0, 40));
    check(lg + ': има обобщение на офиса',
      m.text.includes(lg === 'bg' ? 'Вашият офис' : 'Your workplace'));
    check(lg + ': има „защо пасва"',
      m.text.includes(lg === 'bg' ? 'Защо това е подходящо' : 'Why this fits'));
    check(lg + ': има уговорка за реалното пространство',
      m.text.includes(lg === 'bg' ? 'реалното пространство' : 'the real space'));
    check(lg + ': има подкана да пазят кода',
      m.text.includes(lg === 'bg' ? 'Запазете този код' : 'Keep this code'));

    // Нито едно вътрешно число не изтича.
    check(lg + ': няма коефициент 9,90', !/9[.,]90/.test(m.text + m.html));
    check(lg + ': няма скор /100', !/\/\s*100\b/.test(m.text));
    check(lg + ': няма Ideal/Strong/Low Fit', !/Ideal|Strong Fit|Low Fit/i.test(m.text + m.html));
    check(lg + ': няма Single/Duo', !/\b(Single|Duo)\b/.test(m.text + m.html));
    check(lg + ': няма прогнозни продажби', !/salesM|Прогнозни продажби/i.test(m.text + m.html));
    check(lg + ': няма праг T20/T50/T75', !/\bT(20|50|75)\b/.test(m.text + m.html));

    // Имейл-безопасен HTML.
    check(lg + ': без <script>', !/<script/i.test(m.html));
    check(lg + ': без външни изображения', !/<img/i.test(m.html));
    check(lg + ': има таблица за оформление', /<table/i.test(m.html));
    check(lg + ': има HTML и текстова версия', m.html.length > 500 && m.text.length > 200);
  }

  // Екраниране.
  const evil = validateAnswers({
    cities: ['sofia'], sofiaOffices: '1', q2: 'lte50', q3: '25-49',
    q4: ['none'], q5: 'price-support', q6: 'b2',
  });
  const em = buildCustomerEmail(evil.answers, recommend(evil.answers), '<script>x</script>', 'bg');
  check('кодът се екранира в HTML', em.html.includes('&lt;script&gt;') && !em.html.includes('<script>'));

  // Мекият резултат също получава имейл, без нито дума за отказ.
  const softV = validateAnswers({
    cities: ['plovdiv'], q2: 'lte50', q3: 'lt25', q4: ['none'], q5: 'price-support', q6: 'b0',
  });
  const softRec = recommend(softV.answers);
  const softMail = buildCustomerEmail(softV.answers, softRec, CODE, 'bg');
  check('мекият резултат също праща имейл', softMail.text.includes(CODE));
  check('мекият имейл носи каноничното заглавие',
    softMail.text.includes('Нека намерим правилния Genki'));
  check('мекият имейл няма дума за отказ',
    !/съжаление|неподходящ|отказ|не отговаряте/i.test(softMail.text));
}

/* ======================================================================
   23. ВЪТРЕШНИЯТ ИМЕЙЛ
   ====================================================================== */
console.log('\n=== Вътрешен имейл ===');
{
  const v = validateAnswers({
    cities: ['sofia', 'plovdiv'], sofiaOffices: '3plus', q2: '301-500', q3: '200-349',
    q4: ['canteen'], q5: 'both', q6: 'b2', largestOffice: '151-300',
  });
  const rec = recommend(v.answers);
  const CODE = 'GF-K7M4-P9Q2';
  const meta = {
    timestamp: '2026-09-22T09:17:00.000Z', email: 'hr@x.bg', lang: 'bg',
    referrer: '', utm: 'utm_source=linkedin',
  };
  const m = buildInternalEmail(v.answers, rec, CODE, meta);

  check('темата носи кода', m.subject.includes(CODE), m.subject);
  check('темата е на един ред', !/[\r\n]/.test(m.subject));
  check('носи кода в тялото', m.text.includes(CODE));
  check('носи email на клиента', m.text.includes('hr@x.bg'));
  check('носи езика', m.text.includes('BG'));
  check('носи суровите Q1–Q6',
    m.text.includes('sofia') && m.text.includes('301-500') &&
    m.text.includes('200-349') && m.text.includes('canteen') && m.text.includes('both'));
  check('носи най-големия офис', m.text.includes('151-300'));
  check('носи attendanceMin/Max', m.text.includes('200 / 349'));
  check('носи budgetMin/Max', /Q6 · budgetMin \/ Max: \d+ \/ \d+/.test(m.text), m.text.match(/Q6 · budgetMin[^\n]*/));
  check('носи хардуерния кандидат', /Mini|Single|Duo|Няколко точки/.test(m.text));
  check('носи търговския маршрут', m.text.includes('Genki + Benefit'));
  check('носи вътрешното PS ниво', /Price Support \(вътрешно\): \d+%/.test(m.text));
  check('носи скора', /\d+ \/ 100/.test(m.text));
  check('носи UTM', m.text.includes('utm_source=linkedin'));

  // Време.
  const sofia = formatSofiaDateTime(meta.timestamp, 'bg', { suffix: true });
  check('софийско време', m.text.includes(sofia), sofia);
  check('12:17 софийско (лятно)', sofia.includes('12:17'), sofia);
  check('машинното UTC също е налично', m.text.includes('2026-09-22T09:17:00.000Z'));
  check('няма зашито отместване', !/UTC\+[23]|\+03:00|\+02:00/.test(m.text));

  const winter = formatSofiaDateTime('2026-12-20T09:17:00.000Z', 'bg');
  check('зимата е 11:17 софийско', winter.includes('11:17'), winter);

  check('HTML-ът екранира', buildInternalEmail(v.answers, rec, '<b>x</b>', meta)
    .html.includes('&lt;b&gt;'));
}

/* ======================================================================
   24. BG / EN · нито един непреведен низ
   ====================================================================== */
console.log('\n=== BG / EN ===');
{
  const src = readFileSync(new URL('../../js/genki-translations.js', import.meta.url), 'utf8');
  const sandbox = { window: {} };
  new Function('window', src).call(sandbox, sandbox.window);
  const dict = sandbox.window.genkiTranslations;

  const fitKeys = Object.keys(dict).filter((k) => k.startsWith('fit.'));
  check('има низове за Genki Fit', fitKeys.length > 60, String(fitKeys.length));

  const missing = fitKeys.filter((k) => !dict[k] || typeof dict[k].bg !== 'string' || typeof dict[k].en !== 'string');
  check('всеки fit ключ има и bg, и en', missing.length === 0, missing.slice(0, 5).join(', '));

  const empty = fitKeys.filter((k) => !dict[k].bg.trim() || !dict[k].en.trim());
  check('нито един празен превод', empty.length === 0, empty.slice(0, 5).join(', '));

  const BRAND_TERMS = ['Genki', 'Fit', 'Benefit', 'Price Support', 'Vending', 'catering', 'snacks'];
  const nothingToTranslate = (str) => {
    let rest = str.replace(/\{[a-z]+\}/gi, '');
    for (const term of BRAND_TERMS.slice().sort((a, b) => b.length - a.length)) {
      rest = rest.replace(new RegExp('\\b' + term + '\\b', 'gi'), '');
    }
    const words = rest.match(/[A-Za-zА-Яа-я]{2,}/g);
    return !words || words.length === 0;
  };
  const same = fitKeys.filter((k) => dict[k].bg === dict[k].en && !nothingToTranslate(dict[k].bg));
  check('няма непреведени низове (bg === en)', same.length === 0, same.slice(0, 5).join(', '));

  /* --- каноничното copy, дословно --- */
  check('BG hero е каноничният',
    dict['fit.hero.title'].bg === 'Какъв Genki би работил най-добре при вас?');
  check('EN hero е каноничният',
    dict['fit.hero.title'].en === 'What kind of Genki would work best for your workplace?');
  check('BG „ГОТОВО."', dict['fit.result.done'].bg === 'ГОТОВО.');
  check('EN „DONE."', dict['fit.result.done'].en === 'DONE.');
  check('Q3 носи заключената формулировка',
    dict['fit.q3.title'].bg === 'Колко души обикновено са в този офис в един нормален работен ден?');
  check('Q3 помощният текст е заключеният',
    dict['fit.q3.help'].bg === 'Не общият брой служители — хората, които реално са на място.');
  check('Q3 EN е заключеният',
    dict['fit.q3.title'].en === 'How many people are usually in this office on a normal working day?');

  /* --- новото copy на вторичните действия --- */
  check('BG изпращане', dict['fit.send.action'].bg === 'Изпратете ми този Genki Fit');
  check('EN изпращане', dict['fit.send.action'].en === 'Send me this Genki Fit');
  check('BG „ще изпратим на"', dict['fit.send.to'].bg === 'Ще изпратим Fit-а на:');
  check('EN „ще изпратим на"', dict['fit.send.to'].en === 'We’ll send your Fit to:');
  check('EN „Change"', dict['fit.send.change'].en === 'Change');
  check('BG успех носи адреса', dict['fit.send.done'].bg.includes('{email}'));
  check('BG успех не казва „inbox"', !/inbox/i.test(dict['fit.send.done'].bg));
  check('EN успех не казва „inbox"', !/inbox/i.test(dict['fit.send.done'].en));
  check('BG кодът се показва', dict['fit.send.done.code'].bg.includes('{code}'));
  check('EN кодът се показва', dict['fit.send.done.code'].en.includes('{code}'));
  check('BG подкана да се пази кодът', dict['fit.send.done.keep'].bg.includes('Запазете го'));
  check('BG контакт', dict['fit.contact.action'].bg === 'Свържете се с Genki');
  check('EN контакт', dict['fit.contact.action'].en === 'Talk to Genki');

  /* --- българският е на „Вие" навсякъде, без смесване --- */
  const bgAll = fitKeys.map((k) => dict[k].bg).join(' ');
  check('няма „твоят / твоя"', !/\bтво[йяеи]\w*/i.test(bgAll), (bgAll.match(/\bтво\w+/i) || [])[0]);
  check('няма „се свържеш / запази го" на ти',
    !/свържеш|запази\b|изпрати ми|говори с/i.test(bgAll),
    (bgAll.match(/свържеш|запази\b|изпрати ми|говори с/i) || [])[0]);

  /* --- няма отметка за контакт --- */
  check('няма отметка „свържете се с мен"',
    !fitKeys.some((k) => /contact.?me|искам.*да се свържете|request.?contact/i.test(dict[k].bg + dict[k].en)));

  /* --- забранени публични изтичания --- */
  const all = fitKeys.map((k) => dict[k].bg + ' ' + dict[k].en).join(' ');
  check('никъде не пише Single/Duo', !/\b(Single|Duo)\b/.test(all));
  check('никъде не пише 9,90 / 9.90', !/9[.,]90/.test(all));
  check('никъде не пише Ideal/Strong/Low Fit', !/Ideal Fit|Strong Fit|Low Fit/i.test(all));
  check('никъде няма скор /100', !/\/\s*100/.test(all));
  check('няма BGN / лв.', !/\bBGN\b|\bлв\./.test(all));
  check('няма „запазете среща" без система за резервация',
    !/запазете среща|book a (demo|meeting)|contact sales/i.test(all));

  /* --- имейл модулът не бива да се разминава със страницата --- */
  const drift = Object.keys(SHARED).filter((k) => {
    const a = dict[k];
    return !a || a.bg !== SHARED[k].bg || a.en !== SHARED[k].en;
  });
  check('имейлът ползва СЪЩИТЕ изречения като страницата',
    drift.length === 0, drift.slice(0, 5).join(', '));
  check('споделените низове са смислен брой', Object.keys(SHARED).length >= 20,
    String(Object.keys(SHARED).length));
}

/* ======================================================================
   ОБОБЩЕНИЕ
   ====================================================================== */
console.log('\n' + '─'.repeat(52));
console.log(`РЕЗУЛТАТ: ${pass} минали, ${fail} паднали`);
if (fail) {
  console.log('\nПаднали:');
  failures.forEach((f) => console.log('  • ' + f));
  process.exit(1);
}
console.log('Нито един реален имейл не е изпратен.');
