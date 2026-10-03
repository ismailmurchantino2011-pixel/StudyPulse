import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  Download, 
  X, 
  Check, 
  Copy, 
  Share, 
  PlusSquare, 
  Globe, 
  Sparkles, 
  WifiOff, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { canInstall, isInstalled, isIOS, isAndroid, promptInstall } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [appUrl, setAppUrl] = useState<string>('');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Determine the publicly accessible URL
    const url = window.location.href;
    setAppUrl(url);

    // Generate high-contrast QR code
    QRCode.toDataURL(url, {
      width: 240,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => setQrDataUrl(dataUrl))
      .catch((err) => console.error('Error generating QR Code:', err));
  }, []);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (success) {
      setInstallSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Descargar & Acceder a StudyPulse en tu Móvil
              </h3>
              <p className="text-xs text-slate-400">
                Instalación como Progressive Web App (PWA) nativa y acceso web en la nube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          
          {/* Status Banner if already installed */}
          {isInstalled && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <strong>¡StudyPulse ya está instalado!</strong> Estás ejecutando la aplicación en modo nativo independiente (Standalone).
              </div>
            </div>
          )}

          {/* Quick 1-Click Install if prompt available */}
          {canInstall && !isInstalled && (
            <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-cyan-950/60 border border-cyan-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Instalación Directa Detectada
                </div>
                <p className="text-xs text-slate-300">
                  Tu navegador permite instalar StudyPulse en tu pantalla de inicio en un solo toque sin pasar por tiendas de aplicaciones.
                </p>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
              >
                <Download className="w-4 h-4" />
                Instalar App Ahora
              </button>
            </div>
          )}

          {installSuccess && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ¡Instalación aceptada! Busca el icono de StudyPulse en tu pantalla de inicio.
            </div>
          )}

          {/* QR Code and Web Link Section */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center text-center space-y-2.5">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-700">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Escanear para abrir en el móvil" className="w-40 h-40 object-contain" />
                ) : (
                  <div className="w-40 h-40 bg-slate-200 animate-pulse rounded-lg" />
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                📱 Apunta la cámara de tu móvil para abrir StudyPulse
              </span>
            </div>

            {/* URL Info & Direct Copy */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-indigo-400" />
                Enlace Directo de la App:
              </span>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                {appUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                </button>
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Abrir en pestaña nueva"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Este enlace funciona 24/7 en cualquier navegador web moderno (Chrome, Safari, Firefox, Edge) tanto en ordenador como en smartphones.
              </p>
            </div>
          </div>

          {/* Step-by-Step Mobile Instructions */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Cómo Descargar e Instalar en tu Móvil (Paso a Paso):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* iPhone / iOS Guide */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center gap-2 text-indigo-300">
                  <Smartphone className="w-4 h-4" />
                  iPhone & iPad (Safari)
                </div>
                <ol className="space-y-2.5 text-xs text-slate-400 list-decimal pl-4">
                  <li>
                    Abre el enlace en el navegador <strong className="text-white">Safari</strong>.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>Pulsa el botón <strong className="text-white">Compartir</strong></span>
                    <Share className="w-3.5 h-3.5 text-cyan-400 inline shrink-0 mt-0.5" />
                    <span>en la barra inferior.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>Desliza y selecciona <strong className="text-white">«Añadir a la pantalla de inicio»</strong></span>
                    <PlusSquare className="w-3.5 h-3.5 text-indigo-400 inline shrink-0 mt-0.5" />.
                  </li>
                  <li>
                    Pulsa <strong className="text-emerald-400">Añadir</strong>. ¡Listo! Se abrirá a pantalla completa sin barras.
                  </li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center gap-2 text-cyan-300">
                  <Smartphone className="w-4 h-4" />
                  Android (Chrome / Samsung Internet)
                </div>
                <ol className="space-y-2.5 text-xs text-slate-400 list-decimal pl-4">
                  <li>
                    Abre el enlace en <strong className="text-white">Google Chrome</strong>.
                  </li>
                  <li>
                    Pulsa el icono de los <strong className="text-white">tres puntos (⋮)</strong> en la esquina superior derecha.
                  </li>
                  <li>
                    Selecciona <strong className="text-white">«Instalar aplicación»</strong> o <strong className="text-white">«Añadir a la pantalla principal»</strong>.
                  </li>
                  <li>
                    Confirma y el icono de StudyPulse se creará en tu menú de aplicaciones nativas.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Ventajas de tener la App instalada en tu móvil:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Modo Offline:</strong> Repasa flashcards y notas sin gastar datos ni depender de WiFi.</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Pantalla Completa:</strong> Experiencia idéntica a una app de la App Store o Google Play.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Privacidad Europea:</strong> Tus datos permanecen bajo control y cifrados en la UE.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
