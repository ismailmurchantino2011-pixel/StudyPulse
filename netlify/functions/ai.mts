import type { Config, Context } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const MODEL = "gemini-3.8-flash";

const TUTOR_PROMPT = `Eres el tutor de estudio de StudyPulse. Ayudas a estudiantes de cualquier edad a entender conceptos.
- Explica con claridad, con ejemplos y analogías, en el idioma del estudiante.
- Prefiere guiar con preguntas antes que dar respuestas para copiar.
- Si un concepto merece memorizarse, sugiere una pregunta corta para una flashcard.
- Sé breve y estructurado. Si no estás seguro de algo, dilo.`;

async function generate(ai: GoogleGenAI, body: any) {
  const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 12000) : "";
  const count = Math.min(Math.max(Number(body?.count) || 5, 1), 15);
  if (!notes) return Response.json({ error: "Pega primero tus apuntes." }, { status: 400 });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Crea ${count} flashcards de estudio a partir de estos apuntes. Cada pregunta debe evaluar una sola idea; la respuesta debe ser concisa y correcta según el texto. Usa el idioma de los apuntes.\n\nApuntes:\n${notes}`,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["front", "back", "category"],
        },
      },
    },
  });

  const cards = JSON.parse(response.text || "[]");
  return Response.json({ cards: Array.isArray(cards) ? cards.slice(0, count) : [] });
}

async function tutor(ai: GoogleGenAI, body: any) {
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];
  if (messages.length === 0) return Response.json({ error: "Escribe una pregunta." }, { status: 400 });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content).slice(0, 8000) }],
    })),
    config: { systemInstruction: TUTOR_PROMPT, temperature: 0.4, maxOutputTokens: 2048 },
  });

  return Response.json({ content: response.text || "No pude generar una respuesta." });
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const body = await req.json().catch(() => null);
  const ai = new GoogleGenAI({});

  try {
    if (context.params.action === "generate") return await generate(ai, body);
    if (context.params.action === "tutor") return await tutor(ai, body);
    return Response.json({ error: "Acción desconocida" }, { status: 404 });
  } catch (err) {
    console.error("AI error", err);
    return Response.json({ error: "La IA no está disponible ahora mismo. Inténtalo de nuevo." }, { status: 502 });
  }
};

export const config: Config = {
  path: "/api/ai/:action",
};
