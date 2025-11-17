import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

interface OverviewStats {
  totalUsers: number;
  totalActiveUsers: number;
  engagementRate: number;
  totalExercises: number;
  totalPhrases: number;
  todayExercises: number;
}

interface ExerciseEngagement {
  exerciseType: string;
  totalSessions: number;
  uniqueUsers: number;
  correctSessions: number;
  accuracy: number;
  participationRate: number;
}

interface SessionDuration {
  exerciseType: string;
  avgDuration: number;
  totalSessions: number;
}

export default function Analytics() {
  const { dir, language } = useLanguage();
  const isArabic = language === 'ar';

  const { data: overview } = useQuery<OverviewStats>({
    queryKey: ["/api/admin/analytics/overview"],
  });

  const { data: exerciseEngagement } = useQuery<ExerciseEngagement[]>({
    queryKey: ["/api/admin/analytics/exercise-engagement"],
  });

  const { data: sessionDuration } = useQuery<SessionDuration[]>({
    queryKey: ["/api/admin/analytics/session-duration"],
  });

  const getExerciseTypeLabel = (type: string) => {
    if (isArabic) {
      const labelsAr: Record<string, string> = {
        conversation: "تمارين المحادثة",
        transformation: "مطابقة الحكمة الفلسفية",
        roleplay: "سيناريوهات تمثيل الأدوار",
        dailyContextual: "مطابقة التعبيرات اليومية",
        phonetic_practice: "تمارين النطق",
      };
      return labelsAr[type] || type;
    }
    const labels: Record<string, string> = {
      conversation: "Conversation Practice",
      transformation: "Philosophical Match",
      roleplay: "Role-play Scenarios",
      dailyContextual: "Daily Expression Match",
      phonetic_practice: "Phonetic Practice",
    };
    return labels[type] || type;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}${isArabic ? 'ث' : 's'}`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return isArabic ? `${minutes}د ${remainingSeconds}ث` : `${minutes}m ${remainingSeconds}s`;
  };

  const t = {
    title: isArabic ? 'لوحة الإحصائيات' : 'Analytics Dashboard',
    subtitle: isArabic ? 'إحصائيات المنصة' : 'Platform Statistics',
    overview: isArabic ? 'نظرة عامة' : 'Overview',
    totalUsers: isArabic ? 'إجمالي المستخدمين:' : 'Total Users:',
    activeUsers: isArabic ? 'المستخدمون النشطون:' : 'Active Users:',
    engagementRate: isArabic ? 'معدل المشاركة:' : 'Engagement Rate:',
    totalExercises: isArabic ? 'إجمالي التمارين المكتملة:' : 'Total Exercises Completed:',
    exercisesToday: isArabic ? 'التمارين اليوم:' : 'Exercises Today:',
    exerciseEngagement: isArabic ? 'مشاركة أنواع التمارين' : 'Exercise Type Engagement',
    exerciseType: isArabic ? 'نوع التمرين' : 'Exercise Type',
    sessions: isArabic ? 'الجلسات' : 'Sessions',
    users: isArabic ? 'المستخدمون' : 'Users',
    correct: isArabic ? 'صحيح' : 'Correct',
    accuracy: isArabic ? 'الدقة' : 'Accuracy',
    participation: isArabic ? 'المشاركة' : 'Participation',
    avgDuration: isArabic ? 'متوسط مدة الجلسة' : 'Average Session Duration',
    totalSessions: isArabic ? 'إجمالي الجلسات' : 'Total Sessions',
    avgDurationLabel: isArabic ? 'متوسط المدة' : 'Average Duration',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" dir={dir}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.overview}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.totalUsers}</span>
                <span className="font-bold">{overview?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.activeUsers}</span>
                <span className="font-bold">{overview?.totalActiveUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.engagementRate}</span>
                <span className="font-bold">{overview?.engagementRate || 0}%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.totalExercises}</span>
                <span className="font-bold">{overview?.totalExercises || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">{t.exercisesToday}</span>
                <span className="font-bold">{overview?.todayExercises || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Engagement Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.exerciseEngagement}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className={`${isArabic ? 'text-right' : 'text-left'} py-3 font-medium`}>{t.exerciseType}</th>
                    <th className="text-right py-3 font-medium">{t.sessions}</th>
                    <th className="text-right py-3 font-medium">{t.users}</th>
                    <th className="text-right py-3 font-medium">{t.correct}</th>
                    <th className="text-right py-3 font-medium">{t.accuracy}</th>
                    <th className="text-right py-3 font-medium">{t.participation}</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseEngagement?.map((exercise) => (
                    <tr key={exercise.exerciseType} className="border-b">
                      <td className={`py-3 ${isArabic ? 'text-right' : ''}`}>{getExerciseTypeLabel(exercise.exerciseType)}</td>
                      <td className="text-right py-3 font-semibold">{exercise.totalSessions}</td>
                      <td className="text-right py-3">{exercise.uniqueUsers}</td>
                      <td className="text-right py-3">{exercise.correctSessions}</td>
                      <td className="text-right py-3 font-semibold">{exercise.accuracy}%</td>
                      <td className="text-right py-3 font-semibold">{exercise.participationRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Session Duration Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.avgDuration}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className={`${isArabic ? 'text-right' : 'text-left'} py-3 font-medium`}>{t.exerciseType}</th>
                    <th className="text-right py-3 font-medium">{t.totalSessions}</th>
                    <th className="text-right py-3 font-medium">{t.avgDurationLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionDuration?.map((session) => (
                    <tr key={session.exerciseType} className="border-b">
                      <td className={`py-3 ${isArabic ? 'text-right' : ''}`}>{getExerciseTypeLabel(session.exerciseType)}</td>
                      <td className="text-right py-3 font-semibold">{session.totalSessions}</td>
                      <td className="text-right py-3 font-semibold">{formatDuration(session.avgDuration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
