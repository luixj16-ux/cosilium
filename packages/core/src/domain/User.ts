import { UserRole, USER_ROLES, type UserRoleValue } from './UserRole';
import { Username } from './Username';
import { Email } from './Email';

export interface UserProps {
  id: number;
  username: Username;
  fullName: string;
  email: Email;
  role: UserRole;
  passwordHash: string | null;
  inpre: string | null;
  active: boolean;
  createdAt: Date;
}

export class User {
  public readonly id: number;
  public readonly username: Username;
  public readonly fullName: string;
  public readonly email: Email;
  public readonly inpre: string | null;
  public readonly active: boolean;
  public readonly createdAt: Date;
  private _passwordHash: string | null;
  private _role: UserRole;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.fullName = props.fullName;
    this.email = props.email;
    this._role = props.role;
    this._passwordHash = props.passwordHash;
    this.inpre = props.inpre;
    this.active = props.active;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role?: UserRoleValue;
    passwordHash?: string | null;
    inpre?: string | null;
    active?: boolean;
    createdAt?: Date;
  }): User {
    return new User({
      id: props.id,
      username: Username.create(props.username),
      fullName: props.fullName.trim(),
      email: Email.create(props.email),
      role: props.role ? UserRole.from(props.role) : UserRole.PUBLIC,
      passwordHash: props.passwordHash ?? null,
      inpre: props.inpre ?? null,
      active: props.active ?? true,
      createdAt: props.createdAt ?? new Date()
    });
  }

  get role(): UserRole {
    return this._role;
  }

  get passwordHash(): string | null {
    return this._passwordHash;
  }

  get isAdmin(): boolean {
    return this.role.isAdmin();
  }

  promoteToAdmin(): void {
    if (this._roleEquals(USER_ROLES.ADMIN)) {
      throw new Error(`El usuario ${this.username.value} ya es administrador.`);
    }
    this._role = UserRole.ADMIN;
  }

  private _roleEquals(roleValue: UserRoleValue): boolean {
    return this.role.value === roleValue;
  }

  setPasswordHash(hash: string): void {
    this._passwordHash = hash;
  }

  toPublicDto(): {
    id: number;
    username: string;
    fullName: string;
    email: string | null;
    role: string;
    inpre: string | null;
    active: boolean;
    createdAt: string;
  } {
    return {
      id: this.id,
      username: this.username.value,
      fullName: this.fullName,
      email: this.email.value,
      role: this.role.value,
      inpre: this.inpre,
      active: this.active,
      createdAt: this.createdAt.toISOString()
    };
  }
}