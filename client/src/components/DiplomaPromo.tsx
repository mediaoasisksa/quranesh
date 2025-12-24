import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, Clock, ArrowRight, CheckCircle2, Globe, Languages, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";

const DiplomaPromo = () => {
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";

  const content: Record<string, {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    cta: string;
    stats: { weeks: string; languages: string };
    globalBadge: string;
    zanzibarTitle: string;
    zanzibarDesc: string;
    languages: string[];
    availableIn: string;
  }> = {
    ar: {
      badge: "واجهة عالمية",
      title: "دبلوم تعلم اللغة العربية",
      subtitle: "من مكة المكرمة إلى العالم - تعليم اللغة العربية للمسلمين",
      description: "منصة تعليمية عالمية تدعم 10 لغات، تنطلق من قلب العالم الإسلامي لتصل إلى المسلمين في أفريقيا وآسيا وأوروبا والعالم أجمع",
      features: [
        "مفردات قرآنية أساسية للحياة اليومية",
        "تمارين تفاعلية متنوعة وعملية",
        "دعم 10 لغات عالمية",
        "شهادة إتمام معتمدة"
      ],
      cta: "انضم للمنصة العالمية",
      stats: { weeks: "12 أسبوع", languages: "10 لغات" },
      globalBadge: "منصة عالمية",
      zanzibarTitle: "من مكة إلى العالم",
      zanzibarDesc: "بوابة تعليم العربية للمسلمين",
      languages: ["العربية", "الإنجليزية", "الإندونيسية", "التركية", "الصينية", "السواحيلية", "الصومالية", "البوسنية", "الألبانية", "الروسية"],
      availableIn: "متاح بـ 10 لغات:"
    },
    en: {
      badge: "Global Platform",
      title: "Arabic Language Diploma",
      subtitle: "From Mecca to the World - Arabic Language Learning for Muslims",
      description: "A global educational platform supporting 10 languages, launching from the heart of the Islamic world to reach Muslims across Africa, Asia, Europe, and the entire world",
      features: [
        "Essential Quranic vocabulary for daily life",
        "Diverse and practical interactive exercises",
        "Support for 10 global languages",
        "Certified completion certificate"
      ],
      cta: "Join the Global Platform",
      stats: { weeks: "12 Weeks", languages: "10 Languages" },
      globalBadge: "Global Platform",
      zanzibarTitle: "From Mecca to the World",
      zanzibarDesc: "Gateway to Arabic Learning for Muslims",
      languages: ["Arabic", "English", "Indonesian", "Turkish", "Chinese", "Swahili", "Somali", "Bosnian", "Albanian", "Russian"],
      availableIn: "Available in 10 languages:"
    },
    id: {
      badge: "Platform Global",
      title: "Diploma Bahasa Arab",
      subtitle: "Dari Mekkah ke Dunia - Pembelajaran Bahasa Arab untuk Muslim",
      description: "Platform pendidikan global yang mendukung 10 bahasa, diluncurkan dari jantung dunia Islam untuk menjangkau Muslim di Afrika, Asia, Eropa, dan seluruh dunia",
      features: [
        "Kosakata Quran penting untuk kehidupan sehari-hari",
        "Latihan interaktif yang beragam dan praktis",
        "Dukungan untuk 10 bahasa global",
        "Sertifikat penyelesaian resmi"
      ],
      cta: "Bergabung dengan Platform Global",
      stats: { weeks: "12 Minggu", languages: "10 Bahasa" },
      globalBadge: "Platform Global",
      zanzibarTitle: "Dari Mekkah ke Dunia",
      zanzibarDesc: "Gerbang Pembelajaran Bahasa Arab untuk Muslim",
      languages: ["Arab", "Inggris", "Indonesia", "Turki", "Cina", "Swahili", "Somalia", "Bosnia", "Albania", "Rusia"],
      availableIn: "Tersedia dalam 10 bahasa:"
    },
    ms: {
      badge: "Platform Global",
      title: "Diploma Bahasa Arab",
      subtitle: "Dari Mekah ke Dunia - Pembelajaran Bahasa Arab untuk Muslim",
      description: "Platform pendidikan global yang menyokong 10 bahasa, dilancarkan dari jantung dunia Islam untuk menjangkau Muslim di Afrika, Asia, Eropah, dan seluruh dunia",
      features: [
        "Perbendaharaan kata Al-Quran penting untuk kehidupan harian",
        "Latihan interaktif yang pelbagai dan praktikal",
        "Sokongan untuk 10 bahasa global",
        "Sijil penyelesaian rasmi"
      ],
      cta: "Sertai Platform Global",
      stats: { weeks: "12 Minggu", languages: "10 Bahasa" },
      globalBadge: "Platform Global",
      zanzibarTitle: "Dari Mekah ke Dunia",
      zanzibarDesc: "Gerbang Pembelajaran Bahasa Arab untuk Muslim",
      languages: ["Arab", "Inggeris", "Indonesia", "Turki", "Cina", "Swahili", "Somalia", "Bosnia", "Albania", "Rusia"],
      availableIn: "Tersedia dalam 10 bahasa:"
    },
    tr: {
      badge: "Küresel Platform",
      title: "Arapça Dil Diploması",
      subtitle: "Mekke'den Dünyaya - Müslümanlar için Arapça Dil Öğrenimi",
      description: "Afrika, Asya, Avrupa ve tüm dünyada Müslümanlara ulaşmak için İslam dünyasının kalbinden başlayan 10 dili destekleyen küresel eğitim platformu",
      features: [
        "Günlük yaşam için temel Kuran kelime hazinesi",
        "Çeşitli ve pratik etkileşimli alıştırmalar",
        "10 küresel dil desteği",
        "Onaylı tamamlama sertifikası"
      ],
      cta: "Küresel Platforma Katıl",
      stats: { weeks: "12 Hafta", languages: "10 Dil" },
      globalBadge: "Küresel Platform",
      zanzibarTitle: "Mekke'den Dünyaya",
      zanzibarDesc: "Müslümanlar için Arapça Öğrenme Kapısı",
      languages: ["Arapça", "İngilizce", "Endonezce", "Türkçe", "Çince", "Svahili", "Somalice", "Boşnakça", "Arnavutça", "Rusça"],
      availableIn: "10 dilde mevcut:"
    },
    zh: {
      badge: "全球平台",
      title: "阿拉伯语文凭",
      subtitle: "从麦加到世界 - 穆斯林阿拉伯语学习",
      description: "一个支持10种语言的全球教育平台，从伊斯兰世界的心脏地带出发，覆盖非洲、亚洲、欧洲和全世界的穆斯林",
      features: [
        "日常生活必备的古兰经词汇",
        "多样化的实践互动练习",
        "支持10种全球语言",
        "官方结业证书"
      ],
      cta: "加入全球平台",
      stats: { weeks: "12周", languages: "10种语言" },
      globalBadge: "全球平台",
      zanzibarTitle: "从麦加到世界",
      zanzibarDesc: "穆斯林阿拉伯语学习之门",
      languages: ["阿拉伯语", "英语", "印尼语", "土耳其语", "中文", "斯瓦希里语", "索马里语", "波斯尼亚语", "阿尔巴尼亚语", "俄语"],
      availableIn: "提供10种语言："
    },
    sw: {
      badge: "Jukwaa la Kimataifa",
      title: "Diploma ya Lugha ya Kiarabu",
      subtitle: "Kutoka Makka hadi Ulimwengu - Kujifunza Kiarabu kwa Waislamu",
      description: "Jukwaa la elimu la kimataifa linalosaidia lugha 10, lililoanzishwa kutoka moyo wa ulimwengu wa Kiislamu kuwafikia Waislamu katika Afrika, Asia, Ulaya, na ulimwengu mzima",
      features: [
        "Msamiati muhimu wa Qurani kwa maisha ya kila siku",
        "Mazoezi ya kuvutia yenye aina mbalimbali na vitendo",
        "Msaada wa lugha 10 za kimataifa",
        "Cheti cha kukamilisha kilichoidhinishwa"
      ],
      cta: "Jiunge na Jukwaa la Kimataifa",
      stats: { weeks: "Wiki 12", languages: "Lugha 10" },
      globalBadge: "Jukwaa la Kimataifa",
      zanzibarTitle: "Kutoka Makka hadi Ulimwengu",
      zanzibarDesc: "Mlango wa Kujifunza Kiarabu kwa Waislamu",
      languages: ["Kiarabu", "Kiingereza", "Kiindonesia", "Kituruki", "Kichina", "Kiswahili", "Kisomali", "Kibosnia", "Kialbania", "Kirusi"],
      availableIn: "Inapatikana kwa lugha 10:"
    },
    so: {
      badge: "Madal Caalami",
      title: "Dibloomada Luuqadda Carabiga",
      subtitle: "Maka ilaa Adduunka - Barashada Carabiga Muslimiinta",
      description: "Madal waxbarasho caalami ah oo taageera 10 luuqadood, ka bilaabmaya qalbiga adduunka Islaamka si loo gaadho Muslimiinta Afrika, Aasiya, Yurub, iyo adduunka oo dhan",
      features: [
        "Erayada Quraanka ee muhiimka ah ee nolosha maalinlaha ah",
        "Jimicsiyada isdhexgalka ah ee kala duwan iyo kuwa wax ku oolka ah",
        "Taageero 10 luuqadood oo caalami ah",
        "Shahaadada dhammaystirka ee la ansixiyey"
      ],
      cta: "Ku Biir Madalka Caalamiga",
      stats: { weeks: "12 Toddobaad", languages: "10 Luuqadood" },
      globalBadge: "Madal Caalami",
      zanzibarTitle: "Maka ilaa Adduunka",
      zanzibarDesc: "Albaabka Barashada Carabiga Muslimiinta",
      languages: ["Carabi", "Ingiriis", "Indunuusiyaan", "Turki", "Shiinaha", "Sawaaxili", "Soomaali", "Boosniya", "Albaaniya", "Ruush"],
      availableIn: "Waxaa lagu heli karaa 10 luuqadood:"
    },
    bs: {
      badge: "Globalna Platforma",
      title: "Diploma arapskog jezika",
      subtitle: "Od Meke do Svijeta - Učenje arapskog za muslimane",
      description: "Globalna obrazovna platforma koja podržava 10 jezika, pokrenuta iz srca islamskog svijeta kako bi dosegla muslimane u Africi, Aziji, Evropi i cijelom svijetu",
      features: [
        "Ključni kuranski vokabular za svakodnevni život",
        "Raznovrsne i praktične interaktivne vježbe",
        "Podrška za 10 globalnih jezika",
        "Certificirani završni certifikat"
      ],
      cta: "Pridružite se Globalnoj Platformi",
      stats: { weeks: "12 Sedmica", languages: "10 Jezika" },
      globalBadge: "Globalna Platforma",
      zanzibarTitle: "Od Meke do Svijeta",
      zanzibarDesc: "Kapija za učenje arapskog za muslimane",
      languages: ["Arapski", "Engleski", "Indonezijski", "Turski", "Kineski", "Svahili", "Somalijski", "Bosanski", "Albanski", "Ruski"],
      availableIn: "Dostupno na 10 jezika:"
    },
    sq: {
      badge: "Platforma Globale",
      title: "Diploma e Gjuhës Arabe",
      subtitle: "Nga Meka në Botë - Mësimi i Arabishtes për Myslimanët",
      description: "Një platformë arsimore globale që mbështet 10 gjuhë, e nisur nga zemra e botës islame për të arritur myslimanët në Afrikë, Azi, Evropë dhe të gjithë botën",
      features: [
        "Fjalor thelbësor kuranor për jetën e përditshme",
        "Ushtrime interaktive të larmishme dhe praktike",
        "Mbështetje për 10 gjuhë globale",
        "Certifikatë përfundimi e certifikuar"
      ],
      cta: "Bashkohuni me Platformën Globale",
      stats: { weeks: "12 Javë", languages: "10 Gjuhë" },
      globalBadge: "Platforma Globale",
      zanzibarTitle: "Nga Meka në Botë",
      zanzibarDesc: "Porta për Mësimin e Arabishtes për Myslimanët",
      languages: ["Arabisht", "Anglisht", "Indonezisht", "Turqisht", "Kinezisht", "Svahili", "Somalisht", "Boshnjakisht", "Shqip", "Rusisht"],
      availableIn: "E disponueshme në 10 gjuhë:"
    },
    ru: {
      badge: "Глобальная Платформа",
      title: "Диплом арабского языка",
      subtitle: "От Мекки к Миру - Изучение арабского для мусульман",
      description: "Глобальная образовательная платформа, поддерживающая 10 языков, запущенная из сердца исламского мира, чтобы достичь мусульман в Африке, Азии, Европе и во всём мире",
      features: [
        "Основная коранная лексика для повседневной жизни",
        "Разнообразные и практические интерактивные упражнения",
        "Поддержка 10 мировых языков",
        "Сертифицированный сертификат об окончании"
      ],
      cta: "Присоединиться к Глобальной Платформе",
      stats: { weeks: "12 Недель", languages: "10 Языков" },
      globalBadge: "Глобальная Платформа",
      zanzibarTitle: "От Мекки к Миру",
      zanzibarDesc: "Врата к изучению арабского для мусульман",
      languages: ["Арабский", "Английский", "Индонезийский", "Турецкий", "Китайский", "Суахили", "Сомали", "Боснийский", "Албанский", "Русский"],
      availableIn: "Доступно на 10 языках:"
    }
  };

  const t = content[language] || content.en;

  return (
    <section className={`py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-emerald-600 hover:bg-emerald-700" data-testid="badge-diploma-certified">
                    <Award className="h-4 w-4 mr-1" />
                    {t.badge}
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
                    <GraduationCap className="inline-block h-10 w-10 mr-3 mb-1" />
                    {t.title}
                  </h2>
                  
                  <p className="text-lg text-emerald-700 dark:text-emerald-400 mb-3">
                    {t.subtitle}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {t.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-200" data-testid={`text-diploma-feature-${index}`}>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/diploma">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6"
                      data-testid="button-subscribe-diploma"
                    >
                      {t.cta}
                      <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12 flex flex-col justify-center items-center text-white">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <MapPin className="h-8 w-8" />
                      <Globe className="h-12 w-12" />
                      <Languages className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" data-testid="text-zanzibar-title">
                      {t.zanzibarTitle}
                    </h3>
                    <p className="text-emerald-100 mb-4">
                      {t.zanzibarDesc}
                    </p>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4" data-testid="badge-global-platform">
                      <Globe className="h-3 w-3 mr-1" />
                      {t.globalBadge}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm" data-testid="text-diploma-stats-weeks">
                      <Clock className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">{t.stats.weeks}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm" data-testid="text-diploma-stats-languages">
                      <Languages className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">{t.stats.languages}</div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-xs text-emerald-200 text-center mb-2">
                      {t.availableIn}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {t.languages.map((lang, index) => (
                        <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded" data-testid={`text-language-${index}`}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DiplomaPromo;
