import {
  buildVisibleArabicSet,
  normalizeArabic,
} from "../shared/arabicVisibleTokens";

export type ExerciseChoice = {
  id?: string;
  text: string;
};

export type GeneratedExercise = {
  displayedArabicText: string;
  sourceAyahText?: string;
  answerArabic: string;
  choices: ExerciseChoice[];
};

// ─── Final pre-save / pre-publish gate ───────────────────────────────────────

/**
 * validateDisplayedArabicTokenSet
 * ================================
 * The canonical final gate before any exercise is saved or served.
 *
 * Algorithm:
 *   1. Take displayedArabicText — the EXACT text visible to the student.
 *   2. Build displayedArabicTokenSet using unified normalization:
 *        - Remove tashkeel (U+064B–U+065F, U+0670, U+06D6–U+06ED)
 *        - Remove tatweel (U+0640)
 *        - Normalize alef variants (أ إ آ ٱ) → ا
 *        - Normalize ؤ → و , ئ → ي , ى → ي
 *        - Remove punctuation, collapse whitespace
 *        - Split on spaces → whole-word token set
 *   3. Check EVERY choice against the token set.
 *   4. If ANY choice is NOT in displayedArabicTokenSet → REJECT.
 *
 * Fail-closed contract:
 *   - Returns { ok: false } when validation fails — caller MUST reject the exercise.
 *   - No silent fallback. No partial pass. Either 100% or nothing.
 *   - badChoices lists every failing choice for logging purposes.
 *
 * Prohibited inputs (all caught by this gate):
 *   ✗ Distractors from same surah if not visible in displayed text
 *   ✗ Words from adjacent undisplayed ayahs
 *   ✗ Similar roots (only exact normalized surface token is allowed)
 *   ✗ Interpretive words or synonyms not present in passage
 *   ✗ Words from any external bank not shown to the student
 */
export function validateDisplayedArabicTokenSet(
  displayedArabicText: string,
  choices: string[]
): { ok: true; tokenSet: Set<string> } | { ok: false; reason: string; badChoices: string[] } {
  if (!displayedArabicText?.trim()) {
    return {
      ok: false,
      reason: "displayedArabicText is empty — cannot build token set",
      badChoices: [],
    };
  }

  const tokenSet = buildVisibleArabicSet(displayedArabicText);

  if (tokenSet.size === 0) {
    return {
      ok: false,
      reason: "No Arabic tokens found in displayedArabicText",
      badChoices: [],
    };
  }

  const badChoices = choices.filter(c => !tokenSet.has(normalizeArabic(c.trim())));

  if (badChoices.length > 0) {
    return {
      ok: false,
      reason: `Choice(s) not in displayedArabicTokenSet: [${badChoices.join(", ")}]`,
      badChoices,
    };
  }

  return { ok: true, tokenSet };
}

// ─── Full exercise validator (answer + choices + duplicate check) ─────────────

/**
 * validateExerciseUsesOnlyVisibleArabic
 * =======================================
 * Extended gate that checks the answer word AND all choices against
 * displayedArabicText, plus duplicate-choice detection.
 *
 * Use this for the full GeneratedExercise shape.
 * Use validateDisplayedArabicTokenSet() when you only have raw choice strings.
 */
export function validateExerciseUsesOnlyVisibleArabic(
  exercise: GeneratedExercise
): { ok: true } | { ok: false; reason: string } {
  if (!exercise.displayedArabicText?.trim()) {
    return { ok: false, reason: "displayedArabicText is empty" };
  }

  const visibleSet = buildVisibleArabicSet(exercise.displayedArabicText);

  if (!visibleSet.size) {
    return { ok: false, reason: "No visible Arabic tokens found" };
  }

  const normalizedAnswer = normalizeArabic(exercise.answerArabic);
  if (!visibleSet.has(normalizedAnswer)) {
    return {
      ok: false,
      reason: `Answer is not visible to learner: ${exercise.answerArabic}`,
    };
  }

  if (!exercise.choices || exercise.choices.length < 2) {
    return { ok: false, reason: "Not enough choices" };
  }

  for (const choice of exercise.choices) {
    const norm = normalizeArabic(choice.text);
    if (!visibleSet.has(norm)) {
      return {
        ok: false,
        reason: `Choice is not visible in displayed text: ${choice.text}`,
      };
    }
  }

  const uniqueChoiceNorms = new Set(
    exercise.choices.map((c) => normalizeArabic(c.text))
  );

  if (uniqueChoiceNorms.size !== exercise.choices.length) {
    return { ok: false, reason: "Duplicate choices after normalization" };
  }

  return { ok: true };
}
