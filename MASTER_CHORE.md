# MASTER_CHORE.md — Plan de Adaptación Agéntica CONSILIUM (sin contradicciones)

> **Fecha:** 25 de octubre de 2026  
> **Objetivo:** Incorporar la disciplina de ejecución, bitácoras, git‑workflow y auto‑mantenimiento de **Condominios Venezuela** en **CONSILIUM**, **respetando y reforzando** la arquitectura DDD/TDD/offline‑first existente, los naming conventions de CONSILIUM, los ADRs y contratos ya documentados en `docs/`, y el workflow agéntico canónico de `VERIFICATION_WORKFLOW_AGENT.md`.

---

## 1. PRINCIPIOS INQUEBRANTABLES (Reglas de oro)

| Principio | Acción |
|-----------|--------|
| **DDD no se rompe** | Cualquier nueva rule/skill/workflow debe validar **dependencias hacia adentro** (Domain → Application → Infrastructure → UI). `npm run lint:conventions` es gate obligatorio. |
| **Naming conventions = solo CONSILIUM** | PascalCase para componentes/clases/VO/interfaces; camelCase para variables/funciones/archivos no exportables. **No** crear `naming-conventions.md` duplicado; extender el skill existente `naming-conventions` y la regla en `AGENTS.md`. |
| **Workflow agéntico existente se MEJORA, no reemplaza** | El flujo de 7 pasos (PASO 0‑7) de `VERIFICATION_WORKFLOW_AGENT.md` sigue siendo el canon. Las adiciones (PLAN FIRST, STOPS, bitácoras, git‑workflow, self‑maintenance) se **inyectan** como sub‑pasos o checkpoints dentro de ese flujo. |
| **Documentación en `docs/` no se duplica** | Los 7 ADRs, `architecture/overview.md` y los 2 contratos de `integrations/` **permanecen en su ubicación**. Solo se referencian desde la nueva configuración agentica. |
| **Triggers `always_on`** | Todos los archivos `.md` bajo `.agent/rules/` llevan cabecera `--- trigger: always_on ---` para carga automática en opencode. |
| **Zero‑secrets, zero‑env‑in‑repo** | Mantener la regla actual de `AGENTS.md` (punto 7). |

---

## 2. ESTRUCTURA FINAL DE `.agent/` (singular)

```
.agent/
├── rules/
│   ├── checklist-verify.md                # NUEVO – gate obligatorio pre‑tarea
│   ├── design-system/
│   │   ├── index.md                       # NUEVO – referencia dumb‑components + tokens futuros
│   │   ├── colors.md                      # NUEVO – paleta CONSILIUM (neutra por ahora)
│   │   ├── specs.md                       # NUEVO – dumb component specs (props/callbacks only)
│   │   ├── ui-elements.md                 # NUEVO – DocumentRow, DocumentUploadList, Badge, etc.
│   │   ├── lists-tables.md                # NUEVO – patrones de listas outbox / documentos
│   │   └── migration-mapping.md           # NUEVO – N/A (sin legacy UI), mantener placeholder
│   └── global-context/
│       ├── index.md                       # NUEVO – índice navegable
│       ├── global-context.md              # NUEVO – tech stack CONSILIUM, fuentes de verdad
│       ├── development-invariants.md      # NUEVO – invariantes + Root Cause Analysis adaptado a DDD
│       ├── route-map.md                   # NUEVO – rutas apps (web/desktop/mobile) + API futura
│       ├── technical-rules.md             # NUEVO – Fullstack Integrity adaptado a capas DDD
│       ├── naming-conventions.md          # NUEVO – **solo referencia** al skill naming-conventions
│       ├── accessibility.md               # NUEVO – WCAG básico para dumb components
│       ├── local-deploy.md                # NUEVO – protocolo dev:web/desktop/mobile + cargo check
│       ├── push-notifications.md          # NUEVO – placeholder (fase futura)
│       ├── reports-system.md              # NUEVO – placeholder (fase futura, sync reports)
│       └── self-maintenance.md            # NUEVO – matriz de actualización post‑flight
├── skills/
│   ├── git-branch-formatter/SKILL.md      # NUEVO – convención ramas (feat/fix/… kebab‑case)
│   ├── git-commit-formatter/SKILL.md      # NUEVO – Conventional Commits
│   ├── ddd-structured-development/SKILL.md
│   ├── tdd-workflow/SKILL.md
│   ├── ui-dumb-components/SKILL.md
│   ├── rust-wasm-processing/SKILL.md
│   ├── offline-sync/SKILL.md
│   ├── react-tauri-capacitor/SKILL.md
│   ├── naming-conventions/SKILL.md
│   └── graphql-contracts/SKILL.md
├── workflows/
│   └── git-workflow.md                    # NUEVO – 9 pasos, builds gate CONSILIUM
└── scripts/                               # (existente check-conventions.mjs)
```

> **Nota:** `.agents/` (plural) **se renombra a `.agent/`** (singular) para alinear con el estándar de Condominios Venezuela y con la configuración `opencode.json` que se creará.

---

## 3. ARCHIVOS EXISTENTES EN `docs/` – DECISIÓN DE PERMANENCIA

| Archivo / Carpeta | Acción | Justificación |
|-------------------|--------|---------------|
| `docs/adr/0001‑…​0007‑*.md` | **Mantener** en `docs/adr/` | Son ADRs oficiales, firmados, referenciados por `MASTER_INIT_PROMPT.md` y `AGENTS.md`. |
| `docs/architecture/overview.md` | **Mantener** | Visión única de arquitectura; fuente para onboarding y para `global-context/global-context.md`. |
| `docs/integrations/ingestion.contract.md` | **Mantener** | Contrato neutro JSON para n8n futuro; referenciado por `.agents/n8n-future/FUTURE_README.md`. |
| `docs/integrations/notifications.contract.md` | **Mantener** | Idem. |
| `docs/` (raíz) | **No mover** | Estructura esperada por `MASTER_INIT_PROMPT.md` (sección 8) y por `DOCS.md`. |

**No se crean archivos duplicados** en `.agent/rules/global-context/` que repliquen el contenido de `docs/`. En su lugar, los nuevos archivos **referencian** a `docs/` (ej. `global-context.md` incluye “Ver `docs/adr/0002‑append-only.md` para decisión append‑only”).

---

## 4. FUSIÓN DE `AGENTS.md` (≈180 líneas)

Secciones finales (ordenadas):

1. **Reglas Supremas CONSILIUM** (8 actuales) – **se conservan intactas**.
2. **Reglas Supremas Condominios** (PLAN FIRST, STOPS, BUILDS GATE, ROOT CAUSE, DEPLOY LOCAL, SECUENCIA FINAL) – **se añaden como 0.1‑0.7** antes de las reglas CONSILIUM, numeración continua.
3. **Protocolo de Inicio** (Triaje Exento/Trackeable, Pre‑flight, Lectura obligatoria, Inicialización bitácora) – **nueva sección**.
4. **Ejecución** (Exento vs Trackeable con bitácora viva) – **nueva sección**.
5. **Regla de Eficiencia** (sin preámbulos, razonamiento cognitivo, comunicación estructurada, concisión, edición silenciosa) – **nueva sección**.
6. **Sources of Truth & Tools** – actualizada para incluir:
   - `AGENTS.md`
   - `.agent/rules/global-context/global-context.md`
   - `.agent/rules/checklist-verify.md`
   - `.agent/workflows/git-workflow.md`
   - `.bitacoras/index.md` + `.bitacoras/actual.md`
   - Skills (10 total)
   - Agentes opencode (plan/build/review)
   - Tools: `@git-branch-formatter`, `@git-commit-formatter`

**No se eliminan** las 8 reglas CONSILIUM; se **preceden** con las de ejecución estricta para crear un “sándwich” de gobernanza: *ejecución → arquitectura*.

---

## 5. `checklist-verify.md` – Gate Obligatorio Pre‑Tarea

Basado en Condominios Venezuela **adaptado a CONSILIUM**:

- **PLAN FIRST** (crear plan, mostrar, esperar aprobación).
- **STOPS POR FASE** (cada fase termina con build gate).
- **BUILDS GATE CONSILIUM** → `npm run typecheck && npm run test && npm run lint:conventions && cargo check --workspace && cargo test --workspace`.
- **ROOT CAUSE ANALYSIS** adaptado a capas DDD (UI → UseCase → Domain → Infrastructure).
- **PRE‑FLIGHT** (git status, rama actual debe ser `dev`).
- **LECTURA OBLIGATORIA** (AGENTS.md, global‑context.md, checklist‑verify.md, git‑workflow.md).
- **BITÁCORA** (crear `.bitacoras/###-nombre.md` ANTES de código si Trackeable).
- **POST‑FLIGHT** (self‑maintenance.md) **antes** de PR.
- **SECUENCIA FINAL** (confirmación usuario → bitácoras → auto‑mantenimiento → commit directo en `dev`).

---

## 6. `git-workflow.md` – 9 Pasos (adaptado)

| Paso | Comando / Acción CONSILIUM |
|------|----------------------------|
| 0 Pre‑flight | `git status`; abortar si en `main` (trabajo directo en `dev`) |
| 1 Plan First | Crear plan, presentar, **esperar aprobación** |
| 2 Sync | `git checkout dev && git pull` |
| 3 Branch | *No se crea rama de trabajo* (commit directo en `dev`) |
| 4 Develop | Implementar por fases; **cada fase** → builds gate (typecheck, test, lint, cargo) |
| 5 Commit | `@git-commit-formatter` → `git commit -m "<msg>"` |
| 6 Push | `git push` (directo a `dev`) |
| 7 STOP | Mostrar resumen, builds opcionales, **esperar aprobación** |
| 8 Final Sequence | Confirmación usuario → actualizar bitácoras → self‑maintenance → **commit directo en `dev` (sin PR)** |

*Los comandos de build usan los scripts de `package.json` y `cargo` de CONSILIUM.*

---

## 7. BITÁCORAS – Sistema Mínimo Inicial

1. `.bitacoras/00-plantilla.md` – copia exacta de Condominios.
2. `.bitacoras/index.md` – estado inicial:
   - Tarea activa: *ninguna*
   - Última completada: *Inicialización agentica*
   - Branch actual: `main`
   - Historial vacío (empezar en `#001`).
3. `.bitacoras/actual.md` – vacía con formato plantilla, estado `🟡 EN CURSO - Configuración agentica`.

---

## 8. `opencode.json` – 3 Agentes Especializados

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "plan": {
      "mode": "primary",
      "model": "auto",
      "description": "Planificador estratégico CONSILIUM",
      "prompt": "Lee AGENTS.md, .agent/rules/global-context/global-context.md, checklist-verify.md, .bitacoras/index.md, .bitacoras/actual.md, .agent/workflows/git-workflow.md. NUNCA trabajes en main/dev.",
      "tools": { "write": true, "edit": false, "bash": true }
    },
    "build": {
      "mode": "primary",
      "model": "auto",
      "description": "Constructor principal CONSILIUM",
      "prompt": "Lee AGENTS.md, global-context.md, checklist-verify.md, design-system/index.md, bitacoras, git-workflow.md. Prioriza DDD, TDD, UI dumb, offline‑first.",
      "tools": { "write": true, "edit": true, "bash": true }
    },
    "code-reviewer": {
      "mode": "subagent",
      "model": "auto",
      "description": "Revisor de seguridad, rendimiento y límites DDD",
      "prompt": "Lee AGENTS.md, global-context.md, checklist-verify.md, design-system/index.md, bitacoras, git-workflow.md. Enfócate en typecheck, cargo clippy, dependencias hacia adentro, UI dumb.",
      "tools": { "write": false, "edit": true }
    }
  }
}
```

*Modelos `auto` dejan que opencode elija el disponible; no hardcodear `nemotron3-ultra-550b-a55b`.*

---

## 9. TRIGGERS `always_on` – Aplicación Masiva

Añadir cabecera a **todos** los `.md` bajo `.agent/rules/` (incluyendo subcarpetas) :

```markdown
---
trigger: always_on
---
```

Esto garantiza carga automática sin intervención manual.

---

## 10. VALIDACIÓN END‑TO‑END (Gate Final)

Ejecutar **una sola vez** tras completar la migración:

```bash
cd /home/dangelojan/BSA/cosilium

# 1. Estructura
tree .agent .bitacoras

# 2. AGENTS.md fusionado
head -80 AGENTS.md

# 3. Checklist verify
head -40 .agent/rules/checklist-verify.md

# 4. Skills git
cat .agent/skills/git-branch-formatter/SKILL.md
cat .agent/skills/git-commit-formatter/SKILL.md

# 5. Workflow
head -40 .agent/workflows/git-workflow.md

# 6. opencode.json
cat opencode.json

# 7. Quality gates CONSILIUM (DEBEN SER 0 ERRORES)
npm run typecheck
npm run test
npm run lint:conventions
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
```

Si **alguno falla** → corregir antes de cualquier commit.

---

## 11. PRIMERA TAREA DE PRUEBA (Exenta) – Validación Real
 
1. **Triaje:** ÁMBITO EXENTO (cambios solo en `.agent/`, `AGENTS.md`, `opencode.json`).
2. **Pre‑flight:** `git status` → confirmar rama `dev`.
3. **Lectura obligatoria:** AGENTS.md, global-context.md, checklist-verify.md, git-workflow.md.
4. **Plan:** “Validar configuración agentica completa”.
5. **Ejecución:** correr los 6 quality‑gates del paso 10.
6. **Commit:** usando `@git-commit-formatter` → `chore(agent): add agentic config from Condominios Venezuela`.
7. **Push directo a `dev`** (sin PR).
8. **Actualizar bitácora** `#001-configuracion-agentica.md` con estado ✅ COMPLETADO.
9. **Post‑flight:** leer `self-maintenance.md` → **“Sin cambios requeridos”** (la tarea solo añadió configuración, no código de dominio).
10. **Confirmar completado** → cerrar tarea.

---

## 12. MAPEO FINAL DE REGLAS (Condominios → CONSILIUM) SIN CONTRADICCIONES

| Regla Condominios | Implementación CONSILIUM (archivo) | Comentario |
|-------------------|-----------------------------------|------------|
| PLAN FIRST | `AGENTS.md` (regla 0.1) + `checklist-verify.md` | Obligatorio antes de cualquier código. |
| STOPS POR FASE | `AGENTS.md` (regla 0.2) + `git-workflow.md` paso 7 | Cada fase = build gate + aprobación. |
| BUILDS OBLIGATORIOS | `checklist-verify.md` + `git-workflow.md` paso 4/5 | `typecheck+test+lint:conventions+cargo check+cargo test`. |
| ROOT CAUSE ANALYSIS | `development-invariants.md` §5 + `checklist-verify.md` | Cadena DDD: UI → UseCase → Domain → Infra. |
| DEPLOY LOCAL | `local-deploy.md` | Protocolos `npm run dev:web/desktop/mobile` + `cargo check`. |
| TRIAGE EXENTO/TRACKEABLE | `AGENTS.md` §Protocolo Inicio + `checklist-verify.md` | Decide si requiere bitácora. |
| BITÁCORA VIVA | `.bitacoras/` + `AGENTS.md` §Ejecución | `actual.md` actualizado en tiempo real. |
| GIT WORKFLOW ESTRICTO | `.agent/workflows/git-workflow.md` | 9 pasos, PR solo a `dev`. |
| GIT BRANCH FORMATTER | `.agent/skills/git-branch-formatter/SKILL.md` | feat/fix/refactor/docs/chore/hotfix, kebab‑case. |
| GIT COMMIT FORMATTER | `.agent/skills/git-commit-formatter/SKILL.md` | Conventional Commits. |
| AUTO‑MANTENIMIENTO | `.agent/rules/global-context/self-maintenance.md` | Matriz post‑flight, ejecutar tras ✅ COMPLETADO. |
| DESIGN SYSTEM MÍNIMA | `.agent/rules/design-system/*` | Solo dumb‑components; sin tokens de marca aún. |
| FULLSTACK INTEGRITY → DDD | `.agent/rules/global-context/technical-rules.md` | UI dumb + UseCases + Domain + Infra + Contracts. |
| NAMING CONVENTIONS | **Extender** skill `naming-conventions` + `AGENTS.md` §Nomenclatura | **No** crear archivo duplicado. |
| TRIGGERS ALWAYS_ON | Cabecera en todos `.agent/rules/**/*.md` | Carga automática en opencode. |

---

## 13. RIESGOS Y MITIGACIONES (Resueltos)

| Riesgo | Mitigación Definitiva |
|--------|----------------------|
| Romper DDD boundaries | `npm run lint:conventions` + grep inverso (`grep -r "from.*core" apps/ packages/ui`) **debe ser vacío** antes de commit. |
| Conflictos naming | **Eliminar** cualquier `naming-conventions.md` duplicado; solo skill + regla en `AGENTS.md`. |
| Skills existentes vs nuevas | **Mantener** 8 skills DDD/TDD; **añadir** solo 2 git skills. |
| Bitácoras interfieren workflow | Iniciar con tarea **exenta** `#001`; validar que `VERIFICATION_WORKFLOW_AGENT.md` sigue siendo el flujo canónico. |
| opencode.json conflictúa | Probar agentes `plan`/`build`/`code-reviewer` en la tarea de prueba `#001` antes de commit. |
| Triggers always_on carga excesiva | <20 archivos `.md`; carga < 10 ms – despreciable. |

---

## 14. CHECKLIST DE MIGRACIÓN (Listo para Ejecutar)

- [ ] **FASE 0** Backup `.agents` → `.agents.backup.<date>`
- [ ] **FASE 1** Renombrar `.agents` → `.agent` + crear carpetas faltantes
- [ ] **FASE 2** Crear 14 archivos rules (checklist‑verify, global‑context/*, design‑system/*)
- [ ] **FASE 3** Crear 2 skills git (branch‑formatter, commit‑formatter)
- [ ] **FASE 4** Crear workflow `git-workflow.md` (9 pasos, builds gate CONSILIUM)
- [ ] **FASE 5** Crear bitácoras (plantilla, index, actual)
- [ ] **FASE 6** Crear `opencode.json` con 3 agentes
- [ ] **FASE 7** Fusionar `AGENTS.md` (reglas supremas + protocolo + sources)
- [ ] **FASE 8** Añadir `trigger: always_on` a todos `.agent/rules/**/*.md`
- [ ] **FASE 9** Ejecutar quality gates → **0 errores**
- [ ] **FASE 10** Ejecutar tarea de prueba `#001` (exenta) y cerrar bitácora ✅

---

## 15. COMANDOS DE VERIFICACIÓN POST‑MIGRACIÓN (Copiar‑pegar)

```bash
cd /home/dangelojan/BSA/cosilium

# Estructura
tree .agent .bitacoras

# AGENTS.md
head -100 AGENTS.md

# Checklist
head -50 .agent/rules/checklist-verify.md

# Skills git
cat .agent/skills/git-branch-formatter/SKILL.md
cat .agent/skills/git-commit-formatter/SKILL.md

# Workflow
head -50 .agent/workflows/git-workflow.md

# opencode.json
cat opencode.json

# Quality gates (DEBEN PASAR)
npm run typecheck
npm run test
npm run lint:conventions
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
```

---

## 16. CONCLUSIÓN
 
Este **MASTER_CHORE.md** es la hoja de ruta **única y autorizada** para incorporar la configuración agentica de Condominios Venezuela en CONSILIUM **sin romper**:
 
- la arquitectura DDD/TDD/offline‑first,
- los naming conventions propios de CONSILIUM,
- los ADRs y contratos ya consolidados en `docs/`,
- el workflow agéntico canónico de `VERIFICATION_WORKFLOW_AGENT.md`.
 
Ejecutar las **10 fases** en orden, validar con los **quality gates** y cerrar la **tarea de prueba #001** garantiza que el repo quede con una gobernanza robusta, trazabilidad (bitácoras), disciplina de commits/PR y auto‑mantenimiento post‑flight, listo para escalar el desarrollo de CONSILIUM.
 
--- 
 
## 17. ARCHIVOS DE VERIFICACIÓN Y DESPLIEGUE – DISPOSICIÓN Y INDEXACIÓN
 
Los siguientes archivos existen en la raíz del repositorio y contienen información que **ya está reflejada** en la configuración agentica (`.agent/`, `docs/`, `AGENTS.md`, `VERIFICATION_WORKFLOW_AGENT.md`, `DOCS.md`, `MASTER_CHORE.md`). **No deben eliminarse ni modificarse**; solo se documenta aquí su disposición para evitar duplicidad futura.
 
| Archivo | Contenido principal | ¿Información ya indexada? | Dónde queda indexada (referencia) | Acción sobre el archivo |
|---------|--------------------|---------------------------|-----------------------------------|--------------------------|
| `VERIFICACION_MIP.md` | Verificación exhaustiva de la checklist del `MASTER_INIT_PROMPT.md` (12 ítems A‑L) con evidencia de tests, typecheck, cargo, ADRs, dumb component, etc. | **Sí** – toda la evidencia está cubierta por `MASTER_INIT_PROMPT.md` (sección 9), `VERIFICATION_WORKFLOW_AGENT.md` (pasos 0‑7), `DOCS.md` (ADRs, contratos) y los quality gates de `MASTER_CHORE.md`. | No se crea duplicado; la verificación se considera **registro histórico**. | **Mantener** en raíz como evidencia de cumplimiento (read‑only). |
| `VERIFICATION_WORKFLOW_AGENT.md` | Flujo de trabajo agéntico canónico de 7 pasos (PASO 0‑7) + probabilidades de ejecución + flujos específicos por tipo de tarea + reglas de bloqueo + comandos rápidos + DoD. | **Sí** – es el **workflow canónico** referenciado en `MASTER_CHORE.md` (sección 1, principio “Workflow agéntico existente se MEJORA, no reemplaza”) y en `AGENTS.md` (Sources of Truth). | Permanece como documento maestro del workflow; cualquier nueva regla se inyecta como sub‑paso. | **Mantener** en raíz; no mover a `.agent/`. |
| `BUILD_DESKTOP.md` | Procedimiento para generar instaladores desktop (`tauri build`), gestión de iconos (generación diferida), diferencia entre `tauri dev` y release. | **Parcial** – comandos de release y nota de iconos se han incorporado en `.agent/rules/global-context/local-deploy.md` (sección “Desktop release” y “Iconos”). | `local-deploy.md` contiene ahora los comandos y la nota de generación de iconos. | **Mantener** en raíz como guía de build histórica; no duplicar en `.agent/`. |
| `LOCAL_DEPLOY.md` | Guía de despliegue local para Web, Desktop (Tauri) y Mobile (Capacitor) con requisitos de Node, Rust, Android SDK, verificación WSL. | **Sí** – protocolos de `dev:web`, `dev:desktop`, `dev:mobile` y requisitos de toolchain están en `.agent/rules/global-context/local-deploy.md`. | `local-deploy.md` (nuevo en `.agent/rules/global-context/`) es la versión canónica; el archivo raíz sirve de referencia histórica. | **Mantener** en raíz; no eliminar. |
 
> **Regla:** *Ninguno de estos cuatro archivos se borra, mueve ni modifica.* Sirven como **registro de verificación y decisiones de build** y coexisten con la configuración agentica centralizada en `.agent/`.
 
--- 
 
**Fin del documento.** Solo se ha actualizado `MASTER_CHORE.md`; ninguna otra modificación está autorizada en este paso.