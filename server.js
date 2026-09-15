const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 8080;
const databasePath = path.join(__dirname, 'database', 'tsj.sqlite');
const schemaPath = path.join(__dirname, 'database', 'schema.sql');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const database = new DatabaseSync(databasePath);
database.exec(fs.readFileSync(schemaPath, 'utf8'));

// Prepared statements cache
const stmts = {
  getUserByToken: database.prepare(`SELECT u.id, u.username, u.full_name, u.email, u.inpre, r.name AS role
    FROM user_sessions s JOIN users u ON u.id = s.user_id JOIN roles r ON r.id = u.role_id
    WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.active = 1`),
  insertSession: database.prepare('INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)'),
  deleteSession: database.prepare('DELETE FROM user_sessions WHERE token_hash = ?'),
  deleteUserSessions: database.prepare('DELETE FROM user_sessions WHERE user_id = ?'),
  getUserByUsernameOrEmail: database.prepare('SELECT * FROM users WHERE (username = ? OR email = ?) AND active = 1'),
  insertUser: database.prepare('INSERT INTO users (role_id, username, full_name, email, password_hash, inpre) VALUES (1, ?, ?, ?, ?, ?)'),
  insertAudit: database.prepare("INSERT INTO audit_events (user_id, action, entity_type, entity_id) VALUES (?, 'login', 'user', ?)"),
  insertSearchRecord: database.prepare('INSERT INTO search_records (user_id, query_text, court_id, result_count, source) VALUES (?, ?, ?, ?, ?)'),
  getUserById: database.prepare('SELECT id, username, role_id FROM users WHERE id = ?'),
  promoteUser: database.prepare(`UPDATE users SET role_id = 2, updated_at = datetime('now') WHERE id = ?`),
  insertPromoteAudit: database.prepare("INSERT INTO audit_events (user_id, action, entity_type, entity_id, metadata_json) VALUES (?, 'promote', 'user', ?, ?)"),
  getAllUsers: database.prepare(`SELECT u.id, u.username, u.full_name, u.email, r.name as role, u.created_at, u.active
    FROM users u JOIN roles r ON r.id = u.role_id ORDER BY u.created_at DESC`),
  getAdminUser: database.prepare('SELECT id, password_hash FROM users WHERE username = ?'),
  updateAdminPassword: database.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`),
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(cookie => {
    const [key, ...value] = cookie.trim().split('=');
    return [key, decodeURIComponent(value.join('='))];
  }));
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, expected] = (storedHash || '').split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function getCurrentUser(req) {
  const token = parseCookies(req).tsj_session;
  if (!token) return null;
  return stmts.getUserByToken.get(hashToken(token));
}

function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  stmts.insertSession.run(userId, hashToken(token), expiresAt);
  res.setHeader('Set-Cookie', `tsj_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
}

// Auth middlewares
function requireAuth(req) {
  const user = getCurrentUser(req);
  if (!user) return { error: 'Debes iniciar sesión para acceder a este recurso.' };
  return { user };
}

function requireAdmin(req) {
  const auth = requireAuth(req);
  if (auth.error) return auth;
  if (auth.user.role !== 'admin') return { error: 'No tienes permisos de administrador para esta acción.' };
  return auth;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 10000) reject(new Error('Payload too large')); });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload, headers = {}) {
  if (res.headersSent) return;
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(payload));
}

async function handleApi(req, res) {
  if (!req.url.startsWith('/api/')) return false;

  try {
    if (req.method === 'GET' && req.url === '/api/session') {
      const user = getCurrentUser(req);
      sendJson(res, 200, { authenticated: Boolean(user), user: user || null });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/register') {
      const body = await readJson(req);
      const username = String(body.username || '').trim().toLowerCase();
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const inpre = String(body.inpre || '').trim() || null;

      if (!/^[a-z0-9._-]{4,40}$/.test(username) || fullName.length < 3 || !email.includes('@') || password.length < 8) {
        sendJson(res, 400, { error: 'Completa nombre, usuario, correo y una contraseña de al menos 8 caracteres.' });
        return true;
      }
      const result = stmts.insertUser.run(username, fullName, email, hashPassword(password), inpre);
      createSession(res, Number(result.lastInsertRowid));
      const token = parseCookies({ headers: { cookie: res.getHeader('Set-Cookie').split(';')[0] } }).tsj_session;
      const user = stmts.getUserByToken.get(hashToken(token));
      sendJson(res, 201, { user });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/login') {
      const body = await readJson(req);
      const identifier = String(body.identifier || '').trim().toLowerCase();
      const password = String(body.password || '');
      const user = stmts.getUserByUsernameOrEmail.get(identifier, identifier);
      if (!user || !verifyPassword(password, user.password_hash)) {
        sendJson(res, 401, { error: 'Usuario o contraseña incorrectos.' });
        return true;
      }
      createSession(res, user.id);
      stmts.insertAudit.run(user.id, String(user.id));
      const token = parseCookies({ headers: { cookie: res.getHeader('Set-Cookie').split(';')[0] } }).tsj_session;
      const sessionUser = stmts.getUserByToken.get(hashToken(token));
      sendJson(res, 200, { user: sessionUser });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/logout') {
      const token = parseCookies(req).tsj_session;
      if (token) stmts.deleteSession.run(hashToken(token));
      sendJson(res, 200, { ok: true }, { 'Set-Cookie': 'tsj_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/search-records') {
      const auth = requireAuth(req);
      if (auth.error) { sendJson(res, 401, { error: auth.error }); return true; }
      const body = await readJson(req);
      stmts.insertSearchRecord.run(auth.user.id, String(body.query || '').slice(0, 200), body.courtId || null, Number(body.resultCount || 0), 'portal');
      sendJson(res, 201, { ok: true });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/promote') {
      const auth = requireAdmin(req);
      if (auth.error) { sendJson(res, 403, { error: auth.error }); return true; }

      const body = await readJson(req);
      const userId = Number(body.userId);
      if (!userId) { sendJson(res, 400, { error: 'Se requiere el ID del usuario a promover.' }); return true; }

      const targetUser = stmts.getUserById.get(userId);
      if (!targetUser) { sendJson(res, 404, { error: 'Usuario no encontrado.' }); return true; }
      if (targetUser.role_id === 2) { sendJson(res, 400, { error: 'El usuario ya es administrador.' }); return true; }

      stmts.promoteUser.run(userId);
      stmts.insertPromoteAudit.run(auth.user.id, String(userId), JSON.stringify({ promotedBy: auth.user.username }));

      sendJson(res, 200, { ok: true, message: `Usuario ${targetUser.username} promovido a administrador.` });
      return true;
    }

    if (req.method === 'GET' && req.url === '/api/users') {
      const auth = requireAdmin(req);
      if (auth.error) { sendJson(res, 403, { error: auth.error }); return true; }
      sendJson(res, 200, { users: stmts.getAllUsers.all() });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/setup-admin') {
      const body = await readJson(req);
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '');

      if (username !== 'admin') { sendJson(res, 400, { error: 'Este endpoint es solo para configurar el usuario admin.' }); return true; }
      if (password.length < 8) { sendJson(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres.' }); return true; }

      const adminUser = stmts.getAdminUser.get('admin');
      if (!adminUser) { sendJson(res, 404, { error: 'Usuario admin no encontrado.' }); return true; }
      if (adminUser.password_hash) { sendJson(res, 400, { error: 'La contraseña del admin ya está configurada.' }); return true; }

      stmts.updateAdminPassword.run(hashPassword(password), adminUser.id);
      sendJson(res, 200, { ok: true, message: 'Contraseña del admin configurada exitosamente.' });
      return true;
    }

    sendJson(res, 404, { error: 'API route not found' });
    return true;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') { sendJson(res, 409, { error: 'El usuario o correo ya está registrado.' }); return true; }
    sendJson(res, 400, { error: error.message });
    return true;
  }
}

const server = http.createServer((req, res) => {
  handleApi(req, res).then(handled => { if (handled) return;
  let reqUrl = req.url.split('?')[0];
  let safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath === path.sep || safePath === '' ? 'index.html' : safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
  }).catch(() => { if (!res.headersSent) sendJson(res, 500, { error: 'Internal server error' }); });
});

// Keep-alive timeout
server.keepAliveTimeout = 30000;
server.headersTimeout = 10000;

// Graceful shutdown
function shutdown() {
  console.log('\nCerrando servidor...');
  server.close(() => {
    database.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor IUSTITIA ejecutándose en:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Red:     http://192.168.0.110:${PORT}`);
});
