import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  Clock, 
  ShieldCheck, 
  Bot, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const InteractivePlayground: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'sm2' | 'pomodoro' | 'gdpr' | 'tutor'>('sm2');

  // ===================== SM-2 STATE =====================
  const [sm2Repetitions, setSm2Repetitions] = useState<number>(1);
  const [sm2Interval, setSm2Interval] = useState<number>(1);
  const [sm2EaseFactor, setSm2EaseFactor] = useState<number>(2.5);
  const [lastCalculation, setLastCalculation] = useState<{
    quality: number;
    newRepetitions: number;
    newInterval: number;
    newEF: number;
    explanation: string;
  } | null>(null);

  const calculateSM2 = (quality: number) => {
    let repetitions = sm2Repetitions;
    let interval = sm2Interval;
    let ef = sm2EaseFactor;

    // Fórmula SM-2: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    let newEF = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < 1.3) newEF = 1.3;
    newEF = Math.round(newEF * 100) / 100;

    let explanation = '';

    if (quality < 3) {
      // Fallo
      repetitions = 0;
      interval = 1;
      explanation = `Calificación ${quality} (< 3): Repaso fallido. Se reinician las repeticiones consecutivas a 0 y el intervalo vuelve a 1 día para consolidar la memoria antes del olvido.`;
    } else {
      // Éxito
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * newEF);
      }
      repetitions += 1;
      explanation = `Calificación ${quality} (≥ 3): Evocación correcta. El nuevo factor de facilidad es ${newEF} y el intervalo de repaso se expande a ${interval} días.`;
    }

    setSm2Repetitions(repetitions);
    setSm2Interval(interval);
    setSm2EaseFactor(newEF);

    setLastCalculation({
      quality,
      newRepetitions: repetitions,
      newInterval: interval,
      newEF,
      explanation,
    });
  };

  const resetSM2 = () => {
    setSm2Repetitions(0);
    setSm2Interval(1);
    setSm2EaseFactor(2.5);
    setLastCalculation(null);
  };

  // ===================== POMODORO STATE =====================
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [completedCycles, setCompletedCycles] = useState<number>(2);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      if (timerMode === 'study') {
        setTimerMode('break');
        setTimerSeconds(5 * 60);
        setCompletedCycles((c) => c + 1);
      } else {
        setTimerMode('study');
        setTimerSeconds(25 * 60);
      }
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, timerMode]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ===================== GDPR ACTIONS =====================
  const [gdprExportStatus, setGdprExportStatus] = useState<string | null>(null);
  const [gdprPurgeStatus, setGdprPurgeStatus] = useState<boolean>(false);

  const handleExportData = () => {
    const exportData = {
      exportMetadata: {
        legalBasis: "RGPD Artículo 20 - Derecho a la Portabilidad",
        generatedAt: new Date().toISOString(),
        dataRegion: "eu-central-1 (Frankfurt)",
        sha256Signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      },
      userProfile: {
        pseudonymId: "usr_eu_8f4a1290b",
        birthYear: 2002,
        role: "student_premium",
        consents: {
          privacyTerms: true,
          aiProcessingAccepted: true,
          telemetryOptIn: false
        }
      },
      flashcardsSample: [
        { id: "fc_001", front: "¿Qué es el potencial de acción?", back: "Despolarización rápida de la membrana del axón", intervalDays: 6, easeFactor: 2.6 },
        { id: "fc_002", front: "¿Cuál es el neurotransmisor de la unión neuromuscular?", back: "Acetilcolina (ACh)", intervalDays: 14, easeFactor: 2.8 }
      ],
      studyStatistics: {
        totalFocusMinutes: 450,
        completedPomodoros: 18,
        activeRecallRetentionRate: "92.4%"
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyPulse_Export_GDPR_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setGdprExportStatus("Archivo JSON exportado y descargado conforme al Art. 20 RGPD");
    setTimeout(() => setGdprExportStatus(null), 4000);
  };

  const handlePurgeAccount = () => {
    if (window.confirm("¿Confirmar borrado criptográfico total bajo el Art. 17 RGPD? Esta acción es irreversible.")) {
      setGdprPurgeStatus(true);
      setTimeout(() => {
        setGdprPurgeStatus(false);
      }, 5000);
    }
  };

  // ===================== TUTOR SIMULATION =====================
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const tutorScenarios = [
    {
      query: "¿Cómo viaja el impulso nervioso a lo largo de un axón mielinizado?",
      type: "in_syllabus",
      confidence: 0.96,
      citation: "Manual de Neurobiología, Capítulo 3 (Pág. 42, Párrafo 2)",
      answer: "En los axones mielinizados, el impulso se propaga mediante **conducción saltatoria**. La vaina de mielina actúa como aislante eléctrico, haciendo que la despolarización 'salte' entre los Nodos de Ranvier desmielinizados. Esto multiplica la velocidad de conducción hasta por 50 veces.",
      aiDisclaimer: "Generado por IA StudyPulse (Gemini 3.8 Flash) • Verificado contra temario subido."
    },
    {
      query: "¿Cuál es la capital de Australia y quién ganó el último mundial?",
      type: "out_of_syllabus",
      confidence: 0.40,
      citation: "Aviso: Información ajena a los documentos del estudiante",
      answer: "⚠️ **Transparencia EU AI Act:** Esta consulta no forma parte de ninguno de tus documentos o apuntes de estudio subidos en StudyPulse. Según el conocimiento general externo del modelo: Canberra es la capital de Australia. Para mantener el rigor académico, te recomendamos centrar las consultas en tu bibliografía lectiva.",
      aiDisclaimer: "Notificación de Fuera de Temario • Cero Alucinación forzada."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Playground Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
          Laboratorio Interactivo • Validación de Algoritmos
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Simulador Interactivo de Motores Clave de StudyPulse
        </h2>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl">
          Interactúa en tiempo real con las fórmulas matemáticas del algoritmo SM-2, el temporizador Pomodoro adaptativo, las garantías de exportación del RGPD y el motor de grounding anti-alucinaciones de Gemini.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveTool('sm2')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTool === 'sm2'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Repeat className="w-4 h-4" />
            1. Algoritmo SM-2 (Anki)
          </button>
          <button
            onClick={() => setActiveTool('pomodoro')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTool === 'pomodoro'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            2. Pomodoro Adaptativo
          </button>
          <button
            onClick={() => setActiveTool('gdpr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTool === 'gdpr'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            3. Control RGPD en 1 Clic
          </button>
          <button
            onClick={() => setActiveTool('tutor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTool === 'tutor'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            4. Tutor RAG Anti-Alucinaciones
          </button>
        </div>
      </div>

      {/* TOOL 1: SM-2 */}
      {activeTool === 'sm2' && (
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-400" />
                Simulador del Algoritmo SuperMemo 2 (SM-2)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evalúa cómo responde la curva de memoria a diferentes grados de recuerdo del estudiante.
              </p>
            </div>
            <button
              onClick={resetSM2}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Valores
            </button>
          </div>

          {/* Current SM-2 State Display */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Repeticiones Consecutivas</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{sm2Repetitions}</div>
              <span className="text-[10px] text-slate-500">n-ésimo repaso exitoso</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Intervalo de Repaso</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{sm2Interval} {sm2Interval === 1 ? 'día' : 'días'}</div>
              <span className="text-[10px] text-slate-500">Próxima fecha programada</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Factor de Facilidad (EF)</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{sm2EaseFactor.toFixed(2)}</div>
              <span className="text-[10px] text-slate-500">Límite inferior: 1.30</span>
            </div>
          </div>

          {/* Card Mockup */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Ficha #42 • Farmacología Médica</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                Activa en SM-2
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pregunta (Frontal):</div>
              <div className="text-base sm:text-lg font-semibold text-white">
                ¿Cuál es el mecanismo de acción de los betabloqueantes en el miocardio?
              </div>
            </div>
            <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">Respuesta (Reverso):</div>
              Antagonizan de forma competitiva los receptores beta-1 adrenérgicos, reduciendo la frecuencia cardíaca, el gasto cardíaco y la demanda miocárdica de oxígeno.
            </div>

            {/* Quality Rating Buttons 0-5 */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Simula tu respuesta tras consultar el reverso (Calificación 0 a 5):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { q: 0, label: '0: Fallo Total', color: 'hover:border-red-500 hover:text-red-400' },
                  { q: 1, label: '1: Incorrecto', color: 'hover:border-red-400 hover:text-red-300' },
                  { q: 2, label: '2: Con Mucha Duda', color: 'hover:border-amber-400 hover:text-amber-300' },
                  { q: 3, label: '3: Correcto / Difícil', color: 'hover:border-emerald-400 hover:text-emerald-300' },
                  { q: 4, label: '4: Correcto / Fluido', color: 'hover:border-emerald-300 hover:text-emerald-200' },
                  { q: 5, label: '5: Instantáneo / Fácil', color: 'hover:border-cyan-400 hover:text-cyan-300' },
                ].map((item) => (
                  <button
                    key={item.q}
                    onClick={() => calculateSM2(item.q)}
                    className={`p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 transition-all text-center ${item.color} active:scale-95`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result explanation box */}
          {lastCalculation && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Cálculo Matemático Ejecutado:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lastCalculation.explanation}
              </p>
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-emerald-900/50">
                Formula aplicada: EF' = {sm2EaseFactor.toFixed(2)} + (0.1 - (5 - {lastCalculation.quality}) * (0.08 + (5 - {lastCalculation.quality}) * 0.02))
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: POMODORO */}
      {activeTool === 'pomodoro' && (
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Temporizador Pomodoro Contextual Adaptativo
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Conectado directamente a las sesiones de estudio y al reequilibrio de la carga cognitiva.
              </p>
            </div>
            <div className="text-xs text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Ciclo: {completedCycles} Pomodoros completados hoy
            </div>
          </div>

          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => {
                  setTimerMode('study');
                  setTimerSeconds(25 * 60);
                  setTimerRunning(false);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  timerMode === 'study' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                Bloque de Foco (25 min)
              </button>
              <button
                onClick={() => {
                  setTimerMode('break');
                  setTimerSeconds(5 * 60);
                  setTimerRunning(false);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  timerMode === 'break' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Descanso & Micro-Repaso (5 min)
              </button>
            </div>

            <div className="text-6xl sm:text-7xl font-extrabold font-mono text-white tracking-wider">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerRunning ? 'Pausar Sesión' : 'Iniciar Pomodoro'}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(timerMode === 'study' ? 25 * 60 : 5 * 60);
                }}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reiniciar temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-left text-xs space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-4 h-4" /> Integración con Active Recall:
              </div>
              <p className="text-slate-400 leading-relaxed">
                Al comenzar la pausa de 5 minutos, la interfaz móvil y web despliega opcionalmente 5 flashcards fáciles pendientes. El estudiante consolida la memoria de trabajo en un estado mental relajado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: GDPR */}
      {activeTool === 'gdpr' && (
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Centro de Soberanía del Usuario: Acciones RGPD en 1 Clic
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Demostración funcional de los derechos fundamentales de portabilidad (Art. 20) y supresión / olvido (Art. 17).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1-Click Export */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Download className="w-4 h-4 text-emerald-400" />
                Derecho a la Portabilidad (Art. 20 RGPD)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exporta la totalidad de tu historial de estudio, mazos de fichas, metadatos y consentimientos en formato JSON estándar e interoperable con un solo clic.
              </p>
              <button
                onClick={handleExportData}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar Todos Mis Datos (Descargar JSON)
              </button>
              {gdprExportStatus && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {gdprExportStatus}
                </div>
              )}
            </div>

            {/* 1-Click Erasure */}
            <div className="p-5 rounded-xl bg-slate-950 border border-red-500/20 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-red-400">
                <Trash2 className="w-4 h-4 text-red-400" />
                Derecho al Olvido & Purga Criptográfica (Art. 17 RGPD)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ejecuta una destrucción en cascada en la base de datos PostgreSQL, revoca embeddings en pgvector y borra las llaves simétricas AES-256 en el bucket europeo de almacenamiento.
              </p>
              <button
                onClick={handlePurgeAccount}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Simular Purga Inmediata de Cuenta
              </button>
              {gdprPurgeStatus && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-lg text-[11px] text-red-300 flex items-start gap-1.5 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Borrado en Ejecución:</strong> UUID desvinculado, 42 flashcards eliminadas, claves criptográficas destruidas en eu-central-1. Certificado de eliminación generado.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: TUTOR RAG GROUNDING */}
      {activeTool === 'tutor' && (
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              Simulador del Tutor Socrático RAG & Control de Alucinaciones
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verifica cómo StudyPulse diferencia entre respuestas ancladas al documento y preguntas fuera de temario para cumplir con el AI Act.
            </p>
          </div>

          {/* Document context preview */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                Documento de Estudio del Usuario en RAG:
              </span>
              <span className="text-[10px] font-mono text-slate-500">Neurobiologia_Celular_v2.pdf</span>
            </div>
            <p className="text-xs text-slate-300 font-serif italic bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              «Capítulo 3, Pág. 42: La vaina de mielina acelera la propagación del potencial de acción axonal mediante conducción saltatoria. La despolarización se regenera exclusivamente en los Nodos de Ranvier, donde la densidad de canales de sodio dependientes de voltaje es máxima.»
            </p>
          </div>

          {/* Selectable prompts */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300">
              Selecciona una consulta para enviar al Asistente Tutor:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tutorScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQuestion(idx)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedQuestion === idx
                      ? 'bg-violet-950/40 border-violet-500/50 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold block mb-1">
                    {idx === 0 ? 'Caso A: Pregunta en Temario' : 'Caso B: Pregunta Fuera de Temario'}
                  </span>
                  "{sc.query}"
                </button>
              ))}
            </div>
          </div>

          {/* Tutor Response Box */}
          <div className="p-5 rounded-xl bg-slate-950 border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-violet-400" />
                Respuesta del Tutor IA de StudyPulse
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Confianza Semántica: {(tutorScenarios[selectedQuestion].confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {tutorScenarios[selectedQuestion].answer}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-emerald-400 font-medium">
                Fuente Anclada: {tutorScenarios[selectedQuestion].citation}
              </span>
              <span className="text-slate-500">
                {tutorScenarios[selectedQuestion].aiDisclaimer}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
