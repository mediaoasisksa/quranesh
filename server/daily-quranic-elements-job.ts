import { db } from "./db";
import { dailyQuranicElements, usedQuranicPhrases, quranText } from "@shared/schema";
import { eq, sql, notInArray } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GRAMMAR_TYPES = [
  "جملة اسمية",
  "جملة فعلية", 
  "نداء",
  "شرط",
  "استفهام",
  "ظرف زمان",
  "ظرف مكان",
  "تركيب وصفي",
  "مضاف ومضاف إليه",
  "فعل وفاعل",
  "فعل وفاعل ومفعول"
];

interface QuranicElement {
  surah: string;
  ayah: number;
  phrase_ar: string;
  translit: string;
  literal_meaning: string;
  arabic_explanation: string;
  grammar_note: string;
  example_simple: string;
  grammar_type: string;
  word_count: number;
}

async function getUsedPhrases(): Promise<string[]> {
  const used = await db.select({ phraseAr: usedQuranicPhrases.phraseAr }).from(usedQuranicPhrases);
  return used.map(u => u.phraseAr);
}

async function getRandomAyahs(count: number): Promise<Array<{ surah: string; ayah: number; text: string }>> {
  const ayahs = await db.select({
    surahNameArabic: quranText.surahNameArabic,
    ayahNumber: quranText.ayahNumber,
    arabicText: quranText.arabicText,
  })
  .from(quranText)
  .orderBy(sql`RANDOM()`)
  .limit(count * 2);
  
  return ayahs.map(a => ({
    surah: a.surahNameArabic,
    ayah: a.ayahNumber,
    text: a.arabicText
  }));
}

async function generateElements(ayahs: Array<{ surah: string; ayah: number; text: string }>, usedPhrases: string[], targetCount: number): Promise<QuranicElement[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const usedPhrasesText = usedPhrases.length > 0 
    ? `العبارات التالية تم استخدامها سابقاً ويجب تجنبها:\n${usedPhrases.slice(-500).join('\n')}\n\n`
    : '';

  const ayahsText = ayahs.map((a, i) => `${i + 1}. سورة ${a.surah} آية ${a.ayah}: ${a.text}`).join('\n');

  const prompt = `أنت خبير في اللغة العربية والنحو. استخرج ${targetCount} عنصر لغوي من الآيات التالية.

${usedPhrasesText}

الآيات:
${ayahsText}

المطلوب لكل عنصر:
1. كلمة واحدة عالية التكرار أو عبارة قصيرة من 2-6 كلمات
2. التركيز على المعنى اللغوي فقط (بدون تفسير ديني أو وعظي)
3. تنويع التراكيب النحوية

أنواع التراكيب المطلوبة: ${GRAMMAR_TYPES.join('، ')}

أرجع JSON array فقط بهذا الشكل (بدون أي نص إضافي):
[
  {
    "surah": "اسم السورة",
    "ayah": رقم الآية,
    "phrase_ar": "الكلمة أو العبارة",
    "translit": "الكتابة اللاتينية",
    "literal_meaning": "المعنى الحرفي بالإنجليزية",
    "arabic_explanation": "شرح عربي مبسط للمعنى اللغوي فقط",
    "grammar_note": "ملاحظة نحوية قصيرة",
    "example_simple": "مثال عربي معاصر يستخدم نفس التركيب",
    "grammar_type": "نوع التركيب النحوي",
    "word_count": عدد الكلمات
  }
]

ملاحظات مهمة:
- تجنب العبارات المستخدمة سابقاً
- المعنى اللغوي فقط بدون أي بعد ديني
- أمثلة معاصرة من الحياة اليومية
- تنويع أنواع التراكيب النحوية`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON array found in response");
      return [];
    }
    
    const elements: QuranicElement[] = JSON.parse(jsonMatch[0]);
    
    const filtered = elements.filter(el => !usedPhrases.includes(el.phrase_ar));
    
    return filtered;
  } catch (error) {
    console.error("Error generating elements:", error);
    return [];
  }
}

export async function runDailyQuranicElementsJob(): Promise<{ success: boolean; count: number; message: string }> {
  console.log("🌙 Starting Daily Quranic Elements Job...");
  
  const today = new Date().toISOString().split('T')[0];
  
  const existingToday = await db.select({ id: dailyQuranicElements.id })
    .from(dailyQuranicElements)
    .where(eq(dailyQuranicElements.batchDate, today))
    .limit(1);
  
  if (existingToday.length > 0) {
    console.log(`✓ Elements already generated for ${today}`);
    return { success: true, count: 0, message: `Elements already exist for ${today}` };
  }
  
  const usedPhrases = await getUsedPhrases();
  console.log(`📊 Found ${usedPhrases.length} previously used phrases`);
  
  const allElements: QuranicElement[] = [];
  const TARGET_COUNT = 100;
  let attempts = 0;
  const MAX_ATTEMPTS = 10;
  
  while (allElements.length < TARGET_COUNT && attempts < MAX_ATTEMPTS) {
    attempts++;
    const needed = TARGET_COUNT - allElements.length;
    console.log(`🔄 Attempt ${attempts}: Need ${needed} more elements...`);
    
    const ayahs = await getRandomAyahs(Math.min(needed * 2, 50));
    const newElements = await generateElements(
      ayahs, 
      [...usedPhrases, ...allElements.map(e => e.phrase_ar)],
      Math.min(needed + 10, 30)
    );
    
    for (const el of newElements) {
      if (allElements.length >= TARGET_COUNT) break;
      if (!allElements.some(e => e.phrase_ar === el.phrase_ar)) {
        allElements.push(el);
      }
    }
    
    console.log(`✓ Total elements so far: ${allElements.length}`);
    
    if (newElements.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`💾 Saving ${allElements.length} elements to database...`);
  
  let savedCount = 0;
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    try {
      await db.insert(dailyQuranicElements).values({
        surah: el.surah,
        ayah: el.ayah,
        phraseAr: el.phrase_ar,
        translit: el.translit,
        literalMeaning: el.literal_meaning,
        arabicExplanation: el.arabic_explanation,
        grammarNote: el.grammar_note,
        exampleSimple: el.example_simple,
        grammarType: el.grammar_type,
        wordCount: el.word_count,
        batchDate: today,
        batchNumber: i + 1,
        isUsed: 0,
      });
      
      await db.insert(usedQuranicPhrases).values({
        phraseAr: el.phrase_ar,
        surah: el.surah,
        ayah: el.ayah,
        usedOn: today,
      }).onConflictDoNothing();
      
      savedCount++;
    } catch (error) {
      console.error(`Error saving element ${i + 1}:`, error);
    }
  }
  
  console.log(`✅ Daily Quranic Elements Job completed: ${savedCount} elements saved for ${today}`);
  
  return { 
    success: true, 
    count: savedCount, 
    message: `Generated ${savedCount} Quranic elements for ${today}` 
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDailyQuranicElementsJob()
    .then(result => {
      console.log("Job result:", result);
      process.exit(0);
    })
    .catch(error => {
      console.error("Job failed:", error);
      process.exit(1);
    });
}
