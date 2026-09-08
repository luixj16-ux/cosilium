/**
 * DocumentId — Value Object.
 *
 * Identificador único e inmutable de un documento (append-only).
 * Un id NUNCA se reutiliza: las correcciones producen un `DocumentId`
 * nuevo. Esta es una invariante de la arquitectura (ver
 * `.agents/rules/sync-architecture.md`).
 *
 * Capa de dominio: código TypeScript puro, sin dependencias externas.
 */
export class DocumentId {
  private static readonly PATTERN = /^doc_[a-z0-9_-]{2,64}$/;

  private constructor(public readonly value: string) {
    if (!DocumentId.PATTERN.test(value)) {
      throw new Error(
        `DocumentId inválido: "${value}". Formato esperado: doc_<8-64 chars alfanuméricos>.`
      );
    }
  }

  /**
   * Crea un DocumentId validado a partir de una cadena existente.
   * Es la única forma de reconstruir un id ya persistido.
   */
  static from(value: string): DocumentId {
    return new DocumentId(value);
  }

  /**
   * Genera un DocumentId nuevo y único.
   * Append-only: cada llamada crea un id irrepetible.
   */
  static generate(): DocumentId {
    const randomPart =
      typeof globalThis.crypto !== 'undefined'
        ? globalThis.crypto.randomUUID()
        : `ts-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
    const normalized = randomPart.replace(/-/g, '_').toLowerCase();
    return new DocumentId(`doc_${normalized}`);
  }

  toString(): string {
    return this.value;
  }

  equals(other: DocumentId): boolean {
    return this.value === other.value;
  }
}