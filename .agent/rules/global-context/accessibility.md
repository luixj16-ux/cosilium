---
trigger: always_on
---
# Accesibilidad (WCAG AA) — CONSILIUM

Reglas mínimas para componentes dumb en `packages/ui/`.

## 1. Contraste
- Relación mínima 4.5:1 (texto normal) y 3:1 (texto grande ≥ 18pt / 14pt bold).
- Tokens de color futuros (`design-system/colors.md`) deben cumplir.
- Modo oscuro: mantener mismo ratio.

## 2. Foco Visible
- Todo elemento interactivo (`button`, `a`, `input`, `select`, custom) debe tener `:focus-visible` con outline ≥ 2px, contraste ≥ 3:1 contra fondo.
- No quitar outline sin alternativa accesible.

## 3. ARIA y Semántica
- Usar HTML semántico (`button`, `nav`, `main`, `section`, `header`, `footer`).
- `aria-label` / `aria-labelledby` en iconos-only buttons.
- `aria-live="polite"` en toasts / notificaciones.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` en modales.
- `tabindex="0"` + `onkeydown` (Enter/Space) en tarjetas clicables.

## 4. Formularios
- `<label>` asociado a cada `<input>` (`htmlFor` / `id`).
- `aria-invalid` + mensaje de error asociado (`aria-describedby`).
- `autocomplete` apropiado.

## 5. Componentes Dumb – Responsabilidad
- Reciben `props` de accesibilidad (`id`, `aria-*`, `label`) y los propagan.
- No implementan lógica de foco global; eso corresponde a la app shell.

## 6. Testing
- `npm run test` incluye pruebas de accesibilidad (axe / jest-axe) si se añaden.
- Revisar manualmente con lector de pantalla (NVDA / VoiceOver) en cambios mayores.

## 7. Referencias
- WCAG 2.1 AA.
- `design-system/specs.md` (cuando exista tokens).
- `technical-rules.md` (delegar en `@radix-ui` primitivas).