import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

describe('App (@consilium/web) — Composition Root', () => {
  const originalTokenGetter = Object.getOwnPropertyDescriptor(global, 'setTimeout')?.value;

  beforeEach(() => {
    vi.stubGlobal('setTimeout', setTimeout);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('Renderiza el portal judicial (patata de inicio)', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Portal Judicial');
    expect(html).toContain('Iniciar Sesión');
  });

  it('Renderiza los tribunales en la vista inicial', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Tribunal Penal');
    expect(html).toContain('Tribunal de Protección');
    expect(html).toContain('CourtsGrid-card');
  });

  it('Incluye noticias en la home pública', () => {
    const html = renderToString(<App />);
    expect(html).toContain('NewsList');
  });

  it('La biblioteca de leyes requiere sesión (no se muestra anónimo)', () => {
    const html = renderToString(<App />);
    expect(html).not.toContain('Leyes y normativa venezolana');
  });
});