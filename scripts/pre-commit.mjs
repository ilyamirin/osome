import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const stagedFiles = getStagedFiles();

if (stagedFiles.length === 0) {
  process.exit(0);
}

run("node", ["./scripts/check-secrets.mjs", ...stagedFiles], "Secret scan failed.");

const filesToFormat = stagedFiles.filter((file) =>
  isOneOf(file, [".js", ".mjs", ".json", ".html", ".css"])
);
if (filesToFormat.length > 0) {
  run(prettierBin(), ["--write", ...filesToFormat], "Formatting failed.");
  run("git", ["add", "--", ...filesToFormat], "Unable to restage formatted files.");
}

const filesToLint = stagedFiles.filter((file) => isOneOf(file, [".js", ".mjs"]));
if (filesToLint.length > 0) {
  run(eslintBin(), [...filesToLint], "Static analysis failed.");
}

process.stdout.write("Pre-commit checks passed.\n");

function getStagedFiles() {
  const output = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();

  return output ? output.split("\n").filter(Boolean) : [];
}

function run(command, args, errorMessage) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(errorMessage);
    process.exit(result.status ?? 1);
  }
}

function prettierBin() {
  return path.resolve(
    repoRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "prettier.cmd" : "prettier"
  );
}

function eslintBin() {
  return path.resolve(
    repoRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "eslint.cmd" : "eslint"
  );
}

function isOneOf(file, extensions) {
  return extensions.includes(path.extname(file));
}
