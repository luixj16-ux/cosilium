import React from 'react';

export interface RoleBadgeProps {
  role: 'guest' | 'public' | 'admin';
  fullName: string;
}

const ROLE_TAG: Record<RoleBadgeProps['role'], string> = {
  guest: 'Invitado',
  public: 'Público',
  admin: 'Funcionario TSJ'
};

/**
 * RoleBadge — Dumb Component. Píldora de rol del usuario en el header.
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, fullName }) => {
  return (
    <div className="role-badge-display" data-role={role} id="user-role-badge">
      <span className={`role-tag-indicator role-tag-${role}`} id="role-indicator-tag">
        {ROLE_TAG[role]}
      </span>
      <span className="role-display-name" id="role-display-name">
        {fullName}
      </span>
    </div>
  );
};