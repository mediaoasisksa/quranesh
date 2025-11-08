/**
 * Seed practical Quranic expressions for daily conversation
 * These are SHORT (2-6 words) expressions suitable for everyday use
 */

import { db } from "./db";
import { conversationPrompts, phrases } from "@shared/schema";

const practicalConversationPrompts = [
  {
    question: "Someone is about to start a journey or a new task",
    suggestedVerse: "على بركة الله",
    category: "encouragement",
    isPracticalDailyUse: 1,
    usageDomain: "blessing",
  },
  {
    question: "Thanking someone for their help",
    suggestedVerse: "جزاك الله خيراً",
    category: "gratitude",
    isPracticalDailyUse: 1,
    usageDomain: "gratitude",
  },
  {
    question: "Wishing someone well or blessing them",
    suggestedVerse: "بارك الله فيك",
    category: "blessing",
    isPracticalDailyUse: 1,
    usageDomain: "blessing",
  },
  {
    question: "Making plans for the future",
    suggestedVerse: "إن شاء الله",
    category: "future",
    isPracticalDailyUse: 1,
    usageDomain: "time",
  },
  {
    question: "Asking Allah for protection",
    suggestedVerse: "اللهم احفظنا",
    category: "protection",
    isPracticalDailyUse: 1,
    usageDomain: "request",
  },
  {
    question: "Greeting someone in the morning",
    suggestedVerse: "صباح الخير",
    category: "greeting",
    isPracticalDailyUse: 1,
    usageDomain: "greeting",
  },
  {
    question: "Asking for forgiveness",
    suggestedVerse: "استغفر الله",
    category: "repentance",
    isPracticalDailyUse: 1,
    usageDomain: "apology",
  },
  {
    question: "Expressing hope for someone's recovery",
    suggestedVerse: "شفاك الله",
    category: "wellness",
    isPracticalDailyUse: 1,
    usageDomain: "wellness",
  },
  {
    question: "Responding to good news",
    suggestedVerse: "الحمد لله",
    category: "gratitude",
    isPracticalDailyUse: 1,
    usageDomain: "gratitude",
  },
  {
    question: "Congratulating someone on an achievement",
    suggestedVerse: "بارك الله لك",
    category: "congratulation",
    isPracticalDailyUse: 1,
    usageDomain: "blessing",
  },
];

const practicalPhrases = [
  {
    arabicText: "إن شاء الله",
    englishTranslation: "If Allah wills",
    surahAyah: "Al-Kahf:24",
    lifeApplication: "Used when making future plans or promises",
    category: "short",
    difficulty: 1,
    isPracticalDailyUse: 1,
    usageDomain: "time",
    register: "conversational",
  },
  {
    arabicText: "جزاك الله خيراً",
    englishTranslation: "May Allah reward you with goodness",
    surahAyah: "Common Islamic expression",
    lifeApplication: "Expressing gratitude and thanks",
    category: "short",
    difficulty: 1,
    isPracticalDailyUse: 1,
    usageDomain: "gratitude",
    register: "conversational",
  },
  {
    arabicText: "بارك الله فيك",
    englishTranslation: "May Allah bless you",
    surahAyah: "Common Islamic expression",
    lifeApplication: "Blessing someone or expressing appreciation",
    category: "short",
    difficulty: 1,
    isPracticalDailyUse: 1,
    usageDomain: "blessing",
    register: "conversational",
  },
  {
    arabicText: "الحمد لله",
    englishTranslation: "Praise be to Allah",
    surahAyah: "Al-Fatiha:2",
    lifeApplication: "Expressing gratitude or responding to good news",
    category: "short",
    difficulty: 1,
    isPracticalDailyUse: 1,
    usageDomain: "gratitude",
    register: "conversational",
  },
  {
    arabicText: "ما شاء الله",
    englishTranslation: "What Allah has willed",
    surahAyah: "Al-Kahf:39",
    lifeApplication: "Expressing admiration or protecting from evil eye",
    category: "short",
    difficulty: 1,
    isPracticalDailyUse: 1,
    usageDomain: "praise",
    register: "conversational",
  },
];

export async function seedPracticalExpressions() {
  console.log("🌱 Seeding practical Quranic expressions...");

  try {
    // Seed conversation prompts
    for (const prompt of practicalConversationPrompts) {
      await db.insert(conversationPrompts).values(prompt);
      console.log(`✅ Added conversation prompt: ${prompt.question}`);
    }

    // Seed phrases
    for (const phrase of practicalPhrases) {
      await db.insert(phrases).values(phrase);
      console.log(`✅ Added practical phrase: ${phrase.arabicText}`);
    }

    console.log("✅ Practical expressions seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding practical expressions:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPracticalExpressions()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed:", error);
      process.exit(1);
    });
}
