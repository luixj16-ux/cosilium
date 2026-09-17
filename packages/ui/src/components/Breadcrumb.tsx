import React from 'react';

export interface BreadcrumbProps {
  currentCourtName: string | null;
  onHomeClick: () => void;
}

/**
 * Breadcrumb — Dumb Component. Ruta de navegación + aviso institucional.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentCourtName, onHomeClick }) => {
  return (
    <div className="breadcrumb-bar">
      <div className="breadcrumb-nav">
        <button
          type="button"
          className="breadcrumb-link"
          onClick={onHomeClick}
        >
          <i className="fa-solid fa-building-columns" /> Tribunales de Venezuela
        </button>
        {currentCourtName ? <span className="breadcrumb-separator">/</span> : null}
        {currentCourtName ? (
          <span
            className="breadcrumb-current-court"
            style={{ fontWeight: 700, color: 'var(--tsj-blue-dark)' }}
          >
            {currentCourtName}
          </span>
        ) : null}
      </div>
      <div className="breadcrumb-role-notice" id="breadcrumb-role-notice">
        <i className="fa-solid fa-shield-halved" style={{ color: 'var(--tsj-blue-primary)' }} />
        Plataforma Oficial del Poder Judicial
      </div>
    </div>
  );
};