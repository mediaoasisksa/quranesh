import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Tag, Bookmark } from "lucide-react";
import AudioButton from "./audio-button";
import type { Phrase } from "@shared/schema";

interface PhraseCardProps {
  phrase: Phrase;
  onBookmark?: (phraseId: string) => void;
  isBookmarked?: boolean;
}

export default function PhraseCard({ phrase, onBookmark, isBookmarked = false }: PhraseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-phrase-${phrase.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p 
              className="arabic-text text-lg text-foreground mb-2" 
              lang="ar"
              data-testid="text-arabic-phrase"
            >
              {phrase.arabicText}
            </p>
            <p className="text-sm text-muted-foreground mb-3" data-testid="text-english-translation">
              {phrase.englishTranslation}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1" data-testid="text-surah-ayah">
                <BookOpen className="h-3 w-3" />
                {phrase.surahAyah}
              </span>
              <span className="flex items-center gap-1" data-testid="text-category">
                <Tag className="h-3 w-3" />
                {phrase.category}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AudioButton 
              text={phrase.arabicText} 
              lang="ar-SA"
              data-testid={`button-audio-${phrase.id}`}
            />
            {onBookmark && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onBookmark(phrase.id)}
                className={isBookmarked ? "text-accent" : "text-muted-foreground hover:text-accent"}
                data-testid={`button-bookmark-${phrase.id}`}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-foreground" data-testid="text-life-application">
            <strong>Life Application:</strong> {phrase.lifeApplication}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
