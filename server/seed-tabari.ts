import { db } from "./db";
import { tabariExercises } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CsvRow {
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
  source: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split("\n").filter(l => l.trim());
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 14) continue;
    const get = (idx: number) => cols[idx]?.trim() ?? "";
    rows.push({
      id: parseInt(get(0)),
      surah_number: parseInt(get(1)),
      surah_name_ar: get(2),
      ayah: parseInt(get(3)),
      verse_text: get(4),
      prompt_en: get(5),
      question_en: get(6),
      option_A: get(7),
      option_B: get(8),
      option_C: get(9),
      option_D: get(10),
      correct_answer: get(11),
      correct_word: get(12),
      source: get(13),
    });
  }
  return rows;
}

function allOptionsInText(options: string[], text: string): boolean {
  return options.every(opt => opt && text.includes(opt));
}

function buildVerseMap(rows: CsvRow[]): Map<number, Map<number, string>> {
  const map = new Map<number, Map<number, string>>();
  for (const row of rows) {
    if (!map.has(row.surah_number)) map.set(row.surah_number, new Map());
    const surahMap = map.get(row.surah_number)!;
    if (!surahMap.has(row.ayah)) {
      surahMap.set(row.ayah, row.verse_text);
    }
  }
  return map;
}

function expandContext(
  surahNum: number,
  primaryAyah: number,
  options: string[],
  verseMap: Map<number, Map<number, string>>
): {
  contextMode: string;
  contextStartAyah: number;
  contextEndAyah: number;
  displayedPassageText: string;
} {
  const surahVerses = verseMap.get(surahNum);
  if (!surahVerses) {
    return {
      contextMode: "single_ayah",
      contextStartAyah: primaryAyah,
      contextEndAyah: primaryAyah,
      displayedPassageText: verseMap.get(surahNum)?.get(primaryAyah) ?? "",
    };
  }

  const primaryText = surahVerses.get(primaryAyah) ?? "";

  if (allOptionsInText(options, primaryText)) {
    return {
      contextMode: "single_ayah",
      contextStartAyah: primaryAyah,
      contextEndAyah: primaryAyah,
      displayedPassageText: primaryText,
    };
  }

  const sortedAyahs = Array.from(surahVerses.keys()).sort((a, b) => a - b);
  const minAyah = sortedAyahs[0];
  const maxAyah = sortedAyahs[sortedAyahs.length - 1];

  for (let expansion = 1; expansion <= 6; expansion++) {
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
      };
    }
  }

  // Could not cover all options — use widest available context for this surah
  const allParts: string[] = [];
  for (const [, text] of surahVerses) allParts.push(text);
  return {
    contextMode: "multi_ayah",
    contextStartAyah: minAyah,
    contextEndAyah: maxAyah,
    displayedPassageText: allParts.join(" "),
  };
}

export async function seedTabariExercises() {
  const csvPath = path.resolve(
    __dirname,
    "../attached_assets/quranesh_tabari_300_exercises_1775627880040.csv"
  );

  if (!fs.existsSync(csvPath)) {
    console.warn("⚠️  Tabari CSV not found at", csvPath);
    return;
  }

  const raw = fs.readFileSync(csvPath, "utf-8").replace(/^\uFEFF/, "");
  const rows = parseCsv(raw);

  // Load existing rows for per-row idempotency check.
  // Key: "surahNumber:ayah:correctWord" — unique per question since each ayah
  // can have multiple questions but each targets a distinct correct word.
  const existing = await db
    .select({
      surahNumber: tabariExercises.surahNumber,
      ayah: tabariExercises.ayah,
      correctWord: tabariExercises.correctWord,
    })
    .from(tabariExercises);

  const existingKeys = new Set(
    existing.map(r => `${r.surahNumber}:${r.ayah}:${r.correctWord}`)
  );

  if (existingKeys.size >= rows.length) {
    console.log(`✓ Tabari exercises already fully seeded (${existingKeys.size} rows). Skipping.`);
    return;
  }

  const verseMap = buildVerseMap(rows);

  const toInsert = rows.filter(
    row => !existingKeys.has(`${row.surah_number}:${row.ayah}:${row.correct_word}`)
  );

  if (toInsert.length === 0) {
    console.log(`✓ All Tabari exercises already present. Skipping.`);
    return;
  }

  console.log(`Seeding ${toInsert.length} new Tabari exercises (${rows.length - toInsert.length} already present)...`);

  let multiAyahCount = 0;
  const inserts = toInsert.map(row => {
    const options = [row.option_A, row.option_B, row.option_C, row.option_D];
    const ctx = expandContext(row.surah_number, row.ayah, options, verseMap);
    if (ctx.contextMode === "multi_ayah") multiAyahCount++;

    return {
      surahNumber: row.surah_number,
      surahNameAr: row.surah_name_ar,
      ayah: row.ayah,
      verseText: row.verse_text,
      promptEn: row.prompt_en,
      questionEn: row.question_en,
      optionA: row.option_A,
      optionB: row.option_B,
      optionC: row.option_C,
      optionD: row.option_D,
      correctAnswer: row.correct_answer,
      correctWord: row.correct_word,
      source: row.source || "Tafsir al-Tabari only",
      contextMode: ctx.contextMode,
      contextStartAyah: ctx.contextStartAyah,
      contextEndAyah: ctx.contextEndAyah,
      primaryAyahNumber: row.ayah,
      displayedPassageText: ctx.displayedPassageText,
      optionsSourceScope: "displayed_passage_only",
    };
  });

  const BATCH = 50;
  for (let i = 0; i < inserts.length; i += BATCH) {
    await db.insert(tabariExercises).values(inserts.slice(i, i + BATCH));
  }

  console.log(`✅ Seeded ${inserts.length} Tabari exercises (${multiAyahCount} multi-ayah, ${inserts.length - multiAyahCount} single-ayah).`);
}
