/* ==========================================================================
   Genki 2.0 — двуезични низове (BG / EN)

   Номенклатура: <страница>.<секция>.<какво>
     a11y.*    низове само за екранни четци
     nav.*     навигация и хедър
     lang.*    езиков превключвател
     footer.*  футър
     meta.*    title и description по страница
     ph.*      placeholder компонентът
     alt.*     alt текстове на IMAGE слотовете, по ID на слота
     home.*    начална страница

   Copy-то на страниците е ДОСЛОВНО от docs/GENKI-2.0-BRIEF.md, раздел 7
   (BG) и раздел 8 (EN). Нищо не е „подобрено".

   Всеки ключ трябва да има и bg, и en. Липсващ превод се съобщава в
   конзолата при работа на localhost.
   ========================================================================== */

window.genkiTranslations = {

  /* ---------------------------------------------------------------- a11y */
  'a11y.skip': { bg: 'Към основното съдържание', en: 'Skip to main content' },
  'a11y.home': { bg: 'Genki — начална страница', en: 'Genki — home' },

  /* ----------------------------------------------------------------- nav */
  'nav.home':      { bg: 'Начало',              en: 'Home' },
  'nav.companies': { bg: 'За компании',         en: 'For Companies' },
  'nav.how':       { bg: 'Как работи',          en: 'How It Works' },
  'nav.mission':   { bg: 'Мисия и въздействие', en: 'Mission & Impact' },
  'nav.fit':       { bg: 'Genki Fit',           en: 'Genki Fit' },
  'nav.contact':   { bg: 'Контакт',             en: 'Contact' },

  /* Основният CTA. Формулировката е заключена в бриф раздел 4. */
  'nav.fit_cta': { bg: 'Проверете вашия Genki Fit', en: 'Check your Genki Fit' },

  /* Кратък етикет за мобилния хедър, където пълното изречение не се събира.
     Еднакъв на двата езика — това е име на продукт, не превеждан текст. */
  'nav.fit_cta_short': { bg: 'Genki Fit', en: 'Genki Fit' },

  'nav.menu_open':  { bg: 'Отворете менюто',   en: 'Open menu' },
  'nav.menu_close': { bg: 'Затворете менюто',  en: 'Close menu' },
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

  /* ------------------------------------------------------- meta по страница
     Етап 8 прави финалния SEO проход. */
  'meta.home.title': {
    bg: 'Genki — по-добрата храна има място в офиса',
    en: 'Genki — better food belongs at work',
  },
  'meta.home.description': {
    bg: 'Умно и напълно обслужвано решение за по-добра храна в модерния офис. Подбрани български продукти, зареждане и сервиз, за които не мислите.',
    en: 'A smart, fully managed way to bring better food into the modern workplace. Curated Bulgarian products, restocking and service you never think about.',
  },
  'meta.companies.title':       { bg: 'За компании — Genki', en: 'For Companies — Genki' },
  'meta.companies.description': {
    bg: 'Benefit, който става част от ежедневието в офиса. Вие давате benefit-а, Genki поема работата.',
    en: 'A benefit that becomes part of the office day. You give the benefit, Genki does the work.',
  },
  'meta.how.title':       { bg: 'Как работи Genki', en: 'How Genki Works — Genki' },
  'meta.how.description': {
    bg: 'Карта, отворете, вземете, затворете. Лесно за хората. Всичко останало е наша работа.',
    en: 'Card, open, take, close. Easy for your people. Everything else is our job.',
  },
  'meta.mission.title':       { bg: 'Мисия и въздействие — Genki', en: 'Mission & Impact — Genki' },
  'meta.mission.description': {
    bg: 'Genki Product Standard, български производители и 10% от реалната печалба след всички разходи, които се връщат обратно.',
    en: 'The Genki Product Standard, Bulgarian producers, and 10% of real profit after all costs going back.',
  },
  'meta.fit.title':       { bg: 'Genki Fit — какъв Genki би работил при вас', en: 'Genki Fit — the Genki that would work for you' },
  'meta.fit.description': {
    bg: 'Няколко въпроса за екипа и офиса ви, и виждате как би изглеждал Genki при вас.',
    en: 'A few questions about your team and office, and you see what Genki would look like for you.',
  },
  'meta.contact.title':       { bg: 'Контакт — Genki', en: 'Contact — Genki' },
  'meta.contact.description': {
    bg: 'Пишете ни. Отговаряме на въпроси за Genki, партньорства и доставчици.',
    en: 'Write to us. We answer questions about Genki, partnerships and suppliers.',
  },

  /* ==========================================================================
     HOME — copy дословно от бриф раздел 7 (BG) и раздел 8 (EN)
     ========================================================================== */

  /* --- Секция 1: Hero --- */
  'home.hero.label': { bg: 'ЗАПОЗНАЙТЕ СЕ С GENKI', en: 'MEET GENKI' },
  'home.hero.title': {
    bg: 'По-добрата храна има място в офиса.',
    en: 'Better food belongs at work.',
  },
  'home.hero.lead': {
    bg: 'Умно и напълно обслужвано решение за по-добра храна в модерния офис.',
    en: 'A smart, fully managed way to bring better food into the modern workplace.',
  },
  'home.hero.cta': {
    bg: 'Вижте Genki за вашия офис',
    en: 'See Genki for your workplace',
  },

  /* --- Секция 2: Как работи --- */
  'home.how.label': { bg: 'КАК РАБОТИ', en: 'HOW IT WORKS' },
  'home.how.title': {
    bg: 'Отворете. Вземете каквото искате. Затворете. Готово.',
    en: 'Open. Take what you want. Close. Done.',
  },
  'home.how.lead': {
    bg: 'Покупката се отчита автоматично. Genki се грижи за всичко останало.',
    en: 'Your purchase is detected automatically. Genki takes care of everything else.',
  },
  'home.how.s1_title': { bg: 'Отворете', en: 'Open' },
  'home.how.s1_text':  { bg: 'Отключете Genki и разгледайте какво има вътре.', en: 'Unlock Genki and see what’s inside.' },
  'home.how.s2_title': { bg: 'Вземете', en: 'Take' },
  'home.how.s2_text':  { bg: 'Изберете каквото искате.', en: 'Choose whatever you want.' },
  'home.how.s3_title': { bg: 'Затворете', en: 'Close' },
  'home.how.s3_text':  { bg: 'Затворете вратата, когато сте готови.', en: 'Close the door when you’re done.' },
  'home.how.s4_title': { bg: 'Готово', en: 'Done' },
  'home.how.s4_text':  { bg: 'Покупката се отчита автоматично.', en: 'Your purchase is detected automatically.' },
  'home.how.ops': {
    bg: 'Ние зареждаме. Обслужваме. Следим. Подобряваме.',
    en: 'We stock it. Service it. Monitor it. Improve it.',
  },
  'home.how.ops_lead': {
    bg: 'Така вашият екип не трябва да мисли за нищо от това.',
    en: 'So your team doesn’t have to think about any of that.',
  },
  'home.how.cta': {
    bg: 'Вижте подробно как работи Genki',
    en: 'See exactly how Genki works',
  },

  /* --- Секция 3: Genki като benefit --- */
  'home.benefit.label': { bg: 'GENKI КАТО BENEFIT', en: 'GENKI AS A BENEFIT' },
  'home.benefit.title': {
    bg: 'Benefit, който хората усещат всеки ден.',
    en: 'A benefit your people can feel every day.',
  },
  'home.benefit.lead': {
    bg: 'С Genki компанията може да даде повече на екипа си по два различни начина.',
    en: 'With Genki, a company can give its team more in two different ways.',
  },
  'home.benefit.a_name': { bg: 'Genki Benefit', en: 'Genki Benefit' },
  'home.benefit.a_title': {
    bg: 'Направете Genki по-специален за вашия екип.',
    en: 'Make Genki feel more like yours.',
  },
  'home.benefit.a_text': {
    bg: 'Повече около самото изживяване — персонализация, Launch Day, дегустации, product drops, участие на служителите, социален принос и по-лично обслужване.',
    en: 'More around the experience itself — personalization, Launch Day, tastings, product drops, employee participation, social impact and more personal support.',
  },
  'home.benefit.b_name': { bg: 'Product Price Support', en: 'Product Price Support' },
  'home.benefit.b_title': {
    bg: 'Дайте повече стойност при всяка покупка.',
    en: 'Give people more value with every purchase.',
  },
  'home.benefit.b_text': {
    bg: 'Компанията участва в цената на всеки артикул, така че хората получават по-добри цени всеки път, когато използват Genki.',
    en: 'The company contributes toward the price of each product, so employees pay less whenever they use Genki.',
  },
  /* Етикети на визуалното разделяне на цената. Нарочно без числа — конкретен
     процент би прозвучал като стандарт, а бриф раздел 36 го забранява. */
  'home.benefit.split_label':    { bg: 'Цена на продукт', en: 'Product price' },
  'home.benefit.split_employer': { bg: 'Компанията',      en: 'The company' },
  'home.benefit.split_employee': { bg: 'Служителят',      en: 'The employee' },
  'home.benefit.split_note': {
    bg: 'Съотношението се определя от вас.',
    en: 'You decide the split.',
  },
  'home.benefit.combine': {
    bg: 'Използвайте едното или комбинирайте и двете за най-пълното Genki experience.',
    en: 'Use either one, or combine both for the fullest Genki experience.',
  },
  'home.benefit.cta': {
    bg: 'Вижте Genki за компании',
    en: 'Explore Genki for companies',
  },

  /* --- Секция 4: Бюджет --- */
  'home.budget.label': { bg: 'GENKI, КОЙТО ИМА СМИСЪЛ', en: 'GENKI THAT MAKES SENSE' },
  'home.budget.title': { bg: 'Всяко евро трябва да се усеща.', en: 'Every euro should be felt.' },
  'home.budget.lead': {
    bg: 'Benefit според екипа. Price Support според вас.',
    en: 'Benefit sized to your team. Price Support set by you.',
  },

  /* --- Секция 5: Защо Genki --- */
  'home.why.label': { bg: 'ЗАЩО GENKI', en: 'WHY GENKI' },
  'home.why.title': {
    bg: 'Добро за екипа. Добро и отвъд офиса.',
    en: 'Good for your team. Good beyond the office too.',
  },
  'home.why.curated_title': { bg: 'Подбрано, не просто заредено.', en: 'Curated, not just stocked.' },
  'home.why.curated_text': {
    bg: 'Всеки продукт трябва да покрива Genki Product Standard.',
    en: 'Every product has to meet the Genki Product Standard.',
  },
  'home.why.local_title': { bg: 'Българско по избор.', en: 'Bulgarian by choice.' },
  'home.why.local_text': {
    bg: 'Работим с български производители и помагаме на добрите местни продукти да стигат до повече хора.',
    en: 'We work with Bulgarian producers and help great local products reach more people.',
  },
  'home.why.donation_title': { bg: '10% се връщат обратно.', en: '10% goes back.' },
  'home.why.donation_text': {
    bg: 'Всеки месец даряваме 10% от реалната печалба на Genki след всички разходи.',
    en: 'Every month, Genki donates 10% of its real profit after all costs.',
  },
  'home.why.cta': { bg: 'Вижте мисията на Genki', en: 'See Genki’s mission' },

  /* Лентата с логата на производителите чака писмени разрешения (G05/H07). */
  'home.producers.pending': {
    bg: 'Лога на производителите — чакат писмено разрешение',
    en: 'Producer logos — awaiting written permission',
  },

  /* ------------------------------------------------- alt на IMAGE слотовете
     Написани предварително, за да не се добавят на бегом при подмяната на
     placeholder-ите. Alt описва какво се вижда — не повтаря заглавието. */
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
  'alt.M03': {
    bg: 'Български производител и неговите продукти',
    en: 'A Bulgarian producer and their products',
  },
  'alt.F04': {
    bg: 'Конфигурацията на Genki машината, препоръчана за вашия офис',
    en: 'The Genki cooler configuration recommended for your office',
  },

  /* --------------------------------------------- временни низове за скелета
     Съществуват само докато съответният етап напълни страницата. */
  'skeleton.notice': {
    bg: 'Скелет. Съдържанието на тази страница влиза в следващ етап.',
    en: 'Skeleton. This page’s content arrives in a later stage.',
  },
};
