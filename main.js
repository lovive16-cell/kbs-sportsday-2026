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
