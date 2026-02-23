import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, PlusCircle } from "lucide-react";
import type { DailyStats } from "@shared/schema";
import { useLanguage } from "@/contexts/language-context";

interface ProgressStatsProps {
  dailyStats: DailyStats;
}

export default function ProgressStats({ dailyStats }: ProgressStatsProps) {
  const { t } = useLanguage();
  const targetDaily = 20;
  const progressPercentage = Math.min(100, Math.round(((dailyStats.phrasesUsed || 0) / targetDaily) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card data-testid="card-daily-progress">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t('dailyPhrasesUsed')}</h3>
            <div className="relative w-12 h-12">
              <svg className="progress-ring w-12 h-12" viewBox="0 0 36 36">
                <path 
                  className="text-muted" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path 
                  className="progress-ring-fill text-primary" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeDashoffset="0" 
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary" data-testid="text-progress-percent">
                  {progressPercentage}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-phrases-used">
            {dailyStats.phrasesUsed}
          </div>
          <p className="text-xs text-muted-foreground">{t('targetPerDay')}: {targetDaily}</p>
        </CardContent>
      </Card>

      <Card data-testid="card-exercises-completed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t('exercisesCompleted')}</h3>
            <CheckCircle className="text-secondary text-lg h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-exercises-completed">
            {dailyStats.exercicesCompleted}
          </div>
          <p className="text-xs text-muted-foreground">{t('today')}</p>
        </CardContent>
      </Card>

      <Card data-testid="card-accuracy-rate">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t('accuracyRate')}</h3>
            <Target className="text-accent text-lg h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-accuracy-rate">
            {dailyStats.accuracyRate}%
          </div>
          <p className="text-xs text-muted-foreground">{t('todayPerformance')}</p>
        </CardContent>
      </Card>

      <Card data-testid="card-new-phrases">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t('availablePhrases')}</h3>
            <PlusCircle className="text-primary text-lg h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-available-phrases">
            15
          </div>
          <p className="text-xs text-muted-foreground">{t('readyToPractice')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
