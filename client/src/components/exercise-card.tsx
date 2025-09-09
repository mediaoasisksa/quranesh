import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AudioButton from "./audio-button";
import type { Phrase } from "@shared/schema";

interface ExerciseCardProps {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  phrase?: Phrase;
  onStart: (type: string, phraseId?: string) => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function ExerciseCard({ 
  type, 
  title, 
  description, 
  icon, 
  phrase, 
  onStart, 
  variant = 'primary' 
}: ExerciseCardProps) {
  const [userInput, setUserInput] = useState("");

  const variantStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary", 
    accent: "bg-accent/10 text-accent"
  };

  const buttonStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90"
  };

  const handleStart = () => {
    onStart(type, phrase?.id);
  };

  const renderExerciseContent = () => {
    switch (type) {
      case 'substitution':
        return phrase ? (
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-3">
              <p className="arabic-text text-lg text-foreground mb-2" lang="ar" data-testid="text-phrase-arabic">
                {phrase.arabicText}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-phrase-english">
                {phrase.englishTranslation}
              </p>
            </div>
            <p className="text-sm text-foreground mb-3">Replace a word with another attribute you know:</p>
            <Input 
              type="text" 
              className="arabic-text text-right" 
              placeholder="اكتب صفة أخرى..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              data-testid="input-substitution"
            />
          </div>
        ) : null;

      case 'conversation':
        return (
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-3">
              <p className="text-sm text-foreground font-medium mb-2">How do you say:</p>
              <p className="text-foreground" data-testid="text-conversation-prompt">
                "God is watching everything you do"
              </p>
            </div>
            <Textarea 
              className="arabic-text text-right" 
              rows={2} 
              placeholder="أجب بالعربية باستخدام آية قرآنية..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              data-testid="textarea-conversation"
            />
          </div>
        );

      case 'completion':
        return phrase ? (
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-3">
              <p className="arabic-text text-lg text-foreground mb-2" lang="ar" data-testid="text-completion-prompt">
                إِنَّ اللَّهَ يُحِبُّ ...
              </p>
              <p className="text-sm text-muted-foreground">Indeed, Allah loves...</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['المحسنين', 'المتوكلين', 'الصابرين', 'المقسطين'].map((option, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="arabic-text text-sm hover:bg-muted transition-colors"
                  onClick={() => setUserInput(option)}
                  data-testid={`button-completion-${index}`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : null;

      case 'comparison':
        return (
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-3 space-y-3">
              <div>
                <p className="arabic-text text-sm text-foreground mb-1" lang="ar" data-testid="text-comparison-phrase1">
                  إِنَّ مَعَ الْعُسْرِ يُسْرًا
                </p>
                <p className="text-xs text-muted-foreground">Indeed, with hardship comes ease</p>
              </div>
              <hr className="border-border" />
              <div>
                <p className="arabic-text text-sm text-foreground mb-1" lang="ar" data-testid="text-comparison-phrase2">
                  إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
                </p>
                <p className="text-xs text-muted-foreground">Indeed, Allah is with the patient</p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-2">Explain the difference in Arabic:</p>
            <Textarea 
              className="arabic-text text-right" 
              rows={2}
              placeholder="اشرح الفرق..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              data-testid="textarea-comparison"
            />
          </div>
        );

      case 'roleplay':
        return (
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-3">
              <div className="flex items-start space-x-3">
                <div className="mt-1">👥</div>
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">Scenario:</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-roleplay-scenario">
                    Your friend is sad and needs comfort. Console them using a Quranic verse.
                  </p>
                </div>
              </div>
            </div>
            <Textarea 
              className="arabic-text text-right" 
              rows={2} 
              placeholder="استخدم آية مناسبة للمواساة..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              data-testid="textarea-roleplay"
            />
          </div>
        );

      case 'transformation':
        return phrase ? (
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-3">
              <p className="text-xs text-muted-foreground mb-2">Statement:</p>
              <p className="arabic-text text-sm text-foreground mb-2" lang="ar" data-testid="text-transformation-statement">
                {phrase.arabicText}
              </p>
              <p className="text-xs text-muted-foreground mb-3">{phrase.englishTranslation}</p>
              <p className="text-xs text-muted-foreground">Convert to a question:</p>
            </div>
            <Input 
              type="text" 
              className="arabic-text text-right" 
              placeholder="حوّل إلى سؤال..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              data-testid="input-transformation"
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Card className="exercise-card bg-card rounded-lg" data-testid={`card-exercise-${type}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${variantStyles[variant]}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground" data-testid={`text-exercise-title-${type}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-exercise-description-${type}`}>
              {description}
            </p>
          </div>
        </div>
        
        {renderExerciseContent()}
        
        <div className="flex justify-between items-center">
          {phrase && (
            <AudioButton 
              text={phrase.arabicText}
              lang="ar-SA"
              className="text-primary hover:text-primary/80"
              data-testid={`button-audio-exercise-${type}`}
            />
          )}
          {!phrase && <div />}
          <Button 
            className={`text-sm transition-colors ${buttonStyles[variant]}`}
            onClick={handleStart}
            data-testid={`button-start-exercise-${type}`}
          >
            Start Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
