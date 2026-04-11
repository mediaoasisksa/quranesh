/**
 * Acceptance tests for exerciseVisibleValidator.
 *
 * Run with:  npx tsx server/__tests__/exerciseVisibleValidator.test.ts
 *
 * Tests the four mandatory acceptance criteria:
 *   1. Reject option from hidden part of displayed verse
 *      (word in sourceAyahText but not in displayedArabicText)
 *   2. Reject option from undisplayed neighbouring verse
 *   3. Accept only literal visible tokens
 *   4. No cropped-text publishing (partial displayedArabicText with full-verse options)
 *
 * Specific bug-report case:
 *   Surah Al-Inshiqaq 84:6 — targetWord "كادح" (Striving/Working Hard)
 *   Full verse: "يا أيها الإنسان إنك كادح إلى ربك كدحا فملاقيه"
 *   Displayed:  "إنك كادح إلى ربك كدحا"
 *   BAD option: "الإنسان" — present in sourceAyahText but NOT in displayedArabicText → MUST FAIL
 */

import { validateExerciseUsesOnlyVisibleArabic } from "../exerciseVisibleValidator";

// ─── minimal test harness ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e: any) {
    console.error(`  ❌ FAIL: ${name}\n     ${e.message}`);
    failed++;
  }
}

function expect(val: unknown) {
  return {
    toBe(expected: unknown) {
      if (val !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
      }
    },
    toContain(sub: string) {
      if (typeof val !== "string" || !val.includes(sub)) {
        throw new Error(`Expected "${val}" to contain "${sub}"`);
      }
    },
  };
}

// ─── Test 1: Reject option from hidden part of source verse ──────────────────
console.log("\n── Test 1: Reject option from hidden source text (the كادح/الإنسان bug) ──");

it("rejects 'الإنسان' when displayedArabicText does not contain it", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "إنك كادح إلى ربك كدحا",
    sourceAyahText: "يا أيها الإنسان إنك كادح إلى ربك كدحا فملاقيه",
    answerArabic: "كادح",
    choices: [
      { text: "كادح" },
      { text: "ربك" },
      { text: "كدحا" },
      { text: "الإنسان" },
    ],
  });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.reason).toContain("الإنسان");
  }
});

it("accepts valid choices when all are in displayedArabicText", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "إنك كادح إلى ربك كدحا",
    sourceAyahText: "يا أيها الإنسان إنك كادح إلى ربك كدحا فملاقيه",
    answerArabic: "كادح",
    choices: [
      { text: "كادح" },
      { text: "ربك" },
      { text: "كدحا" },
      { text: "إلى" },
    ],
  });
  expect(result.ok).toBe(true);
});

// ─── Test 2: Reject option from undisplayed neighbouring verse ───────────────
console.log("\n── Test 2: Reject option from undisplayed neighbouring verse ────────────");

it("rejects 'الراضية' (from next verse) when displaying only 'يا أيتها النفس المطمئنة'", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "يا أيتها النفس المطمئنة",
    answerArabic: "المطمئنة",
    choices: [
      { text: "المطمئنة" },
      { text: "النفس" },
      { text: "أيتها" },
      { text: "الراضية" },
    ],
  });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.reason).toContain("الراضية");
  }
});

it("rejects 'الناس' and 'الظلمات' from Al-Falaq v1 display", () => {
  const falaqResult = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "قل أعوذ برب الفلق",
    answerArabic: "الفلق",
    choices: [
      { text: "الفلق" },
      { text: "قل" },
      { text: "أعوذ" },
      { text: "الناس" },
    ],
  });
  expect(falaqResult.ok).toBe(false);
});

// ─── Test 3: Accept only literal visible tokens ───────────────────────────────
console.log("\n── Test 3: Accept only literal visible tokens ─────────────────────────");

it("accepts choices that are exact surface tokens of displayed verse (عبس + وتولى)", () => {
  // The surface tokens of "عبس وتولى" are ["عبس", "وتولى"] — NOT "تولى"
  // "وتولى" (with attached و) is the literal visible token; "تولى" is not.
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "عبس وتولى",
    answerArabic: "عبس",
    choices: [
      { text: "عبس" },
      { text: "وتولى" },
    ],
  });
  expect(result.ok).toBe(true);
});

it("rejects 'تولى' (standalone) from 'عبس وتولى' — token is 'وتولى' with attached و", () => {
  // "تولى" is NOT a surface token; "وتولى" is the actual token shown on screen
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "عبس وتولى",
    answerArabic: "عبس",
    choices: [
      { text: "عبس" },
      { text: "وتولى" },
      { text: "تولى" },
    ],
  });
  expect(result.ok).toBe(false);
});

it("rejects 'قال' and 'جاء' from عبس وتولى display", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "عبس وتولى",
    answerArabic: "عبس",
    choices: [
      { text: "عبس" },
      { text: "وتولى" },
      { text: "قال" },
      { text: "جاء" },
    ],
  });
  expect(result.ok).toBe(false);
});

it("accepts all 4 choices when multi-ayah displayedArabicText contains them as exact tokens", () => {
  // After multi-ayah expansion, "وتولى" is visible; "جاءه" is visible; "الأعمى" is visible
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "عبس وتولى أن جاءه الأعمى",
    answerArabic: "عبس",
    choices: [
      { text: "عبس" },
      { text: "وتولى" },
      { text: "جاءه" },
      { text: "الأعمى" },
    ],
  });
  expect(result.ok).toBe(true);
});

// ─── Test 4: No cropped-text publishing ─────────────────────────────────────
console.log("\n── Test 4: No cropped-text publishing ──────────────────────────────────");

it("rejects exercise if answer itself is not in displayedArabicText", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "إنك كادح إلى ربك كدحا",
    sourceAyahText: "يا أيها الإنسان إنك كادح إلى ربك كدحا فملاقيه",
    answerArabic: "الإنسان",
    choices: [
      { text: "الإنسان" },
      { text: "كادح" },
      { text: "ربك" },
      { text: "كدحا" },
    ],
  });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.reason).toContain("الإنسان");
  }
});

it("rejects empty displayedArabicText", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "",
    answerArabic: "كادح",
    choices: [{ text: "كادح" }, { text: "ربك" }],
  });
  expect(result.ok).toBe(false);
});

it("rejects duplicate choices after normalization", () => {
  const result = validateExerciseUsesOnlyVisibleArabic({
    displayedArabicText: "قل أعوذ برب الفلق",
    answerArabic: "الفلق",
    choices: [
      { text: "الفلق" },
      { text: "قل" },
      { text: "الفلق" },
      { text: "أعوذ" },
    ],
  });
  expect(result.ok).toBe(false);
});

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("SOME TESTS FAILED — fix the validator before shipping.");
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED ✅");
  process.exit(0);
}
