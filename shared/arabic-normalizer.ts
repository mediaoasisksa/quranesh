/**
 * Arabic Text Normalizer for Answer Validation
 * تطبيع النص العربي للمقارنة في التمارين
 */

/**
 * Normalize Arabic text for comparison
 * إزالة التشكيل والتطويل وتوحيد الحروف
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  
  let normalized = text;
  
  // إزالة التشكيل (الحركات)
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');
  
  // إزالة التطويل
  normalized = normalized.replace(/ـ/g, '');
  
  // توحيد الهمزات
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  normalized = normalized.replace(/ؤ/g, 'و');
  normalized = normalized.replace(/ئ/g, 'ي');
  
  // توحيد الياء والألف المقصورة
  normalized = normalized.replace(/ى/g, 'ي');
  
  // توحيد التاء المربوطة
  normalized = normalized.replace(/ة/g, 'ه');
  
  // إزالة علامات الترقيم
  normalized = normalized.replace(/[،.؟!:;«»"']/g, '');
  
  // تقليل المسافات المتكررة
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Strip definite article (ال) from Arabic word for flexible matching
 * تجريد أل التعريف من الكلمة للمقارنة المرنة
 */
export function stripDefiniteArticle(text: string): string {
  if (!text) return '';
  let stripped = text.trim();
  // Remove leading ال (with or without hamza variants)
  stripped = stripped.replace(/^(ال|أل|إل)/, '');
  return stripped;
}

/**
 * Check if answer matches evidence phrase with أل-flexible matching
 * التحقق من تطابق الإجابة مع العبارة المطلوبة (مع مرونة في أل التعريف)
 */
export function checkAnswerMatch(
  userAnswer: string,
  evidencePhrase: string,
  answerMode: 'EXACT_PHRASE' | 'CONTAINS_PHRASE',
  acceptedVariants?: string[]
): { isMatch: boolean; matchType: 'exact' | 'partial' | 'variant' | 'article_flexible' | 'none'; canonicalForm?: string } {
  const normalizedAnswer = normalizeArabic(userAnswer);
  const normalizedEvidence = normalizeArabic(evidencePhrase);
  
  // التحقق من التطابق التام
  if (normalizedAnswer === normalizedEvidence) {
    return { isMatch: true, matchType: 'exact' };
  }
  
  // التحقق من البدائل المقبولة
  if (acceptedVariants && acceptedVariants.length > 0) {
    for (const variant of acceptedVariants) {
      const normalizedVariant = normalizeArabic(variant);
      if (normalizedAnswer === normalizedVariant) {
        return { isMatch: true, matchType: 'variant', canonicalForm: evidencePhrase };
      }
    }
  }
  
  // مرونة أل التعريف — accept with/without ال
  const answerWords = normalizedAnswer.split(' ');
  const evidenceWords = normalizedEvidence.split(' ');
  if (answerWords.length === evidenceWords.length) {
    const allWordsMatch = answerWords.every((word, i) => {
      if (word === evidenceWords[i]) return true;
      const strippedAnswer = stripDefiniteArticle(word);
      const strippedEvidence = stripDefiniteArticle(evidenceWords[i]);
      return strippedAnswer === strippedEvidence && strippedAnswer.length > 0;
    });
    if (allWordsMatch && normalizedAnswer !== normalizedEvidence) {
      return { isMatch: true, matchType: 'article_flexible', canonicalForm: evidencePhrase };
    }
  }
  // Also check single-word case: answer without ال matches evidence with ال (or vice versa)
  if (answerWords.length === 1 && evidenceWords.length === 1) {
    const strippedA = stripDefiniteArticle(normalizedAnswer);
    const strippedE = stripDefiniteArticle(normalizedEvidence);
    if (strippedA === strippedE && strippedA.length > 0) {
      return { isMatch: true, matchType: 'article_flexible', canonicalForm: evidencePhrase };
    }
  }
  
  // للوضع CONTAINS_PHRASE - التحقق من احتواء العبارة
  if (answerMode === 'CONTAINS_PHRASE') {
    if (normalizedAnswer.includes(normalizedEvidence) || 
        normalizedEvidence.includes(normalizedAnswer)) {
      return { isMatch: true, matchType: 'partial' };
    }
  }
  
  return { isMatch: false, matchType: 'none' };
}

/**
 * Validate evidence exercise before saving
 * التحقق من صحة تمرين الدليل قبل الحفظ
 */
export function validateEvidenceExercise(
  claim: string,
  evidencePhrase: string,
  ayahText: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // التحقق من وجود العبارة في الآية
  const normalizedEvidence = normalizeArabic(evidencePhrase);
  const normalizedAyah = normalizeArabic(ayahText);
  
  if (!normalizedAyah.includes(normalizedEvidence)) {
    errors.push('العبارة المطلوبة غير موجودة في نص الآية');
  }
  
  // التحقق من طول العبارة (1-10 كلمات — single Quranic words allowed)
  const wordCount = evidencePhrase.trim().split(/\s+/).length;
  if (wordCount > 10) {
    errors.push('العبارة طويلة جداً (أكثر من 10 كلمات)');
  }
  
  // التحقق من أن المعنى محدد
  const genericClaims = ['الله رحيم', 'الله كريم', 'الله عظيم'];
  if (genericClaims.some(g => claim.includes(g))) {
    errors.push('المعنى المطلوب عام جداً، يرجى تحديده بسياق معين');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate better error message for user
 * توليد رسالة خطأ أفضل للمستخدم
 */
export function getEvidenceErrorMessage(
  matchResult: { isMatch: boolean; matchType: string; canonicalForm?: string },
  hint?: string
): { title: string; description: string } {
  if (matchResult.isMatch) {
    if (matchResult.matchType === 'article_flexible' && matchResult.canonicalForm) {
      return {
        title: 'إجابة صحيحة',
        description: `صحيح، والصيغة القرآنية: ${matchResult.canonicalForm}`
      };
    }
    return {
      title: 'إجابة صحيحة',
      description: matchResult.matchType === 'exact' 
        ? 'أحسنت! إجابتك مطابقة تماماً'
        : 'إجابتك صحيحة'
    };
  }
  
  return {
    title: 'حاول مرة أخرى',
    description: hint || 'اكتب العبارة القرآنية المطلوبة كما وردت في الآية (3-5 كلمات)'
  };
}
