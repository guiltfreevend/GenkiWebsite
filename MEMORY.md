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
