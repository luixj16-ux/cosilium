import type { AuditLog } from '../domain/ports/AuditLog';
import type { AuditEvent } from '../domain/AuditEvent';

export class InMemoryAuditLog implements AuditLog {
  private readonly events: AuditEvent[] = [];

  record(event: AuditEvent): void {
    this.events.push(event);
  }

  nextId(): number {
    return this.events.length + 1;
  }

  list(): AuditEvent[] {
    return [...this.events];
  }
}