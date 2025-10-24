import { Card } from "@/components/ui/card";
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Users
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      titleKey: "aiPoweredLearning",
      descKey: "aiPoweredLearningDesc"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      titleKey: "interactiveConversations",
      descKey: "interactiveConversationsDesc"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      titleKey: "progressTracking",
      descKey: "progressTrackingDesc"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      titleKey: "quranicDatabase",
      descKey: "quranicDatabaseDesc"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      titleKey: "targetedExercises",
      descKey: "targetedExercisesDesc"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      titleKey: "communityLearning",
      descKey: "communityLearningDesc"
    }
  ];

  return (
    <section className="pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
          {/* Lottie Animation */}
          <div className="flex-shrink-0">
            <dotlottie-wc 
              src="https://lottie.host/88ad15d7-e627-4f11-a15e-a4a83747bdd1/VN2LlgZmDZ.lottie" 
              style={{width: '200px', height: '200px'}} 
              speed="1" 
              autoplay 
              loop
            ></dotlottie-wc>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {t('whyUs')}
            </h2>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{t(feature.titleKey as any)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(feature.descKey as any)}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
