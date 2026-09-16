import {
  buildPortalInMemoryDependencies,
  createPortalUseCases
} from '@consilium/core';
import type { PortalUseCases } from '@consilium/core';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';

/**
 * Portal REST API — expone los use cases del portal judicial a través
 * de HTTP. Usa las dependencias en memoria del Core (fase actual).
 */

export interface PortalRestContext {
  deps: ReturnType<typeof buildPortalInMemoryDependencies>;
  useCases: PortalUseCases;
}

export function buildPortalRestContext(): PortalRestContext {
  const deps = buildPortalInMemoryDependencies();
  return { deps, useCases: createPortalUseCases(deps) };
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const out: Record<string, string> = {};
  const header = req.headers.cookie ?? '';
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8');
      if (body.length > 100_000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body) as Record<string, unknown>);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown, headers: Record<string, string> = {}): void {
  if (res.headersSent) return;
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(payload));
}

export function createPortalRestRouter(context: PortalRestContext) {
  return async function router(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname;
    const method = req.method ?? 'GET';

    if (!path.startsWith('/api/')) return false;

    try {
      // ── Sesión ─────────────────────────────────────────────
      if (method === 'GET' && path === '/api/session') {
        const token = parseCookies(req)['tsj_session'];
        const user = token ? context.useCases.currentSession.execute({ token }) : null;
        sendJson(res, 200, {
          authenticated: user !== null,
          user: user ? user.toPublicDto() : null
        });
        return true;
      }

      if (method === 'POST' && path === '/api/login') {
        const body = await readJson(req);
        const { user, token } = context.useCases.login.execute({
          identifier: String(body.identifier ?? ''),
          password: String(body.password ?? '')
        });
        sendJson(
          res,
          200,
          { user: user.toPublicDto(), token },
          { 'Set-Cookie': `tsj_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800` }
        );
        return true;
      }

      if (method === 'POST' && path === '/api/register') {
        const body = await readJson(req);
        const { user, token } = context.useCases.register.execute({
          username: String(body.username ?? ''),
          fullName: String(body.fullName ?? ''),
          email: String(body.email ?? ''),
          password: String(body.password ?? ''),
          inpre: body.inpre ? String(body.inpre) : null
        });
        sendJson(res, 201, { user: user.toPublicDto(), token });
        return true;
      }

      if (method === 'POST' && path === '/api/logout') {
        const token = parseCookies(req)['tsj_session'];
        if (token) context.useCases.logout.execute({ token });
        sendJson(res, 200, { ok: true });
        return true;
      }

      // ── Registro de búsquedas ──────────────────────────────
      if (method === 'POST' && path === '/api/search-records') {
        const token = parseCookies(req)['tsj_session'];
        const actor = token ? context.useCases.currentSession.execute({ token }) : null;
        if (!actor) {
          sendJson(res, 401, { error: 'Debes iniciar sesión para guardar búsquedas.' });
          return true;
        }
        const body = await readJson(req);
        context.useCases.saveSearch.execute({
          actor,
          query: String(body.query ?? ''),
          courtId: body.courtId ? String(body.courtId) : null,
          resultCount: Number(body.resultCount ?? 0)
        });
        sendJson(res, 201, { ok: true });
        return true;
      }

      // ── Admin ──────────────────────────────────────────────
      if (method === 'POST' && path === '/api/promote') {
        const token = parseCookies(req)['tsj_session'];
        const actor = token ? context.useCases.currentSession.execute({ token }) : null;
        if (!actor) {
          sendJson(res, 403, { error: 'No tienes permisos de administrador para esta acción.' });
          return true;
        }
        const body = await readJson(req);
        const target = context.useCases.promote.execute({ actor, userId: Number(body.userId) });
        sendJson(res, 200, { ok: true, user: target.toPublicDto() });
        return true;
      }

      if (method === 'GET' && path === '/api/users') {
        const token = parseCookies(req)['tsj_session'];
        const actor = token ? context.useCases.currentSession.execute({ token }) : null;
        if (!actor) {
          sendJson(res, 403, { error: 'No tienes permisos de administrador para esta acción.' });
          return true;
        }
        const users = context.useCases.listUsers.execute({ actor });
        sendJson(res, 200, { users: users.map((u) => u.toPublicDto()) });
        return true;
      }

      if (method === 'POST' && path === '/api/setup-admin') {
        const body = await readJson(req);
        context.useCases.setupAdmin.execute({
          username: String(body.username ?? ''),
          password: String(body.password ?? '')
        });
        sendJson(res, 200, { ok: true, message: 'Contraseña del admin configurada exitosamente.' });
        return true;
      }

      // ── Catálogos públicos ─────────────────────────────────
      if (method === 'GET' && path === '/api/laws') {
        sendJson(res, 200, { categories: context.useCases.listLaws.execute() });
        return true;
      }

      if (method === 'GET' && path === '/api/news') {
        sendJson(res, 200, { news: context.useCases.listNews.execute() });
        return true;
      }

      // ── Tribunales ─────────────────────────────────────────
      if (method === 'GET' && path === '/api/courts') {
        const courts = context.useCases.listCourts.execute();
        sendJson(res, 200, {
          courts: courts.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            category: c.category,
            jurisdiction: c.jurisdiction
          }))
        });
        return true;
      }

      if (method === 'GET' && path.startsWith('/api/courts/')) {
        const courtId = decodeURIComponent(path.slice('/api/courts/'.length));
        if (courtId.includes('/')) {
          sendJson(res, 404, { error: 'Not found' });
          return true;
        }
        const token = parseCookies(req)['tsj_session'];
        const actor = token ? context.useCases.currentSession.execute({ token }) : null;
        if (!actor) {
          sendJson(res, 401, { error: 'Debes iniciar sesión para consultar expedientes.' });
          return true;
        }
        const term = url.searchParams.get('q') ?? '';
        const cases = context.useCases.listCourtCases.execute({
          actor,
          courtId,
          filterTerm: term || undefined
        });
        sendJson(res, 200, {
          cases: cases.map((c) => ({
            publicId: c.publicId,
            courtId: c.courtId,
            docketNumber: c.docketNumber,
            title: c.title,
            subject: c.subject,
            plaintiff: c.plaintiff,
            defendant: c.defendant,
            attorney: c.attorney,
            amount: c.amount,
            status: c.status.value,
            pages: c.pages,
            filedAt: c.filedAt,
            lastActivityAt: c.lastActivityAt,
            actuations: c.actuations.map((a) => ({
              activityDate: a.activityDate,
              activityType: a.activityType,
              summary: a.summary,
              signedBy: a.signedBy,
              pageRange: a.pageRange?.toString() ?? null
            }))
          }))
        });
        return true;
      }

      sendJson(res, 404, { error: 'API route not found' });
      return true;
    } catch (error) {
      const status = (error as Error).message.includes('no encontrado') || (error as Error).message.includes('No encontrado') ? 404 : 400;
      sendJson(res, status, {
        error: error instanceof Error ? error.message : 'Internal server error'
      });
      return true;
    }
  };
}

export function createPortalServer(context: PortalRestContext): Server {
  const router = createPortalRestRouter(context);
  return createServer((req, res) => {
    router(req, res)
      .then((handled) => {
        if (!handled && !res.headersSent) {
          sendJson(res, 404, { error: 'Not found' });
        }
      })
      .catch(() => {
        if (!res.headersSent) sendJson(res, 500, { error: 'Internal server error' });
      });
  });
}