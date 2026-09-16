export interface SessionProps {
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

export class Session {
  public readonly token: string;
  public readonly userId: number;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;

  private constructor(props: SessionProps) {
    this.token = props.token;
    this.userId = props.userId;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    token: string;
    userId: number;
    expiresAt?: Date;
    createdAt?: Date;
  }): Session {
    return new Session({
      token: props.token,
      userId: props.userId,
      expiresAt: props.expiresAt ?? new Date(Date.now() + 8 * 60 * 60 * 1000),
      createdAt: props.createdAt ?? new Date()
    });
  }

  isExpired(): boolean {
    return Date.now() > this.expiresAt.getTime();
  }
}