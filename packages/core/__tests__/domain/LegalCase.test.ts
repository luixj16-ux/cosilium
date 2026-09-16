import { describe, it, expect } from 'vitest';
import { LegalCase } from '../../src/domain/LegalCase';
import { CaseActivity } from '../../src/domain/CaseActivity';
import { CaseStatus, type CaseStatusValue } from '../../src/domain/CaseStatus';

const baseCase = {
  publicId: 'CASE-PENAL-1',
  courtId: 'penal',
  docketNumber: 'EXP-2025-00101-PENAL',
  title: 'HURTO AGRAVADO',
  subject: 'Hurto con fuerza',
  plaintiff: 'Estado',
  defendant: 'Luis Martínez',
  status: 'En Trámite' as CaseStatusValue,
  pages: 3,
};

describe('LegalCase', () => {
  it('create() establece valores por defecto', () => {
    const c = LegalCase.create(baseCase);
    expect(c.status.equals(CaseStatus.EN_TRAMITE)).toBe(true);
    expect(c.attorney).toBeNull();
    expect(c.amount).toBe(0);
    expect(c.internalId).toBe(0);
  });

  it('addActuation() actualiza pages y lastActivityAt', () => {
    const c = LegalCase.create(baseCase);
    const act = CaseActivity.create({
      id: 1,
      caseId: 1,
      activityDate: '2025-07-01',
      activityType: 'Auto',
      summary: 'Nueva actuación',
      signedBy: 'Juez',
      pageRange: '4-5',
    });
    c.addActuation(act);
    expect(c.getTotalActuations()).toBe(1);
    expect(c.pages).toBe(5);
    expect(c.lastActivityAt).toBe('2025-07-01');
  });

  it('advanceStatus() permite transición válida', () => {
    const c = LegalCase.create(baseCase);
    c.advanceStatus(CaseStatus.APERTURA_A_PRUEBA);
    expect(c.status.value).toBe('Apertura a Prueba');
  });

  it('advanceStatus() bloquea transición inválida', () => {
    const c = LegalCase.create({ ...baseCase, status: 'En Trámite' });
    expect(() => c.advanceStatus(CaseStatus.SENTENCIA_DICTADA)).toThrow('Transición inválida');
  });

  it('actuaciones son inmutables desde fuera', () => {
    const c = LegalCase.create(baseCase);
    expect(() => {
      (c.actuations as unknown as unknown[]).push({});
    }).not.toThrow();
    expect(c.getTotalActuations()).toBe(0);
  });
});