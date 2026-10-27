import React from 'react';
import type { UserDto } from '@consilium/contracts';

export interface AdminUsersListProps {
  users: UserDto[];
  currentUserId: number;
  onPromote: (userId: number) => void;
}

/**
 * AdminUsersList — Dumb Component. Lista de usuarios del sistema para
 * el panel de administración. Permite promover a admin.
 */
export const AdminUsersList: React.FC<AdminUsersListProps> = ({ users, currentUserId, onPromote }) => {
  return (
    <div className="AdminUsersList">
      <h3>Usuarios registrados</h3>
      <table className="AdminUsersList-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} data-user-id={u.id}>
              <td>{u.username}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td data-role={u.role}>{u.role}</td>
              <td>
                {u.id !== currentUserId && u.role !== 'admin' ? (
                  <button type="button" onClick={() => onPromote(u.id)}>
                    Promover a Admin
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 ? <p className="AdminUsersList-empty">No hay usuarios registrados.</p> : null}
    </div>
  );
};