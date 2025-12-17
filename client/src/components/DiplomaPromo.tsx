import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";

const DiplomaPromo = () => {
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";

  const content = {
    ar: {
      badge: "برنامج معتمد",
      title: "دبلوم تعلم اللغة العربية",
      subtitle: "12 أسبوعًا لإتقان العربية باستخدام المفردات القرآنية كمصدر لغوي",
      description: "برنامج شامل ومنظم يأخذك من الأساسيات إلى الإتقان، مع تمارين عملية ومتابعة تقدم مستمرة",
      features: [
        "120 مفردة قرآنية أساسية",
        "48 تمرين تفاعلي",
        "شهادة إتمام معتمدة",
        "تقدم محفوظ ومتابعة مستمرة"
      ],
      cta: "اشترك الآن في الدبلوم",
      stats: {
        weeks: "12 أسبوع",
        vocabulary: "120 مفردة", 
        exercises: "48 تمرين"
      }
    },
    en: {
      badge: "Certified Program",
      title: "Arabic Language Diploma",
      subtitle: "12 weeks to master Arabic using Quranic vocabulary as a linguistic corpus",
      description: "A comprehensive, structured program that takes you from basics to mastery, with practical exercises and continuous progress tracking",
      features: [
        "120 essential Quranic vocabulary",
        "48 interactive exercises",
        "Certificate of completion",
        "Saved progress & tracking"
      ],
      cta: "Subscribe to the Diploma",
      stats: {
        weeks: "12 Weeks",
        vocabulary: "120 Words",
        exercises: "48 Exercises"
      }
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
                  <div className="text-center mb-8">
                    <GraduationCap className="h-24 w-24 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-2">
                      {language === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey'}
                    </h3>
                    <p className="text-emerald-100">
                      {language === 'ar' ? 'انضم لآلاف المتعلمين' : 'Join thousands of learners'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
                    <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm" data-testid="text-diploma-stats-weeks">
                      <Clock className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-xl font-bold">{t.stats.weeks}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm" data-testid="text-diploma-stats-vocabulary">
                      <BookOpen className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-xl font-bold">{t.stats.vocabulary}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm" data-testid="text-diploma-stats-exercises">
                      <Award className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-xl font-bold">{t.stats.exercises}</div>
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
