# Start MCP (PowerShell)
# Loads environment variables from .env (if present) or from .agents/examples/.env.example
# Then reads .agents/mcp_config.json to obtain the command and args for the 'n8n-mcp' server and executes it.

Set-StrictMode -Version Latest

function Load-EnvFile($path) {
  if (-not (Test-Path $path)) { return }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    if ($line.StartsWith('#')) { return }
    $idx = $line.IndexOf('=')
    if ($idx -lt 0) { return }
    $key = $line.Substring(0,$idx).Trim()
    $val = $line.Substring($idx+1)
    $env:$key = $val
  }
}

$envFile = if (Test-Path ".env") { ".env" } elseif (Test-Path ".agents/examples/.env.example") { ".agents/examples/.env.example" } else { $null }
if ($envFile) { Write-Host "Loading env from $envFile"; Load-EnvFile $envFile } else { Write-Host "No .env found; proceeding with current environment" }

if (-not (Test-Path ".agents/mcp_config.json")) {
  Write-Error "Missing .agents/mcp_config.json"
  exit 1
}

$nodeOut = node -e "const fs=require('fs'); const cfg=JSON.parse(fs.readFileSync('.agents/mcp_config.json','utf8')); const s=cfg.mcpServers['n8n-mcp']; console.log(JSON.stringify({cmd:s.command,args:s.args}));"
try {
  $obj = $nodeOut | ConvertFrom-Json
} catch {
  Write-Error "Failed to parse mcp_config.json via node. Output:`n$nodeOut"
  exit 2
}

$cmd = $obj.cmd
$args = $obj.args

Write-Host "Starting MCP server: $cmd $($args -join ' ')"
& $cmd $args
