import { db } from "./db";
import { roleplayScenarios } from "@shared/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const LANGUAGES = {
  id: "Indonesian (Bahasa Indonesia)",
  tr: "Turkish",
  zh: "Chinese (Simplified)",
  sw: "Swahili",
  so: "Somali",
  bs: "Bosnian",
  sq: "Albanian",
  ru: "Russian",
};

async function translateScenario(
  arabicScenario: string,
  englishScenario: string,
  targetLanguage: string,
  languageName: string,
  retries = 3
): Promise<string> {
  const prompt = `You are a professional translator specializing in Islamic content and psychology.

Translate this psychological roleplay scenario from Arabic/English into ${languageName}.

Arabic: ${arabicScenario}
English: ${englishScenario}

Requirements:
1. Maintain the emotional depth and psychological nuance
2. Use culturally appropriate language for ${languageName} speakers
3. Keep Islamic terms respectful (e.g., Allah, Quran, verses)
4. Preserve the scenario's intent and tone
5. Return ONLY the translation, no explanations

${languageName} translation:`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const translation = result.response.text().trim();
      
      if (translation.length < 10) {
        throw new Error(`Translation too short: ${translation}`);
      }
      
      return translation;
    } catch (error) {
      console.error(`Attempt ${attempt}/${retries} failed for ${languageName}:`, error);
      
      if (attempt === retries) {
        throw new Error(`Failed to translate after ${retries} attempts: ${error}`);
      }
      
      const backoffDelay = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${backoffDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw new Error("Translation failed after all retries");
}

async function addRoleplayScenarioTranslations() {
  console.log("🌍 Starting roleplay scenario translation process...\n");
  
  const allScenarios = await db.select().from(roleplayScenarios);
  console.log(`Found ${allScenarios.length} roleplay scenarios\n`);
  
  let translatedCount = 0;
  let errorCount = 0;
  
  for (const scenario of allScenarios) {
    console.log(`\n📝 Processing scenario: ${scenario.id} (${scenario.theme})`);
    console.log(`   Arabic: ${scenario.scenario.substring(0, 60)}...`);
    
    const updates: any = {};
    let hasNewTranslations = false;
    
    for (const [langCode, langName] of Object.entries(LANGUAGES)) {
      const fieldName = `scenario${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof typeof scenario;
      
      if (scenario[fieldName]) {
        console.log(`   ✓ ${langName}: Already translated`);
        continue;
      }
      
      try {
        console.log(`   🔄 Translating to ${langName}...`);
        const translation = await translateScenario(
          scenario.scenario,
          scenario.scenarioEn || scenario.scenario,
          langCode,
          langName
        );
        
        updates[fieldName] = translation;
        hasNewTranslations = true;
        console.log(`   ✅ ${langName}: Done`);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ ${langName}: Failed - ${error}`);
        errorCount++;
      }
    }
    
    if (hasNewTranslations) {
      await db
        .update(roleplayScenarios)
        .set(updates)
        .where(eq(roleplayScenarios.id, scenario.id));
      
      translatedCount++;
      console.log(`   💾 Saved translations for scenario ${scenario.id}`);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 TRANSLATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total scenarios: ${allScenarios.length}`);
  console.log(`Scenarios with new translations: ${translatedCount}`);
  console.log(`Translation errors: ${errorCount}`);
  console.log("=".repeat(60));
  
  if (errorCount > 0) {
    console.log("\n⚠️  Some translations failed. You may need to re-run this script.");
    process.exit(1);
  } else {
    console.log("\n✅ All translations completed successfully!");
    process.exit(0);
  }
}

addRoleplayScenarioTranslations().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
