---
trigger: always_on
---
# Índice de Reglas de Contexto Global — CONSILIUM

Este archivo indexa todas las reglas detalladas del proyecto. Consultar el archivo correspondiente según el contexto de la tarea.

## 📂 Estructura de Reglas (23 archivos)

### Core & Arquitectura
1. **[global-context.md](./global-context.md)** – Tech stack, arquitectura, fuentes de verdad, agentes.
2. **[development-invariants.md](./development-invariants.md)** – Invariantes de desarrollo, Root Cause Analysis, PLAN FIRST, STOPS, BUILDS GATE.
3. **[technical-rules.md](./technical-rules.md)** – Fullstack Integrity adaptado a DDD, componentes dumb, contratos.
4. **[route-map.md](./route-map.md)** – Rutas de las apps (web/desktop/mobile) y API futura.

### Convenciones & Calidad
5. **[naming-conventions.md](./naming-conventions.md)** – Referencia al skill `naming-conventions` y regla en `AGENTS.md`.
6. **[accessibility.md](./accessibility.md)** – WCAG básico para dumb components.
7. **[code-conventions.md](./code-conventions.md)** – Convenciones de código TypeScript/Rust.
8. **[checklist-verify.md](../checklist-verify.md)** – Checklist obligatorio antes de cada tarea.

### Despliegue & Operaciones
9. **[local-deploy.md](./local-deploy.md)** – Protocolo dev:web/desktop/mobile + cargo check.
10. **[self-maintenance.md](./self-maintenance.md)** – Matriz de actualización post-flight.
11. **[sync-architecture.md](./sync-architecture.md)** – Arquitectura offline-first, outbox, estados PENDING/UPLOADED/FAILED.

### Dominio Judicial (Legacy Indexado)
12. **[domain-context.md](./domain-context.md)** – Identidad TSJ, 7 jurisdicciones, 5 estados procesales, 15 leyes, glosario venezolano.
13. **[domain-model.md](./domain-model.md)** – Schema SQLite 9 tablas + mapeo DDD Aggregates/VOs/Ports.
14. **[domain-rules.md](./domain-rules.md)** – Reglas de dominio, invariantes de negocio.
15. **[domain-seed-data.md](./domain-seed-data.md)** – Datos semilla: 7 courts, 8 cases, 15 laws, 4 news para tests/dev.
16. **[auth-model.md](./auth-model.md)** – Auth scrypt, 3 roles (Invitado/Público/Funcionario), matriz permisos, riesgos.

### Legacy Reference (Solo Consulta Histórica)
17. **[legacy-stack.md](./legacy-stack.md)** – Stack Node.js/SQLite/Vanilla JS legacy (commit 673a594).
18. **[legacy-architecture.md](./legacy-architecture.md)** – Arquitectura SPA + Node.http + SQLite legacy.
19. **[legacy-api.md](./legacy-api.md)** – 5 endpoints REST legacy con detalles de seguridad.
20. **[n8n-legacy.md](./n8n-legacy.md)** – Config MCP, 15 skills n8n, 6 patrones workflow, Docker compose.
21. **[deployment-legacy.md](./deployment-legacy.md)** – Despliegue n8n single/queue, Caddy, reglas secretos.

### Placeholders (Fases Futuras)
22. **[push-notifications.md](./push-notifications.md)** – Placeholder (fase futura).
23. **[reports-system.md](./reports-system.md)** – Placeholder (fase futura, sync reports).

---

## 🥇 Reglas de Oro (Cross-cutting)

1. **DDD Integrity**: Dependencias hacia adentro (Domain → Application → Infrastructure → UI). Ver `technical-rules.md`.
2. **TDD Obligatorio**: Tests antes que código (Vitest + cargo test). Ver `checklist-verify.md`.
3. **UI Dumb**: `packages/ui` no importa `@consilium/core` ni rutas, solo props/callbacks.
4. **Offline-first**: Cliente nunca espera red para crear/encolar. Ver `sync-architecture.md`.
5. **n8n Diferido**: Nada de n8n hoy. Contratos neutros en `docs/integrations/*.contract.md`.
6. **Branding**: CONSILIIUM (doble I) en prosa; dirs/packages CONSILIUM (una I).
7. **Zero Secrets**: Credenciales solo por variables de entorno.

## 🛑 Prohibiciones Estrictas

1. **No romper DDD**: `Domain` no conoce `Infrastructure`, `UI`, ni frameworks.
2. **No working sin bitácora**: Toda tarea trackeable requiere bitácora ANTES de escribir código.
3. **No naming conventions duplicados**: Solo skill `naming-conventions` + regla en `AGENTS.md`.
4. **No commit directo en `dev` ni `main`**: Feature branch → PR → merge a `dev` (ver `git-workflow.md`).
5. **No triggers faltantes**: Todo `.md` bajo `.agent/rules/` debe tener `trigger: always_on`.

## 📋 Protocolo STOPS POR FASE (AGENTS.md §0.2)

**CADA fase DEBE terminar con:**
1. Mostrar resumen de lo implementado
2. Ejecutar builds gate correspondientes
3. **ESPERAR APROBACIÓN EXPLÍCITA DEL USUARIO** antes de continuar

> **No hay excepciones.** Sin aprobación → no se avanza.