export interface PrepositionExercise {
  id: number;
  surahEn: string;
  surahAr: string;
  ayah: number;
  verseWithBlank: string;
  fullVerse: string;
  correctPreposition: string;
  meaningEn: string;
  explanation: string;
  explanationAr: string;
}

export const PREPOSITION_OPTIONS = ["على", "في", "من", "إلى", "لِ", "مع", "بِ"];

export const PREPOSITION_BANK: PrepositionExercise[] = [
  // Al-Fatiha (1)
  {
    id: 1,
    surahEn: "Al-Fatiha",
    surahAr: "الفاتحة",
    ayah: 2,
    verseWithBlank: "الْحَمْدُ ___ اللَّهِ رَبِّ الْعَالَمِينَ",
    fullVerse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    correctPreposition: "لِ",
    meaningEn: "Praise be to Allah, Lord of all worlds",
    explanation: "لِ (for/to) — The praise belongs to Allah. لِلَّهِ = لِ + اللَّهِ",
    explanationAr: "لِ (للتخصيص) — الحمد لله: الحمد مُختص بالله"
  },
  {
    id: 2,
    surahEn: "Al-Fatiha",
    surahAr: "الفاتحة",
    ayah: 7,
    verseWithBlank: "صِرَاطَ الَّذِينَ أَنْعَمْتَ ___ هِمْ",
    fullVerse: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
    correctPreposition: "على",
    meaningEn: "The path of those upon whom You bestowed favour",
    explanation: "على (upon) — أنعم على = to bestow favour upon someone",
    explanationAr: "على — أنعم على: وهبهم النعمة، والنعمة تكون عليهم"
  },
  // Al-Kahf (18)
  {
    id: 3,
    surahEn: "Al-Kahf",
    surahAr: "الكهف",
    ayah: 10,
    verseWithBlank: "إِذْ أَوَى الْفِتْيَةُ ___ الْكَهْفِ",
    fullVerse: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ",
    correctPreposition: "إلى",
    meaningEn: "When the youths retreated to the cave",
    explanation: "إلى (to) — أوى إلى = to take refuge / to go to a place",
    explanationAr: "إلى — أوى إلى: اتجهوا نحو الكهف ولجأوا إليه"
  },
  {
    id: 4,
    surahEn: "Al-Kahf",
    surahAr: "الكهف",
    ayah: 28,
    verseWithBlank: "وَاصْبِرْ نَفْسَكَ ___ الَّذِينَ يَدْعُونَ رَبَّهُمْ",
    fullVerse: "وَاصْبِرْ نَفْسَكَ مَعَ الَّذِينَ يَدْعُونَ رَبَّهُمْ",
    correctPreposition: "مع",
    meaningEn: "And keep yourself patient with those who call upon their Lord",
    explanation: "مع (with) — اصبر مع = be patient alongside / stay with people",
    explanationAr: "مع — اصبر مع: ابق في صحبة المؤمنين وتحمّل معهم"
  },
  {
    id: 5,
    surahEn: "Al-Kahf",
    surahAr: "الكهف",
    ayah: 3,
    verseWithBlank: "مَاكِثِينَ ___ هِ أَبَدًا",
    fullVerse: "مَاكِثِينَ فِيهِ أَبَدًا",
    correctPreposition: "في",
    meaningEn: "Abiding therein forever",
    explanation: "في (in) — مكث في = to stay/remain in a place",
    explanationAr: "في — مكث في: المكوث داخل الشيء، يقيمون فيه"
  },
  // Al-Mulk (67)
  {
    id: 6,
    surahEn: "Al-Mulk",
    surahAr: "الملك",
    ayah: 3,
    verseWithBlank: "مَا تَرَى ___ خَلْقِ الرَّحْمَنِ مِنْ تَفَاوُتٍ",
    fullVerse: "مَا تَرَى فِي خَلْقِ الرَّحْمَنِ مِنْ تَفَاوُتٍ",
    correctPreposition: "في",
    meaningEn: "You do not see in the creation of the Most Merciful any inconsistency",
    explanation: "في (in) — ترى في = you see within/inside the creation",
    explanationAr: "في — ما ترى في خلق الله: النظر داخل/ضمن مخلوقات الله"
  },
  {
    id: 7,
    surahEn: "Al-Mulk",
    surahAr: "الملك",
    ayah: 12,
    verseWithBlank: "الَّذِينَ يَخْشَوْنَ رَبَّهُمْ ___ الْغَيْبِ",
    fullVerse: "الَّذِينَ يَخْشَوْنَ رَبَّهُمْ بِالْغَيْبِ",
    correctPreposition: "بِ",
    meaningEn: "Those who fear their Lord unseen",
    explanation: "بِ (in/with the) — بالغيب = in secret, without seeing Allah",
    explanationAr: "بِ — يخشون بالغيب: يخافون الله وهم لا يرونه"
  },
  {
    id: 8,
    surahEn: "Al-Mulk",
    surahAr: "الملك",
    ayah: 8,
    verseWithBlank: "كُلَّمَا أُلْقِيَ ___ هَا فَوْجٌ",
    fullVerse: "كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ",
    correctPreposition: "في",
    meaningEn: "Every time a group is thrown into it",
    explanation: "في (in/into) — ألقي في = thrown into (a place)",
    explanationAr: "في — ألقي فيها: طُرح داخلها، حرف الجر يدل على الدخول"
  },
  // Al-Inshiqaq (84)
  {
    id: 9,
    surahEn: "Al-Inshiqaq",
    surahAr: "الانشقاق",
    ayah: 6,
    verseWithBlank: "إِنَّكَ كَادِحٌ ___ رَبِّكَ كَدْحًا",
    fullVerse: "إِنَّكَ كَادِحٌ إِلَى رَبِّكَ كَدْحًا",
    correctPreposition: "إلى",
    meaningEn: "Indeed, you are laboring toward your Lord with great exertion",
    explanation: "إلى (to/toward) — كادح إلى = striving toward a destination",
    explanationAr: "إلى — كادح إلى ربك: تسعى وتجهد نحو ربك"
  },
  // At-Tin (95)
  {
    id: 10,
    surahEn: "At-Tin",
    surahAr: "التين",
    ayah: 4,
    verseWithBlank: "لَقَدْ خَلَقْنَا الْإِنسَانَ ___ أَحْسَنِ تَقْوِيمٍ",
    fullVerse: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
    correctPreposition: "في",
    meaningEn: "We have certainly created man in the best of stature",
    explanation: "في (in) — خلق في = created in a state/form",
    explanationAr: "في — خلق في أحسن تقويم: أُوجد الإنسان ضمن أفضل هيئة"
  },
  // Al-Balad (90)
  {
    id: 11,
    surahEn: "Al-Balad",
    surahAr: "البلد",
    ayah: 4,
    verseWithBlank: "لَقَدْ خَلَقْنَا الْإِنسَانَ ___ كَبَدٍ",
    fullVerse: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ",
    correctPreposition: "في",
    meaningEn: "We have certainly created man into hardship",
    explanation: "في (in/into) — خلق في كبد = created in a state of struggle",
    explanationAr: "في — خلقنا الإنسان في كبد: وُلد في حالة من المشقة والتعب"
  },
  // Al-Fajr (89)
  {
    id: 12,
    surahEn: "Al-Fajr",
    surahAr: "الفجر",
    ayah: 28,
    verseWithBlank: "ارْجِعِي ___ رَبِّكِ رَاضِيَةً مَرْضِيَّةً",
    fullVerse: "ارْجِعِي إِلَى رَبِّكِ رَاضِيَةً مَرْضِيَّةً",
    correctPreposition: "إلى",
    meaningEn: "Return to your Lord, well-pleased and pleasing",
    explanation: "إلى (to) — ارجعي إلى = return/go back to",
    explanationAr: "إلى — ارجعي إلى ربك: الرجوع يتعدى بـ'إلى' لأنه يدل على الوجهة"
  },
  // Al-Layl (92)
  {
    id: 13,
    surahEn: "Al-Layl",
    surahAr: "الليل",
    ayah: 20,
    verseWithBlank: "وَمَا لِأَحَدٍ عِندَهُ ___ نِعْمَةٍ تُجْزَى",
    fullVerse: "وَمَا لِأَحَدٍ عِندَهُ مِنْ نِعْمَةٍ تُجْزَى",
    correctPreposition: "من",
    meaningEn: "And not for anyone who has a favour upon him to be rewarded",
    explanation: "من (of/any) — من نعمة = any favour (من for negation/partitiveness)",
    explanationAr: "من — من نعمة: حرف الجر 'من' يدل على نفي وجود أي نعمة سابقة"
  },
  // Al-Mutaffifin (83)
  {
    id: 14,
    surahEn: "Al-Mutaffifin",
    surahAr: "المطففين",
    ayah: 18,
    verseWithBlank: "كَلَّا إِنَّ كِتَابَ الْأَبْرَارِ لَـ ___ عِلِّيِّينَ",
    fullVerse: "كَلَّا إِنَّ كِتَابَ الْأَبْرَارِ لَفِي عِلِّيِّينَ",
    correctPreposition: "في",
    meaningEn: "No! Indeed, the record of the righteous is in 'illiyyun",
    explanation: "في (in) — كتابهم في علّيين = their record is located in 'illiyyun",
    explanationAr: "في — لفي عليين: الكتاب موجود وكائن في مكان عالٍ"
  },
  // Al-Kawthar (108)
  {
    id: 15,
    surahEn: "Al-Kawthar",
    surahAr: "الكوثر",
    ayah: 2,
    verseWithBlank: "فَصَلِّ ___ رَبِّكَ وَانْحَرْ",
    fullVerse: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
    correctPreposition: "لِ",
    meaningEn: "So pray to your Lord and sacrifice",
    explanation: "لِ (for) — صلّ لربك = pray for the sake of your Lord",
    explanationAr: "لِ — صلّ لربك: الصلاة لأجل الله وتخصيصها له وحده"
  },
  // An-Nasr (110)
  {
    id: 16,
    surahEn: "An-Nasr",
    surahAr: "النصر",
    ayah: 2,
    verseWithBlank: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ ___ دِينِ اللَّهِ أَفْوَاجًا",
    fullVerse: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
    correctPreposition: "في",
    meaningEn: "And you see the people entering into the religion of Allah in multitudes",
    explanation: "في (into) — دخل في = to enter into (a religion, a place)",
    explanationAr: "في — يدخلون في دين الله: الدخول إلى داخل الإسلام"
  },
  // Al-Alaq (96)
  {
    id: 17,
    surahEn: "Al-Alaq",
    surahAr: "العلق",
    ayah: 1,
    verseWithBlank: "اقْرَأْ ___ اسْمِ رَبِّكَ الَّذِي خَلَقَ",
    fullVerse: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    correctPreposition: "بِ",
    meaningEn: "Recite in the name of your Lord who created",
    explanation: "بِ (in/by) — اقرأ باسم = recite in/with the name of",
    explanationAr: "بِ — اقرأ باسم ربك: ابدأ القراءة مستعيناً باسم الله"
  },
  // Al-Falaq (113)
  {
    id: 18,
    surahEn: "Al-Falaq",
    surahAr: "الفلق",
    ayah: 1,
    verseWithBlank: "قُلْ أَعُوذُ ___ رَبِّ الْفَلَقِ",
    fullVerse: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    correctPreposition: "بِ",
    meaningEn: "Say: I seek refuge with the Lord of the daybreak",
    explanation: "بِ (with) — أعوذ بـ = I seek refuge with (someone's protection)",
    explanationAr: "بِ — أعوذ برب الفلق: أستجير وأستعيذ بحماية الله"
  },
  // An-Nas (114)
  {
    id: 19,
    surahEn: "An-Nas",
    surahAr: "الناس",
    ayah: 1,
    verseWithBlank: "قُلْ أَعُوذُ ___ رَبِّ النَّاسِ",
    fullVerse: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    correctPreposition: "بِ",
    meaningEn: "Say: I seek refuge with the Lord of mankind",
    explanation: "بِ (with) — أعوذ بـ = I seek refuge with (someone's protection)",
    explanationAr: "بِ — أعوذ برب الناس: أستجير بالله رب البشر جميعاً"
  },
  // Al-Ma'un (107)
  {
    id: 20,
    surahEn: "Al-Ma'un",
    surahAr: "الماعون",
    ayah: 1,
    verseWithBlank: "أَرَأَيْتَ الَّذِي يُكَذِّبُ ___ الدِّينِ",
    fullVerse: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
    correctPreposition: "بِ",
    meaningEn: "Have you seen the one who denies the Judgement?",
    explanation: "بِ (with/in) — كذّب بـ = to deny/reject something",
    explanationAr: "بِ — يكذب بالدين: ينكر ويرفض يوم الدين وجزاءه"
  },
  // Al-Asr (103)
  {
    id: 21,
    surahEn: "Al-Asr",
    surahAr: "العصر",
    ayah: 3,
    verseWithBlank: "وَتَوَاصَوْا ___ الْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    fullVerse: "وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    correctPreposition: "بِ",
    meaningEn: "And advised one another to truth and advised one another to patience",
    explanation: "بِ (with/to) — تواصى بـ = to mutually advise with/to something",
    explanationAr: "بِ — تواصوا بالحق: أوصى بعضهم بعضاً مُلتزمين بالحق"
  },
  // Al-Fil (105)
  {
    id: 22,
    surahEn: "Al-Fil",
    surahAr: "الفيل",
    ayah: 1,
    verseWithBlank: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ ___ أَصْحَابِ الْفِيلِ",
    fullVerse: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
    correctPreposition: "بِ",
    meaningEn: "Have you not seen how your Lord dealt with the companions of the elephant?",
    explanation: "بِ (with) — فعل بـ = to do/deal with someone",
    explanationAr: "بِ — فعل بأصحاب الفيل: ما صنعه الله بهم وكيف تعامل معهم"
  },
  // Al-Qadr (97)
  {
    id: 23,
    surahEn: "Al-Qadr",
    surahAr: "القدر",
    ayah: 4,
    verseWithBlank: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا ___ إِذْنِ رَبِّهِمْ",
    fullVerse: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ",
    correctPreposition: "بِ",
    meaningEn: "The angels and the Spirit descend therein by permission of their Lord",
    explanation: "بِ (by/with) — بإذن = by/with the permission of",
    explanationAr: "بِ — بإذن ربهم: نزولهم مقترن بإذن الله ومشروط به"
  },
  // Ad-Duha (93)
  {
    id: 24,
    surahEn: "Ad-Duha",
    surahAr: "الضحى",
    ayah: 4,
    verseWithBlank: "وَلَلْآخِرَةُ خَيْرٌ لَكَ ___ الْأُولَى",
    fullVerse: "وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَى",
    correctPreposition: "من",
    meaningEn: "And the Hereafter is better for you than the first life",
    explanation: "من (than/from) — خير من = better than. من here marks comparison",
    explanationAr: "من — خير لك من الأولى: حرف الجر 'من' يدل على المفاضلة والمقارنة"
  },
  // Al-Mulk (67) extra
  {
    id: 25,
    surahEn: "Al-Mulk",
    surahAr: "الملك",
    ayah: 17,
    verseWithBlank: "أَأَمِنتُمْ مَنْ ___ السَّمَاءِ أَنْ يُرْسِلَ عَلَيْكُمْ حَاصِبًا",
    fullVerse: "أَأَمِنتُمْ مَنْ فِي السَّمَاءِ أَنْ يُرْسِلَ عَلَيْكُمْ حَاصِبًا",
    correctPreposition: "في",
    meaningEn: "Do you feel secure that He who is above the heaven will not cause the earth to swallow you?",
    explanation: "في (in/above) — من في السماء = He who is in/above the heaven",
    explanationAr: "في — من في السماء: الله الذي أمره وسلطانه في السماء"
  },
  // An-Naba (78) extra
  {
    id: 26,
    surahEn: "An-Naba",
    surahAr: "النبأ",
    ayah: 35,
    verseWithBlank: "لَا يَسْمَعُونَ ___ هَا لَغْوًا وَلَا كِذَّابًا",
    fullVerse: "لَا يَسْمَعُونَ فِيهَا لَغْوًا وَلَا كِذَّابًا",
    correctPreposition: "في",
    meaningEn: "They will not hear therein any ill speech or falsehood",
    explanation: "في (in/therein) — فيها = in it (referring to paradise)",
    explanationAr: "في — لا يسمعون فيها: ما يجري داخل الجنة من كلام، حرف الجر يدل على الظرفية"
  },
  // Al-Kahf extra
  {
    id: 27,
    surahEn: "Al-Kahf",
    surahAr: "الكهف",
    ayah: 16,
    verseWithBlank: "يَنشُرْ لَكُمْ رَبُّكُمْ ___ رَحْمَتِهِ",
    fullVerse: "يَنشُرْ لَكُمْ رَبُّكُمْ مِنْ رَحْمَتِهِ",
    correctPreposition: "من",
    meaningEn: "Your Lord will spread for you from His mercy",
    explanation: "من (from/of) — من رحمته = from His mercy (partitive use)",
    explanationAr: "من — من رحمته: ينزل عليكم جزءاً من رحمته الواسعة"
  },
  // Al-Mulk extra
  {
    id: 28,
    surahEn: "Al-Mulk",
    surahAr: "الملك",
    ayah: 15,
    verseWithBlank: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا ___ مَنَاكِبِهَا",
    fullVerse: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا",
    correctPreposition: "في",
    meaningEn: "It is He who made the earth tame for you, so walk through its slopes",
    explanation: "في (through/in) — امشوا في مناكبها = walk through its pathways",
    explanationAr: "في — امشوا في مناكبها: السير والتنقل داخل أرجاء الأرض"
  },
  // Al-Inshiqaq extra
  {
    id: 29,
    surahEn: "Al-Inshiqaq",
    surahAr: "الانشقاق",
    ayah: 9,
    verseWithBlank: "وَيَنقَلِبُ ___ أَهْلِهِ مَسْرُورًا",
    fullVerse: "وَيَنقَلِبُ إِلَى أَهْلِهِ مَسْرُورًا",
    correctPreposition: "إلى",
    meaningEn: "And he will return to his people in happiness",
    explanation: "إلى (to) — انقلب إلى = to return/go back to",
    explanationAr: "إلى — ينقلب إلى أهله: يرجع نحو أهله في الجنة فرحاً"
  },
  // Al-A'la (87) extra
  {
    id: 30,
    surahEn: "Al-A'la",
    surahAr: "الأعلى",
    ayah: 8,
    verseWithBlank: "وَنُيَسِّرُكَ ___ الْيُسْرَى",
    fullVerse: "وَنُيَسِّرُكَ لِلْيُسْرَى",
    correctPreposition: "لِ",
    meaningEn: "And We will ease you toward ease",
    explanation: "لِ (for/toward) — يسّر لـ = to make easy for someone",
    explanationAr: "لِ — نيسرك لليسرى: نُهيئك ونوجهك نحو الطريق الأيسر"
  },
];

export function getRandomPrepositionExercise(excludeIds: number[] = []): PrepositionExercise {
  const available = PREPOSITION_BANK.filter(e => !excludeIds.includes(e.id));
  const pool = available.length > 0 ? available : PREPOSITION_BANK;
  return pool[Math.floor(Math.random() * pool.length)];
}
