/**
 * PageCount — Value Object.
 *
 * Cantidad de páginas/fojas de un documento. Invariante de dominio:
 * un documento NO puede exceder 500 páginas en modo offline (límite
 * de integridad documental). El conteo es un entero positivo.
 *
 * Capa de dominio: código TypeScript puro, sin dependencias externas.
 */
export const MAX_OFFLINE_PAGE_COUNT = 500;

export class PageCount {
  private constructor(public readonly value: number) {}

  /**
   * Crea un PageCount validado. Lanza si el conteo no es un entero
   * entre 1 y MAX_OFFLINE_PAGE_COUNT.
   */
  static create(value: number): PageCount {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`PageCount inválido: "${value}" debe ser un entero >= 1.`);
    }
    if (value > MAX_OFFLINE_PAGE_COUNT) {
      throw new Error(
        `PageCount inválido: "${value}" excede el límite offline de ${MAX_OFFLINE_PAGE_COUNT} páginas.`
      );
    }
    return new PageCount(value);
  }

  toNumber(): number {
    return this.value;
  }

  equals(other: PageCount): boolean {
    return this.value === other.value;
  }
}