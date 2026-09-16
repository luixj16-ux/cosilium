import type { SessionTokenGenerator } from '../domain/ports/SessionTokenGenerator';

export class CryptoRandomTokenGenerator implements SessionTokenGenerator {
  generate(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    let hex = '';
    for (const byte of bytes) {
      hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
  }
}