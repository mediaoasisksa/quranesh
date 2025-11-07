# Overview

This AI-powered Arabic language learning application is designed to assist English-speaking Quran memorizers (huffaz) in daily Arabic conversation practice. It leverages users' existing Quranic knowledge by integrating phrases and verses into interactive exercises, phrase management, and progress tracking. The project aims to combine this knowledge with practical language skills, offering behavioral symbolism to transform Quranic phrases into applicable life lessons.

The application features comprehensive content with thousands of Quranic phrases, philosophical sentences, and conversation prompts. It supports multiple languages for the UI and content, including English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, and Albanian. Key capabilities include dynamic exercise generation, an adaptive learning system, and a robust progress tracking mechanism.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite, Wouter for routing, Shadcn/ui for UI components, and Tailwind CSS for styling with Amiri font for Arabic. TanStack Query manages server state, and the browser's Web Speech API provides Arabic text-to-speech. A custom i18n system with Context API supports nine languages, offering automatic RTL/LTR switching and persisting language preferences in localStorage. The application features a colorful Quranesh logo consistently displayed across all pages.

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
- **Language Support**: Manages translations for 8 languages (English, Indonesian, Turkish, Chinese, Swahili, Somali, Bosnian, Albanian)
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