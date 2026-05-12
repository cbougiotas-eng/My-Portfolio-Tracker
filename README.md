# cTrader Local Proxy

Runs **locally on your MacBook** — connects your portfolio tracker to your live cTrader account.

## Setup

### Step 1 — Get cTrader API credentials

1. Go to [openapi.ctrader.com](https://openapi.ctrader.com)
2. Sign in with your cTrader account
3. Click **New Application**
4. Set redirect URI to: `http://localhost:3000/callback`
5. Submit and wait for approval (up to 3 business days)
6. Once approved, copy your **Client ID** and **Client Secret**

### Step 2 — Create your .env file

In Terminal, navigate to this folder and run:
```bash
nano .env
```

Type exactly this (replace with your real values):
```
CTRADER_CLIENT_ID=your_client_id_here
CTRADER_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

Press **Ctrl+X** → **Y** → **Enter** to save.

### Step 3 — Install & run

```bash
npm install
node server.js
```

You should see:
```
🚀 Server on port 3000 — http://localhost:3000
```

### Step 4 — Connect your cTrader account

1. Open **http://localhost:3000** in your browser
2. Click **🔑 Connect cTrader Account**
3. Log in with your cTrader credentials
4. You'll see ✅ Connected — close the tab

### Step 5 — Connect in portfolio tracker

1. Open your portfolio tracker
2. Go to **Settings → cTrader Integration**
3. URL should already show `http://localhost:3000`
4. Tap **🔄 Sync Now**

---

## Important

- The server must be **running on your MacBook** for sync to work
- Stop it with **Ctrl+C** in Terminal
- Start again anytime with `node server.js`
- **Never share your .env file**

## What syncs

| Data | Appears as |
|---|---|
| Account equity | Cash entry in Trading account |
| Open positions | Holdings in Trading account |

Auto-syncs every 15 minutes alongside stock prices.

## Troubleshooting

**"Check local server"** in the app → make sure `node server.js` is running in Terminal.

**"Application authentication failed"** → check that the redirect URI in cTrader Open API is exactly `http://localhost:3000/callback`.

**Positions not showing** → your cTrader application may still be pending approval.
