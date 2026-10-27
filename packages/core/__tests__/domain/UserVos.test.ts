import { describe, it, expect } from 'vitest';
import { Username } from '../../src/domain/Username';
import { Email } from '../../src/domain/Email';
import { Password } from '../../src/domain/Password';

describe('Username', () => {
  it('create() con valor válido', () => {
    const u = Username.create('juan.perez');
    expect(u.value).toBe('juan.perez');
  });

  it('create() normaliza a minúsculas', () => {
    const u = Username.create('JuanPerez');
    expect(u.value).toBe('juanperez');
  });

  it('create() lanza si es muy corto', () => {
    expect(() => Username.create('ab')).toThrow();
  });

  it('create() lanza con caracteres inválidos', () => {
    expect(() => Username.create('user@name')).toThrow();
  });

  it('isValid() valida correctamente', () => {
    expect(Username.isValid('valid-user')).toBe(true);
    expect(Username.isValid('no')).toBe(false);
  });
});

describe('Email', () => {
  it('create() con email válido', () => {
    const e = Email.create('test@example.com');
    expect(e.value).toBe('test@example.com');
  });

  it('create() normaliza', () => {
    const e = Email.create('  TEST@Test.COM  ');
    expect(e.value).toBe('test@test.com');
  });

  it('create() lanza sin @', () => {
    expect(() => Email.create('invalido')).toThrow();
  });
});

describe('Password', () => {
  it('create() con password válido', () => {
    const p = Password.create('12345678');
    expect(p.value).toBe('12345678');
  });

  it('create() lanza si es muy corta', () => {
    expect(() => Password.create('1234')).toThrow();
  });

  it('minLength() retorna 8', () => {
    expect(Password.minLength()).toBe(8);
  });
});
