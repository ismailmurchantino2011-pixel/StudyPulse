import React, { useState } from 'react';
import { FULL_REPORT_MARKDOWN } from '../data/fullReportMarkdown';
import { Copy, Check, Download, FileText, Printer } from 'lucide-react';

export const FullDossierView: React.FC = () => {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Dossier Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Documento Técnico Oficial Completo (Formato Markdown)
            </h2>
            <p className="text-xs text-slate-400">
              Listo para comité de dirección, auditorías legales de la UE y equipos de desarrollo móvil/backend.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado al Portapapeles' : 'Copiar Texto Completo'}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            Descargar Archivo .md
          </button>
        </div>
      </div>

      {/* Reader Container */}
      <div className="p-6 sm:p-10 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-x-auto text-slate-300 leading-relaxed font-sans">
        <div className="max-w-4xl mx-auto space-y-6">
          <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
            {FULL_REPORT_MARKDOWN}
          </pre>
        </div>
      </div>
    </div>
  );
};
