import React, { useState, useEffect } from 'react';
import { Flashcard, AgeProfile } from '../types';
import { RetentionAnalyticsPanel } from './RetentionAnalyticsPanel';
import { CheckoutModal } from './CheckoutModal';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Plus, 
  BrainCircuit, 
  Flame, 
  Clock, 
  Layers, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  BookOpen, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  BarChart3,
  Crown,
  Volume2,
  GraduationCap,
  Backpack,
  BookMarked
} from 'lucide-react';

const INITIAL_DECK: Flashcard[] = [
  {
    id: 'fc-1',
    front: '¿Cuál es el mecanismo de la conducción saltatoria en neuronas mielinizadas?',
    back: 'El potencial de acción se regenera exclusivamente en los Nodos de Ranvier, saltando sobre las vainas de mielina aislantes, lo que multiplica la velocidad de conducción hasta 50 veces con menor consumo energético.',
    category: 'Neurobiología',
    sm2: {
      repetitions: 2,
      interval: 6,
      easeFactor: 2.6,
      nextReviewDate: 'Hoy',
    }
  },
  {
    id: 'fc-2',
    front: '¿Qué es el Factor de Facilidad (Ease Factor, EF) en el algoritmo SM-2?',
    back: 'Es una variable matemática que cuantifica la dificultad intrínseca de una ficha. Comienza en 2.50 (con un piso mínimo de 1.30) y se actualiza según la calificación del usuario para determinar el multiplicador del siguiente intervalo.',
    category: 'Ciencia Cognitiva',
    sm2: {
      repetitions: 1,
      interval: 1,
      easeFactor: 2.5,
      nextReviewDate: 'Hoy',
    }
  },
  {
    id: 'fc-3',
    front: '¿Cuál es el límite territorial de consentimiento digital de menores en España según el RGPD?',
    back: 'En España el límite de consentimiento digital válido es de 14 años (Art. 7 LOPDGDD). Por debajo de esa edad se requiere autorización parental verificable para el tratamiento de datos.',
    category: 'Derecho Digital UE',
    sm2: {
      repetitions: 3,
      interval: 15,
      easeFactor: 2.7,
      nextReviewDate: 'En 12 días',
    }
  },
  {
    id: 'fc-4',
    front: '¿Por qué la extensión pgvector utiliza índices HNSW para búsqueda semántica?',
    back: 'HNSW (Hierarchical Navigable Small World) crea grafos multidimensionales que permiten realizar búsquedas de k-vecinos más próximos (k-NN) con complejidad O(log N) y latencias < 15ms.',
    category: 'Bases de Datos',
    sm2: {
      repetitions: 1,
      interval: 1,
      easeFactor: 2.4,
      nextReviewDate: 'Hoy',
    }
  }
];

export const ActiveStudyApp: React.FC<{ onOpenInstallModal: () => void }> = ({ onOpenInstallModal }) => {
  const [deck, setDeck] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('studypulse_deck');
    return saved ? JSON.parse(saved) : INITIAL_DECK;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [subTab, setSubTab] = useState<'study' | 'analytics'>('study');
  const [ageProfile, setAgeProfile] = useState<AgeProfile>('academic');
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('studypulse_premium') === 'true';
  });
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = ageProfile === 'junior' ? 0.9 : ageProfile === 'adult' ? 0.85 : 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // New card form state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  // Quick AI note generator state
  const [aiNoteText, setAiNoteText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('studypulse_deck', JSON.stringify(deck));
  }, [deck]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentCard = deck[currentIndex] || deck[0];

  const handleGrade = (quality: number) => {
    if (!currentCard) return;

    let { repetitions, interval, easeFactor } = currentCard.sm2;

    // SM-2 Formula
    let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < 1.3) newEF = 1.3;
    newEF = Math.round(newEF * 100) / 100;

    let newInterval = 1;
    let newReps = repetitions;

    if (quality < 3) {
      newReps = 0;
      newInterval = 1;
    } else {
      if (repetitions === 0) newInterval = 1;
      else if (repetitions === 1) newInterval = 6;
      else newInterval = Math.round(interval * newEF);
      newReps += 1;
    }

    const updatedCard: Flashcard = {
      ...currentCard,
      sm2: {
        repetitions: newReps,
        interval: newInterval,
        easeFactor: newEF,
        nextReviewDate: newInterval === 1 ? 'Mañana' : `En ${newInterval} días`,
      }
    };

    const newDeck = [...deck];
    newDeck[currentIndex] = updatedCard;
    setDeck(newDeck);

    // Flip back and advance to next card
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      front: newFront.trim(),
      back: newBack.trim(),
      category: newCategory.trim() || 'General',
      sm2: {
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: 'Hoy',
      }
    };

    setDeck([newCard, ...deck]);
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleAIGenerateFromNotes = async () => {
    if (!aiNoteText.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `A partir del siguiente texto de apuntes, genera 2 flashcards de estudio de alto impacto.
Formato de respuesta requerido estrictamente:
CARD 1:
Front: [Pregunta clara y concreta]
Back: [Respuesta didáctica concisa]
Category: [Categoría]
---
CARD 2:
Front: [Pregunta clara y concreta]
Back: [Respuesta didáctica concisa]
Category: [Categoría]

Texto:
${aiNoteText}`,
            }
          ],
          role: 'tutor',
          model: 'gemini-3.8-flash',
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con Gemini');
      const data = await response.json();
      const content = data.content || '';

      // Simple parser for the AI response
      const parts = content.split('---');
      const generatedCards: Flashcard[] = [];

      for (const part of parts) {
        const frontMatch = part.match(/Front:\s*([^\n]+)/i);
        const backMatch = part.match(/Back:\s*([^\n]+)/i);
        const catMatch = part.match(/Category:\s*([^\n]+)/i);

        if (frontMatch && backMatch) {
          generatedCards.push({
            id: `ai-fc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            front: frontMatch[1].trim(),
            back: backMatch[1].trim(),
            category: catMatch ? catMatch[1].trim() : 'IA Generada',
            sm2: {
              repetitions: 0,
              interval: 1,
              easeFactor: 2.5,
              nextReviewDate: 'Hoy',
            }
          });
        }
      }

      if (generatedCards.length > 0) {
        setDeck([...generatedCards, ...deck]);
        setAiNoteText('');
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error('Error generando fichas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCurrentCard = () => {
    if (deck.length <= 1) return;
    const newDeck = deck.filter((_, idx) => idx !== currentIndex);
    setDeck(newDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Mobile Bar / Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">StudyPulse Active App</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                Web & Móvil
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5" /> Racha: {streakDays} días
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> {deck.length} fichas en mazo
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {isOnline ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" /> En línea
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" /> Modo Offline
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPremium ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Premium VIP</span>
            </div>
          ) : (
            <button
              onClick={() => setShowCheckout(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Desbloquear Premium</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Crear Ficha</span>
          </button>
          <button
            onClick={onOpenInstallModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Descargar en Móvil</span>
          </button>
        </div>
      </div>

      {/* Age Profile Selector for All Ages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <span>Modo de Estudio por Edad:</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setAgeProfile('junior')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              ageProfile === 'junior'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>Junior (10-16 años)</span>
          </button>
          <button
            onClick={() => setAgeProfile('academic')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              ageProfile === 'academic'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Académico / Oposiciones</span>
          </button>
          <button
            onClick={() => setAgeProfile('adult')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              ageProfile === 'adult'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Adultos / Pausado</span>
          </button>
        </div>
      </div>

      {/* Sub-view Switcher: Flashcards vs Retention Analytics */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl gap-1">
        <button
          onClick={() => setSubTab('study')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            subTab === 'study'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Repaso Activo de Flashcards</span>
        </button>
        <button
          onClick={() => setSubTab('analytics')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            subTab === 'analytics'
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Panel de Retención & Intervalos SM-2</span>
        </button>
      </div>

      {/* View 1: Retention Analytics with Recharts */}
      {subTab === 'analytics' && <RetentionAnalyticsPanel deck={deck} />}

      {/* View 2: Study Player & AI Generator */}
      {subTab === 'study' && (
        <>
          {/* Main Flashcard Interactive Player */}
          <div className="space-y-4">
        {/* Navigation & Progress Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-300">
            Ficha {currentIndex + 1} de {deck.length} • <span className="text-indigo-400">{currentCard?.category}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              Próximo repaso: <strong className="text-slate-300">{currentCard?.sm2.nextReviewDate}</strong> (Intervalo: {currentCard?.sm2.interval}d)
            </span>
            <button
              onClick={handleDeleteCurrentCard}
              className="p-1 text-slate-600 hover:text-red-400 transition-colors ml-2"
              title="Eliminar esta ficha"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>

        {/* The Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-10 cursor-pointer transition-all duration-300 select-none flex flex-col justify-between shadow-2xl border ${
            isFlipped 
              ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border-indigo-500/50 shadow-indigo-500/10'
              : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Card Top Pill */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {isFlipped ? 'Respuesta (Reverso)' : 'Pregunta (Anverso)'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(isFlipped ? currentCard?.back : currentCard?.front);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs border border-slate-700"
                title="Escuchar texto en voz alta"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Escuchar</span>
              </button>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                Toca para voltear
              </span>
            </div>
          </div>

          {/* Card Center Content */}
          <div className="py-6 text-center my-auto">
            <div className={`font-semibold leading-relaxed transition-all ${
              isFlipped 
                ? (ageProfile === 'adult' ? 'text-base sm:text-lg' : 'text-sm sm:text-base') + ' text-slate-200' 
                : (ageProfile === 'adult' ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl') + ' text-white font-bold'
            }`}>
              {isFlipped ? currentCard?.back : currentCard?.front}
            </div>
          </div>

          {/* Card Bottom Meta */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            <span>Factor de Facilidad (EF): {currentCard?.sm2.easeFactor.toFixed(2)}</span>
            <span>Repeticiones: {currentCard?.sm2.repetitions}</span>
          </div>
        </div>

        {/* SM-2 Rating Controls (Revealed after flip) */}
        {isFlipped ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fade-in">
            <div className="text-xs font-bold text-center text-slate-300">
              {ageProfile === 'junior' 
                ? '¿Qué tal te ha salido esta tarjeta?' 
                : ageProfile === 'adult' 
                  ? 'Indica tu nivel de recuerdo para programar la próxima fecha:' 
                  : '¿Qué tan bien recordaste este concepto? (Algoritmo SM-2):'}
            </div>

            {/* Junior Mode: 3 Big Friendly Buttons */}
            {ageProfile === 'junior' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleGrade(1); }}
                  className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-200 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <span>❌ Necesito repasarla</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleGrade(3); }}
                  className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 text-amber-200 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <span>🤔 Me costó un poco</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleGrade(5); }}
                  className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 text-emerald-200 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <span>🌟 ¡Me la sé genial!</span>
                </button>
              </div>
            )}

            {/* Adult Mode: 3 Clear Unhurried Buttons */}
            {ageProfile === 'adult' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleGrade(2); }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-400 text-slate-300 font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-sm text-amber-300">Volver a repasar</span>
                  <span className="text-[10px] text-slate-400">Repaso a corto plazo</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleGrade(4); }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-300 font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-sm text-cyan-300">Recordada bien</span>
                  <span className="text-[10px] text-slate-400">Progreso normal</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleGrade(5); }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-400 text-emerald-300 font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <span className="font-bold text-sm text-emerald-300">Asimilada al 100%</span>
                  <span className="text-[10px] text-slate-400">Espaciar al máximo</span>
                </button>
              </div>
            )}

            {/* Academic Mode: Full 6 SM-2 Buttons */}
            {ageProfile === 'academic' && (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { q: 0, label: '0: Olvido Total', desc: 'Reiniciar a 1d', color: 'hover:border-red-500 text-red-300' },
                  { q: 1, label: '1: Incorrecto', desc: 'Falló memoria', color: 'hover:border-red-400 text-red-200' },
                  { q: 2, label: '2: Mucha Duda', desc: 'Casi fallido', color: 'hover:border-amber-400 text-amber-200' },
                  { q: 3, label: '3: Correcto/Difícil', desc: 'Retención básica', color: 'hover:border-emerald-400 text-emerald-200' },
                  { q: 4, label: '4: Correcto/Fluido', desc: 'Buen recuerdo', color: 'hover:border-emerald-300 text-emerald-100' },
                  { q: 5, label: '5: Instantáneo', desc: 'Dominado al 100%', color: 'hover:border-cyan-400 text-cyan-200 font-bold' },
                ].map((btn) => (
                  <button
                    key={btn.q}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGrade(btn.q);
                    }}
                    className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 transition-all text-center flex flex-col items-center justify-center gap-0.5 active:scale-95 ${btn.color}`}
                  >
                    <span className="text-xs font-bold">{btn.label}</span>
                    <span className="text-[10px] text-slate-500">{btn.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : deck.length - 1);
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <span className="text-xs text-slate-500">Voltea la ficha para registrar tu calificación</span>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(currentIndex < deck.length - 1 ? currentIndex + 1 : 0);
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* AI Quick Generator Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Generador Instantáneo de Fichas desde Apuntes (Gemini IA)
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono">
            gemini-3.8-flash
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Pega un fragmento de tus apuntes, libro o apuntes de clase y la IA generará automáticamente tarjetas de memoria listas para el algoritmo SM-2:
        </p>

        <div className="space-y-2">
          <textarea
            rows={3}
            value={aiNoteText}
            onChange={(e) => setAiNoteText(e.target.value)}
            placeholder="Ejemplo: 'La fotosíntesis oxigénica consta de dos fases: la fase luminosa (en las membranas tilacoidales) donde se produce ATP y NADPH liberando oxígeno, y la fase oscura o Ciclo de Calvin (en el estroma) donde se fija CO2 para formar glucosa.'"
            className="w-full bg-slate-950 text-white placeholder-slate-600 rounded-xl p-3 text-xs border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAIGenerateFromNotes}
              disabled={!aiNoteText.trim() || isGenerating}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generando Fichas con IA...' : 'Generar Fichas Automáticas'}</span>
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Nueva Ficha de Memoria
            </h3>

            <form onSubmit={handleAddNewCard} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Materia o Categoría:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="ej. Anatomía, Derecho Constitucional, etc."
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Pregunta / Anverso (Frontal):</label>
                <textarea
                  rows={2}
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="¿Cuál es el concepto clave que quieres memorizar?"
                  required
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Respuesta / Reverso:</label>
                <textarea
                  rows={3}
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="Respuesta concisa, fórmula o nemotecnia..."
                  required
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Monetization Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => {
          setIsPremium(true);
          setShowCheckout(false);
        }}
      />
    </div>
  );
};
