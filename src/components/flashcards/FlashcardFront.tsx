"use client";

import type { FlashcardWord, CardType } from "@/types/flashcards";
import { Volume2 } from "lucide-react";
import { useTTS } from "@/lib/use-tts";

interface FlashcardFrontProps {
  word: FlashcardWord;
  cardType: CardType;
}

export function FlashcardFront({ word, cardType }: FlashcardFrontProps) {
  const { speak } = useTTS();

  if (cardType === "erkennen") {
    // Erkennen: See the German word → flip for definition
    return (
      <div className="absolute inset-0 backface-hidden bg-card rounded-2xl border border-border p-6 sm:p-10 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-wider text-muted mb-6">
          Was bedeutet dieses Wort?
        </span>
        <h3 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 text-center break-words max-w-full px-2">
          {word.german}
        </h3>
        {word.example && (
          <p className="text-muted text-sm sm:text-base italic text-center max-w-md px-4">
            „{word.example}"
          </p>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); speak(word.german); }}
          className="mt-4 text-gold-500 hover:text-gold-400 transition-colors"
          title="Anhören"
        >
          <Volume2 className="w-5 h-5" />
        </button>
        <span className="absolute bottom-6 text-muted/50 text-xs">
          Klicken oder Leertaste zum Umdrehen
        </span>
      </div>
    );
  }

  // Aktivieren: See the German definition → produce the word
  return (
    <div className="absolute inset-0 backface-hidden bg-card rounded-2xl border border-border p-6 sm:p-10 flex flex-col items-center justify-center">
      <span className="text-xs uppercase tracking-wider text-muted mb-6">
        Welches Wort wird beschrieben?
      </span>
      <p className="text-xl sm:text-2xl text-foreground/90 text-center max-w-md px-4 leading-relaxed">
        {word.definition}
      </p>
      {word.example && (
        <p className="text-muted text-sm italic text-center max-w-md px-4 mt-4">
          Hinweis: „{word.example}"
        </p>
      )}
      <span className="absolute bottom-6 text-muted/50 text-xs">
        Klicken oder Leertaste zum Umdrehen
      </span>
    </div>
  );
}
