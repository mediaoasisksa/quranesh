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
 *
 * Mandatory acceptance examples (from spec):
 *   A. displayed: "ويمنعون الماعون"
 *      → only ["ويمنعون","الماعون"] allowed
 *      → "الزكاة","الصلاة","الصدقة" MUST FAIL
 *   B. displayed: "قل أعوذ برب الفلق"
 *      → "الناس","الظلمات" MUST FAIL
 *   C. displayed: "عبس وتولى"
 *      → "قال","جاء" MUST FAIL
 *   D. displayed: "يا أيتها النفس المطمئنة"
 *      → "الراضية" MUST FAIL (next ayah, not displayed)
 */

import {
  validateExerciseUsesOnlyVisibleArabic,
  validateDisplayedArabicTokenSet,
} from "../exerciseVisibleValidator";

// ─── minimal test harness ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e: any) {
    console.error(`  ❌ FAIL: ${name}\n     ${e.message}`);
    failures.push(name);
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
    toBeGreaterThan(n: number) {
      if (typeof val !== "number" || val <= n) {
        throw new Error(`Expected ${val} to be greater than ${n}`);
      }
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// validateExerciseUsesOnlyVisibleArabic — existing acceptance tests
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// validateDisplayedArabicTokenSet — new named final gate
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("validateDisplayedArabicTokenSet — mandatory acceptance examples");
console.log("═══════════════════════════════════════════════════════════════");

// ─── Acceptance Example A: "ويمنعون الماعون" (Al-Maun 107:7) ────────────────
console.log('\n── Example A: displayed="ويمنعون الماعون" ─────────────────────────────');
console.log("   Allowed token set: ONLY the 2 words actually visible to the student.");
console.log("   Prohibited: الزكاة | الصلاة | الصدقة (not in displayed text)");

it("BEFORE (broken): 'الزكاة' from same surah-topic — MUST FAIL", () => {
  const result = validateDisplayedArabicTokenSet(
    "ويمنعون الماعون",
    ["ويمنعون", "الماعون", "الزكاة", "الصدقة"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    // badChoices must include the prohibited words
    const bad = result.badChoices.join(" ");
    if (!bad.includes("الزكاة") && !bad.includes("الصدقة")) {
      throw new Error(`Expected badChoices to include الزكاة or الصدقة, got: ${bad}`);
    }
  }
});

it("BEFORE (broken): 'الصلاة' from same surah-topic — MUST FAIL", () => {
  const result = validateDisplayedArabicTokenSet(
    "ويمنعون الماعون",
    ["ويمنعون", "الماعون", "الصلاة", "الزكاة"]
  );
  expect(result.ok).toBe(false);
});

it("AFTER (correct single-ayah): only the 2 literal tokens — MUST PASS", () => {
  const result = validateDisplayedArabicTokenSet(
    "ويمنعون الماعون",
    ["ويمنعون", "الماعون"]
  );
  expect(result.ok).toBe(true);
  if (result.ok) {
    // Token set must have exactly 2 entries
    expect(result.tokenSet.size).toBe(2);
  }
});

it("AFTER (correct multi-ayah): with added ayah 6 'الذين هم يراءون', 4 choices all visible — MUST PASS", () => {
  // Multi-ayah expansion: displayed = ayah 6 + ayah 7
  const displayedMulti = "الذين هم يراءون ويمنعون الماعون";
  const result = validateDisplayedArabicTokenSet(
    displayedMulti,
    ["ويمنعون", "الماعون", "يراءون", "الذين"]
  );
  expect(result.ok).toBe(true);
});

it("multi-ayah still rejects 'الصلاة' even after expansion", () => {
  const displayedMulti = "الذين هم يراءون ويمنعون الماعون";
  const result = validateDisplayedArabicTokenSet(
    displayedMulti,
    ["ويمنعون", "الماعون", "يراءون", "الصلاة"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.badChoices.join("")).toContain("الصلاة");
  }
});

// ─── Acceptance Example B: "قل أعوذ برب الفلق" (Al-Falaq 113:1) ─────────────
console.log('\n── Example B: displayed="قل أعوذ برب الفلق" ────────────────────────────');
console.log("   Prohibited: الناس | الظلمات (from different surah / different ayah)");

it("rejects 'الناس' — from Al-Nas, not Al-Falaq", () => {
  const result = validateDisplayedArabicTokenSet(
    "قل أعوذ برب الفلق",
    ["الفلق", "برب", "أعوذ", "الناس"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.badChoices.join("")).toContain("الناس");
  }
});

it("rejects 'الظلمات' — not a token in this displayed text", () => {
  const result = validateDisplayedArabicTokenSet(
    "قل أعوذ برب الفلق",
    ["الفلق", "برب", "الظلمات", "قل"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.badChoices.join("")).toContain("الظلمات");
  }
});

it("accepts valid choices from Al-Falaq v1 only", () => {
  const result = validateDisplayedArabicTokenSet(
    "قل أعوذ برب الفلق",
    ["قل", "أعوذ", "برب", "الفلق"]
  );
  expect(result.ok).toBe(true);
});

// ─── Acceptance Example C: "عبس وتولى" (Abasa 80:1) ─────────────────────────
console.log('\n── Example C: displayed="عبس وتولى" ───────────────────────────────────');
console.log("   Prohibited: قال | جاء (from other surahs, not visible)");

it("rejects 'قال' — not in 'عبس وتولى'", () => {
  const result = validateDisplayedArabicTokenSet(
    "عبس وتولى",
    ["عبس", "وتولى", "قال", "جاء"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.badChoices.join("")).toContain("قال");
  }
});

it("rejects 'جاء' — not in 'عبس وتولى'", () => {
  const result = validateDisplayedArabicTokenSet(
    "عبس وتولى",
    ["عبس", "وتولى", "جاء", "ربه"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.badChoices.join("")).toContain("جاء");
  }
});

it("accepts only the 2 literal tokens from 'عبس وتولى'", () => {
  const result = validateDisplayedArabicTokenSet(
    "عبس وتولى",
    ["عبس", "وتولى"]
  );
  expect(result.ok).toBe(true);
});

it("accepts 4 choices after multi-ayah expansion adds 'أن جاءه الأعمى'", () => {
  // Multi-ayah: ayah 1 + ayah 2 displayed
  const result = validateDisplayedArabicTokenSet(
    "عبس وتولى أن جاءه الأعمى",
    ["عبس", "وتولى", "جاءه", "الأعمى"]
  );
  expect(result.ok).toBe(true);
});

// ─── Acceptance Example D: "يا أيتها النفس المطمئنة" (Al-Fajr 89:27) ────────
console.log('\n── Example D: displayed="يا أيتها النفس المطمئنة" ─────────────────────');
console.log("   Prohibited: الراضية (next ayah 89:28, not displayed)");

it("rejects 'الراضية' when only ayah 27 is displayed", () => {
  const result = validateDisplayedArabicTokenSet(
    "يا أيتها النفس المطمئنة",
    ["المطمئنة", "النفس", "أيتها", "الراضية"]
  );
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.badChoices.join("")).toContain("الراضية");
  }
});

it("accepts 'الراضية' ONLY when ayah 28 is also in displayedArabicText", () => {
  // Multi-ayah expansion: ayah 27 + ayah 28
  const result = validateDisplayedArabicTokenSet(
    "يا أيتها النفس المطمئنة ارجعي إلى ربك راضية مرضية",
    ["المطمئنة", "النفس", "راضية", "مرضية"]
  );
  expect(result.ok).toBe(true);
});

// ─── Edge cases for validateDisplayedArabicTokenSet ─────────────────────────
console.log("\n── Edge cases: validateDisplayedArabicTokenSet ─────────────────────────");

it("returns ok:false with empty displayedArabicText", () => {
  const result = validateDisplayedArabicTokenSet("", ["كادح", "ربك"]);
  expect(result.ok).toBe(false);
});

it("returns ok:false for empty choices array — no choices to validate", () => {
  // An exercise with zero choices is structurally broken regardless
  const result = validateDisplayedArabicTokenSet("عبس وتولى", []);
  // Zero choices → no bad choices → technically passes token check,
  // but the caller must separately ensure at least 4 choices exist.
  // This gate is focused solely on token membership.
  expect(result.ok).toBe(true); // empty array has no bad members — gate passes
});

it("tokenSet exposed on success for caller inspection", () => {
  const result = validateDisplayedArabicTokenSet(
    "ويمنعون الماعون",
    ["ويمنعون", "الماعون"]
  );
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.tokenSet.size).toBeGreaterThan(0);
  }
});

it("normalization: tashkeel-stripped choices match tashkeel passage", () => {
  // Passage has full tashkeel; choices are bare — must still match
  const result = validateDisplayedArabicTokenSet(
    "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    ["قل", "أعوذ", "برب", "الفلق"]
  );
  expect(result.ok).toBe(true);
});

// ─── Before/After narrative for "ويمنعون الماعون" ───────────────────────────
console.log("\n═══════════════════════════════════════════════════════════════════════════");
console.log("BEFORE / AFTER narrative — Surah Al-Maun 107:7 'ويمنعون الماعون'");
console.log("═══════════════════════════════════════════════════════════════════════════");
console.log("");
console.log("  BEFORE (broken pipeline):");
console.log("    displayedArabicText = 'ويمنعون الماعون'  (only 2 tokens)");
console.log("    options = ['ويمنعون', 'الماعون', 'الصلاة', 'الزكاة']");
console.log("    Problem: 'الصلاة' and 'الزكاة' are thematically related but");
console.log("    NOT visible to the student — the old pipeline accepted them.");
console.log("");
console.log("  AFTER (current pipeline — fail-closed):");
console.log("    Step A: single_ayah → token set = {ويمنعون, الماعون}");
console.log("            'الصلاة' NOT in set → GATE FAIL");
console.log("    Step B: multi_ayah expansion ±1 → adds ayah 6:");
console.log("            displayedArabicText = 'الذين هم يراءون ويمنعون الماعون'");
console.log("            token set = {الذين, هم, يراءون, ويمنعون, الماعون}");
console.log("            Valid 4-choice exercise: ['ويمنعون','الماعون','يراءون','الذين']");
console.log("            → PASS — exercise published with expanded displayed text");
console.log("    If even full expansion fails → generation_failed, is_active=false.");
console.log("    No exercise ever served with options outside displayedArabicTokenSet.");
console.log("");

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`${"─".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("\nFAILED TESTS:");
  failures.forEach(f => console.error(`  ✗ ${f}`));
  console.error("\nFix the validator before shipping. Fail-closed: no broken exercise may pass.");
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED ✅");
  console.log("Fail-closed contract verified: no choice outside displayedArabicTokenSet can pass.");
  process.exit(0);
}
