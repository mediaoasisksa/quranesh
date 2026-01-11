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
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";

function getLocalizedQuestion(
  conversationPrompt: any,
  lang: string
): string {
  if (!conversationPrompt) return "...";
  
  const langMap: Record<string, string> = {
    en: conversationPrompt.questionEn || conversationPrompt.question,
    id: conversationPrompt.questionId || conversationPrompt.question,
    tr: conversationPrompt.questionTr || conversationPrompt.question,
    zh: conversationPrompt.questionZh || conversationPrompt.question,
    sw: conversationPrompt.questionSw || conversationPrompt.question,
    so: conversationPrompt.questionSo || conversationPrompt.question,
    bs: conversationPrompt.questionBs || conversationPrompt.question,
    sq: conversationPrompt.questionSq || conversationPrompt.question,
    ru: conversationPrompt.questionRu || conversationPrompt.question,
    ar: conversationPrompt.question,
  };
  
  return langMap[lang] || conversationPrompt.question;
}

function getLocalizedScenario(
  roleplayScenario: any,
  lang: string
): string {
  if (!roleplayScenario) return "...";
  
  const langMap: Record<string, string> = {
    en: roleplayScenario.scenarioEn || roleplayScenario.scenario,
    id: roleplayScenario.scenarioId || roleplayScenario.scenario,
    tr: roleplayScenario.scenarioTr || roleplayScenario.scenario,
    zh: roleplayScenario.scenarioZh || roleplayScenario.scenario,
    sw: roleplayScenario.scenarioSw || roleplayScenario.scenario,
    so: roleplayScenario.scenarioSo || roleplayScenario.scenario,
    bs: roleplayScenario.scenarioBs || roleplayScenario.scenario,
    sq: roleplayScenario.scenarioSq || roleplayScenario.scenario,
    ru: roleplayScenario.scenarioRu || roleplayScenario.scenario,
    ar: roleplayScenario.scenario,
  };
  
  return langMap[lang] || roleplayScenario.scenario;
}

export default function Exercise() {
  const [, params] = useRoute("/exercise/:type/:phraseId?");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t, dir, language } = useLanguage();

  // Use the actual user ID instead of hardcoded demo user
  const userId = user?.id || "demo-user";

  const exerciseType = params?.type;
  const phraseId = params?.phraseId;

  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [suggestedAnswer, setSuggestedAnswer] = useState<string | null>(null);
  const [showSuggested, setShowSuggested] = useState(false);
  const [connectionExplanation, setConnectionExplanation] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fetch data based on exercise type
  const isThematicExercise = exerciseType === "thematic";
  const isTransformationExercise = exerciseType === "transformation";
  const isConversationExercise = exerciseType === "conversation";
  const isRoleplayExercise = exerciseType === "roleplay";
  const isDailyContextualExercise = exerciseType === "daily_contextual";

  // For transformation exercises, fetch philosophical sentences
  const { data: philosophicalSentence, isLoading: philosophicalLoading } = useQuery<PhilosophicalSentence>({
    queryKey: ["/api/philosophical-sentences/random", userId, language],
    queryFn: async () => {
      const response = await fetch(`/api/philosophical-sentences/random?userId=${userId}&language=${language}`);
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
    questionEn: string | null;
    questionId: string | null;
    questionTr: string | null;
    questionZh: string | null;
    questionSw: string | null;
    questionSo: string | null;
    questionBs: string | null;
    questionSq: string | null;
    questionRu: string | null;
    suggestedVerse: string;
    category: string | null;
    symbolicMeaning?: string | null;
  }>({
    queryKey: ["/api/conversation-prompts/random", userId, language],
    queryFn: async () => {
      const response = await fetch(`/api/conversation-prompts/random?userId=${userId}&language=${language}`);
      if (!response.ok) throw new Error("Failed to fetch conversation prompt");
      return response.json();
    },
    enabled: !!exerciseType && isConversationExercise,
  });

  const { data: roleplayScenario, isLoading: roleplayLoading } = useQuery<{
    id: string;
    scenario: string;
    scenarioEn: string | null;
    scenarioId: string | null;
    scenarioTr: string | null;
    scenarioZh: string | null;
    scenarioSw: string | null;
    scenarioSo: string | null;
    scenarioBs: string | null;
    scenarioSq: string | null;
    scenarioRu: string | null;
    theme: string;
    psychologicalDepth?: string | null;
    difficulty?: number | null;
  }>({
    queryKey: ["/api/roleplay-scenarios/random", userId],
    queryFn: async () => {
      const response = await fetch(`/api/roleplay-scenarios/random?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch roleplay scenario");
      return response.json();
    },
    enabled: !!exerciseType && isRoleplayExercise,
  });

  const { data: dailyContextualExercise, isLoading: dailyContextualLoading } = useQuery<any>({
    queryKey: ["/api/daily-contextual/random", userId],
    queryFn: async () => {
      const response = await fetch(`/api/daily-contextual/random?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch daily contextual exercise");
      return response.json();
    },
    enabled: !!exerciseType && isDailyContextualExercise,
  });

  const isLoading = isTransformationExercise ? philosophicalLoading : (isThematicExercise ? questionBankLoading : (isConversationExercise ? conversationLoading : (isRoleplayExercise ? roleplayLoading : (isDailyContextualExercise ? dailyContextualLoading : phraseLoading))));
  const exerciseData = isTransformationExercise ? philosophicalSentence : (isThematicExercise ? questionBank : (isConversationExercise ? conversationPrompt : (isRoleplayExercise ? roleplayScenario : (isDailyContextualExercise ? dailyContextualExercise : phrase))));

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
      // Invalidate stats queries only (not the exercise data)
      queryClient.invalidateQueries({ queryKey: ["/api/daily-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-stats"] });
    },
  });

  const exerciseConfig = getExerciseType(exerciseType || "");

  useEffect(() => {
    if (!exerciseType || !exerciseConfig) {
      setLocation("/dashboard");
    }
  }, [exerciseType, exerciseConfig, setLocation]);

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
    // Handle daily_contextual exercises with AI semantic validation
    if (isDailyContextualExercise) {
      if (!selectedOption) {
        toast({
          title: t('noAnswerProvided'),
          description: t('pleaseProvideAnswer'),
          variant: "destructive",
        });
        return;
      }

      setIsValidating(true);

      try {
        // Find the selected expression object
        const selectedExpression = dailyContextualExercise?.options?.find(
          (opt: any) => opt.id === selectedOption
        );

        if (!selectedExpression) {
          throw new Error("Selected expression not found");
        }

        // Get context information
        const sentence = dailyContextualExercise?.sentence;
        const sentenceText = language === 'ar' 
          ? sentence?.arabicText 
          : (language === 'en' 
              ? sentence?.englishText 
              : (sentence?.translations?.[language] || sentence?.englishText || sentence?.arabicText));

        // Call AI validation with semantic analysis
        const response = await fetch("/api/validate-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAnswer: selectedExpression.arabicText,
            exerciseType: "daily_contextual",
            phraseId: dailyContextualExercise?.exercise?.id,
            context: `Daily situation: ${sentenceText}\n\nSelected expression: ${selectedExpression.arabicText} (${selectedExpression.surahAyah})`,
            language: language,
          }),
        });

        if (!response.ok) {
          throw new Error("Validation failed");
        }

        const result = await response.json();
        
        setIsCorrect(result.isCorrect);
        setFeedback(result.feedback);
        setIsAnswered(true);

        // Submit session
        const correctId = dailyContextualExercise?.correctExpression?.id;
        submitSessionMutation.mutate({
          userId,
          exerciseType: "daily_contextual",
          phraseId: dailyContextualExercise?.exercise?.id || "unknown",
          userAnswer: selectedOption,
          correctAnswer: correctId,
          isCorrect: result.isCorrect ? "true" : "false",
        });

        toast({
          title: result.isCorrect ? t('correct') : t('incorrect'),
          description: result.feedback || (result.isCorrect 
            ? "Excellent! Your semantic understanding is correct." 
            : "Not quite right. Review the semantic analysis below."),
          variant: result.isCorrect ? "default" : "destructive",
        });

      } catch (error) {
        console.error("AI validation error:", error);
        
        // Fallback to simple comparison if AI fails
        const correctId = dailyContextualExercise?.correctExpression?.id;
        const correct = selectedOption === correctId;
        
        setIsCorrect(correct);
        setIsAnswered(true);

        submitSessionMutation.mutate({
          userId,
          exerciseType: "daily_contextual",
          phraseId: dailyContextualExercise?.exercise?.id || "unknown",
          userAnswer: selectedOption,
          correctAnswer: correctId,
          isCorrect: correct ? "true" : "false",
        });

        toast({
          title: correct ? t('correct') : t('incorrect'),
          description: correct 
            ? "Great job! You selected the right Quranic expression." 
            : "Not quite right. Review the explanation below.",
          variant: correct ? "default" : "destructive",
        });
      } finally {
        setIsValidating(false);
      }

      return;
    }

    // Regular exercises with text input
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
          language: language,
          suggestedVerse: isConversationExercise ? conversationPrompt?.suggestedVerse : undefined,
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

      // Handle suggested answer if user made a mistake
      if (!result.isCorrect && result.suggestedAnswer) {
        setSuggestedAnswer(result.suggestedAnswer);
        setShowSuggested(true);
        // Hide suggested answer after 5 seconds
        setTimeout(() => {
          setShowSuggested(false);
        }, 5000);
      }

      // Handle connection explanation for transformation exercises (when answer is correct)
      if (result.isCorrect && result.connectionExplanation && isTransformationExercise) {
        setConnectionExplanation(result.connectionExplanation);
      } else {
        setConnectionExplanation(null);
      }

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
        : isRoleplayExercise && roleplayScenario
        ? roleplayScenario.id
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
    setSuggestedAnswer(null);
    setShowSuggested(false);
    setConnectionExplanation(null);
  };

  const goToNextExercise = async () => {
    try {
      console.log("=== NEXT EXERCISE DEBUG ===");

      // Stay in the same exercise type
      const currentExerciseType = exerciseType || "conversation";
      console.log("Staying in exercise type:", currentExerciseType);

      // Reset the exercise state
      resetExercise();

      // Remove the appropriate cache entries based on current exercise type
      if (currentExerciseType === "transformation") {
        queryClient.removeQueries({
          queryKey: ["/api/philosophical-sentences/random", userId, language],
        });
      } else if (currentExerciseType === "conversation") {
        queryClient.removeQueries({
          queryKey: ["/api/conversation-prompts/random", userId, language],
        });
      } else if (currentExerciseType === "roleplay") {
        queryClient.removeQueries({
          queryKey: ["/api/roleplay-scenarios/random", userId],
        });
      } else if (currentExerciseType === "daily_contextual") {
        queryClient.removeQueries({
          queryKey: ["/api/daily-contextual/random", userId],
        });
      } else {
        queryClient.removeQueries({
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
              {t('thematicInstructionText')}
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Related themes: {questionBank.tags?.join(", ") || "None"}</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {t('thematicInstructionText2')}
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
              placeholder={t('substitutionPlaceholder')}
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
                className={language === 'ar' ? "arabic-text text-xl text-foreground mb-3" : "text-xl text-foreground mb-3"}
                lang={language}
                data-testid="text-conversation-prompt"
              >
                {getLocalizedQuestion(conversationPrompt, language)}
              </p>
            </div>
            {conversationPrompt?.suggestedVerse && !showSuggested && !isAnswered && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => setShowSuggested(true)}
                data-testid="button-show-solution"
              >
                {language === 'ar' ? 'أرجو إظهار الحل' : 'Show Solution'}
              </Button>
            )}
            {conversationPrompt?.suggestedVerse && (showSuggested || isAnswered) && (
              <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 border border-primary/30">
                <p className="text-sm font-medium text-primary mb-2">
                  {t('suggestedVerse') || "آية مقترحة:"}
                </p>
                <p 
                  className="arabic-text text-lg text-foreground" 
                  lang="ar"
                  data-testid="text-conversation-verse"
                >
                  {conversationPrompt.suggestedVerse}
                </p>
              </div>
            )}
            <p className="text-foreground">
              {t('conversationInstruction') || "اكتب كلمة أو مفردة أو جملة استخدمها القرآن:"}
            </p>
            <Textarea
              className="arabic-text text-right text-lg min-h-[100px]"
              placeholder={t('conversationPlaceholder')}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              data-testid="textarea-conversation-answer"
            />
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
              placeholder={t('comparisonPlaceholder')}
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
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <span className="text-2xl">👥</span>
                <div className="flex-1">
                  <p className="text-foreground font-medium mb-2">{t('scenario')}:</p>
                  <p
                    className={`text-foreground ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    data-testid="text-roleplay-scenario"
                  >
                    {roleplayScenario ? getLocalizedScenario(roleplayScenario, language) : t('roleplayScenarioText')}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-foreground">{t('yourResponseInArabic')}:</p>
            <Textarea
              className="arabic-text text-right text-lg min-h-[100px]"
              placeholder={t('roleplayPlaceholder')}
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
              
              <div className="space-y-3 mb-3">
                {/* Always show Arabic text */}
                <p
                  className="arabic-text text-xl text-foreground"
                  lang="ar"
                  dir="rtl"
                  data-testid="text-transformation-philosophical-arabic"
                >
                  💎 {philosophicalSentence?.arabicText || "Loading..."}
                </p>
                
                {/* Show translation below if available and language is not Arabic */}
                {philosophicalSentence && language !== "ar" && (
                  <p
                    className="text-lg text-muted-foreground/90 font-medium ps-8"
                    dir={dir}
                    data-testid="text-transformation-philosophical-translation"
                  >
                    {(philosophicalSentence.translations as Record<string, string>)?.[language] || 
                      `(${t('translationNotAvailable') || 'Translation not available yet'})`}
                  </p>
                )}
              </div>
              
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

      case "daily_contextual":
        const sentence = dailyContextualExercise?.sentence;
        const options = dailyContextualExercise?.options || [];
        const correctExpression = dailyContextualExercise?.correctExpression;
        const explanation = dailyContextualExercise?.exercise?.explanation;
        const learningNote = dailyContextualExercise?.exercise?.learningNote;

        return (
          <div className="space-y-6">
            {/* Daily Sentence */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                {t('dailySentenceLabel')}
              </p>
              {language === "ar" ? (
                <p
                  className="arabic-text text-2xl font-medium text-foreground"
                  dir="rtl"
                  lang="ar"
                  data-testid="text-daily-sentence"
                >
                  {sentence?.arabicText || sentence?.englishText || "Loading..."}
                </p>
              ) : language === "en" ? (
                <p
                  className="text-2xl font-medium text-foreground"
                  data-testid="text-daily-sentence"
                >
                  {sentence?.englishText || "Loading..."}
                </p>
              ) : (
                <>
                  <p
                    className="text-2xl font-medium text-foreground mb-2"
                    data-testid="text-daily-sentence"
                  >
                    {(sentence?.translations as Record<string, string>)?.[language] || sentence?.englishText || "Translation not available"}
                  </p>
                  {sentence?.arabicText && (
                    <p className="arabic-text text-lg text-muted-foreground/70 mt-2 text-right" dir="rtl" lang="ar">
                      {sentence.arabicText}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Instruction */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-3">
                {t('selectQuranicExpression')}
              </p>

              {/* Three Options */}
              <div className="space-y-3">
                {options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrectOption = option.id === correctExpression?.id;
                  const showFeedback = isAnswered;

                  return (
                    <button
                      key={option.id}
                      onClick={() => !isAnswered && setSelectedOption(option.id)}
                      disabled={isAnswered}
                      className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 ${
                        isAnswered
                          ? isCorrectOption
                            ? "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600"
                            : isSelected
                            ? "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600"
                            : "bg-muted/50 border-muted"
                          : isSelected
                          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 shadow-md"
                          : "bg-background border-border hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                      }`}
                      data-testid={`button-option-${index}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <p className="arabic-text text-lg font-semibold mb-1" lang="ar" dir="rtl">
                            {option.arabicText}
                          </p>
                          {option.surahAyah && option.surahAyah !== 'derived' && (
                            <p className="text-sm text-muted-foreground">
                              {option.surahAyah}
                            </p>
                          )}
                        </div>
                        <div className="mr-4">
                          {showFeedback && isCorrectOption && (
                            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                          )}
                          {showFeedback && !isCorrectOption && isSelected && (
                            <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation Card (shown after answering) */}
            {isAnswered && explanation && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-5 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">
                  {t('whyThisExpression')}
                </p>
                <p className="text-foreground">
                  {(explanation as Record<string, string>)[language] || explanation.en}
                </p>

                {learningNote && (
                  <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                      data-testid="button-learn-more"
                    >
                      {t('learnMore')}
                      <ArrowRight className={`h-4 w-4 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {showExplanation && (
                      <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {t('linguisticNote')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(learningNote as Record<string, string>)[language] || learningNote.en}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
          <div className="flex items-center justify-between h-24">
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
            <div className="w-40 flex items-center justify-end">
              <img 
                src={logoImage} 
                alt="Quranesh Logo" 
                className="h-20 w-auto object-contain"
                data-testid="img-logo"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Exercise Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('exercise')}</span>
              <div className="flex items-center space-x-2">
                {isThematicExercise && questionBank ? (
                  <span className="text-sm text-muted-foreground">
                    {t('thematicQuestionLabel')}
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

            {/* Suggested Correct Answer - Shows for 5 seconds */}
            {showSuggested && suggestedAnswer && (
              <div 
                className="mt-4 p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 animate-in fade-in duration-300"
                data-testid="card-suggested-answer"
              >
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  {t('suggestedCorrectAnswer')}
                </p>
                <p 
                  className="arabic-text text-lg text-blue-900 dark:text-blue-100" 
                  lang="ar"
                  dir="rtl"
                  data-testid="text-suggested-answer"
                >
                  {suggestedAnswer}
                </p>
              </div>
            )}

            {/* Logical Connection Explanation - Shows when answer is correct and explanation is available */}
            {isCorrect && connectionExplanation && isTransformationExercise && (
              <div 
                className="mt-4 p-4 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 animate-in fade-in duration-300"
                data-testid="card-connection-explanation"
              >
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                  {t('logicalConnection')}
                </p>
                <p 
                  className="text-base text-emerald-900 dark:text-emerald-100 leading-relaxed" 
                  dir={dir}
                  data-testid="text-connection-explanation"
                >
                  {connectionExplanation}
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
              {isThematicExercise ? t('aboutThisQuestion') : t('aboutThisPhrase')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isThematicExercise && questionBank ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('theme')}
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
                      {t('difficulty')}
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
                    {t('description')}
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
                      {t('type')}
                    </p>
                    <p className="text-foreground" data-testid="text-philosophical-type">
                      Philosophical Sentence
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('difficulty')}
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
                      {t('type')}
                    </p>
                    <p className="text-foreground" data-testid="text-conversation-type">
                      {t('conversationPromptType')}
                    </p>
                  </div>
                  {conversationPrompt.category && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t('category')}
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
                      {t('source')}
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
                      {t('category')}
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
