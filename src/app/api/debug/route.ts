import { NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const elevenKey = process.env.ELEVENLABS_API_KEY;

  const result: Record<string, unknown> = {
    env: {
      GEMINI_API_KEY: geminiKey ? `set (${geminiKey.length} chars, starts with ${geminiKey.slice(0, 8)}…)` : "MISSING",
      ELEVENLABS_API_KEY: elevenKey ? `set (${elevenKey.length} chars, starts with ${elevenKey.slice(0, 6)}…)` : "MISSING",
    },
  };

  if (!geminiKey) {
    result.geminiTest = "skipped — key missing";
    return NextResponse.json(result);
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say OK" }] }],
        generationConfig: { maxOutputTokens: 8, temperature: 0 },
      }),
      signal: AbortSignal.timeout(10000),
    });

    const body = await res.text();

    if (!res.ok) {
      result.geminiTest = { status: res.status, error: body };
    } else {
      const parsed = JSON.parse(body);
      const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no text)";
      result.geminiTest = { status: res.status, response: text };
    }
  } catch (err) {
    result.geminiTest = { error: String(err) };
  }

  return NextResponse.json(result);
}
