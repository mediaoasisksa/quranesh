import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, X, RotateCcw, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AudioButton from "@/components/audio-button";
import { apiRequest } from "@/lib/queryClient";
import { getExerciseType } from "@/lib/exercises";
import type { Phrase, ExerciseSession } from "@shared/schema";

const DEMO_USER_ID = "demo-user";

export default function Exercise() {
  const [, params] = useRoute("/exercise/:type/:phraseId?");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const exerciseType = params?.type;
  const phraseId = params?.phraseId;

  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Fetch the specific phrase or get a random one
  const { data: phrase, isLoading } = useQuery<Phrase>({
    queryKey: phraseId ? ['/api/phrases', phraseId] : ['/api/phrases/random', exerciseType],
    enabled: !!exerciseType,
  });

  // Submit exercise session mutation
  const submitSessionMutation = useMutation({
    mutationFn: async (data: { 
      userId: string; 
      exerciseType: string; 
      phraseId: string; 
      userAnswer: string; 
      correctAnswer: string; 
      isCorrect: string; 
    }) => {
      const response = await apiRequest("POST", "/api/exercise-sessions", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to update stats
      queryClient.invalidateQueries({ queryKey: ['/api/daily-stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-stats'] });
    },
  });

  const exerciseConfig = getExerciseType(exerciseType || '');

  useEffect(() => {
    if (!exerciseType || !exerciseConfig) {
      setLocation('/');
    }
  }, [exerciseType, exerciseConfig, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading exercise...</p>
      </div>
    );
  }

  if (!phrase || !exerciseConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Exercise not found</p>
          <Button onClick={() => setLocation('/')} data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "No answer provided",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    let correct = false;
    let correctAnswer = "";
    let feedbackMessage = "";

    switch (exerciseType) {
      case 'substitution':
        // Simple check for Arabic text (any meaningful Arabic input)
        correct = /[\u0600-\u06FF]/.test(userAnswer);
        correctAnswer = "Any valid Arabic attribute";
        feedbackMessage = correct 
          ? "Good! You provided an Arabic attribute."
          : "Please provide an Arabic word or phrase.";
        break;

      case 'conversation':
        // Check if response contains Arabic and relates to the context
        correct = /[\u0600-\u06FF]/.test(userAnswer) && userAnswer.length > 5;
        correctAnswer = "وَاللَّهُ بِمَا تَعۡمَلُونَ بَصِيرٌ";
        feedbackMessage = correct 
          ? "Excellent use of Quranic Arabic in conversation!"
          : "Try using a relevant Quranic verse in Arabic.";
        break;

      case 'completion':
        // Check against common completions
        const validCompletions = ['المحسنين', 'المتوكلين', 'الصابرين', 'المقسطين'];
        correct = validCompletions.some(completion => userAnswer.includes(completion));
        correctAnswer = validCompletions.join(' or ');
        feedbackMessage = correct 
          ? "Perfect! You completed the verse correctly."
          : "Try one of the common attributes that Allah loves.";
        break;

      case 'comparison':
        // Check for meaningful Arabic explanation
        correct = /[\u0600-\u06FF]/.test(userAnswer) && userAnswer.length > 10;
        correctAnswer = "Explanation in Arabic showing understanding of differences";
        feedbackMessage = correct 
          ? "Great analysis! You explained the difference well."
          : "Provide a more detailed explanation in Arabic.";
        break;

      case 'roleplay':
        // Check for comforting Quranic verse
        correct = /[\u0600-\u06FF]/.test(userAnswer) && 
                 (userAnswer.includes('العسر') || userAnswer.includes('الله') || userAnswer.includes('الصبر'));
        correctAnswer = "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا";
        feedbackMessage = correct 
          ? "Beautiful! You used an appropriate verse for comfort."
          : "Try using a verse about patience, hope, or Allah's help.";
        break;

      case 'transformation':
        // Check if converted to question form
        correct = userAnswer.includes('من') || userAnswer.includes('ما') || userAnswer.includes('متى') || userAnswer.includes('؟');
        correctAnswer = "مَن يُحِبُّ اللَّهُ؟";
        feedbackMessage = correct 
          ? "Excellent transformation to question form!"
          : "Convert the statement to a question using question words.";
        break;

      default:
        correct = false;
        correctAnswer = "";
        feedbackMessage = "Unknown exercise type.";
    }

    setIsCorrect(correct);
    setFeedback(feedbackMessage);
    setIsAnswered(true);

    // Submit the session
    submitSessionMutation.mutate({
      userId: DEMO_USER_ID,
      exerciseType: exerciseType || '',
      phraseId: phrase.id,
      userAnswer,
      correctAnswer,
      isCorrect: correct ? 'true' : 'false'
    });

    toast({
      title: correct ? "Correct!" : "Try Again",
      description: feedbackMessage,
      variant: correct ? "default" : "destructive"
    });
  };

  const resetExercise = () => {
    setUserAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback("");
  };

  const goToNextExercise = () => {
    // Navigate to a random exercise
    setLocation('/');
  };

  const renderExerciseContent = () => {
    switch (exerciseType) {
      case 'substitution':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="arabic-text text-xl text-foreground mb-3" lang="ar" data-testid="text-phrase-display">
                {phrase.arabicText}
              </p>
              <p className="text-muted-foreground" data-testid="text-phrase-translation">
                {phrase.englishTranslation}
              </p>
            </div>
            <p className="text-foreground">
              Replace a word with another attribute you know from the Quran:
            </p>
            <Input
              className="arabic-text text-right text-lg"
              placeholder="اكتب صفة أخرى..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="input-substitution-answer"
            />
          </div>
        );

      case 'conversation':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground font-medium mb-2">How do you say in Arabic:</p>
              <p className="text-lg text-foreground" data-testid="text-conversation-prompt">
                "God is watching everything you do"
              </p>
            </div>
            <p className="text-foreground">
              Respond using a relevant Quranic verse in Arabic:
            </p>
            <Textarea
              className="arabic-text text-right text-lg min-h-[100px]"
              placeholder="أجب بالعربية باستخدام آية قرآنية..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="textarea-conversation-answer"
            />
          </div>
        );

      case 'completion':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="arabic-text text-xl text-foreground mb-3" lang="ar" data-testid="text-completion-prompt">
                إِنَّ اللَّهَ يُحِبُّ ...
              </p>
              <p className="text-muted-foreground">Indeed, Allah loves...</p>
            </div>
            <p className="text-foreground">Complete the verse:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['المحسنين', 'المتوكلين', 'الصابرين', 'المقسطين'].map((option, index) => (
                <Button
                  key={index}
                  variant={userAnswer === option ? "default" : "outline"}
                  className="arabic-text text-lg p-4 h-auto"
                  onClick={() => setUserAnswer(option)}
                  disabled={isAnswered}
                  data-testid={`button-completion-option-${index}`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
              <div>
                <p className="arabic-text text-lg text-foreground mb-2" lang="ar" data-testid="text-comparison-verse1">
                  إِنَّ مَعَ الْعُسْرِ يُسْرًا
                </p>
                <p className="text-sm text-muted-foreground">Indeed, with hardship comes ease</p>
              </div>
              <hr className="border-border" />
              <div>
                <p className="arabic-text text-lg text-foreground mb-2" lang="ar" data-testid="text-comparison-verse2">
                  إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
                </p>
                <p className="text-sm text-muted-foreground">Indeed, Allah is with the patient</p>
              </div>
            </div>
            <p className="text-foreground">Explain the difference between these verses in Arabic:</p>
            <Textarea
              className="arabic-text text-right text-lg min-h-[120px]"
              placeholder="اشرح الفرق بين الآيتين..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="textarea-comparison-answer"
            />
          </div>
        );

      case 'roleplay':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="text-foreground font-medium mb-2">Scenario:</p>
                  <p className="text-foreground" data-testid="text-roleplay-scenario">
                    Your friend is going through a difficult time and feels hopeless. 
                    Console them using an appropriate Quranic verse that offers hope and comfort.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-foreground">Your response in Arabic:</p>
            <Textarea
              className="arabic-text text-right text-lg min-h-[100px]"
              placeholder="استخدم آية مناسبة للمواساة والأمل..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="textarea-roleplay-answer"
            />
          </div>
        );

      case 'transformation':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Statement:</p>
              <p className="arabic-text text-xl text-foreground mb-3" lang="ar" data-testid="text-transformation-statement">
                {phrase.arabicText}
              </p>
              <p className="text-muted-foreground mb-4">{phrase.englishTranslation}</p>
              <p className="text-sm text-muted-foreground">Convert this statement to a question:</p>
            </div>
            <Input
              className="arabic-text text-right text-lg"
              placeholder="حوّل إلى سؤال..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="input-transformation-answer"
            />
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unknown exercise type.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-foreground" data-testid="text-exercise-title">
                {exerciseConfig?.title}
              </h1>
              <p className="text-sm text-muted-foreground">{exerciseConfig?.description}</p>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Exercise Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Exercise</span>
              <div className="flex items-center space-x-2">
                <AudioButton 
                  text={phrase.arabicText} 
                  lang="ar-SA"
                  data-testid="button-audio-phrase"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderExerciseContent()}

            {/* Feedback */}
            {isAnswered && (
              <div className={`mt-6 p-4 rounded-lg border ${
                isCorrect 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Try Again'}
                  </span>
                </div>
                <p className={`text-sm ${
                  isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`} data-testid="text-exercise-feedback">
                  {feedback}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={resetExercise}
                disabled={!isAnswered}
                data-testid="button-reset-exercise"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <div className="space-x-2">
                {!isAnswered ? (
                  <Button 
                    onClick={checkAnswer}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-check-answer"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={goToNextExercise}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    data-testid="button-next-exercise"
                  >
                    Next Exercise
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context Information */}
        <Card>
          <CardHeader>
            <CardTitle>About This Phrase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Source</p>
                <p className="text-foreground" data-testid="text-phrase-source">{phrase.surahAyah}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                <p className="text-foreground capitalize" data-testid="text-phrase-category">{phrase.category}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Life Application</p>
              <p className="text-foreground" data-testid="text-phrase-application">{phrase.lifeApplication}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
