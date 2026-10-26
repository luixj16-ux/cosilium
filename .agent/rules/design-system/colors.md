---
trigger: always_on
---
# Paleta de Colores — CONSILIUM (Placeholder Neutro)

> Tokens temporales hasta que se defina brand CONSILIUM definitivo. Deben cumplir WCAG AA (contraste 4.5:1).

## Tokens Semánticos (CSS Custom Properties)

```css
:root {
  /* Primary */
  --color-primary: #003DA5;        /* Azul institucional */
  --color-primary-hover: #002F7F;
  --color-primary-light: #D9E2F2;  /* fondo suave */
  --color-primary-border: #99B1DB;

  /* Secondary / Accent */
  --color-accent: #FCE300;         /* Amarillo acento */
  --color-accent-hover: #E6CC00;
  --color-accent-light: #FFFB9D;
  --color-accent-border: #FEF499;

  /* Danger / Error */
  --color-danger: #EF3340;
  --color-danger-hover: #C02833;
  --color-danger-light: #FDE8EA;
  --color-danger-border: #F5B7BA;

  /* Success */
  --color-success: #159A82;
  --color-success-hover: #107A66;
  --color-success-light: #D1FAE5;
  --color-success-border: #6EE7B7;

  /* Neutros */
  --color-bg: #FFFFFF;
  --color-bg-alt: #F5F7FA;
  --color-text: #12333D;
  --color-text-muted: #5A6A7A;
  --color-border: #DDE3EA;
  --color-border-strong: #BBC5CE;

  /* Focus */
  --color-focus: #003DA5;
  --color-focus-ring: rgba(0,61,165,0.4);
}

/* Dark mode (data-theme="dark") */
[data-theme="dark"] {
  --color-bg: #060E1A;
  --color-bg-alt: #0C1A2E;
  --color-text: #F0F6FE;
  --color-text-muted: #8BA4C0;
  --color-border: #1A2E4A;
  --color-border-strong: #2A4A6A;
  --color-primary-light: rgba(0,61,165,0.20);
  --color-primary-border: rgba(0,61,165,0.40);
  --color-accent-light: rgba(252,227,0,0.18);
  --color-accent-border: rgba(252,227,0,0.38);
}
```

## Uso en Componentes Dumb
- **No** usar valores hex directos en componentes.
- Referenciar tokens: `var(--color-primary)`, `var(--color-bg)`, etc.
- Cuando se defina brand final, actualizar este archivo y regenerar tokens.

## Accesibilidad (WCAG AA)
- Todos los pares `color-text` / `color-bg` ≥ 4.5:1.
- Estados hover/focus con contraste ≥ 3:1.
- Ver `accessibility.md`.

## Referencias
- `design-system/index.md` (regla: UI dumb sin estilos propios).
- `accessibility.md` (contraste mínimo).
- `specs.md` (cómo pasar tokens via props).