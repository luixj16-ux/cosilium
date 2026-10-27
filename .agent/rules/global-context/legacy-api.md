---
trigger: always_on
---
# API Legacy Endpoints — CONSILIUM (Referencia Histórica)

> **ADVERTENCIA:** Endpoints **LEGACY/OBSOLETOS** del servidor vanilla Node.js. La arquitectura actual usa GraphQL (fase 2).

## Base URL
`http://localhost:8080/api`

## Endpoints Implementados

### GET `/api/session`
Verifica sesión activa via cookie `tsj_session`.

**Query SQL:**
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

---

### POST `/api/register`
Registro público (rol automático `public` / `role_id=1`).

**Body:**
```json
{ "username": "string", "fullName": "string", "email": "string", "password": "string" }
```

**Validaciones (400 si falla):**
- `username`: `/^[a-z0-9._-]{4,40}$/` (minúsculas, números, punto, guion bajo, guion)
- `fullName.length >= 3`
- `email.includes('@')`
- `password.length >= 8`

**Lógica:** Inserta usuario → crea sesión → devuelve 201
**Error 409:** `SQLITE_CONSTRAINT_UNIQUE` → "El usuario o correo ya está registrado."

---

### POST `/api/login`
Inicio de sesión por username **O** email (ambos normalizados a minúsculas).

**Body:**
```json
{ "username": "string", "password": "string" }
```

**Lógica:**
1. Busca usuario por username O email con `active = 1`
2. Verifica contraseña con `verifyPassword` (scrypt + timing-safe)
3. Registra auditoría: `INSERT INTO audit_events (user_id, action, entity_type, entity_id) VALUES (?, 'login', 'user', ?)`
4. Crea sesión, establece cookie

**Error 401:** "Usuario o contraseña incorrectos."

---

### POST `/api/logout`
Cierre de sesión.

**Lógica:**
1. Elimina fila `user_sessions` por token hash
2. Cookie `tsj_session=; Max-Age=0` para limpiarla

---

### POST `/api/search-records`
**Requiere autenticación** (401 si no hay usuario).

**Body:**
```json
{ "query_text": "string", "court_id": "string|null", "result_count": 0 }
```

**Lógica:** Inserta en `search_records`: query_text (máx 200 chars), court_id (nullable), result_count, source='portal'

---

## Funciones Utilitarias Internas (server.js)

| Función | Propósito |
|---|---|
| `parseCookies(req)` | Parsea header `Cookie` a objeto `{clave: valor}` |
| `hashToken(token)` | SHA-256 hex de token de sesión |
| `hashPassword(password, salt)` | scrypt(password, salt, 64 bytes) → `salt:hash` |
| `verifyPassword(password, storedHash)` | Compara con `crypto.timingSafeEqual` |
| `readJson(req)` | Parsea body JSON (límite 10KB, manejo errores) |
| `sendJson(res, status, payload, headers)` | Envía respuesta JSON con headers opcionales |
| `getCurrentUser(req)` | Devuelve usuario activo desde token sesión |
| `createSession(res, userId)` | Crea sesión, genera token, establece cookie |
| `handleApi(req, res)` | Router API — retorna `true` si ruta atendida |

---

## Seguridad Parámetros Servidor

- **Path traversal:** `path.normalize(reqUrl)` + regex `/^(\.\.[\/\\])+/` elimina `..`
- **Payload limit:** 10KB para JSON
- **Contraseñas:** scrypt + salt 16 bytes aleatorios, salida 64 bytes hex, **nunca texto plano**
- **Cookies:** `HttpOnly` + `SameSite=Lax` (no accesible por JS cliente)
- **Timing-safe:** `crypto.timingSafeEqual` para verificación contraseñas
- **Tokens sesión:** 32 bytes aleatorios, almacenado SHA-256 en BD (no token plano)
- **TTL sesión:** 8 horas (`Max-Age=28800`)

---

## Endpoints NO Implementados (Gaps Legacy)

- ❌ CRUD casos (`GET/POST/PUT/DELETE /api/cases`)
- ❌ CRUD tribunales (`GET /api/courts`)
- ❌ CRUD actuaciones (`GET/POST /api/cases/:id/activities`)
- ❌ CRUD documentos (`GET/POST /api/cases/:id/documents`)
- ❌ Gestión usuarios admin (`GET/POST/PUT /api/admin/users`)
- ❌ Auditoría completa (`GET /api/audit`)
- ❌ Rate limiting
- ❌ CORS configurado