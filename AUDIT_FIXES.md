# Genki Website — Premium Audit Fix List

Master tracking doc for the full-site polish pass. Goal: Apple-premium aesthetic + max SEO score + tight performance.

**Scope:** all changes possible without new photography. Real product/team photography is parked until first pilot client.

**Status legend:** ⬜ pending · 🔄 in progress · ✅ done · 🅿️ parked (needs decision/asset)

---

## A. Critical performance & technical

| # | Item | Status |
|---|---|---|
| A1 | Add `&display=swap` to Google Fonts on every page | ⬜ |
| A2 | Add full security header set to `_headers` (CSP, X-Frame-Options, Referrer-Policy, HSTS, Permissions-Policy) | ⬜ |
| A3 | Split `translations.js` (144 KB) into `bg.js` + `en.js`, lazy-load only the active language | ⬜ |
| A4 | Update `_headers` so `/js/*` uses `immutable` since filenames are versioned (or strip `?v=` query strings) | ⬜ |
| A5 | Pre-compile Tailwind via Tailwind CLI binary (eliminates JIT runtime, cuts ~200KB blocking JS) | 🅿️ needs deploy-pipeline confirmation |

## B. SEO

| # | Item | Status |
|---|---|---|
| B1 | Add `hreflang` BG ↔ EN on `privacy.html` / `privacy-en.html` | ⬜ |
| B2 | Refresh `sitemap.xml`: update `lastmod` to today, add missing pages, drop priority-leaks | ⬜ |
| B3 | Trim 75-char homepage `<title>` to 50–60 chars | ⬜ |
| B4 | Write unique meta descriptions for each top-level page (currently mostly identical) | ⬜ |
| B5 | Add `og:image:alt` to every page (currently only on index.html) | ⬜ |
| B6 | Add `LocalBusiness` schema (NAP) to every public page | ⬜ |
| B7 | Add `FAQPage` schema to companies.html FAQ section | ⬜ |
| B8 | Align `robots.txt` with `noindex` meta tags (privacy.html inconsistency) | ⬜ |
| B9 | Audit `roi-calculator.html` for multiple H1s | ⬜ |

## C. Visual / Apple-premium polish

| # | Item | Status |
|---|---|---|
| C1 | Desaturate green palette in `tailwind-config.js` + `custom.css` (~20% less saturated) | ⬜ |
| C2 | Remove animated blob backgrounds (`custom.css:103-148`) | ⬜ |
| C3 | Remove shimmer animation on `.btn-primary` (`custom.css:188-217`) | ⬜ |
| C4 | Remove border-pulse animation on `.btn-secondary` (`custom.css:235-258`) | ⬜ |
| C5 | Reduce card shadow opacity from `0.1` to `0.04` for premium subtlety | ⬜ |
| C6 | Tighten button padding/proportion; remove `scale(1.02)` on hover | ⬜ |
| C7 | Scale up homepage hero H1 (`text-7xl` + `tracking-tight`) | ⬜ |
| C8 | Standardize border-radius token across cards / buttons / badges | ⬜ |
| C9 | Replace flag emojis 🇧🇬 🇬🇧 with text labels (BG/EN) — consistent across all pages | ⬜ |
| C10 | Audit and remove other emoji used as UI elements | ⬜ |
| C11 | Reduce gradient usage — remove gradient-text where it competes; keep one hero gradient max | ⬜ |
| C12 | Tighten heading line-height to `1.15` for confident hero feel | ⬜ |
| C13 | Reduce card hover lift from `translateY(-4px/-8px)` to `translateY(-2px)` (subtler) | ⬜ |

## D. Copy

| # | Item | Status |
|---|---|---|
| D1 | Homepage H1 — replace "Better energy. A stronger team." with concrete promise | ⬜ |
| D2 | Homepage hero subhead — strip "premium wellness infrastructure" jargon | ⬜ |
| D3 | Mission page H1 — replace "Triple Impact" with concrete outcomes | ⬜ |
| D4 | Standardize all CTAs to one phrase ("Book a 20-min demo") | ⬜ |
| D5 | Reword "0 X" stat phrasing (e.g. "0 Harmful Ingredients" → "No harmful ingredients") | ⬜ |
| D6 | Companies page — replace "Managed Wellness Infrastructure" headline with action verb | ⬜ |
| D7 | Bulgarian copy polish — flag and rewrite strings that read as translated | ⬜ |

## E. Accessibility

| # | Item | Status |
|---|---|---|
| E1 | Add skip-to-content link on every page | ⬜ |
| E2 | Wrap scroll-animation observer in `prefers-reduced-motion` check (`main.js`) | ⬜ |
| E3 | Verify body-text + CTA contrast meets WCAG AA after green desaturation | ⬜ |

## F. Analytics / measurement

| # | Item | Status |
|---|---|---|
| F1 | Add `umami.track()` calls on form submits | ⬜ |
| F2 | Add `umami.track()` on primary CTA clicks ("Book demo") | ⬜ |

## G. Parked (needs assets / external decision)

- Real OG share image (1200×630) — needs design pass in Figma/Canva
- Real product / team / station photography — first pilot client
- WebP/AVIF image delivery — depends on having real photography first

---

## Execution order (one logical commit each)

The list will be worked top-to-bottom roughly in this grouping:
1. **A1, A2, A4** — pure-upside performance/security headers
2. **B1–B9** — SEO completeness pass
3. **C1–C13** — visual polish (each as a separate commit so they can be reviewed/rolled back independently)
4. **D1–D7** — copy rewrites
5. **E1–E3** — accessibility hardening
6. **F1–F2** — analytics events
7. **A3** — translations split (mechanical, larger diff)
8. **A5** — Tailwind pre-compilation (architectural — pause for confirmation)
