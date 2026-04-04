"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { X, Settings2, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { FlashcardModalProps, FlashcardWord, FlashcardDirection, CardType } from "@/types/flashcards";
import { FlashcardFront } from "./FlashcardFront";
import { FlashcardBack } from "./FlashcardBack";
import { useFlashcardStore } from "@/store/flashcards";
import { getDueCards, getModuleCards, getSRSStats } from "@/lib/srs";
import { allFlashcardWords, getModuleFlashcardWords, getModuleTitle } from "@/lib/flashcard-data";
import { useFlashcardKeyboard } from "@/lib/use-flashcard-keyboard";
import { SessionSummary } from "./SessionSummary";

export default function FlashcardModal({ moduleId, onClose }: FlashcardModalProps) {
  const {
    srsData,
    direction,
    cardType,
    removedCards,
    streakData,
    setDirection,
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

  const [queue, setQueue] = useState<FlashcardWord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionStats, setSessionStats] = useState({ cardsReviewed: 0, againCount: 0, goodCount: 0 });
  const [showSummary, setShowSummary] = useState(false);

  // Initialize queue on mount
  useEffect(() => {
    startSession(moduleId);
    recordStudyDay();
    // Shuffle due cards
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCard = queue[currentIdx];

  const stats = useMemo(
    () => getSRSStats(moduleId ? getModuleFlashcardWords(moduleId) : allFlashcardWords, srsData, removedSet),
    [moduleId, srsData, removedSet]
  );

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleAgain = useCallback(() => {
    if (!currentCard) return;
    processReview(currentCard.id, false);
    setSessionStats((s) => ({
      ...s,
      cardsReviewed: s.cardsReviewed + 1,
      againCount: s.againCount + 1,
    }));
    // Put card back later in the queue
    setQueue((q) => {
      const updated = [...q];
      const card = updated.splice(currentIdx, 1)[0];
      // Insert 3-5 cards later (or at end)
      const insertAt = Math.min(currentIdx + 3 + Math.floor(Math.random() * 3), updated.length);
      updated.splice(insertAt, 0, card);
      return updated;
    });
    setIsFlipped(false);
  }, [currentCard, currentIdx, processReview]);

  const handleGood = useCallback(() => {
    if (!currentCard) return;
    processReview(currentCard.id, true);
    setSessionStats((s) => ({
      ...s,
      cardsReviewed: s.cardsReviewed + 1,
      goodCount: s.goodCount + 1,
    }));
    // Remove from queue
    setQueue((q) => q.filter((_, i) => i !== currentIdx));
    setIsFlipped(false);
    // If we were at the end, go back
    if (currentIdx >= queue.length - 1) {
      setCurrentIdx((prev) => Math.max(0, prev - 1));
    }
  }, [currentCard, currentIdx, processReview, queue.length]);

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
    endSession(sessionStats);
    onClose();
  }, [endSession, sessionStats, onClose]);

  useFlashcardKeyboard({
    isFlipped,
    onFlip: handleFlip,
    onAgain: handleAgain,
    onGood: handleGood,
    onClose: handleClose,
  });

  // Check if session is done
  useEffect(() => {
    if (queue.length === 0 && sessionStats.cardsReviewed > 0) {
      endSession(sessionStats);
      setShowSummary(true);
    }
  }, [queue.length, sessionStats, endSession]);

  const title = moduleId ? getModuleTitle(moduleId) : "Alle fälligen Karten";

  // ── Empty state ──────────────────────────────────────────────────
  if (dueCards.length === 0 && sessionStats.cardsReviewed === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Keine fälligen Karten!</h2>
          <p className="text-muted text-sm mb-6">
            {moduleId
              ? "Alle Vokabeln dieses Moduls sind im Moment gelernt. Komm später zurück!"
              : "Du hast gerade keine fälligen Karten. Komm später wieder!"}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted">Gesamt</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.masteredCount}</p>
              <p className="text-xs text-muted">Gemeistert</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gold-400">{stats.learningCount}</p>
              <p className="text-xs text-muted">Im Lernen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gold-500 text-navy-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
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
              {currentIdx + 1} / {queue.length} Karten
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
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="text-muted hover:text-foreground transition-colors"
            title="Einstellungen"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <label className="text-xs text-muted block mb-1">Richtung</label>
              <div className="flex gap-1">
                {(["de-en", "en-de"] as FlashcardDirection[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDirection(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      direction === d
                        ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                        : "bg-navy-700 text-muted hover:text-foreground border border-border"
                    }`}
                  >
                    {d === "de-en" ? "DE → EN" : "EN → DE"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Modus</label>
              <div className="flex gap-1">
                {(["erkennen", "aktivieren"] as CardType[]).map((ct) => (
                  <button
                    key={ct}
                    onClick={() => setCardType(ct)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                      cardType === ct
                        ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                        : "bg-navy-700 text-muted hover:text-foreground border border-border"
                    }`}
                  >
                    {ct === "erkennen" ? "Erkennen" : "Aktivieren"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
            className={`w-full h-full transition-transform duration-500 relative cursor-pointer`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
            onClick={handleFlip}
          >
            <FlashcardFront
              word={currentCard}
              cardType={cardType}
              direction={direction}
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
