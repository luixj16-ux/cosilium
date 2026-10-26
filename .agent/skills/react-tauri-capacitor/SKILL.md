# Skill: React-Tauri-Capacitor

Use when editing the three app shells that share the same React+TSX source in
concept but differ in runtime: web (Vite), desktop (Tauri), mobile (Capacitor).

## Layout per app
| Shell | Bundler | Platform px | CI note |
|---|---|---|---|
| `apps/web` | Vite (5173) | browser | — |
| `apps/desktop` | Vite (5174) + `src-tauri` (Rust) | native WM | Tauri: `custom-protocol` for prod |
| `apps/mobile` | Vite (5175) + Capacitor 6 | iOS/Android WebView | — |

## Rules
1. **Shared UI lives in `packages/ui`**; the app shell only composés, wires
   routing, and instantiates use cases. Don't fork components per platform.
2. **Platform-specific work goes through the native layer**, not the browser
   fallback: trace hashing/binarization via `@consilium/core` ports and check
   which real adapter the app injects (WebCrypto on web, wasm/tauri on others).
3. **Tauri**: new native commands must be declared in `src-tauri/src/lib.rs`
   (`tauri::generate_handler!`) and `tauri.conf.json` `identifier` must stay
   `ve.go.tsj.consilium.desktop`. Rust code lives in `rust/tauri-native` and is
   referenced via path in `src-tauri/Cargo.toml`.
4. **Capacitor**: config lives in `capacitor.config.ts` (`appId: ve.go.tsj.consilium`).
   No hardcoded URLs; build-time vars only.
5. **Dev ports differ** (5173/5174/5175) so all three can run at once.
6. Keep `apps/*` light: no domain logic in the shells; delegate to core.

## Verification
- `npm run typecheck --workspace @consilium/web` (+ desktop/mobile).
- Desktop native changes: `cargo check` inside `apps/desktop/src-tauri` or
  `rust/` workspace.
- Capacitor sync: only after changing `capacitor.config.ts`.