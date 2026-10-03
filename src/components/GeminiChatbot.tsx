import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatbotRole } from '../types';
import { 
  Bot, 
  Send, 
  User, 
  RotateCcw, 
  Sparkles, 
  GraduationCap, 
  ClipboardCheck, 
  Scale, 
  Cpu, 
  Copy, 
  Check, 
  AlertCircle,
  Zap,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface Props {
  initialRole?: ChatbotRole;
}

export const GeminiChatbot: React.FC<Props> = ({ initialRole = 'tutor' }) => {
  const [role, setRole] = useState<ChatbotRole>(initialRole);
  const [model, setModel] = useState<string>('gemini-3.8-flash');
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial introductory message based on role
  const getInitialMessage = (selectedRole: ChatbotRole): ChatMessage => {
    switch (selectedRole) {
      case 'examiner':
        return {
          id: 'init-examiner',
          role: 'assistant',
          content: '¡Bienvenido a la sesión de evaluación rigurosa! Soy tu **Examinador Técnico**. Dime qué materia o tema deseas evaluar (ej. *farmacología, algoritmos SM-2, neurobiología o derecho administrativo*) y generaré preguntas de examen de alta exigencia.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: model,
        };
      case 'legal':
        return {
          id: 'init-legal',
          role: 'assistant',
          content: 'Hola. Como **Asesor Legal y DPO de StudyPulse**, estoy especializado en el **RGPD (UE 2016/679)**, el **EU AI Act (UE 2024/1689)** y la protección de datos de estudiantes y menores. ¿Qué aspecto de gobernanza o soberanía de datos deseas consultar?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: model,
        };
      case 'cto':
        return {
          id: 'init-cto',
          role: 'assistant',
          content: 'Saludos, soy el **CTO y Arquitecto de Software de StudyPulse**. Puedo explicarte la arquitectura Local-First (React Native + SQLite/WatermelonDB), el esquema de PostgreSQL con búsqueda semántica en pgvector, o la orquestación del SDK `@google/genai`. ¿Por dónde empezamos?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: model,
        };
      case 'tutor':
      default:
        return {
          id: 'init-tutor',
          role: 'assistant',
          content: '¡Hola! Soy tu **Tutor Socrático Inteligente**. Mi propósito es ayudarte a asimilar conceptos complejos guiándote paso a paso y transformando tus dudas en fichas mnemotécnicas de repetición espaciada. ¿Qué concepto de tu temario quieres explorar hoy?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: model,
        };
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage(initialRole)]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleRoleChange = (newRole: ChatbotRole) => {
    setRole(newRole);
    setMessages([getInitialMessage(newRole)]);
    setErrorMsg(null);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([getInitialMessage(role)]);
    setErrorMsg(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    setInput('');
    setErrorMsg(null);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Send conversation history to server endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          role,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      setErrorMsg(err.message || 'No se pudo obtener respuesta del modelo. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const roleMeta = {
    tutor: {
      name: 'Tutor Socrático',
      subtitle: 'Método inductivo & Active Recall',
      icon: GraduationCap,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      activeTabColor: 'bg-indigo-600 text-white',
      prompts: [
        'Explícame cómo funciona la memoria de trabajo y cómo aplicar Active Recall.',
        '¿Cómo estructurar un resumen de biología para convertirlo en flashcards?',
        '¿Qué es la poda sináptica y por qué es clave en el aprendizaje?',
      ],
    },
    examiner: {
      name: 'Examinador Académico',
      subtitle: 'Simulación de examen & rigor técnico',
      icon: ClipboardCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      activeTabColor: 'bg-emerald-600 text-white',
      prompts: [
        'Hazme un examen tipo test de 3 preguntas difíciles sobre farmacología cardiovascular.',
        'Evalúa mi comprensión del algoritmo de repetición espaciada SM-2.',
        'Plantéame un caso práctico sobre transmisión sináptica.',
      ],
    },
    legal: {
      name: 'Asesor RGPD & AI Act',
      subtitle: 'Regulación europea & Soberanía de datos',
      icon: Scale,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      activeTabColor: 'bg-cyan-600 text-white',
      prompts: [
        '¿Por qué StudyPulse clasifica como Riesgo Limitado según el EU AI Act (2024/1689)?',
        '¿Cómo se garantiza técnicamente el Derecho al Olvido del Art. 17 RGPD?',
        '¿Qué restricciones impone el Art. 8 RGPD a los estudiantes menores de edad?',
      ],
    },
    cto: {
      name: 'CTO & Arquitecto',
      subtitle: 'Ingeniería de software & Base de datos',
      icon: Cpu,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      activeTabColor: 'bg-amber-600 text-white',
      prompts: [
        '¿Por qué elegiste React Native con WatermelonDB en lugar de Flutter?',
        '¿Cómo funciona el índice HNSW en PostgreSQL con la extensión pgvector?',
        '¿Cómo se estructura el pipeline de llamada a Gemini con responseSchema?',
      ],
    },
  };

  const currentRoleConfig = roleMeta[role];

  return (
    <div className="space-y-6">
      {/* Top Banner / Chatbot Intro */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Chatbot Multiturno con Gemini API
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Asistente Inteligente de StudyPulse
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Interactúa con roles pedagógicos, técnicos y regulatorios especializados. Mantiene historial de conversación multiturno con orquestación oficial de Google Gemini.
            </p>
          </div>

          {/* Model Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium px-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Modelo Gemini:
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (General / Recomendado)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Rápido)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Razonamiento Complejo)</option>
            </select>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-800">
          {(Object.keys(roleMeta) as ChatbotRole[]).map((r) => {
            const config = roleMeta[r];
            const Icon = config.icon;
            const isSelected = role === r;
            return (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? `${config.bgColor} ${config.borderColor} shadow-md`
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-950 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {config.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {config.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Chat Thread Header */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${currentRoleConfig.bgColor} border ${currentRoleConfig.borderColor} flex items-center justify-center text-white`}>
              <currentRoleConfig.icon className={`w-4 h-4 ${currentRoleConfig.color}`} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{currentRoleConfig.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {model}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>En línea con Google GenAI SDK • Instrucción de sistema activa</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
            title="Reiniciar conversación y vaciar historial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Conversación</span>
          </button>
        </div>

        {/* Scrollable Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                      : `${currentRoleConfig.bgColor} border ${currentRoleConfig.borderColor} text-white`
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className={`w-4 h-4 ${currentRoleConfig.color}`} />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 border border-slate-800/90 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  {/* Content with basic markdown rendering support */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {m.content}
                  </div>

                  {/* Bubble Footer */}
                  <div
                    className={`mt-2 pt-1.5 flex items-center justify-between gap-3 text-[10px] border-t ${
                      isUser ? 'border-indigo-500/40 text-indigo-200' : 'border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span>{m.timestamp}</span>

                    <div className="flex items-center gap-2">
                      {!isUser && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Art. 50 EU AI Act
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
                        title="Copiar texto"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-3xl">
              <div className={`w-8 h-8 rounded-xl ${currentRoleConfig.bgColor} border ${currentRoleConfig.borderColor} flex items-center justify-center shrink-0`}>
                <Bot className={`w-4 h-4 ${currentRoleConfig.color} animate-pulse`} />
              </div>
              <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-400 font-mono text-[11px]">
                  {currentRoleConfig.name} está razonando con {model}...
                </span>
              </div>
            </div>
          )}

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <strong>Error en la consulta:</strong> {errorMsg}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-500 shrink-0 font-medium">Sugerencias:</span>
          {currentRoleConfig.prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap text-[11px] transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Escribe a tu ${currentRoleConfig.name}... (ej. "Ponme un ejemplo", "¿Cómo lo aplico?")`}
            disabled={loading}
            className="flex-1 bg-slate-900 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
