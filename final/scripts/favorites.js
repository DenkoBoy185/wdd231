// favorites.js – handles reading list (localStorage) + form + confirm modal

const LIST_KEY = 'readingList';

function getList()        { return JSON.parse(localStorage.getItem(LIST_KEY) || '[]'); }
function saveList(list)   { localStorage.setItem(LIST_KEY, JSON.stringify(list)); }

// ── Render Saved Reading List ───────────────────────────────────────
function renderList() {
  const list      = getList();
  const container = document.getElementById('reading-list');
  const countEl   = document.getElementById('list-count');

  if (countEl) countEl.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📖</span>
        <p>Your reading list is empty! Head to the
          <a href="catalog.html">Catalog</a> to add titles.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map((book, i) => `
    <article class="fav-card" data-index="${i}">
      <img
        src="${book.cover}"
        alt="Cover of ${book.title}"
        width="70"
        height="98"
        loading="lazy"
      >
      <div class="fav-info">
        <span class="fav-badge ${book.type}">${book.type === 'manga' ? 'MANGA' : 'BOOK'}</span>
        <h3 class="fav-title">${book.title}</h3>
        <p class="fav-author">by ${book.author}</p>
        <p class="fav-meta">${book.genre} · ⭐ ${book.rating}</p>
        <p class="fav-date">Added ${book.addedDate}</p>
      </div>
      <button
        class="remove-btn"
        data-index="${i}"
        aria-label="Remove ${book.title} from reading list"
        type="button"
      >✕</button>
    </article>
  `).join('');

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingIndex = Number(btn.dataset.index);
      const title  = getList()[pendingIndex]?.title ?? 'this title';
      document.getElementById('confirm-title').textContent = `"${title}"`;
      document.getElementById('confirm-modal').showModal();
    });
  });
}

// ── Confirm-Delete Modal ────────────────────────────────────────────
let pendingIndex = null;

document.getElementById('confirm-yes')?.addEventListener('click', () => {
  if (pendingIndex !== null) {
    const list = getList();
    list.splice(pendingIndex, 1);
    saveList(list);
    pendingIndex = null;
    document.getElementById('confirm-modal').close();
    renderList();
  }
});

document.getElementById('confirm-no')?.addEventListener('click', () => {
  pendingIndex = null;
  document.getElementById('confirm-modal').close();
});

// ── Recommend Form ──────────────────────────────────────────────────
const form = document.getElementById('recommend-form');
if (form) {
  // Set hidden timestamp when page loads
  const tsInput = document.getElementById('timestamp');
  if (tsInput) tsInput.value = new Date().toLocaleString();

  form.addEventListener('submit', () => {
    // Form uses method="get" → data flows to thankyou.html via URLSearchParams
    // No extra JS needed; just let it submit
  });
}

// ── Init ────────────────────────────────────────────────────────────
renderList();
