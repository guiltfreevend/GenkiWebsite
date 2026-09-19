# GENKI 2.0 — MASTER VISUAL DESIGN + FRONT-END IMPLEMENTATION BRIEF

You are now responsible for implementing the complete Genki 2.0 website.

IMPORTANT:
The website strategy, business model, IA, copy, CTA hierarchy, Genki Fit logic and page structure have already been locked in the separate Genki 2.0 website handoff.

THIS prompt defines how the website must LOOK, FEEL and BEHAVE.

Do not reinterpret the business.
Do not rewrite the site.
Do not invent new sections because they “look good”.
Do not turn Genki into a generic startup/SaaS website.

Your task is to build the locked Genki website at an exceptionally high design standard.

The desired outcome is:

A website that feels as though a world-class, high-budget digital design studio designed and developed it specifically for Genki.

It must feel:
- premium
- fresh
- energetic
- warm
- intelligent
- extremely polished
- contemporary
- memorable
- tactile
- smooth
- editorial
- product-led
- human
- visually confident

It must NOT feel:
- templated
- AI-generated
- generic SaaS
- corporate
- “startup landing page”
- vending-machine company
- cheap wellness brand
- eco cliché
- childish
- over-designed
- gimmicky

Think in terms of the discipline, confidence and attention to detail found in the best modern consumer-tech, premium food, hospitality and product websites.

The philosophy is closer to:

Apple-level restraint
×
premium modern food/lifestyle art direction
×
high-end workplace/product brand
×
Genki’s own identity.

DO NOT copy Apple or any other website visually.

Use those references only as a quality benchmark.

---

# 1. FIRST: INSPECT BEFORE CHANGING

Before implementing:

1. Inspect the existing repository thoroughly.
2. Understand the current component structure, styling system, assets, fonts and routes.
3. Identify which pieces of the current genki.bg visual DNA are genuinely strong.
4. Preserve useful existing brand elements instead of rebuilding everything from zero.
5. Reuse the real Genki logo assets.
6. Reuse the real Genki green / existing brand color values where already defined.
7. Do not migrate frameworks or rewrite the technical stack unnecessarily.

Repository:
guiltfreevend/GenkiWebsite

Work only in:
genki-2.0-redesign

Do not modify main/production unless explicitly instructed.

The current website is VISUAL DNA, not business-model truth.

The desired evolution is approximately:

65–70% recognizable Genki visual DNA
+
30–35% more maturity, art direction, originality, interaction and premium execution.

Genki 2.0 should feel like Genki grew up — not like the company suddenly became a completely different brand.

---

# 2. CORE VISUAL IDEA

The visual language should be built around:

WHITE / LIGHT SPACE
+
GENKI GREEN
+
LARGE TYPOGRAPHY
+
REAL GENKI HARDWARE
+
REAL BULGARIAN PRODUCTS
+
REAL HUMAN MOMENTS
+
VERY STRONG SHORT STATEMENTS
+
PREMIUM MOTION
+
SUBTLE 元気 BRAND DETAILS.

The site should feel energetic without becoming visually noisy.

Confidence through restraint.

One strong idea at a time.

---

# 3. DO NOT CREATE “CARD SOUP”

This is extremely important.

Do NOT solve every section by placing:

icon
+
title
+
two lines
+
rounded rectangle

inside a grid.

Cards should only exist when information genuinely behaves like cards.

Some sections should instead be:

- large editorial typography;
- image + text;
- full-width visual;
- asymmetric compositions;
- product close-ups;
- one strong sentence;
- split layouts;
- horizontal visual sequences;
- immersive brand moments.

Example:

“Всяко евро трябва да се усеща.”

This should NOT simply become another small card.

It can become an almost full-width/high-impact visual moment.

Use hierarchy, scale and whitespace instead of containers everywhere.

---

# 4. DESIGN SYSTEM

Build a coherent design system before styling individual pages.

Use semantic design tokens.

Examples:

--color-bg
--color-bg-soft
--color-text
--color-text-muted
--color-green
--color-green-dark
--color-border
--color-surface

--space-1 ...
--radius-sm
--radius-md
--radius-lg

etc.

If an exact Genki green already exists in the repository/current brand, USE IT.

Do not arbitrarily replace it with a new green.

Derived darker/lighter variants may be created carefully.

---

# 5. COLOR

The website should primarily use:

- white;
- near-white;
- very light neutral surfaces;
- Genki green;
- very dark green/near-black for contrast sections;
- natural product colors from photography.

Do not make the site beige.

Do not make it brown.

Do not create a stereotypical “organic wellness” palette.

Avoid excessive gradients.

Especially avoid:
- purple SaaS gradients;
- aurora gradients;
- rainbow gradients;
- neon effects.

Subtle tonal gradients are acceptable only when they improve depth.

Genki green should feel special.

Do not paint every section green.

Use it as punctuation.

When a full dark-green section appears, it should feel intentional and powerful.

---

# 6. TYPOGRAPHY

Typography should carry a large part of the brand experience.

Do not use five fonts.

Inspect existing Genki typography first.

Prefer:
- one primary high-quality sans-serif family;
- optionally one carefully chosen editorial/display accent ONLY if it genuinely improves the current Genki visual language.

Do not introduce a decorative serif simply because “premium websites use serif”.

Typography hierarchy should feel editorial rather than template-like.

Suggested responsive ranges:

Hero display:
desktop approximately 72–104px
tablet 56–76px
mobile 42–58px

Section headline:
desktop 48–72px
mobile 34–48px

Supporting heading:
28–40px

Body:
desktop 18–20px
mobile 16–18px

Small labels:
12–14px

Use CSS clamp() where appropriate.

Headline line-height:
approximately 0.95–1.05 depending on font.

Body line-height:
approximately 1.45–1.65.

Avoid excessively wide text.

Body copy generally:
max-width ~56–65ch.

Large editorial statements:
much narrower intentional widths.

Avoid orphan single words where possible in major headings.

Bulgarian typography must look as polished as English.

---

# 7. LAYOUT / GRID

Desktop:

Use a disciplined 12-column grid.

Recommended main layout:
max-width approximately 1280–1440px.

Content area may be narrower depending on context.

Desktop side gutters:
32–64px depending on viewport.

Tablet:
8-column logic.

Mobile:
4-column logic.

Mobile side padding:
20–24px.

Do not center every section.

Use:
- asymmetric compositions;
- offset text;
- large visual fields;
- intentionally broken symmetry.

But underlying alignment must be extremely disciplined.

Premium does not mean random.

---

# 8. SPACING SYSTEM

Use a consistent spacing scale.

Suggested core rhythm:

4
8
12
16
24
32
48
64
80
96
128
160

Typical section spacing:

Desktop:
120–160px vertical

Medium sections:
96–120px

Tablet:
80–112px

Mobile:
64–88px

Do not allow every section to occupy 100vh.

The website should have rhythm:

dense
→ open
→ visual
→ dense
→ statement
→ visual
→ CTA.

Not:

giant section
giant section
giant section
giant section.

---

# 9. SURFACES / BORDERS / SHADOWS

Avoid heavy card shadows.

Preferred hierarchy:

1. whitespace
2. surface color difference
3. subtle border
4. shadow only where physically meaningful.

Borders:
thin / low contrast.

Rounded corners:
use deliberately.

Possible system:
small UI: 10–14px
medium cards: 16–20px
large media: 24–32px

Do NOT make every single element a large rounded rectangle.

Avoid the generic “everything is 24px radius” look.

---

# 10. NAVIGATION

Navigation should feel extremely polished.

Desktop:
- clean;
- minimal;
- logo left;
- core navigation;
- BG/EN;
- Genki Fit as visually distinct primary action.

It may become subtly elevated or translucent after scroll if this improves clarity.

If using backdrop blur:
keep it restrained.

Do not create a dramatic glassmorphism navbar.

Header height:
approximately 68–80px desktop.

Mobile:
simple menu architecture.

Genki Fit remains prominent.

Do not bury the primary CTA inside the hamburger if another elegant solution is possible.

Navigation interaction:
subtle, quick, premium.

---

# 11. BUTTONS

Buttons must feel tactile.

Primary button:
Genki green / dark green depending on background.

Secondary:
outline / subtle surface.

Height:
approximately 48–54px desktop
minimum comfortable mobile target.

Horizontal padding:
generous.

Do not make them huge cartoon pills.

Rounded shape can be soft/pill-like if consistent with current Genki DNA.

Hover example:

background/color transition
+
arrow translates ~3–5px
+
optional button lift <=1px.

Duration:
160–220ms.

Do not use dramatic scale effects.

Active:
immediate physical response.

Focus:
clear keyboard-visible outline.

Minimum touch target:
44×44px.

---

# 12. IMAGERY — CRITICAL RULE

DO NOT GENERATE THE SITE IMAGES YOURSELF.

DO NOT pull random stock images.

DO NOT invent fake Genki products.

DO NOT invent fake hardware.

DO NOT generate fake offices.

DO NOT modify the Genki logo.

The images will be created/provided separately together with Tsvetelin and ChatGPT.

Your responsibility is to build PERFECT VISUAL SLOTS for them.

Every important visual location should have a semantic asset ID.

Examples:

HOME-HERO-01
HOME-HOW-01
HOME-BENEFIT-01
COMPANIES-HERO-01
WORKS-PAYMENT-01
MISSION-PRODUCER-01
FIT-HARDWARE-01

For each slot in code/documentation define:

- asset ID;
- page;
- section;
- role;
- desktop aspect ratio;
- mobile aspect ratio;
- expected focal area;
- whether copy overlays it;
- safe-area requirement;
- object-position expectation.

Until final assets arrive:

Use elegant neutral placeholders or existing approved real assets.

Do not use fake final imagery just to make the design look complete.

Image placement must be designed BEFORE images are generated.

---

# 13. IMAGE ART DIRECTION PRINCIPLE

When final imagery arrives later, the site should be capable of supporting:

A. PRODUCT HERO IMAGERY
Real Genki cooler as physical object.

B. PRODUCT DETAIL
Door / handle / payment terminal / shelves / products / texture.

C. FOOD / PRODUCT IMAGERY
Actual Bulgarian products.

D. HUMAN MOMENTS
Natural workplace moments around Genki.

E. BRAND / EDITORIAL
More atmospheric images for mission / producers / impact.

F. UI / FIT
Real interface treatments built from our UI system.

The entire website should not depend on generic photographs of smiling office workers.

---

# 14. HOME PAGE — VISUAL DIRECTION

HOME should be the strongest brand experience.

## HOME HERO

This is the most important visual moment on the entire site.

Do not make:
headline left + generic rectangle right.

Create a more art-directed composition.

Possible direction:

Editorial split composition.

Left:
small label
large headline
short supporting copy
CTA

Right / bleeding into layout:
large real Genki cooler / workplace visual.

Allow the image to feel physically present.

The machine should feel like an object, not a thumbnail.

Use depth through composition, not fake 3D effects.

The visual may extend beyond the conventional content grid if done elegantly.

Add a very subtle Genki detail such as:

元気

or another approved micro brand mark.

Not decorative Japanese theming.

Hero should ideally feel visually complete around:
70–90vh desktop

but not artificially force exactly 100vh.

Mobile:
completely recompose.

Do NOT simply shrink the desktop split.

Mobile order can become:

label
headline
copy
CTA
large visual

with deliberate overlap/crop.

---

## HOME — HOW IT WORKS

The 4 steps should feel visual and tactile.

Avoid four identical generic cards.

Possible execution:

four connected moments;
visual sequence;
large numbered steps;
small media frames;
light connecting motion.

01 Open
02 Take
03 Close
04 Done

Desktop may allow horizontal rhythm.

Mobile stacks vertically.

Use clear storytelling.

---

## HOME — GENKI BENEFIT

Show Benefit and Price Support as two distinct but related ideas.

Do not create two boring pricing cards.

Benefit can feel experiential / human.

Price Support can feel immediate / transactional / visible.

Use visual contrast.

Could use:
left/right composition;
alternating visual panels;
simple micro UI representation.

No made-up data.

---

## HOME — “EVERY EURO SHOULD BE FELT”

Treat this as a brand statement.

It may be one of the largest typographic sections after the hero.

Minimal.

Confident.

Lots of air.

One CTA.

Potentially one subtle Genki green interactive detail.

---

## HOME — WHY GENKI

Three ideas:

Product Standard
Bulgarian producers
10% donation

Can share a single powerful editorial system.

Do not turn this into generic feature-card grid if a richer visual composition is possible.

---

# 15. FOR COMPANIES — VISUAL DIRECTION

This page should feel more commercially sophisticated than Home without becoming corporate.

Hero:
premium workplace context + Genki.

Then:

“You give the benefit. We handle the work.”

This section should communicate operational simplicity.

Visually show Genki service around the product:
stocking;
monitoring;
service;
optimization.

Do not fake dashboards if none exist.

---

## BENEFIT SYSTEM

Four Benefit clusters:

Your Genki
Something New
Causes Together
More Personal Support

Create a visual system that lets the viewer understand all four quickly.

Do not make four giant 100vh sections.

Do not make sixteen tiny cards.

A premium grouped composition is preferred.

---

## BUDGET SECTION

“Всяко евро трябва да се усеща.”

Again, typography-led.

Price Support can be visualized elegantly without looking like a fintech pricing calculator.

---

## EXISTING PROVIDERS

“Не е нужно да променяте всичко.”

This should feel reassuring.

Possible visual language:
Genki appearing alongside several abstract/real workplace services rather than replacing them.

Do not negatively depict competitors.

---

## PILOT

Pilot is visually secondary.

Small elegant callout.

Do not make Pilot appear like the main offer.

---

# 16. HOW GENKI WORKS — VISUAL DIRECTION

This page should feel almost like a premium product demonstration.

The physical purchase flow is central.

Card.
Open.
Take.
Close.
Done.

Use:
large product photography slots;
close-ups;
UI micro-states;
clean numbered progression.

On desktop, a carefully implemented sticky visual may be used where text steps change beside one visual.

BUT:

NO scroll-jacking.

The user must retain full native scroll control.

Do not create animation that prevents or hijacks scrolling.

On mobile:
simple vertical sequence.

This page should make a viewer think:

“Oh. That really is simple.”

---

# 17. MISSION & IMPACT — VISUAL DIRECTION

This page should become warmer and more editorial.

Less product-tech.

More:
ingredients;
products;
makers;
Bulgarian producers;
hands;
real objects;
materials;
community;
natural human moments.

But still premium.

Not rustic.

Not farmer-market cliché.

---

## PRODUCT STANDARD

High-quality food/product close-up.

Clean compositions.

---

## BULGARIAN BY CHOICE

Producer / Bulgarian product visual storytelling.

Avoid nationalist visual clichés.

No flags everywhere.

The story is:
quality local businesses deserving more reach.

---

## 10% SECTION

This can become a strong dark-green brand moment.

Large:

10%

with restrained supporting text.

The section should feel serious and credible.

Do not create celebratory fake statistics.

---

## 元気 / WHY GENKI

Use Japanese characters carefully:

元気

This should feel like a signature / origin detail.

Not a theme.

No:
sakura;
Japanese patterns;
torii gates;
fake calligraphy;
red-circle Japan imagery.

---

# 18. GENKI FIT — PREMIUM MINI-APP

Genki Fit must NOT feel like a web form embedded in the site.

It should feel like a small premium product.

Think:
calm
focused
fast
delightful
obvious.

When Genki Fit starts, reduce surrounding website chrome.

Allow the experience to take visual focus.

One core question per screen.

Large typography.

Large choice controls.

Lots of whitespace.

Progress:
simple and obvious.

Example:
1 / 6
+
small progress line.

Choices should feel tactile.

Selection response:
150–220ms.

Next question transition:
approximately 280–420ms.

Use:
opacity
+
small horizontal/vertical translation.

Never dramatic slides across the whole screen.

Back action:
visible and predictable.

Answers must remain preserved.

No typing until lead capture unless absolutely required.

Mobile is the PRIMARY design target for Fit.

Fit mobile UX must feel exceptional.

---

## FIT RESULTS

Result should feel rewarding.

Not like “form submitted”.

Use hierarchy:

ГОТОВО.

Then:
Your Genki
Our recommendation
Why this fits you

Hardware image slot should have intentional space.

Budget and Price Support information must be clear but not spreadsheet-like.

Cards may be appropriate here because these are actual discrete result objects.

Keep them premium and spacious.

Then lead capture.

---

# 19. CONTACT

Contact page should be extremely simple.

Do not overdesign it.

Large:
“Нека поговорим.”

Short supporting text.

Beautiful form.

Minimal distractions.

Optional side visual / brand texture only if it genuinely improves composition.

---

# 20. MOTION LANGUAGE

Motion must feel like one system across the website.

Do NOT randomly invent animations section by section.

Use a small vocabulary.

### A. Content reveal

On viewport entry:

opacity 0 → 1
translateY 12–20px → 0

duration:
450–650ms

ease:
a refined cubic-bezier / ease-out.

Use only once.

Do not animate every tiny paragraph independently.

### B. Stagger

For grouped items:
~50–80ms stagger.

Avoid slow cascade animations.

### C. Image reveal

Possible:
soft clip/mask reveal
or opacity + tiny scale.

Scale maximum approximately:
1.02–1.04.

No dramatic zoom.

### D. Hover media

Image scale:
maximum 1.015–1.025.

Duration:
300–500ms.

### E. Buttons

160–220ms.

Arrow translation:
3–5px.

### F. Navigation

Subtle state transition after scroll.

### G. Page transitions

If current framework makes this robust:

200–350ms subtle fade/translate.

Never delay navigation for visual theatre.

---

# 21. MOTION RULE: NEVER ANNOY

Do NOT use:

- scroll hijacking;
- forced smooth-scroll libraries that break native behavior;
- long intro loaders;
- page loaders for branding;
- huge cursor effects;
- constant floating objects;
- mouse-following blobs;
- excessive parallax;
- horizontal scroll sections purely for novelty;
- endless marquees;
- rotating text;
- 3D scenes that hurt performance;
- animations requiring the user to wait.

Premium motion should be FELT more than noticed.

---

# 22. PARALLAX

If used at all:

very subtle.

Approximate perceived movement:
3–6%.

Only on large visual compositions.

No parallax on mobile unless demonstrably smooth and useful.

Respect prefers-reduced-motion.

---

# 23. MICROINTERACTIONS

Use microinteractions to make the site feel expensive.

Examples:

- CTA arrow responds;
- selected Fit option has tactile transition;
- nav item underline/indicator;
- image surface responds subtly;
- step number state transition;
- progress line in Fit;
- expandable mobile menu;
- form validation;
- focus states.

Each should communicate state.

Do not animate just because animation exists.

---

# 24. MOBILE IS NOT SHRUNK DESKTOP

For every section ask:

“What is the ideal mobile composition?”

not:

“How do we make desktop fit?”

Test at minimum around:

390px
430px
768px
1024px
1440px
1728px

Mobile:
20–24px page padding.

Avoid more than 3–4 lines for major hero headings where possible.

Do not let cards become endless giant vertical slabs.

Reorder image and copy when needed.

Crop images specifically for mobile.

Use separate asset crops later where necessary.

Visual Asset Map will explicitly define this.

No essential horizontal scrolling.

---

# 25. IMAGE CROPS

Do not assume desktop imagery can always simply use object-fit: cover on mobile.

Build support for:

desktop image source
+
mobile image source

where the final Visual Asset Map requires it.

Potential standard slots can include:

Hero desktop:
~4:5 / 3:4 visual field inside split layout
or wider editorial composition depending on page.

Editorial landscape:
~16:9 / 3:2

Feature:
~4:3

Portrait/human:
~4:5

Product cutout:
transparent canvas.

Mobile hero:
~4:5 / 3:4.

Exact ratios should remain configurable per Visual Asset Map.

---

# 26. PEOPLE

Human imagery should feel candid and believable.

Avoid stereotypical stock scenes:

- group pointing at laptop;
- high-five meeting;
- fake laughter around conference table;
- people posing toward camera.

Genki moments are small everyday moments.

Example emotional direction:

11:27.
Someone leaves their desk.
Opens Genki.
Takes a kombucha and snack.
A colleague arrives.
They talk briefly.
They return to work.

That everyday ritual is part of the product.

The website layout should create room for imagery like this later.

---

# 27. HARDWARE

Treat the Genki smart cooler like premium product hardware.

Not vending equipment.

Photography slots should allow:

- full machine;
- side angle;
- door;
- shelves;
- payment device;
- texture;
- lighting detail;
- products inside.

Use only approved real hardware.

Never create fake machine geometry in CSS or illustration.

---

# 28. PRODUCTS

Actual Bulgarian products should add energy/color to the otherwise restrained Genki system.

Allow products to sometimes break the grid subtly.

For example:
a product cutout partially overlapping a visual field.

Do this sparingly.

Do not create “floating snack explosion” graphics everywhere.

---

# 29. ICONOGRAPHY

Use a single icon language.

Simple.
Geometric.
Thin-to-medium stroke.

Do not mix:
emoji;
filled icons;
outline icons;
random illustration sets.

If icons can be avoided through typography, often avoid them.

---

# 30. DO NOT LOOK LIKE AI / TEMPLATE DESIGN

Continuously audit for the following red flags:

- endless bento grids;
- gradient blobs;
- every section centered;
- icon + title + text repeating;
- excessive pill labels;
- huge number of rounded cards;
- arbitrary glassmorphism;
- generic dashboard mockups;
- fake analytics;
- “trusted by” logo strips without clients;
- decorative floating spheres;
- random abstract 3D;
- repetitive layout;
- every heading having the same width;
- every section using same spacing;
- every section using exactly 3 cards;
- generic startup illustrations;
- fake testimonials.

If the page starts looking like something a generic AI website generator would produce, STOP and redesign the composition.

---

# 31. VISUAL RHYTHM

A premium site should feel composed like an editorial sequence.

Example Home rhythm:

NAV
↓
high-impact hero
↓
compact product explanation
↓
visual process
↓
benefit story
↓
large statement
↓
mission/product visual
↓
strong CTA
↓
footer

Alternate between:

light
dense
visual
open
dark
light.

Do not make six identical white sections.

---

# 32. ACCESSIBILITY

Premium means accessible.

Target WCAG 2.2 AA.

Requirements:

- contrast compliant;
- semantic HTML;
- correct heading hierarchy;
- keyboard access;
- visible focus;
- 44×44 minimum touch targets;
- descriptive form labels;
- proper error associations;
- alt text;
- reduced motion support.

Never hide focus outlines without a replacement.

Animations must not be necessary for understanding content.

---

# 33. PERFORMANCE

Premium means fast.

Target Core Web Vitals:

LCP < 2.5s
INP < 200ms
CLS < 0.1

Prefer better if achievable.

Do not ship large JS animation libraries just to move text upward.

Use native CSS where possible.

Animate transform and opacity.

Optimize images.

Use responsive sources.

Lazy load below-the-fold media.

Hero image should be prioritized correctly.

Fonts:
subset if appropriate;
font-display: swap;
avoid excessive families/weights.

No background autoplay video by default.

If video is later approved, implement it carefully with image fallback.

---

# 34. COMPONENT ARCHITECTURE

Build reusable primitives, but do not let the design become visually repetitive because the code is reusable.

Good reusable foundations:

Container
Section
Typography
Button
Link
MediaFrame
VisualSlot
SplitLayout
StatementSection
CTASection
FitChoice
FitProgress
FormField

But allow composition-level freedom.

Do not create one generic Section component and force every page through identical title/body/cards props.

---

# 35. VISUAL SLOT COMPONENT

Create a clear temporary VisualSlot system for all future images.

In development, every unresolved image area should expose its asset ID.

Example:

<VisualSlot
  id="HOME-HERO-01"
  ratio="4/5"
  mobileRatio="3/4"
  role="Primary Genki cooler hero"
/>

This is temporary development infrastructure.

It should make replacing placeholders with our final generated/real assets extremely easy.

Do not bake imagery into CSS unnecessarily.

---

# 36. RESPONSIVE ART DIRECTION

Support picture/source or framework equivalent for different crops where appropriate.

Do not rely solely on object-position hacks for every device.

When we later produce:

HOME-HERO-01-desktop.webp
HOME-HERO-01-mobile.webp

the architecture should make switching them trivial.

---

# 37. 元気 DETAIL

Genki comes from 元気.

Use 元気 as a subtle recurring brand signature.

Possible uses:

- tiny hero annotation;
- section eyebrow;
- footer detail;
- image edge detail;
- Mission page.

Maximum restraint.

It should reward attention.

It should never become the main visual theme.

---

# 38. FOOTER

Footer should feel designed, not like an afterthought.

Can use deep Genki green.

Clear hierarchy:

brand
short statement
navigation
contact/social
legal
company identity.

Generous but not enormous spacing.

A small 元気 detail may work elegantly here.

---

# 39. QUALITY BAR FOR EVERY SECTION

Before considering a section finished, ask:

1. Is the hierarchy obvious in under two seconds?
2. Does this look specifically like Genki?
3. Could this exact section belong to 100 SaaS websites?
4. Is there enough whitespace?
5. Is there too much whitespace?
6. Is the visual doing useful work?
7. Is motion improving understanding?
8. Does mobile have its own composition?
9. Is the CTA obvious?
10. Is any element present only because it is trendy?

If #3 is yes:
redesign.

If #10 is yes:
remove it.

---

# 40. IMPLEMENTATION PROCESS

Do not ask me to approve every trivial implementation choice.

Use professional judgment inside this design system.

However, DO NOT change locked strategy/content/business decisions.

Work in this sequence:

PHASE 1
Inspect codebase and current Genki design DNA.

PHASE 2
Create/refine:
design tokens
grid
typography
spacing
buttons
nav
media system
motion primitives.

PHASE 3
Implement shared shell:
header
navigation
language switch
footer
page transitions if appropriate.

PHASE 4
Build Home to final visual quality.

Use image VisualSlots where final imagery is missing.

PHASE 5
Build:
For Companies
How Genki Works
Mission & Impact
Contact.

PHASE 6
Build Genki Fit as its own premium mini-app experience.

PHASE 7
Responsive refinement for every page.

PHASE 8
Accessibility + motion + performance QA.

PHASE 9
Final visual consistency audit.

Do not stop after producing a nice Home page.

The entire site must share the same standard.

---

# 41. IMPORTANT: IMAGES ARE A SEPARATE WORKSTREAM

Tsvetelin and ChatGPT will create/approve the site imagery separately.

Therefore:

DO NOT delay layout architecture waiting for images.

Instead:

Create the complete design using accurate visual slots.

We will then replace those slots one by one with specifically produced final assets.

Do NOT choose random stock photography as a shortcut.

Do NOT use AI-generated temporary “Genki” machines.

Do NOT invent product packaging.

The visual design must tell us exactly what image each section needs.

---

# 42. REQUIRED VISUAL ASSET OUTPUT

While implementing, maintain a simple visual asset manifest.

For EVERY required image include:

Asset ID
Page
Section
Purpose
Required subject
Desktop ratio
Mobile ratio
Desktop composition
Mobile composition
Safe area
Text overlay yes/no
Background expectations
Real asset / generated asset / product photo / hardware photo / UI
Priority:
P0 launch-critical
P1 important
P2 optional

This manifest will later be used by Tsvetelin + ChatGPT to create the imagery one-by-one.

Do not generate the assets yourself.

---

# 43. FINAL EMOTIONAL TEST

When someone opens Genki 2.0 for the first time, we want:

first 3 seconds:
“Wow, this looks seriously good.”

next 10 seconds:
“I understand what Genki is.”

next 30 seconds:
“This would actually look great in our office.”

next 60 seconds:
“This seems easy for us.”

then:
“I want to see what Genki would look like for our company.”

→ Genki Fit.

The site should create desire BEFORE explaining every detail.

Clarity and desire must coexist.

---

# 44. THE MOST IMPORTANT DESIGN PRINCIPLE

Do not design a website ABOUT smart coolers.

Design a website about:

a better everyday office experience,

enabled by Genki.

The machine is real.
The products are real.
The service is real.

But the emotional product is:

a small part of the workday becoming noticeably better.

---

# 45. DEFINITION OF VISUAL SUCCESS

The website is visually successful when:

- it is unmistakably Genki;
- it feels much more expensive than it actually cost to build;
- it does not look generated from a template;
- the cooler feels premium;
- the food feels desirable;
- the company feels operationally credible;
- HR immediately understands the benefit;
- motion feels exceptionally polished but never distracting;
- mobile feels intentionally designed;
- Genki Fit feels like a standalone product;
- every image has a reason to exist;
- every section has hierarchy;
- the site remains extremely easy to use;
- the experience feels coherent from Home through conversion.

The desired reaction is NOT:

“Nice website.”

The desired reaction is:

“This company clearly knows what it is doing.”

---

# 46. START NOW

First inspect the existing project.

Then briefly state:

1. what visual DNA from the current Genki implementation you are preserving;
2. what design-system changes you will introduce;
3. which files/components you expect to modify;
4. any genuine technical blocker.

Then implement.

Do not reopen the already locked website strategy.

Do not wait for final images.

Use the visual-slot system and build the complete premium experience around it.