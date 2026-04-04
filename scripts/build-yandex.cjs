const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "dist", "yandex-games");

const runtimeFiles = [
  ".nojekyll",
  "balance-config.js",
  "favicon.svg",
  "game.js",
  "styles.css",
  "assets/brand/osome-mark-o-horns.svg",
  "assets/icons/food-apple.svg",
  "assets/icons/home-house.svg",
  "assets/icons/tech-cable.svg",
  "assets/icons/wear-shirt.svg",
  "assets/audio/bonus_levelup.mp3",
  "assets/audio/confirmation_002.mp3",
  "assets/audio/error_005.mp3",
  "assets/audio/fail_gameover.mp3",
  "assets/audio/open_001.mp3",
  "assets/audio/question_002.mp3",
];

function ensureDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function copyFile(relativePath) {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(outDir, relativePath);
  ensureDir(target);
  fs.copyFileSync(source, target);
}

function buildIndexHtml() {
  const sourcePath = path.join(projectRoot, "index.html");
  let html = fs.readFileSync(sourcePath, "utf8");

  html = html.replace('<html lang="ru">', '<html lang="ru" data-platform="yandex">');
  html = html.replace(
    '<link rel="stylesheet" href="./styles.css?v=20260401b" />',
    '<link rel="stylesheet" href="./styles.css?v=20260401b" />\n    <script src="/sdk.js"></script>\n    <!-- YaGames.init() LoadingAPI.ready() GameplayAPI.start() GameplayAPI.stop() -->'
  );
  html = html.replace(/[\t ]*<section class="author-plaque"[\s\S]*?<\/section>\n/g, "");

  const target = path.join(outDir, "index.html");
  ensureDir(target);
  fs.writeFileSync(target, html);
}

function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  buildIndexHtml();
  runtimeFiles.forEach(copyFile);

  process.stdout.write(`${outDir}\n`);
}

main();
