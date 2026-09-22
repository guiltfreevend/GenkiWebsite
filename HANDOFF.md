# Genki Website — Handoff

## Current Focus

**Живият сайт е ЗАКЛЮЧЕН зад Coming Soon страница** (2026-09-20), докато Genki 2.0 се строи в клона `genki-2.0-build`.

## Как работи заключването

`functions/_middleware.js` е Pages Function, която гейтва всяка заявка:

- `/` и `/index.html` → сервират `coming-soon.html` на място, без пренасочване
- всяка друга страница → 302 към `/`
- **НЕ се пипат:** `/api/*`, `/box` и `/box/<КОД>/` (живата QR система за партньорски кутии), правните страници, и всичко, което не е HTML (по разширение)

**Изключва се с `COMING_SOON=0`** на Pages проекта — не чрез редакция на файлове.
**Преглед на пълния сайт:** задай `PREVIEW_TOKEN` на Pages проекта, после отвори `https://www.genki.bg/?preview=<стойността>`. Слага бисквитка за 7 дни.

## ⚠ НЕ пускай `switch-site.sh`

Старият скрипт е **отменен и опасен**. Копира `index-coming-soon.html` върху `index.html` и слага `window.location.href` редиректи в другите страници — бие се с middleware-а и разваля живия `index.html`.

На Windows не се изпълняваше (писан е за macOS `sed -i ''`), **но на MacBook ще се изпълни.** Не го пускай.

## Recently Completed

- 2026-09-20: **Timezone стандарт — `Europe/Sofia`.** `lib/genki-time.js` е каноничният модул. Имейлите показваха суров UTC ISO. Виж `CLAUDE.md` → „Genki Business Timezone".
- 2026-09-20: **`functions/api/subscribe.js`** — записването от Coming Soon минава през собствен Resend, не през Formspree. Реално тествано, доставя до `hello@genki.bg`.
- 2026-09-20: **`functions/api/contact.js`** — backend-ът на формата за контакт от 2.0 е на production и е реално тестван. **UI-ят НЕ е публикуван.**
- 2026-09-20: **Заключване на сайта** зад Coming Soon.
- 2026-09-20: Cloudflare Access защитава preview deployment-ите; `GENKI_RATE` KV binding е вързан.

## In Progress

Нищо недовършено на `main`.

На `genki-2.0-build`: етапи 1–6 са готови и одобрени. **Следващ е етап 7 — Genki Fit.** Не е започнат.

## Deployment

Проектът е GitHub-connected: **push към `main` пуска автоматичен production deployment** (~30 секунди). Wrangler CLI не е нужен и на тази машина няма credentials.

Маркер, че новият deployment е жив: поискай файл, който съществува само в него.

## Променливи на Pages проекта (Production)

| | |
| --- | --- |
| `RESEND_API_KEY` | encrypted secret. Задължителен — без него формите връщат `not_configured` и НЕ твърдят успех |
| `GENKI_RATE` | KV binding, ограничение на честотата |
| `GENKI_SCANS` | KV binding за броене на сканиранията |
| `PREVIEW_TOKEN` | по желание, за преглед на пълния сайт |
| `COMING_SOON` | `0` изключва гейта |

Променливите влизат в сила **при следващия deployment**, не веднага.

## ⚠ Остава да се направи

**Ротирай стария Resend ключ.** `RESEND-SETUP.md` е бил комитнат с истински ключ в commit `d644fc6`; файлът е изтрит, но ключът остава в историята на публичното репо.

## Up Next

- Етап 7 — Genki Fit (на `genki-2.0-build`)
- Cut-over на Genki 2.0 към `main`, когато е готов

## Important Context

- Pre-launch — няма клиенти
- Box/QR системата е ЖИВА и не бива да се чупи
- CDN версиите са пинати — никога `@latest`
- Тестове: `node tools/dev/test-time.mjs`, `test-qr-time.mjs`, `test-lock.mjs`, `test-contact.mjs`; в браузър — `tools/dev/test-coming-soon-*.html` през локален сървър
