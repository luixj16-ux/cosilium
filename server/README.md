# CONSILIUM Server (Fase 2 · Backend)

Estado: **diferido por decisión de arquitectura** — el foco actual es el
cliente offline-first (Core DDD + apps) y el contrato de sincronización.
Este paquete fija la estructura y los contratos para que la fase backend no
reabra decisiones de diseño.

## Qué contiene
- `src/graphql/schema.graphql` — **fuente de verdad** del contrato GraphQL.
  Desde aquí se genera `@consilium/contracts` (`generated-types.ts`) con
  graphql-codegen.
- `src/documents/` — `DocumentService` (lado remoto de los puertos
  `RemoteDocumentRegistry` y `ObjectStorageUploader` del Core) y su fábrica.
- `src/config/bullmq.config.ts` — colas `document_outbox` y
  `consilium_notifications` (esta última es la futura entrada de n8n).
- `src/main.ts` — bootstrap NestJS+Apollo (apagado; fase 2).

## Contrato de sincronización (resumen)
1. Cliente crea `Document` y lo encola en su outbox local (RxDB).
2. Cliente llama `verifyDocumentsExistence(hashes)` → duplicados no se suben
   (se marcan `UPLOADED` localmente).
3. Cliente llama `presignedUploadUrl(input)` → URL directa a Object Storage.
4. Cliente sube el binario a la URL (nunca por el API server).
5. API encola a `document_outbox` un `DocumentOutboxEvent` para
   notificaciones/integraciones (n8n diferido).

## Fase 3 (n8n)
Las integraciones consumen `DocumentOutboxEvent` desde la cola
`consilium_notifications`. Contratos en `docs/integrations/*.contract.md`.