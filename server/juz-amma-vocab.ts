export interface JuzAmmaVocabEntry {
  id: string;
  surahAr: string;
  surahEn: string;
  targetWord: string;
  targetWordMeaning: string;
  targetWordTranslations: Record<string, string>;
  correctVerseMeaningTranslations: Record<string, string>;
  surahAyah: string;
  ayahNumber: number;
  hint: string;
  correctVerse: string;
  correctVerseMeaning: string;
  options: { text: string; isCorrect: boolean }[];
}

export const JUZ_AMMA_BANK: JuzAmmaVocabEntry[] = [

  // ═══════════════════════════════════════
  // AN-NABA (سورة النبأ) — 78
  // ═══════════════════════════════════════
  {
    id: "jz_naba_1", surahAr: "النبأ", surahEn: "An-Naba",
    targetWord: "النَّبَأِ",
    targetWordMeaning: "The Great News",
    targetWordTranslations: { en: "The Great News", ar: "الخبر العظيم", id: "Berita Besar", tr: "Büyük Haber", zh: "重大消息", sw: "Habari Kubwa", so: "Wararkii Weyn", bs: "Velika Vijest", sq: "Lajmi i Madh", ru: "Великая Весть", ur: "بڑی خبر", bn: "মহাসংবাদ", ms: "Berita Besar" },
    correctVerseMeaningTranslations: { en: "About the great news", ar: "عن النبأ العظيم", id: "Tentang berita yang besar", tr: "Büyük haber hakkında", zh: "关于那重大消息", sw: "Kuhusu habari kubwa", so: "Warka weyn", bs: "O velikoj vijesti", sq: "Rreth lajmit të madh", ru: "О великой вести", ur: "بڑی خبر کے بارے میں", bn: "মহাসংবাদ সম্পর্কে", ms: "Tentang berita yang besar" },
    surahAyah: "النبأ:2", ayahNumber: 2,
    hint: "كلمة تعني الخبر الكبير المهم",
    correctVerse: "عَنِ النَّبَإِ الْعَظِيمِ",
    correctVerseMeaning: "About the great news",
    options: [{ text: "النَّبَأِ", isCorrect: true }, { text: "الصِّرَاطَ", isCorrect: false }, { text: "الرَّحْمَنِ", isCorrect: false }, { text: "الْحَمْدُ", isCorrect: false }],
  },
  {
    id: "jz_naba_2", surahAr: "النبأ", surahEn: "An-Naba",
    targetWord: "سُبَاتًا",
    targetWordMeaning: "Rest / Deep Sleep",
    targetWordTranslations: { en: "Rest / Deep Sleep", ar: "راحة وسكون", id: "Istirahat", tr: "Derin Uyku", zh: "酣睡安息", sw: "Usingizi", so: "Hurdo", bs: "Odmor", sq: "Pushim", ru: "Покой / Сон", ur: "نیند/آرام", bn: "গভীর ঘুম", ms: "Tidur Nyenyak" },
    correctVerseMeaningTranslations: { en: "And made your sleep a rest", ar: "وجعلنا نومكم سباتاً", id: "Dan Kami jadikan tidurmu sebagai istirahat", tr: "Uykunuzu dinlence kıldık", zh: "我使你们的睡眠为休息", sw: "Na tulifanya usingizi wako kupumzika", so: "Hurdadaana waxaan ka dhignay nasasho", bs: "I učinili smo vaš san odmorom", sq: "Dhe bëmë gjumin tuaj pushim", ru: "И сделали сон ваш отдыхом", ur: "اور تمہاری نیند کو آرام بنایا", bn: "এবং আমি তোমাদের ঘুমকে বিশ্রাম করেছি", ms: "Dan Kami jadikan tidurmu sebagai istirehat" },
    surahAyah: "النبأ:9", ayahNumber: 9,
    hint: "هو حال الإنسان حين ينام",
    correctVerse: "وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا",
    correctVerseMeaning: "And made your sleep a rest",
    options: [{ text: "سُبَاتًا", isCorrect: true }, { text: "ثِقَالًا", isCorrect: false }, { text: "رَحِيمًا", isCorrect: false }, { text: "كِتَابًا", isCorrect: false }],
  },
  {
    id: "jz_naba_3", surahAr: "النبأ", surahEn: "An-Naba",
    targetWord: "وَهَّاجًا",
    targetWordMeaning: "Blazing / Radiant",
    targetWordTranslations: { en: "Blazing / Radiant", ar: "مضيء وحار", id: "Bercahaya", tr: "Parlayan", zh: "烈焰熊熊", sw: "Inayowaka", so: "Iftiimaya", bs: "Sjajan", sq: "Ndriçues", ru: "Пылающий", ur: "روشن و گرم", bn: "জ্বলজ্বলে", ms: "Bersinar" },
    correctVerseMeaningTranslations: { en: "And made a blazing lamp", ar: "وجعلنا سراجاً وهاجاً", id: "Dan Kami jadikan pelita yang menyala-nyala", tr: "Ve aydınlatan bir kandil yaptık", zh: "我设置了一盏明灯", sw: "Na tukafanya taa inayowaka", so: "Siraj waxaan ka dhignay mid iftiimaya", bs: "I napravili smo sjajnu svjetiljku", sq: "Dhe bëmë kandil ndriçues", ru: "И создали светильник пылающий", ur: "اور ایک جلتا ہوا چراغ بنایا", bn: "এবং আমি একটি জ্বলন্ত প্রদীপ তৈরি করেছি", ms: "Dan Kami jadikan lampu yang menyala" },
    surahAyah: "النبأ:13", ayahNumber: 13,
    hint: "تُوصف به الشمس لأنها تُضيء وتُدفئ",
    correctVerse: "وَجَعَلْنَا سِرَاجًا وَهَّاجًا",
    correctVerseMeaning: "And made a blazing lamp",
    options: [{ text: "وَهَّاجًا", isCorrect: true }, { text: "سِرَاجًا", isCorrect: false }, { text: "غَفُورًا", isCorrect: false }, { text: "عَلِيمًا", isCorrect: false }],
  },
  {
    id: "jz_naba_4", surahAr: "النبأ", surahEn: "An-Naba",
    targetWord: "ثَجَّاجًا",
    targetWordMeaning: "Pouring Abundantly",
    targetWordTranslations: { en: "Pouring Abundantly", ar: "منصباً بغزارة", id: "Tercurah Deras", tr: "Bol Yağan", zh: "倾盆大雨", sw: "Kinachomwagika kwa wingi", so: "Si badan u roobaya", bs: "Obilno", sq: "Duke derdhur shumë", ru: "Обильно льющийся", ur: "بہت زیادہ بہتا ہوا", bn: "প্রচুর বর্ষণকারী", ms: "Mencurah Lebat" },
    correctVerseMeaningTranslations: { en: "And sent down water pouring abundantly", ar: "وأنزلنا من المعصرات ماءً ثجاجاً", id: "Dan Kami turunkan air yang deras", tr: "Ve bol bol yağmur indirdik", zh: "我降下倾盆大雨", sw: "Na tukateremsha maji mengi", so: "Biyaha roobka badan waan soo dejinnay", bs: "I spustismo obilnu kišu", sq: "Dhe dërguam ujë duke rënë me bollëk", ru: "И ниспослали обильно льющуюся воду", ur: "اور خوب موسلادھار پانی اتارا", bn: "এবং আমি প্রচুর বৃষ্টি নামিয়েছি", ms: "Dan Kami turunkan air yang mencurah-curah" },
    surahAyah: "النبأ:14", ayahNumber: 14,
    hint: "صفة المطر الكثير الغزير",
    correctVerse: "وَأَنزَلْنَا مِنَ الْمُعْصِرَاتِ مَاءً ثَجَّاجًا",
    correctVerseMeaning: "And sent down water pouring abundantly",
    options: [{ text: "ثَجَّاجًا", isCorrect: true }, { text: "مَاءً", isCorrect: false }, { text: "كَرِيمًا", isCorrect: false }, { text: "وَهَّاجًا", isCorrect: false }],
  },
  {
    id: "jz_naba_5", surahAr: "النبأ", surahEn: "An-Naba",
    targetWord: "مِرْصَادًا",
    targetWordMeaning: "A Place of Ambush",
    targetWordTranslations: { en: "A Place of Ambush", ar: "مكان الرصد والانتظار", id: "Tempat Pengintaian", tr: "Pusu Yeri", zh: "守望之地", sw: "Mahali pa Kuangalia", so: "Meel La Sugayo", bs: "Zasjeda", sq: "Vend Vëzhgimi", ru: "Место засады", ur: "گھات کی جگہ", bn: "ঘাঁটি", ms: "Tempat Pengintipan" },
    correctVerseMeaningTranslations: { en: "Indeed, Hell is a place of ambush", ar: "إن جهنم كانت مرصاداً", id: "Sesungguhnya neraka Jahannam adalah tempat pengintaian", tr: "Şüphesiz ki Cehennem bir pusu yeridir", zh: "地狱确是一处守望之地", sw: "Hakika Jahanamu ni mahali pa kuangalia", so: "Xaqiiqdu, Jahannam waa meeshii la sugayay", bs: "Zaista, Džehennem je zasjeda", sq: "Me të vërtetë, Xhehennemi është vend vëzhgimi", ru: "Воистину, Ад — это место засады", ur: "بے شک جہنم گھات کی جگہ ہے", bn: "নিশ্চয়ই জাহান্নাম ঘাঁটির স্থান", ms: "Sesungguhnya neraka Jahannam adalah tempat pengintipan" },
    surahAyah: "النبأ:21", ayahNumber: 21,
    hint: "مكان يترقب فيه الحارس أو العدو",
    correctVerse: "إِنَّ جَهَنَّمَ كَانَتْ مِرْصَادًا",
    correctVerseMeaning: "Indeed, Hell is a place of ambush",
    options: [{ text: "مِرْصَادًا", isCorrect: true }, { text: "جَهَنَّمَ", isCorrect: false }, { text: "مَآبًا", isCorrect: false }, { text: "مَقَامًا", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AN-NAZI'AT (سورة النازعات) — 79
  // ═══════════════════════════════════════
  {
    id: "jz_naziat_1", surahAr: "النازعات", surahEn: "An-Nazi'at",
    targetWord: "الرَّادِفَةُ",
    targetWordMeaning: "The Following Blast",
    targetWordTranslations: { en: "The Following Blast", ar: "الصيحة التابعة", id: "Tiupan Berikutnya", tr: "Arkasından Gelen", zh: "随后的一声", sw: "Pigo la Pili", so: "Gaariga labaad", bs: "Ona koja slijedi", sq: "Ajo që pason", ru: "Следующий за ней", ur: "پیچھے آنے والی", bn: "পরবর্তী বিস্ফোরণ", ms: "Yang Mengikutinya" },
    correctVerseMeaningTranslations: { en: "The day when the quaking blast quakes, followed by the following blast", ar: "يوم ترجف الراجفة تتبعها الرادفة", id: "Pada hari ketika tiupan pertama mengguncang, disusul tiupan berikutnya", tr: "Sarsıntının sarstığı gün, ardından gelenin takip ettiği gün", zh: "那天，震动者震动，随后随行者随来", sw: "Siku gongo la kwanza litatikisika, likifuatiwa na pigo la pili", so: "Maalinta Xididaagu gariirto ka dibna Raadifdaagu raacdo", bs: "Na dan kada potres zatre, za njim dođe ona koja slijedi", sq: "Ditën kur tërmeti trondit, pasohet nga ajo që vjen pas", ru: "В день, когда сотрясающее потрясёт, за ней последует следующее", ur: "اس دن جب پہلی صیحة کانپائے گی، پھر دوسری آئے گی", bn: "যেদিন কম্পনকারী কাঁপবে তারপর পরবর্তী বিস্ফোরণ হবে", ms: "Pada hari ketika gegaran yang menggegar, diikuti oleh yang mengikutinya" },
    surahAyah: "النازعات:7", ayahNumber: 7,
    hint: "ما يأتي في المرتبة الثانية بعد الأولى",
    correctVerse: "تَتْبَعُهَا الرَّادِفَةُ",
    correctVerseMeaning: "Followed by the following blast",
    options: [{ text: "الرَّادِفَةُ", isCorrect: true }, { text: "الرَّاجِفَةُ", isCorrect: false }, { text: "الصَّاخَّةُ", isCorrect: false }, { text: "الطَّامَّةُ", isCorrect: false }],
  },
  {
    id: "jz_naziat_2", surahAr: "النازعات", surahEn: "An-Nazi'at",
    targetWord: "الطَّامَّةُ",
    targetWordMeaning: "The Overwhelming Calamity",
    targetWordTranslations: { en: "The Overwhelming Calamity", ar: "الداهية العظمى", id: "Bencana Dahsyat", tr: "Büyük Felaket", zh: "滔天大祸", sw: "Msiba Mkuu", so: "Masiibada Weyn", bs: "Sveobuhvatna katastrofa", sq: "Katastrofa Madhore", ru: "Всепоглощающая беда", ur: "بہت بڑی آفت", bn: "মহাবিপদ", ms: "Bencana Dahsyat" },
    correctVerseMeaningTranslations: { en: "But when the overwhelming calamity comes", ar: "فإذا جاءت الطامة الكبرى", id: "Maka apabila datang bencana yang sangat besar", tr: "Büyük felaket geldiğinde", zh: "当那滔天大祸来临之时", sw: "Lakini msiba mkuu utakapokuja", so: "Markay Taamadda Weynuhu imaato", bs: "Kada dođe sveobuhvatna katastrofa", sq: "Kur të vijë katastrofa e madhe", ru: "Когда придёт всепоглощающая беда", ur: "پس جب وہ بہت بڑی آفت آئے گی", bn: "যখন সেই মহাবিপদ আসবে", ms: "Maka apabila datang bencana yang amat besar" },
    surahAyah: "النازعات:34", ayahNumber: 34,
    hint: "وصف ليوم القيامة — كارثة تعلو على كل شيء",
    correctVerse: "فَإِذَا جَاءَتِ الطَّامَّةُ الْكُبْرَى",
    correctVerseMeaning: "But when the overwhelming calamity comes",
    options: [{ text: "الطَّامَّةُ", isCorrect: true }, { text: "الصَّاخَّةُ", isCorrect: false }, { text: "الرَّادِفَةُ", isCorrect: false }, { text: "الْقَارِعَةُ", isCorrect: false }],
  },
  {
    id: "jz_naziat_3", surahAr: "النازعات", surahEn: "An-Nazi'at",
    targetWord: "السَّاهِرَةَ",
    targetWordMeaning: "The Surface of the Earth",
    targetWordTranslations: { en: "The Surface of the Earth", ar: "وجه الأرض المستوي", id: "Permukaan Bumi", tr: "Yerin Yüzeyi", zh: "大地表面", sw: "Uso wa Ardhi", so: "Wejigu Dhulka", bs: "Površina Zemlje", sq: "Sipërfaqja e Tokës", ru: "Поверхность Земли", ur: "زمین کی سطح", bn: "ভূপৃষ্ঠ", ms: "Permukaan Bumi" },
    correctVerseMeaningTranslations: { en: "They will be on the surface of the earth", ar: "فإذا هم بالساهرة", id: "Maka tiba-tiba mereka berada di permukaan bumi", tr: "Ve onlar yerin yüzeyinde olacaklar", zh: "他们突然出现在地球表面", sw: "Na wao watakuwa juu ya uso wa ardhi", so: "Waxay ku jiri doonaan wejiga dhulka", bs: "I odjednom će biti na površini Zemlje", sq: "E pastaj ata do të jenë mbi sipërfaqen e tokës", ru: "И вот они на поверхности земли", ur: "تو وہ اچانک زمین کی سطح پر ہوں گے", bn: "তখন তারা হঠাৎ ভূপৃষ্ঠে থাকবে", ms: "Maka tiba-tiba mereka berada di permukaan bumi" },
    surahAyah: "النازعات:14", ayahNumber: 14,
    hint: "الأرض الواسعة المكشوفة",
    correctVerse: "فَإِذَا هُم بِالسَّاهِرَةِ",
    correctVerseMeaning: "They will be on the surface of the earth",
    options: [{ text: "السَّاهِرَةَ", isCorrect: true }, { text: "الْجَنَّةَ", isCorrect: false }, { text: "النَّارَ", isCorrect: false }, { text: "الآخِرَةَ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // ABASA (سورة عبس) — 80
  // ═══════════════════════════════════════
  {
    id: "jz_abasa_1", surahAr: "عبس", surahEn: "Abasa",
    targetWord: "عَبَسَ",
    targetWordMeaning: "Frowned",
    targetWordTranslations: { en: "Frowned", ar: "كلّح وجهه", id: "Bermuka Masam", tr: "Yüzünü Ekşitti", zh: "皱眉", sw: "Alikusanya uso", so: "Wuxuu qumbaalay", bs: "Namrštio se", sq: "U vrenjos", ru: "Нахмурился", ur: "تیوری چڑھائی", bn: "ভ্রু কুঞ্চিত করলেন", ms: "Bermuka Masam" },
    correctVerseMeaningTranslations: { en: "He frowned and turned away", ar: "عبس وتولى", id: "Dia bermuka masam dan berpaling", tr: "Yüzünü ekşitti ve döndü", zh: "他皱眉并转身离去", sw: "Alikusanya uso na akageuka", so: "Wuxuu qumbaalay oo wuxuu ka leexday", bs: "Namrštio se i okrenuo", sq: "U vrenjos dhe u largua", ru: "Он нахмурился и отвернулся", ur: "اس نے تیوری چڑھائی اور منہ پھیر لیا", bn: "তিনি ভ্রু কুঞ্চিত করলেন এবং মুখ ফিরিয়ে নিলেন", ms: "Dia bermuka masam dan berpaling" },
    surahAyah: "عبس:1", ayahNumber: 1,
    hint: "ما يظهر على الوجه حين الاستياء",
    correctVerse: "عَبَسَ وَتَوَلَّى",
    correctVerseMeaning: "He frowned and turned away",
    options: [{ text: "عَبَسَ", isCorrect: true }, { text: "تَوَلَّى", isCorrect: false }, { text: "جَاءَ", isCorrect: false }, { text: "قَالَ", isCorrect: false }],
  },
  {
    id: "jz_abasa_2", surahAr: "عبس", surahEn: "Abasa",
    targetWord: "الصَّاخَّةُ",
    targetWordMeaning: "The Deafening Blast",
    targetWordTranslations: { en: "The Deafening Blast", ar: "صيحة القيامة المصمّة", id: "Tiupan yang Memekakkan", tr: "Sağır Eden Çığlık", zh: "震耳欲聋的一声", sw: "Kelele ya Kupiga Masikio", so: "Qaylada Qiyaamada", bs: "Oglušujući krik", sq: "Klithma Shurdhues", ru: "Оглушающий крик", ur: "بہرہ کر دینے والی چیخ", bn: "কানফাটা বিস্ফোরণ", ms: "Letusan yang Memekakkan" },
    correctVerseMeaningTranslations: { en: "But when the deafening blast comes", ar: "فإذا جاءت الصاخة", id: "Apabila datang suara yang memekakkan", tr: "Sağır eden çığlık geldiğinde", zh: "当那震耳欲聋的声音来临时", sw: "Lakini kelele ya kupiga masikio itakapokuja", so: "Markay Saxiixadda Xukunkeed timaado", bs: "Kada dođe oglušujuća pouka", sq: "Kur të vijë klithma shurdhues", ru: "Когда придёт оглушающий крик", ur: "پس جب وہ کانوں کو بہرہ کر دینے والی چیخ آئے", bn: "যখন কানফাটা বিস্ফোরণ আসবে", ms: "Apabila datang letusan yang memekakkan" },
    surahAyah: "عبس:33", ayahNumber: 33,
    hint: "صوت شديد يُصم الآذان يوم القيامة",
    correctVerse: "فَإِذَا جَاءَتِ الصَّاخَّةُ",
    correctVerseMeaning: "But when the deafening blast comes",
    options: [{ text: "الصَّاخَّةُ", isCorrect: true }, { text: "الطَّامَّةُ", isCorrect: false }, { text: "الرَّادِفَةُ", isCorrect: false }, { text: "الزَّلْزَلَةُ", isCorrect: false }],
  },
  {
    id: "jz_abasa_3", surahAr: "عبس", surahEn: "Abasa",
    targetWord: "السَّفَرَةِ",
    targetWordMeaning: "The Noble Scribes (Angels)",
    targetWordTranslations: { en: "The Noble Scribes (Angels)", ar: "الملائكة الكرام الكاتبون", id: "Malaikat Pencatat yang Mulia", tr: "Değerli Yazıcı Melekler", zh: "尊贵的书记天使", sw: "Malaika wa Heshima Wanaoandika", so: "Malaa'igaha Sharafta leh", bs: "Plemeniti pisari anđeli", sq: "Engjëjt e nderuar shkrues", ru: "Благородные писцы (ангелы)", ur: "معزز لکھنے والے فرشتے", bn: "মহান লেখক ফেরেশতাগণ", ms: "Malaikat Pencatat yang Mulia" },
    correctVerseMeaningTranslations: { en: "By the hands of noble and righteous scribes", ar: "بأيدي سفرة كرام بررة", id: "Di tangan malaikat pencatat yang mulia dan berbakti", tr: "Değerli ve erdemli yazıcıların ellerinde", zh: "由尊贵而善良的书记们记录", sw: "Mikononi mwa malaika wa heshima na wema", so: "Gacmaha Malaa'igaha Sharafta leh", bs: "U rukama plemenitih i bogobojaznih pisara", sq: "Në duart e shkruesve të nderuar dhe të mirë", ru: "В руках благородных и праведных писцов", ur: "عزت والے نیک لکھنے والوں کے ہاتھوں میں", bn: "মহৎ ও পুণ্যবান লেখকদের হাতে", ms: "Di tangan para malaikat yang mulia dan taat" },
    surahAyah: "عبس:15", ayahNumber: 15,
    hint: "الملائكة المكلّفون بكتابة أعمال الناس",
    correctVerse: "بِأَيْدِي سَفَرَةٍ",
    correctVerseMeaning: "By the hands of noble and righteous scribes",
    options: [{ text: "سَفَرَةٍ", isCorrect: true }, { text: "كِرَامٍ", isCorrect: false }, { text: "بَرَرَةٍ", isCorrect: false }, { text: "مَلَائِكَةٍ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AT-TAKWIR (سورة التكوير) — 81
  // ═══════════════════════════════════════
  {
    id: "jz_takwir_1", surahAr: "التكوير", surahEn: "At-Takwir",
    targetWord: "كُوِّرَتْ",
    targetWordMeaning: "Was Rolled Up / Wrapped",
    targetWordTranslations: { en: "Was Rolled Up / Wrapped", ar: "لُفّت وطُويت", id: "Digulung", tr: "Dürüldü", zh: "被卷起", sw: "Iliviringwa", so: "La duubay", bs: "Smotana", sq: "U mbështoll", ru: "Была свёрнута", ur: "لپیٹ دی گئی", bn: "গুটিয়ে নেওয়া হবে", ms: "Digulung" },
    correctVerseMeaningTranslations: { en: "When the sun is rolled up", ar: "إذا الشمس كوّرت", id: "Apabila matahari digulung", tr: "Güneş dürüldüğünde", zh: "当太阳被卷起之时", sw: "Jua litakapoviringwa", so: "Qorraxda la duubtay markii", bs: "Kada bude sunce smotano", sq: "Kur dielli të mbështollet", ru: "Когда солнце будет свёрнуто", ur: "جب سورج لپیٹ دیا جائے گا", bn: "যখন সূর্যকে গুটিয়ে নেওয়া হবে", ms: "Apabila matahari digulung" },
    surahAyah: "التكوير:1", ayahNumber: 1,
    hint: "لَفّ الشيء وطيّه كما تُطوى الصحيفة",
    correctVerse: "إِذَا الشَّمْسُ كُوِّرَتْ",
    correctVerseMeaning: "When the sun is rolled up",
    options: [{ text: "كُوِّرَتْ", isCorrect: true }, { text: "انشَقَّتْ", isCorrect: false }, { text: "انفَطَرَتْ", isCorrect: false }, { text: "خَسَفَتْ", isCorrect: false }],
  },
  {
    id: "jz_takwir_2", surahAr: "التكوير", surahEn: "At-Takwir",
    targetWord: "انكَدَرَتْ",
    targetWordMeaning: "Fell and Scattered",
    targetWordTranslations: { en: "Fell and Scattered", ar: "تساقطت وانتثرت", id: "Berjatuhan", tr: "Döküldü", zh: "陨落散落", sw: "Ilianguka na kutawanyika", so: "Kala daatay", bs: "Raspale se", sq: "Ra dhe u shpërnda", ru: "Рассыпались", ur: "جھڑ گئے", bn: "বিচ্ছিন্ন হয়ে পড়বে", ms: "Berjatuhan" },
    correctVerseMeaningTranslations: { en: "And when the stars fall scattered", ar: "وإذا النجوم انكدرت", id: "Dan apabila bintang-bintang berjatuhan", tr: "Yıldızlar döküldüğünde", zh: "当星辰陨落散开时", sw: "Na nyota zitakapotawanyika", so: "Xiddiguhuna kala daatayaan", bs: "I kada se zvijezde raspale", sq: "Dhe kur yjet të bien e shpërndahen", ru: "И когда звёзды осыплются", ur: "اور جب ستارے جھڑ پڑیں گے", bn: "যখন তারাগুলো বিচ্ছিন্ন হয়ে পড়বে", ms: "Dan apabila bintang-bintang berjatuhan" },
    surahAyah: "التكوير:2", ayahNumber: 2,
    hint: "تساقط النجوم وتناثرها في الهواء",
    correctVerse: "وَإِذَا النُّجُومُ انكَدَرَتْ",
    correctVerseMeaning: "And when the stars fall scattered",
    options: [{ text: "انكَدَرَتْ", isCorrect: true }, { text: "النُّجُومُ", isCorrect: false }, { text: "كُوِّرَتْ", isCorrect: false }, { text: "انفَطَرَتْ", isCorrect: false }],
  },
  {
    id: "jz_takwir_3", surahAr: "التكوير", surahEn: "At-Takwir",
    targetWord: "عَسْعَسَ",
    targetWordMeaning: "Retreated / Departed",
    targetWordTranslations: { en: "Retreated / Departed", ar: "أقبل أو أدبر وانصرف", id: "Berlalu / Mundur", tr: "Çekildi / Gitti", zh: "退去/离去", sw: "Iliondoka", so: "Ka baxday", bs: "Povukla se", sq: "U tërhoq", ru: "Отступила / Удалилась", ur: "پیٹھ پھیر گئی", bn: "প্রস্থান করল", ms: "Berlalu" },
    correctVerseMeaningTranslations: { en: "And by the night as it departs", ar: "والليل إذا عسعس", id: "Dan demi malam apabila berlalu", tr: "Geceye yemin olsun, çekildiğinde", zh: "以夜幕退去时为誓", sw: "Na usiku unapoondoka", so: "Habeenkana marka uu baxo", bs: "I noću kada se povuče", sq: "Dhe naten kur të tërhiqet", ru: "И ночью, когда она отступает", ur: "اور رات کی قسم جب پیٹھ پھیرے", bn: "রাতের শপথ যখন সে প্রস্থান করে", ms: "Dan demi malam apabila berlalu" },
    surahAyah: "التكوير:17", ayahNumber: 17,
    hint: "ذهاب الليل وانسحابه في آخر الليل",
    correctVerse: "وَاللَّيْلِ إِذَا عَسْعَسَ",
    correctVerseMeaning: "And by the night as it departs",
    options: [{ text: "عَسْعَسَ", isCorrect: true }, { text: "اللَّيْلِ", isCorrect: false }, { text: "الصُّبْحِ", isCorrect: false }, { text: "النَّهَارِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-INFITAR (سورة الانفطار) — 82
  // ═══════════════════════════════════════
  {
    id: "jz_infitar_1", surahAr: "الانفطار", surahEn: "Al-Infitar",
    targetWord: "انفَطَرَتْ",
    targetWordMeaning: "Split Apart",
    targetWordTranslations: { en: "Split Apart", ar: "انشقت وتصدّعت", id: "Terbelah", tr: "Yarıldı", zh: "裂开", sw: "Ilipasuliwa", so: "Kala jajabay", bs: "Rasporila se", sq: "U ça", ru: "Раскололось", ur: "پھٹ گیا", bn: "বিদীর্ণ হয়ে গেল", ms: "Terbelah" },
    correctVerseMeaningTranslations: { en: "When the sky is split apart", ar: "إذا السماء انفطرت", id: "Apabila langit terbelah", tr: "Gökyüzü yarıldığında", zh: "当天空裂开之时", sw: "Mbingu zinapopasuliwa", so: "Samada ay kala jabto", bs: "Kada se nebo rasporilo", sq: "Kur qielli të çahet", ru: "Когда небо расколется", ur: "جب آسمان پھٹ جائے گا", bn: "যখন আকাশ বিদীর্ণ হয়ে যাবে", ms: "Apabila langit terbelah" },
    surahAyah: "الانفطار:1", ayahNumber: 1,
    hint: "انشقاق وتصدّع شيء إلى أجزاء",
    correctVerse: "إِذَا السَّمَاءُ انفَطَرَتْ",
    correctVerseMeaning: "When the sky is split apart",
    options: [{ text: "انفَطَرَتْ", isCorrect: true }, { text: "كُوِّرَتْ", isCorrect: false }, { text: "السَّمَاءُ", isCorrect: false }, { text: "زُلْزِلَتْ", isCorrect: false }],
  },
  {
    id: "jz_infitar_2", surahAr: "الانفطار", surahEn: "Al-Infitar",
    targetWord: "الأَبْرَارِ",
    targetWordMeaning: "The Righteous",
    targetWordTranslations: { en: "The Righteous", ar: "الصالحون المطيعون", id: "Orang-orang yang berbakti", tr: "İyiler / Erdemliler", zh: "善良之人", sw: "Watu wema", so: "Kuwa fiicanka", bs: "Pravednici", sq: "Të mirët / Të drejtët", ru: "Праведники", ur: "نیک لوگ", bn: "সৎকর্মশীলগণ", ms: "Orang-orang yang baik" },
    correctVerseMeaningTranslations: { en: "Indeed, the righteous will be in bliss", ar: "إن الأبرار لفي نعيم", id: "Sesungguhnya orang-orang yang berbakti benar-benar dalam kenikmatan", tr: "İyiler gerçekten nimette olacak", zh: "善人确在幸福之中", sw: "Hakika watu wema watakuwa katika neema", so: "Runtii, Kuwa fiicanka waxay ku jiraan raaxo", bs: "Zaista, pravednici su u blagostanju", sq: "Me të vërtetë, të mirët do të jenë në begati", ru: "Воистину, праведники будут в блаженстве", ur: "بے شک نیک لوگ نعمتوں میں ہوں گے", bn: "নিশ্চয়ই সৎকর্মশীলগণ সুখে থাকবে", ms: "Sesungguhnya orang-orang yang baik berada dalam kenikmatan" },
    surahAyah: "الانفطار:13", ayahNumber: 13,
    hint: "جمع «بَرّ» — الصالح المتقي",
    correctVerse: "إِنَّ الأَبْرَارَ لَفِي نَعِيمٍ",
    correctVerseMeaning: "Indeed, the righteous will be in bliss",
    options: [{ text: "الأَبْرَارِ", isCorrect: true }, { text: "الْفُجَّارِ", isCorrect: false }, { text: "الْكُفَّارِ", isCorrect: false }, { text: "الأَشْرَارِ", isCorrect: false }],
  },
  {
    id: "jz_infitar_3", surahAr: "الانفطار", surahEn: "Al-Infitar",
    targetWord: "الْفُجَّارِ",
    targetWordMeaning: "The Wicked",
    targetWordTranslations: { en: "The Wicked / Sinners", ar: "العصاة والفاجرون", id: "Orang-orang fasik", tr: "Günahkârlar", zh: "邪恶者/罪人", sw: "Waovu", so: "Kuwa xumaanta", bs: "Grješnici", sq: "Mëkatarët", ru: "Нечестивцы / Грешники", ur: "گناہگار فاجر لوگ", bn: "পাপীরা", ms: "Orang-orang yang jahat" },
    correctVerseMeaningTranslations: { en: "And indeed, the wicked will be in a blazing fire", ar: "وإن الفجار لفي جحيم", id: "Dan sesungguhnya orang-orang fasik benar-benar dalam neraka", tr: "Ve günahkârlar gerçekten cehennemdedir", zh: "邪恶者确在熊熊烈火之中", sw: "Na hakika waovu watakuwa katika moto mkali", so: "Runtii Fujaarada waxay ku jiraan naareey", bs: "I zaista, grješnici su u paklu", sq: "Dhe me të vërtetë, mëkatarët do të jenë në zjarr", ru: "И воистину нечестивцы в адском огне", ur: "اور بے شک فاجر لوگ جہنم میں ہوں گے", bn: "এবং নিশ্চয়ই পাপীরা জাহান্নামে থাকবে", ms: "Dan sesungguhnya orang-orang jahat berada dalam neraka" },
    surahAyah: "الانفطار:14", ayahNumber: 14,
    hint: "جمع «فاجر» — المذنب المعتدي",
    correctVerse: "وَإِنَّ الْفُجَّارَ لَفِي جَحِيمٍ",
    correctVerseMeaning: "And indeed, the wicked will be in a blazing fire",
    options: [{ text: "الْفُجَّارِ", isCorrect: true }, { text: "الأَبْرَارِ", isCorrect: false }, { text: "جَحِيمٍ", isCorrect: false }, { text: "نَعِيمٍ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-MUTAFFIFIN (سورة المطففين) — 83
  // ═══════════════════════════════════════
  {
    id: "jz_mutaffifin_1", surahAr: "المطففين", surahEn: "Al-Mutaffifin",
    targetWord: "الْمُطَفِّفِينَ",
    targetWordMeaning: "Those Who Give Short Measure",
    targetWordTranslations: { en: "Those Who Give Short Measure", ar: "المنقصون في الكيل والوزن", id: "Orang yang curang dalam timbangan", tr: "Ölçüde eksiklik yapanlar", zh: "短斤缺两者", sw: "Wale wanaopunguza vipimo", so: "Kuwa Ceebaaya Miisaanka", bs: "Oni koji kratko mjere", sq: "Ata që mashtroisin në matje", ru: "Те, кто обмеривают / обвешивают", ur: "ناپ تول میں ڈنڈی مارنے والے", bn: "যারা মাপে কম দেয়", ms: "Orang-orang yang curang dalam sukatan" },
    correctVerseMeaningTranslations: { en: "Woe to those who give short measure", ar: "ويل للمطففين", id: "Kecelakaan besar bagi orang-orang yang curang", tr: "Ölçüde eksiklik yapanlara yazıklar olsun", zh: "祸哉，那些短斤缺两者", sw: "Ole wao wanaopunguza vipimo", so: "Ceeb ku tahay kuwa Ceebeeya Miisaanka", bs: "Teško onima koji kratko mjere", sq: "Mjerë ata që mashtroisin në matje", ru: "Горе обмеривающим", ur: "ناپ تول میں ڈنڈی مارنے والوں کے لیے خرابی ہے", bn: "দুর্ভোগ তাদের জন্য যারা মাপে কম দেয়", ms: "Celakalah orang-orang yang curang dalam sukatan" },
    surahAyah: "المطففين:1", ayahNumber: 1,
    hint: "من ينقص حق الآخرين في الكيل أو الوزن",
    correctVerse: "وَيْلٌ لِّلْمُطَفِّفِينَ",
    correctVerseMeaning: "Woe to those who give short measure",
    options: [{ text: "الْمُطَفِّفِينَ", isCorrect: true }, { text: "الأَبْرَارِ", isCorrect: false }, { text: "الْفُجَّارِ", isCorrect: false }, { text: "الْكَافِرِينَ", isCorrect: false }],
  },
  {
    id: "jz_mutaffifin_2", surahAr: "المطففين", surahEn: "Al-Mutaffifin",
    targetWord: "سِجِّينٍ",
    targetWordMeaning: "The Lowest Prison (Hell's Record)",
    targetWordTranslations: { en: "The Lowest Prison (Hell's Record)", ar: "أسفل الأرضين — سجل أهل النار", id: "Penjara terendah (catatan ahli neraka)", tr: "En aşağı zindan (cehennemliklerin kaydı)", zh: "最低的监狱（地狱档案）", sw: "Gereza la chini kabisa", so: "Xabsiga ugu hooseeya", bs: "Najdublja tamnica", sq: "Burgu më i ulët", ru: "Темница низшая", ur: "سب سے نچلی قید", bn: "সবচেয়ে নিচের কারাগার", ms: "Penjara paling bawah" },
    correctVerseMeaningTranslations: { en: "Indeed, the record of the wicked is in Sijjeen", ar: "إن كتاب الفجار لفي سجين", id: "Sesungguhnya catatan orang-orang fasik ada dalam Sijjin", tr: "Günahkârların kaydı Seccinde'dir", zh: "邪恶者的记录确在西金中", sw: "Hakika kumbukumbu ya waovu iko Sijjin", so: "Xaqiiqdu kitaabkii fujaarada wuxuu ku jiraa Sijjiin", bs: "Zaista, knjiga grješnika je u Sičinu", sq: "Me të vërtetë, regjistri i nečestivëve është në Sixin", ru: "Воистину, книга грешников в Сиджжине", ur: "بے شک فاجروں کی کتاب سجین میں ہے", bn: "নিশ্চয়ই পাপীদের আমলনামা সিজ্জিনে আছে", ms: "Sesungguhnya catatan orang-orang jahat ada dalam Sijjin" },
    surahAyah: "المطففين:7", ayahNumber: 7,
    hint: "اسم لمكان أو سجل أهل النار في أسفل السافلين",
    correctVerse: "إِنَّ كِتَابَ الْفُجَّارِ لَفِي سِجِّينٍ",
    correctVerseMeaning: "Indeed, the record of the wicked is in Sijjeen",
    options: [{ text: "سِجِّينٍ", isCorrect: true }, { text: "عِلِّيِّينَ", isCorrect: false }, { text: "جَحِيمٍ", isCorrect: false }, { text: "نَعِيمٍ", isCorrect: false }],
  },
  {
    id: "jz_mutaffifin_3", surahAr: "المطففين", surahEn: "Al-Mutaffifin",
    targetWord: "عِلِّيِّينَ",
    targetWordMeaning: "The Highest Place (Paradise's Record)",
    targetWordTranslations: { en: "The Highest Place (Paradise's Record)", ar: "أعلى مكان في الجنة — سجل أهل الجنة", id: "Tempat tertinggi (catatan ahli surga)", tr: "En yüksek yer (cennetliklerin kaydı)", zh: "最高之地（天堂档案）", sw: "Mahali pa juu zaidi (kumbukumbu ya peponi)", so: "Meeshii ugu sarreysay (diiwaanka Jannada)", bs: "Najviše mjesto (knjiga stanovnika dženneta)", sq: "Vendi më i lartë (regjistri i banorëve të Xhenetit)", ru: "Высочайшее место (книга обитателей рая)", ur: "سب سے بلند جگہ (جنتیوں کا سجل)", bn: "সর্বোচ্চ স্থান (জান্নাতবাসীদের আমলনামা)", ms: "Tempat paling tinggi (catatan ahli syurga)" },
    correctVerseMeaningTranslations: { en: "Indeed, the record of the righteous is in Illiyyeen", ar: "إن كتاب الأبرار لفي عليين", id: "Sesungguhnya catatan orang-orang yang baik ada dalam Illiyyin", tr: "İyilerin kaydı Illiyyunde'dir", zh: "善良者的记录确在伊利因中", sw: "Hakika kumbukumbu ya wema iko Iliyyiyna", so: "Xaqiiqdu kitaabkii abaaradda wuxuu ku jiraa Cilliyyiin", bs: "Zaista, knjiga pravednika je u Illiyunu", sq: "Me të vërtetë, regjistri i të mirëve është në Illijjin", ru: "Воистину, книга праведников в Иллиййине", ur: "بے شک نیکوں کی کتاب علیین میں ہے", bn: "নিশ্চয়ই সৎকর্মশীলদের আমলনামা ইল্লিয়্যিনে আছে", ms: "Sesungguhnya catatan orang-orang yang baik ada dalam Illiyyin" },
    surahAyah: "المطففين:18", ayahNumber: 18,
    hint: "المقابل لـ«سجين» — أعلى علوّ لأهل الجنة",
    correctVerse: "إِنَّ كِتَابَ الأَبْرَارِ لَفِي عِلِّيِّينَ",
    correctVerseMeaning: "Indeed, the record of the righteous is in Illiyyeen",
    options: [{ text: "عِلِّيِّينَ", isCorrect: true }, { text: "سِجِّينٍ", isCorrect: false }, { text: "الأَبْرَارِ", isCorrect: false }, { text: "نَعِيمٍ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-INSHIQAQ (سورة الانشقاق) — 84
  // ═══════════════════════════════════════
  {
    id: "jz_inshiqaq_1", surahAr: "الانشقاق", surahEn: "Al-Inshiqaq",
    targetWord: "انشَقَّتْ",
    targetWordMeaning: "Split Apart",
    targetWordTranslations: { en: "Split Apart / Cleft Asunder", ar: "انشقت وتصدّعت", id: "Terbelah", tr: "Yarıldı", zh: "裂开", sw: "Ilipasuliwa", so: "Kala jabay", bs: "Rasporila se", sq: "U ça", ru: "Расколовшееся", ur: "پھٹ گیا", bn: "বিদীর্ণ হয়ে গেল", ms: "Terbelah" },
    correctVerseMeaningTranslations: { en: "When the sky has split apart", ar: "إذا السماء انشقت", id: "Apabila langit terbelah", tr: "Gökyüzü yarıldığında", zh: "当天空裂开之时", sw: "Mbingu zinapopasuliwa", so: "Samadii jabay markii", bs: "Kada se nebo rasporilo", sq: "Kur qielli të çahet", ru: "Когда небо расколется", ur: "جب آسمان پھٹ جائے گا", bn: "যখন আকাশ ফেটে যাবে", ms: "Apabila langit terbelah" },
    surahAyah: "الانشقاق:1", ayahNumber: 1,
    hint: "تشقّق وانفتاح السماء يوم القيامة",
    correctVerse: "إِذَا السَّمَاءُ انشَقَّتْ",
    correctVerseMeaning: "When the sky has split apart",
    options: [{ text: "انشَقَّتْ", isCorrect: true }, { text: "انفَطَرَتْ", isCorrect: false }, { text: "السَّمَاءُ", isCorrect: false }, { text: "كُوِّرَتْ", isCorrect: false }],
  },
  {
    id: "jz_inshiqaq_2", surahAr: "الانشقاق", surahEn: "Al-Inshiqaq",
    targetWord: "كَادِحٌ",
    targetWordMeaning: "Striving / Working Hard",
    targetWordTranslations: { en: "Striving / Working Hard", ar: "ساعٍ مجتهد", id: "Bersungguh-sungguh bekerja", tr: "Çabalayan", zh: "努力奋斗", sw: "Anayejitahidi", so: "Ka hawlgalaya", bs: "Koji se trudi", sq: "I mundimshëm", ru: "Усердно трудящийся", ur: "کوشش کرنے والا", bn: "পরিশ্রমশীল", ms: "Bersungguh-sungguh" },
    correctVerseMeaningTranslations: { en: "O mankind, indeed you are laboring toward your Lord with great exertion", ar: "يا أيها الإنسان إنك كادح إلى ربك كدحاً", id: "Wahai manusia, sesungguhnya kamu bersungguh-sungguh menuju Tuhanmu", tr: "Ey insan, sen Rabbine varmak için durmadan çabalıyorsun", zh: "人啊，你确实在努力地奔向你的主", sw: "Ewe mtu, hakika unajitahidi kwenda kwa Mola wako", so: "Oo Aadanaha, xaqiiqdu waxaad u hawlgashaa Rabbigaa", bs: "O čovječe, ti zaista naporno patiš ka svome Gospodaru", sq: "O njeri, ti me të vërtetë mundohesh shumë drejt Zotit tënd", ru: "О человек, ты усердно стремишься к своему Господу", ur: "اے انسان تو اپنے رب کی طرف سخت کوشش کرتا ہے", bn: "হে মানুষ! তুমি তোমার রবের দিকে কঠোর পরিশ্রম করছ", ms: "Wahai manusia, sesungguhnya kamu bersungguh-sungguh menuju Tuhanmu" },
    surahAyah: "الانشقاق:6", ayahNumber: 6,
    hint: "من يسعى ويجتهد بجدّ في عمله",
    correctVerse: "إِنَّكَ كَادِحٌ إِلَى رَبِّكَ كَدْحًا",
    correctVerseMeaning: "Indeed you are laboring toward your Lord with great exertion",
    options: [{ text: "كَادِحٌ", isCorrect: true }, { text: "رَبِّكَ", isCorrect: false }, { text: "الإِنسَانُ", isCorrect: false }, { text: "لَاقِيهِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-BURUJ (سورة البروج) — 85
  // ═══════════════════════════════════════
  {
    id: "jz_buruj_1", surahAr: "البروج", surahEn: "Al-Buruj",
    targetWord: "الْبُرُوجِ",
    targetWordMeaning: "The Constellations / Great Stars",
    targetWordTranslations: { en: "The Constellations / Great Stars", ar: "المجموعات النجمية الكبيرة", id: "Gugusan Bintang", tr: "Burçlar / Büyük Yıldızlar", zh: "星座/星辰", sw: "Makundi ya Nyota", so: "Xiddigaha Weyn", bs: "Zvijezdana zviježđa", sq: "Ylberi / Yllit e Mëdha", ru: "Созвездия", ur: "بڑے ستارے/برج", bn: "নক্ষত্রমণ্ডল", ms: "Gugusan Bintang" },
    correctVerseMeaningTranslations: { en: "By the sky containing great stars", ar: "والسماء ذات البروج", id: "Demi langit yang mempunyai gugusan bintang", tr: "Burçları olan göğe yemin olsun", zh: "以有星座的天空为誓", sw: "Naapa kwa mbingu zenye makundi ya nyota", so: "Samadii xiddigaha weyn ku weydiiye", bs: "Tako mi neba s burujima", sq: "Betohem në qiellin e yllit", ru: "Клянусь небом, обладающим созвездиями", ur: "قسم ہے آسمان کی جس میں برج ہیں", bn: "নক্ষত্রমণ্ডলযুক্ত আকাশের শপথ", ms: "Demi langit yang mempunyai gugusan bintang" },
    surahAyah: "البروج:1", ayahNumber: 1,
    hint: "مجموعات النجوم في السماء",
    correctVerse: "وَالسَّمَاءِ ذَاتِ الْبُرُوجِ",
    correctVerseMeaning: "By the sky containing great stars",
    options: [{ text: "الْبُرُوجِ", isCorrect: true }, { text: "السَّمَاءِ", isCorrect: false }, { text: "النُّجُومِ", isCorrect: false }, { text: "الشَّمْسِ", isCorrect: false }],
  },
  {
    id: "jz_buruj_2", surahAr: "البروج", surahEn: "Al-Buruj",
    targetWord: "الأُخْدُودِ",
    targetWordMeaning: "The Trench / Ditch",
    targetWordTranslations: { en: "The Trench / Ditch", ar: "الحفرة الكبيرة في الأرض", id: "Parit / Galian Besar", tr: "Hendek / Çukur", zh: "壕沟", sw: "Handaki", so: "Qodob", bs: "Jarak / Rupa", sq: "Hendek i madh", ru: "Ров / Траншея", ur: "گہری نالی/خندق", bn: "পরিখা/গর্ত", ms: "Parit Dalam" },
    correctVerseMeaningTranslations: { en: "Cursed were the companions of the trench", ar: "قتل أصحاب الأخدود", id: "Binasalah orang-orang yang membuat parit", tr: "Hendek sahipleri kahrolsun", zh: "愿壕沟之人受诅咒", sw: "Walaaniwe wale waliochimba handaki", so: "Ha laabataan Asxaabul Uxduud", bs: "Proklinaju se vlasnici jarka", sq: "Mallkuar qoftë njerëzit e hendekut", ru: "Прокляты были владельцы рва", ur: "خندق والے ہلاک ہوئے", bn: "খন্দকের অধিবাসীরা ধ্বংস হোক", ms: "Terkutuklah para penggali parit" },
    surahAyah: "البروج:4", ayahNumber: 4,
    hint: "حفرة عميقة طويلة يُضرم فيها النار",
    correctVerse: "قُتِلَ أَصْحَابُ الأُخْدُودِ",
    correctVerseMeaning: "Cursed were the companions of the trench",
    options: [{ text: "الأُخْدُودِ", isCorrect: true }, { text: "أَصْحَابُ", isCorrect: false }, { text: "النَّارِ", isCorrect: false }, { text: "الْفُرْقَانِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AT-TARIQ (سورة الطارق) — 86
  // ═══════════════════════════════════════
  {
    id: "jz_tariq_1", surahAr: "الطارق", surahEn: "At-Tariq",
    targetWord: "الطَّارِقُ",
    targetWordMeaning: "The Night Star (Piercing)",
    targetWordTranslations: { en: "The Night Star (Piercing)", ar: "النجم الثاقب اللامع ليلاً", id: "Bintang Malam yang Memancar", tr: "Gece Yıldızı (Delici)", zh: "夜晚的星辰", sw: "Nyota ya Usiku", so: "Xiddigta Habeenka", bs: "Noćna zvijezda", sq: "Ylli i Natës", ru: "Ночная звезда (пронзающая)", ur: "رات کا آنے والا ستارہ", bn: "রাতের ঝলমলে তারা", ms: "Bintang Malam yang Muncul" },
    correctVerseMeaningTranslations: { en: "By the sky and the night comer", ar: "والسماء والطارق", id: "Demi langit dan bintang yang datang di malam hari", tr: "Göğe ve gece gelenine yemin olsun", zh: "以天空和夜来者为誓", sw: "Naapa kwa mbingu na lile linalokuja usiku", so: "Samada iyo Dhaafitaanka saakada habeenka", bs: "Tako mi neba i onoga što noću dolazi", sq: "Betohem në qiell dhe atë që vjen natën", ru: "Клянусь небом и ночным пришельцем", ur: "قسم ہے آسمان کی اور رات کو آنے والے کی", bn: "আকাশ ও রাতের আগমনকারীর শপথ", ms: "Demi langit dan bintang yang muncul pada waktu malam" },
    surahAyah: "الطارق:1", ayahNumber: 1,
    hint: "ما يأتي في الليل — النجم الساطع",
    correctVerse: "وَالسَّمَاءِ وَالطَّارِقِ",
    correctVerseMeaning: "By the sky and the night comer",
    options: [{ text: "الطَّارِقُ", isCorrect: true }, { text: "السَّمَاءِ", isCorrect: false }, { text: "الثَّاقِبُ", isCorrect: false }, { text: "الْبُرُوجِ", isCorrect: false }],
  },
  {
    id: "jz_tariq_2", surahAr: "الطارق", surahEn: "At-Tariq",
    targetWord: "الثَّاقِبُ",
    targetWordMeaning: "The Piercing / Brilliantly Shining",
    targetWordTranslations: { en: "The Piercing / Brilliantly Shining", ar: "اللامع المضيء الثاقب", id: "Yang Menembus Cahaya", tr: "Delici / Parlayan", zh: "光芒穿透的", sw: "Inayotoboa", so: "Kaga soo dhafraysa", bs: "Koji probija", sq: "I shpues / Ndriçues", ru: "Пронзающий / Блистающий", ur: "روشن چمکدار", bn: "উজ্জ্বল ভেদকারী", ms: "Yang Memancar Tajam" },
    correctVerseMeaningTranslations: { en: "The piercing star", ar: "النجم الثاقب", id: "Bintang yang menembus", tr: "Delici yıldız", zh: "那颗光芒穿透的星", sw: "Nyota inayotoboa", so: "Xiddigta soo dhafraysa", bs: "Zvijezda koja probija", sq: "Ylli i shpues", ru: "Пронзающая звезда", ur: "چمکتا ہوا ستارہ", bn: "উজ্জ্বল তারা", ms: "Bintang yang memancar tajam" },
    surahAyah: "الطارق:3", ayahNumber: 3,
    hint: "وصف النجم بأن ضوءه يخترق الظلام",
    correctVerse: "النَّجْمُ الثَّاقِبُ",
    correctVerseMeaning: "The piercing star",
    options: [{ text: "الثَّاقِبُ", isCorrect: true }, { text: "النَّجْمُ", isCorrect: false }, { text: "الطَّارِقُ", isCorrect: false }, { text: "الْبُرُوجُ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-A'LA (سورة الأعلى) — 87
  // ═══════════════════════════════════════
  {
    id: "jz_ala_1", surahAr: "الأعلى", surahEn: "Al-A'la",
    targetWord: "سَبِّحِ",
    targetWordMeaning: "Glorify / Praise",
    targetWordTranslations: { en: "Glorify / Praise", ar: "نزّه وعظّم", id: "Sucikanlah", tr: "Tesbih Et / Yücelt", zh: "赞美/颂扬", sw: "Utakase", so: "U Sabbaaxo", bs: "Slavi / Veličaj", sq: "Lartëso", ru: "Прославляй", ur: "تسبیح کرو", bn: "পবিত্রতা ঘোষণা কর", ms: "Bertasbihlah" },
    correctVerseMeaningTranslations: { en: "Glorify the name of your Lord, the Most High", ar: "سبّح اسم ربك الأعلى", id: "Sucikanlah nama Tuhanmu yang Maha Tinggi", tr: "Yüce Rabbinin adını tesbih et", zh: "你当赞美你至高之主的名", sw: "Tukuza jina la Mola wako Mtukufu", so: "U Sabbaaxo magaca Rabbigaa ugu Sarreeya", bs: "Slavi ime svoga Gospodara, Uzvišenog", sq: "Lartëso emrin e Zotit tënd, Shumë të Lartit", ru: "Прославляй имя Господа Твоего Всевышнего", ur: "اپنے رب اعلیٰ کے نام کی تسبیح کرو", bn: "তোমার মহান রবের নাম পবিত্র ঘোষণা কর", ms: "Bertasbihlah dengan nama Tuhanmu Yang Maha Tinggi" },
    surahAyah: "الأعلى:1", ayahNumber: 1,
    hint: "قول «سبحان الله» — التنزيه والتعظيم",
    correctVerse: "سَبِّحِ اسْمَ رَبِّكَ الأَعْلَى",
    correctVerseMeaning: "Glorify the name of your Lord, the Most High",
    options: [{ text: "سَبِّحِ", isCorrect: true }, { text: "اسْمَ", isCorrect: false }, { text: "رَبِّكَ", isCorrect: false }, { text: "الأَعْلَى", isCorrect: false }],
  },
  {
    id: "jz_ala_2", surahAr: "الأعلى", surahEn: "Al-A'la",
    targetWord: "الأَعْلَى",
    targetWordMeaning: "The Most High",
    targetWordTranslations: { en: "The Most High", ar: "الأرفع الأسمى", id: "Yang Maha Tinggi", tr: "En Yüce", zh: "至高者", sw: "Aliye Juu Zaidi", so: "Ugu Sarreeya", bs: "Uzvišeni", sq: "Shumë i Larti", ru: "Всевышний", ur: "سب سے بلند", bn: "সর্বোচ্চ", ms: "Yang Maha Tinggi" },
    correctVerseMeaningTranslations: { en: "Glorify the name of your Lord, the Most High", ar: "سبّح اسم ربك الأعلى", id: "Sucikanlah nama Tuhanmu yang Maha Tinggi", tr: "Yüce Rabbinin adını tesbih et", zh: "你当赞美你至高之主的名", sw: "Tukuza jina la Mola wako Mtukufu", so: "U Sabbaaxo magaca Rabbigaa ugu Sarreeya", bs: "Slavi ime svoga Gospodara, Uzvišenog", sq: "Lartëso emrin e Zotit tënd, Shumë të Lartit", ru: "Прославляй имя Господа Твоего Всевышнего", ur: "اپنے رب اعلیٰ کے نام کی تسبیح کرو", bn: "তোমার মহান রবের নাম পবিত্র ঘোষণা কর", ms: "Bertasbihlah dengan nama Tuhanmu Yang Maha Tinggi" },
    surahAyah: "الأعلى:1", ayahNumber: 1,
    hint: "صفة الله — الأرفع فوق كل شيء",
    correctVerse: "سَبِّحِ اسْمَ رَبِّكَ الأَعْلَى",
    correctVerseMeaning: "Glorify the name of your Lord, the Most High",
    options: [{ text: "الأَعْلَى", isCorrect: true }, { text: "الرَّحْمَنُ", isCorrect: false }, { text: "الْعَلِيمُ", isCorrect: false }, { text: "الْغَفُورُ", isCorrect: false }],
  },
  {
    id: "jz_ala_3", surahAr: "الأعلى", surahEn: "Al-A'la",
    targetWord: "يَتَذَكَّرُ",
    targetWordMeaning: "Will Be Reminded / Remember",
    targetWordTranslations: { en: "Will Be Reminded / Remember", ar: "سيتذكر ويتّعظ", id: "Akan mengingat / mendapat peringatan", tr: "Hatırlayacak / Öğüt alacak", zh: "会铭记/领悟", sw: "Atakapokumbuka", so: "Ka xasuusanaya", bs: "Podsjetit će se", sq: "Do të kujtojë", ru: "Запомнит / Вспомнит", ur: "یاد کرے گا / عبرت لے گا", bn: "স্মরণ করবে", ms: "Akan mengingati" },
    correctVerseMeaningTranslations: { en: "The reminder will benefit whoever fears Allah", ar: "سيذّكر من يخشى", id: "Orang yang takut kepada Allah akan mengambil pelajaran", tr: "Allah'tan korkan öğüt alır", zh: "有所敬畏者会从中得益", sw: "Atakapokumbuka anayemcha Allah", so: "Kun baqayaa baa xasuusanaya", bs: "Ko se boji Allaha, podsjetit će se", sq: "Do të kujtojë ai që frikësohet prej Allahut", ru: "Напоминание принесёт пользу тому, кто боится", ur: "جو ڈرے گا وہ نصیحت پکڑے گا", bn: "যে ভয় করে সে স্মরণ করবে", ms: "Dia akan mengingat siapa yang takutkan Allah" },
    surahAyah: "الأعلى:10", ayahNumber: 10,
    hint: "استيعاب الدرس والاتعاظ به",
    correctVerse: "سَيَذَّكَّرُ مَن يَخْشَى",
    correctVerseMeaning: "The reminder will benefit whoever fears Allah",
    options: [{ text: "يَتَذَكَّرُ", isCorrect: true }, { text: "يَخْشَى", isCorrect: false }, { text: "يُصَلِّي", isCorrect: false }, { text: "يَزَّكَّى", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-GHASHIYAH (سورة الغاشية) — 88
  // ═══════════════════════════════════════
  {
    id: "jz_ghashiyah_1", surahAr: "الغاشية", surahEn: "Al-Ghashiyah",
    targetWord: "الْغَاشِيَةُ",
    targetWordMeaning: "The Overwhelming Event",
    targetWordTranslations: { en: "The Overwhelming Event (Day of Judgment)", ar: "الحادثة التي تغشى الناس", id: "Hari Kiamat yang Menyelubungi", tr: "Her Şeyi Kaplayan Gün (Kıyamet)", zh: "笼罩一切的大事（审判日）", sw: "Tukio Kubwa (Siku ya Hukumu)", so: "Dhacdada Xukunkeed (Qiyaama)", bs: "Kobni dan (Sudnji)", sq: "Ngjarja Mbizotëruese (Dita e Gjykimit)", ru: "Всепокрывающее событие (Судный день)", ur: "سب کو ڈھانپ لینے والا (قیامت)", bn: "সর্বগ্রাসী ঘটনা (কিয়ামত)", ms: "Peristiwa yang Menyelubungi (Hari Kiamat)" },
    correctVerseMeaningTranslations: { en: "Has there come to you the report of the Overwhelming Event", ar: "هل أتاك حديث الغاشية", id: "Sudahkah datang kepadamu berita tentang Hari Kiamat", tr: "Sana her şeyi kaplayan günün haberi geldi mi", zh: "你听说那笼罩一切的大事了吗", sw: "Je, imekujia habari ya Tukio Kubwa", so: "Miyaadan maqlin Wariyaha Gaaditaanka", bs: "Zar ti nije stigla vijest o Sudnjem danu", sq: "A të erdhi lajmi i Ngjarjes mbizotëruese", ru: "Разве не дошёл до тебя рассказ о Всепокрывающем", ur: "کیا تمہارے پاس ڈھانپ لینے والے کی خبر آئی", bn: "তোমার কাছে কি সর্বগ্রাসী ঘটনার সংবাদ এসেছে", ms: "Sudahkah datang kepadamu berita tentang Peristiwa yang Menyelubungi" },
    surahAyah: "الغاشية:1", ayahNumber: 1,
    hint: "اسم ليوم القيامة لأنه يغشى الناس بأهواله",
    correctVerse: "هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ",
    correctVerseMeaning: "Has there come to you the report of the Overwhelming Event",
    options: [{ text: "الْغَاشِيَةُ", isCorrect: true }, { text: "الطَّامَّةُ", isCorrect: false }, { text: "الْقَارِعَةُ", isCorrect: false }, { text: "الزَّلْزَلَةُ", isCorrect: false }],
  },
  {
    id: "jz_ghashiyah_2", surahAr: "الغاشية", surahEn: "Al-Ghashiyah",
    targetWord: "خَاشِعَةٌ",
    targetWordMeaning: "Humbled / Downcast",
    targetWordTranslations: { en: "Humbled / Downcast", ar: "ذليلة خاضعة", id: "Tunduk / Merendah", tr: "Alçalmış / Boyun Eğmiş", zh: "卑屈的/俯首的", sw: "Anyenyekevu", so: "Hooseeya", bs: "Ponizna / Poklonjena", sq: "E nënshtruar / E ulur", ru: "Смиренный / Унижённый", ur: "ذلیل و خوار", bn: "বিনম্র/অবনত", ms: "Tunduk / Hina" },
    correctVerseMeaningTranslations: { en: "Faces that Day will be humbled", ar: "وجوه يومئذٍ خاشعة", id: "Pada hari itu banyak wajah yang tunduk", tr: "O gün yüzler alçalmış olacak", zh: "那日，许多面孔是卑屈的", sw: "Nyuso zitakazokuwa zimeonyenyekea Siku hiyo", so: "Wajiyaasha maalintaas waa hooseeyayaan", bs: "Lica toga dana bit će ponizna", sq: "Fytyrat atë Ditë do të jenë të nënshtruara", ru: "В тот день лица будут смиренными", ur: "اس دن بہت سے چہرے ذلیل ہوں گے", bn: "সেদিন অনেক মুখ হবে অবনত", ms: "Pada hari itu banyak wajah yang tunduk" },
    surahAyah: "الغاشية:2", ayahNumber: 2,
    hint: "من يطأطئ رأسه ذلاً وخضوعاً",
    correctVerse: "وُجُوهٌ يَوْمَئِذٍ خَاشِعَةٌ",
    correctVerseMeaning: "Faces that Day will be humbled",
    options: [{ text: "خَاشِعَةٌ", isCorrect: true }, { text: "نَاضِرَةٌ", isCorrect: false }, { text: "مُسْفِرَةٌ", isCorrect: false }, { text: "بَاسِرَةٌ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-FAJR (سورة الفجر) — 89
  // ═══════════════════════════════════════
  {
    id: "jz_fajr_1", surahAr: "الفجر", surahEn: "Al-Fajr",
    targetWord: "الْفَجْرِ",
    targetWordMeaning: "The Dawn",
    targetWordTranslations: { en: "The Dawn", ar: "الفجر — أول ضوء الصباح", id: "Fajar", tr: "Şafak", zh: "黎明", sw: "Alfajiri", so: "Subaxnimadii", bs: "Zora", sq: "Agimi", ru: "Заря / Рассвет", ur: "فجر صبح کا وقت", bn: "ভোর", ms: "Fajar" },
    correctVerseMeaningTranslations: { en: "By the dawn", ar: "والفجر", id: "Demi fajar", tr: "Şafağa yemin olsun", zh: "以黎明为誓", sw: "Naapa kwa alfajiri", so: "Subaxnimadii waan ku dhaartay", bs: "Tako mi zore", sq: "Betohem në agim", ru: "Клянусь зарёй", ur: "قسم ہے فجر کی", bn: "ভোরের শপথ", ms: "Demi fajar" },
    surahAyah: "الفجر:1", ayahNumber: 1,
    hint: "أول ضوء يظهر في الأفق عند طلوع الصبح",
    correctVerse: "وَالْفَجْرِ",
    correctVerseMeaning: "By the dawn",
    options: [{ text: "الْفَجْرِ", isCorrect: true }, { text: "اللَّيْلِ", isCorrect: false }, { text: "الشَّمْسِ", isCorrect: false }, { text: "الصُّبْحِ", isCorrect: false }],
  },
  {
    id: "jz_fajr_2", surahAr: "الفجر", surahEn: "Al-Fajr",
    targetWord: "الْمُطْمَئِنَّةُ",
    targetWordMeaning: "The Tranquil / At-Peace Soul",
    targetWordTranslations: { en: "The Tranquil / At-Peace Soul", ar: "النفس المطمئنة الساكنة", id: "Jiwa yang tenang", tr: "Huzurlu Nefis", zh: "安宁的灵魂", sw: "Nafsi Iliyotulia", so: "Naftii Xasillooneed", bs: "Smirena duša", sq: "Shpirti i qetë", ru: "Спокойная душа", ur: "مطمئن نفس", bn: "প্রশান্ত আত্মা", ms: "Jiwa yang tenang" },
    correctVerseMeaningTranslations: { en: "O tranquil soul", ar: "يا أيتها النفس المطمئنة", id: "Wahai jiwa yang tenang", tr: "Ey huzurlu nefis", zh: "啊，安宁的灵魂", sw: "Ewe nafsi iliyotulia", so: "Naftii Xasilloon", bs: "O smirena dušo", sq: "O shpirt i qetë", ru: "О душа успокоившаяся", ur: "اے اطمینان والی روح", bn: "হে প্রশান্ত আত্মা", ms: "Wahai jiwa yang tenang" },
    surahAyah: "الفجر:27", ayahNumber: 27,
    hint: "النفس التي وجدت سكينتها وراحتها في طاعة الله",
    correctVerse: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
    correctVerseMeaning: "O tranquil soul",
    options: [{ text: "الْمُطْمَئِنَّةُ", isCorrect: true }, { text: "النَّفْسُ", isCorrect: false }, { text: "الرَّاضِيَةُ", isCorrect: false }, { text: "الْمَرْضِيَّةُ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-BALAD (سورة البلد) — 90
  // ═══════════════════════════════════════
  {
    id: "jz_balad_1", surahAr: "البلد", surahEn: "Al-Balad",
    targetWord: "الْبَلَدِ",
    targetWordMeaning: "The City / Land",
    targetWordTranslations: { en: "The City / Land", ar: "البلد — المدينة أو الأرض", id: "Kota / Negeri", tr: "Şehir / Ülke", zh: "城市/大地", sw: "Mji / Nchi", so: "Magaalada", bs: "Grad / Zemlja", sq: "Qyteti / Vendi", ru: "Город / Земля", ur: "شہر/ملک", bn: "শহর/দেশ", ms: "Bandar / Negeri" },
    correctVerseMeaningTranslations: { en: "I swear by this city", ar: "لا أقسم بهذا البلد", id: "Aku bersumpah dengan kota ini", tr: "Bu şehre yemin ederim", zh: "我以这座城市为誓", sw: "Naapa kwa mji huu", so: "Baladkan baan ku dhaartay", bs: "Kunem se ovim gradom", sq: "Betohem në këtë qytet", ru: "Клянусь этим городом", ur: "میں اس شہر کی قسم کھاتا ہوں", bn: "আমি এই শহরের শপথ করছি", ms: "Aku bersumpah dengan bandar ini" },
    surahAyah: "البلد:1", ayahNumber: 1,
    hint: "المكة المكرمة المقصودة بهذا القسم",
    correctVerse: "لا أُقْسِمُ بِهَذَا الْبَلَدِ",
    correctVerseMeaning: "I swear by this city",
    options: [{ text: "الْبَلَدِ", isCorrect: true }, { text: "الرَّحِيمِ", isCorrect: false }, { text: "الْعَقَبَةِ", isCorrect: false }, { text: "الْمَسْجِدِ", isCorrect: false }],
  },
  {
    id: "jz_balad_2", surahAr: "البلد", surahEn: "Al-Balad",
    targetWord: "الْعَقَبَةَ",
    targetWordMeaning: "The Steep Path",
    targetWordTranslations: { en: "The Steep Path / Difficult Ascent", ar: "الطريق الشاقة الصعود", id: "Jalan yang terjal", tr: "Sarp Yokuş / Zor Geçit", zh: "险峻的山路", sw: "Njia ngumu", so: "Jidka adag", bs: "Strm uspon", sq: "Ngushtica / Rruga e vështirë", ru: "Крутой перевал", ur: "دشوار گھاٹی", bn: "দুর্গম পথ", ms: "Jalan yang terjal" },
    correctVerseMeaningTranslations: { en: "But he has not attempted the steep path", ar: "فلا اقتحم العقبة", id: "Tapi dia tidak menempuh jalan yang terjal", tr: "Ama o sarp yokuşa girmedi", zh: "但他没有尝试那险峻的山路", sw: "Lakini hakujaribu njia ngumu", so: "Laakiin kuma gelin jidka adag", bs: "Ali nije pokušao savladati strmi uspon", sq: "Por nuk u përpoq të ngjasë ngushticën", ru: "Но не вступил он на крутой перевал", ur: "لیکن اس نے گھاٹی نہیں چڑھی", bn: "কিন্তু সে দুর্গম পথ অতিক্রম করেনি", ms: "Namun dia tidak menempuh jalan yang terjal" },
    surahAyah: "البلد:11", ayahNumber: 11,
    hint: "الطريق الصعب الشاق الذي يتجنبه الضعفاء",
    correctVerse: "فَلا اقْتَحَمَ الْعَقَبَةَ",
    correctVerseMeaning: "But he has not attempted the steep path",
    options: [{ text: "الْعَقَبَةَ", isCorrect: true }, { text: "الرَّقَبَةَ", isCorrect: false }, { text: "الصَّدَقَةَ", isCorrect: false }, { text: "الْمَسْكَنَةَ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // ASH-SHAMS (سورة الشمس) — 91
  // ═══════════════════════════════════════
  {
    id: "jz_shams_1", surahAr: "الشمس", surahEn: "Ash-Shams",
    targetWord: "الشَّمْسِ",
    targetWordMeaning: "The Sun",
    targetWordTranslations: { en: "The Sun", ar: "الشمس", id: "Matahari", tr: "Güneş", zh: "太阳", sw: "Jua", so: "Qorraxda", bs: "Sunce", sq: "Dielli", ru: "Солнце", ur: "سورج", bn: "সূর্য", ms: "Matahari" },
    correctVerseMeaningTranslations: { en: "By the sun and its brightness", ar: "والشمس وضحاها", id: "Demi matahari dan cahayanya", tr: "Güneşe ve ışığına yemin olsun", zh: "以太阳及其光辉为誓", sw: "Naapa kwa jua na mwangaza wake", so: "Qorraxda iyo dhalaalkeeda", bs: "Tako mi sunca i sjaja njegova", sq: "Betohem në diell dhe ndriçimin e tij", ru: "Клянусь солнцем и его сиянием", ur: "قسم ہے سورج کی اور اس کی روشنی کی", bn: "সূর্য ও তার দীপ্তির শপথ", ms: "Demi matahari dan cahayanya" },
    surahAyah: "الشمس:1", ayahNumber: 1,
    hint: "النجم الأكبر الذي يضيء النهار",
    correctVerse: "وَالشَّمْسِ وَضُحَاهَا",
    correctVerseMeaning: "By the sun and its brightness",
    options: [{ text: "الشَّمْسِ", isCorrect: true }, { text: "ضُحَاهَا", isCorrect: false }, { text: "الْقَمَرِ", isCorrect: false }, { text: "النَّهَارِ", isCorrect: false }],
  },
  {
    id: "jz_shams_2", surahAr: "الشمس", surahEn: "Ash-Shams",
    targetWord: "زَكَّاهَا",
    targetWordMeaning: "Purified It",
    targetWordTranslations: { en: "Purified It (the soul)", ar: "طهّرها من الذنوب", id: "Mensucikannya (jiwa)", tr: "Onu Arındırdı (nefsi)", zh: "纯洁了它（灵魂）", sw: "Alitakasa (nafsi)", so: "Nadiifiyay (naftaa)", bs: "Pročistio je (dušu)", sq: "E pastroi atë (shpirtin)", ru: "Очистил её (душу)", ur: "اسے پاک کیا (نفس کو)", bn: "তাকে পবিত্র করেছে (আত্মাকে)", ms: "Menyucikannya (jiwa)" },
    correctVerseMeaningTranslations: { en: "He has succeeded who purifies it", ar: "قد أفلح من زكاها", id: "Sungguh beruntung orang yang menyucikan jiwa", tr: "Onu arındıran gerçekten kurtuluşa erdi", zh: "确实，净化了它的人获得了成功", sw: "Amefanikiwa aliyeitakasa nafsi", so: "Wuu guulaysatay kii nadiifiyay naftaas", bs: "Uspjeo je onaj ko je očistio svoju dušu", sq: "Ka shpëtuar ai që e ka pastruar atë", ru: "Преуспел тот, кто очищает её", ur: "بے شک وہ کامیاب ہوا جس نے اسے پاک کیا", bn: "সে সফল হয়েছে যে তাকে পবিত্র করেছে", ms: "Sesungguhnya beruntunglah orang yang menyucikan jiwa" },
    surahAyah: "الشمس:9", ayahNumber: 9,
    hint: "تطهير النفس من المعاصي والذنوب",
    correctVerse: "قَدْ أَفْلَحَ مَن زَكَّاهَا",
    correctVerseMeaning: "He has succeeded who purifies it",
    options: [{ text: "زَكَّاهَا", isCorrect: true }, { text: "أَفْلَحَ", isCorrect: false }, { text: "دَسَّاهَا", isCorrect: false }, { text: "سَوَّاهَا", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-LAYL (سورة الليل) — 92
  // ═══════════════════════════════════════
  {
    id: "jz_layl_1", surahAr: "الليل", surahEn: "Al-Layl",
    targetWord: "اللَّيْلِ",
    targetWordMeaning: "The Night",
    targetWordTranslations: { en: "The Night", ar: "الليل — وقت الظلام", id: "Malam", tr: "Gece", zh: "夜晚", sw: "Usiku", so: "Habeenka", bs: "Noć", sq: "Nata", ru: "Ночь", ur: "رات", bn: "রাত", ms: "Malam" },
    correctVerseMeaningTranslations: { en: "By the night when it covers", ar: "والليل إذا يغشى", id: "Demi malam apabila menutupi", tr: "Örttüğünde geceye yemin olsun", zh: "以夜幕覆盖时为誓", sw: "Naapa kwa usiku unapoufunika", so: "Habeenka uu dabooli markuu", bs: "Tako mi noći kada pokrije", sq: "Betohem në natën kur mbulon", ru: "Клянусь ночью, когда она покрывает", ur: "قسم ہے رات کی جب ڈھانپ لے", bn: "রাতের শপথ যখন সে আচ্ছাদিত করে", ms: "Demi malam apabila menutupi" },
    surahAyah: "الليل:1", ayahNumber: 1,
    hint: "وقت الظلام والسكون",
    correctVerse: "وَاللَّيْلِ إِذَا يَغْشَى",
    correctVerseMeaning: "By the night when it covers",
    options: [{ text: "اللَّيْلِ", isCorrect: true }, { text: "النَّهَارِ", isCorrect: false }, { text: "الْفَجْرِ", isCorrect: false }, { text: "الشَّمْسِ", isCorrect: false }],
  },
  {
    id: "jz_layl_2", surahAr: "الليل", surahEn: "Al-Layl",
    targetWord: "الْعُسْرَى",
    targetWordMeaning: "The Difficult Way",
    targetWordTranslations: { en: "The Difficult Way", ar: "الطريق الصعبة العسيرة", id: "Jalan yang sukar", tr: "Zor Yol", zh: "艰难之路", sw: "Njia ngumu", so: "Jidka adag", bs: "Teški put", sq: "Rruga e vështirë", ru: "Трудный путь", ur: "مشکل راستہ", bn: "কঠিন পথ", ms: "Jalan yang sukar" },
    correctVerseMeaningTranslations: { en: "We will ease him toward difficulty", ar: "فسنيسّره للعسرى", id: "Maka Kami akan memudahkannya menuju jalan yang sukar", tr: "Onu zor yola kolaylaştıracağız", zh: "我将使他通向艰难之路", sw: "Tutamfanyia rahisi njia ngumu", so: "Jidka adag waan u sahlan doonaa", bs: "Olakšat ćemo mu teški put", sq: "Do t'ia lehtësojmë rrugën e vështirë", ru: "Мы облегчим ему трудный путь", ur: "تو ہم اسے سخت راستے کے لیے آسان کریں گے", bn: "তখন আমি তার জন্য কঠিন পথ সহজ করব", ms: "Maka Kami akan mudahkan dia menuju jalan yang sukar" },
    surahAyah: "الليل:10", ayahNumber: 10,
    hint: "ضد اليُسرى — ما يصعب على الإنسان",
    correctVerse: "فَسَنُيَسِّرُهُ لِلْعُسْرَى",
    correctVerseMeaning: "We will ease him toward difficulty",
    options: [{ text: "الْعُسْرَى", isCorrect: true }, { text: "الْيُسْرَى", isCorrect: false }, { text: "الأُخْرَى", isCorrect: false }, { text: "الْكُبْرَى", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AD-DUHA (سورة الضحى) — 93
  // ═══════════════════════════════════════
  {
    id: "jz_duha_1", surahAr: "الضحى", surahEn: "Ad-Duha",
    targetWord: "الضُّحَى",
    targetWordMeaning: "The Morning Brightness",
    targetWordTranslations: { en: "The Morning Brightness", ar: "ضوء الضحى الصباحي", id: "Cahaya pagi", tr: "Kuşluk Vakti Işığı", zh: "上午的阳光", sw: "Mwanga wa Asubuhi", so: "Duhurnimadii", bs: "Jutarnja svjetlost", sq: "Shkëlqimi i Mëngjesit", ru: "Утреннее сияние", ur: "چاشت کی روشنی", bn: "সকালের আলো", ms: "Cahaya Pagi" },
    correctVerseMeaningTranslations: { en: "By the morning brightness", ar: "والضحى", id: "Demi waktu cahaya pagi", tr: "Kuşluk vaktine yemin olsun", zh: "以上午的阳光为誓", sw: "Naapa kwa mwanga wa asubuhi", so: "Duhurnimadii baan ku dhaartay", bs: "Tako mi jutra", sq: "Betohem në shkëlqimin e mëngjesit", ru: "Клянусь утренним сиянием", ur: "قسم ہے چاشت کی", bn: "সকালের আলোর শপথ", ms: "Demi cahaya pagi" },
    surahAyah: "الضحى:1", ayahNumber: 1,
    hint: "وقت الصباح حين تشتد الشمس قليلاً",
    correctVerse: "وَالضُّحَى",
    correctVerseMeaning: "By the morning brightness",
    options: [{ text: "الضُّحَى", isCorrect: true }, { text: "الْفَجْرِ", isCorrect: false }, { text: "اللَّيْلِ", isCorrect: false }, { text: "الشَّمْسِ", isCorrect: false }],
  },
  {
    id: "jz_duha_2", surahAr: "الضحى", surahEn: "Ad-Duha",
    targetWord: "عَائِلًا",
    targetWordMeaning: "Poor / In Need",
    targetWordTranslations: { en: "Poor / In Need", ar: "فقيراً محتاجاً", id: "Miskin / Membutuhkan", tr: "Fakir / Muhtaç", zh: "贫穷/匮乏", sw: "Maskini / Mhitaji", so: "Sabool", bs: "Siromašan / Potrebit", sq: "I varfër / Nevojtar", ru: "Бедный / Нуждающийся", ur: "غریب محتاج", bn: "দরিদ্র/অভাবী", ms: "Miskin / Memerlukan" },
    correctVerseMeaningTranslations: { en: "And He found you poor and made you self-sufficient", ar: "ووجدك عائلاً فأغنى", id: "Dan Dia mendapatimu miskin lalu membuatmu berkecukupan", tr: "Seni fakir buldu ve zengin etti", zh: "他发现你贫穷并使你自足", sw: "Akakukuta maskini na akakufanya tajiri", so: "Waana kugu helay oo aad sabool ahayd oo wuu ku hodmiyay", bs: "I našao te siromašnim i učinio te bogatim", sq: "Dhe të gjeti të varfër dhe të bëri të vetëmjaftueshëm", ru: "И нашёл тебя бедным и обогатил тебя", ur: "اور اس نے تمہیں محتاج پایا اور غنی کر دیا", bn: "তিনি তোমাকে দরিদ্র পেয়েছিলেন এবং স্বনির্ভর করেছেন", ms: "Dan Dia mendapatimu miskin lalu Dia mencukupkanmu" },
    surahAyah: "الضحى:8", ayahNumber: 8,
    hint: "من لا يملك ما يكفيه من المال",
    correctVerse: "وَوَجَدَكَ عَائِلًا فَأَغْنَى",
    correctVerseMeaning: "And He found you poor and made you self-sufficient",
    options: [{ text: "عَائِلًا", isCorrect: true }, { text: "ضَالًّا", isCorrect: false }, { text: "يَتِيمًا", isCorrect: false }, { text: "غَنِيًّا", isCorrect: false }],
  },
  {
    id: "jz_duha_3", surahAr: "الضحى", surahEn: "Ad-Duha",
    targetWord: "يَتِيمًا",
    targetWordMeaning: "An Orphan",
    targetWordTranslations: { en: "An Orphan", ar: "من فقد أباه صغيراً", id: "Anak yatim", tr: "Yetim", zh: "孤儿", sw: "Yatima", so: "Agoonta", bs: "Siroče", sq: "Jetim", ru: "Сирота", ur: "یتیم", bn: "অনাথ", ms: "Anak yatim" },
    correctVerseMeaningTranslations: { en: "Did He not find you an orphan and gave you refuge", ar: "ألم يجدك يتيماً فآوى", id: "Bukankah Dia mendapatimu sebagai anak yatim lalu Dia melindungimu", tr: "Seni yetim bulup barındırmadı mı", zh: "他不是发现你是孤儿并给了你庇护吗", sw: "Je, hakukupata yatima na kukupa mahali pa kukaa", so: "Kuma helin yatim wuuna ku dhawray", bs: "Zar te nije našao sirotom i dao ti utočište", sq: "A nuk të gjeti jetim dhe të dha strehë", ru: "Разве Он не нашёл тебя сиротой и не дал тебе приют", ur: "کیا اس نے تمہیں یتیم نہیں پایا اور پھر آسرا دیا", bn: "তিনি কি তোমাকে অনাথ পাননি এবং আশ্রয় দেননি", ms: "Bukankah Dia mendapatimu yatim piatu lalu Dia melindungimu" },
    surahAyah: "الضحى:6", ayahNumber: 6,
    hint: "الطفل الذي مات أبوه",
    correctVerse: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَى",
    correctVerseMeaning: "Did He not find you an orphan and gave you refuge",
    options: [{ text: "يَتِيمًا", isCorrect: true }, { text: "ضَالًّا", isCorrect: false }, { text: "عَائِلًا", isCorrect: false }, { text: "صَغِيرًا", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // ASH-SHARH / AL-INSHIRAH (سورة الشرح) — 94
  // ═══════════════════════════════════════
  {
    id: "jz_sharh_1", surahAr: "الشرح", surahEn: "Ash-Sharh",
    targetWord: "صَدْرَكَ",
    targetWordMeaning: "Your Breast / Chest",
    targetWordTranslations: { en: "Your Breast / Chest", ar: "صدرك — قلبك", id: "Dadamu", tr: "Göğsünü / Kalbini", zh: "你的胸膛/心灵", sw: "Kifua chako", so: "Laabtagaada", bs: "Tvoja prsa / Tvoje srce", sq: "Gjoksin tënd", ru: "Твою грудь / Твоё сердце", ur: "تیرا سینہ", bn: "তোমার বুক/হৃদয়", ms: "Dadamu" },
    correctVerseMeaningTranslations: { en: "Did We not expand for you your breast", ar: "ألم نشرح لك صدرك", id: "Bukankah Kami telah melapangkan dadamu", tr: "Göğsünü sana açmadık mı", zh: "我们没有为你开拓你的胸膛吗", sw: "Je, hatukupanua kifua chako", so: "Miyaan kugu fur-furin laabtagaada", bs: "Zar ti nismo otvorili prsa", sq: "A nuk ta zgjeruam gjoksin", ru: "Разве не раскрыли Мы тебе грудь", ur: "کیا ہم نے تیرا سینہ کھول نہیں دیا", bn: "আমি কি তোমার বুক প্রশস্ত করিনি", ms: "Bukankah Kami telah melapangkan dadamu" },
    surahAyah: "الشرح:1", ayahNumber: 1,
    hint: "موضع القلب — رمز للفهم والإدراك",
    correctVerse: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
    correctVerseMeaning: "Did We not expand for you your breast",
    options: [{ text: "صَدْرَكَ", isCorrect: true }, { text: "وِزْرَكَ", isCorrect: false }, { text: "ذِكْرَكَ", isCorrect: false }, { text: "أَمْرَكَ", isCorrect: false }],
  },
  {
    id: "jz_sharh_2", surahAr: "الشرح", surahEn: "Ash-Sharh",
    targetWord: "الْيُسْرَ",
    targetWordMeaning: "Ease / Relief",
    targetWordTranslations: { en: "Ease / Relief", ar: "السهولة والتيسير", id: "Kemudahan", tr: "Kolaylık", zh: "轻松/宽裕", sw: "Urahisi", so: "Fududaanta", bs: "Lahkoća", sq: "Lehtësi", ru: "Лёгкость / Облегчение", ur: "آسانی", bn: "সহজতা", ms: "Kemudahan" },
    correctVerseMeaningTranslations: { en: "Indeed with hardship comes ease", ar: "فإن مع العسر يسراً", id: "Sesungguhnya bersama kesulitan ada kemudahan", tr: "Gerçekten güçlükle birlikte kolaylık vardır", zh: "确实，困难之后必有容易", sw: "Hakika pamoja na ugumu kuna urahisi", so: "Runtii adkaanshaha waxaa la socda fududaanta", bs: "Zaista s teškoćom je lahkoća", sq: "Me të vërtetë, me vështirësinë është lehtësia", ru: "Воистину, с каждой тяготой приходит облегчение", ur: "بے شک مشکل کے ساتھ آسانی ہے", bn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে", ms: "Sesungguhnya bersama kesulitan ada kemudahan" },
    surahAyah: "الشرح:5", ayahNumber: 5,
    hint: "ضد العُسر — كل ما هو سهل وميسّر",
    correctVerse: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    correctVerseMeaning: "Indeed with hardship comes ease",
    options: [{ text: "الْيُسْرَ", isCorrect: true }, { text: "الْعُسْرَ", isCorrect: false }, { text: "الصَّبْرَ", isCorrect: false }, { text: "الأَجْرَ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AT-TIN (سورة التين) — 95
  // ═══════════════════════════════════════
  {
    id: "jz_tin_1", surahAr: "التين", surahEn: "At-Tin",
    targetWord: "التِّينِ",
    targetWordMeaning: "The Fig",
    targetWordTranslations: { en: "The Fig", ar: "التينة — الفاكهة المعروفة", id: "Buah Tin", tr: "İncir", zh: "无花果", sw: "Tini", so: "Xabxab", bs: "Smokva", sq: "Fiku", ru: "Инжир", ur: "انجیر", bn: "ডুমুর", ms: "Buah Tin" },
    correctVerseMeaningTranslations: { en: "By the fig and the olive", ar: "والتين والزيتون", id: "Demi buah tin dan zaitun", tr: "İncire ve zeytine yemin olsun", zh: "以无花果和橄榄为誓", sw: "Naapa kwa tini na zeituni", so: "Xabxabka iyo Saytuunka baan ku dhaartay", bs: "Tako mi smokve i masline", sq: "Betohem në fikun dhe ullirin", ru: "Клянусь инжиром и оливой", ur: "قسم ہے انجیر اور زیتون کی", bn: "ডুমুর ও জিতুনের শপথ", ms: "Demi buah tin dan zaitun" },
    surahAyah: "التين:1", ayahNumber: 1,
    hint: "فاكهة حلوة كثيرة الفوائد الصحية",
    correctVerse: "وَالتِّينِ وَالزَّيْتُونِ",
    correctVerseMeaning: "By the fig and the olive",
    options: [{ text: "التِّينِ", isCorrect: true }, { text: "الزَّيْتُونِ", isCorrect: false }, { text: "الرُّمَّانِ", isCorrect: false }, { text: "النَّخْلِ", isCorrect: false }],
  },
  {
    id: "jz_tin_2", surahAr: "التين", surahEn: "At-Tin",
    targetWord: "تَقْوِيمٍ",
    targetWordMeaning: "The Best Stature",
    targetWordTranslations: { en: "The Best Stature / Form", ar: "أحسن صورة واستقامة", id: "Sebaik-baik bentuk", tr: "En güzel biçim", zh: "最完美的形态", sw: "Umbo bora kabisa", so: "Qaab ugu wanaagsan", bs: "Najljepši oblik", sq: "Trajta më e mirë", ru: "Наилучший облик / форма", ur: "بہترین ساخت", bn: "সর্বোত্তম গঠন", ms: "Sebaik-baik rupa bentuk" },
    correctVerseMeaningTranslations: { en: "We have certainly created man in the best of stature", ar: "لقد خلقنا الإنسان في أحسن تقويم", id: "Sesungguhnya Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya", tr: "Gerçekten insanı en güzel biçimde yarattık", zh: "我确实以最完美的形态造化了人", sw: "Hakika tulimuumba mtu katika umbo bora kabisa", so: "Runtii aadanaha waxaan ku abuuray qaabka ugu fiican", bs: "Zaista smo čovjeka stvorili u najljepšem obliku", sq: "Me të vërtetë kemi krijuar njeriun në trajtën më të mirë", ru: "Воистину, Мы создали человека в наилучшем облике", ur: "بے شک ہم نے انسان کو بہترین ساخت میں پیدا کیا", bn: "আমি মানুষকে সর্বোত্তম গঠনে সৃষ্টি করেছি", ms: "Sesungguhnya Kami telah menciptakan manusia dalam sebaik-baik rupa" },
    surahAyah: "التين:4", ayahNumber: 4,
    hint: "الشكل المثالي والاستقامة التي فُطر عليها الإنسان",
    correctVerse: "لَقَدْ خَلَقْنَا الإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
    correctVerseMeaning: "We have certainly created man in the best of stature",
    options: [{ text: "تَقْوِيمٍ", isCorrect: true }, { text: "الإِنسَانَ", isCorrect: false }, { text: "خَلَقْنَا", isCorrect: false }, { text: "أَحْسَنِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-ALAQ (سورة العلق) — 96
  // ═══════════════════════════════════════
  {
    id: "jz_alaq_1", surahAr: "العلق", surahEn: "Al-Alaq",
    targetWord: "اقْرَأْ",
    targetWordMeaning: "Read / Recite",
    targetWordTranslations: { en: "Read / Recite", ar: "اقرأ وتلُ", id: "Bacalah", tr: "Oku", zh: "读/诵", sw: "Soma", so: "Akhriso", bs: "Čitaj / Uči", sq: "Lexo", ru: "Читай / Возглашай", ur: "پڑھو", bn: "পড়ো", ms: "Bacalah" },
    correctVerseMeaningTranslations: { en: "Recite in the name of your Lord who created", ar: "اقرأ باسم ربك الذي خلق", id: "Bacalah dengan nama Tuhanmu yang menciptakan", tr: "Yaratan Rabbinin adıyla oku", zh: "以你创造万物之主的名义诵读", sw: "Soma kwa jina la Mola wako aliyeumba", so: "Rabbigaaga Abuuraha magiciisuu ku akhri", bs: "Čitaj u ime Gospodara svog koji stvara", sq: "Lexo në emrin e Zotit tënd i cili krijoi", ru: "Читай во имя Господа твоего, который создал", ur: "اپنے رب کے نام سے پڑھو جس نے پیدا کیا", bn: "তোমার রবের নামে পড়ো যিনি সৃষ্টি করেছেন", ms: "Bacalah dengan nama Tuhanmu yang menciptakan" },
    surahAyah: "العلق:1", ayahNumber: 1,
    hint: "أول أمر نزل من القرآن الكريم",
    correctVerse: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    correctVerseMeaning: "Recite in the name of your Lord who created",
    options: [{ text: "اقْرَأْ", isCorrect: true }, { text: "خَلَقَ", isCorrect: false }, { text: "بِاسْمِ", isCorrect: false }, { text: "رَبِّكَ", isCorrect: false }],
  },
  {
    id: "jz_alaq_2", surahAr: "العلق", surahEn: "Al-Alaq",
    targetWord: "الْعَلَقِ",
    targetWordMeaning: "A Clot of Blood",
    targetWordTranslations: { en: "A Clot of Blood", ar: "قطعة الدم المتجمّد", id: "Segumpal darah", tr: "Kan pıhtısı", zh: "血块", sw: "Kipande cha damu", so: "Dhiig la-xajin", bs: "Ugrušak krvi", sq: "Një gungë gjaku", ru: "Сгусток крви", ur: "خون کا لوتھڑا", bn: "রক্তের জমাট", ms: "Segupal darah beku" },
    correctVerseMeaningTranslations: { en: "Created man from a clinging clot", ar: "خلق الإنسان من علق", id: "Menciptakan manusia dari segumpal darah", tr: "İnsanı kan pıhtısından yarattı", zh: "用血块创造了人", sw: "Alimuumba mtu kutoka kwa kipande cha damu", so: "Aadanaha dhiig la'xajin ayuu ka abuuray", bs: "Čovjeka je stvorio od ugruška krvi", sq: "Krijoi njeriun nga një gungë gjaku", ru: "Сотворил человека из сгустка крви", ur: "انسان کو خون کے لوتھڑے سے پیدا کیا", bn: "মানুষকে জমাট রক্ত থেকে সৃষ্টি করেছেন", ms: "Menciptakan manusia dari segupal darah" },
    surahAyah: "العلق:2", ayahNumber: 2,
    hint: "مرحلة من مراحل خلق الإنسان في الرحم",
    correctVerse: "خَلَقَ الإِنسَانَ مِنْ عَلَقٍ",
    correctVerseMeaning: "Created man from a clinging clot",
    options: [{ text: "الْعَلَقِ", isCorrect: true }, { text: "الإِنسَانَ", isCorrect: false }, { text: "نُطْفَةٍ", isCorrect: false }, { text: "طِينٍ", isCorrect: false }],
  },
  {
    id: "jz_alaq_3", surahAr: "العلق", surahEn: "Al-Alaq",
    targetWord: "بِالْقَلَمِ",
    targetWordMeaning: "By the Pen",
    targetWordTranslations: { en: "By the Pen", ar: "بواسطة القلم", id: "Dengan pena", tr: "Kalemle", zh: "以笔", sw: "Kwa kalamu", so: "Qalinku", bs: "Perom", sq: "Me pendë", ru: "Пером / Посредством калама", ur: "قلم سے", bn: "কলম দিয়ে", ms: "Dengan pena" },
    correctVerseMeaningTranslations: { en: "Who taught by the pen", ar: "الذي علّم بالقلم", id: "Yang mengajar manusia dengan perantaraan pena", tr: "İnsana kalemle öğretti", zh: "以笔教导人", sw: "Aliyefundisha kwa kalamu", so: "Qalinku buu baray", bs: "Koji je perom podučavao", sq: "Ai që mësoi me pendë", ru: "Который научил посредством калама", ur: "جس نے قلم کے ذریعے علم دیا", bn: "যিনি কলম দিয়ে শিক্ষা দিয়েছেন", ms: "Yang mengajar manusia dengan pena" },
    surahAyah: "العلق:4", ayahNumber: 4,
    hint: "الأداة التي يُكتب بها — رمز العلم",
    correctVerse: "الَّذِي عَلَّمَ بِالْقَلَمِ",
    correctVerseMeaning: "Who taught by the pen",
    options: [{ text: "بِالْقَلَمِ", isCorrect: true }, { text: "الإِنسَانَ", isCorrect: false }, { text: "عَلَّمَ", isCorrect: false }, { text: "اقْرَأْ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-QADR (سورة القدر) — 97
  // ═══════════════════════════════════════
  {
    id: "jz_qadr_1", surahAr: "القدر", surahEn: "Al-Qadr",
    targetWord: "الْقَدْرِ",
    targetWordMeaning: "Power / Decree (Night of Power)",
    targetWordTranslations: { en: "Power / Decree (Night of Power)", ar: "الليلة العظيمة ليلة القدر", id: "Malam Kemuliaan", tr: "Kadir Gecesi (Güç/Kader)", zh: "权能之夜/盖德尔夜", sw: "Usiku wa Nguvu/Heshima", so: "Habeenkii Xukuma", bs: "Moć / Noć Kadr", sq: "Fuqia / Nata e Kadrit", ru: "Ночь могущества / Предопределения", ur: "شب قدر", bn: "শক্তি/ক্ষমতার রাত", ms: "Malam Kemuliaan" },
    correctVerseMeaningTranslations: { en: "Indeed, We sent the Quran down during the Night of Decree", ar: "إنا أنزلناه في ليلة القدر", id: "Sesungguhnya Kami menurunkannya pada Malam Kemuliaan", tr: "Gerçekten biz onu Kadir Gecesinde indirdik", zh: "我确实在权能之夜降下了它", sw: "Hakika, tuliteremsha Quran Usiku wa Nguvu", so: "Runtii waxaan soo dejinay Habeenkii Xukumida", bs: "Zaista, Kur'an smo objavili u noći Kadr", sq: "Me të vërtetë Ne e shpallëm atë në Natën e Kadrit", ru: "Воистину, Мы ниспослали его в Ночь Могущества", ur: "بے شک ہم نے اسے شب قدر میں نازل کیا", bn: "নিশ্চয়ই আমি এটি লাইলাতুল কদরে নাযিল করেছি", ms: "Sesungguhnya Kami menurunkan al-Quran pada Malam Kemuliaan" },
    surahAyah: "القدر:1", ayahNumber: 1,
    hint: "ليلة في رمضان أفضل من ألف شهر",
    correctVerse: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
    correctVerseMeaning: "Indeed, We sent the Quran down during the Night of Decree",
    options: [{ text: "الْقَدْرِ", isCorrect: true }, { text: "الرَّحْمَةِ", isCorrect: false }, { text: "الْبَرَكَةِ", isCorrect: false }, { text: "الْمَغْفِرَةِ", isCorrect: false }],
  },
  {
    id: "jz_qadr_2", surahAr: "القدر", surahEn: "Al-Qadr",
    targetWord: "الرُّوحُ",
    targetWordMeaning: "The Spirit (Jibreel)",
    targetWordTranslations: { en: "The Spirit (Angel Jibreel)", ar: "جبريل عليه السلام", id: "Ruh (Jibril)", tr: "Ruh (Cebrail)", zh: "圣灵（天使吉布里勒）", sw: "Roho (Jibril)", so: "Ruuxa (Jibriil)", bs: "Duh (Džibril)", sq: "Shpirti (Xhibrili)", ru: "Дух (ангел Джибриль)", ur: "روح القدس (جبریل)", bn: "রুহ (জিব্রাইল)", ms: "Ruh (Jibril)" },
    correctVerseMeaningTranslations: { en: "The angels and the Spirit descend therein by permission of their Lord", ar: "تنزّل الملائكة والروح فيها بإذن ربهم", id: "Para malaikat dan Ruh turun di malam itu dengan izin Tuhan mereka", tr: "Melekler ve Ruh, Rabblerinin izniyle iner", zh: "天使和圣灵在那夜奉他们主的命令降临", sw: "Malaika na Roho hushuka usiku huo kwa ruhusa ya Mola wao", so: "Malaa'igaha iyo Ruuxa bay ugu dhacaan habeenkaas", bs: "Meleci i Džibril spuštaju se te noći po dozvoli svog Gospodara", sq: "Engjëjt dhe Shpirti zbresin atë natë me lejen e Zotit të tyre", ru: "В неё нисходят ангелы и Дух с позволения их Господа", ur: "فرشتے اور روح اس میں اپنے رب کی اجازت سے اترتے ہیں", bn: "তাতে ফেরেশতা ও রূহ তাদের রবের অনুমতিক্রমে অবতীর্ণ হয়", ms: "Para malaikat dan Ruh turun padanya dengan izin Tuhan mereka" },
    surahAyah: "القدر:4", ayahNumber: 4,
    hint: "جبريل عليه السلام — يُسمّى بالروح",
    correctVerse: "تَنَزَّلُ الْمَلائِكَةُ وَالرُّوحُ فِيهَا",
    correctVerseMeaning: "The angels and the Spirit descend therein",
    options: [{ text: "الرُّوحُ", isCorrect: true }, { text: "الْمَلائِكَةُ", isCorrect: false }, { text: "الْقَدْرُ", isCorrect: false }, { text: "السَّلامُ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-BAYYINAH (سورة البيّنة) — 98
  // ═══════════════════════════════════════
  {
    id: "jz_bayyinah_1", surahAr: "البيّنة", surahEn: "Al-Bayyinah",
    targetWord: "الْبَيِّنَةُ",
    targetWordMeaning: "The Clear Proof / Evidence",
    targetWordTranslations: { en: "The Clear Proof / Evidence", ar: "الدليل الواضح البيّن", id: "Bukti nyata", tr: "Açık delil / Kanıt", zh: "明确的证明", sw: "Ushahidi Wazi", so: "Caddaynta Cad", bs: "Jasni dokaz", sq: "Dëshmi e qartë", ru: "Ясное доказательство", ur: "واضح دلیل", bn: "স্পষ্ট প্রমাণ", ms: "Bukti yang nyata" },
    correctVerseMeaningTranslations: { en: "Those who disbelieved were not to be separated until the clear proof came to them", ar: "لم يكن الذين كفروا منفكين حتى تأتيهم البينة", id: "Orang-orang kafir tidak akan meninggalkan kekafirannya sampai datang kepada mereka bukti yang nyata", tr: "Kâfirler, kendilerine açık delil gelinceye kadar küfürden ayrılacak değillerdi", zh: "不信道者在获得明确证明之前是不会放弃的", sw: "Wale waliokufuru hawakuwa watatengana mpaka ushahidi wazi uwafikie", so: "Kuwa Gaaloobay uma bixin lahayn xaaladdooda illaa Bayinadda la gaadho", bs: "Nevjernici se nisu namjeravali odreći svog nevjerstva dok im ne dođe jasni dokaz", sq: "Jobesimtarët nuk do të linin mosbesimin derisa të vinte prova e qartë", ru: "Те, кто не уверовали, не отступились бы, пока не пришло к ним ясное доказательство", ur: "کافر الگ نہیں ہوتے تھے جب تک ان کے پاس بیّنہ نہ آ جائے", bn: "কাফিররা বিরত হবে না যতক্ষণ তাদের কাছে স্পষ্ট প্রমাণ না আসে", ms: "Orang-orang kafir tidak akan meninggalkan kesesatannya sehingga datang kepada mereka bukti yang nyata" },
    surahAyah: "البيّنة:1", ayahNumber: 1,
    hint: "الحجة الواضحة التي لا تقبل الشك",
    correctVerse: "حَتَّى تَأْتِيَهُمُ الْبَيِّنَةُ",
    correctVerseMeaning: "Until the clear proof came to them",
    options: [{ text: "الْبَيِّنَةُ", isCorrect: true }, { text: "الآيَةُ", isCorrect: false }, { text: "الرِّسَالَةُ", isCorrect: false }, { text: "الرَّسُولُ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AZ-ZALZALAH (سورة الزلزلة) — 99
  // ═══════════════════════════════════════
  {
    id: "jz_zalzalah_1", surahAr: "الزلزلة", surahEn: "Az-Zalzalah",
    targetWord: "زُلْزِلَتْ",
    targetWordMeaning: "Is Shaken",
    targetWordTranslations: { en: "Is Shaken / Convulsed", ar: "هُزّت واضطربت", id: "Diguncang", tr: "Sarsıldı", zh: "震动", sw: "Ilitikiswa", so: "Gariirtay", bs: "Zatresla se", sq: "U trondit", ru: "Сотрясётся", ur: "ہلا دی گئی", bn: "প্রকম্পিত হল", ms: "Digegarkan" },
    correctVerseMeaningTranslations: { en: "When the earth is shaken with its quake", ar: "إذا زلزلت الأرض زلزالها", id: "Apabila bumi diguncang dengan guncangan yang dahsyat", tr: "Yer şiddetle sarsıldığında", zh: "当大地震动剧烈时", sw: "Ardhi inapotikiswa kwa kutikisika kwake", so: "Dhulkii garir ku gariirtay", bs: "Kada se zemlja zatrese snažnim potresom", sq: "Kur toka të tronditej me tronditjen e saj", ru: "Когда земля сотрясётся своим сотрясением", ur: "جب زمین اپنی زلزلے سے ہلائی جائے گی", bn: "যখন ভূমি তার ভীষণ কম্পনে কাঁপবে", ms: "Apabila bumi digegarkan dengan gegaran yang dahsyat" },
    surahAyah: "الزلزلة:1", ayahNumber: 1,
    hint: "الزلزال — اهتزاز الأرض الشديد",
    correctVerse: "إِذَا زُلْزِلَتِ الأَرْضُ زِلْزَالَهَا",
    correctVerseMeaning: "When the earth is shaken with its quake",
    options: [{ text: "زُلْزِلَتْ", isCorrect: true }, { text: "الأَرْضُ", isCorrect: false }, { text: "انشَقَّتْ", isCorrect: false }, { text: "دُكَّتْ", isCorrect: false }],
  },
  {
    id: "jz_zalzalah_2", surahAr: "الزلزلة", surahEn: "Az-Zalzalah",
    targetWord: "أَثْقَالَهَا",
    targetWordMeaning: "Its Burdens / Heavy Contents",
    targetWordTranslations: { en: "Its Burdens / Heavy Contents", ar: "أحمالها الثقيلة من الموتى", id: "Beban-bebannya", tr: "Ağırlıklarını", zh: "它的重负", sw: "Mizigo yake", so: "Culeyskeedii", bs: "Terete", sq: "Rëndësirat e saj", ru: "Её тяжести", ur: "اس کے بوجھ", bn: "তার ভার", ms: "Beban-bebannya" },
    correctVerseMeaningTranslations: { en: "And the earth discharges its burdens", ar: "وأخرجت الأرض أثقالها", id: "Dan bumi mengeluarkan beban-bebannya", tr: "Yeryüzü ağırlıklarını dışarı attığında", zh: "大地吐出它的重负", sw: "Na ardhi ikitoa mizigo yake", so: "Dhulkiina soo saara culeyskeedii", bs: "I kad zemlja izbaci terete", sq: "Dhe toka të nxjerrë rëndësirat e saj", ru: "И земля извергнет свои тяжести", ur: "اور زمین اپنے بوجھ نکال دے گی", bn: "এবং পৃথিবী তার ভার বের করে দেবে", ms: "Dan bumi mengeluarkan beban-bebannya" },
    surahAyah: "الزلزلة:2", ayahNumber: 2,
    hint: "ما تحمله الأرض من الأموات والكنوز",
    correctVerse: "وَأَخْرَجَتِ الأَرْضُ أَثْقَالَهَا",
    correctVerseMeaning: "And the earth discharges its burdens",
    options: [{ text: "أَثْقَالَهَا", isCorrect: true }, { text: "الأَرْضُ", isCorrect: false }, { text: "زِلْزَالَهَا", isCorrect: false }, { text: "أَخْبَارَهَا", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-ADIYAT (سورة العاديات) — 100
  // ═══════════════════════════════════════
  {
    id: "jz_adiyat_1", surahAr: "العاديات", surahEn: "Al-Adiyat",
    targetWord: "الْعَادِيَاتِ",
    targetWordMeaning: "Those Who Run (Horses)",
    targetWordTranslations: { en: "Those Who Run (War Horses)", ar: "الخيل المسرعة في الجري", id: "Kuda yang berlari kencang", tr: "Koşan atlar", zh: "奔驰的战马", sw: "Farasi wanaokimbia", so: "Farasaha Ordayo", bs: "Konji koji jure", sq: "Kuajt që vrapojnë", ru: "Мчащиеся (боевые кони)", ur: "تیز دوڑنے والے (گھوڑے)", bn: "দৌড়ানো ঘোড়া", ms: "Kuda-kuda yang berlari kencang" },
    correctVerseMeaningTranslations: { en: "By the racers panting", ar: "والعاديات ضبحاً", id: "Demi kuda yang berlari kencang sambil terengah-engah", tr: "Soluyarak koşan atlara yemin olsun", zh: "以气喘吁吁奔驰的战马为誓", sw: "Naapa kwa farasi wanaokimbia kwa kupumua kwa nguvu", so: "Farasaha Ordaya ee xaariso duwaysha", bs: "Tako mi konja koji jure hrčući", sq: "Betohem në ata që vrapojnë duke nxjerrë frymë", ru: "Клянусь мчащимися запыхавшимися", ur: "قسم ہے ہانپتے ہوئے دوڑنے والوں (گھوڑوں) کی", bn: "হাঁপাতে হাঁপাতে দৌড়ানোর শপথ", ms: "Demi kuda-kuda yang berlari kencang sambil terengah-engah" },
    surahAyah: "العاديات:1", ayahNumber: 1,
    hint: "الخيل السريعة في ميدان الحرب",
    correctVerse: "وَالْعَادِيَاتِ ضَبْحًا",
    correctVerseMeaning: "By the racers panting",
    options: [{ text: "الْعَادِيَاتِ", isCorrect: true }, { text: "الْمُغِيرَاتِ", isCorrect: false }, { text: "الْمُورِيَاتِ", isCorrect: false }, { text: "النَّازِعَاتِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-QARI'AH (سورة القارعة) — 101
  // ═══════════════════════════════════════
  {
    id: "jz_qariah_1", surahAr: "القارعة", surahEn: "Al-Qari'ah",
    targetWord: "الْقَارِعَةُ",
    targetWordMeaning: "The Striking Hour (Calamity)",
    targetWordTranslations: { en: "The Striking Hour (Calamity)", ar: "الطارقة المقرعة — القيامة", id: "Hari Kiamat yang mengguncang", tr: "Çarpan Saat (Kıyamet)", zh: "猛击之日/灾难", sw: "Tukio Linaloopiga", so: "Dhacdada Garaacaysa", bs: "Udarajući dan (Sudnji)", sq: "Ngjarja Goditëse (Kiyameti)", ru: "Сокрушающий удар (Судный день)", ur: "کھٹکھٹانے والی (قیامت)", bn: "আঘাতকারী ঘটনা (কিয়ামত)", ms: "Bencana Dahsyat yang Melanda" },
    correctVerseMeaningTranslations: { en: "The Striking Calamity — what is the Striking Calamity?", ar: "القارعة ما القارعة", id: "Hari Kiamat, apa Hari Kiamat itu?", tr: "Çarpan kıyamet! Nedir çarpan kıyamet?", zh: "大灾难！什么是大灾难？", sw: "Tukio Linaloopiga — ni nini Tukio Linaloopiga?", so: "Qaari'adda — maxay Qaari'addu tahay?", bs: "Udarajući dan — što je udarajući dan?", sq: "Goditja — çfarë është Goditja?", ru: "Сокрушительный удар! Что такое сокрушительный удар?", ur: "کھٹکھٹانے والی — کیا ہے کھٹکھٹانے والی؟", bn: "আঘাতকারী — কী সেই আঘাতকারী?", ms: "Bencana yang melanda — apakah Bencana yang melanda itu?" },
    surahAyah: "القارعة:1", ayahNumber: 1,
    hint: "اسم من أسماء يوم القيامة — تقرع القلوب بهولها",
    correctVerse: "الْقَارِعَةُ مَا الْقَارِعَةُ",
    correctVerseMeaning: "The Striking Calamity — what is the Striking Calamity?",
    options: [{ text: "الْقَارِعَةُ", isCorrect: true }, { text: "الطَّامَّةُ", isCorrect: false }, { text: "الصَّاخَّةُ", isCorrect: false }, { text: "الْغَاشِيَةُ", isCorrect: false }],
  },
  {
    id: "jz_qariah_2", surahAr: "القارعة", surahEn: "Al-Qari'ah",
    targetWord: "الْمَوَازِينُ",
    targetWordMeaning: "The Scales (of deeds)",
    targetWordTranslations: { en: "The Scales (of deeds)", ar: "موازين الأعمال يوم القيامة", id: "Timbangan amal", tr: "Amel terazileri", zh: "行为的秤", sw: "Mizani ya vitendo", so: "Miisaanka Camalada", bs: "Vage (dobrih i loših dijela)", sq: "Peshoret (e veprave)", ru: "Весы (деяний)", ur: "اعمال کی ترازو", bn: "আমলের দাঁড়িপাল্লা", ms: "Neraca (timbangan amal)" },
    correctVerseMeaningTranslations: { en: "Then as for one whose scales are heavy with good deeds", ar: "فأما من ثقلت موازينه", id: "Adapun orang yang berat timbangannya", tr: "Kimin terazisi ağır basarsa", zh: "至于善功较重的人", sw: "Ama mtu ambaye mizani yake ni nzito", so: "Cidda miisaankeedu culeyso", bs: "Onaj čija vaga bude teška", sq: "Sa për atë të cilit peshoret do të jenë të rënda", ru: "Тому, чьи весы отягощены добрыми делами", ur: "جس کی ترازو بھاری ہوگی", bn: "যার পাল্লা ভারী হবে", ms: "Adapun orang yang berat timbangannya" },
    surahAyah: "القارعة:6", ayahNumber: 6,
    hint: "الأداة التي تُوزن بها الأعمال يوم الحساب",
    correctVerse: "فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ",
    correctVerseMeaning: "Then as for one whose scales are heavy with good deeds",
    options: [{ text: "الْمَوَازِينُ", isCorrect: true }, { text: "الأَعْمَالُ", isCorrect: false }, { text: "الصُّحُفُ", isCorrect: false }, { text: "الدَّفَاتِرُ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AT-TAKATHUR (سورة التكاثر) — 102
  // ═══════════════════════════════════════
  {
    id: "jz_takathur_1", surahAr: "التكاثر", surahEn: "At-Takathur",
    targetWord: "التَّكَاثُرُ",
    targetWordMeaning: "Rivalry in Worldly Increase",
    targetWordTranslations: { en: "Rivalry in Worldly Increase", ar: "التنافس في جمع الدنيا", id: "Bermegah-megahan", tr: "Çokluk Yarışı", zh: "相互夸耀财富", sw: "Kushindana katika wingi", so: "Tartanka Kaabaynta", bs: "Nadmetanje u obilju", sq: "Gara në shumësi", ru: "Соперничество в умножении", ur: "کثرت جمع کرنے کی ہوس", bn: "সম্পদে প্রাচুর্যে গর্ব করা", ms: "Bermegah-megah" },
    correctVerseMeaningTranslations: { en: "Rivalry in worldly increase diverts you", ar: "ألهاكم التكاثر", id: "Bermegah-megahan telah melalaikanmu", tr: "Çokluk yarışı sizi oyaladı", zh: "炫耀财富之事使你们分心", sw: "Kushindana katika wingi kumekuvuruga", so: "Tartanka Kaabayntu waa idinku mashquulisay", bs: "Nadmetanje u obilju vas je zanijelo", sq: "Gara në shumësi ju shpërthan", ru: "Соперничество в умножении отвлекает вас", ur: "تکاثر نے تمہیں غافل کر دیا", bn: "প্রাচুর্যের মোহ তোমাদের গাফেল করে রেখেছে", ms: "Bermegah-megahan telah melalaikanmu" },
    surahAyah: "التكاثر:1", ayahNumber: 1,
    hint: "التنافس على جمع الأموال والأولاد والمناصب",
    correctVerse: "أَلْهَاكُمُ التَّكَاثُرُ",
    correctVerseMeaning: "Rivalry in worldly increase diverts you",
    options: [{ text: "التَّكَاثُرُ", isCorrect: true }, { text: "الإِنسَانَ", isCorrect: false }, { text: "الدُّنيَا", isCorrect: false }, { text: "الْهَوَى", isCorrect: false }],
  },
  {
    id: "jz_takathur_2", surahAr: "التكاثر", surahEn: "At-Takathur",
    targetWord: "الْجَحِيمَ",
    targetWordMeaning: "The Blazing Fire (Hell)",
    targetWordTranslations: { en: "The Blazing Fire (Hell)", ar: "النار الحارقة المشتعلة", id: "Api yang menyala-nyala", tr: "Cehennem ateşi", zh: "熊熊烈火（地狱）", sw: "Moto wa Jahanamu", so: "Naartii Gubanaysey", bs: "Oganj (Džehennem)", sq: "Zjarri i flakos (Xhehennemi)", ru: "Пылающий огонь (Ад)", ur: "بھڑکتی ہوئی آگ", bn: "প্রজ্বলিত আগুন", ms: "Api yang menyala-nyala" },
    correctVerseMeaningTranslations: { en: "You will surely see the Hellfire", ar: "لترون الجحيم", id: "Sungguh kamu akan melihat neraka Jahim", tr: "Cehennemi mutlaka göreceksiniz", zh: "你们必将看见地狱", sw: "Hakika mtaona moto wa Jahanamu", so: "Runtii waxaad arki doontaan Naarta Gubanaysa", bs: "Sigurno ćete vidjeti oganj pakla", sq: "Me të vërtetë do ta shihni zjarrin e flakos", ru: "Вы непременно увидите Адский огонь", ur: "بے شک تم جہنم کو دیکھو گے", bn: "তোমরা অবশ্যই জাহান্নামের আগুন দেখবে", ms: "Sungguh kamu akan melihat api neraka" },
    surahAyah: "التكاثر:6", ayahNumber: 6,
    hint: "مكان العذاب بالنار يوم القيامة",
    correctVerse: "لَتَرَوُنَّ الْجَحِيمَ",
    correctVerseMeaning: "You will surely see the Hellfire",
    options: [{ text: "الْجَحِيمَ", isCorrect: true }, { text: "الْمَقَابِرَ", isCorrect: false }, { text: "النَّعِيمَ", isCorrect: false }, { text: "الْحَسِيمَ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-ASR (سورة العصر) — 103
  // ═══════════════════════════════════════
  {
    id: "jz_asr_1", surahAr: "العصر", surahEn: "Al-Asr",
    targetWord: "الْعَصْرِ",
    targetWordMeaning: "The Time / Afternoon",
    targetWordTranslations: { en: "The Time / The Afternoon", ar: "الدهر والزمن — وقت العصر", id: "Waktu / Waktu Ashar", tr: "Zaman / İkindi Vakti", zh: "时代/下午时分", sw: "Wakati / Alasiri", so: "Waqtiga / Galanku", bs: "Vrijeme / Popodne", sq: "Koha / Pasditja", ru: "Время / Послеполудень", ur: "زمانہ / عصر کا وقت", bn: "সময়/বিকাল", ms: "Masa / Waktu Asar" },
    correctVerseMeaningTranslations: { en: "By time", ar: "والعصر", id: "Demi masa", tr: "Zamana yemin olsun", zh: "以时代为誓", sw: "Naapa kwa wakati", so: "Waqtiga baan ku dhaartay", bs: "Tako mi vremena", sq: "Betohem në kohën", ru: "Клянусь временем", ur: "قسم ہے زمانے کی", bn: "সময়ের শপথ", ms: "Demi masa" },
    surahAyah: "العصر:1", ayahNumber: 1,
    hint: "الزمن الذي يمر ولا يعود",
    correctVerse: "وَالْعَصْرِ",
    correctVerseMeaning: "By time",
    options: [{ text: "الْعَصْرِ", isCorrect: true }, { text: "الضُّحَى", isCorrect: false }, { text: "الْفَجْرِ", isCorrect: false }, { text: "اللَّيْلِ", isCorrect: false }],
  },
  {
    id: "jz_asr_2", surahAr: "العصر", surahEn: "Al-Asr",
    targetWord: "الصَّابِرِينَ",
    targetWordMeaning: "Those Who Are Patient",
    targetWordTranslations: { en: "Those Who Are Patient", ar: "المتحملون للمشاق بثبات", id: "Orang-orang yang sabar", tr: "Sabredenler", zh: "有耐心的人", sw: "Wanaostahimili", so: "Kuwa Dulqaata", bs: "Strpljivi", sq: "Ata që janë të durueshëm", ru: "Терпеливые", ur: "صبر کرنے والے", bn: "ধৈর্যশীলরা", ms: "Orang-orang yang sabar" },
    correctVerseMeaningTranslations: { en: "And advising each other to patience", ar: "وتواصوا بالصبر", id: "Dan saling menasihati untuk kesabaran", tr: "Ve birbirine sabrı tavsiye edenler", zh: "并相互告诫忍耐", sw: "Na kusahihishana katika uvumilivu", so: "Isu dardaarmaya Sabirka", bs: "I koji jedni drugima preporučuju strpljivost", sq: "Dhe që porosisin njëri-tjetrin me durim", ru: "И кто заповедует терпение", ur: "اور ایک دوسرے کو صبر کی نصیحت کرنے والے", bn: "এবং পরস্পরকে ধৈর্যের উপদেশ দেওয়া", ms: "Dan saling berpesan dengan kesabaran" },
    surahAyah: "العصر:3", ayahNumber: 3,
    hint: "جمع «صابر» — من يتحمل الصعاب دون شكوى",
    correctVerse: "وَتَوَاصَوْا بِالصَّبْرِ",
    correctVerseMeaning: "And advising each other to patience",
    options: [{ text: "الصَّابِرِينَ", isCorrect: true }, { text: "الصَّالِحَاتِ", isCorrect: false }, { text: "الْحَقِّ", isCorrect: false }, { text: "الصَّبْرِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-HUMAZAH (سورة الهمزة) — 104
  // ═══════════════════════════════════════
  {
    id: "jz_humazah_1", surahAr: "الهمزة", surahEn: "Al-Humazah",
    targetWord: "الْهُمَزَةِ",
    targetWordMeaning: "The Slanderer / Mocker",
    targetWordTranslations: { en: "The Slanderer / Mocker", ar: "من يعيب ويكسر قلوب الناس", id: "Pencela / Penghina", tr: "Çekiştirici / Alay edici", zh: "毁谤者/嘲讽者", sw: "Mtukutu / Mkejeli", so: "Kii Aflagaadeyn jiray", bs: "Klevetnik / Rugač", sq: "Grindavec / Tallës", ru: "Хулитель / Насмешник", ur: "عیب لگانے والا/مذاق اڑانے والا", bn: "নিন্দুক/বিদ্রূপকারী", ms: "Pencela / Penghina" },
    correctVerseMeaningTranslations: { en: "Woe to every scorner and mocker", ar: "ويل لكل همزة لمزة", id: "Kecelakaan bagi setiap pencela dan penghina", tr: "Her alaya alıp çekiştirene yazıklar olsun", zh: "祸哉，一切嘲讽毁谤者", sw: "Ole kwa kila mtukutu na mkejeli", so: "Ceeb ku tahay kii Aflagaadeynayay", bs: "Teško svakom klevetnik-rugaču", sq: "Mjerë çdo grindavec dhe tallës", ru: "Горе всякому хулителю и насмешнику", ur: "ہر طعنہ دینے والے عیب لگانے والے کے لیے خرابی ہے", bn: "প্রত্যেক নিন্দুক ও পরিহাসকারীর জন্য দুর্ভোগ", ms: "Celakalah setiap pencela dan pengumpat" },
    surahAyah: "الهمزة:1", ayahNumber: 1,
    hint: "من يكسر شخصية الآخرين بالاستهزاء والغيبة",
    correctVerse: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ",
    correctVerseMeaning: "Woe to every scorner and mocker",
    options: [{ text: "الْهُمَزَةِ", isCorrect: true }, { text: "اللُّمَزَةِ", isCorrect: false }, { text: "الْكَاذِبِ", isCorrect: false }, { text: "الظَّالِمِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-FIL (سورة الفيل) — 105
  // ═══════════════════════════════════════
  {
    id: "jz_fil_1", surahAr: "الفيل", surahEn: "Al-Fil",
    targetWord: "الْفِيلِ",
    targetWordMeaning: "The Elephant",
    targetWordTranslations: { en: "The Elephant", ar: "الفيل — الحيوان الضخم", id: "Gajah", tr: "Fil", zh: "大象", sw: "Tembo", so: "Maroodi", bs: "Slon", sq: "Elefanti", ru: "Слон", ur: "ہاتھی", bn: "হাতি", ms: "Gajah" },
    correctVerseMeaningTranslations: { en: "Have you not considered how your Lord dealt with the companions of the elephant", ar: "ألم تر كيف فعل ربك بأصحاب الفيل", id: "Apakah kamu tidak memperhatikan bagaimana Tuhanmu berbuat terhadap pasukan gajah", tr: "Rabbin fil sahiplerine nasıl yaptı görmedin mi", zh: "你没有看到你的主如何对待象主吗", sw: "Je, hukuona jinsi Mola wako alivyotenda kwa watu wa tembo", so: "Miyaadan arkin siduu Rabbigaagu u galay Asxaabal Fiilka", bs: "Zar ne vidiš kako je Gospodar tvoj postupio s vlasnicima slona", sq: "A nuk e ke parë se si Zoti yt veproi me shokët e elefantit", ru: "Разве ты не видел, как поступил Господь с хозяевами слона", ur: "کیا آپ نے نہیں دیکھا کہ آپ کے رب نے ہاتھی والوں کے ساتھ کیا کیا", bn: "তুমি কি দেখনি তোমার রব হাতীবাহিনীর সাথে কীরূপ করলেন", ms: "Apakah kamu tidak memperhatikan bagaimana Tuhanmu berbuat terhadap pasukan gajah" },
    surahAyah: "الفيل:1", ayahNumber: 1,
    hint: "الحيوان الضخم الذي جاء به أبرهة لهدم الكعبة",
    correctVerse: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
    correctVerseMeaning: "Have you not considered how your Lord dealt with the companions of the elephant",
    options: [{ text: "الْفِيلِ", isCorrect: true }, { text: "الْحَجَرِ", isCorrect: false }, { text: "الطَّيْرِ", isCorrect: false }, { text: "الرِّيحِ", isCorrect: false }],
  },
  {
    id: "jz_fil_2", surahAr: "الفيل", surahEn: "Al-Fil",
    targetWord: "أَبَابِيلَ",
    targetWordMeaning: "Flocks / Groups (of birds)",
    targetWordTranslations: { en: "Flocks / Groups (of birds)", ar: "جماعات من الطيور", id: "Kawanan burung", tr: "Sürüler (kuş떼)", zh: "成群的鸟", sw: "Makundi ya ndege", so: "Xoolaahda Shimbirraha", bs: "Jata (ptica)", sq: "Tufat (zogjve)", ru: "Стаи (птиц)", ur: "پرندوں کے جھنڈ", bn: "পাখির ঝাঁক", ms: "Sekumpulan burung" },
    correctVerseMeaningTranslations: { en: "And He sent against them birds in flocks", ar: "وأرسل عليهم طيراً أبابيل", id: "Dan Dia mengirimkan kepada mereka burung yang berbondong-bondong", tr: "Ve üzerlerine sürü sürü kuşlar gönderdi", zh: "他派遣成群的鸟攻击他们", sw: "Na akawapelekea ndege kwa makundi", so: "Wuxuuna u diray Shimbirraha Xoolaah", bs: "I poslao je na njih ptice u jatima", sq: "Dhe dërgoi kundër tyre zogj në tufa", ru: "И послал Он на них птиц стаями", ur: "اور اس نے ان پر پرندوں کے جھنڈ بھیجے", bn: "তিনি তাদের উপর পাখির ঝাঁক পাঠালেন", ms: "Dan Dia mengirimkan kepada mereka burung yang berbondong-bondong" },
    surahAyah: "الفيل:3", ayahNumber: 3,
    hint: "جموع كثيرة من الطيور جاءت تحمل الحجارة",
    correctVerse: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
    correctVerseMeaning: "And He sent against them birds in flocks",
    options: [{ text: "أَبَابِيلَ", isCorrect: true }, { text: "طَيْرًا", isCorrect: false }, { text: "سِجِّيلٍ", isCorrect: false }, { text: "عَصْفٍ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // QURAYSH (سورة قريش) — 106
  // ═══════════════════════════════════════
  {
    id: "jz_quraysh_1", surahAr: "قريش", surahEn: "Quraysh",
    targetWord: "قُرَيْشٍ",
    targetWordMeaning: "The Quraysh (Arab Tribe)",
    targetWordTranslations: { en: "The Quraysh (Arab Tribe)", ar: "قبيلة قريش أهل مكة", id: "Suku Quraisy", tr: "Kureyş Kabilesi", zh: "古莱什部落", sw: "Kabila la Qureshi", so: "Qabiilkii Quraysh", bs: "Pleme Kurejš", sq: "Fisi Kurejsh", ru: "Курайшиты (арабское племя)", ur: "قبیلہ قریش", bn: "কুরাইশ গোত্র", ms: "Suku Quraisy" },
    correctVerseMeaningTranslations: { en: "For the accustomed security of the Quraysh", ar: "لإيلاف قريش", id: "Karena kebiasaan suku Quraisy", tr: "Kureyş'in alışıklığı için", zh: "由于古莱什人的惯例", sw: "Kwa ajili ya mwelekeo wa Qureshi", so: "Cidhibaarka Quraysh awgeed", bs: "Zbog sporazuma Kurejša", sq: "Për shkak të mësymjes së Kurejshëve", ru: "Ради привязанности Курайшитов", ur: "قریش کی الفت کی بدولت", bn: "কুরাইশদের পরিচিতির কারণে", ms: "Kerana keselamatan yang telah biasa bagi Quraisy" },
    surahAyah: "قريش:1", ayahNumber: 1,
    hint: "القبيلة العربية التي كانت تسكن مكة",
    correctVerse: "لإِيلافِ قُرَيْشٍ",
    correctVerseMeaning: "For the accustomed security of the Quraysh",
    options: [{ text: "قُرَيْشٍ", isCorrect: true }, { text: "الْعَرَبِ", isCorrect: false }, { text: "مَكَّةَ", isCorrect: false }, { text: "الْبَيْتِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-MA'UN (سورة الماعون) — 107
  // ═══════════════════════════════════════
  {
    id: "jz_maun_1", surahAr: "الماعون", surahEn: "Al-Ma'un",
    targetWord: "الدِّينِ",
    targetWordMeaning: "The Religion / The Judgment",
    targetWordTranslations: { en: "The Religion / Day of Judgment", ar: "الدين — يوم الحساب والجزاء", id: "Agama / Hari Pembalasan", tr: "Din / Hesap Günü", zh: "宗教/审判日", sw: "Dini / Siku ya Hukumu", so: "Diinta / Maalinta Xisaabta", bs: "Vjera / Dan Suđenja", sq: "Feja / Dita e Gjykimit", ru: "Вера / День Суда", ur: "دین/جزا کا دن", bn: "ধর্ম/বিচার দিবস", ms: "Agama / Hari Pembalasan" },
    correctVerseMeaningTranslations: { en: "Have you seen the one who denies the Recompense?", ar: "أرأيت الذي يكذّب بالدين", id: "Tahukah kamu orang yang mendustakan agama?", tr: "Dini yalanlayan kimseyi gördün mü?", zh: "你见过否认报应的人吗？", sw: "Je, umemuona anayekanusha Dini?", so: "Miyaad aragtay Kii beeniyay Diinta?", bs: "Zar ne vidiš onoga koji poričeto vjeru?", sq: "A e ke parë atë që mohon Fenë?", ru: "Видел ли ты того, кто отрицает веру?", ur: "کیا تم نے اسے دیکھا جو دین کو جھٹلاتا ہے؟", bn: "তুমি কি তাকে দেখেছ যে দ্বীনকে অস্বীকার করে?", ms: "Tahukah kamu orang yang mendustakan agama?" },
    surahAyah: "الماعون:1", ayahNumber: 1,
    hint: "يوم الجزاء والحساب",
    correctVerse: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
    correctVerseMeaning: "Have you seen the one who denies the Recompense?",
    options: [{ text: "الدِّينِ", isCorrect: true }, { text: "الصَّلاةِ", isCorrect: false }, { text: "الْيَتِيمِ", isCorrect: false }, { text: "الْمِسْكِينِ", isCorrect: false }],
  },
  {
    id: "jz_maun_2", surahAr: "الماعون", surahEn: "Al-Ma'un",
    targetWord: "الْمَاعُونَ",
    targetWordMeaning: "Small Kindnesses / Household Items",
    targetWordTranslations: { en: "Small Kindnesses / Household Items", ar: "الأشياء البسيطة التي يتعاون الناس عليها", id: "Bantuan kecil / Perabot sederhana", tr: "Küçük yardımlar / Ev eşyası", zh: "小的帮助/日用品", sw: "Msaada mdogo / Vitu vya nyumbani", so: "Kaalmada Yar", bs: "Male dobrote / Kućna pomagala", sq: "Ndihma e vogël / Pajisje shtëpiake", ru: "Малые благодеяния / Предметы быта", ur: "معمولی چیزیں جو پڑوسی استعمال کرتے ہیں", bn: "ছোট সাহায্য/গৃহস্থালির জিনিস", ms: "Bantuan kecil / Barang keperluan harian" },
    correctVerseMeaningTranslations: { en: "And withhold simple assistance", ar: "ويمنعون الماعون", id: "Dan tidak mau memberikan bantuan sederhana", tr: "Ve küçük yardımları bile engellerler", zh: "甚至拒绝给予日用小物", sw: "Na wanazuia msaada mdogo", so: "Waxayna joojiyaan Kaalantu Yar", bs: "I uskraćuju malu pomoć", sq: "Dhe pengojnë ndihmat e vogla", ru: "И отказывают в малейшей помощи", ur: "اور معمولی چیزیں بھی نہیں دیتے", bn: "এবং ছোট সাহায্যও প্রদান করে না", ms: "Dan tidak mau memberikan bantuan yang kecil" },
    surahAyah: "الماعون:7", ayahNumber: 7,
    hint: "الأشياء البسيطة كالملح والقِدر التي يُعيرها الجيران",
    correctVerse: "وَيَمْنَعُونَ الْمَاعُونَ",
    correctVerseMeaning: "And withhold simple assistance",
    options: [{ text: "الْمَاعُونَ", isCorrect: true }, { text: "الصَّلاةَ", isCorrect: false }, { text: "الزَّكَاةَ", isCorrect: false }, { text: "الصَّدَقَةَ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-KAWTHAR (سورة الكوثر) — 108
  // ═══════════════════════════════════════
  {
    id: "jz_kawthar_1", surahAr: "الكوثر", surahEn: "Al-Kawthar",
    targetWord: "الْكَوْثَرَ",
    targetWordMeaning: "Al-Kawthar (River in Paradise)",
    targetWordTranslations: { en: "Al-Kawthar (River of Abundance in Paradise)", ar: "نهر الكوثر في الجنة", id: "Al-Kautsar (sungai di surga)", tr: "Kevser (Cennetteki ırmak)", zh: "科萨尔（天园中的河流）", sw: "Al-Kawthar (mto peponi)", so: "Kowthar (Saxabtii Jannada)", bs: "Al-Kevser (rijeka u Džennetu)", sq: "El-Keutheri (lumi i Xhenetit)", ru: "Аль-Каусар (река в Раю)", ur: "کوثر (جنت کی نہر)", bn: "কাউসার (জান্নাতের নদী)", ms: "Al-Kawthar (sungai di syurga)" },
    correctVerseMeaningTranslations: { en: "Indeed, We have granted you Al-Kawthar", ar: "إنا أعطيناك الكوثر", id: "Sesungguhnya Kami telah memberikan kepadamu Al-Kautsar", tr: "Gerçekten Biz sana Kevser'i verdik", zh: "我确实赐予你科萨尔", sw: "Hakika tumekupa Al-Kawthar", so: "Runtii waxaan kuu siinnay Kowthar", bs: "Zaista smo ti dali El-Kevser", sq: "Me të vërtetë Ne të kemi dhënë El-Keutherin", ru: "Воистину, Мы даровали тебе Аль-Каусар", ur: "بے شک ہم نے آپ کو کوثر عطا کی", bn: "নিশ্চয়ই আমি তোমাকে কাউসার দিয়েছি", ms: "Sesungguhnya Kami telah memberikanmu Al-Kawthar" },
    surahAyah: "الكوثر:1", ayahNumber: 1,
    hint: "نهر في الجنة أُعطي للنبي ﷺ",
    correctVerse: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    correctVerseMeaning: "Indeed, We have granted you Al-Kawthar",
    options: [{ text: "الْكَوْثَرَ", isCorrect: true }, { text: "الْجَنَّةَ", isCorrect: false }, { text: "النَّعِيمَ", isCorrect: false }, { text: "الرَّحْمَةَ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-KAFIRUN (سورة الكافرون) — 109
  // ═══════════════════════════════════════
  {
    id: "jz_kafirun_1", surahAr: "الكافرون", surahEn: "Al-Kafirun",
    targetWord: "الْكَافِرُونَ",
    targetWordMeaning: "The Disbelievers",
    targetWordTranslations: { en: "The Disbelievers / Unbelievers", ar: "الجاحدون المنكرون للحق", id: "Orang-orang kafir", tr: "Kâfirler", zh: "不信道者", sw: "Makafiri", so: "Gaalooyinka", bs: "Nevjernici", sq: "Mosbesimtarët", ru: "Неверующие", ur: "کافر", bn: "কাফিরগণ", ms: "Orang-orang kafir" },
    correctVerseMeaningTranslations: { en: "Say, O disbelievers", ar: "قل يا أيها الكافرون", id: "Katakanlah: Wahai orang-orang kafir", tr: "De ki: Ey kâfirler", zh: "说：哦，不信道者们", sw: "Sema: Enyi makafiri", so: "Dheh: Gaalayaashaa", bs: "Reci: O nevjernici", sq: "Thuaj: O mosbesimtarë", ru: "Скажи: О неверующие", ur: "کہو: اے کافرو", bn: "বলো: হে কাফিরগণ", ms: "Katakanlah: Wahai orang-orang kafir" },
    surahAyah: "الكافرون:1", ayahNumber: 1,
    hint: "جمع «كافر» — من يرفض الإيمان",
    correctVerse: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
    correctVerseMeaning: "Say, O disbelievers",
    options: [{ text: "الْكَافِرُونَ", isCorrect: true }, { text: "الْمُشْرِكُونَ", isCorrect: false }, { text: "الْمُنَافِقُونَ", isCorrect: false }, { text: "الْمُؤْمِنُونَ", isCorrect: false }],
  },
  {
    id: "jz_kafirun_2", surahAr: "الكافرون", surahEn: "Al-Kafirun",
    targetWord: "دِينُكُمْ",
    targetWordMeaning: "Your Religion",
    targetWordTranslations: { en: "Your Religion", ar: "دينكم أنتم", id: "Agamamu", tr: "Sizin dininiz", zh: "你们的宗教", sw: "Dini yako", so: "Diintaada", bs: "Vaša vjera", sq: "Feja juaj", ru: "Ваша вера", ur: "تمہارا دین", bn: "তোমাদের ধর্ম", ms: "Agama kamu" },
    correctVerseMeaningTranslations: { en: "For you is your religion, and for me is my religion", ar: "لكم دينكم ولي دين", id: "Untukmulah agamamu dan untukkulah agamaku", tr: "Sizin dininiz size, benim dinim bana", zh: "你们有你们的宗教，我有我的宗教", sw: "Dini yako ni yako, na dini yangu ni yangu", so: "Diintaadda kuu tahay adiga, diinteyda ii tahay aniga", bs: "Vi imate svoju vjeru, a ja svoju", sq: "Juve e keni fenë tuaj, mua e kam fenë time", ru: "Вам ваша вера, и мне моя вера", ur: "تمہارے لیے تمہارا دین اور میرے لیے میرا دین", bn: "তোমাদের জন্য তোমাদের ধর্ম এবং আমার জন্য আমার ধর্ম", ms: "Bagi kamu agamamu dan bagiku agamaku" },
    surahAyah: "الكافرون:6", ayahNumber: 6,
    hint: "ما يعتقده الإنسان ويتبعه من منهج وشريعة",
    correctVerse: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    correctVerseMeaning: "For you is your religion, and for me is my religion",
    options: [{ text: "دِينُكُمْ", isCorrect: true }, { text: "مَذْهَبُكُمْ", isCorrect: false }, { text: "إِيمَانُكُمْ", isCorrect: false }, { text: "عِبَادَتُكُمْ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AN-NASR (سورة النصر) — 110
  // ═══════════════════════════════════════
  {
    id: "jz_nasr_1", surahAr: "النصر", surahEn: "An-Nasr",
    targetWord: "النَّصْرُ",
    targetWordMeaning: "The Victory / Help",
    targetWordTranslations: { en: "The Victory / Divine Help", ar: "النصر والفتح الإلهي", id: "Pertolongan / Kemenangan", tr: "Zafer / İlahi Yardım", zh: "胜利/神助", sw: "Ushindi / Msaada", so: "Guushu / Gargaarka", bs: "Pobjeda / Pomoć", sq: "Fitorja / Ndihma Hyjnore", ru: "Победа / Помощь Аллаха", ur: "فتح و نصرت", bn: "বিজয়/সাহায্য", ms: "Pertolongan / Kemenangan" },
    correctVerseMeaningTranslations: { en: "When the victory of Allah has come and the conquest", ar: "إذا جاء نصر الله والفتح", id: "Apabila telah datang pertolongan Allah dan kemenangan", tr: "Allah'ın yardımı ve fetih geldiğinde", zh: "当真主的帮助和胜利来临时", sw: "Msaada wa Allah na ushindi utakapofika", so: "Gargaarkii Eebe iyo Furitaankii markay yimaadaan", bs: "Kada dođe Allahova pomoć i osvajanje", sq: "Kur të vijë ndihma e Allahut dhe çlirimi", ru: "Когда придёт помощь Аллаха и победа", ur: "جب اللہ کی مدد اور فتح آ جائے", bn: "যখন আল্লাহর সাহায্য এবং বিজয় আসে", ms: "Apabila datang pertolongan Allah dan kemenangan" },
    surahAyah: "النصر:1", ayahNumber: 1,
    hint: "التأييد الإلهي والغلبة على الأعداء",
    correctVerse: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    correctVerseMeaning: "When the victory of Allah has come and the conquest",
    options: [{ text: "النَّصْرُ", isCorrect: true }, { text: "الْفَتْحُ", isCorrect: false }, { text: "الرَّحْمَةُ", isCorrect: false }, { text: "الْمَغْفِرَةُ", isCorrect: false }],
  },
  {
    id: "jz_nasr_2", surahAr: "النصر", surahEn: "An-Nasr",
    targetWord: "أَفْوَاجًا",
    targetWordMeaning: "In Multitudes / Groups",
    targetWordTranslations: { en: "In Multitudes / Groups", ar: "جماعات وزمراً كثيرة", id: "Berbondong-bondong", tr: "Bölük bölük / Kalabalık gruplar halinde", zh: "成群结队", sw: "Makundi makundi", so: "Kooxo Kooxo", bs: "U grupama", sq: "Në grupe / Në tufa", ru: "Толпами / Группами", ur: "فوج در فوج / گروہ گروہ", bn: "দলে দলে", ms: "Berbondong-bondong" },
    correctVerseMeaningTranslations: { en: "And you see the people entering the religion of Allah in multitudes", ar: "ورأيت الناس يدخلون في دين الله أفواجاً", id: "Dan kamu melihat manusia masuk agama Allah dengan berbondong-bondong", tr: "İnsanların Allah'ın dinine bölük bölük girdiğini gördüğünde", zh: "你看到人们成群结队地进入真主的宗教", sw: "Ukiona watu wakiingia katika dini ya Allah kwa makundi", so: "Dadkana arkaysaa oo ay ku galeyaan Diinta Eebe Kooxo Kooxo", bs: "I vidiš ljude kako grupno ulaze u Allahovu vjeru", sq: "Dhe shohësh njerëzit duke hyrë në fenë e Allahut në tufa", ru: "И увидишь, как люди толпами входят в религию Аллаха", ur: "اور تم دیکھو کہ لوگ فوج در فوج اللہ کے دین میں داخل ہو رہے ہیں", bn: "এবং তুমি দেখো মানুষ দলে দলে আল্লাহর ধর্মে প্রবেশ করছে", ms: "Dan kamu melihat manusia masuk agama Allah berbondong-bondong" },
    surahAyah: "النصر:2", ayahNumber: 2,
    hint: "جموع كثيرة من الناس تدخل الإسلام دفعة واحدة",
    correctVerse: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
    correctVerseMeaning: "And you see the people entering the religion of Allah in multitudes",
    options: [{ text: "أَفْوَاجًا", isCorrect: true }, { text: "جَمَاعَاتٍ", isCorrect: false }, { text: "النَّاسَ", isCorrect: false }, { text: "وَاحِدًا", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-MASAD / TABBAT (سورة المسد) — 111
  // ═══════════════════════════════════════
  {
    id: "jz_masad_1", surahAr: "المسد", surahEn: "Al-Masad",
    targetWord: "تَبَّتْ",
    targetWordMeaning: "May It Perish / Be Cut Off",
    targetWordTranslations: { en: "May It Perish / Be Doomed", ar: "خسرت وهلكت", id: "Binasalah / Hancurlah", tr: "Mahvolsun / Kahrolsun", zh: "灭亡/诅咒", sw: "Na ianguke / Iangamie", so: "Ha lumiyee", bs: "Neka propadne / Propalo mu", sq: "Humboftë / Dëmtoftë", ru: "Да погибнут / Да отсохнут", ur: "ٹوٹ جائیں / ہلاک ہوں", bn: "ধ্বংস হোক", ms: "Binasalah / Hancurlah" },
    correctVerseMeaningTranslations: { en: "May the hands of Abu Lahab be ruined and ruined is he", ar: "تبّت يدا أبي لهب وتبّ", id: "Binasalah kedua tangan Abu Lahab dan binasalah dia", tr: "Ebu Leheb'in elleri kurusun! O da helak oldu zaten", zh: "愿艾卜·拉哈布的双手毁灭，他已毁灭了", sw: "Na zianguke mikono ya Abu Lahab na yeye aangamie", so: "Gacmaha Abi Lahab ha goblobaan oo wuu lumay", bs: "Neka propadnu ruke Ebu Leheba i on sam propao je", sq: "U prishin duart e Ebu Lehebit, dhe ai humbi", ru: "Да отсохнут руки Абу Ляхаба, и он сам погиб", ur: "ابو لہب کے ہاتھ ٹوٹیں اور وہ خود ہلاک ہو", bn: "আবু লাহাবের হাত ধ্বংস হোক এবং সে নিজেও ধ্বংস হোক", ms: "Binasalah kedua tangan Abu Lahab dan binasalah dia" },
    surahAyah: "المسد:1", ayahNumber: 1,
    hint: "دعاء بالهلاك والخسران",
    correctVerse: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
    correctVerseMeaning: "May the hands of Abu Lahab be ruined and ruined is he",
    options: [{ text: "تَبَّتْ", isCorrect: true }, { text: "يَدَا", isCorrect: false }, { text: "وَتَبَّ", isCorrect: false }, { text: "لَهَبٍ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-IKHLAS (سورة الإخلاص) — 112
  // ═══════════════════════════════════════
  {
    id: "jz_ikhlas_1", surahAr: "الإخلاص", surahEn: "Al-Ikhlas",
    targetWord: "أَحَدٌ",
    targetWordMeaning: "One / Unique",
    targetWordTranslations: { en: "One / Unique (Absolutely)", ar: "الواحد الفرد لا شريك له", id: "Satu / Esa", tr: "Bir / Tek (Mutlak olarak)", zh: "唯一/独一", sw: "Mmoja / Pekee", so: "Mid / Keli ah", bs: "Jedan / Jedinstven", sq: "Një / Unik", ru: "Единый / Неповторимый", ur: "ایک/یکتا", bn: "এক/অদ্বিতীয়", ms: "Satu / Esa" },
    correctVerseMeaningTranslations: { en: "Say, He is Allah, the One", ar: "قل هو الله أحد", id: "Katakanlah: Dia Allah yang Maha Esa", tr: "De ki: O Allah Tektir", zh: "说：他是真主，独一的", sw: "Sema: Yeye ni Allah, Mmoja", so: "Dheh: Isagu waa Eebe, Ahad", bs: "Reci: On je Allah, Jedan", sq: "Thuaj: Ai është Allahu, Një", ru: "Скажи: Он — Аллах Единый", ur: "کہو: وہ اللہ ایک ہے", bn: "বলো: তিনি আল্লাহ, এক", ms: "Katakanlah: Dialah Allah Yang Maha Esa" },
    surahAyah: "الإخلاص:1", ayahNumber: 1,
    hint: "صفة الله — الواحد الذي لا شريك له",
    correctVerse: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    correctVerseMeaning: "Say, He is Allah, the One",
    options: [{ text: "أَحَدٌ", isCorrect: true }, { text: "الصَّمَدُ", isCorrect: false }, { text: "الرَّحِيمُ", isCorrect: false }, { text: "الْعَظِيمُ", isCorrect: false }],
  },
  {
    id: "jz_ikhlas_2", surahAr: "الإخلاص", surahEn: "Al-Ikhlas",
    targetWord: "الصَّمَدُ",
    targetWordMeaning: "The Self-Sufficient Master",
    targetWordTranslations: { en: "The Self-Sufficient Master", ar: "السيد الذي يُقصد في الحوائج", id: "Yang Maha Dibutuhkan", tr: "Her Şeyden Müstağni (Samed)", zh: "永恒的主宰", sw: "Mtawala Anayejitosheleza", so: "Sayidka ee Looga Baahan yahay", bs: "Onaj koji je svima potreban", sq: "I Vetëmjaftueshmi / Zotëruesi", ru: "Самодостаточный Властелин", ur: "بے نیاز سردار", bn: "স্বনির্ভর অনন্য সত্তা", ms: "Yang Maha Dibutuhkan" },
    correctVerseMeaningTranslations: { en: "Allah, the Eternal Refuge", ar: "الله الصمد", id: "Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu", tr: "Allah her şeyden müstağnidir", zh: "真主是永恒的主宰", sw: "Allah ni Mtawala Anayejitosheleza", so: "Eebe Samad ahay", bs: "Allah je onaj koji je svima potreban", sq: "Allahu, Zotëruesi i Përjetshëm", ru: "Аллах — Самодостаточный", ur: "اللہ بے نیاز ہے", bn: "আল্লাহ হলেন চিরন্তন আশ্রয়", ms: "Allah adalah Tuhan yang menjadi tumpuan semua makhluk" },
    surahAyah: "الإخلاص:2", ayahNumber: 2,
    hint: "الذي يحتاج إليه كل أحد وهو لا يحتاج لأحد",
    correctVerse: "اللَّهُ الصَّمَدُ",
    correctVerseMeaning: "Allah, the Eternal Refuge",
    options: [{ text: "الصَّمَدُ", isCorrect: true }, { text: "أَحَدٌ", isCorrect: false }, { text: "الرَّحْمَنُ", isCorrect: false }, { text: "الْقَدِيرُ", isCorrect: false }],
  },
  {
    id: "jz_ikhlas_3", surahAr: "الإخلاص", surahEn: "Al-Ikhlas",
    targetWord: "يُولَدْ",
    targetWordMeaning: "Was Born",
    targetWordTranslations: { en: "Was Born / Begotten", ar: "وُلد وخرج من رحم", id: "Dilahirkan", tr: "Doğuruldu", zh: "被生育", sw: "Alizaliwa", so: "Dhashay", bs: "Rodi se", sq: "Lindi / U bë i lindur", ru: "Был рождён", ur: "پیدا ہوا", bn: "জন্মগ্রহণ করা হয়েছে", ms: "Dilahirkan" },
    correctVerseMeaningTranslations: { en: "He was not born, nor was He begotten", ar: "لم يلد ولم يولد", id: "Dia tidak beranak dan tidak pula diperanakkan", tr: "O doğurmadı ve doğurulmadı", zh: "他没有生育，也没有被生育", sw: "Hakuzaa wala hakuzaliwa", so: "Umana dhalinnin, lagumana dhalinnin", bs: "Nije rađao niti je rođen", sq: "Nuk lindi dhe nuk u lind", ru: "Он не родил и не был рождён", ur: "نہ اس نے کسی کو جنا اور نہ اسے جنا گیا", bn: "তিনি না জন্ম দিয়েছেন না জন্মগ্রহণ করেছেন", ms: "Dia tidak beranak dan tidak pula diperanakkan" },
    surahAyah: "الإخلاص:3", ayahNumber: 3,
    hint: "الخروج من رحم الأم — الله منزّه عنه",
    correctVerse: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    correctVerseMeaning: "He was not born, nor was He begotten",
    options: [{ text: "يُولَدْ", isCorrect: true }, { text: "يَلِدْ", isCorrect: false }, { text: "يَكُنْ", isCorrect: false }, { text: "يُشْرَكْ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AL-FALAQ (سورة الفلق) — 113
  // ═══════════════════════════════════════
  {
    id: "jz_falaq_1", surahAr: "الفلق", surahEn: "Al-Falaq",
    targetWord: "الْفَلَقِ",
    targetWordMeaning: "The Daybreak",
    targetWordTranslations: { en: "The Daybreak / Dawn", ar: "انفلاق الظلام عند الفجر", id: "Waktu fajar", tr: "Şafak Vakti", zh: "黎明/曙光", sw: "Mapambazuko", so: "Barqada", bs: "Zora / Svitanje", sq: "Agimi / Çelja e Dritës", ru: "Рассвет / Заря", ur: "پھٹنے کا وقت (فجر)", bn: "ভোর/প্রভাত", ms: "Waktu Subuh" },
    correctVerseMeaningTranslations: { en: "Say, I seek refuge in the Lord of the daybreak", ar: "قل أعوذ برب الفلق", id: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai waktu fajar", tr: "De ki: Şafağın Rabbine sığınırım", zh: "说：我求庇于黎明的主", sw: "Sema: Ninajikinga kwa Mola wa mapambazuko", so: "Dheh: Waxaan ku magangalay Rabbiga Falaqqa", bs: "Reci: Utječem se Gospodaru svitanja", sq: "Thuaj: Kërkoj strehim tek Zoti i Agimit", ru: "Скажи: Прибегаю к Господу рассвета", ur: "کہو: میں پھٹنے والے کے رب کی پناہ مانگتا ہوں", bn: "বলো: আমি আশ্রয় চাই ভোরের রবের কাছে", ms: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai fajar" },
    surahAyah: "الفلق:1", ayahNumber: 1,
    hint: "انشقاق الليل وظهور نور الصباح",
    correctVerse: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    correctVerseMeaning: "Say, I seek refuge in the Lord of the daybreak",
    options: [{ text: "الْفَلَقِ", isCorrect: true }, { text: "النَّاسِ", isCorrect: false }, { text: "الظُّلُمَاتِ", isCorrect: false }, { text: "الصُّبْحِ", isCorrect: false }],
  },
  {
    id: "jz_falaq_2", surahAr: "الفلق", surahEn: "Al-Falaq",
    targetWord: "النَّفَّاثَاتِ",
    targetWordMeaning: "Those Who Blow (Witches)",
    targetWordTranslations: { en: "Those Who Blow (in knots) — Witchcraft", ar: "النافخات في العُقد سحراً", id: "Peniup (yang meniup buhul-buhul)", tr: "Düğümlere üfleyen (büyücüler)", zh: "吹结的（施魔的女人）", sw: "Wanaopuliza (vifungo)", so: "Kuwa Ku Afuufaya (Eexanka)", bs: "Koje pušu (u čvorove)", sq: "Ato që fryjnë (në nyje)", ru: "Те, кто дуют (в узлы) — колдуньи", ur: "گانٹھوں میں پھونکنے والیاں (جادوگرنیاں)", bn: "গিঁটে ফুঁ দেওয়া (জাদুকরীরা)", ms: "Peniup (buhul-buhul) — tukang sihir" },
    correctVerseMeaningTranslations: { en: "And from the evil of the blowers in knots", ar: "ومن شر النفاثات في العقد", id: "Dan dari kejahatan peniup buhul-buhul", tr: "Düğümlere üfleyenlerin şerrinden", zh: "以及吹结者的恶", sw: "Na shari ya wanaopuliza vifungo", so: "Sharriga Afuufayaasha Xididdaha", bs: "I od zla onih koje pušu u čvorove", sq: "Dhe nga e keqja e atyre që fryjnë në nyje", ru: "И от зла дующих в узлы", ur: "اور گانٹھوں میں پھونکنے والیوں کے شر سے", bn: "এবং গিঁটে ফুঁ দেওয়াদের অনিষ্ট থেকে", ms: "Dan dari kejahatan para peniup buhul-buhul" },
    surahAyah: "الفلق:4", ayahNumber: 4,
    hint: "من يعمل السحر بالنفخ في العقد",
    correctVerse: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
    correctVerseMeaning: "And from the evil of the blowers in knots",
    options: [{ text: "النَّفَّاثَاتِ", isCorrect: true }, { text: "الْحَاسِدِ", isCorrect: false }, { text: "الْوَسْوَاسِ", isCorrect: false }, { text: "الشَّيَاطِينِ", isCorrect: false }],
  },

  // ═══════════════════════════════════════
  // AN-NAS (سورة الناس) — 114
  // ═══════════════════════════════════════
  {
    id: "jz_nas_1", surahAr: "الناس", surahEn: "An-Nas",
    targetWord: "النَّاسِ",
    targetWordMeaning: "Mankind / People",
    targetWordTranslations: { en: "Mankind / People", ar: "البشر جميعاً", id: "Manusia", tr: "İnsanlar", zh: "人类/众人", sw: "Watu / Wanadamu", so: "Dadka", bs: "Ljudi / Čovječanstvo", sq: "Njerëzit / Njerëzimi", ru: "Люди / Человечество", ur: "لوگ/انسانیت", bn: "মানুষ", ms: "Manusia" },
    correctVerseMeaningTranslations: { en: "Say, I seek refuge in the Lord of mankind", ar: "قل أعوذ برب الناس", id: "Katakanlah: Aku berlindung kepada Tuhan manusia", tr: "De ki: İnsanların Rabbine sığınırım", zh: "说：我求庇于人类的主", sw: "Sema: Ninajikinga kwa Mola wa wanadamu", so: "Dheh: Waxaan ku magangalay Rabbiga Dadka", bs: "Reci: Utječem se Gospodaru ljudi", sq: "Thuaj: Kërkoj strehim tek Zoti i njerëzve", ru: "Скажи: Прибегаю к Господу людей", ur: "کہو: میں لوگوں کے رب کی پناہ مانگتا ہوں", bn: "বলো: আমি মানুষের রবের কাছে আশ্রয় চাই", ms: "Katakanlah: Aku berlindung kepada Tuhan sekalian manusia" },
    surahAyah: "الناس:1", ayahNumber: 1,
    hint: "جميع البشر — آدم وذريته",
    correctVerse: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    correctVerseMeaning: "Say, I seek refuge in the Lord of mankind",
    options: [{ text: "النَّاسِ", isCorrect: true }, { text: "الْجِنَّةِ", isCorrect: false }, { text: "الشَّيَاطِينِ", isCorrect: false }, { text: "الْمَلائِكَةِ", isCorrect: false }],
  },
  {
    id: "jz_nas_2", surahAr: "الناس", surahEn: "An-Nas",
    targetWord: "الْوَسْوَاسِ",
    targetWordMeaning: "The Whisperer",
    targetWordTranslations: { en: "The Whisperer (Evil Whispering)", ar: "الموسوس الذي يوسوس في القلوب", id: "Pembisik (jahat)", tr: "Vesvese veren (Fısıldayan şeytan)", zh: "低声诱惑者", sw: "Mwenye kubishabisha", so: "Ku Xusxusaya", bs: "Šaputavac / Napasnik", sq: "Ai që fëshfërit", ru: "Нашёптывающий", ur: "وسوسہ ڈالنے والا", bn: "কুমন্ত্রণাদাতা", ms: "Yang membisikkan" },
    correctVerseMeaningTranslations: { en: "From the evil of the retreating whisperer", ar: "من شر الوسواس الخناس", id: "Dari kejahatan pembisik yang bersembunyi", tr: "Geri çekilen vesvese verenin şerrinden", zh: "免于退缩的低声诱惑者的危害", sw: "Kutoka shari ya mwenye kubishabisha anayejificha", so: "Sharriga Waswaasigu Xannaasiga", bs: "Od zla šaputavca koji se krije", sq: "Nga e keqja e gënjeshtrarit që tërhiqet", ru: "От зла отступающего нашёптывателя", ur: "پیچھے ہٹنے والے وسوسہ ڈالنے والے کے شر سے", bn: "পিছু হটা কুমন্ত্রণাদাতার অনিষ্ট থেকে", ms: "Dari kejahatan pembisik yang bersembunyi" },
    surahAyah: "الناس:4", ayahNumber: 4,
    hint: "الشيطان الذي يهمس في قلوب الناس",
    correctVerse: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    correctVerseMeaning: "From the evil of the retreating whisperer",
    options: [{ text: "الْوَسْوَاسِ", isCorrect: true }, { text: "الْخَنَّاسِ", isCorrect: false }, { text: "الشَّيَاطِينِ", isCorrect: false }, { text: "الْجِنَّةِ", isCorrect: false }],
  },
  {
    id: "jz_nas_3", surahAr: "الناس", surahEn: "An-Nas",
    targetWord: "الْخَنَّاسِ",
    targetWordMeaning: "The One Who Retreats / Slinks Away",
    targetWordTranslations: { en: "The One Who Retreats / Slinks Away", ar: "المتراجع الذي يختفي عند ذكر الله", id: "Yang mundur (ketika Allah disebut)", tr: "Geri çekilen (Allah anıldığında kaçan)", zh: "退缩者（提到真主时溜走的）", sw: "Anayerudi nyuma (anapotajwa Allah)", so: "Guuraya (markuu xusuusto Allah)", bs: "Onaj koji se povlači (kad se Allah pomene)", sq: "Ai që tërhiqet (kur përmendet Allahu)", ru: "Тот, кто отступает (когда поминают Аллаха)", ur: "پیچھے ہٹنے والا (اللہ کا ذکر ہونے پر بھاگنے والا)", bn: "যে পিছু হটে (আল্লাহর স্মরণে)", ms: "Yang bersembunyi (apabila Allah disebut)" },
    correctVerseMeaningTranslations: { en: "From the evil of the retreating whisperer", ar: "من شر الوسواس الخناس", id: "Dari kejahatan pembisik yang bersembunyi", tr: "Geri çekilen vesvese verenin şerrinden", zh: "免于退缩的低声诱惑者的危害", sw: "Kutoka shari ya mwenye kubishabisha anayejificha", so: "Sharriga Waswaasigu Xannaasiga", bs: "Od zla šaputavca koji se krije", sq: "Nga e keqja e gënjeshtrarit që tërhiqet", ru: "От зла отступающего нашёптывателя", ur: "پیچھے ہٹنے والے وسوسہ ڈالنے والے کے شر سے", bn: "পিছু হটা কুমন্ত্রণাদাতার অনিষ্ট থেকে", ms: "Dari kejahatan pembisik yang bersembunyi" },
    surahAyah: "الناس:4", ayahNumber: 4,
    hint: "يتراجع عن الإنسان فور ذِكره لله",
    correctVerse: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    correctVerseMeaning: "From the evil of the retreating whisperer",
    options: [{ text: "الْخَنَّاسِ", isCorrect: true }, { text: "الْوَسْوَاسِ", isCorrect: false }, { text: "الشَّيَاطِينِ", isCorrect: false }, { text: "الْجِنَّةِ", isCorrect: false }],
  },
];
