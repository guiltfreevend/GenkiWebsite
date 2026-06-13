// Genki QR-scan signal — Cloudflare Pages Function.
//
// Served same-origin at POST /api/qr. Replaces the dead WinPath endpoint
// (app.winpathcrm.com/api/genki/signals/qr) that silently dropped every
// scan after the CRM was abandoned.
//
// On each partner-box QR scan the client (box/_shared/box.js and
// box-landing.html) fires a fire-and-forget POST here. We validate the
// landing-page code and email a notification to hello@genki.bg via Resend
// — the same Resend account/domain the email Worker already uses.
//
// Contract:
//   • Accepts JSON { landing_page_code, is_test? }.
//   • landing_page_code must match /^GK-[A-F0-9]{6}$/i, else 400.
//   • Always returns 204 otherwise — a scan signal must never surface an
//     error to the visitor's browser, even if Resend is down.
//
// Env: RESEND_API_KEY — set this on the Cloudflare PAGES project
// (Settings → Environment variables). Note: the email Worker's secret of
// the same name is a separate store and does NOT carry over here.

const CODE_RE = /^GK-[A-F0-9]{6}$/i;

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let data;
    try {
      data = await request.json();
    } catch (e) {
      data = {};
    }

    const rawCode = (data && data.landing_page_code) || '';
    if (!CODE_RE.test(rawCode)) {
      return new Response(JSON.stringify({ error: 'Invalid landing_page_code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const code = rawCode.toUpperCase();
    const isTest = data.is_test === true;

    // Europe/Sofia local time for the notification body.
    let timestamp;
    try {
      timestamp = new Intl.DateTimeFormat('bg-BG', {
        timeZone: 'Europe/Sofia',
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(new Date());
    } catch (e) {
      timestamp = new Date().toISOString();
    }

    const userAgent = request.headers.get('User-Agent') || '—';
    const subject = `${isTest ? '[TEST] ' : '🔔 '}QR SCAN: ${code}`;

    const text = `QR scan signal received.

Code:        ${code}
Test scan:   ${isTest ? 'yes (excluded from real data)' : 'no'}
Time:        ${timestamp} (Europe/Sofia)
User-Agent:  ${userAgent}`;

    const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif; font-size:14px; color:#1f2937; max-width:520px;">
  <h2 style="margin:0 0 16px 0; font-size:18px; color:#1e5128;">${isTest ? '[TEST] ' : ''}QR scan — ${code}</h2>
  <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
    <tr><td style="color:#6b7280;">Code</td><td><strong>${code}</strong></td></tr>
    <tr><td style="color:#6b7280;">Test scan</td><td>${isTest ? 'yes (excluded from real data)' : 'no'}</td></tr>
    <tr><td style="color:#6b7280;">Time</td><td>${timestamp} (Europe/Sofia)</td></tr>
    <tr><td style="color:#6b7280;">User-Agent</td><td>${userAgent}</td></tr>
  </table>
</div>`;

    // Fire the notification. Swallow any failure — the visitor must never
    // see an error from a background scan signal.
    if (env && env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Genki QR <hello@genki.bg>',
            to: 'hello@genki.bg',
            subject,
            text,
            html,
          }),
        });
      } catch (e) {
        // Resend unreachable — ignore, signal is best-effort.
      }
    }
  } catch (e) {
    // Never throw to the client.
  }

  return new Response(null, { status: 204 });
}
