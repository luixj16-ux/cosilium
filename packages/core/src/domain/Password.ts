const MIN_PASSWORD_LENGTH = 8;

export class Password {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Password {
    if (raw.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `Password inválido: la contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
      );
    }
    return new Password(raw);
  }

  static minLength(): number {
    return MIN_PASSWORD_LENGTH;
  }

  toString(): string {
    return '[REDACTED]';
  }
}