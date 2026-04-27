import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, BookOpen, ChevronLeft, Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { apiRequest } from "@/lib/queryClient";
import type { TabariExercise } from "@shared/schema";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import { InlineBuildBadge } from "@/components/version-badge";
import { buildVisibleArabicSet, normalizeArabic } from "@shared/arabicVisibleTokens";

/**
 * Frontend invariant guard — secondary safety net.
 * The server-side delivery guard is the primary gate.
 * This catches anything that slips through (e.g. cached stale responses).
 *
 * Returns { ok: true } if every option appears in the displayed passage.
 * Returns { ok: false, badOptions } otherwise.
 */
function clientSideInvariantCheck(exercise: TabariExercise): {
  ok: boolean;
  badOptions: string[];
} {
  const passage = exercise.displayedPassageText || exercise.verseText || "";
  if (!passage.trim()) return { ok: false, badOptions: ["(passage missing)"] };

  const tokenSet = buildVisibleArabicSet(passage);
  const options = [exercise.optionA, exercise.optionB, exercise.optionC, exercise.optionD].filter(Boolean);
  const badOptions = options.filter(opt => !tokenSet.has(normalizeArabic(opt ?? "")));

  return { ok: badOptions.length === 0, badOptions };
}

type AnswerLetter = "A" | "B" | "C" | "D";

interface ValidationResult {
  correct: boolean;
  correctAnswer: string;
  correctWord: string;
  selectedWord: string;
  explanation: string;
}

function AyahPassage({ exercise }: { exercise: TabariExercise }) {
  const isMulti = exercise.contextMode === "multi_ayah";
  const passage = exercise.displayedPassageText || exercise.verseText;

  if (!isMulti) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant="outline" className="text-emerald-700 border-emerald-400 text-xs">
            {exercise.surahNameAr}
          </Badge>
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-xs">
            آية {exercise.contextStartAyah ?? exercise.ayah}
          </Badge>
        </div>
        <p
          className="text-2xl leading-loose font-amiri text-emerald-900 dark:text-emerald-100"
          dir="rtl"
          lang="ar"
        >
          {exercise.displayedPassageText || exercise.verseText}
        </p>
      </div>
    );
  }

  const targetVerse = exercise.verseText;
  const parts = passage.split(targetVerse);

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">
            {exercise.surahNameAr}
          </Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
            آيات {exercise.contextStartAyah}–{exercise.contextEndAyah}
          </Badge>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
          الآية المستهدفة: {exercise.primaryAyahNumber}
        </Badge>
      </div>

      <p
        className="text-xl leading-loose font-amiri text-center"
        dir="rtl"
        lang="ar"
      >
        {parts[0] && (
          <span className="text-amber-800 dark:text-amber-200">{parts[0]}</span>
        )}
        <span className="relative inline">
          <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded px-1 mx-1 font-bold border border-emerald-400 dark:border-emerald-600">
            {targetVerse}
          </span>
        </span>
        {parts[1] && (
          <span className="text-amber-800 dark:text-amber-200">{parts[1]}</span>
        )}
      </p>

      <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 text-center">
        ⭐ النص الأخضر هو الآية المستهدفة — جميع الخيارات مأخوذة من هذا المقطع فقط
      </p>
    </div>
  );
}

export default function TabariExercisePage() {
  const { dir, t } = useLanguage();
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerLetter | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [clientGuardSkip, setClientGuardSkip] = useState(false);

  const excludeParam = seenIds.join(",");

  const [allExhausted, setAllExhausted] = useState(false);

  const {
    data: exercise,
    isLoading,
    refetch,
    error,
  } = useQuery<TabariExercise>({
    queryKey: ["/api/tabari-exercises/random", excludeParam],
    queryFn: async () => {
      const params = excludeParam ? `?exclude=${excludeParam}` : "";
      const res = await fetch(`/api/tabari-exercises/random${params}`);
      if (res.status === 404) {
        setAllExhausted(true);
        throw new Error("exhausted");
      }
      if (!res.ok) throw new Error("Failed to load exercise");
      setAllExhausted(false);
      return res.json();
    },
    staleTime: 0,
    retry: false,
  });

  // ── FRONTEND SAFETY NET ─────────────────────────────────────────────────
  // Secondary guard: if a question arrives with options outside the passage
  // (e.g. cached stale data bypassed the server guard), skip it silently.
  useEffect(() => {
    if (!exercise) return;
    const check = clientSideInvariantCheck(exercise);
    if (!check.ok) {
      console.warn(
        `[client-guard] INVALID exercise id=${exercise.id}` +
        ` badOptions=${JSON.stringify(check.badOptions)}` +
        ` — skipping and fetching next`
      );
      // Telemetry: fire-and-forget log to server
      fetch("/api/tabari-exercises/client-guard-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          badOptions: check.badOptions,
          surah: exercise.surahNameAr,
        }),
      }).catch(() => {});

      // Auto-skip: add to seen list and refetch
      setClientGuardSkip(true);
      setSeenIds(prev => [...prev, exercise.id]);
    } else {
      setClientGuardSkip(false);
    }
  }, [exercise?.id]);

  const validateMutation = useMutation({
    mutationFn: async (data: { exerciseId: string; selectedAnswer: string }) => {
      const res = await apiRequest("POST", "/api/tabari-exercises/validate", data);
      return res.json() as Promise<ValidationResult>;
    },
    onSuccess: (result) => {
      setValidationResult(result);
      setScore(prev => ({
        correct: prev.correct + (result.correct ? 1 : 0),
        total: prev.total + 1,
      }));
    },
  });

  const handleOptionClick = (letter: AnswerLetter) => {
    if (submitted || validateMutation.isPending || !exercise) return;
    setSelectedAnswer(letter);
    setSubmitted(true);
    validateMutation.mutate({ exerciseId: exercise.id, selectedAnswer: letter });
  };

  const handleNext = () => {
    if (exercise) {
      setSeenIds(prev => [...prev, exercise.id]);
    }
    setSelectedAnswer(null);
    setSubmitted(false);
    setValidationResult(null);
    refetch();
  };

  const handleReset = () => {
    setSeenIds([]);
    setSelectedAnswer(null);
    setSubmitted(false);
    setValidationResult(null);
    setScore({ correct: 0, total: 0 });
    setAllExhausted(false);
    refetch();
  };

  const options: Array<{ letter: AnswerLetter; text: string }> = exercise
    ? [
        { letter: "A", text: exercise.optionA },
        { letter: "B", text: exercise.optionB },
        { letter: "C", text: exercise.optionC },
        { letter: "D", text: exercise.optionD },
      ]
    : [];

  const getOptionClass = (letter: AnswerLetter) => {
    if (!submitted) {
      return selectedAnswer === letter
        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400"
        : "border-border hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20";
    }
    if (validationResult) {
      const correct = validationResult.correctAnswer.toUpperCase();
      if (letter === correct) {
        return "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100";
      }
      if (letter === selectedAnswer && !validationResult.correct) {
        return "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300";
      }
    }
    return "border-border opacity-60";
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src={logoImage} alt="Quranesh" className="h-14 w-auto object-contain" />
            </Link>
            <InlineBuildBadge />
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-foreground">Tafsir al-Tabari Vocabulary</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Find the exact Arabic word meaning in its Quranic verse — sourced from Tafsir al-Tabari
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <Badge variant="outline" className="text-emerald-700 border-emerald-300">
              ✅ {score.correct} correct
            </Badge>
            <Badge variant="outline" className="text-slate-600 border-slate-300">
              📝 {score.total} answered
            </Badge>
            {score.total > 0 && (
              <Badge variant="outline" className="text-amber-700 border-amber-300">
                🎯 {Math.round((score.correct / score.total) * 100)}%
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>

        {isLoading || clientGuardSkip ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-muted rounded-xl" />
                <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
              {clientGuardSkip && (
                <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading next exercise…
                </p>
              )}
            </CardContent>
          </Card>
        ) : allExhausted ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                أنهيت جميع التمارين!
              </h2>
              <p className="text-muted-foreground text-sm">
                لقد أجبت على جميع التمارين المتاحة في هذه الجلسة.
                <br />
                You've answered all {seenIds.length} available exercises in this session.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Badge variant="outline" className="text-emerald-700 border-emerald-300 text-base px-3 py-1">
                  ✅ {score.correct} / {score.total} correct
                </Badge>
                {score.total > 0 && (
                  <Badge variant="outline" className="text-amber-700 border-amber-300 text-base px-3 py-1">
                    🎯 {Math.round((score.correct / score.total) * 100)}%
                  </Badge>
                )}
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start New Session
              </Button>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Could not load exercise. Please try again.</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        ) : exercise ? (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                  {exercise.surahNameAr}
                </Badge>
                <Badge variant="outline" className="text-slate-600">
                  Surah {exercise.surahNumber} : Ayah {exercise.ayah}
                </Badge>
                {exercise.contextMode === "multi_ayah" && (
                  <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">
                    Multi-verse context
                  </Badge>
                )}
              </div>

              <AyahPassage exercise={exercise} />

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-medium">Question</p>
                <p className="text-base font-semibold text-foreground">{exercise.questionEn}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {options.map(({ letter, text }) => (
                  <button
                    key={letter}
                    onClick={() => handleOptionClick(letter)}
                    disabled={submitted || validateMutation.isPending}
                    className={`flex items-center gap-3 w-full text-start px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${getOptionClass(letter)}`}
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                      {validateMutation.isPending && letter === selectedAnswer
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : letter}
                    </span>
                    <span className="font-amiri text-xl" dir="rtl" lang="ar">
                      {text}
                    </span>
                    {submitted && validationResult && letter === validationResult.correctAnswer.toUpperCase() && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 ml-auto flex-shrink-0" />
                    )}
                    {submitted && validationResult && letter === selectedAnswer && !validationResult.correct && letter !== validationResult.correctAnswer.toUpperCase() && (
                      <XCircle className="h-5 w-5 text-red-500 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {submitted && (
                <div className="space-y-3">
                  {validateMutation.isPending ? (
                    <div className="rounded-xl p-4 border border-border bg-muted/40 text-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      Checking your answer…
                    </div>
                  ) : validationResult ? (
                    <div
                      className={`rounded-xl p-4 border ${
                        validationResult.correct
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                          : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700"
                      }`}
                    >
                      <p className="font-semibold text-sm">
                        {validationResult.correct ? "🎉 Correct!" : "📖 Not quite"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {validationResult.explanation}
                      </p>
                    </div>
                  ) : null}

                  <Button
                    className="w-full gap-2"
                    variant="outline"
                    onClick={handleNext}
                    disabled={validateMutation.isPending}
                  >
                    Next Exercise
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        ) : null}

        <div className="mt-8 p-4 bg-muted/40 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            300 exercises covering Surah Al-Fatiha (1) and Surahs 93–114 — sourced exclusively from Tafsir al-Tabari
          </p>
        </div>
      </main>
    </div>
  );
}
