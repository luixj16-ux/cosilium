# CONSILIUM — Documentación Integral del Sistema

> **Visión de Arquitectura y Configuración del Sistema de Gestión Judicial (TSJ)**
> Documento maestro que consolida TODO el conocimiento de la aplicación: stack tecnológico, arquitectura, configuración agentica, patrones, estilos, rutas de evolución y decisiones técnicas.
>
> **Fecha de análisis:** 8 de septiembre de 2026
> **Autor técnico:** Análisis exhaustivo del repositorio

---

## Tabla de Contenidos

1. [Identidad y Propósito del Sistema](#1-identidad-y-propósito-del-sistema)
2. [Stack Tecnológico Completo](#2-stack-tecnológico-completo)
3. [Arquitectura General](#3-arquitectura-general)
4. [Servidor (Backend) — server.js](#4-servidor-backend--serverjs)
5. [Frontend — app.js, index.html, styles.css](#5-frontend--appjs-indexhtml-stylescss)
6. [Modelo de Datos — SQLite](#6-modelo-de-datos--sqlite)
7. [Sistema de Seguridad y Autenticación](#7-sistema-de-seguridad-y-autenticación)
8. [Sistema de Roles y Permisos](#8-sistema-de-roles-y-permisos)
9. [Sistema de Diseño y Estilos](#9-sistema-de-diseño-y-estilos)
10. [Configuración Agentica — AGENTS.md y Skills n8n](#10-configuración-agentica--agentsmd-y-skills-n8n)
11. [Configuración MCP y n8n](#11-configuración-mcp-y-n8n)
12. [Patrones de Diseño de Workflows n8n](#12-patrones-de-diseño-de-workflows-n8n)
13. [Datos de Demostración y Dominio](#13-datos-de-demostración-y-dominio)
14. [Control de Versiones (Git)](#14-control-de-versiones-git)
15. [Herramientas de Desarrollo](#15-herramientas-de-desarrollo)
16. [Arquitectura de Despliegue n8n Self-Hosted](#16-arquitectura-de-despliegue-n8n-self-hosted)
17. [Seguridad — Mejores Prácticas Documentadas](#17-seguridad--mejores-prácticas-documentadas)
18. [Estado Actual vs. Estado Futuro](#18-estado-actual-vs-estado-futuro)
19. [Deuda Técnica y Riesgos](#19-deuda-técnica-y-riesgos)
20. [Hoja de Ruta de Evolución](#20-hoja-de-ruta-de-evolución)
21. [Glosario Técnico](#21-glosario-técnico)

---

## 1. Identidad y Propósito del Sistema

### 1.1 Descripción General

**CONSILIIUM** (también referido como **IUSTITIA** en el banner de arranque del servidor) es un **Sistema de Gestión Judicial** que simula el portal oficial del **Tribunal Supremo de Justicia (TSJ) de la República Bolivariana de Venezuela**. Permite a ciudadanos consultar expedientes judiciales, navegar por jurisdicciones y tribunales, acceder a un biblioteca de leyes venezolanas, leer noticias judiciales, y a personal autorizado (administradores/funcionarios) crear, modificar y eliminar causas judiciales.

### 1.2 Marca e Identidad Visual

| Elemento | Valor |
|---|---|
| Nombre interno del servidor | IUSTITIA |
| Nombre del proyecto | CONSILIIUM |
| Marca pública | "Sistema de Gestión Judicial" |
| Título HTML | SISTEMA DE GESTIÓN JUDICIAL - TSJ |
| Subtítulo | Tribunal Supremo de Justicia • República Bolivariana de Venezuela |
| Idiomas | Español (Venezuela), locale `es-AR` para fechas |

### 1.3 Características Funcionales

- **Consulta pública** de expedientes por tribunal, número NUE, carátula, parte procesal o cédula
- **Autenticación** con registro de usuarios y sesiones persistentes (8 horas)
- **Roles diferenciados:** Invitado / Público Registrado / Funcionario TSJ (admin)
- **Panel de tribunales** con 7 jurisdicciones venezolanas y emblemas SVG vectoriales
- **Ficha 360° de expediente** (modal) con barra de progreso procesal y historial de actuaciones
- **Biblioteca jurídica** con 15 leyes venezolanas organizadas en 5 categorías
- **Noticias judiciales** en carrusel con rotación automática (6 segundos)
- **Asistente virtual** conversacional con detección por palabras clave
- **Modo claro/oscuro** con persistencia en localStorage
- **Panel institucional** (Misión, Visión, Compromiso)
- **Servicios al ciudadano** (consulta, trámites digitales, canales de atención)
- **Agenda judicial** (eventos programados)
- **Impresión/descarga en PDF** de expedientes (via `window.print()`)

---

## 2. Stack Tecnológico Completo

### 2.1 Backend

| Tecnología | Detalle |
|---|---|
| **Lenguaje** | Node.js (v22+ obligatorio) |
| **Servidor HTTP** | Módulo nativo `http` (sin Express, sin frameworks) |
| **Base de datos** | SQLite mediante `node:sqlite` (módulo nativo síncrono, DatabaseSync) |
| **Criptografía** | `crypto` (scrypt, SHA-256, timing-safe comparisons) |
| **Puerto** | `process.env.PORT || 8080` |
| **Dependencias externas** | **Ninguna** — 0 paquetes npm (solo módulos built-in) |

### 2.2 Frontend

| Tecnología | Detalle |
|---|---|
| **Lenguaje** | JavaScript Vanilla (ES6+) |
| **HTML** | HTML5 semántico con `lang="es"` |
| **CSS** | Custom properties, grid, flexbox, media queries, animaciones CSS |
| **Fuentes** | Google Fonts: Nunito Sans, Outfit, Plus Jakarta Sans (via `@import`) |
| **Iconos** | Font Awesome 6.5.1 via CDN |
| **Imágenes** | Unsplash (CDN), 2 logos propios PNG, water-ring transparent PNG |
| **Persistencia cliente** | localStorage (claves `tsj_venezuela_cases_v3`, `tsj_theme_v3`) |
| **Red** | Fetch API nativo con `Content-Type: application/json` |

### 2.3 Base de Datos

| Aspecto | Detalle |
|---|---|
| **Motor** | SQLite (archivo `database/tsj.sqlite`, 115KB) |
| **Interfaz** | `node:sqlite` síncrona (`DatabaseSync`) |
| **Tablas** | 9 (roles, users, user_sessions, courts, cases, case_activities, case_documents, audit_events, search_records) |
| **Índices** | 8 índices estratégicos |
| **Schema** | `database/schema.sql` (aplicado al arranque con `database.exec`) |
| **Seed data** | 2 roles + 1 usuario público predeterminado |

### 2.4 Estructura de Archivos

```
cosilium/
├── .agents/                        # Configuración agentica y skills n8n
│   ├── examples/                   # Ejemplos de workflows n8n y .env
│   ├── skills/                     # 15 skills de n8n (~100 archivos markdown)
│   │   ├── n8n-agents/
│   │   ├── n8n-binary-and-data/
│   │   ├── n8n-code-javascript/
│   │   ├── n8n-code-python/
│   │   ├── n8n-code-tool/
│   │   ├── n8n-error-handling/
│   │   ├── n8n-expression-syntax/
│   │   ├── n8n-mcp-tools-expert/
│   │   ├── n8n-multi-instance/
│   │   ├── n8n-node-configuration/
│   │   ├── n8n-self-hosting/
│   │   │   └── assets/             # Docker compose + Caddy + init scripts
│   │   ├── n8n-subworkflows/
│   │   ├── n8n-validation-expert/
│   │   ├── n8n-workflow-patterns/
│   │   └── using-n8n-mcp-skills/   # Router entry-point
│   ├── mcp_config.json             # Configuración del servidor MCP n8n
│   ├── start_mcp.sh / .ps1         # Scripts de arranque MCP
│   ├── import_workflows.js         # Script de importación de workflows
│   └── (6 archivos de imagen)      # Logos, capturas, water-ring
├── database/
│   ├── init-db.js                  # Inicializador de base de datos
│   ├── README.md                   # Documentación de la base de datos
│   ├── schema.sql                  # Esquema SQL completo
│   └── tsj.sqlite                  # Base de datos pre-inicializada
├── .git/                           # Repositorio git
├── AGENTS.md                       # Instrucciones para agentes de IA
├── app.js                          # Frontend principal (52KB, 1142 líneas)
├── app.1.js                        # Versión legacy/deprecada (38KB, 815 líneas)
├── index.html                      # Estructura HTML (32KB, 506 líneas)
├── server.js                       # Servidor HTTP (7.4KB, 166 líneas)
└── styles.css                      # Sistema de diseño (44KB, 1552 líneas)
```

**Conteo total:** 111 archivos (incluyendo `.git`), con un commit git único.

---

## 3. Arquitectura General

### 3.1 Vista Arquitectónica de Alto Nivel

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
│  Login/Registro → fetch('/api/login'|'/api/register')               │
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

### 3.2 Modelo de Ejecución

- **Híbrido SPA:** Una sola página HTML (`index.html`), tres vistas conmutables via clases `.view-section.active`, y múltiples paneles de portal con `hidden` attrs.
- **Dos fuentes de verdad:** La **base de datos SQLite** (rollos, usuarios, sesiones, auditoría, búsquedas) y el **localStorage del cliente** (casos demo, tema). Las causas judiciales **aún NO se persisten en la base de datos** por API — son demo en localStorage.
- **Fetch API:** El frontend comunica con el backend exclusivamente para autenticación y registro de búsquedas.

### 3.3 Flujo de Datos en Navegación

```
Inicio (courts)
  → grid de tribunales (7 jurisdicciones)
    → seleccionar tribunal (court-cases)
      → lista filtrable de expedientes
        → abrir modal 360° (case-detail)
          → historial de actuaciones, barra de progreso
          → [admin] agregar actuación / eliminar caso
          → [todos] descargar/imprimir PDF
    → (desde cualquier tribunal)
      → [admin] crear nueva causa (new-case)
      → [todos] volver a home
```

---

## 4. Servidor (Backend) — server.js

### 4.1 Configuración y Arranque

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 8080;
const databasePath = path.join(__dirname, 'database', 'tsj.sqlite');
const schemaPath = path.join(__dirname, 'database', 'schema.sql');
```

- Crea la carpeta `database/` recursivamente si no existe
- Abre la base SQLite (`DatabaseSync`) y aplica `schema.sql` al arranque (`database.exec`)
- Sirve en `http://localhost:8080` con mensaje "Servidor IUSTITIA ejecutándose en:"

### 4.2 MIME Types Registrados

| Extensión | MIME |
|---|---|
| `.html` | `text/html; charset=utf-8` |
| `.css` | `text/css; charset=utf-8` |
| `.js` | `text/javascript; charset=utf-8` |
| `.json` | `application/json` |
| `.png` | `image/png` |
| `.jpg` | `image/jpeg` |
| `.svg` | `image/svg+xml` |
| `.ico` | `image/x-icon` |

### 4.3 Funciones de Utilidad Internas

| Función | Propósito |
|---|---|
| `parseCookies(req)` | Parsea header `Cookie` a un objeto `{clave: valor}` |
| `hashToken(token)` | SHA-256 hex de un token de sesión |
| `hashPassword(password, salt)` | scrypt(password, salt, 64 bytes) → `salt:hash` |
| `verifyPassword(password, storedHash)` | Compara con `crypto.timingSafeEqual` |
| `readJson(req)` | Parsea body JSON (límite 10KB, manejo de errores) |
| `sendJson(res, status, payload, headers)` | Envía respuesta JSON con headers opcionales |
| `getCurrentUser(req)` | Devuelve usuario activo desde token de sesión |
| `createSession(res, userId)` | Crea sesión, genera token, establece cookie |
| `handleApi(req, res)` | Router de API — retorna `true` si la ruta fue atendida |

### 4.4 Endpoints API Completos

#### GET `/api/session`

**Query:**
```sql
SELECT u.id, u.username, u.full_name, u.email, r.name AS role
FROM user_sessions s
JOIN users u ON u.id = s.user_id
JOIN roles r ON r.id = u.role_id
WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.active = 1
```

**Response 200:**
```json
{ "authenticated": true|false, "user": { "id": 1, "username": "...", "full_name": "...", "email": "...", "role": "public" } | null }
```

#### POST `/api/register`

**Validaciones (rechazo 400 si falla alguna):**
- `username`: `/^[a-z0-9._-]{4,40}$/` (minúsculas, números, punto, guion bajo, guion)
- `fullName.length >= 3`
- `email.includes('@')`
- `password.length >= 8`

**Lógica:** Inserta usuario con `role_id = 1` (public), crea sesión, devuelve 201.

**Errores:** `SQLITE_CONSTRAINT_UNIQUE` → 409 "El usuario o correo ya está registrado."

#### POST `/api/login`

- Busca usuario por `username` O `email` (ambos normalizados a minúsculas) con `active = 1`
- Verifica contraseña con `verifyPassword`
- Registra evento de auditoría: `INSERT INTO audit_events (user_id, action, entity_type, entity_id) VALUES (?, 'login', 'user', ?)`
- Fallo → 401 "Usuario o contraseña incorrectos."

#### POST `/api/logout`

- Elimina fila de `user_sessions` por token hash
- Establece cookie `tsj_session=; Max-Age=0` para limpiarla

#### POST `/api/search-records`

- **Requiere autenticación** (401 si no hay usuario)
- Inserta en `search_records`: query_text (limitado a 200 chars), court_id (nullable), result_count, source='portal'

### 4.5 Seguridad de Parámetros en el Servidor

- **Path traversal protection:** `path.normalize(reqUrl)` + regex `/^(\.\.[\/\\])+/` para eliminar `..`
- **Payload size limit:** 10KB para JSON
- **Contraseñas nunca en texto plano:** scrypt con salt aleatorio de 16 bytes, salida 64 bytes hex
- **Cookies HttpOnly + SameSite=Lax** (no accesible por JS en el cliente)
- **Timing-safe comparison** para verificar contraseñas

---

## 5. Frontend — app.js, index.html, styles.css

### 5.1 Estado Global (`TSJ_STATE`)

```javascript
const TSJ_STATE = {
  currentView: 'courts',        // 'courts' | 'court-cases' | 'new-case'
  currentCourtId: null,          // id del tribunal seleccionado
  userRole: 'public',            // 'public' | 'admin'
  authenticated: false,
  user: null,                    // usuario autenticado desde API
  theme: 'light',                // 'light' | 'dark'
  activeCaseId: null,            // expediente en modal
  courts: [...],                 // 7 jurisdicciones con SVG emblems
  cases: []                      // expedientes (desde localStorage o demo)
};
```

### 5.2 Funciones Principales del Frontend

| Función | Responsabilidad |
|---|---|
| `startTSJApp()` | Init: carga localStorage, setup auth, renderiza todo |
| `setupAuthentication()` | Login/Registro: forms, fetch API, applyAuthenticatedUser |
| `applyAuthenticatedUser(user)` | Actualiza estado de auth y UI de rol |
| `apiRequest(path, options)` | Wrapper de fetch con manejo de errores JSON |
| `setupPortalTabs()` | Pestañas: tribunales, leyes, institucional, servicios, agenda |
| `setupVirtualAssistant()` | Chat contextual con match por palabras clave |
| `renderCourtsGrid()` | Tarjetas de 7 tribunales con SVG emblems y conteo de casos |
| `selectCourt(courtId)` | Navegación → vista de expedientes del tribunal |
| `renderCourtCasesList(filterTerm)` | Lista filtrada de causas (NUE, carátula, actor, demandado, juzgado) |
| `openCaseDetail(caseId)` | Modal 360° con progreso procesal y actuaciones |
| `openNewCaseForCurrentCourt()` | Formulario admin de nueva causa |
| `handleAdminSubmitNewCase(e)` | Crea causa con NUE auto-generado |
| `handleSaveActuation(e)` | Agrega actuación procesal con auto-foliatura |
| `deleteActiveCase()` | Eliminación admin con confirmación |
| `renderLawTabs()` | Biblioteca de leyes con pestañas por categoría |
| `renderLegalNews()` | Carrusel de noticias (4 items, rotación 6s) |
| `setNewsSlide(index)` | Cambio de slide con aria-live y dots |
| `requireAuthentication()` | Gate para secciones protegidas |
| `showTSJToast(msg, type)` | Notificaciones toast (success/warning/info) |
| `toggleTheme()` | Cambio claro/oscuro persistente |
| `openModal(id)` / `closeModal(id)` | Utilidades de modales |

### 5.3 Convenciones de Claves localStorage

| Clave | Contenido |
|---|---|
| `tsj_venezuela_cases_v3` | JSON array de casos (persistencia de expedientes) |
| `tsj_theme_v3` | `'light'` o `'dark'` |
| `tsj_user_role_v3` | Solo en app.1.js legacy (removido en versión actual) |

### 5.4 Estructura de Código y Estilo

- **Sin framework:** JavaScript Vanilla, funciones globales, handlers inline `onclick`
- **Rendereo por innerHTML:** Templates strings con interpolación `${}`
- **Eventos:** `addEventListener` para forms y tabs; atributos `onclick` en botones
- **Persistencia:** `saveTSJData()` escribe el array `TSJ_STATE.cases` completo a localStorage
- **Formato de fechas:** `new Date().toLocaleDateString('es-AR')` (dd/mm/yyyy)
- **IDs de casos nuevos:** `'CASE-' + Date.now()`
- **Números NUE:** `EXP-2026-00${nextNum}-${COURT_CODE}` donde `nextNum = cases.length + 101`

### 5.5 index.html — Estructura de Vistas

```
<body>
  ├── .water-ring-background (imagen decorativa, oculta por defecto)
  ├── header.clean-header
  │   ├── .brand-section (logo SVG + Dama de Justicia SVG + títulos)
  │   │   └── .header-emblems-group (sustituido por PNG via CSS)
  │   ├── nav.portal-tabs (5 pestañas)
  │   └── .header-auth-section (role badge + login btn + theme toggle)
  ├── .breadcrumb-bar
  ├── main.app-content
  │   ├── #view-courts (homescreen)
  │   │   ├── .tsj-hero-header (banner institucional)
  │   │   ├── #courts-panel (grid de tribunales)
  │   │   ├── #laws-panel (biblioteca jurídica)
  │   │   ├── #institution-panel (misión/visión/compromiso)
  │   │   ├── #services-panel (servicios al ciudadano)
  │   │   ├── #agenda-panel (agenda judicial)
  │   │   └── .news-carousel-section (noticias)
  │   ├── #view-court-cases (expedientes por tribunal)
  │   └── #view-new-case (formulario admin)
  ├── Modales
  │   ├── #modal-login (login/registro)
  │   ├── #modal-case-detail (ficha 360°)
  │   └── #modal-add-actuation (agregar actuación)
  ├── .toast-stack
  ├── .assistant-launcher + .virtual-assistant (widget chat)
  └── script src="app.js"
```

### 5.6 Elementos de Accesibilidad

- `aria-label` en botones y tarjetas
- `aria-live="polite"` en mensajes del asistente
- `aria-selected` en tabs del portal
- `aria-hidden` en slides inactivos del carrusel
- `role="dialog"`, `aria-modal`, `aria-labelledby` en asistente
- `lang="es"` en `<html>`
- Clase `.sr-only` para texto solo-screenreader
- `tabindex="0"` y `onkeydown` (Enter/Espacio) en tarjetas clicables

---

## 6. Modelo de Datos — SQLite

### 6.1 Esquema de Base de Datos (`database/schema.sql`)

#### Tabla `roles`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `name` | TEXT | NOT NULL, UNIQUE |
| `description` | TEXT | NOT NULL |

**Seed:** (1, 'public', 'Consulta pública de expedientes y normativa'), (2, 'admin', 'Gestión autorizada de expedientes y actuaciones')

#### Tabla `users`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `role_id` | INTEGER | NOT NULL, REFERENCES roles(id) |
| `username` | TEXT | NOT NULL, UNIQUE |
| `full_name` | TEXT | NOT NULL |
| `email` | TEXT | UNIQUE (nullable) |
| `password_hash` | TEXT | (scrypt format `salt:hash`) |
| `active` | INTEGER | DEFAULT 1, CHECK (0/1) |
| `created_at` / `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### Tabla `user_sessions`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | NOT NULL, REFERENCES users(id) ON DELETE CASCADE |
| `token_hash` | TEXT | NOT NULL, UNIQUE (SHA-256 del token) |
| `expires_at` | TEXT | NOT NULL |
| `created_at` / `last_seen_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### Tabla `courts`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | TEXT | PRIMARY KEY (ej: 'lopnna', 'penal') |
| `name` | TEXT | NOT NULL |
| `description` | TEXT | NOT NULL |
| `category` | TEXT | NOT NULL |
| `jurisdiction` | TEXT | nullable |
| `active` | INTEGER | DEFAULT 1, CHECK (0/1) |
| `created_at` / `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### Tabla `cases`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `public_id` | TEXT | NOT NULL, UNIQUE |
| `court_id` | TEXT | NOT NULL, REFERENCES courts(id) |
| `docket_number` | TEXT | NOT NULL, UNIQUE |
| `title` | TEXT | NOT NULL |
| `subject` | TEXT | NOT NULL |
| `plaintiff` | TEXT | NOT NULL |
| `defendant` | TEXT | NOT NULL |
| `attorney` | TEXT | nullable |
| `amount` | REAL | DEFAULT 0 |
| `status` | TEXT | CHECK: 'En Trámite' \| 'Autos para Sentencia' \| 'Apertura a Prueba' \| 'Sentencia Dictada' \| 'Archivado' |
| `pages` | INTEGER | DEFAULT 0, CHECK >= 0 |
| `filed_at` / `last_activity_at` | TEXT | nullable |
| `created_at` / `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### Tabla `case_activities`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `case_id` | INTEGER | NOT NULL, REFERENCES cases(id) ON DELETE CASCADE |
| `activity_date` | TEXT | NOT NULL |
| `activity_type` | TEXT | NOT NULL |
| `summary` | TEXT | NOT NULL |
| `signed_by` | TEXT | NOT NULL |
| `page_range` | TEXT | nullable |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### Tabla `case_documents`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `case_id` | INTEGER | NOT NULL, REFERENCES cases(id) ON DELETE CASCADE |
| `activity_id` | INTEGER | REFERENCES case_activities(id) ON DELETE SET NULL |
| `file_name` | TEXT | NOT NULL |
| `storage_key` | TEXT | NOT NULL, UNIQUE |
| `mime_type` | TEXT | NOT NULL |
| `file_size` | INTEGER | NOT NULL, CHECK >= 0 |
| `sha256` | TEXT | nullable |
| `uploaded_by` | INTEGER | REFERENCES users(id) |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

**Nota:** Los archivos NO se guardan dentro de SQLite — solo los metadatos. Se asume almacenamiento en filesystem/S3 externo.

#### Tabla `audit_events`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| `action` | TEXT | NOT NULL (ej: 'login') |
| `entity_type` | TEXT | NOT NULL |
| `entity_id` | TEXT | NOT NULL |
| `ip_address` | TEXT | nullable |
| `metadata_json` | TEXT | nullable |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### Tabla `search_records`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | NOT NULL, REFERENCES users(id) ON DELETE CASCADE |
| `query_text` | TEXT | NOT NULL (limitado a 200 chars en API) |
| `court_id` | TEXT | REFERENCES courts(id) ON DELETE SET NULL |
| `result_count` | INTEGER | DEFAULT 0, CHECK >= 0 |
| `source` | TEXT | DEFAULT 'portal' |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

### 6.2 Índices de Base de Datos

```sql
idx_cases_court_id            ON cases(court_id)
idx_cases_status              ON cases(status)
idx_cases_last_activity       ON cases(last_activity_at DESC)
idx_case_activities_case_date ON case_activities(case_id, activity_date DESC)
idx_audit_events_entity       ON audit_events(entity_type, entity_id)
idx_cases_search              ON cases(docket_number, title, plaintiff, defendant)
idx_sessions_token            ON user_sessions(token_hash)
idx_search_records_user_date  ON search_records(user_id, created_at DESC)
```

### 6.3 Modelo Entidad-Relación Conceptual

```
roles (1) ──< (N) users
users (1) ──< (N) user_sessions
users (1) ──< (N) search_records
users (1) ──< (N) audit_events
courts (1) ──< (N) cases
cases (1) ──< (N) case_activities
cases (1) ──< (N) case_documents
case_activities (1) ──< (N) case_documents (FK SET NULL)
```

---

## 7. Sistema de Seguridad y Autenticación

### 7.1 Gestión de Contraseñas

- **Algoritmo:** scrypt (Node.js `crypto.scryptSync`)
- **Parámetros:** 64 bytes de salida, salt aleatorio 16 bytes
- **Formato almacenado:** `salt:hash` (ambos hex)
- **Verificación:** `crypto.timingSafeEqual` para evitar timing attacks

### 7.2 Sesiones

- **Token:** 32 bytes aleatorios (`crypto.randomBytes(32).toString('hex')`)
- **Almacenamiento:** SHA-256 del token en BD (hash token, no token plano)
- **TTL:** 8 horas (`Max-Age=28800`)
- **Cookie:** `tsj_session=<token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`
- **Verificación:** join de sesiones con usuarios y roles, `expires_at > datetime('now')`, `active = 1`

### 7.3 Endpoints de Autenticación

| Endpoint | Método | Auth Requerida | Propósito |
|---|---|---|---|
| `/api/session` | GET | No (autodetecta) | Verifica y devuelve sesión actual |
| `/api/register` | POST | No | Registro público (rol automático) |
| `/api/login` | POST | No | Inicio de sesión por username/email |
| `/api/logout` | POST | Sesión | Cierre de sesión |
| `/api/search-records` | POST | **Sí** | Registro de búsquedas |

### 7.4 Nota sobre Roles Admin

- El rol `admin` existe en la BD pero **no hay ruta de registro admin**.
- El `app.1.js` legacy tenía `loginAsRole('admin')` que simplemente cambiaba el rol en localStorage (inseguro).
- La versión actual (`app.js`) vincula el rol al usuario autenticado (confiable), pero **no hay un mecanismo documentado para crear usuarios admin** en producción.

---

## 8. Sistema de Roles y Permisos

### 8.1 Matriz de Permisos (Frontend)

| Capacidad | Invitado | Público Registrado | Funcionario (Admin) |
|---|---|---|---|
| Ver home y tribunales | ✓ (con gate login) | ✓ | ✓ |
| Ver leyes y normativa | ✗ (requiere login) | ✓ | ✓ |
| Ver expedientes por tribunal | ✓ (requiere login) | ✓ | ✓ |
| Buscar expedientes | ✓ | ✓ | ✓ |
| Ver ficha 360° | ✓ | ✓ | ✓ |
| Guardar búsquedas | ✗ (401) | ✓ | ✓ |
| Descargar/imprimir PDF | ✓ | ✓ | ✓ |
| Agregar actuación | ✗ | ✗ | ✓ |
| Crear nueva causa | ✗ | ✗ | ✓ |
| Eliminar/dar de baja causa | ✗ | ✗ | ✓ |
| Autenticación (registro/login) | ✓ | N/A | N/A |

### 8.2 Implementación en UI

- El badge de rol muestra: `Invitado` / `Público` / `Funcionario TSJ`
- Botón "Nueva Causa" (`#btn-admin-new-case`) oculto salvo rol admin
- Botones "Agregar Actuación" y "Dar de Baja" (`#btn-admin-delete`, `#btn-admin-add-act`) solo visibles en modal con rol admin
- Banner "Modo Consulta Pública Activo" visible para no-admin
- Tabs de leyes y paneles requieren `requireAuthentication()` (gate que abre modal login)

### 8.3 Modelo de Estados de Autenticación

```
Tres estados posibles:
1. No autenticado → "Invitado", botón "Registrarse / Entrar"
2. Autenticado + rol public → "Público", nombre del usuario
3. Autenticado + rol admin → "Funcionario TSJ", botón "Modo Funcionario Activo"
```

---

## 9. Sistema de Diseño y Estilos

### 9.1 Paleta de Colores — Tema Claro

| Variable | Valor | Uso |
|---|---|---|
| `--bg-app` | `#eef8f8` | Fondo app |
| `--bg-card` | `#ffffff` | Tarjetas |
| `--bg-header` | `rgba(255,255,255,0.94)` | Header (blur) |
| `--text-main` | `#12333d` | Texto principal (azul-navy tinge) |
| `--tsj-navy` | `#12333d` | Azul navy TSJ |
| `--tsj-blue-dark` | `#164b59` | Azul oscuro |
| `--tsj-blue-primary` | `#087f8c` | **Azul primario institucional** |
| `--tsj-blue-medium` | `#18a6a6` | Azul medio |
| `--tsj-blue-light` | `#49c6c0` | Azul claro |
| `--tsj-blue-surface` | `#dff4f2` | Superficie azul |
| `--tsj-blue-subtle` | `#effafa` | Azul sutil (fondo) |
| `--tsj-gold` | `#e19a5a` | **Dorado acento** |
| `--tsj-gold-light` | `#f1b477` | Dorado claro |
| `--status-success` | `#159a82` | Verde (éxito) |
| `--status-urgent` | `#d95d62` | Rojo (urgente) |
| `--status-amber` | `#d88942` | Ámbar (aviso) |

### 9.2 Paleta — Tema Oscuro (`[data-theme="dark"]`)

| Variable | Valor |
|---|---|
| `--bg-app` | `#060e1a` |
| `--bg-card` | `#0c1a2e` |
| `--bg-card-hover` | `#10233d` |
| `--bg-header` | `rgba(12,26,46,0.96)` |
| `--text-main` | `#f0f6fe` |
| `--tsj-blue-surface` | `#132d52` |
| `--tsj-blue-subtle` | `#0a1b33` |

### 9.3 Tipografía

| Función | Fuente | Tamaño Base |
|---|---|---|
| Body | `Nunito Sans` | 15.5px, peso 400-800 |
| Títulos | `Outfit` / `Plus Jakarta Sans` | 1.15-2.2rem, peso 800-900 |
| Mono (NUE) | monospace (system) | 0.84rem |

Import vía `@import url('https://fonts.googleapis.com/...')`.

### 9.4 Radii y Sombras

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 22px;
--radius-xl: 28px;
--radius-pill: 9999px;

--shadow-sm:  0 2px 8px rgba(18,51,61,0.05);
--shadow-card: 0 6px 20px rgba(18,51,61,0.07);
--shadow-hover: 0 12px 32px rgba(18,51,61,0.14);
--shadow-primary: 0 6px 18px rgba(8,127,140,0.25);
```

### 9.5 Componentes CSS Principales

1. **Header institucional** — sticky, backdrop-blur 14px, logo PNG y emblemas SVG
2. **Hero banner** — gradiente `#092c53 → #0d47a1 → #1565c0`, badge oficial pill, service signals
3. **Portal tabs** — 5 tabs flex, borde inferior gradient, indicador dorado (`::after`)
4. **Tribunal cards** — gradiente, hover translateX, emblema SVG, category pill, count badge
5. **Law portal** — sticky sidebar (top:96px), tabs pill, law-item cards
6. **News carousel** — grid de 2 columnas (imagen + story), dots, slideIn animation
7. **Case items** — card con NUE tag monospace, title, sub-meta, state badge, action buttons
8. **Process step bar** — 4 pasos con dots: completed (azul), active (cyan glow)
9. **Modales** — overlay blur 8px, modal box scale-in, header gradient, body scrollable
10. **Toast stack** — fixed bottom-right, 3.2s auto-dismiss, border-left color por tipo
11. **Virtual assistant** — launcher flotante 62px, chat card, quick actions, composer
12. **Institution grid** — 3 cards, featured card con borde dorado
13. **Interest grid** — cards gradient navy con decorative circle `::after`
14. **Agenda list** — grid 84px/1fr/auto, border-left dorado, date block

### 9.6 Responsividad

**Breakpoint 768px (móvil):**
- Header se apila en columna
- Portal tabs pasan a grid 2 columnas (último ocupa ancho completo)
- Institution/interest grids → 1 columna
- News carousel → 1 columna (imagen arriba)
- Case items apilados verticalmente

**Breakpoint 900px:**
- `tribunales-layout` (2 columnas) → 1 columna

### 9.7 Animaciones

```css
@keyframes panelReveal { from { opacity:0; transform: translateY(6px); } }
@keyframes assistantIn { from { opacity:0; transform: translateY(10px) scale(0.98); } }
@keyframes slideIn { from { transform: translateY(12px); opacity:0; } }
```

---

## 10. Configuración Agentica — AGENTS.md y Skills n8n

### 10.1 AGENTS.md — Instrucciones para Agentes de IA

El archivo `AGENTS.md` en la raíz define el rol del agente como **experto en n8n automation usando n8n-MCP tools**. Establece 5 principios centrales:

1. **Ejecución Silenciosa** — Ejecutar herramientas sin comentarios, responder solo después de completar.
2. **Ejecución en Paralelo** — Operaciones independientes se ejecutan simultáneamente.
3. **Plantillas Primero** — Siempre verificar templates n8n antes de construir desde cero.
4. **Validación Multi-nivel** — `validate_node minimal → full → validate_workflow`.
5. **Nunca Confiar en Defaults** — Configurar explícitamente todos los parámetros.

**Proceso de workflow de 7 pasos:**
1. `tools_documentation()` para mejores prácticas
2. Descubrimiento de templates (`search_templates` en 4 modos)
3. Descubrimiento de nodos (`search_nodes`)
4. Fase de configuración (`get_node` en 4 niveles de detalle)
5. Fase de validación (`validate_node` minimal/full)
6. Fase de construcción (desde template validado)
7. Validación final del workflow completo

### 10.2 Sistema de Skills (15 skills)

El directorio `.agents/skills/` contiene una **librería completa de skills n8n** organizados en jerarquía:

#### Skills de Uso de Herramientas
| Skill | Propósito |
|---|---|
| **using-n8n-mcp-skills** | Router entry-point: rutea al skill correcto, reglas no negociables, índice de skills |
| **n8n-mcp-tools-expert** | Guía maestra de uso de herramientas MCP: selección, formatos de nodos, patrones |

#### Skills de Arquitectura
| Skill | Propósito |
|---|---|
| **n8n-workflow-patterns** | 6 patrones arquitectónicos (webhook, API, database, AI, scheduled, batch) |
| **n8n-subworkflows** | Workflows reutilizables y componibles (Execute Workflow, all/each) |

#### Skills de Configuración
| Skill | Propósito |
|---|---|
| **n8n-node-configuration** | Configuración por operación, dependencias, displayOptions |
| **n8n-expression-syntax** | Sintaxis de expresiones `{{ }}`, `$json`, `$node` |
| **n8n-agents** | Diseño de agentes AI (model/slots, tools, memory, outputParser, RAG, human review) |

#### Skills de Código
| Skill | Propósito |
|---|---|
| **n8n-code-javascript** | Code nodes JS: `$input`, `$json`, `$helpers`, DateTime, SplitInBatches |
| **n8n-code-python** | Code nodes Python: `_input`, `_json`, límites de stdlib |
| **n8n-code-tool** | Custom Code Tool (agent-callable): string in/out, sin `$fromAI`/`$input` |

#### Skills de Datos/Errores
| Skill | Propósito |
|---|---|
| **n8n-binary-and-data** | Manejo de archivos/binarios: `$binary`, CDN, boundary agent-tool |
| **n8n-error-handling** | Manejo de errores: onError, continueErrorOutput, retries, 4xx/5xx |
| **n8n-validation-expert** | Interpretación de errores de validación, auto-fix, checklist |

#### Skills de Infraestructura
| Skill | Propósito |
|---|---|
| **n8n-self-hosting** | Despliegue de n8n self-hosted (Docker Compose + Caddy, single/queue mode) |
| **n8n-multi-instance** | Gestión de múltiples instancias n8n (targeting, fail-closes) |

### 10.3 Reglas No Negociables (del router skill)

1. **Invoca el skill relevante antes de cualquier acción n8n**
2. **Valida Y verifica antes de activar** — `validate_workflow` antes, `n8n_get_workflow` después para inspeccionar `connections`
3. **Los secretos nunca van en campos de texto** — usar sistema de credentials n8n

### 10.4 Tabla de Red Flags (auto-detección de errores)

| Pensamiento | Invocar Skill |
|---|---|
| "Este workflow es simple, lo construyo" | `n8n-workflow-patterns` |
| "Añado un nodo Set para mapear" | `n8n-expression-syntax` |
| "Usaré un Code node, es más fácil" | `n8n-code-javascript` |
| "El usuario mencionó datos, escribiré Python" | `n8n-code-javascript` (default JS) |
| "Estoy escribiendo código que un agente AI llamará" | `n8n-code-tool` |
| "Matemáticas de fechas — uso un nodo DateTime" | `n8n-expression-syntax` |
| "Voy a cablear un Merge con 3 fuentes" | `n8n-node-configuration` |
| "La validación pasó, activo ya" | `n8n-validation-expert` + `n8n-workflow-patterns` |
| "La validación lanzó un error que no entiendo" | `n8n-validation-expert` |
| "Referenciaré `$json.x` aquí" | `n8n-expression-syntax` |
| "Este webhook es solo happy-path" | `n8n-error-handling` |
| "Pasaré este archivo por JSON" | `n8n-binary-and-data` |
| "Conectaré un agente AI con herramientas" | `n8n-agents` |
| "Copiaré esta lógica a otro workflow" | `n8n-subworkflows` |
| "Crearé esa credential / abriré ese workflow" (multi-instancia) | `n8n-multi-instance` |

### 10.5 Herramientas MCP Documentadas

**Documentación y descubrimiento:**
- `tools_documentation` — meta-docs
- `search_nodes` — encontrar nodos por keyword
- `get_node` — info del nodo (short-form nodeType: `nodes-base.set`)
- `validate_node` — validar un nodo aislado
- `search_templates` / `get_template` — librería de templates

**Build y edición:**
- `n8n_create_workflow` — crear desde JSON completo
- `n8n_update_partial_workflow` — edición incremental (addNode, updateNode, patchNodeField, addConnection, setNodeGroups, activateWorkflow)
- `n8n_update_full_workflow` — reemplazo completo
- `n8n_autofix_workflow` — auto-corrección
- `n8n_deploy_template` — desplegar template

**Validación:**
- `validate_workflow` — JSON complete (node types LONG-form `n8n-nodes-base.set`)
- `n8n_validate_workflow` — por ID

**Inspección y ciclo de vida:**
- `n8n_get_workflow` — fetch con modos (full/structure/active/filtered/minimal)
- `n8n_list_workflows`, `n8n_delete_workflow`, `n8n_workflow_versions`, `n8n_instances`, `n8n_health_check`

**Test y ejecución:**
- `n8n_test_workflow` — ejecuta nodos reales (efectos secundarios)
- `n8n_executions` — listar/inspeccionar ejecuciones
- `n8n_evaluations` — evaluaciones (n8n ≥ 2.30/2.32)

**Datos, folders, credentials, auditoría:**
- `n8n_manage_datatable` — Data Table CRUD
- `n8n_manage_folders` — Folder CRUD
- `n8n_manage_credentials` — Credential CRUD + getSchema
- `n8n_audit_instance` — auditoría de seguridad

**Trampa de formato de node type:**
- `get_node`/`validate_node` → SHORT form (`nodes-base.set`)
- Workflow JSON en `validate_workflow`/`n8n_create_workflow` → LONG form (`n8n-nodes-base.set`)

---

## 11. Configuración MCP y n8n

### 11.1 mcp_config.json

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

- **Tipo:** stdio local
- **API key:** vacía (placeholder — debe completarse)
- **Ruta al binario:** Windows (`Users\Usuario\AppData`)
- **Instancia n8n:** `http://localhost:5678`

### 11.2 .env.example (integracion n8n/MCP)

```
N8N_API_URL=http://localhost:5678
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=REPLACE_WITH_YOUR_API_KEY
```

### 11.3 Scripts de Arranque MCP

**`start_mcp.sh` (POSIX):**
1. Carga `.env` o `.agents/examples/.env.example` (allexport)
2. Verifica existencia de `mcp_config.json`
3. Usa node para parsear config JSON y spawn `node <args>` con stdio inherit

**`start_mcp.ps1` (PowerShell):**
1. `Set-StrictMode -Version Latest`
2. Carga `.env` o `.env.example` (parsing línea por línea)
3. Usa node para extraer `{cmd, args}` del config
4. Ejecuta `& $cmd $args`

### 11.4 import_workflows.js

Script Node que:
1. Carga `.env` o `.agents/examples/.env.example`
2. Determina `N8N_API_URL` (default `http://localhost:5678`) y API key
3. POSTea cada JSON `.json` en `.agents/examples/` a `${N8N_API_URL}/workflows`
4. Usa headers `X-N8N-API-KEY` y `Authorization: Bearer <key>` si hay key
5. Maneja http/https, reporta éxito/fallo

### 11.5 Ejemplos de Workflows (`.agents/examples/`)

**`tool_workflow_example.json` — "Tool: echo_tool":**
- Nodes: `Execute Workflow Trigger` → `Set` ("Return Echo")
- Trigger define `workflowInputs.values = [{name: 'text', type: 'string'}]`
- Set: `{ "echo": "={{ $json.text }}" }`
- Muestra el patrón de un sub-workflow como Herramienta (tool) n8n

**`tool_caller_example.json` — "Caller: call_echo_tool":**
- Nodes: `Manual Trigger` → `Set` ("Set Input" con text="Hello from caller") → `Execute Workflow` (llama a "Tool: echo_tool")
- Muestra el patrón Caller (quien invoca la herramienta)

Estos ejemplos demuestran el patrón de **sub-workflow como herramienta** (`.toolWorkflow`) que el skill n8n-agents describe como "the canonical n8n way — default when in doubt".

---

## 12. Patrones de Diseño de Workflows n8n

### 12.1 Los 6 Patrones Core (documentados en el skill)

| # | Patrón | Cadena de nodos |
|---|---|---|
| 1 | **Webhook Processing** (35%) | Webhook → Validate → Transform → Respond/Notify |
| 2 | **HTTP API Integration** | Trigger → HTTP Request → Transform → Action → Error Handler |
| 3 | **Database Operations** | Schedule → Query → Transform → Write → Verify |
| 4 | **AI Agent Workflow** | Trigger → AI Agent (Model + Tools + Memory) → Output |
| 5 | **Scheduled Tasks** | Schedule → Fetch → Process → Deliver → Log |
| 6 | **Batch Processing** | Prepare → SplitInBatches → Process → Accumulate → Aggregate |

### 12.2 Patrones de Flujo de Datos

- **Lineal:** `Trigger → Transform → Action → End`
- **Branching:** `Trigger → IF → [True] / [False]`
- **Paralelo:** `Trigger → [Branch1] → Merge ← [Branch2]`
- **Loop:** `Trigger → SplitInBatches → Process → Loop`
- **Error Handler:** `Main → Success` / `Error Trigger → Error Handler`

### 12.3 Patrón Batch/SplitInBatches

```
Prepare → SplitInBatches → main[1] (each batch) → Process → (loop back)
                └→ main[0] (done) → Limit 1 → Aggregate
```

**Reglas clave:**
- SIEMPRE agregar `Limit 1` tras main[0] (done)
- La salida done solo se dispara UNA vez
- batchSize es el "cost lever" (más grande = menos iteraciones)
- `$('Node Inside Loop').all()` solo devuelve el último batch — usar `$getWorkflowStaticData('global')` para acumular

### 12.4 Gating de vida (validate → verify → test → activate)

1. **Validate** — `validate_workflow` / `n8n_validate_workflow`
2. **Verify connections** — `n8n_get_workflow` y leer el objeto `connections`
3. **Test** — `n8n_test_workflow` + `n8n_executions` (con aviso por efectos secundarios)
4. **Activate** — solo tras los tres primeros (vía `activateWorkflow` op)

### 12.5 Anti-patrones de Alto Impacto Documentados

1. **Nodo Set alimentando 0-1 consumidores** — casi siempre incorrecto; inline la expresión
2. **Iteración per-item automática** — NO añadir Loop Over Items si default ya itera
3. **Code Each-Item vs All-Items** — ~25-30× más costoso por ítem
4. **Cadenas largas de transformación** — consolidar en un solo All-Items Code node
5. **Append en Google Sheets con columnas de fórmula** — rompe fórmulas
6. **Comparación unidireccional de umbrales** — siempre `Math.abs(diff)`

### 12.6 Estadísticas de Uso Documentadas

- **Triggers:** Webhook 35%, Schedule 28%, Manual 22%, Service 15%
- **Transformaciones:** Set 68%, Code 42%, IF 38%, Switch 18%
- **Outputs:** HTTP Request 45%, Slack 32%, DB writes 28%, Email 24%
- **Complejidad:** Simple (3-5 nodos) 42%, Medio (6-10) 38%, Complejo (11+) 20%

---

## 13. Datos de Demostración y Dominio

### 13.1 Las 7 Jurisdicciones de Tribunales

| ID | Título | Categoría | Tags (competencias) | Emblema SVG |
|---|---|---|---|---|
| `lopnna` | Tribunales de Protección (LOPNNA) | Ley Orgánica LOPNNA | Manutención, Régimen de Visitas, Colocación Familiar, Patria Potestad | Manos doradas + silueta niño + balanza |
| `penal` | Jurisdicción Penal Ordinaria y Especial | Código Orgánico (COPP) | Control de Garantías, Juicio Oral, Delitos Informáticos, Ejecución Penal | Escudo + espada cruzada + mazo + balanza |
| `violencia` | Tribunales de Violencia Contra la Mujer | Ley Especial VCM | Medidas de Protección, Violencia Psicológica, Feminicidio, Medidas Cautelares | Flor púrpura + silueta femenina + símbolo equidad |
| `civil` | Tribunales Civiles, Mercantiles y de Tránsito | Código de Proc. Civil | Cobro de Bolívares, Hipotecas, Sociedades Mercantiles, Tránsito | Frontispicio + columnas romanas + pergamino lacre |
| `laboral` | Tribunales del Trabajo y Agrarios | Ley Orgánica (LOTTT) | Prestaciones Sociales, Calificación de Despido, Juicio Laboral, Agrario | Engranaje industrial + espiga + balanza |
| `contencioso` | Contencioso Administrativo y Tributario | Poder Público (LOJCA) | Nulidad de Actos, Reparos Tributarios, Contratos Públicos, SENIAT | Capitolio + columnas + escudo fiscal |
| `tsj_salas` | Salas del Tribunal Supremo de Justicia | Máxima Instancia TSJ | Recurso de Casación, Interpretación Constitucional, Avocamiento, Plenaria | Códice constitucional + 8 estrellas doradas |

**Paleta de emblemas:** Fondo `#092C53`/`#061C38`, anillo `#D4AF37` (dorado), acentos `#C59B27`, `#0D47A1`, blanco.

### 13.2 Los 8 Casos Demo Iniciales

| ID | NUE | Jurisdicción | Estado | Fojas |
|---|---|---|---|---|
| CASE-LOPNNA-1 | EXP-2026-00104-LOPNNA | lopnna | En Trámite | 84 |
| CASE-LOPNNA-2 | EXP-2026-00188-LOPNNA | lopnna | Autos para Sentencia | 140 |
| CASE-PENAL-1 | EXP-2026-00215-PENAL | penal | Apertura a Prueba | 260 |
| CASE-VIOLENCIA-1 | EXP-2026-00302-VCM | violencia | En Trámite | 95 |
| CASE-CIVIL-1 | EXP-2026-00440-CIVIL | civil | Sentencia Dictada | 188 |
| CASE-LABORAL-1 | EXP-2026-00512-LAB | laboral | En Trámite | 75 |
| CASE-CONT-1 | EXP-2026-00609-CONT | contencioso | Apertura a Prueba | 310 |
| CASE-TSJ-1 | EXP-2026-00701-SCON | tsj_salas | Autos para Sentencia | 520 |

**Formato NUE:** `EXP-YYYY-NNN-CÓDIGO` donde NNN es un número secuencial y CÓDIGO es el ID de jurisdicción en mayúsculas.

**Tipos de actuaciones demo:** Demanda Inicial, Medida Cautelar, Informe Multidisciplinario, Acusación Fiscal, Audiencia Preliminar, Prueba Digital, Imposición de Medidas, Informe Psiquiátrico, Libelo de Demanda, Sentencia Definitiva, Acta de Audiencia, Recurso Contencioso, Auto de Admisión, Solicitud Constitucional, Fijación de Ponencia.

### 13.3 Los 5 Estados Procesales

1. `En Trámite` → badge azul
2. `Apertura a Prueba` → badge ámbar
3. `Autos para Sentencia` → badge púrpura
4. `Sentencia Dictada` → badge verde
5. (`Archivado` — existe en schema BD pero no en datos demo)

### 13.4 Biblioteca de Leyes (15 leyes en 5 categorías)

| Categoría (clave) | Leyes |
|---|---|
| Constitucional | CRBV (Art. 1-188), LOPE (Art. 1-220), LOPPE (Art. 1-290) |
| Civil y Mercantil | Código Civil (Art. 1-1.200), Código de Comercio (Art. 1-890), Ley Propiedad Horizontal (Art. 1-140) |
| Penal | COPP (Art. 1-500), Ley contra la Corrupción (Art. 1-180), Ley de Delitos Informáticos (Art. 1-160) |
| Laboral | LOT (Art. 1-280), LETT (Art. 1-320), Ley de Seguridad Social (Art. 1-260) |
| Administrativo | LOPA (Art. 1-240), LCP (Art. 1-200), LOAP (Art. 1-180) |

### 13.5 Noticias del Carrusel (4 items)

| Tag | Título | Impacto | Fecha |
|---|---|---|---|
| Reforma normativa | Ajuste de plazos procesales en protección de menores | Tribunales de Protección | 01 sep 2026 |
| Actualización legal | Modificación de criterios en ejecuciones tributarias | Contencioso Administrativo | 26 ago 2026 |
| Boletín judicial | Revisión de medidas cautelares por violencia contra la mujer | Violencia de Género | 18 ago 2026 |
| Análisis normativo | Nuevas directrices para expedientes digitales y firma electrónica | Sala Constitucional | 09 ago 2026 |

*Imágenes: Unsplash CDN (con parámetros `auto=format&fit=crop&w=1200&q=85`).*

---

## 14. Control de Versiones (Git)

### 14.1 Configuración del Repositorio

| Aspecto | Valor |
|---|---|
| **Remote** | `https://github.com/luixj16-ux/cosilium.git` |
| **Branch actual** | `dev` |
| **Otras branches** | `main` (local y remoto), remotes/origin/{main,dev} |
| **Commits** | 1 ("Primer commit", hash `673a594`) |
| **Working tree** | Limpio (sin cambios pendientes) |
| **Origin HEAD** | remotes/origin/main |
| **Merge bases VS Code** | Configuradas para main y dev |

### 14.2 Configuración de Usuario (git config)

```ini
user.name = Dangelo Arrivillaga
user.email = dangeloarrivillaga@gmail.com
credential.https://github.com.helper = !/usr/bin/gh auth git-credential
core.editor = code --wait
```

### 14.3 Implicaciones del Estado Git

- Repositorio **joven** con un solo commit — aún no hay historia de evolución
- `main` y `dev` divergen (cada uno con VS Code merge base propio)
- Flujo git simple: branch `dev` es el de desarrollo activo

---

## 15. Herramientas de Desarrollo

### 15.1 Scripts Disponibles

| Script | Comando | Propósito |
|---|---|---|
| Inicializar BD | `node database/init-db.js` | Crea/abre SQLite y aplica schema.sql |
| Arrancar servidor | `node server.js` (o `npm start` si existiera) | Servidor IUSTITIA en :8080 |
| Arrancar MCP (Linux/mac) | `.agents/start_mcp.sh` | Carga .env y lanza MCP n8n |
| Arrancar MCP (Windows) | `.agents/start_mcp.ps1` | Ídem con PowerShell |
| Importar workflows | `node .agents/import_workflows.js` | Importa ejemplos a n8n |
| Inicializar n8n (test) | `npx n8n start` | n8n local en :5678 |

### 15.2 No Existe

- ❌ `package.json` — no se puede `npm install`
- ❌ `package-lock.json`
- ❌ `.env` (solo `.env.example`)
- ❌ Tests automatizados de ningún tipo
- ❌ Lint/typecheck configuration
- ❌ Docker configuration a nivel raíz (solo dentro de skills)

---

## 16. Arquitectura de Despliegue n8n Self-Hosted

*(Documentado en el skill `n8n-self-hosting` con assets Docker listos)*

### 16.1 Modo Single (docker-compose.single.yml)

- **Caddy** (proxies y TLS automático) + **n8n** (proceso único)
- n8n NO publicado al host (solo red privada)
- SQLite como BD
- Variables clave de seguridad:
  - `N8N_ENCRYPTION_KEY` (obligatoria, hacer backup)
  - `N8N_SECURE_COOKIE=true`
  - `N8N_DIAGNOSTICS_ENABLED=false`
  - `N8N_BLOCK_ENV_ACCESS_IN_NODE=true`
  - `N8N_RUNNERS_ENABLED=true`
  - `N8N_DEFAULT_BINARY_DATA_MODE=filesystem`
  - `EXECUTIONS_DATA_PRUNE=true` (MaxAge 336h, MaxCount 50000)

### 16.2 Modo Queue (docker-compose.queue.yml)

- **Caddy + n8n main + Redis + Postgres + N workers**
- El anchor YAML `x-n8n-env` garantiza que config genérica llegue a main y workers
- DB_TYPE=postgresdb, PQ usuario no-root via init-data.sh
- EXECUTIONS_MODE=queue, Redis/Bull
- `N8N_DEFAULT_BINARY_DATA_MODE=database` (Postgres, no filesystem)
- Workers: `command: worker --concurrency=5`, `deploy.replicas: 2`
- Escalado: `docker compose up -d --scale n8n-worker=N`

### 16.3 Caddyfile

- Reverse proxy `n8n:5678` con `flush_interval -1`, headers reales
- Security headers: HSTS, nosniff, SAMEORIGIN, Referrer-Policy
- Dominio libre de host: `{$N8N_SUBDOMAIN}.{$N8N_DOMAIN}`

### 16.4 Reglas de Secretos

- NUNCA commitear `.env` real
- Generar secrets fresco en cada box: `openssl rand -base64 32`
- `N8N_ENCRYPTION_KEY` igual en main y workers en queue mode
- Backups fuera del server

---

## 17. Seguridad — Mejores Prácticas Documentadas

### 17.1 Prácticas Aplicadas en el Código

| Práctica | Implementación |
|---|---|
| Hashing de contraseñas | scrypt + salt (16B) |
| Sesiones hasheadas | Token SHA-256 en BD, no token plano |
| Cookies seguras | HttpOnly + SameSite=Lax |
| Timing-safe comparisons | `crypto.timingSafeEqual` |
| Path traversal prevention | `path.normalize` + regex eliminar `..` |
| Payload limits | 10KB límite en readJson |
| Unique constraints | SQLite UNIQUE en username, email, token_hash, public_id, docket_number, storage_key |
| Auditoría | tabla `audit_events` (login, qs) |
| Checks de integridad | CHECK constraints en status, active, pages, file_size, result_count |

### 17.2 Prácticas Documentadas (skills, no aún aplicadas)

- **Secretos n8n:** nunca en text fields — usar credenciales n8n
- **Secretos Docker:** solo desde `.env`, nunca inline en compose
- **Auditoría de instancia:** `n8n_audit_instance` (hardcoded secrets, unauth webhooks, error gaps)
- **Error handling workflow:** Error Trigger + branches
- **No confiar en defaults:** configurar explícitamente

### 17.3 Riesgos de Seguridad Identificados

1. **API key n8n vacía** en `mcp_config.json` — conexiones vulnerables si se publica
2. **Ruta Windows hardcodeada** al binario MCP — frágil en otros OS
3. **localStorage expone datos demo** — no es adecuado para datos reales
4. **`app.1.js` legacy** — contenía `loginAsRole('admin')` con persistencia en localStorage (riesgo severo si se usara)
5. **Sin HTTPS en desarrollo** — solo local
6. **Sin rate limiting** en endpoints de autenticación — vulnerable a brute force
7. **Sin CSRF protection** (aunque SameSite=Lax mitiga parcialmente)

---

## 18. Estado Actual vs. Estado Futuro

### 18.1 Lo que EXISTE hodierno

| Área | Estado |
|---|---|
| **Autenticación** | ✅ Funcional (registro, login, logout, sesiones) |
| **Base de datos** | ✅ Schema completo con 9 tablas + 8 índices + seed |
| **Endpoints API** | ⚠️ Parcial — auth y search exist; NO hay CRUD de cases |
| **Frontend casos demo** | ✅ localStorage con 8 casos |
| **Tema claro/oscuro** | ✅ Implementado y persistido |
| **Asistente virtual** | ✅ Keyword-matching chatbot |
| **Biblioteca de leyes** | ✅ 15 leyes / 5 categorías |
| **Noticias carrusel** | ✅ 4 items, auto-rotación |
| **Portal tabs** | ✅ 5 secciones |
| **n8n MCP config** | ✅ Config + scripts + skills |
| **Documentación** | ⚠️ AGENTS.md + database/README.md (parcial) |

### 18.2 Lo que está PLANEADO (según database/README.md)

1. **Crear endpoints de solo lectura** para tribunales, expedientes y actuaciones
2. **Migrar datos demo** desde `app.js` a la base de datos
3. **Retirar progresivamente** la persistencia en localStorage

### 18.3 Lo que NO existe aún (gaps)

- ❌ CRUD completo de casos via API
- ❌ Migración de casos demo → BD SQLite
- ❌ Endpoints para tribunales/expedientes/actuaciones
- ❌ Vista de expedientes alimentada por BD (hoy es localStorage)
- ❌ tests
- ❌ CI/CD
- ❌ package.json / dependencias
- ❌ Docker/producción para la app TSJ (no solo n8n)
- ❌ Manejo de subida/descarga de documentos (`case_documents`)
- ❌ Auditoría más allá del login

---

## 19. Deuda Técnica y Riesgos

### 19.1 Deuda Técnica

| Área | Deuda |
|---|---|
| **Doble persistencia** | Casos en localStorage vs. usuarios en SQLite — inconsistencias posibles |
| **app.1.js legacy** | 38KB de código muerto/obsoleto que debería eliminarse |
| **Hardcode de datos de dominio** | 8 casos demo, 7 tribunales, 15 leyes, 4 noticias embebidos en JS |
| **Sin dependencias gestionadas** | No package.json — difícil reproducir entorno |
| **Rutas hardcodeadas** | Ruta Windows del binario MCP |
| **Sin tests** | Cero cobertura |
| **Sin lint/typecheck** | JS vanilla sin verificación estática |
| **Admin sin gestión** | No hay forma documentada de crear users admin |
| **endpoints limitados** | Solo 5 rutas API para todo el sistema |

### 19.2 Riesgos

1. **Fuga de datos en localStorage** — casos sensibles accesibles desde DevTools
2. **Sin autenticación para vistas** — solo gates UI (reversibles)
3. **Sin rate limiting** — brute-force en login/register
4. **CORS no configurado** — aunque local/demo, limita integraciones
5. **SQLite síncrono** — puede bloquear event loop bajo carga
6. **Escasez de endpoints** — el frontend depende de localStorage para lo esencial

---

## 20. Hoja de Ruta de Evolución

### Fase 1 — Consolidación (corto plazo)
- [ ] Crear `package.json` con `"type": "module"`, scripts (`start`, `init-db`)
- [ ] Eliminar `app.1.js` (o mover a `legacy/`)
- [ ] Mover datos demo a seeds SQL
- [ ] Implementar endpoint CRUD de casos (courts → cases → activities)
- [ ] Frontend consuma API para expedientes (reemplazar localStorage)
- [ ] `.gitignore` para `.env`, `node_modules`, `*.sqlite` (si aplica)

### Fase 2 — Robustez (medio plazo)
- [ ] Rate limiting (in-memory token bucket)
- [ ] Validación server-side de todos los inputs
- [ ] Tests (al menos de server.js y validaciones)
- [ ] CI pipeline (GitHub Actions: lint + tests + build)
- [ ] Endpoint admin para gestión de usuarios/roles
- [ ] Subida/descarga de documentos con storage
- [ ] Auditoría completa (CRUD operations)

### Fase 3 — Producción (largo plazo)
- [ ] Despliegue Docker para la app TSJ (no solo n8n)
- [ ] HTTPS + reverse proxy en producción
- [ ] Migración Postgres si escala
- [ ] Integración n8n real: workflows para notificaciones, reportes, ingestas
- [ ] Backup/restore automatizado de BD
- [ ] Monitoreo y observabilidad

---

## 21. Glosario Técnico

| Término | Definición |
|---|---|
| **NUE** | Número Único de Expediente — identificador de causa judicial (ej: EXP-2026-00104-LOPNNA) |
| **Fojas** | Páginas foliadas de un expediente judicial |
| **Carátula** | Identificación nominal de un caso (partes + objeto) |
| **Actuación** | Evento procesal (escrito, auto, sentencia) dentro de un expediente |
| **INPREABOGADO** | Instituto de Previsión Social del Abogado — número de registro del abogado en Venezuela |
| **C.I.** | Cédula de Identidad venezolana |
| **LOPNNA** | Ley Orgánica para la Protección de Niños, Niñas y Adolescentes |
| **COPP** | Código Orgánico Procesal Penal |
| **VCM** | Violencia Contra la Mujer (Ley Especial) |
| **LOT/LOTTT** | Ley Orgánica del Trabajo / del Trabajo, Trabajadores y Trabajadoras |
| **LOJCA** | Ley Orgánica de la Jurisdicción Contencioso Administrativa |
| **CRBV** | Constitución de la República Bolivariana de Venezuela |
| **SENIAT** | Servicio Nacional Integrado de Administración Aduanera y Tributaria |
| **Fiscalía** | Ministerio Público — acusa en materia penal |
| **RIF** | Registro Único de Información Fiscal (Venezuela) |
| **MCP** | Model Context Protocol — protocolo de comunicación con modelos de IA |
| **SPA** | Single Page Application |
| **TSJ_STATE** | Variable global de estado del frontend |
| **scrypt** | Algoritmo KDF (key derivation function) para hashing de contraseñas |
| **DatabaseSync** | API síncrona del módulo `node:sqlite` |
| **N8N_ENCRYPTION_KEY** | Clave maestra para cifrar credenciales de n8n |
| **Execute Workflow Trigger** | Trigger n8n para sub-workflows llamados como herramientas |
| **toolWorkflow** | Patrón donde un sub-workflow se expone como herramienta de agente AI |
| **ai_tool / ai_languageModel / ai_memory / ai_outputParser** | Slots de conexión de sub-nodos del AI Agent n8n |
| **SplitInBatches** | Nodo n8n para batch processing en loops |
| **main[0]/main[1]** | Outputs de SplitInBatches: done (0) / each batch (1) |

---

## Apéndice A — Mnemónica para el CTO

**En resumen, CONSILIIUM es:**

1. **Una SPA judicial venezolana** (TSJ) construida con **JavaScript Vanilla + Node.js http + SQLite** — cero dependencias npm.
2. **Dual-persistence:** localStorage (casos demo, tema) + SQLite (usuarios, sesiones, auditoría) — con roadmap para unificar.
3. **Seguridad sólida** para el nivel de app: scrypt, sessions hasheadas, cookies HttpOnly, preparación contra path traversal.
4. **Sistema de diseño premium:** paleta imperial azul/dorado, tipografía Nunito Sans/Outfit, dark mode, componentes completos, responsive.
5. **Una librería de skills n8n de nivel mundial** (15 skills, ~100 archivos, ~600KB de guías) para que agentes de IA construyan workflows n8n correctamente — el "cerebro" agéntico del proyecto.
6. **Configuración MCP funcional** para conectar el agente a una instancia n8n local.
7. **Ejemplos de workflows n8n** del patrón tool (echo_tool + caller) para probar MCP/agentes.
8. **Assets de despliegue n8n self-hosted** listos (Docker Compose single/queue + Caddy + init).
9. En git con un solo commit inicial en branch `dev`, remote GitHub privado.
10. **En transición:** de demo-localStorage → BD real → (futuro) producción.

---

*Documento generado a partir del análisis exhaustivo y directo de código fuente del repositorio en `dev` (commit `673a594`).*
