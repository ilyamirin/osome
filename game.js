const BALANCE = globalThis.OSOME_BALANCE;

const ORDER_TYPES = {
  red: {
    label: "Красная коробка",
    className: "red",
    color: "#df554f",
    shirtTones: ["#c84842", "#db5a53", "#e46c66"],
  },
  orange: {
    label: "Оранжевая коробка",
    className: "orange",
    color: "#e88f36",
    shirtTones: ["#d17e2b", "#e59139", "#f0a655"],
  },
  yellow: {
    label: "Жёлтая коробка",
    className: "yellow",
    color: "#e3c643",
    shirtTones: ["#ccb238", "#dec24b", "#edd56c"],
  },
  green: {
    label: "Зелёная коробка",
    className: "green",
    color: "#54b864",
    shirtTones: ["#469f55", "#56b866", "#71c77f"],
  },
  cyan: {
    label: "Бирюзовая коробка",
    className: "cyan",
    color: "#39b9c5",
    shirtTones: ["#2fa2ad", "#3bb9c5", "#59c8d2"],
  },
  blue: {
    label: "Синяя коробка",
    className: "blue",
    color: "#4d7be0",
    shirtTones: ["#4069c5", "#507ce0", "#6a92ea"],
  },
  violet: {
    label: "Фиолетовая коробка",
    className: "violet",
    color: "#9357d6",
    shirtTones: ["#8148c4", "#9357d6", "#a973e3"],
  },
};

const ORDER_TYPE_KEYS = Object.keys(ORDER_TYPES);

const PHASES = BALANCE.phases;

const CUSTOMER_QUOTES = {
  generic: [
    "Мне бы мою коробку и дальше побегу.",
    "Главное, чтобы не чужую выдали.",
    "Я быстро заберу и исчезну.",
    "Мне нужен именно мой заказ, без сюрпризов.",
    "Там коробка на моё имя, да?",
    "Пожалуйста, без путаницы с пакетами.",
    "Если это моя коробка, я спасён.",
    "Я просто получить и дальше по делам.",
    "Беру заказ и обратно в жизнь.",
    "Мой заказ же недолго искать, правда?",
    "Мне бы уже закончить с этой коробкой.",
    "Я только забрать и выйти.",
  ],
  queue: [
    "Я стою культурно, но внутренне уже пишу жалобу.",
    "У меня сейчас лицо человека, которого попросили подождать ещё минутку.",
    "Очередь движется так, будто у неё бесплатный тариф.",
    "Я уже успел прожить здесь маленькую жизнь.",
    "Мне только забрать заказ и потерять веру в людей.",
    "Кто последний в светлое будущее?",
    "Я не нервничаю, это просто очередь об меня трётся.",
    "У меня ощущение, что заказ взрослеет быстрее, чем выносится.",
    "Я в целом спокойный, пока очередь не начинает философствовать.",
    "Можно мне обслуживание без сюжетных поворотов?",
    "Я пришёл за коробкой, а получил социальный опыт.",
    "Если ждать ещё чуть-чуть, начну тут прописываться.",
    "Я пока стою, но морально уже на кассе.",
    "Всё нормально, просто моя терпелка ушла на склад.",
    "Мне кажется, мой заказ уже видел больше жизни, чем я.",
    "Я сюда за вещью пришёл, а не за новым характером.",
    "Очередь как сериал: конца не видно, но бросить жалко.",
    "Я уже мысленно дважды забрал этот заказ.",
    "Это ПВЗ или комната принятия судьбы?",
    "Я не возмущаюсь, я просто звучу громче обычного.",
    "Я только получить, мне без примерок и разговоров.",
    "Подскажите, долго ещё примерно?",
    "Я по коду, у меня всё готово.",
    "Можно побыстрее, я на минуту зашёл.",
    "У меня маленький заказ, его же быстро найти.",
    "Я просто забрать и дальше побегу.",
    "А можно без очереди, я уже один раз стоял.",
    "У меня уведомление пришло давно, почему так долго?",
    "Я здесь был вчера, сегодня можно быстрее?",
    "Если что, я оплачивал заранее.",
    "У меня сейчас такси ждёт, можно оперативно?",
    "Я вот только спросить: мой заказ вообще здесь?",
    "Это точно мой пакет, да?",
    "Я просто не понимаю, почему столько времени уходит.",
    "У меня номер есть, скажите, когда подойти.",
    "Я ненадолго, мне только получить и выйти.",
    "Можно я рядом постою, чтобы не пропустить?",
    "У меня всё в приложении, что ещё нужно?",
    "Я уже почти уехал, когда пришло сообщение.",
    "Если сейчас не получится, мне опять потом ехать.",
  ],
  angry: [
    "Это точно не мой заказ.",
    "Я уже слишком долго жду.",
    "Пожалуйста, без путаницы.",
    "Мы можем ускориться?",
    "Я здесь не первый раз стою.",
    "Мне нужен мой заказ, не чей-то ещё.",
    "Очередь идёт слишком медленно.",
    "Я вообще-то уже подходил.",
    "Давайте без ошибок, пожалуйста.",
    "Мне бы уже закончить с этим.",
    "Я правда очень давно жду.",
    "Если снова не то, будет плохо.",
    "Я тут на секундочку, можно без общей очереди?",
    "Мне только спросить, это же не считается.",
    "Я быстро, пропустите, мне нужнее.",
    "Почему все стоят, а никто меня не обслуживает?",
    "Я вообще-то с утра жду вашего решения.",
    "Мне просто забрать, неужели это так сложно.",
    "Я клиент, а не участник квеста.",
    "У меня номер есть, а результата нет.",
    "Можно без этих формальностей, просто отдайте заказ.",
    "Мне кажется, вы сейчас должны заниматься именно мной.",
    "Я сюда не стоять пришёл.",
    "У меня всё оплачено, давайте без задержек.",
    "Почему у всех очередь, а страдаю именно я?",
    "Мне бы человеческое отношение, я же не пустое место.",
    "Я вообще-то тороплюсь сильнее остальных.",
    "Если честно, это уже уровень приходите завтра.",
    "Мне не нужен процесс, мне нужен мой заказ.",
    "Я не понял, почему это так долго именно у меня.",
    "Давайте без лишних движений, просто вынесите коробку.",
    "Мне кажется, моя очередь должна идти отдельно.",
    "Остальные пусть ждут, я по делу.",
    "Я здесь клиент, значит, должен проходить быстрее.",
    "У меня один вопрос и одно недовольство.",
    "Можно сделать вид, что очереди нет?",
    "Я уже морально получил этот заказ, осталось физически.",
    "Мне не нравится, что всё идёт не под меня.",
    "Сервис должен быть удобным лично мне.",
    "Я сейчас ещё ничего не получил, а уже устал.",
    "Почему система есть, а мне от неё легче не стало?",
    "Я не конфликтный, но ради своего заказа готов.",
    "Почему это снова должно быть моей проблемой?",
    "Я не обязан страдать из-за вашей скорости.",
    "Можно хоть раз без бардака на ровном месте?",
    "Мне не нужен квест, мне нужен мой заказ.",
    "Вы сейчас серьёзно вот так работаете?",
    "Я слишком давно здесь, чтобы оставаться вежливым.",
    "Мне неинтересны причины, мне нужен результат.",
    "Почему каждый раз ощущение, что клиент тут лишний?",
    "Я уже оплатил, давайте без дополнительных испытаний.",
    "Если система не справляется, при чём тут я?",
    "Я не собираюсь входить в положение очереди.",
    "Мне не нужно немного подождать, я уже подождал.",
    "Можно обслужить меня без ощущения одолжения?",
    "Выглядит так, будто всё должно идти мимо меня.",
    "Я не для того пришёл, чтобы меня игнорировали.",
    "Остальные пусть как хотят, мне нужен мой заказ сейчас.",
    "Мне неважно, что у вас тут случилось, решите это без меня.",
    "Я не обязан быть понимающим клиентом.",
    "Давайте честно: это слишком долго даже для очереди.",
    "Я сейчас недоволен не концептуально, а вполне предметно.",
    "Мне только спросить, я ничего не задержу.",
    "Кто крайний, я за вами, но если быстро, то перед вами.",
    "Вас много, а я одна со своим заказом.",
    "Я сейчас без очереди уточню и уйду.",
    "Мне не получать, мне просто разобраться.",
    "Я здесь стою условно, обслужить можно уже сейчас.",
    "А почему окно одно, если людей больше одного.",
    "Я не возмущаюсь, я фиксирую бардак.",
    "Можно не по правилам, а по-человечески?",
    "Я, конечно, подожду, но с осуждением.",
    "Мне только забрать, не делайте из этого заседание.",
    "Я вообще на минутку, это должно идти отдельной строкой.",
    "Кто последний, тот за мной не занимайте.",
    "А можно побыстрее, у меня машина на аварийке.",
    "Я не ругаюсь, я просто громко недоволен.",
    "Мне кажется, вы сейчас не тем заняты.",
    "Я уже подошёл морально, осталось оформить технически.",
    "Если нужно ждать, предупреждать надо было заранее, ещё в детстве.",
    "Я не конфликтная, но сейчас организую.",
    "Почему каждый раз ощущение, что без скандала сервис не заводится?",
  ],
  quarrel: [
    "Эй, соблюдайте очередь.",
    "Мы вообще по одной линии идём?",
    "Не подрезайте у стойки.",
    "Кто тут сейчас должен проходить?",
    "Не лезьте передо мной.",
    "Я здесь стоял раньше.",
    "Давайте без скандала, просто по очереди.",
    "Вы сейчас всю линию стопорите.",
    "Нет, это было после меня.",
    "Куда вы двигаетесь, очередь вот здесь.",
  ],
};

const CAT_QUOTES = {
  standby: [
    "Нажимай. Город сам себя не переждёт.",
    "Открывай смену. Темнота уже внутри.",
    "Начинай. Хорошие новости закончились до тебя.",
  ],
  intro: [
    "Видишь цвет. Ищи того, кто его надел.",
    "Коробка врёт меньше людей. Смотри на цвет.",
    "На стойке ответ. В очереди проблема того же цвета.",
  ],
  pressure_rising: ["Воздух кончается.", "Зал начал скрипеть.", "Неприятности проснулись."],
  pressure_high: [
    "Сейчас начнут ошибаться все. Не присоединяйся.",
    "Давление выросло. Мозги бы тоже.",
    "Ещё немного, и эта смена покажет зубы.",
  ],
  pressure_critical: [
    "Вот теперь не до красоты.",
    "Ещё шаг мимо, и всё рухнет.",
    "Край близко. Не моргай.",
  ],
  calm: [
    "На миг отпустило.",
    "Тишина. Подозрительная, как всегда.",
    "Редкая передышка. Не привыкай.",
  ],
  combo_3: ["Уже не стыдно.", "Появился рисунок.", "Наконец работа, а не паника."],
  combo_5: [
    "Хорошо. Теперь не испорть.",
    "Ритм пойман. Держи его мёртвой хваткой.",
    "Вот так. Очередь начала уважать страх.",
  ],
  combo_8: [
    "Слишком чисто. Подозрительно.",
    "Красиво. Я бы не привыкал.",
    "Даже хаос иногда промахивается.",
  ],
  combo_break: [
    "И всё. Сказка сгорела.",
    "Был ритм. Стал опыт.",
    "Одним движением убил всё хорошее.",
  ],
  miss: [
    "Не тот. Слепота нынче в моде.",
    "Мимо. Уверенно и бесполезно.",
    "Ошибка. Клиенты это обожают.",
  ],
  flow_start: [
    "Пошёл поток. Режь быстро.",
    "Темп твой. Пока что.",
    "Хорошо. Работай, пока мир не вспомнил, кто он.",
  ],
  fast_access: [
    "Ближе стало всё. Кроме покоя.",
    "Два ряда в руке. Не урони.",
    "Пространства больше. Шансов ошибиться тоже.",
  ],
  anti_stress_ready: [
    "Судьба дала тебе одну поблажку.",
    "Один бесплатный грех у тебя есть.",
    "Подушка есть. Полёт всё равно твой.",
  ],
  anti_stress_spent: [
    "Всё. Страховка умерла.",
    "Поблажка кончилась. Дальше по крови.",
    "Теперь без мягкой посадки.",
  ],
  perfect_row_spotted: [
    "Красота. Почти неуместная.",
    "Редкий порядок в этом цирке.",
    "Линия сложилась. Не предай её.",
  ],
  perfect_row_done: [
    "Чисто. Даже противно.",
    "Вот это уже ремесло.",
    "На секунду ты был лучше этой смены.",
  ],
  rush: [
    "Час пик. Добро пожаловать в мясорубку.",
    "Толпа пошла. Думай быстрее.",
    "Сейчас будет шум. Не становись его частью.",
  ],
  quarrel: [
    "Конечно. Теперь ещё и драма.",
    "Очередь решила развлечься.",
    "Сцепились. Люди иначе не умеют.",
  ],
  quarrel_cleared: [
    "Развёл их. Ненадолго.",
    "Тишина куплена в кредит.",
    "Удивительно. Кто-то здесь ещё умеет думать.",
  ],
  game_over: [
    "Смена закрылась на тебе.",
    "Ночь победила по очкам.",
    "Очередь получила то, за чем пришла: тебя.",
  ],
  gold: [
    "О. Так ты из богатых.",
    "Золото с неба. Низко, но эффективно.",
    "Нечестно. Зато красиво.",
  ],
};

const SKIN_TONES = ["#f3d0b0", "#ddb08a", "#c78d65", "#8f6244"];
const HAIR_TONES = ["#2d2320", "#5b4032", "#21181a", "#7b5b46"];
const SHOE_TONES = ["#20262a", "#3f332e", "#223445"];
const ACCESSORY_TONES = ["#2a3138", "#4a3b34", "#46586a", "#6d5f4d", "#7d563f"];
const SPECIAL_CLIENT_PROFILES = [
  {
    persona: "shurik",
    bodyType: "slim",
    posture: "lean",
    hairType: "short",
    topType: "shirt",
    accessory: "backpack",
    idleType: "shift",
    hair: "#6f573e",
    shoe: "#4b3e35",
    accessoryTone: "#66738a",
  },
  {
    persona: "bureaucrat",
    bodyType: "average",
    posture: "upright",
    hairType: "bun",
    topType: "coat",
    accessory: "shopper",
    idleType: "calm",
    hair: "#5b4032",
    shoe: "#3f332e",
    accessoryTone: "#6d5f4d",
  },
  {
    persona: "neo",
    bodyType: "slim",
    posture: "upright",
    hairType: "short",
    topType: "coat",
    accessory: "phone",
    idleType: "calm",
    hair: "#191416",
    shoe: "#191f24",
    accessoryTone: "#2d3338",
  },
  {
    persona: "gopnik",
    bodyType: "average",
    posture: "lean",
    hairType: "cap",
    topType: "hoodie",
    accessory: "none",
    idleType: "fidget",
    hair: "#241d1b",
    shoe: "#1c2328",
  },
  {
    persona: "punk",
    bodyType: "slim",
    posture: "lean",
    hairType: "bob",
    topType: "coat",
    accessory: "phone",
    idleType: "shift",
    hair: "#1b171d",
    shoe: "#222d39",
    accessoryTone: "#485a72",
  },
  {
    persona: "service-aunt",
    bodyType: "broad",
    posture: "upright",
    hairType: "bun",
    topType: "coat",
    accessory: "shopper",
    idleType: "calm",
    hair: "#6f533f",
    shoe: "#45362e",
    accessoryTone: "#8a6145",
  },
  {
    persona: "it-hoodie",
    bodyType: "slim",
    posture: "slouch",
    hairType: "hood",
    topType: "hoodie",
    accessory: "backpack",
    idleType: "fidget",
    hair: "#21181a",
    shoe: "#20262a",
    accessoryTone: "#51667a",
  },
];
const CLIENT_ARCHETYPES = [
  {
    bodyType: "slim",
    posture: "upright",
    hairType: "short",
    topType: "shirt",
    accessory: "backpack",
    idleType: "calm",
  },
  {
    bodyType: "average",
    posture: "slouch",
    hairType: "hood",
    topType: "hoodie",
    accessory: "none",
    idleType: "shift",
  },
  {
    bodyType: "broad",
    posture: "lean",
    hairType: "bob",
    topType: "coat",
    accessory: "shopper",
    idleType: "calm",
  },
  {
    bodyType: "broad",
    posture: "upright",
    hairType: "short",
    topType: "coat",
    accessory: "shopper",
    idleType: "calm",
  },
  {
    bodyType: "slim",
    posture: "upright",
    hairType: "bun",
    topType: "shirt",
    accessory: "shopper",
    idleType: "shift",
  },
  {
    bodyType: "slim",
    posture: "lean",
    hairType: "cap",
    topType: "hoodie",
    accessory: "backpack",
    idleType: "fidget",
  },
];

const FX_ASSETS = Object.freeze({
  success: "./assets/audio/confirmation_002.mp3",
  miss: "./assets/audio/error_005.mp3",
  bonus: "./assets/audio/bonus_levelup.mp3",
  alert: "./assets/audio/question_002.mp3",
  spawn: "./assets/audio/open_001.mp3",
  fail: "./assets/audio/fail_gameover.mp3",
});

const FX_GAIN = Object.freeze({
  success: 0.48,
  miss: 0.45,
  bonus: 0.42,
  alert: 0.46,
  spawn: 0.28,
  fail: 0.32,
});

const DOM = {
  gameScreen: document.querySelector("#game-screen"),
  stageSurface: document.querySelector("#stage-surface"),
  introOverlay: document.querySelector("#intro-overlay"),
  restartButton: document.querySelector("#restart-button"),
  menuButton: document.querySelector("#menu-button"),
  board: document.querySelector("#board"),
  score: document.querySelector("#score"),
  counterScore: document.querySelector("#counter-score"),
  combo: document.querySelector("#combo"),
  time: document.querySelector("#time"),
  sceneDialogue: document.querySelector("#scene-dialogue"),
  sceneDialogueText: document.querySelector("#scene-dialogue-text"),
  catDialogue: document.querySelector("#cat-dialogue"),
  catDialogueText: document.querySelector("#cat-dialogue-text"),
  activeOrder: document.querySelector("#active-order"),
  activeOrderBadge: document.querySelector("#active-order-badge"),
  activeOrderIcon: document.querySelector("#active-order-icon"),
  overlay: document.querySelector("#game-over-overlay"),
  resultScore: document.querySelector("#result-score"),
  resultServed: document.querySelector("#result-served"),
  resultMaxCombo: document.querySelector("#result-max-combo"),
  resultTime: document.querySelector("#result-time"),
  musicToggle: document.querySelector("#music-toggle"),
  toastStack: document.querySelector("#toast-stack"),
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
  quarrelSpreadAt: 0,
  quarrelCells: [],
  rushUntil: 0,
  currentOrder: null,
  activeSpeakerId: null,
  activeSpeechText: "",
  activeSpeechPlacement: null,
  speechSwitchAt: 0,
  catSpeechText: "",
  catSpeechUntil: 0,
  catSpeechCooldownUntil: 0,
  catSpeechPriority: 0,
  catLastLineByCategory: {},
  catLineDecks: {},
  catPressureTier: 0,
  lastFrame: 0,
  lastId: 1,
};

const audioState = {
  ctx: null,
  enabled: true,
  musicTimer: 0,
  musicStep: 0,
  unlocked: false,
  mediaReady: false,
  mediaElements: new Map(),
  activeMediaFx: new Set(),
  soundBuffers: new Map(),
  loadingPromise: null,
};

const GOLD_CHEAT_KEYS = new Set(["g", "o", "l", "d"]);
const pressedKeys = new Set();
let goldCheatLatched = false;

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
  state.quarrelSpreadAt = 0;
  state.quarrelCells = [];
  state.rushUntil = 0;
  state.currentOrder = null;
  state.activeSpeakerId = null;
  state.activeSpeechText = "";
  state.activeSpeechPlacement = null;
  state.speechSwitchAt = 0;
  state.catSpeechText = "";
  state.catSpeechUntil = 0;
  state.catSpeechCooldownUntil = 0;
  state.catSpeechPriority = 0;
  state.catLastLineByCategory = {};
  state.catLineDecks = {};
  state.catPressureTier = 0;
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
  state.quarrelSpreadAt = 0;
  state.quarrelCells = [];
  state.rushUntil = 0;
  state.currentOrder = null;
  state.activeSpeakerId = null;
  state.activeSpeechText = "Тапни по сцене, чтобы открыть смену.";
  state.activeSpeechPlacement = null;
  state.speechSwitchAt = 0;
  state.catPressureTier = 0;
  state.catLastLineByCategory = {};
  state.catLineDecks = {};
  state.lastFrame = 0;
  DOM.overlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  DOM.introOverlay.classList.remove("hidden");
  speakCat("standby", { priority: 2, bypassCooldown: true, durationMs: 2600 });
  render();
}

function startGame() {
  unlockAudio();
  resetRoundState();
  DOM.overlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  DOM.introOverlay.classList.add("hidden");
  spawnClient();
  syncCurrentOrder(true);
  speakCat("intro", { priority: 4, bypassCooldown: true, durationMs: 2800 });
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
  document.body.classList.add("overlay-open");
  speakCat("game_over", { priority: 6, bypassCooldown: true, durationMs: 2800 });
  pushToast("Смена окончена. Очередь уперлась в стойку.");
  playFx("fail");
}

function createClient(type) {
  const order = ORDER_TYPES[type];
  const special = Math.random() < 0.38 ? sample(SPECIAL_CLIENT_PROFILES) : null;
  const archetype = special || sample(CLIENT_ARCHETYPES);
  return {
    id: state.lastId++,
    type,
    quote: sample(CUSTOMER_QUOTES.generic),
    enteredAccessAt: null,
    angryUntil: 0,
    skin: special?.skin || sample(SKIN_TONES),
    hair: special?.hair || sample(HAIR_TONES),
    shirt: sample(order.shirtTones),
    shoe: special?.shoe || sample(SHOE_TONES),
    accessoryTone: special?.accessoryTone || sample(ACCESSORY_TONES),
    bodyType: archetype.bodyType,
    posture: archetype.posture,
    hairType: archetype.hairType,
    topType: archetype.topType,
    accessory: archetype.accessory,
    idleType: archetype.idleType,
    persona: archetype.persona || "generic",
  };
}

function getRandomOrder() {
  return sample(ORDER_TYPE_KEYS);
}

function getTypeStats() {
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

function pickWeightedType(candidates) {
  const total = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
  if (total <= 0) {
    return sample(candidates).type;
  }

  let target = Math.random() * total;
  for (const candidate of candidates) {
    target -= candidate.weight;
    if (target <= 0) {
      return candidate.type;
    }
  }

  return candidates[candidates.length - 1].type;
}

function chooseCurrentOrder(previousOrder) {
  const stats = getTypeStats();
  if (stats.length === 0) {
    return null;
  }

  const phase = getPhase();
  const weighted = stats.map((stat) => {
    const countWeight = Math.pow(stat.count, phase.orderFrequencyExponent);
    const frontRatio = (4 - stat.nearestRow) / 4;
    const frontWeight = 1 + phase.frontWeightBias * frontRatio;
    const repeatWeight = stat.type === previousOrder ? BALANCE.orderSelection.sameTypePenalty : 1;

    return {
      ...stat,
      weight: Math.max(0.01, countWeight * frontWeight * repeatWeight),
    };
  });

  return pickWeightedType(weighted);
}

function syncCurrentOrder(forceChange = false) {
  const hasCurrentOrder = getTypeStats().some((stat) => stat.type === state.currentOrder);
  if (forceChange || !state.currentOrder || !hasCurrentOrder) {
    state.currentOrder = chooseCurrentOrder(state.currentOrder);
  }
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
  syncCurrentOrder();
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

function handleCellTap(row, col) {
  if (!state.running) {
    return;
  }

  const client = state.board[row]?.[col];
  if (!client) {
    return;
  }

  if (isQuarrelCell(row, col)) {
    serveClient(row, col, true);
    return;
  }

  if (client.type === state.currentOrder) {
    serveClient(row, col, false);
    return;
  }

  registerMiss(client, row, col);
}

function registerMiss(targetClient, row, col) {
  const now = performance.now();
  const lostCombo = state.combo;
  const fallback = getAccessibleClients()[0] || null;
  const selected = targetClient ? { client: targetClient, row, col } : fallback;

  if (selected) {
    selected.client.angryUntil = now + 900;
    state.activeSpeakerId = selected.client.id;
    state.activeSpeechText = sample(CUSTOMER_QUOTES.angry);
    state.speechSwitchAt = now + 2_000;
  }

  state.totalErrors += 1;
  state.consecutiveErrors += 1;
  state.combo = 0;
  state.firstFivePerfect = false;
  state.perfectRow = null;
  state.speedups.push(now + BALANCE.tension.missSpeedupDurationMs);

  if (state.consecutiveErrors >= 3) {
    state.antiStressReady = true;
    speakCat("anti_stress_ready", { priority: 4, durationMs: 2600 });
  }

  if (lostCombo >= 5) {
    speakCat("combo_break", { priority: 5, bypassCooldown: true, durationMs: 2400 });
  } else {
    speakCat("miss", { priority: 4, bypassCooldown: true, durationMs: 2200 });
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
    speakCat("anti_stress_spent", { priority: 4, durationMs: 2400 });
    pushToast("Антистресс сработал: +15");
  }
  if (fromQuarrel) {
    points += 10;
    clearQuarrel();
    speakCat("quarrel_cleared", { priority: 4, durationMs: 2400 });
    pushToast("Ссора погашена.");
  }

  state.score += points;
  state.slowdowns.push(now + BALANCE.tension.successSlowdownDurationMs);

  if (state.combo >= 5 && now >= state.flowUntil) {
    state.flowUntil = now + 10_000;
    speakCat("flow_start", { priority: 4, durationMs: 2400 });
    pushToast("Режим потока: +50% к очкам на 10 секунд.");
  }

  if (state.firstFivePerfect && state.served >= 5 && state.totalErrors === 0) {
    state.fastAccessUntil = now + 20_000;
    speakCat("fast_access", { priority: 4, durationMs: 2400 });
    pushToast("Быстрый старт: зона доступа расширена до 2 рядов.");
  }

  if (state.combo === 3) {
    speakCat("combo_3", { priority: 3, durationMs: 2200 });
  } else if (state.combo === 5) {
    speakCat("combo_5", { priority: 4, durationMs: 2400 });
  } else if (state.combo === 8 || state.combo === 12) {
    speakCat("combo_8", { priority: 4, durationMs: 2400 });
  }

  trackPerfectRow(client.type);

  state.board[row][col] = null;
  collapseColumn(col);
  updateAccessTimers();
  syncCurrentOrder(true);

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
      speakCat("perfect_row_spotted", { priority: 3, durationMs: 2400 });
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
    speakCat("perfect_row_done", { priority: 4, durationMs: 2400 });
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
    BALANCE.tension.minFillRate,
    (BALANCE.tension.baseFillRate -
      state.slowdowns.length * BALANCE.tension.successSlowdown +
      state.speedups.length * BALANCE.tension.missSpeedup) *
      phase.tensionMultiplier
  );

  if (phase.gimmicks.length === 0) {
    state.tension = Math.min(0.88, state.tension + rate * dt);
    updateCatPressure(now);
    return;
  }

  state.tension = Math.min(1, state.tension + rate * dt);
  updateCatPressure(now);
  if (state.tension >= 1) {
    triggerGimmick(now);
  }
}

function triggerGimmick(now) {
  const phase = getPhase();
  const pool = phase.gimmicks.length > 0 ? phase.gimmicks : ["rush"];
  const gimmick = sample(pool);

  state.tension = 0;
  state.calmUntil = now + BALANCE.tension.calmDurationMs;
  state.gimmick = gimmick;
  state.quarrelCells = [];

  if (gimmick === "quarrel") {
    const activated = createQuarrel(now);
    if (!activated) {
      state.gimmick = "rush";
      state.gimmickUntil = now + BALANCE.gimmicks.rush.durationMs;
      state.rushUntil = state.gimmickUntil;
      speakCat("rush", { priority: 5, bypassCooldown: true, durationMs: 2400 });
      pushToast("Час пик: поток клиентов ускорился.");
    } else {
      state.gimmickUntil = now + BALANCE.gimmicks.quarrel.durationMs;
      state.quarrelSpreadAt = now + BALANCE.gimmicks.quarrel.spreadDelayMs;
      speakCat("quarrel", { priority: 5, bypassCooldown: true, durationMs: 2400 });
      pushToast("Ссора: заблокированные клетки можно снять любой выдачей.");
    }
  } else {
    state.gimmickUntil = now + BALANCE.gimmicks.rush.durationMs;
    state.rushUntil = state.gimmickUntil;
    speakCat("rush", { priority: 5, bypassCooldown: true, durationMs: 2400 });
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
  state.rushUntil = 0;
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
  state.quarrelSpreadAt = now + BALANCE.gimmicks.quarrel.spreadDelayMs;
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
  const interval = activeRush ? phase.spawn / BALANCE.gimmicks.rush.spawnDivider : phase.spawn;

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
  updateCatSpeech(now);

  if (DOM.score) {
    DOM.score.textContent = formatNumber(state.score);
  }
  DOM.counterScore.textContent = formatCounterScore(state.score);
  DOM.counterScore.classList.toggle("is-compact", state.score > 9999);
  if (DOM.combo) {
    DOM.combo.textContent = `x${Math.max(1, state.combo)}`;
  }
  if (DOM.time) {
    DOM.time.textContent = formatTime(state.sessionMs);
  }
  DOM.sceneDialogueText.textContent = state.activeSpeechText || "";
  DOM.sceneDialogue.classList.toggle("hidden", !state.activeSpeechText);
  DOM.catDialogueText.textContent = state.catSpeechText || "";
  DOM.catDialogue.classList.toggle("hidden", !state.catSpeechText);
  renderActiveOrder();

  boardCells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const client = state.board[row]?.[col] || null;

    cell.className = "cell";
    if (row < state.accessRows) {
      cell.classList.add("accessible");
    }
    if (client) {
      cell.classList.add("has-customer");
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

    const angry = now < client.angryUntil;

    cell.innerHTML = `
      ${isQuarrelCell(row, col) ? '<span class="spark">⚡</span>' : ""}
      <div class="cell-inner">
        <div class="customer-shadow"></div>
        <div
          class="customer-figure persona-${client.persona} body-${client.bodyType} posture-${client.posture} top-${client.topType} hair-${client.hairType} accessory-${client.accessory} idle-${client.idleType} ${angry ? "angry" : ""}"
          style="--skin:${client.skin}; --hair:${client.hair}; --shirt:${client.shirt}; --shoe:${client.shoe}; --bag:${client.accessoryTone};"
        >
          <span class="customer-accessory"></span>
          <span class="customer-arm arm-left"></span>
          <span class="customer-arm arm-right"></span>
          <span class="customer-body"></span>
          <span class="customer-legs"></span>
          <span class="customer-head"></span>
          <span class="customer-hair"></span>
          <span class="customer-detail"></span>
          <span class="customer-feet"></span>
        </div>
      </div>
    `;
  });

  positionSceneDialogue();
  renderToasts();
}

function formatCounterScore(value) {
  const normalized = Math.max(0, Math.floor(value));
  if (normalized <= 9999) {
    return String(normalized).padStart(4, "0");
  }
  return formatNumber(normalized);
}

function shuffle(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function sampleCatLine(category, pool) {
  if (!pool || pool.length === 0) {
    return "";
  }
  if (pool.length === 1) {
    state.catLastLineByCategory[category] = pool[0];
    return pool[0];
  }

  let deck = state.catLineDecks[category];
  if (!deck || deck.length === 0) {
    deck = shuffle(pool);
    const lastLine = state.catLastLineByCategory[category];
    if (deck.length > 1 && deck[0] === lastLine) {
      [deck[0], deck[1]] = [deck[1], deck[0]];
    }
  }

  const [line, ...restDeck] = deck;
  state.catLineDecks[category] = restDeck;
  state.catLastLineByCategory[category] = line;
  return line;
}

function speakCat(category, options = {}) {
  const now = performance.now();
  const { priority = 1, durationMs = 2200, cooldownMs = 5200, bypassCooldown = false } = options;
  const pool = CAT_QUOTES[category];
  if (!pool || pool.length === 0) {
    return false;
  }
  if (
    !bypassCooldown &&
    now < state.catSpeechCooldownUntil &&
    priority <= state.catSpeechPriority
  ) {
    return false;
  }
  if (now < state.catSpeechUntil && priority < state.catSpeechPriority) {
    return false;
  }

  state.catSpeechText = sampleCatLine(category, pool);
  state.catSpeechUntil = now + durationMs;
  state.catSpeechCooldownUntil = now + cooldownMs;
  state.catSpeechPriority = priority;
  return true;
}

function updateCatSpeech(now) {
  if (state.catSpeechText && now >= state.catSpeechUntil) {
    state.catSpeechText = "";
    state.catSpeechPriority = 0;
  }
}

function updateCatPressure(now) {
  if (!state.running) {
    state.catPressureTier = 0;
    return;
  }

  let nextTier = 0;
  if (state.gimmick) {
    nextTier = 0;
  } else if (state.tension >= 0.84) {
    nextTier = 3;
  } else if (state.tension >= 0.58) {
    nextTier = 2;
  } else if (state.tension >= 0.34) {
    nextTier = 1;
  }

  if (nextTier === state.catPressureTier) {
    return;
  }

  const previousTier = state.catPressureTier;
  state.catPressureTier = nextTier;

  if (nextTier === 0 && previousTier > 0 && now < state.calmUntil) {
    speakCat("calm", { priority: 3, durationMs: 2200 });
    return;
  }
  if (nextTier === 1) {
    speakCat("pressure_rising", { priority: 2, durationMs: 2200 });
  } else if (nextTier === 2) {
    speakCat("pressure_high", { priority: 4, durationMs: 2400 });
  } else if (nextTier === 3) {
    speakCat("pressure_critical", { priority: 5, durationMs: 2400 });
  }
}

function applyGoldCheat() {
  if (!state.running) {
    return;
  }
  state.score += 10_000;
  speakCat("gold", { priority: 5, bypassCooldown: true, durationMs: 2400 });
  pushToast("GOLD: +10 000 очков.");
  playFx("bonus");
  render();
}

function getBoardCellElement(row, col) {
  return (
    boardCells.find(
      (cell) => Number(cell.dataset.row) === row && Number(cell.dataset.col) === col
    ) || null
  );
}

function rectsOverlap(left, right) {
  return (
    left.left < right.right &&
    left.right > right.left &&
    left.top < right.bottom &&
    left.bottom > right.top
  );
}

function toLocalRect(rect, stageRect, margin = 0) {
  return {
    left: rect.left - stageRect.left - margin,
    top: rect.top - stageRect.top - margin,
    right: rect.right - stageRect.left + margin,
    bottom: rect.bottom - stageRect.top + margin,
  };
}

function isCompactDialogueLayout(stageRect) {
  return stageRect.width <= 520 || window.matchMedia("(max-width: 760px)").matches;
}

function measureSceneDialogue(text) {
  const previousText = DOM.sceneDialogueText.textContent;
  const previousLeft = DOM.sceneDialogue.style.left;
  const previousTop = DOM.sceneDialogue.style.top;
  const previousTransform = DOM.sceneDialogue.style.transform;
  const wasBelow = DOM.sceneDialogue.classList.contains("is-below");
  const wasHidden = DOM.sceneDialogue.classList.contains("hidden");

  DOM.sceneDialogueText.textContent = text;
  DOM.sceneDialogue.classList.remove("hidden", "is-below");
  DOM.sceneDialogue.style.left = "0px";
  DOM.sceneDialogue.style.top = "0px";
  DOM.sceneDialogue.style.transform = "none";

  const rect = DOM.sceneDialogue.getBoundingClientRect();

  DOM.sceneDialogueText.textContent = previousText;
  DOM.sceneDialogue.style.left = previousLeft;
  DOM.sceneDialogue.style.top = previousTop;
  DOM.sceneDialogue.style.transform = previousTransform;
  DOM.sceneDialogue.classList.toggle("is-below", wasBelow);
  DOM.sceneDialogue.classList.toggle("hidden", wasHidden);

  return { width: rect.width, height: rect.height };
}

function getTapTargetRects(stageRect) {
  const targets = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const client = state.board[row][col];
      if (!client) {
        continue;
      }

      const tappable = isQuarrelCell(row, col) || client.type === state.currentOrder;
      if (!tappable) {
        continue;
      }

      const cell = getBoardCellElement(row, col);
      if (!cell) {
        continue;
      }

      targets.push(toLocalRect(cell.getBoundingClientRect(), stageRect, 6));
    }
  }
  return targets;
}

function getDialoguePlacementOptions(isCompact) {
  if (isCompact) {
    return [
      { anchor: 0.5, below: false },
      { anchor: 0.68, below: false },
      { anchor: 0.32, below: false },
      { anchor: 0.5, below: true },
      { anchor: 0.68, below: true },
      { anchor: 0.32, below: true },
    ];
  }

  return [
    { anchor: 0.5, below: false },
    { anchor: 0.72, below: false },
    { anchor: 0.28, below: false },
    { anchor: 0.5, below: true },
    { anchor: 0.68, below: true },
    { anchor: 0.32, below: true },
  ];
}

function createDialoguePlacement(candidate, bubbleSize, stageRect, option) {
  const cell = getBoardCellElement(candidate.row, candidate.col);
  if (!cell) {
    return null;
  }

  const compact = isCompactDialogueLayout(stageRect);
  const padding = compact ? 8 : 14;
  const gap = compact ? 10 : 12;
  const tailPadding = compact ? 22 : 28;
  const cellRect = cell.getBoundingClientRect();
  const cellCenterX = cellRect.left - stageRect.left + cellRect.width / 2;
  const localTop = cellRect.top - stageRect.top;
  const localBottom = cellRect.bottom - stageRect.top;

  if (bubbleSize.width >= stageRect.width - padding * 2) {
    return null;
  }

  const unclampedLeft = cellCenterX - bubbleSize.width * option.anchor;
  const left = clamp(unclampedLeft, padding, stageRect.width - bubbleSize.width - padding);
  const top = option.below ? localBottom + gap : localTop - bubbleSize.height - gap;

  if (top < padding || top + bubbleSize.height > stageRect.height - padding) {
    return null;
  }

  const rect = {
    left,
    top,
    right: left + bubbleSize.width,
    bottom: top + bubbleSize.height,
  };

  return {
    left,
    top,
    below: option.below,
    tailLeft: clamp(cellCenterX - left, tailPadding, bubbleSize.width - tailPadding),
    rect,
  };
}

function findSafeDialoguePlacement(candidate, text) {
  const stageRect = DOM.stageSurface.getBoundingClientRect();
  if (stageRect.width <= 0 || stageRect.height <= 0) {
    return null;
  }

  const bubbleSize = measureSceneDialogue(text);
  const targetRects = getTapTargetRects(stageRect);
  const options = getDialoguePlacementOptions(isCompactDialogueLayout(stageRect));

  for (const option of options) {
    const placement = createDialoguePlacement(candidate, bubbleSize, stageRect, option);
    if (!placement) {
      continue;
    }
    if (targetRects.some((targetRect) => rectsOverlap(placement.rect, targetRect))) {
      continue;
    }
    return placement;
  }

  return null;
}

function rotateSpeechCandidates(candidates) {
  const currentIndex = candidates.findIndex(
    (candidate) => candidate.client.id === state.activeSpeakerId
  );
  if (currentIndex < 0 || candidates.length <= 1) {
    return candidates;
  }

  return [
    ...candidates.slice(currentIndex + 1),
    ...candidates.slice(0, currentIndex),
    candidates[currentIndex],
  ];
}

function pickSafeSpeechSelection(candidates, options = {}) {
  const { preferredCandidate = null, preferredText = "" } = options;

  if (preferredCandidate && preferredText) {
    const placement = findSafeDialoguePlacement(preferredCandidate, preferredText);
    if (placement) {
      return {
        candidate: preferredCandidate,
        text: preferredText,
        placement,
      };
    }
  }

  for (const candidate of candidates) {
    const angry = performance.now() < candidate.client.angryUntil;
    const quarrel = isQuarrelCell(candidate.row, candidate.col);
    const text = getSpeechText(candidate.client, angry, quarrel);
    const placement = findSafeDialoguePlacement(candidate, text);
    if (!placement) {
      continue;
    }

    return { candidate, text, placement };
  }

  return null;
}

function positionSceneDialogue() {
  if (!state.activeSpeechText) {
    return;
  }

  if (state.awaitingStart) {
    positionSceneDialogueDefault();
    return;
  }

  if (!state.activeSpeechPlacement) {
    positionSceneDialogueDefault();
    return;
  }

  DOM.sceneDialogue.classList.toggle("is-below", state.activeSpeechPlacement.below);
  DOM.sceneDialogue.style.transform = "none";
  DOM.sceneDialogue.style.left = `${state.activeSpeechPlacement.left}px`;
  DOM.sceneDialogue.style.top = `${state.activeSpeechPlacement.top}px`;
  DOM.sceneDialogue.style.setProperty(
    "--dialogue-tail-left",
    `${state.activeSpeechPlacement.tailLeft}px`
  );
}

function positionSceneDialogueDefault() {
  DOM.sceneDialogue.classList.remove("is-below");
  DOM.sceneDialogue.style.left = "50%";
  DOM.sceneDialogue.style.top = "24px";
  DOM.sceneDialogue.style.transform = "translateX(-50%)";
  DOM.sceneDialogue.style.setProperty("--dialogue-tail-left", "50%");
}

function updateActiveSpeech(now) {
  if (state.awaitingStart) {
    state.activeSpeakerId = null;
    state.activeSpeechText = "Тапни по сцене, чтобы открыть смену.";
    state.activeSpeechPlacement = null;
    return;
  }

  const candidates = getSpeechCandidates();
  if (candidates.length === 0) {
    state.activeSpeakerId = null;
    state.activeSpeechText = "";
    state.activeSpeechPlacement = null;
    return;
  }

  const activeStillVisible = candidates.find(
    (candidate) => candidate.client.id === state.activeSpeakerId
  );
  if (activeStillVisible && now < state.speechSwitchAt && state.activeSpeechText) {
    const currentSelection = pickSafeSpeechSelection(candidates, {
      preferredCandidate: activeStillVisible,
      preferredText: state.activeSpeechText,
    });
    if (currentSelection) {
      state.activeSpeechPlacement = currentSelection.placement;
      return;
    }
  }

  const selection = pickSafeSpeechSelection(rotateSpeechCandidates(candidates));
  if (!selection) {
    state.activeSpeakerId = null;
    state.activeSpeechText = "";
    state.activeSpeechPlacement = null;
    return;
  }

  state.activeSpeakerId = selection.candidate.client.id;
  state.activeSpeechText = selection.text;
  state.activeSpeechPlacement = selection.placement;
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

function getSpeechText(client, angry, quarrel) {
  if (angry) {
    return sample(CUSTOMER_QUOTES.angry);
  }
  if (quarrel) {
    return sample(CUSTOMER_QUOTES.quarrel);
  }
  return Math.random() < 0.46 ? sample(CUSTOMER_QUOTES.queue) : client.quote;
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

function renderOrderBox(order, className) {
  return `<span class="type-box ${className} ${order.className}" style="--box-color:${order.color};" aria-hidden="true"></span>`;
}

function renderActiveOrder() {
  if (!state.currentOrder) {
    DOM.activeOrder.dataset.order = "idle";
    DOM.activeOrderBadge.className = "active-order-badge";
    DOM.activeOrderBadge.removeAttribute("aria-label");
    DOM.activeOrderIcon.innerHTML = "";
    DOM.activeOrderBadge.style.removeProperty("--box-color");
    return;
  }

  const order = ORDER_TYPES[state.currentOrder];
  DOM.activeOrder.dataset.order = state.currentOrder;
  DOM.activeOrderBadge.className = `active-order-badge ${order.className}`;
  DOM.activeOrderBadge.setAttribute("aria-label", order.label);
  DOM.activeOrderBadge.style.setProperty("--box-color", order.color);
  DOM.activeOrderIcon.innerHTML = renderOrderBox(order, "active-order-symbol");
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
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if ("audioSession" in navigator && navigator.audioSession) {
    try {
      navigator.audioSession.type = "playback";
    } catch (error) {
      void error;
    }
  }

  if (!AudioContext) {
    if (!audioState.loadingPromise) {
      audioState.loadingPromise = loadAudioAssets();
    }
    return;
  }

  if (!audioState.ctx) {
    audioState.ctx = new AudioContext();
  }

  audioState.unlocked = true;
  if (audioState.ctx.state === "suspended") {
    void audioState.ctx.resume().catch(() => {});
  }
  if (!audioState.loadingPromise) {
    audioState.loadingPromise = loadAudioAssets();
  }
}

async function loadAudioAssets() {
  if (!audioState.mediaReady && typeof Audio !== "undefined") {
    Object.entries(FX_ASSETS).forEach(([kind, url]) => {
      const media = new Audio(url);
      media.preload = "auto";
      media.playsInline = true;
      audioState.mediaElements.set(kind, media);
      media.load();
    });
    audioState.mediaReady = true;
  }

  const ctx = audioState.ctx;
  if (!ctx) {
    return;
  }

  await Promise.all(
    Object.entries(FX_ASSETS).map(async ([kind, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await decodeAudioBuffer(ctx, arrayBuffer);
        audioState.soundBuffers.set(kind, audioBuffer);
      } catch (error) {
        console.warn(`Could not load sound "${kind}" from ${url}.`, error);
      }
    })
  );
}

function decodeAudioBuffer(ctx, arrayBuffer) {
  const copy = arrayBuffer.slice(0);
  if (ctx.decodeAudioData.length === 1) {
    return ctx.decodeAudioData(copy);
  }

  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(copy, resolve, reject);
  });
}

function isMobileAudioContext() {
  return window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
}

function getFxGainMultiplier() {
  return isMobileAudioContext() ? 1.85 : 1;
}

function getMusicGainValue() {
  return isMobileAudioContext() ? 0.04 : 0.015;
}

function shouldUseMediaAudio() {
  return isMobileAudioContext() && audioState.mediaElements.size > 0;
}

function cleanupMediaFxInstance(instance) {
  audioState.activeMediaFx.delete(instance);
  instance.src = "";
}

function playMediaFx(kind) {
  const template = audioState.mediaElements.get(kind);
  if (!template) {
    return false;
  }

  const instance = template.cloneNode(true);
  instance.preload = "auto";
  instance.playsInline = true;
  instance.volume = clamp((FX_GAIN[kind] || 0.35) * 1.7, 0, 1);
  audioState.activeMediaFx.add(instance);

  const clear = () => {
    instance.removeEventListener("ended", clear);
    instance.removeEventListener("error", clear);
    cleanupMediaFxInstance(instance);
  };

  instance.addEventListener("ended", clear, { once: true });
  instance.addEventListener("error", clear, { once: true });

  const playPromise = instance.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      cleanupMediaFxInstance(instance);
      playSynthFx(kind);
    });
  }

  return true;
}

function playFx(kind) {
  if (!audioState.enabled) {
    return;
  }

  if (shouldUseMediaAudio() && playMediaFx(kind)) {
    return;
  }

  if (!audioState.ctx) {
    return;
  }

  if (audioState.ctx.state !== "running") {
    void audioState.ctx.resume().catch(() => {});
  }

  const ctx = audioState.ctx;
  const buffer = audioState.soundBuffers.get(kind);
  if (buffer) {
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = (FX_GAIN[kind] || 0.35) * getFxGainMultiplier();
    source.connect(gain).connect(ctx.destination);
    source.start();
    return;
  }

  playSynthFx(kind);
}

function playSynthFx(kind) {
  const ctx = audioState.ctx;
  if (!ctx) {
    return;
  }

  const now = ctx.currentTime;
  const config = {
    success: [880, 0.08, "triangle", 0.085],
    miss: [180, 0.12, "sawtooth", 0.09],
    bonus: [660, 0.14, "triangle", 0.1],
    alert: [260, 0.18, "square", 0.09],
    spawn: [520, 0.06, "sine", 0.06],
    fail: [110, 0.25, "sawtooth", 0.11],
  }[kind] || [440, 0.1, "sine", 0.06];

  const [frequency, duration, type, gainValue] = config;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue * getFxGainMultiplier(), now);
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
  gain.gain.setValueAtTime(getMusicGainValue(), start);
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
  syncMusicToggle();
}

function syncMusicToggle() {
  DOM.musicToggle.classList.toggle("is-on", audioState.enabled);
  DOM.musicToggle.classList.toggle("is-off", !audioState.enabled);
  DOM.musicToggle.setAttribute("aria-pressed", String(audioState.enabled));
  DOM.musicToggle.setAttribute(
    "aria-label",
    audioState.enabled ? "Музыка включена" : "Музыка выключена"
  );
}

function handleSceneTap(event) {
  unlockAudio();
  if (event.target.closest("#music-toggle")) {
    return;
  }
  if (state.awaitingStart && DOM.overlay.classList.contains("hidden")) {
    startGame();
  }
}

function onBoardPointerDown(event) {
  unlockAudio();
  const cell = event.target.closest(".cell");
  if (!cell) {
    return;
  }

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  handleCellTap(row, col);
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  if (!GOLD_CHEAT_KEYS.has(key)) {
    return;
  }

  pressedKeys.add(key);
  const allPressed = [...GOLD_CHEAT_KEYS].every((requiredKey) => pressedKeys.has(requiredKey));
  if (!allPressed || goldCheatLatched) {
    return;
  }

  goldCheatLatched = true;
  applyGoldCheat();
}

function handleKeyUp(event) {
  const key = event.key.toLowerCase();
  if (!GOLD_CHEAT_KEYS.has(key)) {
    return;
  }

  pressedKeys.delete(key);
  const allPressed = [...GOLD_CHEAT_KEYS].every((requiredKey) => pressedKeys.has(requiredKey));
  if (!allPressed) {
    goldCheatLatched = false;
  }
}

function resetPressedKeys() {
  pressedKeys.clear();
  goldCheatLatched = false;
}

initBoardMarkup();
setStandby();
syncMusicToggle();

DOM.restartButton.addEventListener("click", startGame);
DOM.menuButton.addEventListener("click", setStandby);
DOM.musicToggle.addEventListener("click", toggleMusic);
DOM.stageSurface.addEventListener("pointerdown", handleSceneTap);
DOM.introOverlay.addEventListener("pointerdown", handleSceneTap);
DOM.board.addEventListener("pointerdown", onBoardPointerDown);
window.addEventListener("touchstart", unlockAudio, { passive: true });
window.addEventListener("pointerdown", unlockAudio, { passive: true });
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", resetPressedKeys);
