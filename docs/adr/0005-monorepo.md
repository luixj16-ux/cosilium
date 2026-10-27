# ADR-0005 · Monorepo (npm workspaces + turborepo)

Estado: **Aceptado**. Fecha: 2026.

## Contexto
El proyecto tiene core DDD reutilizable, contratos compartidos, UI tonta y 3
shells + backend + Rust. Sin monorepo, la sincronización de tipos/versionado
sería manual y frágil.

## Decisión
- Monorepo npm: `packages/*` (core, contracts, ui), `apps/*` (web, desktop,
  mobile), `server`, `rust/`.
- Turborepo para caching de `build`/`typecheck`/`test`/`lint`.
- `typescript` y `@types/node` hoistados en la raíz; `tsconfig.base.json`
  compartido.
- Rust en un workspace paralelo (`rust/Cargo.toml`).

## Consecuencias
- Un solo `npm install` trae todo el TS; `cargo check` cubre todo Rust.
- Cambios en `@consilium/core` se validan en toda la superficie (typecheck en
  apps que lo importan).
- Riesgo: dependencias comunes globales (controlado con versiones fijas).
- Habilita el `lint:conventions` estructural global (check-conventions.mjs).