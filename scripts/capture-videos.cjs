const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, spawn } = require("child_process");
const stills = require("../tools/stills-data.js");

const CHROME_BIN =
  process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FFMPEG_BIN = process.env.FFMPEG_BIN || "ffmpeg";
const FFPROBE_BIN = process.env.FFPROBE_BIN || "ffprobe";

const root = path.resolve(__dirname, "..");
const gamePath = path.join(root, "index.html");
const outputRoot = path.join(root, "marketing", "videos");
const buildRoot = path.join(os.tmpdir(), "osome-video-build");
const captureFps = 12;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeUnlink(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("message", (event) => this.handleMessage(event));
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    if (!message.id) {
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending) {
      return;
    }
    this.pending.delete(message.id);
    if (message.error) {
      pending.reject(new Error(message.error.message || "CDP command failed"));
    } else {
      pending.resolve(message.result || {});
    }
  }

  send(method, params = {}, sessionId = null) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) {
      payload.sessionId = sessionId;
    }

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify(payload));
    });
  }

  close() {
    this.socket?.close();
  }
}

async function launchChrome(width, height) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "osome-promo-chrome-"));
  let chromeExit = null;
  const chrome = spawn(
    CHROME_BIN,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-sync",
      "--disable-features=MediaRouter,Translate,OptimizationHints,HttpsUpgrades",
      "--mute-audio",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--no-sandbox",
      "--no-first-run",
      "--no-default-browser-check",
      `--window-size=${width},${height}`,
      `--user-data-dir=${profileDir}`,
      "--remote-debugging-port=0",
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  chrome.once("exit", (code, signal) => {
    chromeExit = { code, signal };
  });
  const activePortFile = path.join(profileDir, "DevToolsActivePort");
  const startedAt = Date.now();
  while (!fs.existsSync(activePortFile)) {
    if (chromeExit) {
      throw new Error(
        `Chrome exited before DevTools was ready: code=${chromeExit.code}, signal=${chromeExit.signal}`
      );
    }
    if (Date.now() - startedAt > 20_000) {
      throw new Error(`Timed out waiting for ${activePortFile}`);
    }
    await sleep(50);
  }
  const [port] = fs.readFileSync(activePortFile, "utf8").trim().split(/\r?\n/);
  const metadata = await fetch(`http://127.0.0.1:${port}/json/version`).then((response) =>
    response.json()
  );
  const cdp = new CdpClient(metadata.webSocketDebuggerUrl);
  await cdp.connect();
  return { chrome, cdp, profileDir };
}

function buildGameUrl(locale) {
  const url = new URL(`file://${gamePath}`);
  url.searchParams.set("locale", locale);
  url.searchParams.set("promoCapture", "1");
  url.searchParams.set("qa", String(Date.now()));
  return url.toString();
}

function getPromoClickScript() {
  return `(() => {
    const order = document.querySelector("#active-order")?.dataset.order || "";
    const all = [...document.querySelectorAll(".cell.accessible.has-customer")];
    const matching = order && order !== "idle"
      ? all.filter((cell) => cell.dataset.type === order)
      : [];
    const targets = matching.length > 0 ? matching : all;
    const target = targets.sort((a, b) => {
      const tutorialDelta = Number(b.classList.contains("tutorial-target")) - Number(a.classList.contains("tutorial-target"));
      if (tutorialDelta) return tutorialDelta;
      return Number(a.dataset.row || 0) - Number(b.dataset.row || 0);
    })[0];
    if (!target) {
      return { clicked: false, order, cells: all.length };
    }
    const rect = target.getBoundingClientRect();
    target.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }));
    return { clicked: true, order, type: target.dataset.type, row: target.dataset.row, col: target.dataset.col };
  })()`;
}

async function recordLiveGameplay({ manifestName, manifest, width, height, durationSec }) {
  const framesDir = path.join(buildRoot, "frames", manifestName);
  const outDir = path.join(buildRoot, "live");
  const outFile = path.join(outDir, `${manifestName}.mp4`);
  ensureDir(framesDir);
  ensureDir(outDir);
  fs.rmSync(framesDir, { recursive: true, force: true });
  ensureDir(framesDir);

  const { chrome, cdp, profileDir } = await launchChrome(width, height);
  const chromeExitPromise = new Promise((resolve) => chrome.once("exit", resolve));
  let sessionId;
  try {
    const target = await cdp.send("Target.createTarget", {
      url: "about:blank",
    });
    const attached = await cdp.send("Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true,
    });
    sessionId = attached.sessionId;
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send(
      "Emulation.setDeviceMetricsOverride",
      {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: manifest.orientation === "portrait",
        screenWidth: width,
        screenHeight: height,
      },
      sessionId
    );
    await cdp.send("Page.navigate", { url: buildGameUrl(manifest.locale) }, sessionId);
    await sleep(1_000);
    await cdp.send(
      "Runtime.evaluate",
      {
        expression: `(() => {
          document.querySelector("#intro-overlay")?.dispatchEvent(new PointerEvent("pointerdown", {
            bubbles: true,
            pointerId: 1,
            pointerType: "mouse",
            clientX: innerWidth / 2,
            clientY: innerHeight / 2,
          }));
          return document.title;
        })()`,
        awaitPromise: true,
      },
      sessionId
    );
    await sleep(550);

    const frameCount = Math.max(1, Math.round(durationSec * captureFps));
    const startedAt = Date.now();
    let nextClickAt = 350;
    for (let frame = 0; frame < frameCount; frame += 1) {
      const elapsedTarget = (frame / captureFps) * 1_000;
      const delay = startedAt + elapsedTarget - Date.now();
      if (delay > 0) {
        await sleep(delay);
      }
      if (elapsedTarget >= nextClickAt) {
        await cdp
          .send(
            "Runtime.evaluate",
            {
              expression: getPromoClickScript(),
              awaitPromise: true,
              returnByValue: true,
            },
            sessionId
          )
          .catch(() => {});
        nextClickAt += manifest.clickEveryMs || 480;
      }
      const screenshot = await cdp.send(
        "Page.captureScreenshot",
        { format: "jpeg", quality: 90, fromSurface: true },
        sessionId
      );
      fs.writeFileSync(
        path.join(framesDir, `${String(frame + 1).padStart(5, "0")}.jpg`),
        Buffer.from(screenshot.data, "base64")
      );
    }
  } finally {
    await cdp.send("Browser.close").catch(() => {});
    cdp.close();
    chrome.kill("SIGTERM");
    await Promise.race([chromeExitPromise, sleep(2_000)]);
    fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }

  safeUnlink(outFile);
  execFileSync(
    FFMPEG_BIN,
    [
      "-y",
      "-framerate",
      String(captureFps),
      "-i",
      path.join(framesDir, "%05d.jpg"),
      "-r",
      String(manifest.fps || 24),
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outFile,
    ],
    { stdio: "inherit" }
  );

  return outFile;
}

function mixAudio({ manifestName, manifest, baseVideoPath, totalDuration, events }) {
  const outputOrientation = manifest.orientation === "portrait" ? "vertical" : manifest.orientation;
  const outputDir = path.join(outputRoot, manifest.locale, outputOrientation);
  ensureDir(outputDir);
  const outputName = manifest.fileName || manifestName;
  const outFile = path.join(outputDir, `${outputName}.mp4`);
  const posterFile = path.join(outputDir, `${outputName}-poster.png`);
  const musicPath = path.join(root, "assets", "audio", manifest.musicTrack);
  const args = ["-y", "-i", baseVideoPath, "-stream_loop", "-1", "-i", musicPath];
  const filters = [
    `[1:a]atrim=start=${manifest.musicStartSec || 0}:duration=${totalDuration},asetpts=PTS-STARTPTS,volume=${manifest.musicVolume || 0.08}[music]`,
  ];
  const mixInputs = ["[music]"];

  for (const [index, event] of events.entries()) {
    const inputIndex = index + 2;
    const eventPath = path.join(root, "assets", "audio", event.file);
    args.push("-i", eventPath);
    const eventVolume = ((manifest.sfxVolume || 0.8) * (event.volume || 1)).toFixed(3);
    const eventDelayMs = Math.max(0, Math.round(event.at * 1000));
    filters.push(
      `[${inputIndex}:a]atrim=0:4,asetpts=PTS-STARTPTS,volume=${eventVolume},adelay=${eventDelayMs}|${eventDelayMs}[sfx${index}]`
    );
    mixInputs.push(`[sfx${index}]`);
  }

  filters.push(
    `${mixInputs.join("")}amix=inputs=${mixInputs.length}:duration=first:dropout_transition=0[aout]`
  );

  safeUnlink(outFile);
  execFileSync(
    FFMPEG_BIN,
    [
      ...args,
      "-filter_complex",
      filters.join(";"),
      "-map",
      "0:v:0",
      "-map",
      "[aout]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      outFile,
    ],
    { stdio: "inherit" }
  );

  safeUnlink(posterFile);
  execFileSync(
    FFMPEG_BIN,
    [
      "-y",
      "-ss",
      String(Math.min(totalDuration / 2, 9.5)),
      "-i",
      outFile,
      "-frames:v",
      "1",
      "-update",
      "1",
      posterFile,
    ],
    { stdio: "inherit" }
  );

  return { outFile, posterFile };
}

function probeVideo(filePath) {
  const output = execFileSync(
    FFPROBE_BIN,
    [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_entries",
      "stream=codec_name,width,height,r_frame_rate:format=duration",
      filePath,
    ],
    { encoding: "utf8" }
  );

  return JSON.parse(output);
}

async function renderManifest(manifestName, manifest) {
  const viewport = stills.orientations[manifest.orientation];
  const events = [];
  let cursor = 0;

  for (const shot of manifest.shots) {
    for (const event of shot.sfx || []) {
      events.push({
        ...event,
        at: cursor + event.at,
      });
    }

    cursor += shot.duration;
  }

  const baseVideoPath = await recordLiveGameplay({
    manifestName,
    manifest,
    width: viewport.width,
    height: viewport.height,
    durationSec: cursor,
  });
  const result = mixAudio({
    manifestName,
    manifest,
    baseVideoPath,
    totalDuration: cursor,
    events,
  });
  const probe = probeVideo(result.outFile);

  return {
    name: manifestName,
    title: manifest.title,
    durationSec: cursor,
    video: result.outFile,
    poster: result.posterFile,
    probe,
  };
}

async function main() {
  const onlyVideo = process.argv.includes("--video")
    ? process.argv[process.argv.indexOf("--video") + 1]
    : null;
  const manifests = stills.videoManifests || {};
  const targetNames = onlyVideo ? [onlyVideo] : Object.keys(manifests);

  for (const name of targetNames) {
    if (!manifests[name]) {
      throw new Error(`Unknown video manifest: ${name}`);
    }
  }

  const results = [];
  for (const name of targetNames) {
    results.push(await renderManifest(name, manifests[name]));
  }

  for (const result of results) {
    const videoStream = result.probe.streams.find((stream) => stream.width && stream.height);
    const duration = Number(result.probe.format?.duration || result.durationSec).toFixed(2);
    console.log(
      `Built ${result.name}: ${videoStream?.width || "?"}x${videoStream?.height || "?"}, ${duration}s -> ${result.video}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
