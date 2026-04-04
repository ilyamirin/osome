const BALANCE = globalThis.OSOME_BALANCE;

const ORDER_TYPES = {
  red: {
    label: "Красная коробка",
    className: "red",
    color: "#d95c52",
    shirtTones: ["#c74c43", "#d95c52", "#e57368"],
  },
  orange: {
    label: "Оранжевая коробка",
    className: "orange",
    color: "#e28f38",
    shirtTones: ["#ca7c2f", "#e28f38", "#efab5f"],
  },
  yellow: {
    label: "Жёлтая коробка",
    className: "yellow",
    color: "#d8bd47",
    shirtTones: ["#c2aa3d", "#d8bd47", "#e7d170"],
  },
  green: {
    label: "Зелёная коробка",
    className: "green",
    color: "#4eaf66",
    shirtTones: ["#43985a", "#4eaf66", "#6bc181"],
  },
  cyan: {
    label: "Бирюзовая коробка",
    className: "cyan",
    color: "#37b1bf",
    shirtTones: ["#3099a6", "#37b1bf", "#58c3cf"],
  },
  blue: {
    label: "Синяя коробка",
    className: "blue",
    color: "#5277d4",
    shirtTones: ["#4465bb", "#5277d4", "#7092e2"],
  },
  violet: {
    label: "Фиолетовая коробка",
    className: "violet",
    color: "#8e5ccf",
    shirtTones: ["#7b4dbc", "#8e5ccf", "#a478dc"],
  },
};

const ORDER_TYPE_KEYS = Object.keys(ORDER_TYPES);

const PHASES = BALANCE.phases;
const MATCH_GROUP_MIN = 3;
const MATCH_GROUP_EXTRA_POINTS = 8;
const MATCH_GROUP_CHAIN_POINTS = 4;
const SAVE_KEY = "osome.save.v1";
const PROFILE_KEY = "osome.profile.v1";
const SAVE_VERSION = 1;
const SAVE_INTERVAL_MS = 900;
const PROFILE_BASELINE_BLEND = 0.24;
const TUTORIAL_RESUME_DELAY_MS = 2_600;

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
  intro_soft: [
    "Видишь цвет. Ищи того, кто его надел.",
    "Коробка врёт меньше людей. Смотри на цвет.",
    "На стойке ответ. В очереди проблема того же цвета.",
    "Смотри на цвет. Остальное приложится само.",
    "Цвет на стойке. Тот же цвет в очереди. Без мистики.",
    "Ничего сложного. Значит, люди всё равно справятся плохо.",
  ],
  intro_hard: [
    "Начинай заново. На этот раз попробуй глазами.",
    "Повторим. Цвет тот же, ошибки желательно нет.",
    "Смена снова здесь. Урок тоже тот же.",
    "На стойке ответ. Постарайся не воевать с ним.",
    "Смотри на цвет и не сочиняй себе новые правила.",
    "Попробуем ещё раз. Может, сегодня без позора.",
  ],
  pressure_rising: [
    "Воздух кончается.",
    "Зал начал скрипеть.",
    "Неприятности проснулись.",
    "Люди начали пахнуть спешкой.",
    "Очередь набирает дурной ход.",
    "Спокойствие отступило. Наконец.",
    "Смена разогревает ножи.",
  ],
  pressure_high: [
    "Сейчас начнут ошибаться все. Не присоединяйся.",
    "Давление выросло. Мозги бы тоже.",
    "Ещё немного, и эта смена покажет зубы.",
    "Здесь уже тесно даже мыслям.",
    "Очередь созрела для плохих решений.",
    "Напряжение стало рабочим. То есть мерзким.",
    "Сейчас слабые места выйдут на свет.",
  ],
  pressure_critical: [
    "Вот теперь не до красоты.",
    "Ещё шаг мимо, и всё рухнет.",
    "Край близко. Не моргай.",
    "Смена стоит на спичке.",
    "Ещё вдох, и зал лопнет.",
    "Теперь либо работа, либо пепел.",
    "Хаос уже кладёт руку на стойку.",
  ],
  calm: [
    "На миг отпустило.",
    "Тишина. Подозрительная, как всегда.",
    "Редкая передышка. Не привыкай.",
  ],
  pressure_recovery: [
    "Вытащил. Пока ещё можно дышать.",
    "Отползли от края. Не возвращайся.",
    "Смена передумала умирать. На минуту.",
    "Похоже, ты всё-таки не совсем бесполезен.",
  ],
  combo_3: [
    "Уже не стыдно.",
    "Появился рисунок.",
    "Наконец работа, а не паника.",
    "Первые признаки компетентности.",
    "Рука вспомнила, зачем она здесь.",
    "Пошло ровнее. Не испорть момент.",
  ],
  combo_5: [
    "Хорошо. Теперь не испорть.",
    "Ритм пойман. Держи его мёртвой хваткой.",
    "Вот так. Очередь начала уважать страх.",
    "Уже похоже на ремесло, а не на аварию.",
    "Пять подряд. Почти достойно помещения.",
    "Темп держится. Значит, мир ненадолго ослеп.",
  ],
  combo_8: [
    "Слишком чисто. Подозрительно.",
    "Красиво. Я бы не привыкал.",
    "Даже хаос иногда промахивается.",
    "Серия пошла длиннее человеческого терпения.",
    "Ты начал нравиться сканеру. Это плохой знак.",
    "Очередь дрогнула. Продолжай давить.",
  ],
  combo_dominance: [
    "Слишком уверенно. Мне это не нравится.",
    "Рука живая. Редкий случай.",
    "Почти искусство. К счастью, ненадолго.",
    "Вот теперь у очереди появился повод бояться.",
  ],
  group_3: [
    "Тройной сбор. Уже интереснее.",
    "Три сразу. Неплохо для смертного.",
    "Связка на троих. Очередь это запомнит.",
  ],
  group_4: [
    "Четверых разом. Становится красиво.",
    "Четыре за одно касание. Вот это уже аргумент.",
    "Хорошая жатва. Полю стало легче.",
  ],
  group_5: [
    "Пятеро и больше. Почти массовое исчезновение.",
    "Вот это я называю санитарной обработкой.",
    "Большая связка. Даже мне приятно.",
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
    "Промах. Зал оценил по достоинству.",
    "Не угадал. А ведь коробка молчала достаточно ясно.",
    "Неплохо. Если целью был позор.",
    "Удар в пустоту. Почерк узнаваемый.",
    "Ошибка на ровном цвете. Это талант.",
  ],
  error_streak_2: [
    "Дважды подряд. Уже похоже на систему.",
    "Ещё один такой шаг, и смена начнёт смеяться.",
    "Повторение ошибки. Мрачно, но последовательно.",
    "Вторая подряд. Значит, первая тебя ничему не научила.",
    "Ты начал спорить даже с цветами.",
    "Два промаха. Уже вырисовывается метод.",
  ],
  error_streak_3: [
    "Серия провалов собрана. Поздравлять не буду.",
    "Третий промах. Теперь это уже стиль.",
    "Ты разогнал катастрофу вручную.",
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
  bonus_chain: [
    "Слишком много подарков сразу. Подозреваю ловушку.",
    "Бонус на бонус. Мир явно отвлёкся.",
    "Сложилось красиво. Постарайся не растоптать.",
    "Вот это уже похоже на временное превосходство.",
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
  rush_end: [
    "Волна ушла. Пена осталась.",
    "Час пик сдох. Работы меньше не стало.",
    "Толпа отхлынула. Бардак нет.",
  ],
  quarrel: [
    "Конечно. Теперь ещё и драма.",
    "Очередь решила развлечься.",
    "Сцепились. Люди иначе не умеют.",
  ],
  quarrel_spread: [
    "Поползло дальше. Как плесень по стене.",
    "Ссора выросла. Люди всегда стараются.",
    "Ну вот. Драма уже на соседних клетках.",
  ],
  quarrel_cleared: [
    "Развёл их. Ненадолго.",
    "Тишина куплена в кредит.",
    "Удивительно. Кто-то здесь ещё умеет думать.",
  ],
  queue_dense: [
    "Поле забивается. Воздух дешевеет.",
    "Толпы стало многовато даже для этой дыры.",
    "Очередь налилась мясом. Работай.",
    "Свободного места почти не осталось. Как и жалости.",
    "Людей столько, будто здесь раздают спасение.",
    "Поле пухнет. Думать пора быстрее.",
    "Свободные клетки уходят как достоинство.",
    "Толпа сгустилась. Ошибаться стало дороже.",
  ],
  queue_thin: [
    "Редкий просвет. Не доверяй ему.",
    "Очередь проредилась. Значит, скоро отыграется.",
    "Полегчало. Подозрительно.",
    "Свободы стало больше. Времени нет.",
  ],
  slow_player: [
    "Шевелись. Они сами себя не разберут.",
    "Ты застыл. Очередь нет.",
    "Смотреть полезно. Делать тоже.",
    "Задумался? Они уже нет.",
    "Пауза затянулась. Работа нет.",
    "Решение созрело. Осталось нажать.",
    "Не медитируй. Здесь это лечат толпой.",
  ],
  long_silence: [
    "Слишком тихо. Мне это никогда не нравилось.",
    "Даже тишина здесь звучит как угроза.",
    "Пауза затянулась. Обычно после неё больнее.",
    "Тишина набухает. Скоро лопнет.",
    "Когда здесь спокойно, это почти всегда засада.",
    "Молчит даже зал. Значит, копит силы.",
  ],
  cameo_notice: [
    "О, городской фольклор подтянулся.",
    "Смотри-ка. Известные лица. Несчастливый знак.",
    "Публика сегодня с культурным багажом.",
    "В очередь просочился целый жанр.",
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
  rotateOverlay: document.querySelector("#rotate-overlay"),
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
  introBestScore: document.querySelector("#intro-best-score"),
};

const boardCells = [];
const FORCE_YANDEX_MODE =
  new URLSearchParams(window.location.search).get("platform") === "yandex" ||
  document.documentElement.dataset.platform === "yandex";
const state = {
  running: false,
  awaitingStart: true,
  tutorialActive: false,
  tutorialStep: null,
  tutorialType: null,
  tutorialTargetIds: new Set(),
  tutorialHintUntil: 0,
  tutorialNudgeUntil: 0,
  tutorialReadyToResume: false,
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
  catLastSpokeAt: 0,
  catLastAmbientAt: 0,
  catQueueBand: "normal",
  catLastBonusCount: 0,
  catNotedClientIds: new Set(),
  lastRoundServed: 0,
  lastRoundDurationMs: 0,
  lastPlayerActionAt: 0,
  performanceEvents: [],
  adaptiveSpawnFactor: 1,
  adaptiveSpawnAccumulatedMs: 0,
  adaptiveSpawnSampleMs: 0,
  platformPaused: false,
  lastSavedAt: 0,
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
let boardBurstResetTimer = 0;
let playerProfile = null;
const platformState = {
  sdk: null,
  initStarted: false,
  initPromise: null,
  loadingReadySent: false,
  gameplayActive: false,
  pauseReasons: new Set(),
  isYandexEnvironment: FORCE_YANDEX_MODE,
  orientationBlocked: false,
  lastInterstitialAt: -Infinity,
};

const YANDEX_INTERSTITIAL_MIN_SESSION_MS = 60_000;
const YANDEX_INTERSTITIAL_COOLDOWN_MS = 120_000;

function createEmptyBoard() {
  return Array.from({ length: 5 }, () => Array(4).fill(null));
}

function createDefaultProfile() {
  return {
    version: SAVE_VERSION,
    sessionsPlayed: 0,
    bestScore: 0,
    hasCompletedFirstTapTutorial: false,
    preferredSpawnBaseline: 1,
    soundEnabled: true,
    lastPlayedAt: 0,
  };
}

function clampPreferredSpawnBaseline(value) {
  return clamp(
    value,
    BALANCE.adaptiveSpawn.minFactor,
    Math.min(1.2, BALANCE.adaptiveSpawn.maxFactor)
  );
}

function loadProfile() {
  const fallback = createDefaultProfile();
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      preferredSpawnBaseline: clampPreferredSpawnBaseline(
        parsed.preferredSpawnBaseline ?? fallback.preferredSpawnBaseline
      ),
    };
  } catch (error) {
    console.warn("Could not load player profile.", error);
    return fallback;
  }
}

function saveProfile() {
  if (!playerProfile) {
    return;
  }

  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(playerProfile));
  } catch (error) {
    console.warn("Could not save player profile.", error);
  }
}

function clearSavedRun() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn("Could not clear saved run.", error);
  }
}

function getProfileSpawnBaseline() {
  return clampPreferredSpawnBaseline(playerProfile?.preferredSpawnBaseline ?? 1);
}

function getRemainingMs(until, now) {
  if (!until) {
    return 0;
  }
  if (until === Infinity) {
    return "infinity";
  }
  return Math.max(0, Math.round(until - now));
}

function restoreUntil(remaining, now) {
  if (remaining === "infinity") {
    return Infinity;
  }
  if (!remaining) {
    return 0;
  }
  return now + remaining;
}

function serializeClient(client, now) {
  return {
    id: client.id,
    type: client.type,
    quote: client.quote,
    angryRemainingMs: getRemainingMs(client.angryUntil, now),
    accessAgeMs:
      client.enteredAccessAt === null
        ? null
        : Math.max(0, Math.round(now - client.enteredAccessAt)),
    skin: client.skin,
    hair: client.hair,
    shirt: client.shirt,
    shoe: client.shoe,
    accessoryTone: client.accessoryTone,
    bodyType: client.bodyType,
    posture: client.posture,
    hairType: client.hairType,
    topType: client.topType,
    accessory: client.accessory,
    idleType: client.idleType,
    persona: client.persona,
  };
}

function restoreClient(snapshot, now) {
  return {
    ...snapshot,
    angryUntil: restoreUntil(snapshot.angryRemainingMs, now),
    enteredAccessAt: snapshot.accessAgeMs === null ? null : now - Math.max(0, snapshot.accessAgeMs),
  };
}

function serializeBoard(now) {
  return state.board.map((row) =>
    row.map((client) => (client ? serializeClient(client, now) : null))
  );
}

function restoreBoard(boardSnapshot, now) {
  return boardSnapshot.map((row) =>
    row.map((client) => (client ? restoreClient(client, now) : null))
  );
}

function serializeRunSnapshot(now = performance.now()) {
  if (!state.running) {
    return null;
  }

  return {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    state: {
      tutorialActive: state.tutorialActive,
      tutorialStep: state.tutorialStep,
      tutorialType: state.tutorialType,
      tutorialTargetIds: [...state.tutorialTargetIds],
      tutorialHintRemainingMs: getRemainingMs(state.tutorialHintUntil, now),
      tutorialNudgeRemainingMs: getRemainingMs(state.tutorialNudgeUntil, now),
      tutorialReadyToResume: state.tutorialReadyToResume,
      board: serializeBoard(now),
      score: state.score,
      served: state.served,
      combo: state.combo,
      maxCombo: state.maxCombo,
      sessionMs: state.sessionMs,
      spawnAccumulator: state.spawnAccumulator,
      tension: state.tension,
      calmRemainingMs: getRemainingMs(state.calmUntil, now),
      accessRows: state.accessRows,
      firstFivePerfect: state.firstFivePerfect,
      totalErrors: state.totalErrors,
      consecutiveErrors: state.consecutiveErrors,
      slowdowns: state.slowdowns.map((endsAt) => getRemainingMs(endsAt, now)).filter(Boolean),
      speedups: state.speedups.map((endsAt) => getRemainingMs(endsAt, now)).filter(Boolean),
      perfectRow: state.perfectRow ? { ...state.perfectRow } : null,
      flowRemainingMs: getRemainingMs(state.flowUntil, now),
      fastAccessRemainingMs: getRemainingMs(state.fastAccessUntil, now),
      antiStressReady: state.antiStressReady,
      gimmick: state.gimmick,
      gimmickRemainingMs: getRemainingMs(state.gimmickUntil, now),
      quarrelSpreadRemainingMs: getRemainingMs(state.quarrelSpreadAt, now),
      quarrelCells: state.quarrelCells.map((cell) => ({ ...cell })),
      rushRemainingMs: getRemainingMs(state.rushUntil, now),
      currentOrder: state.currentOrder,
      activeSpeakerId: state.activeSpeakerId,
      activeSpeechText: state.activeSpeechText,
      speechRemainingMs: getRemainingMs(state.speechSwitchAt, now),
      catSpeechText: state.catSpeechText,
      catSpeechRemainingMs: getRemainingMs(state.catSpeechUntil, now),
      catSpeechCooldownRemainingMs: getRemainingMs(state.catSpeechCooldownUntil, now),
      catSpeechPriority: state.catSpeechPriority,
      catLastLineByCategory: { ...state.catLastLineByCategory },
      catLineDecks: JSON.parse(JSON.stringify(state.catLineDecks)),
      catPressureTier: state.catPressureTier,
      catLastSpokeAgeMs: Math.max(0, Math.round(now - state.catLastSpokeAt)),
      catLastAmbientAgeMs: Math.max(0, Math.round(now - state.catLastAmbientAt)),
      catQueueBand: state.catQueueBand,
      catLastBonusCount: state.catLastBonusCount,
      catNotedClientIds: [...state.catNotedClientIds],
      lastPlayerActionAgeMs: Math.max(0, Math.round(now - state.lastPlayerActionAt)),
      performanceEvents: state.performanceEvents.map((event) => ({
        ageMs: Math.max(0, Math.round(now - event.at)),
        served: event.served,
        errors: event.errors,
      })),
      adaptiveSpawnFactor: state.adaptiveSpawnFactor,
      adaptiveSpawnAccumulatedMs: state.adaptiveSpawnAccumulatedMs,
      adaptiveSpawnSampleMs: state.adaptiveSpawnSampleMs,
      lastId: state.lastId,
    },
  };
}

function persistRunSnapshot(force = false, now = performance.now()) {
  if (!state.running) {
    clearSavedRun();
    return;
  }

  if (!force && now - state.lastSavedAt < SAVE_INTERVAL_MS) {
    return;
  }

  const snapshot = serializeRunSnapshot(now);
  if (!snapshot) {
    return;
  }

  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    state.lastSavedAt = now;
  } catch (error) {
    console.warn("Could not save run snapshot.", error);
  }
}

function loadRunSnapshot() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return null;
    }

    const snapshot = JSON.parse(raw);
    if (snapshot?.version !== SAVE_VERSION || !snapshot.state?.board) {
      return null;
    }
    return snapshot;
  } catch (error) {
    console.warn("Could not load run snapshot.", error);
    return null;
  }
}

function shouldShowFirstTapTutorial() {
  return !playerProfile?.hasCompletedFirstTapTutorial;
}

function updateProfileFromSession() {
  if (state.sessionMs < 20_000 || state.adaptiveSpawnSampleMs <= 0) {
    return;
  }

  const sessionMean = state.adaptiveSpawnAccumulatedMs / state.adaptiveSpawnSampleMs;
  playerProfile.preferredSpawnBaseline = clampPreferredSpawnBaseline(
    playerProfile.preferredSpawnBaseline * (1 - PROFILE_BASELINE_BLEND) +
      sessionMean * PROFILE_BASELINE_BLEND
  );
  playerProfile.sessionsPlayed += 1;
  playerProfile.lastPlayedAt = Date.now();
  saveProfile();
}

function renderBestScore() {
  if (!DOM.introBestScore) {
    return;
  }

  DOM.introBestScore.textContent = `Лучший результат: ${formatNumber(playerProfile?.bestScore || 0)}`;
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
  state.tutorialActive = false;
  state.tutorialStep = null;
  state.tutorialType = null;
  state.tutorialTargetIds = new Set();
  state.tutorialHintUntil = 0;
  state.tutorialNudgeUntil = 0;
  state.tutorialReadyToResume = false;
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
  state.catLastSpokeAt = 0;
  state.catLastAmbientAt = 0;
  state.catQueueBand = "normal";
  state.catLastBonusCount = 0;
  state.catNotedClientIds = new Set();
  state.lastPlayerActionAt = performance.now();
  state.performanceEvents = [];
  state.adaptiveSpawnFactor = getProfileSpawnBaseline();
  state.adaptiveSpawnAccumulatedMs = 0;
  state.adaptiveSpawnSampleMs = 0;
  state.lastSavedAt = 0;
  state.lastFrame = 0;
}

function setStandby() {
  if (state.running) {
    updateProfileFromSession();
  }
  state.running = false;
  state.awaitingStart = true;
  state.tutorialActive = false;
  state.tutorialStep = null;
  state.tutorialType = null;
  state.tutorialTargetIds = new Set();
  state.tutorialHintUntil = 0;
  state.tutorialNudgeUntil = 0;
  state.tutorialReadyToResume = false;
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
  state.catLastSpokeAt = 0;
  state.catLastAmbientAt = 0;
  state.catQueueBand = "normal";
  state.catLastBonusCount = 0;
  state.catNotedClientIds = new Set();
  state.performanceEvents = [];
  state.adaptiveSpawnFactor = getProfileSpawnBaseline();
  state.adaptiveSpawnAccumulatedMs = 0;
  state.adaptiveSpawnSampleMs = 0;
  state.lastSavedAt = 0;
  state.lastFrame = 0;
  DOM.overlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  DOM.introOverlay.classList.remove("hidden");
  clearSavedRun();
  speakCat("standby", { priority: 2, bypassCooldown: true, durationMs: 2600 });
  syncPlatformGameplayState();
  render();
}

function createTutorialOpeningBoard() {
  const tutorialType = "green";
  const distractors = ["red", "violet", "orange"];
  const board = createEmptyBoard();
  const targets = [
    createClient(tutorialType),
    createClient(tutorialType),
    createClient(tutorialType),
  ];
  const wrongClient = createClient(sample(distractors));
  board[0][0] = targets[0];
  board[0][1] = targets[1];
  board[0][2] = targets[2];
  board[0][3] = wrongClient;

  return {
    board,
    tutorialType,
    targetIds: targets.map((client) => client.id),
  };
}

function startTutorialGame() {
  unlockAudio();
  resetRoundState();
  DOM.overlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  DOM.introOverlay.classList.add("hidden");

  const tutorial = createTutorialOpeningBoard();
  state.board = tutorial.board;
  state.currentOrder = tutorial.tutorialType;
  state.tutorialActive = true;
  state.tutorialStep = "match";
  state.tutorialType = tutorial.tutorialType;
  state.tutorialTargetIds = new Set(tutorial.targetIds);
  state.lastPlayerActionAt = performance.now();

  render();
  syncPlatformGameplayState();
  requestAnimationFrame(loop);
}

function finishTutorialOnboarding(now) {
  if (!state.tutorialActive) {
    return;
  }

  state.tutorialActive = false;
  state.tutorialStep = null;
  state.tutorialType = null;
  state.tutorialTargetIds = new Set();
  state.tutorialHintUntil = 0;
  state.tutorialNudgeUntil = 0;
  state.tutorialReadyToResume = false;
  state.activeSpeakerId = null;
  state.activeSpeechText = "";
  state.activeSpeechPlacement = null;
  state.speechSwitchAt = 0;
  playerProfile.hasCompletedFirstTapTutorial = true;
  saveProfile();

  if (getAccessibleClients().length < 3) {
    spawnClient();
    spawnClient();
    syncCurrentOrder(true);
  }

  state.lastPlayerActionAt = now;
  speakCat(getIntroCategory(), { priority: 3, bypassCooldown: true, durationMs: 2400 });
}

function startGame() {
  if (shouldShowFirstTapTutorial()) {
    startTutorialGame();
    return;
  }

  unlockAudio();
  resetRoundState();
  DOM.overlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  DOM.introOverlay.classList.add("hidden");
  spawnClient();
  syncCurrentOrder(true);
  state.lastPlayerActionAt = performance.now();
  speakCat(getIntroCategory(), { priority: 4, bypassCooldown: true, durationMs: 2800 });
  render();
  syncPlatformGameplayState();
  requestAnimationFrame(loop);
}

function endGame() {
  state.running = false;
  updateProfileFromSession();
  if (playerProfile && state.score > (playerProfile.bestScore || 0)) {
    playerProfile.bestScore = state.score;
    saveProfile();
  }
  state.lastRoundServed = state.served;
  state.lastRoundDurationMs = state.sessionMs;
  DOM.resultScore.textContent = formatNumber(state.score);
  DOM.resultServed.textContent = formatNumber(state.served);
  DOM.resultMaxCombo.textContent = `x${state.maxCombo}`;
  DOM.resultTime.textContent = formatTime(state.sessionMs);
  DOM.overlay.classList.remove("hidden");
  document.body.classList.add("overlay-open");
  clearSavedRun();
  speakCat("game_over", { priority: 6, bypassCooldown: true, durationMs: 2800 });
  pushToast("Смена окончена. Очередь уперлась в стойку.");
  playFx("fail");
  syncPlatformGameplayState();
  maybeShowGameOverInterstitial();
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

function recordPerformanceEvent(kind, servedCount = 0) {
  const now = performance.now();
  state.performanceEvents.push({
    at: now,
    served: kind === "serve" ? servedCount : 0,
    errors: kind === "miss" ? 1 : 0,
  });
}

function prunePerformanceEvents(now) {
  const windowMs = BALANCE.adaptiveSpawn.windowMs;
  state.performanceEvents = state.performanceEvents.filter((event) => now - event.at <= windowMs);
}

function getAdaptiveSpawnTarget(now) {
  const config = BALANCE.adaptiveSpawn;
  if (state.sessionMs < config.warmupMs) {
    return 1;
  }

  prunePerformanceEvents(now);
  const activeWindowMs = Math.max(6_000, Math.min(config.windowMs, state.sessionMs));
  const windowSeconds = activeWindowMs / 1_000;
  const served = state.performanceEvents.reduce((sum, event) => sum + event.served, 0);
  const errors = state.performanceEvents.reduce((sum, event) => sum + event.errors, 0);
  const servedPerSecond = served / windowSeconds;
  const errorsPerSecond = errors / windowSeconds;
  const progress = clamp(state.sessionMs / BALANCE.session.targetDurationMs, 0, 1);
  const targetRate =
    config.targetRateStart + (config.targetRateEnd - config.targetRateStart) * progress;
  const throughputDelta = (servedPerSecond - targetRate) / Math.max(0.25, targetRate);

  return clamp(
    1 + throughputDelta * config.throughputWeight - errorsPerSecond * config.errorWeight,
    config.minFactor,
    config.maxFactor
  );
}

function updateAdaptiveSpawn(dt, now) {
  const config = BALANCE.adaptiveSpawn;
  const target = getAdaptiveSpawnTarget(now);
  const alpha = 1 - Math.exp(-dt * config.smoothingPerSecond);
  state.adaptiveSpawnFactor += (target - state.adaptiveSpawnFactor) * alpha;
  state.adaptiveSpawnAccumulatedMs += state.adaptiveSpawnFactor * dt * 1_000;
  state.adaptiveSpawnSampleMs += dt * 1_000;
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

function getConnectedMatchCells(startRow, startCol, type) {
  if (startRow >= state.accessRows) {
    return [];
  }

  const cluster = [];
  const queue = [{ row: startRow, col: startCol }];
  const visited = new Set();

  while (queue.length > 0) {
    const cell = queue.shift();
    const key = `${cell.row}:${cell.col}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    if (cell.row < 0 || cell.row >= state.accessRows || cell.col < 0 || cell.col >= 4) {
      continue;
    }

    const client = state.board[cell.row]?.[cell.col];
    if (!client || client.type !== type) {
      continue;
    }

    cluster.push(cell);
    queue.push(
      { row: cell.row - 1, col: cell.col },
      { row: cell.row + 1, col: cell.col },
      { row: cell.row, col: cell.col - 1 },
      { row: cell.row, col: cell.col + 1 }
    );
  }

  return cluster;
}

function isQuarrelCell(row, col) {
  return state.quarrelCells.some((cell) => cell.row === row && cell.col === col);
}

function handleCellTap(row, col) {
  if (!state.running) {
    return;
  }
  const now = performance.now();
  state.lastPlayerActionAt = now;

  const client = state.board[row]?.[col];
  if (!client) {
    return;
  }

  if (state.tutorialActive) {
    if (state.tutorialStep !== "match") {
      return;
    }

    if (client.type !== state.tutorialType || !state.tutorialTargetIds.has(client.id)) {
      state.tutorialNudgeUntil = now + 1_300;
      render();
      return;
    }
  }

  const fromQuarrel = isQuarrelCell(row, col);

  if (client.type === state.currentOrder) {
    serveClient(row, col, fromQuarrel);
    return;
  }

  if (fromQuarrel) {
    serveClient(row, col, true);
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
  recordPerformanceEvent("miss");
  state.combo = 0;
  state.firstFivePerfect = false;
  state.perfectRow = null;
  state.speedups.push(now + BALANCE.tension.missSpeedupDurationMs);

  if (state.consecutiveErrors === 3) {
    state.antiStressReady = true;
    speakCat("anti_stress_ready", { priority: 5, bypassCooldown: true, durationMs: 2600 });
  } else if (state.consecutiveErrors > 3) {
    speakCat("error_streak_3", { priority: 5, bypassCooldown: true, durationMs: 2400 });
  } else if (state.consecutiveErrors === 2) {
    speakCat("error_streak_2", { priority: 4, bypassCooldown: true, durationMs: 2200 });
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

  const connected = getConnectedMatchCells(row, col, client.type);
  const servedCells =
    client.type === state.currentOrder && connected.length >= MATCH_GROUP_MIN
      ? connected
      : [{ row, col }];
  const servedCount = servedCells.length;
  const clearsQuarrel =
    fromQuarrel || servedCells.some((cell) => isQuarrelCell(cell.row, cell.col));
  const groupBonus =
    servedCount >= MATCH_GROUP_MIN
      ? (servedCount - 1) * MATCH_GROUP_EXTRA_POINTS +
        (servedCount - MATCH_GROUP_MIN + 1) * MATCH_GROUP_CHAIN_POINTS
      : 0;

  state.combo += 1;
  state.maxCombo = Math.max(state.maxCombo, state.combo);
  state.served += servedCount;
  state.consecutiveErrors = 0;
  recordPerformanceEvent("serve", servedCount);

  let points = 10 + (state.combo - 1) * 5;
  if (client.enteredAccessAt && now - client.enteredAccessAt <= 2_000) {
    points += 3;
  }
  points += groupBonus;
  if (now < state.flowUntil) {
    points = Math.round(points * 1.5);
  }
  if (state.antiStressReady) {
    points += 15;
    state.antiStressReady = false;
    speakCat("anti_stress_spent", { priority: 4, durationMs: 2400 });
    pushToast("Антистресс сработал: +15");
  }
  if (clearsQuarrel) {
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
  } else if (state.combo === 10 || state.combo === 15) {
    speakCat("combo_dominance", { priority: 4, durationMs: 2400 });
  }

  for (let index = 0; index < servedCount; index += 1) {
    trackPerfectRow(client.type);
  }

  const touchedColumns = new Set();
  for (const cell of servedCells) {
    state.board[cell.row][cell.col] = null;
    touchedColumns.add(cell.col);
  }
  [...touchedColumns].forEach((touchedCol) => collapseColumn(touchedCol));
  updateAccessTimers();
  syncCurrentOrder(true);

  if (state.tutorialActive && state.tutorialStep === "match") {
    state.tutorialStep = "group_tip";
    state.tutorialTargetIds = new Set();
    state.tutorialHintUntil = now + TUTORIAL_RESUME_DELAY_MS;
    state.tutorialReadyToResume = true;
  }

  if (servedCount >= MATCH_GROUP_MIN) {
    if (servedCount >= 5) {
      speakCat("group_5", { priority: 6, bypassCooldown: true, durationMs: 2400 });
    } else if (servedCount === 4) {
      speakCat("group_4", { priority: 5, bypassCooldown: true, durationMs: 2400 });
    } else {
      speakCat("group_3", { priority: 5, bypassCooldown: true, durationMs: 2200 });
    }
    pushToast(`Связка x${servedCount}: бонус за группу.`);
    triggerBoardBurst();
    playFx("bonus");
    vibrate([18, 28, 18]);
  } else {
    playFx("success");
    vibrate([14]);
  }
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

  const activeBonusCount = getActiveBonusCount(now);
  if (activeBonusCount >= 2 && state.catLastBonusCount < 2) {
    speakCat("bonus_chain", { priority: 4, durationMs: 2400 });
  }
  state.catLastBonusCount = activeBonusCount;

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
  const finishedGimmick = state.gimmick;
  if (message) {
    pushToast(message);
  }
  if (state.gimmick === "quarrel") {
    clearQuarrel();
  }
  state.gimmick = null;
  state.gimmickUntil = 0;
  state.rushUntil = 0;
  if (finishedGimmick === "rush") {
    speakCat("rush_end", { priority: 3, durationMs: 2200 });
  }
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
  if (expanded.length > 2) {
    speakCat("quarrel_spread", { priority: 4, durationMs: 2200 });
  }
}

function clearQuarrel() {
  state.quarrelCells = [];
}

function updateTutorialState(now) {
  if (!state.tutorialActive) {
    return;
  }

  if (
    state.tutorialStep === "group_tip" &&
    state.tutorialReadyToResume &&
    now >= state.tutorialHintUntil
  ) {
    finishTutorialOnboarding(now);
  }
}

function restoreRunSnapshot(snapshot) {
  const now = performance.now();
  const restored = snapshot?.state;
  if (!restored) {
    return false;
  }

  resetRoundState();
  state.running = true;
  state.awaitingStart = false;
  state.tutorialActive = Boolean(restored.tutorialActive);
  state.tutorialStep = restored.tutorialStep || null;
  state.tutorialType = restored.tutorialType || null;
  state.tutorialTargetIds = new Set(restored.tutorialTargetIds || []);
  state.tutorialHintUntil = restoreUntil(restored.tutorialHintRemainingMs, now);
  state.tutorialNudgeUntil = restoreUntil(restored.tutorialNudgeRemainingMs, now);
  state.tutorialReadyToResume = Boolean(restored.tutorialReadyToResume);
  state.board = restoreBoard(restored.board, now);
  state.score = restored.score || 0;
  state.served = restored.served || 0;
  state.combo = restored.combo || 0;
  state.maxCombo = restored.maxCombo || 0;
  state.sessionMs = restored.sessionMs || 0;
  state.spawnAccumulator = restored.spawnAccumulator || 0;
  state.tension = restored.tension || 0;
  state.calmUntil = restoreUntil(restored.calmRemainingMs, now);
  state.accessRows = restored.accessRows || 1;
  state.firstFivePerfect = restored.firstFivePerfect !== false;
  state.totalErrors = restored.totalErrors || 0;
  state.consecutiveErrors = restored.consecutiveErrors || 0;
  state.slowdowns = (restored.slowdowns || []).map((value) => restoreUntil(value, now));
  state.speedups = (restored.speedups || []).map((value) => restoreUntil(value, now));
  state.perfectRow = restored.perfectRow ? { ...restored.perfectRow } : null;
  state.flowUntil = restoreUntil(restored.flowRemainingMs, now);
  state.fastAccessUntil = restoreUntil(restored.fastAccessRemainingMs, now);
  state.antiStressReady = Boolean(restored.antiStressReady);
  state.gimmick = restored.gimmick || null;
  state.gimmickUntil = restoreUntil(restored.gimmickRemainingMs, now);
  state.quarrelSpreadAt = restoreUntil(restored.quarrelSpreadRemainingMs, now);
  state.quarrelCells = (restored.quarrelCells || []).map((cell) => ({ ...cell }));
  state.rushUntil = restoreUntil(restored.rushRemainingMs, now);
  state.currentOrder = restored.currentOrder || null;
  state.activeSpeakerId = restored.activeSpeakerId || null;
  state.activeSpeechText = restored.activeSpeechText || "";
  state.activeSpeechPlacement = null;
  state.speechSwitchAt = restoreUntil(restored.speechRemainingMs, now);
  state.catSpeechText = restored.catSpeechText || "";
  state.catSpeechUntil = restoreUntil(restored.catSpeechRemainingMs, now);
  state.catSpeechCooldownUntil = restoreUntil(restored.catSpeechCooldownRemainingMs, now);
  state.catSpeechPriority = restored.catSpeechPriority || 0;
  state.catLastLineByCategory = restored.catLastLineByCategory || {};
  state.catLineDecks = restored.catLineDecks || {};
  state.catPressureTier = restored.catPressureTier || 0;
  state.catLastSpokeAt = now - (restored.catLastSpokeAgeMs || 0);
  state.catLastAmbientAt = now - (restored.catLastAmbientAgeMs || 0);
  state.catQueueBand = restored.catQueueBand || "normal";
  state.catLastBonusCount = restored.catLastBonusCount || 0;
  state.catNotedClientIds = new Set(restored.catNotedClientIds || []);
  state.lastPlayerActionAt = now - (restored.lastPlayerActionAgeMs || 0);
  state.performanceEvents = (restored.performanceEvents || []).map((event) => ({
    at: now - (event.ageMs || 0),
    served: event.served || 0,
    errors: event.errors || 0,
  }));
  state.adaptiveSpawnFactor = restored.adaptiveSpawnFactor || getProfileSpawnBaseline();
  state.adaptiveSpawnAccumulatedMs = restored.adaptiveSpawnAccumulatedMs || 0;
  state.adaptiveSpawnSampleMs = restored.adaptiveSpawnSampleMs || 0;
  state.lastId = restored.lastId || state.lastId;
  state.lastSavedAt = 0;
  state.lastFrame = 0;

  DOM.overlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  DOM.introOverlay.classList.add("hidden");
  render();
  syncPlatformGameplayState();
  requestAnimationFrame(loop);
  return true;
}

function updateSpawn(dt, now) {
  const phase = getPhase();
  const activeRush = now < state.rushUntil;
  updateAdaptiveSpawn(dt, now);
  const adaptiveInterval = phase.spawn / state.adaptiveSpawnFactor;
  const interval = activeRush
    ? adaptiveInterval / BALANCE.gimmicks.rush.spawnDivider
    : adaptiveInterval;

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

  if (isRuntimePaused()) {
    state.lastFrame = timestamp;
    render();
    requestAnimationFrame(loop);
    return;
  }

  if (state.lastFrame === 0) {
    state.lastFrame = timestamp;
  }

  const dt = Math.min(0.05, (timestamp - state.lastFrame) / 1_000);
  state.lastFrame = timestamp;

  if (state.tutorialActive) {
    updateTutorialState(timestamp);
    updateToasts(timestamp);
    updateMusic(timestamp);
    render();
    persistRunSnapshot(false, timestamp);
    if (state.running) {
      requestAnimationFrame(loop);
    }
    return;
  }

  state.sessionMs += dt * 1_000;

  updateBonuses(timestamp);
  updateSpawn(dt, timestamp);
  updateTension(dt, timestamp);
  spreadQuarrel(timestamp);
  updateCatAmbient(timestamp);
  updateToasts(timestamp);
  updateMusic(timestamp);
  render();
  persistRunSnapshot(false, timestamp);

  if (state.running) {
    requestAnimationFrame(loop);
  }
}

function render() {
  const now = performance.now();
  updateActiveSpeech(now);
  updateCatSpeech(now);
  renderBestScore();

  if (DOM.score) {
    DOM.score.textContent = formatNumber(state.score);
  }
  const counterScoreText = formatCounterScore(state.score);
  const counterDigits = counterScoreText.length;
  DOM.counterScore.textContent = counterScoreText;
  DOM.counterScore.classList.toggle("is-compact", counterDigits >= 5);
  DOM.counterScore.classList.toggle("is-tight", counterDigits >= 6);
  DOM.counterScore.classList.toggle("is-ultra", counterDigits >= 7);
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
  DOM.stageSurface.classList.toggle("is-tutorial", state.tutorialActive);
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
    if (client && state.tutorialActive && state.tutorialTargetIds.has(client.id)) {
      cell.classList.add("tutorial-target");
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
  return String(normalized);
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

function getBoardClientCount() {
  let count = 0;
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      if (state.board[row][col]) {
        count += 1;
      }
    }
  }
  return count;
}

function getActiveBonusCount(now) {
  let count = 0;
  if (now < state.flowUntil) {
    count += 1;
  }
  if (now < state.fastAccessUntil) {
    count += 1;
  }
  if (state.antiStressReady) {
    count += 1;
  }
  if (state.perfectRow) {
    count += 1;
  }
  return count;
}

function getIntroCategory() {
  const shortLastRun =
    state.lastRoundServed > 0 &&
    (state.lastRoundServed < 10 || state.lastRoundDurationMs < 110_000);
  return shortLastRun ? "intro_hard" : "intro_soft";
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
  state.catLastSpokeAt = now;
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
  if (nextTier > 0 && previousTier > nextTier) {
    speakCat("pressure_recovery", { priority: 3, durationMs: 2200 });
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

function updateCatAmbient(now) {
  if (!state.running || state.gimmick) {
    return;
  }

  const boardCount = getBoardClientCount();
  const accessible = getAccessibleClients();
  const nextQueueBand =
    boardCount >= 11 ? "dense" : boardCount <= 4 && state.served >= 3 ? "thin" : "normal";

  if (nextQueueBand !== state.catQueueBand) {
    state.catQueueBand = nextQueueBand;
    if (nextQueueBand === "dense") {
      if (speakCat("queue_dense", { priority: 2, durationMs: 2200, cooldownMs: 7000 })) {
        state.catLastAmbientAt = now;
        return;
      }
    } else if (nextQueueBand === "thin") {
      if (speakCat("queue_thin", { priority: 2, durationMs: 2200, cooldownMs: 7000 })) {
        state.catLastAmbientAt = now;
        return;
      }
    }
  }

  const notableAccessible = accessible.find(
    ({ client }) => client.persona !== "generic" && !state.catNotedClientIds.has(client.id)
  );
  if (notableAccessible && now - state.catLastAmbientAt > 5_000) {
    state.catNotedClientIds.add(notableAccessible.client.id);
    if (speakCat("cameo_notice", { priority: 2, durationMs: 2200, cooldownMs: 7000 })) {
      state.catLastAmbientAt = now;
      return;
    }
  }

  if (
    accessible.length > 0 &&
    now - state.lastPlayerActionAt > 7_500 &&
    now - state.catLastAmbientAt > 7_500
  ) {
    if (speakCat("slow_player", { priority: 2, durationMs: 2200, cooldownMs: 8000 })) {
      state.catLastAmbientAt = now;
      return;
    }
  }

  if (
    now - state.catLastSpokeAt > 14_000 &&
    boardCount >= 6 &&
    now - state.catLastAmbientAt > 9_000
  ) {
    if (speakCat("long_silence", { priority: 1, durationMs: 2400, cooldownMs: 9000 })) {
      state.catLastAmbientAt = now;
    }
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

  if (state.tutorialActive) {
    if (state.tutorialStep === "match") {
      const targetCandidate = getAccessibleClients().find((candidate) =>
        state.tutorialTargetIds.has(candidate.client.id)
      );
      const text =
        now < state.tutorialNudgeUntil
          ? "Не этот. Ищи клиента цвета коробки."
          : "Смотри на цвет коробки. Нажми на такого же клиента.";

      state.activeSpeakerId = targetCandidate?.client.id || null;
      state.activeSpeechText = text;
      state.activeSpeechPlacement = targetCandidate
        ? findSafeDialoguePlacement(targetCandidate, text)
        : null;
      return;
    }

    if (state.tutorialStep === "group_tip") {
      state.activeSpeakerId = null;
      state.activeSpeechText = "Если рядом трое одного цвета, они уйдут все.";
      state.activeSpeechPlacement = null;
      return;
    }
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
  DOM.activeOrderBadge.className = `active-order-badge ${order.className} ${state.tutorialActive ? "is-tutorial" : ""}`;
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

function isMobileDevice() {
  return window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
}

function isLandscapeOrientation() {
  return window.innerWidth > window.innerHeight;
}

function isOrientationBlocked() {
  return platformState.isYandexEnvironment && isMobileDevice() && isLandscapeOrientation();
}

function isRuntimePaused() {
  return platformState.pauseReasons.size > 0;
}

function applyPlatformMode() {
  document.body.classList.toggle("platform-yandex", platformState.isYandexEnvironment);
}

function pauseAllAudioPlayback() {
  for (const media of audioState.activeMediaFx) {
    media.pause();
    media.currentTime = 0;
  }

  if (audioState.ctx && audioState.ctx.state === "running") {
    void audioState.ctx.suspend().catch(() => {});
  }
}

function resumeAudioPlayback() {
  if (audioState.enabled && audioState.ctx && audioState.ctx.state === "suspended") {
    void audioState.ctx.resume().catch(() => {});
  }
}

function syncPlatformGameplayState() {
  if (!platformState.sdk) {
    return;
  }

  const shouldBeActive =
    state.running && !isRuntimePaused() && DOM.overlay.classList.contains("hidden");
  if (shouldBeActive === platformState.gameplayActive) {
    return;
  }

  platformState.gameplayActive = shouldBeActive;
  if (shouldBeActive) {
    platformState.sdk.features?.GameplayAPI?.start?.();
  } else {
    platformState.sdk.features?.GameplayAPI?.stop?.();
  }
}

function addPauseReason(reason) {
  const sizeBefore = platformState.pauseReasons.size;
  platformState.pauseReasons.add(reason);
  state.platformPaused = platformState.pauseReasons.size > 0;
  if (sizeBefore === 0 && state.platformPaused) {
    state.lastFrame = 0;
    pauseAllAudioPlayback();
    persistRunSnapshot(true);
  }
  syncPlatformGameplayState();
}

function removePauseReason(reason) {
  const hadReason = platformState.pauseReasons.delete(reason);
  state.platformPaused = platformState.pauseReasons.size > 0;
  if (hadReason && !state.platformPaused) {
    state.lastFrame = 0;
    resumeAudioPlayback();
  }
  syncPlatformGameplayState();
}

function syncOrientationGuard() {
  platformState.orientationBlocked = isOrientationBlocked();
  DOM.rotateOverlay.classList.toggle("hidden", !platformState.orientationBlocked);
  if (platformState.orientationBlocked) {
    addPauseReason("orientation");
  } else {
    removePauseReason("orientation");
  }
}

function applyPlatformLanguage(ysdk) {
  const lang = ysdk?.environment?.i18n?.lang;
  if (!lang) {
    return;
  }

  document.documentElement.lang = String(lang).slice(0, 2);
}

function requestFullscreenIfPossible() {
  if (!platformState.isYandexEnvironment || !isMobileDevice()) {
    return;
  }

  const root = document.documentElement;
  const requestFullscreen =
    root.requestFullscreen ||
    root.webkitRequestFullscreen ||
    root.mozRequestFullScreen ||
    root.msRequestFullscreen;

  if (typeof requestFullscreen === "function" && !document.fullscreenElement) {
    try {
      requestFullscreen.call(root);
    } catch (error) {
      void error;
    }
  }
}

function markPlatformReady() {
  if (!platformState.sdk || platformState.loadingReadySent) {
    return;
  }

  if (platformState.sdk.features?.LoadingAPI?.ready) {
    platformState.sdk.features.LoadingAPI.ready();
  }
  platformState.loadingReadySent = true;
}

function shouldShowGameOverInterstitial(now = performance.now()) {
  if (!platformState.sdk?.adv?.showFullscreenAdv) {
    return false;
  }

  if (state.sessionMs < YANDEX_INTERSTITIAL_MIN_SESSION_MS) {
    return false;
  }

  if (now - platformState.lastInterstitialAt < YANDEX_INTERSTITIAL_COOLDOWN_MS) {
    return false;
  }

  return true;
}

function maybeShowGameOverInterstitial() {
  const now = performance.now();
  if (!shouldShowGameOverInterstitial(now)) {
    return;
  }

  showPlatformInterstitialAd("game-over", {
    onShown: () => {
      platformState.lastInterstitialAt = now;
    },
    onFinished: () => {
      if (!state.running && !state.awaitingStart) {
        setStandby();
      }
    },
  });
}

function showPlatformInterstitialAd(reason = "transition", options = {}) {
  const adv = platformState.sdk?.adv;
  if (!adv?.showFullscreenAdv) {
    options.onFinished?.(false);
    return;
  }

  let wasShown = false;
  try {
    adv.showFullscreenAdv({
      callbacks: {
        onOpen: () => {
          wasShown = true;
          addPauseReason(`ad:${reason}`);
          options.onShown?.();
        },
        onClose: () => {
          removePauseReason(`ad:${reason}`);
          options.onFinished?.(wasShown);
        },
        onError: () => {
          removePauseReason(`ad:${reason}`);
          options.onFinished?.(false);
        },
      },
    });
  } catch (error) {
    console.warn("Could not show Yandex fullscreen ad.", error);
    removePauseReason(`ad:${reason}`);
    options.onFinished?.(false);
  }
}

async function loadYandexSDKScript() {
  if (window.YaGames) {
    return window.YaGames;
  }

  const existing = document.querySelector('script[data-yandex-sdk="true"]');
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(window.YaGames), { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/sdk.js";
    script.async = true;
    script.dataset.yandexSdk = "true";
    script.onload = () => resolve(window.YaGames);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function attachYandexPauseHandlers(ysdk) {
  ysdk.on?.("game_api_pause", () => {
    addPauseReason("sdk");
  });
  ysdk.on?.("game_api_resume", () => {
    removePauseReason("sdk");
  });
}

async function initYandexPlatform() {
  if (platformState.initPromise) {
    return platformState.initPromise;
  }

  platformState.initStarted = true;
  platformState.initPromise = loadYandexSDKScript()
    .then((YaGames) => {
      if (!YaGames?.init) {
        return null;
      }
      return YaGames.init();
    })
    .then((ysdk) => {
      if (!ysdk) {
        return null;
      }

      platformState.sdk = ysdk;
      platformState.isYandexEnvironment = true;
      applyPlatformMode();
      applyPlatformLanguage(ysdk);
      attachYandexPauseHandlers(ysdk);
      syncOrientationGuard();
      markPlatformReady();
      syncPlatformGameplayState();
      return ysdk;
    })
    .catch((error) => {
      console.warn("Could not initialize Yandex Games SDK.", error);
      return null;
    });

  return platformState.initPromise;
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

function triggerBoardBurst() {
  if (!DOM.stageSurface) {
    return;
  }
  if (boardBurstResetTimer) {
    clearTimeout(boardBurstResetTimer);
  }
  DOM.stageSurface.classList.remove("board-burst");
  void DOM.stageSurface.offsetWidth;
  DOM.stageSurface.classList.add("board-burst");
  boardBurstResetTimer = window.setTimeout(() => {
    DOM.stageSurface.classList.remove("board-burst");
    boardBurstResetTimer = 0;
  }, 380);
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
  return (
    isMobileAudioContext() &&
    !platformState.isYandexEnvironment &&
    audioState.mediaElements.size > 0
  );
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
  if (playerProfile) {
    playerProfile.soundEnabled = audioState.enabled;
    saveProfile();
  }
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
  if (platformState.isYandexEnvironment) {
    void initYandexPlatform();
  }
  if (platformState.orientationBlocked) {
    return;
  }
  requestFullscreenIfPossible();
  if (state.awaitingStart && DOM.overlay.classList.contains("hidden")) {
    startGame();
  }
}

function onBoardPointerDown(event) {
  unlockAudio();
  if (platformState.orientationBlocked) {
    return;
  }
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
playerProfile = loadProfile();
audioState.enabled = playerProfile.soundEnabled !== false;
syncMusicToggle();
applyPlatformMode();
syncOrientationGuard();
void initYandexPlatform();

const restoredRun = loadRunSnapshot();
if (!restoreRunSnapshot(restoredRun)) {
  setStandby();
}

DOM.restartButton.addEventListener("click", startGame);
DOM.menuButton.addEventListener("click", setStandby);
DOM.musicToggle.addEventListener("click", toggleMusic);
DOM.stageSurface.addEventListener("pointerdown", handleSceneTap);
DOM.introOverlay.addEventListener("pointerdown", handleSceneTap);
DOM.board.addEventListener("pointerdown", onBoardPointerDown);
DOM.stageSurface.addEventListener("contextmenu", (event) => event.preventDefault());
DOM.board.addEventListener("contextmenu", (event) => event.preventDefault());
DOM.stageSurface.addEventListener("selectstart", (event) => event.preventDefault());
window.addEventListener("touchstart", unlockAudio, { passive: true });
window.addEventListener("pointerdown", unlockAudio, { passive: true });
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", resetPressedKeys);
window.addEventListener("pagehide", () => persistRunSnapshot(true));
window.addEventListener("resize", syncOrientationGuard);
window.addEventListener("orientationchange", syncOrientationGuard);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    persistRunSnapshot(true);
    addPauseReason("visibility");
  } else {
    removePauseReason("visibility");
  }
});
