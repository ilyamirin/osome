#!/usr/bin/env node

const { mkdirSync } = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const downloadsDir = path.resolve("/Users/ilyagmirin/Downloads");
const outputDir = path.join(projectRoot, "marketing", "videos", "ru", "vertical");

const sources = {
  709: path.join(downloadsDir, "13070070909646.mp4"),
  705: path.join(downloadsDir, "13070070516430.mp4"),
  699: path.join(downloadsDir, "13070069992142.mp4"),
  787: path.join(downloadsDir, "13070078773966.mp4"),
};

const audio = {
  noirA: path.join(projectRoot, "assets", "audio", "osome_bureaucratic_noir_a.mp3"),
  noirB: path.join(projectRoot, "assets", "audio", "osome_bureaucratic_noir_b.mp3"),
  open: path.join(projectRoot, "assets", "audio", "open_001.mp3"),
  question: path.join(projectRoot, "assets", "audio", "question_002.mp3"),
  confirm: path.join(projectRoot, "assets", "audio", "confirmation_002.mp3"),
  bonus: path.join(projectRoot, "assets", "audio", "bonus_levelup.mp3"),
  fail: path.join(projectRoot, "assets", "audio", "fail_gameover.mp3"),
};

const sharedVideoFilter =
  "crop=592:1052:0:94,scale=720:1280:flags=lanczos,fps=30,eq=contrast=1.03:saturation=1.02:brightness=0.01,unsharp=5:5:0.35:5:5:0.0";

const outputs = [
  {
    file: "parcel-queue-pressure-cut.mp4",
    music: { file: audio.noirB, volume: 0.18 },
    segments: [
      { src: "699", start: 0.8, end: 4.1 },
      { src: "709", start: 0.3, end: 4.9 },
      { src: "787", start: 0.4, end: 6.5 },
      { src: "709", start: 5.3, end: 9.6 },
      { src: "787", start: 9.4, end: 14.2 },
    ],
    sfx: [
      { file: audio.open, at: 0.22, volume: 0.55 },
      { file: audio.question, at: 4.9, volume: 0.32 },
      { file: audio.confirm, at: 8.3, volume: 0.48 },
      { file: audio.confirm, at: 12.0, volume: 0.42 },
      { file: audio.bonus, at: 17.2, volume: 0.3 },
      { file: audio.fail, at: 20.5, volume: 0.16 },
    ],
  },
  {
    file: "parcel-queue-puzzle-cut.mp4",
    music: { file: audio.noirA, volume: 0.17 },
    segments: [
      { src: "705", start: 0.5, end: 3.5 },
      { src: "699", start: 1.0, end: 4.8 },
      { src: "699", start: 5.0, end: 8.7 },
      { src: "705", start: 7.7, end: 10.9 },
      { src: "709", start: 9.6, end: 13.1 },
      { src: "787", start: 15.6, end: 20.8 },
    ],
    sfx: [
      { file: audio.open, at: 0.18, volume: 0.5 },
      { file: audio.question, at: 2.8, volume: 0.28 },
      { file: audio.confirm, at: 6.0, volume: 0.45 },
      { file: audio.confirm, at: 10.8, volume: 0.42 },
      { file: audio.confirm, at: 15.2, volume: 0.42 },
      { file: audio.bonus, at: 18.6, volume: 0.28 },
    ],
  },
];

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function seconds(segment) {
  return Number((segment.end - segment.start).toFixed(3));
}

function buildVideo(output) {
  mkdirSync(outputDir, { recursive: true });

  const inputOrder = [
    sources["709"],
    sources["705"],
    sources["699"],
    sources["787"],
    output.music.file,
    ...output.sfx.map((item) => item.file),
  ];

  const sourceIndexes = {
    709: 0,
    705: 1,
    699: 2,
    787: 3,
  };

  const filterParts = [];
  const concatLabels = [];

  output.segments.forEach((segment, index) => {
    const inputIndex = sourceIndexes[segment.src];
    const label = `v${index}`;
    filterParts.push(
      `[${inputIndex}:v]trim=start=${segment.start}:end=${segment.end},setpts=PTS-STARTPTS,${sharedVideoFilter}[${label}]`
    );
    concatLabels.push(`[${label}]`);
  });

  filterParts.push(`${concatLabels.join("")}concat=n=${output.segments.length}:v=1:a=0[vout]`);

  const totalDuration = output.segments.reduce((sum, segment) => sum + seconds(segment), 0);
  const musicIndex = 4;
  const audioLabels = ["[bg]"];

  filterParts.push(
    `[${musicIndex}:a]atrim=0:${totalDuration.toFixed(3)},asetpts=PTS-STARTPTS,volume=${output.music.volume}[bg]`
  );

  output.sfx.forEach((item, index) => {
    const inputIndex = 5 + index;
    const delayMs = Math.round(item.at * 1000);
    const label = `sfx${index}`;
    filterParts.push(
      `[${inputIndex}:a]asetpts=PTS-STARTPTS,volume=${item.volume},adelay=${delayMs}|${delayMs}[${label}]`
    );
    audioLabels.push(`[${label}]`);
  });

  filterParts.push(
    `${audioLabels.join("")}amix=inputs=${audioLabels.length}:duration=first:dropout_transition=0,alimiter=limit=0.9[aout]`
  );

  const outputPath = path.join(outputDir, output.file);
  const args = [
    ...inputOrder.flatMap((item) => ["-i", item]),
    "-filter_complex",
    filterParts.join(";"),
    "-map",
    "[vout]",
    "-map",
    "[aout]",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    "-t",
    totalDuration.toFixed(3),
    "-y",
    outputPath,
  ];

  run("ffmpeg", args);
}

outputs.forEach(buildVideo);
