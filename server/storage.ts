import { type User, type InsertUser, type Phrase, type InsertPhrase, type UserProgress, type InsertUserProgress, type ExerciseSession, type InsertExerciseSession, type DailyStats, type InsertDailyStats, type QuestionBank, type InsertQuestionBank } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
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

export const storage = new MemStorage();
