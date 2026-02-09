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
2. EXTRACT key Arabic keywords and their meanings
3. WRITE a scenario that PARAPHRASES those keywords (Semantic Hinting)
4. VERIFY: Can the student recall the verse from the question alone?

**Strict Rules:**
1. **Semantic Hinting (التلميح اللفظي)**: The question must contain a paraphrase/definition of the verse's keywords so the user can recall the exact phrase (e.g., "patience without complaint (beautiful patience)" → "فَصَبْرٌ جَمِيلٌ")
2. **No Abstraction (منع التفسير العميق)**: No verses requiring deep Tafsir to connect — the link must be OBVIOUS and LINGUISTIC (e.g., ❌ "phone addiction" → "خزائن الأرض" is rejected because only scholars see the connection)
3. **Native Speaker Test**: If a native Arabic speaker wouldn't naturally quote this verse in this situation, it's rejected
4. **Specificity**: The scenario must make THIS verse (not just any verse) the obvious answer
5. **Practical Daily Use**: Only short phrases (2-8 words) that people actually quote in conversation

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

## Translation Management
An administrative `/translation-manager` interface allows bulk translation of philosophical sentences and conversation prompts into 9 languages using Gemini AI, providing statistics, single-sentence translation, and robust error handling.

## Authentication
The application uses JWT tokens and bcrypt for secure user authentication, supporting a demo user and ensuring data isolation.

## Payment Integration
HyperPay's COPYandPAY Widget is integrated for subscription management, supporting various card types and SAR currency, ensuring PCI compliance.

# External Dependencies

## Core
- `@neondatabase/serverless`: PostgreSQL connectivity
- `drizzle-orm`: Type-safe ORM
- `@tanstack/react-query`: Server state management
- `express`: Node.js web framework
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