#!/usr/bin/env bash
# Start MCP (POSIX shell)
# Loads environment variables from .env (if present) or from .agents/examples/.env.example
# Then uses a small Node snippet to spawn the configured MCP process from .agents/mcp_config.json

set -euo pipefail

ENV_FILE=".env"
EXAMPLE_ENV=".agents/examples/.env.example"

if [ -f "$ENV_FILE" ]; then
  echo "Loading env from $ENV_FILE"
  set -o allexport; . "$ENV_FILE"; set +o allexport
elif [ -f "$EXAMPLE_ENV" ]; then
  echo "Loading env from $EXAMPLE_ENV"
  set -o allexport; . "$EXAMPLE_ENV"; set +o allexport
else
  echo "No .env file found; proceeding with current environment"
fi

if [ ! -f ".agents/mcp_config.json" ]; then
  echo "Missing .agents/mcp_config.json" >&2
  exit 1
fi

# Use node to spawn the MCP process so we can parse the JSON reliably
node -e "const fs=require('fs'); const cfg=JSON.parse(fs.readFileSync('.agents/mcp_config.json','utf8')); const s=cfg.mcpServers['n8n-mcp']; const child=require('child_process'); child.spawn(s.command,s.args,{stdio:'inherit'});" 
