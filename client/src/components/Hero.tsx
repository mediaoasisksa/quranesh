import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Globe, Calendar, Award, BookOpen, ExternalLink, Book } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const handleStartLearning = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation("/signup");
    }
  };

  const features = [
    { key: 'feature1', ar: 'مفردات قرآنية أساسية للحياة اليومية', en: 'Essential Quranic vocabulary for daily life' },
    { key: 'feature2', ar: 'تمارين تفاعلية متنوعة وعملية', en: 'Diverse interactive and practical exercises' },
    { key: 'feature3', ar: 'دعم 12 لغة عالمية', en: 'Support for 12 global languages' },
    { key: 'feature4', ar: 'شهادة إتمام معتمدة', en: 'Accredited completion certificate' },
  ];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/10 to-primary/5 pb-16 pt-24"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Content Side */}
          <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {isRTL ? (
                  <>
                    دبلوم تعلم
                    <br />
                    <span className="text-primary">اللغة العربية</span>
                  </>
                ) : (
                  <>
                    Arabic Language
                    <br />
                    <span className="text-primary">Learning Diploma</span>
                  </>
                )}
              </h1>
            </div>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={`flex items-center gap-3 text-lg text-muted-foreground ${isRTL ? 'flex-row' : 'flex-row'}`}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </span>
                  <span>{isRTL ? feature.ar : feature.en}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse justify-end' : 'justify-start'}`}>
              <Button
                variant="default"
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                onClick={handleStartLearning}
                data-testid="button-start-learning"
              >
                {t('startLearningNow')}
                {isRTL ? <ArrowLeft className="w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
              <a
                href="https://www.mojzy.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  try {
                    await fetch("/api/analytics/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        eventName: "click_mojzy_button",
                        userId: null,
                        metadata: { source: "hero", language },
                      }),
                    });
                  } catch (error) {
                    console.error("Failed to track event:", error);
                  }
                }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  data-testid="button-mojzy-hero"
                >
                  <Book className="w-5 h-5" />
                  {language === 'ar' ? 'تحفيظ القرآن (مُجْزِي)' : t('quranMemorization')}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Card Side - Green Card */}
          <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
            <div className="relative">
              {/* Main Green Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 text-white shadow-2xl max-w-md w-full">
                {/* Join Button */}
                <Button
                  variant="secondary"
                  className="w-full mb-6 bg-white/20 hover:bg-white/30 text-white border-0 text-lg py-6"
                  onClick={handleStartLearning}
                >
                  {isRTL ? 'انضم للمنصة العالمية' : 'Join the Global Platform'}
                  {isRTL ? <ArrowLeft className="w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>

                {/* Card Info */}
                <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isRTL ? 'من مكة إلى العالم' : 'From Mecca to the World'}
                  </h3>
                  <p className="text-white/80">
                    {isRTL ? 'بوابة تعليم العربية للمسلمين' : 'Arabic Learning Gateway for Muslims'}
                  </p>
                </div>

                {/* Stats Row */}
                <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-5 h-5 text-white/70" />
                      <span className="text-4xl font-bold">12</span>
                    </div>
                    <span className="text-white/70 text-sm">
                      {isRTL ? 'أسبوع' : 'weeks'}
                    </span>
                  </div>
                  <div className="w-px bg-white/30"></div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-5 h-5 text-white/70" />
                      <span className="text-4xl font-bold">12</span>
                    </div>
                    <span className="text-white/70 text-sm">
                      {isRTL ? 'لغة' : 'languages'}
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <div className={`mt-6 flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">
                      {isRTL ? 'منصة عالمية' : 'Global Platform'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Language Tags - Bottom Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { code: 'ar', name: 'العربية', flag: '🇸🇦' },
              { code: 'en', name: 'English', flag: '🇬🇧' },
              { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
              { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
              { code: 'ms', name: 'Melayu', flag: '🇲🇾' },
              { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
              { code: 'zh', name: '中文', flag: '🇨🇳' },
              { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
              { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
              { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
              { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
              { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            ].map((lang) => (
              <span
                key={lang.code}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            ))}
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
