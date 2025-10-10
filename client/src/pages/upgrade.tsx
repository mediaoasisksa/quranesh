import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, Check, Star, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

const Upgrade = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  if (!user) {
    setLocation('/signin');
    return null;
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with Quranic Arabic",
      features: [
        "Access to basic phrase database",
        "Simple exercises",
        "Progress tracking",
        "Up to 3 exercises per day"
      ],
      limitations: [
        "Limited exercise types",
        "No advanced features",
        "Basic analytics only"
      ],
      current: true,
      variant: "default" as const
    },
    {
      name: "#Pro",
      price: "$9",
      period: "per month",
      description: "Advanced features for serious learners",
      features: [
        "Full access to all phrases",
        "Advanced exercise types",
        "Detailed analytics & insights",
        "Unlimited exercises",
        "Priority support",
        "Export progress reports",
        "Custom learning paths",
        "Speech recognition exercises"
      ],
      limitations: [],
      current: false,
      variant: "default" as const,
      popular: true
    },
    {
      name: "#Premium",
      price: "$19",
      period: "per month",
      description: "Complete learning experience with AI tutor",
      features: [
        "Everything in Pro",
        "AI-powered personalized tutor",
        "Advanced pronunciation analysis",
        "Scheduled practice sessions",
        "Group learning features",
        "Advanced memorization tools",
        "1-on-1 tutor consultation",
        "Priority feature requests",
        "Offline mode access"
      ],
      limitations: [],
      current: false,
      variant: "default" as const
    }
  ];

  const handleUpgrade = (planName: string) => {
    // In a real application, this would integrate with payment processing
    alert(`Upgrade to ${planName} plan coming soon! This would integrate with Stripe or another payment provider.`);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Free":
        return <Check className="h-6 w-6" />;
      case "Pro":
        return <Zap className="h-6 w-6" />;
      case "Premium":
        return <Sparkles className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/dashboard')}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Crown className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Quran Arabic Learning
                </h1>
                <p className="text-sm text-muted-foreground">
                  Upgrade Your Learning Experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock your potential with advanced features designed for serious Quranic Arabic learners
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              Currently on: Free Plan
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.current ? 'border-primary bg-primary/5' : ''} ${plan.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.current ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                    }`}>
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Current Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 text-sm mt-0.5">•</span>
                            <span className="text-sm text-red-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    variant={plan.current ? "default" : "default"}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                  and you'll only pay the difference for the remaining billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers. All payments are
                  processed securely through our payment partners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can try any paid plan for 14 days with full access to all features.
                  No credit card required for the trial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upgrade;
