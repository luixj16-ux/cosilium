import React from 'react';
import type { LegalCaseDto } from '@consilium/contracts';
import { CaseCard } from './CaseCard';

export interface CasesListProps {
  legalCases: LegalCaseDto[];
  courtName?: string;
  onOpenCase: (publicId: string) => void;
}

/**
 * CasesList — Dumb Component. Listado de expedientes del tribunal.
 */
export const CasesList: React.FC<CasesListProps> = ({ legalCases, courtName, onOpenCase }) => {
  return (
    <div className="cases-clean-list">
      {legalCases.map((legalCase) => (
        <CaseCard
          key={legalCase.publicId}
          legalCase={legalCase}
          courtName={courtName}
          onOpen={onOpenCase}
        />
      ))}
      {legalCases.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-card)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <i
            className="fa-solid fa-folder-open"
            style={{ fontSize: 42, color: 'var(--tsj-blue-primary)', marginBottom: 12 }}
          />
          <h3 style={{ color: 'var(--tsj-blue-dark)', marginBottom: 4 }}>
            No se encontraron causas registradas
          </h3>
          <p>
            No hay expedientes que coincidan con el término de búsqueda ingresado en este
            Tribunal.
          </p>
        </div>
      ) : null}
    </div>
  );
};