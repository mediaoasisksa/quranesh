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
import { getExerciseType, getRandomExerciseType } from "@/lib/exercises";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Phrase, ExerciseSession, QuestionBank, PhilosophicalSentence } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import LanguageToggle from "@/components/language-toggle";

export default function Exercise() {
  const [, params] = useRoute("/exercise/:type/:phraseId?");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t, dir } = useLanguage();

  // Use the actual user ID instead of hardcoded demo user
  const userId = user?.id || "demo-user";

  const exerciseType = params?.type;
  const phraseId = params?.phraseId;

  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Fetch data based on exercise type
  const isThematicExercise = exerciseType === "thematic";
  const isTransformationExercise = exerciseType === "transformation";
  const isConversationExercise = exerciseType === "conversation";

  // For transformation exercises, fetch philosophical sentences
  const { data: philosophicalSentence, isLoading: philosophicalLoading } = useQuery<PhilosophicalSentence>({
    queryKey: ["/api/philosophical-sentences/random", userId],
    queryFn: async () => {
      const response = await fetch(`/api/philosophical-sentences/random?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch philosophical sentence");
      return response.json();
    },
    enabled: !!exerciseType && isTransformationExercise,
  });

  // For thematic exercises, fetch question banks; for others, fetch phrases
  const { data: phrase, isLoading: phraseLoading, error: phraseError } = useQuery<Phrase>({
    queryKey: phraseId
      ? ["/api/phrases", phraseId]
      : ["/api/phrases/random", exerciseType, userId],
    queryFn: phraseId
      ? async () => {
          const response = await fetch(`/api/phrases/${phraseId}`);
          if (!response.ok) throw new Error("Failed to fetch phrase");
          return response.json();
        }
      : async () => {
          const response = await fetch(
            `/api/phrases/random/${exerciseType}?userId=${userId}`
          );
          if (!response.ok) throw new Error("Failed to fetch phrase");
          return response.json();
        },
    enabled: !!exerciseType && !isThematicExercise && !isTransformationExercise,
  });

  const { data: questionBank, isLoading: questionBankLoading } = useQuery<
    QuestionBank & { associatedPhrases: Phrase[] }
  >({
    queryKey: ["/api/question-banks/random/thematic"],
    enabled: !!exerciseType && isThematicExercise,
  });

  const { data: conversationPrompt, isLoading: conversationLoading } = useQuery<{
    id: string;
    question: string;
    suggestedVerse: string;
    category: string | null;
    symbolicMeaning?: string | null;
  }>({
    queryKey: ["/api/conversation-prompts/random", userId],
    queryFn: async () => {
      const response = await fetch(`/api/conversation-prompts/random?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch conversation prompt");
      return response.json();
    },
    enabled: !!exerciseType && isConversationExercise,
  });

  const isLoading = isTransformationExercise ? philosophicalLoading : (isThematicExercise ? questionBankLoading : (isConversationExercise ? conversationLoading : phraseLoading));
  const exerciseData = isTransformationExercise ? philosophicalSentence : (isThematicExercise ? questionBank : (isConversationExercise ? conversationPrompt : phrase));

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
      queryClient.invalidateQueries({ queryKey: ["/api/daily-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-stats"] });
      
      // CRITICAL: Invalidate random phrases cache so non-repetition system works
      // This forces React Query to fetch new phrases from server with updated completed list
      queryClient.invalidateQueries({ queryKey: ["/api/phrases/random"] });
      queryClient.invalidateQueries({ queryKey: ["/api/philosophical-sentences/random"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversation-prompts/random", userId] });
    },
  });

  const exerciseConfig = getExerciseType(exerciseType || "");

  useEffect(() => {
    if (!exerciseType || !exerciseConfig) {
      setLocation("/dashboard");
    }
  }, [exerciseType, exerciseConfig, setLocation]);

  // Reset exercise state when new question is loaded
  useEffect(() => {
    setUserAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback("");
  }, [phrase?.id, philosophicalSentence?.id, conversationPrompt?.id, questionBank?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('loadingExercise')}</p>
      </div>
    );
  }

  if (!exerciseData || !exerciseConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t('exerciseNotFound')}</p>
          <Button
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToDashboard')}
          </Button>
        </div>
      </div>
    );
  }

  const checkAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: t('noAnswerProvided'),
        description: t('pleaseProvideAnswer'),
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      console.log("=== AI VALIDATION REQUEST ===");
      console.log("User Answer:", userAnswer);
      console.log("Exercise Type:", exerciseType);
      console.log("Phrase ID:", phraseId);
      console.log("Question Bank ID:", questionBank?.id);
      console.log("=============================");

      // Call AI validation API
      const response = await fetch("/api/validate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAnswer,
          exerciseType,
          phraseId: exerciseType === "thematic" ? null : (exerciseType === "transformation" ? philosophicalSentence?.id : (phraseId || phrase?.id)),
          questionBankId: questionBank?.id,
          philosophicalSentenceId: exerciseType === "transformation" ? philosophicalSentence?.id : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log("AI Validation Result:", result);

      setIsCorrect(result.isCorrect);
      setFeedback(result.feedback);
      setIsAnswered(true);

      // Show appropriate toast based on result
      if (result.isCorrect) {
        toast({
          title: "Excellent!",
          description: result.feedback,
          variant: "default",
        });
      } else {
        toast({
          title: "Keep trying!",
          description: result.feedback,
          variant: "destructive",
        });
      }

      // Show suggestions if available
      if (result.suggestions && result.suggestions.length > 0) {
        setTimeout(() => {
          toast({
            title: "Suggestions:",
            description: result.suggestions.join(", "),
            variant: "default",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("AI validation error:", error);

      // Fallback to basic validation
      const hasArabic = /[\u0600-\u06FF]/.test(userAnswer);
      const hasContent = userAnswer.trim().length > 2;

      setIsCorrect(hasArabic && hasContent);
      setFeedback(
        hasArabic && hasContent
          ? "Answer contains Arabic text. AI validation is temporarily unavailable."
          : "Please provide an answer in Arabic. AI validation is temporarily unavailable.",
      );
      setIsAnswered(true);

      toast({
        title: "AI Service Unavailable",
        description:
          "Using basic validation. AI service is temporarily unavailable.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }

    // Submit the session
    const dataId =
      isThematicExercise && questionBank
        ? questionBank.id
        : isTransformationExercise && philosophicalSentence
        ? philosophicalSentence.id
        : isConversationExercise && conversationPrompt
        ? conversationPrompt.id
        : phrase?.id || "unknown";
    submitSessionMutation.mutate({
      userId: userId,
      exerciseType: exerciseType || "",
      phraseId: dataId,
      userAnswer,
      correctAnswer: "AI Validated", // AI provides dynamic feedback
      isCorrect: isCorrect ? "true" : "false",
    });
  };

  const resetExercise = () => {
    setUserAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback("");
  };

  const goToNextExercise = async () => {
    try {
      console.log("=== NEXT EXERCISE DEBUG ===");

      // Stay in the same exercise type
      const currentExerciseType = exerciseType || "conversation";
      console.log("Staying in exercise type:", currentExerciseType);

      // Reset the exercise state
      resetExercise();

      // Invalidate the appropriate cache based on current exercise type
      if (currentExerciseType === "transformation") {
        await queryClient.invalidateQueries({
          queryKey: ["/api/philosophical-sentences/random", userId],
        });
      } else if (currentExerciseType === "conversation") {
        await queryClient.invalidateQueries({
          queryKey: ["/api/conversation-prompts/random", userId],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["/api/phrases/random", currentExerciseType, userId],
        });
      }

      // Navigate to the same exercise type without phraseId (will fetch random with non-repetition)
      const newPath = `/exercise/${currentExerciseType}`;
      console.log("Navigating to:", newPath);
      setLocation(newPath);
    } catch (error) {
      console.error("Error in goToNextExercise:", error);
      setLocation("/dashboard");
    }
  };

  const renderExerciseContent = () => {
    if (isThematicExercise && questionBank) {
      return (
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3
              className="text-lg font-semibold mb-3 text-foreground"
              data-testid="text-question-theme"
            >
              {questionBank.theme}
            </h3>
            <p
              className="text-muted-foreground mb-3"
              data-testid="text-question-theme-english"
            >
              {questionBank.themeEnglish}
            </p>
            <p
              className="arabic-text text-xl text-foreground mb-3"
              lang="ar"
              data-testid="text-question-display"
            >
              {questionBank.description || "سؤال موضوعي"}
            </p>
            <p
              className="text-muted-foreground"
              data-testid="text-question-english"
            >
              What Quranic verse would you use in this situation?
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Related themes: {questionBank.tags?.join(", ") || "None"}</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Provide a Quranic verse that relates to this situation:
            </label>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Write the Arabic verse that applies to this situation..."
              className="min-h-[100px] arabic-text text-right"
              dir="rtl"
              lang="ar"
              data-testid="textarea-thematic-answer"
              disabled={isAnswered}
            />
          </div>
        </div>
      );
    }

    // For transformation exercises, we use philosophicalSentence instead of phrase
    if (!phrase && !isTransformationExercise) return null;

    switch (exerciseType) {
      case "substitution":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p
                className="arabic-text text-xl text-foreground mb-3"
                lang="ar"
                data-testid="text-phrase-display"
              >
                {phrase?.arabicText}
              </p>
              <p
                className="text-muted-foreground"
                data-testid="text-phrase-translation"
              >
                {phrase?.englishTranslation}
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

      case "conversation":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground font-medium mb-2">
                {t('conversationPromptLabel') || "في هذا الموقف:"}
              </p>
              <p
                className="arabic-text text-xl text-foreground mb-3"
                lang="ar"
                data-testid="text-conversation-prompt"
              >
                {conversationPrompt?.question || "..."}
              </p>
            </div>
            <p className="text-foreground">
              {t('conversationInstruction') || "اكتب آية قرآنية تعطي نفس الإيحاء:"}
            </p>
            <Textarea
              className="arabic-text text-right text-lg min-h-[100px]"
              placeholder="اكتب آية قرآنية..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="textarea-conversation-answer"
            />
            {isAnswered && conversationPrompt?.suggestedVerse && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  {t('suggestedVerse') || "آية مقترحة:"}
                </p>
                <p className="arabic-text text-lg text-green-900 dark:text-green-100" lang="ar">
                  {conversationPrompt.suggestedVerse}
                </p>
              </div>
            )}
          </div>
        );

      case "completion":
        const completionOptions = [
          { arabic: "المحسنين", english: "the doers of good" },
          { arabic: "المتوكلين", english: "those who put trust (in God)" },
          { arabic: "الصابرين", english: "the patient ones" },
          { arabic: "المقسطين", english: "those who are just" },
        ];

        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p
                className="arabic-text text-xl text-foreground mb-3"
                lang="ar"
                data-testid="text-completion-prompt"
              >
                إِنَّ اللَّهَ يُحِبُّ ...
              </p>
              <p className="text-muted-foreground">Indeed, Allah loves...</p>
            </div>
            <p className="text-foreground">Complete the verse:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {completionOptions.map((option, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          userAnswer === option.arabic ? "default" : "outline"
                        }
                        className="arabic-text text-lg p-4 h-auto"
                        onClick={() => setUserAnswer(option.arabic)}
                        disabled={isAnswered}
                        data-testid={`button-completion-option-${index}`}
                      >
                        {option.arabic}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{option.english}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        );

      case "comparison":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
              <div>
                <p
                  className="arabic-text text-lg text-foreground mb-2"
                  lang="ar"
                  data-testid="text-comparison-verse1"
                >
                  إِنَّ مَعَ الْعُسْرِ يُسْرًا
                </p>
                <p className="text-sm text-muted-foreground">
                  Indeed, with hardship comes ease
                </p>
              </div>
              <hr className="border-border" />
              <div>
                <p
                  className="arabic-text text-lg text-foreground mb-2"
                  lang="ar"
                  data-testid="text-comparison-verse2"
                >
                  إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
                </p>
                <p className="text-sm text-muted-foreground">
                  Indeed, Allah is with the patient
                </p>
              </div>
            </div>
            <p className="text-foreground">
              Explain the difference between these verses in Arabic:
            </p>
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

      case "roleplay":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="text-foreground font-medium mb-2">Scenario:</p>
                  <p
                    className="text-foreground"
                    data-testid="text-roleplay-scenario"
                  >
                    Your friend is going through a difficult time and feels
                    hopeless. Console them using an appropriate Quranic verse
                    that offers hope and comfort.
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

      case "transformation":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t('philosophicalSentenceLabel')}
              </p>
              <p
                className="arabic-text text-xl text-foreground mb-3"
                lang="ar"
                dir="rtl"
                data-testid="text-transformation-philosophical"
              >
                💎 {philosophicalSentence?.arabicText || "جاري التحميل..."}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('transformationInstruction')}
              </p>
            </div>
            <Textarea
              className="arabic-text text-right text-lg min-h-[100px]"
              placeholder={t('transformationPlaceholder')}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              dir="rtl"
              lang="ar"
              data-testid="textarea-transformation"
            />
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unknown exercise type.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Language Toggle - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToDashboard')}
            </Button>
            <div className="text-center flex-1">
              <h1
                className="text-lg font-semibold text-foreground"
                data-testid="text-exercise-title"
              >
                {exerciseConfig ? t(exerciseConfig.titleKey as any) : ''}
              </h1>
              <p className="text-sm text-muted-foreground">
                {exerciseConfig ? t(exerciseConfig.descriptionKey as any) : ''}
              </p>
            </div>
            <div className="w-32"></div>
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
                {isThematicExercise && questionBank ? (
                  <span className="text-sm text-muted-foreground">
                    Thematic Question
                  </span>
                ) : phrase ? (
                  <AudioButton
                    text={
                      exerciseType === "completion"
                        ? "إِنَّ اللَّهَ يُحِبُّ المتوكلين" // Use a sample completion for audio
                        : phrase.arabicText
                    }
                    lang="ar-SA"
                    data-testid="button-audio-phrase"
                  />
                ) : null}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderExerciseContent()}

            {/* Feedback */}
            {isAnswered && (
              <div
                className={`mt-6 p-4 rounded-lg border ${
                  isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      isCorrect
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {isCorrect ? t('correct') : t('incorrect')}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    isCorrect
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                  data-testid="text-exercise-feedback"
                >
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
                {t('tryAgain')}
              </Button>

              <div className="space-x-2">
                {!isAnswered ? (
                  <Button
                    onClick={checkAnswer}
                    disabled={isValidating}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-check-answer"
                  >
                    {isValidating ? t('aiChecking') : t('checkAnswer')}
                  </Button>
                ) : (
                  <Button
                    onClick={goToNextExercise}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    data-testid="button-next-exercise"
                  >
                    {t('nextExercise')}
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
            <CardTitle>
              {isThematicExercise ? "About This Question" : "About This Phrase"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isThematicExercise && questionBank ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Theme
                    </p>
                    <p
                      className="text-foreground"
                      data-testid="text-question-theme"
                    >
                      {questionBank.themeEnglish}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Difficulty
                    </p>
                    <p
                      className="text-foreground"
                      data-testid="text-question-difficulty"
                    >
                      {questionBank.difficulty}/5
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </p>
                  <p
                    className="text-foreground"
                    data-testid="text-question-description"
                  >
                    {questionBank.description}
                  </p>
                </div>
                {questionBank.associatedPhrases &&
                  questionBank.associatedPhrases.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Acceptable Answers
                      </p>
                      <div className="space-y-1">
                        {questionBank.associatedPhrases.map((phrase, index) => (
                          <p
                            key={index}
                            className="text-sm text-muted-foreground"
                            data-testid={`text-acceptable-answer-${index}`}
                          >
                            {phrase.surahAyah}: {phrase.englishTranslation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : isTransformationExercise && philosophicalSentence ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Type
                    </p>
                    <p className="text-foreground" data-testid="text-philosophical-type">
                      Philosophical Sentence
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Difficulty
                    </p>
                    <p className="text-foreground" data-testid="text-philosophical-difficulty">
                      {philosophicalSentence.difficulty}/5
                    </p>
                  </div>
                </div>
                {philosophicalSentence.symbolicMeaning && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                      🔑 Symbolic Meaning / الرمزية السلوكية
                    </p>
                    <p
                      className="text-foreground text-sm"
                      data-testid="text-philosophical-symbolic"
                    >
                      {philosophicalSentence.symbolicMeaning}
                    </p>
                  </div>
                )}
              </div>
            ) : isConversationExercise && conversationPrompt ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Type
                    </p>
                    <p className="text-foreground" data-testid="text-conversation-type">
                      Conversation Prompt
                    </p>
                  </div>
                  {conversationPrompt.category && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Category
                      </p>
                      <p className="text-foreground capitalize" data-testid="text-conversation-category">
                        {conversationPrompt.category}
                      </p>
                    </div>
                  )}
                </div>
                {isAnswered && conversationPrompt.suggestedVerse && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Suggested Verse
                    </p>
                    <p className="arabic-text text-lg text-foreground" data-testid="text-conversation-verse">
                      {conversationPrompt.suggestedVerse}
                    </p>
                  </div>
                )}
                {conversationPrompt.symbolicMeaning && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                      🔑 Symbolic Meaning / الرمزية السلوكية
                    </p>
                    <p
                      className="text-foreground text-sm"
                      data-testid="text-conversation-symbolic"
                    >
                      {conversationPrompt.symbolicMeaning}
                    </p>
                  </div>
                )}
              </div>
            ) : phrase ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Source
                    </p>
                    <p
                      className="text-foreground"
                      data-testid="text-phrase-source"
                    >
                      {phrase.surahAyah}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Category
                    </p>
                    <p
                      className="text-foreground capitalize"
                      data-testid="text-phrase-category"
                    >
                      {phrase.category}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Life Application
                  </p>
                  <p
                    className="text-foreground"
                    data-testid="text-phrase-application"
                  >
                    {phrase.lifeApplication}
                  </p>
                </div>
                {phrase.symbolicMeaning && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                      🔑 Symbolic Meaning / الرمزية السلوكية
                    </p>
                    <p
                      className="text-foreground text-sm"
                      data-testid="text-phrase-symbolic"
                    >
                      {phrase.symbolicMeaning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Loading context information...
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
