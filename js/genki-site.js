/* ==========================================================================
   Genki 2.0 — поведение на обвивката

   Съдържа: регистър на визуалните слотове, <genki-slot> компонента,
   примитива за поява при скрол, мобилното меню, активната навигация.

   Зарежда се СЛЕД js/genki-i18n.js — слотът вика GenkiI18n.apply() върху
   собствения си markup след рендиране.
   ========================================================================== */

(function (global) {
  'use strict';

  /* ======================================================================
     1. РЕГИСТЪР НА ВИЗУАЛНИТЕ СЛОТОВЕ

     Единственото място в кода, което знае размерите. Страниците пишат само
     <genki-slot slot-id="H01">.

     ТРИ РАЗЛИЧНИ НЕЩА, които не бива да се бъркат:

     d / m        КОМПОЗИЦИЯ — CSS aspect-ratio на слота в лайаута.
     file / mfile ФАЙЛ ЗА ПРОИЗВОДСТВО — размерът, който се доставя.
                  Идва от docs/GENKI-2.0-VISUAL-ASSET-PRODUCTION-PLAN.md.
     css / mcss   НА ЕКРАН — колко CSS пиксела заема слотът @1440 и @390.

     Всяка двойка file/mfile е сверена със съответното съотношение. Ако
     някога се разминат, планът печели — той е каноничен.
     role     каква работа върши кадърът; изписва се върху placeholder-а,
              за да казва сам какво изображение трябва да влезе тук
     tone     цвят на placeholder-а
     shape    'media' = едър радиус, 'flush' = без радиус

     ID-тата са по КАНОНИЧНАТА VISUAL ASSET MAP от
     „GENKI 2.0 — WEBSITE COPY & HANDOFF" (решение 2026-09-19).

     В регистъра влизат САМО реални производствени активи. UI компоненти,
     типографски блокове и CSS визуални системи НЕ консумират asset ID —
     тези ID-та отиват във файлови имена, заявки към доставчици, shot
     листи и папки, затова един ID не бива да значи две различни неща.

     Съотношенията идват от docs/GENKI-2.0-ASSETS.md. Където
     DESIGN-DIRECTION налага друга композиция, стойността се подава на
     самия елемент (ratio / mobile-ratio) и надделява над регистъра.
     ====================================================================== */
  var SLOTS = {
    /* ==================================================================
       V1 Е HERO-ONLY (решение 2026-09-24)

       Целият сайт ползва ШЕСТ кадъра — по един на страница, всеки в две
       версии (desktop + mobile). Това са 12 файла общо и нищо повече.
       Всички снимки по-надолу в страниците са ОТЛОЖЕНИ за след V1.

       Всички шест hero кадъра трябва да показват ЕДИН И СЪЩ брандиран
       Genki хладилник. Каноничната референция се прави първа; останалите
       кадри се правят от нея. В кода нищо не се брандира.

       Размерите идват от пълния екран, не от съотношение в лайаута:
       desktop 16:9 · mobile 9:16, а `object-fit: cover` поема остатъка.
       ================================================================== */

    /* --- Глобални --------------------------------------------------- */
    G05: { d: '1.91/1', m: '1.91/1', file: '1200×630',  mfile: '1200×630',
           tone: 'brand', role: 'OG изображение за споделяне' },

    /* --- АКТИВНИ V1 HERO КАДРИ --------------------------------------- */
    H01: { d: '16/9', m: '9/16', file: '2560×1440', mfile: '1080×1920',
           tone: 'brand', role: 'Начало · Genki в офис кухня, заредена' },
    C01: { d: '16/9', m: '9/16', file: '2560×1440', mfile: '1080×1920',
           tone: 'brand', role: 'За компании · Genki в ежедневието на офиса' },
    W01: { d: '16/9', m: '9/16', file: '2560×1440', mfile: '1080×1920',
           tone: 'brand', role: 'Как работи · Genki фронтално, продуктов портрет' },
    M01: { d: '16/9', m: '9/16', file: '2560×1440', mfile: '1080×1920',
           tone: 'brand', role: 'Мисия · обикновен момент около Genki' },
    F01: { d: '16/9', m: '9/16', file: '2560×1440', mfile: '1080×1920',
           tone: 'brand', role: 'Genki Fit · Genki в реален офис, спокоен кадър' },
    K01: { d: '16/9', m: '9/16', file: '2560×1440', mfile: '1080×1920',
           tone: 'brand', role: 'Контакт · Genki отблизо, топъл детайл' },

    /* --- ОТЛОЖЕНИ ЗА СЛЕД V1 -----------------------------------------
       ID-тата остават запазени и НЕ се преназначават (CLAUDE.md). Тези
       слотове вече не се ползват в нито една страница; спецификацията им
       живее в docs/GENKI-2.0-VISUAL-ASSET-PRODUCTION-PLAN.md.

       H05 · C02 · C05 · W02 · W03 · W04 · W05 · M02 · M03 · M05 · F08
       ---------------------------------------------------------------- */
  };

  /* ======================================================================
     2. <genki-slot>

     Атрибути:
       slot-id       ID от регистъра (задължителен)
       ratio         desktop съотношение — надделява над регистъра
       mobile-ratio  mobile съотношение — надделява над регистъра
       role          описание — надделява над регистъра
       src           desktop изображение
       src-mobile    mobile изображение (ако липсва, ползва се src)
       focal         object-position, напр. "70% 40%"
       tone          'brand' | 'cream'
       shape         'media' | 'flush'
       priority      'high' зарежда веднага (само за hero над сгъвката)

     Без src рендира placeholder с точното съотношение, ID-то и ролята.
     Със src рендира <picture> с отделен кадър за mobile и за desktop.
     Подмяната е добавяне на два атрибута, не преработка на секцията.
     ====================================================================== */
  function renderSlot(el) {
    var id = (el.getAttribute('slot-id') || '').toUpperCase();
    var spec = SLOTS[id];

    if (!spec) {
      el.innerHTML = '<div class="slot slot--unknown">Непознат слот: ' +
                     (id || '(празно)') + '</div>';
      return;
    }

    var ratioAttrD = el.getAttribute('ratio');
    var ratioAttrM = el.getAttribute('mobile-ratio');
    var ratioD = ratioAttrD || spec.d;
    var ratioM = ratioAttrM || spec.m;

    /* Размерите важат за съотношението от регистъра. Ако композицията в
       страницата подаде ДРУГО съотношение, не се измисля нов размер —
       казва се, че идва от композицията. Съвпадащ override е наред. */
    var pxD = (ratioAttrD && ratioAttrD !== spec.d) ? 'по композиция' : slotSize(spec.file, spec.css);
    var pxM = (ratioAttrM && ratioAttrM !== spec.m) ? 'по композиция' : slotSize(spec.mfile, spec.mcss);
    var role = el.getAttribute('role') || spec.role || '';
    var tone = el.getAttribute('tone') || spec.tone || 'brand';
    var shape = el.getAttribute('shape') || spec.shape || '';
    var focal = el.getAttribute('focal');
    var src = el.getAttribute('src');
    var srcMobile = el.getAttribute('src-mobile') || src;

    el.style.setProperty('--slot-d', ratioD);
    el.style.setProperty('--slot-m', ratioM);
    if (focal) el.style.setProperty('--slot-focal', focal);

    el.classList.add('slot', 'slot--' + tone);
    if (shape) el.classList.add('slot--' + shape);

    /* Ролята на елемента е презентационна — ARIA ролята му е ненужна и
       атрибутът role служи само като вход към компонента. Махаме го, за да
       не се чете като ARIA. */
    el.removeAttribute('role');

    if (src) {
      var eager = el.getAttribute('priority') === 'high';
      el.innerHTML =
        '<picture>' +
          '<source media="(min-width: 768px)" srcset="' + esc(src) + '">' +
          '<img src="' + esc(srcMobile) + '" alt="" ' +
               'loading="' + (eager ? 'eager' : 'lazy') + '" ' +
               'decoding="async" ' +
               (eager ? 'fetchpriority="high" ' : '') +
               'data-i18n-alt="alt.' + id + '">' +
        '</picture>';
    } else {
      el.innerHTML =
        '<div class="slot__frame">' +
          '<span class="slot__id">' + id + '</span>' +
          (role ? '<span class="slot__role">' + esc(role) + '</span>' : '') +
          '<span class="slot__meta">' +
            '<span class="slot__meta-d">' + fmt(ratioD) + ' · ' + pxD + '</span>' +
            '<span class="slot__meta-m">' + fmt(ratioM) + ' · ' + pxM + '</span>' +
          '</span>' +
          '<span class="slot__note" data-i18n="ph.waiting"></span>' +
        '</div>' +
        '<span class="sr-only" data-i18n="alt.' + id + '"></span>';
    }

    if (global.GenkiI18n) global.GenkiI18n.apply(el);
  }

  function fmt(ratio) { return String(ratio).replace('/', ':'); }

  /* „файл 2400×3000 · екран 643×804" — двата размера са различни неща и
     затова се изписват с етикети, а не един до друг. */
  function slotSize(file, css) {
    if (!file) return '—';
    return css ? 'файл ' + file + ' · екран ' + css : 'файл ' + file;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
     3. ПОЯВА ПРИ СКРОЛ

     Съдържанието е видимо по подразбиране. Скриптът поема едва когато е
     сигурно, че може да го покаже обратно — затова класът js-reveal се
     слага на <html> чак тук. Без JS, без IntersectionObserver или при
     "намалено движение" нищо не се крие.

     Всеки елемент се появява веднъж и се отписва от наблюдателя.
     Групите получават стъпка през --reveal-index; самата стъпка е токен.
     ====================================================================== */
  function initReveal() {
    var reduced = global.matchMedia &&
                  global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in global)) return;

    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    document.documentElement.classList.add('js-reveal');

    /* Индекс вътре в групата -> стъпаловидно закъснение */
    var groups = document.querySelectorAll('.reveal-group');
    for (var g = 0; g < groups.length; g++) {
      var kids = groups[g].querySelectorAll('.reveal');
      for (var k = 0; k < kids.length; k++) {
        kids[k].style.setProperty('--reveal-index', k);
      }
    }

    var revealedAny = false;

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add('is-revealed');
        io.unobserve(entries[i].target);
        revealedAny = true;
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });

    for (var t = 0; t < targets.length; t++) io.observe(targets[t]);

    /* Предпазител. Ако нещо се обърка в наблюдателя, съдържанието остава
       невидимо завинаги — това е най-лошото, което може да се случи на
       сайт с текст. Затова: ако след 2,5 s нищо не се е появило, ВЪПРЕКИ
       че има блок в екрана, скриването отпада изцяло.

       Проверката "има блок в екрана" пази ефекта на страници, чиито
       .reveal елементи са само под сгъвката — там нулата е нормална. */
    global.setTimeout(function () {
      if (revealedAny) return;

      var vh = global.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < targets.length; i++) {
        var r = targets[i].getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          document.documentElement.classList.remove('js-reveal');
          return;
        }
      }
    }, 2500);
  }

  /* ======================================================================
     4. МОБИЛНО МЕНЮ
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
      if (e.target.closest('a[href]')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!open) return;

      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;

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

    /* При разширяване до desktop менюто няма смисъл да остава отворено —
       иначе остава невидим focus trap. */
    var desktop = global.matchMedia('(min-width: 1024px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ======================================================================
     5. АКТИВНА СТРАНИЦА В НАВИГАЦИЯТА
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
     6. СЯНКА НА ХЕДЪРА ПРИ СКРОЛ
     Throttle през requestAnimationFrame.
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
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.GenkiSlots = SLOTS;
})(window);
