import { describe, it, expect } from 'vitest';
import { FileHash } from '../../src/domain/FileHash';

const SHA256 = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

describe('FileHash (Value Object — SHA-256)', () => {
  it('Debe aceptar un hash hexadecimal de 64 caracteres', () => {
    const hash = FileHash.fromHex(SHA256);
    expect(hash.value).toBe(SHA256);
  });

  it('Debe normalizar a minúsculas', () => {
    const hash = FileHash.fromHex(SHA256.toUpperCase());
    expect(hash.value).toBe(SHA256);
  });

  it('Debe validar estructura de 64 hex exactos', () => {
    expect(FileHash.isValid(SHA256)).toBe(true);
    expect(FileHash.isValid('abc')).toBe(false);
    expect(FileHash.isValid('g' + SHA256.slice(1))).toBe(false);
    expect(FileHash.isValid(SHA256 + '0')).toBe(false);
  });

  it('Debe rechazar hashes mal formados al crearse', () => {
    expect(() => FileHash.fromHex('not-a-hash')).toThrow();
    expect(() => FileHash.fromHex('')).toThrow();
  });

  it('Debe soportar igualdad por valor', () => {
    expect(FileHash.fromHex(SHA256).equals(FileHash.fromHex(SHA256))).toBe(true);
  });
});