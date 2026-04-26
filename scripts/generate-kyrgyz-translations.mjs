/**
 * generate-kyrgyz-translations.mjs
 * Uses Gemini AI to translate all English UI keys into Kyrgyz (ky)
 * and writes the result block to a temp file.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Extract English keys from translations.ts
const content = fs.readFileSync("client/src/lib/translations.ts", "utf8");
const enMatch = content.match(/en:\s*\{([\s\S]*?)\n  \},\n  ar:/);
if (!enMatch) throw new Error("Could not find English block");
const enBlock = enMatch[1];

// Parse key:value pairs
const pairs = [];
const lineRe = /^\s+(\w+):\s*"((?:[^"\\]|\\.)*)"/gm;
let m;
while ((m = lineRe.exec(enBlock)) !== null) {
  pairs.push({ key: m[1], value: m[2] });
}
console.log(`Found ${pairs.length} English keys`);

// Translate in batches of 60
const BATCH = 60;
const allTranslations = {};

async function translateBatch(batch, attempt = 0) {
  const input = batch.map(p => `${p.key}: "${p.value}"`).join("\n");
  const prompt = `Translate the following UI text strings from English to Kyrgyz (Кыргызча, Cyrillic script).
Rules:
- Keep the key names exactly as they are (left side of colon)
- Translate only the values (right side, in quotes)
- Keep {count}, {total}, {n} placeholders exactly as-is
- Keep Islamic terms: Quran → Куран, Hafiz → Хафиз, Quranic → Куран, Tafsir → Тафсир, Surah → Сүрө, Ayah → Аят, Juz → Жуз
- Keep technical abbreviations: AI → AI, LLM → LLM
- Output format: one line per key, exactly: key: "translation"
- No extra text, no markdown, no explanations

${input}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const lines = text.split("\n").filter(l => l.includes(': "'));
    for (const line of lines) {
      const match = line.match(/^\s*(\w+):\s*"(.*)"\s*$/);
      if (match) {
        allTranslations[match[1]] = match[2];
      }
    }
    return true;
  } catch (e) {
    const msg = e?.message ?? "";
    if (msg.includes("429") || msg.includes("quota")) {
      const retryMatch = msg.match(/retry in (\d+)s/i);
      const waitMs = retryMatch ? parseInt(retryMatch[1]) * 1000 + 2000 : 60000;
      if (attempt < 4) {
        console.log(`  Rate limit. Waiting ${Math.round(waitMs/1000)}s...`);
        await sleep(waitMs);
        return translateBatch(batch, attempt + 1);
      }
    }
    console.error("Batch error:", msg.substring(0, 200));
    // Fallback: use English values
    for (const p of batch) allTranslations[p.key] = p.value;
    return false;
  }
}

for (let i = 0; i < pairs.length; i += BATCH) {
  const batch = pairs.slice(i, i + BATCH);
  console.log(`Translating batch ${Math.floor(i/BATCH)+1}/${Math.ceil(pairs.length/BATCH)} (keys ${i+1}–${Math.min(i+BATCH, pairs.length)})...`);
  await translateBatch(batch);
  await sleep(2000);
}

console.log(`\nTranslated ${Object.keys(allTranslations).length}/${pairs.length} keys`);

// Build the ky block preserving original key order and comments
let kyBlock = "  ky: {\n";
// Re-read enBlock to preserve comments and key order
const commentAndKeyRe = /^(\s*\/\/[^\n]*\n|\s+(\w+):\s*"(?:[^"\\]|\\.)*",?\n)/gm;
for (const line of enBlock.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) {
    kyBlock += `    ${trimmed}\n`;
  } else {
    const kv = line.match(/^\s+(\w+):\s*"((?:[^"\\]|\\.)*)"/);
    if (kv) {
      const key = kv[1];
      const translation = allTranslations[key] ?? kv[2];
      // escape any unescaped quotes in translation
      const safe = translation.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      kyBlock += `    ${key}: "${safe}",\n`;
    }
  }
}
kyBlock += "  },\n";

// Write to temp file
fs.writeFileSync("scripts/kyrgyz-block.txt", kyBlock);
console.log("\n✓ Kyrgyz block written to scripts/kyrgyz-block.txt");
console.log("Lines:", kyBlock.split("\n").length);
