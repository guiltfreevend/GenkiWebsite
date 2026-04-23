# Company Logos

Drop company logo files here before generating a Genki Box page.

## Naming convention

File names must contain the company name (case-insensitive). Examples:
- `acme.png`
- `Acme-logo.svg`
- `acme_technologies_transparent.png`

When you tell Claude Code "generate a box page for Acme", it will search this folder for any file containing `acme` in the name and use the first match.

## Format requirements

- **Transparent background strongly preferred** (PNG or SVG)
- Minimum resolution: 400x400 for PNG
- The logo should be the brand's primary mark — not a wordmark-only version unless that IS the primary mark

## What Claude Code does with the logo

1. Extracts 3 dominant color candidates
2. Asks you to confirm which one is the brand's primary color
3. Uses that color to generate the partnership gradient with Genki's forest green
4. Embeds the logo in the top-right corner of the generated page
