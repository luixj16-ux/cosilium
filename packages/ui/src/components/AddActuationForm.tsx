import React, { useState } from 'react';
import type { AddCaseActuationInputDto } from '@consilium/contracts';

export interface AddActuationFormProps {
  onSave: (input: AddCaseActuationInputDto) => void;
  onCancel: () => void;
}

const ACTIVITY_TYPES = [
  'Escrito de Parte',
  'Auto / Providencia del Juez',
  'Boleta de Notificación',
  'Informe Pericial / Médico',
  'Dictamen Fiscal',
  'Sentencia Definitiva'
];

/**
 * AddActuationForm — Dumb Component. Incorpora una actuación procesal.
 * Solo recopila datos y reenvía el input al callback.
 */
export const AddActuationForm: React.FC<AddActuationFormProps> = ({ onSave, onCancel }) => {
  const [publicId, setPublicId] = useState('');
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]!);
  const [summary, setSummary] = useState('');
  const [signedBy, setSignedBy] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ publicId, activityType, summary, signedBy });
  };

  return (
    <form className="AddActuationForm" onSubmit={submit}>
      <h3>Incorporar Actuación Procesal</h3>

      <label htmlFor="aa-publicId">ID del expediente</label>
      <input id="aa-publicId" value={publicId} onChange={(e) => setPublicId(e.target.value)} required />

      <label htmlFor="aa-type">Tipo de Actuación</label>
      <select id="aa-type" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
        {ACTIVITY_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label htmlFor="aa-summary">Texto o Resumen de la Actuación</label>
      <textarea id="aa-summary" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} required />

      <label htmlFor="aa-signedBy">Firmado Por</label>
      <input id="aa-signedBy" value={signedBy} onChange={(e) => setSignedBy(e.target.value)} placeholder="Dr. Juez de Primera Instancia TSJ" required />

      <div className="AddActuationForm-actions">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="AddActuationForm-submit">
          Foliar y Guardar
        </button>
      </div>
    </form>
  );
};