// Genki ROI engine — single source of truth for both the mini calculator
// (companies.html) and the full calculator (roi-calculator.html).
//
// Two responsibilities:
//   1. recommendedSetup(headcount) → real station-based monthly price for any team
//      size from 25 to 2000, derived from the locked Sizing Guide. NOT a unit-cost
//      model (productsPerDay × productCost) — that gave numbers unrelated to what
//      a real client actually pays.
//   2. calculateROI({teamSize, salary, turnoverRate, sickDays}, scenario) → cost +
//      savings + ROI breakdown. Multipliers default to Option A (tightened, defensible)
//      values; documented inline below.
//
// Multipliers — Option A (defensible defaults), 2026-05 retune.
// The peer-reviewed wellness ROI literature mostly studies COMPREHENSIVE programs
// (snacks + exercise + mental health + meals + screenings combined). Attributing
// the full literature effect size to a snack/drink station alone overstates impact.
// These values assume Genki is one wellness layer alongside others, not isolated.

(function () {
  'use strict';

  const MIN_HEADCOUNT = 25;
  const MAX_HEADCOUNT = 2000;

  const ROI_CONFIG = {
    workingDaysPerMonth: 22,
    workingDaysPerYear: 220,
    monthsPerYear: 12,
    breakTimeSavedMinutes: 30,
    replacementCostMultiplier: 1.5,
    healthcareCostPerEmployee: 500
  };

  const SCENARIOS = {
    conservative: { turnoverReduction: 0.05, absenteeismReduction: 0.10, productivityGain: 0.01, healthcareReduction: 0.03 },
    moderate:     { turnoverReduction: 0.10, absenteeismReduction: 0.15, productivityGain: 0.02, healthcareReduction: 0.05 },
    optimistic:   { turnoverReduction: 0.15, absenteeismReduction: 0.20, productivityGain: 0.03, healthcareReduction: 0.07 }
  };

  // Headcount → station configuration. Strict-greater-than at the larger thresholds
  // (800, 1000, 1500) so a headcount sitting on the band boundary picks the LOWER band
  // — which is what the validation cases at 800 and 1500 expect (cheaper composite,
  // good fit). Inclusive >= at smaller thresholds where the hardware-tier hop is the
  // intended trigger (e.g. 100 → Tower Fridge Lite even though Tower Dry Std also fits).
  function recommendedSetup(headcount) {
    if (!headcount || headcount < MIN_HEADCOUNT) return null;
    if (headcount > 1500)  return { name: '4× Hub Standard + 2× Tower Fridge Standard',          nameKey: 'roi_setup_1500_2000', monthly: 39540 };
    if (headcount > 1000)  return { name: '3× Hub Standard + 2× Tower Fridge Standard',          nameKey: 'roi_setup_1000_1500', monthly: 31050 };
    if (headcount > 800)   return { name: '2× Hub Standard + 1× Tower Fridge Standard',          nameKey: 'roi_setup_800_1000',  monthly: 19770 };
    if (headcount >= 600)  return { name: '2× Hub Standard',                                     nameKey: 'roi_setup_600_800',   monthly: 16980 };
    if (headcount >= 500)  return { name: '1× Hub Standard + 1× Tower Fridge Standard',          nameKey: 'roi_setup_500_600',   monthly: 11280 };
    if (headcount >= 400)  return { name: '1× Hub Standard + 1× Tower Fridge Lite',              nameKey: 'roi_setup_400_500',   monthly: 10480 };
    if (headcount >= 250)  return { name: 'Hub Standard',                                        nameKey: 'roi_setup_hub_std',   monthly: 8490  };
    if (headcount >= 200)  return { name: '1× Tower Fridge Standard + 1× Tower Fridge Lite',     nameKey: 'roi_setup_200_250',   monthly: 4780  };
    if (headcount >= 150)  return { name: 'Hub Lite',                                            nameKey: 'roi_setup_hub_lite',  monthly: 4490  };
    if (headcount >= 100)  return { name: 'Tower Fridge Lite',                                   nameKey: 'roi_setup_tf_lite',   monthly: 1990  };
    if (headcount >= 80)   return { name: 'Tower Dry Standard',                                  nameKey: 'roi_setup_td_std',    monthly: 2290  };
    if (headcount >= 60)   return { name: 'Tower Dry Lite',                                      nameKey: 'roi_setup_td_lite',   monthly: 1490  };
    if (headcount >= 35)   return { name: 'Desk Standard',                                       nameKey: 'roi_setup_desk_std',  monthly: 1290 };
    return                      { name: 'Desk Lite',                                             nameKey: 'roi_setup_desk_lite', monthly: 890  };
  }

  function calculateROI(inputs, scenarioName) {
    const teamSize = inputs.teamSize | 0;
    const setup = recommendedSetup(teamSize);

    if (!setup) {
      return {
        unsupported: true,
        teamSize: teamSize,
        minRequired: MIN_HEADCOUNT
      };
    }

    const m = SCENARIOS[scenarioName] || SCENARIOS.moderate;
    const cfg = ROI_CONFIG;

    const genkiCostMonthly = setup.monthly;
    const genkiCostAnnual = genkiCostMonthly * cfg.monthsPerYear;
    const genkiCostMonthlyPerEmp = genkiCostMonthly / teamSize;
    const genkiCostDaily = genkiCostMonthlyPerEmp / cfg.workingDaysPerMonth;

    const replacementCost = inputs.salary * cfg.replacementCostMultiplier;
    const turnoverSavings = teamSize * (inputs.turnoverRate / 100) * replacementCost * m.turnoverReduction;

    const dailySalary = inputs.salary / cfg.workingDaysPerYear;
    const absenteeismSavings = teamSize * inputs.sickDays * dailySalary * m.absenteeismReduction;

    const productivityValue = teamSize * inputs.salary * m.productivityGain;

    const healthcareSavings = teamSize * cfg.healthcareCostPerEmployee * m.healthcareReduction;

    const breakHoursSaved = teamSize * cfg.workingDaysPerYear * (cfg.breakTimeSavedMinutes / 60);

    const totalSavings = turnoverSavings + absenteeismSavings + productivityValue + healthcareSavings;
    const netBenefit = totalSavings - genkiCostAnnual;
    const roiPercent = genkiCostAnnual > 0 ? (netBenefit / genkiCostAnnual) * 100 : 0;
    const paybackMonths = totalSavings > 0 ? (genkiCostAnnual / totalSavings) * cfg.monthsPerYear : 0;

    return {
      unsupported: false,
      teamSize,
      setup,
      genkiCostAnnual, genkiCostMonthly, genkiCostMonthlyPerEmp, genkiCostDaily,
      turnoverSavings, absenteeismSavings, productivityValue, healthcareSavings,
      breakHoursSaved,
      totalSavings, netBenefit, roiPercent, paybackMonths
    };
  }

  window.GenkiROI = {
    recommendedSetup,
    calculateROI,
    SCENARIOS,
    ROI_CONFIG,
    MIN_HEADCOUNT,
    MAX_HEADCOUNT
  };
})();
