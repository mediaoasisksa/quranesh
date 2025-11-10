import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";
import type { InsertDailySentence, InsertQuranicExpression, InsertDailySentenceExercise } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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
  
  const prompt = `Generate ${count} daily contextual exercises for learning Arabic through Quranic expressions.

Theme: ${theme}

For each exercise, create:
1. An English sentence describing a daily life situation
2. A short Quranic expression (2-6 words in Arabic) that matches the situation
3. Two distractor Quranic expressions that DON'T match (different themes)

Requirements:
- Sentences should be practical, everyday situations
- Quranic expressions must be REAL verses from the Quran (provide exact Surah:Ayah reference)
- All expressions should be 2-6 words only
- Include brief meaning/context for each expression
- Provide explanation in English and Arabic

Return valid JSON array with this structure:
[
  {
    "sentence": {
      "englishText": "I feel grateful for the blessings in my life",
      "theme": "gratitude",
      "difficulty": 2,
      "contextNotes": "Expressing thankfulness"
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
- All Quranic verses MUST be authentic
- Ensure variety in situations and expressions
- Focus on practical, conversational usage`;

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
