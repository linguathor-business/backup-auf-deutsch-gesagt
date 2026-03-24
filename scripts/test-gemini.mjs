/**
 * Gemini API diagnostic script.
 * Run: node scripts/test-gemini.mjs
 *
 * Tests:
 *  1. API key is present
 *  2. gemini-3.1-flash-lite-preview responds within 15 s
 *  3. If (2) fails, tries gemini-1.5-flash as a known-good fallback
 *  4. Calls /api/check-answer through the running Next.js dev server (port 3001)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Read env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(__dirname, "../.env.local");
  try {
    const raw = readFileSync(envPath, "utf-8");
    return Object.fromEntries(
      raw
        .split("\n")
        .filter((l) => l.includes("=") && !l.startsWith("#"))
        .map((l) => {
          const eq = l.indexOf("=");
          return [l.slice(0, eq).trim(), l.slice(eq + 1).trim()];
        })
    );
  } catch {
    return {};
  }
}

const env = loadEnv();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 20_000;

// ── Helpers ───────────────────────────────────────────────────────────────────
function pass(msg) {
  console.log(`  ✅ ${msg}`);
}
function fail(msg) {
  console.error(`  ❌ ${msg}`);
}
function info(msg) {
  console.log(`  ℹ️  ${msg}`);
}
function header(msg) {
  console.log(`\n── ${msg} ${"─".repeat(Math.max(0, 55 - msg.length))}`);
}

async function geminiCall(model, prompt, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 64, temperature: 0.2 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return { ok: res.ok, status: res.status, body: await res.json() };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") return { ok: false, status: "TIMEOUT", body: null };
    return { ok: false, status: "NETWORK_ERROR", body: { error: err.message } };
  }
}

async function listModels() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}&pageSize=50`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    return res.ok ? (await res.json()).models ?? [] : [];
  } catch {
    clearTimeout(timer);
    return [];
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

header("Test 1: API key present");
if (!GEMINI_API_KEY) {
  fail("GEMINI_API_KEY not found in .env.local or environment.");
  process.exit(1);
} else {
  pass(`Key found: ${GEMINI_API_KEY.slice(0, 8)}…`);
}

header("Test 2: List available models (checks key validity)");
const models = await listModels();
if (models.length === 0) {
  fail("Could not list models — key may be invalid or network unreachable.");
} else {
  pass(`${models.length} models accessible.`);
  const gemini3 = models.filter((m) => m.name.includes("gemini-3") || m.name.includes("gemini-1.5") || m.name.includes("gemini-2"));
  gemini3.forEach((m) => info(m.name));
}

header("Test 3: Probe candidate models (10s timeout each)");
const PROBE_MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-2.0-flash",
];
const PROBE_PROMPT = "Antworte auf Deutsch in einem Satz: Was ist die Hauptstadt von Deutschland?";
let firstWorking = null;
for (const model of PROBE_MODELS) {
  process.stdout.write(`  Testing ${model}… `);
  const r = await geminiCall(model, PROBE_PROMPT, 10_000);
  if (r.status === "TIMEOUT") {
    console.log("⏱ TIMEOUT");
  } else if (!r.ok) {
    const msg = r.body?.error?.message ?? JSON.stringify(r.body);
    console.log(`❌ HTTP ${r.status}: ${msg.slice(0, 100)}`);
  } else {
    const text = r.body?.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no text)";
    console.log(`✅ OK — "${text.trim().slice(0, 80)}"`);
    if (!firstWorking) firstWorking = model;
  }
}
if (firstWorking) {
  info(`First working model: ${firstWorking}`);
} else {
  fail("No model responded successfully. Billing may not be enabled on this key.");
}

header("Test 4: /api/check-answer — full route (dev server must be on :3001)");
try {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const res = await fetch("http://localhost:3001/api/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exerciseType: "open-writing",
      instruction: "Schreibe über einen Umzug.",
      prompt: "Erkläre was umziehen bedeutet.",
      mustUseWords: ["umziehen"],
      modelAnswer: "Umziehen bedeutet, die Wohnung zu wechseln.",
      studentAnswer: "Ich bin letzte Woche umgezogen.",
    }),
    signal: controller.signal,
  });
  clearTimeout(timer);
  const body = await res.json();
  if (!res.ok) {
    fail(`HTTP ${res.status}: ${body.error ?? JSON.stringify(body)}`);
  } else if (body.feedback) {
    pass(`Feedback received: "${body.feedback.slice(0, 120).trim()}…"`);
  } else {
    fail(`Unexpected response shape: ${JSON.stringify(body)}`);
  }
} catch (err) {
  if (err.name === "AbortError") {
    fail("Route timed out — check Next.js terminal for server-side error logs.");
  } else {
    fail(`Could not reach dev server: ${err.message} (Is it running on :3001?)`);
  }
}

console.log("\n");
