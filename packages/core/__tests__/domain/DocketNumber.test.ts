import { describe, it, expect } from 'vitest';
import { DocketNumber } from '../../src/domain/DocketNumber';

describe('DocketNumber', () => {
  it('create() con formato válido', () => {
    const d = DocketNumber.create('EXP-2026-00104-LOPNNA');
    expect(d.value).toBe('EXP-2026-00104-LOPNNA');
  });

  it('create() normaliza a mayúsculas', () => {
    const d = DocketNumber.create('exp-2026-00104-lopnna');
    expect(d.value).toBe('EXP-2026-00104-LOPNNA');
  });

  it('create() lanza con formato inválido', () => {
    expect(() => DocketNumber.create('invalid')).toThrow();
    expect(() => DocketNumber.create('EXP-26-00104-LOPNNA')).toThrow();
  });

  it('generate() genera docket correcto', () => {
    const d = DocketNumber.generate(2026, 5, 'penal');
    expect(d.value).toBe('EXP-2026-00005-PENAL');
  });

  it('equals() y toString()', () => {
    const a = DocketNumber.create('EXP-2026-00101-LOPNNA');
    const b = DocketNumber.create('EXP-2026-00101-LOPNNA');
    expect(a.equals(b)).toBe(true);
    expect(a.toString()).toBe('EXP-2026-00101-LOPNNA');
  });
});
