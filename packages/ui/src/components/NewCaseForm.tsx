import React, { useState } from 'react';
import type { CreateCaseInputDto } from '@consilium/contracts';
import type { CourtDto } from '@consilium/contracts';

export interface NewCaseFormProps {
  court: CourtDto;
  onSubmit: (input: CreateCaseInputDto) => void;
  onCancel: () => void;
}

/**
 * NewCaseForm — Dumb Component. Radicación de nueva causa.
 * El tribunal es fijo (prop); el resto es estado local del formulario.
 */
export const NewCaseForm: React.FC<NewCaseFormProps> = ({ court, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [plaintiff, setPlaintiff] = useState('');
  const [defendant, setDefendant] = useState('');
  const [attorney, setAttorney] = useState('');
  const [amount, setAmount] = useState(0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ courtId: court.id, title, subject, plaintiff, defendant, attorney: attorney || null, amount });
  };

  return (
    <form className="NewCaseForm" onSubmit={submit}>
      <h3>Radicación de Nueva Causa en el TSJ</h3>
      <p className="NewCaseForm-court">Tribunal: {court.name}</p>

      <label htmlFor="nc-title">Carátula de la Causa</label>
      <input id="nc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: PÉREZ, MARÍA C/ CORPORACIÓN NACIONAL S/ RECLAMO" required />

      <label htmlFor="nc-subject">Objeto o Pretensión Procesal</label>
      <input id="nc-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ej.: Régimen de Convivencia" required />

      <label htmlFor="nc-plaintiff">Parte Demandante / Actora / Denunciante</label>
      <input id="nc-plaintiff" value={plaintiff} onChange={(e) => setPlaintiff(e.target.value)} required />

      <label htmlFor="nc-defendant">Parte Demandada / Imputada</label>
      <input id="nc-defendant" value={defendant} onChange={(e) => setDefendant(e.target.value)} required />

      <label htmlFor="nc-attorney">Abogado Patrocinante / Defensor</label>
      <input id="nc-attorney" value={attorney} onChange={(e) => setAttorney(e.target.value)} placeholder="Dr./Dra. y N° INPREABOGADO" />

      <label htmlFor="nc-amount">Monto Demandado / Cuantía</label>
      <input id="nc-amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

      <div className="NewCaseForm-actions">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="NewCaseForm-submit">
          Foliar y Radicar Expediente
        </button>
      </div>
    </form>
  );
};