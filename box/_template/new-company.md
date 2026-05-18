# Adding a New Company to /box/

When the user gives you a new company (logo + name + one-line description), do exactly this:

```
1. Generate a new slug:
   - Format: GK-XXXXXX (GK- prefix + 6 uppercase hex characters)
   - Check no collision with existing slugs in /box/

2. Confirm what the company does in one verb phrase:
   - Ask user if unclear. Example phrases: "Stripe processes payments", "Spotify streams music"
   - Keep it active voice, present tense, no jargon

3. Generate personal section copy using the formula:
   - HEADLINE: "[Company] [their verb-phrase]. Genki [our matching verb-phrase]."
   - The two halves should mirror each other rhythmically. Same length, same cadence.
   - Body: 3 sentences:
     1. Restate what they do, more specifically
     2. Position Genki as the complementary layer
     3. End with "Помислихме си — би трябвало да [говорим / изградим нещо заедно]."

4. Generate the hero subtitle:
   - Pattern: "Вие [what you do, with possessive]. Ние [what we do, with possessive]."
   - Two short clauses, em-dash optional
   - 15 words max total

5. Save the logo:
   - SVG preferred, save to /box/_shared/logos/{slug-lowercase}.svg
   - If only PNG available, save as {slug-lowercase}.png and update template img src

6. Create /box/GK-XXXXXX/index.html by copying template.html
   - Replace all {{double-brace}} placeholders
   - Keep the static parts (pillars, final CTA) untouched

7. Test locally:
   - Run `wrangler pages dev` or local server
   - Open http://localhost:8765/box/GK-XXXXXX
   - Verify: animations fire on load, scroll-fade works, Calendly loads, language toggle swaps text

8. Show user the rendered page BEFORE committing.
   - Don't push until user confirms it looks right.
```

## Placeholder reference

The template has these `{{placeholders}}` to replace:

- `{{COMPANY_NAME}}` — Display name, e.g. `OfficeRnD`, `Shelly Group`
- `{{COMPANY_SLUG}}` — Lowercase filename slug, e.g. `officernd`, `shelly`
- `{{HERO_SUB_BG}}` / `{{HERO_SUB_EN}}` — Hero subtitle in both languages
- `{{PERSONAL_HEADLINE_BG}}` / `{{PERSONAL_HEADLINE_EN}}` — Personal section h2
- `{{PERSONAL_BODY_BG}}` / `{{PERSONAL_BODY_EN}}` — Personal section body paragraph

Static across all pages: hero CTA, scroll cue, pillars, final CTA, footer.
