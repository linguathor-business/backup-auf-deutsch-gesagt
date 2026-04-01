"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Loader2, X } from "lucide-react";
import { CourseModule, VocabItem } from "@/types";
import { useTTS } from "@/lib/use-tts";

interface StoryPlayerProps {
  module: CourseModule;
  onComplete?: () => void;
}

/** Build a lookup map: lowercase word → VocabItem */
function buildWordLookup(module: CourseModule): Map<string, VocabItem> {
  const map = new Map<string, VocabItem>();
  for (const v of module.coreVerbs) {
    const words = v.german.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 2) map.set(w.replace(/[^a-zäöüß]/g, ""), v);
    }
    map.set(v.german.toLowerCase(), v);
  }
  for (const v of module.idioms) {
    const words = v.german.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 2) map.set(w.replace(/[^a-zäöüß]/g, ""), v);
    }
    map.set(v.german.toLowerCase(), v);
  }
  return map;
}

/** Strip bold markers for matching */
function stripBold(text: string) {
  return text.replace(/\*\*/g, "");
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function StoryPlayer({ module, onComplete }: StoryPlayerProps) {
  const hasAudioFile = !!module.story.audioFile;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(-1);
  const [hasFinished, setHasFinished] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    vocab: VocabItem;
    rect: { top: number; left: number };
  } | null>(null);

  // MP3 audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);

  // TTS fallback
  const { speak, stop, loading: ttsLoading } = useTTS();
  const cancelledRef = useRef(false);

  const sentences = module.story.sentences;
  const wordLookup = useMemo(() => buildWordLookup(module), [module]);

  // Create audio element for MP3 playback
  useEffect(() => {
    if (!hasAudioFile) return;
    const audio = new Audio(module.story.audioFile);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onLoadedMetadata = () => setAudioDuration(audio.duration);
    const onTimeUpdate = () => setAudioCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setHasFinished(true);
      setCurrentSentence(-1);
      onComplete?.();
    };
    const onWaiting = () => setAudioLoading(true);
    const onCanPlay = () => setAudioLoading(false);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audioRef.current = null;
    };
  }, [hasAudioFile, module.story.audioFile, onComplete]);

  // Sync sentence highlighting with MP3 currentTime
  useEffect(() => {
    if (!hasAudioFile || !isPlaying) return;
    const t = audioCurrentTime;
    let active = -1;
    for (let i = 0; i < sentences.length; i++) {
      if (t >= sentences[i].start && t < sentences[i].end) {
        active = i;
        break;
      }
    }
    setCurrentSentence(active);
  }, [hasAudioFile, isPlaying, audioCurrentTime, sentences]);

  // --- MP3 controls ---
  const togglePlayMp3 = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setHasFinished(false);
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const restartMp3 = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentSentence(-1);
    setHasFinished(false);
    setAudioCurrentTime(0);
  }, []);

  const seekMp3 = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !audioDuration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audioDuration;
      setAudioCurrentTime(audio.currentTime);
    },
    [audioDuration]
  );

  const seekToSentenceMp3 = useCallback(
    (idx: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const s = sentences[idx];
      if (!s) return;
      audio.currentTime = s.start;
      setAudioCurrentTime(s.start);
      if (!isPlaying) {
        audio.play();
        setIsPlaying(true);
        setHasFinished(false);
      }
    },
    [sentences, isPlaying]
  );

  // --- TTS fallback controls (no audioFile) ---
  const playAllTts = useCallback(async () => {
    cancelledRef.current = false;
    setIsPlaying(true);
    setHasFinished(false);
    for (let i = 0; i < sentences.length; i++) {
      if (cancelledRef.current) break;
      setCurrentSentence(i);
      await speak(sentences[i].text);
    }
    if (!cancelledRef.current) {
      setHasFinished(true);
      onComplete?.();
    }
    setCurrentSentence(-1);
    setIsPlaying(false);
  }, [sentences, speak, onComplete]);

  const togglePlayTts = useCallback(() => {
    if (isPlaying) {
      cancelledRef.current = true;
      stop();
      setIsPlaying(false);
      setCurrentSentence(-1);
    } else {
      playAllTts();
    }
  }, [isPlaying, stop, playAllTts]);

  const restartTts = useCallback(() => {
    cancelledRef.current = true;
    stop();
    setIsPlaying(false);
    setCurrentSentence(-1);
    setHasFinished(false);
  }, [stop]);

  const speakSentenceTts = useCallback(
    (idx: number) => {
      if (isPlaying) return;
      const s = sentences[idx];
      if (!s) return;
      setCurrentSentence(idx);
      speak(s.text).then(() => setCurrentSentence(-1));
    },
    [sentences, speak, isPlaying]
  );

  // Unified handlers
  const togglePlay = hasAudioFile ? togglePlayMp3 : togglePlayTts;
  const restart = hasAudioFile ? restartMp3 : restartTts;
  const handleSentenceClick = hasAudioFile ? seekToSentenceMp3 : speakSentenceTts;
  const loading = hasAudioFile ? audioLoading : ttsLoading;

  // Progress
  const progressPct = hasAudioFile
    ? audioDuration > 0
      ? (audioCurrentTime / audioDuration) * 100
      : 0
    : sentences.length > 0 && currentSentence >= 0
      ? ((currentSentence + 1) / sentences.length) * 100
      : 0;

  const handleWordClick = useCallback(
    (e: React.MouseEvent, word: string) => {
      e.stopPropagation();
      const clean = word.toLowerCase().replace(/[^a-zäöüß]/g, "");
      const vocab = wordLookup.get(clean);
      if (!vocab) {
        speak(word);
        return;
      }
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setSelectedWord({
        word,
        vocab,
        rect: { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX },
      });
      speak(word);
    },
    [wordLookup, speak]
  );

  // Precompute which sentences belong to which paragraph (sequential assignment)
  const sentencesByPara = useMemo(() => {
    const result: number[][] = module.story.paragraphs.map(() => []);
    let sIdx = 0;
    for (
      let pIdx = 0;
      pIdx < module.story.paragraphs.length && sIdx < sentences.length;
      pIdx++
    ) {
      const para = module.story.paragraphs[pIdx];
      while (sIdx < sentences.length) {
        const sTxt = stripBold(sentences[sIdx].text).replace(/["""]/g, "");
        if (para.replace(/["""]/g, "").includes(sTxt)) {
          result[pIdx].push(sIdx);
          sIdx++;
        } else {
          break;
        }
      }
    }
    while (sIdx < sentences.length) {
      result[result.length - 1].push(sIdx);
      sIdx++;
    }
    return result;
  }, [sentences, module.story.paragraphs]);

  /** Render a sentence as individually clickable words */
  const renderWords = (text: string, sentenceIdx: number) => {
    const plain = stripBold(text);
    const words = plain.split(/(\s+)/);
    return words.map((w, wi) => {
      if (/^\s+$/.test(w)) return w;
      const clean = w.toLowerCase().replace(/[^a-zäöüß]/g, "");
      const hasVocab = clean.length > 2 && wordLookup.has(clean);
      return (
        <span
          key={`${sentenceIdx}-${wi}`}
          onClick={(e) => handleWordClick(e, w)}
          className={`cursor-pointer transition-colors ${
            hasVocab
              ? "underline decoration-gold-500/40 decoration-dotted underline-offset-2 hover:text-gold-400"
              : "hover:text-gold-400"
          }`}
        >
          {w}
        </span>
      );
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Story header image */}
      {module.story.headerImage && (
        <div className="mb-4 rounded-lg overflow-hidden h-48 bg-navy-700">
          <img
            src={module.story.headerImage}
            alt={module.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!module.story.headerImage && (
        <div className="mb-4 rounded-lg overflow-hidden h-32 bg-gradient-to-r from-navy-700 via-navy-600 to-navy-700 flex items-center justify-center">
          <span className="text-4xl">📖</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Geschichte</h3>
        <div className="flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
          )}
          {hasFinished && (
            <span className="text-xs text-emerald-400 font-medium">
              ✓ Gelesen
            </span>
          )}
        </div>
      </div>

      {/* Audio controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-900 flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        <button
          onClick={restart}
          className="text-muted hover:text-foreground transition-colors"
          title="Neustart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div
          className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden cursor-pointer"
          onClick={hasAudioFile ? seekMp3 : undefined}
        >
          <div
            className="h-full bg-gold-500 rounded-full transition-all duration-150"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {hasAudioFile && audioDuration > 0 ? (
          <span className="text-xs text-muted tabular-nums min-w-[4rem] text-right">
            {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
          </span>
        ) : (
          <Volume2 className="w-4 h-4 text-muted" />
        )}
      </div>

      {/* Story text with sentence highlighting + clickable words */}
      <div className="leading-relaxed text-foreground/90 space-y-4">
        {module.story.paragraphs.map((_para, pIdx) => (
          <p key={pIdx} className="text-base">
            {(sentencesByPara[pIdx] || []).map((sIdx) => {
              const s = sentences[sIdx];
              const isActive = sIdx === currentSentence;
              return (
                <span
                  key={sIdx}
                  onClick={() => handleSentenceClick(sIdx)}
                  className={`inline transition-all duration-200 ${
                    isActive
                      ? "bg-gold-500/25 text-gold-300 rounded px-0.5 py-0.5"
                      : ""
                  }`}
                >
                  {renderWords(s.displayText ?? s.text, sIdx)}{" "}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      {/* Word tooltip popup */}
      {selectedWord && (
        <div
          className="fixed z-50 bg-navy-800 border border-gold-500/30 rounded-lg shadow-xl p-4 max-w-xs"
          style={{ top: selectedWord.rect.top, left: selectedWord.rect.left }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gold-400">
              {selectedWord.vocab.german}
            </span>
            <button
              onClick={() => setSelectedWord(null)}
              className="text-muted hover:text-foreground transition-colors ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selectedWord.vocab.definition && (
            <p className="text-sm text-foreground/80 mb-1 flex items-start gap-2">
              <button
                onClick={() => speak(selectedWord.vocab.definition!)}
                className="text-gold-500 hover:text-gold-400 shrink-0 mt-0.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <span>{selectedWord.vocab.definition}</span>
            </p>
          )}
          {selectedWord.vocab.example && (
            <p className="text-sm text-muted mt-1 flex items-start gap-2">
              <button
                onClick={() => speak(selectedWord.vocab.example!)}
                className="text-gold-500 hover:text-gold-400 shrink-0 mt-0.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <span className="italic">{selectedWord.vocab.example}</span>
            </p>
          )}
        </div>
      )}

      {/* Click-away overlay for tooltip */}
      {selectedWord && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
}
