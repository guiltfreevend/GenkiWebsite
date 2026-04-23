// Genki ROI Report Email Function
// Sends personalized ROI report to users via Resend

const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const data = JSON.parse(event.body);
    
    const {
      name,
      email,
      company,
      teamSize,
      salary,
      turnoverRate,
      totalSavings,
      roiReport
    } = data;

    // Validate required fields
    if (!name || !email || !company || !roiReport) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Initialize Resend with API key from environment variable
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    const resend = new Resend(RESEND_API_KEY);

    // Send email to USER (the person who filled the form)
    await resend.emails.send({
      from: 'Genki <hello@genki.bg>',
      to: email,
      subject: `✅ Вашият Genki ROI Report — ${company}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff;
    }
    .header { 
      background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 40px 30px;
      background: #ffffff;
    }
    .content p {
      margin: 0 0 16px 0;
      font-size: 16px;
      line-height: 1.6;
    }
    .report { 
      background: #f9fafb;
      padding: 24px;
      font-family: 'Courier New', 'Courier', monospace;
      font-size: 13px;
      white-space: pre-wrap;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin: 24px 0;
      overflow-x: auto;
      color: #1f2937;
    }
    .cta { 
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      margin: 24px 0;
      font-weight: 600;
      font-size: 16px;
    }
    .cta:hover {
      background: #059669;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .footer { 
      text-align: center;
      padding: 30px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .footer p {
      margin: 8px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .divider {
      margin: 24px 0;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Вашият Genki ROI Report</h1>
      <p>${company}</p>
    </div>
    
    <div class="content">
      <p>Здравейте <strong>${name}</strong>,</p>
      
      <p>Благодарим за интереса към Genki! Вашият персонализиран ROI анализ е готов:</p>
      
      <div class="report">${roiReport.replace(/\n/g, '<br>')}</div>
      
      <p><strong>Готови да стартирате?</strong></p>
      
      <p>Резервирайте 30-минутна demo среща, за да обсъдим как Genki може да трансформира вашия офис:</p>
      
      <div class="cta-container">
        <a href="https://calendly.com/hello-genki/30min" class="cta">Резервирайте Demo Среща →</a>
      </div>
      
      <div class="divider">
        <p style="color: #6b7280; font-size: 14px;">
          Имате въпроси? Отговорете директно на този имейл или ни пишете на <a href="mailto:hello@genki.bg" style="color: #10b981;">hello@genki.bg</a>
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Genki</strong> — Здравословна хранителна придобивка за модерни компании</p>
      <p>
        📧 <a href="mailto:hello@genki.bg">hello@genki.bg</a> | 
        🌐 <a href="https://www.genki.bg">www.genki.bg</a>
      </p>
    </div>
  </div>
</body>
</html>
      `
    });

    // Send notification email to YOU
    await resend.emails.send({
      from: 'Genki Notifications <hello@genki.bg>',
      to: 'hello@genki.bg',
      subject: `🎯 New ROI Report Request — ${company} (€${totalSavings || 'N/A'})`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
    }
    .container { 
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: #10b981;
      color: white;
      padding: 20px;
    }
    .header h2 {
      margin: 0;
      font-size: 20px;
    }
    .content {
      padding: 24px;
    }
    table { 
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }
    td { 
      padding: 12px;
      border: 1px solid #e5e7eb;
    }
    td:first-child { 
      background: #f3f4f6;
      font-weight: 600;
      width: 160px;
    }
    .cta {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎯 New ROI Report Request</h2>
    </div>
    
    <div class="content">
      <table>
        <tr><td>Company</td><td><strong>${company}</strong></td></tr>
        <tr><td>Name</td><td>${name}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td>Team Size</td><td>${teamSize || 'N/A'}</td></tr>
        <tr><td>Avg Salary</td><td>€${salary || 'N/A'}</td></tr>
        <tr><td>Turnover Rate</td><td>${turnoverRate || 'N/A'}%</td></tr>
        <tr><td>Est. Savings</td><td><strong>€${totalSavings || 'N/A'}</strong></td></tr>
      </table>
      
      <p>✅ Full ROI report sent to user at <strong>${email}</strong></p>
      
      <p>
        <a href="https://calendly.com/hello-genki/30min" class="cta">Schedule Follow-up Call →</a>
      </p>
    </div>
  </div>
</body>
</html>
      `
    });

    console.log(`ROI report sent successfully to ${email}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'ROI report sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};
