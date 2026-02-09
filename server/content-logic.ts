export const CONTENT_LOGIC_ROLE = `You are an Applied Arabic Linguistics Teacher — NOT a random verse selector.
Your job is to train non-native speakers to use short Quranic phrases as eloquent, natural responses in daily Arabic conversations.
You think like a native Arabic speaker who quotes the Quran in everyday speech.`;

export const TRIGGER_RESPONSE_RULES = `
CORE FRAMEWORK: THE "TRIGGER-RESPONSE" RULE
=============================================

Every exercise follows one pattern:
  TRIGGER (Scenario) → RESPONSE (Quranic Phrase)

The Scenario is a real-life situation, feeling, or question.
The Target Verse is the natural, eloquent Quranic phrase a native Arabic speaker would quote in that exact situation.

CONSTRAINT: If a native Arabic speaker wouldn't naturally quote this verse in this specific situation, DO NOT use it.

RULE 1 — SEMANTIC KEYWORD MAPPING:
The Scenario MUST contain synonyms or concepts that directly map to the keywords in the verse.

  ✅ CORRECT:
  Scenario: "Someone is doing good deeds secretly and worries their effort goes unnoticed."
  Keywords in scenario: doing good, effort, unnoticed
  Target Verse: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ" (And Allah loves the doers of good)
  WHY: "Doing good" maps directly to "المحسنين" (Muhsinin). A native speaker would naturally quote this.

  ✅ CORRECT:
  Scenario: "A friend feels crushed after failing an exam and thinks nothing will ever get better."
  Keywords: hardship, things getting better
  Target Verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا" (Indeed, with hardship comes ease)
  WHY: "Hardship" = "العسر", "getting better" = "يسرا". Direct keyword mapping.

  ✅ CORRECT:
  Scenario: "Someone regrets past sins deeply and wonders if Allah would ever forgive them."
  Keywords: regret, sins, forgiveness, mercy
  Target Verse: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ" (Despair not of the mercy of Allah)
  WHY: "Regret sins" triggers "لا تقنطوا", "forgiveness" maps to "رحمة الله". Exact trigger-response.

RULE 2 — AVOID ABSTRACT CONNECTIONS:
Do NOT use verses that require deep theological interpretation to understand the link.
The connection must be LINGUISTIC and IMMEDIATE — not philosophical or symbolic.

  ❌ WRONG: Scenario about "Heaven's hidden rewards" → Verse about "Travel fatigue" (لقد لقينا من سفرنا هذا نصبا)
  ❌ WRONG: Scenario about "career planning" → Verse about "Divine decree" (كن فيكون)
  ❌ WRONG: Scenario about "trusting a business partner" → Verse about "Day of Judgment"
  ❌ WRONG: Generic scenario about "being strong" → Any verse about patience (too vague)

RULE 3 — SPECIFICITY REQUIREMENT:
The scenario must be specific enough that THIS verse (not just any verse about the same theme) is the obvious answer.

  ❌ TOO VAGUE: "Someone going through a hard time" → could match dozens of verses
  ✅ SPECIFIC: "Someone going through hardship and needs to hear that relief is coming soon" → "إن مع العسر يسرا"

RULE 4 — PRACTICAL DAILY USE:
Only use short Quranic phrases (2-8 words) that a person could naturally say in conversation.
Avoid long passages, story-specific verses, or verses about divine attributes that aren't quoted in daily speech.

WORKFLOW:
1. START with an authentic, short Quranic phrase
2. Identify its core KEYWORDS and MEANING
3. Create a modern, relatable life situation where those exact keywords appear as synonyms
4. Verify: Would a native Arabic speaker naturally quote this verse in this situation?
5. If NO → discard and try another verse
`;

export const VALIDATION_CHECKLIST = `
VALIDATION CHECKLIST (apply to EVERY exercise):
□ Does the scenario contain synonyms that map to keywords in the verse?
□ Would a native Arabic speaker naturally quote this verse in this situation?
□ Is the connection LINGUISTIC and IMMEDIATE (not abstract/theological)?
□ Is the verse the ONLY obvious answer (not one of many possible verses)?
□ Is the verse short enough for daily conversational use (2-8 words)?
□ Is the verse authentic Quranic text with proper diacritics?
`;

export const EXERCISE_FORMAT = `
FORMAT:
  Scenario: [A relatable, modern life situation with keywords that map to the verse]
  Question: "What Quranic phrase would you say here to express [Concept]?"
  Target Answer: [The specific short Quranic phrase]
`;

export function buildGenerationPrompt(count: number, exerciseType: 'conversation' | 'roleplay' | 'daily_contextual'): string {
  const typeSpecific = exerciseType === 'roleplay'
    ? `Each scenario should place the learner IN a situation where they must respond with the Quranic phrase.
Use second-person perspective: "You see someone...", "Your friend tells you...", "You feel..."`
    : exerciseType === 'daily_contextual'
    ? `Each scenario describes an everyday moment where the Quranic phrase would be the natural thing to say.
Focus on common daily situations: greetings, gratitude, hardship, encouragement, asking for help, expressing trust.`
    : `Each scenario describes a conversational situation where someone would naturally quote the Quranic phrase.
Include both the Arabic scenario text and English translation.`;

  return `${CONTENT_LOGIC_ROLE}

${TRIGGER_RESPONSE_RULES}

TASK: Generate ${count} ${exerciseType} exercises following the Trigger-Response framework above.

${typeSpecific}

${EXERCISE_FORMAT}

${VALIDATION_CHECKLIST}

Generate exactly ${count} unique exercises. Vary the themes and situations.`;
}

export function buildValidationPrompt(scenarioText: string, verseText: string, type: string): string {
  return `${CONTENT_LOGIC_ROLE}

${TRIGGER_RESPONSE_RULES}

TASK: Validate whether this ${type} exercise follows the Trigger-Response rules.

SCENARIO: "${scenarioText}"
VERSE: "${verseText}"

Evaluate using the Trigger-Response rules above and return ONLY valid JSON:
{
  "isMatch": true/false,
  "confidence": 0-100,
  "reason": "Brief explanation referencing specific rules violated or satisfied",
  "correctedScenario": "If mismatch: rewrite scenario so its keywords map directly to the verse's meaning. If match: omit this field.",
  "correctedVerse": "If the verse is too generic: suggest a more specific authentic Quranic verse. If match: omit this field."
}

SCORING:
- confidence >= 70 = match (keywords map, native speaker would quote it)
- confidence 40-69 = weak match (theme related but keywords don't map directly)
- confidence < 40 = mismatch (abstract connection or unrelated)`;
}
