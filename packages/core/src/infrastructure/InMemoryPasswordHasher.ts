import type { PasswordHasher } from '../domain/ports/PasswordHasher';

export class InMemoryPasswordHasher implements PasswordHasher {
  hash(password: string): string {
    return btoa(unescape(encodeURIComponent(password)));
  }

  verify(password: string, storedHash: string): boolean {
    return this.hash(password) === storedHash;
  }
}