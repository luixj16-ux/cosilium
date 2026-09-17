import React from 'react';

export interface ServicesPanelProps {
  active?: boolean;
}

const SERVICES = [
  {
    icon: 'fa-solid fa-folder-open',
    label: 'Consulta pública',
    title: 'Buscar expediente',
    text: 'Localice causas por número de expediente, carátula o tribunal competente.'
  },
  {
    icon: 'fa-solid fa-file-signature',
    label: 'Trámites digitales',
    title: 'Solicitudes en línea',
    text: 'Revise requisitos y canales para presentar solicitudes y escritos digitales.'
  },
  {
    icon: 'fa-solid fa-phone-volume',
    label: 'Orientación',
    title: 'Canales de atención',
    text: 'Encuentre horarios, sedes y medios oficiales de contacto institucional.'
  }
];

/**
 * ServicesPanel — Dumb Component. Panel "Servicios al ciudadano".
 */
export const ServicesPanel: React.FC<ServicesPanelProps> = ({ active = false }) => {
  return (
    <div className="portal-panel" id="services-panel" data-portal-panel hidden={!active}>
      <div className="section-headline">
        <div>
          <span className="panel-kicker">Atención pública</span>
          <h2>Servicios al ciudadano</h2>
          <p>Accesos directos para consultar información y realizar gestiones ante el Poder Judicial.</p>
        </div>
      </div>
      <div className="interest-grid">
        {SERVICES.map((service) => (
          <article key={service.title} className="interest-card">
            <span className="interest-icon">
              <i className={service.icon} />
            </span>
            <div>
              <span className="institution-label">{service.label}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square interest-arrow" />
          </article>
        ))}
      </div>
    </div>
  );
};