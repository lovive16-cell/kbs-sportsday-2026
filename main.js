// ---------- slide deck navigation ----------
const deck = document.getElementById('deck');
const slides = Array.from(deck.querySelectorAll('.slide'));
const progressRow = document.getElementById('progressRow');
const slideStatus = document.getElementById('slideStatus');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

slides.forEach(() => {
  const seg = document.createElement('div');
  seg.className = 'seg';
  seg.innerHTML = '<span class="fill"></span>';
  progressRow.appendChild(seg);
});
const segments = Array.from(progressRow.querySelectorAll('.seg'));
segments.forEach((seg, i) => {
  seg.addEventListener('click', () => goTo(i));
  seg.style.cursor = 'pointer';
});

function currentIndex(){
  return Math.round(deck.scrollLeft / deck.clientWidth);
}

function goTo(i){
  const idx = Math.max(0, Math.min(slides.length - 1, i));
  deck.scrollTo({ left: idx * deck.clientWidth, behavior: 'smooth' });
}

function updateUI(){
  const idx = currentIndex();
  segments.forEach((seg, i) => {
    const fill = seg.querySelector('.fill');
    fill.style.width = i < idx ? '100%' : i === idx ? '100%' : '0%';
    fill.style.opacity = i <= idx ? '1' : '0.35';
  });
  slideStatus.textContent = `${idx + 1} / ${slides.length}`;
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === slides.length - 1;
}

let scrollRaf = null;
deck.addEventListener('scroll', () => {
  if (scrollRaf) return;
  scrollRaf = requestAnimationFrame(() => {
    updateUI();
    scrollRaf = null;
  });
});
window.addEventListener('resize', updateUI);

prevBtn.addEventListener('click', () => goTo(currentIndex() - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex() + 1));

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goTo(currentIndex() + 1);
  if (e.key === 'ArrowLeft') goTo(currentIndex() - 1);
});

document.querySelectorAll('[data-goto]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.goto;
    const idx = slides.findIndex((s) => s.id === targetId);
    if (idx >= 0) goTo(idx);
  });
});

updateUI();

// ---------- countdown ----------
const EVENT_TIME = new Date('2026-10-24T13:00:00+09:00').getTime();
function renderDday(){
  const diffDays = Math.ceil((EVENT_TIME - Date.now()) / 86400000);
  const el = document.getElementById('ddayNum');
  if (!el) return;
  if (diffDays > 0) el.textContent = 'D-' + diffDays;
  else if (diffDays === 0) el.textContent = 'D-DAY';
  else el.textContent = '종료';
}
renderDday();
setInterval(renderDday, 60000);

// ---------- checklist (persisted per browser) ----------
const CHECK_KEY = 'kbs-sportsday-checklist';
let checkedState = {};
try { checkedState = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}'); } catch (e) {}
document.querySelectorAll('.check-item').forEach((item) => {
  const id = item.dataset.id;
  const input = item.querySelector('input');
  input.checked = !!checkedState[id];
  input.addEventListener('change', () => {
    checkedState[id] = input.checked;
    localStorage.setItem(CHECK_KEY, JSON.stringify(checkedState));
  });
});

// ---------- notices ----------
function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

fetch('data/notices.json')
  .then((res) => res.json())
  .then((notices) => {
    const list = document.getElementById('noticeList');
    if (!Array.isArray(notices) || notices.length === 0) {
      list.innerHTML = '<p class="empty-note">등록된 공지사항이 없습니다.</p>';
      return;
    }
    const sorted = [...notices].sort((a, b) => (a.date < b.date ? 1 : -1));
    list.innerHTML = sorted.map((n) => `
      <div class="notice-card">
        <div class="n-date">${escapeHtml(n.date || '')}</div>
        <div class="n-title">${escapeHtml(n.title || '')}</div>
        <div class="n-body">${escapeHtml(n.body || '')}</div>
      </div>`).join('');
  })
  .catch(() => {
    const list = document.getElementById('noticeList');
    if (list) list.innerHTML = '<p class="empty-note">공지사항을 불러올 수 없습니다.</p>';
  });
