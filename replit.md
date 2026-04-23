# Overview

This AI-powered Arabic language learning application is designed for English-speaking Quran memorizers (huffaz) to practice daily Arabic conversation. It integrates Quranic phrases and verses into interactive exercises, phrase management, and progress tracking, linking existing Quranic knowledge with practical language skills. The application also incorporates behavioral symbolism to transform Quranic phrases into applicable life lessons, aiming to foster emotional intelligence through Quranic wisdom.

The platform offers extensive content, including 160+ daily contextual exercises, 224+ Quranic phrases, 2,400+ philosophical wisdom entries, and 350 conversation prompts. The vocabulary bank covers 40 surahs: Al-Fatiha, Al-Kahf, Al-Mulk, and all 37 Juz Amma surahs (78–114), with 145+ entries and equal per-surah selection weighting (Al-Fatiha gets 30% priority). It supports a multilingual UI in English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian, Russian, Urdu, Bengali, Malay, Soso/Susu (Guinea), and French. Key capabilities include dynamic exercise generation, an adaptive learning system, robust progress tracking, and psychologically-themed exercises.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
The frontend is built with React, TypeScript, Vite, Wouter for routing, Shadcn/ui for components, and Tailwind CSS for styling (Amiri font for Arabic). It uses TanStack Query for server state management and the Web Speech API for text-to-speech. A custom i18n system with Context API supports ten languages, providing automatic RTL/LTR switching and persisting language preferences. The application maintains a consistent Quranesh logo and a respectful primary color theme.

## Backend
The backend utilizes Express.js and TypeScript (ESM) to provide a RESTful API. Zod schemas are used for data validation, and Express middleware handles JSON parsing, CORS, and logging.

## Database
A PostgreSQL database, managed by Drizzle ORM, stores phrases, conversation prompts, user progress, exercise sessions, daily statistics, symbolic meanings, and multilingual content. It includes classifications like `isPracticalDailyUse`, `usageDomain`, and `register`. The phrase bank contains 224+ Quranic expressions, significantly expanded from Surah Yusuf, covering themes of family relations, wisdom, storytelling, guidance, trust, betrayal, patience, and divine wisdom. The question bank has 132 entries, categorized by Surah (Al-Baqarah, Luqman) and themes such as Quran recitation, learning programs, and etiquette (Adab).

## Content Logic — Vocabulary Search Framework (server/content-logic.ts)
The app is a **Quranic Arabic Vocabulary Trainer** for beginners (non-Arabic speakers who memorize the Quran). Exercises follow a **Vocabulary Search** (البحث عن المفردات) gamification approach:

**Scope Restriction:** ONLY Al-Fatiha + last 20 surahs (Ad-Duha to An-Nas) — the surahs beginners memorize first.

**Exercise Types:**
- Type A: Find the Arabic Word — "في سورة [X]، ما الكلمة التي تعني [meaning]؟"
- Type B: What Does This Word Mean — "ما معنى كلمة [X] في سورة [Y]؟"
- Type C: Complete the Verse — "أكمل الآية من سورة [X]: ..."

**Strict Rules:**
1. **Surah Targeting**: Every question MUST mention the surah name explicitly
2. **Vocabulary Focus**: Questions focus on DIRECT word meaning — NO interpretation, NO emotional scenarios
3. **Simple Hints**: First letter ("الكلمة تبدأ بحرف الـ ص..."), fill-in-the-blank, or word position
4. **Beginner Level**: Focus on high-frequency Quranic words from short surahs
5. **No Abstraction**: No deep Tafsir, no complex social/emotional scenarios

**UI Labels:** "ابحث في السورة:" replaces "السيناريو:", "ما الكلمة التي تعني:" replaces "التحدي:"

This doctrine is enforced in: `server/content-logic.ts` (shared constants), `server/ai-service.ts` (validation, generation).

## Exercise System
The system offers dynamic conversation practice, role-play, and grammar transformation exercises, generated based on user knowledge and difficulty. A non-repetition system ensures continuous access to fresh exercises. Gemini AI (gemini-2.0-flash) generates new Quranic phrases and exercises, validates answers using the Trigger-Response framework, and provides real-time feedback and long-term analytics. The system prioritizes short, practical Quranic expressions for conversational use.

A **Maqasidi (purpose-based) verse selection system** maps 9 situation categories (e.g., facilitation, consolation, commitment) to appropriate verses from prophets' speech, prioritizing emotional context. It prevents the use of divine-attribute verses in routine human contexts. The system includes a `human_situations` table with 20 mapped situations, keywords, and contextual logic. Roleplay scenarios include `emotional_state` and `verse_source` fields, with 60 scenarios covering various emotional states — each scenario is a direct paraphrase of its assigned verse's meaning.

The application features 350 conversation prompts for diverse daily situations, including 48 practical daily scenarios and 49 phonetic practice exercises focused on Quranic supplications with detailed phonetic notes.
There are 60 psychological roleplay scenarios, covering 25+ psychological themes like hope, trust, anxiety, and resilience, all designed to elicit thoughtful Quranic responses.
Daily contextual exercises are the primary exercise type, offering multiple-choice questions with AI semantic validation to accept contextually appropriate Quranic expressions beyond strict keyword matching. Multilingual display logic ensures content is presented in the user's preferred language with appropriate fallbacks.
Specialized **Psychological Daily Exercises** (55+) cover 11 psychological themes, presenting emotionally resonant scenarios paired with Quranic guidance.
The **Philosophical Match Exercise** pairs 2,400+ universal philosophical wisdom entries (excluding direct Quranic references) with relevant Quranic words, phrases, or verses.

The **frontend recall workflow** ensures active learning: no "Show Solution" button before submission, hints show only the first word of the verse, and the full verse is revealed only after the user submits their answer.

## Automated Self-Explanation Exercise
A new 3-phase exercise type at `/self-explanation` that combines MCQ selection with AI-graded self-explanation:
1. **Phase 1 (MCQ)**: Learner selects the correct Quranic word from 4 options
2. **Phase 2 (Explain)**: After answering, learner writes a short explanation of why the word fits the verse
3. **Phase 3 (Feedback)**: AI evaluates the explanation against approved DB reference data (Tafsir al-Tabari) and returns 3 scores

**Key constraint**: The LLM does NOT generate its own Tafsir. It evaluates only against `approved_context_reason`, `accepted_keywords`, `rejected_keywords` stored in `tabari_exercises`. If `approved_context_reason` is NULL, the exercise is excluded (server returns 422).

**Score dimensions**: `semantic_accuracy_score`, `context_link_score`, `precision_score` (each 0-100). Also detects `source_conflict` (learner introduced unsupported meaning) and `missing_context_link`.

**DB additions**: New columns on `tabari_exercises` (`approved_context_reason`, `accepted_keywords`, `rejected_keywords`, `approved_meaning`) + new `self_explanation_attempts` table. All 298 active exercises pre-populated with `approved_context_reason` from `promptEn`.

**Routes**: `GET /api/self-explanation/random`, `POST /api/self-explanation/evaluate`, `GET /api/admin/self-explanation-stats`. Frontend function: `evaluateSelfExplanation()` in `server/ai-service.ts`.

**Admin keyword management**: A dedicated "كلمات الطبري" (Tabari Keywords) tab in the admin panel (`/admin`) lets admins set `accepted_keywords`, `rejected_keywords`, `approvedContextReason`, and `approvedMeaning` per exercise via an inline accordion editor. Routes: `GET /api/admin/tabari-exercises?surah=N`, `PATCH /api/admin/tabari-exercises/:id/keywords`, `POST /api/admin/tabari-seed-keywords`. The seed route populates Al-Fatiha (surah 1) exercises with Tafsir al-Tabari based keywords (idempotent — skips already-set rows). Seeding logic lives in `server/seed-tabari-keywords.ts`.

## Global Quranic Chat
Real-time chat system with 11 language-specific rooms (English, French, Indonesian, Urdu, Turkish, Russian, Spanish, Bengali, Hindi, German, Swahili). Uses Socket.io for bi-directional messaging and Gemini AI for automatic Arabic↔target-language translation. Messages are persisted in the `chat_messages` table. The chat is accessible at `/chat` with a lobby showing all rooms and individual chat room views with WhatsApp-style message bubbles. Each message shows the translated text with a "Show original" toggle for learning.

## Translation Management
An administrative `/translation-manager` interface allows bulk translation of philosophical sentences and conversation prompts into 9 languages using Gemini AI, providing statistics, single-sentence translation, and robust error handling.

## Authentication
The application uses JWT tokens and bcrypt for secure user authentication, supporting a demo user and ensuring data isolation. Users have a `userType` field (sponsor, self_funded, sponsored_student) and `scholarshipStatus` field (none, waiting, active).

## Payment & Subscription System
HyperPay's COPYandPAY Widget handles payments (VISA/Mastercard/MADA), with credentials loaded exclusively from environment variables (HYPERPAY_PROD_* for production, HYPERPAY_* for test). The `subscriptions` table tracks active user subscriptions with plan type, amount, start/end dates, transaction ID, and `grantedReason`. Plans: learner (10 SAR/year), sponsor-5 (50 SAR/year, sponsors 5 learners), sponsor-10 (100 SAR/year, sponsors 10 learners), certificate (40 SAR one-time). The `/api/subscription-status` endpoint checks subscription validity; admin users bypass subscription requirements. The `SubscriptionGate` component on the frontend blocks exercise access for non-subscribed users.

## Legacy Free Access (Grandfathered Users)
All 121 users registered before the fixed cutoff date `2026-03-08T00:00:00.000Z` receive permanent free access. 

**User fields**: `isLegacyFree` (bool), `legacyCutoffGroup` = "before_payment_update_2026_03_08", `registrationSource` = "legacy_before_payment_update".

**Subscription fields for legacy**: `planType` = "legacy_free", `paymentStatus` = "waived", `accessStatus` = "active", `billingRequired` = false, `expiresAt` = null, `endDate` = 2099-12-31, `status` = "active". New subs also set `paymentStatus`, `accessStatus`, `billingRequired`, `expiresAt` for paid subs.

The `/api/subscription-status` endpoint checks `isLegacyFree` before the normal subscription check and returns `{ hasActiveSubscription: true, isLegacyFree: true, plan: "legacy_free" }`. An idempotent `runLegacyBackfill()` runs at every server startup (routes.ts) — marks users, creates missing subscriptions, and patches existing legacy subs with new semantic fields. A `lastBackfillRun` timestamp is tracked in-process and exposed via `/api/admin/legacy-stats`. A dismissible amber banner with 3 parts (badge, activated message, subtitle) is shown to legacy users. Translation keys: `legacyAccessActivated`, `legacyAccessSubtitle`, `legacyAccessBadge` (all 13 languages). Admin tab "الوصول المجاني القديم" shows 5 stat cards (legacy, sponsored, paid, self-funded, total) + last backfill time + re-run button.

## Scholarship Wallet System
Three user paths on signup: Sponsor (الكافل), Self-Funded Student (الطالب المستقل), Sponsored Student (طالب المنحة). The `sponsorships` table tracks sponsor donations with total_seats/used_seats, and `scholarship_matches` links students to sponsors. When a sponsor pays, seats are added to the wallet. Sponsored students get auto-assigned if seats are available, otherwise placed on a waiting list. The `assignWaitingStudents()` function uses atomic SQL updates to prevent race conditions. Key endpoints: `/api/scholarship/availability`, `/api/scholarship/status`, `/api/admin/sponsorships`. The `/scholarship-status` page shows waiting list information.

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