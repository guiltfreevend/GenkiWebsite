/* ==========================================================================
   Genki Fit — малкото приложение на Genki.

   Не е форма, вградена в сайта. Един въпрос на екран, голям типографски
   ритъм, едри зони за докосване, видим напредък, „Назад" пази отговорите.
   Цел: под минута.

   АРХИТЕКТУРА
     Логиката НЕ живее тук. Диапазоните, икономиката, бюджетните ленти и
     препоръката идват от lib/genki-fit-logic.js — същия модул, който
     ползва и сървърът. Този файл е само интерфейс.

   СТОЙНОСТ ПЪРВО
     Резултатът е героят на финалния екран и се вижда БЕЗ никакви
     контактни данни. Изпращането по имейл е по желание и е вторично
     действие. Няма отметка „свържете се с мен" — ако човек я остави
     празна, тя става ограничение върху бъдещ разговор.

   ДОВЕРИЕ
     Сървърът пресмята всичко НАНОВО и не вярва на нищо оттук. Genki Fit
     кодът също се ражда на сървъра.

   ДОСТЪПНОСТ
     Изборите са истински <input type="radio"> и <input type="checkbox">.
     Така стрелките, Tab, Space и екранните четци работят без нито един
     ARIA трик, а целият етикет е кликаема повърхност.

   ПРОГРЕСИВЕН ЗАПИС
     След всяка ПОТВЪРДЕНА стъпка отговорите отиват на сървъра и се
     записват в една Fit сесия. Веднъж потвърдено, нищо не може да
     изчезне само защото човекът е затворил страницата.

     НЕ се записва при зареждане, при фокус и при натискане на клавиш.
     Нищо от това, което човекът още не е потвърдил, не пътува никъде.

     Токенът на сесията стои в sessionStorage — живее само в този таб и
     изчезва при затваряне. Нарочно НЕ е localStorage и НЕ е бисквитка:
     целта е да не се създават няколко Fit кода при refresh, а не да се
     проследява човекът във времето.
   ========================================================================== */

import {
  Q3_RANGES_BY_Q2, q3RangesFor, attendanceBounds, budgetBands,
  recommend,
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
    step: 0,                    // 0 = hero, 1..6 = въпроси
    company: '',
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

  /* --- Fit сесия --------------------------------------------------------
     fitCode  е публичен: човекът го вижда и го казва по телефона.
     token    е таен: само с него сървърът позволява промяна на сесията.
              Затова не влиза в URL, в имейл или в текст за показване. */
  var SS_TOKEN = 'genki_fit_token';
  var SS_CODE = 'genki_fit_code';
  var sessionToken = null;
  var fitCode = null;

  function readSession() {
    try {
      sessionToken = window.sessionStorage.getItem(SS_TOKEN) || null;
      fitCode = window.sessionStorage.getItem(SS_CODE) || null;
    } catch (e) { /* частен режим — сесията просто не преживява refresh */ }
  }

  function rememberSession(token, code) {
    if (token) sessionToken = token;
    if (code) fitCode = code;
    try {
      if (token) window.sessionStorage.setItem(SS_TOKEN, token);
      if (code) window.sessionStorage.setItem(SS_CODE, code);
    } catch (e) { /* виж горе */ }
  }

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
        // Компанията е задължителна още тук: трябва да знаем чий е офисът
        // дори когато човекът спре по средата. Това НЕ е седми въпрос —
        // стои на същия екран.
        textField: { key: 'company', label: t('fit.q1.company'), max: 160 },
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

    // Полето за компания и бележката за прозрачност — само на Q1.
    if (spec.textField) {
      var fieldWrap = document.createElement('div');
      fieldWrap.className = 'fit-textfield';

      var fLabel = document.createElement('label');
      fLabel.className = 'cform__label';
      fLabel.setAttribute('for', 'fit-' + spec.textField.key);
      fLabel.textContent = spec.textField.label;

      var fInput = document.createElement('input');
      fInput.className = 'cform__input';
      fInput.id = 'fit-' + spec.textField.key;
      fInput.type = 'text';
      fInput.autocomplete = 'organization';
      fInput.maxLength = spec.textField.max;
      fInput.required = true;
      fInput.value = state[spec.textField.key] || '';
      fInput.setAttribute('aria-describedby', 'fit-' + spec.textField.key + '-err');

      var fErr = document.createElement('p');
      fErr.className = 'cform__error';
      fErr.id = 'fit-' + spec.textField.key + '-err';
      fErr.hidden = true;

      fInput.addEventListener('input', function () {
        // Стойността живее в паметта. НИЩО не пътува към сървъра, докато
        // човекът не потвърди стъпката.
        state[spec.textField.key] = fInput.value;
        if (fInput.classList.contains('is-invalid')) {
          fInput.classList.remove('is-invalid');
          fInput.removeAttribute('aria-invalid');
          fErr.hidden = true;
        }
        clearError();
      });

      fieldWrap.appendChild(fLabel);
      fieldWrap.appendChild(fInput);
      fieldWrap.appendChild(fErr);
      qHost.appendChild(fieldWrap);

      // Прозрачност, преди първия запис. Кратко и без юридически тон.
      var note = document.createElement('p');
      note.className = 't-body-sm t-muted fit-privacy';
      note.appendChild(document.createTextNode(t('fit.privacy.note') + ' '));
      var link = document.createElement('a');
      link.href = '/privacy';
      link.textContent = t('fit.privacy.link');
      note.appendChild(link);
      qHost.appendChild(note);
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
    if (spec.textField && !String(state[spec.textField.key] || '').trim()) return false;
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
    if (!isAnswered(spec)) {
      // Ако липсва точно текстовото поле, грешката отива до него.
      if (spec.textField && !String(state[spec.textField.key] || '').trim()) {
        var input = document.getElementById('fit-' + spec.textField.key);
        var err = document.getElementById('fit-' + spec.textField.key + '-err');
        if (input && err) {
          input.classList.add('is-invalid');
          input.setAttribute('aria-invalid', 'true');
          err.textContent = t('fit.err.company');
          err.hidden = false;
          input.focus();
          return;
        }
      }
      showError();
      return;
    }

    // Стъпката е потвърдена — чак сега пътува към сървъра.
    persistStep(state.step);

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
     ПРОГРЕСИВЕН ЗАПИС

     Една заявка след всяка ПОТВЪРДЕНА стъпка. Изпраща се пълна снимка на
     известното дотук, не разлика — така връщането назад и смяната на Q2
     наистина изчистват зависимите Q3 и Q6 и от сървъра, а пропаднала
     заявка се навакса от следващата.

     Интерфейсът НИКОГА не чака мрежата: заявките вървят в подредена
     опашка отстрани, а въпросите се сменят веднага.
     ====================================================================== */

  var saveQueue = Promise.resolve();

  function answersPayload(step) {
    var p = {
      action: 'step',
      step: step,
      lang: lang(),
      company: String(state.company || '').trim(),
      cities: state.cities.slice(),
      sofiaOffices: state.sofiaOffices,
    };
    if (sessionToken) p.token = sessionToken;
    if (step >= 2) { p.q2 = state.q2; p.largestOffice = state.largestOffice; }
    if (step >= 3) p.q3 = state.q3;
    if (step >= 4) p.q4 = state.q4.slice();
    if (step >= 5) p.q5 = state.q5;
    if (step >= 6) p.q6 = state.q6;
    return p;
  }

  function postJson(payload) {
    return window.fetch('/api/genki-fit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json().catch(function () { return {}; })
        .then(function (body) { return { ok: res.ok, status: res.status, body: body }; });
    });
  }

  function persistStep(step) {
    saveQueue = saveQueue.then(function () { return sendStep(step, 0); });
    return saveQueue;
  }

  function sendStep(step, attempt) {
    var hadToken = !!sessionToken;

    return postJson(answersPayload(step))
      .then(function (r) {
        if (r.ok && r.body && r.body.ok) {
          rememberSession(r.body.token, r.body.code);
          return true;
        }
        // Токенът вече не важи (изчистена база при разработка) — започва
        // се наново, вместо да се блокира записът завинаги.
        if (r.status === 404 && hadToken) {
          sessionToken = null;
          try { window.sessionStorage.removeItem('genki_fit_token'); } catch (e) {}
          return sendStep(step, attempt + 1);
        }
        return retry(step, attempt, hadToken);
      })
      .catch(function () { return retry(step, attempt, hadToken); });
  }

  /* Един повторен опит, и то САМО за обновяване. Създаването нарочно не
     се повтаря: ако отговорът се е загубил, но записът е минал, повторът
     би родил втора сесия с втори Fit код. По-добре следващата стъпка да
     навакса — тя носи същите отговори. */
  function retry(step, attempt, hadToken) {
    if (attempt >= 1 || !hadToken) return false;
    return new Promise(function (resolve) {
      window.setTimeout(function () { resolve(sendStep(step, attempt + 1)); }, 800);
    });
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
      resultHost.appendChild(buildActions());
      show('result');
      return;
    }

    resultHost.appendChild(
      rec.outcome === 'consultation' ? buildSoftConsultation() : buildNormalResult(rec)
    );
    resultHost.appendChild(buildActions());

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
     ВТОРИЧНИ ДЕЙСТВИЯ

     Резултатът е героят на екрана. Тези две действия стоят ПОД него и
     нарочно не се борят с него:

       • „Изпратете ми този Genki Fit" — по желание. Резултатът НЕ е
         заключен зад имейл. Стойност първо, лийд после.
       • „Свържете се с Genki" — води към реалната страница за контакт.
         Няма система за резервация, затова няма и „Запазете среща".

     Няма отметка „искам да се свържете с мен": ако човек я остави
     празна, тя се превръща в ограничение върху бъдещ разговор и в
     двусмислие. По-добре да я няма изобщо.
     ====================================================================== */

  var destEmail = '';      // запомнен в паметта на страницата за тази сесия
  var sentCode = null;     // кодът от сървъра, след успешно изпращане
  var sending = false;

  function looksLikeEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function buildActions() {
    var wrap = el('section', 'fit-actions');
    wrap.setAttribute('data-fit-actions', '');
    renderActions(wrap);
    return wrap;
  }

  function renderActions(wrap) {
    wrap.innerHTML = '';

    if (sentCode) { renderSent(wrap); return; }

    var row = el('div', 'fit-actions__row');

    var send = el('button', 'btn btn--secondary fit-actions__send');
    send.type = 'button';
    send.setAttribute('data-fit-send-open', '');
    send.appendChild(el('span', null, t('fit.send.action')));
    row.appendChild(send);

    var contact = el('a', 'link-arrow fit-actions__contact');
    contact.href = 'contact.html';
    contact.appendChild(el('span', null, t('fit.contact.action')));
    var arrow = el('span', 'btn__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    contact.appendChild(arrow);
    row.appendChild(contact);

    wrap.appendChild(row);

    // Панелът се разгръща НА МЯСТО. Без модал и без навигация — човекът
    // не бива да губи резултата от очи заради едно поле.
    var panel = el('div', 'fit-send');
    panel.setAttribute('data-fit-send-panel', '');
    panel.hidden = true;
    wrap.appendChild(panel);

    send.addEventListener('click', function () {
      var opening = panel.hidden;
      panel.hidden = !opening;
      send.setAttribute('aria-expanded', opening ? 'true' : 'false');
      if (opening) {
        renderSendPanel(panel, wrap);
        track('genki_fit_send_open');
      }
    });
    send.setAttribute('aria-expanded', 'false');
  }

  /** Едно поле, ако още няма адрес. Потвърждение, ако вече има. */
  function renderSendPanel(panel, wrap) {
    panel.innerHTML = '';

    if (destEmail && looksLikeEmail(destEmail)) renderConfirmState(panel, wrap);
    else renderEditState(panel, wrap);

    if (window.GenkiI18n) window.GenkiI18n.apply(panel);
  }

  function renderConfirmState(panel, wrap) {
    var line = el('div', 'fit-send__to');
    line.appendChild(el('span', 't-body-sm t-muted', t('fit.send.to')));
    line.appendChild(el('span', 'fit-send__addr', destEmail));

    var change = el('button', 'fit-send__change');
    change.type = 'button';
    change.textContent = t('fit.send.change');
    change.addEventListener('click', function () { renderEditState(panel, wrap, true); });
    line.appendChild(change);

    panel.appendChild(line);
    panel.appendChild(sendButton(panel, wrap, t('fit.send.submit.to', { email: destEmail })));
    panel.appendChild(summaryNode(panel));
  }

  function renderEditState(panel, wrap, focus) {
    panel.innerHTML = '';

    var form = el('form', 'cform fit-send__form');
    form.noValidate = true;

    var field = el('div', 'cform__field');
    var label = el('label', 'cform__label');
    label.setAttribute('for', 'fit-email');
    label.textContent = t('fit.send.email');

    var input = document.createElement('input');
    input.className = 'cform__input';
    input.id = 'fit-email';
    input.type = 'email';
    input.autocomplete = 'email';
    input.inputMode = 'email';
    input.maxLength = 200;
    input.required = true;
    input.value = destEmail;
    input.setAttribute('aria-describedby', 'fit-email-err');

    var err = el('p', 'cform__error');
    err.id = 'fit-email-err';
    err.hidden = true;

    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(err);
    form.appendChild(field);

    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        err.hidden = true;
      }
    });

    var btn = el('button', 'btn btn--fit fit-send__submit');
    btn.type = 'submit';
    btn.appendChild(el('span', null, t('fit.send.submit')));
    form.appendChild(btn);

    var summary = summaryNode(panel);
    form.appendChild(summary);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = input.value.trim();
      if (!looksLikeEmail(value)) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        err.textContent = t('fit.err.email');
        err.hidden = false;
        input.focus();
        return;
      }
      destEmail = value;
      submit(panel, wrap, btn, summary);
    });

    panel.appendChild(form);
    if (window.GenkiI18n) window.GenkiI18n.apply(panel);
    if (focus) input.focus();
  }

  function summaryNode(panel) {
    var existing = panel.querySelector('.cform__summary');
    if (existing) return existing;
    var summary = el('p', 'cform__summary fit-send__summary');
    summary.setAttribute('role', 'alert');
    summary.hidden = true;
    return summary;
  }

  function sendButton(panel, wrap, label) {
    var btn = el('button', 'btn btn--fit fit-send__submit');
    btn.type = 'button';
    btn.appendChild(el('span', null, label));
    btn.addEventListener('click', function () {
      submit(panel, wrap, btn, panel.querySelector('.cform__summary'));
    });
    return btn;
  }

  function submit(panel, wrap, btn, summary) {
    if (sending) return;
    sending = true;

    var labelNode = btn.querySelector('span');
    var previous = labelNode.textContent;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    labelNode.textContent = t('fit.send.sending');
    if (summary) summary.hidden = true;

    // Отговорите вече са на сървъра. Тук пътуват само токенът и адресът:
    // сървърът вади сесията и смята препоръката наново от записаното.
    var payload = {
      action: 'send',
      token: sessionToken,
      email: destEmail,
      lang: lang(),
    };

    // Ако последната стъпка още не е стигнала до сървъра, изчакваме я —
    // иначе сесията още не е „completed" и изпращането ще бъде отказано.
    saveQueue
      .then(function () { return postJson(payload); })
      .then(function (r) {
        sending = false;
        if (!r.ok || !r.body || r.body.ok !== true || !r.body.code) {
          restore(btn, labelNode, previous);
          if (summary) { summary.textContent = t('fit.err.server'); summary.hidden = false; }
          track('genki_fit_send_error');
          return;
        }
        // Кодът идва от сървъра. Клиентът не измисля идентификатори.
        sentCode = r.body.code;
        if (r.body.email) destEmail = r.body.email;
        renderActions(wrap);
        track('genki_fit_sent');
      })
      .catch(function () {
        sending = false;
        restore(btn, labelNode, previous);
        if (summary) { summary.textContent = t('fit.err.network'); summary.hidden = false; }
        track('genki_fit_send_error');
      });
  }

  function restore(btn, labelNode, previous) {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    labelNode.textContent = previous;
  }

  /** Изпратено. Адресът и кодът стоят видими; резултатът остава над тях. */
  function renderSent(wrap) {
    var box = el('div', 'fit-sent');
    box.setAttribute('role', 'status');
    box.setAttribute('tabindex', '-1');

    box.appendChild(el('p', 'fit-sent__title', t('fit.send.done', { email: destEmail })));
    // Само кодът е моноширинен. Цялото изречение в monospace изглежда
    // като терминал, а кирилицата в такъв шрифт се чете зле.
    var codeLine = el('p', 'fit-sent__code');
    var parts = raw('fit.send.done.code').split('{code}');
    codeLine.appendChild(document.createTextNode(parts[0] || ''));
    codeLine.appendChild(el('span', 'fit-sent__codeval', sentCode));
    codeLine.appendChild(document.createTextNode(parts[1] || ''));
    box.appendChild(codeLine);
    box.appendChild(el('p', 't-body-sm t-muted fit-sent__keep', t('fit.send.done.keep')));

    var contact = el('a', 'link-arrow fit-sent__contact');
    contact.href = 'contact.html';
    contact.appendChild(el('span', null, t('fit.contact.action')));
    var arrow = el('span', 'btn__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    contact.appendChild(arrow);
    box.appendChild(contact);

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
        // Изпратеното състояние не се пречертава: кодът и адресът вече са
        // факт и не бива да изчезнат при смяна на езика.
        if (sentCode) { if (window.GenkiI18n) window.GenkiI18n.apply(resultHost); }
        else renderResult();
      }
      if (window.GenkiI18n) window.GenkiI18n.apply(root);
    });

    // Ако същият таб вече е започнал Fit, продължаваме СЪЩАТА сесия —
    // за да не се раждат няколко Fit кода при refresh или Назад.
    readSession();

    root.classList.add('fit--ready');
    show('hero');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
