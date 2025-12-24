import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Languages, MessageCircle } from "lucide-react";
import { SwahiliQuranicWord } from "@/data/swahiliQuranicWords";

interface SwahiliQuranicWordCardProps {
  word: SwahiliQuranicWord;
}

export function SwahiliQuranicWordCard({ word }: SwahiliQuranicWordCardProps) {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700" data-testid="swahili-quranic-word-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Languages className="h-5 w-5" />
            Swahili Qur'anic Vocabulary
          </CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200">
            Arabic Origin
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kiswahili</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300" data-testid="swahili-word">
              {word.swahiliWord}
            </p>
          </div>
          <div className="text-2xl text-gray-300">↔</div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Qur'ani</p>
            <p className="text-2xl font-bold font-amiri text-amber-800 dark:text-amber-200" dir="rtl" data-testid="arabic-word">
              {word.arabicWord}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-amber-600" />
          <span className="text-gray-600 dark:text-gray-400">Mzizi (Root):</span>
          <span className="font-amiri text-lg text-amber-700 dark:text-amber-300" dir="rtl" data-testid="arabic-root">
            {word.root}
          </span>
        </div>
        
        <div className="bg-white/40 dark:bg-black/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm mb-1">
            <MessageCircle className="h-4 w-4 text-amber-600" />
            <span className="text-gray-600 dark:text-gray-400">Mfano (Example):</span>
          </div>
          <p className="text-amber-800 dark:text-amber-200 italic" data-testid="example-sentence">
            "{word.exampleSentence}"
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Maneno yanayofanana (Derivatives - Arabic → Kiswahili):
          </p>
          <div className="grid gap-2">
            {word.derivatives.map((d, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between bg-white/40 dark:bg-black/10 rounded px-3 py-2 text-sm"
                data-testid={`derivative-${i}`}
              >
                <span className="font-amiri text-base text-amber-800 dark:text-amber-200" dir="rtl">
                  {d.arabic}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-700 dark:text-gray-300 text-right flex-1 ml-2">
                  {d.swahili}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
