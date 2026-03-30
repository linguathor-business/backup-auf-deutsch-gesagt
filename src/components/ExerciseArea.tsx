"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Check,
  X,
  RotateCcw,
  ChevronRight,
  Mic,
  Volume2,
  Star,
  MicOff,
} from "lucide-react";
import { Exercise } from "@/types";
import { useTTS } from "@/lib/use-tts";

interface ExerciseAreaProps {
  exercises: Exercise[];
  onSkillComplete?: (skill: string) => void;
}

// Motivating messages shown on success
const successMessages = [
  "Ausgezeichnet! Weiter so! 🎉",
  "Super gemacht! Du bist auf dem richtigen Weg! 💪",
  "Fantastisch! Das sitzt! 🌟",
  "Perfekt! Du machst große Fortschritte! 🚀",
  "Toll! Das hast du drauf! ✨",
  "Bravo! Weiter so, du schaffst das! 🎯",
  "Klasse! Das war richtig gut! 🏆",
];

function getRandomSuccess() {
  return successMessages[Math.floor(Math.random() * successMessages.length)];
}

function SuccessCelebration({ message }: { message: string }) {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
        <Star className="w-5 h-5 text-gold-400" />
      </div>
      <p className="text-emerald-400 font-medium text-sm">{message}</p>
    </div>
  );
}

function useAIFeedback() {
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState(false);

  const getFeedback = useCallback(async (payload: Record<string, unknown>) => {
    setAiFeedbackLoading(true);
    setAiFeedback(null);
    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`[${res.status}] ${err.error ?? res.statusText}`);
      }
      const data = await res.json();
      setAiFeedback(data.feedback ?? "Kein Feedback verfügbar.");
    } catch (err) {
      setAiFeedback(`KI-Feedback konnte nicht geladen werden. (${err instanceof Error ? err.message : String(err)})`);
    } finally {
      setAiFeedbackLoading(false);
    }
  }, []);

  const resetAIFeedback = useCallback(() => {
    setAiFeedback(null);
    setAiFeedbackLoading(false);
  }, []);

  return { aiFeedback, aiFeedbackLoading, getFeedback, resetAIFeedback };
}

function AIFeedbackBox({ feedback, loading }: { feedback: string | null; loading: boolean }) {
  if (!feedback && !loading) return null;
  return (
    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">✨</span>
        <p className="text-xs font-medium text-indigo-400">KI-Feedback</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 py-1">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
          <span className="text-xs text-indigo-300/80 ml-1">Wird ausgewertet…</span>
        </div>
      ) : (
        <p className="text-sm text-foreground whitespace-pre-wrap">{feedback}</p>
      )}
    </div>
  );
}

export default function ExerciseArea({ exercises, onSkillComplete }: ExerciseAreaProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Übungen</h3>

      <div className="space-y-6">
        {exercises.length === 0 ? (
          <p className="text-muted text-sm italic">
            Keine Übungen verfügbar.
          </p>
        ) : (
          exercises.map((exercise) => (
            <ExerciseRenderer
              key={exercise.id}
              exercise={exercise}
              onComplete={() => onSkillComplete?.(exercise.skill)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ExerciseRenderer({
  exercise,
  onComplete,
}: {
  exercise: Exercise;
  onComplete?: () => void;
}) {
  switch (exercise.type) {
    case "multiple-choice":
      return <MultipleChoiceExercise exercise={exercise} onComplete={onComplete} />;
    case "true-false":
      return <TrueFalseExercise exercise={exercise} onComplete={onComplete} />;
    case "gap-fill":
      return <GapFillExercise exercise={exercise} onComplete={onComplete} />;
    case "matching":
      return <MatchingExercise exercise={exercise} onComplete={onComplete} />;
    case "open-writing":
      return <WritingExercise exercise={exercise} onComplete={onComplete} />;
    case "speaking":
      return <SpeakingExercise exercise={exercise} onComplete={onComplete} />;
    case "verb-grouping":
      return <VerbGroupingExercise exercise={exercise} onComplete={onComplete} />;
    case "sentence-completion":
      return <SentenceCompletionExercise exercise={exercise} onComplete={onComplete} />;
    case "error-correction":
      return <ErrorCorrectionExercise exercise={exercise} onComplete={onComplete} />;
    default:
      return null;
  }
}

// --- Multiple Choice ---
function MultipleChoiceExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "multiple-choice" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerCheck = (indices: number[], currentAnswers: Record<number, number>) => {
    const next = new Set([...checkedItems, ...indices]);
    setCheckedItems(next);
    const allDone = exercise.questions.every(
      (q, i) => next.has(i) && currentAnswers[i] === q.correctIndex
    );
    if (allDone) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCheckedItems(new Set());
    setSuccessMsg(null);
  };

  const anyAnswered = Object.keys(answers).length > 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.questions.map((q, qIdx) => {
        const isItemChecked = checkedItems.has(qIdx);
        return (
          <div key={qIdx} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-foreground font-medium">
                {qIdx + 1}. {q.question}
              </p>
              {answers[qIdx] !== undefined && !isItemChecked && (
                <button
                  onClick={() => triggerCheck([qIdx], answers)}
                  className="shrink-0 px-2 py-0.5 rounded text-xs bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors whitespace-nowrap"
                >
                  Prüfen
                </button>
              )}
            </div>
            <div className="grid gap-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = answers[qIdx] === oIdx;
                const isCorrect = q.correctIndex === oIdx;
                let cls =
                  "w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ";
                if (isItemChecked && isSelected && isCorrect) {
                  cls += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                } else if (isItemChecked && isSelected && !isCorrect) {
                  cls += "border-coral-500 bg-coral-500/10 text-coral-400";
                } else if (isItemChecked && isCorrect) {
                  cls += "border-emerald-500/50 bg-emerald-500/5 text-muted";
                } else if (isSelected) {
                  cls += "border-gold-500 bg-gold-500/10 text-foreground";
                } else {
                  cls +=
                    "border-border bg-navy-800/30 text-muted hover:border-gold-500/30 hover:text-foreground";
                }
                return (
                  <button
                    key={oIdx}
                    onClick={() => !isItemChecked && setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                    className={cls}
                    disabled={isItemChecked}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                        {isItemChecked && isSelected && isCorrect && <Check className="w-3 h-3" />}
                        {isItemChecked && isSelected && !isCorrect && <X className="w-3 h-3" />}
                        {!isItemChecked && String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        <button
          onClick={() => triggerCheck(Object.keys(answers).map(Number), answers)}
          disabled={!anyAnswered}
          className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Alle prüfen <ChevronRight className="w-4 h-4" />
        </button>
        {checkedItems.size > 0 && (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- True/False ---
function TrueFalseExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "true-false" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerCheck = (indices: number[], currentAnswers: Record<number, boolean | null>) => {
    const next = new Set([...checkedItems, ...indices]);
    setCheckedItems(next);
    const allDone = exercise.statements.every(
      (s, i) => next.has(i) && currentAnswers[i] === s.correct
    );
    if (allDone) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCheckedItems(new Set());
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.statements.map((stmt, idx) => {
        const isItemChecked = checkedItems.has(idx);
        return (
          <div key={idx} className="flex items-start gap-3 p-3 bg-navy-800/30 rounded-lg border border-border/50">
            <span className="text-sm text-foreground flex-1">{stmt.statement}</span>
            <div className="flex items-center gap-2 shrink-0">
              {[true, false].map((val) => {
                const isSel = answers[idx] === val;
                let cls = "px-3 py-1 rounded text-xs font-medium border transition-all ";
                if (isItemChecked && isSel && val === stmt.correct) {
                  cls += "border-emerald-500 bg-emerald-500/20 text-emerald-400";
                } else if (isItemChecked && isSel && val !== stmt.correct) {
                  cls += "border-coral-500 bg-coral-500/20 text-coral-400";
                } else if (isSel) {
                  cls += "border-gold-500 bg-gold-500/10 text-gold-400";
                } else {
                  cls += "border-border text-muted hover:border-gold-500/30";
                }
                return (
                  <button
                    key={String(val)}
                    onClick={() => !isItemChecked && setAnswers((prev) => ({ ...prev, [idx]: val }))}
                    className={cls}
                    disabled={isItemChecked}
                  >
                    {val ? "Richtig" : "Falsch"}
                  </button>
                );
              })}
              {answers[idx] !== undefined && answers[idx] !== null && !isItemChecked && (
                <button
                  onClick={() => triggerCheck([idx], answers)}
                  className="w-6 h-6 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors flex items-center justify-center text-xs"
                >
                  ✓
                </button>
              )}
            </div>
          </div>
        );
      })}
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        <button
          onClick={() => triggerCheck(Object.keys(answers).map(Number), answers)}
          disabled={Object.keys(answers).length === 0}
          className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Alle prüfen <ChevronRight className="w-4 h-4" />
        </button>
        {checkedItems.size > 0 && (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Gap Fill ---
function GapFillExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "gap-fill" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { speak } = useTTS();

  const isAnswerCorrect = (idx: number, val: string) =>
    val.trim().toLowerCase() === exercise.sentences[idx].answer.toLowerCase();

  const triggerCheck = (indices: number[], currentAnswers: Record<number, string>) => {
    const next = new Set([...checkedItems, ...indices]);
    setCheckedItems(next);
    const allDone = exercise.sentences.every(
      (_, i) => next.has(i) && isAnswerCorrect(i, currentAnswers[i] ?? "")
    );
    if (allDone) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCheckedItems(new Set());
    setSuccessMsg(null);
  };

  const anyAnswered = Object.values(answers).some((v) => v.trim());

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      {exercise.wordBank && exercise.wordBank.length > 0 && (
        <div className="bg-navy-800/30 rounded-lg p-3 border border-border/50">
          <p className="text-xs text-muted mb-2">Wortkasten:</p>
          <div className="flex flex-wrap gap-2">
            {exercise.wordBank.map((word, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md border border-gold-500/30 text-sm text-gold-400 bg-gold-500/5"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
      {exercise.skill === "hoeren" && (
        <p className="text-xs text-sky-400 italic">
          Tipp: Klicke auf 🔊 um den Satz anzuhören und überprüfe deine Antwort anhand der Aufnahme.
        </p>
      )}
      {exercise.sentences.map((sent, idx) => {
        const isItemChecked = checkedItems.has(idx);
        const val = answers[idx] ?? "";
        const isCorrect = isItemChecked && isAnswerCorrect(idx, val);
        const isWrong = isItemChecked && !isCorrect;
        return (
          <div key={idx} className="flex items-center gap-2">
            {exercise.skill === "hoeren" && (
              <button
                onClick={() => speak(sent.text.replace("___", sent.answer))}
                className="text-gold-500 hover:text-gold-400 transition-colors shrink-0"
                title="Satz anhören"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <p className="text-sm text-foreground flex-1">
              {sent.text.split("___").map((part, pIdx, arr) => (
                <span key={pIdx}>
                  {part}
                  {pIdx < arr.length - 1 && (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        !isItemChecked &&
                        setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && val.trim() && !isItemChecked)
                          triggerCheck([idx], answers);
                      }}
                      className={`inline-block w-28 mx-1 px-2 py-0.5 rounded border text-sm bg-navy-800 outline-none transition-colors ${
                        isCorrect
                          ? "border-emerald-500 text-emerald-400"
                          : isWrong
                          ? "border-coral-500 text-coral-400"
                          : "border-border text-foreground focus:border-gold-500"
                      }`}
                      placeholder="..."
                      readOnly={isItemChecked}
                    />
                  )}
                </span>
              ))}
            </p>
            {!isItemChecked && val.trim() && (
              <button
                onClick={() => triggerCheck([idx], answers)}
                className="shrink-0 px-2 py-0.5 rounded text-xs bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors"
              >
                ✓
              </button>
            )}
            {isItemChecked && (
              <span className="text-xs shrink-0">
                {isCorrect ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-coral-400">{sent.answer}</span>
                )}
              </span>
            )}
          </div>
        );
      })}
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        <button
          onClick={() =>
            triggerCheck(
              Object.entries(answers)
                .filter(([, v]) => v.trim())
                .map(([k]) => Number(k)),
              answers
            )
          }
          disabled={!anyAnswered}
          className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Alle prüfen <ChevronRight className="w-4 h-4" />
        </button>
        {checkedItems.size > 0 && (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Matching ---
function MatchingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "matching" }>;
  onComplete?: () => void;
}) {
  const { speak } = useTTS();
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({}); // leftIdx → rightOrigIdx
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [shuffledRight] = useState(() => {
    const indices = exercise.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const badge = (idx: number) => String.fromCharCode(65 + idx);

  const handleLeftClick = (idx: number) => {
    if (checked) return;
    setSelectedLeft((prev) => (prev === idx ? null : idx));
  };

  const handleRightClick = (shuffledIdx: number) => {
    if (checked || selectedLeft === null) return;
    setMatches((prev) => ({ ...prev, [selectedLeft]: shuffledRight[shuffledIdx] }));
    setSelectedLeft(null);
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = exercise.pairs.every((_, i) => matches[i] === i);
    if (allCorrect) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setMatches({});
    setChecked(false);
    setSelectedLeft(null);
    setSuccessMsg(null);
  };

  // Which left index has matched this right item (if any)
  const rightMatchedLeft = (origIdx: number): number | null => {
    const entry = Object.entries(matches).find(([, r]) => Number(r) === origIdx);
    return entry ? Number(entry[0]) : null;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>

      {checked ? (
        // ── Results view: one row per pair, correct answer always visible ──
        <div className="space-y-2">
          {exercise.pairs.map((pair, idx) => {
            const matchedRightIdx = matches[idx];
            const correct = matchedRightIdx === idx;
            const userAnswer =
              matchedRightIdx !== undefined && !correct
                ? exercise.pairs[matchedRightIdx]?.right
                : null;
            return (
              <div
                key={idx}
                className={`rounded-lg p-3 border ${
                  correct
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-coral-500/30 bg-coral-500/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`text-xs font-bold w-5 shrink-0 mt-0.5 ${
                      correct ? "text-emerald-400" : "text-coral-400"
                    }`}
                  >
                    {badge(idx)}.
                  </span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm text-foreground/80">{pair.left}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-muted text-xs">→</span>
                      {correct ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          {pair.right} <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="flex flex-wrap items-center gap-2">
                          {userAnswer && (
                            <span className="text-coral-400 line-through text-xs">
                              {userAnswer}
                            </span>
                          )}
                          <span className="text-emerald-400">{pair.right}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // ── Matching grid: click left then click right to connect ──
        <>
          {selectedLeft !== null && (
            <p className="text-xs text-gold-400 italic">
              „{exercise.pairs[selectedLeft].left}" ausgewählt — wähle jetzt rechts den passenden Ausdruck.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {/* Left column */}
            <div className="space-y-2">
              {exercise.pairs.map((pair, idx) => {
                const isMatched = matches[idx] !== undefined;
                const isSelected = selectedLeft === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleLeftClick(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                      isSelected
                        ? "border-gold-500 bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/40"
                        : isMatched
                        ? "border-sky-500/40 bg-sky-500/5 text-sky-400"
                        : "border-border bg-navy-800/30 text-foreground hover:border-gold-500/30"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {exercise.skill === "hoeren" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); speak(pair.left); }}
                          className="text-gold-500 hover:text-gold-400 shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? "border-gold-500 text-gold-300 bg-gold-500/20"
                            : isMatched
                            ? "border-sky-500/60 text-sky-400 bg-sky-500/10"
                            : "border-muted/40 text-muted/60"
                        }`}
                      >
                        {badge(idx)}
                      </span>
                      <span className="flex-1">{pair.left}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              {shuffledRight.map((origIdx, shuffIdx) => {
                const leftIdx = rightMatchedLeft(origIdx);
                const isMatched = leftIdx !== null;
                const isTargetable = selectedLeft !== null;
                return (
                  <button
                    key={shuffIdx}
                    onClick={() => handleRightClick(shuffIdx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                      isMatched
                        ? "border-sky-500/40 bg-sky-500/5 text-sky-400"
                        : isTargetable
                        ? "border-gold-500/40 text-foreground hover:border-gold-500 hover:bg-gold-500/5 cursor-pointer"
                        : "border-border bg-navy-800/30 text-foreground hover:border-gold-500/20"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{exercise.pairs[origIdx].right}</span>
                      {isMatched && leftIdx !== null && (
                        <span className="w-5 h-5 rounded-full border border-sky-500/60 bg-sky-500/10 text-sky-400 text-xs flex items-center justify-center font-bold shrink-0">
                          {badge(leftIdx)}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={Object.keys(matches).length === 0}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Open Writing ---
function WritingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "open-writing" }>;
  onComplete?: () => void;
}) {
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { speak } = useTTS();
  const { aiFeedback, aiFeedbackLoading, getFeedback, resetAIFeedback } = useAIFeedback();

  const handleSubmit = () => {
    if (text.trim().length < 10) return;
    setSubmitted(true);
    setShowFeedback(true);
    onComplete?.();
    getFeedback({
      exerciseType: "open-writing",
      instruction: exercise.instruction,
      prompt: exercise.prompt,
      mustUseWords: exercise.mustUseWords,
      modelAnswer: exercise.modelAnswer,
      studentAnswer: text,
    });
  };

  const usedWords = exercise.mustUseWords?.filter((w) =>
    text.toLowerCase().includes(w.toLowerCase())
  ) || [];

  const missingWords = exercise.mustUseWords?.filter(
    (w) => !text.toLowerCase().includes(w.toLowerCase())
  ) || [];

  const handleReset = () => {
    setText("");
    setSubmitted(false);
    setShowFeedback(false);
    setShowModel(false);
    resetAIFeedback();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      <div className="bg-navy-800/30 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-foreground mb-3">{exercise.prompt}</p>
        {exercise.mustUseWords && exercise.mustUseWords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-muted">Pflicht-Ausdrücke:</span>
            {exercise.mustUseWords.map((word, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded border ${
                  usedWords.includes(word)
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-border text-muted"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => !submitted && setText(e.target.value)}
        placeholder="Schreibe hier..."
        rows={5}
        readOnly={submitted}
        className="w-full bg-navy-800 border border-border rounded-lg p-3 text-sm text-foreground placeholder-muted/50 resize-none outline-none focus:border-gold-500 transition-colors"
      />
      
      {/* Feedback area */}
      {showFeedback && (
        <div className="bg-navy-800/30 border border-border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gold-400">Feedback</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-20 shrink-0">Inhalt:</span>
              <span className="text-xs text-foreground/80">
                {text.trim().split(/\s+/).length >= 20
                  ? "Gute Länge! Dein Text ist ausführlich genug."
                  : "Versuche, etwas mehr zu schreiben (mind. 20 Wörter)."}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-20 shrink-0">Vokabular:</span>
              <span className="text-xs text-foreground/80">
                {missingWords.length === 0
                  ? "Alle Pflicht-Ausdrücke verwendet! ✓"
                  : `Es fehlen noch: ${missingWords.join(", ")}`}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-20 shrink-0">Tipp:</span>
              <span className="text-xs text-foreground/80">
                Vergleiche deinen Text mit der Musterlösung, um deine Grammatik und den Inhalt zu überprüfen.
              </span>
            </div>
          </div>
        </div>
      )}

      <AIFeedbackBox feedback={aiFeedback} loading={aiFeedbackLoading} />
      {submitted && (
        <SuccessCelebration message="Text eingereicht! Vergleiche mit der Musterlösung. ✍️" />
      )}

      <div className="flex gap-2 flex-wrap">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={text.trim().length < 10}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Abschicken
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal schreiben
          </button>
        )}
        <button
          onClick={() => setShowModel(!showModel)}
          className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors"
        >
          {showModel ? "Musterlösung ausblenden" : "Musterlösung anzeigen"}
        </button>
      </div>
      {showModel && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-xs text-emerald-400 font-medium mb-2">Musterlösung:</p>
          <p className="text-sm text-foreground/80 cursor-pointer hover:text-gold-400 transition-colors" onClick={() => speak(exercise.modelAnswer)}>
            🔊 {exercise.modelAnswer}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Speaking ---
function SpeakingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "speaking" }>;
  onComplete?: () => void;
}) {
  const [showModel, setShowModel] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const recognitionRef = useRef</* SpeechRecognition */ any>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const { speak } = useTTS();
  const { aiFeedback, aiFeedbackLoading, getFeedback, resetAIFeedback } = useAIFeedback();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let result = "";
      for (let i = 0; i < event.results.length; i++) {
        result += event.results[i][0].transcript;
      }
      setTranscript(result);
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  const handleMarkDone = () => {
    setCompleted(true);
    setShowFeedback(true);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    onComplete?.();
    if (transcript.trim()) {
      getFeedback({
        exerciseType: "speaking",
        prompt: exercise.prompt,
        mustUseWords: exercise.mustUseWords,
        modelAnswer: exercise.modelAnswer,
        transcript,
      });
    }
  };

  const handleReset = () => {
    setCompleted(false);
    setTranscript("");
    setShowFeedback(false);
    setShowModel(false);
    resetAIFeedback();
  };

  const usedWords = exercise.mustUseWords?.filter((w) =>
    transcript.toLowerCase().includes(w.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      <div className="bg-navy-800/30 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-foreground mb-3">{exercise.prompt}</p>
        {exercise.mustUseWords && exercise.mustUseWords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted">Pflicht-Ausdrücke:</span>
            {exercise.mustUseWords.map((word, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded border ${
                  usedWords.includes(word)
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-border text-gold-400"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recording area */}
      <div className="flex items-center gap-4">
        {speechSupported ? (
          <button
            onClick={toggleRecording}
            disabled={completed}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-coral-500 hover:bg-coral-400 text-white animate-pulse"
                : "bg-gold-500/20 hover:bg-gold-500/30 text-gold-400"
            } ${completed ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-gold-400" />
          </div>
        )}
        <div className="text-sm text-muted flex-1">
          {isRecording ? (
            <span className="text-coral-400">Aufnahme läuft... Klicke zum Stoppen.</span>
          ) : speechSupported ? (
            <span>Klicke auf das Mikrofon zum Aufnehmen. Sprich laut und deutlich.</span>
          ) : (
            <span>Sprich laut und übe den Ausdruck. Wenn du fertig bist, klicke auf &quot;Erledigt&quot;.</span>
          )}
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-navy-800/50 border border-border/50 rounded-lg p-3">
          <p className="text-xs text-muted mb-1">Deine Aufnahme:</p>
          <p className="text-sm text-foreground">{transcript}</p>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="bg-navy-800/30 border border-border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gold-400">Feedback</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-24 shrink-0">Vokabular:</span>
              <span className="text-xs text-foreground/80">
                {transcript
                  ? usedWords.length === (exercise.mustUseWords?.length ?? 0)
                    ? "Alle Pflicht-Ausdrücke erkannt! ✓"
                    : `Erkannte Ausdrücke: ${usedWords.length}/${exercise.mustUseWords?.length ?? 0}. Versuche die fehlenden Ausdrücke nochmal deutlicher.`
                  : "Keine Aufnahme erkannt. Überprüfe die Musterlösung."}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted w-24 shrink-0">Tipp:</span>
              <span className="text-xs text-foreground/80">
                Höre dir die Musterlösung an und vergleiche. Achte auf Aussprache und Betonung.
              </span>
            </div>
          </div>
        </div>
      )}

      {completed && <SuccessCelebration message="Gut gemacht! Vergleiche mit der Musterlösung. 🗣️" />}
      <AIFeedbackBox feedback={aiFeedback} loading={aiFeedbackLoading} />

      <div className="flex gap-2 flex-wrap">
        {!completed ? (
          <button
            onClick={handleMarkDone}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400"
          >
            Erledigt
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal sprechen
          </button>
        )}
        <button
          onClick={() => setShowModel(!showModel)}
          className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground transition-colors"
        >
          {showModel ? "Musterlösung ausblenden" : "Musterlösung anzeigen"}
        </button>
      </div>
      {showModel && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-xs text-emerald-400 font-medium mb-2">Musterlösung:</p>
          <p className="text-sm text-foreground/80 cursor-pointer hover:text-gold-400 transition-colors" onClick={() => speak(exercise.modelAnswer)}>
            🔊 {exercise.modelAnswer}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Verb Grouping ---
function VerbGroupingExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "verb-grouping" }>;
  onComplete?: () => void;
}) {
  const [shuffledVerbs] = useState(() => {
    const verbs = exercise.categories.flatMap((c) => c.items);
    for (let i = verbs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [verbs[i], verbs[j]] = [verbs[j], verbs[i]];
    }
    return verbs;
  });

  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pool = shuffledVerbs.filter((v) => !placed[v]);
  const allPlaced = shuffledVerbs.every((v) => placed[v]);

  const handleVerbClick = (verb: string) => {
    if (checked) return;
    setSelected((prev) => (prev === verb ? null : verb));
  };

  const handleCategoryClick = (catName: string) => {
    if (checked || selected === null) return;
    setPlaced((prev) => ({ ...prev, [selected]: catName }));
    setSelected(null);
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = exercise.categories.every((cat) =>
      cat.items.every((item) => placed[item] === cat.name)
    );
    if (allCorrect) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setPlaced({});
    setSelected(null);
    setChecked(false);
    setSuccessMsg(null);
  };

  const isVerbCorrect = (verb: string, catName: string) =>
    exercise.categories.find((c) => c.items.includes(verb))?.name === catName;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>

      {/* Pool */}
      <div className="bg-navy-800/30 rounded-lg p-3 border border-border/50">
        <p className="text-xs text-muted mb-2">
          {selected
            ? `„${selected}" ausgewählt – wähle jetzt eine Kategorie:`
            : "Klicke ein Verb an, dann wähle eine Kategorie:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.map((verb) => (
            <button
              key={verb}
              onClick={() => handleVerbClick(verb)}
              disabled={checked}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                selected === verb
                  ? "border-gold-500 bg-gold-500/20 text-gold-400 ring-1 ring-gold-500"
                  : "border-border bg-navy-800/50 text-foreground hover:border-gold-500/30"
              }`}
            >
              {verb}
            </button>
          ))}
          {pool.length === 0 && (
            <span className="text-xs text-muted italic">Alle Verben wurden eingeordnet.</span>
          )}
        </div>
      </div>

      {/* Category columns */}
      <div className="grid gap-3 sm:grid-cols-3">
        {exercise.categories.map((cat) => {
          const placedHere = shuffledVerbs.filter((v) => placed[v] === cat.name);
          const isTarget = selected !== null && !checked;
          return (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`rounded-lg p-3 border min-h-[90px] transition-all ${
                isTarget
                  ? "border-gold-500/50 bg-gold-500/5 hover:bg-gold-500/10 cursor-pointer"
                  : "border-border bg-navy-800/20"
              }`}
            >
              <p className="text-xs font-semibold text-gold-400 mb-2">{cat.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {placedHere.map((verb) => {
                  const correct = checked && isVerbCorrect(verb, cat.name);
                  const wrong = checked && !isVerbCorrect(verb, cat.name);
                  return (
                    <button
                      key={verb}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!checked) {
                          setPlaced((prev) => {
                            const next = { ...prev };
                            delete next[verb];
                            return next;
                          });
                          setSelected(null);
                        }
                      }}
                      disabled={checked}
                      className={`px-2 py-1 rounded text-xs border transition-all ${
                        correct
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : wrong
                          ? "border-coral-500 bg-coral-500/10 text-coral-400"
                          : "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:opacity-70"
                      }`}
                    >
                      {verb}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {checked && (
        <div className="space-y-1">
          {exercise.categories.flatMap((cat) =>
            cat.items
              .filter((v) => placed[v] !== cat.name)
              .map((v) => (
                <p key={v} className="text-xs text-coral-400">
                  „{v}" gehört zu:{" "}
                  <span className="font-medium text-foreground/80">{cat.name}</span>
                </p>
              ))
          )}
        </div>
      )}

      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={Object.keys(placed).length === 0}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Sentence Completion ---
function SentenceCompletionExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "sentence-completion" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { speak } = useTTS();
  const { aiFeedback, aiFeedbackLoading, getFeedback, resetAIFeedback } = useAIFeedback();

  const allFilled = exercise.sentences.every((_, i) => (answers[i] || "").trim().length > 0);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.();
    getFeedback({
      exerciseType: "sentence-completion",
      instruction: exercise.instruction,
      sentences: exercise.sentences.map((s, i) => ({
        prompt: s.prompt,
        studentAnswer: answers[i] || "",
        modelAnswer: s.modelAnswer,
      })),
    });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    resetAIFeedback();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      <div className="space-y-4">
        {exercise.sentences.map((sent, idx) => (
          <div key={idx} className="space-y-1.5">
            <p className="text-sm text-foreground">{sent.prompt}</p>
            <input
              type="text"
              value={answers[idx] || ""}
              onChange={(e) =>
                !submitted && setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
              }
              readOnly={submitted}
              placeholder="Ergänze sinnvoll …"
              className="w-full px-3 py-2 rounded-lg border text-sm bg-navy-800 outline-none transition-colors border-border text-foreground focus:border-gold-500"
            />
            {submitted && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Mögliche Antwort:</span>
                <button
                  className="text-xs text-emerald-400 hover:text-gold-400 transition-colors"
                  onClick={() => speak(sent.prompt.replace("___", sent.modelAnswer))}
                >
                  🔊 {sent.modelAnswer}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <AIFeedbackBox feedback={aiFeedback} loading={aiFeedbackLoading} />
      {submitted && (
        <SuccessCelebration message="Gut gemacht! Vergleiche deine Antworten mit den Musterlösungen. ✍️" />
      )}
      <div className="flex gap-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Überprüfen <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}

// --- Error Correction ---
function ErrorCorrectionExercise({
  exercise,
  onComplete,
}: {
  exercise: Extract<Exercise, { type: "error-correction" }>;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { speak } = useTTS();

  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/[.,!?;:„""]/g, "").replace(/\s+/g, " ");

  const isAnswerCorrect = (idx: number, val: string) =>
    normalize(val) === normalize(exercise.sentences[idx].correct);

  const triggerCheck = (indices: number[], currentAnswers: Record<number, string>) => {
    const next = new Set([...checkedItems, ...indices]);
    setCheckedItems(next);
    const allDone = exercise.sentences.every(
      (_, i) => next.has(i) && isAnswerCorrect(i, currentAnswers[i] ?? "")
    );
    if (allDone) {
      setSuccessMsg(getRandomSuccess());
      onComplete?.();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCheckedItems(new Set());
    setSuccessMsg(null);
  };

  const anyAnswered = Object.values(answers).some((v) => v.trim());

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted font-medium">{exercise.instruction}</p>
      <div className="space-y-5">
        {exercise.sentences.map((sent, idx) => {
          const isItemChecked = checkedItems.has(idx);
          const val = answers[idx] ?? "";
          const isCorrect = isItemChecked && isAnswerCorrect(idx, val);
          const isWrong = isItemChecked && !isCorrect;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-start gap-2 bg-coral-500/5 border border-coral-500/20 rounded-lg px-3 py-2">
                <X className="w-3.5 h-3.5 text-coral-400 mt-0.5 shrink-0" />
                <p className="text-sm text-foreground/70 line-through decoration-coral-400/50">
                  {sent.incorrect}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={(e) =>
                    !isItemChecked && setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && val.trim() && !isItemChecked)
                      triggerCheck([idx], answers);
                  }}
                  readOnly={isItemChecked}
                  placeholder="Korrigierter Satz …"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm bg-navy-800 outline-none transition-colors ${
                    isCorrect
                      ? "border-emerald-500 text-emerald-400"
                      : isWrong
                      ? "border-coral-500 text-coral-400"
                      : "border-border text-foreground focus:border-gold-500"
                  }`}
                />
                {!isItemChecked && val.trim() && (
                  <button
                    onClick={() => triggerCheck([idx], answers)}
                    className="shrink-0 px-2 py-1.5 rounded text-xs bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors"
                  >
                    ✓
                  </button>
                )}
              </div>
              {isItemChecked && isCorrect && (
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Richtig!</span>
                </div>
              )}
              {isItemChecked && isWrong && (
                <div className="space-y-1">
                  <button
                    className="text-xs text-emerald-400 hover:text-gold-400 transition-colors"
                    onClick={() => speak(sent.correct)}
                  >
                    🔊 {sent.correct}
                  </button>
                  {sent.explanation && (
                    <p className="text-xs text-muted">{sent.explanation}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {successMsg && <SuccessCelebration message={successMsg} />}
      <div className="flex gap-2">
        <button
          onClick={() =>
            triggerCheck(
              Object.entries(answers)
                .filter(([, v]) => v.trim())
                .map(([k]) => Number(k)),
              answers
            )
          }
          disabled={!anyAnswered}
          className="bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Alle prüfen <ChevronRight className="w-4 h-4" />
        </button>
        {checkedItems.size > 0 && (
          <button
            onClick={handleReset}
            className="bg-navy-700 text-muted px-4 py-2 rounded-lg text-sm hover:text-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nochmal
          </button>
        )}
      </div>
    </div>
  );
}
