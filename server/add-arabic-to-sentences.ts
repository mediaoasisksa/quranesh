import { db } from "./db";
import { dailySentences } from "@shared/schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${GEMINI_API_KEY}`;

async function translateToArabic(englishText: string): Promise<string> {
  const prompt = `Translate this English sentence to natural, fluent Arabic. Provide ONLY the Arabic translation, nothing else:

"${englishText}"`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const arabicText = data.candidates[0].content.parts[0].text.trim();
    
    return arabicText;
  } catch (error) {
    console.error(`Failed to translate: "${englishText}"`, error);
    throw error;
  }
}

async function addArabicToAllSentences() {
  console.log("🔄 Adding Arabic translations to all daily sentences...\n");

  // Allow processing a subset of sentences for testing
  const BATCH_SIZE = process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : undefined;

  try {
    // Get all sentences without Arabic text
    const sentences = await db.select().from(dailySentences);
    
    console.log(`Found ${sentences.length} sentences total\n`);
    
    // Filter sentences that don't have Arabic text yet
    const sentencesToTranslate = sentences.filter(s => !s.arabicText);
    console.log(`${sentencesToTranslate.length} sentences need translation\n`);
    
    // Limit to batch size if specified
    const toProcess = BATCH_SIZE ? sentencesToTranslate.slice(0, BATCH_SIZE) : sentencesToTranslate;
    console.log(`Processing ${toProcess.length} sentences${BATCH_SIZE ? ` (batch size: ${BATCH_SIZE})` : ''}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < toProcess.length; i++) {
      const sentence = toProcess[i];
      
      try {
        const arabicText = await translateToArabic(sentence.englishText);
        
        // Update the sentence with Arabic text
        await db
          .update(dailySentences)
          .set({ arabicText })
          .where({ id: sentence.id } as any);

        console.log(`[${i + 1}/${toProcess.length}] ✓ Translated: ${sentence.englishText.substring(0, 40)}...`);
        console.log(`   → ${arabicText}\n`);
        
        successCount++;

        // Add a delay to avoid rate limiting (3 seconds for safety)
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error: any) {
        console.error(`[${i + 1}/${toProcess.length}] ✗ Error translating: ${sentence.englishText}`);
        console.error(`   Error: ${error.message || error}\n`);
        errorCount++;
        
        // If we hit rate limit, stop processing
        if (error.message?.includes('429') || error.message?.includes('quota')) {
          console.error('\n⚠️  Rate limit reached. Stopping processing.');
          console.error('   To continue, run the script again later or with a smaller BATCH_SIZE');
          break;
        }
      }
    }

    console.log(`\n✅ Translation batch complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total processed: ${toProcess.length}`);
    console.log(`   Remaining: ${sentencesToTranslate.length - toProcess.length}`);

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
