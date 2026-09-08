import { describe, it, expect } from 'vitest';
import { PageCount, MAX_OFFLINE_PAGE_COUNT } from '../../src/domain/PageCount';

describe('PageCount (Value Object — límite offline)', () => {
  it('Debe aceptar un conteo entero positivo', () => {
    expect(PageCount.create(1).value).toBe(1);
    expect(PageCount.create(500).value).toBe(500);
  });

  it('Debe rechazar conteos no enteros o inválidos', () => {
    expect(() => PageCount.create(0)).toThrow();
    expect(() => PageCount.create(-3)).toThrow();
    expect(() => PageCount.create(1.5)).toThrow();
  });

  it(`Debe rechazar más de ${MAX_OFFLINE_PAGE_COUNT} páginas en modo offline (invariante)`, () => {
    expect(() => PageCount.create(MAX_OFFLINE_PAGE_COUNT + 1)).toThrow();
  });

  it('Debe soportar igualdad por valor', () => {
    expect(PageCount.create(10).equals(PageCount.create(10))).toBe(true);
    expect(PageCount.create(10).equals(PageCount.create(11))).toBe(false);
  });
});