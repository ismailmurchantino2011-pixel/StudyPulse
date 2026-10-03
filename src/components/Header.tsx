import React from 'react';
import { ActiveTab, UserRoleView } from '../types';
import { 
  BookOpen, 
  ShieldCheck, 
  Coins, 
  Cpu, 
  SlidersHorizontal, 
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Bot,
  Smartphone,
  BrainCircuit,
  Rocket
} from 'lucide-react';
import { FULL_REPORT_MARKDOWN } from '../data/fullReportMarkdown';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  roleFilter: UserRoleView;
  setRoleFilter: (role: UserRoleView) => void;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  roleFilter,
  setRoleFilter,
  onOpenInstallModal,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FULL_REPORT_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([FULL_REPORT_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'StudyPulse_Documentacion_Tecnica_Completa.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: 'study' as ActiveTab, label: '🚀 App de Estudio', icon: BrainCircuit },
    { id: 'launch-kit' as ActiveTab, label: '💰 Publicar & Monetizar', icon: Rocket },
    { id: 'chatbot' as ActiveTab, label: 'Chatbot Gemini', icon: Bot },
    { id: 'modules' as ActiveTab, label: '1. Módulos Clave', icon: BookOpen },
    { id: 'compliance' as ActiveTab, label: '2. Regulación UE & RGPD', icon: ShieldCheck },
    { id: 'monetization' as ActiveTab, label: '3. Monetización & Negocio', icon: Coins },
    { id: 'architecture' as ActiveTab, label: '4. Arquitectura & SQL', icon: Cpu },
    { id: 'interactive' as ActiveTab, label: 'Simulador Interactivo', icon: SlidersHorizontal },
    { id: 'full-dossier' as ActiveTab, label: 'Dossier Completo (.md)', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                StudyPulse
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PWA Web & Móvil
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Estudio Inteligente • SM-2 Flashcards • RGPD & EU AI Act
            </p>
          </div>
        </div>

        {/* Perspective Filter & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Install PWA Button */}
          <button
            onClick={onOpenInstallModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-600/20 transition-all border border-emerald-400/30"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Instalar en Móvil</span>
          </button>

          {/* Role Filter Pills */}
          <div className="hidden lg:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <span className="px-2 py-1 text-slate-400 font-medium">Perspectiva:</span>
            {(['all', 'cto', 'ux', 'legal'] as UserRoleView[]).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                  roleFilter === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'all' ? 'General' : role === 'cto' ? 'CTO' : role === 'ux' ? 'UX/UI' : 'DPO/Legal'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="/studypulse-source-code.zip"
              download="studypulse-source-code.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20"
              title="Descargar el código completo en .ZIP para GitHub / Netlify"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Código .ZIP</span>
            </a>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors shadow-sm"
              title="Copiar informe completo en Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Copiado' : 'Copiar .md'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
              title="Descargar archivo Markdown del dossier"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Descargar Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
