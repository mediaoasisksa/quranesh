import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const phrases = pgTable("phrases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arabicText: text("arabic_text").notNull(),
  englishTranslation: text("english_translation").notNull(),
  surahAyah: text("surah_ayah").notNull(),
  lifeApplication: text("life_application").notNull(),
  category: text("category").notNull(), // short, long, commands, proverbs
  difficulty: integer("difficulty").default(1), // 1-5 scale
  symbolicMeaning: text("symbolic_meaning"), // Behavioral/symbolic interpretation of the phrase
  isPracticalDailyUse: integer("is_practical_daily_use").default(0), // 1 = practical for daily conversation, 0 = narrative/story context
  usageDomain: text("usage_domain"), // e.g., "greeting", "time", "request", "gratitude", "apology", "narrative"
  register: text("register"), // "conversational", "formal", "literary", "poetic"
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  phraseId: text("phrase_id").notNull(),
  masteryLevel: integer("mastery_level").default(0), // 0-100
  correctAttempts: integer("correct_attempts").default(0),
  totalAttempts: integer("total_attempts").default(0),
  lastPracticed: timestamp("last_practiced"),
});

export const exerciseSessions = pgTable("exercise_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  exerciseType: text("exercise_type").notNull(),
  phraseId: text("phrase_id").notNull(),
  userAnswer: text("user_answer"),
  correctAnswer: text("correct_answer"),
  isCorrect: text("is_correct").notNull(), // 'true' or 'false'
  completedAt: timestamp("completed_at").default(sql`now()`),
});

export const dailyStats = pgTable("daily_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  phrasesUsed: integer("phrases_used").default(0),
  exercicesCompleted: integer("exercises_completed").default(0),
  accuracyRate: integer("accuracy_rate").default(0),
});

export const insertPhraseSchema = createInsertSchema(phrases).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertExerciseSessionSchema = createInsertSchema(exerciseSessions).omit({
  id: true,
});

export const insertDailyStatsSchema = createInsertSchema(dailyStats).omit({
  id: true,
});

export type Phrase = typeof phrases.$inferSelect;
export type InsertPhrase = z.infer<typeof insertPhraseSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type ExerciseSession = typeof exerciseSessions.$inferSelect;
export type InsertExerciseSession = z.infer<typeof insertExerciseSessionSchema>;
export type DailyStats = typeof dailyStats.$inferSelect;
export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  countryCode: text("country_code").default(""),
  phoneNumber: text("phone_number").default(""),
  passwordHash: text("password_hash").notNull(),
  memorizationLevel: text("memorization_level"), // beginner, intermediate, advanced, hafiz
  nativeLanguage: text("native_language"),
  learningGoal: text("learning_goal"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  planType: text("plan_type").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("SAR").notNull(),
  startDate: timestamp("start_date").default(sql`now()`).notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active").notNull(),
  transactionId: text("transaction_id"),
  sponsoredUsers: integer("sponsored_users").default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Separate schema for signup requests (accepts password, not passwordHash)
export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required").transform(email => email.toLowerCase().trim()),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  memorizationLevel: z.string().optional(),
  nativeLanguage: z.string().optional(),
  learningGoal: z.string().optional(),
});

// Schema for signin requests
export const signinSchema = z.object({
  email: z.string().email("Valid email is required").transform(email => email.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
});

// Question Banks for thematic exercises with multiple correct answers
export const questionBanks = pgTable("question_banks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theme: text("theme").notNull(), // Arabic theme like "المعية في الشدة"
  themeEnglish: text("theme_english").notNull(), // English translation
  description: text("description"), // Optional description
  tags: jsonb("tags").$type<string[]>().default([]), // semantic tags
  correctPhraseIds: jsonb("correct_phrase_ids").$type<string[]>().notNull(), // Multiple correct answers
  difficulty: integer("difficulty").default(1),
  category: text("category").notNull(), // thematic, grammar, vocabulary
});

export const insertQuestionBankSchema = createInsertSchema(questionBanks).omit({
  id: true,
});

export type QuestionBank = typeof questionBanks.$inferSelect;
export type InsertQuestionBank = z.infer<typeof insertQuestionBankSchema>;

// Philosophical sentences for transformation exercises
export const philosophicalSentences = pgTable("philosophical_sentences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arabicText: text("arabic_text").notNull(),
  difficulty: integer("difficulty").default(1), // 1-5 scale
  symbolicMeaning: text("symbolic_meaning"), // Expected Quranic verse reference
  conceptTags: jsonb("concept_tags").$type<string[]>().default([]), // Concept-based tags for flexible matching: e.g., ["justice", "objectivity", "emotional_control"]
  translations: jsonb("translations").$type<Record<string, string>>(), // {"en": "...", "id": "...", "tr": "...", "zh": "...", "sw": "...", "so": "...", "bs": "...", "sq": "..."}
  lastTranslatedAt: timestamp("last_translated_at"), // Track translation freshness
});

export const insertPhilosophicalSentenceSchema = createInsertSchema(philosophicalSentences).omit({
  id: true,
});

export type PhilosophicalSentence = typeof philosophicalSentences.$inferSelect;
export type InsertPhilosophicalSentence = z.infer<typeof insertPhilosophicalSentenceSchema>;

export const conversationPrompts = pgTable("conversation_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  questionEn: text("question_en"),
  questionId: text("question_id"),
  questionTr: text("question_tr"),
  questionZh: text("question_zh"),
  questionSw: text("question_sw"),
  questionSo: text("question_so"),
  questionBs: text("question_bs"),
  questionSq: text("question_sq"),
  questionRu: text("question_ru"),
  questionUr: text("question_ur"),
  suggestedVerse: text("suggested_verse").notNull(),
  category: text("category"),
  symbolicMeaning: text("symbolic_meaning"), // Behavioral/symbolic interpretation
  isPracticalDailyUse: integer("is_practical_daily_use").default(1), // 1 = practical conversation, 0 = story/narrative context
  usageDomain: text("usage_domain"), // e.g., "greeting", "time", "request", "offer", "invitation"
  // Evidence-style exercise fields
  claim: text("claim"), // المعنى المطلوب إثباته
  evidencePhrase: text("evidence_phrase"), // العبارة القرآنية المحددة كدليل
  ayahText: text("ayah_text"), // نص الآية كاملة
  sourceRef: text("source_ref"), // مرجع السورة:الآية
  answerMode: text("answer_mode").default("CONTAINS_PHRASE"), // EXACT_PHRASE أو CONTAINS_PHRASE
  acceptedVariants: text("accepted_variants").array(), // بدائل مقبولة للإجابة
  hint: text("hint"), // تلميح للمستخدم
});

export const insertConversationPromptSchema = createInsertSchema(conversationPrompts).omit({
  id: true,
});

export type ConversationPrompt = typeof conversationPrompts.$inferSelect;
export type InsertConversationPrompt = z.infer<typeof insertConversationPromptSchema>;

// Roleplay Scenarios - Psychological scenarios for roleplay exercises
export const roleplayScenarios = pgTable("roleplay_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scenario: text("scenario").notNull(), // Arabic scenario text
  scenarioEn: text("scenario_en"),
  scenarioId: text("scenario_id"),
  scenarioTr: text("scenario_tr"),
  scenarioZh: text("scenario_zh"),
  scenarioSw: text("scenario_sw"),
  scenarioSo: text("scenario_so"),
  scenarioBs: text("scenario_bs"),
  scenarioSq: text("scenario_sq"),
  scenarioRu: text("scenario_ru"),
  theme: text("theme").notNull(), // anxiety, depression, hope, faith, etc.
  emotionalState: text("emotional_state"), // الحالة الشعورية: hope, consolation, patience, agreement, facilitation, loss_compensation, etc.
  psychologicalDepth: text("psychological_depth"), // Description of the psychological aspect
  difficulty: integer("difficulty").default(1), // 1-5 scale
  suggestedVerse: text("suggested_verse"), // Suggested Quranic verse for the scenario
  verseSource: text("verse_source"), // مصدر الآية: لسان النبي يوسف، دعاء موسى، وصف لفعل بشري
  verseExplanation: text("verse_explanation"), // Arabic explanation
  verseExplanationEn: text("verse_explanation_en"), // English explanation
  verseExplanationTranslations: jsonb("verse_explanation_translations").$type<Record<string, string>>(), // Translations for all languages
});

export const insertRoleplayScenarioSchema = createInsertSchema(roleplayScenarios).omit({
  id: true,
});

export type RoleplayScenario = typeof roleplayScenarios.$inferSelect;
export type InsertRoleplayScenario = z.infer<typeof insertRoleplayScenarioSchema>;

// Human Situations - Mapping human situations to appropriate prophetic verses
export const humanSituations = pgTable("human_situations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  situationAr: text("situation_ar").notNull(), // Arabic situation description
  situationEn: text("situation_en").notNull(), // English situation description
  category: text("category").notNull(), // agreement, facilitation, consolation, work, planning, etc.
  suggestedVerse: text("suggested_verse").notNull(), // Quranic verse from prophets/humans
  verseSource: text("verse_source"), // e.g., "لسان النبي يوسف", "وصف لفعل بشري"
  contextualLogic: text("contextual_logic"), // Why this verse fits this situation
  contextualLogicEn: text("contextual_logic_en"),
  translations: jsonb("translations").$type<Record<string, string>>(), // Translations for all languages
  keywords: jsonb("keywords").$type<string[]>(), // Keywords for matching situations
  blockedPatterns: jsonb("blocked_patterns").$type<string[]>(), // Patterns to avoid for this situation
});

export const insertHumanSituationSchema = createInsertSchema(humanSituations).omit({
  id: true,
});

export type HumanSituation = typeof humanSituations.$inferSelect;
export type InsertHumanSituation = z.infer<typeof insertHumanSituationSchema>;

// Daily Sentences for contextual Quranic expression matching
export const dailySentences = pgTable("daily_sentences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arabicText: text("arabic_text"),
  englishText: text("english_text").notNull(),
  translations: jsonb("translations").$type<Record<string, string>>(), // {"id": "...", "ur": "...", "tr": "...", "zh": "...", "sw": "...", "so": "...", "bs": "...", "sq": "...", "ru": "..."}
  theme: text("theme").notNull(), // patience, gratitude, trust, hope, etc.
  difficulty: integer("difficulty").default(1), // 1-5 scale (A1-C1)
  contextNotes: text("context_notes"), // When/how to use this expression
});

export const insertDailySentenceSchema = createInsertSchema(dailySentences).omit({
  id: true,
});

export type DailySentence = typeof dailySentences.$inferSelect;
export type InsertDailySentence = z.infer<typeof insertDailySentenceSchema>;

// Quranic Expressions - Short phrases extracted from verses (2-6 words)
export const quranicExpressions = pgTable("quranic_expressions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arabicText: text("arabic_text").notNull(), // 2-6 words from Quran
  surahAyah: text("surah_ayah").notNull(), // e.g. "المزمل:10" or "Al-Muzzammil:10"
  theme: text("theme").notNull(), // patience, trust, gratitude, etc.
  meaning: text("meaning"), // Brief semantic explanation
  usageContext: text("usage_context"), // When to use this expression
  wordCount: integer("word_count").notNull(), // 2-6
  explanations: jsonb("explanations").$type<Record<string, string>>(), // Explanation in different languages
});

export const insertQuranicExpressionSchema = createInsertSchema(quranicExpressions).omit({
  id: true,
});

export type QuranicExpression = typeof quranicExpressions.$inferSelect;
export type InsertQuranicExpression = z.infer<typeof insertQuranicExpressionSchema>;

// Daily Sentence Exercises - Generated exercises matching sentences to expressions
export const dailySentenceExercises = pgTable("daily_sentence_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dailySentenceId: text("daily_sentence_id").notNull(),
  correctExpressionId: text("correct_expression_id").notNull(),
  distractorIds: jsonb("distractor_ids").$type<string[]>().notNull(), // 3 distractors
  explanation: jsonb("explanation").$type<Record<string, string>>(), // Explanation in multiple languages
  learningNote: jsonb("learning_note").$type<Record<string, string>>(), // Detailed linguistic notes
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertDailySentenceExerciseSchema = createInsertSchema(dailySentenceExercises).omit({
  id: true,
  createdAt: true,
}).extend({
  distractorIds: z.array(z.string()).length(3, "Must have exactly 3 distractors")
});

export type DailySentenceExercise = typeof dailySentenceExercises.$inferSelect;
export type InsertDailySentenceExercise = z.infer<typeof insertDailySentenceExerciseSchema>;

// Quran Text - Complete Quran text for local recitation verification
export const quranText = pgTable("quran_text", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  arabicText: text("arabic_text").notNull(), // Full Arabic text with diacritics
  simpleText: text("simple_text").notNull(), // Simplified text for matching (no diacritics)
  transliteration: text("transliteration"), // Latin script representation
  surahNameArabic: text("surah_name_arabic").notNull(),
  surahNameEnglish: text("surah_name_english").notNull(),
  juzNumber: integer("juz_number"),
  words: jsonb("words").$type<string[]>(), // Array of individual words for word-by-word matching
});

export const insertQuranTextSchema = createInsertSchema(quranText).omit({
  id: true,
});

export type QuranText = typeof quranText.$inferSelect;
export type InsertQuranText = z.infer<typeof insertQuranTextSchema>;

// Recitation Sessions - Track user recitation practice
export const recitationSessions = pgTable("recitation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  surahNumber: integer("surah_number").notNull(),
  fromAyah: integer("from_ayah").notNull(),
  toAyah: integer("to_ayah").notNull(),
  accuracy: integer("accuracy").default(0), // 0-100
  wordsRecited: integer("words_recited").default(0),
  correctWords: integer("correct_words").default(0),
  duration: integer("duration"), // in seconds
  completedAt: timestamp("completed_at").default(sql`now()`),
});

export const insertRecitationSessionSchema = createInsertSchema(recitationSessions).omit({
  id: true,
  completedAt: true,
});

export type RecitationSession = typeof recitationSessions.$inferSelect;
export type InsertRecitationSession = z.infer<typeof insertRecitationSessionSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Real-Life Quran Examples - Practical examples of using Quranic expressions in daily situations
export const realLifeExamples = pgTable("real_life_examples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  situationAr: text("situation_ar").notNull(), // Arabic description of the situation
  situationEn: text("situation_en").notNull(), // English description
  verseArabic: text("verse_arabic").notNull(), // The Quranic verse used
  verseTranslation: text("verse_translation").notNull(), // English translation of the verse
  surahReference: text("surah_reference").notNull(), // e.g., "الكهف:19" or "Al-Kahf:19"
  usageNoteAr: text("usage_note_ar"), // How this verse/phrase is used in Arabic
  usageNoteEn: text("usage_note_en"), // How this verse/phrase is used in English
  translations: jsonb("translations").$type<{
    situation?: Record<string, string>; // Situation in multiple languages
    usageNote?: Record<string, string>; // Usage note in multiple languages
  }>(),
  category: text("category"), // e.g., "family", "work", "friends", "daily_life"
  popularity: integer("popularity").default(0), // Like/view count
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertRealLifeExampleSchema = createInsertSchema(realLifeExamples).omit({
  id: true,
  createdAt: true,
});

export type RealLifeExample = typeof realLifeExamples.$inferSelect;
export type InsertRealLifeExample = z.infer<typeof insertRealLifeExampleSchema>;

// Daily Quranic Elements - 100 words/phrases extracted daily for language learning
export const dailyQuranicElements = pgTable("daily_quranic_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  surah: text("surah").notNull(), // اسم السورة
  ayah: integer("ayah").notNull(), // رقم الآية
  phraseAr: text("phrase_ar").notNull(), // الكلمة أو العبارة بالعربية
  translit: text("translit").notNull(), // كتابة تقريبية بالحروف اللاتينية
  literalMeaning: text("literal_meaning").notNull(), // معنى حرفي مختصر بالإنجليزية
  arabicExplanation: text("arabic_explanation").notNull(), // شرح عربي مبسط للمعنى اللغوي
  grammarNote: text("grammar_note").notNull(), // ملاحظة نحوية/صرفية
  exampleSimple: text("example_simple").notNull(), // مثال عربي معاصر
  grammarType: text("grammar_type"), // جملة اسمية، فعلية، نداء، شرط، استفهام، إلخ
  wordCount: integer("word_count").default(1), // عدد الكلمات (1-6)
  batchDate: text("batch_date").notNull(), // تاريخ الدفعة YYYY-MM-DD
  batchNumber: integer("batch_number").notNull(), // رقم العنصر في الدفعة (1-100)
  isUsed: integer("is_used").default(0), // 1 = تم عرضه للمستخدم
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertDailyQuranicElementSchema = createInsertSchema(dailyQuranicElements).omit({
  id: true,
  createdAt: true,
});

export type DailyQuranicElement = typeof dailyQuranicElements.$inferSelect;
export type InsertDailyQuranicElement = z.infer<typeof insertDailyQuranicElementSchema>;

// Used Quranic Phrases - Track which phrases have been used to avoid repetition
export const usedQuranicPhrases = pgTable("used_quranic_phrases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phraseAr: text("phrase_ar").notNull().unique(), // العبارة المستخدمة
  surah: text("surah").notNull(),
  ayah: integer("ayah").notNull(),
  usedOn: text("used_on").notNull(), // تاريخ الاستخدام YYYY-MM-DD
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUsedQuranicPhraseSchema = createInsertSchema(usedQuranicPhrases).omit({
  id: true,
  createdAt: true,
});

export type UsedQuranicPhrase = typeof usedQuranicPhrases.$inferSelect;
export type InsertUsedQuranicPhrase = z.infer<typeof insertUsedQuranicPhraseSchema>;

// ==================== DIPLOMA SYSTEM ====================
// 12-Week Arabic Language Diploma using Quranic vocabulary as linguistic corpus

// Diploma Weeks - 12 weeks structure
export const diplomaWeeks = pgTable("diploma_weeks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekNumber: integer("week_number").notNull().unique(), // 1-12
  titleAr: text("title_ar").notNull(), // عنوان الأسبوع بالعربية
  titleEn: text("title_en").notNull(), // English title
  descriptionAr: text("description_ar").notNull(), // وصف الأسبوع
  descriptionEn: text("description_en").notNull(),
  lessonContentAr: text("lesson_content_ar").notNull(), // محتوى الدرس الرئيسي
  lessonContentEn: text("lesson_content_en").notNull(),
  translations: jsonb("translations").$type<Record<string, { title: string; description: string; lessonContent: string }>>(),
  grammarFocus: text("grammar_focus"), // التركيز النحوي
  orderIndex: integer("order_index").default(0),
});

export const insertDiplomaWeekSchema = createInsertSchema(diplomaWeeks).omit({
  id: true,
});

export type DiplomaWeek = typeof diplomaWeeks.$inferSelect;
export type InsertDiplomaWeek = z.infer<typeof insertDiplomaWeekSchema>;

// Diploma Vocabulary - مفردات كل أسبوع (10-20 كلمة)
export const diplomaVocabulary = pgTable("diploma_vocabulary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekId: text("week_id").notNull(), // Foreign key to diplomaWeeks
  wordAr: text("word_ar").notNull(), // الكلمة بالعربية
  root: text("root"), // الجذر الثلاثي
  translit: text("translit").notNull(), // الكتابة اللاتينية
  meaningEn: text("meaning_en").notNull(), // المعنى بالإنجليزية
  meaningAr: text("meaning_ar").notNull(), // الشرح بالعربية
  derivations: jsonb("derivations").$type<Array<{ word: string; meaning: string }>>(), // اشتقاقات
  exampleQuranic: text("example_quranic"), // مثال قرآني (كنص لغوي)
  exampleModern: text("example_modern"), // مثال حياتي معاصر
  translations: jsonb("translations").$type<Record<string, { meaning: string; example: string }>>(),
  orderIndex: integer("order_index").default(0),
});

export const insertDiplomaVocabularySchema = createInsertSchema(diplomaVocabulary).omit({
  id: true,
});

export type DiplomaVocabulary = typeof diplomaVocabulary.$inferSelect;
export type InsertDiplomaVocabulary = z.infer<typeof insertDiplomaVocabularySchema>;

// Diploma Exercises - تمارين (نموذجين فقط: A=فراغات، B=ترتيب)
export const diplomaExercises = pgTable("diploma_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekId: text("week_id").notNull(),
  exerciseType: text("exercise_type").notNull(), // "fill_blanks" (A) or "reorder" (B)
  questionAr: text("question_ar").notNull(), // السؤال بالعربية
  questionEn: text("question_en"), // الترجمة
  // For fill_blanks: sentence with ____ blanks
  sentenceWithBlanks: text("sentence_with_blanks"),
  // For fill_blanks: word bank
  wordBank: jsonb("word_bank").$type<string[]>(),
  // For reorder: shuffled words
  shuffledWords: jsonb("shuffled_words").$type<string[]>(),
  // Correct answer
  correctAnswer: text("correct_answer").notNull(),
  // Alternative correct answers (semantic variations)
  alternativeAnswers: jsonb("alternative_answers").$type<string[]>(),
  explanation: text("explanation"), // شرح الإجابة
  translations: jsonb("translations").$type<Record<string, { question: string; explanation: string }>>(),
  isQuiz: integer("is_quiz").default(0), // 1 = جزء من الاختبار الأسبوعي
  orderIndex: integer("order_index").default(0),
});

export const insertDiplomaExerciseSchema = createInsertSchema(diplomaExercises).omit({
  id: true,
});

export type DiplomaExercise = typeof diplomaExercises.$inferSelect;
export type InsertDiplomaExercise = z.infer<typeof insertDiplomaExerciseSchema>;

// User Diploma Progress - تقدم المستخدم في الدبلوم
export const userDiplomaProgress = pgTable("user_diploma_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  currentWeek: integer("current_week").default(1), // الأسبوع الحالي (1-12)
  completedWeeks: jsonb("completed_weeks").$type<number[]>().default([]), // الأسابيع المكتملة
  completedExercises: jsonb("completed_exercises").$type<string[]>().default([]), // التمارين المكتملة
  quizScores: jsonb("quiz_scores").$type<Record<number, number>>().default({}), // درجات الاختبارات
  enrolledAt: timestamp("enrolled_at").default(sql`now()`),
  lastAccessedAt: timestamp("last_accessed_at").default(sql`now()`),
  completionPercentage: integer("completion_percentage").default(0),
  isCompleted: integer("is_completed").default(0),
});

export const insertUserDiplomaProgressSchema = createInsertSchema(userDiplomaProgress).omit({
  id: true,
  enrolledAt: true,
  lastAccessedAt: true,
});

export type UserDiplomaProgress = typeof userDiplomaProgress.$inferSelect;
export type InsertUserDiplomaProgress = z.infer<typeof insertUserDiplomaProgressSchema>;

// Diploma Exercise Attempts - محاولات التمارين
export const diplomaExerciseAttempts = pgTable("diploma_exercise_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  weekNumber: integer("week_number").notNull(),
  userAnswer: text("user_answer").notNull(),
  isCorrect: integer("is_correct").notNull(), // 1 = صحيح، 0 = خطأ
  attemptedAt: timestamp("attempted_at").default(sql`now()`),
});

export const insertDiplomaExerciseAttemptSchema = createInsertSchema(diplomaExerciseAttempts).omit({
  id: true,
  attemptedAt: true,
});

export type DiplomaExerciseAttempt = typeof diplomaExerciseAttempts.$inferSelect;
export type InsertDiplomaExerciseAttempt = z.infer<typeof insertDiplomaExerciseAttemptSchema>;

// Analytics Events - تتبع الأحداث
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventName: text("event_name").notNull(), // اسم الحدث (مثل click_mojzy_button)
  userId: text("user_id"), // معرف المستخدم (اختياري للزوار)
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}), // بيانات إضافية
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  originalText: text("original_text").notNull(),
  translatedText: text("translated_text"),
  originalLang: text("original_lang"),
  targetLang: text("target_lang"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
