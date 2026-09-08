# CONSILIUM — Guía de Agente

Este repo reestructurado implementa **CONSILIUM: Gestión de Expedientes Digital**
(monorepo DDD/TDD, offline-first, append-only). Spec ejecutable:
`MASTER_INIT_PROMPT.md`. Docs maestros: `CONSILIUM.md` y `CONSILIUM_RULES.md`.

## Estructura
- `packages/core` — DDD: domain + application + infrastructure (RxDB, WebCrypto).
- `packages/contracts` — DTOs + tipos GraphQL neutrales (shared).
- `packages/ui` — componentes React "tontos" (dumb).
- `apps/web`, `apps/desktop` (Tauri), `apps/mobile` (Capacitor) — shells Vite.
- `server` — backend fase 2 (diferido): schema GraphQL + BullMQ outbox.
- `rust/` — workspace: `wasm-engine` (FFI web/mobile), `tauri-native` (desktop).
- `legacy/` — demo anterior conservada por decisión del usuario (no tocar).

## Comandos
- `npm run typecheck` / `npm run test` / `npm run lint` (workspaces).
- `npm run test:core` — suite del Core (vitest).
- `npm run lint:conventions` — checker estructural (`node .agents/scripts/check-conventions.mjs`).
- Rust: `cargo check --workspace`, `cargo check --workspace --target wasm32-unknown-unknown`,
  `cargo test --workspace` (con `$HOME/.cargo/bin` en PATH).

## Reglas de trabajo (no negociables)
1. **DDD**: capas y direcciones descritas en `.agents/rules/domain-rules.md`.
2. **TDD**: red → green → refactor; fakes en `packages/core/__tests__/mocks/`.
3. **UI dumb**: `packages/ui` no importa `@consilium/core` ni rutas.
4. **Offline**: el cliente nunca espera red para crear/encolar (ver
   `.agents/rules/sync-architecture.md`).
5. **n8n diferido**: NADA de n8n se construye hoy. Solo `.agents/n8n-future/`
   (FUTURE_README) y contratos en `docs/integrations/*.contract.md`.
6. **Branding**: marca CONSILIIUM; dirs/packages CONSILIUM (una I).
7. **Sin secrets en el repo**; credenciales solo por variables de entorno.
8. Consulta las skills de `.agents/skills/` (ddd, tdd, offline-sync,
   rust-wasm, ui-dumb, react-tauri-capacitor, naming, graphql-contracts)
   antes de tocar cada capa.

## Nomenclatura
- Estados: `PENDING`, `PENDING_UPLOAD`, `UPLOADED`, `FAILED`.
- Paquetes `@consilium/*`; use cases `<Verb>...UseCase`; ports `<Noun>Port`.
- Prosa/branding usa CONSILIIUM (doble I) — no "corregirlo".