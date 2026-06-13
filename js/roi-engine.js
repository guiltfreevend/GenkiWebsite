// Genki capacity engine — single source of truth for the full calculator
// (roi-calculator.html) and the mini calculator on companies.html.
//
// This is a CAPACITY calculator, not an ROI calculator. The savings side
// (turnover / absenteeism / productivity / healthcare multipliers, ROI %,
// payback, break-hours) was removed on purpose: those numbers are not
// defensible to a Finance stakeholder and undercut trust. Productivity
// claims in particular are banned in the current framework.
//
// Two inputs, two DIFFERENT denominators (Numbers Bible §3):
//   • people in the office per day  →  SIZES the station (which tier). The slider.
//   • total headcount               →  the denominator for €/covered employee —
//                                       the number HR/Finance actually pitch on.
// €/covered employee = monthly price ÷ total headcount (NOT ÷ daily attendance).
// e.g. 62/day → Tower Fridge Standard (€2,790); at 265 employees that's €10.53.
//
// Pure pricing. No assumptions about salary, turnover, or behaviour change.

(function () {
  'use strict';

  const MIN_PER_DAY = 5;
  const MAX_PER_DAY = 300;

  // Multisport reference band (€/employee/month) for the comparison line.
  const MULTISPORT_MIN = 20;
  const MULTISPORT_MAX = 51;

  // people-in-the-office-per-day → recommended single station + monthly price
  // (excl. VAT). Bands sit at the midpoints between adjacent tier daily-capacity
  // anchors — Desk Lite 10 · Desk Std 20 · Tower Dry Lite 25 · Tower Fridge Lite
  // 34 · Tower Dry Std 48 · Tower Fridge Std 62 · Hub Lite 95 · Hub Std 240 —
  // and stay monotonic in price.
  function recommendedSetup(perDay) {
    if (!perDay || perDay < MIN_PER_DAY) return null;
    if (perDay <= 14)  return { name: 'Desk Lite',             nameKey: 'roi_setup_desk_lite', monthly: 890  };
    if (perDay <= 22)  return { name: 'Desk Standard',         nameKey: 'roi_setup_desk_std',  monthly: 1290 };
    if (perDay <= 29)  return { name: 'Tower Dry Lite',        nameKey: 'roi_setup_td_lite',   monthly: 1490 };
    if (perDay <= 40)  return { name: 'Tower Fridge Lite',     nameKey: 'roi_setup_tf_lite',   monthly: 1990 };
    if (perDay <= 54)  return { name: 'Tower Dry Standard',    nameKey: 'roi_setup_td_std',    monthly: 2290 };
    if (perDay <= 78)  return { name: 'Tower Fridge Standard', nameKey: 'roi_setup_tf_std',    monthly: 2790 };
    if (perDay <= 160) return { name: 'Hub Lite',              nameKey: 'roi_setup_hub_lite',  monthly: 4490 };
    return                    { name: 'Hub Standard',          nameKey: 'roi_setup_hub_std',   monthly: 8490 };
  }

  // inputs: { peoplePerDay, totalEmployees }
  //   peoplePerDay   — daily on-site attendance; SIZES the station (which tier).
  //   totalEmployees — full headcount; the denominator for €/covered employee.
  // If totalEmployees is missing it falls back to peoplePerDay (single-input
  // callers), but the pitch number is always price ÷ whole headcount.
  function calculateCapacity(inputs) {
    const peoplePerDay = inputs.peoplePerDay | 0;
    const setup = recommendedSetup(peoplePerDay);

    if (!setup) {
      return { unsupported: true, peoplePerDay, minPerDay: MIN_PER_DAY };
    }

    const monthly = setup.monthly;
    const totalEmployees = (inputs.totalEmployees | 0) || peoplePerDay;
    const denominator = Math.max(1, totalEmployees);
    const perCoveredEmployee = monthly / denominator;

    return {
      unsupported: false,
      peoplePerDay,
      totalEmployees,
      setup,
      monthly,
      perCoveredEmployee,
      multisportMin: MULTISPORT_MIN,
      multisportMax: MULTISPORT_MAX
    };
  }

  window.GenkiROI = {
    recommendedSetup,
    calculateCapacity,
    MIN_PER_DAY,
    MAX_PER_DAY,
    MULTISPORT_MIN,
    MULTISPORT_MAX
  };
})();
