#!/usr/bin/env node

const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");

const result = spawnSync("node", ["./scripts/capture-videos.cjs"], {
  cwd: projectRoot,
  stdio: "inherit",
});

process.exit(result.status || 0);
