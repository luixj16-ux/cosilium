# ADR-0002 · Append-only (sin UPDATE sobre entidades fuente)

Estado: **Aceptado**. Fecha: 2026.

## Contexto
Un expediente legal no debe "borrarse" ni "sobrescribirse" sin rastro. La red es
intermitente; el dispositivo local debe poder reconstruir el estado sin ambigüedad.

## Decisión
Persistir **eventos/trayectorias**, no estados mutantes:
- El `Document` local (RxDB) mantiene su registro de transiciones de estado.
- `document_outbox` es un log FIFO de eventos de encolamiento/upload.
- El binario nunca se sobreescribe; un re-escaneo produce un documento nuevo
  con hash distinto (idempotencia resuelta por hash).
- Ningún cliente emite `DELETE` sobre documentos; solo distintos estados.

## Consecuencias
- Auditoría simple: todo cambio de estado es trazable y reproducible.
- Reintentos seguros: `FAILED` se vuelve a encolar sin corromper el historial.
- Costo de almacenamiento mayor que un modelo UPDATE + requerimientos de
  detección de duplicados por hash (ver ADR-0007).

## Cómo se implementa
- Agregado `DocumentAggregate` con transiciones validadas (domain-rules.md).
- Repositorio RxDB que persiste el evento y el estado derivado.