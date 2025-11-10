import { db } from "./db";
import { realLifeExamples } from "@shared/schema";
import { eq } from "drizzle-orm";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

const languages = {
  id: "Indonesian",
  tr: "Turkish",
  zh: "Chinese (Simplified)",
  sw: "Swahili",
  so: "Somali",
  bs: "Bosnian",
  sq: "Albanian",
  ru: "Russian"
};

interface TranslationRecord {
  situation?: Record<string, string>;
  usageNote?: Record<string, string>;
}

async function translateText(text: string, targetLanguage: string): Promise<string> {
  const prompt = `Translate the following text to ${targetLanguage}. 
  
Context: This is a description of a real-life situation where someone uses a Quranic verse or phrase in everyday conversation. Maintain the respectful tone and cultural appropriateness.

Text to translate:
${text}

Return ONLY the translation without any additional explanation or formatting.`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
        topP: 0.8,
        topK: 40,
      },
    });

    const translation = response.data.candidates[0].content.parts[0].text.trim();
    
    // Validate translation is different from source
    if (translation === text || translation.length < 3) {
      throw new Error("Translation appears invalid or too short");
    }
    
    return translation;
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error);
    throw error;
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateExample(
  exampleId: string,
  situationEn: string,
  usageNoteEn: string,
  languageCode: string,
  languageName: string
): Promise<{ situation: string; usageNote: string }> {
  console.log(`  Translating to ${languageName}...`);
  
  try {
    // Translate situation
    const situationTranslated = await translateText(situationEn, languageName);
    await delay(2000); // 2 second delay between API calls
    
    // Translate usage note
    const usageNoteTranslated = await translateText(usageNoteEn, languageName);
    await delay(2000); // 2 second delay
    
    console.log(`    ✓ ${languageName} situation: ${situationTranslated.substring(0, 50)}...`);
    console.log(`    ✓ ${languageName} usage note: ${usageNoteTranslated.substring(0, 50)}...`);
    
    return {
      situation: situationTranslated,
      usageNote: usageNoteTranslated
    };
  } catch (error) {
    console.error(`    ✗ Failed to translate to ${languageName}`);
    throw error;
  }
}

async function main() {
  console.log("Fetching all real-life examples...\n");
  
  // Fetch all examples
  const examples = await db.select().from(realLifeExamples);
  
  console.log(`Found ${examples.length} examples to translate\n`);
  
  for (const example of examples) {
    console.log(`\nProcessing: ${example.situationEn.substring(0, 60)}...`);
    console.log(`ID: ${example.id}`);
    
    // Initialize translations object
    const translations: TranslationRecord = {
      situation: {},
      usageNote: {}
    };
    
    // Translate to all languages with retry logic
    for (const [langCode, langName] of Object.entries(languages)) {
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const translated = await translateExample(
            example.id,
            example.situationEn,
            example.usageNoteEn || "",
            langCode,
            langName
          );
          
          if (!translations.situation) translations.situation = {};
          if (!translations.usageNote) translations.usageNote = {};
          
          translations.situation[langCode] = translated.situation;
          translations.usageNote[langCode] = translated.usageNote;
          
          break; // Success, move to next language
        } catch (error: any) {
          retryCount++;
          if (error?.response?.status === 429 && retryCount < maxRetries) {
            const waitTime = Math.pow(2, retryCount) * 5000; // Exponential backoff: 10s, 20s, 40s
            console.log(`    Rate limit hit, waiting ${waitTime/1000}s before retry ${retryCount}/${maxRetries}...`);
            await delay(waitTime);
          } else {
            console.error(`Failed to translate example ${example.id} to ${langName} after ${retryCount} attempts`);
            break; // Move to next language after max retries
          }
        }
      }
      
      // Extra delay between languages to avoid rate limits
      await delay(3000);
    }
    
    // Update the database with translations
    const successfulLangs = Object.keys(translations.situation || {}).length;
    console.log(`\n  Translated to ${successfulLangs}/8 languages`);
    
    if (successfulLangs > 0) {
      try {
        await db
          .update(realLifeExamples)
          .set({ translations })
          .where(eq(realLifeExamples.id, example.id));
        
        console.log(`  ✓ Updated database with ${successfulLangs} language translations`);
        console.log(`  Languages: ${Object.keys(translations.situation || {}).join(', ')}`);
      } catch (error) {
        console.error(`  ✗ Failed to update database for example ${example.id}:`, error);
      }
    } else {
      console.log(`  ⚠ No translations saved for this example`);
    }
    
    console.log("  Waiting 5 seconds before next example...\n");
    await delay(5000);
  }
  
  console.log("\n✓ Translation complete!");
  process.exit(0);
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
