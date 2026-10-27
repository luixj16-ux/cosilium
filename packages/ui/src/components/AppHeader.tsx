import React from 'react';
import { RoleBadge } from './RoleBadge';

export interface AppHeaderProps {
  isAuthenticated: boolean;
  role: 'public' | 'admin';
  fullName: string;
  onHomeClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

/**
 * AppHeader — Dumb Component. Cabecera institucional del portal.
 * Solo props + callbacks; no decide autenticación, solo la refleja.
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  isAuthenticated,
  role,
  fullName,
  onHomeClick,
  onLoginClick,
  onLogoutClick
}) => {
  return (
    <header className="AppHeader">
      <div className="AppHeader-brand" onClick={onHomeClick} role="button" tabIndex={0}>
        <div className="AppHeader-emblems">
          <svg viewBox="0 0 100 100" width="42" height="42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="#092C53" stroke="#C59B27" strokeWidth="3" />
            <circle cx="50" cy="50" r="41" fill="#0D47A1" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 1.5" />
            <path d="M50 14 C36 14 30 22 30 36 C30 60 50 78 50 78 C50 78 70 60 70 36 C70 22 64 14 50 14 Z" fill="#061C38" stroke="#D4AF37" strokeWidth="2" />
            <rect x="48.5" y="24" width="3" height="34" rx="1.5" fill="#D4AF37" />
            <text x="50" y="93" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#D4AF37" letterSpacing="1.2">TSJ</text>
          </svg>
        </div>
        <div className="AppHeader-titles">
          <span className="AppHeader-subtitle">SISTEMA DE GESTIÓN JUDICIAL</span>
          <span className="AppHeader-inst">Tribunal Supremo de Justicia • República Bolivariana de Venezuela</span>
        </div>
      </div>

      <div className="AppHeader-actions">
        {isAuthenticated ? (
          <>
            <div className="AppHeader-role">
              <RoleBadge role={role} fullName={fullName} />
            </div>
            <button type="button" className="AppHeader-logout" onClick={onLogoutClick}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <button type="button" className="AppHeader-login" onClick={onLoginClick}>
            Iniciar Sesión / Rol
          </button>
        )}
      </div>
    </header>
  );
};