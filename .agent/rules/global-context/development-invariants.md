---
trigger: always_on
---
# Invariantes de Desarrollo — CONSILIUM

Reglas que TODO desarrollo debe cumplir sin excepción.

## 1. Arquitectura DDD – Dependencias Hacia Adentro
- **Domain**: TS puro, cero deps externas (ni React, ni RxDB, ni fetch). Solo lógica de negocio, VOs, aggregates, ports.
- **Application**: Depende de Domain. Define UseCases y Ports (interfaces). No contiene lógica de negocio.
- **Infrastructure**: Implementa Ports. Detalles RxDB, WebCrypto, WASM bridge, FS (Tauri/Capacitor).
- **UI (apps/*, packages/ui)**: Dumb components only. Reciben props, emiten callbacks. **Nunca** importan `@consilium/core`, ni rutas, ni fetch, ni estado de red.

## 2. TDD Obligatorio (Red → Green → Refactor)
- Tests **antes** que código (Vitest para TS, `cargo test` para Rust).
- Ubicación: `__tests__/<capa>/<Nombre>.test.ts` (espejo de `src/`).
- Mocks de red en `packages/core/__tests__/mocks/` para simular offline.
- Plantilla canónica (ver `checklist-verify.md` y skill `tdd-workflow`).

## 3. UI Dumb – Props + Callbacks Only
- Componentes en `packages/ui/src/components/`.
- Exportan tipos `*Payload`, `*Props` para consumidores.
- Ejemplo canónico: `DocumentUploadList.tsx` (ver skill `ui-dumb-components`).
- Prohibido: `import … from '@consilium/core'`, `fetch`, `useEffect` de red, `useState` de conectividad.

## 4. Offline-First / Append-Only
- Cliente **nunca** espera red para crear/encolar (ver `sync-architecture.md`).
- Outbox local (`document_outbox` en RxDB) – FIFO, estados `PENDING` → `PENDING_UPLOAD` → `UPLOADED` | `FAILED`.
- Hash SHA‑256 (WebCrypto web / WASM desktop/mobile) para deduplicación.
- Presigned URL → PUT directo a Object Storage (S3/MinIO). Server solo metadatos.

## 5. Root Cause Analysis (Obligatorio ANTES de cualquier fix/feature)
> Nacido de debugging de layout: parchear síntoma sin causa raíz = iteraciones infinitas.

### 5.1 Para BUGS / FIXES
1. **MAPEO DE CADENA COMPLETA**: Identificar TODOS los nodos desde UI raíz hasta síntoma.
   - Cadena típica: `UI (dumb) → UseCase (Application) → Aggregate/VO (Domain) → Repository/Adapter (Infrastructure)`.
2. **DIAGNÓSTICO DE CAUSA RAÍZ**: Para cada nodo responder:
   - ¿Tiene `overflow`? ¿Tipo?
   - ¿Tiene `flex-1` / `flex-shrink-0` / `min-h-0`?
   - ¿Crece libremente o está constreñido por padre flex?
3. **HIPÓTESIS FUNDAMENTADA**: Una solución que ataque la causa raíz, justificada con evidencia del mapeo.
4. **VALIDACIÓN**: Fix resuelve bug SIN regresiones en otros componentes que usen mismos nodos.

### 5.2 Para FEATURES / MEJORAS
1. **MAPEO DE IMPACTO**: Componentes, rutas, patrones que interactúan con la nueva implementación.
2. **ANÁLISIS DE PATRÓN**: ¿Existe ya en el proyecto? Reutilizar; si no, documentar por qué nuevo.
3. **CADENA DE DEPENDENCIAS**: UI → Redux/State → API → Modelo (adaptado a DDD: UI → UseCase → Domain → Infra). Verificar integridad en cada nodo.
4. **VALIDACIÓN**: Funciona en todos los targets (web/desktop/mobile) y modos sin romper existentes.

### 5.3 ⛔ Prohibiciones Derivadas
- **PROHIBIDO** parchear un nivel sin verificar todos los niveles de la cadena.
- **PROHIBIDO** asumir que `overflow-hidden` / `flex-1` es "decorativo" sin analizar impacto.
- **PROHIBIDO** fixes iterativos sin mapear cadena completa primero.

## 6. PLAN FIRST, STOPS, BUILDS GATE, SECUENCIA FINAL
- **PLAN FIRST**: Plan detallado → mostrar → esperar aprobación → **solo entonces** código.
- **STOPS POR FASE**: Cada fase termina con build gate + aprobación usuario.
- **BUILDS GATE CONSILIUM** (6 comandos, todos deben pasar):
  1. `npm run typecheck`
  2. `npm run test`
  3. `npm run lint:conventions`
  4. `cargo check --workspace`
  5. `cargo test --workspace`
  6. `cargo check --workspace --target wasm32-unknown-unknown`
- **SECUENCIA FINAL** (tras última fase):
  1. Confirmación explícita usuario → 2. Actualizar bitácoras → 3. Self-maintenance → 4. Commit directo en `dev` (sin PR).

## 7. n8n Diferido
- **Cero** flujos n8n hoy. Contratos neutros JSON en `docs/integrations/*.contract.md`.
- Cuando se reactive: consultar skills n8n (`.agents/n8n-skills/`) y validación multi-nivel.

## 8. Convenciones de Código (Ver `code-conventions.md`)
- `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `isolatedModules`.
- Sin `any` en dominio; en UI cast puntual con tipo.
- `cargo fmt` && `cargo clippy` sin warnings en CI.
- Archivos: un aggregate/use case/port por archivo. Tests espejo en `__tests__/`.

## 9. Referencias
- `global-context.md` (tech stack, arquitectura).
- `technical-rules.md` (Fullstack Integrity → DDD).
- `sync-architecture.md` (outbox, presigned URL, hash dedup).
- `checklist-verify.md` (gate pre-tarea).
- Skills: `ddd-structured-development`, `tdd-workflow`, `ui-dumb-components`, `rust-wasm-processing`, `offline-sync`, `react-tauri-capacitor`.