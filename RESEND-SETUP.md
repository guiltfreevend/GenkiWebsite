# 🚀 Genki - Netlify Functions + Resend Email Setup

## 📋 What We Built

A **FREE** email system that sends ROI reports to users who fill out your form.

**How it works:**
1. User fills form on office.html
2. JavaScript sends data to YOUR Netlify Function
3. Function generates beautiful HTML email with ROI report
4. Resend sends email to user + notification to you
5. Done!

---

## ⚡ STEP 1: Install Resend Dependency

Open Terminal and run:

```bash
cd "/Users/tsvetelinas/Desktop/Genki Website"
npm install
```

This installs the `resend` package.

---

## 🔑 STEP 2: Get Resend API Key (5 minutes)

### 2.1: Create FREE Resend Account

1. Go to: https://resend.com/signup
2. Sign up with your email
3. Verify your email address
4. You'll land on the Resend dashboard

**FREE PLAN:**
- ✅ 100 emails/day FOREVER
- ✅ No credit card required
- ✅ No time limit


re_CMyopUHf_4kzgnwSUzgsMgY6qnBqbMqzn
---

### 2.2: Add Your Domain (genki.bg)

**IMPORTANT:** Resend requires you to verify your domain to send from `hello@genki.bg`.

1. In Resend dashboard, click **"Domains"** in the sidebar
2. Click **"Add Domain"**
3. Enter: `genki.bg`
4. Click **"Add"**

Resend will show you **DNS records** to add. You need to add these to Cloudflare:

#### DNS Records to Add in Cloudflare:

**Record 1 - SPF (TXT record):**
- Type: `TXT`
- Name: `@` (or `genki.bg`)
- Value: `v=spf1 include:_spf.resend.com ~all`
- TTL: Auto

**Record 2 - DKIM (TXT record):**
- Type: `TXT`
- Name: `resend._domainkey` (Resend will give you the exact name)
- Value: (Resend will give you the exact value - it's a long string starting with `v=DKIM1`)
- TTL: Auto

**Record 3 - DMARC (TXT record):**
- Type: `TXT`
- Name: `_dmarc`
- Value: `v=DMARC1; p=none;`
- TTL: Auto

#### How to Add DNS Records in Cloudflare:

1. Log in to Cloudflare
2. Select your `genki.bg` domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Add the 3 records above (copy values from Resend dashboard)
6. Wait 5-10 minutes for DNS to propagate
7. Go back to Resend → Click **"Verify"**
8. Status should change to **"Verified ✅"**

---

### 2.3: Create API Key

1. In Resend dashboard, go to **API Keys** (in sidebar)
2. Click **"Create API Key"**
3. Name: `Genki Production`
4. Permission: **"Full access"** (default)
5. Domain: Select **"genki.bg"**
6. Click **"Add"**
7. **COPY THE API KEY** — it starts with `re_`
8. Save it somewhere safe (you'll need it in Step 3)

⚠️ **WARNING:** You can only see the API key ONCE. If you lose it, create a new one.

---

## 🔐 STEP 3: Add API Key to Netlify

### 3.1: Log in to Netlify

1. Go to https://app.netlify.com/
2. Log in to your account
3. Click on your **Genki** site

### 3.2: Add Environment Variable

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"** → **"Add a single variable"**
3. Key: `RESEND_API_KEY`
4. Value: Paste your Resend API key (the `re_xxxxxxxxx` string from Step 2.3)
5. Scopes: Select **"Same value for all deploy contexts"**
6. Click **"Create variable"**

**Done!** ✅ Netlify will now use this API key when sending emails.

---

## 📝 STEP 4: Update office.html Form Submission Code

Find this code in `office.html` (around line 2800-2850, search for "Form submission via"):

**OLD CODE:**
```javascript
// Form submission via fetch
form.addEventListener('submit', function(e) {
  e.preventDefault();

  var companyName = document.getElementById('form-company').value || '';
  var emailField = form.querySelector('input[name="email"]');
  // ... existing Formspree code
```

**REPLACE WITH NEW CODE:**
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

  // Prepare payload
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    if (data.success) {
      form.classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
      if (typeof umami !== 'undefined') {
        umami.track('roi-report-sent');
      }
    } else {
      throw new Error(data.error || 'Failed to send email');
    }
  })
  .catch(function(error) {
    console.error('Error:', error);
    alert('Грешка при изпращане. Моля, опитайте отново.');
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
git commit -m "Add Resend email system"
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

**Check 1:** Is `genki.bg` verified in Resend?
- Go to Resend → Domains
- Status should show "Verified ✅"
- If not, check your Cloudflare DNS records

**Check 2:** Is the API key correct in Netlify?
- Go to Netlify → Site Settings → Environment Variables
- Check `RESEND_API_KEY` exists and starts with `re_`

**Check 3:** Check Netlify Function logs
- Go to Netlify → Functions → `send-roi-report`
- Click on recent invocations
- Look for errors in the logs

**Check 4:** Check Resend Activity
- Go to Resend → Emails
- See if email was sent/delivered/bounced

### DNS Not Verifying?

**Wait:** DNS can take 5-30 minutes to propagate
**Check:** Use https://dnschecker.org/ to verify your TXT records are live
**Verify:** Make sure you copied the EXACT values from Resend (including quotes if any)

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

---

## 📊 Monitoring & Limits

### Resend FREE Plan Limits:
- **100 emails/day** (forever free)
- **3,000 emails/month**
- No credit card required

### When to Upgrade:
- If you send >100 emails/day, upgrade to Pro ($20/month for 50K emails)

### Tracking Emails Sent:
- Check Resend Dashboard → **Emails**
- See all sent emails with status
- View opens, clicks, bounces

---

## 🎉 Done!

You now have a **completely FREE** email system that:
- ✅ Sends beautiful HTML emails to users
- ✅ Includes full ROI report
- ✅ Sends you notification emails
- ✅ No monthly fees (Resend free plan)
- ✅ Better deliverability than SendGrid

---

## 📁 Files Created/Modified

**Created:**
- `/netlify/functions/send-roi-report.js` — The serverless function
- `/package.json` — Dependencies (Resend)

**Modified:**
- `/office.html` — Updated form submission code (Step 4)

**Next deploy:**
- Netlify will automatically install dependencies
- Function will be available at `/.netlify/functions/send-roi-report`
