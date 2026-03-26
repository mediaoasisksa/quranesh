import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, BookOpen, Users, Award, Check, ShoppingCart, GraduationCap, Loader2, Sparkles, CheckCircle2, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface SubscriptionGateProps {
  children: ReactNode;
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { isAuthenticated, isLoading: authLoading, token, signOut } = useAuth();
  const { hasActiveSubscription, isAdmin, isLegacyFree, isLoading: subLoading } = useSubscription();
  const { dir, language, t } = useLanguage();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [plans, setPlans] = useState<any[]>([]);
  const [availability, setAvailability] = useState<{ availableSeats: number; hasSeats: boolean } | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [legacyBannerDismissed, setLegacyBannerDismissed] = useState(false);

  const isArabic = language === "ar";

  useEffect(() => {
    fetch("/api/pricing")
      .then(r => r.json())
      .then(data => setPlans(data.plans || []))
      .catch(() => {});

    fetch("/api/scholarship/availability")
      .then(r => r.json())
      .then(setAvailability)
      .catch(() => {});
  }, []);

  const returnUrl = typeof window !== "undefined"
    ? encodeURIComponent(window.location.pathname + window.location.search)
    : "%2F";

  const handleClaimScholarship = async () => {
    console.log(`[claim] isAuthenticated=${isAuthenticated} hasToken=${!!token}`);

    // Not logged in at all → send to sign-in with return URL
    if (!isAuthenticated || !token) {
      console.warn("[claim] no auth — redirecting to signin");
      setLocation(`/signin?redirect=${returnUrl}`);
      return;
    }

    if (claiming) return; // prevent double-click

    setClaiming(true);
    setClaimError(null);

    try {
      console.log(`[claim] sending POST /api/scholarship/claim with token length=${token.length}`);
      const res = await fetch("/api/scholarship/claim", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // ignore JSON parse failure
      }

      console.log(`[claim] response: status=${res.status} body=`, JSON.stringify(data));

      if (res.status === 401) {
        // Expired or invalid token — clear auth state and send to sign-in
        console.warn("[claim] 401 — signing out and redirecting to signin");
        signOut();
        setLocation(`/signin?redirect=${returnUrl}`);
        return;
      }

      if (res.status === 400) {
        const msg = data?.message || "";
        // Already has access — just redirect to exercises
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("active")
        ) {
          queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
          setClaimSuccess(true);
          setTimeout(() => setLocation("/exercise/daily-contextual"), 1500);
          return;
        }
        // No seats available
        setClaimError(
          isArabic
            ? "لا توجد مقاعد متاحة حاليًا، يرجى المحاولة لاحقًا"
            : "No seats available at the moment"
        );
        return;
      }

      if (!res.ok) {
        setClaimError(
          isArabic
            ? "حدث خطأ، يرجى المحاولة مرة أخرى"
            : "An error occurred, please try again"
        );
        return;
      }

      // Success
      setClaimSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
      setTimeout(() => setLocation("/exercise/daily-contextual"), 2000);
    } catch {
      setClaimError(
        isArabic
          ? "خطأ في الاتصال، يرجى التحقق من الإنترنت والمحاولة مجددًا"
          : "Connection error, please check your internet and try again"
      );
    } finally {
      setClaiming(false);
    }
  };

  if (authLoading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAdmin || hasActiveSubscription) {
    if (isLegacyFree && !isAdmin && !legacyBannerDismissed) {
      return (
        <div dir={dir}>
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-700 px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs font-semibold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full mb-1">
                  {t('legacyAccessBadge')}
                </span>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  {t('legacyAccessActivated')}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  {t('legacyAccessSubtitle')}
                </p>
              </div>
              <button
                onClick={() => setLegacyBannerDismissed(true)}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 text-lg leading-none shrink-0"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
          {children}
        </div>
      );
    }
    return <>{children}</>;
  }

  const planIcons: Record<string, any> = {
    learner: BookOpen,
    "sponsor-5": Users,
    "sponsor-10": Users,
    certificate: Award,
  };

  const seatsLeft = availability?.availableSeats ?? null;
  const hasSeats = availability?.hasSeats !== false;
  const totalSeats = 1000;

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4" dir={dir}>
      <div className="max-w-2xl w-full space-y-6">

        {/* BUILD MARKER — deployment verification */}
        <div className="text-center text-xs text-muted-foreground/50 font-mono">BUILD: 2026-03-26-0918</div>

        {/* Header */}
        <Card className="text-center border-2 border-amber-300 dark:border-amber-700">
          <CardHeader>
            <Crown className="w-14 h-14 mx-auto text-amber-500 mb-2" />
            <CardTitle className="text-2xl">
              {isArabic ? "اشتراك مطلوب للوصول للتمارين" : "Subscription Required"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">
              {isArabic
                ? "اشترك لفتح جميع التمارين والمحتوى التعليمي"
                : "Subscribe to unlock all exercises and learning content"}
            </p>
          </CardContent>
        </Card>

        {/* Platform Scholarship Card — shown to everyone */}
        <Card className="border-2 border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30">
          <CardHeader className="text-center pb-2">
            <GraduationCap className="w-10 h-10 mx-auto text-green-600 dark:text-green-400 mb-2" />
            <CardTitle className="text-base text-green-800 dark:text-green-300">
              {isArabic ? "منحة مجانية من المنصة" : "Free Platform Scholarship"}
            </CardTitle>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {isArabic ? "مجانًا" : "Free"}
              <span className="text-sm font-normal text-green-600 dark:text-green-500 ms-1">
                {isArabic ? "/ سنة كاملة" : "/ full year"}
              </span>
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              {[
                isArabic ? "وصول كامل لجميع التمارين" : "Full access to all exercises",
                isArabic ? "ممول من منصة قرآنيش" : "Funded by Quranesh platform",
                isArabic ? "اشتراك لمدة سنة كاملة" : "One full year subscription",
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800 dark:text-green-300">{f}</span>
                </div>
              ))}
            </div>

            {seatsLeft !== null && (
              <p className="text-xs text-center text-green-700 dark:text-green-400 font-medium">
                {isArabic
                  ? `${seatsLeft} مقعد متاح من أصل ${totalSeats}`
                  : `${seatsLeft} of ${totalSeats} seats available`}
              </p>
            )}

            {claimError && (
              <p className="text-xs text-center text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 rounded p-2">
                {claimError}
              </p>
            )}

            {claimSuccess ? (
              <div className="text-center space-y-2 py-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  {isArabic ? "🎉 تم تفعيل المنحة بنجاح!" : "🎉 Scholarship activated!"}
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  {isArabic ? "جاري الانتقال للتمارين..." : "Taking you to exercises..."}
                </p>
              </div>
            ) : !isAuthenticated ? (
              /* Not logged in — send to sign-in page with return URL */
              <div className="space-y-2">
                <Button
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setLocation(`/signup`)}
                >
                  <UserPlus className="w-4 h-4" />
                  {isArabic ? "إنشاء حساب مجاني والحصول على وصول فوري" : "Create free account & get instant access"}
                </Button>
                <p className="text-xs text-center text-green-700 dark:text-green-400">
                  {isArabic ? "لديك حساب؟" : "Have an account?"}{" "}
                  <button
                    onClick={() => setLocation(`/signin?redirect=${returnUrl}`)}
                    className="underline font-medium"
                  >
                    {isArabic ? "سجّل دخولك للمطالبة بالمنحة" : "Sign in to claim your grant"}
                  </button>
                </p>
              </div>
            ) : hasSeats ? (
              <Button
                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleClaimScholarship}
                disabled={claiming}
              >
                {claiming ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{isArabic ? "جاري التفعيل..." : "Activating..."}</>
                ) : (
                  <><GraduationCap className="w-4 h-4" />{isArabic ? "احصل على وصول مجاني" : "Get Free Access"}</>
                )}
              </Button>
            ) : (
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={handleClaimScholarship}
                disabled={claiming}
              >
                {claiming ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{isArabic ? "جاري التسجيل..." : "Registering..."}</>
                ) : (
                  isArabic ? "انضم لقائمة الانتظار" : "Join Waiting List"
                )}
              </Button>
            )}

          </CardContent>
        </Card>

        {/* Paid plans */}
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
