//! # consilium-wasm-engine
//!
//! Procesamiento de documentos **en el cliente** (Rust → Wasm vía
//! `wasm-bindgen`). Misión: binarizar imágenes a blanco y negro puro,
//! comprimirlas para reducir drásticamente el tamaño y calcular el
//! `FileHash` criptográfico (SHA-256) con el que el dominio deduplica.
//!
//! Se ejecuta en un **Web Worker** para no bloquear el hilo principal.
//!
//! TDD: `cargo test` cubre binarización, compresión y hash.

pub mod binarize;
pub mod compress;
pub mod hash;

use wasm_bindgen::prelude::*;

/// Puerta de entrada Wasm: hash SHA-256 hex de un buffer.
#[wasm_bindgen]
pub fn sha256_hex(data: &[u8]) -> String {
    hash::sha256_hex(data)
}

/// Puerta de entrada Wasm: devuelve un PNG en blanco y negro puro
/// (umbral aplicado) a partir de los bytes de una imagen (PNG/JPEG).
#[wasm_bindgen]
pub fn binarize_png(input: &[u8], threshold: u8) -> Result<Vec<u8>, WasmError> {
    binarize::binarize_png(input, threshold).map_err(|err| WasmError(err.to_string()))
}

/// Puerta de entrada Wasm: re-encoda la imagen a escala de grises,
/// limitando la dimensión máxima (compresión de tamaño).
#[wasm_bindgen]
pub fn compress_image(input: &[u8], max_dimension: u32) -> Result<Vec<u8>, WasmError> {
    compress::compress_image(input, max_dimension).map_err(|err| WasmError(err.to_string()))
}

/// Error serializable hacia JS/Wasm.
#[derive(Debug)]
pub struct WasmError(pub String);

impl From<WasmError> for JsValue {
    fn from(err: WasmError) -> Self {
        JsValue::from_str(&err.0)
    }
}