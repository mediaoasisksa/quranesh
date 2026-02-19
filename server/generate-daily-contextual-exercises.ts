import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";
import type { InsertDailySentence, InsertQuranicExpression, InsertDailySentenceExercise } from "@shared/schema";
import { validateExerciseBeforePublish } from "@shared/quranic-contextual-checker";
import { CONTENT_LOGIC_ROLE, TRIGGER_RESPONSE_RULES, VALIDATION_CHECKLIST } from "./content-logic";
import { validateQuranicAnswer, isNonQuranicPhrase } from "./quran-validator";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const THEMES = [
  "patience", "gratitude", "trust", "hope", "guidance", "wisdom", "mercy",
  "strength", "peace", "humility", "forgiveness", "reflection", "determination",
  "contentment", "perseverance", "compassion", "sincerity", "justice", "generosity"
];

const TOTAL_EXERCISES = 50;
const BATCH_SIZE = 5; // Generate 5 exercises at a time to avoid rate limits
const DELAY_BETWEEN_BATCHES = 10000; // 10 seconds delay between batches

interface GeneratedExercise {
  sentence: InsertDailySentence;
  correctExpression: InsertQuranicExpression;
  distractors: InsertQuranicExpression[];
  explanation: Record<string, string>;
  learningNote: Record<string, string>;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateExerciseBatch(batchNumber: number, count: number): Promise<GeneratedExercise[]> {
  const theme = THEMES[batchNumber % THEMES.length];
  
  const prompt = `${CONTENT_LOGIC_ROLE}

${TRIGGER_RESPONSE_RULES}

Theme: ${theme}

TASK: Generate ${count} daily contextual exercises using the REVERSE-ENGINEERED Trigger-Response framework.

⚠️ MANDATORY WORKFLOW FOR EACH EXERCISE — VERSE FIRST:
1. SELECT a short Quranic expression FIRST (2-6 words) that native speakers actually quote in daily life
2. EXTRACT its LOCK WORDS (كلمات القفل): ≥2 key Arabic keywords + their meanings + core concept
3. CHECK: If any Lock Word is a synonym/metaphor for a common word (e.g., رواسي ↔ جبال), note the SEMANTIC TRAIT (not the common word)
4. WRITE an English scenario sentence that PARAPHRASES ≥2 Lock Words (Semantic Hinting)
   ❌ BAD: "Something bad happened. What do you say?" (too vague — 0 lock words)
   ❌ BAD: "A verse about mountains" when the verse says "رواسي" (synonym violation — must use "anchored/firmly-set")
   ✅ GOOD: "You feel grateful for unexpected blessings and want to praise Allah for them" (lock words: حمد=praise, لله=to Allah)
5. Pick two DISTRACTOR Quranic expressions from DIFFERENT themes that clearly DON'T fit
6. QA CHECK: If the scenario uses a common word where the verse uses a different word → REWRITE using semantic trait or exact Quranic word
7. MEANING CHECK: NEVER ask about surah names/numbers or "which surah starts with X?" — teach the LINGUISTIC MEANING of the Quranic word, then ask the student to recall it

LOCK WORDS RULE (كلمات القفل):
The englishText MUST contain paraphrases of ≥2 Lock Words from the verse.
If the question has only 1 lock word, it's too vague and could match multiple verses — REJECTED.

SYNONYM/METAPHOR RULE:
If the verse uses a literary/Quranic word (رواسي, بروج, فلك, etc.) instead of a common word (جبال, أبراج, سفينة),
the scenario must use the SEMANTIC TRAIT or exact Quranic word — NOT the common synonym.
Example: رواسي → use "anchored/firmly-set mountains" or "رواسي" — NOT just "mountains".

${VALIDATION_CHECKLIST}

Return valid JSON array with this structure:
[
  {
    "sentence": {
      "englishText": "You feel grateful for all the blessings in your life and want to express praise and thankfulness to Allah",
      "theme": "gratitude",
      "difficulty": 2,
      "contextNotes": "Semantic hint: 'praise and thankfulness' maps to 'الحمد'"
    },
    "correctExpression": {
      "arabicText": "الحمد لله",
      "surahAyah": "الفاتحة:2",
      "theme": "gratitude",
      "meaning": "Praise be to Allah",
      "usageContext": "Used to express gratitude and thankfulness",
      "wordCount": 2
    },
    "distractors": [
      {
        "arabicText": "إنا لله وإنا إليه راجعون",
        "surahAyah": "البقرة:156",
        "theme": "patience",
        "meaning": "We belong to Allah and to Him we shall return",
        "usageContext": "Used in times of hardship or loss",
        "wordCount": 5
      },
      {
        "arabicText": "حسبنا الله ونعم الوكيل",
        "surahAyah": "آل عمران:173",
        "theme": "trust",
        "meaning": "Allah is sufficient for us and He is the best Disposer of affairs",
        "usageContext": "Expressing trust and reliance on Allah",
        "wordCount": 4
      }
    ],
    "explanation": {
      "en": "This expression is commonly used to express gratitude and praise to Allah",
      "ar": "يستخدم هذا التعبير للتعبير عن الحمد والشكر لله"
    },
    "learningNote": {
      "en": "One of the most frequently used Quranic expressions in daily Arabic conversation",
      "ar": "من أكثر التعبيرات القرآنية استخداماً في المحادثات اليومية"
    }
  }
]

CRITICAL MANDATORY RULES:
- Return ONLY valid JSON, no markdown formatting
- All Quranic verses MUST be authentic — selected BEFORE writing the scenario
- The scenario text MUST contain ≥2 LOCK WORDS from the verse as paraphrases
- If the verse uses a synonym/metaphor for a common word, use the SEMANTIC TRAIT or exact Quranic word in the scenario
- NO abstract connections — the link must be obvious without Tafsir
- Focus on practical, conversational usage — only phrases native speakers actually quote

⛔ ABSOLUTE PROHIBITIONS — WILL BE AUTO-REJECTED:
1. EVERY answer (correctExpression) MUST be 100% literal Quranic text — a word, phrase, or partial verse that exists verbatim in the Mushaf.
2. NEVER use common Islamic du'as, hadiths, proverbs, or everyday phrases as answers. Examples of BANNED answers:
   - "إن شاء الله" (common phrase, NOT a standalone Quranic verse)
   - "بارك الله لك" / "بارك الله فيك" (du'a, NOT Quranic)
   - "على بركة الله" (common phrase, NOT Quranic)
   - "جزاك الله خيراً" (du'a, NOT Quranic)
   - "سبحان الله" alone (dhikr, needs Quranic context)
   - "مسلمة" alone (random word, NOT a meaningful Quranic phrase)
   - "الله أكبر" alone (takbir, NOT a Quranic verse)
3. EVERY answer MUST include surahAyah with format "سورة_name:verse_number" (e.g., "الكهف:24", "يونس:58")
4. ALL distractors MUST also be authentic Quranic text with surahAyah references
5. Questions must be LINGUISTIC only — one of these types:
   - Word meaning: "ما الكلمة القرآنية التي تعني (…)?"
   - Phrase meaning: "ما العبارة القرآنية التي تعني (…)?"
   - Grammar/structure: "اختر العبارة التي فيها (نفي/استثناء/توكيد/شرط/أمر…)"
   - Vocabulary from text: "ما الآية/الجزء الذي ورد فيه لفظ (…)?"
6. NO interpretation (tafsir), no contemplation (tadabbur), no reasons of revelation, no rulings, no sermons
7. If you cannot find a literal Quranic match for a scenario, CHANGE THE SCENARIO to match an existing Quranic phrase — never invent an answer

CORRECT EXAMPLES:
- "Making plans for the future" → Answer: "إِلَّا أَن يَشَاءَ اللَّهُ" (الكهف:24) — NOT "إن شاء الله"
- "Congratulating someone" → Answer: "فَلْيَفْرَحُوا" (يونس:58) — NOT "بارك الله لك"
- "Starting a journey" → Answer: "سِيرُوا فِي الْأَرْضِ" (العنكبوت:20) — NOT "على بركة الله"
- "Describing good things" → Answer: "طَيِّبَاتٍ" (البقرة:172) — NOT "مسلمة"`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Remove markdown code blocks if present
    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const exercises = JSON.parse(cleanedResponse);
    
    if (!Array.isArray(exercises)) {
      throw new Error("Response is not an array");
    }
    
    return exercises;
  } catch (error) {
    console.error(`Error generating batch ${batchNumber}:`, error);
    return [];
  }
}

async function main() {
  console.log(`🚀 Starting generation of ${TOTAL_EXERCISES} daily contextual exercises\n`);
  
  const batches = Math.ceil(TOTAL_EXERCISES / BATCH_SIZE);
  let totalGenerated = 0;
  let successfulBatches = 0;
  
  for (let i = 0; i < batches; i++) {
    const remaining = TOTAL_EXERCISES - totalGenerated;
    const currentBatchSize = Math.min(BATCH_SIZE, remaining);
    
    console.log(`📦 Batch ${i + 1}/${batches}: Generating ${currentBatchSize} exercises...`);
    
    try {
      const exercises = await generateExerciseBatch(i, currentBatchSize);
      
      if (exercises.length === 0) {
        console.log(`⚠️  Batch ${i + 1} failed, skipping...\n`);
        await delay(DELAY_BETWEEN_BATCHES);
        continue;
      }
      
      // Insert each exercise into database
      for (const exercise of exercises) {
        try {
          const quranicCheck = validateQuranicAnswer(
            exercise.correctExpression.arabicText || '',
            exercise.correctExpression.surahAyah || ''
          );
          if (!quranicCheck.isValid) {
            console.log(`   ⛔ REJECTED (not Quranic): ${exercise.correctExpression.arabicText} — ${quranicCheck.reason}`);
            continue;
          }

          const hasInvalidDistractor = exercise.distractors?.some((d: any) => {
            const dCheck = validateQuranicAnswer(d.arabicText || '', d.surahAyah || '');
            if (!dCheck.isValid) {
              console.log(`   ⛔ REJECTED distractor: ${d.arabicText} — ${dCheck.reason}`);
            }
            return !dCheck.isValid;
          });
          if (hasInvalidDistractor) {
            console.log(`   ⛔ Skipping exercise — invalid distractor`);
            continue;
          }

          const contextualCheck = validateExerciseBeforePublish(
            exercise.sentence.englishText || '',
            exercise.correctExpression.arabicText || ''
          );
          
          if (!contextualCheck.isValid) {
            console.log(`   ⚠️ خطأ في المرجعية: ${contextualCheck.errorMessage}`);
            continue;
          }
          
          // Insert sentence
          const [insertedSentence] = await db
            .insert(dailySentences)
            .values(exercise.sentence)
            .returning();
          
          // Insert correct expression
          const [insertedCorrectExpression] = await db
            .insert(quranicExpressions)
            .values(exercise.correctExpression)
            .returning();
          
          // Insert distractors
          const insertedDistractors = await Promise.all(
            exercise.distractors.map(async (distractor) => {
              const [inserted] = await db
                .insert(quranicExpressions)
                .values(distractor)
                .returning();
              return inserted;
            })
          );
          
          // Create exercise linking them
          await db.insert(dailySentenceExercises).values({
            dailySentenceId: insertedSentence.id,
            correctExpressionId: insertedCorrectExpression.id,
            distractorIds: insertedDistractors.map(d => d.id),
            explanation: exercise.explanation,
            learningNote: exercise.learningNote,
          });
          
          totalGenerated++;
          console.log(`   ✓ Exercise ${totalGenerated}/${TOTAL_EXERCISES} created`);
        } catch (error) {
          console.error(`   ✗ Failed to insert exercise:`, error);
        }
      }
      
      successfulBatches++;
      console.log(`✅ Batch ${i + 1} completed (${exercises.length} exercises)\n`);
      
      // Delay before next batch to avoid rate limits
      if (i < batches - 1) {
        console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...\n`);
        await delay(DELAY_BETWEEN_BATCHES);
      }
    } catch (error) {
      console.error(`❌ Error in batch ${i + 1}:`, error);
      await delay(DELAY_BETWEEN_BATCHES);
    }
  }
  
  console.log(`\n🎉 Generation complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Total exercises generated: ${totalGenerated}/${TOTAL_EXERCISES}`);
  console.log(`   - Successful batches: ${successfulBatches}/${batches}`);
  console.log(`   - Success rate: ${Math.round((totalGenerated / TOTAL_EXERCISES) * 100)}%`);
  
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
