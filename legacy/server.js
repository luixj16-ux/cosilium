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

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
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

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 10000) reject(new Error('Payload too large')); });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(payload));
}

function getCurrentUser(req) {
  const token = parseCookies(req).tsj_session;
  if (!token) return null;
  return database.prepare(`SELECT u.id, u.username, u.full_name, u.email, r.name AS role
    FROM user_sessions s JOIN users u ON u.id = s.user_id JOIN roles r ON r.id = u.role_id
    WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.active = 1`).get(hashToken(token));
}

function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  database.prepare('INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)').run(userId, hashToken(token), expiresAt);
  res.setHeader('Set-Cookie', `tsj_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
}

async function handleApi(req, res) {
  if (!req.url.startsWith('/api/')) return false;

  try {
    if (req.method === 'GET' && req.url === '/api/session') {
      sendJson(res, 200, { authenticated: Boolean(getCurrentUser(req)), user: getCurrentUser(req) || null });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/register') {
      const body = await readJson(req);
      const username = String(body.username || '').trim().toLowerCase();
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!/^[a-z0-9._-]{4,40}$/.test(username) || fullName.length < 3 || !email.includes('@') || password.length < 8) {
        sendJson(res, 400, { error: 'Completa nombre, usuario, correo y una contraseña de al menos 8 caracteres.' });
        return true;
      }
      const result = database.prepare('INSERT INTO users (role_id, username, full_name, email, password_hash) VALUES (1, ?, ?, ?, ?)').run(username, fullName, email, hashPassword(password));
      createSession(res, Number(result.lastInsertRowid));
      sendJson(res, 201, { user: getCurrentUser({ headers: { cookie: res.getHeader('Set-Cookie').split(';')[0] } }) });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/login') {
      const body = await readJson(req);
      const identifier = String(body.identifier || '').trim().toLowerCase();
      const password = String(body.password || '');
      const user = database.prepare('SELECT * FROM users WHERE (username = ? OR email = ?) AND active = 1').get(identifier, identifier);
      if (!user || !verifyPassword(password, user.password_hash)) {
        sendJson(res, 401, { error: 'Usuario o contraseña incorrectos.' });
        return true;
      }
      createSession(res, user.id);
      database.prepare("INSERT INTO audit_events (user_id, action, entity_type, entity_id) VALUES (?, 'login', 'user', ?)").run(user.id, String(user.id));
      sendJson(res, 200, { user: getCurrentUser({ headers: { cookie: res.getHeader('Set-Cookie').split(';')[0] } }) });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/logout') {
      const token = parseCookies(req).tsj_session;
      if (token) database.prepare('DELETE FROM user_sessions WHERE token_hash = ?').run(hashToken(token));
      sendJson(res, 200, { ok: true }, { 'Set-Cookie': 'tsj_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
      return true;
    }

    if (req.method === 'POST' && req.url === '/api/search-records') {
      const user = getCurrentUser(req);
      if (!user) { sendJson(res, 401, { error: 'Debes registrarte o iniciar sesión para guardar búsquedas.' }); return true; }
      const body = await readJson(req);
      database.prepare('INSERT INTO search_records (user_id, query_text, court_id, result_count, source) VALUES (?, ?, ?, ?, ?)').run(user.id, String(body.query || '').slice(0, 200), body.courtId || null, Number(body.resultCount || 0), 'portal');
      sendJson(res, 201, { ok: true });
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
  }).catch(() => sendJson(res, 500, { error: 'Internal server error' }));
});

server.listen(PORT, () => {
  console.log(`Servidor IUSTITIA ejecutándose en: http://localhost:${PORT}`);
});
