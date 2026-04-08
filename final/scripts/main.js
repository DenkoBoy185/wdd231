// main.js – shared across all pages

// ── Footer: year and last-modified ─────────────────────────────────
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// ── Hamburger nav ───────────────────────────────────────────────────
const menuBtn    = document.getElementById('menu-btn');
const primaryNav = document.getElementById('primary-nav');

if (menuBtn && primaryNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  // Close nav when a link is clicked (mobile UX)
  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '&#9776;';
    });
  });
}
