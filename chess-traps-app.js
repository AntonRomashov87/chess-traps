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

  // Запускаємо
  loadTrap();
  renderMenu();
  renderTeacherList();
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
  currentTrap = i;
  currentPhase = 1;
  loadTrap();
  closeMenu();
  window.scrollTo(0, 0);
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

  setText('trapBadge',   `ПАСТКА #${trap.id}`);
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

  // Статична дошка
  game = new Chess(trap.startFen);
  if (board) board.destroy();
  board = Chessboard('board', {
    position:   trap.startFen,
    draggable:  false,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
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
function startExplain() {
  setText2('qLabel', 'ФАЗА 1 — ПОЯСНЕННЯ');
  setText2('qText',  '👁 Дивись та запам\'ятовуй — пастка розгортається автоматично');
  disableBtn('nextBtn', true);
  disableBtn('hintBtn', true);
  showSkipBtn(true);
  renderDots();
  animStep();
}

function animStep() {
  const trap = ALL_TRAPS[currentTrap];

  if (phaseStep >= trap.steps.length) {
    // Анімація завершена
    trapProgress[currentTrap].p1 = true;
    saveProgress();
    renderMenu();
    updatePhaseTabs();

    setText2('qText', '✅ Пастку переглянуто! Тепер спробуй сам.');
    disableBtn('nextBtn', false);
    setLabel('nextBtn',  'До вправи →');
    setLabel('nextBtnM', 'До вправи →');
    showSkipBtn(false);
    return;
  }

  const step = trap.steps[phaseStep];
  setText2('qText', step.question.uk);

  const playMain = () => {
    const from = step.move.substring(0, 2);
    const to   = step.move.substring(2, 4);
    const mv   = game.move({ from, to, promotion: 'q' });
    if (mv) {
      hlSq(from, to);
      board.position(game.fen());
      updateMoveLine();
      speakMove(step.san);   // озвучуємо хід
    }
    phaseStep++;
    setTimeout(animStep, 1100);
  };

  // Якщо є автоходи суперника — граємо їх спочатку
  if (step.auto && phaseStep > 0) {
    playAutoSeq(step.auto, () => setTimeout(playMain, 500));
  } else {
    setTimeout(playMain, 500);
  }
}

function playAutoSeq(moves, cb) {
  let i = 0;
  function next() {
    if (i >= moves.length) { cb(); return; }
    const m  = moves[i++];
    const mv = game.move({ from: m.substring(0, 2), to: m.substring(2, 4), promotion: 'q' });
    if (mv) { hlSq(m.substring(0, 2), m.substring(2, 4)); board.position(game.fen()); updateMoveLine(); }
    setTimeout(next, 650);
  }
  next();
}

function skipToPhase2() { enterPhase(2); }

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
    position:   trap.startFen,
    draggable:  true,
    onDragStart,
    onDrop,
    onSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
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
  return piece.charAt(0) === game.turn();
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
  let icon, title, msg, btn1, btn2;

  if (ph === 2) {
    icon  = '✏️';
    title = 'Вправу пройдено!';
    msg   = 'Тепер перевіримо без підказок.';
    btn1  = { label: '🎯 До тесту →',    fn: 'enterPhase(3)' };
    btn2  = { label: '↺ Ще раз',         fn: 'enterPhase(2)' };
  } else {
    const stStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    icon  = stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🥉';
    title = `Тест завершено! ${stStr}`;
    msg   = stars === 3
      ? 'Ідеально! Жодної помилки!'
      : stars === 2
      ? `Добре! ${testErrors} помилки.`
      : `Потрібна практика — ${testErrors} помилок.`;
    btn1 = { label: 'Наступна →',  fn: 'nextTrap()' };
    btn2 = { label: '↺ Тест знову', fn: 'enterPhase(3)' };
  }

  const html = `
    <div class="comp-icon">${icon}</div>
    <div class="comp-title">${title}</div>
    <div class="comp-msg">${msg}</div>
    <div class="comp-btns">
      <button class="btn btn-primary" style="min-width:130px" onclick="${btn1.fn}">${btn1.label}</button>
      <button class="btn btn-ghost"   style="width:auto;margin:0;padding:10px 16px" onclick="${btn2.fn}">${btn2.label}</button>
    </div>`;

  ['compDesktop', 'compMobile'].forEach(id => {
    const e = el(id); if (e) { e.innerHTML = html; e.classList.add('show'); }
  });
  ['qCardDesktop', 'qCardMobile'].forEach(id => {
    const e = el(id); if (e) e.style.display = 'none';
  });

  // Озвучуємо результат
  speak(title + '. ' + msg);
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
  const html = `
    <div class="comp-icon">🏆</div>
    <div class="comp-title">Всі пастки вивчено!</div>
    <div class="comp-score">${done} / ${ALL_TRAPS.length}</div>
    <div class="comp-msg">Ідеально: ${perfect} пасток ⭐⭐⭐</div>
    <div class="comp-btns">
      <button class="btn btn-primary" style="min-width:140px"
        onclick="currentTrap=0;currentPhase=1;loadTrap()">↺ Почати знову</button>
    </div>`;
  ['compDesktop', 'compMobile'].forEach(id => {
    const e = el(id); if (e) { e.innerHTML = html; e.classList.add('show'); }
  });
  ['qCardDesktop', 'qCardMobile'].forEach(id => {
    const e = el(id); if (e) e.style.display = 'none';
  });
  speak('Вітаємо! Всі пастки вивчено!');
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
