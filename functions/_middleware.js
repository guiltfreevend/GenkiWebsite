// Genki — заключване на сайта зад Coming Soon страницата.
//
// Докато Genki 2.0 се строи, посетител на genki.bg или www.genki.bg трябва
// да вижда само Coming Soon страницата. Старият switch-site.sh правеше това
// с `window.location.href` в <head> на всяка страница — пренасочване от
// страна на браузъра, което се вижда за миг, не работи без JavaScript и
// оставя старото съдържание в source-а. Плюс това скриптът е писан за macOS
// (`sed -i ''`) и на тази машина не се изпълнява, а списъкът му със страници
// е остарял — office.html изобщо не е в него.
//
// Затова гейтът е тук, от страната на сървъра, в същия deployment.
//
// КАКВО НЕ СЕ ПИПА
//   • /api/*   — Pages Functions (живата functions/api/qr.js и записването).
//   • /box*    — ЖИВАТА система за QR кодове по партньорски кутии. 44 папки
//                с landing страници, които се сканират в реалния свят.
//                Заключването на сайта не бива да ги докосва.
//   • всичко, което не е HTML страница — CSS, JS, изображения, шрифтове,
//                robots.txt. Пуска се по разширение, не по списък с папки,
//                защото списъкът винаги изостава от репото.
//   • правните страници — остават достъпни, защото са правни.
//
// ПРЕГЛЕД ОТ СОБСТВЕНИКА
//   Ако на Pages проекта е зададена променливата PREVIEW_TOKEN, отварянето
//   на https://www.genki.bg/?preview=<стойността> слага бисквитка и пуска
//   пълния сайт за този браузър. Без зададена променлива обходен път няма.
//
// ИЗКЛЮЧВАНЕ НА ГЕЙТА
//   Задайте COMING_SOON = '0' на Pages проекта. Файлът може да остане.

const COOKIE = 'genki_preview';

// Страници, които остават публични въпреки гейта.
const ALLOW = new Set([
  '/privacy',
  '/privacy.html',
  '/privacy-en',
  '/privacy-en.html',
  '/thank-you-coming-soon',
  '/thank-you-coming-soon.html',
  '/coming-soon',
  '/coming-soon.html',
]);

// HTML страница ли е? Pages сервира и чисти URL-и без разширение, затова
// „няма разширение" също значи страница.
function isPage(path) {
  const last = path.slice(path.lastIndexOf('/') + 1);
  if (last === '') return true;                 // /  или  /нещо/
  const dot = last.lastIndexOf('.');
  if (dot === -1) return true;                  // чист URL
  return last.slice(dot).toLowerCase() === '.html';
}

// Изключвателят трябва да работи от първия опит. Стойността се пише на
// ръка в таблото на Cloudflare, а локално .dev.vars я подава с кавичките —
// затова не се разчита на точно съвпадение с един-единствен низ.
function isOff(value) {
  if (value == null) return false;
  const v = String(value).trim().replace(/^["']|["']$/g, '').toLowerCase();
  return v === '0' || v === 'false' || v === 'off' || v === 'no';
}

function hasPreview(request, token) {
  if (!token) return false;
  const raw = request.headers.get('Cookie') || '';
  return raw.split(';').some((c) => c.trim() === COOKIE + '=' + token);
}

export async function onRequest(context) {
  const { request, env, next } = context;

  if (isOff(env && env.COMING_SOON)) return next();

  const url = new URL(request.url);
  const path = url.pathname;

  // Functions и живата box система — преди всичко останало.
  if (
    path.startsWith('/api/') ||
    path === '/box' ||
    path.startsWith('/box/') ||
    path === '/box-landing' ||
    path === '/box-landing.html'
  ) {
    return next();
  }

  // Статични активи минават по разширение.
  if (!isPage(path)) return next();

  const token = env && env.PREVIEW_TOKEN;

  // Ключът в адреса слага бисквитката и връща човека на същата страница.
  if (token && url.searchParams.get('preview') === token) {
    url.searchParams.delete('preview');
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.pathname + (url.search || '') ,
        'Set-Cookie': COOKIE + '=' + token + '; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (hasPreview(request, token)) return next();

  if (ALLOW.has(path)) return next();

  // Началото сервира Coming Soon страницата на място — без пренасочване,
  // за да не се получи безкраен цикъл и адресът да си остане genki.bg.
  if (path === '/' || path === '/index.html') {
    if (env && env.ASSETS) {
      const res = await env.ASSETS.fetch(new URL('/coming-soon.html', url));
      return new Response(res.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, must-revalidate',
        },
      });
    }
    return next();
  }

  // Всяка друга страница се връща в началото.
  return new Response(null, {
    status: 302,
    headers: { Location: '/', 'Cache-Control': 'no-store' },
  });
}
