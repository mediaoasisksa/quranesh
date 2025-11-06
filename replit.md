# Overview

This AI-powered Arabic language learning application assists English-speaking Quran memorizers (huffaz) in daily Arabic conversation practice.

## Recent Updates (November 6, 2025)
- **Philosophical Sentence Translation System**: Implemented comprehensive dynamic translation of Arabic wisdom sentences to match selected UI language
  - Added language parameter to philosophical sentence API endpoint (`/api/philosophical-sentences/random?language=...`)
  - Frontend now passes current language to backend when fetching philosophical sentences
  - Display logic updated to show translated text for non-Arabic languages, Arabic text for Arabic language
  - Supports all 9 languages: English, Indonesian, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian
  - Translation uses Gemini AI (gemini-2.0-flash-exp) with database JSONB caching for efficiency
  - Fixed MemStorage implementation to include `getTranslatedPhilosophicalSentence` method
  - Updated queryKey to include language parameter for proper cache invalidation
  - **Translation Improvements**:
    - Simplified AI prompt from ~150 words to ~10 words for efficiency
    - Temperature reduced to 0.1 for consistent translations
    - maxOutputTokens set to 150 (sufficient for short wisdom sentences)
    - Added retry logic with exponential backoff (3 retries, 1s/2s/4s delays) to handle rate limiting
    - Error handling prevents storing Arabic text in translation fields
    - Translation validation: checks that translated text differs from Arabic source before saving
    - Database cleaned of 2,459 invalid translations
    - Changed from gemini-2.5-flash to gemini-2.0-flash-exp for better reliability
    - Security: Removed hard-coded API key, now requires GEMINI_API_KEY environment variable
  - **Manual Translations Added**: Added 8 fully translated philosophical sentences (all 9 languages) to demonstrate system when Gemini quota available
  - **System Verification**: E2E tested successfully - language switching works smoothly, translations display when cached, Arabic fallback works when translation unavailable
  - **Frontend Features**:
    - Added comprehensive console logging for debugging
    - Displays translated text when available, falls back to Arabic when translation fails
    - Smooth language switching with automatic cache invalidation
- **Logo Updated Across All Pages**: Replaced Quranesh logo with new version and increased size
  - Updated logo file: `quranesh logo (1)_1762444380395.png`
  - Added logo to all major pages: Header, Exercise, SignUp, SignIn, Dashboard, Profile
  - Logo sizes by page:
    - Header component: h-16 (60% increase)
    - Exercise page: h-14 (75% increase)
    - SignUp/SignIn pages: h-20 (large and prominent)
    - Dashboard: h-12 (medium size)
    - Profile: h-10 (standard size)
  - Replaced old icon-based branding with full Quranesh logo across the entire application
  - Logo now consistent and prominent across all pages with hover effects
- **Instruction Text Updated**: Changed from "Quranic verse" to "Quranic words or phrases" across all UI
  - Updated 8 translation keys across all 9 languages (English, Indonesian, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian)
  - Affected keys: `consoleFriendScenario`, `conversationPlaceholder`, `roleplayPlaceholder`, `roleplayScenarioText`, `thematicInstructionText`, `thematicInstructionText2`
  - Provides clearer guidance that users can answer with partial verses, individual words, or phrases from Quran
  - Consistent with existing AI validation that accepts partial Quranic text
  - Arabic now says "كلمات أو جمل من القرآن" instead of "آية قرآنية"
- **Partial Quranic Verse Acceptance**: AI validation now properly accepts partial Quranic verses as correct answers
  - Enhanced AI validation prompts with explicit instructions to accept partial verses, phrases, and short Quranic text
  - Examples: "وما تفعلوا من خير" (partial verse from 2:215), "إن مع العسر يسرا", "والله بصير"
  - Added critical rule section emphasizing that partial verses are just as valid as complete verses
  - Applies to all exercise types, ensuring students are not penalized for providing authentic Quranic text
  - User-reported issue resolved: partial verse "وما تفعلوا من خير" now accepted as correct

## Previous Updates (November 4, 2025)
- **Suggested Answer Feature**: Display suggested correct answer for 5 seconds when users make mistakes
  - Added `suggestedAnswer` field to AI validation response from Gemini API
  - Implemented exercise-type-specific fallback answers for all exercise types
  - Blue card with suggested answer appears for 5 seconds after incorrect submission
  - Complete translation support across all 9 languages for "Suggested correct answer:" label
  - E2E tested with successful validation of 5-second timer and card visibility
- **Exercise Placeholder Translation Fix**: Resolved hard-coded Arabic text in exercise placeholders
  - Fixed conversation, substitution, roleplay, and comparison exercise placeholders
  - Added 4 new translation keys (`conversationPlaceholder`, `substitutionPlaceholder`, `roleplayPlaceholder`, `comparisonPlaceholder`)
  - All placeholder text now properly translates based on selected language
  - Users reported issue fixed: English language now shows English placeholders instead of Arabic

## Previous Updates (November 3, 2025)
- **SignUp Page Translation Completed**: Fixed incomplete translations on registration page
  - Added 35 new translation keys to all 9 languages
  - Covers password fields, memorization levels, native languages, learning goals, terms acceptance, and error messages
  - All form labels, placeholders, dropdown options, and error messages now fully translated
  - E2E tested across Arabic, Somali, Bosnian, and Albanian
- **Albanian Language Added**: Complete translation support for Albanian (Shqip) - 9th language
  - All UI elements, exercises, navigation, and content translated
  - Language toggle cycles through 9 languages: English → Indonesian → Turkish → Arabic → Chinese → Swahili → Somali → Bosnian → Albanian
  - Full coverage of 235+ translation keys per language
  - Proper Islamic terminology in Albanian (Kuran, ajet, xhuz, hafiz)
- **Bosnian Language Added**: Complete translation support for Bosnian (Bosanski) - 8th language
  - Full coverage of 235+ translation keys
  - Proper Islamic terminology in Bosnian (Kur'an, ajet, džuz, hafiz)
- **Somali Language Added**: Complete translation support for Somali (Soomaali) - 7th language
  - Fixed hard-coded English text in exercise cards across all languages

## Project Overview It leverages Quranic phrases and verses already memorized by users, integrating them into interactive exercises, phrase management, and progress tracking. The project aims to combine existing Quranic knowledge with practical language skills, offering behavioral symbolism to transform Quranic phrases into applicable life lessons.

The application features comprehensive content with thousands of Quranic phrases, philosophical sentences, and conversation prompts. It supports multiple languages for the UI and content, including English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, and Albanian. Key capabilities include dynamic exercise generation, an adaptive learning system, and a robust progress tracking mechanism.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite. It employs Wouter for client-side routing, Shadcn/ui for UI components based on Radix UI primitives, and Tailwind CSS for styling with Amiri font for Arabic. TanStack Query manages server state, and the browser's Web Speech API provides Arabic text-to-speech. A custom i18n system with Context API supports nine languages, offering automatic RTL/LTR switching and persisting language preferences in localStorage. The application features a new colorful Quranesh logo.

## Backend Architecture
The backend uses Express.js with TypeScript, running in ESM mode. It provides a RESTful API for phrases, exercises, progress, and statistics. Zod schemas handle data validation, and Express middleware manages JSON parsing, CORS, and logging.

## Database Schema Design
The PostgreSQL database, managed by Drizzle ORM, includes tables for:
- **Phrases**: Stores Arabic text, English translations, Surah references, and categorization.
- **Conversation Prompts**: Contains 162 Arabic conversation questions with suggested Quranic verses, covering various daily topics.
- **User Progress**: Tracks mastery levels and practice statistics per phrase.
- **Exercise Sessions**: Records individual exercise attempts for non-repetition filtering.
- **Daily Statistics**: Aggregates usage and performance metrics.
- **Symbolic Meaning**: A new field added to exercise types, providing behavioral interpretations for Quranic phrases in both Arabic and English.

## Exercise System Architecture
The system offers three exercise types: conversation practice, role-play scenarios, and grammar transformation. Exercises are dynamically generated based on user knowledge and difficulty. A non-repetition system ensures users don't encounter the same exercise twice by filtering completed exercises at the backend and using `userId`-specific React Query cache keys on the frontend. When database questions are exhausted, Gemini AI generates new Quranic phrases and exercises. Real-time feedback, long-term progress analytics, and adaptive learning based on user performance are integrated. The conversation exercise uses database-backed prompts with AI validation of user responses and displays suggested verses.

## Authentication Strategy
The application incorporates a full authentication system with JWT tokens and bcrypt password hashing. It supports a demo user (`demo@example.com`, `demo123`) and ensures user ID-based data isolation with secure session management.

## Payment Integration
HyperPay's COPYandPAY Widget is integrated for subscription management, supporting VISA, MASTER, and MADA cards. It operates in both production and test environments, using SAR currency in production. The integration follows HyperPay's official documentation, involving server-to-server checkout creation, client-side widget loading with SRI verification, and backend validation of payment status via a callback. Security features include integrity hash verification, cross-origin iframes for PCI compliance, and dynamic entity ID selection.

# External Dependencies

## Core Dependencies
- `@neondatabase/serverless`: PostgreSQL connectivity.
- `drizzle-orm`: Type-safe ORM.
- `@tanstack/react-query`: Server state management.
- `express`: Node.js web framework.

## UI and Styling Dependencies
- `@radix-ui/*`: Accessible UI primitives.
- `tailwindcss`: Utility-first CSS.
- `class-variance-authority`: Dynamic classname generation.
- `lucide-react`: Icon library.

## Development Dependencies
- `vite`: Fast development server and build tool.
- `@replit/vite-plugin-*`: Replit-specific enhancements.
- `drizzle-kit`: Database migration tools.

## Browser APIs
- Web Speech API: Text-to-speech.
- Local Storage: Client-side data persistence.

## Font and Internationalization
- Google Fonts: Inter (English) and Amiri (Arabic).
- RTL Support for Arabic.
- Custom language switching mechanism.