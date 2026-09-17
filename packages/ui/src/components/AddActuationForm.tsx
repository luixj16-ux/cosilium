import React, { useState } from 'react';
import type { AddCaseActuationInputDto } from '@consilium/contracts';

export interface AddActuationFormProps {
  publicId: string;
  onSave: (input: AddCaseActuationInputDto) => void;
  onCancel: () => void;
}

const ACTIVITY_TYPES: { value: string; label: string }[] = [
  { value: 'Escrito de Parte', label: 'Escrito de Parte (Abogado)' },
  { value: 'Auto / Providencia del Juez', label: 'Auto / Providencia del Juez' },
  { value: 'Boleta de Notificación', label: 'Boleta de Notificación' },
  { value: 'Informe Pericial / Médico', label: 'Informe Pericial / Médico' },
  { value: 'Dictamen Fiscal', label: 'Dictamen Fiscal (Ministerio Público)' },
  { value: 'Sentencia Definitiva', label: 'Sentencia Definitiva' }
];

/**
 * AddActuationForm — Dumb Component. Incorpora una actuación procesal
 * del expediente activo (publicId viene del padre).
 */
export const AddActuationForm: React.FC<AddActuationFormProps> = ({
  publicId,
  onSave,
  onCancel
}) => {
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]?.value ?? '');
  const [summary, setSummary] = useState('');
  const [signedBy, setSignedBy] = useState('Dr. Juez de Primera Instancia TSJ');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ publicId, activityType, summary, signedBy });
  };

  return (
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-label="Incorporar actuación procesal"
      onClick={onCancel}
    >
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-header">
          <h3>
            <i className="fa-solid fa-file-circle-plus" style={{ color: 'var(--tsj-blue-primary)' }} />{' '}
            Incorporar Actuación Procesal
          </h3>
          <button type="button" className="btn-circle" aria-label="Cerrar" onClick={onCancel}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-box-body">
          <form id="add-actuation-form" onSubmit={submit}>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label>Tipo de Actuación</label>
              <select
                id="act-tipo"
                className="form-input"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label>Texto o Resumen de la Actuación</label>
              <textarea
                id="act-texto"
                className="form-input"
                rows={3}
                placeholder="Describa la resolución judicial o escrito..."
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label>Firmado Por</label>
              <input
                type="text"
                id="act-firmante"
                className="form-input"
                required
                value={signedBy}
                onChange={(e) => setSignedBy(e.target.value)}
              />
            </div>
            <div className="modal-box-footer" style={{ padding: '16px 0 0 0' }}>
              <button type="button" className="btn-main btn-outline-clean" onClick={onCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn-main btn-primary-clean">
                Foliar y Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};