import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Phrase } from "@shared/schema";
import { useLanguage } from "@/contexts/language-context";

interface ExerciseCardProps {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  phrase?: Phrase;
  onStart: (type: string, phraseId?: string) => void;
  variant?: "primary" | "secondary" | "accent";
  useRandomFromServer?: boolean;
}

const SAMPLE_PREVIEWS = [
  { meaning: "Flocks", targetWord: "أَبَابِيلَ", options: ["وَأَرْسَلَ", "طَيْرًا", "أَبَابِيلَ", "عَلَيْهِمْ"], surah: "الفيل" },
  { meaning: "The Path", targetWord: "الصِّرَاطَ", options: ["اهْدِنَا", "الصِّرَاطَ", "الْمُسْتَقِيمَ", "رَبِّ"], surah: "الفاتحة" },
  { meaning: "Abundance", targetWord: "الْكَوْثَرَ", options: ["إِنَّا", "أَعْطَيْنَاكَ", "الْكَوْثَرَ", "فَصَلِّ"], surah: "الكوثر" },
  { meaning: "Daybreak", targetWord: "الْفَلَقِ", options: ["قُلْ", "أَعُوذُ", "بِرَبِّ", "الْفَلَقِ"], surah: "الفلق" },
  { meaning: "One", targetWord: "أَحَدٌ", options: ["قُلْ", "هُوَ", "أَحَدٌ", "اللَّهُ"], surah: "الإخلاص" },
  { meaning: "The Forenoon", targetWord: "الضُّحَى", options: ["الضُّحَى", "وَاللَّيْلِ", "سَجَى", "وَدَّعَكَ"], surah: "الضحى" },
];

export default function ExerciseCard({
  type,
  title,
  description,
  icon,
  phrase,
  onStart,
  variant = "primary",
  useRandomFromServer = false,
}: ExerciseCardProps) {
  const { t, language } = useLanguage();
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const typeHash = type === 'daily_contextual' ? 0 : type === 'conversation' ? 2 : 4;
    setPreviewIndex(typeHash % SAMPLE_PREVIEWS.length);
  }, [type]);

  const variantStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  const buttonStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  };

  const handleStart = () => {
    onStart(type, useRandomFromServer ? undefined : phrase?.id);
  };

  const preview = SAMPLE_PREVIEWS[previewIndex];

  const renderVocabPreview = () => {
    return (
      <div className="mb-4">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 text-center border border-primary/20 mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {t('chooseVerseContaining')}
          </p>
          <p className="text-lg font-bold text-primary">
            {preview.meaning}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            📖 {t('surahLabel')} {preview.surah}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {preview.options.map((option, i) => {
            const isCorrect = option === preview.targetWord;
            return (
              <div
                key={i}
                className={`text-sm arabic-text rounded-md px-2 py-1.5 border text-center ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                    : 'bg-muted/30 border-border text-muted-foreground'
                }`}
                lang="ar"
                dir="rtl"
              >
                <span className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                  <span className="font-semibold">{option}</span>
                  {isCorrect && <span className="text-xs">✅</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card
      className="exercise-card bg-card rounded-lg"
      data-testid={`card-exercise-${type}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${variantStyles[variant]}`}
          >
            {icon}
          </div>
          <div>
            <h3
              className="font-semibold text-foreground"
              data-testid={`text-exercise-title-${type}`}
            >
              {title}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-testid={`text-exercise-description-${type}`}
            >
              {description}
            </p>
          </div>
        </div>

        {renderVocabPreview()}

        <div className="flex justify-end">
          <Button
            className={`text-sm transition-colors ${buttonStyles[variant]}`}
            onClick={handleStart}
            data-testid={`button-start-exercise-${type}`}
          >
            {t('startPracticing')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
