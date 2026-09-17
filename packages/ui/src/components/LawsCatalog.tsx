import React, { useState } from 'react';
import type { LawCategoryDto } from '@consilium/contracts';

export interface LawsCatalogProps {
  categories: LawCategoryDto[];
  active?: boolean;
  onSelectLaw?: (title: string) => void;
}

/**
 * LawsCatalog — Dumb Component. Biblioteca jurídica por materias con
 * pestañas de categoría. Estado local: categoría activa.
 */
export const LawsCatalog: React.FC<LawsCatalogProps> = ({
  categories,
  active = false,
  onSelectLaw
}) => {
  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? '');
  const activeCategory = categories.find((c) => c.key === activeKey) ?? categories[0];

  return (
    <div className="portal-panel" id="laws-panel" data-portal-panel hidden={!active}>
      <div className="section-headline">
        <div>
          <span className="panel-kicker">Biblioteca jurídica</span>
          <h2>Leyes y normativa venezolana</h2>
          <p>
            Explore el marco legal organizado por materia y acceda rápidamente a sus instrumentos
            principales.
          </p>
        </div>
      </div>
      <aside className="law-portal-panel">
        <div className="law-category-tabs" id="law-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`law-tab ${cat.key === activeCategory?.key ? 'active' : ''}`}
              data-law-key={cat.key}
              onClick={() => setActiveKey(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="law-list" id="law-list-container">
          {activeCategory?.items.map((law, index) => (
            <button
              key={law.title}
              type="button"
              className={`law-item ${index === 0 ? 'active' : ''}`}
              onClick={() => onSelectLaw?.(law.title)}
            >
              <div className="law-item-title">{law.title}</div>
              <div className="law-item-meta">{law.meta}</div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};