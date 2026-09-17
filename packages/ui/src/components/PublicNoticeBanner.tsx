import React from 'react';

/**
 * PublicNoticeBanner — Dumb Component. Aviso de "Modo Consulta Pública
 * Activo" que precede al listado de expedientes del tribunal.
 */
export const PublicNoticeBanner: React.FC = () => {
  return (
    <div
      id="public-notice-banner"
      style={{
        background: 'var(--tsj-blue-subtle)',
        border: '1.5px solid var(--tsj-blue-surface)',
        borderLeft: '5px solid var(--tsj-blue-primary)',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.88rem',
        color: 'var(--tsj-blue-dark)',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <i className="fa-solid fa-circle-info" style={{ fontSize: 20, color: 'var(--tsj-blue-primary)' }} />
      <span>
        <strong>Modo Consulta Pública Activo:</strong> Usted puede buscar, visualizar y descargar
        copias oficiales de los expedientes. Las modificaciones y foliatura están reservadas a los
        funcionarios judiciales autorizados del TSJ.
      </span>
    </div>
  );
};