import { useQuery } from "@tanstack/react-query";

interface VersionInfo {
  ok: boolean;
  commit: string;
  commitDate: string;
  buildId: string;
  env: string;
  startedAt: string;
}

function detectDeploymentTarget(): string {
  if (typeof window === "undefined") return "server";
  const host = window.location.hostname;
  if (host.includes("quranesh.com")) return "quranesh.com";
  if (host.includes(".replit.app")) return "replit-deploy";
  if (host.includes(".replit.dev") || host.includes("replit.dev")) return "replit-preview";
  return "local";
}

const targetColors: Record<string, string> = {
  "quranesh.com": "bg-green-700 text-white",
  "replit-deploy": "bg-blue-700 text-white",
  "replit-preview": "bg-yellow-600 text-white",
  "local": "bg-gray-600 text-white",
};

export function VersionBadge() {
  const { data } = useQuery<VersionInfo>({
    queryKey: ["/api/version"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const target = detectDeploymentTarget();
  const colorClass = targetColors[target] ?? "bg-gray-600 text-white";

  if (!data?.commit) return null;

  return (
    <div
      className={`fixed bottom-2 right-2 z-50 flex items-center gap-1 rounded px-2 py-1 text-xs font-mono opacity-75 hover:opacity-100 transition-opacity shadow-md ${colorClass}`}
      title={`Build: ${data.buildId}\nEnv: ${data.env}\nServer started: ${data.startedAt}`}
      data-testid="version-badge"
    >
      <span className="font-semibold">{target}</span>
      <span className="opacity-70">|</span>
      <span>{data.commit}</span>
    </div>
  );
}
