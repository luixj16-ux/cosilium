import React from 'react';

export interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onSearch: (term: string) => void;
}

/**
 * SearchBox — Dumb Component. Caja de búsqueda por término.
 * Reenvía el texto a `onSearch` en cada cambio; sin lógica de negocio.
 */
export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Buscar…',
  value,
  onSearch
}) => {
  return (
    <div className="SearchBox">
      <span className="SearchBox-icon" aria-hidden="true">🔎</span>
      <input
        type="text"
        className="SearchBox-input"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};