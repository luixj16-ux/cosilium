# Skill: Rust/Wasm Processing

Use for anything in `rust/wasm-engine` (web/mobile FFI) or `rust/tauri-native`
(desktop native calls): hashing, binarization (BW), image compression, and
directory watching.

## Boundaries
- `wasm-engine` exposes `#[wasm_bindgen]` functions (`sha256_hex`,
  `binarize_png`, `compress_image`) that **never panic across the FFI** —
  all errors return `WasmError` (mapped to `JsValue`).
- `tauri-native` exposes plain `pub fn` commands (`ingest_from_directory`,
  `DirectoryWatcher`) used via Tauri IPC, not wasm.
- Keep the heavy logic in internal modules (`hash.rs`, `binarize.rs`,
  `compress.rs`) with `#[cfg(test)]`-only helpers where they exist solely for
  tests (e.g. `fits_within`, `is_pure_binary`).

## Conventions
1. `cargo check --workspace` and `cargo check --workspace --target wasm32-unknown-unknown`
   must pass with zero warnings before committing (`$HOME/.cargo/bin` in PATH).
2. `cargo test --workspace` must pass; tests live in `#[cfg(test)]` modules.
3. Edition 2021 workspace root at `rust/Cargo.toml` (`members = ["wasm-engine", "tauri-native"]`).
4. Image crate only with `png`/`jpeg` features enabled (keeps the wasm binary lean).
5. `pageCount` cap for offline binarization is 500 — enforce in the caller
   (core), not inside the Rust module.

## Testing tips
- `DirectoryWatcher.spawn()` returns `(JoinHandle, StopHandle)`; call
  `stop.stop()` then `handle.join()` in tests, and never rely on a fragile
  event-count assertion in CI (delivery is async) — assert the thread joined.
- When the CLI is used to look at memory, prefer `cargo clippy` warnings as
  signal, not style debates.

## Red flags
- Panics crossing FFI (debug-level `unwrap()` in exported functions).
- Adding a heavy dependency without checking its wasm footprint.
- Breaking the shared `rust/Cargo.toml` workspace lockfile.