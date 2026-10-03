# 🚀 StudyPulse - Plataforma Inteligente de Estudio & Flashcards SM-2

Plataforma EdTech de alto rendimiento diseñada conforme a los estándares de la Unión Europea (RGPD y Reglamento de IA - EU AI Act). Incluye generador de tarjetas con IA Gemini, algoritmo de repetición espaciada SM-2, perfiles de estudio por edad (Junior, Académico, Adultos), sincronización en la nube con Firebase Firestore y despliegue automático en Netlify.

---

## 🌟 Características Principales

* 🧠 **Algoritmo de Repetición Espaciada SM-2:** Cálculo automatizado de factores de facilidad ($EF$), intervalos de repaso en días y analítica visual de retención.
* 🎒 **Modos Adaptativos por Edad:**
  - **Junior (10-16 años):** Interfaz amigable con 3 botones claros y refuerzo positivo.
  - **Académico / Oposiciones (17+ años):** 6 niveles SM-2, métricas y curvas de olvido.
  - **Adultos / Pausado:** Tipografía grande, alto contraste y lectura cómoda.
* 🔊 **Lectura en Voz Alta (Text-to-Speech):** Síntesis de voz accesible en cada flashcard para repasar sin fatiga visual.
* ☁️ **Sincronización en la Nube:** Base de datos en tiempo real con **Firebase Firestore** y reglas de seguridad Zero-Trust.
* 🌐 **Despliegue Gratuito en Netlify:** Archivo `netlify.toml` preconfigurado con soporte para Single Page Application (SPA).
* 💰 **Monetización Sin Trámites Bancarios:**
  - Venta directa de códigos de licencia VIP (Bizum o pagos entre particulares).
  - Micro-donaciones directas con Ko-fi o PayPal.me.
  - Enlaces de afiliación a libros y material de estudio.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend / Dev Server:** Node.js, Express, Vite, tsx.
- **IA:** Google Gemini API (`@google/genai`).
- **Base de Datos & Auth:** Firebase Firestore (`firebase` SDK v11).
- **Hosting:** Netlify (Frontend) / Cloud Run.

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/studypulse.git
cd studypulse
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`):
```env
GEMINI_API_KEY=tu_clave_de_gemini_aqui
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 5. Compilar para producción
```bash
npm run build
```

---

## 🌐 Cómo Desplegar Gratis en Netlify

1. Sube tu código a un repositorio en **GitHub**.
2. Entra en [netlify.com](https://www.netlify.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add new site" > "Import an existing project"**.
4. Selecciona tu repositorio de `studypulse`.
5. Netlify leerá automáticamente el archivo `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Haz clic en **"Deploy Site"**. ¡Tu web estará online en 1 minuto con certificado SSL gratuito!

---

## 🔒 Cumplimiento Normativo Europeo (UE)

- **RGPD (Reglamento UE 2016/679):** Almacenamiento local-first con opción de borrado completo y exportación en 1 clic.
- **EU AI Act (Reglamento UE 2024/1689):** Transparencia explícita sobre contenido generado por IA y prevención de sesgos.
- **Protección de Menores (Art. 8 RGPD):** Sin rastreo de comportamiento ni perfiles publicitarios en menores.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
