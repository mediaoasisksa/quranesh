import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Languages } from "lucide-react";
import { TurkishQuranicWord } from "@/data/turkishQuranicWords";

interface TurkishQuranicWordCardProps {
  word: TurkishQuranicWord;
}

export function TurkishQuranicWordCard({ word }: TurkishQuranicWordCardProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700" data-testid="turkish-quranic-word-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Languages className="h-5 w-5" />
            Kur'an'dan Türkçe Kelimeler
          </CardTitle>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
            Arapça Kökenli
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Türkçe</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300" data-testid="turkish-word">
              {word.turkishWord}
            </p>
          </div>
          <div className="text-2xl text-gray-300">↔</div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kur'an'da</p>
            <p className="text-2xl font-bold font-amiri text-emerald-800 dark:text-emerald-200" dir="rtl" data-testid="arabic-word">
              {word.arabicWord}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          <span className="text-gray-600 dark:text-gray-400">Kök:</span>
          <span className="font-amiri text-lg text-emerald-700 dark:text-emerald-300" dir="rtl" data-testid="arabic-root">
            {word.root}
          </span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Türevler (Arapça → Türkçe):
          </p>
          <div className="grid gap-2">
            {word.derivatives.map((d, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between bg-white/40 dark:bg-black/10 rounded px-3 py-2 text-sm"
                data-testid={`derivative-${i}`}
              >
                <span className="font-amiri text-base text-emerald-800 dark:text-emerald-200" dir="rtl">
                  {d.arabic}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-700 dark:text-gray-300 text-right flex-1 ml-2">
                  {d.turkish}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
