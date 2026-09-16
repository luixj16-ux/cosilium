export const USER_ROLES = {
  PUBLIC: 'public',
  ADMIN: 'admin'
} as const;

export type UserRoleValue = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export class UserRole {
  private constructor(public readonly value: UserRoleValue) {}

  static readonly PUBLIC = new UserRole(USER_ROLES.PUBLIC);
  static readonly ADMIN = new UserRole(USER_ROLES.ADMIN);

  static from(value: string): UserRole {
    switch (value) {
      case USER_ROLES.PUBLIC:
        return UserRole.PUBLIC;
      case USER_ROLES.ADMIN:
        return UserRole.ADMIN;
      default:
        throw new Error(`UserRole inválido: "${value}".`);
    }
  }

  isAdmin(): boolean {
    return this.value === USER_ROLES.ADMIN;
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}