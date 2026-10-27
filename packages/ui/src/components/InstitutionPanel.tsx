import React from 'react';

export interface InstitutionPanelProps {
  active?: boolean;
}

const CARDS = [
  {
    icon: 'fa-solid fa-bullseye',
    featured: true,
    label: 'Misión',
    title: 'Garantizar justicia accesible',
    text: 'Administrar justicia de manera independiente, transparente, oportuna y cercana a la ciudadanía, protegiendo los derechos y garantías constitucionales.'
  },
  {
    icon: 'fa-solid fa-eye',
    label: 'Visión',
    title: 'Un poder judicial confiable',
    text: 'Ser una institución moderna, ágil y reconocida por la excelencia de sus decisiones y la transformación digital de sus servicios.'
  },
  {
    icon: 'fa-solid fa-handshake-angle',
    label: 'Compromiso',
    title: 'Servicio con integridad',
    text: 'Trabajamos con ética, responsabilidad y vocación de servicio para fortalecer la confianza en la justicia venezolana.'
  }
];

/**
 * InstitutionPanel — Dumb Component. Panel "TSJ institucional" con
 * Misión, Visión y Compromiso.
 */
export const InstitutionPanel: React.FC<InstitutionPanelProps> = ({ active = false }) => {
  return (
    <div className="portal-panel" id="institution-panel" data-portal-panel hidden={!active}>
      <div className="section-headline">
        <div>
          <span className="panel-kicker">Identidad institucional</span>
          <h2>Tribunal Supremo de Justicia</h2>
          <p>
            Principios que orientan el servicio judicial y el compromiso público del TSJ.
          </p>
        </div>
      </div>
      <div className="institution-grid">
        {CARDS.map((card) => (
          <article
            key={card.label}
            className={`institution-card ${card.featured ? 'institution-card-featured' : ''}`}
          >
            <span className="institution-icon">
              <i className={card.icon} />
            </span>
            <div>
              <span className="institution-label">{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};