"use client";

import { useState } from "react";
import { X, BookOpen, Lightbulb, BarChart3, Flame, ArrowRight } from "lucide-react";
import type { CardType } from "@/types/flashcards";

interface FlashcardLandingProps {
  cardType: CardType;
  onChangeCardType: (ct: CardType) => void;
  dueCount: number;
  totalCount: number;
  masteredCount: number;
  streak: number;
  onStart: () => void;
  onClose: () => void;
}

export function FlashcardLanding({
  cardType,
  onChangeCardType,
  dueCount,
  totalCount,
  masteredCount,
  streak,
  onStart,
  onClose,
}: FlashcardLandingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Wähle deinen Lernmodus
          </h1>
          {streak > 0 && (
            <p className="text-sm text-gold-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" /> {streak} Tage Streak
            </p>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-navy-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => onChangeCardType("erkennen")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                cardType === "erkennen"
                  ? "bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/20"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Erkennen
            </button>
            <button
              onClick={() => onChangeCardType("aktivieren")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                cardType === "aktivieren"
                  ? "bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/20"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Aktivieren
            </button>
          </div>
        </div>

        {/* Start button */}
        <div className="text-center mb-8">
          <button
            onClick={onStart}
            disabled={dueCount === 0}
            className="bg-gold-500 text-navy-900 px-8 py-3 rounded-xl font-semibold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {dueCount > 0 ? (
              <>
                Jetzt lernen
                <span className="bg-navy-900/20 px-2 py-0.5 rounded-md text-xs">
                  {dueCount} Karten
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Keine fälligen Karten"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Mode explanations */}
        <div className="space-y-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-gold-400" />
              Erkennen-Modus
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Du siehst ein <strong className="text-foreground">deutsches Wort</strong> und
              drehst die Karte um, um die <strong className="text-foreground">Erklärung in
              einfachem Deutsch</strong> zu sehen. Perfekt, um dein Leseverstehen und
              passives Vokabelwissen aufzubauen.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-gold-400" />
              Aktivieren-Modus
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Du siehst eine <strong className="text-foreground">Erklärung in einfachem
              Deutsch</strong> und musst das passende <strong className="text-foreground">Wort
              erraten</strong>. Perfekt für aktives Sprechen und Schreiben — du übst,
              die Vokabeln aus dem Gedächtnis abzurufen.
            </p>
          </div>
        </div>

        {/* SRS explanation */}
        <div className="bg-card rounded-xl border border-border p-5 mb-8">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            🧠 Verteiltes Lernen (Spaced Repetition)
          </h3>
          <p className="text-sm text-muted mb-3 leading-relaxed">
            Unser Algorithmus plant deine Wiederholungen in optimalen Abständen:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {["10s", "1 Min", "10 Min", "1 Std", "1 Tag", "3 Tage", "7 Tage"].map((interval, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-navy-700 text-foreground text-xs px-2.5 py-1 rounded-lg font-mono">
                  {interval}
                </span>
                {i < 6 && <span className="text-muted text-xs">→</span>}
              </span>
            ))}
          </div>
          <ul className="space-y-1.5 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              Karten, die du gut kannst, tauchen seltener auf
            </li>
            <li className="flex items-start gap-2">
              <span className="text-coral-400 mt-0.5">•</span>
              Karten, bei denen du Schwierigkeiten hast, kommen öfter
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">•</span>
              Das maximale Intervall beträgt 7 Tage für dauerhafte Verstärkung
            </li>
          </ul>
          <p className="text-xs text-muted/70 mt-3 italic">
            Diese wissenschaftlich bewährte Methode hilft dir, Vokabeln effizient zu lernen
            und langfristig zu behalten.
          </p>
        </div>

        {/* Progress tracking */}
        <div className="bg-card rounded-xl border border-border p-5 mb-8">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gold-400" />
            Deinen Fortschritt verfolgen
          </h3>
          <p className="text-sm text-muted mb-3">
            Jedes Wort zeigt eine Farbe, die deinen Lernstand angibt:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-sky-400 font-medium">Neu</span>
              <span className="text-muted">— Noch nicht gelernt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400" />
              <span className="text-gold-400 font-medium">Im Lernen</span>
              <span className="text-muted">— Gerade in der Wiederholung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-medium">Gemeistert</span>
              <span className="text-muted">— 7-Tage-Intervall erreicht</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
              <span className="text-coral-400 font-medium">Entfernt</span>
              <span className="text-muted">— Aus dem Stapel genommen (reaktivierbar)</span>
            </div>
          </div>

          {/* Current stats */}
          <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xl font-bold text-foreground">{totalCount}</p>
              <p className="text-xs text-muted">Gesamt</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">{masteredCount}</p>
              <p className="text-xs text-muted">Gemeistert</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gold-400">{dueCount}</p>
              <p className="text-xs text-muted">Fällig</p>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 text-sm text-foreground/80">
          <p>
            <span className="text-gold-400 font-semibold">💡 Tipp:</span> Übe beide Modi!
            <strong> Erkennen</strong> baut passives Verständnis auf, während{" "}
            <strong>Aktivieren</strong> aktive Sprachproduktion trainiert.
            Dein Fortschritt wird für jeden Modus getrennt gespeichert.
          </p>
        </div>
      </div>
    </div>
  );
}
