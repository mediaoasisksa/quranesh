# Overview

This is an AI-powered Arabic language learning application specifically designed for Quran memorizers (huffaz) who speak English. The application helps users practice daily Arabic conversation using Quranic phrases and verses they have already memorized. It combines their existing Quranic knowledge with practical language skills through interactive exercises, phrase management, and progress tracking.

## Recent Updates (October 30, 2025)
- **Major Content Expansion**: Added 200 new Quranic phrases/sentences from comprehensive input file
  - Added 40 conversation prompts including greetings, advice, encouragement, supplications, and ethical guidance
  - Added 120 roleplay phrases (commands, prohibitions, supplications) - critical expansion from only 15 to 135 phrases
  - Added 40 philosophical sentences containing wisdom and deep meanings
  - **Total database content: 162 conversation prompts, 135 roleplay phrases, 2,433 philosophical sentences**
  - All new content sourced from Quranic verses with authentic English translations
  - Balance achieved across all three exercise types
- **Dashboard Layout Updated**: Training Exercises section now appears at the TOP of the dashboard for better user experience
- **Conversation Exercise Enhanced**: Now uses database-backed prompts with 122 Arabic conversation questions and suggested Quranic verse responses
  - Database table `conversation_prompts` stores questions like "متى يصل القطار", "هل أخذت دواءك", "من يشتري؟", etc.
  - Each prompt has a suggested Quranic verse (e.g., "والعصر", "وتعاونوا على البر والتقوى", "ويل للمطففين")
  - After AI validation, suggested verse is displayed to users
  - Non-repetition system filters out completed prompts per user
  - Frontend uses React Query with userId-specific cache keys
  - "Next Exercise" button stays within conversation exercise flow
- **Non-Repetition System Verified**: Users never see the same exercise twice. System properly tracks completed exercises in database and filters them out using SQL queries. E2E testing confirmed 3 consecutive exercises showed different questions.
- **Exercise Count Reduced**: Now showing 3 exercise types instead of 7 (Substitution, Completion, Comparison and Thematic exercises hidden as per user request).
- **Navigation Improved**: All exercise navigation uses client-side routing (wouter's setLocation) instead of full page reloads, maintaining React Query cache and improving performance.

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
- **Conversation Prompts Table**: Stores 162 Arabic conversation questions with suggested Quranic verses covering greetings, advice, encouragement, trust, manners, business ethics, worship, and supplications
- **User Progress**: Tracks mastery levels and practice statistics per phrase
- **Exercise Sessions**: Records individual exercise attempts and results (used for non-repetition filtering)
- **Daily Statistics**: Aggregates daily usage and performance metrics
- **Schema Management**: Drizzle ORM with PostgreSQL dialect for database operations

## Exercise System Architecture
- **Exercise Types**: Three different exercise patterns including conversation practice, role-play scenarios, and grammar transformation (Substitution, Completion, Comparison and Thematic hidden)
- **Conversation Exercise**: 
  - Database-backed with 162 Arabic conversation prompts covering daily topics (greetings, advice, encouragement, consolation, trust, manners, business ethics, worship, supplication, unity, charity, family, speech, and reminders)
  - Each prompt paired with suggested Quranic verse response
  - Users write relevant Quranic verses that convey similar meanings
  - AI validates verse relevance, then displays suggested verse
  - "Next Exercise" button stays within conversation flow
- **Dynamic Content**: Exercises are generated based on user's current phrase knowledge and difficulty progression
- **Non-Repetition System**: 
  - Backend filters out completed exercises per user and exercise type
  - Frontend uses userId-specific React Query cache keys: `["/api/conversation-prompts/random", userId]`
  - Cache invalidation after each exercise completion prevents repeated prompts
  - Server queries `exercise_sessions` table to filter completed prompts via SQL `notInArray`
  - Works seamlessly across all exercise types (phrases, philosophical sentences, conversation prompts)
- **AI Question Generation**: When users exhaust all database questions, Gemini AI generates new authentic Quranic phrases and exercises
- **Progress Tracking**: Real-time feedback and long-term progress analytics
- **Adaptive Learning**: Exercise selection based on user performance and mastery levels

## Authentication Strategy
- **Current Implementation**: Full authentication system with JWT tokens and bcrypt password hashing
- **Demo User**: Email: demo@example.com, Password: demo123
- **Scalable Design**: User ID-based data isolation with PostgreSQL database
- **Session Management**: JWT-based authentication with secure session handling

## Payment Integration (HyperPay)
- **Gateway**: HyperPay COPYandPAY Widget integration for subscription management
- **Supported Methods**: VISA, MASTER, MADA cards
- **Environment**: Auto-detection (Production or Test)
  - **Production**: https://eu-prod.oppwa.com (when production credentials are configured)
  - **Test**: https://eu-test.oppwa.com (fallback when no production credentials)
- **Currency**: SAR (Saudi Riyal) only for production
- **Authentication**: Bearer token-based API access via secure environment variables
- **Production Credentials** (stored as encrypted secrets):
  - HYPERPAY_PROD_ACCESS_TOKEN
  - HYPERPAY_PROD_ENTITY_ID_VISA_MASTER
  - HYPERPAY_PROD_ENTITY_ID_MADA
- **Integration Pattern**: Follows official HyperPay Widget documentation
  - Step 1 (Backend): Server-to-server POST to create checkout with `integrity: true` parameter
  - Step 2 (Frontend): Load widget script with SRI (Subresource Integrity) verification
  - Step 3 (Frontend): Form action attribute set to callback URL (shopperResultUrl)
  - Step 4 (Backend): Callback validates payment status via GET request to resourcePath
- **Callback Flow**: 
  - Dynamic callback URL generation based on environment (localhost/Replit)
  - Callback route: `/api/payment-callback?entityId={entityId}`
  - entityId query parameter ensures correct MADA/VISA verification
  - Backend validates payment with HyperPay API before redirecting to success page
- **Security Features**:
  - Integrity hash verification for widget script loading (SRI)
  - Cross-origin iframe for card input (PCI compliance)
  - Dynamic entity ID selection based on payment method
  - Production credentials stored as encrypted environment secrets
- **Mandatory Fields** (all validated and sent):
  - merchantTransactionId (unique per transaction)
  - customer.email, customer.givenName, customer.surname
  - billing.street1, billing.city, billing.state, billing.country, billing.postcode
- **Implementation Details**:
  - Backend auto-detects production vs test mode based on environment variables
  - Backend creates checkout without shopperResultUrl (set on frontend instead)
  - Backend returns formatted integrity hash and dynamic widget URL
  - Frontend loads widget with integrity and crossorigin attributes
  - Frontend sets shopperResultUrl via form action attribute as per HyperPay docs
  - Payment widget uses cross-origin iframes for secure card data collection

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