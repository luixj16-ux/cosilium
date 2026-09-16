import React from 'react';
import type { LegalCaseDto } from '@consilium/contracts';
import { CaseCard } from './CaseCard';

export interface CasesListProps {
  legalCases: LegalCaseDto[];
  onOpenCase: (publicId: string) => void;
}

/**
 * CasesList — Dumb Component. Lista de expedientes de un tribunal,
 * pudiendo estar vacía (estado visible explícito).
 */
export const CasesList: React.FC<CasesListProps> = ({ legalCases, onOpenCase }) => {
  return (
    <div className="CasesList">
      {legalCases.map((c) => (
        <CaseCard key={c.publicId} legalCase={c} onOpen={onOpenCase} />
      ))}
      {legalCases.length === 0 ? (
        <p className="CasesList-empty">No se encontraron expedientes para este tribunal.</p>
      ) : null}
    </div>
  );
};