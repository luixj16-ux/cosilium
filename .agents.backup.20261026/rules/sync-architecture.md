# Arquitectura de Sincronización — CONSILIUM

## Modelo mental
"El cliente trabaja offline y la nube solo confirma." Ninguna operación del
usuario depende de la red.

## Flujo completo
```
[App (web/desktop/mobile)]
  1. FilePicker / Dropzone / DirectoryWatcher (desktop) ─▶ binario local
  2. DocumentAggregate (core) crea Document PENDING
     · hashing: WebCryptoHasher (web) / wasm-engine (desktop/mobile)
     · binarización: wasm-engine (image→BW) si pageCount ≤ 500 y es escaneo
  3. outbox local RxDB: document_outbox ─▶ status PENDING_UPLOAD
  4. SynchronizePendingDocumentsUseCase (primera oportunidad de red):
     a. verifyDocumentsExistence(hashes) [GraphQL → server/RemoteDocumentRegistry]
     b. duplicados → UPLOADED (sin subir binario)
     c. nuevos → presignedUploadUrl [server → ObjectStorageUploader]
     d. PUT binario a la URL firmada (storage S3-compatible)
     e. confirmación → UPLOADED ; fallo de red → FAILED (reintentable)
  5. server encola a `document_outbox` (BullMQ) un DocumentOutboxEvent
     · consumido por `consilium_notifications` → integraciones n8n (fase 3)
```

## Dónde vive cada pieza
| Pieza | Ruta | Capa |
|---|---|---|
| Agregado Document + estados | `packages/core/src/domain` | domain |
| Puertos | `packages/core/src/domain/ports` | domain |
| Casos de uso (Queue/Verify/Sync) | `packages/core/src/application` | application |
| RxDB repo + WebCrypto hasher | `packages/core/src/infrastructure` | infrastructure |
| Contratos GraphQL | `packages/contracts/src/graphql` | contracts |
| Server (esquema, service, redis colas) | `server/src` | backend (fase 2) |
| Rust hash/binarizar/compresión | `rust/wasm-engine`, `rust/tauri-native` | nativo |

## Reglas de oro
1. **El cliente nunca espera** la red para crear/encolar un documento.
2. **El binario no pasa por el API server** — solo presigned URLs (ADR-0006).
3. **Duplicados no se vuelven a subir** (chequeo por hash antes del PUT).
4. **Fallo ≠ pérdida**: cualquier excepción de red deja `FAILED`, reintentable.
5. **Orden FIFO** en el outbox: el drenado respeta fecha de encolamiento.
6. **Idempotencia**: el servidor acepta el mismo `fileHash`+`userId` como
   ya-subido y responde bien a `UploadResult { uploaded:false, duplicated:true }`.

## Interacción con n8n (diferido)
n8n NO toca datos en escritura. Consume eventos de la cola
`consilium_notifications` para notificaciones/alertas/reportes. Contratos en
`docs/integrations/*.contract.md`.