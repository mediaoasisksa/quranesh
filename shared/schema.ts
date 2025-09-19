import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  passwordHash: text("password_hash").notNull(),
  memorizationLevel: text("memorization_level"), // beginner, intermediate, advanced, hafiz
  nativeLanguage: text("native_language"),
  learningGoal: text("learning_goal"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
