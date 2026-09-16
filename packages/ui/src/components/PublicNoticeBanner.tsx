import React from 'react';

export interface PublicNoticeBannerProps {
  courtName: string;
}

/**
 * PublicNoticeBanner — Dumb Component. Aviso de "Modo Consulta
 * Pública Activo" visible en las vistas de expedientes.
 */
export const PublicNoticeBanner: React.FC<PublicNoticeBannerProps> = ({ courtName }) => {
  return (
    <div className="PublicNoticeBanner">
      <strong>Modo Consulta Pública Activo:</strong>{' '}
      <span>
        En {courtName} usted puede buscar y visualizar expedientes. Las modificaciones están
        reservadas a los funcionarios judiciales autorizados del TSJ.
      </span>
    </div>
  );
};