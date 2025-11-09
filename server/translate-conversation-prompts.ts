import { db } from "./db.js";
import { conversationPrompts } from "@shared/schema.js";
import { sql } from "drizzle-orm";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const LANGUAGES = {
  en: "English",
  id: "Bahasa Indonesia",
  tr: "Turkish (Türkçe)",
  zh: "Chinese (中文)",
  sw: "Swahili (Kiswahili)",
  so: "Somali (Soomaali)",
  bs: "Bosnian (Bosanski)",
  sq: "Albanian (Shqip)",
  ru: "Russian (Русский)",
};

async function translateQuestion(arabicQuestion: string, targetLang: string): Promise<string> {
  const prompt = `Translate this Arabic conversational question to ${LANGUAGES[targetLang as keyof typeof LANGUAGES]}:

Arabic: ${arabicQuestion}

Rules:
1. Keep the conversational tone
2. Make it natural for daily conversation
3. Only return the translation, no explanations
4. Keep the same meaning and context

Translation:`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  return response.data.candidates[0].content.parts[0].text.trim();
}

async function translateAllQuestions() {
  console.log("🌍 Starting translation of conversation prompts...\n");

  const allPrompts = await db.select().from(conversationPrompts);
  console.log(`📊 Found ${allPrompts.length} prompts to translate\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allPrompts.length; i++) {
    const prompt = allPrompts[i];
    
    const hasAllTranslations = 
      prompt.questionEn && prompt.questionId && prompt.questionTr && 
      prompt.questionZh && prompt.questionSw && prompt.questionSo && 
      prompt.questionBs && prompt.questionSq && prompt.questionRu;
    
    if (hasAllTranslations) {
      console.log(`\n[${i + 1}/${allPrompts.length}] ✅ Already translated: ${prompt.question}`);
      successCount++;
      continue;
    }
    
    console.log(`\n[${i + 1}/${allPrompts.length}] Processing: ${prompt.question}`);

    try {
      const translations: Record<string, string> = {};

      for (const [langCode, langName] of Object.entries(LANGUAGES)) {
        const existingField = `question${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof typeof prompt;
        if (prompt[existingField]) {
          console.log(`  ↳ ${langName}: Already exists ✓`);
          translations[`question_${langCode}`] = prompt[existingField] as string;
          continue;
        }
        let retries = 0;
        const maxRetries = 3;
        
        while (retries <= maxRetries) {
          try {
            console.log(`  ↳ Translating to ${langName}...`);
            const translation = await translateQuestion(prompt.question, langCode);
            translations[`question_${langCode}`] = translation;
            console.log(`    ✓ ${langName}: ${translation}`);
            
            await new Promise(resolve => setTimeout(resolve, 4000));
            break;
          } catch (error: any) {
            if (error.response && error.response.status === 429 && retries < maxRetries) {
              retries++;
              const waitTime = 15000 * retries;
              console.log(`    ⏸️  Rate limit (attempt ${retries}/${maxRetries}), waiting ${waitTime/1000}s...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else if (retries < maxRetries) {
              retries++;
              console.log(`    ⚠️  Error (attempt ${retries}/${maxRetries}), retrying...`);
              await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
              console.error(`    ✗ Failed to translate to ${langName} after ${maxRetries} retries`);
              errorCount++;
              break;
            }
          }
        }
      }

      await db
        .update(conversationPrompts)
        .set({
          questionEn: translations.question_en,
          questionId: translations.question_id,
          questionTr: translations.question_tr,
          questionZh: translations.question_zh,
          questionSw: translations.question_sw,
          questionSo: translations.question_so,
          questionBs: translations.question_bs,
          questionSq: translations.question_sq,
          questionRu: translations.question_ru,
        })
        .where(sql`id = ${prompt.id}`);

      successCount++;
      console.log(`  ✅ Successfully updated prompt ${i + 1}`);
    } catch (error) {
      console.error(`  ❌ Error processing prompt ${i + 1}:`, error);
      errorCount++;
    }
  }

  console.log(`\n\n✨ Translation completed!`);
  console.log(`  ✅ Success: ${successCount} prompts`);
  console.log(`  ❌ Errors: ${errorCount} prompts`);
  
  process.exit(0);
}

translateAllQuestions().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
