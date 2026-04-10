/**
 * Backfill / re-validation pass for tabari_exercises context fields.
 *
 * Problem: the original seed built the verse map ONLY from CSV rows, so surahs
 * whose trailing ayahs have no questions (e.g. القارعة:10-11, المسد:5) were
 * missing from the map and the expand algorithm could not include them.
 *
 * Fix: supplement the verse map with hard-coded texts for every missing ayah,
 * re-run expandContext for every row, and persist any rows that changed.
 *
 * Safety: this is fully idempotent — re-running produces no DB writes when
 * every row already passes the options-in-passage validation.
 */

import { db } from "./db";
import { tabariExercises } from "@shared/schema";
import { eq } from "drizzle-orm";

// ────────────────────────────────────────────────────────────────────
// Supplementary verse texts that are NOT present in the CSV but are
// needed so the expansion algorithm can cover distractor options.
// Key format: "surahNumber:ayahNumber"
// ────────────────────────────────────────────────────────────────────
const SUPPLEMENTARY_VERSES: Record<string, string> = {
  // الفاتحة — complete
  "1:1": "بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ",
  "1:2": "الحَمدُ لِلَّهِ رَبِّ العالَمينَ",
  "1:3": "الرَّحمٰنِ الرَّحيمِ",
  "1:4": "مالِكِ يَومِ الدّينِ",
  "1:5": "إِيّاكَ نَعبُدُ وَإِيّاكَ نَستَعينُ",
  "1:6": "اهدِنَا الصِّراطَ المُستَقيمَ",
  "1:7": "صِراطَ الَّذينَ أَنعَمتَ عَلَيهِم غَيرِ المَغضوبِ عَلَيهِم وَلَا الضّالّينَ",

  // القارعة — ayahs 10–11 needed for distractors وَما / أَدراكَ
  "101:10": "وَما أَدراكَ ما هِيَه",
  "101:11": "نارٌ حامِيَة",

  // المسد — ayah 5 needed for distractor في
  "111:5": "في جيدِها حَبلٌ مِن مَسَدٍ",

  // الناس — ayah 1 needed for distractor قُل
  "114:1": "قُل أَعوذُ بِرَبِّ النّاسِ",
};

// ────────────────────────────────────────────────────────────────────
// Helpers (mirrors seed-tabari.ts logic)
// ────────────────────────────────────────────────────────────────────

/**
 * Strip Arabic tashkeel/diacritics (U+064B–U+065F and U+0670) so that
 * مَا and ما are treated as the same word during passage coverage checks.
 * This prevents false FAIL results from diacritic encoding differences
 * between CSV distractor options and Quranic verse text.
 */
function stripDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670]/g, "");
}

function allOptionsInText(options: string[], text: string): boolean {
  const stripped = stripDiacritics(text);
  return options.every(opt => opt && stripped.includes(stripDiacritics(opt)));
}

type VerseMap = Map<number, Map<number, string>>;

function expandContext(
  surahNum: number,
  primaryAyah: number,
  options: string[],
  verseMap: VerseMap,
): {
  contextMode: string;
  contextStartAyah: number;
  contextEndAyah: number;
  displayedPassageText: string;
  validationPassed: boolean;
} {
  const surahVerses = verseMap.get(surahNum);
  if (!surahVerses) {
    const fallback = "";
    return {
      contextMode: "single_ayah",
      contextStartAyah: primaryAyah,
      contextEndAyah: primaryAyah,
      displayedPassageText: fallback,
      validationPassed: false,
    };
  }

  const primaryText = surahVerses.get(primaryAyah) ?? "";

  if (allOptionsInText(options, primaryText)) {
    return {
      contextMode: "single_ayah",
      contextStartAyah: primaryAyah,
      contextEndAyah: primaryAyah,
      displayedPassageText: primaryText,
      validationPassed: true,
    };
  }

  const sortedAyahs = Array.from(surahVerses.keys()).sort((a, b) => a - b);
  const minAyah = sortedAyahs[0];
  const maxAyah = sortedAyahs[sortedAyahs.length - 1];

  for (let expansion = 1; expansion <= 10; expansion++) {
    const start = Math.max(minAyah, primaryAyah - expansion);
    const end = Math.min(maxAyah, primaryAyah + expansion);

    const parts: string[] = [];
    for (let a = start; a <= end; a++) {
      const text = surahVerses.get(a);
      if (text) parts.push(text);
    }
    const combined = parts.join(" ");

    if (allOptionsInText(options, combined)) {
      return {
        contextMode: "multi_ayah",
        contextStartAyah: start,
        contextEndAyah: end,
        displayedPassageText: combined,
        validationPassed: true,
      };
    }
  }

  // Last resort: use full surah context from map
  const allParts: string[] = [];
  for (const a of sortedAyahs) {
    const t = surahVerses.get(a);
    if (t) allParts.push(t);
  }
  const fullText = allParts.join(" ");
  return {
    contextMode: "multi_ayah",
    contextStartAyah: minAyah,
    contextEndAyah: maxAyah,
    displayedPassageText: fullText,
    validationPassed: allOptionsInText(options, fullText),
  };
}

// ────────────────────────────────────────────────────────────────────
// Main backfill
// ────────────────────────────────────────────────────────────────────
export async function backfillTabariContext(): Promise<{
  total: number;
  singleAyah: number;
  multiAyah: number;
  updated: number;
  reviewNeeded: number;
}> {
  const rows = await db.select().from(tabariExercises);

  // Build verse map from DB + supplements
  const verseMap: VerseMap = new Map();

  // 1. From DB rows
  for (const row of rows) {
    if (!verseMap.has(row.surahNumber)) verseMap.set(row.surahNumber, new Map());
    const sm = verseMap.get(row.surahNumber)!;
    if (!sm.has(row.ayah)) sm.set(row.ayah, row.verseText);
    // Also capture passage sub-verses that aren't in the CSV
    if (row.primaryAyahNumber && row.contextStartAyah && row.contextEndAyah) {
      // We can't recover individual ayah texts from a joined passage easily,
      // so we rely on supplementary verses for the known gaps.
    }
  }

  // 2. From supplementary hard-coded map
  for (const [key, text] of Object.entries(SUPPLEMENTARY_VERSES)) {
    const [s, a] = key.split(":").map(Number);
    if (!verseMap.has(s)) verseMap.set(s, new Map());
    const sm = verseMap.get(s)!;
    if (!sm.has(a)) sm.set(a, text);
  }

  let updated = 0;
  let reviewNeeded = 0;
  let singleAyah = 0;
  let multiAyah = 0;

  for (const row of rows) {
    const options = [row.optionA, row.optionB, row.optionC, row.optionD];
    const result = expandContext(row.surahNumber, row.ayah, options, verseMap);

    if (result.contextMode === "single_ayah") singleAyah++;
    else multiAyah++;

    if (!result.validationPassed) reviewNeeded++;

    // Determine if row needs updating
    const changed =
      result.contextMode !== row.contextMode ||
      result.contextStartAyah !== row.contextStartAyah ||
      result.contextEndAyah !== row.contextEndAyah ||
      result.displayedPassageText !== (row.displayedPassageText ?? "");

    if (changed) {
      await db
        .update(tabariExercises)
        .set({
          contextMode: result.contextMode,
          contextStartAyah: result.contextStartAyah,
          contextEndAyah: result.contextEndAyah,
          primaryAyahNumber: row.ayah,
          displayedPassageText: result.displayedPassageText,
          optionsSourceScope: result.validationPassed
            ? "displayed_passage_only"
            : "review_needed",
        })
        .where(eq(tabariExercises.id, row.id));
      updated++;
    }
  }

  return { total: rows.length, singleAyah, multiAyah, updated, reviewNeeded };
}
