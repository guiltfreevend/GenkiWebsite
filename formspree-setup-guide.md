# Formspree Setup Guide for Genki Website

This guide explains how to configure both Formspree forms in the Formspree dashboard.

---

## Form 1: Coming Soon Email Collection

**Form ID:** `mjgokaea`
**Endpoint:** `https://formspree.io/f/mjgokaea`
**Location:** `index.html` (Coming Soon page)

### Dashboard Configuration

1. **Go to:** https://formspree.io/forms/mjgokaea/settings

2. **Email Settings:**
   - Primary recipient: `hello@genki.bg`
   - Subject line: `🎉 New signup from Coming Soon page!`

3. **Submission Settings:**
   - ✅ Enable email notifications
   - Redirect URL: `https://genki.bg/thank-you-coming-soon.html`

4. **Security:**
   - ✅ Enable reCAPTCHA (recommended)
   - Go to "Plugins" → Enable "reCAPTCHA v2"

5. **Email Template:**
   - Use "Box" template for clean formatting

---

## Form 2: Full Contact Form

**Form ID:** `xaqbnpda`
**Endpoint:** `https://formspree.io/f/xaqbnpda`
**Location:** `contact.html`

### Dashboard Configuration

1. **Go to:** https://formspree.io/forms/xaqbnpda/settings

2. **Email Settings:**
   - Primary recipient: `hello@genki.bg`
   - CC recipient: `yoan@genki.bg`
   - Subject line: `📧 New Contact Form - Genki Website`

3. **To add CC recipient:**
   - Go to form settings
   - Under "Email" section, click "Add recipient"
   - Enter `yoan@genki.bg`
   - Or use the `_cc` hidden field (already added in HTML)

4. **Submission Settings:**
   - ✅ Enable email notifications
   - Redirect URL: `https://genki.bg/thank-you-contact.html`

5. **Security:**
   - ✅ Enable reCAPTCHA (recommended)
   - Go to "Plugins" → Enable "reCAPTCHA v2"

6. **Email Template:**
   - Use "Box" template for clean formatting

---

## Form Fields Reference

### Coming Soon Form
| Field | Type | Required |
|-------|------|----------|
| email | email | Yes |

### Contact Form
| Field | Type | Required |
|-------|------|----------|
| firstName | text | Yes |
| lastName | text | Yes |
| email | email | Yes |
| phone | tel | Yes |
| company | text | Yes |
| companySize | select | Yes |
| role | select | No |
| plan | checkbox (multiple) | No |
| message | textarea | No |

---

## Hidden Fields Used

Both forms use these Formspree hidden fields:

```html
<input type="hidden" name="_subject" value="Subject line here">
<input type="hidden" name="_template" value="box">
<input type="hidden" name="_next" value="https://genki.bg/thank-you-page.html">
```

Contact form also uses:
```html
<input type="hidden" name="_cc" value="yoan@genki.bg">
```

---

## Testing Checklist

### Coming Soon Form
- [ ] Submit with valid email
- [ ] Verify email arrives at hello@genki.bg
- [ ] Check redirect to thank-you-coming-soon.html works
- [ ] Test with invalid email (should show validation error)
- [ ] Test empty submission (should show validation error)
- [ ] Test on mobile device
- [ ] Test Bulgarian language version

### Contact Form
- [ ] Submit with all required fields
- [ ] Verify email arrives at hello@genki.bg
- [ ] Verify CC email arrives at yoan@genki.bg
- [ ] Check redirect to thank-you-contact.html works
- [ ] Test with missing required fields (should show validation)
- [ ] Test checkbox selection (multiple plans)
- [ ] Test on mobile device
- [ ] Test Bulgarian language version

---

## Troubleshooting

### Form not submitting
1. Check browser console for JavaScript errors
2. Verify Formspree endpoint is correct
3. Check if reCAPTCHA is blocking (disable temporarily to test)

### Emails not arriving
1. Check spam folder
2. Verify email address in Formspree dashboard
3. Check Formspree submission history

### Redirect not working
1. Verify `_next` URL is correct
2. Make sure thank-you page exists
3. Check for HTTPS/HTTP mismatch

---

## Domain Verification (Optional)

For custom domain email delivery:

1. Go to Formspree dashboard → Settings → Domains
2. Add `genki.bg`
3. Add the provided DNS records to your domain

This ensures better email deliverability and removes Formspree branding.

---

## Formspree Plan Notes

- **Free plan:** 50 submissions/month
- **Gold plan:** 1,000 submissions/month + no branding
- **Platinum plan:** Unlimited submissions

For production, consider upgrading to remove the Formspree branding from emails.
