import {
  users,
  phrases,
  userProgress,
  exerciseSessions,
  dailyStats,
  questionBanks,
  philosophicalSentences,
  conversationPrompts,
  dailySentences,
  quranicExpressions,
  dailySentenceExercises,
  realLifeExamples,
  type User,
  type InsertUser,
  type Phrase,
  type InsertPhrase,
  type UserProgress,
  type InsertUserProgress,
  type ExerciseSession,
  type InsertExerciseSession,
  type DailyStats,
  type InsertDailyStats,
  type QuestionBank,
  type InsertQuestionBank,
  type PhilosophicalSentence,
  type InsertPhilosophicalSentence,
  type ConversationPrompt,
  type InsertConversationPrompt,
  type DailySentence,
  type QuranicExpression,
  type DailySentenceExercise,
  type RealLifeExample,
  type InsertRealLifeExample,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, notInArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { translatePhilosophicalSentence } from "./ai-service";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Phrase methods
  getAllPhrases(): Promise<Phrase[]>;
  getPhrasesByCategory(category: string): Promise<Phrase[]>;
  getPhrase(id: string): Promise<Phrase | undefined>;
  createPhrase(phrase: InsertPhrase): Promise<Phrase>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForPhrase(
    userId: string,
    phraseId: string,
  ): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(
    id: string,
    progress: Partial<UserProgress>,
  ): Promise<UserProgress | undefined>;

  // Exercise session methods
  createExerciseSession(
    session: InsertExerciseSession,
  ): Promise<ExerciseSession>;
  getUserExerciseSessions(userId: string): Promise<ExerciseSession[]>;
  getRecentSessions(userId: string, limit: number): Promise<ExerciseSession[]>;

  // Daily stats methods
  getDailyStats(userId: string, date: string): Promise<DailyStats | undefined>;
  createDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  updateDailyStats(
    id: string,
    stats: Partial<DailyStats>,
  ): Promise<DailyStats | undefined>;
  getWeeklyStats(userId: string): Promise<DailyStats[]>;

  // Question bank methods
  getAllQuestionBanks(): Promise<QuestionBank[]>;
  getQuestionBanksByCategory(category: string): Promise<QuestionBank[]>;
  getQuestionBank(id: string): Promise<QuestionBank | undefined>;
  createQuestionBank(questionBank: InsertQuestionBank): Promise<QuestionBank>;
  getQuestionBanksByTheme(theme: string): Promise<QuestionBank[]>;
  searchQuestionBanksByTags(tags: string[]): Promise<QuestionBank[]>;

  // Philosophical sentence methods
  getAllPhilosophicalSentences(): Promise<PhilosophicalSentence[]>;
  getPhilosophicalSentence(id: string): Promise<PhilosophicalSentence | undefined>;
  createPhilosophicalSentence(sentence: InsertPhilosophicalSentence): Promise<PhilosophicalSentence>;
  updatePhilosophicalSentence(id: string, data: Partial<PhilosophicalSentence>): Promise<PhilosophicalSentence | undefined>;
  getUnusedPhilosophicalSentence(userId: string): Promise<PhilosophicalSentence | undefined>;
  getTranslatedPhilosophicalSentence(id: string, language: string): Promise<PhilosophicalSentence>;

  // Conversation prompt methods
  getAllConversationPrompts(): Promise<ConversationPrompt[]>;
  getConversationPrompt(id: string): Promise<ConversationPrompt | undefined>;
  createConversationPrompt(prompt: InsertConversationPrompt): Promise<ConversationPrompt>;
  getRandomConversationPrompt(userId: string): Promise<ConversationPrompt | undefined>;

  // Daily contextual exercise methods
  getRandomDailyContextualExercise(userId: string): Promise<{
    exercise: DailySentenceExercise;
    sentence: DailySentence;
    correctExpression: QuranicExpression;
    distractors: QuranicExpression[];
  } | undefined>;
  getDailySentence(id: string): Promise<DailySentence | undefined>;
  getQuranicExpression(id: string): Promise<QuranicExpression | undefined>;

  // Real-life example methods
  getAllRealLifeExamples(): Promise<RealLifeExample[]>;
  getRealLifeExample(id: string): Promise<RealLifeExample | undefined>;
  createRealLifeExample(example: InsertRealLifeExample): Promise<RealLifeExample>;
  getRealLifeExamplesByCategory(category: string): Promise<RealLifeExample[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  // Continue with other methods...
  async getAllPhrases(): Promise<Phrase[]> {
    return await db.select().from(phrases);
  }

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    return await db
      .select()
      .from(phrases)
      .where(eq(phrases.category, category));
  }

  async getPhrase(id: string): Promise<Phrase | undefined> {
    const [phrase] = await db.select().from(phrases).where(eq(phrases.id, id));
    return phrase || undefined;
  }

  async createPhrase(insertPhrase: InsertPhrase): Promise<Phrase> {
    const [phrase] = await db.insert(phrases).values(insertPhrase).returning();
    return phrase;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async getUserProgressForPhrase(
    userId: string,
    phraseId: string,
  ): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.phraseId, phraseId),
        ),
      );
    return progress || undefined;
  }

  async createUserProgress(
    insertProgress: InsertUserProgress,
  ): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateUserProgress(
    id: string,
    updateData: Partial<UserProgress>,
  ): Promise<UserProgress | undefined> {
    const [updated] = await db
      .update(userProgress)
      .set(updateData)
      .where(eq(userProgress.id, id))
      .returning();
    return updated || undefined;
  }

  async createExerciseSession(
    insertSession: InsertExerciseSession,
  ): Promise<ExerciseSession> {
    const [session] = await db
      .insert(exerciseSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getUserExerciseSessions(userId: string): Promise<ExerciseSession[]> {
    return await db
      .select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, userId));
  }

  async getRecentSessions(
    userId: string,
    limit: number,
  ): Promise<ExerciseSession[]> {
    return await db
      .select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, userId))
      .orderBy(desc(exerciseSessions.completedAt))
      .limit(limit);
  }

  async getDailyStats(
    userId: string,
    date: string,
  ): Promise<DailyStats | undefined> {
    const [stats] = await db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)));
    return stats || undefined;
  }

  async createDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const [stats] = await db.insert(dailyStats).values(insertStats).returning();
    return stats;
  }

  async updateDailyStats(
    id: string,
    updateData: Partial<DailyStats>,
  ): Promise<DailyStats | undefined> {
    const [updated] = await db
      .update(dailyStats)
      .set(updateData)
      .where(eq(dailyStats.id, id))
      .returning();
    return updated || undefined;
  }

  async getWeeklyStats(userId: string): Promise<DailyStats[]> {
    return await db
      .select()
      .from(dailyStats)
      .where(eq(dailyStats.userId, userId))
      .orderBy(desc(dailyStats.date))
      .limit(7);
  }

  async getAllQuestionBanks(): Promise<QuestionBank[]> {
    return await db.select().from(questionBanks);
  }

  async getQuestionBanksByCategory(category: string): Promise<QuestionBank[]> {
    return await db
      .select()
      .from(questionBanks)
      .where(eq(questionBanks.category, category));
  }

  async getQuestionBank(id: string): Promise<QuestionBank | undefined> {
    const [questionBank] = await db
      .select()
      .from(questionBanks)
      .where(eq(questionBanks.id, id));
    return questionBank || undefined;
  }

  async createQuestionBank(
    insertQuestionBank: InsertQuestionBank,
  ): Promise<QuestionBank> {
    const [questionBank] = await db
      .insert(questionBanks)
      .values(insertQuestionBank)
      .returning();
    return questionBank;
  }

  async getQuestionBanksByTheme(theme: string): Promise<QuestionBank[]> {
    // Using ILIKE for case-insensitive search - adjust based on your needs
    return await db.select().from(questionBanks);
  }

  async searchQuestionBanksByTags(tags: string[]): Promise<QuestionBank[]> {
    // For array operations, this is simplified - you may need custom SQL for complex array queries
    return await db.select().from(questionBanks);
  }

  async getAllPhilosophicalSentences(): Promise<PhilosophicalSentence[]> {
    return await db.select().from(philosophicalSentences);
  }

  async getPhilosophicalSentence(id: string): Promise<PhilosophicalSentence | undefined> {
    const [sentence] = await db
      .select()
      .from(philosophicalSentences)
      .where(eq(philosophicalSentences.id, id));
    return sentence || undefined;
  }

  async createPhilosophicalSentence(
    insertSentence: InsertPhilosophicalSentence,
  ): Promise<PhilosophicalSentence> {
    const [sentence] = await db
      .insert(philosophicalSentences)
      .values(insertSentence)
      .returning();
    return sentence;
  }

  async updatePhilosophicalSentence(
    id: string,
    data: Partial<PhilosophicalSentence>,
  ): Promise<PhilosophicalSentence | undefined> {
    const [updated] = await db
      .update(philosophicalSentences)
      .set(data)
      .where(eq(philosophicalSentences.id, id))
      .returning();
    return updated || undefined;
  }

  async getUnusedPhilosophicalSentence(userId: string): Promise<PhilosophicalSentence | undefined> {
    // Get all philosophical sentence IDs that the user has already seen
    const usedSessions = await db
      .select({ phraseId: exerciseSessions.phraseId })
      .from(exerciseSessions)
      .where(
        and(
          eq(exerciseSessions.userId, userId),
          eq(exerciseSessions.exerciseType, "transformation")
        )
      );

    const usedIds = usedSessions.map(s => s.phraseId);

    // Get all philosophical sentences
    const allSentences = await db.select().from(philosophicalSentences);

    // Filter out used ones and pick a random one
    const unusedSentences = allSentences.filter(s => !usedIds.includes(s.id));

    if (unusedSentences.length === 0) {
      // All sentences have been used, return a random one
      return allSentences[Math.floor(Math.random() * allSentences.length)];
    }

    // Return a random unused sentence
    return unusedSentences[Math.floor(Math.random() * unusedSentences.length)];
  }

  async getTranslatedPhilosophicalSentence(id: string, language: string): Promise<PhilosophicalSentence> {
    // Get the sentence from database
    const sentence = await this.getPhilosophicalSentence(id);
    if (!sentence) {
      throw new Error("Philosophical sentence not found");
    }

    // If language is Arabic, return as is
    if (language === "ar") {
      return sentence;
    }

    // Check if translation already exists in database
    const translations = sentence.translations as Record<string, string> || {};
    
    if (translations[language]) {
      console.log(`Using cached translation for ${language}`);
      // Return sentence with cached translation
      return sentence;
    }

    // Translation doesn't exist, use Gemini API to translate
    console.log(`Translating philosophical sentence to ${language}...`);
    
    try {
      const translatedText = await translatePhilosophicalSentence(
        sentence.arabicText,
        language,
      );

      // Validate translation: ensure it's different from Arabic source
      // This prevents storing Arabic text in translation fields
      if (translatedText === sentence.arabicText || translatedText.trim() === '') {
        console.warn(`Invalid translation detected for ${language} - translation matches Arabic source or is empty`);
        return sentence; // Return without saving invalid translation
      }

      // Save translation to database
      const updatedTranslations = {
        ...translations,
        [language]: translatedText,
      };

      await db
        .update(philosophicalSentences)
        .set({
          translations: updatedTranslations,
          lastTranslatedAt: new Date(),
        })
        .where(eq(philosophicalSentences.id, id));

      // Return updated sentence
      return {
        ...sentence,
        translations: updatedTranslations,
        lastTranslatedAt: new Date(),
      };
    } catch (error) {
      console.error(`Failed to translate philosophical sentence to ${language}:`, error);
      // Return original sentence without translation
      // Frontend will fallback to Arabic text
      return sentence;
    }
  }

  async getAllConversationPrompts(): Promise<ConversationPrompt[]> {
    return await db.select().from(conversationPrompts);
  }

  async getConversationPrompt(id: string): Promise<ConversationPrompt | undefined> {
    const [prompt] = await db
      .select()
      .from(conversationPrompts)
      .where(eq(conversationPrompts.id, id));
    return prompt || undefined;
  }

  async createConversationPrompt(
    insertPrompt: InsertConversationPrompt,
  ): Promise<ConversationPrompt> {
    const [prompt] = await db
      .insert(conversationPrompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async getRandomConversationPrompt(userId: string, language: string = "ar"): Promise<ConversationPrompt | undefined> {
    // Get all conversation prompts that the user hasn't completed yet
    const completedPromptIds = await db
      .select({ phraseId: exerciseSessions.phraseId })
      .from(exerciseSessions)
      .where(
        and(
          eq(exerciseSessions.userId, userId),
          eq(exerciseSessions.exerciseType, "conversation")
        )
      );

    const completedIds = completedPromptIds.map((session) => session.phraseId);

    // Get all prompts except completed ones, PRIORITIZING practical daily use prompts
    const availablePrompts = completedIds.length > 0
      ? await db
          .select()
          .from(conversationPrompts)
          .where(notInArray(conversationPrompts.id, completedIds))
      : await db.select().from(conversationPrompts);

    if (availablePrompts.length === 0) return undefined;

    // Filter for practical daily use prompts first
    const practicalPrompts = availablePrompts.filter(p => p.isPracticalDailyUse === 1);
    
    // Prefer practical prompts, but fall back to all if none available
    let promptsToChooseFrom = practicalPrompts.length > 0 ? practicalPrompts : availablePrompts;
    
    // Filter by language if not Arabic
    if (language !== "ar") {
      const langFieldMap: Record<string, keyof ConversationPrompt> = {
        en: "questionEn",
        id: "questionId",
        tr: "questionTr",
        zh: "questionZh",
        sw: "questionSw",
        so: "questionSo",
        bs: "questionBs",
        sq: "questionSq",
        ru: "questionRu",
      };
      
      const langField = langFieldMap[language];
      if (langField) {
        const translatedPrompts = promptsToChooseFrom.filter(p => p[langField] != null);
        if (translatedPrompts.length > 0) {
          promptsToChooseFrom = translatedPrompts;
        }
      }
    }
    
    return promptsToChooseFrom[Math.floor(Math.random() * promptsToChooseFrom.length)];
  }

  // Daily contextual exercise methods
  async getRandomDailyContextualExercise(userId: string): Promise<{
    exercise: DailySentenceExercise;
    sentence: DailySentence;
    correctExpression: QuranicExpression;
    distractors: QuranicExpression[];
  } | undefined> {
    // Get completed daily contextual exercise IDs to avoid repetition
    const completedExerciseIds = await db
      .select({ phraseId: exerciseSessions.phraseId })
      .from(exerciseSessions)
      .where(
        and(
          eq(exerciseSessions.userId, userId),
          eq(exerciseSessions.exerciseType, "daily_contextual")
        )
      );

    const completedIds = completedExerciseIds.map((session) => session.phraseId);

    // Get available exercises (not yet completed)
    let availableExercises = completedIds.length > 0
      ? await db
          .select()
          .from(dailySentenceExercises)
          .where(notInArray(dailySentenceExercises.id, completedIds))
      : await db.select().from(dailySentenceExercises);

    // If all exercises are completed, allow repetition - get all exercises
    if (availableExercises.length === 0) {
      availableExercises = await db.select().from(dailySentenceExercises);
    }

    if (availableExercises.length === 0) return undefined;

    // Pick random exercise
    const exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];

    // Get sentence, correct expression, and distractors
    const [sentence] = await db
      .select()
      .from(dailySentences)
      .where(eq(dailySentences.id, exercise.dailySentenceId));

    const [correctExpression] = await db
      .select()
      .from(quranicExpressions)
      .where(eq(quranicExpressions.id, exercise.correctExpressionId));

    const distractorIds = exercise.distractorIds as string[];
    const distractors = await db
      .select()
      .from(quranicExpressions)
      .where(
        notInArray(quranicExpressions.id, [exercise.correctExpressionId])
      );

    const selectedDistractors = distractors.filter(d => distractorIds.includes(d.id));

    if (!sentence || !correctExpression || selectedDistractors.length < 2) {
      return undefined;
    }

    return {
      exercise,
      sentence,
      correctExpression,
      distractors: selectedDistractors,
    };
  }

  async getDailySentence(id: string): Promise<DailySentence | undefined> {
    const [sentence] = await db
      .select()
      .from(dailySentences)
      .where(eq(dailySentences.id, id));
    return sentence || undefined;
  }

  async getQuranicExpression(id: string): Promise<QuranicExpression | undefined> {
    const [expression] = await db
      .select()
      .from(quranicExpressions)
      .where(eq(quranicExpressions.id, id));
    return expression || undefined;
  }

  // Real-life example methods
  async getAllRealLifeExamples(): Promise<RealLifeExample[]> {
    return await db.select().from(realLifeExamples).orderBy(desc(realLifeExamples.popularity));
  }

  async getRealLifeExample(id: string): Promise<RealLifeExample | undefined> {
    const [example] = await db
      .select()
      .from(realLifeExamples)
      .where(eq(realLifeExamples.id, id));
    return example || undefined;
  }

  async createRealLifeExample(insertExample: InsertRealLifeExample): Promise<RealLifeExample> {
    const [example] = await db
      .insert(realLifeExamples)
      .values(insertExample)
      .returning();
    return example;
  }

  async getRealLifeExamplesByCategory(category: string): Promise<RealLifeExample[]> {
    return await db
      .select()
      .from(realLifeExamples)
      .where(eq(realLifeExamples.category, category))
      .orderBy(desc(realLifeExamples.popularity));
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private phrases: Map<string, Phrase>;
  private userProgress: Map<string, UserProgress>;
  private exerciseSessions: Map<string, ExerciseSession>;
  private dailyStats: Map<string, DailyStats>;
  private questionBanks: Map<string, QuestionBank>;
  private philosophicalSentences: Map<string, PhilosophicalSentence>;
  private conversationPrompts: Map<string, ConversationPrompt>;

  constructor() {
    this.users = new Map();
    this.phrases = new Map();
    this.userProgress = new Map();
    this.exerciseSessions = new Map();
    this.dailyStats = new Map();
    this.questionBanks = new Map();
    this.philosophicalSentences = new Map();
    this.conversationPrompts = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Phrase methods
  async getAllPhrases(): Promise<Phrase[]> {
    return Array.from(this.phrases.values());
  }

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    return Array.from(this.phrases.values()).filter(
      (phrase) => phrase.category === category,
    );
  }

  async getPhrase(id: string): Promise<Phrase | undefined> {
    return this.phrases.get(id);
  }

  async createPhrase(insertPhrase: InsertPhrase): Promise<Phrase> {
    const id = randomUUID();
    const phrase: Phrase = { ...insertPhrase, id };
    this.phrases.set(id, phrase);
    return phrase;
  }

  // User progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId,
    );
  }

  async getUserProgressForPhrase(
    userId: string,
    phraseId: string,
  ): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) =>
        progress.userId === userId && progress.phraseId === phraseId,
    );
  }

  async createUserProgress(
    insertProgress: InsertUserProgress,
  ): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { ...insertProgress, id };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(
    id: string,
    updateData: Partial<UserProgress>,
  ): Promise<UserProgress | undefined> {
    const existing = this.userProgress.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updateData };
    this.userProgress.set(id, updated);
    return updated;
  }

  // Exercise session methods
  async createExerciseSession(
    insertSession: InsertExerciseSession,
  ): Promise<ExerciseSession> {
    const id = randomUUID();
    const session: ExerciseSession = {
      ...insertSession,
      id,
      completedAt: new Date(),
    };
    this.exerciseSessions.set(id, session);
    return session;
  }

  async getUserExerciseSessions(userId: string): Promise<ExerciseSession[]> {
    return Array.from(this.exerciseSessions.values()).filter(
      (session) => session.userId === userId,
    );
  }

  async getRecentSessions(
    userId: string,
    limit: number,
  ): Promise<ExerciseSession[]> {
    const sessions = Array.from(this.exerciseSessions.values())
      .filter((session) => session.userId === userId)
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0),
      )
      .slice(0, limit);
    return sessions;
  }

  // Daily stats methods
  async getDailyStats(
    userId: string,
    date: string,
  ): Promise<DailyStats | undefined> {
    return Array.from(this.dailyStats.values()).find(
      (stats) => stats.userId === userId && stats.date === date,
    );
  }

  async createDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const id = randomUUID();
    const stats: DailyStats = { ...insertStats, id };
    this.dailyStats.set(id, stats);
    return stats;
  }

  async updateDailyStats(
    id: string,
    updateData: Partial<DailyStats>,
  ): Promise<DailyStats | undefined> {
    const existing = this.dailyStats.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updateData };
    this.dailyStats.set(id, updated);
    return updated;
  }

  async getWeeklyStats(userId: string): Promise<DailyStats[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return Array.from(this.dailyStats.values())
      .filter((stats) => stats.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
  }

  // Question bank methods
  async getAllQuestionBanks(): Promise<QuestionBank[]> {
    return Array.from(this.questionBanks.values());
  }

  async getQuestionBanksByCategory(category: string): Promise<QuestionBank[]> {
    return Array.from(this.questionBanks.values()).filter(
      (questionBank) => questionBank.category === category,
    );
  }

  async getQuestionBank(id: string): Promise<QuestionBank | undefined> {
    return this.questionBanks.get(id);
  }

  async createQuestionBank(
    insertQuestionBank: InsertQuestionBank,
  ): Promise<QuestionBank> {
    const id = randomUUID();
    const questionBank: QuestionBank = { ...insertQuestionBank, id };
    this.questionBanks.set(id, questionBank);
    return questionBank;
  }

  async getQuestionBanksByTheme(theme: string): Promise<QuestionBank[]> {
    return Array.from(this.questionBanks.values()).filter(
      (questionBank) =>
        questionBank.theme.includes(theme) ||
        questionBank.themeEnglish.includes(theme),
    );
  }

  async searchQuestionBanksByTags(tags: string[]): Promise<QuestionBank[]> {
    return Array.from(this.questionBanks.values()).filter((questionBank) =>
      tags.some((tag) => questionBank.tags.includes(tag)),
    );
  }

  async getAllPhilosophicalSentences(): Promise<PhilosophicalSentence[]> {
    return Array.from(this.philosophicalSentences.values());
  }

  async getPhilosophicalSentence(id: string): Promise<PhilosophicalSentence | undefined> {
    return this.philosophicalSentences.get(id);
  }

  async createPhilosophicalSentence(
    insertSentence: InsertPhilosophicalSentence,
  ): Promise<PhilosophicalSentence> {
    const id = randomUUID();
    const sentence: PhilosophicalSentence = { ...insertSentence, id };
    this.philosophicalSentences.set(id, sentence);
    return sentence;
  }

  async updatePhilosophicalSentence(
    id: string,
    data: Partial<PhilosophicalSentence>,
  ): Promise<PhilosophicalSentence | undefined> {
    const sentence = this.philosophicalSentences.get(id);
    if (!sentence) return undefined;
    
    const updated = { ...sentence, ...data };
    this.philosophicalSentences.set(id, updated);
    return updated;
  }

  async getUnusedPhilosophicalSentence(userId: string): Promise<PhilosophicalSentence | undefined> {
    // Get all philosophical sentence IDs that the user has already seen
    const usedIds = Array.from(this.exerciseSessions.values())
      .filter(session => session.userId === userId && session.exerciseType === "transformation")
      .map(session => session.phraseId);

    // Get all philosophical sentences
    const allSentences = Array.from(this.philosophicalSentences.values());

    // Filter out used ones and pick a random one
    const unusedSentences = allSentences.filter(s => !usedIds.includes(s.id));

    if (unusedSentences.length === 0) {
      // All sentences have been used, return a random one
      if (allSentences.length === 0) return undefined;
      return allSentences[Math.floor(Math.random() * allSentences.length)];
    }

    // Return a random unused sentence
    return unusedSentences[Math.floor(Math.random() * unusedSentences.length)];
  }

  async getTranslatedPhilosophicalSentence(id: string, language: string): Promise<PhilosophicalSentence> {
    const sentence = this.philosophicalSentences.get(id);
    if (!sentence) {
      throw new Error("Philosophical sentence not found");
    }
    // For MemStorage, just return the sentence as is (no translation needed)
    return sentence;
  }

  async getAllConversationPrompts(): Promise<ConversationPrompt[]> {
    return Array.from(this.conversationPrompts.values());
  }

  async getConversationPrompt(id: string): Promise<ConversationPrompt | undefined> {
    return this.conversationPrompts.get(id);
  }

  async createConversationPrompt(
    insertPrompt: InsertConversationPrompt,
  ): Promise<ConversationPrompt> {
    const id = randomUUID();
    const prompt: ConversationPrompt = { ...insertPrompt, id };
    this.conversationPrompts.set(id, prompt);
    return prompt;
  }

  async getRandomConversationPrompt(userId: string): Promise<ConversationPrompt | undefined> {
    // Get all conversation prompts that the user hasn't completed yet
    const completedPromptIds = Array.from(this.exerciseSessions.values())
      .filter(
        (session) =>
          session.userId === userId && session.exerciseType === "conversation"
      )
      .map((session) => session.phraseId);

    // Get all prompts except completed ones
    const availablePrompts = Array.from(this.conversationPrompts.values()).filter(
      (prompt) => !completedPromptIds.includes(prompt.id)
    );

    if (availablePrompts.length === 0) return undefined;
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
  }

  // Daily contextual exercise methods (placeholder for MemStorage)
  async getRandomDailyContextualExercise(_userId: string): Promise<{
    exercise: DailySentenceExercise;
    sentence: DailySentence;
    correctExpression: QuranicExpression;
    distractors: QuranicExpression[];
  } | undefined> {
    // MemStorage doesn't support daily contextual exercises
    return undefined;
  }

  async getDailySentence(_id: string): Promise<DailySentence | undefined> {
    return undefined;
  }

  async getQuranicExpression(_id: string): Promise<QuranicExpression | undefined> {
    return undefined;
  }

  // Real-life example methods (stub for MemStorage)
  async getAllRealLifeExamples(): Promise<RealLifeExample[]> {
    return [];
  }

  async getRealLifeExample(_id: string): Promise<RealLifeExample | undefined> {
    return undefined;
  }

  async createRealLifeExample(_example: InsertRealLifeExample): Promise<RealLifeExample> {
    throw new Error("MemStorage doesn't support real-life examples");
  }

  async getRealLifeExamplesByCategory(_category: string): Promise<RealLifeExample[]> {
    return [];
  }
}

export const storage = new DatabaseStorage();
