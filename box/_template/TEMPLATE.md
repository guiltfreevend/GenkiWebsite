# Box Page Template

This folder will contain the reusable `index.html` template for generating personalized Genki Box landing pages.

## Status: PENDING

The template will be finalized after the owner reviews the 4 test variants and picks his favorite layout:

- `box/GK-TEST01/` — Symmetric top, horizontal band, math blend
- `box/GK-TEST02/` — Diagonal descending, diagonal band, math blend
- `box/GK-TEST03/` — Diagonal ascending, diagonal band, math blend
- `box/GK-TEST04/` — Symmetric top, horizontal band, smart blend

## Next steps

1. Owner picks a variant
2. Winning variant becomes the basis for `index.html` in this folder
3. Placeholders (`{{COMPANY}}`, `{{BRAND_COLOR}}`, `{{LOGO_PATH}}`, etc.) replace hardcoded values
4. A generator script uses this template + company assets to produce real pages
