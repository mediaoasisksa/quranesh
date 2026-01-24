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
 * Check if answer matches evidence phrase
 * التحقق من تطابق الإجابة مع العبارة المطلوبة
 */
export function checkAnswerMatch(
  userAnswer: string,
  evidencePhrase: string,
  answerMode: 'EXACT_PHRASE' | 'CONTAINS_PHRASE',
  acceptedVariants?: string[]
): { isMatch: boolean; matchType: 'exact' | 'partial' | 'variant' | 'none' } {
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
        return { isMatch: true, matchType: 'variant' };
      }
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
  
  // التحقق من طول العبارة (2-10 كلمات)
  const wordCount = evidencePhrase.trim().split(/\s+/).length;
  if (wordCount < 2) {
    errors.push('العبارة قصيرة جداً (أقل من كلمتين)');
  }
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
  matchResult: { isMatch: boolean; matchType: string },
  hint?: string
): { title: string; description: string } {
  if (matchResult.isMatch) {
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
