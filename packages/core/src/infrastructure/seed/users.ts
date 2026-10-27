import { User } from '../../domain/User';
import { Password } from '../../domain/Password';

export function buildSeedUsers(): readonly User[] {
  return [
    User.create({
      id: 1,
      username: 'consulta-publica',
      fullName: 'Consulta Pública',
      email: 'consulta@tsj.test',
      role: 'public',
      passwordHash: Password.create('Consulta123!').value,
      active: true,
    }),
    User.create({
      id: 2,
      username: 'admin',
      fullName: 'Administrador',
      email: 'admin@tsj.test',
      role: 'public',
      passwordHash: Password.create('Admin12345!').value,
      active: true,
    }),
  ];
}