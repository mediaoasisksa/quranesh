# Overview

This AI-powered Arabic language learning application assists English-speaking Quran memorizers (huffaz) in daily Arabic conversation practice. It integrates Quranic phrases and verses into interactive exercises, phrase management, and progress tracking, aiming to connect existing Quranic knowledge with practical language skills. The application also includes behavioral symbolism to transform Quranic phrases into applicable life lessons.

The platform offers comprehensive content with 160+ daily contextual exercises, 224+ Quranic phrases and expressions, 2,400+ philosophical wisdom entries, and 350 conversation prompts. It supports a multilingual UI and content in English, Bahasa Indonesia, Turkish, Arabic, Chinese, Swahili, Somali, Bosnian, Albanian, and Russian. Key features include dynamic exercise generation, an adaptive learning system, robust progress tracking, and psychologically-themed exercises that connect Quranic wisdom with emotional intelligence. A "Quranic Expressions in Daily Life" section respectfully showcases practical uses of Quranic verses in everyday situations, with AI-generated and translated content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend uses React with TypeScript, Vite, Wouter for routing, Shadcn/ui for components, and Tailwind CSS for styling (Amiri font for Arabic). TanStack Query manages server state, and the Web Speech API provides text-to-speech. A custom i18n system with Context API supports ten languages, offering automatic RTL/LTR switching and persisting language preferences. The application features a consistent Quranesh logo and a respectful primary color theme.

## Backend Architecture
The backend is built with Express.js and TypeScript (ESM), providing a RESTful API. Zod schemas ensure data validation, and Express middleware handles JSON parsing, CORS, and logging.

## Database Schema Design
A PostgreSQL database, managed by Drizzle ORM, stores phrases, conversation prompts, user progress, exercise sessions, daily statistics, and symbolic meanings. It includes fields for multilingual content, classification (e.g., `isPracticalDailyUse`, `usageDomain`, `register`), and real-life examples with bilingual situations, Quranic verses, and usage notes. The phrase bank now contains 224+ Quranic expressions, with significant expansion from Surah Yusuf (November 2025): 13 initial conversational phrases covering family relations (يا أبت، يا بني), wisdom and understanding (لعلكم تعقلون، آيات للسائلين), storytelling (نحن نقص عليك أحسن القصص), guidance and protection (لا تقصص رؤياك، فيكيدوا لك كيداً), and spiritual concepts (تأويل الأحاديث، يتم نعمته، وكذلك يجتبيك). An additional 40 phrases from Surah Yusuf were added covering themes of trust and betrayal (ما لك لا تأمنا، وإنا له لناصحون، وإنا له لحافظون), jealousy and conspiracy (أحب إلى أبينا منا، إن أبانا لفي ضلال مبين، اطرحوه أرضاً، والقوه في غيابة الجب), deception and false evidence (وجاؤوا أباهم عشاء يبكون، فأكله الذئب، وجاؤوا على قميصه بدم كذب), patience and reliance on Allah (فصبر جميل، والله المستعان على ما تصفون، بل سولت لكم أنفسكم أمراً), undervaluation and exploitation (وشروه بثمن بخس دراهم معدودة، وكانوا فيه من الزاهدين، وأسروه بضاعة), and divine wisdom (إن ربك عليم حكيم، والله عليم بما يعملون). These expressions enable learners to navigate complex emotional and social situations using authentic Quranic language.

### Question Bank Database (Updated November 2025)
The application now contains **132 question bank entries** organized by Surah and theme:
- **62 Questions from Surah Al-Baqarah**: Covering divine commandment, obedience, moderation, guidance, and foundational Islamic concepts
- **20 Questions about Quran Recitation & Learning Program**: Topics include tarteel (melodious recitation), memorization, contemplation, teaching, and night study
- **50 Questions about Adab (Conduct & Etiquette) from Surah Luqman**: Covering speech etiquette, conduct, walking with modesty, respecting others, humility, and proper behavior in all situations

All questions are linked to Quranic expressions enabling contextual language learning across diverse life situations.

## Exercise System Architecture
The system offers conversation practice, role-play, and grammar transformation exercises, dynamically generated based on user knowledge and difficulty. A non-repetition system prevents duplicate exercises while allowing repetition after all exercises are completed to ensure continuous practice availability. Gemini AI generates new Quranic phrases and exercises when needed and validates answers, accepting partial verses. Real-time feedback, long-term analytics, and adaptive learning are core components. The system prioritizes short, practical Quranic expressions for conversation exercises.

**Conversation Practice Exercises**: The application features 350 conversation prompts covering diverse daily situations including gratitude, patience, hope, justice, consultation, forbearance, forgiveness, trust, self-worth, and many more practical scenarios. Recent additions (November 2025) include:
- 48 exercises covering practical daily scenarios: gratitude after help, encouragement during stress, hope after hardship, reliance on Allah, recognizing hidden blessings, appreciation of provisions, mercy and knowledge, justice and fairness, good speech, charitable giving, avoiding mockery and suspicion, balance between religion and worldly life, covenant fulfillment, consultation in decision-making, contentment with divine decree, social change, and supplications for family and strength.
- 49 phonetic practice exercises focused on Quranic supplications (أدعية قرآنية) with detailed phonetic notes for pronunciation training. Each exercise includes: situation context, instructional guidance, Quranic verse/phrase, and specific phonetic observations highlighting sound patterns, articulation points, rhythm, and vocal characteristics to help learners master Arabic pronunciation through authentic Quranic expressions.

All exercises include both Arabic situations and English translations with suggested Quranic verses.

**Roleplay Scenarios**: The application now includes 60 psychological roleplay scenarios stored in the database (roleplay_scenarios table), designed to help users practice real-life situations through Quranic responses. These scenarios cover 25+ psychological themes including hope, trust, self-worth, anxiety, grief, patience, acceptance, faith, forgiveness, resilience, sincerity, contentment, and more. Each scenario presents emotionally-resonant situations requiring thoughtful Quranic responses, with full Arabic and English support. The system randomly selects scenarios while preventing repetition through user progress tracking. Recent additions (November 2025) include 10 sincerity-focused scenarios exploring hidden rewards, divine promises, and the relationship between sincere deeds and unseen blessings, all based on the Quranic verse: ﴿ فلا تعلم نفس ما أخفي لهم من قرة أعين جزاء بما كانوا يعملون ﴾. A translation automation script (`add-roleplay-scenario-translations.ts`) is available to populate translations for the remaining 8 languages (Indonesian, Turkish, Chinese, Swahili, Somali, Bosnian, Albanian, Russian) when API quota is available, with retry logic and merge functionality. Until translations complete, non-Arabic/English languages display the Arabic scenario text as fallback.

Daily contextual exercises are the **primary/default exercise type**, displayed first on the dashboard. They feature 4 multiple-choice options (1 correct Quranic expression + 3 thematically-varied distractors). Schema validation enforces exactly 3 distractors per exercise. The seed script programmatically selects the 3rd distractor from a pool of thematically-distinct expressions to maintain exercise quality and prevent theme overlap. **AI Semantic Validation**: Unlike strict ID matching, the system uses Gemini AI to analyze semantic meaning and accept multiple contextually-appropriate Quranic expressions, prioritizing vocabulary understanding for Arabic language learners. This allows learners to select semantically-valid alternatives (e.g., both "رَبَّنا أَتمِم لَنا نورَنا" and "رَبَّنا آتِنا مِن لَدُنكَ وَلِيّاً" are accepted for "help me overcome my shortcomings" since both express seeking divine help to address deficiency). 

**Multilingual Display:** Daily sentences use language-aware display logic - Arabic users see `arabicText` with RTL formatting, English users see `englishText`, and users of other languages (Indonesian, Turkish, Chinese, Swahili, Somali, Bosnian, Albanian, Russian) see their translation from the `translations` JSONB field with a fallback chain: `translations[language]` → `englishText` → "Translation not available". Arabic text is shown as a secondary reference below for non-Arabic/English languages. All 160 sentences have `arabicText` and `englishText` populated (100% coverage). A translation automation script (`add-daily-sentence-translations.ts`) is available to populate missing translations using Gemini AI with retry/backoff logic and merge functionality.

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
