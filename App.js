/* ============================================================
   PhoneLens — app.js
   ============================================================ */

const API_BASE = 'https://openapi.programming-hero.com/api';
let currentPhones = [];

/* ── Utilities ─────────────────────────────────────────────── */

function setStatus(html) {
  document.getElementById('statusText').innerHTML = html;
}

function setLoading(on) {
  document.getElementById('spinner').classList.toggle('active', on);
}

function staggerDelay(cards) {
  cards.forEach((c, i) => (c.style.animationDelay = `${i * 0.04}s`));
}

/* ── API Helpers ────────────────────────────────────────────── */

async function fetchPhones(query) {
  const res  = await fetch(`${API_BASE}/phones?search=${encodeURIComponent(query)}`, { mode: 'cors' });
  const data = await res.json();
  return data.data || [];
}

async function fetchPhoneDetail(slug) {
  const res  = await fetch(`${API_BASE}/phone/${encodeURIComponent(slug)}`, { mode: 'cors' });
  const data = await res.json();
  return data.data || null;
}

/* ── Search ─────────────────────────────────────────────────── */

async function handleSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) { setStatus('Please enter a search term.'); return; }

  setLoading(true);
  setStatus(`Searching for <strong>${q}</strong>…`);
  document.getElementById('phonesGrid').innerHTML = '';

  try {
    const phones = await fetchPhones(q);
    currentPhones = phones;

    if (!phones.length) {
      setStatus(`No results for <strong>${q}</strong>`);
      renderEmpty('No phones found', 'Try a different brand or model name.');
      return;
    }

    if (phones.length === 1) {
      setStatus(`1 result for <strong>${q}</strong> — showing full details`);
      await renderSingleDetailCard(phones[0]);
    } else {
      setStatus(`<strong>${phones.length}</strong> phones found for <strong>${q}</strong>`);
      renderCards(phones);
    }
  } catch (err) {
    console.error('Search error:', err);
    setStatus('Failed to fetch. Check your internet connection.');
    renderEmpty('Connection Error', 'Make sure you are connected to the internet and try again.');
  } finally {
    setLoading(false);
  }
}

/* ── Show All ───────────────────────────────────────────────── */

async function handleShowAll() {
  setLoading(true);
  setStatus('Loading all phones…');
  document.getElementById('phonesGrid').innerHTML = '';

  const brands = ['samsung', 'apple', 'oppo', 'xiaomi', 'nokia', 'motorola', 'pixel', 'oneplus', 'vivo', 'realme'];
  const seen   = new Set();
  const all    = [];

  try {
    const results = await Promise.all(brands.map(b => fetchPhones(b)));
    results.flat().forEach(p => {
      if (!seen.has(p.slug)) { seen.add(p.slug); all.push(p); }
    });
    currentPhones = all;
    setStatus(`Showing all <strong>${all.length}</strong> phones`);
    renderCards(all);
  } catch (err) {
    console.error('Show all error:', err);
    setStatus('Could not load all phones.');
    renderEmpty('Connection Error', 'Make sure you are connected to the internet and try again.');
  } finally {
    setLoading(false);
  }
}

/* ── Render Cards ───────────────────────────────────────────── */

function renderCards(phones) {
  const grid = document.getElementById('phonesGrid');
  grid.innerHTML = '';

  phones.forEach(p => {
    const card = document.createElement('div');
    card.className = 'phone-card';
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.phone_name}"
             onerror="this.src='https://placehold.co/100x160/1a1c25/6b7080?text=Phone'" />
      </div>
      <div class="card-body">
        <p class="card-brand">${p.brand || 'Unknown'}</p>
        <p class="card-name">${p.phone_name}</p>
        <p class="card-slug">${p.slug}</p>
      </div>
      <div class="card-footer">
        <span class="card-detail-btn">View Details →</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(p.slug, p.phone_name, p.image, p.brand));
    grid.appendChild(card);
  });

  staggerDelay(Array.from(grid.querySelectorAll('.phone-card')));
}

/* ── Single result: inline detail card ─────────────────────── */

async function renderSingleDetailCard(phone) {
  const grid = document.getElementById('phonesGrid');
  grid.innerHTML = `<div class="empty-state"><div class="spinner active"></div></div>`;

  try {
    const detail = await fetchPhoneDetail(phone.slug);
    grid.innerHTML = '';
    if (!detail) { renderEmpty('No detail', 'Could not load details.'); return; }

    const s    = detail.mainFeatures || {};
    const card = document.createElement('div');
    card.className = 'detail-card';
    card.innerHTML = `
      <img class="dc-img"
           src="${detail.image || phone.image}"
           alt="${detail.name}"
           onerror="this.src='https://placehold.co/100x160/1a1c25/6b7080?text=Phone'" />
      <div class="dc-info">
        <span class="dc-badge">${detail.brand || phone.brand || 'Phone'}</span>
        <p class="dc-name">${detail.name}</p>
        <div class="dc-specs">
          ${s.storage     ? `<div class="dc-spec"><span class="dc-spec-key">Storage</span><span class="dc-spec-val">${s.storage}</span></div>` : ''}
          ${s.displaySize ? `<div class="dc-spec"><span class="dc-spec-key">Display</span><span class="dc-spec-val">${s.displaySize}</span></div>` : ''}
          ${s.chipSet     ? `<div class="dc-spec"><span class="dc-spec-key">Chipset</span><span class="dc-spec-val">${s.chipSet}</span></div>` : ''}
          ${s.memory      ? `<div class="dc-spec"><span class="dc-spec-key">Memory</span><span class="dc-spec-val">${Array.isArray(s.memory) ? s.memory.join(', ') : s.memory}</span></div>` : ''}
          ${s.sensors     ? `<div class="dc-spec"><span class="dc-spec-key">Sensors</span><span class="dc-spec-val">${Array.isArray(s.sensors) ? s.sensors.slice(0,3).join(', ') : s.sensors}</span></div>` : ''}
          ${detail.releaseDate ? `<div class="dc-spec"><span class="dc-spec-key">Released</span><span class="dc-spec-val">${detail.releaseDate}</span></div>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  } catch (err) {
    console.error('Detail card error:', err);
    renderEmpty('Error', 'Could not load detail.');
  }
}

/* ── Empty State ────────────────────────────────────────────── */

function renderEmpty(title, sub) {
  document.getElementById('phonesGrid').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">📭</div>
      <p class="empty-title">${title}</p>
      <p class="empty-sub">${sub}</p>
    </div>`;
}

/* ── Phone Detail Modal ─────────────────────────────────────── */

async function openModal(slug, name, img, brand) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent      = name;
  document.getElementById('modalBrand').textContent      = brand || '';
  document.getElementById('modalBrandBadge').textContent = brand || '';
  document.getElementById('modalImg').src                = img;
  document.getElementById('modalSpecs').innerHTML        = `<div style="color:var(--muted);font-size:.875rem;">Loading specs…</div>`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    const detail = await fetchPhoneDetail(slug);
    if (!detail) {
      document.getElementById('modalSpecs').innerHTML = '<p style="color:var(--muted)">No details available.</p>';
      return;
    }

    const s     = detail.mainFeatures || {};
    const specs = [
      { k: 'Chipset',   v: s.chipSet },
      { k: 'Storage',   v: s.storage },
      { k: 'Display',   v: s.displaySize },
      { k: 'Memory',    v: Array.isArray(s.memory)  ? s.memory.join(', ')  : s.memory },
      { k: 'Sensors',   v: Array.isArray(s.sensors) ? s.sensors.join(', ') : s.sensors },
      { k: 'OS',        v: detail.others?.os },
      { k: 'Bluetooth', v: detail.others?.bluetooth },
      { k: 'USB',       v: detail.others?.usb },
      { k: 'GPS',       v: detail.others?.gps },
      { k: 'NFC',       v: detail.others?.nfc },
      { k: 'Radio',     v: detail.others?.radio },
      { k: 'Released',  v: detail.releaseDate },
    ].filter(r => r.v);

    document.getElementById('modalImg').src = detail.image || img;
    document.getElementById('modalSpecs').innerHTML = specs.length
      ? specs.map(r => `
          <div class="spec-row">
            <span class="spec-key">${r.k}</span>
            <span class="spec-val">${r.v}</span>
          </div>`).join('')
      : '<p style="color:var(--muted);font-size:.875rem;">No detailed specs found.</p>';
  } catch (err) {
    console.error('Modal error:', err);
    document.getElementById('modalSpecs').innerHTML = '<p style="color:var(--muted)">Could not load specs.</p>';
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ── Sign In Modal ──────────────────────────────────────────── */

function openSignIn() {
  document.getElementById('signinOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSignIn() {
  document.getElementById('signinOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function handleSigninOverlay(e) {
  if (e.target === document.getElementById('signinOverlay')) closeSignIn();
}
function handleSigninSubmit() {
  const email = document.getElementById('signinEmail').value.trim();
  const pass  = document.getElementById('signinPass').value.trim();
  if (!email || !pass) { showToast('Please fill in all fields.'); return; }
  closeSignIn();
  showToast(`✓ Welcome back! Signed in as ${email}`);
}

/* ── Buy Modal ──────────────────────────────────────────────── */

function openBuyModal() {
  document.getElementById('buyOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBuyModal() {
  document.getElementById('buyOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function handleBuyOverlay(e) {
  if (e.target === document.getElementById('buyOverlay')) closeBuyModal();
}
function handleBuySubmit() {
  const name  = document.getElementById('buyName').value.trim();
  const email = document.getElementById('buyEmail').value.trim();
  const model = document.getElementById('buyModel').value.trim();
  if (!name || !email || !model) { showToast('Please fill in all fields.'); return; }
  closeBuyModal();
  showToast(`🛒 Order placed for ${model}! Confirmation sent to ${email}`);
}

/* ── Toast ──────────────────────────────────────────────────── */

function showToast(msg) {
  const t = document.createElement('div');
  t.className   = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ── Keyboard shortcut ──────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });

  /* ── Default load ── */
  (async () => {
    setLoading(true);
    setStatus('Loading phones…');
    try {
      const phones = await fetchPhones('samsung');
      currentPhones = phones;
      if (phones.length) {
        setStatus(`Showing <strong>${phones.length}</strong> default phones — search or click any card`);
        renderCards(phones);
      } else {
        setStatus('No phones returned. Try searching manually.');
        renderEmpty('No default phones', 'Use the search bar above.');
      }
    } catch (err) {
      console.error('Init error:', err);
      setStatus('Could not load phones. Check your internet connection.');
      renderEmpty('Connection Error', 'Make sure you are online, then refresh the page.');
    } finally {
      setLoading(false);
    }
  })();
});