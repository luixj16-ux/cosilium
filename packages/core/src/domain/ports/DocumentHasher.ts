/**
 * DocumentHasher — Puerto (Port) que abstrae el cálculo del SHA-256.
 *
 * La implementación real vive en Rust compilado a Wasm
 * (`rust/wasm-engine`), ejecutada en un Web Worker; el puerto mantiene
 * al dominio aislado de esa tecnología.
 *
 * Capa de dominio: declaraciones puras, sin dependencias externas.
 */
import type { FileHash } from '../FileHash';

export interface DocumentHasher {
  hash(buffer: Uint8Array): Promise<FileHash>;
}