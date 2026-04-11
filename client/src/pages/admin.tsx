import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { Users, BookOpen, Settings, Shield, Plus, Trash2, Edit, ArrowLeft, BarChart3, MessageSquare, Drama, BookText, Tag, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface HumanSituation {
  id: string;
  situationAr: string;
  situationEn: string;
  category: string;
  suggestedVerse: string;
  contextualLogic: string;
  contextualLogicEn: string;
}

interface QuestionBank {
  id: string;
  theme: string;
  themeEnglish: string;
  description: string | null;
  tags: string[];
  correctPhraseIds: string[];
  difficulty: number;
  category: string;
}

interface ConversationPrompt {
  id: string;
  question: string;
  questionEn: string | null;
  suggestedVerse: string;
  category: string | null;
  symbolicMeaning: string | null;
  hint: string | null;
  claim: string | null;
  evidencePhrase: string | null;
  ayahText: string | null;
  sourceRef: string | null;
}

interface RoleplayScenario {
  id: string;
  scenario: string;
  scenarioEn: string | null;
  theme: string;
  emotionalState: string | null;
  difficulty: number;
  suggestedVerse: string | null;
  verseSource: string | null;
  verseExplanation: string | null;
  verseExplanationEn: string | null;
  psychologicalDepth: string | null;
}

interface PhraseItem {
  id: string;
  arabicText: string;
  englishTranslation: string;
  surahAyah: string;
  lifeApplication: string;
  category: string;
  difficulty: number;
  symbolicMeaning: string | null;
  isPracticalDailyUse: number;
  usageDomain: string | null;
  register: string | null;
}

interface AdminPricingPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  duration: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

function PricingTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ plans: AdminPricingPlan[] }>({
    queryKey: ["/api/admin/pricing"],
  });

  const handleEdit = (id: string, currentPrice: number) => {
    setEditPrices(prev => ({ ...prev, [id]: String(currentPrice) }));
  };

  const handleSave = async (planId: string) => {
    const newPrice = parseInt(editPrices[planId] ?? "");
    if (isNaN(newPrice) || newPrice < 0) {
      toast({ title: "خطأ", description: "يرجى إدخال سعر صحيح (رقم موجب)", variant: "destructive" });
      return;
    }
    setSavingId(planId);
    try {
      await apiRequest("PUT", `/api/admin/pricing/${planId}`, { price: newPrice });
      toast({ title: "✅ تم التحديث", description: `تم تغيير سعر الباقة إلى ${newPrice} ريال` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pricing"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      setEditPrices(prev => { const n = { ...prev }; delete n[planId]; return n; });
    } catch {
      toast({ title: "خطأ", description: "فشل تحديث السعر، حاول مرة أخرى", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const PLAN_LABELS: Record<string, string> = {
    "learner": "متعلم",
    "sponsor-5": "راعي فضي (5 طلاب)",
    "sponsor-10": "متعلم ذهبي (10 طلاب)",
    "certificate": "شهادة أداء رسمية",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            إدارة أسعار الباقات
          </CardTitle>
          <CardDescription>
            يمكنك تعديل سعر أي باقة مباشرة. السعر المحدث يظهر فوراً في صفحة التسعير وعملية الدفع.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">جار التحميل…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الباقة</TableHead>
                  <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                  <TableHead className="text-right">المدة</TableHead>
                  <TableHead className="text-right">السعر الحالي (ريال)</TableHead>
                  <TableHead className="text-right">السعر الجديد</TableHead>
                  <TableHead className="text-right">آخر تعديل</TableHead>
                  <TableHead className="text-right">حفظ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.plans.map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      {PLAN_LABELS[plan.id] ?? plan.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{plan.nameEn}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {plan.duration === "year" ? "سنوي" : "مرة واحدة"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xl font-bold text-primary">{plan.price}</span>
                      <span className="text-xs text-muted-foreground mr-1">ريال</span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        className="w-28 text-center"
                        placeholder={String(plan.price)}
                        value={editPrices[plan.id] ?? ""}
                        onChange={e => handleEdit(plan.id, plan.price) || setEditPrices(prev => ({ ...prev, [plan.id]: e.target.value }))}
                        onFocus={() => handleEdit(plan.id, plan.price)}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {plan.updatedAt
                        ? new Date(plan.updatedAt).toLocaleDateString("ar-SA")
                        : "—"}
                      {plan.updatedBy && (
                        <div className="text-xs opacity-60">{plan.updatedBy}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={!editPrices[plan.id] || savingId === plan.id}
                        onClick={() => handleSave(plan.id)}
                        className="gap-1"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {savingId === plan.id ? "جار الحفظ…" : "حفظ"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
        <CardContent className="pt-5">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ تغيير السعر لا يؤثر على الاشتراكات الحالية — فقط على المدفوعات الجديدة. الأسعار مخزنة في قاعدة البيانات ولا تتطلب إعادة نشر.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { dir } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const [newSituation, setNewSituation] = useState({ situationAr: "", situationEn: "", category: "", suggestedVerse: "", contextualLogic: "", contextualLogicEn: "" });
  const [editingSituation, setEditingSituation] = useState<HumanSituation | null>(null);
  const [newQuestion, setNewQuestion] = useState({ theme: "", themeEnglish: "", description: "", tags: "", correctPhraseIds: "", difficulty: 1, category: "thematic" });
  const [editingQuestion, setEditingQuestion] = useState<QuestionBank | null>(null);
  const [newPrompt, setNewPrompt] = useState({ question: "", questionEn: "", suggestedVerse: "", category: "", symbolicMeaning: "", hint: "", claim: "", evidencePhrase: "", ayahText: "", sourceRef: "" });
  const [editingPrompt, setEditingPrompt] = useState<ConversationPrompt | null>(null);
  const [newScenario, setNewScenario] = useState({ scenario: "", scenarioEn: "", theme: "", emotionalState: "", difficulty: 1, suggestedVerse: "", verseSource: "", verseExplanation: "", verseExplanationEn: "", psychologicalDepth: "" });
  const [editingScenario, setEditingScenario] = useState<RoleplayScenario | null>(null);
  const [newPhrase, setNewPhrase] = useState({ arabicText: "", englishTranslation: "", surahAyah: "", lifeApplication: "", category: "short", difficulty: 1, symbolicMeaning: "", isPracticalDailyUse: 0, usageDomain: "", register: "conversational" });
  const [editingPhrase, setEditingPhrase] = useState<PhraseItem | null>(null);

  const isAdmin = !!user?.isAdmin;

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({ queryKey: ["/api/admin/users"], enabled: isAdmin });
  const { data: situations, isLoading: situationsLoading } = useQuery<HumanSituation[]>({ queryKey: ["/api/admin/human-situations"], enabled: isAdmin });
  const { data: stats } = useQuery<{ totalUsers: number; totalSituations: number; totalExercises: number }>({ queryKey: ["/api/admin/stats"], enabled: isAdmin });
  const { data: questions, isLoading: questionsLoading } = useQuery<QuestionBank[]>({ queryKey: ["/api/admin/question-banks"], enabled: isAdmin });
  const { data: prompts, isLoading: promptsLoading } = useQuery<ConversationPrompt[]>({ queryKey: ["/api/admin/conversation-prompts"], enabled: isAdmin });
  const { data: scenarios, isLoading: scenariosLoading } = useQuery<RoleplayScenario[]>({ queryKey: ["/api/admin/roleplay-scenarios"], enabled: isAdmin });
  const { data: phrasesList, isLoading: phrasesLoading } = useQuery<PhraseItem[]>({ queryKey: ["/api/admin/phrases"], enabled: isAdmin });
  const { data: legacyStats, refetch: refetchLegacyStats } = useQuery<{
    cutoffDate: string; legacyFreeCount: number; paidCount: number; sponsoredCount: number; selfFundedCount: number; totalUsers: number; lastBackfillRun: string | null;
  }>({ queryKey: ["/api/admin/legacy-stats"], enabled: isAdmin });

  const backfillLegacyMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/admin/backfill-legacy", {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/legacy-stats"] }); toast({ title: "اكتمل تطبيق المنح المجانية القديمة" }); },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => apiRequest("POST", `/api/admin/users/${userId}/toggle-admin`, { isAdmin }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }); toast({ title: "تم التحديث" }); },
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => apiRequest("DELETE", `/api/admin/users/${userId}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }); toast({ title: "تم الحذف" }); },
  });

  const addSituationMutation = useMutation({
    mutationFn: async (s: typeof newSituation) => apiRequest("POST", "/api/admin/human-situations", s),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/human-situations"] }); setNewSituation({ situationAr: "", situationEn: "", category: "", suggestedVerse: "", contextualLogic: "", contextualLogicEn: "" }); toast({ title: "تمت الإضافة" }); },
  });
  const updateSituationMutation = useMutation({
    mutationFn: async (s: HumanSituation) => apiRequest("PUT", `/api/admin/human-situations/${s.id}`, s),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/human-situations"] }); setEditingSituation(null); toast({ title: "تم التحديث" }); },
  });
  const deleteSituationMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/human-situations/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/human-situations"] }); toast({ title: "تم الحذف" }); },
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (q: typeof newQuestion) => apiRequest("POST", "/api/admin/question-banks", { ...q, tags: q.tags ? q.tags.split(",").map(t => t.trim()) : [], correctPhraseIds: q.correctPhraseIds ? q.correctPhraseIds.split(",").map(id => id.trim()) : [] }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/question-banks"] }); setNewQuestion({ theme: "", themeEnglish: "", description: "", tags: "", correctPhraseIds: "", difficulty: 1, category: "thematic" }); toast({ title: "تمت الإضافة" }); },
  });
  const updateQuestionMutation = useMutation({
    mutationFn: async (q: QuestionBank) => apiRequest("PUT", `/api/admin/question-banks/${q.id}`, q),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/question-banks"] }); setEditingQuestion(null); toast({ title: "تم التحديث" }); },
  });
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/question-banks/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/question-banks"] }); toast({ title: "تم الحذف" }); },
  });

  const addPromptMutation = useMutation({
    mutationFn: async (p: typeof newPrompt) => apiRequest("POST", "/api/admin/conversation-prompts", p),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/conversation-prompts"] }); setNewPrompt({ question: "", questionEn: "", suggestedVerse: "", category: "", symbolicMeaning: "", hint: "", claim: "", evidencePhrase: "", ayahText: "", sourceRef: "" }); toast({ title: "تمت الإضافة" }); },
  });
  const updatePromptMutation = useMutation({
    mutationFn: async (p: ConversationPrompt) => apiRequest("PUT", `/api/admin/conversation-prompts/${p.id}`, p),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/conversation-prompts"] }); setEditingPrompt(null); toast({ title: "تم التحديث" }); },
  });
  const deletePromptMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/conversation-prompts/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/conversation-prompts"] }); toast({ title: "تم الحذف" }); },
  });

  const addScenarioMutation = useMutation({
    mutationFn: async (s: typeof newScenario) => apiRequest("POST", "/api/admin/roleplay-scenarios", s),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/roleplay-scenarios"] }); setNewScenario({ scenario: "", scenarioEn: "", theme: "", emotionalState: "", difficulty: 1, suggestedVerse: "", verseSource: "", verseExplanation: "", verseExplanationEn: "", psychologicalDepth: "" }); toast({ title: "تمت الإضافة" }); },
  });
  const updateScenarioMutation = useMutation({
    mutationFn: async (s: RoleplayScenario) => apiRequest("PUT", `/api/admin/roleplay-scenarios/${s.id}`, s),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/roleplay-scenarios"] }); setEditingScenario(null); toast({ title: "تم التحديث" }); },
  });
  const deleteScenarioMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/roleplay-scenarios/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/roleplay-scenarios"] }); toast({ title: "تم الحذف" }); },
  });

  const addPhraseMutation = useMutation({
    mutationFn: async (p: typeof newPhrase) => apiRequest("POST", "/api/admin/phrases", p),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/phrases"] }); setNewPhrase({ arabicText: "", englishTranslation: "", surahAyah: "", lifeApplication: "", category: "short", difficulty: 1, symbolicMeaning: "", isPracticalDailyUse: 0, usageDomain: "", register: "conversational" }); toast({ title: "تمت الإضافة" }); },
  });
  const updatePhraseMutation = useMutation({
    mutationFn: async (p: PhraseItem) => apiRequest("PUT", `/api/admin/phrases/${p.id}`, p),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/phrases"] }); setEditingPhrase(null); toast({ title: "تم التحديث" }); },
  });
  const deletePhraseMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/phrases/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/phrases"] }); toast({ title: "تم الحذف" }); },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={dir}>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>غير مصرح</CardTitle>
            <CardDescription>يرجى تسجيل الدخول أولاً</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signin"><Button className="w-full">تسجيل الدخول</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={dir}>
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">غير مصرح</CardTitle>
            <CardDescription>هذه الصفحة مخصصة للمشرفين فقط</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard"><Button className="w-full">العودة للوحة التحكم</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={dir}>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">لوحة تحكم المشرف</h1>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            {user.email}
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto mb-8">
            <TabsTrigger value="overview" className="gap-1 text-xs sm:text-sm"><BarChart3 className="h-4 w-4" />نظرة عامة</TabsTrigger>
            <TabsTrigger value="users" className="gap-1 text-xs sm:text-sm"><Users className="h-4 w-4" />المستخدمون</TabsTrigger>
            <TabsTrigger value="prompts" className="gap-1 text-xs sm:text-sm"><MessageSquare className="h-4 w-4" />أسئلة المحادثة</TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-1 text-xs sm:text-sm"><Drama className="h-4 w-4" />سيناريوهات</TabsTrigger>
            <TabsTrigger value="phrases" className="gap-1 text-xs sm:text-sm"><BookText className="h-4 w-4" />العبارات القرآنية</TabsTrigger>
            <TabsTrigger value="questions" className="gap-1 text-xs sm:text-sm"><BookOpen className="h-4 w-4" />بنك الأسئلة</TabsTrigger>
            <TabsTrigger value="situations" className="gap-1 text-xs sm:text-sm"><BookOpen className="h-4 w-4" />المواقف</TabsTrigger>
            <TabsTrigger value="legacy" className="gap-1 text-xs sm:text-sm"><Shield className="h-4 w-4" />الوصول المجاني القديم</TabsTrigger>
            <TabsTrigger value="pricing" className="gap-1 text-xs sm:text-sm"><Tag className="h-4 w-4" />الأسعار</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 text-xs sm:text-sm"><Settings className="h-4 w-4" />الإعدادات</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">المستخدمون</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.totalUsers || users?.length || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">أسئلة المحادثة</CardTitle><MessageSquare className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{prompts?.length || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">سيناريوهات</CardTitle><Drama className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{scenarios?.length || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">العبارات القرآنية</CardTitle><BookText className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{phrasesList?.length || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">التمارين المكتملة</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.totalExercises || 0}</div></CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>روابط سريعة</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/analytics"><Button variant="outline" className="w-full justify-start gap-2"><BarChart3 className="h-4 w-4" />التحليلات المتقدمة</Button></Link>
                  <Link href="/translation-manager"><Button variant="outline" className="w-full justify-start gap-2"><Settings className="h-4 w-4" />إدارة الترجمات</Button></Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle>إدارة المستخدمين</CardTitle><CardDescription>عرض وإدارة جميع المستخدمين في النظام</CardDescription></CardHeader>
              <CardContent>
                {usersLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الصلاحية</TableHead>
                        <TableHead>تاريخ التسجيل</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.firstName} {u.lastName}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell><Badge variant={u.isAdmin ? "default" : "secondary"}>{u.isAdmin ? "مشرف" : "مستخدم"}</Badge></TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => toggleAdminMutation.mutate({ userId: u.id, isAdmin: !u.isAdmin })} disabled={u.id === user.id}>
                              {u.isAdmin ? "إزالة الصلاحية" : "منح صلاحية المشرف"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={u.id === user.id}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>حذف المستخدم؟</AlertDialogTitle><AlertDialogDescription>هل أنت متأكد من حذف {u.firstName} {u.lastName}؟</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deleteUserMutation.mutate(u.id)}>حذف</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation Prompts */}
          <TabsContent value="prompts">
            <Card className="mb-6">
              <CardHeader><CardTitle>إضافة سؤال محادثة جديد</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>السؤال بالعربية *</Label><Textarea value={newPrompt.question} onChange={(e) => setNewPrompt({ ...newPrompt, question: e.target.value })} placeholder="ماذا تقول عندما تشعر بالضيق..." dir="rtl" /></div>
                  <div><Label>السؤال بالإنجليزية</Label><Textarea value={newPrompt.questionEn} onChange={(e) => setNewPrompt({ ...newPrompt, questionEn: e.target.value })} placeholder="What do you say when..." /></div>
                  <div><Label>الآية/العبارة المقترحة *</Label><Input value={newPrompt.suggestedVerse} onChange={(e) => setNewPrompt({ ...newPrompt, suggestedVerse: e.target.value })} placeholder="فَصَبْرٌ جَمِيلٌ" dir="rtl" /></div>
                  <div><Label>التصنيف</Label><Input value={newPrompt.category} onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })} placeholder="patience, greeting, request..." /></div>
                  <div><Label>الادعاء/المعنى المطلوب إثباته</Label><Input value={newPrompt.claim} onChange={(e) => setNewPrompt({ ...newPrompt, claim: e.target.value })} dir="rtl" /></div>
                  <div><Label>العبارة القرآنية كدليل</Label><Input value={newPrompt.evidencePhrase} onChange={(e) => setNewPrompt({ ...newPrompt, evidencePhrase: e.target.value })} dir="rtl" /></div>
                  <div><Label>نص الآية كاملة</Label><Input value={newPrompt.ayahText} onChange={(e) => setNewPrompt({ ...newPrompt, ayahText: e.target.value })} dir="rtl" /></div>
                  <div><Label>مرجع السورة:الآية</Label><Input value={newPrompt.sourceRef} onChange={(e) => setNewPrompt({ ...newPrompt, sourceRef: e.target.value })} placeholder="يوسف:18" /></div>
                  <div><Label>تلميح</Label><Input value={newPrompt.hint} onChange={(e) => setNewPrompt({ ...newPrompt, hint: e.target.value })} dir="rtl" /></div>
                  <div><Label>المعنى الرمزي</Label><Input value={newPrompt.symbolicMeaning} onChange={(e) => setNewPrompt({ ...newPrompt, symbolicMeaning: e.target.value })} dir="rtl" /></div>
                </div>
                <Button className="mt-4" onClick={() => addPromptMutation.mutate(newPrompt)} disabled={!newPrompt.question || !newPrompt.suggestedVerse || addPromptMutation.isPending}>
                  <Plus className="h-4 w-4 ml-2" />إضافة سؤال المحادثة
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>أسئلة المحادثة ({prompts?.length || 0})</CardTitle></CardHeader>
              <CardContent>
                {promptsLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>السؤال</TableHead>
                          <TableHead>الآية المقترحة</TableHead>
                          <TableHead>التصنيف</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prompts?.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="max-w-xs truncate" dir="rtl">{p.question}</TableCell>
                            <TableCell className="max-w-xs truncate" dir="rtl">{p.suggestedVerse}</TableCell>
                            <TableCell>{p.category && <Badge variant="outline">{p.category}</Badge>}</TableCell>
                            <TableCell className="space-x-2">
                              <Dialog>
                                <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingPrompt(p)}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader><DialogTitle>تعديل سؤال المحادثة</DialogTitle></DialogHeader>
                                  {editingPrompt && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div><Label>السؤال بالعربية</Label><Textarea value={editingPrompt.question} onChange={(e) => setEditingPrompt({ ...editingPrompt, question: e.target.value })} dir="rtl" /></div>
                                      <div><Label>السؤال بالإنجليزية</Label><Textarea value={editingPrompt.questionEn || ""} onChange={(e) => setEditingPrompt({ ...editingPrompt, questionEn: e.target.value })} /></div>
                                      <div><Label>الآية المقترحة</Label><Input value={editingPrompt.suggestedVerse} onChange={(e) => setEditingPrompt({ ...editingPrompt, suggestedVerse: e.target.value })} dir="rtl" /></div>
                                      <div><Label>التصنيف</Label><Input value={editingPrompt.category || ""} onChange={(e) => setEditingPrompt({ ...editingPrompt, category: e.target.value })} /></div>
                                      <div><Label>تلميح</Label><Input value={editingPrompt.hint || ""} onChange={(e) => setEditingPrompt({ ...editingPrompt, hint: e.target.value })} dir="rtl" /></div>
                                      <div><Label>مرجع السورة</Label><Input value={editingPrompt.sourceRef || ""} onChange={(e) => setEditingPrompt({ ...editingPrompt, sourceRef: e.target.value })} /></div>
                                    </div>
                                  )}
                                  <DialogFooter><Button onClick={() => editingPrompt && updatePromptMutation.mutate(editingPrompt)}>حفظ التغييرات</Button></DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>حذف السؤال؟</AlertDialogTitle><AlertDialogDescription>هل أنت متأكد من حذف هذا السؤال؟</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deletePromptMutation.mutate(p.id)}>حذف</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roleplay Scenarios */}
          <TabsContent value="scenarios">
            <Card className="mb-6">
              <CardHeader><CardTitle>إضافة سيناريو جديد</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>السيناريو بالعربية *</Label><Textarea value={newScenario.scenario} onChange={(e) => setNewScenario({ ...newScenario, scenario: e.target.value })} placeholder="شخص يشعر بالقلق..." dir="rtl" /></div>
                  <div><Label>السيناريو بالإنجليزية</Label><Textarea value={newScenario.scenarioEn} onChange={(e) => setNewScenario({ ...newScenario, scenarioEn: e.target.value })} placeholder="A person feeling anxious..." /></div>
                  <div><Label>الموضوع *</Label><Input value={newScenario.theme} onChange={(e) => setNewScenario({ ...newScenario, theme: e.target.value })} placeholder="anxiety, hope, patience..." /></div>
                  <div><Label>الحالة الشعورية</Label><Input value={newScenario.emotionalState} onChange={(e) => setNewScenario({ ...newScenario, emotionalState: e.target.value })} placeholder="consolation, hope, patience..." /></div>
                  <div><Label>الآية المقترحة</Label><Input value={newScenario.suggestedVerse} onChange={(e) => setNewScenario({ ...newScenario, suggestedVerse: e.target.value })} dir="rtl" /></div>
                  <div><Label>مصدر الآية</Label><Input value={newScenario.verseSource} onChange={(e) => setNewScenario({ ...newScenario, verseSource: e.target.value })} placeholder="لسان النبي يوسف" dir="rtl" /></div>
                  <div><Label>شرح الآية بالعربية</Label><Textarea value={newScenario.verseExplanation} onChange={(e) => setNewScenario({ ...newScenario, verseExplanation: e.target.value })} dir="rtl" /></div>
                  <div><Label>شرح الآية بالإنجليزية</Label><Textarea value={newScenario.verseExplanationEn} onChange={(e) => setNewScenario({ ...newScenario, verseExplanationEn: e.target.value })} /></div>
                  <div><Label>مستوى الصعوبة (1-5)</Label><Input type="number" min={1} max={5} value={newScenario.difficulty} onChange={(e) => setNewScenario({ ...newScenario, difficulty: parseInt(e.target.value) || 1 })} /></div>
                  <div><Label>العمق النفسي</Label><Textarea value={newScenario.psychologicalDepth} onChange={(e) => setNewScenario({ ...newScenario, psychologicalDepth: e.target.value })} dir="rtl" /></div>
                </div>
                <Button className="mt-4" onClick={() => addScenarioMutation.mutate(newScenario)} disabled={!newScenario.scenario || !newScenario.theme || addScenarioMutation.isPending}>
                  <Plus className="h-4 w-4 ml-2" />إضافة السيناريو
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>سيناريوهات تمثيل الأدوار ({scenarios?.length || 0})</CardTitle></CardHeader>
              <CardContent>
                {scenariosLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>السيناريو</TableHead>
                          <TableHead>الموضوع</TableHead>
                          <TableHead>الآية</TableHead>
                          <TableHead>الصعوبة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scenarios?.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="max-w-xs truncate" dir="rtl">{s.scenario}</TableCell>
                            <TableCell><Badge variant="outline">{s.theme}</Badge></TableCell>
                            <TableCell className="max-w-[150px] truncate" dir="rtl">{s.suggestedVerse}</TableCell>
                            <TableCell><Badge variant={s.difficulty <= 2 ? "secondary" : "default"}>{s.difficulty}</Badge></TableCell>
                            <TableCell className="space-x-2">
                              <Dialog>
                                <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingScenario(s)}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader><DialogTitle>تعديل السيناريو</DialogTitle></DialogHeader>
                                  {editingScenario && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div><Label>السيناريو بالعربية</Label><Textarea value={editingScenario.scenario} onChange={(e) => setEditingScenario({ ...editingScenario, scenario: e.target.value })} dir="rtl" /></div>
                                      <div><Label>السيناريو بالإنجليزية</Label><Textarea value={editingScenario.scenarioEn || ""} onChange={(e) => setEditingScenario({ ...editingScenario, scenarioEn: e.target.value })} /></div>
                                      <div><Label>الموضوع</Label><Input value={editingScenario.theme} onChange={(e) => setEditingScenario({ ...editingScenario, theme: e.target.value })} /></div>
                                      <div><Label>الآية المقترحة</Label><Input value={editingScenario.suggestedVerse || ""} onChange={(e) => setEditingScenario({ ...editingScenario, suggestedVerse: e.target.value })} dir="rtl" /></div>
                                      <div><Label>الصعوبة</Label><Input type="number" min={1} max={5} value={editingScenario.difficulty} onChange={(e) => setEditingScenario({ ...editingScenario, difficulty: parseInt(e.target.value) || 1 })} /></div>
                                      <div><Label>الحالة الشعورية</Label><Input value={editingScenario.emotionalState || ""} onChange={(e) => setEditingScenario({ ...editingScenario, emotionalState: e.target.value })} /></div>
                                    </div>
                                  )}
                                  <DialogFooter><Button onClick={() => editingScenario && updateScenarioMutation.mutate(editingScenario)}>حفظ التغييرات</Button></DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>حذف السيناريو؟</AlertDialogTitle><AlertDialogDescription>هل أنت متأكد من حذف هذا السيناريو؟</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deleteScenarioMutation.mutate(s.id)}>حذف</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quranic Phrases */}
          <TabsContent value="phrases">
            <Card className="mb-6">
              <CardHeader><CardTitle>إضافة عبارة قرآنية جديدة</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>النص العربي *</Label><Input value={newPhrase.arabicText} onChange={(e) => setNewPhrase({ ...newPhrase, arabicText: e.target.value })} placeholder="فَصَبْرٌ جَمِيلٌ" dir="rtl" /></div>
                  <div><Label>الترجمة الإنجليزية *</Label><Input value={newPhrase.englishTranslation} onChange={(e) => setNewPhrase({ ...newPhrase, englishTranslation: e.target.value })} placeholder="So patience is most fitting" /></div>
                  <div><Label>السورة:الآية *</Label><Input value={newPhrase.surahAyah} onChange={(e) => setNewPhrase({ ...newPhrase, surahAyah: e.target.value })} placeholder="يوسف:18" /></div>
                  <div><Label>التطبيق الحياتي *</Label><Textarea value={newPhrase.lifeApplication} onChange={(e) => setNewPhrase({ ...newPhrase, lifeApplication: e.target.value })} placeholder="عند مواجهة صعوبة..." dir="rtl" /></div>
                  <div><Label>التصنيف *</Label><Input value={newPhrase.category} onChange={(e) => setNewPhrase({ ...newPhrase, category: e.target.value })} placeholder="short, long, commands, proverbs" /></div>
                  <div><Label>مستوى الصعوبة (1-5)</Label><Input type="number" min={1} max={5} value={newPhrase.difficulty} onChange={(e) => setNewPhrase({ ...newPhrase, difficulty: parseInt(e.target.value) || 1 })} /></div>
                  <div><Label>المعنى الرمزي</Label><Textarea value={newPhrase.symbolicMeaning} onChange={(e) => setNewPhrase({ ...newPhrase, symbolicMeaning: e.target.value })} dir="rtl" /></div>
                  <div><Label>مجال الاستخدام</Label><Input value={newPhrase.usageDomain} onChange={(e) => setNewPhrase({ ...newPhrase, usageDomain: e.target.value })} placeholder="greeting, time, request..." /></div>
                </div>
                <Button className="mt-4" onClick={() => addPhraseMutation.mutate(newPhrase)} disabled={!newPhrase.arabicText || !newPhrase.englishTranslation || !newPhrase.surahAyah || !newPhrase.lifeApplication || !newPhrase.category || addPhraseMutation.isPending}>
                  <Plus className="h-4 w-4 ml-2" />إضافة العبارة
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>العبارات القرآنية ({phrasesList?.length || 0})</CardTitle></CardHeader>
              <CardContent>
                {phrasesLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>النص العربي</TableHead>
                          <TableHead>الترجمة</TableHead>
                          <TableHead>السورة:الآية</TableHead>
                          <TableHead>التصنيف</TableHead>
                          <TableHead>الصعوبة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {phrasesList?.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="max-w-[200px] truncate" dir="rtl">{p.arabicText}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{p.englishTranslation}</TableCell>
                            <TableCell>{p.surahAyah}</TableCell>
                            <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                            <TableCell><Badge variant={p.difficulty <= 2 ? "secondary" : "default"}>{p.difficulty}</Badge></TableCell>
                            <TableCell className="space-x-2">
                              <Dialog>
                                <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingPhrase(p)}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader><DialogTitle>تعديل العبارة القرآنية</DialogTitle></DialogHeader>
                                  {editingPhrase && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div><Label>النص العربي</Label><Input value={editingPhrase.arabicText} onChange={(e) => setEditingPhrase({ ...editingPhrase, arabicText: e.target.value })} dir="rtl" /></div>
                                      <div><Label>الترجمة</Label><Input value={editingPhrase.englishTranslation} onChange={(e) => setEditingPhrase({ ...editingPhrase, englishTranslation: e.target.value })} /></div>
                                      <div><Label>السورة:الآية</Label><Input value={editingPhrase.surahAyah} onChange={(e) => setEditingPhrase({ ...editingPhrase, surahAyah: e.target.value })} /></div>
                                      <div><Label>التطبيق الحياتي</Label><Textarea value={editingPhrase.lifeApplication} onChange={(e) => setEditingPhrase({ ...editingPhrase, lifeApplication: e.target.value })} dir="rtl" /></div>
                                      <div><Label>التصنيف</Label><Input value={editingPhrase.category} onChange={(e) => setEditingPhrase({ ...editingPhrase, category: e.target.value })} /></div>
                                      <div><Label>الصعوبة</Label><Input type="number" min={1} max={5} value={editingPhrase.difficulty} onChange={(e) => setEditingPhrase({ ...editingPhrase, difficulty: parseInt(e.target.value) || 1 })} /></div>
                                    </div>
                                  )}
                                  <DialogFooter><Button onClick={() => editingPhrase && updatePhraseMutation.mutate(editingPhrase)}>حفظ التغييرات</Button></DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>حذف العبارة؟</AlertDialogTitle><AlertDialogDescription>هل أنت متأكد من حذف هذه العبارة القرآنية؟</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deletePhraseMutation.mutate(p.id)}>حذف</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Banks */}
          <TabsContent value="questions">
            <Card className="mb-6">
              <CardHeader><CardTitle>إضافة سؤال جديد</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>الموضوع بالعربية</Label><Input value={newQuestion.theme} onChange={(e) => setNewQuestion({ ...newQuestion, theme: e.target.value })} placeholder="المعية في الشدة" dir="rtl" /></div>
                  <div><Label>الموضوع بالإنجليزية</Label><Input value={newQuestion.themeEnglish} onChange={(e) => setNewQuestion({ ...newQuestion, themeEnglish: e.target.value })} placeholder="Divine Companionship in Hardship" /></div>
                  <div><Label>الوصف</Label><Textarea value={newQuestion.description} onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })} dir="rtl" /></div>
                  <div><Label>التصنيف</Label><Input value={newQuestion.category} onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })} placeholder="thematic, grammar, vocabulary" /></div>
                  <div><Label>الوسوم (مفصولة بفاصلة)</Label><Input value={newQuestion.tags} onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })} placeholder="صبر, أمل, إيمان" dir="rtl" /></div>
                  <div><Label>مستوى الصعوبة (1-5)</Label><Input type="number" min={1} max={5} value={newQuestion.difficulty} onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: parseInt(e.target.value) || 1 })} /></div>
                </div>
                <Button className="mt-4" onClick={() => addQuestionMutation.mutate(newQuestion)} disabled={!newQuestion.theme || !newQuestion.themeEnglish || !newQuestion.category}>
                  <Plus className="h-4 w-4 ml-2" />إضافة السؤال
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>بنك الأسئلة ({questions?.length || 0})</CardTitle></CardHeader>
              <CardContent>
                {questionsLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الموضوع</TableHead>
                        <TableHead>الموضوع (إنجليزي)</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>الصعوبة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions?.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="max-w-xs truncate" dir="rtl">{question.theme}</TableCell>
                          <TableCell className="max-w-xs truncate">{question.themeEnglish}</TableCell>
                          <TableCell><Badge variant="outline">{question.category}</Badge></TableCell>
                          <TableCell><Badge variant={question.difficulty <= 2 ? "secondary" : question.difficulty <= 4 ? "default" : "destructive"}>{question.difficulty}</Badge></TableCell>
                          <TableCell className="space-x-2">
                            <Dialog>
                              <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingQuestion(question)}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader><DialogTitle>تعديل السؤال</DialogTitle></DialogHeader>
                                {editingQuestion && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><Label>الموضوع بالعربية</Label><Input value={editingQuestion.theme} onChange={(e) => setEditingQuestion({ ...editingQuestion, theme: e.target.value })} dir="rtl" /></div>
                                    <div><Label>الموضوع بالإنجليزية</Label><Input value={editingQuestion.themeEnglish} onChange={(e) => setEditingQuestion({ ...editingQuestion, themeEnglish: e.target.value })} /></div>
                                    <div><Label>الوصف</Label><Textarea value={editingQuestion.description || ""} onChange={(e) => setEditingQuestion({ ...editingQuestion, description: e.target.value })} dir="rtl" /></div>
                                    <div><Label>التصنيف</Label><Input value={editingQuestion.category} onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })} /></div>
                                    <div><Label>مستوى الصعوبة</Label><Input type="number" min={1} max={5} value={editingQuestion.difficulty} onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: parseInt(e.target.value) || 1 })} /></div>
                                  </div>
                                )}
                                <DialogFooter><Button onClick={() => editingQuestion && updateQuestionMutation.mutate(editingQuestion)}>حفظ التغييرات</Button></DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>حذف السؤال؟</AlertDialogTitle><AlertDialogDescription>هل أنت متأكد من حذف هذا السؤال؟</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deleteQuestionMutation.mutate(question.id)}>حذف</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Human Situations */}
          <TabsContent value="situations">
            <Card className="mb-6">
              <CardHeader><CardTitle>إضافة موقف جديد</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>السؤال بالعربية</Label><Textarea value={newSituation.situationAr} onChange={(e) => setNewSituation({ ...newSituation, situationAr: e.target.value })} dir="rtl" /></div>
                  <div><Label>السؤال بالإنجليزية</Label><Textarea value={newSituation.situationEn} onChange={(e) => setNewSituation({ ...newSituation, situationEn: e.target.value })} /></div>
                  <div><Label>التصنيف</Label><Input value={newSituation.category} onChange={(e) => setNewSituation({ ...newSituation, category: e.target.value })} /></div>
                  <div><Label>الآية المقترحة</Label><Input value={newSituation.suggestedVerse} onChange={(e) => setNewSituation({ ...newSituation, suggestedVerse: e.target.value })} dir="rtl" /></div>
                  <div><Label>المنطق السياقي بالعربية</Label><Textarea value={newSituation.contextualLogic} onChange={(e) => setNewSituation({ ...newSituation, contextualLogic: e.target.value })} dir="rtl" /></div>
                  <div><Label>المنطق السياقي بالإنجليزية</Label><Textarea value={newSituation.contextualLogicEn} onChange={(e) => setNewSituation({ ...newSituation, contextualLogicEn: e.target.value })} /></div>
                </div>
                <Button className="mt-4" onClick={() => addSituationMutation.mutate(newSituation)} disabled={!newSituation.situationAr || !newSituation.situationEn || !newSituation.category || !newSituation.suggestedVerse}>
                  <Plus className="h-4 w-4 ml-2" />إضافة الموقف
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>المواقف الإنسانية ({situations?.length || 0})</CardTitle></CardHeader>
              <CardContent>
                {situationsLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الموقف</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>الآية</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {situations?.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="max-w-xs truncate" dir="rtl">{s.situationAr}</TableCell>
                          <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                          <TableCell className="max-w-[150px] truncate" dir="rtl">{s.suggestedVerse}</TableCell>
                          <TableCell className="space-x-2">
                            <Dialog>
                              <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingSituation(s)}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader><DialogTitle>تعديل الموقف</DialogTitle></DialogHeader>
                                {editingSituation && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><Label>الموقف بالعربية</Label><Textarea value={editingSituation.situationAr} onChange={(e) => setEditingSituation({ ...editingSituation, situationAr: e.target.value })} dir="rtl" /></div>
                                    <div><Label>الموقف بالإنجليزية</Label><Textarea value={editingSituation.situationEn} onChange={(e) => setEditingSituation({ ...editingSituation, situationEn: e.target.value })} /></div>
                                    <div><Label>التصنيف</Label><Input value={editingSituation.category} onChange={(e) => setEditingSituation({ ...editingSituation, category: e.target.value })} /></div>
                                    <div><Label>الآية المقترحة</Label><Input value={editingSituation.suggestedVerse} onChange={(e) => setEditingSituation({ ...editingSituation, suggestedVerse: e.target.value })} dir="rtl" /></div>
                                  </div>
                                )}
                                <DialogFooter><Button onClick={() => editingSituation && updateSituationMutation.mutate(editingSituation)}>حفظ التغييرات</Button></DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>حذف الموقف؟</AlertDialogTitle><AlertDialogDescription>هل أنت متأكد من حذف هذا الموقف؟</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deleteSituationMutation.mutate(s.id)}>حذف</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legacy Free Access */}
          <TabsContent value="legacy">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-500" />
                    إحصائيات الوصول المجاني القديم
                  </CardTitle>
                  <CardDescription>
                    المستخدمون الذين سجلوا قبل تاريخ الإغلاق ويحظون بوصول مجاني مفتوح دون انتهاء
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {legacyStats ? (
                    <>
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm">
                        <span className="font-medium text-amber-800 dark:text-amber-300">تاريخ الإغلاق الثابت: </span>
                        <span className="text-amber-700 dark:text-amber-400 font-mono">{new Date(legacyStats.cutoffDate).toLocaleString("ar-SA")}</span>
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">كل المستخدمين المسجلين قبل هذا التاريخ يحصلون على وصول مجاني دائم</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card className="border-amber-200 dark:border-amber-700">
                          <CardContent className="pt-4 text-center">
                            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{legacyStats.legacyFreeCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">وصول مجاني قديم (Legacy)</p>
                          </CardContent>
                        </Card>
                        <Card className="border-green-200 dark:border-green-700">
                          <CardContent className="pt-4 text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{legacyStats.sponsoredCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">منح مدعومة (Sponsored)</p>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200 dark:border-blue-700">
                          <CardContent className="pt-4 text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{legacyStats.paidCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">اشتراكات مدفوعة (Paid)</p>
                          </CardContent>
                        </Card>
                        <Card className="border-purple-200 dark:border-purple-700">
                          <CardContent className="pt-4 text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{legacyStats.selfFundedCount ?? 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">طلاب مستقلون (Self-funded)</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4 text-center">
                            <div className="text-3xl font-bold">{legacyStats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">إجمالي المستخدمين</p>
                          </CardContent>
                        </Card>
                      </div>
                      {legacyStats.lastBackfillRun && (
                        <p className="text-xs text-muted-foreground mt-2">
                          آخر تشغيل للمنح: {new Date(legacyStats.lastBackfillRun).toLocaleString("ar-SA")}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => backfillLegacyMutation.mutate()}
                      disabled={backfillLegacyMutation.isPending}
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      {backfillLegacyMutation.isPending ? "جارٍ التطبيق..." : "إعادة تطبيق المنح القديمة (Idempotent)"}
                    </Button>
                    <p className="text-xs text-muted-foreground">آمن للتشغيل أكثر من مرة — لن يُكرر المنح الموجودة</p>
                  </div>
                </CardContent>
              </Card>

              {/* Filter users by type */}
              <Card>
                <CardHeader>
                  <CardTitle>تصفية المستخدمين حسب نوع الوصول</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? <div className="text-center py-8">جاري التحميل...</div> : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>البريد الإلكتروني</TableHead>
                          <TableHead>نوع الوصول</TableHead>
                          <TableHead>تاريخ التسجيل</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.map((u) => {
                          const cutoff = new Date("2026-03-08T00:00:00.000Z");
                          const isLegacy = new Date(u.createdAt) < cutoff;
                          return (
                            <TableRow key={u.id}>
                              <TableCell>{u.firstName} {u.lastName}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                              <TableCell>
                                {u.isAdmin ? (
                                  <Badge variant="destructive">مشرف</Badge>
                                ) : isLegacy ? (
                                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 hover:bg-amber-100">Legacy Free</Badge>
                                ) : (
                                  <Badge variant="outline">جديد</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing">
            <PricingTab />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader><CardTitle>الإعدادات</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">إعدادات النظام قيد التطوير</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
