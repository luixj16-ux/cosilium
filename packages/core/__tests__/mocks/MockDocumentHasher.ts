/**
 * MockDocumentHasher — Fake determinista del puerto DocumentHasher.
 *
 * Devuelve un SHA-256 estable para un buffer dado (vía Web Crypto),
 * simulando el cálculo que en producción hace Rust/Wasm.
 */
import type { DocumentHasher } from '../../src/domain/ports/DocumentHasher';
import { FileHash } from '../../src/domain/FileHash';
import { bytesToHex } from '../../src/infrastructure/WebCryptoDocumentHasher';

export class MockDocumentHasher implements DocumentHasher {
  async hash(buffer: Uint8Array): Promise<FileHash> {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', new Uint8Array(buffer));
    return FileHash.fromHex(bytesToHex(new Uint8Array(digest)));
  }
}