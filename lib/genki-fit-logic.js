// Genki Fit — чистата логика. Нула DOM, нула мрежа, нула локализация.
//
// ЕДИН ИЗТОЧНИК ЗА ТРИ МЕСТА
//   • браузърът (js/genki-fit.js) — за да покаже резултата веднага;
//   • сървърът (functions/api/genki-fit.js) — пресмята НАНОВО и не вярва
//     на клиента;
//   • тестовете (tools/dev/test-genki-fit.mjs).
//
// Модулът връща КЛЮЧОВЕ и ЧИСЛА, не текст. Текстът е в
// js/genki-translations.js и е двуезичен.
//
// ГРАНИЦА
//   Тук не се измислят бизнес правила. Всяко число по-долу идва от
//   заключената спецификация на етап 7 или от docs/GENKI-2.0-BRIEF.md.
//   Местата, където спецификацията изрично оставя нещо „configurable",
//   са събрани в SCORE_CONFIG и са обозначени.

/* ==========================================================================
   1. ПРОГНОЗЕН МОДЕЛ — V1
   ========================================================================== */

// Заключено на етап 7. Старият коефициент €15,62 е ОТМЕНЕН.
//   20% дневна адопция × 1,3 продукта на купувач = 0,26 продукта
//   на присъстващ на ден. Среднопретеглена цена на рафта €1,73 с ДДС.
//   22 работни дни: 0,26 × 1,73 × 22 ≈ 9,90.
//
// ВЪТРЕШНО ДОПУСКАНЕ ЗА ПРОГНОЗА. Никога не се показва публично и не се
// представя като гарантиран оборот.
export const FORECAST = {
  dailyAdoption: 0.20,
  itemsPerBuyer: 1.3,
  avgShelfPriceInclVat: 1.73,
  officeDaysPerMonth: 22,
  // Каноничният работен коефициент: € брутни месечни продажби на рафта
  // на един присъстващ на ден.
  grossPerAttendeePerMonth: 9.90,
};

/* ==========================================================================
   2. ВЪПРОСИТЕ — заключени стойности
   ========================================================================== */

export const Q1_CITIES = ['sofia', 'plovdiv', 'varna', 'burgas', 'other'];
export const Q1_SOFIA_OFFICES = ['1', '2', '3plus'];

// Забележка към спецификацията: каноничният документ изписва предпоследния
// диапазон като „501–1,000", а вътрешната скорова таблица на брифа и
// спецификацията на етап 7 го изписват „501–999". Тук важи 501–999 —
// иначе 1 000 щеше да попада в два диапазона едновременно.
export const Q2_BANDS = ['lte50', '51-100', '101-150', '151-300', '301-500', '501-999', '1000+'];

export const Q4_OPTIONS = ['canteen', 'vending', 'fruit', 'other', 'none'];
export const Q5_OPTIONS = ['benefit', 'price-support', 'both', 'unsure'];

/* --- Q3: динамични диапазони спрямо Q2 — ЗАКЛЮЧЕНИ ---------------------- */

export const Q3_RANGES_BY_Q2 = {
  'lte50':   ['lt25', '25-49', '50'],
  '51-100':  ['lt25', '25-49', '50-74', '75-100'],
  '101-150': ['lt25', '25-49', '50-74', '75-99', '100-150'],
  '151-300': ['lt25', '25-49', '50-74', '75-149', '150-199', '200-300'],
  '301-500': ['lt50', '50-74', '75-199', '200-349', '350-500'],
  '501-999': ['lt50', '50-74', '75-199', '200-399', '400-699', '700-999'],
  '1000+':   ['lt50', '50-74', '75-199', '200-499', '500-999', '1000+'],
};

// Каноничното съответствие диапазон → граници. Никога не се изчислява
// среда: и min, и max пътуват до сървъра и до CRM-а.
export const ATTENDANCE_BOUNDS = {
  'lt25':    { min: 1,    max: 24 },
  '25-49':   { min: 25,   max: 49 },
  '50':      { min: 50,   max: 50 },
  'lt50':    { min: 1,    max: 49 },
  '50-74':   { min: 50,   max: 74 },
  '75-99':   { min: 75,   max: 99 },
  '75-100':  { min: 75,   max: 100 },
  '75-149':  { min: 75,   max: 149 },
  '75-199':  { min: 75,   max: 199 },
  '100-150': { min: 100,  max: 150 },
  '150-199': { min: 150,  max: 199 },
  '200-300': { min: 200,  max: 300 },
  '200-349': { min: 200,  max: 349 },
  '200-399': { min: 200,  max: 399 },
  '200-499': { min: 200,  max: 499 },
  '350-500': { min: 350,  max: 500 },
  '400-699': { min: 400,  max: 699 },
  '500-999': { min: 500,  max: 999 },
  '700-999': { min: 700,  max: 999 },
  // Отворен край. Таван НЕ се измисля.
  '1000+':   { min: 1000, max: null },
};

export function q3RangesFor(q2) {
  return Q3_RANGES_BY_Q2[q2] ? Q3_RANGES_BY_Q2[q2].slice() : null;
}

export function attendanceBounds(rangeId) {
  const b = ATTENDANCE_BOUNDS[rangeId];
  return b ? { min: b.min, max: b.max } : null;
}

/* ==========================================================================
   3. ХАРДУЕР — вътрешни работни граници V1
   ========================================================================== */

// Mini е активен Genki формат: екран + платежен модул, ~50 продукта общо,
// до 12 уникални SKU, €95/месец. „App Only" НЕ е в обхвата.
//
// Това са ВЪТРЕШНИ работни граници за V1, не доказана физическа истина и
// не публично твърдение. Реалната конфигурация зависи и от етажи, зони и
// геометрия на офиса — за които Genki Fit нарочно НЕ пита в V1.
// Затова изходът е „вероятен размер", никога „точно една Duo".
export const HARDWARE_BOUNDARIES = [50, 75, 200];

export function hardwareCandidate(attendanceMin) {
  if (attendanceMin < 50) return 'mini';
  if (attendanceMin < 75) return 'single';
  if (attendanceMin < 200) return 'duo';
  return 'multi';
}

/* ==========================================================================
   4. GENKI BENEFIT — канонични такси
   ========================================================================== */

// fee    — точната вътрешна такса, ex VAT (бриф раздел 3).
// anchor — публично закръглената котва, с която се строят бюджетните ленти.
// null   — Benefit е custom; число НЕ се измисля.
export const BENEFIT_BY_Q2 = {
  'lte50':   { fee: 599, anchor: 600 },
  '51-100':  { fee: 599, anchor: 600 },
  '101-150': { fee: 599, anchor: 600 },
  '151-300': { fee: 799, anchor: 800 },
  '301-500': { fee: 999, anchor: 1000 },
  '501-999': null,
  '1000+':   null,
};

export function benefitFor(q2) {
  const b = BENEFIT_BY_Q2[q2];
  return b ? { fee: b.fee, anchor: b.anchor } : null;
}

/* ==========================================================================
   5. ИКОНОМИКА
   ========================================================================== */

export function round50(x) {
  return Math.ceil(x / 50) * 50;
}

/**
 * Очаквани брутни месечни продажби на рафта.
 * Без средна стойност — краищата пътуват отделно.
 * Отворената посещаемост дава salesMax === null. Таван не се измисля.
 */
export function expectedSales(bounds) {
  if (!bounds) return null;
  return {
    salesMin: bounds.min * FORECAST.grossPerAttendeePerMonth,
    salesMax: bounds.max === null ? null : bounds.max * FORECAST.grossPerAttendeePerMonth,
  };
}

// Вътрешни нива на Product Price Support. 100% съществува търговски, но
// НИКОГА не се препоръчва автоматично — минава през разговор (бриф р. 17).
export const PS_LEVELS = [10, 20, 30, 50, 100];
export const PS_LEVELS_AUTOMATIC = [50, 30, 20, 10];   // проверяват се отгоре надолу

/**
 * Праговете, от които се строят бюджетните ленти за Price Support.
 * ceiling е salesMax; при отворена посещаемост подаваме salesMin —
 * това е единствената РЕАЛНО известна граница, а не измислен таван.
 */
export function psThresholds(ceiling) {
  return {
    t20: round50(ceiling * 0.20),
    t50: round50(ceiling * 0.50),
    t100: round50(ceiling * 1.00),
  };
}

/* ==========================================================================
   6. БЮДЖЕТНИ ЛЕНТИ (Q6)
   ========================================================================== */

/**
 * Последователни ленти от възходящи горни граници.
 * Дублиращите се граници се отсяват — така при закръгляне никога не
 * излиза лента с нулева или отрицателна ширина.
 */
function contiguousBands(upperBounds, startAt) {
  const edges = [];
  let prev = startAt - 1;
  for (const raw of upperBounds) {
    const v = Math.round(raw);
    if (v > prev) { edges.push(v); prev = v; }
  }
  const out = [];
  let lo = startAt;
  for (const hi of edges) {
    out.push({ min: lo, max: hi });
    lo = hi + 1;
  }
  out.push({ min: lo, max: null });
  return out;
}

function withIds(bands, kinds) {
  return bands.map((b, i) => ({
    id: 'b' + i,
    min: b.min,
    max: b.max,
    kind: b.max === null ? 'open' : (kinds && kinds[i]) || 'range',
  }));
}

const NOT_SURE_BAND = { id: 'notsure', min: null, max: null, kind: 'notsure' };

/**
 * Генерира бюджетните ленти за Q6 от вече дадените отговори.
 *
 * Връща { mode, bands, thresholds, benefit, openEnded }.
 *   mode: 'price-support' | 'benefit' | 'both' | 'custom'
 *   'custom' значи: Benefit е custom за този размер (Q2 501+) и число
 *   НЕ се измисля — въпросът минава по пътя за консултация.
 */
export function budgetBands(q2, q3, q5) {
  const bounds = attendanceBounds(q3);
  const benefit = benefitFor(q2);
  if (!bounds || !Q5_OPTIONS.includes(q5) || !Q2_BANDS.includes(q2)) return null;

  const sales = expectedSales(bounds);
  const openEnded = sales.salesMax === null;

  // При отворена посещаемост праговете стъпват на salesMin — известната
  // долна граница. Таван не се изобретява; несигурността се носи нататък
  // през openEnded и води до консултация.
  const ceiling = openEnded ? sales.salesMin : sales.salesMax;
  const thresholds = psThresholds(ceiling);

  // „Още не сме сигурни" се държи като Both: това дава най-силния
  // квалификационен сигнал, без човекът да трябва да разбира търговската
  // архитектура предварително. Причината не се показва публично.
  const effective = q5 === 'unsure' ? 'both' : q5;

  // Лентите, стъпили само на икономиката на Price Support. Ползват се и
  // за чистия PS избор, и за custom пътя при Q2 501+: там Benefit няма
  // публична цена, но въпросът за бюджет трябва да остане отговорим.
  const psShapedBands = () => withIds(
    contiguousBands([0, thresholds.t20, thresholds.t50, thresholds.t100], 0),
    ['zero', 'upto', 'range', 'range', 'open']
  ).concat([NOT_SURE_BAND]);

  if (effective === 'price-support') {
    return { mode: 'price-support', bands: psShapedBands(), thresholds, benefit, openEnded };
  }

  if (effective === 'benefit') {
    // Q2 501+: Benefit е custom. Число НЕ се измисля — въпросът остава
    // реален чрез икономиката на Price Support, а маршрутът е консултация.
    if (!benefit) return { mode: 'custom', bands: psShapedBands(), thresholds, benefit: null, openEnded };
    // Долната лента свършва на точната такса; средната — точно под 1,5×
    // публичната котва. Дава 0–599 / 600–899 / 900+ и съответните за
    // 799 и 999, както е заключено.
    const bands = withIds(
      contiguousBands([benefit.fee, round50(benefit.anchor * 1.5) - 1], 0),
      ['range', 'range', 'open']
    );
    return { mode: 'benefit', bands: bands.concat([NOT_SURE_BAND]), thresholds, benefit, openEnded };
  }

  // both
  if (!benefit) return { mode: 'custom', bands: psShapedBands(), thresholds, benefit: null, openEnded };
  const base = benefit.anchor;
  const bands = withIds(
    contiguousBands(
      [base - 1, base + thresholds.t20 - 1, base + thresholds.t50 - 1, base + thresholds.t100 - 1],
      0
    ),
    ['range', 'range', 'range', 'range', 'open']
  );
  return { mode: 'both', bands: bands.concat([NOT_SURE_BAND]), thresholds, benefit, openEnded };
}

export function findBand(bandSet, id) {
  if (!bandSet) return null;
  return bandSet.bands.find((b) => b.id === id) || null;
}

/* ==========================================================================
   7. ПРЕПОРЪКА
   ========================================================================== */

/**
 * Известната горна граница на избраната лента.
 *   крайна лента  → нейният max (спецификацията казва „its known upper bound")
 *   отворена лента → нейният min: единственото, което със сигурност знаем
 *   „не сме сигурни" → null
 */
function budgetCeiling(band) {
  if (!band || band.kind === 'notsure') return null;
  return band.max === null ? band.min : band.max;
}

/**
 * Най-високото АВТОМАТИЧНО ниво на Price Support, чието requiredMax се
 * побира в тавана. Консервативно: винаги срещу горния край на
 * посещаемостта, никога срещу средата и никога срещу долния край.
 */
function highestPsLevel(salesMax, ceiling, fixedExtra) {
  if (ceiling === null || salesMax === null) return null;
  for (const pct of PS_LEVELS_AUTOMATIC) {
    const requiredMax = salesMax * (pct / 100) + fixedExtra;
    if (requiredMax <= ceiling) return pct;
  }
  return null;
}

export function psRequirement(sales, pct, fixedExtra) {
  const extra = fixedExtra || 0;
  return {
    requiredMin: sales.salesMin * (pct / 100) + extra,
    requiredMax: sales.salesMax === null ? null : sales.salesMax * (pct / 100) + extra,
  };
}

/**
 * Главната функция.
 *
 * answers = { q1: {cities, sofiaOffices}, q2, q3, q4: [], q5, q6 }
 *
 * Връща публично безопасна препоръка плюс отделен internal блок, който
 * НИКОГА не пътува към браузъра.
 */
export function recommend(answers) {
  const bounds = attendanceBounds(answers && answers.q3);
  const bandSet = budgetBands(answers && answers.q2, answers && answers.q3, answers && answers.q5);
  if (!bounds || !bandSet) return null;

  const band = findBand(bandSet, answers.q6);
  if (!band) return null;

  const sales = expectedSales(bounds);
  const benefit = bandSet.benefit;
  const ceiling = budgetCeiling(band);
  const hardware = hardwareCandidate(bounds.min);
  const q5 = answers.q5;

  let outcome = 'consultation';
  let approach = 'custom';
  let psLevel = null;
  let reason = 'ambiguous';

  const zeroBudget = band.kind === 'zero' || (band.max === 0);
  const notSure = band.kind === 'notsure';

  if (bandSet.mode === 'custom') {
    // Q2 501+ и избор, който включва Benefit. Числова такса НЕ се измисля.
    outcome = 'consultation';
    approach = 'custom';
    reason = 'benefit-custom';
  } else if (notSure) {
    outcome = 'consultation';
    approach = 'custom';
    reason = 'budget-unknown';
  } else if (q5 === 'price-support') {
    if (zeroBudget) {
      // Бриф раздел 17, правилото за €0: при посещаемост ≥50 базовият
      // Genki може да се препоръча; под 50 — разговор. Mini промени
      // икономиката, затова <50 НЕ е „невъзможно", а маршрут.
      if (bounds.min >= 50) {
        outcome = 'recommendation';
        approach = 'core';
        reason = 'zero-budget-core';
      } else {
        outcome = 'consultation';
        approach = 'custom';
        reason = 'zero-budget-small';
      }
    } else {
      psLevel = highestPsLevel(sales.salesMax, ceiling, 0);
      if (psLevel) {
        outcome = 'recommendation';
        approach = 'price-support';
        reason = 'ps-fits';
      } else {
        outcome = 'consultation';
        approach = 'custom';
        reason = bandSet.openEnded ? 'open-ended' : 'ps-below';
      }
    }
  } else {
    // benefit | both | unsure — всички имат числова Benefit котва тук.
    const coversBenefit = band.min >= benefit.anchor;
    if (!coversBenefit) {
      outcome = 'consultation';
      approach = 'custom';
      reason = 'benefit-not-covered';
    } else if (q5 === 'benefit') {
      outcome = 'recommendation';
      approach = 'benefit';
      reason = 'benefit-fits';
    } else {
      // both | unsure: Benefit се финансира пръв, остатъкът отива в PS.
      psLevel = highestPsLevel(sales.salesMax, ceiling, benefit.fee);
      if (psLevel) {
        outcome = 'recommendation';
        approach = 'both';
        reason = 'both-fit';
      } else {
        // Benefit се побира, 10% PS — не. Бриф: препоръчва се само
        // Benefit, а Price Support може да се добави по-късно.
        outcome = 'recommendation';
        approach = 'benefit';
        reason = 'benefit-only-ps-later';
      }
    }
  }

  const employerBudget = roundedEmployerBudget(approach, psLevel, sales, benefit);

  return {
    outcome,
    approach,
    psLevel,
    hardware,
    reason,
    employerBudget,
    attendance: { min: bounds.min, max: bounds.max },
    budget: { id: band.id, min: band.min, max: band.max, kind: band.kind },
    openEnded: bandSet.openEnded,
    // Всичко оттук нататък е само за вътрешна употреба.
    internal: {
      salesMin: sales.salesMin,
      salesMax: sales.salesMax,
      thresholds: bandSet.thresholds,
      benefitFee: benefit ? benefit.fee : null,
      benefitAnchor: benefit ? benefit.anchor : null,
      budgetCeilingUsed: ceiling,
      psRequirement: psLevel ? psRequirement(sales, psLevel, approach === 'both' ? benefit.fee : 0) : null,
      score: leadScore(answers, { approach, psLevel, sales, benefit, band }),
    },
  };
}

/**
 * Закръгленият месечен бюджет на работодателя, който се ПОКАЗВА.
 * Без фалшива точност — стъпка от 50 €.
 */
function roundedEmployerBudget(approach, psLevel, sales, benefit) {
  if (approach === 'core') return { amount: 0, approx: false };
  if (approach === 'custom') return null;

  const psPart = psLevel && sales.salesMax !== null
    ? round50(sales.salesMax * (psLevel / 100))
    : 0;

  if (approach === 'benefit') return { amount: benefit.anchor, approx: false };
  if (approach === 'price-support') return { amount: psPart, approx: true };
  return { amount: benefit.anchor + psPart, approx: true };   // both
}

/* ==========================================================================
   8. ВЪТРЕШЕН СКОР — НИКОГА НЕ СЕ ПОКАЗВА
   ========================================================================== */

// Брифът раздел 16 дава точни таблици за Q2, Q3 и Q5. За Q1 и Q4 казва
// изрично, че съответствието „can remain configurable" — затова те живеят
// тук, обозначени. За Q6 брифът казва „against system-recommended budget",
// без да дефинира тази база; дефиницията е долу и също е configurable.
export const SCORE_CONFIG = {
  // Q1 — офиси и потенциал за разрастване, 5 точки.
  q1: { singleSite: 2, twoSofiaOffices: 3, threePlusSofiaOffices: 4, twoCities: 4, threePlusCities: 5 },
  // Q4 — култура на benefit-и, 10 точки. Взима се най-високото от избраните.
  q4: { canteen: 10, fruit: 8, vending: 6, other: 6, none: 3 },
  // Q6 — за база се ползва „системно препоръчаният бюджет": таксата за
  // Benefit, където е приложима, плюс Price Support на референтното ниво.
  referencePsLevel: 20,
};

const Q2_SCORE = {
  '1000+': 20, '501-999': 19, '301-500': 17, '151-300': 14,
  '101-150': 11, '51-100': 7, 'lte50': 3,
};

const Q5_SCORE = { both: 15, benefit: 13, 'price-support': 11, unsure: 7 };

function q3Score(attendanceMin) {
  if (attendanceMin >= 200) return 30;
  if (attendanceMin >= 150) return 27;
  if (attendanceMin >= 100) return 24;
  if (attendanceMin >= 75) return 20;
  if (attendanceMin >= 50) return 14;
  if (attendanceMin >= 25) return 8;
  return 3;
}

function q1Score(q1) {
  const cfg = SCORE_CONFIG.q1;
  const cities = (q1 && Array.isArray(q1.cities) ? q1.cities : []).length;
  const offices = q1 && q1.sofiaOffices;
  if (cities >= 3) return cfg.threePlusCities;
  if (cities === 2) return cfg.twoCities;
  if (offices === '3plus') return cfg.threePlusSofiaOffices;
  if (offices === '2') return cfg.twoSofiaOffices;
  return cfg.singleSite;
}

function q4Score(q4) {
  const list = Array.isArray(q4) ? q4 : [];
  let best = SCORE_CONFIG.q4.none;
  for (const key of list) {
    const v = SCORE_CONFIG.q4[key];
    if (typeof v === 'number' && v > best) best = v;
  }
  return best;
}

/**
 * Вътрешният лийд скор от 100. Отговаря на „колко привлекателен е този
 * акаунт за Genki" — НЕ на „какво да му препоръчаме". Двете са отделни
 * системи (бриф раздел 16) и този резултат не напуска сървъра.
 *
 * Q3 се точкува спрямо ДОЛНАТА граница на диапазона — консервативно, за
 * да не се надува скорът. (Икономиката отсреща ползва горната граница,
 * за да не се подценява нужният бюджет. Двете посоки са нарочни.)
 */
export function leadScore(answers, ctx) {
  const bounds = attendanceBounds(answers.q3);
  if (!bounds) return null;

  const parts = {
    q1: q1Score(answers.q1),
    q2: Q2_SCORE[answers.q2] || 0,
    q3: q3Score(bounds.min),
    q4: q4Score(answers.q4),
    q5: Q5_SCORE[answers.q5] || 0,
    q6: null,
  };

  const band = ctx && ctx.band;
  const sales = ctx && ctx.sales;
  const benefit = ctx && ctx.benefit;

  if (band && band.kind === 'notsure') {
    parts.q6 = null;
  } else if (band && (band.max === 0 || band.kind === 'zero')) {
    parts.q6 = 5;                              // €0 / само базов Genki
  } else if (band && sales && sales.salesMax !== null) {
    const reference =
      (benefit && (answers.q5 === 'benefit' || answers.q5 === 'both' || answers.q5 === 'unsure')
        ? benefit.fee : 0) +
      (answers.q5 === 'benefit' ? 0 : sales.salesMax * (SCORE_CONFIG.referencePsLevel / 100));
    const known = band.max === null ? band.min : band.max;
    if (reference <= 0) parts.q6 = 5;
    else {
      const ratio = known / reference;
      parts.q6 = ratio >= 1 ? 20 : ratio >= 0.75 ? 17 : ratio >= 0.5 ? 14 : ratio >= 0.25 ? 10 : 5;
    }
  }

  const scored = Object.values(parts).filter((v) => typeof v === 'number');
  const total = scored.reduce((a, b) => a + b, 0);

  return {
    parts,
    total,
    complete: parts.q6 !== null,
    // Вътрешни етикети. НИКОГА не се показват на клиента.
    tier: total >= 85 ? 'IDEAL' : total >= 70 ? 'STRONG' : total >= 55 ? 'POSSIBLE' : 'LOW',
  };
}

/* ==========================================================================
   9. ВАЛИДАЦИЯ
   ========================================================================== */

/**
 * Проверява отговорите отново, независимо от клиента.
 * Q3 се сверява срещу диапазоните за подадения Q2, а Q6 — срещу лентите,
 * които СЪРВЪРЪТ генерира. Така клиент не може да си избере бюджет,
 * който не съществува за неговия профил.
 */
export function validateAnswers(raw) {
  const errors = [];
  const a = raw && typeof raw === 'object' ? raw : {};

  const cities = Array.isArray(a.cities)
    ? a.cities.filter((c) => Q1_CITIES.includes(c))
    : [];
  if (!cities.length) errors.push('q1');

  const sofiaOffices = cities.includes('sofia')
    ? (Q1_SOFIA_OFFICES.includes(a.sofiaOffices) ? a.sofiaOffices : null)
    : null;
  if (cities.includes('sofia') && !sofiaOffices) errors.push('q1offices');

  const q2 = Q2_BANDS.includes(a.q2) ? a.q2 : null;
  if (!q2) errors.push('q2');

  const allowedQ3 = q2 ? Q3_RANGES_BY_Q2[q2] : [];
  const q3 = q2 && allowedQ3.includes(a.q3) ? a.q3 : null;
  if (!q3) errors.push('q3');

  const q4 = Array.isArray(a.q4) ? a.q4.filter((v) => Q4_OPTIONS.includes(v)) : [];
  if (!q4.length) errors.push('q4');
  // „Нищо постоянно" не се комбинира с останалите.
  const q4Clean = q4.includes('none') ? ['none'] : q4;

  const q5 = Q5_OPTIONS.includes(a.q5) ? a.q5 : null;
  if (!q5) errors.push('q5');

  let q6 = null;
  if (q2 && q3 && q5) {
    const set = budgetBands(q2, q3, q5);
    if (set && findBand(set, a.q6)) q6 = a.q6;
  }
  if (!q6) errors.push('q6');

  // Броят офиси в София е контекст за CRM; не разклонява заключената логика.
  const largestOffice = Q2_BANDS.includes(a.largestOffice) ? a.largestOffice : null;

  return {
    ok: errors.length === 0,
    errors,
    answers: {
      q1: { cities, sofiaOffices },
      q2, q3, q4: q4Clean, q5, q6, largestOffice,
    },
  };
}

/* ==========================================================================
   10. ИДЕНТИФИКАТОР НА СЕСИЯТА
   ========================================================================== */

export function newFitId(randomUUID) {
  const uuid = typeof randomUUID === 'function' ? randomUUID() : null;
  if (uuid) return 'GF-' + uuid.replace(/-/g, '').slice(0, 16).toUpperCase();
  let s = '';
  for (let i = 0; i < 16; i++) s += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
  return 'GF-' + s;
}
