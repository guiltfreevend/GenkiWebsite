/* ==========================================================================
   Genki 2.0 — двуезични низове (BG / EN)

   Номенклатура на ключовете: <страница>.<секция>.<какво>
     nav.*     навигация и хедър
     footer.*  футър
     meta.*    title и description по страница
     ph.*      placeholder компонентът
     alt.*     alt текстове на IMAGE слотовете, по ID на слота
     a11y.*    низове само за екранни четци

   Старите ключове от js/translations.js НЕ се пренасят тук. Този файл
   обслужва само Genki 2.0.

   Всеки ключ трябва да има и bg, и en. Липсващ превод се съобщава в
   конзолата при работа на localhost.
   ========================================================================== */

window.genkiTranslations = {

  /* ---------------------------------------------------------------- a11y */
  'a11y.skip': {
    bg: 'Към основното съдържание',
    en: 'Skip to main content',
  },
  'a11y.home': {
    bg: 'Genki — начална страница',
    en: 'Genki — home',
  },

  /* ----------------------------------------------------------------- nav */
  'nav.home':      { bg: 'Начало',              en: 'Home' },
  'nav.companies': { bg: 'За компании',         en: 'For Companies' },
  'nav.how':       { bg: 'Как работи',          en: 'How It Works' },
  'nav.mission':   { bg: 'Мисия и въздействие', en: 'Mission & Impact' },
  'nav.fit':       { bg: 'Genki Fit',           en: 'Genki Fit' },
  'nav.contact':   { bg: 'Контакт',             en: 'Contact' },

  /* Основният CTA. Точната формулировка е заключена в бриф раздел 4. */
  'nav.fit_cta': {
    bg: 'Проверете вашия Genki Fit',
    en: 'Check your Genki Fit',
  },
  /* Кратък етикет за мобилния хедър, където пълното изречение не се събира.
     Еднакъв на двата езика — това е име на продукт, не превеждан текст. */
  'nav.fit_cta_short': {
    bg: 'Genki Fit',
    en: 'Genki Fit',
  },

  'nav.menu_open':  { bg: 'Отворете менюто',  en: 'Open menu' },
  'nav.menu_close': { bg: 'Затворете менюто', en: 'Close menu' },
  'nav.menu_label': { bg: 'Основна навигация', en: 'Main navigation' },

  /* -------------------------------------------------------------- език */
  'lang.label': { bg: 'Език', en: 'Language' },
  'lang.bg':    { bg: 'BG',   en: 'BG' },
  'lang.en':    { bg: 'EN',   en: 'EN' },
  'lang.to_bg': { bg: 'Превключете на български', en: 'Switch to Bulgarian' },
  'lang.to_en': { bg: 'Превключете на английски', en: 'Switch to English' },

  /* -------------------------------------------------------------- footer */
  'footer.tagline': {
    bg: 'По-добрата храна има място в офиса.',
    en: 'Better food belongs at work.',
  },
  'footer.nav_title':     { bg: 'Сайт',    en: 'Site' },
  'footer.contact_title': { bg: 'Контакт', en: 'Contact' },
  'footer.legal_title':   { bg: 'Правно',  en: 'Legal' },

  'footer.email_label':     { bg: 'Имейл',     en: 'Email' },
  'footer.linkedin_label':  { bg: 'LinkedIn',  en: 'LinkedIn' },
  'footer.instagram_label': { bg: 'Instagram', en: 'Instagram' },
  'footer.linkedin_aria':   { bg: 'Genki в LinkedIn',  en: 'Genki on LinkedIn' },
  'footer.instagram_aria':  { bg: 'Genki в Instagram', en: 'Genki on Instagram' },

  'footer.privacy': { bg: 'Политика за поверителност', en: 'Privacy Policy' },

  /* Правната идентичност е фиксирана (бриф раздел 25) и е еднаква на двата
     езика — фирмата има едно регистрирано наименование. */
  'footer.legal_line': {
    bg: '© 2026 Genki · „Нортик Груп“ ЕООД · ЕИК 206451535',
    en: '© 2026 Genki · „Нортик Груп“ ЕООД · ЕИК 206451535',
  },

  /* --------------------------------------------------- placeholder слот */
  'ph.waiting': {
    bg: 'Визуален слот — чака файл',
    en: 'Visual slot — awaiting file',
  },
  'ph.desktop': { bg: 'Desktop', en: 'Desktop' },
  'ph.mobile':  { bg: 'Mobile',  en: 'Mobile' },

  /* ------------------------------------------------------- meta по страница
     Етап 8 прави финалния SEO проход. Тук стоят честни, човешки заглавия,
     за да не е скелетът без title. */
  'meta.home.title': {
    bg: 'Genki — по-добрата храна има място в офиса',
    en: 'Genki — better food belongs at work',
  },
  'meta.home.description': {
    bg: 'Управлявана услуга за храна и wellness на работното място: подбрани български продукти, умен хладилник и зареждане, за което не мислите.',
    en: 'A managed workplace food and wellness service: curated Bulgarian products, a smart cooler, and restocking you never have to think about.',
  },
  'meta.companies.title': {
    bg: 'За компании — Genki',
    en: 'For Companies — Genki',
  },
  'meta.companies.description': {
    bg: 'Benefit, който става част от ежедневието в офиса. Вие давате benefit-а, Genki поема работата.',
    en: 'A benefit that becomes part of the office day. You give the benefit, Genki does the work.',
  },
  'meta.how.title': {
    bg: 'Как работи Genki',
    en: 'How Genki Works — Genki',
  },
  'meta.how.description': {
    bg: 'Карта, отворете, вземете, затворете. Лесно за хората. Всичко останало е наша работа.',
    en: 'Card, open, take, close. Easy for your people. Everything else is our job.',
  },
  'meta.mission.title': {
    bg: 'Мисия и въздействие — Genki',
    en: 'Mission & Impact — Genki',
  },
  'meta.mission.description': {
    bg: 'Genki Product Standard, български производители и 10% от реалната печалба след всички разходи, които се връщат обратно.',
    en: 'The Genki Product Standard, Bulgarian producers, and 10% of real profit after all costs going back.',
  },
  'meta.fit.title': {
    bg: 'Genki Fit — какъв Genki би работил при вас',
    en: 'Genki Fit — the Genki that would work for you',
  },
  'meta.fit.description': {
    bg: 'Няколко въпроса за екипа и офиса ви, и виждате как би изглеждал Genki при вас.',
    en: 'A few questions about your team and office, and you see what Genki would look like for you.',
  },
  'meta.contact.title': {
    bg: 'Контакт — Genki',
    en: 'Contact — Genki',
  },
  'meta.contact.description': {
    bg: 'Пишете ни. Отговаряме на въпроси за Genki, партньорства и доставчици.',
    en: 'Write to us. We answer questions about Genki, partnerships and suppliers.',
  },

  /* ------------------------------------------------- alt на IMAGE слотовете
     Написани предварително, за да не се добавят на бегом при подмяната на
     placeholder-ите с реални файлове. Alt описва какво се вижда — не
     повтаря заглавието до себе си. */
  'alt.G04': {
    bg: 'Genki машината в офис среда, с логото на Genki',
    en: 'The Genki cooler in an office, with the Genki logo',
  },
  'alt.H01': {
    bg: 'Genki машината в кухненския бокс на офис, заредена с български продукти',
    en: 'The Genki cooler in an office kitchen, stocked with Bulgarian products',
  },
  'alt.H06': {
    bg: 'Български снаксове и напитки, подредени на светла повърхност',
    en: 'Bulgarian snacks and drinks arranged on a light surface',
  },
  'alt.C01': {
    bg: 'Genki машината в офис кухня, докато колега минава покрай нея',
    en: 'The Genki cooler in an office kitchen as a colleague walks past',
  },
  'alt.C02': {
    bg: 'Ръце зареждат рафт на Genki машината с продукти',
    en: 'Hands restocking a shelf of the Genki cooler',
  },
  'alt.C06': {
    bg: 'Офис кухня, в която Genki машината стои до кафемашината и купата с плодове',
    en: 'An office kitchen where the Genki cooler stands beside the coffee machine and the fruit bowl',
  },
  'alt.W01': {
    bg: 'Genki машината, снимана фронтално в офис среда',
    en: 'The Genki cooler photographed head-on in an office',
  },
  'alt.W02': {
    bg: 'Ръка доближава банкова карта до четеца на машината',
    en: 'A hand holding a bank card up to the cooler’s reader',
  },
  'alt.W03': {
    bg: 'Ръка взема продукт от рафта на отворената машина',
    en: 'A hand taking a product from the shelf of the open cooler',
  },
  'alt.W04': {
    bg: 'Ръка затваря вратата на машината, държейки взетия продукт',
    en: 'A hand closing the cooler door while holding the product taken',
  },
  'alt.W06': {
    bg: 'Щайги с продукти, подготвени за зареждане',
    en: 'Crates of products prepared for restocking',
  },
  'alt.M01': {
    bg: 'Обикновен момент в офиса — чаша и продукт на бюро',
    en: 'An ordinary office moment — a cup and a snack on a desk',
  },
  'alt.M02': {
    bg: 'Близък кадър на български продукт от селекцията на Genki',
    en: 'A close-up of a Bulgarian product from the Genki selection',
  },
  'alt.F04': {
    bg: 'Конфигурацията на Genki машината, препоръчана за вашия офис',
    en: 'The Genki cooler configuration recommended for your office',
  },

  /* --------------------------------------------- временни низове за скелета
     Съществуват само докато съответният етап напълни страницата. Махат се
     заедно с влизането на истинското copy от брифа. */
  'skeleton.notice': {
    bg: 'Скелет. Съдържанието на тази страница влиза в следващ етап.',
    en: 'Skeleton. This page’s content arrives in a later stage.',
  },
};
