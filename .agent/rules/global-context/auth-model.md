---
trigger: always_on
---
# Modelo de Autenticación y Roles Legacy — CONSILIUM

> **Referencia histórica** del sistema auth legacy. Para arquitectura actual, ver `sync-architecture.md` y `domain-rules.md`.

## Gestión de Contraseñas (Legacy)

| Aspecto | Implementación |
|---|---|
| **Algoritmo** | scrypt (Node.js `crypto.scryptSync`) |
| **Parámetros** | 64 bytes salida, salt aleatorio 16 bytes |
| **Formato almacenado** | `salt:hash` (ambos hex) |
| **Verificación** | `crypto.timingSafeEqual` (anti-timing attacks) |

---

## Sesiones (Legacy)

| Aspecto | Implementación |
|---|---|
| **Token** | 32 bytes aleatorios (`crypto.randomBytes(32).toString('hex')`) |
| **Almacenamiento BD** | SHA-256 del token (hash, no token plano) |
| **TTL** | 8 horas (`Max-Age=28800`) |
| **Cookie** | `tsj_session=<token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800` |
| **Verificación** | JOIN sesiones + usuarios + roles, `expires_at > datetime('now')`, `active = 1` |

---

## Endpoints Auth Legacy

| Endpoint | Método | Auth Requerida | Propósito |
|---|---|---|---|
| `/api/session` | GET | No (autodetecta) | Verifica y devuelve sesión actual |
| `/api/register` | POST | No | Registro público (rol automático public) |
| `/api/login` | POST | No | Inicio sesión por username/email |
| `/api/logout` | POST | Sesión | Cierre de sesión |
| `/api/search-records` | POST | **Sí** | Registro de búsquedas |

---

## Matriz de Roles y Permisos (Frontend Legacy)

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

---

## Implementación UI Legacy

- **Badge rol:** `Invitado` / `Público` / `Funcionario TSJ`
- **Botón "Nueva Causa" (`#btn-admin-new-case`):** oculto salvo rol admin
- **Botones "Agregar Actuación" / "Dar de Baja" (`#btn-admin-add-act`, `#btn-admin-delete`):** solo visibles en modal con rol admin
- **Banner "Modo Consulta Pública Activo":** visible para no-admin
- **Tabs leyes/paneles:** requieren `requireAuthentication()` (gate abre modal login)

---

## Modelo de Estados Autenticación

```
Tres estados posibles:
1. No autenticado → "Invitado", botón "Registrarse / Entrar"
2. Autenticado + rol public → "Público", nombre del usuario
3. Autenticado + rol admin → "Funcionario TSJ", botón "Modo Funcionario Activo"
```

---

## Riesgos Identificados (Legacy)

1. **API key n8n vacía** en `mcp_config.json` — conexiones vulnerables si se publica
2. **Ruta Windows hardcodeada** al binario MCP — frágil en otros OS
3. **localStorage expone datos demo** — no adecuado para datos reales
4. **`app.1.js` legacy** — contenía `loginAsRole('admin')` con persistencia en localStorage (riesgo severo)
5. **Sin HTTPS en desarrollo** — solo local
6. **Sin rate limiting** en endpoints auth — vulnerable a brute force
7. **Sin CSRF protection** (SameSite=Lax mitiga parcialmente)
8. **Admin sin gestión documentada** — no hay mecanismo para crear usuarios admin en producción

---

## Mapeo a Arquitectura Actual

| Concepto Legacy | Implementación Actual Sugerida |
|---|---|
| Roles (public/admin) | `RoleVO` + `UserAggregate.role` (value object) |
| Sesiones cookie | `SessionVO` + secure httpOnly cookies + refresh tokens |
| scrypt passwords | WebCrypto PBKDF2 o Argon2id via WASM (`rust/wasm-engine`) |
| Audit events | `AuditEventVO` en `document_outbox` (append-only) |
| Search records | `SearchRecordVO` en RxDB local + sync remoto |
| Gates UI (`requireAuthentication`) | UseCase `RequireAuthUseCase` + UI dumb callback `onAuthRequired` |

---

## Datos Semilla (Seed) Legacy

```sql
-- Roles
INSERT INTO roles (id, name, description) VALUES 
  (1, 'public', 'Consulta pública de expedientes y normativa'),
  (2, 'admin', 'Gestión autorizada de expedientes y actuaciones');

-- Usuario público demo (password: hash scrypt)
-- No hay usuario admin documentado para crear en producción
```