#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

function loadEnvFile(p) {
  if (!fs.existsSync(p)) return;
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const idx = s.indexOf('=');
    if (idx === -1) continue;
    const k = s.slice(0, idx).trim();
    const v = s.slice(idx + 1);
    if (!(k in process.env)) process.env[k] = v;
  }
}

const envFile = fs.existsSync('.env') ? '.env' : (fs.existsSync('.agents/examples/.env.example') ? '.agents/examples/.env.example' : null);
if (envFile) loadEnvFile(envFile);

const apiUrl = (process.env.N8N_API_URL || 'http://localhost:5678').replace(/\/$/, '');
const apiKey = process.env.N8N_API_KEY || '';

function requestJson(method, url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { method, headers };
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(u, opts, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function importFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let json;
  try { json = JSON.parse(raw); } catch (e) { console.error('Invalid JSON in', filePath); return; }

  const url = apiUrl + '/workflows';
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['X-N8N-API-KEY'] = apiKey;
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  console.log(`Importing ${path.basename(filePath)} → ${url}`);
  try {
    const res = await requestJson('POST', url, JSON.stringify(json), headers);
    if (res.status >= 200 && res.status < 300) {
      console.log('Imported successfully:', res.status);
    } else {
      console.error('Failed to import:', res.status, res.body);
      console.error('If this endpoint is not available, check your n8n version or use the UI to import the workflow.');
    }
  } catch (err) {
    console.error('Request failed:', err.message || err);
  }
}

async function main() {
  const examplesDir = path.join('.agents', 'examples');
  if (!fs.existsSync(examplesDir)) { console.error('No examples directory found'); process.exit(1); }
  const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) { console.log('No workflow JSON files found in', examplesDir); return; }
  for (const f of files) {
    await importFile(path.join(examplesDir, f));
  }
}

main();
