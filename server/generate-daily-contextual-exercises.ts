import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";
import type { InsertDailySentence, InsertQuranicExpression, InsertDailySentenceExercise } from "@shared/schema";
import { validateExerciseBeforePublish } from "@shared/quranic-contextual-checker";
import { CONTENT_LOGIC_ROLE, TRIGGER_RESPONSE_RULES, VALIDATION_CHECKLIST } from "./content-logic";

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
2. EXTRACT its key Arabic keywords and their exact meanings
3. WRITE an English scenario sentence that PARAPHRASES those keywords (Semantic Hinting)
   ❌ BAD: "Something bad happened. What do you say?" (too vague — could match any verse)
   ✅ GOOD: "You feel grateful for unexpected blessings and want to praise Allah for them" (paraphrases "الحمد")
4. Pick two DISTRACTOR Quranic expressions from DIFFERENT themes that clearly DON'T fit

SEMANTIC HINTING RULE:
The englishText MUST contain a paraphrase or definition of the verse's key vocabulary.
The user should be able to recall the verse just from reading the scenario.

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

IMPORTANT: 
- Return ONLY valid JSON, no markdown formatting
- All Quranic verses MUST be authentic — selected BEFORE writing the scenario
- The scenario text MUST paraphrase the verse's keywords (Semantic Hinting)
- NO abstract connections — the link must be obvious without Tafsir
- Focus on practical, conversational usage — only phrases native speakers actually quote`;

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
          // التحقق السياقي قبل الإدراج (المركزية القرآنية)
          const contextualCheck = validateExerciseBeforePublish(
            exercise.sentence.englishText || '',
            exercise.correctExpression.arabicText || ''
          );
          
          if (!contextualCheck.isValid) {
            console.log(`   ⚠️ خطأ في المرجعية: ${contextualCheck.errorMessage}`);
            console.log(`   💡 التصحيح المقترح: ${contextualCheck.suggestedCorrection}`);
            continue; // تخطي هذا التمرين
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
