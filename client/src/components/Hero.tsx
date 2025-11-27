import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, MessageSquare } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import heroImage from "@assets/generated_images/quranic_book_with_flowing_arabic_letters.png";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation("/signup");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/10 to-primary/5 pb-32">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-foreground">
        <div className="max-w-4xl mx-auto">
          {/* Quranic Text */}
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Quranic
            </h1>
          </div>

          {/* Quranic Book Image with Arabic Letters */}
          <div className="flex items-center justify-center mb-8">
            <img
              src={heroImage}
              alt="Quranic Arabic with flowing letters - Quranic book and Arabic calligraphy"
              className="w-full max-w-3xl h-auto rounded-xl shadow-2xl"
              data-testid="img-hero-quranic"
            />
          </div>

          {/* Arabic Quote */}
          <div className="text-center mb-6">
            <p
              className="text-xl md:text-2xl font-bold text-foreground mb-4"
              dir="rtl"
            >
              «إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ»
            </p>
            <p className="text-lg text-foreground">
              {t('quranicQuote')}
            </p>
          </div>

          {/* CTA Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="default"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handleStartLearning}
            >
              {t('startLearningNow')}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <MessageSquare className="w-5 h-5" />
                {t('seeHowItWorks')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">
                {t('quranicExpressions')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {t('aiPowered')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('personalizedLearning')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{t('dailyPractice')}</div>
              <div className="text-sm text-muted-foreground">
                {t('practiceSessions')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#F6EFE2"
            fillOpacity="0.8"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
