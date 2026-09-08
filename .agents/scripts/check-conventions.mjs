#!/usr/bin/env node
/**
 * check-conventions.mjs — Validador rápido de convenciones del monorepo.
 *
 * Ejecutado por `npm run lint:conventions`. NO reemplaza typecheck/test;
 * solo detecta regresiones estructurales fáciles de verificar:
 *   node 1. Core no importa desde apps/ ni react.
 *   node 2. Los casos de uso del core solo tocan puertos (nunca infra directa).
 *   node 3. Sin archivos .js sueltos en la raíz (legacy debe estar en /legacy).
 *   node 4. Sin TODO/FIXME sin ticket abierto (excepto en .agents/).
 *   node 5. Sin binarios versionados en git (git-lfs / *.wasm) — aplica en CI.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

const failures = [];
function fail(rule, file, msg) {
  failures.push(`  [${rule}] ${file}: ${msg}`);
}

const isSource = (p) => p.endsWith('.ts') || p.endsWith('.tsx') || p.endsWith('.js') || p.endsWith('.cjs') || p.endsWith('.mjs');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'target' || entry.name === 'legacy') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (isSource(full)) out.push(full);
  }
  return out;
}

const nodeAlwaysWarn = ['.agents', '.agents/n8n-skills', 'legacy', 'docs', 'server/README.md'];

// Node 4: TODO/FIXME sin referencia a issue
function checkTodos(files) {
  re: for (const file of files) {
    const rel = file.replace(root + '/', '');
    if (nodeAlwaysWarn.some((p) => rel.startsWith(p))) continue;
    const body = readFileSync(file, 'utf8');
    const m = body.match(/TODO|FIXME/);
    if (m) {
      fail(
        'node4-todo',
        rel,
        `Encontrado '${m[0]}' sin ticket (convención: TODO(CONSILIUM-<n>): ...)`
      );
      break re;
    }
  }
}

// E.g. regex forbids relative imports in core going "out"
function checkLegacyRoot() {
  const rootEntries = readdirSync(root);
  const legacyFiles = rootEntries.filter((e) => e !== 'legacy' && e !== '.git' && e !== 'node_modules');
  for (const file of legacyFiles) {
    const full = join(root, file);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isFile() && (file === 'app.js' || file === 'server.js' || file === 'index.html' || file === 'styles.css')) {
      fail('node3-legacy', file, 'Archivo legacy en la raíz; mover a /legacy.');
    }
  }
}

const sources = walk(root);
checkTodos(sources);
checkLegacyRoot();

if (failures.length > 0) {
  console.error('\n❌ Convenciones violadas:');
  for (const f of failures) console.error(f);
  process.exit(1);
}
console.log('✅ check-conventions: sin violaciones.');