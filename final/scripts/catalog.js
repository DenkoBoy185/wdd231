// catalog.js – ES Module
// Fetches books.json, renders cards, handles filters, search, and modal

const DATA_URL = 'data/books.json';
let allBooks     = [];
let activeFilter = 'all';

// ── Fetch & Init ────────────────────────────────────────────────────
async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    allBooks = await response.json();
    renderCards(allBooks);
    setupFilters();
    setupSearch();
    setupModal();
    updateResultCount(allBooks.length);
  } catch (err) {
    console.error('Failed to load catalog data:', err);
    document.getElementById('catalog-grid').innerHTML =
      '<p class="error-msg">⚠️ Could not load the catalog. Please try again later.</p>';
  }
}

// ── Render Cards ────────────────────────────────────────────────────
function renderCards(books) {
  const grid = document.getElementById('catalog-grid');
  updateResultCount(books.length);

  if (books.length === 0) {
    grid.innerHTML = '<p class="no-results">No titles match your search or filter.</p>';
    return;
  }

  grid.innerHTML = books.map(book => `
    <article class="book-card" data-id="${book.id}">
      <span class="card-type-badge ${book.type}">${book.type === 'manga' ? 'MANGA' : 'BOOK'}</span>
      <figure class="card-cover">
        <img
          src="${book.cover}"
          alt="Cover of ${book.title}"
          width="200"
          height="280"
          loading="lazy"
        >
      </figure>
      <div class="card-body">
        <h2 class="card-title">${book.title}</h2>
        <p class="card-author">by ${book.author}</p>
        <div class="card-meta">
          <span class="card-genre">${book.genre}</span>
          <span class="card-year">${book.year}</span>
        </div>
        <div class="card-rating" aria-label="Rating: ${book.rating} out of 5">
          ${renderStars(book.rating)}
          <span class="rating-num">${book.rating}</span>
        </div>
      </div>
      <button class="details-btn" data-id="${book.id}" aria-haspopup="dialog" type="button">
        View Details
      </button>
    </article>
  `).join('');

  // Attach click listeners to all detail buttons
  grid.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(Number(btn.dataset.id)));
  });
}

// ── Star Renderer ───────────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = (rating % 1) >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

// ── Result Count ────────────────────────────────────────────────────
function updateResultCount(count) {
  const el = document.getElementById('result-count');
  if (el) el.textContent = `${count} title${count !== 1 ? 's' : ''} found`;
}

// ── Filter Buttons ──────────────────────────────────────────────────
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });
}

// ── Search ──────────────────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', applyFilters);
}

function applyFilters() {
  const query = (document.getElementById('search-input')?.value || '').toLowerCase();

  const filtered = allBooks.filter(book => {
    const matchesType =
      activeFilter === 'all' ||
      book.type === activeFilter ||
      book.genre.toLowerCase() === activeFilter;

    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });

  renderCards(filtered);
}

// ── Modal ───────────────────────────────────────────────────────────
let currentBook = null;

function setupModal() {
  const modal    = document.getElementById('item-modal');
  const closeBtn = document.getElementById('modal-close');
  const addBtn   = document.getElementById('modal-add-btn');

  closeBtn.addEventListener('click', () => modal.close());

  // Close on backdrop click
  modal.addEventListener('click', e => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (clickedOutside) modal.close();
  });

  addBtn.addEventListener('click', () => {
    if (!currentBook) return;
    const list = getSavedList();
    if (list.some(b => b.id === currentBook.id)) return;

    list.push({
      id:        currentBook.id,
      title:     currentBook.title,
      author:    currentBook.author,
      type:      currentBook.type,
      genre:     currentBook.genre,
      rating:    currentBook.rating,
      cover:     currentBook.cover,
      addedDate: new Date().toLocaleDateString()
    });
    localStorage.setItem('readingList', JSON.stringify(list));

    addBtn.textContent  = '✓ In Your Reading List';
    addBtn.disabled     = true;
    addBtn.classList.add('added');
  });
}

function getSavedList() {
  return JSON.parse(localStorage.getItem('readingList') || '[]');
}

function openModal(id) {
  currentBook = allBooks.find(b => b.id === id);
  if (!currentBook) return;

  const b          = currentBook;
  const lengthText = b.type === 'manga' ? `${b.volumes} volumes` : `${b.pages} pages`;
  const isInList   = getSavedList().some(s => s.id === b.id);
  const statusMap  = { completed: 'Completed', reading: 'Currently Reading', 'plan-to-read': 'Plan to Read' };

  document.getElementById('modal-cover').src        = b.cover.replace('/200/280', '/240/336');
  document.getElementById('modal-cover').alt        = `Cover of ${b.title}`;
  document.getElementById('modal-title').textContent = b.title;
  document.getElementById('modal-author').textContent = `by ${b.author}`;
  document.getElementById('modal-type').textContent  = b.type === 'manga' ? 'MANGA' : 'BOOK';
  document.getElementById('modal-type').className   = `modal-type-badge ${b.type}`;
  document.getElementById('modal-genre').textContent  = b.genre;
  document.getElementById('modal-year').textContent   = b.year;
  document.getElementById('modal-length').textContent = lengthText;
  document.getElementById('modal-rating').innerHTML  =
    `${renderStars(b.rating)} <span class="modal-rating-num">${b.rating}/5</span>`;
  document.getElementById('modal-desc').textContent   = b.description;
  document.getElementById('modal-status').textContent = statusMap[b.status] || b.status;

  // Tags
  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = (b.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

  const addBtn = document.getElementById('modal-add-btn');
  if (isInList) {
    addBtn.textContent = '✓ In Your Reading List';
    addBtn.disabled    = true;
    addBtn.classList.add('added');
  } else {
    addBtn.textContent = '+ Add to Reading List';
    addBtn.disabled    = false;
    addBtn.classList.remove('added');
  }

  document.getElementById('item-modal').showModal();
}

init();
