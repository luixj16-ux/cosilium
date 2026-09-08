# ADR-0003 · Outbox pattern local (document_outbox)

Estado: **Aceptado**. Fecha: 2026.

## Contexto
El cliente crea documentos sin red. Enviar directamente y en *ese momento* al
servidor rompería el contrato offline-first (ver ADR-0002).

## Decisión
Cada shell mantiene un **outbox** local y persistente (RxDB, colección
`document_outbox`): el orden de encolamiento es el orden de envío. Un
`SynchronizePendingDocumentsUseCase` drena el outbox **cuando hay red**, FIFO.
El envío no es bloqueante: el usuario sigue trabajando.

Detalles del contrato:
- `QueueDocumentForUploadUseCase`: encola y cambia a `PENDING_UPLOAD`.
- Si el drenado falla → `FAILED` (reintentable), nunca se pierde.
- Duplicado por hash → `UPLOADED` sin subir binario.

## Consecuencias
- Fuerza la idempotencia y la deduplicación por hash en el cliente.
- El estado es derivable siempre desde el outbox (append-only, ADR-0002).
- La app debe presentar estados de espera/fallo sin bloquear la UI.
- Costo: esquema y fakes en tests (MockDocumentRepository/FakeUploader/…) y
  supervisión de la cola como parte del ciclo de sync.