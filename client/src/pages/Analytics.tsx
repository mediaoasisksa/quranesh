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
  const { dir } = useLanguage();

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
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" dir={dir}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Platform Statistics</p>
      </div>

      <div className="space-y-6">
        {/* Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Users:</span>
                <span className="font-bold">{overview?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Active Users:</span>
                <span className="font-bold">{overview?.totalActiveUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Engagement Rate:</span>
                <span className="font-bold">{overview?.engagementRate || 0}%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Exercises Completed:</span>
                <span className="font-bold">{overview?.totalExercises || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Exercises Today:</span>
                <span className="font-bold">{overview?.todayExercises || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Total Quranic Phrases:</span>
                <span className="font-bold">{overview?.totalPhrases || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Engagement Section */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Type Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Exercise Type</th>
                    <th className="text-right py-3 font-medium">Sessions</th>
                    <th className="text-right py-3 font-medium">Users</th>
                    <th className="text-right py-3 font-medium">Correct</th>
                    <th className="text-right py-3 font-medium">Accuracy</th>
                    <th className="text-right py-3 font-medium">Participation</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseEngagement?.map((exercise) => (
                    <tr key={exercise.exerciseType} className="border-b">
                      <td className="py-3">{getExerciseTypeLabel(exercise.exerciseType)}</td>
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
            <CardTitle>Average Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Exercise Type</th>
                    <th className="text-right py-3 font-medium">Total Sessions</th>
                    <th className="text-right py-3 font-medium">Average Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionDuration?.map((session) => (
                    <tr key={session.exerciseType} className="border-b">
                      <td className="py-3">{getExerciseTypeLabel(session.exerciseType)}</td>
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
