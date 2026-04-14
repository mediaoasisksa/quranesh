/**
 * Delivery Guard Tests
 * ====================
 * Production-critical test suite for the invariant:
 *   No learner should ever see an option that is not present in the
 *   exact Quranic passage displayed in the exercise.
 *
 * Run with:  npx tsx server/__tests__/delivery-guard.test.ts
 *
 * Test plan:
 *  1.  Option outside passage → blocked
 *  2.  All 4 options in passage → passes
 *  3.  Empty passage → rejected (passage_missing)
 *  4.  Whitespace-only passage → rejected
 *  5.  Tashkeel-stripped option matches diacritised passage
 *  6.  Diacritised option matches tashkeel-stripped passage
 *  7.  Alef variants (أ/إ/آ/ٱ → ا)
 *  8.  Alf maqsura (ى → ي)
 *  9.  multi_ayah: options from multi-ayah passage → passes
 * 10.  multi_ayah: option from different surah → blocked
 * 11.  All bad choices reported (not just first)
 * 12.  Options with trailing Arabic punctuation are normalised
 * 13.  Single-word passage: matching option passes, different word fails
 * 14.  Generator invariant: well-formed exercise passes
 * 15.  Generator invariant: distractor from outside passage is rejected
 */

import {
  validateDisplayedArabicTokenSet,
} from "../exerciseVisibleValidator";
import {
  normalizeArabic,
  buildVisibleArabicSet,
  isChoiceVisibleInDisplayedText,
} from "../../shared/arabicVisibleTokens";

// ─── minimal test harness ─────────────────────────────────────────────────────

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

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toContain(expected: unknown) {
      if (!Array.isArray(actual) && typeof actual !== "string") {
        throw new Error(`Expected array or string, got ${typeof actual}`);
      }
      if (!(actual as any[]).includes(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`);
      }
    },
    toMatch(pattern: RegExp) {
      if (typeof actual !== "string") throw new Error(`Expected string, got ${typeof actual}`);
      if (!pattern.test(actual)) throw new Error(`Expected ${JSON.stringify(actual)} to match ${pattern}`);
    },
    toBeGreaterThan(n: number) {
      if (typeof actual !== "number" || actual <= n) {
        throw new Error(`Expected ${actual} to be > ${n}`);
      }
    },
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FATIHA_V1 = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ";
const FATIHA_V2 = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";
const FALAQ_V3  = "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ";
const IKHLAS    = "قُلْ هُوَ اللَّهُ أَحَدٌ";
const DUHA_V6   = "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَى";

// ═══════════════════════════════════════════════════════════════════════════════
// validateDisplayedArabicTokenSet
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n▶ validateDisplayedArabicTokenSet");

it("1. Blocks an option that is not in the passage", () => {
  const passage = FATIHA_V1;
  const choices = ["الرَّحْمَنِ", "الرَّحِيمِ", "اللَّهِ", "النَّارِ"]; // النار NOT in Fatiha 1
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(false);
  expect((result as any).badChoices).toContain("النَّارِ");
  expect((result as any).reason).toMatch(/not in displayedArabicTokenSet/);
});

it("2. Passes when all 4 options are in the passage", () => {
  const passage = FATIHA_V1;
  const choices = ["الرَّحْمَنِ", "الرَّحِيمِ", "اللَّهِ", "بِسْمِ"];
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("3. Rejects empty passage", () => {
  const result = validateDisplayedArabicTokenSet("", ["الرَّحْمَنِ"]);
  expect(result.ok).toBe(false);
  expect((result as any).reason).toMatch(/empty/i);
});

it("4. Rejects whitespace-only passage", () => {
  const result = validateDisplayedArabicTokenSet("   ", ["الرَّحْمَنِ"]);
  expect(result.ok).toBe(false);
});

it("5. Option without tashkeel matches passage with full tashkeel", () => {
  const passage = FATIHA_V1; // diacritised
  const choices = ["الرحمن", "الرحيم", "الله", "بسم"]; // stripped
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("6. Option with tashkeel matches passage without tashkeel", () => {
  const passage = "بسم الله الرحمن الرحيم"; // no diacritics
  const choices = ["الرَّحْمَنِ", "الرَّحِيمِ", "اللَّهِ", "بِسْمِ"]; // with diacritics
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("7. Alef variants (أ/إ/آ/ٱ) normalised to ا", () => {
  const passage = DUHA_V6; // أَلَمْ يَجِدْكَ يَتِيمًا فَآوَى
  const choices = ["الم", "يجدك", "يتيما", "فاوى"];
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("8. ى normalised to ي", () => {
  const passage = "وَالضُّحَى";
  const choices = ["والضحي"]; // ى → ي
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("9. multi_ayah: options from combined passage pass", () => {
  const passage = `${FATIHA_V1} ${FATIHA_V2}`;
  const choices = ["الحمد", "لله", "رب", "العالمين"]; // all from v2
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("10. multi_ayah: option from different surah blocked", () => {
  const passage = `${FATIHA_V1} ${FATIHA_V2}`;
  const choices = ["الحمد", "لله", "رب", "شر"]; // شر from Al-Falaq, not Fatiha
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(false);
  expect((result as any).badChoices).toContain("شر");
});

it("11. All bad choices reported, not just the first", () => {
  const passage = IKHLAS; // قل هو الله أحد
  const choices = ["قُلْ", "النَّارِ", "الجَنَّةِ", "اللَّهُ"]; // 2 bad
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(false);
  expect((result as any).badChoices.length).toBe(2);
});

it("12. Options with trailing Arabic punctuation are normalised", () => {
  const passage = FATIHA_V1;
  const choices = ["الرَّحْمَنِ،", "الرَّحِيمِ.", "اللَّهِ؛", "بِسْمِ"];
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("13. Single-word passage: matching option passes, different word fails", () => {
  const ok = validateDisplayedArabicTokenSet("الصَّمَدُ", ["الصَّمَدُ"]);
  expect(ok.ok).toBe(true);
  const fail = validateDisplayedArabicTokenSet("الصَّمَدُ", ["الرَّحِيمِ"]);
  expect(fail.ok).toBe(false);
});

it("14. Generator invariant: well-formed exercise passes", () => {
  const passage = FALAQ_V3; // وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
  const choices = ["شَرِّ", "النَّفَّاثَاتِ", "فِي", "الْعُقَدِ"];
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(true);
});

it("15. Generator invariant: distractor from outside passage is rejected", () => {
  const passage = FALAQ_V3;
  const choices = ["شَرِّ", "النَّفَّاثَاتِ", "فِي", "الرَّحِيمِ"]; // الرحيم NOT in Al-Falaq v3
  const result = validateDisplayedArabicTokenSet(passage, choices);
  expect(result.ok).toBe(false);
  const bad = (result as any).badChoices as string[];
  const hasRaheem = bad.some((c: string) => normalizeArabic(c) === "الرحيم");
  expect(hasRaheem).toBe(true);
});

// ═══════════════════════════════════════════════════════════════════════════════
// normalizeArabic
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n▶ normalizeArabic");

it("Strips tashkeel", () => {
  expect(normalizeArabic("الرَّحْمَنِ")).toBe("الرحمن");
});

it("Normalises أ to ا", () => {
  expect(normalizeArabic("أَلَمْ")).toBe("الم");
});

it("Normalises إ to ا", () => {
  expect(normalizeArabic("إِنَّ")).toBe("ان");
});

it("Normalises آ to ا", () => {
  expect(normalizeArabic("آمَنُوا")).toBe("امنوا");
});

it("Normalises ٱ (wasla) to ا", () => {
  expect(normalizeArabic("ٱللَّهِ")).toBe("الله");
});

it("Normalises ى to ي", () => {
  expect(normalizeArabic("مُوسَى")).toBe("موسي");
});

it("Removes tatweel", () => {
  expect(normalizeArabic("اللـه")).toBe("الله");
});

it("Collapses multiple spaces", () => {
  expect(normalizeArabic("قُلْ  هُوَ")).toBe("قل هو");
});

// ═══════════════════════════════════════════════════════════════════════════════
// buildVisibleArabicSet
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n▶ buildVisibleArabicSet");

it("Returns normalised token set from Fatiha v1", () => {
  const set = buildVisibleArabicSet(FATIHA_V1);
  if (!set.has("بسم")) throw new Error("Missing بسم");
  if (!set.has("الله")) throw new Error("Missing الله");
  if (!set.has("الرحمن")) throw new Error("Missing الرحمن");
  if (!set.has("الرحيم")) throw new Error("Missing الرحيم");
});

it("Returns empty set for empty string", () => {
  expect(buildVisibleArabicSet("").size).toBe(0);
});

// ═══════════════════════════════════════════════════════════════════════════════
// isChoiceVisibleInDisplayedText
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n▶ isChoiceVisibleInDisplayedText");

it("Returns true when choice is in passage", () => {
  expect(isChoiceVisibleInDisplayedText("الرَّحْمَنِ", FATIHA_V1)).toBe(true);
  expect(isChoiceVisibleInDisplayedText("الرحمن", FATIHA_V1)).toBe(true);
});

it("Returns false when choice is NOT in passage", () => {
  expect(isChoiceVisibleInDisplayedText("النَّارِ", FATIHA_V1)).toBe(false);
});

// ─── summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(60)}`);
console.log(`Tests: ${passed + failed}  |  ✅ ${passed} passed  |  ❌ ${failed} failed`);
if (failures.length > 0) {
  console.error("\nFailed tests:");
  failures.forEach(f => console.error(`  • ${f}`));
  process.exit(1);
}
console.log("All delivery guard tests passed.\n");
