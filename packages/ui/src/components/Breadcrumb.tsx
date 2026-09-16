import React from 'react';

export interface BreadcrumbProps {
  currentCourtName: string | null;
  isAdmin: boolean;
  onHomeClick: () => void;
}

/**
 * Breadcrumb — Dumb Component. Migas de pan: tribunales → tribunal.
 * Muestra si el actor es admin una etiqueta de rol.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentCourtName,
  isAdmin,
  onHomeClick
}) => {
  return (
    <nav className="Breadcrumb" aria-label="Ruta de navegación">
      <button type="button" className="Breadcrumb-link" onClick={onHomeClick}>
        Tribunales de Venezuela
      </button>
      {currentCourtName ? (
        <>
          <span className="Breadcrumb-separator">/</span>
          <span className="Breadcrumb-current">{currentCourtName}</span>
        </>
      ) : null}
      <span className="Breadcrumb-role" data-admin={isAdmin}>
        {isAdmin ? 'Administración' : 'Consulta pública'}
      </span>
    </nav>
  );
};