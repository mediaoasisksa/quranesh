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

⚠️ MANDATORY VERSE-FIRST WORKFLOW:
1. SELECT a short, authentic Quranic phrase FIRST (2-8 words) that native Arabic speakers actually quote in daily life
2. EXTRACT the LOCK WORDS (كلمات القفل): ≥2 key Arabic keywords + their meanings + core concept
3. CHECK: If any Lock Word is a synonym/metaphor for a common word, note the SEMANTIC TRAIT (not the common word)
4. WRITE the question with ≥2 LOCK WORDS as paraphrases/definitions — making the answer unambiguous
5. Write the same scenario in Arabic with the same Lock Words
6. VERIFY: Can a student who memorized this verse recall it from the question alone? If NO → rewrite.
7. QA CHECK: Does the question use any common word where the verse uses a different word? If YES → rewrite.
8. MEANING CHECK: Does the question teach LINGUISTIC MEANING, not surah identification? NEVER ask "which surah starts with X?" or "ما السورة التي تبدأ بـ...؟" — instead ask "what Quranic word means X?"

LOCK WORDS + SEMANTIC HINTING EXAMPLES:
  ❌ BAD question_en: "What do you say when something bad happens?" (0 lock words — too vague)
  ✅ GOOD question_en: "What Quranic phrase expresses patience without complaint — 'beautiful patience'?" → فَصَبْرٌ جَمِيلٌ
    Lock words: صبر (patience) + جميل (beautiful/without complaint) = 2 lock words ✓
  
  ❌ BAD question_en: "What does the Quran say about doing good?" (1 lock word — too generic)
  ✅ GOOD question_en: "What does Allah say about His love for the doers of good (المحسنين)?" → وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ
    Lock words: يحب (love) + المحسنين (doers of good) = 2 lock words ✓

  ❌ BAD: "A verse about mountains" → verse says "رواسي" (SYNONYM VIOLATION — uses common word "جبال")
  ✅ GOOD: "A verse about firmly-set, anchored mountains that stabilize the earth"
    Lock words: رواسي (firmly-set/anchored) + ألقى (cast/placed) = uses semantic trait ✓

  ❌ BAD: "Wishing someone well or blessing them" (0 lock words, too vague)
  ✅ GOOD: "Which Quranic phrase combines 'mercy of God' and 'His blessings' in the form 'upon you'?"
    Lock words: رحمة (mercy) + بركات (blessings) + عليكم (upon you) = 3 lock words ✓

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Arabic situation/scenario text with semantic hints paraphrasing the verse keywords",
    "question_en": "English scenario with SEMANTIC HINTS — must DEFINE/PARAPHRASE the verse's keywords so user can recall it",
    "suggested_verse": "Short Quranic phrase in Arabic with diacritics (selected FIRST before writing the question)",
    "category": "category name",
    "usage_domain": "domain (e.g., encouragement, gratitude, patience, trust, greeting, farewell)"
  }
]

${VALIDATION_CHECKLIST}

- Generate exactly ${count} unique exercises
- Vary the categories and domains
- Every question MUST contain ≥2 LOCK WORDS from the verse as paraphrases/definitions
- If the verse uses a synonym/metaphor for a common word, use the SEMANTIC TRAIT or exact Quranic word
- NO abstract connections — the link must be obvious without deep Tafsir
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
