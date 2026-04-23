/**
 * seed-tabari-keywords.ts
 * Seeds accepted_keywords and rejected_keywords for Al-Fatiha (surah 1) exercises,
 * based on Tafsir al-Tabari commentary. Run via the admin route or startup.
 */

import { db } from "./db";
import { tabariExercises } from "@shared/schema";
import { eq, and, isNull, or } from "drizzle-orm";

interface KeywordSeed {
  correctWord: string;
  acceptedKeywords: string;
  rejectedKeywords: string;
  approvedMeaning: string;
}

// Keyword seeds for major words found in Al-Fatiha, based on Tafsir al-Tabari
const AL_FATIHA_KEYWORDS: KeywordSeed[] = [
  {
    correctWord: "الرَّحْمَٰنِ",
    acceptedKeywords: "mercy, compassion, divine mercy, rahman, all-merciful, vast mercy",
    rejectedKeywords: "punishment, wrath, anger, vengeance",
    approvedMeaning: "The All-Merciful — one of Allah's names indicating vast, encompassing mercy extended to all creation",
  },
  {
    correctWord: "الرَّحِيمِ",
    acceptedKeywords: "merciful, compassion, mercy, believers, rahim, special mercy",
    rejectedKeywords: "punishment, severity, wrath",
    approvedMeaning: "The Most Merciful — indicating special mercy bestowed particularly upon the believers",
  },
  {
    correctWord: "الْحَمْدُ",
    acceptedKeywords: "praise, gratitude, thanks, thankfulness, hamd, glorification",
    rejectedKeywords: "worship only, prayer only",
    approvedMeaning: "Praise and gratitude — affirming that all perfect praise and thankfulness belong exclusively to Allah",
  },
  {
    correctWord: "رَبِّ",
    acceptedKeywords: "lord, sustainer, owner, master, rabb, creator, nurturer",
    rejectedKeywords: "tyrant, oppressor, ruler only",
    approvedMeaning: "Lord and Sustainer — the one who created, owns, and nurtures all of creation",
  },
  {
    correctWord: "الْعَٰلَمِينَ",
    acceptedKeywords: "worlds, creation, all beings, universe, creatures, mankind, jinn",
    rejectedKeywords: "only humans, only visible world",
    approvedMeaning: "The worlds — encompassing all that Allah created including humans, jinn, angels, and all other beings",
  },
  {
    correctWord: "مَٰلِكِ",
    acceptedKeywords: "master, sovereign, king, owner, authority, judgment, malik",
    rejectedKeywords: "mercy, forgiveness (in isolation), no accountability",
    approvedMeaning: "Master and sovereign — the absolute owner and sovereign authority on the Day of Judgment",
  },
  {
    correctWord: "يَوْمِ",
    acceptedKeywords: "day, judgment, accountability, recompense, resurrection",
    rejectedKeywords: "worldly life, no afterlife",
    approvedMeaning: "The Day — referring to the Day of Judgment when all deeds will be accounted for",
  },
  {
    correctWord: "الدِّينِ",
    acceptedKeywords: "judgment, recompense, reckoning, accountability, din, reward, punishment",
    rejectedKeywords: "religion only, worship only, no accountability",
    approvedMeaning: "Recompense and judgment — the day when every soul receives the full recompense for its deeds",
  },
  {
    correctWord: "نَعْبُدُ",
    acceptedKeywords: "worship, serve, devote, ibadah, obedience, submit",
    rejectedKeywords: "praise only, remember only",
    approvedMeaning: "We worship — singling out Allah alone for all acts of devotion and servitude",
  },
  {
    correctWord: "نَسْتَعِينُ",
    acceptedKeywords: "seek help, rely, assistance, isti'ana, depend, trust",
    rejectedKeywords: "worship, praise, self-reliance",
    approvedMeaning: "We seek help — turning exclusively to Allah for aid, support, and enabling of all affairs",
  },
  {
    correctWord: "اهْدِنَا",
    acceptedKeywords: "guide, guidance, straight path, hidayah, direct, lead",
    rejectedKeywords: "forgive only, provide only",
    approvedMeaning: "Guide us — a supplication asking Allah to keep us steadfast on and directed toward the straight path",
  },
  {
    correctWord: "الصِّرَاطَ",
    acceptedKeywords: "path, way, road, sirat, straight, direction",
    rejectedKeywords: "knowledge only, belief only without action",
    approvedMeaning: "The path — the clear and straight road of righteous belief and action that leads to Allah's pleasure",
  },
  {
    correctWord: "الْمُسْتَقِيمَ",
    acceptedKeywords: "straight, upright, correct, right, direct, without deviation",
    rejectedKeywords: "crooked, deviant, wrong",
    approvedMeaning: "The straight — the path that is upright, free of deviation, leading directly to success in this life and the next",
  },
  {
    correctWord: "أَنْعَمْتَ",
    acceptedKeywords: "blessed, favor, grace, ni'mah, bestowed, given",
    rejectedKeywords: "punished, tested without blessing",
    approvedMeaning: "You have blessed — referring to those upon whom Allah has bestowed His grace, favor, and guidance",
  },
  {
    correctWord: "الْمَغْضُوبِ",
    acceptedKeywords: "wrath, anger, incurred wrath, maghdub, deviated from truth knowingly",
    rejectedKeywords: "blessed, guided, innocent",
    approvedMeaning: "Those who incurred wrath — those who knew the truth but deliberately rejected it",
  },
  {
    correctWord: "الضَّالِّينَ",
    acceptedKeywords: "astray, lost, misguided, dallin, ignorant, erred",
    rejectedKeywords: "guided, blessed, sinful knowingly",
    approvedMeaning: "Those who went astray — those who lost the correct path through ignorance or error without deliberate rejection",
  },
  {
    correctWord: "بِسْمِ",
    acceptedKeywords: "name, bismillah, in the name of, beginning, seeking blessing",
    rejectedKeywords: "praise, worship, end",
    approvedMeaning: "In the name of — beginning any action by invoking the name of Allah to seek His blessing and assistance",
  },
  {
    correctWord: "اللَّهِ",
    acceptedKeywords: "Allah, God, the divine, the one, deity, creator",
    rejectedKeywords: "partner, associate, multiple gods",
    approvedMeaning: "Allah — the proper name of the one true God, free of partners, the Creator and Sustainer of all",
  },
];

export async function seedTabariKeywords(): Promise<{ updated: number; skipped: number }> {
  let updated = 0;
  let skipped = 0;

  for (const seed of AL_FATIHA_KEYWORDS) {
    try {
      // Find matching exercises for surah 1 with this correctWord
      const matches = await db
        .select({
          id: tabariExercises.id,
          acceptedKeywords: tabariExercises.acceptedKeywords,
          rejectedKeywords: tabariExercises.rejectedKeywords,
          approvedMeaning: tabariExercises.approvedMeaning,
        })
        .from(tabariExercises)
        .where(
          and(
            eq(tabariExercises.surahNumber, 1),
            eq(tabariExercises.correctWord, seed.correctWord),
          )
        );

      for (const exercise of matches) {
        // Build an update object that only fills NULL/empty fields — never overwrites manual enrichment
        const patch: Record<string, string> = {};
        if (!exercise.acceptedKeywords) patch.acceptedKeywords = seed.acceptedKeywords;
        if (!exercise.rejectedKeywords) patch.rejectedKeywords = seed.rejectedKeywords;
        if (!exercise.approvedMeaning) patch.approvedMeaning = seed.approvedMeaning;

        if (Object.keys(patch).length === 0) {
          skipped++;
          continue;
        }

        await db
          .update(tabariExercises)
          .set(patch)
          .where(eq(tabariExercises.id, exercise.id));
        updated++;
      }
    } catch (err: any) {
      console.error(`[seed-tabari-keywords] Error for word "${seed.correctWord}":`, err?.message);
    }
  }

  console.log(`[seed-tabari-keywords] Done: updated=${updated} skipped=${skipped}`);
  return { updated, skipped };
}
