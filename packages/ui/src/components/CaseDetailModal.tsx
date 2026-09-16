import React from 'react';
import type { LegalCaseDto } from '@consilium/contracts';
import { ActuationTimeline } from './ActuationTimeline';

export interface CaseDetailModalProps {
  legalCase: LegalCaseDto;
  canEdit: boolean;
  onClose: () => void;
  onDelete: (publicId: string) => void;
  onAddActuation: (publicId: string) => void;
}

/**
 * CaseDetailModal — Dumb Component. Vista de detalle de un expediente
 * (modal). Las acciones de edición solo se muestran si `canEdit`.
 */
export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  legalCase,
  canEdit,
  onClose,
  onDelete,
  onAddActuation
}) => {
  return (
    <div className="ModalOverlay" role="dialog" aria-modal="true" aria-label="Detalle del expediente">
      <div className="CaseDetailModal">
        <div className="CaseDetailModal-header">
          <span className="CaseDetailModal-nue">{legalCase.docketNumber}</span>
          <button type="button" className="CaseDetailModal-close" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>
        </div>
        <h3 className="CaseDetailModal-title">{legalCase.title}</h3>
        <dl className="CaseDetailModal-meta">
          <div>
            <dt>Tribunal / Juzgado</dt>
            <dd>{legalCase.courtId}</dd>
          </div>
          <div>
            <dt>Parte Demandante / Actora</dt>
            <dd>{legalCase.plaintiff}</dd>
          </div>
          <div>
            <dt>Parte Demandada / Imputada</dt>
            <dd>{legalCase.defendant}</dd>
          </div>
          <div>
            <dt>Letrado</dt>
            <dd>{legalCase.attorney ?? 'No registrado'}</dd>
          </div>
          <div>
            <dt>Fojas Foliadas</dt>
            <dd>{legalCase.pages} fs.</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{legalCase.status}</dd>
          </div>
        </dl>
        <h4>Historial de Actuaciones Procesales</h4>
        <ActuationTimeline actuations={legalCase.actuations} />
        <div className="CaseDetailModal-actions">
          {canEdit ? (
            <button type="button" className="CaseDetailModal-delete" onClick={() => onDelete(legalCase.publicId)}>
              Dar de Baja
            </button>
          ) : null}
          {canEdit ? (
            <button type="button" className="CaseDetailModal-add" onClick={() => onAddActuation(legalCase.publicId)}>
              Agregar Actuación
            </button>
          ) : null}
          <button type="button" className="CaseDetailModal-print" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};