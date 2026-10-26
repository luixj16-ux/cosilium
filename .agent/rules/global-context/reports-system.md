---
trigger: always_on
---
# Reports System — Placeholder (Fase Futura)

> **Estado:** No implementado. Se definirá cuando se requiera generación de reportes (PDF, Excel, dashboards) y sincronización con n8n.

## Puntos a Definir Futuramente
- Tipos de reporte: expedientes por tribunal, estadísticas de subida, auditoría de hash.
- Motor: generación en backend (fase 2) o client-side (WASM) + descarga.
- Programación: cron (BullMQ) o bajo demanda.
- Exportación: PDF (pdfmake / puppeteer), Excel (xlsx), CSV.
- Contratos neutros en `docs/integrations/` si n8n consume.

## Referencias Futuras
- ADR dedicado cuando se decida.
- Skill `reports-system` si se crea.
- `sync-architecture.md` para eventos `metadata_registered` que disparen reportes.