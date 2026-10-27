---
trigger: always_on
---
# Despliegue Legacy — CONSILIUM (Referencia Histórica)

> **ADVERTENCIA:** Documenta despliegue **LEGACY** (Node.js vanilla + SQLite + n8n self-hosted). Arquitectura actual usa Turborepo + Tauri + Capacitor + Docker (fase 2).

---

## Despliegue Aplicación TSJ (Legacy)

### Requisitos Mínimos
- Node.js v22+
- SQLite (archivo `database/tsj.sqlite`)
- Puerto 8080 (o `process.env.PORT`)

### Ejecución Local
```bash
# Inicializar BD (si no existe)
node database/init-db.js

# Arrancar servidor
node server.js
# → "Servidor IUSTITIA ejecutándose en: http://localhost:8080"
```

### Variables Entorno
```bash
PORT=8080  # opcional, default 8080
```

### Estructura Runtime
```
cosilium/
├── database/tsj.sqlite      # BD SQLite (debe ser writable)
├── server.js                # Servidor HTTP
├── index.html               # Entry point SPA
├── app.js                   # Frontend logic
├── styles.css               # Design system
└── .agents/                 # Config MCP + skills n8n
```

---

## Despliegue n8n Self-Hosted (Legacy)

### Modo Single (Desarrollo/Producción Pequeña)
**Archivo:** `.agents/skills/n8n-self-hosting/assets/docker-compose.single.yml`

```yaml
services:
  caddy:
    image: caddy:2
    ports: ["80:80", "443:443"]
    volumes: ["./Caddyfile:/etc/caddy/Caddyfile", "caddy_data:/data", "caddy_config:/config"]
  
  n8n:
    image: n8nio/n8n:latest
    environment:
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_SECURE_COOKIE: "true"
      N8N_DIAGNOSTICS_ENABLED: "false"
      N8N_BLOCK_ENV_ACCESS_IN_NODE: "true"
      N8N_RUNNERS_ENABLED: "true"
      N8N_DEFAULT_BINARY_DATA_MODE: "filesystem"
      EXECUTIONS_DATA_PRUNE: "true"
      EXECUTIONS_DATA_MAX_AGE: "336"
      EXECUTIONS_DATA_MAX_COUNT: "50000"
    volumes: ["n8n_data:/home/node/.n8n"]
    depends_on: [caddy]
```

**Características:**
- Caddy: TLS automático, reverse proxy
- n8n: Proceso único, SQLite, binarios en filesystem
- n8n NO expuesto al host (solo red privada)

### Modo Queue (Producción Escalable)
**Archivo:** `.agents/skills/n8n-self-hosting/assets/docker-compose.queue.yml`

```yaml
services:
  caddy: { ... }
  redis: { image: redis:7-alpine }
  postgres: 
    image: postgres:15
    environment: { POSTGRES_DB: n8n, POSTGRES_USER: n8n, POSTGRES_PASSWORD_FILE: /run/secrets/pg_password }
  n8n-main:
    image: n8nio/n8n:latest
    command: start
    environment: *n8n-env  # anchor compartido
    depends_on: [redis, postgres]
  n8n-worker:
    image: n8nio/n8n:latest
    command: worker --concurrency=5
    deploy: { replicas: 2 }
    environment: *n8n-env
    depends_on: [redis, postgres]
```

**Características:**
- PostgreSQL para metadatos, Redis/Bull para cola
- Workers escalables (`docker compose up -d --scale n8n-worker=N`)
- Binarios en BD (`N8N_DEFAULT_BINARY_DATA_MODE=database`)

### Caddyfile (Ambos Modos)
```caddy
{$N8N_SUBDOMAIN}.{$N8N_DOMAIN} {
    reverse_proxy n8n:5678 {
        flush_interval -1
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
    header {
        Strict-Transport-Security "max-age=31536000"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

---

## Reglas de Secretos (Legacy)

| Regla | Implementación |
|---|---|
| **NUNCA commitear `.env`** | Solo `.env.example` en repo |
| **Generar secrets fresco** | `openssl rand -base64 32` por entorno |
| **N8N_ENCRYPTION_KEY** | Igual en main y workers (queue mode), backup obligatorio |
| **Backups** | Fuera del servidor, rotación regular |

---

## Diferencias vs Arquitectura Actual

| Aspecto | Legacy | Actual (Fase 2+) |
|---|---|---|
| **App TSJ** | Node.js vanilla en servidor | Tauri (desktop) / Capacitor (mobile) / Vite (web) |
| **Backend** | Node.js http + SQLite | NestJS + GraphQL + PostgreSQL + MinIO |
| **n8n** | Self-hosted Docker + Caddy | Diferido (contratos únicamente) |
| **BD Local** | SQLite sync | RxDB (IndexedDB) + WASM |
| **Desktop** | No | Tauri v2 (Rust backend) |
| **Mobile** | No | Capacitor 6 + Ionic |
| **Sync** | No | Offline-first, append-only, document_outbox |
| **Secrets** | .env local | Vault / GitHub Secrets / Doppler |
| **CI/CD** | No | GitHub Actions (lint, test, build, deploy) |

---

## Checklist Migración Despliegue

- [ ] Dockerfile para apps/web (Vite build → Nginx)
- [ ] Dockerfile para apps/desktop (Tauri build)
- [ ] Dockerfile para apps/mobile (Capacitor build)
- [ ] docker-compose.yml monorepo (Turbo + shared deps)
- [ ] GitHub Actions: typecheck → test → build → deploy preview
- [ ] Secrets management (GitHub Environments + Vault)
- [ ] Preview deployments por PR
- [ ] Production deploy con approval gate
- [ ] Health checks + monitoring (Sentry, Prometheus)
- [ ] Backup/restore strategy para PostgreSQL + MinIO