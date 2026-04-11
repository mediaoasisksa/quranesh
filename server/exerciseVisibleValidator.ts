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
