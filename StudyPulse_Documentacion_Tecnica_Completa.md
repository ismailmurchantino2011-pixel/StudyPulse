# DOCUMENTO DE ESPECIFICACIONES TÉCNICAS Y DE NEGOCIO: STUDYPULSE
**Plataforma Inteligente de Aprendizaje Acelerado & Cumplimiento Normativo Europeo**

---
* **Fecha de Emisión:** Octubre 2026
* **Versión del Documento:** v1.0.0-PROD
* **Comité de Redacción:**
  - **Chief Technology Officer (CTO):** Arquitectura Cloud, Bases de Datos, Modelos de IA e Infraestructura Local-First.
  - **Head of Product & UX/UI:** Experiencia de Usuario, Patrones de Conversión, Accesibilidad y Retención Didáctica.
  - **Legal Counsel & Data Protection Officer (DPO):** Especialista en RGPD, Directiva ePrivacy, Reglamento Europeo de Inteligencia Artificial (EU AI Act) y Protección Jurídica del Menor.
* **Jurisdicción:** Unión Europea (Directiva UE 2016/679, Reglamento (UE) 2024/1689).

---

## 1. VISIÓN DEL PRODUCTO Y MÓDULOS CLAVE

StudyPulse nace para resolver la sobrecarga cognitiva del estudiante moderno, transformando material disperso y heterogéneo en rutas de aprendizaje estructuradas, memorables y evaluables en tiempo récord, salvaguardando la integridad académica y la soberanía de los datos.

### 1.1 Ingesta Multimodal y Generación Automatizada (Resúmenes, Flashcards y Tests)
El núcleo de ingesta procesa cuatro vectores de entrada:
1. **Documentos PDF y Epub:** Extracción estructurada de texto conservando jerarquía de títulos, tablas y referencias bibliográficas mediante un preprocesador OCR/PDF.
2. **Imágenes y Fotografías de Pizarra/Apuntes Físicos:** Pipeline de visión computacional que detecta texto manuscrito, esquemas conceptuales y diagramas.
3. **Grabaciones de Audio y Clases Universitarias (MP3, M4A, WAV):** Transcripción fonética adaptada a terminología técnica con segmentación por orador y marcas de tiempo.
4. **Notas de Voz Rápidas:** Captura en caliente de reflexiones del estudiante durante desplazamientos.

#### Motores de Generación Sintética:
* **Resúmenes Ejecutivos y Mapas Mentales:** Síntesis en cascada (Extractive -> Abstractive). Genera resúmenes por capas (Visión general en 3 puntos, resumen temático en prosa y glosario de términos clave).
* **Fichas de Memoria (Flashcards):** Descomposición atómica de conceptos aplicando el principio de información mínima (1 concepto por ficha, frontal con interrogante activo o cloze deletion, reverso con respuesta concisa y mnemotecnia sugerida).
* **Tests de Opción Múltiple (MCQs):** Generación de preguntas con 4 distractores plausibles fundamentados en sesgos cognitivos frecuentes de examen, indicación de dificultad y justificación didáctica con cita literal obligatoria.

---

### 1.2 Sistema de Repetición Espaciada (Spaced Repetition) con Algoritmo SM-2 Optimizado
Para mitigar la Curva del Olvido de Ebbinghaus, StudyPulse implementa una variante optimizada del algoritmo SuperMemo 2 (SM-2):

$$	ext{EF}' = 	ext{EF} + left(0.1 - (5 - q) 	imes (0.08 + (5 - q) 	imes 0.02)ight)$$

*Donde:*
* $q in [0, 5]$ es la evaluación cualitativa efectuada por el usuario tras consultar el reverso (0: Fallo absoluto, 3: Respuesta correcta con dificultad, 5: Evocación perfecta e instantánea).
* $	ext{EF}$ (Ease Factor) representa la facilidad intrínseca del ítem, inicializado en $2.50$ con un piso estricto $	ext{EF} ge 1.30$.
* Si $q < 3$: Se computa como lapso/olvido. El contador de repeticiones se reinicia a $0$ y el intervalo vuelve a $1	ext{ día}$.
* Si $q ge 3$:
  - Para $n = 1$: Intervalo $I(1) = 1	ext{ día}$.
  - Para $n = 2$: Intervalo $I(2) = 6	ext{ días}$.
  - Para $n > 2$: Intervalo $I(n) = I(n-1) 	imes 	ext{EF}'$.

**Optimizaciones Propietarias de StudyPulse:**
- **Fuzzing Anti-Agrupamiento:** Variación aleatoria del $pm 5%$ en los intervalos para evitar que cientos de fichas venzan el mismo día lectivo.
- **Modo Pánico / Cramming:** Módulo independiente que permite repasos intensivos previos a exámenes sin alterar el historial estocástico a largo plazo del SM-2.

---

### 1.3 Planificador de Estudio Inteligente (Smart Calendar & Pomodoro Adaptativo)
* **Calendario Adaptativo con Reasignación Dinámica:** Conexión bidireccional con Google Calendar y Apple Calendar (vía iCal y APIs autorizadas). Cuando el estudiante suspende una sesión o rinde por debajo del umbral objetivo, el motor reequilibra la carga cognitiva de la semana sin saturar los descansos programados.
* **Temporizador Pomodoro Contextual:** Modos $25/5$ min (foco estándar) y $50/10$ min (foco profundo / bloques STEM). Integra sincronización con las flashcards vencidas: el alumno puede alternar entre estudio de apuntes y micro-repasos de 5 minutos al concluir cada ciclo.
* **Analítica de Hábitos y Carga Cognitiva:** Registro de picos de atención (Morning Larks vs Night Owls), índice de distracciones y predicción de fatiga mental.

---

### 1.4 Modo Offline Completo (Arquitectura Local-First)
El sistema garantiza operatividad al 100% en bibliotecas sin cobertura, aviones o zonas rurales:
* **Persistencia Local:** Base de datos relacional local embebida (SQLite / WatermelonDB) que almacena la totalidad del mazo de fichas, el historial de repasos y los resúmenes en caché.
* **Sincronización Bidireccional Delta:** Al recuperar la conectividad, se ejecutan operaciones de sincronización en segundo plano resolviendo conflictos mediante marcas de tiempo vectoriales (CRDTs o Last-Write-Wins basado en microsegundos del servidor).
* **Búsqueda Vectorial Local Híbrida:** En dispositivos móviles de gama media/alta, se almacena un índice cuantizado ligero para consultas semánticas locales inmediatas sin requerir llamadas de red.

---

### 1.5 Asistente Tutor por IA en Tiempo Real con Grounding RAG
* **Chat Socrático:** En lugar de proporcionar respuestas directas para que el estudiante copie, el tutor formula preguntas guía que estimulan el razonamiento deductivo.
* **Anclaje Estricto a la Fuente (RAG Grounding):** Cada respuesta incluye tarjetas flotantes de cita bibliográfica con número de página y párrafo exacto del PDF original. Si el concepto no está en los apuntes del usuario, el tutor lo explicita explícitamente para cumplir con las directrices de transparencia académica.

---

## 2. CUMPLIMIENTO NORMATIVO EUROPEO (EU COMPLIANCE & FILTERS)

StudyPulse adopta el principio de *Privacy by Design and by Default* (Art. 25 RGPD) y *Responsible AI* conforme al nuevo marco regulatorio europeo.

### 2.1 Cumplimiento RGPD (Reglamento General de Protección de Datos)
1. **Soberanía y Residencia de los Datos:** Todos los servidores de persistencia primaria, procesamiento vectorizado y clústeres de inferencia están alojados en regiones de la Unión Europea (Frankfurt `eu-central-1` y Bélgica `europe-west1`), garantizando la inmunidad frente a la Cloud Act de terceros países.
2. **Derechos ARCO-POL en 1 Clic:**
   - **Botón de Portabilidad Universal (Art. 20):** Descarga instantánea de un archivo `.zip` cifrado que contiene la totalidad de fichas, resúmenes, estadísticas de estudio y metadatos en formatos estructurados estándar (`JSON`, `CSV` y `Markdown`).
   - **Derecho al Olvido Automatizado (Art. 17):** Botón irreversible de "Borrar mi cuenta y datos". Ejecuta una purga en cascada en la base de datos PostgreSQL, vacía los embeddings asociados en el índice vectorial y destruye las claves criptográficas de cifrado de archivos en el bucket de almacenamiento (Crypto-Shredding).
3. **Consentimiento Granular de Cookies y Telemetría:**
   - Banner de consentimiento conforme a las directrices del Comité Europeo de Protección de Datos (EDPB).
   - Opciones independientes para: [1] Almacenamiento esencial de sesión, [2] Analítica funcional agregada (sin IDs publicitarios) y [3] Telemetría de mejora de modelos de IA (opción desactivada por defecto - Opt-in explícito).
   - Prohibición expresa de Dark Patterns: El botón "Rechazar todo" tiene idéntico peso visual, jerarquía y accesibilidad que "Aceptar todo".
4. **Pseudonimización de Identidad:**
   - Los datos de usuario que viajan a los pipelines de IA son despojados de nombres, correos electrónicos y teléfonos mediante tokens UUID efímeros.

---

### 2.2 Cumplimiento del Reglamento Europeo de Inteligencia Artificial (EU AI Act - Reg. 2024/1689)
1. **Evaluación de Clasificación de Riesgo:**
   - Conforme al **Artículo 6 y Anexo III, Apartado 3** del AI Act, los sistemas de IA destinados a evaluar a los estudiantes o determinar su admisión/calificación en centros educativos pueden ser considerados de **Alto Riesgo**.
   - **Posicionamiento Legal de StudyPulse:** StudyPulse está categorizado expresamente como una **herramienta de asistencia al estudio individual y autoaprendizaje extracurricular**, NO un sistema de evaluación formal vinculado a notas académicas o selección institucional.
   - En consecuencia, opera bajo el régimen de **Riesgo Limitado / Específico con Obligaciones de Transparencia (Art. 50 y Art. 52)**, evitando la burocracia desproporcionada de alto riesgo al tiempo que aplica salvaguardas equivalentes voluntarias de nivel superior.
2. **Transparencia Activa y Etiquetado Obligatorio (Art. 50):**
   - Cada flashcard, test, resumen o respuesta del tutor contiene un distintivo visual inequívoco: *"Generado por IA StudyPulse"*, con acceso al modelo utilizado, fecha de inferencia e índice de confianza probabilística.
   - Metadatos digitales compatibles con el estándar C2PA en la exportación de documentos.
3. **Mecanismos Anti-Alucinaciones y Sesgos Académicos:**
   - Enfoque RAG determinista con `temperature = 0.2`.
   - **Filtro de Salida Pedagógico:** Si el modelo genera una respuesta con un índice de confianza semántica inferior al 85% respecto a los fragmentos del documento, el sistema bloquea la afirmación y avisa: *"Verificación requerida en tu texto original"*.
   - Botón de Flagging de Error Temático para que el alumno reporte discrepancias conceptuales.

---

### 2.3 Protección Específica de Menores de Edad
1. **Umbral de Consentimiento Digital (RGPD Art. 8):**
   - La plataforma aplica el límite territorial de consentimiento digital (14 años en España, 16 años en Alemania, etc.).
   - Durante el onboarding se solicita el año de nacimiento mediante un selector neutral sin fricción. Si el usuario es menor del umbral nacional:
     - Se bloquea la activación de cuenta hasta recibir confirmación por doble factor del tutor legal o representante parental.
2. **Blindaje de Comportamiento:**
   - Prohibición absoluta de publicidad segmentada, creación de perfiles comerciales predictivos o monetización de datos para menores.
   - Modo "Estudio Protegido" por defecto: Filtro de seguridad de contenidos reforzado en el Tutor IA, bloqueando material no apto para la edad biológica.

---

## 3. ESTRATEGIA DE MONETIZACIÓN ORGÁNICA Y ESCALABLE

El modelo de negocio combina la fricción reducida de adquisición del modelo Freemium con una economía de valor tangible que maximiza el Lifetime Value (LTV) mientras mantiene un Cost of Customer Acquisition (CAC) óptimo.

### 3.1 Estructura de Niveles de Servicio

| Característica | Plan Gratuito (Freemium) | Plan Premium (Suscripción) | Micropagos (StudyPacks) |
| :--- | :--- | :--- | :--- |
| **Precio** | **0 € / mes** | **9,99 € / mes** o **69,99 € / año** | **2,99 €** (100 cr) / **6,99 €** (300 cr) |
| **Ingesta de Documentos** | 3 PDFs al mes (hasta 20 págs/doc) | **Ilimitado** (hasta 500 págs/doc) | Por créditos (1 crédito = 5 págs) |
| **Audio y Notas de Voz** | 10 min de transcripción total | **Ilimitado** con detección de orador | Packs de tiempo (10 cr = 30 min) |
| **Flashcards & SM-2** | Hasta 150 fichas activas | **Fichas Ilimitadas** + Modo Cramming | Incremento puntual de capacidad |
| **Temporizador Pomodoro** | Funcionalidad completa | Funcionalidad completa + Analítica | Incluido |
| **Tutor IA en Tiempo Real** | 15 consultas/mes (Gemini Flash) | **Consultas Ilimitadas** (Gemini Pro) | 1 crédito por consulta al tutor |
| **Sincronización Dispositivos**| 1 dispositivo móvil | **Dispositivos Ilimitados** | No aplica |
| **Modo Offline** | Consulta de repasos del día | **Copia local íntegra + Vector cache** | No aplica |

---

### 3.2 Arquitectura del Paywall y Conversión Orgánica (No Agresivo)
* **Value-First Triggers (Gatillos de Valor Demostrado):** El paywall nunca se muestra en el primer inicio de sesión. Aparece únicamente cuando el alumno ha experimentado un momento "Aha!":
  - Al completar su primera sesión de estudio exitosa de 50 fichas.
  - Al intentar subir su 4º documento del mes con un mensaje transparente: *"Has maximizado tu cuota mensual gratuita. Pasa a Premium para desbloquear tu temario completo"*.
* **Garantía Anti-Sorpresas:** Recordatorio automático por notificación push y correo electrónico 48 horas antes de finalizar el periodo de prueba gratuito de 7 días.
* **Precios Estudiantiles Accesibles:** Descuento del 40% permanente mediante validación con correo institucional (`.edu`, `.es`, SheerID).

---

## 4. ARQUITECTURA TÉCNICA RECOMENDADA

### 4.1 Selección del Stack Frontend: React Native con Expo vs Flutter
Tras un minucioso análisis de trade-offs de ingeniería:

* **Evaluación de Flutter:** Sobresaliente en rendimiento gráfico de animaciones de interfaz (Skia / Impeller). No obstante, introduce mayor sobrecarga al interactuar con librerías nativas de audio en streaming continuo y ecosistemas Web PWA convergentes.
* **Veredicto de Arquitectura: REACT NATIVE CON EXPO + TYPESCRIPT**
  - **Motivos de la Elección:**
    1. **Paridad de Código Web/Móvil (92% de código compartido):** La misma base de código TypeScript alimenta la app de iOS, Android y el dashboard web de escritorio para navegadores mediante Expo Router.
    2. **Ecosistema Local-First de Primer Nivel:** Soporte nativo para **WatermelonDB** sobre motor SQLite C++, ofreciendo tiempos de renderizado de menos de 16ms en listas de miles de fichas con reactividad RxJS.
    3. **Time-to-Market y Madurez de Librerías:** Fácil integración de pasarelas de pago de la App Store / Google Play mediante RevenueCat SDK.

---

### 4.2 Arquitectura Backend y Persistencia
* **Capa de API:** Node.js con NestJS / Fastify (tipado estricto con TypeScript, arquitectura hexagonal modular).
* **Base de Datos Principal:** PostgreSQL 16 alojado en infraestructura europea (Supabase Managed o Cloud SQL Frankfurt).
* **Motor Semántico Vectorial:** Extensión nativa `pgvector` con índices HNSW (Hierarchical Navigable Small World) para búsquedas de similitud en tiempo inferior a 15ms sobre dimensiones de embeddings de 768 float32.
* **Gestión de Sesiones e Identidad:** Supabase Auth / Firebase Auth con tokens JWT validados en API Gateway.

---

### 4.3 Estrategia de Modelos de Inteligencia Artificial (Google Gemini)
Para optimizar la curva de costes por usuario y la latencia interactiva, StudyPulse adopta una arquitectura de modelos escalonada:

1. **Modelo de Alta Velocidad (Gemini 3.8 Flash):**
   - Utilizado para: Generación en lote de Flashcards, preguntas de examen, transcripciones cortas y chat interactivo del tutor socrático.
   - Coste: Mínimo impacto por token, latencia de primer token < 400ms.
2. **Modelo de Razonamiento Profundo (Gemini 3.1 Pro Preview):**
   - Utilizado para: Deducción de temarios científicos densos, síntesis de tratados de derecho o medicina, y resolución de problemas matemáticos paso a paso.
3. **Modelo de Embeddings (gemini-embedding-2-preview):**
   - Vectorización de fragmentos de texto (`chunks` de 500 tokens con `overlap` de 50 tokens) para la base de datos RAG.

---

## 5. CONCLUSIÓN Y HOJA DE RUTA DE LANZAMIENTO

StudyPulse se posiciona en la cúspide de la innovación EdTech europea: combina el rigor de la ciencia cognitiva (SM-2, Pomodoro, Active Recall) con la vanguardia de la IA multimodal de Google, cimentada sobre un bastión infranqueable de cumplimiento normativo y respeto al estudiante. Esta arquitectura garantiza viabilidad técnica, escalabilidad horizontal a millones de usuarios y rentabilidad financiera sostenible desde el día 1.
