---
trigger: always_on
---
# Design System — CONSILIUM (Mínimo para Dumb Components)

> CONSILIUM aún no tiene design system propio. Esta carpeta sirve de **referencia** para componentes dumb (`packages/ui/`) y tokens futuros.

## Estructura
1. **index.md** – este archivo.
2. **colors.md** – paleta placeholder (neutra).
3. **specs.md** – contrato de dumb component (props + callbacks only).
4. **ui-elements.md** – inventario de componentes existentes.
5. **lists-tables.md** – patrones de listas / tablas (outbox, documentos).
6. **migration-mapping.md** – N/A (sin legacy UI).

## Regla de Oro
- **UI dumb = sin estilos propios**. Consumen tokens globales (por definir) o clases CSS externas.
- No crear estilos inline ni CSS modules dentro de `packages/ui/src/components/`.
- Cuando se defina brand CONSILIUM, actualizar `colors.md` y propagar tokens.

## Referencias
- `technical-rules.md` (Fullstack Integrity → UI dumb).
- `ui-dumb-components` skill (plantilla canónica `DocumentUploadList`).