import React from 'react';
import type { LegalCaseDto } from '@consilium/contracts';

export interface CaseCardProps {
  legalCase: LegalCaseDto;
  courtName?: string;
  onOpen: (publicId: string) => void;
}

const BADGE_CLASS: Record<string, string> = {
  'Autos para Sentencia': 'badge-purple',
  'Sentencia Dictada': 'badge-green',
  'Apertura a Prueba': 'badge-amber'
};

const TSJ_PRIMARY = { color: 'var(--tsj-blue-primary)' };

/**
 * CaseCard — Dumb Component. Fila de expediente en el listado del tribunal.
 */
export const CaseCard: React.FC<CaseCardProps> = ({ legalCase, courtName, onOpen }) => {
  const badgeClass = BADGE_CLASS[legalCase.status] ?? 'badge-blue';
  return (
    <article className="case-clean-item" data-case-id={legalCase.publicId}>
      <div className="case-clean-main">
        <span className="case-nue-tag">{legalCase.docketNumber}</span>
        <div className="case-clean-title">{legalCase.title}</div>
        <div className="case-clean-sub">
          <span>
            <i className="fa-solid fa-building-columns" style={TSJ_PRIMARY} />{' '}
            {courtName ?? legalCase.courtId}
          </span>
          <span>
            <i className="fa-solid fa-file-lines" style={TSJ_PRIMARY} /> {legalCase.pages} fojas
            foliadas
          </span>
          <span>
            <i className="fa-solid fa-clock" style={TSJ_PRIMARY} /> Última actuación:{' '}
            {legalCase.lastActivityAt ? legalCase.lastActivityAt.slice(0, 10) : '—'}
          </span>
        </div>
      </div>
      <div className="case-clean-actions">
        <span className={`clean-badge ${badgeClass}`} data-status={legalCase.status}>
          {legalCase.status}
        </span>
        <button
          type="button"
          className="btn-main btn-primary-clean"
          onClick={() => onOpen(legalCase.publicId)}
        >
          <i className="fa-solid fa-eye" /> Ver Expediente &amp; Descargar
        </button>
      </div>
    </article>
  );
};