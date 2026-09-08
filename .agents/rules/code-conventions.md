# Convenciones de Código — CONSILIUM

## Monorepo
- npm workspaces: `packages/*` (core, contracts, ui), `apps/*` (web, desktop,
  mobile), `server`, `rust`.
- Paquetes públicos: `@consilium/*`. Builds vía turborepo. Typecheck con `tsc --noEmit`.
- Rust: workspace con `wasm-engine` (web/mobile) y `tauri-native` (desktop).

## Capas (nunca invertir dependencias)
- `@consilium/core` = DDD (domain + application + infrastructure). **No**
  depende de React, UI, ni del servidor.
- `@consilium/contracts` = DTOs/tipos GraphQL neutrales (no transportes).
- `@consilium/ui` = componentes "tontos" (solo props/callbacks, sin lógica de negocio).
- `apps/*` = composición: traen datos, instancian use cases y caben en la UI.
- `server` = adapters remotos de los puertos de core (fase 2).
- `rust/*` = procesamiento pesado (hash, binarización, compresión) con FFI/WASM.

## Archivos
- Un agregado/use case/port por archivo.
- Tests junto a `src/`, espejados: `__tests__/<capa>/<Nombre>.test.ts`.
- Nombres en inglés, español solo en comentarios/strings de UI.

## TypeScript
- `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `isolatedModules`.
- Sin `any` en dominios; en UI se permite cast puntual con tipo.
- Valores `string | null` explícitos; estado vacío explícito.

## Rust
- `cargo fmt` y `cargo clippy` sin warnings en CI.
- Guardas para tipos no permitidos; helpers solo-test con `#[cfg(test)]`.
- Ayudantes que regresan `Result` o `WasmError` (nunca panics cruzando FFI).

## Reglas transversales
1. **Sin comentarios de código innecesarios** — solo doc bloque de propósito
   y contratos de los módulos públicos.
2. `console.*` no se usa en `packages/*` (solo en apps).
3. Las dependencias apuntan siempre hacia adentro (core no importa a apps).
4. Toda credencial en variables de entorno, nunca en el repo.