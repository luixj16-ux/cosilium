export interface AuditEventProps {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string | null;
  metadataJson: string | null;
  createdAt: Date;
}

export class AuditEvent {
  public readonly id: number;
  public readonly userId: number | null;
  public readonly action: string;
  public readonly entityType: string;
  public readonly entityId: string;
  public readonly ipAddress: string | null;
  public readonly metadataJson: string | null;
  public readonly createdAt: Date;

  private constructor(props: AuditEventProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.action = props.action;
    this.entityType = props.entityType;
    this.entityId = props.entityId;
    this.ipAddress = props.ipAddress;
    this.metadataJson = props.metadataJson;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id?: number;
    userId: number | null;
    action: string;
    entityType: string;
    entityId: string;
    ipAddress?: string | null;
    metadataJson?: string | null;
    createdAt?: Date;
  }): AuditEvent {
    return new AuditEvent({
      id: props.id ?? 0,
      userId: props.userId,
      action: props.action,
      entityType: props.entityType,
      entityId: props.entityId,
      ipAddress: props.ipAddress ?? null,
      metadataJson: props.metadataJson ?? null,
      createdAt: props.createdAt ?? new Date()
    });
  }
}