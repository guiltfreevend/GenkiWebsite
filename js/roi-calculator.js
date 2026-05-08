// Genki ROI Calculator (full version) — wires the page UI to GenkiROI engine.
// Source of truth for all numbers lives in js/roi-engine.js, which is shared
// with the mini calculator on companies.html.
//
// Cost side: real station-based pricing (recommendedSetup), NOT unit pricing.
// Savings side: defensible Option-A multipliers (Conservative/Moderate/Optimistic),
// see SCENARIOS in roi-engine.js for documented values.

(function () {
  'use strict';

  // Optional gate — kept from earlier internal usage. Skipped if no gate elements.
  function setupPasswordGate() {
    const gate = document.getElementById('password-gate');
    const mainContent = document.getElementById('main-content');
    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');
    if (!gate || !form) return;

    if (sessionStorage.getItem('roi_authenticated') === 'true') {
      gate.classList.add('hidden');
      if (mainContent) mainContent.classList.remove('hidden');
      return;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === 'genki2026') {
        sessionStorage.setItem('roi_authenticated', 'true');
        gate.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');
        if (error) error.classList.add('hidden');
      } else {
        if (error) error.classList.remove('hidden');
        input.value = '';
        input.focus();
      }
    });
  }

  // Local Bulgarian price comparisons (the coffee/sandwich line stays useful)
  const BULGARIAN_PRICES = { coffee: 1.50, sandwich: 1.30 };

  // Default scenario for the full calc — Conservative is the most defensible read
  // of the same research applied to a snack-station-only benefit; the user can
  // switch to Moderate or Optimistic via the scenario tabs.
  let currentScenario = 'conservative';
  let currentInputs = {
    teamSize: 300,
    salary: 36000,
    turnoverRate: 13,
    sickDays: 8
  };

  const elements = {};

  function fmtInt(num) { return Math.round(num).toLocaleString('en-US'); }
  function fmtDec1(num) {
    const r = Math.round(num * 10) / 10;
    return r === Math.floor(r) ? r.toString() : r.toFixed(1);
  }

  function init() {
    setupPasswordGate();
    cacheElements();
    setupSliders();
    setupScenarioTabs();
    renderResearchAccordion();
    updateCalculations();
  }

  function cacheElements() {
    elements.sliderTeamSize = document.getElementById('slider-team-size');
    elements.sliderSalary = document.getElementById('slider-salary');
    elements.sliderTurnover = document.getElementById('slider-turnover');
    elements.sliderSickDays = document.getElementById('slider-sick-days');

    elements.displayTeamSize = document.getElementById('display-team-size');
    elements.displaySalary = document.getElementById('display-salary');
    elements.displayTurnover = document.getElementById('display-turnover');
    elements.displaySickDays = document.getElementById('display-sick-days');

    elements.displaySetupName = document.getElementById('display-setup-name');
    elements.unsupportedWrap = document.getElementById('roi-unsupported');

    elements.resultInvestment = document.getElementById('result-investment');
    elements.resultMonthly = document.getElementById('result-monthly');
    elements.resultDaily = document.getElementById('result-daily');
    elements.resultSavings = document.getElementById('result-savings');
    elements.resultNet = document.getElementById('result-net');
    elements.resultRoi = document.getElementById('result-roi');
    elements.resultPayback = document.getElementById('result-payback');

    elements.barTurnoverValue = document.getElementById('bar-turnover-value');
    elements.barTurnover = document.getElementById('bar-turnover');
    elements.barProductivityValue = document.getElementById('bar-productivity-value');
    elements.barProductivity = document.getElementById('bar-productivity');
    elements.barHealthcareValue = document.getElementById('bar-healthcare-value');
    elements.barHealthcare = document.getElementById('bar-healthcare');
    elements.barAbsenteeismValue = document.getElementById('bar-absenteeism-value');
    elements.barAbsenteeism = document.getElementById('bar-absenteeism');

    elements.researchAccordion = document.getElementById('research-accordion');
  }

  function setupSliders() {
    if (!elements.sliderTeamSize) return;
    elements.sliderTeamSize.addEventListener('input', function () {
      currentInputs.teamSize = parseInt(this.value, 10);
      if (elements.displayTeamSize) elements.displayTeamSize.textContent = fmtInt(currentInputs.teamSize);
      updateCalculations();
    });
    elements.sliderSalary.addEventListener('input', function () {
      currentInputs.salary = parseInt(this.value, 10);
      if (elements.displaySalary) elements.displaySalary.textContent = fmtInt(currentInputs.salary);
      updateCalculations();
    });
    elements.sliderTurnover.addEventListener('input', function () {
      currentInputs.turnoverRate = parseInt(this.value, 10);
      if (elements.displayTurnover) elements.displayTurnover.textContent = currentInputs.turnoverRate;
      updateCalculations();
    });
    elements.sliderSickDays.addEventListener('input', function () {
      currentInputs.sickDays = parseInt(this.value, 10);
      if (elements.displaySickDays) elements.displaySickDays.textContent = currentInputs.sickDays;
      updateCalculations();
    });
  }

  function setupScenarioTabs() {
    document.querySelectorAll('.scenario-tab').forEach(tab => {
      tab.addEventListener('click', function () { setActiveScenario(this.dataset.scenario); });
    });
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', function () { setActiveScenario(this.dataset.scenario); });
    });
  }

  function setActiveScenario(scenario) {
    currentScenario = scenario;
    document.querySelectorAll('.scenario-tab').forEach(tab => {
      const active = tab.dataset.scenario === scenario;
      tab.classList.toggle('bg-white', active);
      tab.classList.toggle('text-primary-700', active);
      tab.classList.toggle('bg-white/20', !active);
      tab.classList.toggle('hover:bg-white/30', !active);
    });
    document.querySelectorAll('.scenario-card').forEach(card => {
      const active = card.dataset.scenario === scenario;
      card.classList.toggle('border-primary-500', active);
      card.classList.toggle('shadow-lg', active);
      card.classList.toggle('border-gray-200', !active);
    });
    updateCalculations();
  }

  function updateCalculations() {
    if (!window.GenkiROI) return;
    const results = window.GenkiROI.calculateROI(currentInputs, currentScenario);

    // <25 ppl path — show under-min message, hide numbers.
    if (results.unsupported) {
      if (elements.unsupportedWrap) elements.unsupportedWrap.classList.remove('hidden');
      if (elements.displaySetupName) elements.displaySetupName.textContent = '—';
      return;
    }
    if (elements.unsupportedWrap) elements.unsupportedWrap.classList.add('hidden');

    // Recommended setup name — translates if a key matches, otherwise raw label.
    if (elements.displaySetupName) {
      const key = results.setup.nameKey;
      const tx = (window.translations && window.translations[key]) || null;
      const lang = (document.documentElement.lang === 'en') ? 'en' : 'bg';
      elements.displaySetupName.textContent = tx ? tx[lang] : results.setup.name;
    }

    if (elements.resultInvestment) elements.resultInvestment.textContent = fmtInt(results.genkiCostAnnual);
    if (elements.resultDaily) elements.resultDaily.textContent = results.genkiCostDaily.toFixed(2);
    if (elements.resultMonthly) elements.resultMonthly.textContent = results.genkiCostMonthlyPerEmp.toFixed(2);
    if (elements.resultSavings) elements.resultSavings.textContent = fmtInt(results.totalSavings);
    if (elements.resultNet) elements.resultNet.textContent = fmtInt(results.netBenefit);
    if (elements.resultRoi) elements.resultRoi.textContent = Math.round(results.roiPercent);
    if (elements.resultPayback) elements.resultPayback.textContent = results.paybackMonths.toFixed(1);

    updateCostComparison(results.genkiCostDaily);
    updateBreakdownBars(results);
    updateScenarioCards();
  }

  function updateCostComparison(dailyCost) {
    const cf = document.getElementById('comparison-coffees');
    const sw = document.getElementById('comparison-sandwiches');
    if (!cf || !sw) return;
    cf.textContent = fmtDec1(dailyCost / BULGARIAN_PRICES.coffee);
    sw.textContent = fmtDec1(dailyCost / BULGARIAN_PRICES.sandwich);
  }

  function updateBreakdownBars(results) {
    const total = results.totalSavings;
    if (total === 0) return;
    const setBar = (valueEl, barEl, value) => {
      if (valueEl) valueEl.textContent = fmtInt(value);
      if (barEl) barEl.style.width = ((value / total) * 100) + '%';
    };
    setBar(elements.barTurnoverValue, elements.barTurnover, results.turnoverSavings);
    setBar(elements.barProductivityValue, elements.barProductivity, results.productivityValue);
    setBar(elements.barHealthcareValue, elements.barHealthcare, results.healthcareSavings);
    setBar(elements.barAbsenteeismValue, elements.barAbsenteeism, results.absenteeismSavings);

    const breakHoursEl = document.getElementById('break-hours-saved');
    if (breakHoursEl) breakHoursEl.textContent = '~' + fmtInt(results.breakHoursSaved);
  }

  function updateScenarioCards() {
    ['conservative', 'moderate', 'optimistic'].forEach(scenario => {
      const r = window.GenkiROI.calculateROI(currentInputs, scenario);
      const netEl = document.getElementById('scenario-' + scenario + '-net');
      const roiEl = document.getElementById('scenario-' + scenario + '-roi');
      if (r.unsupported) {
        if (netEl) netEl.textContent = '—';
        if (roiEl) roiEl.textContent = '—';
        return;
      }
      if (netEl) netEl.textContent = fmtInt(r.netBenefit);
      if (roiEl) roiEl.textContent = Math.round(r.roiPercent);
    });
  }

  function renderResearchAccordion() {
    if (!elements.researchAccordion || typeof researchStudies === 'undefined') return;
    let html = '';
    researchStudies.categories.forEach(category => {
      html += '<details class="bg-white rounded-xl shadow-sm">' +
        '<summary class="font-semibold text-gray-900 cursor-pointer p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">' +
        '<span class="flex items-center gap-3"><span class="text-2xl">' + category.icon + '</span><span>' + category.title + '</span></span>' +
        '<span class="flex items-center gap-2"><span class="text-sm text-gray-500">(' + category.studies.length + ' studies)</span>' +
        '<svg class="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
        '</span></summary>' +
        '<div class="px-6 pb-6 space-y-4">' +
        category.studies.map(study =>
          '<div class="p-4 bg-gray-50 rounded-lg border border-gray-100">' +
          '<h4 class="font-medium text-gray-900 mb-1">' + study.title + '</h4>' +
          '<p class="text-sm text-gray-500 mb-2">' + study.source + '</p>' +
          '<p class="text-sm text-gray-600 mb-3">' + study.finding + '</p>' +
          '<a href="' + study.link + '" target="_blank" rel="noopener" class="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">View Research' +
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' +
          '</a></div>'
        ).join('') +
        '</div></details>';
    });
    elements.researchAccordion.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
