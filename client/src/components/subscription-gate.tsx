import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, BookOpen, Users, Award, Check, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

interface SubscriptionGateProps {
  children: ReactNode;
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, isAdmin, isLoading: subLoading } = useSubscription();
  const { dir, language } = useLanguage();
  const [plans, setPlans] = useState<any[]>([]);

  const isArabic = language === "ar";

  useEffect(() => {
    if (!hasActiveSubscription && !isAdmin && isAuthenticated) {
      fetch("/api/pricing")
        .then(r => r.json())
        .then(data => setPlans(data.plans || []))
        .catch(() => {});
    }
  }, [hasActiveSubscription, isAdmin, isAuthenticated]);

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

  const planIcons: Record<string, any> = {
    learner: BookOpen,
    "sponsor-5": Users,
    "sponsor-10": Users,
    certificate: Award,
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4" dir={dir}>
      <div className="max-w-2xl w-full space-y-6">
        <Card className="text-center border-2 border-amber-300 dark:border-amber-700">
          <CardHeader>
            <Crown className="w-14 h-14 mx-auto text-amber-500 mb-2" />
            <CardTitle className="text-2xl">
              {isArabic ? "اشتراك مطلوب للوصول للتمارين" : "Subscription Required"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg">
              {isArabic
                ? "اشترك لفتح جميع التمارين والمحتوى التعليمي"
                : "Subscribe to unlock all exercises and learning content"}
            </p>
          </CardContent>
        </Card>

        {plans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.filter(p => p.id === "learner" || p.id === "sponsor-5").map((plan) => {
              const Icon = planIcons[plan.id] || BookOpen;
              const planName = isArabic ? plan.name : (plan.nameEn || plan.name);
              const features = isArabic ? plan.features : (plan.featuresEn || plan.features);
              return (
                <Card key={plan.id} className={`border-2 ${plan.id === "learner" ? "border-primary shadow-md" : "border-border"}`}>
                  <CardHeader className="text-center pb-2">
                    <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-base">{planName}</CardTitle>
                    <div>
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground ms-1">{plan.currency}</span>
                      <span className="text-xs text-muted-foreground ms-1">
                        {plan.duration === "year" ? (isArabic ? "/ سنة" : "/ year") : ""}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      {features.slice(0, 3).map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs">
                          <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/pricing">
                      <Button className="w-full gap-2" variant={plan.id === "learner" ? "default" : "outline"}>
                        <ShoppingCart className="w-4 h-4" />
                        {isArabic ? "اشترك الآن" : "Subscribe"} - {plan.price} {plan.currency}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/pricing">
            <Button variant="link" className="text-primary">
              {isArabic ? "عرض جميع الباقات ←" : "View all plans →"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
