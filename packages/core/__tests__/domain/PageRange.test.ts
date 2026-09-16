import { describe, it, expect } from 'vitest';
import { PageRange } from '../../src/domain/PageRange';

describe('PageRange', () => {
  it('create() con rango válido', () => {
    const p = PageRange.create(1, 5);
    expect(p.start).toBe(1);
    expect(p.end).toBe(5);
  });

  it('create() lanza si start < 1', () => {
    expect(() => PageRange.create(0, 5)).toThrow();
  });

  it('create() lanza si end < start', () => {
    expect(() => PageRange.create(5, 3)).toThrow();
  });

  it('fromString() parsea correctamente', () => {
    const p = PageRange.fromString('3-7');
    expect(p.start).toBe(3);
    expect(p.end).toBe(7);
  });

  it('fromString() lanza con formato inválido', () => {
    expect(() => PageRange.fromString('abc')).toThrow();
  });

  it('pageCount() calcula correctamente', () => {
    expect(PageRange.create(2, 5).pageCount()).toBe(4);
  });

  it('equals() y toString()', () => {
    const a = PageRange.create(1, 3);
    const b = PageRange.create(1, 3);
    const c = PageRange.create(2, 4);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
    expect(a.toString()).toBe('1-3');
  });
});
