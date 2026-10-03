import React, { useState } from 'react';
import { UserRoleView } from '../types';
import { 
  Cpu, 
  Database, 
  Code2, 
  Layers, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles,
  Server,
  Zap,
  Smartphone
} from 'lucide-react';
import { SQL_SCHEMA_CODE, GEMINI_INTEGRATION_CODE } from '../data/dossierContent';

interface Props {
  roleFilter: UserRoleView;
}

export const SectionArchitecture: React.FC<Props> = ({ roleFilter }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'gemini'>('sql');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedGemini, setCopiedGemini] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_CODE);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copyGemini = () => {
    navigator.clipboard.writeText(GEMINI_INTEGRATION_CODE);
    setCopiedGemini(true);
    setTimeout(() => setCopiedGemini(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Sección 4 • Arquitectura Técnica Recomendada
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Arquitectura de Software, Esquema SQL & Gemini AI Pipeline
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Plano de ingeniería de grado de producción: stack cross-platform local-first, base de datos relacional con búsqueda semántica vectorial (pgvector) y orquestación multimodal con Google GenAI SDK.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Frontend Stack</span>
            <div className="text-sm font-bold text-white mt-1">React Native + Expo</div>
            <p className="text-[10px] text-slate-500">WatermelonDB Local-First</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Backend & Base de Datos</span>
            <div className="text-sm font-bold text-white mt-1">PostgreSQL 16 + pgvector</div>
            <p className="text-[10px] text-slate-500">Supabase Managed / Cloud SQL</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Modelos de IA</span>
            <div className="text-sm font-bold text-white mt-1">Gemini 3.8 Flash & Pro</div>
            <p className="text-[10px] text-slate-500">@google/genai TypeScript SDK</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Soberanía de Datos</span>
            <div className="text-sm font-bold text-white mt-1">Región Fráncfort (UE)</div>
            <p className="text-[10px] text-slate-500">100% Inmune a CLOUD Act</p>
          </div>
        </div>
      </div>

      {/* Frontend Comparison: React Native vs Flutter */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                4.1 Evaluación y Decisión del Stack Frontend
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Dictamen del CTO
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Comparativa objetiva de viabilidad para una aplicación educativa móvil y web simultánea.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* React Native Card */}
          <div className="p-5 rounded-xl bg-indigo-950/30 border-2 border-indigo-500/40 space-y-3 relative">
            <span className="absolute -top-3 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500 text-white">
              RECOMENDADO (Elegido)
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              React Native con Expo + TypeScript
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Ecosistema Local-First Superior:</strong> WatermelonDB corre sobre C++ SQLite de alto rendimiento, permitiendo sincronizaciones reactivas fluidas para decenas de miles de fichas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Convergencia Web Unificada (Expo Router):</strong> Un único repositorio TypeScript comparte el 92% de lógica de negocio, hooks, tipos y componentes entre iOS, Android y Navegadores Web.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Time-to-Market y Facturación:</strong> Integración trivial con RevenueCat para App Store y Google Play Billing.</span>
              </li>
            </ul>
          </div>

          {/* Flutter Card */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              Flutter (Dart)
            </h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 font-bold">✓</span>
                <span><strong>Ventaja:</strong> Motor de renderizado visual autónomo (Impeller) con animaciones excelentes a 120 FPS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠</span>
                <span><strong>Desventaja Web:</strong> Mayor peso del bundle inicial en web (WASM / CanvasKit), lo que degrada las métricas Core Web Vitals y la indexación SEO de apuntes públicos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠</span>
                <span><strong>Fricción de Stack:</strong> Requeriría mantener dos bases de código o programar en Dart para frontend y TypeScript para el backend de IA, aumentando los costes operativos del equipo de ingeniería.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Backend & AI Infrastructure */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                4.2 Arquitectura de Datos y Pipeline de Gemini AI
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Vector RAG & Cloud
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Estructura de base de datos relacional robusta con índices HNSW para búsqueda por coseno y código TypeScript del SDK @google/genai.
            </p>
          </div>
        </div>

        {/* Code Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('sql')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCodeTab === 'sql'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Esquema SQL Completo (PostgreSQL + pgvector)
            </button>
            <button
              onClick={() => setActiveCodeTab('gemini')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCodeTab === 'gemini'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Integración de IA (TypeScript @google/genai)
            </button>
          </div>

          <div>
            {activeCodeTab === 'sql' ? (
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copiado' : 'Copiar DDL SQL'}
              </button>
            ) : (
              <button
                onClick={copyGemini}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                {copiedGemini ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedGemini ? 'Copiado' : 'Copiar Código TypeScript'}
              </button>
            )}
          </div>
        </div>

        {/* Code Content */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
            <span>{activeCodeTab === 'sql' ? 'db/schema_v1.0.sql (PostgreSQL 16 + pgvector + RLS)' : 'services/geminiStudyEngine.ts (Official @google/genai SDK)'}</span>
            <span className="text-slate-500">UTF-8 • Production-Ready</span>
          </div>
          <div className="p-4 overflow-x-auto max-h-[520px] font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
            <pre>
              <code>{activeCodeTab === 'sql' ? SQL_SCHEMA_CODE : GEMINI_INTEGRATION_CODE}</code>
            </pre>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-400 block">Row Level Security (RLS)</span>
            <p className="text-slate-400">Aislamiento criptográfico multi-tenant a nivel de motor de base de datos para impedir fugas de datos entre estudiantes.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Índice HNSW para pgvector</span>
            <p className="text-slate-400">Consultas de similitud de coseno en menos de 12ms sobre millones de fragmentos de temarios vectorizados.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">ResponseSchema Estricto</span>
            <p className="text-slate-400">Tipado JSON garantizado con Type Schema de @google/genai sin riesgo de fallos de serialización o parseo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
