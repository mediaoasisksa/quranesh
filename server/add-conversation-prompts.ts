import { db } from "./db";
import { conversationPrompts } from "@shared/schema";
import { CONTENT_LOGIC_ROLE, TRIGGER_RESPONSE_RULES, VALIDATION_CHECKLIST } from "./content-logic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface ConversationPrompt {
  question: string;
  question_en: string;
  suggested_verse: string;
  category?: string;
  usage_domain?: string;
}

async function generateConversationPrompts(count: number): Promise<ConversationPrompt[]> {
  const prompt = `${CONTENT_LOGIC_ROLE}

${TRIGGER_RESPONSE_RULES}

TASK: Generate ${count} conversation practice exercises for Arabic learners who memorize the Quran.

WORKFLOW:
1. Pick a short, authentic Quranic phrase (2-8 words) that native Arabic speakers actually quote in daily life
2. Identify the KEYWORDS in the verse (e.g., "المحسنين" = doers of good)
3. Write a modern life situation where SYNONYMS of those keywords naturally appear
4. Write the same scenario in Arabic
5. Verify: Would a native Arabic speaker naturally say this verse in this situation? If NO → discard.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Arabic situation/scenario text",
    "question_en": "English situation/scenario — must contain keyword synonyms that map to the verse",
    "suggested_verse": "Short Quranic phrase in Arabic with diacritics",
    "category": "category name",
    "usage_domain": "domain (e.g., encouragement, gratitude, patience, trust, greeting, farewell)"
  }
]

${VALIDATION_CHECKLIST}

- Generate exactly ${count} unique exercises
- Vary the categories and domains
- Return ONLY the JSON array, no other text`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text.trim();
    
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const prompts = JSON.parse(cleanedText);
    
    if (!Array.isArray(prompts)) {
      throw new Error('Response is not an array');
    }
    
    return prompts;
  } catch (error) {
    console.error(`Failed to generate prompts:`, error);
    throw error;
  }
}

async function addConversationPrompts() {
  console.log("🔄 Generating and adding 100 new conversation prompts...\n");

  const BATCH_SIZE = 10; // Generate in smaller batches to avoid rate limits
  const TOTAL_COUNT = 100;
  const batches = Math.ceil(TOTAL_COUNT / BATCH_SIZE);

  try {
    let totalSuccess = 0;
    let totalErrors = 0;

    for (let batch = 0; batch < batches; batch++) {
      const batchCount = Math.min(BATCH_SIZE, TOTAL_COUNT - (batch * BATCH_SIZE));
      
      console.log(`\n📦 Batch ${batch + 1}/${batches}: Generating ${batchCount} prompts...`);

      try {
        const prompts = await generateConversationPrompts(batchCount);
        
        console.log(`✓ Generated ${prompts.length} prompts\n`);

        // Insert into database
        for (let i = 0; i < prompts.length; i++) {
          const prompt = prompts[i];
          
          try {
            await db.insert(conversationPrompts).values({
              question: prompt.question,
              questionEn: prompt.question_en,
              suggestedVerse: prompt.suggested_verse,
              category: prompt.category || null,
              usageDomain: prompt.usage_domain || null,
              isPracticalDailyUse: 1,
            });

            console.log(`[${i + 1}/${prompts.length}] ✓ Added: ${prompt.question_en.substring(0, 50)}...`);
            totalSuccess++;
          } catch (error: any) {
            console.error(`[${i + 1}/${prompts.length}] ✗ Error inserting prompt: ${error.message}`);
            totalErrors++;
          }
        }

        // Add delay between batches to avoid rate limiting (15 RPM = 4 seconds per request)
        if (batch < batches - 1) {
          console.log('\n⏳ Waiting 30 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }

      } catch (error: any) {
        console.error(`\n✗ Error in batch ${batch + 1}:`, error.message);
        totalErrors += batchCount;
        
        // If we hit rate limit, stop processing
        if (error.message?.includes('429') || error.message?.includes('quota')) {
          console.error('\n⚠️  Rate limit reached. Stopping processing.');
          break;
        }
      }
    }

    console.log(`\n✅ Process complete!`);
    console.log(`   Successfully added: ${totalSuccess} prompts`);
    console.log(`   Errors: ${totalErrors}`);

    // Show final count
    const totalPrompts = await db.select().from(conversationPrompts);
    console.log(`   Total conversation prompts in database: ${totalPrompts.length}`);

  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

addConversationPrompts()
  .then(() => {
    console.log("\n🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
