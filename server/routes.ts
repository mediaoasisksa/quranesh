import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPhraseSchema,
  insertExerciseSessionSchema,
  insertUserProgressSchema,
  insertDailyStatsSchema,
  insertQuestionBankSchema,
  insertPhilosophicalSentenceSchema,
  insertUserSchema,
  signupSchema,
  signinSchema,
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate JWT secret on startup
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET environment variable is required for authentication",
    );
  }

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
      const { userId } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
      }

      const sentence = await storage.getUnusedPhilosophicalSentence(userId);
      if (!sentence) {
        return res.status(404).json({ message: "No philosophical sentences available" });
      }

      res.json(sentence);
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

        console.log(`User ${userId} has completed ${completedPhraseIds.size} ${exerciseType} exercises`);
        
        // Filter out completed phrases
        phrases = phrases.filter((p) => !completedPhraseIds.has(p.id));
        
        console.log(`${phrases.length} new phrases available for ${exerciseType}`);
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

      // Use VISA/MASTER entity ID for ALL payment methods
      // HyperPay widget will show MADA, VISA, and MASTER options
      // Note: This requires the VISA/MASTER entity ID to be configured for all card types
      const entityId = HYPERPAY_CONFIG.entityIdVisaMaster;
      
      console.log("=== USING UNIVERSAL ENTITY ID ===");
      console.log("Entity ID (VISA/MASTER):", entityId);
      console.log("This entity ID should support MADA, VISA, and MASTER");
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
      console.log("Payment method:", paymentMethod);
      console.log("Entity ID being used:", entityId);
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

  // AI-powered answer validation
  app.post("/api/validate-answer", async (req, res) => {
    try {
      const { userAnswer, exerciseType, phraseId, questionBankId, philosophicalSentenceId } = req.body;

      if (!userAnswer || !exerciseType) {
        return res.status(400).json({
          error: "Missing required fields: userAnswer, exerciseType",
        });
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
      console.log("Phrase Data:", phraseData);
      console.log("==========================");

      // Use AI to validate the answer
      const result = await validateExerciseAnswer(
        userAnswer,
        exerciseType,
        phraseData,
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

  const httpServer = createServer(app);
  return httpServer;
}
