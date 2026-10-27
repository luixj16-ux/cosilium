# ADR-0007 · Subida directa por presigned URL al Object Storage

Estado: **Aceptado**. Fecha: 2026.

## Contexto
Los expedientes son PDFs/escaneos (bench: hasta cientos de MB por lote). Subirlos
a través del API server lo torpedearía (latencia, buffers, timeouts) y rompería
la premisa de dejar de saturar la nube.

## Decisión
- El cliente pide una **presigned URL** vía `presignedUploadUrl(input)` en
  GraphQL (metadatos: id, name, contentType, size, hash).
- El binario se sube con **PUT directo** a Object Storage (S3-compatible,
  bucket dedicado).
- El server solo guarda metadatos y emite el `DocumentOutboxEvent`.
- Verificación de duplicado (`verifyDocumentsExistence`) evita re-subir binarios
  y es la única canalización de dedupe del cliente.

## Consecuencias
- Pro: no hay single point of failure del API; tráfico grande va directo a S3.
- Pro: idempotencia por hash compartida cliente/server (ADR-0002/0003).
- Contra: la URL expira → el cliente debe mantener la vista de "pendiente de
  subir" y reintentar (`FAILED` ya está en el modelo).
- Contra: se requiere firma en el server (fase 2) — omitida del alcance actual
  en el contrato, pero el puerto `ObjectStorageUploader` ya lo expresa.