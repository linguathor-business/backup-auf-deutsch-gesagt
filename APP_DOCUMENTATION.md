# Auf Deutsch Gesagt – Complete App Documentation

## Overview

**Auf Deutsch Gesagt** (English: "Said in German") is a modern, web-based German language learning platform that teaches high-intermediate vocabulary and grammar through **12 narrative-driven modules**, each centered around a core German verb and its idiomatic expressions.

**Tech Stack**: Next.js 16 · React 19 · TypeScript · Zustand · Tailwind CSS v4 · Google Gemini API · ElevenLabs TTS

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication System](#authentication-system)
3. [Module System](#module-system)
4. [Story & Audio Synchronization](#story--audio-synchronization)
5. [Flashcard System (SRS)](#flashcard-system-spaced-repetition)
6. [Exercise System](#exercise-system)
7. [API Routes](#api-routes)
8. [Progress Tracking](#progress-tracking)
9. [State Management](#state-management)
10. [Design System & Styling](#design-system--styling)
11. [Key Implementation Details](#key-implementation-details)

---

## Architecture Overview

### Project Structure

```
auf-deutsch-gesagt/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (hero + features)
│   │   ├── login/page.tsx        # Login form
│   │   ├── register/page.tsx     # Registration form
│   │   ├── dashboard/page.tsx    # User dashboard & module list
│   │   ├── module/[slug]/page.tsx # Individual module page
│   │   ├── progress/page.tsx     # Progress analytics
│   │   └── api/                  # Backend endpoints
│   │       ├── chatbot/route.ts
│   │       ├── check-answer/route.ts
│   │       ├── tts/route.ts
│   │       └── debug/route.ts
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation & user info
│   │   ├── ModuleCard.tsx        # Module preview cards
│   │   ├── StoryPlayer.tsx       # Audio player + story
│   │   ├── ExerciseArea.tsx      # Exercise container
│   │   ├── VocabularyLab.tsx     # Verb/idiom explorer
│   │   ├── ThemeToggle.tsx       # Dark/light mode
│   │   └── flashcards/
│   │       ├── FlashcardFront.tsx
│   │       ├── FlashcardBack.tsx
│   │       ├── FlashcardModal.tsx
│   │       └── SessionSummary.tsx
│   ├── data/
│   │   └── modules.ts            # Complete curriculum (12 modules)
│   ├── lib/
│   │   ├── srs.ts               # Spaced repetition algorithm
│   │   ├── flashcard-data.ts    # Card generation logic
│   │   ├── use-flashcard-keyboard.ts
│   │   ├── use-tts.ts           # TTS hook
│   │   └── pcm-to-wav.ts        # Audio encoding
│   ├── store/
│   │   ├── auth.ts              # User authentication
│   │   ├── progress.ts          # Module completion tracker
│   │   └── flashcards.ts        # SRS state & streaks
│   ├── types/
│   │   ├── index.ts
│   │   └── flashcards.ts
│   └── globals.css              # Theme & global styles
├── public/
│   ├── images/                  # Module images
│   ├── robin-landing-page.jpeg  # Instructor photo on landing
│   ├── robin-inside-app.jpeg    # Instructor photo on dashboard
│   └── audio/                   # Cached audio files (OPUS format)
└── scripts/
    ├── generate-modules.mjs     # Build module data
    └── update-exercises.mjs     # Sync exercise content

```

### Data Flow

```
Landing Page
    ↓
[Register/Login] → Auth Store (localStorage)
    ↓
Dashboard (Module List + Progress)
    ├─ Displays 12 modules with lock status
    ├─ Shows completion %, due flashcards, streaks
    └─ Admin toggle to unlock all modules
    ↓
Module Page [Click Module Card]
    ├─ Story Reader (with audio sync)
    │  └─ Click verbs → VocabularyLab overlay
    ├─ Vocabulary Lab (verb definitions & examples)
    ├─ Exercise Area (12+ exercise types)
    │  ├─ Known-answer exercises → instant feedback
    │  ├─ AI-graded exercises → /api/check-answer
    │  └─ Speaking exercises → /api/chatbot
    └─ Update Progress Store on completion

Anytime: Flashcard Modal (from dashboard)
    └─ SRS session with due cards
    └─ Mark "Again" or "Good" → update SRS state
    └─ Session summary with streak tracking

```

---

## Authentication System

### Overview

The app uses **client-side authentication** with localStorage perseverance. No backend database is required.

### Flow

1. **Registration** (`/register`)
   - User provides: Name, Email, Password (≥4 chars)
   - On submit:
     - Unique user ID generated: `btoa(email).slice(0, 12)` (base64 encode)
     - User object stored in auth store
     - Progress initialized via `initProgress(userId)`
     - Redirect to `/dashboard`

2. **Login** (`/login`)
   - User provides: Email, Password
   - Simple validation (email + password ≥4 chars)
   - Same user ID generation & redirect flow
   - Admin quick-login button (hardcoded demo account)

3. **Session Persistence**
   - Auth store persisted to localStorage key: `adg-auth`
   - User data structure:
     ```typescript
     {
       id: string;          // Unique user ID
       email: string;       // User email
       name: string;        // Display name
     }
     ```

4. **Protected Routes**
   - `/dashboard`, `/progress`, `/module/*` check `useAuthStore.isAuthenticated`
   - Unauthenticated users redirected to `/login`

---

## Module System

### Module Overview

The curriculum is **12 modules** + **3 review modules** (after modules 4, 8, 12).

Each **core module** focuses on one primary German verb and includes:

| Component | Details |
|-----------|---------|
| **Story** | 3,000–4,000 word narrative featuring the verb in context |
| **Core Verbs** | 4–6 related verbs (e.g., ziehen, einziehen, ausziehen, vorziehen, durchziehen) |
| **Idioms** | 5–8 thematic expressions (e.g., "in die Länge ziehen", "die Hütte brennt") |
| **Exercises** | 10–12 exercises across 4 skills (Listening, Reading, Speaking, Writing) |
| **Audio** | Full story narration (MP3/OPUS, 5–8 min), cached on Cloudflare R2 |

### Module Structure (Example: Module 1 – "Der Umzug" / Verb: ziehen)

**06 Content Sections** (tracked in progress):
1. ✓ Story read
2. ✓ Vocabulary explored
3. ✓ Listening exercises completed
4. ✓ Reading exercises completed
5. ✓ Speaking exercises completed
6. ✓ Writing exercises completed

**Module Unlocking**:
- Modules unlock **linearly**: Complete Module 1 to unlock Module 2, etc.
- **Admin Mode** bypasses this: Toggle via dashboard to unlock all modules instantly (for testing)
- Review modules unlock after their prerequisite (e.g., Review 1 after Module 4)

### Module Data Structure (src/data/modules.ts)

```typescript
interface CourseModule {
  id: number;              // 1-12
  title: string;           // "Der Umzug", "Alles mitgebracht?", etc.
  focusVerb: string;       // Primary verb: "ziehen", "bringen", etc.
  isReviewModule: boolean; // true for Review modules
  story: {
    text: string;          // Full narrative (3000+ words)
    audioUrl: string;      // CDN link to MP3/OPUS
    timestamps: Array<{    // Sentence sync points
      sentenceId: string;
      sentence: string;
      start: number;       // Seconds (e.g., 5.2)
      end: number;         // Seconds (e.g., 8.7)
    }>;
  };
  coreVerbs: Array<{       // 4-6 verbs with definitions
    german: string;
    english: string;
    definition: string;    // German explanation
    example: string;       // Example sentence
  }>;
  idioms: Array<{          // 5-8 idiomatic expressions
    german: string;
    english: string;
    definition: string;
    example: string;
  }>;
  exercises: Array<{       // 10-12 exercises, varying types
    id: string;
    type: "gap-fill" | "true-false" | "matching" | ...;
    skill: "lesen" | "hoeren" | "sprechen" | "schreiben";
    // (type-specific fields below)
  }>;
  reviewItems: Array<{     // Callbacks to previous modules
    moduleId: number;
    verbs: string[];
  }>;
}
```

### Module Slug URL

- Module pages accessed via `/module/[slug]` where slug = module ID + title
- Example: `/module/1-der-umzug` (Module 1)

---

## Story & Audio Synchronization

### StoryPlayer Component

**Location**: `src/components/StoryPlayer.tsx`

**Purpose**: Display story text with synchronized audio playback; highlight verbs/idioms; play individual sentences.

### How It Works

1. **Audio Playback**
   - Audio hosted on Cloudflare R2 (OPUS format, 64kbps)
   - Play/pause/skip controls
   - Current playback time tracked in state
   - Sentence boundaries stored in `timestamps` array

2. **Sentence Synchronization**
   - As audio plays, component checks: `currentTime` vs. `timestamp.start` & `timestamp.end`
   - When time falls within a sentence's range → highlight that sentence
   - User can click a sentence to seek to its start time

3. **Word Interaction**
   - Story text parsed for verbs/idioms matching `coreVerbs` & `idioms`
   - Hover/click a verb → **VocabularyLab overlay** displays:
     - German word
     - English translation
     - German definition
     - Example sentence with context
     - [Speaker button] to hear the word/sentence

4. **TTS Fallback**
   - If no pre-recorded audio available → use ElevenLabs TTS via `/api/tts`
   - Hash-based caching to avoid duplicate requests

### Audio Format & Delivery

- **Format**: OPUS (efficient compression, ~2–3 MB per story)
- **CDN**: Cloudflare R2 (fast global delivery)
- **Fallback**: MP3 if OPUS unsupported

---

## Flashcard System (Spaced Repetition)

### Overview

The **Spaced Repetition System (SRS)** helps users internalize 150+ vocabulary items via scientifically-backed review intervals.

### Algorithm

**Intervals** (when user marks "Good"):
- 10 seconds → 1 minute → 10 minutes → 1 hour → 1 day → 3 days → 7 days

**Reset** (when user marks "Again"):
- Card immediately returns to 10-second interval

**Mastery**:
- Card reaches "Mastered" status at 7-day interval
- Mastered cards shown in stats but remain reviewable

**Streaks**:
- Consecutive days of flashcard practice tracked
- Displayed on dashboard as motivation ("🔥 5-day streak")

### Card Types

#### 1. **Erkennen** (Recognize)
- **Front**: Display German word + speaker button
  - No example sentence shown (per recent updates)
- **Back**: Flip reveals:
  - German word (with speaker button)
  - Definition (German) (with speaker button)
  - Example sentence (with speaker button)
  - Buttons: "Nochmal" (Again) / "Gewusst" (Good)

#### 2. **Aktivieren** (Produce)
- **Front**: Display German definition
  - No example sentence shown
- **Back**: Flip reveals:
  - Definition (German)
  - German word/expression (answer)
  - Example sentence
  - "Nochmal" / "Gewusst" buttons

### Card Generation

**Source**: Every module's `coreVerbs` & `idioms` generate flashcards:

```typescript
coreVerbs.forEach(v => {
  cards.push({
    id: `m${moduleId}-verb-${v.german}`,
    moduleId,
    german: v.german,
    definition: v.definition,
    example: v.example,
    source: "verb"
  });
});

idioms.forEach((idiom, idx) => {
  cards.push({
    id: `m${moduleId}-idiom-${idx}`,
    moduleId,
    german: idiom.german,
    example: idiom.example,
    source: "idiom"  // "jemanden aufziehen", "etwas durchziehen", etc.
  });
});
```

**Total Cards**: 150+ across all modules.

### SRS State Storage

```typescript
srsData: {
  [cardId]: {
    interval: number;      // Milliseconds until next review
    lastReviewDate: string; // ISO date string
    easeFactor: number;    // Difficulty multiplier (not explicitly used)
    reps: number;          // Total reviews
    nextReviewDate: string; // When due
  }
}

removedCards: string[];    // Card IDs permanently removed by user
streakData: {
  currentStreak: number;   // Consecutive days practiced
  lastPracticeDate: string;// Last session date
  longestStreak: number;   // All-time record
}
```

### Flashcard Session Flow

1. **Dashboard**: Show due cards count & current streak
2. **Click "Karteikarten üben"**: Open FlashcardModal
3. **Shuffle & Load**: Get all due cards, shuffle randomly
4. **Study Loop**:
   - Front → [Click/Spacebar] → Back
   - User marks "Nochmal" (reset interval) or "Gewusst" (advance)
   - Update SRS state
   - Show next card
5. **Session Summary**:
   - Cards studied: N
   - Mastered: M
   - Streaks updated
   - Return to dashboard

---

## Exercise System

### Exercise Types

The app supports **12 exercise types** across 4 skills (Lesen, Hören, Sprechen, Schreiben).

#### **Reading (Lesen) Exercises**

| Type | Mechanism | Feedback |
|------|-----------|----------|
| **Gap-Fill** | User types word in blank; word bank provided | Instant (exact match or fuzzy) |
| **Multiple Choice** | Select one option from 4 | Instant |
| **True-False** | Mark statements as correct/incorrect | Instant |
| **Matching** | Connect left items to right items | Instant |
| **Cloze-Select** | Dropdowns for each gap | Instant |
| **Error Correction** | Fix 1 error per sentence | Instant |
| **Verb Grouping** | Categorize verbs into groups | Instant |

#### **Writing (Schreiben) Exercises**

| Type | Mechanism | Feedback |
|------|-----------|----------|
| **Sentence Completion** | Complete a sentence prompt (e.g., "Ohne dich wäre ich...") | AI-graded via `/api/check-answer` |
| **Open Writing** | Free-form essay (prompt + must-use words) | AI feedback via Gemini |

#### **Speaking (Sprechen) Exercises**

| Type | Mechanism | Feedback |
|------|-----------|----------|
| **Speaking** | Record audio; transcribe via Web Audio API | Transcription compared to expected |
| **Chatbot** | Multi-turn conversation with AI | AI response via Gemini 2.5 Flash |

#### **Learning (Lesen) Exercises**

| Type | Purpose |
|------|---------|
| **Info-Box** | Educational display (e.g., verb conjugation table) |

### Verb Detection Logic

**Separable Verbs** like "aufziehen" have flexible word order. Detection logic:

1. **Direct match**: "aufziehen" in text
2. **Past participle**: "aufgezogen", "aufgezog" (typo-tolerant)
3. **Separated form**: "zieht ... auf" (captures "auf" anywhere within 5 words)
4. **Prefix variations**: Matches common prefixes (auf-, aus-, ein-, mit-, um-, unter-, weg-, vor-, durch-)

**Example**:
```
Verb: "aufziehen"
Stem: "ziehen" (after removing prefix "auf")
Text: "Sie hat ihre Kinder allein aufgezogen."
Match: ✓ (aufgezogen matches past participle)
```

### AI Grading

**Endpoint**: `POST /api/check-answer`

**Flow**:
1. User submits written/spoken response
2. Request sent with: prompt, userAnswer, mustUseWords[], modelAnswer
3. Gemini 2.5 Flash evaluates against rubric:
   - Grammar correctness
   - Vocabulary usage (especially must-use words)
   - Meaning/relevance
   - Completeness
4. Returns: Score (0–10), Feedback (German), Highlights key issues

**Error Handling**:
- 3 retry attempts with exponential backoff (500ms base)
- Falls back to generic feedback if API fails

---

## API Routes

### `/api/chatbot` (POST)

**Purpose**: Multi-turn conversation partner for speaking practice.

**Request**:
```json
{
  "messages": [
    { "role": "user", "content": "Ich bin bei einem Umzug." }
  ],
  "language": "de",
  "prompt": "You are a friendly German language tutor..."
}
```

**Response**:
```json
{
  "content": "Das ist großartig! Wie lange planst du für den Umzug ein?",
  "role": "assistant"
}
```

**Model**: Gemini 2.5 Flash (fast, 1M input tokens)

---

### `/api/check-answer` (POST)

**Purpose**: AI evaluation of open-ended exercises.

**Request**:
```json
{
  "userAnswer": "Ich habe Angst, aber ich durchziehe das.",
  "prompt": "Ergänze den Satz sinnvoll.",
  "mustUseWords": ["durchziehen"],
  "modelAnswer": "Ich durchziehe dieses Projekt bis zum Ende."
}
```

**Response**:
```json
{
  "score": 8,
  "feedback": "Gute Antwort! Du hast 'durchziehen' korrekt verwendet...",
  "usedMustWords": ["durchziehen"],
  "missingMustWords": []
}
```

**Scoring Rubric**:
- Correct verb usage: +3 points
- Grammar: +2 points
- Word order: +2 points
- Meaning/relevance: +2 points
- Must-use words: +1 point

---

### `/api/tts` (POST)

**Purpose**: Text-to-speech caching via ElevenLabs.

**Request**:
```json
{
  "text": "Du ziehst mich doch gerade bloß auf.",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Response**:
- Returns audio bytes (WAV format)
- Cached locally with SHA256 hash of text to avoid redundant API calls

**Voice**: German female voice (EXAVITQu4vr4xnSDxMaL)

**Caching**:
- Hash = SHA256(text)
- Stored in browser cache; subsequent requests return cached version

---

### `/api/debug` (GET)

**Purpose**: Placeholder for debugging (unused in production).

---

## Progress Tracking

### Data Structure

```typescript
interface UserProgress {
  userId: string;
  currentModule: number;          // Currently viewing
  modules: {
    [moduleId]: {
      started: boolean;           // User opened the module
      completed: boolean;         // All 6 sections done
      sections: {
        story: boolean;
        vocabulary: boolean;
        exercises: {
          lesen: boolean;
          hoeren: boolean;
          sprechen: boolean;
          schreiben: boolean;
        };
      };
      exerciseAnswers: {
        [exerciseId]: {
          answered: boolean;
          correct: boolean;
          userAnswer: string;
          feedback: string;
          timestamp: number;
        };
      };
    };
  };
}
```

### Completion Calculation

```
Completion % = (Sections Completed / Total Sections) × 100

Total Sections = 12 modules × 6 sections = 72
Total Sections = 3 review modules × 2 sections = 6 (review modules have no exercises)

Sections = story + vocabulary + 4 exercise skills
```

**Dashboard Display**:
- Overall progress bar: aggregate across all modules
- Module cards: completion % per module with visual indicator
- Completed modules: count + list
- In progress modules: count

### Module Unlocking

- **Not Started**: Show as locked (lock icon) until previous module completed
- **Started**: Show in-progress indicator
- **Completed**: Show completed checkmark
- **Admin Mode**: All modules unlocked (toggle on dashboard)

---

## State Management

The app uses **Zustand** with localStorage persistence for three independent, persistent stores.

### Store 1: Auth Store (`adg-auth`)

**Purpose**: User session management.

```typescript
interface AuthStore {
  user: { id: string; email: string; name: string } | null;
  isAuthenticated: boolean;
  login(user): void;
  register(user): void;
  logout(): void;
}
```

**Persistence**: localStorage key `adg-auth`

---

### Store 2: Progress Store (`adg-progress`)

**Purpose**: Track module completion, exercise answers, unlock status.

```typescript
interface ProgressStore {
  progress: UserProgress;
  adminMode: boolean;
  initProgress(userId): void;
  markSectionComplete(moduleId, section): void;
  saveExerciseAnswer(moduleId, exerciseId, answer): void;
  setCurrentModule(moduleId): void;
  getCompletionPercent(): number;
  toggleAdminMode(): void;
}
```

**Persistence**: localStorage key `adg-progress`

---

### Store 3: Flashcard Store (`adg-flashcards`)

**Purpose**: SRS state, removed cards, streak tracking.

```typescript
interface FlashcardStore {
  srsData: { [cardId]: SRSEntry };
  removedCards: string[];
  streakData: { currentStreak, lastPracticeDate, longestStreak };
  
  updateSRSState(cardId, correct): void;
  removeCard(cardId): void;
  markSessionComplete(): void;
  resetStreakIfNeeded(): void;
}
```

**Persistence**: localStorage key `adg-flashcards`

---

## Design System & Styling

### Color Palette

**Dark Mode** (Default):
- Background: `#0a1628` (Navy 900)
- Foreground: `#e8edf5` (Light gray)
- Accent: `#d4a843` (Gold 500)
- Cards: `#0f1f3d` (Navy 800)
- Border: `#1e3a5f` (Navy 600)

**Light Mode**:
- Background: `#f5f5f0` (Cream)
- Foreground: `#1a1a2e` (Dark navy)
- Accent: `#b8922a` (Gold darker)
- Cards: `#ffffff` (White)
- Border: `#d4d4cf` (Light gray)

### Design Features

- **Mobile-First**: Responsive design optimized for mobile (sm:, md:, lg: breakpoints)
- **Accessibility**: Focus rings, high contrast text, semantic HTML
- **Animations**:
  - Progress bar pulse
  - Card flip (3D rotateY)
  - Hover state transitions
  - Skeleton loaders
- **Theme Toggle**: Dark/light mode button in navbar (persisted to localStorage)
- **Adaptive Images**: Robin's photos responsive (`robin-landing-page.jpeg`, `robin-inside-app.jpeg`)

### Tailwind Configuration

- **v4 Syntax**: `@theme` block in `globals.css`
- **Custom Colors**: Navy, gold, emerald, coral, sky
- **Font**: Geist Sans (system fallback)

---

## Key Implementation Details

### 1. Keyboard Shortcuts (Flashcards)

```
Spacebar    → Flip card
Arrow Left  → Previous card
Arrow Right → Next card
[1]         → Mark "Nochmal" (Again)
[2]         → Mark "Gewusst" (Good)
```

Implemented in `use-flashcard-keyboard.ts` hook.

### 2. Audio Encoding

**Web Audio API** records speaking exercises as WAV format via `pcm-to-wav.ts`:
- Captures microphone input
- Converts PCM to WAV container
- Sends to speech-to-text service

### 3. React Compiler Optimization

**Enabled** in `next.config.ts`:
```typescript
experimental: {
  reactCompiler: true
}
```
Optimizes re-renders via automatic memoization.

### 4. TTS Caching Strategy

```
Request: "Du ziehst mich auf"
Hash: SHA256("Du ziehst mich auf") = "abc123..."
Cache Key: "tts-abc123"
If exists: Return cached WAV
Else: Call ElevenLabs API, cache result
```

### 5. Verb Conjugation Detection

**Prefixes Handled**:
- auf-, aus-, ein-, mit-, um-, unter-, weg-, vor-, durch-, zu-, bei-

**Forms Recognized**:
- Infinitive: "aufziehen"
- Past participle: "aufgezogen"
- 3rd singular: "zieht auf"
- Subjunctive: "aufzöge"
- Typo tolerance: Levenshtein distance ≤ 1

### 6. Admin Mode

- **Toggle**: Dashboard → "Admin-Modus" switch
- **Effect**: Unlocks all 12 modules instantly (bypasses completion prerequisites)
- **Use Case**: Testing, demos, or accessibility for users who need it
- **Persisted**: Stored in Progress Store

### 7. Email Reminder Automation

- **Feature**: Toggle on dashboard
- **Trigger**: No activity for 3 days
- **Status**: UI indicates "Erinnerungen aktiviert (kommt bald per E-Mail!)"
- **Implementation**: Currently frontend-only; backend email service not yet integrated

---

## User Journey Flow

### New User

1. Land on `/` (landing page with instructor intro)
2. Click "Jetzt starten"
3. Register at `/register` → choose name, email, password
4. Redirected to `/dashboard`
5. Scroll through module list; Module 1 unlocked, others locked
6. Click Module 1
7. Read story → Click verbs to learn → Mark section complete
8. Complete vocabulary section
9. Work through exercises (instant feedback)
10. Return to dashboard; mark module complete
11. Module 2 unlocks
12. Anytime: Practice flashcards from dashboard

### Returning User

1. Visit landing page, click "Anmelden" or go to `/login`
2. Enter email/password
3. Redirect to `/dashboard`
4. See progress (e.g., "40%" overall), continue where left off
5. Resume module or practice due flashcards

---

## Performance & Optimization

### Code Splitting

- Page-level lazy loading via Next.js `dynamic()`
- Component-level code splitting for modals

### Image Optimization

- Next.js `<Image>` component for responsive images
- WebP fallback
- Lazy loading for below-fold images

### Audio Optimization

- OPUS codec (efficient compression)
- Cloudflare R2 CDN for fast delivery
- Client-side caching via service worker (browser cache)

### State Optimization

- Zustand selectors to prevent unnecessary re-renders
- React Compiler enabled for automatic memoization

---

## Accessibility

- **Keyboard Navigation**: All interactive elements accessible via Tab + Enter
- **Screen Reader**: Semantic HTML, ARIA labels on buttons
- **Focus Management**: Modal dialogs trap focus
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Font Sizes**: Readable defaults with responsive scaling

---

## Future Enhancements

1. **Backend Database**: Replace localStorage with PostgreSQL + Prisma
2. **Real Authentication**: Implement bcrypt password hashing + JWT tokens
3. **Email Notifications**: Integrate Resend or SendGrid for reminders
4. **Social Features**: User profiles, leaderboards, achievement badges
5. **Advanced Analytics**: Heatmaps, time-on-task, retention metrics
6. **Content Expansion**: Additional modules, review sets, supplementary materials
7. **Offline Mode**: Service workers for offline study
8. **Multi-Language UI**: Translate interface to English, Spanish, French
9. **Mobile App**: React Native or Flutter wrapper for iOS/Android

---

## Support & Troubleshooting

### Common Issues

**Issue**: Flashcards not saving progress
- **Solution**: Check if localStorage is enabled; clear browser cache

**Issue**: Audio not playing
- **Solution**: Verify internet connection; try different audio format (MP3 fallback)

**Issue**: AI feedback delayed
- **Solution**: Check API rate limits (3 requests/minute); retry after 30 seconds

---

## Conclusion

**Auf Deutsch Gesagt** is a comprehensive, modern German language learning platform that combines storytelling, spaced repetition, and AI-powered feedback to create an engaging, scientifically-backed learning experience. Its architecture is modular, scalable, and optimized for mobile-first learning.

---

*Documentation Generated: April 8, 2026*
*App Version: 0.1.0*
