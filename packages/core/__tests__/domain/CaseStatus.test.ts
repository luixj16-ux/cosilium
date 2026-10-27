import { describe, it, expect } from 'vitest';
import { CaseStatus, CASE_STATUSES } from '../../src/domain/CaseStatus';

describe('CaseStatus', () => {
  it('Tiene 5 estados válidos', () => {
    expect(Object.keys(CASE_STATUSES)).toHaveLength(5);
  });

  it('from() retorna instancias correctas', () => {
    expect(CaseStatus.from('En Trámite')).toBe(CaseStatus.EN_TRAMITE);
    expect(CaseStatus.from('Archivado')).toBe(CaseStatus.ARCHIVADO);
  });

  it('from() lanza con valor inválido', () => {
    expect(() => CaseStatus.from('Desconocido')).toThrow('CaseStatus inválido');
  });

  it('canTransitionTo() valida transiciones', () => {
    expect(CaseStatus.EN_TRAMITE.canTransitionTo(CaseStatus.APERTURA_A_PRUEBA)).toBe(true);
    expect(CaseStatus.EN_TRAMITE.canTransitionTo(CaseStatus.SENTENCIA_DICTADA)).toBe(false);
    expect(CaseStatus.ARCHIVADO.canTransitionTo(CaseStatus.EN_TRAMITE)).toBe(false);
    expect(CaseStatus.AUTOS_PARA_SENTENCIA.canTransitionTo(CaseStatus.SENTENCIA_DICTADA)).toBe(true);
  });

  it('equals() y toString()', () => {
    expect(CaseStatus.EN_TRAMITE.equals(CaseStatus.EN_TRAMITE)).toBe(true);
    expect(CaseStatus.EN_TRAMITE.toString()).toBe('En Trámite');
  });
});
