---
trigger: always_on
---
# Reglas Técnicas — Fullstack Integrity adaptado a DDD (CONSILIUM)

## 1. Fullstack Integrity Check (DDD)
Toda funcionalidad **debe** implementarse respetando las 4 capas:

| Capa | Responsabilidad | Archivos típicos |
|------|----------------|------------------|
| **UI** (`packages/ui`, `apps/*`) | Dumb components: solo `props` + `callbacks`. Sin lógica de negocio, sin fetch, sin imports de `@consilium/core`. | `DocumentUploadList.tsx`, `DocumentRow.tsx`, `DocumentStatusBadge.tsx` |
| **Application** (`core/application`) | Use Cases (`*UseCase.ts`). Orquestan: validan entrada, llaman puertos, devuelven resultado. No contienen lógica de dominio. | `QueueDocumentForUploadUseCase.ts`, `SynchronizePendingDocumentsUseCase.ts` |
| **Domain** (`core/domain`) | Aggregates, Value Objects, Invariants, Ports (interfaces). **TS puro**, cero deps externas. | `DocumentAggregate.ts`, `FileHash.ts`, `DocumentId.ts`, `ports/DocumentRepositoryPort.ts` |
| **Infrastructure** (`core/infrastructure`) | Implementaciones reales de Ports: RxDB repos, WebCrypto/WASM hashers, FS adapters. | `RxDBDocumentRepository.ts`, `WebCryptoDocumentHasher.ts`, `WasmImageProcessor.ts` |
| **Contracts** (`packages/contracts`) | DTOs GraphQL neutrales, sin transporte. | `src/graphql/generated-types.ts` |

**Prohibido**:
- Lógica de dominio en UI o Application.
- Imports de `@consilium/core` en `packages/ui`.
- `fetch` / `axios` / estado de red en componentes dumb.
- Mutar estado de aggregate fuera de sus métodos.

## 2. Componentes Públicos Reutilizables (UI Dumb)
- Todo componente en `packages/ui/src/components/` debe ser **dumb**: solo `props` + `callbacks`.
- Exportar tipos `*Payload` y `*Props` para consumidores.
- Ejemplo canónico: `DocumentUploadList.tsx` (ver skill `ui-dumb-components`).
- No estilos propios – consumen tokens globales (por definir) o clases CSS externas.

## 3. Validación de Formularios / Entradas
- Validación **en Domain** (Value Objects, Aggregate methods) – invariants puros.
- UseCase valida entrada básica (tipos, requeridos) y delega invariants a Domain.
- Infrastructure no valida reglas de negocio.

## 4. Modularidad y Accesibilidad
- Delegar accesibilidad en primitivas (`@radix-ui` si se usa) – no implementar desde cero.
- WCAG AA mínimo para componentes dumb (contraste, foco, aria). Ver `accessibility.md`.

## 5. Convenciones de Archivos y Nomenclatura
- Un aggregate / use case / port por archivo.
- Tests espejo en `__tests__/<capa>/<Nombre>.test.ts`.
- PascalCase: componentes, clases, VOs, interfaces, tipos GraphQL.
- camelCase: variables, funciones, archivos no exportables.
- Ver skill `naming-conventions` y `AGENTS.md` §Nomenclatura.

## 6. Referencias
- `development-invariants.md` (Root Cause Analysis, TDD, PLAN FIRST).
- `sync-architecture.md` (outbox, presigned URL, hash dedup).
- `code-conventions.md` (strict TS, Rust fmt/clippy).
- ADR‑0002 Append-only, ADR‑0003 Outbox, ADR‑0007 Presigned URL.