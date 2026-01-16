// Quranic Text Protection System (نظام حماية النص القرآني)
// This system prevents Quranic verses from being misclassified as human wisdom

// Enum for Quranic verse classification types (تصنيفات مسموحة للنص القرآني)
export enum QuranicVerseType {
  DOCTRINAL = 'doctrinal',           // آيات عقدية
  LEGAL = 'legal',                   // آيات أحكام
  NARRATIVE = 'narrative',           // آيات قصصية
  PARABLE = 'parable',               // آيات أمثال
  COMMAND = 'command',               // آيات أوامر
  WARNING = 'warning',               // آيات تحذير
  SUPPLICATION = 'supplication',     // آيات دعاء
  WISDOM = 'wisdom',                 // آيات حكمة إلهية
}

// EXACT Quranic verses that should NEVER be classified as human wisdom
// These are complete, specific verse fragments - NOT general religious phrases
const EXACT_QURANIC_VERSES: string[] = [
  // آيات قصصية من سورة يوسف
  'يَا بُشْرَىٰ هَذَا غُلَامٌ',
  'يا بشرى هذا غلام',
  'رَبِّ السِّجْنُ أَحَبُّ إِلَيَّ مِمَّا يَدْعُونَنِي إِلَيْهِ',
  'رب السجن احب الي مما يدعونني اليه',
  'إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ',
  'انه ربي احسن مثواي',
  'لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ',
  'لا تثريب عليكم اليوم',
  'أَنَا أُنَبِّئُكُمْ بِتَأْوِيلِهِ',
  'انا انبئكم بتاويله',
  'اذْكُرْنِي عِنْدَ رَبِّكَ',
  'اذكرني عند ربك',
  'وَمَا أُبَرِّئُ نَفْسِي',
  'وما ابرئ نفسي',
  'إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ',
  'ان النفس لامارة بالسوء',
  'إِنِّي حَفِيظٌ عَلِيمٌ',
  'اني حفيظ عليم',
  'لَقَدْ لَقِينَا مِن سَفَرِنَا هَٰذَا نَصَبًا',
  'لقد لقينا من سفرنا هذا نصبا',
  
  // آيات دعاء وتوكل محددة
  'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
  'حسبنا الله ونعم الوكيل',
  'فَاصْبِرْ صَبْرًا جَمِيلًا',
  'فاصبر صبرا جميلا',
  'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
  'انا لله وانا اليه راجعون',
  'رَبِّ اشْرَحْ لِي صَدْرِي',
  'رب اشرح لي صدري',
  'رَبَّنَا لَا تُزِغْ قُلُوبَنَا',
  'ربنا لا تزغ قلوبنا',
  'ربنا عليك توكلنا',
  'رب اوزعني ان اشكر نعمتك',
  'رب أنزلني منزلاً مباركاً',
  'ربنا هب لنا من أزواجنا وذرياتنا قرة أعين',
  
  // آيات معروفة كاملة
  'وَعَسَىٰ أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ',
  'وعسى ان تكرهوا شيئا وهو خير لكم',
  'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
  'فان مع العسر يسرا',
  'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
  'لا يكلف الله نفسا الا وسعها',
  'وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَىٰ بِاللَّهِ وَكِيلًا',
  'وتوكل على الله وكفى بالله وكيلا',
  'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
  'الا بذكر الله تطمئن القلوب',
  'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
  'ورحمتي وسعت كل شيء',
  'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
  'ولا تياسوا من روح الله',
  'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
  'ومن يتوكل على الله فهو حسبه',
  'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
  'واصبر وما صبرك الا بالله',
  'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
  'لئن شكرتم لازيدنكم',
  'وَالصُّلْحُ خَيْرٌ',
  'والصلح خير',
  'هل يستوي الذين يعلمون والذين لا يعلمون',
  'وَقُلْ رَبِّ زِدْنِي عِلْمًا',
  'رب زدني علما',
  'اهدنا الصراط المستقيم',
  'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
  'وَشَاوِرْهُمْ فِي الْأَمْرِ',
  'وشاورهم في الامر',
  'ومن يتق الله يجعل له مخرجا',
  'وَالْكَاظِمِينَ الْغَيْظَ',
  'والكاظمين الغيظ',
  'وَالْعَافِينَ عَنِ النَّاسِ',
  'والعافين عن الناس',
  'وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ',
  'ولو كنت فظا غليظ القلب لانفضوا من حولك',
  'فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ',
  'فبما رحمة من الله لنت لهم',
  'وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
  'والله يحب المحسنين',
  'وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ',
  'ولقد كرمنا بني ادم',
  'وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ',
  'وجعلنا من الماء كل شيء حي',
  'فَاسْتَقِمْ كَمَا أُمِرْتَ',
  'فاستقم كما امرت',
  'وَقُولُوا قَوْلًا سَدِيدًا',
  'وقولوا قولا سديدا',
  'وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ',
  'واذا حكمتم بين الناس ان تحكموا بالعدل',
  'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ',
  'ان الله يامر بالعدل',
  'وَالَّذِينَ آمَنُوا أَشَدُّ حُبًّا لِّلَّهِ',
  'والذين امنوا اشد حبا لله',
];

// Function to check if text is a KNOWN Quranic verse (exact or near-exact match)
export function isQuranicText(text: string): boolean {
  if (!text) return false;
  
  // HIGH PRIORITY: Check for Quranic brackets (definitive indicator)
  if (text.includes('﴿') || text.includes('﴾')) {
    return true;
  }
  
  // Check for citation markers that indicate Quranic source
  if (/\([^)]*\d+[^)]*\)/.test(text) && (text.includes('سورة') || text.includes('آية'))) {
    return true;
  }
  
  const normalizedText = normalizeArabicText(text);
  
  // Check against EXACT known Quranic verses only
  for (const verse of EXACT_QURANIC_VERSES) {
    const normalizedVerse = normalizeArabicText(verse);
    
    // Exact match
    if (normalizedText === normalizedVerse) {
      return true;
    }
    
    // Input contains the full verse
    if (normalizedText.includes(normalizedVerse)) {
      return true;
    }
    
    // Verse contains input AND input is at least 80% of verse length (prevents short substring matches)
    if (normalizedVerse.includes(normalizedText) && 
        normalizedText.length >= normalizedVerse.length * 0.8) {
      return true;
    }
  }
  
  return false;
}

// Normalize Arabic text for comparison (remove diacritics, normalize alef, etc.)
export function normalizeArabicText(text: string): string {
  return text
    // Remove Arabic diacritics (tashkeel)
    .replace(/[\u064B-\u0652]/g, '')
    // Normalize alef variants
    .replace(/[إأآا]/g, 'ا')
    // Normalize yaa variants
    .replace(/[يى]/g, 'ي')
    // Normalize taa marbuta
    .replace(/ة/g, 'ه')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Get the appropriate label for Quranic text based on its type
export function getQuranicLabel(
  verseType: QuranicVerseType = QuranicVerseType.NARRATIVE,
  language: string = 'ar'
): { label: string; tooltip: string } {
  const labels: Record<string, Record<QuranicVerseType, { label: string; tooltip: string }>> = {
    ar: {
      [QuranicVerseType.DOCTRINAL]: {
        label: 'النص القرآني (عقيدة)',
        tooltip: 'هذا نص قرآني عقدي يُستخدم للتدريب اللغوي فقط'
      },
      [QuranicVerseType.LEGAL]: {
        label: 'النص القرآني (أحكام)',
        tooltip: 'هذا نص قرآني تشريعي يُستخدم للتدريب اللغوي فقط'
      },
      [QuranicVerseType.NARRATIVE]: {
        label: 'النص القرآني (سياق قصصي)',
        tooltip: 'هذا نص قرآني يُستخدم للتدريب اللغوي فقط، وليس حكمة أو مبدأ مستقل'
      },
      [QuranicVerseType.PARABLE]: {
        label: 'النص القرآني (مثَل)',
        tooltip: 'هذا مثَل قرآني يُستخدم للتدريب اللغوي فقط'
      },
      [QuranicVerseType.COMMAND]: {
        label: 'النص القرآني (أمر إلهي)',
        tooltip: 'هذا أمر قرآني يُستخدم للتدريب اللغوي فقط'
      },
      [QuranicVerseType.WARNING]: {
        label: 'النص القرآني (تحذير)',
        tooltip: 'هذا تحذير قرآني يُستخدم للتدريب اللغوي فقط'
      },
      [QuranicVerseType.SUPPLICATION]: {
        label: 'النص القرآني (دعاء)',
        tooltip: 'هذا دعاء قرآني يُستخدم للتدريب اللغوي فقط'
      },
      [QuranicVerseType.WISDOM]: {
        label: 'النص القرآني (حكمة إلهية)',
        tooltip: 'هذه حكمة إلهية من القرآن الكريم'
      },
    },
    en: {
      [QuranicVerseType.DOCTRINAL]: {
        label: 'Quranic Text (Doctrinal)',
        tooltip: 'This is a doctrinal Quranic verse used for linguistic training only'
      },
      [QuranicVerseType.LEGAL]: {
        label: 'Quranic Text (Legal)',
        tooltip: 'This is a legal Quranic verse used for linguistic training only'
      },
      [QuranicVerseType.NARRATIVE]: {
        label: 'Quranic Text (Narrative Context)',
        tooltip: 'This is a Quranic text used for linguistic training only, not an independent principle'
      },
      [QuranicVerseType.PARABLE]: {
        label: 'Quranic Text (Parable)',
        tooltip: 'This is a Quranic parable used for linguistic training only'
      },
      [QuranicVerseType.COMMAND]: {
        label: 'Quranic Text (Divine Command)',
        tooltip: 'This is a divine command used for linguistic training only'
      },
      [QuranicVerseType.WARNING]: {
        label: 'Quranic Text (Warning)',
        tooltip: 'This is a Quranic warning used for linguistic training only'
      },
      [QuranicVerseType.SUPPLICATION]: {
        label: 'Quranic Text (Supplication)',
        tooltip: 'This is a Quranic supplication used for linguistic training only'
      },
      [QuranicVerseType.WISDOM]: {
        label: 'Quranic Text (Divine Wisdom)',
        tooltip: 'This is divine wisdom from the Holy Quran'
      },
    },
  };
  
  const langLabels = labels[language] || labels['en'];
  return langLabels[verseType] || langLabels[QuranicVerseType.NARRATIVE];
}

// Validate that a text is NOT Quranic before allowing it to be classified as human wisdom
export function validateHumanWisdom(text: string): { isValid: boolean; reason?: string } {
  if (isQuranicText(text)) {
    return {
      isValid: false,
      reason: 'هذا النص قرآني ولا يجوز تصنيفه كحكمة بشرية - This text is Quranic and cannot be classified as human wisdom'
    };
  }
  return { isValid: true };
}
