# Overview

This AI-powered Arabic language learning application assists English-speaking Quran memorizers (huffaz) in daily Arabic conversation practice. It integrates Quranic phrases and verses into interactive exercises, phrase management, and progress tracking, aiming to connect existing Quranic knowledge with practical language skills. The application also includes behavioral symbolism to transform Quranic phrases into applicable life lessons.

The platform offers comprehensive content with 160+ daily contextual exercises, thousands of Quranic phrases, philosophical sentences, and conversation prompts. It supports a multilingual UI and content in English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian, and Russian. Key features include dynamic exercise generation, an adaptive learning system, robust progress tracking, and psychologically-themed exercises that connect Quranic wisdom with emotional intelligence. A "Quranic Expressions in Daily Life" section respectfully showcases practical uses of Quranic verses in everyday situations, with AI-generated and translated content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend uses React with TypeScript, Vite, Wouter for routing, Shadcn/ui for components, and Tailwind CSS for styling (Amiri font for Arabic). TanStack Query manages server state, and the Web Speech API provides text-to-speech. A custom i18n system with Context API supports ten languages, offering automatic RTL/LTR switching and persisting language preferences. The application features a consistent Quranesh logo and a respectful primary color theme.

## Backend Architecture
The backend is built with Express.js and TypeScript (ESM), providing a RESTful API. Zod schemas ensure data validation, and Express middleware handles JSON parsing, CORS, and logging.

## Database Schema Design
A PostgreSQL database, managed by Drizzle ORM, stores phrases, conversation prompts, user progress, exercise sessions, daily statistics, and symbolic meanings. It includes fields for multilingual content, classification (e.g., `isPracticalDailyUse`, `usageDomain`, `register`), and real-life examples with bilingual situations, Quranic verses, and usage notes.

## Exercise System Architecture
The system offers conversation practice, role-play, and grammar transformation exercises, dynamically generated based on user knowledge and difficulty. A non-repetition system prevents duplicate exercises while allowing repetition after all exercises are completed to ensure continuous practice availability. Gemini AI generates new Quranic phrases and exercises when needed and validates answers, accepting partial verses. Real-time feedback, long-term analytics, and adaptive learning are core components. The system prioritizes short, practical Quranic expressions for conversation exercises.

Daily contextual exercises are the **primary/default exercise type**, displayed first on the dashboard. They feature 4 multiple-choice options (1 correct Quranic expression + 3 thematically-varied distractors). Schema validation enforces exactly 3 distractors per exercise. The seed script programmatically selects the 3rd distractor from a pool of thematically-distinct expressions to maintain exercise quality and prevent theme overlap. All 160 daily sentences now have complete Arabic translations (100% coverage) and are displayed in Arabic (`arabicText` field) with RTL formatting when the UI language is set to Arabic, falling back to English for other languages when Arabic is unavailable.

**Psychological Daily Exercises**: A specialized set of 55+ exercises designed with psychological depth, where answers are understood through nuances and hints (ظلال وتلميحات) in Quranic verses. These exercises cover 11 psychological themes: anxiety, depression, self-doubt, loneliness, anger, guilt, fear, grief, hope, acceptance, and healing. Each exercise presents emotionally resonant scenarios paired with Quranic guidance that addresses mental and emotional well-being, providing spiritual wisdom for psychological challenges.

**Philosophical Match Exercise**: This exercise pairs universal wisdom and proverbs (2,400+ entries) with Quranic verses. The wisdom entries are carefully curated to contain ONLY universal philosophical wisdom and proverbs—NO Quranic verses or direct Quran references are permitted in the wisdom field. Users match the displayed wisdom with appropriate Quranic words, phrases, or verses. The label is simplified to "Wisdom:" (الحكمة:) without qualifiers to maintain respect and clarity. A data cleanup was performed to remove 25+ entries containing Quranic verses or direct Quran references, ensuring the exercise design integrity where wisdom entries remain secular proverbs that users thoughtfully connect to Quranic teachings.

## Translation Management System
An administrative `/translation-manager` interface allows bulk translation of philosophical sentences and conversation prompts into 9 languages using Gemini AI. It provides real-time statistics on translation coverage, supports single-sentence translation, and includes robust error handling with retry logic and validation.

## Authentication Strategy
The application uses JWT tokens and bcrypt for secure user authentication, supporting a demo user and ensuring data isolation.

## Payment Integration
HyperPay's COPYandPAY Widget is integrated for subscription management, supporting various card types and SAR currency in production, ensuring PCI compliance.

# External Dependencies

## Core Dependencies
- `@neondatabase/serverless`: PostgreSQL connectivity.
- `drizzle-orm`: Type-safe ORM.
- `@tanstack/react-query`: Server state management.
- `express`: Node.js web framework.
- Gemini AI (gemini-2.0-flash-exp): AI for content generation, translation, validation, and explanations.

## UI and Styling Dependencies
- `@radix-ui/*`: Accessible UI primitives.
- `tailwindcss`: Utility-first CSS.
- `class-variance-authority`: Dynamic classname generation.
- `lucide-react`: Icon library.
- Shadcn/ui: UI component library.

## Browser APIs
- Web Speech API: Text-to-speech.
- Local Storage: Client-side data persistence.

## Font and Internationalization
- Google Fonts: Inter (English) and Amiri (Arabic).
- Custom i18n system with RTL support.

## Payment Gateway
- HyperPay COPYandPAY Widget.