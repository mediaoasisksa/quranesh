import axios from "axios";
import type { Phrase } from "@shared/schema";
import { isNonQuranicPhrase } from "./quran-validator";
import { JUZ_AMMA_BANK } from "./juz-amma-vocab";
import { validateAndRebuildOptions, buildSurahVerseMaps } from "./vocab-validator";

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
    ru: "Russian",
    ur: "Urdu",
    bn: "Bengali",
    ms: "Malay",
    fr: "French",
    sus: "Soso",
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
  ru: "Russian (Русский)",
  ur: "Urdu (اردو)",
  bn: "Bengali (বাংলা)",
  ms: "Malay (Bahasa Melayu)",
  fr: "French (Français)",
  sus: "Soso (Sosokui)",
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
  /** Set when the displayed passage extends beyond correctVerse (multi-ayah mode). */
  displayedPassageText?: string;
  contextMode?: "single_ayah" | "multi_ayah";
}

const VOCAB_BANK: VocabularyExercise[] = [
  {
    id: "v1", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْكَهْفِ",
    targetWordMeaning: "The Cave",
    targetWordTranslations: {
      en: "The Cave", ar: "المغارة", id: "Gua", tr: "Mağara", zh: "洞穴",
      sw: "Pango", so: "Godka", bs: "Pećina", sq: "Shpella", ru: "Пещера",
      ur: "غار", bn: "গুহা", ms: "Gua",
      fr: "La Grotte", sus: "Bɔlɔn"
    },
    correctVerseMeaningTranslations: {
      en: "When the youths retreated to the cave", ar: "حين لجأ الفتية إلى الكهف",
      id: "Ketika para pemuda pergi ke gua", tr: "Gençler mağaraya sığındıklarında",
      zh: "当青年们避难到洞穴时", sw: "Vijana walipokimbilia pangoni",
      so: "Markii dhalinyaradu u carareen godka", bs: "Kada se mladići skloniše u pećinu",
      sq: "Kur të rinjtë u strehuan në shpellë", ru: "Когда юноши укрылись в пещере",
      ur: "جب نوجوان غار کی طرف گئے", bn: "যখন যুবকরা গুহায় আশ্রয় নিল",
      ms: "Ketika para pemuda pergi ke gua",
      fr: "Quand les jeunes se retirèrent dans la grotte", sus: "Waati denyɛmɔɔe taa bɔlɔn na"
    },
    surahAyah: "الكهف:10", ayahNumber: 10,
    hint: "مكان في الجبل يختبئ فيه الناس",
    correctVerse: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ",
    correctVerseMeaning: "When the youths retreated to the cave",
    options: [
      { text: "أَوَى", isCorrect: false },
      { text: "الْفِتْيَةُ", isCorrect: false },
      { text: "إِلَى", isCorrect: false },
      { text: "الْكَهْفِ", isCorrect: true },
    ],
  },
  {
    id: "v2", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْفِتْيَةُ",
    targetWordMeaning: "The Youths",
    targetWordTranslations: {
      en: "The Youths", ar: "الشباب", id: "Para pemuda", tr: "Gençler", zh: "青年们",
      sw: "Vijana", so: "Dhalinyarada", bs: "Mladići", sq: "Të rinjtë", ru: "Юноши",
      ur: "نوجوان", bn: "যুবকরা", ms: "Para pemuda",
      fr: "Les Jeunes", sus: "Denyɛmɔɔe"
    },
    correctVerseMeaningTranslations: {
      en: "When the youths retreated to the cave", ar: "حين لجأ الفتية إلى الكهف",
      id: "Ketika para pemuda pergi ke gua", tr: "Gençler mağaraya sığındıklarında",
      zh: "当青年们避难到洞穴时", sw: "Vijana walipokimbilia pangoni",
      so: "Markii dhalinyaradu u carareen godka", bs: "Kada se mladići skloniše u pećinu",
      sq: "Kur të rinjtë u strehuan në shpellë", ru: "Когда юноши укрылись в пещере",
      ur: "جب نوجوان غار کی طرف گئے", bn: "যখন যুবকরা গুহায় আশ্রয় নিল",
      ms: "Ketika para pemuda pergi ke gua",
      fr: "Quand les jeunes se retirèrent dans la grotte", sus: "Waati denyɛmɔɔe taa bɔlɔn na"
    },
    surahAyah: "الكهف:10", ayahNumber: 10,
    hint: "مجموعة من الشباب",
    correctVerse: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ",
    correctVerseMeaning: "When the youths retreated to the cave",
    options: [
      { text: "أَوَى", isCorrect: false },
      { text: "الْفِتْيَةُ", isCorrect: true },
      { text: "الْكَهْفِ", isCorrect: false },
      { text: "إِذْ", isCorrect: false },
    ],
  },
  {
    id: "v3", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "رَحْمَةً",
    targetWordMeaning: "Mercy",
    targetWordTranslations: {
      en: "Mercy", ar: "رحمة", id: "Rahmat", tr: "Rahmet", zh: "慈悯",
      sw: "Rehema", so: "Naxariis", bs: "Milost", sq: "Mëshirë", ru: "Милость",
      ur: "رحمت", bn: "রহমত", ms: "Rahmat",
      fr: "Miséricorde", sus: "Naxari"
    },
    correctVerseMeaningTranslations: {
      en: "Our Lord, grant us from Yourself mercy", ar: "ربنا آتنا من عندك رحمة",
      id: "Wahai Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu",
      tr: "Rabbimiz, bize katından bir rahmet ver",
      zh: "我们的主啊，求你从你那里赐给我们慈悯",
      sw: "Mola wetu, tupe rehema kutoka kwako",
      so: "Rabbigeenna, naga sii naxariis adigaa ka",
      bs: "Gospodaru naš, daj nam od Sebe milost",
      sq: "Zoti ynë, na jep mëshirë nga Ti",
      ru: "Господи наш, даруй нам от Себя милость",
      ur: "ہمارے رب، ہمیں اپنی طرف سے رحمت عطا فرما",
      bn: "হে আমাদের প্রভু, আমাদের তোমার পক্ষ থেকে রহমত দাও",
      ms: "Wahai Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu",
      fr: "Notre Seigneur, accorde-nous Ta miséricorde", sus: "Anh Kɔlɔnyi, naxari di anh ma i bɔ"
    },
    surahAyah: "الكهف:10", ayahNumber: 10,
    hint: "تعني اللطف والعطف من الله",
    correctVerse: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً",
    correctVerseMeaning: "Our Lord, grant us from Yourself mercy",
    options: [
      { text: "رَبَّنَا", isCorrect: false },
      { text: "آتِنَا", isCorrect: false },
      { text: "رَحْمَةً", isCorrect: true },
      { text: "لَّدُنكَ", isCorrect: false },
    ],
  },
  {
    id: "v4", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "رَشَدًا",
    targetWordMeaning: "Right guidance",
    targetWordTranslations: {
      en: "Right guidance", ar: "الرشد والهداية", id: "Petunjuk yang lurus",
      tr: "Doğru yol", zh: "正道", sw: "Uongofu",
      so: "Hanuunin toosan", bs: "Ispravnost", sq: "Udhëzim", ru: "Правильный путь",
      ur: "ہدایت", bn: "সঠিক পথ", ms: "Petunjuk yang betul",
      fr: "Juste guidance", sus: "Nɛrɛ Tilinɲɛ"
    },
    correctVerseMeaningTranslations: {
      en: "And prepare for us from our affair right guidance",
      ar: "وهيئ لنا من أمرنا رشداً",
      id: "Dan sempurnakanlah bagi kami petunjuk yang lurus dalam urusan kami",
      tr: "Ve işimizden bize doğru yolu hazırla",
      zh: "为我们的事务准备正道", sw: "Na tutayarishie uongofu katika mambo yetu",
      so: "Oo noo diyaari hanuunin amarkayaga", bs: "I pripremi nam ispravnost u poslu našem",
      sq: "Dhe na përgatit udhëzim në punën tonë", ru: "И подготовь нам в нашем деле правильный путь",
      ur: "اور ہمارے معاملے میں ہدایت مہیا فرما", bn: "এবং আমাদের কাজে সঠিক পথ প্রস্তুত করো",
      ms: "Dan sediakanlah petunjuk yang betul dalam urusan kami",
      fr: "Et prépare-nous la bonne voie dans nos affaires", sus: "Wa anh xa nɛrɛ tilinɲɛ diyaari anh kɛlɛ ra"
    },
    surahAyah: "الكهف:10", ayahNumber: 10,
    hint: "عكس الضلال",
    correctVerse: "وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    correctVerseMeaning: "And prepare for us from our affair right guidance",
    options: [
      { text: "وَهَيِّئْ", isCorrect: false },
      { text: "أَمْرِنَا", isCorrect: false },
      { text: "رَشَدًا", isCorrect: true },
      { text: "لَنَا", isCorrect: false },
    ],
  },
  {
    id: "v5", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "سِنِينَ",
    targetWordMeaning: "Years",
    targetWordTranslations: {
      en: "Years", ar: "سنوات", id: "Tahun-tahun", tr: "Yıllar", zh: "年",
      sw: "Miaka", so: "Sano", bs: "Godina", sq: "Vite", ru: "Годы",
      ur: "سال", bn: "বছর", ms: "Tahun-tahun",
      fr: "Années", sus: "Sanɛe"
    },
    correctVerseMeaningTranslations: {
      en: "So We cast over their ears in the cave for a number of years",
      ar: "فضربنا على آذانهم في الكهف سنين عدداً",
      id: "Maka Kami tutup telinga mereka di dalam gua selama beberapa tahun",
      tr: "Bunun üzerine mağarada yıllarca kulaklarına vurduk",
      zh: "于是我们在洞穴中封住了他们的耳朵若干年",
      sw: "Basi tuliziba masikio yao pangoni kwa miaka kadhaa",
      so: "Markaas waxaan ku dhufannay dhegahooda godka sano tiro",
      bs: "Pa smo im zapečatili uši u pećini na niz godina",
      sq: "Atëherë ua vulosëm veshët në shpellë për disa vite",
      ru: "И Мы запечатали их уши в пещере на долгие годы",
      ur: "پس ہم نے غار میں ان کے کانوں پر کئی سال تک پردہ ڈال دیا",
      bn: "তখন আমি গুহায় তাদের কানের উপর কয়েক বছর পর্দা ফেলে দিলাম",
      ms: "Maka Kami tutup telinga mereka dalam gua selama beberapa tahun",
      fr: "So We cast over their ears in the cave for a number of years", sus: "So We cast over their ears in the cave for a number of years"
    },
    surahAyah: "الكهف:11", ayahNumber: 11,
    hint: "وحدة قياس الزمن الطويلة",
    correctVerse: "فَضَرَبْنَا عَلَى آذَانِهِمْ فِي الْكَهْفِ سِنِينَ عَدَدًا",
    correctVerseMeaning: "So We cast over their ears in the cave for a number of years",
    options: [
      { text: "فَضَرَبْنَا", isCorrect: false },
      { text: "آذَانِهِمْ", isCorrect: false },
      { text: "سِنِينَ", isCorrect: true },
      { text: "عَدَدًا", isCorrect: false },
    ],
  },
  {
    id: "v6", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "عِلْمًا",
    targetWordMeaning: "Knowledge",
    targetWordTranslations: {
      en: "Knowledge", ar: "علم ومعرفة", id: "Ilmu", tr: "İlim", zh: "知识",
      sw: "Elimu", so: "Cilmi", bs: "Znanje", sq: "Dituri", ru: "Знание",
      ur: "علم", bn: "জ্ঞান", ms: "Ilmu",
      fr: "Connaissance", sus: "Kolon"
    },
    correctVerseMeaningTranslations: {
      en: "And We taught him knowledge from Us",
      ar: "وعلّمناه من عندنا علماً",
      id: "Dan Kami ajarkan kepadanya ilmu dari sisi Kami",
      tr: "Ve ona katımızdan bir ilim öğrettik",
      zh: "我们从我们那里教给了他知识",
      sw: "Na tulimfundisha elimu kutoka kwetu",
      so: "Waxaana ka barray cilmi xaggeenna ah",
      bs: "I poučismo ga znanjem od Nas",
      sq: "Dhe e mësuam nga ana Jonë dituri",
      ru: "И Мы научили его знанию от Нас",
      ur: "اور ہم نے اسے اپنی طرف سے علم سکھایا",
      bn: "এবং আমরা তাকে আমাদের পক্ষ থেকে জ্ঞান শিক্ষা দিয়েছিলাম",
      ms: "Dan Kami ajarkan kepadanya ilmu dari sisi Kami",
      fr: "And We taught him knowledge from Us", sus: "And We taught him knowledge from Us"
    },
    surahAyah: "الكهف:65", ayahNumber: 65,
    hint: "تعني المعرفة والفهم",
    correctVerse: "وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا",
    correctVerseMeaning: "And We taught him knowledge from Us",
    options: [
      { text: "وَعَلَّمْنَاهُ", isCorrect: false },
      { text: "مِن", isCorrect: false },
      { text: "لَّدُنَّا", isCorrect: false },
      { text: "عِلْمًا", isCorrect: true },
    ],
  },
  {
    id: "v7", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "صَبْرًا",
    targetWordMeaning: "Patience",
    targetWordTranslations: {
      en: "Patience", ar: "صبر وتحمّل", id: "Kesabaran", tr: "Sabır", zh: "耐心",
      sw: "Subira", so: "Samir", bs: "Strpljenje", sq: "Durim", ru: "Терпение",
      ur: "صبر", bn: "ধৈর্য", ms: "Kesabaran",
      fr: "Patience", sus: "Murutare"
    },
    correctVerseMeaningTranslations: {
      en: "Indeed, you will never be able to have patience with me",
      ar: "إنك لن تستطيع أن تصبر معي",
      id: "Sesungguhnya kamu tidak akan sanggup bersabar bersamaku",
      tr: "Şüphesiz sen benimle birlikte sabretmeye güç yetiremezsin",
      zh: "你确实无法与我一起保持耐心",
      sw: "Hakika hutaweza kuwa na subira pamoja nami",
      so: "Runtii kuma awoodi doontid inaad ila samirto",
      bs: "Zaista ti nećeš moći imati strpljenja sa mnom",
      sq: "Me të vërtetë, ti nuk do të mundesh të kesh durim me mua",
      ru: "Поистине, ты не сможешь проявить терпение со мной",
      ur: "بے شک تم میرے ساتھ صبر نہیں کر سکو گے",
      bn: "নিশ্চয়ই তুমি আমার সাথে ধৈর্য ধরতে পারবে না",
      ms: "Sesungguhnya kamu tidak akan sanggup bersabar bersamaku",
      fr: "En vérité, tu ne pourras jamais avoir de patience avec moi", sus: "Tilinɲɛ, i mu bɛ murutare sɔtɔ n fɛ"
    },
    surahAyah: "الكهف:67", ayahNumber: 67,
    hint: "عكس العجلة والاستعجال",
    correctVerse: "قَالَ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا",
    correctVerseMeaning: "Indeed, you will never be able to have patience with me",
    options: [
      { text: "إِنَّكَ", isCorrect: false },
      { text: "تَسْتَطِيعَ", isCorrect: false },
      { text: "مَعِيَ", isCorrect: false },
      { text: "صَبْرًا", isCorrect: true },
    ],
  },
  {
    id: "v8", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "السَّفِينَةِ",
    targetWordMeaning: "The Ship",
    targetWordTranslations: {
      en: "The Ship", ar: "السفينة (المركب)", id: "Kapal", tr: "Gemi", zh: "船",
      sw: "Meli", so: "Markabka", bs: "Brod", sq: "Anija", ru: "Корабль",
      ur: "کشتی", bn: "জাহাজ", ms: "Kapal",
      fr: "Le Bateau", sus: "Bɔti"
    },
    correctVerseMeaningTranslations: {
      en: "As for the ship, it belonged to poor people working at sea",
      ar: "أما السفينة فكانت لمساكين يعملون في البحر",
      id: "Adapun kapal itu adalah milik orang-orang miskin yang bekerja di laut",
      tr: "Gemiye gelince, o denizde çalışan yoksul kişilere aitti",
      zh: "至于那条船，它属于在海上工作的穷人",
      sw: "Kuhusu meli, ilikuwa ya maskini wanaofanya kazi baharini",
      so: "Markabkii, wuxuu ahaa masaakiin badda ka shaqaysta",
      bs: "Što se tiče broda, pripadao je siromasima koji rade na moru",
      sq: "Sa për anijen, ajo ishte e të varfërve që punonin në det",
      ru: "Что касается корабля, он принадлежал беднякам, работавшим на море",
      ur: "جہاں تک کشتی کا تعلق ہے وہ مسکینوں کی تھی جو سمندر میں کام کرتے تھے",
      bn: "জাহাজটির কথা, তা ছিল দরিদ্র লোকদের যারা সমুদ্রে কাজ করতো",
      ms: "Adapun kapal itu adalah milik orang-orang miskin yang bekerja di laut",
      fr: "Quant au bateau, il appartenait à des pauvres qui travaillaient en mer", sus: "Bɔti nan na, a ye xun mu bɛ mɔɔe ra bɛrɛ ma"
    },
    surahAyah: "الكهف:79", ayahNumber: 79,
    hint: "مركب يسير على الماء",
    correctVerse: "أَمَّا السَّفِينَةُ فَكَانَتْ لِمَسَاكِينَ يَعْمَلُونَ فِي الْبَحْرِ",
    correctVerseMeaning: "As for the ship, it belonged to poor people working at sea",
    options: [
      { text: "أَمَّا", isCorrect: false },
      { text: "السَّفِينَةُ", isCorrect: true },
      { text: "لِمَسَاكِينَ", isCorrect: false },
      { text: "الْبَحْرِ", isCorrect: false },
    ],
  },
  {
    id: "v9", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْبَحْرِ",
    targetWordMeaning: "The Sea",
    targetWordTranslations: {
      en: "The Sea", ar: "البحر", id: "Laut", tr: "Deniz", zh: "海洋",
      sw: "Bahari", so: "Badda", bs: "More", sq: "Deti", ru: "Море",
      ur: "سمندر", bn: "সমুদ্র", ms: "Laut",
      fr: "La Mer", sus: "Bɛrɛ"
    },
    correctVerseMeaningTranslations: {
      en: "As for the ship, it belonged to poor people working at sea",
      ar: "أما السفينة فكانت لمساكين يعملون في البحر",
      id: "Adapun kapal itu adalah milik orang-orang miskin yang bekerja di laut",
      tr: "Gemiye gelince, o denizde çalışan yoksul kişilere aitti",
      zh: "至于那条船，它属于在海上工作的穷人",
      sw: "Kuhusu meli, ilikuwa ya maskini wanaofanya kazi baharini",
      so: "Markabkii, wuxuu ahaa masaakiin badda ka shaqaysta",
      bs: "Što se tiče broda, pripadao je siromasima koji rade na moru",
      sq: "Sa për anijen, ajo ishte e të varfërve që punonin në det",
      ru: "Что касается корабля, он принадлежал беднякам, работавшим на море",
      ur: "جہاں تک کشتی کا تعلق ہے وہ مسکینوں کی تھی جو سمندر میں کام کرتے تھے",
      bn: "জাহাজটির কথা, তা ছিল দরিদ্র লোকদের যারা সমুদ্রে কাজ করতো",
      ms: "Adapun kapal itu adalah milik orang-orang miskin yang bekerja di laut",
      fr: "Quant au bateau, il appartenait à des pauvres qui travaillaient en mer", sus: "Bɔti nan na, a ye xun mu bɛ mɔɔe ra bɛrɛ ma"
    },
    surahAyah: "الكهف:79", ayahNumber: 79,
    hint: "المسطح المائي الكبير",
    correctVerse: "أَمَّا السَّفِينَةُ فَكَانَتْ لِمَسَاكِينَ يَعْمَلُونَ فِي الْبَحْرِ",
    correctVerseMeaning: "As for the ship, it belonged to poor people working at sea",
    options: [
      { text: "السَّفِينَةُ", isCorrect: false },
      { text: "لِمَسَاكِينَ", isCorrect: false },
      { text: "يَعْمَلُونَ", isCorrect: false },
      { text: "الْبَحْرِ", isCorrect: true },
    ],
  },
  {
    id: "v10", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْجَنَّتَيْنِ",
    targetWordMeaning: "The Two Gardens",
    targetWordTranslations: {
      en: "The Two Gardens", ar: "البستانين", id: "Dua kebun", tr: "İki bahçe", zh: "两座花园",
      sw: "Bustani mbili", so: "Labada beero", bs: "Dva vrta", sq: "Dy kopshte", ru: "Два сада",
      ur: "دو باغ", bn: "দুটি বাগান", ms: "Dua kebun",
      fr: "Les Deux Jardins", sus: "Taan Sɛndɛ"
    },
    correctVerseMeaningTranslations: {
      en: "We granted him two gardens of grapevines",
      ar: "جعلنا له جنتين من أعناب",
      id: "Kami berikan kepadanya dua kebun anggur",
      tr: "Ona iki üzüm bağı verdik",
      zh: "我们赐给他两座葡萄园",
      sw: "Tulimpa bustani mbili za mizabibu",
      so: "Waxaan ka dhignay laba beero canab ah",
      bs: "Dali smo mu dva vrta vinograda",
      sq: "I dhamë dy kopshte me rrush",
      ru: "Мы дали ему два виноградных сада",
      ur: "ہم نے اسے انگور کے دو باغ دیے",
      bn: "আমরা তাকে আঙুরের দুটি বাগান দিয়েছিলাম",
      ms: "Kami berikan kepadanya dua kebun anggur",
      fr: "We granted him two gardens of grapevines", sus: "We granted him two gardens of grapevines"
    },
    surahAyah: "الكهف:32", ayahNumber: 32,
    hint: "مكانان مليئان بالأشجار والثمار",
    correctVerse: "وَاضْرِبْ لَهُم مَّثَلًا رَّجُلَيْنِ جَعَلْنَا لِأَحَدِهِمَا جَنَّتَيْنِ مِنْ أَعْنَابٍ",
    correctVerseMeaning: "We granted him two gardens of grapevines",
    options: [
      { text: "رَّجُلَيْنِ", isCorrect: false },
      { text: "جَنَّتَيْنِ", isCorrect: true },
      { text: "أَعْنَابٍ", isCorrect: false },
      { text: "مَّثَلًا", isCorrect: false },
    ],
  },
  {
    id: "v11", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْمَالُ",
    targetWordMeaning: "Wealth / Money",
    targetWordTranslations: {
      en: "Wealth", ar: "المال والثروة", id: "Harta", tr: "Mal / Servet", zh: "财富",
      sw: "Mali", so: "Maalka", bs: "Imetak", sq: "Pasuria", ru: "Богатство",
      ur: "مال و دولت", bn: "সম্পদ", ms: "Harta",
      fr: "Richesse / Argent", sus: "Lɛndɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Wealth and children are the adornment of the life of this world",
      ar: "المال والبنون زينة الحياة الدنيا",
      id: "Harta dan anak-anak adalah perhiasan kehidupan dunia",
      tr: "Mal ve oğullar dünya hayatının süsüdür",
      zh: "财富和子女是今世生活的装饰",
      sw: "Mali na watoto ni pambo la maisha ya dunia",
      so: "Maalka iyo carruurtaa quruxda nolosha aduunka",
      bs: "Imetak i sinovi su ukras života na ovom svijetu",
      sq: "Pasuria dhe fëmijët janë stoli i jetës së kësaj bote",
      ru: "Богатство и сыновья — украшение мирской жизни",
      ur: "مال اور اولاد دنیا کی زندگی کی زینت ہیں",
      bn: "সম্পদ ও সন্তানেরা দুনিয়ার জীবনের শোভা",
      ms: "Harta dan anak-anak adalah perhiasan kehidupan dunia",
      fr: "Wealth and children are the adornment of the life of this world", sus: "Wealth and children are the adornment of the life of this world"
    },
    surahAyah: "الكهف:46", ayahNumber: 46,
    hint: "ما يملكه الإنسان من ثروة",
    correctVerse: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا",
    correctVerseMeaning: "Wealth and children are the adornment of the life of this world",
    options: [
      { text: "الْمَالُ", isCorrect: true },
      { text: "الْبَنُونَ", isCorrect: false },
      { text: "زِينَةُ", isCorrect: false },
      { text: "الدُّنْيَا", isCorrect: false },
    ],
  },
  {
    id: "v12", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "زِينَةُ",
    targetWordMeaning: "Adornment / Beauty",
    targetWordTranslations: {
      en: "Adornment", ar: "الزينة والجمال", id: "Perhiasan", tr: "Süs", zh: "装饰",
      sw: "Pambo", so: "Qurux", bs: "Ukras", sq: "Stoli", ru: "Украшение",
      ur: "زینت", bn: "শোভা", ms: "Perhiasan",
      fr: "Parure / Beauté", sus: "Nɔrɔnɔrɔ"
    },
    correctVerseMeaningTranslations: {
      en: "Wealth and children are the adornment of the life of this world",
      ar: "المال والبنون زينة الحياة الدنيا",
      id: "Harta dan anak-anak adalah perhiasan kehidupan dunia",
      tr: "Mal ve oğullar dünya hayatının süsüdür",
      zh: "财富和子女是今世生活的装饰",
      sw: "Mali na watoto ni pambo la maisha ya dunia",
      so: "Maalka iyo carruurtaa quruxda nolosha aduunka",
      bs: "Imetak i sinovi su ukras života na ovom svijetu",
      sq: "Pasuria dhe fëmijët janë stoli i jetës së kësaj bote",
      ru: "Богатство и сыновья — украшение мирской жизни",
      ur: "مال اور اولاد دنیا کی زندگی کی زینت ہیں",
      bn: "সম্পদ ও সন্তানেরা দুনিয়ার জীবনের শোভা",
      ms: "Harta dan anak-anak adalah perhiasan kehidupan dunia",
      fr: "Wealth and children are the adornment of the life of this world", sus: "Wealth and children are the adornment of the life of this world"
    },
    surahAyah: "الكهف:46", ayahNumber: 46,
    hint: "ما يُجمّل ويُزيّن",
    correctVerse: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا",
    correctVerseMeaning: "Wealth and children are the adornment of the life of this world",
    options: [
      { text: "الْمَالُ", isCorrect: false },
      { text: "الْبَنُونَ", isCorrect: false },
      { text: "زِينَةُ", isCorrect: true },
      { text: "الْحَيَاةِ", isCorrect: false },
    ],
  },
  {
    id: "v13", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْكِتَابَ",
    targetWordMeaning: "The Book",
    targetWordTranslations: {
      en: "The Book", ar: "الكتاب (القرآن)", id: "Kitab", tr: "Kitap", zh: "经典",
      sw: "Kitabu", so: "Kitaabka", bs: "Knjiga", sq: "Libri", ru: "Книга",
      ur: "کتاب", bn: "কিতাব", ms: "Kitab",
      fr: "Le Livre", sus: "Sɛbɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Praise be to Allah who revealed the Book to His servant",
      ar: "الحمد لله الذي أنزل على عبده الكتاب",
      id: "Segala puji bagi Allah yang telah menurunkan Kitab kepada hamba-Nya",
      tr: "Hamd, kuluna Kitab'ı indiren Allah'a mahsustur",
      zh: "赞美真主，他把经典降给他的仆人",
      sw: "Sifa njema zote ni za Mwenyezi Mungu aliyemteremshia mtumishi wake Kitabu",
      so: "Ammaantii Allaah oo ku soo dejiyay addoonkiisa Kitaabka",
      bs: "Hvala Allahu koji je objavio Knjigu Svome robu",
      sq: "Falënderimi i qoftë Allahut që i zbriti Librin robit të Vet",
      ru: "Хвала Аллаху, Который ниспослал Своему рабу Книгу",
      ur: "تعریف اللہ کی جس نے اپنے بندے پر کتاب نازل کی",
      bn: "সমস্ত প্রশংসা আল্লাহর যিনি তাঁর বান্দার প্রতি কিতাব নাযিল করেছেন",
      ms: "Segala puji bagi Allah yang menurunkan Kitab kepada hamba-Nya",
      fr: "Praise be to Allah who revealed the Book to His servant", sus: "Praise be to Allah who revealed the Book to His servant"
    },
    surahAyah: "الكهف:1", ayahNumber: 1,
    hint: "القرآن الكريم",
    correctVerse: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَى عَبْدِهِ الْكِتَابَ",
    correctVerseMeaning: "Praise be to Allah who revealed the Book to His servant",
    options: [
      { text: "الْحَمْدُ", isCorrect: false },
      { text: "أَنزَلَ", isCorrect: false },
      { text: "عَبْدِهِ", isCorrect: false },
      { text: "الْكِتَابَ", isCorrect: true },
    ],
  },
  {
    id: "v14", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "عِوَجًا",
    targetWordMeaning: "Any crookedness / Deviation",
    targetWordTranslations: {
      en: "Any crookedness", ar: "اعوجاج أو انحراف", id: "Kebengkokan", tr: "Eğrilik", zh: "弯曲",
      sw: "Upotovu", so: "Qalooc", bs: "Iskrivljenost", sq: "Shtrembërim", ru: "Искривление",
      ur: "کجی", bn: "বক্রতা", ms: "Kebengkokan",
      fr: "Toute déviation", sus: "Nalama"
    },
    correctVerseMeaningTranslations: {
      en: "And has not made therein any crookedness",
      ar: "ولم يجعل له أي اعوجاج",
      id: "Dan tidak menjadikan padanya kebengkokan",
      tr: "Ve onda hiçbir eğrilik yapmadı",
      zh: "他没有使它有任何弯曲",
      sw: "Na hakuufanya wenye upotovu wowote",
      so: "Oo aanuu ka dhigin qalooc",
      bs: "I nije u njoj dao nikakvu iskrivljenost",
      sq: "Dhe nuk vuri në të asnjë shtrembërim",
      ru: "И не допустил в нём никакого искривления",
      ur: "اور اس میں کوئی کجی نہیں رکھی",
      bn: "এবং তাতে কোনো বক্রতা রাখেননি",
      ms: "Dan tidak menjadikan padanya sebarang kebengkokan",
      fr: "And has not made therein any crookedness", sus: "And has not made therein any crookedness"
    },
    surahAyah: "الكهف:1", ayahNumber: 1,
    hint: "عكس الاستقامة",
    correctVerse: "وَلَمْ يَجْعَل لَّهُ عِوَجًا",
    correctVerseMeaning: "And has not made therein any crookedness",
    options: [
      { text: "وَلَمْ", isCorrect: false },
      { text: "يَجْعَل", isCorrect: false },
      { text: "لَّهُ", isCorrect: false },
      { text: "عِوَجًا", isCorrect: true },
    ],
  },
  {
    id: "v15", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الصَّالِحَاتِ",
    targetWordMeaning: "Good deeds / Righteous deeds",
    targetWordTranslations: {
      en: "Good deeds", ar: "الأعمال الصالحة", id: "Amal saleh", tr: "Salih ameller", zh: "善行",
      sw: "Matendo mema", so: "Camalka wanaagsan", bs: "Dobra djela", sq: "Vepra të mira", ru: "Праведные дела",
      ur: "نیک اعمال", bn: "সৎকর্ম", ms: "Amal soleh",
      fr: "Bonnes œuvres", sus: "Kɛlɛ Kore"
    },
    correctVerseMeaningTranslations: {
      en: "And gives good tidings to the believers who do righteous deeds",
      ar: "ويبشر المؤمنين الذين يعملون الأعمال الصالحة",
      id: "Dan memberi kabar gembira kepada orang-orang beriman yang mengerjakan amal saleh",
      tr: "Ve salih amel işleyen müminleri müjdeler",
      zh: "并向行善的信士报喜",
      sw: "Na kuwabashiria waumini wanaotenda matendo mema",
      so: "Oo ugu bishaareeya mu'miniinta camalka wanaagsan sameeya",
      bs: "I radosnom viješću vjernike koji čine dobra djela",
      sq: "Dhe përgëzon besimtarët që bëjnë vepra të mira",
      ru: "И радует верующих, совершающих праведные дела",
      ur: "اور ایمان والوں کو جو نیک اعمال کرتے ہیں خوشخبری دیتا ہے",
      bn: "এবং সুসংবাদ দেয় মুমিনদের যারা সৎকর্ম করে",
      ms: "Dan memberi khabar gembira kepada orang-orang beriman yang beramal soleh",
      fr: "And gives good tidings to the believers who do righteous deeds", sus: "And gives good tidings to the believers who do righteous deeds"
    },
    surahAyah: "الكهف:2", ayahNumber: 2,
    hint: "الأعمال الحسنة التي يثاب عليها",
    correctVerse: "وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ",
    correctVerseMeaning: "And gives good tidings to the believers who do righteous deeds",
    options: [
      { text: "وَيُبَشِّرَ", isCorrect: false },
      { text: "الْمُؤْمِنِينَ", isCorrect: false },
      { text: "يَعْمَلُونَ", isCorrect: false },
      { text: "الصَّالِحَاتِ", isCorrect: true },
    ],
  },
  {
    id: "v16", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "ذِكْرًا",
    targetWordMeaning: "Remembrance / Mention",
    targetWordTranslations: {
      en: "Remembrance", ar: "ذكر وتذكّر", id: "Peringatan", tr: "Zikir / Hatırlama", zh: "记忆",
      sw: "Ukumbusho", so: "Xusuus", bs: "Sjećanje", sq: "Përkujtim", ru: "Поминание",
      ur: "ذکر", bn: "স্মরণ", ms: "Peringatan",
      fr: "Rappel / Souvenir", sus: "Xabu"
    },
    correctVerseMeaningTranslations: {
      en: "And do not say of anything: I shall do that tomorrow, except [when adding] if Allah wills. And remember your Lord when you forget",
      ar: "واذكر ربك إذا نسيت",
      id: "Dan ingatlah Tuhanmu jika kamu lupa",
      tr: "Unuttuğun zaman Rabbini an",
      zh: "当你忘记时，你当记念你的主",
      sw: "Na mkumbuke Mola wako unaposaahu",
      so: "Oo xasuuso Rabbigaa markaad illowdo",
      bs: "I sjeti se Gospodara svoga kada zaboraviš",
      sq: "Dhe përkujto Zotin tënd kur të harrosh",
      ru: "И поминай Господа своего, когда забудешь",
      ur: "اور اپنے رب کو یاد کرو جب بھول جاؤ",
      bn: "এবং তোমার প্রভুকে স্মরণ করো যখন তুমি ভুলে যাও",
      ms: "Dan ingatlah Tuhanmu apabila kamu lupa",
      fr: "And do not say of anything: I shall do that tomorrow, except [when adding] if Allah wills. And remember your Lord when you forget", sus: "And do not say of anything: I shall do that tomorrow, except [when adding] if Allah wills. And remember your Lord when you forget"
    },
    surahAyah: "الكهف:24", ayahNumber: 24,
    hint: "تعني التذكّر والاستحضار",
    correctVerse: "وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ",
    correctVerseMeaning: "And remember your Lord when you forget",
    options: [
      { text: "وَاذْكُر", isCorrect: false },
      { text: "رَّبَّكَ", isCorrect: false },
      { text: "نَسِيتَ", isCorrect: false },
      { text: "ذِكْرًا", isCorrect: true },
    ],
  },
  {
    id: "v17", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "ظُلْمًا",
    targetWordMeaning: "Injustice / Wrongdoing",
    targetWordTranslations: {
      en: "Injustice", ar: "ظلم وجور", id: "Kezaliman", tr: "Zulüm", zh: "不义",
      sw: "Dhulma", so: "Dulmi", bs: "Nepravda", sq: "Padrejtësi", ru: "Несправедливость",
      ur: "ظلم", bn: "অন্যায়", ms: "Kezaliman",
      fr: "Injustice / Méfait", sus: "Nalama Kɛlɛ"
    },
    correctVerseMeaningTranslations: {
      en: "And your Lord does injustice to no one",
      ar: "ولا يظلم ربك أحداً",
      id: "Dan Tuhanmu tidak berlaku zalim kepada siapa pun",
      tr: "Rabbin hiç kimseye zulmetmez",
      zh: "你的主不会亏待任何人",
      sw: "Na Mola wako hamdhulumu yeyote",
      so: "Rabbigaana cidna ma dulmiyo",
      bs: "I Gospodar tvoj nikome nepravdu ne čini",
      sq: "Dhe Zoti yt nuk i bën padrejtësi askujt",
      ru: "И Господь твой не поступает несправедливо ни с кем",
      ur: "اور تمہارا رب کسی پر ظلم نہیں کرتا",
      bn: "এবং তোমার প্রভু কারো প্রতি অন্যায় করেন না",
      ms: "Dan Tuhanmu tidak berlaku zalim kepada sesiapa",
      fr: "And your Lord does injustice to no one", sus: "And your Lord does injustice to no one"
    },
    surahAyah: "الكهف:49", ayahNumber: 49,
    hint: "عكس العدل",
    correctVerse: "وَلَا يَظْلِمُ رَبُّكَ أَحَدًا",
    correctVerseMeaning: "And your Lord does injustice to no one",
    options: [
      { text: "وَلَا", isCorrect: false },
      { text: "يَظْلِمُ", isCorrect: false },
      { text: "رَبُّكَ", isCorrect: false },
      { text: "ظُلْمًا", isCorrect: true },
    ],
  },
  {
    id: "v18", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الشَّمْسُ",
    targetWordMeaning: "The Sun",
    targetWordTranslations: {
      en: "The Sun", ar: "الشمس", id: "Matahari", tr: "Güneş", zh: "太阳",
      sw: "Jua", so: "Qorraxda", bs: "Sunce", sq: "Dielli", ru: "Солнце",
      ur: "سورج", bn: "সূর্য", ms: "Matahari",
      fr: "Le Soleil", sus: "Tɛlɛnde"
    },
    correctVerseMeaningTranslations: {
      en: "And you would see the sun when it rose",
      ar: "وترى الشمس إذا طلعت",
      id: "Dan kamu akan melihat matahari ketika terbit",
      tr: "Güneşin doğduğunu görürsün",
      zh: "你看见太阳升起时",
      sw: "Na ukaiona jua linapochomoza",
      so: "Oo aragtid qorraxda marka ay soo baxdo",
      bs: "I vidiš sunce kad izlazi",
      sq: "Dhe e sheh diellin kur lind",
      ru: "Ты видишь, как солнце при восходе",
      ur: "اور تم دیکھتے کہ سورج جب طلوع ہوتا",
      bn: "এবং তুমি দেখতে সূর্য যখন উদিত হত",
      ms: "Dan kamu melihat matahari ketika terbit",
      fr: "And you would see the sun when it rose", sus: "And you would see the sun when it rose"
    },
    surahAyah: "الكهف:17", ayahNumber: 17,
    hint: "النجم الذي يضيء النهار",
    correctVerse: "وَتَرَى الشَّمْسَ إِذَا طَلَعَت تَّزَاوَرُ عَن كَهْفِهِمْ",
    correctVerseMeaning: "And you would see the sun when it rose inclining away from their cave",
    options: [
      { text: "وَتَرَى", isCorrect: false },
      { text: "الشَّمْسَ", isCorrect: true },
      { text: "طَلَعَت", isCorrect: false },
      { text: "كَهْفِهِمْ", isCorrect: false },
    ],
  },
  {
    id: "v19", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "كَلْبُهُم",
    targetWordMeaning: "Their Dog",
    targetWordTranslations: {
      en: "Their Dog", ar: "كلبهم", id: "Anjing mereka", tr: "Köpekleri", zh: "他们的狗",
      sw: "Mbwa wao", so: "Eygooda", bs: "Njihov pas", sq: "Qeni i tyre", ru: "Их собака",
      ur: "ان کا کتا", bn: "তাদের কুকুর", ms: "Anjing mereka",
      fr: "Leur Chien", sus: "E Xɔnxɔn"
    },
    correctVerseMeaningTranslations: {
      en: "And their dog stretching his forelegs at the entrance",
      ar: "وكلبهم باسط ذراعيه بالوصيد",
      id: "Sedang anjing mereka mengunjurkan kedua lengannya di muka pintu",
      tr: "Köpekleri de ön ayaklarını eşiğe uzatmış",
      zh: "他们的狗在门口伸展前腿",
      sw: "Na mbwa wao amenyoosha miguu yake mbele mlangoni",
      so: "Eygooda gacantiisa ku fidiyey iridka",
      bs: "A njihov pas pruživši prednje šape na ulazu",
      sq: "Dhe qeni i tyre duke i shtrirë këmbët e përparme te hyrja",
      ru: "А их собака вытянула лапы у входа",
      ur: "اور ان کا کتا اپنی اگلی ٹانگیں دہلیز پر پھیلائے ہوئے",
      bn: "এবং তাদের কুকুর তার সামনের পা দরজায় প্রসারিত করে",
      ms: "Sedang anjing mereka menghulurkan kedua-dua kaki depannya di muka pintu",
      fr: "And their dog stretching his forelegs at the entrance", sus: "And their dog stretching his forelegs at the entrance"
    },
    surahAyah: "الكهف:18", ayahNumber: 18,
    hint: "حيوان أليف كان مع أصحاب الكهف",
    correctVerse: "وَكَلْبُهُم بَاسِطٌ ذِرَاعَيْهِ بِالْوَصِيدِ",
    correctVerseMeaning: "And their dog stretching his forelegs at the entrance",
    options: [
      { text: "كَلْبُهُم", isCorrect: true },
      { text: "بَاسِطٌ", isCorrect: false },
      { text: "ذِرَاعَيْهِ", isCorrect: false },
      { text: "بِالْوَصِيدِ", isCorrect: false },
    ],
  },
  {
    id: "v20", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "مَاءً",
    targetWordMeaning: "Water",
    targetWordTranslations: {
      en: "Water", ar: "الماء", id: "Air", tr: "Su", zh: "水",
      sw: "Maji", so: "Biyo", bs: "Voda", sq: "Ujë", ru: "Вода",
      ur: "پانی", bn: "পানি", ms: "Air",
      fr: "Eau", sus: "Ji"
    },
    correctVerseMeaningTranslations: {
      en: "Send one of you with this silver coin to the city to find the purest food",
      ar: "فابعثوا أحدكم بورقكم هذه إلى المدينة فلينظر أيها أزكى طعاماً",
      id: "Maka suruhlah salah seorang di antara kamu pergi ke kota dengan membawa uang perakmu ini",
      tr: "İçinizden birini bu gümüş paranızla şehre gönderin",
      zh: "派你们中的一人拿着这些银币去城里找最纯洁的食物",
      sw: "Basi mtumeni mmoja wenu kwa fedha yenu hii mjini",
      so: "Ee dirra midkiin lacagtinna ee leh magaalada",
      bs: "Pošaljite jednog od vas sa ovim vašim srebrnjacima u grad",
      sq: "Dërgoni njërin prej jush me këtë monedhën tuaj në qytet",
      ru: "Пошлите одного из вас с этими серебряными монетами в город",
      ur: "اپنے میں سے کسی کو اپنے سکے لے کر شہر بھیجو",
      bn: "তোমাদের কাউকে তোমাদের এই রূপার মুদ্রা দিয়ে শহরে পাঠাও",
      ms: "Maka hantarlah seorang di antara kamu dengan wang perak kamu ini ke bandar",
      fr: "Send one of you with this silver coin to the city to find the purest food", sus: "Send one of you with this silver coin to the city to find the purest food"
    },
    surahAyah: "الكهف:29", ayahNumber: 29,
    hint: "سائل شفاف نشربه",
    correctVerse: "وَقُلِ الْحَقُّ مِن رَّبِّكُمْ فَمَن شَاءَ فَلْيُؤْمِن وَمَن شَاءَ فَلْيَكْفُرْ",
    correctVerseMeaning: "And say: The truth is from your Lord",
    options: [
      { text: "الْحَقُّ", isCorrect: false },
      { text: "مَاءً", isCorrect: true },
      { text: "رَّبِّكُمْ", isCorrect: false },
      { text: "شَاءَ", isCorrect: false },
    ],
  },
  {
    id: "v21", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْحَقُّ",
    targetWordMeaning: "The Truth",
    targetWordTranslations: {
      en: "The Truth", ar: "الحقيقة والصواب", id: "Kebenaran", tr: "Hakikat / Gerçek", zh: "真理",
      sw: "Ukweli", so: "Xaqiiqda", bs: "Istina", sq: "E vërteta", ru: "Истина",
      ur: "حق", bn: "সত্য", ms: "Kebenaran",
      fr: "La Vérité", sus: "Tilinɲɛ"
    },
    correctVerseMeaningTranslations: {
      en: "And say: The truth is from your Lord",
      ar: "وقل الحق من ربكم",
      id: "Dan katakanlah: Kebenaran itu datangnya dari Tuhanmu",
      tr: "Ve de ki: Hak, Rabbinizdendir",
      zh: "你说：真理来自你们的主",
      sw: "Na sema: Ukweli unatoka kwa Mola wenu",
      so: "Oo dheh: Xaqiiqdu waa xagga Rabbigiin",
      bs: "I reci: Istina je od Gospodara vašeg",
      sq: "Dhe thuaj: E vërteta është nga Zoti juaj",
      ru: "И скажи: Истина — от вашего Господа",
      ur: "اور کہو: حق تمہارے رب کی طرف سے ہے",
      bn: "এবং বলো: সত্য তোমাদের প্রভুর পক্ষ থেকে",
      ms: "Dan katakanlah: Kebenaran itu datangnya dari Tuhan kamu",
      fr: "And say: The truth is from your Lord", sus: "And say: The truth is from your Lord"
    },
    surahAyah: "الكهف:29", ayahNumber: 29,
    hint: "عكس الباطل والكذب",
    correctVerse: "وَقُلِ الْحَقُّ مِن رَّبِّكُمْ",
    correctVerseMeaning: "And say: The truth is from your Lord",
    options: [
      { text: "وَقُلِ", isCorrect: false },
      { text: "الْحَقُّ", isCorrect: true },
      { text: "مِن", isCorrect: false },
      { text: "رَّبِّكُمْ", isCorrect: false },
    ],
  },
  {
    id: "v22", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "غُلَامًا",
    targetWordMeaning: "A Boy / A Young Man",
    targetWordTranslations: {
      en: "A Boy", ar: "صبي / فتى", id: "Seorang anak muda", tr: "Bir oğlan", zh: "一个男孩",
      sw: "Kijana", so: "Wiil", bs: "Dječak", sq: "Një djalë", ru: "Мальчик",
      ur: "لڑکا", bn: "এক বালক", ms: "Seorang budak lelaki",
      fr: "Un Garçon / Jeune Homme", sus: "Denyɛ"
    },
    correctVerseMeaningTranslations: {
      en: "And as for the boy, his parents were believers",
      ar: "وأما الغلام فكان أبواه مؤمنين",
      id: "Adapun anak muda itu, kedua orang tuanya adalah orang beriman",
      tr: "Oğlana gelince, anne babası mümin kimselerdi",
      zh: "至于那个男孩，他的父母是信士",
      sw: "Na kijana huyo, wazazi wake walikuwa waumini",
      so: "Wiilkii, waalidkiisa mu'miniin bay ahaayeen",
      bs: "A što se dječaka tiče, roditelji su mu bili vjernici",
      sq: "Sa për djalin, prindërit e tij ishin besimtarë",
      ru: "Что касается мальчика, его родители были верующими",
      ur: "اور جہاں تک لڑکے کا تعلق ہے اس کے والدین مومن تھے",
      bn: "আর ছেলেটির বিষয়, তার পিতামাতা ছিল মুমিন",
      ms: "Adapun anak muda itu, kedua ibu bapanya adalah orang beriman",
      fr: "And as for the boy, his parents were believers", sus: "And as for the boy, his parents were believers"
    },
    surahAyah: "الكهف:80", ayahNumber: 80,
    hint: "ذكر صغير السن",
    correctVerse: "وَأَمَّا الْغُلَامُ فَكَانَ أَبَوَاهُ مُؤْمِنَيْنِ",
    correctVerseMeaning: "And as for the boy, his parents were believers",
    options: [
      { text: "وَأَمَّا", isCorrect: false },
      { text: "الْغُلَامُ", isCorrect: true },
      { text: "أَبَوَاهُ", isCorrect: false },
      { text: "مُؤْمِنَيْنِ", isCorrect: false },
    ],
  },
  {
    id: "v23", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْجِدَارَ",
    targetWordMeaning: "The Wall",
    targetWordTranslations: {
      en: "The Wall", ar: "الحائط / السور", id: "Dinding", tr: "Duvar", zh: "墙壁",
      sw: "Ukuta", so: "Derbiga", bs: "Zid", sq: "Muri", ru: "Стена",
      ur: "دیوار", bn: "দেয়াল", ms: "Dinding",
      fr: "Le Mur", sus: "Mamboli"
    },
    correctVerseMeaningTranslations: {
      en: "And as for the wall, it belonged to two orphan boys in the city",
      ar: "وأما الجدار فكان لغلامين يتيمين في المدينة",
      id: "Adapun dinding itu adalah milik dua anak yatim di kota itu",
      tr: "Duvara gelince, şehirde iki yetim çocuğundu",
      zh: "至于那堵墙，它属于城里的两个孤儿",
      sw: "Na ukuta ule, ulikuwa wa vijana wawili yatima katika mji",
      so: "Derbigii, wuxuu ahaa laba wiil agooman ah oo magaalada ku noolaa",
      bs: "A zid je pripadao dvojici siročadi u gradu",
      sq: "Sa për murin, ai ishte i dy djemve jetimë në qytet",
      ru: "Что касается стены, она принадлежала двум мальчикам-сиротам в городе",
      ur: "اور جہاں تک دیوار کا تعلق ہے وہ شہر کے دو یتیم لڑکوں کی تھی",
      bn: "আর দেয়ালটি ছিল শহরের দুই এতিম ছেলের",
      ms: "Adapun dinding itu adalah kepunyaan dua anak yatim di bandar itu",
      fr: "And as for the wall, it belonged to two orphan boys in the city", sus: "And as for the wall, it belonged to two orphan boys in the city"
    },
    surahAyah: "الكهف:82", ayahNumber: 82,
    hint: "بناء عمودي يحمي أو يفصل",
    correctVerse: "وَأَمَّا الْجِدَارُ فَكَانَ لِغُلَامَيْنِ يَتِيمَيْنِ فِي الْمَدِينَةِ",
    correctVerseMeaning: "And as for the wall, it belonged to two orphan boys in the city",
    options: [
      { text: "وَأَمَّا", isCorrect: false },
      { text: "الْجِدَارُ", isCorrect: true },
      { text: "لِغُلَامَيْنِ", isCorrect: false },
      { text: "الْمَدِينَةِ", isCorrect: false },
    ],
  },
  {
    id: "v24", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "مَشْرِقَ",
    targetWordMeaning: "East / Sunrise",
    targetWordTranslations: {
      en: "East / Sunrise", ar: "مكان شروق الشمس", id: "Timur / Terbit", tr: "Doğu", zh: "东方",
      sw: "Mashariki", so: "Bari", bs: "Istok", sq: "Lindje", ru: "Восток",
      ur: "مشرق", bn: "পূর্ব দিক", ms: "Timur",
      fr: "Est / Lever du soleil", sus: "Tɛlɛnde Tima"
    },
    correctVerseMeaningTranslations: {
      en: "Until when he reached the rising of the sun",
      ar: "حتى إذا بلغ مطلع الشمس",
      id: "Hingga apabila dia telah sampai ke tempat terbit matahari",
      tr: "Güneşin doğduğu yere ulaşınca",
      zh: "直到他到达日出之地",
      sw: "Hata alipofika mahali pa kuchomozea jua",
      so: "Ilaa uu gaaray meesha qorraxdu ka soo baxdo",
      bs: "Sve dok nije stigao do mjesta gdje izlazi sunce",
      sq: "Derisa kur arriti në lindjen e diellit",
      ru: "Пока не достиг места восхода солнца",
      ur: "یہاں تک کہ جب وہ سورج کے طلوع ہونے کی جگہ پہنچا",
      bn: "অবশেষে যখন সে সূর্যোদয়ের স্থানে পৌঁছলো",
      ms: "Sehingga apabila dia sampai ke tempat terbit matahari",
      fr: "Until when he reached the rising of the sun", sus: "Until when he reached the rising of the sun"
    },
    surahAyah: "الكهف:90", ayahNumber: 90,
    hint: "الاتجاه الذي تطلع منه الشمس",
    correctVerse: "حَتَّى إِذَا بَلَغَ مَطْلِعَ الشَّمْسِ",
    correctVerseMeaning: "Until when he reached the rising of the sun",
    options: [
      { text: "حَتَّى", isCorrect: false },
      { text: "بَلَغَ", isCorrect: false },
      { text: "مَطْلِعَ", isCorrect: true },
      { text: "الشَّمْسِ", isCorrect: false },
    ],
  },
  {
    id: "v25", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "سَدًّا",
    targetWordMeaning: "A Barrier / A Dam",
    targetWordTranslations: {
      en: "A Barrier", ar: "حاجز / سد", id: "Penghalang", tr: "Set / Engel", zh: "屏障",
      sw: "Kizuizi", so: "Xaajis", bs: "Brana / Pregrada", sq: "Pengesë", ru: "Преграда",
      ur: "بند / رکاوٹ", bn: "বাঁধ / প্রতিবন্ধক", ms: "Penghalang",
      fr: "Une Barrière / Barrage", sus: "Xali"
    },
    correctVerseMeaningTranslations: {
      en: "Shall we pay you tribute so that you build a barrier between us and them?",
      ar: "هل نجعل لك خرجاً على أن تجعل بيننا وبينهم سداً؟",
      id: "Bolehkah kami memberikan bayaran kepadamu agar engkau membuat penghalang antara kami dan mereka?",
      tr: "Sana bir vergi verelim de bizimle onlar arasına bir set yapasın mı?",
      zh: "我们向你缴纳贡金，你在我们和他们之间筑一道屏障好吗？",
      sw: "Tukupe kodi ili ujenge kizuizi kati yetu na wao?",
      so: "Ma kuu bixinno canshuur si aad u dhex dhigto naga nala dhexeeya xaajis?",
      bs: "Hoćemo li ti dati danak da napraviš između nas i njih pregradu?",
      sq: "A t'japim tatim që të ndërtosh një pengesë mes nesh dhe tyre?",
      ru: "Не установить ли тебе вознаграждение за то, что ты воздвигнешь преграду между нами и ними?",
      ur: "کیا ہم آپ کو خراج دیں تاکہ آپ ہمارے اور ان کے درمیان ایک بند بنا دیں؟",
      bn: "আমরা কি আপনাকে কর দেব যাতে আপনি আমাদের ও তাদের মধ্যে এক প্রতিবন্ধক তৈরি করেন?",
      ms: "Bolehkah kami memberikan bayaran kepadamu supaya engkau membina penghalang antara kami dengan mereka?",
      fr: "Shall we pay you tribute so that you build a barrier between us and them?", sus: "Shall we pay you tribute so that you build a barrier between us and them?"
    },
    surahAyah: "الكهف:94", ayahNumber: 94,
    hint: "بناء يمنع المرور",
    correctVerse: "فَهَلْ نَجْعَلُ لَكَ خَرْجًا عَلَى أَن تَجْعَلَ بَيْنَنَا وَبَيْنَهُمْ سَدًّا",
    correctVerseMeaning: "Shall we pay you tribute so that you build a barrier between us and them?",
    options: [
      { text: "نَجْعَلُ", isCorrect: false },
      { text: "خَرْجًا", isCorrect: false },
      { text: "بَيْنَنَا", isCorrect: false },
      { text: "سَدًّا", isCorrect: true },
    ],
  },
  {
    id: "v26", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "الْحَدِيدِ",
    targetWordMeaning: "Iron",
    targetWordTranslations: {
      en: "Iron", ar: "الحديد (المعدن)", id: "Besi", tr: "Demir", zh: "铁",
      sw: "Chuma", so: "Birta", bs: "Željezo", sq: "Hekuri", ru: "Железо",
      ur: "لوہا", bn: "লোহা", ms: "Besi",
      fr: "Fer", sus: "Tɔrɔnfɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Bring me blocks of iron",
      ar: "آتوني قطع الحديد",
      id: "Berikanlah kepadaku potongan-potongan besi",
      tr: "Bana demir kütleleri getirin",
      zh: "给我拿铁块来",
      sw: "Nileteni vipande vya chuma",
      so: "I keena goobo bir ah",
      bs: "Donesite mi komade željeza",
      sq: "Sillmëni copa hekuri",
      ru: "Принесите мне куски железа",
      ur: "مجھے لوہے کے ٹکڑے لا کر دو",
      bn: "আমাকে লোহার টুকরো এনে দাও",
      ms: "Berikanlah kepadaku ketulan-ketulan besi",
      fr: "Bring me blocks of iron", sus: "Bring me blocks of iron"
    },
    surahAyah: "الكهف:96", ayahNumber: 96,
    hint: "معدن قوي يُستخدم في البناء",
    correctVerse: "آتُونِي زُبَرَ الْحَدِيدِ",
    correctVerseMeaning: "Bring me blocks of iron",
    options: [
      { text: "آتُونِي", isCorrect: false },
      { text: "زُبَرَ", isCorrect: false },
      { text: "الْحَدِيدِ", isCorrect: true },
      { text: "بَيْنَ", isCorrect: false },
    ],
  },
  {
    id: "v27", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "قِطْرًا",
    targetWordMeaning: "Molten Copper",
    targetWordTranslations: {
      en: "Molten Copper", ar: "النحاس المذاب", id: "Tembaga cair", tr: "Erimiş bakır", zh: "熔化的铜",
      sw: "Shaba iliyoyeyuka", so: "Naxaas dhalaalay", bs: "Rastopljeni bakar", sq: "Bakër i shkrirë", ru: "Расплавленная медь",
      ur: "پگھلا ہوا تانبا", bn: "গলিত তামা", ms: "Tembaga cair",
      fr: "Cuivre fondu", sus: "Kɔpɛrɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Bring me molten copper to pour over it",
      ar: "آتوني أفرغ عليه نحاساً مذاباً",
      id: "Berikanlah kepadaku tembaga cair agar aku tuangkan ke atasnya",
      tr: "Bana erimiş bakır getirin de üzerine dökeyim",
      zh: "给我拿来熔铜，我好浇上去",
      sw: "Nileteni shaba iliyoyeyuka ili nimwage juu yake",
      so: "I keena naxaas dhalaalay aan ku shubo",
      bs: "Donesite mi rastopljeni bakar da ga izlijem po njemu",
      sq: "Sillmëni bakër të shkrirë ta hedh mbi të",
      ru: "Принесите мне расплавленную медь, чтобы я залил ею",
      ur: "مجھے پگھلا ہوا تانبا لا دو تاکہ میں اس پر ڈالوں",
      bn: "আমাকে গলিত তামা এনে দাও যেন আমি তার উপর ঢালি",
      ms: "Bawalah kepadaku tembaga cair supaya aku tuangkan ke atasnya",
      fr: "Apportez-moi du cuivre fondu pour le verser dessus", sus: "Kɔpɛrɛ sɔtɔ wa yi a xun"
    },
    surahAyah: "الكهف:96", ayahNumber: 96,
    hint: "معدن مذاب يُسكب",
    correctVerse: "آتُونِي أُفْرِغْ عَلَيْهِ قِطْرًا",
    correctVerseMeaning: "Bring me molten copper to pour over it",
    options: [
      { text: "آتُونِي", isCorrect: false },
      { text: "أُفْرِغْ", isCorrect: false },
      { text: "عَلَيْهِ", isCorrect: false },
      { text: "قِطْرًا", isCorrect: true },
    ],
  },
  {
    id: "v28", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "مِدَادًا",
    targetWordMeaning: "Ink / Supply",
    targetWordTranslations: {
      en: "Ink / Supply", ar: "حبر / مداد", id: "Tinta", tr: "Mürekkep", zh: "墨水",
      sw: "Wino", so: "Khad", bs: "Tinta", sq: "Bojë", ru: "Чернила",
      ur: "روشنائی", bn: "কালি", ms: "Dakwat",
      fr: "Encre / Provision", sus: "Sɛbɛ Kolon"
    },
    correctVerseMeaningTranslations: {
      en: "Say: If the sea were ink for the words of my Lord",
      ar: "قل لو كان البحر مداداً لكلمات ربي",
      id: "Katakanlah: Sekiranya lautan menjadi tinta untuk menulis kalimat-kalimat Tuhanku",
      tr: "De ki: Rabbimin sözleri için deniz mürekkep olsaydı",
      zh: "你说：如果大海变成墨水来记录我主的话语",
      sw: "Sema: Lau bahari ingekuwa wino kwa maneno ya Mola wangu",
      so: "Dheh: Haddii baddu noqoto khad erayada Rabbigay",
      bs: "Reci: Kad bi more bilo tinta za riječi Gospodara moga",
      sq: "Thuaj: Sikur deti të ishte bojë për fjalët e Zotit tim",
      ru: "Скажи: Если бы море стало чернилами для слов Господа моего",
      ur: "کہو: اگر سمندر میرے رب کے کلمات کے لیے روشنائی ہو",
      bn: "বলো: আমার প্রভুর কথা লেখার জন্য যদি সমুদ্র কালি হয়",
      ms: "Katakanlah: Sekiranya lautan menjadi dakwat untuk menulis kalimah-kalimah Tuhanku",
      fr: "Say: If the sea were ink for the words of my Lord", sus: "Say: If the sea were ink for the words of my Lord"
    },
    surahAyah: "الكهف:109", ayahNumber: 109,
    hint: "سائل يُكتب به",
    correctVerse: "قُل لَّوْ كَانَ الْبَحْرُ مِدَادًا لِّكَلِمَاتِ رَبِّي",
    correctVerseMeaning: "Say: If the sea were ink for the words of my Lord",
    options: [
      { text: "الْبَحْرُ", isCorrect: false },
      { text: "مِدَادًا", isCorrect: true },
      { text: "لِّكَلِمَاتِ", isCorrect: false },
      { text: "رَبِّي", isCorrect: false },
    ],
  },
  {
    id: "v29", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "يُشْرِكْ",
    targetWordMeaning: "Associate partners (with Allah)",
    targetWordTranslations: {
      en: "Associate partners", ar: "يُشرك (يعبد غير الله)", id: "Menyekutukan", tr: "Ortak koşmak", zh: "举伴",
      sw: "Kushirikisha", so: "La wadaajin", bs: "Pridruživati", sq: "Shoqërojë", ru: "Придавать сотоварища",
      ur: "شریک ٹھہرانا", bn: "শরীক করা", ms: "Menyekutukan",
      fr: "Associer des partenaires (à Allah)", sus: "Ala Ra Dunbu"
    },
    correctVerseMeaningTranslations: {
      en: "And let him not associate in the worship of his Lord anyone",
      ar: "ولا يُشرك بعبادة ربه أحداً",
      id: "Dan janganlah dia mempersekutukan seorang pun dalam beribadah kepada Tuhannya",
      tr: "Ve Rabbine ibadette hiç kimseyi ortak koşmasın",
      zh: "不要以任何人与他的主共同崇拜",
      sw: "Na asimshirikishe yeyote katika ibada ya Mola wake",
      so: "Oo ha la wadaajin cibaadada Rabbigi cidna",
      bs: "I neka u ibadetu Gospodaru svome ne pridružuje nikoga",
      sq: "Dhe le të mos shoqërojë askënd në adhurimin e Zotit të vet",
      ru: "И пусть не придаёт в поклонении Господу своему никого",
      ur: "اور اپنے رب کی عبادت میں کسی کو شریک نہ ٹھہرائے",
      bn: "এবং তার প্রভুর ইবাদতে কাউকে শরীক না করুক",
      ms: "Dan janganlah dia mempersekutukan sesiapa pun dalam ibadat kepada Tuhannya",
      fr: "And let him not associate in the worship of his Lord anyone", sus: "And let him not associate in the worship of his Lord anyone"
    },
    surahAyah: "الكهف:110", ayahNumber: 110,
    hint: "عبادة غير الله مع الله",
    correctVerse: "وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِ أَحَدًا",
    correctVerseMeaning: "And let him not associate in the worship of his Lord anyone",
    options: [
      { text: "وَلَا", isCorrect: false },
      { text: "يُشْرِكْ", isCorrect: true },
      { text: "بِعِبَادَةِ", isCorrect: false },
      { text: "أَحَدًا", isCorrect: false },
    ],
  },
  {
    id: "v30", surahAr: "الكهف", surahEn: "Al-Kahf",
    targetWord: "لِقَاءَ",
    targetWordMeaning: "Meeting / Encounter",
    targetWordTranslations: {
      en: "Meeting", ar: "الملاقاة واللقاء", id: "Pertemuan", tr: "Buluşma / Kavuşma", zh: "相遇",
      sw: "Kukutana", so: "Kulanka", bs: "Susret", sq: "Takimi", ru: "Встреча",
      ur: "ملاقات", bn: "সাক্ষাৎ", ms: "Pertemuan",
      fr: "Rencontre / Rendez-vous", sus: "Ɲaxɛlɛ"
    },
    correctVerseMeaningTranslations: {
      en: "So whoever hopes for the meeting with his Lord",
      ar: "فمن كان يرجو لقاء ربه",
      id: "Maka barangsiapa yang mengharapkan perjumpaan dengan Tuhannya",
      tr: "Kim Rabbine kavuşmayı umuyorsa",
      zh: "谁希望与他的主相会",
      sw: "Basi yeyote anayetarajia kukutana na Mola wake",
      so: "Cidna oo rajeeya inuu la kulmo Rabbigi",
      bs: "Pa ko se nada susretu sa Gospodarom svojim",
      sq: "Kush shpreson takimin me Zotin e vet",
      ru: "Кто надеется на встречу со своим Господом",
      ur: "پس جو اپنے رب سے ملاقات کی امید رکھتا ہے",
      bn: "অতএব যে তার প্রভুর সাক্ষাতের আশা করে",
      ms: "Maka sesiapa yang mengharapkan pertemuan dengan Tuhannya",
      fr: "So whoever hopes for the meeting with his Lord", sus: "So whoever hopes for the meeting with his Lord"
    },
    surahAyah: "الكهف:110", ayahNumber: 110,
    hint: "تعني المقابلة والوصول",
    correctVerse: "فَمَن كَانَ يَرْجُو لِقَاءَ رَبِّهِ",
    correctVerseMeaning: "So whoever hopes for the meeting with his Lord",
    options: [
      { text: "فَمَن", isCorrect: false },
      { text: "يَرْجُو", isCorrect: false },
      { text: "لِقَاءَ", isCorrect: true },
      { text: "رَبِّهِ", isCorrect: false },
    ],
  },
  // ===================== AL-FATIHA (v31–v54) =====================
  {
    id: "v31", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "بِسْمِ",
    targetWordMeaning: "In the name",
    targetWordTranslations: {
      en: "In the name", ar: "باسم", id: "Dengan nama", tr: "Adıyla", zh: "以…之名",
      sw: "Kwa jina", so: "Magaca", bs: "U ime", sq: "Me emrin", ru: "Во имя",
      ur: "نام سے", bn: "নামে", ms: "Dengan nama",
      fr: "Au nom de", sus: "Xi Ra"
    },
    correctVerseMeaningTranslations: {
      en: "In the name of Allah, the Most Gracious, the Most Merciful",
      ar: "بسم الله الرحمن الرحيم",
      id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
      tr: "Rahman ve Rahim olan Allah'ın adıyla",
      zh: "奉至仁至慈的安拉之名",
      sw: "Kwa jina la Mwenyezi Mungu, Mwingi wa rehema, Mwenye kurehemu",
      so: "Magaca Eebe, Naxariis badan, Naxariis leh",
      bs: "U ime Allaha, Milostivog, Samilosnog",
      sq: "Me emrin e Allahut, të Gjithëmëshirshmit, Mëshirëplotit",
      ru: "Во имя Аллаха Милостивого Милосердного",
      ur: "اللہ کے نام سے جو بڑا مہربان اور رحم کرنے والا ہے",
      bn: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে",
      ms: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani",
      fr: "Au nom d'Allah, le Très Miséricordieux, le Miséricordieux", sus: "Ala xi ra, Naxari Belebele, Naxariden"
    },
    surahAyah: "الفاتحة:1", ayahNumber: 1,
    hint: "الكلمة الأولى في الفاتحة والقرآن كله",
    correctVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    correctVerseMeaning: "In the name of Allah, the Most Gracious, the Most Merciful",
    options: [
      { text: "اللَّهِ", isCorrect: false },
      { text: "الرَّحْمَٰنِ", isCorrect: false },
      { text: "بِسْمِ", isCorrect: true },
      { text: "الرَّحِيمِ", isCorrect: false },
    ],
  },
  {
    id: "v32", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الرَّحْمَٰنِ",
    targetWordMeaning: "The Most Gracious",
    targetWordTranslations: {
      en: "The Most Gracious", ar: "الرحمن (واسع الرحمة)", id: "Yang Maha Pengasih", tr: "Rahman (çok merhametli)", zh: "至仁的",
      sw: "Mwingi wa rehema", so: "Naxariis badan", bs: "Samilosni", sq: "Gjithëmëshirshmi", ru: "Милостивый",
      ur: "بہت رحم کرنے والا", bn: "পরম করুণাময়", ms: "Yang Maha Pemurah",
      fr: "Le Très Miséricordieux", sus: "Naxari Belebele"
    },
    correctVerseMeaningTranslations: {
      en: "In the name of Allah, the Most Gracious, the Most Merciful",
      ar: "بسم الله الرحمن الرحيم",
      id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
      tr: "Rahman ve Rahim olan Allah'ın adıyla",
      zh: "奉至仁至慈的安拉之名",
      sw: "Kwa jina la Mwenyezi Mungu, Mwingi wa rehema, Mwenye kurehemu",
      so: "Magaca Eebe, Naxariis badan, Naxariis leh",
      bs: "U ime Allaha, Milostivog, Samilosnog",
      sq: "Me emrin e Allahut, të Gjithëmëshirshmit, Mëshirëplotit",
      ru: "Во имя Аллаха Милостивого Милосердного",
      ur: "اللہ کے نام سے جو بڑا مہربان اور رحم کرنے والا ہے",
      bn: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে",
      ms: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani",
      fr: "Au nom d'Allah, le Très Miséricordieux, le Miséricordieux", sus: "Ala xi ra, Naxari Belebele, Naxariden"
    },
    surahAyah: "الفاتحة:1", ayahNumber: 1,
    hint: "صفة الله الأولى، تعني رحمته الواسعة لجميع الخلق",
    correctVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    correctVerseMeaning: "In the name of Allah, the Most Gracious, the Most Merciful",
    options: [
      { text: "بِسْمِ", isCorrect: false },
      { text: "الرَّحْمَٰنِ", isCorrect: true },
      { text: "الرَّحِيمِ", isCorrect: false },
      { text: "اللَّهِ", isCorrect: false },
    ],
  },
  {
    id: "v33", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الرَّحِيمِ",
    targetWordMeaning: "The Most Merciful",
    targetWordTranslations: {
      en: "The Most Merciful", ar: "الرحيم (دائم الرحمة)", id: "Yang Maha Penyayang", tr: "Rahim (daima merhametli)", zh: "至慈的",
      sw: "Mwenye kurehemu", so: "Naxariis leh", bs: "Milostivi", sq: "Mëshirëploti", ru: "Милосердный",
      ur: "بار بار رحم کرنے والا", bn: "অসীম দয়ালু", ms: "Yang Maha Mengasihani",
      fr: "Le Miséricordieux", sus: "Naxariden"
    },
    correctVerseMeaningTranslations: {
      en: "In the name of Allah, the Most Gracious, the Most Merciful",
      ar: "بسم الله الرحمن الرحيم",
      id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
      tr: "Rahman ve Rahim olan Allah'ın adıyla",
      zh: "奉至仁至慈的安拉之名",
      sw: "Kwa jina la Mwenyezi Mungu, Mwingi wa rehema, Mwenye kurehemu",
      so: "Magaca Eebe, Naxariis badan, Naxariis leh",
      bs: "U ime Allaha, Milostivog, Samilosnog",
      sq: "Me emrin e Allahut, të Gjithëmëshirshmit, Mëshirëplotit",
      ru: "Во имя Аллаха Милостивого Милосердного",
      ur: "اللہ کے نام سے جو بڑا مہربان اور رحم کرنے والا ہے",
      bn: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে",
      ms: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani",
      fr: "Au nom d'Allah, le Très Miséricordieux, le Miséricordieux", sus: "Ala xi ra, Naxari Belebele, Naxariden"
    },
    surahAyah: "الفاتحة:1", ayahNumber: 1,
    hint: "صفة الله الثانية، رحمة خاصة بالمؤمنين",
    correctVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    correctVerseMeaning: "In the name of Allah, the Most Gracious, the Most Merciful",
    options: [
      { text: "الرَّحْمَٰنِ", isCorrect: false },
      { text: "بِسْمِ", isCorrect: false },
      { text: "اللَّهِ", isCorrect: false },
      { text: "الرَّحِيمِ", isCorrect: true },
    ],
  },
  {
    id: "v34", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الْحَمْدُ",
    targetWordMeaning: "All praise",
    targetWordTranslations: {
      en: "All praise", ar: "الحمد والثناء", id: "Segala puji", tr: "Hamd / Övgü", zh: "一切赞美",
      sw: "Sifa zote", so: "Mahad dhan", bs: "Sva hvala", sq: "Gjithë lavdërimet", ru: "Вся хвала",
      ur: "تمام تعریف", bn: "সমস্ত প্রশংসা", ms: "Segala puji",
      fr: "Toute louange", sus: "Tanbi Birin"
    },
    correctVerseMeaningTranslations: {
      en: "All praise is due to Allah, Lord of all the worlds",
      ar: "الحمد لله رب العالمين",
      id: "Segala puji bagi Allah, Tuhan semesta alam",
      tr: "Hamd, âlemlerin Rabbi Allah'a mahsustur",
      zh: "一切赞美归于安拉，全世界的主",
      sw: "Sifa zote ni za Mwenyezi Mungu, Mola wa walimwengu wote",
      so: "Mahad dhan waxay u taallaa Eebe, Rabbiga caalamka",
      bs: "Hvala Allahu, Gospodaru svih svjetova",
      sq: "Gjithë lavdërimet i takojnë Allahut, Zotit të gjithë botëve",
      ru: "Хвала Аллаху, Господу миров",
      ur: "تمام تعریف اللہ کے لیے ہے جو سارے جہانوں کا رب ہے",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি সমস্ত জগতের প্রতিপালক",
      ms: "Segala puji tertentu bagi Allah, Tuhan yang memelihara sekalian alam",
      fr: "All praise is due to Allah, Lord of all the worlds", sus: "All praise is due to Allah, Lord of all the worlds"
    },
    surahAyah: "الفاتحة:2", ayahNumber: 2,
    hint: "أول كلمة في الآية الثانية، عكسها الذم",
    correctVerse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    correctVerseMeaning: "All praise is due to Allah, Lord of all the worlds",
    options: [
      { text: "لِلَّهِ", isCorrect: false },
      { text: "الْحَمْدُ", isCorrect: true },
      { text: "رَبِّ", isCorrect: false },
      { text: "الْعَالَمِينَ", isCorrect: false },
    ],
  },
  {
    id: "v35", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "رَبِّ",
    targetWordMeaning: "Lord / Master",
    targetWordTranslations: {
      en: "Lord / Master", ar: "الرب والسيد", id: "Tuhan / Pemilik", tr: "Rab / Sahip", zh: "主宰",
      sw: "Mola / Bwana", so: "Rabbiga", bs: "Gospodar", sq: "Zot / Krijues", ru: "Господь",
      ur: "رب / پروردگار", bn: "প্রতিপালক / প্রভু", ms: "Tuhan / Pemilik",
      fr: "Seigneur / Maître", sus: "Kɔlɔnyi"
    },
    correctVerseMeaningTranslations: {
      en: "All praise is due to Allah, Lord of all the worlds",
      ar: "الحمد لله رب العالمين",
      id: "Segala puji bagi Allah, Tuhan semesta alam",
      tr: "Hamd, âlemlerin Rabbi Allah'a mahsustur",
      zh: "一切赞美归于安拉，全世界的主",
      sw: "Sifa zote ni za Mwenyezi Mungu, Mola wa walimwengu wote",
      so: "Mahad dhan waxay u taallaa Eebe, Rabbiga caalamka",
      bs: "Hvala Allahu, Gospodaru svih svjetova",
      sq: "Gjithë lavdërimet i takojnë Allahut, Zotit të gjithë botëve",
      ru: "Хвала Аллаху, Господу миров",
      ur: "تمام تعریف اللہ کے لیے ہے جو سارے جہانوں کا رب ہے",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি সমস্ত জগতের প্রতিপালক",
      ms: "Segala puji tertentu bagi Allah, Tuhan yang memelihara sekalian alam",
      fr: "All praise is due to Allah, Lord of all the worlds", sus: "All praise is due to Allah, Lord of all the worlds"
    },
    surahAyah: "الفاتحة:2", ayahNumber: 2,
    hint: "يعني المالك والمربي، الكلمة تبدأ بحرف الـ ر...",
    correctVerse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    correctVerseMeaning: "All praise is due to Allah, Lord of all the worlds",
    options: [
      { text: "الْحَمْدُ", isCorrect: false },
      { text: "الْعَالَمِينَ", isCorrect: false },
      { text: "رَبِّ", isCorrect: true },
      { text: "لِلَّهِ", isCorrect: false },
    ],
  },
  {
    id: "v36", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الْعَالَمِينَ",
    targetWordMeaning: "The worlds / All of creation",
    targetWordTranslations: {
      en: "The worlds / All of creation", ar: "العوالم كلها", id: "Semesta alam", tr: "Âlemler / Tüm varlıklar", zh: "众世界",
      sw: "Walimwengu wote", so: "Caalamka oo dhan", bs: "Svi svjetovi", sq: "Gjithë botët", ru: "Миры / Все творения",
      ur: "تمام جہان", bn: "সমস্ত জগৎ", ms: "Sekalian alam",
      fr: "Les mondes / Toute la création", sus: "Dunia Birin"
    },
    correctVerseMeaningTranslations: {
      en: "All praise is due to Allah, Lord of all the worlds",
      ar: "الحمد لله رب العالمين",
      id: "Segala puji bagi Allah, Tuhan semesta alam",
      tr: "Hamd, âlemlerin Rabbi Allah'a mahsustur",
      zh: "一切赞美归于安拉，全世界的主",
      sw: "Sifa zote ni za Mwenyezi Mungu, Mola wa walimwengu wote",
      so: "Mahad dhan waxay u taallaa Eebe, Rabbiga caalamka",
      bs: "Hvala Allahu, Gospodaru svih svjetova",
      sq: "Gjithë lavdërimet i takojnë Allahut, Zotit të gjithë botëve",
      ru: "Хвала Аллаху, Господу миров",
      ur: "تمام تعریف اللہ کے لیے ہے جو سارے جہانوں کا رب ہے",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি সমস্ত জগতের প্রতিপালক",
      ms: "Segala puji tertentu bagi Allah, Tuhan yang memelihara sekalian alam",
      fr: "All praise is due to Allah, Lord of all the worlds", sus: "All praise is due to Allah, Lord of all the worlds"
    },
    surahAyah: "الفاتحة:2", ayahNumber: 2,
    hint: "آخر كلمة في الآية الثانية، تشمل البشر والجن والملائكة والكون",
    correctVerse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    correctVerseMeaning: "All praise is due to Allah, Lord of all the worlds",
    options: [
      { text: "الْحَمْدُ", isCorrect: false },
      { text: "رَبِّ", isCorrect: false },
      { text: "لِلَّهِ", isCorrect: false },
      { text: "الْعَالَمِينَ", isCorrect: true },
    ],
  },
  {
    id: "v37", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "مَالِكِ",
    targetWordMeaning: "King / Master / Owner",
    targetWordTranslations: {
      en: "King / Master", ar: "المالك والملك", id: "Raja / Pemilik", tr: "Malik / Sahip", zh: "主宰 / 王",
      sw: "Mfalme / Mmiliki", so: "Boqorka", bs: "Vladar / Vlasnik", sq: "Sundimtar / Zotërues", ru: "Владыка / Царь",
      ur: "مالک / بادشاہ", bn: "মালিক / রাজা", ms: "Raja / Pemilik",
      fr: "Roi / Maître / Propriétaire", sus: "Mansa"
    },
    correctVerseMeaningTranslations: {
      en: "Master of the Day of Judgment",
      ar: "مالك يوم الدين",
      id: "Pemilik hari pembalasan",
      tr: "Din gününün sahibi",
      zh: "报应日的主宰",
      sw: "Mwenye kumiliki siku ya malipo",
      so: "Mulkiga maalinta xisaabta",
      bs: "Vladaru Dana suđenja",
      sq: "Zotëruesi i Ditës së Gjykimit",
      ru: "Властелин Дня воздаяния",
      ur: "روز جزا کے مالک",
      bn: "বিচার দিনের মালিক",
      ms: "Yang menguasai hari pembalasan",
      fr: "Maître du Jour du Jugement", sus: "Hɔrɔ Lɔxɔ Mansa"
    },
    surahAyah: "الفاتحة:4", ayahNumber: 4,
    hint: "الكلمة تبدأ بحرف الـ م، وتعني صاحب الملك والسلطة",
    correctVerse: "مَالِكِ يَوْمِ الدِّينِ",
    correctVerseMeaning: "Master of the Day of Judgment",
    options: [
      { text: "يَوْمِ", isCorrect: false },
      { text: "الدِّينِ", isCorrect: false },
      { text: "مَالِكِ", isCorrect: true },
      { text: "الرَّحِيمِ", isCorrect: false },
    ],
  },
  {
    id: "v38", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "يَوْمِ",
    targetWordMeaning: "Day",
    targetWordTranslations: {
      en: "Day", ar: "اليوم", id: "Hari", tr: "Gün", zh: "日 / 天",
      sw: "Siku", so: "Maalinta", bs: "Dan", sq: "Ditë", ru: "День",
      ur: "دن", bn: "দিন", ms: "Hari",
      fr: "Jour", sus: "Lɔxɔ"
    },
    correctVerseMeaningTranslations: {
      en: "Master of the Day of Judgment",
      ar: "مالك يوم الدين",
      id: "Pemilik hari pembalasan",
      tr: "Din gününün sahibi",
      zh: "报应日的主宰",
      sw: "Mwenye kumiliki siku ya malipo",
      so: "Mulkiga maalinta xisaabta",
      bs: "Vladaru Dana suđenja",
      sq: "Zotëruesi i Ditës së Gjykimit",
      ru: "Властелин Дня воздаяния",
      ur: "روز جزا کے مالک",
      bn: "বিচার দিনের মালিক",
      ms: "Yang menguasai hari pembalasan",
      fr: "Maître du Jour du Jugement", sus: "Hɔrɔ Lɔxɔ Mansa"
    },
    surahAyah: "الفاتحة:4", ayahNumber: 4,
    hint: "الكلمة الثانية في الآية الرابعة، ضد الليل",
    correctVerse: "مَالِكِ يَوْمِ الدِّينِ",
    correctVerseMeaning: "Master of the Day of Judgment",
    options: [
      { text: "مَالِكِ", isCorrect: false },
      { text: "يَوْمِ", isCorrect: true },
      { text: "الدِّينِ", isCorrect: false },
      { text: "الرَّحْمَٰنِ", isCorrect: false },
    ],
  },
  {
    id: "v39", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الدِّينِ",
    targetWordMeaning: "Judgment / Religion",
    targetWordTranslations: {
      en: "Judgment / Religion", ar: "الجزاء والدين", id: "Pembalasan / Agama", tr: "Hesap / Din", zh: "报应 / 宗教",
      sw: "Hukumu / Dini", so: "Xisaabta / Diinta", bs: "Sud / Vjera", sq: "Gjykimi / Feja", ru: "Суд / Воздаяние",
      ur: "جزا / دین", bn: "বিচার / ধর্ম", ms: "Pembalasan / Agama",
      fr: "Jugement / Religion", sus: "Hɔrɔ Lɔxɔ"
    },
    correctVerseMeaningTranslations: {
      en: "Master of the Day of Judgment",
      ar: "مالك يوم الدين",
      id: "Pemilik hari pembalasan",
      tr: "Din gününün sahibi",
      zh: "报应日的主宰",
      sw: "Mwenye kumiliki siku ya malipo",
      so: "Mulkiga maalinta xisaabta",
      bs: "Vladaru Dana suđenja",
      sq: "Zotëruesi i Ditës së Gjykimit",
      ru: "Властелин Дня воздаяния",
      ur: "روز جزا کے مالک",
      bn: "বিচার দিনের মালিক",
      ms: "Yang menguasai hari pembalasan",
      fr: "Maître du Jour du Jugement", sus: "Hɔrɔ Lɔxɔ Mansa"
    },
    surahAyah: "الفاتحة:4", ayahNumber: 4,
    hint: "آخر كلمة في الآية الرابعة، تعني يوم الحساب والجزاء",
    correctVerse: "مَالِكِ يَوْمِ الدِّينِ",
    correctVerseMeaning: "Master of the Day of Judgment",
    options: [
      { text: "مَالِكِ", isCorrect: false },
      { text: "يَوْمِ", isCorrect: false },
      { text: "الدِّينِ", isCorrect: true },
      { text: "الرَّحِيمِ", isCorrect: false },
    ],
  },
  {
    id: "v40", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "إِيَّاكَ",
    targetWordMeaning: "You alone",
    targetWordTranslations: {
      en: "You alone / Only You", ar: "إياك وحدك (للتخصيص)", id: "Hanya Engkau", tr: "Yalnızca Seni", zh: "唯有你",
      sw: "Wewe peke yako", so: "Adiga keliya", bs: "Samo Tebe", sq: "Vetëm Ty", ru: "Тебя одного",
      ur: "صرف تجھی کو", bn: "শুধু তোমাকেই", ms: "Hanya Engkau",
      fr: "Toi seul / Toi uniquement", sus: "I Kelen"
    },
    correctVerseMeaningTranslations: {
      en: "You alone we worship and You alone we ask for help",
      ar: "إياك نعبد وإياك نستعين",
      id: "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan",
      tr: "Yalnız Sana ibadet eder, yalnız Senden yardım dileriz",
      zh: "我们只崇拜你，只向你求助",
      sw: "Wewe peke yako tunaabudu na Wewe peke yako tunaomba msaada",
      so: "Adiga keliya baanu caabudi, adiga keliya baanu u codsanaa",
      bs: "Samo Tebe obožavamo i samo od Tebe pomoć tražimo",
      sq: "Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë",
      ru: "Тебе одному мы поклоняемся и у Тебя одного просим помощи",
      ur: "ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ سے ہی مدد مانگتے ہیں",
      bn: "আমরা শুধু তোমারই ইবাদত করি এবং শুধু তোমারই সাহায্য চাই",
      ms: "Hanya Engkau yang kami sembah, dan hanya kepada Engkau kami mohon pertolongan",
      fr: "You alone we worship and You alone we ask for help", sus: "You alone we worship and You alone we ask for help"
    },
    surahAyah: "الفاتحة:5", ayahNumber: 5,
    hint: "تعني التخصيص — أي أنت وحدك، الكلمة تبدأ بالهمزة",
    correctVerse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    correctVerseMeaning: "You alone we worship and You alone we ask for help",
    options: [
      { text: "نَعْبُدُ", isCorrect: false },
      { text: "نَسْتَعِينُ", isCorrect: false },
      { text: "إِيَّاكَ", isCorrect: true },
      { text: "وَ", isCorrect: false },
    ],
  },
  {
    id: "v41", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "نَعْبُدُ",
    targetWordMeaning: "We worship",
    targetWordTranslations: {
      en: "We worship", ar: "نعبد ونطيع", id: "Kami menyembah", tr: "İbadet ederiz", zh: "我们崇拜",
      sw: "Tunaabudu", so: "Baanu caabudi", bs: "Obožavamo", sq: "Ne adhurojmë", ru: "Мы поклоняемся",
      ur: "ہم عبادت کرتے ہیں", bn: "আমরা ইবাদত করি", ms: "Kami menyembah",
      fr: "Nous adorons", sus: "Anh Bɛ Tɛɛbɔ"
    },
    correctVerseMeaningTranslations: {
      en: "You alone we worship and You alone we ask for help",
      ar: "إياك نعبد وإياك نستعين",
      id: "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan",
      tr: "Yalnız Sana ibadet eder, yalnız Senden yardım dileriz",
      zh: "我们只崇拜你，只向你求助",
      sw: "Wewe peke yako tunaabudu na Wewe peke yako tunaomba msaada",
      so: "Adiga keliya baanu caabudi, adiga keliya baanu u codsanaa",
      bs: "Samo Tebe obožavamo i samo od Tebe pomoć tražimo",
      sq: "Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë",
      ru: "Тебе одному мы поклоняемся и у Тебя одного просим помощи",
      ur: "ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ سے ہی مدد مانگتے ہیں",
      bn: "আমরা শুধু তোমারই ইবাদত করি এবং শুধু তোমারই সাহায্য চাই",
      ms: "Hanya Engkau yang kami sembah, dan hanya kepada Engkau kami mohon pertolongan",
      fr: "You alone we worship and You alone we ask for help", sus: "You alone we worship and You alone we ask for help"
    },
    surahAyah: "الفاتحة:5", ayahNumber: 5,
    hint: "أكمل الآية: إِيَّاكَ ___ وَإِيَّاكَ نَسْتَعِينُ",
    correctVerse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    correctVerseMeaning: "You alone we worship and You alone we ask for help",
    options: [
      { text: "نَسْتَعِينُ", isCorrect: false },
      { text: "نَعْبُدُ", isCorrect: true },
      { text: "إِيَّاكَ", isCorrect: false },
      { text: "نَهْدِي", isCorrect: false },
    ],
  },
  {
    id: "v42", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "نَسْتَعِينُ",
    targetWordMeaning: "We seek help",
    targetWordTranslations: {
      en: "We seek help", ar: "نطلب المساعدة", id: "Kami memohon pertolongan", tr: "Yardım dileriz", zh: "我们求助",
      sw: "Tunaomba msaada", so: "Baanu u codsanaa", bs: "Tražimo pomoć", sq: "Kërkojmë ndihmë", ru: "Просим помощи",
      ur: "ہم مدد مانگتے ہیں", bn: "আমরা সাহায্য চাই", ms: "Kami memohon pertolongan",
      fr: "Nous implorons l'aide", sus: "Anh Bɛ Dɛnbɛ Ɲaxɛ"
    },
    correctVerseMeaningTranslations: {
      en: "You alone we worship and You alone we ask for help",
      ar: "إياك نعبد وإياك نستعين",
      id: "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan",
      tr: "Yalnız Sana ibadet eder, yalnız Senden yardım dileriz",
      zh: "我们只崇拜你，只向你求助",
      sw: "Wewe peke yako tunaabudu na Wewe peke yako tunaomba msaada",
      so: "Adiga keliya baanu caabudi, adiga keliya baanu u codsanaa",
      bs: "Samo Tebe obožavamo i samo od Tebe pomoć tražimo",
      sq: "Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë",
      ru: "Тебе одному мы поклоняемся и у Тебя одного просим помощи",
      ur: "ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ سے ہی مدد مانگتے ہیں",
      bn: "আমরা শুধু তোমারই ইবাদত করি এবং শুধু তোমারই সাহায্য চাই",
      ms: "Hanya Engkau yang kami sembah, dan hanya kepada Engkau kami mohon pertolongan",
      fr: "You alone we worship and You alone we ask for help", sus: "You alone we worship and You alone we ask for help"
    },
    surahAyah: "الفاتحة:5", ayahNumber: 5,
    hint: "أكمل الآية: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ___",
    correctVerse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    correctVerseMeaning: "You alone we worship and You alone we ask for help",
    options: [
      { text: "نَعْبُدُ", isCorrect: false },
      { text: "نَهْدِي", isCorrect: false },
      { text: "إِيَّاكَ", isCorrect: false },
      { text: "نَسْتَعِينُ", isCorrect: true },
    ],
  },
  {
    id: "v43", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "اهْدِنَا",
    targetWordMeaning: "Guide us",
    targetWordTranslations: {
      en: "Guide us", ar: "أرشدنا وأرنا الطريق", id: "Tunjukilah kami", tr: "Bizi hidayete erdir", zh: "引导我们",
      sw: "Tuongoze", so: "Nagu hida", bs: "Uputi nas", sq: "Na udhëzo", ru: "Веди нас",
      ur: "ہمیں ہدایت دے", bn: "আমাদের পথ দেখাও", ms: "Tunjukilah kami",
      fr: "Guide-nous", sus: "Anh Sɛgɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Guide us to the straight path",
      ar: "اهدنا الصراط المستقيم",
      id: "Tunjukilah kami jalan yang lurus",
      tr: "Bizi doğru yola ilet",
      zh: "引导我们走上正道",
      sw: "Tuongoze njia iliyonyooka",
      so: "Nagu hid jidka toosan",
      bs: "Uputi nas na pravi put",
      sq: "Na udhëzo në rrugën e drejtë",
      ru: "Веди нас прямым путём",
      ur: "ہمیں سیدھے راستے کی ہدایت دے",
      bn: "আমাদের সরল পথ দেখাও",
      ms: "Tunjukilah kami jalan yang lurus",
      fr: "Guide-nous sur le droit chemin", sus: "Anh sɛgɛ nɛrɛ tilinɲɛ ma"
    },
    surahAyah: "الفاتحة:6", ayahNumber: 6,
    hint: "أول كلمة في دعاء الفاتحة، فعل أمر للهداية",
    correctVerse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    correctVerseMeaning: "Guide us to the straight path",
    options: [
      { text: "الصِّرَاطَ", isCorrect: false },
      { text: "الْمُسْتَقِيمَ", isCorrect: false },
      { text: "اهْدِنَا", isCorrect: true },
      { text: "رَبِّ", isCorrect: false },
    ],
  },
  {
    id: "v44", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الصِّرَاطَ",
    targetWordMeaning: "The path / The way",
    targetWordTranslations: {
      en: "The path / The way", ar: "الطريق والمسلك", id: "Jalan", tr: "Yol / Sırat", zh: "道路 / 正路",
      sw: "Njia", so: "Jidka", bs: "Put / Staza", sq: "Rruga / Udha", ru: "Путь / Дорога",
      ur: "راستہ / صراط", bn: "পথ / রাস্তা", ms: "Jalan / Laluan",
      fr: "Le chemin / La voie", sus: "Nɛrɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Guide us to the straight path",
      ar: "اهدنا الصراط المستقيم",
      id: "Tunjukilah kami jalan yang lurus",
      tr: "Bizi doğru yola ilet",
      zh: "引导我们走上正道",
      sw: "Tuongoze njia iliyonyooka",
      so: "Nagu hid jidka toosan",
      bs: "Uputi nas na pravi put",
      sq: "Na udhëzo në rrugën e drejtë",
      ru: "Веди нас прямым путём",
      ur: "ہمیں سیدھے راستے کی ہدایت دے",
      bn: "আমাদের সরল পথ দেখাও",
      ms: "Tunjukilah kami jalan yang lurus",
      fr: "Guide-nous sur le droit chemin", sus: "Anh sɛgɛ nɛrɛ tilinɲɛ ma"
    },
    surahAyah: "الفاتحة:6", ayahNumber: 6,
    hint: "تعني الطريق أو المسلك، الكلمة تبدأ بحرف الـ ص...",
    correctVerse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    correctVerseMeaning: "Guide us to the straight path",
    options: [
      { text: "اهْدِنَا", isCorrect: false },
      { text: "الْمُسْتَقِيمَ", isCorrect: false },
      { text: "الصِّرَاطَ", isCorrect: true },
      { text: "الدِّينِ", isCorrect: false },
    ],
  },
  {
    id: "v45", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الْمُسْتَقِيمَ",
    targetWordMeaning: "The straight / The upright",
    targetWordTranslations: {
      en: "The straight / The upright", ar: "المستقيم والمباشر", id: "Yang lurus", tr: "Doğru olan", zh: "笔直的",
      sw: "Iliyonyooka", so: "Toosan", bs: "Pravi / Ispravan", sq: "I drejtë", ru: "Прямой",
      ur: "سیدھا / مستقیم", bn: "সরল / সঠিক", ms: "Yang lurus",
      fr: "Le droit / Le rectiligne", sus: "Nɛrɛ Tilinɲɛ"
    },
    correctVerseMeaningTranslations: {
      en: "Guide us to the straight path",
      ar: "اهدنا الصراط المستقيم",
      id: "Tunjukilah kami jalan yang lurus",
      tr: "Bizi doğru yola ilet",
      zh: "引导我们走上正道",
      sw: "Tuongoze njia iliyonyooka",
      so: "Nagu hid jidka toosan",
      bs: "Uputi nas na pravi put",
      sq: "Na udhëzo në rrugën e drejtë",
      ru: "Веди нас прямым путём",
      ur: "ہمیں سیدھے راستے کی ہدایت دے",
      bn: "আমাদের সরল পথ দেখাও",
      ms: "Tunjukilah kami jalan yang lurus",
      fr: "Guide-nous sur le droit chemin", sus: "Anh sɛgɛ nɛrɛ tilinɲɛ ma"
    },
    surahAyah: "الفاتحة:6", ayahNumber: 6,
    hint: "أكمل الآية: اهْدِنَا الصِّرَاطَ ___",
    correctVerse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    correctVerseMeaning: "Guide us to the straight path",
    options: [
      { text: "الصِّرَاطَ", isCorrect: false },
      { text: "اهْدِنَا", isCorrect: false },
      { text: "الْمُعَوَّجَ", isCorrect: false },
      { text: "الْمُسْتَقِيمَ", isCorrect: true },
    ],
  },
  {
    id: "v46", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "أَنْعَمْتَ",
    targetWordMeaning: "You have bestowed favour upon",
    targetWordTranslations: {
      en: "You have bestowed favour upon", ar: "أعطيت النعمة لـ", id: "Engkau telah memberi nikmat", tr: "Nimetlendirdiklerinin", zh: "你所赐恩的",
      sw: "Uliowaneemesha", so: "Ee aad u naxariisatay", bs: "Koje si blagodatima obasuo", sq: "Të cilëve u dhurove të mira", ru: "Которым Ты оказал милость",
      ur: "جن پر تو نے انعام کیا", bn: "যাদের উপর তুমি অনুগ্রহ করেছ", ms: "Yang Engkau telah menganugerahkan nikmat",
      fr: "Tu as comblé de bienfaits", sus: "Hɔnɔyi Masaxu"
    },
    correctVerseMeaningTranslations: {
      en: "The path of those upon whom You have bestowed favour",
      ar: "صراط الذين أنعمت عليهم",
      id: "Jalan orang-orang yang telah Engkau beri nikmat",
      tr: "Kendilerine nimetler verdiklerinin yolu",
      zh: "你所赐恩的人们的道路",
      sw: "Njia ya wale uliowaneemesha",
      so: "Jidka kuwa aad u naxariisatay",
      bs: "Put onih kojima si blagodati dao",
      sq: "Rruga e atyre që u dhurove të mira",
      ru: "Путь тех, которым Ты оказал милость",
      ur: "ان لوگوں کا راستہ جن پر تو نے انعام کیا",
      bn: "তাদের পথ যাদের উপর তুমি অনুগ্রহ করেছ",
      ms: "Jalan orang-orang yang telah Engkau kurniakan nikmat",
      fr: "The path of those upon whom You have bestowed favour", sus: "The path of those upon whom You have bestowed favour"
    },
    surahAyah: "الفاتحة:7", ayahNumber: 7,
    hint: "تعني منح النعمة والعطاء، الكلمة تبدأ بالهمزة",
    correctVerse: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
    correctVerseMeaning: "The path of those upon whom You have bestowed favour",
    options: [
      { text: "عَلَيْهِمْ", isCorrect: false },
      { text: "الَّذِينَ", isCorrect: false },
      { text: "أَنْعَمْتَ", isCorrect: true },
      { text: "صِرَاطَ", isCorrect: false },
    ],
  },
  {
    id: "v47", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الْمَغْضُوبِ",
    targetWordMeaning: "Those who earned wrath",
    targetWordTranslations: {
      en: "Those who earned wrath", ar: "الذين غضب الله عليهم", id: "Yang dimurkai", tr: "Gazaba uğrayanların", zh: "被愤怒的人",
      sw: "Waliokasirikwa", so: "Kuwa cadhoobay", bs: "Onih nad kojima je srdžba", sq: "Atyre mbi të cilët ka rëndë zemërimi", ru: "Тех на кого пал гнев",
      ur: "جن پر غضب ہوا", bn: "যাদের উপর ক্রোধ পড়েছে", ms: "Yang dimurkai",
      fr: "Ceux qui ont mérité la colère", sus: "Suukuye Sɔtɔxie"
    },
    correctVerseMeaningTranslations: {
      en: "Not of those who earned wrath, nor of those who go astray",
      ar: "غير المغضوب عليهم ولا الضالين",
      id: "Bukan jalan yang dimurkai dan bukan jalan yang sesat",
      tr: "Gazaba uğrayanların ve sapkınların değil",
      zh: "不是被降怒者，也不是迷误者的",
      sw: "Si ya waliokasirikwa wala waliopotea",
      so: "Ee aan ahayn kuwa cadhoobay oo kale, iyo kuma dhumana",
      bs: "Ne onih nad kojima je srdžba ni onih koji su zalutali",
      sq: "Jo të atyre mbi të cilët ka rëndë zemërimi, e as të atyre që kanë humbur rrugën",
      ru: "Не тех на кого пал гнев и не заблудших",
      ur: "نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا",
      bn: "তাদের নয় যাদের উপর ক্রোধ নেমেছে এবং পথভ্রষ্টদেরও নয়",
      ms: "Bukan jalan mereka yang dimurkai dan bukan pula mereka yang sesat",
      fr: "Not of those who earned wrath, nor of those who go astray", sus: "Not of those who earned wrath, nor of those who go astray"
    },
    surahAyah: "الفاتحة:7", ayahNumber: 7,
    hint: "الكلمة تبدأ بالميم، وتعني الذين نالوا غضب الله",
    correctVerse: "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    correctVerseMeaning: "Not of those who earned wrath, nor of those who go astray",
    options: [
      { text: "الضَّالِّينَ", isCorrect: false },
      { text: "غَيْرِ", isCorrect: false },
      { text: "الْمَغْضُوبِ", isCorrect: true },
      { text: "عَلَيْهِمْ", isCorrect: false },
    ],
  },
  {
    id: "v48", surahAr: "الفاتحة", surahEn: "Al-Fatiha",
    targetWord: "الضَّالِّينَ",
    targetWordMeaning: "Those who go astray",
    targetWordTranslations: {
      en: "Those who go astray", ar: "الذين ضلوا عن الحق", id: "Yang tersesat", tr: "Sapıkların / Yolunu şaşıranların", zh: "迷误者",
      sw: "Waliopotea", so: "Kuwa dhumay", bs: "Onih koji su zalutali", sq: "Atyre që kanë humbur rrugën", ru: "Заблудших",
      ur: "گمراہوں کا", bn: "পথভ্রষ্টদের", ms: "Mereka yang sesat",
      fr: "Ceux qui s'égarent", sus: "Nalama Nɛrɛ ra"
    },
    correctVerseMeaningTranslations: {
      en: "Not of those who earned wrath, nor of those who go astray",
      ar: "غير المغضوب عليهم ولا الضالين",
      id: "Bukan jalan yang dimurkai dan bukan jalan yang sesat",
      tr: "Gazaba uğrayanların ve sapkınların değil",
      zh: "不是被降怒者，也不是迷误者的",
      sw: "Si ya waliokasirikwa wala waliopotea",
      so: "Ee aan ahayn kuwa cadhoobay oo kale, iyo kuma dhumana",
      bs: "Ne onih nad kojima je srdžba ni onih koji su zalutali",
      sq: "Jo të atyre mbi të cilët ka rëndë zemërimi, e as të atyre që kanë humbur rrugën",
      ru: "Не тех на кого пал гнев и не заблудших",
      ur: "نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا",
      bn: "তাদের নয় যাদের উপর ক্রোধ নেমেছে এবং পথভ্রষ্টদেরও নয়",
      ms: "Bukan jalan mereka yang dimurkai dan bukan pula mereka yang sesat",
      fr: "Not of those who earned wrath, nor of those who go astray", sus: "Not of those who earned wrath, nor of those who go astray"
    },
    surahAyah: "الفاتحة:7", ayahNumber: 7,
    hint: "أكمل الآية: غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ___",
    correctVerse: "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    correctVerseMeaning: "Not of those who earned wrath, nor of those who go astray",
    options: [
      { text: "الْمَغْضُوبِ", isCorrect: false },
      { text: "الْمُنْعَمِينَ", isCorrect: false },
      { text: "الصَّادِقِينَ", isCorrect: false },
      { text: "الضَّالِّينَ", isCorrect: true },
    ],
  },
  // ===================== AL-MULK / TABARAK (v49–v64) =====================
  {
    id: "v49", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "تَبَارَكَ",
    targetWordMeaning: "Blessed / Most Exalted",
    targetWordTranslations: {
      en: "Blessed / Most Exalted", ar: "تعالى وتعظّم وكثر خيره", id: "Maha Suci / Maha Agung", tr: "Ne yücedir / Mübarektir", zh: "祝福的 / 至高无上的",
      sw: "Amebarikiwa / Mtukufu", so: "Wayn buu yahay", bs: "Neka je uzvišen", sq: "I lartësuari / I bekuari", ru: "Благословен / Превыше всего",
      ur: "بابرکت / عظیم", bn: "মহিমান্বিত / বরকতময়", ms: "Maha Berkat / Maha Agung",
      fr: "Béni / Très Élevé", sus: "Tabaraki"
    },
    correctVerseMeaningTranslations: {
      en: "Blessed is He in whose hand is dominion",
      ar: "تبارك الذي بيده الملك",
      id: "Maha Suci Allah yang di tangan-Nya kerajaan",
      tr: "Mülk yalnızca elinde olan ne yücedir",
      zh: "至高无上的是手握王权的",
      sw: "Amebarikiwa ambaye mikononi mwake iko utawala",
      so: "Wayn buu yahay ee gacmihiisu ku jirto mulkiga",
      bs: "Neka je uzvišen Onaj u čijoj je ruci vlast",
      sq: "I lartësuari është Ai në dorën e të Cilit është sundimi",
      ru: "Благословен Тот в чьей руке власть",
      ur: "بابرکت ہے وہ جس کے ہاتھ میں بادشاہت ہے",
      bn: "বরকতময় তিনি যার হাতে রাজত্ব",
      ms: "Maha Suci Dia yang di tangan-Nya pemerintahan",
      fr: "Blessed is He in whose hand is dominion", sus: "Blessed is He in whose hand is dominion"
    },
    surahAyah: "الملك:1", ayahNumber: 1,
    hint: "الكلمة الأولى في السورة، تعني عظمة الله وكثرة خيره",
    correctVerse: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    correctVerseMeaning: "Blessed is He in whose hand is dominion",
    options: [
      { text: "الَّذِي", isCorrect: false },
      { text: "الْمُلْكُ", isCorrect: false },
      { text: "تَبَارَكَ", isCorrect: true },
      { text: "بِيَدِهِ", isCorrect: false },
    ],
  },
  {
    id: "v50", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "الْمُلْكُ",
    targetWordMeaning: "The dominion / The kingdom",
    targetWordTranslations: {
      en: "The dominion / The kingdom", ar: "السلطة والملك والسيادة", id: "Kerajaan / Kekuasaan", tr: "Mülk / Hükümranlık", zh: "王权 / 统治权",
      sw: "Utawala / Ufalme", so: "Mulkiga / Boqortoyada", bs: "Vlast / Carstvo", sq: "Sundimi / Mbretëria", ru: "Власть / Царство",
      ur: "بادشاہت / ملک", bn: "রাজত্ব / কর্তৃত্ব", ms: "Kerajaan / Kekuasaan",
      fr: "La souveraineté / Le royaume", sus: "Mansaya"
    },
    correctVerseMeaningTranslations: {
      en: "Blessed is He in whose hand is dominion",
      ar: "تبارك الذي بيده الملك",
      id: "Maha Suci Allah yang di tangan-Nya kerajaan",
      tr: "Mülk yalnızca elinde olan ne yücedir",
      zh: "至高无上的是手握王权的",
      sw: "Amebarikiwa ambaye mikononi mwake iko utawala",
      so: "Wayn buu yahay ee gacmihiisu ku jirto mulkiga",
      bs: "Neka je uzvišen Onaj u čijoj je ruci vlast",
      sq: "I lartësuari është Ai në dorën e të Cilit është sundimi",
      ru: "Благословен Тот в чьей руке власть",
      ur: "بابرکت ہے وہ جس کے ہاتھ میں بادشاہت ہے",
      bn: "বরকতময় তিনি যার হাতে রাজত্ব",
      ms: "Maha Suci Dia yang di tangan-Nya pemerintahan",
      fr: "Blessed is He in whose hand is dominion", sus: "Blessed is He in whose hand is dominion"
    },
    surahAyah: "الملك:1", ayahNumber: 1,
    hint: "تعني السلطة والحكم المطلق، وهي اسم السورة",
    correctVerse: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    correctVerseMeaning: "Blessed is He in whose hand is dominion",
    options: [
      { text: "تَبَارَكَ", isCorrect: false },
      { text: "الَّذِي", isCorrect: false },
      { text: "بِيَدِهِ", isCorrect: false },
      { text: "الْمُلْكُ", isCorrect: true },
    ],
  },
  {
    id: "v51", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "قَدِيرٌ",
    targetWordMeaning: "All-Powerful / Capable of all things",
    targetWordTranslations: {
      en: "All-Powerful", ar: "القادر على كل شيء", id: "Maha Kuasa", tr: "Her şeye kadir", zh: "全能的",
      sw: "Mwenye nguvu zote", so: "Xoogga leh", bs: "Svemoćan", sq: "I gjithëfuqishëm", ru: "Всемогущий",
      ur: "ہر چیز پر قادر", bn: "সর্বশক্তিমান", ms: "Maha Berkuasa",
      fr: "Tout-Puissant", sus: "Sɛnyi Birin na"
    },
    correctVerseMeaningTranslations: {
      en: "And He is over all things competent",
      ar: "وهو على كل شيء قدير",
      id: "Dan Dia Maha Kuasa atas segala sesuatu",
      tr: "Ve O, her şeye kadirdir",
      zh: "他对一切事情都有能力",
      sw: "Naye ana nguvu juu ya kila kitu",
      so: "Wuuna ku awood leh wax kastaba",
      bs: "A On je svemoćan",
      sq: "Dhe Ai është i gjithëfuqishëm mbi çdo gjë",
      ru: "И Он над всякой вещью мощен",
      ur: "اور وہ ہر چیز پر قادر ہے",
      bn: "এবং তিনি সব কিছুর উপর সর্বশক্তিমান",
      ms: "Dan Dia Maha Kuasa atas tiap-tiap sesuatu",
      fr: "And He is over all things competent", sus: "And He is over all things competent"
    },
    surahAyah: "الملك:1", ayahNumber: 1,
    hint: "آخر كلمة في الآية الأولى، صفة الله في القدرة المطلقة",
    correctVerse: "وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    correctVerseMeaning: "And He is over all things competent",
    options: [
      { text: "عَلَىٰ", isCorrect: false },
      { text: "كُلِّ", isCorrect: false },
      { text: "شَيْءٍ", isCorrect: false },
      { text: "قَدِيرٌ", isCorrect: true },
    ],
  },
  {
    id: "v52", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "الْمَوْتَ",
    targetWordMeaning: "Death",
    targetWordTranslations: {
      en: "Death", ar: "الموت وانتهاء الحياة", id: "Kematian", tr: "Ölüm", zh: "死亡",
      sw: "Kifo", so: "Dhimashada", bs: "Smrt", sq: "Vdekja", ru: "Смерть",
      ur: "موت", bn: "মৃত্যু", ms: "Kematian",
      fr: "Mort", sus: "Faa"
    },
    correctVerseMeaningTranslations: {
      en: "Who created death and life to test you which of you is best in deed",
      ar: "الذي خلق الموت والحياة ليبلوكم أيكم أحسن عملا",
      id: "Yang menciptakan mati dan hidup untuk menguji kamu siapa yang terbaik amalnya",
      tr: "Hanginizin daha güzel amel edeceğini sınamak için ölümü ve hayatı yaratan",
      zh: "他创造了死亡和生命来考验你们谁的行为最好",
      sw: "Ambaye aliuumba mauti na uhai ili akujaribu ni nani bora zaidi katika vitendo",
      so: "Kan abuuray dhimashada iyo noloshaba si uu u imtixaamo midkood fiican yahay",
      bs: "Koji je smrt i život stvorio da bi vas iskušao ko će od vas bolja djela činiti",
      sq: "Ai që krijoi vdekjen dhe jetën për t'ju provuar se kush prej jush do të bëjë vepra më të mira",
      ru: "Который сотворил смерть и жизнь чтобы испытать вас кто лучше поступками",
      ur: "جس نے موت اور زندگی بنائی تاکہ تمہیں آزمائے کہ تم میں کون عمل میں بہتر ہے",
      bn: "যিনি মৃত্যু ও জীবন সৃষ্টি করেছেন তোমাদের পরীক্ষার জন্য কে তোমাদের মধ্যে আমলে উত্তম",
      ms: "Yang menciptakan mati dan hidup untuk menguji kamu siapakah yang terbaik amalannya",
      fr: "Who created death and life to test you which of you is best in deed", sus: "Who created death and life to test you which of you is best in deed"
    },
    surahAyah: "الملك:2", ayahNumber: 2,
    hint: "ضد الحياة، أول شيء ذكر في الآية الثانية",
    correctVerse: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ",
    correctVerseMeaning: "Who created death and life",
    options: [
      { text: "الْحَيَاةَ", isCorrect: false },
      { text: "خَلَقَ", isCorrect: false },
      { text: "الَّذِي", isCorrect: false },
      { text: "الْمَوْتَ", isCorrect: true },
    ],
  },
  {
    id: "v53", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "الْحَيَاةَ",
    targetWordMeaning: "Life",
    targetWordTranslations: {
      en: "Life", ar: "الحياة والوجود", id: "Kehidupan", tr: "Hayat", zh: "生命",
      sw: "Uhai / Maisha", so: "Noloshada", bs: "Život", sq: "Jeta", ru: "Жизнь",
      ur: "زندگی", bn: "জীবন", ms: "Kehidupan",
      fr: "Vie", sus: "Yinyi"
    },
    correctVerseMeaningTranslations: {
      en: "Who created death and life to test you which of you is best in deed",
      ar: "الذي خلق الموت والحياة ليبلوكم أيكم أحسن عملا",
      id: "Yang menciptakan mati dan hidup untuk menguji kamu siapa yang terbaik amalnya",
      tr: "Hanginizin daha güzel amel edeceğini sınamak için ölümü ve hayatı yaratan",
      zh: "他创造了死亡和生命来考验你们谁的行为最好",
      sw: "Ambaye aliuumba mauti na uhai ili akujaribu ni nani bora zaidi katika vitendo",
      so: "Kan abuuray dhimashada iyo noloshaba si uu u imtixaamo midkood fiican yahay",
      bs: "Koji je smrt i život stvorio da bi vas iskušao ko će od vas bolja djela činiti",
      sq: "Ai që krijoi vdekjen dhe jetën për t'ju provuar se kush prej jush do të bëjë vepra më të mira",
      ru: "Который сотворил смерть и жизнь чтобы испытать вас кто лучше поступками",
      ur: "جس نے موت اور زندگی بنائی تاکہ تمہیں آزمائے کہ تم میں کون عمل میں بہتر ہے",
      bn: "যিনি মৃত্যু ও জীবন সৃষ্টি করেছেন তোমাদের পরীক্ষার জন্য কে তোমাদের মধ্যে আমলে উত্তম",
      ms: "Yang menciptakan mati dan hidup untuk menguji kamu siapakah yang terbaik amalannya",
      fr: "Who created death and life to test you which of you is best in deed", sus: "Who created death and life to test you which of you is best in deed"
    },
    surahAyah: "الملك:2", ayahNumber: 2,
    hint: "أكمل الآية: الَّذِي خَلَقَ الْمَوْتَ وَ___",
    correctVerse: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ",
    correctVerseMeaning: "Who created death and life",
    options: [
      { text: "الْمَوْتَ", isCorrect: false },
      { text: "الْمُلْكُ", isCorrect: false },
      { text: "الْحَيَاةَ", isCorrect: true },
      { text: "الْعَمَلَ", isCorrect: false },
    ],
  },
  {
    id: "v54", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "أَحْسَنُ عَمَلًا",
    targetWordMeaning: "Best in deed",
    targetWordTranslations: {
      en: "Best in deed", ar: "أفضل في العمل والفعل", id: "Terbaik amalnya", tr: "En güzel ameli yapan", zh: "行为最好的",
      sw: "Bora zaidi katika vitendo", so: "Ugu fiican ee ficilada", bs: "Bolja u djelima", sq: "Më i miri në vepra", ru: "Лучший в делах",
      ur: "عمل میں بہترین", bn: "আমলে সর্বোত্তম", ms: "Terbaik amalannya",
      fr: "Meilleur en œuvre", sus: "Kɛlɛ Kore"
    },
    correctVerseMeaningTranslations: {
      en: "To test you which of you is best in deed",
      ar: "ليبلوكم أيكم أحسن عملا",
      id: "Untuk menguji kamu siapa yang terbaik amalnya",
      tr: "Hanginizin en güzel ameli yapacağını sınamak için",
      zh: "以考验你们谁的行为最好",
      sw: "Ili kukujaribu ni nani bora zaidi katika vitendo",
      so: "Si uu u imtixaamo midkood ugu fiican yahay ficilada",
      bs: "Da bi iskušao ko je od vas bolji u djelima",
      sq: "Për t'ju provuar kush është më i miri në vepra",
      ru: "Чтобы испытать вас кто из вас лучший в деяниях",
      ur: "تاکہ آزمائے تم میں سے کون عمل میں بہتر ہے",
      bn: "তোমাদের পরীক্ষা করতে কে তোমাদের মধ্যে আমলে উত্তম",
      ms: "Untuk menguji kamu siapakah yang terbaik amalannya",
      fr: "To test you which of you is best in deed", sus: "To test you which of you is best in deed"
    },
    surahAyah: "الملك:2", ayahNumber: 2,
    hint: "مركب من كلمتين، تعني الأفضل في الأعمال والسلوك",
    correctVerse: "لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    correctVerseMeaning: "To test you which of you is best in deed",
    options: [
      { text: "لِيَبْلُوَكُمْ", isCorrect: false },
      { text: "أَيُّكُمْ", isCorrect: false },
      { text: "أَحْسَنُ عَمَلًا", isCorrect: true },
      { text: "قَدِيرٌ", isCorrect: false },
    ],
  },
  {
    id: "v55", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "طِبَاقًا",
    targetWordMeaning: "Layer upon layer / In tiers",
    targetWordTranslations: {
      en: "Layer upon layer / In tiers", ar: "طبقات فوق بعضها", id: "Berlapis-lapis", tr: "Kat kat / Tabaka tabaka", zh: "层叠的",
      sw: "Safu juu ya safu", so: "Lakab laakabnaan", bs: "Jedan iznad drugog", sq: "Shtresë mbi shtresë", ru: "Ярус за ярусом",
      ur: "ایک کے اوپر ایک", bn: "স্তরে স্তরে", ms: "Berlapis-lapis",
      fr: "Couche par couche / En niveaux", sus: "Nɔrɔ Xun ma"
    },
    correctVerseMeaningTranslations: {
      en: "Who created seven heavens in layers",
      ar: "الذي خلق سبع سماوات طباقا",
      id: "Yang menciptakan tujuh langit berlapis-lapis",
      tr: "O ki yedi göğü tabaka tabaka yarattı",
      zh: "他创造了七层重叠的天",
      sw: "Ambaye aliumba mbingu saba safu juu ya safu",
      so: "Kan sameeye toddoba samaawaadood oo lakab laakab ah",
      bs: "Koji je sedam nebesa jedan iznad drugog stvorio",
      sq: "Ai që krijoi shtatë qiej shtresë mbi shtresë",
      ru: "Который сотворил семь небес ярус за ярусом",
      ur: "جس نے سات آسمان ایک کے اوپر ایک بنائے",
      bn: "যিনি সাত আকাশ স্তরে স্তরে সৃষ্টি করেছেন",
      ms: "Yang menciptakan tujuh langit berlapis-lapis",
      fr: "Who created seven heavens in layers", sus: "Who created seven heavens in layers"
    },
    surahAyah: "الملك:3", ayahNumber: 3,
    hint: "تصف السماوات السبع، تعني الطبقات المتراكمة",
    correctVerse: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا",
    correctVerseMeaning: "Who created seven heavens in layers",
    options: [
      { text: "سَبْعَ", isCorrect: false },
      { text: "سَمَاوَاتٍ", isCorrect: false },
      { text: "طِبَاقًا", isCorrect: true },
      { text: "خَلَقَ", isCorrect: false },
    ],
  },
  {
    id: "v56", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "تَفَاوُتٍ",
    targetWordMeaning: "Defect / Imperfection / Discordance",
    targetWordTranslations: {
      en: "Defect / Imperfection", ar: "الخلل والتباين والاضطراب", id: "Ketidakseimbangan / Cacat", tr: "Çelişki / Kusur", zh: "缺陷 / 不协调",
      sw: "Kasoro / Tofauti", so: "Cilad / Khalad", bs: "Nesklad / Mana", sq: "Papërsosuri / Mospajtim", ru: "Несоответствие / Изъян",
      ur: "خامی / عدم توازن", bn: "ত্রুটি / অসামঞ্জস্য", ms: "Ketidakseimbangan / Cacat",
      fr: "Défaut / Imperfection", sus: "Kuya"
    },
    correctVerseMeaningTranslations: {
      en: "You will not see in the creation of the Most Merciful any defect",
      ar: "ما ترى في خلق الرحمن من تفاوت",
      id: "Kamu tidak melihat pada ciptaan Allah yang Maha Pengasih ketidakseimbangan",
      tr: "Rahmân'ın yaratmasında hiçbir kusur görmezsin",
      zh: "你在至仁主的创造中看不到任何缺陷",
      sw: "Hutaona katika uumbaji wa Mwingi wa rehema tofauti yoyote",
      so: "Adigu ma arki kartid abuurka Naxariistaha mid cilad leh",
      bs: "Nećeš u Milostivom Stvoritelju vidjeti nikakav nesklad",
      sq: "Nuk do të shohësh në krijimin e të Gjithëmëshirshmit asnjë papërsosuri",
      ru: "Ты не увидишь в творении Милосердного никакого изъяна",
      ur: "تم رحمان کی تخلیق میں کوئی خامی نہیں دیکھو گے",
      bn: "তুমি রহমানের সৃষ্টিতে কোনো ত্রুটি দেখবে না",
      ms: "Kamu tidak akan melihat pada ciptaan Allah yang Maha Pemurah sebarang cacat",
      fr: "You will not see in the creation of the Most Merciful any defect", sus: "You will not see in the creation of the Most Merciful any defect"
    },
    surahAyah: "الملك:3", ayahNumber: 3,
    hint: "تعني الاختلاف والخلل، والقرآن يقول لن ترى في الخلق من ___",
    correctVerse: "مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ",
    correctVerseMeaning: "You will not see in the creation of the Most Merciful any defect",
    options: [
      { text: "خَلْقِ", isCorrect: false },
      { text: "الرَّحْمَٰنِ", isCorrect: false },
      { text: "تَفَاوُتٍ", isCorrect: true },
      { text: "طِبَاقًا", isCorrect: false },
    ],
  },
  {
    id: "v57", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "سَعِيرٍ",
    targetWordMeaning: "Blazing fire",
    targetWordTranslations: {
      en: "Blazing fire", ar: "النار المشتعلة الحارقة", id: "Api yang menyala-nyala", tr: "Alevli ateş", zh: "熊熊烈火",
      sw: "Moto mkali unaowaka", so: "Dab guban", bs: "Buktinja / Razbuktali oganj", sq: "Zjarr i ndezur fort", ru: "Пламя / Пылающий огонь",
      ur: "بھڑکتی آگ", bn: "প্রজ্বলিত আগুন", ms: "Api yang menyala-nyala",
      fr: "Feu ardent", sus: "Tasuma Kankan"
    },
    correctVerseMeaningTranslations: {
      en: "And We have adorned the nearest heaven with lamps and made them pelted at the devils",
      ar: "ولقد زينا السماء الدنيا بمصابيح وجعلناها رجوما للشياطين",
      id: "Dan sungguh Kami telah menghiasi langit terdekat dengan lampu-lampu dan Kami jadikannya sebagai pelempar setan",
      tr: "And Biz en yakın göğü kandillerle donattık ve bunları şeytanlara atılan şeyler yaptık",
      zh: "我们用灯装饰了最近的天，并将它们作为向恶魔投掷的武器",
      sw: "Na kwa hakika Tumeipamba mbingu ya karibu kwa taa na tumezifanya virusha kwa mashetani",
      so: "Annaguna waxaan ku qurxinnay samada ugu dhow tababar iyo waxaan u dhignay shayaadiinka",
      bs: "Mi smo nebo najbliže ukrasili zvijezdama, a njih smo učinili bacaljkama za šejtane",
      sq: "Dhe Ne e stolisëm qiellin e afërt me drita dhe i bëmë ato hobe ndaj djalëzve",
      ru: "Мы украсили ближайшее небо светильниками и сделали их метательными снарядами для дьяволов",
      ur: "اور ہم نے قریب کے آسمان کو چراغوں سے آراستہ کیا اور انہیں شیطانوں کو مارنے کا ذریعہ بنایا",
      bn: "আমরা নিকটবর্তী আকাশকে প্রদীপমালা দিয়ে সুসজ্জিত করেছি এবং সেগুলোকে শয়তানদের প্রতি নিক্ষেপের উপকরণ করেছি",
      ms: "Dan sesungguhnya Kami telah menghiasi langit yang hampir dengan pelita-pelita dan Kami jadikannya sebagai pelempar syaitan",
      fr: "And We have adorned the nearest heaven with lamps and made them pelted at the devils", sus: "And We have adorned the nearest heaven with lamps and made them pelted at the devils"
    },
    surahAyah: "الملك:5", ayahNumber: 5,
    hint: "تعني النار الحارقة الشديدة، الكلمة تبدأ بحرف الـ س...",
    correctVerse: "وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ",
    correctVerseMeaning: "And We have prepared for them the punishment of the blazing fire",
    options: [
      { text: "الشَّيَاطِينَ", isCorrect: false },
      { text: "عَذَابَ", isCorrect: false },
      { text: "السَّعِيرِ", isCorrect: true },
      { text: "طِبَاقًا", isCorrect: false },
    ],
  },
  {
    id: "v58", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "نَذِيرٌ",
    targetWordMeaning: "Warner / One who warns",
    targetWordTranslations: {
      en: "Warner / One who warns", ar: "المحذِّر والمنبه", id: "Pemberi peringatan", tr: "Uyarıcı", zh: "警告者",
      sw: "Mwonya / Mtahadharisha", so: "Digniiye", bs: "Opominjač / Onaj koji opominje", sq: "Paralajmëruesi", ru: "Предостерегающий / Увещеватель",
      ur: "ڈرانے والا", bn: "সতর্ককারী", ms: "Pemberi amaran",
      fr: "Avertisseur / Celui qui avertit", sus: "Bɔndɛyi"
    },
    correctVerseMeaningTranslations: {
      en: "Indeed we are warners",
      ar: "إنا لنحن المنذرون",
      id: "Sesungguhnya kami adalah pemberi peringatan",
      tr: "Biz gerçekten uyarıcılarız",
      zh: "我们确是警告者",
      sw: "Bila shaka sisi ni waonyaji",
      so: "Runtii anagu waxaan nahay digniin bixiyayaasha",
      bs: "Mi smo zaista opominjači",
      sq: "Ne me të vërtetë jemi paralajmërues",
      ru: "Воистину Мы являемся предостерегающими",
      ur: "بے شک ہم خبردار کرنے والے ہیں",
      bn: "নিশ্চয়ই আমরা সতর্ককারী",
      ms: "Sesungguhnya kami adalah pemberi amaran",
      fr: "Indeed we are warners", sus: "Indeed we are warners"
    },
    surahAyah: "الملك:8", ayahNumber: 8,
    hint: "تعني الشخص الذي يحذّر ويخبر بالخطر، الكلمة تبدأ بحرف الـ ن...",
    correctVerse: "قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ",
    correctVerseMeaning: "They said yes indeed a warner came to us",
    options: [
      { text: "جَاءَنَا", isCorrect: false },
      { text: "قَالُوا", isCorrect: false },
      { text: "بَلَىٰ", isCorrect: false },
      { text: "نَذِيرٌ", isCorrect: true },
    ],
  },
  {
    id: "v59", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "زَفِيرٌ",
    targetWordMeaning: "Raging roar / Moaning sound",
    targetWordTranslations: {
      en: "Raging roar / Moaning", ar: "صوت الغليان والزفير الشديد", id: "Suara gemuruh / Raungan", tr: "Uğultu / İnilti", zh: "咆哮声",
      sw: "Ngurumo / Mlio mkali", so: "Codka daran", bs: "Tutnjava / Jecanje", sq: "Ulurimë / Zë i furishëm", ru: "Рёв / Стон",
      ur: "چنگھاڑ / غرغرانے کی آواز", bn: "গর্জন / হাহাকার", ms: "Bunyi gemuruh / Raungan",
      fr: "Rugissement / Gémissement", sus: "Xɔ Belebele"
    },
    correctVerseMeaningTranslations: {
      en: "They heard its raging roar as it boiled over",
      ar: "سمعوا لها شهيقا وهي تفور",
      id: "Mereka mendengar suara gemuruhnya ketika mendidih",
      tr: "Kaynayarak homurdanırken onun uğultusunu duydular",
      zh: "他们听到它沸腾时发出的咆哮声",
      sw: "Walisikia ngurumo yake ikivimba",
      so: "Waxay maqleen cod darankeeda iyada oo karaya",
      bs: "Čuli su tutnjavu dok je vrela",
      sq: "Dëgjuan ulurimën e saj ndërkohë që vlonte",
      ru: "Они услышали её рёв когда она бурлила",
      ur: "انہوں نے اس کی چنگھاڑ سنی جب وہ جوش کھا رہی تھی",
      bn: "তারা তার গর্জন শুনল যখন তা উথলে উঠছিল",
      ms: "Mereka mendengar bunyi gemuruhnya ketika mendidih",
      fr: "They heard its raging roar as it boiled over", sus: "They heard its raging roar as it boiled over"
    },
    surahAyah: "الملك:7", ayahNumber: 7,
    hint: "تعني الصوت الشديد من الغضب أو الاحتراق، الكلمة تبدأ بحرف الـ ز...",
    correctVerse: "سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ",
    correctVerseMeaning: "They heard its raging roar as it boiled over",
    options: [
      { text: "شَهِيقًا", isCorrect: true },
      { text: "تَفُورُ", isCorrect: false },
      { text: "سَمِعُوا", isCorrect: false },
      { text: "نَذِيرٌ", isCorrect: false },
    ],
  },
  {
    id: "v60", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "أَمَنتُمْ",
    targetWordMeaning: "Do you feel secure / Are you sure",
    targetWordTranslations: {
      en: "Do you feel secure", ar: "هل تأمنون وتطمئنون", id: "Apakah kamu merasa aman", tr: "Emin misiniz / Güvende misiniz", zh: "你们感到安全吗",
      sw: "Je, mnahisi usalama", so: "Ma ammaan tahay", bs: "Jeste li sigurni", sq: "A ndiheni të sigurt", ru: "Разве вы чувствуете себя в безопасности",
      ur: "کیا تم بے خوف ہو", bn: "তোমরা কি নিরাপদ মনে করছ", ms: "Adakah kamu berasa aman",
      fr: "Êtes-vous en sécurité / Sûr", sus: "I Yaabixi"
    },
    correctVerseMeaningTranslations: {
      en: "Do you feel secure that He who is above the sky will not cause the earth to swallow you",
      ar: "أأمنتم من في السماء أن يخسف بكم الأرض",
      id: "Apakah kamu merasa aman bahwa Dia yang di langit tidak akan menelan kamu ke dalam bumi",
      tr: "Göktekinin sizi yere batırmamasından emin misiniz",
      zh: "你们是否对天上的那位感到安全，他不会让大地将你们吞没",
      sw: "Je, mnahisi usalama dhidi ya Aliye mbinguni asimchimbie ardhi",
      so: "Ma aaminsan tahay in Kan Samada ku jira uusan dhulka ku nuuginin",
      bs: "Jeste li sigurni da Onaj koji je na nebu neće dati da vas zemlja proguta",
      sq: "A ndiheni të sigurt se Ai që është mbi qiell nuk do t'ju gëlltisë tokën",
      ru: "Разве вы уверены что Тот кто на небе не повелит земле поглотить вас",
      ur: "کیا تم بے خوف ہو کہ جو آسمان میں ہے وہ تمہیں زمین میں دھنسا دے",
      bn: "তোমরা কি নিরাপদ মনে করছ যে আকাশে যিনি আছেন তিনি তোমাদের ভূমিতে ধ্বসিয়ে দেবেন না",
      ms: "Apakah kamu merasa aman bahawa Dia yang di langit tidak akan menenggelamkan kamu ke dalam bumi",
      fr: "Do you feel secure that He who is above the sky will not cause the earth to swallow you", sus: "Do you feel secure that He who is above the sky will not cause the earth to swallow you"
    },
    surahAyah: "الملك:16", ayahNumber: 16,
    hint: "استفهام تحذيري، تعني هل تشعر بالأمان؟",
    correctVerse: "أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ",
    correctVerseMeaning: "Do you feel secure that He who is in the sky will not cause the earth to swallow you",
    options: [
      { text: "يَخْسِفَ", isCorrect: false },
      { text: "السَّمَاءِ", isCorrect: false },
      { text: "أَأَمِنتُم", isCorrect: true },
      { text: "الْأَرْضَ", isCorrect: false },
    ],
  },
  {
    id: "v61", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "الطَّيْرِ",
    targetWordMeaning: "The birds",
    targetWordTranslations: {
      en: "The birds", ar: "الطيور", id: "Burung-burung", tr: "Kuşlar", zh: "鸟儿",
      sw: "Ndege", so: "Shimbiraha", bs: "Ptice", sq: "Zogjtë", ru: "Птицы",
      ur: "پرندے", bn: "পাখিরা", ms: "Burung-burung",
      fr: "Les oiseaux", sus: "Sunɛe"
    },
    correctVerseMeaningTranslations: {
      en: "Do they not see the birds above them spreading and folding their wings",
      ar: "أولم يروا إلى الطير فوقهم صافات ويقبضن",
      id: "Tidakkah mereka melihat burung-burung di atas mereka yang mengembangkan dan mengepakkan sayap",
      tr: "Üstlerindeki kuşları görmüyorlar mı kanatlarını açarak ve kısarak uçarken",
      zh: "他们难道没有看到他们头上的鸟儿张开翅膀又收拢",
      sw: "Je, hawakuona ndege juu yao wakitandaza na kukunja mabawa",
      so: "Miyeyna arag shimbiraha kor kooda ah oo ballaariya oo go'aya",
      bs: "Zar ne vide ptice iznad sebe kako raskriljuju i sklapaju krila",
      sq: "A nuk i shohin zogjtë mbi ta duke hapur dhe mbledhur krahët",
      ru: "Разве они не видят птиц над ними раскрывающих и складывающих крылья",
      ur: "کیا انہوں نے اپنے اوپر پرندوں کو نہیں دیکھا جو پر پھیلاتے اور سمیٹتے ہیں",
      bn: "তারা কি তাদের উপরের পাখিগুলোকে দেখেনি যারা ডানা প্রসারিত করে ও গুটিয়ে নেয়",
      ms: "Tidakkah mereka melihat burung-burung di atas mereka mengembang dan mengepak sayap",
      fr: "Do they not see the birds above them spreading and folding their wings", sus: "Do they not see the birds above them spreading and folding their wings"
    },
    surahAyah: "الملك:19", ayahNumber: 19,
    hint: "الكائنات التي تطير في السماء، الكلمة تبدأ بحرف الـ ط...",
    correctVerse: "أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ",
    correctVerseMeaning: "Do they not see the birds above them spreading their wings",
    options: [
      { text: "فَوْقَهُمْ", isCorrect: false },
      { text: "صَافَّاتٍ", isCorrect: false },
      { text: "الطَّيْرِ", isCorrect: true },
      { text: "يَرَوْا", isCorrect: false },
    ],
  },
  {
    id: "v62", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "يُمْسِكُهُنَّ",
    targetWordMeaning: "Who holds them / Keeps them up",
    targetWordTranslations: {
      en: "Who holds them / Keeps them up", ar: "من يمسك بهن ويبقيهن", id: "Yang menahan mereka", tr: "Onları tutan", zh: "谁托住它们",
      sw: "Anayezishikilia", so: "Kan haysta", bs: "Onaj koji ih drži", sq: "Ai që i mban", ru: "Удерживающий их",
      ur: "انہیں تھامنے والا", bn: "যিনি তাদের ধরে রাখেন", ms: "Yang menahannya",
      fr: "Qui les retient / Soutient", sus: "E Mara Mɔɔ"
    },
    correctVerseMeaningTranslations: {
      en: "None holds them up except the Most Merciful",
      ar: "ما يمسكهن إلا الرحمن",
      id: "Tidak ada yang menahannya kecuali Allah Yang Maha Pengasih",
      tr: "Onları tutan ancak Rahmân'dır",
      zh: "托住它们的只有至仁主",
      sw: "Hakuna anayezishikilia isipokuwa Mwingi wa rehema",
      so: "Ma jirto wax haysa haddaan ahayn Naxariistaha",
      bs: "Ništa ih ne drži osim Milostivog",
      sq: "Asgjë nuk i mban ato përveç të Gjithëmëshirshmit",
      ru: "Никто их не удерживает кроме Милосердного",
      ur: "انہیں رحمان کے سوا کوئی نہیں تھامتا",
      bn: "রহমান ছাড়া কেউ তাদের ধরে রাখে না",
      ms: "Tidak ada yang menahannya melainkan Ar-Rahman",
      fr: "None holds them up except the Most Merciful", sus: "None holds them up except the Most Merciful"
    },
    surahAyah: "الملك:19", ayahNumber: 19,
    hint: "أكمل الآية: مَا ___ إِلَّا الرَّحْمَٰنُ",
    correctVerse: "مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ",
    correctVerseMeaning: "None holds them up except the Most Merciful",
    options: [
      { text: "الرَّحْمَٰنُ", isCorrect: false },
      { text: "الطَّيْرِ", isCorrect: false },
      { text: "يُمْسِكُهُنَّ", isCorrect: true },
      { text: "فَوْقَهُمْ", isCorrect: false },
    ],
  },
  {
    id: "v63", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "ذَلُولًا",
    targetWordMeaning: "Tame / Subservient / Easy to walk on",
    targetWordTranslations: {
      en: "Tame / Subservient", ar: "مذللة وسهلة", id: "Jinak / Tunduk", tr: "Boyun eğmiş / Yumuşak", zh: "驯服的",
      sw: "Nyoofu / Laini", so: "Hooseysa / Xoogan", bs: "Krotak / Podređen", sq: "I butë / I nënshtruar", ru: "Покорная / Смирная",
      ur: "مسخر / نرم", bn: "বশীভূত / নম্র", ms: "Patuh / Jinak",
      fr: "Soumis / Docile", sus: "Yekeyeke"
    },
    correctVerseMeaningTranslations: {
      en: "It is He who made the earth subservient to you, so walk upon its slopes",
      ar: "هو الذي جعل لكم الأرض ذلولا فامشوا في مناكبها",
      id: "Dialah yang menjadikan bumi itu mudah bagimu maka berjalanlah di pundak-pundaknya",
      tr: "O, yeri sizin için boyun eğdiren O dur öyleyse onun omuzlarında yürüyün",
      zh: "他使大地为你们温顺，所以在它的山脊上行走",
      sw: "Yeye ndiye aliyeifanya ardhi kuwa nyoofu kwenu basi tembeeni katika miguu yake",
      so: "Waa Kii dhulka idiinka dhigay mid la dhisi karo oo u socodda dhinaceeda",
      bs: "On vam je Zemlju podložnom učinio pa hodajte njezinim predjelima",
      sq: "Ai është i cili e bëri tokën të nënshtrueshme për ju, pra ecni nëpër krahinat e saj",
      ru: "Он сделал для вас землю покорной поэтому ходите по её просторам",
      ur: "وہی ہے جس نے تمہارے لیے زمین کو مسخر کیا پس اس کے کناروں پر چلو",
      bn: "তিনিই তোমাদের জন্য পৃথিবীকে বশীভূত করেছেন তাই এর পথে চলাফেরা কর",
      ms: "Dialah yang menjadikan bumi tunduk untuk kamu maka berjalanlah di merata-rata",
      fr: "It is He who made the earth subservient to you, so walk upon its slopes", sus: "It is He who made the earth subservient to you, so walk upon its slopes"
    },
    surahAyah: "الملك:15", ayahNumber: 15,
    hint: "تعني الأرض المطيعة السهلة المشي، الكلمة تبدأ بحرف الـ ذ...",
    correctVerse: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا",
    correctVerseMeaning: "It is He who made the earth tame and subservient for you",
    options: [
      { text: "الْأَرْضَ", isCorrect: false },
      { text: "جَعَلَ", isCorrect: false },
      { text: "ذَلُولًا", isCorrect: true },
      { text: "لَكُمُ", isCorrect: false },
    ],
  },
  {
    id: "v64", surahAr: "الملك", surahEn: "Al-Mulk",
    targetWord: "الرِّزْقَ",
    targetWordMeaning: "Sustenance / Provision",
    targetWordTranslations: {
      en: "Sustenance / Provision", ar: "الرزق والقوت", id: "Rezeki / Karunia", tr: "Rızık / Geçimlik", zh: "给养 / 食粮",
      sw: "Riziki / Chakula", so: "Rizqiga", bs: "Opskrba / Nafaka", sq: "Furnizimi / Ushqimi", ru: "Пропитание / Удел",
      ur: "رزق / روزی", bn: "রিজিক / জীবিকা", ms: "Rezeki / Pemberian",
      fr: "Subsistance / Provision", sus: "Risiki"
    },
    correctVerseMeaningTranslations: {
      en: "And seek His provision",
      ar: "وابتغوا من رزقه",
      id: "Dan carilah rezeki dari karunia-Nya",
      tr: "Ve onun rızkını isteyin",
      zh: "并寻求他的给养",
      sw: "Na utafuteni riziki yake",
      so: "Ugaadhsiga rizqigiisa",
      bs: "I tražite opskrbu Njegovu",
      sq: "Dhe kërkoni nga furnizimi i Tij",
      ru: "И ищите Его удел",
      ur: "اور اس کا رزق تلاش کرو",
      bn: "এবং তাঁর রিজিক তালাশ কর",
      ms: "Dan carilah rezeki dari kurnia-Nya",
      fr: "And seek His provision", sus: "And seek His provision"
    },
    surahAyah: "الملك:15", ayahNumber: 15,
    hint: "تعني القوت والطعام والمال من الله، الكلمة تبدأ بحرف الـ ر...",
    correctVerse: "وَابْتَغُوا مِن رِّزْقِهِ",
    correctVerseMeaning: "And seek His provision",
    options: [
      { text: "وَابْتَغُوا", isCorrect: false },
      { text: "رِّزْقِهِ", isCorrect: true },
      { text: "ذَلُولًا", isCorrect: false },
      { text: "مِن", isCorrect: false },
    ],
  },
];

VOCAB_BANK.push(...(JUZ_AMMA_BANK as unknown as VocabularyExercise[]));

// ── Verse maps (built once at module load) ───────────────────────────────────
// Maps surahAr → (ayahNumber → verseText), used by the option validator when
// a single ayah doesn't provide enough distinct words for 4 options.
const SURAH_VERSE_MAPS: Map<string, Map<number, string>> = buildSurahVerseMaps(
  VOCAB_BANK.map(e => ({ surahAr: e.surahAr, ayahNumber: e.ayahNumber, correctVerse: e.correctVerse }))
);

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getVocabBankSurahs(): { surahAr: string; surahEn: string; count: number }[] {
  const surahMap: Record<string, { surahAr: string; surahEn: string; count: number }> = {};
  for (const ex of VOCAB_BANK) {
    if (!surahMap[ex.surahAr]) {
      surahMap[ex.surahAr] = { surahAr: ex.surahAr, surahEn: ex.surahEn, count: 0 };
    }
    surahMap[ex.surahAr].count++;
  }
  return Object.values(surahMap);
}

export async function generateVocabularyExercise(userLanguage: string = 'en', surahFilter?: string): Promise<VocabularyExercise & { translatedWordMeaning: string; translatedVerseMeaning: string }> {

  // Build the candidate pool for this request
  const pool: VocabularyExercise[] = (() => {
    if (surahFilter) {
      const filtered = VOCAB_BANK.filter(e => e.surahAr === surahFilter || e.surahEn === surahFilter);
      return filtered.length > 0 ? filtered : VOCAB_BANK;
    }
    const allSurahs = [...new Set(VOCAB_BANK.map(e => e.surahAr))];
    const fatihaEntries = VOCAB_BANK.filter(e => e.surahAr === 'الفاتحة');
    let targetSurah: string;
    if (fatihaEntries.length > 0 && Math.random() < 0.30) {
      targetSurah = 'الفاتحة';
    } else {
      const otherSurahs = allSurahs.filter(s => s !== 'الفاتحة');
      targetSurah = otherSurahs.length > 0
        ? otherSurahs[Math.floor(Math.random() * otherSurahs.length)]
        : allSurahs[Math.floor(Math.random() * allSurahs.length)];
    }
    return VOCAB_BANK.filter(e => e.surahAr === targetSurah);
  })();

  // Try exercises from the pool until one passes the option-in-passage gate.
  // Shuffle the pool so we try different exercises on each request.
  const shuffledPool = shuffleArray([...pool]);

  for (const candidate of shuffledPool) {
    const surahVerseMap = SURAH_VERSE_MAPS.get(candidate.surahAr);

    const validated = validateAndRebuildOptions(
      candidate.targetWord,
      candidate.correctVerse,
      candidate.ayahNumber,
      candidate.options,
      surahVerseMap,
    );

    if (validated === null) {
      // This exercise cannot be built with valid options — skip it
      continue;
    }

    const translatedWordMeaning =
      candidate.targetWordTranslations[userLanguage] ||
      candidate.targetWordTranslations['en'] ||
      candidate.targetWordMeaning;
    const translatedVerseMeaning =
      candidate.correctVerseMeaningTranslations[userLanguage] ||
      candidate.correctVerseMeaningTranslations['en'] ||
      candidate.correctVerseMeaning;

    return {
      ...candidate,
      id: `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      options: validated.options,
      targetWordMeaning: translatedWordMeaning,
      correctVerseMeaning: translatedVerseMeaning,
      translatedWordMeaning,
      translatedVerseMeaning,
      // Pass through context fields so the frontend can show the correct passage
      displayedPassageText: validated.displayedPassageText,
      contextMode: validated.contextMode,
    };
  }

  // Absolute fallback: return any exercise with shuffled options if all fail
  // (should not happen given the current bank, but protects against empty pools)
  const fallback = pool[Math.floor(Math.random() * pool.length)];
  const translatedWordMeaning =
    fallback.targetWordTranslations[userLanguage] ||
    fallback.targetWordTranslations['en'] ||
    fallback.targetWordMeaning;
  const translatedVerseMeaning =
    fallback.correctVerseMeaningTranslations[userLanguage] ||
    fallback.correctVerseMeaningTranslations['en'] ||
    fallback.correctVerseMeaning;
  return {
    ...fallback,
    id: `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    options: shuffleArray(fallback.options),
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
