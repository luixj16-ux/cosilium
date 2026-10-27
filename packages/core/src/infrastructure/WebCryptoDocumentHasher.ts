/**
 * WebCryptoDocumentHasher — Implementación del puerto DocumentHasher.
 *
 * Fallback determinista basado en Web Crypto (SHA-256). En producción
 * el hash lo calcula Rust/Wasm (rust/wasm-engine) en un Web Worker;
 * esta implementación es la garantía de comportamiento estándar del
 * Core en cualquier runtime (Web/Node).
 *
 * Capa de infraestructura: implementa puertos, no define reglas.
 */
import type { DocumentHasher } from '../domain/ports/DocumentHasher';
import { FileHash } from '../domain/FileHash';

export class WebCryptoDocumentHasher implements DocumentHasher {
  async hash(buffer: Uint8Array): Promise<FileHash> {
    if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
      throw new Error('WebCryptoDocumentHasher sin soporte de crypto.subtle en este runtime.');
    }
    const digest = await globalThis.crypto.subtle.digest('SHA-256', new Uint8Array(buffer));
    return FileHash.fromHex(bytesToHex(new Uint8Array(digest)));
  }
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i]!.toString(16).padStart(2, '0');
  }
  return hex;
}