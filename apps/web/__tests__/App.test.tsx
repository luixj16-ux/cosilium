import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

describe('App (@consilium/web) — Shell', () => {
  it('Monta el portal compartido de @consilium/portal', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Portal Judicial');
    expect(html).toContain('Registrarse / Entrar');
  });
});