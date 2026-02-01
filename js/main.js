// Genki - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initFormValidation();
  initHeaderScroll();
  initModal();
});

// Modal System
function initModal() {
  // Create modal container if it doesn't exist
  if (!document.getElementById('genki-modal')) {
    const modalHTML = `
      <div id="genki-modal" class="fixed inset-0 z-[100] hidden">
        <!-- Backdrop -->
        <div id="modal-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
        <!-- Modal Content -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div id="modal-content" class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <!-- Close Button -->
            <button id="modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <!-- Icon -->
            <div id="modal-icon" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"></div>
            <!-- Title -->
            <h3 id="modal-title" class="text-2xl font-bold text-gray-900 text-center mb-3"></h3>
            <!-- Message -->
            <p id="modal-message" class="text-gray-600 text-center mb-6"></p>
            <!-- Actions -->
            <div id="modal-actions" class="flex flex-col sm:flex-row gap-3 justify-center"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close modal on backdrop click
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }
}

function showModal(options) {
  const modal = document.getElementById('genki-modal');
  const icon = document.getElementById('modal-icon');
  const title = document.getElementById('modal-title');
  const message = document.getElementById('modal-message');
  const actions = document.getElementById('modal-actions');
  const content = document.getElementById('modal-content');

  // Set type styling
  if (options.type === 'error') {
    icon.className = 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-100';
    icon.innerHTML = `<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`;
  } else if (options.type === 'success') {
    icon.className = 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100';
    icon.innerHTML = `<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>`;
  } else {
    icon.className = 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary-100';
    icon.innerHTML = `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`;
  }

  title.textContent = options.title || '';
  message.textContent = options.message || '';

  // Build action buttons
  actions.innerHTML = '';
  if (options.primaryButton) {
    const btn = document.createElement('button');
    btn.className = 'px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all';
    btn.textContent = options.primaryButton.text;
    btn.onclick = () => {
      if (options.primaryButton.action) options.primaryButton.action();
      closeModal();
    };
    actions.appendChild(btn);
  }
  if (options.secondaryButton) {
    const btn = document.createElement('button');
    btn.className = 'px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all';
    btn.textContent = options.secondaryButton.text;
    btn.onclick = () => {
      if (options.secondaryButton.action) options.secondaryButton.action();
      closeModal();
    };
    actions.appendChild(btn);
  }

  // Show modal with animation
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Trigger animation
  setTimeout(() => {
    content.classList.add('scale-100', 'opacity-100');
    content.classList.remove('scale-95', 'opacity-0');
  }, 10);
}

function closeModal() {
  const modal = document.getElementById('genki-modal');
  const content = document.getElementById('modal-content');

  content.classList.add('scale-95', 'opacity-0');
  content.classList.remove('scale-100', 'opacity-100');

  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 200);
}

// Global function to show error modal
function showErrorModal(title, message) {
  showModal({
    type: 'error',
    title: title,
    message: message,
    primaryButton: {
      text: 'Try Again',
      action: () => {}
    },
    secondaryButton: {
      text: 'Email Us',
      action: () => { window.location.href = 'mailto:hello@genki.bg'; }
    }
  });
}

// Global function to show success modal
function showSuccessModal(title, message) {
  showModal({
    type: 'success',
    title: title,
    message: message,
    primaryButton: {
      text: 'Got it!',
      action: () => {}
    }
  });
}

// Navigation - Active State
function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const closeButton = document.getElementById('close-menu');

  if (!menuButton || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuButton.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);
  mobileOverlay?.addEventListener('click', closeMenu);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Scroll Animations (Intersection Observer)
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Header Background on Scroll
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
      header.classList.add('bg-transparent');
    }

    lastScroll = currentScroll;
  });
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        removeError(input);

        if (!input.value.trim()) {
          showError(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          showError(input, 'Please enter a valid email');
          isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
          showError(input, 'Please enter a valid phone number');
          isValid = false;
        }
      });

      if (isValid) {
        handleFormSubmit(form);
      }
    });
  });
}

function showError(input, message) {
  input.classList.add('border-red-500');
  const error = document.createElement('span');
  error.className = 'text-red-500 text-sm mt-1 error-message';
  error.textContent = message;
  input.parentNode.appendChild(error);
}

function removeError(input) {
  input.classList.remove('border-red-500');
  const error = input.parentNode.querySelector('.error-message');
  if (error) error.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
}

function handleFormSubmit(form) {
  // Save to localStorage for thank you page redirect when user returns
  const formAction = form.getAttribute('action') || '';
  if (formAction.includes('formspree')) {
    // Determine which form this is based on the page
    if (window.location.pathname.includes('contact')) {
      localStorage.setItem('genki_contact_submitted', Date.now().toString());
    } else {
      localStorage.setItem('genki_coming_soon_submitted', Date.now().toString());
    }
  }

  // Native form submission - works with Formspree reCAPTCHA
  form.submit();
}

function showSuccessMessage(form) {
  const message = document.createElement('div');
  message.className = 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4 success-message';
  message.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      <span>Thank you! We'll be in touch within 24 hours.</span>
    </div>
  `;

  // Remove existing success message if any
  const existing = form.querySelector('.success-message');
  if (existing) existing.remove();

  form.appendChild(message);

  // Auto remove after 5 seconds
  setTimeout(() => message.remove(), 5000);
}

// Counter Animation for Stats
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    };

    updateCounter();
  });
}

// Initialize counter animation when stats section is visible
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}
