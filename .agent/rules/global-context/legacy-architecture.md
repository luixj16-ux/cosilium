---
trigger: always_on
---
# Arquitectura Legacy — CONSILIUM (Referencia Histórica)

> **ADVERTENCIA:** Arquitectura **LEGACY/OBSOLETA**. Ver `global-context.md` para arquitectura actual (Turborepo, TypeScript, React, Rust, RxDB, WASM).

## Vista Arquitectónica Legacy

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                          │
│                                                                     │
│  index.html ──────────────────────────────────────────────────┐    │
│  ├── styles.css (Google Fonts, FA 6.5.1 CDN)                  │    │
│  └── app.js (SPA Vanilla JS, estado global TSJ_STATE)         │    │
│        ├── Renderizado de vistas y modales                      │    │
│        ├── Navegación (tribunales → expedientes → detalles)     │    │
│        ├── Asistente virtual (matcher por keywords)             │    │
│        ├── Carrusel de noticias                                │    │
│        ├── Bibliotecas de leyes                                │    │
│        └── Persistencia localStorage (casos y tema)            │    │
│                                                                     │
│  Autenticación → fetch('/api/session')                              │
│  Login/Registro → fetch('/api/login'\|'/api/register')               │
│  Búsquedas → fetch('/api/search-records')                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTP / JSON (Cookie tsj_session)
┌───────────────────────────────▼─────────────────────────────────────┐
│                      SERVIDOR node.js (server.js)                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ handleApi(req, res) — Router de API REST                     │   │
│  │  GET  /api/session      → verifica sesión activa             │   │
│  │  POST /api/register     → crea usuario (role_id=1)           │   │
│  │  POST /api/login        → autentica por username o email     │   │
│  │  POST /api/logout       → destruye sesión                    │   │
│  │  POST /api/search-records → guarda búsqueda (auth)           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Servidor estático + MIME types                               │   │
│  │ - Traversión de path prevenida (path.normalize)              │   │
│  │ - Sirve index.html en raíz, archivos por ruta                │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ node:sqlite (DatabaseSync)
┌───────────────────────────────▼─────────────────────────────────────┐
│                          BASE DE DATOS SQLite                       │
│                       database/tsj.sqlite                           │
│                                                                     │
│  roles ──< users ──< user_sessions                                  │
│               │   └──< search_records                              │
│               └──< audit_events                                     │
│  courts ──< cases ──< case_activities                               │
│                  └──< case_documents                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Modelo de Ejecución Legacy

- **Híbrido SPA:** Una sola página HTML, tres vistas conmutables via `.view-section.active`, paneles con `hidden`
- **Dos fuentes de verdad:** SQLite (usuarios, sesiones, auditoría, búsquedas) + localStorage cliente (casos demo, tema)
- **Casos NO persisten en BD por API** — son demo en localStorage
- **Fetch API:** Frontend ↔ Backend solo para auth y registro búsquedas

## Flujo de Navegación Legacy

```
Inicio (courts)
  → grid de tribunales (7 jurisdicciones)
    → seleccionar tribunal (court-cases)
      → lista filtrable de expedientes
        → abrir modal 360° (case-detail)
          → historial de actuaciones, barra de progreso
          → [admin] agregar actuación / eliminar caso
          → [todos] descargar/imprimir PDF
      → [admin] crear nueva causa (new-case)
      → [todos] volver a home
```

## Diferencias Clave vs Arquitectura Actual

| Aspecto | Legacy | Actual (global-context.md) |
|---|---|---|
| **Monorepo** | No | Turborepo + npm workspaces |
| **Lenguaje** | JS Vanilla | TypeScript estricto |
| **Frontend** | Vanilla + innerHTML | React 18 + Vite |
| **Desktop** | No | Tauri v2 |
| **Mobile** | No | Capacitor 6 / Ionic |
| **BD Local** | SQLite sync | RxDB (IndexedDB) |
| **Crypto** | Node crypto | WebCrypto + WASM bridge |
| **Backend** | Node http | NestJS + GraphQL (fase 2) |
| **Sync** | No | Offline-first, append-only |
| **Tests** | 0 | Vitest + cargo test |
| **DDD** | No | 4 capas (Domain→App→Infra→UI) |