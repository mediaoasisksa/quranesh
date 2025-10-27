import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  subscriptionExpiresAt: Date | null;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  // If no token, redirect to signin
  if (!token) {
    return <Redirect to="/signin" />;
  }

  // Check subscription status
  const { data: subscriptionData, isLoading, error } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription-status"],
    retry: false,
  });

  // Show loading state while checking subscription
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // If error or no active subscription, redirect to pricing
  if (error || !subscriptionData?.hasActiveSubscription) {
    return <Redirect to="/pricing" />;
  }

  // User has active subscription, show protected content
  return <>{children}</>;
}
