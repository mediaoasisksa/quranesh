import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Languages, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "id", name: "Indonesian" },
  { code: "tr", name: "Turkish" },
  { code: "ar", name: "Arabic" },
  { code: "ur", name: "Urdu" },
  { code: "zh", name: "Chinese" },
  { code: "sw", name: "Swahili" },
  { code: "so", name: "Somali" },
  { code: "bs", name: "Bosnian" },
  { code: "sq", name: "Albanian" },
  { code: "ru", name: "Russian" },
];

export default function TranslationManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [batchSize, setBatchSize] = useState(10);
  const { toast } = useToast();

  // Fetch translation statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["/api/philosophical-sentences/translation-stats", selectedLanguage],
    queryFn: async () => {
      const response = await fetch(`/api/philosophical-sentences/translation-stats?language=${selectedLanguage}`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  // Bulk translation mutation
  const bulkTranslateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/philosophical-sentences/bulk-translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          limit: batchSize,
        }),
      });
      if (!response.ok) throw new Error("Bulk translation failed");
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "ترجمة جماعية مكتملة",
        description: `تمت ترجمة ${data.translated} جملة بنجاح، فشلت ${data.failed} جملة`,
      });
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الترجمة",
        description: error.message || "فشلت الترجمة الجماعية",
        variant: "destructive",
      });
    },
  });

  const handleBulkTranslate = () => {
    if (!selectedLanguage) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار اللغة أولاً",
        variant: "destructive",
      });
      return;
    }

    bulkTranslateMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <img 
                src={logoImage} 
                alt="Quranesh Logo" 
                className="h-20 cursor-pointer hover:opacity-80 transition-opacity"
                data-testid="img-logo"
              />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Languages className="h-8 w-8" />
                إدارة الترجمات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                نظام الترجمة الجماعية للجمل الفلسفية
              </p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" data-testid="button-back-dashboard">
              العودة للوحة التحكم
            </Button>
          </Link>
        </div>

        {/* Translation Statistics Card */}
        <Card className="mb-6" data-testid="card-translation-stats">
          <CardHeader>
            <CardTitle>إحصائيات الترجمة</CardTitle>
            <CardDescription>
              نظرة عامة على حالة الترجمة للغة المختارة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">اللغة المستهدفة</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">حجم الدفعة</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
                  data-testid="input-batch-size"
                />
              </div>
            </div>

            {statsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg" data-testid="stat-total">
                    <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الجمل</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {stats.totalSentences}
                    </p>
                  </div>

                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg" data-testid="stat-translated">
                    <p className="text-sm text-gray-600 dark:text-gray-400">الجمل المترجمة</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {stats.translatedCount}
                    </p>
                  </div>

                  <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg" data-testid="stat-untranslated">
                    <p className="text-sm text-gray-600 dark:text-gray-400">الجمل غير المترجمة</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.untranslatedCount}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">نسبة التغطية</span>
                    <span className="text-sm font-medium">{stats.coveragePercentage}%</span>
                  </div>
                  <Progress value={parseFloat(stats.coveragePercentage)} className="h-3" />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Bulk Translation Actions */}
        <Card data-testid="card-bulk-translation">
          <CardHeader>
            <CardTitle>الترجمة الجماعية</CardTitle>
            <CardDescription>
              ترجمة عدة جمل دفعة واحدة باستخدام Gemini AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>ملاحظة مهمة:</strong> الترجمة تستخدم Gemini API. تأكد من توفر الحصة (quota) قبل البدء.
                  يتم إضافة تأخير 1.5 ثانية بين كل طلب لتجنب تجاوز الحد.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleBulkTranslate}
                  disabled={bulkTranslateMutation.isPending || !stats?.untranslatedCount}
                  className="flex-1"
                  data-testid="button-start-translation"
                >
                  {bulkTranslateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جارٍ الترجمة...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      بدء الترجمة ({batchSize} جملة)
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => refetchStats()}
                  variant="outline"
                  data-testid="button-refresh-stats"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  تحديث الإحصائيات
                </Button>
              </div>

              {/* Translation Results */}
              {bulkTranslateMutation.data && (
                <div className="mt-4 space-y-2" data-testid="translation-results">
                  <h3 className="font-medium">نتائج الترجمة الأخيرة:</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {(bulkTranslateMutation.data as any).results?.map((result: any, index: number) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 p-2 mb-2 rounded ${
                          result.status === "success"
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-red-50 dark:bg-red-900/20"
                        }`}
                      >
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium arabic-text" dir="rtl">
                            {result.arabicText}
                          </p>
                          {result.status === "success" ? (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {result.translation}
                            </p>
                          ) : (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {result.error}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6" data-testid="card-instructions">
          <CardHeader>
            <CardTitle>كيفية الاستخدام</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>اختر اللغة المستهدفة من القائمة المنسدلة</li>
              <li>حدد حجم الدفعة (عدد الجمل التي سيتم ترجمتها في المرة الواحدة)</li>
              <li>اضغط على "بدء الترجمة" لبدء عملية الترجمة</li>
              <li>انتظر حتى تكتمل الترجمة - قد يستغرق ذلك بعض الوقت</li>
              <li>راجع النتائج وكرر العملية حتى تترجم جميع الجمل</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                💡 <strong>نصيحة:</strong> ابدأ بحجم دفعة صغير (10-20 جملة) للتأكد من أن كل شيء يعمل بشكل صحيح قبل ترجمة دفعات أكبر.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
