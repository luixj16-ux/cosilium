---
trigger: always_on
---
# Push Notifications — Placeholder (Fase Futura)

> **Estado:** No implementado. Se definirá cuando la arquitectura de notificaciones sea requerida (ej. n8n reactivado, FCM / Web Push).

## Puntos a Definir Futuramente
- Proveedor (FCM, Web Push, n8n webhook).
- Permisos y suscripción en apps (web/desktop/mobile).
- Canales: notificaciones de documento subido, fallos de sync, alertas.
- Integración con `consilium_notifications` BullMQ queue.
- Contratos neutros en `docs/integrations/notifications.contract.md`.

## Referencias Futuras
- ADR dedicado cuando se decida.
- Skill `push-notifications` si se crea.
- `local-deploy.md` actualizar con claves / configuración.