// ============================================
// Flashcard & SRS Types
// ============================================

import type { VocabItem } from "./index";

/** A flashcard derived from a module's coreVerbs or idioms */
export interface FlashcardWord {
  id: string;             // e.g. "m1-verb-umziehen" or "m3-idiom-0"
  moduleId: number;
  german: string;
  example: string;        // German example sentence
  definition: string;     // German-language definition (simpler German)
  source: "verb" | "idiom";
}

/** SRS intervals in minutes: 10s, 1m, 10m, 1h, 1d, 3d, 7d */
export const SRS_INTERVALS = [0.167, 1, 10, 60, 1440, 4320, 10080] as const;

/** Tracks spaced repetition state for a single card */
export interface SRSCard {
  wordId: string;
  interval: number;       // current interval in minutes
  nextReview: number;     // unix timestamp ms
  reviews: number;        // total times reviewed
  lastReviewed: number;   // unix timestamp ms
  streak: number;         // consecutive correct answers
}

export type SRSData = Record<string, SRSCard>;

/** Card mode: recognition vs production */
export type CardType = "erkennen" | "aktivieren";

/** Session statistics */
export interface SessionStats {
  cardsReviewed: number;
  againCount: number;
  goodCount: number;
  startTime: number;
  endTime?: number;
  moduleId?: number;
}

/** Streak tracking */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;  // YYYY-MM-DD
}

/** Complete flashcard user state (persisted via Zustand, later Firebase) */
export interface FlashcardProgress {
  srsData: SRSData;
  cardType: CardType;
  removedCards: string[];
  streakData: StreakData;
  lastSession?: SessionStats;
}

/** Props for the main flashcard modal */
export interface FlashcardModalProps {
  moduleId?: number;       // study a specific module's cards, or all if undefined
  onClose: () => void;
}
