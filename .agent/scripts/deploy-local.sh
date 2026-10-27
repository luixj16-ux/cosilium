#!/usr/bin/env bash
# deploy-local.sh — despliega localmente el Portal CONSILIUM:
#  - apps/web (build ya generado) servido por vite preview (http://localhost:4173)
#  - server REST del portal (http://localhost:8787/api)
set -euo pipefail

WEB_DIR="$PWD/apps/web"
API_CMD="npm run start:portal --workspace @consilium/server"
SANITY_GREP="dist/index.html"

if [ ! -f "$WEB_DIR/$SANITY_GREP" ]; then
  echo "❌ Falta el build de apps/web. Ejecuta: npm run build --workspace @consilium/web"
  exit 1
fi

trap 'kill 0' EXIT INT TERM

echo "▶ Portal web server en http://localhost:4173"
( cd "$WEB_DIR" && exec npx vite preview ) &

echo "▶ API REST del portal en http://localhost:8787"
bash -c "$API_CMD" &

wait