---
trigger: always_on
---
# Convenciones de Naming — Referencia

> **Este archivo es solo una referencia.** La regla canónica vive en el skill `naming-conventions` y en `AGENTS.md` §Nomenclatura. No duplicar.

## Reglas (CONSILIUM)

| Tipo | Convención | Ejemplos |
|------|------------|----------|
| Componentes React | PascalCase | `DocumentUploadList.tsx`, `DocumentRow.tsx` |
| Clases de Dominio / Aggregates / VOs | PascalCase | `DocumentAggregate.ts`, `FileHash.ts`, `DocumentId.ts` |
| Interfaces / Types / Ports | PascalCase | `DocumentRepositoryPort.ts`, `DocumentMetadata.ts` |
| Structs Rust | PascalCase | `struct DocumentPayload` |
| Tipos GraphQL / DTOs | PascalCase | `DocumentPayload`, `UploadResult` |
| Variables, funciones, instancias, utilidades | camelCase | `queueDocumentForUpload`, `fakeFile`, `userId` |
| Archivos que **no** exportan componentes/clases | camelCase | `queueDocumentForUpload.ts`, `useCases.ts` |
| Paquetes npm | `@consilium/*` (minúsculas) | `@consilium/core`, `@consilium/ui` |
| Use Cases | `<Verb>…UseCase` | `QueueDocumentForUploadUseCase.ts` |
| Ports | `<Noun>Port` | `DocumentRepositoryPort.ts` |
| Estados Outbox | `UPPER_SNAKE_CASE` | `PENDING`, `PENDING_UPLOAD`, `UPLOADED`, `FAILED` |

## Prohibido
- Crear archivo `naming-conventions.md` con reglas completas (duplicado).
- Usar `snake_case` en código TypeScript/Rust (salvo estados outbox).
- Mezclar convenciones en el mismo archivo.

## Referencia Canónica
- Skill: `.agent/skills/naming-conventions/SKILL.md`
- `AGENTS.md` sección **Nomenclatura** (líneas 37‑40).