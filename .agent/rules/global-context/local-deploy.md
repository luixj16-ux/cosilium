---
trigger: always_on
---
# Protocolo de Deploy Local — CONSILIUM

## 1. Requisitos Previos
- **Node.js** ≥ 22 (`node -v`).
- **npm** ≥ 10.
- **Rust** (`cargo`, `rustc`) con `wasm32-unknown-unknown` target (`rustup target add wasm32-unknown-unknown`).
- **Tauri CLI** (`cargo install tauri-cli`).
- **Android SDK** + `ANDROID_HOME` (para mobile) – solo si se prueba Capacitor.
- **WSL** (Windows) – verificado funcionando.

## 2. Comandos por Target

### Web (`apps/web`)
```bash
# Desarrollo (HMR)
npm run dev:web          # Vite dev server en http://localhost:5173

# Build producción + preview
npm run build --workspace @consilium/web
npm run preview --workspace @consilium/web
```

### Desktop (`apps/desktop` – Tauri v2)
```bash
# Desarrollo (HMR + ventana Tauri)
npm run dev:desktop      # tauri dev (puerto 5174)

# Build release (genera instaladores)
npm run tauri --workspace @consilium/desktop -- build
# Artefactos: .AppImage/.deb/.rpm (Linux), .msi/.exe (Windows), .dmg/.app (macOS)
```

> **Iconos release** (solo antes del primer release):
> ```bash
> cd apps/desktop/src-tauri
> npx tauri icon ../../web/public/.agents/consilium-logo-new-transparent.png
> # Genera icons/ (32,128,256,512, .ico, .icns) y permite rellenar bundle.icon en tauri.conf.json
> ```

### Mobile (`apps/mobile` – Capacitor 6 / Ionic)
```bash
# Desarrollo (Vite + Capacitor sync)
npm run dev:mobile       # Vite dev server
npx cap sync             # sincroniza dist a capacitor/www

# Run en emulador/dispositivo
npx cap run android      # Android
npx cap run ios          # iOS (solo macOS + Xcode)
```

## 3. Quality Gates Locales (Ejecutar ANTES de commit)
```bash
npm run typecheck
npm run test
npm run lint:conventions
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
```
**Todos deben pasar (0 errores).**

## 4. Verificación WSL (Actual)
| Herramienta | Estado |
|-------------|--------|
| Node.js v22.16.0 | ✅ |
| npm 11.4.1 | ✅ |
| Rust (cargo/rustc) | ✅ (`$HOME/.cargo/bin`) |
| Android SDK / adb | ✅ |
| Xcode | ❌ (Linux – iOS no disponible) |

## 5. Referencias
- `BUILD_DESKTOP.md` (raíz) – guía histórica de build desktop e iconos.
- `LOCAL_DEPLOY.md` (raíz) – guía histórica con verificación WSL.
- `route-map.md` (puertos y comandos).
- `development-invariants.md` (PLAN FIRST, STOPS, BUILDS GATE).