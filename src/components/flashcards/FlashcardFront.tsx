"use client";

import type { FlashcardWord, CardType, FlashcardDirection } from "@/types/flashcards";
import { Volume2 } from "lucide-react";
import { useTTS } from "@/lib/use-tts";

interface FlashcardFrontProps {
  word: FlashcardWord;
  cardType: CardType;
  direction: FlashcardDirection;
}

export function FlashcardFront({ word, cardType, direction }: FlashcardFrontProps) {
  const { speak } = useTTS();

  if (cardType === "erkennen") {
    // Recognition: show the word in source language, student guesses the translation
    const showGerman = direction === "de-en";
    return (
      <div className="absolute inset-0 backface-hidden bg-card rounded-2xl border border-border p-6 sm:p-10 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-wider text-muted mb-6">
          {showGerman ? "Was bedeutet …?" : "Wie sagt man …?"}
        </span>
        <h3 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 text-center break-words max-w-full px-2">
          {showGerman ? word.german : word.english}
        </h3>
        {showGerman && word.example && (
          <p className="text-muted text-sm sm:text-base italic text-center max-w-md px-4">
            „{word.example}"
          </p>
        )}
        {showGerman && (
          <button
            onClick={(e) => { e.stopPropagation(); speak(word.german); }}
            className="mt-4 text-gold-500 hover:text-gold-400 transition-colors"
            title="Anhören"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
        <span className="absolute bottom-6 text-muted/50 text-xs">
          Klicken oder Leertaste zum Umdrehen
        </span>
      </div>
    );
  }

  // Activation: always show English, student must produce German
  return (
    <div className="absolute inset-0 backface-hidden bg-card rounded-2xl border border-border p-6 sm:p-10 flex flex-col items-center justify-center">
      <span className="text-xs uppercase tracking-wider text-muted mb-6">
        Wie sagt man das auf Deutsch?
      </span>
      <h3 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 text-center break-words max-w-full px-2">
        {word.english}
      </h3>
      {word.definition && (
        <p className="text-muted text-sm italic text-center max-w-md px-4">
          Hinweis: {word.definition}
        </p>
      )}
      <span className="absolute bottom-6 text-muted/50 text-xs">
        Klicken oder Leertaste zum Umdrehen
      </span>
    </div>
  );
}
