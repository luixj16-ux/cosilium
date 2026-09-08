import { describe, it, expect } from 'vitest';
import { DocumentExtension, ALLOWED_EXTENSIONS } from '../../src/domain/DocumentExtension';

describe('DocumentExtension (Value Object — formatos válidos)', () => {
  it('Debe aceptar PDF, JPEG y PNG (con o sin punto, mayúsculas/minúsculas)', () => {
    expect(DocumentExtension.from('pdf').value).toBe('PDF');
    expect(DocumentExtension.from('.jpeg').value).toBe('JPEG');
    expect(DocumentExtension.from('Png').value).toBe('PNG');
    expect(DocumentExtension.from('PNG').value).toBe('PNG');
  });

  it('Debe rechazar extensiones fuera del conjunto permitido', () => {
    expect(() => DocumentExtension.from('exe')).toThrow();
    expect(() => DocumentExtension.from('docx')).toThrow();
    expect(() => DocumentExtension.from('')).toThrow();
  });

  it('Debe exponer el conjunto permitido como invariante', () => {
    expect(ALLOWED_EXTENSIONS).toEqual(['PDF', 'JPEG', 'PNG']);
    expect(DocumentExtension.isAllowed('PDF')).toBe(true);
    expect(DocumentExtension.isAllowed('ZIP')).toBe(false);
  });

  it('Debe soportar igualdad por valor', () => {
    expect(DocumentExtension.from('pdf').equals(DocumentExtension.from('PDF'))).toBe(true);
  });
});