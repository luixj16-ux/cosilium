# DOCS.md — Documentación Completa de la Carpeta `docs/`

> **Fecha:** 25 de octubre de 2026  
> **Proyecto:** CONSILIUM — Gestión de Expedientes Digital  
> **Ubicación:** `/home/dangelojan/BSA/cosilium/docs/`

---

## Estructura General

```
docs/
├── adr/                    # 7 Architecture Decision Records (ADRs)
├── architecture/           # 1 documento de visión general arquitectónica
└── integrations/           # 2 contratos de integración neutrales (JSON) para n8n futuro
```

**Total:** 10 archivos `.md` que cubren decisiones arquitectónicas, visión de sistema y contratos de frontera.

---

## 1. `docs/architecture/` — Visión Arquitectónica

### `overview.md` (Único archivo)

**Propósito:** Documento único de referencia rápida que describe la arquitectura completa del sistema CONSILIUM: módulos, dependencias, flujo de ingestión offline, clientes y procesamiento pesado.

**Contenido clave:**

| Sección | Qué describe |
|---------|--------------|
| **Contexto** | Sistema offline-first append-only para gestión de expedientes en tribunales/despachos con red intermitente. El dispositivo es fuente de verdad; la nube solo confirma. |
| **Diagrama de módulos** | Apps (web/desktop/mobile) → UI dumb + contracts → `@consilium/core` (DDD: domain/ports/application/infrastructure) → Server fase 2 (BullMQ) → Object Storage → Integraciones n8n futuro. |
| **Flujo de ingestión (offline)** | 1) Selección archivo → `QueueDocumentForUploadUseCase` (hash, estados, outbox RxDB, sin red) 2) `SynchronizePendingDocumentsUseCase` (verifica duplicados → presign → PUT directo → UPLOADED/FAILED) 3) Server confirma + emite `DocumentOutboxEvent` a `consilium_notifications` (cola n8n futura). |
| **Clientes** | Web (PWA, puerto 5173), Desktop (Tauri, watch nativo + Rust `tauri-native`, puerto 5174), Mobile (Capacitor 6, puerto 5175). |
| **Procesamiento pesado (Rust)** | `rust/wasm-engine`: SHA-256, binarización BW (≤500 págs), compresión — `wasm_bindgen` para web/mobile. `rust/tauri-native` para desktop nativo. Sin panics en FFI. |

**Uso:** Punto de entrada para entender el sistema completo sin leer ADRs individuales.

---

## 2. `docs/adr/` — Architecture Decision Records (7 ADRs)

Todos siguen formato estándar: **Estado (Aceptado)**, **Contexto**, **Decisión**, **Alternativas**, **Consecuencias**. Numerados secuencialmente.

### ADR-0001 · `0001-capacitor-over-react-native.md`
- **Decisión:** Usar **Capacitor 6** sobre shell Vite (misma base TSX que `apps/web`) empaquetada para iOS/Android via webview del sistema.
- **Alternativas descartadas:** React Native (core separado, no comparte React DOM), PWA-only (pierde filesystem nativo), Flutter (rompe monolingüismo TS).
- **Consecuencias:** Una sola UI a mantener; procesamiento pesado via WASM (`rust/wasm-engine`); build/empaquetado aceptable; evita bridges nativos por plataforma.

### ADR-0002 · `0002-append-only.md`
- **Decisión:** Persistir **eventos/trayectorias**, no estados mutantes. Document local mantiene transiciones de estado; `document_outbox` es log FIFO; binario nunca se sobreescribe (re-escaneo = nuevo documento + hash distinto); no `DELETE` sobre documentos.
- **Consecuencias:** Auditoría simple y trazable; reintentos seguros (`FAILED` → reencola); mayor almacenamiento + detección duplicados por hash (ver ADR-0007).
- **Implementación:** `DocumentAggregate` con transiciones validadas (`domain-rules.md`); repositorio RxDB persiste evento + estado derivado.

### ADR-0003 · `0003-outbox-pattern.md`
- **Decisión:** Cada shell mantiene **outbox local persistente** (RxDB, colección `document_outbox`): orden de encolamiento = orden de envío. `SynchronizePendingDocumentsUseCase` drena FIFO cuando hay red (no bloqueante).
- **Contrato:** `QueueDocumentForUploadUseCase` encola → `PENDING_UPLOAD`; fallo → `FAILED` (reintentable); duplicado por hash → `UPLOADED` sin subir binario.
- **Consecuencias:** Fuerza idempotencia y deduplicación por hash en cliente; estado derivable desde outbox; UI debe mostrar espera/fallo sin bloquear; costo: fakes en tests + supervisión de cola.

### ADR-0004 · `0004-rust-wasm-processing.md`
- **Decisión:** Trabajo pesado (SHA-256, binarización BW, compresión imágenes) en **Rust** (`rust/wasm-engine`) exportado por `#[wasm_bindgen]` (web + Capacitor). Desktop usa native `rust/tauri-native` sin WASM. Errores como `WasmError` (nunca panics). Binariza solo si `pageCount ≤ 500`.
- **Alternativas descartadas:** Web Audio/Canvas JS (lento/frágil para PDFs), servidor remoto (rompe offline-first), WASM binario propio (overkill).
- **Consecuencias:** Un código alto rendimiento para 3 plataformas; workspace Rust bajo `cargo check --workspace` + target `wasm32` (CI); binario WASM añade tamaño al bundle (aceptable para uso interno).

### ADR-0005 · `0005-monorepo.md`
- **Decisión:** Monorepo npm: `packages/*` (core, contracts, ui), `apps/*` (web, desktop, mobile), `server`, `rust/`. Turborepo para caching `build`/`typecheck`/`test`/`lint`. `typescript` + `@types/node` hoistados en raíz; `tsconfig.base.json` compartido. Rust en workspace paralelo (`rust/Cargo.toml`).
- **Consecuencias:** Un solo `npm install` trae todo TS; `cargo check` cubre todo Rust; cambios en `@consilium/core` validados en toda superficie; riesgo dependencias comunes globales (controlado con versiones fijas); habilita `lint:conventions` global.

### ADR-0006 · `0006-defer-n8n.md`
- **Decisión:** **n8n diferido**: cero flujos n8n en repo, sin deps activas. Frontera definida ahora: contratos neutrales JSON en `docs/integrations/*.contract.md` + cola `consilium_notifications` (BullMQ) como entrada futura. Core 100% independiente de n8n. Tools/skills n8n previas conservadas en `.agents/n8n-skills/` para fase 3.
- **Consecuencias:** Sala corre sin red; n8n es "nice-to-have" post-MVP; alcance controlado (fecha documentada en `.agents/n8n-future/FUTURE_README.md`); al reactivar, contratos versionados evitan re-discusión.

### ADR-0007 · `0007-presigned-upload.md`
- **Decisión:** Subida directa por **presigned URL** a Object Storage (S3-compatible). Cliente pide URL via GraphQL `presignedUploadUrl` (metadatos: id, name, contentType, size, hash). PUT directo del binario al bucket. Server solo guarda metadatos + emite `DocumentOutboxEvent`. Verificación duplicados (`verifyDocumentsExistence`) evita re-subir.
- **Consecuencias:** Pro: no SPoF en API; tráfico grande directo a S3; idempotencia por hash compartida cliente/server. Contra: URL expira → cliente mantiene vista "pendiente" y reintenta (`FAILED` ya modelado); requiere firma en server (fase 2) — puerto `ObjectStorageUploader` ya expresado.

---

## 3. `docs/integrations/` — Contratos de Integración Neutrales (2 archivos)

Diseñados como **fronteras JSON puras** para consumo futuro por n8n. Sin código, sin transporte, solo shape de datos. El core no depende de ellos; n8n los debe respetar.

### `ingestion.contract.md`
**Propósito:** Contrato para ingestas externas alimentadas por n8n (ej. escaneos masivos que un flujo futuro envía al backend).

**Shape JSON (entrada):**
```jsonc
POST /api/v1/ingest
{
  "ingestBatchId": "ing_01J...",
  "source": "scan_center",
  "userId": "usr_01J...",
  "documents": [
    {
      "name": "Factura_2026-44.pdf",
      "contentType": "application/pdf",
      "sizeInBytes": 48210,
      "pageCount": 1,
      "fileHash": "sha256hex...",
      "storageKey": "scans/2026/09/...",
      "metadata": {}
    }
  ]
}
```

**Flujo:**
1. n8n detecta/recibe lote (folder-watch, correo, API externa)
2. n8n sube binarios a Object Storage + entrega JSON al API server
3. Server registra metadatos, crea `DocumentOutboxEvent` en `consilium_notifications`, responde aceptados/duplicados/rechazados
4. Cliente en próximo sync descubre docs por hash → marca `UPLOADED` sin re-subir

**Reglas:**
- `fileHash` obligatorio (sin él = rechazo, no hay dedupe)
- Duplicados (hash ya conocido por `userId`) se ignoran silenciosamente
- n8n no toca outbox local; solo alimenta cola remota

---

### `notifications.contract.md`
**Propósito:** Contrato para workflows n8n que consuman eventos desde cola `consilium_notifications` (BullMQ).

**Shape JSON (evento):**
```jsonc
{
  "eventId": "evt_01J...",
  "tipo": "metadata_registered",  // | duplicate_detected | upload_failed
  "document": {
    "id": "doc_01J...",
    "name": "Escritura_Casa_2026-03-11.pdf",
    "extension": "PDF",
    "pageCount": 42,
    "sizeInBytes": 3_204_921,
    "fileHash": "sha256hex...",
    "status": "UPLOADED"
  },
  "userId": "usr_01J...",
  "createdAt": "2026-09-08T10:30:00Z",
  "payload": { "reason": "first_scan" }  // o "hash_already_exists", "max_retries_exceeded"
}
```

**Semántica de tipos:**
- `metadata_registered`: metadatos registrados y confirmados (binario subido o pendiente presign)
- `duplicate_detected`: cliente reportó hash ya conocido; `payload.reason = "hash_already_exists"`
- `upload_failed`: documento quedó `FAILED` tras N reintentos; `payload.reason = "max_retries_exceeded"`

**Reglas para workflow n8n:**
1. Leer de la cola, **no** mutar outbox/status
2. Idempotente por `eventId` (reintentos → dedupe)
3. No incluir binarios: adjuntar `storageKey` cuando aplique

---

## Relación con el Resto del Proyecto

| Carpeta/Archivo | Relación con `docs/` |
|-----------------|----------------------|
| `MASTER_INIT_PROMPT.md` (Sección 8) | Exige creación de estos 7 ADRs + architecture + integrations |
| `AGENTS.md` (Regla 5) | n8n diferido → solo contratos en `docs/integrations/` |
| `.agents/rules/sync-architecture.md` | Documenta flujo que ADRs 0002, 0003, 0007 explican |
| `.agents/n8n-future/FUTURE_README.md` | Referencia directa a `docs/integrations/*.contract.md` |
| `packages/contracts/src/graphql/` | DTOs GraphQL que implementan los shapes de estos contratos |
| `server/` (fase 2) | Deberá implementar endpoints `/api/v1/ingest` + GraphQL `presignedUploadUrl` según estos contratos |

---

## Comandos de Validación Relacionados

```bash
# Verificar que todos los ADRs existen (7 esperados)
ls docs/adr/ | wc -l  # → 7

# Verificar estructura completa
tree docs/
# docs/
# ├── adr/
# │   ├── 0001-capacitor-over-react-native.md
# │   ├── 0002-append-only.md
# │   ├── 0003-outbox-pattern.md
# │   ├── 0004-rust-wasm-processing.md
# │   ├── 0005-monorepo.md
# │   ├── 0006-defer-n8n.md
# │   └── 0007-presigned-upload.md
# ├── architecture/
# │   └── overview.md
# └── integrations/
#     ├── ingestion.contract.md
#     └── notifications.contract.md
```

---

## Mantenimiento

| Acción | Cuándo | Dónde |
|--------|--------|-------|
| Nuevo ADR | Decisión arquitectónica significativa (cambio de stack, patrón, infra) | `docs/adr/NNNN-descripcion.md` (siguiente número) |
| Actualizar overview | Cambio en diagrama de módulos, flujo, o clientes | `docs/architecture/overview.md` |
| Nuevo contrato integración | Nueva frontera n8n/externo definida | `docs/integrations/<nombre>.contract.md` |
| Revisar contratos | Antes de implementar fase 2 backend / fase 3 n8n | `docs/integrations/` + `packages/contracts/` |

---

**Fin del documento.** Esta es la documentación completa y navegable de la carpeta `docs/` del proyecto CONSILIUM.