import React from 'react';
import type { LegalCaseDto } from '@consilium/contracts';

export interface CaseCardProps {
  legalCase: LegalCaseDto;
  onOpen: (publicId: string) => void;
}

/**
 * CaseCard — Dumb Component. Tarjeta de un expediente dentro de un
 * tribunal. Solo refleja datos y reenvía la selección.
 */
export const CaseCard: React.FC<CaseCardProps> = ({ legalCase, onOpen }) => {
  return (
    <article className="CaseCard" data-case-id={legalCase.publicId}>
      <span className="CaseCard-nue">{legalCase.docketNumber}</span>
      <h3 className="CaseCard-title">{legalCase.title}</h3>
      <p className="CaseCard-subject">{legalCase.subject}</p>
      <dl className="CaseCard-partes">
        <div>
          <dt>Demandante / Actora</dt>
          <dd>{legalCase.plaintiff}</dd>
        </div>
        <div>
          <dt>Demandada / Imputada</dt>
          <dd>{legalCase.defendant}</dd>
        </div>
      </dl>
      <span className="CaseCard-status" data-status={legalCase.status}>
        {legalCase.status}
      </span>
      <button type="button" className="CaseCard-open" onClick={() => onOpen(legalCase.publicId)}>
        Ver expediente
      </button>
    </article>
  );
};