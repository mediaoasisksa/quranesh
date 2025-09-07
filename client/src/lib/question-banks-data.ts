import type { InsertQuestionBank } from "@shared/schema";

export const questionBanksData: InsertQuestionBank[] = [
  {
    theme: "المعية في الشدة",
    themeEnglish: "Companionship in Hardship",
    description: "Verses about Allah's support during difficult times",
    tags: ["معية", "صبر", "عسر", "يسر", "دعم"],
    correctPhraseIds: [
      // "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" - Indeed, with hardship comes ease
      // "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ" - Indeed, Allah is with the patient
    ],
    difficulty: 2,
    category: "thematic"
  },
  {
    theme: "العدالة والإنصاف",
    themeEnglish: "Justice and Fairness",
    description: "Verses emphasizing justice and fair treatment",
    tags: ["عدالة", "إنصاف", "قسط", "حكم"],
    correctPhraseIds: [
      // "إِنَّ اللَّهَ يُحِبُّ الْمُقْسِطِينَ" - Indeed, Allah loves those who act justly
      // "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ" - Indeed, Allah commands justice
      // "وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ" - When you judge between people, judge with justice
    ],
    difficulty: 3,
    category: "thematic"
  },
  {
    theme: "الإحسان والخير",
    themeEnglish: "Excellence and Goodness",
    description: "Verses about doing good and excellence",
    tags: ["إحسان", "خير", "معروف", "برّ"],
    correctPhraseIds: [
      // "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ" - Indeed, Allah loves the doers of good
      // "وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ" - And do good; indeed, Allah loves the doers of good
      // "وَأَحْسِن كَمَا أَحْسَنَ اللَّهُ إِلَيْكَ" - And do good as Allah has done good to you
    ],
    difficulty: 2,
    category: "thematic"
  },
  {
    theme: "التوكل والثقة",
    themeEnglish: "Trust and Reliance",
    description: "Verses about trusting and relying on Allah",
    tags: ["توكل", "ثقة", "اعتماد", "تفويض"],
    correctPhraseIds: [
      // "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ" - Whoever relies upon Allah – He is sufficient for him
      // "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ" - Indeed, Allah loves those who rely upon Him
    ],
    difficulty: 3,
    category: "thematic"
  },
  {
    theme: "التقوى والصلاح",
    themeEnglish: "Righteousness and Piety",
    description: "Verses about fear of Allah and righteous conduct",
    tags: ["تقوى", "صلاح", "ورع", "خشية"],
    correctPhraseIds: [
      // "إِنَّ اللَّهَ يُحِبُّ الْمُتَّقِينَ" - Indeed, Allah loves the righteous
      // "إِنَّ اللَّهَ مَعَ الْمُتَّقِينَ" - Indeed, Allah is with the righteous
      // "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا" - Whoever fears Allah – He will make for him a way out
    ],
    difficulty: 3,
    category: "thematic"
  },
  {
    theme: "الاقتصاد ومحاربة الإسراف",
    themeEnglish: "Moderation and Fighting Extravagance",
    description: "Verses about economic moderation and avoiding waste",
    tags: ["اقتصاد", "إسراف", "تبذير", "وسطية"],
    correctPhraseIds: [
      // "كُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا" - Eat and drink but do not waste
      // "إِنَّ اللَّهَ لَا يُحِبُّ الْمُسْرِفِينَ" - Indeed, Allah does not love the extravagant
      // "وَلَا تُسْرِفُوا إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ" - Do not waste, indeed He does not love the extravagant
    ],
    difficulty: 2,
    category: "thematic"
  },
  {
    theme: "الصدق والأمانة",
    themeEnglish: "Truthfulness and Trustworthiness",
    description: "Verses about honesty and keeping trust",
    tags: ["صدق", "أمانة", "وفاء", "عهد"],
    correctPhraseIds: [
      // "اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ" - Fear Allah and be with the truthful
      // "إِنَّ اللَّهَ لَا يُحِبُّ الْخَائِنِينَ" - Indeed, Allah does not love the betrayers
      // "وَأَوْفُوا بِالْعَهْدِ" - And fulfill the covenant
      // "قُولُوا قَوْلًا سَدِيدًا" - Speak words of appropriate justice
    ],
    difficulty: 3,
    category: "thematic"
  },
  {
    theme: "الصبر والمثابرة",
    themeEnglish: "Patience and Perseverance",
    description: "Verses about patience and endurance",
    tags: ["صبر", "مثابرة", "تحمل", "جلد"],
    correctPhraseIds: [
      // "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ" - Indeed, Allah is with the patient
      // "وَاللَّهُ يُحِبُّ الصَّابِرِينَ" - And Allah loves the patient
      // "اصْبِرُوا وَصَابِرُوا" - Be patient and endure
    ],
    difficulty: 2,
    category: "thematic"
  },
  {
    theme: "التواضع ومحاربة الكبر",
    themeEnglish: "Humility and Fighting Arrogance",
    description: "Verses about humility and avoiding pride",
    tags: ["تواضع", "كبر", "تكبر", "فخر"],
    correctPhraseIds: [
      // "إِنَّ اللَّهَ لَا يُحِبُّ مَن كَانَ مُخْتَالًا فَخُورًا" - Indeed, Allah does not love one arrogant and boastful
      // "وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا" - Do not walk upon the earth arrogantly
    ],
    difficulty: 3,
    category: "thematic"
  },
  {
    theme: "الرحمة والمغفرة",
    themeEnglish: "Mercy and Forgiveness",
    description: "Verses about Allah's mercy and forgiveness",
    tags: ["رحمة", "مغفرة", "غفران", "عفو"],
    correctPhraseIds: [
      // "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ" - Indeed, Allah is Forgiving, Merciful
      // "وَاللَّهُ غَفُورٌ رَّحِيمٌ" - And Allah is Forgiving, Merciful
      // "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ" - Indeed, Allah loves those who repent
    ],
    difficulty: 1,
    category: "thematic"
  },
  {
    theme: "العبادة والذكر",
    themeEnglish: "Worship and Remembrance",
    description: "Verses about prayer, worship, and remembering Allah",
    tags: ["عبادة", "ذكر", "صلاة", "زكاة"],
    correctPhraseIds: [
      // "أَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ" - Establish prayer and give zakah
      // "فَاذْكُرُونِي أَذْكُرْكُمْ" - So remember Me; I will remember you
      // "أَقِمِ الصَّلَاةَ لِذِكْرِي" - Establish prayer for My remembrance
    ],
    difficulty: 2,
    category: "thematic"
  },
  {
    theme: "الحقوق والواجبات",
    themeEnglish: "Rights and Duties",
    description: "Verses about people's rights and duties",
    tags: ["حقوق", "واجبات", "معاملات", "إنصاف"],
    correctPhraseIds: [
      // "وَلَا تَبْخَسُوا النَّاسَ أَشْيَاءَهُمْ" - Do not deprive people of their due
      // "أَوْفُوا الْكَيْلَ وَالْمِيزَانَ" - Give full measure and weight
      // "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَى أَهْلِهَا" - Indeed, Allah commands you to render trusts to whom they are due
    ],
    difficulty: 3,
    category: "thematic"
  }
];