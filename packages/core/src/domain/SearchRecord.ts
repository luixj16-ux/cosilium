export interface SearchRecordProps {
  id: number;
  userId: number;
  queryText: string;
  courtId: string | null;
  resultCount: number;
  source: string;
  createdAt: Date;
}

export class SearchRecord {
  public readonly id: number;
  public readonly userId: number;
  public readonly queryText: string;
  public readonly courtId: string | null;
  public readonly resultCount: number;
  public readonly source: string;
  public readonly createdAt: Date;

  private constructor(props: SearchRecordProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.queryText = props.queryText;
    this.courtId = props.courtId;
    this.resultCount = props.resultCount;
    this.source = props.source;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: number;
    userId: number;
    queryText: string;
    courtId?: string | null;
    resultCount?: number;
    source?: string;
    createdAt?: Date;
  }): SearchRecord {
    return new SearchRecord({
      id: props.id,
      userId: props.userId,
      queryText: props.queryText.slice(0, 200),
      courtId: props.courtId ?? null,
      resultCount: props.resultCount ?? 0,
      source: props.source ?? 'portal',
      createdAt: props.createdAt ?? new Date()
    });
  }
}