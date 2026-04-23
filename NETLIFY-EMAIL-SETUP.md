# 🚀 Genki - Netlify Functions + SendGrid Email Setup

## 📋 What We Built

A **FREE** email system that sends ROI reports to users who fill out your form. No Formspree payment required!

**How it works:**
1. User fills form on office.html
2. JavaScript sends data to YOUR Netlify Function
3. Function generates beautiful HTML email with ROI report
4. SendGrid sends email to user + notification to you
5. Done!

---

## ⚡ STEP 1: Install SendGrid Dependency

Open Terminal and run:

```bash
cd "/Users/tsvetelinas/Desktop/Genki Website"
npm install
```

This installs the `@sendgrid/mail` package from the `package.json` file I created.

---

## 🔑 STEP 2: Get SendGrid API Key

### 2.1: Create FREE SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up with your email (FREE plan: 100 emails/day forever)
3. Verify your email address
4. Complete the "Tell us about yourself" form (choose "I'm a developer", skip everything else)

### 2.2: Verify Your Sender Email

SendGrid requires you to verify that you own `hello@genki.bg`:

1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - From Name: `Genki`
   - From Email: `hello@genki.bg`
   - Reply To: `hello@genki.bg`
   - Company: `Genki`
   - Address, City, Country: (your info)
4. Click **Create**
5. Check your `hello@genki.bg` inbox
6. Click the verification link in the email from SendGrid
7. Done! ✅

**IMPORTANT:** You MUST verify `hello@genki.bg` or SendGrid will not send emails.

### 2.3: Create API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: `Genki Production`
4. Permissions: **Full Access** (select the radio button)
5. Click **Create & View**
6. **COPY THE API KEY** — it looks like: `SG.xxxxxxxxxxxxxxxxxx`
7. Save it somewhere safe (you'll need it in Step 3)

⚠️ **WARNING:** You can only see the API key ONCE. If you lose it, you'll need to create a new one.

---

## 🔐 STEP 3: Add API Key to Netlify

### 3.1: Log in to Netlify

1. Go to https://app.netlify.com/
2. Log in to your account
3. Click on your **Genki** site

### 3.2: Add Environment Variable

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"** → **"Add a single variable"**
3. Key: `SENDGRID_API_KEY`
4. Value: Paste your SendGrid API key (the `SG.xxxxxxxxx` string from Step 2.3)
5. Scopes: Select **"Same value for all deploy contexts"**
6. Click **"Create variable"**

**Done!** ✅ Netlify will now use this API key when sending emails.

---

## 📝 STEP 4: Update office.html Form Submission Code

Find this code in `office.html` (around line 2800-2850):

```javascript
// Form submission via fetch
form.addEventListener('submit', function(e) {
  e.preventDefault();

  var companyName = document.getElementById('form-company').value || '';
  var emailField = form.querySelector('input[name="email"]');
  document.getElementById('form-subject').value = '🎯 ROI Report — ' + companyName + ' (€' + (document.getElementById('result-total').textContent) + ' savings)';
  document.getElementById('form-replyto').value = emailField ? emailField.value : '';
  document.getElementById('form-roi-report').value = buildROIReport();

  var formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).then(function(response) {
    if (response.ok) {
      form.classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
      if (typeof umami !== 'undefined') {
        umami.track('landing-exit-email-success');
      }
    }
  }).catch(function() {
    form.submit();
  });
});
```

**REPLACE IT WITH:**

```javascript
// Form submission via Netlify Function
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Gather form data
  var name = document.getElementById('form-name').value;
  var email = document.getElementById('form-email').value;
  var company = document.getElementById('form-company').value;
  var teamSize = parseInt(document.getElementById('slider-employees').value);
  var salary = parseInt(document.getElementById('slider-salary').value);
  var turnoverRate = parseInt(document.getElementById('slider-turnover').value);
  var totalSavings = document.getElementById('result-total').textContent;
  var roiReport = buildROIReport();

  // Prepare payload for Netlify Function
  var payload = {
    name: name,
    email: email,
    company: company,
    teamSize: teamSize,
    salary: salary,
    turnoverRate: turnoverRate,
    totalSavings: totalSavings,
    roiReport: roiReport
  };

  // Show loading state
  var submitButton = form.querySelector('button[type="submit"]');
  var originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Изпращане...';
  submitButton.disabled = true;

  // Send to Netlify Function
  fetch('/.netlify/functions/send-roi-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.success) {
      // Success! Hide form, show success message
      form.classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
      
      // Track with Umami
      if (typeof umami !== 'undefined') {
        umami.track('roi-report-sent');
      }
    } else {
      throw new Error(data.error || 'Failed to send email');
    }
  })
  .catch(function(error) {
    console.error('Error:', error);
    alert('Грешка при изпращане. Моля, опитайте отново или се свържете с нас на hello@genki.bg');
    
    // Reset button
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  });
});
```

**Save the file.**

---

## 🚀 STEP 5: Deploy to Netlify

### Option A: Git Push (Recommended)

```bash
cd "/Users/tsvetelinas/Desktop/Genki Website"
git add .
git commit -m "Add Netlify Functions email system"
git push origin main
```

Netlify will automatically deploy your changes.

### Option B: Manual Deploy via Netlify CLI

```bash
cd "/Users/tsvetelinas/Desktop/Genki Website"
netlify deploy --prod
```

---

## ✅ STEP 6: Test It!

1. Go to https://genki.bg/office
2. Fill out the form with your own email
3. Submit
4. Check your inbox — you should receive a beautiful HTML email with the ROI report
5. Check `hello@genki.bg` inbox — you should receive a notification

---

## 🐛 Troubleshooting

### Email not arriving?

**Check 1:** Is `hello@genki.bg` verified in SendGrid?
- Go to SendGrid → Settings → Sender Authentication
- Status should show "Verified ✅"

**Check 2:** Is the API key correct in Netlify?
- Go to Netlify → Site Settings → Environment Variables
- Check `SENDGRID_API_KEY` exists and starts with `SG.`

**Check 3:** Check Netlify Function logs
- Go to Netlify → Functions → `send-roi-report`
- Click on recent invocations
- Look for errors in the logs

**Check 4:** Check SendGrid Activity
- Go to SendGrid → Activity
- See if email was sent/delivered/bounced

### Form submission not working?

**Check 1:** Browser console errors
- Open browser DevTools (F12)
- Go to Console tab
- Submit form and look for errors

**Check 2:** Network tab
- Open DevTools → Network tab
- Submit form
- Look for the `send-roi-report` request
- Click on it and check Response tab for error messages

### Still not working?

**Check the complete Netlify Function logs:**

```bash
netlify functions:log send-roi-report
```

Or go to: Netlify Dashboard → Functions → send-roi-report → Recent logs

---

## 📊 Monitoring & Limits

### SendGrid FREE Plan Limits:
- **100 emails/day** (forever free)
- No credit card required
- Perfect for lead generation

### When to Upgrade:
- If you send >100 reports/day, upgrade to SendGrid Essentials ($19.95/month for 50K emails)

### Tracking Emails Sent:
- Check SendGrid Dashboard → **Statistics**
- See daily/monthly send counts
- See open rates, click rates, bounces

---

## 🎉 Done!

You now have a **completely FREE** email system that:
- ✅ Sends beautiful HTML emails to users
- ✅ Includes full ROI report
- ✅ Sends you notification emails
- ✅ No monthly fees (SendGrid free plan)
- ✅ No Formspree needed

**Questions?** Check the troubleshooting section or contact me.

---

## 📁 Files Created/Modified

**Created:**
- `/netlify/functions/send-roi-report.js` — The serverless function
- `/package.json` — Dependencies (SendGrid)

**Modified:**
- `/office.html` — Updated form submission code (Step 4)

**Next deploy:**
- Netlify will automatically install dependencies
- Function will be available at `/.netlify/functions/send-roi-report`
