// ============================================
// SRS (Spaced Repetition System) Utilities
// ============================================

import { SRS_INTERVALS, type SRSCard, type SRSData } from "@/types/flashcards";
import type { FlashcardWord } from "@/types/flashcards";

/**
 * Advance to the next SRS interval after a correct answer.
 */
export function getNextInterval(currentInterval: number): number {
  const idx = SRS_INTERVALS.indexOf(currentInterval as typeof SRS_INTERVALS[number]);
  if (idx === -1) return SRS_INTERVALS[0];
  if (idx >= SRS_INTERVALS.length - 1) return SRS_INTERVALS[SRS_INTERVALS.length - 1];
  return SRS_INTERVALS[idx + 1];
}

/**
 * Reset to the first interval after an incorrect answer.
 */
export function getResetInterval(): number {
  return SRS_INTERVALS[0];
}

/**
 * Check if a card interval means "mastered" (at max interval).
 */
export function isMastered(interval: number): boolean {
  return interval === SRS_INTERVALS[SRS_INTERVALS.length - 1];
}

/**
 * Build a queue of cards that are due for review right now.
 */
export function getDueCards(
  allCards: FlashcardWord[],
  srsData: SRSData,
  removedCards: Set<string>
): FlashcardWord[] {
  const now = Date.now();
  return allCards.filter((card) => {
    if (removedCards.has(card.id)) return false;
    const srs = srsData[card.id];
    if (!srs) return true; // new card → always due
    return srs.nextReview <= now;
  });
}

/**
 * Build a queue of cards for a specific module.
 */
export function getModuleCards(
  allCards: FlashcardWord[],
  moduleId: number,
  srsData: SRSData,
  removedCards: Set<string>
): FlashcardWord[] {
  const now = Date.now();
  return allCards.filter((card) => {
    if (card.moduleId !== moduleId) return false;
    if (removedCards.has(card.id)) return false;
    const srs = srsData[card.id];
    if (!srs) return true;
    return srs.nextReview <= now;
  });
}

/**
 * Process a review: returns the updated SRSCard.
 */
export function reviewCard(
  wordId: string,
  isCorrect: boolean,
  existing?: SRSCard
): SRSCard {
  const now = Date.now();
  const currentInterval = existing?.interval ?? 0;
  const newInterval = isCorrect
    ? getNextInterval(currentInterval)
    : getResetInterval();
  const streak = isCorrect ? (existing?.streak ?? 0) + 1 : 0;

  return {
    wordId,
    interval: newInterval,
    nextReview: now + newInterval * 60 * 1000,
    reviews: (existing?.reviews ?? 0) + 1,
    lastReviewed: now,
    streak,
  };
}

/**
 * Compute SRS statistics for display.
 */
export function getSRSStats(
  allCards: FlashcardWord[],
  srsData: SRSData,
  removedCards: Set<string>
) {
  const now = Date.now();
  let newCount = 0;
  let learningCount = 0;
  let masteredCount = 0;
  let dueCount = 0;

  for (const card of allCards) {
    if (removedCards.has(card.id)) continue;
    const srs = srsData[card.id];
    if (!srs) {
      newCount++;
      dueCount++;
    } else {
      if (isMastered(srs.interval)) {
        masteredCount++;
      } else {
        learningCount++;
      }
      if (srs.nextReview <= now) dueCount++;
    }
  }

  return {
    total: allCards.length - removedCards.size,
    newCount,
    learningCount,
    masteredCount,
    dueCount,
    removedCount: removedCards.size,
  };
}
