import React from 'react';
import type { LegalCaseDto } from '@consilium/contracts';
import { ActuationTimeline } from './ActuationTimeline';

export interface CaseDetailModalProps {
  legalCase: LegalCaseDto;
  courtName?: string;
  canEdit: boolean;
  onClose: () => void;
  onDelete: (publicId: string) => void;
  onAddActuation: (publicId: string) => void;
  onPrint?: () => void;
}

const STEP_LABELS = [
  '1. Demanda/Denuncia',
  '2. Admisión/Traslado',
  '3. Pruebas/Juicio',
  '4. Sentencia/Fallo'
];

function stepStates(status: string): ('completed' | 'active' | '')[] {
  switch (status) {
    case 'En Trámite':
      return ['completed', 'active', '', ''];
    case 'Apertura a Prueba':
      return ['completed', 'completed', 'active', ''];
    case 'Autos para Sentencia':
      return ['completed', 'completed', 'completed', 'active'];
    case 'Sentencia Dictada':
      return ['completed', 'completed', 'completed', 'completed'];
    default:
      return ['', '', '', ''];
  }
}

/**
 * CaseDetailModal — Dumb Component. Detalle del expediente en modal.
 */
export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  legalCase,
  courtName,
  canEdit,
  onClose,
  onDelete,
  onAddActuation,
  onPrint
}) => {
  const states = stepStates(legalCase.status);
  const handlePrint = onPrint ?? (() => window.print());

  return (
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del expediente"
      onClick={onClose}
    >
      <div
        className="modal-box"
        style={{ maxWidth: 800 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-box-header">
          <div>
            <span className="case-nue-tag" id="detail-nue">
              {legalCase.docketNumber}
            </span>
            <h3 style={{ marginTop: 4 }}>{legalCase.title}</h3>
          </div>
          <button type="button" className="btn-circle" aria-label="Cerrar" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-box-body">
          <div className="process-step-bar">
            {STEP_LABELS.map((label, index) => {
              const state = states[index] ?? '';
              return (
                <div key={label} className={`step-item ${state}`}>
                  <div className="step-dot">
                    {state === 'completed' ? (
                      <i className="fa-solid fa-check" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              background: 'var(--tsj-blue-subtle)',
              border: '1.5px solid var(--tsj-blue-surface)',
              borderRadius: 'var(--radius-md)',
              padding: 18,
              marginBottom: 22,
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div>
              <strong>Tribunal / Juzgado:</strong>{' '}
              <span>{courtName ?? legalCase.courtId}</span>
            </div>
            <div>
              <strong>Parte Demandante / Actora:</strong> <span>{legalCase.plaintiff}</span>
            </div>
            <div>
              <strong>Parte Demandada / Imputada:</strong> <span>{legalCase.defendant}</span>
            </div>
            <div>
              <strong>Abogado Defensor / Patrocinante:</strong>{' '}
              <span>{legalCase.attorney ?? 'No registrado'}</span>
            </div>
            <div>
              <strong>Fojas Foliadas:</strong>{' '}
              <strong style={{ color: 'var(--tsj-blue-primary)', fontSize: '1rem' }}>
                {legalCase.pages} fojas foliadas
              </strong>
            </div>
          </div>
          <h4
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.05rem',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--tsj-blue-dark)'
            }}
          >
            <i className="fa-solid fa-timeline" style={{ color: 'var(--tsj-blue-primary)' }} />
            Historial de Actuaciones Procesales
          </h4>
          <ActuationTimeline actuations={legalCase.actuations} />
        </div>
        <div className="modal-box-footer">
          {canEdit ? (
            <button
              type="button"
              className="btn-main btn-danger-clean"
              onClick={() => onDelete(legalCase.publicId)}
            >
              <i className="fa-solid fa-trash-can" /> Dar de Baja
            </button>
          ) : null}
          <button type="button" className="btn-main btn-outline-clean" onClick={handlePrint}>
            <i className="fa-solid fa-download" /> Descargar / Imprimir en PDF
          </button>
          {canEdit ? (
            <button
              type="button"
              className="btn-main btn-primary-clean"
              onClick={() => onAddActuation(legalCase.publicId)}
            >
              <i className="fa-solid fa-plus" /> Agregar Actuación
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};