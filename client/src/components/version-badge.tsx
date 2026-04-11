import { useQuery } from "@tanstack/react-query";

interface VersionInfo {
  ok: boolean;
  commit: string;
  commitDate: string;
  buildId: string;
  env: string;
  startedAt: string;
}

function detectDeploymentTarget(): { label: string; colorClass: string } {
  if (typeof window === "undefined") return { label: "server", colorClass: "bg-gray-600 text-white" };
  const host = window.location.hostname;
  if (host.includes("quranesh.com")) return { label: "quranesh.com", colorClass: "bg-green-600 text-white" };
  if (host.includes(".replit.app")) return { label: "replit-deploy", colorClass: "bg-blue-600 text-white" };
  if (host.includes(".replit.dev") || host.endsWith("repl.co")) return { label: "replit-preview", colorClass: "bg-amber-500 text-white" };
  return { label: "localhost", colorClass: "bg-slate-500 text-white" };
}

export function VersionBadge() {
  const { data, isLoading } = useQuery<VersionInfo>({
    queryKey: ["/api/version"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { label, colorClass } = detectDeploymentTarget();
  const commit = data?.commit ?? (isLoading ? "…" : "?");

  return (
    <div
      style={{ position: "fixed", bottom: "10px", right: "10px", zIndex: 99999 }}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono shadow-lg cursor-default select-none ${colorClass}`}
      title={data ? `Build: ${data.buildId}\nEnv: ${data.env}\nServer started: ${data.startedAt}` : "Loading build info…"}
      data-testid="version-badge"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 inline-block" />
      <span className="font-semibold">{label}</span>
      <span className="opacity-60">|</span>
      <span>{commit}</span>
    </div>
  );
}
