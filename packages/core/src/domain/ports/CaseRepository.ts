import type { LegalCase } from '../LegalCase';

export interface CaseRepository {
  save(legalCase: LegalCase): void;
  findByPublicId(publicId: string): LegalCase | null;
  findByInternalId(internalId: number): LegalCase | null;
  findByCourtId(courtId: string): LegalCase[];
  search(courtId: string, term: string): LegalCase[];
  delete(publicId: string): boolean;
  nextInternalId(): number;
}