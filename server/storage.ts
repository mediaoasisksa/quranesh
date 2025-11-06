import {
  users,
  phrases,
  userProgress,
  exerciseSessions,
  dailyStats,
  questionBanks,
  philosophicalSentences,
  conversationPrompts,
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
  getUnusedPhilosophicalSentence(userId: string): Promise<PhilosophicalSentence | undefined>;
  getTranslatedPhilosophicalSentence(id: string, language: string): Promise<PhilosophicalSentence>;

  // Conversation prompt methods
  getAllConversationPrompts(): Promise<ConversationPrompt[]>;
  getConversationPrompt(id: string): Promise<ConversationPrompt | undefined>;
  createConversationPrompt(prompt: InsertConversationPrompt): Promise<ConversationPrompt>;
  getRandomConversationPrompt(userId: string): Promise<ConversationPrompt | undefined>;
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
    const translatedText = await translatePhilosophicalSentence(
      sentence.arabicText,
      language,
    );

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

  async getRandomConversationPrompt(userId: string): Promise<ConversationPrompt | undefined> {
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

    // Get all prompts except completed ones
    const availablePrompts = completedIds.length > 0
      ? await db
          .select()
          .from(conversationPrompts)
          .where(notInArray(conversationPrompts.id, completedIds))
      : await db.select().from(conversationPrompts);

    if (availablePrompts.length === 0) return undefined;
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
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
}

export const storage = new DatabaseStorage();
