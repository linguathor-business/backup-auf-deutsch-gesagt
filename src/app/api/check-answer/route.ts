import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type SentenceItem = { prompt: string; studentAnswer: string; modelAnswer: string };

interface CheckAnswerBody {
  exerciseType: "open-writing" | "sentence-completion" | "speaking";
  instruction?: string;
  prompt?: string;
  modelAnswer?: string;
  mustUseWords?: string[];
  studentAnswer?: string;
  transcript?: string;
  sentences?: SentenceItem[];
}

function buildPrompt(body: CheckAnswerBody): string {
  const base =
    "Du bist ein erfahrener Deutschlehrer auf B2-Niveau. " +
    "Antworte immer auf Deutsch in maximal 3 kurzen, klaren Sätzen. " +
    "Sei fair, konstruktiv und ermutigend.\n\n";

  if (body.exerciseType === "open-writing") {
    const parts = [
      base,
      `Aufgabe: ${body.instruction ?? ""}`,
      `Thema: ${body.prompt ?? ""}`,
      body.mustUseWords?.length
        ? `Pflicht-Ausdrücke: ${body.mustUseWords.join(", ")}`
        : "",
      `Musterlösung: ${body.modelAnswer ?? ""}`,
      "",
      `Schülertext: ${body.studentAnswer ?? ""}`,
      "",
      "Beurteile: Verwendung der Pflicht-Ausdrücke, Grammatik und Kohärenz. Dein Feedback:",
    ];
    return parts.filter(Boolean).join("\n");
  }

  if (body.exerciseType === "sentence-completion" && body.sentences?.length) {
    const lines = body.sentences
      .map(
        (s, i) =>
          `${i + 1}. Satzanfang: „${s.prompt}" | ` +
          `Schüler: „${s.studentAnswer}" | ` +
          `Mögliche Antwort: „${s.modelAnswer}"`
      )
      .join("\n");
    return (
      base +
      "Bewerte diese Satzergänzungen. Zeige kompakt, welche korrekt sind (auch wenn " +
      "sie abweichen aber sinnvoll sind) und was verbessert werden kann.\n\n" +
      lines +
      "\n\nFeedback:"
    );
  }

  if (body.exerciseType === "speaking") {
    const parts = [
      base,
      `Aufgabe: ${body.prompt ?? ""}`,
      body.mustUseWords?.length
        ? `Pflicht-Ausdrücke: ${body.mustUseWords.join(", ")}`
        : "",
      `Transkript des Schülers: ${body.transcript ?? "(leer)"}`,
      `Musterlösung: ${body.modelAnswer ?? ""}`,
      "",
      "Beurteile: Verwendung der Pflicht-Ausdrücke und Inhalt. Feedback:",
    ];
    return parts.filter(Boolean).join("\n");
  }

  return base;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  let body: CheckAnswerBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validTypes = ["open-writing", "sentence-completion", "speaking"];
  if (!validTypes.includes(body.exerciseType)) {
    return NextResponse.json({ error: "Invalid exercise type" }, { status: 400 });
  }

  // Validate input length to prevent abuse
  const textToCheck =
    body.studentAnswer ??
    body.transcript ??
    body.sentences?.map((s) => s.studentAnswer).join(" ") ??
    "";
  if (!textToCheck.trim() || textToCheck.length > 3000) {
    return NextResponse.json({ error: "Invalid input length" }, { status: 400 });
  }

  const prompt = buildPrompt(body);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 256, temperature: 0.4 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        { error: "AI feedback unavailable" },
        { status: res.status === 429 ? 429 : 502 }
      );
    }

    const data = await res.json();
    const feedback: string | undefined =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!feedback) {
      return NextResponse.json({ error: "No feedback returned" }, { status: 502 });
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Gemini request timed out after 15s");
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    console.error("Gemini fetch error:", error);
    return NextResponse.json({ error: "AI feedback unavailable" }, { status: 502 });
  }
}
