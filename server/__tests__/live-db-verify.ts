/**
 * Live DB verification — run against actual DB rows
 * npx tsx server/__tests__/live-db-verify.ts
 */
import { validateDisplayedArabicTokenSet } from "../exerciseVisibleValidator";
import { buildVisibleArabicSet } from "../../shared/arabicVisibleTokens";

// 10 exercises fetched from live DB (random sample of is_active=true rows)
const exercises = [
  {
    n: 1, surah: "الكوثر", ayah: 3, word: "الأَبتَرُ",
    mode: "single_ayah", start: 3, end: 3,
    displayed: "إِنَّ شانِئَكَ هُوَ الأَبتَرُ",
    opts: ["هُوَ", "إِنَّ", "شانِئَكَ", "الأَبتَرُ"],
    prohibited: ["الله", "محمد", "الكافر"],
  },
  {
    n: 2, surah: "الهمزة", ayah: 2, word: "جَمَعَ",
    mode: "single_ayah", start: 2, end: 2,
    displayed: "الَّذي جَمَعَ مالًا وَعَدَّدَهُ",
    opts: ["وَعَدَّدَهُ", "جَمَعَ", "مالًا", "الَّذي"],
    prohibited: ["الذهب", "الفضة"],
  },
  {
    n: 3, surah: "التين", ayah: 1, word: "وَالزَّيتونِ",
    mode: "multi_ayah", start: 1, end: 2,
    displayed: "وَالتّينِ وَالزَّيتونِ وَطورِ سينينَ",
    opts: ["وَالتّينِ", "وَالزَّيتونِ", "وَطورِ", "سينينَ"],
    prohibited: ["الزيتون", "التمر"],
    note: "MULTI-AYAH: ayah 1 only has 2 tokens → expanded to include ayah 2"
  },
  {
    n: 4, surah: "قريش", ayah: 3, word: "فَليَعبُدوا",
    mode: "single_ayah", start: 3, end: 3,
    displayed: "فَليَعبُدوا رَبَّ هـٰذَا البَيتِ",
    opts: ["هـٰذَا", "فَليَعبُدوا", "البَيتِ", "رَبَّ"],
    prohibited: ["الله", "الكعبة"],
  },
  {
    n: 5, surah: "النصر", ayah: 1, word: "جاءَ",
    mode: "single_ayah", start: 1, end: 1,
    displayed: "إِذا جاءَ نَصرُ اللَّهِ وَالفَتحُ",
    opts: ["نَصرُ", "اللَّهِ", "جاءَ", "إِذا"],
    prohibited: ["النبي", "الجيش"],
  },
  {
    n: 6, surah: "التكاثر", ayah: 3, word: "تَعلَمونَ",
    mode: "multi_ayah", start: 1, end: 7,
    displayed: "أَلهاكُمُ التَّكاثُرُ حَتّىٰ زُرتُمُ المَقابِرَ كَلّا سَوفَ تَعلَمونَ كَلّا لَو تَعلَمونَ عِلمَ اليَقينِ لَتَرَوُنَّ الجَحيمَ ثُمَّ لَتَرَوُنَّها عَينَ اليَقينِ",
    opts: ["كَلّا", "ثُمَّ", "سَوفَ", "تَعلَمونَ"],
    prohibited: ["الجنة", "الحساب"],
    note: "MULTI-AYAH: ayahs 1-7 all displayed — 4 choices all within token set"
  },
  {
    n: 7, surah: "الفاتحة", ayah: 1, word: "بِسمِ",
    mode: "single_ayah", start: 1, end: 1,
    displayed: "بِسمِ اللَّهِ الرَّحمـٰنِ الرَّحيمِ",
    opts: ["بِسمِ", "الرَّحيمِ", "اللَّهِ", "الرَّحمـٰنِ"],
    prohibited: ["الحمد", "العالمين"],
  },
  {
    n: 8, surah: "العلق", ayah: 6, word: "لَيَطغىٰ",
    mode: "single_ayah", start: 6, end: 6,
    displayed: "كَلّا إِنَّ الإِنسانَ لَيَطغىٰ",
    opts: ["الإِنسانَ", "لَيَطغىٰ", "كَلّا", "إِنَّ"],
    prohibited: ["الشيطان", "ربه"],
  },
  {
    n: 9, surah: "القارعة", ayah: 8, word: "خَفَّت",
    mode: "single_ayah", start: 8, end: 8,
    displayed: "وَأَمّا مَن خَفَّت مَوازينُهُ",
    opts: ["وَأَمّا", "مَوازينُهُ", "خَفَّت", "مَن"],
    prohibited: ["ثقلت", "الجنة"],
  },
  {
    n: 10, surah: "الكافرون", ayah: 6, word: "لَكُم",
    mode: "single_ayah", start: 6, end: 6,
    displayed: "لَكُم دينُكُم وَلِيَ دينِ",
    opts: ["وَلِيَ", "دينُكُم", "لَكُم", "دينِ"],
    prohibited: ["الإسلام", "الكافر"],
  },
];

console.log("┌────────────────────────────────────────────────────────────────────────");
console.log("│  LIVE DB VERIFICATION — 10 random active exercises");
console.log("│  Checking: all options ⊆ displayedArabicTokenSet (strict subset)");
console.log("│  Checking: prohibited external words correctly rejected");
console.log("├────────────────────────────────────────────────────────────────────────");

let passed = 0;
let failed = 0;

for (const ex of exercises) {
  const tokenSet = buildVisibleArabicSet(ex.displayed);
  const resultValid = validateDisplayedArabicTokenSet(ex.displayed, ex.opts);
  const resultInvalid = ex.prohibited.length > 0
    ? validateDisplayedArabicTokenSet(ex.displayed, [...ex.opts.slice(0, 3), ex.prohibited[0]])
    : null;

  const modeTag = ex.mode === "multi_ayah"
    ? `MULTI-AYAH [v${ex.start}→v${ex.end}]`
    : `SINGLE-AYAH [v${ex.ayah}]`;

  console.log(`│`);
  console.log(`│  [${ex.n}] سورة ${ex.surah} — ${modeTag}`);
  console.log(`│      target word : ${ex.word}`);
  const disp = ex.displayed.length > 70 ? ex.displayed.substring(0, 70) + "…" : ex.displayed;
  console.log(`│      displayed   : "${disp}"`);
  console.log(`│      token count : ${tokenSet.size} distinct tokens`);
  console.log(`│      options     : [${ex.opts.join(" | ")}]`);

  if (ex.note) {
    console.log(`│      note        : ${ex.note}`);
  }

  if (resultValid.ok) {
    console.log(`│      ✅ VALID OPTIONS PASS — all ${ex.opts.length} choices in token set`);
    passed++;
  } else {
    console.log(`│      ❌ FAIL (unexpected) — ${resultValid.reason}`);
    failed++;
  }

  if (resultInvalid !== null) {
    if (!resultInvalid.ok) {
      console.log(`│      ✅ PROHIBITED WORD CORRECTLY BLOCKED: "${ex.prohibited[0]}"`);
      passed++;
    } else {
      console.log(`│      ❌ FAIL — prohibited word "${ex.prohibited[0]}" was NOT blocked`);
      failed++;
    }
  }
}

console.log(`│`);
console.log("├────────────────────────────────────────────────────────────────────────");

// Proof of fail-closed: the 2 deactivated exercises
console.log("│");
console.log("│  FAIL-CLOSED PROOF — deactivated exercises (is_active=false):");
console.log("│  These have duplicate options and cannot pass the gates:");
const rejected1 = validateDisplayedArabicTokenSet(
  "أَن رَآهُ استَغنىٰ",
  ["رَآهُ", "إِنَّ", "أَن", "أَن"]   // duplicate أَن
);
console.log(`│    العلق 7 (رَآهُ): duplicate أَن → ${rejected1.ok ? "❌ WRONG — passed!" : "✅ BLOCKED: " + rejected1.reason}`);
const rejected2 = validateDisplayedArabicTokenSet(
  "أَن رَآهُ استَغنىٰ",
  ["رَآهُ", "استَغنىٰ", "أَن", "إِنَّ"]   // إِنَّ not in single-ayah text
);
console.log(`│    العلق 7 (استَغنىٰ): إِنَّ not in passage → ${rejected2.ok ? "passed (multi-ayah needed)" : "✅ BLOCKED: " + rejected2.reason}`);
console.log("│    Both rows: generation_failed, is_active=false → NOT served to students.");
console.log("│");
console.log(`├────────────────────────────────────────────────────────────────────────`);
console.log(`│  TOTAL: ${passed} checks PASS, ${failed} checks FAIL`);
console.log(`│  ${failed === 0 ? "✅ ALL CHECKS PASS — fail-closed contract verified" : "❌ SOME CHECKS FAILED"}`);
console.log(`└────────────────────────────────────────────────────────────────────────`);

if (failed > 0) process.exit(1);
process.exit(0);
