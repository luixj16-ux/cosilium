import { ForbiddenError, NotFoundError } from './errors';
import { PageRange } from '../domain/PageRange';
import { CaseActivity } from '../domain/CaseActivity';
import type { User } from '../domain/User';
import type { LegalCase } from '../domain/LegalCase';
import type { CaseRepository } from '../domain/ports/CaseRepository';

export interface AddCaseActuationInput {
  actor: User;
  publicId: string;
  activityType: string;
  summary: string;
  signedBy: string;
  activityDate?: string;
}

export class AddCaseActuationUseCase {
  constructor(private readonly caseRepository: CaseRepository) {}

  execute(input: AddCaseActuationInput): LegalCase {
    if (!input.actor.isAdmin) {
      throw new ForbiddenError('Permiso denegado: El público solo tiene acceso de lectura.');
    }
    const legalCase = this.caseRepository.findByPublicId(input.publicId);
    if (!legalCase) {
      throw new NotFoundError('Expediente no encontrado.');
    }
    const start = legalCase.pages + 1;
    const end = legalCase.pages + 2;
    const pageRange = PageRange.create(start, end);
    const today = input.activityDate ?? new Date().toLocaleDateString('es-AR');
    const activity = CaseActivity.create({
      id: 0,
      caseId: legalCase.internalId,
      activityDate: today,
      activityType: input.activityType,
      summary: input.summary.trim(),
      signedBy: input.signedBy.trim(),
      pageRange: pageRange.toString()
    });
    legalCase.addActuation(activity);
    this.caseRepository.save(legalCase);
    return legalCase;
  }
}