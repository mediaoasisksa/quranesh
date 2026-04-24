/**
 * Tabari Exercise Seeder
 * ======================
 * Reads the canonical CSV and inserts rows into tabari_exercises.
 * ALL rows pass through generateWithValidation() before being saved.
 *
 * Generation pipeline (per row):
 *   → single_ayah validation  → PASS → insert as generated_single_pass, is_active=true
 *                             → FAIL ↓
 *   → multi_ayah expansion    → PASS → insert as generated_multi_pass, is_active=true
 *                             → FAIL → insert as generation_failed, is_active=false
 *
 * This is idempotent: rows already in the DB (matched by surah+ayah+correctWord)
 * are skipped.
 */

import { db } from "./db";
import { tabariExercises } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  generateWithValidation,
  buildVerseMap,
  mergeSupplementaryVerses,
  SUPPLEMENTARY_VERSES,
  type VerseMap,
} from "./tabari-generator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CSV types ────────────────────────────────────────────────────────────────

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

// ─── RFC 4180-compliant CSV parser ───────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let field = "";
      i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++;
          break;
        } else {
          field += line[i++];
        }
      }
      fields.push(field.trim());
      if (line[i] === ",") i++;
    } else {
      const start = i;
      while (i < line.length && line[i] !== ",") i++;
      fields.push(line.slice(start, i).trim());
      if (line[i] === ",") i++;
    }
  }
  return fields;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split("\n").filter(l => l.trim());
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
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

// ─── Main seeder ─────────────────────────────────────────────────────────────

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
  const csvRows = parseCsv(raw);

  // Skip-if-done check
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

  if (existingKeys.size >= csvRows.length) {
    console.log(`✓ Tabari exercises already fully seeded (${existingKeys.size} rows). Skipping.`);
    return;
  }

  // ── Source enforcement: reject any row not from Tafsir al-Tabari ────────────
  const ALLOWED_SOURCE = "Tafsir al-Tabari only";
  const blockedRows = csvRows.filter(r => r.source !== ALLOWED_SOURCE);
  if (blockedRows.length > 0) {
    console.warn(`⛔ SOURCE BLOCK: ${blockedRows.length} rows rejected — source is not "${ALLOWED_SOURCE}".`);
    blockedRows.forEach(r =>
      console.warn(`   Row ${r.id} (surah=${r.surah_number} ayah=${r.ayah}): source="${r.source}"`)
    );
  }
  const allowedRows = csvRows.filter(r => r.source === ALLOWED_SOURCE);

  const toInsert = allowedRows.filter(
    r => !existingKeys.has(`${r.surah_number}:${r.ayah}:${r.correct_word}`)
  );

  if (toInsert.length === 0) {
    console.log(`✓ All Tabari exercises already present. Skipping.`);
    return;
  }

  // Build verse map from ALL CSV rows (not just the ones being inserted)
  const verseMap: VerseMap = buildVerseMap(
    csvRows.map(r => ({
      surahNumber: r.surah_number,
      ayah: r.ayah,
      verseText: r.verse_text,
    }))
  );
  mergeSupplementaryVerses(verseMap, SUPPLEMENTARY_VERSES);

  console.log(`Seeding ${toInsert.length} new Tabari exercises (${csvRows.length - toInsert.length} already present)...`);

  let singlePass = 0;
  let multiPass = 0;
  let failed = 0;

  const inserts = toInsert.map(row => {
    const options = [row.option_A, row.option_B, row.option_C, row.option_D];
    const result = generateWithValidation(row.surah_number, row.ayah, options, verseMap);

    let contextMode = "single_ayah";
    let contextStartAyah = row.ayah;
    let contextEndAyah = row.ayah;
    let displayedPassageText = row.verse_text;
    let optionsSourceScope = "review_needed";
    let generationStatus: string = "generation_failed";
    let generationFailureReason: string | null = null;
    let isActive = false;

    if (result.status === "generated_single_pass") {
      contextMode = "single_ayah";
      contextStartAyah = result.context.contextStartAyah;
      contextEndAyah = result.context.contextEndAyah;
      displayedPassageText = result.context.displayedPassageText;
      optionsSourceScope = "displayed_passage_only";
      generationStatus = "generated_single_pass";
      isActive = true;
      singlePass++;
    } else if (result.status === "generated_multi_pass") {
      contextMode = "multi_ayah";
      contextStartAyah = result.context.contextStartAyah;
      contextEndAyah = result.context.contextEndAyah;
      displayedPassageText = result.context.displayedPassageText;
      optionsSourceScope = "displayed_passage_only";
      generationStatus = "generated_multi_pass";
      isActive = true;
      multiPass++;
    } else {
      // generation_failed — still insert for audit purposes but mark inactive
      generationStatus = "generation_failed";
      generationFailureReason = result.reason ?? "insufficient_options_multi_ayah";
      optionsSourceScope = "review_needed";
      isActive = false;
      failed++;
    }

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
      contextMode,
      contextStartAyah,
      contextEndAyah,
      primaryAyahNumber: row.ayah,
      displayedPassageText,
      optionsSourceScope,
      generationStatus,
      generationFailureReason,
      isActive,
    };
  });

  const BATCH = 50;
  for (let i = 0; i < inserts.length; i += BATCH) {
    await db.insert(tabariExercises).values(inserts.slice(i, i + BATCH));
  }

  console.log(
    `✅ Seeded ${inserts.length} Tabari exercises: ` +
    `${singlePass} single_pass, ${multiPass} multi_pass, ${failed} generation_failed (is_active=false).`
  );
}

// ── CLI entrypoint ────────────────────────────────────────────────────────────
// One-shot execution:  npx tsx server/seed-tabari.ts
const scriptUrl = fileURLToPath(import.meta.url);
const isMain =
  process.argv[1] === scriptUrl ||
  process.argv[1]?.endsWith("/seed-tabari.ts") ||
  process.argv[1]?.endsWith("/seed-tabari.js");

if (isMain) {
  seedTabariExercises()
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1); });
}
