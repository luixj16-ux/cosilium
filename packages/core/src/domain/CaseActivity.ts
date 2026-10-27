import { PageRange } from './PageRange';

export interface CaseActivityProps {
  id: number;
  caseId: number;
  activityDate: string;
  activityType: string;
  summary: string;
  signedBy: string;
  pageRange: PageRange | null;
  createdAt: Date;
}

export class CaseActivity {
  public readonly id: number;
  public readonly caseId: number;
  public readonly activityDate: string;
  public readonly activityType: string;
  public readonly summary: string;
  public readonly signedBy: string;
  public readonly pageRange: PageRange | null;
  public readonly createdAt: Date;

  private constructor(props: CaseActivityProps) {
    this.id = props.id;
    this.caseId = props.caseId;
    this.activityDate = props.activityDate;
    this.activityType = props.activityType;
    this.summary = props.summary;
    this.signedBy = props.signedBy;
    this.pageRange = props.pageRange;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: number;
    caseId: number;
    activityDate: string;
    activityType: string;
    summary: string;
    signedBy: string;
    pageRange?: string | null;
    createdAt?: Date;
  }): CaseActivity {
    return new CaseActivity({
      id: props.id,
      caseId: props.caseId,
      activityDate: props.activityDate,
      activityType: props.activityType,
      summary: props.summary,
      signedBy: props.signedBy,
      pageRange: props.pageRange ? PageRange.fromString(props.pageRange) : null,
      createdAt: props.createdAt ?? new Date()
    });
  }
}