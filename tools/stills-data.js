(function initOsomeStills(globalScope) {
  const avatar = (overrides) => ({
    skin: "#ddb08a",
    hair: "#2d2320",
    shoe: "#223445",
    accessoryTone: "#46586a",
    bodyType: "slim",
    posture: "upright",
    hairType: "short",
    topType: "shirt",
    accessory: "backpack",
    idleType: "calm",
    persona: "generic",
    ...overrides,
  });

  const AVATARS = {
    runner: avatar({
      bodyType: "slim",
      posture: "upright",
      hairType: "short",
      accessory: "backpack",
    }),
    aunt: avatar({
      skin: "#c78d65",
      hair: "#6f533f",
      shoe: "#45362e",
      accessoryTone: "#8a6145",
      bodyType: "broad",
      posture: "upright",
      hairType: "bun",
      topType: "coat",
      accessory: "shopper",
      idleType: "calm",
      persona: "service-aunt",
    }),
    hoodie: avatar({
      hair: "#21181a",
      shoe: "#20262a",
      accessoryTone: "#51667a",
      bodyType: "slim",
      posture: "slouch",
      hairType: "hood",
      topType: "hoodie",
      accessory: "backpack",
      idleType: "fidget",
      persona: "it-hoodie",
    }),
    neo: avatar({
      hair: "#191416",
      shoe: "#191f24",
      accessoryTone: "#2d3338",
      bodyType: "slim",
      posture: "upright",
      hairType: "short",
      topType: "coat",
      accessory: "phone",
      idleType: "calm",
      persona: "neo",
    }),
    cap: avatar({
      skin: "#8f6244",
      hair: "#241d1b",
      shoe: "#1c2328",
      bodyType: "average",
      posture: "lean",
      hairType: "cap",
      topType: "hoodie",
      accessory: "none",
      idleType: "fidget",
      persona: "gopnik",
    }),
    shopper: avatar({
      skin: "#f3d0b0",
      hair: "#7b5b46",
      shoe: "#3f332e",
      accessoryTone: "#6d5f4d",
      bodyType: "average",
      posture: "upright",
      hairType: "bob",
      topType: "coat",
      accessory: "shopper",
      idleType: "shift",
      persona: "generic",
    }),
    clerk: avatar({
      skin: "#ddb08a",
      hair: "#5b4032",
      shoe: "#3f332e",
      accessoryTone: "#4a3b34",
      bodyType: "broad",
      posture: "lean",
      hairType: "bun",
      topType: "coat",
      accessory: "shopper",
      idleType: "calm",
      persona: "bureaucrat",
    }),
    punk: avatar({
      skin: "#c78d65",
      hair: "#1b171d",
      shoe: "#222d39",
      accessoryTone: "#485a72",
      bodyType: "slim",
      posture: "lean",
      hairType: "bob",
      topType: "coat",
      accessory: "phone",
      idleType: "shift",
      persona: "punk",
    }),
  };

  function client(avatarName, type, options) {
    return {
      avatar: avatarName,
      type,
      mood: "queue",
      angry: false,
      ...options,
    };
  }

  function row(a, b, c, d) {
    return [a || null, b || null, c || null, d || null];
  }

  const scenes = {
    cluster_burst: {
      title: "Cluster Burst",
      subtitle: "A five-cell color group is one tap away from blowing a hole through the crowd.",
      badge: "Scene 01",
      footer:
        "This is the new hero frame for Osome: the player instantly sees the active parcel color, the connected match, and the payoff for reading the board correctly.",
      board: [
        row(null, client("shopper", "yellow"), client("hoodie", "cyan"), client("punk", "violet")),
        row(
          client("runner", "green"),
          client("clerk", "green"),
          client("aunt", "orange"),
          client("neo", "red")
        ),
        row(
          client("cap", "blue"),
          client("shopper", "green"),
          client("runner", "green"),
          client("aunt", "yellow")
        ),
        row(
          client("clerk", "orange"),
          client("hoodie", "green"),
          client("punk", "blue"),
          client("shopper", "cyan")
        ),
        row(
          client("neo", "red"),
          client("aunt", "orange"),
          client("runner", "violet"),
          client("cap", "green")
        ),
      ],
      score: 15640,
      served: 48,
      combo: 7,
      maxCombo: 11,
      sessionMs: 173000,
      tension: 0.44,
      currentOrder: "green",
      flow: true,
      notifications: ["toastFlowStart", { key: "toastGroupBonus", params: { count: 5 } }],
      catSpeech: {
        ru: "Вот это уже работа. Забирай всю связку.",
        en: "That’s the move. Take the whole cluster.",
        tr: "İşte hamle bu. Tüm grubu tekte al.",
      },
    },
    perfect_row: {
      title: "Perfect Row",
      subtitle: "A full bottom line of one color sits ready for a clean, greedy pickup streak.",
      badge: "Scene 02",
      footer:
        "The perfect-row still should feel tempting: orderly, readable, and just disciplined enough to promise a huge reward if the player does not flinch.",
      board: [
        row(
          client("runner", "orange"),
          client("aunt", "yellow"),
          client("hoodie", "red"),
          client("shopper", "cyan")
        ),
        row(
          client("punk", "violet"),
          client("runner", "blue"),
          client("clerk", "green"),
          client("neo", "orange")
        ),
        row(
          client("shopper", "yellow"),
          client("aunt", "orange"),
          client("runner", "blue"),
          client("hoodie", "cyan")
        ),
        row(
          client("clerk", "green"),
          client("punk", "blue"),
          client("neo", "violet"),
          client("shopper", "red")
        ),
        row(
          client("runner", "blue"),
          client("aunt", "blue"),
          client("hoodie", "blue"),
          client("cap", "blue")
        ),
      ],
      score: 18320,
      served: 57,
      combo: 5,
      maxCombo: 10,
      sessionMs: 221000,
      tension: 0.57,
      currentOrder: "blue",
      notifications: ["toastPerfectRowSpotted"],
      catSpeech: {
        ru: "Редкая роскошь. Чистый ряд. Не испорть.",
        en: "A rare luxury. Clean row. Don’t waste it.",
        tr: "Nadir bir lüks. Tertemiz sıra. Bozma.",
      },
    },
    rush_crush: {
      title: "Rush Crush",
      subtitle:
        "The board is jammed, rush hour is live, and the orange match is still barely reachable.",
      badge: "Scene 03",
      footer:
        "This is the pressure shot for the new balance: dense board, active rush, and just enough matching structure to keep the player hopeful instead of lost.",
      board: [
        row(
          client("aunt", "orange", { angry: true }),
          client("runner", "blue"),
          client("hoodie", "yellow"),
          client("shopper", "red")
        ),
        row(
          client("clerk", "orange"),
          client("punk", "orange"),
          client("neo", "cyan"),
          client("cap", "green")
        ),
        row(
          client("shopper", "yellow"),
          client("runner", "orange"),
          client("hoodie", "red"),
          client("aunt", "blue")
        ),
        row(
          client("punk", "red"),
          client("clerk", "violet"),
          client("cap", "green"),
          client("runner", "cyan")
        ),
        row(
          client("neo", "yellow"),
          client("hoodie", "violet"),
          client("shopper", "orange"),
          client("aunt", "red")
        ),
      ],
      score: 21490,
      served: 66,
      combo: 4,
      maxCombo: 12,
      sessionMs: 298000,
      tension: 0.86,
      currentOrder: "orange",
      rush: true,
      notifications: ["toastRush"],
      speaker: {
        row: 0,
        col: 0,
        text: {
          ru: "Если это снова не мой заказ, я начну светиться от злости.",
          en: "If this still isn’t mine, I’m going incandescent.",
          tr: "Bu yine benim değilse artık sinirden parlayacağım.",
        },
      },
    },
    quarrel_lock: {
      title: "Quarrel Lock",
      subtitle: "Two blocked cells cut through a live blue setup and force a risky recovery.",
      badge: "Scene 04",
      footer:
        "The quarrel frame should read immediately even without motion: locked cells, visible argument, and the active parcel color still leading the eye.",
      board: [
        row(
          client("runner", "green"),
          client("punk", "blue"),
          client("aunt", "orange"),
          client("hoodie", "red")
        ),
        row(
          client("shopper", "blue"),
          client("cap", "yellow"),
          client("clerk", "green"),
          client("neo", "blue")
        ),
        row(
          client("punk", "violet"),
          client("clerk", "blue", { angry: true }),
          client("aunt", "orange", { angry: true }),
          client("runner", "cyan")
        ),
        row(
          client("shopper", "yellow"),
          client("hoodie", "blue"),
          client("neo", "red"),
          client("aunt", "orange")
        ),
        row(
          client("runner", "blue"),
          client("clerk", "green"),
          client("cap", "blue"),
          client("punk", "violet")
        ),
      ],
      score: 11980,
      served: 34,
      combo: 3,
      maxCombo: 8,
      sessionMs: 157000,
      tension: 0.72,
      currentOrder: "blue",
      gimmick: "quarrel",
      quarrelCells: [
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
      notifications: ["toastQuarrel"],
      speaker: {
        row: 2,
        col: 1,
        text: {
          ru: "Я за коробкой пришёл, а не в театр у стойки.",
          en: "I came for a box, not ringside seats to this drama.",
          tr: "Ben kutu almaya geldim, tezgâh başı tiyatrosuna değil.",
        },
      },
    },
    shift_over: {
      title: "Shift Over",
      subtitle: "The board is packed, the run is dead, and the loss overlay takes the whole room.",
      badge: "Scene 05",
      footer:
        "This is the end-state still for storefront use: the queue wins, the room remains visible behind the glass, and the failure message owns the frame.",
      board: [
        row(
          client("runner", "orange"),
          client("aunt", "red"),
          client("hoodie", "yellow"),
          client("shopper", "green")
        ),
        row(
          client("clerk", "yellow"),
          client("neo", "blue"),
          client("punk", "violet"),
          client("cap", "orange")
        ),
        row(
          client("shopper", "cyan"),
          client("runner", "green"),
          client("hoodie", "yellow"),
          client("aunt", "red")
        ),
        row(
          client("punk", "blue"),
          client("clerk", "orange"),
          client("cap", "yellow"),
          client("runner", "violet")
        ),
        row(
          client("neo", "green"),
          client("hoodie", "cyan"),
          client("shopper", "red"),
          client("aunt", "orange")
        ),
      ],
      score: 27110,
      served: 79,
      combo: 0,
      maxCombo: 15,
      sessionMs: 348000,
      tension: 1,
      currentOrder: "red",
      notifications: ["toastGameOver"],
      showOverlay: true,
      catSpeech: {
        ru: "Смена закончилась громко. Очередь была в настроении.",
        en: "The shift ended loudly. The line was in a mood.",
        tr: "Vardiya gürültülü bitti. Kuyruğun keyfi yerindeydi.",
      },
    },
  };

  const payload = {
    locales: ["ru", "en", "tr"],
    orientations: {
      landscape: { width: 1920, height: 1080 },
      portrait: { width: 1080, height: 1920 },
    },
    sceneOrder: ["cluster_burst", "perfect_row", "rush_crush", "quarrel_lock", "shift_over"],
    avatars: AVATARS,
    scenes,
  };

  globalScope.OSOME_STILLS = payload;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = payload;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
