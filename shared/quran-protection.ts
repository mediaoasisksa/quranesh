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

// Known Quranic phrases and verses for detection
// These are common phrases that appear in the Quran and should never be classified as human wisdom
export const KNOWN_QURANIC_PATTERNS: string[] = [
  // من سورة يوسف
  'يَا بُشْرَىٰ هَذَا غُلَامٌ',
  'يا بشرى هذا غلام',
  'يَا أَبَتِ',
  'يا أبت',
  'إِنَّا نَرَاكَ مِنَ الْمُحْسِنِينَ',
  'إنا نراك من المحسنين',
  'رَبِّ السِّجْنُ أَحَبُّ إِلَيَّ',
  'رب السجن أحب إلي',
  'مَعَاذَ اللَّهِ',
  'معاذ الله',
  'إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ',
  'إنه ربي أحسن مثواي',
  'لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ',
  'لا تثريب عليكم اليوم',
  
  // عبارات قرآنية شائعة
  'إِنَّ اللَّهَ',
  'إن الله',
  'بِسْمِ اللَّهِ',
  'بسم الله',
  'الْحَمْدُ لِلَّهِ',
  'الحمد لله',
  'سُبْحَانَ اللَّهِ',
  'سبحان الله',
  'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
  'إنا لله وإنا إليه راجعون',
  'لَا إِلَهَ إِلَّا اللَّهُ',
  'لا إله إلا الله',
  'قَالَ رَبِّ',
  'قال رب',
  'رَبَّنَا',
  'ربنا',
  'يَا أَيُّهَا الَّذِينَ آمَنُوا',
  'يا أيها الذين آمنوا',
  'وَقَالَ',
  'فَقَالَ',
  
  // من القصص القرآني
  'أَنَا أُنَبِّئُكُمْ بِتَأْوِيلِهِ',
  'أنا أنبئكم بتأويله',
  'اذْكُرْنِي عِنْدَ رَبِّكَ',
  'اذكرني عند ربك',
  'وَمَا أُبَرِّئُ نَفْسِي',
  'وما أبرئ نفسي',
  'إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ',
  'إن النفس لأمارة بالسوء',
  
  // آيات الصبر والتوكل
  'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
  'إن الله مع الصابرين',
  'وَتَوَكَّلْ عَلَى اللَّهِ',
  'وتوكل على الله',
  'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
  'حسبنا الله ونعم الوكيل',
  'فَاصْبِرْ صَبْرًا جَمِيلًا',
  'فاصبر صبرا جميلا',
  
  // آيات الشكر
  'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
  'لئن شكرتم لأزيدنكم',
  
  // آيات التوبة والمغفرة
  'وَاللَّهُ غَفُورٌ رَحِيمٌ',
  'والله غفور رحيم',
  'إِنَّ رَبِّي غَفُورٌ رَحِيمٌ',
  'إن ربي غفور رحيم',
  
  // Common Quranic markers
  '﴿',
  '﴾',
];

// Function to check if text is a Quranic verse
export function isQuranicText(text: string): boolean {
  if (!text) return false;
  
  const normalizedText = normalizeArabicText(text);
  
  // Check for Quranic brackets
  if (text.includes('﴿') || text.includes('﴾')) {
    return true;
  }
  
  // Check against known patterns
  for (const pattern of KNOWN_QURANIC_PATTERNS) {
    const normalizedPattern = normalizeArabicText(pattern);
    if (normalizedText.includes(normalizedPattern)) {
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

// List of texts that should be blocked from human wisdom classification
// These are exact matches or partial matches that indicate Quranic content
export const BLOCKED_HUMAN_WISDOM_PATTERNS = [
  ...KNOWN_QURANIC_PATTERNS,
  // Additional patterns that might slip through
  'قال الله',
  'قال تعالى',
  'قوله تعالى',
  'الآية',
  'سورة',
];
