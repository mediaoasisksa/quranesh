import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, BookOpen, Award } from "lucide-react";
import { PaymentForm } from "@/components/payment-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";

const planIcons: Record<string, any> = {
  learner: BookOpen,
  "sponsor-5": Users,
  "sponsor-10": Users,
  certificate: Award,
};

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const urlParams = new URLSearchParams(window.location.search);
  const isSponsorRole = urlParams.get("role") === "sponsor";

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("/api/pricing");
        const data = await response.json();
        setPricingPlans(data.plans);
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      }
    };
    fetchPricing();
  }, []);

  useEffect(() => {
    const pendingPlanData = localStorage.getItem("pendingPaymentPlan");
    if (pendingPlanData && isAuthenticated && pricingPlans.length > 0) {
      try {
        const pendingData = JSON.parse(pendingPlanData);
        const apiPlan = pricingPlans.find((p) => p.id === pendingData.id);
        if (apiPlan) {
          setSelectedPlan(apiPlan);
          setShowPaymentForm(true);
        }
        localStorage.removeItem("pendingPaymentPlan");
      } catch (error) {
        localStorage.removeItem("pendingPaymentPlan");
      }
    }
  }, [isAuthenticated, pricingPlans]);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (result: any) => {
    window.location.href = "/payment-success";
  };

  const handlePaymentError = (error: string) => {
    alert("Payment failed: " + error);
  };

  const getPlanName = (plan: any) => isArabic && plan.nameEn ? plan.name : (plan.nameEn || plan.name);
  const getPlanFeatures = (plan: any) => isArabic ? plan.features : (plan.featuresEn || plan.features);
  const getDurationLabel = (plan: any) => {
    if (plan.duration === "year") return isArabic ? "/ سنة" : "/ year";
    return isArabic ? "دفعة واحدة" : "one-time";
  };

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      <main className="pt-20">
        {showPaymentForm && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{getPlanName(selectedPlan)}</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    {isArabic ? "إغلاق" : "Close"} ✕
                  </Button>
                </div>
                <PaymentForm
                  selectedPlan={selectedPlan}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            </div>
          </div>
        )}

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {isSponsorRole ? (
                isArabic ? (
                  <>باقات <span className="text-primary">الكفالة</span></>
                ) : (
                  <>Sponsorship <span className="text-primary">Plans</span></>
                )
              ) : isArabic ? (
                <>خطط <span className="text-primary">الاشتراك</span></>
              ) : (
                <>Subscription <span className="text-primary">Plans</span></>
              )}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {isSponsorRole
                ? (isArabic
                  ? "اختر باقة الكفالة لدعم متعلمي القرآن غير الناطقين بالعربية"
                  : "Choose a sponsorship plan to support non-Arabic speaking Quran learners")
                : (isArabic
                  ? "اشترك في منصة قرآنش لتعلم اللغة العربية القرآنية أو ادعم متعلمين آخرين"
                  : "Subscribe to Quranesh for Quranic Arabic training or sponsor other learners")}
            </p>
          </div>
        </section>

        <section className="py-12 pb-20">
          <div className="container mx-auto px-6">
            <div className={`grid grid-cols-1 ${isSponsorRole ? "md:grid-cols-2 max-w-3xl" : "md:grid-cols-2 lg:grid-cols-4 max-w-6xl"} gap-6 mx-auto`}>
              {pricingPlans
                .filter((plan: any) => isSponsorRole ? plan.id.startsWith("sponsor-") : true)
                .map((plan: any, index: number) => {
                const Icon = planIcons[plan.id] || Star;
                const isPopular = isSponsorRole ? plan.id === "sponsor-5" : plan.id === "learner";
                return (
                  <Card
                    key={plan.id}
                    className={`relative border-2 ${isPopular ? "border-primary shadow-lg scale-105" : "border-border"} transition-all hover:shadow-md`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {isArabic ? "الأكثر شيوعاً" : "Most Popular"}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 pt-8">
                      <Icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                      <CardTitle className="text-lg font-bold mb-2">
                        {getPlanName(plan)}
                      </CardTitle>
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-base text-muted-foreground ms-1">
                          {plan.currency}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getDurationLabel(plan)}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {getPlanFeatures(plan).map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant={isPopular ? "default" : "outline"}
                        className="w-full"
                        onClick={() => {
                          if (!isAuthenticated) {
                            localStorage.setItem(
                              "pendingPaymentPlan",
                              JSON.stringify({ id: plan.id }),
                            );
                            setLocation("/signup");
                            return;
                          }
                          handlePlanSelect(plan);
                        }}
                      >
                        {isArabic ? "اشترك الآن" : "Subscribe"} - {plan.price} {plan.currency}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {pricingPlans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isArabic ? "جاري تحميل الخطط..." : "Loading plans..."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
