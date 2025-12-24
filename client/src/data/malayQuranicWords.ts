export interface MalayQuranicWord {
  malayWord: string;
  arabicWord: string;
  root: string;
  exampleSentence: string;
  derivatives: { arabic: string; malay: string }[];
}

export const malayQuranicWords: MalayQuranicWord[] = [
  {
    malayWord: "Rahmat",
    arabicWord: "رحمة",
    root: "ر ح م",
    exampleSentence: "Semoga Allah melimpahkan rahmat-Nya.",
    derivatives: [
      { arabic: "رحمة", malay: "rahmat" },
      { arabic: "رحيم", malay: "Rahim / penyayang" },
      { arabic: "رحمن", malay: "Ar-Rahman" },
      { arabic: "يرحم", malay: "merahmati" }
    ]
  },
  {
    malayWord: "Nikmat",
    arabicWord: "نعمة",
    root: "ن ع م",
    exampleSentence: "Ini nikmat yang besar.",
    derivatives: [
      { arabic: "نعمة", malay: "nikmat / ni'mat" },
      { arabic: "نِعَم", malay: "nikmat-nikmat" },
      { arabic: "أنعم", malay: "memberi nikmat / mengurniakan" }
    ]
  },
  {
    malayWord: "Hikmah",
    arabicWord: "حكمة",
    root: "ح ك م",
    exampleSentence: "Bertindak dengan hikmah.",
    derivatives: [
      { arabic: "حكمة", malay: "hikmah" },
      { arabic: "حكيم", malay: "hakim / bijaksana" },
      { arabic: "حكم", malay: "hukum / keputusan" }
    ]
  },
  {
    malayWord: "Adil",
    arabicWord: "عدل",
    root: "ع د ل",
    exampleSentence: "Berlaku adil kepada semua.",
    derivatives: [
      { arabic: "عدل", malay: "adil / keadilan" },
      { arabic: "عادل", malay: "orang yang adil" },
      { arabic: "يعدل", malay: "berlaku adil" }
    ]
  },
  {
    malayWord: "Zalim",
    arabicWord: "ظلم",
    root: "ظ ل م",
    exampleSentence: "Jangan bersikap zalim.",
    derivatives: [
      { arabic: "ظلم", malay: "zalim / kezaliman" },
      { arabic: "ظالم", malay: "orang zalim" },
      { arabic: "يظلم", malay: "menzalimi" }
    ]
  },
  {
    malayWord: "Hak",
    arabicWord: "حق",
    root: "ح ق ق",
    exampleSentence: "Itu hak saya.",
    derivatives: [
      { arabic: "حق", malay: "hak / kebenaran" },
      { arabic: "أحق", malay: "lebih berhak" },
      { arabic: "حقيق", malay: "benar / layak" }
    ]
  },
  {
    malayWord: "Batil",
    arabicWord: "باطل",
    root: "ب ط ل",
    exampleSentence: "Itu dakwaan batil.",
    derivatives: [
      { arabic: "باطل", malay: "batil" },
      { arabic: "يبطل", malay: "membatalkan" },
      { arabic: "إبطال", malay: "pembatalan" }
    ]
  },
  {
    malayWord: "Nur",
    arabicWord: "نور",
    root: "ن و ر",
    exampleSentence: "Nur iman menerangi hati.",
    derivatives: [
      { arabic: "نور", malay: "nur" },
      { arabic: "منير", malay: "menerangi / bercahaya" },
      { arabic: "أنار", malay: "menerangkan / memberi cahaya" }
    ]
  },
  {
    malayWord: "Syifa",
    arabicWord: "شفاء",
    root: "ش ف ي",
    exampleSentence: "Semoga Allah memberi syifa.",
    derivatives: [
      { arabic: "شفاء", malay: "syifa" },
      { arabic: "يشفي", malay: "menyembuhkan" },
      { arabic: "اشفِ", malay: "sembuhkanlah (doa)" }
    ]
  },
  {
    malayWord: "Rezeki",
    arabicWord: "رزق",
    root: "ر ز ق",
    exampleSentence: "Rezeki datang dari Allah.",
    derivatives: [
      { arabic: "رزق", malay: "rezeki" },
      { arabic: "يرزق", malay: "memberi rezeki" },
      { arabic: "رازق", malay: "pemberi rezeki" }
    ]
  },
  {
    malayWord: "Azab",
    arabicWord: "عذاب",
    root: "ع ذ ب",
    exampleSentence: "Dia takut azab.",
    derivatives: [
      { arabic: "عذاب", malay: "azab" },
      { arabic: "يعذب", malay: "mengazab" },
      { arabic: "عذابي", malay: "azab-Ku" }
    ]
  },
  {
    malayWord: "Hisab",
    arabicWord: "حساب",
    root: "ح س ب",
    exampleSentence: "Hari hisab pasti tiba.",
    derivatives: [
      { arabic: "حساب", malay: "hisab" },
      { arabic: "يحسب", malay: "menghitung / menyangka" },
      { arabic: "حسيب", malay: "Yang Menghisab / mencukupi" }
    ]
  },
  {
    malayWord: "Jaza",
    arabicWord: "جزاء",
    root: "ج ز ي",
    exampleSentence: "Setiap amal ada jaza.",
    derivatives: [
      { arabic: "جزاء", malay: "jaza / balasan" },
      { arabic: "يجزي", malay: "membalas / memberi ganjaran" }
    ]
  },
  {
    malayWord: "Mizan",
    arabicWord: "ميزان",
    root: "و ز ن",
    exampleSentence: "Mizan keadilan di akhirat.",
    derivatives: [
      { arabic: "ميزان", malay: "mizan" },
      { arabic: "وزن", malay: "timbang / ukuran" },
      { arabic: "موازين", malay: "timbangan-timbangan" }
    ]
  },
  {
    malayWord: "Sultan",
    arabicWord: "سلطان",
    root: "س ل ط",
    exampleSentence: "Sultan memerintah negeri.",
    derivatives: [
      { arabic: "سلطان", malay: "sultan / kekuasaan / hujah" },
      { arabic: "سلطة", malay: "kuasa / autoriti" },
      { arabic: "تسلط", malay: "menindas / menguasai" }
    ]
  },
  {
    malayWord: "Mulk",
    arabicWord: "مُلك",
    root: "م ل ك",
    exampleSentence: "Mulk milik Allah.",
    derivatives: [
      { arabic: "مُلك", malay: "mulk / kerajaan" },
      { arabic: "ملك", malay: "raja" },
      { arabic: "مالك", malay: "pemilik" }
    ]
  },
  {
    malayWord: "Sebab",
    arabicWord: "سبب",
    root: "س ب ب",
    exampleSentence: "Apa sebabnya?",
    derivatives: [
      { arabic: "سبب", malay: "sebab" },
      { arabic: "أسباب", malay: "sebab-sebab" },
      { arabic: "بسبب", malay: "disebabkan / kerana" }
    ]
  },
  {
    malayWord: "Amar",
    arabicWord: "أمر",
    root: "أ م ر",
    exampleSentence: "Amar makruf nahi mungkar.",
    derivatives: [
      { arabic: "أمر", malay: "amar / perintah" },
      { arabic: "يأمر", malay: "memerintah / menyuruh" },
      { arabic: "مأمور", malay: "yang diperintah" }
    ]
  },
  {
    malayWord: "Amanah",
    arabicWord: "أمانة",
    root: "أ م ن",
    exampleSentence: "Ini satu amanah.",
    derivatives: [
      { arabic: "أمانة", malay: "amanah" },
      { arabic: "أمين", malay: "amin / dipercayai" },
      { arabic: "أمن", malay: "aman / keamanan" }
    ]
  },
  {
    malayWord: "Fitnah",
    arabicWord: "فتنة",
    root: "ف ت ن",
    exampleSentence: "Jangan sebarkan fitnah.",
    derivatives: [
      { arabic: "فتنة", malay: "fitnah / ujian" },
      { arabic: "يفتن", malay: "memfitnah / menguji" },
      { arabic: "مفتون", malay: "terpedaya" }
    ]
  },
  {
    malayWord: "Bala",
    arabicWord: "بلاء",
    root: "ب ل و",
    exampleSentence: "Itu bala dan ujian.",
    derivatives: [
      { arabic: "بلاء", malay: "bala / ujian" },
      { arabic: "ابتلاء", malay: "ujian / cubaan" },
      { arabic: "مبتلى", malay: "yang diuji" }
    ]
  },
  {
    malayWord: "Ibrah",
    arabicWord: "عبرة",
    root: "ع ب ر",
    exampleSentence: "Ambil ibrah daripada kisah itu.",
    derivatives: [
      { arabic: "عبرة", malay: "ibrah" },
      { arabic: "اعتبار", malay: "mengambil iktibar" },
      { arabic: "عبور", malay: "melintas" }
    ]
  },
  {
    malayWord: "Syahid",
    arabicWord: "شهيد",
    root: "ش ه د",
    exampleSentence: "Dia gugur syahid.",
    derivatives: [
      { arabic: "شاهد", malay: "saksi" },
      { arabic: "شهادة", malay: "syahadah" },
      { arabic: "شهيد", malay: "syahid" },
      { arabic: "يشهد", malay: "bersaksi" }
    ]
  },
  {
    malayWord: "Insan",
    arabicWord: "إنسان",
    root: "أ ن س",
    exampleSentence: "Insan sering lalai.",
    derivatives: [
      { arabic: "إنسان", malay: "insan" },
      { arabic: "إنس", malay: "manusia (lawan jin)" },
      { arabic: "أنس", malay: "mesra / keakraban" }
    ]
  },
  {
    malayWord: "Hayat",
    arabicWord: "حياة",
    root: "ح ي ي",
    exampleSentence: "Menghayati kehidupan (hayat).",
    derivatives: [
      { arabic: "حياة", malay: "hayat" },
      { arabic: "حي", malay: "hidup" },
      { arabic: "يحيي", malay: "menghidupkan" },
      { arabic: "محيي", malay: "Yang Menghidupkan" }
    ]
  },
  {
    malayWord: "Dunia",
    arabicWord: "دنيا",
    root: "د ن و",
    exampleSentence: "Dunia ini sementara.",
    derivatives: [
      { arabic: "دنيا", malay: "dunia" },
      { arabic: "أدنى", malay: "lebih dekat / lebih rendah" },
      { arabic: "يدنو", malay: "mendekat" }
    ]
  },
  {
    malayWord: "Akhirat",
    arabicWord: "آخرة",
    root: "أ خ ر",
    exampleSentence: "Kejar akhirat.",
    derivatives: [
      { arabic: "آخرة", malay: "akhirat" },
      { arabic: "آخر", malay: "akhir / yang terakhir" },
      { arabic: "يؤخر", malay: "menangguhkan" }
    ]
  },
  {
    malayWord: "Kiamat",
    arabicWord: "قيامة",
    root: "ق و م",
    exampleSentence: "Hari kiamat pasti datang.",
    derivatives: [
      { arabic: "قيامة", malay: "kiamat" },
      { arabic: "يقوم", malay: "bangkit / berdiri" },
      { arabic: "قائم", malay: "berdiri" }
    ]
  },
  {
    malayWord: "Saat",
    arabicWord: "ساعة",
    root: "س ا ع",
    exampleSentence: "Pada saat itu…",
    derivatives: [
      { arabic: "ساعة", malay: "saat" },
      { arabic: "الساعات", malay: "saat-saat" },
      { arabic: "سعي", malay: "sa'ie / usaha" }
    ]
  },
  {
    malayWord: "Din",
    arabicWord: "دين",
    root: "د ي ن",
    exampleSentence: "Din ini sempurna.",
    derivatives: [
      { arabic: "دين", malay: "din" },
      { arabic: "يوم الدين", malay: "Hari Pembalasan" },
      { arabic: "ديّان", malay: "Yang Mengadili" }
    ]
  },
  {
    malayWord: "Iman",
    arabicWord: "إيمان",
    root: "أ م ن",
    exampleSentence: "Iman perlu dipelihara.",
    derivatives: [
      { arabic: "إيمان", malay: "iman" },
      { arabic: "آمن", malay: "beriman" },
      { arabic: "مؤمن", malay: "mukmin" }
    ]
  },
  {
    malayWord: "Islam",
    arabicWord: "إسلام",
    root: "س ل م",
    exampleSentence: "Islam membawa rahmat.",
    derivatives: [
      { arabic: "إسلام", malay: "Islam" },
      { arabic: "مسلم", malay: "Muslim" },
      { arabic: "سلام", malay: "salam / sejahtera" },
      { arabic: "أسلم", malay: "masuk Islam / menyerah diri" }
    ]
  },
  {
    malayWord: "Muslim",
    arabicWord: "مسلم",
    root: "س ل م",
    exampleSentence: "Dia seorang Muslim.",
    derivatives: [
      { arabic: "مسلم", malay: "Muslim" },
      { arabic: "مسلمين", malay: "umat Islam (jamak)" }
    ]
  },
  {
    malayWord: "Mukmin",
    arabicWord: "مؤمن",
    root: "أ م ن",
    exampleSentence: "Mukmin sejati taat.",
    derivatives: [
      { arabic: "مؤمن", malay: "mukmin" },
      { arabic: "مؤمنين", malay: "orang-orang beriman" },
      { arabic: "آمنوا", malay: "mereka beriman" }
    ]
  },
  {
    malayWord: "Kafir",
    arabicWord: "كافر",
    root: "ك ف ر",
    exampleSentence: "Jangan ikut jalan kafir.",
    derivatives: [
      { arabic: "كافر", malay: "kafir" },
      { arabic: "كفر", malay: "kufur" },
      { arabic: "يكفر", malay: "mengkufuri / mengingkari" }
    ]
  },
  {
    malayWord: "Munafik",
    arabicWord: "منافق",
    root: "ن ف ق",
    exampleSentence: "Sifat munafik merosakkan.",
    derivatives: [
      { arabic: "منافق", malay: "munafik" },
      { arabic: "نفاق", malay: "nifak / kemunafikan" },
      { arabic: "نافق", malay: "bersikap munafik" }
    ]
  },
  {
    malayWord: "Musyrik",
    arabicWord: "مشرك",
    root: "ش ر ك",
    exampleSentence: "Syirik itu dosa besar.",
    derivatives: [
      { arabic: "مشرك", malay: "musyrik" },
      { arabic: "شرك", malay: "syirik" },
      { arabic: "يشرك", malay: "melakukan syirik" }
    ]
  },
  {
    malayWord: "Syaitan",
    arabicWord: "شيطان",
    root: "ش ط ن",
    exampleSentence: "Syaitan menyesatkan manusia.",
    derivatives: [
      { arabic: "شيطان", malay: "syaitan" },
      { arabic: "شياطين", malay: "syaitan-syaitan" },
      { arabic: "يوسوس", malay: "membisikkan (waswas)" }
    ]
  },
  {
    malayWord: "Malaikat",
    arabicWord: "ملائكة",
    root: "م ل ك",
    exampleSentence: "Malaikat taat kepada Allah.",
    derivatives: [
      { arabic: "مَلَك", malay: "malaikat" },
      { arabic: "ملائكة", malay: "para malaikat" }
    ]
  },
  {
    malayWord: "Jannah",
    arabicWord: "جنة",
    root: "ج ن ن",
    exampleSentence: "Semoga kita masuk jannah.",
    derivatives: [
      { arabic: "جنة", malay: "jannah" },
      { arabic: "جنات", malay: "jannat / jannah-jannah" },
      { arabic: "جن", malay: "jin" }
    ]
  },
  {
    malayWord: "Jahannam",
    arabicWord: "جهنم",
    root: "ج ه ن م",
    exampleSentence: "Berlindung daripada jahannam.",
    derivatives: [
      { arabic: "جهنم", malay: "jahannam" },
      { arabic: "جحيم", malay: "jahim (api yang sangat panas)" },
      { arabic: "نار", malay: "api" }
    ]
  },
  {
    malayWord: "Masjid",
    arabicWord: "مسجد",
    root: "س ج د",
    exampleSentence: "Kita solat di masjid.",
    derivatives: [
      { arabic: "مسجد", malay: "masjid" },
      { arabic: "سجد", malay: "sujud" },
      { arabic: "سجود", malay: "sujud" },
      { arabic: "ساجدين", malay: "orang yang bersujud" }
    ]
  },
  {
    malayWord: "Kitab",
    arabicWord: "كتاب",
    root: "ك ت ب",
    exampleSentence: "Al-Qur'an ialah kitab suci.",
    derivatives: [
      { arabic: "كتاب", malay: "kitab" },
      { arabic: "كتب", malay: "menulis" },
      { arabic: "مكتوب", malay: "tertulis" },
      { arabic: "كاتب", malay: "penulis" }
    ]
  },
  {
    malayWord: "Qalam",
    arabicWord: "قلم",
    root: "ق ل م",
    exampleSentence: "Menulis dengan qalam.",
    derivatives: [
      { arabic: "قلم", malay: "qalam" },
      { arabic: "أقلام", malay: "aqlaam (jamak) / qalam-qalam" }
    ]
  },
  {
    malayWord: "Ayat",
    arabicWord: "آية",
    root: "أ ي ي",
    exampleSentence: "Baca ayat ini.",
    derivatives: [
      { arabic: "آية", malay: "ayat" },
      { arabic: "آيات", malay: "ayat-ayat" },
      { arabic: "بينات", malay: "bukti yang jelas" }
    ]
  },
  {
    malayWord: "Surah",
    arabicWord: "سورة",
    root: "س و ر",
    exampleSentence: "Surah Al-Fatihah.",
    derivatives: [
      { arabic: "سورة", malay: "surah" },
      { arabic: "أسوار", malay: "aswar (kota/tembok)" }
    ]
  },
  {
    malayWord: "Doa",
    arabicWord: "دعاء",
    root: "د ع و",
    exampleSentence: "Jangan lupa berdoa.",
    derivatives: [
      { arabic: "دعاء", malay: "doa" },
      { arabic: "دعا", malay: "berdoa / memohon" },
      { arabic: "يدعو", malay: "menyeru / berdoa" },
      { arabic: "دعوة", malay: "dakwah / seruan" }
    ]
  },
  {
    malayWord: "Zikir",
    arabicWord: "ذكر",
    root: "ذ ك ر",
    exampleSentence: "Perbanyakkan zikir.",
    derivatives: [
      { arabic: "ذكر", malay: "zikir" },
      { arabic: "يذكر", malay: "berzikir / mengingati" },
      { arabic: "ذكرى", malay: "peringatan" }
    ]
  },
  {
    malayWord: "Syukur",
    arabicWord: "شكر",
    root: "ش ك ر",
    exampleSentence: "Syukur kepada Allah.",
    derivatives: [
      { arabic: "شكر", malay: "syukur" },
      { arabic: "يشكر", malay: "bersyukur" },
      { arabic: "شاكر", malay: "yang bersyukur" },
      { arabic: "شكور", malay: "sangat bersyukur" }
    ]
  },
  {
    malayWord: "Sabar",
    arabicWord: "صبر",
    root: "ص ب ر",
    exampleSentence: "Bersabarlah.",
    derivatives: [
      { arabic: "صبر", malay: "sabar" },
      { arabic: "يصبر", malay: "bersabar" },
      { arabic: "صابر", malay: "orang yang sabar" },
      { arabic: "صابرين", malay: "orang-orang yang sabar" }
    ]
  }
];

export function getRandomMalayWord(): MalayQuranicWord {
  const index = Math.floor(Math.random() * malayQuranicWords.length);
  return malayQuranicWords[index];
}

export function getMalayWordByIndex(index: number): MalayQuranicWord {
  return malayQuranicWords[index % malayQuranicWords.length];
}
