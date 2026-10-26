---
trigger: always_on
---
# Modelo de Dominio Legacy — CONSILIUM (SQLite Schema Reference)

> **Referencia histórica** del schema SQLite legacy. Para la arquitectura actual, los Aggregates/VOs/Ports se definen en `@consilium/core/domain`.

## Tablas y Esquema (database/schema.sql)

### `roles`
| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `name` | TEXT | NOT NULL, UNIQUE |
| `description` | TEXT | NOT NULL |

**Seed:** `(1, 'public', 'Consulta pública de expedientes y normativa')`, `(2, 'admin', 'Gestión autorizada de expedientes y actuaciones')`

---

### `users`
| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `role_id` | INTEGER | NOT NULL, REFERENCES roles(id) |
| `username` | TEXT | NOT NULL, UNIQUE |
| `full_name` | TEXT | NOT NULL |
| `email` | TEXT | UNIQUE (nullable) |
| `password_hash` | TEXT | NOT NULL (formato scrypt `salt:hash`) |
| `active` | INTEGER | DEFAULT 1, CHECK (0/1) |
| `created_at` / `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

---

### `user_sessions`
| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | NOT NULL, REFERENCES users(id) ON DELETE CASCADE |
| `token_hash` | TEXT | NOT NULL, UNIQUE (SHA-256 del token) |
| `expires_at` | TEXT | NOT NULL |
| `created_at` / `last_seen_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

---

### `courts`
| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | TEXT | PRIMARY KEY (ej: 'lopnna', 'penal') |
| `name` | TEXT | NOT NULL |
| `description` | TEXT | NOT NULL |
| `category` | TEXT | NOT NULL |
| `jurisdiction` | TEXT | nullable |
| `active` | INTEGER | DEFAULT 1, CHECK (0/1) |
| `created_at` / `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

---

### `cases`
| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `public_id` | TEXT | NOT NULL, UNIQUE |
| `court_id` | TEXT | NOT NULL, REFERENCES courts(id) |
| `docket_number` | TEXT | NOT NULL, UNIQUE (formato NUE) |
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

---

### `case_activities`
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

---

### `case_documents`
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

**Nota:** Archivos NO en SQLite — solo metadatos. Asume storage externo (filesystem/S3).

---

### `audit_events`
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

---

### `search_records`
| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | NOT NULL, REFERENCES users(id) ON DELETE CASCADE |
| `query_text` | TEXT | NOT NULL (máx 200 chars en API) |
| `court_id` | TEXT | REFERENCES courts(id) ON DELETE SET NULL |
| `result_count` | INTEGER | DEFAULT 0, CHECK >= 0 |
| `source` | TEXT | DEFAULT 'portal' |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

---

## Índices Estratégicos

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

---

## Modelo Entidad-Relación Conceptual

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

## Mapeo a Arquitectura Actual (DDD)

| Entidad Legacy | Aggregate/VO Actual Sugerido |
|---|---|
| `cases` | `CaseAggregate` (id, publicId, docketNumber, title, subject, plaintiff, defendant, attorney, amount, status, pages, filedAt, lastActivityAt) |
| `courts` | `CourtVO` (id, name, description, category, jurisdiction) |
| `case_activities` | `CaseActivityVO` (date, type, summary, signedBy, pageRange) |
| `case_documents` | `CaseDocumentVO` (fileName, storageKey, mimeType, fileSize, sha256, uploadedBy) |
| `users` | `UserAggregate` (id, username, fullName, email, role, active) |
| `roles` | `RoleVO` (id, name, description) |
| `user_sessions` | `SessionVO` (tokenHash, expiresAt) |
| `audit_events` | `AuditEventVO` (userId, action, entityType, entityId, ip, metadata) |
| `search_records` | `SearchRecordVO` (queryText, courtId, resultCount, source) |

---

## Estados Outbox (Para Migración Actual)

Per `sync-architecture.md`: `PENDING` → `PENDING_UPLOAD` → `UPLOADED` \| `FAILED` (reintentable)

Aplicar a: `cases`, `case_activities`, `case_documents` al migrar a RxDB + backend.