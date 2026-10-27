import { describe, it, expect } from 'vitest';
import { DocumentId } from '../../src/domain/DocumentId';

describe('DocumentId (Value Object — append-only)', () => {
  it('Debe aceptar un id con formato válido', () => {
    const id = DocumentId.from('doc_abc_123');
    expect(id.value).toBe('doc_abc_123');
  });

  it('Debe rechazar ids con formato inválido', () => {
    expect(() => DocumentId.from('NOPE')).toThrow();
    expect(() => DocumentId.from('')).toThrow();
    expect(() => DocumentId.from('doc_x')).toThrow();
    expect(() => DocumentId.from('doc_' + 'a'.repeat(100))).toThrow();
  });

  it('Debe generar ids únicos e irrepetibles (append-only)', () => {
    const a = DocumentId.generate();
    const b = DocumentId.generate();
    expect(a.equals(b)).toBe(false);
    expect(() => DocumentId.from(a.value)).not.toThrow();
  });

  it('Debe soportar comparación e igualdad', () => {
    const a = DocumentId.from('doc_same');
    const b = DocumentId.from('doc_same');
    const c = DocumentId.from('doc_other');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});