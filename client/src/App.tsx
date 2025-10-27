import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { ProtectedRoute } from "@/components/protected-route";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/features" component={Features} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/exercise/:type/:phraseId?" component={Exercise} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" component={Profile} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
