/**
 * cTrader Open API Proxy — REST version
 * Uses cTrader's REST API (no Protobuf/WebSocket complexity)
 * Runs locally on your MacBook.
 */
require('dotenv').config();
const http  = require('http');
const https = require('https');
const url   = require('url');

const PORT          = process.env.PORT            || 3000;
const CLIENT_ID     = process.env.CTRADER_CLIENT_ID;
const CLIENT_SECRET = process.env.CTRADER_CLIENT_SECRET;
const APP_URL       = process.env.APP_URL || `http://localhost:${PORT}`;
const REDIRECT_URI  = `${APP_URL}/callback`;
const BASE_URL      = 'https://api.ctrader.com';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing CTRADER_CLIENT_ID or CTRADER_CLIENT_SECRET in .env');
  process.exit(1);
}

// ── State ─────────────────────────────────────────────────────────
let accessToken  = null;
let refreshToken  = null;
let accounts     = [];
let positions    = [];
let balances     = {};
let lastSync     = null;

// ── HTTP helper ───────────────────────────────────────────────────
function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function apiGet(path, token) {
  return httpsRequest({
    hostname: 'api.ctrader.com',
    path,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
}

// ── OAuth ─────────────────────────────────────────────────────────
function buildAuthUrl() {
  return `https://connect.spotware.com/apps/auth?` +
    `client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code&scope=trading`;
}

async function fetchToken(code) {
  const body = [
    `grant_type=authorization_code`,
    `code=${encodeURIComponent(code)}`,
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    `client_id=${encodeURIComponent(CLIENT_ID)}`,
    `client_secret=${encodeURIComponent(CLIENT_SECRET)}`,
  ].join('&');

  const res = await httpsRequest({
    hostname: 'connect.spotware.com',
    path: '/apps/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    }
  }, body);
  return res.data;
}

async function refreshAccessToken() {
  if (!refreshToken) return false;
  const body = [
    `grant_type=refresh_token`,
    `refresh_token=${encodeURIComponent(refreshToken)}`,
    `client_id=${encodeURIComponent(CLIENT_ID)}`,
    `client_secret=${encodeURIComponent(CLIENT_SECRET)}`,
  ].join('&');
  const res = await httpsRequest({
    hostname: 'connect.spotware.com',
    path: '/apps/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    }
  }, body);
  if (res.data.access_token) {
    accessToken  = res.data.access_token;
    refreshToken = res.data.refresh_token || refreshToken;
    console.log('🔑 Token refreshed');
    return true;
  }
  return false;
}

// ── Data sync ─────────────────────────────────────────────────────
async function syncData() {
  if (!accessToken) return;
  try {
    console.log('🔄 Syncing cTrader data...');

    // Get accounts
    const acctRes = await apiGet('/v2/webserv/traders', accessToken);
    if (acctRes.status === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) { accessToken = null; return; }
      return syncData();
    }

    const traders = acctRes.data?.data || acctRes.data || [];
    accounts = (Array.isArray(traders) ? traders : [traders])
      .filter(t => t && !t.isDemo)
      .map(t => ({
        id:       t.login || t.id,
        name:     `cTrader Live (${t.login || t.id})`,
        balance:  t.balance  || 0,
        equity:   t.equity   || t.balance || 0,
        currency: t.depositCurrency || 'USD',
      }));

    // Get positions for each account
    positions = [];
    for (const acct of accounts) {
      try {
        const posRes = await apiGet(`/v2/webserv/traders/${acct.id}/positions`, accessToken);
        const pos = posRes.data?.data || posRes.data || [];
        (Array.isArray(pos) ? pos : []).forEach(p => {
          positions.push({
            accountId:  acct.id,
            positionId: p.id || p.positionId,
            symbol:     p.symbolName || p.symbol || 'Unknown',
            volume:     (p.volume || 0) / 100,
            side:       p.tradeSide || p.side || '',
            openPrice:  p.entryPrice || p.openPrice || 0,
          });
        });
      } catch (e) {
        console.error(`Positions error for ${acct.id}:`, e.message);
      }
    }

    lastSync = new Date().toISOString();
    console.log(`✅ Synced — ${accounts.length} accounts, ${positions.length} positions at ${lastSync}`);
  } catch (e) {
    console.error('Sync error:', e.message);
  }
}

// ── HTTP helpers ──────────────────────────────────────────────────
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
function json(res, data, status = 200) {
  cors(res); res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
function page(res, title, body) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>body{font-family:system-ui,sans-serif;padding:40px;background:#09091a;color:#e8e8f0;max-width:600px}
  a{color:#7B68EE}.btn{display:inline-block;padding:12px 24px;background:#7B68EE;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px}
  code{background:#1a1a30;padding:2px 6px;border-radius:4px;color:#3DD68C}</style>
  </head><body>${body}</body></html>`);
}

// ── Server ────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed   = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsed.pathname;

  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }

  if (pathname === '/') {
    const sc = accessToken ? '#3DD68C' : '#ff6666';
    const st = accessToken ? '🟢 Connected' : '🔴 Not authenticated';
    page(res, 'cTrader Proxy', `
      <h1>📈 cTrader Proxy</h1>
      <p style="color:${sc};font-weight:700">${st}</p>
      ${lastSync ? `<p style="color:#555;font-size:13px">Last sync: ${new Date(lastSync).toLocaleString()}</p>` : ''}
      ${!accessToken ? `<a class="btn" href="/auth">🔑 Connect cTrader Account</a>` : ''}
      <p style="color:#333;font-size:11px;margin-top:32px">Redirect URI: <code>${REDIRECT_URI}</code></p>
    `); return;
  }

  if (pathname === '/auth') {
    res.writeHead(302, { Location: buildAuthUrl() }); res.end(); return;
  }

  if (pathname === '/callback') {
    const code = parsed.searchParams.get('code');
    if (!code) { page(res, 'Error', '<h2>❌ No code received</h2><a href="/auth">Try again</a>'); return; }
    try {
      const t = await fetchToken(code);
      if (t.error) throw new Error(t.error_description || t.error);
      accessToken  = t.access_token;
      refreshToken = t.refresh_token;
      console.log('🔑 Token received — syncing...');
      await syncData();
      page(res, 'Connected!', `
        <h2 style="color:#3DD68C">✅ Connected to cTrader!</h2>
        <p>You can close this tab and return to your portfolio tracker.</p>
        <p style="color:#555;font-size:13px">Syncing every 15 minutes automatically.</p>
        <a href="/">← Status page</a>
      `);
    } catch (e) {
      page(res, 'Error', `<h2>❌ ${e.message}</h2><a href="/auth">Try again</a>`);
    }
    return;
  }

  if (pathname === '/status') {
    json(res, { authenticated: !!accessToken, connected: !!accessToken, accounts: accounts.length, lastSync }); return;
  }

  if (pathname === '/data') {
    if (!accessToken) { json(res, { error: 'Not authenticated', authUrl: `http://localhost:${PORT}/auth` }, 401); return; }
    json(res, { accounts, positions, lastSync }); return;
  }

  if (pathname === '/refresh') {
    if (!accessToken) { json(res, { error: 'Not authenticated' }, 401); return; }
    await syncData();
    json(res, { ok: true, lastSync }); return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 cTrader Proxy running at http://localhost:${PORT}`);
  console.log(`   → Open http://localhost:${PORT}/auth to connect\n`);
});

// Refresh token every 20 min, sync data every 15 min
setInterval(() => { if (accessToken) refreshAccessToken(); }, 20 * 60 * 1000);
setInterval(() => { if (accessToken) syncData(); }, 15 * 60 * 1000);

process.on('SIGINT', () => { server.close(); process.exit(0); });
