import React from 'react';
import type { LegalNewsDto } from '@consilium/contracts';

export interface NewsListProps {
  news: LegalNewsDto[];
}

/**
 * NewsList — Dumb Component. Noticias más recientes del Poder Judicial en
 * carrusel (botones + puntos). Estado local: índice activo.
 */
export const NewsList: React.FC<NewsListProps> = ({ news }) => {
  const [index, setIndex] = React.useState(0);
  const total = news.length;

  const prev = () => setIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  const next = () => setIndex((i) => (total === 0 ? 0 : (i + 1) % total));

  return (
    <section
      className="news-portal-section news-carousel-section"
      aria-label="Noticias recientes del Poder Judicial"
    >
      <div className="news-header-row">
        <div>
          <span className="news-kicker">Actualidad judicial</span>
          <h2>Noticias más recientes</h2>
        </div>
        <div className="carousel-controls">
          <button type="button" className="carousel-button" id="news-prev" aria-label="Noticia anterior" onClick={prev}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button type="button" className="carousel-button" id="news-next" aria-label="Siguiente noticia" onClick={next}>
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
      <div className="news-carousel" id="news-list-container">
        {news.map((item, i) => (
          <article
            key={item.title}
            className={`news-item ${i === index ? 'active' : ''}`}
            aria-hidden={i !== index}
          >
            <div className="news-story">
              <div className="news-topline">
                <span className="news-pill">{item.tag}</span>
                <span className="news-date">{item.date}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="news-meta">
                <span>{item.impact}</span>
                <span>
                  <i className="fa-solid fa-circle-check" /> Oficial
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="carousel-dots" id="news-dots" aria-label="Seleccionar noticia">
        {news.map((item, i) => (
          <button
            key={item.title}
            type="button"
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            aria-label={`Ver noticia ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};