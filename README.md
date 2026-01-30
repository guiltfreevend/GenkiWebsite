# Genki - Wellness Benefits for Modern Companies

A premium employee wellness benefit platform providing healthy snacks, drinks, and meals to IT companies in Bulgaria.

## About Genki

Genki partners with forward-thinking companies to deliver curated healthy food options directly to their offices. We focus on three core pillars:

1. **Healthy & Bio Products** - Carefully selected nutritious options
2. **Supporting Bulgarian Businesses** - 100% locally sourced products
3. **Giving Back** - 10% of monthly revenue donated to charity

## Tech Stack

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Optimized for Cloudflare Pages deployment

## Project Structure

```
├── index.html          # Home page
├── companies.html      # For Companies (B2B)
├── mission.html        # Our Mission
├── products.html       # Product Portfolio
├── contact.html        # Contact & Call Booking
├── css/
│   └── custom.css      # Custom styles
├── js/
│   └── main.js         # Main JavaScript
└── assets/
    ├── images/         # Image assets
    └── icons/          # Icon assets
```

## Development

Simply open `index.html` in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Deployment

This project is optimized for Cloudflare Pages:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build output directory to `/` (root)
3. No build command needed (static site)

## License

Copyright © 2026 Genki. All rights reserved.
