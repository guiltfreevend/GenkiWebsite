/* ==========================================================================
   Genki Fit — малкото приложение на Genki.

   Не е форма, вградена в сайта. Един въпрос на екран, голям типографски
   ритъм, едри зони за докосване, видим напредък, „Назад" пази отговорите.
   Цел: под минута.

   АРХИТЕКТУРА
     Логиката НЕ живее тук. Диапазоните, икономиката, бюджетните ленти и
     препоръката идват от lib/genki-fit-logic.js — същия модул, който
     ползва и сървърът. Този файл е само интерфейс.

   ДОВЕРИЕ
     Резултатът се показва веднага, на клиента, защото не бива да се
     заключва зад контактни данни. Но сървърът пресмята всичко НАНОВО и
     не вярва на нищо оттук.

   ДОСТЪПНОСТ
     Изборите са истински <input type="radio"> и <input type="checkbox">.
     Така стрелките, Tab, Space и екранните четци работят без нито един
     ARIA трик, а целият етикет е кликаема повърхност.

   БЕЗ СЪХРАНЕНИЕ
     Отговорите живеят в паметта на страницата и никъде другаде. Няма
     localStorage, няма бисквитка, няма междинно пращане към сървъра.
     Прогресивното записване и CRM-ът от бриф раздел 21 чакат етапа за
     Privacy — да се събира нещо, което политиката още не описва, е точно
     това, което брифът забранява.
   ========================================================================== */

import {
  Q3_RANGES_BY_Q2, q3RangesFor, attendanceBounds, budgetBands,
  recommend, newFitId,
} from '/lib/genki-fit-logic.js';

(function () {
  'use strict';

  var root = document.querySelector('[data-fit-root]');
  if (!root) return;

  /* --- достъп до преводите ---------------------------------------------- */

  function raw(key) {
    return (window.GenkiI18n && window.GenkiI18n.t(key)) || '';
  }

  /** Превод с попълнени {плейсхолдъри}. Изреченията са цели на своя език. */
  function t(key, vars) {
    var s = raw(key);
    if (!vars) return s;
    return s.replace(/\{([a-z]+)\}/gi, function (m, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m;
    });
  }

  function lang() {
    return (window.GenkiI18n && window.GenkiI18n.lang) || 'bg';
  }

  function money(n) {
    return '€' + Math.round(n).toLocaleString('en-US');
  }

  /* „Под 25" вътре в изречение трябва да е „под 25". */
  function lowerFirst(s) {
    return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  }

  var reducedMotion = window.matchMedia &&
                      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- състояние -------------------------------------------------------- */

  var state = {
    fitId: null,
    step: 0,                    // 0 = hero, 1..6 = въпроси
    cities: [],
    sofiaOffices: null,
    q2: null,
    largestOffice: null,
    q3: null,
    q4: [],
    q5: null,
    q6: null,
  };

  var screens = {
    hero:     root.querySelector('[data-fit-screen="hero"]'),
    question: root.querySelector('[data-fit-screen="question"]'),
    calc:     root.querySelector('[data-fit-screen="calc"]'),
    result:   root.querySelector('[data-fit-screen="result"]'),
  };

  var qHost = root.querySelector('[data-fit-question]');
  var qProgress = root.querySelector('[data-fit-progress]');
  var qBar = root.querySelector('[data-fit-bar]');
  var qBack = root.querySelector('[data-fit-back]');
  var qNext = root.querySelector('[data-fit-next]');
  var qError = root.querySelector('[data-fit-error]');
  var resultHost = root.querySelector('[data-fit-result]');

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      if (screens[k]) screens[k].hidden = k !== name;
    });
    // Докато въпросите текат, сайтът наоколо се смълчава — инструментът
    // трябва да носи фокуса, както казва визуалната посока.
    document.documentElement.classList.toggle(
      'fit-focus', name === 'question' || name === 'calc'
    );
  }

  /* ======================================================================
     ВЪПРОСИТЕ

     Всеки връща { title, help, type, options, sub, autoAdvance }.
     options: [{ value, label, note }]
     ====================================================================== */

  function optionsFrom(values, keyPrefix) {
    return values.map(function (v) {
      return { value: v, label: t(keyPrefix + v) };
    });
  }

  function q2Title() {
    if (state.cities.indexOf('sofia') === -1) return t('fit.q2.nosofia');
    return state.sofiaOffices === '1' ? t('fit.q2.one') : t('fit.q2.many');
  }

  /* Бюджетните ленти се раждат от вече дадените отговори. */
  function budgetOptions() {
    var set = budgetBands(state.q2, state.q3, state.q5);
    if (!set) return [];
    return set.bands.map(function (b) {
      var label;
      if (b.kind === 'notsure') label = t('fit.q6.notsure');
      else if (b.kind === 'zero') label = money(0);
      else if (b.kind === 'upto') label = t('fit.q6.upto', { max: money(b.max) });
      else if (b.kind === 'open') label = t('fit.q6.open', { min: money(b.min) });
      else if (b.min === b.max) label = t('fit.q6.exact', { min: money(b.min) });
      else label = t('fit.q6.range', { min: money(b.min), max: money(b.max) });
      return { value: b.id, label: label };
    });
  }

  function questionSpec(step) {
    if (step === 1) {
      return {
        key: 'cities',
        title: t('fit.q1.title'),
        type: 'multi',
        options: optionsFrom(['sofia', 'plovdiv', 'varna', 'burgas', 'other'], 'fit.q1.'),
        // Броят офиси в София се пита на СЪЩИЯ екран, не като седми въпрос.
        sub: state.cities.indexOf('sofia') !== -1 ? {
          key: 'sofiaOffices',
          title: t('fit.q1.offices'),
          type: 'single',
          options: optionsFrom(['1', '2', '3plus'], 'fit.q1.offices.'),
        } : null,
        autoAdvance: false,
      };
    }

    if (step === 2) {
      var multipleSofia = state.sofiaOffices === '2' || state.sofiaOffices === '3plus';
      return {
        key: 'q2',
        title: q2Title(),
        type: 'single',
        options: optionsFrom(
          ['lte50', '51-100', '101-150', '151-300', '301-500', '501-999', '1000+'], 'fit.q2.'),
        // „А в най-големия от тях?" — пак на същия екран, както казва брифът.
        sub: multipleSofia ? {
          key: 'largestOffice',
          title: t('fit.q2.largest'),
          type: 'single',
          optional: true,
          options: optionsFrom(
            ['lte50', '51-100', '101-150', '151-300', '301-500', '501-999', '1000+'], 'fit.q2.'),
        } : null,
        autoAdvance: !multipleSofia,
      };
    }

    if (step === 3) {
      var ranges = q3RangesFor(state.q2) || [];
      return {
        key: 'q3',
        title: t('fit.q3.title'),
        help: t('fit.q3.help'),
        type: 'single',
        options: optionsFrom(ranges, 'fit.q3.'),
        autoAdvance: true,
      };
    }

    if (step === 4) {
      return {
        key: 'q4',
        title: t('fit.q4.title'),
        type: 'multi',
        options: optionsFrom(['canteen', 'vending', 'fruit', 'other', 'none'], 'fit.q4.'),
        autoAdvance: false,
      };
    }

    if (step === 5) {
      return {
        key: 'q5',
        title: t('fit.q5.title'),
        type: 'single',
        options: ['benefit', 'price-support', 'both', 'unsure'].map(function (v) {
          return { value: v, label: t('fit.q5.' + v), note: t('fit.q5.' + v + '.note') };
        }),
        autoAdvance: true,
      };
    }

    return {
      key: 'q6',
      title: t('fit.q6.title'),
      help: t('fit.q6.help'),
      type: 'single',
      options: budgetOptions(),
      autoAdvance: true,
    };
  }

  /* ======================================================================
     РИСУВАНЕ НА ЕКРАН С ВЪПРОС
     ====================================================================== */

  function buildGroup(spec, name, selected, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'fit-options' +
      (spec.type === 'multi' ? ' fit-options--multi' : '') +
      (spec.options.length > 5 ? ' fit-options--dense' : '');

    spec.options.forEach(function (opt) {
      var id = name + '-' + String(opt.value).replace(/[^a-z0-9]+/gi, '-');
      var label = document.createElement('label');
      label.className = 'fit-option';
      label.setAttribute('for', id);

      var input = document.createElement('input');
      input.className = 'fit-option__input';
      input.type = spec.type === 'multi' ? 'checkbox' : 'radio';
      input.name = name;
      input.id = id;
      input.value = opt.value;
      input.checked = spec.type === 'multi'
        ? selected.indexOf(opt.value) !== -1
        : selected === opt.value;

      var body = document.createElement('span');
      body.className = 'fit-option__body';

      var text = document.createElement('span');
      text.className = 'fit-option__label';
      text.textContent = opt.label;
      body.appendChild(text);

      if (opt.note) {
        var note = document.createElement('span');
        note.className = 'fit-option__note';
        note.textContent = opt.note;
        body.appendChild(note);
      }

      var mark = document.createElement('span');
      mark.className = 'fit-option__mark';
      mark.setAttribute('aria-hidden', 'true');

      label.appendChild(input);
      label.appendChild(body);
      label.appendChild(mark);
      wrap.appendChild(label);

      input.addEventListener('change', function () {
        onChange(opt.value, input.checked);
      });
    });

    return wrap;
  }

  function renderQuestion() {
    var step = state.step;
    var spec = questionSpec(step);

    qHost.innerHTML = '';
    clearError();

    var head = document.createElement('div');
    head.className = 'fit-q__head';

    var title = document.createElement('h1');
    title.className = 't-headline fit-q__title';
    title.id = 'fit-q-title';
    title.textContent = spec.title;
    head.appendChild(title);

    if (spec.help) {
      var help = document.createElement('p');
      help.className = 't-body t-muted fit-q__help measure';
      help.textContent = spec.help;
      head.appendChild(help);
    }

    if (spec.type === 'multi') {
      var multi = document.createElement('p');
      multi.className = 't-body-sm t-muted fit-q__hint';
      multi.textContent = t('fit.multi');
      head.appendChild(multi);
    }

    qHost.appendChild(head);

    var group = buildGroup(spec, 'fit-' + step, currentValue(spec.key), function (value, checked) {
      applyAnswer(spec, value, checked);
      clearError();
      maybeAutoAdvance(spec);
    });
    qHost.appendChild(group);

    // Подвъпросът се появява на СЪЩИЯ екран — без нов номер и без Q7.
    if (spec.sub) {
      var subWrap = document.createElement('div');
      subWrap.className = 'fit-sub';

      var subTitle = document.createElement('h2');
      subTitle.className = 't-heading fit-sub__title';
      subTitle.textContent = spec.sub.title;
      subWrap.appendChild(subTitle);

      subWrap.appendChild(buildGroup(spec.sub, 'fit-' + step + '-sub',
        currentValue(spec.sub.key), function (value) {
          state[spec.sub.key] = value;
          clearError();
          // Броят офиси в София мени формулировката на следващия въпрос.
          if (spec.sub.key === 'sofiaOffices') state.q2 = state.q2;
        }));

      qHost.appendChild(subWrap);
    }

    qProgress.textContent = t('fit.progress', { n: step });
    qProgress.setAttribute('aria-label', t('fit.a11y.step', { n: step }));
    qBar.style.setProperty('--fit-progress', (step / 6));
    qBar.setAttribute('aria-valuenow', String(step));

    qBack.hidden = false;
    qNext.hidden = spec.autoAdvance && !spec.sub;

    show('question');
    if (window.GenkiI18n) window.GenkiI18n.apply(qHost);

    // Фокусът отива на заглавието, за да знае екранният четец, че е нов
    // въпрос — без да краде фокуса от първия избор при клавиатура.
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
    root.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function currentValue(key) {
    var v = state[key];
    return Array.isArray(v) ? v.slice() : v;
  }

  function applyAnswer(spec, value, checked) {
    if (spec.type === 'multi') {
      var list = state[spec.key].slice();
      if (checked) {
        // „Нищо постоянно" не се комбинира с останалите — и обратното.
        if (value === 'none') list = ['none'];
        else {
          list = list.filter(function (v) { return v !== 'none'; });
          if (list.indexOf(value) === -1) list.push(value);
        }
      } else {
        list = list.filter(function (v) { return v !== value; });
      }
      state[spec.key] = list;

      if (spec.key === 'cities') {
        if (list.indexOf('sofia') === -1) state.sofiaOffices = null;
        renderQuestion();            // подвъпросът се появява или изчезва
      } else if (value === 'none' || list.indexOf('none') === -1) {
        syncChecked(spec, list);
      }
      return;
    }

    state[spec.key] = value;

    // Смяната на Q2 обезсмисля вече избрания Q3 и Q6; смяната на Q5 — Q6.
    if (spec.key === 'q2') { state.q3 = null; state.q6 = null; }
    if (spec.key === 'q3' || spec.key === 'q5') state.q6 = null;
  }

  /* Отразява „none" логиката върху вече нарисуваните полета. */
  function syncChecked(spec, list) {
    var inputs = qHost.querySelectorAll('input[name="fit-' + state.step + '"]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = list.indexOf(inputs[i].value) !== -1;
    }
  }

  var advanceTimer = null;

  function maybeAutoAdvance(spec) {
    if (!spec.autoAdvance || spec.sub) return;
    if (!isAnswered(spec)) return;
    window.clearTimeout(advanceTimer);
    // Кратка пауза, колкото да се види избраното състояние. Никога
    // толкова, че да се усети като чакане.
    advanceTimer = window.setTimeout(next, reducedMotion ? 0 : 240);
  }

  function isAnswered(spec) {
    var v = state[spec.key];
    if (spec.type === 'multi') return Array.isArray(v) && v.length > 0;
    if (!v) return false;
    if (spec.sub && !spec.sub.optional && !state[spec.sub.key]) return false;
    return true;
  }

  function showError() {
    qError.textContent = t('fit.err.choose');
    qError.hidden = false;
  }

  function clearError() {
    qError.hidden = true;
    qError.textContent = '';
  }

  /* ======================================================================
     НАВИГАЦИЯ
     ====================================================================== */

  function next() {
    var spec = questionSpec(state.step);
    if (!isAnswered(spec)) { showError(); return; }

    if (state.step >= 6) { finish(); return; }
    state.step += 1;
    renderQuestion();
  }

  function back() {
    window.clearTimeout(advanceTimer);
    if (state.step <= 1) {
      state.step = 0;
      show('hero');
      var startBtn = root.querySelector('[data-fit-start]');
      if (startBtn) startBtn.focus({ preventScroll: true });
      return;
    }
    state.step -= 1;
    renderQuestion();           // отговорите се пазят: state не се чисти
  }

  function start() {
    state.fitId = newFitId(
      window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID.bind(window.crypto)
        : null
    );
    state.step = 1;
    renderQuestion();
    track('genki_fit_started');
  }

  function finish() {
    show('calc');
    track('genki_fit_completed');
    // Кратка пауза прави резултата премерен, а не автоматичен. Никаква
    // фалшива „анализираме вашите данни" стъпка — само изчакване.
    window.setTimeout(renderResult, reducedMotion ? 0 : 900);
  }

  /* ======================================================================
     РЕЗУЛТАТ
     ====================================================================== */

  function answers() {
    return {
      q1: { cities: state.cities.slice(), sofiaOffices: state.sofiaOffices },
      q2: state.q2, q3: state.q3, q4: state.q4.slice(), q5: state.q5, q6: state.q6,
      largestOffice: state.largestOffice,
    };
  }

  function attendanceText() {
    var label = t('fit.q3.' + state.q3);
    return lowerFirst(label);
  }

  function reasonsFor(rec) {
    var list = [t('fit.why.attendance', { range: attendanceText() })];

    if (state.q5 === 'unsure') {
      list.push(t('fit.why.unsure'));
    } else {
      list.push(state.q4.indexOf('none') !== -1 ? t('fit.why.fresh') : t('fit.why.coexist'));
    }

    if (rec.approach === 'both') list.push(t('fit.why.both'));
    else if (rec.approach === 'benefit') {
      list.push(rec.reason === 'benefit-only-ps-later' ? t('fit.why.pslater') : t('fit.why.benefit'));
    } else if (rec.approach === 'price-support') list.push(t('fit.why.ps'));
    else if (rec.approach === 'core') list.push(t('fit.why.core'));

    return list.slice(0, 3);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderResult() {
    var rec = recommend(answers());
    resultHost.innerHTML = '';

    if (!rec) {
      // Не бива да се случи — валидирано е на всяка стъпка. Ако все пак:
      // човекът получава разговор, не празен екран.
      resultHost.appendChild(buildSoftConsultation());
      resultHost.appendChild(buildLeadCapture(null));
      show('result');
      return;
    }

    resultHost.appendChild(
      rec.outcome === 'consultation' ? buildSoftConsultation() : buildNormalResult(rec)
    );
    resultHost.appendChild(buildLeadCapture(rec));

    show('result');
    if (window.GenkiI18n) window.GenkiI18n.apply(resultHost);

    var head = resultHost.querySelector('[data-fit-result-head]');
    if (head) { head.setAttribute('tabindex', '-1'); head.focus({ preventScroll: true }); }
    root.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function buildNormalResult(rec) {
    var wrap = el('div', 'fit-result');

    var head = el('div', 'fit-result__head');
    head.setAttribute('data-fit-result-head', '');
    head.appendChild(el('p', 't-label fit-result__done', t('fit.result.done')));
    head.appendChild(el('h1', 't-headline fit-result__title', t('fit.result.title')));
    wrap.appendChild(head);

    var cards = el('div', 'fit-cards');

    /* 1. Вашият Genki — вероятният размер, без вътрешни имена. */
    var c1 = el('article', 'fit-card fit-card--setup');
    c1.appendChild(el('p', 't-label fit-card__label', t('fit.result.c1')));
    var slot = document.createElement('genki-slot');
    slot.setAttribute('slot-id', 'F08');
    c1.appendChild(slot);
    c1.appendChild(el('h2', 't-heading fit-card__title', t('fit.hw.' + rec.hardware)));
    c1.appendChild(el('p', 't-body-sm t-muted fit-card__caveat', t('fit.result.caveat')));
    cards.appendChild(c1);

    /* 2. Нашата препоръка — конфигурация, % подкрепа, закръглен бюджет. */
    var c2 = el('article', 'fit-card fit-card--offer');
    c2.appendChild(el('p', 't-label fit-card__label', t('fit.result.c2')));
    c2.appendChild(el('h2', 't-heading fit-card__title', t('fit.ap.' + rec.approach)));
    c2.appendChild(el('p', 't-body fit-card__note', t('fit.ap.' + rec.approach + '.note')));

    if (rec.psLevel) {
      c2.appendChild(el('p', 't-body-sm fit-card__ps', t('fit.result.ps', { pct: rec.psLevel })));
    }

    if (rec.employerBudget) {
      var b = el('div', 'fit-card__budget');
      b.appendChild(el('p', 't-label fit-card__label', t('fit.result.budget')));
      b.appendChild(el('p', 'fit-card__amount', t(
        rec.employerBudget.approx ? 'fit.result.budget.approx' : 'fit.result.budget.exact',
        { amount: money(rec.employerBudget.amount) }
      )));
      c2.appendChild(b);
    }
    cards.appendChild(c2);

    /* 3. Защо това е подходящо — от собствените им отговори. */
    var c3 = el('article', 'fit-card fit-card--why');
    c3.appendChild(el('p', 't-label fit-card__label', t('fit.result.c3')));
    var ul = el('ul', 'fit-why');
    reasonsFor(rec).forEach(function (line) {
      ul.appendChild(el('li', 'fit-why__item', line));
    });
    c3.appendChild(ul);
    cards.appendChild(c3);

    wrap.appendChild(cards);
    return wrap;
  }

  function buildSoftConsultation() {
    // Никога не изглежда като по-лош резултат: същият контейнер, същата
    // тежест, нито дума за отказ.
    var wrap = el('div', 'fit-result fit-result--soft');
    var head = el('div', 'fit-result__head');
    head.setAttribute('data-fit-result-head', '');
    head.appendChild(el('p', 't-label fit-result__done', t('fit.result.done')));
    head.appendChild(el('h1', 't-headline fit-result__title', t('fit.soft.title')));
    wrap.appendChild(head);

    var body = el('div', 'fit-soft measure');
    body.appendChild(el('p', 't-body', t('fit.soft.p1')));
    body.appendChild(el('p', 't-body', t('fit.soft.p2')));
    wrap.appendChild(body);
    return wrap;
  }

  /* ======================================================================
     СЪБИРАНЕ НА КОНТАКТ

     Резултатът остава видим над формата и след изпращане. Locked flow:
     резултат → email → име/компания/телефон → потвърждение → CTA.
     ====================================================================== */

  var lead = { email: '', name: '', company: '', phone: '' };
  var sending = false;

  function field(id, labelKey, type, opts) {
    var wrap = el('div', 'cform__field');
    var label = el('label', 'cform__label');
    label.setAttribute('for', id);
    label.appendChild(el('span', null, t(labelKey)));
    if (opts && opts.optionalKey) {
      var o = el('span', 'cform__optional');
      o.textContent = '— ' + t(opts.optionalKey);
      label.appendChild(o);
    }
    var input = document.createElement('input');
    input.className = 'cform__input';
    input.id = id;
    input.type = type;
    input.setAttribute('aria-describedby', id + '-err');
    if (opts && opts.autocomplete) input.autocomplete = opts.autocomplete;
    if (opts && opts.inputmode) input.inputMode = opts.inputmode;
    if (opts && opts.maxlength) input.maxLength = opts.maxlength;
    if (!(opts && opts.optionalKey)) input.required = true;

    var err = el('p', 'cform__error');
    err.id = id + '-err';
    err.hidden = true;

    wrap.appendChild(label);
    wrap.appendChild(input);
    wrap.appendChild(err);

    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid')) setFieldError(input, null);
    });
    return { wrap: wrap, input: input, err: err };
  }

  function setFieldError(input, messageKey) {
    var err = document.getElementById(input.id + '-err');
    if (messageKey) {
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = t(messageKey); err.hidden = false; }
    } else {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      if (err) { err.hidden = true; err.textContent = ''; }
    }
  }

  function looksLikeEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function buildLeadCapture(rec) {
    var wrap = el('section', 'fit-lead');
    wrap.setAttribute('data-fit-lead', '');
    renderLeadStep1(wrap, rec);
    return wrap;
  }

  function renderLeadStep1(wrap, rec) {
    wrap.innerHTML = '';
    wrap.appendChild(el('h2', 't-heading fit-lead__title', t('fit.lead.title')));

    var form = el('form', 'cform fit-lead__form');
    form.noValidate = true;

    var email = field('fit-email', 'fit.lead.email', 'email', {
      autocomplete: 'email', inputmode: 'email', maxlength: 200,
    });
    email.input.value = lead.email;
    form.appendChild(email.wrap);

    var btn = el('button', 'btn btn--fit cform__submit');
    btn.type = 'submit';
    btn.appendChild(el('span', null, t('fit.lead.send')));
    var arrow = el('span', 'btn__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    btn.appendChild(arrow);
    form.appendChild(btn);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = email.input.value.trim();
      if (!looksLikeEmail(value)) {
        setFieldError(email.input, 'fit.err.email');
        email.input.focus();
        return;
      }
      lead.email = value;
      track('genki_fit_email');
      renderLeadStep2(wrap, rec);
    });

    wrap.appendChild(form);
  }

  function renderLeadStep2(wrap, rec) {
    wrap.innerHTML = '';
    var title = el('h2', 't-heading fit-lead__title', t('fit.lead.title2'));
    title.setAttribute('tabindex', '-1');
    wrap.appendChild(title);

    var form = el('form', 'cform fit-lead__form');
    form.noValidate = true;

    var summary = el('p', 'cform__summary');
    summary.setAttribute('role', 'alert');
    summary.hidden = true;
    form.appendChild(summary);

    var name = field('fit-name', 'fit.lead.name', 'text', { autocomplete: 'name', maxlength: 120 });
    var company = field('fit-company', 'fit.lead.company', 'text', { autocomplete: 'organization', maxlength: 160 });
    var phone = field('fit-phone', 'fit.lead.phone', 'tel', {
      autocomplete: 'tel', inputmode: 'tel', maxlength: 40, optionalKey: 'fit.lead.phone.note',
    });
    name.input.value = lead.name;
    company.input.value = lead.company;
    phone.input.value = lead.phone;
    form.appendChild(name.wrap);
    form.appendChild(company.wrap);
    form.appendChild(phone.wrap);

    // Honeypot — същата техника като на формата за контакт.
    var hp = el('div', 'cform__hp');
    hp.setAttribute('aria-hidden', 'true');
    var hpLabel = el('label', null, 'Website');
    hpLabel.setAttribute('for', 'fit-website');
    var hpInput = document.createElement('input');
    hpInput.id = 'fit-website';
    hpInput.type = 'text';
    hpInput.tabIndex = -1;
    hpInput.autocomplete = 'off';
    hp.appendChild(hpLabel);
    hp.appendChild(hpInput);
    form.appendChild(hp);

    var btn = el('button', 'btn btn--fit cform__submit');
    btn.type = 'submit';
    var btnLabel = el('span', null, t('fit.lead.submit'));
    btn.appendChild(btnLabel);
    var arrow = el('span', 'btn__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    btn.appendChild(arrow);
    form.appendChild(btn);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;

      summary.hidden = true;
      var firstBad = null;
      if (!name.input.value.trim()) { setFieldError(name.input, 'fit.err.name'); firstBad = firstBad || name.input; }
      else setFieldError(name.input, null);
      if (!company.input.value.trim()) { setFieldError(company.input, 'fit.err.company'); firstBad = firstBad || company.input; }
      else setFieldError(company.input, null);

      if (firstBad) {
        summary.textContent = t('fit.err.summary');
        summary.hidden = false;
        firstBad.focus();
        return;
      }

      lead.name = name.input.value.trim();
      lead.company = company.input.value.trim();
      lead.phone = phone.input.value.trim();

      sending = true;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btnLabel.textContent = t('fit.lead.sending');

      var a = answers();
      var payload = {
        cities: a.q1.cities, sofiaOffices: a.q1.sofiaOffices,
        q2: a.q2, q3: a.q3, q4: a.q4, q5: a.q5, q6: a.q6,
        largestOffice: a.largestOffice,
        email: lead.email, name: lead.name, company: lead.company, phone: lead.phone,
        website: hpInput.value,
        lang: lang(),
        fitId: state.fitId,
      };

      window.fetch('/api/genki-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; })
            .then(function (body) { return { ok: res.ok, body: body }; });
        })
        .then(function (r) {
          sending = false;
          if (!r.ok || !r.body || r.body.ok !== true) {
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            btnLabel.textContent = t('fit.lead.submit');
            summary.textContent = t('fit.err.server');
            summary.hidden = false;
            track('genki_fit_error');
            return;
          }
          renderConfirmation(wrap);
          track('genki_fit_lead');
        })
        .catch(function () {
          sending = false;
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
          btnLabel.textContent = t('fit.lead.submit');
          summary.textContent = t('fit.err.network');
          summary.hidden = false;
          track('genki_fit_error');
        });
    });

    wrap.appendChild(form);
    if (window.GenkiI18n) window.GenkiI18n.apply(wrap);
    title.focus({ preventScroll: true });
  }

  function renderConfirmation(wrap) {
    wrap.innerHTML = '';
    var box = el('div', 'cform__success fit-confirm');
    box.setAttribute('role', 'status');
    box.setAttribute('tabindex', '-1');
    box.appendChild(el('h2', 't-heading cform__success-title', t('fit.confirm.title')));
    box.appendChild(el('p', 't-body', t('fit.confirm.text')));

    // Чак сега се показва CTA-то за разговор — така е заключен редът.
    var cta = el('a', 'btn btn--fit fit-confirm__cta');
    cta.href = 'contact.html';
    cta.appendChild(el('span', null, t('fit.result.cta')));
    var arrow = el('span', 'btn__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    cta.appendChild(arrow);
    box.appendChild(cta);

    wrap.appendChild(box);
    box.focus({ preventScroll: true });
  }

  /* ======================================================================
     АНАЛИТИКА — само ако вече има платформа. Нито един отговор не пътува.
     ====================================================================== */
  function track(event) {
    try {
      if (window.umami && typeof window.umami.track === 'function') window.umami.track(event);
      else if (typeof window.dataLayer !== 'undefined' && window.dataLayer.push) {
        window.dataLayer.push({ event: event });
      }
    } catch (e) { /* аналитиката никога не чупи инструмента */ }
  }

  /* ======================================================================
     ЗАКАЧАНЕ
     ====================================================================== */

  function init() {
    var startBtn = root.querySelector('[data-fit-start]');
    if (startBtn) startBtn.addEventListener('click', start);
    if (qNext) qNext.addEventListener('click', next);
    if (qBack) qBack.addEventListener('click', back);

    // Enter вътре във въпрос продължава напред, но никога не изпраща.
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (screens.question && screens.question.hidden) return;
      if (e.target && e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      next();
    });

    // Смяната на езика пречертава текущия екран с новите низове.
    document.addEventListener('genki:langchange', function () {
      if (state.step >= 1 && screens.question && !screens.question.hidden) renderQuestion();
      else if (screens.result && !screens.result.hidden) {
        var leadWrap = resultHost.querySelector('[data-fit-lead]');
        var inLead = leadWrap && leadWrap.querySelector('form');
        if (!inLead) renderResult();
        else if (window.GenkiI18n) window.GenkiI18n.apply(resultHost);
      }
      if (window.GenkiI18n) window.GenkiI18n.apply(root);
    });

    root.classList.add('fit--ready');
    show('hero');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
