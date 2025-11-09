import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Moon,
  User,
  Shuffle,
  Download,
  CheckCircle,
  RotateCcw,
  Lightbulb,
  UserCircle,
  LogOut,
  Settings,
  Languages,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import ExerciseCard from "@/components/exercise-card";
import PhraseCard from "@/components/phrase-card";
import ProgressStats from "@/components/progress-stats";
import LanguageToggle from "@/components/language-toggle";
import { exerciseTypes, getRandomExerciseType } from "@/lib/exercises";
import type { Phrase, DailyStats, UserProgress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const DEMO_USER_ID = "demo-user";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDark, setIsDark] = useState(false);
  const [bookmarkedPhrases, setBookmarkedPhrases] = useState<Set<string>>(
    new Set(),
  );
  const { isAuthenticated, user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();

  // Use the actual user ID instead of hardcoded demo user
  const userId = user?.id || "demo-user";

  // Fetch phrases
  const { data: phrases = [], isLoading: phrasesLoading } = useQuery<Phrase[]>({
    queryKey: ["/api/phrases"],
  });

  // Fetch daily stats
  const { data: dailyStats } = useQuery<DailyStats>({
    queryKey: ["/api/daily-stats", userId],
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/user-progress", userId],
  });

  // Fetch weekly stats for progress report
  const { data: weeklyStats = [] } = useQuery<DailyStats[]>({
    queryKey: ["/api/weekly-stats", userId],
  });

  const defaultDailyStats: DailyStats = {
    id: "default",
    userId: userId,
    date: new Date().toISOString().split("T")[0],
    phrasesUsed: 0,
    exercicesCompleted: 0,
    accuracyRate: 0,
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const filteredPhrases =
    selectedCategory === "all"
      ? phrases
      : phrases.filter((phrase) => phrase.category === selectedCategory);

  const handleRandomExercise = () => {
    const randomType = getRandomExerciseType();
    // Navigate without phraseId - exercise page will fetch a non-repeated phrase from server
    setLocation(`/exercise/${randomType.id}`);
  };

  const handleExerciseStart = (type: string, phraseId?: string) => {
    // If phraseId is provided (user clicked on specific phrase), use it
    // Otherwise, let exercise page fetch a non-repeated phrase from server
    if (phraseId) {
      setLocation(`/exercise/${type}/${phraseId}`);
    } else {
      setLocation(`/exercise/${type}`);
    }
  };

  const handleBookmark = (phraseId: string) => {
    setBookmarkedPhrases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phraseId)) {
        newSet.delete(phraseId);
      } else {
        newSet.add(phraseId);
      }
      return newSet;
    });
  };

  const masteredPhrases = userProgress.filter(
    (p) => (p.masteryLevel || 0) >= 80,
  );
  const needReviewPhrases = userProgress.filter(
    (p) => (p.masteryLevel || 0) < 80 && (p.masteryLevel || 0) > 0,
  );

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Language Toggle - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Link href="/" className="cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="Quranesh Logo" 
                  className="h-20 w-auto object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(!isDark)}
                data-testid="button-dark-mode"
              >
                <Moon className="h-5 w-5" />
              </Button>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <UserCircle className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user?.email}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {t('welcome')}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('dashboard')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/translation-manager" className="cursor-pointer">
                        <Languages className="mr-2 h-4 w-4" />
                        <span>إدارة الترجمات</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(event) => {
                        event.preventDefault();
                        signOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin">
                  <Button className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors px-4 py-2 rounded-md text-sm font-semibold">
                    {t('signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exercise Types Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {t('trainingExercises')}
            </h2>
            <Button
              onClick={handleRandomExercise}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-random-exercise"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {t('randomExercise')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciseTypes.map((exercise) => {
              const randomPhrase =
                phrases[Math.floor(Math.random() * phrases.length)];

              return (
                <ExerciseCard
                  key={exercise.id}
                  type={exercise.id}
                  title={t(exercise.titleKey as any)}
                  description={t(exercise.descriptionKey as any)}
                  icon={<span className="text-lg">{exercise.icon}</span>}
                  phrase={randomPhrase}
                  onStart={handleExerciseStart}
                  variant={exercise.variant}
                  useRandomFromServer={true}
                />
              );
            })}
            
            {/* Real-Life Examples Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950"
              onClick={() => setLocation("/real-life-examples")}
              data-testid="card-real-life-examples"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                      {language === "ar" ? "أمثلة من الحياة" : "Real-Life Examples"}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                      {language === "ar" 
                        ? "أمثلة طريفة وذكية لاستخدام القرآن في الحياة اليومية"
                        : "Humorous examples of using Quran verses in daily life"
                      }
                    </p>
                  </div>
                  <span className="text-4xl">😄</span>
                </div>
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation("/real-life-examples");
                  }}
                >
                  {language === "ar" ? "تصفح الأمثلة" : "Browse Examples"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dashboard Overview */}
        <section className="mb-12">
          <ProgressStats dailyStats={dailyStats || defaultDailyStats} />
        </section>

        {/* Phrase Database Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {t('quranicPhrasesDatabase')}
            </h2>
            <div className="flex items-center space-x-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48" data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allCategories')}</SelectItem>
                  <SelectItem value="short">{t('shortPhrases')}</SelectItem>
                  <SelectItem value="commands">{t('commands')}</SelectItem>
                  <SelectItem value="proverbs">{t('proverbs')}</SelectItem>
                  <SelectItem value="long">{t('longStructures')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {phrasesLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('loadingPhrases')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPhrases.slice(0, 8).map((phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedPhrases.has(phrase.id)}
                  />
                ))}
              </div>

              {filteredPhrases.length > 8 && (
                <div className="text-center mt-6">
                  <Button variant="outline" data-testid="button-load-more">
                    {t('loadMorePhrases')} <span className="ml-2">↓</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Progress Tracking Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {t('weeklyProgressReport')}
            </h2>
            <Button variant="outline" data-testid="button-export-report">
              <Download className="h-4 w-4 mr-2" />
              {t('exportReport')}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mastered Phrases */}
            <Card data-testid="card-mastered-phrases">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="text-secondary h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t('masteredPhrases')}
                  </h3>
                </div>

                <div className="space-y-3">
                  {masteredPhrases.slice(0, 3).map((progress) => {
                    const phrase = phrases.find(
                      (p) => p.id === progress.phraseId,
                    );
                    return phrase ? (
                      <div
                        key={progress.id}
                        className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                      >
                        <span
                          className="arabic-text text-sm"
                          lang="ar"
                          data-testid={`text-mastered-${progress.id}`}
                        >
                          {phrase.arabicText}
                        </span>
                        <span className="text-accent">⭐</span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="text-mastered-count"
                  >
                    ✅ <strong>{masteredPhrases.length}</strong> {t('phrasesFullyMastered')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Need Review */}
            <Card data-testid="card-need-review">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                    <RotateCcw className="text-accent h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">{t('needReview')}</h3>
                </div>

                <div className="space-y-3">
                  {needReviewPhrases.slice(0, 2).map((progress) => {
                    const phrase = phrases.find(
                      (p) => p.id === progress.phraseId,
                    );
                    return phrase ? (
                      <div
                        key={progress.id}
                        className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                      >
                        <span
                          className="arabic-text text-sm"
                          lang="ar"
                          data-testid={`text-review-${progress.id}`}
                        >
                          {phrase.arabicText}
                        </span>
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          {progress.masteryLevel}%
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="text-review-count"
                  >
                    🔄 <strong>{needReviewPhrases.length}</strong> {t('phrasesNeedPractice')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* New Suggestions */}
            <Card data-testid="card-new-suggestions">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <Lightbulb className="text-primary h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t('newSuggestions')}
                  </h3>
                </div>

                <div className="space-y-3">
                  {phrases.slice(0, 2).map((phrase) => (
                    <div
                      key={phrase.id}
                      className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                    >
                      <span
                        className="arabic-text text-sm"
                        lang="ar"
                        data-testid={`text-suggestion-${phrase.id}`}
                      >
                        {phrase.arabicText}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-primary/20 text-primary hover:bg-primary/30"
                        data-testid={`button-add-suggestion-${phrase.id}`}
                      >
                        {t('add')}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="text-suggestion-count"
                  >
                    🌟 <strong>12</strong> {t('newPhrasesAvailable')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
