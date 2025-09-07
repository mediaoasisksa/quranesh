import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhraseSchema, insertExerciseSessionSchema, insertUserProgressSchema, insertDailyStatsSchema } from "@shared/schema";
import { phrasesData } from "../client/src/lib/phrases-data";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize with phrase data
  (async () => {
    const existingPhrases = await storage.getAllPhrases();
    if (existingPhrases.length === 0) {
      for (const phraseData of phrasesData) {
        await storage.createPhrase(phraseData);
      }
    }
  })();

  // Phrase routes
  app.get("/api/phrases", async (req, res) => {
    try {
      const { category } = req.query;
      const phrases = category && typeof category === 'string' 
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

  // Exercise session routes
  app.post("/api/exercise-sessions", async (req, res) => {
    try {
      const validatedData = insertExerciseSessionSchema.parse(req.body);
      const session = await storage.createExerciseSession(validatedData);

      // Update daily stats
      const today = new Date().toISOString().split('T')[0];
      let dailyStats = await storage.getDailyStats(validatedData.userId, today);
      
      if (!dailyStats) {
        dailyStats = await storage.createDailyStats({
          userId: validatedData.userId,
          date: today,
          phrasesUsed: 1,
          exercicesCompleted: 1,
          accuracyRate: validatedData.isCorrect === 'true' ? 100 : 0
        });
      } else {
        const newExercisesCount = (dailyStats.exercicesCompleted || 0) + 1;
        const correctCount = validatedData.isCorrect === 'true' 
          ? Math.floor((dailyStats.accuracyRate || 0) * (dailyStats.exercicesCompleted || 0) / 100) + 1
          : Math.floor((dailyStats.accuracyRate || 0) * (dailyStats.exercicesCompleted || 0) / 100);
        
        const newAccuracy = Math.round((correctCount / newExercisesCount) * 100);
        
        await storage.updateDailyStats(dailyStats.id, {
          exercicesCompleted: newExercisesCount,
          accuracyRate: newAccuracy,
          phrasesUsed: (dailyStats.phrasesUsed || 0) + 1
        });
      }

      // Update user progress
      let userProgress = await storage.getUserProgressForPhrase(validatedData.userId, validatedData.phraseId);
      
      if (!userProgress) {
        userProgress = await storage.createUserProgress({
          userId: validatedData.userId,
          phraseId: validatedData.phraseId,
          masteryLevel: validatedData.isCorrect === 'true' ? 20 : 0,
          correctAttempts: validatedData.isCorrect === 'true' ? 1 : 0,
          totalAttempts: 1,
          lastPracticed: new Date()
        });
      } else {
        const newTotal = (userProgress.totalAttempts || 0) + 1;
        const newCorrect = validatedData.isCorrect === 'true' 
          ? (userProgress.correctAttempts || 0) + 1 
          : (userProgress.correctAttempts || 0);
        const newMastery = Math.min(100, Math.round((newCorrect / newTotal) * 100));

        await storage.updateUserProgress(userProgress.id, {
          totalAttempts: newTotal,
          correctAttempts: newCorrect,
          masteryLevel: newMastery,
          lastPracticed: new Date()
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
      const today = new Date().toISOString().split('T')[0];
      const stats = await storage.getDailyStats(req.params.userId, today);
      res.json(stats || {
        userId: req.params.userId,
        date: today,
        phrasesUsed: 0,
        exercicesCompleted: 0,
        accuracyRate: 0
      });
    } catch (error) {
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
      const sessions = await storage.getRecentSessions(req.params.userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent sessions" });
    }
  });

  // Random phrase for exercises
  app.get("/api/phrases/random/:exerciseType", async (req, res) => {
    try {
      const { exerciseType } = req.params;
      const { category, difficulty } = req.query;
      
      let phrases = await storage.getAllPhrases();
      
      if (category && typeof category === 'string') {
        phrases = phrases.filter(p => p.category === category);
      }
      
      if (difficulty && typeof difficulty === 'string') {
        const diff = parseInt(difficulty);
        phrases = phrases.filter(p => p.difficulty === diff);
      }

      if (phrases.length === 0) {
        return res.status(404).json({ message: "No phrases found for criteria" });
      }

      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      res.json(randomPhrase);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random phrase" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
