/* ==========================================================================
   Genki 2.0 — двуезична система (BG по подразбиране, EN алтернатива)

   Принципи:
   - Целият видим текст идва от js/genki-translations.js. В HTML стои
     българският вариант като fallback, за да не е празна страницата преди
     да е зареден скриптът.
   - Смяната на езика не презарежда страницата.
   - Изборът се пази в localStorage и се възстановява при следващо влизане.
   - document.documentElement.lang се обновява — иначе екранните четци четат
     английски текст с българска фонетика.

   Поддържани атрибути:
     data-i18n                 -> textContent
     data-i18n-html            -> innerHTML (само за низове с вграден markup;
                                  изрично, за да не се гадае по наличие на "<")
     data-i18n-placeholder     -> placeholder
     data-i18n-alt             -> alt
     data-i18n-title           -> title
     data-i18n-aria-label      -> aria-label
     data-i18n-content         -> content (мета тагове)

   Публичен интерфейс:
     GenkiI18n.lang                текущият език
     GenkiI18n.t(key)              низ на текущия език
     GenkiI18n.set(lang)           смяна на езика
     GenkiI18n.apply(root)         прилага преводите върху поддърво
                                   (нужно след динамично вмъкнат HTML)
     document -> "genki:langchange" събитие след всяка смяна
   ========================================================================== */

(function (global) {
  'use strict';

  var SUPPORTED = ['bg', 'en'];
  var DEFAULT_LANG = 'bg';
  var STORAGE_KEY = 'genki_lang';

  var ATTR_MAP = [
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-title', 'title'],
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-content', 'content'],
  ];

  var current = DEFAULT_LANG;

  function dict() {
    return global.genkiTranslations || {};
  }

  function readStored() {
    try {
      return global.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* Private mode / блокирани бисквитки — езикът просто не се помни. */
      return null;
    }
  }

  function writeStored(lang) {
    try {
      global.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* Виж горе. Смяната пак работи, само не преживява презареждане. */
    }
  }

  function normalize(lang) {
    return SUPPORTED.indexOf(lang) !== -1 ? lang : null;
  }

  function detect() {
    /* Ред на приоритет: ?lang= в адреса > запомненият избор > BG. */
    var fromQuery = null;
    try {
      fromQuery = normalize(new URLSearchParams(global.location.search).get('lang'));
    } catch (e) { /* стари браузъри */ }
    return fromQuery || normalize(readStored()) || DEFAULT_LANG;
  }

  function t(key, lang) {
    var entry = dict()[key];
    var l = lang || current;
    if (!entry) {
      if (isDev()) console.warn('[genki-i18n] липсващ ключ:', key);
      return null;
    }
    if (typeof entry[l] !== 'string') {
      if (isDev()) console.warn('[genki-i18n] ключът "' + key + '" няма превод за "' + l + '"');
      return null;
    }
    return entry[l];
  }

  function isDev() {
    var h = global.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '' || h.endsWith('.local');
  }

  function applyTo(el) {
    var key = el.getAttribute('data-i18n');
    var value;

    if (key) {
      value = t(key);
      if (value !== null) el.textContent = value;
    }

    key = el.getAttribute('data-i18n-html');
    if (key) {
      value = t(key);
      if (value !== null) el.innerHTML = value;
    }

    for (var i = 0; i < ATTR_MAP.length; i++) {
      key = el.getAttribute(ATTR_MAP[i][0]);
      if (!key) continue;
      value = t(key);
      if (value !== null) el.setAttribute(ATTR_MAP[i][1], value);
    }
  }

  var SELECTOR = '[data-i18n],[data-i18n-html],[data-i18n-placeholder],' +
                 '[data-i18n-alt],[data-i18n-title],[data-i18n-aria-label],' +
                 '[data-i18n-content]';

  function apply(root) {
    var scope = root || document;

    /* Самият корен също може да носи атрибут, ако е вмъкнат динамично. */
    if (scope !== document && scope.matches && scope.matches(SELECTOR)) applyTo(scope);

    var nodes = scope.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) applyTo(nodes[i]);

    if (scope === document) {
      document.documentElement.lang = current;
      updateSwitchers();
    }
  }

  function updateSwitchers() {
    var buttons = document.querySelectorAll('[data-lang-option]');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var active = b.getAttribute('data-lang-option') === current;
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      b.classList.toggle('is-active', active);
    }
  }

  function set(lang) {
    var next = normalize(lang);
    if (!next || next === current) return;
    current = next;
    writeStored(next);
    apply(document);
    document.dispatchEvent(new CustomEvent('genki:langchange', { detail: { lang: next } }));
  }

  function bindSwitchers() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest ? e.target.closest('[data-lang-option]') : null;
      if (!target) return;
      e.preventDefault();
      set(target.getAttribute('data-lang-option'));
    });
  }

  function init() {
    current = detect();
    /* lang се вдига веднага, за да не остане "bg" върху английска страница
       дори за един кадър. */
    document.documentElement.lang = current;
    apply(document);
    bindSwitchers();
  }

  global.GenkiI18n = {
    get lang() { return current; },
    t: t,
    set: set,
    apply: apply,
    SUPPORTED: SUPPORTED.slice(),
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
