# Overview

This AI-powered Arabic language learning application is designed for English-speaking Quran memorizers (huffaz) to practice daily Arabic conversation. It integrates Quranic phrases and verses into interactive exercises, phrase management, and progress tracking, linking existing Quranic knowledge with practical language skills. The application also incorporates behavioral symbolism to transform Quranic phrases into applicable life lessons, aiming to foster emotional intelligence through Quranic wisdom.

The platform offers extensive content, including 160+ daily contextual exercises, 224+ Quranic phrases, 2,400+ philosophical wisdom entries, and 350 conversation prompts. It supports a multilingual UI in English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian, and Russian. Key capabilities include dynamic exercise generation, an adaptive learning system, robust progress tracking, and psychologically-themed exercises.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
The frontend is built with React, TypeScript, Vite, Wouter for routing, Shadcn/ui for components, and Tailwind CSS for styling (Amiri font for Arabic). It uses TanStack Query for server state management and the Web Speech API for text-to-speech. A custom i18n system with Context API supports ten languages, providing automatic RTL/LTR switching and persisting language preferences. The application maintains a consistent Quranesh logo and a respectful primary color theme.

## Backend
The backend utilizes Express.js and TypeScript (ESM) to provide a RESTful API. Zod schemas are used for data validation, and Express middleware handles JSON parsing, CORS, and logging.

## Database
A PostgreSQL database, managed by Drizzle ORM, stores phrases, conversation prompts, user progress, exercise sessions, daily statistics, symbolic meanings, and multilingual content. It includes classifications like `isPracticalDailyUse`, `usageDomain`, and `register`. The phrase bank contains 224+ Quranic expressions, significantly expanded from Surah Yusuf, covering themes of family relations, wisdom, storytelling, guidance, trust, betrayal, patience, and divine wisdom. The question bank has 132 entries, categorized by Surah (Al-Baqarah, Luqman) and themes such as Quran recitation, learning programs, and etiquette (Adab).

## Content Logic — Reverse-Engineered Trigger-Response Framework (server/content-logic.ts)
The app is a **Functional Arabic Language Trainer** (NOT a quiz). All AI-generated exercises follow the **Reverse-Engineered Trigger-Response** framework:
- **RESPONSE first** (Quranic Phrase): The verse is selected FIRST
- **TRIGGER** (Scenario): A scenario is then written AROUND the verse, paraphrasing its keywords

**Generation Workflow (Verse-First):**
1. SELECT the target Quranic verse FIRST (2-8 words, commonly quoted by native speakers)
2. EXTRACT Lock Words (كلمات القفل): ≥2 key Arabic keywords + their meanings + core concept
3. CHECK: If any Lock Word is a synonym/metaphor for a common word, note the SEMANTIC TRAIT (not the common word)
4. WRITE a question that contains ≥2 Lock Words as paraphrases/definitions
5. VERIFY: Can the student recall the verse from the question alone? Are there ≥2 Lock Words?

**Strict Rules:**
1. **Lock Words (كلمات القفل)**: Every question must contain paraphrases/definitions of ≥2 of the verse's unique keywords ("Lock Words"). A single keyword is too vague — it could match multiple verses. Example: "صبر + لا شكوى / جميل" = 2 lock words → only "فَصَبْرٌ جَمِيلٌ" fits.
2. **Synonym/Metaphor Rule (قاعدة المرادف)**: When the verse uses a literary/Quranic word (e.g., رواسي) instead of a common word (e.g., جبال), the question must use the SEMANTIC TRAIT ("الرسوخ/الثبات") or the exact Quranic word — NOT the common synonym. Golden Rule: المعنى → الصفة → اللفظ القرآني → الآية.
3. **Semantic Hinting (التلميح اللفظي)**: The question must embed the MEANING of the verse's keywords so the user can recall the exact phrase.
4. **No Abstraction (منع التفسير العميق)**: No verses requiring deep Tafsir to connect — the link must be OBVIOUS and LINGUISTIC (e.g., ❌ "phone addiction" → "خزائن الأرض" is rejected because only scholars see the connection)
5. **Native Speaker Test**: If a native Arabic speaker wouldn't naturally quote this verse in this situation, it's rejected
6. **Specificity**: The scenario must make THIS verse (not just any verse) the obvious answer
7. **Practical Daily Use**: Only short phrases (2-8 words) that people actually quote in conversation
8. **Meaning → Quranic Word (المعنى → الكلمة القرآنية)**: NEVER ask about surah names/numbers ("ما السورة التي تبدأ بـ...؟"). Instead, teach the LINGUISTIC MEANING of the Quranic word, then ask the student to recall it. Formula: Give meaning → Ask for Quranic word. Example: "ما الكلمة القرآنية التي تعني: المتغطي بثوبه؟" → المزمل

**QA Auto-Rejection Rules:**
- If the scenario uses a COMMON WORD but the verse uses a DIFFERENT WORD for the same concept → REJECT and rewrite
- If the question has only 1 lock word → REJECT (too ambiguous)
- If the question is a general topic without specific Lock Words → REJECT
- If the question asks about surah names/numbers or "which surah starts with X?" → REJECT (memorization trivia, not language teaching)

This doctrine is enforced in: `server/content-logic.ts` (shared constants), `server/add-conversation-prompts.ts` (generation), `server/generate-daily-contextual-exercises.ts` (daily exercises), `server/ai-service.ts` (validation, phrase generation, answer evaluation).

## Exercise System
The system offers dynamic conversation practice, role-play, and grammar transformation exercises, generated based on user knowledge and difficulty. A non-repetition system ensures continuous access to fresh exercises. Gemini AI (gemini-2.0-flash) generates new Quranic phrases and exercises, validates answers using the Trigger-Response framework, and provides real-time feedback and long-term analytics. The system prioritizes short, practical Quranic expressions for conversational use.

A **Maqasidi (purpose-based) verse selection system** maps 9 situation categories (e.g., facilitation, consolation, commitment) to appropriate verses from prophets' speech, prioritizing emotional context. It prevents the use of divine-attribute verses in routine human contexts. The system includes a `human_situations` table with 20 mapped situations, keywords, and contextual logic. Roleplay scenarios include `emotional_state` and `verse_source` fields, with 60 scenarios covering various emotional states — each scenario is a direct paraphrase of its assigned verse's meaning.

The application features 350 conversation prompts for diverse daily situations, including 48 practical daily scenarios and 49 phonetic practice exercises focused on Quranic supplications with detailed phonetic notes.
There are 60 psychological roleplay scenarios, covering 25+ psychological themes like hope, trust, anxiety, and resilience, all designed to elicit thoughtful Quranic responses.
Daily contextual exercises are the primary exercise type, offering multiple-choice questions with AI semantic validation to accept contextually appropriate Quranic expressions beyond strict keyword matching. Multilingual display logic ensures content is presented in the user's preferred language with appropriate fallbacks.
Specialized **Psychological Daily Exercises** (55+) cover 11 psychological themes, presenting emotionally resonant scenarios paired with Quranic guidance.
The **Philosophical Match Exercise** pairs 2,400+ universal philosophical wisdom entries (excluding direct Quranic references) with relevant Quranic words, phrases, or verses.

The **frontend recall workflow** ensures active learning: no "Show Solution" button before submission, hints show only the first word of the verse, and the full verse is revealed only after the user submits their answer.

## Global Quranic Chat
Real-time chat system with 11 language-specific rooms (English, French, Indonesian, Urdu, Turkish, Russian, Spanish, Bengali, Hindi, German, Swahili). Uses Socket.io for bi-directional messaging and Gemini AI for automatic Arabic↔target-language translation. Messages are persisted in the `chat_messages` table. The chat is accessible at `/chat` with a lobby showing all rooms and individual chat room views with WhatsApp-style message bubbles. Each message shows the translated text with a "Show original" toggle for learning.

## Translation Management
An administrative `/translation-manager` interface allows bulk translation of philosophical sentences and conversation prompts into 9 languages using Gemini AI, providing statistics, single-sentence translation, and robust error handling.

## Authentication
The application uses JWT tokens and bcrypt for secure user authentication, supporting a demo user and ensuring data isolation.

## Payment & Subscription System
HyperPay's COPYandPAY Widget handles payments (VISA/Mastercard/MADA), with credentials loaded exclusively from environment variables (HYPERPAY_PROD_* for production, HYPERPAY_* for test). The `subscriptions` table tracks active user subscriptions with plan type, amount, start/end dates, and transaction ID. Plans: learner (10 SAR/year), sponsor-5 (50 SAR/year, sponsors 5 learners), sponsor-10 (100 SAR/year, sponsors 10 learners), certificate (40 SAR one-time). The `/api/subscription-status` endpoint checks subscription validity; admin users bypass subscription requirements. The `SubscriptionGate` component on the frontend blocks exercise access for non-subscribed users.

# External Dependencies

## Core
- `@neondatabase/serverless`: PostgreSQL connectivity
- `drizzle-orm`: Type-safe ORM
- `@tanstack/react-query`: Server state management
- `express`: Node.js web framework
- `socket.io` / `socket.io-client`: Real-time bidirectional chat
- Gemini AI (gemini-2.0-flash): Content generation, translation, validation, explanations

## UI and Styling
- `@radix-ui/*`: Accessible UI primitives
- `tailwindcss`: Utility-first CSS
- `class-variance-authority`: Dynamic classname generation
- `lucide-react`: Icon library
- Shadcn/ui: UI component library

## Browser APIs
- Web Speech API: Text-to-speech
- Local Storage: Client-side data persistence

## Font and Internationalization
- Google Fonts: Inter (English) and Amiri (Arabic)
- Custom i18n system with RTL support

## Payment Gateway
- HyperPay COPYandPAY Widget