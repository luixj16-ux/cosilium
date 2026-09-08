# Reglas de Dominio — CONSILIUM

Fuente de verdad: `packages/core/src/domain/`. Estas reglas NO se discuten en
la UI ni en la app; son invariantes del modelo.

## Documento (DocumentAggregate)
- Un `Document` tiene: `id`, `name`, `extension`, `pageCount`, `sizeInBytes`,
  `fileHash`, `status`, `userId`, `createdAt`.
- Extensiones admitidas: `PDF`, `JPEG`, `PNG` (`DocumentExtension`). Cualquier
  otra se rechaza en ingesta.
- `pageCount` máximo para binarización offline: **500** (`MAX_OFFLINE_PAGE_COUNT`).
  Encima → no se hace OCR/binarización local; se sube el original.
- `fileHash` es SHA-256 del binario, calculado en Rust/WASM (`WebCryptoDocumentHasher`
  en web; `wasm-engine` para desktop/mobile).

## Estado y transiciones (DocumentStatus)
```
PENDING ──(se encola)────────────▶ PENDING_UPLOAD
PENDING_UPLOAD ──(subida ok)─────▶ UPLOADED
PENDING_UPLOAD ──(duplicado)─────▶ UPLOADED   (sin subir binario)
PENDING_UPLOAD ──(fallo)─────────▶ FAILED     (reintentable)
FAILED ──(reintento)─────────────▶ PENDING_UPLOAD
PENDING ──(catch-all)────────────▶ PENDING_UPLOAD
```
- `UPLOADED` y `FAILED` nunca regresan a `PENDING` (el documento fue creado).
- Fuera de estas transiciones, un cambio de estado es un bug de dominio.

## Idempotencia por hash
- Mismo `fileHash` + mismo `userId` → el segundo documento es **duplicado**.
  Se marca `UPLOADED` sin re-subir el binario (`SynchronizePendingDocumentsUseCase`).

## Append-only
- El documento local **nunca se borra ni se sobrescribe su binario**.
- La actualización de estado es un *nuevo registro de metadatos* en el outbox
  (evento), nunca un UPDATE destructivo. Por eso el repositorio persiste la
  trayectoria completa.

## Offline
- El cliente es la fuente de verdad mientras está sin red. Un corte en
  cualquier punto de la subida **no pierde trabajo**: el documento queda
  `FAILED` (reintentable) y el `SynchronizePendingDocumentsUseCase` lo retoma.
- El cliente nunca descarta un binario antes de confirmar `UPLOADED` remoto.