import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, X, RotateCcw, ArrowRight, AlertTriangle, ChevronLeft, ChevronRight, BookOpen, Lightbulb, BookOpenCheck } from "lucide-react";
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

import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import { isQuranicText, getQuranicLabel, QuranicVerseType } from "@shared/quran-protection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubscriptionGate from "@/components/subscription-gate";


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
  const [showRoleplayVerse, setShowRoleplayVerse] = useState(false);
  const [connectionExplanation, setConnectionExplanation] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  // نظام الدرجات الجديد: exact_match (أخضر)، valid_but_less_suitable (أصفر)، incorrect (أحمر)
  const [feedbackGrade, setFeedbackGrade] = useState<'exact_match' | 'valid_but_less_suitable' | 'incorrect'>('incorrect');
  
  // Meaning-Based Learning states
  const [showHint, setShowHint] = useState(false);
  const [meaningBreakdown, setMeaningBreakdown] = useState<{ words: Array<{ arabic: string; transliteration: string; meaning: string }>; overallMeaning: string } | null>(null);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(false);

  // Surah selection and navigation
  const [selectedSurahName, setSelectedSurahName] = useState<string | null>(null);
  const [showSurahSelector, setShowSurahSelector] = useState(false);

  // Fetch available surahs from vocabulary bank (only short surahs + Al-Fatiha)
  const { data: vocabSurahs = [] } = useQuery<{ surahAr: string; surahEn: string; count: number }[]>({
    queryKey: ["/api/vocabulary-surahs"],
  });

  // Fetch data based on exercise type
  const isThematicExercise = exerciseType === "thematic";
  const isTransformationExercise = exerciseType === "transformation";
  const isConversationExercise = exerciseType === "conversation";
  const isRoleplayExercise = exerciseType === "roleplay";
  const isDailyContextualExercise = exerciseType === "daily_contextual";
  const isVocabQuizExercise = isConversationExercise || isRoleplayExercise || isDailyContextualExercise;

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

  const { data: vocabExercise, isLoading: vocabLoading } = useQuery<{
    id: string;
    surahAr: string;
    surahEn: string;
    questionAr: string;
    questionEn: string;
    hint: string;
    answer: string;
    answerMeaning: string;
    surahAyah: string;
    exerciseType: 'find_word' | 'word_meaning' | 'complete_verse';
    arabicWord: string;
    wordMeaning: string;
    verseContext: string;
    verseContextMeaning: string;
    options: { text: string; isCorrect: boolean }[];
    ayahNumber: number;
    targetWord: string;
    targetWordMeaning: string;
    correctVerse: string;
    correctVerseMeaning: string;
    translatedWordMeaning: string;
    translatedVerseMeaning: string;
  }>({
    queryKey: ["/api/vocabulary-exercise", language, exerciseType, selectedSurahName],
    queryFn: async () => {
      const params = new URLSearchParams({ language });
      if (selectedSurahName) params.set('surah', selectedSurahName);
      const response = await fetch(`/api/vocabulary-exercise?${params}`);
      if (!response.ok) throw new Error("Failed to fetch vocabulary exercise");
      return response.json();
    },
    enabled: !!exerciseType && isVocabQuizExercise,
    staleTime: 0,
    gcTime: 0,
  });

  // daily_contextual now uses the same VOCAB_BANK as conversation/roleplay (via isVocabQuizExercise)

  const isLoading = isTransformationExercise ? philosophicalLoading : (isThematicExercise ? questionBankLoading : (isVocabQuizExercise ? vocabLoading : phraseLoading));
  const exerciseData = isTransformationExercise ? philosophicalSentence : (isThematicExercise ? questionBank : (isVocabQuizExercise ? vocabExercise : phrase));

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
    // Handle all vocabulary quiz exercises (conversation, roleplay, daily_contextual)
    // They all use the same VOCAB_BANK MCQ format

    if (isVocabQuizExercise) {
      if (!vocabExercise || !selectedOption) return;
      setIsValidating(true);
      const correctOption = vocabExercise.options.find(o => o.isCorrect);
      const answeredCorrectly = selectedOption === correctOption?.text;
      setIsCorrect(answeredCorrectly);
      setIsAnswered(true);
      const correctVerseText = vocabExercise.correctVerse;
      setFeedback(answeredCorrectly 
        ? `✅ ${t('correctAnswer')}!` 
        : `❌ ${t('incorrect')}: ${correctVerseText}`);
      setFeedbackGrade(answeredCorrectly ? 'exact_match' : 'incorrect');
      submitSessionMutation.mutate({
        userId,
        exerciseType: exerciseType || 'daily_contextual',
        phraseId: vocabExercise.id,
        userAnswer: selectedOption,
        correctAnswer: correctOption?.text || '',
        isCorrect: answeredCorrectly ? "true" : "false",
      });
      setIsValidating(false);
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
      
      // تحديد درجة الـ feedback بناءً على حقل grade من الـ API
      if (result.grade === 'exact_match' || result.grade === 'valid_but_less_suitable' || result.grade === 'incorrect') {
        setFeedbackGrade(result.grade);
      } else if (result.isCorrect) {
        setFeedbackGrade('exact_match');
      } else {
        setFeedbackGrade('incorrect');
      }

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

      // Fetch meaning breakdown for conversation/roleplay when answer is correct
      if (result.isCorrect && isVocabQuizExercise) {
        const verseText = vocabExercise?.correctVerse;
        if (verseText) {
          setIsLoadingBreakdown(true);
          try {
            const breakdownRes = await fetch("/api/meaning-breakdown", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ arabicPhrase: verseText, language }),
            });
            if (breakdownRes.ok) {
              const breakdown = await breakdownRes.json();
              setMeaningBreakdown(breakdown);
            }
          } catch (e) {
            console.error("Breakdown fetch error:", e);
          } finally {
            setIsLoadingBreakdown(false);
          }
        }
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
        : isVocabQuizExercise && vocabExercise
        ? vocabExercise.id
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
    setFeedbackGrade('incorrect');
    setSuggestedAnswer(null);
    setShowSuggested(false);
    setShowRoleplayVerse(false);
    setConnectionExplanation(null);
    setShowHint(false);
    setMeaningBreakdown(null);
    setIsLoadingBreakdown(false);
    setSelectedOption(null);
  };

  const goToNextExercise = async () => {
    try {
      console.log("=== NEXT EXERCISE DEBUG ===");

      // Stay in the same exercise type
      const currentExerciseType = exerciseType || "conversation";
      console.log("Staying in exercise type:", currentExerciseType);

      // Reset the exercise state
      resetExercise();
      setSelectedOption(null);

      // Remove the appropriate cache entries based on current exercise type
      if (currentExerciseType === "transformation") {
        queryClient.removeQueries({
          queryKey: ["/api/philosophical-sentences/random", userId, language],
        });
      } else if (currentExerciseType === "conversation" || currentExerciseType === "roleplay" || currentExerciseType === "daily_contextual") {
        queryClient.removeQueries({
          queryKey: ["/api/vocabulary-exercise"],
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

  // Navigate to previous surah in vocabulary list
  const goToPreviousSurah = () => {
    if (!selectedSurahName || vocabSurahs.length === 0) return;
    const currentIdx = vocabSurahs.findIndex(s => s.surahAr === selectedSurahName);
    if (currentIdx > 0) {
      const prev = vocabSurahs[currentIdx - 1];
      setSelectedSurahName(prev.surahAr);
      resetExercise();
      setSelectedOption(null);
    }
  };

  // Navigate to next surah in vocabulary list
  const goToNextSurah = () => {
    if (!selectedSurahName || vocabSurahs.length === 0) return;
    const currentIdx = vocabSurahs.findIndex(s => s.surahAr === selectedSurahName);
    if (currentIdx < vocabSurahs.length - 1) {
      const next = vocabSurahs[currentIdx + 1];
      setSelectedSurahName(next.surahAr);
      resetExercise();
      setSelectedOption(null);
    }
  };

  const currentSurahInfo = selectedSurahName
    ? vocabSurahs.find(s => s.surahAr === selectedSurahName)
    : null;

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
      case "roleplay":
      case "daily_contextual":
        return (
          <div className="space-y-5">
            {/* Surah Badge + Ayah */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-base font-bold">
                📖 {language === 'ar' 
                  ? `سورة ${vocabExercise?.surahAr} — آية ${vocabExercise?.ayahNumber}` 
                  : `${t('surahLabel')} ${vocabExercise?.surahEn} — ${t('verseLabel')} ${vocabExercise?.ayahNumber}`}
              </span>
            </div>

            {/* Full Verse as Context */}
            <div className="bg-muted/30 dark:bg-muted/20 rounded-xl p-5 text-center border border-border">
              <p className="arabic-text text-2xl leading-loose text-foreground font-semibold" lang="ar" dir="rtl" data-testid="text-verse-context">
                {vocabExercise?.correctVerse}
              </p>
              <p className="text-sm text-muted-foreground mt-2" dir={dir}>
                {vocabExercise?.translatedVerseMeaning || vocabExercise?.correctVerseMeaning}
              </p>
            </div>

            {/* Question: What word means X? */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 text-center border-2 border-primary/20">
              <p className="text-sm font-semibold text-muted-foreground mb-2" dir={dir}>
                {t('chooseVerseContaining')}
              </p>
              <p className="text-2xl font-bold text-primary" dir={dir} data-testid="text-arabic-word">
                {vocabExercise?.translatedWordMeaning || vocabExercise?.targetWordMeaning}
              </p>
            </div>

            {/* Multiple Choice Options - Individual Arabic Words */}
            <div className="grid grid-cols-2 gap-3" data-testid="options-container">
              {vocabExercise?.options?.map((option, index) => {
                const isSelected = selectedOption === option.text;
                const showResult = isAnswered;
                const optionIsCorrect = option.isCorrect;
                let optionClass = "w-full text-center p-4 rounded-lg border-2 transition-all duration-200 ";
                if (showResult && optionIsCorrect) {
                  optionClass += "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200";
                } else if (showResult && isSelected && !optionIsCorrect) {
                  optionClass += "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200";
                } else if (isSelected && !showResult) {
                  optionClass += "bg-primary/10 border-primary text-primary";
                } else {
                  optionClass += "bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground";
                }
                return (
                  <button
                    key={index}
                    className={optionClass}
                    onClick={() => { if (!isAnswered) setSelectedOption(option.text); }}
                    disabled={isAnswered}
                    dir="rtl"
                    lang="ar"
                    data-testid={`option-${index}`}
                  >
                    <span className="flex flex-col items-center gap-1">
                      <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="arabic-text text-xl font-bold">{option.text}</span>
                      {showResult && optionIsCorrect && <span>✅</span>}
                      {showResult && isSelected && !optionIsCorrect && <span>❌</span>}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hint Button */}
            {vocabExercise?.hint && !isAnswered && !showHint && (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                onClick={() => setShowHint(true)}
                data-testid="button-hint"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {t('hint')}
              </Button>
            )}

            {/* Hint Card */}
            {showHint && vocabExercise?.hint && !isAnswered && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 animate-in fade-in duration-300">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                  💡 {t('hintLabel')}
                </p>
                <p className="arabic-text text-lg text-amber-800 dark:text-amber-200" dir="rtl" lang="ar">
                  {vocabExercise.hint}
                </p>
              </div>
            )}

            {/* Answer revealed after submission */}
            {isAnswered && vocabExercise && (
              <div className={`rounded-lg p-4 border animate-in fade-in duration-300 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
                <p className={`text-sm font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {isCorrect 
                    ? `✅ ${t('correctAnswer')}!` 
                    : `❌ ${t('incorrect')}`}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="arabic-text text-xl font-bold text-foreground" lang="ar" dir="rtl" data-testid="text-conversation-verse">
                      {vocabExercise.targetWord}
                    </p>
                    <span className="text-muted-foreground">=</span>
                    <p className="text-lg font-semibold text-foreground" dir={dir}>
                      {vocabExercise.translatedWordMeaning || vocabExercise.targetWordMeaning}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 mt-2">
                    <p className="arabic-text text-lg text-foreground" lang="ar" dir="rtl">
                      {vocabExercise.correctVerse}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1" dir={dir}>
                      {vocabExercise.translatedVerseMeaning || vocabExercise.correctVerseMeaning}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  📖 {language === 'ar' 
                    ? `سورة ${vocabExercise.surahAr} — آية ${vocabExercise.ayahNumber}` 
                    : `${t('surahLabel')} ${vocabExercise.surahEn} — ${t('verseLabel')} ${vocabExercise.ayahNumber}`}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isAnswered ? (
                <Button
                  className="flex-1"
                  onClick={checkAnswer}
                  disabled={!selectedOption || isValidating}
                  data-testid="button-check"
                >
                  {isValidating ? (
                    <>{t('checking')}</>
                  ) : (
                    <>{t('checkAnswer')}</>
                  )}
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={goToNextExercise} data-testid="button-retry">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('nextExercise')}
                </Button>
              )}
            </div>
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

      case "transformation":
        const textContent = philosophicalSentence?.arabicText || "";
        const isQuran = isQuranicText(textContent);
        const quranicLabelInfo = isQuran ? getQuranicLabel(QuranicVerseType.NARRATIVE, language) : null;
        
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className={`text-sm mb-2 cursor-help ${isQuran ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
                      {isQuran ? (
                        <>📖 {quranicLabelInfo?.label}</>
                      ) : (
                        t('philosophicalSentenceLabel')
                      )}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      {isQuran 
                        ? quranicLabelInfo?.tooltip 
                        : (language === 'ar' 
                          ? 'حكمة بشرية للتدريب على إيجاد نظيرها القرآني' 
                          : 'Human wisdom for practice - find its Quranic equivalent')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="space-y-3 mb-3">
                {/* Always show Arabic text */}
                <p
                  className={`arabic-text text-xl ${isQuran ? 'text-green-700 dark:text-green-300' : 'text-foreground'}`}
                  lang="ar"
                  dir="rtl"
                  data-testid="text-transformation-philosophical-arabic"
                >
                  {isQuran ? '📖' : '💎'} {philosophicalSentence?.arabicText || "Loading..."}
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
              
              {isQuran && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2 mb-3">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    ⚠️ {language === 'ar' 
                      ? 'تنبيه: هذا نص قرآني وليس حكمة بشرية - يُعرض للتدريب اللغوي فقط' 
                      : 'Note: This is Quranic text, not human wisdom - displayed for linguistic training only'}
                  </p>
                </div>
              )}
              
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
    <SubscriptionGate>
    <div className="min-h-screen bg-background" dir={dir}>
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
        {/* Quranic Badge */}
        <div className="mb-6 bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg text-foreground arabic-text">قرآني</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-muted-foreground">{t('surahAlKahfName')}</span>
            {vocabSurahs.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {vocabSurahs[0]?.count} {t('wordsUnit')}
              </span>
            )}
          </div>
        </div>

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

            {/* Feedback - نظام الدرجات الثلاثة */}
            {isAnswered && (
              <div
                className={`mt-6 p-4 rounded-lg border ${
                  feedbackGrade === 'exact_match'
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : feedbackGrade === 'valid_but_less_suitable'
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {feedbackGrade === 'exact_match' ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : feedbackGrade === 'valid_but_less_suitable' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      feedbackGrade === 'exact_match'
                        ? "text-green-800 dark:text-green-200"
                        : feedbackGrade === 'valid_but_less_suitable'
                        ? "text-yellow-800 dark:text-yellow-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {feedbackGrade === 'exact_match' 
                      ? t('correct') 
                      : feedbackGrade === 'valid_but_less_suitable'
                      ? t('validButLessSuitable') || 'صحيح لكن أقل ملاءمة'
                      : t('incorrect')}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    feedbackGrade === 'exact_match'
                      ? "text-green-700 dark:text-green-300"
                      : feedbackGrade === 'valid_but_less_suitable'
                      ? "text-yellow-700 dark:text-yellow-300"
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

            {/* Action Buttons (hidden for conversation/roleplay which have their own buttons) */}
            {!isVocabQuizExercise && (
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
            )}
          </CardContent>
        </Card>

        {/* Context Information (hidden for conversation/roleplay vocabulary quizzes) */}
        {!isVocabQuizExercise && <Card>
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
                      Human Wisdom Sentence
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
            ) : isVocabQuizExercise && vocabExercise ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('targetWord')}
                    </p>
                    <p className="arabic-text text-lg text-foreground" data-testid="text-conversation-type" lang="ar" dir="rtl">
                      {vocabExercise.targetWord}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('source')}
                    </p>
                    <p className="text-foreground" data-testid="text-conversation-source">
                      {language === 'ar' 
                        ? `سورة ${vocabExercise.surahAr} — آية ${vocabExercise.ayahNumber}` 
                        : `${t('surahLabel')} ${vocabExercise.surahEn} — ${t('verseLabel')} ${vocabExercise.ayahNumber}`}
                    </p>
                  </div>
                </div>
                {isAnswered && vocabExercise.correctVerse && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('correctAnswer')}
                    </p>
                    <p className="arabic-text text-lg text-foreground" data-testid="text-conversation-verse" lang="ar" dir="rtl">
                      {vocabExercise.correctVerse}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1" dir={dir}>
                      {vocabExercise.translatedVerseMeaning || vocabExercise.correctVerseMeaning}
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
        </Card>}
      </main>
    </div>
    </SubscriptionGate>
  );
}
