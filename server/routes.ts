import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhraseSchema, insertExerciseSessionSchema, insertUserProgressSchema, insertDailyStatsSchema, insertQuestionBankSchema, insertUserSchema, signupSchema, signinSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { phrasesData } from "../client/src/lib/phrases-data";
import { generateQuestionBanksWithPhraseIds } from "../client/src/lib/question-phrase-mapping";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Validate JWT secret on startup
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required for authentication");
  }
  
  // Initialize with phrase data and question banks
  (async () => {
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
  })();

  // Authentication routes
  app.post("/api/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
      
      // Create user with hashed password (map to database schema)
      const userData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
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
        user: userResponse 
      });
    } catch (error) {
      // Handle database unique constraint errors
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      // Handle validation errors
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: error.message });
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
      const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token (JWT_SECRET is validated at startup)
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      
      // Remove password hash from response
      const { passwordHash: _, ...userResponse } = user;
      
      res.json({
        message: "Login successful",
        token,
        tokenType: "Bearer",
        expiresIn: "24h",
        user: userResponse
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid email or password format" });
      }
      
      res.status(500).json({ message: "Login failed" });
    }
  });

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

  // Question bank routes
  app.get("/api/question-banks", async (req, res) => {
    try {
      const { category, theme, tags } = req.query;
      
      let questionBanks;
      
      if (category && typeof category === 'string') {
        questionBanks = await storage.getQuestionBanksByCategory(category);
      } else if (theme && typeof theme === 'string') {
        questionBanks = await storage.getQuestionBanksByTheme(theme);
      } else if (tags && typeof tags === 'string') {
        const tagArray = tags.split(',').map(tag => tag.trim());
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
      
      if (category && typeof category === 'string') {
        questionBanks = questionBanks.filter(qb => qb.category === category);
      }
      
      if (difficulty && typeof difficulty === 'string') {
        const diff = parseInt(difficulty);
        questionBanks = questionBanks.filter(qb => qb.difficulty === diff);
      }

      if (questionBanks.length === 0) {
        return res.status(404).json({ message: "No question banks found for criteria" });
      }

      const randomQuestionBank = questionBanks[Math.floor(Math.random() * questionBanks.length)];
      
      // Get the associated phrases for this question bank
      const allPhrases = await storage.getAllPhrases();
      const associatedPhrases = allPhrases.filter(phrase => 
        randomQuestionBank.correctPhraseIds.includes(phrase.id)
      );
      
      res.json({
        ...randomQuestionBank,
        associatedPhrases
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random question bank" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
