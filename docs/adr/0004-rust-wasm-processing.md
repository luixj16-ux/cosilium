# ADR-0004 · Procesamiento pesado en Rust + WASM (web/mobile)

Estado: **Aceptado**. Fecha: 2026.

## Contexto
Necesitamos SHA-256 del binario, binarización (BW) y compresión de imágenes
para escaneos, sobre 3 ambientes (browser, desktop Tauri, mobile Capacitor).
Hacer esto en JS en la webview es lento y pasto de diferencias entre runtimes.

## Decisión
- Implementar el trabajo pesado en **Rust** (`rust/wasm-engine`) y exportarlo
  por `#[wasm_bindgen]` (web + Capacitor vía WASM).
- En desktop, Tauri puede llamar native (`rust/tauri-native`) sin wasm.
- Errores cruzan FFI como `WasmError`; **nunca panics**.
- Binarizar solo si `pageCount ≤ MAX_OFFLINE_PAGE_COUNT` (500).

## Alternativas
- **Web Audio / Canvas en JS**: posible pero más lento y frágil para PDFs.
- **Servidor remoto**: rompe offline-first (ADR-0002/0003).
- **WASM-binario propio**: overkill; `wasm-bindgen` cubre.

## Consecuencias
- Un único código de alto rendimiento para las 3 plataformas.
- El workspace Rust `wasm-engine`/`tauri-native` queda bajo `cargo check --workspace`
  con target wasm32 (CI).
- El binario wasm añade tamaño al bundle (aceptable: contenido interno de
  despachos).