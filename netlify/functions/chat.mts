import { GoogleGenAI } from '@google/genai';

// Credentials are injected automatically by Netlify AI Gateway
const ai = new GoogleGenAI({});

// System instructions based on selected chatbot role
const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  tutor: `Eres el Tutor Socrático Inteligente de StudyPulse, una plataforma EdTech europea de alto rendimiento.
Tu función es guiar al estudiante para que asimile conceptos profundos sin darle respuestas masticadas para copiar.
- Utiliza preguntas inductivas, analogías didácticas y ejemplos paso a paso.
- Cuando expliques un concepto, sugiere cómo convertirlo en una flashcard de repetición espaciada (SM-2).
- Cumple estrictamente con el principio de veracidad académica y transparencia del Reglamento de IA de la UE.
- Responde con tono amable, motivador, claro y estructurado con viñetas cuando sea didáctico.`,

  examiner: `Eres el Examinador Académico Riguroso de StudyPulse.
Tu objetivo es evaluar y poner a prueba los conocimientos del estudiante para prepararlo al 100% para exámenes oficiales o de oposición.
- Plantea preguntas de examen desafiantes, preguntas tipo test con distractores verosímiles o problemas para resolver.
- Evalúa con precisión técnica las respuestas del alumno, señalando errores conceptuales o imprecisiones.
- Proporciona retroalimentación cuantitativa y cualitativa constructiva.`,

  legal: `Eres el Asesor Especialista en Regulación Digital y DPO de StudyPulse.
Eres experto en el RGPD (Reglamento UE 2016/679), el EU AI Act (Reglamento UE 2024/1689), la Directiva ePrivacy y la protección de menores.
- Responde dudas sobre soberanía de datos en Europa, derechos ARCO-POL, derecho al olvido, clasificación de riesgo de sistemas de IA y privacidad por diseño.
- Fundamenta tus respuestas con citas precisas a los artículos de la legislación europea aplicable de forma rigurosa y comprensible.`,

  cto: `Eres el Chief Technology Officer (CTO) y Arquitecto de Software de StudyPulse.
Tu especialidad es la ingeniería de software: arquitectura Local-First con React Native / SQLite / WatermelonDB, PostgreSQL 16 con pgvector, diseño de algoritmos de repetición espaciada (SM-2) y orquestación de modelos Gemini.
- Explica decisiones de arquitectura, diseño de bases de datos, código TypeScript y optimización de latencia en apps móviles y web.`
};

// Valid models mapping
const VALID_MODELS: Record<string, string> = {
  'gemini-3.8-flash': 'gemini-3.8-flash',
  'gemini-3.5-flash': 'gemini-3.8-flash', // mapped to current flash
  'gemini-3.1-flash-lite': 'gemini-3.1-flash-lite',
  'gemini-3.1-pro-preview': 'gemini-3.1-pro-preview',
};

// API: Multi-turn Chat Endpoint
export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { messages, role = 'tutor', model = 'gemini-3.8-flash' } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'La conversación debe contener al menos un mensaje.' }, { status: 400 });
    }

    const selectedModel = VALID_MODELS[model] || 'gemini-3.8-flash';
    const systemInstruction = ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.tutor;

    // Convert messages to Gemini format: { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: role === 'examiner' || role === 'legal' ? 0.2 : 0.4,
        maxOutputTokens: 2048,
      },
    });

    return Response.json({
      role: 'assistant',
      content: response.text || 'No se pudo generar respuesta.',
      modelUsed: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error en /api/chat:', error);
    return Response.json(
      { error: error?.message || 'Error al comunicarse con el modelo Gemini' },
      { status: 500 },
    );
  }
};

export const config = {
  path: '/api/chat',
};
