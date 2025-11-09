import axios from "axios";
import { storage } from "./storage";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required");
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

async function generateRealLifeExample(exampleNumber: number): Promise<any> {
  const prompt = `Generate a humorous/clever real-life example of someone using a Quran verse in everyday conversation.

Example format:
- Situation (Arabic): أم يطلب منها أبناؤها أن تطبخ لهم
- Situation (English): A mother whose children ask her to cook for them
- Verse (Arabic): فَابْعَثُوا أَحَدَكُم بِوَرِقِكُمْ هَٰذِهِ إِلَى الْمَدِينَةِ
- Verse Translation: So send one of you with this money to the city
- Surah Reference: الكهف:19
- Humor Note (Arabic): الأم تستخدم الآية للإشارة إلى أن الأطفال يستطيعون شراء الطعام بأنفسهم
- Humor Note (English): The mother uses the verse to suggest that the children can buy food themselves
- Category: family

Requirements:
1. Must be contextually appropriate and funny
2. Verse should fit the situation naturally
3. Common everyday situations (family, work, friends, daily life)
4. Verse should be short (2-10 words)
5. Return ONLY a valid JSON object with these keys:
   situationAr, situationEn, verseArabic, verseTranslation, surahReference, humorNoteAr, humorNoteEn, category

Generate example #${exampleNumber}:`;

  const response = await axios.post(GEMINI_API_URL, {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  });
  
  const text = response.data.candidates[0].content.parts[0].text;
  
  // Clean JSON from markdown code blocks
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }
  
  const data = JSON.parse(jsonMatch[0]);
  
  // Validate required fields
  if (!data.situationAr || !data.situationEn || !data.verseArabic || !data.surahReference) {
    throw new Error("Missing required fields");
  }
  
  return data;
}

async function main() {
  console.log("🌍 Starting generation of real-life Quran examples...\n");
  
  const examples = await storage.getAllRealLifeExamples();
  console.log(`📊 Currently have ${examples.length} examples in database\n`);
  
  const targetTotal = 10; // Generate 10 examples first for testing
  const toGenerate = targetTotal - examples.length;
  
  if (toGenerate <= 0) {
    console.log("✓ Already have enough examples!");
    process.exit(0);
  }
  
  console.log(`🎯 Will generate ${toGenerate} new examples\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < toGenerate; i++) {
    const exampleNum = examples.length + i + 1;
    console.log(`[${exampleNum}/${targetTotal}] Generating example...`);
    
    try {
      const data = await generateRealLifeExample(exampleNum);
      
      // Save to database
      await storage.createRealLifeExample({
        situationAr: data.situationAr,
        situationEn: data.situationEn,
        verseArabic: data.verseArabic,
        verseTranslation: data.verseTranslation,
        surahReference: data.surahReference,
        humorNoteAr: data.humorNoteAr,
        humorNoteEn: data.humorNoteEn,
        category: data.category || "daily_life",
        popularity: 0,
        translations: null,
      });
      
      successCount++;
      console.log(`  ✓ Situation: ${data.situationEn}`);
      console.log(`  ✓ Verse: ${data.verseArabic} (${data.surahReference})\n`);
      
      // Delay to avoid rate limits (5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error: any) {
      failCount++;
      console.log(`  ✗ Failed: ${error.message}\n`);
      
      // Retry with exponential backoff for rate limits
      if (error.message?.includes("429") || error.message?.includes("rate")) {
        const waitTime = 30000;
        console.log(`  ⏸️  Rate limit, waiting ${waitTime/1000}s...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        i--; // Retry this example
        failCount--; // Don't count as fail yet
      }
    }
  }
  
  console.log("\n📊 Generation Complete:");
  console.log(`  ✓ Success: ${successCount}`);
  console.log(`  ✗ Failed: ${failCount}`);
  console.log(`  📈 Total examples: ${examples.length + successCount}`);
}

main().catch(console.error);
