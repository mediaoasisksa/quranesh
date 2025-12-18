import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, Clock, ArrowRight, CheckCircle2, Globe, Languages, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";

const DiplomaPromo = () => {
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";

  const content = {
    ar: {
      badge: "واجهة عالمية",
      title: "دبلوم تعلم اللغة العربية",
      subtitle: "بوابة زنجبار العالمية لتعليم اللغة العربية للمسلمين حول العالم",
      description: "منصة تعليمية عالمية تدعم 10 لغات، تنطلق من زنجبار كمركز إشعاع ثقافي ولغوي للمسلمين في أفريقيا وآسيا وأوروبا والعالم أجمع",
      features: [
        "240 مفردة قرآنية أساسية",
        "256 تمرين تفاعلي متنوع",
        "دعم 10 لغات عالمية",
        "شهادة إتمام معتمدة"
      ],
      cta: "انضم للمنصة العالمية",
      stats: {
        weeks: "12 أسبوع",
        vocabulary: "240 مفردة", 
        languages: "10 لغات"
      },
      globalBadge: "منصة عالمية",
      zanzibarTitle: "من زنجبار إلى العالم",
      zanzibarDesc: "بوابة أفريقيا لتعليم العربية",
      languages: ["العربية", "الإنجليزية", "الإندونيسية", "التركية", "الصينية", "السواحيلية", "الصومالية", "البوسنية", "الألبانية", "الروسية"]
    },
    en: {
      badge: "Global Platform",
      title: "Arabic Language Diploma",
      subtitle: "Zanzibar's Gateway to Arabic Language Learning for Muslims Worldwide",
      description: "A global educational platform supporting 10 languages, launching from Zanzibar as a cultural and linguistic beacon for Muslims across Africa, Asia, Europe, and the entire world",
      features: [
        "240 essential Quranic vocabulary",
        "256 diverse interactive exercises",
        "Support for 10 global languages",
        "Certified completion certificate"
      ],
      cta: "Join the Global Platform",
      stats: {
        weeks: "12 Weeks",
        vocabulary: "240 Words",
        languages: "10 Languages"
      },
      globalBadge: "Global Platform",
      zanzibarTitle: "From Zanzibar to the World",
      zanzibarDesc: "Africa's Gateway to Arabic Learning",
      languages: ["Arabic", "English", "Indonesian", "Turkish", "Chinese", "Swahili", "Somali", "Bosnian", "Albanian", "Russian"]
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  return (
    <section className={`py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-emerald-600 hover:bg-emerald-700" data-testid="badge-diploma-certified">
                    <Award className="h-4 w-4 mr-1" />
                    {t.badge}
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
                    <GraduationCap className="inline-block h-10 w-10 mr-3 mb-1" />
                    {t.title}
                  </h2>
                  
                  <p className="text-lg text-emerald-700 dark:text-emerald-400 mb-3">
                    {t.subtitle}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {t.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-200" data-testid={`text-diploma-feature-${index}`}>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/diploma">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6"
                      data-testid="button-subscribe-diploma"
                    >
                      {t.cta}
                      <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12 flex flex-col justify-center items-center text-white">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <MapPin className="h-8 w-8" />
                      <Globe className="h-12 w-12" />
                      <Languages className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" data-testid="text-zanzibar-title">
                      {t.zanzibarTitle}
                    </h3>
                    <p className="text-emerald-100 mb-4">
                      {t.zanzibarDesc}
                    </p>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4" data-testid="badge-global-platform">
                      <Globe className="h-3 w-3 mr-1" />
                      {t.globalBadge}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-6">
                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm" data-testid="text-diploma-stats-weeks">
                      <Clock className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">{t.stats.weeks}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm" data-testid="text-diploma-stats-vocabulary">
                      <BookOpen className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">{t.stats.vocabulary}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm" data-testid="text-diploma-stats-languages">
                      <Languages className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">{t.stats.languages}</div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-xs text-emerald-200 text-center mb-2">
                      {language === 'ar' ? 'متاح بـ 10 لغات:' : 'Available in 10 languages:'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {t.languages.map((lang, index) => (
                        <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded" data-testid={`text-language-${index}`}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DiplomaPromo;
