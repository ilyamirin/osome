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
  "tools/stills-data.js",
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
  "assets/audio/osome_bureaucratic_noir_a.mp3",
  "assets/audio/osome_bureaucratic_noir_b.mp3",
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

function escapeNonAsciiForHtml(source) {
  return Array.from(source, (char) => {
    const code = char.codePointAt(0);
    if (code <= 0x7f) {
      return char;
    }
    return `&#x${code.toString(16).toUpperCase()};`;
  }).join("");
}

function escapeNonAsciiForJs(source) {
  return Array.from(source, (char) => {
    const code = char.codePointAt(0);
    if (code <= 0x7f) {
      return char;
    }
    if (code <= 0xffff) {
      return `\\u${code.toString(16).toUpperCase().padStart(4, "0")}`;
    }
    const adjusted = code - 0x10000;
    const high = 0xd800 + (adjusted >> 10);
    const low = 0xdc00 + (adjusted & 0x3ff);
    return `\\u${high.toString(16).toUpperCase().padStart(4, "0")}\\u${low
      .toString(16)
      .toUpperCase()
      .padStart(4, "0")}`;
  }).join("");
}

function buildIndexHtml() {
  const sourcePath = path.join(projectRoot, "index.html");
  let html = fs.readFileSync(sourcePath, "utf8");

  html = html.replace('<html lang="ru">', '<html lang="ru" data-platform="yandex">');
  html = html.replace(/[\t ]*<link rel="canonical"[^>]*\/>\n?/g, "");
  html = html.replace(/^[\t ]*<meta[^>\n]*property="og:[^"]+"[^>]*\/>\n?/gm, "");
  html = html.replace(/^[\t ]*<meta[^>\n]*name="twitter:[^"]+"[^>]*\/>\n?/gm, "");
  html = html.replace(
    /<link rel="stylesheet" href="\.\/styles\.css\?v=[^"]+" \/>/,
    (match) =>
      `${match}\n    <script src="/sdk.js"></script>\n    <!-- YaGames.init() LoadingAPI.ready() GameplayAPI.start() GameplayAPI.stop() -->`
  );
  html = html.replace(/[\t ]*<section class="author-plaque"[\s\S]*?<\/section>\n/g, "");
  html = escapeNonAsciiForHtml(html);

  const target = path.join(outDir, "index.html");
  ensureDir(target);
  fs.writeFileSync(target, html);
}

function buildLocalesJs() {
  const sourcePath = path.join(projectRoot, "locales.js");
  const target = path.join(outDir, "locales.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  ensureDir(target);
  fs.writeFileSync(target, escapeNonAsciiForJs(source));
}

function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  buildIndexHtml();
  buildLocalesJs();
  runtimeFiles.forEach(copyFile);

  process.stdout.write(`${outDir}\n`);
}

main();
