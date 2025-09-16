import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Rating Stars */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
            <span className="ml-2 text-primary-foreground/90 font-medium">
              Trusted by 10,000+ Huffaz worldwide
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
            Ready to Bridge Your
            <span className="block text-accent">Quranic Knowledge?</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Huffaz who are transforming their memorized verses
            into practical Arabic conversation skills.
          </p>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-primary-foreground/90">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Free Trial Available</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Cancel Anytime</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button
                variant="accent"
                size="lg"
                className="text-lg px-8 py-6 shadow-2xl hover:shadow-accent/20"
              >
                Start Your Journey Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-primary/20 border-white/30 text-white hover:bg-primary/30 hover:border-white/50 transition-all duration-300"
              >
                Try for free !
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-primary-foreground/70 text-sm">
            <p>Developed in partnership with Islamic scholars and linguists</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
