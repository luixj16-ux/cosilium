export interface PasswordHasher {
  hash(password: string): string;
  verify(password: string, storedHash: string): boolean;
}