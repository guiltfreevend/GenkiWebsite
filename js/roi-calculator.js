// Genki Capacity Calculator (full version) — wires the page UI to GenkiROI.
// Source of truth for all numbers lives in js/roi-engine.js, shared with the
// mini calculator on companies.html.
//
// Capacity only: people in the office per day → recommended station → monthly
// price (excl. VAT) → €/covered employee per month. No savings, no ROI %, no
// productivity claims.

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

  let currentInputs = { peoplePerDay: 62, totalEmployees: 265 };

  const elements = {};

  function fmtInt(num) { return Math.round(num).toLocaleString('en-US'); }
  function fmtMoney(num) { return num.toFixed(2); }

  function init() {
    setupPasswordGate();
    cacheElements();
    setupSliders();
    updateCalculations();
  }

  function cacheElements() {
    elements.sliderPerDay = document.getElementById('slider-per-day');
    elements.displayPerDay = document.getElementById('display-per-day');
    elements.sliderEmployees = document.getElementById('slider-employees');
    elements.displayEmployees = document.getElementById('display-employees');

    elements.displaySetupName = document.getElementById('display-setup-name');
    elements.resultTierName = document.getElementById('result-tier-name');
    elements.unsupportedWrap = document.getElementById('roi-unsupported');
    elements.resultWrap = document.getElementById('roi-result');

    elements.resultMonthly = document.getElementById('result-monthly');
    elements.resultPerCovered = document.getElementById('result-per-covered');
  }

  function setupSliders() {
    if (!elements.sliderPerDay) return;
    elements.sliderPerDay.addEventListener('input', function () {
      currentInputs.peoplePerDay = parseInt(this.value, 10);
      if (elements.displayPerDay) elements.displayPerDay.textContent = currentInputs.peoplePerDay;
      updateCalculations();
    });
    if (elements.sliderEmployees) {
      elements.sliderEmployees.addEventListener('input', function () {
        currentInputs.totalEmployees = parseInt(this.value, 10);
        if (elements.displayEmployees) elements.displayEmployees.textContent = fmtInt(currentInputs.totalEmployees);
        updateCalculations();
      });
    }
  }

  function setupNameFor(setup) {
    const tx = (window.translations && window.translations[setup.nameKey]) || null;
    const lang = (document.documentElement.lang === 'en') ? 'en' : 'bg';
    return tx ? tx[lang] : setup.name;
  }

  function updateCalculations() {
    if (!window.GenkiROI) return;
    const results = window.GenkiROI.calculateCapacity(currentInputs);

    if (results.unsupported) {
      if (elements.unsupportedWrap) elements.unsupportedWrap.classList.remove('hidden');
      if (elements.resultWrap) elements.resultWrap.classList.add('hidden');
      if (elements.displaySetupName) elements.displaySetupName.textContent = '—';
      return;
    }
    if (elements.unsupportedWrap) elements.unsupportedWrap.classList.add('hidden');
    if (elements.resultWrap) elements.resultWrap.classList.remove('hidden');

    const tierName = setupNameFor(results.setup);
    if (elements.displaySetupName) elements.displaySetupName.textContent = tierName;
    if (elements.resultTierName) elements.resultTierName.textContent = tierName;
    if (elements.resultMonthly) elements.resultMonthly.textContent = fmtInt(results.monthly);
    if (elements.resultPerCovered) elements.resultPerCovered.textContent = fmtMoney(results.perCoveredEmployee);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
