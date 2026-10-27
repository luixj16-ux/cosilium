---
trigger: always_on
---
# Contexto Global y Reglas Maestras — CONSILIUM

## 1. Visión del Proyecto
Sistema de gestión de expedientes digital (offline-first, append-only) para tribunales/despachos con red intermitente. El dispositivo es fuente de verdad; la nube solo confirma.

## 2. Tech Stack
- **Monorepo**: Turborepo (`turbo.json`), npm workspaces (`packages/*`, `apps/*`, `server`, `rust/`).
- **Core**: `@consilium/core` – TypeScript puro DDD (domain, application, infrastructure). RxDB (IndexedDB), WebCrypto (hash web), WASM bridge (desktop/mobile).
- **UI**: `@consilium/ui` – React 18 + Vite, dumb components only.
- **Apps**: `apps/web` (SPA, puerto 5173), `apps/desktop` (Tauri v2, puerto 5174), `apps/mobile` (Capacitor 6 / Ionic, puerto 5175).
- **Contracts**: `@consilium/contracts` – DTOs GraphQL neutrales.
- **Rust workspace**: `rust/wasm-engine` (binarización, compresión, SHA‑256 → WASM), `rust/tauri-native` (FS watch/ingest nativo).
- **Backend (fase 2)**: NestJS + GraphQL + BullMQ (Redis) + PostgreSQL + MinIO (S3-compatible). Diferido.

## 3. Arquitectura (4 capas DDD)
```
UI (apps/*, packages/ui)          ← dumb components, solo props/callbacks
   ↓
Application (core/application)    ← UseCases (*UseCase.ts), orquestan puertos
   ↓
Domain (core/domain)              ← Aggregates, VOs, invariants, ports (interfaces)
   ↓
Infrastructure (core/infrastructure) ← RxDB repos, WebCrypto/WASM adapters, FS
```
**Dependencias**: solo hacia adentro. `Domain` = TS puro, cero deps externas.

## 4. Fuentes de Verdad
- **Local**: RxDB (`document_outbox` collection) – metadatos + estados.
- **Remoto**: PostgreSQL (metadatos confirmados), Object Storage (binarios via presigned URL).
- **Contratos**: `@consilium/contracts` (GraphQL DTOs) + `docs/integrations/*.contract.md` (n8n futuro).

## 5. Convenciones Clave
- **Naming**: PascalCase (componentes, clases, VOs, interfaces, tipos GraphQL); camelCase (variables, funciones, archivos no exportables). Ver skill `naming-conventions`.
- **Estados Outbox**: `PENDING` → `PENDING_UPLOAD` → `UPLOADED` | `FAILED` (reintentable). Ver `sync-architecture.md`.
- **Append-only**: Nunca mutar registro; corrección = nuevo registro + hash.
- **TDD**: Red → Green → Refactor (Vitest + cargo test). Mocks de red en `__tests__/mocks/`.

## 6. Agentes y Herramientas
- **opencode.json** define 3 agentes: `plan` (read-only), `build` (read/write), `code-reviewer` (subagent).
- **Skills** (10): 8 técnicas (ddd, tdd, ui-dumb, rust-wasm, offline-sync, react-tauri-capacitor, naming, graphql) + 2 git (branch-formatter, commit-formatter).
- **Workflow**: `git-workflow.md` (9 pasos, builds gate, commit directo en `dev`).

## 7. Referencias
- ADRs: `docs/adr/0001`–`0007`.
- Arquitectura: `docs/architecture/overview.md`.
- Contratos n8n: `docs/integrations/ingestion.contract.md`, `notifications.contract.md`.
- Reglas de sync: `.agent/rules/sync-architecture.md`.
- Convenciones código: `.agent/rules/code-conventions.md` (movido a global-context).
- Reglas dominio: `.agent/rules/domain-rules.md` (movido a global-context).