/**
 * Tabari Exercise Generation Pipeline
 * =====================================
 * This is the SINGLE SOURCE OF TRUTH for the validation-gated pipeline:
 *
 *   candidate item
 *   → Step A: single_ayah attempt  → validation gates → PASS → generated_single_pass
 *                                                      → FAIL ↓
 *   → Step B: multi_ayah expansion → validation gates → PASS → generated_multi_pass
 *                                                      → FAIL → generation_failed
 *
 * NO question may be published unless it passes these gates.
 * The gates are BLOCKING — failure means rejection, not a warning.
 *
 * Validation gates (applied at every context attempt):
 *   1. options_from_displayed_passage_only  — all 4 options appear literally in passage
 *   2. options_distinct                     — all 4 options are distinct after normalisation
 *   3. correct_option_in_passage            — correct word is in the passage
 *
 * Multi-ayah expansion rules:
 *   - SAME surah only
 *   - CONTIGUOUS ayahs only (no gaps)
 *   - Minimum viable expansion: +1 / -1, growing to ±10 at most
 */

export type ContextMode = "single_ayah" | "multi_ayah";

export interface ContextInfo {
  contextMode: ContextMode;
  contextStartAyah: number;
  contextEndAyah: number;
  displayedPassageText: string;
}

export type GenerationStatus =
  | "generated_single_pass"
  | "generated_multi_pass"
  | "generation_failed"
  | "sent_to_review";

export type GenerationFailureReason =
  | "surah_not_in_verse_map"
  | "primary_ayah_not_in_verse_map"
  | "duplicate_options"
  | "insufficient_options_single_ayah"
  | "insufficient_options_multi_ayah"
  | null;

export type GenerationResult =
  | { status: "generated_single_pass"; context: ContextInfo }
  | { status: "generated_multi_pass"; context: ContextInfo }
  | {
      status: "generation_failed";
      reason: GenerationFailureReason;
      candidateContext?: ContextInfo;
    };

/** Verse map: surahNumber → (ayahNumber → verseText) */
export type VerseMap = Map<number, Map<number, string>>;

// ─── Text normalisation ──────────────────────────────────────────────────────

/**
 * Strip Arabic tashkeel/diacritics (U+064B–U+065F and U+0670) so that
 * مَا and ما are treated as the same word.
 */
export function stripDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670]/g, "");
}

/** Case-insensitive substring check after diacritics normalisation. */
function optionInText(option: string, text: string): boolean {
  return stripDiacritics(text).includes(stripDiacritics(option));
}

// ─── Validation gates ────────────────────────────────────────────────────────

interface GateResult {
  passed: boolean;
  failedGate?: string;
  reason?: GenerationFailureReason;
}

/**
 * Gate 1: options_distinct
 * All 4 options must be distinct (after diacritics stripping and trimming).
 */
function gateOptionsDistinct(options: string[]): GateResult {
  const normalised = options.map(o => stripDiacritics(o.trim()).toLowerCase());
  if (new Set(normalised).size < normalised.length) {
    return { passed: false, failedGate: "options_distinct", reason: "duplicate_options" };
  }
  return { passed: true };
}

/**
 * Gate 2: options_from_displayed_passage_only
 * Every option must appear as a literal substring in the displayed passage
 * (after diacritics normalisation on both sides).
 * This is the CORE generation gate — if any option is absent from the passage,
 * the context is rejected.
 */
function gateAllOptionsInPassage(
  options: string[],
  passage: string
): GateResult {
  const missing = options.filter(o => !optionInText(o, passage));
  if (missing.length > 0) {
    return {
      passed: false,
      failedGate: "options_from_displayed_passage_only",
      reason: "insufficient_options_single_ayah",
    };
  }
  return { passed: true };
}

/**
 * Run all blocking validation gates on a candidate context.
 * Returns the FIRST failure encountered (gates are ordered by priority).
 */
function runValidationGates(options: string[], passage: string): GateResult {
  const g1 = gateOptionsDistinct(options);
  if (!g1.passed) return g1;

  const g2 = gateAllOptionsInPassage(options, passage);
  if (!g2.passed) return g2;

  return { passed: true };
}

// ─── Context builder ─────────────────────────────────────────────────────────

/**
 * Build the displayed passage text for ayahs [start, end] (inclusive).
 * Returns null if no verses are found in that range.
 */
function buildPassage(
  start: number,
  end: number,
  surahVerses: Map<number, string>
): string | null {
  const parts: string[] = [];
  for (let a = start; a <= end; a++) {
    const t = surahVerses.get(a);
    if (t) parts.push(t);
  }
  return parts.length > 0 ? parts.join(" ") : null;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * The validation-gated generation pipeline.
 *
 * Given a target surah, primary ayah, four options, and the verse map,
 * returns either a publishable candidate (single or multi-ayah) or a
 * generation_failed result.  No published question may bypass this function.
 */
export function generateWithValidation(
  surahNum: number,
  primaryAyah: number,
  options: string[],
  verseMap: VerseMap
): GenerationResult {
  const surahVerses = verseMap.get(surahNum);
  if (!surahVerses) {
    return { status: "generation_failed", reason: "surah_not_in_verse_map" };
  }

  if (!surahVerses.has(primaryAyah)) {
    return { status: "generation_failed", reason: "primary_ayah_not_in_verse_map" };
  }

  // ── Step A: single_ayah ──────────────────────────────────────────────────
  const singlePassage = buildPassage(primaryAyah, primaryAyah, surahVerses);
  if (singlePassage !== null) {
    const gateResult = runValidationGates(options, singlePassage);
    if (gateResult.passed) {
      return {
        status: "generated_single_pass",
        context: {
          contextMode: "single_ayah",
          contextStartAyah: primaryAyah,
          contextEndAyah: primaryAyah,
          displayedPassageText: singlePassage,
        },
      };
    }
  }

  // ── Step B: multi_ayah — progressive contiguous expansion ───────────────
  const sortedAyahs = Array.from(surahVerses.keys()).sort((a, b) => a - b);
  const minAyah = sortedAyahs[0];
  const maxAyah = sortedAyahs[sortedAyahs.length - 1];

  let lastMultiContext: ContextInfo | undefined;

  for (let expansion = 1; expansion <= 10; expansion++) {
    const start = Math.max(minAyah, primaryAyah - expansion);
    const end = Math.min(maxAyah, primaryAyah + expansion);

    const passage = buildPassage(start, end, surahVerses);
    if (!passage) continue;

    lastMultiContext = {
      contextMode: "multi_ayah",
      contextStartAyah: start,
      contextEndAyah: end,
      displayedPassageText: passage,
    };

    const gateResult = runValidationGates(options, passage);
    if (gateResult.passed) {
      return {
        status: "generated_multi_pass",
        context: lastMultiContext,
      };
    }

    // Stop early if we've already reached both bounds
    if (start === minAyah && end === maxAyah) break;
  }

  // ── Both steps failed ────────────────────────────────────────────────────
  return {
    status: "generation_failed",
    reason: "insufficient_options_multi_ayah",
    candidateContext: lastMultiContext,
  };
}

// ─── Verse-map builder ───────────────────────────────────────────────────────

/**
 * Build a VerseMap from an array of {surahNumber, ayah, verseText} objects.
 * Later entries do NOT overwrite earlier ones for the same (surah, ayah) key,
 * so the first occurrence of each ayah wins.
 */
export function buildVerseMap(
  rows: Array<{ surahNumber: number; ayah: number; verseText: string }>
): VerseMap {
  const map: VerseMap = new Map();
  for (const row of rows) {
    if (!map.has(row.surahNumber)) map.set(row.surahNumber, new Map());
    const sm = map.get(row.surahNumber)!;
    if (!sm.has(row.ayah)) sm.set(row.ayah, row.verseText);
  }
  return map;
}

/**
 * Merge supplementary (key: "surahNum:ayahNum", value: text) verses into
 * an existing VerseMap.  Only fills gaps — does not overwrite existing entries.
 */
export function mergeSupplementaryVerses(
  verseMap: VerseMap,
  supplementary: Record<string, string>
): void {
  for (const [key, text] of Object.entries(supplementary)) {
    const [s, a] = key.split(":").map(Number);
    if (!verseMap.has(s)) verseMap.set(s, new Map());
    const sm = verseMap.get(s)!;
    if (!sm.has(a)) sm.set(a, text);
  }
}

// ─── Canonical supplementary verses ─────────────────────────────────────────
// Ayahs that are NOT present in the CSV but are needed so the expansion
// algorithm can cover distractor options that reference them.

export const SUPPLEMENTARY_VERSES: Record<string, string> = {
  "1:1": "بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ",
  "1:2": "الحَمدُ لِلَّهِ رَبِّ العالَمينَ",
  "1:3": "الرَّحمٰنِ الرَّحيمِ",
  "1:4": "مالِكِ يَومِ الدّينِ",
  "1:5": "إِيّاكَ نَعبُدُ وَإِيّاكَ نَستَعينُ",
  "1:6": "اهدِنَا الصِّراطَ المُستَقيمَ",
  "1:7": "صِراطَ الَّذينَ أَنعَمتَ عَلَيهِم غَيرِ المَغضوبِ عَلَيهِم وَلَا الضّالّينَ",
  "101:10": "وَما أَدراكَ ما هِيَه",
  "101:11": "نارٌ حامِيَة",
  "111:5": "في جيدِها حَبلٌ مِن مَسَدٍ",
  "114:1": "قُل أَعوذُ بِرَبِّ النّاسِ",
};
