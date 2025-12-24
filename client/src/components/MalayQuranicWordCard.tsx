import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Languages, MessageCircle } from "lucide-react";
import { MalayQuranicWord } from "@/data/malayQuranicWords";

interface MalayQuranicWordCardProps {
  word: MalayQuranicWord;
}

export function MalayQuranicWordCard({ word }: MalayQuranicWordCardProps) {
  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700" data-testid="malay-quranic-word-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
            <Languages className="h-5 w-5" />
            Kosa Kata Qur'ani Melayu
          </CardTitle>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">
            Asal Arab
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bahasa Melayu</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300" data-testid="malay-word">
              {word.malayWord}
            </p>
          </div>
          <div className="text-2xl text-gray-300">↔</div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Qur'ani</p>
            <p className="text-2xl font-bold font-amiri text-yellow-800 dark:text-yellow-200" dir="rtl" data-testid="arabic-word">
              {word.arabicWord}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-yellow-600" />
          <span className="text-gray-600 dark:text-gray-400">Akar kata:</span>
          <span className="font-amiri text-lg text-yellow-700 dark:text-yellow-300" dir="rtl" data-testid="arabic-root">
            {word.root}
          </span>
        </div>
        
        <div className="bg-white/40 dark:bg-black/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm mb-1">
            <MessageCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-600 dark:text-gray-400">Contoh:</span>
          </div>
          <p className="text-yellow-800 dark:text-yellow-200 italic" data-testid="example-sentence">
            "{word.exampleSentence}"
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Kata terbitan (Arab → Melayu):
          </p>
          <div className="grid gap-2">
            {word.derivatives.map((d, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between bg-white/40 dark:bg-black/10 rounded px-3 py-2 text-sm"
                data-testid={`derivative-${i}`}
              >
                <span className="font-amiri text-base text-yellow-800 dark:text-yellow-200" dir="rtl">
                  {d.arabic}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-700 dark:text-gray-300 text-right flex-1 ml-2">
                  {d.malay}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
