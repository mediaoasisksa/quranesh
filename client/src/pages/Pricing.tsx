import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { PaymentForm } from "@/components/payment-form";
import { useState, useEffect } from "react";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  // Load pricing plans from API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/pricing');
        const data = await response.json();
        setPricingPlans(data.plans);
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      }
    };
    fetchPricing();
  }, []);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (result: any) => {
    // Redirect to success page or dashboard
    window.location.href = '/payment-success';
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Payment failed: ' + error);
  };

  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Perfect for getting started with Quranic Arabic learning",
      features: [
        "Access to 100 basic Quranic sentences",
        "2 exercise types (Substitution & Completion)",
        "Basic progress tracking",
        "Community forum access",
        "Mobile app access"
      ],
      limitations: [
        "Limited AI interactions (10/day)",
        "Basic pronunciation feedback"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Standard",
      price: "$19",
      period: "/month",
      description: "Ideal for serious learners ready to accelerate their progress",
      features: [
        "Access to 1000+ Quranic sentences",
        "All 6 exercise types",
        "Advanced AI conversation partner",
        "Detailed progress analytics",
        "Pronunciation correction",
        "Weekly progress reports",
        "Priority community support",
        "Offline mode access"
      ],
      limitations: [],
      buttonText: "Start Standard Plan",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Premium",
      price: "$39",
      period: "/month",
      description: "Complete immersion for dedicated Arabic learners",
      features: [
        "Access to full Quranic database (5000+ sentences)",
        "Unlimited AI interactions",
        "Advanced speech recognition",
        "Personal AI tutor with memory",
        "Custom learning paths",
        "Live pronunciation sessions",
        "1-on-1 monthly coaching calls",
        "Advanced analytics dashboard",
        "Priority customer support",
        "Early access to new features"
      ],
      limitations: [],
      buttonText: "Go Premium",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students and educators receive a 50% discount on all plans. Contact us with your student ID or educator credentials."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely."
    }
  ];

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
              Simple, Transparent
              <span className="text-primary"> Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your Quranic Arabic learning journey. Start free and upgrade as you grow.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative border-2 transition-all duration-300 hover:shadow-lg ${
                    plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start gap-3 opacity-60">
                          <div className="w-5 h-5 mt-0.5 flex-shrink-0 border border-muted-foreground rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full"
                      onClick={() => {
                        if (plan.name === "Basic") {
                          window.location.href = '/signup';
                        } else {
                          // Map to API pricing plans
                          const apiPlan = pricingPlans.find(p => 
                            (plan.name === "Standard" && p.id === "premium") ||
                            (plan.name === "Premium" && p.id === "lifetime")
                          );
                          if (apiPlan) {
                            handlePlanSelect(apiPlan);
                          }
                        }
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions? We're here to help you make the right choice.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="border hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of learners transforming their Quranic knowledge into practical Arabic skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg" onClick={() => window.location.href = '/signup'}>
                Start Free Today
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/features'}>
                Explore Features
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
