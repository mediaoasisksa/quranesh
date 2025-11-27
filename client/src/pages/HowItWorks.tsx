import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  User,
  BookOpen,
  MessageSquare,
  BarChart3,
  Trophy,
  Repeat,
  Users,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const HowItWorks = () => {
  const { t, dir } = useLanguage();

  const steps = [
    {
      step: "01",
      icon: User,
      title: t('createProfile') || "Create Your Profile",
      description:
        t('createProfileDesc') || "Sign up and tell us about your Quran memorization level and Arabic learning goals.",
      details:
        t('createProfileDetails') || "We'll assess your current knowledge and customize your learning path accordingly.",
    },
    {
      step: "02",
      icon: BookOpen,
      title: t('accessDatabase') || "Access Quranic Database",
      description:
        t('accessDatabaseDesc') || "Explore our comprehensive database of Quranic sentences organized by complexity and usage.",
      details:
        t('accessDatabaseDetails') || "Each verse comes with Arabic text, English translation, and real-life context examples.",
    },
    {
      step: "03",
      icon: MessageSquare,
      title: t('practiceWithAI') || "Practice with AI",
      description:
        t('practiceWithAIDesc') || "Engage in interactive exercises and conversations with our AI tutor.",
      details:
        t('practiceWithAIDetails') || "Practice pronunciation, sentence construction, and use Quranic expressions in daily scenarios.",
    },
    {
      step: "04",
      icon: BarChart3,
      title: t('trackProgress') || "Track Progress",
      description:
        t('trackProgressDesc') || "Monitor your learning journey with detailed analytics and weekly reports.",
      details:
        t('trackProgressDetails') || "See which verses you've mastered and get recommendations for continued learning.",
    },
  ];

  const exercises = [
    {
      icon: Repeat,
      title: t('substitutionDrill') || "Substitution Drill",
      description:
        t('substitutionDrillDesc') || "Replace words in Quranic phrases to understand structure and meaning.",
    },
    {
      icon: MessageSquare,
      title: t('dialoguePractice') || "Dialogue Practice",
      description:
        t('dialoguePracticeDesc') || "AI asks questions in English, you respond using appropriate Quranic expressions.",
    },
    {
      icon: BookOpen,
      title: t('completionExercise') || "Completion Exercise",
      description:
        t('completionExerciseDesc') || "Complete verses when given the beginning, testing your memorization and understanding.",
    },
    {
      icon: Users,
      title: t('rolePlay') || "Role Play",
      description:
        t('rolePlayDesc') || "Use Quranic verses in real-life emotional and interactive scenarios.",
    },
    {
      icon: Trophy,
      title: t('comparison') || "Comparison",
      description:
        t('comparisonDesc') || "Explain differences between similar verses to deepen comprehension.",
    },
    {
      icon: ArrowRight,
      title: t('transformation') || "Transformation",
      description:
        t('transformationDesc') || "Convert statements into questions and vice versa using Quranic Arabic.",
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('howWorks') || "How Quranic"}
              <span className="text-primary"> {t('works') || "Works"}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('howWorksDesc') || "A simple, structured approach to learning practical Arabic through the Quran you've already memorized."}
            </p>
          </div>
        </section>

        {/* Learning Process */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('yourLearningJourney') || "Your Learning Journey"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('followSteps') || "Follow these simple steps to transform your Quranic memorization into practical Arabic skills."}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="relative border-2 hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.details}
                    </p>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-primary/30" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Exercise Types */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('exerciseTypes') || "Interactive Exercise Types"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('exerciseTypesDesc') || "Engage with diverse exercise formats designed to reinforce your learning and build practical skills."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise, index) => (
                <Card
                  key={index}
                  className="border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <exercise.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {exercise.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {exercise.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('readyToBegin') || "Ready to Begin Your Journey?"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('readyToBeginDesc') || "Start transforming your Quranic memorization into practical Arabic communication skills today."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={() => (window.location.href = "/signup")}
              >
                {t('startLearningNow') || "Start Learning Now"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "/features")}
              >
                {t('exploreFeatures') || "Explore Features"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
