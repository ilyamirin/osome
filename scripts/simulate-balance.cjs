const balance = require("../balance-config.js");

const ORDER_TYPES = ["food", "tech", "wear", "home"];

const PROFILES = {
  casual: {
    baseReactionMs: 650,
    scanPerClientMs: 26,
    rowPenaltyMs: 65,
    uniquePenaltyMs: 130,
    duplicateBonusMs: 26,
    glitchPenaltyMs: 180,
    rushPenaltyMs: 90,
    baseMissChance: 0.02,
    loadMissChance: 0.0032,
    glitchMissChance: 0.06,
    rushMissChance: 0.035,
    quarrelFocusBonusMs: 80,
  },
  solid: {
    baseReactionMs: 520,
    scanPerClientMs: 21,
    rowPenaltyMs: 50,
    uniquePenaltyMs: 92,
    duplicateBonusMs: 22,
    glitchPenaltyMs: 130,
    rushPenaltyMs: 68,
    baseMissChance: 0.012,
    loadMissChance: 0.0024,
    glitchMissChance: 0.045,
    rushMissChance: 0.025,
    quarrelFocusBonusMs: 55,
  },
  expert: {
    baseReactionMs: 430,
    scanPerClientMs: 16,
    rowPenaltyMs: 36,
    uniquePenaltyMs: 70,
    duplicateBonusMs: 18,
    glitchPenaltyMs: 96,
    rushPenaltyMs: 46,
    baseMissChance: 0.008,
    loadMissChance: 0.0018,
    glitchMissChance: 0.03,
    rushMissChance: 0.018,
    quarrelFocusBonusMs: 34,
  },
};

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "report";
const runs = Number(args.runs || 180);
const seed = Number(args.seed || 1337);
const smoothStepMs = Number(args.smoothStepMs || 0);
const activeBalance =
  smoothStepMs > 0 ? applySmoothing(balance, { stepMs: smoothStepMs }) : balance;

if (mode === "search") {
  searchBalance({ runs, seed, baseBalance: activeBalance });
} else {
  const variant = applyVariant(activeBalance, variantFromArgs(args));
  printVariantReport("current", variant, { runs, seed });
}

function searchBalance({ runs, seed, baseBalance }) {
  const spawnScales = [1, 0.96, 0.92, 0.88];
  const lateSpawnScales = [1, 0.94, 0.88, 0.82];
  const tensionScales = [1, 1.06, 1.12, 1.18];
  const lateTensionScales = [1, 1.08, 1.16];
  const orderShifts = [0, -0.15, -0.3, -0.45];

  const candidates = [];

  for (const spawnScale of spawnScales) {
    for (const lateSpawnScale of lateSpawnScales) {
      for (const tensionScale of tensionScales) {
        for (const lateTensionScale of lateTensionScales) {
          for (const orderShift of orderShifts) {
            const variant = applyVariant(baseBalance, {
              spawnScale,
              lateSpawnScale,
              tensionScale,
              lateTensionScale,
              orderShift,
            });
            const report = runProfiles(variant, { runs: Math.max(90, Math.floor(runs / 2)), seed });
            candidates.push({
              options: {
                spawnScale,
                lateSpawnScale,
                tensionScale,
                lateTensionScale,
                orderShift,
              },
              report,
              score: scoreReport(report),
            });
          }
        }
      }
    }
  }

  candidates.sort((left, right) => left.score - right.score);
  const top = candidates.slice(0, 8);

  for (const candidate of top) {
    const solid = candidate.report.solid;
    const expert = candidate.report.expert;
    console.log(
      JSON.stringify({
        score: round(candidate.score),
        options: candidate.options,
        solid_avg_ms: solid.avg,
        solid_p90_ms: solid.p90,
        expert_avg_ms: expert.avg,
        expert_p90_ms: expert.p90,
      })
    );
  }
}

function scoreReport(report) {
  const casual = report.casual;
  const solid = report.solid;
  const expert = report.expert;

  let score = 0;
  score += Math.abs(casual.avg - 180_000) / 900;
  score += Math.abs(solid.avg - 225_000) / 700;
  score += Math.abs(expert.avg - 285_000) / 600;
  score += Math.abs(expert.p90 - 320_000) / 500;

  if (solid.p90 > 310_000) {
    score += (solid.p90 - 310_000) / 250;
  }
  if (expert.p90 > 360_000) {
    score += (expert.p90 - 360_000) / 180;
  }
  if (casual.avg < 135_000) {
    score += (135_000 - casual.avg) / 350;
  }

  return score;
}

function printVariantReport(label, variant, { runs, seed }) {
  const report = runProfiles(variant, { runs, seed });
  console.log(`Variant: ${label}`);
  console.log(
    JSON.stringify(
      {
        phases: variant.phases.map((phase) => ({
          until: phase.until,
          spawn: phase.spawn,
          tensionMultiplier: round(phase.tensionMultiplier),
          orderFrequencyExponent: round(phase.orderFrequencyExponent),
        })),
      },
      null,
      2
    )
  );
  console.log(`phase_count=${variant.phases.length}`);
  for (const [profileName, metrics] of Object.entries(report)) {
    console.log(
      `${profileName}: avg=${formatMs(metrics.avg)} p50=${formatMs(metrics.p50)} p90=${formatMs(metrics.p90)} max=${formatMs(metrics.max)}`
    );
  }
}

function runProfiles(activeBalance, { runs, seed }) {
  const results = {};
  let offset = 0;
  for (const [name, profile] of Object.entries(PROFILES)) {
    const times = [];
    for (let run = 0; run < runs; run += 1) {
      const rng = mulberry32(seed + offset + run * 7919);
      times.push(runSimulation(activeBalance, profile, rng));
    }
    results[name] = summarize(times);
    offset += 100_000;
  }
  return results;
}

function runSimulation(activeBalance, profile, rng) {
  const state = createState(activeBalance);
  spawnClient(state, rng);
  syncCurrentOrder(state, true, rng);

  const bot = {
    actionAt: 0,
    planned: null,
  };

  const dtMs = 50;
  while (state.running && state.timeMs < 600_000) {
    updateBonuses(state);
    updateSpawn(state, dtMs, rng);
    updateTension(state, dtMs, rng);
    spreadQuarrel(state);
    finishExpiredGimmick(state);
    progressBot(state, bot, profile, rng);
    state.timeMs += dtMs;
  }

  return state.timeMs;
}

function createState(activeBalance) {
  return {
    balance: activeBalance,
    running: true,
    board: Array.from({ length: 5 }, () => Array(4).fill(null)),
    timeMs: 0,
    spawnAccumulatorMs: 0,
    tension: 0,
    calmUntil: 0,
    slowdowns: [],
    speedups: [],
    gimmick: null,
    gimmickUntil: 0,
    rushUntil: 0,
    glitchStreak: 0,
    quarrelSpreadAt: 0,
    quarrelCells: [],
    currentOrder: null,
    accessRows: 1,
    served: 0,
    combo: 0,
    totalErrors: 0,
    firstFivePerfect: true,
    fastAccessUntil: 0,
    nextClientId: 1,
  };
}

function getPhase(state) {
  return (
    state.balance.phases.find((phase) => state.timeMs < phase.until) ||
    state.balance.phases[state.balance.phases.length - 1]
  );
}

function createClient(type, state) {
  return {
    id: state.nextClientId++,
    type,
    angryUntil: 0,
  };
}

function spawnClient(state, rng) {
  const freeColumns = [];
  for (let col = 0; col < 4; col += 1) {
    if (!state.board[4][col]) {
      freeColumns.push(col);
    }
  }

  if (freeColumns.length === 0) {
    state.running = false;
    return false;
  }

  const col = freeColumns[Math.floor(rng() * freeColumns.length)];
  state.board[4][col] = createClient(sample(ORDER_TYPES, rng), state);
  collapseColumn(state, col);
  syncCurrentOrder(state, false, rng);
  return true;
}

function collapseColumn(state, col) {
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

function updateBonuses(state) {
  state.accessRows = state.timeMs < state.fastAccessUntil ? 2 : 1;
}

function getTypeStats(state) {
  const stats = new Map();
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const client = state.board[row][col];
      if (!client) {
        continue;
      }
      const existing = stats.get(client.type);
      if (existing) {
        existing.count += 1;
        existing.nearestRow = Math.min(existing.nearestRow, row);
      } else {
        stats.set(client.type, { type: client.type, count: 1, nearestRow: row });
      }
    }
  }
  return [...stats.values()];
}

function chooseCurrentOrder(state, previousOrder, rng) {
  const stats = getTypeStats(state);
  if (stats.length === 0) {
    return null;
  }
  const phase = getPhase(state);
  const weighted = stats.map((stat) => {
    const countWeight = Math.pow(stat.count, phase.orderFrequencyExponent);
    const frontRatio = (4 - stat.nearestRow) / 4;
    const frontWeight = 1 + phase.frontWeightBias * frontRatio;
    const repeatWeight =
      stat.type === previousOrder ? state.balance.orderSelection.sameTypePenalty : 1;
    return { type: stat.type, weight: Math.max(0.01, countWeight * frontWeight * repeatWeight) };
  });
  return pickWeighted(weighted, rng);
}

function syncCurrentOrder(state, forceChange, rng) {
  const hasCurrent = getTypeStats(state).some((stat) => stat.type === state.currentOrder);
  if (forceChange || !state.currentOrder || !hasCurrent) {
    state.currentOrder = chooseCurrentOrder(state, state.currentOrder, rng);
  }
}

function updateSpawn(state, dtMs, rng) {
  const phase = getPhase(state);
  const activeRush = state.timeMs < state.rushUntil;
  const interval = activeRush
    ? phase.spawn / state.balance.gimmicks.rush.spawnDivider
    : phase.spawn;

  state.spawnAccumulatorMs += dtMs;
  while (state.spawnAccumulatorMs >= interval && state.running) {
    state.spawnAccumulatorMs -= interval;
    if (!spawnClient(state, rng)) {
      break;
    }
  }
}

function updateTension(state, dtMs, rng) {
  const phase = getPhase(state);
  if (state.timeMs < state.calmUntil) {
    return;
  }

  state.slowdowns = state.slowdowns.filter((endsAt) => endsAt > state.timeMs);
  state.speedups = state.speedups.filter((endsAt) => endsAt > state.timeMs);

  const rate = Math.max(
    state.balance.tension.minFillRate,
    (state.balance.tension.baseFillRate -
      state.slowdowns.length * state.balance.tension.successSlowdown +
      state.speedups.length * state.balance.tension.missSpeedup) *
      phase.tensionMultiplier
  );

  if (phase.gimmicks.length === 0) {
    state.tension = Math.min(0.88, state.tension + rate * (dtMs / 1000));
    return;
  }

  state.tension = Math.min(1, state.tension + rate * (dtMs / 1000));
  if (state.tension >= 1) {
    triggerGimmick(state, rng);
  }
}

function triggerGimmick(state, rng) {
  const phase = getPhase(state);
  let gimmick = sample(phase.gimmicks.length > 0 ? phase.gimmicks : ["rush"], rng);

  state.tension = 0;
  state.calmUntil = state.timeMs + state.balance.tension.calmDurationMs;
  state.gimmick = gimmick;
  state.glitchStreak = 0;
  state.quarrelCells = [];

  if (gimmick === "glitch") {
    state.gimmickUntil = state.timeMs + state.balance.gimmicks.glitch.durationMs;
    return;
  }

  if (gimmick === "quarrel") {
    if (!createQuarrel(state)) {
      state.gimmick = "rush";
      state.gimmickUntil = state.timeMs + state.balance.gimmicks.rush.durationMs;
      state.rushUntil = state.gimmickUntil;
      return;
    }
    state.gimmickUntil = state.timeMs + state.balance.gimmicks.quarrel.durationMs;
    state.quarrelSpreadAt = state.timeMs + state.balance.gimmicks.quarrel.spreadDelayMs;
    return;
  }

  state.gimmickUntil = state.timeMs + state.balance.gimmicks.rush.durationMs;
  state.rushUntil = state.gimmickUntil;
}

function finishExpiredGimmick(state) {
  if (state.gimmick && state.timeMs >= state.gimmickUntil) {
    if (state.gimmick === "quarrel") {
      state.quarrelCells = [];
    }
    state.gimmick = null;
    state.gimmickUntil = 0;
    state.rushUntil = 0;
    state.glitchStreak = 0;
  }
}

function createQuarrel(state) {
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
  state.quarrelCells = candidates[0];
  return true;
}

function spreadQuarrel(state) {
  if (state.gimmick !== "quarrel" || state.timeMs < state.quarrelSpreadAt) {
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

function progressBot(state, bot, profile, rng) {
  if (!state.running) {
    return;
  }

  if (bot.planned && state.timeMs >= bot.actionAt) {
    executeAction(state, bot.planned, rng);
    bot.planned = null;
    bot.actionAt = 0;
    return;
  }

  if (bot.planned) {
    return;
  }

  const plan = planAction(state, profile, rng);
  if (!plan) {
    return;
  }

  bot.planned = plan;
  bot.actionAt = state.timeMs + plan.delayMs;
}

function planAction(state, profile, rng) {
  const occupied = getOccupiedCells(state);
  if (occupied.length === 0) {
    return null;
  }

  const quarrelTargets = occupied.filter(({ row, col }) => isQuarrelCell(state, row, col));
  const matches = occupied.filter(({ client }) => client.type === state.currentOrder);
  const targetPool = quarrelTargets.length > 0 ? quarrelTargets : matches;
  if (targetPool.length === 0) {
    return {
      kind: "wait",
      delayMs: 120,
    };
  }

  const target = targetPool.sort(compareCells)[0];
  const missChance = calculateMissChance(state, profile, target, occupied.length);
  const shouldMiss = rng() < missChance;
  const finalTarget =
    shouldMiss && occupied.length > 1
      ? sample(
          occupied.filter((cell) => cell.client.id !== target.client.id),
          rng
        )
      : target;

  const delayMs = calculateDelay(state, profile, target, targetPool.length, occupied.length, rng);
  return {
    kind: "tap",
    row: finalTarget.row,
    col: finalTarget.col,
    delayMs,
  };
}

function executeAction(state, action, rng) {
  if (action.kind !== "tap") {
    return;
  }

  const client = state.board[action.row]?.[action.col];
  if (!client) {
    return;
  }

  if (isQuarrelCell(state, action.row, action.col)) {
    serveClient(state, action.row, action.col, true, rng);
    return;
  }

  if (client.type === state.currentOrder) {
    serveClient(state, action.row, action.col, false, rng);
    return;
  }

  registerMiss(state);
}

function serveClient(state, row, col, fromQuarrel, rng) {
  const client = state.board[row][col];
  if (!client) {
    return;
  }

  state.combo += 1;
  state.served += 1;
  state.slowdowns.push(state.timeMs + state.balance.tension.successSlowdownDurationMs);

  if (fromQuarrel) {
    state.quarrelCells = [];
  }

  state.board[row][col] = null;
  collapseColumn(state, col);
  syncCurrentOrder(state, true, rng);

  if (state.gimmick === "glitch") {
    state.glitchStreak += 1;
    if (state.glitchStreak >= state.balance.gimmicks.glitch.clearStreakNeeded) {
      state.gimmick = null;
      state.gimmickUntil = 0;
    }
  }
}

function registerMiss(state) {
  state.totalErrors += 1;
  state.combo = 0;
  state.firstFivePerfect = false;
  state.speedups.push(state.timeMs + state.balance.tension.missSpeedupDurationMs);
}

function calculateDelay(state, profile, target, matchCount, occupiedCount, rng) {
  let delay =
    profile.baseReactionMs +
    occupiedCount * profile.scanPerClientMs +
    target.row * profile.rowPenaltyMs +
    (matchCount === 1 ? profile.uniquePenaltyMs : 0) -
    Math.min(matchCount - 1, 3) * profile.duplicateBonusMs;

  if (state.gimmick === "glitch" && target.row >= state.accessRows) {
    delay += profile.glitchPenaltyMs;
  }
  if (state.gimmick === "rush") {
    delay += profile.rushPenaltyMs;
  }
  if (isQuarrelCell(state, target.row, target.col)) {
    delay -= profile.quarrelFocusBonusMs;
  }

  return Math.max(140, Math.round(delay + rng() * 70));
}

function calculateMissChance(state, profile, target, occupiedCount) {
  let chance = profile.baseMissChance + occupiedCount * profile.loadMissChance;
  if (state.gimmick === "glitch" && target.row >= state.accessRows) {
    chance += profile.glitchMissChance;
  }
  if (state.gimmick === "rush") {
    chance += profile.rushMissChance;
  }
  if (state.timeMs >= 180_000) {
    chance += 0.01;
  }
  if (state.timeMs >= 300_000) {
    chance += 0.02;
  }
  return Math.min(0.35, chance);
}

function getOccupiedCells(state) {
  const cells = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const client = state.board[row][col];
      if (client) {
        cells.push({ client, row, col });
      }
    }
  }
  return cells;
}

function isQuarrelCell(state, row, col) {
  return state.quarrelCells.some((cell) => cell.row === row && cell.col === col);
}

function compareCells(left, right) {
  if (left.row !== right.row) {
    return left.row - right.row;
  }
  return left.col - right.col;
}

function summarize(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return {
    avg: Math.round(sorted.reduce((sum, value) => sum + value, 0) / sorted.length),
    p50: percentile(sorted, 0.5),
    p90: percentile(sorted, 0.9),
    max: sorted[sorted.length - 1],
  };
}

function percentile(sorted, ratio) {
  const index = Math.min(sorted.length - 1, Math.floor(sorted.length * ratio));
  return sorted[index];
}

function applyVariant(baseBalance, options) {
  const clone = JSON.parse(JSON.stringify(baseBalance));
  clone.phases = clone.phases.map((phase) => {
    const isLate = phase.until > 180_000;
    return {
      ...phase,
      spawn: Math.round(
        phase.spawn * (options.spawnScale ?? 1) * (isLate ? (options.lateSpawnScale ?? 1) : 1)
      ),
      tensionMultiplier:
        phase.tensionMultiplier *
        (options.tensionScale ?? 1) *
        (isLate ? (options.lateTensionScale ?? 1) : 1),
      orderFrequencyExponent:
        phase.orderFrequencyExponent +
        (options.orderShift ?? 0) +
        (isLate ? (options.lateOrderShift ?? 0) : 0),
    };
  });
  return clone;
}

function applySmoothing(baseBalance, { stepMs }) {
  const clone = JSON.parse(JSON.stringify(baseBalance));
  clone.phases = densifyPhases(clone.phases, stepMs);
  return clone;
}

function densifyPhases(phases, stepMs) {
  const finitePhases = phases.filter((phase) => Number.isFinite(phase.until));
  const result = [];

  for (let index = 0; index < finitePhases.length; index += 1) {
    const current = finitePhases[index];
    const previousUntil = index === 0 ? 0 : finitePhases[index - 1].until;
    const next = finitePhases[index + 1];

    if (!next) {
      result.push({ ...current });
      continue;
    }

    const duration = current.until - previousUntil;
    const slices = Math.max(1, Math.round(duration / stepMs));
    for (let slice = 0; slice < slices; slice += 1) {
      const localStart = previousUntil + slice * stepMs;
      const localEnd = Math.min(current.until, localStart + stepMs);
      const t = slice / slices;

      result.push({
        until: localEnd,
        spawn: Math.round(lerp(current.spawn, next.spawn, t)),
        tensionMultiplier: round(lerp(current.tensionMultiplier, next.tensionMultiplier, t)),
        gimmicks: [...current.gimmicks],
        orderFrequencyExponent: round(
          lerp(current.orderFrequencyExponent, next.orderFrequencyExponent, t)
        ),
        frontWeightBias: round(lerp(current.frontWeightBias, next.frontWeightBias, t)),
      });
    }
  }

  const last = phases[phases.length - 1];
  result.push({ ...last });
  return result;
}

function variantFromArgs(args) {
  return {
    spawnScale: Number(args.spawnScale || 1),
    lateSpawnScale: Number(args.lateSpawnScale || 1),
    tensionScale: Number(args.tensionScale || 1),
    lateTensionScale: Number(args.lateTensionScale || 1),
    orderShift: Number(args.orderShift || 0),
    lateOrderShift: Number(args.lateOrderShift || 0),
  };
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === "search") {
      parsed.mode = "search";
      continue;
    }
    if (item.startsWith("--")) {
      const key = item.slice(2);
      parsed[key] = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function sample(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function pickWeighted(items, rng) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let target = rng() * total;
  for (const item of items) {
    target -= item.weight;
    if (target <= 0) {
      return item.type;
    }
  }
  return items[items.length - 1].type;
}

function mulberry32(seed) {
  let current = seed >>> 0;
  return function next() {
    current += 0x6d2b79f5;
    let t = current;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatMs(ms) {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}
