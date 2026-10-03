import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  Coffee, 
  Gift, 
  BookOpen, 
  Heart, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Send,
  KeyRound
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'kofi' | 'affiliate'>('code');
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState('');

  if (!isOpen) return null;

  // Valid promo / peer licenses (can be shared via Bizum, school, or direct friend support)
  const VALID_CODES: Record<string, string> = {
    'STUDY2026': 'Acceso VIP Estudiante 2026',
    'VIP-SUPPORTER': 'Pase Mecenas / Patrocinador',
    'OPOSICION': 'Pase Especial Oposiciones & Selectividad',
    'BETA': 'Acceso Pionero Beta Gratuito',
    'LIBRE': 'Licencia Educativa de Prueba'
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputCode.trim().toUpperCase();
    
    if (VALID_CODES[cleanCode]) {
      setUnlockedTier(VALID_CODES[cleanCode]);
      setIsSuccess(true);
      localStorage.setItem('studypulse_premium', 'true');
      onSuccess();
    } else {
      setCodeError('Código no válido. Prueba con: STUDY2026, BETA o VIP-SUPPORTER');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-slate-800 text-center overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" />
            Monetización & Apoyo al Creador
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Desbloquea StudyPulse Sin Pasarelas Bancarias
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
            Apoya el proyecto a través de micro-donaciones (Ko-fi), canjea un código de acceso o compra por Bizum/afiliación.
          </p>
        </div>

        {/* Sub-tabs: Code vs Ko-fi vs Books Affiliate */}
        <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Canjear Código VIP</span>
          </button>
          <button
            onClick={() => setActiveTab('kofi')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'kofi'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Donar un Café (Ko-fi)</span>
          </button>
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'affiliate'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Libros & Afiliados</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">¡Pase Premium Activado!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                  Has desbloqueado todas las funciones: {unlockedTier}. Tus flashcards se sincronizarán con Firebase Firestore.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full max-w-xs mx-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all block"
              >
                Volver a la App de Estudio
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: Code Voucher */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>Venta directa de códigos (Bizum, en mano o promociones)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Este sistema te permite monetizar <strong>sin comisiones de Stripe ni dar datos bancarios</strong> a empresas: puedes cobrar a tus amigos o estudiantes por Bizum (ej. 3 € por un código) y darles su clave para desbloquear la app.
                    </p>
                  </div>

                  <form onSubmit={handleRedeemCode} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">
                        Introduce tu código de acceso o donación:
                      </label>
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => {
                          setInputCode(e.target.value);
                          setCodeError('');
                        }}
                        placeholder="Ejemplo: STUDY2026 o BETA"
                        className="w-full bg-slate-950 text-white uppercase tracking-wider font-mono rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                      {codeError && (
                        <p className="text-xs text-red-400 mt-1.5 font-medium">{codeError}</p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      <strong>Códigos de prueba activos:</strong> <code className="text-cyan-400">STUDY2026</code> • <code className="text-cyan-400">BETA</code> • <code className="text-cyan-400">VIP-SUPPORTER</code>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Canjear y Activar Premium</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: Ko-fi / Buy Me a Coffee */}
              {activeTab === 'kofi' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      <span>Micro-donaciones voluntarias en Ko-fi / PayPal.me</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      El 80% de los creadores independientes de software comienzan con <strong>Ko-fi</strong> o <strong>Buy Me a Coffee</strong>: no necesitas configurar una sociedad mercantil ni verificar cuentas de empresa. El dinero va directo a tu cuenta de PayPal personal.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Invitar a 1 café al creador:</span>
                      <span className="text-sm font-black text-amber-400">2,50 €</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Ayudas a pagar los costes de servidor y desarrollo de nuevas funciones para estudiantes.
                    </p>
                    <a
                      href="https://ko-fi.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>Donar 1 Café en Ko-fi (Abre pestaña)</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 3: Affiliate Books */}
              {activeTab === 'affiliate' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Monetización Pasiva mediante Enlaces de Afiliado</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Gana comisiones cada vez que un estudiante compre un libro recomendado a través de tu enlace de <strong>Amazon Afiliados</strong> o editoriales educativas. Es 100% pasivo y no gestionas cobros ni devoluciones.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'A Mind for Numbers (Barbara Oakley)',
                        desc: 'La biblia de las técnicas de estudio y repetición espaciada.',
                        tag: 'Recomendado',
                        url: 'https://amazon.es'
                      },
                      {
                        title: 'Hábitos Atómicos (James Clear)',
                        desc: 'Construcción de hábitos de estudio diario y disciplina académica.',
                        tag: 'Superventas',
                        url: 'https://amazon.es'
                      },
                      {
                        title: 'Pack Flashcards Físicas de Repaso 500 uds.',
                        desc: 'Tarjetas de memoria de alta densidad para repaso analógico.',
                        tag: 'Material Físico',
                        url: 'https://amazon.es'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">{item.tag}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0"
                        >
                          <span>Ver</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
