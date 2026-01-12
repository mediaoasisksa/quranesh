import { db } from "../server/db";
import { roleplayScenarios } from "../shared/schema";
import { eq, isNull, isNotNull } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const LANGUAGES = [
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "so", name: "Somali", nativeName: "Soomaali" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
];

async function translateText(text: string, targetLang: string, langName: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Translate this Arabic language learning explanation to ${langName} (${targetLang}). 
Keep it concise and natural. This explains why a Quranic verse is suitable for a particular situation.
Do NOT add any extra commentary or explanations. Just translate:

"${text}"

Respond with ONLY the translated text, nothing else.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();
  return response;
}

async function translateAllExplanations() {
  console.log("🌍 Starting verse explanation translations...\n");

  const scenarios = await db
    .select()
    .from(roleplayScenarios)
    .where(isNotNull(roleplayScenarios.verseExplanationEn));

  console.log(`Found ${scenarios.length} scenarios with English explanations\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const scenario of scenarios) {
    const englishExplanation = scenario.verseExplanationEn;
    if (!englishExplanation) continue;

    console.log(`\n📝 Processing scenario ID: ${scenario.id}`);
    console.log(`   Theme: ${scenario.theme}`);
    console.log(`   English: ${englishExplanation.substring(0, 50)}...`);

    const existingTranslations = (scenario.verseExplanationTranslations as Record<string, string>) || {};
    const newTranslations: Record<string, string> = { ...existingTranslations };
    let hasNewTranslations = false;

    for (const lang of LANGUAGES) {
      if (newTranslations[lang.code]) {
        console.log(`   ✓ ${lang.name} already exists`);
        continue;
      }

      try {
        console.log(`   → Translating to ${lang.name}...`);
        const translated = await translateText(englishExplanation, lang.code, lang.name);
        newTranslations[lang.code] = translated;
        hasNewTranslations = true;
        console.log(`   ✓ ${lang.name}: ${translated.substring(0, 40)}...`);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   ✗ Error translating to ${lang.name}:`, error);
        errorCount++;
      }
    }

    if (hasNewTranslations) {
      try {
        await db
          .update(roleplayScenarios)
          .set({ verseExplanationTranslations: newTranslations })
          .where(eq(roleplayScenarios.id, scenario.id));
        successCount++;
        console.log(`   ✅ Saved translations for scenario ${scenario.id}`);
      } catch (error) {
        console.error(`   ✗ Error saving translations:`, error);
        errorCount++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Translation complete!`);
  console.log(`   Scenarios processed: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
}

translateAllExplanations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
