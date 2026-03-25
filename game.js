const ORDER_TYPES = {
  food: { key: "W", code: "KeyW", icon: "🍎", label: "Еда", className: "food" },
  tech: { key: "A", code: "KeyA", icon: "🔌", label: "Электроника", className: "tech" },
  wear: { key: "S", code: "KeyS", icon: "👕", label: "Одежда", className: "wear" },
  home: { key: "D", code: "KeyD", icon: "🏠", label: "Дом", className: "home" },
};

const PHASES = [
  { until: 45_000, spawn: 1_800, tensionMultiplier: 1, gimmicks: [] },
  { until: 120_000, spawn: 1_550, tensionMultiplier: 1, gimmicks: ["glitch", "quarrel"] },
  { until: 210_000, spawn: 1_280, tensionMultiplier: 1, gimmicks: ["glitch", "quarrel", "rush"] },
  {
    until: Infinity,
    spawn: 1_020,
    tensionMultiplier: 1.2,
    gimmicks: ["glitch", "quarrel", "rush"],
  },
];

const CUSTOMER_QUOTES = {
  food: ["Сэндвич и я полетел.", "Еда без задержек, пожалуйста.", "У меня тут перекус на минуту."],
  tech: ["Мне бы кабель без драмы.", "Гаджет приехал целым?", "Надеюсь, провод тот самый."],
  wear: ["Мой худи уже здесь?", "Одежду бы быстро забрать.", "Ткань не потерялась по пути?"],
  home: ["Лампа приехала, да?", "Заберу для дома и побегу.", "Коробка для кухни у вас?"],
  angry: ["Это не мой заказ.", "Я уже давно жду.", "Пожалуйста, без путаницы."],
  quarrel: ["Эй, соблюдайте очередь.", "Мы вообще по одной линии идем?", "Не подрезайте у стойки."],
};

const SKIN_TONES = ["#f3d0b0", "#ddb08a", "#c78d65", "#8f6244"];
const HAIR_TONES = ["#2d2320", "#5b4032", "#21181a", "#7b5b46"];
const SHIRT_TONES = ["#2f6d8a", "#7a4b84", "#35524f", "#7b5146", "#59637c"];
const SHOE_TONES = ["#20262a", "#3f332e", "#223445"];
const ACCENT_TONES = {
  food: "#4da95a",
  tech: "#2f7fd6",
  wear: "#b6588f",
  home: "#e18b35",
};

const DOM = {
  gameScreen: document.querySelector("#game-screen"),
  stageSurface: document.querySelector("#stage-surface"),
  introOverlay: document.querySelector("#intro-overlay"),
  restartButton: document.querySelector("#restart-button"),
  menuButton: document.querySelector("#menu-button"),
  board: document.querySelector("#board"),
  score: document.querySelector("#score"),
  combo: document.querySelector("#combo"),
  time: document.querySelector("#time"),
  tensionFill: document.querySelector("#tension-fill"),
  gimmickLabel: document.querySelector("#gimmick-label"),
  bonusPill: document.querySelector("#bonus-pill"),
  queuePill: document.querySelector("#queue-pill"),
  sceneDialogue: document.querySelector("#scene-dialogue"),
  sceneDialogueLabel: document.querySelector("#scene-dialogue-label"),
  sceneDialogueText: document.querySelector("#scene-dialogue-text"),
  overlay: document.querySelector("#game-over-overlay"),
  resultScore: document.querySelector("#result-score"),
  resultServed: document.querySelector("#result-served"),
  resultMaxCombo: document.querySelector("#result-max-combo"),
  resultTime: document.querySelector("#result-time"),
  musicToggle: document.querySelector("#music-toggle"),
  toastStack: document.querySelector("#toast-stack"),
  controlButtons: [...document.querySelectorAll(".control-button")],
};

const boardCells = [];
const state = {
  running: false,
  awaitingStart: true,
  board: createEmptyBoard(),
  score: 0,
  served: 0,
  combo: 0,
  maxCombo: 0,
  sessionMs: 0,
  spawnAccumulator: 0,
  tension: 0,
  calmUntil: 0,
  accessRows: 1,
  firstFivePerfect: true,
  totalErrors: 0,
  consecutiveErrors: 0,
  slowdowns: [],
  speedups: [],
  notifications: [],
  perfectRow: null,
  flowUntil: 0,
  fastAccessUntil: 0,
  antiStressReady: false,
  gimmick: null,
  gimmickUntil: 0,
  glitchStreak: 0,
  quarrelSpreadAt: 0,
  quarrelCells: [],
  rushUntil: 0,
  activeSpeakerId: null,
  activeSpeechText: "",
  activeSpeechLabel: "",
  speechSwitchAt: 0,
  lastFrame: 0,
  lastId: 1,
};

const audioState = {
  ctx: null,
  enabled: true,
  musicTimer: 0,
  musicStep: 0,
  unlocked: false,
};

function createEmptyBoard() {
  return Array.from({ length: 5 }, () => Array(4).fill(null));
}

function initBoardMarkup() {
  for (let row = 4; row >= 0; row -= 1) {
    for (let col = 0; col < 4; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      DOM.board.appendChild(cell);
      boardCells.push(cell);
    }
  }
}

function resetRoundState() {
  state.running = true;
  state.awaitingStart = false;
  state.board = createEmptyBoard();
  state.score = 0;
  state.served = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.sessionMs = 0;
  state.spawnAccumulator = 0;
  state.tension = 0;
  state.calmUntil = 0;
  state.accessRows = 1;
  state.firstFivePerfect = true;
  state.totalErrors = 0;
  state.consecutiveErrors = 0;
  state.slowdowns = [];
  state.speedups = [];
  state.notifications = [];
  state.perfectRow = null;
  state.flowUntil = 0;
  state.fastAccessUntil = 0;
  state.antiStressReady = false;
  state.gimmick = null;
  state.gimmickUntil = 0;
  state.glitchStreak = 0;
  state.quarrelSpreadAt = 0;
  state.quarrelCells = [];
  state.rushUntil = 0;
  state.activeSpeakerId = null;
  state.activeSpeechText = "";
  state.activeSpeechLabel = "";
  state.speechSwitchAt = 0;
  state.lastFrame = 0;
}

function setStandby() {
  state.running = false;
  state.awaitingStart = true;
  state.board = createEmptyBoard();
  state.score = 0;
  state.served = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.sessionMs = 0;
  state.spawnAccumulator = 0;
  state.tension = 0;
  state.calmUntil = 0;
  state.accessRows = 1;
  state.firstFivePerfect = true;
  state.totalErrors = 0;
  state.consecutiveErrors = 0;
  state.slowdowns = [];
  state.speedups = [];
  state.notifications = [];
  state.perfectRow = null;
  state.flowUntil = 0;
  state.fastAccessUntil = 0;
  state.antiStressReady = false;
  state.gimmick = null;
  state.gimmickUntil = 0;
  state.glitchStreak = 0;
  state.quarrelSpreadAt = 0;
  state.quarrelCells = [];
  state.rushUntil = 0;
  state.activeSpeakerId = null;
  state.activeSpeechText = "Нажми любую клавишу или тапни по сцене, чтобы открыть смену.";
  state.activeSpeechLabel = "Оператор";
  state.speechSwitchAt = 0;
  state.lastFrame = 0;
  DOM.overlay.classList.add("hidden");
  DOM.introOverlay.classList.remove("hidden");
  DOM.gimmickLabel.textContent = "Готово к открытию смены";
  render();
}

function startGame() {
  unlockAudio();
  resetRoundState();
  DOM.overlay.classList.add("hidden");
  DOM.introOverlay.classList.add("hidden");
  DOM.gimmickLabel.textContent = "Спокойная смена";
  spawnClient();
  render();
  requestAnimationFrame(loop);
}

function endGame() {
  state.running = false;
  DOM.resultScore.textContent = formatNumber(state.score);
  DOM.resultServed.textContent = formatNumber(state.served);
  DOM.resultMaxCombo.textContent = `x${state.maxCombo}`;
  DOM.resultTime.textContent = formatTime(state.sessionMs);
  DOM.overlay.classList.remove("hidden");
  DOM.gimmickLabel.textContent = "Смена завершена";
  pushToast("Смена окончена. Очередь уперлась в стойку.");
  playFx("fail");
}

function createClient(type) {
  return {
    id: state.lastId++,
    type,
    quote: sample(CUSTOMER_QUOTES[type]),
    enteredAccessAt: null,
    angryUntil: 0,
    skin: sample(SKIN_TONES),
    hair: sample(HAIR_TONES),
    shirt: sample(SHIRT_TONES),
    shoe: sample(SHOE_TONES),
    accent: ACCENT_TONES[type],
  };
}

function getRandomOrder() {
  return sample(Object.keys(ORDER_TYPES));
}

function getPhase() {
  return PHASES.find((phase) => state.sessionMs < phase.until) || PHASES[PHASES.length - 1];
}

function spawnClient() {
  const freeColumns = [];
  for (let col = 0; col < 4; col += 1) {
    if (!state.board[4][col]) {
      freeColumns.push(col);
    }
  }

  if (freeColumns.length === 0) {
    endGame();
    return false;
  }

  const targetCol = sample(freeColumns);
  state.board[4][targetCol] = createClient(getRandomOrder());
  collapseColumn(targetCol);
  updateAccessTimers();
  playFx("spawn");
  return true;
}

function collapseColumn(col) {
  const clients = [];
  for (let row = 0; row < 5; row += 1) {
    if (state.board[row][col]) {
      clients.push(state.board[row][col]);
    }
  }

  for (let row = 0; row < 5; row += 1) {
    state.board[row][col] = clients[row] || null;
  }
}

function updateAccessTimers() {
  const now = performance.now();
  for (let row = 0; row < state.accessRows; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const client = state.board[row][col];
      if (client && client.enteredAccessAt === null) {
        client.enteredAccessAt = now;
      }
    }
  }
}

function getAccessibleClients() {
  const clients = [];
  for (let row = 0; row < state.accessRows; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const client = state.board[row][col];
      if (client) {
        clients.push({ client, row, col });
      }
    }
  }
  return clients;
}

function isQuarrelCell(row, col) {
  return state.quarrelCells.some((cell) => cell.row === row && cell.col === col);
}

function serviceInput(order) {
  if (!state.running) {
    return;
  }

  pressButton(order);

  const accessible = getAccessibleClients();
  const quarrelTarget = accessible.find(({ row, col }) => isQuarrelCell(row, col));
  if (quarrelTarget) {
    serveClient(quarrelTarget.row, quarrelTarget.col, true);
    return;
  }

  const match = accessible.find(({ client }) => client.type === order);
  if (match) {
    serveClient(match.row, match.col, false);
    return;
  }

  registerMiss();
}

function registerMiss() {
  const now = performance.now();
  const accessible = getAccessibleClients();
  if (accessible.length > 0) {
    accessible[0].client.angryUntil = now + 900;
    state.activeSpeakerId = accessible[0].client.id;
    state.activeSpeechText = sample(CUSTOMER_QUOTES.angry);
    state.activeSpeechLabel = getSpeechLabel(accessible[0].row, accessible[0].col, true, false);
    state.speechSwitchAt = now + 2_000;
  }

  state.totalErrors += 1;
  state.consecutiveErrors += 1;
  state.combo = 0;
  state.firstFivePerfect = false;
  state.perfectRow = null;
  state.speedups.push(now + 5_000);

  if (state.consecutiveErrors >= 3) {
    state.antiStressReady = true;
  }

  pushToast("Ошибка выдачи. Комбо сброшено.");
  playFx("miss");
  vibrate([30]);
  render();
}

function serveClient(row, col, fromQuarrel) {
  const now = performance.now();
  const client = state.board[row][col];
  if (!client) {
    return;
  }

  state.combo += 1;
  state.maxCombo = Math.max(state.maxCombo, state.combo);
  state.served += 1;
  state.consecutiveErrors = 0;

  let points = 10 + (state.combo - 1) * 5;
  if (client.enteredAccessAt && now - client.enteredAccessAt <= 2_000) {
    points += 3;
  }
  if (now < state.flowUntil) {
    points = Math.round(points * 1.5);
  }
  if (state.antiStressReady) {
    points += 15;
    state.antiStressReady = false;
    pushToast("Антистресс сработал: +15");
  }
  if (fromQuarrel) {
    points += 10;
    clearQuarrel();
    pushToast("Ссора погашена.");
  }

  state.score += points;
  state.slowdowns.push(now + 3_000);

  if (state.combo >= 5 && now >= state.flowUntil) {
    state.flowUntil = now + 10_000;
    pushToast("Режим потока: +50% к очкам на 10 секунд.");
  }

  if (state.firstFivePerfect && state.served >= 5 && state.totalErrors === 0) {
    state.fastAccessUntil = now + 20_000;
    pushToast("Быстрый старт: зона доступа расширена до 2 рядов.");
  }

  trackPerfectRow(client.type);

  state.board[row][col] = null;
  collapseColumn(col);
  updateAccessTimers();

  if (state.gimmick === "glitch") {
    state.glitchStreak += 1;
    if (state.glitchStreak >= 3) {
      finishGimmick("Сканер восстановлен.");
    }
  }

  playFx("success");
  vibrate([14]);
  render();
}

function trackPerfectRow(servedType) {
  const bottomRow = state.board[0].filter(Boolean);
  if (!state.perfectRow && bottomRow.length === 4) {
    const sameType = bottomRow.every((client) => client.type === bottomRow[0].type);
    if (sameType) {
      state.perfectRow = { type: bottomRow[0].type, remaining: 4 };
      pushToast("Идеальный ряд обнаружен.");
    }
  }

  if (!state.perfectRow) {
    return;
  }

  if (state.perfectRow.type !== servedType) {
    state.perfectRow = null;
    return;
  }

  state.perfectRow.remaining -= 1;
  if (state.perfectRow.remaining <= 0) {
    state.score += 20;
    pushToast("Идеальный ряд: +20");
    playFx("bonus");
    state.perfectRow = null;
  }
}

function updateBonuses(now) {
  const nextAccessRows = now < state.fastAccessUntil ? 2 : 1;
  if (nextAccessRows !== state.accessRows) {
    state.accessRows = nextAccessRows;
    updateAccessTimers();
  }

  if (now >= state.gimmickUntil && state.gimmick) {
    finishGimmick();
  }
}

function updateTension(dt, now) {
  const phase = getPhase();
  if (now < state.calmUntil) {
    return;
  }

  state.slowdowns = state.slowdowns.filter((endsAt) => endsAt > now);
  state.speedups = state.speedups.filter((endsAt) => endsAt > now);

  const rate = Math.max(
    0.015,
    (0.05 - state.slowdowns.length * 0.01 + state.speedups.length * 0.02) * phase.tensionMultiplier
  );

  if (phase.gimmicks.length === 0) {
    state.tension = Math.min(0.88, state.tension + rate * dt);
    return;
  }

  state.tension = Math.min(1, state.tension + rate * dt);
  if (state.tension >= 1) {
    triggerGimmick(now);
  }
}

function triggerGimmick(now) {
  const phase = getPhase();
  const pool = phase.gimmicks.length > 0 ? phase.gimmicks : ["rush"];
  const gimmick = sample(pool);

  state.tension = 0;
  state.calmUntil = now + 5_000;
  state.gimmick = gimmick;
  state.glitchStreak = 0;
  state.quarrelCells = [];

  if (gimmick === "glitch") {
    state.gimmickUntil = now + 8_000;
    DOM.gimmickLabel.textContent = "Глюк сканера";
    pushToast("Глюк сканера: верх очереди читается хуже.");
  } else if (gimmick === "quarrel") {
    const activated = createQuarrel(now);
    if (!activated) {
      state.gimmick = "rush";
      state.gimmickUntil = now + 10_000;
      state.rushUntil = state.gimmickUntil;
      DOM.gimmickLabel.textContent = "Час пик";
      pushToast("Час пик: поток клиентов ускорился.");
    } else {
      state.gimmickUntil = now + 6_000;
      state.quarrelSpreadAt = now + 3_000;
      DOM.gimmickLabel.textContent = "Клиенты ругаются";
      pushToast("Ссора: заблокированные клетки можно снять любой выдачей.");
    }
  } else {
    state.gimmickUntil = now + 10_000;
    state.rushUntil = state.gimmickUntil;
    DOM.gimmickLabel.textContent = "Час пик";
    pushToast("Час пик: поток клиентов ускорился.");
  }

  playFx("alert");
}

function finishGimmick(message) {
  if (message) {
    pushToast(message);
  }
  if (state.gimmick === "quarrel") {
    clearQuarrel();
  }
  state.gimmick = null;
  state.gimmickUntil = 0;
  state.glitchStreak = 0;
  state.rushUntil = 0;
  DOM.gimmickLabel.textContent =
    state.calmUntil > performance.now() ? "Короткое затишье" : "Спокойная смена";
}

function createQuarrel(now) {
  const candidates = [];
  for (let row = 0; row < Math.min(5, state.accessRows + 2); row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const left = state.board[row][col];
      const right = state.board[row][col + 1];
      if (left && right && left.type !== right.type) {
        candidates.push([
          { row, col },
          { row, col: col + 1 },
        ]);
      }
    }
  }

  if (candidates.length === 0) {
    return false;
  }

  state.quarrelCells = sample(candidates);
  state.quarrelSpreadAt = now + 3_000;
  return true;
}

function spreadQuarrel(now) {
  if (state.gimmick !== "quarrel" || now < state.quarrelSpreadAt) {
    return;
  }

  const expanded = [...state.quarrelCells];
  for (const cell of state.quarrelCells) {
    for (const delta of [-1, 1]) {
      const nextCol = cell.col + delta;
      if (
        nextCol >= 0 &&
        nextCol < 4 &&
        state.board[cell.row][nextCol] &&
        !expanded.some((item) => item.row === cell.row && item.col === nextCol)
      ) {
        expanded.push({ row: cell.row, col: nextCol });
      }
    }
  }

  state.quarrelCells = expanded;
  state.quarrelSpreadAt = Infinity;
}

function clearQuarrel() {
  state.quarrelCells = [];
}

function updateSpawn(dt, now) {
  const phase = getPhase();
  const activeRush = now < state.rushUntil;
  const interval = activeRush ? phase.spawn / 2 : phase.spawn;

  state.spawnAccumulator += dt * 1_000;
  while (state.spawnAccumulator >= interval && state.running) {
    state.spawnAccumulator -= interval;
    if (!spawnClient()) {
      break;
    }
  }
}

function loop(timestamp) {
  if (!state.running) {
    return;
  }

  if (state.lastFrame === 0) {
    state.lastFrame = timestamp;
  }

  const dt = Math.min(0.05, (timestamp - state.lastFrame) / 1_000);
  state.lastFrame = timestamp;
  state.sessionMs += dt * 1_000;

  updateBonuses(timestamp);
  updateSpawn(dt, timestamp);
  updateTension(dt, timestamp);
  spreadQuarrel(timestamp);
  updateToasts(timestamp);
  updateMusic(timestamp);
  render();

  if (state.running) {
    requestAnimationFrame(loop);
  }
}

function render() {
  const now = performance.now();
  updateActiveSpeech(now);

  DOM.score.textContent = formatNumber(state.score);
  DOM.combo.textContent = `x${Math.max(1, state.combo)}`;
  DOM.time.textContent = formatTime(state.sessionMs);
  DOM.tensionFill.style.width = `${Math.round(state.tension * 100)}%`;
  DOM.queuePill.textContent = `Доступ: ${state.accessRows} ${pluralRows(state.accessRows)}`;
  DOM.sceneDialogueLabel.textContent = state.activeSpeechLabel || "Оператор";
  DOM.sceneDialogueText.textContent = state.activeSpeechText || "";

  const statuses = [];
  if (now < state.flowUntil) {
    statuses.push("Поток +50%");
  }
  if (now < state.fastAccessUntil) {
    statuses.push("Быстрый старт");
  }
  if (state.antiStressReady) {
    statuses.push("Антистресс готов");
  }
  DOM.bonusPill.textContent = statuses.length > 0 ? statuses.join(" • ") : "Без бонусов";

  boardCells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const client = state.board[row]?.[col] || null;

    cell.className = "cell";
    if (row < state.accessRows) {
      cell.classList.add("accessible");
    }
    if (isQuarrelCell(row, col)) {
      cell.classList.add("quarrel");
    }
    if (client && client.id === state.activeSpeakerId) {
      cell.classList.add("speaker-active");
    }

    if (!client) {
      cell.innerHTML = isQuarrelCell(row, col) ? '<span class="spark">⚡</span>' : "";
      return;
    }

    const type = ORDER_TYPES[client.type];
    const shouldGlitch = state.gimmick === "glitch" && row >= state.accessRows;
    const angry = now < client.angryUntil;

    cell.innerHTML = `
      ${isQuarrelCell(row, col) ? '<span class="spark">⚡</span>' : ""}
      <div class="cell-inner ${shouldGlitch ? "glitch" : ""}">
        <div class="customer-shadow"></div>
        <div
          class="customer-figure ${angry ? "angry" : ""}"
          style="--skin:${client.skin}; --hair:${client.hair}; --shirt:${client.shirt}; --accent:${client.accent}; --shoe:${client.shoe};"
        >
          <span class="customer-arm arm-left"></span>
          <span class="customer-arm arm-right"></span>
          <span class="customer-body"></span>
          <span class="customer-head"></span>
          <span class="customer-hair"></span>
          <span class="customer-bag"></span>
          <span class="customer-feet"></span>
        </div>
        <div class="order-badge ${type.className}">
          <span>${type.icon}</span>
          <span>${type.key}</span>
        </div>
      </div>
    `;
  });

  positionSceneDialogue();
  renderToasts();
}

function positionSceneDialogue() {
  if (state.awaitingStart) {
    DOM.sceneDialogue.classList.remove("is-below");
    DOM.sceneDialogue.style.left = "50%";
    DOM.sceneDialogue.style.top = "24px";
    DOM.sceneDialogue.style.transform = "translateX(-50%)";
    return;
  }

  const activeCell = boardCells.find((cell) => cell.classList.contains("speaker-active"));
  if (!activeCell) {
    DOM.sceneDialogue.classList.remove("is-below");
    DOM.sceneDialogue.style.left = "50%";
    DOM.sceneDialogue.style.top = "24px";
    DOM.sceneDialogue.style.transform = "translateX(-50%)";
    return;
  }

  const stageRect = DOM.stageSurface.getBoundingClientRect();
  const cellRect = activeCell.getBoundingClientRect();

  DOM.sceneDialogue.classList.remove("is-below");
  DOM.sceneDialogue.style.transform = "none";
  DOM.sceneDialogue.style.left = "0px";
  DOM.sceneDialogue.style.top = "0px";

  const bubbleRect = DOM.sceneDialogue.getBoundingClientRect();
  const bubbleWidth = bubbleRect.width;
  const bubbleHeight = bubbleRect.height;
  const padding = 14;
  const cellCenterX = cellRect.left - stageRect.left + cellRect.width / 2;
  const clampedLeft = clamp(
    cellCenterX - bubbleWidth / 2,
    padding,
    stageRect.width - bubbleWidth - padding
  );
  const preferredTop = cellRect.top - stageRect.top - bubbleHeight - 12;
  const minTop = 20;
  const fitsAbove = preferredTop >= minTop;
  const finalTop = fitsAbove ? preferredTop : cellRect.bottom - stageRect.top + 12;

  DOM.sceneDialogue.style.left = `${clampedLeft}px`;
  DOM.sceneDialogue.style.top = `${finalTop}px`;
  if (!fitsAbove) {
    DOM.sceneDialogue.classList.add("is-below");
  }
}

function updateActiveSpeech(now) {
  if (state.awaitingStart) {
    state.activeSpeakerId = null;
    state.activeSpeechLabel = "Оператор";
    state.activeSpeechText = "Нажми любую клавишу или тапни по сцене, чтобы открыть смену.";
    return;
  }

  const candidates = getSpeechCandidates();
  if (candidates.length === 0) {
    state.activeSpeakerId = null;
    state.activeSpeechLabel = "Зал";
    state.activeSpeechText = "Следующий клиент уже подходит к стойке.";
    return;
  }

  const activeStillVisible = candidates.find(
    (candidate) => candidate.client.id === state.activeSpeakerId
  );
  if (activeStillVisible && now < state.speechSwitchAt) {
    return;
  }

  const currentIndex = candidates.findIndex(
    (candidate) => candidate.client.id === state.activeSpeakerId
  );
  const nextCandidate =
    currentIndex >= 0 && candidates.length > 1
      ? candidates[(currentIndex + 1) % candidates.length]
      : candidates[0];

  const angry = now < nextCandidate.client.angryUntil;
  const quarrel = isQuarrelCell(nextCandidate.row, nextCandidate.col);
  state.activeSpeakerId = nextCandidate.client.id;
  state.activeSpeechLabel = getSpeechLabel(nextCandidate.row, nextCandidate.col, angry, quarrel);
  state.activeSpeechText = getSpeechText(nextCandidate.client, angry, quarrel);
  state.speechSwitchAt = now + 2_000;
}

function getSpeechCandidates() {
  const candidates = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const client = state.board[row][col];
      if (!client) {
        continue;
      }
      const angry = performance.now() < client.angryUntil;
      const quarrel = isQuarrelCell(row, col);
      const priority =
        (quarrel ? 100 : 0) + (angry ? 80 : 0) + (row < state.accessRows ? 40 : 0) + (4 - row);
      candidates.push({ client, row, col, priority });
    }
  }

  candidates.sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }
    if (left.row !== right.row) {
      return left.row - right.row;
    }
    return left.col - right.col;
  });

  return candidates;
}

function getSpeechLabel(row, col, angry, quarrel) {
  if (quarrel) {
    return `Спор в линии ${col + 1}`;
  }
  if (angry) {
    return row < state.accessRows ? "Клиент у стойки" : `Недовольный клиент ${col + 1}`;
  }
  if (row < state.accessRows) {
    return "Клиент у стойки";
  }
  return `Очередь ${col + 1}`;
}

function getSpeechText(client, angry, quarrel) {
  if (angry) {
    return sample(CUSTOMER_QUOTES.angry);
  }
  if (quarrel) {
    return sample(CUSTOMER_QUOTES.quarrel);
  }
  return client.quote;
}

function pushToast(text) {
  state.notifications.push({
    id: `${Date.now()}-${Math.random()}`,
    text,
    expiresAt: performance.now() + 2_400,
  });
}

function updateToasts(now) {
  state.notifications = state.notifications.filter((toast) => toast.expiresAt > now);
}

function renderToasts() {
  DOM.toastStack.innerHTML = state.notifications
    .map((toast) => `<div class="toast">${escapeHtml(toast.text)}</div>`)
    .join("");
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function pluralRows(value) {
  if (value % 10 === 1 && value % 100 !== 11) {
    return "ряд";
  }
  if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) {
    return "ряда";
  }
  return "рядов";
}

function pressButton(order) {
  const button = DOM.controlButtons.find((item) => item.dataset.order === order);
  if (!button) {
    return;
  }
  button.classList.add("is-pressed");
  window.setTimeout(() => button.classList.remove("is-pressed"), 120);
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function vibrate(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function unlockAudio() {
  if (audioState.unlocked) {
    return;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }
  audioState.ctx = new AudioContext();
  audioState.unlocked = true;
}

function playFx(kind) {
  if (!audioState.enabled || !audioState.ctx) {
    return;
  }

  const ctx = audioState.ctx;
  const now = ctx.currentTime;
  const config = {
    success: [880, 0.08, "triangle", 0.04],
    miss: [180, 0.12, "sawtooth", 0.04],
    bonus: [660, 0.14, "triangle", 0.05],
    alert: [260, 0.18, "square", 0.05],
    spawn: [520, 0.05, "sine", 0.02],
    fail: [110, 0.25, "sawtooth", 0.05],
  }[kind] || [440, 0.1, "sine", 0.03];

  const [frequency, duration, type, gainValue] = config;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function updateMusic(now) {
  if (!audioState.enabled || !audioState.ctx || !state.running) {
    return;
  }
  if (now < audioState.musicTimer) {
    return;
  }

  const notes = [220, 246.94, 293.66, 246.94, 329.63, 293.66, 246.94, 220];
  const ctx = audioState.ctx;
  const frequency = notes[audioState.musicStep % notes.length];
  const start = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.015, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.24);
  audioState.musicStep += 1;
  audioState.musicTimer = now + 320;
}

function toggleMusic() {
  unlockAudio();
  audioState.enabled = !audioState.enabled;
  DOM.musicToggle.textContent = `Музыка: ${audioState.enabled ? "Вкл" : "Выкл"}`;
}

function handleSceneTap(event) {
  if (event.target.closest(".sound-toggle")) {
    return;
  }
  if (event.target.closest(".control-button")) {
    return;
  }
  if (state.awaitingStart && DOM.overlay.classList.contains("hidden")) {
    startGame();
  }
}

function onKeyDown(event) {
  if (state.awaitingStart && DOM.overlay.classList.contains("hidden")) {
    event.preventDefault();
    startGame();
    return;
  }

  if (!state.running) {
    return;
  }

  const order = Object.keys(ORDER_TYPES).find((key) => ORDER_TYPES[key].code === event.code);
  if (!order) {
    return;
  }

  event.preventDefault();
  serviceInput(order);
}

initBoardMarkup();
setStandby();

DOM.restartButton.addEventListener("click", startGame);
DOM.menuButton.addEventListener("click", setStandby);
DOM.musicToggle.addEventListener("click", toggleMusic);
DOM.stageSurface.addEventListener("pointerdown", handleSceneTap);
DOM.introOverlay.addEventListener("pointerdown", handleSceneTap);
DOM.controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (state.awaitingStart) {
      startGame();
      return;
    }
    serviceInput(button.dataset.order);
  });
});
window.addEventListener("keydown", onKeyDown);
