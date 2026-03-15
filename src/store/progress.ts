import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ModuleProgress, SectionProgress, UserProgress } from "@/types";

function emptySections(): SectionProgress {
  return {
    story: false,
    vocabulary: false,
    exercises: {
      lesen: false,
      hoeren: false,
      sprechen: false,
      schreiben: false,
    },
  };
}

interface ProgressStore {
  progress: UserProgress;
  initProgress: (userId: string) => void;
  getModuleProgress: (moduleId: number) => ModuleProgress;
  isModuleUnlocked: (moduleId: number) => boolean;
  markStoryRead: (moduleId: number) => void;
  markVocabularyDone: (moduleId: number) => void;
  markExerciseDone: (moduleId: number, skill: keyof SectionProgress["exercises"]) => void;
  markModuleComplete: (moduleId: number) => void;
  setCurrentModule: (moduleId: number) => void;
  saveExerciseAnswer: (moduleId: number, exerciseId: string, answer: unknown) => void;
  getCompletionPercent: () => number;
  getModuleCompletionPercent: (moduleId: number) => number;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {
        userId: "",
        modules: {},
        currentModule: 1,
        flashcardsDue: [],
      },

      initProgress: (userId: string) => {
        set((state) => ({
          progress: { ...state.progress, userId },
        }));
      },

      getModuleProgress: (moduleId: number): ModuleProgress => {
        const existing = get().progress.modules[moduleId];
        if (existing) return existing;
        return {
          moduleId,
          started: false,
          completed: false,
          sections: emptySections(),
          exerciseAnswers: {},
        };
      },

      isModuleUnlocked: (moduleId: number): boolean => {
        if (moduleId === 1) return true;
        const prev = get().progress.modules[moduleId - 1];
        return prev?.completed ?? false;
      },

      markStoryRead: (moduleId: number) => {
        set((state) => {
          const modules = { ...state.progress.modules };
          const current = modules[moduleId] || {
            moduleId,
            started: false,
            completed: false,
            sections: emptySections(),
            exerciseAnswers: {},
          };
          modules[moduleId] = {
            ...current,
            started: true,
            sections: { ...current.sections, story: true },
            lastAccessed: new Date().toISOString(),
          };
          return { progress: { ...state.progress, modules } };
        });
      },

      markVocabularyDone: (moduleId: number) => {
        set((state) => {
          const modules = { ...state.progress.modules };
          const current = modules[moduleId] || {
            moduleId,
            started: false,
            completed: false,
            sections: emptySections(),
            exerciseAnswers: {},
          };
          modules[moduleId] = {
            ...current,
            started: true,
            sections: { ...current.sections, vocabulary: true },
            lastAccessed: new Date().toISOString(),
          };
          return { progress: { ...state.progress, modules } };
        });
      },

      markExerciseDone: (
        moduleId: number,
        skill: keyof SectionProgress["exercises"]
      ) => {
        set((state) => {
          const modules = { ...state.progress.modules };
          const current = modules[moduleId] || {
            moduleId,
            started: false,
            completed: false,
            sections: emptySections(),
            exerciseAnswers: {},
          };
          modules[moduleId] = {
            ...current,
            started: true,
            sections: {
              ...current.sections,
              exercises: { ...current.sections.exercises, [skill]: true },
            },
            lastAccessed: new Date().toISOString(),
          };
          return { progress: { ...state.progress, modules } };
        });
      },

      markModuleComplete: (moduleId: number) => {
        set((state) => {
          const modules = { ...state.progress.modules };
          const current = modules[moduleId] || {
            moduleId,
            started: false,
            completed: false,
            sections: emptySections(),
            exerciseAnswers: {},
          };
          modules[moduleId] = {
            ...current,
            completed: true,
            lastAccessed: new Date().toISOString(),
          };
          return { progress: { ...state.progress, modules } };
        });
      },

      setCurrentModule: (moduleId: number) => {
        set((state) => ({
          progress: { ...state.progress, currentModule: moduleId },
        }));
      },

      saveExerciseAnswer: (
        moduleId: number,
        exerciseId: string,
        answer: unknown
      ) => {
        set((state) => {
          const modules = { ...state.progress.modules };
          const current = modules[moduleId] || {
            moduleId,
            started: false,
            completed: false,
            sections: emptySections(),
            exerciseAnswers: {},
          };
          modules[moduleId] = {
            ...current,
            exerciseAnswers: {
              ...current.exerciseAnswers,
              [exerciseId]: answer,
            },
          };
          return { progress: { ...state.progress, modules } };
        });
      },

      getCompletionPercent: (): number => {
        const modules = get().progress.modules;
        const totalCheckpoints = 12 * 6; // 12 modules × 6 checkpoints each
        let done = 0;
        for (const mod of Object.values(modules)) {
          if (mod.sections.story) done++;
          if (mod.sections.vocabulary) done++;
          if (mod.sections.exercises.lesen) done++;
          if (mod.sections.exercises.hoeren) done++;
          if (mod.sections.exercises.sprechen) done++;
          if (mod.sections.exercises.schreiben) done++;
        }
        return Math.round((done / totalCheckpoints) * 100);
      },

      getModuleCompletionPercent: (moduleId: number): number => {
        const mod = get().progress.modules[moduleId];
        if (!mod) return 0;
        let total = 6; // story + vocab + 4 exercise skills
        let done = 0;
        if (mod.sections.story) done++;
        if (mod.sections.vocabulary) done++;
        if (mod.sections.exercises.lesen) done++;
        if (mod.sections.exercises.hoeren) done++;
        if (mod.sections.exercises.sprechen) done++;
        if (mod.sections.exercises.schreiben) done++;
        return Math.round((done / total) * 100);
      },
    }),
    {
      name: "adg-progress",
    }
  )
);
