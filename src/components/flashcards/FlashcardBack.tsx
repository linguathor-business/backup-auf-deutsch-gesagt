"use client";

import type { FlashcardWord } from "@/types/flashcards";
import { Volume2, X, RotateCcw } from "lucide-react";
import { useTTS } from "@/lib/use-tts";
import { isMastered } from "@/lib/srs";

interface FlashcardBackProps {
  word: FlashcardWord;
  currentInterval: number;
  onAgain: () => void;
  onGood: () => void;
  onRemove: () => void;
}

function formatInterval(minutes: number): string {
  if (minutes < 1) return "10s";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(0)}h`;
  return `${(minutes / 1440).toFixed(0)}T`;
}

export function FlashcardBack({
  word,
  currentInterval,
  onAgain,
  onGood,
  onRemove,
}: FlashcardBackProps) {
  const { speak } = useTTS();
  const mastered = isMastered(currentInterval);

  return (
    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-card rounded-2xl border border-border p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
      {/* SRS badge */}
      <div className="flex items-center justify-between mb-2">
        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            mastered
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-gold-500/20 text-gold-400"
          }`}
        >
          {mastered ? "Gemeistert ✓" : `Nächstes Mal: ${formatInterval(currentInterval)}`}
        </div>
        <span className="text-xs text-muted capitalize">
          {word.source === "verb" ? "Verb" : "Redewendung"}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-2">
        <div className="text-center space-y-3 max-w-lg">
          <h4 className="text-2xl sm:text-4xl font-bold text-foreground">
            {word.german}
          </h4>
          <button
            onClick={(e) => { e.stopPropagation(); speak(word.german); }}
            className="text-gold-500 hover:text-gold-400 transition-colors"
            title="Wort anhören"
          >
            <Volume2 className="w-5 h-5 inline" />
          </button>
          <p className="text-base sm:text-lg text-gold-400 font-medium leading-relaxed">
            {word.definition}
          </p>
        </div>

        {word.example && (
          <div className="pt-3 border-t border-border w-full max-w-lg text-center">
            <p className="text-sm text-muted mb-1">Beispiel:</p>
            <p
              className="text-sm text-foreground/80 cursor-pointer hover:text-gold-400 transition-colors"
              onClick={(e) => { e.stopPropagation(); speak(word.example); }}
            >
              🔊 „{word.example}"
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-2 mt-4">
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAgain(); }}
            className="flex-1 px-4 py-3 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-400 active:scale-[0.98] transition-all text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Nochmal
            <span className="text-xs opacity-70 ml-1">[1]</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onGood(); }}
            className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-400 active:scale-[0.98] transition-all text-sm sm:text-base"
          >
            ✓ Gewusst
            <span className="text-xs opacity-70 ml-1">[2]</span>
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Diese Karte dauerhaft aus dem Stapel entfernen?")) {
              onRemove();
            }
          }}
          className="w-full px-4 py-2 text-muted hover:text-coral-400 transition-colors text-xs flex items-center justify-center gap-1"
        >
          <X className="w-3 h-3" />
          Karte entfernen
        </button>
      </div>
    </div>
  );
}
