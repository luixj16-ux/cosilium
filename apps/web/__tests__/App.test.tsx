import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

describe('App (@consilium/web) — Composition Root', () => {
  beforeEach(() => {
    vi.stubGlobal('setTimeout', setTimeout);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('Renderiza el portal judicial con hero, cabecera y rol invitado', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Portal Judicial');
    expect(html).toContain('SISTEMA DE GESTIÓN JUDICIAL');
    expect(html).toContain('Registrarse / Entrar');
    expect(html).toContain('role-tag-guest');
  });

  it('Las pestañas del portal están presentes en la home', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Tribunales judiciales');
    expect(html).toContain('Leyes y normativa');
    expect(html).toContain('TSJ institucional');
    expect(html).toContain('Servicios al ciudadano');
    expect(html).toContain('Agenda judicial');
  });

  it('Los tribunales requieren sesión (no se muestran anónimo)', () => {
    const html = renderToString(<App />);
    expect(html).not.toContain('tribunal-card');
    expect(html).not.toContain('Jurisdicción Penal Ordinaria y Especial');
  });

  it('Incluye noticias en la home pública', () => {
    const html = renderToString(<App />);
    expect(html).toContain('news-carousel-section');
    expect(html).toContain('Noticias más recientes');
  });

  it('La biblioteca de leyes requiere sesión (no se muestra anónimo)', () => {
    const html = renderToString(<App />);
    expect(html).not.toContain('Leyes y normativa venezolana');
    expect(html).not.toContain('law-category-tabs');
  });
});