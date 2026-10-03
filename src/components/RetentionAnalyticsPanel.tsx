import React, { useMemo } from 'react';
import { Flashcard } from '../types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { 
  BarChart3, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface Props {
  deck: Flashcard[];
}

export const RetentionAnalyticsPanel: React.FC<Props> = ({ deck }) => {
  // Compute retention statistics from the live deck
  const stats = useMemo(() => {
    let learnedCount = 0; // interval >= 6 and repetitions >= 2
    let inProgressCount = 0; // repetitions 1-2
    let pendingCount = 0; // repetitions 0 or interval == 1

    let sumEF = 0;

    // Interval distribution buckets
    const intervalBuckets = {
      '1 día': 0,
      '2-5 días': 0,
      '6-14 días': 0,
      '15-30 días': 0,
      '+30 días': 0,
    };

    deck.forEach((card) => {
      const { repetitions, interval, easeFactor } = card.sm2;
      sumEF += easeFactor;

      // Classification
      if (repetitions >= 2 && interval >= 6) {
        learnedCount++;
      } else if (repetitions >= 1) {
        inProgressCount++;
      } else {
        pendingCount++;
      }

      // Bucketing
      if (interval <= 1) {
        intervalBuckets['1 día']++;
      } else if (interval <= 5) {
        intervalBuckets['2-5 días']++;
      } else if (interval <= 14) {
        intervalBuckets['6-14 días']++;
      } else if (interval <= 30) {
        intervalBuckets['15-30 días']++;
      } else {
        intervalBuckets['+30 días']++;
      }
    });

    const total = deck.length || 1;
    const avgEF = (sumEF / total).toFixed(2);
    const retentionRate = Math.round(((learnedCount + inProgressCount * 0.5) / total) * 100);

    // Pie chart data
    const pieData = [
      { name: 'Aprendidas / Consolidadas', value: learnedCount, color: '#10b981' },
      { name: 'En Proceso de Afianzamiento', value: inProgressCount, color: '#f59e0b' },
      { name: 'Pendientes / Nuevas', value: pendingCount, color: '#6366f1' },
    ];

    // Bar chart data for interval distribution
    const barData = [
      { rango: '1 día', tarjetas: intervalBuckets['1 día'], fill: '#ef4444', desc: 'Repaso crítico' },
      { rango: '2-5 días', tarjetas: intervalBuckets['2-5 días'], fill: '#f59e0b', desc: 'Fase temprana' },
      { rango: '6-14 días', tarjetas: intervalBuckets['6-14 días'], fill: '#3b82f6', desc: 'Media duración' },
      { rango: '15-30 días', tarjetas: intervalBuckets['15-30 días'], fill: '#8b5cf6', desc: 'Retención sólida' },
      { rango: '+30 días', tarjetas: intervalBuckets['+30 días'], fill: '#10b981', desc: 'Largo plazo' },
    ];

    // Theoretical retention comparison (Ebbinghaus decay vs StudyPulse SM-2)
    const retentionCurveData = [
      { dia: 'Día 0', sinRepaso: 100, conStudyPulse: 100 },
      { dia: 'Día 1', sinRepaso: 58, conStudyPulse: 96 },
      { dia: 'Día 3', sinRepaso: 36, conStudyPulse: 94 },
      { dia: 'Día 6', sinRepaso: 24, conStudyPulse: 95 },
      { dia: 'Día 14', sinRepaso: 16, conStudyPulse: 93 },
      { dia: 'Día 30', sinRepaso: 10, conStudyPulse: 92 },
    ];

    return {
      total: deck.length,
      learnedCount,
      inProgressCount,
      pendingCount,
      avgEF,
      retentionRate,
      pieData,
      barData,
      retentionCurveData,
    };
  }, [deck]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tasa de Retención</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {stats.retentionRate}%
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Índice de recuerdo activo
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fichas Consolidadas</span>
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
            {stats.learnedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            de {stats.total} fichas en mazo
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pendientes / Nuevas</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
            {stats.pendingCount + stats.inProgressCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.pendingCount} hoy • {stats.inProgressCount} en proceso
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Factor Facilidad Medio</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
            {stats.avgEF}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            EF Promedio SM-2 (Base 2.50)
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: Fichas Aprendidas frente a Pendientes (Donut Chart) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Progreso de Retención del Mazo</h3>
                <p className="text-xs text-slate-400">Fichas aprendidas vs en proceso vs pendientes</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {stats.total} Tarjetas
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any, name: any) => [`${value} tarjetas`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-xs text-slate-300 font-medium">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block text-sm">{stats.learnedCount}</span>
              <span className="text-[11px] text-slate-400">Aprendidas</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-amber-400 font-bold block text-sm">{stats.inProgressCount}</span>
              <span className="text-[11px] text-slate-400">En proceso</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-indigo-400 font-bold block text-sm">{stats.pendingCount}</span>
              <span className="text-[11px] text-slate-400">Pendientes</span>
            </div>
          </div>
        </div>

        {/* CHART 2: Distribución de Intervalos de Repaso (Bar Chart) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Distribución de Intervalos SM-2</h3>
                <p className="text-xs text-slate-400">Días asignados hasta la próxima repetición</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              Spaced Intervals
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="rango" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any, _name: any, item: any) => [
                    `${value} tarjetas (${item.payload.desc})`,
                    'Cantidad',
                  ]}
                />
                <Bar dataKey="tarjetas" radius={[6, 6, 0, 0]}>
                  {stats.barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Intervalos cortos: consolidación activa</span>
            <span className="text-emerald-400 font-medium">+30 días: memoria a largo plazo</span>
          </div>
        </div>
      </div>

      {/* CHART 3: Curva de Ebbinghaus vs Curva SM-2 StudyPulse */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Efectividad Científica: Curva del Olvido</h3>
              <p className="text-xs text-slate-400">
                Pérdida de memoria espontánea frente a retención protegida con StudyPulse SM-2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Sin Repaso (Olvido)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> StudyPulse SM-2
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.retentionCurveData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDecay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="dia" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 100]} unit="%" stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(value: any) => [`${value}% de retención`, '']}
              />
              <Area
                type="monotone"
                dataKey="conStudyPulse"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPulse)"
                name="Con StudyPulse SM-2"
              />
              <Area
                type="monotone"
                dataKey="sinRepaso"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorDecay)"
                name="Sin Repetición Espaciada"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Fundamento Neurocientífico:</strong> Sin repetición espaciada, se olvida más del 75% del temario en 6 días. El algoritmo SM-2 reactiva el trazo de memoria en el umbral exacto de degradación, transformando la memoria de trabajo en memoria a largo plazo consolidada.
          </span>
        </div>
      </div>
    </div>
  );
};
