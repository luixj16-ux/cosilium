import { CaseStatus, CASE_STATUSES, type CaseStatusValue } from './CaseStatus';
import { CaseActivity } from './CaseActivity';

export interface LegalCaseProps {
  publicId: string;
  internalId: number;
  courtId: string;
  docketNumber: string;
  title: string;
  subject: string;
  plaintiff: string;
  defendant: string;
  attorney: string | null;
  amount: number;
  status: CaseStatus;
  pages: number;
  filedAt: string | null;
  lastActivityAt: string | null;
  actuations: CaseActivity[];
  createdAt: Date;
}

export class LegalCase {
  public readonly publicId: string;
  public readonly internalId: number;
  public readonly courtId: string;
  public readonly docketNumber: string;
  public readonly title: string;
  public readonly subject: string;
  public readonly plaintiff: string;
  public readonly defendant: string;
  public readonly attorney: string | null;
  public readonly amount: number;
  public readonly filedAt: string | null;
  public readonly createdAt: Date;

  private _status: CaseStatus;
  private _pages: number;
  private _lastActivityAt: string | null;
  private _actuations: CaseActivity[];

  private constructor(props: LegalCaseProps) {
    this.publicId = props.publicId;
    this.internalId = props.internalId;
    this.courtId = props.courtId;
    this.docketNumber = props.docketNumber;
    this.title = props.title;
    this.subject = props.subject;
    this.plaintiff = props.plaintiff;
    this.defendant = props.defendant;
    this.attorney = props.attorney;
    this.amount = props.amount;
    this._status = props.status;
    this._pages = props.pages;
    this.filedAt = props.filedAt;
    this._lastActivityAt = props.lastActivityAt;
    this._actuations = [...props.actuations];
    this.createdAt = props.createdAt;
  }

  get actuations(): ReadonlyArray<CaseActivity> {
    return [...this._actuations];
  }

  get status(): CaseStatus {
    return this._status;
  }

  get pages(): number {
    return this._pages;
  }

  get lastActivityAt(): string | null {
    return this._lastActivityAt;
  }

  static create(props: {
    publicId: string;
    internalId?: number;
    courtId: string;
    docketNumber: string;
    title: string;
    subject: string;
    plaintiff: string;
    defendant: string;
    attorney?: string | null;
    amount?: number;
    status?: CaseStatusValue;
    pages?: number;
    filedAt?: string | null;
    lastActivityAt?: string | null;
    actuations?: CaseActivity[];
    createdAt?: Date;
  }): LegalCase {
    return new LegalCase({
      publicId: props.publicId,
      internalId: props.internalId ?? 0,
      courtId: props.courtId,
      docketNumber: props.docketNumber,
      title: props.title,
      subject: props.subject,
      plaintiff: props.plaintiff,
      defendant: props.defendant,
      attorney: props.attorney ?? null,
      amount: props.amount ?? 0,
      status: props.status ? CaseStatus.from(props.status) : CaseStatus.EN_TRAMITE,
      pages: props.pages ?? 0,
      filedAt: props.filedAt ?? null,
      lastActivityAt: props.lastActivityAt ?? null,
      actuations: props.actuations ?? [],
      createdAt: props.createdAt ?? new Date()
    });
  }

  advanceStatus(next: CaseStatus): void {
    if (!this._status.canTransitionTo(next)) {
      throw new Error(
        `Transición inválida: ${this._status.value} → ${next.value}.`
      );
    }
    this._status = next;
  }

  addActuation(actuation: CaseActivity): void {
    this._pages = actuation.pageRange ? actuation.pageRange.end : this._pages;
    this._lastActivityAt = actuation.activityDate;
    this._actuations.push(actuation);
  }

  getTotalActuations(): number {
    return this.actuations.length;
  }
}