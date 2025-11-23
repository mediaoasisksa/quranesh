import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { PaymentForm } from "@/components/payment-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Load pricing plans from API
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

  // Check for pending payment plan after signup
  useEffect(() => {
    const pendingPlanData = localStorage.getItem("pendingPaymentPlan");
    if (pendingPlanData && isAuthenticated && pricingPlans.length > 0) {
      try {
        const pendingData = JSON.parse(pendingPlanData);
        // Find the actual plan from API
        const apiPlan = pricingPlans.find((p) => p.id === pendingData.id);
        if (apiPlan) {
          setSelectedPlan(apiPlan);
          setShowPaymentForm(true);
        }
        // Clear the pending plan since we've now processed it
        localStorage.removeItem("pendingPaymentPlan");
      } catch (error) {
        console.error("Error parsing pending payment plan:", error);
        localStorage.removeItem("pendingPaymentPlan");
      }
    }
  }, [isAuthenticated, pricingPlans]);

  const handlePlanSelect = (plan: any) => {
    // This function is now only called for authenticated users
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (result: any) => {
    // Redirect to success page or dashboard
    window.location.href = "/payment-success";
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    alert("Payment failed: " + error);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Payment Form Modal */}
        {showPaymentForm && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPaymentForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
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
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Official Certificate of
              <span className="text-primary"> Arabic Performance</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The Quranesh application is now free for all users. Pay a one-time fee to receive an official, verifiable certificate acknowledging your progress and performance in Quranic Arabic.
            </p>
          </div>
        </section>

        {/* Certificate Card */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              {pricingPlans.length > 0 && pricingPlans[0] ? (
                <Card className="relative border-2 border-primary shadow-lg">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Official Certificate
                    </Badge>
                  </div>

                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-3xl font-bold mb-4">
                      {pricingPlans[0].name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-foreground">
                        ${pricingPlans[0].price}
                      </span>
                      <span className="text-xl text-muted-foreground ml-2">
                        {pricingPlans[0].currency}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      One-time payment for your official certificate
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4 mb-8">
                      {pricingPlans[0].features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-base">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="default"
                      className="w-full text-lg py-6"
                      onClick={() => {
                        if (!isAuthenticated) {
                          // Store the selected plan ID to restore after signup
                          localStorage.setItem(
                            "pendingPaymentPlan",
                            JSON.stringify({
                              id: pricingPlans[0].id,
                            }),
                          );
                          // Redirect to signup page
                          setLocation("/signup");
                          return;
                        }

                        // For authenticated users, proceed to payment
                        handlePlanSelect(pricingPlans[0]);
                      }}
                    >
                      Get Your Certificate - ${pricingPlans[0].price} {pricingPlans[0].currency}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading certificate information...</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
