import { useQuery } from "@tanstack/react-query";

interface VersionInfo {
  ok: boolean;
  commit: string;
  commitDate: string;
  buildId: string;
  env: string;
  startedAt: string;
}

function detectHost(): { label: string; bg: string; dot: string } {
  if (typeof window === "undefined") return { label: "server", bg: "#64748b", dot: "#fff" };
  const host = window.location.hostname;
  if (host.includes("quranesh.com")) return { label: "production", bg: "#16a34a", dot: "#bbf7d0" };
  if (host.includes(".replit.app")) return { label: "replit-deploy", bg: "#2563eb", dot: "#bfdbfe" };
  if (host.includes(".replit.dev") || host.endsWith("repl.co")) return { label: "replit-preview", bg: "#d97706", dot: "#fde68a" };
  return { label: "localhost", bg: "#64748b", dot: "#e2e8f0" };
}

function useVersionData() {
  return useQuery<VersionInfo>({
    queryKey: ["/api/version"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/** Fixed overlay badge — bottom-right corner, every page */
export function VersionBadge() {
  const { data, isLoading } = useVersionData();
  const { label, bg, dot } = detectHost();
  const commit = data?.commit ?? (isLoading ? "…" : "?");
  const serverEnv = data?.env;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 99999,
        backgroundColor: bg,
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 9999,
        padding: "3px 10px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        cursor: "default",
        userSelect: "none",
      }}
      title={data
        ? `Build: ${data.buildId}\nServer env: ${data.env}\nStarted: ${data.startedAt}`
        : "Loading…"}
      data-testid="version-badge"
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: dot, display: "inline-block" }} />
      {label}{serverEnv && serverEnv !== "development" ? ` [${serverEnv}]` : ""} | {commit}
    </div>
  );
}

/** Inline badge — embedded directly inside page headers */
export function InlineBuildBadge() {
  const { data, isLoading } = useVersionData();
  const { label, bg, dot } = detectHost();
  const commit = data?.commit ?? (isLoading ? "…" : "?");
  const serverEnv = data?.env;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        backgroundColor: bg,
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 9999,
        padding: "2px 9px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
        cursor: "default",
        userSelect: "none",
        flexShrink: 0,
      }}
      title={data
        ? `Build: ${data.buildId}\nServer env: ${data.env}\nStarted: ${data.startedAt}`
        : "Loading…"}
      data-testid="inline-build-badge"
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dot, display: "inline-block", flexShrink: 0 }} />
      {label}{serverEnv && serverEnv !== "development" ? ` [${serverEnv}]` : ""} | {commit}
    </span>
  );
}
