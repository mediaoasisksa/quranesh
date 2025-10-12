import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  MessageCircle,
  BarChart3,
  BookOpen,
  Users,
  Zap,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Advanced AI technology adapts to your learning pace and provides personalized feedback on pronunciation and comprehension.",
      details: [
        "Real-time pronunciation correction",
        "Adaptive difficulty levels",
        "Personalized learning paths",
      ],
    },
    {
      icon: MessageCircle,
      title: "Interactive Conversations",
      description:
        "Practice real-world Arabic conversations using Quranic expressions with our intelligent conversation partner.",
      details: [
        "Daily life scenarios",
        "Contextual responses",
        "Natural conversation flow",
      ],
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Monitor your journey with detailed analytics showing mastered verses, areas for improvement, and learning streaks.",
      details: [
        "Weekly progress reports",
        "Mastery tracking",
        "Performance analytics",
      ],
    },
    {
      icon: BookOpen,
      title: "Comprehensive Database",
      description:
        "Access thousands of Quranic sentences categorized by usage, complexity, and real-life applications.",
      details: [
        "Categorized by complexity",
        "Real-life contexts",
        "Translation support",
      ],
    },
    {
      icon: Users,
      title: "Community Learning",
      description:
        "Connect with fellow learners, share progress, and practice together in a supportive environment.",
      details: ["Study groups", "Peer practice", "Community challenges"],
    },
    {
      icon: Zap,
      title: "Interactive Exercises",
      description:
        "Engage with various exercise types including substitution drills, dialogue practice, and role-playing scenarios.",
      details: ["6 exercise types", "Gamified learning", "Instant feedback"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Powerful Features for
              <span className="text-primary"> Quranic</span> Learning
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the comprehensive tools and features that make Quranic
              the most effective way to learn practical Arabic through the
              Quran.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-center"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of learners who are already mastering Quranic
              Arabic with Quranic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={() => (window.location.href = "/signup")}
              >
                Start Learning Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "/pricing")}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
