import { execSync } from "child_process";

function getGitCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: "pipe" }).toString().trim();
  } catch {
    return "unknown";
  }
}

function getGitCommitDate(): string {
  try {
    return execSync('git log -1 --format="%ci"', { stdio: "pipe" }).toString().trim().substring(0, 10);
  } catch {
    return new Date().toISOString().substring(0, 10);
  }
}

const commit = getGitCommit();
const commitDate = getGitCommitDate();
const startedAt = new Date().toISOString();
const nodeEnv = process.env.NODE_ENV || "development";

export const BUILD_INFO = {
  commit,
  commitDate,
  startedAt,
  env: nodeEnv,
  buildId: `${commit}@${commitDate}`,
};
