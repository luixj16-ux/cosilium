import React from 'react';
import type { CourtDto } from '@consilium/contracts';

export interface CourtsGridProps {
  courts: CourtDto[];
  onSelectCourt: (courtId: string) => void;
}

/**
 * CourtsGrid — Dumb Component. Lista de tribunales/jurisdicciones.
 * El callback decide la navegación.
 */
export const CourtsGrid: React.FC<CourtsGridProps> = ({ courts, onSelectCourt }) => {
  return (
    <div className="CourtsGrid">
      {courts.map((court) => (
        <button
          key={court.id}
          type="button"
          className="CourtsGrid-card"
          data-court-id={court.id}
          onClick={() => onSelectCourt(court.id)}
        >
          <span className="CourtsGrid-name">{court.name}</span>
          <span className="CourtsGrid-category">{court.category}</span>
        </button>
      ))}
      {courts.length === 0 ? (
        <p className="CourtsGrid-empty">No hay tribunales registrados.</p>
      ) : null}
    </div>
  );
};