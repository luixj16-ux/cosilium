import { describe, it, expect } from 'vitest';
import { UserRole, USER_ROLES } from '../../src/domain/UserRole';

describe('UserRole', () => {
  it('PUBLIC y ADMIN están definidos', () => {
    expect(USER_ROLES.PUBLIC).toBe('public');
    expect(USER_ROLES.ADMIN).toBe('admin');
  });

  it('from() retorna instancias correctas', () => {
    expect(UserRole.from('public')).toBe(UserRole.PUBLIC);
    expect(UserRole.from('admin')).toBe(UserRole.ADMIN);
  });

  it('from() lanza con valor inválido', () => {
    expect(() => UserRole.from('superadmin')).toThrow();
  });

  it('isAdmin() retorna true solo para ADMIN', () => {
    expect(UserRole.PUBLIC.isAdmin()).toBe(false);
    expect(UserRole.ADMIN.isAdmin()).toBe(true);
  });

  it('equals() compara correctamente', () => {
    expect(UserRole.PUBLIC.equals(UserRole.PUBLIC)).toBe(true);
    expect(UserRole.PUBLIC.equals(UserRole.ADMIN)).toBe(false);
  });

  it('toString() retorna el valor', () => {
    expect(UserRole.PUBLIC.toString()).toBe('public');
  });
});
