# CONSILIUM — Guía de Agente

> **Versión fusionada** – Reglas supremas de ejecución (Condominios) + Reglas de arquitectura DDD/TDD/Offline (CONSILIUM).

---

## 0️⃣ REGLAS SUPREMAS DE EJECUCIÓN — NO NEGOCIABLES

### 0.1 PLAN FIRST — Antes de cualquier código
- **DEBES** crear un plan detallado de la tarea y **MOSTRARLO** al usuario.
- **DEBES ESPERAR** su aprobación explícita antes de escribir una sola línea de código.
- Sin plan aprobado → NO hay código. **No hay excepciones.**

### 0.2 STOPS POR FASE
- Cada fase de implementación **DEBE** terminar con un STOP.
- En el STOP debes: mostrar resumen → ejecutar builds gate → esperar aprobación.
- No puedes avanzar sin aprobación explícita. **No hay excepciones.**

### 0.3 BUILDS GATE CONSILIUM (6 comandos, todos deben pasar)
Antes de **CADA** commit:
```bash
npm run typecheck      # 0 errores TS
npm run test           # todas las suites Vitest + cargo test
npm run lint:conventions
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
```
Si alguno falla → **NO HACES COMMIT**. Corriges primero.

### 0.4 APROBACIÓN EXPLÍCITA DEL USUARIO
- Ninguna fase, commit, cambio ni tarea se da por **completado** sin mi aprobación.
- "Completado" = yo lo digo, no el agente.
- Hasta que no reciba confirmación, la tarea sigue **EN CURSO**.

### 0.5 SECUENCIA FINAL OBLIGATORIA
Al terminar **TODAS** las fases:
1. **ESPERAR** confirmación del usuario de que la TAREA ESTÁ COMPLETADA.
2. **ACTUALIZAR BITÁCORAS** (`index.md` + `actual.md` + crear `#XXX-tarea.md`).
3. **AUTO-MANTENIMIENTO (Post-Flight)** — según `.agent/rules/global-context/self-maintenance.md`.
4. **CREAR PULL REQUEST HACIA `dev`** — siguiendo `.agent/workflows/git-workflow.md` (rama de trabajo → PR → merge a `dev`). **NUNCA commit directo en `dev` ni en `main`**.

### 0.6 ROOT CAUSE ANALYSIS OBLIGATORIO
> Parchear síntomas sin causa raíz genera iteraciones infinitas.
> **Para bugs/fixes:** Mapear cadena UI→UseCase→Domain→Infra, diagnosticar cada nodo, proponer 1 solución a causa raíz, validar sin regresiones.
> **Para features:** Mapear impacto, analizar patrón existente, cadena de dependencias UI→UseCase→Domain→Infra, validar en todos targets.

### 0.7 DEPLOY LOCAL — Protocolo obligatorio
Ver `.agent/rules/global-context/local-deploy.md`. Antes de cualquier deploy: verificar BD, no ejecutar `first-seed.mjs` sobre BD poblada, no `docker rm -f` sobre BD con datos.

### 0.8 SIN CONTRADICCIÓN
Estas reglas **complementan** las de arquitectura CONSILIUM. Si hay conflicto, prevalece la más estricta. Ambiguedad → preguntar al usuario.

---

## 1️⃣ REGLAS DE ARQUITECTURA CONSILIUM (DDD/TDD/Offline) — NO NEGOCIABLES

1. **DDD**: Capas y direcciones en `.agent/rules/global-context/development-invariants.md` y `.agent/rules/global-context/technical-rules.md`. Dependencias **hacia adentro**: Domain → Application → Infrastructure → UI.
2. **TDD**: Red → Green → Refactor. Tests **antes** que código (Vitest + cargo test). Mocks de red en `packages/core/__tests__/mocks/`.
3. **UI dumb**: `packages/ui` no importa `@consilium/core` ni rutas. Solo `props` + `callbacks`. Ver `.agent/rules/design-system/specs.md`.
4. **Offline**: Cliente nunca espera red para crear/encolar. Ver `.agent/rules/global-context/sync-architecture.md`.
5. **n8n diferido**: NADA de n8n hoy. Solo `.agent/n8n-future/FUTURE_README.md` y contratos en `docs/integrations/*.contract.md`.
6. **Branding**: Prosa = CONSILIIUM (doble I); dirs/packages = CONSILIUM (una I).
7. **Zero secrets**: Credenciales solo por variables de entorno.
8. **Skills**: Consultar `.agent/skills/` (10 skills) antes de tocar cada capa.

---

## 2️⃣ PROTOCOLO DE INICIO Y GESTIÓN DE MEMORIA

### 2.1 Clasificación del Ámbito (Triaje)
- **EXENTO**: Cambios en `.gitignore`, `.agent/`, `.opencode/`, `AGENTS.md`, `opencode.json`, docs, config, pruebas locales.
- **TRACKEABLE**: Código fuente (`packages/`, `apps/`, `rust/`, `server/`), assets, DB, config prod.

### 2.2 VERIFICACIÓN OBLIGATORIA (Antes de proceder — **NO SALTAR**)
Para **cualquier tarea** (Exenta o Trackeable):
1. **PRE-FLIGHT**: `git status` → confirmar rama `dev`. (Nunca trabajar en `main`).
2. **LECTURA OBLIGATORIA**:
   - `AGENTS.md` (este archivo)
   - `.agent/rules/global-context/global-context.md`
   - `.agent/rules/checklist-verify.md`
   - `.agent/workflows/git-workflow.md`
3. **INICIALIZACIÓN BITÁCORA** (solo TRACKEABLE):
   - Usar `@git-branch-formatter` para nombre de la rama de trabajo.
   - Crear `.bitacoras/###-nombre-tarea.md` **ANTES** de escribir código (plantilla `00-plantilla.md`).
   - NO escribir código hasta que bitácora exista.
4. **PROCEDER** solo tras completar pasos anteriores.

### 2.3 Ejecución y Sincronización
- **EXENTA**: Omitir workflow Git/Bitácora. Presentar plan → aprobación → ejecutar.
- **TRACKEABLE**: 
  1. Leer `.bitacoras/index.md` y `.bitacoras/actual.md`.
  2. Al aprobar plan → actualizar `.bitacoras/actual.md` a `🟡 EN CURSO`.
  3. **Actualizar `actual.md` en tiempo real** tras cada hito (checks `[x]`, punto de control).
  4. Al finalizar → `✅ COMPLETADO`, archivar, limpiar `actual.md` (mantener formato plantilla).
  5. **POST-FLIGHT** (self-maintenance.md) → actualizar configs si aplica.
  6. Seguir `.agent/workflows/git-workflow.md` (rama de trabajo → PR → merge a `dev`).

---

## 3️⃣ REGLAS DE EFICIENCIA Y RAZONAMIENTO
1. **Sin Preámbulos**: No confirmes lecturas ni saludes. Si Trackeable, lee en silencio y actúa.
2. **Razonamiento Cognitivo**: Antes de cambios complejos, bloque `> [Pensamiento Técnico]`. Explica *porqué* estratégico, patrones, riesgos.
3. **Comunicación Estructurada**: Tablas, listas, bloques de código. Información escaneable.
4. **Concisión Técnica Senior**: Lenguaje directo. Cero explicaciones básicas salvo que se solicite.
5. **Edición Silenciosa**: Actualiza `actual.md` sin anunciar cada edición, salvo que cambie el plan.

---

## 4️⃣ SOURCES OF TRUTH & TOOLS

| Tipo | Archivo / Skill |
|------|-----------------|
| **Reglas globales** | `.agent/rules/global-context/global-context.md` |
| **Invariantes desarrollo** | `.agent/rules/global-context/development-invariants.md` |
| **Rutas apps/API** | `.agent/rules/global-context/route-map.md` |
| **Reglas técnicas DDD** | `.agent/rules/global-context/technical-rules.md` |
| **Naming** | Skill `naming-conventions` + `AGENTS.md` §Nomenclatura |
| **Accesibilidad** | `.agent/rules/global-context/accessibility.md` |
| **Deploy local** | `.agent/rules/global-context/local-deploy.md` |
| **Self-maintenance** | `.agent/rules/global-context/self-maintenance.md` |
| **Checklist verificación** | `.agent/rules/checklist-verify.md` |
| **Git workflow** | `.agent/workflows/git-workflow.md` |
| **Design System** | `.agent/rules/design-system/` |
| **Skills (10)** | `.agent/skills/` (ddd, tdd, ui-dumb, rust-wasm, offline-sync, react-tauri-capacitor, naming, graphql, git-branch, git-commit) |
| **Agentes opencode** | `opencode.json` → `plan` / `build` / `code-reviewer` |
| **Tools** | `@git-branch-formatter`, `@git-commit-formatter` |

---

## 5️⃣ NOMENCLATURA (CONSILIUM)
- **Estados**: `PENDING`, `PENDING_UPLOAD`, `UPLOADED`, `FAILED`.
- **Paquetes**: `@consilium/*`.
- **Use Cases**: `<Verb>…UseCase` (ej. `QueueDocumentForUploadUseCase`).
- **Ports**: `<Noun>Port` (ej. `DocumentRepositoryPort`).
- **Branding**: Prosa = CONSILIIUM (doble I); dirs/packages = CONSILIUM (una I).

---

## 6️⃣ COMANDOS PRINCIPALES
```bash
# Desarrollo
npm run dev:web        # Web (5173)
npm run dev:desktop    # Tauri dev (5174)
npm run dev:mobile     # Capacitor (5175)

# Calidad (SIEMPRE antes de commit)
npm run typecheck      # TS strict all workspaces
npm run test           # Vitest + cargo test
npm run test:core      # Solo core (rápido)
npm run lint:conventions
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
```

---

**Fin de AGENTS.md** — Este archivo es la **única guía de comportamiento** para cualquier agente en CONSILIUM.