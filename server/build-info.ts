/**
 * Build Information & Version Fingerprint
 * ========================================
 * Loaded once at server startup. Exposes a complete release fingerprint so that
 * any environment (dev, staging, production) can be identified unambiguously by
 * hitting /api/version — no guessing, no assumptions.
 *
 * Fields:
 *   commit        - git short sha (7 chars)
 *   commitFull    - full 40-char sha
 *   commitDate    - date of the HEAD commit (YYYY-MM-DD)
 *   builtAt       - ISO timestamp when the server process started
 *   env           - NODE_ENV value
 *   appVersion    - semantic version from package.json (or "0.0.0" fallback)
 *   buildId       - human-readable "<commit>@<date>" stamp
 *   featureFlags  - snapshot of key feature flag env vars (values redacted)
 *   nodeVersion   - Node.js runtime version
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

/**
 * Snapshot of feature-relevant environment variables.
 * Values are replaced with true/false so secrets are NEVER exposed.
 */
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
  for (const k of keys) {
    flags[k] = Boolean(process.env[k]);
  }
  return flags;
}

const commit      = git("git rev-parse --short HEAD");
const commitFull  = git("git rev-parse HEAD");
const commitDate  = git('git log -1 --format="%ci"').substring(0, 10);
const builtAt     = new Date().toISOString();
const env         = process.env.NODE_ENV || "development";
const appVersion  = getAppVersion();

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
};
