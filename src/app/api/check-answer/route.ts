import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"] as const;
const MAX_RETRIES = 3;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

async function generateWithBackoff(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { maxOutputTokens: 256, temperature: 0.4 },
  });

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: unknown) {
      const is429 =
        (error as { status?: number }).status === 429 ||
        (error instanceof Error && error.message.includes("429"));
      if (is429 && i < MAX_RETRIES - 1) {
        const waitTime = 1000 * Math.pow(2, i);
        console.warn(`[429] ${modelName} rate-limited. Retrying in ${waitTime}ms (attempt ${i + 1}/${MAX_RETRIES})…`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Exhausted retries");
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

  const textToCheck =
    body.studentAnswer ??
    body.transcript ??
    body.sentences?.map((s) => s.studentAnswer).join(" ") ??
    "";
  if (!textToCheck.trim() || textToCheck.length > 3000) {
    return NextResponse.json({ error: "Invalid input length" }, { status: 400 });
  }

  const prompt = buildPrompt(body);
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of MODELS) {
    try {
      const feedback = await generateWithBackoff(genAI, modelName, prompt);
      if (!feedback) continue;
      return NextResponse.json({ feedback });
    } catch (error) {
      console.error(`[${modelName}] failed:`, error);
      // Try next model
    }
  }

  return NextResponse.json({ error: "AI feedback unavailable" }, { status: 502 });
}
