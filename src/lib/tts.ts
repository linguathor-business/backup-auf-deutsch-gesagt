// Text-to-Speech utility for German language
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakGerman(text: string, rate: number = 0.9): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = rate;
  utterance.pitch = 1;

  // Try to find a German voice
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(
    (v) => v.lang.startsWith("de") && v.localService
  ) || voices.find((v) => v.lang.startsWith("de"));
  if (germanVoice) {
    utterance.voice = germanVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}
