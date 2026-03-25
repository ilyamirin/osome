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

const DOM = {
  startScreen: document.querySelector("#start-screen"),
  gameScreen: document.querySelector("#game-screen"),
  startButton: document.querySelector("#start-button"),
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
  board: Array.from({ length: 5 }, () => Array(4).fill(null)),
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

function resetState() {
  state.running = true;
  state.board = Array.from({ length: 5 }, () => Array(4).fill(null));
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
  state.lastFrame = 0;
}

function startGame() {
  unlockAudio();
  resetState();
  DOM.startScreen.classList.add("hidden");
  DOM.gameScreen.classList.remove("hidden");
  DOM.overlay.classList.add("hidden");
  spawnClient();
  render();
  requestAnimationFrame(loop);
}

function backToMenu() {
  state.running = false;
  DOM.overlay.classList.add("hidden");
  DOM.gameScreen.classList.add("hidden");
  DOM.startScreen.classList.remove("hidden");
}

function endGame() {
  state.running = false;
  DOM.resultScore.textContent = formatNumber(state.score);
  DOM.resultServed.textContent = formatNumber(state.served);
  DOM.resultMaxCombo.textContent = `x${state.maxCombo}`;
  DOM.resultTime.textContent = formatTime(state.sessionMs);
  DOM.overlay.classList.remove("hidden");
  DOM.gimmickLabel.textContent = "Смена завершена";
  pushToast("Смена окончена. Очередь заблокировала ПВЗ.");
  playFx("fail");
}

function createClient(type) {
  return {
    id: state.lastId++,
    type,
    enteredAccessAt: null,
    angryUntil: 0,
  };
}

function getRandomOrder() {
  const keys = Object.keys(ORDER_TYPES);
  return keys[Math.floor(Math.random() * keys.length)];
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

  const targetCol = freeColumns[Math.floor(Math.random() * freeColumns.length)];
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
  const accessible = getAccessibleClients();
  if (accessible.length > 0) {
    accessible[0].client.angryUntil = performance.now() + 500;
  }

  state.totalErrors += 1;
  state.consecutiveErrors += 1;
  state.combo = 0;
  state.firstFivePerfect = false;
  state.perfectRow = null;
  state.speedups.push(performance.now() + 5_000);
  if (state.consecutiveErrors >= 3) {
    state.antiStressReady = true;
  }

  DOM.combo.textContent = "x1";
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
  const gimmick = pool[Math.floor(Math.random() * pool.length)];

  state.tension = 0;
  state.calmUntil = now + 5_000;
  state.gimmick = gimmick;
  state.glitchStreak = 0;
  state.quarrelCells = [];

  if (gimmick === "glitch") {
    state.gimmickUntil = now + 8_000;
    DOM.gimmickLabel.textContent = "Глюк сканера";
    pushToast("Глюк сканера: верхние ряды размыты.");
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
      pushToast("Ссора: спорящие клиенты временно блокируют выдачу.");
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
    state.calmUntil > performance.now() ? "Затишье" : "Спокойная смена";
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

  state.quarrelCells = candidates[Math.floor(Math.random() * candidates.length)];
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
  DOM.score.textContent = formatNumber(state.score);
  DOM.combo.textContent = `x${Math.max(1, state.combo)}`;
  DOM.time.textContent = formatTime(state.sessionMs);
  DOM.tensionFill.style.width = `${Math.round(state.tension * 100)}%`;
  DOM.queuePill.textContent = `Зона доступа: ${state.accessRows} ${pluralRows(state.accessRows)}`;

  const statuses = [];
  if (performance.now() < state.flowUntil) {
    statuses.push("Поток +50%");
  }
  if (performance.now() < state.fastAccessUntil) {
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

    if (!client) {
      cell.innerHTML = isQuarrelCell(row, col) ? '<span class="spark">⚡</span>' : "";
      return;
    }

    const type = ORDER_TYPES[client.type];
    const shouldGlitch = state.gimmick === "glitch" && row >= state.accessRows;
    const angry = performance.now() < client.angryUntil;

    cell.innerHTML = `
      ${isQuarrelCell(row, col) ? '<span class="spark">⚡</span>' : ""}
      <div class="cell-inner ${shouldGlitch ? "glitch" : ""}">
        <div class="customer-icon ${angry ? "angry" : ""}">👤</div>
        <div class="order-badge ${type.className}">
          <span>${type.icon}</span>
          <span>${type.key}</span>
        </div>
      </div>
    `;
  });

  renderToasts();
}

function pushToast(text) {
  state.notifications.push({
    id: `${Date.now()}-${Math.random()}`,
    text,
    expiresAt: performance.now() + 2_200,
  });
}

function updateToasts(now) {
  state.notifications = state.notifications.filter((toast) => toast.expiresAt > now);
}

function renderToasts() {
  DOM.toastStack.innerHTML = state.notifications
    .map((toast) => `<div class="toast">${toast.text}</div>`)
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

function onKeyDown(event) {
  const order = Object.keys(ORDER_TYPES).find((key) => ORDER_TYPES[key].code === event.code);
  if (!order) {
    return;
  }
  event.preventDefault();
  serviceInput(order);
}

initBoardMarkup();
render();

DOM.startButton.addEventListener("click", startGame);
DOM.restartButton.addEventListener("click", startGame);
DOM.menuButton.addEventListener("click", backToMenu);
DOM.musicToggle.addEventListener("click", toggleMusic);
DOM.controlButtons.forEach((button) => {
  button.addEventListener("click", () => serviceInput(button.dataset.order));
});
window.addEventListener("keydown", onKeyDown);
