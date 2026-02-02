export interface Surah {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  versesCount: number;
}

export const surahList: Surah[] = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatiha", versesCount: 7 },
  { number: 2, nameArabic: "البقرة", nameEnglish: "Al-Baqarah", versesCount: 286 },
  { number: 3, nameArabic: "آل عمران", nameEnglish: "Ali 'Imran", versesCount: 200 },
  { number: 4, nameArabic: "النساء", nameEnglish: "An-Nisa", versesCount: 176 },
  { number: 5, nameArabic: "المائدة", nameEnglish: "Al-Ma'idah", versesCount: 120 },
  { number: 6, nameArabic: "الأنعام", nameEnglish: "Al-An'am", versesCount: 165 },
  { number: 7, nameArabic: "الأعراف", nameEnglish: "Al-A'raf", versesCount: 206 },
  { number: 8, nameArabic: "الأنفال", nameEnglish: "Al-Anfal", versesCount: 75 },
  { number: 9, nameArabic: "التوبة", nameEnglish: "At-Tawbah", versesCount: 129 },
  { number: 10, nameArabic: "يونس", nameEnglish: "Yunus", versesCount: 109 },
  { number: 11, nameArabic: "هود", nameEnglish: "Hud", versesCount: 123 },
  { number: 12, nameArabic: "يوسف", nameEnglish: "Yusuf", versesCount: 111 },
  { number: 13, nameArabic: "الرعد", nameEnglish: "Ar-Ra'd", versesCount: 43 },
  { number: 14, nameArabic: "إبراهيم", nameEnglish: "Ibrahim", versesCount: 52 },
  { number: 15, nameArabic: "الحجر", nameEnglish: "Al-Hijr", versesCount: 99 },
  { number: 16, nameArabic: "النحل", nameEnglish: "An-Nahl", versesCount: 128 },
  { number: 17, nameArabic: "الإسراء", nameEnglish: "Al-Isra", versesCount: 111 },
  { number: 18, nameArabic: "الكهف", nameEnglish: "Al-Kahf", versesCount: 110 },
  { number: 19, nameArabic: "مريم", nameEnglish: "Maryam", versesCount: 98 },
  { number: 20, nameArabic: "طه", nameEnglish: "Ta-Ha", versesCount: 135 },
  { number: 21, nameArabic: "الأنبياء", nameEnglish: "Al-Anbiya", versesCount: 112 },
  { number: 22, nameArabic: "الحج", nameEnglish: "Al-Hajj", versesCount: 78 },
  { number: 23, nameArabic: "المؤمنون", nameEnglish: "Al-Mu'minun", versesCount: 118 },
  { number: 24, nameArabic: "النور", nameEnglish: "An-Nur", versesCount: 64 },
  { number: 25, nameArabic: "الفرقان", nameEnglish: "Al-Furqan", versesCount: 77 },
  { number: 26, nameArabic: "الشعراء", nameEnglish: "Ash-Shu'ara", versesCount: 227 },
  { number: 27, nameArabic: "النمل", nameEnglish: "An-Naml", versesCount: 93 },
  { number: 28, nameArabic: "القصص", nameEnglish: "Al-Qasas", versesCount: 88 },
  { number: 29, nameArabic: "العنكبوت", nameEnglish: "Al-'Ankabut", versesCount: 69 },
  { number: 30, nameArabic: "الروم", nameEnglish: "Ar-Rum", versesCount: 60 },
  { number: 31, nameArabic: "لقمان", nameEnglish: "Luqman", versesCount: 34 },
  { number: 32, nameArabic: "السجدة", nameEnglish: "As-Sajdah", versesCount: 30 },
  { number: 33, nameArabic: "الأحزاب", nameEnglish: "Al-Ahzab", versesCount: 73 },
  { number: 34, nameArabic: "سبأ", nameEnglish: "Saba", versesCount: 54 },
  { number: 35, nameArabic: "فاطر", nameEnglish: "Fatir", versesCount: 45 },
  { number: 36, nameArabic: "يس", nameEnglish: "Ya-Sin", versesCount: 83 },
  { number: 37, nameArabic: "الصافات", nameEnglish: "As-Saffat", versesCount: 182 },
  { number: 38, nameArabic: "ص", nameEnglish: "Sad", versesCount: 88 },
  { number: 39, nameArabic: "الزمر", nameEnglish: "Az-Zumar", versesCount: 75 },
  { number: 40, nameArabic: "غافر", nameEnglish: "Ghafir", versesCount: 85 },
  { number: 41, nameArabic: "فصلت", nameEnglish: "Fussilat", versesCount: 54 },
  { number: 42, nameArabic: "الشورى", nameEnglish: "Ash-Shura", versesCount: 53 },
  { number: 43, nameArabic: "الزخرف", nameEnglish: "Az-Zukhruf", versesCount: 89 },
  { number: 44, nameArabic: "الدخان", nameEnglish: "Ad-Dukhan", versesCount: 59 },
  { number: 45, nameArabic: "الجاثية", nameEnglish: "Al-Jathiyah", versesCount: 37 },
  { number: 46, nameArabic: "الأحقاف", nameEnglish: "Al-Ahqaf", versesCount: 35 },
  { number: 47, nameArabic: "محمد", nameEnglish: "Muhammad", versesCount: 38 },
  { number: 48, nameArabic: "الفتح", nameEnglish: "Al-Fath", versesCount: 29 },
  { number: 49, nameArabic: "الحجرات", nameEnglish: "Al-Hujurat", versesCount: 18 },
  { number: 50, nameArabic: "ق", nameEnglish: "Qaf", versesCount: 45 },
  { number: 51, nameArabic: "الذاريات", nameEnglish: "Adh-Dhariyat", versesCount: 60 },
  { number: 52, nameArabic: "الطور", nameEnglish: "At-Tur", versesCount: 49 },
  { number: 53, nameArabic: "النجم", nameEnglish: "An-Najm", versesCount: 62 },
  { number: 54, nameArabic: "القمر", nameEnglish: "Al-Qamar", versesCount: 55 },
  { number: 55, nameArabic: "الرحمن", nameEnglish: "Ar-Rahman", versesCount: 78 },
  { number: 56, nameArabic: "الواقعة", nameEnglish: "Al-Waqi'ah", versesCount: 96 },
  { number: 57, nameArabic: "الحديد", nameEnglish: "Al-Hadid", versesCount: 29 },
  { number: 58, nameArabic: "المجادلة", nameEnglish: "Al-Mujadilah", versesCount: 22 },
  { number: 59, nameArabic: "الحشر", nameEnglish: "Al-Hashr", versesCount: 24 },
  { number: 60, nameArabic: "الممتحنة", nameEnglish: "Al-Mumtahanah", versesCount: 13 },
  { number: 61, nameArabic: "الصف", nameEnglish: "As-Saf", versesCount: 14 },
  { number: 62, nameArabic: "الجمعة", nameEnglish: "Al-Jumu'ah", versesCount: 11 },
  { number: 63, nameArabic: "المنافقون", nameEnglish: "Al-Munafiqun", versesCount: 11 },
  { number: 64, nameArabic: "التغابن", nameEnglish: "At-Taghabun", versesCount: 18 },
  { number: 65, nameArabic: "الطلاق", nameEnglish: "At-Talaq", versesCount: 12 },
  { number: 66, nameArabic: "التحريم", nameEnglish: "At-Tahrim", versesCount: 12 },
  { number: 67, nameArabic: "الملك", nameEnglish: "Al-Mulk", versesCount: 30 },
  { number: 68, nameArabic: "القلم", nameEnglish: "Al-Qalam", versesCount: 52 },
  { number: 69, nameArabic: "الحاقة", nameEnglish: "Al-Haqqah", versesCount: 52 },
  { number: 70, nameArabic: "المعارج", nameEnglish: "Al-Ma'arij", versesCount: 44 },
  { number: 71, nameArabic: "نوح", nameEnglish: "Nuh", versesCount: 28 },
  { number: 72, nameArabic: "الجن", nameEnglish: "Al-Jinn", versesCount: 28 },
  { number: 73, nameArabic: "المزمل", nameEnglish: "Al-Muzzammil", versesCount: 20 },
  { number: 74, nameArabic: "المدثر", nameEnglish: "Al-Muddaththir", versesCount: 56 },
  { number: 75, nameArabic: "القيامة", nameEnglish: "Al-Qiyamah", versesCount: 40 },
  { number: 76, nameArabic: "الإنسان", nameEnglish: "Al-Insan", versesCount: 31 },
  { number: 77, nameArabic: "المرسلات", nameEnglish: "Al-Mursalat", versesCount: 50 },
  { number: 78, nameArabic: "النبأ", nameEnglish: "An-Naba", versesCount: 40 },
  { number: 79, nameArabic: "النازعات", nameEnglish: "An-Nazi'at", versesCount: 46 },
  { number: 80, nameArabic: "عبس", nameEnglish: "'Abasa", versesCount: 42 },
  { number: 81, nameArabic: "التكوير", nameEnglish: "At-Takwir", versesCount: 29 },
  { number: 82, nameArabic: "الانفطار", nameEnglish: "Al-Infitar", versesCount: 19 },
  { number: 83, nameArabic: "المطففين", nameEnglish: "Al-Mutaffifin", versesCount: 36 },
  { number: 84, nameArabic: "الانشقاق", nameEnglish: "Al-Inshiqaq", versesCount: 25 },
  { number: 85, nameArabic: "البروج", nameEnglish: "Al-Buruj", versesCount: 22 },
  { number: 86, nameArabic: "الطارق", nameEnglish: "At-Tariq", versesCount: 17 },
  { number: 87, nameArabic: "الأعلى", nameEnglish: "Al-A'la", versesCount: 19 },
  { number: 88, nameArabic: "الغاشية", nameEnglish: "Al-Ghashiyah", versesCount: 26 },
  { number: 89, nameArabic: "الفجر", nameEnglish: "Al-Fajr", versesCount: 30 },
  { number: 90, nameArabic: "البلد", nameEnglish: "Al-Balad", versesCount: 20 },
  { number: 91, nameArabic: "الشمس", nameEnglish: "Ash-Shams", versesCount: 15 },
  { number: 92, nameArabic: "الليل", nameEnglish: "Al-Layl", versesCount: 21 },
  { number: 93, nameArabic: "الضحى", nameEnglish: "Ad-Duha", versesCount: 11 },
  { number: 94, nameArabic: "الشرح", nameEnglish: "Ash-Sharh", versesCount: 8 },
  { number: 95, nameArabic: "التين", nameEnglish: "At-Tin", versesCount: 8 },
  { number: 96, nameArabic: "العلق", nameEnglish: "Al-'Alaq", versesCount: 19 },
  { number: 97, nameArabic: "القدر", nameEnglish: "Al-Qadr", versesCount: 5 },
  { number: 98, nameArabic: "البينة", nameEnglish: "Al-Bayyinah", versesCount: 8 },
  { number: 99, nameArabic: "الزلزلة", nameEnglish: "Az-Zalzalah", versesCount: 8 },
  { number: 100, nameArabic: "العاديات", nameEnglish: "Al-'Adiyat", versesCount: 11 },
  { number: 101, nameArabic: "القارعة", nameEnglish: "Al-Qari'ah", versesCount: 11 },
  { number: 102, nameArabic: "التكاثر", nameEnglish: "At-Takathur", versesCount: 8 },
  { number: 103, nameArabic: "العصر", nameEnglish: "Al-'Asr", versesCount: 3 },
  { number: 104, nameArabic: "الهمزة", nameEnglish: "Al-Humazah", versesCount: 9 },
  { number: 105, nameArabic: "الفيل", nameEnglish: "Al-Fil", versesCount: 5 },
  { number: 106, nameArabic: "قريش", nameEnglish: "Quraysh", versesCount: 4 },
  { number: 107, nameArabic: "الماعون", nameEnglish: "Al-Ma'un", versesCount: 7 },
  { number: 108, nameArabic: "الكوثر", nameEnglish: "Al-Kawthar", versesCount: 3 },
  { number: 109, nameArabic: "الكافرون", nameEnglish: "Al-Kafirun", versesCount: 6 },
  { number: 110, nameArabic: "النصر", nameEnglish: "An-Nasr", versesCount: 3 },
  { number: 111, nameArabic: "المسد", nameEnglish: "Al-Masad", versesCount: 5 },
  { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlas", versesCount: 4 },
  { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq", versesCount: 5 },
  { number: 114, nameArabic: "الناس", nameEnglish: "An-Nas", versesCount: 6 },
];

export function getSurahByNumber(number: number): Surah | undefined {
  return surahList.find(s => s.number === number);
}

export function getSurahByName(name: string): Surah | undefined {
  return surahList.find(s => 
    s.nameArabic === name || 
    s.nameEnglish.toLowerCase() === name.toLowerCase()
  );
}

export function extractSurahFromReference(reference: string): number | null {
  const surahNames = surahList.map(s => s.nameArabic);
  for (const surah of surahList) {
    if (reference.includes(surah.nameArabic) || 
        reference.toLowerCase().includes(surah.nameEnglish.toLowerCase())) {
      return surah.number;
    }
  }
  const match = reference.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1]);
    if (num >= 1 && num <= 114) return num;
  }
  return null;
}
