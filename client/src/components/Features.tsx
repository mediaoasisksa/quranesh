import { Card } from "@/components/ui/card";
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Users
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI-Powered Learning",
      description: "Advanced AI technology adapts to your learning pace and provides personalized exercises based on your Quranic knowledge."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Interactive Conversations",
      description: "Practice real-life dialogues using Quranic expressions. Role-play scenarios help you apply verses in everyday situations."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor your advancement with detailed analytics. Track pronunciation, grammar accuracy, and vocabulary expansion."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Quranic Database",
      description: "Access thousands of classified Quranic sentences with translations, contexts, and practical usage examples."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Targeted Exercises",
      description: "Substitution drills, completion exercises, and transformation practices designed specifically for Huffaz learners."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community Learning",
      description: "Connect with fellow Huffaz worldwide. Share progress, practice together, and learn from each other's experiences."
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
              Why  <span className="block text-primary"> Us?</span>
            </h2>
            {/*<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Designed specifically for Huffaz who want to bridge their memorized Quranic knowledge 
              with practical Arabic communication skills.
            </p>*/}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
