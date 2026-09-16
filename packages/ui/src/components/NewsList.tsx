import React from 'react';
import type { LegalNewsDto } from '@consilium/contracts';

export interface NewsListProps {
  news: LegalNewsDto[];
}

/**
 * NewsList — Dumb Component. Noticias recientes del Poder Judicial en
 * formato de carrusel (avanza con botones). Estado local: índice.
 */
export const NewsList: React.FC<NewsListProps> = ({ news }) => {
  const [index, setIndex] = React.useState(0);
  const current = news[index] ?? news[0];

  const prev = () => {
    setIndex((i) => (news.length === 0 ? 0 : (i - 1 + news.length) % news.length));
  };
  const next = () => {
    setIndex((i) => (news.length === 0 ? 0 : (i + 1) % news.length));
  };

  return (
    <section className="NewsList" aria-label="Noticias recientes del Poder Judicial">
      <div className="NewsList-controls">
        <button type="button" aria-label="Noticia anterior" onClick={prev}>
          ‹
        </button>
        <button type="button" aria-label="Siguiente noticia" onClick={next}>
          ›
        </button>
      </div>
      {current ? (
        <article className="NewsList-card">
          <span className="NewsList-tag">{current.tag}</span>
          <h3>{current.title}</h3>
          <p>{current.summary}</p>
          <time dateTime={current.date}>{current.date}</time>
          <span className="NewsList-impact">{current.impact}</span>
        </article>
      ) : (
        <p className="NewsList-empty">No hay noticias disponibles.</p>
      )}
    </section>
  );
};