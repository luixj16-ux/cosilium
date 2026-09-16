import type { Court, LegalCase, User, CaseActivity } from '@consilium/core';
import type {
  CourtDto,
  LegalCaseDto,
  CaseActivityDto,
  UserDto
} from '@consilium/contracts';

export function toCourtDto(court: Court): CourtDto {
  return {
    id: court.id,
    name: court.name,
    description: court.description,
    category: court.category,
    jurisdiction: court.jurisdiction
  };
}

export function toActivityDto(act: CaseActivity): CaseActivityDto {
  return {
    activityDate: act.activityDate,
    activityType: act.activityType,
    summary: act.summary,
    signedBy: act.signedBy,
    pageRange: act.pageRange?.toString() ?? null
  };
}

export function toCaseDto(legalCase: LegalCase): LegalCaseDto {
  return {
    publicId: legalCase.publicId,
    courtId: legalCase.courtId,
    docketNumber: legalCase.docketNumber,
    title: legalCase.title,
    subject: legalCase.subject,
    plaintiff: legalCase.plaintiff,
    defendant: legalCase.defendant,
    attorney: legalCase.attorney,
    amount: legalCase.amount,
    status: legalCase.status.value,
    pages: legalCase.pages,
    filedAt: legalCase.filedAt,
    lastActivityAt: legalCase.lastActivityAt,
    actuations: legalCase.actuations.map(toActivityDto)
  };
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    username: user.username.value,
    fullName: user.fullName,
    email: user.email.value,
    role: user.role.value,
    inpre: user.inpre,
    active: user.active,
    createdAt: user.createdAt.toISOString()
  };
}