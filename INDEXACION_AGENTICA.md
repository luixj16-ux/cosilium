# INDEXACION_AGENTICA.md — Configuración Agéntica Completa: Condominios Venezuela → CONSILIUM

> **Fecha:** 25 de octubre de 2026  
> **Origen:** `/home/dangelojan/BSA/Condominios Venezuela/.agent/`  
> **Destino:** `/home/dangelojan/BSA/cosilium/` (este proyecto)

---

## 1. RESUMEN EJECUTIVO

| Aspecto | Condominios Venezuela (.agent/) | CONSILIUM (.agents/) | Brecha Principal |
|---------|--------------------------------|---------------------|------------------|
| **Estructura raíz** | `.agent/` (singular) | `.agents/` (plural) | Renombrado + migración |
| **Reglas** | `.agent/rules/` + subcarpetas `design-system/`, `global-context/` | `.agents/rules/` (plano: 3 archivos) | Falta design-system, global-context granular, checklist-verify, self-maintenance |
| **Skills** | 2 skills: `git-branch-formatter`, `git-commit-formatter` | 8 skills DDD/TDD/offline/Rust/UI | Falta 6 skills técnicos + skills de git |
| **Workflows** | 1: `git-workflow.md` (127 líneas, estricto) | 0 workflows | Falta workflow completo |
| **Bitácoras** | `.bitacoras/` con plantilla, index, actual, 37 tareas | 0 bitácoras | Sistema completo ausente |
| **Config agente** | `opencode.json` con 3 agentes (plan/build/review) | No existe | Configuración agentes ausente |
| **Triggers** | `trigger: always_on` en archivos de reglas | No usado | Automatización de carga ausente |

---

## 2. ANÁLISIS DETALLADO POR COMPONENTE

### 2.1 AGENTS.md — Comparativa

| Sección | Condominios Venezuela | CONSILIUM | Acción Requerida |
|---------|----------------------|-----------|------------------|
| Reglas Supremas | 8 reglas (0.1-0.8) con **PLAN FIRST**, **STOPS**, **BUILDS**, **ROOT CAUSE** | 8 reglas DDD/TDD/UI/Offline/n8n/Branding | **Fusionar**: agregar PLAN FIRST, STOPS, BUILDS, ROOT CAUSE a CONSILIUM |
| Protocolo Inicio | Triaje (Exento/Trackeable) + Pre-flight + Lectura obligatoria (4 archivos) | No existe | **Implementar** protocolo completo |
| Ejecución | Bitácora viva (actual.md) + sincronización real + Post-flight | No existe | **Implementar** sistema bitácoras |
| Sources of Truth | 3 fuentes + 2 agentes (plan/build) + 2 tools | Solo refiere a skills | **Agregar** agentes plan/build/review + tools git |
| **Total líneas** | **159** | **40** | Expandir significativamente |

### 2.2 Estructura de Reglas — Comparativa

```
Condominios Venezuela (.agent/rules/)          CONSILIUM (.agents/rules/)
├── checklist-verify.md (132 líneas)              ├── domain-rules.md
├── design-system/                                 ├── code-conventions.md
│   ├── index.md (35 líneas)                      └── sync-architecture.md
│   ├── colors.md
│   ├── lists-tables.md
│   ├── migration-mapping.md
│   ├── specs.md
│   └── ui-elements.md
├── global-context/
│   ├── index.md (32 líneas)
│   ├── global-context.md (46 líneas)
│   ├── development-invariants.md (80 líneas)
│   ├── route-map.md (79 líneas)
│   ├── technical-rules.md (37 líneas)
│   ├── accessibility.md
│   ├── local-deploy.md
│   ├── naming-conventions.md
│   ├── push-notifications.md
│   ├── reports-system.md
│   └── self-maintenance.md (52 líneas)
```

**Archivos FALTANTES en CONSILIUM (14):**
1. `checklist-verify.md` — **CRÍTICO** (verificación obligatoria antes de cada tarea)
2. `design-system/index.md` + 5 submódulos — **CRÍTICO** (UI consistente)
3. `global-context/index.md` — índice navegable
4. `global-context/global-context.md` — tech stack, arquitectura, fuentes de verdad
5. `global-context/development-invariants.md` — invariantes + root cause analysis
6. `global-context/route-map.md` — rutas frontend + API
7. `global-context/technical-rules.md` — fullstack integrity, componentes públicos
8. `global-context/naming-conventions.md`
9. `global-context/accessibility.md`
10. `global-context/local-deploy.md` — protocolo deploy local
11. `global-context/push-notifications.md`
12. `global-context/reports-system.md`
13. `global-context/self-maintenance.md` — **CRÍTICO** (auto-mantenimiento post-flight)
14. Triggers `trigger: always_on` en headers de archivos

### 2.3 Skills — Comparativa

| Skill | Condominios Venezuela | CONSILIUM | Estado |
|-------|----------------------|-----------|--------|
| `git-branch-formatter` | ✅ Convención ramas + tipos + ejemplos | ❌ | **Crear** |
| `git-commit-formatter` | ✅ Conventional Commits + scope + ejemplos | ❌ | **Crear** |
| `ddd-structured-development` | ❌ | ✅ | Mantener |
| `tdd-workflow` | ❌ | ✅ | Mantener |
| `ui-dumb-components` | ❌ | ✅ | Mantener |
| `rust-wasm-processing` | ❌ | ✅ | Mantener |
| `offline-sync` | ❌ | ✅ | Mantener |
| `react-tauri-capacitor` | ❌ | ✅ | Mantener |
| `naming-conventions` | ❌ (está en rules) | ✅ | Mantener |
| `graphql-contracts` | ❌ | ✅ | Mantener |

**Skills FALTANTES en CONSILIUM (2):**
- `git-branch-formatter` — **CRÍTICO** (naming ramas obligatorio)
- `git-commit-formatter` — **CRÍTICO** (commits convencionales obligatorios)

### 2.4 Workflows — Comparativa

| Workflow | Condominios Venezuela | CONSILIUM | Estado |
|----------|----------------------|-----------|--------|
| `git-workflow.md` | ✅ 127 líneas, 9 pasos, pre-flight, sync, branch, dev, builds, commit, push, STOP, secuencia final, PR | ❌ | **Crear COMPLETO** |

### 2.5 Bitácoras — Sistema Completo Ausente

```
Condominios Venezuela (.bitacoras/)          CONSILIUM
├── 00-plantilla.md (59 líneas)                 (nada)
├── index.md (129 líneas) - mapa + estado + historial 37 tareas
├── actual.md (contexto vivo)
└── 037 archivos de tareas (###-nombre.md)
```

**Componentes a crear:**
1. `.bitacoras/00-plantilla.md`
2. `.bitacoras/index.md`
3. `.bitacoras/actual.md` (inicial vacío con formato plantilla)

### 2.6 Configuración de Agentes (opencode.json)

**Condominios Venezuela tiene 3 agentes especializados:**
- `plan` — Solo lectura + bash, sin edit (planificador estratégico)
- `build` — Lectura + edit + bash (constructor principal)
- `code-reviewer` — Subagente, solo edit, enfoque seguridad/latencia

**CONSILIUM:** No tiene `opencode.json`

---

## 3. PASO A PASO — IMPLEMENTACIÓN Y ADAPTACIÓN EN CONSILIUM

### FASE 0 — Preparación y Backup (OBLIGATORIO)

```bash
# 1. Backup configuración actual
cp -r /home/dangelojan/BSA/cosilium/.agents /home/dangelojan/BSA/cosilium/.agents.backup.$(date +%Y%m%d)

# 2. Verificar estado actual
ls -la /home/dangelojan/BSA/cosilium/.agents/
```

### FASE 1 — Renombrar y Estructurar Directorio Raíz

```bash
# 1. Renombrar .agents → .agent (singular, estándar Condominios)
mv /home/dangelojan/BSA/cosilium/.agents /home/dangelojan/BSA/cosilium/.agent

# 2. Crear estructura de carpetas faltantes
mkdir -p /home/dangelojan/BSA/cosilium/.agent/rules/design-system
mkdir -p /home/dangelojan/BSA/cosilium/.agent/rules/global-context
mkdir -p /home/dangelojan/BSA/cosilium/.agent/skills/git-branch-formatter
mkdir -p /home/dangelojan/BSA/cosilium/.agent/skills/git-commit-formatter
mkdir -p /home/dangelojan/BSA/cosilium/.agent/workflows
mkdir -p /home/dangelojan/BSA/cosilium/.bitacoras

# 3. Mover rules existentes a nueva estructura
mv /home/dangelojan/BSA/cosilium/.agent/rules/*.md /home/dangelojan/BSA/cosilium/.agent/rules/global-context/
# Nota: domain-rules.md, code-conventions.md, sync-architecture.md → global-context/
```

### FASE 2 — Crear Archivos de Reglas Base (CRÍTICOS)

#### 2.1 `checklist-verify.md` — **PRIORIDAD MÁXIMA**
```bash
# Crear en .agent/rules/checklist-verify.md
# Basado en Condominios Venezuela pero ADAPTADO a CONSILIUM:
# - Cambiar "client/server" → "packages/core, apps/*, rust/"
# - Cambiar "npm run build / npm run test" → comandos de CONSILIUM (typecheck, test, lint:conventions, cargo check)
# - Agregar validaciones DDD (dependencias hacia adentro), UI dumb, TDD, n8n diferido
# - Mantener: PLAN FIRST, STOPS, BUILDS GATE, ROOT CAUSE, PRE-FLIGHT, BITÁCORA, POST-FLIGHT, SECUENCIA FINAL
```

#### 2.2 `global-context/global-context.md` — **PRIORIDAD MÁXIMA**
```bash
# Tech Stack CONSILIUM:
# - Frontend: React 18, Vite, Tailwind, @consilium/ui, @consilium/core
# - Desktop: Tauri v2, Rust tauri-native
# - Mobile: Capacitor 6, Ionic, Rust wasm-engine
# - Core: TypeScript puro DDD, RxDB, WebCrypto
# - Contracts: GraphQL DTOs neutrales
# - Rust: wasm-engine (WASM), tauri-native (FFI)
# - Backend (fase 2): NestJS, GraphQL, BullMQ, PostgreSQL, MinIO
# Arquitectura: Monorepo Turborepo, DDD, offline-first, append-only
# Fuentes de verdad: RxDB local, PostgreSQL remoto, Object Storage binarios
```

#### 2.3 `global-context/development-invariants.md` — **PRIORIDAD ALTA**
```bash
# Adaptar de Condominios:
# - Soporte temático → CONSILIUM no tiene theme toggle (apps son shells)
# - Responsividad → Aplicar a apps/web, desktop, mobile
# - Seguridad → Validación server-side en fase 2, client-side offline-first
# - PLAN FIRST, STOPS, BUILDS GATE, APROBACIÓN, SECUENCIA FINAL → COPIAR EXACTO
# - ROOT CAUSE ANALYSIS → ADAPTAR a DDD (cadena: UI → Use Case → Domain → Infrastructure)
```

#### 2.4 `global-context/route-map.md` — **PRIORIDAD ALTA**
```bash
# Mapear rutas CONSILIUM:
# Apps: web (5173), desktop (5174), mobile (5175)
# Rutas principales por app (basadas en componentes UI existentes)
# API futura (fase 2): GraphQL endpoints, presigned URLs, BullMQ queues
```

#### 2.5 `global-context/technical-rules.md` — **PRIORIDAD ALTA**
```bash
# Adaptar Fullstack Integrity a DDD:
# - UI: dumb components (packages/ui) + Use Cases (core/application)
# - Domain: Aggregates + VOs + Ports
# - Infrastructure: Repositorios RxDB, WebCrypto, WASM bridge
# - Contratos: packages/contracts (GraphQL DTOs)
# Componentes públicos → dumb components en packages/ui/src/components/
```

#### 2.6 `global-context/self-maintenance.md` — **PRIORIDAD MÁXIMA**
```bash
# COPIAR casi exacto, adaptar matriz a CONSILIUM:
# - "Nuevo feature cross-cutting" → nueva capa DDD, nuevo use case, nuevo port
# - "Cambio stack" → turborepo, rust toolchain, rxdb version
# - "Nueva ruta" → route-map.md (cuando exista)
# - "Nueva regla desarrollo" → development-invariants.md
# - "Nuevo token/componente visual" → design-system/ (cuando exista)
# - "Cambio flujo Git" → AGENTS.md + git-workflow.md
# - "Nueva convención naming" → naming-conventions.md (skill + rule)
```

#### 2.7 `design-system/index.md` + submódulos — **PRIORIDAD MEDIA**
```bash
# CONSILIUM no tiene design system propio aún.
# Crear estructura mínima:
# - index.md: referencia a tokens futuros, regla "UI dumb = sin estilos propios"
# - colors.md: paleta CONSILIUM (por definir, usar neutros por ahora)
# - specs.md: dumb component specs (props/callbacks only)
# - ui-elements.md: DocumentRow, DocumentUploadList, DocumentStatusBadge, etc.
# - lists-tables.md: patrones de listas en outbox, documentos
# - migration-mapping.md: N/A (no hay legacy UI)
```

#### 2.8 Archivos restantes global-context
```bash
# naming-conventions.md → basado en skill naming-conventions + AGENTS.md nomenclatura
# accessibility.md → WCAG básico para dumb components
# local-deploy.md → protocolo deploy local CONSILIUM (npm run dev:web/desktop/mobile, cargo check)
# push-notifications.md → N/A (fase futura)
# reports-system.md → N/A (fase futura, sync reports)
```

### FASE 3 — Crear Skills Faltantes (CRÍTICOS)

#### 3.1 `.agent/skills/git-branch-formatter/SKILL.md`
```bash
# COPIAR exacto de Condominios Venezuela
# Tipos: feat, fix, refactor, docs, chore, hotfix
# Lowercase + kebab-case + <3 palabras + opcional #issue
```

#### 3.2 `.agent/skills/git-commit-formatter/SKILL.md`
```bash
# COPIAR exacto de Condominios Venezuela
# Conventional Commits: type[scope]: description (imperativo)
# Tipos: feat, fix, docs, style, refactor, perf, test, chore
# BREAKING CHANGE footer
```

### FASE 4 — Crear Workflow Completo

#### 4.1 `.agent/workflows/git-workflow.md`
```bash
# COPIAR estructura de Condominios Venezuela (127 líneas)
# ADAPTAR comandos de build:
# - Cliente: npm run typecheck && npm run build (workspaces)
# - Server: npm run test (cuando exista server fase 2)
# - Rust: cargo check --workspace && cargo test --workspace
# - Lint: npm run lint:conventions
# Mantener: 9 pasos, pre-flight, sync, branch, dev, builds, commit, push, STOP, secuencia final
```

### FASE 5 — Sistema de Bitácoras

#### 5.1 `.bitacoras/00-plantilla.md`
```bash
# COPIAR exacto de Condominios Venezuela
# Formato obligatorio para todas las bitácoras
```

#### 5.2 `.bitacoras/index.md`
```bash
# Crear con estado inicial CONSILIUM:
# - Tarea activa: (ninguna)
# - Última completada: Inicialización agentica
# - Branch actual: main
# - Historial: vacío (empezar desde #001)
```

#### 5.3 `.bitacoras/actual.md`
```bash
# Crear vacío con formato de 00-plantilla.md
# Estado inicial: 🟡 EN CURSO - Configuración agentica
```

### FASE 6 — Configuración de Agentes (opencode.json)

#### 6.1 `opencode.json` en raíz
```bash
# Crear basado en Condominios Venezuela, adaptado a CONSILIUM:
# - plan agent: lee AGENTS.md, .agent/rules/global-context/global-context.md, checklist-verify, bitacoras, git-workflow
# - build agent: mismo + design-system/index.md + tools write/edit/bash
# - code-reviewer: subagent, enfoque typecheck, cargo clippy, DDD boundaries, UI dumb
# Models: usar los disponibles en el entorno (no hardcodear minimax)
```

### FASE 7 — Actualizar AGENTS.md (Fusión)

```bash
# Fusionar AGENTS.md actual (40 líneas) con Condominios Venezuela (159 líneas)
# Resultado: ~180 líneas que incluya:
# 1. Reglas supremas CONSILIUM (DDD, TDD, UI dumb, Offline, n8n, Branding, Secrets, Skills)
# 2. Reglas supremas Condominios (PLAN FIRST, STOPS, BUILDS, APROBACIÓN, SECUENCIA FINAL, ROOT CAUSE, DEPLOY LOCAL)
# 3. Protocolo inicio (Triaje Exento/Trackeable, Pre-flight, Lectura obligatoria, Inicialización bitácora)
# 4. Ejecución (Exento vs Trackeable con bitácora viva)
# 5. Regla eficiencia (sin preámbulos, razonamiento cognitivo, comunicación estructurada, concisión, edición silenciosa)
# 6. Sources of truth (rules, skills, workflows, agents, tools)
```

### FASE 8 — Triggers always_on

```bash
# Agregar header a TODOS los archivos .md en .agent/rules/:
---
trigger: always_on
---
# Esto asegura carga automática en opencode
```

### FASE 9 — Validación Completa

```bash
# Ejecutar validación end-to-end:
cd /home/dangelojan/BSA/cosilium

# 1. Verificar estructura
tree .agent .bitacoras

# 2. Verificar AGENTS.md actualizado
cat AGENTS.md | head -50

# 3. Verificar checklist-verify existe y es accionable
cat .agent/rules/checklist-verify.md | head -30

# 4. Verificar skills git
cat .agent/skills/git-branch-formatter/SKILL.md
cat .agent/skills/git-commit-formatter/SKILL.md

# 5. Verificar workflow
cat .agent/workflows/git-workflow.md | head -30

# 6. Verificar opencode.json
cat opencode.json

# 7. Ejecutar quality gates CONSILIUM
npm run typecheck
npm run test
npm run lint:conventions
cargo check --workspace
cargo test --workspace
```

### FASE 10 — Primera Tarea de Prueba (Validación Real)

```bash
# Crear tarea de prueba "exenta" (configuración agentica):
# 1. Triaje: ÁMBITO EXENTO (cambios en .agent/, AGENTS.md)
# 2. Pre-flight: git status, rama actual
# 3. Lectura: AGENTS.md, global-context.md, checklist-verify.md, git-workflow.md
# 4. Plan: "Validar configuración agentica completa"
# 5. Ejecutar: npm run typecheck + npm run test + npm run lint:conventions + cargo check
# 6. Commit con git-commit-formatter
# 7. Push + PR a dev (si aplica)
# 8. Actualizar bitácora #001-configuracion-agentica
# 9. Post-flight: self-maintenance.md → verificar sin cambios
# 10. Confirmar completado
```

---

## 4. MAPEO DE REGLAS — CONDIVENCIOS VENEZUELA → CONSILIUM

| Regla Condominios | Equivalente/Adaptación CONSILIUM | Archivo Destino |
|-------------------|----------------------------------|-----------------|
| PLAN FIRST | **AGREGAR** como regla suprema #0 | AGENTS.md |
| STOPS POR FASE | **AGREGAR** como regla suprema #1 | AGENTS.md |
| BUILDS OBLIGATORIOS | **AGREGAR** (typecheck+test+lint+cargo) | AGENTS.md + checklist-verify.md |
| ROOT CAUSE ANALYSIS | **AGREGAR** adaptado a DDD layers | development-invariants.md + checklist-verify.md |
| DEPLOY LOCAL | **AGREGAR** protocolos dev:web/desktop/mobile | local-deploy.md |
| TRIAGE EXENTO/TRACKEABLE | **AGREGAR** protocolo completo | AGENTS.md + checklist-verify.md |
| BITÁCORA VIVA | **IMPLEMENTAR** sistema completo | .bitacoras/ + AGENTS.md |
| GIT WORKFLOW ESTRICTO | **IMPLEMENTAR** workflow 9 pasos | .agent/workflows/git-workflow.md |
| GIT BRANCH FORMATTER | **CREAR** skill | .agent/skills/git-branch-formatter/ |
| GIT COMMIT FORMATTER | **CREAR** skill | .agent/skills/git-commit-formatter/ |
| AUTO-MANTENIMIENTO | **CREAR** self-maintenance.md | global-context/self-maintenance.md |
| DESIGN SYSTEM | **CREAR** mínima (dumb components) | design-system/ |
| FULLSTACK INTEGRITY | **ADAPTAR** a DDD layers | technical-rules.md |
| NAMING CONVENTIONS | **UNIFICAR** skill + rule | naming-conventions.md + skill |
| TRIGGERS ALWAYS_ON | **AGREGAR** a todos los .md rules | .agent/rules/**/*.md |

---

## 5. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Romper DDD boundaries al agregar rules | Media | Alto | Validar con `npm run lint:conventions` + grep dependencias inversas |
| Conflictos naming CONSILIUM vs Condominios | Baja | Medio | Unificar en naming-conventions.md (PascalCase/camelCase ya definido) |
| Skills existentes (8) vs nuevas (2) | Baja | Bajo | Mantener skills DDD/TDD, solo agregar git skills |
| Bitácoras interfieren con workflow actual | Media | Medio | Empezar con tarea exenta #001, validar antes de trackeables |
| opencode.json conflictúa con agentes actuales | Baja | Medio | Probar agents plan/build/review en tarea real antes de commit |
| Triggers always_on cargan todo siempre | Baja | Rendimiento | Solo 15-20 archivos .md, carga negligible |

---

## 6. CHECKLIST FINAL DE MIGRACIÓN

- [ ] **FASE 0** Backup completado
- [ ] **FASE 1** Directorio renombrado `.agents` → `.agent` + estructura carpetas
- [ ] **FASE 2** 14 archivos rules creados/adaptados (checklist-verify, global-context/*, design-system/*)
- [ ] **FASE 3** 2 skills git creadas (branch-formatter, commit-formatter)
- [ ] **FASE 4** 1 workflow git creado (git-workflow.md completo)
- [ ] **FASE 5** Sistema bitácoras creado (plantilla, index, actual)
- [ ] **FASE 6** opencode.json creado con 3 agentes
- [ ] **FASE 7** AGENTS.md fusionado (reglas supremas + protocolo + sources)
- [ ] **FASE 8** Triggers `always_on` agregados a todos los .md de rules
- [ ] **FASE 9** Validación técnica completa (typecheck, test, lint, cargo) → **0 errores**
- [ ] **FASE 10** Tarea de prueba #001 ejecutada y bitácora cerrada ✅

---

## 7. COMANDOS DE VERIFICACIÓN POST-MIGRACIÓN

```bash
# Estructura final esperada
/home/dangelojan/BSA/cosilium/
├── .agent/
│   ├── rules/
│   │   ├── checklist-verify.md
│   │   ├── design-system/
│   │   │   ├── index.md
│   │   │   ├── colors.md
│   │   │   ├── lists-tables.md
│   │   │   ├── migration-mapping.md
│   │   │   ├── specs.md
│   │   │   └── ui-elements.md
│   │   └── global-context/
│   │       ├── index.md
│   │       ├── global-context.md
│   │       ├── development-invariants.md
│   │       ├── route-map.md
│   │       ├── technical-rules.md
│   │       ├── naming-conventions.md
│   │       ├── accessibility.md
│   │       ├── local-deploy.md
│   │       ├── push-notifications.md
│   │       ├── reports-system.md
│   │       └── self-maintenance.md
│   ├── skills/
│   │   ├── git-branch-formatter/SKILL.md
│   │   ├── git-commit-formatter/SKILL.md
│   │   ├── ddd-structured-development/SKILL.md
│   │   ├── tdd-workflow/SKILL.md
│   │   ├── ui-dumb-components/SKILL.md
│   │   ├── rust-wasm-processing/SKILL.md
│   │   ├── offline-sync/SKILL.md
│   │   ├── react-tauri-capacitor/SKILL.md
│   │   ├── naming-conventions/SKILL.md
│   │   └── graphql-contracts/SKILL.md
│   └── workflows/
│       └── git-workflow.md
├── .bitacoras/
│   ├── 00-plantilla.md
│   ├── index.md
│   └── actual.md
├── opencode.json
├── AGENTS.md (fusionado ~180 líneas)
└── ... resto del proyecto
```

---

## 8. NOTAS DE ADAPTACIÓN CLAVE

1. **NO copiar ciegamente** — Cada archivo de Condominios Venezuela debe adaptarse a la realidad DDD/TDD/offline/Rust de CONSILIUM
2. **Mantener skills existentes** — Los 8 skills de CONSILIUM son superiores para el dominio técnico; solo agregar git skills
3. **Triggers always_on** — Esencial para que opencode cargue automáticamente las rules
4. **Bitácoras = memoria viva** — El agente debe leer `.bitacoras/actual.md` ANTES de cada tarea (regla en AGENTS.md)
5. **PLAN FIRST es inquebrantable** — Ningún código sin plan aprobado, sin excepciones
6. **Builds gate = typecheck + test + lint + cargo** — 4 comandos, todos deben pasar antes de commit
7. **Self-maintenance post-flight** — Actualizar configuración agentica DESPUÉS de cada tarea completada, basado en lo QUE SE CONSTRUYÓ, no lo planeado

---

**Fin del documento.** Esta guía permite implementar la configuración agentica completa de Condominios Venezuela en CONSILIUM preservando la arquitectura DDD/TDD/offline existente y agregando la disciplina de ejecución, bitácoras, git workflow y auto-mantenimiento que hacen robusto al sistema Condominios.