import type { User } from '../User';

export interface UserRepository {
  save(user: User): void;
  findById(id: number): User | null;
  findByUsernameOrEmail(identifier: string): User | null;
  listAll(): User[];
  nextId(): number;
}