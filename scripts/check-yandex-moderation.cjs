#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function checkYandexBuildMetadata() {
  const result = spawnSync("node", ["./scripts/build-yandex.cjs"], {
    cwd: projectRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    fail("Yandex build failed.");
  }

  const html = read("dist/yandex-games/index.html");
  assert(
    !/https?:\/\//.test(html),
    "Yandex index.html should not keep external social/canonical URLs."
  );
}

function checkGameReadyBootOrder() {
  const game = read("game.js");
  assert(
    /function initializeYandexBoot/.test(game),
    "Yandex build should use an explicit boot sequence before enabling interaction."
  );
  assert(
    /isPlatformInteractionLocked/.test(game),
    "Yandex input handlers should block interaction until LoadingAPI.ready() has been sent."
  );
}

function checkInterstitialPlacement() {
  const game = read("game.js");
  const endGameMatch = game.match(/function endGame\(\) \{[\s\S]*?\n\}/);
  assert(endGameMatch, "Could not find endGame().");
  assert(
    !endGameMatch[0].includes("maybeShowGameOverInterstitial"),
    "Fullscreen ad should not auto-open directly from endGame()."
  );
  assert(
    /maybeShowRestartInterstitial/.test(game),
    "Fullscreen ad should be tied to an explicit restart/menu pause action."
  );
}

function checkPlatformMobileLayout() {
  const css = read("styles.css");
  assert(
    !/body\.platform-yandex \.app-shell\s*\{[^}]*height:\s*auto/s.test(css),
    "Yandex mobile layout should not release the app shell to height:auto."
  );
  assert(
    !/body\.platform-yandex \.game-panel\s*\{[^}]*overflow:\s*visible/s.test(css),
    "Yandex mobile layout should not allow game panel overflow."
  );
  assert(
    /--available-height/.test(css),
    "Yandex layout should size the scene from the available viewport height."
  );
}

function checkPromoGeneration() {
  const cuts = read("scripts/build-video-cuts.cjs");
  const promo = read("scripts/build-promo-videos.cjs");
  assert(
    !/\/Users\/|Downloads|Movies|Bandicam|sourceVideo/.test(`${cuts}\n${promo}`),
    "Promo video scripts should not depend on raw desktop/screen-recording files."
  );

  const stills = require("../tools/stills-data.js");
  const manifestLocales = new Set(
    Object.values(stills.videoManifests || {}).map((manifest) => manifest.locale)
  );
  assert(
    manifestLocales.has("en") && manifestLocales.has("ru"),
    "Promo video manifests should include both English and Russian localized outputs."
  );
}

const checks = [
  checkYandexBuildMetadata,
  checkGameReadyBootOrder,
  checkInterstitialPlacement,
  checkPlatformMobileLayout,
  checkPromoGeneration,
];

for (const check of checks) {
  check();
}

process.stdout.write("Yandex moderation checks passed.\n");
