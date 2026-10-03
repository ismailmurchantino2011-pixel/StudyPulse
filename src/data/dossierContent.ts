/**
 * StudyPulse - Dossier Técnico, Arquitectura y Especificaciones de Cumplimiento UE
 * Contenido exhaustivo redactado bajo las tres perspectivas: CTO, Lead UX/UI y Abogado Especialista RGPD/AI Act.
 */

export const DOSSIER_METADATA = {
  appName: "StudyPulse",
  version: "1.0-RC-Production",
  date: "2026-10-03",
  jurisdiction: "Unión Europea (RGPD, Directiva ePrivacy, EU AI Act, DSA)",
  authors: [
    { role: "Chief Technology Officer (CTO)", name: "Dirección de Ingeniería & Arquitectura Cloud" },
    { role: "Head of Product & UX/UI", name: "Diseño de Producto & Accesibilidad Cognitiva" },
    { role: "Legal Counsel & DPO", name: "Especialista en Regulación Digital Europea & Cumplimiento IA" }
  ]
};

export const SM2_DEFAULT_FORMULA = {
  title: "Algoritmo SuperMemo 2 (SM-2) Optimizado",
  formula: `EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
Si q < 3 (Fallo):
  repeticiones = 0, intervalo = 1 día
Si q >= 3 (Éxito):
  repeticiones = repeticiones + 1
  Si repeticiones == 1: intervalo = 1 día
  Si repeticiones == 2: intervalo = 6 días
  Si repeticiones > 2:  intervalo = intervalo * EF'`,
  description: "Donde 'q' es la calificación del usuario de 0 a 5, y EF (Ease Factor) tiene un límite inferior de 1.3."
};

export const SQL_SCHEMA_CODE = `-- ========================================================================
-- StudyPulse - Esquema de Base de Datos PostgreSQL con pgvector y RLS
-- Cumplimiento estricto con RGPD (Eliminación en cascada, auditoría y aislamiento)
-- ========================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Soporte para embeddings semánticos

-- 2. Enumerados para estados y roles
CREATE TYPE user_role AS ENUM ('student_free', 'student_premium', 'educator', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing', 'incomplete');
CREATE TYPE processing_status AS ENUM ('queued', 'processing', 'completed', 'failed');
CREATE TYPE material_source_type AS ENUM ('pdf', 'image', 'audio', 'voice_note', 'text');
CREATE TYPE ai_risk_tier AS ENUM ('minimal_risk', 'limited_transparency', 'high_risk');

-- 3. Tabla de Usuarios (Pseudonimizada y preparada para RGPD)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_provider_id VARCHAR(255) UNIQUE NOT NULL, -- Firebase UID o Auth0 Sub
    email_hash VARCHAR(64) NOT NULL, -- SHA-256 para búsqueda sin exponer PII
    encrypted_email BYTEA NOT NULL, -- Cifrado simétrico AES-256-GCM
    pseudonym VARCHAR(50) NOT NULL,
    birth_year INT CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    is_minor BOOLEAN GENERATED ALWAYS AS ((EXTRACT(YEAR FROM CURRENT_DATE) - birth_year) < 16) STORED,
    role user_role DEFAULT 'student_free',
    token_balance INT DEFAULT 50 CHECK (token_balance >= 0),
    data_region VARCHAR(20) DEFAULT 'eu-central-1', -- Soberanía de datos en Frankfurt
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registro de Consentimientos de Privacidad (Auditoría RGPD Art. 7)
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_version VARCHAR(20) NOT NULL,
    terms_accepted BOOLEAN NOT NULL,
    ai_processing_accepted BOOLEAN NOT NULL,
    telemetry_opt_in BOOLEAN DEFAULT FALSE,
    parental_consent_verified BOOLEAN DEFAULT FALSE,
    ip_anonymized VARCHAR(45) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Suscripciones y Facturación
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_tier VARCHAR(50) NOT NULL, -- 'free_tier', 'premium_monthly', 'premium_annual'
    status subscription_status DEFAULT 'trialing',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Documentos y Materiales de Estudio (Cifrados en Reposo)
CREATE TABLE study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    source_type material_source_type NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_checksum VARCHAR(64) NOT NULL,
    extracted_text TEXT,
    summary_markdown TEXT,
    ai_model_used VARCHAR(50),
    tokens_consumed INT DEFAULT 0,
    processing_status processing_status DEFAULT 'queued',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Fragmentos Vectorizados para RAG (Grounding del Asistente Tutor)
CREATE TABLE material_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES study_materials(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    page_number INT,
    chunk_text TEXT NOT NULL,
    embedding vector(768), -- Dimensión para gemini-embedding-2-preview
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice HNSW para búsqueda por similitud de coseno ultrarrápida
CREATE INDEX idx_material_embeddings_hnsw 
ON material_embeddings USING hnsw (embedding vector_cosine_ops);

-- 8. Fichas de Repetición Espaciada (SM-2 Algorithm)
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES study_materials(id) ON DELETE SET NULL,
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    -- Variables matemáticas de SM-2
    repetition_count INT DEFAULT 0,
    interval_days NUMERIC(8,2) DEFAULT 0.0,
    ease_factor NUMERIC(4,2) DEFAULT 2.50,
    last_reviewed_at TIMESTAMPTZ,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    consecutive_lapses INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcards_due ON flashcards(user_id, next_review_at);

-- 9. Preguntas de Examen Tipo Test con Trazabilidad Anti-Alucinaciones
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES study_materials(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array de strings ["Opción A", "Opción B", ...]
    correct_option_index INT NOT NULL CHECK (correct_option_index >= 0),
    explanation_text TEXT NOT NULL,
    source_citation TEXT NOT NULL, -- Cita literal extraída del documento para verificación
    ai_confidence_score NUMERIC(3,2) CHECK (ai_confidence_score >= 0.0 AND ai_confidence_score <= 1.0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Sesiones del Planificador Pomodoro y Hábitos
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    duration_seconds INT NOT NULL,
    focus_mode VARCHAR(50) DEFAULT 'standard_25_5',
    completed_cycles INT DEFAULT 1,
    distraction_count INT DEFAULT 0,
    subject_tag VARCHAR(100),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Habilitación de Row Level Security (RLS) en todas las tablas de usuario
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas de aislamiento multi-inquilino (Multi-tenant data isolation)
CREATE POLICY user_isolation_materials ON study_materials
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY user_isolation_flashcards ON flashcards
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY user_isolation_sessions ON study_sessions
    FOR ALL USING (user_id = auth.uid());
`;

export const GEMINI_INTEGRATION_CODE = `/**
 * StudyPulse - Integración de IA con Google GenAI SDK (@google/genai)
 * Implementa pipeline multimodal, generación estructurada con Type Schema,
 * guardrails anti-alucinaciones y citas obligatorias al documento fuente.
 */

import { GoogleGenAI, Type } from '@google/genai';

// Inicialización del cliente con la clave de entorno
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mapeo de modelos según directrices de producción
const FAST_MODEL = 'gemini-3.8-flash'; // Latencia ultrabaja para flashcards, tests y tutor en directo
const REASONING_MODEL = 'gemini-3.1-pro-preview'; // Razonamiento profundo para resúmenes de temarios densos
const EMBEDDING_MODEL = 'gemini-embedding-2-preview'; // Generación de vectores para el motor RAG

// Interfaz TypeScript para la salida estructurada de fichas
export interface GeneratedStudyDeck {
  deckTitle: string;
  executiveSummary: string;
  flashcards: Array<{
    front: string;
    back: string;
    keyConcept: string;
    difficultyEstimate: 'facil' | 'intermedio' | 'avanzado';
  }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    verbatimCitation: string; // Transparencia y mitigación de alucinaciones
    confidence: number;
  }>;
}

/**
 * Genera Flashcards y Cuestionario a partir de texto o archivo multimodal
 * Cumple con EU AI Act: fuerza citas textuales para verificar alucinaciones.
 */
export async function generateStudyMaterialFromText(
  sourceDocumentText: string,
  userLanguage: string = 'es'
): Promise<GeneratedStudyDeck> {
  const systemInstruction = \`
Eres el motor pedagógico principal de StudyPulse. Tu objetivo es convertir material de estudio
en fichas de repetición espaciada y preguntas de examen de alta retención cognitiva.

REGLAS ESTRICTAS DE CUMPLIMIENTO Y PRECISIÓN (EU AI ACT COMPLIANCE):
1. Basa cada pregunta y ficha EXCLUSIVAMENTE en el texto proporcionado.
2. Está terminantemente prohibido inventar o extrapolar conceptos ("Cero Alucinaciones").
3. Cada pregunta de examen DEBE incluir una 'verbatimCitation' con el fragmento exacto del texto fuente.
4. Genera explicaciones didácticas paso a paso orientadas a la asimilación profunda.
5. Lenguaje requerido: \${userLanguage}.
\`;

  // Esquema JSON estricto para garantizar tipado seguro y reproducible
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      deckTitle: { type: Type.STRING },
      executiveSummary: { type: Type.STRING },
      flashcards: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
            keyConcept: { type: Type.STRING },
            difficultyEstimate: { 
              type: Type.STRING, 
              enum: ['facil', 'intermedio', 'avanzado'] 
            },
          },
          required: ['front', 'back', 'keyConcept', 'difficultyEstimate'],
        },
      },
      quizQuestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            verbatimCitation: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ['question', 'options', 'correctIndex', 'explanation', 'verbatimCitation', 'confidence'],
        },
      },
    },
    required: ['deckTitle', 'executiveSummary', 'flashcards', 'quizQuestions'],
  };

  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: \`Analiza el siguiente material de estudio y genera la suite didáctica completa:\\n\\n\${sourceDocumentText}\` }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.2, // Baja temperatura para minimizar desvíos creativos y maximizar precisión
      maxOutputTokens: 8192,
    },
  });

  if (!response.text) {
    throw new Error('No se recibió contenido válido del modelo de IA');
  }

  return JSON.parse(response.text) as GeneratedStudyDeck;
}

/**
 * Asistente Tutor en tiempo real con Grounding estricto (RAG contextualizado)
 */
export async function queryStudyTutor(
  userQuery: string,
  retrievedContextChunks: Array<{ text: string; pageNumber: number; documentName: string }>
) {
  const contextString = retrievedContextChunks
    .map(c => \`[Documento: \${c.documentName} | Pág: \${c.pageNumber}]\\n\${c.text}\`)
    .join('\\n\\n---\\n\\n');

  const systemInstruction = \`
Eres el Tutor Personal Inteligente de StudyPulse.
Respondes a las dudas de los estudiantes basándote en sus apuntes y bibliografía académica.

DIRECTRICES:
- Cita siempre la página y el fragmento del documento donde se halla la respuesta.
- Si la información no se encuentra en el material de contexto proporcionado, indica claramente:
  "Esta información no figura en tus documentos subidos. Según mis conocimientos generales..."
  para mantener total transparencia ante el usuario según las normas del Reglamento de IA de la UE.
\`;

  return await ai.models.generateContentStream({
    model: FAST_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: \`Contexto verificado del temario:\\n\${contextString}\\n\\nPregunta del alumno:\\n\${userQuery}\` }
        ]
      }
    ],
    config: {
      systemInstruction,
      temperature: 0.3,
    },
  });
}
`;
