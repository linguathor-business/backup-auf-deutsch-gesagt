// ============================================
// Flashcard Zustand Store
// (Uses localStorage now; Firebase sync can be added later)
// ============================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FlashcardProgress,
  FlashcardDirection,
  CardType,
  SessionStats,
  SRSCard,
} from "@/types/flashcards";
import { reviewCard } from "@/lib/srs";

interface FlashcardStore extends FlashcardProgress {
  // Setters
  setDirection: (dir: FlashcardDirection) => void;
  setCardType: (ct: CardType) => void;

  // SRS operations
  processReview: (wordId: string, isCorrect: boolean) => void;
  removeCard: (wordId: string) => void;
  restoreCard: (wordId: string) => void;

  // Session
  startSession: (moduleId?: number) => void;
  endSession: (stats: Pick<SessionStats, "cardsReviewed" | "againCount" | "goodCount">) => void;

  // Streak
  recordStudyDay: () => void;

  // Firebase placeholder
  // syncToFirebase: () => Promise<void>;
  // loadFromFirebase: (userId: string) => Promise<void>;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      srsData: {},
      direction: "de-en",
      cardType: "erkennen",
      removedCards: [],
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: "",
      },
      lastSession: undefined,

      setDirection: (dir) => set({ direction: dir }),
      setCardType: (ct) => set({ cardType: ct }),

      processReview: (wordId, isCorrect) => {
        set((state) => {
          const existing = state.srsData[wordId];
          const updated = reviewCard(wordId, isCorrect, existing);
          return {
            srsData: { ...state.srsData, [wordId]: updated },
          };
        });
      },

      removeCard: (wordId) => {
        set((state) => ({
          removedCards: [...state.removedCards, wordId],
        }));
      },

      restoreCard: (wordId) => {
        set((state) => ({
          removedCards: state.removedCards.filter((id) => id !== wordId),
        }));
      },

      startSession: (_moduleId) => {
        // Session start is tracked by the component; store just resets lastSession
        set({ lastSession: undefined });
      },

      endSession: (stats) => {
        const now = Date.now();
        set({
          lastSession: {
            ...stats,
            startTime: now - 1,
            endTime: now,
          },
        });
        get().recordStudyDay();
      },

      recordStudyDay: () => {
        set((state) => {
          const today = todayISO();
          const streak = { ...state.streakData };

          if (streak.lastStudyDate === today) return {}; // already recorded

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayISO = yesterday.toISOString().slice(0, 10);

          if (streak.lastStudyDate === yesterdayISO) {
            streak.currentStreak += 1;
          } else {
            streak.currentStreak = 1;
          }

          streak.longestStreak = Math.max(
            streak.longestStreak,
            streak.currentStreak
          );
          streak.lastStudyDate = today;

          return { streakData: streak };
        });
      },
    }),
    {
      name: "adg-flashcards",
    }
  )
);
