const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const stills = require("../tools/stills-data.js");

const CHROME_BIN =
  process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FFMPEG_BIN = process.env.FFMPEG_BIN || "ffmpeg";
const FFPROBE_BIN = process.env.FFPROBE_BIN || "ffprobe";

const root = path.resolve(__dirname, "..");
const viewerPath = path.join(root, "tools", "stills.html");
const outputRoot = path.join(root, "marketing", "videos");
const buildRoot = path.join(os.tmpdir(), "osome-video-build");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeUnlink(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function buildFileUrl(scene, locale, orientation) {
  const url = new URL(`file://${viewerPath}`);
  url.searchParams.set("scene", scene);
  url.searchParams.set("locale", locale);
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("layout", "video");
  return url.toString();
}

function captureSceneStill(scene, locale, orientation) {
  const outDir = path.join(buildRoot, "stills", locale, orientation);
  ensureDir(outDir);
  const outFile = path.join(outDir, `${scene}.png`);
  const targetUrl = buildFileUrl(scene, locale, orientation);
  const viewport = stills.orientations[orientation];

  if (fs.existsSync(outFile)) {
    return outFile;
  }

  execFileSync(
    CHROME_BIN,
    [
      "--headless=new",
      "--disable-gpu",
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--hide-scrollbars",
      `--window-size=${viewport.width},${viewport.height}`,
      "--virtual-time-budget=5000",
      "--run-all-compositor-stages-before-draw",
      `--screenshot=${outFile}`,
      targetUrl,
    ],
    { stdio: "inherit" }
  );

  return outFile;
}

function getMovePreset(name) {
  const presets = {
    "hero-hold": { focusX: 0.5, focusY: 0.52, maxZoom: 1.06, step: 0.00045 },
    "board-push": { focusX: 0.5, focusY: 0.36, maxZoom: 1.1, step: 0.00072 },
    "board-rise": { focusX: 0.5, focusY: 0.28, maxZoom: 1.11, step: 0.00078 },
    "counter-push": { focusX: 0.5, focusY: 0.76, maxZoom: 1.1, step: 0.00076 },
  };

  return presets[name] || presets["hero-hold"];
}

function renderShotSegment({ imagePath, manifestName, index, shot, width, height, fps }) {
  const outDir = path.join(buildRoot, "segments", manifestName);
  ensureDir(outDir);
  const outFile = path.join(outDir, `${String(index + 1).padStart(2, "0")}-${shot.scene}.mp4`);
  const frames = Math.max(1, Math.round(shot.duration * fps));
  const fadeDuration = Math.min(0.28, Math.max(0.18, shot.duration * 0.05));
  const preset = getMovePreset(shot.move);
  const videoFilter = [
    `zoompan=z='min(zoom+${preset.step},${preset.maxZoom})'` +
      `:x='(iw-iw/zoom)*${preset.focusX}'` +
      `:y='(ih-ih/zoom)*${preset.focusY}'` +
      `:d=${frames}:s=${width}x${height}:fps=${fps}`,
    `trim=duration=${shot.duration}`,
    `fps=${fps}`,
    `fade=t=in:st=0:d=${fadeDuration}`,
    `fade=t=out:st=${Math.max(shot.duration - fadeDuration, 0).toFixed(3)}:d=${fadeDuration}`,
    "format=yuv420p",
  ].join(",");

  safeUnlink(outFile);
  execFileSync(
    FFMPEG_BIN,
    [
      "-y",
      "-loop",
      "1",
      "-framerate",
      String(fps),
      "-i",
      imagePath,
      "-vf",
      videoFilter,
      "-t",
      String(shot.duration),
      "-an",
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

function concatSegments({ manifestName, segmentFiles, width, height, fps }) {
  const outDir = path.join(buildRoot, "concat");
  ensureDir(outDir);
  const outFile = path.join(outDir, `${manifestName}.mp4`);
  const filter = `${segmentFiles.map((_, index) => `[${index}:v]`).join("")}concat=n=${segmentFiles.length}:v=1:a=0[vout]`;
  const args = ["-y"];

  for (const segmentFile of segmentFiles) {
    args.push("-i", segmentFile);
  }

  args.push(
    "-filter_complex",
    filter,
    "-map",
    "[vout]",
    "-r",
    String(fps),
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
    "-s",
    `${width}x${height}`,
    outFile
  );

  safeUnlink(outFile);
  execFileSync(FFMPEG_BIN, args, { stdio: "inherit" });
  return outFile;
}

function mixAudio({ manifestName, manifest, baseVideoPath, totalDuration, events }) {
  const outputDir = path.join(outputRoot, manifest.locale, manifest.orientation);
  ensureDir(outputDir);
  const outFile = path.join(outputDir, `${manifestName}.mp4`);
  const posterFile = path.join(outputDir, `${manifestName}-poster.png`);
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

function renderManifest(manifestName, manifest) {
  const viewport = stills.orientations[manifest.orientation];
  const fps = manifest.fps || 24;
  const sceneCache = new Map();
  const segmentFiles = [];
  const events = [];
  let cursor = 0;

  for (const [index, shot] of manifest.shots.entries()) {
    if (!sceneCache.has(shot.scene)) {
      sceneCache.set(
        shot.scene,
        captureSceneStill(shot.scene, manifest.locale, manifest.orientation)
      );
    }

    segmentFiles.push(
      renderShotSegment({
        imagePath: sceneCache.get(shot.scene),
        manifestName,
        index,
        shot,
        width: viewport.width,
        height: viewport.height,
        fps,
      })
    );

    for (const event of shot.sfx || []) {
      events.push({
        ...event,
        at: cursor + event.at,
      });
    }

    cursor += shot.duration;
  }

  const baseVideoPath = concatSegments({
    manifestName,
    segmentFiles,
    width: viewport.width,
    height: viewport.height,
    fps,
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

function main() {
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

  const results = targetNames.map((name) => renderManifest(name, manifests[name]));
  for (const result of results) {
    const videoStream = result.probe.streams.find((stream) => stream.width && stream.height);
    const duration = Number(result.probe.format?.duration || result.durationSec).toFixed(2);
    console.log(
      `Built ${result.name}: ${videoStream?.width || "?"}x${videoStream?.height || "?"}, ${duration}s -> ${result.video}`
    );
  }
}

main();
