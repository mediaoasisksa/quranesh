import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Quote,
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
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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
import { exerciseTypes, getRandomExerciseType } from "@/lib/exercises";
import type { Phrase, DailyStats, UserProgress } from "@shared/schema";

const DEMO_USER_ID = "demo-user";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDark, setIsDark] = useState(false);
  const [bookmarkedPhrases, setBookmarkedPhrases] = useState<Set<string>>(
    new Set(),
  );
  const { isAuthenticated, user, signOut } = useAuth();

  // Fetch phrases
  const { data: phrases = [], isLoading: phrasesLoading } = useQuery<Phrase[]>({
    queryKey: ["/api/phrases"],
  });

  // Fetch daily stats
  const { data: dailyStats } = useQuery<DailyStats>({
    queryKey: ["/api/daily-stats", DEMO_USER_ID],
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/user-progress", DEMO_USER_ID],
  });

  // Fetch weekly stats for progress report
  const { data: weeklyStats = [] } = useQuery<DailyStats[]>({
    queryKey: ["/api/weekly-stats", DEMO_USER_ID],
  });

  const defaultDailyStats: DailyStats = {
    id: "default",
    userId: DEMO_USER_ID,
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
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    window.location.href = `/exercise/${randomType.id}/${randomPhrase?.id}`;
  };

  const handleExerciseStart = (type: string, phraseId?: string) => {
    if (phraseId) {
      window.location.href = `/exercise/${type}/${phraseId}`;
    } else {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      window.location.href = `/exercise/${type}/${randomPhrase?.id}`;
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Quote className="text-primary-foreground h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    Quran Arabic Learning
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    AI-Powered Arabic Tutor
                  </p>
                </div>
              </div>
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
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <UserCircle className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.givenName} {user?.surname}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
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
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin">
                  <Button className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors px-4 py-2 rounded-md text-sm font-semibold">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <section className="mb-12">
          <ProgressStats dailyStats={dailyStats || defaultDailyStats} />
        </section>

        {/* Exercise Types Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Training Exercises
            </h2>
            <Button
              onClick={handleRandomExercise}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-random-exercise"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Random Exercise
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
                  title={exercise.title}
                  description={exercise.description}
                  icon={<span className="text-lg">{exercise.icon}</span>}
                  phrase={randomPhrase}
                  onStart={handleExerciseStart}
                  variant={exercise.variant}
                />
              );
            })}
          </div>
        </section>

        {/* Phrase Database Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Quranic Phrases Database
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
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="short">Short Phrases</SelectItem>
                  <SelectItem value="commands">Commands</SelectItem>
                  <SelectItem value="proverbs">Proverbs</SelectItem>
                  <SelectItem value="long">Long Structures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {phrasesLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading phrases...</p>
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
                    Load More Phrases <span className="ml-2">↓</span>
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
              Weekly Progress Report
            </h2>
            <Button variant="outline" data-testid="button-export-report">
              <Download className="h-4 w-4 mr-2" />
              Export Report
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
                    Mastered Phrases
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
                    ✅ <strong>{masteredPhrases.length} phrases</strong> fully
                    mastered this week
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
                  <h3 className="font-semibold text-foreground">Need Review</h3>
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
                    🔄 <strong>{needReviewPhrases.length} phrases</strong> need
                    more practice
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
                    New Suggestions
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
                        Add
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="text-suggestion-count"
                  >
                    🌟 <strong>12 new phrases</strong> suggested based on your
                    progress
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
