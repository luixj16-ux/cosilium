---
trigger: always_on
---
# Índice de Reglas de Contexto Global — CONSILIUM

Este archivo indexa todas las reglas detalladas del proyecto. Consultar el archivo correspondiente según el contexto de la tarea.

## 📂 Estructura de Reglas

1. **[global-context.md](./global-context.md)** – Tech stack, arquitectura, fuentes de verdad, agentes.
2. **[development-invariants.md](./development-invariants.md)** – Invariantes de desarrollo, Root Cause Analysis, PLAN FIRST, STOPS, BUILDS GATE.
3. **[route-map.md](./route-map.md)** – Rutas de las apps (web/desktop/mobile) y API futura.
4. **[technical-rules.md](./technical-rules.md)** – Fullstack Integrity adaptado a DDD, componentes dumb, contratos.
5. **[naming-conventions.md](./naming-conventions.md)** – **Referencia** al skill `naming-conventions` y regla en `AGENTS.md`.
6. **[accessibility.md](./accessibility.md)** – WCAG básico para dumb components.
7. **[local-deploy.md](./local-deploy.md)** – Protocolo dev:web/desktop/mobile + cargo check.
8. **[push-notifications.md](./push-notifications.md)** – Placeholder (fase futura).
9. **[reports-system.md](./reports-system.md)** – Placeholder (fase futura, sync reports).
10. **[self-maintenance.md](./self-maintenance.md)** – Matriz de actualización post-flight.

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
4. **No PR**: Push directo a `dev` tras aprobación y post-flight.
5. **No triggers faltantes**: Todo `.md` bajo `.agent/rules/` debe tener `trigger: always_on`.