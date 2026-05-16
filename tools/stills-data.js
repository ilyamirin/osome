(function initQueueStills(globalScope) {
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
      subtitle:
        "A huge green cluster is one tap away from tearing a clean opening through the queue.",
      badge: "Scene 01",
      footer:
        "This should be the hero storefront frame: one glance tells the player what the parcel color is, where the cluster is, and why clearing groups feels powerful.",
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
          client("punk", "green"),
          client("shopper", "cyan")
        ),
        row(
          client("neo", "red"),
          client("aunt", "orange"),
          client("runner", "green"),
          client("cap", "green")
        ),
      ],
      score: 18620,
      served: 53,
      combo: 8,
      maxCombo: 12,
      sessionMs: 188000,
      tension: 0.58,
      currentOrder: "green",
      flow: true,
      notifications: ["toastFlowStart", { key: "toastGroupBonus", params: { count: 6 } }],
      catSpeech: {
        ru: "Вот это ход. Забирай всю зелёную связку.",
        en: "That’s the move. Take the whole green cluster.",
        tr: "İşte hamle bu. Tüm yeşil grubu tekte al.",
      },
    },
    anti_stress_save: {
      title: "Anti-Stress Save",
      subtitle:
        "The safety net just fired, the combo is gone, and one tight red clear keeps the shift alive.",
      badge: "Scene 02",
      footer:
        "This frame sells recovery under pressure: a recent mistake, a visible anti-stress bounce, and one obvious follow-up move before the board collapses.",
      board: [
        row(
          client("runner", "orange"),
          client("aunt", "yellow"),
          client("hoodie", "cyan"),
          client("shopper", "green")
        ),
        row(
          client("punk", "violet"),
          client("runner", "red"),
          client("clerk", "green"),
          client("neo", "orange")
        ),
        row(
          client("shopper", "yellow"),
          client("aunt", "red"),
          client("runner", "blue"),
          client("hoodie", "cyan")
        ),
        row(
          client("clerk", "green"),
          client("punk", "red"),
          client("neo", "violet"),
          client("shopper", "orange")
        ),
        row(
          client("runner", "blue"),
          client("aunt", "yellow"),
          client("hoodie", "red", { angry: true }),
          client("cap", "orange")
        ),
      ],
      score: 20510,
      served: 61,
      combo: 0,
      maxCombo: 10,
      sessionMs: 244000,
      tension: 0.79,
      currentOrder: "red",
      antiStressReady: true,
      notifications: ["toastAntiStress", { key: "toastGroupBonus", params: { count: 3 } }],
      catSpeech: {
        ru: "Один срыв тебе простили. Дальше без подарков.",
        en: "One collapse got forgiven. No more gifts after this.",
        tr: "Bir çöküş affedildi. Bundan sonrası hediyesiz.",
      },
    },
    rush_crush: {
      title: "Rush Crush",
      subtitle:
        "Rush hour is live, the board is crammed, and the orange clear is barely still reachable.",
      badge: "Scene 03",
      footer:
        "This is the pressure shot: dense board, active rush, a live customer quote, and just enough structure to promise a way out if the player reacts fast.",
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
      score: 23140,
      served: 71,
      combo: 4,
      maxCombo: 12,
      sessionMs: 327000,
      tension: 0.9,
      currentOrder: "orange",
      rush: true,
      notifications: ["toastRush", "toastFastAccess"],
      speaker: {
        row: 0,
        col: 0,
        text: {
          ru: "Если это опять не мой заказ, я начну выдавать жалобы сериями.",
          en: "If this still isn't mine, I'm filing complaints in batches.",
          tr: "Bu yine benim değilse şikâyetleri seri üretime alacağım.",
        },
      },
      catSpeech: {
        ru: "Час пик. Или берёшь оранжевую связку, или тонешь красиво.",
        en: "Rush hour. Either you take the orange cluster, or you drown elegantly.",
        tr: "Yoğun saat. Ya turuncu kümeyi alırsın ya da zarifçe batarsın.",
      },
    },
    quarrel_lock: {
      title: "Quarrel Lock",
      subtitle:
        "Two blocked cells slice through the blue setup and force a risky cleanup under noise.",
      badge: "Scene 04",
      footer:
        "The quarrel frame should read instantly even without motion: locked cells, visible argument, and the active parcel color still pushing the eye toward the answer.",
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
      score: 14260,
      served: 39,
      combo: 3,
      maxCombo: 8,
      sessionMs: 201000,
      tension: 0.78,
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
          ru: "Я за коробкой пришёл, а не на премьеру ссор у стойки.",
          en: "I came for a box, not opening night at the counter.",
          tr: "Ben kutu almaya geldim, tezgâh başı prömiyere değil.",
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

  function makeVideoManifest(locale, orientation, fileName, options) {
    return {
      locale,
      orientation,
      fileName,
      fps: 24,
      transitionSec: 0.35,
      ...options,
    };
  }

  function addLocalizedVideoManifests(target, key, fileName, options) {
    for (const locale of ["ru", "en"]) {
      target[`${key}_${locale}`] = makeVideoManifest(locale, options.orientation, fileName, {
        ...options,
      });
    }
  }

  const clusterPowerShots = [
    {
      scene: "cluster_burst",
      duration: 5.8,
      move: "board-push",
      sfx: [{ file: "confirmation_002.mp3", at: 2.6, volume: 0.72 }],
    },
    {
      scene: "cluster_burst",
      duration: 4.8,
      move: "hero-hold",
      sfx: [{ file: "bonus_levelup.mp3", at: 1.4, volume: 0.82 }],
    },
    {
      scene: "cluster_burst",
      duration: 5.2,
      move: "counter-push",
      sfx: [{ file: "confirmation_002.mp3", at: 2.7, volume: 0.74 }],
    },
    {
      scene: "cluster_burst",
      duration: 6.1,
      move: "board-rise",
      sfx: [{ file: "bonus_levelup.mp3", at: 2.1, volume: 0.86 }],
    },
  ];

  const pressureSaveShots = [
    {
      scene: "rush_crush",
      duration: 5.8,
      move: "board-rise",
      sfx: [{ file: "question_002.mp3", at: 1.3, volume: 0.52 }],
    },
    {
      scene: "rush_crush",
      duration: 5.0,
      move: "counter-push",
      sfx: [{ file: "error_005.mp3", at: 2.0, volume: 0.72 }],
    },
    {
      scene: "anti_stress_save",
      duration: 5.2,
      move: "hero-hold",
      sfx: [{ file: "bonus_levelup.mp3", at: 1.1, volume: 0.88 }],
    },
    {
      scene: "anti_stress_save",
      duration: 5.6,
      move: "board-push",
      sfx: [{ file: "confirmation_002.mp3", at: 2.5, volume: 0.76 }],
    },
  ];

  const queueCollapseShots = [
    {
      scene: "quarrel_lock",
      duration: 5.6,
      move: "board-push",
      sfx: [{ file: "question_002.mp3", at: 1.5, volume: 0.5 }],
    },
    {
      scene: "rush_crush",
      duration: 4.8,
      move: "board-rise",
      sfx: [{ file: "error_005.mp3", at: 2.3, volume: 0.72 }],
    },
    {
      scene: "quarrel_lock",
      duration: 5.1,
      move: "counter-push",
      sfx: [{ file: "confirmation_002.mp3", at: 2.0, volume: 0.64 }],
    },
    {
      scene: "shift_over",
      duration: 6.2,
      move: "hero-hold",
      sfx: [{ file: "fail_gameover.mp3", at: 1.7, volume: 0.92 }],
    },
  ];

  const videoManifests = {};

  addLocalizedVideoManifests(videoManifests, "vertical_puzzle", "parcel-queue-puzzle-cut", {
    title: "Cluster Power",
    orientation: "portrait",
    musicTrack: "osome_bureaucratic_noir_a.mp3",
    musicStartSec: 7,
    musicVolume: 0.08,
    sfxVolume: 0.78,
    shots: clusterPowerShots,
  });

  addLocalizedVideoManifests(videoManifests, "vertical_pressure", "parcel-queue-pressure-cut", {
    title: "Pressure Save",
    orientation: "portrait",
    musicTrack: "osome_bureaucratic_noir_b.mp3",
    musicStartSec: 4,
    musicVolume: 0.082,
    sfxVolume: 0.8,
    shots: pressureSaveShots,
  });

  addLocalizedVideoManifests(videoManifests, "landscape_gameplay", "parcel-queue-gameplay-cut", {
    title: "Cluster Gameplay",
    orientation: "landscape",
    musicTrack: "osome_bureaucratic_noir_a.mp3",
    musicStartSec: 7,
    musicVolume: 0.08,
    sfxVolume: 0.78,
    shots: clusterPowerShots.slice(0, 3),
  });

  addLocalizedVideoManifests(videoManifests, "landscape_puzzle", "parcel-queue-promo-puzzle", {
    title: "Cluster Power",
    orientation: "landscape",
    musicTrack: "osome_bureaucratic_noir_a.mp3",
    musicStartSec: 7,
    musicVolume: 0.08,
    sfxVolume: 0.78,
    shots: clusterPowerShots,
  });

  addLocalizedVideoManifests(
    videoManifests,
    "landscape_escalation",
    "parcel-queue-promo-escalation",
    {
      title: "Queue Collapse",
      orientation: "landscape",
      musicTrack: "osome_bureaucratic_noir_b.mp3",
      musicStartSec: 16,
      musicVolume: 0.084,
      sfxVolume: 0.82,
      transitionSec: 0.42,
      shots: queueCollapseShots,
    }
  );

  const payload = {
    locales: ["ru", "en", "tr"],
    orientations: {
      landscape: { width: 1920, height: 1080 },
      portrait: { width: 1080, height: 1920 },
    },
    sceneOrder: ["cluster_burst", "anti_stress_save", "rush_crush", "quarrel_lock", "shift_over"],
    videoManifests,
    avatars: AVATARS,
    scenes,
  };

  globalScope.OSOME_STILLS = payload;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = payload;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
