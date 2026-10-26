# Skill: Offline Sync

Use when working on the outbox/synchronization path: `QueueDocumentForUploadUseCase`,
`SynchronizePendingDocumentsUseCase`, `VerifyRemoteExistenceUseCase`, or the
`document_outbox` collection spec. Architecture summary in
`.agents/rules/sync-architecture.md`.

## Mental model
"El cliente es la fuente de verdad mientras está sin red."

## Fallback assumptions
1. **La red es poco fiable.** Any call to the server/registry/storage
   may throw at any point. Document status `FAILED` (not `PENDING`) on failure.
2. **FIFO delivery**: el orden de encolamiento se respeta. Nunca reordenar.
3. **Idempotencia**: el servidor acepta `fileHash` duplicado y devuelve
   `duplicated: true`. El cliente lo marca `UPLOADED` sin subir binario.
4. **Presigned URL directa**: el cliente sube el binario a Object Storage
   (S3-compat), no al API server.
5. **Se permite reintentar** `FAILED` → `PENDING_UPLOAD` (transición explícita
   en el agregado).

## Key flows to verify
- `QueueDocumentForUploadUseCase`: crea `Document` (PENDING → PENDING_UPLOAD),
  hash calculado, inserta en outbox. Si no hay red, igual queda encolado.
- `VerifyRemoteExistenceUseCase`: llama a `RemoteDocumentRegistry`, regresa
  hashes existentes.
- `SynchronizePendingDocumentsUseCase`: drena el outbox FIFO. Si `isDuplicate`
  → sin subida; si no → presigned PUT; éxito → UPLOADED, excepción → FAILED.

## Testing
Fakes in `packages/core/__tests__/mocks/`:
`MockDocumentRepository`, `MockDocumentHasher`, `FakeRemoteRegistry`, `FakeUploader`.
Canonical test: `QueueDocumentForUpload.test.ts` que simula un corte de red
mid-upload.