//! # consilium-tauri-native
//!
//! Lógica nativa de escritorio (Tauri) que complementa el Core:
//!
//! * **File Association / "Abrir con..."**: asociar la app a PDF/JPEG/PNG.
//! * **Folder Watching (ingesta masiva automatizada)**: la crate `notify`
//!   detecta archivos nuevos en un "Directorio de Ingesta" (p. ej.
//!   `C:/MisEscaneos`) y los encola OFFLINE sin intervención del usuario.
//! * **Manejo de archivos masivos en el disco duro** (sin cargar todo
//!   el binario a memoria del proceso web).
//!
//! Esta crate NO depende de `tauri` directamente para que
//! `cargo test`/`cargo check` sean ligeros y verificables; el wiring
//! con el framework se hace en `apps/desktop/src-tauri`.

pub mod fs;
pub mod watch;