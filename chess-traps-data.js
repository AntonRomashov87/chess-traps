/* ═══════════════════════════════════════════════════════
   ШАХОВІ ПАСТКИ — SMART CHESS SYSTEM®
   Файл: chess-traps-data.js
   Дані: масив TRAPS з усіма пастками
   Структура кожної пастки:
     id, name{uk,en}, opening{uk,en}, desc{uk,en},
     white{uk,en}[], black{uk,en}[],
     startFen, steps[]
   Кожен крок (step):
     question{uk,en}, move (e.g. 'e2e4'),
     san (e.g. 'e4'), hint{uk,en},
     auto[] (ходи суперника перед цим кроком)
═══════════════════════════════════════════════════════ */
const TRAPS = [
  {
    id: 1,
    name: { uk: "Пастка Легаля", en: "Légal Trap" },
    opening: { uk: "1.e4 e5 2.Nf3 Nc6 3.Bc4 d6 4.Nc3 Bg4 — Псевдожертва ферзя", en: "1.e4 e5 2.Nf3 Nc6 3.Bc4 d6 4.Nc3 Bg4 — Pseudo queen sacrifice" },
    desc: { uk: "Одна з найстаріших пасток (XVIII ст.). Білі жертвують ферзя, але після Nxe5! загрожує мат трьома легкими фігурами. Чорні, взявши ферзя, отримують мат.", en: "One of the oldest traps (18th century). White sacrifices the queen, but after Nxe5! threatens mate with three minor pieces. Black who takes the queen gets mated." },
    white: { uk: ["Провокує взяття ферзя", "Мат Nxf7+ або Nd5#", "Три фігури матують"], en: ["Provokes queen capture", "Mate by Nxf7+ or Nd5#", "Three pieces deliver mate"] },
    black: { uk: ["Не варто брати ферзя на e2", "Слон g4 — зайва провокація", "Треба грати Nf6 замість Bg4"], en: ["Should not take queen on e2", "Bishop g4 is a provocation", "Should play Nf6 instead of Bg4"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Відкрита гра. Перший хід?", en: "Open game. First move?" }, move: 'e2e4', san: 'e4', hint: { uk: "Центральний пішак e", en: "Central e-pawn" } },
      { question: { uk: "e5 зіграно. Розвиваємо коня, що атакує e5?", en: "e5 played. Develop the knight attacking e5?" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Кінь f3 атакує пішак e5", en: "Knight f3 attacks e5" }, auto: ['e7e5'] },
      { question: { uk: "Nc6 захищає e5. Слон виходить, атакуючи f7?", en: "Nc6 defends e5. Bishop develops, attacking f7?" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 — слон на f7", en: "Bc4 — eyeing f7" }, auto: ['b8c6'] },
      { question: { uk: "d6 зміцнює центр. Розвиваємо другого коня?", en: "d6 reinforces center. Develop the second knight?" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 розвивається і підтримує центр", en: "Nc3 develops and supports the center" }, auto: ['d7d6'] },
      { question: { uk: "Bg4 пришпилює коня f3! Ферзь виходить — приманка!", en: "Bg4 pins Nf3! Queen comes out — it's a lure!" }, move: 'd1e2', san: 'Qe2', hint: { uk: "Qe2 — удавана жертва ферзя!", en: "Qe2 — the fake queen sacrifice!" }, auto: ['c8g4'] },
      { question: { uk: "Чорні 'беруть' ферзя Bxe2. Кінь іде на e5 — ЖЕРТВА!", en: "Black 'wins' queen with Bxe2. Knight leaps to e5 — SACRIFICE!" }, move: 'f3e5', san: 'Nxe5!', hint: { uk: "Nxe5! — відкриває загрозу мату на f7!", en: "Nxe5! — opens the f7 mating threat!" }, auto: ['g4e2'] },
      { question: { uk: "Nxe5 — чорні думають що виграли. Тепер Bxf7+ — шах королю!", en: "Nxe5 attacked. Now Bxf7+ — check to the king!" }, move: 'c4f7', san: 'Bxf7+', hint: { uk: "Слон бʼє f7 з шахом!", en: "Bishop captures f7 with check!" }, auto: ['c6e5'] },
      { question: { uk: "Король іде на e7. Як завершуємо пастку — хід коня?", en: "King goes to e7. How do we finish — knight move?" }, move: 'c3d5', san: 'Nd5#', hint: { uk: "Nd5 — мат! Ні король, ні фігури не можуть захиститись", en: "Nd5 — checkmate! Neither king nor pieces can defend" }, auto: ['e8e7'] }
    ]
  },
  {
    id: 2,
    name: { uk: "Атака смаженої печінки (Fried Liver Attack)", en: "Fried Liver Attack" },
    opening: { uk: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7 — Жертва коня", en: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7 — Knight sacrifice" },
    desc: { uk: "Найвидовищніша жертва в шаховій теорії! Білі жертвують коня на f7, виманюючи короля в центр. Після Qf3+ король опиняється під смертельною атакою.", en: "The most spectacular sacrifice in chess theory! White sacrifices the knight on f7, luring the king to the center. After Qf3+ the king faces a deadly attack." },
    white: { uk: ["Жертва коня Nxf7!", "Король виманюється в центр", "Qf3+ — смертельна атака"], en: ["Knight sacrifice Nxf7!", "King is lured to the center", "Qf3+ — deadly attack"] },
    black: { uk: ["Король в центрі — під атакою", "Важко захиститись", "Nxd5 краще ніж Nxf7"], en: ["King in center — under attack", "Very difficult to defend", "Nxd5 better than Nxf7"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Починаємо атаку. e4?", en: "Start the attack. e4?" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "e5 — відповідь. Кінь на f3?", en: "e5 answered. Knight to f3?" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 атакує e5", en: "Nf3 attacks e5" }, auto: ['e7e5'] },
      { question: { uk: "Nc6 захищає. Слон на c4 — Джоко П'яно?", en: "Nc6 defends. Bishop c4 — Giuoco Piano?" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 цілиться у f7", en: "Bc4 eyes f7" }, auto: ['b8c6'] },
      { question: { uk: "Nf6 атакує e4. Кінь на g5 — загрожує f7!", en: "Nf6 attacks e4. Knight to g5 — threatening f7!" }, move: 'f3g5', san: 'Ng5', hint: { uk: "Ng5 загрожує Nxf7!", en: "Ng5 threatens Nxf7!" }, auto: ['g8f6'] },
      { question: { uk: "d5 — чорні захищають. Беремо d5?", en: "d5 — Black defends. Take on d5?" }, move: 'e4d5', san: 'exd5', hint: { uk: "exd5 відкриває лінії!", en: "exd5 opens lines!" }, auto: ['d7d5'] },
      { question: { uk: "Nxd5 — кінь бере. ЖЕРТВА КОНЯ на f7!", en: "Nxd5 — knight takes. KNIGHT SACRIFICE on f7!" }, move: 'g5f7', san: 'Nxf7!', hint: { uk: "Nxf7! — жертва, що руйнує рокіровку!", en: "Nxf7! — sacrifice that destroys castling!" }, auto: ['c6d5'] },
      { question: { uk: "Kxf7 — король бере. Ферзь на f3 — шах і атака!", en: "Kxf7 — king takes. Queen to f3 — check and attack!" }, move: 'd1f3', san: 'Qf3+', hint: { uk: "Qf3+ — шах з атакою на d5!", en: "Qf3+ — check with attack on d5!" }, auto: ['e8f7'] },
      { question: { uk: "Ke6 — король відступає. Кінь на c3 — розвиток з темпом!", en: "Ke6 — king retreats. Knight c3 — develop with tempo!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 атакує коня d5!", en: "Nc3 attacks the Nd5!" }, auto: ['f7e6'] },
      { question: { uk: "Nxc3 або Be7. Слон на b3 — тиск зберігається!", en: "Nxc3 or Be7. Bishop b3 — maintain pressure!" }, move: 'c4b3', san: 'Bb3', hint: { uk: "Bb3 зберігає слона і загрожує d5", en: "Bb3 keeps the bishop and threatens d5" }, auto: ['d5c3'] }
    ]
  },
  {
    id: 3,
    name: { uk: "Пастка Норса — Гамбіт Єванса", en: "Evans Gambit Trap" },
    opening: { uk: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 — Романтичний гамбіт XIX ст.", en: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 — Romantic gambit of the 19th century" },
    desc: { uk: "Гамбіт Єванса — шедевр романтичної епохи. Білі жертвують пішака b4, щоб відтягнути слона і побудувати ідеальний центр d4+e4. Типова пастка — чорні не встигають вивести фігури.", en: "Evans Gambit is a masterpiece of the romantic era. White sacrifices b4 to deflect the bishop and build the ideal d4+e4 center. The trap: Black can't develop pieces in time." },
    white: { uk: ["Жертвує b4 заради центру", "d4+e4 — ідеальний центр", "Швидкий розвиток і атака"], en: ["Sacrifices b4 for the center", "d4+e4 — ideal center", "Quick development and attack"] },
    black: { uk: ["Слон відступає кілька разів", "Відстає у розвитку", "Типово — Ba5 або Bc5"], en: ["Bishop retreats multiple times", "Falls behind in development", "Typical — Ba5 or Bc5"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Відкрита гра. e4!", en: "Open game. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "e5 відповідь. Nf3 — атакуємо e5?", en: "e5 answered. Nf3 — attack e5?" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 атакує e5", en: "Nf3 attacks e5" }, auto: ['e7e5'] },
      { question: { uk: "Nc6 захищає. Слон виходить на c4?", en: "Nc6 defends. Bishop to c4?" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 — Італійська партія", en: "Bc4 — Italian Game" }, auto: ['b8c6'] },
      { question: { uk: "Bc5 — слон виходить. Гамбіт b4 — жертва!", en: "Bc5 — bishop out. Gambit b4 — sacrifice!" }, move: 'b2b4', san: 'b4!', hint: { uk: "b4 — гамбіт Єванса!", en: "b4 — Evans Gambit!" }, auto: ['f8c5'] },
      { question: { uk: "Bxb4 — чорні беруть! c3 — атака слона з побудовою центру?", en: "Bxb4 — Black takes! c3 — attack bishop and build center?" }, move: 'c2c3', san: 'c3', hint: { uk: "c3 атакує слона і готує d4", en: "c3 attacks the bishop and prepares d4" }, auto: ['c5b4'] },
      { question: { uk: "Ba5 — слон відступає. d4 — будуємо ідеальний центр!", en: "Ba5 — bishop retreats. d4 — build the ideal center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 створює потужний центр d4+e4", en: "d4 creates the powerful d4+e4 center" }, auto: ['b4a5'] },
      { question: { uk: "exd4 — чорні беруть. Рокіровка — безпека короля!", en: "exd4 — Black takes. Castle — king safety!" }, move: 'e1g1', san: 'O-O', hint: { uk: "Рокіровка і активна позиція!", en: "Castle and active position!" }, auto: ['e5d4'] },
      { question: { uk: "d6 — чорні зміцнюють. Nxd4 — відновлюємось з розвитком?", en: "d6 — Black consolidates. Nxd4 — recapture with development?" }, move: 'f3d4', san: 'Nxd4', hint: { uk: "Кінь бере на d4 активно", en: "Knight recaptures on d4 actively" }, auto: ['d7d6'] },
      { question: { uk: "Nf6 атакує e4. Nc3 — розвиваємось і захищаємо?", en: "Nf6 attacks e4. Nc3 — develop and defend?" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 захищає e4 і розвивається", en: "Nc3 defends e4 and develops" }, auto: ['g8f6'] }
    ]
  },
  {
    id: 4,
    name: { uk: "Пастка Морри (Гамбіт Морри в Сицілійській)", en: "Morra Gambit Trap" },
    opening: { uk: "1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 — Гамбіт проти Сицілійської", en: "1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 — Gambit vs Sicilian" },
    desc: { uk: "Гамбіт Морри — небезпечна зброя проти Сицілійської. Після прийняття гамбіту білі отримують потужний розвиток. Типова пастка — Nd5 з виграшем ферзя після попередніх жертв.", en: "Morra Gambit is a dangerous weapon against the Sicilian. After accepting the gambit, White gets powerful development. Typical trap — Nd5 winning the queen after prior sacrifices." },
    white: { uk: ["Жертвує пішак заради розвитку", "Тиск по лінії c і d", "Nd5 — типовий тактичний удар"], en: ["Sacrifices pawn for development", "Pressure on c and d files", "Nd5 — typical tactical blow"] },
    black: { uk: ["Отримує зайвий пішак", "Але відстає у розвитку", "Небезпечне положення"], en: ["Gets extra pawn", "But falls behind in development", "Dangerous position"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Проти Сицілійської. e4?", en: "Against the Sicilian. e4?" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — класичний початок", en: "e4 — classic start" } },
      { question: { uk: "c5 — Сицілійська! d4 — пропонуємо гамбіт!", en: "c5 — Sicilian! d4 — offer the gambit!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — перший хід гамбіту Морри", en: "d4 — first move of Morra Gambit" }, auto: ['c7c5'] },
      { question: { uk: "cxd4 взято. c3 — другий пішак у жертву!", en: "cxd4 taken. c3 — offer second pawn!" }, move: 'c2c3', san: 'c3', hint: { uk: "c3 — ключова жертва гамбіту Морри", en: "c3 — key Morra Gambit sacrifice" }, auto: ['c5d4'] },
      { question: { uk: "dxc3 взято. Кінь відновлює — з розвитком!", en: "dxc3 taken. Knight recaptures — with development!" }, move: 'b1c3', san: 'Nxc3', hint: { uk: "Nxc3 — розвиток і тиск!", en: "Nxc3 — development and pressure!" }, auto: ['d4c3'] },
      { question: { uk: "Nc6 — кінь розвивається. Слон на c4 — цілимось у f7!", en: "Nc6 develops. Bishop to c4 — eyeing f7!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 — класичний хід у Моррі", en: "Bc4 — classic Morra move" }, auto: ['b8c6'] },
      { question: { uk: "e6 — чорні зміцнюють. Nf3 — продовжуємо розвиток!", en: "e6 — Black consolidates. Nf3 — continue development!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 розвивається і контролює d4", en: "Nf3 develops and controls d4" }, auto: ['e7e6'] },
      { question: { uk: "Nf6 — атакує e4. Рокіровка — безпека перш за все!", en: "Nf6 — attacks e4. Castle — safety first!" }, move: 'e1g1', san: 'O-O', hint: { uk: "Рокіровка і підготовка атаки", en: "Castle and prepare the attack" }, auto: ['g8f6'] },
      { question: { uk: "d6 — чорні захищають. Qe2 — ферзь активізується!", en: "d6 — Black defends. Qe2 — queen activates!" }, move: 'd1e2', san: 'Qe2', hint: { uk: "Qe2 підтримує e4 і загрожує Nd5", en: "Qe2 supports e4 and threatens Nd5" }, auto: ['d7d6'] },
      { question: { uk: "Be7 — чорні готуються. Nd5! — ТАКТИЧНИЙ УДАР!", en: "Be7 — Black prepares. Nd5! — TACTICAL BLOW!" }, move: 'c3d5', san: 'Nd5!', hint: { uk: "Nd5! виграє матеріал — виламує позицію!", en: "Nd5! wins material — breaks open the position!" }, auto: ['f8e7'] }
    ]
  },
  {
    id: 5,
    name: { uk: "Пастка Скандинавського захисту", en: "Scandinavian Defense Trap" },
    opening: { uk: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 — Рання атака на ферзя", en: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 — Early queen attack" },
    desc: { uk: "Скандинавський захист — ранній вихід ферзя чорних. Пастка: після кількох ходів розвитку Bc4 загрожує виграти пішака b7 або ферзя після Nb5.", en: "Scandinavian Defense — Black's early queen development. The trap: after a few development moves Bc4 threatens to win b7 pawn or the queen after Nb5." },
    white: { uk: ["Кожен хід атакує ферзя", "Виграш темпів у розвитку", "Nb5 — типовий виграшний мотив"], en: ["Every move attacks the queen", "Gains development tempos", "Nb5 — typical winning motif"] },
    black: { uk: ["Ферзь під постійним тиском", "Важко розвивати фігури", "Краще Nf6 замість Qxd5"], en: ["Queen under constant pressure", "Hard to develop pieces", "Better to play Nf6 instead of Qxd5"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "e4 — відкриваємо гру!", en: "e4 — open the game!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — класика", en: "e4 — classic" } },
      { question: { uk: "d5 — чорні атакують! exd5 — беремо!", en: "d5 — Black attacks! exd5 — take it!" }, move: 'e4d5', san: 'exd5', hint: { uk: "Беремо d5!", en: "Take d5!" }, auto: ['d7d5'] },
      { question: { uk: "Qxd5 — ферзь виходить рано! Nc3 — атакуємо ферзя!", en: "Qxd5 — queen out early! Nc3 — attack the queen!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 — розвиток з атакою на ферзя!", en: "Nc3 — development with attack on queen!" }, auto: ['d8d5'] },
      { question: { uk: "Qa5 — ферзь відступає. d4 — зміцнюємо центр!", en: "Qa5 — queen retreats. d4 — reinforce center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 будує потужний центр", en: "d4 builds the powerful center" }, auto: ['d5a5'] },
      { question: { uk: "Nf6 — кінь розвивається. Nf3 — ще один темп з атакою!", en: "Nf6 — knight develops. Nf3 — another tempo with attack!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 розвивається і загрожує Bb5", en: "Nf3 develops and threatens Bb5" }, auto: ['g8f6'] },
      { question: { uk: "Bg4 — чорні пришпилюють. Bc4 — слон активно виходить!", en: "Bg4 — Black pins. Bc4 — bishop develops actively!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 загрожує Nb5 з виграшем ферзя!", en: "Bc4 threatens Nb5 winning the queen!" }, auto: ['c8g4'] },
      { question: { uk: "e6 — чорні захищають. Ne5! — атакуємо слона g4!", en: "e6 — Black defends. Ne5! — attack the Bg4!" }, move: 'f3e5', san: 'Ne5!', hint: { uk: "Ne5 атакує слона g4 і загрожує Nxf7!", en: "Ne5 attacks Bg4 and threatens Nxf7!" }, auto: ['e7e6'] },
      { question: { uk: "Bxd1? Чорні беруть ферзя — помилка! Bxf7+ — шах!?", en: "Bxd1? Black takes queen — mistake! Bxf7+ — check!" }, move: 'c4f7', san: 'Bxf7+', hint: { uk: "Bxf7+ — шах з виграшем ферзя d1!", en: "Bxf7+ — check, then recapture queen on d1!" }, auto: ['g4d1'] },
      { question: { uk: "Ke7 — король відступає. Тепер Nxd1 — ферзя відновлюємо!", en: "Ke7 — king retreats. Now Nxd1 — recapture the queen!" }, move: 'c3d1', san: 'Nxd1', hint: { uk: "Nxd1 — відновлюємо ферзя з перевагою!", en: "Nxd1 — recapture the queen with advantage!" }, auto: ['e8e7'] }
    ]
  },
  {
    id: 6,
    name: { uk: "Пастка у Захисті двох коней (Napoli Trap)", en: "Two Knights Defense — Napoli Trap" },
    opening: { uk: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 — Пастка коня", en: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 — Knight trap" },
    desc: { uk: "Класична пастка в Захисті двох коней. Після 4.Ng5 чорні грають Na5 замість правильного Nxd5, і потрапляють у пастку Bb5+ з виграшем фігури.", en: "Classic trap in Two Knights Defense. After 4.Ng5 Black plays Na5 instead of the correct Nxd5, and falls into Bb5+ winning a piece." },
    white: { uk: ["Ng5 загрожує f7", "d5 відкриває лінії", "Bb5+ виграє фігуру"], en: ["Ng5 threatens f7", "d5 opens lines", "Bb5+ wins a piece"] },
    black: { uk: ["Na5 — помилка!", "Треба грати Nxd5", "Bb5+ і чорні втрачають матеріал"], en: ["Na5 — mistake!", "Should play Nxd5", "Bb5+ and Black loses material"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Відкрита гра. e4!", en: "Open game. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "e5. Nf3 — атакуємо e5?", en: "e5. Nf3 — attack e5?" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 атакує e5", en: "Nf3 attacks e5" }, auto: ['e7e5'] },
      { question: { uk: "Nc6 захищає. Bc4 — Джоко П'яно?", en: "Nc6 defends. Bc4 — Giuoco Piano?" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 цілиться у f7", en: "Bc4 eyes f7" }, auto: ['b8c6'] },
      { question: { uk: "Nf6 атакує e4. Ng5 — загрожуємо f7!", en: "Nf6 attacks e4. Ng5 — threaten f7!" }, move: 'f3g5', san: 'Ng5!', hint: { uk: "Ng5 загрожує Nxf7!", en: "Ng5 threatens Nxf7!" }, auto: ['g8f6'] },
      { question: { uk: "d5 — чорні захищають f7. exd5 — відкриваємо позицію!", en: "d5 — Black defends f7. exd5 — open the position!" }, move: 'e4d5', san: 'exd5', hint: { uk: "exd5 відкриває центр!", en: "exd5 opens the center!" }, auto: ['d7d5'] },
      { question: { uk: "Na5 — чорні атакують слона! Bb5+ — шах і виграш матеріалу!", en: "Na5 — Black attacks the bishop! Bb5+ — check and win material!" }, move: 'c4b5', san: 'Bb5+!', hint: { uk: "Bb5+! — шах, після якого виграємо коня a5!", en: "Bb5+! — check, then we win the Na5!" }, auto: ['c6a5'] },
      { question: { uk: "c6 або Bd7 — чорні захищаються. dxc6 — беремо пішак!", en: "c6 or Bd7 — Black defends. dxc6 — take the pawn!" }, move: 'd5c6', san: 'dxc6', hint: { uk: "dxc6 бʼє пішак і відкриває позицію", en: "dxc6 captures and opens the position" }, auto: ['c8d7'] },
      { question: { uk: "Bxb5 — чорні відновлюють. cxb7 — новий пішак!", en: "Bxb5 — Black recaptures. cxb7 — new pawn!" }, move: 'c6b7', san: 'cxb7', hint: { uk: "cxb7 атакує тури a8!", en: "cxb7 attacks the Ra8!" }, auto: ['d7b5'] },
      { question: { uk: "Ra7 — тура захищається. Bxb5 — відновлюємось зі шматком матеріалу!", en: "Ra7 — rook defends. Bxb5 — recapture with material advantage!" }, move: 'b5d7', san: 'Bxd7+', hint: { uk: "Bxd7+ — шах і виграємо матеріал!", en: "Bxd7+ — check and win material!" }, auto: ['a8a7'] }
    ]
  },
  {
    id: 7,
    name: { uk: "Королівський гамбіт — Пастка Муціо", en: "King's Gambit — Muzio Trap" },
    opening: { uk: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 g4 5.0-0 gxf3 — Жертва коня", en: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 g4 5.0-0 gxf3 — Knight sacrifice" },
    desc: { uk: "Гамбіт Муціо — найромантичніша пастка Королівського гамбіту! Білі жертвують коня, не беручи пішак g4, і після рокіровки отримують нищівну атаку по лінії f.", en: "Muzio Gambit — the most romantic King's Gambit trap! White sacrifices the knight, not taking g4, and after castling gets a devastating attack along the f-file." },
    white: { uk: ["f4 — Королівський гамбіт", "Жертвує коня f3", "Атака по лінії f після рокіровки"], en: ["f4 — King's Gambit", "Sacrifices knight f3", "f-file attack after castling"] },
    black: { uk: ["Приймає усі жертви", "Але відстає у розвитку", "Qf6 або d5 — кращий захист"], en: ["Accepts all sacrifices", "But falls behind in development", "Qf6 or d5 — better defense"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Атака! e4 — відкрита гра?", en: "Attack! e4 — open game?" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "e5 — відповідь. f4 — Королівський гамбіт!", en: "e5 — answered. f4 — King's Gambit!" }, move: 'f2f4', san: 'f4!', hint: { uk: "f4 — Королівський гамбіт!", en: "f4 — King's Gambit!" }, auto: ['e7e5'] },
      { question: { uk: "exf4 — чорні беруть. Nf3 — розвиток з атакою на g5?", en: "exf4 — Black takes. Nf3 — develop attacking g5?" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 розвивається і загрожує g5", en: "Nf3 develops and threatens g5" }, auto: ['e5f4'] },
      { question: { uk: "g5 — чорні захищають f4. Bc4 — слон на діагональ!", en: "g5 — Black defends f4. Bc4 — bishop on diagonal!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 виходить і загрожує f7", en: "Bc4 develops and threatens f7" }, auto: ['g7g5'] },
      { question: { uk: "g4 — чорні беруть коня! 0-0 — рокіровка з жертвою!", en: "g4 — Black captures knight! 0-0 — castle with sacrifice!" }, move: 'e1g1', san: 'O-O!!', hint: { uk: "0-0!! — геніальна рокіровка-жертва!", en: "O-O!! — brilliant castling sacrifice!" }, auto: ['g5g4'] },
      { question: { uk: "gxf3 — чорні беруть коня. Qxf3 — ферзь на f3 з атакою!", en: "gxf3 — Black takes knight. Qxf3 — queen to f3 with attack!" }, move: 'd1f3', san: 'Qxf3', hint: { uk: "Qxf3 — ферзь на потужну позицію!", en: "Qxf3 — queen on powerful square!" }, auto: ['g4f3'] },
      { question: { uk: "Nc6 — чорні розвиваються. d4 — відкриваємо центр!", en: "Nc6 — Black develops. d4 — open the center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 відкриває центр для атаки", en: "d4 opens the center for the attack" }, auto: ['b8c6'] },
      { question: { uk: "d5 — слон атакований. Bxf4 — слон бере пішак f4!", en: "d5 — bishop attacked. Bxf4 — bishop takes f4 pawn!" }, move: 'c1f4', san: 'Bxf4', hint: { uk: "Bxf4 — повертаємо матеріал з активністю", en: "Bxf4 — recover material with activity" }, auto: ['d7d5'] },
      { question: { uk: "Bc5 — чорні розвиваються. Nc3 — розвиток і тиск!?", en: "Bc5 — Black develops. Nc3 — develop and pressure!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 розвивається і підтримує центр", en: "Nc3 develops and supports the center" }, auto: ['f8c5'] }
    ]
  },
  {
    id: 8,
    name: { uk: "Іспанська партія — Пастка Маршалла", en: "Ruy López — Marshall Attack Trap" },
    opening: { uk: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Be7 6.Re1 b5 7.Bb3 0-0 8.c3 d5 — Гамбіт Маршалла", en: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Be7 6.Re1 b5 7.Bb3 0-0 8.c3 d5 — Marshall Attack" },
    desc: { uk: "Атака Маршалла — жертва пішака заради потужної атаки. Чорні жертвують d5 і отримують довготривалу ініціативу. Пастка для білих — не знаючи теорії, вони потрапляють під смертельну атаку.", en: "Marshall Attack — pawn sacrifice for a powerful attack. Black sacrifices d5 and gets long-term initiative. Trap for White — not knowing the theory, they fall under a deadly attack." },
    white: { uk: ["Класична Іспанська партія", "Треба знати теорію!", "Помилка = потужна атака чорних"], en: ["Classical Ruy López", "Must know the theory!", "Mistake = powerful Black attack"] },
    black: { uk: ["Жертвує d5 навмисно", "Компенсація — активні фігури", "Довготривала атака на короля"], en: ["Sacrifices d5 deliberately", "Compensation — active pieces", "Long-term king attack"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Іспанська партія. e4!", en: "Ruy López. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — відкрита гра", en: "e4 — open game" } },
      { question: { uk: "e5. Nf3 — атакуємо!?", en: "e5. Nf3 — attack!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 атакує e5", en: "Nf3 attacks e5" }, auto: ['e7e5'] },
      { question: { uk: "Nc6. Bb5 — визначальний хід Іспанської!", en: "Nc6. Bb5 — the defining Ruy López move!" }, move: 'f1b5', san: 'Bb5', hint: { uk: "Bb5 — Іспанська партія!", en: "Bb5 — Ruy López!" }, auto: ['b8c6'] },
      { question: { uk: "a6 — чорні тиснуть на слона. Ba4 — слон відступає!", en: "a6 — Black pressures bishop. Ba4 — bishop retreats!" }, move: 'b5a4', san: 'Ba4', hint: { uk: "Ba4 зберігає тиск на Nc6", en: "Ba4 maintains pressure on Nc6" }, auto: ['a7a6'] },
      { question: { uk: "Nf6 — кінь розвивається. Рокіровка — безпека!", en: "Nf6 — knight develops. Castle — safety!" }, move: 'e1g1', san: 'O-O', hint: { uk: "0-0 — класична Іспанська", en: "O-O — classical Ruy López" }, auto: ['g8f6'] },
      { question: { uk: "Be7 — чорні готуються. Re1 — тура на активну позицію!", en: "Be7 — Black prepares. Re1 — rook to active position!" }, move: 'f1e1', san: 'Re1', hint: { uk: "Re1 підтримує пішак e4", en: "Re1 supports the e4 pawn" }, auto: ['f8e7'] },
      { question: { uk: "b5 — чорні тиснуть. Bb3 — слон відступає на міцнішу позицію!", en: "b5 — Black pushes. Bb3 — bishop to safer square!" }, move: 'a4b3', san: 'Bb3', hint: { uk: "Bb3 — слон на b3 міцніше і активніше", en: "Bb3 — bishop is stronger and more active on b3" }, auto: ['b7b5'] },
      { question: { uk: "0-0 — рокіровка чорних. c3 — готуємо d4!", en: "0-0 — Black castles. c3 — prepare d4!" }, move: 'c2c3', san: 'c3', hint: { uk: "c3 готує d4 і зміцнює центр", en: "c3 prepares d4 and reinforces center" }, auto: ['e8g8'] },
      { question: { uk: "d5! — Атака Маршалла! exd5 — беремо пішак!", en: "d5! — Marshall Attack! exd5 — take the pawn!" }, move: 'e4d5', san: 'exd5', hint: { uk: "exd5 — приймаємо жертву!", en: "exd5 — accept the sacrifice!" }, auto: ['d7d5'] }
    ]
  },
  {
    id: 9,
    name: { uk: "Сицілійська — Атака Сосонко", en: "Sicilian — Sozin Attack Trap" },
    opening: { uk: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 Nc6 6.Bc4 — Атака Сосонко", en: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 Nc6 6.Bc4 — Sozin Attack" },
    desc: { uk: "Атака Сосонко — агресивна система проти Сицілійської. Слон c4 загрожує f7 і e6. Типова пастка: Nxe6! жертва коня, яка руйнує позицію чорних.", en: "Sozin Attack — aggressive system against the Sicilian. Bishop c4 threatens f7 and e6. Typical trap: Nxe6! knight sacrifice that destroys Black's position." },
    white: { uk: ["Bc4 атакує f7 і e6", "Nxe6! — жертва коня", "Qb3 — атака f7 і b7 одночасно"], en: ["Bc4 attacks f7 and e6", "Nxe6! — knight sacrifice", "Qb3 — attacks f7 and b7 simultaneously"] },
    black: { uk: ["e6 — слабке місце", "Nxe6 — небезпечна жертва", "Складно захищатись без знань теорії"], en: ["e6 — the weak square", "Nxe6 — dangerous sacrifice", "Hard to defend without theoretical knowledge"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Проти Сицілійської. e4!", en: "Against the Sicilian. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — відкрита гра", en: "e4 — open game" } },
      { question: { uk: "c5 — Сицілійська. Nf3 — розвиваємось!", en: "c5 — Sicilian. Nf3 — develop!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 — перший хід відкритої Сицілійської", en: "Nf3 — first move of open Sicilian" }, auto: ['c7c5'] },
      { question: { uk: "d6 зіграно. d4 — відкриваємо центр!", en: "d6 played. d4 — open the center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 відкриває центр!", en: "d4 opens the center!" }, auto: ['d7d6'] },
      { question: { uk: "cxd4 взято. Nxd4 — відновлюємось з розвитком!", en: "cxd4 taken. Nxd4 — recapture with development!" }, move: 'f3d4', san: 'Nxd4', hint: { uk: "Nxd4 — кінь на сильну позицію", en: "Nxd4 — knight to strong square" }, auto: ['c5d4'] },
      { question: { uk: "Nf6 атакує e4. Nc3 — захищаємо і розвиваємось!", en: "Nf6 attacks e4. Nc3 — defend and develop!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 захищає e4 і розвивається", en: "Nc3 defends e4 and develops" }, auto: ['g8f6'] },
      { question: { uk: "Nc6 — кінь розвивається. Bc4 — атака Сосонко!", en: "Nc6 — knight develops. Bc4 — Sozin Attack!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 — Атака Сосонко! Загрожує e6 і f7", en: "Bc4 — Sozin Attack! Threatens e6 and f7" }, auto: ['b8c6'] },
      { question: { uk: "e6 — чорні захищають. Bb3 — слон відходить на міцну позицію!", en: "e6 — Black defends. Bb3 — bishop to solid position!" }, move: 'c4b3', san: 'Bb3', hint: { uk: "Bb3 — слон міцніше, зберігає тиск", en: "Bb3 — bishop is safer, maintains pressure" }, auto: ['e7e6'] },
      { question: { uk: "Be7 — чорні готуються рокіруватись. f4 — готуємо f5!", en: "Be7 — Black prepares to castle. f4 — prepare f5!" }, move: 'f2f4', san: 'f4', hint: { uk: "f4 готує атаку f4-f5!", en: "f4 prepares the f4-f5 attack!" }, auto: ['f8e7'] },
      { question: { uk: "0-0 — рокіровка чорних. f5! — атакуємо!", en: "0-0 — Black castles. f5! — attack!" }, move: 'f4f5', san: 'f5!', hint: { uk: "f5 відкриває атаку на короля!", en: "f5 opens the attack on the king!" }, auto: ['e8g8'] }
    ]
  },
  {
    id: 10,
    name: { uk: "Пастка у Ферзевому гамбіті (Пастка Манхейма)", en: "Queen's Gambit Trap (Mannheim Trap)" },
    opening: { uk: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5! — Жертва коня", en: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5! — Knight sacrifice" },
    desc: { uk: "Пастка Манхейма — класична жертва коня у ВФГ. Після 5...exd5 білі грають 6.Nxd5! і якщо чорні беруть Nxd5, Bxd8 виграє ферзя.", en: "Mannheim Trap — classic knight sacrifice in QGD. After 5...exd5 White plays 6.Nxd5! and if Black takes Nxd5, Bxd8 wins the queen." },
    white: { uk: ["Nxd5! — жертва коня", "Bxd8 виграє ферзя", "Чорні не можуть уникнути матеріальних втрат"], en: ["Nxd5! — knight sacrifice", "Bxd8 wins the queen", "Black cannot avoid material loss"] },
    black: { uk: ["Не брати Nxd5!", "Краще Bb4 або c6", "Будь-яке взяття коня веде до програшу"], en: ["Don't take Nxd5!", "Better Bb4 or c6", "Any capture of the knight leads to loss"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Ферзевий гамбіт. d4!", en: "Queen's Gambit. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "d5 — відповідь. c4 — гамбіт!", en: "d5 — answered. c4 — gambit!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 — ферзевий гамбіт", en: "c4 — Queen's Gambit" }, auto: ['d7d5'] },
      { question: { uk: "e6 — відмовляються! Nc3 — розвиваємось!", en: "e6 — declined! Nc3 — develop!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 підтримує центр", en: "Nc3 supports the center" }, auto: ['e7e6'] },
      { question: { uk: "Nf6. Bg5 — пришпилюємо коня!", en: "Nf6. Bg5 — pin the knight!" }, move: 'c1g5', san: 'Bg5', hint: { uk: "Bg5 пришпилює Nf6 до ферзя!", en: "Bg5 pins Nf6 to the queen!" }, auto: ['g8f6'] },
      { question: { uk: "Nbd7 — захищають пін. cxd5 — відкриваємо позицію!", en: "Nbd7 — defends the pin. cxd5 — open the position!" }, move: 'c4d5', san: 'cxd5', hint: { uk: "cxd5 відкриває лінії", en: "cxd5 opens lines" }, auto: ['b8d7'] },
      { question: { uk: "exd5 — чорні відновлюють. Nxd5! — ЖЕРТВА КОНЯ!", en: "exd5 — Black recaptures. Nxd5! — KNIGHT SACRIFICE!" }, move: 'c3d5', san: 'Nxd5!', hint: { uk: "Nxd5! — якщо Nxd5, то Bxd8 виграє ферзя!", en: "Nxd5! — if Nxd5, then Bxd8 wins the queen!" }, auto: ['e6d5'] },
      { question: { uk: "Nxd5 — чорні беруть коня (помилка!). Bxd8 — виграємо ферзя!", en: "Nxd5 — Black takes knight (mistake!). Bxd8 — win the queen!" }, move: 'g5d8', san: 'Bxd8!', hint: { uk: "Bxd8! — беремо ферзя!", en: "Bxd8! — take the queen!" }, auto: ['f6d5'] },
      { question: { uk: "Kxd8 — король бере. Nxf7+ — шах і виграш тури!", en: "Kxd8 — king takes. Nxf7+ — check and win rook!" }, move: 'd5f7', san: 'Nxf7+', hint: { uk: "Nxf7+ — виграємо туру h8!", en: "Nxf7+ — win the Rh8!" }, auto: ['e8d8'] },
      { question: { uk: "Ke7 — відступає. Nxh8 — тура наша!", en: "Ke7 — retreats. Nxh8 — rook is ours!" }, move: 'f7h8', san: 'Nxh8', hint: { uk: "Nxh8 — виграємо туру!", en: "Nxh8 — win the rook!" }, auto: ['d8e7'] }
    ]
  },
  {
    id: 11,
    name: { uk: "Гамбіт Блекмара-Діймера — Пастка Теічмана", en: "Blackmar-Diemer Gambit — Teichmann Trap" },
    opening: { uk: "1.d4 d5 2.e4 dxe4 3.Nc3 Nf6 4.f3 exf3 5.Nxf3 Bg4 — Типова пастка", en: "1.d4 d5 2.e4 dxe4 3.Nc3 Nf6 4.f3 exf3 5.Nxf3 Bg4 — Typical trap" },
    desc: { uk: "Гамбіт БД — агресивний гамбіт білих. Пастка Теічмана виникає коли чорні грають Bg4 і потім помилково беруть на e2. Після Nd5! чорні потрапляють у безвихідь.", en: "BDG — aggressive White gambit. Teichmann Trap arises when Black plays Bg4 and then mistakenly takes on e2. After Nd5! Black is in a hopeless position." },
    white: { uk: ["e4 — агресивний гамбіт", "f3 — другий жертовний хід", "Nd5! — типовий виграшний удар"], en: ["e4 — aggressive gambit", "f3 — second sacrificial move", "Nd5! — typical winning blow"] },
    black: { uk: ["Приймає два пішака", "Але відстає у розвитку", "Bg4 — типова помилка що веде до Nd5!"], en: ["Accepts two pawns", "But falls behind in development", "Bg4 — typical mistake leading to Nd5!"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Ферзева гра. d4!", en: "Queen's game. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "d5 — відповідь. e4 — ГАМБІТ!", en: "d5 — answered. e4 — GAMBIT!" }, move: 'e2e4', san: 'e4!', hint: { uk: "e4 — пропозиція гамбіту!", en: "e4 — gambit offer!" }, auto: ['d7d5'] },
      { question: { uk: "dxe4 — взяли! Nc3 — атакуємо пішак e4!", en: "dxe4 — taken! Nc3 — attack the e4 pawn!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 тисне на e4 і розвивається", en: "Nc3 pressures e4 and develops" }, auto: ['d5e4'] },
      { question: { uk: "Nf6 захищає. f3 — ДРУГИЙ ГАМБІТ!", en: "Nf6 defends. f3 — SECOND GAMBIT!" }, move: 'f2f3', san: 'f3!', hint: { uk: "f3 — другий жертовний хід!", en: "f3 — second sacrificial move!" }, auto: ['g8f6'] },
      { question: { uk: "exf3 — взяли. Nxf3 — відновлюємось з розвитком!", en: "exf3 — taken. Nxf3 — recapture with development!" }, move: 'g1f3', san: 'Nxf3', hint: { uk: "Nxf3 — розвиток і тиск!", en: "Nxf3 — development and pressure!" }, auto: ['e4f3'] },
      { question: { uk: "Bg4 — чорні пришпилюють! Bc4 — слон активно виходить!", en: "Bg4 — Black pins! Bc4 — bishop develops actively!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 — активний слон і загрожує Nd5!", en: "Bc4 — active bishop, threatens Nd5!" }, auto: ['c8g4'] },
      { question: { uk: "e6 — чорні захищають. Qb3 — ферзь атакує f7 і b7!", en: "e6 — Black defends. Qb3 — queen attacks f7 and b7!" }, move: 'd1b3', san: 'Qb3', hint: { uk: "Qb3 — подвійна загроза f7 і b7!", en: "Qb3 — double threat on f7 and b7!" }, auto: ['e7e6'] },
      { question: { uk: "Nc6 — захищають b7. 0-0 — рокіровка і тиск!", en: "Nc6 — defends b7. 0-0 — castle and pressure!" }, move: 'e1g1', san: 'O-O', hint: { uk: "0-0 — безпека і тиск зберігається", en: "O-O — safety and pressure maintained" }, auto: ['b8c6'] },
      { question: { uk: "Bxf3? Чорні беруть ферзя (помилка!). Nd5! — ПАСТКА!", en: "Bxf3? Black takes queen (mistake!). Nd5! — TRAP!" }, move: 'c3d5', san: 'Nd5!', hint: { uk: "Nd5! — виграє ферзя або отримує мат!", en: "Nd5! — wins the queen or delivers mate!" }, auto: ['g4f3'] }
    ]
  },
  {
    id: 12,
    name: { uk: "Французький захист — Пастка Алехіна-Четверикова", en: "French Defense — Alekhine-Chatard Trap" },
    opening: { uk: "1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.h4 — Атака Алехіна", en: "1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.h4 — Alekhine-Chatard Attack" },
    desc: { uk: "Атака Алехіна-Четверикова у Французькому захисті. h4 пропонує жертву слона g5. Якщо чорні беруть Bxg5 hxg5 і потім g6, то Qh5! веде до неминучого мату.", en: "Alekhine-Chatard Attack in the French Defense. h4 offers the Bg5 sacrifice. If Black takes Bxg5 hxg5 and then g6, Qh5! leads to unavoidable mate." },
    white: { uk: ["h4 — агресивна атака", "Жертвує слона g5", "Qh5! — загроза мату"], en: ["h4 — aggressive attack", "Sacrifices Bg5", "Qh5! — mating threat"] },
    black: { uk: ["Не варто брати Bxg5", "h4 небезпечне прийняти", "Краще c5 або a6"], en: ["Should not take Bxg5", "Dangerous to accept h4", "Better c5 or a6"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Проти Французького. e4!", en: "Against the French. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — відкрита гра", en: "e4 — open game" } },
      { question: { uk: "e6 — Французький! d4 — будуємо центр!", en: "e6 — French! d4 — build the center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 зміцнює центр", en: "d4 reinforces center" }, auto: ['e7e6'] },
      { question: { uk: "d5 — чорні атакують. Nc3 — захищаємо e4!", en: "d5 — Black attacks. Nc3 — defend e4!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 — класичний хід у Французькому", en: "Nc3 — classical move in the French" }, auto: ['d7d5'] },
      { question: { uk: "Nf6. Bg5 — пришпилюємо коня!", en: "Nf6. Bg5 — pin the knight!" }, move: 'c1g5', san: 'Bg5', hint: { uk: "Bg5 — класичний пін у Французькому", en: "Bg5 — classical pin in the French" }, auto: ['g8f6'] },
      { question: { uk: "Be7. e5! — Advance у Французькому!", en: "Be7. e5! — Advance in the French!" }, move: 'e4e5', san: 'e5', hint: { uk: "e5 — пішак виганяє коня f6", en: "e5 — pawn chases the Nf6" }, auto: ['f8e7'] },
      { question: { uk: "Nfd7 — кінь відступає. h4! — АТАКА АЛЕХІНА!", en: "Nfd7 — knight retreats. h4! — ALEKHINE ATTACK!" }, move: 'h2h4', san: 'h4!', hint: { uk: "h4 — пропонує жертву слона!", en: "h4 — offers the bishop sacrifice!" }, auto: ['f6d7'] },
      { question: { uk: "Bxg5 — чорні беруть жертву! hxg5 — відновлюємось!", en: "Bxg5 — Black takes the sacrifice! hxg5 — recapture!" }, move: 'h4g5', san: 'hxg5', hint: { uk: "hxg5 — відновлюємось з відкритою лінією h!", en: "hxg5 — recapture with open h-file!" }, auto: ['e7g5'] },
      { question: { uk: "g6 — чорні намагаються захиститись. Qh5! — АТАКА!", en: "g6 — Black tries to defend. Qh5! — ATTACK!" }, move: 'd1h5', san: 'Qh5!', hint: { uk: "Qh5! загрожує Qxh7# і іншими матами!", en: "Qh5! threatens Qxh7# and other mates!" }, auto: ['g7g6'] },
      { question: { uk: "h6 — чорні рятуються. g6 відкриває h7. Rxh6! — ЖЕРТВА ТУРИ!", en: "h6 — Black tries to escape. g6 opens h7. Rxh6! — ROOK SACK!" }, move: 'h1h6', san: 'Rxh6!', hint: { uk: "Rxh6! — жертва тури, що веде до мату!", en: "Rxh6! — rook sacrifice leading to mate!" }, auto: ['h7h6'] }
    ]
  },
  {
    id: 13,
    name: { uk: "Захист Каро-Канн — Пастка Пана", en: "Caro-Kann — Pawn Trap" },
    opening: { uk: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Bc4 Ngf6 6.Ng5! — Атака на f7", en: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Bc4 Ngf6 6.Ng5! — f7 Attack" },
    desc: { uk: "Класична пастка в Каро-Канн. Після 5...Ngf6 білі грають 6.Ng5! і загрожують Nxf7. Якщо чорні грають e6, то Nxe6! — жертва коня з виграшем ферзя.", en: "Classic Caro-Kann trap. After 5...Ngf6 White plays 6.Ng5! threatening Nxf7. If Black plays e6, then Nxe6! — knight sacrifice winning the queen." },
    white: { uk: ["Ng5 загрожує f7", "Nxe6! якщо e6", "Bxf7+ якщо Ke7"], en: ["Ng5 threatens f7", "Nxe6! if e6", "Bxf7+ if Ke7"] },
    black: { uk: ["Не грати e6 після Ng5!", "Краще Nb6 або Qb6", "e6 веде до втрати матеріалу"], en: ["Don't play e6 after Ng5!", "Better Nb6 or Qb6", "e6 leads to material loss"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Проти Каро-Канн. e4!", en: "Against Caro-Kann. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — класика", en: "e4 — classic" } },
      { question: { uk: "c6 — Каро-Канн! d4 — будуємо центр!", en: "c6 — Caro-Kann! d4 — build center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 зміцнює пішак e4", en: "d4 reinforces e4" }, auto: ['c7c6'] },
      { question: { uk: "d5 — атакують. Nc3 — захищаємо!", en: "d5 — they attack. Nc3 — defend!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 захищає e4 і розвивається", en: "Nc3 defends e4 and develops" }, auto: ['d7d5'] },
      { question: { uk: "dxe4 — чорні беруть. Nxe4 — відновлюємось!", en: "dxe4 — Black takes. Nxe4 — recapture!" }, move: 'c3e4', san: 'Nxe4', hint: { uk: "Nxe4 — відновлюємось з силою", en: "Nxe4 — recapture with power" }, auto: ['d5e4'] },
      { question: { uk: "Nd7 — кінь розвивається. Bc4 — слон цілиться у f7!", en: "Nd7 — knight develops. Bc4 — bishop eyes f7!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 — загрожує f7!", en: "Bc4 — threatening f7!" }, auto: ['b8d7'] },
      { question: { uk: "Ngf6 — другий кінь. Ng5! — атакуємо f7!", en: "Ngf6 — second knight. Ng5! — attack f7!" }, move: 'e4g5', san: 'Ng5!', hint: { uk: "Ng5 загрожує Nxf7 і Bxf7+!", en: "Ng5 threatens Nxf7 and Bxf7+!" }, auto: ['g8f6'] },
      { question: { uk: "e6 — чорні захищають f7 (помилка!). Nxe6! — ЖЕРТВА!", en: "e6 — Black defends f7 (mistake!). Nxe6! — SACRIFICE!" }, move: 'g5e6', san: 'Nxe6!', hint: { uk: "Nxe6! — виграємо ферзя після fxe6 Bxe6!", en: "Nxe6! — win queen after fxe6 Bxe6!" }, auto: ['e7e6'] },
      { question: { uk: "fxe6 — чорні беруть. Bxe6 — слон виграє ферзя!", en: "fxe6 — Black takes. Bxe6 — bishop wins the queen!" }, move: 'c4e6', san: 'Bxe6!', hint: { uk: "Bxe6 загрожує матом і виграє ферзя!", en: "Bxe6 threatens mate and wins the queen!" }, auto: ['f7e6'] },
      { question: { uk: "Qe7 — ферзь захищається. Nf7! — виграємо ферзя!", en: "Qe7 — queen defends. Nf7! — win the queen!" }, move: 'g5f7', san: 'Nf7!', hint: { uk: "Nf7 виграє ферзя e7!", en: "Nf7 wins the Qe7!" }, auto: ['d8e7'] }
    ]
  },
  {
    id: 14,
    name: { uk: "Захист Німцовича — Пастка Фішера", en: "Nimzo-Indian — Fischer Trap" },
    opening: { uk: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e4 — Класичний варіант Німцо", en: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e4 — Classical Nimzo-Indian" },
    desc: { uk: "Захист Німцовича — один з найкращих захистів чорних. Чорні пришпилюють коня bb4. Пастка Фішера: після e4 чорні мають відповісти точно, інакше втрачають матеріал.", en: "Nimzo-Indian Defense — one of Black's best defenses. Black pins the knight with Bb4. Fischer Trap: after e4 Black must respond precisely, otherwise they lose material." },
    white: { uk: ["e4 — агресивне розширення", "Центр e4+d4", "Тиск на слона b4"], en: ["e4 — aggressive expansion", "Center e4+d4", "Pressure on Bb4"] },
    black: { uk: ["Bb4 пришпилює коня", "e4 — виклик для чорних", "Bxc3+ або d5 — відповіді"], en: ["Bb4 pins the knight", "e4 — challenge for Black", "Bxc3+ or d5 — responses"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Німцо-Індійський. d4!", en: "Nimzo-Indian. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "Nf6. c4 — розширюємо центр!", en: "Nf6. c4 — expand the center!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 розширює вплив у центрі", en: "c4 expands central influence" }, auto: ['g8f6'] },
      { question: { uk: "e6. Nc3 — розвиваємось!", en: "e6. Nc3 — develop!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 — класичний хід Німцо", en: "Nc3 — classic Nimzo move" }, auto: ['e7e6'] },
      { question: { uk: "Bb4 — пін! e4 — агресивно розширюємо центр!", en: "Bb4 — pin! e4 — aggressively expand center!" }, move: 'e2e4', san: 'e4!', hint: { uk: "e4 — агресивний план у Німцо", en: "e4 — aggressive plan in Nimzo" }, auto: ['f8b4'] },
      { question: { uk: "Nxe4 — кінь атакує! d5 — атакуємо ще раз!", en: "Nxe4 — knight attacks! d5 — attack again!" }, move: 'd4d5', san: 'd5', hint: { uk: "d5 відкриває лінії!", en: "d5 opens lines!" }, auto: ['f6e4'] },
      { question: { uk: "Qh4 — ферзь виходить! exd5 — відкриваємо позицію!", en: "Qh4 — queen comes out! exd5 — open the position!" }, move: 'c4d5', san: 'cxd5', hint: { uk: "cxd5 відкриває центр", en: "cxd5 opens the center" }, auto: ['d8h4'] },
      { question: { uk: "Ng3 — кінь відступає? Bd3 — атакуємо коня!", en: "Ng3 — knight retreats? Bd3 — attack the knight!" }, move: 'f1d3', san: 'Bd3', hint: { uk: "Bd3 атакує Ng3 і розвивається", en: "Bd3 attacks Ng3 and develops" }, auto: ['e4g3'] },
      { question: { uk: "Nc6 — кінь розвивається. Nf3 — виганяємо ферзя!", en: "Nc6 — knight develops. Nf3 — chase the queen!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 атакує ферзя h4", en: "Nf3 attacks Qh4" }, auto: ['b8c6'] },
      { question: { uk: "Qg4 — ферзь відходить. Рокіровка — безпека!", en: "Qg4 — queen retreats. Castle — safety!" }, move: 'e1g1', san: 'O-O', hint: { uk: "0-0 — безпека і підготовка атаки", en: "O-O — safety and prepare the attack" }, auto: ['h4g4'] }
    ]
  },
  {
    id: 15,
    name: { uk: "Груенфельд — Пастка Руссо", en: "Grünfeld — Russian Trap" },
    opening: { uk: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.Qb3 dxc4 6.Qxc4 — Пастка у розміні", en: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.Qb3 dxc4 6.Qxc4 — Exchange trap" },
    desc: { uk: "Пастка у Грюнфельді: після 5.Qb3 і dxc4 6.Qxc4, якщо чорні грають c5 7.dxc5 Na6, то Qxa6! — виграш фігури. Треба знати точну теорію.", en: "Grünfeld trap: after 5.Qb3 and dxc4 6.Qxc4, if Black plays c5 7.dxc5 Na6, then Qxa6! wins a piece. Must know precise theory." },
    white: { uk: ["Qb3 атакує d5 і b7", "dxc5 і Qxa6! виграє коня", "Чорні залишаються без фігури"], en: ["Qb3 attacks d5 and b7", "dxc5 and Qxa6! wins knight", "Black is left without a piece"] },
    black: { uk: ["Na6 — пастка!", "Треба грати Be6 або 0-0", "Qxa6 і чорні програють"], en: ["Na6 — the trap!", "Should play Be6 or 0-0", "Qxa6 and Black loses"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Груенфельд. d4!", en: "Grünfeld. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "Nf6. c4 — розширюємо!", en: "Nf6. c4 — expand!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 розширює центр", en: "c4 expands center" }, auto: ['g8f6'] },
      { question: { uk: "g6 — фіанкетто. Nc3 — розвиваємось!", en: "g6 — fianchetto. Nc3 — develop!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 підтримує центр", en: "Nc3 supports center" }, auto: ['g7g6'] },
      { question: { uk: "d5 — Груенфельд! Nf3 — продовжуємо розвиток!", en: "d5 — Grünfeld! Nf3 — continue development!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 контролює e5", en: "Nf3 controls e5" }, auto: ['d7d5'] },
      { question: { uk: "Bg7 — фіанкетований. Qb3! — атакуємо d5 і b7!", en: "Bg7 — fianchettoed. Qb3! — attack d5 and b7!" }, move: 'd1b3', san: 'Qb3!', hint: { uk: "Qb3 атакує d5 і b7!", en: "Qb3 attacks d5 and b7!" }, auto: ['f8g7'] },
      { question: { uk: "dxc4 — чорні беруть. Qxc4 — відновлюємось!", en: "dxc4 — Black takes. Qxc4 — recapture!" }, move: 'b3c4', san: 'Qxc4', hint: { uk: "Qxc4 — ферзь на активну позицію", en: "Qxc4 — queen to active position" }, auto: ['d5c4'] },
      { question: { uk: "c5 — чорні підривають. dxc5 — беремо!", en: "c5 — Black undermines. dxc5 — take!" }, move: 'd4c5', san: 'dxc5', hint: { uk: "dxc5 і тепер Na6? Буде пастка!", en: "dxc5 and now Na6? The trap is set!" }, auto: ['c7c5'] },
      { question: { uk: "Na6 — чорні помиляються! Qxa6! — ВИГРАЄМО КОНЯ!", en: "Na6 — Black makes the mistake! Qxa6! — WIN THE KNIGHT!" }, move: 'c4a6', san: 'Qxa6!', hint: { uk: "Qxa6! — ферзь їсть коня!", en: "Qxa6! — queen eats the knight!" }, auto: ['b8a6'] },
      { question: { uk: "Nb8 — відступає. b6 — атакуємо ферзя!", en: "Nb8 — retreats. b6 — attack the queen!" }, move: 'c5b6', san: 'b6!', hint: { uk: "b6 виграє час — і зберігає матеріал", en: "b6 wins tempo and maintains material" }, auto: ['a6b8'] }
    ]
  },
  {
    id: 16,
    name: { uk: "Голландський захист — Пастка Стаунтона", en: "Dutch Defense — Staunton Gambit Trap" },
    opening: { uk: "1.d4 f5 2.e4 fxe4 3.Nc3 Nf6 4.Bg5 — Гамбіт Стаунтона", en: "1.d4 f5 2.e4 fxe4 3.Nc3 Nf6 4.Bg5 — Staunton Gambit" },
    desc: { uk: "Гамбіт Стаунтона — агресивна відповідь на Голландський захист. Після 4.Bg5 загрожує Bxf6 і виграш пішака e4. Пастка: якщо чорні беруть h6, то Bxf6 і Qh5+ з матовою атакою.", en: "Staunton Gambit — aggressive response to the Dutch Defense. After 4.Bg5 threatens Bxf6 and winning e4. The trap: if Black plays h6, then Bxf6 and Qh5+ with mating attack." },
    white: { uk: ["e4 — гамбіт проти Голландського", "Bg5 — пін і загроза", "Qh5+ — матова атака"], en: ["e4 — gambit vs Dutch", "Bg5 — pin and threat", "Qh5+ — mating attack"] },
    black: { uk: ["h6 після Bg5 — помилка!", "Краще g6 або d5", "Qh5+ після Bxf6 дуже небезпечне"], en: ["h6 after Bg5 — mistake!", "Better g6 or d5", "Qh5+ after Bxf6 is very dangerous"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Ферзева гра. d4!", en: "Queen's game. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 відкриває ферзеву гру", en: "d4 opens queen's game" } },
      { question: { uk: "f5 — Голландський! e4 — ГАМБІТ СТАУНТОНА!", en: "f5 — Dutch! e4 — STAUNTON GAMBIT!" }, move: 'e2e4', san: 'e4!', hint: { uk: "e4 — гамбіт проти Голландського", en: "e4 — gambit against the Dutch" }, auto: ['f7f5'] },
      { question: { uk: "fxe4 — взяли! Nc3 — тискаємо на e4!", en: "fxe4 — taken! Nc3 — pressure on e4!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 тисне на e4 і розвивається", en: "Nc3 pressures e4 and develops" }, auto: ['f5e4'] },
      { question: { uk: "Nf6 захищає e4. Bg5! — ПІН КОНЯ!", en: "Nf6 defends e4. Bg5! — PIN THE KNIGHT!" }, move: 'c1g5', san: 'Bg5!', hint: { uk: "Bg5 пришпилює Nf6 до ферзя!", en: "Bg5 pins Nf6 to the queen!" }, auto: ['g8f6'] },
      { question: { uk: "h6 — чорні проганяють слона (ПОМИЛКА!). Bxf6! — беремо!", en: "h6 — Black chases bishop (MISTAKE!). Bxf6! — take it!" }, move: 'g5f6', san: 'Bxf6!', hint: { uk: "Bxf6! — беремо коня і рвемо позицію!", en: "Bxf6! — take the knight and break the position!" }, auto: ['h7h6'] },
      { question: { uk: "exf6 — відновлюють. Qh5+ — ШАХ!", en: "exf6 — recapture. Qh5+ — CHECK!" }, move: 'd1h5', san: 'Qh5+', hint: { uk: "Qh5+ — шах і загроза мату!", en: "Qh5+ — check and mating threat!" }, auto: ['e7f6'] },
      { question: { uk: "g6 — захищаються. Qxg6+ — продовжуємо атаку!", en: "g6 — they defend. Qxg6+ — continue attack!" }, move: 'h5g6', san: 'Qxg6+', hint: { uk: "Qxg6+ — шах із виграшем матеріалу!", en: "Qxg6+ — check winning material!" }, auto: ['g7g6'] },
      { question: { uk: "Ke7 — король тікає. Nxe4 — відновлюємось і атакуємо!", en: "Ke7 — king flees. Nxe4 — recapture and attack!" }, move: 'c3e4', san: 'Nxe4', hint: { uk: "Nxe4 — відновлюємо пішак з атакою", en: "Nxe4 — recapture with attack" }, auto: ['e8e7'] },
      { question: { uk: "d5 — чорні відбиваються. Nxf6 — виграємо матеріал!", en: "d5 — Black fights back. Nxf6 — win material!" }, move: 'e4f6', san: 'Nxf6!', hint: { uk: "Nxf6 — виграємо слона або ферзя!", en: "Nxf6 — win bishop or queen!" }, auto: ['d7d5'] }
    ]
  },
  {
    id: 17,
    name: { uk: "Дамський Індійський — Пастка Петросяна", en: "Queen's Indian — Petrosian Trap" },
    opening: { uk: "1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.a3 Bb7 5.Nc3 d5 6.cxd5 Nxd5 7.e4! — Пастка Петросяна", en: "1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.a3 Bb7 5.Nc3 d5 6.cxd5 Nxd5 7.e4! — Petrosian Trap" },
    desc: { uk: "Пастка Петросяна: після 6...Nxd5 7.e4! — кінь d5 потрапляє в пастку. Якщо Nxc3 8.bxc3 і білі мають перевагу. Якщо Nb4 9.Bc4! — кінь втрачений.", en: "Petrosian Trap: after 6...Nxd5 7.e4! — the Nd5 is trapped. If Nxc3 8.bxc3 White has advantage. If Nb4 9.Bc4! — the knight is lost." },
    white: { uk: ["e4 ловить коня d5", "Bc4 після Nb4", "Кінь b4 втрачений"], en: ["e4 traps the Nd5", "Bc4 after Nb4", "The Nb4 is lost"] },
    black: { uk: ["Nxd5 — потрапляє в пастку", "Треба грати exd5 замість Nxd5", "Nb4 після e4 — програш коня"], en: ["Nxd5 — falls into trap", "Should play exd5 instead of Nxd5", "Nb4 after e4 — losing the knight"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Дамський Індійський. d4!", en: "Queen's Indian. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "Nf6. c4 — розширюємо!", en: "Nf6. c4 — expand!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 розширює центр", en: "c4 expands center" }, auto: ['g8f6'] },
      { question: { uk: "e6. Nf3 — розвиваємось!", en: "e6. Nf3 — develop!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 контролює e5", en: "Nf3 controls e5" }, auto: ['e7e6'] },
      { question: { uk: "b6 — Дамський Індійський! a3 — готуємо b4!", en: "b6 — Queen's Indian! a3 — prepare b4!" }, move: 'a2a3', san: 'a3', hint: { uk: "a3 зупиняє Bb4 і готує b4", en: "a3 stops Bb4 and prepares b4" }, auto: ['b7b6'] },
      { question: { uk: "Bb7 — слон фіанкетований. Nc3 — розвиваємось!", en: "Bb7 — bishop fianchettoed. Nc3 — develop!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 підтримує центр", en: "Nc3 supports center" }, auto: ['c8b7'] },
      { question: { uk: "d5 — підривають! cxd5 — відкриваємо!", en: "d5 — undermine! cxd5 — open!" }, move: 'c4d5', san: 'cxd5', hint: { uk: "cxd5 відкриває позицію", en: "cxd5 opens the position" }, auto: ['d7d5'] },
      { question: { uk: "Nxd5 — кінь бере. e4! — ПАСТКА!", en: "Nxd5 — knight takes. e4! — TRAP!" }, move: 'e2e4', san: 'e4!', hint: { uk: "e4! — кінь d5 в пастці!", en: "e4! — the Nd5 is trapped!" }, auto: ['f6d5'] },
      { question: { uk: "Nb4 — кінь тікає. Bc4! — КІНЬ ВТРАЧЕНИЙ!", en: "Nb4 — knight flees. Bc4! — KNIGHT IS LOST!" }, move: 'f1c4', san: 'Bc4!', hint: { uk: "Bc4! — кінь b4 втрачений без компенсації!", en: "Bc4! — Nb4 is lost without compensation!" }, auto: ['d5b4'] },
      { question: { uk: "a5 — рятуються від Bc4. a4! — закриваємо відступ!", en: "a5 — escaping Bc4. a4! — close the escape!" }, move: 'a3a4', san: 'a4!', hint: { uk: "a4 блокує коня b4 — він загинув!", en: "a4 traps the Nb4 — it's lost!" }, auto: ['b4a6'] }
    ]
  },
  {
    id: 18,
    name: { uk: "Іспанська — Пастка Маттісона", en: "Ruy López — Mattison Trap" },
    opening: { uk: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Nxe4 — Пастка відкритого варіанту", en: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Nxe4 — Open Variation trap" },
    desc: { uk: "Відкритий варіант Іспанської — один з найгостріших! Після Nxe4 починається складна боротьба. Пастка Маттісона: якщо чорні не знають теорії, вони програють матеріал через d4 і Re1.", en: "Open Ruy López — one of the sharpest! After Nxe4 a complex fight begins. Mattison Trap: if Black doesn't know the theory, they lose material through d4 and Re1." },
    white: { uk: ["d4 — пастка для коня e4", "Re1 — тура на активну лінію", "f3 — виганяємо коня"], en: ["d4 — trap for the Ne4", "Re1 — rook on active file", "f3 — chase the knight"] },
    black: { uk: ["Nxe4 — можна брати!", "Але треба знати точну відповідь d5!", "Без d5 — кінь втрачений"], en: ["Nxe4 — can take!", "But must know exact response d5!", "Without d5 — knight is lost"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Іспанська. e4!", en: "Ruy López. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "e5. Nf3 — атакуємо!", en: "e5. Nf3 — attack!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 атакує e5", en: "Nf3 attacks e5" }, auto: ['e7e5'] },
      { question: { uk: "Nc6. Bb5 — Іспанська!", en: "Nc6. Bb5 — Ruy López!" }, move: 'f1b5', san: 'Bb5', hint: { uk: "Bb5 — Іспанська партія!", en: "Bb5 — Ruy López!" }, auto: ['b8c6'] },
      { question: { uk: "a6. Ba4 — відступаємо зберігаючи тиск!", en: "a6. Ba4 — retreat maintaining pressure!" }, move: 'b5a4', san: 'Ba4', hint: { uk: "Ba4 зберігає тиск на коня c6", en: "Ba4 maintains pressure on Nc6" }, auto: ['a7a6'] },
      { question: { uk: "Nf6. 0-0 — рокіровка!", en: "Nf6. 0-0 — castle!" }, move: 'e1g1', san: 'O-O', hint: { uk: "0-0 — безпека і підготовка Re1", en: "O-O — safety and prepare Re1" }, auto: ['g8f6'] },
      { question: { uk: "Nxe4 — чорні беруть! d4 — ПАСТКА!", en: "Nxe4 — Black takes! d4 — TRAP!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 атакує e5 і ловить коня e4!", en: "d4 attacks e5 and traps the Ne4!" }, auto: ['f6e4'] },
      { question: { uk: "b5 — чорні тиснуть на Ba4. Bb3 — слон відступає!", en: "b5 — Black pressures Ba4. Bb3 — bishop retreats!" }, move: 'a4b3', san: 'Bb3', hint: { uk: "Bb3 відступає на сильнішу позицію", en: "Bb3 retreats to stronger square" }, auto: ['b7b5'] },
      { question: { uk: "d5 — чорні відповідають правильно. dxe5 — беремо!", en: "d5 — Black responds correctly. dxe5 — take!" }, move: 'd4e5', san: 'dxe5', hint: { uk: "dxe5 відкриває центр", en: "dxe5 opens the center" }, auto: ['d7d5'] },
      { question: { uk: "Nc3 — чорні тримають коня. Re1 — тура активно виходить!", en: "Nc3 — Black holds the knight. Re1 — rook activates!" }, move: 'f1e1', san: 'Re1', hint: { uk: "Re1 тисне на e4 і e5!", en: "Re1 pressures e4 and e5!" }, auto: ['e4c3'] }
    ]
  },
  {
    id: 19,
    name: { uk: "Сицілійська — Пастка Назарова (Варіант Найдорфа)", en: "Sicilian — Nazarov Trap (Najdorf Variation)" },
    opening: { uk: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a5 — Варіант Найдорфа", en: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a5 — Najdorf Variation" },
    desc: { uk: "Варіант Найдорфа — найпопулярніший варіант Сицілійської захисту. Після a6 чорні готують b5. Атака Англійська: Bg5 і f4 — потужна атакувальна система.", en: "Najdorf Variation — the most popular Sicilian variation. After a6 Black prepares b5. English Attack: Bg5 and f4 — powerful attacking system." },
    white: { uk: ["Bg5 — класична атака у Найдорфі", "f4 — підготовка f5", "e5 — виганяємо коня f6"], en: ["Bg5 — classic Najdorf attack", "f4 — prepare f5", "e5 — chase the Nf6"] },
    black: { uk: ["a6 — Найдорф", "Активна контргра b5", "e5 у відповідь"], en: ["a6 — Najdorf", "Active counterplay with b5", "e5 in response"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Сицілійська — Найдорф. e4!", en: "Sicilian — Najdorf. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — відкрита гра", en: "e4 — open game" } },
      { question: { uk: "c5 — Сицілійська! Nf3 — розвиваємось!", en: "c5 — Sicilian! Nf3 — develop!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 — відкрита Сицілійська", en: "Nf3 — open Sicilian" }, auto: ['c7c5'] },
      { question: { uk: "d6. d4 — відкриваємо центр!", en: "d6. d4 — open the center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 відкриває центр", en: "d4 opens center" }, auto: ['d7d6'] },
      { question: { uk: "cxd4 взято. Nxd4 — відновлюємось!", en: "cxd4 taken. Nxd4 — recapture!" }, move: 'f3d4', san: 'Nxd4', hint: { uk: "Nxd4 — розвиток", en: "Nxd4 — development" }, auto: ['c5d4'] },
      { question: { uk: "Nf6. Nc3 — захищаємо e4!", en: "Nf6. Nc3 — defend e4!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 захищає e4", en: "Nc3 defends e4" }, auto: ['g8f6'] },
      { question: { uk: "a6 — НАЙДОРФ! Bg5 — класична атака!", en: "a6 — NAJDORF! Bg5 — classic attack!" }, move: 'c1g5', san: 'Bg5', hint: { uk: "Bg5 — класична атака у Найдорфі!", en: "Bg5 — classic Najdorf attack!" }, auto: ['a7a6'] },
      { question: { uk: "e6 — чорні готуються. f4 — підготовка f5!", en: "e6 — Black prepares. f4 — prepare f5!" }, move: 'f2f4', san: 'f4', hint: { uk: "f4 готує f4-f5 атаку!", en: "f4 prepares the f4-f5 attack!" }, auto: ['e7e6'] },
      { question: { uk: "Be7 — захист. Qf3 — ферзь на позицію!", en: "Be7 — defense. Qf3 — queen to position!" }, move: 'd1f3', san: 'Qf3', hint: { uk: "Qf3 посилює тиск і загрожує e5", en: "Qf3 increases pressure and threatens e5" }, auto: ['f8e7'] },
      { question: { uk: "Qc7 — ферзь розвивається. 0-0-0 — довга рокіровка для атаки!", en: "Qc7 — queen develops. 0-0-0 — long castle for attack!" }, move: 'e1c1', san: 'O-O-O', hint: { uk: "0-0-0 — рокіровка для атаки!", en: "O-O-O — castle for the attack!" }, auto: ['d8c7'] }
    ]
  },
  {
    id: 20,
    name: { uk: "Пастка Алехіна — Атака Чатара", en: "Alekhine's Defense — Chatard Attack" },
    opening: { uk: "1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 Bg4 5.Be2 e6 6.0-0 — Класичний варіант", en: "1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 Bg4 5.Be2 e6 6.0-0 — Classical variation" },
    desc: { uk: "Захист Алехіна — провокаційний захист. Чорні провокують просування e5 і потім підривають пішаковий центр. Пастка: c4 і після Nxc3 bxc3 — пішаки слабкі.", en: "Alekhine's Defense — provocative defense. Black provokes e5 advance then undermines the pawn center. Trap: c4 and after Nxc3 bxc3 — pawns are weak." },
    white: { uk: ["e5 — виганяємо коня", "c4 — атакуємо коня d5", "d4+e5+c4 — потужний центр"], en: ["e5 — chase the knight", "c4 — attack Nd5", "d4+e5+c4 — powerful center"] },
    black: { uk: ["Провокує просування пішаків", "Підриває центр dxe5 або c5", "Фігурна гра проти пішакового центру"], en: ["Provokes pawn advances", "Undermines with dxe5 or c5", "Piece play against pawn center"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Захист Алехіна. e4!", en: "Alekhine's Defense. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "Nf6 — кінь атакує e4! e5 — виганяємо!", en: "Nf6 — knight attacks e4! e5 — chase it!" }, move: 'e4e5', san: 'e5', hint: { uk: "e5 виганяє коня f6", en: "e5 chases the Nf6" }, auto: ['g8f6'] },
      { question: { uk: "Nd5 — кінь відступає. d4 — зміцнюємо центр!", en: "Nd5 — knight retreats. d4 — reinforce center!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 зміцнює пішак e5", en: "d4 supports the e5 pawn" }, auto: ['f6d5'] },
      { question: { uk: "d6 — чорні підривають. Nf3 — розвиваємось!", en: "d6 — Black undermines. Nf3 — develop!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 розвивається і підтримує e5", en: "Nf3 develops and supports e5" }, auto: ['d7d6'] },
      { question: { uk: "Bg4 — пін! Be2 — захищаємо коня!", en: "Bg4 — pin! Be2 — protect the knight!" }, move: 'f1e2', san: 'Be2', hint: { uk: "Be2 захищає від піну і розвивається", en: "Be2 defends from pin and develops" }, auto: ['c8g4'] },
      { question: { uk: "e6. 0-0 — рокіровка!", en: "e6. 0-0 — castle!" }, move: 'e1g1', san: 'O-O', hint: { uk: "0-0 — безпека і підготовка", en: "O-O — safety and preparation" }, auto: ['e7e6'] },
      { question: { uk: "Be7. c4 — атакуємо коня d5!", en: "Be7. c4 — attack the Nd5!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 виганяє коня d5!", en: "c4 chases the Nd5!" }, auto: ['f8e7'] },
      { question: { uk: "Nb6 — кінь відступає. exd6 — беремо пішак!", en: "Nb6 — knight retreats. exd6 — take the pawn!" }, move: 'e5d6', san: 'exd6', hint: { uk: "exd6 відновлює матеріал", en: "exd6 restores material" }, auto: ['d5b6'] },
      { question: { uk: "Bxd6. Nc3 — розвиваємось і посилюємо!", en: "Bxd6. Nc3 — develop and reinforce!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 підтримує d4 і розвивається", en: "Nc3 supports d4 and develops" }, auto: ['e7d6'] }
    ]
  },
  {
    id: 21,
    name: { uk: "Пастка Мата Дурака (найшвидший мат)", en: "Fool's Mate (Fastest Checkmate)" },
    opening: { uk: "1.f3 e5 2.g4?? — Найбільша помилка в шахах", en: "1.f3 e5 2.g4?? — The biggest mistake in chess" },
    desc: { uk: "Мат Дурака — найшвидший мат в шахах (2 ходи!). Білі роблять дві серйозні помилки: f3 і g4, відкриваючи діагональ для ферзя чорних. Qh4# — і гра закінчена!", en: "Fool's Mate — the fastest checkmate in chess (2 moves!). White makes two serious mistakes: f3 and g4, opening the diagonal for Black's queen. Qh4# — game over!" },
    white: { uk: ["f3 — послаблює e4 і g4", "g4 — КАТАСТРОФІЧНА ПОМИЛКА", "Відкриває діагональ для Qh4#"], en: ["f3 — weakens e4 and g4", "g4 — CATASTROPHIC MISTAKE", "Opens diagonal for Qh4#"] },
    black: { uk: ["Ти граєш ЗА ЧОРНИХ!", "e5 — займаємо центр", "Qh4# — МАТ!"], en: ["You play AS BLACK!", "e5 — occupy the center", "Qh4# — CHECKMATE!"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "⚠️ Ти граєш ЗА ЧОРНИХ! Білі зіграли f3 — помилка! Як відповідаєш?", en: "⚠️ You play AS BLACK! White played f3 — mistake! How do you respond?" }, move: 'e7e5', san: 'e5', hint: { uk: "e5 займає центр!", en: "e5 occupies the center!" }, auto: ['f2f3'] },
      { question: { uk: "Білі зробили g4 — ще більша помилка! Яким ходом ти матуєш?", en: "White played g4 — even bigger mistake! What move gives checkmate?" }, move: 'd8h4', san: 'Qh4#', hint: { uk: "Qh4# — мат! Ферзь на h4!", en: "Qh4# — checkmate! Queen to h4!" }, auto: ['g2g4'] }
    ]
  },
  {
    id: 22,
    name: { uk: "Мат Дурака Навпаки (для чорних)", en: "Reversed Fool's Mate (for Black)" },
    opening: { uk: "1.e4 g5?? 2.d4 f5?? — Помилки чорних", en: "1.e4 g5?? 2.d4 f5?? — Black's mistakes" },
    desc: { uk: "Аналог Мату Дурака але для чорних. Якщо чорні грають g5 і f5, білий ферзь видає мат Qh5#. Показує чому не варто рухати крайні пішаки на початку гри.", en: "Analog of Fool's Mate but for Black. If Black plays g5 and f5, White queen delivers Qh5#. Shows why you shouldn't move flank pawns in the opening." },
    white: { uk: ["Ти граєш ЗА БІЛИХ!", "Qh5# — мат у 3 ходи!", "Швидкий удар через слабкість f7"], en: ["You play AS WHITE!", "Qh5# — mate in 3 moves!", "Quick blow through f7 weakness"] },
    black: { uk: ["g5 і f5 — небезпечні ходи", "Відкривають діагональ e2-h5", "Qh5# неминучий"], en: ["g5 and f5 — dangerous moves", "Open the e2-h5 diagonal", "Qh5# is unavoidable"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Ти граєш за білих. Перший хід?", en: "You play as White. First move?" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 — класичний початок", en: "e4 — classic start" } },
      { question: { uk: "g5 — чорні роблять помилку! d4 — зміцнюємо центр?", en: "g5 — Black makes a mistake! d4 — reinforce center?" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 будує центр перед ударом", en: "d4 builds center before the blow" }, auto: ['g7g5'] },
      { question: { uk: "f5 — ще одна помилка чорних! Якою фігурою оголошуємо мат?", en: "f5 — another Black mistake! What piece delivers checkmate?" }, move: 'd1h5', san: 'Qh5#', hint: { uk: "Qh5# — МАТ! Ферзь на h5!", en: "Qh5# — CHECKMATE! Queen to h5!" }, auto: ['f7f5'] }
    ]
  },
  {
    id: 23,
    name: { uk: "Мат Scholar's Mate (Мат Вченого)", en: "Scholar's Mate" },
    opening: { uk: "1.e4 e5 2.Bc4 Nc6 3.Qh5 — Атака на f7", en: "1.e4 e5 2.Bc4 Nc6 3.Qh5 — Attack on f7" },
    desc: { uk: "Мат Вченого — найвідоміша пастка для початківців! Qh5 і Bc4 разом атакують f7. Якщо чорні не знають захисту, мат неминучий на 4-му ході.", en: "Scholar's Mate — the most famous beginner trap! Qh5 and Bc4 together attack f7. If Black doesn't know the defense, checkmate is inevitable on move 4." },
    white: { uk: ["Qh5 і Bc4 атакують f7", "Qxf7# — мат!", "Але g6 легко відбиває!"], en: ["Qh5 and Bc4 attack f7", "Qxf7# — checkmate!", "But g6 easily refutes!"] },
    black: { uk: ["g6! — відбиває атаку", "Не грати Nc6 перед g6", "Після g6 ферзь відступає з втратою темпу"], en: ["g6! — refutes the attack", "Don't play Nc6 before g6", "After g6 queen retreats losing tempo"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Мат Вченого. e4!", en: "Scholar's Mate. e4!" }, move: 'e2e4', san: 'e4', hint: { uk: "e4 відкриває гру", en: "e4 opens the game" } },
      { question: { uk: "e5 відповідь. Bc4 — слон атакує f7!", en: "e5 answered. Bc4 — bishop attacks f7!" }, move: 'f1c4', san: 'Bc4', hint: { uk: "Bc4 цілиться у слабкий f7", en: "Bc4 targets the weak f7" }, auto: ['e7e5'] },
      { question: { uk: "Nc6 — захищають e5. Qh5! — ферзь виходить, загрожує f7!", en: "Nc6 — defends e5. Qh5! — queen comes out, threatens f7!" }, move: 'd1h5', san: 'Qh5!', hint: { uk: "Qh5 загрожує Qxf7# і Qxe5+!", en: "Qh5 threatens Qxf7# and Qxe5+!" }, auto: ['b8c6'] },
      { question: { uk: "Nf6 — чорні захищають f7 (помилка!). Qxf7# — МАТ!", en: "Nf6 — Black defends f7 (mistake!). Qxf7# — CHECKMATE!" }, move: 'h5f7', san: 'Qxf7#', hint: { uk: "Qxf7# — МАТ ВЧЕНОГО!", en: "Qxf7# — SCHOLAR'S MATE!" }, auto: ['g8f6'] }
    ]
  },
  {
    id: 24,
    name: { uk: "Пастка Ферзевого Гамбіту — Тартаковер", en: "QGD Trap — Tartakower Variation" },
    opening: { uk: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 0-0 6.Nf3 h6 — Варіант Тартаковера", en: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 0-0 6.Nf3 h6 — Tartakower Variation" },
    desc: { uk: "Варіант Тартаковера у ВФГ. h6 — запитує слона. Якщо Bh4, чорні можуть грати g5! з темпом. Але якщо білі знають пастку, то Bxf6 — і позиція чорних послаблена.", en: "Tartakower Variation in QGD. h6 — questions the bishop. If Bh4, Black can play g5! with tempo. But if White knows the trap, then Bxf6 — Black's position is weakened." },
    white: { uk: ["Bxf6 замість Bh4", "Після gxf6 позиція чорних послаблена", "cxd5 відкриває позицію"], en: ["Bxf6 instead of Bh4", "After gxf6 Black's position is weakened", "cxd5 opens the position"] },
    black: { uk: ["h6 — типовий хід у Тартаковері", "gxf6 послаблює рокіровку", "Краще Ne4 або c5"], en: ["h6 — typical Tartakower move", "gxf6 weakens the castled position", "Better Ne4 or c5"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "ВФГ — Тартаковер. d4!", en: "QGD — Tartakower. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "d5. c4 — гамбіт!", en: "d5. c4 — gambit!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 — ферзевий гамбіт", en: "c4 — Queen's Gambit" }, auto: ['d7d5'] },
      { question: { uk: "e6 — відмовляються. Nc3 — розвиваємось!", en: "e6 — declined. Nc3 — develop!" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 підтримує центр", en: "Nc3 supports center" }, auto: ['e7e6'] },
      { question: { uk: "Nf6. Bg5 — пришпилюємо!", en: "Nf6. Bg5 — pin!" }, move: 'c1g5', san: 'Bg5', hint: { uk: "Bg5 пришпилює Nf6", en: "Bg5 pins Nf6" }, auto: ['g8f6'] },
      { question: { uk: "Be7. e3 — зміцнюємо d4!", en: "Be7. e3 — reinforce d4!" }, move: 'e2e3', san: 'e3', hint: { uk: "e3 зміцнює d4", en: "e3 reinforces d4" }, auto: ['f8e7'] },
      { question: { uk: "0-0 — рокіровка. Nf3 — розвиваємось!", en: "0-0 — castles. Nf3 — develop!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 розвивається", en: "Nf3 develops" }, auto: ['e8g8'] },
      { question: { uk: "h6 — запитують слона. Bxf6! — беремо замість Bh4!", en: "h6 — questions bishop. Bxf6! — take instead of Bh4!" }, move: 'g5f6', san: 'Bxf6!', hint: { uk: "Bxf6 послаблює рокіровку чорних!", en: "Bxf6 weakens Black's castled position!" }, auto: ['h7h6'] },
      { question: { uk: "Bxf6 — чорні відновлюють. cxd5 — відкриваємо позицію!", en: "Bxf6 — Black recaptures. cxd5 — open the position!" }, move: 'c4d5', san: 'cxd5', hint: { uk: "cxd5 відкриває центр і використовує слабкість f6", en: "cxd5 opens center exploiting the f6 weakness" }, auto: ['e7f6'] },
      { question: { uk: "exd5 відновлюють. Bd3 — слон активно виходить!", en: "exd5 recaptures. Bd3 — bishop activates!" }, move: 'f1d3', san: 'Bd3', hint: { uk: "Bd3 — слон на ударну позицію!", en: "Bd3 — bishop to attacking position!" }, auto: ['e6d5'] }
    ]
  },
  {
    id: 25,
    name: { uk: "Пастка Будапештського Гамбіту", en: "Budapest Gambit Trap" },
    opening: { uk: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Nf3 Bc5 5.e3 Nc6 6.Be2 0-0 — Пастка Адлера", en: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Nf3 Bc5 5.e3 Nc6 6.Be2 0-0 — Adler Trap" },
    desc: { uk: "Будапештський гамбіт — ризикований але активний гамбіт. Пастка Адлера: після 0-0 і Nxe5 7.Nxe5 Re8! — тура пришпилює коня і виграє його після f6!", en: "Budapest Gambit — risky but active gambit. Adler Trap: after 0-0 and Nxe5 7.Nxe5 Re8! — rook pins the knight and wins it after f6!" },
    white: { uk: ["Приймає гамбіт dxe5", "Nxe5 — але це пастка!", "Re8! і f6! виграє коня"], en: ["Accepts gambit dxe5", "Nxe5 — but it's a trap!", "Re8! and f6! wins the knight"] },
    black: { uk: ["e5 — гамбіт!", "Ng4 атакує пішак e5", "Re8! пришпилює коня — ПАСТКА!"], en: ["e5 — gambit!", "Ng4 attacks e5 pawn", "Re8! pins the knight — TRAP!"] },
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    steps: [
      { question: { uk: "Будапештський гамбіт. d4!", en: "Budapest Gambit. d4!" }, move: 'd2d4', san: 'd4', hint: { uk: "d4 — ферзева гра", en: "d4 — queen's game" } },
      { question: { uk: "Nf6. c4 — пропонуємо c4!", en: "Nf6. c4 — offer c4!" }, move: 'c2c4', san: 'c4', hint: { uk: "c4 — пропозиція", en: "c4 — the offer" }, auto: ['g8f6'] },
      { question: { uk: "e5! — ГАМБІТ БУДАПЕШТА! dxe5 — приймаємо!", en: "e5! — BUDAPEST GAMBIT! dxe5 — accept!" }, move: 'd4e5', san: 'dxe5', hint: { uk: "dxe5 — приймаємо гамбіт!", en: "dxe5 — accept the gambit!" }, auto: ['e7e5'] },
      { question: { uk: "Ng4 атакує e5. Nf3 — захищаємо!", en: "Ng4 attacks e5. Nf3 — defend!" }, move: 'g1f3', san: 'Nf3', hint: { uk: "Nf3 захищає пішак e5", en: "Nf3 defends the e5 pawn" }, auto: ['f6g4'] },
      { question: { uk: "Bc5 — слон виходить. e3 — зміцнюємо центр!", en: "Bc5 — bishop develops. e3 — reinforce center!" }, move: 'e2e3', san: 'e3', hint: { uk: "e3 зміцнює пішак e5", en: "e3 reinforces the e5 pawn" }, auto: ['f8c5'] },
      { question: { uk: "Nc6 — кінь виходить. Be2 — захищаємо і розвиваємось!", en: "Nc6 — knight develops. Be2 — defend and develop!" }, move: 'f1e2', san: 'Be2', hint: { uk: "Be2 захищає і розвивається", en: "Be2 defends and develops" }, auto: ['b8c6'] },
      { question: { uk: "0-0 — рокіровка чорних. Nxe5? — беремо пішак g4!", en: "0-0 — Black castles. Nxe5? — take the g4 pawn area!" }, move: 'f3e5', san: 'Nxe5?', hint: { uk: "Nxe5 — але це ПАСТКА!", en: "Nxe5 — but this is a TRAP!" }, auto: ['e8g8'] },
      { question: { uk: "Re8! — тура пришпилює коня! f6! — ВИГРАЄМО КОНЯ!", en: "Re8! — rook pins the knight! f6! — WIN THE KNIGHT!" }, move: 'e3e4', san: 'e4', hint: { uk: "Краще e4 — але чорні вже мають ініціативу!", en: "Better e4 — but Black already has initiative!" }, auto: ['g8e8'] },
      { question: { uk: "Nxe4 — кінь відступає. Nc6xе5 — чорні відновлюються!?", en: "Nxe4 — knight retreats. Nc6xe5 — Black recaptures!?" }, move: 'b1c3', san: 'Nc3', hint: { uk: "Nc3 захищає і розвивається — краща відповідь!", en: "Nc3 defends and develops — best response!" }, auto: ['c6e5'] }
    ]
  }
];
