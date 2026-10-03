/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, UserRoleView } from './types';
import { Header } from './components/Header';
import { SectionModules } from './components/SectionModules';
import { SectionCompliance } from './components/SectionCompliance';
import { SectionMonetization } from './components/SectionMonetization';
import { SectionArchitecture } from './components/SectionArchitecture';
import { GeminiChatbot } from './components/GeminiChatbot';
import { InteractivePlayground } from './components/InteractivePlayground';
import { FullDossierView } from './components/FullDossierView';
import { ActiveStudyApp } from './components/ActiveStudyApp';
import { LaunchKitView } from './components/LaunchKitView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Scale, 
  HeartHandshake,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('study');
  const [roleFilter, setRoleFilter] = useState<UserRoleView>('all');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* PWA Mobile Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Role Perspective Notification Bar if filtered */}
      {roleFilter !== 'all' && (
        <div className="bg-indigo-950/70 border-b border-indigo-500/30 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-slate-300">
                Vista filtrada por rol: <strong className="text-indigo-300 uppercase">{roleFilter === 'cto' ? 'Chief Technology Officer (Arquitectura & Cloud)' : roleFilter === 'ux' ? 'Head of Product & UX/UI (Retención & Conversión)' : 'Legal Counsel & DPO (RGPD & EU AI Act)'}</strong>.
              </span>
            </div>
            <button
              onClick={() => setRoleFilter('all')}
              className="text-indigo-400 hover:text-indigo-200 underline font-medium"
            >
              Restablecer a vista general
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'study' && (
          <ActiveStudyApp onOpenInstallModal={() => setIsInstallModalOpen(true)} />
        )}
        {activeTab === 'launch-kit' && <LaunchKitView />}
        {activeTab === 'modules' && (
          <SectionModules
            roleFilter={roleFilter}
            onGoToInteractive={() => setActiveTab('interactive')}
          />
        )}
        {activeTab === 'compliance' && (
          <SectionCompliance
            roleFilter={roleFilter}
            onGoToInteractive={() => setActiveTab('interactive')}
          />
        )}
        {activeTab === 'monetization' && (
          <SectionMonetization roleFilter={roleFilter} />
        )}
        {activeTab === 'architecture' && (
          <SectionArchitecture roleFilter={roleFilter} />
        )}
        {activeTab === 'chatbot' && <GeminiChatbot />}
        {activeTab === 'interactive' && <InteractivePlayground />}
        {activeTab === 'full-dossier' && <FullDossierView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              SP
            </div>
            <div>
              <div className="text-white font-bold text-sm">StudyPulse EdTech Platform</div>
              <div className="text-[11px] text-slate-500">
                Diseñado para estudiantes de la UE • Cumplimiento RGPD & Reglamento de IA (UE) 2024/1689
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Soberanía en la UE (Frankfurt)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Cpu className="w-4 h-4" /> Gemini 3.8 Flash & Pro
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-4 h-4" /> Local-First Offline
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
