"use client";

import { useEffect, useCallback } from "react";

interface UseFlashcardKeyboardOptions {
  isFlipped: boolean;
  onFlip: () => void;
  onAgain: () => void;
  onGood: () => void;
  onClose: () => void;
}

export function useFlashcardKeyboard({
  isFlipped,
  onFlip,
  onAgain,
  onGood,
  onClose,
}: UseFlashcardKeyboardOptions) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          onFlip();
          break;
        case "1":
        case "a":
        case "A":
          if (isFlipped) { e.preventDefault(); onAgain(); }
          break;
        case "2":
        case "g":
        case "G":
          if (isFlipped) { e.preventDefault(); onGood(); }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isFlipped, onFlip, onAgain, onGood, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
