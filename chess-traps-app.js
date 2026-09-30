/* ═══════════════════════════════════════════════════════
   ШАХОВІ ПАСТКИ — SMART CHESS SYSTEM®
   Файл: chess-traps-app.js
   Логіка: авторизація, фази, озвучення, меню,
           тренерська панель, PGN-парсер
═══════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────
   КОНСТАНТИ
─────────────────────────────────────────────────────── */
const TEACHER_PASSWORD = 'debut2025';
const KEY_USER         = 'scs_user';
const KEY_PROGRESS     = 'scs_progress_';
const KEY_CUSTOM_TRAPS = 'scs_custom_traps';

/* ───────────────────────────────────────────────────────
   СТАН ДОДАТКУ
─────────────────────────────────────────────────────── */
let lang         = 'uk';       // 'uk' | 'en'
let currentUser  = null;       // { name, role }
let currentTrap  = 0;          // індекс поточної пастки
let currentPhase = 1;          // 1=пояснення 2=вправа 3=тест
let phaseStep    = 0;          // крок всередині фази
let hintUsed     = false;
let testErrors   = 0;
let stepResults  = [];         // 'correct'|'hint'|'wrong'|null
let awaitingMove = false;
let board        = null;
let game         = null;
let totalCorrect = 0;

let loginRole    = 'student';  // роль на екрані входу
let ALL_TRAPS    = [];         // вбудовані + власні
let trapProgress = [];         // [{ p1, p2, p3 }]
let customTraps  = [];         // пастки тренера

/* ───────────────────────────────────────────────────────
   АВТОРИЗАЦІЯ
─────────────────────────────────────────────────────── */
function setLoginRole(role) {
  loginRole = role;
  el('roleTabTeacher').classList.toggle('active', role === 'teacher');
  el('roleTabStudent').classList.toggle('active', role === 'student');
  el('teacherFields').style.display = role === 'teacher' ? '' : 'none';
  el('studentFields').style.display = role === 'student' ? '' : 'none';
  el('loginErr').textContent = '';
}

function doLogin() {
  const err = el('loginErr');
  err.textContent = '';

  if (loginRole === 'teacher') {
    const pass = el('teacherPass').value;
    if (pass !== TEACHER_PASSWORD) {
      err.textContent = 'Невірний пароль тренера';
      el('teacherPass').value = '';
      el('teacherPass').focus();
      return;
    }
    currentUser = { name: 'Тренер', role: 'teacher' };
  } else {
    const name = el('studentName').value.trim();
    if (!name || name.length < 2) {
      err.textContent = 'Введіть ваше ім\'я (мінімум 2 символи)';
      return;
    }
    currentUser = { name, role: 'student' };
  }

  try { localStorage.setItem(KEY_USER, JSON.stringify(currentUser)); } catch (e) {}
  startApp();
}

function doLogout() {
  currentUser = null;
  try { localStorage.removeItem(KEY_USER); } catch (e) {}
  el('loginScreen').style.display = 'flex';
  el('appScreen').style.display   = 'none';
  el('teacherPass').value  = '';
  el('studentName').value  = '';
  el('loginErr').textContent = '';
  setLoginRole('student');
}

function tryRestoreSession() {
  try {
    const saved = localStorage.getItem(KEY_USER);
    if (saved) { currentUser = JSON.parse(saved); return true; }
  } catch (e) {}
  return false;
}

/* ───────────────────────────────────────────────────────
   СТАРТ ДОДАТКУ
─────────────────────────────────────────────────────── */
function startApp() {
  el('loginScreen').style.display = 'none';
  el('appScreen').style.display   = 'block';

  // Значок ролі у хедері
  const badge = el('userRoleBadge');
  badge.textContent = currentUser.role === 'teacher' ? '👨‍🏫 Тренер' : '🎓 Учень';
  badge.className   = 'user-role ' + currentUser.role;
  el('userNameBadge').textContent = currentUser.name;

  // Кнопка тренера — лише для тренера
  const tBtn = el('teacherPanelBtn');
  if (tBtn) tBtn.style.display = currentUser.role === 'teacher' ? 'block' : 'none';

  // Завантажуємо власні пастки та прогрес
  loadCustomTraps();
  ALL_TRAPS    = [...TRAPS, ...customTraps];
  trapProgress = ALL_TRAPS.map(() => ({ p1: false, p2: false, p3: 0 }));
  loadProgress();

  // Запускаємо — показуємо сітку плиток
  loadTrap();
  showGridScreen();
  renderMenu();
  renderTeacherList();
}


// ── Іконки для плиток за типом відкриття ────────────
const TRAP_ICONS = [
  '♞','♝','♜','♛','♚','♟', // шахові фігури
  '⚔️','🗡️','🏹','🎯','💥','⚡',
  '🔥','🌪️','💎','👑','🏆','⭐',
  '🎪','🎭','🎨','🎬','🎲','🎮',
];

function getTrapIcon(trap, idx) {
  // За типом дебюту — відповідна фігура
  const name = (trap.name?.uk || '').toLowerCase();
  const opening = (trap.opening?.uk || '').toLowerCase();
  if (opening.includes('італ') || opening.includes('іспан')) return '♗';
  if (opening.includes('сицил')) return '♞';
  if (opening.includes('французьк')) return '♜';
  if (opening.includes('каро')) return '♝';
  if (opening.includes('піркц') || opening.includes('модерн')) return '♟';
  if (opening.includes('скандинав')) return '⚔️';
  if (opening.includes('алехін')) return '♞';
  if (opening.includes('ферзев') || opening.includes('ферзів')) return '♛';
  if (opening.includes('король')) return '♔';
  if (opening.includes('захист короля') || opening.includes('кіз')) return '♔';
  if (opening.includes('англійськ')) return '🏰';
  if (opening.includes('реті')) return '🎯';
  if (opening.includes('польськ') || opening.includes('орангутан')) return '🐒';
  if (opening.includes('дракон')) return '🐉';
  if (opening.includes('будапешт')) return '🏛️';
  if (opening.includes('голланд')) return '🌷';
  if (opening.includes('бенькоц')) return '⚡';
  if (opening.includes('грюнфельд')) return '♟';
  if (opening.includes('слов') || opening.includes('напів')) return '🛡️';
  if (opening.includes('гамбіт')) return '💥';
  if (opening.includes('петров')) return '🔱';
  if (opening.includes('німц')) return '🏹';
  // За номером — чергуємо
  const icons = ['♞','♝','♜','♛','♗','♙','⚔️','🎯','💥','⭐','🏆','👑','🔥','⚡','💎','🌟','🎪','🎭','🏰','🐉'];
  return icons[idx % icons.length];
}

// ── СІТКА ПЛИТОК ─────────────────────────────────────
function showGridScreen() {
  el('trapsGridScreen').style.display = 'block';
  el('appMain').style.display         = 'none';
  if (el('mobileInfo')) el('mobileInfo').style.display = 'none';
  // Ховаємо progress-bar (він тільки для екрану навчання)
  const pw = document.querySelector('.progress-wrap');
  if (pw) pw.style.display = 'none';
  renderTrapGrid();
  window.scrollTo(0, 0);
}

function showTrapScreen() {
  el('trapsGridScreen').style.display = 'none';
  el('appMain').style.display         = 'block';
  // Показуємо progress-bar
  const pw = document.querySelector('.progress-wrap');
  if (pw) pw.style.display = '';
  window.scrollTo(0, 0);
}

function renderTrapGrid() {
  const grid   = el('trapsGrid');
  const stats  = el('trapsGridStats');
  if (!grid) return;

  const done    = trapProgress.filter(p => p?.p3 > 0).length;
  const perfect = trapProgress.filter(p => p?.p3 === 3).length;
  if (stats) stats.textContent = `${done} / ${ALL_TRAPS.length} вивчено · ${perfect} ідеально`;

  grid.innerHTML = ALL_TRAPS.map((trap, i) => {
    const p    = trapProgress[i] || {};
    const icon = getTrapIcon(trap, i);

    // Визначаємо стан плитки
    let tileClass = 'trap-tile';
    let stars     = '';
    if (i === currentTrap) tileClass += ' current';
    if (p.p3 === 3)        { tileClass += ' perfect'; stars = '⭐⭐⭐'; }
    else if (p.p3 === 2)   { tileClass += ' done';    stars = '⭐⭐'; }
    else if (p.p3 === 1)   { tileClass += ' done';    stars = '⭐'; }
    else if (p.p1 || p.p2) tileClass += ' partial';

    // Три крапки фаз
    const d1 = p.p1 ? 'done' : '';
    const d2 = p.p2 ? 'done' : '';
    const d3 = p.p3 === 3 ? 'perfect' : p.p3 > 0 ? 'done' : '';

    const pgn = trap.custom ? '<span class="trap-tile-pgn">PGN</span>' : '';
    const crn = p.p3 === 3  ? '<span class="trap-tile-crown">👑</span>' : '';

    const name = (trap.name?.uk || trap.name || '').replace(/Пастка\s*/i, '').trim();

    return `<div class="${tileClass}" onclick="openTrap(${i})">
      ${crn}${pgn}
      <div class="trap-tile-num">#${i + 1}</div>
      <span class="trap-tile-icon">${icon}</span>
      <div class="trap-tile-name">${name}</div>
      <span class="trap-tile-stars">${stars}</span>
      <div class="trap-tile-phases">
        <div class="trap-tile-phase-dot ${d1}" title="Пояснення"></div>
        <div class="trap-tile-phase-dot ${d2}" title="Вправа"></div>
        <div class="trap-tile-phase-dot ${d3}" title="Тест"></div>
      </div>
    </div>`;
  }).join('');
}

function openTrap(idx) {
  currentTrap  = idx;
  currentPhase = 1;
  showTrapScreen();
  loadTrap();
}

/* ───────────────────────────────────────────────────────
   ПРОГРЕС — localStorage
─────────────────────────────────────────────────────── */
function loadProgress() {
  try {
    const key   = KEY_PROGRESS + (currentUser?.name || 'guest');
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    saved.forEach((p, i) => {
      if (trapProgress[i]) trapProgress[i] = { ...trapProgress[i], ...p };
    });
  } catch (e) {}
}

function saveProgress() {
  try {
    const key = KEY_PROGRESS + (currentUser?.name || 'guest');
    localStorage.setItem(key, JSON.stringify(trapProgress));
  } catch (e) {}
}

/* ───────────────────────────────────────────────────────
   ВЛАСНІ ПАСТКИ ТРЕНЕРА — localStorage
─────────────────────────────────────────────────────── */
function loadCustomTraps() {
  try { customTraps = JSON.parse(localStorage.getItem(KEY_CUSTOM_TRAPS) || '[]'); }
  catch (e) { customTraps = []; }
}

function saveCustomTraps() {
  try { localStorage.setItem(KEY_CUSTOM_TRAPS, JSON.stringify(customTraps)); }
  catch (e) {}
}

/* ── PGN-парсер ─────────────────────────────── */
function parsePGN(pgn) {
  // Зчитуємо теги [Tag "Value"]
  const tags  = {};
  const tagRe = /\[(\w+)\s+"([^"]*)"\]/g;
  let m;
  while ((m = tagRe.exec(pgn)) !== null) tags[m[1]] = m[2];

  // Витягуємо хоти (видаляємо теги, коментарі, номери)
  const moveText = pgn
    .replace(/\[.*?\]/gs, '')
    .replace(/\{[^}]*\}/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\$\d+/g, '')
    .replace(/\d+\.\s*/g, ' ')
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = moveText.split(' ').filter(t => t.length > 0 && !/^\d+$/.test(t));
  const steps  = [];
  const g      = new Chess();

  for (const san of tokens) {
    const move = g.move(san);
    if (!move) continue;
    const n = steps.length + 1;
    steps.push({
      question: { uk: `Хід ${n}: ${san}`, en: `Move ${n}: ${san}` },
      move:     move.from + move.to,
      san,
      hint: { uk: `Зробіть хід ${san}`, en: `Play ${san}` }
    });
  }
  return { steps, tags };
}

function addTrapFromPGN() {
  const pgn    = el('pgnInput').value.trim();
  const name   = el('pgnName').value.trim();
  const white  = el('pgnWhite').value.trim();
  const black  = el('pgnBlack').value.trim();

  if (!pgn)  { pgnStatus('err', 'Вставте PGN!'); return; }
  if (!name) { pgnStatus('err', 'Введіть назву пастки!'); return; }

  const { steps, tags } = parsePGN(pgn);
  if (steps.length < 2) { pgnStatus('err', 'Не вдалось розпізнати ходи — перевірте PGN'); return; }

  const newTrap = {
    id:       ALL_TRAPS.length + 1,
    name:     { uk: name, en: name },
    opening:  { uk: tags.Opening || '—', en: tags.Opening || '—' },
    desc:     {
      uk: `${tags.White || '?'} проти ${tags.Black || '?'}. ${steps.length} ходів.`,
      en: `${tags.White || '?'} vs ${tags.Black || '?'}. ${steps.length} moves.`
    },
    white:    { uk: white ? [white] : ['Активна гра'], en: white ? [white] : ['Active play'] },
    black:    { uk: black ? [black] : ['Захист'],      en: black ? [black] : ['Defense'] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps,
    custom:   true,
    pgn,
    addedAt:  new Date().toISOString()
  };

  customTraps.push(newTrap);
  saveCustomTraps();

  ALL_TRAPS = [...TRAPS, ...customTraps];
  trapProgress.push({ p1: false, p2: false, p3: 0 });

  // Очищаємо форму
  ['pgnInput', 'pgnName', 'pgnWhite', 'pgnBlack'].forEach(id => el(id).value = '');

  pgnStatus('ok', `✓ Пастку додано (${steps.length} ходів)`);
  setTimeout(() => pgnStatus('', ''), 4000);

  renderTeacherList();
  renderMenu();
}

function deleteTrap(idx) {
  const trap = ALL_TRAPS[idx];
  if (!trap?.custom) return;
  if (!confirm(`Видалити пастку "${trap.name.uk}"?`)) return;

  const ci = customTraps.indexOf(trap);
  if (ci !== -1) customTraps.splice(ci, 1);
  saveCustomTraps();

  ALL_TRAPS = [...TRAPS, ...customTraps];
  trapProgress.splice(idx, 1);
  saveProgress();

  if (currentTrap >= ALL_TRAPS.length) currentTrap = ALL_TRAPS.length - 1;
  renderTeacherList();
  renderMenu();
  loadTrap();
}

function pgnStatus(cls, msg) {
  const s = el('pgnStatus');
  if (!s) return;
  s.className   = cls ? `pgn-status ${cls}` : 'pgn-status';
  s.textContent = msg;
}

function renderTeacherList() {
  const container = el('teacherTrapList');
  if (!container) return;

  if (customTraps.length === 0) {
    container.innerHTML = `<div class="trap-empty">Поки немає власних пасток</div>`;
    return;
  }
  container.innerHTML = customTraps.map((t, ci) => {
    const realIdx = TRAPS.length + ci;
    return `<div class="trap-item">
      <div class="trap-item-info">
        <div class="trap-item-name">${t.name.uk}</div>
        <div class="trap-item-meta">${t.steps.length} ходів · PGN</div>
      </div>
      <button class="trap-item-del" onclick="deleteTrap(${realIdx})" title="Видалити">🗑</button>
    </div>`;
  }).join('');
}

/* ── ТРЕНЕРСЬКА МОДАЛКА ─────────────────────── */
function openTeacherPanel() {
  el('teacherOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTeacherPanel() {
  el('teacherOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeTeacherBg(e) {
  if (e.target === el('teacherOverlay')) closeTeacherPanel();
}

/* ───────────────────────────────────────────────────────
   МЕНЮ-ЗМІСТ
─────────────────────────────────────────────────────── */
function openMenu() {
  renderMenu();
  el('menuOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  el('menuOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeMenuBg(e) {
  if (e.target === el('menuOverlay')) closeMenu();
}

function renderMenu() {
  const done = trapProgress.filter(p => p?.p3 > 0).length;
  el('menuTitle').textContent    = 'Зміст пасток';
  el('menuScoreBar').innerHTML   = `Вивчено: <span>${done} / ${ALL_TRAPS.length}</span>`;

  el('menuList').innerHTML = ALL_TRAPS.map((t, i) => {
    const p      = trapProgress[i] || {};
    const isCur  = i === currentTrap;
    const stars  = p.p3 === 3 ? '⭐⭐⭐' : p.p3 === 2 ? '⭐⭐' : p.p3 === 1 ? '⭐' : '☆☆☆';
    const ph1    = p.p1 ? '👁' : '○';
    const ph2    = p.p2 ? '✏️' : '○';
    const src    = t.custom ? '<span class="menu-item-src">PGN</span>' : '';
    const nm     = t.name.uk;
    const op     = t.opening.uk.split('—')[0].trim();
    return `<div class="menu-item${isCur ? ' active' : ''}" onclick="jumpToTrap(${i})">
      <div class="menu-item-num">${i + 1}</div>
      <div class="menu-item-info">
        <div class="menu-item-name">${nm}</div>
        <div class="menu-item-open">${op}</div>
        <div class="menu-item-prog">${ph1} ${ph2} ${stars}</div>
      </div>${src}
    </div>`;
  }).join('');
}

function jumpToTrap(i) {
  currentTrap  = i;
  currentPhase = 1;
  closeMenu();
  showTrapScreen();
  loadTrap();
}

function prevTrap() {
  if (currentTrap > 0) { currentTrap--; currentPhase = 1; loadTrap(); window.scrollTo(0, 0); }
}
function nextTrap() {
  currentTrap++;
  if (currentTrap >= ALL_TRAPS.length) { currentTrap = ALL_TRAPS.length - 1; showFinalScore(); return; }
  currentPhase = 1;
  loadTrap();
  window.scrollTo(0, 0);
}
function skipTrap() { nextTrap(); }

/* ───────────────────────────────────────────────────────
   ЗАВАНТАЖЕННЯ ПАСТКИ
─────────────────────────────────────────────────────── */
function loadTrap() {
  const trap = ALL_TRAPS[currentTrap];
  if (!trap) return;

  const sideIcon = (trap.playAs || 'white') === 'black' ? '⚫' : '⚪';
  const sideText = (trap.playAs || 'white') === 'black'
    ? 'Граєш за чорних' : 'Граєш за білих';
  setText('trapBadge',   `ПАСТКА #${trap.id} · ${sideIcon} ${sideText}`);
  setText('trapName',    trap.name.uk);
  setText('trapOpening', trap.opening.uk);
  setText('trapDesc',    trap.desc.uk);
  setText('trapDescM',   trap.desc.uk);

  setHTML('whiteInit',  trap.white.uk.map(t => `<li>${t}</li>`).join(''));
  setHTML('blackInit',  trap.black.uk.map(t => `<li>${t}</li>`).join(''));
  setHTML('whiteInitM', trap.white.uk.map(t => `<li>${t}</li>`).join(''));
  setHTML('blackInitM', trap.black.uk.map(t => `<li>${t}</li>`).join(''));

  setText('trapCounter', `${currentTrap + 1} / ${ALL_TRAPS.length}`);
  el('progressFill').style.width = `${(currentTrap / ALL_TRAPS.length) * 100}%`;
  el('prevBtn').disabled = (currentTrap === 0);
  setText('scoreBadge', `${totalCorrect} ✓`);

  // Статична дошка (орієнтована під сторону гравця)
  game = new Chess(trap.startFen);
  if (board) board.destroy();
  board = Chessboard('board', {
    position:    trap.startFen,
    draggable:   false,
    orientation: trap.orientation || 'white',
    pieceTheme:  'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    showNotation: true
  });

  updateMoveLine();
  hideCompletion();
  renderMenu();
  enterPhase(currentPhase);
}

/* ───────────────────────────────────────────────────────
   ФАЗОВИЙ ДВИГУН
─────────────────────────────────────────────────────── */
function enterPhase(ph) {
  currentPhase = ph;
  phaseStep    = 0;
  hintUsed     = false;
  testErrors   = 0;

  const trap = ALL_TRAPS[currentTrap];
  stepResults  = new Array(trap.steps.length).fill(null);

  game = new Chess(trap.startFen);
  if (board) board.position(trap.startFen, false);
  updateMoveLine();
  hideFeedback();
  hideCompletion();
  updatePhaseTabs();

  if (ph === 1) startExplain();
  else if (ph === 2) startPractice();
  else if (ph === 3) startTest();
}

function updatePhaseTabs() {
  const p  = trapProgress[currentTrap] || {};
  const ph = currentPhase;

  const tabs = [
    { n: 1, icon: '👁',  label: 'Пояснення' },
    { n: 2, icon: '✏️', label: 'Вправа' },
    { n: 3, icon: '🎯', label: 'Тест' },
  ];

  const html = tabs.map(t => {
    const isDone = (t.n === 1 && p.p1 && ph > 1)
                || (t.n === 2 && p.p2 && ph > 2)
                || (t.n === 3 && p.p3 > 0 && ph !== 3);
    const cls = 'phase-tab'
      + (ph === t.n  ? ' active' : '')
      + (isDone && ph !== t.n ? ' done' : '');
    return `<div class="${cls}" onclick="onTabClick(${t.n})">
      <span class="tab-icon">${t.icon}</span>
      <span class="tab-label">${t.label}</span>
    </div>`;
  }).join('');

  setHTML('phaseTabsDesktop', html);
  setHTML('phaseTabsMobile',  html);
}

function onTabClick(n) {
  const p = trapProgress[currentTrap] || {};
  if (n === 1) { enterPhase(1); return; }
  if (n === 2 && (p.p1 || currentPhase >= 2)) { enterPhase(2); return; }
  if (n === 3 && (p.p2 || currentPhase >= 3)) { enterPhase(3); return; }
  showFeedback('hint', '🔒', 'Спочатку пройди попередню фазу!');
}

/* ── ФАЗА 1: ПОЯСНЕННЯ ──────────────────────── */
// Відтворюємо ВСІ ходи партії (allMoves)

let explainPaused  = false;
let explainSpeed   = 1;      // коефіцієнт швидкості
const SPEEDS       = [0.5, 1, 1.5, 2, 3];
const SPEED_LABELS = ['🐢 ×½','🐢 ×1','🐇 ×1.5','🐇 ×2','⚡ ×3'];
let explainTimer   = null;   // поточний setTimeout

function startExplain() {
  setText2('qLabel', 'ФАЗА 1 — ПОЯСНЕННЯ');
  setText2('qText',  '👁 Дивись та запам\'ятовуй — пастка розгортається автоматично');
  disableBtn('nextBtn', true);
  disableBtn('hintBtn', true);
  showSkipBtn(true);
  explainPaused = false;
  explainSpeed  = 1;
  phaseStep     = 0;
  updateSpeedBtn();
  showExplainControls(true);
  hideEval();
  renderExplainDots();
  if (explainTimer) clearTimeout(explainTimer);
  explainTimer = setTimeout(animAllMoves, 600);
}

// Показуємо/ховаємо контролі
function showExplainControls(show) {
  const e = el('explainControls');
  if (e) e.style.display = show ? 'flex' : 'none';
}

// Оновлюємо кнопку швидкості
function updateSpeedBtn() {
  const idx   = SPEEDS.indexOf(explainSpeed);
  const label = SPEED_LABELS[idx] || '🐢 ×1';
  ['ctrlSpeed'].forEach(id => {
    const e = el(id); if (e) e.textContent = label;
  });
  document.querySelectorAll('.ctrl-speed').forEach(e => e.textContent = label);
}

// Оновлюємо лічильник ходів
function updateCtrlCounter() {
  const trap  = ALL_TRAPS[currentTrap];
  const total = (trap?.allMoves || []).length;
  const e = el('ctrlCounter');
  if (e) e.textContent = `${phaseStep} / ${total}`;
}

// Цикл швидкостей
function cycleSpeed() {
  const idx    = SPEEDS.indexOf(explainSpeed);
  explainSpeed = SPEEDS[(idx + 1) % SPEEDS.length];
  updateSpeedBtn();
}

// Пауза / Старт
function explainToggle() {
  if (explainPaused) {
    explainPaused = false;
    updatePlayBtn(false);
    if (explainTimer) clearTimeout(explainTimer);
    explainTimer = setTimeout(animAllMoves, 50);
  } else {
    explainPaused = true;
    if (explainTimer) clearTimeout(explainTimer);
    updatePlayBtn(true);
  }
}

function updatePlayBtn(isPaused) {
  const icon = isPaused ? '▶' : '⏸';
  const e = el('ctrlPlay');
  if (e) e.textContent = icon;
}

// Перемотка на конкретний хід
function explainGoTo(step) {
  if (explainTimer) clearTimeout(explainTimer);
  explainPaused = true;
  updatePlayBtn(true);

  const trap = ALL_TRAPS[currentTrap];
  const allMoves = trap.allMoves || [];
  const allSan   = trap.allSan   || [];

  // Перевідтворюємо позицію до потрібного ходу
  game = new Chess(trap.startFen);
  for (let i = 0; i < step && i < allMoves.length; i++) {
    const u = allMoves[i];
    game.move({ from: u.substring(0,2), to: u.substring(2,4), promotion: u[4] || 'q' });
  }
  board.position(game.fen());
  updateMoveLine();
  phaseStep = step;
  if (step > 0 && step <= allMoves.length) {
    const uci  = allMoves[step - 1];
    const san  = allSan[step - 1] || '';
    const isW  = ((step-1) % 2 === 0);
    const pa   = trap.playAs || 'white';
    const mine = (pa==='white' && isW) || (pa==='black' && !isW);
    const side = mine ? '🎯 Твій хід' : (isW ? '⚪ Білі' : '⚫ Чорні');
    const num  = Math.floor((step-1)/2) + 1;
    const dots = isW ? '.' : '...';
    setText2('qText', `${side}: ${num}${dots} ${san.replace(/[!?]/g,'')}`);
    if (uci) hlSq(uci.substring(0,2), uci.substring(2,4));
  } else if (step === 0) {
    setText2('qText', '👁 Початкова позиція');
  }
  renderExplainDots();
  updateCtrlCounter();
  if (step >= allMoves.length) onExplainFinished();
}

function explainStepBack() {
  explainGoTo(Math.max(0, phaseStep - 1));
}
function explainStepFwd() {
  const trap = ALL_TRAPS[currentTrap];
  explainGoTo(Math.min((trap.allMoves||[]).length, phaseStep + 1));
}
function explainGoToEnd() {
  const trap = ALL_TRAPS[currentTrap];
  explainGoTo((trap.allMoves||[]).length);
}

function animAllMoves() {
  if (explainPaused) return;

  const trap     = ALL_TRAPS[currentTrap];
  const allMoves = trap.allMoves || [];
  const allSan   = trap.allSan   || [];
  const playAs   = trap.playAs   || 'white';

  if (phaseStep >= allMoves.length) {
    onExplainFinished();
    return;
  }

  const uci   = allMoves[phaseStep];
  const san   = allSan[phaseStep] || '';
  const from  = uci.substring(0, 2);
  const to    = uci.substring(2, 4);
  const promo = uci.length === 5 ? uci[4] : 'q';

  // Визначаємо чий хід
  const isWhiteMove = (phaseStep % 2 === 0);
  const isMyMove    = (playAs === 'white' && isWhiteMove) || (playAs === 'black' && !isWhiteMove);
  const sideIcon    = isMyMove ? '🎯' : (isWhiteMove ? '⚪' : '⚫');
  const sideName    = isMyMove ? 'Твій хід' : (isWhiteMove ? 'Білі' : 'Чорні');
  const moveNum     = Math.floor(phaseStep / 2) + 1;
  const dots        = isWhiteMove ? '.' : '...';
  const sanClean    = san.replace(/[!?]/g, '');

  // Показуємо хід у текстовому полі
  setText2('qText', `${sideIcon} ${sideName}: ${moveNum}${dots} ${sanClean}`);
  renderExplainDots();

  // Виконуємо хід
  const mv = game.move({ from, to, promotion: promo });
  if (mv) {
    hlSq(from, to);
    board.position(game.fen());
    updateMoveLine();
    speakMove(san);
  }

  phaseStep++;
  updateCtrlCounter();

  // Мій хід — довша пауза; всі паузи діляться на швидкість
  const base  = isMyMove ? 1400 : 900;
  const delay = Math.round(base / explainSpeed);
  if (explainTimer) clearTimeout(explainTimer);
  explainTimer = setTimeout(animAllMoves, delay);
}

// Крапки-прогрес: показуємо тільки ходи ГРАВЦЯ
// ── ЗАВЕРШЕННЯ ПОЯСНЕННЯ + STOCKFISH ────────────
function onExplainFinished() {
  trapProgress[currentTrap].p1 = true;
  saveProgress();
  renderMenu();
  updatePhaseTabs();
  setText2('qText', '✅ Пастку переглянуто! Тепер спробуй сам.');
  disableBtn('nextBtn', false);
  setLabel('nextBtn',  'До вправи →');
  setLabel('nextBtnM', 'До вправи →');
  showSkipBtn(false);
  renderExplainDots();
  updateCtrlCounter();
  updatePlayBtn(true);
  // Запускаємо Stockfish аналіз
  runStockfishEval();
}

function hideEval() {
  const w = el('evalBarWrap'); if (w) w.classList.remove('show');
  const s = el('evalSpinner'); if (s) s.classList.remove('show');
}

// ── STOCKFISH через Lichess Cloud Eval API ────────
function runStockfishEval() {
  const fen = game.fen();
  const spinner = el('evalSpinner');
  const wrap    = el('evalBarWrap');
  if (spinner) spinner.classList.add('show');
  if (wrap)    wrap.classList.remove('show');

  // Lichess безкоштовний cloud eval API
  fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=1`)
    .then(r => r.json())
    .then(data => {
      if (spinner) spinner.classList.remove('show');
      const pvs = data.pvs || [];
      if (!pvs.length) { showEvalFallback(); return; }
      const cp = pvs[0].cp;
      const mate = pvs[0].mate;
      showEval(fen, cp, mate);
    })
    .catch(() => {
      if (spinner) spinner.classList.remove('show');
      showEvalFallback();
    });
}

function showEval(fen, cp, mate) {
  const wrap    = el('evalBarWrap');
  const score   = el('evalScore');
  const bar     = el('evalBarWhite');
  const verdict = el('evalVerdict');
  if (!wrap) return;

  let scoreText = '';
  let whitePercent = 50;
  let verdictText  = '';

  if (mate !== undefined && mate !== null) {
    // Мат
    const side = mate > 0 ? 'Білі' : 'Чорні';
    scoreText   = `М${Math.abs(mate)}`;
    whitePercent = mate > 0 ? 95 : 5;
    verdictText  = `<strong>${side} ставлять мат через ${Math.abs(mate)} ходів!</strong>`;
  } else if (cp !== undefined) {
    // Сантипішаки → пішаки
    const pawns  = cp / 100;
    const absPawns = Math.abs(pawns);
    scoreText = (pawns >= 0 ? '+' : '') + pawns.toFixed(2);

    // Відсоток для бар (логарифмічна шкала)
    const sigmoid = x => 1 / (1 + Math.exp(-x / 250));
    whitePercent = Math.round(sigmoid(cp) * 100);

    // Вердикт
    const trap = ALL_TRAPS[currentTrap];
    const playAs = trap?.playAs || 'white';
    const winner = cp > 0 ? 'Білі' : 'Чорні';
    const loser  = cp > 0 ? 'Чорні' : 'Білі';

    if (absPawns < 0.3)      verdictText = '<strong>Рівна позиція</strong> — пастка не спрацювала?';
    else if (absPawns < 1.0) verdictText = `<strong>${winner} трохи краще</strong> (${scoreText} пішака)`;
    else if (absPawns < 2.0) verdictText = `<strong>${winner} мають перевагу</strong> — пастка спрацювала!`;
    else if (absPawns < 3.5) verdictText = `<strong>${winner} виграють</strong> — матеріальна перевага!`;
    else                      verdictText = `<strong>${winner} виграють</strong> — позиція безнадійна для ${loser}!`;
  }

  if (score)   score.textContent = scoreText;
  if (bar)     bar.style.width   = whitePercent + '%';
  if (verdict) verdict.innerHTML = verdictText;
  if (wrap)    wrap.classList.add('show');
}

function showEvalFallback() {
  // Якщо API недоступний — показуємо базову інформацію
  const trap   = ALL_TRAPS[currentTrap];
  const result = trap?.result || '*';
  const wrap    = el('evalBarWrap');
  const score   = el('evalScore');
  const bar     = el('evalBarWhite');
  const verdict = el('evalVerdict');
  if (!wrap) return;

  let scoreText = '?';
  let pct = 50;
  let txt = 'Оцінку завантажити не вдалось';

  if (result === '1-0')   { scoreText = '+↑'; pct = 80; txt = '<strong>Білі виграли</strong> цю партію'; }
  if (result === '0-1')   { scoreText = '-↑'; pct = 20; txt = '<strong>Чорні виграли</strong> цю партію'; }
  if (result === '1/2-1/2') { scoreText = '½'; pct = 50; txt = '<strong>Нічия</strong>'; }

  if (score)   score.textContent = scoreText;
  if (bar)     bar.style.width   = pct + '%';
  if (verdict) verdict.innerHTML = txt;
  if (wrap)    wrap.classList.add('show');
}

function renderExplainDots() {
  const trap   = ALL_TRAPS[currentTrap];
  const total  = (trap.allMoves || []).length;
  const playAs = trap.playAs || 'white';

  const myIndices = [];
  for (let i = 0; i < total; i++) {
    const isW  = (i % 2 === 0);
    const mine = (playAs === 'white' && isW) || (playAs === 'black' && !isW);
    if (mine) myIndices.push(i);
  }

  const html = myIndices.map((gIdx, n) => {
    let cls = 'step-dot';
    if (gIdx < phaseStep)       cls += ' done';
    else if (gIdx === phaseStep) cls += ' active';
    return `<div class="${cls}">${n + 1}</div>`;
  }).join('');

  setHTML('stepDots',  html);
  setHTML('stepDotsM', html);
}

function skipToPhase2() {
  explainPaused = true;
  if (explainTimer) { clearTimeout(explainTimer); explainTimer = null; }
  enterPhase(2);
}

/* ── ФАЗА 2: ВПРАВА ─────────────────────────── */
function startPractice() {
  setText2('qLabel', 'ФАЗА 2 — ВПРАВА');
  setText2('qText',  'Повтори пастку! Підказки доступні.');
  showSkipBtn(false);
  setLabel('nextBtn',  'Далі →');
  setLabel('nextBtnM', 'Далі →');
  disableBtn('nextBtn', true);
  disableBtn('hintBtn', false);
  makeBoardDraggable();
  renderDots();
  loadPlayStep();
}

/* ── ФАЗА 3: ТЕСТ ───────────────────────────── */
function startTest() {
  setText2('qLabel', 'ФАЗА 3 — ТЕСТ 🎯');
  setText2('qText',  'Підказок немає! Покажи що знаєш.');
  showSkipBtn(false);
  setLabel('nextBtn',  'Далі →');
  setLabel('nextBtnM', 'Далі →');
  disableBtn('nextBtn', true);
  disableBtn('hintBtn', true);
  makeBoardDraggable();
  renderDots();
  loadPlayStep();
}

/* ── ІНТЕРАКТИВНА ДОШКА ─────────────────────── */
function makeBoardDraggable() {
  const trap = ALL_TRAPS[currentTrap];
  game = new Chess(trap.startFen);
  if (board) board.destroy();
  board = Chessboard('board', {
    position:    trap.startFen,
    draggable:   true,
    orientation: trap.orientation || 'white',
    onDragStart,
    onDrop,
    onSnapEnd,
    pieceTheme:  'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    showNotation: true
  });
  updateMoveLine();
}

function loadPlayStep() {
  const trap = ALL_TRAPS[currentTrap];
  const step = trap.steps[phaseStep];
  if (!step) return;

  hideFeedback();
  hintUsed     = false;
  awaitingMove = false;

  setText2('qText', step.question.uk);
  disableBtn('nextBtn', true);
  disableBtn('hintBtn', currentPhase === 3); // у тесті підказок немає
  renderDots();

  // Автоматичні ходи суперника
  if (step.auto) {
    setTimeout(() => {
      step.auto.forEach(m => {
        game.move({ from: m.substring(0, 2), to: m.substring(2, 4), promotion: 'q' });
      });
      board.position(game.fen());
      updateMoveLine();
      awaitingMove = true;
    }, 600);
  } else {
    awaitingMove = true;
  }
}

function onDragStart(src, piece) {
  if (!awaitingMove || game.game_over()) return false;
  // Перевіряємо що гравець рухає СВОЇМИ фігурами (відповідно до playAs)
  const trap = ALL_TRAPS[currentTrap];
  const playAs = trap.playAs || 'white';
  const playerColor = playAs === 'white' ? 'w' : 'b';
  // Гравець може рухати тільки якщо зараз його черга
  return piece.charAt(0) === game.turn() && piece.charAt(0) === playerColor;
}

function onDrop(src, tgt) {
  if (!awaitingMove) return 'snapback';

  const step = ALL_TRAPS[currentTrap].steps[phaseStep];
  const mv   = game.move({ from: src, to: tgt, promotion: 'q' });
  if (!mv) return 'snapback';

  if (src === step.move.substring(0, 2) && tgt === step.move.substring(2, 4)) {
    handleCorrect(step);
  } else {
    game.undo();
    handleWrong();
    return 'snapback';
  }
}

function onSnapEnd() { board.position(game.fen()); }

function handleCorrect(step) {
  awaitingMove = false;
  stepResults[phaseStep] = hintUsed ? 'hint' : 'correct';
  if (!hintUsed) totalCorrect++;
  setText('scoreBadge', `${totalCorrect} ✓`);

  showFeedback('correct', '✓ Правильно!', 'Чудово!');
  renderDots();
  updateMoveLine();
  disableBtn('hintBtn', true);
  disableBtn('nextBtn', false);

  speakMove(step.san); // озвучуємо хід
}

function handleWrong() {
  if (currentPhase === 3) testErrors++;
  if (stepResults[phaseStep] === null) stepResults[phaseStep] = 'wrong';

  const msg = currentPhase === 3
    ? 'Помилка! Спробуй знову.'
    : 'Не той хід. Скористайся підказкою.';

  showFeedback('wrong', '✗ Неправильно', msg);
  renderDots();
  awaitingMove = true;
}

function showHint() {
  if (currentPhase !== 2) return;
  const step = ALL_TRAPS[currentTrap].steps[phaseStep];
  hintUsed = true;
  showFeedback('hint', '💡 Підказка', step.hint.uk);
  disableBtn('hintBtn', true);
}

function nextStep() {
  const trap = ALL_TRAPS[currentTrap];
  phaseStep++;

  if (phaseStep >= trap.steps.length) {
    if (currentPhase === 1) {
      enterPhase(2);
    } else if (currentPhase === 2) {
      trapProgress[currentTrap].p2 = true;
      saveProgress();
      renderMenu();
      showPhaseEnd(2);
    } else if (currentPhase === 3) {
      const stars = testErrors === 0 ? 3 : testErrors <= 2 ? 2 : 1;
      trapProgress[currentTrap].p3 = stars;
      saveProgress();
      renderMenu();
      showPhaseEnd(3, stars);
    }
  } else {
    loadPlayStep();
  }
}

/* ── ЕКРАН ЗАВЕРШЕННЯ ФАЗИ ──────────────────── */
function showPhaseEnd(ph, stars) {
  awaitingMove = false;

  if (ph === 2) {
    // Вправу пройдено — звичайне завершення (без феєрверку)
    const html = `
      <div class="comp-icon">✏️</div>
      <div class="comp-title">Вправу пройдено!</div>
      <div class="comp-msg">Тепер перевіримо без підказок.</div>
      <div class="comp-btns">
        <button class="btn btn-primary" style="min-width:130px" onclick="enterPhase(3)">🎯 До тесту →</button>
        <button class="btn btn-ghost" style="width:auto;margin:0;padding:10px 16px" onclick="enterPhase(2)">↺ Ще раз</button>
      </div>`;
    ['compDesktop','compMobile'].forEach(id => {
      const e = el(id); if (e) { e.innerHTML = html; e.classList.add('show'); }
    });
    ['qCardDesktop','qCardMobile'].forEach(id => {
      const e = el(id); if (e) e.style.display = 'none';
    });
    speak('Вправу пройдено! Тепер тест без підказок.');
    return;
  }

  // Фаза 3 — тест завершено
  const trap    = ALL_TRAPS[currentTrap];
  const correct = (trap.steps || []).length - testErrors;
  const total   = (trap.steps || []).length;
  const stStr   = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

  if (stars === 3) {
    // ⭐⭐⭐ — феєрверк + кубок!
    showAward({
      trophy:   '🏆',
      cardClass: 'gold',
      stars:    stStr,
      title:    'Ідеально!',
      subtitle: 'Жодної помилки! Ти майстер цієї пастки!',
      trapName: trap.name.uk,
      stats:    [
        { num: total,    label: 'Ходів' },
        { num: '100%',   label: 'Точність' },
        { num: '⭐⭐⭐', label: 'Оцінка' },
      ],
      btn1: { label: 'Наступна пастка →', fn: 'closeAwardAndNext()' },
      btn2: { label: '↺ Ще раз',          fn: 'closeAward();enterPhase(3)' },
      fireworks: true,
    });
    speak('Ідеально! Жодної помилки! Ти майстер цієї пастки!');
  } else if (stars === 2) {
    // ⭐⭐ — кубок без феєрверку
    showAward({
      trophy:    '🥈',
      cardClass: 'silver',
      stars:     stStr,
      title:     'Добре!',
      subtitle:  `${testErrors} ${testErrors === 1 ? 'помилка' : 'помилки'}. Майже ідеально!`,
      trapName:  trap.name.uk,
      stats:     [
        { num: correct,  label: 'Правильно' },
        { num: testErrors, label: 'Помилки' },
        { num: '⭐⭐',  label: 'Оцінка' },
      ],
      btn1: { label: 'Наступна →', fn: 'closeAwardAndNext()' },
      btn2: { label: '↺ Тест знову', fn: 'closeAward();enterPhase(3)' },
      fireworks: false,
    });
    speak(`Добре! ${testErrors} помилки. Спробуй ще раз для ідеального результату!`);
  } else {
    // ⭐ — бронза
    showAward({
      trophy:    '🥉',
      cardClass: 'bronze',
      stars:     stStr,
      title:     'Пройдено!',
      subtitle:  `${testErrors} помилок. Потрібна практика — спробуй вправу знову.`,
      trapName:  trap.name.uk,
      stats:     [
        { num: correct,    label: 'Правильно' },
        { num: testErrors, label: 'Помилок' },
        { num: '⭐',      label: 'Оцінка' },
      ],
      btn1: { label: '✏️ Вправа знову', fn: 'closeAward();enterPhase(2)' },
      btn2: { label: '↺ Тест знову',    fn: 'closeAward();enterPhase(3)' },
      fireworks: false,
    });
    speak(`Пройдено! ${testErrors} помилок. Спробуй вправу ще раз.`);
  }
}

// ── Показуємо оверлей нагороди ───────────────────────────────
function showAward({ trophy, cardClass, stars, title, subtitle, trapName, stats, btn1, btn2, fireworks }) {
  const statsHtml = stats.map(s =>
    `<div class="award-stat">
      <span class="award-stat-num">${s.num}</span>
      <span class="award-stat-label">${s.label}</span>
    </div>`
  ).join('');

  const overlay = el('awardOverlay');
  if (!overlay) return;

  // Картка нагороди (без canvas — він окремо)
  overlay.innerHTML = `
    <div class="award-card ${cardClass}">
      <span class="award-trophy">${trophy}</span>
      <div class="award-stars">${stars}</div>
      <div class="award-title">${title}</div>
      <div class="award-subtitle">${subtitle}</div>
      <div class="award-trap-name">«${trapName}»</div>
      <div class="award-stats">${statsHtml}</div>
      <div class="award-btns">
        <button class="award-btn-primary"   onclick="${btn1.fn}">${btn1.label}</button>
        <button class="award-btn-secondary" onclick="${btn2.fn}">${btn2.label}</button>
      </div>
    </div>`;

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  if (fireworks) {
    // Невелика затримка аби DOM встиг відрендеритись
    setTimeout(() => startFireworks(), 200);
  }
}

function closeAward() {
  const overlay = el('awardOverlay');
  if (overlay) { overlay.classList.remove('show'); overlay.innerHTML = ''; }
  document.body.style.overflow = '';
  stopFireworks();
}

function closeAwardAndNext() {
  closeAward();
  nextTrap();
}

// ── ФЕЄРВЕРК (Canvas API) ─────────────────────────────────────
let fwAnimId   = null;
let fwParticles = [];

function startFireworks() {
  // Знаходимо або створюємо canvas для феєрверку
  let canvas = el('fireworksCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none';
    document.body.appendChild(canvas);
  }
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  fwParticles   = [];

  // Серія залпів
  let launches = 0;
  if (window._fwInterval) clearInterval(window._fwInterval);
  window._fwInterval = setInterval(() => {
    launchFirework(canvas);
    launches++;
    if (launches >= 10) {
      clearInterval(window._fwInterval);
      window._fwInterval = null;
    }
  }, 350);

  // Одразу перший залп
  launchFirework(canvas);

  if (fwAnimId) cancelAnimationFrame(fwAnimId);
  fwAnimId = requestAnimationFrame(() => drawFireworks(canvas));
}

function stopFireworks() {
  if (fwAnimId) { cancelAnimationFrame(fwAnimId); fwAnimId = null; }
  if (window._fwInterval) { clearInterval(window._fwInterval); window._fwInterval = null; }
  fwParticles = [];
  // Видаляємо canvas
  const c = el('fireworksCanvas');
  if (c) c.remove();
}

function launchFirework(canvas) {
  const x      = 80 + Math.random() * (canvas.width  - 160);
  const y      = 60 + Math.random() * (canvas.height * 0.5);
  const colors = ['#e8b84b','#c9922a','#fff8e7','#ff6b6b','#4ecdc4','#a8e6cf','#ffeaa7','#fd79a8','#74b9ff'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  const count  = 60 + Math.floor(Math.random() * 40);

  for (let i = 0; i < count; i++) {
    const angle  = (Math.PI * 2 / count) * i + Math.random() * 0.3;
    const speed  = 2 + Math.random() * 6;
    const size   = 2 + Math.random() * 3;
    fwParticles.push({
      x, y,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      alpha: 1,
      color,
      size,
      decay: 0.012 + Math.random() * 0.008,
      gravity: 0.12,
    });
  }
}

function drawFireworks(canvas) {
  const ctx = canvas.getContext('2d');
  // Прозоре очищення — частинки залишають слід через alpha
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fwParticles = fwParticles.filter(p => p.alpha > 0.02);

  for (const p of fwParticles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2,'0');
    ctx.fill();

    p.x     += p.vx;
    p.y     += p.vy;
    p.vy    += p.gravity;
    p.vx    *= 0.98;
    p.alpha -= p.decay;
    p.size  *= 0.995;
  }

  if (fwParticles.length > 0) {
    fwAnimId = requestAnimationFrame(() => drawFireworks(canvas));
  }
}

function hideCompletion() {
  ['compDesktop', 'compMobile'].forEach(id => {
    const e = el(id); if (e) e.classList.remove('show');
  });
  ['qCardDesktop', 'qCardMobile'].forEach(id => {
    const e = el(id); if (e) e.style.display = 'block';
  });
}

function showFinalScore() {
  const done    = trapProgress.filter(p => p?.p3 > 0).length;
  const perfect = trapProgress.filter(p => p?.p3 === 3).length;

  showAward({
    trophy:    '🏆',
    cardClass: 'final gold',
    stars:     '⭐⭐⭐',
    title:     'Всі пастки вивчено!',
    subtitle:  `Ти вивчив усі ${ALL_TRAPS.length} пасток Smart Chess System®`,
    trapName:  `Ідеально пройдено: ${perfect} з ${done}`,
    stats:     [
      { num: done,              label: 'Пройдено' },
      { num: perfect,           label: 'Ідеально' },
      { num: totalCorrect,      label: 'Ходів правильно' },
    ],
    btn1:      { label: '↺ Почати знову', fn: 'closeAward();currentTrap=0;currentPhase=1;loadTrap()' },
    btn2:      { label: '📋 Меню пасток', fn: 'closeAward();openMenu()' },
    fireworks: true,
  });
  speak('Вітаємо! Ти вивчив усі шахові пастки! Блискучий результат!');
}

/* ───────────────────────────────────────────────────────
   ОЗВУЧЕННЯ — Web Speech API
─────────────────────────────────────────────────────── */
let voiceEnabled = false;
let synth        = window.speechSynthesis;
let uaVoice      = null;

// Завантажуємо голоси
function loadVoices() {
  const voices = synth.getVoices();
  // Пріоритет: українська > російська > будь-яка
  uaVoice = voices.find(v => v.lang === 'uk-UA')
         || voices.find(v => v.lang.startsWith('uk'))
         || voices.find(v => v.lang.startsWith('ru'))
         || voices[0]
         || null;
}
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
loadVoices();

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const btn = el('voiceBtn');
  if (btn) {
    btn.textContent = voiceEnabled ? '🔊' : '🔇';
    btn.classList.toggle('on', voiceEnabled);
    btn.title = voiceEnabled ? 'Озвучення увімкнено' : 'Озвучення вимкнено';
  }
  if (voiceEnabled) speak('Озвучення увімкнено');
  else synth.cancel();
}

function speak(text) {
  if (!voiceEnabled || !synth || !text) return;
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  if (uaVoice) utt.voice = uaVoice;
  utt.lang  = 'uk-UA';
  utt.rate  = 0.90;
  utt.pitch = 1.0;
  synth.speak(utt);
}

// Перетворює SAN-нотацію на читабельну українську
function sanToUkrainian(san) {
  if (!san) return '';
  if (san === 'O-O-O') return 'довга рокіровка';
  if (san === 'O-O')   return 'рокіровка';

  const pieces = { K: 'Король', Q: 'Ферзь', R: 'Тура', B: 'Слон', N: 'Кінь' };
  let s = san;

  // Назва фігури
  for (const [letter, name] of Object.entries(pieces)) {
    if (s.startsWith(letter)) { s = name + ' ' + s.slice(1); break; }
  }

  s = s.replace('x', ' бʼє ');   // взяття
  s = s.replace('+', ', шах');   // шах
  s = s.replace('#', ', мат!');  // мат
  s = s.replace(/=([QRBN])/, (_, p) => ', перетворення у ' + (pieces[p] || p));

  return s.trim();
}

function speakMove(san) {
  if (!voiceEnabled || !san) return;
  speak(sanToUkrainian(san));
}

/* ───────────────────────────────────────────────────────
   ДОПОМІЖНІ ФУНКЦІЇ UI
─────────────────────────────────────────────────────── */
// Знаходимо елемент
function el(id) { return document.getElementById(id); }

// Встановлюємо текст
function setText(id, txt) {
  const e = el(id); if (e) e.textContent = txt;
}
// Встановлюємо HTML
function setHTML(id, html) {
  const e = el(id); if (e) e.innerHTML = html;
}
// Встановлюємо текст одразу для desktop і mobile варіантів (id і idM)
function setText2(baseId, txt) {
  setText(baseId, txt);
  setText(baseId + 'M', txt);
}

// Вмикаємо/вимикаємо кнопку (desktop + mobile)
function disableBtn(baseId, disabled) {
  [baseId, baseId + 'M'].forEach(id => {
    const e = el(id); if (e) e.disabled = disabled;
  });
}
// Встановлюємо текст кнопки
function setLabel(id, txt) {
  const e = el(id); if (e) e.textContent = txt;
}

// Показуємо/ховаємо кнопку "Вже знаю"
function showSkipBtn(show) {
  ['skipP1Btn', 'skipP1BtnM'].forEach(id => {
    const e = el(id); if (e) e.style.display = show ? '' : 'none';
  });
}

// Показуємо фідбек (correct | wrong | hint)
function showFeedback(type, title, msg) {
  ['feedback', 'feedbackM'].forEach(id => {
    const e = el(id); if (!e) return;
    e.className = `feedback ${type}`;
    e.innerHTML = `<span>${title}</span><span style="font-weight:400;opacity:.85"> — ${msg}</span>`;
    e.style.display = 'flex';
  });
}
function hideFeedback() {
  ['feedback', 'feedbackM'].forEach(id => {
    const e = el(id); if (e) e.style.display = 'none';
  });
}

// Кружечки-кроки
function renderDots() {
  const trap = ALL_TRAPS[currentTrap]; if (!trap) return;
  const html = trap.steps.map((s, i) => {
    let cls = 'step-dot';
    if (i === phaseStep)              cls += ' active';
    else if (stepResults[i] === 'correct') cls += ' done';
    else if (stepResults[i] === 'wrong')   cls += ' wrong';
    else if (stepResults[i] === 'hint')    cls += ' done';
    return `<div class="${cls}">${i + 1}</div>`;
  }).join('');
  setHTML('stepDots', html);
  setHTML('stepDotsM', html);
}

// Підсвічування клітинок
function hlSq(from, to) {
  document.querySelectorAll('.highlight-sq').forEach(e => e.classList.remove('highlight-sq'));
  const f = document.querySelector(`.square-${from}`);
  const t = document.querySelector(`.square-${to}`);
  if (f) f.classList.add('highlight-sq');
  if (t) t.classList.add('highlight-sq');
}

// Рядок ходів
function updateMoveLine() {
  const history = game.history({ verbose: false });
  if (!history.length) { setText('movesLine', '—'); return; }
  let line = '';
  for (let i = 0; i < history.length; i++) {
    if (i % 2 === 0) line += `<span class="move-num">${Math.floor(i / 2) + 1}.</span>`;
    line += `<span class="move-w"> ${history[i]}</span> `;
  }
  setHTML('movesLine', line);
}

/* ───────────────────────────────────────────────────────
   ІНІЦІАЛІЗАЦІЯ
─────────────────────────────────────────────────────── */
$(document).ready(function () {
  // Підтримка Enter на екрані входу
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && el('loginScreen')?.style.display !== 'none') doLogin();
  });

  // Ставимо учня як роль за замовчуванням
  setLoginRole('student');

  // Відновлюємо сесію якщо є
  if (tryRestoreSession()) startApp();
});
