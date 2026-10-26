---
trigger: always_on
---
# Configuración n8n/MCP Legacy — CONSILIUM (Referencia Histórica)

> **ADVERTENCIA:** Configuración **LEGACY** del sistema anterior. n8n está **diferido** en arquitectura actual (ver `global-context.md` §5, `.agent/n8n-future/FUTURE_README.md`).

## mcp_config.json (Legacy)

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "node",
      "args": ["C:\\Users\\Usuario\\AppData\\Roaming\\npm\\node_modules\\n8n-mcp\\dist\\mcp\\index.js"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "http://localhost:5678",
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": ""
      }
    }
  }
}
```

**Características:**
- **Tipo:** stdio local
- **API key:** vacía (placeholder — debe completarse)
- **Ruta binario:** Windows hardcodeada (`Users\Usuario\AppData`) — **frágil**
- **Instancia n8n:** `http://localhost:5678`

---

## Variables Entorno (.env.example Legacy)

```bash
N8N_API_URL=http://localhost:5678
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=REPLACE_WITH_YOUR_API_KEY
```

---

## Scripts Arranque MCP (Legacy)

### `start_mcp.sh` (POSIX)
1. Carga `.env` o `.agents/examples/.env.example` (allexport)
2. Verifica existencia de `mcp_config.json`
3. Usa node para parsear config JSON y spawn `node <args>` con stdio inherit

### `start_mcp.ps1` (PowerShell)
1. `Set-StrictMode -Version Latest`
2. Carga `.env` o `.env.example` (parsing línea por línea)
3. Usa node para extraer `{cmd, args}` del config
4. Ejecuta `& $cmd $args`

---

## Importación Workflows (Legacy)

### `import_workflows.js`
Script Node que:
1. Carga `.env` o `.agents/examples/.env.example`
2. Determina `N8N_API_URL` (default `http://localhost:5678`) y API key
3. POSTea cada JSON `.json` en `.agents/examples/` a `${N8N_API_URL}/workflows`
4. Headers: `X-N8N-API-KEY` y `Authorization: Bearer <key>` si hay key
5. Maneja http/https, reporta éxito/fallo

---

## Ejemplos Workflows Legacy (`.agents/examples/`)

### `tool_workflow_example.json` — "Tool: echo_tool"
- Nodes: `Execute Workflow Trigger` → `Set` ("Return Echo")
- Trigger define `workflowInputs.values = [{name: 'text', type: 'string'}]`
- Set: `{ "echo": "={{ $json.text }}" }`
- **Patrón:** Sub-workflow como Herramienta (tool) n8n

### `tool_caller_example.json` — "Caller: call_echo_tool"
- Nodes: `Manual Trigger` → `Set` ("Set Input" con text="Hello from caller") → `Execute Workflow` (llama a "Tool: echo_tool")
- **Patrón:** Caller (invoca la herramienta)

**Patrón canónico n8n:** Sub-workflow como herramienta (`.toolWorkflow`) — "the canonical n8n way — default when in doubt" (per skill `n8n-agents`).

---

## Skills n8n Legacy (15 skills, ~100 archivos)

Ubicación: `.agents/skills/`

| Skill | Descripción |
|---|---|
| `n8n-agents` | AI Agents en n8n (model + tools + memory) |
| `n8n-binary-and-data` | Manejo binarios y datos |
| `n8n-code-javascript` | Nodo Code JavaScript |
| `n8n-code-python` | Nodo Code Python |
| `n8n-code-tool` | Code como herramienta |
| `n8n-error-handling` | Error handling patterns |
| `n8n-expression-syntax` | Sintaxis expresiones n8n |
| `n8n-mcp-tools-expert` | MCP tools expert |
| `n8n-multi-instance` | Multi-instancia n8n |
| `n8n-node-configuration` | Configuración nodos |
| `n8n-self-hosting` | **Self-hosting Docker + Caddy** (assets listos) |
| `n8n-subworkflows` | Sub-workflows patterns |
| `n8n-validation-expert` | Validación workflows |
| `n8n-workflow-patterns` | 6 patrones core + anti-patrones |
| `using-n8n-mcp-skills` | Router entry-point |

---

## Patrones Core n8n Documentados (Legacy)

| # | Patrón | Cadena Nodos |
|---|---|---|
| 1 | **Webhook Processing** (35%) | Webhook → Validate → Transform → Respond/Notify |
| 2 | **HTTP API Integration** | Trigger → HTTP Request → Transform → Action → Error Handler |
| 3 | **Database Operations** | Schedule → Query → Transform → Write → Verify |
| 4 | **AI Agent Workflow** | Trigger → AI Agent (Model + Tools + Memory) → Output |
| 5 | **Scheduled Tasks** | Schedule → Fetch → Process → Deliver → Log |
| 6 | **Batch Processing** | Prepare → SplitInBatches → Process → Accumulate → Aggregate |

**Regla Batch clave:** SIEMPRE `Limit 1` tras main[0] (done), salida done solo una vez, batchSize = cost lever.

---

## Gating de Vida Workflow (Legacy)

1. **Validate** — `validate_workflow` / `n8n_validate_workflow`
2. **Verify connections** — `n8n_get_workflow` leer `connections`
3. **Test** — `n8n_test_workflow` + `n8n_executions` (aviso efectos secundarios)
4. **Activate** — solo tras los tres primeros (vía `activateWorkflow` op)

---

## Anti-patrones Alto Impacto (Legacy)

1. Nodo Set alimentando 0-1 consumidores → inline expresión
2. Iteración per-item automática → NO añadir Loop Over Items si default itera
3. Code Each-Item vs All-Items → ~25-30× más costoso por ítem
4. Cadenas largas transformación → consolidar en un All-Items Code node
5. Append Google Sheets con columnas fórmula → rompe fórmulas
6. Comparación unidireccional umbrales → siempre `Math.abs(diff)`

---

## Estadísticas Uso Documentadas (Legacy)

- **Triggers:** Webhook 35%, Schedule 28%, Manual 22%, Service 15%
- **Transformaciones:** Set 68%, Code 42%, IF 38%, Switch 18%
- **Outputs:** HTTP Request 45%, Slack 32%, DB writes 28%, Email 24%
- **Complejidad:** Simple (3-5 nodos) 42%, Medio (6-10) 38%, Complejo (11+) 20%

---

## Arquitectura Despliegue n8n Self-Hosted (Legacy)

### Modo Single (`docker-compose.single.yml`)
- **Caddy** (proxy + TLS auto) + **n8n** (proceso único)
- n8n NO publicado al host (solo red privada)
- SQLite como BD
- Vars seguridad: `N8N_ENCRYPTION_KEY` (obligatoria, backup), `N8N_SECURE_COOKIE=true`, `N8N_DIAGNOSTICS_ENABLED=false`, `N8N_BLOCK_ENV_ACCESS_IN_NODE=true`, `N8N_RUNNERS_ENABLED=true`, `N8N_DEFAULT_BINARY_DATA_MODE=filesystem`, `EXECUTIONS_DATA_PRUNE=true` (MaxAge 336h, MaxCount 50000)

### Modo Queue (`docker-compose.queue.yml`)
- **Caddy + n8n main + Redis + Postgres + N workers**
- Anchor YAML `x-n8n-env` garantiza config a main y workers
- DB_TYPE=postgresdb, usuario no-root via init-data.sh
- EXECUTIONS_MODE=queue, Redis/Bull
- `N8N_DEFAULT_BINARY_DATA_MODE=database` (Postgres)
- Workers: `command: worker --concurrency=5`, `deploy.replicas: 2`
- Escalado: `docker compose up -d --scale n8n-worker=N`

### Caddyfile (Legacy)
- Reverse proxy `n8n:5678` con `flush_interval -1`, headers reales
- Security headers: HSTS, nosniff, SAMEORIGIN, Referrer-Policy
- Dominio: `{$N8N_SUBDOMAIN}.{$N8N_DOMAIN}`

### Reglas Secretos (Legacy)
- NUNCA commitear `.env` real
- Generar secrets fresco: `openssl rand -base64 32`
- `N8N_ENCRYPTION_KEY` igual en main y workers (queue mode)
- Backups fuera del server

---

## Estado Actual vs Futuro

**Legacy (existía):** Config MCP + skills n8n completos + ejemplos workflows + Docker compose listos

**Actual (global-context.md):** n8n **diferido** — Solo `.agent/n8n-future/FUTURE_README.md` y contratos en `docs/integrations/*.contract.md` (ingestion.contract.md, notifications.contract.md)

**Nada de n8n hoy** — Preparación contractual solamente.