import { Button } from "@/components/ui/button";

import { ArrowRight, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import heroBackground from "@assets/hero-background_1757702249890.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden rounded-b-[3rem] lg:rounded-b-[4rem]">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 rounded-b-[3rem] lg:rounded-b-[4rem]"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 rounded-b-[3rem] lg:rounded-b-[4rem]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">
              AI-Powered Quranic Arabic Learning
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Quranic Knowledge
            </span>
            Into Daily Arabic
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
            Master conversational Arabic through the verses you've memorized.
            Connect your Quranic knowledge with practical, everyday
            communication.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/login">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Start Learning Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-primary/20 border-white/30 text-white hover:bg-primary/30 hover:border-white/50 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" />
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">1000+</div>
              <div className="text-sm opacity-80">Quranic Expressions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                AI-Powered
              </div>
              <div className="text-sm opacity-80">Personalized Learning</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">Daily</div>
              <div className="text-sm opacity-80">Practice Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/60">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
