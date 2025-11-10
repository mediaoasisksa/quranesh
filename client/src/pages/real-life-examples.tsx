import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Search, Copy, Check } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";
import type { RealLifeExample } from "@shared/schema";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import { useToast } from "@/hooks/use-toast";

export default function RealLifeExamplesPage() {
  const [, setLocation] = useLocation();
  const { dir, t, language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: examples = [], isLoading } = useQuery<RealLifeExample[]>({
    queryKey: ["/api/real-life-examples"],
  });

  const categories = Array.from(new Set(examples.map(ex => ex.category).filter(Boolean)));

  const filteredExamples = examples.filter(example => {
    const matchesSearch = searchQuery === "" || 
      example.situationEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.situationAr.includes(searchQuery) ||
      example.verseArabic.includes(searchQuery);
    
    const matchesCategory = !selectedCategory || example.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getLocalizedSituation = (example: RealLifeExample): string => {
    if (language === "ar") return example.situationAr;
    if (language === "en") return example.situationEn;
    
    // Try to get translation from JSONB field
    if (example.translations?.situation?.[language]) {
      return example.translations.situation[language];
    }
    
    // Fallback to English
    return example.situationEn;
  };

  const getLocalizedUsageNote = (example: RealLifeExample): string => {
    if (language === "ar") return example.usageNoteAr || "";
    if (language === "en") return example.usageNoteEn || "";
    
    // Try to get translation from JSONB field
    if (example.translations?.usageNote?.[language]) {
      return example.translations.usageNote[language];
    }
    
    // Fallback to English
    return example.usageNoteEn || "";
  };

  const copyVerse = (verse: string, id: string) => {
    navigator.clipboard.writeText(verse);
    setCopiedId(id);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الآية إلى الحافظة",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="flex items-center gap-2"
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </Button>
            
            <Link href="/" className="cursor-pointer">
              <img 
                src={logoImage} 
                alt="Quranesh Logo" 
                className="h-16 w-auto object-contain"
              />
            </Link>

            <div className="w-40"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            {t('realLifeExamplesTitle')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('realLifeExamplesDesc')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder={t('searchExamples')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-examples"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              data-testid="button-filter-all"
            >
              {t('all')}
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                data-testid={`button-filter-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Examples Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">
              {t('loading')}
            </p>
          </div>
        ) : filteredExamples.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                {t('noExamplesFound')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example) => (
              <Card 
                key={example.id} 
                className="hover:shadow-lg transition-shadow duration-200"
                data-testid={`card-example-${example.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {getLocalizedSituation(example)}
                    </CardTitle>
                    {example.category && (
                      <Badge variant="secondary" className="shrink-0">
                        {example.category}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {language === "ar" ? example.situationEn : example.situationAr}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quran Verse */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {example.surahReference}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyVerse(example.verseArabic, example.id)}
                        data-testid={`button-copy-verse-${example.id}`}
                      >
                        {copiedId === example.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p 
                      className="arabic-text text-xl text-foreground mb-2" 
                      lang="ar"
                      dir="rtl"
                      data-testid={`text-verse-${example.id}`}
                    >
                      {example.verseArabic}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {example.verseTranslation}
                    </p>
                  </div>

                  {/* Usage Note */}
                  {(example.usageNoteAr || example.usageNoteEn || getLocalizedUsageNote(example)) && (
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {getLocalizedUsageNote(example)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Total Count */}
        {!isLoading && filteredExamples.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {t('showingExamples').replace('{count}', String(filteredExamples.length)).replace('{total}', String(examples.length))}
          </div>
        )}
      </main>
    </div>
  );
}
