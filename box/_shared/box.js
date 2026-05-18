// Genki Box Landing — shared behavior

document.addEventListener('DOMContentLoaded', () => {
  // Fade-on-scroll for sections 2, 3, 4
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-on-scroll').forEach((el) => observer.observe(el));

  // Smooth-scroll for the hero CTA to the booking section at the bottom
  document.querySelectorAll('[data-scroll-to-book]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('book');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Language toggle (BG <-> EN) — wire to existing translations.js pattern
  // The personal section is bilingual via data-i18n-bg / data-i18n-en attributes
  const langBtn = document.querySelector('.hero-lang');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'bg';
      const next = current === 'bg' ? 'en' : 'bg';
      document.documentElement.setAttribute('lang', next);
      document.querySelectorAll(`[data-i18n-${next}]`).forEach((el) => {
        el.textContent = el.getAttribute(`data-i18n-${next}`);
      });
      langBtn.textContent = next === 'bg' ? 'BG ▾' : 'EN ▾';
    });
  }
});
