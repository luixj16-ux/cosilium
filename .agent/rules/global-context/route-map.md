---
trigger: always_on
---
# Mapa de Rutas — CONSILIUM

## Apps (Vite shells)

| App | Puerto | Comando dev | Build release |
|-----|--------|-------------|---------------|
| `apps/web` | 5173 | `npm run dev:web` | `npm run build --workspace @consilium/web` |
| `apps/desktop` | 5174 | `npm run dev:desktop` (`tauri dev`) | `npm run tauri --workspace @consilium/desktop -- build` |
| `apps/mobile` | 5175 | `npm run dev:mobile` (`capacitor run`) | `npm run build --workspace @consilium/mobile && npx cap sync` |

## Rutas Principales (UI actual – dumb components)

| Ruta | Descripción | Componente principal |
|------|-------------|----------------------|
| `/` | Home / Dashboard | `DocumentUploadList`, `DocumentRow` |
| `/documents` | Lista de documentos (outbox) | `DocumentUploadList` |
| `/documents/:id` | Detalle documento | `DocumentRow`, `DocumentStatusBadge` |
| `/settings` | Configuración | — |

> **Nota**: Las apps son shells Vite que componen UI dumb (`@consilium/ui`) e inyectan adapters reales (UseCases, repositorios) al montar.

## API Futura (Fase 2 – Backend GraphQL + BullMQ)

| Endpoint GraphQL | Descripción |
|------------------|-------------|
| `presignedUploadUrl(input: PresignInput): PresignResult` | Devuelve URL firmada para PUT directo a Object Storage |
| `verifyDocumentsExistence(hashes: [String!]!): [DocExistence!]!` | Verifica qué hashes ya existen en servidor (dedup) |
| `documentOutboxEvent` (subscription / BullMQ queue `consilium_notifications`) | Eventos de outbox para n8n futuro |

## Contratos de Integración (n8n futuro)

- `docs/integrations/ingestion.contract.md` – Ingesta masiva (shape JSON neutro).
- `docs/integrations/notifications.contract.md` – Notificaciones (eventos outbox).

## Referencias
- ADR‑0001 Capacitor vs React Native (`docs/adr/0001-capacitor-over-react-native.md`).
- ADR‑0007 Presigned URL (`docs/adr/0007-presigned-url-upload-to-object-storage.md`).
- `sync-architecture.md` (flujo outbox + presigned).