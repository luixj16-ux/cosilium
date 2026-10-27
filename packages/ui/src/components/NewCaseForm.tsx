import React, { useState } from 'react';
import type { CourtDto, CreateCaseInputDto } from '@consilium/contracts';

export interface NewCaseFormProps {
  court: CourtDto;
  onSubmit: (input: CreateCaseInputDto) => void;
  onCancel: () => void;
}

const tsjReadonlyInput: React.CSSProperties = {
  background: 'var(--tsj-blue-subtle)',
  fontWeight: 700,
  color: 'var(--tsj-blue-dark)'
};

/**
 * NewCaseForm — Dumb Component. Radicación de nueva causa (solo administración).
 * El tribunal de radicación es fijo (prop); el resto es estado local del formulario.
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
    onSubmit({
      courtId: court.id,
      title,
      subject,
      plaintiff,
      defendant,
      attorney: attorney || null,
      amount
    });
  };

  return (
    <div
      className="NewCaseForm-card"
      style={{
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
        boxShadow: 'var(--shadow-card)',
        maxWidth: 820,
        margin: '0 auto'
      }}
    >
      <form id="admin-new-case-form" onSubmit={submit}>
        <div className="form-field" style={{ marginBottom: 18 }}>
          <label>Carátula de la Causa (Nombres de las partes y objeto del juicio)</label>
          <input
            type="text"
            id="anc-caratula"
            className="form-input"
            placeholder="Ej: PÉREZ, MARÍA C/ CORPORACIÓN NACIONAL S/ RECLAMO LOPNNA"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Tribunal / Juzgado de Radicación</label>
            <input type="text" id="anc-juzgado" className="form-input" style={tsjReadonlyInput} readOnly value={court.name} />
          </div>
          <div className="form-field">
            <label>Objeto o Pretensión Procesal</label>
            <input
              type="text"
              id="anc-objeto"
              className="form-input"
              placeholder="Ej: Régimen de Convivencia / Cobro de Prestaciones"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Parte Demandante / Actora / Denunciante</label>
            <input
              type="text"
              id="anc-actor"
              className="form-input"
              placeholder="Nombre completo o Institución"
              required
              value={plaintiff}
              onChange={(e) => setPlaintiff(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Parte Demandada / Imputada</label>
            <input
              type="text"
              id="anc-demandado"
              className="form-input"
              placeholder="Nombre de la contraparte"
              required
              value={defendant}
              onChange={(e) => setDefendant(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Abogado Patrocinante / Defensor</label>
            <input
              type="text"
              id="anc-letrado"
              className="form-input"
              placeholder="Dr. / Dra. y N° INPREABOGADO"
              required
              value={attorney}
              onChange={(e) => setAttorney(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Monto Demandado / Cuantía ($ / Bs.)</label>
            <input
              type="number"
              id="anc-monto"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <div style={{ marginTop: 26, display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
          <button type="button" className="btn-main btn-outline-clean" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-main btn-primary-clean">
            <i className="fa-solid fa-check" /> Foliar y Radicar Expediente
          </button>
        </div>
      </form>
    </div>
  );
};