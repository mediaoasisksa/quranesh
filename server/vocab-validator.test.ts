/**
 * Acceptance tests for the vocab-validator gate.
 *
 * Matches the 5 tests specified in the bug report:
 *
 *   Test 1: strict subset rule
 *   Test 2: hidden next verse rejection
 *   Test 3: exact surface-form match only
 *   Test 4: multi-ayah allowed only when visibly rendered
 *   Test 5: no root-only acceptance
 *
 * Run with:  npx tsx server/vocab-validator.test.ts
 */

import {
  normalizeToken,
  buildTokenSet,
  allOptionsInPassage,
  tokenizeArabic,
  validateAndRebuildOptions,
  buildSurahVerseMaps,
} from "./vocab-validator";

// ─── tiny test harness ───────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${name}${details ? ` — ${details}` : ""}`);
    failed++;
  }
}

function assertFalse(name: string, condition: boolean, details?: string) {
  assert(name, !condition, details);
}

// ─── Test 1: strict subset rule ──────────────────────────────────────────────
console.log("\n── Test 1: strict subset rule ──────────────────────────────");
{
  const displayedText = "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ";
  const tset = buildTokenSet(displayedText);

  // "الراضية" must NOT be accepted — it is NOT in the displayed text
  assertFalse(
    '"الراضية" rejected (not in displayed text)',
    tset.has(normalizeToken("الرَّاضِيَةُ")),
    `Token set: ${[...tset].join(", ")}`
  );

  // All four words of the verse must be accepted
  for (const w of ["يَا", "أَيَّتُهَا", "النَّفْسُ", "الْمُطْمَئِنَّةُ"]) {
    assert(
      `"${normalizeToken(w)}" accepted (present in displayed text)`,
      tset.has(normalizeToken(w))
    );
  }

  // validateAndRebuildOptions must produce options only from verse tokens
  const result = validateAndRebuildOptions(
    "النَّفْسُ",
    displayedText,
    27,
    [
      { text: "النَّفْسُ", isCorrect: true },
      { text: "الرَّاضِيَةُ", isCorrect: false },   // invalid — not in verse
      { text: "الْمَطْمَئِنَّةُ", isCorrect: false }, // variant spelling — may or may not match
      { text: "جَنَّتِي", isCorrect: false },         // invalid — not in verse
    ]
  );

  assert("Result is not null", result !== null);
  if (result !== null) {
    const bad = result.options.filter(
      o => !buildTokenSet(result.displayedPassageText).has(normalizeToken(o.text))
    );
    assert(
      "No option is outside displayedPassageText token set",
      bad.length === 0,
      bad.length > 0 ? `Bad options: ${bad.map(b => b.text).join(", ")}` : undefined
    );
  }
}

// ─── Test 2: hidden next verse rejection ─────────────────────────────────────
console.log("\n── Test 2: hidden next verse rejection ─────────────────────");
{
  const displayedText = "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ";

  // "الناس" and "الظلمات" must NOT pass — they are not tokens in this verse
  assertFalse(
    '"الناس" rejected from Al-Falaq v1',
    buildTokenSet(displayedText).has(normalizeToken("النَّاسِ")),
  );
  assertFalse(
    '"الظلمات" rejected from Al-Falaq v1',
    buildTokenSet(displayedText).has(normalizeToken("الظُّلُمَاتِ")),
  );

  // The validator must rebuild using only verse tokens (قل، أعوذ، برب)
  const result = validateAndRebuildOptions(
    "الْفَلَقِ",
    displayedText,
    1,
    [
      { text: "الْفَلَقِ", isCorrect: true },
      { text: "النَّاسِ", isCorrect: false },
      { text: "الظُّلُمَاتِ", isCorrect: false },
      { text: "الصُّبْحِ", isCorrect: false },
    ]
  );

  assert("Result not null (single-ayah rebuild succeeds)", result !== null);
  if (result !== null) {
    const bad = result.options.filter(
      o => !buildTokenSet(result.displayedPassageText).has(normalizeToken(o.text))
    );
    assert(
      "All rebuilt options are tokens of the displayed text",
      bad.length === 0,
      bad.length > 0 ? `Bad: ${bad.map(b => b.text).join(", ")}` : undefined
    );
    assert(
      'contextMode is "single_ayah"',
      result.contextMode === "single_ayah"
    );
  }
}

// ─── Test 3: exact surface-form match only ────────────────────────────────────
console.log("\n── Test 3: exact surface-form match only ────────────────────");
{
  const displayedText = "عَبَسَ وَتَوَلَّى";

  // "قال" and "جاء" must NOT be accepted
  assertFalse(
    '"قال" rejected from "عبس وتولى"',
    buildTokenSet(displayedText).has(normalizeToken("قَالَ"))
  );
  assertFalse(
    '"جاء" rejected from "عبس وتولى"',
    buildTokenSet(displayedText).has(normalizeToken("جَاءَ"))
  );

  // "جاءه" is also not in this verse (it's in Abasa v2)
  assertFalse(
    '"جاءه" rejected from "عبس وتولى" (different token)',
    buildTokenSet(displayedText).has(normalizeToken("جَاءَهُ"))
  );

  // The exercise must either rebuild from multi-ayah or be rejected
  // (only 2 tokens in this verse — not enough for 3 distractors without expansion)
  const verseMap = new Map<number, string>([
    [1, "عَبَسَ وَتَوَلَّى"],
    [2, "أَن جَاءَهُ الْأَعْمَىٰ"],
    [3, "وَمَا يُدْرِيكَ لَعَلَّهُ يَزَّكَّىٰ"],
    [4, "أَوْ يَذَّكَّرُ فَتَنفَعَهُ الذِّكْرَىٰ"],
  ]);

  const result = validateAndRebuildOptions(
    "عَبَسَ",
    "عَبَسَ وَتَوَلَّى",
    1,
    [
      { text: "عَبَسَ", isCorrect: true },
      { text: "تَوَلَّى", isCorrect: false },
      { text: "جَاءَ", isCorrect: false },
      { text: "قَالَ", isCorrect: false },
    ],
    verseMap
  );

  assert("Result not null (multi-ayah expansion should succeed)", result !== null);
  if (result !== null) {
    const bad = result.options.filter(
      o => !buildTokenSet(result.displayedPassageText).has(normalizeToken(o.text))
    );
    assert(
      "No option is outside displayedPassageText",
      bad.length === 0,
      bad.length > 0 ? `Bad: ${bad.map(b => b.text).join(", ")}` : undefined
    );
    assert(
      'Options do not contain "قال" or "جاء"',
      !result.options.some(o =>
        normalizeToken(o.text) === normalizeToken("قَالَ") ||
        normalizeToken(o.text) === normalizeToken("جَاءَ")
      )
    );
    assert(
      'contextMode is "multi_ayah" (expansion was needed)',
      result.contextMode === "multi_ayah"
    );
  }
}

// ─── Test 4: multi-ayah only when visibly rendered ────────────────────────────
console.log("\n── Test 4: multi-ayah only when visibly rendered ────────────");
{
  // If expansion is used, displayedPassageText must contain the option's text
  const verseMap = new Map<number, string>([
    [4, "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ"],
    [5, "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ"],
    [6, "مِنَ الْجِنَّةِ وَالنَّاسِ"],
  ]);

  const result = validateAndRebuildOptions(
    "الْوَسْوَاسِ",
    "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    4,
    [
      { text: "الْوَسْوَاسِ", isCorrect: true },
      { text: "الْخَنَّاسِ", isCorrect: false },
      { text: "الشَّيَاطِينِ", isCorrect: false }, // invalid
      { text: "الْجِنَّةِ", isCorrect: false },     // invalid
    ],
    verseMap
  );

  assert("Result not null", result !== null);
  if (result !== null) {
    // Every option must be in displayedPassageText
    const tset = buildTokenSet(result.displayedPassageText);
    const bad = result.options.filter(o => !tset.has(normalizeToken(o.text)));
    assert(
      "Every option is visibly rendered in displayedPassageText",
      bad.length === 0,
      bad.length > 0
        ? `Hidden options: ${bad.map(b => b.text).join(", ")}; passage: "${result.displayedPassageText}"`
        : undefined
    );

    // If multi-ayah, displayedPassageText must be longer than correctVerse
    if (result.contextMode === "multi_ayah") {
      assert(
        "displayedPassageText is expanded beyond correctVerse",
        result.displayedPassageText.length > "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ".length
      );
    }
  }
}

// ─── Test 5: no root-only acceptance ─────────────────────────────────────────
console.log("\n── Test 5: no root-only acceptance ─────────────────────────");
{
  const displayedText = "فَإِذَا هُم بِالسَّاهِرَةِ"; // Abasa v14 / Nazi'at v14

  // "الساهرة" (without بِ prefix) shares the root but is NOT a token of this verse
  // The verse has "بِالسَّاهِرَةِ" (with preposition attached)
  assertFalse(
    '"الساهرة" rejected (root match only — not an exact surface token)',
    buildTokenSet(displayedText).has(normalizeToken("الساهرة"))
  );
  assertFalse(
    '"الساهرة" with tashkeel rejected',
    buildTokenSet(displayedText).has(normalizeToken("السَّاهِرَةُ"))
  );

  // The actual token "بِالسَّاهِرَةِ" IS in the verse
  assert(
    '"بِالسَّاهِرَةِ" accepted (exact surface token)',
    buildTokenSet(displayedText).has(normalizeToken("بِالسَّاهِرَةِ"))
  );

  // Exercise whose correct answer is "الساهرة" should be rejected (or rebuilt
  // from a wider context where the standalone form appears)
  const resultNoMap = validateAndRebuildOptions(
    "السَّاهِرَةُ",
    displayedText,
    14,
    [
      { text: "السَّاهِرَةُ", isCorrect: true },   // not an exact token
      { text: "الْجَنَّةَ", isCorrect: false },
      { text: "النَّارَ", isCorrect: false },
      { text: "الآخِرَةَ", isCorrect: false },
    ],
    undefined // no verse map → must fail
  );
  assert(
    "Exercise rejected when correct answer is not a surface token and no expansion possible",
    resultNoMap === null
  );
}

// ─── Normalisation edge cases ────────────────────────────────────────────────
console.log("\n── Bonus: normalisation edge cases ──────────────────────────");
{
  // Alif variants all normalise to ا
  assert(
    "أ and ا normalise to same form",
    normalizeToken("أَمَرَ") === normalizeToken("امر")
  );
  // Tatweel stripped
  assert(
    "Tatweel (U+0640) is stripped",
    normalizeToken("اللـه") === normalizeToken("الله")
  );
  // Diacritics stripped
  assert(
    "Diacritics stripped: الْفَلَقِ = الفلق",
    normalizeToken("الْفَلَقِ") === normalizeToken("الفلق")
  );
}

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
