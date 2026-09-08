# Contrato de Notificaciones — CONSILIUM (fase n8n, diferido)

Frontera neutral JSON para el futuro orchestrator n8n. Un workflow que consuma
eventos desde la cola `consilium_notifications` recibe este shape.

```jsonc
// Evento de notificación (cola consilium_notifications → BullMQ)
{
  "eventId": "evt_01J...",                 // ULID/ID persistente
  "tipo": "metadata_registered",            // metadata_registered | duplicate_detected | upload_failed
  "document": {
    "id": "doc_01J...",
    "name": "Escritura_Casa_2026-03-11.pdf",
    "extension": "PDF",
    "pageCount": 42,
    "sizeInBytes": 3_204_921,
    "fileHash": "sha256hex...",
    "status": "UPLOADED"                    // al momento del evento
  },
  "userId": "usr_01J...",
  "createdAt": "2026-09-08T10:30:00Z",
  "payload": {                              // datos ad hoc del evento
    "reason": "first_scan"                  // duplicate_detected → "hash_already_exists"
  }
}
```

## Semántica
- **metadata_registered**: metadatos registrados y confirmados (binario hasta
  subido, o pendiente de presign).
- **duplicate_detected**: el cliente reportó un hash ya conocido; no se vuelve
  a subir binario. `payload.reason = "hash_already_exists"`.
- **upload_failed**: un documento quedó `FAILED` tras N reintentos.
  `payload.reason = "max_retries_exceeded"`.

## Reglas para un workflow n8n
1. Leer de la cola, **no** mutate outbox/status.
2. Idempotente por `eventId` (retards → dedupe).
3. No incluir binarios: adjuntar referencia `storageKey` cuando aplique.