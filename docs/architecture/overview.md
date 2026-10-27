# Arquitectura — CONSILIUM (visión general)

## Contexto
Sistema de gestión de **expedientes digitales** offline-first y append-only.
El usuario opera en tribunales/despachos con red intermitente. Decisión
central: el dispositivo es la fuente de verdad mientras no hay red; la nube
solo confirma.

## Diagrama de módulos (dependencias = flechas hacia el núcleo)

```
                    ┌──────────────────────────────────────────────┐
                    │              apps (shells Vite)               │
     apps/web ──────┤    web        desktop (Tauri)    mobile (Cap)│
     apps/desktop  ─┤                                              │
     apps/mobile ───┤  componen UI + inyectan adapters reales       │
                    └───────┬────────────────┬─────────────────────┘
                            │                │
              packages/ui   │       @consilium/contracts (DTOs GQL)
              (dumb)        │                ▲
                            ▼                │
                 @consilium/core (DDD)       │
                ┌────────────┬──────────────┴┐
                │            │               │
   domain (agg+  ports  application        infrastructure
   value objs)          (use cases)        (RxDB, WebCrypto)
                │                          ▲
                └──────────────────────────┘
                     server (fase 2) → BullMQ outbox → Object Storage
                                                          │
                                    docs/integrations/* (n8n futuro)
```

## Flujo de ingestión (offline)
1. El agente de la oficina selecciona/expone el archivo (o el campo cae en el
   folder de ingesta del desktop → `DirectoryWatcher`).
2. El shell crea `Document` vía `QueueDocumentForUploadUseCase`: hashing
   (WebCrypto / wasm), estados `PENDING → PENDING_UPLOAD`, inserta en outbox
   RxDB. **Sin red requerido.**
3. `SynchronizePendingDocumentsUseCase` (fire-and-forget cuando hay red):
   verifica duplicados por hash → presign → PUT directo al bucket → `UPLOADED`.
   Cortes → `FAILED` reintentable.
4. El server confirma metadatos en `document_outbox` (BullMQ) y emite
   `DocumentOutboxEvent` hacia `consilium_notifications` (consumo n8n futuro).

## Clientes
- **Web** (`apps/web`): PWA para despachos con navegador, port 5173.
- **Desktop** (`apps/desktop`): Tauri; watch de carpeta + comandos nativos
  `rust/tauri-native` (watch, ingest). Port 5174.
- **Mobile** (`apps/mobile`): Capacitor 6, oficinas móviles. Port 5175.

## Procesamiento pesado (Rust)
`rust/wasm-engine`: SHA-256, binarización BW (≤500 páginas), compresión de
imagen — expuesto por `#[wasm_bindgen]` (bits-asin en web/mobile). `tauri-native`
para desktop nativo. Ambos sin panics en FFI.