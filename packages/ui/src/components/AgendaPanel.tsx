import React from 'react';

export interface AgendaPanelProps {
  active?: boolean;
}

const AGENDA = [
  {
    date: '2026-09-08',
    day: '08',
    month: 'SEP',
    type: 'Jornada pública',
    title: 'Orientación sobre servicios judiciales digitales',
    place: 'Auditorio principal • 9:00 a. m.',
    status: 'Próximo'
  },
  {
    date: '2026-09-15',
    day: '15',
    month: 'SEP',
    type: 'Sesión institucional',
    title: 'Presentación del balance de gestión judicial',
    place: 'Salón de actos • 10:30 a. m.',
    status: 'Programado'
  }
];

/**
 * AgendaPanel — Dumb Component. Panel "Agenda judicial" estático.
 */
export const AgendaPanel: React.FC<AgendaPanelProps> = ({ active = false }) => {
  return (
    <div className="portal-panel" id="agenda-panel" data-portal-panel hidden={!active}>
      <div className="section-headline">
        <div>
          <span className="panel-kicker">Programación oficial</span>
          <h2>Agenda judicial</h2>
          <p>
            Información destacada de las próximas actividades y jornadas del Tribunal Supremo de
            Justicia.
          </p>
        </div>
      </div>
      <div className="agenda-list">
        {AGENDA.map((item) => (
          <article key={item.title} className="agenda-item">
            <time dateTime={item.date}>
              <strong>{item.day}</strong>
              <span>
                {item.month}
                <br />
                2026
              </span>
            </time>
            <div>
              <span className="agenda-type">{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.place}</p>
            </div>
            <span className="agenda-status">{item.status}</span>
          </article>
        ))}
      </div>
    </div>
  );
};