/**
 * generate-tabari-new-300.ts
 * =============================================
 * Generates 300 NEW Tabari exercises for surahs 78–92 (Juz Amma surahs
 * not yet covered by the original 300-exercise bank).
 *
 * Source enforcement: ONLY Tafsir al-Tabari (Jami al-Bayan) is used.
 * No other tafsir is permitted. The AI prompt explicitly blocks all
 * other sources.
 *
 * Pipeline:
 *   1. Fetch Arabic verse texts (with tashkeel) from alquran.cloud
 *   2. For each surah, ask Gemini AI to generate MCQ exercises using
 *      Tafsir al-Tabari ONLY as the source for word meanings
 *   3. Run every exercise through generateWithValidation() gate
 *   4. Insert passing rows into tabari_exercises (is_active=true)
 *   5. Write a summary CSV at attached_assets/tabari_new_300_<ts>.csv
 *
 * Run:
 *   npx tsx scripts/generate-tabari-new-300.ts
 *
 * Safe to re-run: idempotent (skips surah:ayah:word combos already in DB)
 */

import { db } from "../server/db";
import { tabariExercises } from "../shared/schema";
import {
  generateWithValidation,
  buildVerseMap,
  mergeSupplementaryVerses,
  SUPPLEMENTARY_VERSES,
  type VerseMap,
} from "../server/tabari-generator";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { eq, and } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");

// ─── Configuration ────────────────────────────────────────────────────────────

/** Surahs 78–92 are the Juz Amma surahs not yet in the original 300 bank */
const TARGET_SURAHS: Array<{ number: number; nameAr: string; nameEn: string; ayahCount: number }> = [
  { number: 78,  nameAr: "النبأ",       nameEn: "An-Naba",      ayahCount: 40 },
  { number: 79,  nameAr: "النازعات",   nameEn: "An-Naziat",    ayahCount: 46 },
  { number: 80,  nameAr: "عبس",         nameEn: "Abasa",        ayahCount: 42 },
  { number: 81,  nameAr: "التكوير",    nameEn: "At-Takwir",    ayahCount: 29 },
  { number: 82,  nameAr: "الانفطار",   nameEn: "Al-Infitar",   ayahCount: 19 },
  { number: 83,  nameAr: "المطففين",   nameEn: "Al-Mutaffifin",ayahCount: 36 },
  { number: 84,  nameAr: "الانشقاق",   nameEn: "Al-Inshiqaq",  ayahCount: 25 },
  { number: 85,  nameAr: "البروج",      nameEn: "Al-Buruj",     ayahCount: 22 },
  { number: 86,  nameAr: "الطارق",     nameEn: "At-Tariq",     ayahCount: 17 },
  { number: 87,  nameAr: "الأعلى",     nameEn: "Al-Ala",       ayahCount: 19 },
  { number: 88,  nameAr: "الغاشية",    nameEn: "Al-Ghashiyah", ayahCount: 26 },
  { number: 89,  nameAr: "الفجر",      nameEn: "Al-Fajr",      ayahCount: 30 },
  { number: 90,  nameAr: "البلد",      nameEn: "Al-Balad",     ayahCount: 20 },
  { number: 91,  nameAr: "الشمس",      nameEn: "Ash-Shams",    ayahCount: 15 },
  { number: 92,  nameAr: "الليل",      nameEn: "Al-Layl",      ayahCount: 21 },
];

/** How many exercises to target per surah */
const EXERCISES_PER_SURAH = 20;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Verse fetcher ────────────────────────────────────────────────────────────

interface Ayah {
  number: number;
  text: string;
}

async function fetchSurahVerses(surahNumber: number): Promise<Ayah[]> {
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.uthmani`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`alquran.cloud error: ${res.status} for surah ${surahNumber}`);
  const json = await res.json() as any;
  return (json.data.ayahs as any[]).map((a: any) => ({
    number: a.numberInSurah,
    text: a.text as string,
  }));
}

// ─── AI exercise generator (Tabari ONLY) ─────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface TabariExercise {
  ayah: number;
  verseText: string;
  promptEn: string;
  questionEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  correctWord: string;
}

async function generateWithRetry(prompt: string, maxRetries = 5): Promise<string> {
  const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"];
  for (const modelName of models) {
    const model = genAI.getGenerativeModel({ model: modelName });
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (e: any) {
        const msg = e?.message ?? "";
        if (msg.includes("429") || msg.includes("quota")) {
          const retryMatch = msg.match(/retry in (\d+)s/i);
          const waitMs = retryMatch ? parseInt(retryMatch[1]) * 1000 + 2000 : 60000;
          console.log(`  ⏳ Rate limit hit (${modelName}). Waiting ${Math.round(waitMs/1000)}s... (attempt ${attempt+1}/${maxRetries})`);
          await sleep(waitMs);
        } else {
          throw e;
        }
      }
    }
  }
  throw new Error("All models exhausted after retries");
}

async function generateExercisesForSurah(
  surahNumber: number,
  surahNameAr: string,
  surahNameEn: string,
  ayahs: Ayah[],
  targetCount: number
): Promise<TabariExercise[]> {

  // Select ayahs that have enough words (at least 4 distinct tokens)
  const eligibleAyahs = ayahs.filter(a => {
    const words = a.text.replace(/[\u064B-\u065F\u0670]/g, "")
      .split(/\s+/).filter(w => w.length > 0);
    return new Set(words).size >= 4;
  });

  if (eligibleAyahs.length === 0) {
    console.log(`  ⚠️  Surah ${surahNumber}: no ayahs with 4+ distinct words`);
    return [];
  }

  // Distribute exercises across eligible ayahs
  const perAyah = Math.max(1, Math.ceil(targetCount / eligibleAyahs.length));
  const prompt = `
You are a Quranic vocabulary exercise generator for the Quran education platform Quranesh.
Your ONLY source for word meanings is **Tafsir al-Tabari** (Jami al-Bayan fi Tafsir al-Quran).
You must NEVER use any other tafsir (Ibn Kathir, Qurtubi, Jalalayn, etc.).
You must NEVER invent meanings — only use what Tafsir al-Tabari explicitly states.

I will give you ayahs from Surah ${surahNameEn} (${surahNameAr}), Surah ${surahNumber}.
For EACH ayah, generate vocabulary multiple-choice exercises.

STRICT RULES:
1. Source: ONLY Tafsir al-Tabari. If al-Tabari does not comment on a word, skip it.
2. The "word" field must be an EXACT Arabic word (or 2-word compound) that appears verbatim in the verse text.
3. The "meaning" field is the English translation of that word AS DEFINED by Tafsir al-Tabari.
4. ALL FOUR options (A, B, C, D) must be EXACT Arabic tokens visible in the verse text.
5. No option may be from outside the verse text — no synonyms, no roots, no external words.
6. Options must be distinct (after removing tashkeel).
7. The question format: "What is the exact Arabic word that means: [English meaning]?"
8. Skip ayahs where the verse has fewer than 4 distinct Arabic words.

Ayahs:
${eligibleAyahs.slice(0, targetCount).map(a => `Ayah ${a.number}: ${a.text}`).join("\n")}

Return a JSON array. Each element:
{
  "ayah": <number>,
  "verse_text": "<exact Arabic text>",
  "prompt_en": "<short English meaning / key phrase>",
  "question_en": "What is the exact Arabic word that means: <meaning>?",
  "option_A": "<exact Arabic word from verse>",
  "option_B": "<exact Arabic word from verse>",
  "option_C": "<exact Arabic word from verse>",
  "option_D": "<exact Arabic word from verse>",
  "correct_answer": "A" | "B" | "C" | "D",
  "correct_word": "<exact Arabic word that is the answer>",
  "tabari_source_note": "<brief note on where in Tafsir al-Tabari this meaning comes from>"
}

Generate ${targetCount} exercises total, spread across the ayahs above.
If an ayah can't produce a valid exercise (too few words, no Tabari comment), skip it.
Return ONLY the JSON array, no markdown.
`.trim();

  try {
    const text = await generateWithRetry(prompt);
    const jsonStr = text.startsWith("[") ? text : text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(jsonStr) as any[];

    return parsed.map(r => ({
      ayah:          r.ayah,
      verseText:     r.verse_text,
      promptEn:      r.prompt_en,
      questionEn:    r.question_en,
      optionA:       r.option_A,
      optionB:       r.option_B,
      optionC:       r.option_C,
      optionD:       r.option_D,
      correctAnswer: r.correct_answer as "A" | "B" | "C" | "D",
      correctWord:   r.correct_word,
    }));
  } catch (e) {
    console.error(`  ❌ AI parse error for surah ${surahNumber}:`, (e as Error).message);
    return [];
  }
}

// ─── CSV writer ───────────────────────────────────────────────────────────────

function appendToCsv(csvPath: string, rows: CsvOutputRow[]): void {
  const lines = rows.map(r =>
    [
      r.id, r.surah_number, r.surah_name_ar, r.ayah,
      `"${r.verse_text.replace(/"/g, '""')}"`,
      `"${r.prompt_en.replace(/"/g, '""')}"`,
      `"${r.question_en.replace(/"/g, '""')}"`,
      r.option_A, r.option_B, r.option_C, r.option_D,
      r.correct_answer, r.correct_word,
      "Tafsir al-Tabari only",
    ].join(",")
  );
  fs.appendFileSync(csvPath, lines.join("\n") + "\n");
}

interface CsvOutputRow {
  id: number;
  surah_number: number;
  surah_name_ar: string;
  ayah: number;
  verse_text: string;
  prompt_en: string;
  question_en: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  correct_answer: string;
  correct_word: string;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Tabari New-300 Generator ===");
  console.log(`Target: ${TARGET_SURAHS.length} surahs × ${EXERCISES_PER_SURAH} exercises = ${TARGET_SURAHS.length * EXERCISES_PER_SURAH} exercises`);
  console.log("Source restriction: Tafsir al-Tabari ONLY\n");

  // Load existing keys from DB to skip duplicates
  const existing = await db
    .select({ surahNumber: tabariExercises.surahNumber, ayah: tabariExercises.ayah, correctWord: tabariExercises.correctWord })
    .from(tabariExercises);
  const existingKeys = new Set(existing.map(r => `${r.surahNumber}:${r.ayah}:${r.correctWord}`));
  console.log(`Already in DB: ${existingKeys.size} exercises. Skipping duplicates.\n`);

  // CSV output path
  const csvPath = path.join(ROOT, "attached_assets", `tabari_new_300_${Date.now()}.csv`);
  const csvHeader = "id,surah_number,surah_name_ar,ayah,verse_text,prompt_en,question_en,option_A,option_B,option_C,option_D,correct_answer,correct_word,source";
  fs.writeFileSync(csvPath, csvHeader + "\n");

  let totalInserted = 0;
  let totalFailed   = 0;
  let csvIdCounter  = 301;  // Continue from after the original 300

  for (const surah of TARGET_SURAHS) {
    console.log(`\n[${surah.number}] ${surah.nameEn} (${surah.nameAr}) — ${surah.ayahCount} ayahs`);

    // Fetch verse texts
    let ayahs: Ayah[] = [];
    try {
      ayahs = await fetchSurahVerses(surah.number);
      console.log(`  ✓ Fetched ${ayahs.length} ayahs`);
    } catch (e) {
      console.error(`  ❌ Fetch failed:`, (e as Error).message);
      continue;
    }

    await sleep(500);

    // Build verse map for this surah (for the generator)
    const verseMap: VerseMap = buildVerseMap(
      ayahs.map(a => ({ surahNumber: surah.number, ayah: a.number, verseText: a.text }))
    );
    mergeSupplementaryVerses(verseMap, SUPPLEMENTARY_VERSES);

    // Generate exercises via AI
    let candidates: TabariExercise[] = [];
    try {
      candidates = await generateExercisesForSurah(
        surah.number, surah.nameAr, surah.nameEn, ayahs, EXERCISES_PER_SURAH
      );
      console.log(`  ✓ AI generated ${candidates.length} candidate exercises`);
    } catch (e) {
      console.error(`  ❌ AI generation failed:`, (e as Error).message);
      continue;
    }

    await sleep(1000);

    let surahInserted = 0;
    let surahFailed   = 0;

    for (const cand of candidates) {
      // Deduplicate
      const key = `${surah.number}:${cand.ayah}:${cand.correctWord}`;
      if (existingKeys.has(key)) {
        console.log(`  ⏭️  Skip duplicate: ${key}`);
        continue;
      }

      // Validate through the gate pipeline
      const options = [cand.optionA, cand.optionB, cand.optionC, cand.optionD];
      const result = generateWithValidation(surah.number, cand.ayah, options, verseMap);

      let isActive = false;
      let contextMode = "single_ayah";
      let contextStart = cand.ayah;
      let contextEnd   = cand.ayah;
      let displayedText = cand.verseText;
      let genStatus = "generation_failed";
      let genFailReason: string | null = null;

      if (result.status === "generated_single_pass") {
        isActive      = true;
        contextMode   = "single_ayah";
        contextStart  = result.context.contextStartAyah;
        contextEnd    = result.context.contextEndAyah;
        displayedText = result.context.displayedPassageText;
        genStatus     = "generated_single_pass";
      } else if (result.status === "generated_multi_pass") {
        isActive      = true;
        contextMode   = "multi_ayah";
        contextStart  = result.context.contextStartAyah;
        contextEnd    = result.context.contextEndAyah;
        displayedText = result.context.displayedPassageText;
        genStatus     = "generated_multi_pass";
      } else {
        genFailReason = result.reason ?? null;
        genStatus     = "generation_failed";
      }

      // Insert into DB
      try {
        await db.insert(tabariExercises).values({
          surahNumber:            surah.number,
          surahNameAr:            surah.nameAr,
          ayah:                   cand.ayah,
          verseText:              cand.verseText,
          promptEn:               cand.promptEn,
          questionEn:             cand.questionEn,
          optionA:                cand.optionA,
          optionB:                cand.optionB,
          optionC:                cand.optionC,
          optionD:                cand.optionD,
          correctAnswer:          cand.correctAnswer,
          correctWord:            cand.correctWord,
          source:                 "Tafsir al-Tabari only",
          isActive,
          contextMode:            contextMode as any,
          contextStartAyah:       contextStart,
          contextEndAyah:         contextEnd,
          displayedPassageText:   displayedText,
          generationStatus:       genStatus as any,
          generationFailureReason: genFailReason as any,
          optionsSourceScope:     isActive ? "options_from_displayed_passage_only" : "review_needed",
        });

        existingKeys.add(key);

        if (isActive) {
          surahInserted++;
          totalInserted++;
          console.log(`  ✅ [${surah.number}:${cand.ayah}] "${cand.correctWord}" — ${genStatus}`);

          // Write to CSV
          appendToCsv(csvPath, [{
            id: csvIdCounter++,
            surah_number: surah.number,
            surah_name_ar: surah.nameAr,
            ayah: cand.ayah,
            verse_text: cand.verseText,
            prompt_en: cand.promptEn,
            question_en: cand.questionEn,
            option_A: cand.optionA,
            option_B: cand.optionB,
            option_C: cand.optionC,
            option_D: cand.optionD,
            correct_answer: cand.correctAnswer,
            correct_word: cand.correctWord,
          }]);
        } else {
          surahFailed++;
          totalFailed++;
          console.log(`  ❌ [${surah.number}:${cand.ayah}] "${cand.correctWord}" — FAILED: ${genFailReason}`);
        }
      } catch (e) {
        console.error(`  ❌ DB insert error:`, (e as Error).message);
        surahFailed++;
        totalFailed++;
      }
    }

    console.log(`  → Surah ${surah.number} done: ${surahInserted} active, ${surahFailed} failed`);
    await sleep(2000); // Rate limit between surahs
  }

  console.log("\n=== Generation Complete ===");
  console.log(`Total active inserted: ${totalInserted}`);
  console.log(`Total failed/inactive: ${totalFailed}`);
  console.log(`CSV saved to: ${csvPath}`);

  process.exit(0);
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
