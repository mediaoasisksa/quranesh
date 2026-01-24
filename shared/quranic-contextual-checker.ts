/**
 * نظام التحقق السياقي للمركزية القرآنية
 * Quranic Contextual Validation System
 * 
 * يضمن هذا النظام:
 * 1. التطابق السياقي: هل المعنى اللغوي للآية يدعم الموقف الاجتماعي؟
 * 2. تعظيم النص: هل استخدام الآية في هذا الموقف يرفع من شأنها؟
 * 3. المرجعية العقدية: منع تعليق فعل المخلوق بقدرة مستقلة عن الخالق
 */

// آيات تتحدث عن صفات الله وقدرته المطلقة - لا تستخدم للأفعال البشرية الروتينية
export const DIVINE_ATTRIBUTE_VERSES = [
  'إن وعد الله حق',
  'وعد الله الذي لا يخلف الله وعده',
  'إن الله على كل شيء قدير',
  'وإلى الله ترجع الأمور',
  'إن إلى ربك الرجعى',
  'والله غالب على أمره',
  'إن الله بالغ أمره',
  'كن فيكون',
  'إنما أمره إذا أراد شيئاً',
  'وما تشاؤون إلا أن يشاء الله',
  'لله الأمر من قبل ومن بعد',
];

// آيات المشيئة المناسبة للأفعال المستقبلية البشرية
export const MASHIA_VERSES = [
  'إن شاء الله',
  'ستجدني إن شاء الله صابراً',
  'ستجدني إن شاء الله من الصالحين',
  'سيهدين ربي',
  'عسى أن يهدين ربي',
  'ولا تقولن لشيء إني فاعل ذلك غداً إلا أن يشاء الله',
  'ما شاء الله لا قوة إلا بالله',
  'عسى ربي أن يهديني',
  'إن أراد الله',
  'بإذن الله',
];

// كلمات تدل على الأفعال المستقبلية
export const FUTURE_ACTION_KEYWORDS = [
  'متى',
  'غداً',
  'سوف',
  'سأفعل',
  'ستفعل',
  'سأحضر',
  'ستحضر',
  'هل ستذهب',
  'هل ستأتي',
  'سأعود',
  'ستعود',
  'هل تؤكد',
  'تأكيد',
  'موعد',
  'خطة',
  'نية',
];

// مواقف تتطلب استخدام آيات المشيئة
export const CONTEXTS_REQUIRING_MASHIA = [
  'تأكيد الحضور',
  'الوعد بالقيام بشيء',
  'التخطيط للمستقبل',
  'الالتزام بموعد',
  'تحديد وقت الوصول',
  'الذهاب لمكان',
  'العودة للبيت',
  'إتمام مهمة',
];

// مواقف لا يجوز فيها استخدام آيات الصفات الإلهية
export const FORBIDDEN_DIVINE_VERSE_CONTEXTS = [
  'تأكيد حضور شخصي',
  'موعد عمل',
  'موعد اجتماع',
  'السفر والتنقل',
  'الوصول لمكان',
  'إتمام مهمة يومية',
];

export interface ContextualCheckResult {
  isValid: boolean;
  errorType?: 'DIVINE_VERSE_MISUSE' | 'MISSING_MASHIA' | 'CONTEXT_MISMATCH';
  errorMessage?: string;
  suggestedCorrection?: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * التحقق من مناسبة الآية للموقف
 */
export function checkVerseContextMatch(
  question: string,
  suggestedVerse: string
): ContextualCheckResult {
  const questionLower = question.toLowerCase();
  const verseLower = suggestedVerse.toLowerCase();
  
  // التحقق من استخدام آيات الصفات الإلهية في مواقف بشرية روتينية
  const usesDivineVerse = DIVINE_ATTRIBUTE_VERSES.some(verse => 
    suggestedVerse.includes(verse) || verseLower.includes(verse.toLowerCase())
  );
  
  const isFutureAction = FUTURE_ACTION_KEYWORDS.some(keyword => 
    question.includes(keyword)
  );
  
  const usesMashia = MASHIA_VERSES.some(verse => 
    suggestedVerse.includes(verse) || verseLower.includes(verse.toLowerCase())
  );
  
  // خطأ: استخدام آية إلهية لموقف بشري روتيني
  if (usesDivineVerse && isFutureAction) {
    return {
      isValid: false,
      errorType: 'DIVINE_VERSE_MISUSE',
      errorMessage: 'خطأ في المرجعية: هذا الربط يشوه المفهوم القرآني. لا يجوز استخدام آيات الصفات الإلهية للأفعال البشرية الروتينية.',
      suggestedCorrection: 'استخدم آية تتضمن مفهوم المشيئة مثل: "ستجدني إن شاء الله صابراً" أو "إن شاء الله"',
      severity: 'error'
    };
  }
  
  // تحذير: فعل مستقبلي بدون ذكر المشيئة
  if (isFutureAction && !usesMashia) {
    return {
      isValid: false,
      errorType: 'MISSING_MASHIA',
      errorMessage: 'تنبيه: الأفعال المستقبلية يجب أن ترتبط بمفهوم المشيئة وفقاً للآية 23-24 من سورة الكهف.',
      suggestedCorrection: 'أضف "إن شاء الله" أو استخدم آية تتضمن المشيئة',
      severity: 'warning'
    };
  }
  
  return {
    isValid: true,
    severity: 'info'
  };
}

/**
 * التحقق الشامل للتمرين قبل النشر
 */
export function validateExerciseBeforePublish(
  question: string,
  suggestedVerse: string,
  category?: string
): ContextualCheckResult {
  // التحقق الأساسي
  const basicCheck = checkVerseContextMatch(question, suggestedVerse);
  if (!basicCheck.isValid) {
    return basicCheck;
  }
  
  // تحققات إضافية يمكن إضافتها لاحقاً
  
  return {
    isValid: true,
    severity: 'info'
  };
}

/**
 * الحصول على الآية المناسبة لموقف معين
 */
export function getSuggestedVerseForContext(question: string): string[] {
  const isFutureAction = FUTURE_ACTION_KEYWORDS.some(keyword => 
    question.includes(keyword)
  );
  
  if (isFutureAction) {
    return MASHIA_VERSES;
  }
  
  return [];
}

/**
 * قواعد المركزية القرآنية
 */
export const QURANIC_CENTRALITY_RULES = {
  rule1: {
    name: 'تعليق الفعل بالمشيئة',
    description: 'كل فعل مستقبلي يجب أن يُعلّق بمشيئة الله',
    reference: 'سورة الكهف: 23-24'
  },
  rule2: {
    name: 'تعظيم النص القرآني',
    description: 'لا تستخدم الآيات في مواقف تبتذل معناها',
    reference: 'مبدأ التعظيم'
  },
  rule3: {
    name: 'منع الاستلاب المعرفي',
    description: 'لا تفصل الفعل عن مرجعيته الإلهية',
    reference: 'المركزية القرآنية - د. نايف بن نهار'
  }
};
