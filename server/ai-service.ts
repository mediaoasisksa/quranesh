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
    const hasQuranicAttribute =
      /(غفور|رحيم|عزيز|حكيم|كريم|عليم|حليم|شكور|صبور|ودود|مجيد|عظيم|قدير|سميع|بصير|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم|ودود|شكور|صبور|حليم|كريم|عظيم|مجيد|قدير|سميع|بصير|عليم|عالم|حكيم|عزيز|غفار|تواب|رحمن|رحيم)/.test(
        userAnswer,
      );
    const isCompletePhrase =
      userAnswer.includes("الله") || userAnswer.includes("اللَّهُ");

    // Consider it correct if it has Arabic content AND either Quranic attributes OR complete phrase structure
    isActuallyCorrect =
      hasArabic && hasContent && (hasQuranicAttribute || isCompletePhrase);
  } else if (exerciseType === "conversation") {
    // For conversation exercises, check if it's a Quranic verse with semantic relevance
    const englishContext = context.toLowerCase();

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

    // Consider it correct if it's a Quranic verse with at least 30% semantic relevance (more lenient)
    isActuallyCorrect =
      hasArabic &&
      hasContent &&
      hasQuranicPattern &&
      relevancePercentage >= 0.3;
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
      const originalStatement = context.toLowerCase();
      const userQuestion = userAnswer.toLowerCase();

      // Extract key concepts from the original statement more comprehensively
      const keyConcepts = [];

      // Check for Allah/God references
      if (
        originalStatement.includes("الله") ||
        originalStatement.includes("الله")
      ) {
        keyConcepts.push("الله");
      }

      // Check for love/hate actions
      if (
        originalStatement.includes("يحب") ||
        originalStatement.includes("يحب")
      ) {
        keyConcepts.push("يحب");
      }
      if (
        originalStatement.includes("لا يحب") ||
        originalStatement.includes("لا يحب")
      ) {
        keyConcepts.push("لا يحب");
      }

      // Check for wrongdoers/oppressors
      if (
        originalStatement.includes("ظالم") ||
        originalStatement.includes("ظالم")
      ) {
        keyConcepts.push("ظالم");
      }
      if (
        originalStatement.includes("ظالمين") ||
        originalStatement.includes("ظالمين")
      ) {
        keyConcepts.push("ظالمين");
      }

      // Check for doers of good
      if (
        originalStatement.includes("محسن") ||
        originalStatement.includes("محسن")
      ) {
        keyConcepts.push("محسن");
      }
      if (
        originalStatement.includes("محسنين") ||
        originalStatement.includes("محسنين")
      ) {
        keyConcepts.push("محسنين");
      }
      if (
        originalStatement.includes("المحسنين") ||
        originalStatement.includes("المحسنين")
      ) {
        keyConcepts.push("المحسنين");
      }

      // Check for other common concepts
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
      if (
        originalStatement.includes("رحيم") ||
        originalStatement.includes("رحيم")
      ) {
        keyConcepts.push("رحيم");
      }
      if (
        originalStatement.includes("غفور") ||
        originalStatement.includes("غفور")
      ) {
        keyConcepts.push("غفور");
      }

      console.log("=== KEY CONCEPTS DEBUG ===");
      console.log("Original Statement:", originalStatement);
      console.log("User Question:", userQuestion);
      console.log("Key Concepts Found:", keyConcepts);

      // Check if the question contains at least 50% of the key concepts
      let matchingConcepts = 0;
      keyConcepts.forEach((concept) => {
        if (userQuestion.includes(concept)) {
          matchingConcepts++;
          console.log(`✓ Matched concept: ${concept}`);
        } else {
          console.log(`✗ Missed concept: ${concept}`);
        }
      });

      console.log(
        `Matching: ${matchingConcepts}/${keyConcepts.length} (${((matchingConcepts / keyConcepts.length) * 100).toFixed(1)}%)`,
      );

      isRelevantToStatement =
        keyConcepts.length > 0 && matchingConcepts / keyConcepts.length >= 0.5;
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

    // Consider it correct if it has Arabic content AND is in question format (relevance is nice but not required)
    isActuallyCorrect = hasArabic && hasContent && isQuestionFormat;
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

  return {
    isCorrect: isActuallyCorrect,
    score: isActuallyCorrect ? 60 : 20,
    feedback: isActuallyCorrect
      ? finalFeedback
      : exerciseType === "transformation"
        ? finalFeedback // For transformation, use the specific feedback directly
        : `Please provide an answer in Arabic. ${finalFeedback}`,
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
