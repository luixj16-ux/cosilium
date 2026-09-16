export interface CourtProps {
  id: string;
  name: string;
  description: string;
  category: string;
  jurisdiction: string | null;
  active: boolean;
}

export class Court {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly category: string;
  public readonly jurisdiction: string | null;
  public readonly active: boolean;

  private constructor(props: CourtProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.jurisdiction = props.jurisdiction;
    this.active = props.active;
  }

  static create(props: Omit<CourtProps, 'jurisdiction' | 'active'> & {
    jurisdiction?: string | null;
    active?: boolean;
  }): Court {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Court id no puede estar vacío.');
    }
    return new Court({
      ...props,
      jurisdiction: props.jurisdiction ?? null,
      active: props.active ?? true
    });
  }

  equals(other: Court): boolean {
    return this.id === other.id;
  }
}