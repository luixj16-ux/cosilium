const USERNAME_PATTERN = /^[a-z0-9._-]{4,40}$/;

export class Username {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Username {
    const normalized = raw.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(normalized)) {
      throw new Error(
        `Username inválido: "${raw}". Requiere 4-40 caracteres (letras, números, puntos, guiones).`
      );
    }
    return new Username(normalized);
  }

  static isValid(raw: string): boolean {
    return USERNAME_PATTERN.test(raw.trim().toLowerCase());
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}