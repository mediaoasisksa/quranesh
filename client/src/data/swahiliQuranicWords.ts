export interface SwahiliQuranicWord {
  swahiliWord: string;
  arabicWord: string;
  root: string;
  exampleSentence: string;
  derivatives: { arabic: string; swahili: string }[];
}

export const swahiliQuranicWords: SwahiliQuranicWord[] = [
  {
    swahiliWord: "Rahma",
    arabicWord: "رحمة",
    root: "ر ح م",
    exampleSentence: "Mwenyezi Mungu akupe rahma.",
    derivatives: [
      { arabic: "رحمة", swahili: "rehema / rahma" },
      { arabic: "رحيم", swahili: "mwenye rehema / mwingi wa rehema" },
      { arabic: "يرحم", swahili: "hurehemu" }
    ]
  },
  {
    swahiliWord: "Neema",
    arabicWord: "نعمة",
    root: "ن ع م",
    exampleSentence: "Hii ni neema kubwa.",
    derivatives: [
      { arabic: "نعمة", swahili: "neema" },
      { arabic: "نعم (نِعَم)", swahili: "neema nyingi" },
      { arabic: "أنعم", swahili: "ameneemesha / ametoa neema" }
    ]
  },
  {
    swahiliWord: "Hikima",
    arabicWord: "حكمة",
    root: "ح ك م",
    exampleSentence: "Tenda kwa hikima.",
    derivatives: [
      { arabic: "حكمة", swahili: "hikima" },
      { arabic: "حكيم", swahili: "mwenye hekima / mwerevu" },
      { arabic: "حكم", swahili: "hukumu / uamuzi" }
    ]
  },
  {
    swahiliWord: "Uadilifu",
    arabicWord: "عدل",
    root: "ع د ل",
    exampleSentence: "Uadilifu ni msingi wa jamii.",
    derivatives: [
      { arabic: "عدل", swahili: "uadilifu / haki (kwa maana ya usawa)" },
      { arabic: "عادل", swahili: "mwadilifu" },
      { arabic: "يعدل", swahili: "hutenda kwa uadilifu" }
    ]
  },
  {
    swahiliWord: "Dhuluma",
    arabicWord: "ظلم",
    root: "ظ ل م",
    exampleSentence: "Hii ni dhuluma.",
    derivatives: [
      { arabic: "ظلم", swahili: "dhuluma" },
      { arabic: "ظالم", swahili: "dhalimu" },
      { arabic: "يظلم", swahili: "hudhulumu" }
    ]
  },
  {
    swahiliWord: "Haki",
    arabicWord: "حق",
    root: "ح ق ق",
    exampleSentence: "Nipe haki yangu.",
    derivatives: [
      { arabic: "حق", swahili: "haki / ukweli" },
      { arabic: "أحق", swahili: "mwenye haki zaidi" },
      { arabic: "حقيق", swahili: "kweli / sahihi" }
    ]
  },
  {
    swahiliWord: "Batili",
    arabicWord: "باطل",
    root: "ب ط ل",
    exampleSentence: "Hiyo ni imani batili.",
    derivatives: [
      { arabic: "باطل", swahili: "batili" },
      { arabic: "يبطل", swahili: "hubatilisha / huondoa uhalali" },
      { arabic: "إبطال", swahili: "ubatilishaji" }
    ]
  },
  {
    swahiliWord: "Nuru",
    arabicWord: "نور",
    root: "ن و ر",
    exampleSentence: "Nuru ya imani.",
    derivatives: [
      { arabic: "نور", swahili: "nuru" },
      { arabic: "منير", swahili: "ang'avu / yenye kuangaza" },
      { arabic: "أنار", swahili: "akaangaza / akaweka nuru" }
    ]
  },
  {
    swahiliWord: "Shifa",
    arabicWord: "شفاء",
    root: "ش ف ي",
    exampleSentence: "Mungu akupe shifa.",
    derivatives: [
      { arabic: "شفاء", swahili: "shifa" },
      { arabic: "يشفي", swahili: "huponya / hutoa shifa" },
      { arabic: "شاف", swahili: "mponyaji / mwenye kuponya" }
    ]
  },
  {
    swahiliWord: "Riziki",
    arabicWord: "رزق",
    root: "ر ز ق",
    exampleSentence: "Riziki hutoka kwa Mungu.",
    derivatives: [
      { arabic: "رزق", swahili: "riziki" },
      { arabic: "يرزق", swahili: "huruzuku / hutoa riziki" },
      { arabic: "رازق", swahili: "mruzuku / mtoa riziki" }
    ]
  },
  {
    swahiliWord: "Adhabu",
    arabicWord: "عذاب",
    root: "ع ذ ب",
    exampleSentence: "Anaogopa adhabu.",
    derivatives: [
      { arabic: "عذاب", swahili: "adhabu" },
      { arabic: "يعذب", swahili: "huadhibu" },
      { arabic: "معذب", swahili: "aliyeadhibiwa / mwenye adhabu" }
    ]
  },
  {
    swahiliWord: "Hisabu",
    arabicWord: "حساب",
    root: "ح س ب",
    exampleSentence: "Siku ya hisabu.",
    derivatives: [
      { arabic: "حساب", swahili: "hisabu" },
      { arabic: "يحسب", swahili: "huhesabu / hudhani" },
      { arabic: "حسيب", swahili: "mhisabu / mwenye kuhisabu" }
    ]
  },
  {
    swahiliWord: "Jazaa",
    arabicWord: "جزاء",
    root: "ج ز ي",
    exampleSentence: "Atapata jazaa yake.",
    derivatives: [
      { arabic: "جزاء", swahili: "jazaa / malipo" },
      { arabic: "يجزي", swahili: "hulipa / hutoa malipo" },
      { arabic: "مجزي", swahili: "aliyelipwa / mwenye malipo" }
    ]
  },
  {
    swahiliWord: "Mizani",
    arabicWord: "ميزان",
    root: "و ز ن",
    exampleSentence: "Mizani ya haki.",
    derivatives: [
      { arabic: "ميزان", swahili: "mizani" },
      { arabic: "وزن", swahili: "uzito / kipimo" },
      { arabic: "موازين", swahili: "mizani (wingi)" }
    ]
  },
  {
    swahiliWord: "Sultani",
    arabicWord: "سلطان",
    root: "س ل ط",
    exampleSentence: "Sultani wa nchi.",
    derivatives: [
      { arabic: "سلطان", swahili: "mamlaka / nguvu / sultani" },
      { arabic: "سلطة", swahili: "mamlaka" },
      { arabic: "تسلط", swahili: "kutawala kwa nguvu / kuonea" }
    ]
  },
  {
    swahiliWord: "Milki",
    arabicWord: "مُلك",
    root: "م ل ك",
    exampleSentence: "Milki ya Mungu.",
    derivatives: [
      { arabic: "مُلك", swahili: "milki / utawala" },
      { arabic: "ملك", swahili: "mfalme / malaika" },
      { arabic: "مالك", swahili: "mwenye / mmiliki" }
    ]
  },
  {
    swahiliWord: "Sababu",
    arabicWord: "سبب",
    root: "س ب ب",
    exampleSentence: "Sababu ni nini?",
    derivatives: [
      { arabic: "سبب", swahili: "sababu" },
      { arabic: "أسباب", swahili: "sababu nyingi" },
      { arabic: "بسبب", swahili: "kwa sababu ya" }
    ]
  },
  {
    swahiliWord: "Amri",
    arabicWord: "أمر",
    root: "أ م ر",
    exampleSentence: "Amri ya Mungu.",
    derivatives: [
      { arabic: "أمر", swahili: "amri / jambo" },
      { arabic: "يأمر", swahili: "huamuru" },
      { arabic: "مأمور", swahili: "aliyeamriwa" }
    ]
  },
  {
    swahiliWord: "Amana",
    arabicWord: "أمانة",
    root: "أ م ن",
    exampleSentence: "Hii ni amana.",
    derivatives: [
      { arabic: "أمانة", swahili: "amana" },
      { arabic: "أمين", swahili: "mwaminifu" },
      { arabic: "أمن", swahili: "amani / usalama" }
    ]
  },
  {
    swahiliWord: "Fitina",
    arabicWord: "فتنة",
    root: "ف ت ن",
    exampleSentence: "Usieneze fitina.",
    derivatives: [
      { arabic: "فتنة", swahili: "fitina / majaribu" },
      { arabic: "يفتن", swahili: "huchochea fitina / hujaribu" },
      { arabic: "مفتون", swahili: "aliyepotoka kwa fitina" }
    ]
  },
  {
    swahiliWord: "Bala",
    arabicWord: "بلاء",
    root: "ب ل و",
    exampleSentence: "Hii ni bala kubwa.",
    derivatives: [
      { arabic: "بلاء", swahili: "bala / mtihani" },
      { arabic: "ابتلاء", swahili: "majaribio / mitihani" },
      { arabic: "مبتلى", swahili: "aliyejaribiwa" }
    ]
  },
  {
    swahiliWord: "Ibra",
    arabicWord: "عبرة",
    root: "ع ب ر",
    exampleSentence: "Chukua ibra.",
    derivatives: [
      { arabic: "عبرة", swahili: "ibra / funzo" },
      { arabic: "اعتبار", swahili: "kuzingatia / kuchukua funzo" },
      { arabic: "عبور", swahili: "kuvuka / kupita" }
    ]
  },
  {
    swahiliWord: "Shahidi",
    arabicWord: "شاهد",
    root: "ش ه د",
    exampleSentence: "Yeye ni shahidi.",
    derivatives: [
      { arabic: "شاهد", swahili: "shahidi (mshuhuda)" },
      { arabic: "شهادة", swahili: "ushahidi" },
      { arabic: "يشهد", swahili: "hushuhudia" }
    ]
  },
  {
    swahiliWord: "Insani",
    arabicWord: "إنسان",
    root: "أ ن س",
    exampleSentence: "Utu wa insani.",
    derivatives: [
      { arabic: "إنسان", swahili: "binadamu / insani" },
      { arabic: "إنس", swahili: "watu (kinyume na majini)" },
      { arabic: "أنس", swahili: "mazoea / urafiki" }
    ]
  },
  {
    swahiliWord: "Maisha",
    arabicWord: "معيشة",
    root: "ع ي ش",
    exampleSentence: "Maisha ya dunia.",
    derivatives: [
      { arabic: "معيشة", swahili: "maisha / riziki ya kuishi" },
      { arabic: "عيش", swahili: "kuishi / maisha" },
      { arabic: "يعيش", swahili: "huishi" }
    ]
  },
  {
    swahiliWord: "Dunia",
    arabicWord: "دنيا",
    root: "د ن و",
    exampleSentence: "Dunia ni ya kupita.",
    derivatives: [
      { arabic: "دنيا", swahili: "dunia" },
      { arabic: "أدنى", swahili: "karibu zaidi / chini zaidi" },
      { arabic: "يدنو", swahili: "hukaribia" }
    ]
  },
  {
    swahiliWord: "Akhera",
    arabicWord: "آخرة",
    root: "أ خ ر",
    exampleSentence: "Fikiria akhera.",
    derivatives: [
      { arabic: "آخرة", swahili: "akhera" },
      { arabic: "آخر", swahili: "mwisho / ya mwisho" },
      { arabic: "يؤخر", swahili: "huahirisha" }
    ]
  },
  {
    swahiliWord: "Kiyama",
    arabicWord: "قيامة",
    root: "ق و م",
    exampleSentence: "Siku ya kiyama.",
    derivatives: [
      { arabic: "قيامة", swahili: "kiyama" },
      { arabic: "يقوم", swahili: "husimama / huinuka" },
      { arabic: "قائم", swahili: "aliyesimama" }
    ]
  },
  {
    swahiliWord: "Saa",
    arabicWord: "ساعة",
    root: "س ا ع",
    exampleSentence: "Subiri saa moja.",
    derivatives: [
      { arabic: "ساعة", swahili: "saa" },
      { arabic: "الساعات", swahili: "saa (wingi)" },
      { arabic: "سعي", swahili: "juhudi / kujitahidi" }
    ]
  },
  {
    swahiliWord: "Dini",
    arabicWord: "دين",
    root: "د ي ن",
    exampleSentence: "Dini ya kweli.",
    derivatives: [
      { arabic: "دين", swahili: "dini" },
      { arabic: "يوم الدين", swahili: "siku ya malipo / hisabu" },
      { arabic: "ديّان", swahili: "Mwenye kuhukumu (sifa)" }
    ]
  },
  {
    swahiliWord: "Imani",
    arabicWord: "إيمان",
    root: "أ م ن",
    exampleSentence: "Imani yangu ni thabiti.",
    derivatives: [
      { arabic: "إيمان", swahili: "imani" },
      { arabic: "آمن", swahili: "aliamini" },
      { arabic: "مؤمن", swahili: "muumini" }
    ]
  },
  {
    swahiliWord: "Uislamu",
    arabicWord: "إسلام",
    root: "س ل م",
    exampleSentence: "Uislamu ni dini ya amani.",
    derivatives: [
      { arabic: "إسلام", swahili: "Uislamu" },
      { arabic: "مسلم", swahili: "Muislamu" },
      { arabic: "سلام", swahili: "salamu / amani" }
    ]
  },
  {
    swahiliWord: "Muislamu",
    arabicWord: "مسلم",
    root: "س ل م",
    exampleSentence: "Yeye ni Muislamu.",
    derivatives: [
      { arabic: "مسلم", swahili: "Muislamu" },
      { arabic: "مسلمين", swahili: "Waislamu" },
      { arabic: "أسلم", swahili: "alisilimu / alisalimu nafsi" }
    ]
  },
  {
    swahiliWord: "Muumini",
    arabicWord: "مؤمن",
    root: "أ م ن",
    exampleSentence: "Muumini wa kweli.",
    derivatives: [
      { arabic: "مؤمن", swahili: "muumini" },
      { arabic: "مؤمنين", swahili: "waumini" },
      { arabic: "آمنوا", swahili: "waliamini" }
    ]
  },
  {
    swahiliWord: "Kafiri",
    arabicWord: "كافر",
    root: "ك ف ر",
    exampleSentence: "Kafiri.",
    derivatives: [
      { arabic: "كافر", swahili: "kafiri" },
      { arabic: "كفر", swahili: "ukafiri / kukataa" },
      { arabic: "يكفر", swahili: "hukufuru / hukataa" }
    ]
  },
  {
    swahiliWord: "Mnafiki",
    arabicWord: "منافق",
    root: "ن ف ق",
    exampleSentence: "Usiwe mnafiki.",
    derivatives: [
      { arabic: "منافق", swahili: "mnafiki" },
      { arabic: "نفاق", swahili: "unafiki" },
      { arabic: "نافق", swahili: "alifanya unafiki" }
    ]
  },
  {
    swahiliWord: "Mshirikina",
    arabicWord: "مشرك",
    root: "ش ر ك",
    exampleSentence: "Mshirikina.",
    derivatives: [
      { arabic: "مشرك", swahili: "mshirikina" },
      { arabic: "شرك", swahili: "shirk / kushirikisha" },
      { arabic: "يشرك", swahili: "hushirikisha" }
    ]
  },
  {
    swahiliWord: "Shetani",
    arabicWord: "شيطان",
    root: "ش ط ن",
    exampleSentence: "Shetani ananong'ona.",
    derivatives: [
      { arabic: "شيطان", swahili: "shetani" },
      { arabic: "شياطين", swahili: "mashetani" },
      { arabic: "وسوسة", swahili: "wasiwasi / mnong'ono" }
    ]
  },
  {
    swahiliWord: "Malaika",
    arabicWord: "ملائكة",
    root: "م ل ك",
    exampleSentence: "Malaika waliteremka.",
    derivatives: [
      { arabic: "مَلَك", swahili: "malaika" },
      { arabic: "ملائكة", swahili: "malaika (wingi)" },
      { arabic: "رسل", swahili: "wajumbe" }
    ]
  },
  {
    swahiliWord: "Janna",
    arabicWord: "جنة",
    root: "ج ن ن",
    exampleSentence: "Waombe Janna.",
    derivatives: [
      { arabic: "جنة", swahili: "janna / pepo" },
      { arabic: "جنات", swahili: "majanna / pepo nyingi" },
      { arabic: "جن", swahili: "majini" }
    ]
  },
  {
    swahiliWord: "Jahannamu",
    arabicWord: "جهنم",
    root: "ج ه ن م",
    exampleSentence: "Anaogopa Jahannamu.",
    derivatives: [
      { arabic: "جهنم", swahili: "jahannamu" },
      { arabic: "جحيم", swahili: "moto mkali" },
      { arabic: "نار", swahili: "moto" }
    ]
  },
  {
    swahiliWord: "Msikiti",
    arabicWord: "مسجد",
    root: "س ج د",
    exampleSentence: "Tunaenda msikitini.",
    derivatives: [
      { arabic: "مسجد", swahili: "msikiti" },
      { arabic: "سجد", swahili: "kusujudu" },
      { arabic: "سجود", swahili: "sijda / kusujudu" }
    ]
  },
  {
    swahiliWord: "Kitabu",
    arabicWord: "كتاب",
    root: "ك ت ب",
    exampleSentence: "Soma kitabu.",
    derivatives: [
      { arabic: "كتاب", swahili: "kitabu" },
      { arabic: "كتب", swahili: "aliandika" },
      { arabic: "كاتب", swahili: "mwandishi" }
    ]
  },
  {
    swahiliWord: "Kalamu",
    arabicWord: "قلم",
    root: "ق ل م",
    exampleSentence: "Andika kwa kalamu.",
    derivatives: [
      { arabic: "قلم", swahili: "kalamu" },
      { arabic: "أقلام", swahili: "kalamu nyingi" },
      { arabic: "يكتب بالقلم", swahili: "huandika kwa kalamu" }
    ]
  },
  {
    swahiliWord: "Aya",
    arabicWord: "آية",
    root: "أ ي ي",
    exampleSentence: "Soma aya hii.",
    derivatives: [
      { arabic: "آية", swahili: "aya" },
      { arabic: "آيات", swahili: "aya nyingi" },
      { arabic: "بينات", swahili: "dalili zilizo wazi" }
    ]
  },
  {
    swahiliWord: "Sura",
    arabicWord: "سورة",
    root: "س و ر",
    exampleSentence: "Sura ya Al-Fatiha.",
    derivatives: [
      { arabic: "سورة", swahili: "sura" },
      { arabic: "سور", swahili: "kuta / ngome" },
      { arabic: "أسوار", swahili: "kuta (wingi)" }
    ]
  },
  {
    swahiliWord: "Dua",
    arabicWord: "دعاء",
    root: "د ع و",
    exampleSentence: "Fanya dua.",
    derivatives: [
      { arabic: "دعاء", swahili: "dua" },
      { arabic: "دعا", swahili: "alifanya dua / aliomba" },
      { arabic: "يدعو", swahili: "huomba / huita" }
    ]
  },
  {
    swahiliWord: "Dhikri",
    arabicWord: "ذكر",
    root: "ذ ك ر",
    exampleSentence: "Dhikri ya Mungu.",
    derivatives: [
      { arabic: "ذكر", swahili: "dhikri / kukumbuka" },
      { arabic: "يذكر", swahili: "hukumbuka / hutaja" },
      { arabic: "ذكرى", swahili: "ukumbusho / mawaidha" }
    ]
  },
  {
    swahiliWord: "Shukrani",
    arabicWord: "شكر",
    root: "ش ك ر",
    exampleSentence: "Shukrani kwa Mungu.",
    derivatives: [
      { arabic: "شكر", swahili: "shukrani" },
      { arabic: "يشكر", swahili: "hushukuru" },
      { arabic: "شاكر", swahili: "mwenye kushukuru" }
    ]
  },
  {
    swahiliWord: "Saburi",
    arabicWord: "صبر",
    root: "ص ب ر",
    exampleSentence: "Kuwa na saburi.",
    derivatives: [
      { arabic: "صبر", swahili: "saburi" },
      { arabic: "يصبر", swahili: "husubiri" },
      { arabic: "صابر", swahili: "mvumilivu / mwenye saburi" }
    ]
  }
];

export function getRandomSwahiliWord(): SwahiliQuranicWord {
  const index = Math.floor(Math.random() * swahiliQuranicWords.length);
  return swahiliQuranicWords[index];
}

export function getSwahiliWordByIndex(index: number): SwahiliQuranicWord {
  return swahiliQuranicWords[index % swahiliQuranicWords.length];
}
