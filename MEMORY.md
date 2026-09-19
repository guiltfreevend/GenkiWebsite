# Genki Website — Memory

## User Preferences & Style
- Tsvetelin is based in Sofia, Bulgaria — all timestamps use Europe/Sofia timezone
- Communication: Bulgarian or English, auto-detect from his messages
- Always ask confirmation before destructive actions (delete files, push, production commands)
- Never auto-push or deploy — only when Tsvetelin explicitly says to
- Prefers Wrangler CLI for instant deploys (~2 seconds), then git push for repo sync
- After every task: detailed report of what was done, what files changed, and the result
- Prefers working through Telegram bots for project management

## Complete Activity Log
- 2026-01-29: Initial commit — complete Genki wellness benefits website
- 2026-01-30: Added Bulgarian language support with language switcher
- 2026-01-30: Added Coming Soon landing page with site switcher
- 2026-01-30: Updated CTAs from "Book a Demo" to "Book a Call"
- 2026-01-30: Improved Bulgarian translations across all pages
- 2026-01-30: Updated stats section with differentiation-focused statistics
- 2026-01-30: Clarified charity donations and fixed partner count
- 2026-01-31: Major website updates — pricing, ROI calculator, messaging improvements
- 2026-01-31: Updated products page and translations
- 2026-01-31: Replaced fake impact numbers with truthful commitment metrics
- 2026-01-31: Updated mission.html with truthful content
- 2026-01-31: Replaced all "Enterprise" references with "Care plan"
- 2026-01-31: Comprehensive Bulgarian translation improvements
- 2026-02-10: Added Umami analytics tracking to all pages
- 2026-02-10: Updated CLAUDE.md with workflow rules and improvement roadmap
- 2026-02-11: Standardized all CTA buttons to "Book consultation" / "Запазете консултация"
- 2026-02-11: Fixed contact form placeholder not translating on language switch
- 2026-02-11: Fixed contact badge text overflow, replaced placeholder phone numbers
- 2026-02-11: Fixed hardcoded English "Direct" stat card on mission page
- 2026-02-11: Replaced generic flag icon with Bulgarian flag emoji in footer
- 2026-02-11: Improved ROI calculator mobile layout and responsiveness
- 2026-02-13: Switched live site to Coming Soon page
- 2026-02-13: Added ROI landing page at /office with minimal privacy page mode
- 2026-02-13: Fixed 404 page (correct logo path, enlarge, remove dead nav links)
- 2026-02-13: Complete CRO optimization of office landing page
- 2026-02-14: Replaced Formspree with Cloudflare Worker for form submission
- 2026-02-14: Upgraded exit-intent detection with multi-signal triggers
- 2026-02-14: Added _headers for cache control on Cloudflare Pages
- 2026-02-14: Updated CLAUDE.md with Cloudflare Pages deploy workflow
- 2026-02-16: Updated ROI calculator employee range to 100-2000
- 2026-02-16: Updated office.html savings claim to €280K-1.4M for new team size range
- 2026-02-18: Fixed JS caching — bust cache for ROI calculator scripts
- 2026-02-18: Added break time savings display and research citations to ROI calculator
- 2026-02-18: Changed default annual salary to €36K in ROI calculator
- 2026-02-18: Aligned office.html calculator defaults with ROI calculator
- 2026-02-18: Updated savings range to €280K–5.7M on office landing page
- 2026-02-18: Removed link to password-protected ROI calculator from office landing page
- 2026-02-18: Added break hours saved display to companies.html and office.html calculators
- 2026-03-19: Added persistent handoff system for cross-session continuity
- 2026-05-21: Added test company box page at /box/GK-7E5700/ — internal sandbox for QR scan -> WinPath sync verification (real-scan mode, hex code, self-heal auto-registers)

## Permanent Rules & Decisions
- Header/footer is duplicated across all HTML files (~170 lines each) — intentional, no build step. Must update ALL 10 active files when changing nav/footer
- CDN versions are pinned — never use @latest for any CDN dependency
- Tailwind config is externalized to js/tailwind-config.js — single source of truth for colors
- Deploy via Wrangler CLI first (instant), then git push for sync — never rely on GitHub auto-deploy for quick iterations
- Cache headers in _headers file ensure HTML is never cached — deploys are instantly visible
- Rollbackable commits — every logical change gets its own commit, never bundle unrelated changes
- Site is pre-launch — no customers yet. Social proof features deferred until post-launch
- Replaced "Enterprise" tier with "Care plan" naming
- All CTAs standardized to "Book consultation" / "Запазете консултация"
- Truthful content only — no fake impact numbers or inflated stats

## Learned Context
- 12 active HTML pages, all with duplicated header/footer
- i18n: custom system using data-i18n attributes + js/translations.js (BG default, EN alternate)
- Forms: Cloudflare Worker on office.html, Formspree on contact.html
- Email: Resend API from hello@genki.bg (configured in Cloudflare Worker secret RESEND_API_KEY)
- Hosting: Cloudflare Pages (project: genkiwebsite), DNS: Cloudflare, domain: www.genki.bg
- Wrangler auth: CLOUDFLARE_API_TOKEN set in ~/.zshrc
- Orphan pages moved to Backups/ — not deployed
- SEO complete: OG tags, canonical URLs, JSON-LD, sitemap, robots.txt
- Color palette: primary green #2d8659, forest #1e5128, teal #14b8a6, cream #f5f5dc, amber #f59e0b
- ROI calculator savings range: €280K–5.7M, employee range: 100-2000, default salary: €36K
- Exit-intent detection uses multi-signal triggers
- JS caching was a gotcha — needed cache-busting for ROI calculator scripts
- 2026-05-11: Site-wide audit + remediation. The earlier 2026-01-30 entry "Updated CTAs from 'Book a Demo' to 'Book a Call'" is SUPERSEDED. Current standard is "Book a consultation" / "Запазете консултация" (no durations). Dietary track promises (vegan/gluten-free/etc.) are also REMOVED — only the wellness filter (no palm oil/HFCS/artificial sweeteners/colors/hydrogenated fats/MSG) is guaranteed. Meals/Fresh/Genki Meals copy is REMOVED — v1 ships snacks + drinks only (TREAT/CRUNCH/REFRESH). Authoritative copy rules now live in `CLAUDE.md` → "Locked Copy Rules — 2026-05-11". Audit findings: `Backups/2026-05-11-website-audit.md`.

## Genki 2.0 (клон `genki-2.0-build`)

- 2026-09-19: **Етап 1 — Основа, завършен.** Design tokens, 6 скелета в `v2/`, хедър/мобилно меню/BG-EN превключвател/футър от един източник, placeholder компонент за визуалните слотове. Подробен отчет в `docs/BUILD-PLAN.md`.
- 2026-09-19: **Брандовото зелено е решено.** Измерено директно от `assets/images/genki_logo.png`: 99,2% от непрозрачните наситени пиксели на буквите са точно **#1d5329**. Това е `--genki-green`. Акцентът за бутони, връзки и акценти е **#218336** (`--genki-green-vivid`) — същият тон 133,3°, S 60%, L 32%, контраст 4,81:1 на бяло. **`#2d8659` от стария сайт е ОТМЕНЕН** и не се ползва в 2.0.
- 2026-09-19: **Логото няма векторен оригинал.** `Genki Logo Files/genki_logo.pdf` съдържа `/Image` XObject и нито един шрифт — растер, завит в PDF. G01/G02/G03 са маркирани „чака векторен файл" и НЕ блокират build-а. Ползва се PNG на максимална резолюция.
- 2026-09-19: **`genki_logo_light.png` съществува** (1563×1563, кремаво #fffdf1 на прозрачен фон). Записът в `GENKI-2.0-ASSETS.md`, че липсва, беше фактически грешен и е поправен.
- 2026-09-19: **Логото е с изрязани прозрачни полета.** Оригиналът е на квадратно платно, където буквите заемат само 33% от височината — при `height: 28px` wordmark-ът излизаше 9 px. Новите `assets/images/genki-logo-wordmark.png` и `-light.png` са изрязани до рамката на буквите. Нито един пиксел от буквите не е променен (проверено: същите 276 988 пиксела в #1d5329). Оригиналите стоят непокътнати.
- 2026-09-19: **Обобщаващата таблица в `GENKI-2.0-ASSETS.md` е поправена.** Документът описва 46 слота, не 36: COMPONENT 22, IMAGE 14, SUPPLIER ASSET 5, хибрид 2, без визуал 3. Снимките са 14 — 12 launch-critical и 2 nice-to-have (C06, W04).
- 2026-09-19: **Решение за дублирания header/footer.** Един източник в `tools/partials/`, преписва се в 6-те страници с `node tools/sync-partials.js` между маркери. Не е build стъпка — сайтът работи без скрипта; скриптът се пуска само при промяна на хедъра или футъра. Избрано пред JS вмъкване, за да остане навигацията в изходния HTML.
- 2026-09-19: **Скелетите живеят в `v2/`,** за да не се презаписва живият legacy сайт. Cut-over-ът е `git mv v2/*.html .` без редакция на пътища.
- 2026-09-19: **Tailwind preflight е изключен** в `js/genki-2-tailwind.js`. Play CDN инжектира стиловете си след нашия CSS и неговият reset (`h1 { font-size: inherit }`) изяждаше типографската скала.
- 2026-09-19: **Мобилното меню стои извън `<header>`.** Хедърът има `backdrop-filter`, което го прави containing block за `position: fixed` — панелът се свиваше до височината на лентата.
- 2026-09-19: **`docs/DESIGN-DIRECTION.md` е добавен** — трети каноничен документ, записан дословно (30 928 байта). Определя как сайтът изглежда, усеща се и се държи. Вписан е в задължителното четене в `CLAUDE.md`.
- 2026-09-19: **Приоритет на документите:** BRIEF (стратегия, структура, copy, claims, CTA) → DESIGN-DIRECTION (визуално изпълнение, лайаут, движение) → ASSETS (инвентар). **ASSETS отстъпва на DESIGN-DIRECTION по композиция.** Противоречие между DESIGN-DIRECTION и BRIEF се докладва, не се решава самò.
- 2026-09-19: **Сверка DESIGN-DIRECTION срещу BRIEF — нула конфликта** по страници, секции, оферти, CTA йерархия и забранени твърдения. Проверено поименно, включително че „ГОТОВО." в резултата на Fit е в бриф раздел 18, а не измислено.
- 2026-09-19: **Tailwind Play CDN е премахнат изцяло** от 2.0 — 407 279 байта JS, който компилира в браузъра. Нула регресии; нула Tailwind утилити се ползваха. `js/genki-2-tailwind.js` е изтрит (възстановим от c173371). Legacy страниците в root продължават да го ползват.
- 2026-09-19: **Решения на собственика:** реална фотография може лица, генерирана — не; радиуси 8-10 / 12-16 / 18-24 с pill само за бутони, chips и Fit избори; Genki Fit и формата за контакт минават през Resend към `hello@genki.bg`; отворени остават само динамичните диапазони на Q3 и границите в € на Q6.
- 2026-09-19: **Етап 1.5 — основата е калибрирана по DESIGN-DIRECTION.** 12-колонен grid (12/8/4), редакционна типографска скала с роли, нова радиус система, motion примитиви, VisualSlot с `<picture>` API. 48 проверки на 8 ширини, нула проблема.
- 2026-09-19: **Хоризонталната навигация е на 1152 px, не на 1024.** Петте заключени nav етикета заемат 619 px; с лого, CTA и език хедърът иска над 1050 px и на 1024 прелива. Пълният етикет на CTA-то влиза на 1280 px. Измерено, не предположено.
- 2026-09-19: **Предпазител за появата при скрол.** Ако след 2,5 s нищо не се е появило, въпреки че има блок в екрана, скриването отпада изцяло — за да не остане съдържание невидимо завинаги при счупен IntersectionObserver.
- 2026-09-19: **Внимание при проверка в headless Chrome:** `--dump-dom` не тиква рендер кадри, затова IntersectionObserver не се задейства и появата изглежда счупена. Проверява се с `--screenshot`, което форсира кадър. Също: Chrome на Windows има минимална ширина на прозореца, затова `--window-size=320` реже кадъра вместо да го преоразмери — точните ширини се мерят през iframe.
- 2026-09-19: **`tools/dev/foundation.html`** показва токените в действие, **`tools/dev/verify.html`** е регресионният харнес (6 страници × 8 ширини). И двете са извън `v2/`, за да не влязат в сайта при cut-over.
