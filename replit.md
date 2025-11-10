# Overview

This AI-powered Arabic language learning application is designed to assist English-speaking Quran memorizers (huffaz) in daily Arabic conversation practice. It leverages users' existing Quranic knowledge by integrating phrases and verses into interactive exercises, phrase management, and progress tracking. The project aims to combine this knowledge with practical language skills, offering behavioral symbolism to transform Quranic phrases into applicable life lessons.

The application features comprehensive content with thousands of Quranic phrases, philosophical sentences, and conversation prompts. It supports multiple languages for the UI and content, including English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian, and Russian. Key capabilities include dynamic exercise generation, an adaptive learning system, and a robust progress tracking mechanism.

## Recent Major Updates (November 8-9, 2025)

### Quranic Expressions in Daily Life Feature (November 9-10, 2025)
Implemented a respectful section showcasing practical uses of Quranic verses and phrases in everyday situations:

- **Database Schema**: Created `real_life_examples` table with:
  - Bilingual situation descriptions (Arabic/English)
  - Quranic verse in Arabic with Surah reference
  - Bilingual usage notes explaining how the verse is applied (`usage_note_ar/en`)
  - Category classification (family, work, friends, practical)
  - JSONB translations field for future language expansion
  
- **Frontend Features**:
  - Dedicated `/real-life-examples` page titled "Quranic Expressions in Daily Life"
  - Search and category filtering functionality
  - BookOpen icon throughout (professional, respectful design)
  - Primary color theme (removed amber/orange)
  - Copy-to-clipboard functionality for Quranic verses
  - RTL support for Arabic content
  - Dashboard navigation card with respectful branding

- **AI Content Generation**: Created `server/generate-real-life-examples.ts` script:
  - Uses Gemini AI to generate contextually appropriate, practical examples
  - 5-second delays between API calls for rate limiting
  - Generates respectful, everyday usage scenarios
  - Validates uniqueness and appropriateness
  
- **Current Examples** (5 total after cleanup):
  - Mother praying wants son to go to door: "فَأَلْفَيَا سَيِّدَهَا لَدَى الْبَابِ" (يوسف:25)
  - Mother praying reminds son of appointment: "اقْتَرَبَتِ السَّاعَةُ" (القمر:1)
  - Friend asking when to meet: "وَالصُّبْحِ إِذَا تَنَفَّسَ" (التكوير:18)
  - Wife complaining about life: "اذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ" (آل عمران:103)
  - Friend calls late at night about keys: "وَجَعَلْنَا اللَّيْلَ لِبَاسًا" (النبأ:10)

- **Respectful Refactoring** (November 10, 2025):
  - Removed all humor-related terminology and emoji 😄
  - Renamed database columns: `humor_note_*` → `usage_note_*`
  - Updated all frontend components to use "Usage Note" instead of "Humor Note"
  - Changed theme from playful (amber) to respectful (primary colors)
  - Deleted duplicate and inappropriate examples
  - Updated AI generation prompts to create "practical" not "humorous" content

- **Multilingual Support** (November 10, 2025):
  - Added complete translations for all 10 languages (English, Arabic, Indonesian, Turkish, Chinese, Swahili, Somali, Bosnian, Albanian, Russian)
  - Updated Dashboard card to use translation system instead of hardcoded language check
  - Updated Real-Life Examples page to use translation system throughout
  - Added translation keys: realLifeExamplesTitle, realLifeExamplesDesc, browseExamples, searchExamples, noExamplesFound, showingExamples

- **Testing**: End-to-end tests confirmed:
  - No humor terminology or emoji anywhere in the feature
  - Dashboard card displays respectful title and BookOpen icon
  - Search and filtering work correctly with new field names
  - New mother praying examples display and search properly
  - Copy functionality works as expected
  - Translations work correctly across all tested languages (Chinese, Indonesian, Turkish, Swahili)

### Logo Size Enhancement (November 9, 2025)
Increased logo size across all pages for better brand visibility:

- **Size Hierarchy**: Implemented consistent logo sizing:
  - Public pages (Header, SignIn, SignUp): h-24 (96px) - increased from h-16/h-20
  - Internal pages (Dashboard, Exercise, Profile, Translation Manager): h-20 (80px) - increased from h-10/h-12/h-14
  
- **Container Adjustments**: Updated header containers to accommodate larger logos:
  - Dashboard header: h-24 (from h-16)
  - Exercise header: h-24 (from h-16)
  - Main site header: py-5 (from py-4)

- **Testing**: End-to-end tests confirmed:
  - No layout regressions or overflow issues
  - Logo displays correctly across all pages
  - Consistent visual hierarchy maintained

### Multilingual Conversation Prompts (November 9, 2025)
Implemented translation system for conversation prompts to display in user's selected UI language:

- **Database Schema**: Added 9 translation fields to `conversation_prompts` table:
  - `question_en`, `question_id`, `question_tr`, `question_zh`, `question_sw`, `question_so`, `question_bs`, `question_sq`, `question_ru`
  - Enables displaying questions in English, Indonesian, Turkish, Chinese, Swahili, Somali, Bosnian, Albanian, Russian

- **Frontend Localization**: Enhanced exercise page with `getLocalizedQuestion()` helper:
  - Displays question in user's UI language with fallback to Arabic if translation unavailable
  - Supports all 10 languages with language-specific rendering

- **Translation Automation**: Created `server/translate-conversation-prompts.ts` script:
  - Batch translation using Gemini AI with retry logic and exponential backoff
  - Skips already translated prompts to resume efficiently after interruptions
  - 4-second delays between API calls to handle rate limits
  - Validates translations differ from Arabic source

- **Current Status**: 4 out of 172 prompts fully translated (all 9 languages)
  - Remaining 168 prompts pending due to API rate limits
  - Script available for continued batch translation: `tsx server/translate-conversation-prompts.ts`

- **Language Filtering System** (Implemented):
  - Backend filters prompts by available translations for selected UI language
  - Non-Arabic users see ONLY translated prompts (prevents Arabic-only fallback)
  - Arabic users see all prompts (no filtering applied)
  - Graceful fallback to all prompts if no translations exist for a language
  - Query includes language parameter: `/api/conversation-prompts/random?userId=X&language=en`
  - Testing confirmed: English users see only 4 translated prompts in rotation

### Practical Expression Classification System (November 8, 2025)
Implemented a comprehensive classification system to ensure conversation exercises use contextually appropriate, practical Quranic expressions for daily use:

- **Database Schema Enhancement**: Added three new classification fields to `phrases` and `conversation_prompts` tables:
  - `isPracticalDailyUse`: Binary flag (1 = practical for daily conversation, 0 = narrative/story context)
  - `usageDomain`: Categories like "greeting", "time", "request", "gratitude", "blessing", "apology"
  - `register`: Linguistic register ("conversational", "formal", "literary", "poetic")

- **Smart Selection System**: Updated random prompt selection to prioritize short (2-6 words), practical expressions over long narrative verses. Filtered out 14 long expressions (>6 words) from active selection pool, maintaining 158 short practical expressions.

- **Enhanced AI Validation**: Improved Gemini AI validation with strict contextual appropriateness criteria:
  - Rejects story-based or eschatological verses (e.g., "الساعة آتية" for appointments)
  - Validates conversational suitability and natural daily usage
  - Provides detailed feedback on why expressions don't fit specific contexts
  - Enforces 2-6 word length limit for conversation exercises

- **Curated Seed Data**: Created 10 practical conversation prompts and 5 essential phrases:
  - "إن شاء الله" (If Allah wills) - future plans
  - "جزاك الله خيراً" (May Allah reward you) - gratitude
  - "بارك الله فيك" (May Allah bless you) - blessing
  - "الحمد لله" (Praise be to Allah) - responding to good news
  - "ما شاء الله" (What Allah has willed) - admiration

- **UI Improvement**: Fixed conversation exercise display to show suggested verse immediately (before answering) instead of after validation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite, Wouter for routing, Shadcn/ui for UI components, and Tailwind CSS for styling with Amiri font for Arabic. TanStack Query manages server state, and the browser's Web Speech API provides Arabic text-to-speech. A custom i18n system with Context API supports ten languages (English, Indonesian, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian, Russian), offering automatic RTL/LTR switching and persisting language preferences in localStorage. The application features a colorful Quranesh logo consistently displayed across all pages.

## Backend Architecture
The backend uses Express.js with TypeScript in ESM mode, providing a RESTful API for phrases, exercises, progress, and statistics. Zod schemas handle data validation, and Express middleware manages JSON parsing, CORS, and logging.

## Database Schema Design
A PostgreSQL database, managed by Drizzle ORM, stores:
- **Phrases**: Arabic text, English translations, Surah references, and categorization.
- **Conversation Prompts**: Arabic questions with suggested Quranic verses.
- **User Progress**: Mastery levels and practice statistics per phrase.
- **Exercise Sessions**: Records individual exercise attempts for non-repetition filtering.
- **Daily Statistics**: Aggregated usage and performance metrics.
- **Symbolic Meaning**: Behavioral interpretations for Quranic phrases in both Arabic and English.

## Exercise System Architecture
The system offers conversation practice, role-play scenarios, and grammar transformation exercises. Exercises are dynamically generated based on user knowledge and difficulty. A non-repetition system prevents duplicate exercises. When database questions are exhausted, Gemini AI generates new Quranic phrases and exercises. The system provides real-time feedback, long-term progress analytics, and adaptive learning. AI validation accepts partial Quranic verses as correct answers, and suggested correct answers are displayed briefly after incorrect submissions. Philosophical sentences include permanent translations and AI-generated explanations of their logical connection to Quranic verses for transformation exercises.

## Translation Management System
A comprehensive administrative interface at `/translation-manager` enables bulk translation of philosophical sentences. The system provides real-time statistics showing total sentences, translated count, untranslated count, and coverage percentage for each language. Features include:
- **Bulk Translation**: Configurable batch processing (1-50 sentences) with 1.5-second delays between API calls
- **Language Support**: Manages translations for 9 languages (English, Indonesian, Turkish, Chinese, Swahili, Somali, Bosnian, Albanian, Russian)
- **Translation Statistics**: Real-time monitoring of translation coverage per language
- **Single Sentence Translation**: Manual translation option for individual sentences
- **Error Handling**: Retry logic with exponential backoff for API rate limiting
- **Validation**: Ensures translated text differs from Arabic source
- **Progress Tracking**: Real-time updates during batch operations with success/failure indicators
Accessed via dashboard dropdown menu (Languages icon) for administrative users.

## Authentication Strategy
The application uses a full authentication system with JWT tokens and bcrypt password hashing. It supports a demo user and ensures user ID-based data isolation with secure session management.

## Payment Integration
HyperPay's COPYandPAY Widget is integrated for subscription management, supporting VISA, MASTER, and MADA cards in production and test environments, using SAR currency in production. The integration involves server-to-server checkout creation, client-side widget loading with SRI verification, and backend validation of payment status via a callback, ensuring PCI compliance and security.

# External Dependencies

## Core Dependencies
- `@neondatabase/serverless`: PostgreSQL connectivity.
- `drizzle-orm`: Type-safe ORM.
- `@tanstack/react-query`: Server state management.
- `express`: Node.js web framework.
- Gemini AI (gemini-2.0-flash-exp): AI for content generation, translation, validation, and logical connection explanations.

## UI and Styling Dependencies
- `@radix-ui/*`: Accessible UI primitives.
- `tailwindcss`: Utility-first CSS.
- `class-variance-authority`: Dynamic classname generation.
- `lucide-react`: Icon library.
- Shadcn/ui: UI component library.

## Development Dependencies
- `vite`: Fast development server and build tool.
- `@replit/vite-plugin-*`: Replit-specific enhancements.
- `drizzle-kit`: Database migration tools.

## Browser APIs
- Web Speech API: Text-to-speech.
- Local Storage: Client-side data persistence.

## Font and Internationalization
- Google Fonts: Inter (English) and Amiri (Arabic).
- Custom i18n system with RTL support.

## Payment Gateway
- HyperPay COPYandPAY Widget.