import { users, phrases, userProgress, exerciseSessions, dailyStats, questionBanks, type User, type InsertUser, type Phrase, type InsertPhrase, type UserProgress, type InsertUserProgress, type ExerciseSession, type InsertExerciseSession, type DailyStats, type InsertDailyStats, type QuestionBank, type InsertQuestionBank } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Phrase methods
  getAllPhrases(): Promise<Phrase[]>;
  getPhrasesByCategory(category: string): Promise<Phrase[]>;
  getPhrase(id: string): Promise<Phrase | undefined>;
  createPhrase(phrase: InsertPhrase): Promise<Phrase>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForPhrase(userId: string, phraseId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, progress: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Exercise session methods
  createExerciseSession(session: InsertExerciseSession): Promise<ExerciseSession>;
  getUserExerciseSessions(userId: string): Promise<ExerciseSession[]>;
  getRecentSessions(userId: string, limit: number): Promise<ExerciseSession[]>;

  // Daily stats methods
  getDailyStats(userId: string, date: string): Promise<DailyStats | undefined>;
  createDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  updateDailyStats(id: string, stats: Partial<DailyStats>): Promise<DailyStats | undefined>;
  getWeeklyStats(userId: string): Promise<DailyStats[]>;

  // Question bank methods
  getAllQuestionBanks(): Promise<QuestionBank[]>;
  getQuestionBanksByCategory(category: string): Promise<QuestionBank[]>;
  getQuestionBank(id: string): Promise<QuestionBank | undefined>;
  createQuestionBank(questionBank: InsertQuestionBank): Promise<QuestionBank>;
  getQuestionBanksByTheme(theme: string): Promise<QuestionBank[]>;
  searchQuestionBanksByTags(tags: string[]): Promise<QuestionBank[]>;
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Continue with other methods...
  async getAllPhrases(): Promise<Phrase[]> {
    return await db.select().from(phrases);
  }

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    return await db.select().from(phrases).where(eq(phrases.category, category));
  }

  async getPhrase(id: string): Promise<Phrase | undefined> {
    const [phrase] = await db.select().from(phrases).where(eq(phrases.id, id));
    return phrase || undefined;
  }

  async createPhrase(insertPhrase: InsertPhrase): Promise<Phrase> {
    const [phrase] = await db
      .insert(phrases)
      .values(insertPhrase)
      .returning();
    return phrase;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserProgressForPhrase(userId: string, phraseId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.phraseId, phraseId)));
    return progress || undefined;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateUserProgress(id: string, updateData: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [updated] = await db
      .update(userProgress)
      .set(updateData)
      .where(eq(userProgress.id, id))
      .returning();
    return updated || undefined;
  }

  async createExerciseSession(insertSession: InsertExerciseSession): Promise<ExerciseSession> {
    const [session] = await db
      .insert(exerciseSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getUserExerciseSessions(userId: string): Promise<ExerciseSession[]> {
    return await db.select().from(exerciseSessions).where(eq(exerciseSessions.userId, userId));
  }

  async getRecentSessions(userId: string, limit: number): Promise<ExerciseSession[]> {
    return await db
      .select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, userId))
      .orderBy(desc(exerciseSessions.completedAt))
      .limit(limit);
  }

  async getDailyStats(userId: string, date: string): Promise<DailyStats | undefined> {
    const [stats] = await db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)));
    return stats || undefined;
  }

  async createDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const [stats] = await db
      .insert(dailyStats)
      .values(insertStats)
      .returning();
    return stats;
  }

  async updateDailyStats(id: string, updateData: Partial<DailyStats>): Promise<DailyStats | undefined> {
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
    return await db.select().from(questionBanks).where(eq(questionBanks.category, category));
  }

  async getQuestionBank(id: string): Promise<QuestionBank | undefined> {
    const [questionBank] = await db.select().from(questionBanks).where(eq(questionBanks.id, id));
    return questionBank || undefined;
  }

  async createQuestionBank(insertQuestionBank: InsertQuestionBank): Promise<QuestionBank> {
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private phrases: Map<string, Phrase>;
  private userProgress: Map<string, UserProgress>;
  private exerciseSessions: Map<string, ExerciseSession>;
  private dailyStats: Map<string, DailyStats>;
  private questionBanks: Map<string, QuestionBank>;

  constructor() {
    this.users = new Map();
    this.phrases = new Map();
    this.userProgress = new Map();
    this.exerciseSessions = new Map();
    this.dailyStats = new Map();
    this.questionBanks = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    return user;
  }

  // Phrase methods
  async getAllPhrases(): Promise<Phrase[]> {
    return Array.from(this.phrases.values());
  }

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    return Array.from(this.phrases.values()).filter(
      (phrase) => phrase.category === category
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
      (progress) => progress.userId === userId
    );
  }

  async getUserProgressForPhrase(userId: string, phraseId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === userId && progress.phraseId === phraseId
    );
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { ...insertProgress, id };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updateData: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const existing = this.userProgress.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.userProgress.set(id, updated);
    return updated;
  }

  // Exercise session methods
  async createExerciseSession(insertSession: InsertExerciseSession): Promise<ExerciseSession> {
    const id = randomUUID();
    const session: ExerciseSession = { ...insertSession, id, completedAt: new Date() };
    this.exerciseSessions.set(id, session);
    return session;
  }

  async getUserExerciseSessions(userId: string): Promise<ExerciseSession[]> {
    return Array.from(this.exerciseSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async getRecentSessions(userId: string, limit: number): Promise<ExerciseSession[]> {
    const sessions = Array.from(this.exerciseSessions.values())
      .filter((session) => session.userId === userId)
      .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
      .slice(0, limit);
    return sessions;
  }

  // Daily stats methods
  async getDailyStats(userId: string, date: string): Promise<DailyStats | undefined> {
    return Array.from(this.dailyStats.values()).find(
      (stats) => stats.userId === userId && stats.date === date
    );
  }

  async createDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const id = randomUUID();
    const stats: DailyStats = { ...insertStats, id };
    this.dailyStats.set(id, stats);
    return stats;
  }

  async updateDailyStats(id: string, updateData: Partial<DailyStats>): Promise<DailyStats | undefined> {
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
      (questionBank) => questionBank.category === category
    );
  }

  async getQuestionBank(id: string): Promise<QuestionBank | undefined> {
    return this.questionBanks.get(id);
  }

  async createQuestionBank(insertQuestionBank: InsertQuestionBank): Promise<QuestionBank> {
    const id = randomUUID();
    const questionBank: QuestionBank = { ...insertQuestionBank, id };
    this.questionBanks.set(id, questionBank);
    return questionBank;
  }

  async getQuestionBanksByTheme(theme: string): Promise<QuestionBank[]> {
    return Array.from(this.questionBanks.values()).filter(
      (questionBank) => questionBank.theme.includes(theme) || questionBank.themeEnglish.includes(theme)
    );
  }

  async searchQuestionBanksByTags(tags: string[]): Promise<QuestionBank[]> {
    return Array.from(this.questionBanks.values()).filter(
      (questionBank) => tags.some(tag => questionBank.tags.includes(tag))
    );
  }
}

export const storage = new DatabaseStorage();
