import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";


interface OverviewStats {
  totalUsers: number;
  totalActiveUsers: number;
  engagementRate: number;
  totalExercises: number;
  totalPhrases: number;
  todayExercises: number;
}

interface ExerciseEngagement {
  exerciseType: string;
  totalSessions: number;
  uniqueUsers: number;
  correctSessions: number;
  accuracy: number;
  participationRate: number;
}

interface SessionDuration {
  exerciseType: string;
  avgDuration: number;
  totalSessions: number;
}

export default function Analytics() {
  const { dir, language } = useLanguage();
  const isArabic = language === 'ar';

  const { data: overview } = useQuery<OverviewStats>({
    queryKey: ["/api/analytics/overview"],
  });

  const { data: exerciseEngagement } = useQuery<ExerciseEngagement[]>({
    queryKey: ["/api/analytics/exercise-engagement"],
  });

  const { data: sessionDuration } = useQuery<SessionDuration[]>({
    queryKey: ["/api/analytics/session-duration"],
  });

  const getExerciseTypeLabel = (type: string) => {
    const exerciseTranslations: Record<string, Record<string, string>> = {
      conversation: {
        ar: "تمارين المحادثة",
        en: "Conversation Practice",
        id: "Latihan Percakapan",
        tr: "Konuşma Pratiği",
        zh: "对话练习",
        sw: "Mazoezi ya Mazungumzo",
        so: "Tababarka Wadahadalka",
        bs: "Vježbe konverzacije",
        sq: "Praktikë bisede",
        ru: "Практика разговора",
      },
      transformation: {
        ar: "المطابقة القرآنية",
        en: "Quranic Match",
        id: "Pencocokan Qurani",
        tr: "Kuran Eşleştirme",
        zh: "古兰经匹配",
        sw: "Uoanishaji wa Qurani",
        so: "Isku xidhka Quraanka",
        bs: "Kur'ansko povezivanje",
        sq: "Përputhja Kuranore",
        ru: "Кораническое соответствие",
      },
      roleplay: {
        ar: "سيناريوهات تمثيل الأدوار",
        en: "Role-play Scenarios",
        id: "Skenario Bermain Peran",
        tr: "Rol Yapma Senaryoları",
        zh: "角色扮演情景",
        sw: "Hali za Kucheza Majukumu",
        so: "Xaaladaha Jilayaasha Doorka",
        bs: "Scenariji uloga",
        sq: "Skenarë loje rolit",
        ru: "Ролевые сценарии",
      },
      dailyContextual: {
        ar: "مطابقة التعبيرات اليومية",
        en: "Daily Expression Match",
        id: "Kecocokan Ekspresi Harian",
        tr: "Günlük İfade Eşleştirme",
        zh: "日常表达匹配",
        sw: "Kufananisha Maneno ya Kila Siku",
        so: "Is-waafajinta Odhaahda Maalinlaha",
        bs: "Dnevno podudaranje izraza",
        sq: "Përputhje shprehjesh ditore",
        ru: "Сопоставление ежедневных выражений",
      },
      phonetic_practice: {
        ar: "تمارين النطق",
        en: "Phonetic Practice",
        id: "Latihan Fonetik",
        tr: "Fonetik Pratik",
        zh: "语音练习",
        sw: "Mazoezi ya Sauti",
        so: "Tababarka Dhawaaqa",
        bs: "Fonetska vježba",
        sq: "Praktikë fonetike",
        ru: "Фонетическая практика",
      },
      completion: {
        ar: "إكمال الجملة",
        en: "Sentence Completion",
        id: "Penyelesaian Kalimat",
        tr: "Cümle Tamamlama",
        zh: "完成句子",
        sw: "Kukamilisha Sentensi",
        so: "Dhamaystirka Weedhaha",
        bs: "Dovršavanje rečenice",
        sq: "Plotësim fjalie",
        ru: "Завершение предложения",
      },
      substitution: {
        ar: "الاستبدال",
        en: "Substitution",
        id: "Substitusi",
        tr: "Değiştirme",
        zh: "替换",
        sw: "Kubadilisha",
        so: "Beddelka",
        bs: "Zamjena",
        sq: "Zëvendësim",
        ru: "Замена",
      },
      thematic: {
        ar: "الموضوعات",
        en: "Thematic",
        id: "Tematik",
        tr: "Tematik",
        zh: "主题",
        sw: "Mada",
        so: "Mawduuc",
        bs: "Tematski",
        sq: "Tematik",
        ru: "Тематический",
      },
      comparison: {
        ar: "المقارنة",
        en: "Comparison",
        id: "Perbandingan",
        tr: "Karşılaştırma",
        zh: "比较",
        sw: "Ulinganisho",
        so: "Isbarbardhig",
        bs: "Poređenje",
        sq: "Krahasim",
        ru: "Сравнение",
      },
      daily_contextual: {
        ar: "السياق اليومي",
        en: "Daily Contextual",
        id: "Kontekstual Harian",
        tr: "Günlük Bağlamsal",
        zh: "日常语境",
        sw: "Muktadha wa Kila Siku",
        so: "Macnaha Maalinlaha",
        bs: "Dnevni kontekstualni",
        sq: "Kontekstual ditor",
        ru: "Ежедневный контекстуальный",
      },
    };

    return exerciseTranslations[type]?.[language] || type;
  };

  const formatDuration = (seconds: number) => {
    const timeFormats: Record<string, { s: string; m: string }> = {
      ar: { s: 'ث', m: 'د' },
      en: { s: 's', m: 'm' },
      id: { s: 'd', m: 'm' },
      tr: { s: 's', m: 'd' },
      zh: { s: '秒', m: '分' },
      sw: { s: 's', m: 'd' },
      so: { s: 'i', m: 'd' },
      bs: { s: 's', m: 'm' },
      sq: { s: 's', m: 'm' },
      ru: { s: 'с', m: 'м' },
    };
    
    const format = timeFormats[language] || timeFormats['en'];
    if (seconds < 60) return `${seconds}${format.s}`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}${format.m} ${remainingSeconds}${format.s}`;
  };

  const translations: Record<string, Record<string, string>> = {
    title: {
      ar: 'لوحة الإحصائيات',
      en: 'Analytics Dashboard',
      id: 'Dasbor Analitik',
      tr: 'Analitik Panosu',
      zh: '分析仪表板',
      sw: 'Dashibodi ya Takwimu',
      so: 'Sahnada Faahfaahinta',
      bs: 'Analitička kontrolna tabla',
      sq: 'Paneli i analizave',
      ru: 'Панель аналитики',
    },
    subtitle: {
      ar: 'إحصائيات المنصة',
      en: 'Platform Statistics',
      id: 'Statistik Platform',
      tr: 'Platform İstatistikleri',
      zh: '平台统计',
      sw: 'Takwimu za Jukwaa',
      so: 'Tirakoobka Barxadda',
      bs: 'Statistika platforme',
      sq: 'Statistikat e platformës',
      ru: 'Статистика платформы',
    },
    overview: {
      ar: 'نظرة عامة',
      en: 'Overview',
      id: 'Ringkasan',
      tr: 'Genel Bakış',
      zh: '概述',
      sw: 'Muhtasari',
      so: 'Dulmar',
      bs: 'Pregled',
      sq: 'Përmbledhje',
      ru: 'Обзор',
    },
    totalUsers: {
      ar: 'إجمالي المستخدمين:',
      en: 'Total Users:',
      id: 'Total Pengguna:',
      tr: 'Toplam Kullanıcı:',
      zh: '总用户数：',
      sw: 'Jumla ya Watumiaji:',
      so: 'Wadarta Isticmaalayaasha:',
      bs: 'Ukupno korisnika:',
      sq: 'Përdorues totale:',
      ru: 'Всего пользователей:',
    },
    activeUsers: {
      ar: 'المستخدمون النشطون:',
      en: 'Active Users:',
      id: 'Pengguna Aktif:',
      tr: 'Aktif Kullanıcı:',
      zh: '活跃用户：',
      sw: 'Watumiaji Hai:',
      so: 'Isticmaalayaasha Firfircoon:',
      bs: 'Aktivni korisnici:',
      sq: 'Përdorues aktivë:',
      ru: 'Активных пользователей:',
    },
    engagementRate: {
      ar: 'معدل المشاركة:',
      en: 'Engagement Rate:',
      id: 'Tingkat Keterlibatan:',
      tr: 'Katılım Oranı:',
      zh: '参与率：',
      sw: 'Kiwango cha Kushiriki:',
      so: 'Heerka Ka-qaybgalka:',
      bs: 'Stopa angažmana:',
      sq: 'Shkalla e angazhimit:',
      ru: 'Показатель вовлеченности:',
    },
    totalExercises: {
      ar: 'إجمالي التمارين المكتملة:',
      en: 'Total Exercises Completed:',
      id: 'Total Latihan Selesai:',
      tr: 'Tamamlanan Toplam Alıştırma:',
      zh: '已完成练习总数：',
      sw: 'Jumla ya Mazoezi Yaliyokamilika:',
      so: 'Wadarta Dhammaystirada Tababbaro:',
      bs: 'Ukupno završenih vježbi:',
      sq: 'Ushtrime totale të përfunduara:',
      ru: 'Всего завершено упражнений:',
    },
    exercisesToday: {
      ar: 'التمارين اليوم:',
      en: 'Exercises Today:',
      id: 'Latihan Hari Ini:',
      tr: 'Bugünkü Alıştırmalar:',
      zh: '今日练习：',
      sw: 'Mazoezi Leo:',
      so: 'Tababbaro Maanta:',
      bs: 'Današnje vježbe:',
      sq: 'Ushtrime sot:',
      ru: 'Упражнений сегодня:',
    },
    exerciseEngagement: {
      ar: 'مشاركة أنواع التمارين',
      en: 'Exercise Type Engagement',
      id: 'Keterlibatan Jenis Latihan',
      tr: 'Alıştırma Türü Katılımı',
      zh: '练习类型参与度',
      sw: 'Ushiriki wa Aina za Mazoezi',
      so: 'Ka-qaybgalka Nooca Tababbarka',
      bs: 'Angažman po vrstama vježbi',
      sq: 'Angazhimi sipas llojit të ushtrimit',
      ru: 'Вовлеченность по типам упражнений',
    },
    exerciseType: {
      ar: 'نوع التمرين',
      en: 'Exercise Type',
      id: 'Jenis Latihan',
      tr: 'Alıştırma Türü',
      zh: '练习类型',
      sw: 'Aina ya Zoezi',
      so: 'Nooca Tababbarka',
      bs: 'Vrsta vježbe',
      sq: 'Lloji i ushtrimit',
      ru: 'Тип упражнения',
    },
    sessions: {
      ar: 'الجلسات',
      en: 'Sessions',
      id: 'Sesi',
      tr: 'Oturumlar',
      zh: '会话',
      sw: 'Vipindi',
      so: 'Fadhiyada',
      bs: 'Sesije',
      sq: 'Sesione',
      ru: 'Сессии',
    },
    users: {
      ar: 'المستخدمون',
      en: 'Users',
      id: 'Pengguna',
      tr: 'Kullanıcılar',
      zh: '用户',
      sw: 'Watumiaji',
      so: 'Isticmaalayaasha',
      bs: 'Korisnici',
      sq: 'Përdoruesit',
      ru: 'Пользователи',
    },
    correct: {
      ar: 'صحيح',
      en: 'Correct',
      id: 'Benar',
      tr: 'Doğru',
      zh: '正确',
      sw: 'Sahihi',
      so: 'Sax',
      bs: 'Tačno',
      sq: 'Saktë',
      ru: 'Правильно',
    },
    accuracy: {
      ar: 'الدقة',
      en: 'Accuracy',
      id: 'Akurasi',
      tr: 'Doğruluk',
      zh: '准确性',
      sw: 'Usahihi',
      so: 'Saxnimada',
      bs: 'Tačnost',
      sq: 'Saktësi',
      ru: 'Точность',
    },
    participation: {
      ar: 'المشاركة',
      en: 'Participation',
      id: 'Partisipasi',
      tr: 'Katılım',
      zh: '参与',
      sw: 'Ushiriki',
      so: 'Ka-qaybgalka',
      bs: 'Učešće',
      sq: 'Pjesëmarrje',
      ru: 'Участие',
    },
    avgDuration: {
      ar: 'متوسط مدة الجلسة',
      en: 'Average Session Duration',
      id: 'Durasi Sesi Rata-rata',
      tr: 'Ortalama Oturum Süresi',
      zh: '平均会话时长',
      sw: 'Wastani wa Muda wa Kipindi',
      so: 'Celceliska Muddada Fadhiga',
      bs: 'Prosječno trajanje sesije',
      sq: 'Kohëzgjatja mesatare e seancës',
      ru: 'Средняя продолжительность сессии',
    },
    totalSessions: {
      ar: 'إجمالي الجلسات',
      en: 'Total Sessions',
      id: 'Total Sesi',
      tr: 'Toplam Oturum',
      zh: '总会话数',
      sw: 'Jumla ya Vipindi',
      so: 'Wadarta Fadhiyada',
      bs: 'Ukupno sesija',
      sq: 'Sesione totale',
      ru: 'Всего сессий',
    },
    avgDurationLabel: {
      ar: 'متوسط المدة',
      en: 'Average Duration',
      id: 'Durasi Rata-rata',
      tr: 'Ortalama Süre',
      zh: '平均时长',
      sw: 'Wastani wa Muda',
      so: 'Celceliska Muddada',
      bs: 'Prosječno trajanje',
      sq: 'Kohëzgjatja mesatare',
      ru: 'Средняя продолжительность',
    },
  };

  const t = Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [key, value[language] || value['en']])
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" dir={dir}>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.overview}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.totalUsers}</span>
                <span className="font-bold">{overview?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.activeUsers}</span>
                <span className="font-bold">{overview?.totalActiveUsers || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.engagementRate}</span>
                <span className="font-bold">{overview?.engagementRate || 0}%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t.totalExercises}</span>
                <span className="font-bold">{overview?.totalExercises || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">{t.exercisesToday}</span>
                <span className="font-bold">{overview?.todayExercises || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Engagement Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.exerciseEngagement}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className={`${isArabic ? 'text-right' : 'text-left'} py-3 font-medium`}>{t.exerciseType}</th>
                    <th className="text-right py-3 font-medium">{t.sessions}</th>
                    <th className="text-right py-3 font-medium">{t.users}</th>
                    <th className="text-right py-3 font-medium">{t.correct}</th>
                    <th className="text-right py-3 font-medium">{t.accuracy}</th>
                    <th className="text-right py-3 font-medium">{t.participation}</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseEngagement?.map((exercise) => (
                    <tr key={exercise.exerciseType} className="border-b">
                      <td className={`py-3 ${isArabic ? 'text-right' : ''}`}>{getExerciseTypeLabel(exercise.exerciseType)}</td>
                      <td className="text-right py-3 font-semibold">{exercise.totalSessions}</td>
                      <td className="text-right py-3">{exercise.uniqueUsers}</td>
                      <td className="text-right py-3">{exercise.correctSessions}</td>
                      <td className="text-right py-3 font-semibold">{exercise.accuracy}%</td>
                      <td className="text-right py-3 font-semibold">{exercise.participationRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Session Duration Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.avgDuration}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className={`${isArabic ? 'text-right' : 'text-left'} py-3 font-medium`}>{t.exerciseType}</th>
                    <th className="text-right py-3 font-medium">{t.totalSessions}</th>
                    <th className="text-right py-3 font-medium">{t.avgDurationLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionDuration?.map((session) => (
                    <tr key={session.exerciseType} className="border-b">
                      <td className={`py-3 ${isArabic ? 'text-right' : ''}`}>{getExerciseTypeLabel(session.exerciseType)}</td>
                      <td className="text-right py-3 font-semibold">{session.totalSessions}</td>
                      <td className="text-right py-3 font-semibold">{formatDuration(session.avgDuration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
