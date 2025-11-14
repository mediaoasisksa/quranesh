import { db } from "./db";
import { dailySentences } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function translateToArabic(englishText: string): Promise<string> {
  const prompt = `Translate this English sentence to natural, fluent Arabic. Provide ONLY the Arabic translation, nothing else:

"${englishText}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const arabicText = response.text().trim();
    
    return arabicText;
  } catch (error) {
    console.error(`Failed to translate: "${englishText}"`, error);
    throw error;
  }
}

async function addArabicToAllSentences() {
  console.log("🔄 Adding Arabic translations to all daily sentences...\n");

  try {
    // Get all sentences without Arabic text
    const sentences = await db.select().from(dailySentences);
    
    console.log(`Found ${sentences.length} sentences to process\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      
      // Skip if already has Arabic text
      if (sentence.arabicText) {
        console.log(`[${i + 1}/${sentences.length}] ✓ Already has Arabic: ${sentence.englishText.substring(0, 50)}...`);
        successCount++;
        continue;
      }

      try {
        const arabicText = await translateToArabic(sentence.englishText);
        
        // Update the sentence with Arabic text
        await db
          .update(dailySentences)
          .set({ arabicText })
          .where({ id: sentence.id } as any);

        console.log(`[${i + 1}/${sentences.length}] ✓ Translated: ${sentence.englishText.substring(0, 40)}...`);
        console.log(`   → ${arabicText}\n`);
        
        successCount++;

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[${i + 1}/${sentences.length}] ✗ Error translating: ${sentence.englishText}`, error);
        errorCount++;
      }
    }

    console.log(`\n✅ Translation complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${sentences.length}`);

  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

addArabicToAllSentences()
  .then(() => {
    console.log("\n🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
