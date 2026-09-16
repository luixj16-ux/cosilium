const DOCKET_NUMBER_PATTERN = /^EXP-\d{4}-\d{5}-[A-Z0-9_]+$/;

export class DocketNumber {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): DocketNumber {
    const normalized = raw.trim().toUpperCase();
    if (!DOCKET_NUMBER_PATTERN.test(normalized)) {
      throw new Error(
        `DocketNumber inválido: "${raw}". Formato esperado: EXP-2026-00104-LOPNNA.`
      );
    }
    return new DocketNumber(normalized);
  }

  static generate(year: number, sequence: number, jurisdictionCode: string): DocketNumber {
    const padded = String(sequence).padStart(5, '0');
    return DocketNumber.create(`EXP-${year}-${padded}-${jurisdictionCode.toUpperCase()}`);
  }

  equals(other: DocketNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}