import React from 'react';

export interface RoleBadgeProps {
  role: 'public' | 'admin';
  fullName: string;
}

const LABELS: Record<RoleBadgeProps['role'], string> = {
  public: 'Público',
  admin: 'Admin'
};

/**
 * RoleBadge — Dumb Component. Muestra el rol y nombre del usuario
 * autenticado, o el estado por defecto de consulta pública.
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, fullName }) => {
  return (
    <div className="RoleBadge-container" data-role={role}>
      <span className={`RoleBadge-tag RoleBadge-tag-${role}`}>{LABELS[role]}</span>
      <span className="RoleBadge-name">{fullName}</span>
    </div>
  );
};