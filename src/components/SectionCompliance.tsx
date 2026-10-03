import React from 'react';
import { UserRoleView } from '../types';
import { 
  ShieldCheck, 
  Scale, 
  Baby, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  FileCheck, 
  Server,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

interface Props {
  roleFilter: UserRoleView;
  onGoToInteractive?: () => void;
}

export const SectionCompliance: React.FC<Props> = ({ roleFilter, onGoToInteractive }) => {
  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Sección 2 • Marco Regulatorio Europeo
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Cumplimiento Normativo de la UE: RGPD, EU AI Act & Menores
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Directrices exhaustivas redactadas por nuestro comité legal y DPO. Garantizan que StudyPulse supere auditorías de la Agencia Española de Protección de Datos (AEPD), la CNIL francesa y el Reglamento de Inteligencia Artificial (UE) 2024/1689.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
              <ShieldCheck className="w-4 h-4" /> RGPD / GDPR
            </div>
            <p className="text-xs text-slate-400">Exportar/Borrar en 1 Clic • Residencia en Fráncfort</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
              <Scale className="w-4 h-4" /> EU AI Act (2024/1689)
            </div>
            <p className="text-xs text-slate-400">Riesgo Limitado • Transparencia Art. 50 • Anti-Alucinación</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
              <Baby className="w-4 h-4" /> Protección de Menores
            </div>
            <p className="text-xs text-slate-400">Consentimiento parental Art. 8 • Cero Perfilado</p>
          </div>
        </div>
      </div>

      {/* 2.1 GDPR */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                2.1 Reglamento General de Protección de Datos (RGPD)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Reglamento (UE) 2016/679
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Mecanismos técnicos para asegurar soberanía absoluta del usuario sobre sus apuntes, datos de estudio y privacidad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 1-Click Export & Erase */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 text-emerald-300">
              <FileCheck className="w-4 h-4" />
              Control Total en 1 Clic (Arts. 17 y 20 RGPD)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Derecho a la Portabilidad (Art. 20):</strong> El usuario dispone en su perfil de un botón que compila en un archivo ZIP estructurado (\`data_export.json\`, fichas en CSV y resúmenes en Markdown) con descarga instantánea en menos de 2 segundos.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Derecho al Olvido (Art. 17):</strong> El botón «Borrar cuenta y purgar datos» ejecuta un borrado en cascada con <em>Crypto-Shredding</em>: se eliminan las filas en PostgreSQL, se purgan los vectores en pgvector y se destruyen las llaves de cifrado en el bucket de storage.
            </p>
            {onGoToInteractive && (
              <button
                onClick={onGoToInteractive}
                className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
              >
                Probar simulación de Exportación/Borrado en 1-Clic →
              </button>
            )}
          </div>

          {/* Card 2: Cookie Consent & Telemetry */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 text-emerald-300">
              <Sliders className="w-4 h-4" />
              Consentimiento Granular sin Dark Patterns
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cumplimiento con la Directiva ePrivacy y criterios del EDPB. Prohibición estricta de casillas premarcadas o botones dispares.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li><strong>Esenciales:</strong> Almacenamiento de tokens JWT de sesión (exentos de consentimiento).</li>
              <li><strong>Analítica de Rendimiento:</strong> Métricas anónimas agregadas (opt-in explícito).</li>
              <li><strong>Entrenamiento de IA:</strong> Desactivado por defecto. Ningún apunte privado de usuario se utiliza para fine-tuning general sin consentimiento expreso por separado.</li>
            </ul>
          </div>

          {/* Card 3: Soberanía de Datos y Pseudonimización */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 text-emerald-300">
              <Server className="w-4 h-4" />
              Soberanía de Datos en la UE (Frankfurt / Bélgica)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Toda la infraestructura cloud (Cloud SQL, Supabase Managed, buckets S3-compatible) se localiza en la región \`eu-central-1\` (Fráncfort) y \`europe-west1\` (Bélgica). Blindaje legal frente a requerimientos extraterritoriales no conformes con el RGPD.
            </p>
          </div>

          {/* Card 4: Pseudonimización estricta */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 text-emerald-300">
              <Lock className="w-4 h-4" />
              Pseudonimización Previa a Inferencia
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Antes de enviar cualquier bloque de texto al modelo de IA, un pipeline de inspección local ofusca información de identificación personal (PII): nombres de alumnos, correos electrónicos, DNIs y números telefónicos son sustituidos por tokens neutros [ALUMNO_REF_1].
            </p>
          </div>
        </div>
      </div>

      {/* 2.2 EU AI Act */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                2.2 Reglamento de IA de la UE (EU AI Act - Reg. 2024/1689)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Transparency & Safety
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Análisis de riesgos, obligaciones de transparencia y salvaguardas para prevenir alucinaciones conceptuales en el ámbito académico.
            </p>
          </div>
        </div>

        {/* Risk Classification Callout */}
        <div className="p-5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Dictamen Jurídico sobre Clasificación de Riesgo (Artículo 6 & Anexo III)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            El Anexo III, punto 3 del AI Act califica como <em>Alto Riesgo</em> a los sistemas de IA utilizados para determinar el acceso o evaluar los resultados de los estudiantes en instituciones educativas oficiales.
          </p>
          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Clasificación Concluyente: RIESGO LIMITADO / BAJO
            </div>
            <p>
              StudyPulse opera como <strong>herramienta extracurricular de apoyo al estudio individual</strong>. No califica exámenes oficiales ni toma decisiones determinantes con efectos jurídicos sobre la vida académica del usuario. Por tanto, está sujeta principalmente al <strong>Capítulo IV y Artículos 50/52</strong> (Obligaciones de Transparencia y Etiquetado), manteniendo un estándar voluntario de máxima seguridad.
            </p>
          </div>
        </div>

        {/* 3 Pillars of AI Act Implementation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Eye className="w-4 h-4 text-indigo-400" />
              1. Notificación Prominente (Art. 50)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada flashcard, resumen y respuesta del tutor cuenta con un distintivo visual identificable: <em>«Generado por IA StudyPulse»</em> junto con el modelo usado y la fecha de creación.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              2. Prevención de Alucinaciones
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Temperatura baja (0.2), RAG anclado a fragmentos del documento subido con citas textuales obligatorias. Si el modelo no halla sustento en el texto, el sistema declara explícitamente la falta de evidencia.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Scale className="w-4 h-4 text-indigo-400" />
              3. Auditoría y Reporte de Errores
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Botón de <em>«Reportar discrepancia didáctica»</em>. Los reportes se almacenan en un log auditable para monitorizar desviaciones o sesgos en asignaturas complejas.
            </p>
          </div>
        </div>
      </div>

      {/* 2.3 Protection of Minors */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Baby className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                2.3 Protección Específica de Menores de Edad
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Directiva UE & Art. 8 RGPD
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Medidas de salvaguarda reforzadas para estudiantes escolares y preuniversitarios en todo el territorio de la Unión Europea.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm text-cyan-300">Verificación de Edad en Onboarding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Selector de año de nacimiento neutral. Si el usuario se encuentra por debajo de la edad de consentimiento digital de su país (14 años en España, 16 en Alemania), se activa la pasarela de consentimiento paterno/tutor.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm text-cyan-300">Cero Perfilado y Cero Publicidad</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bloqueo terminante de rastreo de comportamiento comercial. Las cuentas de menores tienen deshabilitada cualquier métrica publicitaria o cesión analítica a terceros.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm text-cyan-300">Filtro de Contenido Reforzado</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              El Tutor IA aplica automáticamente un filtro de moderación estricto para impedir la generación de contenidos inapropiados o no afines a planes de estudio de secundaria/bachillerato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
