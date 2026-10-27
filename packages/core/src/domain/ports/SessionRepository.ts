import type { User } from '../User';

export interface SessionRepository {
  create(userId: number, token: string, expiresAt: Date): void;
  findUserByToken(token: string): User | null;
  deleteByToken(token: string): void;
  deleteAllForUser(userId: number): void;
}