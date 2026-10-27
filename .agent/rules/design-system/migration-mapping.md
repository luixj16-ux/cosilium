---
trigger: always_on
---
# Migration Mapping — CONSILIUM

> **Estado:** N/A – No hay legacy UI en CONSILIUM.

## Contexto
CONSILIUM se construyó desde cero como monorepo DDD/TDD/offline-first con UI dumb (`packages/ui/`) y apps Vite shells (`apps/web`, `apps/desktop`, `apps/mobile`). No existe código legacy de UI que migrar.

## Si en el futuro se requiere migración
1. Documentar mapeo token-a-token (colores, spacing, radii).
2. Crear tabla de equivalencias componente legacy → dumb component CONSILIUM.
3. Actualizar `design-system/colors.md` y `design-system/specs.md` según nuevo brand.
4. Ejecutar self-maintenance para propagar cambios.

## Referencias
- `design-system/index.md` (regla: UI dumb sin estilos propios).
- `design-system/colors.md` (paleta placeholder).
- `design-system/specs.md` (contrato dumb).