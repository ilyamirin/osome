(function attachBalance(globalScope) {
  const BASE_PHASES = [
    {
      until: 15_000,
      spawn: 1_784,
      tensionMultiplier: 0.949,
      gimmicks: [],
      orderFrequencyExponent: 1.31,
      frontWeightBias: 1.25,
    },
    {
      until: 30_000,
      spawn: 1_674,
      tensionMultiplier: 0.983,
      gimmicks: [],
      orderFrequencyExponent: 1.143,
      frontWeightBias: 1.133,
    },
    {
      until: 45_000,
      spawn: 1_566,
      tensionMultiplier: 1.016,
      gimmicks: [],
      orderFrequencyExponent: 0.977,
      frontWeightBias: 1.017,
    },
    {
      until: 60_000,
      spawn: 1_457,
      tensionMultiplier: 1.05,
      gimmicks: ["quarrel"],
      orderFrequencyExponent: 0.81,
      frontWeightBias: 0.9,
    },
    {
      until: 75_000,
      spawn: 1_398,
      tensionMultiplier: 1.076,
      gimmicks: ["quarrel"],
      orderFrequencyExponent: 0.71,
      frontWeightBias: 0.81,
    },
    {
      until: 90_000,
      spawn: 1_338,
      tensionMultiplier: 1.101,
      gimmicks: ["quarrel"],
      orderFrequencyExponent: 0.61,
      frontWeightBias: 0.72,
    },
    {
      until: 105_000,
      spawn: 1_280,
      tensionMultiplier: 1.127,
      gimmicks: ["quarrel"],
      orderFrequencyExponent: 0.51,
      frontWeightBias: 0.63,
    },
    {
      until: 120_000,
      spawn: 1_221,
      tensionMultiplier: 1.152,
      gimmicks: ["quarrel"],
      orderFrequencyExponent: 0.41,
      frontWeightBias: 0.54,
    },
    {
      until: 135_000,
      spawn: 1_162,
      tensionMultiplier: 1.179,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: 0.31,
      frontWeightBias: 0.45,
    },
    {
      until: 150_000,
      spawn: 1_060,
      tensionMultiplier: 1.281,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: 0.16,
      frontWeightBias: 0.368,
    },
    {
      until: 165_000,
      spawn: 958,
      tensionMultiplier: 1.383,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: 0.01,
      frontWeightBias: 0.285,
    },
    {
      until: 180_000,
      spawn: 856,
      tensionMultiplier: 1.486,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.14,
      frontWeightBias: 0.203,
    },
    {
      until: 195_000,
      spawn: 799,
      tensionMultiplier: 1.557,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.29,
      frontWeightBias: 0.12,
    },
    {
      until: 210_000,
      spawn: 757,
      tensionMultiplier: 1.64,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.44,
      frontWeightBias: 0.095,
    },
    {
      until: 225_000,
      spawn: 715,
      tensionMultiplier: 1.722,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.59,
      frontWeightBias: 0.07,
    },
    {
      until: 240_000,
      spawn: 674,
      tensionMultiplier: 1.804,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.74,
      frontWeightBias: 0.045,
    },
    {
      until: 255_000,
      spawn: 632,
      tensionMultiplier: 1.886,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.89,
      frontWeightBias: 0.02,
    },
    {
      until: 270_000,
      spawn: 617,
      tensionMultiplier: 1.902,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -0.965,
      frontWeightBias: 0.015,
    },
    {
      until: 285_000,
      spawn: 602,
      tensionMultiplier: 1.918,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -1.04,
      frontWeightBias: 0.01,
    },
    {
      until: 300_000,
      spawn: 586,
      tensionMultiplier: 1.933,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -1.115,
      frontWeightBias: 0.005,
    },
    {
      until: Infinity,
      spawn: 571,
      tensionMultiplier: 1.949,
      gimmicks: ["quarrel", "rush"],
      orderFrequencyExponent: -1.19,
      frontWeightBias: 0,
    },
  ];

  const BALANCE_SCALING = {
    durationScale: 2.2,
    earlySpawnScale: 1.74,
    lateSpawnScale: 2.08,
    earlyTensionScale: 0.84,
    lateTensionScale: 0.92,
    lateThresholdMs: 180_000,
  };

  function scalePhases(phases, scaling) {
    return phases.map((phase) => {
      const isLate = Number.isFinite(phase.until) && phase.until > scaling.lateThresholdMs;
      const spawnScale = isLate ? scaling.lateSpawnScale : scaling.earlySpawnScale;
      const tensionScale = isLate ? scaling.lateTensionScale : scaling.earlyTensionScale;

      return {
        ...phase,
        until: Number.isFinite(phase.until)
          ? Math.round(phase.until * scaling.durationScale)
          : Infinity,
        spawn: Math.round(phase.spawn * spawnScale),
        tensionMultiplier: round(phase.tensionMultiplier * tensionScale),
      };
    });
  }

  function round(value) {
    return Math.round(value * 1_000) / 1_000;
  }

  const OSOME_BALANCE = {
    session: {
      targetDurationMs: 660_000,
      simulationHardCapMs: 900_000,
    },
    phases: scalePhases(BASE_PHASES, BALANCE_SCALING),
    orderSelection: {
      sameTypePenalty: 0.74,
    },
    adaptiveSpawn: {
      windowMs: 24_000,
      warmupMs: 6_000,
      minFactor: 0.84,
      maxFactor: 1.95,
      targetRateStart: 0.4,
      targetRateEnd: 0.94,
      throughputWeight: 1.12,
      errorWeight: 0.34,
      smoothingPerSecond: 4,
    },
    tension: {
      baseFillRate: 0.045,
      minFillRate: 0.014,
      successSlowdown: 0.009,
      successSlowdownDurationMs: 2_700,
      missSpeedup: 0.021,
      missSpeedupDurationMs: 4_800,
      calmDurationMs: 4_500,
    },
    gimmicks: {
      quarrel: {
        durationMs: 7_000,
        spreadDelayMs: 2_600,
      },
      rush: {
        durationMs: 10_000,
        spawnDivider: 2,
      },
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = OSOME_BALANCE;
  }

  globalScope.OSOME_BALANCE = OSOME_BALANCE;
})(typeof globalThis !== "undefined" ? globalThis : window);
