# CONSILIUM_RULES — El "Por Qué" y el "Para Qué" de las Decisiones Clave

> **Complemento estratégico de `CONSILIUM.md`**
> Mientras `CONSILIUM.md` describe **QUÉ** existe, este documento explica **POR QUÉ** existe y **PARA QUÉ** sirve. Es la capa de **razón subyacente** (design rationale) de los puntos 10, 11, 12 y 16 — las cuatro secciones que definen la estrategia agentica y de despliegue del proyecto.
>
> Lo que no aparece en el documento maestro: la **intencionalidad** detrás de cada elección, las **consecuencias** si se ignorara, y el **criterio ejecutivo** que convierte decisiones técnicas en decisiones de negocio.
>
> **Fecha:** 8 de septiembre de 2026

---

## Tabla de Contenidos

- [Cómo Leer Este Documento](#cómo-leer-este-documento)
- [10. Configuración Agentica — AGENTS.md y Skills n8n](#10-configuración-agentica--agentsmd-y-skills-n8n)
- [11. Configuración MCP y n8n](#11-configuración-mcp-y-n8n)
- [12. Patrones de Diseño de Workflows n8n](#12-patrones-de-diseño-de-workflows-n8n)
- [16. Arquitectura de Despliegue n8n Self-Hosted](#16-arquitectura-de-despliegue-n8n-self-hosted)
- [Síntesis Ejecutiva](#síntesis-ejecutiva)

---

## Cómo Leer Este Documento

Cada punto y subíndice se explica con el mismo patrón de razonamiento CTO:

- **¿POR QUÉ?** — La *causa raíz*: qué problema concreto del mundo real motivó esta decisión. Esto le da justificación a la elección y permite defenderla frente a un stakeholder.
- **¿PARA QUÉ?** — El *resultado buscado*: qué beneficio observable y medible se obtiene. Esto define el objetivo y permite verificar si la decisión cumplió.
- **Qué pasaría si se omite (El Costo de Ignorarlo)** — La contraparte de riesgo: la factura que se paga por no hacerlo. El CTO piensa en términos de *evitar el dolor*, no solo de *ganar beneficio*.
- **Criterio / Principio rector** — La regla de alto nivel que resume la filosofía.

---

## 10. Configuración Agentica — AGENTS.md y Skills n8n

> **Propósito macro:** Convertir un repositorio con workflows n8n en un entorno donde un **agente de IA pueda construir y operar n8n de forma fiable y repetible**, con calidad de ingeniero senior, sin supervisión constante. El "cerebro" del proyecto no es el código — es la **instrucción** que guía al agente.

### ¿POR QUÉ existe esta sección?

Los agentes de IA son **poderosamente capaces pero peligrosamente impredecibles**: sin reglas explícitas, producen workflows que *parecen* correctos pero fallan en producción por omisiones sutiles (defaults incorrectos, referencias mal sintetizadas, flujos sin manejo de errores). **La superficie de error de n8n es enorme** — cada nodo tiene decenas de campos, y n8n cambia entre versiones. La configuración agentica es el **mecanismo de garantía de calidad distribuida**: en vez de un revisor humano, se embebe la experiencia del mejor ingeniero n8n dentro del contexto que el agente lee antes de actuar.

### ¿PARA QUÉ sirve?

1. **Estandarizar la calidad:** todo lo que produzca el agente pasa por los mismos principios y procesos, alcanzando un piso mínimo de corrección.
2. **Reducir la dependencia de "suerte":** sin esto, obtener un buen workflow es cuestión de azar de contexto; con esto es un proceso repetible.
3. **Hacer transferible el conocimiento:** la experiencia acumulada (15 skills) no vive en la cabeza de una persona, sino en archivos versionables que cualquier agente u persona lee.
4. **Acortar el tiempo a valor:** al indicar exactamente qué herramienta usar y qué validar, se eliminan ciclos de prueba-error.

**El Costo de Ignorarlo:** Workflows que fallan silenciosamente en producción, agentes que repiten los mismos errores una y otra vez, y un conocimiento que se pierde cuando el ingeniero original se va.

---

### 10.1 AGENTS.md — Instrucciones para Agentes de IA

#### ¿POR QUÉ?

El archivo `AGENTS.md` en la raíz es el **punto de entrada obligatorio** que cualquier agente de IA lee al trabajar en este repositorio. Es el "contrato de comportamiento" que se presenta antes de tocar cualquier código. Si el agente no tiene un marco de trabajo, improvisará — y la improvisación en herramientas con efectos secundarios (creación de workflows reales) es costosa.

#### ¿PARA QUÉ?

- Define el **rol** ("experto en n8n automation usando n8n-MCP tools") para que el agente actúe con la postura correcta, no como un generalista.
- Establece **5 principios centrales** que funcionan como invariantes de comportamiento:
  1. **Ejecución Silenciosa** — evita ruido y fricción; el agente trabaja y luego reporta.
  2. **Ejecución en Paralelo** — maximiza velocidad al explotar operaciones independientes.
  3. **Plantillas Primero** — nunca reinventar; reutilizar lo que n8n ya valida.
  4. **Validación Multi-nivel** — de lo mínimo a lo completo, subiendo en escalera de confianza.
  5. **Nunca Confiar en Defaults** — la causa #1 de fallos en runtime es asumir valores por defecto.
- Fija un **proceso de 7 pasos** (docs → templates → nodos → config → validación → construcción → validación final) que es esencialmente un *control de calidad embebido en el flujo de trabajo*.

**El Costo de Ignorarlo:** un agente que construye sin guion, produciendo resultados inconsistentes y —peor— *confiados* aunque incorrectos.

#### Criterio rector

> **"El proceso ES el producto."** La calidad de un workflow construido por IA es directamente proporcional a la calidad del proceso que lo produce.

---

### 10.2 Sistema de Skills (15 skills)

#### ¿POR QUÉ?

Una AGENTS.md con reglas genéricas no basta: el detalle de n8n es **demasiado profundo y dinámico** para caber en un solo archivo. Se necesita **conocimiento especializado por dominio**, cargable a demanda (no todo a la vez, para no saturar el contexto del agente). Cada skill es un "experto enfocado" que se invoca solo cuando hace falta.

#### ¿PARA QUÉ?

- **Modularidad de conocimiento:** cada skill cubre un dominio (arquitectura, config, código, datos, errores, infra) y se carga solo cuando el agente lo necesita.
- **Carga de contexto eficiente:** el agente no lee 600KB de guías; lee *solo* la skill relevante. Esto mejora la calidad de las respuestas y reduce el costo.
- **Redundancia intencional de reglas:** la tabla de red-flags (10.4) hace que el agente "se pille" pensando en usar una skill, incluso antes de actuar.
- **Escalabilidad:** agregar un nuevo dominio (p. ej. `n8n-voice`) = agregar una carpeta con su `SKILL.md`, no reescribir el sistema.
- **Jerarquía clara:** el router `using-n8n-mcp-skills` actúa como *directorio de enrutamiento* para que el agente siempre aterrice en el skill correcto.

**El Costo de Ignorarlo:** conocimiento monolítico e inabordable, o peor, conocimiento inexistente cuando el agente se enfrenta a un caso especializado (binarios, Python, agentes AI) y comete errores evitables.

#### Criterio rector

> **"Construir el sistema para que el conocimiento viva en archivos, no en mentes."** El conocimiento que no está versionado no existe como activo organizacional.

---

### 10.3 Reglas No Negociables (del router skill)

#### ¿POR QUÉ?

Algunas prácticas son tan críticas para la integridad del sistema que **no se pueden dejar a criterio** — deben ser reglas duras (hard constraints). La experiencia demuestra que ciertos errores (no validar antes de activar, exponer secretos) son catastróficos y difíciles de revertir.

#### ¿PARA QUÉ?

1. **Invoca el skill relevante antes de cualquier acción n8n** — garantiza que el agente nunca opera "a ciegas" sin el contexto especializado.
2. **Valida Y verifica antes de activar** — el agente debe ejecutar `validate_workflow` *antes* e inspeccionar `connections` *después*. La validación de estructura no basta; hay que comprobar el cableado real.
3. **Los secretos nunca van en campos de texto** — usa el sistema de credentials n8n. Esto evita la exposición de credenciales, el riesgo #1 de seguridad en procesos de automatización.

**El Costo de Ignorarlo:** activar workflows no validados (fallos en producción) y fugas de credenciales (catástrofe de seguridad reputacional y legal).

#### Criterio rector

> **"Hay reglas que se discuten y reglas que se obedecen. Las no negociables son las del segundo tipo."**

---

### 10.4 Tabla de Red Flags (auto-detección de errores)

#### ¿POR QUÉ?

La mayoría de los errores del agente son **patrones de pensamiento predecibles**: el agente "cree" que una tarea es simple o que un atajo es válido, y se equivoca sistemáticamente de la misma forma. En lugar de corregir errores *post-hoc*, la tabla de red-flags **intercepta el pensamiento erróneo antes de la acción**.

#### ¿PARA QUÉ?

- Actúa como **sistema de arranque automático de skills**: el momento exacto en que el agente piensa "esto es fácil" es el gatillo para recordarle que consulte el skill de patrones.
- Convierte **intuiciones peligrosas en checklist** — por ejemplo, "usaré un Code node, es más fácil" dispara `n8n-code-javascript` (que puede revelar que JS es la opción preferida sobre Python, o que un nodo nativo era mejor).
- **Unifica la detección de riesgo:** el mismo disparador funciona para cualquier agente, garantizando consistencia entre sesiones.

**El Costo de Ignorarlo:** el agente comete los mismos 15 errores recurrentes en distintos workflows, sin que nada lo detenga, porque el único mecanismo de defensa era la "memoria" — que no persiste entre sesiones.

#### Criterio rector

> **"Atrapa el error en el pensamiento, no en la ejecución."** La mejor corrección es la prevención.

---

### 10.5 Herramientas MCP Documentadas

#### ¿POR QUÉ?

El agente dispone de ~30 herramientas n8n-MCP de diversa categoría, pero **el valor no está en tenerlas, sino en saber cuándo y cómo usarlas**. Sin documentación, el agente elige la herramienta equivocada, usa el formato incorrecto para `nodeType`, o duplica trabajo. La trampa más común (formato corto vs. largo de nodeType) es una fuente frecuente de fallos.

#### ¿PARA QUÉ?

- **Ciclo de vida completo cubierto:** herramientas para descubrir (search/get/validate), construir (create/update), validar (validate_workflow), inspeccionar (get/list), probar (test/executions) y operar (datatables, folders, credentials, auditoría).
- **Evita la trampa de formato de nodeType** (short-form `nodes-base.set` en get/validate vs. long-form `n8n-nodes-base.set` en JSON de workflow) — un error que rompería la validación.
- **Permite auditoría y ciclo de vida:** desde la creación hasta la retirada de workflows, todo es manejable programáticamente.

**El Costo de Ignorarlo:** elegir herramientas incorrectas, errores de formato silenciosos, e incapacidad de gestionar el ciclo de vida completo de los workflows.

#### Criterio rector

> **"La herramienta correcta, el formato correcto, el momento correcto."** La documentación de herramientas es la diferencia entre "tener acceso" y "tener competencia".

---

## 11. Configuración MCP y n8n

> **Propósito macro:** Conectar el "cerebro agéntico" (el agente de IA con sus skills) al "músculo" (la instancia n8n real). El MCP es el **canal de comunicación** que permite al agente crear, editar, validar y operar workflows en una instancia n8n viva. Sin esta capa, los skills serían solo teoría sin aplicación.

### ¿POR QUÉ existe esta sección?

Los skills (punto 10) describen *cómo* construir bien; el MCP (punto 11) es el *conducto* que lo permite ejecutar contra una instancia real. Son **inseparables**: el conocimiento sin canal es inerte; el canal sin conocimiento es peligroso. Esta sección materializa el puente agente↔n8n.

### ¿PARA QUÉ sirve?

- Hacer operativo el flujo de trabajo agentico: descubrir, configurar, validar y desplegar workflows.
- Permitir la **prueba real** (no solo teoría) mediante `n8n_test_workflow` y ejecuciones.
- Establecer el **ciclo de sanity check** del proyecto: si el MCP responde, el agente puede trabajar.

---

### 11.1 mcp_config.json

#### ¿POR QUÉ?

Todo cliente MCP necesita un **manifiesto de configuración** que declare qué servidor lanzar y con qué entorno. Sin él, el agente no sabe *dónde* está n8n ni *cómo* conectarse.

#### ¿PARA QUÉ?

- Define el servidor **`n8n-mcp`** en modo **stdio** (comunicación por entrada/salida estándar — ideal para integración local y segura sin red expuesta).
- Configura las variables de entorno: `N8N_API_URL` y `N8N_BASE_URL` apuntando a `http://localhost:5678` (la instancia local de n8n).
- Maneja el **ciclo de logging** (`LOG_LEVEL=error`, `DISABLE_CONSOLE_OUTPUT=true`) para no contaminar el canal stdio con ruido — algo crítico en MCP, donde la salida del proceso es el propio protocolo.

**El Costo de Ignorarlo:** el agente no logra conectarse a n8n; todo el pipeline agentico queda inoperativo.

#### Criterio rector

> **"La configuración es el contrato de arranque."** Una mala config hace que el sistema ni siquiera encienda, sin importar cuán buenos sean los skills.

---

### 11.2 .env.example

#### ¿POR QUÉ?

Las configuraciones críticas (URLs de la API, claves) no deben hardcodearse ni commitearse. El archivo `.env.example` establece el **esquema canónico** de variables de entorno que el entorno necesita — una plantilla que documenta *qué* configurar sin exponer *valores reales*.

#### ¿PARA QUÉ?

- Sirve de **fuente de verdad para la configuración de entorno** (SOP para reproducir config en cualquier máquina).
- Separa lo **sensible** (`N8N_API_KEY`) de lo **estructural** (URLs), lo que permite que el archivo sea versionable sin comprometer secretos.
- Facilita **onboarding**: una persona nueva copia `.env.example` → `.env`, completa la API key, y el entorno funciona.

**El Costo de Ignorarlo:** claves commitadas (fuga de secretos) o configuración no documentada (imposible de reproducir).

#### Criterio rector

> **"Ejemplo sí, secreto jamás."** La plantilla se comparte; el valor, no.

---

### 11.3 Scripts de Arranque MCP

#### ¿POR QUÉ?

La configuración MCP puede existir, pero alguien tiene que **lanzar el proceso**. Como el proyecto corre en entornos heterogéneos (Windows y Linux/macOS), se necesitan scripts específicos por plataforma. La tarea es no trivial: cargar variables, parsear JSON de config y spawn del proceso con el entorno correcto.

#### ¿PARA QUÉ?

- **`start_mcp.sh` (POSIX):** carga `.env`/`.env.example`, verifica que `mcp_config.json` exista, y lanza el servidor. Facilita el arranque en entornos Unix.
- **`start_mcp.ps1` (PowerShell):** equivalente para Windows, con `Set-StrictMode` para detección temprana de errores.
- En conjunto, garantizan **reproducibilidad multiplataforma**: el mismo pipeline agentico corre igual en la laptop de un dev que en un CI.

**El Costo de Ignorarlo:** el arranque manual es propenso a errores y no reproducible; cada entorno tiene que "reinventar" cómo lanzar MCP.

#### Criterio rector

> **"El arranque debe ser un comando, no un ritual manual."** Todo lo que se repite debe estar automatizado y documentado.

---

### 11.4 import_workflows.js

#### ¿POR QUÉ?

Los ejemplos de workflows viven como archivos JSON en el repo, pero n8n solo ejecuta workflows *importados* a su instancia. El script automatiza la **ingesta de esos JSON a la instancia n8n** vía su API.

#### ¿PARA QUÉ?

- **Idempotente y reproducible:** se puede volver a ejecutar para desplegar los ejemplos en una instancia nueva n8n sin pasos manuales.
- Usa headers de autenticación correctos (`X-N8N-API-KEY`, `Authorization: Bearer`) cuando hay clave.
- Maneja tanto http como https y reporta éxito/fallo por archivo — útil para depuración.
- Establece el patrón de cómo **el proyecto se "siembra" a sí mismo** con contenido inicial.

**El Costo de Ignorarlo:** los ejemplos quedan muertos en el repo, sin valor operativo; cada despliegue requiere importación manual tediosa.

#### Criterio rector

> **"El código en el repo debe ser desplegable, no estático."** Un JSON que no se puede importar es deuda, no activo.

---

### 11.5 Ejemplos de Workflows (tool_workflow y tool_caller)

#### ¿POR QUÉ?

Antes de construir workflows complejos, se necesita un **banco de pruebas mínimo** que demuestre un patrón arquitectónico crítico: el **sub-workflow como herramienta (toolWorkflow)** que el skill n8n-agents define como "the canonical n8n way — default when in doubt". Estos dos ejemplos son el *hello-world* de ese patrón.

#### ¿PARA QUÉ?

- **`tool_workflow_example.json` (echo_tool):** demuestra el lado "servidor" — un sub-workflow con `Execute Workflow Trigger` que define sus entradas (`workflowInputs.values`) y devuelve un resultado (echo). Es la pieza reutilizable que un agente AI puede invocar.
- **`tool_caller_example.json` (call_echo_tool):** demuestra el lado "cliente" — un workflow que prepara datos y los envía al tool vía `Execute Workflow`. Es la prueba de que el ciclo completo funciona.
- **Juntos forman el patrón de referencia** para probar MCP/agentes e ilustrar cómo exponer lógica reutilizable como herramientas invocables — la base para construir una librería de "módulos" n8n.

**El Costo de Ignorarlo:** no tener un punto de partida validado para el patrón de herramientas; cada workflow de agente se construye desde cero sin referencia canónica.

#### Criterio rector

> **"Antes de escalar, demuestra el patrón en pequeño."** Un ejemplo mínimo validado vale más que mil workflows hipotéticos.

---

## 12. Patrones de Diseño de Workflows n8n

> **Propósito macro:** Codificar las **soluciones arquitectónicas probadas** para los problemas recurrentes de n8n. Los patrones son la "librería mental" del ingeniero: en vez de resolver cada caso desde cero, se reutilizan estructuras que ya han sido validadas en producción. Para un CTO es la diferencia entre un equipo que *inventa* y un equipo que *construye con repertorio*.

### ¿POR QUÉ existe esta sección?

Casi todos los workflows n8n del mundo encajan en un número reducido de **arquitecturas de referencia**. Documentarlas elimina la duplicación de razonamiento, garantiza que las soluciones sean sólidas, y da un vocabulario común al equipo ("usemos el patrón webhook", "esto es un anti-patrón"). Además, los patrones **previenen errores arquitectónicos de alto costo** que son difíciles de corregir una vez que el workflow crece.

### ¿PARA QUÉ sirve?

1. **Reutilización y velocidad:** elegir un patrón conocido acorta el diseño y reduce el riesgo.
2. **Calidad consistente:** todos los workflows siguen estructuras sanas, no improvisaciones.
3. **Comunicación:** los patrones dan lenguaje común entre ingenieros y con el agente de IA.
4. **Fallibilidad controlada:** cada patrón viene con sus reglas y trampas documentadas.

---

### 12.1 Los 6 Patrones Core

#### ¿POR QUÉ?

La mayor parte de la tarea en n8n cae en **seis familias de problemas**: recibir datos (webhook), consumir APIs, operar bases de datos, asistir con IA, ejecutar por cron y procesar en lote. Cada uno tiene una cadena de nodos canónica que ya resolvió los casos de borde.

#### ¿PARA QUÉ?

- **Webhook Processing (35%):** el más común. Webhook → Validate → Transform → Respond/Notify. Garantiza que cada entrada se valida antes de actuar — evita procesar datos malformados.
- **HTTP API Integration:** Trigger → HTTP Request → Transform → Action → Error Handler. Cubre la integración con servicios externos con manejo de errores explícito.
- **Database Operations:** Schedule → Query → Transform → Write → Verify. El paso "Verify" asegura que la escritura realmente ocurrió.
- **AI Agent Workflow:** Trigger → AI Agent (Model + Tools + Memory) → Output. La arquitectura para los esquemas conversacionales.
- **Scheduled Tasks:** Schedule → Fetch → Process → Deliver → Log. El "deliver" y el "log" garantizan trazabilidad.
- **Batch Processing:** Prepare → SplitInBatches → Process → Accumulate → Aggregate. Para volúmenes grandes sin saturar memoria.

**El Costo de Ignorarlos:** cada workflow reinventa la rueda, con distinta calidad — algunos sin validación, otros sin logging, otros sin manejo de errores.

#### Criterio rector

> **"El patrón correcto elimina el 80% de las decisiones por adelantado.** " La estructura deja de ser una pregunta y se convierte en una plantilla.

---

### 12.2 Patrones de Flujo de Datos

#### ¿POR QUÉ?

Una vez elegida la arquitectura macro (12.1), queda la **topología de control**: cómo se conectan y ramifican los nodos. Los cinco patrones de flujo (Lineal, Branching, Paralelo, Loop, Error Handler) son las "unidades de composición" con las que se construye cualquier workflow.

#### ¿PARA QUÉ?

- **Lineal:** flujo simple y predecible de transformación.
- **Branching:** decisiones condicionales (IF) con salidas True/False.
- **Paralelo:** procesos independientes que convergen en un Merge.
- **Loop:** procesamiento iterativo con SplitInBatches.
- **Error Handler:** la ruta de fallo separada del camino principal (Success vs. Error Trigger) — esencial para no dejar errores silenciosos.

**El Costo de Ignorarlos:** flujos spaghetti donde no se distingue el camino feliz del camino de error, haciendo el workflow inmantenible y opaco.

#### Criterio rector

> **"Un workflow debe poder leerse como un diagrama, no como un laberinto."** La topología debe hacer evidente el flujo.

---

### 12.3 Patrón Batch/SplitInBatches

#### ¿POR QUÉ?

Procesar un gran volumen de ítems en un solo paso **agota la memoria y bloquea** el workflow. `SplitInBatches` trocea el volumen en lotes procesables. Pero este nodo tiene **reglas no intuitivas** que, si se ignoran, producen bugs sutiles.

#### ¿PARA QUÉ?

- **Regla: SIEMPRE `Limit 1` tras main[0] (done).** La salida "done" solo dispara *una* vez; sin `Limit 1`, el flujo de agregación puede ejecutarse múltiples veces (cada vez que un batch termina). Esta es una de las trampas más comunes.
- **`batchSize` como "cost lever":** más grande = menos iteraciones (rápido pero pesado en memoria); más pequeño = más iteraciones (lento pero ligero). Es la palanca de balance costo/rendimiento.
- **Accumulación entre lotes:** `$('Node Inside Loop').all()` solo devuelve el *último* batch — si se necesita acumular todos los resultados, hay que usar `$getWorkflowStaticData('global')`. Esto evita perder datos entre lotes.

**El Costo de Ignorarlo:** o procesamiento repetido (bug por el `Limit 1`), o pérdida silenciosa de datos (por el mal uso de `.all()`).

#### Criterio rector

> **"En bucles, la regla gana al instinto.** " Los nodos de loop n8n premian el conocimiento explícito de sus salidas.

---

### 12.4 Gating de vida (validate → verify → test → activate)

#### ¿POR QUÉ?

Activar un workflow **sin verificación** es la forma más rápida de introducir fallos en producción. n8n separa construir, de validar, de probar y de activar; el gating de vida es la **secuencia obligatoria** que impide saltarse los controles.

#### ¿PARA QUÉ?

1. **Validate** — `validate_workflow` / `n8n_validate_workflow`: comprobar estructura y campos antes de nada.
2. **Verify connections** — `n8n_get_workflow` y leer `connections`: confirmar que el *cableado real* (no solo el esquema) es correcto.
3. **Test** — `n8n_test_workflow` + `n8n_executions`: ejecutar nodos reales. (Con aviso: produce efectos secundarios reales.)
4. **Activate** — solo tras los tres primeros pasos.

**El Costo de Ignorarlo:** activar workflows no probados que fallan en el primer evento real, sin red de seguridad.

#### Criterio rector

> **"El activado es el último paso, nunca el primero."** La confianza se gana por transición gradual, no por salto.

---

### 12.5 Anti-patrones de Alto Impacto

#### ¿POR QUÉ?

Tan importante como saber qué hacer es saber **qué evitar**. Estos seis anti-patrones son los errores que más dinero y tiempo cuestan en n8n, y se han documentado para que el agente (y el equipo) los detecte y los evite automáticamente.

#### ¿PARA QUÉ?

1. **Nodo Set alimentando 0-1 consumidores** — casi siempre es innecesario; mejor inline la expresión directamente.
2. **Iteración per-item automática** — NO añadir "Loop Over Items" si el default ya itera; duplicaría el trabajo.
3. **Code Each-Item vs All-Items** — la iteración por ítem es ~25-30× más costosa; agrupar en All-Items.
4. **Cadenas largas de transformación** — consolidar en un solo All-Items Code node para rendimiento.
5. **Append en Google Sheets con columnas de fórmula** — rompe las fórmulas existentes (integridad de datos).
6. **Comparación unidireccional de umbrales** — siempre `Math.abs(diff)` para detectar tanto sobre como sub-valores.

**El Costo de Ignorarlos:** workflows lentos, costosos e incorrectos — un anti-patrón de rendimiento puede multiplicar el costo de ejecución por 30.

#### Criterio rector

> **"Documentar lo que se debe evitar es tan valioso como documentar lo que se debe hacer."** El anti-patrón documentado es un error que no se repetirá.

---

### 12.6 Estadísticas de Uso Documentadas

#### ¿POR QUÉ?

Las estadísticas (porcentajes de triggers, transformaciones, outputs y complejidad) no son trivia — son **datos empíricos de distribución de uso** que orientan dónde invertir esfuerzo y qué dominar primero.

#### ¿PARA QUÉ?

- **Priorización de aprendizaje:** saber que Webhook es el trigger más común (35%) indica por dónde empezar a dominar.
- **Optimización de reutilización:** las transformaciones más usadas (Set 68%, Code 42%) son los candidatos naturales para crear plantillas/sub-workflows.
- **Planificación de capacidad:** la distribución de complejidad (42% simple, 38% medio, 20% complejo) informa el esfuerzo de mantenimiento esperado.

**El Costo de Ignorarlo:** invertir en dominar nodos poco usados, y no tener criterio empírico para priorizar la librería de templates.

#### Criterio rector

> **"Optimiza por el 20% que generas el 80%."** Los datos muestran dónde está el cuello de botella y la oportunidad.

---

## 16. Arquitectura de Despliegue n8n Self-Hosted

> **Propósito macro:** Definir **cómo se lleva n8n a producción** de forma segura, escalable y mantenible — en infraestructura propia (self-hosted) en lugar de SaaS. Responde a la pregunta estratégica de *dónde vive* la automatización y *bajo qué garantías*.

### ¿POR QUÉ existe esta sección?

Un sistema que solo existe en localhost no es un sistema — es un prototipo. Para que el proyecto tenga valor real (automatizar notificaciones, reportes, ingesta en el sistema judicial TSJ), n8n debe correr de forma **fiable, segura y escalable**. El self-hosting da **control total** (datos, costos, privacidad) frente a n8n Cloud, lo que es especialmente relevante en un contexto judicial donde **la soberanía de los datos es un requisito**, no una preferencia.

### ¿PARA QUÉ sirve?

- Llevar n8n a un entorno de producción accesible vía dominio con HTTPS.
- Permitir que el agente (vía MCP en punto 11) opere contra una instancia *real* y *segura*, no solo local.
- Escalar desde un proceso único (single) hasta un clúster con colas (queue) según la carga.

---

### 16.1 Modo Single (docker-compose.single.yml)

#### ¿POR QUÉ?

Para cargas pequeñas/medianas o entornos de arranque, un **solo proceso n8n** basta. Este modo ofrece el camino más simple a producción: un Caddy (proxy + TLS automático) y un contenedor n8n.

#### ¿PARA QUÉ?

- **Caddy** se encarga del TLS automático (HTTPS sin configurar certificados a mano) y actúa como puerta de entrada.
- **n8n no publicado al host** (solo red privada): reduce la superficie de ataque; el acceso solo se da a través de Caddy.
- **SQLite como BD:** suficiente para esta escala, sin la complejidad de un servidor de BD.
- Las **variables de seguridad** codifican las mejores prácticas:
  - `N8N_ENCRYPTION_KEY` — clave maestra para cifrar credenciales (obligatoria y con backup).
  - `N8N_SECURE_COOKIE=true` — cookies solo por HTTPS.
  - `N8N_DIAGNOSTICS_ENABLED=false` — no enviar telemetría.
  - `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` — los nodes no acceden a variables de entorno del host (sandbox).
  - `N8N_RUNNERS_ENABLED=true` — aislamiento de ejecución de código.
  - `N8N_DEFAULT_BINARY_DATA_MODE=filesystem` — archivos binarios en disco, no en memoria.
  - `EXECUTIONS_DATA_PRUNE=true` — limpieza automática (330h, 50K) para no llenar el disco.

**El Costo de Ignorarlo:** una instancia insegura (telemetría activa, cookies inseguras, nodes con acceso a secretos del host) o un disco que se llena con datos de ejecuciones.

#### Criterio rector

> **"Seguridad por configuración, no por convención."** En producción, las opciones seguras deben ser la configuración de fábrica del despliegue.

---

### 16.2 Modo Queue (docker-compose.queue.yml)

#### ¿POR QUÉ?

Cuando la carga crece, un solo proceso no basta: las ejecuciones bloquean la UI y no escalan. El modo queue introduce **procesamiento asíncrono distribuido**: una cola de trabajos (Redis/Bull) que reparte las ejecuciones entre N workers. Esto permite *escalado horizontal*.

#### ¿PARA QUÉ?

- **Caddy + n8n main + Redis + Postgres + N workers:** separa la orquestación (main) de la ejecución (workers).
- **Anchor YAML `x-n8n-env`:** garantiza que la configuración genérica llegue **igual a main y workers** — evitando configs divergentes entre nodos del clúster.
- **`EXECUTIONS_MODE=queue` + Redis/Bull:** el mecanismo de cola.
- **Postgres como BD (`N8N_DEFAULT_BINARY_DATA_MODE=database`):** datos binarios en la BD central, compartidos entre workers (imposible con filesystem local en un clúster).
- **Escalado:** `--scale n8n-worker=N` para crecer workers bajo demanda. El `concurrency=5` y `replicas=2` definen el punto de partida.

**El Costo de Ignorarlo:** cuellos de botella cuando la carga supera un proceso; la UI se bloquea y las ejecuciones se amontonan. El modo single es un callejón sin salida para escala real.

#### Criterio rector

> **"Diseña el límite, no el promedio."** El modo queue es la respuesta a "¿qué pasa cuando crezca?" antes de que crezca.

---

### 16.3 Caddyfile

#### ¿POR QUÉ?

El Caddyfile es el **front-door HTTPS** de todo el despliegue. Define cómo el tráfico externo llega a n8n y qué cabeceras de seguridad se aplican. Es la primera línea de defensa de la infraestructura.

#### ¿PARA QUÉ?

- **Reverse proxy** de `n8n:5678` con `flush_interval -1` (streaming correcto de respuestas) y headers reales (IP del cliente, esquema, host).
- **Security headers:** HSTS (exigir HTTPS), nosniff (evitar MIME sniffing), SAMEORIGIN (protección de framing/clickjacking), Referrer-Policy (no filtrar URL por referer).
- **Dominio configurable** (`{$N8N_SUBDOMAIN}.{$N8N_DOMAIN}`) vía variables de entorno — flexibilidad de despliegue.

**El Costo de Ignorarlo:** tráfico sin cifrar, cabeceras de seguridad ausentes, y una exposición innecesaria del tráfico y metadata.

#### Criterio rector

> **"El borde del sistema es tan seguro como su puerta de entrada."** El proxy es donde se aplican las políticas de transporte y cabeceras.

---

### 16.4 Reglas de Secretos

#### ¿POR QUÉ?

Los secretos son el **activo más valioso y más frágil** de la infraestructura. Una fuga de `N8N_ENCRYPTION_KEY` significa que todas las credenciales de los workflows quedan descifrables. Por eso las reglas de secretos son las más inflexibles de todo el despliegue.

#### ¿PARA QUÉ?

1. **NUNCA commitear `.env` real** — el `.env.example` se versiona; el `.env` con valores reales no.
2. **Generar secrets frescos en cada box** — `openssl rand -base64 32` — nunca reutilizar claves entre entornos (si una se filtra, no compromete a las demás).
3. **`N8N_ENCRYPTION_KEY` igual en main y workers en queue mode** — de lo contrario los workers no podrían descifrar las credenciales compartidas.
4. **Backups fuera del server** — la clave + la BD deben respaldarse en ubicación externa para sobrevivir a un fallo del box.

**El Costo de Ignorarlo:** fuga masiva de credenciales, indisponibilidad (workers sin la clave correcta), o pérdida irreversible si el server muere sin backup.

#### Criterio rector

> **"Un secreto filtrado es un incidente de seguridad; un secreto perdido es un incidente de disponibilidad."** Ambas son evitables con disciplina.

---

## Síntesis Ejecutiva

En cuatro secciones, esta es la **lógica maestra** que un CTO debe recordar:

### Punto 10 — Configuración Agentica
**Por qué:** Un agente de IA sin instrucciones produce resultados impredecibles. **Para qué:** convertir la experiencia del mejor ingeniero n8n en reglas y skills versionables que garantizan calidad consistente. **Idea fuerza:** *proceso = producto*.

### Punto 11 — Configuración MCP y n8n
**Por qué:** El conocimiento del punto 10 necesita un canal para actuar sobre una instancia real. **Para qué:** conectar el agente a n8n de forma reproducible y segura, con configuración, scripts de arranque e importación automatizada. **Idea fuerza:** *el canal hace operativo el conocimiento*.

### Punto 12 — Patrones de Diseño
**Por qué:** La mayoría de los problemas de n8n se repiten; no tiene sentido resolverlos desde cero cada vez. **Para qué:** reutilizar arquitecturas probadas, evitar anti-patrones costosos y gatear la vida de los workflows antes de activarlos. **Idea fuerza:** *construir con repertorio, no por improvisación*.

### Punto 16 — Despliegue Self-Hosted
**Por qué:** Un sistema que vive solo en localhost es un prototipo, y el contexto judicial exige soberanía de datos. **Para qué:** llevar n8n a producción segura (single) y escalable (queue) con HTTPS, cabeceras de seguridad y disciplina de secretos. **Idea fuerza:** *seguridad por configuración, escala por diseño*.

---

### El Hilo Conector

Los cuatro puntos forman un **ciclo de madurez** dependiente:

```
[10] Saber construir bien (conocimiento)
   → [11] Poder operar sobre una instancia (canal)
      → [12] Construir con patrones correctos (método)
         → [16] Operar de forma segura y escalable (infraestructura)
```

Ninguno es opcional: sin [10] se construye mal; sin [11] no se puede construir; sin [12] se construye frágil; sin [16] no se sostiene en producción. Juntos convierten a un repositorio de prototipo en un **sistema de automatización profesional, reproducible y auditable**.

---

*Documento complementario generado el 8 de septiembre de 2026. Se apoya en `CONSILIUM.md` (puntos 10, 11, 12 y 16) y agrega la capa de razonamiento estratégico (¿por qué? / ¿para qué?) a nivel de sección y subíndice.*
