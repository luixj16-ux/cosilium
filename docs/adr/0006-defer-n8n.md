# ADR-0006 · n8n diferido (no construir ecosistema hoy)

Estado: **Aceptado**. Fecha: 2026.

## Contexto
Un orquestador n8n para notificaciones/reportes es tentador, pero hoy el
foco es el core offline y el contrato. Adoptar n8n ahora desviaría recursos y
acoplaría el cliente a un runner externo.

## Decisión
- **n8n queda diferido**: cero flujos n8n en el repo, sin deps activas.
- Se define la frontera ahora: contratos neutrales JSON en
  `docs/integrations/*.contract.md` y la cola `consilium_notifications`
  (BullMQ) como entrada futura.
- El core es 100% independiente de n8n (RxDB outbox propio).
- tools/skills n8n previas conservadas en `.agents/n8n-skills/` para rearmar
  el entorno en la fase 3.

## Consecuencias
- Ventaja: la sala corre sin red; n8n es "nice-to-have" post-MVP.
- Se controla el alcance: la fecha de defir es documentada en
  `.agents/n8n-future/FUTURE_README.md`.
- Cuando se reactive, hay contratos versionados para no re-discutir shape.