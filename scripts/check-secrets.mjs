import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();

const rawArgs = process.argv.slice(2);
const files = rawArgs.length > 0 ? rawArgs : getStagedFiles();

if (files.length === 0) {
  process.exit(0);
}

const patterns = [
  {
    label: "Private key block",
    regex: /-----BEGIN (?:[A-Z ]+)?PRIVATE KEY-----/g,
  },
  {
    label: "AWS access key",
    regex: /\b(?:A3T|AKIA|ASIA|AGPA|AIDA|ANPA|ANVA|AROA|AIPA)[A-Z0-9]{16}\b/g,
  },
  {
    label: "GitHub token",
    regex: /\bgh(?:p|o|u|s|r)_[A-Za-z0-9]{20,}\b/g,
  },
  {
    label: "OpenAI-style key",
    regex: /\bsk-[A-Za-z0-9]{20,}\b/g,
  },
  {
    label: "Bearer token",
    regex: /\bBearer\s+[A-Za-z0-9._-]{20,}\b/g,
  },
  {
    label: "Generic credential assignment",
    regex:
      /\b(?:api[_-]?key|secret|token|password|passwd|client[_-]?secret)\b\s*[:=]\s*["'`][^"'`\n]{8,}["'`]/gi,
    allow: /\b(?:dummy|example|sample|placeholder|changeme|local|test|fake|mock|development)\b/i,
  },
];

const findings = [];

for (const file of files) {
  const absolutePath = path.resolve(repoRoot, file);
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    continue;
  }

  const buffer = fs.readFileSync(absolutePath);
  if (buffer.includes(0)) {
    continue;
  }

  const text = buffer.toString("utf8");
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern.regex)) {
      const snippet = match[0].trim();
      if (pattern.allow && pattern.allow.test(snippet)) {
        continue;
      }

      findings.push({
        file,
        label: pattern.label,
        line: getLineNumber(text, match.index ?? 0),
        snippet: snippet.length > 120 ? `${snippet.slice(0, 117)}...` : snippet,
      });
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secrets detected. Commit aborted.");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.label}] ${finding.snippet}`);
  }
  process.exit(1);
}

process.stdout.write("Secret scan passed.\n");

function getStagedFiles() {
  const output = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();

  return output ? output.split("\n").filter(Boolean) : [];
}

function getLineNumber(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text[i] === "\n") {
      line += 1;
    }
  }
  return line;
}
