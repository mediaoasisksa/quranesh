export interface IndonesianQuranicWord {
  indonesianWord: string;
  arabicWord: string;
  root: string;
  exampleSentence: string;
  derivatives: { arabic: string; indonesian: string }[];
}

export const indonesianQuranicWords: IndonesianQuranicWord[] = [
  {
    indonesianWord: "Rahmat",
    arabicWord: "رحمة",
    root: "ر ح م",
    exampleSentence: "Semoga Allah memberi rahmat-Nya.",
    derivatives: [
      { arabic: "رحمة", indonesian: "rahmat / kasih sayang" },
      { arabic: "رحيم", indonesian: "Maha Penyayang / penyayang" },
      { arabic: "رحمن", indonesian: "Maha Pengasih" },
      { arabic: "يرحم", indonesian: "merahmati / mengasihi" }
    ]
  },
  {
    indonesianWord: "Nikmat",
    arabicWord: "نعمة",
    root: "ن ع م",
    exampleSentence: "Ini nikmat yang besar.",
    derivatives: [
      { arabic: "نعمة", indonesian: "nikmat" },
      { arabic: "نعم (نِعَم)", indonesian: "nikmat-nikmat" },
      { arabic: "أنعم", indonesian: "memberi nikmat / menganugerahi" },
      { arabic: "منعم", indonesian: "pemberi nikmat" }
    ]
  },
  {
    indonesianWord: "Hikmah",
    arabicWord: "حكمة",
    root: "ح ك م",
    exampleSentence: "Bertindaklah dengan hikmah.",
    derivatives: [
      { arabic: "حكمة", indonesian: "hikmah / kebijaksanaan" },
      { arabic: "حكيم", indonesian: "bijaksana / Maha Bijaksana" },
      { arabic: "حكم", indonesian: "hukum / keputusan" },
      { arabic: "يحكم", indonesian: "memutuskan / mengadili" }
    ]
  },
  {
    indonesianWord: "Adil",
    arabicWord: "عدل",
    root: "ع د ل",
    exampleSentence: "Hakim harus adil.",
    derivatives: [
      { arabic: "عدل", indonesian: "adil / keadilan" },
      { arabic: "عدالة", indonesian: "keadilan" },
      { arabic: "عادل", indonesian: "orang yang adil" },
      { arabic: "يعدل", indonesian: "berlaku adil" }
    ]
  },
  {
    indonesianWord: "Zalim",
    arabicWord: "ظلم",
    root: "ظ ل م",
    exampleSentence: "Jangan berlaku zalim.",
    derivatives: [
      { arabic: "ظلم", indonesian: "kezaliman" },
      { arabic: "ظالم", indonesian: "zalim (pelaku)" },
      { arabic: "مظلوم", indonesian: "orang yang dizalimi" },
      { arabic: "يظلم", indonesian: "menzalimi" }
    ]
  },
  {
    indonesianWord: "Hak",
    arabicWord: "حق",
    root: "ح ق ق",
    exampleSentence: "Itu hak saya.",
    derivatives: [
      { arabic: "حق", indonesian: "hak / kebenaran" },
      { arabic: "حقيقة", indonesian: "kenyataan" },
      { arabic: "أحق", indonesian: "lebih berhak" },
      { arabic: "يحق", indonesian: "benar/layak terjadi" }
    ]
  },
  {
    indonesianWord: "Batil",
    arabicWord: "باطل",
    root: "ب ط ل",
    exampleSentence: "Itu tuduhan batil.",
    derivatives: [
      { arabic: "باطل", indonesian: "batil / salah" },
      { arabic: "يبطل", indonesian: "membatalkan / menggugurkan" },
      { arabic: "إبطال", indonesian: "pembatalan" },
      { arabic: "مُبطِل", indonesian: "yang membatalkan" }
    ]
  },
  {
    indonesianWord: "Nur",
    arabicWord: "نور",
    root: "ن و ر",
    exampleSentence: "Nur iman menerangi hati.",
    derivatives: [
      { arabic: "نور", indonesian: "nur / cahaya" },
      { arabic: "منير", indonesian: "yang menerangi" },
      { arabic: "أنار", indonesian: "menerangi" },
      { arabic: "ينير", indonesian: "menerangi (sedang/terus)" }
    ]
  },
  {
    indonesianWord: "Syifa",
    arabicWord: "شفاء",
    root: "ش ف ي",
    exampleSentence: "Semoga cepat mendapat syifa.",
    derivatives: [
      { arabic: "شفاء", indonesian: "syifa / kesembuhan" },
      { arabic: "يشفي", indonesian: "menyembuhkan" },
      { arabic: "شافٍ", indonesian: "penyembuh / yang menyembuhkan" },
      { arabic: "استشفاء", indonesian: "mencari kesembuhan" }
    ]
  },
  {
    indonesianWord: "Rezeki",
    arabicWord: "رزق",
    root: "ر ز ق",
    exampleSentence: "Rezeki sudah diatur Allah.",
    derivatives: [
      { arabic: "رزق", indonesian: "rezeki" },
      { arabic: "يرزق", indonesian: "memberi rezeki" },
      { arabic: "رزاق", indonesian: "Maha Pemberi rezeki" },
      { arabic: "مرزوق", indonesian: "yang diberi rezeki" }
    ]
  },
  {
    indonesianWord: "Azab",
    arabicWord: "عذاب",
    root: "ع ذ ب",
    exampleSentence: "Ia takut azab Allah.",
    derivatives: [
      { arabic: "عذاب", indonesian: "azab / siksaan" },
      { arabic: "يعذب", indonesian: "menyiksa" },
      { arabic: "معذب", indonesian: "yang disiksa" },
      { arabic: "عذاب أليم", indonesian: "azab yang pedih" }
    ]
  },
  {
    indonesianWord: "Hisab",
    arabicWord: "حساب",
    root: "ح س ب",
    exampleSentence: "Hari hisab akan datang.",
    derivatives: [
      { arabic: "حساب", indonesian: "hisab / perhitungan" },
      { arabic: "يحسب", indonesian: "menghitung / mengira" },
      { arabic: "حسيب", indonesian: "Yang Maha Menghitung" },
      { arabic: "محاسبة", indonesian: "perhitungan / evaluasi" }
    ]
  },
  {
    indonesianWord: "Jaza",
    arabicWord: "جزاء",
    root: "ج ز ي",
    exampleSentence: "Setiap amal ada jazanya.",
    derivatives: [
      { arabic: "جزاء", indonesian: "jaza / balasan" },
      { arabic: "يجزي", indonesian: "membalas" },
      { arabic: "مجازاة", indonesian: "pembalasan" },
      { arabic: "جزى الله خيرًا", indonesian: "semoga Allah membalas kebaikan" }
    ]
  },
  {
    indonesianWord: "Mizan",
    arabicWord: "ميزان",
    root: "و ز ن",
    exampleSentence: "Amal akan ditimbang di mizan.",
    derivatives: [
      { arabic: "ميزان", indonesian: "mizan / timbangan" },
      { arabic: "وزن", indonesian: "berat / timbangan" },
      { arabic: "يزن", indonesian: "menimbang" },
      { arabic: "موازين", indonesian: "timbangan-timbangan" }
    ]
  },
  {
    indonesianWord: "Sultan",
    arabicWord: "سلطان",
    root: "س ل ط",
    exampleSentence: "Sultan memerintah negeri.",
    derivatives: [
      { arabic: "سلطان", indonesian: "sultan / kekuasaan" },
      { arabic: "سلطة", indonesian: "kekuasaan / wewenang" },
      { arabic: "تسلط", indonesian: "menguasai / mendominasi" },
      { arabic: "مسلط", indonesian: "yang berkuasa" }
    ]
  },
  {
    indonesianWord: "Mulk",
    arabicWord: "مُلك",
    root: "م ل ك",
    exampleSentence: "Allah pemilik seluruh mulk.",
    derivatives: [
      { arabic: "مُلك", indonesian: "kerajaan / kekuasaan" },
      { arabic: "ملك", indonesian: "raja / malaikat" },
      { arabic: "مالك", indonesian: "pemilik" },
      { arabic: "يملك", indonesian: "memiliki" }
    ]
  },
  {
    indonesianWord: "Sebab",
    arabicWord: "سبب",
    root: "س ب ب",
    exampleSentence: "Apa sebabnya?",
    derivatives: [
      { arabic: "سبب", indonesian: "sebab / alasan" },
      { arabic: "أسباب", indonesian: "sebab-sebab" },
      { arabic: "بسبب", indonesian: "karena / disebabkan" },
      { arabic: "مسبب", indonesian: "penyebab" }
    ]
  },
  {
    indonesianWord: "Amr",
    arabicWord: "أمر",
    root: "أ م ر",
    exampleSentence: "Ini amr dari Allah.",
    derivatives: [
      { arabic: "أمر", indonesian: "perintah / urusan" },
      { arabic: "يأمر", indonesian: "memerintah" },
      { arabic: "أمير", indonesian: "amir / pemimpin" },
      { arabic: "مأمور", indonesian: "yang diperintah" }
    ]
  },
  {
    indonesianWord: "Amanah",
    arabicWord: "أمانة",
    root: "أ م ن",
    exampleSentence: "Jaga amanah yang diberikan.",
    derivatives: [
      { arabic: "أمانة", indonesian: "amanah / kepercayaan" },
      { arabic: "أمين", indonesian: "dapat dipercaya" },
      { arabic: "أمن", indonesian: "aman / keamanan" },
      { arabic: "مؤتمن", indonesian: "orang yang dipercaya" }
    ]
  },
  {
    indonesianWord: "Fitnah",
    arabicWord: "فتنة",
    root: "ف ت ن",
    exampleSentence: "Jangan menyebarkan fitnah.",
    derivatives: [
      { arabic: "فتنة", indonesian: "fitnah / ujian" },
      { arabic: "يفتن", indonesian: "memfitnah / menguji" },
      { arabic: "مفتون", indonesian: "yang terfitnah / tergoda" },
      { arabic: "فتان", indonesian: "penggoda / pembuat fitnah" }
    ]
  },
  {
    indonesianWord: "Bala",
    arabicWord: "بلاء",
    root: "ب ل و",
    exampleSentence: "Ini bala yang besar.",
    derivatives: [
      { arabic: "بلاء", indonesian: "bala / ujian" },
      { arabic: "ابتلاء", indonesian: "ujian / cobaan" },
      { arabic: "مبتلى", indonesian: "yang diuji" },
      { arabic: "يبتلي", indonesian: "menguji" }
    ]
  },
  {
    indonesianWord: "Ibrah",
    arabicWord: "عبرة",
    root: "ع ب ر",
    exampleSentence: "Ambil ibrah dari kisah ini.",
    derivatives: [
      { arabic: "عبرة", indonesian: "ibrah / pelajaran" },
      { arabic: "اعتبار", indonesian: "pertimbangan / pelajaran" },
      { arabic: "عبور", indonesian: "menyeberang / melewati" },
      { arabic: "معتبر", indonesian: "yang dipertimbangkan" }
    ]
  },
  {
    indonesianWord: "Syahid",
    arabicWord: "شاهد",
    root: "ش ه د",
    exampleSentence: "Dia adalah syahid.",
    derivatives: [
      { arabic: "شاهد", indonesian: "saksi" },
      { arabic: "شهيد", indonesian: "syahid / martir" },
      { arabic: "شهادة", indonesian: "kesaksian / syahadat" },
      { arabic: "يشهد", indonesian: "menyaksikan" }
    ]
  },
  {
    indonesianWord: "Insan",
    arabicWord: "إنسان",
    root: "أ ن س",
    exampleSentence: "Insan diciptakan dari tanah.",
    derivatives: [
      { arabic: "إنسان", indonesian: "insan / manusia" },
      { arabic: "إنس", indonesian: "manusia (lawan jin)" },
      { arabic: "أنس", indonesian: "keakraban" },
      { arabic: "إنسانية", indonesian: "kemanusiaan" }
    ]
  },
  {
    indonesianWord: "Hayat",
    arabicWord: "حياة",
    root: "ح ي ي",
    exampleSentence: "Hayat dunia hanya sementara.",
    derivatives: [
      { arabic: "حياة", indonesian: "hayat / kehidupan" },
      { arabic: "حي", indonesian: "hidup / Yang Maha Hidup" },
      { arabic: "يحيي", indonesian: "menghidupkan" },
      { arabic: "إحياء", indonesian: "menghidupkan / kebangkitan" }
    ]
  },
  {
    indonesianWord: "Dunia",
    arabicWord: "دنيا",
    root: "د ن و",
    exampleSentence: "Dunia hanya tempat singgah.",
    derivatives: [
      { arabic: "دنيا", indonesian: "dunia" },
      { arabic: "أدنى", indonesian: "lebih dekat / lebih rendah" },
      { arabic: "يدنو", indonesian: "mendekat" },
      { arabic: "دنيوي", indonesian: "duniawi" }
    ]
  },
  {
    indonesianWord: "Akhirat",
    arabicWord: "آخرة",
    root: "أ خ ر",
    exampleSentence: "Bekal untuk akhirat.",
    derivatives: [
      { arabic: "آخرة", indonesian: "akhirat" },
      { arabic: "آخر", indonesian: "akhir / terakhir" },
      { arabic: "يؤخر", indonesian: "mengakhirkan" },
      { arabic: "أخروي", indonesian: "bersifat akhirat" }
    ]
  },
  {
    indonesianWord: "Kiamat",
    arabicWord: "قيامة",
    root: "ق و م",
    exampleSentence: "Hari kiamat pasti datang.",
    derivatives: [
      { arabic: "قيامة", indonesian: "kiamat / kebangkitan" },
      { arabic: "يقوم", indonesian: "berdiri / bangkit" },
      { arabic: "قائم", indonesian: "yang berdiri / tegak" },
      { arabic: "إقامة", indonesian: "mendirikan / menegakkan" }
    ]
  },
  {
    indonesianWord: "Saat",
    arabicWord: "ساعة",
    root: "س و ع",
    exampleSentence: "Saat itu akan datang.",
    derivatives: [
      { arabic: "ساعة", indonesian: "saat / jam" },
      { arabic: "الساعة", indonesian: "hari kiamat" },
      { arabic: "ساعات", indonesian: "jam-jam / waktu-waktu" },
      { arabic: "سعي", indonesian: "usaha / berusaha" }
    ]
  },
  {
    indonesianWord: "Din",
    arabicWord: "دين",
    root: "د ي ن",
    exampleSentence: "Islam adalah din yang benar.",
    derivatives: [
      { arabic: "دين", indonesian: "din / agama" },
      { arabic: "يوم الدين", indonesian: "hari pembalasan" },
      { arabic: "ديّان", indonesian: "Yang Maha Menghakimi" },
      { arabic: "متدين", indonesian: "yang beragama" }
    ]
  },
  {
    indonesianWord: "Iman",
    arabicWord: "إيمان",
    root: "أ م ن",
    exampleSentence: "Iman harus diperkuat.",
    derivatives: [
      { arabic: "إيمان", indonesian: "iman / kepercayaan" },
      { arabic: "آمن", indonesian: "beriman" },
      { arabic: "مؤمن", indonesian: "mukmin / orang beriman" },
      { arabic: "مؤمنين", indonesian: "orang-orang beriman" }
    ]
  },
  {
    indonesianWord: "Islam",
    arabicWord: "إسلام",
    root: "س ل م",
    exampleSentence: "Islam adalah agama damai.",
    derivatives: [
      { arabic: "إسلام", indonesian: "Islam / kepasrahan" },
      { arabic: "مسلم", indonesian: "muslim" },
      { arabic: "سلام", indonesian: "salam / kedamaian" },
      { arabic: "أسلم", indonesian: "masuk Islam / berserah diri" }
    ]
  },
  {
    indonesianWord: "Muslim",
    arabicWord: "مسلم",
    root: "س ل م",
    exampleSentence: "Dia adalah seorang muslim.",
    derivatives: [
      { arabic: "مسلم", indonesian: "muslim" },
      { arabic: "مسلمون", indonesian: "kaum muslimin" },
      { arabic: "مسلمة", indonesian: "muslimah" },
      { arabic: "تسليم", indonesian: "penyerahan / kepasrahan" }
    ]
  },
  {
    indonesianWord: "Mukmin",
    arabicWord: "مؤمن",
    root: "أ م ن",
    exampleSentence: "Seorang mukmin yang taat.",
    derivatives: [
      { arabic: "مؤمن", indonesian: "mukmin / orang beriman" },
      { arabic: "مؤمنين", indonesian: "orang-orang beriman" },
      { arabic: "إيمان", indonesian: "iman / keimanan" },
      { arabic: "آمين", indonesian: "amin" }
    ]
  },
  {
    indonesianWord: "Kafir",
    arabicWord: "كافر",
    root: "ك ف ر",
    exampleSentence: "Kafir menolak kebenaran.",
    derivatives: [
      { arabic: "كافر", indonesian: "kafir / yang mengingkari" },
      { arabic: "كفر", indonesian: "kekufuran" },
      { arabic: "يكفر", indonesian: "mengingkari" },
      { arabic: "كافرين", indonesian: "orang-orang kafir" }
    ]
  },
  {
    indonesianWord: "Munafik",
    arabicWord: "منافق",
    root: "ن ف ق",
    exampleSentence: "Jangan jadi munafik.",
    derivatives: [
      { arabic: "منافق", indonesian: "munafik" },
      { arabic: "نفاق", indonesian: "kemunafikan" },
      { arabic: "نافق", indonesian: "bermunafik" },
      { arabic: "منافقين", indonesian: "orang-orang munafik" }
    ]
  },
  {
    indonesianWord: "Musyrik",
    arabicWord: "مشرك",
    root: "ش ر ك",
    exampleSentence: "Musyrik menyekutukan Allah.",
    derivatives: [
      { arabic: "مشرك", indonesian: "musyrik" },
      { arabic: "شرك", indonesian: "syirik / menyekutukan" },
      { arabic: "يشرك", indonesian: "menyekutukan" },
      { arabic: "مشركين", indonesian: "orang-orang musyrik" }
    ]
  },
  {
    indonesianWord: "Syaitan",
    arabicWord: "شيطان",
    root: "ش ط ن",
    exampleSentence: "Syaitan membisikkan kejahatan.",
    derivatives: [
      { arabic: "شيطان", indonesian: "syaitan / setan" },
      { arabic: "شياطين", indonesian: "setan-setan" },
      { arabic: "وسوسة", indonesian: "bisikan / godaan" },
      { arabic: "شيطاني", indonesian: "bersifat setan" }
    ]
  },
  {
    indonesianWord: "Malaikat",
    arabicWord: "ملائكة",
    root: "م ل ك",
    exampleSentence: "Malaikat turun dari langit.",
    derivatives: [
      { arabic: "مَلَك", indonesian: "malaikat (tunggal)" },
      { arabic: "ملائكة", indonesian: "malaikat (jamak)" },
      { arabic: "ملكي", indonesian: "bersifat malaikat" },
      { arabic: "رسل", indonesian: "utusan" }
    ]
  },
  {
    indonesianWord: "Jannah",
    arabicWord: "جنة",
    root: "ج ن ن",
    exampleSentence: "Mohonlah jannah kepada Allah.",
    derivatives: [
      { arabic: "جنة", indonesian: "jannah / surga" },
      { arabic: "جنات", indonesian: "surga-surga" },
      { arabic: "جن", indonesian: "jin" },
      { arabic: "جنان", indonesian: "taman-taman surga" }
    ]
  },
  {
    indonesianWord: "Jahannam",
    arabicWord: "جهنم",
    root: "ج ه ن م",
    exampleSentence: "Takutlah pada jahannam.",
    derivatives: [
      { arabic: "جهنم", indonesian: "jahannam / neraka" },
      { arabic: "جحيم", indonesian: "api yang menyala" },
      { arabic: "نار", indonesian: "api" },
      { arabic: "سقر", indonesian: "neraka (nama lain)" }
    ]
  },
  {
    indonesianWord: "Masjid",
    arabicWord: "مسجد",
    root: "س ج د",
    exampleSentence: "Pergi ke masjid untuk shalat.",
    derivatives: [
      { arabic: "مسجد", indonesian: "masjid" },
      { arabic: "سجد", indonesian: "sujud" },
      { arabic: "سجود", indonesian: "sujud / bersujud" },
      { arabic: "ساجد", indonesian: "yang bersujud" }
    ]
  },
  {
    indonesianWord: "Kitab",
    arabicWord: "كتاب",
    root: "ك ت ب",
    exampleSentence: "Al-Quran adalah kitab suci.",
    derivatives: [
      { arabic: "كتاب", indonesian: "kitab / buku" },
      { arabic: "كتب", indonesian: "menulis" },
      { arabic: "كاتب", indonesian: "penulis" },
      { arabic: "مكتوب", indonesian: "tertulis / surat" }
    ]
  },
  {
    indonesianWord: "Kalam",
    arabicWord: "كلام",
    root: "ك ل م",
    exampleSentence: "Al-Quran adalah kalam Allah.",
    derivatives: [
      { arabic: "كلام", indonesian: "kalam / perkataan" },
      { arabic: "كلمة", indonesian: "kata" },
      { arabic: "يتكلم", indonesian: "berbicara" },
      { arabic: "متكلم", indonesian: "pembicara" }
    ]
  },
  {
    indonesianWord: "Ayat",
    arabicWord: "آية",
    root: "أ ي ي",
    exampleSentence: "Baca ayat ini dengan tartil.",
    derivatives: [
      { arabic: "آية", indonesian: "ayat / tanda" },
      { arabic: "آيات", indonesian: "ayat-ayat / tanda-tanda" },
      { arabic: "بينات", indonesian: "bukti-bukti yang jelas" },
      { arabic: "آي", indonesian: "ayat-ayat" }
    ]
  },
  {
    indonesianWord: "Surah",
    arabicWord: "سورة",
    root: "س و ر",
    exampleSentence: "Hafalkan surah Al-Fatihah.",
    derivatives: [
      { arabic: "سورة", indonesian: "surah / bab" },
      { arabic: "سور", indonesian: "surah-surah / dinding" },
      { arabic: "أسوار", indonesian: "dinding-dinding" },
      { arabic: "سوّر", indonesian: "membangun dinding" }
    ]
  },
  {
    indonesianWord: "Doa",
    arabicWord: "دعاء",
    root: "د ع و",
    exampleSentence: "Panjatkan doa dengan khusyuk.",
    derivatives: [
      { arabic: "دعاء", indonesian: "doa / permohonan" },
      { arabic: "دعا", indonesian: "berdoa / memanggil" },
      { arabic: "يدعو", indonesian: "berdoa / menyeru" },
      { arabic: "داعي", indonesian: "yang berdoa / penyeru" }
    ]
  },
  {
    indonesianWord: "Zikir",
    arabicWord: "ذكر",
    root: "ذ ك ر",
    exampleSentence: "Perbanyak zikir kepada Allah.",
    derivatives: [
      { arabic: "ذكر", indonesian: "zikir / mengingat" },
      { arabic: "يذكر", indonesian: "mengingat / menyebut" },
      { arabic: "ذكرى", indonesian: "peringatan / kenangan" },
      { arabic: "تذكير", indonesian: "pengingatan" }
    ]
  },
  {
    indonesianWord: "Syukur",
    arabicWord: "شكر",
    root: "ش ك ر",
    exampleSentence: "Bersyukurlah atas nikmat.",
    derivatives: [
      { arabic: "شكر", indonesian: "syukur" },
      { arabic: "يشكر", indonesian: "bersyukur" },
      { arabic: "شاكر", indonesian: "yang bersyukur" },
      { arabic: "شكور", indonesian: "Maha Mensyukuri" }
    ]
  },
  {
    indonesianWord: "Sabar",
    arabicWord: "صبر",
    root: "ص ب ر",
    exampleSentence: "Bersabarlah dalam ujian.",
    derivatives: [
      { arabic: "صبر", indonesian: "sabar / kesabaran" },
      { arabic: "يصبر", indonesian: "bersabar" },
      { arabic: "صابر", indonesian: "yang sabar" },
      { arabic: "صبور", indonesian: "Maha Penyabar" }
    ]
  },
  {
    indonesianWord: "Taubat",
    arabicWord: "توبة",
    root: "ت و ب",
    exampleSentence: "Segera bertaubat kepada Allah.",
    derivatives: [
      { arabic: "توبة", indonesian: "taubat" },
      { arabic: "يتوب", indonesian: "bertaubat" },
      { arabic: "تائب", indonesian: "yang bertaubat" },
      { arabic: "تواب", indonesian: "Maha Penerima Taubat" }
    ]
  }
];

export function getRandomIndonesianWord(): IndonesianQuranicWord {
  const index = Math.floor(Math.random() * indonesianQuranicWords.length);
  return indonesianQuranicWords[index];
}

export function getIndonesianWordByIndex(index: number): IndonesianQuranicWord {
  return indonesianQuranicWords[index % indonesianQuranicWords.length];
}
