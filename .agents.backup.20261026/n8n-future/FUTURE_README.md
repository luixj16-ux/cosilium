# n8n Futuro — CONSILIUM (diferido)

Estado: **diferido**. El plan maestro (MASTER_INIT_PROMPT) reserva n8n como
orquestador *opcional* de integraciones en fases posteriores. Hoy NO existe
ningún flujo n8n en CONSILIUM.

## Qué decidimos
1. El **núcleo y el cliente** son independientes de n8n: la sincronización y el
   outbox son propios (RxDB + BullMQ), no dependen de un runner externo.
2. n8n será consumidor, **no escritor**, de datos de documentos. Escucha la
   cola remota `consilium_notifications` (BullMQ) y produce notificaciones,
   alertas y reportes hacia canales externos (correo, Teams, Slack…).
3. Contratos neutrales JSON en `docs/integrations/*.contract.md` son la frontera
   que un workflow n8n debe respetar. Más adelante se podrá usar el MCP de n8n
   para construirlos sin tocar el core.

## Tooling conservado
En `.agents/n8n-skills/` y `.agents/n8n-skills/tooling/` vive la librería de
skills y scripts MCP de n8n previa — preservada para rearmar el entorno en la
fase 3 (start_mcp.sh, mcp_config.json, import_workflows.js).

## Reglas al retomar
- Todo workflow n8n debe pasar por los contratos de `docs/integrations/`.
- n8n NO muta el status de un documento ni el outbox (solo lee eventos).
- Las credenciales n8n van en el gestor de secretos, nunca en el repo.