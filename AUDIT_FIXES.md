# Genki Website — Premium Audit Fix List

Master tracking doc for the full-site polish pass. Goal: Apple-premium aesthetic + max SEO score + tight performance.

**Status legend:** ⬜ pending · ✅ done · 🅿️ parked

---

## A. Critical performance & technical

| # | Item | Status | Notes |
|---|---|---|---|
| A1 | `&display=swap` on Google Fonts | ✅ | already present on every active page |
| A2 | Full security header set in `_headers` | ✅ | CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| A4 | `/js/*` cache headers | ✅ | kept `no-cache` — pages don't all version their JS query strings, switching to immutable would risk stale code |
| A3 | Split `translations.js` into bg.js + en.js | 🅿️ | wire size already only 36.6 KB (Brotli-compressed from 147 KB). Splitting saves ~15-18 KB at meaningful refactor cost; defer until live traffic justifies it |
| A5 | Pre-compile Tailwind via CLI binary | 🅿️ | architectural deploy-pipeline change; needs owner approval |

## B. SEO

| # | Item | Status |
|---|---|---|
| B1 | hreflang BG ↔ EN on privacy pair | ✅ |
| B2 | Refresh sitemap.xml lastmod | ✅ |
| B3 | Trim 75-char homepage title to 59 chars | ✅ |
| B4 | Unique meta/OG/Twitter descriptions per page | ✅ |
| B5 | og:image:alt on every page with OG tags | ✅ |
| B6 | LocalBusiness JSON-LD on homepage | ✅ |
| B7 | FAQPage schema on companies.html | ✅ |
| B8 | robots.txt aligned with noindex tags (drop dead routes, add /office, /box/) | ✅ |
| B9 | roi-calculator H1 uniqueness (demoted password gate to H2) | ✅ |

## C. Visual / Apple-premium polish

| # | Item | Status | Notes |
|---|---|---|---|
| C1 | Desaturate green palette | 🅿️ | brand-touching; logo uses forest #1e5128 — needs owner approval before shifting #2d8659 |
| C2 | Remove blob animations | ✅ |
| C3 | Remove btn-primary shimmer | ✅ |
| C4 | Remove btn-secondary border-pulse | ✅ |
| C5 | Soften card shadows (0.1 → 0.04 opacity) | ✅ |
| C6 | Refine button proportions (tighter padding, no scale on hover) | ✅ |
| C7 | Scale up hero H1 (text-7xl + tracking-tight + leading-[1.1]) | ✅ |
| C8 | Standardize border-radius via CSS vars | ✅ |
| C9 | Replace flag emojis with text labels | ✅ |
| C10 | Replace emoji-as-icons in office.html with Lucide SVG | ✅ |
| C11 | Reduce gradient usage (kept only hero highlight) | ✅ |
| C12 | Tighten heading line-height (1.2 → 1.15) + tracking | ✅ |
| C13 | Soften card hover lift (-8px → -2px) | ✅ |

## D. Copy

| # | Item | Status |
|---|---|---|
| D1 | Homepage H1 → "Healthier workdays for your team. / Delivered." | ✅ |
| D2 | Homepage subhead — drop "premium wellness infrastructure" | ✅ |
| D3 | Mission H1 → "Healthy people. Local producers. Real charity." | ✅ |
| D4 | All CTAs → "Book a 20-min demo" / "Запази 20-мин демо" | ✅ |
| D5 | "0 Admin Burden" → "0 Hidden fees" | ✅ |
| D6 | Companies hero → "Wellness your team uses. Every workday." | ✅ |
| D7 | Bulgarian copy native polish | 🅿️ | requires native speaker pass; flag for owner |

## E. Accessibility

| # | Item | Status |
|---|---|---|
| E1 | Skip-to-content link on every page | ✅ |
| E2 | Respect prefers-reduced-motion in JS scroll observer | ✅ |
| E3 | WCAG AA contrast spot-check after green desaturation | 🅿️ | depends on C1 |

## F. Analytics

| # | Item | Status |
|---|---|---|
| F1 | Umami `form_submit` event in `handleFormSubmit` | ✅ |
| F2 | `data-umami-event="cta_book_demo"` on btn-primary CTAs | ✅ |

## G. Parked (needs assets / owner decision)

- **C1** Green palette desaturation — needs alignment with logo brand
- **A5** Tailwind pre-compilation — changes deploy pipeline; needs owner approval
- **A3** Translations split — would only save 15-18 KB at real refactor cost
- **D7** Bulgarian native-copywriter pass
- **E3** WCAG AA contrast verification (depends on C1)
- **OG image** real 1200×630 share image (currently the square logo)
- **Real photography** — hero imagery, products, stations (parked at user request)

---

## Ship summary

**Commits made on `main` during this audit pass:**

1. Security headers (CSP, HSTS, etc.)
2. hreflang BG↔EN privacy
3. Sitemap refresh
4. Trim homepage title
5. Unique per-page meta descriptions
6. og:image:alt on all pages
7. LocalBusiness schema
8. FAQPage schema
9. robots.txt cleanup
10. Single-H1 fix on roi-calculator
11. Remove blob animations
12. Remove btn shimmer + border pulse + softer shadows + button refinement + radius standardization + heading tracking + softer card hover (one CSS sweep)
13. Strip flag emojis
14. Replace emoji icons in office.html with Lucide
15. Homepage H1 + subhead rewrite
16. Mission H1 rewrite
17. Companies hero rewrite
18. Standardize CTAs
19. Skip-to-content links
20. prefers-reduced-motion in JS
21. Umami form + CTA tracking
22. CSS cache-buster bump

All deployed to GitHub `main` → Cloudflare Pages auto-deploys.

---

## SUPERSEDED — 2026-05-11

The CTA + dietary + meals decisions previously recorded in this file (rows B9, D4, F2 above, plus any other historical mention of "demo" wording) are **SUPERSEDED** by the 2026-05-11 site-wide audit and remediation. See `Backups/2026-05-11-website-audit.md` for the audit findings and `CLAUDE.md` → "Locked Copy Rules — 2026-05-11" for the new authoritative copy guidance.

Specifically:
- "All CTAs → Book a 20-min demo / Запази 20-мин демо" (D4 above) is REVERSED. Current standard is "Book a consultation" / "Запазете консултация" — no durations anywhere.
- The dietary-accommodation FAQ answer is REPLACED with the wellness-filter canonical (no vegan/gluten-free guarantees).
- Meals / Fresh / Genki Meals copy is REMOVED from current pages — v1 ships snacks + drinks only.
