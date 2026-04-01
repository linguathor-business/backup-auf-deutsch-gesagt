import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"] as const;
const MAX_RETRIES = 3;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

interface ChatbotBody {
  scenario: string;
  targetVerbs: string[];
  targetIdioms?: string[];
  messages: ChatMessage[];
  turnCount: number;
  maxTurns: number;
}

function buildSystemPrompt(body: ChatbotBody): string {
  const isLastTurn = body.turnCount >= body.maxTurns;

  return [
    "Du bist ein freundlicher Gesprächspartner in einem Deutsch-B2-Sprachkurs.",
    "Führe ein natürliches, kurzes Gespräch auf Deutsch.",
    "Antworte in 2–3 Sätzen. Stelle immer eine Rückfrage, damit das Gespräch weitergeht.",
    "Verwende selbst gelegentlich Verben und Redewendungen aus der Zielliste, um ein gutes Vorbild zu geben.",
    "",
    `Szenario: ${body.scenario}`,
    "",
    `Ziel-Verben: ${body.targetVerbs.join(", ")}`,
    body.targetIdioms?.length ? `Ziel-Redewendungen: ${body.targetIdioms.join(", ")}` : "",
    "",
    "Wenn der Schüler Fehler macht, korrigiere NICHT direkt. Verwende die korrekte Form stattdessen in deiner eigenen Antwort (implizite Korrektur).",
    isLastTurn
      ? "Das ist die letzte Gesprächsrunde. Beende das Gespräch natürlich und gib am Ende in einem kurzen Satz Feedback, welche Verben der Schüler gut verwendet hat."
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildConversation(body: ChatbotBody): string {
  const systemPrompt = buildSystemPrompt(body);
  const history = body.messages
    .map((m) => `${m.role === "user" ? "Schüler" : "Partner"}: ${m.text}`)
    .join("\n");

  return `${systemPrompt}\n\n--- Gesprächsverlauf ---\n${history}\n\nPartner:`;
}

async function generateWithBackoff(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
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
        console.warn(`[429] ${modelName} rate-limited. Retrying in ${waitTime}ms…`);
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

  let body: ChatbotBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.scenario || !body.messages?.length || !body.targetVerbs?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (body.messages.length > 20) {
    return NextResponse.json({ error: "Conversation too long" }, { status: 400 });
  }

  const lastUserMsg = body.messages[body.messages.length - 1];
  if (!lastUserMsg || lastUserMsg.role !== "user" || !lastUserMsg.text.trim() || lastUserMsg.text.length > 2000) {
    return NextResponse.json({ error: "Invalid user message" }, { status: 400 });
  }

  const prompt = buildConversation(body);
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of MODELS) {
    try {
      const reply = await generateWithBackoff(genAI, modelName, prompt);
      if (!reply) continue;
      return NextResponse.json({ reply: reply.trim() });
    } catch (error) {
      console.error(`[chatbot][${modelName}] failed:`, error);
    }
  }

  return NextResponse.json({ error: "AI chatbot unavailable" }, { status: 502 });
}
