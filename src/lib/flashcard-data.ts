// ============================================
// Build FlashcardWord[] from module vocabulary
// ============================================

import type { FlashcardWord } from "@/types/flashcards";
import type { CourseModule } from "@/types";
import allModules from "@/data/modules";

/**
 * Convert a module's coreVerbs and idioms into FlashcardWord[].
 */
function moduleToCards(mod: CourseModule): FlashcardWord[] {
  if (mod.isReviewModule) return []; // review modules have no own vocab

  const cards: FlashcardWord[] = [];

  mod.coreVerbs.forEach((v) => {
    cards.push({
      id: `m${mod.id}-verb-${v.german.replace(/\s+/g, "-").toLowerCase()}`,
      moduleId: mod.id,
      german: v.german,
      english: v.english,
      example: v.example ?? "",
      definition: v.definition,
      source: "verb",
    });
  });

  mod.idioms.forEach((idiom, idx) => {
    cards.push({
      id: `m${mod.id}-idiom-${idx}`,
      moduleId: mod.id,
      german: idiom.german,
      english: idiom.english,
      example: idiom.example ?? "",
      definition: idiom.definition,
      source: "idiom",
    });
  });

  return cards;
}

/** All flashcard words across all content modules */
export const allFlashcardWords: FlashcardWord[] = allModules
  .filter((m) => !m.isReviewModule)
  .flatMap(moduleToCards);

/** Get flashcard words for a specific module */
export function getModuleFlashcardWords(moduleId: number): FlashcardWord[] {
  return allFlashcardWords.filter((w) => w.moduleId === moduleId);
}

/** Get module title by id */
export function getModuleTitle(moduleId: number): string {
  const mod = allModules.find((m) => m.id === moduleId);
  return mod ? `${mod.title} – ${mod.focusVerb}` : `Modul ${moduleId}`;
}

/** Get all content module ids (non-review) */
export function getContentModuleIds(): number[] {
  return allModules.filter((m) => !m.isReviewModule).map((m) => m.id);
}
