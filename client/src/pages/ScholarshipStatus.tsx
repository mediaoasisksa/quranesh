import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, GraduationCap, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ScholarshipStatus = () => {
  const { language, t } = useLanguage();
  const isRTL = language === "ar" || language === "ur";
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [availability, setAvailability] = useState<{
    availableSeats: number;
    waitingStudents: number;
    hasSeats: boolean;
  } | null>(null);

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/scholarship/availability")
      .then((r) => r.json())
      .then(setAvailability)
      .catch(() => {});
  }, []);

  const handleClaim = async () => {
    if (!token) {
      window.location.href = "/signup";
      return;
    }
    if (claiming) return; // prevent double-click
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await fetch("/api/scholarship/claim", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      let data: any = {};
      try { data = await res.json(); } catch { /* ignore */ }

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/signup";
        return;
      }

      if (res.status === 400) {
        const status = data?.status || "";
        if (status === "ALREADY_ACTIVE" || (data?.message || "").toLowerCase().includes("already")) {
          setClaimed(true); // treat as success — they already have access
          return;
        }
        setClaimError(
          isRTL
            ? "لا توجد مقاعد متاحة حاليًا، يرجى المحاولة لاحقًا"
            : "No seats available at the moment"
        );
        return;
      }

      if (!res.ok) {
        setClaimError(isRTL ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again");
        return;
      }

      setClaimed(true);
    } catch {
      setClaimError(isRTL ? "خطأ في الاتصال، يرجى التحقق من الإنترنت" : "Connection error, please try again");
    } finally {
      setClaiming(false);
    }
  };

  const hasSeats = (availability?.availableSeats ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">

          {/* ── SUCCESS after claiming ── */}
          {claimed ? (
            <Card className="border-2 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {t("scholarshipActivatedTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("scholarshipActivatedDesc")}
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full">
                    {t("startLearningNow")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

          /* ── SEATS AVAILABLE ── */
          ) : hasSeats ? (
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {t("scholarshipAvailableTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {/* Seats counter */}
                {availability && (
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{availability.availableSeats}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t("availableSeats")}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">{availability.waitingStudents}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t("studentsWaiting")}</div>
                    </div>
                  </div>
                )}

                {/* Seat consumption notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                  <p className="text-amber-800 dark:text-amber-300 font-medium text-sm">
                    {t("scholarshipSeatNotice").replace("{count}", String(availability?.availableSeats ?? ""))}
                  </p>
                </div>

                {/* Claim section */}
                {authLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground">
                      {t("scholarshipRegisteredUnder")} {user.firstName} {user.lastName}
                    </div>
                    {claimError && (
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium">{claimError}</p>
                    )}
                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleClaim}
                      disabled={claiming}
                    >
                      {claiming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t("activating")}
                        </>
                      ) : (
                        t("claimFreeScholarship")
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      {t("signInToClaimScholarship")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/signin">
                        <Button size="lg" className="w-full sm:w-auto">
                          {t("signIn")}
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          {t("createAccount")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <Link href="/">
                  <Button variant="ghost" size="sm">
                    {t("backToHome")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

          /* ── WAITING LIST (no seats) ── */
          ) : (
            <Card className="border-2 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  {t("waitingListTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("waitingListDesc")}
                </p>

                {availability && (
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{availability.availableSeats}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t("availableSeats")}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{availability.waitingStudents}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t("studentsWaiting")}</div>
                    </div>
                  </div>
                )}

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="font-medium">{t("getFreeScholarshipTitle")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("getFreeScholarshipDesc")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href="/signin">
                    <Button variant="default" size="lg">
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg">
                      {t("backToHome")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScholarshipStatus;
