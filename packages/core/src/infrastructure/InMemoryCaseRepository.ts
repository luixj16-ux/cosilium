import type { CaseRepository } from '../domain/ports/CaseRepository';
import type { LegalCase } from '../domain/LegalCase';

export class InMemoryCaseRepository implements CaseRepository {
  private readonly cases: LegalCase[] = [];

  constructor(seed: LegalCase[] = []) {
    this.cases = [...seed];
  }

  save(legalCase: LegalCase): void {
    const index = this.cases.findIndex((c) => c.publicId === legalCase.publicId);
    if (index >= 0) {
      this.cases[index] = legalCase;
    } else {
      this.cases.push(legalCase);
    }
  }

  findByPublicId(publicId: string): LegalCase | null {
    return this.cases.find((c) => c.publicId === publicId) ?? null;
  }

  findByInternalId(internalId: number): LegalCase | null {
    return this.cases.find((c) => c.internalId === internalId) ?? null;
  }

  findByCourtId(courtId: string): LegalCase[] {
    return this.cases.filter((c) => c.courtId === courtId);
  }

  search(courtId: string, term: string): LegalCase[] {
    const q = term.toLowerCase().trim();
    if (!q) return this.findByCourtId(courtId);
    return this.findByCourtId(courtId).filter(
      (c) =>
        c.docketNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.plaintiff.toLowerCase().includes(q) ||
        c.defendant.toLowerCase().includes(q)
    );
  }

  delete(publicId: string): boolean {
    const index = this.cases.findIndex((c) => c.publicId === publicId);
    if (index < 0) return false;
    this.cases.splice(index, 1);
    return true;
  }

  nextInternalId(): number {
    return this.cases.reduce((max, c) => Math.max(max, c.internalId), 0) + 1;
  }
}