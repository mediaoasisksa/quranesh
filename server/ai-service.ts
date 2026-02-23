import axios from "axios";
import type { Phrase } from "@shared/schema";
import { isNonQuranicPhrase } from "./quran-validator";

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
  const stripped = userAnswer.replace(/[\u064B-\u065F\u0670\s]/g, "").trim();
  if (stripped.length < 3 || ["ال", "و", "ف", "ب", "ك", "ل", "لل", "بال", "وال", "فال", "كال"].includes(stripped)) {
    return {
      isCorrect: false,
      grade: 'incorrect' as ValidationGrade,
      score: 0,
      feedback: "الإجابة قصيرة جداً. اكتب كلمة أو عبارة قرآنية كاملة.",
      suggestions: ["اكتب آية أو عبارة قرآنية كاملة"],
      suggestedAnswer: undefined,
      connectionExplanation: undefined,
      confidence: 1.0,
    };
  }

  if (isNonQuranicPhrase(userAnswer)) {
    return {
      isCorrect: false,
      grade: 'incorrect' as ValidationGrade,
      score: 0,
      feedback: "هذه عبارة إسلامية شائعة لكنها ليست نصاً قرآنياً حرفياً. اكتب آية أو عبارة من القرآن الكريم مع ذكر اسم السورة.",
      suggestions: ["اكتب نصاً قرآنياً حرفياً موجوداً في المصحف"],
      suggestedAnswer: undefined,
      connectionExplanation: undefined,
      confidence: 1.0,
    };
  }

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
      specificInstructions = `This is a CONVERSATION exercise using the REVERSE-ENGINEERED TRIGGER-RESPONSE framework.
The scenario (TRIGGER) was written AROUND a specific verse using LOCK WORDS (كلمات القفل) — paraphrases of ≥2 of the verse's unique keywords. The student must recall the Quranic phrase (RESPONSE) from those Lock Words.

EVALUATION — THE LOCK WORDS + SEMANTIC HINTING TEST:
1. Does the student's answer contain KEYWORDS that match the LOCK WORDS embedded in the scenario?
   - Scenario has lock words "patience + without complaint (beautiful)" → answer should contain "فَصَبْرٌ جَمِيلٌ"
   - Scenario has lock words "ease + hardship + paired with" → answer should contain "مَعَ الْعُسْرِ يُسْرًا"
   - Scenario has lock words "love + doers of good" → answer should contain "المحسنين"
2. Does the answer contain ≥2 keywords that map to the scenario's Lock Words?
3. Would a native Arabic speaker naturally quote this phrase in this situation?
4. Is this an authentic Quranic verse or widely-used Islamic expression?
5. Is the connection OBVIOUS and LINGUISTIC — not requiring deep Tafsir?
6. SYNONYM CHECK: If the scenario uses a common word (e.g., جبال) but the answer uses a Quranic synonym (e.g., رواسي), verify the semantic trait matches.

ACCEPT if the answer's keywords map to ≥2 of the scenario's Lock Words, even if not the exact expected verse.
REJECT if:
❌ The answer requires deep theological interpretation to connect to the scenario
❌ The answer is from a Quranic story/narrative that isn't quoted in daily speech
❌ The answer's keywords have NO direct mapping to the scenario's Lock Words
❌ The connection is abstract/philosophical rather than linguistic
❌ The answer uses a synonym where the scenario specified the exact semantic trait

IMPORTANT: If the scenario asks about a LINGUISTIC MEANING (e.g., "المتغطي بثوبه"), accept the Quranic word (المزمل) even without the full verse context. Single-word vocabulary answers ARE valid when the exercise teaches vocabulary.

EXAMPLES:
✅ Scenario lock words: "praise + thankfulness" → "الحمد لله" (حمد = praise, لله = to Allah)
✅ Scenario lock words: "trusting + sufficient" → "حسبنا الله ونعم الوكيل" (حسب = sufficient)
✅ Scenario: "المتغطي بثوبه" → "المزمل" (vocabulary exercise — single word answer is correct)
❌ Scenario about "making an appointment" → "الساعة آتية" (Day of Judgment, NOT appointments)
❌ Scenario about "phone addiction" → "اجعلني على خزائن الأرض" (requires deep interpretation — REJECTED)`;
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
      specificInstructions = `This is a ROLEPLAY exercise using the REVERSE-ENGINEERED TRIGGER-RESPONSE framework.
The scenario was written AROUND a specific verse, with LOCK WORDS (كلمات القفل) — ≥2 paraphrases of the verse's unique keywords. The student must recall and respond with the correct Quranic phrase.

EVALUATION — THE LOCK WORDS + SEMANTIC HINTING TEST:
1. Does the student's answer contain KEYWORDS that match the LOCK WORDS embedded in the scenario?
   - Scenario lock words: "patience + without complaint" → answer should contain "فَصَبْرٌ جَمِيلٌ"
   - Scenario lock words: "despairing + mercy" → answer should contain "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"
2. Does the answer contain ≥2 keywords that map to the scenario's Lock Words?
3. Would a native Arabic speaker naturally quote this in the described situation?
4. Is it authentic Quranic text?
5. Is the connection OBVIOUS and LINGUISTIC — not requiring deep Tafsir or abstract interpretation?
6. SYNONYM CHECK: If the scenario uses a semantic trait (e.g., "anchoring/stabilizing") instead of a common word, does the answer match via the Quranic word (e.g., رواسي)?

ACCEPT if ≥2 keywords map to the Lock Words and a native speaker would naturally say it.
REJECT if:
❌ The connection requires deep theological interpretation (No Abstraction rule)
❌ The verse is from a specific Quranic narrative not quoted in daily speech
❌ <2 keyword mappings exist between scenario's Lock Words and the answer
❌ The connection is abstract/philosophical rather than linguistic`;
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
  const strippedForLength = userAnswer.replace(/[\u064B-\u065F\u0670\s]/g, "").trim();
  const hasContent = strippedForLength.length >= 3 && !["ال", "و", "ف", "ب", "ك", "ل", "لل", "بال", "وال", "فال", "كال"].includes(strippedForLength);

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
  // === حماية ضد الإجابات القصيرة جداً أو البادئات العامة ===
  const strippedAnswer = userAnswer.replace(/[\u064B-\u065F\u0670\s]/g, "").trim();
  const COMMON_PREFIXES = ["ال", "و", "ف", "ب", "ك", "ل", "لل", "بال", "وال", "فال", "كال"];
  
  if (strippedAnswer.length < 3 || COMMON_PREFIXES.includes(strippedAnswer)) {
    console.log("REJECTED: Input too short or common prefix only:", strippedAnswer);
    return {
      isCorrect: false,
      grade: 'incorrect' as ValidationGrade,
      score: 0,
      feedback: "الإجابة قصيرة جداً. اكتب كلمة أو عبارة قرآنية كاملة وليس مجرد حروف أو بادئات.",
      suggestions: [
        "اكتب آية أو عبارة قرآنية كاملة",
        "الحد الأدنى 3 أحرف ذات معنى",
      ],
      suggestedAnswer: undefined,
      connectionExplanation: undefined,
      confidence: 1.0,
    };
  }

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

VERSE-FIRST WORKFLOW:
1. SELECT a REAL Quranic verse or phrase FIRST that native Arabic speakers actually quote in daily life.
2. It must be short enough to use in conversation (2-8 words preferred).
3. EXTRACT its LOCK WORDS (كلمات القفل): ≥2 key Arabic keywords + their meanings + core concept.
4. CHECK: If any Lock Word is a synonym/metaphor for a common word (e.g., رواسي ↔ جبال), note the SEMANTIC TRAIT (not the common word).
5. WRITE a life application scenario that contains ≥2 LOCK WORDS as paraphrases/definitions.
   The scenario must make the verse recallable — a student who memorized it can recall it from the scenario alone.

LOCK WORDS RULE (كلمات القفل):
The lifeApplication MUST contain paraphrases/definitions of ≥2 Lock Words from the verse.
A single keyword is NOT enough — it could match multiple verses.

SYNONYM/METAPHOR RULE:
If the verse uses a literary/Quranic word instead of a common word, the scenario must use the SEMANTIC TRAIT or exact Quranic word — NOT the common synonym.

NO ABSTRACTION RULE:
The connection between the scenario and the verse must be OBVIOUS and LINGUISTIC.
Do NOT use verses that require deep Tafsir to connect to the situation.

MEANING → QURANIC WORD RULE:
NEVER ask about surah names, surah numbers, or "which surah starts with X?"
Instead, teach the LINGUISTIC MEANING of the Quranic word, then ask the student to recall the word.
❌ WRONG: "ما السورة التي تبدأ بـ يا أيها المزمل؟"
✅ RIGHT: "ما الكلمة القرآنية التي تعني: المتغطي بثوبه/الملتف بلباسه؟"

Examples with Lock Words:
- "إن مع العسر يسرا" → Lock words: العسر (hardship) + يسرا (ease) + مع (with)
  → "When facing hardship, this verse reminds you that ease is paired WITH it"
- "والله يحب المحسنين" → Lock words: يحب (loves) + المحسنين (doers of good)
  → "When someone does good deeds, this verse affirms Allah's LOVE for the DOERS OF GOOD"
- "لا تقنطوا من رحمة الله" → Lock words: تقنطوا (despair) + رحمة (mercy)
  → "When someone DESPAIRS of forgiveness, this verse tells them not to DESPAIR of Allah's MERCY"

Provide:
1. Arabic Text (with proper diacritics/tashkeel)
2. English Translation
3. Surah and Ayah reference (e.g., البقرة:2)
4. Life Application — a scenario with ≥2 LOCK WORDS paraphrasing the verse's keywords

Respond ONLY with a JSON object in this exact format:
{
  "arabicText": "the Arabic text with diacritics",
  "englishTranslation": "the English translation",
  "surahAyah": "السورة:رقم الآية",
  "lifeApplication": "scenario with ≥2 lock words paraphrasing the verse's keywords"
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
    const prompt = `You are an Applied Arabic Linguistics Teacher validating a Reverse-Engineered Trigger-Response exercise pair.

THE VALIDATION TEST — 7 RULES:

RULE 1 — LOCK WORDS (كلمات القفل): Does the scenario contain paraphrases/definitions of ≥2 LOCK WORDS from the verse?
  ✅ Scenario has lock words "patience + without complaint (beautiful)" for verse "فَصَبْرٌ جَمِيلٌ" → PASS (2 lock words)
  ✅ Scenario has "ease + hardship + paired with" for verse "إِنَّ مَعَ الْعُسْرِ يُسْرًا" → PASS (3 lock words)
  ❌ Scenario says "something bad happened" for verse "فَصَبْرٌ جَمِيلٌ" → FAIL (0 lock words)
  ❌ Scenario says "patience" only for verse "فَصَبْرٌ جَمِيلٌ" → FAIL (only 1 lock word — too vague)

RULE 2 — SYNONYM/METAPHOR CHECK: If the verse uses a literary/Quranic word (e.g., رواسي) instead of a common word (e.g., جبال), the scenario must use the SEMANTIC TRAIT or exact Quranic word — NOT the common synonym.
  ❌ Scenario says "ذكر الجبال" but verse says "رواسي" → FAIL (synonym violation — must use "الرسوخ/الثبات" or "رواسي")
  ✅ Scenario says "تثبيت الأرض بالجبال الراسية" → PASS (uses semantic trait "الرسوخ/الثبات")
  ❌ Scenario says "wishing someone well" but verse says "رحمة الله وبركاته" → FAIL (too vague, no lock words)
  ✅ Scenario says "رحمة الله + بركاته + عليكم" → PASS (3 lock words, specific)

RULE 3 — NO ABSTRACTION: The link must be OBVIOUS and LINGUISTIC — no deep Tafsir needed.
  ❌ "Phone addiction" + "اجعلني على خزائن الأرض" → FAIL (requires deep interpretation)
  ✅ "Feeling exhausted after a journey" + "لَقَدْ لَقِينَا مِن سَفَرِنَا هَٰذَا نَصَبًا" → PASS (direct)

RULE 4 — NATIVE SPEAKER TEST: Would a native Arabic speaker naturally quote this verse in this situation?
RULE 5 — SPECIFICITY: The scenario must make THIS verse (not just any verse) the obvious answer.
RULE 6 — RECALL TEST: Can a student who memorized this verse recall it from the scenario alone?
RULE 7 — PRACTICAL DAILY USE: Is the verse short (2-8 words) and commonly quoted?
RULE 8 — MEANING → QURANIC WORD: Does the question teach linguistic meaning, NOT surah identification? (NEVER "which surah starts with X?" — instead "what Quranic word means X?")

TYPE: ${type === 'conversation' ? 'Conversation Exercise' : 'Roleplay Scenario'}

SCENARIO: "${scenarioText}"
VERSE: "${verseText}"

Evaluate using ALL 7 rules and return ONLY valid JSON:
{
  "isMatch": true/false,
  "confidence": 0-100,
  "lockWordsFound": ["list of Lock Words from the verse that appear as paraphrases in the scenario"],
  "lockWordsCount": number,
  "synonymViolation": "If scenario uses a common word where the verse uses a different word, explain. Otherwise null.",
  "reason": "Which rules pass/fail and why — especially check Lock Words count and Synonym violations",
  "correctedScenario": "If mismatch: rewrite scenario with ≥2 LOCK WORDS as paraphrases. If synonym violation: rewrite using semantic trait or exact Quranic word. If match: omit.",
  "correctedVerse": "If verse requires deep interpretation or is too generic: suggest a better authentic Quranic verse. If match: omit."
}

SCORING:
- confidence >= 70 = MATCH (≥2 lock words, no synonym violations, native speaker would quote it)
- confidence 40-69 = WEAK (theme related but <2 lock words, or has synonym violation)
- confidence < 40 = MISMATCH (abstract connection, requires Tafsir, 0 lock words, or major synonym violation)`;

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

import { ALLOWED_SURAHS, ALLOWED_SURAHS_EN, CONTENT_LOGIC_ROLE, TRIGGER_RESPONSE_RULES, EXERCISE_FORMAT, VALIDATION_CHECKLIST } from "./content-logic";

export interface VocabularyExercise {
  id: string;
  surahAr: string;
  surahEn: string;
  targetWord: string;
  targetWordMeaning: string;
  targetWordTranslations: Record<string, string>;
  correctVerseMeaningTranslations: Record<string, string>;
  surahAyah: string;
  ayahNumber: number;
  hint: string;
  correctVerse: string;
  correctVerseMeaning: string;
  options: { text: string; isCorrect: boolean }[];
}

const VOCAB_BANK: VocabularyExercise[] = [
  {
    id: "v1", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الصِّرَاطَ",
    targetWordMeaning: "The Path",
    targetWordTranslations: {
      en: "The Path", ar: "الطريق", id: "Jalan", tr: "Yol", zh: "道路",
      sw: "Njia", so: "Jidka", bs: "Put", sq: "Rruga", ru: "Путь",
      ur: "راستہ", bn: "পথ", ms: "Jalan"
    },
    correctVerseMeaningTranslations: {
      en: "Guide us to the straight path", ar: "اهدنا الطريق المستقيم",
      id: "Tunjukilah kami jalan yang lurus", tr: "Bizi doğru yola ilet",
      zh: "请引导我们走正道", sw: "Tuongoze njia iliyonyooka",
      so: "Nagu hanuuni jidka toosan", bs: "Uputi nas na pravi put",
      sq: "Udhëzona në rrugën e drejtë", ru: "Веди нас прямым путём",
      ur: "ہمیں سیدھا راستہ دکھا", bn: "আমাদের সরল পথ দেখাও",
      ms: "Tunjukilah kami jalan yang lurus"
    },
    surahAyah: "الفاتحة:6", ayahNumber: 6,
    hint: "الكلمة تبدأ بحرف الـ ص...",
    correctVerse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    correctVerseMeaning: "Guide us to the straight path",
    options: [
      { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", isCorrect: false },
      { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", isCorrect: true },
      { text: "مَالِكِ يَوْمِ الدِّينِ", isCorrect: false },
      { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", isCorrect: false },
    ],
  },
  {
    id: "v2", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "نَسْتَعِينُ",
    targetWordMeaning: "We seek help",
    targetWordTranslations: {
      en: "We seek help", ar: "نطلب المساعدة", id: "Kami memohon pertolongan",
      tr: "Yardım dileriz", zh: "我们求助", sw: "Tunaomba msaada",
      so: "Waxaan ka kaalmaysanaa", bs: "Tražimo pomoć", sq: "Kërkojmë ndihmë",
      ru: "Мы просим о помощи", ur: "ہم مدد چاہتے ہیں", bn: "আমরা সাহায্য চাই",
      ms: "Kami memohon pertolongan"
    },
    correctVerseMeaningTranslations: {
      en: "You alone we worship, and You alone we ask for help",
      ar: "إياك وحدك نعبد وإياك وحدك نستعين",
      id: "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan",
      tr: "Yalnız Sana ibadet ederiz ve yalnız Senden yardım dileriz",
      zh: "我们只崇拜你，我们只向你求助",
      sw: "Wewe peke yako tunakuabudu, na Wewe peke yako tunaomba msaada",
      so: "Adiga keliya ayaan caabudnaa, Adiga keliya ayaan kaalmada ka baryaa",
      bs: "Samo Tebe obožavamo i samo od Tebe pomoć tražimo",
      sq: "Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë",
      ru: "Тебе одному мы поклоняемся и Тебя одного молим о помощи",
      ur: "ہم صرف تیری عبادت کرتے ہیں اور صرف تجھ سے مدد مانگتے ہیں",
      bn: "আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই কাছে সাহায্য চাই",
      ms: "Hanya Engkau yang kami sembah dan hanya Engkau yang kami mohon pertolongan"
    },
    surahAyah: "الفاتحة:5", ayahNumber: 5,
    hint: "تعني نطلب المساعدة",
    correctVerse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    correctVerseMeaning: "You alone we worship, and You alone we ask for help",
    options: [
      { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", isCorrect: true },
      { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", isCorrect: false },
      { text: "الرَّحْمَنِ الرَّحِيمِ", isCorrect: false },
      { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", isCorrect: false },
    ],
  },
  {
    id: "v3", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الرَّحِيمِ",
    targetWordMeaning: "The Most Merciful",
    targetWordTranslations: {
      en: "The Most Merciful", ar: "الرحيم (كثير الرحمة)", id: "Maha Penyayang",
      tr: "En Merhametli", zh: "至慈的", sw: "Mwenye huruma zaidi",
      so: "Naxariista badan", bs: "Milostivi", sq: "Mëshiruesi",
      ru: "Милосердный", ur: "نہایت رحم کرنے والا", bn: "পরম দয়ালু",
      ms: "Maha Penyayang"
    },
    correctVerseMeaningTranslations: {
      en: "The Most Gracious, the Most Merciful", ar: "الرحمن الرحيم",
      id: "Maha Pengasih, Maha Penyayang", tr: "Rahman, Rahim",
      zh: "至仁的，至慈的", sw: "Mwingi wa rehema, Mwenye kurehemu",
      so: "Naxariista badan, Nebiga naxariista ah",
      bs: "Milostivog, Samilosnog", sq: "I Gjithëmëshirshmi, Mëshiruesi",
      ru: "Милостивого, Милосердного", ur: "بے حد رحم کرنے والا، نہایت مہربان",
      bn: "পরম করুণাময়, অতি দয়ালু", ms: "Yang Maha Pemurah, Maha Penyayang"
    },
    surahAyah: "الفاتحة:3", ayahNumber: 3,
    hint: "صفة من صفات الله تتعلق بالرحمة",
    correctVerse: "الرَّحْمَنِ الرَّحِيمِ",
    correctVerseMeaning: "The Most Gracious, the Most Merciful",
    options: [
      { text: "مَالِكِ يَوْمِ الدِّينِ", isCorrect: false },
      { text: "الرَّحْمَنِ الرَّحِيمِ", isCorrect: true },
      { text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", isCorrect: false },
      { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", isCorrect: false },
    ],
  },
  {
    id: "v4", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "نَعْبُدُ",
    targetWordMeaning: "We worship",
    targetWordTranslations: {
      en: "We worship", ar: "نعبد (نُطيع ونُخلص)", id: "Kami menyembah",
      tr: "İbadet ederiz", zh: "我们崇拜", sw: "Tunaabudu",
      so: "Waan caabudnaa", bs: "Obožavamo", sq: "Adhurojmë",
      ru: "Мы поклоняемся", ur: "ہم عبادت کرتے ہیں", bn: "আমরা ইবাদত করি",
      ms: "Kami menyembah"
    },
    correctVerseMeaningTranslations: {
      en: "You alone we worship, and You alone we ask for help",
      ar: "إياك وحدك نعبد وإياك وحدك نستعين",
      id: "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan",
      tr: "Yalnız Sana ibadet ederiz ve yalnız Senden yardım dileriz",
      zh: "我们只崇拜你，我们只向你求助",
      sw: "Wewe peke yako tunakuabudu, na Wewe peke yako tunaomba msaada",
      so: "Adiga keliya ayaan caabudnaa, Adiga keliya ayaan kaalmada ka baryaa",
      bs: "Samo Tebe obožavamo i samo od Tebe pomoć tražimo",
      sq: "Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë",
      ru: "Тебе одному мы поклоняемся и Тебя одного молим о помощи",
      ur: "ہم صرف تیری عبادت کرتے ہیں اور صرف تجھ سے مدد مانگتے ہیں",
      bn: "আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই কাছে সাহায্য চাই",
      ms: "Hanya Engkau yang kami sembah dan hanya Engkau yang kami mohon pertolongan"
    },
    surahAyah: "الفاتحة:5", ayahNumber: 5,
    hint: "تعني الطاعة والعبادة",
    correctVerse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    correctVerseMeaning: "You alone we worship, and You alone we ask for help",
    options: [
      { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", isCorrect: false },
      { text: "مَالِكِ يَوْمِ الدِّينِ", isCorrect: false },
      { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", isCorrect: true },
      { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", isCorrect: false },
    ],
  },
  {
    id: "v5", surahAr: "الإخلاص", surahEn: "Al-Ikhlas",
    targetWord: "أَحَدٌ",
    targetWordMeaning: "One / Unique",
    targetWordTranslations: {
      en: "One / Unique", ar: "واحد / أحد", id: "Satu / Yang Maha Esa",
      tr: "Bir / Tek", zh: "独一的", sw: "Mmoja / Pekee",
      so: "Hal / Gaar ah", bs: "Jedan / Jedini", sq: "Një / I vetëm",
      ru: "Единый", ur: "ایک / یکتا", bn: "এক / অদ্বিতীয়",
      ms: "Satu / Yang Maha Esa"
    },
    correctVerseMeaningTranslations: {
      en: "Say: He is Allah, the One", ar: "قل هو الله الواحد الأحد",
      id: "Katakanlah: Dia-lah Allah, Yang Maha Esa",
      tr: "De ki: O, Allah'tır, bir tektir",
      zh: "你说：他是真主，是独一的",
      sw: "Sema: Yeye ni Mwenyezi Mungu, Mmoja",
      so: "Dheh: Isagu waa Allaah, Kii Keliya",
      bs: "Reci: On je Allah, Jedan", sq: "Thuaj: Ai është Allahu, Një i vetëm",
      ru: "Скажи: Он — Аллах, Единый",
      ur: "کہو: وہ اللہ ہے، یکتا", bn: "বলো: তিনি আল্লাহ, এক",
      ms: "Katakanlah: Dia-lah Allah, Yang Maha Esa"
    },
    surahAyah: "الإخلاص:1", ayahNumber: 1,
    hint: "تعني الرقم 1 أو الوحيد",
    correctVerse: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    correctVerseMeaning: "Say: He is Allah, the One",
    options: [
      { text: "اللَّهُ الصَّمَدُ", isCorrect: false },
      { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", isCorrect: true },
      { text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", isCorrect: false },
      { text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", isCorrect: false },
    ],
  },
  {
    id: "v6", surahAr: "الإخلاص", surahEn: "Al-Ikhlas",
    targetWord: "الصَّمَدُ",
    targetWordMeaning: "The Eternal Refuge / The Self-Sufficient",
    targetWordTranslations: {
      en: "The Eternal Refuge", ar: "الذي يُقصد في الحوائج", id: "Tempat bergantung",
      tr: "Samed (Kendisine muhtaç olunan)", zh: "永恒的依靠",
      sw: "Mkimbilio wa milele", so: "Kan loo baahdo",
      bs: "Utočište vječno", sq: "Mbështetja e përjetshme",
      ru: "Вечная опора", ur: "بے نیاز", bn: "চিরন্তন আশ্রয়",
      ms: "Tempat bergantung"
    },
    correctVerseMeaningTranslations: {
      en: "Allah, the Eternal Refuge", ar: "الله الصمد الذي يحتاجه كل شيء",
      id: "Allah, tempat bergantung",
      tr: "Allah, Samed'dir (her şeyin kendisine muhtaç olduğu)",
      zh: "真主是永恒的依靠",
      sw: "Mwenyezi Mungu, Mkimbilio wa milele",
      so: "Allaah, Kan loo baahdo",
      bs: "Allah je utočište vječno", sq: "Allahu është Mbështetja e përjetshme",
      ru: "Аллах — Вечная опора", ur: "اللہ بے نیاز ہے",
      bn: "আল্লাহ, চিরন্তন আশ্রয়", ms: "Allah, tempat bergantung"
    },
    surahAyah: "الإخلاص:2", ayahNumber: 2,
    hint: "الذي يحتاجه كل شيء ولا يحتاج أحداً",
    correctVerse: "اللَّهُ الصَّمَدُ",
    correctVerseMeaning: "Allah, the Eternal Refuge",
    options: [
      { text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", isCorrect: false },
      { text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", isCorrect: false },
      { text: "اللَّهُ الصَّمَدُ", isCorrect: true },
      { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", isCorrect: false },
    ],
  },
  {
    id: "v7", surahAr: "الناس", surahEn: "An-Nas",
    targetWord: "الْوَسْوَاسِ",
    targetWordMeaning: "The Whisperer",
    targetWordTranslations: {
      en: "The Whisperer", ar: "الموسوس (الشيطان)", id: "Pembisik",
      tr: "Vesveseci", zh: "唆使者", sw: "Mnong'onezaji",
      so: "Waswaasiga", bs: "Šaptač", sq: "Pëshpëritësi",
      ru: "Наущающий", ur: "وسوسہ ڈالنے والا", bn: "কুমন্ত্রণাদাতা",
      ms: "Pembisik"
    },
    correctVerseMeaningTranslations: {
      en: "From the evil of the retreating whisperer",
      ar: "من شر الوسواس الذي يختفي عند ذكر الله",
      id: "Dari kejahatan bisikan setan yang bersembunyi",
      tr: "Sinsi vesvesecinin şerrinden",
      zh: "免遭暗中唆使者的伤害",
      sw: "Kutokana na shari ya mnong'onezaji anayejificha",
      so: "Sharriga waswaasiga dhuunta",
      bs: "Od zla šaptača koji se povlači",
      sq: "Nga e keqja e pëshpëritësit që tërhiqet",
      ru: "От зла наущающего отступающего",
      ur: "پیچھے ہٹ جانے والے وسوسہ ڈالنے والے کے شر سے",
      bn: "আত্মগোপনকারী কুমন্ত্রণাদাতার অনিষ্ট থেকে",
      ms: "Dari kejahatan pembisik yang bersembunyi"
    },
    surahAyah: "الناس:4", ayahNumber: 4,
    hint: "الصوت الخفي الذي يدعو للشر",
    correctVerse: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    correctVerseMeaning: "From the evil of the retreating whisperer",
    options: [
      { text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", isCorrect: false },
      { text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", isCorrect: true },
      { text: "مَلِكِ النَّاسِ", isCorrect: false },
      { text: "إِلَهِ النَّاسِ", isCorrect: false },
    ],
  },
  {
    id: "v8", surahAr: "الفلق", surahEn: "Al-Falaq",
    targetWord: "الْفَلَقِ",
    targetWordMeaning: "The Daybreak / The Dawn",
    targetWordTranslations: {
      en: "The Daybreak", ar: "الفجر (انشقاق الصبح)", id: "Waktu subuh",
      tr: "Tan yerinin ağarması", zh: "黎明", sw: "Alfajiri",
      so: "Waaberi", bs: "Zora", sq: "Agimi", ru: "Рассвет",
      ur: "صبح کا وقت", bn: "ভোর", ms: "Waktu subuh"
    },
    correctVerseMeaningTranslations: {
      en: "Say: I seek refuge in the Lord of daybreak",
      ar: "قل أعوذ برب الفجر",
      id: "Katakanlah: Aku berlindung kepada Tuhan waktu subuh",
      tr: "De ki: Tan yerinin Rabbine sığınırım",
      zh: "你说：我求庇于黎明的主",
      sw: "Sema: Ninajikinga kwa Mola wa alfajiri",
      so: "Dheh: Waxaan magangalyahay Rabbiga waaberi",
      bs: "Reci: Utječem se Gospodaru zore",
      sq: "Thuaj: Kërkoj mbrojtje te Zoti i agimit",
      ru: "Скажи: Прибегаю к Господу рассвета",
      ur: "کہو: میں صبح کے رب کی پناہ مانگتا ہوں",
      bn: "বলো: আমি ভোরের প্রভুর আশ্রয় প্রার্থনা করি",
      ms: "Katakanlah: Aku berlindung kepada Tuhan waktu subuh"
    },
    surahAyah: "الفلق:1", ayahNumber: 1,
    hint: "تعني ضوء الفجر عندما ينشق",
    correctVerse: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    correctVerseMeaning: "Say: I seek refuge in the Lord of daybreak",
    options: [
      { text: "مِن شَرِّ مَا خَلَقَ", isCorrect: false },
      { text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", isCorrect: false },
      { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", isCorrect: true },
      { text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", isCorrect: false },
    ],
  },
  {
    id: "v9", surahAr: "الكوثر", surahEn: "Al-Kawthar",
    targetWord: "الْكَوْثَرَ",
    targetWordMeaning: "Abundance / A river in Paradise",
    targetWordTranslations: {
      en: "Abundance", ar: "الخير الكثير", id: "Nikmat yang berlimpah",
      tr: "Bolluk / Kevser", zh: "丰裕", sw: "Wingi wa kheri",
      so: "Badan", bs: "Obilje", sq: "Bollëk", ru: "Изобилие",
      ur: "کوثر (بے شمار نعمتیں)", bn: "প্রাচুর্য", ms: "Nikmat yang melimpah"
    },
    correctVerseMeaningTranslations: {
      en: "Indeed, We have granted you Al-Kawthar",
      ar: "إنا أعطيناك الخير الكثير",
      id: "Sesungguhnya Kami telah memberimu nikmat yang berlimpah",
      tr: "Şüphesiz biz sana Kevser'i verdik",
      zh: "我确已赐你丰裕",
      sw: "Hakika tumekupa wingi wa kheri",
      so: "Annaga waxaan ku siinay Al-Kawthar",
      bs: "Mi smo ti uistinu obilje dali",
      sq: "Ne, me të vërtetë, të kemi dhënë bollëk",
      ru: "Мы даровали тебе изобилие",
      ur: "بے شک ہم نے تمہیں کوثر عطا کیا",
      bn: "নিশ্চয়ই আমি তোমাকে কাওসার দান করেছি",
      ms: "Sesungguhnya Kami telah memberimu nikmat yang melimpah"
    },
    surahAyah: "الكوثر:1", ayahNumber: 1,
    hint: "الكلمة تبدأ بحرف الـ ك...",
    correctVerse: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    correctVerseMeaning: "Indeed, We have granted you Al-Kawthar",
    options: [
      { text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", isCorrect: true },
      { text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", isCorrect: false },
      { text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", isCorrect: false },
      { text: "أَلْهَاكُمُ التَّكَاثُرُ", isCorrect: false },
    ],
  },
  {
    id: "v10", surahAr: "الكوثر", surahEn: "Al-Kawthar",
    targetWord: "انْحَرْ",
    targetWordMeaning: "Sacrifice",
    targetWordTranslations: {
      en: "Sacrifice", ar: "اذبح (قدّم الذبيحة)", id: "Berkorbanlah",
      tr: "Kurban kes", zh: "献祭", sw: "Chinja",
      so: "Gowrac", bs: "Žrtvuj", sq: "Therr kurban",
      ru: "Принеси жертву", ur: "قربانی کرو", bn: "কোরবানি করো",
      ms: "Berkorbanlah"
    },
    correctVerseMeaningTranslations: {
      en: "So pray to your Lord and sacrifice",
      ar: "فصلِّ لربك واذبح",
      id: "Maka shalatlah kepada Tuhanmu dan berkorbanlah",
      tr: "Rabbin için namaz kıl ve kurban kes",
      zh: "所以你当为你的主礼拜并献祭",
      sw: "Basi mswalie Mola wako na uchinje",
      so: "Ee tuko Rabbigaa oo gowrac",
      bs: "Pa klanjaj se Gospodaru svome i žrtvuj",
      sq: "Andaj falu për Zotin tënd dhe therr kurban",
      ru: "Молись своему Господу и приноси жертву",
      ur: "پس اپنے رب کے لیے نماز پڑھو اور قربانی کرو",
      bn: "তাই তোমার প্রতিপালকের জন্য সালাত আদায় করো ও কোরবানি করো",
      ms: "Maka solatlah kepada Tuhanmu dan berkorbanlah"
    },
    surahAyah: "الكوثر:2", ayahNumber: 2,
    hint: "تعني تقديم الذبيحة لله",
    correctVerse: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
    correctVerseMeaning: "So pray to your Lord and sacrifice",
    options: [
      { text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", isCorrect: false },
      { text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", isCorrect: true },
      { text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", isCorrect: false },
      { text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ", isCorrect: false },
    ],
  },
  {
    id: "v11", surahAr: "العصر", surahEn: "Al-Asr",
    targetWord: "خُسْرٍ",
    targetWordMeaning: "Loss",
    targetWordTranslations: {
      en: "Loss", ar: "خسارة", id: "Kerugian", tr: "Ziyan / Kayıp",
      zh: "亏损", sw: "Hasara", so: "Khasaare", bs: "Gubitak",
      sq: "Humbje", ru: "Убыток", ur: "خسارہ", bn: "ক্ষতি", ms: "Kerugian"
    },
    correctVerseMeaningTranslations: {
      en: "Indeed, mankind is in loss", ar: "إن الإنسان لفي خسارة",
      id: "Sesungguhnya manusia berada dalam kerugian",
      tr: "Gerçekten insan ziyan içindedir",
      zh: "人确是在亏损之中",
      sw: "Hakika binadamu yuko katika hasara",
      so: "Runtii bini'aadamku wuxuu ku jiraa khasaare",
      bs: "Zaista je čovjek na gubitku",
      sq: "Në të vërtetë, njeriu është në humbje",
      ru: "Поистине, человек в убытке",
      ur: "بے شک انسان خسارے میں ہے",
      bn: "নিশ্চয়ই মানুষ ক্ষতির মধ্যে রয়েছে",
      ms: "Sesungguhnya manusia berada dalam kerugian"
    },
    surahAyah: "العصر:2", ayahNumber: 2,
    hint: "عكس الربح والفوز",
    correctVerse: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    correctVerseMeaning: "Indeed, mankind is in loss",
    options: [
      { text: "وَالْعَصْرِ", isCorrect: false },
      { text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ", isCorrect: false },
      { text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", isCorrect: true },
      { text: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ", isCorrect: false },
    ],
  },
  {
    id: "v12", surahAr: "الضحى", surahEn: "Ad-Duha",
    targetWord: "الضُّحَى",
    targetWordMeaning: "The Morning Brightness",
    targetWordTranslations: {
      en: "The Morning Brightness", ar: "وقت الضحى (ضوء الصباح)",
      id: "Waktu dhuha (cahaya pagi)", tr: "Kuşluk vakti",
      zh: "上午的光亮", sw: "Mwanga wa asubuhi",
      so: "Iftiinka subaxda", bs: "Jutarnje svjetlo",
      sq: "Drita e mëngjesit", ru: "Утренний свет",
      ur: "چاشت کی روشنی", bn: "পূর্বাহ্নের আলো", ms: "Waktu dhuha (cahaya pagi)"
    },
    correctVerseMeaningTranslations: {
      en: "By the morning brightness", ar: "أقسم بوقت الضحى",
      id: "Demi waktu dhuha", tr: "Kuşluk vaktine andolsun",
      zh: "以上午的光亮起誓", sw: "Naapa kwa mwanga wa asubuhi",
      so: "Waxaan ku dhaartay iftiinka subaxda",
      bs: "Tako mi jutarnjeg svjetla",
      sq: "Pasha dritën e mëngjesit", ru: "Клянусь утренним светом",
      ur: "چاشت کی قسم", bn: "পূর্বাহ্নের শপথ",
      ms: "Demi waktu dhuha"
    },
    surahAyah: "الضحى:1", ayahNumber: 1,
    hint: "وقت من أوقات النهار في الصباح",
    correctVerse: "وَالضُّحَى",
    correctVerseMeaning: "By the morning brightness",
    options: [
      { text: "وَاللَّيْلِ إِذَا سَجَى", isCorrect: false },
      { text: "وَالضُّحَى", isCorrect: true },
      { text: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى", isCorrect: false },
      { text: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَى", isCorrect: false },
    ],
  },
  {
    id: "v13", surahAr: "الضحى", surahEn: "Ad-Duha",
    targetWord: "يَتِيمًا",
    targetWordMeaning: "An orphan",
    targetWordTranslations: {
      en: "An orphan", ar: "يتيم (فقد أباه)", id: "Anak yatim",
      tr: "Yetim", zh: "孤儿", sw: "Yatima",
      so: "Agoonta", bs: "Siroče", sq: "Jetim",
      ru: "Сирота", ur: "یتیم", bn: "এতিম", ms: "Anak yatim"
    },
    correctVerseMeaningTranslations: {
      en: "Did He not find you an orphan and gave you shelter?",
      ar: "ألم يجدك يتيماً فآواك؟",
      id: "Bukankah Dia mendapatimu sebagai seorang yatim lalu Dia melindungimu?",
      tr: "O seni yetim bulup barındırmadı mı?",
      zh: "难道他没有发现你是孤儿而收容你吗？",
      sw: "Je, hakukuta yatima na akakupa makazi?",
      so: "Miyuusan ku helin adigoo agoon ah oo kuu hoygaliyey?",
      bs: "Zar te nije siročetom našao i utočište ti dao?",
      sq: "A nuk të gjeti jetim dhe të dha strehim?",
      ru: "Разве Он не нашёл тебя сиротой и не приютил?",
      ur: "کیا اس نے تمہیں یتیم نہیں پایا اور ٹھکانا دیا؟",
      bn: "তিনি কি তোমাকে এতিম পাননি এবং আশ্রয় দেননি?",
      ms: "Bukankah Dia mendapatimu yatim lalu Dia melindungimu?"
    },
    surahAyah: "الضحى:6", ayahNumber: 6,
    hint: "طفل فقد أباه",
    correctVerse: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَى",
    correctVerseMeaning: "Did He not find you an orphan and gave you shelter?",
    options: [
      { text: "وَوَجَدَكَ ضَالًّا فَهَدَى", isCorrect: false },
      { text: "وَوَجَدَكَ عَائِلًا فَأَغْنَى", isCorrect: false },
      { text: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَى", isCorrect: true },
      { text: "وَالضُّحَى", isCorrect: false },
    ],
  },
  {
    id: "v14", surahAr: "الشرح", surahEn: "Ash-Sharh",
    targetWord: "يُسْرًا",
    targetWordMeaning: "Ease / Relief",
    targetWordTranslations: {
      en: "Ease / Relief", ar: "يسر (سهولة)", id: "Kemudahan",
      tr: "Kolaylık", zh: "容易", sw: "Wepesi",
      so: "Fududayn", bs: "Olakšanje", sq: "Lehtësi",
      ru: "Облегчение", ur: "آسانی", bn: "সহজতা", ms: "Kemudahan"
    },
    correctVerseMeaningTranslations: {
      en: "Indeed, with hardship comes ease",
      ar: "إن مع الصعوبة سهولة",
      id: "Sesungguhnya bersama kesulitan ada kemudahan",
      tr: "Şüphesiz zorluğun yanında kolaylık vardır",
      zh: "困难之后必有容易",
      sw: "Hakika pamoja na shida kuna wepesi",
      so: "Runtii cilacsiga waxaa la jira fududayn",
      bs: "Zaista, uz teškoću dolazi olakšanje",
      sq: "Vërtet, me vështirësinë vjen lehtësia",
      ru: "Поистине, за трудностью следует облегчение",
      ur: "بے شک مشکل کے ساتھ آسانی ہے",
      bn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে",
      ms: "Sesungguhnya bersama kesukaran ada kemudahan"
    },
    surahAyah: "الشرح:5", ayahNumber: 5,
    hint: "عكس الصعوبة",
    correctVerse: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    correctVerseMeaning: "Indeed, with hardship comes ease",
    options: [
      { text: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", isCorrect: false },
      { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", isCorrect: true },
      { text: "وَوَضَعْنَا عَنكَ وِزْرَكَ", isCorrect: false },
      { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", isCorrect: false },
    ],
  },
  {
    id: "v15", surahAr: "الشرح", surahEn: "Ash-Sharh",
    targetWord: "شَرَحْنَا",
    targetWordMeaning: "We expanded / We opened",
    targetWordTranslations: {
      en: "We expanded", ar: "وسّعنا وفتحنا", id: "Kami lapangkan",
      tr: "Genişlettik / Açtık", zh: "我们敞开了", sw: "Tulikupanua",
      so: "Waanu kuu ballaadhinnay", bs: "Proširili smo", sq: "Ne zgjeruam",
      ru: "Мы раскрыли", ur: "ہم نے کھول دیا", bn: "আমরা প্রশস্ত করেছি",
      ms: "Kami lapangkan"
    },
    correctVerseMeaningTranslations: {
      en: "Did We not expand for you your chest?",
      ar: "ألم نوسّع لك صدرك؟",
      id: "Bukankah Kami telah melapangkan dadamu?",
      tr: "Senin göğsünü açmadık mı?",
      zh: "难道我们没有为你敞开你的胸膛吗？",
      sw: "Je, hatukukupanulia kifua chako?",
      so: "Miyaanaan kuu ballaadhinin laabta?",
      bs: "Zar ti nismo grudi tvoje proširili?",
      sq: "A nuk ta zgjeruam gjoksin tënd?",
      ru: "Разве Мы не раскрыли тебе грудь?",
      ur: "کیا ہم نے تمہارا سینہ نہیں کھول دیا؟",
      bn: "আমরা কি তোমার বক্ষ প্রশস্ত করিনি?",
      ms: "Bukankah Kami telah melapangkan dadamu?"
    },
    surahAyah: "الشرح:1", ayahNumber: 1,
    hint: "تعني فتحنا ووسّعنا",
    correctVerse: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
    correctVerseMeaning: "Did We not expand for you your chest?",
    options: [
      { text: "وَوَضَعْنَا عَنكَ وِزْرَكَ", isCorrect: false },
      { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", isCorrect: false },
      { text: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", isCorrect: true },
      { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", isCorrect: false },
    ],
  },
  {
    id: "v16", surahAr: "التين", surahEn: "At-Tin",
    targetWord: "تَقْوِيمٍ",
    targetWordMeaning: "Form / Shape / Stature",
    targetWordTranslations: {
      en: "Form / Stature", ar: "هيئة وشكل", id: "Bentuk / Rupa",
      tr: "Biçim / Şekil", zh: "形态", sw: "Umbo / Sura",
      so: "Qaab / Muuqaal", bs: "Oblik / Stas", sq: "Formë / Figurë",
      ru: "Облик / Стать", ur: "شکل / قامت", bn: "আকৃতি / গঠন",
      ms: "Bentuk / Rupa"
    },
    correctVerseMeaningTranslations: {
      en: "We created man in the best form",
      ar: "لقد خلقنا الإنسان في أحسن شكل",
      id: "Sungguh Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya",
      tr: "Biz insanı en güzel biçimde yarattık",
      zh: "我确已把人造成最优美的形态",
      sw: "Hakika tumemuumba binadamu katika umbo bora zaidi",
      so: "Waxaan aadanaha ku abuurnay qaabka ugu fiican",
      bs: "Mi smo čovjeka u najljepšem obliku stvorili",
      sq: "Ne e krijuam njeriun në formën më të bukur",
      ru: "Мы сотворили человека в наилучшем облике",
      ur: "ہم نے انسان کو بہترین شکل میں بنایا",
      bn: "আমরা মানুষকে সুন্দরতম আকৃতিতে সৃষ্টি করেছি",
      ms: "Sesungguhnya Kami telah mencipta manusia dalam bentuk yang sebaik-baiknya"
    },
    surahAyah: "التين:4", ayahNumber: 4,
    hint: "تعني الشكل والصورة",
    correctVerse: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
    correctVerseMeaning: "We created man in the best form",
    options: [
      { text: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ", isCorrect: true },
      { text: "وَالتِّينِ وَالزَّيْتُونِ", isCorrect: false },
      { text: "ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ", isCorrect: false },
      { text: "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ", isCorrect: false },
    ],
  },
  {
    id: "v17", surahAr: "العلق", surahEn: "Al-Alaq",
    targetWord: "اقْرَأْ",
    targetWordMeaning: "Read / Recite",
    targetWordTranslations: {
      en: "Read / Recite", ar: "اقرأ (تلاوة)", id: "Bacalah",
      tr: "Oku", zh: "读 / 诵读", sw: "Soma",
      so: "Akhri", bs: "Čitaj / Uči", sq: "Lexo",
      ru: "Читай", ur: "پڑھو", bn: "পড়ো", ms: "Bacalah"
    },
    correctVerseMeaningTranslations: {
      en: "Read in the name of your Lord who created",
      ar: "اقرأ باسم ربك الذي خلق",
      id: "Bacalah dengan nama Tuhanmu yang menciptakan",
      tr: "Yaratan Rabbinin adıyla oku",
      zh: "你应当奉你的创造主的名义而宣读",
      sw: "Soma kwa jina la Mola wako aliyeumba",
      so: "Ku akhri magaca Rabbigaa ee abuuray",
      bs: "Čitaj u ime Gospodara tvoga koji stvara",
      sq: "Lexo me emrin e Zotit tënd, i Cili krijoi",
      ru: "Читай во имя Господа твоего, который сотворил",
      ur: "پڑھو اپنے رب کے نام سے جس نے پیدا کیا",
      bn: "পড়ো তোমার প্রতিপালকের নামে যিনি সৃষ্টি করেছেন",
      ms: "Bacalah dengan nama Tuhanmu yang menciptakan"
    },
    surahAyah: "العلق:1", ayahNumber: 1,
    hint: "أول كلمة نزلت في القرآن",
    correctVerse: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    correctVerseMeaning: "Read in the name of your Lord who created",
    options: [
      { text: "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ", isCorrect: false },
      { text: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", isCorrect: true },
      { text: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ", isCorrect: false },
      { text: "الَّذِي عَلَّمَ بِالْقَلَمِ", isCorrect: false },
    ],
  },
  {
    id: "v18", surahAr: "العلق", surahEn: "Al-Alaq",
    targetWord: "الْقَلَمِ",
    targetWordMeaning: "The Pen",
    targetWordTranslations: {
      en: "The Pen", ar: "القلم (أداة الكتابة)", id: "Pena",
      tr: "Kalem", zh: "笔", sw: "Kalamu",
      so: "Qalinka", bs: "Pero", sq: "Pena / Lapsi",
      ru: "Перо / Калам", ur: "قلم", bn: "কলম", ms: "Pena"
    },
    correctVerseMeaningTranslations: {
      en: "Who taught by the pen", ar: "الذي علّم بالقلم",
      id: "Yang mengajar dengan pena",
      tr: "Kalemle öğreten", zh: "他用笔教人",
      sw: "Aliyefundisha kwa kalamu",
      so: "Kan wax ku baray qalinka",
      bs: "Koji perom poučava", sq: "I Cili mësoi me penë",
      ru: "Который научил посредством пера",
      ur: "جس نے قلم کے ذریعے سکھایا",
      bn: "যিনি কলমের সাহায্যে শিক্ষা দিয়েছেন",
      ms: "Yang mengajar dengan pena"
    },
    surahAyah: "العلق:4", ayahNumber: 4,
    hint: "أداة الكتابة",
    correctVerse: "الَّذِي عَلَّمَ بِالْقَلَمِ",
    correctVerseMeaning: "Who taught by the pen",
    options: [
      { text: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", isCorrect: false },
      { text: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ", isCorrect: false },
      { text: "الَّذِي عَلَّمَ بِالْقَلَمِ", isCorrect: true },
      { text: "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ", isCorrect: false },
    ],
  },
  {
    id: "v19", surahAr: "القدر", surahEn: "Al-Qadr",
    targetWord: "أَنزَلْنَاهُ",
    targetWordMeaning: "We sent it down / We revealed it",
    targetWordTranslations: {
      en: "We sent it down", ar: "أنزلناه (أرسلناه من السماء)",
      id: "Kami turunkan", tr: "Biz indirdik",
      zh: "我们降示了它", sw: "Tuliteremsha",
      so: "Waanu soo dejinnay", bs: "Mi smo ga objavili",
      sq: "Ne e zbritëm", ru: "Мы ниспослали его",
      ur: "ہم نے اسے نازل کیا", bn: "আমরা এটি নাযিল করেছি",
      ms: "Kami turunkan"
    },
    correctVerseMeaningTranslations: {
      en: "Indeed, We sent it down on the Night of Decree",
      ar: "إنا أنزلناه في ليلة القدر",
      id: "Sesungguhnya Kami telah menurunkannya pada malam kemuliaan",
      tr: "Şüphesiz biz onu Kadir gecesinde indirdik",
      zh: "我在尊贵之夜降示了它",
      sw: "Hakika tuliteremsha katika usiku wa heshima",
      so: "Annaga waxaan soo dejinnay habeenka sharafta leh",
      bs: "Mi smo ga objavili u Noći kadera",
      sq: "Ne e zbritëm atë në Natën e Kadrit",
      ru: "Мы ниспослали его в Ночь предопределения",
      ur: "بے شک ہم نے اسے شب قدر میں نازل کیا",
      bn: "নিশ্চয়ই আমরা এটি কদরের রাতে নাযিল করেছি",
      ms: "Sesungguhnya Kami telah menurunkannya pada malam kemuliaan"
    },
    surahAyah: "القدر:1", ayahNumber: 1,
    hint: "تعني أرسلناه من السماء",
    correctVerse: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
    correctVerseMeaning: "Indeed, We sent it down on the Night of Decree",
    options: [
      { text: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", isCorrect: false },
      { text: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", isCorrect: false },
      { text: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", isCorrect: true },
      { text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", isCorrect: false },
    ],
  },
  {
    id: "v20", surahAr: "الكافرون", surahEn: "Al-Kafirun",
    targetWord: "أَعْبُدُ",
    targetWordMeaning: "I worship",
    targetWordTranslations: {
      en: "I worship", ar: "أعبد (أُطيع وأُخلص)", id: "Aku menyembah",
      tr: "İbadet ederim", zh: "我崇拜", sw: "Ninaabudu",
      so: "Waan caabudaa", bs: "Obožavam", sq: "Unë adhuroj",
      ru: "Я поклоняюсь", ur: "میں عبادت کرتا ہوں", bn: "আমি ইবাদত করি",
      ms: "Aku menyembah"
    },
    correctVerseMeaningTranslations: {
      en: "I do not worship what you worship",
      ar: "لا أعبد ما تعبدون",
      id: "Aku tidak menyembah apa yang kamu sembah",
      tr: "Ben sizin taptıklarınıza tapmam",
      zh: "我不崇拜你们所崇拜的",
      sw: "Mimi siabudu mnachokiabudu",
      so: "Anigu ma caabudayo waxa aad caabuddaan",
      bs: "Ja ne obožavam ono što vi obožavate",
      sq: "Unë nuk adhuroj atë që ju adhuroni",
      ru: "Я не поклоняюсь тому, чему вы поклоняетесь",
      ur: "میں اس کی عبادت نہیں کرتا جس کی تم عبادت کرتے ہو",
      bn: "তোমরা যার ইবাদত করো আমি তার ইবাদত করি না",
      ms: "Aku tidak menyembah apa yang kamu sembah"
    },
    surahAyah: "الكافرون:2", ayahNumber: 2,
    hint: "تعني أُطيع وأُخلص",
    correctVerse: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
    correctVerseMeaning: "I do not worship what you worship",
    options: [
      { text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", isCorrect: false },
      { text: "لَا أَعْبُدُ مَا تَعْبُدُونَ", isCorrect: true },
      { text: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", isCorrect: false },
      { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", isCorrect: false },
    ],
  },
  {
    id: "v21", surahAr: "النصر", surahEn: "An-Nasr",
    targetWord: "الْفَتْحُ",
    targetWordMeaning: "The Victory / The Conquest",
    targetWordTranslations: {
      en: "The Victory", ar: "النصر والفتح", id: "Kemenangan",
      tr: "Fetih / Zafer", zh: "胜利", sw: "Ushindi",
      so: "Guusha", bs: "Pobjeda", sq: "Fitorja",
      ru: "Победа", ur: "فتح / کامیابی", bn: "বিজয়", ms: "Kemenangan"
    },
    correctVerseMeaningTranslations: {
      en: "When the victory of Allah comes and the conquest",
      ar: "إذا جاء نصر الله والفتح",
      id: "Apabila telah datang pertolongan Allah dan kemenangan",
      tr: "Allah'ın yardımı ve fetih geldiğinde",
      zh: "当真主的援助和胜利来临时",
      sw: "Itakapokuja nusura ya Mwenyezi Mungu na ushindi",
      so: "Markii ay timaado gargaarka Ilaahay iyo guusha",
      bs: "Kada Allahova pomoć i pobjeda dođu",
      sq: "Kur të vijë ndihma e Allahut dhe fitorja",
      ru: "Когда придёт помощь Аллаха и победа",
      ur: "جب اللہ کی مدد آئے اور فتح ہو",
      bn: "যখন আল্লাহর সাহায্য ও বিজয় আসবে",
      ms: "Apabila datang pertolongan Allah dan kemenangan"
    },
    surahAyah: "النصر:1", ayahNumber: 1,
    hint: "تعني الانتصار",
    correctVerse: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    correctVerseMeaning: "When the victory of Allah comes and the conquest",
    options: [
      { text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", isCorrect: true },
      { text: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", isCorrect: false },
      { text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ", isCorrect: false },
      { text: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", isCorrect: false },
    ],
  },
  {
    id: "v22", surahAr: "المسد", surahEn: "Al-Masad",
    targetWord: "تَبَّتْ",
    targetWordMeaning: "May perish / Ruined",
    targetWordTranslations: {
      en: "May perish / Ruined", ar: "هلكت / خسرت", id: "Binasalah / Celakalah",
      tr: "Kurusun / Mahvolsun", zh: "愿灭亡", sw: "Iangamie / Iharibiwe",
      so: "Ha halaagsanto", bs: "Propale / Uništene", sq: "U shkatërroftë",
      ru: "Да пропадут", ur: "ٹوٹ گئے / تباہ ہوئے", bn: "ধ্বংস হোক",
      ms: "Binasalah / Celakalah"
    },
    correctVerseMeaningTranslations: {
      en: "May the hands of Abu Lahab perish, and he has perished",
      ar: "تبت يدا أبي لهب وخسر",
      id: "Binasalah kedua tangan Abu Lahab dan sungguh dia telah binasa",
      tr: "Ebu Leheb'in elleri kurusun, kurudu da",
      zh: "愿阿布·拉海布的双手灭亡，他已灭亡",
      sw: "Ziangamie mikono ya Abu Lahab, na ameangamia",
      so: "Ha halaagsadeen gacmaha Abi Lahab, wuuna halaagsaday",
      bs: "Propale ruke Ebu Lehebove i on je propao",
      sq: "U shkatërroftë duart e Ebu Lehebit, e ai u shkatërrua",
      ru: "Да пропадут руки Абу Ляхаба, и сам он пропал",
      ur: "ابو لہب کے دونوں ہاتھ ٹوٹ جائیں اور وہ تباہ ہو",
      bn: "আবু লাহাবের দুই হাত ধ্বংস হোক এবং সে ধ্বংস হয়েছে",
      ms: "Binasalah kedua tangan Abu Lahab dan sesungguhnya dia telah binasa"
    },
    surahAyah: "المسد:1", ayahNumber: 1,
    hint: "تعني الهلاك والخسارة",
    correctVerse: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
    correctVerseMeaning: "May the hands of Abu Lahab perish, and he has perished",
    options: [
      { text: "مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ", isCorrect: false },
      { text: "سَيَصْلَى نَارًا ذَاتَ لَهَبٍ", isCorrect: false },
      { text: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", isCorrect: true },
      { text: "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ", isCorrect: false },
    ],
  },
  {
    id: "v23", surahAr: "الفيل", surahEn: "Al-Fil",
    targetWord: "أَبَابِيلَ",
    targetWordMeaning: "Flocks (of birds)",
    targetWordTranslations: {
      en: "Flocks (of birds)", ar: "جماعات (من الطيور)", id: "Berbondong-bondong",
      tr: "Sürü sürü (kuşlar)", zh: "成群的（鸟）", sw: "Makundi (ya ndege)",
      so: "Kooxo koox (shimbiraha)", bs: "Jata (ptica)", sq: "Tufa (zogjsh)",
      ru: "Стаи (птиц)", ur: "جھنڈ در جھنڈ (پرندے)", bn: "ঝাঁকে ঝাঁকে (পাখি)",
      ms: "Berbondong-bondong"
    },
    correctVerseMeaningTranslations: {
      en: "And He sent against them birds in flocks",
      ar: "وأرسل عليهم طيراً في جماعات",
      id: "Dan Dia mengirimkan kepada mereka burung yang berbondong-bondong",
      tr: "Üzerlerine sürü sürü kuşlar gönderdi",
      zh: "他派遣成群的鸟去攻击他们",
      sw: "Na akawapelekea ndege kwa makundi",
      so: "Wuxuuna ku diray shimbiro kooxo koox ah",
      bs: "I poslao je na njih ptice u jatima",
      sq: "Dhe dërgoi kundër tyre tufa zogjsh",
      ru: "И наслал на них стаи птиц",
      ur: "اور ان پر جھنڈ در جھنڈ پرندے بھیجے",
      bn: "এবং তিনি তাদের উপর ঝাঁকে ঝাঁকে পাখি পাঠিয়েছিলেন",
      ms: "Dan Dia menghantar kepada mereka burung yang berbondong-bondong"
    },
    surahAyah: "الفيل:3", ayahNumber: 3,
    hint: "طيور جاءت في جماعات",
    correctVerse: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
    correctVerseMeaning: "And He sent against them birds in flocks",
    options: [
      { text: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", isCorrect: true },
      { text: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ", isCorrect: false },
      { text: "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ", isCorrect: false },
      { text: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", isCorrect: false },
    ],
  },
  {
    id: "v24", surahAr: "الماعون", surahEn: "Al-Ma'un",
    targetWord: "يُكَذِّبُ",
    targetWordMeaning: "Denies / Rejects",
    targetWordTranslations: {
      en: "Denies / Rejects", ar: "يُكذّب (ينكر)", id: "Mendustakan",
      tr: "Yalanlayan / Reddeden", zh: "否认", sw: "Anakadhibisha",
      so: "Beeniya", bs: "Poriče", sq: "Përgënjeshtron",
      ru: "Отрицает", ur: "جھٹلاتا ہے", bn: "অস্বীকার করে",
      ms: "Mendustakan"
    },
    correctVerseMeaningTranslations: {
      en: "Have you seen the one who denies the religion?",
      ar: "أرأيت الذي يُكذّب بالدين؟",
      id: "Tahukah kamu orang yang mendustakan agama?",
      tr: "Dini yalanlayanı gördün mü?",
      zh: "你是否见过否认宗教的人？",
      sw: "Je, umemwona yule anayekadhibisha dini?",
      so: "Ma aragtay kii beeniya diinta?",
      bs: "Znaš li ti onoga koji vjeru poriče?",
      sq: "A e ke parë atë që e përgënjeshtron fenë?",
      ru: "Видел ли ты того, кто отрицает религию?",
      ur: "کیا تم نے اس شخص کو دیکھا جو دین کو جھٹلاتا ہے؟",
      bn: "তুমি কি সেই ব্যক্তিকে দেখেছ যে দ্বীনকে অস্বীকার করে?",
      ms: "Tahukah kamu orang yang mendustakan agama?"
    },
    surahAyah: "الماعون:1", ayahNumber: 1,
    hint: "عكس التصديق",
    correctVerse: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
    correctVerseMeaning: "Have you seen the one who denies the religion?",
    options: [
      { text: "فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", isCorrect: false },
      { text: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", isCorrect: true },
      { text: "وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ", isCorrect: false },
      { text: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ", isCorrect: false },
    ],
  },
  {
    id: "v25", surahAr: "الهمزة", surahEn: "Al-Humazah",
    targetWord: "جَمَعَ",
    targetWordMeaning: "Collected / Gathered",
    targetWordTranslations: {
      en: "Collected / Gathered", ar: "جمع (حصّل)", id: "Mengumpulkan",
      tr: "Topladı / Biriktirdi", zh: "聚集", sw: "Alikusanya",
      so: "Ururiyey", bs: "Skupio / Sakupio", sq: "Mblodhi / Grumbulloi",
      ru: "Собрал / Накопил", ur: "جمع کیا", bn: "সংগ্রহ করেছে",
      ms: "Mengumpulkan"
    },
    correctVerseMeaningTranslations: {
      en: "Who collected wealth and counted it",
      ar: "الذي جمع المال وعدّه",
      id: "Yang mengumpulkan harta dan menghitung-hitungnya",
      tr: "Mal toplayıp onu sayan",
      zh: "积聚财富并反复计算的人",
      sw: "Aliyekusanya mali na kuihesabu",
      so: "Kii maalka ururiyey oo tiriyey",
      bs: "Koji imetak gomila i prebrojava ga",
      sq: "I cili mblodhi pasuri dhe e numëron",
      ru: "Который копил богатство и подсчитывал его",
      ur: "جس نے مال جمع کیا اور اسے گنتا رہا",
      bn: "যে সম্পদ জমা করেছে ও তা গুনে রেখেছে",
      ms: "Yang mengumpulkan harta dan menghitung-hitungnya"
    },
    surahAyah: "الهمزة:2", ayahNumber: 2,
    hint: "عكس فرّق",
    correctVerse: "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ",
    correctVerseMeaning: "Who collected wealth and counted it",
    options: [
      { text: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ", isCorrect: false },
      { text: "كَلَّا لَيُنبَذَنَّ فِي الْحُطَمَةِ", isCorrect: false },
      { text: "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ", isCorrect: true },
      { text: "مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ", isCorrect: false },
    ],
  },
  {
    id: "v26", surahAr: "الزلزلة", surahEn: "Az-Zalzalah",
    targetWord: "زُلْزِلَتِ",
    targetWordMeaning: "Is shaken / Quaked",
    targetWordTranslations: {
      en: "Is shaken", ar: "زُلزلت (تحركت بشدة)", id: "Diguncangkan",
      tr: "Sarsıldı", zh: "被震动", sw: "Imetikiswa",
      so: "La gariiriyey", bs: "Zatresena je", sq: "U tund / U dridh",
      ru: "Сотрясена", ur: "ہلا دی گئی", bn: "কম্পিত হয়েছে",
      ms: "Digoncangkan"
    },
    correctVerseMeaningTranslations: {
      en: "When the earth is shaken with its earthquake",
      ar: "إذا زُلزلت الأرض زلزالها",
      id: "Apabila bumi diguncangkan dengan guncangan yang dahsyat",
      tr: "Yer büyük sarsıntıyla sarsıldığında",
      zh: "当大地猛烈震动时",
      sw: "Ardhi itakapotikiswa kwa mtikiso wake",
      so: "Marka dhulku la gariiriyo gariirkiisa",
      bs: "Kada se Zemlja zatrese žestokim potresom",
      sq: "Kur toka të dridhet me tërmetin e saj",
      ru: "Когда земля сотрясётся своим землетрясением",
      ur: "جب زمین اپنے زلزلے سے ہلا دی جائے گی",
      bn: "যখন পৃথিবী তার কম্পনে প্রকম্পিত হবে",
      ms: "Apabila bumi digoncangkan dengan goncangan yang dahsyat"
    },
    surahAyah: "الزلزلة:1", ayahNumber: 1,
    hint: "حركة الأرض بقوة",
    correctVerse: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا",
    correctVerseMeaning: "When the earth is shaken with its earthquake",
    options: [
      { text: "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا", isCorrect: false },
      { text: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا", isCorrect: true },
      { text: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", isCorrect: false },
      { text: "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ", isCorrect: false },
    ],
  },
  {
    id: "v27", surahAr: "القارعة", surahEn: "Al-Qari'ah",
    targetWord: "الْمَبْثُوثِ",
    targetWordMeaning: "Scattered / Spread out",
    targetWordTranslations: {
      en: "Scattered", ar: "المنتشر في كل مكان", id: "Bertebaran",
      tr: "Dağılmış / Saçılmış", zh: "散布的", sw: "Waliotawanyika",
      so: "Kala firdhsan", bs: "Rasuti / Razbacani", sq: "Të shpërndarë",
      ru: "Рассеянные", ur: "بکھری ہوئی", bn: "বিক্ষিপ্ত",
      ms: "Bertebaran"
    },
    correctVerseMeaningTranslations: {
      en: "The Day when people will be like scattered moths",
      ar: "يوم يكون الناس كالفراش المنتشر",
      id: "Hari ketika manusia seperti kupu-kupu yang bertebaran",
      tr: "O gün insanlar yayılmış kelebekler gibi olacak",
      zh: "那天人们将像散布的飞蛾",
      sw: "Siku watu watakapokuwa kama nondo waliotawanyika",
      so: "Maalinta dadku noqdaan sida balanbaallisaha kala firdhsan",
      bs: "Dan kad će ljudi biti poput rasutih leptirova",
      sq: "Ditën kur njerëzit do të jenë si flutura të shpërndara",
      ru: "В тот День люди будут подобны рассеянным мотылькам",
      ur: "جس دن لوگ بکھری ہوئی تتلیوں کی طرح ہوں گے",
      bn: "যেদিন মানুষ হবে বিক্ষিপ্ত পতঙ্গের মতো",
      ms: "Hari ketika manusia seperti kupu-kupu yang bertebaran"
    },
    surahAyah: "القارعة:4", ayahNumber: 4,
    hint: "تعني المنتشر في كل مكان",
    correctVerse: "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ",
    correctVerseMeaning: "The Day when people will be like scattered moths",
    options: [
      { text: "الْقَارِعَةُ", isCorrect: false },
      { text: "مَا الْقَارِعَةُ", isCorrect: false },
      { text: "وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ", isCorrect: false },
      { text: "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ", isCorrect: true },
    ],
  },
  {
    id: "v28", surahAr: "التكاثر", surahEn: "At-Takathur",
    targetWord: "التَّكَاثُرُ",
    targetWordMeaning: "Competition in increase / Rivalry in worldly gain",
    targetWordTranslations: {
      en: "Competition in increase", ar: "التفاخر بالكثرة", id: "Bermegah-megahan",
      tr: "Çokluk yarışı", zh: "竞相增多", sw: "Kushindana kwa wingi",
      so: "Tartanka badnaanta", bs: "Nadmetanje u gomilanju",
      sq: "Garimi në shtim", ru: "Страсть к приумножению",
      ur: "زیادتی کی دوڑ", bn: "প্রাচুর্যের প্রতিযোগিতা", ms: "Bermegah-megahan"
    },
    correctVerseMeaningTranslations: {
      en: "Competition in worldly increase diverts you",
      ar: "ألهاكم التفاخر بكثرة الأموال والأولاد",
      id: "Bermegah-megahan telah melalaikan kamu",
      tr: "Çokluk yarışı sizi oyaladı",
      zh: "竞相增多使你们疏忽了",
      sw: "Kushindana kwa wingi kumekushughulisheni",
      so: "Tartanka badnaantu wuu idin mashquuliyey",
      bs: "Zaokuplja vas nadmetanje u gomilanju",
      sq: "Garimi në grumbullim ju ka larguar",
      ru: "Страсть к приумножению отвлекает вас",
      ur: "زیادتی کی دوڑ نے تمہیں غافل کر دیا",
      bn: "প্রাচুর্যের প্রতিযোগিতা তোমাদের ভুলিয়ে রেখেছে",
      ms: "Bermegah-megahan telah melalaikan kamu"
    },
    surahAyah: "التكاثر:1", ayahNumber: 1,
    hint: "التنافس في جمع الأشياء",
    correctVerse: "أَلْهَاكُمُ التَّكَاثُرُ",
    correctVerseMeaning: "Competition in worldly increase diverts you",
    options: [
      { text: "حَتَّى زُرْتُمُ الْمَقَابِرَ", isCorrect: false },
      { text: "أَلْهَاكُمُ التَّكَاثُرُ", isCorrect: true },
      { text: "كَلَّا سَوْفَ تَعْلَمُونَ", isCorrect: false },
      { text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", isCorrect: false },
    ],
  },
  {
    id: "v29", surahAr: "البينة", surahEn: "Al-Bayyinah",
    targetWord: "الْبَيِّنَةُ",
    targetWordMeaning: "The Clear Evidence / The Clear Proof",
    targetWordTranslations: {
      en: "The Clear Evidence", ar: "البرهان الواضح", id: "Bukti yang nyata",
      tr: "Apaçık delil", zh: "明证", sw: "Ushahidi ulio wazi",
      so: "Cadaynta cad", bs: "Jasni dokaz", sq: "Prova e qartë",
      ru: "Ясное доказательство", ur: "واضح دلیل", bn: "সুস্পষ্ট প্রমাণ",
      ms: "Bukti yang nyata"
    },
    correctVerseMeaningTranslations: {
      en: "Until there came to them the clear evidence",
      ar: "حتى تأتيهم البينة الواضحة",
      id: "Sampai datang kepada mereka bukti yang nyata",
      tr: "Kendilerine apaçık delil gelinceye kadar",
      zh: "直到明证来到他们面前",
      sw: "Mpaka ukawajia ushahidi ulio wazi",
      so: "Ilaa ay u timaado cadaynta cad",
      bs: "Dok im jasni dokaz ne dođe",
      sq: "Derisa t'u vijë prova e qartë",
      ru: "Пока не пришло к ним ясное доказательство",
      ur: "یہاں تک کہ ان کے پاس واضح دلیل آئے",
      bn: "যতক্ষণ না তাদের কাছে সুস্পষ্ট প্রমাণ আসে",
      ms: "Sehingga datang kepada mereka bukti yang nyata"
    },
    surahAyah: "البينة:1", ayahNumber: 1,
    hint: "تعني الدليل الواضح",
    correctVerse: "حَتَّى تَأْتِيَهُمُ الْبَيِّنَةُ",
    correctVerseMeaning: "Until there came to them the clear evidence",
    options: [
      { text: "رَسُولٌ مِّنَ اللَّهِ يَتْلُو صُحُفًا مُّطَهَّرَةً", isCorrect: false },
      { text: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", isCorrect: false },
      { text: "حَتَّى تَأْتِيَهُمُ الْبَيِّنَةُ", isCorrect: true },
      { text: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", isCorrect: false },
    ],
  },
  {
    id: "v30", surahAr: "العاديات", surahEn: "Al-Adiyat",
    targetWord: "الْعَادِيَاتِ",
    targetWordMeaning: "The charging horses / The runners",
    targetWordTranslations: {
      en: "The charging horses", ar: "الخيول العادية (الراكضة بسرعة)",
      id: "Kuda-kuda perang yang berlari kencang", tr: "Hızla koşan atlar",
      zh: "奔驰的战马", sw: "Farasi wanaokimbia kwa kasi",
      so: "Fardaha ordi u ordaya", bs: "Konji koji jure",
      sq: "Kuajt që vrapojnë", ru: "Скачущие кони",
      ur: "تیز دوڑنے والے گھوڑے", bn: "দ্রুতগামী ঘোড়া",
      ms: "Kuda-kuda perang yang berlari laju"
    },
    correctVerseMeaningTranslations: {
      en: "By the charging horses, panting",
      ar: "أقسم بالخيول العاديات وهي تلهث",
      id: "Demi kuda perang yang berlari kencang terengah-engah",
      tr: "Soluk soluğa koşanlara andolsun",
      zh: "以气喘吁吁奔驰的战马起誓",
      sw: "Naapa kwa farasi wanaokimbia kwa kasi wakihema",
      so: "Waxaan ku dhaartay fardaha ordaya oo neefta leh",
      bs: "Tako mi konja koji jure dahtavo",
      sq: "Pasha kuajt që vrapojnë duke gulçuar",
      ru: "Клянусь скачущими, тяжело дышащими",
      ur: "ہانپتے ہوئے تیز دوڑنے والے گھوڑوں کی قسم",
      bn: "শপথ হাঁপাতে হাঁপাতে দ্রুত ধাবমান অশ্বগুলোর",
      ms: "Demi kuda perang yang berlari laju sambil terengah-engah"
    },
    surahAyah: "العاديات:1", ayahNumber: 1,
    hint: "الخيول التي تجري بسرعة",
    correctVerse: "وَالْعَادِيَاتِ ضَبْحًا",
    correctVerseMeaning: "By the charging horses, panting",
    options: [
      { text: "فَالْمُورِيَاتِ قَدْحًا", isCorrect: false },
      { text: "فَالْمُغِيرَاتِ صُبْحًا", isCorrect: false },
      { text: "وَالْعَادِيَاتِ ضَبْحًا", isCorrect: true },
      { text: "وَالْعَصْرِ", isCorrect: false },
    ],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function generateVocabularyExercise(userLanguage: string = 'en'): Promise<VocabularyExercise & { translatedWordMeaning: string; translatedVerseMeaning: string }> {
  const exercise = VOCAB_BANK[Math.floor(Math.random() * VOCAB_BANK.length)];
  const shuffledOptions = shuffleArray(exercise.options);
  const translatedWordMeaning = exercise.targetWordTranslations[userLanguage] || exercise.targetWordTranslations['en'] || exercise.targetWordMeaning;
  const translatedVerseMeaning = exercise.correctVerseMeaningTranslations[userLanguage] || exercise.correctVerseMeaningTranslations['en'] || exercise.correctVerseMeaning;
  return {
    ...exercise,
    id: `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    options: shuffledOptions,
    targetWordMeaning: translatedWordMeaning,
    correctVerseMeaning: translatedVerseMeaning,
    translatedWordMeaning,
    translatedVerseMeaning,
  };
}

export async function validateVocabularyAnswer(
  userAnswer: string,
  correctAnswer: string,
  questionText: string,
  surahAyah: string,
  userLanguage: string = 'en'
): Promise<{ isCorrect: boolean; score: number; feedback: string; feedbackTranslation?: string }> {
  const normalizedUser = removeDiacritics(userAnswer.trim());
  const normalizedCorrect = removeDiacritics(correctAnswer.trim());
  
  if (normalizedUser === normalizedCorrect || 
      userAnswer.trim() === correctAnswer.trim() ||
      normalizedUser.includes(normalizedCorrect) || 
      normalizedCorrect.includes(normalizedUser)) {
    return {
      isCorrect: true,
      score: 100,
      feedback: userLanguage === 'ar' ? 'إجابة صحيحة! أحسنت! ✅' : 'Correct answer! Well done! ✅',
    };
  }

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ parts: [{ text: `You are validating an Arabic vocabulary exercise answer.

Question: "${questionText}"
Correct Answer: "${correctAnswer}" (${surahAyah})
Student's Answer: "${userAnswer}"

Check if the student's answer is the same word/phrase as the correct answer (ignore diacritics/tashkeel differences).
If the student wrote the same word but with different diacritics, it's CORRECT.
If the student wrote a completely different word, it's INCORRECT.

Respond in ${userLanguage === 'ar' ? 'Arabic' : 'English'}.

Return ONLY valid JSON:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Brief encouraging feedback in ${userLanguage === 'ar' ? 'Arabic' : 'English'}"
}` }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 256 }
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (text) {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const result = JSON.parse(cleaned);
      return {
        isCorrect: result.isCorrect || false,
        score: result.score || 0,
        feedback: result.feedback || (userLanguage === 'ar' ? 'حاول مرة أخرى' : 'Try again'),
      };
    }
  } catch (e) {
    console.error("Error validating vocabulary answer:", e);
  }

  return {
    isCorrect: false,
    score: 0,
    feedback: userLanguage === 'ar' 
      ? `الإجابة الصحيحة هي: ${correctAnswer} (${surahAyah})`
      : `The correct answer is: ${correctAnswer} (${surahAyah})`,
  };
}
