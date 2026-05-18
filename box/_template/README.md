# Genki Box Landing Pages — Design System Migration & Future Workflow

## What we're doing

The `/box/` directory has 10 personalized landing pages that companies reach by scanning the QR on a physical Genki Box. The current design is too simple — empty gradient hero, weak subtitle, no scroll story, single CTA. We're elevating all of them to a cinematic premium design that matches Genki's "Managed Wellness Infrastructure" positioning, and setting up a system so adding a new company in the future = giving you the logo + name + one-line description, and you generate the rest.

This is a three-part task:

1. **Restructure** `/box/` for a shared-CSS, per-company-HTML architecture
2. **Migrate** all 9 real existing pages to the new design (delete the placeholder)
3. **Document** the workflow so future pages take 1 minute to add

Read this entire document before you start. Don't write code until you've understood every section.

---

## Task 1 — File architecture

Restructure `/box/` like this:

```
/box/
  _shared/
    box.css              # All design-system styling for box pages
    box.js               # Animations on-scroll, language toggle, smooth scroll to Calendly
  _template/
    README.md            # This document, saved for future reference
    template.html        # Reference HTML with {{placeholder}} markers
    new-company.md       # Step-by-step for adding a new company
  GK-0EA26A/
    index.html           # Nemetschek
  GK-E8FD59/
    index.html           # HP
  GK-282320/
    index.html           # Nexo
  GK-22C9E0/
    index.html           # Payhawk
  GK-273195/
    index.html           # Chaos
  GK-7B06E3/
    index.html           # SiteGround
  GK-C0CC7E/
    index.html           # EnduroSat
  GK-77D809/
    index.html           # OfficeRnD
  GK-7258D2/
    index.html           # Shelly Group
  index.html             # Existing code-entry gateway — DO NOT MODIFY
```

**Critical:** Delete the entire `/box/GK-BLUE01/` directory. It's a test placeholder for "Acme Technologies" and should not ship to a real client by accident.

Each `/box/GK-XXXXXX/index.html` is a fully self-contained static HTML file that links to `/box/_shared/box.css` and `/box/_shared/box.js`. No build step. No dynamic loading. Cloudflare Pages serves it directly.

---

## Task 2 — Design system

### Layout & sections

Every box page has exactly 4 sections, in this order:

1. **Hero** — full viewport, animated, personalized per company
2. **Personal note** — white section, customized headline + body per company
3. **Three pillars** — light cream section, identical across all companies
4. **Final CTA + Calendly** — dark section, identical across all companies, Calendly embed below

Total page height should fit comfortably under 3500px on a 1440px viewport.

### Visual language

- **Hero background:** soft 4-stop diagonal gradient — sage green → cream → light lavender → muted purple — with two animated radial blur blobs that drift on a 16-second loop. This is the only place gradients appear.
- **All other sections:** flat solid colors. White (`#ffffff`) or cream (`#fafaf8`) for content, near-black (`#0e0e10`) for the final CTA.
- **Typography:** Inter or Montserrat (Cyrillic-safe). Two weights only — 400 regular, 500 medium. Never 600+.
- **Hero headline:** 54-72px depending on viewport, letter-spacing -2.8px, line-height 1.0.
- **Section headlines:** 30-36px, weight 500, letter-spacing -1px.
- **Body text:** 15-16px, weight 400, line-height 1.65, max-width 540px.
- **Accent color:** sage green `#2d4a23` for primary CTAs and the `×` in the hero, plus `#9bc586` for highlight text on dark.
- **No drop shadows. No glow effects. No neon. Soft and editorial only.**

### Animations

Three classes of motion, all CSS-only (no JS dependencies for animation):

1. **On page load** — staggered fade-rise for hero elements (logos 0.1-0.25s, headline word-by-word 0.35-0.85s, sub 1.1s, CTA 1.3s, scroll cue 1.9s)
2. **Background drift** — hero `::before` radial blobs translate-and-rotate on a 16s infinite loop
3. **On scroll** — sections 2, 3, 4 fade-up when entering viewport (`IntersectionObserver`, threshold 0.15, single-fire)
4. **Scroll cue bob** — gentle 2.5s vertical bob on the down-arrow at hero bottom

No parallax, no scroll-jacking, no autoplay video.

See `/box/_shared/box.css` for the full CSS spec and `/box/_shared/box.js` for the shared behaviour.

---

## Task 3 — template.html (the reference)

Saved as `/box/_template/template.html`. Every new company page is generated from this by replacing the `{{double-brace}}` placeholders.

**Note on the final `<h2>`:** the Bulgarian and English `data-i18n` attributes only carry the first line. The `<br>` and `<span class="accent">30 минути.</span>` are static and stay rendered. When you wire the language toggle, only the first part swaps — translate the accent line by adding a separate `<span data-i18n-bg="30 минути." data-i18n-en="30 minutes.">` if you want a fully bilingual closing.

---

## Task 4 — Per-company content

For each of the 9 real companies, here's the full content to drop into the template. Save the company logo as SVG (preferred) or PNG at `/box/_shared/logos/{slug}.svg` — use their official press-kit logo. If you can't find an SVG, use a clean PNG.

### Nemetschek — `/box/GK-0EA26A/index.html`

- **COMPANY_NAME:** `Nemetschek`
- **COMPANY_SLUG:** `nemetschek`
- **HERO_SUB_BG:** `Вие проектирате сградите на утрешния ден. Ние се грижим за хората, които ги изграждат.`
- **HERO_SUB_EN:** `You design the buildings of tomorrow. We care for the people building them.`
- **PERSONAL_HEADLINE_BG:** `Nemetschek проектира сградите. Genki проектира това, което се случва вътре в тях.`
- **PERSONAL_HEADLINE_EN:** `Nemetschek designs the buildings. Genki designs what happens inside them.`
- **PERSONAL_BODY_BG:** `Вашите инструменти определят как изглежда офисът на утрешния ден. Genki определя как се чувстват хората вътре в него — чрез ежедневна уелнес инфраструктура, която не се вижда в архитектурния план, но всеки ден има значение. Помислихме си — би трябвало да изградим нещо заедно.`
- **PERSONAL_BODY_EN:** `Your tools define what tomorrow's office looks like. Genki defines how people feel inside it — through daily wellness infrastructure that doesn't show up in the architectural plan but matters every single day. We thought — we should build something together.`

### HP — `/box/GK-E8FD59/index.html`

- **COMPANY_NAME:** `HP`
- **COMPANY_SLUG:** `hp`
- **HERO_SUB_BG:** `Вие правите устройствата за модерната работа. Ние правим горивото за хората, които ги използват.`
- **HERO_SUB_EN:** `You make the devices for modern work. We make the fuel for the people using them.`
- **PERSONAL_HEADLINE_BG:** `HP прави устройствата. Genki прави горивото.`
- **PERSONAL_HEADLINE_EN:** `HP makes the devices. Genki makes the fuel.`
- **PERSONAL_BODY_BG:** `Вашите устройства са в ръцете на милиони служители всеки ден. Genki е това, към което тези ръце посягат между задачите — здравословна храна, чисти напитки, ежедневна грижа. Помислихме си — би трябвало да говорим.`
- **PERSONAL_BODY_EN:** `Your devices are in the hands of millions of employees every day. Genki is what those hands reach for between tasks — healthy food, clean drinks, daily care. We thought — we should talk.`

### Nexo — `/box/GK-282320/index.html`

- **COMPANY_NAME:** `Nexo`
- **COMPANY_SLUG:** `nexo`
- **HERO_SUB_BG:** `Вие движите цифровите активи. Ние движим енергията на хората, които ги изграждат.`
- **HERO_SUB_EN:** `You move digital assets. We move the energy of the people building them.`
- **PERSONAL_HEADLINE_BG:** `Nexo движи цифрови активи. Genki движи хората, които ги правят възможни.`
- **PERSONAL_HEADLINE_EN:** `Nexo moves digital assets. Genki moves the people who make them possible.`
- **PERSONAL_BODY_BG:** `Вашата платформа работи 24/7 за милиони потребители по целия свят. Хората, които я поддържат, имат нужда от енергия, която също работи 24/7 — без палмово масло, без боклук, без компромис. Помислихме си — би трябвало да изградим нещо заедно.`
- **PERSONAL_BODY_EN:** `Your platform runs 24/7 for millions of users around the world. The people behind it need energy that runs 24/7 too — no palm oil, no junk, no compromise. We thought — we should build something together.`

### Payhawk — `/box/GK-22C9E0/index.html`

- **COMPANY_NAME:** `Payhawk`
- **COMPANY_SLUG:** `payhawk`
- **HERO_SUB_BG:** `Вие давате на компаниите контрол върху разходите. Ние правим един от тях, на който всеки евро се вижда обратно.`
- **HERO_SUB_EN:** `You give companies control over spend. We're the one where every euro shows up on the people.`
- **PERSONAL_HEADLINE_BG:** `Payhawk прави всеки разход видим. Genki прави един от тях, който се вижда върху хората.`
- **PERSONAL_HEADLINE_EN:** `Payhawk makes every expense visible. Genki is the one you see in the people.`
- **PERSONAL_BODY_BG:** `Вашата платформа прави всеки корпоративен евро осмислен. Genki е разход, който се връща — в концентрацията, в усмивките, в ежедневието на хората, които правят Payhawk възможен. Помислихме си — би трябвало да говорим.`
- **PERSONAL_BODY_EN:** `Your platform makes every corporate euro meaningful. Genki is an expense that comes back — in focus, in smiles, in the daily life of the people who make Payhawk possible. We thought — we should talk.`

### Chaos — `/box/GK-273195/index.html`

- **COMPANY_NAME:** `Chaos`
- **COMPANY_SLUG:** `chaos`
- **HERO_SUB_BG:** `Вие правите светове, които изглеждат истински. Ние правим грижата за хората, които ги създават, истинска.`
- **HERO_SUB_EN:** `You make worlds that look real. We make the care for the people creating them real.`
- **PERSONAL_HEADLINE_BG:** `Chaos прави светове, които изглеждат истински. Genki прави грижата истинска.`
- **PERSONAL_HEADLINE_EN:** `Chaos makes worlds look real. Genki makes the care real.`
- **PERSONAL_BODY_BG:** `Вашите инструменти осветяват сцени, които никой все още не е виждал. Genki осветява нещо по-малко зрелищно, но също толкова важно — ежедневното благополучие на екипа, който ги изгражда. Помислихме си — би трябвало да изградим нещо заедно.`
- **PERSONAL_BODY_EN:** `Your tools light up scenes no one has seen before. Genki lights up something less spectacular but just as important — the daily wellbeing of the team building them. We thought — we should build something together.`

### SiteGround — `/box/GK-7B06E3/index.html`

- **COMPANY_NAME:** `SiteGround`
- **COMPANY_SLUG:** `siteground`
- **HERO_SUB_BG:** `Вие държите интернета онлайн. Ние държим хората, които правят това възможно, в най-добрата им форма.`
- **HERO_SUB_EN:** `You keep the internet online. We keep the people who make that possible at their best.`
- **PERSONAL_HEADLINE_BG:** `SiteGround е инфраструктура за интернета. Genki е инфраструктура за хората зад нея.`
- **PERSONAL_HEADLINE_EN:** `SiteGround is infrastructure for the internet. Genki is infrastructure for the people behind it.`
- **PERSONAL_BODY_BG:** `Вашата инфраструктура е невидима, докато не изчезне — и тогава целият свят я забелязва. Genki е друг вид инфраструктура, същата по природа — тиха в добрите дни, безценна, когато я има. Помислихме си — би трябвало да говорим.`
- **PERSONAL_BODY_EN:** `Your infrastructure is invisible until it goes down — and then the whole world notices. Genki is another kind of infrastructure, the same in nature — quiet on good days, invaluable when present. We thought — we should talk.`

### EnduroSat — `/box/GK-C0CC7E/index.html`

- **COMPANY_NAME:** `EnduroSat`
- **COMPANY_SLUG:** `endurosat`
- **HERO_SUB_BG:** `Вие изпращате идеи отвъд земната орбита. Ние държим хората зад тях в най-добрата им форма.`
- **HERO_SUB_EN:** `You send ideas beyond Earth's orbit. We keep the people behind them at their best.`
- **PERSONAL_HEADLINE_BG:** `EnduroSat изпраща неща в орбита. Genki ги държи здрави на земята.`
- **PERSONAL_HEADLINE_EN:** `EnduroSat sends things into orbit. Genki keeps the ones on the ground strong.`
- **PERSONAL_BODY_BG:** `Вашият екип работи върху проблеми, които никога не са били решавани. Тази работа изисква нещо повече от кафе и упоритост — изисква системна ежедневна грижа. Genki е инфраструктурата, която прави това възможно. Помислихме си — би трябвало да изградим нещо заедно.`
- **PERSONAL_BODY_EN:** `Your team works on problems that have never been solved before. That work needs more than coffee and grit — it needs systematic daily care. Genki is the infrastructure that makes that possible. We thought — we should build something together.`

### OfficeRnD — `/box/GK-77D809/index.html`

- **COMPANY_NAME:** `OfficeRnD`
- **COMPANY_SLUG:** `officernd`
- **HERO_SUB_BG:** `Вие управлявате работното пространство. Ние се грижим за хората в него.`
- **HERO_SUB_EN:** `You manage the workspace. We care for the people inside it.`
- **PERSONAL_HEADLINE_BG:** `OfficeRnD управлява пространства. Genki ги превръща в места.`
- **PERSONAL_HEADLINE_EN:** `OfficeRnD manages spaces. Genki turns them into places.`
- **PERSONAL_BODY_BG:** `Вашата платформа дава контрол върху работното пространство. Genki добавя това, което все още липсва вътре — ежедневна уелнес инфраструктура, която хората използват и помнят. Помислихме си — би трябвало да изградим нещо заедно.`
- **PERSONAL_BODY_EN:** `Your platform gives control over the workspace. Genki adds what's still missing inside — daily wellness infrastructure people use and remember. We thought — we should build something together.`

### Shelly Group — `/box/GK-7258D2/index.html`

- **COMPANY_NAME:** `Shelly Group`
- **COMPANY_SLUG:** `shelly`
- **HERO_SUB_BG:** `Вие свързвате устройствата в нашите домове. Ние свързваме хората в нашите офиси с по-добро ежедневие.`
- **HERO_SUB_EN:** `You connect devices in our homes. We connect people in our offices with a better daily life.`
- **PERSONAL_HEADLINE_BG:** `Shelly прави стаите интелигентни. Genki прави офисите желани.`
- **PERSONAL_HEADLINE_EN:** `Shelly makes rooms smart. Genki makes offices wanted.`
- **PERSONAL_BODY_BG:** `Вашите продукти превръщат обикновени стаи в интелигентни пространства. Genki прави нещо подобно с офиса — превръща го от място за работа в място, в което хората искат да бъдат. Помислихме си — би трябвало да говорим.`
- **PERSONAL_BODY_EN:** `Your products turn ordinary rooms into intelligent spaces. Genki does something similar to the office — turns it from a place people have to work into a place people want to be. We thought — we should talk.`

---

## Task 5 — Cleanup

After all 9 pages are migrated:

1. `git rm -r box/GK-BLUE01/` — delete the Acme test page entirely
2. Search the codebase for any links/references to `GK-BLUE01` and remove them
3. If there's a sitemap, update it
4. Test all 9 URLs work and render correctly

---

## Task 6 — Future workflow

See `/box/_template/new-company.md` for the step-by-step process for adding a new company.

---

## Design principles (don't break these)

These are non-negotiable. If a future request conflicts with them, push back.

- **Never put product cards on a box landing page.** The box page is about the *invitation*, not the catalog. Products live on the main genki.bg site.
- **Never auto-play video, sound, or modal pop-ups.** This page must respect the visitor — they just scanned a QR, they're not trapped.
- **Never use more than two font weights** (400, 500). The visual hierarchy comes from size + color + spacing, not from weight stacking.
- **Never use drop shadows, glow, or neon.** Editorial flatness. The only color "depth" comes from the hero gradient.
- **Never use sentence-case headlines longer than 14 Bulgarian words.** If you can't say it in 14 words, you don't yet know what you mean.
- **Never write a personal section that could apply to any company.** If you could swap the company name and the copy still makes sense, the copy isn't personal enough — rewrite it.
- **Never lead with prices.** The box page is pre-conversation. Prices belong on the main site after the discovery call.
- **Never weaken the donation language.** "10% от печалбата · Дарени всеки месец · Видимо · Отчетено · Без катче" — these stay verbatim.

---

## Final checklist before pushing

- [ ] `/box/_shared/box.css` written and matches the spec above
- [ ] `/box/_shared/box.js` written and matches the spec above
- [ ] `/box/_template/template.html` saved with placeholders
- [ ] `/box/_template/README.md` = this entire document
- [ ] `/box/_template/new-company.md` = Task 6 workflow
- [ ] All 9 real company pages rebuilt from template
- [ ] All 9 company logos saved to `/box/_shared/logos/`
- [ ] `/box/GK-BLUE01/` directory removed
- [ ] All 9 URLs tested locally
- [ ] Calendly widget loads on each page
- [ ] Language toggle works on each page
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Lighthouse score on mobile > 90 (performance + accessibility)
- [ ] No console errors

Start with the architecture and shared files (CSS, JS, template). Once those are solid, build one page (OfficeRnD — that's the design reference) end-to-end and show me. Then I'll greenlight you to migrate the other 8.

Don't push to main until I've reviewed the OfficeRnD page locally.
