"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { X, Settings2, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { FlashcardModalProps, FlashcardWord, CardType } from "@/types/flashcards";
import { FlashcardFront } from "./FlashcardFront";
import { FlashcardBack } from "./FlashcardBack";
import { FlashcardLanding } from "./FlashcardLanding";
import { useFlashcardStore } from "@/store/flashcards";
import { getDueCards, getModuleCards, getSRSStats } from "@/lib/srs";
import { allFlashcardWords, getModuleFlashcardWords, getModuleTitle } from "@/lib/flashcard-data";
import { useFlashcardKeyboard } from "@/lib/use-flashcard-keyboard";
import { SessionSummary } from "./SessionSummary";

export default function FlashcardModal({ moduleId, onClose }: FlashcardModalProps) {
  const {
    srsData,
    cardType,
    removedCards,
    streakData,
    setCardType,
    processReview,
    removeCard,
    startSession,
    endSession,
    recordStudyDay,
  } = useFlashcardStore();

  const removedSet = useMemo(() => new Set(removedCards), [removedCards]);

  // Build the card queue
  const dueCards = useMemo(() => {
    if (moduleId) {
      return getModuleCards(allFlashcardWords, moduleId, srsData, removedSet);
    }
    return getDueCards(allFlashcardWords, srsData, removedSet);
  }, [moduleId, srsData, removedSet]);

  const [showLanding, setShowLanding] = useState(true);
  const [queue, setQueue] = useState<FlashcardWord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ cardsReviewed: 0, againCount: 0, goodCount: 0 });
  const [showSummary, setShowSummary] = useState(false);

  const currentCard = queue[currentIdx];

  const stats = useMemo(
    () => getSRSStats(moduleId ? getModuleFlashcardWords(moduleId) : allFlashcardWords, srsData, removedSet),
    [moduleId, srsData, removedSet]
  );

  const handleStartStudy = useCallback(() => {
    startSession(moduleId);
    recordStudyDay();
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setShowLanding(false);
  }, [dueCards, moduleId, startSession, recordStudyDay]);

  const module1Cards = useMemo(
    () => getModuleCards(allFlashcardWords, 1, srsData, removedSet),
    [srsData, removedSet]
  );

  const handleStartModule1 = useCallback(() => {
    startSession(1);
    recordStudyDay();
    const shuffled = [...module1Cards].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setShowLanding(false);
  }, [module1Cards, startSession, recordStudyDay]);

  const handleFlip = useCallback(() => {
    if (showLanding) return;
    setIsFlipped((prev) => !prev);
  }, [showLanding]);

  const handleAgain = useCallback(() => {
    if (!currentCard || showLanding) return;
    processReview(currentCard.id, false);
    setSessionStats((s) => ({
      ...s,
      cardsReviewed: s.cardsReviewed + 1,
      againCount: s.againCount + 1,
    }));
    setQueue((q) => {
      const updated = [...q];
      const card = updated.splice(currentIdx, 1)[0];
      const insertAt = Math.min(currentIdx + 3 + Math.floor(Math.random() * 3), updated.length);
      updated.splice(insertAt, 0, card);
      return updated;
    });
    setIsFlipped(false);
  }, [currentCard, currentIdx, processReview, showLanding]);

  const handleGood = useCallback(() => {
    if (!currentCard || showLanding) return;
    processReview(currentCard.id, true);
    setSessionStats((s) => ({
      ...s,
      cardsReviewed: s.cardsReviewed + 1,
      goodCount: s.goodCount + 1,
    }));
    setQueue((q) => q.filter((_, i) => i !== currentIdx));
    setIsFlipped(false);
    if (currentIdx >= queue.length - 1) {
      setCurrentIdx((prev) => Math.max(0, prev - 1));
    }
  }, [currentCard, currentIdx, processReview, queue.length, showLanding]);

  const handleRemove = useCallback(() => {
    if (!currentCard) return;
    removeCard(currentCard.id);
    setQueue((q) => q.filter((_, i) => i !== currentIdx));
    setIsFlipped(false);
    if (currentIdx >= queue.length - 1) {
      setCurrentIdx((prev) => Math.max(0, prev - 1));
    }
  }, [currentCard, currentIdx, removeCard, queue.length]);

  const handleClose = useCallback(() => {
    if (!showLanding && sessionStats.cardsReviewed > 0) {
      endSession(sessionStats);
    }
    onClose();
  }, [endSession, sessionStats, onClose, showLanding]);

  useFlashcardKeyboard({
    isFlipped,
    onFlip: handleFlip,
    onAgain: handleAgain,
    onGood: handleGood,
    onClose: handleClose,
  });

  // Check if session is done
  useEffect(() => {
    if (!showLanding && queue.length === 0 && sessionStats.cardsReviewed > 0) {
      endSession(sessionStats);
      setShowSummary(true);
    }
  }, [queue.length, sessionStats, endSession, showLanding]);

  const title = moduleId ? getModuleTitle(moduleId) : "Alle fälligen Karten";

  // ── Landing / explanatory page ───────────────────────────────────
  if (showLanding) {
    return (
      <FlashcardLanding
        cardType={cardType}
        onChangeCardType={setCardType}
        dueCount={dueCards.length}
        totalCount={stats.total}
        masteredCount={stats.masteredCount}
        streak={streakData.currentStreak}
        onStart={handleStartStudy}
        onStartModule1={handleStartModule1}
        module1Count={module1Cards.length}
        onClose={onClose}
      />
    );
  }

  // ── Session Summary ──────────────────────────────────────────────
  if (showSummary) {
    return (
      <SessionSummary
        stats={sessionStats}
        streakData={streakData}
        srsStats={stats}
        onClose={onClose}
      />
    );
  }

  // ── No more cards in queue mid-session ───────────────────────────
  if (!currentCard) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sitzung beendet!</h2>
          <p className="text-muted text-sm mb-4">
            Du hast {sessionStats.cardsReviewed} Karten durchgearbeitet.
          </p>
          <button
            onClick={handleClose}
            className="bg-gold-500 text-navy-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    );
  }

  const currentInterval = srsData[currentCard.id]?.interval ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="text-muted hover:text-foreground transition-colors"
            title="Schließen (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
              {title}
            </h2>
            <p className="text-xs text-muted">
              {currentIdx + 1} / {queue.length} Karten · {cardType === "erkennen" ? "Erkennen" : "Aktivieren"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {streakData.currentStreak > 0 && (
            <span className="flex items-center gap-1 text-xs text-gold-400 font-medium">
              <Flame className="w-3.5 h-3.5" />
              {streakData.currentStreak}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-navy-700">
        <div
          className="h-full bg-gold-500 transition-all duration-300"
          style={{
            width: `${queue.length > 0 ? ((sessionStats.cardsReviewed) / (sessionStats.cardsReviewed + queue.length)) * 100 : 100}%`,
          }}
        />
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="perspective w-full max-w-lg aspect-[3/4] sm:aspect-[4/3] relative">
          <div
            className="w-full h-full transition-transform duration-500 relative cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
            onClick={handleFlip}
          >
            <FlashcardFront
              word={currentCard}
              cardType={cardType}
            />
            <FlashcardBack
              word={currentCard}
              currentInterval={currentInterval}
              onAgain={handleAgain}
              onGood={handleGood}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </div>

      {/* Navigation & stats footer */}
      <div className="border-t border-border bg-card/50 px-4 py-3 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setCurrentIdx((i) => Math.max(0, i - 1)); setIsFlipped(false); }}
            disabled={currentIdx === 0}
            className="disabled:opacity-30 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setCurrentIdx((i) => Math.min(queue.length - 1, i + 1)); setIsFlipped(false); }}
            disabled={currentIdx >= queue.length - 1}
            className="disabled:opacity-30 hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4">
          <span>✓ {sessionStats.goodCount}</span>
          <span>↺ {sessionStats.againCount}</span>
          <span>Neu: {stats.newCount} · Im Lernen: {stats.learningCount} · Gemeistert: {stats.masteredCount}</span>
        </div>
      </div>
    </div>
  );
}
