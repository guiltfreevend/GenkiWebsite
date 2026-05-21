# Genki Website - Project Context

## Master Memory System (MANDATORY)
1. **At the START of every session** — read `/mnt/c/projects/HANDOFF.md` and `/mnt/c/projects/MEMORY.md`. Also read `HANDOFF.md` in the project root. Summarize the current state before doing anything else.
2. **After EVERY completed task** — update both the project-specific files (`HANDOFF.md`, `MEMORY.md`) AND the master files at `/mnt/c/projects/HANDOFF.md` and `/mnt/c/projects/MEMORY.md`. MEMORY.md is append-only — never delete or summarize old entries.

## What is Genki?
B2B wellness benefits company based in Sofia, Bulgaria. Delivers healthy snacks & drinks to offices. Three pillars: Health, Local sourcing, monthly Charity donations. Pre-launch phase - no customers yet.

## Tech Stack
- **Static HTML** site (11 active pages) hosted on **Cloudflare Pages** (project: `genkiwebsite`)
- **Tailwind CSS** via CDN (pinned to v3.4.17) - config in `js/tailwind-config.js`
- **Lucide icons** via CDN (pinned to v0.344.0)
- **Custom CSS** in `css/custom.css` (CSS variables, component styles, animations)
- **i18n**: Custom system using `data-i18n` attributes + `js/translations.js` (BG default, EN alternate)
- **Forms**: Cloudflare Worker (`https://genki-email.tsvetelin-sotirov.workers.dev`) on office.html; Formspree on contact.html
- **Email**: Resend API (from `hello@genki.bg`, domain verified, API key in Worker secret `RESEND_API_KEY`)
- **Clean URLs**: Cloudflare Pages + `_headers` for cache control
- **Domain**: `www.genki.bg`
- **Repo**: GitHub `guiltfreevend/GenkiWebsite`, auto-deploys on push to `main`

## File Structure
```
/ (root = Cloudflare Pages publish directory)
  index.html          - Homepage (main landing page)
  companies.html      - B2B sales page with pricing tiers
  mission.html        - Three pillars + "Why Genki?" etymology
  contact.html        - Contact form (Formspree)
  office.html         - B2B ROI landing page with Cloudflare Worker form
  privacy.html        - Privacy policy (Bulgarian)
  privacy-en.html     - Privacy policy (English)
  thank-you-contact.html      - Post-contact thank you (noindex)
  thank-you-coming-soon.html  - Post-signup thank you (noindex)
  roi-calculator.html         - Internal ROI tool (noindex)
  404.html            - Branded 404 error page (noindex)
  sitemap.xml         - 5 indexable pages
  robots.txt          - Allows all, disallows utility pages
  _headers            - Cloudflare Pages cache control headers
  netlify.toml        - Legacy redirects (may be unused)
  CNAME               - www.genki.bg
  css/custom.css      - Custom styles, CSS variables
  js/main.js          - Navigation, animations, form validation
  js/translations.js  - All BG/EN translation strings (~43K tokens)
  js/tailwind-config.js - Shared Tailwind theme config
  assets/images/      - Logos (genki_logo.png, genki_logo_light.png)
  assets/icons/       - Favicons
  Backups/            - Old/orphan files (not deployed)
```

## SEO Setup (completed)
- All pages have `<link rel="canonical">` with clean URLs
- Open Graph + Twitter Card meta tags on all pages
- JSON-LD structured data: Organization + WebSite on index.html, BreadcrumbList on 4 other pages
- `<html lang="bg">` on all pages except privacy-en.html (lang="en")
- `<meta name="robots" content="noindex, nofollow">` on utility/thank-you pages
- sitemap.xml with 5 indexable pages
- robots.txt with proper disallow rules

## Deploy Workflow (CRITICAL — follow exactly)
The site deploys to **Cloudflare Pages** via **Wrangler CLI** for instant deploys (~2 seconds).

### Standard deploy steps:
1. **Edit code**
2. **Test locally**: `python3 -m http.server 8765` then open `http://localhost:8765`
3. **Owner approval**: The owner tests locally too. Only deploy when they confirm it's ready.
4. **Commit**: `git add <files> && git commit -m "message"`
5. **Deploy instantly via Wrangler**:
   ```
   npx wrangler pages deploy . --project-name=genkiwebsite --branch=main --commit-dirty=true
   ```
   This uploads files directly to Cloudflare Pages in ~2 seconds. Live immediately.
6. **Push to GitHub** (keeps repo in sync):
   ```
   git push origin main
   ```

### Key rules:
- **Wrangler for speed**: Always use Wrangler CLI to deploy. Do NOT rely on GitHub auto-deploy for quick iterations.
- **Git push for sync**: Always push to GitHub after deploying so the repo stays in sync.
- **Rollbackable commits**: Every logical change gets its own commit. Never bundle unrelated changes.
- **Never auto-push**: Do NOT push/deploy unless the owner explicitly says to.
- **Cache headers**: `_headers` file ensures HTML is never cached — deploys are instantly visible to visitors.
- **Wrangler auth**: `CLOUDFLARE_API_TOKEN` is set in `~/.zshrc`. If it stops working, create a new token at https://dash.cloudflare.com/profile/api-tokens (use "Edit Cloudflare Workers" template).

## Known Architecture Decisions
- **Header/footer is duplicated** across all HTML files (~170 lines each). This is intentional for now (no build step). When updating nav links or footer content, you MUST update ALL 9 active HTML files.
- **Tailwind config is externalized** to `js/tailwind-config.js` - single source of truth for the color palette.
- **CDN versions are pinned** - do not use `@latest` for any CDN dependency.
- **Orphan pages** (index-main.html, index-coming-soon.html) have been moved to `Backups/`.

## Header/Footer Update Checklist
When changing the navigation, header, or footer, update these 9 files:
1. index.html
2. companies.html
3. mission.html
4. contact.html
5. privacy.html
6. privacy-en.html
7. thank-you-contact.html
8. thank-you-coming-soon.html
9. roi-calculator.html

## Improvement Roadmap
Completed:
- [x] SEO Readiness (D -> B+): OG tags, canonical URLs, JSON-LD, sitemap, robots.txt
- [x] Technical Foundation - Minimalist pass (C -> B-): Pinned CDNs, extracted config, fixed Formspree bug, cleaned orphans
- [x] Technical Hardening (pending local test): Security headers, ARIA accessibility, scroll throttling, CSS cleanup, 404 page, prefers-reduced-motion

Future (post-launch):
- [ ] Technical Foundation - Pragmatist upgrade: PostHTML includes for shared partials, Tailwind CLI build, src/dist separation (~4-6 hours)
- [ ] Social Proof / Trust: Add testimonials, case studies, partner logos (needs real customers first)
- [ ] Production Readiness: Create 1200x630 OG share image, add analytics, add social media links to Organization schema
- [ ] Consider Astro SSG migration if site grows beyond 10-15 pages

## Color Palette
- **Primary (green)**: #2d8659 (500) - main brand color
- **Forest (dark green)**: #1e5128 (700) - dark accents
- **Secondary (teal)**: #14b8a6 (500) - secondary accents
- **Accent (cream)**: #f5f5dc (200) - warm backgrounds
- **Amber**: #f59e0b (500) - highlights, badges

## Locked Copy Rules — 2026-05-11

These rules supersede all earlier copy guidance in HANDOFF.md, MEMORY.md, and AUDIT_FIXES.md. Apply consistently across every page, every translation key, every email template, and every internal doc.

**RULE 1 — De-doubling.** No claim appears in more than one of {heading, subhead, bullet list} within the same component. Keep the brand-name version of any claim; delete the count-version and the generic-quality version when they coexist with brand names.

**RULE 2 — CTA unification.** Every CTA button on the site reads exactly "Запазете консултация" (BG) / "Book a consultation" (EN). No durations anywhere — not in buttons, not in subtext, not in form headings, not in step labels, not in email body. Subtext describes what the conversation is about, not how long it takes.
- Default BG subtext template: "Кратък разговор, в който разглеждаме нуждите на екипа Ви и подходящата конфигурация."
- Default EN subtext template: "A short conversation about your team's needs and the right configuration."

**RULE 3 — Dietary.** Genki guarantees exactly one nutritional promise: the wellness filter (no palm oil, HFCS, artificial sweeteners, artificial colors, hydrogenated fats, MSG). Specific dietary tracks (vegan, vegetarian, gluten-free, lactose-free, nut-free, keto) are NEVER promised. Replace, don't soften.
- BG canonical answer: "Всички продукти преминават през единен wellness филтър — без палмово масло, царевичен сироп, изкуствени подсладители, оцветители или хидрогенирани мазнини. Специфични диети (веган, без глутен, кето и т.н.) не са гарантирани в текущата ни селекция."
- EN canonical answer: "All products pass a single wellness filter — no palm oil, HFCS, artificial sweeteners, artificial colors, or hydrogenated fats. Specific dietary tracks (vegan, gluten-free, keto, etc.) are not guaranteed in the current selection."

**RULE 4 — Meals / fresh food.** v1 has no fresh food. Snacks and drinks only. Categories are TREAT / CRUNCH / REFRESH. No "coming soon" placeholders — promising future capability creates the same trust risk we're eliminating. Strip clean. Add it back when it ships, not before.
- TREAT — вафли, курабийки, шоколадови бонбони / waffles, cookies, chocolate
- CRUNCH — солети, крекери / pretzels, crackers
- REFRESH — комбуча, студени чайове, газирани, енергийни напитки (250ml) / kombucha, iced teas, sodas, energy drinks (250ml)
