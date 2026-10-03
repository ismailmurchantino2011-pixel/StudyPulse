import React, { useState } from 'react';
import { UserRoleView, PricingPlan } from '../types';
import { 
  Coins, 
  Check, 
  Sparkles, 
  Zap, 
  Gift, 
  CreditCard, 
  ArrowRight,
  ShieldAlert,
  Percent,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

interface Props {
  roleFilter: UserRoleView;
}

export const SectionMonetization: React.FC<Props> = ({ roleFilter }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Plan Gratuito (Freemium)',
      price: '0 €',
      period: 'para siempre',
      description: 'Acceso básico para descubrir el poder del Active Recall sin barreras.',
      features: [
        { text: '3 subidas de PDF al mes (hasta 20 págs/doc)', included: true },
        { text: 'Hasta 150 flashcards activas en SM-2', included: true },
        { text: 'Temporizador Pomodoro 25/5 estándar', included: true },
        { text: '15 consultas/mes al Tutor IA (Gemini Flash)', included: true },
        { text: 'Modo Offline básico (repasos del día)', included: true },
        { text: 'Subidas de audio y notas de voz ilimitadas', included: false },
        { text: 'Tutor IA ilimitado con Gemini Pro', included: false },
        { text: 'Sincronización multidispositivo ilimitada', included: false },
      ],
      cta: 'Plan Actual',
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: billingPeriod === 'annual' ? '5,83 €' : '9,99 €',
      period: billingPeriod === 'annual' ? 'al mes (facturado 69,99 €/año)' : 'al mes',
      badge: 'Más Popular • -40% Anual',
      description: 'Para estudiantes de alto rendimiento, opositores y universitarios.',
      features: [
        { text: 'Subidas ILIMITADAS de documentos (hasta 500 págs/doc)', included: true, highlight: true },
        { text: 'Transcripción ilimitada de audio y clases grabadas', included: true, highlight: true },
        { text: 'Flashcards ilimitadas + Modo Pánico / Cramming', included: true },
        { text: 'Tutor IA ILIMITADO 24/7 con Gemini Pro', included: true, highlight: true },
        { text: 'Modo Offline avanzado con Vector Cache local', included: true },
        { text: 'Sincronización instantánea Web, Tablet y Móvil', included: true },
        { text: 'Garantía de reembolso de 14 días sin preguntas', included: true },
      ],
      cta: 'Comenzar 7 Días de Prueba Gratis',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Sección 3 • Estrategia de Monetización & LTV
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Monetización Orgánica, Escalable y de Alta Conversión
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Modelo híbrido Freemium + Suscripción + Microtransacciones de tokens diseñado para maximizar la conversión sin alienar a la comunidad estudiantil.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Conversión Freemium Objetivo</span>
            <div className="text-xl font-bold text-amber-400 mt-1">4.8% – 6.2%</div>
            <p className="text-[11px] text-slate-500">Benchmark superior en EdTech</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Retención Anual (LTV)</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">112 € LTV</div>
            <p className="text-[11px] text-slate-500">Ciclo académico de 18-24 meses</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Anti-Fricción Paywall</span>
            <div className="text-xl font-bold text-cyan-400 mt-1">Value-First</div>
            <p className="text-[11px] text-slate-500">Preaviso 48h antes del cobro</p>
          </div>
        </div>
      </div>

      {/* Pricing Switcher */}
      <div className="flex justify-center items-center gap-3">
        <span className={`text-xs sm:text-sm font-medium ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
          Facturación Mensual
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
          className="w-14 h-7 bg-slate-800 rounded-full p-1 relative transition-colors border border-slate-700 focus:outline-none"
        >
          <div
            className={`w-5 h-5 rounded-full bg-amber-500 shadow-md transform transition-transform ${
              billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs sm:text-sm font-medium ${billingPeriod === 'annual' ? 'text-white' : 'text-slate-400'}`}>
            Facturación Anual
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Ahorra 40%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isPremium = plan.id === 'premium';
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                isPremium
                  ? 'bg-gradient-to-b from-slate-900 via-indigo-950/50 to-slate-900 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 relative'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>

                <div className="my-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">{plan.period}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Características Incluidas:
                  </span>
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      {f.included ? (
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${f.highlight ? 'text-amber-400' : 'text-emerald-400'}`} />
                      ) : (
                        <span className="w-4 h-4 shrink-0 text-slate-600 flex items-center justify-center font-bold">✕</span>
                      )}
                      <span className={f.included ? (f.highlight ? 'text-amber-200 font-semibold' : 'text-slate-200') : 'text-slate-500 line-through'}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                    isPremium
                      ? 'bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Micropagos / In-App Token Packs */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Micropagos In-App: StudyCredits (Sin Compromiso de Suscripción)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Flexibility & Anti-Churn
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Para estudiantes que afrontan semanas de exámenes puntuales y necesitan procesar documentos extra o consultas ilimitadas al tutor sin suscribirse mensualmente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Pack Básico</span>
              <span className="text-lg font-extrabold text-amber-400">2,99 €</span>
            </div>
            <div className="text-sm font-bold text-white">100 StudyCredits</div>
            <p className="text-xs text-slate-400">
              Ideal para procesar 1 PDF extenso (hasta 80 págs) y 50 consultas de resolución de dudas con el tutor.
            </p>
            <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
              Sin caducidad mensual • Compra en 1 toque
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-3 relative">
            <span className="absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
              Mejor Valor
            </span>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Pack Opositor</span>
              <span className="text-lg font-extrabold text-amber-400">6,99 €</span>
            </div>
            <div className="text-sm font-bold text-white">300 StudyCredits</div>
            <p className="text-xs text-slate-400">
              Procesa hasta 4 manuales completos, 2 horas de grabaciones de audio y cientos de flashcards con IA.
            </p>
            <div className="text-[11px] text-emerald-400 border-t border-slate-800/80 pt-2">
              Ahorras 30% respecto al pack básico
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Campus / Grupo</span>
              <span className="text-lg font-extrabold text-amber-400">14,99 €</span>
            </div>
            <div className="text-sm font-bold text-white">800 StudyCredits</div>
            <p className="text-xs text-slate-400">
              Compartible entre compañeros de estudio para preparar exámenes finales o asignaturas cuatrimestrales.
            </p>
            <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
              Soporte para generación masiva en lote
            </div>
          </div>
        </div>
      </div>

      {/* Paywall UX Guidelines */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-indigo-400" />
          Directrices de UX de Paywall (No Agresivo pero de Alta Conversión)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-white block mb-1">1. Value-First Timing</span>
            <p className="text-slate-400">El paywall nunca aparece en el registro. Se muestra cuando el usuario completa 50 repasos o tras el éxito de su primer examen simulado.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-white block mb-1">2. Soft Limit con Preaviso</span>
            <p className="text-slate-400">Al subir el 3º PDF se notifica con cordialidad: "Te queda 1 PDF gratis este mes. ¿Quieres desbloquear PDFs ilimitados?".</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-white block mb-1">3. Recordatorio Anti-Sorpresa</span>
            <p className="text-slate-400">Notificación automática 48h antes del fin de la prueba de 7 días. Genera confianza radical y reduce un 68% las devoluciones de cargo.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-white block mb-1">4. Verificación Estudiantil</span>
            <p className="text-slate-400">Descuento institucional del 40% inmediato validando con correo universitario (.edu / .es / SheerID).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
