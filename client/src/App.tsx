import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import LanguageToggle from "@/components/language-toggle";
import HomePage from "@/pages/HomePage";
import Dashboard from "@/pages/dashboard";
import Exercise from "@/pages/exercise";
import NotFound from "@/pages/not-found";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/profile";
import { PaymentSuccess } from "@/pages/payment-success";
import TranslationManager from "@/pages/translation-manager";
import Analytics from "@/pages/Analytics";
import DiplomaPage from "@/pages/diploma";
import AdminPage from "@/pages/admin";
import ScholarshipStatus from "@/pages/ScholarshipStatus";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/features" component={Features} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/exercise/:type/:phraseId?" component={Exercise} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/diploma" component={DiplomaPage} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" component={Profile} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/translation-manager" component={TranslationManager} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/scholarship-status" component={ScholarshipStatus} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalLanguageToggle() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  return (
    <div 
      className={`fixed top-4 z-[100] ${isRTL ? 'left-4' : 'right-4'}`}
      data-testid="global-language-toggle"
    >
      <LanguageToggle />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <GlobalLanguageToggle />
            <Router />
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
