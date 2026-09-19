/* ==========================================================================
   Genki 2.0 — формата за контакт

   Клиентската валидация е УДОБСТВО, не защита. Сървърът в
   functions/api/contact.js валидира наново и той е авторитетът.

   Състояния: DEFAULT · FOCUS · VALIDATION ERROR · SUBMITTING · SUCCESS ·
   SERVER ERROR. Успех се показва САМО след реален положителен отговор.

   Без JavaScript формата остава обикновен POST към /api/contact —
   action и method са в разметката, не тук.
   ========================================================================== */

(function (global) {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = document.getElementById('cf-submit');
  var submitLabel = form.querySelector('.cform__submit-label');
  var summary = document.getElementById('cform-summary');
  var success = document.getElementById('cform-success');
  var langField = document.getElementById('cf-lang');

  var sending = false;

  /* Полетата, които валидираме, и ключът на съобщението за грешка.
     Телефонът липсва нарочно — по желание е и не му налагаме формат. */
  var RULES = [
    { id: 'cf-name',    err: 'contact.err.name',    max: 120 },
    { id: 'cf-company', err: 'contact.err.company', max: 160 },
    { id: 'cf-email',   err: 'contact.err.email',   max: 200, email: true },
    { id: 'cf-message', err: 'contact.err.message', max: 4000 },
  ];

  /* Нарочно мека проверка: има нещо, @, нещо, точка, нещо. По-строгото
     отхвърля реални адреси. Сървърът прилага същото правило. */
  function looksLikeEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function t(key) {
    return (global.GenkiI18n && global.GenkiI18n.t(key)) || '';
  }

  function setError(input, messageKey) {
    var err = document.getElementById(input.id + '-err');
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    if (err) {
      err.setAttribute('data-i18n', messageKey);
      err.textContent = t(messageKey);
      err.hidden = false;
    }
  }

  function clearError(input) {
    var err = document.getElementById(input.id + '-err');
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    if (err) {
      err.hidden = true;
      err.removeAttribute('data-i18n');
      err.textContent = '';
    }
  }

  function clearAll() {
    for (var i = 0; i < RULES.length; i++) {
      var el = document.getElementById(RULES[i].id);
      if (el) clearError(el);
    }
    summary.hidden = true;
    summary.removeAttribute('data-i18n');
    summary.textContent = '';
  }

  /* Връща първото невалидно поле или null. */
  function validate() {
    var first = null;

    for (var i = 0; i < RULES.length; i++) {
      var rule = RULES[i];
      var el = document.getElementById(rule.id);
      if (!el) continue;

      var value = el.value.trim();
      var bad = null;

      if (!value) bad = rule.err;
      else if (value.length > rule.max) bad = 'contact.err.long';
      else if (rule.email && !looksLikeEmail(value)) bad = rule.err;

      if (bad) {
        setError(el, bad);
        if (!first) first = el;
      } else {
        clearError(el);
      }
    }
    return first;
  }

  /* Изчистваме грешката веднага щом човекът поправи полето — по-малко
     шум, докато пише. */
  for (var i = 0; i < RULES.length; i++) {
    (function (rule) {
      var el = document.getElementById(rule.id);
      if (!el) return;
      el.addEventListener('input', function () {
        if (el.classList.contains('is-invalid')) clearError(el);
      });
    })(RULES[i]);
  }

  function setSending(on) {
    sending = on;
    submitBtn.disabled = on;
    submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
    submitLabel.setAttribute('data-i18n', on ? 'contact.sending' : 'contact.submit');
    submitLabel.textContent = t(on ? 'contact.sending' : 'contact.submit');
  }

  function showSummary(key) {
    summary.setAttribute('data-i18n', key);
    summary.textContent = t(key);
    summary.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;          /* двоен клик не праща два пъти */

    clearAll();

    var firstBad = validate();
    if (firstBad) {
      showSummary('contact.err.summary');
      firstBad.focus();
      return;
    }

    if (langField && global.GenkiI18n) langField.value = global.GenkiI18n.lang;

    var payload = {
      name: document.getElementById('cf-name').value.trim(),
      company: document.getElementById('cf-company').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      phone: document.getElementById('cf-phone').value.trim(),
      message: document.getElementById('cf-message').value.trim(),
      website: document.getElementById('cf-website').value,   /* honeypot */
      lang: langField ? langField.value : 'bg',
    };

    setSending(true);

    global.fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; })
          .then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (r) {
        if (!r.ok || !r.body || r.body.ok !== true) {
          /* Данните на човека остават в полетата — може да опита пак. */
          setSending(false);
          showSummary('contact.err.server');
          summary.focus && summary.focus();
          track('contact_form_error');
          return;
        }

        form.hidden = true;
        success.hidden = false;
        success.focus();
        track('contact_form_success');
      })
      .catch(function () {
        setSending(false);
        showSummary('contact.err.network');
        track('contact_form_error');
      });

    track('contact_form_submitted');
  });

  /* Аналитика: събития само ако вече има инсталирана платформа. Нищо ново
     не се добавя и НИКАКВИ стойности от полетата не пътуват натам. */
  var started = false;
  form.addEventListener('focusin', function () {
    if (started) return;
    started = true;
    track('contact_form_started');
  });

  function track(event) {
    try {
      if (global.umami && typeof global.umami.track === 'function') {
        global.umami.track(event);
      } else if (typeof global.dataLayer !== 'undefined' && global.dataLayer.push) {
        global.dataLayer.push({ event: event });
      }
      /* Ако няма платформа — нищо. Това е бъдеща точка за интеграция. */
    } catch (e) { /* аналитиката никога не чупи формата */ }
  }

  /* Ако човекът смени езика, вече показаните съобщения се превеждат. */
  document.addEventListener('genki:langchange', function () {
    if (global.GenkiI18n) global.GenkiI18n.apply(form);
  });
})(window);
