import axios from "axios";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyArY6r6fVZEaUIBNZD8_fRzRnjuGJ-TxKE";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface AIValidationResult {
  isCorrect: boolean;
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
  confidence: number; // 0-1
}

export async function validateArabicAnswer(
  userAnswer: string,
  exerciseType: string,
  context: string,
  expectedAnswer?: string,
): Promise<AIValidationResult> {
  try {
    console.log("=== GEMINI AI VALIDATION ===");
    console.log("API Key present:", !!GEMINI_API_KEY);
    console.log("API URL:", GEMINI_API_URL);
    console.log("User Answer:", userAnswer);
    console.log("Exercise Type:", exerciseType);
    console.log("Context:", context);

    const prompt = createValidationPrompt(
      userAnswer,
      exerciseType,
      context,
      expectedAnswer,
    );
    console.log("Generated Prompt:", prompt.substring(0, 200) + "...");

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 40,
      },
    });

    console.log("Gemini Response Status:", response.status);
    console.log("Gemini Response:", JSON.stringify(response.data, null, 2));

    const candidate = response.data.candidates[0];

    // Check if the response was cut off due to token limits
    if (candidate.finishReason === "MAX_TOKENS") {
      console.log(
        "Response was cut off due to token limits, using fallback validation",
      );
      return fallbackValidation(userAnswer, exerciseType, context);
    }

    // Check if there's content and text
    if (
      !candidate.content ||
      !candidate.content.parts ||
      !candidate.content.parts[0] ||
      !candidate.content.parts[0].text
    ) {
      console.log("No valid content in response, using fallback validation");
      return fallbackValidation(userAnswer, exerciseType, context);
    }

    const result = candidate.content.parts[0].text;
    console.log("Parsed Result:", result);

    const parsedResult = parseAIResponse(result);
    console.log("Final Validation Result:", parsedResult);

    return parsedResult;
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    console.log("Falling back to basic validation...");
    // Fallback to basic validation
    return fallbackValidation(userAnswer, exerciseType, context);
  }
}

function createValidationPrompt(
  userAnswer: string,
  exerciseType: string,
  context: string,
  expectedAnswer?: string,
): string {
  let specificInstructions = "";

  // Provide specific instructions based on exercise type
  switch (exerciseType) {
    case "substitution":
      specificInstructions = `This is a SUBSTITUTION exercise. The student must replace a word in the given phrase with another Quranic attribute.
      - The answer should be a complete phrase with the substituted word
      - The substituted word should be a valid Quranic attribute (like غفور، رحيم، عزيز، حكيم، etc.)
      - The phrase should maintain proper Arabic grammar
      - Example: If given "والله غفور رحيم" and asked to replace "رحيم", a good answer would be "والله غفور عزيز"`;
      break;
    case "conversation":
      specificInstructions = `This is a CONVERSATION exercise. The student must translate an English phrase into Arabic.
              - The answer should be a complete Arabic translation of the given English phrase
              - Should include all key concepts from the English text
              - Should use appropriate Arabic vocabulary and grammar
              - Should be a natural, complete sentence in Arabic
              - Example: If asked to translate "God is watching everything you do", a good answer would include الله (God), يرى/يشاهد (watching), كل (everything), and تفعل (do)`;
      break;
    case "completion":
      specificInstructions = `This is a COMPLETION exercise. The student must complete a Quranic verse or phrase.
      - The completion should be grammatically correct
      - Should use appropriate Quranic vocabulary
      - Should complete the meaning properly`;
      break;
    case "comparison":
      specificInstructions = `This is a COMPARISON exercise. The student must explain differences between similar concepts.
      - Should provide clear explanations in Arabic
      - Should show understanding of subtle differences
      - Should use appropriate Islamic terminology`;
      break;
    case "roleplay":
      specificInstructions = `This is a ROLEPLAY exercise. The student must apply Quranic wisdom to real situations.
      - The answer should be a genuine Quranic verse or authentic Islamic text
      - Should be contextually appropriate for the given scenario (consoling a hopeless friend)
      - Should offer hope, comfort, or encouragement as required by the scenario
      - Should demonstrate practical application of Islamic knowledge
      - Must be in Arabic and contain Quranic language patterns
      - Should be relevant to providing comfort and hope to someone in distress`;
      break;
    case "transformation":
      specificInstructions = `This is a TRANSFORMATION exercise. The student must convert statements to questions.
      - The answer should be a proper Arabic question format
      - Should use appropriate Arabic question words (هل، ما، من، متى، أين، كيف، لماذا)
      - Should maintain the original meaning and key concepts from the statement
      - Should follow proper Arabic question structure with question mark (؟)
      - Example: If given "إِنَّ اللَّهَ غَنِيٌّ حَمِيدٌ" (Indeed, Allah is Free of need and Praiseworthy), a good answer would be "هَلْ اللَّهُ غَنِيٌّ حَمِيدٌ؟" (Is Allah Free of need and Praiseworthy?)`;
      break;
    case "thematic":
      specificInstructions = `This is a THEMATIC exercise. The student must find relevant Quranic verses for life situations.
      - Should provide verses that are contextually appropriate
      - Should demonstrate understanding of the theme
      - Should use authentic Quranic text`;
      break;
    default:
      specificInstructions = `Evaluate this Arabic exercise answer for accuracy and relevance.`;
  }

  const basePrompt = `You are an expert Arabic teacher specializing in Quranic Arabic. 
Evaluate this student's answer for an Arabic language exercise.

Exercise Type: ${exerciseType}
Context/Question: ${context}
Student Answer: "${userAnswer}"
${expectedAnswer ? `Expected Answer: ${expectedAnswer}` : ""}

${specificInstructions}

Please evaluate the answer considering:
1. Arabic language accuracy and grammar
2. Relevance to the specific exercise context
3. Proper use of Quranic vocabulary and concepts
4. Alternative correct answers that would also be acceptable
5. Partial credit for partially correct answers
6. Whether the answer directly addresses what was asked

Respond ONLY with a JSON object in this exact format:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "string (helpful feedback in English explaining why correct/incorrect)",
  "suggestions": ["string array of specific improvement suggestions"],
  "confidence": number (0-1)
}`;

  return basePrompt;
}

function parseAIResponse(response: string): AIValidationResult {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      isCorrect: parsed.isCorrect || false,
      score: Math.max(0, Math.min(100, parsed.score || 0)),
      feedback: parsed.feedback || "No feedback provided",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      isCorrect: false,
      score: 0,
      feedback: "Unable to evaluate answer. Please try again.",
      suggestions: ["Check your Arabic spelling and grammar"],
      confidence: 0,
    };
  }
}

function fallbackValidation(
  userAnswer: string,
  exerciseType: string,
  context: string = "",
): AIValidationResult {
  console.log("=== FALLBACK VALIDATION DEBUG ===");
  console.log("Exercise Type:", exerciseType);
  console.log("User Answer:", userAnswer);
  console.log("Context:", context);
  console.log("================================");

  // Basic fallback validation with exercise-specific checks
  const hasArabic = /[\u0600-\u06FF]/.test(userAnswer);
  const hasContent = userAnswer.trim().length > 2;

  let exerciseSpecificFeedback = "";
  let suggestions: string[] = [];

  switch (exerciseType) {
    case "substitution":
      // For substitution, check if the answer is a complete phrase with Quranic attributes
      const hasQuranicAttribute =
        /(غفور|رحيم|عزيز|حكيم|كريم|عليم|حليم|شكور|صبور|ودود|مجيد|عظيم|قدير|سميع|بصير|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم|ودود|شكور|صبور|حليم|كريم|عظيم|مجيد|قدير|سميع|بصير|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم)/.test(
          userAnswer,
        );
      const isCompletePhrase =
        userAnswer.includes("الله") || userAnswer.includes("اللَّهُ");

      if (hasQuranicAttribute && isCompletePhrase) {
        exerciseSpecificFeedback =
          "Excellent substitution! Well done on using proper Quranic vocabulary.";
        suggestions = [
          "Perfect! You correctly substituted with a valid Quranic attribute",
          "Great job maintaining proper Arabic grammar",
        ];
      } else if (hasQuranicAttribute) {
        exerciseSpecificFeedback =
          'You used a Quranic attribute, but try to provide a complete phrase like "والله غفور عزيز"';
        suggestions = [
          'Complete the phrase with "والله" or similar',
          "Make sure to include the full context",
        ];
      } else {
        exerciseSpecificFeedback =
          "Incorrect! For substitution exercises, replace a word with another Quranic attribute (like غفور، رحيم، عزيز، حكيم)";
        suggestions = [
          "Use valid Quranic attributes",
          "Try: والله غفور عزيز",
          "Complete the phrase properly",
        ];
      }
      break;
    case "conversation":
      // For conversation exercises, check if the answer is a Quranic verse that is semantically related to the English prompt
      const englishContext = context.toLowerCase();
      const userAnswerLower = userAnswer.toLowerCase();

      // Check if the answer contains Quranic verse patterns
      const hasQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|بصير|سميع|عليم|حكيم|عزيز|قدير|غفور|رحيم|عظيم|مجيد|ودود|شكور|صبور|حليم|كريم|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم|ودود|شكور|صبور|حليم|كريم|عظيم|مجيد|قدير|سميع|بصير|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم)/.test(
          userAnswer,
        );

      // Check for semantic relevance - look for key concepts that relate to the English prompt
      let semanticRelevance = 0;
      let totalConcepts = 0;

      console.log("=== CONVERSATION SEMANTIC DEBUG ===");
      console.log("English Context:", englishContext);
      console.log("User Answer:", userAnswer);

      // Check for God/Allah references
      if (englishContext.includes("god") || englishContext.includes("allah")) {
        totalConcepts++;
        console.log("Found Allah/God in context, checking user answer...");
        if (
          userAnswer.includes("الله") ||
          userAnswer.includes("اللَّهُ") ||
          userAnswer.includes("الله") ||
          userAnswer.includes("رب")
        ) {
          semanticRelevance++;
          console.log("Found Allah in user answer!");
        }
      }

      // Check for watching/seeing/observing concepts
      if (
        englishContext.includes("watching") ||
        englishContext.includes("see") ||
        englishContext.includes("observe") ||
        englishContext.includes("watch")
      ) {
        totalConcepts++;
        if (
          userAnswer.includes("يرى") ||
          userAnswer.includes("يشاهد") ||
          userAnswer.includes("ينظر") ||
          userAnswer.includes("يراقب") ||
          userAnswer.includes("بصير") ||
          userAnswer.includes("سميع")
        ) {
          semanticRelevance++;
        }
      }

      // Check for "everything" or "all" concepts
      if (
        englishContext.includes("everything") ||
        englishContext.includes("all") ||
        englishContext.includes("each") ||
        englishContext.includes("every")
      ) {
        totalConcepts++;
        if (
          userAnswer.includes("كل") ||
          userAnswer.includes("جميع") ||
          userAnswer.includes("كُلَّ") ||
          userAnswer.includes("ما") ||
          userAnswer.includes("بما")
        ) {
          semanticRelevance++;
        }
      }

      // Check for "do/doing" concepts
      if (
        englishContext.includes("do") ||
        englishContext.includes("doing") ||
        englishContext.includes("work") ||
        englishContext.includes("action")
      ) {
        totalConcepts++;
        if (
          userAnswer.includes("تفعل") ||
          userAnswer.includes("تعمل") ||
          userAnswer.includes("تأتي") ||
          userAnswer.includes("تعملون") ||
          userAnswer.includes("تفعلون")
        ) {
          semanticRelevance++;
        }
      }

      // Check for love/care concepts
      if (
        englishContext.includes("love") ||
        englishContext.includes("care") ||
        englishContext.includes("loves")
      ) {
        totalConcepts++;
        if (
          userAnswer.includes("يحب") ||
          userAnswer.includes("يحبون") ||
          userAnswer.includes("محسنين") ||
          userAnswer.includes("رحيم")
        ) {
          semanticRelevance++;
        }
      }

      // Check for good/righteous concepts
      if (
        englishContext.includes("good") ||
        englishContext.includes("righteous") ||
        englishContext.includes("virtuous") ||
        englishContext.includes("pious")
      ) {
        totalConcepts++;
        if (
          userAnswer.includes("محسن") ||
          userAnswer.includes("محسنين") ||
          userAnswer.includes("صالح") ||
          userAnswer.includes("صالحين") ||
          userAnswer.includes("تقوى") ||
          userAnswer.includes("تقوى")
        ) {
          semanticRelevance++;
        }
      }

      // Check for divine attributes (more comprehensive)
      if (englishContext.includes("allah") || englishContext.includes("god")) {
        totalConcepts++;
        if (
          userAnswer.includes("الله") ||
          userAnswer.includes("اللَّهُ") ||
          userAnswer.includes("رب") ||
          userAnswer.includes("رحيم") ||
          userAnswer.includes("غفور") ||
          userAnswer.includes("عزيز") ||
          userAnswer.includes("حكيم") ||
          userAnswer.includes("بصير") ||
          userAnswer.includes("سميع") ||
          userAnswer.includes("عليم")
        ) {
          semanticRelevance++;
        }
      }

      // Calculate relevance percentage - be more lenient
      const relevancePercentage =
        totalConcepts > 0 ? semanticRelevance / totalConcepts : 0;

      console.log("Semantic Relevance:", semanticRelevance);
      console.log("Total Concepts:", totalConcepts);
      console.log("Relevance Percentage:", relevancePercentage);
      console.log("Has Quranic Pattern:", hasQuranicPattern);
      console.log(
        "Will be correct:",
        hasQuranicPattern && relevancePercentage >= 0.3,
      );
      console.log("================================");

      if (hasQuranicPattern && relevancePercentage >= 0.3) {
        exerciseSpecificFeedback =
          "Excellent! You provided a relevant Quranic verse that captures the meaning of the English prompt.";
        suggestions = [
          "Perfect! This is a valid Quranic verse",
          "Great job finding a verse that relates to the prompt",
          "Well done on the semantic connection",
        ];
      } else if (hasQuranicPattern && relevancePercentage > 0) {
        exerciseSpecificFeedback =
          "Good! You provided a Quranic verse, but try to find one that more closely relates to the English prompt.";
        suggestions = [
          "This is a Quranic verse, but look for one more relevant to the prompt",
          "Try to match the key concepts better",
          "Consider verses that directly address the same theme",
        ];
      } else if (hasQuranicPattern) {
        exerciseSpecificFeedback =
          "You provided a Quranic verse, but it doesn't seem to relate to the English prompt. Try to find a verse that matches the meaning.";
        suggestions = [
          "This is a Quranic verse, but find one related to the prompt",
          "Look for verses about the same topic",
          "Make sure the verse addresses the same concepts",
        ];
      } else {
        exerciseSpecificFeedback =
          "Incorrect! For conversation exercises, provide a Quranic verse that relates to the English prompt.";
        suggestions = [
          "Use an authentic Quranic verse",
          "Make sure it relates to the English prompt",
          'Example: For "God is watching" use verses like "وَاللَّهُ بَصِيرٌ بِمَا تَعْمَلُونَ"',
        ];
      }
      break;
    case "completion":
      exerciseSpecificFeedback =
        "For completion exercises, finish the verse or phrase correctly";
      suggestions = [
        "Use appropriate Quranic vocabulary",
        "Complete the meaning",
        "Check grammar",
      ];
      break;
    case "roleplay":
      // Check for Quranic patterns and comfort-related words
      const hasRoleplayQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل)/.test(
          userAnswer,
        );
      const hasComfortWords =
        /(رحمة|صبر|فرج|أمل|يسر|نجاة|عون|توكل|ثقة|طمأنينة)/.test(userAnswer);

      if (hasRoleplayQuranicPattern && hasComfortWords) {
        exerciseSpecificFeedback =
          "Good attempt! This appears to contain Quranic language and comfort themes.";
        suggestions = [
          "Verify this is an authentic Quranic verse",
          "Ensure it addresses the scenario of consoling someone hopeless",
        ];
      } else if (hasRoleplayQuranicPattern) {
        exerciseSpecificFeedback =
          "This has Quranic patterns, but may not be appropriate for consoling someone who feels hopeless.";
        suggestions = [
          "Use verses about hope and comfort",
          'Try verses like "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" or "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"',
        ];
      } else {
        exerciseSpecificFeedback =
          "Incorrect! For roleplay exercises, use an authentic Quranic verse that provides comfort and hope.";
        suggestions = [
          "Use a genuine Quranic verse",
          "Choose verses about mercy, hope, and relief",
          'Example: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" (Indeed, with hardship comes ease)',
        ];
      }
      break;
    case "transformation":
      // Check if the answer is a proper question format
      const hasQuestionWords = /(هل|ما|من|متى|أين|كيف|لماذا|أم|أليس|أو)/.test(
        userAnswer,
      );
      const hasQuestionMark =
        userAnswer.includes("؟") || userAnswer.includes("?");
      const isQuestionFormat = hasQuestionWords || hasQuestionMark;

      // Check if the question is relevant to the original statement
      let isRelevantToStatement = false;
      if (context) {
        // Extract key concepts from the original statement
        const originalStatement = context.toLowerCase();
        const userQuestion = userAnswer.toLowerCase();

        // Check for key concepts that should be preserved in the question
        const keyConcepts = [];

        if (
          originalStatement.includes("الله") ||
          originalStatement.includes("الله")
        ) {
          keyConcepts.push("الله");
        }
        if (
          originalStatement.includes("يحب") ||
          originalStatement.includes("يحب")
        ) {
          keyConcepts.push("يحب");
        }
        if (
          originalStatement.includes("ظالم") ||
          originalStatement.includes("ظالم")
        ) {
          keyConcepts.push("ظالم");
        }
        if (
          originalStatement.includes("غني") ||
          originalStatement.includes("غني")
        ) {
          keyConcepts.push("غني");
        }
        if (
          originalStatement.includes("حميد") ||
          originalStatement.includes("حميد")
        ) {
          keyConcepts.push("حميد");
        }

        // Check if the question contains at least 50% of the key concepts
        let matchingConcepts = 0;
        keyConcepts.forEach((concept) => {
          if (userQuestion.includes(concept)) {
            matchingConcepts++;
          }
        });

        isRelevantToStatement =
          keyConcepts.length > 0 &&
          matchingConcepts / keyConcepts.length >= 0.5;
      }

      if (
        isQuestionFormat &&
        hasArabic &&
        hasContent &&
        isRelevantToStatement
      ) {
        exerciseSpecificFeedback =
          "Excellent! You successfully converted the statement to a relevant question.";
        suggestions = [
          "Perfect question format!",
          "Good use of Arabic question structure",
          "Great job maintaining the original meaning",
        ];
      } else if (
        isQuestionFormat &&
        hasArabic &&
        hasContent &&
        !isRelevantToStatement
      ) {
        exerciseSpecificFeedback =
          "You created a question, but it should be related to the original statement.";
        suggestions = [
          "Make sure your question is about the same topic as the original statement",
          "Include key concepts from the original text",
          "Example: If the statement is about Allah, your question should also be about Allah",
        ];
      } else if (hasArabic && hasContent) {
        exerciseSpecificFeedback =
          "You provided Arabic text, but it needs to be in question format.";
        suggestions = [
          "Add question words like هل، ما، من، متى، أين، كيف",
          "End with a question mark (؟)",
          "Example: هل الله غني حميد؟",
        ];
      } else {
        exerciseSpecificFeedback =
          "Incorrect! For transformation exercises, convert the statement to a question format.";
        suggestions = [
          "Use question words like هل، ما، من، متى، أين، كيف",
          "End with a question mark (؟)",
          "Example: هل الله غني حميد؟",
        ];
      }
      break;
    case "thematic":
      // For thematic exercises, check if the answer contains Quranic verses and relates to the theme
      const hasThematicQuranicPattern =
        /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل|غفران|عفو|مغفرة|رحمة|عفو|غفر|توبة|توب|استغفار)/.test(
          userAnswer,
        );
      const hasThemeKeywords = context
        ? context
            .toLowerCase()
            .split(/[,\s]+/)
            .some((keyword) =>
              userAnswer.toLowerCase().includes(keyword.toLowerCase()),
            )
        : false;

      if (hasThematicQuranicPattern && hasThemeKeywords) {
        exerciseSpecificFeedback =
          "Excellent! You provided a relevant Quranic verse that matches the theme.";
        suggestions = [
          "Perfect thematic choice!",
          "Great understanding of the context",
          "Well done on finding an appropriate verse",
        ];
      } else if (hasThematicQuranicPattern) {
        exerciseSpecificFeedback =
          "You provided a Quranic verse, but make sure it relates to the specific theme.";
        suggestions = [
          "Choose a verse that directly relates to the theme",
          "Consider verses about mercy, forgiveness, patience, etc.",
          "Make sure the verse addresses the specific situation",
        ];
      } else if (hasThemeKeywords) {
        exerciseSpecificFeedback =
          "Your answer relates to the theme, but try to provide an actual Quranic verse.";
        suggestions = [
          "Use authentic Quranic text",
          'Start with "إن الله" or similar Quranic phrases',
          "Look for verses that contain the theme keywords",
        ];
      } else {
        exerciseSpecificFeedback =
          "For thematic exercises, provide a Quranic verse that relates to the given theme.";
        suggestions = [
          "Use authentic Quranic text",
          "Choose verses about mercy, forgiveness, patience, etc.",
          "Make sure the verse addresses the specific situation",
        ];
      }
      break;
    default:
      exerciseSpecificFeedback =
        "Provide a contextually appropriate Arabic answer";
      suggestions = [
        "Use proper Arabic",
        "Address the specific question",
        "Check relevance",
      ];
  }

  // For different exercise types, check if it's actually correct
  let isActuallyCorrect = hasArabic && hasContent;

  if (exerciseType === "substitution") {
    console.log("=== SUBSTITUTION VALIDATION START ===");
    console.log("Original phrase (context):", context);
    console.log("User Answer:", userAnswer);

    // Normalize both strings for comparison (remove diacritics and extra whitespace)
    const normalizeArabic = (text: string) => {
      return text
        .replace(/[\u064B-\u065F\u0670]/g, "") // Remove diacritics
        .replace(/[ٱأإآ]/g, "ا") // Normalize alef variants
        .replace(/[ى]/g, "ي") // Normalize ya
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
        .toLowerCase();
    };

    const normalizedOriginal = normalizeArabic(context);
    const normalizedAnswer = normalizeArabic(userAnswer);

    console.log("Normalized Original:", normalizedOriginal);
    console.log("Normalized Answer:", normalizedAnswer);

    // Split into words/tokens
    const originalTokens = normalizedOriginal.split(/\s+/);
    const answerTokens = normalizedAnswer.split(/\s+/);

    console.log("Original Tokens:", originalTokens);
    console.log("Answer Tokens:", answerTokens);

    // Check if the answer has similar length (allowing some flexibility)
    const lengthRatio = answerTokens.length / originalTokens.length;
    const hasCorrectLength = lengthRatio >= 0.7 && lengthRatio <= 1.3;

    console.log("Length ratio:", lengthRatio, "Valid:", hasCorrectLength);

    // Compare tokens directly from the original phrase
    // In substitution drill, students should keep most tokens and only change 1-2 words
    
    // Check how many original tokens are preserved (in order)
    let matchedTokens = 0;
    let totalTokensToMatch = originalTokens.length;
    
    // For each original token, check if it appears in the answer in roughly the same position
    for (let i = 0; i < originalTokens.length; i++) {
      const originalToken = originalTokens[i];
      
      // Check if this token exists in the answer (allowing some position flexibility)
      const foundIndex = answerTokens.indexOf(originalToken);
      
      if (foundIndex !== -1) {
        // Token found - check if position is roughly similar (within 2 positions)
        const positionDiff = Math.abs(i - foundIndex);
        if (positionDiff <= 2) {
          matchedTokens++;
        }
      }
    }

    // Calculate structure preservation rate based on how many original tokens are kept
    // For substitution drill, we expect 60-90% of tokens to be identical
    const structurePreservationRate = totalTokensToMatch > 0 
      ? matchedTokens / totalTokensToMatch 
      : 0;

    console.log(
      "Structure preservation:",
      matchedTokens,
      "/",
      totalTokensToMatch,
      "=",
      structurePreservationRate,
    );

    // Check if substituted word is a valid Quranic attribute/noun
    const hasQuranicAttribute =
      /(غفور|رحيم|عزيز|حكيم|كريم|عليم|حليم|شكور|صبور|ودود|مجيد|عظيم|قدير|سميع|بصير|عالم|غفار|تواب|رحمن|خبير|حكيم|قوي|متين|لطيف|حفيظ|مقيت|حسيب|جليل|كريم|رقيب|مجيب|واسع|حكيم|ودود|مجيد|باعث|شهيد|حق|وكيل|قوي|متين|ولي|حميد|محصي|مبدئ|معيد|محيي|مميت|حي|قيوم|واجد|ماجد|واحد|احد|صمد|قادر|مقتدر|مقدم|مؤخر|اول|اخر|ظاهر|باطن|والي|متعال|بر|تواب|منتقم|عفو|رؤوف|مالك|ذو|جلال|اكرام|مقسط|جامع|غني|مغني|مانع|ضار|نافع|نور|هادي|بديع|باقي|وارث|رشيد|صبور|ظالمين|مسرفين|محسنين|مقسطين|متقين|صابرين|صادقين|متوكلين)/.test(
        userAnswer,
      );

    console.log("Has Quranic attribute:", hasQuranicAttribute);

    // Calculate relevance score (0-100)
    let relevanceScore = 0;

    // 50% for structure preservation (most important - need to keep most of the original)
    relevanceScore += structurePreservationRate * 50;

    // 30% for having valid Quranic attribute
    if (hasQuranicAttribute) {
      relevanceScore += 30;
    }

    // 20% for correct length
    if (hasCorrectLength) {
      relevanceScore += 20;
    }

    console.log("Relevance score:", relevanceScore);

    // Consider it correct if:
    // 1. Structure preservation is at least 50% (kept at least half the original tokens)
    // 2. AND overall relevance score is >= 60
    // 3. AND has a valid Quranic attribute (to ensure substitution is appropriate)
    const hasGoodStructure = structurePreservationRate >= 0.5;
    isActuallyCorrect = hasGoodStructure && hasQuranicAttribute && relevanceScore >= 60;

    console.log("Structure >= 50%:", hasGoodStructure, "Has Quranic attr:", hasQuranicAttribute, "Score >= 60:", relevanceScore >= 60);

    // Update feedback based on what's missing
    if (!isActuallyCorrect) {
      if (structurePreservationRate < 0.5) {
        exerciseSpecificFeedback =
          "You need to maintain the same grammatical structure as the original phrase. Keep most words and only substitute 1-2 words.";
        suggestions = [
          `Keep at least ${Math.ceil(originalTokens.length * 0.5)} of the ${originalTokens.length} original words`,
          "Only substitute the attribute, noun, or verb - not the entire phrase",
          `Your structure preservation: ${Math.round(structurePreservationRate * 100)}% (need at least 50%)`,
        ];
      } else if (!hasQuranicAttribute) {
        exerciseSpecificFeedback =
          "Your structure is good, but use a valid Quranic attribute or noun for the substitution.";
        suggestions = [
          "Use Quranic attributes like: المقسطين، المتقين، الصابرين، المحسنين",
          "Or divine attributes like: حكيم، خبير، عليم، بصير، سميع",
          "Make sure the substituted word fits grammatically",
        ];
      } else {
        exerciseSpecificFeedback = `Your answer is close but needs improvement. Relevance score: ${Math.round(relevanceScore)}% (need at least 60%)`;
        suggestions = [
          "Check the grammatical structure more carefully",
          "Ensure all key elements from the original are preserved",
          "Verify the substituted word is appropriate",
        ];
      }
    } else {
      exerciseSpecificFeedback =
        "Excellent substitution! You maintained the structure and used a valid Quranic term.";
      suggestions = [
        "Perfect structure preservation!",
        "Great choice of Quranic vocabulary",
        `Relevance score: ${Math.round(relevanceScore)}%`,
      ];
    }

    console.log("Final decision:", isActuallyCorrect);
    console.log("=========================================");
  } else if (exerciseType === "conversation") {
    // For conversation exercises, check if it's a Quranic verse with semantic relevance
    console.log("=== CONVERSATION VALIDATION START ===");
    console.log("Context (English prompt):", context);
    console.log("User Answer:", userAnswer);
    const englishContext = context.toLowerCase();
    console.log("English context (lowercase):", englishContext);

    // Check if the answer contains Quranic verse patterns
    const hasQuranicPattern =
      /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|بصير|سميع|عليم|حكيم|عزيز|قدير|غفور|رحيم|عظيم|مجيد|ودود|شكور|صبور|حليم|كريم|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم|ودود|شكور|صبور|حليم|كريم|عظيم|مجيد|قدير|سميع|بصير|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم)/.test(
        userAnswer,
      );

    // Check for semantic relevance
    let semanticRelevance = 0;
    let totalConcepts = 0;

    if (englishContext.includes("god") || englishContext.includes("allah")) {
      totalConcepts++;
      if (
        userAnswer.includes("الله") ||
        userAnswer.includes("اللَّهُ") ||
        userAnswer.includes("الله") ||
        userAnswer.includes("رب")
      ) {
        semanticRelevance++;
      }
    }

    if (
      englishContext.includes("watching") ||
      englishContext.includes("see") ||
      englishContext.includes("observe") ||
      englishContext.includes("watch")
    ) {
      totalConcepts++;
      if (
        userAnswer.includes("يرى") ||
        userAnswer.includes("يشاهد") ||
        userAnswer.includes("ينظر") ||
        userAnswer.includes("يراقب") ||
        userAnswer.includes("بصير") ||
        userAnswer.includes("سميع")
      ) {
        semanticRelevance++;
      }
    }

    if (
      englishContext.includes("everything") ||
      englishContext.includes("all") ||
      englishContext.includes("each") ||
      englishContext.includes("every")
    ) {
      totalConcepts++;
      if (
        userAnswer.includes("كل") ||
        userAnswer.includes("جميع") ||
        userAnswer.includes("كُلَّ") ||
        userAnswer.includes("ما") ||
        userAnswer.includes("بما")
      ) {
        semanticRelevance++;
      }
    }

    if (
      englishContext.includes("do") ||
      englishContext.includes("doing") ||
      englishContext.includes("work") ||
      englishContext.includes("action")
    ) {
      totalConcepts++;
      if (
        userAnswer.includes("تفعل") ||
        userAnswer.includes("تعمل") ||
        userAnswer.includes("تأتي") ||
        userAnswer.includes("تعملون") ||
        userAnswer.includes("تفعلون")
      ) {
        semanticRelevance++;
      }
    }

    if (
      englishContext.includes("love") ||
      englishContext.includes("care") ||
      englishContext.includes("loves")
    ) {
      totalConcepts++;
      if (
        userAnswer.includes("يحب") ||
        userAnswer.includes("يحبون") ||
        userAnswer.includes("محسنين") ||
        userAnswer.includes("رحيم")
      ) {
        semanticRelevance++;
      }
    }

    const relevancePercentage =
      totalConcepts > 0 ? semanticRelevance / totalConcepts : 0;

    console.log("=== CONVERSATION EXERCISE VALIDATION ===");
    console.log("Has Quranic Pattern:", hasQuranicPattern);
    console.log("Total Concepts:", totalConcepts);
    console.log("Semantic Relevance:", semanticRelevance);
    console.log("Relevance Percentage:", relevancePercentage);
    console.log("========================================");

    // Consider it correct if it's a Quranic verse with at least 50% semantic relevance (stricter)
    isActuallyCorrect =
      hasArabic &&
      hasContent &&
      hasQuranicPattern &&
      relevancePercentage >= 0.5;
    
    // Update feedback based on validation
    if (!isActuallyCorrect) {
      if (relevancePercentage < 0.5 && relevancePercentage > 0) {
        exerciseSpecificFeedback = `Your answer contains some relevant concepts but doesn't fully match the English prompt. The answer should include key concepts like the ones mentioned in the English phrase.`;
        suggestions = [
          "Include ALL key concepts from the English prompt",
          "Make sure your Arabic answer captures the complete meaning",
          `Your answer matched only ${Math.round(relevancePercentage * 100)}% of the required concepts (need at least 50%)`,
        ];
      } else if (!hasQuranicPattern) {
        exerciseSpecificFeedback = "Your answer doesn't appear to be a Quranic verse or proper Arabic phrase.";
        suggestions = [
          "Use authentic Quranic verses or proper Arabic phrases",
          "Include Quranic vocabulary and patterns",
        ];
      } else {
        exerciseSpecificFeedback = "Your answer doesn't match the English prompt. Make sure to include all key concepts.";
        suggestions = [
          "Read the English prompt carefully",
          "Include all required concepts in your Arabic answer",
        ];
      }
    }
  } else if (exerciseType === "roleplay") {
    // For roleplay exercises, check for Quranic patterns and comfort words
    const hasRoleplayQuranicPattern =
      /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل)/.test(
        userAnswer,
      );
    const hasComfortWords =
      /(رحمة|صبر|فرج|أمل|يسر|نجاة|عون|توكل|ثقة|طمأنينة)/.test(userAnswer);

    // Consider it correct if it has Arabic content AND either Quranic patterns OR comfort-related words
    isActuallyCorrect =
      hasArabic && hasContent && (hasRoleplayQuranicPattern || hasComfortWords);
  } else if (exerciseType === "transformation") {
    // For transformation exercises, check if the answer is a proper question format
    const hasQuestionWords = /(هل|ما|من|متى|أين|كيف|لماذا|أم|أليس|أو)/.test(
      userAnswer,
    );
    const hasQuestionMark =
      userAnswer.includes("؟") || userAnswer.includes("?");
    // Consider it a question format if it has question words OR question mark OR starts with هل
    const isQuestionFormat =
      hasQuestionWords || hasQuestionMark || userAnswer.trim().startsWith("هل");

    // Check if the question is relevant to the original statement
    let isRelevantToStatement = false;
    if (context) {
      // Normalize Arabic text by removing diacritics
      const normalizeArabic = (text: string): string => {
        return text
          .replace(/[\u064B-\u065F\u0670]/g, "") // Remove all diacritics
          .replace(/[ًٌٍَُِّْ]/g, "")
          .replace(/أ|إ|آ/g, "ا") // Normalize alef variants
          .replace(/ى/g, "ي") // Normalize ya variants
          .trim();
      };

      const normalizedStatement = normalizeArabic(context);
      const normalizedQuestion = normalizeArabic(userAnswer);

      // Extract ALL meaningful words from the original statement (excluding short connecting words)
      const stopWords = ["و", "ف", "ب", "ل", "ك", "من", "في", "على", "الى", "إلى", "عن", "ما", "لا", "إن", "أن", "إذا", "لم", "لن", "قد"];
      const statementWords = normalizedStatement
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.includes(word))
        .filter(word => /[\u0600-\u06FF]/.test(word)); // Must contain Arabic characters

      console.log("=== KEY CONCEPTS DEBUG ===");
      console.log("Original Statement:", context);
      console.log("Normalized Statement:", normalizedStatement);
      console.log("User Question:", userAnswer);
      console.log("Normalized Question:", normalizedQuestion);
      console.log("Statement Words (Key Concepts):", statementWords);

      // Check if the question contains at least 50% of the key concepts from the statement
      let matchingConcepts = 0;
      statementWords.forEach((word) => {
        if (normalizedQuestion.includes(word)) {
          matchingConcepts++;
          console.log(`✓ Matched word: ${word}`);
        } else {
          console.log(`✗ Missed word: ${word}`);
        }
      });

      const matchPercentage = statementWords.length > 0 
        ? (matchingConcepts / statementWords.length) * 100 
        : 0;

      console.log(
        `Matching: ${matchingConcepts}/${statementWords.length} (${matchPercentage.toFixed(1)}%)`,
      );

      // Require at least 50% of the original statement's key words to be present in the question
      isRelevantToStatement = statementWords.length > 0 && matchingConcepts / statementWords.length >= 0.5;
      console.log("Is Relevant:", isRelevantToStatement);
      console.log("========================");
    }

    console.log("=== TRANSFORMATION VALIDATION DEBUG ===");
    console.log("User Answer:", userAnswer);
    console.log("Has Arabic:", hasArabic);
    console.log("Has Content:", hasContent);
    console.log("Has Question Words:", hasQuestionWords);
    console.log("Has Question Mark:", hasQuestionMark);
    console.log("Is Question Format:", isQuestionFormat);
    console.log("Is Relevant to Statement:", isRelevantToStatement);
    console.log("Context:", context);
    console.log(
      "Will be correct:",
      hasArabic && hasContent && isQuestionFormat && isRelevantToStatement,
    );
    console.log("=====================================");

    // Consider it correct if it has Arabic content AND is in question format AND is relevant to the original statement
    isActuallyCorrect = hasArabic && hasContent && isQuestionFormat && isRelevantToStatement;
  } else if (exerciseType === "thematic") {
    // For thematic exercises, check if the answer contains Quranic verses and relates to the theme
    const hasThematicQuranicPattern =
      /(إن|إنا|فإن|والله|يا|رب|الله|الرحمن|الرحيم|العسر|اليسر|رحمة|صبر|فرج|أمل|غفران|عفو|مغفرة|رحمة|عفو|غفر|توبة|توب|استغفار)/.test(
        userAnswer,
      );

    console.log("=== THEMATIC VALIDATION DEBUG ===");
    console.log("User Answer:", userAnswer);
    console.log("Context:", context);
    console.log("Has Quranic Pattern:", hasThematicQuranicPattern);

    const contextWords = context
      ? context
          .toLowerCase()
          .split(/[,\s]+/)
          .filter((w) => w.trim().length > 2)
      : [];
    console.log("Context Words:", contextWords);

    const hasThemeKeywords = contextWords.some((keyword) => {
      const result = userAnswer.toLowerCase().includes(keyword);
      console.log(`Checking "${keyword}": ${result}`);
      return result;
    });

    console.log("Has Theme Keywords:", hasThemeKeywords);
    console.log("Has Arabic:", hasArabic);
    console.log("Has Content:", hasContent);
    console.log(
      "Will be correct:",
      hasArabic && hasContent && hasThematicQuranicPattern && hasThemeKeywords,
    );
    console.log("================================");

    // Consider it correct if it has Arabic content AND either Quranic patterns OR theme relevance
    isActuallyCorrect =
      hasArabic &&
      hasContent &&
      (hasThematicQuranicPattern || hasThemeKeywords);
  } else if (exerciseType === "completion") {
    // For completion exercises, any Arabic answer that makes sense is acceptable
    isActuallyCorrect = hasArabic && hasContent;
  }

  // For transformation exercises, ensure feedback matches the final validation result
  let finalFeedback = exerciseSpecificFeedback;
  if (exerciseType === "transformation") {
    if (isActuallyCorrect) {
      finalFeedback =
        "Excellent! You successfully converted the statement to a relevant question.";
    } else {
      // Use the specific feedback from the switch statement logic
      const hasQuestionWords = /(هل|ما|من|متى|أين|كيف|لماذا|أم|أليس|أو)/.test(
        userAnswer,
      );
      const hasQuestionMark =
        userAnswer.includes("؟") || userAnswer.includes("?");
      const isQuestionFormat =
        hasQuestionWords ||
        hasQuestionMark ||
        userAnswer.trim().startsWith("هل");

      if (isQuestionFormat && hasArabic && hasContent) {
        // It's a question but not relevant
        finalFeedback =
          "You created a question, but it should be related to the original statement.";
      } else if (hasArabic && hasContent) {
        // It's Arabic but not a question
        finalFeedback =
          "You provided Arabic text, but it needs to be in question format.";
      } else {
        // Not Arabic or too short
        finalFeedback =
          "Incorrect! For transformation exercises, convert the statement to a question format.";
      }
    }
  }

  // Determine final feedback message
  let completeFeedback = finalFeedback;
  if (!isActuallyCorrect && !hasArabic) {
    // Only add "Please provide an answer in Arabic" if there's NO Arabic at all
    completeFeedback = `Please provide an answer in Arabic. ${finalFeedback}`;
  } else if (!isActuallyCorrect) {
    // If there IS Arabic but it's wrong, use the specific feedback directly
    completeFeedback = finalFeedback;
  }

  return {
    isCorrect: isActuallyCorrect,
    score: isActuallyCorrect ? 60 : 20,
    feedback: completeFeedback,
    suggestions,
    confidence: 0.3,
  };
}

// Additional helper function for exercise-specific validation
export async function validateExerciseAnswer(
  userAnswer: string,
  exerciseType: string,
  phraseData: any,
): Promise<AIValidationResult> {
  // For conversation exercises, use English translation as context (what user needs to translate)
  // For other exercises, use Arabic text as context
  let context = "";
  let expectedAnswer = "";

  if (exerciseType === "conversation") {
    context = phraseData?.englishTranslation || phraseData?.question || "";
    expectedAnswer = phraseData?.arabicText || phraseData?.expectedAnswer || "";
  } else if (exerciseType === "thematic") {
    // For thematic exercises, use the theme and description as context
    context =
      `${phraseData?.theme || ""} ${phraseData?.themeEnglish || ""} ${phraseData?.description || ""} ${phraseData?.tags?.join(" ") || ""}`.trim();
    expectedAnswer =
      phraseData?.englishTranslation || phraseData?.expectedAnswer || "";
  } else {
    context = phraseData?.arabicText || phraseData?.question || "";
    expectedAnswer =
      phraseData?.englishTranslation || phraseData?.expectedAnswer || "";
  }

  return validateArabicAnswer(
    userAnswer,
    exerciseType,
    context,
    expectedAnswer,
  );
}
