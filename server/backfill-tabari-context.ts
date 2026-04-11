/**
 * Tabari Context Backfill
 * =======================
 * Re-validates ALL rows in tabari_exercises using the canonical generation
 * pipeline (server/tabari-generator.ts) and persists any field changes.
 *
 * This is the upstream fix — every row is re-classified through the same
 * blocking validation gates used at insert time:
 *
 *   existing row → generateWithValidation()
 *     → generated_single_pass  → is_active=true,  context_mode=single_ayah
 *     → generated_multi_pass   → is_active=true,  context_mode=multi_ayah
 *     → generation_failed      → is_active=false, generation_failure_reason=...
 *
 * After this runs, the database contains NO live (is_active=true) rows whose
 * options are not fully covered by their displayed_passage_text.
 *
 * Safety: fully idempotent — re-running produces no DB writes when every row
 * already matches the pipeline output.
 */

import { db } from "./db";
import { tabariExercises } from "@shared/schema";
import { eq } from "drizzle-orm";
import {
  generateWithValidation,
  buildVerseMap,
  mergeSupplementaryVerses,
  SUPPLEMENTARY_VERSES,
  type VerseMap,
} from "./tabari-generator";

export interface BackfillReport {
  total: number;
  keptSinglePass: number;
  upgradedToMulti: number;
  deactivated: number;
  sentToReview: number;
  updated: number;
}

export async function backfillTabariContext(): Promise<BackfillReport> {
  const rows = await db.select().from(tabariExercises);

  // Build verse map: DB rows first, then supplementary hard-coded verses
  const verseMap: VerseMap = buildVerseMap(
    rows.map(r => ({ surahNumber: r.surahNumber, ayah: r.ayah, verseText: r.verseText }))
  );
  mergeSupplementaryVerses(verseMap, SUPPLEMENTARY_VERSES);

  let keptSinglePass = 0;
  let upgradedToMulti = 0;
  let deactivated = 0;
  let updated = 0;

  for (const row of rows) {
    const options = [row.optionA, row.optionB, row.optionC, row.optionD];
    const result = generateWithValidation(row.surahNumber, row.ayah, options, verseMap);

    let newContextMode: string;
    let newContextStartAyah: number;
    let newContextEndAyah: number;
    let newDisplayedPassage: string;
    let newOptionsSourceScope: string;
    let newGenerationStatus: string;
    let newGenerationFailureReason: string | null;
    let newIsActive: boolean;

    if (result.status === "generated_single_pass") {
      newContextMode = "single_ayah";
      newContextStartAyah = result.context.contextStartAyah;
      newContextEndAyah = result.context.contextEndAyah;
      newDisplayedPassage = result.context.displayedPassageText;
      newOptionsSourceScope = "displayed_passage_only";
      newGenerationStatus = "generated_single_pass";
      newGenerationFailureReason = null;
      newIsActive = true;
      keptSinglePass++;
    } else if (result.status === "generated_multi_pass") {
      newContextMode = "multi_ayah";
      newContextStartAyah = result.context.contextStartAyah;
      newContextEndAyah = result.context.contextEndAyah;
      newDisplayedPassage = result.context.displayedPassageText;
      newOptionsSourceScope = "displayed_passage_only";
      newGenerationStatus = "generated_multi_pass";
      newGenerationFailureReason = null;
      newIsActive = true;
      upgradedToMulti++;
    } else {
      // generation_failed — deactivate; keep row for audit / manual review
      const candidate = result.candidateContext;
      newContextMode = candidate?.contextMode ?? row.contextMode ?? "single_ayah";
      newContextStartAyah = candidate?.contextStartAyah ?? row.contextStartAyah ?? row.ayah;
      newContextEndAyah = candidate?.contextEndAyah ?? row.contextEndAyah ?? row.ayah;
      newDisplayedPassage = candidate?.displayedPassageText ?? row.displayedPassageText ?? "";
      newOptionsSourceScope = "review_needed";
      newGenerationStatus = "generation_failed";
      newGenerationFailureReason = result.reason ?? "insufficient_options_multi_ayah";
      newIsActive = false;
      deactivated++;
    }

    // Force-update any row whose generation-pipeline columns are still NULL
    // (i.e. rows inserted before the generation_status / is_active columns existed).
    const hasNullPipelineFields = row.generationStatus === null || row.isActive === null;

    const changed =
      hasNullPipelineFields ||
      newContextMode !== (row.contextMode ?? "single_ayah") ||
      newContextStartAyah !== (row.contextStartAyah ?? row.ayah) ||
      newContextEndAyah !== (row.contextEndAyah ?? row.ayah) ||
      newDisplayedPassage !== (row.displayedPassageText ?? "") ||
      newOptionsSourceScope !== (row.optionsSourceScope ?? "displayed_passage_only") ||
      newGenerationStatus !== (row.generationStatus ?? "generated_single_pass") ||
      newGenerationFailureReason !== (row.generationFailureReason ?? null) ||
      newIsActive !== (row.isActive ?? true);

    if (changed) {
      await db
        .update(tabariExercises)
        .set({
          contextMode: newContextMode,
          contextStartAyah: newContextStartAyah,
          contextEndAyah: newContextEndAyah,
          primaryAyahNumber: row.ayah,
          displayedPassageText: newDisplayedPassage,
          optionsSourceScope: newOptionsSourceScope,
          generationStatus: newGenerationStatus,
          generationFailureReason: newGenerationFailureReason,
          isActive: newIsActive,
        })
        .where(eq(tabariExercises.id, row.id));
      updated++;
    }
  }

  const sentToReview = deactivated; // all deactivated rows are candidates for manual review

  console.log(
    `✅ Tabari backfill complete: ${rows.length} total, ` +
    `${keptSinglePass} single_pass, ${upgradedToMulti} multi_pass, ` +
    `${deactivated} deactivated (generation_failed), ${updated} rows updated.`
  );

  return {
    total: rows.length,
    keptSinglePass,
    upgradedToMulti,
    deactivated,
    sentToReview,
    updated,
  };
}
