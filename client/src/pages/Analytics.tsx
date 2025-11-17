import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Activity, TrendingUp, Trophy, Target } from "lucide-react";
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

interface UserActivity {
  totalUsers: number;
  dailyActivity: {
    date: string;
    activeUsers: number;
    totalSessions: number;
  }[];
}

interface TopUser {
  userId: string;
  username: string;
  email?: string;
  totalSessions: number;
  accuracy: number;
}

export default function Analytics() {
  const { dir } = useLanguage();

  const { data: overview } = useQuery<OverviewStats>({
    queryKey: ["/api/admin/analytics/overview"],
  });

  const { data: exerciseEngagement } = useQuery<ExerciseEngagement[]>({
    queryKey: ["/api/admin/analytics/exercise-engagement"],
  });

  const { data: userActivity } = useQuery<UserActivity>({
    queryKey: ["/api/admin/analytics/user-activity"],
  });

  const { data: topUsers } = useQuery<TopUser[]>({
    queryKey: ["/api/admin/analytics/top-users"],
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

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into user engagement and platform performance
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {overview?.totalActiveUsers || 0} active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.engagementRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Users who completed exercises
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.totalExercises || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {overview?.todayExercises || 0} completed today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quranic Phrases</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.totalPhrases || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Available for practice
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Type Engagement</CardTitle>
              <CardDescription>
                Participation rates and accuracy for each exercise type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exerciseEngagement?.map((exercise) => (
                  <div key={exercise.exerciseType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getExerciseTypeLabel(exercise.exerciseType)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.totalSessions} sessions • {exercise.uniqueUsers} users
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold">{exercise.accuracy}% accuracy</p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.participationRate}% participation
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all"
                        style={{ width: `${exercise.participationRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top 10 Most Active Users
              </CardTitle>
              <CardDescription>
                Users ranked by total exercises completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers?.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {user.email && (
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{user.totalSessions}</p>
                      <p className="text-sm text-muted-foreground">{user.accuracy}% accuracy</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Daily User Activity (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Active users and exercises completed per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {userActivity?.dailyActivity.map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{day.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{day.activeUsers} users</p>
                      <p className="text-sm text-muted-foreground">
                        {day.totalSessions} sessions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
