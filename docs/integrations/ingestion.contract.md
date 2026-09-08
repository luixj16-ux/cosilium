# Contrato de Ingesta — CONSILIUM (fase n8n, diferido)

Frontera neutral JSON para ingestas externas alimentadas por n8n (por ejemplo,
escaneos masivos que un flujo futuro envía al backend de CONSILIUM). El core
solo acepta estas entradas; n8n no escribe fuera del contrato.

```jsonc
// Ingesta externa → server (POST /api/v1/ingest)
{
  "ingestBatchId": "ing_01J...",
  "source": "scan_center",                 // identificador del origen
  "userId": "usr_01J...",
  "documents": [
    {
      "name": "Factura_2026-44.pdf",
      "contentType": "application/pdf",
      "sizeInBytes": 48210,
      "pageCount": 1,                      // opcional; se deriva si faltó
      "fileHash": "sha256hex...",
      "storageKey": "scans/2026/09/...",   // binario YA en Object Storage
      "metadata": {}                        // ad hoc (emisor, folio, oficina…)
    }
  ]
}
```

## Flujo
1. **n8n** detecta/recibe un lote (folder-watch, correo, API externa).
2. n8n sube binarios al Object Storage y entrega este JSON al API server.
3. El server registra metadatos, crea `DocumentOutboxEvent` en
   `consilium_notifications` y responde:
   ```jsonc
   { "ingestBatchId": "...", "accepted": 2, "duplicatesIgnored": 0, "rejected": 0 }
   ```
4. El cliente, en su próximo sync, descubre esos documentos por hash y los
   marca `UPLOADED` (sin re-subir).

## Reglas
- `fileHash` es obligatorio: sin él no hay dedupe → se rechaza el documento.
- Duplicados (hash ya conocido por `userId`) se ignoran silenciosamente.
- n8n no toca el outbox local; solo alimenta la cola remota.