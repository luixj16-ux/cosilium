---
trigger: always_on
---
# Design Tokens Legacy — CONSILIUM (Referencia Histórica)

> **Tokens de diseño** extraídos de `styles.css` legacy para preservar la identidad visual TSJ en la nueva arquitectura.

---

## Paleta de Colores — Tema Claro (Legacy)

| Variable | Valor | Uso |
|---|---|---|
| `--bg-app` | `#eef8f8` | Fondo app |
| `--bg-card` | `#ffffff` | Tarjetas |
| `--bg-header` | `rgba(255,255,255,0.94)` | Header (blur) |
| `--text-main` | `#12333d` | Texto principal (azul-navy tinge) |
| `--tsj-navy` | `#12333d` | Azul navy TSJ |
| `--tsj-blue-dark` | `#164b59` | Azul oscuro |
| `--tsj-blue-primary` | `#087f8c` | **Azul primario institucional** |
| `--tsj-blue-medium` | `#18a6a6` | Azul medio |
| `--tsj-blue-light` | `#49c6c0` | Azul claro |
| `--tsj-blue-surface` | `#dff4f2` | Superficie azul |
| `--tsj-blue-subtle` | `#effafa` | Azul sutil (fondo) |
| `--tsj-gold` | `#e19a5a` | **Dorado acento** |
| `--tsj-gold-light` | `#f1b477` | Dorado claro |
| `--status-success` | `#159a82` | Verde (éxito) |
| `--status-urgent` | `#d95d62` | Rojo (urgente) |
| `--status-amber` | `#d88942` | Ámbar (aviso) |

---

## Paleta — Tema Oscuro (Legacy) `[data-theme="dark"]`

| Variable | Valor |
|---|---|
| `--bg-app` | `#060e1a` |
| `--bg-card` | `#0c1a2e` |
| `--bg-card-hover` | `#10233d` |
| `--bg-header` | `rgba(12,26,46,0.96)` |
| `--text-main` | `#f0f6fe` |
| `--tsj-blue-surface` | `#132d52` |
| `--tsj-blue-subtle` | `#0a1b33` |

---

## Tipografía (Legacy)

| Función | Fuente | Tamaño Base |
|---|---|---|
| Body | `Nunito Sans` | 15.5px, peso 400-800 |
| Títulos | `Outfit` / `Plus Jakarta Sans` | 1.15-2.2rem, peso 800-900 |
| Mono (NUE) | monospace (system) | 0.84rem |

**Import:** `@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@700;800&display=swap')`

---

## Radii y Sombras (Legacy)

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 22px;
--radius-xl: 28px;
--radius-pill: 9999px;

--shadow-sm:  0 2px 8px rgba(18,51,61,0.05);
--shadow-card: 0 6px 20px rgba(18,51,61,0.07);
--shadow-hover: 0 12px 32px rgba(18,51,61,0.14);
--shadow-primary: 0 6px 18px rgba(8,127,140,0.25);
```

---

## Componentes CSS Principales (Legacy)

| # | Componente | Descripción |
|---|---|---|
| 1 | **Header institucional** | Sticky, backdrop-blur 14px, logo PNG + emblemas SVG |
| 2 | **Hero banner** | Gradiente `#092c53 → #0d47a1 → #1565c0`, badge pill, service signals |
| 3 | **Portal tabs** | 5 tabs flex, borde inferior gradient, indicador dorado (`::after`) |
| 4 | **Tribunal cards** | Gradiente, hover translateX, emblema SVG, category pill, count badge |
| 5 | **Law portal** | Sticky sidebar (top:96px), tabs pill, law-item cards |
| 6 | **News carousel** | Grid 2 cols (imagen + story), dots, slideIn animation |
| 7 | **Case items** | Card con NUE tag monospace, title, sub-meta, state badge, action buttons |
| 8 | **Process step bar** | 4 pasos con dots: completed (azul), active (cyan glow) |
| 9 | **Modales** | Overlay blur 8px, modal box scale-in, header gradient, body scrollable |
| 10 | **Toast stack** | Fixed bottom-right, 3.2s auto-dismiss, border-left color por tipo |
| 11 | **Virtual assistant** | Launcher flotante 62px, chat card, quick actions, composer |
| 12 | **Institution grid** | 3 cards, featured card con borde dorado |
| 13 | **Interest grid** | Cards gradient navy con decorative circle `::after` |
| 14 | **Agenda list** | Grid 84px/1fr/auto, border-left dorado, date block |

---

## Responsividad (Legacy)

**Breakpoint 768px (móvil):**
- Header se apila en columna
- Portal tabs → grid 2 cols (último ancho completo)
- Institution/interest grids → 1 col
- News carousel → 1 col (imagen arriba)
- Case items apilados verticalmente

**Breakpoint 900px:**
- `tribunales-layout` (2 cols) → 1 col

---

## Animaciones (Legacy)

```css
@keyframes panelReveal { from { opacity:0; transform: translateY(6px); } }
@keyframes assistantIn { from { opacity:0; transform: translateY(10px) scale(0.98); } }
@keyframes slideIn { from { transform: translateY(12px); opacity:0; } }
```

---

## Accesibilidad (Legacy)

- `aria-label` en botones y tarjetas
- `aria-live="polite"` en mensajes asistente
- `aria-selected` en tabs portal
- `aria-hidden` en slides inactivos carrusel
- `role="dialog"`, `aria-modal`, `aria-labelledby` en asistente
- `lang="es"` en `<html>`
- Clase `.sr-only` para texto solo screenreader
- `tabindex="0"` + `onkeydown` (Enter/Espacio) en tarjetas clicables

---

## Migración a Design System Actual (`design-system/`)

| Token Legacy | Token Actual (v4) | Notas |
|---|---|---|
| `--tsj-blue-primary` | `--color-primary` | Mapear a palette v4 |
| `--tsj-gold` | `--color-accent` | Dorado institucional |
| `--tsj-navy` | `--color-navy` | Navy TSJ |
| `--bg-app` | `--color-bg-app` | Fondo app |
| `--bg-card` | `--color-bg-card` | Fondo tarjetas |
| `--radius-*` | `--radius-*` | Mantener escala |
| `--shadow-*` | `--shadow-*` | Mantener elevación |
| Fonts (Nunito/Outfit/PJS) | `--font-sans`, `--font-display` | Migrar a tokens |

**Regla:** UI dumb (`packages/ui`) usa **solo** tokens del design system v4, no valores hardcodeados.