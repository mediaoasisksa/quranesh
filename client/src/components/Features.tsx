import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Users,
  CheckCircle,
  ArrowRight 
} from "lucide-react";
import { Link } from "wouter";
import aiTutor from "@assets/ai-tutor_1757702249883.jpg";
import dashboardPreview from "@assets/dashboard-preview_1757702249889.jpg";

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

  const learningTypes = [
    "Short Daily Conversations",
    "Complex Sentence Structures", 
    "Commands & Guidance",
    "Parables & Metaphors"
  ];

  const exercises = [
    "Substitution Drill",
    "Dialogue Practice", 
    "Completion Exercises",
    "Comparison Analysis",
    "Role Play Scenarios",
    "Transformation Practice"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Why Choose Our
            <span className="block text-primary">Learning Platform?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Designed specifically for Huffaz who want to bridge their memorized Quranic knowledge 
            with practical Arabic communication skills.
          </p>
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

        {/* How It Works Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-foreground">Structured Learning Approach</h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our platform categorizes Quranic content into practical learning modules, 
              making it easy to progress from basic expressions to complex conversations.
            </p>
            
            <div className="space-y-4 mb-8">
              {learningTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{type}</span>
                </div>
              ))}
            </div>
            
            <Link href="/login">
              <Button variant="default" size="lg">
                Explore Learning Modules
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <img 
              src={aiTutor} 
              alt="AI Tutor Interface" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">AI Tutor</div>
              <div className="text-sm opacity-90">Always Available</div>
            </div>
          </div>
        </div>

        {/* Interactive Exercises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <img 
              src={dashboardPreview} 
              alt="Learning Dashboard" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -top-6 -left-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">Progress</div>
              <div className="text-sm opacity-90">Real-time Tracking</div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-bold mb-6 text-foreground">Interactive Exercise Types</h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Engage with diverse exercise formats designed to reinforce your learning 
              through practical application and repetition.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {exercises.map((exercise, index) => (
                <div key={index} className="bg-secondary/50 p-4 rounded-lg">
                  <span className="text-secondary-foreground font-medium">{exercise}</span>
                </div>
              ))}
            </div>
            
            <Link href="/login">
              <Button variant="accent" size="lg">
                Try Interactive Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
