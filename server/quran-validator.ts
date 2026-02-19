import { db } from "./db";
import { quranicExpressions } from "@shared/schema";
import { sql, isNull, eq, or } from "drizzle-orm";

const NON_QURANIC_PHRASES = new Set([
  "إن شاء الله",
  "ان شاء الله",
  "بارك الله لك",
  "بارك الله فيك",
  "بارك الله لكم",
  "جزاك الله خيراً",
  "جزاك الله خيرا",
  "على بركة الله",
  "الله أكبر",
  "سبحان الله",
  "لا حول ولا قوة إلا بالله",
  "ما شاء الله",
  "أستغفر الله",
  "الحمد لله على كل حال",
  "سبحان الله وبحمده",
  "سبحان الله العظيم",
  "لا إله إلا الله",
  "بسم الله",
  "بسم الله الرحمن الرحيم",
  "توكلت على الله",
  "حسبي الله",
  "يا الله",
  "اللهم صل على محمد",
  "صلى الله عليه وسلم",
  "رضي الله عنه",
  "رحمه الله",
  "بارك الله",
  "هداك الله",
  "يرحمك الله",
  "مسلمة",
  "مسلم",
]);

export function isNonQuranicPhrase(text: string): boolean {
  const normalized = text
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return NON_QURANIC_PHRASES.has(normalized);
}

export function hasValidSurahReference(surahAyah: string | null | undefined): boolean {
  if (!surahAyah || surahAyah === "" || surahAyah === "derived") return false;
  const hasColon = surahAyah.includes(":") || surahAyah.includes(":");
  const hasArabicName = /[\u0600-\u06FF]/.test(surahAyah);
  return hasColon || hasArabicName;
}

export interface QuranicValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateQuranicAnswer(
  arabicText: string,
  surahAyah: string | null | undefined
): QuranicValidationResult {
  if (!arabicText || arabicText.trim().length === 0) {
    return { isValid: false, reason: "Empty text" };
  }

  if (isNonQuranicPhrase(arabicText)) {
    return {
      isValid: false,
      reason: `"${arabicText}" is a common Islamic phrase but NOT a literal Quranic verse`,
    };
  }

  if (!hasValidSurahReference(surahAyah)) {
    return {
      isValid: false,
      reason: "Missing Surah name and verse number reference",
    };
  }

  return { isValid: true };
}

export async function cleanBadExercisesFromDB(): Promise<{
  removedExpressions: number;
  removedExercises: number;
}> {
  const badExpressions = await db
    .select({ id: quranicExpressions.id, arabicText: quranicExpressions.arabicText })
    .from(quranicExpressions)
    .where(
      or(
        isNull(quranicExpressions.surahAyah),
        eq(quranicExpressions.surahAyah, "")
      )
    );

  let removedExpressions = 0;
  let removedExercises = 0;

  for (const expr of badExpressions) {
    if (isNonQuranicPhrase(expr.arabicText)) {
      const linkedExercises = await db.execute(
        sql`DELETE FROM daily_sentence_exercises WHERE correct_expression_id = ${expr.id} OR ${expr.id} = ANY(distractor_ids) RETURNING id`
      );
      removedExercises += (linkedExercises as any).length || 0;

      await db.execute(
        sql`DELETE FROM quranic_expressions WHERE id = ${expr.id}`
      );
      removedExpressions++;
    }
  }

  return { removedExpressions, removedExercises };
}
