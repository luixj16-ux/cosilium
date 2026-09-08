/**
 * DocumentExtension — Value Object.
 *
 * Formatos de archivo admitidos por el dominio (PDF, JPEG, PNG).
 * Invariante: la extensión debe estar dentro del conjunto permitido.
 * Las correcciones a un metadato de extensión producen un documento
 * nuevo (append-only); la extensión de un documento es inmutable.
 *
 * Capa de dominio: código TypeScript puro, sin dependencias externas.
 */
export const ALLOWED_EXTENSIONS = ['PDF', 'JPEG', 'PNG'] as const;

export type DocumentExtensionValue = (typeof ALLOWED_EXTENSIONS)[number];

export class DocumentExtension {
  private constructor(public readonly value: DocumentExtensionValue) {}

  static isAllowed(extension: string): extension is DocumentExtensionValue {
    return ALLOWED_EXTENSIONS.includes(extension.toUpperCase() as DocumentExtensionValue);
  }

  /** Crea una extensión válida, normalizando a mayúsculas. */
  static from(extension: string): DocumentExtension {
    const normalized = extension.toUpperCase().replace(/^\./, '');
    if (!DocumentExtension.isAllowed(normalized)) {
      throw new Error(
        `DocumentExtension inválida: "${extension}". Permitidas: ${ALLOWED_EXTENSIONS.join(', ')}.`
      );
    }
    return new DocumentExtension(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: DocumentExtension): boolean {
    return this.value === other.value;
  }
}