// Cloudflare Pages Function — serve box-landing.html for every /box/* path.
//
// Pages Functions are evaluated BEFORE `_redirects` and BEFORE Cloudflare
// Pages' auto clean-URL normalisation, so this is the only reliable way
// to keep `/box/[CODE]` in the URL bar (so the page JS can read the code
// from location.pathname) while still serving a static HTML body.
//
// Filename routing: `[[code]]` is a Pages catch-all, matching every
// non-empty path segment under /box/. /box itself (no trailing path) is
// covered by the `/box → /box-landing 301` rule in `_redirects`.
//
// The static box-landing.html sits at the repo root; we fetch it as an
// asset and return its body unchanged, plus a same-page Cache-Control so
// the browser doesn't pin a stale copy.

export const onRequest = async ({ request, env }) => {
  const target = new URL(request.url);
  target.pathname = "/box-landing.html";
  const assetResponse = await env.ASSETS.fetch(new Request(target.toString(), request));

  // Clone so we can set our own caching + content-type for HTML.
  const headers = new Headers(assetResponse.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-cache, must-revalidate");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
};
