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

   Copy-то на страниците е ДОСЛОВНО от каноничните източници. Нищо не е
   „подобрено", нищо не е превеждано на ръка.

   Каноничен източник за текста на сайта:
   „GENKI 2.0 — WEBSITE COPY & HANDOFF" (LOCKED 16.09.2026).
   Брифът остава източник за продукта, структурата и границите на
   твърденията.

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

  /* ==========================================================================
     ЗА КОМПАНИИ

     BG и EN са ДОСЛОВНО от „GENKI 2.0 — WEBSITE COPY & HANDOFF"
     (LOCKED — IMPLEMENTATION READY, 16.09.2026) — каноничният източник за
     copy-то на сайта. Английският вече е минал native-language cleanup и
     НЕ се „подобрява" допълнително.
     ========================================================================== */

  /* --- Hero --- */
  'companies.hero.label': { bg: 'GENKI ЗА КОМПАНИИ', en: 'GENKI FOR COMPANIES' },
  'companies.hero.title': {
    bg: 'Benefit, който става част от ежедневието в офиса.',
    en: 'A benefit that becomes part of everyday life at work.',
  },
  'companies.hero.lead': {
    bg: 'По-добра храна в офиса, повече стойност за екипа и без да създаваме още една ежедневна задача за компанията.',
    en: 'Better food at work, more value for your team — without creating another day-to-day task for the company.',
  },

  /* --- Genki се грижи за останалото --- */
  'companies.ops.label': { bg: 'GENKI СЕ ГРИЖИ ЗА ОСТАНАЛОТО', en: 'GENKI TAKES CARE OF THE REST' },
  'companies.ops.title': {
    bg: 'Вие давате benefit-а. Ние поемаме работата.',
    en: 'You give the benefit. We handle the work.',
  },
  'companies.ops.lead': {
    bg: 'Ние поставяме Genki, зареждаме го, обслужваме го и следим какво хората реално избират, за да го подобряваме с времето.',
    en: 'We install Genki, keep it stocked, take care of the service and follow what people actually choose, so we can keep making it better over time.',
  },
  'companies.ops.promise': {
    bg: 'От поставянето нататък — Genki е наша грижа.',
    en: 'From installation onwards, Genki is on us.',
  },
  'companies.ops.cta': { bg: 'Вижте как работи Genki', en: 'See how Genki works' },

  /* --- Два начина да дадете повече --- */
  'companies.ways.label': { bg: 'ДВА НАЧИНА ДА ДАДЕТЕ ПОВЕЧЕ', en: 'TWO WAYS TO GIVE MORE' },
  'companies.ways.title': {
    bg: 'Направете Genki benefit, който хората наистина усещат.',
    en: 'Make Genki a benefit your people genuinely feel.',
  },
  'companies.ways.benefit_name': { bg: 'Genki Benefit', en: 'Genki Benefit' },
  'companies.ways.benefit_title': {
    bg: 'Направете Genki по-специален за вашия екип.',
    en: 'Make Genki more special for your team.',
  },
  'companies.ways.benefit_lead': {
    bg: 'Повече изживяване, участие и стойност около самия Genki.',
    en: 'More experience, participation and value around Genki itself.',
  },
  'companies.ways.g1_title': { bg: 'Вашият Genki', en: 'Your Genki' },
  'companies.ways.g1_text': {
    bg: 'Персонализация, предложения за продукти, гласуване и обратна връзка от служителите.',
    en: 'Personalization, product suggestions, voting and employee feedback.',
  },
  'companies.ways.g2_title': { bg: 'Ново и интересно', en: 'Something new' },
  'companies.ways.g2_text': {
    bg: 'Launch Event, дегустации, сезонни продуктови премиери, ранен достъп и Genki exclusives.',
    en: 'Launch events, tastings, seasonal drops, early access and Genki exclusives.',
  },
  'companies.ways.g3_title': { bg: 'Каузи заедно', en: 'Choose causes together' },
  'companies.ways.g3_text': {
    bg: 'Избор на каузи, ясен отчет за даренията и възможност за участие в годишна доброволческа инициатива.',
    en: 'Cause selection, clear donation reporting and the opportunity to join one annual volunteering initiative.',
  },
  'companies.ways.g4_title': { bg: 'По-лично обслужване', en: 'More personal support' },
  'companies.ways.g4_text': {
    bg: 'Личен Genki контакт, по-гъвкави условия и ранен достъп до нови Genki функции.',
    en: 'A dedicated Genki contact, more flexible terms and early access to new Genki features.',
  },
  'companies.ways.ps_name': { bg: 'Product Price Support', en: 'Product Price Support' },
  'companies.ways.ps_title': {
    bg: 'Дайте повече стойност при всяка покупка.',
    en: 'Give people more value with every purchase.',
  },
  'companies.ways.ps_text': {
    bg: 'Компанията участва в цената на всеки артикул, така че хората получават по-добри цени всеки път, когато използват Genki.',
    en: 'The company contributes toward the price of each product, so employees pay less whenever they use Genki.',
  },
  'companies.ways.combine': {
    bg: 'Използвайте едното или комбинирайте и двете за най-пълното Genki experience.',
    en: 'Use either one, or combine both for the fullest Genki experience.',
  },

  /* --- Бюджет --- */
  'companies.budget.label': { bg: 'GENKI, КОЙТО ИМА СМИСЪЛ', en: 'GENKI THAT MAKES SENSE' },
  'companies.budget.title': { bg: 'Всяко евро трябва да се усеща.', en: 'Every euro should be felt.' },
  'companies.budget.lead': {
    bg: 'Настройваме Genki така, че бюджетът ви да се усеща от хората — всеки ден.',
    en: 'We configure Genki so your budget creates value your people can actually feel — every day.',
  },
  'companies.budget.split': {
    bg: 'Benefit според екипа. Price Support според вас.',
    en: 'Benefit sized to your team. Price Support set by you.',
  },
  /* Квалификаторът „за избрани локации" НЕ се маха — без него това става
     обещание към всички. */
  'companies.budget.zero': {
    bg: 'За избрани локации Genki може да работи и с <strong>€0 месечна такса за работодателя.</strong>',
    en: 'For selected locations, Genki can also work with a <strong>€0 monthly employer fee.</strong>',
  },

  /* --- Лесно е да добавите Genki --- */
  'companies.easy.label': { bg: 'ЛЕСНО Е ДА ДОБАВИТЕ GENKI', en: 'EASY TO ADD' },
  'companies.easy.title': {
    bg: 'Не е нужно да променяте всичко.',
    en: 'You don’t need to change everything.',
  },
  'companies.easy.p1': {
    bg: 'Genki е създаден да бъде по-пълното решение за офиса — храна, по-добро ежедневие, социален принос и грижа за екипа на едно място.',
    en: 'Genki is designed to be a more complete workplace solution — food, a better everyday experience, social contribution and care for your team in one place.',
  },
  'companies.easy.p2': {
    bg: 'Ако вече имате catering, столова, vending, плодове или друг benefit, не е нужно да ги махате.',
    en: 'If you already have catering, a canteen, vending, fruit or another benefit, you don’t need to remove it.',
  },
  'companies.easy.p3': {
    bg: 'Genki може спокойно да работи редом с тях и да добави още стойност за екипа ви.',
    en: 'Genki can work alongside what you already have and add more value for your team.',
  },

  /* --- Pilot. Нарочно визуално подчинен: не е основният път за покупка. --- */
  'companies.pilot.title': {
    bg: 'А ако искате първо да го докажете?',
    en: 'Want to prove it first?',
  },
  'companies.pilot.text': {
    bg: 'За подходящи компании можем да започнем с <strong>90-дневен Pilot</strong> — реален Genki, в реалния ви офис.',
    en: 'For the right companies, we can start with a <strong>90-day Pilot</strong> — real Genki, in your real workplace.',
  },

  /* --- Финален CTA --- */
  'companies.final.label': { bg: 'GENKI ЗА ВАШИЯ ОФИС', en: 'GENKI FOR YOUR WORKPLACE' },
  'companies.final.title': {
    bg: 'Как би изглеждал Genki при вас?',
    en: 'What would Genki look like at your company?',
  },
  'companies.final.lead': {
    bg: 'Няколко въпроса за екипа и офиса ви са достатъчни, за да видим какъв Genki има смисъл за вашата компания.',
    en: 'A few details about your team and workplace are enough for us to see what kind of Genki makes sense for your company.',
  },

  /* ==========================================================================
     КАК РАБОТИ GENKI

     BG и EN са ДОСЛОВНО от „GENKI 2.0 — WEBSITE COPY & HANDOFF"
     (LOCKED 16.09.2026). Нищо не е превеждано на ръка.

     Редът IMPLEMENTATION CHECK от документа е ВЪТРЕШНА бележка и НЕ се
     публикува — стои само като коментар в разметката.
     ========================================================================== */

  /* --- Hero --- */
  'how.hero.label': { bg: 'КАК РАБОТИ GENKI', en: 'HOW GENKI WORKS' },
  'how.hero.title': {
    bg: 'Лесно за хората. Всичко останало е наша работа.',
    en: 'Easy for your people. The rest is on us.',
  },
  'how.hero.lead': {
    bg: 'Отваряте. Вземате каквото искате. Затваряте. Genki се грижи за останалото.',
    en: 'Open. Take what you want. Close. Genki takes care of the rest.',
  },
  'how.hero.cta': {
    bg: 'Вижте го стъпка по стъпка',
    en: 'See it step by step',
  },

  /* --- Покупката --- */
  'how.flow.label': { bg: 'ТОЛКОВА Е ЛЕСНО', en: 'IT’S THAT SIMPLE' },
  'how.flow.title': {
    bg: 'Карта. Отворете. Вземете. Затворете. Готово.',
    en: 'Card. Open. Take. Close. Done.',
  },
  'how.flow.s1_title': { bg: 'Карта', en: 'Card' },
  'how.flow.s1_text': {
    bg: 'Доближавате или поставяте дебитната/кредитната си карта. Genki прави временна предварителна авторизация и отключва.',
    en: 'Tap or insert your debit or credit card. Genki places a temporary pre-authorization and unlocks.',
  },
  'how.flow.s2_title': { bg: 'Вземете', en: 'Take' },
  'how.flow.s2_text': {
    bg: 'Избирате каквото искате — един продукт или няколко.',
    en: 'Choose whatever you want — one product or several.',
  },
  'how.flow.s3_title': { bg: 'Затворете', en: 'Close' },
  'how.flow.s3_text': {
    bg: 'Затваряте вратата и продължавате с деня си.',
    en: 'Close the door and carry on with your day.',
  },
  'how.flow.s4_title': { bg: 'Готово', en: 'Done' },
  'how.flow.s4_text': {
    bg: 'Genki отчита какво сте взели и таксува реалната стойност на покупката.',
    en: 'Genki detects what you took and charges the actual value of your purchase.',
  },
  /* PUBLISH GATE: този текст трябва да съвпада 1:1 с реалното поведение на
     платежния доставчик, преди страницата да се публикува. */
  'how.flow.preauth': {
    bg: 'Предварителната авторизация е временна. След покупката се начислява само стойността на взетите продукти, а останалата блокирана сума се освобождава. Времето за освобождаване може да зависи от вашата банка.',
    en: 'The pre-authorization is temporary. After the purchase, you are charged only for the products you took and the remaining held amount is released. The release time may depend on your bank.',
  },

  /* --- Без излишни стъпки --- */
  'how.noscan.label': { bg: 'БЕЗ ИЗЛИШНИ СТЪПКИ', en: 'NO EXTRA STEPS' },
  'how.noscan.title': {
    bg: 'Няма какво да сканирате на излизане.',
    en: 'Nothing to scan on the way out.',
  },
  'how.noscan.lead': {
    bg: 'Genki следи какво се взима от рафтовете и автоматично свързва покупката с плащането.',
    en: 'Genki tracks what is taken from the shelves and automatically connects the purchase to the payment.',
  },
  'how.noscan.multi': {
    bg: 'Вземате няколко неща наведнъж? Няма проблем.',
    en: 'Taking several things at once? No problem.',
  },
  'how.noscan.close': {
    bg: 'Просто затваряте вратата.',
    en: 'Just close the door.',
  },

  /* --- Зад кулисите --- */
  'how.behind.label': { bg: 'ЗАД КУЛИСИТЕ', en: 'BEHIND THE SCENES' },
  'how.behind.title': {
    bg: 'Докато хората просто си взимат нещо, ние се грижим Genki да работи.',
    en: 'While people simply grab what they want, we keep Genki running.',
  },
  'how.behind.lead': {
    bg: 'Следим наличностите, зареждаме, обслужваме машината и гледаме кои продукти се харесват и кои не.',
    en: 'We monitor stock, restock, service the machine and learn which products people like and which they don’t.',
  },
  'how.behind.none': {
    bg: 'Няма заявки за зареждане. Няма следене на наличности. Няма още една задача за компанията.',
    en: 'No restocking requests. No stock tracking. No extra task for your company.',
  },

  /* --- Price Support --- */
  'how.ps.label': { bg: 'И PRICE SUPPORT Е ЛЕСЕН', en: 'PRICE SUPPORT IS SIMPLE TOO' },
  'how.ps.title': {
    bg: 'Компанията дава повече. Без повече администрация.',
    en: 'The company gives more. Without adding more admin.',
  },
  'how.ps.lead': {
    bg: 'Ако използвате Product Price Support, по-добрата цена се прилага директно в Genki.',
    en: 'If you use Product Price Support, the better employee price is applied directly in Genki.',
  },
  'how.ps.employee': {
    bg: 'Служителят вижда цената, плаща своята част и това е.',
    en: 'The employee sees the price, pays their share and that’s it.',
  },
  'how.ps.none': {
    bg: 'Без възстановяване на разходи. Без касови бележки. Без допълнителна работа за HR.',
    en: 'No reimbursements. No receipts. No extra work for HR.',
  },

  /* --- Genki се учи --- */
  'how.learn.label': { bg: 'GENKI СЕ УЧИ ОТ ВАШИЯ ОФИС', en: 'GENKI LEARNS YOUR WORKPLACE' },
  'how.learn.title': {
    bg: 'С времето Genki става все по-ваш.',
    en: 'Over time, Genki becomes more and more yours.',
  },
  'how.learn.lead': {
    bg: 'Следим какво хората реално избират и използваме това, за да подобряваме продуктовия микс.',
    en: 'We follow what people actually choose and use that to improve the product mix.',
  },
  'how.learn.mix': {
    bg: 'Повече от това, което се харесва. По-малко от това, което не се търси. И място за нещо ново.',
    en: 'More of what people love. Less of what they don’t. And room for something new.',
  },
  'how.learn.adapt': {
    bg: 'Вашият Genki не остава същият. Той се наглася към хората, които го използват.',
    en: 'Your Genki doesn’t stay the same. It adapts to the people who use it.',
  },

  /* ==========================================================================
     МИСИЯ И ВЪЗДЕЙСТВИЕ

     BG и EN са ДОСЛОВНО от „GENKI 2.0 — WEBSITE COPY & HANDOFF"
     (LOCKED 16.09.2026).

     Формулировката на дарението е юридически точна и НЕ се съкращава
     никъде: „10% от реалната си печалба след всички разходи".
     ========================================================================== */

  /* --- Hero --- */
  'mission.hero.label': { bg: 'МИСИЯ И ВЪЗДЕЙСТВИЕ', en: 'MISSION & IMPACT' },
  'mission.hero.title': {
    bg: 'Доброто не трябва да е нещо извън ежедневието.',
    en: 'Doing good should be part of everyday life.',
  },
  'mission.hero.lead': {
    bg: 'Genki е създаден така, че всеки ден да прави малко повече — за хората в офиса, за българските производители и за каузи, които имат значение.',
    en: 'Genki is built to do a little more every day — for the people at work, for Bulgarian producers and for causes that matter.',
  },

  /* --- Genki Product Standard --- */
  'mission.standard.label': { bg: 'GENKI PRODUCT STANDARD', en: 'GENKI PRODUCT STANDARD' },
  'mission.standard.title': {
    bg: 'Не слагаме нещо вътре само защото се продава.',
    en: 'Something doesn’t belong in Genki just because it sells.',
  },
  'mission.standard.lead': {
    bg: 'Всеки продукт трябва да заслужи мястото си в Genki — със състав, качество и формат, които имат смисъл за ежедневието в офиса.',
    en: 'Every product has to earn its place in Genki — through ingredients, quality and a format that makes sense for everyday life at work.',
  },
  'mission.standard.close': {
    bg: 'Затова в Genki няма случайни продукти.',
    en: 'That’s why nothing in Genki is there by accident.',
  },

  /* --- Българско по избор --- */
  'mission.local.label': { bg: 'БЪЛГАРСКО ПО ИЗБОР', en: 'BULGARIAN BY CHOICE' },
  'mission.local.title': {
    bg: 'Добрите местни продукти заслужават повече място.',
    en: 'Great local products deserve more room to grow.',
  },
  'mission.local.lead': {
    bg: 'Затова работим с български производители и искаме Genki да бъде още един начин техните продукти да стигат до повече хора.',
    en: 'That’s why we work with Bulgarian producers and want Genki to become another way for their products to reach more people.',
  },
  'mission.local.close': {
    bg: 'Когато Genki расте, искаме те да растат с нас.',
    en: 'As Genki grows, we want them to grow with us.',
  },

  /* --- 10% --- */
  'mission.ten.label': { bg: '10% СЕ ВРЪЩАТ ОБРАТНО', en: '10% GOES BACK' },
  'mission.ten.title': {
    bg: 'Не обещание някой ден. Част от начина, по който работим.',
    en: 'Not a promise for someday. Part of how we work.',
  },
  /* Пълната формулировка. Не се съкращава и не се преформулира. */
  'mission.ten.lead': {
    bg: 'Всеки месец Genki дарява 10% от реалната си печалба след всички разходи.',
    en: 'Every month, Genki donates 10% of its real profit after all costs.',
  },
  'mission.ten.close': {
    bg: 'И когато една компания работи с Genki, част от стойността, която създаваме заедно, продължава и извън офиса.',
    en: 'And when a company works with Genki, part of the value we create together continues beyond the workplace.',
  },

  /* --- Заедно зад каузите --- */
  'mission.causes.label': { bg: 'ЗАЕДНО ЗАД КАУЗИТЕ', en: 'BE PART OF THE GOOD' },
  'mission.causes.title': {
    bg: 'Не просто даряваме. Даваме възможност и на екипа да участва.',
    en: 'We don’t just donate. We give your team a way to take part.',
  },
  'mission.causes.lead': {
    bg: 'С Genki Benefit хората могат да участват в избора на каузи, да виждат какво сме постигнали заедно и да се включат в годишна доброволческа инициатива.',
    en: 'With Genki Benefit, your people can help choose causes, see what we’ve achieved together and join one annual volunteering initiative.',
  },
  'mission.causes.close': {
    bg: 'Защото е по-смислено, когато не просто гледате отстрани, а участвате.',
    en: 'Because it means more when you’re part of it.',
  },
  'mission.causes.cta': {
    bg: 'Вижте Genki за компании',
    en: 'Explore Genki for companies',
  },

  /* --- Защо Genki --- */
  'mission.why.label': { bg: 'ЗАЩО GENKI', en: 'WHY GENKI' },
  'mission.why.title': { bg: 'Името казва доста.', en: 'The name says a lot.' },
  'mission.why.lead': {
    bg: 'Genki — 元気 е японска дума, свързана с енергия, жизненост, здраве и добро състояние.',
    en: 'Genki — 元気 is a Japanese word associated with energy, vitality, health and feeling well.',
  },
  'mission.why.close': {
    bg: 'Точно това искаме да носи Genki — повече енергия, повече грижа и малко повече добро в ежедневието.',
    en: 'That’s what we want Genki to bring — more energy, more care and a little more good into everyday life.',
  },

  /* Слотът M05 чака реална снимка от реална инициатива. До тогава не се
     показва нищо, което да се чете като документ за минало събитие. */
  'mission.causes.pending': {
    bg: 'Визуален слот — чака реална снимка от инициатива, която вече се е случила',
    en: 'Visual slot — awaiting real photography from an initiative that has actually happened',
  },

  /* ------------------------------------------------- alt на IMAGE слотовете
     Написани предварително, за да не се добавят на бегом при подмяната на
     placeholder-ите. Alt описва какво се вижда — не повтаря заглавието. */
  'alt.G05': {
    bg: 'Genki машината в офис среда, с логото на Genki',
    en: 'The Genki cooler in an office, with the Genki logo',
  },
  'alt.H01': {
    bg: 'Genki машината в кухненския бокс на офис, заредена с български продукти',
    en: 'The Genki cooler in an office kitchen, stocked with Bulgarian products',
  },
  'alt.H05': {
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
  'alt.C05': {
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
  /* W05 в каноничната карта = „Зад кулисите". Виж бележката за съгласуване
     на ID-тата в docs/GENKI-2.0-VISUAL-ASSET-PRODUCTION-PLAN.md. */
  'alt.W05': {
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
  'alt.M05': {
    bg: 'Доброволческа инициатива на Genki',
    en: 'A Genki volunteering initiative',
  },
  'alt.M03': {
    bg: 'Български производител и неговите продукти',
    en: 'A Bulgarian producer and their products',
  },
  'alt.F08': {
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
