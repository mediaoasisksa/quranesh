import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  isAdmin?: boolean;
  plan?: string | null;
  expiresAt?: string;
}

export function useSubscription() {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription-status", user?.id],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/subscription-status?userId=${user!.id}`);
      if (!res.ok) throw new Error("Failed to check subscription");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    hasActiveSubscription: data?.hasActiveSubscription ?? false,
    isAdmin: data?.isAdmin ?? user?.isAdmin ?? false,
    plan: data?.plan ?? null,
    expiresAt: data?.expiresAt ?? null,
    isLoading,
  };
}
