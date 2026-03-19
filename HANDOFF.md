# Genki Website — Handoff

## Current Focus
Pre-launch B2B wellness website. Recent work on office landing page calculator improvements.

## Recently Completed
- Synced all local changes to GitHub
- Added break hours saved display to companies.html and office.html calculators
- Removed link to password-protected ROI calculator from office landing page
- Updated savings range to €280K–5.7M on office landing page
- Aligned office.html calculator defaults with ROI calculator

## In Progress
- No partially done work known at this time

## Up Next
- Technical Foundation — Pragmatist upgrade (PostHTML includes, Tailwind CLI build, src/dist separation)
- Social Proof / Trust (needs real customers first — post-launch)
- Production Readiness (OG share image, analytics, social media links)
- Consider Astro SSG migration if site grows beyond 10-15 pages

## Important Context
- Pre-launch phase — no customers yet
- 12 active HTML pages with duplicated header/footer (~170 lines each) — must update ALL pages when changing nav/footer
- Deploys via Wrangler CLI to Cloudflare Pages (instant ~2s deploys)
- SEO setup is complete (OG tags, canonical URLs, JSON-LD, sitemap, robots.txt)
- CDN versions are pinned — never use @latest
- i18n: BG default, EN alternate via data-i18n attributes
