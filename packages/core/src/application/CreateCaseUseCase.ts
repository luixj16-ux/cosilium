import { ForbiddenError, NotFoundError } from './errors';
import { DocketNumber } from '../domain/DocketNumber';
import { CaseActivity } from '../domain/CaseActivity';
import { LegalCase } from '../domain/LegalCase';
import type { User } from '../domain/User';
import type { CourtRepository } from '../domain/ports/CourtRepository';
import type { CaseRepository } from '../domain/ports/CaseRepository';

export interface CreateCaseInput {
  actor: User;
  courtId: string;
  title: string;
  subject: string;
  plaintiff: string;
  defendant: string;
  attorney?: string | null;
  amount?: number;
  juzgado?: string | null;
}

export class CreateCaseUseCase {
  constructor(
    private readonly courtRepository: CourtRepository,
    private readonly caseRepository: CaseRepository
  ) {}

  execute(input: CreateCaseInput): LegalCase {
    if (!input.actor.isAdmin) {
      throw new ForbiddenError('Permiso denegado: Solo el personal judicial puede registrar causas.');
    }
    const court = this.courtRepository.findById(input.courtId);
    if (!court) {
      throw new NotFoundError('Tribunal no encontrado.');
    }
    const sequence = this.caseRepository.findByCourtId(input.courtId).length + 101;
    const year = new Date().getFullYear();
    const docket = DocketNumber.generate(year, sequence, input.courtId);
    const today = new Date().toLocaleDateString('es-AR');
    const juzgado = input.juzgado || court.name;
    const initialActuation = CaseActivity.create({
      id: 0,
      caseId: 0,
      activityDate: today,
      activityType: 'Radicación de Causa',
      summary: `Ingreso formal del escrito y auto de radicación en ${juzgado}.`,
      signedBy: input.attorney || 'Juez',
      pageRange: '1-10'
    });
    const legalCase = LegalCase.create({
      publicId: 'CASE-' + Date.now(),
      courtId: input.courtId,
      docketNumber: docket.value,
      title: input.title.toUpperCase().trim(),
      subject: input.subject.trim(),
      plaintiff: input.plaintiff.trim(),
      defendant: input.defendant.trim(),
      attorney: input.attorney ?? null,
      amount: input.amount ?? 0,
      status: 'En Trámite',
      pages: 10,
      filedAt: today,
      lastActivityAt: today,
      actuations: [initialActuation]
    });
    this.caseRepository.save(legalCase);
    return legalCase;
  }
}