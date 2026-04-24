#!/usr/bin/env node
/**
 * gen-build-meta.mjs
 * Runs at BUILD TIME (before esbuild) while git is available.
 * Writes dist/build-meta.json so the production server can read the
 * correct commit hash at startup — even without git in the container.
 */
import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const DIST_DIR  = path.join(ROOT, "dist");

function git(cmd, fallback = "unknown") {
  try {
    return execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim();
  } catch {
    return fallback;
  }
}

const commit     = git("git rev-parse --short HEAD");
const commitFull = git("git rev-parse HEAD");
const commitDate = git('git log -1 --format="%ci"').substring(0, 10);
const branch     = git("git rev-parse --abbrev-ref HEAD");
const builtAt    = new Date().toISOString();

const meta = { commit, commitFull, commitDate, branch, builtAt };

mkdirSync(DIST_DIR, { recursive: true });
writeFileSync(path.join(DIST_DIR, "build-meta.json"), JSON.stringify(meta, null, 2));

console.log(`[gen-build-meta] commit=${commit} branch=${branch} builtAt=${builtAt}`);
