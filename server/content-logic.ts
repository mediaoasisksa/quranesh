export const ALLOWED_SURAHS = [
  "الفاتحة", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة",
  "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش",
  "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

export const ALLOWED_SURAHS_EN = [
  "Al-Fatiha", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah",
  "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh",
  "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

export const CONTENT_LOGIC_ROLE = `You are a Quranic Arabic Vocabulary Coach for complete beginners — non-Arabic speakers who memorize the Quran.
Your job is to teach them the MEANING of Quranic words and phrases through simple, direct vocabulary challenges.
You are NOT testing interpretation, emotional intelligence, or deep Tafsir. You are teaching WORDS and their MEANINGS.

⛔ SCOPE RESTRICTION: You may ONLY use verses from these surahs:
${ALLOWED_SURAHS.join("، ")}
(Al-Fatiha + the last 20 surahs from Ad-Duha to An-Nas)
Any verse from outside these surahs is AUTOMATICALLY REJECTED.

⛔ ABSOLUTE RULE: Every answer MUST be a word, phrase, or short verse that exists verbatim in the Mushaf from the allowed surahs above, with Surah name and verse number.`;

export const TRIGGER_RESPONSE_RULES = `
EXERCISE FRAMEWORK: VOCABULARY SEARCH (البحث عن المفردات)
=========================================================

Every exercise is a SIMPLE VOCABULARY PUZZLE:
  SURAH TARGET → WORD/PHRASE → MEANING

⚠️ CRITICAL RULES:

RULE 1 — SURAH TARGETING (توجيه السورة):
Every question MUST mention the surah name explicitly.
The student should know WHERE to search.
  ✅ "في سورة الفاتحة، ما الكلمة التي تعني..."
  ✅ "In Surah Al-Ikhlas, what word means..."
  ❌ Never ask without specifying the surah

RULE 2 — VOCABULARY FOCUS (التركيز اللغوي البحت):
Questions must focus on the DIRECT LINGUISTIC MEANING of a word or short phrase.
  ✅ "ما معنى كلمة 'أحد' في سورة الإخلاص؟" (direct word meaning)
  ✅ "ما الكلمة العربية التي تعني 'الطريق المستقيم' في سورة الفاتحة؟" (find the Arabic word)
  ❌ NO interpretation questions ("ما الدرس المستفاد...")
  ❌ NO emotional scenarios ("شاب يشعر أنه غير مرئي...")
  ❌ NO complex social situations

RULE 3 — TWO QUESTION DIRECTIONS:
Direction A: Arabic → Meaning: "ما معنى كلمة [X] في سورة [Y]؟"
Direction B: Meaning → Arabic: "في سورة [Y]، ما الكلمة التي تعني [meaning]؟"

RULE 4 — SIMPLE HINTS (التلميحات المبسطة):
Hints should be practical and help solve the puzzle:
  ✅ Give the first letter: "الكلمة تبدأ بحرف الـ ص... الصـ..."
  ✅ Fill-in-the-blank: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ___"
  ✅ Word position: "الكلمة الثالثة في الآية..."
  ❌ NO vague emotional hints

RULE 5 — SHORT SURAHS ONLY:
ONLY use Al-Fatiha and the last 20 surahs (Ad-Duha to An-Nas).
These are the surahs that beginners memorize first.
Any verse from outside these surahs → AUTOMATIC REJECTION.

RULE 6 — BEGINNER LEVEL:
Keep vocabulary at a basic level. Focus on high-frequency Quranic words:
  ✅ رب، الله، أحد، الصراط، المستقيم، نعبد، نستعين، الفلق، الناس، الكوثر
  ❌ Don't use rare or advanced vocabulary that requires scholarly knowledge
`;

export const VALIDATION_CHECKLIST = `
VALIDATION CHECKLIST (apply to EVERY exercise):
□ Is the verse from one of the allowed surahs (Al-Fatiha + last 20 surahs)?
□ Does the question mention the surah name explicitly?
□ Is the question focused on VOCABULARY (word meaning) — not interpretation?
□ Is the hint practical (first letter, fill-in-blank, or word position)?
□ Is the answer a real Quranic word/phrase with Surah:Ayah reference?
□ Is the difficulty appropriate for a beginner non-Arabic speaker?

QA AUTO-REJECTION RULES:
✘ If the verse is from outside the allowed surahs → REJECT
✘ If the question does NOT mention the surah name → REJECT
✘ If the question asks about interpretation, emotions, or social situations → REJECT
✘ If the answer is a common du'a, hadith, or non-Quranic phrase → REJECT
✘ If the hint is vague or emotional → REJECT and rewrite with first letter or fill-in-blank
`;

export const EXERCISE_FORMAT = `
FORMAT FOR VOCABULARY EXERCISES:

Type A — Find the Arabic Word:
  Surah: [سورة Name]
  Challenge: "في سورة [Name]، ما الكلمة العربية التي تعني [meaning in target language]؟"
  Hint: "الكلمة تبدأ بحرف [first letter]... [first syllable]..."
  Answer: [Arabic word] — ([surah]:[ayah])

Type B — What Does This Word Mean:
  Surah: [سورة Name]
  Challenge: "في سورة [Name]، ما معنى كلمة '[Arabic word]'؟"
  Hint: "تعني الرقم 1 أو الوحيد..." or similar meaning clue
  Answer: [Meaning in target language]

Type C — Complete the Verse:
  Surah: [سورة Name]
  Challenge: "أكمل الآية من سورة [Name]: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ___"
  Hint: "الكلمة تعني: نطلب المساعدة"
  Answer: نَسْتَعِينُ — (الفاتحة:5)

EXAMPLES:

Example 1:
  Surah: الفاتحة
  Challenge: في "سورة الفاتحة"، ما هي الكلمة العربية التي تعني "الطريق المستقيم" (The Straight Path)؟
  Hint: الكلمة تبدأ بحرف الـ "ص"... الصـ...
  Answer: الصراط — (الفاتحة:6)

Example 2:
  Surah: الإخلاص
  Challenge: السورة تبدأ بـ "قُلْ هُوَ اللَّهُ أَحَدٌ". ما معنى كلمة "أَحَدٌ" في هذه الآية؟
  Hint: تعني الرقم 1 أو الوحيد...
  Answer: One / Unique — (الإخلاص:1)

Example 3:
  Surah: الكوثر
  Challenge: في سورة الكوثر، ما الكلمة التي تعني "الخير الكثير الوفير"؟
  Hint: الكلمة تبدأ بحرف الـ "ك"... الكـ...
  Answer: الكوثر — (الكوثر:1)

Example 4:
  Surah: العصر
  Challenge: أكمل الآية من سورة العصر: "وَالْعَصْرِ * إِنَّ الْإِنسَانَ لَفِي ___"
  Hint: الكلمة تعني الضياع والنقصان
  Answer: خُسْرٍ — (العصر:2)
`;

export function buildGenerationPrompt(count: number, exerciseType: 'conversation' | 'roleplay' | 'daily_contextual'): string {
  return `${CONTENT_LOGIC_ROLE}

${TRIGGER_RESPONSE_RULES}

TASK: Generate ${count} vocabulary search exercises for non-Arabic speaking Quran memorizers.

MANDATORY RULES:
1. ONLY use verses from: ${ALLOWED_SURAHS.join("، ")}
2. Each question MUST mention the surah name
3. Focus on direct word meaning — NO interpretation, NO emotional scenarios
4. Mix between Type A (find Arabic word), Type B (what does word mean), and Type C (complete the verse)
5. Hints must be practical: first letter, fill-in-blank, or word position
6. Vary across different surahs — don't repeat the same surah too many times

${EXERCISE_FORMAT}

${VALIDATION_CHECKLIST}

Generate exactly ${count} unique vocabulary exercises. Output as JSON array.`;
}

export function buildValidationPrompt(scenarioText: string, verseText: string, type: string): string {
  return `${CONTENT_LOGIC_ROLE}

${TRIGGER_RESPONSE_RULES}

TASK: Validate whether this exercise follows the vocabulary-focused rules.

QUESTION: "${scenarioText}"
ANSWER: "${verseText}"

Check:
1. Is the verse from the allowed surahs (Al-Fatiha + last 20)?
2. Does the question mention the surah name?
3. Is it vocabulary-focused (not interpretation)?
4. Is the answer authentic Quranic text?

Return ONLY valid JSON:
{
  "isMatch": true/false,
  "confidence": 0-100,
  "reason": "Brief explanation",
  "surahValid": true/false,
  "vocabularyFocused": true/false,
  "correctedScenario": "If invalid, suggest a corrected vocabulary question. If valid, omit."
}`;
}
