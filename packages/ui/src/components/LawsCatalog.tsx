import React, { useState } from 'react';
import type { LawCategoryDto } from '@consilium/contracts';

export interface LawsCatalogProps {
  categories: LawCategoryDto[];
}

/**
 * LawsCatalog — Dumb Component. Biblioteca jurídica por categorías con
 * pestañas. Estado local: categoría activa.
 */
export const LawsCatalog: React.FC<LawsCatalogProps> = ({ categories }) => {
  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? '');
  const active = categories.find((c) => c.key === activeKey) ?? categories[0];

  return (
    <div className="LawsCatalog">
      <div className="LawsCatalog-tabs" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            role="tab"
            aria-selected={cat.key === active?.key}
            className="LawsCatalog-tab"
            onClick={() => setActiveKey(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {active ? (
        <ul className="LawsCatalog-list">
          {active.items.map((item) => (
            <li key={item.title} className="LawsCatalog-item">
              <span className="LawsCatalog-item-title">{item.title}</span>
              <span className="LawsCatalog-item-meta">{item.meta}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="LawsCatalog-empty">No hay normativa disponible.</p>
      )}
    </div>
  );
};