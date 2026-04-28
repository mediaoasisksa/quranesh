import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight, RotateCcw, CheckCircle2, XCircle, BookOpen,
  ChevronLeft, Loader2, Lightbulb, AlertTriangle, Send,
  Target, Brain, Zap, MessageSquare, History, TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { apiRequest } from "@/lib/queryClient";
import type { TabariExercise } from "@shared/schema";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import { InlineBuildBadge } from "@/components/version-badge";
import { buildVisibleArabicSet, normalizeArabic } from "@shared/arabicVisibleTokens";
import { useAuth } from "@/hooks/use-auth";

type AnswerLetter = "A" | "B" | "C" | "D";
type Phase = "mcq" | "explanation" | "feedback";
type Tab = "practice" | "history";

interface ValidationResult {
  correct: boolean;
  correctAnswer: string;
  correctWord: string;
  selectedWord: string;
  explanation: string;
}

interface EvalResult {
  semanticAccuracyScore: number;
  contextLinkScore: number;
  precisionScore: number;
  sourceConflict: boolean;
  missingContextLink: string;
  shortFeedback: string;
  detailedFeedback: string;
}

interface HistoryItem {
  id: string;
  exerciseId: string;
  learnerExplanation: string;
  semanticAccuracyScore: number;
  contextLinkScore: number;
  precisionScore: number;
  sourceConflict: boolean;
  shortFeedback: string | null;
  createdAt: string;
  surahNameAr: string | null;
  surahNumber: number | null;
  ayah: number | null;
  correctWord: string | null;
}

function clientSideInvariantCheck(exercise: TabariExercise): boolean {
  const passage = exercise.displayedPassageText || exercise.verseText || "";
  if (!passage.trim()) return false;
  const tokenSet = buildVisibleArabicSet(passage);
  const options = [exercise.optionA, exercise.optionB, exercise.optionC, exercise.optionD];
  return options.every(opt => tokenSet.has(normalizeArabic(opt ?? "")));
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${color}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function MiniScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
      <div
        className={`h-full rounded-full ${score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
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
        <p className="text-2xl leading-loose font-amiri text-emerald-900 dark:text-emerald-100" dir="rtl" lang="ar">
          {passage}
        </p>
      </div>
    );
  }

  const targetVerse = exercise.verseText;
  const parts = passage.split(targetVerse);

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">{exercise.surahNameAr}</Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
            آيات {exercise.contextStartAyah}–{exercise.contextEndAyah}
          </Badge>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
          الآية المستهدفة: {exercise.primaryAyahNumber}
        </Badge>
      </div>
      <p className="text-xl leading-loose font-amiri text-center" dir="rtl" lang="ar">
        {parts[0] && <span className="text-amber-800 dark:text-amber-200">{parts[0]}</span>}
        <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded px-1 mx-1 font-bold border border-emerald-400">
          {targetVerse}
        </span>
        {parts[1] && <span className="text-amber-800 dark:text-amber-200">{parts[1]}</span>}
      </p>
    </div>
  );
}

function scoreColor(score: number) {
  return score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-red-600";
}

function HistoryTab({ userId }: { userId: string }) {
  const { data: history, isLoading, error } = useQuery<HistoryItem[]>({
    queryKey: ["/api/self-explanation/history", userId],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/self-explanation/history", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) throw new Error("unauthenticated");
      if (!res.ok) throw new Error("Failed to load history");
      return res.json();
    },
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <XCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
        Could not load history. Please try again.
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="mt-8 text-center space-y-2">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm">No attempts yet. Complete some exercises to see your history here.</p>
      </div>
    );
  }

  const avgSemantic = Math.round(history.reduce((s, h) => s + h.semanticAccuracyScore, 0) / history.length);
  const avgContext = Math.round(history.reduce((s, h) => s + h.contextLinkScore, 0) / history.length);
  const avgPrecision = Math.round(history.reduce((s, h) => s + h.precisionScore, 0) / history.length);
  const overallAvg = Math.round((avgSemantic + avgContext + avgPrecision) / 3);

  return (
    <div className="space-y-5 mt-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-semibold text-foreground">Overall Performance</span>
            <Badge variant="outline" className="ml-auto text-xs">{history.length} attempt{history.length !== 1 ? "s" : ""}</Badge>
          </div>
          <div className="space-y-2">
            <ScoreBar label="Semantic Accuracy" score={avgSemantic} color={scoreColor(avgSemantic)} />
            <ScoreBar label="Context Link" score={avgContext} color={scoreColor(avgContext)} />
            <ScoreBar label="Precision" score={avgPrecision} color={scoreColor(avgPrecision)} />
            <div className="flex justify-between text-sm pt-1 border-t border-border mt-1">
              <span className="font-medium text-foreground">Overall Average</span>
              <span className={`font-bold text-base ${scoreColor(overallAvg)}`}>{overallAvg}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {history.map((item) => {
          const avg = Math.round((item.semanticAccuracyScore + item.contextLinkScore + item.precisionScore) / 3);
          const date = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
            : "—";
          const time = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
            : "";

          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {item.surahNameAr && (
                        <Badge className="bg-violet-100 text-violet-800 border-violet-200 text-xs font-amiri" dir="rtl">
                          {item.surahNameAr}
                        </Badge>
                      )}
                      {item.surahNumber && item.ayah && (
                        <Badge variant="outline" className="text-xs text-slate-600">
                          {item.surahNumber}:{item.ayah}
                        </Badge>
                      )}
                      {item.sourceConflict && (
                        <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                          ⚠ Source Conflict
                        </Badge>
                      )}
                    </div>
                    {item.correctWord && (
                      <p className="text-base font-amiri font-bold text-emerald-800 dark:text-emerald-300" dir="rtl" lang="ar">
                        {item.correctWord}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">{date} {time && `· ${time}`}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xl font-bold ${scoreColor(avg)}`}>{avg}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {[
                    { label: "Semantic", score: item.semanticAccuracyScore },
                    { label: "Context", score: item.contextLinkScore },
                    { label: "Precision", score: item.precisionScore },
                  ].map(({ label, score }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16 flex-shrink-0">{label}</span>
                      <MiniScoreBar score={score} />
                      <span className={`text-xs font-medium w-8 text-right flex-shrink-0 ${scoreColor(score)}`}>{score}</span>
                    </div>
                  ))}
                </div>

                {item.shortFeedback && (
                  <p className="mt-3 text-xs text-muted-foreground border-t border-border pt-2 line-clamp-2">
                    {item.shortFeedback}
                  </p>
                )}

                <p className="mt-2 text-xs text-foreground/70 italic line-clamp-2">
                  "{item.learnerExplanation}"
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function SelfExplanationExercisePage() {
  const { dir, language, t } = useLanguage();
  const locale = language || "en";
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("practice");
  const [phase, setPhase] = useState<Phase>("mcq");
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerLetter | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [explanation, setExplanation] = useState("");
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0, explanations: 0, totalScore: 0 });
  const [allExhausted, setAllExhausted] = useState(false);
  const [clientSkip, setClientSkip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const excludeParam = seenIds.join(",");

  const { data: exercise, isLoading, refetch, error } = useQuery<TabariExercise>({
    queryKey: ["/api/self-explanation/random", excludeParam],
    queryFn: async () => {
      const params = excludeParam ? `?exclude=${excludeParam}` : "";
      const res = await fetch(`/api/self-explanation/random${params}`);
      if (res.status === 404) { setAllExhausted(true); throw new Error("exhausted"); }
      if (!res.ok) throw new Error("Failed to load");
      setAllExhausted(false);
      return res.json();
    },
    staleTime: 0,
    retry: false,
  });

  useEffect(() => {
    if (!exercise) return;
    if (!clientSideInvariantCheck(exercise)) {
      setClientSkip(true);
      setSeenIds(prev => [...prev, exercise.id]);
    } else {
      setClientSkip(false);
    }
  }, [exercise?.id]);

  useEffect(() => {
    if (phase === "explanation" && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [phase]);

  const validateMutation = useMutation({
    mutationFn: async (data: { exerciseId: string; selectedAnswer: string }) => {
      const res = await apiRequest("POST", "/api/tabari-exercises/validate", data);
      return res.json() as Promise<ValidationResult>;
    },
    onSuccess: (result) => {
      setValidationResult(result);
      setScore(prev => ({
        ...prev,
        correct: prev.correct + (result.correct ? 1 : 0),
        total: prev.total + 1,
      }));
      setTimeout(() => setPhase("explanation"), 600);
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: async (data: { exerciseId: string; learnerExplanation: string; learnerLocale: string }) => {
      const res = await apiRequest("POST", "/api/self-explanation/evaluate", data);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const e = new Error(err.message || "Evaluation failed") as Error & { code?: string; status?: number };
        e.code = err.code;
        e.status = res.status;
        throw e;
      }
      return res.json() as Promise<EvalResult>;
    },
    onSuccess: (result) => {
      setEvalResult(result);
      setPhase("feedback");
      const avg = Math.round((result.semanticAccuracyScore + result.contextLinkScore + result.precisionScore) / 3);
      setScore(prev => ({
        ...prev,
        explanations: prev.explanations + 1,
        totalScore: prev.totalScore + avg,
      }));
    },
  });

  const handleOptionClick = (letter: AnswerLetter) => {
    if (phase !== "mcq" || validateMutation.isPending || !exercise) return;
    setSelectedAnswer(letter);
    validateMutation.mutate({ exerciseId: exercise.id, selectedAnswer: letter });
  };

  const handleSubmitExplanation = () => {
    if (!exercise || !explanation.trim() || explanation.trim().length < 10) return;
    evaluateMutation.mutate({
      exerciseId: exercise.id,
      learnerExplanation: explanation.trim(),
      learnerLocale: locale,
    });
  };

  const handleNext = () => {
    if (exercise) setSeenIds(prev => [...prev, exercise.id]);
    setSelectedAnswer(null);
    setValidationResult(null);
    setEvalResult(null);
    setExplanation("");
    setPhase("mcq");
    refetch();
  };

  const handleReset = () => {
    setSeenIds([]);
    setSelectedAnswer(null);
    setValidationResult(null);
    setEvalResult(null);
    setExplanation("");
    setPhase("mcq");
    setScore({ correct: 0, total: 0, explanations: 0, totalScore: 0 });
    setAllExhausted(false);
    refetch();
  };

  const getOptionClass = (letter: AnswerLetter) => {
    if (phase === "mcq" && !validateMutation.isPending) {
      return selectedAnswer === letter
        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-400"
        : "border-border hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20";
    }
    if (validationResult) {
      const correct = validationResult.correctAnswer.toUpperCase();
      if (letter === correct) return "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40";
      if (letter === selectedAnswer && !validationResult.correct) return "border-red-500 bg-red-50 dark:bg-red-950/30";
    }
    return "border-border opacity-60";
  };

  const avgExplanationScore = score.explanations > 0
    ? Math.round(score.totalScore / score.explanations) : null;

  const options: Array<{ letter: AnswerLetter; text: string }> = exercise
    ? [
        { letter: "A", text: exercise.optionA },
        { letter: "B", text: exercise.optionB },
        { letter: "C", text: exercise.optionC },
        { letter: "D", text: exercise.optionD },
      ]
    : [];

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
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-violet-600" />
            <h1 className="text-2xl font-bold text-foreground">{t('selfExplanationTitle')}</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {t('selfExplanationDesc')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("practice")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "practice"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Target className="h-4 w-4" />
            Practice
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="h-4 w-4" />
            History
          </button>
        </div>

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <>
            {!isAuthenticated ? (
              <Card>
                <CardContent className="p-8 text-center space-y-3">
                  <History className="h-10 w-10 mx-auto text-muted-foreground/40" />
                  <p className="text-foreground font-medium">Sign in to view your history</p>
                  <p className="text-sm text-muted-foreground">Your attempt history is saved to your account. Sign in to track your improvement over time.</p>
                  <Link href="/sign-in">
                    <Button className="mt-2 bg-violet-600 hover:bg-violet-700 text-white">Sign In</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <HistoryTab userId={user.id} />
            )}
          </>
        )}

        {/* ── PRACTICE TAB ── */}
        {activeTab === "practice" && (
          <>
            {/* Score bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                ✅ {score.correct}/{score.total} correct
              </Badge>
              <Badge variant="outline" className="text-violet-700 border-violet-300">
                ✍️ {score.explanations} {t('selfExplanationExplained')}
              </Badge>
              {avgExplanationScore !== null && (
                <Badge variant="outline" className={`border-amber-300 ${avgExplanationScore >= 70 ? "text-emerald-700" : avgExplanationScore >= 40 ? "text-amber-700" : "text-red-700"}`}>
                  🎯 {t('selfExplanationAvgScore')}: {avgExplanationScore}/100
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-muted-foreground ml-auto">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>

            {/* Phase indicator */}
            <div className="flex items-center gap-2 mb-4">
              {[
                { key: "mcq", icon: <Target className="h-3 w-3" />, label: t('selfExplanationPhase1') },
                { key: "explanation", icon: <MessageSquare className="h-3 w-3" />, label: t('selfExplanationPhase2') },
                { key: "feedback", icon: <Zap className="h-3 w-3" />, label: t('selfExplanationPhase3') },
              ].map(({ key, icon, label }) => (
                <div key={key} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  phase === key
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {icon} {label}
                </div>
              ))}
            </div>

            {/* Main content */}
            {isLoading || clientSkip ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="h-24 bg-muted rounded-xl" />
                    <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-muted rounded-lg" />)}
                  </div>
                  {clientSkip && (
                    <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Loading next exercise…
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : allExhausted ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h2 className="text-xl font-bold text-violet-700 dark:text-violet-400">{t('selfExplanationSessionDone')}</h2>
                  <p className="text-muted-foreground text-sm">
                    {t('selfExplanationDesc')}
                  </p>
                  {avgExplanationScore !== null && (
                    <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 max-w-xs mx-auto space-y-2">
                      <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">{t('selfExplanationScores')}</p>
                      <p className="text-3xl font-bold text-violet-700">{avgExplanationScore}<span className="text-sm font-normal">/100</span></p>
                    </div>
                  )}
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white mt-2" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Start New Session
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
                  {/* Surah badges */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-violet-100 text-violet-800 border-violet-300">
                      {exercise.surahNameAr}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      Surah {exercise.surahNumber} : Ayah {exercise.ayah}
                    </Badge>
                    {exercise.contextMode === "multi_ayah" && (
                      <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">Multi-verse</Badge>
                    )}
                  </div>

                  {/* Arabic passage */}
                  <AyahPassage exercise={exercise} />

                  {/* MCQ Question */}
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Question</p>
                    <p className="text-base font-semibold text-foreground">{exercise.questionEn}</p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-3">
                    {options.map(({ letter, text }) => (
                      <button
                        key={letter}
                        onClick={() => handleOptionClick(letter)}
                        disabled={phase !== "mcq" || validateMutation.isPending}
                        className={`flex items-center gap-3 w-full text-start px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${getOptionClass(letter)}`}
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                          {validateMutation.isPending && letter === selectedAnswer
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : letter}
                        </span>
                        <span className="font-amiri text-xl" dir="rtl" lang="ar">{text}</span>
                        {validationResult && letter === validationResult.correctAnswer.toUpperCase() && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 ml-auto flex-shrink-0" />
                        )}
                        {validationResult && letter === selectedAnswer && !validationResult.correct && letter !== validationResult.correctAnswer.toUpperCase() && (
                          <XCircle className="h-5 w-5 text-red-500 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* MCQ result quick note */}
                  {validationResult && phase !== "mcq" && (
                    <div className={`rounded-xl p-3 border text-sm ${
                      validationResult.correct
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300"
                        : "bg-red-50 dark:bg-red-950/30 border-red-300"
                    }`}>
                      <span className="font-semibold">{validationResult.correct ? `✅ ${t('selfExplanationCorrect')}` : `📖 ${t('selfExplanationCorrectAnswer')}`}</span>
                      {!validationResult.correct && (
                        <span className="font-amiri text-lg mr-2" dir="rtl" lang="ar"> {validationResult.correctWord}</span>
                      )}
                    </div>
                  )}

                  {/* ── PHASE 2: Self-Explanation Input ── */}
                  {phase === "explanation" && (
                    <div className="border-t border-violet-200 dark:border-violet-800 pt-5 space-y-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">{t('selfExplanationNowExplain')}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            <span className="font-amiri text-base font-bold" dir="rtl" lang="ar">«{exercise.correctWord}»</span>{' '}
                            {t('selfExplanationWhyFits')}{' '}
                            {t('selfExplanationWriteAny')}
                          </p>
                        </div>
                      </div>

                      <Textarea
                        ref={textareaRef}
                        value={explanation}
                        onChange={e => setExplanation(e.target.value)}
                        placeholder={t('selfExplanationPlaceholder')}
                        className="min-h-[110px] resize-none border-violet-200 dark:border-violet-800 focus:ring-violet-400"
                        disabled={evaluateMutation.isPending}
                      />

                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${explanation.trim().length < 10 ? "text-muted-foreground" : "text-emerald-600"}`}>
                          {explanation.trim().length} chars {explanation.trim().length < 10 ? "(min 10)" : "✓"}
                        </span>
                        <Button
                          onClick={handleSubmitExplanation}
                          disabled={explanation.trim().length < 10 || evaluateMutation.isPending}
                          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          {evaluateMutation.isPending
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('selfExplanationEvaluating')}</>
                            : <><Send className="h-4 w-4" /> {t('selfExplanationSubmit')}</>
                          }
                        </Button>
                      </div>

                      {evaluateMutation.isError && (() => {
                        const err = evaluateMutation.error as any;
                        const isRateLimited = err?.code === "RATE_LIMITED" || err?.status === 503;
                        return (
                          <div className={`flex items-start gap-2 text-xs rounded-lg p-3 ${
                            isRateLimited
                              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300"
                              : "bg-red-50 dark:bg-red-950/30 text-red-600"
                          }`}>
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <div>
                              {isRateLimited ? (
                                <>
                                  <p className="font-semibold mb-1">
                                    {locale === 'ar' ? "خدمة التقييم مشغولة مؤقتاً" : "AI Evaluator temporarily busy"}
                                  </p>
                                  <p>
                                    {locale === 'ar'
                                      ? "الذكاء الاصطناعي يُعالج طلبات أخرى. انتظر لحظة ثم أعد المحاولة."
                                      : "The AI is processing other requests. Please wait a moment and try again."}
                                  </p>
                                </>
                              ) : (
                                err?.message || "Evaluation failed. Please try again."
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ── PHASE 3: Feedback ── */}
                  {phase === "feedback" && evalResult && (
                    <div className="border-t border-violet-200 dark:border-violet-800 pt-5 space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-violet-600" />
                          {t('selfExplanationScores')}
                        </p>
                        <div className="space-y-3">
                          <ScoreBar
                            label={t('selfExplanationSemantic')}
                            score={evalResult.semanticAccuracyScore}
                            color={evalResult.semanticAccuracyScore >= 70 ? "text-emerald-600" : evalResult.semanticAccuracyScore >= 40 ? "text-amber-600" : "text-red-600"}
                          />
                          <ScoreBar
                            label={t('selfExplanationContext')}
                            score={evalResult.contextLinkScore}
                            color={evalResult.contextLinkScore >= 70 ? "text-emerald-600" : evalResult.contextLinkScore >= 40 ? "text-amber-600" : "text-red-600"}
                          />
                          <ScoreBar
                            label={t('selfExplanationPrecision')}
                            score={evalResult.precisionScore}
                            color={evalResult.precisionScore >= 70 ? "text-emerald-600" : evalResult.precisionScore >= 40 ? "text-amber-600" : "text-red-600"}
                          />
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{t('selfExplanationAvg')}</span>
                            <span className={`font-bold text-lg ${
                              Math.round((evalResult.semanticAccuracyScore + evalResult.contextLinkScore + evalResult.precisionScore) / 3) >= 70
                                ? "text-emerald-600" : "text-amber-600"
                            }`}>
                              {Math.round((evalResult.semanticAccuracyScore + evalResult.contextLinkScore + evalResult.precisionScore) / 3)}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      {evalResult.sourceConflict && (
                        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">{t('selfExplanationConflict')}</p>
                            <p className="text-xs mt-0.5">{t('selfExplanationConflictDesc')}</p>
                          </div>
                        </div>
                      )}

                      {evalResult.missingContextLink && (
                        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-300">
                          <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <p>{evalResult.missingContextLink}</p>
                        </div>
                      )}

                      <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
                        <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-2">{t('selfExplanationFeedback')}</p>
                        <p className="text-sm text-foreground">{evalResult.shortFeedback}</p>
                        {evalResult.detailedFeedback && evalResult.detailedFeedback !== evalResult.shortFeedback && (
                          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-violet-200 dark:border-violet-800">
                            {evalResult.detailedFeedback}
                          </p>
                        )}
                      </div>

                      <div className="bg-muted/40 rounded-xl p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t('selfExplanationYourExpl')}</p>
                        <p className="text-sm text-foreground italic">"{explanation}"</p>
                      </div>

                      {isAuthenticated && (
                        <button
                          onClick={() => setActiveTab("history")}
                          className="text-xs text-violet-600 hover:text-violet-800 dark:hover:text-violet-400 transition-colors flex items-center gap-1"
                        >
                          <History className="h-3 w-3" />
                          View your full history →
                        </button>
                      )}

                      <Button className="w-full gap-2" variant="outline" onClick={handleNext}>
                        {t('selfExplanationNext')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Next button during explanation phase (skip explanation) */}
                  {phase === "explanation" && !evaluateMutation.isPending && (
                    <div className="border-t border-border pt-3">
                      <button
                        onClick={handleNext}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t('selfExplanationSkip')}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </>
        )}

        <div className="mt-8 p-4 bg-muted/40 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            {t('selfExplanationFooter')}
          </p>
        </div>
      </main>
    </div>
  );
}
