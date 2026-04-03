import { places } from '../data/discover.mjs';

// ─── Build Discovery Cards ────────────────────────────────────────────────────
function buildCards() {
  const container = document.getElementById('cards-container');
  if (!container) return;

  places.forEach((place, index) => {
    const card = document.createElement('article');
    card.classList.add('discover-card');
    card.setAttribute('data-area', `card${index + 1}`);

    card.innerHTML = `
      <h2>${place.name}</h2>
      <figure>
        <img
          src="${place.photo}"
          alt="${place.alt}"
          width="300"
          height="200"
          loading="lazy"
        >
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button class="learn-more-btn" type="button" aria-label="Learn more about ${place.name}">Learn More</button>
    `;

    container.appendChild(card);
  });
}

// ─── localStorage Visit Message ───────────────────────────────────────────────
function handleVisitMessage() {
  const msgEl = document.getElementById('visit-message');
  if (!msgEl) return;

  const lastVisit = localStorage.getItem('discoverLastVisit');
  const now = Date.now();
  let message = '';

  if (!lastVisit) {
    // First visit
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const diffMs = now - Number(lastVisit);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      message = 'Back so soon! Awesome!';
    } else if (diffDays === 1) {
      message = 'You last visited 1 day ago.';
    } else {
      message = `You last visited ${diffDays} days ago.`;
    }
  }

  localStorage.setItem('discoverLastVisit', now);
  msgEl.textContent = message;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
buildCards();
handleVisitMessage();
