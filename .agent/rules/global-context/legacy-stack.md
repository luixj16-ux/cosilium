---
trigger: always_on
---
# Stack Tecnológico Legacy — CONSILIUM (Referencia Histórica)

> **ADVERTENCIA:** Documenta la arquitectura **LEGACY/OBSOLETA** (commit `673a594`). La arquitectura ACTUAL está en `global-context.md`.

## Backend Legacy

| Tecnología | Detalle |
|---|---|
| **Lenguaje** | Node.js (v22+) |
| **Servidor HTTP** | Módulo nativo `http` (sin Express, sin frameworks) |
| **Base de datos** | SQLite via `node:sqlite` (síncrono, `DatabaseSync`) |
| **Criptografía** | `crypto` (scrypt, SHA-256, timing-safe) |
| **Puerto** | `process.env.PORT \|\| 8080` |
| **Dependencias externas** | **Ninguna** — 0 paquetes npm |

## Frontend Legacy

| Tecnología | Detalle |
|---|---|
| **Lenguaje** | JavaScript Vanilla (ES6+) |
| **HTML** | HTML5 semántico `lang="es"` |
| **CSS** | Custom properties, grid, flexbox, media queries, animaciones |
| **Fuentes** | Google Fonts: Nunito Sans, Outfit, Plus Jakarta Sans (`@import`) |
| **Iconos** | Font Awesome 6.5.1 CDN |
| **Imágenes** | Unsplash CDN, 2 logos PNG, water-ring PNG |
| **Persistencia cliente** | localStorage (`tsj_venezuela_cases_v3`, `tsj_theme_v3`) |
| **Red** | Fetch API nativo, `Content-Type: application/json` |

## Base de Datos Legacy

| Aspecto | Detalle |
|---|---|
| **Motor** | SQLite (`database/tsj.sqlite`, 115KB) |
| **Interfaz** | `node:sqlite` síncrona (`DatabaseSync`) |
| **Tablas** | 9 (roles, users, user_sessions, courts, cases, case_activities, case_documents, audit_events, search_records) |
| **Índices** | 8 estratégicos |
| **Schema** | `database/schema.sql` (aplicado al arranque con `database.exec`) |
| **Seed data** | 2 roles + 1 usuario público |

## Estructura Archivos Legacy

```
cosilium/
├── .agents/                    # Config agentica + skills n8n (15 skills)
├── database/
│   ├── init-db.js              # Inicializador BD
│   ├── schema.sql              # Esquema SQL completo
│   └── tsj.sqlite              # BD pre-inicializada
├── app.js                      # Frontend principal (52KB, 1142 líneas)
├── app.1.js                    # Legacy/deprecado (38KB, 815 líneas)
├── index.html                  # HTML (32KB, 506 líneas)
├── server.js                   # Servidor HTTP (7.4KB, 166 líneas)
└── styles.css                  # Sistema diseño (44KB, 1552 líneas)
```

## Lo que NO Existe en Legacy

- ❌ `package.json` / `package-lock.json`
- ❌ `.env` (solo `.env.example`)
- ❌ Tests automatizados
- ❌ Lint/typecheck configuration
- ❌ Docker config raíz
- ❌ CI/CD