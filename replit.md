# Overview

This is an AI-powered Arabic language learning application specifically designed for Quran memorizers (huffaz) who speak English. The application helps users practice daily Arabic conversation using Quranic phrases and verses they have already memorized. It combines their existing Quranic knowledge with practical language skills through interactive exercises, phrase management, and progress tracking.

## Documentation
- **PDF Documentation**: Comprehensive app description available at `/app-description` endpoint
- The documentation includes product overview, technical architecture, features, pricing, and more
- Can be saved as PDF using browser's "Print to PDF" feature

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and building
- **Routing**: Wouter for client-side routing with pages for dashboard and exercises
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and Arabic font support (Amiri)
- **State Management**: TanStack Query for server state and local React state for UI
- **Speech Synthesis**: Browser Web Speech API for Arabic text-to-speech functionality
- **Internationalization**: Custom i18n system with Context API supporting English, Bahasa Indonesia, Turkish, Arabic, Chinese, and Swahili with RTL/LTR switching
  - Language toggle button positioned in navigation header on all pages
  - Cycles through: English → Bahasa Indonesia → Turkish → Arabic → Chinese → Swahili → English
  - Automatic direction switching (RTL for Arabic, LTR for English, Bahasa, Turkish, Chinese, and Swahili)
  - Language preference persisted in localStorage
  - Full translations for all UI elements in all six languages

## Backend Architecture
- **Server**: Express.js with TypeScript running in ESM mode
- **API Design**: RESTful API with structured routes for phrases, exercises, progress, and statistics
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Data Validation**: Zod schemas for request/response validation
- **Middleware**: Express middleware for JSON parsing, CORS, and request logging

## Database Schema Design
- **Phrases Table**: Stores Arabic text, English translations, Surah references, and categorization
- **User Progress**: Tracks mastery levels and practice statistics per phrase
- **Exercise Sessions**: Records individual exercise attempts and results
- **Daily Statistics**: Aggregates daily usage and performance metrics
- **Schema Management**: Drizzle ORM with PostgreSQL dialect for database operations

## Exercise System Architecture
- **Exercise Types**: Six different exercise patterns including substitution drills, conversation practice, completion exercises, comparison tasks, role-play scenarios, and grammar transformation
- **Dynamic Content**: Exercises are generated based on user's current phrase knowledge and difficulty progression
- **Non-Repetition System**: Questions never repeat for the same user across sessions - tracks completed exercises per user and exercise type
- **AI Question Generation**: When users exhaust all database questions, Gemini AI generates new authentic Quranic phrases and exercises
- **Progress Tracking**: Real-time feedback and long-term progress analytics
- **Adaptive Learning**: Exercise selection based on user performance and mastery levels

## Authentication Strategy
- **Current Implementation**: Full authentication system with JWT tokens and bcrypt password hashing
- **Demo User**: Email: demo@example.com, Password: demo123
- **Scalable Design**: User ID-based data isolation with PostgreSQL database
- **Session Management**: JWT-based authentication with secure session handling

## Payment Integration (HyperPay)
- **Gateway**: HyperPay payment gateway for subscription management
- **Supported Methods**: VISA, MASTER, MADA cards
- **Environment**: HyperPay EU test server (https://eu-test.oppwa.com)
- **Authentication**: Bearer token-based API access
- **Callback Flow**: Dynamic callback URL generation based on environment
  - Development: Uses request headers to detect localhost or Replit URL
  - Callback route: `/api/payment-callback` with entityId parameter
  - Verification: Backend validates payment with HyperPay API before confirming
- **Test Cards**:
  - VISA: 4440000009900010 (Exp: 01/39, CVV: 100)
  - MASTER: 5123450000000008 (Exp: 01/39, CVV: 100)
  - MADA: 5297412484442387 (Exp: 10/26, CVV: 966)
- **Recent Fixes**:
  - Fixed plan selection mapping (Standard → standard, Premium → premium)
  - Removed duplicate shopperResultUrl assignment
  - Implemented dynamic callback URL generation
  - Added entityId passing via shopperResultUrl for correct MADA/VISA verification

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for production deployment
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web framework for API server

## UI and Styling Dependencies
- **@radix-ui/***: Accessible UI primitive components (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Dynamic className generation for component variants
- **lucide-react**: Icon library for UI elements

## Development Dependencies
- **vite**: Fast development server and build tool
- **typescript**: Type safety and development experience
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **drizzle-kit**: Database migration and schema management tools

## Browser APIs
- **Web Speech API**: Text-to-speech functionality for Arabic pronunciation
- **Responsive Design**: CSS Grid and Flexbox for multi-device compatibility
- **Local Storage**: Client-side data persistence for user preferences

## Font and Internationalization
- **Google Fonts**: Inter for English text and Amiri for Arabic text
- **RTL Support**: Right-to-left text rendering for Arabic content
- **Language Switching**: Dual-language interface with proper typography