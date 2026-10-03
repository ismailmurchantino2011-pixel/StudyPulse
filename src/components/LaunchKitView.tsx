import React, { useState } from 'react';
import { 
  Rocket, 
  Store, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Copy, 
  Terminal, 
  ExternalLink, 
  Globe, 
  Sparkles,
  Download,
  DollarSign,
  Crown,
  FileCode2,
  FileText,
  Coffee,
  Database,
  Cloud,
  Gift,
  KeyRound,
  BookOpen
} from 'lucide-react';

export const LaunchKitView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const netlifyTomlContent = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  const bubblewrapCode = `# 1. Instalar la herramienta oficial de Google
npm install -g @bubblewrap/cli

# 2. Generar proyecto Android desde el manifest PWA
bubblewrap init --manifest=https://ais-pre-gstar5shwqtnhm7nq52s5y-746782309124.europe-west2.run.app/manifest.webmanifest

# 3. Compilar el archivo .aab listo para subir
bubblewrap build`;

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-fade-in">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5" />
            Kit de Despliegue con Netlify, Firebase y Monetización Sin Banco
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Publica en Netlify y Monetiza sin Trámites Bancarios
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Puedes lanzar y validar StudyPulse **sin riesgo financiero ni necesidad de dar datos de tarjetas o cuentas mercantiles a Stripe**. Alojamiento gratuito con <strong>Netlify</strong>, base de datos en tiempo real con <strong>Firebase Firestore</strong> y monetización con <strong>Ko-fi, Bizum, códigos de licencia y afiliados</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="/studypulse-source-code.zip"
              download="studypulse-source-code.zip"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Todo el Código Fuente (.ZIP)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="space-y-8">

        {/* STEP 1: Despliegue 100% Gratuito en Netlify */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-cyan-400" />
                Despliegue Gratuito en Netlify (Sin Tarjeta de Crédito)
              </h2>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
              netlify.toml Listo
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Hemos configurado el archivo <code className="text-cyan-300">netlify.toml</code> en la raíz del proyecto para que Netlify compile automáticamente con SPA routing:
          </p>

          <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4">
            <li>
              Crea una cuenta gratuita en <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">netlify.com</a> con tu cuenta de GitHub o correo.
            </li>
            <li>
              Pulsa en <strong>"Add new site" &gt; "Import an existing project"</strong> y selecciona tu repositorio.
            </li>
            <li>
              Netlify detectará automáticamente el archivo <code className="text-slate-200 font-mono">netlify.toml</code>:
              <ul className="list-disc pl-5 mt-1 text-slate-300 space-y-0.5">
                <li>Build command: <span className="font-mono text-cyan-300">npm run build</span></li>
                <li>Publish directory: <span className="font-mono text-cyan-300">dist</span></li>
              </ul>
            </li>
            <li>
              Pulsa en <strong>"Deploy Site"</strong> y en 1 minuto tendrás tu dominio gratis tipo <code className="text-slate-200">studypulse.netlify.app</code> con SSL gratis.
            </li>
          </ol>

          <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <button
              onClick={() => handleCopy('netlify', netlifyTomlContent)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'netlify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'netlify' ? 'Copiado' : 'Copiar netlify.toml'}</span>
            </button>
            <pre className="pr-20 whitespace-pre">{netlifyTomlContent}</pre>
          </div>
        </div>

        {/* STEP 2: Base de Datos Firebase Firestore Conectada */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Firebase Firestore Aprovisionado y Activo
              </h2>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              CONECTADO
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tu base de datos Firebase Firestore está aprovisionada con el proyecto <strong>serious-bank-qvr20</strong> y sus reglas de seguridad Zero-Trust:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Colección Usuarios:</span>
              <strong className="text-white font-mono">/users/{'{userId}'}</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Colección Flashcards SM-2:</span>
              <strong className="text-white font-mono">.../flashcards/{'{cardId}'}</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Códigos de Acceso VIP:</span>
              <strong className="text-white font-mono">/accessCodes/{'{codeId}'}</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            El archivo de configuración <code className="text-slate-200">firebase-applet-config.json</code> y el cliente <code className="text-slate-200">src/lib/firebase.ts</code> ya están inicializados en la aplicación.
          </p>
        </div>

        {/* STEP 3: Monetización Sin Datos Bancarios (Zero-Bank) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-400" />
                Monetización Ágil Sin Datos Bancarios al Principio
              </h2>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
              Cero Trámites / Cero Stripe
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Para no arriesgarte con trámites fiscales, cuotas de autónomos ni comisiones bancarias antes de saber si tu web funciona, puedes usar estos <strong>4 métodos directos</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Model 1: Ko-fi / Buy Me a Coffee */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-amber-300 flex items-center gap-1.5">
                <Coffee className="w-4 h-4" />
                1. Micro-donaciones en Ko-fi / PayPal.me
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Crea una página en <strong>ko-fi.com/tu_nombre</strong> o pon tu enlace de <strong>paypal.me/tu_usuario</strong>. No necesitas cuenta bancaria comercial ni declarar empresa para empezar. Los estudiantes satisfechos pueden donarte 2 € o 5 € voluntariamente.
              </p>
            </div>

            {/* Model 2: Licencias por Bizum entre particulares */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-indigo-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                2. Venta Directa de Códigos de Acceso
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Ofrece la app a tus compañeros de clase, academia u oposiciones. Te envían un Bizum directo de 3 € o 5 € y tú les envías un código como <code className="text-cyan-300">STUDY2026</code> o <code className="text-cyan-300">OPOSICION</code> que desbloquea el modo VIP instantáneamente en la app.
              </p>
            </div>

            {/* Model 3: Enlaces de Afiliados de Libros */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                3. Recomendación de Libros (Amazon Afiliados)
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Recomienda libros de técnicas de memoria (ej. <em>"Hábitos Atómicos"</em> o temarios oficiales). Cada vez que alguien compra con tu enlace, Amazon te ingresa comisión sin que tú tengas que gestionar envíos ni devoluciones.
              </p>
            </div>

            {/* Model 4: Patrocinador de Academia Local */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                4. Patrocinador de la Semana
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Contacta con una academia de tu ciudad o un preparador de oposiciones para poner un banner sutil en la app a cambio de una tarifa fija mensual acordada entre vosotros.
              </p>
            </div>
          </div>
        </div>

        {/* STEP 4: Publicar en Google Play Store */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-violet-400" />
                Empaquetar para Google Play Store con Bubblewrap
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Sin Android Studio
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Puedes compilar el archivo <code className="text-cyan-300 font-mono">.aab</code> estándar de Google Play usando la CLI oficial:
          </p>

          <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <button
              onClick={() => handleCopy('bubblewrap', bubblewrapCode)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'bubblewrap' ? 'Copiado' : 'Copiar Comandos'}</span>
            </button>
            <pre className="pr-20 whitespace-pre">{bubblewrapCode}</pre>
          </div>
        </div>

      </div>
    </div>
  );
};
