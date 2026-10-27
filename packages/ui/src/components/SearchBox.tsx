import React from 'react';

export interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onSearch: (term: string) => void;
}

/**
 * SearchBox — Dumb Component. Campo de búsqueda del tribunal.
 * Reenvía el texto a `onSearch` en cada cambio.
 */
export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Buscar en este tribunal...',
  value,
  onSearch
}) => {
  return (
    <div className="hero-search-wrapper">
      <i className="fa-solid fa-magnifying-glass hero-search-icon" />
      <input
        type="text"
        className="hero-search-input"
        id="court-cases-search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};