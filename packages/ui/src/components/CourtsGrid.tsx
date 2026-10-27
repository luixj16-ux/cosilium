import React from 'react';
import type { CourtDto } from '@consilium/contracts';
import { getCourtEmblem } from './courtEmblems';

export interface CourtsGridProps {
  courts: CourtDto[];
  selectedCourtId: string | null;
  caseCounts: Record<string, number>;
  active?: boolean;
  onSelectCourt: (courtId: string) => void;
}

/**
 * CourtsGrid — Dumb Component. Panel de jurisdicciones y tribunales.
 * El callback decide la navegación; el emblema es arte estático por id.
 */
export const CourtsGrid: React.FC<CourtsGridProps> = ({
  courts,
  selectedCourtId,
  caseCounts,
  active = false,
  onSelectCourt
}) => {
  return (
    <div className="portal-panel" id="courts-panel" data-portal-panel hidden={!active}>
      <div className="section-headline">
        <div>
          <span className="panel-kicker">Poder Judicial</span>
          <h2>Jurisdicciones y Tribunales</h2>
          <p>
            Seleccione el tribunal o fuero correspondiente para consultar y descargar los
            expedientes en curso.
          </p>
        </div>
      </div>
      <div className="tribunal-list-panel">
        <div className="tribunal-list-header">
          <span>Tribunales y Jurisdicciones</span>
        </div>
        <div className="tribunales-list">
          {courts.map((court) => {
            const isActive = selectedCourtId === court.id;
            const count = caseCounts[court.id] ?? 0;
            return (
              <button
                key={court.id}
                type="button"
                className={`tribunal-card ${isActive ? 'active' : ''}`}
                data-court-id={court.id}
                aria-label={`Abrir ${court.name}`}
                onClick={() => onSelectCourt(court.id)}
              >
                <div className="tribunal-card-top">
                  <div
                    className="court-realistic-emblem"
                    dangerouslySetInnerHTML={{ __html: getCourtEmblem(court.id) }}
                  />
                  <div className="tribunal-copy">
                    <span className="tribunal-category-pill">{court.category}</span>
                    <div className="tribunal-title">{court.name}</div>
                  </div>
                </div>
                <div className="tribunal-footer">
                  <span className="tribunal-count-pill">{count} activos</span>
                  <span className="tribunal-enter-btn">
                    {isActive ? 'Seleccionado' : 'Abrir'}{' '}
                    <i className={`fa-solid ${isActive ? 'fa-check' : 'fa-arrow-right'}`} />
                  </span>
                </div>
              </button>
            );
          })}
          {courts.length === 0 ? <p className="tribunales-empty">No hay tribunales registrados.</p> : null}
        </div>
      </div>
    </div>
  );
};