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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { Users, BookOpen, Settings, Shield, Plus, Trash2, Edit, ArrowLeft, BarChart3 } from "lucide-react";
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

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [newSituation, setNewSituation] = useState({
    situationAr: "",
    situationEn: "",
    category: "",
    suggestedVerse: "",
    contextualLogic: "",
    contextualLogicEn: "",
  });
  const [editingSituation, setEditingSituation] = useState<HumanSituation | null>(null);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const { data: situations, isLoading: situationsLoading } = useQuery<HumanSituation[]>({
    queryKey: ["/api/admin/human-situations"],
    enabled: !!user?.isAdmin,
  });

  const { data: stats } = useQuery<{ totalUsers: number; totalSituations: number; totalExercises: number }>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      return apiRequest("POST", `/api/admin/users/${userId}/toggle-admin`, { isAdmin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "تم التحديث", description: "تم تحديث صلاحيات المستخدم بنجاح" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "تم الحذف", description: "تم حذف المستخدم بنجاح" });
    },
  });

  const addSituationMutation = useMutation({
    mutationFn: async (situation: typeof newSituation) => {
      return apiRequest("POST", "/api/admin/human-situations", situation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/human-situations"] });
      setNewSituation({ situationAr: "", situationEn: "", category: "", suggestedVerse: "", contextualLogic: "", contextualLogicEn: "" });
      toast({ title: "تمت الإضافة", description: "تم إضافة الموقف بنجاح" });
    },
  });

  const updateSituationMutation = useMutation({
    mutationFn: async (situation: HumanSituation) => {
      return apiRequest("PUT", `/api/admin/human-situations/${situation.id}`, situation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/human-situations"] });
      setEditingSituation(null);
      toast({ title: "تم التحديث", description: "تم تحديث الموقف بنجاح" });
    },
  });

  const deleteSituationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/human-situations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/human-situations"] });
      toast({ title: "تم الحذف", description: "تم حذف الموقف بنجاح" });
    },
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
            <Link href="/signin">
              <Button className="w-full">تسجيل الدخول</Button>
            </Link>
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
            <CardTitle className="text-red-600">🚫 غير مصرح</CardTitle>
            <CardDescription>هذه الصفحة مخصصة للمشرفين فقط</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">العودة للوحة التحكم</Button>
            </Link>
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
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="situations" className="gap-2">
              <BookOpen className="h-4 w-4" />
              المواقف الإنسانية
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">المستخدمون</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || users?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">المواقف الإنسانية</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSituations || situations?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">التمارين المكتملة</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalExercises || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>روابط سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/analytics">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <BarChart3 className="h-4 w-4" />
                      التحليلات المتقدمة
                    </Button>
                  </Link>
                  <Link href="/translation-manager">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      إدارة الترجمات
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
                <CardDescription>عرض وإدارة جميع المستخدمين في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
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
                          <TableCell>
                            <Badge variant={u.isAdmin ? "default" : "secondary"}>
                              {u.isAdmin ? "مشرف" : "مستخدم"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAdminMutation.mutate({ userId: u.id, isAdmin: !u.isAdmin })}
                              disabled={u.id === user.id}
                            >
                              {u.isAdmin ? "إزالة الصلاحية" : "منح صلاحية المشرف"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={u.id === user.id}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف المستخدم؟</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف {u.firstName} {u.lastName}؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteUserMutation.mutate(u.id)}>
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
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

          <TabsContent value="situations">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>إضافة موقف جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>السؤال بالعربية</Label>
                    <Textarea
                      value={newSituation.situationAr}
                      onChange={(e) => setNewSituation({ ...newSituation, situationAr: e.target.value })}
                      placeholder="أشعر أني بلا فائدة..."
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>السؤال بالإنجليزية</Label>
                    <Textarea
                      value={newSituation.situationEn}
                      onChange={(e) => setNewSituation({ ...newSituation, situationEn: e.target.value })}
                      placeholder="I feel useless..."
                    />
                  </div>
                  <div>
                    <Label>الآية المقترحة</Label>
                    <Textarea
                      value={newSituation.suggestedVerse}
                      onChange={(e) => setNewSituation({ ...newSituation, suggestedVerse: e.target.value })}
                      placeholder="وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>التصنيف</Label>
                    <Input
                      value={newSituation.category}
                      onChange={(e) => setNewSituation({ ...newSituation, category: e.target.value })}
                      placeholder="self-worth, meaning, purpose..."
                    />
                  </div>
                  <div>
                    <Label>الدلالة بالعربية</Label>
                    <Input
                      value={newSituation.contextualLogic}
                      onChange={(e) => setNewSituation({ ...newSituation, contextualLogic: e.target.value })}
                      placeholder="القيمة في الإحسان"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>الدلالة بالإنجليزية</Label>
                    <Input
                      value={newSituation.contextualLogicEn}
                      onChange={(e) => setNewSituation({ ...newSituation, contextualLogicEn: e.target.value })}
                      placeholder="Value lies in doing good"
                    />
                  </div>
                </div>
                <Button
                  className="mt-4"
                  onClick={() => addSituationMutation.mutate(newSituation)}
                  disabled={!newSituation.situationAr || !newSituation.suggestedVerse}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة الموقف
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المواقف الإنسانية ({situations?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {situationsLoading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>السؤال</TableHead>
                        <TableHead>الآية</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>الدلالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {situations?.map((situation) => (
                        <TableRow key={situation.id}>
                          <TableCell className="max-w-xs truncate" dir="rtl">{situation.situationAr}</TableCell>
                          <TableCell className="max-w-xs truncate arabic-text" dir="rtl">{situation.suggestedVerse}</TableCell>
                          <TableCell><Badge variant="outline">{situation.category}</Badge></TableCell>
                          <TableCell className="max-w-xs truncate" dir="rtl">{situation.contextualLogic}</TableCell>
                          <TableCell className="space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingSituation(situation)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>تعديل الموقف</DialogTitle>
                                </DialogHeader>
                                {editingSituation && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>السؤال بالعربية</Label>
                                      <Textarea
                                        value={editingSituation.situationAr}
                                        onChange={(e) => setEditingSituation({ ...editingSituation, situationAr: e.target.value })}
                                        dir="rtl"
                                      />
                                    </div>
                                    <div>
                                      <Label>السؤال بالإنجليزية</Label>
                                      <Textarea
                                        value={editingSituation.situationEn}
                                        onChange={(e) => setEditingSituation({ ...editingSituation, situationEn: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label>الآية المقترحة</Label>
                                      <Textarea
                                        value={editingSituation.suggestedVerse}
                                        onChange={(e) => setEditingSituation({ ...editingSituation, suggestedVerse: e.target.value })}
                                        dir="rtl"
                                      />
                                    </div>
                                    <div>
                                      <Label>التصنيف</Label>
                                      <Input
                                        value={editingSituation.category}
                                        onChange={(e) => setEditingSituation({ ...editingSituation, category: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label>الدلالة بالعربية</Label>
                                      <Input
                                        value={editingSituation.contextualLogic || ""}
                                        onChange={(e) => setEditingSituation({ ...editingSituation, contextualLogic: e.target.value })}
                                        dir="rtl"
                                      />
                                    </div>
                                    <div>
                                      <Label>الدلالة بالإنجليزية</Label>
                                      <Input
                                        value={editingSituation.contextualLogicEn || ""}
                                        onChange={(e) => setEditingSituation({ ...editingSituation, contextualLogicEn: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button onClick={() => editingSituation && updateSituationMutation.mutate(editingSituation)}>
                                    حفظ التغييرات
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف الموقف؟</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا الموقف؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSituationMutation.mutate(situation.id)}>
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
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

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
                <CardDescription>إعدادات النظام والتكوين</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">قريبًا - إعدادات إضافية للنظام</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
