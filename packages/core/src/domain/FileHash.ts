/**
 * FileHash — Value Object.
 *
 * Representa el SHA-256 del binario de un documento. Se usa para:
 *  - deduplicación (el servidor descarta binarios duplicados por hash), y
 *  - verificación de integridad (append-only).
 *
 * Invariante: formato hexadecimal de 64 caracteres (SHA-256).
 * Capa de dominio: código TypeScript puro, sin dependencias externas.
 */
export class FileHash {
  private static readonly SHA256_HEX = /^[a-f0-9]{64}$/;

  private constructor(public readonly value: string) {
    if (!FileHash.isValid(value)) {
      throw new Error(
        `FileHash inválido: debe ser un SHA-256 en hexadecimal de 64 caracteres.`
      );
    }
  }

  static isValid(value: string): value is string {
    return FileHash.SHA256_HEX.test(value);
  }

  /** Crea un FileHash normalizando a minúsculas. */
  static fromHex(hex: string): FileHash {
    return new FileHash(hex.toLowerCase());
  }

  toString(): string {
    return this.value;
  }

  equals(other: FileHash): boolean {
    return this.value === other.value;
  }
}