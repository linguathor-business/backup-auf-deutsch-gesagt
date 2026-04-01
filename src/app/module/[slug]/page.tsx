"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Target,
  Check,
  Clock,
  ChevronRight,
  Square,
  CheckSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StoryPlayer from "@/components/StoryPlayer";
import VocabularyLab from "@/components/VocabularyLab";
import ExerciseArea from "@/components/ExerciseArea";
import { useAuthStore } from "@/store/auth";
import { useProgressStore } from "@/store/progress";
import { getModuleBySlug } from "@/data/modules";

type SectionKey = "story" | "vocabulary" | "exercises";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    progress,
    markStoryRead,
    markVocabularyDone,
    markExerciseDone,
    markModuleComplete,
    setCurrentModule,
    toggleStoryDone,
    toggleVocabularyDone,
    toggleExerciseSkillDone,
  } = useProgressStore();

  const slug = params.slug as string;
  const courseModule = getModuleBySlug(slug);

  const [activeSection, setActiveSection] = useState<SectionKey>(
    courseModule?.isReviewModule ? "exercises" : "story"
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (courseModule) {
      setCurrentModule(courseModule.id);
    }
  }, [courseModule, setCurrentModule]);

  if (!isAuthenticated) return null;
  if (!courseModule) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Modul nicht gefunden
          </h1>
          <Link href="/dashboard" className="text-gold-400 hover:text-gold-300">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  const modProgress = progress.modules[courseModule.id] ?? {
    moduleId: courseModule.id,
    started: false,
    completed: false,
    sections: {
      story: false,
      vocabulary: false,
      exercises: { lesen: false, hoeren: false, sprechen: false, schreiben: false },
    },
    exerciseAnswers: {},
  };
  const exercisesAnyDone = Object.values(modProgress.sections.exercises).some(Boolean);
  const completionItems = courseModule.isReviewModule
    ? [exercisesAnyDone]
    : [modProgress.sections.story, modProgress.sections.vocabulary, exercisesAnyDone];
  const completionDone = completionItems.filter(Boolean).length;
  const completionPct = Math.round((completionDone / completionItems.length) * 100);

  const sections: { key: SectionKey; label: string; icon: typeof BookOpen; done: boolean }[] = courseModule.isReviewModule
    ? [
        { key: "exercises", label: "Übungen", icon: Target, done: Object.values(modProgress.sections.exercises).some(Boolean) },
      ]
    : [
        { key: "story", label: "Geschichte", icon: BookOpen, done: modProgress.sections.story },
        { key: "vocabulary", label: "Vokabeln", icon: Headphones, done: modProgress.sections.vocabulary },
        { key: "exercises", label: "Übungen", icon: Target, done: Object.values(modProgress.sections.exercises).some(Boolean) },
      ];

  const allDone = courseModule.isReviewModule
    ? exercisesAnyDone
    : modProgress.sections.story &&
      modProgress.sections.vocabulary &&
      exercisesAnyDone;

  const handleCompleteModule = () => {
    markModuleComplete(courseModule.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-muted hover:text-foreground transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Zur Kursübersicht
        </Link>

        {/* Module header */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-gold-400 mb-1 block">
                {courseModule.isReviewModule ? "Wiederholung" : `Modul ${courseModule.id}`}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {courseModule.title}
              </h1>
              <p className="text-muted mt-1">{courseModule.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm shrink-0">
              <Clock className="w-4 h-4" />
              {courseModule.estimatedMinutes} Min.
            </div>
          </div>

          {/* Learning goals */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted mb-2">Lernziele</h3>
            <ul className="space-y-1">
              {courseModule.learningGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                  <ChevronRight className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-sm text-muted">{completionPct}%</span>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {sections.map(({ key, label, icon: Icon, done }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === key
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "bg-card text-muted hover:text-foreground border border-border"
              }`}
            >
              {done ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Manual checkmarks */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <p className="text-xs text-muted mb-3 uppercase tracking-wider">Fortschritt manuell markieren</p>
          <div className="flex flex-wrap gap-3">
            {!courseModule.isReviewModule && (
              <>
                <button
                  onClick={() => toggleStoryDone(courseModule.id)}
                  className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                >
                  {modProgress.sections.story ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-muted" />
                  )}
                  Geschichte
                </button>
                <button
                  onClick={() => toggleVocabularyDone(courseModule.id)}
                  className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                >
                  {modProgress.sections.vocabulary ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-muted" />
                  )}
                  Vokabeln
                </button>
              </>
            )}
            <button
              onClick={() => {
                const skills = ["lesen", "hoeren", "sprechen", "schreiben"] as const;
                const allSkillsDone = skills.every((s) => modProgress.sections.exercises[s]);
                skills.forEach((skill) => {
                  if (allSkillsDone || !modProgress.sections.exercises[skill]) {
                    toggleExerciseSkillDone(courseModule.id, skill);
                  }
                });
              }}
              className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              {Object.values(modProgress.sections.exercises).every(Boolean) ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-muted" />
              )}
              Übungen
            </button>
          </div>
        </div>

        {/* Section content */}
        {activeSection === "story" && (
          <StoryPlayer
            module={courseModule}
            onComplete={() => markStoryRead(courseModule.id)}
          />
        )}

        {activeSection === "vocabulary" && (
          <VocabularyLab
            coreVerbs={courseModule.coreVerbs}
            idioms={courseModule.idioms}
            onComplete={() => markVocabularyDone(courseModule.id)}
          />
        )}

        {activeSection === "exercises" && (
          <ExerciseArea
            exercises={courseModule.exercises}
            onSkillComplete={(skill) => {
              markExerciseDone(
                courseModule.id,
                skill as "lesen" | "hoeren" | "sprechen" | "schreiben"
              );
            }}
          />
        )}

        {/* Complete module button */}
        {allDone && !modProgress.completed && (
          <div className="mt-8 text-center">
            <button
              onClick={handleCompleteModule}
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Modul abschließen ✓
            </button>
          </div>
        )}

        {modProgress.completed && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl">
              <Check className="w-5 h-5" />
              <span className="font-medium">Modul abgeschlossen!</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
