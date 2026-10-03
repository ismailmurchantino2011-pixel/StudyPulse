import React from 'react';
import { UserRoleView } from '../types';
import { 
  FileUp, 
  Repeat, 
  CalendarClock, 
  WifiOff, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Sparkles,
  Layers,
  Code2
} from 'lucide-react';
import { SM2_DEFAULT_FORMULA } from '../data/dossierContent';

interface Props {
  roleFilter: UserRoleView;
  onGoToInteractive?: () => void;
}

export const SectionModules: React.FC<Props> = ({ roleFilter, onGoToInteractive }) => {
  return (
    <div className="space-y-12">
      {/* Hero Overview */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Sección 1 • Arquitectura Funcional & UX
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Visión del Producto y Módulos Clave de StudyPulse
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Diseño holístico de una suite EdTech de alto impacto que combate la sobrecarga cognitiva. 
            Convierte cualquier material disperso en rutas de memorización activa, planificación predictiva y asistencia socrática personalizada en tiempo real.
          </p>
        </div>

        {/* Feature quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-indigo-400 font-bold text-lg sm:text-xl">4 Canales</span>
            <p className="text-xs text-slate-400 mt-0.5">PDF, Foto, Audio & Voz</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold text-lg sm:text-xl">SM-2 Opt.</span>
            <p className="text-xs text-slate-400 mt-0.5">Curva de Olvido mitigada</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold text-lg sm:text-xl">100% Offline</span>
            <p className="text-xs text-slate-400 mt-0.5">Local-First en SQLite</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-violet-400 font-bold text-lg sm:text-xl">RAG Grounded</span>
            <p className="text-xs text-slate-400 mt-0.5">Tutor con citas al temario</p>
          </div>
        </div>
      </div>

      {/* Module 1: Ingesta Multimodal */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <FileUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                1. Ingesta Multimodal & Generación Automatizada
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Core Engine
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Pipeline de ingesta inteligente capaz de transformar cualquier soporte documental en materiales didácticos de alta retención.
            </p>
          </div>
        </div>

        {/* 4 Ingestion Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Documentos PDF & EPub
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracción jerárquica con preservación de tablas, figuras y referencias bibliográficas mediante OCR segmentado.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Imágenes & Pizarras
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visión computacional para apuntes manuscritos, diagramas de flujo y esquemas biológicos o de ingeniería.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Grabaciones de Clases
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transcripción multimodal con detección de hablantes (profesor vs intervenciones) y marcas de tiempo sincronizadas.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Notas de Voz Rápidas
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Captura inmediata en desplazamientos; la IA normaliza las dudas orales en fichas mnemotécnicas estructuradas.
            </p>
          </div>
        </div>

        {/* 3 Outputs Generated */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Artefactos Pedagógicos Generados por la IA:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white text-sm mb-1 text-indigo-300">Resúmenes Multinivel</h4>
              <p className="text-xs text-slate-400">
                1. Visión ejecutiva en 3 balas. 2. Desarrollo conceptual en prosa fluida. 3. Glosario de términos clave obligatorios de examen.
              </p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white text-sm mb-1 text-cyan-300">Flashcards Atómicas</h4>
              <p className="text-xs text-slate-400">
                Formuladas bajo el <em>Principio de Información Mínima</em>: frontal con pregunta activa / cloze-deletion y reverso con mnemotecnia.
              </p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white text-sm mb-1 text-violet-300">Tests Tipo Test (MCQs)</h4>
              <p className="text-xs text-slate-400">
                4 distractores realistas basados en sesgos habituales, con justificación paso a paso y cita obligatoria a la página de origen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module 2: Algoritmo SM-2 Spaced Repetition */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Repeat className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                2. Sistema de Repetición Espaciada (Algoritmo SM-2 Optimizado)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Recall & Memory
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Implementación matemática del algoritmo SuperMemo 2 (Anki) adaptado con salvaguardas estocásticas anti-agrupamiento.
            </p>
          </div>
        </div>

        {/* Math Formula Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto">
              <div className="text-slate-400 text-xs mb-2">// Ecuación central de actualización de facilidad (EF):</div>
              <code>{SM2_DEFAULT_FORMULA.formula}</code>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {SM2_DEFAULT_FORMULA.description} El factor de facilidad se ajusta en cada repaso. Cuanto mayor es el reto que supuso para el estudiante, menor será el incremento del intervalo, garantizando que el concepto se vuelva a preguntar antes de desaparecer de la memoria operativa.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Optimizaciones Exclusivas de StudyPulse:
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Fuzzing de Intervalo (±5%):</strong> Previene que tras estudiar un tema largo, 150 fichas venzan exactamente el mismo día colapsando al alumno.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Modo Pánico / Cramming:</strong> Sesiones intensivas de repaso rápido 24h antes del examen sin corromper el cálculo de intervalos a largo plazo.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Detección de Fichas Sanguijuela (Leeches):</strong> Si una ficha acumula 4 fallos consecutivos, el tutor IA interviene automáticamente sugiriendo reformularla.</span>
              </li>
            </ul>

            {onGoToInteractive && (
              <button
                onClick={onGoToInteractive}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Abrir Simulador del Algoritmo SM-2 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module 3: Planificador Inteligente & Pomodoro */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                3. Planificador de Estudio Adaptativo & Pomodoro
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Smart Time Management
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Asistente de calendario contextual con reequilibrio de carga y técnica Pomodoro interactiva conectada a las fichas pendientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm text-cyan-300">Calendario Adaptativo</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Si el estudiante cancela un bloque de estudio o registra bajo rendimiento en un tema, el algoritmo reasigna los bloques futuros automáticamente sin invadir horas de sueño ni ocio protegido.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm text-cyan-300">Pomodoro Contextual 25/5 y 50/10</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alterna bloques de alta concentración con micro-pausas. Al sonar la pausa de 5 minutos, la interfaz ofrece la opción de resolver 5 flashcards rápidas de baja dificultad para afianzar retención.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm text-cyan-300">Analítica de Ritmo Circadiano</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mapea el rendimiento del usuario a lo largo de las semanas para recomendar estudiar las asignaturas más densas en sus horas de máxima agudeza mental demostrada.
            </p>
          </div>
        </div>
      </div>

      {/* Module 4: Modo Offline Completo */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <WifiOff className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                4. Modo Offline Completo (Arquitectura Local-First)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Zero Connectivity Dependency
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Garantiza disponibilidad incondicional en salas de estudio subterráneas, transportes o zonas de desconexión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Persistencia Local con WatermelonDB / SQLite
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Todas las operaciones de repaso, creación de fichas manuales, notas y temporizadores se escriben de manera inmediata en la base de datos local SQLite mediante drivers nativos en C++. Rendimiento fluido a 60/120 FPS sin latencia de red.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              Sincronización Bidireccional Delta & Conflict Resolution
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Al restablecerse la red, un despachador en segundo plano sincroniza únicamente las mutaciones delta (CRDTs / Last-Write-Wins con vector clocks). Si el alumno repasó en el móvil sin red y luego en la tablet, ningún progreso se sobrescribe o extravía.
            </p>
          </div>
        </div>
      </div>

      {/* Module 5: Asistente Tutor IA en Tiempo Real */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                5. Asistente Tutor por IA en Tiempo Real (RAG Grounding)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Socratic AI Partner
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Tutor pedagógico socrático anclado 100% al temario del estudiante con citas de página y control riguroso de alucinaciones.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mecanismos Pedagógicos & Salvaguardas:</span>
            <span className="text-xs text-violet-400 font-mono">Gemini 3.8 Flash + pgvector</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white">1. Método Socrático:</span>
              <p className="text-slate-400">Guía al estudiante con preguntas inductivas en vez de darle la respuesta directa para copiar.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-white">2. Cita de Página Obligatoria:</span>
              <p className="text-slate-400">Cada afirmación del tutor enlaza a la página y línea del PDF original subido por el alumno.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-white">3. Notificación de Límite de Conocimiento:</span>
              <p className="text-slate-400">Si el tema no está en los apuntes, avisa explícitamente antes de recurrir a conocimiento general.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
