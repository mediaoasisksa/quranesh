/**
 * Vocabulary Exercise Option Validator
 * =====================================
 * BLOCKING gate that enforces the non-negotiable rule:
 *
 *   Every option shown to the student must appear LITERALLY (exact surface form)
 *   in the displayed Arabic passage after normalisation.
 *
 * Matching rules:
 *   - Strip diacritics (tashkeel: U+064B–U+065F, U+0670)
 *   - Normalise alif/hamza variants (أإآاٱ → ا)
 *   - Remove tatweel (U+0640) and ornamental verse marks (U+06D6–U+06DC, U+06DF–U+06E4)
 *   - Match WHOLE TOKENS only (whitespace-split words) — NOT substrings
 *   - No root-based, lemma-based, or morphological matching
 *
 * Pipeline (mirrors tabari-generator.ts gate logic):
 *
 *   Step A — single_ayah:
 *     check: all options ∈ token set of correctVerse?
 *       → yes  → return exercise unchanged
 *       → no   → rebuild options from verse tokens
 *         → ≥3 distractors available  → rebuilt options (single_ayah)
 *         → <3 distractors            → Step B
 *
 *   Step B — multi_ayah expansion (±1 … ±5 surrounding verses):
 *     build passage = correctVerse + surrounding verse texts
 *     rebuild options from passage tokens
 *       → ≥3 distractors  → rebuilt options + expanded displayedPassageText
 *       → all fail         → return null  (exercise rejected)
 */

import { getSupplementVerseMaps } from "./surah-verse-supplement";

export interface ValidatedOptions {
  options: Array<{ text: string; isCorrect: boolean }>;
  displayedPassageText: string;
  contextMode: "single_ayah" | "multi_ayah";
  contextStartAyah: number;
  contextEndAyah: number;
}

// ─── Normalisation ───────────────────────────────────────────────────────────

/** Strip Arabic tashkeel (diacritics). */
function stripDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670]/g, "");
}

/** Normalise alif and hamza variants so مَلِك / مَلِكِ / أَمْ / ءَامَن all compare fairly. */
function normalizeAlifHamza(s: string): string {
  return s
    .replace(/[أإآاٱ]/g, "ا")
    .replace(/[ؤئ]/g, "ء");
}

/** Remove tatweel and Quranic ornamental punctuation marks. */
function stripOrnamental(s: string): string {
  return s.replace(/[\u0640\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, "");
}

/**
 * Normalise an Arabic token for comparison.
 * Apply all three transformations in order.
 */
export function normalizeToken(s: string): string {
  return normalizeAlifHamza(stripDiacritics(stripOrnamental(s)));
}

// ─── Tokenisation ────────────────────────────────────────────────────────────

/**
 * Split an Arabic text into word tokens.
 * Tokens shorter than 2 normalised characters are excluded (bare prepositions: و، ف).
 * Original (diacritics-bearing) forms are returned; use normalizeToken() to compare.
 */
export function tokenizeArabic(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(t => normalizeToken(t).length >= 2);
}

/** Build a normalised token set for fast membership testing. */
export function buildTokenSet(text: string): Set<string> {
  return new Set(tokenizeArabic(text).map(t => normalizeToken(t)));
}

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * True only when EVERY option in the list is an exact (normalised) member of
 * the passage's token set. Substring matches are NOT accepted.
 */
export function allOptionsInPassage(
  options: Array<{ text: string; isCorrect: boolean }>,
  passage: string
): boolean {
  const tset = buildTokenSet(passage);
  return options.every(opt => tset.has(normalizeToken(opt.text)));
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

// ─── Option rebuilding ───────────────────────────────────────────────────────

/**
 * Try to build a valid 4-option set (correct word + 3 distractors) where
 * ALL options are tokens from `passage`.
 *
 * Returns the option array, or null when:
 *   - The target word itself is not a surface token of the passage, OR
 *   - Fewer than 3 distinct distractor tokens exist after excluding the target.
 */
function buildOptionsFromPassage(
  targetWord: string,
  passage: string
): Array<{ text: string; isCorrect: boolean }> | null {
  const normTarget = normalizeToken(targetWord);
  const tokens = tokenizeArabic(passage);

  // Gate 0: The correct answer must be literally present in the passage.
  // If the target word is only present as part of a compound token (e.g.,
  // "الساهرة" inside "بالساهرة") but not as a standalone token, reject.
  const passageTokenSet = new Set(tokens.map(t => normalizeToken(t)));
  if (!passageTokenSet.has(normTarget)) return null;

  // Deduplicate by normalised form, keep original diacritics on first occurrence
  const seen = new Set<string>([normTarget]);
  const distractorPool: string[] = [];

  for (const token of tokens) {
    const norm = normalizeToken(token);
    if (seen.has(norm)) continue;
    seen.add(norm);
    distractorPool.push(token); // keep diacritics so the UI looks correct
  }

  if (distractorPool.length < 3) return null;

  const distractors = shuffleArray(distractorPool)
    .slice(0, 3)
    .map(t => ({ text: t, isCorrect: false as const }));

  const correct = { text: targetWord, isCorrect: true as const };
  return shuffleArray([correct, ...distractors]);
}

// ─── Verse map building ───────────────────────────────────────────────────────

/**
 * Build per-surah verse maps from a list of bank entries.
 * Merges with the supplementary verse bank so expansion always has data.
 */
export function buildSurahVerseMaps(
  entries: Array<{ surahAr: string; ayahNumber: number; correctVerse: string }>
): Map<string, Map<number, string>> {
  // Start with the supplement (comprehensive coverage of short surahs)
  const result: Map<string, Map<number, string>> = getSupplementVerseMaps();

  // Add / overwrite with bank entries (they are authoritative for the verses they cover)
  for (const entry of entries) {
    if (!result.has(entry.surahAr)) result.set(entry.surahAr, new Map());
    const sm = result.get(entry.surahAr)!;
    // Only set if not already present (supplement takes precedence for adjacent verses)
    if (!sm.has(entry.ayahNumber)) {
      sm.set(entry.ayahNumber, entry.correctVerse);
    }
  }
  return result;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Validate and (if necessary) rebuild the options for a vocabulary exercise.
 *
 * Returns ValidatedOptions with the corrected options + the displayedPassageText
 * that the frontend must render (so all options are visually present).
 *
 * Returns null when no valid context can be built (exercise must be skipped).
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
    // All existing options already pass exact-token check — return unchanged
    return {
      options,
      displayedPassageText: correctVerse,
      contextMode: "single_ayah",
      contextStartAyah: ayahNumber,
      contextEndAyah: ayahNumber,
    };
  }

  // Existing options fail — try rebuilding from single-verse tokens
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
  if (!verseMap || verseMap.size === 0) return null;

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

    if (parts.length === 0) continue;
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

    if (start === minAyah && end === maxAyah) break; // nowhere left to expand
  }

  return null; // All contexts exhausted — reject exercise
}
