// Genki QR-scan signal — Cloudflare Pages Function.
//
// Served same-origin at POST /api/qr. On each partner-box QR scan the
// client (box/_shared/box.js and box-landing.html) fires a
// fire-and-forget POST here. We validate the landing-page code and email
// a branded notification to hello@genki.bg via Resend.
//
// The email is designed to be human and beautiful — it names the partner
// company, describes the device in plain language (phone / computer +
// OS + browser), shows the local time, the approximate location, and a
// running scan count.
//
// Contract:
//   • Accepts JSON { landing_page_code, is_test? }.
//   • landing_page_code must match /^GK-[A-F0-9]{6}$/i, else 400.
//   • Always returns 204 otherwise — a scan signal must never surface an
//     error to the visitor's browser, even if Resend is down.
//
// Env:
//   • RESEND_API_KEY — Resend key (Pages project env var). Required for mail.
//   • GENKI_SCANS    — optional KV namespace binding. When bound, scans
//                      are counted per code; without it the count shows
//                      "—" and everything else still works.

const CODE_RE = /^GK-[A-F0-9]{6}$/i;

// Partner code → display name. Mirror of the box registry.
const COMPANIES = {
  'GK-7EFDC3': 'Paynetics',
  'GK-CD2799': 'LimeChain',
  'GK-52D225': 'Software Group',
  'GK-D334DA': 'Accedia',
  'GK-48CEBE': 'EGT Digital',
  'GK-063FB5': 'Pontica Solutions',
  'GK-0D1141': 'Milestone Systems',
  'GK-F1F1C6': 'Amusnet',
  'GK-AEEEDB': 'Nexo',
  'GK-1D9B3B': 'Scalefocus',
  'GK-9DF086': 'Dreamix',
  'GK-42DB3C': 'AMPECO',
  'GK-0AF789': 'Businessmap',
  'GK-C0CC7E': 'EnduroSat',
  'GK-77D809': 'OfficeRnD',
  'GK-7258D2': 'Shelly Group',
  'GK-7B06E3': 'SiteGround',
  'GK-273195': 'Chaos',
  'GK-22C9E0': 'Payhawk',
};

// Turn a raw User-Agent into a plain-language device summary.
// Returns { kind, icon, device, browser } — no machine strings.
function describeDevice(ua) {
  ua = ua || '';
  const has = (re) => re.test(ua);

  // ── Device + OS ──
  let kind = 'Computer';
  let icon = '💻';
  let device = 'Computer';

  if (has(/iPhone/)) {
    kind = 'Phone'; icon = '📱';
    const m = ua.match(/OS (\d+)[_.](\d+)/);
    device = m ? `iPhone · iOS ${m[1]}.${m[2]}` : 'iPhone';
  } else if (has(/iPad/)) {
    kind = 'Tablet'; icon = '📱'; device = 'iPad';
  } else if (has(/Android/)) {
    if (has(/Mobile/)) { kind = 'Phone'; icon = '📱'; device = 'Android phone'; }
    else { kind = 'Tablet'; icon = '📱'; device = 'Android tablet'; }
  } else if (has(/CrOS/)) {
    kind = 'Computer'; icon = '💻'; device = 'Chromebook';
  } else if (has(/Macintosh|Mac OS X/)) {
    kind = 'Computer'; icon = '💻'; device = 'Mac (laptop or desktop)';
  } else if (has(/Windows/)) {
    kind = 'Computer'; icon = '🖥️'; device = 'Windows PC';
  } else if (has(/Linux/)) {
    kind = 'Computer'; icon = '🖥️'; device = 'Linux PC';
  } else {
    device = 'Unknown device';
  }

  // ── Browser ──
  let browser = 'Browser';
  if (has(/Edg\//)) browser = 'Edge';
  else if (has(/OPR\/|Opera/)) browser = 'Opera';
  else if (has(/SamsungBrowser/)) browser = 'Samsung Internet';
  else if (has(/CriOS/)) browser = 'Chrome';
  else if (has(/FxiOS/)) browser = 'Firefox';
  else if (has(/Firefox/)) browser = 'Firefox';
  else if (has(/Edg|Chrome\//) && !has(/Edg\//)) browser = 'Chrome';
  else if (has(/Version\/.*Safari/)) browser = 'Safari';

  return { kind, icon, device, browser };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let data;
    try { data = await request.json(); } catch (e) { data = {}; }

    const rawCode = (data && data.landing_page_code) || '';
    if (!CODE_RE.test(rawCode)) {
      return new Response(JSON.stringify({ error: 'Invalid landing_page_code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const code = rawCode.toUpperCase();
    const isTest = data.is_test === true;
    const company = COMPANIES[code] || 'Unknown partner';

    // ── Time (Europe/Sofia) ──
    const now = new Date();
    let dateStr, timeStr, dayKey;
    try {
      dateStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Sofia', weekday: 'short', day: 'numeric', month: 'long',
      }).format(now);
      timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit',
      }).format(now);
      dayKey = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Sofia', year: 'numeric', month: '2-digit', day: '2-digit',
      }).format(now);
    } catch (e) {
      dateStr = now.toISOString().slice(0, 10);
      timeStr = now.toISOString().slice(11, 16);
      dayKey = now.toISOString().slice(0, 10);
    }

    // ── Device (plain language) ──
    const ua = request.headers.get('User-Agent') || '';
    const dev = describeDevice(ua);

    // ── Location (Cloudflare geo, best-effort) ──
    const cf = request.cf || {};
    const locParts = [cf.city, cf.country].filter(Boolean);
    const location = locParts.length ? locParts.join(', ') : null;

    // ── Scan count (KV, optional) ──
    let countLabel = '—';
    if (env && env.GENKI_SCANS) {
      try {
        const raw = await env.GENKI_SCANS.get(code);
        const rec = raw ? JSON.parse(raw) : { total: 0, days: {} };
        if (!isTest) {
          rec.total = (rec.total || 0) + 1;
          rec.days = rec.days || {};
          rec.days[dayKey] = (rec.days[dayKey] || 0) + 1;
          rec.last = now.toISOString();
          await env.GENKI_SCANS.put(code, JSON.stringify(rec));
        }
        const today = (rec.days && rec.days[dayKey]) || 0;
        const total = rec.total || 0;
        countLabel = `${total} total · ${today} today`;
      } catch (e) { /* KV hiccup — leave as — */ }
    }

    const subject = `${isTest ? '🧪 [TEST] ' : '🔔 '}New scan · ${company} (${code})`;

    // ── Plain-text fallback (still human, no raw UA) ──
    const text = [
      `New box scan — ${company}`,
      ``,
      `Company:   ${company}`,
      `Box code:  ${code}`,
      `Device:    ${dev.kind} — ${dev.device}`,
      `Browser:   ${dev.browser}`,
      `When:      ${dateStr}, ${timeStr} (Sofia time)`,
      location ? `Where:     ${location}` : null,
      `Scans:     ${countLabel}`,
      isTest ? `\n(This was a TEST scan — excluded from real data.)` : null,
      ``,
      `Open the page: https://genki.bg/box/${code}/?notrack=1`,
    ].filter((l) => l !== null).join('\n');

    const html = renderEmail({ company, code, dev, dateStr, timeStr, location, countLabel, isTest });

    if (env && env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Genki Box <hello@genki.bg>',
            to: 'hello@genki.bg',
            subject,
            text,
            html,
          }),
        });
      } catch (e) { /* best-effort */ }
    }
  } catch (e) {
    // Never throw to the client.
  }

  return new Response(null, { status: 204 });
}

// ── Branded HTML email (table-based, inline styles for Gmail/Outlook) ──
function renderEmail({ company, code, dev, dateStr, timeStr, location, countLabel, isTest }) {
  const GREEN = '#1e5128';
  const GREEN2 = '#2d8659';
  const INK = '#1f2937';
  const MUTE = '#6b7280';
  const BORDER = '#e6e9e6';
  const BG = '#eef2ee';
  const CREAM = '#f7f8f5';

  const statCard = (label, value, sub) => `
    <td width="50%" valign="top" style="padding:8px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="border:1px solid ${BORDER}; border-radius:12px; background:${CREAM};">
        <tr><td style="padding:14px 16px;">
          <div style="font-size:11px; letter-spacing:.6px; text-transform:uppercase; color:${MUTE}; font-weight:600;">${label}</div>
          <div style="font-size:17px; color:${INK}; font-weight:700; margin-top:5px; line-height:1.25;">${value}</div>
          ${sub ? `<div style="font-size:13px; color:${MUTE}; margin-top:2px;">${sub}</div>` : ''}
        </td></tr>
      </table>
    </td>`;

  const testBanner = isTest ? `
    <tr><td style="padding:0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="background:#fff7ed; border:1px solid #fed7aa; border-radius:10px;">
        <tr><td style="padding:11px 16px; font-size:13px; color:#9a3412;">
          🧪 <strong>Test scan</strong> — excluded from real data.
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="height:8px; line-height:8px;">&nbsp;</td></tr>` : '';

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
</head>
<body style="margin:0; padding:0; background:${BG};">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BG};">
<tr><td align="center" style="padding:28px 14px;">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation"
         style="width:600px; max-width:100%; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 2px 10px rgba(20,40,20,.06); font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

    <!-- header -->
    <tr><td style="background:${GREEN}; background:linear-gradient(135deg,${GREEN} 0%,${GREEN2} 100%); padding:26px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
        <td align="left" valign="middle">
          <img src="https://genki.bg/assets/images/genki_logo_light.png" alt="Genki" height="26" style="height:26px; display:block; border:0;">
        </td>
        <td align="right" valign="middle" style="font-size:12px; color:rgba(255,255,255,.85); letter-spacing:.5px;">
          BOX SCAN
        </td>
      </tr></table>
    </td></tr>

    <!-- title -->
    <tr><td style="padding:30px 28px 8px 28px;">
      <div style="font-size:12px; letter-spacing:1.2px; text-transform:uppercase; color:${GREEN2}; font-weight:700;">New box scan</div>
      <div style="font-size:30px; line-height:1.15; color:${INK}; font-weight:800; margin-top:8px;">${company}</div>
      <div style="margin-top:12px;">
        <span style="display:inline-block; font-size:13px; font-weight:700; letter-spacing:.5px; color:${GREEN}; background:rgba(45,134,89,.12); padding:6px 12px; border-radius:999px;">${code}</span>
      </div>
    </td></tr>

    <tr><td style="height:14px; line-height:14px;">&nbsp;</td></tr>
    ${testBanner}

    <!-- stat grid -->
    <tr><td style="padding:0 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          ${statCard('Device', `${dev.icon} ${dev.kind}`, dev.device)}
          ${statCard('Browser', dev.browser, location ? location : '&nbsp;')}
        </tr>
        <tr>
          ${statCard('When', timeStr, dateStr + ' · Sofia')}
          ${statCard('Scans', countLabel, 'for this box page')}
        </tr>
      </table>
    </td></tr>

    <!-- cta -->
    <tr><td align="center" style="padding:24px 28px 6px 28px;">
      <a href="https://genki.bg/box/${code}/?notrack=1"
         style="display:inline-block; background:${GREEN}; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:13px 26px; border-radius:999px;">
        Open the box page →
      </a>
    </td></tr>

    <!-- footer -->
    <tr><td style="padding:22px 28px 28px 28px;">
      <div style="border-top:1px solid ${BORDER}; padding-top:16px; font-size:12px; color:${MUTE}; line-height:1.6;">
        Automated notification from <strong style="color:${GREEN};">genki.bg</strong> — sent the moment someone scans a partner box QR.
      </div>
    </td></tr>

  </table>

</td></tr>
</table>
</body></html>`;
}
