import axios from "axios";
import type { Phrase } from "@shared/schema";

// قوائم الكلمات المفتاحية للحماية السياقية
// منتجات بشرية/تقنية - يجب عدم استخدام آيات الخلق معها
// هذه المواضيع تقنية بحتة ولا تستدعي استدلالاً دينياً
const PRODUCT_TECH_KEYWORDS = [
  // الأجهزة الإلكترونية
  'شاشة', 'هاتف', 'جوال', 'موبايل', 'سيارة', 'كمبيوتر', 'حاسوب', 'لابتوب',
  'تلفزيون', 'تلفاز', 'ثلاجة', 'غسالة', 'مكيف', 'مروحة', 'ساعة', 'كاميرا',
  'طابعة', 'ماكينة', 'آلة', 'جهاز', 'معدات', 'أدوات', 'قطع غيار',
  // الأعطال والصيانة
  'عطل', 'عطلان', 'خراب', 'تصليح', 'صيانة', 'إصلاح', 'تشغيل',
  'مكسور', 'مكسورة', 'معطل', 'معطلة', 'خربان', 'خربانة',
  // البنية التحتية التقنية
  'كهرباء', 'انترنت', 'واي فاي', 'شبكة', 'كابل', 'سلك', 'فيشة', 'مقبس',
  'بطارية', 'شاحن', 'محول', 'ترانس',
  // المركبات
  'موتور', 'محرك', 'إطار', 'فرامل', 'بنزين', 'زيت',
  // الإنجليزية
  'screen', 'phone', 'car', 'computer', 'device', 'machine', 'repair', 'broken',
  'electricity', 'internet', 'wifi', 'battery', 'charger',
  // المواعيد والتأجيل البشري - يمنع ربطها بآيات القدر الإلهي
  'موعد', 'مواعيد', 'تأجيل', 'تأخير', 'تأخرت', 'متأخر', 'متأخرة',
  'حجز', 'حجزت', 'تحديث', 'محدث', 'جدول', 'جدولة',
  'schedule', 'appointment', 'delay', 'postpone', 'late', 'booking',
  // تأكيد الحضور والالتزامات البشرية - يجب ربطها بالمشيئة وليس بآيات الوعد الإلهي
  'تؤكد الحضور', 'أؤكد الحضور', 'هل ستحضر', 'سأحضر', 'ستحضر',
  'تأكيد', 'التزام', 'وعد', 'أعدك', 'أتعهد',
  'confirm', 'attendance', 'presence', 'commitment', 'promise',
  // الإجراءات الرسمية والحكومية - يمنع ربطها بآيات العذاب أو القدر
  'فيزا', 'تأشيرة', 'جواز', 'جوازات', 'سفارة', 'قنصلية', 'إقامة',
  'تصريح', 'رخصة', 'طلب', 'استمارة', 'نموذج', 'وثيقة', 'مستند',
  'visa', 'passport', 'embassy', 'permit', 'license', 'document'
];

// آيات الخلق والإعجاز الإلهي وأفعال الله الذاتية - يجب عدم استخدامها للمنتجات البشرية أو المواعيد
const DIVINE_CREATION_PATTERNS = [
  // آيات الخلق والإتقان
  'صنع الله', 'صُنْعَ اللَّهِ', 'أتقن كل شيء', 'أَتْقَنَ كُلَّ شَيْءٍ',
  'خلق', 'خَلَقَ', 'فطر', 'فَطَرَ', 'برأ', 'بَرَأَ',
  'أحسن الخالقين', 'أَحْسَنَ الْخَالِقِينَ', 'أحسن كل شيء خلقه',
  'فتبارك الله', 'فَتَبَارَكَ اللَّهُ', 'الخلاق العليم', 'الْخَلَّاقُ الْعَلِيمُ',
  'خلق السماوات', 'خَلَقَ السَّمَاوَاتِ', 'خلق الإنسان', 'خَلَقَ الْإِنسَانَ',
  'بديع السماوات', 'بَدِيعُ السَّمَاوَاتِ', 'فاطر السماوات', 'فَاطِرِ السَّمَاوَاتِ',
  // آيات القدر والأمر الإلهي - يمنع ربطها بالمواعيد البشرية
  'أمرنا إلا واحدة', 'وَمَا أَمْرُنَا إِلَّا وَاحِدَةٌ', 'كن فيكون', 'كُن فَيَكُونُ',
  'إذا أراد شيئا', 'إِذَا أَرَادَ شَيْئًا', 'إنما أمره', 'إِنَّمَا أَمْرُهُ',
  'يحيي ويميت', 'يُحْيِي وَيُمِيتُ', 'ومن أحياها', 'وَمَنْ أَحْيَاهَا',
  'كل شيء أحصيناه', 'كُلَّ شَيْءٍ أَحْصَيْنَاهُ',
  // آيات العلم الإلهي - يمنع ربطها بالأجهزة والتحديثات التقنية
  'وعلم الإنسان', 'وَعَلَّمَ الْإِنسَانَ', 'علم الإنسان ما لم يعلم',
  'يعلم ما في السماوات', 'يَعْلَمُ مَا فِي السَّمَاوَاتِ',
  // آيات علم الغيب - يمنع ربطها بالمعلومات البشرية أو التوقعات
  'عنده علم الغيب', 'عِندَهُ عِلْمُ الْغَيْبِ', 'علام الغيوب', 'عَلَّامُ الْغُيُوبِ',
  'لا يعلم الغيب', 'لَا يَعْلَمُ الْغَيْبَ', 'علم الغيب', 'عِلْمِ الْغَيْبِ',
  'يعلم السر', 'يَعْلَمُ السِّرَّ', 'يعلم ما تخفي', 'يَعْلَمُ مَا تُخْفِي',
  // آيات الإحياء والإماتة - يمنع ربطها بالأجهزة أو المشاريع
  'يحيي ويميت', 'يُحْيِي وَيُمِيتُ', 'أحيا الموتى', 'أَحْيَا الْمَوْتَىٰ',
  'يخرج الحي', 'يُخْرِجُ الْحَيَّ', 'يخرج الميت', 'يُخْرِجُ الْمَيِّتَ',
  'من يحيي العظام', 'مَن يُحْيِي الْعِظَامَ', 'الذي أحياكم', 'الَّذِي أَحْيَاكُمْ',
  // آيات الإحصاء الإلهي - يمنع ربطها بالبيانات والملفات البشرية
  'أحصاه الله', 'أَحْصَاهُ اللَّهُ', 'وكل شيء أحصيناه', 'وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ',
  'لا يغادر صغيرة', 'لَا يُغَادِرُ صَغِيرَةً', 'ولا كبيرة', 'وَلَا كَبِيرَةً',
  // آيات الصراع التاريخي ومداولة الأيام - يمنع ربطها بالمواعيد الشخصية
  'نداولها', 'نُدَاوِلُهَا', 'تلك الأيام نداولها', 'وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا',
  'الأيام نداولها', 'نداولها بين الناس', 'نُدَاوِلُهَا بَيْنَ النَّاسِ',
  // آيات الوعد الإلهي المطلق - يمنع ربطها بتأكيد الحضور أو المواعيد البشرية
  'وعد الله حق', 'إِنَّ وَعْدَ اللَّهِ حَقٌّ', 'ان وعد الله حق',
  'وعد الله الذي لا يخلف', 'لَا يُخْلِفُ اللَّهُ وَعْدَهُ',
  'إن إلى ربك الرجعى', 'إِنَّ إِلَى رَبِّكَ الرُّجْعَى',
  'وإلى الله ترجع الأمور', 'وَإِلَى اللَّهِ تُرْجَعُ الْأُمُورُ',
  // آيات العذاب والأمم السابقة - يمنع ربطها بالمواقف اليومية
  'معذبين', 'مُعَذِّبِينَ', 'وما كنا معذبين', 'نبعث رسولا', 'نَبْعَثَ رَسُولًا',
  'أهلكنا', 'أَهْلَكْنَا', 'دمرنا', 'دَمَّرْنَا', 'أخذناهم', 'أَخَذْنَاهُمْ',
  'عذاب', 'عَذَابٌ', 'عقاب', 'عِقَابٌ', 'نكال', 'نَكَالٌ',
  'قوم نوح', 'قَوْمِ نُوحٍ', 'قوم لوط', 'قَوْمِ لُوطٍ', 'قوم عاد', 'قَوْمُ عَادٍ',
  'ثمود', 'ثَمُودَ', 'فرعون', 'فِرْعَوْنَ', 'أصحاب الأيكة', 'أَصْحَابُ الْأَيْكَةِ'
];

// دالة للتحقق من وجود منتجات بشرية في السياق
function containsProductKeywords(text: string): boolean {
  const normalizedText = removeDiacritics(text.toLowerCase());
  return PRODUCT_TECH_KEYWORDS.some(keyword => 
    normalizedText.includes(removeDiacritics(keyword.toLowerCase()))
  );
}

// دالة للتحقق من وجود آيات الخلق الإلهي
function containsDivineCreationPatterns(text: string): boolean {
  const normalizedText = removeDiacritics(text);
  return DIVINE_CREATION_PATTERNS.some(pattern => 
    normalizedText.includes(removeDiacritics(pattern))
  );
}

// =============================================================================
// المنهج المقاصدي: ربط الآيات بالمواقف حسب المعنى وليس اللفظ
// =============================================================================

// فئات المواقف البشرية مع الآيات المناسبة من لسان الأنبياء والبشر
const CONTEXTUAL_VERSE_MAPPING: Record<string, {
  verses: string[];
  source: string;
  blockedPatterns?: string[];
}> = {
  // التيسير والإجراءات الرسمية
  facilitation: {
    verses: [
      'يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ',
      'فَسَنُيَسِّرُهُ لِلْيُسْرَىٰ',
      'وَيَسِّرْ لِي أَمْرِي',
      'رَبِّ اشْرَحْ لِي صَدْرِي'
    ],
    source: 'آيات التيسير ودعاء الأنبياء',
    blockedPatterns: ['رسول', 'رسولا', 'نبعث', 'معذبين', 'عذاب']
  },
  // الموافقة والاتفاق
  agreement: {
    verses: [
      'قَالَ نَعَمْ',
      'قَالَ ذَٰلِكَ بَيْنِي وَبَيْنَكَ'
    ],
    source: 'لسان الأنبياء في الاتفاقات'
  },
  // المواساة والحزن
  consolation: {
    verses: [
      'وَلَا تَحْزَنْ عَلَيْهِمْ',
      'فَصَبْرٌ جَمِيلٌ',
      'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
      'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا'
    ],
    source: 'آيات المواساة والصبر'
  },
  // الخسارة والتعويض
  loss_compensation: {
    verses: [
      'عَسَىٰ رَبُّنَا أَن يُبْدِلَنَا خَيْرًا مِّنْهَا',
      'عَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ'
    ],
    source: 'لسان البشر (أصحاب الجنة)'
  },
  // التنظيم والإدارة
  organization: {
    verses: [
      'إِنِّي حَفِيظٌ عَلِيمٌ',
      'اجْعَلْنِي عَلَىٰ خَزَائِنِ الْأَرْضِ'
    ],
    source: 'لسان النبي يوسف (ع)'
  },
  // الحرفة والصناعة
  craftsmanship: {
    verses: [
      'وَعَلَّمْنَاهُ صَنْعَةَ لَبُوسٍ لَّكُمْ',
      'أَنِ اعْمَلْ سَابِغَاتٍ وَقَدِّرْ فِي السَّرْدِ'
    ],
    source: 'وصف لفعل بشري (داود)'
  },
  // الرحلة والالتزام
  commitment: {
    verses: [
      'سَتَجِدُنِي إِن شَاءَ اللَّهُ صَابِرًا',
      'عَسَىٰ رَبِّي أَن يَهْدِيَنِي سَوَاءَ السَّبِيلِ'
    ],
    source: 'لسان النبي موسى (ع)'
  },
  // التعب والإرهاق
  fatigue: {
    verses: [
      'لَقَدْ لَقِينَا مِن سَفَرِنَا هَٰذَا نَصَبًا'
    ],
    source: 'لسان النبي موسى (ع)'
  },
  // الخبرة والنجاح
  expertise: {
    verses: [
      'إِنَّمَا أُوتِيتُهُ عَلَىٰ عِلْمٍ عِندِي'
    ],
    source: 'وصف لتفكير بشري'
  }
};

// دالة لتحديد فئة الموقف من النص
function detectSituationCategory(text: string): string | null {
  const normalizedText = removeDiacritics(text.toLowerCase());
  
  // التيسير والإجراءات
  if (/فيزا|تأشيرة|جواز|سفارة|إقامة|تصريح|رخصة|إجراء|طلب/.test(normalizedText) ||
      /visa|passport|embassy|permit|license/.test(normalizedText)) {
    return 'facilitation';
  }
  
  // الموافقة والاتفاق
  if (/اتفاق|موافقة|نعم|مستعد|جاهز|شراكة|عقد/.test(normalizedText) ||
      /agreement|approval|ready|yes/.test(normalizedText)) {
    return 'agreement';
  }
  
  // المواساة
  if (/خيانة|غدر|حزن|فقد|وفاة|مصيبة|خذلان|صدمة/.test(normalizedText) ||
      /betrayal|grief|loss|death|sad/.test(normalizedText)) {
    return 'consolation';
  }
  
  // الخسارة والتعويض
  if (/تعطل|عطل|خسارة|ضاع|انكسر|خربان|فقدت/.test(normalizedText) ||
      /broken|lost|malfunction|damage/.test(normalizedText)) {
    return 'loss_compensation';
  }
  
  // التنظيم والإدارة
  if (/تنظيم|ملفات|إدارة|ترتيب|حفظ|أرشيف/.test(normalizedText) ||
      /organize|files|management|archive/.test(normalizedText)) {
    return 'organization';
  }
  
  // الحرفة والصناعة
  if (/برمجة|صناعة|حرفة|يدوي|فني|تقني|كود|تطوير/.test(normalizedText) ||
      /programming|craft|technical|code|development/.test(normalizedText)) {
    return 'craftsmanship';
  }
  
  // الرحلة والالتزام
  if (/رحلة|سفر|مهمة|التزام|تحدي/.test(normalizedText) ||
      /trip|travel|mission|commitment|challenge/.test(normalizedText)) {
    return 'commitment';
  }
  
  // التعب والإرهاق
  if (/تعب|إرهاق|منهك|مرهق|ضغط/.test(normalizedText) ||
      /tired|exhausted|fatigue|stress/.test(normalizedText)) {
    return 'fatigue';
  }
  
  // الخبرة والنجاح
  if (/خبرة|نجاح|تجربة|مهارة|احترافية/.test(normalizedText) ||
      /experience|success|expertise|skill/.test(normalizedText)) {
    return 'expertise';
  }
  
  return null;
}

// دالة للحصول على الآيات المناسبة للموقف
function getContextualVerses(situationCategory: string): string[] {
  const mapping = CONTEXTUAL_VERSE_MAPPING[situationCategory];
  return mapping ? mapping.verses : [];
}

// دالة للتحقق من ملاءمة الآية للموقف (المنهج المقاصدي)
function isVerseContextuallyAppropriate(verse: string, scenarioText: string): boolean {
  const category = detectSituationCategory(scenarioText);
  
  if (!category) return true; // لا يوجد تصنيف محدد، قبول الآية
  
  const mapping = CONTEXTUAL_VERSE_MAPPING[category];
  if (!mapping) return true;
  
  // التحقق من الأنماط الممنوعة
  if (mapping.blockedPatterns) {
    const normalizedVerse = removeDiacritics(verse);
    for (const pattern of mapping.blockedPatterns) {
      if (normalizedVerse.includes(removeDiacritics(pattern))) {
        return false; // الآية تحتوي على نمط ممنوع لهذا الموقف
      }
    }
  }
  
  return true;
}

// دالة لإزالة التشكيل من النص العربي (Ignore Diacritics)
function removeDiacritics(text: string): string {
  // Arabic diacritics Unicode range: \u064B-\u065F (Fathah, Dammah, Kasrah, Sukun, Shadda, etc.)
  // Also remove Tatweel (\u0640) and other marks
  return text
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// دالة للمقارنة المباشرة للنص العربي مع تجاهل التشكيل
function compareArabicText(userAnswer: string, expectedAnswer: string): boolean {
  const normalizedUser = removeDiacritics(userAnswer);
  const normalizedExpected = removeDiacritics(expectedAnswer);
  
  // التحقق من التطابق الكامل
  if (normalizedUser === normalizedExpected) {
    return true;
  }
  
  // التحقق من احتواء الإجابة المتوقعة على إجابة المستخدم أو العكس
  if (normalizedExpected.includes(normalizedUser) || normalizedUser.includes(normalizedExpected)) {
    return true;
  }
  
  // التحقق من تطابق الكلمات المفتاحية (على الأقل 70% من الكلمات)
  const userWords = normalizedUser.split(' ').filter(w => w.length > 1);
  const expectedWords = normalizedExpected.split(' ').filter(w => w.length > 1);
  
  if (userWords.length === 0 || expectedWords.length === 0) {
    return false;
  }
  
  let matchCount = 0;
  for (const word of userWords) {
    if (expectedWords.some(ew => ew.includes(word) || word.includes(ew))) {
      matchCount++;
    }
  }
  
  const matchRatio = matchCount / Math.min(userWords.length, expectedWords.length);
  return matchRatio >= 0.7;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}
// Using gemini-2.0-flash for reliable translations
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// نظام التقييم الجديد: ثلاث درجات بدل صح/خطأ
type ValidationGrade = 'exact_match' | 'valid_but_less_suitable' | 'incorrect';

interface AIValidationResult {
  isCorrect: boolean;
  grade: ValidationGrade; // الدرجة الجديدة
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
  suggestedAnswer?: string; // Suggested correct answer in Arabic (shown for 5 seconds when user makes a mistake)
  connectionExplanation?: string; // Explanation of logical connection between wisdom sentence and Quranic verse (for transformation exercises)
  confidence: number; // 0-1
  isAuthenticVerse?: boolean; // هل النص آية قرآنية صحيحة؟
  suitabilityScore?: number; // درجة ملاءمة الآية للموقف (0-100)
}

// =============================================================================
// نظام التحقق المنفصل: (أ) تحقق النص (ب) تحقق الملاءمة
// =============================================================================

// أنماط قرآنية معروفة للتحقق من صحة النص
const QURAN_VERIFICATION_PATTERNS = [
  // أدوات قرآنية شائعة
  /^(قال|قالوا|قالت|يقول|تقول)/,
  /^(إن|إنا|إنه|إنها|إنهم|إننا)/,
  /^(وقال|وقالوا|فقال|فقالوا)/,
  /^(يا أيها|يا أهل|يا بني|يا أبت)/,
  /^(الذين|الذي|التي|اللذان|اللتان)/,
  /^(ربنا|رب|ربي|ربك|ربكم)/,
  // كلمات قرآنية مميزة
  /(الله|الرحمن|الرحيم|المؤمنين|المتقين|الصالحين|الكافرين)/,
  /(السماوات|الأرض|الجنة|النار|الآخرة|الدنيا)/,
  /(صراط|سبيل|آية|آيات|كتاب|قرآن)/,
];

// التحقق من صحة النص القرآني (هل هذا قرآن فعلاً؟)
function verifyQuranicText(text: string): { isAuthentic: boolean; confidence: number } {
  const normalizedText = removeDiacritics(text);
  
  // التحقق من الطول المعقول
  if (normalizedText.length < 5) {
    return { isAuthentic: false, confidence: 0.9 };
  }
  
  // التحقق من وجود أحرف عربية
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (!hasArabic) {
    return { isAuthentic: false, confidence: 1.0 };
  }
  
  // التحقق من أنماط قرآنية
  let patternMatches = 0;
  for (const pattern of QURAN_VERIFICATION_PATTERNS) {
    if (pattern.test(normalizedText)) {
      patternMatches++;
    }
  }
  
  // إذا وجدنا أنماط قرآنية متعددة، نثق أنها آية
  if (patternMatches >= 2) {
    return { isAuthentic: true, confidence: 0.85 };
  }
  
  // إذا وجدنا نمطاً واحداً على الأقل، نعتبرها محتملة
  if (patternMatches >= 1) {
    return { isAuthentic: true, confidence: 0.7 };
  }
  
  // افتراضياً نعتبر النص العربي المعقول آية محتملة
  if (normalizedText.length >= 10) {
    return { isAuthentic: true, confidence: 0.5 };
  }
  
  return { isAuthentic: false, confidence: 0.6 };
}

// حساب درجة ملاءمة الآية للموقف (0-100)
function calculateSuitabilityScore(verse: string, scenarioText: string, expectedVerses: string[]): number {
  const normalizedVerse = removeDiacritics(verse);
  
  // تطابق تام مع الآية المتوقعة = 100
  for (const expected of expectedVerses) {
    if (compareArabicText(verse, expected)) {
      return 100;
    }
  }
  
  // تطابق جزئي مع الآية المتوقعة = 80-95
  for (const expected of expectedVerses) {
    const normalizedExpected = removeDiacritics(expected);
    if (normalizedVerse.includes(normalizedExpected) || normalizedExpected.includes(normalizedVerse)) {
      return 90;
    }
  }
  
  // التحقق من فئة الموقف
  const category = detectSituationCategory(scenarioText);
  if (category) {
    const contextualVerses = getContextualVerses(category);
    
    // الآية من نفس فئة الموقف = 70-85
    for (const contextVerse of contextualVerses) {
      if (compareArabicText(verse, contextVerse)) {
        return 85;
      }
      const normalizedContextVerse = removeDiacritics(contextVerse);
      if (normalizedVerse.includes(normalizedContextVerse) || normalizedContextVerse.includes(normalizedVerse)) {
        return 75;
      }
    }
  }
  
  // آية قرآنية صحيحة لكن ليست من الفئة المناسبة = 40-60
  const verification = verifyQuranicText(verse);
  if (verification.isAuthentic && verification.confidence >= 0.7) {
    return 50;
  }
  
  // آية قرآنية محتملة = 30-40
  if (verification.isAuthentic) {
    return 35;
  }
  
  // ليست آية قرآنية = 0-20
  return 10;
}

// تحديد الدرجة بناءً على التحقق المنفصل
function determineGrade(isAuthentic: boolean, suitabilityScore: number): ValidationGrade {
  if (!isAuthentic) {
    return 'incorrect';
  }
  
  if (suitabilityScore >= 80) {
    return 'exact_match'; // ✅ صحيح ومطابق
  }
  
  if (suitabilityScore >= 35) {
    return 'valid_but_less_suitable'; // 🟡 صحيح لكن غير أنسب خيار
  }
  
  return 'incorrect'; // 🔴 غير صحيح
}

export interface GeneratedExercise {
  arabicText: string;
  englishTranslation: string;
  surahAyah: string;
  lifeApplication: string;
  category: string;
  difficulty: number;
  isAIGenerated: boolean;
}

export async function validateArabicAnswer(
  userAnswer: string,
  exerciseType: string,
  context: string,
  expectedAnswer?: string,
  userLanguage: string = "en",
): Promise<AIValidationResult> {
  try {
    console.log("=== GEMINI AI VALIDATION ===");
    console.log("API Key present:", !!GEMINI_API_KEY);
    console.log("API URL:", GEMINI_API_URL);
    console.log("User Answer:", userAnswer);
    console.log("Exercise Type:", exerciseType);
    console.log("Context:", context);

    const prompt = createValidationPrompt(
      userAnswer,
      exerciseType,
      context,
      expectedAnswer,
      userLanguage,
    );
    console.log("Generated Prompt:", prompt.substring(0, 200) + "...");

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
        topP: 0.8,
        topK: 40,
      },
    });

    console.log("Gemini Response Status:", response.status);
    console.log("Gemini Response:", JSON.stringify(response.data, null, 2));

    const candidate = response.data.candidates[0];

    // Check if the response was cut off due to token limits
    if (candidate.finishReason === "MAX_TOKENS") {
      console.log(
        "Response was cut off due to token limits, using fallback validation",
      );
      return fallbackValidation(userAnswer, exerciseType, context);
    }

    // Check if there's content and text
    if (
      !candidate.content ||
      !candidate.content.parts ||
      !candidate.content.parts[0] ||
      !candidate.content.parts[0].text
    ) {
      console.log("No valid content in response, using fallback validation");
      return fallbackValidation(userAnswer, exerciseType, context);
    }

    const result = candidate.content.parts[0].text;
    console.log("Parsed Result:", result);

    const parsedResult = parseAIResponse(result);
    console.log("Final Validation Result:", parsedResult);

    return parsedResult;
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    console.log("Falling back to basic validation...");
    // Fallback to basic validation
    return fallbackValidation(userAnswer, exerciseType, context);
  }
}

function createValidationPrompt(
  userAnswer: string,
  exerciseType: string,
  context: string,
  expectedAnswer?: string,
  userLanguage: string = "en",
): string {
  let specificInstructions = "";

  // Provide specific instructions based on exercise type
  switch (exerciseType) {
    case "substitution":
      specificInstructions = `This is a SUBSTITUTION exercise. The student must replace a word in the given phrase with another Quranic attribute.
      - The answer should be a complete phrase with the substituted word
      - The substituted word should be a valid Quranic attribute (like غفور، رحيم، عزيز، حكيم، etc.)
      - The phrase should maintain proper Arabic grammar
      - Example: If given "والله غفور رحيم" and asked to replace "رحيم", a good answer would be "والله غفور عزيز"`;
      break;
    case "conversation":
      specificInstructions = `This is a CONVERSATION exercise using the TRIGGER-RESPONSE framework.
The scenario (TRIGGER) describes a real-life situation. The student must provide the natural Quranic phrase (RESPONSE) that a native Arabic speaker would quote in that situation.

EVALUATION — THE TRIGGER-RESPONSE TEST:
1. Does the student's answer contain KEYWORDS that map to the scenario's meaning?
   - The scenario says "doing good deeds" → answer should contain "المحسنين" or similar
   - The scenario says "hardship" → answer should contain "العسر" or similar
2. Would a native Arabic speaker naturally quote this phrase in this situation?
3. Is this an authentic Quranic verse or widely-used Islamic expression?
4. Is it short and practical for daily conversation (2-8 words preferred)?

ACCEPT if the answer's KEYWORDS semantically match the scenario's keywords, even if it's not the exact expected verse.
REJECT if:
❌ The answer is from a Quranic story/narrative that isn't quoted in daily speech
❌ The answer requires deep theological interpretation to see the connection
❌ The answer's keywords have NO direct mapping to the scenario

EXAMPLES:
✅ Scenario about "gratitude for blessings" → "الحمد لله" (keyword: حمد = gratitude)
✅ Scenario about "trusting Allah in difficulty" → "حسبنا الله ونعم الوكيل" (keyword: حسب = sufficient)
❌ Scenario about "making an appointment" → "الساعة آتية" (this is about Day of Judgment, NOT appointments)`;
      break;
    case "completion":
      specificInstructions = `This is a COMPLETION exercise. The student must complete a Quranic verse or phrase.
      - The completion should be grammatically correct
      - Should use appropriate Quranic vocabulary
      - Should complete the meaning properly`;
      break;
    case "comparison":
      specificInstructions = `This is a COMPARISON exercise. The student must explain differences between similar concepts.
      - Should provide clear explanations in Arabic
      - Should show understanding of subtle differences
      - Should use appropriate Islamic terminology`;
      break;
    case "roleplay":
      specificInstructions = `This is a ROLEPLAY exercise using the TRIGGER-RESPONSE framework.
The scenario places the student in a real-life situation (TRIGGER). They must respond with the Quranic phrase (RESPONSE) that a native Arabic speaker would naturally quote in that exact moment.

EVALUATION — THE TRIGGER-RESPONSE TEST:
1. Does the student's answer contain KEYWORDS that map to the scenario's core meaning?
   - Scenario about "someone regretting sins" → answer should relate to "mercy/forgiveness" (رحمة/مغفرة)
   - Scenario about "intense love for Allah" → answer should contain "أشد حبا" or similar
2. Would a native Arabic speaker naturally quote this in the described situation?
3. Is it authentic Quranic text?
4. Is the connection LINGUISTIC and IMMEDIATE (not abstract or requiring deep interpretation)?

ACCEPT if keywords map directly and a native speaker would naturally say it.
REJECT if:
❌ The connection is abstract/philosophical rather than linguistic
❌ The verse is from a specific Quranic narrative not quoted in daily speech
❌ No keyword mapping exists between scenario and answer`;
      break;
    case "transformation":
      specificInstructions = `This is a CONCEPT-BASED PHILOSOPHICAL MATCH exercise. 
      
🔴 CRITICAL: CONCEPT-BASED EVALUATION (NOT LEXICAL MATCHING)
You must evaluate based on PHILOSOPHICAL CONCEPTS, not literal/lexical similarity.

STEP 1: Extract the CORE CONCEPT from the wisdom sentence
- What is the ethical/philosophical PRINCIPLE?
- Examples of concepts: justice, objectivity, patience, gratitude, humility, emotional_control, self_awareness, accountability, forgiveness, perseverance

STEP 2: Identify the CONCEPTS expressed by the student's Quranic verse
- What ethical/philosophical principles does this verse teach?
- A verse can express MULTIPLE concepts

STEP 3: Accept if there is CONCEPTUAL OVERLAP
- If the verse expresses the SAME principle (even in different words) → ACCEPT as exact_match
- If the verse expresses a RELATED principle → ACCEPT as valid_but_less_suitable  
- Only reject if the verse is completely UNRELATED conceptually

📌 EXAMPLE:
Wisdom: "لا تمنع من اختلاف الرأي عبارة" (Don't let disagreement prevent expression)
Concepts: [objectivity, open_mindedness, emotional_control]

Student Answer: "ولا يجرمنكم شنآن قوم على ألا تعدلوا" (Don't let hatred of people prevent you from being just)
Verse Concepts: [justice, objectivity, emotional_control]

EVALUATION: ✅ CORRECT (conceptual overlap: objectivity + emotional_control)
Both teach: "Don't let emotions/conflict prevent you from doing what's right"

❌ WRONG APPROACH (what NOT to do):
- Rejecting because words don't match literally
- Requiring the verse to "look similar" to the wisdom
- Expecting specific keywords

✅ RIGHT APPROACH:
- Accept if the UNDERLYING PRINCIPLE is the same or related
- Accept if both texts teach the same life lesson
- Accept if a thoughtful student would see the connection

CRITICAL: Accept ANY authentic Quranic text (full or partial verses) that expresses a related concept!`;
      break;
    case "thematic":
      specificInstructions = `This is a THEMATIC exercise. The student must find relevant Quranic verses for life situations.
      - Should provide verses that are contextually appropriate
      - Should demonstrate understanding of the theme
      - Should use authentic Quranic text`;
      break;
    case "daily_contextual":
      specificInstructions = `This is a DAILY CONTEXTUAL exercise. The student must select the most fitting Quranic expression for a daily-life situation.

CRITICAL - SEMANTIC MEANING ANALYSIS REQUIRED:
This is a language learning application for Arabic learners. The focus is on understanding **SEMANTIC MEANING** and **CONTEXTUAL APPROPRIATENESS**, not exact match memorization.

EVALUATION CRITERIA (as an Arabic language scholar):
1. **SEMANTIC ANALYSIS**: Deeply analyze the Arabic meaning and implications of the selected expression
2. **CONTEXTUAL FIT**: Does this expression ADDRESS THE SITUATION'S NEED?
   - Example: If situation is "Help me overcome my shortcomings" (ساعدني في التغلب على أوجه قصوري)
     * "رَبَّنا أَتمِم لَنا نورَنا" = CORRECT (completing light = addressing shortcoming)
     * "رَبَّنا آتِنا مِن لَدُنكَ وَلِيّاً" = ALSO CORRECT (asking for protector = addressing weakness/shortcoming)
     * Both address the core concept of needing help to overcome deficiency
3. **LINGUISTIC REASONING**: Analyze word meanings, derivatives, and semantic fields
4. **MULTIPLE VALID ANSWERS**: Accept ALL semantically appropriate expressions, not just one "correct" answer

ACCEPT if:
✅ The expression's meaning relates to the situation's need (even indirectly)
✅ The semantic field overlaps (e.g., قصور/shortcoming relates to طلب الولي/seeking help)
✅ The expression addresses the same emotional/spiritual need
✅ A native Arabic speaker would find it contextually appropriate

REJECT only if:
❌ The expression is completely unrelated to the situation
❌ It contradicts the situation's intent
❌ It's not authentic Quranic text

Think like an Arabic language professor teaching vocabulary through meanings and contexts, NOT like a strict test grader looking for exact matches.`;
      break;
    default:
      specificInstructions = `Evaluate this Arabic exercise answer for accuracy and relevance.`;
  }

  // Language name mapping for clarity in prompt
  const languageNameMap: Record<string, string> = {
    en: "English",
    id: "Indonesian",
    tr: "Turkish",
    ar: "Arabic",
    zh: "Chinese",
    sw: "Swahili",
    so: "Somali",
    bs: "Bosnian",
    sq: "Albanian",
  };
  
  const targetLanguageName = languageNameMap[userLanguage] || "English";
  
  // Additional instruction for transformation exercises
  const connectionExplanationInstruction = exerciseType === "transformation" 
    ? `\n\n🔵 SPECIAL INSTRUCTION FOR TRANSFORMATION EXERCISES:
If the answer is CORRECT, you MUST provide a "connectionExplanation" field that explains the logical connection between the Arabic wisdom sentence ("${context}") and the Quranic verse provided by the student ("${userAnswer}").

The explanation should:
- Be written in ${targetLanguageName} language
- Be clear and insightful (2-4 sentences)
- Show how both texts convey similar or related wisdom/philosophy
- Help the student understand the deeper connection
- Be encouraging and educational

Example (if target language is English):
"Both texts emphasize the importance of patience and perseverance. The wisdom sentence teaches us that consistent effort leads to growth, while the Quranic verse reminds us that with every difficulty comes ease, reinforcing the same principle of hope through persistence."`
    : "";

  const basePrompt = `You are an expert Arabic teacher specializing in Quranic Arabic. 
Evaluate this student's answer for an Arabic language exercise.

Exercise Type: ${exerciseType}
Context/Question: ${context}
Student Answer: "${userAnswer}"
${expectedAnswer ? `Expected Answer: ${expectedAnswer}` : ""}

${specificInstructions}

🔴 CRITICAL RULE ABOUT QURANIC TEXT (APPLIES TO ALL EXERCISE TYPES):
- ALWAYS ACCEPT partial Quranic verses, phrases, or any authentic Quranic text as CORRECT answers
- Students can provide:
  ✅ Complete verses: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ"
  ✅ Partial verses: "وما تفعلوا من خير" (from Surah Al-Baqarah 2:215)
  ✅ Short Quranic phrases: "إن مع العسر يسرا", "والله بصير", "يحب المحسنين"
  ✅ Even 3-4 words from a verse if they are authentic Quranic text
- DO NOT reject answers just because they are "not a complete verse"
- If the text is from the Quran and relates to the context, mark it as CORRECT
- Partial verses are just as valid as complete verses!
${connectionExplanationInstruction}

Please evaluate the answer considering:
1. Is this authentic Quranic text (complete OR partial)? If YES → mark as correct
2. Arabic language accuracy and grammar
3. Relevance to the specific exercise context
4. Proper use of Quranic vocabulary and concepts
5. Alternative correct answers that would also be acceptable
6. Partial credit for partially correct answers
7. Whether the answer directly addresses what was asked

Respond ONLY with a JSON object in this exact format:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "string (helpful feedback in English explaining why correct/incorrect)",
  "suggestions": ["string array of specific improvement suggestions"],
  "suggestedAnswer": "string (if answer is incorrect, provide ONE example of a correct answer in Arabic that would be appropriate)"${exerciseType === "transformation" ? `,\n  "connectionExplanation": "string (REQUIRED for transformation exercises when answer is correct - explain the logical connection in ${targetLanguageName} language)"` : ""},
  "confidence": number (0-1)
}`;

  return basePrompt;
}

function parseAIResponse(response: string): AIValidationResult {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const score = Math.max(0, Math.min(100, parsed.score || 0));
    const isCorrect = parsed.isCorrect || false;
    
    // تحديد الدرجة بناءً على النتيجة والنقاط
    let grade: ValidationGrade = 'incorrect';
    if (isCorrect && score >= 80) {
      grade = 'exact_match';
    } else if (isCorrect || score >= 40) {
      grade = 'valid_but_less_suitable';
    }

    return {
      isCorrect: isCorrect,
      grade: grade,
      score: score,
      feedback: parsed.feedback || "No feedback provided",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      suggestedAnswer: parsed.suggestedAnswer || undefined,
      connectionExplanation: parsed.connectionExplanation || undefined,
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      isCorrect: false,
      grade: 'incorrect' as ValidationGrade,
      score: 0,
      feedback: "Unable to evaluate answer. Please try again.",
      suggestions: ["Check your Arabic spelling and grammar"],
      suggestedAnswer: undefined,
      confidence: 0,
    };
  }
}

function fallbackValidation(
  userAnswer: string,
  exerciseType: string,
  context: string = "",
): AIValidationResult {
  console.log("=== FALLBACK VALIDATION DEBUG ===");
  console.log("Exercise Type:", exerciseType);
  console.log("User Answer:", userAnswer);
  console.log("Context:", context);
  console.log("================================");

  // Basic fallback validation with exercise-specific checks
  const hasArabic = /[\u0600-\u06FF]/.test(userAnswer);
  const hasContent = userAnswer.trim().length > 2;

  let exerciseSpecificFeedback = "";
  let suggestions: string[] = [];
  let suggestedAnswer: string | undefined = undefined;

  switch (exerciseType) {
    case "substitution":
      // For substitution, check if the answer is a complete phrase with Quranic attributes
      const hasQuranicAttribute =
        /(غفور|رحيم|عزيز|حكيم|كريم|عليم|حليم|شكور|صبور|ودود|مجيد|عظيم|قدير|سميع|بصير|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم|ودود|شكور|صبور|حليم|كريم|عظيم|مجيد|قدير|سميع|بصير|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم)/.test(
          userAnswer,
        );
      const isCompletePhrase =
        userAnswer.includes("الله") || userAnswer.includes("اللَّهُ");

      if (hasQuranicAttribute && isCompletePhrase) {
        exerciseSpecificFeedback =
          "Excellent substitution! Well done on using proper Quranic vocabulary.";
        suggestions = [
          "Perfect! You correctly substituted with a valid Quranic attribute",
          "Great job maintaining proper Arabic grammar",
        ];
      } else if (hasQuranicAttribute) {
        exerciseSpecificFeedback =
          'You used a Quranic attribute, but try to provide a complete phrase like "والله غفور عزيز"';
        suggestions = [
          'Complete the phrase with "والله" or similar',
          "Make sure to include the full context",
        ];
      } else {
        exerciseSpecificFeedback =
          "Incorrect! For substitution exercises, replace a word with another Quranic attribute (like غفور، رحيم، عزيز، حكيم)";
        suggestions = [
          "Use valid Quranic attributes",
          "Try: والله غفور عزيز",
          "Complete the phrase properly",
        ];
        suggestedAnswer = "وَاللَّهُ غَفُورٌ رَحِيمٌ";
      }
      break;
    case "conversation":
      // التحقق من تمارين المحادثة باستخدام مقارنة النص العربي فقط
      console.log("=== CONVERSATION FALLBACK VALIDATION ===");
      console.log("User Answer:", userAnswer);
      console.log("Context (Arabic suggested verse):", context);

      // التحقق من وجود نمط قرآني في الإجابة
      const hasQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|بصير|سميع|عليم|حكيم|عزيز|قدير|غفور|رحيم|عظيم|مجيد|ودود|شكور|صبور|حليم|كريم)/.test(
          userAnswer,
        );

      // إذا كان هناك آية مقترحة، نقارن النص العربي مباشرة
      if (context && context.trim().length > 0) {
        const isArabicMatch = compareArabicText(userAnswer, context);
        console.log("Arabic text comparison result:", isArabicMatch);
        
        if (isArabicMatch) {
          exerciseSpecificFeedback = "ممتاز! إجابتك صحيحة ومطابقة للآية القرآنية.";
          suggestions = [
            "أحسنت! هذه هي الآية المطلوبة",
            "إجابة صحيحة",
          ];
        } else if (hasQuranicPattern) {
          exerciseSpecificFeedback = "إجابتك تحتوي على نص قرآني لكنها لا تطابق الآية المقترحة.";
          suggestions = [
            "راجع الآية المقترحة وحاول مرة أخرى",
            "تأكد من كتابة الآية بشكل صحيح",
          ];
        } else {
          exerciseSpecificFeedback = "إجابتك لا تحتوي على آية قرآنية صحيحة.";
          suggestions = [
            "استخدم آية قرآنية",
            "راجع الآية المقترحة",
          ];
        }
      } else if (hasQuranicPattern) {
        exerciseSpecificFeedback = "إجابتك تحتوي على نص قرآني.";
        suggestions = [
          "تم قبول الإجابة كنص قرآني",
        ];
      } else {
        exerciseSpecificFeedback = "إجابتك لا تحتوي على آية قرآنية.";
        suggestions = [
          "استخدم آية قرآنية مناسبة للموقف",
        ];
      }
      console.log("================================");
      break;
    case "completion":
      exerciseSpecificFeedback =
        "For completion exercises, finish the verse or phrase correctly";
      suggestions = [
        "Use appropriate Quranic vocabulary",
        "Complete the meaning",
        "Check grammar",
      ];
      suggestedAnswer = "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ";
      break;
    case "roleplay":
      // Check for Quranic patterns and comfort-related words
      const hasRoleplayQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل)/.test(
          userAnswer,
        );
      const hasComfortWords =
        /(رحمة|صبر|فرج|أمل|يسر|نجاة|عون|توكل|ثقة|طمأنينة)/.test(userAnswer);

      if (hasRoleplayQuranicPattern && hasComfortWords) {
        exerciseSpecificFeedback =
          "Good attempt! This appears to contain Quranic language and comfort themes.";
        suggestions = [
          "Verify this is an authentic Quranic verse",
          "Ensure it addresses the scenario of consoling someone hopeless",
        ];
      } else if (hasRoleplayQuranicPattern) {
        exerciseSpecificFeedback =
          "This has Quranic patterns, but may not be appropriate for consoling someone who feels hopeless.";
        suggestions = [
          "Use verses about hope and comfort",
          'Try verses like "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" or "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"',
        ];
      } else {
        exerciseSpecificFeedback =
          "Incorrect! For roleplay exercises, use an authentic Quranic verse that provides comfort and hope.";
        suggestions = [
          "Use a genuine Quranic verse",
          "Choose verses about mercy, hope, and relief",
          'Example: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" (Indeed, with hardship comes ease)',
        ];
        suggestedAnswer = "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا";
      }
      break;
    case "transformation":
      // CRITICAL: Accept partial Quranic verses as correct answers!
      // But ensure we don't over-accept non-Quranic Arabic text
      
      // Strong Quranic patterns - particles and words that typically indicate Quranic text
      const hasStrongQuranicPattern =
        /(إن الله|إنا|فإن|والله|يا رب|الله|الرحمن الرحيم|قل|ولقد|وما|فلا تقنطوا|لا تيأسوا|إن مع)/.test(
          userAnswer,
        );
      
      // Quranic vocabulary - words commonly found in Quran
      const hasQuranicVocabulary =
        /(يحب|يعلم|يرى|يسمع|عليم|حكيم|بصير|سميع|غفور|رحيم|عزيز|قدير|خير|شر|نور|ظلمات|هدى|ضلال|إيمان|كفر|جنة|نار|صبر|شكر|توبة|مغفرة|رحمة|عذاب|المحسنين|المتقين|الصالحين|الظالمين)/.test(
          userAnswer,
        );
      
      const isReasonableLength = userAnswer.length >= 8;
      
      // Known partial Quranic verses - curated list of commonly used partial verses
      const isKnownPartialVerse = 
        /(وما تفعلوا من خير|تفعلوا من خير|مع العسر يسرا|إن مع العسر يسرا|والله بصير|الله سميع|يحب المحسنين|لا يضيع أجر|على كل شيء قدير|إن الله لا يضيع أجر|يضيع أجر المحسنين|إن الله غفور رحيم|والله غفور رحيم)/.test(userAnswer);

      console.log("=== TRANSFORMATION VALIDATION DEBUG ===");
      console.log("User Answer:", userAnswer);
      console.log("Has Strong Quranic Pattern:", hasStrongQuranicPattern);
      console.log("Has Quranic Vocabulary:", hasQuranicVocabulary);
      console.log("Is Reasonable Length:", isReasonableLength);
      console.log("Is Known Partial Verse:", isKnownPartialVerse);
      console.log("================================");

      // Accept if:
      // 1. It's a known partial verse, OR
      // 2. It has BOTH strong Quranic pattern AND Quranic vocabulary (not just pattern alone)
      if (isKnownPartialVerse || (hasStrongQuranicPattern && hasQuranicVocabulary && isReasonableLength)) {
        exerciseSpecificFeedback =
          "Excellent! This appears to be authentic Quranic text (complete or partial verse). Great job!";
        suggestions = [
          "Perfect! You provided authentic Quranic text",
          "This verse/phrase relates well to the wisdom sentence",
          "Well done on recognizing the philosophical connection",
        ];
      } else if (hasStrongQuranicPattern || hasQuranicVocabulary) {
        exerciseSpecificFeedback =
          "Your answer appears to be Quranic text. Let me verify the conceptual connection to the wisdom.";
        suggestions = [
          "Your verse expresses an ethical principle",
          "Consider how it relates to the wisdom's core concept",
          "Both similar and contrasting principles are valid connections",
        ];
      } else {
        exerciseSpecificFeedback =
          "Your answer reflects a related ethical principle, but try to find a verse that matches the wisdom more directly.";
        suggestions = [
          "Think about the core CONCEPT of the wisdom (e.g., justice, patience, gratitude)",
          "Find a Quranic verse that teaches the same life lesson",
          "The verse doesn't need to use similar words - just express a similar or opposite principle",
        ];
      }
      break;
    case "thematic":
      // For thematic exercises, check if the answer contains Quranic verses and relates to the theme
      const hasThematicQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل|غفران|عفو|مغفرة|رحمة|عفو|غفر|توبة|توب|استغفار)/.test(
          userAnswer,
        );
      const hasThemeKeywords = context
        ? context
            .toLowerCase()
            .split(/[,\s]+/)
            .some((keyword) =>
              userAnswer.toLowerCase().includes(keyword.toLowerCase()),
            )
        : false;

      if (hasThematicQuranicPattern && hasThemeKeywords) {
        exerciseSpecificFeedback =
          "Excellent! You provided a relevant Quranic verse that matches the theme.";
        suggestions = [
          "Perfect thematic choice!",
          "Great understanding of the context",
          "Well done on finding an appropriate verse",
        ];
      } else if (hasThematicQuranicPattern) {
        exerciseSpecificFeedback =
          "You provided a Quranic verse, but make sure it relates to the specific theme.";
        suggestions = [
          "Choose a verse that directly relates to the theme",
          "Consider verses about mercy, forgiveness, patience, etc.",
          "Make sure the verse addresses the specific situation",
        ];
      } else if (hasThemeKeywords) {
        exerciseSpecificFeedback =
          "Your answer relates to the theme, but try to provide an actual Quranic verse.";
        suggestions = [
          "Use authentic Quranic text",
          'Start with "إن الله" or similar Quranic phrases',
          "Look for verses that contain the theme keywords",
        ];
      } else {
        exerciseSpecificFeedback =
          "For thematic exercises, provide a Quranic verse that relates to the given theme.";
        suggestions = [
          "Use authentic Quranic text",
          "Choose verses about mercy, forgiveness, patience, etc.",
          "Make sure the verse addresses the specific situation",
        ];
        suggestedAnswer = "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ";
      }
      break;
    default:
      exerciseSpecificFeedback =
        "Provide a contextually appropriate Arabic answer";
      suggestions = [
        "Use proper Arabic",
        "Address the specific question",
        "Check relevance",
      ];
      suggestedAnswer = "وَاللَّهُ عَلِيمٌ حَكِيمٌ";
  }

  // For different exercise types, check if it's actually correct
  let isActuallyCorrect = hasArabic && hasContent;

  if (exerciseType === "substitution") {
    console.log("=== SUBSTITUTION VALIDATION START ===");
    console.log("Original phrase (context):", context);
    console.log("User Answer:", userAnswer);

    // Normalize both strings for comparison (remove diacritics and extra whitespace)
    const normalizeArabic = (text: string) => {
      return text
        .replace(/[\u064B-\u065F\u0670]/g, "") // Remove diacritics
        .replace(/[ٱأإآ]/g, "ا") // Normalize alef variants
        .replace(/[ى]/g, "ي") // Normalize ya
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
        .toLowerCase();
    };

    const normalizedOriginal = normalizeArabic(context);
    const normalizedAnswer = normalizeArabic(userAnswer);

    console.log("Normalized Original:", normalizedOriginal);
    console.log("Normalized Answer:", normalizedAnswer);

    // Split into words/tokens
    const originalTokens = normalizedOriginal.split(/\s+/);
    const answerTokens = normalizedAnswer.split(/\s+/);

    console.log("Original Tokens:", originalTokens);
    console.log("Answer Tokens:", answerTokens);

    // Check if the answer has similar length (allowing some flexibility)
    const lengthRatio = answerTokens.length / originalTokens.length;
    const hasCorrectLength = lengthRatio >= 0.7 && lengthRatio <= 1.3;

    console.log("Length ratio:", lengthRatio, "Valid:", hasCorrectLength);

    // Compare tokens directly from the original phrase
    // In substitution drill, students should keep most tokens and only change 1-2 words
    
    // Check how many original tokens are preserved (in order)
    let matchedTokens = 0;
    let totalTokensToMatch = originalTokens.length;
    
    // For each original token, check if it appears in the answer in roughly the same position
    for (let i = 0; i < originalTokens.length; i++) {
      const originalToken = originalTokens[i];
      
      // Check if this token exists in the answer (allowing some position flexibility)
      const foundIndex = answerTokens.indexOf(originalToken);
      
      if (foundIndex !== -1) {
        // Token found - check if position is roughly similar (within 2 positions)
        const positionDiff = Math.abs(i - foundIndex);
        if (positionDiff <= 2) {
          matchedTokens++;
        }
      }
    }

    // Calculate structure preservation rate based on how many original tokens are kept
    // For substitution drill, we expect 60-90% of tokens to be identical
    const structurePreservationRate = totalTokensToMatch > 0 
      ? matchedTokens / totalTokensToMatch 
      : 0;

    console.log(
      "Structure preservation:",
      matchedTokens,
      "/",
      totalTokensToMatch,
      "=",
      structurePreservationRate,
    );

    // Check if substituted word is a valid Quranic attribute/noun
    const hasQuranicAttribute =
      /(غفور|رحيم|عزيز|حكيم|كريم|عليم|حليم|شكور|صبور|ودود|مجيد|عظيم|قدير|سميع|بصير|عالم|غفار|تواب|رحمن|خبير|حكيم|قوي|متين|لطيف|حفيظ|مقيت|حسيب|جليل|كريم|رقيب|مجيب|واسع|حكيم|ودود|مجيد|باعث|شهيد|حق|وكيل|قوي|متين|ولي|حميد|محصي|مبدئ|معيد|محيي|مميت|حي|قيوم|واجد|ماجد|واحد|احد|صمد|قادر|مقتدر|مقدم|مؤخر|اول|اخر|ظاهر|باطن|والي|متعال|بر|تواب|منتقم|عفو|رؤوف|مالك|ذو|جلال|اكرام|مقسط|جامع|غني|مغني|مانع|ضار|نافع|نور|هادي|بديع|باقي|وارث|رشيد|صبور|ظالمين|مسرفين|محسنين|مقسطين|متقين|صابرين|صادقين|متوكلين)/.test(
        userAnswer,
      );

    console.log("Has Quranic attribute:", hasQuranicAttribute);

    // Calculate relevance score (0-100)
    let relevanceScore = 0;

    // 50% for structure preservation (most important - need to keep most of the original)
    relevanceScore += structurePreservationRate * 50;

    // 30% for having valid Quranic attribute
    if (hasQuranicAttribute) {
      relevanceScore += 30;
    }

    // 20% for correct length
    if (hasCorrectLength) {
      relevanceScore += 20;
    }

    console.log("Relevance score:", relevanceScore);

    // Consider it correct if:
    // 1. Structure preservation is at least 50% (kept at least half the original tokens)
    // 2. AND overall relevance score is >= 60
    // 3. AND has a valid Quranic attribute (to ensure substitution is appropriate)
    const hasGoodStructure = structurePreservationRate >= 0.5;
    isActuallyCorrect = hasGoodStructure && hasQuranicAttribute && relevanceScore >= 60;

    console.log("Structure >= 50%:", hasGoodStructure, "Has Quranic attr:", hasQuranicAttribute, "Score >= 60:", relevanceScore >= 60);

    // Update feedback based on what's missing
    if (!isActuallyCorrect) {
      if (structurePreservationRate < 0.5) {
        exerciseSpecificFeedback =
          "You need to maintain the same grammatical structure as the original phrase. Keep most words and only substitute 1-2 words.";
        suggestions = [
          `Keep at least ${Math.ceil(originalTokens.length * 0.5)} of the ${originalTokens.length} original words`,
          "Only substitute the attribute, noun, or verb - not the entire phrase",
          `Your structure preservation: ${Math.round(structurePreservationRate * 100)}% (need at least 50%)`,
        ];
      } else if (!hasQuranicAttribute) {
        exerciseSpecificFeedback =
          "Your structure is good, but use a valid Quranic attribute or noun for the substitution.";
        suggestions = [
          "Use Quranic attributes like: المقسطين، المتقين، الصابرين، المحسنين",
          "Or divine attributes like: حكيم، خبير، عليم، بصير، سميع",
          "Make sure the substituted word fits grammatically",
        ];
      } else {
        exerciseSpecificFeedback = `Your answer is close but needs improvement. Relevance score: ${Math.round(relevanceScore)}% (need at least 60%)`;
        suggestions = [
          "Check the grammatical structure more carefully",
          "Ensure all key elements from the original are preserved",
          "Verify the substituted word is appropriate",
        ];
      }
    } else {
      exerciseSpecificFeedback =
        "Excellent substitution! You maintained the structure and used a valid Quranic term.";
      suggestions = [
        "Perfect structure preservation!",
        "Great choice of Quranic vocabulary",
        `Relevance score: ${Math.round(relevanceScore)}%`,
      ];
    }

    console.log("Final decision:", isActuallyCorrect);
    console.log("=========================================");
  } else if (exerciseType === "conversation") {
    // التحقق من تمارين المحادثة باستخدام مقارنة النص العربي فقط
    console.log("=== CONVERSATION VALIDATION START ===");
    console.log("User Answer:", userAnswer);
    console.log("Context (Arabic suggested verse):", context);

    // التحقق من وجود نمط قرآني في الإجابة
    const hasQuranicPattern =
      /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|بصير|سميع|عليم|حكيم|عزيز|قدير|غفور|رحيم|عظيم|مجيد|ودود|شكور|صبور|حليم|كريم)/.test(
        userAnswer,
      );

    // مقارنة النص العربي مباشرة مع الآية المقترحة
    const isArabicMatch = context && context.trim().length > 0 
      ? compareArabicText(userAnswer, context) 
      : false;

    console.log("Has Quranic Pattern:", hasQuranicPattern);
    console.log("Arabic text match:", isArabicMatch);
    console.log("========================================");

    // الإجابة صحيحة إذا تطابقت مع الآية المقترحة أو إذا كانت تحتوي على نمط قرآني
    isActuallyCorrect = hasArabic && hasContent && (isArabicMatch || hasQuranicPattern);
    
    // تحديث رسالة الملاحظات
    if (!isActuallyCorrect) {
      if (!hasArabic || !hasContent) {
        exerciseSpecificFeedback = "الرجاء كتابة إجابة باللغة العربية.";
        suggestions = [
          "استخدم آية قرآنية مناسبة للموقف",
        ];
      } else {
        exerciseSpecificFeedback = "إجابتك لا تحتوي على آية قرآنية. حاول مرة أخرى.";
        suggestions = [
          "استخدم آية قرآنية مناسبة للموقف",
          "راجع الآية المقترحة",
        ];
      }
    } else {
      exerciseSpecificFeedback = "ممتاز! إجابتك صحيحة.";
      suggestions = [
        "أحسنت!",
      ];
    }
  } else if (exerciseType === "roleplay") {
    // For roleplay exercises, use the new grading system
    const hasRoleplayQuranicPattern =
      /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل|اعملوا|سيرى|عملكم)/.test(
        userAnswer,
      );
    const hasComfortWords =
      /(رحمة|صبر|فرج|أمل|يسر|نجاة|عون|توكل|ثقة|طمأنينة|اعملوا|عمل)/.test(userAnswer);
    
    // التحقق من صحة النص القرآني
    const verificationResult = verifyQuranicText(userAnswer);
    
    // إذا كانت آية قرآنية صحيحة
    if (verificationResult.isAuthentic && hasArabic && hasContent) {
      // التحقق من الملاءمة للموقف
      const suitability = calculateSuitabilityScore(userAnswer, context, []);
      
      if (suitability >= 80 || (hasRoleplayQuranicPattern && hasComfortWords)) {
        // ✅ صحيح ومطابق
        isActuallyCorrect = true;
        exerciseSpecificFeedback = "✅ ممتاز! إجابتك صحيحة ومطابقة للموقف.";
        suggestions = ["أحسنت! اخترت آية مناسبة تماماً."];
      } else if (suitability >= 35 || hasRoleplayQuranicPattern) {
        // 🟡 صحيح لكن غير أنسب خيار - نعتبرها صحيحة جزئياً
        isActuallyCorrect = true;
        exerciseSpecificFeedback = "🟡 آية قرآنية صحيحة، لكن قد تكون هناك آيات أنسب لهذا الموقف.";
        suggestions = [
          "للتقاعد والفراغ: جرّب آيات عن العطاء المستمر مثل (وَافْعَلُوا الْخَيْرَ لَعَلَّكُمْ تُفْلِحُونَ)",
          "آيتك صحيحة لكن الموقف يحتاج آية تعطي معنى للمرحلة والعطاء بعد الكِبر",
        ];
      } else {
        // آية قرآنية لكن غير مناسبة للسياق
        isActuallyCorrect = false;
        exerciseSpecificFeedback = "🔴 آية قرآنية صحيحة، لكنها لا تناسب هذا الموقف تماماً.";
        suggestions = [
          "اختر آية تتناسب مع الحالة الشعورية للموقف",
          "راجع السياق واختر آية تعبر عن المعنى المطلوب",
        ];
      }
    } else {
      isActuallyCorrect = false;
      exerciseSpecificFeedback = "🔴 الرجاء كتابة آية قرآنية صحيحة.";
      suggestions = [
        "استخدم آية قرآنية حقيقية",
        "تأكد من صحة النص القرآني",
      ];
    }
  } else if (exerciseType === "transformation") {
    // For transformation exercises, check if the answer is a Quranic verse (philosophical match)
    // CRITICAL: Accept partial Quranic verses!
    
    // Strong Quranic patterns matching the first validation section
    const hasStrongQuranicPatternFinal =
      /(إن الله|إنا|فإن|والله|يا رب|الله|الرحمن الرحيم|قل|ولقد|وما|فلا تقنطوا|لا تيأسوا|إن مع|العسر|اليسر|صبر|رحمة)/.test(
        userAnswer,
      );
    
    const hasQuranicVocabularyFinal =
      /(يحب|يعلم|يرى|يسمع|عليم|حكيم|بصير|سميع|غفور|رحيم|عزيز|قدير|خير|شر|نور|ظلمات|هدى|ضلال|إيمان|كفر|جنة|نار|صبر|شكر|توبة|مغفرة|رحمة|عذاب|المحسنين|المتقين|الصالحين|الظالمين)/.test(
        userAnswer,
      );
    
    // Known partial verses matching the first validation section
    const isKnownPartialVerseFinal = 
      /(وما تفعلوا من خير|تفعلوا من خير|مع العسر يسرا|إن مع العسر يسرا|والله بصير|الله سميع|يحب المحسنين|لا يضيع أجر|على كل شيء قدير|إن الله لا يضيع أجر|يضيع أجر المحسنين|إن الله غفور رحيم|والله غفور رحيم)/.test(userAnswer);

    console.log("=== TRANSFORMATION FINAL VALIDATION DEBUG ===");
    console.log("User Answer:", userAnswer);
    console.log("Has Arabic:", hasArabic);
    console.log("Has Content:", hasContent);
    console.log("Has Strong Quranic Pattern:", hasStrongQuranicPatternFinal);
    console.log("Has Quranic Vocabulary:", hasQuranicVocabularyFinal);
    console.log("Is Known Partial Verse:", isKnownPartialVerseFinal);
    console.log("Context (Wisdom Sentence):", context);
    console.log(
      "Will be correct:",
      hasArabic && hasContent && (isKnownPartialVerseFinal || (hasStrongQuranicPatternFinal && hasQuranicVocabularyFinal)),
    );
    console.log("=====================================");

    // Accept if:
    // 1. It's a known partial verse, OR
    // 2. It has BOTH strong Quranic pattern AND Quranic vocabulary
    isActuallyCorrect = hasArabic && hasContent && (isKnownPartialVerseFinal || (hasStrongQuranicPatternFinal && hasQuranicVocabularyFinal));
  } else if (exerciseType === "thematic") {
    // For thematic exercises, check if the answer contains Quranic verses and relates to the theme
    const hasThematicQuranicPattern =
      /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل|غفران|عفو|مغفرة|رحمة|عفو|غفر|توبة|توب|استغفار)/.test(
        userAnswer,
      );

    console.log("=== THEMATIC VALIDATION DEBUG ===");
    console.log("User Answer:", userAnswer);
    console.log("Context:", context);
    console.log("Has Quranic Pattern:", hasThematicQuranicPattern);

    const contextWords = context
      ? context
          .toLowerCase()
          .split(/[,\s]+/)
          .filter((w) => w.trim().length > 2)
      : [];
    console.log("Context Words:", contextWords);

    const hasThemeKeywords = contextWords.some((keyword) => {
      const result = userAnswer.toLowerCase().includes(keyword);
      console.log(`Checking "${keyword}": ${result}`);
      return result;
    });

    console.log("Has Theme Keywords:", hasThemeKeywords);
    console.log("Has Arabic:", hasArabic);
    console.log("Has Content:", hasContent);
    console.log(
      "Will be correct:",
      hasArabic && hasContent && hasThematicQuranicPattern && hasThemeKeywords,
    );
    console.log("================================");

    // Consider it correct if it has Arabic content AND either Quranic patterns OR theme relevance
    isActuallyCorrect =
      hasArabic &&
      hasContent &&
      (hasThematicQuranicPattern || hasThemeKeywords);
  } else if (exerciseType === "completion") {
    // For completion exercises, any Arabic answer that makes sense is acceptable
    isActuallyCorrect = hasArabic && hasContent;
  }

  // For transformation exercises, ensure feedback matches the final validation result
  let finalFeedback = exerciseSpecificFeedback;
  if (exerciseType === "transformation") {
    if (isActuallyCorrect) {
      finalFeedback =
        "Excellent! You provided a Quranic verse that relates well to the wisdom sentence.";
    } else {
      // Check if it looks like a Quranic verse
      const hasQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|قل|ولا|لا تحزن|ولقد|يا أيها)/.test(
          userAnswer,
        );

      if (hasQuranicPattern && hasArabic && hasContent) {
        // It looks like a Quranic verse but may not be semantically related
        finalFeedback =
          "You provided a Quranic verse, but it may not have a strong philosophical connection to the wisdom sentence. Try to find a verse with similar or opposite meaning.";
      } else if (hasArabic && hasContent) {
        // It's Arabic but doesn't look Quranic
        finalFeedback =
          "You provided Arabic text, but it should be an authentic Quranic verse. Try to recall a verse from the Quran that shares a similar wisdom or teaching.";
      } else {
        // Not Arabic or too short
        finalFeedback =
          "Incorrect! For this exercise, please provide a Quranic verse (full or partial) that has a philosophical meaning similar to or opposite to the given wisdom sentence.";
      }
    }
  }

  // Determine final feedback message
  let completeFeedback = finalFeedback;
  if (!isActuallyCorrect && !hasArabic) {
    // Only add "Please provide an answer in Arabic" if there's NO Arabic at all
    completeFeedback = `Please provide an answer in Arabic. ${finalFeedback}`;
  } else if (!isActuallyCorrect) {
    // If there IS Arabic but it's wrong, use the specific feedback directly
    completeFeedback = finalFeedback;
  }

  return {
    isCorrect: isActuallyCorrect,
    grade: isActuallyCorrect ? 'exact_match' : 'incorrect',
    score: isActuallyCorrect ? 60 : 20,
    feedback: completeFeedback,
    suggestions,
    suggestedAnswer: !isActuallyCorrect ? suggestedAnswer : undefined,
    connectionExplanation: undefined,
    confidence: 0.3,
  };
}

// Additional helper function for exercise-specific validation
export async function validateExerciseAnswer(
  userAnswer: string,
  exerciseType: string,
  phraseData: any,
  userLanguage: string = "en",
  providedSuggestedVerse?: string,
): Promise<AIValidationResult> {
  // استخراج الإجابة المتوقعة - الأولوية للآية المرسلة مباشرة من Frontend
  const suggestedVerse = providedSuggestedVerse || phraseData?.suggestedVerse || phraseData?.arabicText || phraseData?.expectedAnswer || "";
  const questionContext = phraseData?.question || phraseData?.arabicText || "";
  
  console.log("=== DIRECT ARABIC COMPARISON ===");
  console.log("User Answer:", userAnswer);
  console.log("Suggested Verse:", suggestedVerse);
  console.log("Question Context:", questionContext);
  
  // === الحماية السياقية: منع آيات الخلق للمنتجات البشرية ===
  const isProductQuestion = containsProductKeywords(questionContext);
  const userAnswerHasDivineCreation = containsDivineCreationPatterns(userAnswer);
  const suggestedHasDivineCreation = containsDivineCreationPatterns(suggestedVerse);
  
  console.log("=== CONTEXTUAL GUARD ===");
  console.log("Is Product Question:", isProductQuestion);
  console.log("User Answer Has Divine Creation:", userAnswerHasDivineCreation);
  console.log("Suggested Has Divine Creation:", suggestedHasDivineCreation);
  
  // === المنهج المقاصدي: تحديد فئة الموقف واختيار الآيات المناسبة ===
  const situationCategory = detectSituationCategory(questionContext);
  console.log("=== MAQASIDI APPROACH ===");
  console.log("Detected Situation Category:", situationCategory);
  
  // التحقق من ملاءمة إجابة المستخدم للموقف
  if (situationCategory && !isVerseContextuallyAppropriate(userAnswer, questionContext)) {
    const contextualVerses = getContextualVerses(situationCategory);
    const suggestedContextualVerse = contextualVerses.length > 0 ? contextualVerses[0] : undefined;
    
    console.log("BLOCKED: User answer not contextually appropriate for situation!");
    console.log("Suggested contextual verses:", contextualVerses);
    
    return {
      isCorrect: false,
      grade: 'valid_but_less_suitable' as ValidationGrade,
      score: 40,
      feedback: "🟡 آية صحيحة، لكنها ليست الأنسب لهذا الموقف. استخدم آيات تعبر عن الحالة الشعورية للموقف من لسان الأنبياء أو البشر.",
      suggestions: [
        "اختر آية تناسب السياق العاطفي للموقف",
        "استخدم آيات من أقوال الأنبياء والبشر في القرآن",
        situationCategory === 'facilitation' ? "للتيسير: استخدم آيات مثل (يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ)" : "",
        situationCategory === 'consolation' ? "للمواساة: استخدم آيات مثل (فَصَبْرٌ جَمِيلٌ)" : "",
        situationCategory === 'loss_compensation' ? "للخسارة: استخدم آيات مثل (عَسَىٰ أَن يُبْدِلَنَا خَيْرًا)" : ""
      ].filter(s => s),
      suggestedAnswer: suggestedContextualVerse,
      connectionExplanation: undefined,
      confidence: 1.0,
      isAuthenticVerse: true,
      suitabilityScore: 40,
    };
  }
  
  // إذا كان السؤال عن منتج بشري وكانت الإجابة آية خلق إلهي → رفض
  if (isProductQuestion && userAnswerHasDivineCreation) {
    console.log("BLOCKED: Divine creation verse used for human product question!");
    return {
      isCorrect: false,
      grade: 'incorrect' as ValidationGrade,
      score: 0,
      feedback: "🔴 لا يجوز استخدام آيات الخلق والإعجاز الإلهي للإجابة على أسئلة حول المنتجات البشرية. استخدم آيات تتعلق بالأفعال البشرية (سلوك، كلام، أخلاق، سعي).",
      suggestions: [
        "استخدم آيات عن السلوك البشري أو الأخلاق",
        "تجنب آيات الخلق الإلهي للأشياء المادية/التقنية",
        "ابحث عن آيات تناسب السياق البشري"
      ],
      suggestedAnswer: "لَا تُسْرِفُوا",
      connectionExplanation: undefined,
      confidence: 1.0,
      isAuthenticVerse: true,
      suitabilityScore: 0,
    };
  }
  
  // التحقق المباشر من مطابقة النص العربي مع تجاهل التشكيل
  if (suggestedVerse && compareArabicText(userAnswer, suggestedVerse)) {
    // إذا كانت الآية المقترحة نفسها عن الخلق الإلهي لمنتج بشري → تحذير
    if (isProductQuestion && suggestedHasDivineCreation) {
      console.log("WARNING: Suggested verse itself is inappropriate for product question!");
      return {
        isCorrect: false,
        grade: 'incorrect' as ValidationGrade,
        score: 0,
        feedback: "هذا السؤال يحتاج إلى مراجعة. الآية المقترحة غير مناسبة للسياق.",
        suggestions: ["هذا التمرين يحتاج تحديث الآية المقترحة"],
        suggestedAnswer: undefined,
        connectionExplanation: undefined,
        confidence: 1.0,
      };
    }
    
    console.log("Direct Arabic match found! Answer is CORRECT.");
    return {
      isCorrect: true,
      grade: 'exact_match' as ValidationGrade,
      score: 100,
      feedback: "✅ ممتاز! إجابتك صحيحة ومطابقة.",
      suggestions: [],
      suggestedAnswer: undefined,
      connectionExplanation: undefined,
      confidence: 1.0,
      isAuthenticVerse: true,
      suitabilityScore: 100,
    };
  }
  
  // For conversation exercises, use Arabic question as context (not English)
  // For other exercises, use Arabic text as context
  let context = "";
  let expectedAnswer = "";

  if (exerciseType === "conversation") {
    // استخدام السؤال العربي كسياق بدلاً من الترجمة الإنجليزية
    context = phraseData?.question || phraseData?.arabicText || "";
    expectedAnswer = suggestedVerse;
  } else if (exerciseType === "thematic") {
    // For thematic exercises, use the theme and description as context
    context =
      `${phraseData?.theme || ""} ${phraseData?.themeEnglish || ""} ${phraseData?.description || ""} ${phraseData?.tags?.join(" ") || ""}`.trim();
    expectedAnswer = suggestedVerse;
  } else {
    context = phraseData?.arabicText || phraseData?.question || "";
    expectedAnswer = suggestedVerse;
  }

  return validateArabicAnswer(
    userAnswer,
    exerciseType,
    context,
    expectedAnswer,
    userLanguage,
  );
}

// Function to generate new Quranic phrases when user has exhausted all available ones
export async function generateNewQuranicPhrase(
  exerciseType: string,
  category: string = "short",
  difficulty: number = 1,
): Promise<GeneratedExercise> {
  try {
    console.log("=== GENERATING NEW QURANIC PHRASE ===");
    console.log("Exercise Type:", exerciseType);
    console.log("Category:", category);
    console.log("Difficulty:", difficulty);

    const prompt = `You are an Applied Arabic Linguistics Teacher. Generate a Quranic phrase that can be used as a natural response in daily Arabic conversations.

Exercise Type: ${exerciseType}
Category: ${category} (short, long, commands, or proverbs)
Difficulty: ${difficulty} (1-5 scale)

THE TRIGGER-RESPONSE RULE:
Pick a REAL Quranic verse or phrase that native Arabic speakers actually quote in daily life.
It must be short enough to use in conversation (2-8 words preferred).
It must have clear, practical keywords that map to everyday situations.

Examples of good phrases:
- "إن مع العسر يسرا" → quoted when someone faces hardship (keyword: hardship → ease)
- "والله يحب المحسنين" → quoted to encourage good deeds (keyword: doers of good)
- "لا تقنطوا من رحمة الله" → quoted to comfort someone in despair (keyword: despair → mercy)

Provide:
1. Arabic Text (with proper diacritics/tashkeel)
2. English Translation
3. Surah and Ayah reference (e.g., البقرة:2)
4. Life Application — describe the specific daily situation (TRIGGER) where this phrase is the natural RESPONSE

Respond ONLY with a JSON object in this exact format:
{
  "arabicText": "the Arabic text with diacritics",
  "englishTranslation": "the English translation",
  "surahAyah": "السورة:رقم الآية",
  "lifeApplication": "the specific daily situation where a native speaker would quote this phrase"
}`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7, // Higher temperature for more variety
        maxOutputTokens: 500,
        topP: 0.9,
        topK: 40,
      },
    });

    console.log("AI Response Status:", response.status);

    const candidate = response.data.candidates[0];
    if (!candidate.content?.parts?.[0]?.text) {
      throw new Error("No valid content in AI response");
    }

    const responseText = candidate.content.parts[0].text.trim();
    console.log("AI Generated Response:", responseText);

    // Extract JSON from the response (might be wrapped in markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }

    const generatedData = JSON.parse(jsonMatch[0]);

    return {
      arabicText: generatedData.arabicText,
      englishTranslation: generatedData.englishTranslation,
      surahAyah: generatedData.surahAyah,
      lifeApplication: generatedData.lifeApplication,
      category: category,
      difficulty: difficulty,
      isAIGenerated: true,
    };
  } catch (error) {
    console.error("Error generating new phrase:", error);
    
    // Fallback: return a default phrase if AI fails
    return {
      arabicText: "إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرٗا",
      englishTranslation: "Indeed, with hardship comes ease",
      surahAyah: "الشرح:6",
      lifeApplication: "التفاؤل في الشدائد",
      category: category,
      difficulty: difficulty,
      isAIGenerated: true,
    };
  }
}

// Language code mapping
const languageNames: Record<string, string> = {
  en: "English",
  id: "Indonesian (Bahasa Indonesia)",
  tr: "Turkish (Türkçe)",
  ar: "Arabic (العربية)",
  zh: "Chinese (中文)",
  sw: "Swahili (Kiswahili)",
  so: "Somali (Soomaali)",
  bs: "Bosnian (Bosanski)",
  sq: "Albanian (Shqip)",
};

/**
 * Translate a philosophical sentence to a target language using Gemini AI
 * @param arabicText - The original Arabic wisdom sentence
 * @param targetLanguage - Target language code (en, id, tr, zh, sw, so, bs, sq)
 * @returns Translated text
 */
async function translateWithRetry(
  prompt: string,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  maxOutputTokens: number = 150
): Promise<any> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens,
          topP: 0.95,
          topK: 40,
        },
      });
      
      return response;
    } catch (error) {
      const isRateLimitError = axios.isAxiosError(error) && 
        (error.response?.status === 429 || 
         error.response?.data?.error?.status === 'RESOURCE_EXHAUSTED');
      
      const isQuotaExhausted = axios.isAxiosError(error) &&
        error.response?.data?.error?.message?.includes('Quota exceeded');
      
      if (isQuotaExhausted) {
        console.log(`API quota exhausted. Cannot retry - daily limit reached.`);
        throw error;
      }
      
      if (isRateLimitError && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
}

export async function translatePhilosophicalSentence(
  arabicText: string,
  targetLanguage: string,
): Promise<string> {
  try {
    console.log(`=== TRANSLATING PHILOSOPHICAL SENTENCE TO ${targetLanguage.toUpperCase()} ===`);
    console.log("Arabic Text:", arabicText);

    const languageName = languageNames[targetLanguage] || targetLanguage;

    // Simplified, concise prompt to reduce token usage
    const prompt = `Translate this Arabic wisdom to ${languageName}. Be concise and natural:

${arabicText}

Translation:`;

    console.log("Translation Prompt:", prompt.substring(0, 200) + "...");

    const response = await translateWithRetry(prompt, 3, 1000);

    console.log("Gemini Translation Response Status:", response.status);
    console.log("Gemini Translation Response Data:", JSON.stringify(response.data, null, 2));

    const candidate = response.data.candidates[0];
    if (!candidate.content?.parts?.[0]?.text) {
      console.error("No valid translation from AI - candidate structure:", JSON.stringify(candidate, null, 2));
      throw new Error("No valid translation from AI");
    }

    const translation = candidate.content.parts[0].text.trim();
    console.log("Translation Result:", translation);

    return translation;
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response?.data);
      console.error("Axios error status:", error.response?.status);
    }
    // Re-throw the error instead of returning Arabic text
    // This prevents storing Arabic text in translation fields
    throw new Error(`Failed to translate to ${targetLanguage}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Daily Contextual Exercise - Generate explanation for why an expression fits a daily sentence
export async function generateDailyContextualExplanation(
  dailySentence: string,
  correctExpression: string,
  surahAyah: string,
  userLanguage: string = "en",
): Promise<Record<string, string>> {
  try {
    console.log("=== GENERATING DAILY CONTEXTUAL EXPLANATION ===");
    console.log("Daily Sentence:", dailySentence);
    console.log("Correct Expression:", correctExpression);
    console.log("Surah/Ayah:", surahAyah);
    console.log("User Language:", userLanguage);

    const languageName = languageNames[userLanguage] || "English";

    const prompt = `Explain in ${languageName} (2-4 sentences) why the Quranic expression "${correctExpression}" from ${surahAyah} is the most fitting for this daily situation:

Daily Situation: ${dailySentence}

Your explanation should:
1. Explain the semantic connection
2. Mention the Quranic context briefly
3. Explain when to use this expression in daily life

Explanation:`;

    const response = await translateWithRetry(prompt, 3, 1000);

    const candidate = response.data.candidates[0];
    if (!candidate.content?.parts?.[0]?.text) {
      throw new Error("No valid explanation from AI");
    }

    const explanation = candidate.content.parts[0].text.trim();

    // Return explanation in the requested language
    return {
      [userLanguage]: explanation
    };
  } catch (error) {
    console.error("Error generating explanation:", error);
    // Return a fallback explanation
    return {
      [userLanguage]: `The Quranic expression "${correctExpression}" from ${surahAyah} is appropriate for this context.`
    };
  }
}

// Generate linguistic note for daily contextual exercise
export async function generateMeaningBreakdown(
  arabicPhrase: string,
  userLanguage: string = "en",
): Promise<{ words: Array<{ arabic: string; transliteration: string; meaning: string }>; overallMeaning: string }> {
  try {
    const languageName = languageNames[userLanguage] || "English";

    const prompt = `Analyze this Quranic Arabic phrase and provide a vocabulary breakdown in ${languageName}.

Arabic Phrase: "${arabicPhrase}"

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "words": [
    { "arabic": "word1", "transliteration": "word1 transliterated", "meaning": "meaning in ${languageName}" },
    { "arabic": "word2", "transliteration": "word2 transliterated", "meaning": "meaning in ${languageName}" }
  ],
  "overallMeaning": "Complete meaning of the phrase in ${languageName} (1-2 sentences)"
}

Rules:
- Break down each meaningful word (skip common particles like و unless significant)
- Include root meanings where helpful
- Keep meanings concise but clear
- Transliteration should be simple Latin characters`;

    const response = await translateWithRetry(prompt, 3, 1000);

    const candidate = response.data.candidates[0];
    if (!candidate.content?.parts?.[0]?.text) {
      throw new Error("No valid breakdown from AI");
    }

    const text = candidate.content.parts[0].text.trim();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      words: parsed.words || [],
      overallMeaning: parsed.overallMeaning || "",
    };
  } catch (error) {
    console.error("Error generating meaning breakdown:", error);
    return {
      words: [],
      overallMeaning: arabicPhrase,
    };
  }
}

export async function validateScenarioVerseMatch(
  scenarioText: string,
  verseText: string,
  type: 'conversation' | 'roleplay' = 'conversation'
): Promise<{
  isMatch: boolean;
  confidence: number;
  reason: string;
  correctedScenario?: string;
  correctedVerse?: string;
}> {
  try {
    const prompt = `You are an Applied Arabic Linguistics Teacher validating a Trigger-Response exercise pair.

THE TRIGGER-RESPONSE TEST:
A valid exercise means: the Scenario (TRIGGER) contains keyword-synonyms that directly map to the Verse's (RESPONSE) keywords, AND a native Arabic speaker would naturally quote this verse in this situation.

RULE 1 — KEYWORD MAPPING: The scenario must contain synonyms of the verse's core keywords.
  ✅ "Someone doing good deeds secretly" + "والله يحب المحسنين" → "doing good" maps to "المحسنين"
  ❌ "Heaven's hidden rewards" + "لقد لقينا من سفرنا هذا نصبا" → NO keyword mapping

RULE 2 — NATIVE SPEAKER TEST: Would a native Arabic speaker naturally quote this verse in this situation?
RULE 3 — SPECIFICITY: The scenario must make THIS verse (not just any verse) the obvious answer.
RULE 4 — NO ABSTRACT CONNECTIONS: The link must be linguistic and immediate, not theological.

TYPE: ${type === 'conversation' ? 'Conversation Exercise' : 'Roleplay Scenario'}

SCENARIO: "${scenarioText}"
VERSE: "${verseText}"

Evaluate using the 4 rules above and return ONLY valid JSON:
{
  "isMatch": true/false,
  "confidence": 0-100,
  "reason": "Which rules pass/fail and why",
  "correctedScenario": "If mismatch: rewrite scenario so its keywords map directly to the verse. If match: omit.",
  "correctedVerse": "If verse is too generic: suggest a better authentic Quranic verse. If match: omit."
}

SCORING:
- confidence >= 70 = MATCH (keywords map + native speaker would quote it)
- confidence 40-69 = WEAK (theme related but keywords don't map directly)
- confidence < 40 = MISMATCH (abstract connection or no keyword mapping)`;

    const response = await translateWithRetry(prompt, 4, 5000, 500);
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!text) {
      return { isMatch: false, confidence: 0, reason: "AI returned no response" };
    }
    
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    return {
      isMatch: result.isMatch ?? (result.confidence >= 70),
      confidence: result.confidence ?? 0,
      reason: result.reason ?? "Unknown",
      correctedScenario: result.correctedScenario,
      correctedVerse: result.correctedVerse,
    };
  } catch (error) {
    console.error("Error validating scenario-verse match:", error);
    return { isMatch: false, confidence: 0, reason: "Validation failed due to error" };
  }
}

export async function generateLinguisticNote(
  expression: string,
  surahAyah: string,
  userLanguage: string = "en",
): Promise<Record<string, string>> {
  try {
    console.log("=== GENERATING LINGUISTIC NOTE ===");
    console.log("Expression:", expression);
    console.log("Surah/Ayah:", surahAyah);

    const languageName = languageNames[userLanguage] || "English";

    const prompt = `Provide a brief linguistic note in ${languageName} (3-5 sentences) about this Quranic expression:

Expression: ${expression}
Source: ${surahAyah}

Include:
1. Grammar structure
2. Key vocabulary
3. Usage context

Note:`;

    const response = await translateWithRetry(prompt, 3, 1000);

    const candidate = response.data.candidates[0];
    if (!candidate.content?.parts?.[0]?.text) {
      throw new Error("No valid linguistic note from AI");
    }

    const note = candidate.content.parts[0].text.trim();

    return {
      [userLanguage]: note
    };
  } catch (error) {
    console.error("Error generating linguistic note:", error);
    return {
      [userLanguage]: `This expression appears in ${surahAyah} and is commonly used in Arabic communication.`
    };
  }
}
