// Genki Box Landing — shared behavior

// ── QR-scan signal ──────────────────────────────────────────────
// Partner box pages live at /box/GK-XXXXXX/. On load, fire a
// fire-and-forget POST to the same-origin /api/qr Pages Function so the
// scan is recorded (it emails hello@genki.bg via Resend) — mirrors the
// signal box-landing.html already sends. Skipped on localhost and when
// ?notrack=1 is present, so test hits don't pollute the data. In
// self-test mode the signal still fires but is flagged is_test: true so
// it can be excluded. Silent on network failure.
(function () {
  try {
    if (location.hostname === 'localhost') return;
    var params = new URLSearchParams(location.search);
    if (params.get('notrack') === '1') return;

    var match = location.pathname.match(/\/box\/(GK-[A-F0-9]+)/i);
    if (!match) return;
    var code = match[1].toUpperCase();

    // Self-test mode: scans from the team's own phones still fire the
    // signal, but are flagged is_test: true so they can be excluded
    // from real QR-scan data. Toggled at /box/selftest/ (stored
    // in localStorage) or with a one-off ?selftest=1 query param.
    var isSelfTest = false;
    try {
      isSelfTest = localStorage.getItem('genki_selftest') === '1';
    } catch (e) { /* localStorage unavailable — treat as not self-test */ }
    if (params.get('selftest') === '1') isSelfTest = true;

    var payload = { landing_page_code: code };
    if (isSelfTest) payload.is_test = true;

    // keepalive: true so the request completes even if the visitor
    // navigates away within milliseconds. Same-origin — no CORS.
    fetch('/api/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(function () { /* silent */ });
  } catch (e) { /* silent */ }
})();

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
