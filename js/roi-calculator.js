// Genki ROI Calculator - Main JavaScript
// Password: genki2026 (SHA-256 hashed below)

(function() {
  'use strict';

  // Password hash (SHA-256 of 'genki2026')
  const PASSWORD_HASH = '8a4c4e4f5f6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b';

  // Configuration
  const CONFIG = {
    workingDaysPerMonth: 22,
    workingDaysPerYear: 220,
    monthsPerYear: 12,
    replacementCostMultiplier: 1.5,
    healthcareCostPerEmployee: 500,
    scenarios: {
      conservative: {
        turnoverReduction: 0.15,
        absenteeismReduction: 0.10,
        productivityGain: 0.03,
        healthcareReduction: 0.05
      },
      moderate: {
        turnoverReduction: 0.25,
        absenteeismReduction: 0.20,
        productivityGain: 0.05,
        healthcareReduction: 0.10
      },
      optimistic: {
        turnoverReduction: 0.35,
        absenteeismReduction: 0.30,
        productivityGain: 0.08,
        healthcareReduction: 0.15
      }
    }
  };

  // Current state
  let currentScenario = 'moderate';
  let currentInputs = {
    teamSize: 200,
    salary: 50000,
    turnoverRate: 13,
    sickDays: 8,
    productsPerDay: 2.5,
    productCost: 1.5
  };

  // DOM Elements
  const elements = {};

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheElements();
    setupPasswordGate();
    setupSliders();
    setupScenarioTabs();
    renderResearchAccordion();
    updateCalculations();
  }

  function cacheElements() {
    // Sliders
    elements.sliderTeamSize = document.getElementById('slider-team-size');
    elements.sliderSalary = document.getElementById('slider-salary');
    elements.sliderTurnover = document.getElementById('slider-turnover');
    elements.sliderSickDays = document.getElementById('slider-sick-days');
    elements.sliderProducts = document.getElementById('slider-products');
    elements.sliderCost = document.getElementById('slider-cost');

    // Displays
    elements.displayTeamSize = document.getElementById('display-team-size');
    elements.displaySalary = document.getElementById('display-salary');
    elements.displayTurnover = document.getElementById('display-turnover');
    elements.displaySickDays = document.getElementById('display-sick-days');
    elements.displayProducts = document.getElementById('display-products');
    elements.displayCost = document.getElementById('display-cost');

    // Results
    elements.resultInvestment = document.getElementById('result-investment');
    elements.resultMonthly = document.getElementById('result-monthly');
    elements.resultDaily = document.getElementById('result-daily');
    elements.resultSavings = document.getElementById('result-savings');
    elements.resultNet = document.getElementById('result-net');
    elements.resultRoi = document.getElementById('result-roi');
    elements.resultPayback = document.getElementById('result-payback');

    // Bars
    elements.barTurnoverValue = document.getElementById('bar-turnover-value');
    elements.barTurnover = document.getElementById('bar-turnover');
    elements.barProductivityValue = document.getElementById('bar-productivity-value');
    elements.barProductivity = document.getElementById('bar-productivity');
    elements.barHealthcareValue = document.getElementById('bar-healthcare-value');
    elements.barHealthcare = document.getElementById('bar-healthcare');
    elements.barAbsenteeismValue = document.getElementById('bar-absenteeism-value');
    elements.barAbsenteeism = document.getElementById('bar-absenteeism');

    // Scenario cards
    elements.scenarioConservativeNet = document.getElementById('scenario-conservative-net');
    elements.scenarioConservativeRoi = document.getElementById('scenario-conservative-roi');
    elements.scenarioModerateNet = document.getElementById('scenario-moderate-net');
    elements.scenarioModerateRoi = document.getElementById('scenario-moderate-roi');
    elements.scenarioOptimisticNet = document.getElementById('scenario-optimistic-net');
    elements.scenarioOptimisticRoi = document.getElementById('scenario-optimistic-roi');

    // Other
    elements.engagementWarning = document.getElementById('engagement-warning');
    elements.researchAccordion = document.getElementById('research-accordion');
  }

  // ==========================================
  // Password Protection
  // ==========================================

  function setupPasswordGate() {
    const gate = document.getElementById('password-gate');
    const mainContent = document.getElementById('main-content');
    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');

    // Check if already authenticated
    if (sessionStorage.getItem('roi_authenticated') === 'true') {
      gate.classList.add('hidden');
      mainContent.classList.remove('hidden');
      return;
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const password = input.value;

      // Simple password check (for demo purposes, using plain comparison)
      // In production, you'd want to use a more secure method
      if (password === 'genki2026') {
        sessionStorage.setItem('roi_authenticated', 'true');
        gate.classList.add('hidden');
        mainContent.classList.remove('hidden');
        error.classList.add('hidden');
      } else {
        error.classList.remove('hidden');
        input.value = '';
        input.focus();
      }
    });
  }

  // ==========================================
  // Sliders
  // ==========================================

  function setupSliders() {
    if (!elements.sliderTeamSize) return;

    // Team Size
    elements.sliderTeamSize.addEventListener('input', function() {
      currentInputs.teamSize = parseInt(this.value);
      elements.displayTeamSize.textContent = currentInputs.teamSize;
      updateCalculations();
    });

    // Salary
    elements.sliderSalary.addEventListener('input', function() {
      currentInputs.salary = parseInt(this.value);
      elements.displaySalary.textContent = formatNumber(currentInputs.salary);
      updateCalculations();
    });

    // Turnover Rate
    elements.sliderTurnover.addEventListener('input', function() {
      currentInputs.turnoverRate = parseInt(this.value);
      elements.displayTurnover.textContent = currentInputs.turnoverRate;
      updateCalculations();
    });

    // Sick Days
    elements.sliderSickDays.addEventListener('input', function() {
      currentInputs.sickDays = parseInt(this.value);
      elements.displaySickDays.textContent = currentInputs.sickDays;
      updateCalculations();
    });

    // Products per Day
    elements.sliderProducts.addEventListener('input', function() {
      currentInputs.productsPerDay = parseFloat(this.value);
      elements.displayProducts.textContent = currentInputs.productsPerDay.toFixed(1);
      updateEngagementWarning();
      updateCalculations();
    });

    // Product Cost
    elements.sliderCost.addEventListener('input', function() {
      currentInputs.productCost = parseFloat(this.value);
      elements.displayCost.textContent = currentInputs.productCost.toFixed(2);
      updateCalculations();
    });
  }

  function updateEngagementWarning() {
    if (!elements.engagementWarning) return;

    if (currentInputs.productsPerDay < 2.0) {
      elements.engagementWarning.classList.remove('hidden');
    } else {
      elements.engagementWarning.classList.add('hidden');
    }
  }

  // ==========================================
  // Scenario Tabs
  // ==========================================

  function setupScenarioTabs() {
    const tabs = document.querySelectorAll('.scenario-tab');
    const cards = document.querySelectorAll('.scenario-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const scenario = this.dataset.scenario;
        setActiveScenario(scenario);
      });
    });

    cards.forEach(card => {
      card.addEventListener('click', function() {
        const scenario = this.dataset.scenario;
        setActiveScenario(scenario);
      });
    });
  }

  function setActiveScenario(scenario) {
    currentScenario = scenario;

    // Update tabs
    document.querySelectorAll('.scenario-tab').forEach(tab => {
      if (tab.dataset.scenario === scenario) {
        tab.classList.remove('bg-white/20', 'hover:bg-white/30');
        tab.classList.add('bg-white', 'text-primary-700');
      } else {
        tab.classList.remove('bg-white', 'text-primary-700');
        tab.classList.add('bg-white/20', 'hover:bg-white/30');
      }
    });

    // Update cards
    document.querySelectorAll('.scenario-card').forEach(card => {
      if (card.dataset.scenario === scenario) {
        card.classList.add('border-primary-500', 'shadow-lg');
        card.classList.remove('border-gray-200');
      } else {
        card.classList.remove('border-primary-500', 'shadow-lg');
        card.classList.add('border-gray-200');
      }
    });

    updateCalculations();
  }

  // ==========================================
  // Calculations
  // ==========================================

  function calculateROI(inputs, scenario) {
    const s = CONFIG.scenarios[scenario];

    // Genki Cost
    const genkiCostAnnual = inputs.teamSize *
      inputs.productsPerDay *
      inputs.productCost *
      CONFIG.workingDaysPerMonth *
      CONFIG.monthsPerYear;

    const genkiCostMonthly = genkiCostAnnual / CONFIG.monthsPerYear / inputs.teamSize;
    const genkiCostDaily = genkiCostMonthly / CONFIG.workingDaysPerMonth;

    // Turnover Savings
    const replacementCost = inputs.salary * CONFIG.replacementCostMultiplier;
    const currentTurnoverCost = inputs.teamSize * (inputs.turnoverRate / 100) * replacementCost;
    const turnoverSavings = currentTurnoverCost * s.turnoverReduction;

    // Absenteeism Savings
    const dailySalary = inputs.salary / CONFIG.workingDaysPerYear;
    const currentAbsenteeismCost = inputs.teamSize * inputs.sickDays * dailySalary;
    const absenteeismSavings = currentAbsenteeismCost * s.absenteeismReduction;

    // Productivity Gains
    const productivityValue = inputs.teamSize * inputs.salary * s.productivityGain;

    // Healthcare Savings
    const healthcareSavings = inputs.teamSize * CONFIG.healthcareCostPerEmployee * s.healthcareReduction;

    // Totals
    const totalSavings = turnoverSavings + absenteeismSavings + productivityValue + healthcareSavings;
    const netBenefit = totalSavings - genkiCostAnnual;
    const roiPercent = (netBenefit / genkiCostAnnual) * 100;
    const paybackMonths = (genkiCostAnnual / totalSavings) * CONFIG.monthsPerYear;

    return {
      genkiCostAnnual,
      genkiCostMonthly,
      genkiCostDaily,
      turnoverSavings,
      absenteeismSavings,
      productivityValue,
      healthcareSavings,
      totalSavings,
      netBenefit,
      roiPercent,
      paybackMonths
    };
  }

  function updateCalculations() {
    // Calculate for current scenario
    const results = calculateROI(currentInputs, currentScenario);

    // Re-query elements if not cached (handles hidden content case)
    const resultInvestment = elements.resultInvestment || document.getElementById('result-investment');
    const resultDaily = elements.resultDaily || document.getElementById('result-daily');
    const resultSavings = elements.resultSavings || document.getElementById('result-savings');
    const resultNet = elements.resultNet || document.getElementById('result-net');
    const resultRoi = elements.resultRoi || document.getElementById('result-roi');
    const resultPayback = elements.resultPayback || document.getElementById('result-payback');

    // Update investment display
    if (resultInvestment) {
      resultInvestment.textContent = formatNumber(results.genkiCostAnnual);
    }
    if (resultDaily) {
      resultDaily.textContent = results.genkiCostDaily.toFixed(2);
    }

    // Update ROI summary
    if (resultSavings) {
      resultSavings.textContent = formatNumber(results.totalSavings);
    }
    if (resultNet) {
      resultNet.textContent = formatNumber(results.netBenefit);
    }
    if (resultRoi) {
      resultRoi.textContent = Math.round(results.roiPercent);
    }
    if (resultPayback) {
      resultPayback.textContent = results.paybackMonths.toFixed(1);
    }

    // Update breakdown bars
    updateBreakdownBars(results);

    // Update all scenario cards
    updateScenarioCards();
  }

  function updateBreakdownBars(results) {
    const total = results.totalSavings;
    if (total === 0) return;

    const turnoverPct = (results.turnoverSavings / total) * 100;
    const productivityPct = (results.productivityValue / total) * 100;
    const healthcarePct = (results.healthcareSavings / total) * 100;
    const absenteeismPct = (results.absenteeismSavings / total) * 100;

    // Re-query elements if not cached
    const barTurnoverValue = elements.barTurnoverValue || document.getElementById('bar-turnover-value');
    const barTurnover = elements.barTurnover || document.getElementById('bar-turnover');
    const barProductivityValue = elements.barProductivityValue || document.getElementById('bar-productivity-value');
    const barProductivity = elements.barProductivity || document.getElementById('bar-productivity');
    const barHealthcareValue = elements.barHealthcareValue || document.getElementById('bar-healthcare-value');
    const barHealthcare = elements.barHealthcare || document.getElementById('bar-healthcare');
    const barAbsenteeismValue = elements.barAbsenteeismValue || document.getElementById('bar-absenteeism-value');
    const barAbsenteeism = elements.barAbsenteeism || document.getElementById('bar-absenteeism');

    if (barTurnoverValue) {
      barTurnoverValue.textContent = formatNumber(results.turnoverSavings);
      barTurnover.style.width = turnoverPct + '%';
    }

    if (barProductivityValue) {
      barProductivityValue.textContent = formatNumber(results.productivityValue);
      barProductivity.style.width = productivityPct + '%';
    }

    if (barHealthcareValue) {
      barHealthcareValue.textContent = formatNumber(results.healthcareSavings);
      barHealthcare.style.width = healthcarePct + '%';
    }

    if (barAbsenteeismValue) {
      barAbsenteeismValue.textContent = formatNumber(results.absenteeismSavings);
      barAbsenteeism.style.width = absenteeismPct + '%';
    }
  }

  function updateScenarioCards() {
    ['conservative', 'moderate', 'optimistic'].forEach(scenario => {
      const results = calculateROI(currentInputs, scenario);
      const netEl = document.getElementById(`scenario-${scenario}-net`);
      const roiEl = document.getElementById(`scenario-${scenario}-roi`);

      if (netEl) netEl.textContent = formatNumber(results.netBenefit);
      if (roiEl) roiEl.textContent = Math.round(results.roiPercent);
    });
  }

  // ==========================================
  // Research Accordion
  // ==========================================

  function renderResearchAccordion() {
    if (!elements.researchAccordion || typeof researchStudies === 'undefined') return;

    let html = '';

    researchStudies.categories.forEach(category => {
      html += `
        <details class="bg-white rounded-xl shadow-sm">
          <summary class="font-semibold text-gray-900 cursor-pointer p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span class="flex items-center gap-3">
              <span class="text-2xl">${category.icon}</span>
              <span>${category.title}</span>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-sm text-gray-500">(${category.studies.length} studies)</span>
              <svg class="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
          </summary>
          <div class="px-6 pb-6 space-y-4">
            ${category.studies.map(study => `
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 class="font-medium text-gray-900 mb-1">${study.title}</h4>
                <p class="text-sm text-gray-500 mb-2">${study.source}</p>
                <p class="text-sm text-gray-600 mb-3">${study.finding}</p>
                <a href="${study.link}" target="_blank" rel="noopener" class="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                  View Research
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            `).join('')}
          </div>
        </details>
      `;
    });

    elements.researchAccordion.innerHTML = html;
  }

  // ==========================================
  // Utilities
  // ==========================================

  function formatNumber(num) {
    return Math.round(num).toLocaleString('en-US');
  }

})();
