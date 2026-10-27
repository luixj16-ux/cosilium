# BUILD DESKTOP — Ejecutable, Iconos y Ciclo de Build

Documentación de referencia para el despliegue de la versión **desktop** de
CONSILIUM. Recoge las dos últimas decisiones tomadas en sesión con su
justificación técnica.

---

## 1. ¿La aplicación desktop no necesita un ejecutable?

**Sí lo necesita.** Para el usuario final, una app desktop solo existe como
**ejecutable / instalador**. El flujo que se venía corriendo es `npm run tauri
dev` (modo desarrollo), que compila un binario de depuración y abre la ventana
con el frontend servido en caliente por Vite — No es un entregable.

### Cómo se produce el ejecutable real

```bash
npm run tauri --workspace @consilium/desktop -- build
```

`tauri build` compila en modo *release* y genera los instaladores definidos en
`tauri.conf.json` (`bundle.targets: "all"`):

| Plataforma | Artefacto |
|------------|-----------|
| Linux | `.AppImage`, `.deb`, `.rpm` |
| Windows | `.msi` / `.exe` |
| macOS | `.dmg` / `.app` |

### Justificación

- En la máquina objetivo **no** hace falta Node, Vite ni Rust: el frontend se
  **embebe dentro del binario** y en producción Tauri sirve los assets con el
  protocolo `custom-protocol` (no HTTP).
- El modo `tauri dev` es solo para iterar: compila rápido, recarga en caliente
  (HMR) y deja el puerto 5174 escuchando. Ese servidor **no** es parte del
  despliegue.
- Consecuencia: distribuir la app desktop implica ejecutar el release build y
  entregar el instalador del target correspondiente.

---

## 2. El detalle del icono: ¿se implementa ahora o solo en el build?

**Solo aplica al build de release** (`tauri build`). No requiere trabajo en el
desarrollo actual.

### Estado en desarrollo (`tauri dev`)

No falta nada: con `src-tauri/icons/icon.png` (creado a partir del logo
CONSILIUM) la macro `tauri::generate_context!()` compila y la ventana corre con
su icono. Ya está resuelto.

### Estado en el build de release (`tauri build`)

Sí hace falta el **set completo de iconos**. `tauri.conf.json` tiene
`"bundle.icon": []` y `bundle.targets: "all"`; al empaquetar
`.deb/.AppImage/.msi/.dmg`, Tauri exige iconos en los tamaños específicos de
cada plataforma (32, 128, 256, 512 px; `.ico` para Windows; `.icns` para macOS).
Sin ellos el bundler usa un icono por defecto o el empaquetado falla.

### Cuándo y cómo generarlo

Justo antes del primer release (no ahora), ejecutar desde
`apps/desktop/src-tauri`:

```bash
npx tauri icon ../../web/public/.agents/consilium-logo-new-transparent.png
```

Esto genera el directorio `icons/` completo (32x32.png, 128x128.png,
128x128@2x.png, icon.ico, icon.icns, etc.) y permite rellenar `bundle.icon` en
`tauri.conf.json`.

### Justificación

- El icono de desarrollo sirve para compilar y ejecutar; el **bundler** consume
  una lista de tamaños normalizada que `tauri icon` produce de una sola fuente
  (evita duplicar artefactos a mano y garantiza compatibilidad por plataforma).
- Diferir su generación evita trabajo muerto: solo es relevante cuando se
  produce el instalador de distribución.

---

*Documento de trabajo — CONSILIUM (desktop).*