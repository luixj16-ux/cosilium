---
trigger: always_on
---
# Paleta de Colores — CONSILIUM (Brand TSJ Oficial)

> Tokens oficiales derivados del sistema legacy CONSILIUM (TSJ Venezuela). Cumplen WCAG AA (contraste 4.5:1).

## Tokens Semánticos (CSS Custom Properties)

```css
:root {
  /* Primary — Azul Institucional TSJ */
  --color-primary: #087f8c;              /* --tsj-blue-primary */
  --color-primary-hover: #066b76;        /* --tsj-blue-dark */
  --color-primary-light: #dff4f2;        /* --tsj-blue-surface */
  --color-primary-border: #49c6c0;       /* --tsj-blue-light */

  /* Secondary / Accent — Dorado Institucional TSJ */
  --color-accent: #e19a5a;               /* --tsj-gold */
  --color-accent-hover: #c9874a;         /* --tsj-gold-light oscuro */
  --color-accent-light: #fef3e7;         /* --tsj-gold-light muy suave */
  --color-accent-border: #f1b477;        /* --tsj-gold-light */

  /* Navy TSJ */
  --color-navy: #12333d;                 /* --tsj-navy / --text-main */
  --color-navy-dark: #092c53;            /* Emblema fondo oscuro */
  --color-navy-medium: #0d47a1;          /* Gradiente hero inicio */

  /* Danger / Error */
  --color-danger: #d95d62;               /* --status-urgent */
  --color-danger-hover: #b84a4e;
  --color-danger-light: #fce8e8;
  --color-danger-border: #f5b7ba;

  /* Success */
  --color-success: #159a82;              /* --status-success */
  --color-success-hover: #107a66;
  --color-success-light: #d1fae5;
  --color-success-border: #6ee7b7;

  /* Warning / Amber */
  --color-warning: #d88942;              /* --status-amber */
  --color-warning-hover: #b87338;
  --color-warning-light: #fff4e6;
  --color-warning-border: #f5d9b5;

  /* Neutros */
  --color-bg: #eef8f8;                   /* --bg-app */
  --color-bg-alt: #ffffff;               /* --bg-card */
  --color-bg-hover: #e8f4f2;             /* --tsj-blue-subtle */
  --color-text: #12333d;                 /* --text-main / --tsj-navy */
  --color-text-muted: #5a6a7a;           /* Derivado navy */
  --color-border: #dff4f2;               /* --tsj-blue-surface */
  --color-border-strong: #49c6c0;        /* --tsj-blue-light */

  /* Header / Overlay */
  --color-header-bg: rgba(255,255,255,0.94);  /* --bg-header */
  --color-header-blur: 14px;
  --color-modal-overlay: rgba(18,51,61,0.4);  /* blur 8px */
  --color-modal-overlay-blur: 8px;

  /* Focus */
  --color-focus: #087f8c;
  --color-focus-ring: rgba(8,127,140,0.4);    /* --shadow-primary base */
}

/* Dark mode (data-theme="dark") */
[data-theme="dark"] {
  --color-bg: #060e1a;                   /* --bg-app dark */
  --color-bg-alt: #0c1a2e;               /* --bg-card dark */
  --color-bg-hover: #10233d;             /* --bg-card-hover dark */
  --color-text: #f0f6fe;                 /* --text-main dark */
  --color-text-muted: #8ba4c0;
  --color-border: #132d52;               /* --tsj-blue-surface dark */
  --color-border-strong: #1a3a5c;
  --color-primary-light: rgba(8,127,140,0.20);
  --color-primary-border: rgba(8,127,140,0.40);
  --color-accent-light: rgba(225,154,90,0.18);
  --color-accent-border: rgba(225,154,90,0.38);
  --color-header-bg: rgba(12,26,46,0.96);
  --color-modal-overlay: rgba(6,14,26,0.6);
}
```

## Mapeo desde Legacy (styles.css)

| Legacy Variable | Nuevo Token Semántico | Valor |
|---|---|---|
| `--tsj-blue-primary` | `--color-primary` | `#087f8c` |
| `--tsj-blue-dark` | `--color-primary-hover` | `#164b59` |
| `--tsj-blue-surface` | `--color-primary-light` | `#dff4f2` |
| `--tsj-blue-light` | `--color-primary-border` | `#49c6c0` |
| `--tsj-gold` | `--color-accent` | `#e19a5a` |
| `--tsj-gold-light` | `--color-accent-border` | `#f1b477` |
| `--tsj-navy` | `--color-navy` | `#12333d` |
| `--bg-app` | `--color-bg` | `#eef8f8` |
| `--bg-card` | `--color-bg-alt` | `#ffffff` |
| `--text-main` | `--color-text` | `#12333d` |
| `--status-success` | `--color-success` | `#159a82` |
| `--status-urgent` | `--color-danger` | `#d95d62` |
| `--status-amber` | `--color-warning` | `#d88942` |

## Uso en Componentes Dumb
- **No** usar valores hex directos en componentes.
- Referenciar tokens: `var(--color-primary)`, `var(--color-bg)`, etc.
- Ver `design-system/index.md` (regla: UI dumb sin estilos propios).
- Ver `specs.md` (cómo pasar tokens via props).

## Accesibilidad (WCAG AA)
- Todos los pares `color-text` / `color-bg` ≥ 4.5:1.
- Estados hover/focus con contraste ≥ 3:1.
- Ver `accessibility.md`.

## Referencias
- `design-system/legacy-tokens.md` (tokens completos legacy)
- `design-system/index.md` (arquitectura design system)
- `design-system/specs.md` (componentes dumb + tokens via props)