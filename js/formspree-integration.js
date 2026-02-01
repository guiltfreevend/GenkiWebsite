/**
 * Genki - Formspree Integration
 * Handles async form submission, validation, and loading states
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    comingSoonEndpoint: 'https://formspree.io/f/mjgokaea',
    contactEndpoint: 'https://formspree.io/f/xaqbnpda',
    comingSoonRedirect: '/thank-you-coming-soon.html',
    contactRedirect: '/thank-you-contact.html'
  };

  // Bilingual messages
  const MESSAGES = {
    loading: {
      en: 'Sending...',
      bg: 'Изпращане...'
    },
    success: {
      en: 'Thank you! Your message has been sent.',
      bg: 'Благодарим! Вашето съобщение беше изпратено.'
    },
    error: {
      en: 'Something went wrong. Please try again or email us directly.',
      bg: 'Нещо се обърка. Моля, опитайте отново или ни пишете директно.'
    },
    validationEmail: {
      en: 'Please enter a valid email address.',
      bg: 'Моля, въведете валиден имейл адрес.'
    },
    validationRequired: {
      en: 'This field is required.',
      bg: 'Това поле е задължително.'
    },
    networkError: {
      en: 'Network error. Please check your connection.',
      bg: 'Мрежова грешка. Моля, проверете връзката си.'
    }
  };

  // Get current language
  function getCurrentLang() {
    return localStorage.getItem('genkiLang') || 'en';
  }

  // Get message in current language
  function getMessage(key) {
    const lang = getCurrentLang();
    return MESSAGES[key] ? (MESSAGES[key][lang] || MESSAGES[key].en) : key;
  }

  // Email validation
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Show loading state on button
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `
        <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>${getMessage('loading')}</span>
      `;
      button.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalText;
      button.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }

  // Show error message
  function showError(form, message) {
    // Remove existing error
    const existingError = form.querySelector('.form-error-message');
    if (existingError) existingError.remove();

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4 flex items-center gap-2';
    errorDiv.innerHTML = `
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${message}</span>
    `;

    // Insert before submit button or at end of form
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
    } else {
      form.appendChild(errorDiv);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Show success message (for inline success, not redirect)
  function showSuccess(form, message) {
    const existingSuccess = form.querySelector('.form-success-message');
    if (existingSuccess) existingSuccess.remove();

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4 flex items-center gap-2';
    successDiv.innerHTML = `
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${message}</span>
    `;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.parentNode.insertBefore(successDiv, submitBtn);
    } else {
      form.appendChild(successDiv);
    }
  }

  // Validate form field
  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const type = field.type;

    // Remove existing error styling
    field.classList.remove('border-red-500', 'focus:border-red-500');

    // Check required
    if (isRequired && !value) {
      field.classList.add('border-red-500');
      return { valid: false, message: getMessage('validationRequired') };
    }

    // Check email format
    if (type === 'email' && value && !isValidEmail(value)) {
      field.classList.add('border-red-500');
      return { valid: false, message: getMessage('validationEmail') };
    }

    return { valid: true };
  }

  // Validate entire form
  function validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    let firstError = null;

    fields.forEach(field => {
      const result = validateField(field);
      if (!result.valid) {
        isValid = false;
        if (!firstError) {
          firstError = { field, message: result.message };
        }
      }
    });

    if (firstError) {
      firstError.field.focus();
      showError(form, firstError.message);
    }

    return isValid;
  }

  // Submit form via fetch
  async function submitForm(form, endpoint, redirectUrl) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Set loading state
    setButtonLoading(submitBtn, true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success - redirect
        window.location.href = redirectUrl;
      } else {
        // Server error
        const data = await response.json();
        throw new Error(data.error || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setButtonLoading(submitBtn, false);

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showError(form, getMessage('networkError'));
      } else {
        showError(form, getMessage('error'));
      }
    }
  }

  // Initialize Coming Soon form
  function initComingSoonForm() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Validate
      if (!validateForm(form)) return;

      // Submit
      await submitForm(form, CONFIG.comingSoonEndpoint, CONFIG.comingSoonRedirect);
    });

    // Real-time validation on blur
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        validateField(this);
      });
    }
  }

  // Initialize Contact form
  function initContactForm() {
    const form = document.querySelector('form[data-validate]');
    if (!form) return;

    // Check if this is the contact page form
    const isContactPage = window.location.pathname.includes('contact');
    if (!isContactPage) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Validate
      if (!validateForm(form)) return;

      // Submit
      await submitForm(form, CONFIG.contactEndpoint, CONFIG.contactRedirect);
    });

    // Real-time validation on blur for required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.addEventListener('blur', function() {
        validateField(this);
      });
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initComingSoonForm();
    initContactForm();
  });

  // Expose for manual initialization if needed
  window.GenkiFormspree = {
    init: function() {
      initComingSoonForm();
      initContactForm();
    },
    validate: validateForm,
    getMessage: getMessage
  };

})();
