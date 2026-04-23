// Genki email Worker — Cloudflare Worker entry point.
// Deployed at: https://genki-email.tsvetelin-sotirov.workers.dev
// Source of truth for the email template that Resend delivers to:
//   1. The submitter of the office.html exit-modal form (wellbeing-first HTML)
//   2. hello@genki.bg as a lead notification

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const jsonHeaders = () => ({ 'Content-Type': 'application/json', ...CORS_HEADERS });

const fmt = (n) => Number(n || 0).toLocaleString('en-US');
const eur = (n) => '€' + fmt(Math.round(Number(n) || 0));

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();

      const {
        name, email, company,
        teamSize, salary, turnoverRate,
        totalSavings, netBenefit, roiPercent, paybackMonths,
        genkiCostAnnual,
        peopleStaying, sickDaysAvoided, focusHoursRecovered,
      } = data;

      if (!name || !email || !company) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400, headers: jsonHeaders(),
        });
      }

      const payback = paybackMonths != null ? paybackMonths : '—';

      const preheader = `Въз основа на ${teamSize} души: ${fmt(peopleStaying)} повече хора остават, ${fmt(sickDaysAvoided)} по-малко болнични дни, ${eur(netBenefit)} нетна полза на година.`;

      const userHtml = `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Вашият Genki ROI Report</title>
</head>
<body style="margin:0; padding:0; background:#ffffff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#1f2937;">
  <span style="display:none !important; visibility:hidden; mso-hide:all; font-size:1px; color:#ffffff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff;">

        <tr><td style="padding:8px 4px 20px 4px; border-bottom:2px solid #2d8659;">
          <div style="font-size:18px; font-weight:700; color:#1e5128;">Genki</div>
          <div style="font-size:13px; color:#6b7280; margin-top:2px;">ROI Report за ${company}</div>
        </td></tr>

        <tr><td style="padding:24px 4px 0 4px; font-size:15px; line-height:1.65; color:#1f2937;">
          <p style="margin:0 0 14px 0;">Здравейте, ${name},</p>
          <p style="margin:0 0 14px 0;">Благодарим Ви, че отделихте време да моделирате числата. Въз основа на данните, които споделихте — <strong>${teamSize}</strong> души в екипа, €${fmt(salary)} средна месечна заплата и ${turnoverRate}% текучество — ето какво Genki може да промени във Вашия офис:</p>
        </td></tr>

        <tr><td style="padding:10px 4px 0 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:26px; font-weight:700; color:#1e5128; line-height:1.1;">${fmt(peopleStaying)} <span style="font-size:14px; font-weight:500; color:#1e5128;">повече хора остават в екипа</span></div>
              <div style="font-size:13px; color:#4b5563; margin-top:6px; line-height:1.5;">Всяка година — по-малко прощални кафета, по-малко нови onboarding-и, повече инерция.</div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:10px 4px 0 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:26px; font-weight:700; color:#1e5128; line-height:1.1;">${fmt(sickDaysAvoided)} <span style="font-size:14px; font-weight:500; color:#1e5128;">болнични дни по-малко на година</span></div>
              <div style="font-size:13px; color:#4b5563; margin-top:6px; line-height:1.5;">Хора, които се чувстват по-добре, защото се хранят по-добре на работа.</div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:10px 4px 20px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:26px; font-weight:700; color:#1e5128; line-height:1.1;">${fmt(focusHoursRecovered)} <span style="font-size:14px; font-weight:500; color:#1e5128;">часа възстановен фокус</span></div>
              <div style="font-size:13px; color:#4b5563; margin-top:6px; line-height:1.5;">По-кратки обедни паузи, когато храната е в кухнята. Следобедите стават различни.</div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:6px 4px 0 4px; font-size:15px; line-height:1.65; color:#1f2937;">
          <p style="margin:0 0 10px 0;">Финансовата страна също се подрежда добре: <strong>${eur(netBenefit)}</strong> нетна годишна полза, ROI от ${roiPercent}%, възвръщаемост за ${payback} месеца. Числата идват от 43 рецензирани изследвания за уелнес на работното място — ако искате да видите методологията, имаме я разгърната на страницата.</p>
          <p style="margin:0 0 10px 0;">Ако това звучи като нещо, което би подхождало на Вашия екип, най-бързият начин да го обсъдим е един кратък разговор. 30 минути — ще ви покажа какво точно бихме направили в офиса Ви, какви продукти влизат в кухнята, как се грижим за логистиката.</p>
        </td></tr>

        <tr><td style="padding:18px 4px 8px 4px;">
          <a href="https://calendly.com/hello-genki/30min" style="color:#1e5128; font-weight:700; text-decoration:underline; font-size:15px;">Резервирайте 30-минутен разговор →</a>
        </td></tr>

        <tr><td style="padding:18px 4px 0 4px; font-size:15px; line-height:1.65; color:#1f2937;">
          <p style="margin:0 0 6px 0;">Ако имате въпроси преди това, просто отговорете на този имейл — пише директно до мен.</p>
          <p style="margin:0 0 6px 0;">Поздрави,<br>Екипът на Genki</p>
        </td></tr>

        <tr><td style="padding:24px 4px 4px 4px; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280; line-height:1.6;">
          <div>Гилт Фрий Венд ООД · София, България · ЕИК 207668100</div>
          <div style="margin-top:2px;">
            <a href="https://www.genki.bg" style="color:#6b7280; text-decoration:underline;">www.genki.bg</a> ·
            <a href="mailto:hello@genki.bg" style="color:#6b7280; text-decoration:underline;">hello@genki.bg</a>
          </div>
          <div style="margin-top:8px; color:#9ca3af;">Получавате този имейл, защото поискахте ROI анализ от www.genki.bg. Ако това е било по погрешка, просто отговорете и ще Ви премахнем.</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

      const userText = `Здравейте, ${name},

Благодарим Ви, че отделихте време да моделирате числата. Въз основа на данните, които споделихте — ${teamSize} души в екипа, €${fmt(salary)} средна месечна заплата и ${turnoverRate}% текучество — ето какво Genki може да промени във Вашия офис:

• ${fmt(peopleStaying)} повече хора остават в екипа всяка година
• ${fmt(sickDaysAvoided)} болнични дни по-малко на година
• ${fmt(focusHoursRecovered)} часа възстановен фокус на година

Финансовата страна също се подрежда добре: ${eur(netBenefit)} нетна годишна полза, ROI от ${roiPercent}%, възвръщаемост за ${payback} месеца. Числата идват от 43 рецензирани изследвания за уелнес на работното място.

Ако това звучи като нещо, което би подхождало на Вашия екип, 30 минути разговор ще ни стигнат да Ви покажем какво точно бихме направили:
https://calendly.com/hello-genki/30min

Ако имате въпроси преди това, просто отговорете на този имейл.

Поздрави,
Екипът на Genki

—
Гилт Фрий Венд ООД · София · ЕИК 207668100
www.genki.bg · hello@genki.bg`;

      const userRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Genki <hello@genki.bg>',
          reply_to: 'hello@genki.bg',
          to: email,
          subject: `Вашият Genki ROI Report — ${company}`,
          html: userHtml,
          text: userText,
          headers: {
            'List-Unsubscribe': '<mailto:hello@genki.bg?subject=unsubscribe>',
          },
        }),
      });

      if (!userRes.ok) {
        const errBody = await userRes.text();
        console.error('User email failed:', errBody);
        return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), {
          status: 500, headers: jsonHeaders(),
        });
      }

      const notifText = `New lead from office.html

Company:  ${company}
Contact:  ${name} <${email}>

— Calculator inputs —
Team size:   ${teamSize}
Avg salary:  €${fmt(salary)}/mo
Turnover:    ${turnoverRate}%

— Wellbeing projection —
People staying:          +${fmt(peopleStaying)}/yr
Sick days avoided:       ${fmt(sickDaysAvoided)}/yr
Focus hours recovered:   ${fmt(focusHoursRecovered)}/yr

— Business projection —
Net benefit:     ${eur(netBenefit)}/yr
ROI:             ${roiPercent}%
Payback:         ${payback} months
Total savings:   ${eur(totalSavings)}/yr
Genki cost:      ${eur(genkiCostAnnual)}/yr`;

      const notifHtml = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif; font-size:14px; color:#1f2937; max-width:560px;">
  <h2 style="margin:0 0 16px 0; font-size:18px; color:#1e5128;">New lead — ${company}</h2>
  <p style="margin:0 0 8px 0;"><strong>${name}</strong> &lt;<a href="mailto:${email}" style="color:#2d8659;">${email}</a>&gt;</p>
  <h3 style="margin:20px 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em;">Calculator inputs</h3>
  <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
    <tr><td style="color:#6b7280;">Team size</td><td><strong>${teamSize}</strong></td></tr>
    <tr><td style="color:#6b7280;">Avg salary</td><td>€${fmt(salary)}/mo</td></tr>
    <tr><td style="color:#6b7280;">Turnover rate</td><td>${turnoverRate}%</td></tr>
  </table>
  <h3 style="margin:20px 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em;">Wellbeing projection</h3>
  <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
    <tr><td style="color:#6b7280;">People staying</td><td><strong>+${fmt(peopleStaying)}/yr</strong></td></tr>
    <tr><td style="color:#6b7280;">Sick days avoided</td><td>${fmt(sickDaysAvoided)}/yr</td></tr>
    <tr><td style="color:#6b7280;">Focus hours recovered</td><td>${fmt(focusHoursRecovered)}/yr</td></tr>
  </table>
  <h3 style="margin:20px 0 8px 0; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em;">Business projection</h3>
  <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;">
    <tr><td style="color:#6b7280;">Net benefit</td><td><strong>${eur(netBenefit)}/yr</strong></td></tr>
    <tr><td style="color:#6b7280;">ROI</td><td>${roiPercent}%</td></tr>
    <tr><td style="color:#6b7280;">Payback</td><td>${payback} months</td></tr>
    <tr><td style="color:#6b7280;">Total savings</td><td>${eur(totalSavings)}/yr</td></tr>
    <tr><td style="color:#6b7280;">Genki cost</td><td>${eur(genkiCostAnnual)}/yr</td></tr>
  </table>
</div>`;

      const notifRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Genki Notifications <hello@genki.bg>',
          to: 'hello@genki.bg',
          subject: `New lead — ${company} (${teamSize} ppl · ${eur(netBenefit)}/yr)`,
          text: notifText,
          html: notifHtml,
        }),
      });

      if (!notifRes.ok) {
        const errBody = await notifRes.text();
        console.error('Notification email failed:', errBody);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: jsonHeaders(),
      });

    } catch (error) {
      console.error('Worker error:', error && error.message);
      return new Response(JSON.stringify({ error: (error && error.message) || 'Unknown error' }), {
        status: 500, headers: jsonHeaders(),
      });
    }
  },
};
