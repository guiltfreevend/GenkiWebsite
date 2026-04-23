# ⚡ QUICK START - Code Change for office.html

## 📍 What to Change

Find this code in `office.html` (search for "Form submission via fetch"):

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

## ✅ Replace With This:

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

---

## 🚀 Then Do This (In Order):

1. **Install dependencies:**
   ```bash
   cd "/Users/tsvetelinas/Desktop/Genki Website"
   npm install
   ```

2. **Get SendGrid API key:**
   - Sign up at https://signup.sendgrid.com/
   - Verify hello@genki.bg
   - Create API key
   - Copy the `SG.xxxxxxxxx` key

3. **Add to Netlify:**
   - Go to Netlify Dashboard
   - Site Settings → Environment Variables
   - Add: `SENDGRID_API_KEY` = your API key

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Add email system"
   git push
   ```

5. **Test:**
   - Go to genki.bg/office
   - Fill form
   - Check your email!

---

**Full instructions:** See `NETLIFY-EMAIL-SETUP.md`
