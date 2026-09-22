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

  /* ==========================================================================
     КОНТАКТ

     BG и EN са ДОСЛОВНО от „GENKI 2.0 — WEBSITE COPY & HANDOFF"
     (LOCKED 16.09.2026), включително имената на полетата и 24-часовото
     обещание.

     Съобщението за успех не е в каноничния документ — ползва се
     формулировката, одобрена за етап 6, и ПАЗИ 24-часовото обещание.
     ========================================================================== */

  'contact.label': { bg: 'КОНТАКТ', en: 'CONTACT' },
  'contact.title': { bg: 'Нека поговорим.', en: 'Let’s talk.' },
  'contact.lead': {
    bg: 'Имате въпрос за Genki или искате да обсъдим вашия офис? Пишете ни и ще се свържем с вас в рамките на 24 часа.',
    en: 'Have a question about Genki or want to discuss your workplace? Send us a message and we’ll get back to you within 24 hours.',
  },

  /* --- Полетата. Имената са заключени. --- */
  'contact.f.name':    { bg: 'Име',       en: 'Name' },
  'contact.f.company': { bg: 'Компания',  en: 'Company' },
  'contact.f.email':   { bg: 'Email',     en: 'Work email' },
  'contact.f.phone':   { bg: 'Телефон',   en: 'Phone' },
  'contact.f.optional':{ bg: 'по желание', en: 'optional' },
  'contact.f.message': { bg: 'Съобщение', en: 'Message' },
  'contact.submit':    { bg: 'Изпратете съобщение', en: 'Send message' },
  'contact.sending':   { bg: 'Изпращане…',          en: 'Sending…' },

  /* --- Грешки по поле. Човешки, не агресивни. --- */
  'contact.err.name':    { bg: 'Моля, въведете името си.',        en: 'Please enter your name.' },
  'contact.err.company': { bg: 'Моля, въведете компанията си.',   en: 'Please enter your company.' },
  'contact.err.email':   { bg: 'Моля, въведете валиден email адрес.', en: 'Please enter a valid email address.' },
  'contact.err.message': { bg: 'Моля, напишете съобщението си.',  en: 'Please write your message.' },
  'contact.err.long':    { bg: 'Този текст е твърде дълъг.',      en: 'This text is too long.' },

  /* --- Състояния на формата --- */
  'contact.err.summary': {
    bg: 'Проверете полетата, отбелязани по-долу.',
    en: 'Please check the fields marked below.',
  },
  'contact.err.server': {
    bg: 'Съобщението не можа да бъде изпратено. Опитайте отново след малко или ни пишете на hello@genki.bg.',
    en: 'Your message could not be sent. Please try again in a moment, or write to us at hello@genki.bg.',
  },
  'contact.err.network': {
    bg: 'Изглежда връзката прекъсна. Опитайте отново.',
    en: 'The connection seems to have dropped. Please try again.',
  },
  'contact.success.title': { bg: 'Благодарим!', en: 'Thank you!' },
  'contact.success.text': {
    bg: 'Получихме съобщението ви и ще се свържем с вас в рамките на 24 часа.',
    en: 'We’ve received your message and we’ll get back to you within 24 hours.',
  },

  /* --- Препратката към Genki Fit. Нарочно по-тиха от формата. --- */
  'contact.fit.lead': {
    bg: 'Искате да видите какъв Genki би работил при вас?',
    en: 'Want to see what kind of Genki could work for your workplace?',
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


  /* ====================================================================
     GENKI FIT  (етап 7)

     BG и EN са ДОСЛОВНО от каноничния „GENKI 2.0 — WEBSITE COPY &
     HANDOFF" (LOCKED 16.09.2026). Нищо тук не е превеждано на ръка.

     Единственото обявено отклонение: формулировката на Q3. Каноничният
     документ пита „Колко души обикновено са там в един нормален ден?".
     Спецификацията на етап 7 дава по-точна формулировка, защото Q3 вече
     значи посещаемост в КОНКРЕТНИЯ офис, а не общ брой служители.

     Низовете с {} се попълват в js/genki-fit.js. Никакъв текст не се
     сглобява от парчета — всяко изречение е цяло на своя език.
     ==================================================================== */

  /* --- Hero --- */
  'fit.hero.label':   { bg: 'GENKI FIT', en: 'GENKI FIT' },
  'fit.hero.title':   { bg: 'Какъв Genki би работил най-добре при вас?',
                        en: 'What kind of Genki would work best for your workplace?' },
  'fit.hero.lead':    { bg: 'Разкажете ни накратко за екипа и офиса. Ние ще ви покажем как бихме изградили Genki за вашата компания.',
                        en: 'Tell us a little about your team and workplace. We’ll show you how we would shape Genki for your company.' },
  'fit.hero.start':   { bg: 'Започнете', en: 'Start' },
  'fit.hero.time':    { bg: 'Шест въпроса, под минута.', en: 'Six questions, under a minute.' },

  /* --- Навигация вътре в инструмента --- */
  'fit.progress':     { bg: '{n} / 6', en: '{n} / 6' },
  'fit.back':         { bg: 'Назад', en: 'Back' },
  'fit.next':         { bg: 'Напред', en: 'Continue' },
  'fit.multi':        { bg: 'Може да изберете повече от едно.', en: 'You can choose more than one.' },
  'fit.a11y.step':    { bg: 'Стъпка {n} от 6', en: 'Step {n} of 6' },
  'fit.a11y.progress':{ bg: 'Напредък в Genki Fit', en: 'Genki Fit progress' },
  'fit.err.choose':   { bg: 'Изберете поне един отговор, за да продължите.',
                        en: 'Choose at least one answer to continue.' },
  'fit.err.company':  { bg: 'Въведете името на компанията.', en: 'Enter your company name.' },

  /* Прозрачност преди първия запис. Кратко, човешко и без юридически тон
     — не е декларация за съгласие и не твърди правни изводи. */
  'fit.privacy.note': { bg: 'Отговорите ви се изпращат към Genki, за да подготвим препоръката.',
                        en: 'Your answers are sent to Genki so we can prepare your recommendation.' },
  'fit.privacy.link': { bg: 'Политика за поверителност', en: 'Privacy Policy' },

  /* --- Q1 --- */
  'fit.q1.title':     { bg: 'Къде имате офиси?', en: 'Where do you have offices?' },
  'fit.q1.sofia':     { bg: 'София', en: 'Sofia' },
  'fit.q1.plovdiv':   { bg: 'Пловдив', en: 'Plovdiv' },
  'fit.q1.varna':     { bg: 'Варна', en: 'Varna' },
  'fit.q1.burgas':    { bg: 'Бургас', en: 'Burgas' },
  'fit.q1.other':     { bg: 'Други градове', en: 'Other cities' },
  'fit.q1.offices':   { bg: 'Колко офиса имате в София?', en: 'How many offices do you have in Sofia?' },
  /* Компанията е задължителна още на първата стъпка: трябва да знаем чий
     е офисът дори когато човекът спре по средата. НЕ е седми въпрос —
     стои на същия екран. */
  'fit.q1.company':   { bg: 'Компания', en: 'Company' },
  'fit.q1.offices.1':    { bg: '1', en: '1' },
  'fit.q1.offices.2':    { bg: '2', en: '2' },
  'fit.q1.offices.3plus':{ bg: '3+', en: '3+' },

  /* --- Q2 (адаптивен) --- */
  'fit.q2.one':       { bg: 'Колко души работят във вашия офис в София?',
                        en: 'How many people work in your Sofia office?' },
  'fit.q2.many':      { bg: 'Колко души работят общо в офисите ви в София?',
                        en: 'How many people work across your Sofia offices?' },
  'fit.q2.nosofia':   { bg: 'Колко души работят в най-големия ви офис?',
                        en: 'How many people work in your largest office?' },
  'fit.q2.largest':   { bg: 'А в най-големия от тях?', en: 'And in the largest one?' },
  'fit.q2.lte50':     { bg: 'До 50', en: 'Up to 50' },
  'fit.q2.51-100':    { bg: '51–100', en: '51–100' },
  'fit.q2.101-150':   { bg: '101–150', en: '101–150' },
  'fit.q2.151-300':   { bg: '151–300', en: '151–300' },
  'fit.q2.301-500':   { bg: '301–500', en: '301–500' },
  'fit.q2.501-999':   { bg: '501–999', en: '501–999' },
  'fit.q2.1000+':     { bg: '1,000+', en: '1,000+' },

  /* --- Q3 --- */
  'fit.q3.title':     { bg: 'Колко души обикновено са в този офис в един нормален работен ден?',
                        en: 'How many people are usually in this office on a normal working day?' },
  'fit.q3.help':      { bg: 'Не общият брой служители — хората, които реално са на място.',
                        en: 'Not total headcount — the people who are actually on site.' },
  'fit.q3.lt25':      { bg: 'Под 25', en: 'Under 25' },
  'fit.q3.lt50':      { bg: 'Под 50', en: 'Under 50' },
  'fit.q3.25-49':     { bg: '25–49', en: '25–49' },
  'fit.q3.50':        { bg: '50', en: '50' },
  'fit.q3.50-74':     { bg: '50–74', en: '50–74' },
  'fit.q3.75-99':     { bg: '75–99', en: '75–99' },
  'fit.q3.75-100':    { bg: '75–100', en: '75–100' },
  'fit.q3.75-149':    { bg: '75–149', en: '75–149' },
  'fit.q3.75-199':    { bg: '75–199', en: '75–199' },
  'fit.q3.100-150':   { bg: '100–150', en: '100–150' },
  'fit.q3.150-199':   { bg: '150–199', en: '150–199' },
  'fit.q3.200-300':   { bg: '200–300', en: '200–300' },
  'fit.q3.200-349':   { bg: '200–349', en: '200–349' },
  'fit.q3.200-399':   { bg: '200–399', en: '200–399' },
  'fit.q3.200-499':   { bg: '200–499', en: '200–499' },
  'fit.q3.350-500':   { bg: '350–500', en: '350–500' },
  'fit.q3.400-699':   { bg: '400–699', en: '400–699' },
  'fit.q3.500-999':   { bg: '500–999', en: '500–999' },
  'fit.q3.700-999':   { bg: '700–999', en: '700–999' },
  'fit.q3.1000+':     { bg: '1,000+', en: '1,000+' },

  /* --- Q4 --- */
  'fit.q4.title':     { bg: 'Какво имате в офиса в момента?', en: 'What do you currently have at the office?' },
  'fit.q4.canteen':   { bg: 'Столова / catering', en: 'Canteen / catering' },
  'fit.q4.vending':   { bg: 'Vending', en: 'Vending' },
  'fit.q4.fruit':     { bg: 'Плодове / snacks', en: 'Fruit / snacks' },
  'fit.q4.other':     { bg: 'Друго решение', en: 'Another solution' },
  'fit.q4.none':      { bg: 'Нищо постоянно', en: 'Nothing permanent' },

  /* --- Q5 --- */
  'fit.q5.title':     { bg: 'Какво искате Genki да даде на екипа ви?',
                        en: 'What do you want Genki to give your team?' },
  'fit.q5.benefit':        { bg: 'По-силен ежедневен benefit', en: 'A stronger everyday benefit' },
  'fit.q5.benefit.note':   { bg: 'Повече изживяване, активности и неща специално за екипа.',
                             en: 'More experience, activities and things made specifically for the team.' },
  'fit.q5.price-support':      { bg: 'По-добри цени', en: 'Better prices' },
  'fit.q5.price-support.note': { bg: 'Компанията помага с цената на продуктите.',
                                 en: 'The company helps cover part of the product price.' },
  'fit.q5.both':      { bg: 'И двете', en: 'Both' },
  'fit.q5.both.note': { bg: 'Най-пълното Genki experience.', en: 'The fullest Genki experience.' },
  'fit.q5.unsure':      { bg: 'Още не сме сигурни', en: 'We’re not sure yet' },
  'fit.q5.unsure.note': { bg: 'Ще ви препоръчаме ние.', en: 'We’ll recommend what makes sense.' },

  /* --- Q6 --- */
  'fit.q6.title':     { bg: 'Какъв месечен бюджет бихте отделили за Genki?',
                        en: 'What monthly budget would you allocate to Genki?' },
  'fit.q6.help':      { bg: 'Използваме го само за да ви покажем конфигурация, която има смисъл за вас.',
                        en: 'We only use this to show you a setup that makes sense for your company.' },
  'fit.q6.upto':      { bg: 'До {max}', en: 'Up to {max}' },
  'fit.q6.range':     { bg: '{min}–{max}', en: '{min}–{max}' },
  'fit.q6.open':      { bg: '{min}+', en: '{min}+' },
  'fit.q6.exact':     { bg: '{min}', en: '{min}' },
  'fit.q6.notsure':   { bg: 'Още не сме сигурни', en: 'Not sure yet' },

  /* --- Пауза преди резултата --- */
  'fit.calc':         { bg: 'Подготвяме вашия Genki Fit…', en: 'Preparing your Genki Fit…' },

  /* --- Резултат --- */
  'fit.result.done':  { bg: 'ГОТОВО.', en: 'DONE.' },
  'fit.result.title': { bg: 'Ето как бихме направили Genki за вас.',
                        en: 'Here’s how we would build Genki for you.' },
  'fit.result.c1':    { bg: 'Вашият Genki', en: 'Your Genki' },
  'fit.result.c2':    { bg: 'Нашата препоръка', en: 'Our recommendation' },
  'fit.result.c3':    { bg: 'Защо това е подходящо за вас', en: 'Why this fits your team' },
  'fit.result.caveat':{ bg: 'Вероятна конфигурация. Точният вариант се потвърждава след кратък оглед на офиса.',
                        en: 'A likely configuration. The exact setup is confirmed after a short look at your workplace.' },
  'fit.result.budget':      { bg: 'Месечен бюджет на компанията', en: 'Monthly company budget' },
  'fit.result.budget.approx':{ bg: 'около {amount}', en: 'around {amount}' },
  'fit.result.budget.exact': { bg: '{amount}', en: '{amount}' },
  'fit.result.ps':    { bg: 'Препоръчана подкрепа на цената: {pct}%',
                        en: 'Recommended price support: {pct}%' },
  'fit.result.restart':{ bg: 'Започнете отначало', en: 'Start over' },

  /* Карта 1 — вероятният размер. Без вътрешните имена Single и Duo. */
  'fit.hw.mini':      { bg: 'Компактен Genki за офиса ви', en: 'A compact Genki for your workplace' },
  'fit.hw.single':    { bg: 'Един Genki smart cooler', en: 'One Genki smart cooler' },
  'fit.hw.duo':       { bg: 'Genki setup за по-голям офис', en: 'A Genki setup for a larger workplace' },
  'fit.hw.multi':     { bg: 'Genki на няколко точки в офиса', en: 'A multi-point Genki setup' },

  /* Карта 2 — конфигурацията */
  'fit.ap.core':          { bg: 'Genki', en: 'Genki' },
  'fit.ap.benefit':       { bg: 'Genki + Benefit', en: 'Genki + Benefit' },
  'fit.ap.price-support': { bg: 'Genki + Price Support', en: 'Genki + Price Support' },
  'fit.ap.both':          { bg: 'Genki + Benefit + Price Support', en: 'Genki + Benefit + Price Support' },
  'fit.ap.core.note':     { bg: 'Базовият Genki, без месечна такса за компанията. Price Support може да се добави по всяко време.',
                            en: 'Core Genki, with no monthly company fee. Price Support can be added at any time.' },
  'fit.ap.benefit.note':  { bg: 'Benefit слоят прави Genki по-личен за екипа — персонализация, участие и събития.',
                            en: 'The Benefit layer makes Genki feel more personal — personalization, participation and events.' },
  'fit.ap.price-support.note': { bg: 'Компанията поема част от цената на всеки продукт, а екипът плаща по-малко.',
                                 en: 'The company covers part of the price of each product, so your team pays less.' },
  'fit.ap.both.note':     { bg: 'Benefit слоят плюс подкрепа на цените — най-пълното Genki за екипа ви.',
                            en: 'The Benefit layer plus price support — the fullest Genki for your team.' },

  /* Карта 3 — причините. Сглобяват се от отговорите, по 2–3 на резултат. */
  'fit.why.attendance':   { bg: 'При {range} души на място в нормален ден този размер Genki обикновено е правилният.',
                            en: 'With {range} people on site on a normal day, this is usually the right size of Genki.' },
  'fit.why.coexist':      { bg: 'Genki не замества това, което вече имате — работи заедно с него и добавя повече за екипа.',
                            en: 'Genki doesn’t replace what you already have — it works alongside it and adds more for your team.' },
  'fit.why.fresh':        { bg: 'В офиса няма нищо постоянно в момента, така че Genki започва от чисто и не измества нищо.',
                            en: 'There’s nothing permanent at the office right now, so Genki starts fresh without displacing anything.' },
  'fit.why.benefit':      { bg: 'Искате по-силен ежедневен benefit, а бюджетът ви покрива точно този слой.',
                            en: 'You want a stronger everyday benefit, and your budget covers exactly that layer.' },
  'fit.why.ps':           { bg: 'Искате по-добри цени за екипа и бюджетът ви позволява реална подкрепа на всяка покупка.',
                            en: 'You want better prices for your team, and your budget supports a real contribution on every purchase.' },
  'fit.why.both':         { bg: 'Бюджетът ви стига и за Benefit слоя, и за подкрепа на цените едновременно.',
                            en: 'Your budget covers both the Benefit layer and price support at the same time.' },
  'fit.why.pslater':      { bg: 'Започваме с Benefit слоя, а подкрепата на цените може да се добави по-късно.',
                            en: 'We start with the Benefit layer, and price support can be added later.' },
  'fit.why.core':         { bg: 'Genki може да работи и без месечна такса за компанията при подходящи локации.',
                            en: 'For suitable locations, Genki can work with no monthly company fee.' },
  'fit.why.unsure':       { bg: 'Още не сте решили каква форма искате — затова предлагаме тази, която пасва на бюджета ви.',
                            en: 'You haven’t decided on a format yet, so we’re suggesting the one that fits your budget.' },

  /* --- Мека консултация --- */
  'fit.soft.title':   { bg: 'Нека намерим правилния Genki за вашия екип',
                        en: 'Let’s find the right Genki for your team' },
  'fit.soft.p1':      { bg: 'Вашият офис има малко по-различен профил и не искаме автоматично да ви препоръчаме конфигурация, която може да не е най-подходящата.',
                        en: 'Your workplace has a slightly different profile, and we don’t want to automatically recommend a setup that may not be the right one.' },
  'fit.soft.p2':      { bg: 'Нека разгледаме случая ви заедно и да намерим Genki вариант, който има смисъл за вашия екип и начина, по който работите.',
                        en: 'Let’s look at it together and find a Genki setup that makes sense for your team and the way you work.' },

  /* --- Вторично действие: изпращане на Fit-а по email -------------------

     Резултатът НЕ е заключен зад това. Човекът вече е получил стойност;
     имейлът е негов избор, не наша такса за вход.

     БЕЛЕЖКА ЗА СОБСТВЕНИКА: спецификацията даде това copy на „ти"
     („Изпрати ми този Genki Fit", „Твоят код е…"). Тук е преведено на
     „Вие", защото целият сайт и целият останал Genki Fit са на Вие, а
     бриф раздел 6 и чеклистът в раздел 39 забраняват смесване. Смяната
     обратно е на едно място. */
  'fit.send.action':  { bg: 'Изпратете ми този Genki Fit', en: 'Send me this Genki Fit' },
  'fit.send.email':   { bg: 'Работен email', en: 'Work email' },
  'fit.send.to':      { bg: 'Ще изпратим Fit-а на:', en: 'We’ll send your Fit to:' },
  'fit.send.change':  { bg: 'Променете', en: 'Change' },
  'fit.send.submit':  { bg: 'Изпратете', en: 'Send' },
  'fit.send.submit.to': { bg: 'Изпратете на {email}', en: 'Send to {email}' },
  'fit.send.sending': { bg: 'Изпращаме…', en: 'Sending…' },
  'fit.send.cancel':  { bg: 'Затворете', en: 'Close' },

  'fit.send.done':      { bg: 'Готово. Изпратихме вашия Genki Fit на {email}.',
                          en: 'Done. We’ve sent your Genki Fit to {email}.' },
  'fit.send.done.code': { bg: 'Вашият код е {code}.', en: 'Your code is {code}.' },
  'fit.send.done.keep': { bg: 'Запазете го — ако се свържете с нас по-късно, ще можем веднага да продължим оттук.',
                          en: 'Keep it — if you get in touch later, we can pick up right where we left off.' },

  /* --- Вторично действие: разговор с Genki ------------------------------
     Води към реалната страница за контакт. Няма система за резервация,
     затова няма и „Запазете среща". */
  'fit.contact.action': { bg: 'Свържете се с Genki', en: 'Talk to Genki' },

  'fit.err.email':    { bg: 'Въведете валиден работен email.', en: 'Enter a valid work email.' },
  'fit.err.server':   { bg: 'Нещо се обърка при изпращането. Опитайте отново след малко.',
                        en: 'Something went wrong while sending. Please try again shortly.' },
  'fit.err.network':  { bg: 'Няма връзка със сървъра. Проверете интернет връзката си.',
                        en: 'No connection to the server. Please check your internet connection.' },

  /* --- Без JavaScript --- */
  'fit.nojs':         { bg: 'Genki Fit има нужда от JavaScript. Пишете ни и ще минем през въпросите заедно.',
                        en: 'Genki Fit needs JavaScript. Send us a message and we’ll go through the questions together.' },
  'fit.nojs.cta':     { bg: 'Пишете ни', en: 'Contact us' },

  /* --------------------------------------------- временни низове за скелета
     Съществуват само докато съответният етап напълни страницата. */
  'skeleton.notice': {
    bg: 'Скелет. Съдържанието на тази страница влиза в следващ етап.',
    en: 'Skeleton. This page’s content arrives in a later stage.',
  },
};
