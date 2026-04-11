/**
 * Vocabulary Exercise Option Validator
 * =====================================
 * BLOCKING gate that enforces the core rule:
 *
 *   Every option shown to the student must appear LITERALLY in the
 *   displayed Arabic passage (after diacritics normalisation).
 *
 * Pipeline (matches tabari-generator.ts logic):
 *
 *   exercise selected
 *   → Step A: check options vs single-ayah (correctVerse)
 *     → all pass → return exercise unchanged
 *     → any fail → rebuild options from verse tokens
 *       → enough tokens (≥3 distractors) → rebuilt options, single_ayah
 *       → not enough → Step B: expand to adjacent ayahs
 *   → Step B: try progressively wider contexts (±1, ±2 … ±5 ayahs)
 *     → first passing context → rebuilt options + expanded displayedPassageText
 *     → all contexts fail → return null (exercise rejected)
 *
 * Normalisation rules (same as tabari-generator.ts):
 *   - Strip Arabic diacritics (U+064B–U+065F, U+0670)
 *   - Substring check (not whole-word-only) to handle grammatical attachments
 *   - No root/morphology matching — surface form only
 */

export interface VerseMap {
  /** surahKey (e.g. "الناس") → (ayahNumber → verseText) */
  [surahKey: string]: Map<number, string>;
}

export interface ValidatedOptions {
  options: Array<{ text: string; isCorrect: boolean }>;
  displayedPassageText: string;
  contextMode: "single_ayah" | "multi_ayah";
  contextStartAyah: number;
  contextEndAyah: number;
}

// ─── Text normalisation ──────────────────────────────────────────────────────

/** Strip Arabic tashkeel (diacritics). */
export function stripDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670]/g, "");
}

/** True if `option` appears as a substring of `passage` (diacritics-insensitive). */
function optionInPassage(option: string, passage: string): boolean {
  return stripDiacritics(passage).includes(stripDiacritics(option));
}

// ─── Tokenisation ────────────────────────────────────────────────────────────

/**
 * Split an Arabic text into word tokens, keeping diacritics on each token.
 * Filters out tokens shorter than 2 characters (bare prepositions like و، ف).
 */
export function tokenizeArabic(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(t => {
      const stripped = stripDiacritics(t);
      return stripped.length >= 2;
    });
}

// ─── Shuffle helper ──────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Core validation + rebuild ───────────────────────────────────────────────

/**
 * Check whether all options in `options` appear in `passage`.
 * Returns true only when EVERY option passes.
 */
export function allOptionsInPassage(
  options: Array<{ text: string; isCorrect: boolean }>,
  passage: string
): boolean {
  return options.every(opt => optionInPassage(opt.text, passage));
}

/**
 * Try to build a valid 4-option set where all options (correct + 3 distractors)
 * are words from `passage`.
 *
 * Returns the rebuilt options array, or null if the passage does not contain
 * at least 3 unique words that differ from the target word (so we can't form
 * 4 distinct options).
 */
function buildOptionsFromPassage(
  targetWord: string,
  passage: string
): Array<{ text: string; isCorrect: boolean }> | null {
  const strippedTarget = stripDiacritics(targetWord);
  const tokens = tokenizeArabic(passage);

  // Deduplicate tokens (keep first occurrence, with original diacritics)
  const seen = new Set<string>([strippedTarget]);
  const distractorPool: string[] = [];

  for (const token of tokens) {
    const stripped = stripDiacritics(token);
    if (seen.has(stripped)) continue;
    seen.add(stripped);
    distractorPool.push(token);
  }

  if (distractorPool.length < 3) return null; // cannot build 4 distinct options

  const distractors = shuffleArray(distractorPool)
    .slice(0, 3)
    .map(t => ({ text: t, isCorrect: false as const }));

  const correct = { text: targetWord, isCorrect: true as const };
  return shuffleArray([correct, ...distractors]);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Validate and (if necessary) rebuild the options for a vocabulary exercise.
 *
 * @param targetWord   The correct Arabic word the student must identify.
 * @param correctVerse The single-ayah verse text shown by default.
 * @param ayahNumber   The primary ayah number (1-indexed within surah).
 * @param options      The pre-defined option list from the vocab bank.
 * @param verseMap     Surah verse map used for multi-ayah expansion.
 *                     Key: surahKey string, value: Map<ayahNumber, text>.
 *
 * Returns a `ValidatedOptions` with validated/rebuilt options and the
 * `displayedPassageText` that covers all of them.
 * Returns `null` if no valid context can be found (exercise should be skipped).
 */
export function validateAndRebuildOptions(
  targetWord: string,
  correctVerse: string,
  ayahNumber: number,
  options: Array<{ text: string; isCorrect: boolean }>,
  verseMap?: Map<number, string>
): ValidatedOptions | null {

  // ── Step A: single_ayah ──────────────────────────────────────────────────
  if (allOptionsInPassage(options, correctVerse)) {
    // All existing options already pass — return without rebuilding
    return {
      options,
      displayedPassageText: correctVerse,
      contextMode: "single_ayah",
      contextStartAyah: ayahNumber,
      contextEndAyah: ayahNumber,
    };
  }

  // Try rebuilding from single verse tokens
  const singleRebuilt = buildOptionsFromPassage(targetWord, correctVerse);
  if (singleRebuilt !== null) {
    return {
      options: singleRebuilt,
      displayedPassageText: correctVerse,
      contextMode: "single_ayah",
      contextStartAyah: ayahNumber,
      contextEndAyah: ayahNumber,
    };
  }

  // ── Step B: multi_ayah expansion ────────────────────────────────────────
  if (!verseMap || verseMap.size === 0) {
    return null; // No verse map available → reject
  }

  const sortedAyahs = Array.from(verseMap.keys()).sort((a, b) => a - b);
  const minAyah = sortedAyahs[0];
  const maxAyah = sortedAyahs[sortedAyahs.length - 1];

  for (let expansion = 1; expansion <= 5; expansion++) {
    const start = Math.max(minAyah, ayahNumber - expansion);
    const end = Math.min(maxAyah, ayahNumber + expansion);

    const parts: string[] = [];
    for (let a = start; a <= end; a++) {
      const t = verseMap.get(a);
      if (t) parts.push(t);
    }
    const passage = parts.join(" ");

    const multiRebuilt = buildOptionsFromPassage(targetWord, passage);
    if (multiRebuilt !== null) {
      return {
        options: multiRebuilt,
        displayedPassageText: passage,
        contextMode: "multi_ayah",
        contextStartAyah: start,
        contextEndAyah: end,
      };
    }

    if (start === minAyah && end === maxAyah) break;
  }

  return null; // All contexts failed → reject exercise
}

// ─── Verse map builder ───────────────────────────────────────────────────────

/**
 * Build per-surah verse maps from the JUZ_AMMA_BANK + VOCAB_BANK entries.
 * Key: surahAr string. Value: Map<ayahNumber, verseText>.
 */
export function buildSurahVerseMaps(
  entries: Array<{ surahAr: string; ayahNumber: number; correctVerse: string }>
): Map<string, Map<number, string>> {
  const result = new Map<string, Map<number, string>>();
  for (const entry of entries) {
    if (!result.has(entry.surahAr)) result.set(entry.surahAr, new Map());
    const sm = result.get(entry.surahAr)!;
    if (!sm.has(entry.ayahNumber)) sm.set(entry.ayahNumber, entry.correctVerse);
  }
  return result;
}
