# Genki Website Audit — 2026-05-11

Reconnaissance pass. **No files were edited.** Findings are grouped into the four problem categories defined in the audit brief. Within each category, findings are grouped by file. Line numbers are based on the working tree at HEAD `f673025` plus the working-tree edits already pulled (`9d372f1..d4d32b8` from 2026-05-10).

Repo path on this machine: `/Users/tsvetelinas/Desktop/Business-Genki/GenkiWebsite/` (the Windows path `C:\projects\genki` referenced in the brief is the same repo).

## Summary

| Problem | Total occurrences | Files affected |
|---|---|---|
| 1. Doubled / restated claims | 9 | 5 |
| 2. Demo / CTA wording mismatch | 56 | 12 |
| 3. False / overpromised dietary claims | 4 (rendered) + 6 (orphan keys) | 4 |
| 4. Meals / fresh food framed as current | 16 | 9 |

> **Counting note for Cat 2:** translations.js entries are counted as one occurrence each (not multiplied by every page that resolves the same key). Every visible HTML CTA button counts separately even if it shares a key.

---

## CATEGORY 1 — REDUNDANT / DOUBLED CLAIMS

### `index.html`

```
FILE: index.html
LINES: 288–301 (Pillar 1 card — "100% Bulgarian Sourcing")
ISSUE: "30+ Bulgarian producers" appears in BOTH the description paragraph AND the first bullet. "International quality" appears in BOTH the description AND the second bullet. Heading + body + bullets all restate the same two claims.
QUOTE:
  H3: "100% Bulgarian Sourcing"
  Body: "Smart Organic, Roobar, VIDAS, Frudada and 30+ Bulgarian producers. International-quality products from Bulgarian producers."
  Bullet 1: "30+ Bulgarian producers"
  Bullet 2: "International-quality standards"
  Bullet 3: "Curated for nutritional value"
```

```
FILE: index.html
LINES: 310–322 (Pillar 2 card — "Transparent Donation Model")
ISSUE: "Measurable social impact" appears in BOTH the description AND the first bullet (verbatim).
QUOTE:
  H3: "Transparent Donation Model"
  Body: "10% of real profit donated monthly to Bulgarian charities. Measurable social impact, documented every month."
  Bullet 1: "Measurable social impact"
```

```
FILE: index.html
LINES: 191, 251 (or wherever badge + pillar1 H3 live)
ISSUE: "100% Bulgarian Products" badge above the hero, then "100% Bulgarian Sourcing" H3 in the very next visible section restates the same claim with synonymous wording. The footer (line 522) repeats it again.
QUOTE:
  Hero badge: "100% Bulgarian Products"
  Pillar 1 H3: "100% Bulgarian Sourcing"
  Footer: "Managed wellness infrastructure for workplaces in Bulgaria. 100% Bulgarian-made products. 10% of real profit donated monthly."
```

### `companies.html`

```
FILE: companies.html
LINES: 233, 246, 565
ISSUE: "100% Bulgarian" stated three times above-the-fold-ish (benefit card → pricing hero subtitle → all-include feature row). The pricing-hero subtitle also pairs it with "10% of profit" — both then re-stated again in the page footer (line 779) and the homepage footer cascade.
QUOTE:
  Line 233: "100% Bulgarian products. Your benefit spending stays in the local economy."
  Line 246: "4 stations. 2 service tiers. 100% Bulgarian-made products. 10% of profit donated every month."
  Line 565: "100% Bulgarian-made products"
  Line 779: "Managed wellness infrastructure for workplaces in Bulgaria. 100% Bulgarian-made products. 10% of real profit donated monthly."
```

### `js/translations.js`

```
FILE: js/translations.js
LINES: 318–319 (index_pillar1_desc)
ISSUE: Mirrors the index.html pillar 1 issue — "30+ български производители" + "Международно качество" both appear in this single description string AND are then repeated as separate bullets via index_pillar1_item1 / item2.
QUOTE (BG):
  "Smart Organic, Roobar, VIDAS, Frudada и още 30+ български производители. Международно качество от български производители."
QUOTE (EN):
  "Smart Organic, Roobar, VIDAS, Frudada and 30+ Bulgarian producers. International-quality products from Bulgarian producers."
```

```
FILE: js/translations.js
LINES: 552–553 (companies_benefit6_desc)
ISSUE: Same "30+ Bulgarian producers" + "International-quality" double-up restated inside one paragraph for the Companies page "Support Local" benefit card.
QUOTE (BG):
  "100% български произход — Smart Organic, Roobar, VIDAS, Frudada и още 30+ български производители. Международно качество от български производители."
```

```
FILE: js/translations.js
LINES: 1461–1462 (mission_pillar2_desc)
ISSUE: Third place where the exact same "30+ Bulgarian producers" + "International-quality" double-up is restated, this time on the Mission page Pillar 2 description.
QUOTE (BG):
  "Smart Organic, Roobar, VIDAS, Frudada и още 30+ български производители. Международно качество от български производители — поставени в работното място като управлявана инфраструктура, а не доставка."
```

```
FILE: js/translations.js
LINES: 318/322, 552, 1461 (cross-file restatement)
ISSUE: "30+ Bulgarian producers" + "Smart Organic, Roobar, VIDAS, Frudada" name-drop appears in THREE separate places in three different page contexts. Even if each instance is internally tightened, the brand-name-list+30+ pattern is a templated phrase repeated across the site rather than each page making a fresh point.
```

### `index.html` (footers & meta tags — site-wide cascade)

```
FILE: index.html, products.html, mission.html, contact.html, companies.html, thank-you-contact.html, privacy-en.html
ISSUE: Identical footer description on EVERY page: "Managed wellness infrastructure for workplaces in Bulgaria. 100% Bulgarian-made products. 10% of real profit donated monthly." — combined with the same string in meta description / og:description / twitter:description on most pages, this triple-stacks "100% Bulgarian" + "10% of profit" claims. Within a single page load (meta tags + footer), the user/crawler sees the same two-claim sentence 4× on a few pages.
SOURCE KEYS: footer_desc / footer_description (translations.js 193–195, 217–219)
```

---

## CATEGORY 2 — INCONSISTENT CTA / "DEMO" LANGUAGE

The site is mid-transition. The new homepage hero + header CTAs (committed in `f673025`) are now "Запазете консултация" / "Book consultation". But every other page still ships the old "Запази 20-мин демо" / "Book a 20-min demo" wording, and `office.html` uses a different variant entirely ("Резервирайте 30-мин демо"). Plus the calendar slot at `https://calendly.com/hello-genki/30min` is 30 minutes, contradicting any "20-min" copy.

### Visible HTML CTAs still saying "20-min demo" / "20-мин демо"

```
FILE: privacy-en.html
LINE: 96
CTA TEXT: "Book a 20-min demo"  (header desktop)

FILE: privacy-en.html
LINE: 134
CTA TEXT: "Book a 20-min demo"  (mobile menu)

FILE: privacy.html
LINE: 95
CTA TEXT: "Запази 20-мин демо"  (header desktop)

FILE: privacy.html
LINE: 133
CTA TEXT: "Запази 20-мин демо"  (mobile menu)

FILE: contact.html
LINE: 116
CTA TEXT: "Book a 20-min demo"  (header desktop, data-i18n="nav_cta")

FILE: contact.html
LINE: 156
CTA TEXT: "Book a 20-min demo"  (mobile menu, data-i18n="nav_cta")

FILE: contact.html
LINE: 181
CTA TEXT: "Book a 20-min demo"  (form section H2, data-i18n="contact_form_title")
ISSUE: This is the form section heading itself — naming the form after a duration that doesn't match Calendly.

FILE: contact.html
LINE: 250
CTA TEXT: "Book a 20-min demo"  (form submit button)

FILE: index.html
LINE: 372
CTA TEXT: "Book a 20-min demo"  (How-It-Works step 1 H3, data-i18n="index_step1_title")
ISSUE: Hero CTA was updated to "Book consultation" but step 1 of "How It Works" still describes the action as "Book a 20-min demo" — internal inconsistency on the homepage itself.

FILE: index.html
LINE: 497
CTA TEXT: "Book a 20-min demo"  (bottom CTA, data-i18n="index_cta_schedule")
ISSUE: Bottom-of-homepage CTA still uses old wording while top of homepage now says "Book consultation".

FILE: products.html
LINE: 102
CTA TEXT: "Book a 20-min demo"  (header desktop, data-i18n="nav_cta")

FILE: products.html
LINE: 142
CTA TEXT: "Book a 20-min demo"  (mobile menu, data-i18n="nav_cta")

FILE: products.html
LINE: 330
CTA TEXT: "Book a 20-min demo"  (bottom CTA fallback)

FILE: companies.html
LINE: 143
CTA TEXT: "Book a 20-min demo"  (header desktop, data-i18n="nav_book_call")

FILE: companies.html
LINE: 172
CTA TEXT: "Book a 20-min demo"  (mobile menu)

FILE: companies.html
LINE: 337
CTA TEXT: "Book a 20-min demo"  (Counter station card CTA, data-i18n="pricing_cta_quote")

FILE: companies.html
LINE: 407
CTA TEXT: "Book a 20-min demo"  (Tower Dry station card CTA)

FILE: companies.html
LINE: 480
CTA TEXT: "Book a 20-min demo"  (Tower Fridge station card CTA)

FILE: companies.html
LINE: 550
CTA TEXT: "Book a 20-min demo"  (Hub station card CTA)

FILE: companies.html
LINES: 710–711
CTA TEXT: "Book a 20-min demo"  (mid-page ROI CTA, data-i18n="roi_cta")

FILE: companies.html
LINE: 765
CTA TEXT: "Book a 20-min demo"  (bottom CTA, data-i18n="companies_cta_schedule")

FILE: mission.html
LINE: 101
CTA TEXT: "Book a 20-min demo"  (header desktop)

FILE: mission.html
LINE: 140
CTA TEXT: "Book a 20-min demo"  (mobile menu)

FILE: mission.html
LINES: 392–393
CTA TEXT: "Book a 20-min demo"  (bottom CTA, data-i18n="mission_cta_button")

FILE: thank-you-contact.html
LINE: 90
CTA TEXT: "Book a 20-min demo"  (header desktop)

FILE: thank-you-contact.html
LINE: 129
CTA TEXT: "Book a 20-min demo"  (mobile menu)

FILE: roi-calculator.html
LINE: 480
CTA TEXT: "Book a 20-min demo"  (CTA inside ROI calc, data-i18n="roi_cta_button")
```

### `office.html` — uses an entirely different demo phrasing AND inconsistent within itself

```
FILE: office.html
LINE: 241
CTA TEXT: "Резервирайте демо"  (sticky nav CTA, data-i18n="lp_nav_cta")
EN equivalent (line 1038): "Book Demo"

FILE: office.html
LINE: 268
CTA TEXT: "Резервирайте 30-мин демо"  (hero CTA, data-i18n="lp_hero_cta")
EN equivalent (line 1047): "Book 30-Min Demo"

FILE: office.html
LINE: 920
CTA TEXT: "Резервирайте 30-мин демо сега"  (final CTA, data-i18n="lp_cta_primary")
EN equivalent (line 1197): "Book 30-Min Demo Now"

ISSUE: Within ONE page: "Резервирайте демо" (nav) vs. "Резервирайте 30-мин демо" (hero) vs. "Резервирайте 30-мин демо сега" (final). Three different button strings for the same Calendly URL. Also: the rest of the site uses "Запази X" / "Book X" verb form; office.html uses "Резервирайте" / "Book" — different verb register.
```

### Form / page-section headings that contain "demo" wording

```
FILE: contact.html
LINE: 181
QUOTE: "Book a 20-min demo"  (data-i18n="contact_form_title", H2 of the contact form)
ISSUE: The form is titled after the demo duration. Even when the button text is fixed, this heading needs to come along.

FILE: index.html
LINE: 372
QUOTE: "Book a 20-min demo"  (H3 of step 1 in "How It Works")
ISSUE: Step description on homepage says users will "Book a 20-min demo" while the homepage CTA above it now says "Book consultation".
```

### Translation-file keys still holding the stale BG/EN strings (each updates many CTAs at once)

```
FILE: js/translations.js
LINES: 384–385  KEY: companies_cta_button (or similar — first hit pair)
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 472–473
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 689–690
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 928–929  KEY: roi_cta_button area
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 1192–1193
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 1629–1630
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 2116–2117  (products page CTA)
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 2482–2483
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 2591–2592
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 3089–3090
EN: "Book a 20-min demo"
BG: "Запази 20-мин демо"

FILE: js/translations.js
LINES: 3092–3094  KEY: roi_cta_demo
EN: "Request Demo"
BG: "Заяви демо"
ISSUE: Yet another variant ("Request Demo" / "Заяви демо") — third unique phrasing.
```

### Inline translation map inside `office.html` (separate from translations.js)

```
FILE: office.html
LINE: 1038  KEY: lp_nav_cta
BG: "Запазете час за демо"   EN: "Book Demo"

FILE: office.html
LINE: 1047  KEY: lp_hero_cta
BG: "Резервирайте 30-мин демо"   EN: "Book 30-Min Demo"

FILE: office.html
LINE: 1197  KEY: lp_cta_primary
BG: "Резервирайте 30-мин демо сега"   EN: "Book 30-Min Demo Now"
ISSUE: Even within this one page's i18n map, three different BG verbs — "Запазете", "Резервирайте", "Резервирайте … сега" — for the same intent.
```

### Duration mismatch between BUTTON and SUBTEXT

```
FILE: js/translations.js
LINES: 925 + 928–929
SUBTEXT (line 925, BG):
  "📝 Примерно изчисление за илюстрация. Запазете консултация за персонална оферта."
BUTTON (line 928–929):
  EN: "Book a 20-min demo" / BG: "Запази 20-мин демо"
ISSUE: Subtext promises "консултация"; button says "20-мин демо". Different word, different framing, different duration.

FILE: js/translations.js
LINES: 1189 + 1192–1193
SUBTEXT (BG):
  "Запазете безплатна консултация и вижте как Genki може да трансформира работното Ви място."
BUTTON: "Book a 20-min demo" / "Запази 20-мин демо"
ISSUE: Same pattern — "безплатна консултация" in copy, "20-мин демо" on button.

FILE: js/translations.js
LINES: 2455 + (corresponding products page CTA button)
SUBTEXT (BG):
  "Запазете 30-минутна консултация и ще оформим продуктовата селекция според Вашия екип."
ISSUE: Subtext says "30-минутна консултация", but the page CTA button still resolves to "Запази 20-мин демо" — duration AND wording mismatch.

FILE: js/translations.js
LINES: 2479 + 2482–2483
SUBTEXT (BG):
  "Запазете безплатна консултация и вижте как Genki може да трансформира придобивките на служителите Ви, като подкрепя българските производители и прозрачно дарява всеки месец."
BUTTON: "Book a 20-min demo" / "Запази 20-мин демо"
ISSUE: Same wording-mismatch pattern.

FILE: contact.html
LINE: 379
QUOTE: "How quickly can we get started?"  (FAQ Q, data-i18n="contact_faq2_q")
ISSUE: Soft "Get started" CTA-adjacent phrasing in FAQ — not a button per se but reinforces yet another verb ("Get started") for the same conversion intent.
```

### Email templates / backend functions

```
FILE: netlify/functions/send-roi-report.js
LINE: 170
QUOTE: "<p>Резервирайте 30-минутна demo среща, за да обсъдим как Genki може да трансформира вашия офис:</p>"
ISSUE: Mixes BG ("Резервирайте 30-минутна") with EN word ("demo") inside Bulgarian email body. Plus uses "demo" wording entirely.

FILE: netlify/functions/send-roi-report.js
LINE: 173
QUOTE: '<a href="https://calendly.com/hello-genki/30min" class="cta">Резервирайте Demo Среща →</a>'
ISSUE: Mixed-language CTA "Резервирайте Demo Среща" — "demo" word inside a Bulgarian button string.

FILE: netlify/functions/send-roi-report.js
LINE: 278
QUOTE: '<a href="https://calendly.com/hello-genki/30min" class="cta">Schedule Follow-up Call →</a>'
ISSUE: Yet another verb ("Schedule") for the same Calendly link in the EN follow-up email.
```

### Internal docs that still reference old wording (low priority, but flagged for completeness)

```
FILE: AUDIT_FIXES.md  LINE: 58  — "All CTAs → 'Book a 20-min demo' / 'Запази 20-мин демо'"  (records the now-superseded standardisation)
FILE: AUDIT_FIXES.md  LINES: 31, 76 — passing references to "demo"
FILE: MEMORY.md  LINE: 16 — "2026-01-30: Updated CTAs from 'Book a Demo' to 'Book a Call'"  (history; outdated vs. current direction)
```

---

## CATEGORY 3 — FALSE / OVERPROMISED DIETARY CLAIMS

### Rendered (visible to users)

```
FILE: companies.html
LINE: 742  (companies_faq3_a)
QUOTE:
  EN: "Absolutely. We accommodate vegetarian, vegan, gluten-free, and other dietary needs. Just let us know your team's requirements."
  BG (translations.js 1155): "Разбира се. Разполагаме с вегетариански, вегански, безглутенови и други диетични опции. Просто ни съобщете изискванията на Вашия екип."
ISSUE: Blanket promise of vegan + vegetarian + gluten-free accommodation. The wellness filter is binary (excludes palm oil, HFCS, etc.) and does not guarantee any specific dietary track. Also exposed in the FAQPage JSON-LD on this page (line 94 of companies.html mirrors the same text into structured data — Google may surface it as a rich result).

FILE: companies.html
LINE: 94  (FAQPage JSON-LD, mirrors faq3_a)
QUOTE: "Absolutely. We accommodate vegetarian, vegan, gluten-free, and other dietary needs. Just let us know your team's requirements."
ISSUE: Same dietary promise embedded in structured data — gets indexed by search engines as a Q&A snippet.

FILE: contact.html
LINE: 390  (contact_faq4_a)
QUOTE:
  EN: "Absolutely. We'll work with you to create a mix that matches your team's preferences, dietary needs, and budget."
  BG (translations.js 2740): "Разбира се. Ще работим с Вас, за да създадем продуктова комбинация, която отговаря на предпочитанията на екипа Ви, хранителните нужди и бюджета."
ISSUE: Soft promise of "dietary needs" customisation. Less specific than the companies.html version but still implies we cater per-employee dietary track.

FILE: js/translations.js
LINES: 1154–1155  (companies_faq3_a)
ISSUE: Source for the companies.html FAQ — flagged separately because the key is the canonical store and changes here cascade to BG + EN.

FILE: js/translations.js
LINES: 2738–2740  (contact_faq4_a)
ISSUE: Source for contact.html FAQ4.
```

### Orphan keys (not currently rendered, but still in `translations.js` and could be re-exposed by accident)

```
FILE: js/translations.js
LINES: 2095–2105
KEYS: products_diet_glutenfree, products_diet_lactosefree, products_diet_nutfree
EN/BG values: "Gluten-Free / Безглутеново", "Lactose-Free / Безлактозно", "Nut-Free / Без ядки"

FILE: js/translations.js
LINES: 2433–2451
KEYS: products_diet_vegan, products_diet_vegetarian, products_diet_gluten, products_diet_lactose, products_diet_nut
EN/BG values: "Vegan / Веган", "Vegetarian / Вегетарианско", "Gluten-Free / Безглутеново", "Lactose-Free / Безлактозно", "Nut-Free / Без ядки"

ISSUE: The current /products page (post-rebuild) does not render any of these keys (verified via grep — no `data-i18n="products_diet_*"` anywhere in current HTML). They are leftovers from the old "We accommodate all diets" section. Two duplicate sets of the same keys exist (products_diet_glutenfree vs products_diet_gluten, etc.). Keeping them in translations.js means any future template that references the wrong key name still finds a value, which can re-introduce the false promise silently.
```

---

## CATEGORY 4 — MEALS / FRESH FOOD MENTIONED AS CURRENT OFFERING

### Hero / SEO surface area

```
FILE: index.html
LINES: 6, 19, 29  (meta description + og:description + twitter:description)
QUOTE (BG): "Здравословни снаксове, напитки и хранения, доставени директно в офиса. 100% български продукти, напълно обслужвана от Genki, ~€1/ден/служител."
ISSUE: "хранения" (= meals/food deliveries) listed alongside "снаксове, напитки" with no v2 caveat. Search results, Slack/Twitter previews, LinkedIn previews all surface this string as a current offering.

FILE: products.html
LINES: 6, 18, 28
QUOTE (BG): "Снаксове, напитки и хранения от внимателно подбрани български брандове…"
ISSUE: Same — "хранения" surfaced in /products page meta description and og/twitter descriptions as if it's a current category.
```

### `mission.html` — "Meals" / "Fresh Options" rendered as current category tags

```
FILE: mission.html
LINES: 206–213  (Pillar 1 product-category tags)
QUOTE:
  Tag 3: "Fresh Options"  (data-i18n="mission_offer_fresh", BG "Пресни опции")
  Tag 4: "Meals"          (data-i18n="mission_offer_meals", BG "Ястия")
ISSUE: Four product-category chips rendered side-by-side with no v2 caveat, no "coming soon" badge, no styling differentiation. The tags read as 4 current product categories. The translation strings for the *_desc keys (mission_offer_fresh_desc, mission_offer_meals_desc — translations.js lines 1304–1314) do contain the v2 disclaimer but those _desc keys are never rendered in mission.html (no matching data-i18n). So the disclaimer is invisible.

FILE: js/translations.js
LINES: 1300–1314
KEYS: mission_offer_fresh, mission_offer_fresh_desc, mission_offer_meals, mission_offer_meals_desc
QUOTE:
  mission_offer_fresh_desc EN: "Yogurt, granola, healthy breakfast items"  (no v2 caveat)
  mission_offer_meals_desc EN: "Salads and balanced meals (roadmap — coming in v2)"
ISSUE: The "fresh" desc has zero v2 framing. Even if rendered, it would still imply a current offering. Only the "meals" desc has the disclaimer.

FILE: js/translations.js
LINES: 1296–1298  (mission_offer_drinks_desc)
QUOTE: "Студени чайове, енергийни напитки, пресни сокове, газирана вода, комбуча"
ISSUE: Lists "пресни сокове" (fresh juices) — a known dropped placeholder product per the products page rebuild. Not strictly a "meals" issue but adjacent (false product mention).
```

### `office.html` — "Основни ястия на поръчка" + "Salads, poke, burritos"

```
FILE: office.html
LINES: 597–600
QUOTE:
  H3 (BG): "Основни ястия на поръчка"   EN: "Meals on Order"
  Body (BG): "Салати, поке, бурито при предварителна поръчка — пресни и здравословни"
  Body (EN): "Salads, poke bowls, burritos via pre-order — fresh and healthy"
ISSUE: One of four "What You Get" benefit cards on the office landing page. Presented as a current bookable feature with no v2 / roadmap framing. Salads, poke, burritos are explicit Genki Meals (v2) items.

FILE: office.html
LINES: 1126–1127  (inline i18n map, lp_wyg_3_title + lp_wyg_3_desc)
QUOTE: same as above — sourced inline because office.html does not load js/translations.js.
ISSUE: To fix the rendered card, this inline definition must be edited too (it overrides any global translation).

FILE: office.html
LINE: 718  (lp_ps_1_solution body)
QUOTE (BG): "С Genki: Здравословна храна на място, в тяхната кухня. По-кратки, по-спокойни почивки. Следобедите се усещат различно — повече фокус, по-малко изтощение."
QUOTE (EN, line 1153): "With Genki: Healthy food right there, in their kitchen. Shorter, calmer breaks. Afternoons feel different — more focus, less drain."
ISSUE: "Healthy food right there in their kitchen" + framing the contrast as "no more leaving the office for restaurants" implies on-site lunches are part of v1. This is a soft Cat 4 — doesn't say "meals" outright but the problem→solution framing only works if Genki currently provides lunch food, which it doesn't.

FILE: office.html
LINE: 1569
QUOTE: "On-site healthy food reduces lunch breaks from 90min to 30min"
ISSUE: Inside one of the long-form research/proof strings used elsewhere on the page — same on-site-lunches implication.
```

### `worker/genki-email.js` — pilot email

```
FILE: worker/genki-email.js
LINE: 93
QUOTE (BG): "По-кратки обедни паузи, когато храната е в кухнята. Следобедите стават различни."
ISSUE: Same on-site-lunch implication in the customer-facing email body. ("Shorter lunch breaks when the food is in the kitchen.")
```

### `js/translations.js` — orphan meals/fresh keys still defined

```
FILE: js/translations.js
LINES: 1437–1450  (mission_pillar1_fresh, mission_pillar1_fresh_desc, mission_pillar1_meals, mission_pillar1_meals_desc)
QUOTE:
  mission_pillar1_fresh EN: "Fresh Foods" / BG: "Пресни храни"
  mission_pillar1_fresh_desc EN: "Yogurt, cheese, seasonal fruits, salads" / BG: "Кисело мляко, сирене, сезонни плодове, салати"
  mission_pillar1_meals EN: "Meals" / BG: "Ястия"
  mission_pillar1_meals_desc EN: "Healthy lunches, wraps, soups (roadmap — coming in v2)" / BG: "Здравословни обеди, рапове, супи — в план за v2"
ISSUE: These four keys are NOT rendered in mission.html (no matching data-i18n hooks). They are orphans from a previous mission-page version. The fresh-foods variant has no v2 caveat — risk of being re-exposed by a template revert.

FILE: js/translations.js
LINES: 1703–1708, 1734–1745, 1746–1765
KEYS: products_cat_fresh, products_cat_meals, products_fresh_title, products_fresh_subtitle, products_fresh_desc, products_meals_title, products_meals_subtitle, products_meals_desc, products_meals_note, products_meals_custom
QUOTE:
  products_cat_fresh EN: "Fresh Foods" / BG: "Пресни храни"
  products_fresh_subtitle EN: "Restocked daily with fresh items from Bulgarian producers"
  products_meals_subtitle EN: "Lunches, poke bowls, salads, wraps and soups partnered with Bulgarian kitchens are on our v2 roadmap."
  products_meals_desc EN: same long form, includes "are not part of the current launch and aren't priced into the station tiers"
ISSUE: Orphans from the previous /products page (pre-editorial-rebuild). NOT rendered today — confirmed via grep. Same risk as above: a template revert or a new page that references a wrong key name would silently re-publish "Fresh Foods" / "Lunches, poke bowls, salads…" as if current.

FILE: js/translations.js
LINES: 1900–1917, 2055–2085, 2405–2427
KEYS: products_balanced_title, products_balanced_desc, products_poke_title, products_poke_desc, products_salads_title, products_salads_desc, products_salads_desc_old, products_wraps_title, products_wraps_desc, products_soups_title, products_soups_desc, products_lunch_title, products_lunch_desc, products_fresh_salads, products_fresh_salads_desc, products_wraps, products_soups, products_lunch_boxes, products_lunch_boxes_desc
QUOTE (sample):
  products_poke_title EN: "Poke Bowls" / BG: "Поке купи"
  products_poke_desc BG: "Пресни и здравословни поке опции"
  products_salads_title EN: "Fresh Salads" / BG: "Пресни салати"
  products_lunch_title EN: "Lunch Boxes" / products_lunch_desc EN: "Complete balanced meals"
ISSUE: Heavy block of orphan product-card keys for poke/salads/wraps/soups/lunch/balanced meals. None rendered today. Two duplicate sets exist (products_salads_title + products_fresh_salads, products_lunch_title + products_lunch_boxes, etc.).
```

### Internal docs / README

```
FILE: README.md
LINE: 3
QUOTE: "A premium employee wellness benefit platform providing healthy snacks, drinks, and meals to IT companies in Bulgaria."

FILE: CLAUDE.md
LINE: 8
QUOTE: "B2B wellness benefits company based in Sofia, Bulgaria. Delivers healthy snacks, drinks & meals to offices."

ISSUE: Both internal docs name "meals" as part of the current product mix. Not user-facing, but anything regenerated from these docs (auto-generated SEO copy, AI-assisted page rewrites, marketing summaries) will inherit the wrong scope.
```

---

## Files Not Yet Audited / Notes

- `box/GK-0EA26A/index.html`, `box/GK-282320/index.html`, `box/GK-BLUE01/index.html`, `box/GK-E8FD59/index.html`, `box/index.html` — **scanned, no findings**. Box landing pages are tight, use "Изберете час по-долу" / "Нека поговорим" / "30-минутен въвеждащ разговор" (clean Cat 2), and contain no dietary or meals copy.
- `box/_template/TEMPLATE.md`, `box/_assets/logos/README.md` — scanned, no relevant content.
- `formspree-setup-guide.md`, `NETLIFY-EMAIL-SETUP.md`, `QUICK-START-EMAIL.md`, `RESEND-SETUP.md` — scanned, no relevant content.
- `js/research-data.js` — contains generic productivity research findings that mention "meals", "lunch", "demonstrate" in academic context. Not user-facing claims about Genki. Not flagged.
- `js/roi-engine.js`, `js/roi-calculator.js`, `js/main.js`, `js/formspree-integration.js`, `js/pricing-data.js`, `js/tailwind-config.js` — scanned, no Cat 1–4 hits.
- `package.json`, `package-lock.json` — config only, skipped per common sense.
- `.claude/settings.local.json`, `.netlify/state.json` — local config, skipped.
- `404.html`, `thank-you-coming-soon.html`, `privacy.html`, `privacy-en.html` (other than Cat 2 hits noted above) — no further findings.
- `Backups/` — explicitly excluded per brief.
- The Backups/ directory does contain old products.html versions referencing meals as current — those are intentionally archived; not flagged.

## Method

All searches used `grep -rn` with case-insensitive flags and Cyrillic-aware patterns. Patterns covered the explicit phrases listed in the brief plus common word-form variants (e.g. "демонстрация", "обяд / обеди", "ястия / хранения", "пресн" matching пресен/пресна/пресно/пресни). Where a single source key drives many rendered CTAs, both the key and the rendered HTML are listed separately so the rewrite phase can plan key edits vs. HTML-fallback edits independently.
