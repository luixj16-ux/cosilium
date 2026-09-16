export const CASE_STATUSES = {
  EN_TRAMITE: 'En Trámite',
  APERTURA_A_PRUEBA: 'Apertura a Prueba',
  AUTOS_PARA_SENTENCIA: 'Autos para Sentencia',
  SENTENCIA_DICTADA: 'Sentencia Dictada',
  ARCHIVADO: 'Archivado'
} as const;

export type CaseStatusValue = (typeof CASE_STATUSES)[keyof typeof CASE_STATUSES];

export class CaseStatus {
  private constructor(public readonly value: CaseStatusValue) {}

  static readonly EN_TRAMITE = new CaseStatus(CASE_STATUSES.EN_TRAMITE);
  static readonly APERTURA_A_PRUEBA = new CaseStatus(CASE_STATUSES.APERTURA_A_PRUEBA);
  static readonly AUTOS_PARA_SENTENCIA = new CaseStatus(CASE_STATUSES.AUTOS_PARA_SENTENCIA);
  static readonly SENTENCIA_DICTADA = new CaseStatus(CASE_STATUSES.SENTENCIA_DICTADA);
  static readonly ARCHIVADO = new CaseStatus(CASE_STATUSES.ARCHIVADO);

  static from(value: string): CaseStatus {
    switch (value) {
      case CASE_STATUSES.EN_TRAMITE:
        return CaseStatus.EN_TRAMITE;
      case CASE_STATUSES.APERTURA_A_PRUEBA:
        return CaseStatus.APERTURA_A_PRUEBA;
      case CASE_STATUSES.AUTOS_PARA_SENTENCIA:
        return CaseStatus.AUTOS_PARA_SENTENCIA;
      case CASE_STATUSES.SENTENCIA_DICTADA:
        return CaseStatus.SENTENCIA_DICTADA;
      case CASE_STATUSES.ARCHIVADO:
        return CaseStatus.ARCHIVADO;
      default:
        throw new Error(`CaseStatus inválido: "${value}".`);
    }
  }

  static fromLegacyEstado(estado: string): CaseStatus {
    return CaseStatus.from(estado);
  }

  canTransitionTo(next: CaseStatus): boolean {
    switch (this.value) {
      case CASE_STATUSES.EN_TRAMITE:
        return next.value === CASE_STATUSES.APERTURA_A_PRUEBA ||
          next.value === CASE_STATUSES.AUTOS_PARA_SENTENCIA ||
          next.value === CASE_STATUSES.ARCHIVADO;
      case CASE_STATUSES.APERTURA_A_PRUEBA:
        return next.value === CASE_STATUSES.AUTOS_PARA_SENTENCIA ||
          next.value === CASE_STATUSES.ARCHIVADO;
      case CASE_STATUSES.AUTOS_PARA_SENTENCIA:
        return next.value === CASE_STATUSES.SENTENCIA_DICTADA ||
          next.value === CASE_STATUSES.ARCHIVADO;
      case CASE_STATUSES.SENTENCIA_DICTADA:
        return next.value === CASE_STATUSES.ARCHIVADO;
      case CASE_STATUSES.ARCHIVADO:
        return false;
      default:
        return false;
    }
  }

  equals(other: CaseStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}