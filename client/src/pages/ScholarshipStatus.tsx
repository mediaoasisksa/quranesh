import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, GraduationCap, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ScholarshipStatus = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [availability, setAvailability] = useState<{
    availableSeats: number;
    waitingStudents: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/scholarship/availability")
      .then((r) => r.json())
      .then(setAvailability)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {isArabic ? "أنت في قائمة الانتظار" : "You're on the Waiting List"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {isArabic
                  ? "تم تسجيلك بنجاح! لا توجد مقاعد مدعومة متاحة حالياً. سيتم تفعيل حسابك تلقائياً عند توفر كافل جديد."
                  : "You've been registered successfully! There are no sponsored seats available right now. Your account will be activated automatically when a new sponsor is available."}
              </p>

              {availability && (
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{availability.availableSeats}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {isArabic ? "مقاعد متاحة" : "Available Seats"}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{availability.waitingStudents}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {isArabic ? "في الانتظار" : "Students Waiting"}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {isArabic ? "هل تعرف شخصاً يرغب في الكفالة؟" : "Know someone who wants to sponsor?"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isArabic
                    ? "شارك رابط المنصة مع من يرغب في دعم تعلم القرآن"
                    : "Share the platform link with anyone who wants to support Quranic learning"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/signin">
                  <Button variant="default" size="lg">
                    {isArabic ? "تسجيل الدخول" : "Sign In"}
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    {isArabic ? "العودة للرئيسية" : "Back to Home"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScholarshipStatus;
