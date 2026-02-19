import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import type { ReactNode } from "react";

interface SubscriptionGateProps {
  children: ReactNode;
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, isAdmin, isLoading: subLoading } = useSubscription();
  const { dir, language } = useLanguage();

  const isArabic = language === "ar";

  if (authLoading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4" dir={dir}>
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <CardTitle>{isArabic ? "يرجى تسجيل الدخول" : "Sign in required"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {isArabic ? "يرجى تسجيل الدخول للوصول إلى التمارين." : "Please sign in to access exercises."}
            </p>
            <Link href="/signin">
              <Button className="w-full">{isArabic ? "تسجيل الدخول" : "Sign In"}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin || hasActiveSubscription) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4" dir={dir}>
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <Crown className="w-12 h-12 mx-auto text-amber-500 mb-2" />
          <CardTitle>{isArabic ? "اشتراك مطلوب" : "Subscription Required"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isArabic
              ? "اشترك للوصول إلى جميع التمارين وميزات التعلم. تبدأ الخطط من ١٠ ريال سعودي/سنة."
              : "Subscribe to access all exercises and learning features. Plans start at 10 SAR/year."}
          </p>
          <Link href="/pricing">
            <Button className="w-full bg-amber-500 hover:bg-amber-600">
              {isArabic ? "عرض الخطط" : "View Plans"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
