import type { AuditEvent } from '../AuditEvent';

export interface AuditLog {
  record(event: AuditEvent): void;
  nextId(): number;
}