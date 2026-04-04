"use client";

import { Flame } from "lucide-react";
import type { SessionStats, StreakData } from "@/types/flashcards";

interface SessionSummaryProps {
  stats: Pick<SessionStats, "cardsReviewed" | "againCount" | "goodCount">;
  streakData: StreakData;
  srsStats: { total: number; newCount: number; learningCount: number; masteredCount: number; dueCount: number; removedCount: number };
  onClose: () => void;
}

export function SessionSummary({ stats, streakData, srsStats, onClose }: SessionSummaryProps) {
  const accuracy = stats.cardsReviewed > 0
    ? Math.round((stats.goodCount / stats.cardsReviewed) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">
            {accuracy >= 80 ? "🌟" : accuracy >= 50 ? "👍" : "💪"}
          </div>
          <h2 className="text-2xl font-bold text-foreground">Sitzung beendet!</h2>
          <p className="text-muted text-sm mt-1">
            Gut gemacht! Hier ist deine Zusammenfassung.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-navy-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.cardsReviewed}</p>
            <p className="text-xs text-muted">Karten</p>
          </div>
          <div className="bg-navy-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{accuracy}%</p>
            <p className="text-xs text-muted">Richtig</p>
          </div>
          <div className="bg-navy-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gold-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />
              {streakData.currentStreak}
            </p>
            <p className="text-xs text-muted">Streak</p>
          </div>
        </div>

        {/* Detail breakdown */}
        <div className="bg-navy-800 rounded-xl p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Gewusst</span>
            <span className="text-emerald-400 font-medium">{stats.goodCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Nochmal</span>
            <span className="text-coral-400 font-medium">{stats.againCount}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-muted">Gesamtfortschritt</span>
            <span className="text-foreground font-medium">
              {srsStats.masteredCount} / {srsStats.total} gemeistert
            </span>
          </div>
        </div>

        {/* Motivational message */}
        {srsStats.dueCount > 0 && (
          <p className="text-xs text-gold-400 text-center mb-4">
            Noch {srsStats.dueCount} Karten fällig — komm bald wieder! 📚
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gold-500 text-navy-900 px-6 py-3 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
        >
          Weiter lernen
        </button>
      </div>
    </div>
  );
}
