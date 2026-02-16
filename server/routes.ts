import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import {
  insertPhraseSchema,
  insertExerciseSessionSchema,
  insertUserProgressSchema,
  insertDailyStatsSchema,
  insertQuestionBankSchema,
  insertPhilosophicalSentenceSchema,
  insertRealLifeExampleSchema,
  insertUserSchema,
  signupSchema,
  signinSchema,
  users,
  exerciseSessions,
  humanSituations,
  questionBanks,
  conversationPrompts,
  roleplayScenarios,
  phrases as quranicPhrases,
  diplomaWeeks,
  diplomaVocabulary,
  diplomaExercises,
  userDiplomaProgress,
  diplomaExerciseAttempts,
  analyticsEvents,
  chatMessages,
  type User,
  type ExerciseSession,
  type DiplomaWeek,
  type DiplomaVocabulary,
  type DiplomaExercise,
  type UserDiplomaProgress,
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { phrasesData } from "../client/src/lib/phrases-data";
import { generateQuestionBanksWithPhraseIds } from "../client/src/lib/question-phrase-mapping";
import { philosophicalSentencesData } from "../client/src/lib/philosophical-sentences-data";
import axios from "axios";
import fs from "fs";
import path from "path";
import { validateExerciseAnswer } from "./ai-service";
import { isQuranicText, validateHumanWisdom } from "@shared/quran-protection";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate JWT secret on startup
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET environment variable is required for authentication",
    );
  }

  // Global admin authentication middleware
  const requireAdminAuth = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const { eq } = await import("drizzle-orm");
      
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      req.adminUser = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  // Initialize with demo user, phrase data and question banks
  (async () => {
    // Create demo user if it doesn't exist
    const demoEmail = "demo@example.com";
    const existingDemoUser = await storage.getUserByEmail(demoEmail);
    if (!existingDemoUser) {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash("password123", saltRounds);
      await storage.createUser({
        firstName: "Demo",
        lastName: "User",
        email: demoEmail,
        passwordHash,
        memorizationLevel: "hafiz",
        nativeLanguage: "English",
        learningGoal: "daily_conversation",
      });
      console.log("✓ Demo user created: demo@example.com / password123");
    }

    // Create admin user if it doesn't exist
    const adminEmail = "admin@quranesh.com";
    const existingAdminUser = await storage.getUserByEmail(adminEmail);
    if (!existingAdminUser) {
      const saltRounds = 12;
      const adminPasswordHash = await bcrypt.hash("admin234!", saltRounds);
      const adminUser = await storage.createUser({
        firstName: "Admin",
        lastName: "Quranesh",
        email: adminEmail,
        passwordHash: adminPasswordHash,
        memorizationLevel: "hafiz",
        nativeLanguage: "Arabic",
        learningGoal: "daily_conversation",
      });
      // Set as admin
      const { eq } = await import("drizzle-orm");
      await db.update(users).set({ isAdmin: true }).where(eq(users.id, adminUser.id));
      console.log("✓ Admin user created: admin@quranesh.com");
    }

    const existingPhrases = await storage.getAllPhrases();
    if (existingPhrases.length === 0) {
      for (const phraseData of phrasesData) {
        await storage.createPhrase(phraseData);
      }
    }

    const existingQuestionBanks = await storage.getAllQuestionBanks();
    if (existingQuestionBanks.length === 0) {
      const questionBanksWithPhraseIds = generateQuestionBanksWithPhraseIds();
      for (const questionBankData of questionBanksWithPhraseIds) {
        await storage.createQuestionBank(questionBankData);
      }
    }

    const existingPhilosophicalSentences = await storage.getAllPhilosophicalSentences();
    if (existingPhilosophicalSentences.length === 0) {
      for (const sentenceData of philosophicalSentencesData) {
        await storage.createPhilosophicalSentence(sentenceData);
      }
      console.log(`✓ Loaded ${philosophicalSentencesData.length} philosophical sentences`);
    }
    
    // Add new wisdom data with Quranic verses
    const { addWisdomData } = await import("./add-wisdom-data");
    await addWisdomData();
  })();

  // Authentication routes
  app.post("/api/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User already exists with this email" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(
        validatedData.password,
        saltRounds,
      );

      // Create user with hashed password (map to database schema)
      const userData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        countryCode: validatedData.countryCode,
        phoneNumber: validatedData.phoneNumber,
        passwordHash,
        memorizationLevel: validatedData.memorizationLevel,
        nativeLanguage: validatedData.nativeLanguage,
        learningGoal: validatedData.learningGoal,
      };

      const user = await storage.createUser(userData);

      // Remove password hash from response
      const { passwordHash: _, ...userResponse } = user;

      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
      });
    } catch (error) {
      // Handle database unique constraint errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Handle validation errors
      if (error instanceof Error && error.name === "ZodError") {
        return res
          .status(400)
          .json({ message: "Invalid input data", errors: error.message });
      }

      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/signin", async (req, res) => {
    try {
      const validatedData = signinSchema.parse(req.body);

      // Find user by email (email is already normalized by schema)
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        validatedData.password,
        user.passwordHash,
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token (JWT_SECRET is validated at startup)
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // Remove password hash from response
      const { passwordHash: _, ...userResponse } = user;

      res.json({
        message: "Login successful",
        token,
        tokenType: "Bearer",
        expiresIn: "24h",
        user: userResponse,
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error && error.name === "ZodError") {
        return res
          .status(400)
          .json({ message: "Invalid email or password format" });
      }

      res.status(500).json({ message: "Login failed" });
    }
  });

  // Phrase routes
  app.get("/api/phrases", async (req, res) => {
    try {
      const { category } = req.query;
      const phrases =
        category && typeof category === "string"
          ? await storage.getPhrasesByCategory(category)
          : await storage.getAllPhrases();
      res.json(phrases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch phrases" });
    }
  });

  app.get("/api/phrases/:id", async (req, res) => {
    try {
      const phrase = await storage.getPhrase(req.params.id);
      if (!phrase) {
        return res.status(404).json({ message: "Phrase not found" });
      }
      res.json(phrase);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch phrase" });
    }
  });

  app.post("/api/phrases", async (req, res) => {
    try {
      const validatedData = insertPhraseSchema.parse(req.body);
      const phrase = await storage.createPhrase(validatedData);
      res.status(201).json(phrase);
    } catch (error) {
      res.status(400).json({ message: "Invalid phrase data" });
    }
  });

  // Philosophical sentence routes
  app.get("/api/philosophical-sentences/random", async (req, res) => {
    try {
      const { userId, language } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
      }

      const sentence = await storage.getUnusedPhilosophicalSentence(userId);
      if (!sentence) {
        return res.status(404).json({ message: "No philosophical sentences available" });
      }

      // If language is specified and not Arabic, get the translation
      const targetLanguage = typeof language === "string" ? language : "ar";
      const translatedSentence = await storage.getTranslatedPhilosophicalSentence(
        sentence.id,
        targetLanguage,
      );

      res.json(translatedSentence);
    } catch (error) {
      console.error("Error fetching philosophical sentence:", error);
      res.status(500).json({ message: "Failed to fetch philosophical sentence" });
    }
  });

  app.get("/api/philosophical-sentences", async (req, res) => {
    try {
      const sentences = await storage.getAllPhilosophicalSentences();
      res.json(sentences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch philosophical sentences" });
    }
  });

  // Translation statistics endpoint
  app.get("/api/philosophical-sentences/translation-stats", async (req, res) => {
    try {
      const { language } = req.query;
      const targetLanguage = typeof language === "string" ? language : "en";
      
      const allSentences = await storage.getAllPhilosophicalSentences();
      const totalSentences = allSentences.length;
      
      // Count sentences with translations for the target language
      let translatedCount = 0;
      for (const sentence of allSentences) {
        if (sentence.translations && typeof sentence.translations === 'object') {
          const translations = sentence.translations as Record<string, string>;
          if (translations[targetLanguage] && translations[targetLanguage] !== sentence.arabicText) {
            translatedCount++;
          }
        }
      }
      
      res.json({
        totalSentences,
        translatedCount,
        untranslatedCount: totalSentences - translatedCount,
        coveragePercentage: totalSentences > 0 ? ((translatedCount / totalSentences) * 100).toFixed(2) : "0.00",
        language: targetLanguage,
      });
    } catch (error) {
      console.error("Error fetching translation stats:", error);
      res.status(500).json({ message: "Failed to fetch translation statistics" });
    }
  });

  // Bulk translation endpoint (admin only - translates untranslated sentences in batches)
  app.post("/api/philosophical-sentences/bulk-translate", requireAdminAuth, async (req, res) => {
    try {
      const { language, limit = 10 } = req.body;
      
      if (!language || typeof language !== "string") {
        return res.status(400).json({ message: "Language is required" });
      }

      // Get all sentences
      const allSentences = await storage.getAllPhilosophicalSentences();
      
      // Filter untranslated sentences
      const untranslatedSentences = allSentences.filter(sentence => {
        const translations = (sentence.translations || {}) as Record<string, string>;
        return !translations[language] || translations[language] === sentence.arabicText;
      });

      if (untranslatedSentences.length === 0) {
        return res.json({
          success: true,
          message: "All sentences are already translated",
          translated: 0,
          failed: 0,
        });
      }

      // Limit the number of sentences to translate
      const sentencesToTranslate = untranslatedSentences.slice(0, Math.min(limit, untranslatedSentences.length));
      
      const { translatePhilosophicalSentence } = await import("./ai-service");
      
      let successCount = 0;
      let failureCount = 0;
      const results = [];

      for (const sentence of sentencesToTranslate) {
        try {
          console.log(`Translating sentence ${sentence.id} to ${language}...`);
          const translation = await translatePhilosophicalSentence(sentence.arabicText, language);
          
          // Verify translation is different from Arabic text
          if (translation && translation !== sentence.arabicText) {
            // Update the sentence with the new translation
            const updatedTranslations = {
              ...(sentence.translations || {}),
              [language]: translation,
            };
            
            await storage.updatePhilosophicalSentence(sentence.id, {
              translations: updatedTranslations,
            });
            
            successCount++;
            results.push({
              id: sentence.id,
              arabicText: sentence.arabicText,
              translation,
              status: "success",
            });
            
            console.log(`✓ Successfully translated sentence ${sentence.id}`);
          } else {
            failureCount++;
            results.push({
              id: sentence.id,
              arabicText: sentence.arabicText,
              status: "failed",
              error: "Translation same as Arabic text",
            });
          }
          
          // Add delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
          failureCount++;
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          results.push({
            id: sentence.id,
            arabicText: sentence.arabicText,
            status: "failed",
            error: errorMessage,
          });
          console.error(`✗ Failed to translate sentence ${sentence.id}:`, errorMessage);
        }
      }

      res.json({
        success: true,
        message: `Bulk translation completed`,
        translated: successCount,
        failed: failureCount,
        totalAttempted: sentencesToTranslate.length,
        totalUntranslated: untranslatedSentences.length,
        results,
      });
    } catch (error) {
      console.error("Error in bulk translation:", error);
      res.status(500).json({ 
        message: "Failed to perform bulk translation",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Single sentence translation endpoint (admin only)
  app.post("/api/philosophical-sentences/:id/translate", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { language } = req.body;
      
      if (!language || typeof language !== "string") {
        return res.status(400).json({ message: "Language is required" });
      }

      const sentence = await storage.getPhilosophicalSentence(id);
      if (!sentence) {
        return res.status(404).json({ message: "Sentence not found" });
      }

      const { translatePhilosophicalSentence } = await import("./ai-service");
      
      try {
        const translation = await translatePhilosophicalSentence(sentence.arabicText, language);
        
        // Verify translation is different from Arabic text
        if (translation && translation !== sentence.arabicText) {
          // Update the sentence with the new translation
          const updatedTranslations = {
            ...(sentence.translations || {}),
            [language]: translation,
          };
          
          await storage.updatePhilosophicalSentence(id, {
            translations: updatedTranslations,
          });
          
          res.json({
            success: true,
            id: sentence.id,
            arabicText: sentence.arabicText,
            translation,
            language,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Translation failed: result same as Arabic text",
          });
        }
      } catch (error) {
        console.error(`Error translating sentence ${id}:`, error);
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Translation failed",
        });
      }
    } catch (error) {
      console.error("Error in single translation:", error);
      res.status(500).json({ 
        message: "Failed to translate sentence",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Conversation prompt routes
  app.get("/api/conversation-prompts/random", async (req, res) => {
    try {
      const { userId, language, surah } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
      }

      const lang = typeof language === "string" ? language : "ar";
      const surahNumber = surah ? parseInt(surah as string) : undefined;
      const prompt = await storage.getRandomConversationPrompt(userId, lang, surahNumber);
      if (!prompt) {
        return res.status(404).json({ message: "No conversation prompts available" });
      }
      res.json(prompt);
    } catch (error) {
      console.error("Error fetching conversation prompt:", error);
      res.status(500).json({ message: "Failed to fetch conversation prompt" });
    }
  });

  app.get("/api/conversation-prompts", async (req, res) => {
    try {
      const prompts = await storage.getAllConversationPrompts();
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation prompts" });
    }
  });

  // Roleplay scenario routes
  app.get("/api/roleplay-scenarios/random", async (req, res) => {
    try {
      const { userId, surah } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
      }

      const surahNumber = surah ? parseInt(surah as string) : undefined;
      const scenario = await storage.getRandomRoleplayScenario(userId, surahNumber);
      if (!scenario) {
        return res.status(404).json({ message: "No roleplay scenarios available" });
      }
      res.json(scenario);
    } catch (error) {
      console.error("Error fetching roleplay scenario:", error);
      res.status(500).json({ message: "Failed to fetch roleplay scenario" });
    }
  });

  app.get("/api/roleplay-scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getAllRoleplayScenarios();
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roleplay scenarios" });
    }
  });

  // Daily contextual exercise routes
  app.get("/api/daily-contextual/random", async (req, res) => {
    try {
      const { userId, surah } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
      }

      const surahNumber = surah ? parseInt(surah as string) : undefined;
      const exerciseData = await storage.getRandomDailyContextualExercise(userId, surahNumber);
      if (!exerciseData) {
        return res.status(404).json({ message: "No daily contextual exercises available" });
      }

      // Shuffle options (correct + 3 distractors = 4 total options)
      const options = [
        exerciseData.correctExpression,
        ...exerciseData.distractors
      ].sort(() => Math.random() - 0.5);

      res.json({
        ...exerciseData,
        options, // Shuffled array of 4 expressions
      });
    } catch (error) {
      console.error("Error fetching daily contextual exercise:", error);
      res.status(500).json({ message: "Failed to fetch daily contextual exercise" });
    }
  });

  // Exercise session routes
  app.post("/api/exercise-sessions", async (req, res) => {
    try {
      const validatedData = insertExerciseSessionSchema.parse(req.body);
      const session = await storage.createExerciseSession(validatedData);

      // Update daily stats
      const today = new Date().toISOString().split("T")[0];
      let dailyStats = await storage.getDailyStats(validatedData.userId, today);

      if (!dailyStats) {
        dailyStats = await storage.createDailyStats({
          userId: validatedData.userId,
          date: today,
          phrasesUsed: 1,
          exercicesCompleted: 1,
          accuracyRate: validatedData.isCorrect === "true" ? 100 : 0,
        });
      } else {
        const newExercisesCount = (dailyStats.exercicesCompleted || 0) + 1;
        const correctCount =
          validatedData.isCorrect === "true"
            ? Math.floor(
                ((dailyStats.accuracyRate || 0) *
                  (dailyStats.exercicesCompleted || 0)) /
                  100,
              ) + 1
            : Math.floor(
                ((dailyStats.accuracyRate || 0) *
                  (dailyStats.exercicesCompleted || 0)) /
                  100,
              );

        const newAccuracy = Math.round(
          (correctCount / newExercisesCount) * 100,
        );

        await storage.updateDailyStats(dailyStats.id, {
          exercicesCompleted: newExercisesCount,
          accuracyRate: newAccuracy,
          phrasesUsed: (dailyStats.phrasesUsed || 0) + 1,
        });
      }

      // Update user progress
      let userProgress = await storage.getUserProgressForPhrase(
        validatedData.userId,
        validatedData.phraseId,
      );

      if (!userProgress) {
        userProgress = await storage.createUserProgress({
          userId: validatedData.userId,
          phraseId: validatedData.phraseId,
          masteryLevel: validatedData.isCorrect === "true" ? 20 : 0,
          correctAttempts: validatedData.isCorrect === "true" ? 1 : 0,
          totalAttempts: 1,
          lastPracticed: new Date(),
        });
      } else {
        const newTotal = (userProgress.totalAttempts || 0) + 1;
        const newCorrect =
          validatedData.isCorrect === "true"
            ? (userProgress.correctAttempts || 0) + 1
            : userProgress.correctAttempts || 0;
        const newMastery = Math.min(
          100,
          Math.round((newCorrect / newTotal) * 100),
        );

        await storage.updateUserProgress(userProgress.id, {
          totalAttempts: newTotal,
          correctAttempts: newCorrect,
          masteryLevel: newMastery,
          lastPracticed: new Date(),
        });
      }

      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise session data" });
    }
  });

  app.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.get("/api/daily-stats/:userId", async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      let stats = await storage.getDailyStats(req.params.userId, today);

      if (!stats) {
        // Create new daily stats if none exist
        stats = await storage.createDailyStats({
          userId: req.params.userId,
          date: today,
          phrasesUsed: 0,
          exercicesCompleted: 0,
          accuracyRate: 0,
        });
      }

      // Calculate actual accuracy from today's exercise sessions
      const todaySessions = await storage.getUserExerciseSessions(
        req.params.userId,
      );
      const todaySessionsFiltered = todaySessions.filter((session) => {
        if (!session.completedAt) return false;
        const sessionDate = new Date(session.completedAt)
          .toISOString()
          .split("T")[0];
        return sessionDate === today;
      });

      console.log("=== DAILY STATS CALCULATION ===");
      console.log("Today:", today);
      console.log("Total sessions today:", todaySessionsFiltered.length);
      console.log(
        "Sessions:",
        todaySessionsFiltered.map((s) => ({
          id: s.id,
          isCorrect: s.isCorrect,
          exerciseType: s.exerciseType,
          completedAt: s.completedAt,
        })),
      );

      if (todaySessionsFiltered.length > 0) {
        const correctSessions = todaySessionsFiltered.filter(
          (session) => session.isCorrect === "true",
        );
        const accuracyRate = Math.round(
          (correctSessions.length / todaySessionsFiltered.length) * 100,
        );

        console.log("Correct sessions:", correctSessions.length);
        console.log("Accuracy rate:", accuracyRate + "%");
        console.log("===============================");

        // Update the stats with calculated values
        const updatedStats = await storage.updateDailyStats(stats.id, {
          exercicesCompleted: todaySessionsFiltered.length,
          accuracyRate: accuracyRate,
        });

        res.json(updatedStats || stats);
      } else {
        res.json(stats);
      }
    } catch (error) {
      console.error("Daily stats error:", error);
      res.status(500).json({ message: "Failed to fetch daily stats" });
    }
  });

  app.get("/api/weekly-stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getWeeklyStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly stats" });
    }
  });

  app.get("/api/exercise-sessions/:userId/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await storage.getRecentSessions(
        req.params.userId,
        limit,
      );
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent sessions" });
    }
  });

  // Random phrase for exercises (with non-repetition logic)
  app.get("/api/phrases/random/:exerciseType", async (req, res) => {
    try {
      const { exerciseType } = req.params;
      const { category, difficulty, userId } = req.query;

      let phrases = await storage.getAllPhrases();

      if (category && typeof category === "string") {
        phrases = phrases.filter((p) => p.category === category);
      }

      if (difficulty && typeof difficulty === "string") {
        const diff = parseInt(difficulty);
        phrases = phrases.filter((p) => p.difficulty === diff);
      }

      // If userId is provided, filter out already-completed exercises
      if (userId && typeof userId === "string") {
        const completedSessions = await storage.getUserExerciseSessions(userId);
        
        // Get phrase IDs that have been completed for THIS specific exercise type
        const completedPhraseIds = new Set(
          completedSessions
            .filter((session) => session.exerciseType === exerciseType)
            .map((session) => session.phraseId)
        );
        
        // Filter out completed phrases
        phrases = phrases.filter((p) => !completedPhraseIds.has(p.id));
      }

      if (phrases.length === 0) {
        // User has exhausted all available phrases - generate a new one using AI
        console.log("No more phrases available - generating new one using AI");
        const { generateNewQuranicPhrase } = await import("./ai-service");
        const aiPhrase = await generateNewQuranicPhrase(
          exerciseType,
          typeof category === "string" ? category : "short",
          typeof difficulty === "string" ? parseInt(difficulty) : 1
        );
        
        return res.json({
          ...aiPhrase,
          id: `ai-${Date.now()}`, // Temporary ID for AI-generated phrases
        });
      }

      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      res.json(randomPhrase);
    } catch (error) {
      console.error("Error fetching random phrase:", error);
      res.status(500).json({ message: "Failed to fetch random phrase" });
    }
  });

  // Get phrases filtered by Surah number
  app.get("/api/phrases/by-surah/:surahNumber", async (req, res) => {
    try {
      const surahNumber = parseInt(req.params.surahNumber);
      const { userId, exerciseType } = req.query;
      
      if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        return res.status(400).json({ message: "Invalid surah number. Must be between 1 and 114." });
      }

      let phrases = await storage.getAllPhrases();
      
      // Filter by surah number - check surahAyah field which contains reference like "البقرة:255"
      const surahNames: Record<number, string[]> = {
        1: ["الفاتحة", "Al-Fatiha"],
        2: ["البقرة", "Al-Baqarah"],
        3: ["آل عمران", "Ali 'Imran"],
        4: ["النساء", "An-Nisa"],
        5: ["المائدة", "Al-Ma'idah"],
        6: ["الأنعام", "Al-An'am"],
        7: ["الأعراف", "Al-A'raf"],
        8: ["الأنفال", "Al-Anfal"],
        9: ["التوبة", "At-Tawbah"],
        10: ["يونس", "Yunus"],
        11: ["هود", "Hud"],
        12: ["يوسف", "Yusuf"],
        13: ["الرعد", "Ar-Ra'd"],
        14: ["إبراهيم", "Ibrahim"],
        15: ["الحجر", "Al-Hijr"],
        16: ["النحل", "An-Nahl"],
        17: ["الإسراء", "Al-Isra"],
        18: ["الكهف", "Al-Kahf"],
        19: ["مريم", "Maryam"],
        20: ["طه", "Ta-Ha"],
        21: ["الأنبياء", "Al-Anbiya"],
        22: ["الحج", "Al-Hajj"],
        23: ["المؤمنون", "Al-Mu'minun"],
        24: ["النور", "An-Nur"],
        25: ["الفرقان", "Al-Furqan"],
        26: ["الشعراء", "Ash-Shu'ara"],
        27: ["النمل", "An-Naml"],
        28: ["القصص", "Al-Qasas"],
        29: ["العنكبوت", "Al-'Ankabut"],
        30: ["الروم", "Ar-Rum"],
        31: ["لقمان", "Luqman"],
        32: ["السجدة", "As-Sajdah"],
        33: ["الأحزاب", "Al-Ahzab"],
        34: ["سبأ", "Saba"],
        35: ["فاطر", "Fatir"],
        36: ["يس", "Ya-Sin"],
        37: ["الصافات", "As-Saffat"],
        38: ["ص", "Sad"],
        39: ["الزمر", "Az-Zumar"],
        40: ["غافر", "Ghafir"],
        41: ["فصلت", "Fussilat"],
        42: ["الشورى", "Ash-Shura"],
        43: ["الزخرف", "Az-Zukhruf"],
        44: ["الدخان", "Ad-Dukhan"],
        45: ["الجاثية", "Al-Jathiyah"],
        46: ["الأحقاف", "Al-Ahqaf"],
        47: ["محمد", "Muhammad"],
        48: ["الفتح", "Al-Fath"],
        49: ["الحجرات", "Al-Hujurat"],
        50: ["ق", "Qaf"],
        51: ["الذاريات", "Adh-Dhariyat"],
        52: ["الطور", "At-Tur"],
        53: ["النجم", "An-Najm"],
        54: ["القمر", "Al-Qamar"],
        55: ["الرحمن", "Ar-Rahman"],
        56: ["الواقعة", "Al-Waqi'ah"],
        57: ["الحديد", "Al-Hadid"],
        58: ["المجادلة", "Al-Mujadilah"],
        59: ["الحشر", "Al-Hashr"],
        60: ["الممتحنة", "Al-Mumtahanah"],
        61: ["الصف", "As-Saf"],
        62: ["الجمعة", "Al-Jumu'ah"],
        63: ["المنافقون", "Al-Munafiqun"],
        64: ["التغابن", "At-Taghabun"],
        65: ["الطلاق", "At-Talaq"],
        66: ["التحريم", "At-Tahrim"],
        67: ["الملك", "Al-Mulk"],
        68: ["القلم", "Al-Qalam"],
        69: ["الحاقة", "Al-Haqqah"],
        70: ["المعارج", "Al-Ma'arij"],
        71: ["نوح", "Nuh"],
        72: ["الجن", "Al-Jinn"],
        73: ["المزمل", "Al-Muzzammil"],
        74: ["المدثر", "Al-Muddaththir"],
        75: ["القيامة", "Al-Qiyamah"],
        76: ["الإنسان", "Al-Insan"],
        77: ["المرسلات", "Al-Mursalat"],
        78: ["النبأ", "An-Naba"],
        79: ["النازعات", "An-Nazi'at"],
        80: ["عبس", "'Abasa"],
        81: ["التكوير", "At-Takwir"],
        82: ["الانفطار", "Al-Infitar"],
        83: ["المطففين", "Al-Mutaffifin"],
        84: ["الانشقاق", "Al-Inshiqaq"],
        85: ["البروج", "Al-Buruj"],
        86: ["الطارق", "At-Tariq"],
        87: ["الأعلى", "Al-A'la"],
        88: ["الغاشية", "Al-Ghashiyah"],
        89: ["الفجر", "Al-Fajr"],
        90: ["البلد", "Al-Balad"],
        91: ["الشمس", "Ash-Shams"],
        92: ["الليل", "Al-Layl"],
        93: ["الضحى", "Ad-Duha"],
        94: ["الشرح", "Ash-Sharh"],
        95: ["التين", "At-Tin"],
        96: ["العلق", "Al-'Alaq"],
        97: ["القدر", "Al-Qadr"],
        98: ["البينة", "Al-Bayyinah"],
        99: ["الزلزلة", "Az-Zalzalah"],
        100: ["العاديات", "Al-'Adiyat"],
        101: ["القارعة", "Al-Qari'ah"],
        102: ["التكاثر", "At-Takathur"],
        103: ["العصر", "Al-'Asr"],
        104: ["الهمزة", "Al-Humazah"],
        105: ["الفيل", "Al-Fil"],
        106: ["قريش", "Quraysh"],
        107: ["الماعون", "Al-Ma'un"],
        108: ["الكوثر", "Al-Kawthar"],
        109: ["الكافرون", "Al-Kafirun"],
        110: ["النصر", "An-Nasr"],
        111: ["المسد", "Al-Masad"],
        112: ["الإخلاص", "Al-Ikhlas"],
        113: ["الفلق", "Al-Falaq"],
        114: ["الناس", "An-Nas"],
      };
      
      const surahNamesForNumber = surahNames[surahNumber] || [];
      
      phrases = phrases.filter((p) => {
        if (!p.surahAyah) return false;
        return surahNamesForNumber.some(name => 
          p.surahAyah!.includes(name) || 
          p.surahAyah!.toLowerCase().includes(name.toLowerCase())
        );
      });

      // If userId provided, filter out completed exercises
      if (userId && typeof userId === "string" && exerciseType && typeof exerciseType === "string") {
        const completedSessions = await storage.getUserExerciseSessions(userId);
        const completedPhraseIds = new Set(
          completedSessions
            .filter((session) => session.exerciseType === exerciseType)
            .map((session) => session.phraseId)
        );
        phrases = phrases.filter((p) => !completedPhraseIds.has(p.id));
      }

      res.json({
        surahNumber,
        surahName: surahNamesForNumber[0] || "",
        surahNameEnglish: surahNamesForNumber[1] || "",
        phrases,
        total: phrases.length
      });
    } catch (error) {
      console.error("Error fetching phrases by surah:", error);
      res.status(500).json({ message: "Failed to fetch phrases by surah" });
    }
  });

  // Get available surahs that have phrases
  app.get("/api/surahs/available", async (req, res) => {
    try {
      const phrases = await storage.getAllPhrases();
      
      const surahData: Record<number, { nameArabic: string; nameEnglish: string; count: number }> = {};
      
      const surahNames: Record<string, { number: number; english: string }> = {
        "الفاتحة": { number: 1, english: "Al-Fatiha" },
        "البقرة": { number: 2, english: "Al-Baqarah" },
        "آل عمران": { number: 3, english: "Ali 'Imran" },
        "النساء": { number: 4, english: "An-Nisa" },
        "المائدة": { number: 5, english: "Al-Ma'idah" },
        "الأنعام": { number: 6, english: "Al-An'am" },
        "الأعراف": { number: 7, english: "Al-A'raf" },
        "الأنفال": { number: 8, english: "Al-Anfal" },
        "التوبة": { number: 9, english: "At-Tawbah" },
        "يونس": { number: 10, english: "Yunus" },
        "هود": { number: 11, english: "Hud" },
        "يوسف": { number: 12, english: "Yusuf" },
        "الرعد": { number: 13, english: "Ar-Ra'd" },
        "إبراهيم": { number: 14, english: "Ibrahim" },
        "الحجر": { number: 15, english: "Al-Hijr" },
        "النحل": { number: 16, english: "An-Nahl" },
        "الإسراء": { number: 17, english: "Al-Isra" },
        "الكهف": { number: 18, english: "Al-Kahf" },
        "مريم": { number: 19, english: "Maryam" },
        "طه": { number: 20, english: "Ta-Ha" },
        "الأنبياء": { number: 21, english: "Al-Anbiya" },
        "الحج": { number: 22, english: "Al-Hajj" },
        "المؤمنون": { number: 23, english: "Al-Mu'minun" },
        "النور": { number: 24, english: "An-Nur" },
        "الفرقان": { number: 25, english: "Al-Furqan" },
        "الشعراء": { number: 26, english: "Ash-Shu'ara" },
        "النمل": { number: 27, english: "An-Naml" },
        "القصص": { number: 28, english: "Al-Qasas" },
        "العنكبوت": { number: 29, english: "Al-'Ankabut" },
        "الروم": { number: 30, english: "Ar-Rum" },
        "لقمان": { number: 31, english: "Luqman" },
        "السجدة": { number: 32, english: "As-Sajdah" },
        "الأحزاب": { number: 33, english: "Al-Ahzab" },
        "سبأ": { number: 34, english: "Saba" },
        "فاطر": { number: 35, english: "Fatir" },
        "يس": { number: 36, english: "Ya-Sin" },
        "الصافات": { number: 37, english: "As-Saffat" },
        "ص": { number: 38, english: "Sad" },
        "الزمر": { number: 39, english: "Az-Zumar" },
        "غافر": { number: 40, english: "Ghafir" },
        "فصلت": { number: 41, english: "Fussilat" },
        "الشورى": { number: 42, english: "Ash-Shura" },
        "الزخرف": { number: 43, english: "Az-Zukhruf" },
        "الدخان": { number: 44, english: "Ad-Dukhan" },
        "الجاثية": { number: 45, english: "Al-Jathiyah" },
        "الأحقاف": { number: 46, english: "Al-Ahqaf" },
        "محمد": { number: 47, english: "Muhammad" },
        "الفتح": { number: 48, english: "Al-Fath" },
        "الحجرات": { number: 49, english: "Al-Hujurat" },
        "ق": { number: 50, english: "Qaf" },
        "الذاريات": { number: 51, english: "Adh-Dhariyat" },
        "الطور": { number: 52, english: "At-Tur" },
        "النجم": { number: 53, english: "An-Najm" },
        "القمر": { number: 54, english: "Al-Qamar" },
        "الرحمن": { number: 55, english: "Ar-Rahman" },
        "الواقعة": { number: 56, english: "Al-Waqi'ah" },
        "الحديد": { number: 57, english: "Al-Hadid" },
        "المجادلة": { number: 58, english: "Al-Mujadilah" },
        "الحشر": { number: 59, english: "Al-Hashr" },
        "الممتحنة": { number: 60, english: "Al-Mumtahanah" },
        "الصف": { number: 61, english: "As-Saf" },
        "الجمعة": { number: 62, english: "Al-Jumu'ah" },
        "المنافقون": { number: 63, english: "Al-Munafiqun" },
        "التغابن": { number: 64, english: "At-Taghabun" },
        "الطلاق": { number: 65, english: "At-Talaq" },
        "التحريم": { number: 66, english: "At-Tahrim" },
        "الملك": { number: 67, english: "Al-Mulk" },
        "القلم": { number: 68, english: "Al-Qalam" },
        "الحاقة": { number: 69, english: "Al-Haqqah" },
        "المعارج": { number: 70, english: "Al-Ma'arij" },
        "نوح": { number: 71, english: "Nuh" },
        "الجن": { number: 72, english: "Al-Jinn" },
        "المزمل": { number: 73, english: "Al-Muzzammil" },
        "المدثر": { number: 74, english: "Al-Muddaththir" },
        "القيامة": { number: 75, english: "Al-Qiyamah" },
        "الإنسان": { number: 76, english: "Al-Insan" },
        "المرسلات": { number: 77, english: "Al-Mursalat" },
        "النبأ": { number: 78, english: "An-Naba" },
        "النازعات": { number: 79, english: "An-Nazi'at" },
        "عبس": { number: 80, english: "'Abasa" },
        "التكوير": { number: 81, english: "At-Takwir" },
        "الانفطار": { number: 82, english: "Al-Infitar" },
        "المطففين": { number: 83, english: "Al-Mutaffifin" },
        "الانشقاق": { number: 84, english: "Al-Inshiqaq" },
        "البروج": { number: 85, english: "Al-Buruj" },
        "الطارق": { number: 86, english: "At-Tariq" },
        "الأعلى": { number: 87, english: "Al-A'la" },
        "الغاشية": { number: 88, english: "Al-Ghashiyah" },
        "الفجر": { number: 89, english: "Al-Fajr" },
        "البلد": { number: 90, english: "Al-Balad" },
        "الشمس": { number: 91, english: "Ash-Shams" },
        "الليل": { number: 92, english: "Al-Layl" },
        "الضحى": { number: 93, english: "Ad-Duha" },
        "الشرح": { number: 94, english: "Ash-Sharh" },
        "التين": { number: 95, english: "At-Tin" },
        "العلق": { number: 96, english: "Al-'Alaq" },
        "القدر": { number: 97, english: "Al-Qadr" },
        "البينة": { number: 98, english: "Al-Bayyinah" },
        "الزلزلة": { number: 99, english: "Az-Zalzalah" },
        "العاديات": { number: 100, english: "Al-'Adiyat" },
        "القارعة": { number: 101, english: "Al-Qari'ah" },
        "التكاثر": { number: 102, english: "At-Takathur" },
        "العصر": { number: 103, english: "Al-'Asr" },
        "الهمزة": { number: 104, english: "Al-Humazah" },
        "الفيل": { number: 105, english: "Al-Fil" },
        "قريش": { number: 106, english: "Quraysh" },
        "الماعون": { number: 107, english: "Al-Ma'un" },
        "الكوثر": { number: 108, english: "Al-Kawthar" },
        "الكافرون": { number: 109, english: "Al-Kafirun" },
        "النصر": { number: 110, english: "An-Nasr" },
        "المسد": { number: 111, english: "Al-Masad" },
        "الإخلاص": { number: 112, english: "Al-Ikhlas" },
        "الفلق": { number: 113, english: "Al-Falaq" },
        "الناس": { number: 114, english: "An-Nas" },
      };
      
      for (const phrase of phrases) {
        if (!phrase.surahAyah) continue;
        
        for (const [arabicName, info] of Object.entries(surahNames)) {
          if (phrase.surahAyah.includes(arabicName)) {
            if (!surahData[info.number]) {
              surahData[info.number] = {
                nameArabic: arabicName,
                nameEnglish: info.english,
                count: 0
              };
            }
            surahData[info.number].count++;
            break;
          }
        }
      }
      
      const availableSurahs = Object.entries(surahData)
        .map(([num, data]) => ({
          number: parseInt(num),
          ...data
        }))
        .sort((a, b) => a.number - b.number);
      
      res.json(availableSurahs);
    } catch (error) {
      console.error("Error fetching available surahs:", error);
      res.status(500).json({ message: "Failed to fetch available surahs" });
    }
  });

  // Question bank routes
  app.get("/api/question-banks", async (req, res) => {
    try {
      const { category, theme, tags } = req.query;

      let questionBanks;

      if (category && typeof category === "string") {
        questionBanks = await storage.getQuestionBanksByCategory(category);
      } else if (theme && typeof theme === "string") {
        questionBanks = await storage.getQuestionBanksByTheme(theme);
      } else if (tags && typeof tags === "string") {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        questionBanks = await storage.searchQuestionBanksByTags(tagArray);
      } else {
        questionBanks = await storage.getAllQuestionBanks();
      }

      res.json(questionBanks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question banks" });
    }
  });

  app.get("/api/question-banks/:id", async (req, res) => {
    try {
      const questionBank = await storage.getQuestionBank(req.params.id);
      if (!questionBank) {
        return res.status(404).json({ message: "Question bank not found" });
      }
      res.json(questionBank);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question bank" });
    }
  });

  app.post("/api/question-banks", async (req, res) => {
    try {
      const validatedData = insertQuestionBankSchema.parse(req.body);
      const questionBank = await storage.createQuestionBank(validatedData);
      res.status(201).json(questionBank);
    } catch (error) {
      res.status(400).json({ message: "Invalid question bank data" });
    }
  });

  // Random question bank for thematic exercises
  app.get("/api/question-banks/random/thematic", async (req, res) => {
    try {
      const { category, difficulty } = req.query;

      let questionBanks = await storage.getAllQuestionBanks();

      if (category && typeof category === "string") {
        questionBanks = questionBanks.filter((qb) => qb.category === category);
      }

      if (difficulty && typeof difficulty === "string") {
        const diff = parseInt(difficulty);
        questionBanks = questionBanks.filter((qb) => qb.difficulty === diff);
      }

      if (questionBanks.length === 0) {
        return res
          .status(404)
          .json({ message: "No question banks found for criteria" });
      }

      const randomQuestionBank =
        questionBanks[Math.floor(Math.random() * questionBanks.length)];

      // Get the associated phrases for this question bank
      const allPhrases = await storage.getAllPhrases();
      const associatedPhrases = allPhrases.filter((phrase) =>
        randomQuestionBank.correctPhraseIds.includes(phrase.id),
      );

      res.json({
        ...randomQuestionBank,
        associatedPhrases,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random question bank" });
    }
  });

  // HyperPay Payment Integration
  // Load pricing data
  const pricingPath = path.resolve(import.meta.dirname, "..", "pricing.json");
  const pricingData = JSON.parse(fs.readFileSync(pricingPath, "utf-8"));

  // HyperPay Configuration
  // Use production credentials if available, otherwise fall back to test environment
  const HYPERPAY_CONFIG = {
    serverUrl: process.env.HYPERPAY_PROD_ACCESS_TOKEN 
      ? "https://eu-prod.oppwa.com"
      : "https://eu-test.oppwa.com",
    accessToken: process.env.HYPERPAY_PROD_ACCESS_TOKEN ||
      "OGFjN2E0Yzk5NGFlZWE0ZDAxOTRiMWU0NWI2ZTAzZmZ8eDlqWjNxMkNOVUxOPVAlSG9waiU=",
    entityIdVisaMaster: process.env.HYPERPAY_PROD_ENTITY_ID_VISA_MASTER ||
      "8ac7a4c994aeea4d0194b1e58b280403",
    entityIdMada: process.env.HYPERPAY_PROD_ENTITY_ID_MADA ||
      "8ac7a4c994aeea4d0194b1e6e7090408",
    isProduction: !!process.env.HYPERPAY_PROD_ACCESS_TOKEN,
  };

  // Log environment on startup
  console.log(`🔐 HyperPay Environment: ${HYPERPAY_CONFIG.isProduction ? 'PRODUCTION' : 'TEST'}`);
  console.log(`📍 HyperPay Server: ${HYPERPAY_CONFIG.serverUrl}`);

  // Get pricing plans
  app.get("/api/pricing", (req, res) => {
    res.json(pricingData);
  });

  // Create HyperPay checkout
  app.post("/api/create-checkout", async (req, res) => {
    try {
      console.log("=== RAW REQUEST BODY ===");
      console.log("Full request body:", JSON.stringify(req.body, null, 2));
      console.log("========================");
      
      const { planId, paymentMethod, customerDetails } = req.body;
      
      console.log("=== EXTRACTED VALUES ===");
      console.log("planId:", planId);
      console.log("paymentMethod:", paymentMethod);
      console.log("paymentMethod type:", typeof paymentMethod);
      console.log("========================");

      // Find the selected plan
      const selectedPlan = pricingData.plans.find(
        (plan: any) => plan.id === planId,
      );
      if (!selectedPlan) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      // Don't process payment for free plans
      if (selectedPlan.price === 0) {
        return res.status(400).json({ message: "Cannot create checkout for free plan" });
      }

      // Generate unique transaction ID
      const merchantTransactionId = `TX${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

      // CRITICAL: Select correct entity ID based on payment method
      // MADA cards require MADA entity ID, VISA/MASTER cards require VISA/MASTER entity ID
      const entityId = paymentMethod === "MADA"
        ? HYPERPAY_CONFIG.entityIdMada
        : HYPERPAY_CONFIG.entityIdVisaMaster;
      
      console.log("=== DYNAMIC ENTITY ID SELECTION ===");
      console.log("Payment method:", paymentMethod);
      console.log("Selected entity ID:", entityId);
      console.log("MADA entity ID:", HYPERPAY_CONFIG.entityIdMada);
      console.log("VISA/MASTER entity ID:", HYPERPAY_CONFIG.entityIdVisaMaster);
      console.log("===================================");

      // Determine callback URL based on environment
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      const callbackUrl = `${baseUrl}/api/payment-callback?entityId=${entityId}`;

      // Prepare checkout request
      // NOTE: According to HyperPay Widget documentation, shopperResultUrl should NOT be set here
      // It should be set in the form's action attribute on the frontend
      const checkoutData = {
        entityId,
        amount: selectedPlan.price.toFixed(2),
        currency: selectedPlan.currency,
        paymentType: "DB",
        merchantTransactionId,
        integrity: "true", // Enable integrity hash for secure widget loading
        "customer.email": customerDetails.email,
        "customer.givenName": customerDetails.givenName,
        "customer.surname": customerDetails.surname,
        "billing.street1": customerDetails.street,
        "billing.city": customerDetails.city,
        "billing.state": customerDetails.state,
        "billing.country": customerDetails.country,
        "billing.postcode": customerDetails.postcode,
        "customParameters[3DS2_enrolled]": "true",
      };

      // Debug: Log the checkout data being sent
      console.log("=== CHECKOUT CREATION DEBUG ===");
      console.log("Payment method received from frontend:", paymentMethod);
      console.log("Entity ID selected for this payment:", entityId);
      console.log("Callback URL:", callbackUrl);
      console.log("Base URL:", baseUrl);
      console.log("Selected plan:", selectedPlan);
      console.log("Customer details:", customerDetails);
      console.log(
        "Creating checkout with data:",
        JSON.stringify(checkoutData, null, 2),
      );

      // Convert checkout data to URL-encoded format for HyperPay
      const formData = new URLSearchParams();
      Object.entries(checkoutData).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`${key}.${subKey}`, String(subValue));
          });
        } else {
          formData.append(key, String(value));
        }
      });

      console.log("=== FORM DATA BEING SENT ===");
      console.log("Form data:", formData.toString());
      console.log("============================");

      // Send request to HyperPay
      const response = await axios.post(
        `${HYPERPAY_CONFIG.serverUrl}/v1/checkouts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${HYPERPAY_CONFIG.accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("=== HYPERPAY RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Response data:", JSON.stringify(response.data, null, 2));
      console.log("Checkout ID:", response.data.id);
      console.log("Integrity object:", response.data.integrity);
      console.log("========================");

      // HyperPay returns integrity as an object { value: string, algorithm: string }
      // We need to format it for the script tag's integrity attribute
      let integrityHash = null;
      if (response.data.integrity && response.data.integrity.value) {
        const algorithm = response.data.integrity.algorithm.toLowerCase().replace('-', '');
        integrityHash = `${algorithm}-${response.data.integrity.value}`;
        console.log("Formatted integrity hash:", integrityHash);
      }

      res.json({
        checkoutId: response.data.id,
        integrity: integrityHash, // Include formatted integrity hash for secure script loading
        callbackUrl, // Include callback URL for form action
        widgetUrl: HYPERPAY_CONFIG.serverUrl, // Include widget server URL for frontend
        merchantTransactionId,
        plan: selectedPlan,
      });
    } catch (error) {
      console.error("HyperPay checkout error:", error);
      res.status(500).json({ message: "Failed to create checkout" });
    }
  });

  // Handle payment status verification
  app.get("/api/payment-status", async (req, res) => {
    try {
      const { resourcePath, entityId } = req.query;

      if (!resourcePath) {
        return res
          .status(400)
          .json({ message: "Missing resourcePath parameter" });
      }

      // Verify payment with HyperPay
      const response = await axios.get(
        `${HYPERPAY_CONFIG.serverUrl}${resourcePath}`,
        {
          headers: {
            Authorization: `Bearer ${HYPERPAY_CONFIG.accessToken}`,
          },
          params: {
            entityId: entityId || HYPERPAY_CONFIG.entityIdVisaMaster,
          },
        },
      );

      const paymentResult = response.data;

      // Check if payment was successful
      const isSuccessful = paymentResult.result.code.startsWith("000");

      if (isSuccessful) {
        // Here you would typically:
        // 1. Update user subscription in database
        // 2. Send confirmation email
        // 3. Log the transaction

        res.json({
          success: true,
          message: "Payment successful",
          transactionId: paymentResult.id,
          amount: paymentResult.amount,
          currency: paymentResult.currency,
        });
      } else {
        res.json({
          success: false,
          message: "Payment failed",
          error: paymentResult.result.description,
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // Handle HyperPay redirect after payment
  // Debug endpoint to validate checkout ID
  app.get("/api/validate-checkout/:checkoutId", async (req, res) => {
    try {
      const { checkoutId } = req.params;
      console.log("=== VALIDATING CHECKOUT ID ===");
      console.log("Checkout ID:", checkoutId);

      // Use POST request with proper parameters for HyperPay
      const formData = new URLSearchParams();
      formData.append("entityId", HYPERPAY_CONFIG.entityIdVisaMaster);
      formData.append("amount", "100.00");
      formData.append("currency", "SAR");
      formData.append("paymentType", "DB");
      formData.append("merchantTransactionId", `TX${Date.now()}`);
      formData.append("customer.email", "test@example.com");
      formData.append("customer.givenName", "Test");
      formData.append("customer.surname", "User");
      formData.append("billing.street1", "123 Test Street");
      formData.append("billing.city", "Riyadh");
      formData.append("billing.state", "Riyadh");
      formData.append("billing.country", "SA");
      formData.append("billing.postcode", "12345");
      formData.append("customParameters[3DS2_enrolled]", "true");

      const response = await axios.post(
        `${HYPERPAY_CONFIG.serverUrl}/v1/checkouts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${HYPERPAY_CONFIG.accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log(
        "Validation response:",
        JSON.stringify(response.data, null, 2),
      );
      res.json({
        valid: true,
        checkoutId,
        response: response.data,
      });
    } catch (error: any) {
      console.error(
        "Checkout validation error:",
        error.response?.data || error.message,
      );
      res.status(400).json({
        valid: false,
        error: error.response?.data || error.message,
      });
    }
  });

  app.get("/api/payment-callback", async (req, res) => {
    try {
      const { resourcePath, entityId } = req.query;

      console.log("=== PAYMENT CALLBACK RECEIVED ===");
      console.log("Full query params:", req.query);
      console.log("resourcePath:", resourcePath);
      console.log("entityId:", entityId);

      if (!resourcePath) {
        console.log("Missing resourcePath, redirecting to pricing with error");
        return res.redirect("/pricing?error=missing_parameters");
      }

      // Verify payment with HyperPay
      // The entityId should be passed from our shopperResultUrl
      const verificationEntityId = entityId as string || HYPERPAY_CONFIG.entityIdVisaMaster;
      console.log("Using entityId for verification:", verificationEntityId);

      const response = await axios.get(
        `${HYPERPAY_CONFIG.serverUrl}${resourcePath}`,
        {
          headers: {
            Authorization: `Bearer ${HYPERPAY_CONFIG.accessToken}`,
          },
          params: {
            entityId: verificationEntityId,
          },
        },
      );

      const paymentResult = response.data;
      console.log("Payment verification result:", JSON.stringify(paymentResult, null, 2));

      // Check if payment was successful
      const isSuccessful = paymentResult.result.code.startsWith("000");

      if (isSuccessful) {
        console.log("Payment successful, redirecting to success page");
        // Redirect to success page with success parameters
        res.redirect(
          `/payment-success?success=true&transactionId=${paymentResult.id}&amount=${paymentResult.amount}&currency=${paymentResult.currency}`,
        );
      } else {
        console.log("Payment failed, redirecting with error");
        // Redirect to success page with error parameters
        res.redirect(
          `/payment-success?success=false&error=${encodeURIComponent(paymentResult.result.description)}`,
        );
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      res.redirect("/payment-success?success=false&error=verification_failed");
    }
  });

  // Test Gemini API endpoint
  app.get("/api/test-gemini", async (req, res) => {
    try {
      const { validateArabicAnswer } = await import("./ai-service");
      const result = await validateArabicAnswer(
        "وَاللَّهُ غَفُورٌ عَزِيزٌ",
        "substitution",
        "وَاللَّهُ غَفُورٌ رَّحِيمٌ",
        "And Allah is Forgiving, Merciful",
      );
      res.json({ success: true, result });
    } catch (error: any) {
      console.error("Gemini test error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Meaning breakdown for vocabulary learning
  app.post("/api/meaning-breakdown", async (req, res) => {
    try {
      const { arabicPhrase, language } = req.body;
      if (!arabicPhrase) {
        return res.status(400).json({ error: "Missing arabicPhrase" });
      }
      const { generateMeaningBreakdown } = await import("./ai-service");
      const breakdown = await generateMeaningBreakdown(arabicPhrase, language || "en");
      res.json(breakdown);
    } catch (error: any) {
      console.error("Meaning breakdown error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI-powered answer validation
  app.post("/api/validate-answer", async (req, res) => {
    try {
      const { userAnswer, exerciseType, phraseId, questionBankId, philosophicalSentenceId, language, suggestedVerse, conversationPromptId } = req.body;

      if (!userAnswer || !exerciseType) {
        return res.status(400).json({
          error: "Missing required fields: userAnswer, exerciseType",
        });
      }

      const strippedInput = userAnswer.replace(/[\u064B-\u065F\u0670\s]/g, "").trim();
      const TRIVIAL_PREFIXES = ["ال", "و", "ف", "ب", "ك", "ل", "لل", "بال", "وال", "فال", "كال"];
      if (strippedInput.length < 3 || TRIVIAL_PREFIXES.includes(strippedInput)) {
        return res.json({
          isCorrect: false,
          score: 0,
          feedback: "الإجابة قصيرة جداً. اكتب كلمة أو عبارة قرآنية كاملة وليس مجرد حروف أو بادئات.",
          suggestions: ["اكتب آية أو عبارة قرآنية كاملة"],
          confidence: 1.0,
        });
      }

      // Get user's language preference (default to English if not provided)
      const userLanguage = language || "en";

      // Handle Evidence-style exercises with direct phrase matching
      if (exerciseType === "conversation" && conversationPromptId) {
        const prompt = await storage.getConversationPrompt(conversationPromptId);
        if (prompt && prompt.evidencePhrase) {
          const { normalizeArabic, checkAnswerMatch, getEvidenceErrorMessage } = await import("@shared/arabic-normalizer");
          
          const matchResult = checkAnswerMatch(
            userAnswer,
            prompt.evidencePhrase,
            (prompt.answerMode as 'EXACT_PHRASE' | 'CONTAINS_PHRASE') || 'CONTAINS_PHRASE',
            prompt.acceptedVariants || undefined
          );
          
          const errorMsg = getEvidenceErrorMessage(matchResult, prompt.hint || undefined);
          
          return res.json({
            isCorrect: matchResult.isMatch,
            score: matchResult.isMatch ? 100 : 0,
            feedback: errorMsg.description,
            matchType: matchResult.matchType,
            canonicalForm: matchResult.canonicalForm || null,
            suggestions: matchResult.isMatch ? [] : ['اكتب الكلمة/العبارة القرآنية المطلوبة'],
            confidence: matchResult.isMatch ? 100 : 0,
          });
        }
      }

      let phraseData = null;

      // For transformation exercises, fetch philosophical sentence
      if (exerciseType === "transformation" && philosophicalSentenceId) {
        const philosophicalSentence = await storage.getPhilosophicalSentence(philosophicalSentenceId);
        if (philosophicalSentence) {
          // Convert philosophical sentence to phrase-like structure for AI validation
          phraseData = {
            id: philosophicalSentence.id,
            arabicText: philosophicalSentence.arabicText,
            englishTranslation: "Philosophical wisdom sentence",
            surahAyah: "N/A",
            lifeApplication: "Find Quranic verse with similar or opposite philosophical meaning",
            category: "transformation",
            difficulty: philosophicalSentence.difficulty || 1,
          };
        }
      } else if (phraseId) {
        // Fetch phrase or question bank data for context
        phraseData = await storage.getPhrase(phraseId);
      } else if (questionBankId) {
        phraseData = await storage.getQuestionBank(questionBankId);
      }

      console.log("=== AI VALIDATION DEBUG ===");
      console.log("User Answer:", userAnswer);
      console.log("Exercise Type:", exerciseType);
      console.log("User Language:", userLanguage);
      console.log("Phrase Data:", phraseData);
      console.log("Suggested Verse:", suggestedVerse);
      console.log("==========================");

      // Use AI to validate the answer
      const result = await validateExerciseAnswer(
        userAnswer,
        exerciseType,
        phraseData,
        userLanguage,
        suggestedVerse,
      );

      console.log("AI Validation Result:", result);

      res.json(result);
    } catch (error) {
      console.error("AI validation error:", error);
      res.status(500).json({
        isCorrect: false,
        score: 0,
        feedback:
          "AI validation service is temporarily unavailable. Please try again.",
        suggestions: ["Check your Arabic spelling and grammar"],
        confidence: 0,
      });
    }
  });

  // Real-life examples routes
  app.get("/api/real-life-examples", async (_req, res) => {
    try {
      const examples = await storage.getAllRealLifeExamples();
      res.json(examples);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch real-life examples" });
    }
  });

  app.get("/api/real-life-examples/:id", async (req, res) => {
    try {
      const example = await storage.getRealLifeExample(req.params.id);
      if (!example) {
        return res.status(404).json({ message: "Example not found" });
      }
      res.json(example);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch example" });
    }
  });

  app.get("/api/real-life-examples/category/:category", async (req, res) => {
    try {
      const examples = await storage.getRealLifeExamplesByCategory(req.params.category);
      res.json(examples);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch examples by category" });
    }
  });

  app.post("/api/real-life-examples", async (req, res) => {
    try {
      const validatedData = insertRealLifeExampleSchema.parse(req.body);
      const newExample = await storage.createRealLifeExample(validatedData);
      res.status(201).json(newExample);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid example data" });
    }
  });

  // Admin authentication middleware (defined early for analytics routes)
  const requireAdminEarly = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const { eq } = await import("drizzle-orm");
      
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      req.adminUser = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  // Public Analytics Endpoints (available to all users)
  app.get("/api/analytics/overview", async (_req, res) => {
    try {
      // Get total users count
      const allUsers = await db.select({ id: users.id }).from(users);
      const totalUsers = allUsers.length;

      // Get total exercises completed
      const sessions = await db.select().from(exerciseSessions);
      const totalExercises = sessions.length;

      // Get unique active users (users who completed at least one exercise)
      const activeUsers = new Set(sessions.map(s => s.userId));
      const totalActiveUsers = activeUsers.size;

      // Calculate engagement rate
      const engagementRate = totalUsers > 0 
        ? Math.round((totalActiveUsers / totalUsers) * 100) 
        : 0;

      // Get total phrases
      const phrases = await db.select({ id: quranicPhrases.id }).from(quranicPhrases);
      const totalPhrases = phrases.length;

      // Get today's stats
      const today = new Date().toISOString().split("T")[0];
      const todaySessions = sessions.filter((session) => {
        if (!session.completedAt) return false;
        const sessionDate = new Date(session.completedAt).toISOString().split("T")[0];
        return sessionDate === today;
      });

      res.json({
        totalUsers,
        totalActiveUsers,
        engagementRate,
        totalExercises,
        totalPhrases,
        todayExercises: todaySessions.length,
      });
    } catch (error) {
      console.error("Admin overview error:", error);
      res.status(500).json({ message: "Failed to fetch admin overview" });
    }
  });

  app.get("/api/analytics/exercise-engagement", async (_req, res) => {
    try {
      const sessions = await db.select().from(exerciseSessions);
      
      // Group sessions by exercise type
      const exerciseStats: Record<string, {
        count: number;
        correctCount: number;
        accuracy: number;
        uniqueUsers: Set<string>;
      }> = {};

      sessions.forEach((session) => {
        if (!exerciseStats[session.exerciseType]) {
          exerciseStats[session.exerciseType] = {
            count: 0,
            correctCount: 0,
            accuracy: 0,
            uniqueUsers: new Set(),
          };
        }

        exerciseStats[session.exerciseType].count++;
        exerciseStats[session.exerciseType].uniqueUsers.add(session.userId);
        
        if (session.isCorrect === "true") {
          exerciseStats[session.exerciseType].correctCount++;
        }
      });

      // Calculate accuracy for each exercise type
      const result = Object.entries(exerciseStats).map(([type, stats]) => ({
        exerciseType: type,
        totalSessions: stats.count,
        uniqueUsers: stats.uniqueUsers.size,
        correctSessions: stats.correctCount,
        accuracy: stats.count > 0 ? Math.round((stats.correctCount / stats.count) * 100) : 0,
        participationRate: sessions.length > 0 
          ? Math.round((stats.count / sessions.length) * 100) 
          : 0,
      }));

      res.json(result);
    } catch (error) {
      console.error("Exercise engagement error:", error);
      res.status(500).json({ message: "Failed to fetch exercise engagement" });
    }
  });

  app.get("/api/analytics/user-activity", async (_req, res) => {
    try {
      const sessions = await db.select().from(exerciseSessions);
      const allUsersData = await db.select().from(users);

      // Calculate user activity by date (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyActivity: Record<string, {
        date: string;
        activeUsers: Set<string>;
        totalSessions: number;
      }> = {};

      sessions.forEach((session) => {
        if (!session.completedAt) return;
        
        const sessionDate = new Date(session.completedAt);
        if (sessionDate < thirtyDaysAgo) return;

        const dateKey = sessionDate.toISOString().split("T")[0];
        
        if (!dailyActivity[dateKey]) {
          dailyActivity[dateKey] = {
            date: dateKey,
            activeUsers: new Set(),
            totalSessions: 0,
          };
        }

        dailyActivity[dateKey].activeUsers.add(session.userId);
        dailyActivity[dateKey].totalSessions++;
      });

      const result = Object.values(dailyActivity)
        .map(activity => ({
          date: activity.date,
          activeUsers: activity.activeUsers.size,
          totalSessions: activity.totalSessions,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      res.json({
        totalUsers: allUsersData.length,
        dailyActivity: result,
      });
    } catch (error) {
      console.error("User activity error:", error);
      res.status(500).json({ message: "Failed to fetch user activity" });
    }
  });

  app.get("/api/analytics/top-users", async (_req, res) => {
    try {
      const sessions = await db.select().from(exerciseSessions);
      
      // Count sessions per user
      const userStats: Record<string, {
        userId: string;
        totalSessions: number;
        correctSessions: number;
      }> = {};

      sessions.forEach((session) => {
        if (!userStats[session.userId]) {
          userStats[session.userId] = {
            userId: session.userId,
            totalSessions: 0,
            correctSessions: 0,
          };
        }

        userStats[session.userId].totalSessions++;
        if (session.isCorrect === "true") {
          userStats[session.userId].correctSessions++;
        }
      });

      // Get user details
      const allUsersData = await db.select().from(users);
      const userMap = new Map(allUsersData.map((u: User) => [u.id, u]));

      // Calculate and sort by total sessions
      const result = Object.values(userStats)
        .map(stats => {
          const user = userMap.get(stats.userId);
          return {
            userId: stats.userId,
            username: user ? `${user.firstName} ${user.lastName}` : "Unknown",
            email: user?.email,
            totalSessions: stats.totalSessions,
            accuracy: stats.totalSessions > 0 
              ? Math.round((stats.correctSessions / stats.totalSessions) * 100) 
              : 0,
          };
        })
        .sort((a, b) => b.totalSessions - a.totalSessions)
        .slice(0, 10); // Top 10 users

      res.json(result);
    } catch (error) {
      console.error("Top users error:", error);
      res.status(500).json({ message: "Failed to fetch top users" });
    }
  });

  // Daily Quranic Elements API
  app.get("/api/daily-quranic-elements", async (req, res) => {
    try {
      const { dailyQuranicElements } = await import("@shared/schema");
      const { desc, eq } = await import("drizzle-orm");
      
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      
      const elements = await db.select()
        .from(dailyQuranicElements)
        .where(eq(dailyQuranicElements.batchDate, date))
        .orderBy(dailyQuranicElements.batchNumber);
      
      res.json({
        date,
        count: elements.length,
        elements
      });
    } catch (error) {
      console.error("Daily elements error:", error);
      res.status(500).json({ message: "Failed to fetch daily elements" });
    }
  });

  app.get("/api/daily-quranic-elements/stats", async (req, res) => {
    try {
      const { dailyQuranicElements, usedQuranicPhrases } = await import("@shared/schema");
      const { sql } = await import("drizzle-orm");
      
      const totalElements = await db.select({ count: sql<number>`count(*)` })
        .from(dailyQuranicElements);
      
      const totalUsed = await db.select({ count: sql<number>`count(*)` })
        .from(usedQuranicPhrases);
      
      const batchDates = await db.select({ 
        batchDate: dailyQuranicElements.batchDate,
        count: sql<number>`count(*)`
      })
        .from(dailyQuranicElements)
        .groupBy(dailyQuranicElements.batchDate)
        .orderBy(sql`batch_date DESC`)
        .limit(10);
      
      res.json({
        totalElements: totalElements[0]?.count || 0,
        totalUsedPhrases: totalUsed[0]?.count || 0,
        recentBatches: batchDates
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/run-daily-job", async (_req, res) => {
    try {
      const { runJobManually } = await import("./scheduler");
      const result = await runJobManually();
      res.json(result);
    } catch (error) {
      console.error("Manual job error:", error);
      res.status(500).json({ message: "Failed to run daily job" });
    }
  });

  app.get("/api/admin/scheduler-status", async (_req, res) => {
    try {
      const { getSchedulerStatus } = await import("./scheduler");
      const status = getSchedulerStatus();
      res.json(status);
    } catch (error) {
      console.error("Scheduler status error:", error);
      res.status(500).json({ message: "Failed to get scheduler status" });
    }
  });

  // ==================== DIPLOMA API ROUTES ====================
  
  // Get all diploma weeks
  app.get("/api/diploma/weeks", async (_req, res) => {
    try {
      const { asc } = await import("drizzle-orm");
      const weeks = await db.select()
        .from(diplomaWeeks)
        .orderBy(asc(diplomaWeeks.weekNumber));
      res.json(weeks);
    } catch (error) {
      console.error("Diploma weeks error:", error);
      res.status(500).json({ message: "Failed to fetch diploma weeks" });
    }
  });
  
  // Get single week with vocabulary and exercises
  app.get("/api/diploma/weeks/:weekNumber", async (req, res) => {
    try {
      const weekNumber = parseInt(req.params.weekNumber);
      const { eq, asc } = await import("drizzle-orm");
      
      const [week] = await db.select()
        .from(diplomaWeeks)
        .where(eq(diplomaWeeks.weekNumber, weekNumber));
      
      if (!week) {
        return res.status(404).json({ message: "Week not found" });
      }
      
      const vocabulary = await db.select()
        .from(diplomaVocabulary)
        .where(eq(diplomaVocabulary.weekId, week.id))
        .orderBy(asc(diplomaVocabulary.orderIndex));
      
      const exercises = await db.select()
        .from(diplomaExercises)
        .where(eq(diplomaExercises.weekId, week.id))
        .orderBy(asc(diplomaExercises.orderIndex));
      
      res.json({
        week,
        vocabulary,
        exercises
      });
    } catch (error) {
      console.error("Diploma week detail error:", error);
      res.status(500).json({ message: "Failed to fetch week details" });
    }
  });
  
  // Get user's diploma progress
  app.get("/api/diploma/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { eq } = await import("drizzle-orm");
      
      const [progress] = await db.select()
        .from(userDiplomaProgress)
        .where(eq(userDiplomaProgress.userId, userId));
      
      if (!progress) {
        return res.json(null);
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Diploma progress error:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });
  
  // Enroll user in diploma
  app.post("/api/diploma/enroll", async (req, res) => {
    try {
      const { userId } = req.body;
      const { eq } = await import("drizzle-orm");
      
      // Check if already enrolled
      const [existing] = await db.select()
        .from(userDiplomaProgress)
        .where(eq(userDiplomaProgress.userId, userId));
      
      if (existing) {
        return res.json(existing);
      }
      
      const [newProgress] = await db.insert(userDiplomaProgress)
        .values({
          userId,
          currentWeek: 1,
          completedWeeks: [],
          completedExercises: [],
          quizScores: {},
          completionPercentage: 0,
          isCompleted: 0,
        })
        .returning();
      
      res.status(201).json(newProgress);
    } catch (error) {
      console.error("Diploma enroll error:", error);
      res.status(500).json({ message: "Failed to enroll in diploma" });
    }
  });
  
  // Submit exercise answer
  app.post("/api/diploma/submit-answer", async (req, res) => {
    try {
      const { userId, exerciseId, weekNumber, userAnswer } = req.body;
      const { eq, and } = await import("drizzle-orm");
      
      // Get exercise to check answer
      const [exercise] = await db.select()
        .from(diplomaExercises)
        .where(eq(diplomaExercises.id, exerciseId));
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      // Check if answer is correct (normalize whitespace and diacritics for comparison)
      const normalizeArabic = (text: string) => 
        text.trim()
          .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics
          .replace(/\s+/g, ' ');
      
      const normalizedUserAnswer = normalizeArabic(userAnswer);
      const normalizedCorrect = normalizeArabic(exercise.correctAnswer);
      
      let isCorrect = normalizedUserAnswer === normalizedCorrect;
      
      // Check alternative answers if available
      if (!isCorrect && exercise.alternativeAnswers) {
        const alternatives = exercise.alternativeAnswers as string[];
        isCorrect = alternatives.some(alt => 
          normalizeArabic(alt) === normalizedUserAnswer
        );
      }
      
      // Record attempt
      await db.insert(diplomaExerciseAttempts).values({
        userId,
        exerciseId,
        weekNumber,
        userAnswer,
        isCorrect: isCorrect ? 1 : 0,
      });
      
      // Update user progress if correct
      if (isCorrect) {
        const [progress] = await db.select()
          .from(userDiplomaProgress)
          .where(eq(userDiplomaProgress.userId, userId));
        
        if (progress) {
          const completedExercises = (progress.completedExercises || []) as string[];
          if (!completedExercises.includes(exerciseId)) {
            completedExercises.push(exerciseId);
            
            // Calculate completion percentage (48 total exercises)
            const completionPercentage = Math.round((completedExercises.length / 48) * 100);
            
            await db.update(userDiplomaProgress)
              .set({ 
                completedExercises,
                completionPercentage,
                lastAccessedAt: new Date(),
              })
              .where(eq(userDiplomaProgress.userId, userId));
          }
        }
      }
      
      res.json({
        isCorrect,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
      });
    } catch (error) {
      console.error("Submit answer error:", error);
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });
  
  // Complete a week
  app.post("/api/diploma/complete-week", async (req, res) => {
    try {
      const { userId, weekNumber, quizScore } = req.body;
      const { eq } = await import("drizzle-orm");
      
      const [progress] = await db.select()
        .from(userDiplomaProgress)
        .where(eq(userDiplomaProgress.userId, userId));
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      const completedWeeks = (progress.completedWeeks || []) as number[];
      const quizScores = (progress.quizScores || {}) as Record<number, number>;
      
      if (!completedWeeks.includes(weekNumber)) {
        completedWeeks.push(weekNumber);
      }
      quizScores[weekNumber] = quizScore;
      
      const nextWeek = Math.min(weekNumber + 1, 12);
      const isCompleted = completedWeeks.length >= 12 ? 1 : 0;
      
      await db.update(userDiplomaProgress)
        .set({
          completedWeeks,
          quizScores,
          currentWeek: nextWeek,
          isCompleted,
          lastAccessedAt: new Date(),
        })
        .where(eq(userDiplomaProgress.userId, userId));
      
      res.json({ 
        message: "Week completed",
        nextWeek,
        isCompleted: isCompleted === 1,
      });
    } catch (error) {
      console.error("Complete week error:", error);
      res.status(500).json({ message: "Failed to complete week" });
    }
  });
  
  // Track analytics events
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { eventName, userId, metadata } = req.body;
      
      if (!eventName) {
        return res.status(400).json({ message: "Event name is required" });
      }
      
      await db.insert(analyticsEvents).values({
        eventName,
        userId: userId || null,
        metadata: metadata || {},
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Analytics track error:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });
  
  // Get diploma statistics
  app.get("/api/diploma/stats", async (_req, res) => {
    try {
      const { sql } = await import("drizzle-orm");
      
      const [weekCount] = await db.select({ count: sql<number>`count(*)` })
        .from(diplomaWeeks);
      
      const [vocabCount] = await db.select({ count: sql<number>`count(*)` })
        .from(diplomaVocabulary);
      
      const [exerciseCount] = await db.select({ count: sql<number>`count(*)` })
        .from(diplomaExercises);
      
      const [enrolledCount] = await db.select({ count: sql<number>`count(*)` })
        .from(userDiplomaProgress);
      
      res.json({
        totalWeeks: weekCount?.count || 0,
        totalVocabulary: vocabCount?.count || 0,
        totalExercises: exerciseCount?.count || 0,
        enrolledUsers: enrolledCount?.count || 0,
      });
    } catch (error) {
      console.error("Diploma stats error:", error);
      res.status(500).json({ message: "Failed to fetch diploma stats" });
    }
  });

  // ==================== ADMIN MANAGEMENT API ROUTES ====================
  
  // Admin authentication middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const { eq } = await import("drizzle-orm");
      
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      req.adminUser = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
      }).from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get admin stats
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const { sql } = await import("drizzle-orm");
      
      const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const [situationCount] = await db.select({ count: sql<number>`count(*)` }).from(humanSituations);
      const [exerciseCount] = await db.select({ count: sql<number>`count(*)` }).from(exerciseSessions);
      
      res.json({
        totalUsers: userCount?.count || 0,
        totalSituations: situationCount?.count || 0,
        totalExercises: exerciseCount?.count || 0,
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Toggle admin status
  app.post("/api/admin/users/:userId/toggle-admin", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { isAdmin: newAdminStatus } = req.body;
      
      if (typeof newAdminStatus !== 'boolean') {
        return res.status(400).json({ message: "isAdmin must be a boolean" });
      }
      
      const { eq } = await import("drizzle-orm");
      
      await db.update(users)
        .set({ isAdmin: newAdminStatus })
        .where(eq(users.id, userId));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Toggle admin error:", error);
      res.status(500).json({ message: "Failed to toggle admin status" });
    }
  });

  // Delete user (with cascade delete of related data)
  app.delete("/api/admin/users/:userId", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { eq } = await import("drizzle-orm");
      const { userProgress, dailyStats, userDiplomaProgress, diplomaExerciseAttempts } = await import("@shared/schema");
      
      // Delete related data first (cascade)
      await db.delete(exerciseSessions).where(eq(exerciseSessions.userId, userId));
      await db.delete(userProgress).where(eq(userProgress.userId, userId));
      await db.delete(dailyStats).where(eq(dailyStats.userId, userId));
      await db.delete(userDiplomaProgress).where(eq(userDiplomaProgress.userId, userId));
      await db.delete(diplomaExerciseAttempts).where(eq(diplomaExerciseAttempts.userId, userId));
      
      // Delete the user
      await db.delete(users).where(eq(users.id, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Get all human situations
  app.get("/api/admin/human-situations", requireAdmin, async (_req, res) => {
    try {
      const allSituations = await db.select().from(humanSituations);
      res.json(allSituations);
    } catch (error) {
      console.error("Admin situations error:", error);
      res.status(500).json({ message: "Failed to fetch situations" });
    }
  });

  // Add human situation (with validation)
  app.post("/api/admin/human-situations", requireAdmin, async (req, res) => {
    try {
      const { situationAr, situationEn, category, suggestedVerse, contextualLogic, contextualLogicEn } = req.body;
      
      // Validation
      if (!situationAr || typeof situationAr !== 'string') {
        return res.status(400).json({ message: "situationAr is required" });
      }
      if (!situationEn || typeof situationEn !== 'string') {
        return res.status(400).json({ message: "situationEn is required" });
      }
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ message: "category is required" });
      }
      if (!suggestedVerse || typeof suggestedVerse !== 'string') {
        return res.status(400).json({ message: "suggestedVerse is required" });
      }
      
      const [newSituation] = await db.insert(humanSituations).values({
        situationAr,
        situationEn,
        category,
        suggestedVerse,
        contextualLogic: contextualLogic || null,
        contextualLogicEn: contextualLogicEn || null,
      }).returning();
      
      res.json(newSituation);
    } catch (error) {
      console.error("Add situation error:", error);
      res.status(500).json({ message: "Failed to add situation" });
    }
  });

  // Update human situation (with validation)
  app.put("/api/admin/human-situations/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { situationAr, situationEn, category, suggestedVerse, contextualLogic, contextualLogicEn } = req.body;
      const { eq } = await import("drizzle-orm");
      
      // Validation
      if (!situationAr || typeof situationAr !== 'string') {
        return res.status(400).json({ message: "situationAr is required" });
      }
      if (!situationEn || typeof situationEn !== 'string') {
        return res.status(400).json({ message: "situationEn is required" });
      }
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ message: "category is required" });
      }
      if (!suggestedVerse || typeof suggestedVerse !== 'string') {
        return res.status(400).json({ message: "suggestedVerse is required" });
      }
      
      const [updated] = await db.update(humanSituations)
        .set({ 
          situationAr, 
          situationEn, 
          category, 
          suggestedVerse, 
          contextualLogic: contextualLogic || null, 
          contextualLogicEn: contextualLogicEn || null 
        })
        .where(eq(humanSituations.id, id))
        .returning();
      
      res.json(updated);
    } catch (error) {
      console.error("Update situation error:", error);
      res.status(500).json({ message: "Failed to update situation" });
    }
  });

  // Delete human situation
  app.delete("/api/admin/human-situations/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { eq } = await import("drizzle-orm");
      
      await db.delete(humanSituations).where(eq(humanSituations.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete situation error:", error);
      res.status(500).json({ message: "Failed to delete situation" });
    }
  });

  // ============== Question Banks Management ==============
  
  // Get all question banks
  app.get("/api/admin/question-banks", requireAdmin, async (_req, res) => {
    try {
      const allQuestions = await db.select().from(questionBanks);
      res.json(allQuestions);
    } catch (error) {
      console.error("Admin question banks error:", error);
      res.status(500).json({ message: "Failed to fetch question banks" });
    }
  });

  // Add new question bank
  app.post("/api/admin/question-banks", requireAdmin, async (req, res) => {
    try {
      const { theme, themeEnglish, description, tags, correctPhraseIds, difficulty, category } = req.body;
      
      if (!theme || typeof theme !== 'string') {
        return res.status(400).json({ message: "الموضوع بالعربية مطلوب" });
      }
      if (!themeEnglish || typeof themeEnglish !== 'string') {
        return res.status(400).json({ message: "الموضوع بالإنجليزية مطلوب" });
      }
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ message: "التصنيف مطلوب" });
      }
      
      const validDifficulty = Math.max(1, Math.min(5, parseInt(difficulty) || 1));
      
      const [newQuestion] = await db.insert(questionBanks).values({
        theme,
        themeEnglish,
        description: description || null,
        tags: Array.isArray(tags) ? tags : [],
        correctPhraseIds: Array.isArray(correctPhraseIds) ? correctPhraseIds : [],
        difficulty: validDifficulty,
        category,
      }).returning();
      
      res.json(newQuestion);
    } catch (error) {
      console.error("Add question bank error:", error);
      res.status(500).json({ message: "Failed to add question bank" });
    }
  });

  // Update question bank
  app.put("/api/admin/question-banks/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { theme, themeEnglish, description, tags, correctPhraseIds, difficulty, category } = req.body;
      
      if (!theme || typeof theme !== 'string') {
        return res.status(400).json({ message: "الموضوع بالعربية مطلوب" });
      }
      if (!themeEnglish || typeof themeEnglish !== 'string') {
        return res.status(400).json({ message: "الموضوع بالإنجليزية مطلوب" });
      }
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ message: "التصنيف مطلوب" });
      }
      
      const validDifficulty = Math.max(1, Math.min(5, parseInt(difficulty) || 1));
      const { eq } = await import("drizzle-orm");
      
      const [updated] = await db.update(questionBanks)
        .set({ 
          theme, 
          themeEnglish, 
          description: description || null,
          tags: Array.isArray(tags) ? tags : [],
          correctPhraseIds: Array.isArray(correctPhraseIds) ? correctPhraseIds : [],
          difficulty: validDifficulty,
          category,
        })
        .where(eq(questionBanks.id, id))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ message: "السؤال غير موجود" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update question bank error:", error);
      res.status(500).json({ message: "Failed to update question bank" });
    }
  });

  // Delete question bank
  app.delete("/api/admin/question-banks/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: "معرف السؤال مطلوب" });
      }
      
      const { eq } = await import("drizzle-orm");
      
      const deleted = await db.delete(questionBanks).where(eq(questionBanks.id, id)).returning();
      if (deleted.length === 0) {
        return res.status(404).json({ message: "السؤال غير موجود" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete question bank error:", error);
      res.status(500).json({ message: "Failed to delete question bank" });
    }
  });

  app.post("/api/admin/repair-scenarios", requireAdmin, async (req, res) => {
    try {
      const { type = 'both', batchSize = 10, dryRun = true } = req.body;
      const { validateScenarioVerseMatch } = await import("./ai-service");
      const { eq } = await import("drizzle-orm");
      
      const results: any[] = [];
      let checked = 0, matched = 0, fixed = 0, errors = 0;
      let quotaExhausted = false;

      if (type === 'conversation' || type === 'both') {
        const prompts = await db.select().from(conversationPrompts).limit(batchSize);
        for (const prompt of prompts) {
          if (quotaExhausted) break;
          if (!prompt.suggestedVerse || !prompt.questionEn) continue;
          checked++;
          try {
            const validation = await validateScenarioVerseMatch(
              prompt.questionEn, prompt.suggestedVerse, 'conversation'
            );
            if (validation.isMatch) {
              matched++;
              results.push({ id: prompt.id, type: 'conversation', status: 'match', confidence: validation.confidence });
            } else {
              const entry: any = {
                id: prompt.id, type: 'conversation', status: 'mismatch',
                confidence: validation.confidence, reason: validation.reason,
                originalScenario: prompt.questionEn,
                originalVerse: prompt.suggestedVerse,
                correctedScenario: validation.correctedScenario,
                correctedVerse: validation.correctedVerse,
              };
              if (!dryRun && validation.correctedScenario) {
                await db.update(conversationPrompts)
                  .set({ questionEn: validation.correctedScenario })
                  .where(eq(conversationPrompts.id, prompt.id));
                entry.applied = true;
                fixed++;
              }
              results.push(entry);
            }
            await new Promise(r => setTimeout(r, 4000));
          } catch (e) {
            errors++;
            const errorStr = String(e);
            if (errorStr.includes('Quota exceeded') || errorStr.includes('429')) {
              quotaExhausted = true;
              results.push({ id: prompt.id, type: 'conversation', status: 'error', error: 'API quota exhausted - try again later' });
            } else {
              results.push({ id: prompt.id, type: 'conversation', status: 'error', error: errorStr });
            }
          }
        }
      }

      if (type === 'roleplay' || type === 'both') {
        const scenarios = await db.select().from(roleplayScenarios).limit(batchSize);
        for (const scenario of scenarios) {
          if (quotaExhausted) break;
          if (!scenario.suggestedVerse || !scenario.scenarioEn) continue;
          checked++;
          try {
            const validation = await validateScenarioVerseMatch(
              scenario.scenarioEn, scenario.suggestedVerse, 'roleplay'
            );
            if (validation.isMatch) {
              matched++;
              results.push({ id: scenario.id, type: 'roleplay', status: 'match', confidence: validation.confidence });
            } else {
              const entry: any = {
                id: scenario.id, type: 'roleplay', status: 'mismatch',
                confidence: validation.confidence, reason: validation.reason,
                originalScenario: scenario.scenarioEn,
                originalVerse: scenario.suggestedVerse,
                correctedScenario: validation.correctedScenario,
                correctedVerse: validation.correctedVerse,
              };
              if (!dryRun && validation.correctedScenario) {
                await db.update(roleplayScenarios)
                  .set({ scenarioEn: validation.correctedScenario })
                  .where(eq(roleplayScenarios.id, scenario.id));
                entry.applied = true;
                fixed++;
              }
              results.push(entry);
            }
            await new Promise(r => setTimeout(r, 4000));
          } catch (e) {
            errors++;
            const errorStr = String(e);
            if (errorStr.includes('Quota exceeded') || errorStr.includes('429')) {
              quotaExhausted = true;
              results.push({ id: scenario.id, type: 'roleplay', status: 'error', error: 'API quota exhausted - try again later' });
            } else {
              results.push({ id: scenario.id, type: 'roleplay', status: 'error', error: errorStr });
            }
          }
        }
      }

      res.json({
        summary: { checked, matched, mismatched: checked - matched - errors, fixed, errors, dryRun, quotaExhausted },
        results,
      });
    } catch (error) {
      console.error("Repair scenarios error:", error);
      res.status(500).json({ message: "Failed to repair scenarios" });
    }
  });

  app.get("/api/chat/rooms", async (_req, res) => {
    const { CHAT_ROOMS } = await import("./chat");
    res.json(CHAT_ROOMS);
  });

  app.get("/api/chat/messages/:roomId", async (req, res) => {
    try {
      const { desc, eq } = await import("drizzle-orm");
      const { roomId } = req.params;
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.roomId, roomId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(100);
      res.json(messages.reverse());
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
