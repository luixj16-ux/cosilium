import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { AddressInfo } from 'node:net';
import { buildPortalRestContext, createPortalServer } from '../src/portal/portal.rest';

let baseUrl: string;
let server: ReturnType<typeof createPortalServer>;

async function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
}

beforeAll(async () => {
  server = createPortalServer(buildPortalRestContext());
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

describe('Portal REST API', () => {
  it('GET /api/courts devuelve los 7 tribunales públicos', async () => {
    const res = await api('/api/courts');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { courts: Array<{ id: string; name: string }> };
    expect(body.courts.length).toBe(7);
    const ids = body.courts.map((c) => c.id);
    expect(ids).toContain('lopnna');
    expect(ids).toContain('tsj_salas');
  });

  it('GET /api/laws y /api/news responden sin sesión', async () => {
    const laws = await api('/api/laws');
    expect(laws.status).toBe(200);
    const lawsBody = (await laws.json()) as { categories: unknown[] };
    expect(lawsBody.categories.length).toBeGreaterThanOrEqual(5);

    const news = await api('/api/news');
    expect(news.status).toBe(200);
    const newsBody = (await news.json()) as { news: unknown[] };
    expect(newsBody.news.length).toBeGreaterThanOrEqual(4);
  });

  it('GET /api/courts/:id sin sesión devuelve 401', async () => {
    const res = await api('/api/courts/lopnna');
    expect(res.status).toBe(401);
  });

  it('POST /api/login con credenciales admin devuelve sesión', async () => {
    const res = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin', password: 'admin123' })
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { user: { role: string; username: string }; token: string };
    expect(body.token.length).toBeGreaterThan(10);
    expect(body.user.username).toBe('admin');
    expect(body.user.role).toBe('admin');
  });

  it('POST /api/login con credenciales inválidas devuelve 400', async () => {
    const res = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin', password: 'incorrecta' })
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/register crea usuario y devuelve sesión', async () => {
    const res = await api('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'abogado_testeo',
        fullName: 'Abogado de Pruebas',
        email: 'abogado@test.example',
        password: 'clave-123'
      })
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { user: { role: string; username: string }; token: string };
    expect(body.user.username).toBe('abogado_testeo');
    expect(body.user.role).toBe('public');
    expect(body.token.length).toBeGreaterThan(10);
  });

  it('POST /api/register duplicado devuelve 400', async () => {
    const res = await api('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'abogado_testeo',
        fullName: 'Abogado de Pruebas',
        email: 'abogado@test.example',
        password: 'clave-123'
      })
    });
    expect(res.status).toBe(400);
  });

  it('flujo con sesión: login admin → casos del tribunal → guardar búsqueda', async () => {
    const login = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin', password: 'admin123' })
    });
    const loginBody = (await login.json()) as { token: string };
    const cookie = `tsj_session=${encodeURIComponent(loginBody.token)}`;

    const session = await api('/api/session', { headers: { Cookie: cookie } });
    expect(session.status).toBe(200);
    const sessionBody = (await session.json()) as { authenticated: boolean };
    expect(sessionBody.authenticated).toBe(true);

    const casesRes = await api('/api/courts/lopnna', { headers: { Cookie: cookie } });
    expect(casesRes.status).toBe(200);
    const casesBody = (await casesRes.json()) as { cases: Array<{ docketNumber: string }> };
    expect(casesBody.cases.length).toBeGreaterThanOrEqual(1);

    const save = await api('/api/search-records', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ query: 'custodia', courtId: 'lopnna', resultCount: casesBody.cases.length })
    });
    expect(save.status).toBe(201);
  });

  it('POST /api/search-records sin sesión devuelve 401', async () => {
    const res = await api('/api/search-records', {
      method: 'POST',
      body: JSON.stringify({ query: 'test' })
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/promote solo lo permite el admin', async () => {
    const login = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin', password: 'admin123' })
    });
    const loginBody = (await login.json()) as { token: string };
    const cookie = `tsj_session=${encodeURIComponent(loginBody.token)}`;

    const usersRes = await api('/api/users', { headers: { Cookie: cookie } });
    expect(usersRes.status).toBe(200);
    const usersBody = (await usersRes.json()) as { users: Array<{ id: number; username: string }> };
    const target = usersBody.users.find((u) => u.username === 'abogado_testeo');
    expect(target).toBeDefined();

    const promote = await api('/api/promote', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ userId: target!.id })
    });
    expect(promote.status).toBe(200);
    const promoteBody = (await promote.json()) as { user: { role: string } };
    expect(promoteBody.user.role).toBe('admin');
  });

  it('GET /api/users sin sesión devuelve 403', async () => {
    const res = await api('/api/users');
    expect(res.status).toBe(403);
  });

  it('POST /api/logout cierra la sesión', async () => {
    const login = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin', password: 'admin123' })
    });
    const loginBody = (await login.json()) as { token: string };
    const cookie = `tsj_session=${encodeURIComponent(loginBody.token)}`;

    const logout = await api('/api/logout', { method: 'POST', headers: { Cookie: cookie } });
    expect(logout.status).toBe(200);

    const session = await api('/api/session', { headers: { Cookie: cookie } });
    const sessionBody = (await session.json()) as { authenticated: boolean };
    expect(sessionBody.authenticated).toBe(false);
  });

  it('rutas no existentes devuelven 404', async () => {
    const res = await api('/api/inexistente');
    expect(res.status).toBe(404);
  });
});