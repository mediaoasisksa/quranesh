# Overview

This AI-powered Arabic language learning application assists English-speaking Quran memorizers (huffaz) in daily Arabic conversation practice. It leverages Quranic phrases and verses already memorized by users, integrating them into interactive exercises, phrase management, and progress tracking. The project aims to combine existing Quranic knowledge with practical language skills, offering behavioral symbolism to transform Quranic phrases into applicable life lessons.

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