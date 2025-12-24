export interface TurkishQuranicWord {
  turkishWord: string;
  arabicWord: string;
  root: string;
  derivatives: { arabic: string; turkish: string }[];
}

export const turkishQuranicWords: TurkishQuranicWord[] = [
  {
    turkishWord: "Rahmet",
    arabicWord: "رحمة",
    root: "ر ح م",
    derivatives: [
      { arabic: "رحمة", turkish: "merhamet, rahmet" },
      { arabic: "رحيم", turkish: "merhametli, çok merhamet eden" },
      { arabic: "رحمن", turkish: "çok merhametli (Allah sıfatı)" },
      { arabic: "يرحم", turkish: "merhamet eder" }
    ]
  },
  {
    turkishWord: "Nimet",
    arabicWord: "نعمة",
    root: "ن ع م",
    derivatives: [
      { arabic: "نعمة", turkish: "nimet" },
      { arabic: "نعم", turkish: "evet / nimetler" },
      { arabic: "أنعم", turkish: "nimet verdi, ihsan etti" },
      { arabic: "منعم", turkish: "nimet veren" }
    ]
  },
  {
    turkishWord: "Hikmet",
    arabicWord: "حكمة",
    root: "ح ك م",
    derivatives: [
      { arabic: "حكمة", turkish: "hikmet" },
      { arabic: "حكيم", turkish: "hikmet sahibi / bilge" },
      { arabic: "حكم", turkish: "hüküm, karar" },
      { arabic: "أحكم", turkish: "sağlamlaştırdı / en doğru yaptı" }
    ]
  },
  {
    turkishWord: "Adalet",
    arabicWord: "عدل",
    root: "ع د ل",
    derivatives: [
      { arabic: "عدل", turkish: "adalet / denge" },
      { arabic: "عادل", turkish: "adil" },
      { arabic: "يعدل", turkish: "adaletli davranır" },
      { arabic: "بالعدل", turkish: "adaletle" }
    ]
  },
  {
    turkishWord: "Zulüm",
    arabicWord: "ظلم",
    root: "ظ ل م",
    derivatives: [
      { arabic: "ظلم", turkish: "zulüm / haksızlık" },
      { arabic: "ظالم", turkish: "zalim" },
      { arabic: "مظلوم", turkish: "mazlum" },
      { arabic: "يظلم", turkish: "zulmeder" }
    ]
  },
  {
    turkishWord: "Hak",
    arabicWord: "حق",
    root: "ح ق ق",
    derivatives: [
      { arabic: "حق", turkish: "hak / gerçek" },
      { arabic: "أحق", turkish: "daha haklı" },
      { arabic: "يحق", turkish: "gerçekleşir / hak olur" },
      { arabic: "حقيق", turkish: "gerçek / layık" }
    ]
  },
  {
    turkishWord: "Batıl",
    arabicWord: "باطل",
    root: "ب ط ل",
    derivatives: [
      { arabic: "باطل", turkish: "batıl / yanlış" },
      { arabic: "يبطل", turkish: "boşa çıkarır / geçersiz kılar" },
      { arabic: "أبطل", turkish: "iptal etti" },
      { arabic: "بطل", turkish: "boşa gitti / hükümsüz oldu" }
    ]
  },
  {
    turkishWord: "Nur",
    arabicWord: "نور",
    root: "ن و ر",
    derivatives: [
      { arabic: "نور", turkish: "nur / ışık" },
      { arabic: "منير", turkish: "aydınlatıcı" },
      { arabic: "أنار", turkish: "aydınlattı" },
      { arabic: "ينير", turkish: "aydınlatır" }
    ]
  },
  {
    turkishWord: "Şifa",
    arabicWord: "شفاء",
    root: "ش ف ي",
    derivatives: [
      { arabic: "شفاء", turkish: "şifa" },
      { arabic: "يشفي", turkish: "şifa verir" },
      { arabic: "شاف", turkish: "şifa veren" },
      { arabic: "اشفِ", turkish: "şifa ver (dua/istek)" }
    ]
  },
  {
    turkishWord: "Rızık",
    arabicWord: "رزق",
    root: "ر ز ق",
    derivatives: [
      { arabic: "رزق", turkish: "rızık" },
      { arabic: "يرزق", turkish: "rızık verir" },
      { arabic: "رزقنا", turkish: "bize rızık verdi" },
      { arabic: "رازق", turkish: "rızık veren" }
    ]
  },
  {
    turkishWord: "Azap",
    arabicWord: "عذاب",
    root: "ع ذ ب",
    derivatives: [
      { arabic: "عذاب", turkish: "azap" },
      { arabic: "يعذب", turkish: "azap eder" },
      { arabic: "معذب", turkish: "azap edilen / azap gören" },
      { arabic: "عذابي", turkish: "benim azabım" }
    ]
  },
  {
    turkishWord: "Hesap",
    arabicWord: "حساب",
    root: "ح س ب",
    derivatives: [
      { arabic: "حساب", turkish: "hesap" },
      { arabic: "يحسب", turkish: "hesap eder / zanneder" },
      { arabic: "حسيب", turkish: "hesaba çeken / yeterli gören" },
      { arabic: "حسبان", turkish: "hesap / ölçü" }
    ]
  },
  {
    turkishWord: "Ceza",
    arabicWord: "جزاء",
    root: "ج ز ي",
    derivatives: [
      { arabic: "جزاء", turkish: "karşılık / ceza-ödül" },
      { arabic: "يجزي", turkish: "karşılık verir" },
      { arabic: "جازى", turkish: "mükâfatlandırdı / cezalandırdı" },
      { arabic: "مجزي", turkish: "karşılığı verilen" }
    ]
  },
  {
    turkishWord: "Mizan",
    arabicWord: "ميزان",
    root: "و ز ن",
    derivatives: [
      { arabic: "ميزان", turkish: "mizan / terazi" },
      { arabic: "وزن", turkish: "ağırlık / ölçü" },
      { arabic: "يزن", turkish: "tartar" },
      { arabic: "موازين", turkish: "teraziler / ölçüler" }
    ]
  },
  {
    turkishWord: "Sultan",
    arabicWord: "سلطان",
    root: "س ل ط",
    derivatives: [
      { arabic: "سلطان", turkish: "sultan / güç, delil" },
      { arabic: "تسلط", turkish: "baskı kurdu / musallat oldu" },
      { arabic: "مسلط", turkish: "musallat edilen / yetkili kılınan" },
      { arabic: "سلطة", turkish: "otorite" }
    ]
  },
  {
    turkishWord: "Mülk",
    arabicWord: "مُلك",
    root: "م ل ك",
    derivatives: [
      { arabic: "مُلك", turkish: "mülk / egemenlik" },
      { arabic: "ملك", turkish: "kral / hükümdar" },
      { arabic: "مالك", turkish: "sahip / malik" },
      { arabic: "ملوك", turkish: "krallar" }
    ]
  },
  {
    turkishWord: "Sebep",
    arabicWord: "سبب",
    root: "س ب ب",
    derivatives: [
      { arabic: "سبب", turkish: "sebep" },
      { arabic: "أسباب", turkish: "sebepler" },
      { arabic: "بسبب", turkish: "nedeniyle" },
      { arabic: "مسبَّب", turkish: "sonuç / sebep olunan şey" }
    ]
  },
  {
    turkishWord: "Emir",
    arabicWord: "أمر",
    root: "أ م ر",
    derivatives: [
      { arabic: "أمر", turkish: "emir / iş" },
      { arabic: "يأمر", turkish: "emreder" },
      { arabic: "أمرنا", turkish: "emrimiz / buyruğumuz" },
      { arabic: "مأمور", turkish: "memur / emredilmiş" }
    ]
  },
  {
    turkishWord: "Emanet",
    arabicWord: "أمانة",
    root: "أ م ن",
    derivatives: [
      { arabic: "أمانة", turkish: "emanet" },
      { arabic: "أمين", turkish: "güvenilir" },
      { arabic: "أمن", turkish: "güvenlik" },
      { arabic: "آمن", turkish: "inandı / güvende oldu" }
    ]
  },
  {
    turkishWord: "Fitne",
    arabicWord: "فتنة",
    root: "ف ت ن",
    derivatives: [
      { arabic: "فتنة", turkish: "fitne / imtihan / kargaşa" },
      { arabic: "يفتن", turkish: "fitneye düşürür / sınar" },
      { arabic: "مفتون", turkish: "fitneye kapılmış" },
      { arabic: "فاتن", turkish: "baştan çıkaran" }
    ]
  },
  {
    turkishWord: "Bela",
    arabicWord: "بلاء",
    root: "ب ل و",
    derivatives: [
      { arabic: "بلاء", turkish: "bela / imtihan" },
      { arabic: "ابتلاء", turkish: "sınanma / imtihan" },
      { arabic: "يبلو", turkish: "sınar" },
      { arabic: "مبتلى", turkish: "sınanan" }
    ]
  },
  {
    turkishWord: "İbret",
    arabicWord: "عبرة",
    root: "ع ب ر",
    derivatives: [
      { arabic: "عبرة", turkish: "ibret / ders" },
      { arabic: "اعتبار", turkish: "ibret alma" },
      { arabic: "يعبر", turkish: "geçer / yorumlar" },
      { arabic: "عبور", turkish: "geçiş" }
    ]
  },
  {
    turkishWord: "Şahit",
    arabicWord: "شاهد",
    root: "ش ه د",
    derivatives: [
      { arabic: "شاهد", turkish: "şahit" },
      { arabic: "شهادة", turkish: "şahitlik / şehadet" },
      { arabic: "شهيد", turkish: "şehit / tanık" },
      { arabic: "يشهد", turkish: "şahitlik eder" }
    ]
  },
  {
    turkishWord: "İnsan",
    arabicWord: "إنسان",
    root: "أ ن س",
    derivatives: [
      { arabic: "إنسان", turkish: "insan" },
      { arabic: "إنس", turkish: "insanlar (cin-ins ayrımı)" },
      { arabic: "أنس", turkish: "ünsiyet / yakınlık" },
      { arabic: "استأنس", turkish: "alıştı / yakınlık kurdu" }
    ]
  },
  {
    turkishWord: "Hayat",
    arabicWord: "حياة",
    root: "ح ي ي",
    derivatives: [
      { arabic: "حياة", turkish: "hayat" },
      { arabic: "حي", turkish: "diri / canlı" },
      { arabic: "يحيي", turkish: "diriltir" },
      { arabic: "محيي", turkish: "dirilten (Allah sıfatı)" }
    ]
  },
  {
    turkishWord: "Dünya",
    arabicWord: "دنيا",
    root: "د ن و",
    derivatives: [
      { arabic: "دنيا", turkish: "dünya" },
      { arabic: "أدنى", turkish: "daha yakın / daha düşük" },
      { arabic: "دنو", turkish: "yakınlaşma" },
      { arabic: "يدنو", turkish: "yaklaşır" }
    ]
  },
  {
    turkishWord: "Ahiret",
    arabicWord: "آخرة",
    root: "أ خ ر",
    derivatives: [
      { arabic: "آخرة", turkish: "ahiret" },
      { arabic: "آخر", turkish: "son / diğer" },
      { arabic: "يؤخر", turkish: "erteler" },
      { arabic: "تأخير", turkish: "erteleme" }
    ]
  },
  {
    turkishWord: "Kıyamet",
    arabicWord: "قيامة",
    root: "ق و م",
    derivatives: [
      { arabic: "قيامة", turkish: "kıyamet" },
      { arabic: "يقوم", turkish: "kalkar / ayağa kalkar" },
      { arabic: "قائم", turkish: "ayakta duran" },
      { arabic: "أقام", turkish: "kurdu / ikame" }
    ]
  },
  {
    turkishWord: "Saat",
    arabicWord: "ساعة",
    root: "س ا ع",
    derivatives: [
      { arabic: "ساعة", turkish: "saat" },
      { arabic: "الساعات", turkish: "saatler" },
      { arabic: "ساعي", turkish: "çabalayan / koşan" },
      { arabic: "مسعى", turkish: "çaba / gayret" }
    ]
  },
  {
    turkishWord: "Din",
    arabicWord: "دين",
    root: "د ي ن",
    derivatives: [
      { arabic: "دين", turkish: "din" },
      { arabic: "يوم الدين", turkish: "din günü / hesap günü" },
      { arabic: "يدين", turkish: "din edinir / boyun eğer" },
      { arabic: "ديّان", turkish: "hesaba çeken (Allah için)" }
    ]
  },
  {
    turkishWord: "İman",
    arabicWord: "إيمان",
    root: "أ م ن",
    derivatives: [
      { arabic: "إيمان", turkish: "iman" },
      { arabic: "آمن", turkish: "inandı" },
      { arabic: "مؤمن", turkish: "mümin" },
      { arabic: "أمان", turkish: "emniyet / güven" }
    ]
  },
  {
    turkishWord: "İslam",
    arabicWord: "إسلام",
    root: "س ل م",
    derivatives: [
      { arabic: "إسلام", turkish: "İslam" },
      { arabic: "مسلم", turkish: "Müslüman" },
      { arabic: "سلام", turkish: "selam / barış" },
      { arabic: "أسلم", turkish: "teslim oldu / Müslüman oldu" }
    ]
  },
  {
    turkishWord: "Müslüman",
    arabicWord: "مسلم",
    root: "س ل م",
    derivatives: [
      { arabic: "مسلم", turkish: "Müslüman" },
      { arabic: "مسلمين", turkish: "Müslümanlar" },
      { arabic: "إسلام", turkish: "İslam" },
      { arabic: "تسليم", turkish: "teslimiyet" }
    ]
  },
  {
    turkishWord: "Mümin",
    arabicWord: "مؤمن",
    root: "أ م ن",
    derivatives: [
      { arabic: "مؤمن", turkish: "mümin" },
      { arabic: "مؤمنين", turkish: "müminler" },
      { arabic: "إيمان", turkish: "iman" },
      { arabic: "آمنوا", turkish: "iman ettiler" }
    ]
  },
  {
    turkishWord: "Kâfir",
    arabicWord: "كافر",
    root: "ك ف ر",
    derivatives: [
      { arabic: "كافر", turkish: "kâfir" },
      { arabic: "كفر", turkish: "inkâr / küfür" },
      { arabic: "يكفر", turkish: "inkâr eder" },
      { arabic: "كفور", turkish: "çok nankör / çok inkârcı" }
    ]
  },
  {
    turkishWord: "Münafık",
    arabicWord: "منافق",
    root: "ن ف ق",
    derivatives: [
      { arabic: "منافق", turkish: "münafık" },
      { arabic: "نفاق", turkish: "nifak / ikiyüzlülük" },
      { arabic: "نافق", turkish: "ikiyüzlü davrandı" },
      { arabic: "إنفاق", turkish: "infak / harcama" }
    ]
  },
  {
    turkishWord: "Müşrik",
    arabicWord: "مشرك",
    root: "ش ر ك",
    derivatives: [
      { arabic: "مشرك", turkish: "müşrik" },
      { arabic: "شرك", turkish: "şirk / ortak koşma" },
      { arabic: "يشرك", turkish: "ortak koşar" },
      { arabic: "شركاء", turkish: "ortaklar" }
    ]
  },
  {
    turkishWord: "Şeytan",
    arabicWord: "شيطان",
    root: "ش ط ن",
    derivatives: [
      { arabic: "شيطان", turkish: "şeytan" },
      { arabic: "شياطين", turkish: "şeytanlar" },
      { arabic: "وسوسة", turkish: "vesvese" },
      { arabic: "يوسوس", turkish: "vesvese verir" }
    ]
  },
  {
    turkishWord: "Melek",
    arabicWord: "مَلَك",
    root: "م ل ك",
    derivatives: [
      { arabic: "مَلَك", turkish: "melek" },
      { arabic: "ملائكة", turkish: "melekler" },
      { arabic: "ملكوت", turkish: "melekût / âlem-i melekût" },
      { arabic: "رسل", turkish: "elçiler" }
    ]
  },
  {
    turkishWord: "Cennet",
    arabicWord: "جنة",
    root: "ج ن ن",
    derivatives: [
      { arabic: "جنة", turkish: "cennet" },
      { arabic: "جنات", turkish: "cennetler" },
      { arabic: "جن", turkish: "cin" },
      { arabic: "مجنون", turkish: "deli / cinlenmiş" }
    ]
  },
  {
    turkishWord: "Cehennem",
    arabicWord: "جهنم",
    root: "ج ه ن م",
    derivatives: [
      { arabic: "جهنم", turkish: "cehennem" },
      { arabic: "نار", turkish: "ateş" },
      { arabic: "جحيم", turkish: "cehennem ateşi" },
      { arabic: "سقر", turkish: "cehennem isimlerinden" }
    ]
  },
  {
    turkishWord: "Mescit",
    arabicWord: "مسجد",
    root: "س ج د",
    derivatives: [
      { arabic: "مسجد", turkish: "mescit / cami" },
      { arabic: "سجد", turkish: "secde etti" },
      { arabic: "سجود", turkish: "secde" },
      { arabic: "ساجدين", turkish: "secde edenler" }
    ]
  },
  {
    turkishWord: "Kitap",
    arabicWord: "كتاب",
    root: "ك ت ب",
    derivatives: [
      { arabic: "كتاب", turkish: "kitap" },
      { arabic: "كتب", turkish: "yazdı" },
      { arabic: "مكتوب", turkish: "yazılı" },
      { arabic: "كاتب", turkish: "yazar / yazıcı" }
    ]
  },
  {
    turkishWord: "Kalem",
    arabicWord: "قلم",
    root: "ق ل م",
    derivatives: [
      { arabic: "قلم", turkish: "kalem" },
      { arabic: "أقلام", turkish: "kalemler" },
      { arabic: "يكتب بالقلم", turkish: "kalemle yazar" },
      { arabic: "قلمنا", turkish: "kalemimiz" }
    ]
  },
  {
    turkishWord: "Ayet",
    arabicWord: "آية",
    root: "أ ي ي",
    derivatives: [
      { arabic: "آية", turkish: "ayet" },
      { arabic: "آيات", turkish: "ayetler" },
      { arabic: "بينات", turkish: "apaçık deliller" },
      { arabic: "علامة", turkish: "işaret / alamet" }
    ]
  },
  {
    turkishWord: "Sure",
    arabicWord: "سورة",
    root: "س و ر",
    derivatives: [
      { arabic: "سورة", turkish: "sure" },
      { arabic: "سور", turkish: "surlar / duvarlar" },
      { arabic: "تسوّر", turkish: "surdan tırmandı / aştı" },
      { arabic: "أسوار", turkish: "surlar" }
    ]
  },
  {
    turkishWord: "Dua",
    arabicWord: "دعاء",
    root: "د ع و",
    derivatives: [
      { arabic: "دعاء", turkish: "dua" },
      { arabic: "دعا", turkish: "dua etti" },
      { arabic: "يدعو", turkish: "dua eder / çağırır" },
      { arabic: "دعوة", turkish: "davet / çağrı" }
    ]
  },
  {
    turkishWord: "Zikir",
    arabicWord: "ذكر",
    root: "ذ ك ر",
    derivatives: [
      { arabic: "ذكر", turkish: "zikir / anma" },
      { arabic: "ذكرى", turkish: "hatıra / öğüt" },
      { arabic: "يذكر", turkish: "anar / hatırlar" },
      { arabic: "مذكور", turkish: "anılan / zikredilen" }
    ]
  }
];

export function getRandomTurkishWord(): TurkishQuranicWord {
  const index = Math.floor(Math.random() * turkishQuranicWords.length);
  return turkishQuranicWords[index];
}

export function getTurkishWordByIndex(index: number): TurkishQuranicWord {
  return turkishQuranicWords[index % turkishQuranicWords.length];
}
