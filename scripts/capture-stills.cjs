const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const stills = require("../tools/stills-data.js");

const CHROME_BIN =
  process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const root = path.resolve(__dirname, "..");
const viewerPath = path.join(root, "tools", "stills.html");
const outputRoot = path.join(root, "marketing", "screens-clean");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function buildFileUrl(scene, locale, orientation) {
  const url = new URL(`file://${viewerPath}`);
  url.searchParams.set("scene", scene);
  url.searchParams.set("locale", locale);
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("layout", "clean");
  return url.toString();
}

function captureScreenshot(scene, locale, orientation) {
  const viewport = stills.orientations[orientation];
  if (!viewport) {
    throw new Error(`Unknown orientation: ${orientation}`);
  }

  const outDir = path.join(outputRoot, locale, orientation);
  ensureDir(outDir);
  const outFile = path.join(outDir, `${scene}.png`);
  const targetUrl = buildFileUrl(scene, locale, orientation);

  execFileSync(
    CHROME_BIN,
    [
      "--headless=new",
      "--disable-gpu",
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--hide-scrollbars",
      "--window-size=" + `${viewport.width},${viewport.height}`,
      "--virtual-time-budget=5000",
      "--run-all-compositor-stages-before-draw",
      `--screenshot=${outFile}`,
      targetUrl,
    ],
    { stdio: "inherit" }
  );

  return outFile;
}

function main() {
  const onlyScene = process.argv.includes("--scene")
    ? process.argv[process.argv.indexOf("--scene") + 1]
    : null;
  const onlyLocale = process.argv.includes("--locale")
    ? process.argv[process.argv.indexOf("--locale") + 1]
    : null;
  const onlyOrientation = process.argv.includes("--orientation")
    ? process.argv[process.argv.indexOf("--orientation") + 1]
    : null;

  const scenes = onlyScene ? [onlyScene] : stills.sceneOrder;
  const locales = onlyLocale ? [onlyLocale] : stills.locales;
  const orientations = onlyOrientation ? [onlyOrientation] : Object.keys(stills.orientations);

  const generated = [];
  for (const scene of scenes) {
    if (!stills.scenes[scene]) {
      throw new Error(`Unknown scene: ${scene}`);
    }
    for (const locale of locales) {
      for (const orientation of orientations) {
        generated.push(captureScreenshot(scene, locale, orientation));
      }
    }
  }

  console.log(`Generated ${generated.length} screenshots.`);
}

main();
