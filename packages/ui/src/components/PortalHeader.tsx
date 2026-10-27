import React from 'react';

export type TabId =
  | 'courts-panel'
  | 'laws-panel'
  | 'institution-panel'
  | 'services-panel'
  | 'agenda-panel';

export interface PortalHeaderProps {
  role: 'guest' | 'public' | 'admin';
  fullName: string;
  theme: 'light' | 'dark';
  activeTab: TabId | null;
  onTabSelect: (tab: TabId) => void;
  onHomeClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onToggleTheme: () => void;
}

const PORTAL_TABS: { tab: TabId; icon: string; label: string }[] = [
  { tab: 'courts-panel', icon: 'fa-solid fa-building-columns', label: 'Tribunales judiciales' },
  { tab: 'laws-panel', icon: 'fa-solid fa-scale-balanced', label: 'Leyes y normativa' },
  { tab: 'institution-panel', icon: 'fa-solid fa-landmark', label: 'TSJ institucional' },
  { tab: 'services-panel', icon: 'fa-solid fa-laptop-file', label: 'Servicios al ciudadano' },
  { tab: 'agenda-panel', icon: 'fa-solid fa-calendar-days', label: 'Agenda judicial' }
];

const ROLE_TAG: Record<PortalHeaderProps['role'], string> = {
  guest: 'Invitado',
  public: 'Público',
  admin: 'Funcionario TSJ'
};

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  role,
  fullName,
  theme,
  activeTab,
  onTabSelect,
  onHomeClick,
  onLoginClick,
  onLogoutClick,
  onToggleTheme
}) => {
  const isGuest = role === 'guest';
  const isAdmin = role === 'admin';

  return (
    <header className="clean-header">
      <div
        className="brand-section"
        role="button"
        tabIndex={0}
        onClick={onHomeClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onHomeClick();
          }
        }}
      >
        <div className="header-emblems-group" />
        <div className="brand-titles">
          <div className="brand-name brand-name-stacked">
            <span className="brand-app-subtitle">SISTEMA DE GESTIÓN JUDICIAL</span>
          </div>
          <div className="brand-sub">
            Tribunal Supremo de Justicia • República Bolivariana de Venezuela
          </div>
        </div>
      </div>

      <nav className="portal-tabs" aria-label="Secciones del portal">
        {PORTAL_TABS.map(({ tab, icon, label }) => (
          <button
            key={tab}
            type="button"
            className={`portal-tab ${activeTab === tab ? 'active' : ''}`}
            data-portal-tab={tab}
            aria-selected={activeTab === tab}
            onClick={() => onTabSelect(tab)}
          >
            <i className={icon} />
            <span>{label}</span>
            <i className="fa-solid fa-chevron-down portal-tab-arrow" />
          </button>
        ))}
      </nav>

      <div className="header-auth-section">
        <div className="role-badge-display" id="user-role-badge">
          <span className={`role-tag-indicator role-tag-${role}`} id="role-indicator-tag">
            {ROLE_TAG[role]}
          </span>
          <span className="role-display-name" id="role-display-name">
            {fullName}
          </span>
        </div>
        {!isAdmin ? (
          <button
            type="button"
            className="btn-main btn-primary-clean"
            id="btn-login-header"
            onClick={onLoginClick}
          >
            {isGuest ? (
              <>
                <i className="fa-solid fa-user-plus" /> Registrarse / Entrar
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket" /> Iniciar Sesión / Rol
              </>
            )}
          </button>
        ) : null}
        {!isGuest ? (
          <button
            type="button"
            className="btn-main btn-outline-clean"
            id="btn-logout-header"
            onClick={onLogoutClick}
          >
            <i className="fa-solid fa-right-from-bracket" /> Cerrar Sesión
          </button>
        ) : null}
        <button
          type="button"
          className="btn-circle"
          title="Cambiar Tema"
          onClick={onToggleTheme}
        >
          <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
        </button>
      </div>
    </header>
  );
};