import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Lock, 
  Play,
  ChevronRight,
  Award,
  Volume2,
  ArrowLeft,
  Info,
  AlertTriangle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";

interface DiplomaWeek {
  id: string;
  weekNumber: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  lessonContentAr: string;
  lessonContentEn: string;
  grammarFocus: string | null;
}

interface DiplomaVocabulary {
  id: string;
  weekId: string;
  wordAr: string;
  root: string | null;
  translit: string;
  meaningEn: string;
  meaningAr: string;
  derivations: Array<{ word: string; meaning: string }> | null;
  exampleQuranic: string | null;
  exampleModern: string | null;
}

interface DiplomaExercise {
  id: string;
  weekId: string;
  exerciseType: string;
  questionAr: string;
  questionEn: string | null;
  sentenceWithBlanks: string | null;
  wordBank: string[] | null;
  shuffledWords: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  isQuiz: number;
}

interface UserProgress {
  id: string;
  userId: string;
  currentWeek: number;
  completedWeeks: number[];
  completedExercises: string[];
  quizScores: Record<number, number>;
  completionPercentage: number;
  isCompleted: number;
}

const DISCLAIMER = {
  ar: "هذا المحتوى لتعليم اللغة العربية فقط، والنصوص تُستخدم كأمثلة لغوية دون أي تعليم ديني.",
  en: "This content is for Arabic language learning only. Texts are used as linguistic examples without any religious instruction."
};

export default function DiplomaPage() {
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("lesson");
  
  const userId = localStorage.getItem("userId") || "demo-user";
  
  const { data: weeks, isLoading: weeksLoading } = useQuery<DiplomaWeek[]>({
    queryKey: ["/api/diploma/weeks"],
  });
  
  const { data: progress } = useQuery<UserProgress | null>({
    queryKey: ["/api/diploma/progress", userId],
  });
  
  const { data: weekDetail } = useQuery<{
    week: DiplomaWeek;
    vocabulary: DiplomaVocabulary[];
    exercises: DiplomaExercise[];
  }>({
    queryKey: ["/api/diploma/weeks", selectedWeek],
    enabled: selectedWeek !== null,
  });
  
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/diploma/enroll", { userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diploma/progress", userId] });
    }
  });
  
  const isEnrolled = progress !== null && progress !== undefined;
  const completedWeeks = progress?.completedWeeks || [];
  
  const getWeekStatus = (weekNum: number) => {
    if (completedWeeks.includes(weekNum)) return "completed";
    if (!isEnrolled) return "locked";
    if (weekNum === 1) return "available";
    if (completedWeeks.includes(weekNum - 1)) return "available";
    return "locked";
  };
  
  if (weeksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (selectedWeek && weekDetail) {
    return (
      <WeekDetail 
        weekDetail={weekDetail}
        userId={userId}
        progress={progress}
        onBack={() => setSelectedWeek(null)}
        language={language}
        isRTL={isRTL}
      />
    );
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              {language === 'ar' ? 'دبلوم اللغة العربية' : 'Arabic Language Diploma'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {language === 'ar' 
                ? '12 أسبوعًا لإتقان العربية باستخدام المفردات القرآنية كمصدر لغوي'
                : '12 weeks to master Arabic using Quranic vocabulary as a linguistic corpus'}
            </p>
          </div>
        </div>
        
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {language === 'ar' ? DISCLAIMER.ar : DISCLAIMER.en}
          </AlertDescription>
        </Alert>
        
        {!isEnrolled && (
          <Card className="mb-8 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300">
                  {language === 'ar' ? 'ابدأ رحلتك في تعلم العربية' : 'Start Your Arabic Learning Journey'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'ar' 
                    ? 'برنامج متكامل في 12 أسبوعًا'
                    : 'Complete program in 12 weeks'}
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => enrollMutation.mutate()}
                disabled={enrollMutation.isPending}
                data-testid="button-enroll-diploma"
              >
                <Play className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'الالتحاق بالدبلوم' : 'Enroll in Diploma'}
              </Button>
            </CardContent>
          </Card>
        )}
        
        {isEnrolled && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                  {language === 'ar' ? 'تقدمك' : 'Your Progress'}
                </h3>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {progress?.completionPercentage || 0}%
                </Badge>
              </div>
              <Progress value={progress?.completionPercentage || 0} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{completedWeeks.length} / 12 {language === 'ar' ? 'أسابيع مكتملة' : 'weeks completed'}</span>
                <span>{progress?.completedExercises?.length || 0} / 256 {language === 'ar' ? 'تمرين' : 'exercises'}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weeks?.map((week) => {
            const status = getWeekStatus(week.weekNumber);
            const quizScore = progress?.quizScores?.[week.weekNumber];
            
            return (
              <Card 
                key={week.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  status === 'locked' ? 'opacity-60' : ''
                } ${status === 'completed' ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                onClick={() => status !== 'locked' && setSelectedWeek(week.weekNumber)}
                data-testid={`card-week-${week.weekNumber}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={status === 'completed' ? 'default' : 'outline'} className={
                      status === 'completed' ? 'bg-emerald-600' : ''
                    }>
                      {language === 'ar' ? `الأسبوع ${week.weekNumber}` : `Week ${week.weekNumber}`}
                    </Badge>
                    {status === 'completed' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    {status === 'locked' && <Lock className="h-5 w-5 text-gray-400" />}
                    {status === 'available' && <ChevronRight className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {language === 'ar' ? week.titleAr : week.titleEn}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' ? week.descriptionAr : week.descriptionEn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="h-4 w-4" />
                    <span>20 {language === 'ar' ? 'مفردة' : 'vocabulary'} • 21 {language === 'ar' ? 'تمرين' : 'exercises'}</span>
                  </div>
                  {quizScore !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{language === 'ar' ? 'درجة الاختبار:' : 'Quiz Score:'} {quizScore}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeekDetail({ 
  weekDetail, 
  userId,
  progress,
  onBack, 
  language, 
  isRTL 
}: { 
  weekDetail: { week: DiplomaWeek; vocabulary: DiplomaVocabulary[]; exercises: DiplomaExercise[] };
  userId: string;
  progress: UserProgress | null | undefined;
  onBack: () => void;
  language: string;
  isRTL: boolean;
}) {
  const [activeTab, setActiveTab] = useState("lesson");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  
  const { week, vocabulary, exercises } = weekDetail;
  const currentExercise = exercises[currentExerciseIndex];
  const completedExercises = progress?.completedExercises || [];
  
  const submitMutation = useMutation({
    mutationFn: async (answer: string) => {
      const res = await apiRequest("POST", "/api/diploma/submit-answer", {
        userId,
        exerciseId: currentExercise.id,
        weekNumber: week.weekNumber,
        userAnswer: answer,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      setFeedback({ isCorrect: data.isCorrect, explanation: data.explanation || "" });
      queryClient.invalidateQueries({ queryKey: ["/api/diploma/progress", userId] });
    }
  });
  
  const completeWeekMutation = useMutation({
    mutationFn: async (quizScore: number) => {
      const res = await apiRequest("POST", "/api/diploma/complete-week", {
        userId,
        weekNumber: week.weekNumber,
        quizScore,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diploma/progress", userId] });
      onBack();
    }
  });
  
  const handleSubmitFillBlanks = () => {
    if (!userAnswer.trim()) return;
    submitMutation.mutate(userAnswer);
  };
  
  const handleSubmitReorder = () => {
    if (selectedWords.length === 0) return;
    const answer = selectedWords.join(" ");
    submitMutation.mutate(answer);
  };
  
  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };
  
  const nextExercise = () => {
    setFeedback(null);
    setUserAnswer("");
    setSelectedWords([]);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };
  
  const speakArabic = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const allExercisesCompleted = exercises.every(ex => completedExercises.includes(ex.id));
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-weeks">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Badge className="mb-2">{language === 'ar' ? `الأسبوع ${week.weekNumber}` : `Week ${week.weekNumber}`}</Badge>
            <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">
              {language === 'ar' ? week.titleAr : week.titleEn}
            </h1>
          </div>
        </div>
        
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {language === 'ar' ? DISCLAIMER.ar : DISCLAIMER.en}
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lesson" data-testid="tab-lesson">
              <BookOpen className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'الدرس' : 'Lesson'}
            </TabsTrigger>
            <TabsTrigger value="vocabulary" data-testid="tab-vocabulary">
              <span className="font-arabic mr-2">ا ب</span>
              {language === 'ar' ? 'المفردات' : 'Vocabulary'}
            </TabsTrigger>
            <TabsTrigger value="exercises" data-testid="tab-exercises">
              <GraduationCap className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'التمارين' : 'Exercises'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lesson" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[60vh]">
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {language === 'ar' ? week.lessonContentAr : week.lessonContentEn}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vocabulary" className="mt-4">
            <div className="grid gap-4">
              {vocabulary.map((vocab, index) => (
                <Card key={vocab.id} data-testid={`card-vocab-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-arabic text-emerald-700 dark:text-emerald-400">
                            {vocab.wordAr}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => speakArabic(vocab.wordAr)}
                            data-testid={`button-speak-${index}`}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-500 text-sm mb-1">{vocab.translit}</p>
                        {vocab.root && (
                          <Badge variant="outline" className="mb-2">
                            {language === 'ar' ? 'الجذر:' : 'Root:'} {vocab.root}
                          </Badge>
                        )}
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>{language === 'ar' ? 'المعنى:' : 'Meaning:'}</strong> {language === 'ar' ? vocab.meaningAr : vocab.meaningEn}
                        </p>
                        {vocab.exampleModern && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <strong>{language === 'ar' ? 'مثال:' : 'Example:'}</strong> {vocab.exampleModern}
                          </p>
                        )}
                        {vocab.derivations && vocab.derivations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">{language === 'ar' ? 'اشتقاقات:' : 'Derivations:'}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {vocab.derivations.map((d, i) => (
                                <Badge key={i} variant="secondary">{d.word} - {d.meaning}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="exercises" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {language === 'ar' ? 'التمرين' : 'Exercise'} {currentExerciseIndex + 1} / {exercises.length}
                  </CardTitle>
                  <Badge variant={currentExercise?.exerciseType === 'fill_blanks' ? 'default' : 'secondary'}>
                    {currentExercise?.exerciseType === 'fill_blanks' 
                      ? (language === 'ar' ? 'املأ الفراغ' : 'Fill in Blank')
                      : (language === 'ar' ? 'رتب الكلمات' : 'Reorder Words')}
                  </Badge>
                </div>
                <Progress value={((currentExerciseIndex + 1) / exercises.length) * 100} className="mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {currentExercise && (
                  <>
                    <p className="text-lg font-medium">
                      {language === 'ar' ? currentExercise.questionAr : currentExercise.questionEn}
                    </p>
                    
                    {currentExercise.exerciseType === 'fill_blanks' && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-xl font-arabic">
                          {currentExercise.sentenceWithBlanks}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {currentExercise.wordBank?.map((word, i) => (
                            <Button
                              key={i}
                              variant={userAnswer === word ? "default" : "outline"}
                              onClick={() => setUserAnswer(word)}
                              className="font-arabic text-lg"
                              data-testid={`button-word-${i}`}
                            >
                              {word}
                            </Button>
                          ))}
                        </div>
                        {!feedback && (
                          <Button 
                            onClick={handleSubmitFillBlanks}
                            disabled={!userAnswer || submitMutation.isPending}
                            className="w-full"
                            data-testid="button-submit-answer"
                          >
                            {language === 'ar' ? 'تحقق من الإجابة' : 'Check Answer'}
                          </Button>
                        )}
                      </>
                    )}
                    
                    {currentExercise.exerciseType === 'reorder' && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-h-[60px] flex flex-wrap gap-2 justify-center">
                          {selectedWords.length > 0 ? (
                            selectedWords.map((word, i) => (
                              <Badge 
                                key={i} 
                                className="text-lg py-2 px-3 cursor-pointer font-arabic"
                                onClick={() => handleWordClick(word)}
                              >
                                {word}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400">
                              {language === 'ar' ? 'اضغط على الكلمات لترتيبها' : 'Click words to arrange them'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {currentExercise.shuffledWords?.map((word, i) => (
                            <Button
                              key={i}
                              variant={selectedWords.includes(word) ? "secondary" : "outline"}
                              onClick={() => handleWordClick(word)}
                              className="font-arabic text-lg"
                              disabled={selectedWords.includes(word)}
                              data-testid={`button-reorder-word-${i}`}
                            >
                              {word}
                            </Button>
                          ))}
                        </div>
                        {!feedback && (
                          <Button 
                            onClick={handleSubmitReorder}
                            disabled={selectedWords.length === 0 || submitMutation.isPending}
                            className="w-full"
                            data-testid="button-submit-reorder"
                          >
                            {language === 'ar' ? 'تحقق من الإجابة' : 'Check Answer'}
                          </Button>
                        )}
                      </>
                    )}
                    
                    {feedback && (
                      <Alert className={feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                        <AlertDescription>
                          <div className="flex items-center gap-2 mb-2">
                            {feedback.isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                            <strong className={feedback.isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {feedback.isCorrect 
                                ? (language === 'ar' ? 'إجابة صحيحة!' : 'Correct!')
                                : (language === 'ar' ? 'حاول مرة أخرى' : 'Try Again')}
                            </strong>
                          </div>
                          {feedback.explanation && <p className="text-sm">{feedback.explanation}</p>}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {feedback && (
                      <div className="flex gap-2">
                        {currentExerciseIndex < exercises.length - 1 ? (
                          <Button onClick={nextExercise} className="flex-1" data-testid="button-next-exercise">
                            {language === 'ar' ? 'التمرين التالي' : 'Next Exercise'}
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => completeWeekMutation.mutate(80)} 
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={completeWeekMutation.isPending}
                            data-testid="button-complete-week"
                          >
                            <Award className="h-4 w-4 mr-2" />
                            {language === 'ar' ? 'إكمال الأسبوع' : 'Complete Week'}
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
