import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChineseQuranicWord } from "@/data/chineseQuranicWords";

interface ChineseQuranicWordCardProps {
  word: ChineseQuranicWord;
}

export function ChineseQuranicWordCard({ word }: ChineseQuranicWordCardProps) {
  return (
    <Card className="mb-4 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 dark:border-red-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-red-700 dark:text-red-300">
            🇨🇳 汉语词汇源自阿拉伯语
          </CardTitle>
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300">
            词汇 #{word.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{word.chinese}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">汉语</p>
          </div>
          <div className="text-2xl text-gray-400">↔</div>
          <div className="text-center flex-1">
            <p className="text-2xl font-arabic text-amber-700 dark:text-amber-400" dir="rtl">{word.arabic}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">阿拉伯语</p>
          </div>
        </div>
        
        <div className="p-2 bg-amber-50/50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <span className="font-semibold">意思:</span> {word.meaning}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">派生词:</p>
          <div className="grid grid-cols-2 gap-2">
            {word.derivatives.map((derivative, idx) => (
              <div key={idx} className="p-2 bg-white/80 dark:bg-gray-800/80 rounded border border-red-100 dark:border-red-800">
                <p className="font-arabic text-amber-700 dark:text-amber-400 text-right" dir="rtl">{derivative.arabic}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{derivative.chinese}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
