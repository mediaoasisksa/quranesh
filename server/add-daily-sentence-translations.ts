import { db } from "./db";
import { dailySentences } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const languages = {
  id: "Indonesian",
  tr: "Turkish",
  zh: "Chinese",
  sw: "Swahili",
  so: "Somali",
  bs: "Bosnian",
  sq: "Albanian",
  ru: "Russian"
};

interface TranslationResult {
  id: string;
  tr: string;
  zh: string;
  sw: string;
  so: string;
  bs: string;
  sq: string;
  ru: string;
}

async function translateSentence(englishText: string, retries = 3): Promise<TranslationResult | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Translate this daily expression into 8 languages.
Return ONLY a valid JSON object with these exact keys: id, tr, zh, sw, so, bs, sq, ru

English text: "${englishText}"

Languages:
- id: Indonesian (Bahasa Indonesia)
- tr: Turkish
- zh: Chinese (Simplified)
- sw: Swahili
- so: Somali
- bs: Bosnian
- sq: Albanian
- ru: Russian

IMPORTANT:
1. Keep translations natural and conversational
2. Return ONLY the JSON object, no markdown, no explanations
3. All values must be strings
4. Use proper grammar for each language

Example format:
{"id":"Setiap tantangan membentuk karakterku","tr":"Her zorluk karakterimi şekillendirir","zh":"每个挑战塑造我的性格","sw":"Kila changamoto inaumba tabia yangu","so":"Caqabad kasta ayaa sameeya dabeecaddayda","bs":"Svaki izazov oblikuje moj karakter","sq":"Çdo sfidë formon karakterin tim","ru":"Каждый вызов формирует мой характер"}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean the response (remove markdown code blocks if any)
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const translations = JSON.parse(cleanedText);

      // Validate all required keys
      const requiredKeys = ['id', 'tr', 'zh', 'sw', 'so', 'bs', 'sq', 'ru'];
      for (const key of requiredKeys) {
        if (!translations[key] || typeof translations[key] !== 'string') {
          throw new Error(`Missing or invalid translation for language: ${key}`);
        }
      }

      return translations;
    } catch (error: any) {
      const isLastAttempt = attempt === retries;
      console.error(`❌ Translation error (attempt ${attempt}/${retries}): ${error.message}`);
      
      if (isLastAttempt) {
        return null;
      }
      
      // Exponential backoff: wait 2^attempt seconds before retrying
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  return null;
}

async function addTranslationsToDailySentences() {
  console.log("🌍 Adding translations to daily sentences...\n");

  try {
    // Fetch all daily sentences
    const sentences = await db.select({
      id: dailySentences.id,
      englishText: dailySentences.englishText,
      arabicText: dailySentences.arabicText,
      translations: dailySentences.translations,
    }).from(dailySentences);

    console.log(`📊 Total sentences: ${sentences.length}`);
    
    // Filter sentences that need translations
    const sentencesNeedingTranslations = sentences.filter(s => !s.translations);
    console.log(`🔄 Sentences needing translations: ${sentencesNeedingTranslations.length}\n`);

    if (sentencesNeedingTranslations.length === 0) {
      console.log("✅ All sentences already have translations!");
      return;
    }

    let successCount = 0;
    let failCount = 0;
    const batchSize = 5;
    const delayBetweenBatches = 10000; // 10 seconds

    for (let i = 0; i < sentencesNeedingTranslations.length; i++) {
      const sentence = sentencesNeedingTranslations[i];
      
      console.log(`\n[${i + 1}/${sentencesNeedingTranslations.length}] Processing: "${sentence.englishText?.substring(0, 50)}..."`);

      const newTranslations = await translateSentence(sentence.englishText!);

      if (newTranslations) {
        try {
          // Merge with existing translations (if any) and add English
          const existingTranslations = (sentence.translations as Record<string, string>) || {};
          const mergedTranslations = {
            ...existingTranslations,
            en: sentence.englishText!, // Always include English
            ...newTranslations, // Add the 8 new language translations
          };

          await db.update(dailySentences)
            .set({ translations: mergedTranslations as any })
            .where(eq(dailySentences.id, sentence.id));

          successCount++;
          console.log(`✅ Success! Added translations for all 8 languages + English`);
          console.log(`   Indonesian: ${newTranslations.id?.substring(0, 40)}...`);
        } catch (dbError: any) {
          failCount++;
          console.error(`❌ Database update failed: ${dbError.message}`);
        }
      } else {
        failCount++;
        console.log(`⏭️  Skipped due to translation error after all retries`);
      }

      // Batch delay
      if ((i + 1) % batchSize === 0 && i + 1 < sentencesNeedingTranslations.length) {
        console.log(`\n⏸️  Batch complete. Waiting ${delayBetweenBatches / 1000}s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    console.log(`\n\n📊 Final Summary:`);
    console.log(`   ✅ Successfully translated: ${successCount} sentences`);
    console.log(`   ❌ Failed: ${failCount} sentences`);
    console.log(`   📝 Total processed: ${sentencesNeedingTranslations.length} sentences`);
    console.log(`   🌍 Languages added: English + ${Object.values(languages).join(', ')}`);

    // Exit with error code if any failures
    if (failCount > 0) {
      console.log(`\n⚠️  Warning: ${failCount} sentences still lack translations. Please rerun the script.`);
      process.exit(1);
    }

  } catch (error: any) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

addTranslationsToDailySentences()
  .then(() => {
    console.log("\n🎉 Translation process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Process failed:", error);
    process.exit(1);
  });
