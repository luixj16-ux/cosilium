export class PageRange {
  public readonly start: number;
  public readonly end: number;

  private constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  static create(start: number, end: number): PageRange {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
      throw new Error(`PageRange inválido: ${start}-${end}. Se requiere start >= 1 y end >= start.`);
    }
    return new PageRange(start, end);
  }

  static fromString(range: string): PageRange {
    const parts = range.split('-');
    if (parts.length !== 2) {
      throw new Error(`PageRange string inválido: "${range}". Formato esperado: "start-end".`);
    }
    return PageRange.create(Number(parts[0]!), Number(parts[1]!));
  }

  pageCount(): number {
    return this.end - this.start + 1;
  }

  toString(): string {
    return `${this.start}-${this.end}`;
  }

  equals(other: PageRange): boolean {
    return this.start === other.start && this.end === other.end;
  }
}