Ejemplo mínimo: flujo herramienta `Tool: echo_tool`

Descripción
- Workflow importable en n8n que actúa como una herramienta/sub-workflow llamada `Tool: echo_tool`.
- Entradas: `text` (string). Salida: `{ "echo": <valor de text> }`.

Pasos para probarlo

1) Levantar n8n (ejemplo rápido con npx):

```powershell
npx n8n start
```

2) Abrir la UI de n8n (por defecto http://localhost:5678) e importar `tool_workflow_example.json`:
   - Menú → Import → seleccionar el archivo

3) Activar el workflow importado o dejarlo inactivo (es un trigger tipo `Execute Workflow Trigger`).

4) Probar la herramienta desde otro workflow en n8n:
   - Crear un nuevo workflow con un nodo `Execute Workflow` que llame al workflow importado (seleccionar `Tool: echo_tool`) y pasar `{ "text": "hola" }` como inputs.
   - Ejecutar el `Execute Workflow` y verificar que la salida contenga `echo: "hola"`.

5) Para integrar con MCP / agentes:
   - Asegúrate de tener una instancia n8n accesible y completar `N8N_API_KEY` en tu configuración MCP.
   - Registra este sub-workflow como herramienta (según tu esquema MCP) o úsalo como `toolWorkflow` en la definición de tool que el agente vea.

   Caller de ejemplo
   - `tool_caller_example.json` — workflow que muestra un `Manual Trigger` → `Set Input` → `Execute Workflow` configurado para llamar a `Tool: echo_tool`.
   - IMPORTANTE: El campo `workflow` en el `Execute Workflow` del ejemplo usa el nombre `Tool: echo_tool` como placeholder; después de importar ambos workflows en n8n, abre el `Execute Workflow` en la UI y selecciona el workflow objetivo desde el selector (esto ajustará internamente el `workflowId`).

   Prueba rápida del caller
   1. Importa `tool_workflow_example.json` y `tool_caller_example.json` en n8n.
   2. Edita el nodo `Execute Workflow` en el workflow `Caller: call_echo_tool` y selecciona `Tool: echo_tool` desde el selector de workflow.
   3. Ejecuta el `Manual Trigger` y revisa la salida del `Execute Workflow` para ver `{ "echo": "Hello from caller" }`.

   Arrancar MCP con variables

   Se incluyen scripts de arranque para facilitar ejecutar el MCP localmente:

   - `./.agents/start_mcp.ps1` — script PowerShell (Windows). Carga `.env` o `.agents/examples/.env.example` y arranca el MCP.
   - `./.agents/start_mcp.sh` — script POSIX (Linux/macOS). Carga las mismas variables y arranca el MCP usando Node.

   Ejemplo (PowerShell):
   ```powershell
   .\.agents\start_mcp.ps1
   ```

   Ejemplo (bash):
   ```bash
   ./.agents/start_mcp.sh
   ```

   Importar workflows automáticamente

   Puedes importar todos los workflows JSON de `/.agents/examples/` en tu instancia n8n usando el script `import_workflows.js`.

   1. Asegúrate de tener `node` instalado y de que `N8N_API_URL` y `N8N_API_KEY` estén disponibles (en `.env` o `.agents/examples/.env.example`).
   2. Ejecuta:

   ```bash
   node ./.agents/import_workflows.js
   ```

   El script intentará POSTear cada JSON a `${N8N_API_URL}/workflows` y mostrará la respuesta.



Archivos
- `tool_workflow_example.json` — workflow importable en n8n
- `.env.example` — variables de entorno sugeridas para MCP
