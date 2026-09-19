/* ==========================================================================
   Genki 2.0 — поведение на скелета
   Съдържа: регистър на визуалните слотове, placeholder компонента,
   мобилното меню, активното състояние в навигацията.

   Зарежда се СЛЕД js/genki-i18n.js — компонентът вика GenkiI18n.apply()
   върху собствения си markup след рендиране.
   ========================================================================== */

(function (global) {
  'use strict';

  /* ======================================================================
     1. Регистър на IMAGE слотовете

     Числата идват дословно от docs/GENKI-2.0-ASSETS.md. Това е единственото
     място в кода, което ги знае — страниците пишат само <genki-slot id="H01">.

     desktop / mobile са СЪОТНОШЕНИЯ (CSS aspect-ratio). px е препоръчаният
     изходен размер, показван върху placeholder-а, за да си личи какъв файл
     се чака.
     ====================================================================== */
  var SLOTS = {
    /* Глобални */
    G04: { d: '1.91/1', m: '1.91/1', dpx: '1200×630',  mpx: '1200×630',  tone: 'brand' },

    /* Начало */
    H01: { d: '16/9',   m: '4/5',    dpx: '2560×1440', mpx: '1080×1350', tone: 'brand' },
    H06: { d: '4/3',    m: '4/5',    dpx: '1600×1200', mpx: '1080×1350', tone: 'cream' },

    /* За компании */
    C01: { d: '16/9',   m: '4/5',    dpx: '2560×1440', mpx: '1080×1350', tone: 'brand' },
    C02: { d: '4/3',    m: '4/5',    dpx: '1600×1200', mpx: '1080×1350', tone: 'brand' },
    C06: { d: '16/9',   m: '4/5',    dpx: '2560×1440', mpx: '1080×1350', tone: 'cream' },

    /* Как работи */
    W01: { d: '16/9',   m: '4/5',    dpx: '2560×1440', mpx: '1080×1350', tone: 'brand' },
    W02: { d: '1/1',    m: '1/1',    dpx: '1200×1200', mpx: '1200×1200', tone: 'brand' },
    W03: { d: '1/1',    m: '1/1',    dpx: '1200×1200', mpx: '1200×1200', tone: 'brand' },
    W04: { d: '1/1',    m: '1/1',    dpx: '1200×1200', mpx: '1200×1200', tone: 'cream' },
    W06: { d: '4/3',    m: '4/5',    dpx: '1600×1200', mpx: '1080×1350', tone: 'brand' },

    /* Мисия */
    M01: { d: '16/9',   m: '4/5',    dpx: '2560×1440', mpx: '1080×1350', tone: 'brand' },
    M02: { d: '4/3',    m: '4/5',    dpx: '1600×1200', mpx: '1080×1350', tone: 'cream' },
    M03: { d: '4/3',    m: '4/5',    dpx: '1600×1200', mpx: '1080×1350', tone: 'cream' },

    /* Genki Fit */
    F04: { d: '3/2',    m: '3/2',    dpx: '1200×800',  mpx: '1200×800',  tone: 'cream' },
  };

  /* ======================================================================
     2. <genki-slot id="H01">

     Рендира контейнер с точното съотношение за desktop и за mobile, плътен
     фон и видимо ID. Alt текстът се взима от ключ alt.<ID> и стои в
     figcaption само за екранни четци — така още сега се вижда, че е написан
     и на двата езика.

     Смяната с реален файл е подмяна на този елемент с <picture>, без пипане
     на секцията наоколо — размерите вече са същите.
     ====================================================================== */
  function renderSlot(el) {
    var id = (el.getAttribute('slot-id') || '').toUpperCase();
    var spec = SLOTS[id];

    if (!spec) {
      el.innerHTML = '<div class="slot slot--unknown">Непознат слот: ' + id + '</div>';
      return;
    }

    el.style.setProperty('--slot-d', spec.d);
    el.style.setProperty('--slot-m', spec.m);
    el.classList.add('slot', 'slot--' + spec.tone);

    /* Съотношението, което реално е в сила, се изписва на самия placeholder,
       за да се чете при преоразмеряване на прозореца, а не на око. */
    el.innerHTML =
      '<div class="slot__frame">' +
        '<span class="slot__id">' + id + '</span>' +
        '<span class="slot__meta">' +
          '<span class="slot__meta-d">' + spec.d.replace('/', ':') + ' · ' + spec.dpx + '</span>' +
          '<span class="slot__meta-m">' + spec.m.replace('/', ':') + ' · ' + spec.mpx + '</span>' +
        '</span>' +
        '<span class="slot__note" data-i18n="ph.waiting"></span>' +
      '</div>' +
      '<span class="sr-only" data-i18n="alt.' + id + '"></span>';

    if (global.GenkiI18n) global.GenkiI18n.apply(el);
  }

  if ('customElements' in global) {
    global.customElements.define('genki-slot', class extends HTMLElement {
      connectedCallback() { renderSlot(this); }
    });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      var nodes = document.querySelectorAll('genki-slot');
      for (var i = 0; i < nodes.length; i++) renderSlot(nodes[i]);
    });
  }

  /* ======================================================================
     3. Мобилно меню

     Изисквания от плана: достъпно от палец, затваря се при избор, езиковият
     превключвател остава вътре, таргетите са минимум 44 px, клавиатурата
     минава през целия хедър с видим focus.
     ====================================================================== */
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.getElementById('genki-mobile-menu');
    if (!toggle || !panel) return;

    var open = false;
    var lastFocused = null;

    function focusables() {
      return panel.querySelectorAll('a[href], button:not([disabled])');
    }

    function setOpen(next) {
      if (next === open) return;
      open = next;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('data-i18n-aria-label', open ? 'nav.menu_close' : 'nav.menu_open');
      panel.hidden = !open;
      document.documentElement.classList.toggle('menu-open', open);

      if (global.GenkiI18n) global.GenkiI18n.apply(toggle);

      if (open) {
        lastFocused = document.activeElement;
        var f = focusables();
        if (f.length) f[0].focus();
      } else if (lastFocused) {
        lastFocused.focus();
      }
    }

    toggle.addEventListener('click', function () { setOpen(!open); });

    /* Избор на линк затваря менюто. Езиковите бутони НЕ го затварят —
       човекът може да иска да превключи и после да избере страница. */
    panel.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (link) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!open) return;

      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (e.key !== 'Tab') return;

      /* Задържане на фокуса вътре в менюто, докато е отворено. */
      var f = focusables();
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    /* Ако прозорецът се разшири до desktop, менюто няма смисъл да остава
       отворено — иначе остава невидим focus trap. */
    var desktop = global.matchMedia('(min-width: 1024px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ======================================================================
     4. Активна страница в навигацията

     Сравнява се само името на файла, за да работи еднакво при /companies,
     /companies.html и при локалния http.server.
     ====================================================================== */
  function initActiveNav() {
    var path = global.location.pathname.replace(/\/+$/, '');
    var file = path.split('/').pop() || 'index.html';
    if (file.indexOf('.') === -1) file = file + '.html';

    var links = document.querySelectorAll('[data-nav-link]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      var target = href.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
      if (target === file) {
        links[i].classList.add('is-active');
        links[i].setAttribute('aria-current', 'page');
      }
    }
  }

  /* ======================================================================
     5. Сянка на хедъра при скрол
     Throttle през requestAnimationFrame — без слушател, който смята на
     всеки пиксел.
     ====================================================================== */
  function initHeaderScroll() {
    var header = document.querySelector('[data-site-header]');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', global.scrollY > 8);
      ticking = false;
    }
    global.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      global.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function init() {
    initMenu();
    initActiveNav();
    initHeaderScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.GenkiSlots = SLOTS;
})(window);
