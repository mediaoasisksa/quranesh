/**
 * Build Information & Version Fingerprint
 * ========================================
 * Priority for commit resolution:
 *   1. dist/build-meta.json  — written by scripts/gen-build-meta.mjs at BUILD TIME
 *      (git is available during build; not available at runtime in production)
 *   2. process.env.COMMIT_SHA / COMMIT_DATE — injected by CI/CD if present
 *   3. Live git commands     — works in dev, falls back to "unknown" in production
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── helpers ─────────────────────────────────────────────────────────────────

function git(cmd: string, fallback = "unknown"): string {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch {
    return fallback;
  }
}

function getAppVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function getFeatureFlags(): Record<string, boolean> {
  const keys = [
    "GEMINI_API_KEY",
    "HYPERPAY_PROD_ACCESS_TOKEN",
    "HYPERPAY_PROD_ENTITY_ID_VISA_MASTER",
    "HYPERPAY_PROD_ENTITY_ID_MADA",
    "JWT_SECRET",
    "DATABASE_URL",
    "HYPERPAY_SERVER_URL",
  ];
  const flags: Record<string, boolean> = {};
  for (const k of keys) flags[k] = Boolean(process.env[k]);
  return flags;
}

// ── resolve commit from build-meta.json (created at build time) ─────────────

interface BuildMeta {
  commit: string;
  commitFull: string;
  commitDate: string;
  branch: string;
  builtAt: string;
}

function loadBuildMeta(): BuildMeta | null {
  const candidates = [
    path.join(__dirname, "build-meta.json"),       // dist/build-meta.json when running dist/index.js
    path.join(__dirname, "../dist/build-meta.json"),// dev server running from server/
    path.join(__dirname, "../../dist/build-meta.json"),
  ];
  for (const p of candidates) {
    try {
      if (existsSync(p)) {
        return JSON.parse(readFileSync(p, "utf-8")) as BuildMeta;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

const meta = loadBuildMeta();

const commit     = meta?.commit     ?? process.env.COMMIT_SHA?.substring(0, 7) ?? git("git rev-parse --short HEAD");
const commitFull = meta?.commitFull ?? process.env.COMMIT_SHA                  ?? git("git rev-parse HEAD");
const commitDate = meta?.commitDate ?? process.env.COMMIT_DATE                 ?? git('git log -1 --format="%ci"').substring(0, 10);
const builtAt    = new Date().toISOString();
const env        = process.env.NODE_ENV || "development";
const appVersion = getAppVersion();

// ── export ───────────────────────────────────────────────────────────────────

export const BUILD_INFO = {
  commit,
  commitFull,
  commitDate,
  builtAt,
  env,
  appVersion,
  buildId: `${commit}@${commitDate}`,
  featureFlags: getFeatureFlags(),
  nodeVersion: process.version,
  source: meta ? "build-meta.json" : (process.env.COMMIT_SHA ? "env-var" : "git-runtime"),
};
