# 📊 Portfolio Tracker

A single-file HTML app for tracking your Swedish stock and investment portfolio. No installation needed — just open the file in any browser or host it online.

---

## What it does

### Accounts
Holdings are split into two accounts:
- **📈 Long Term** — core positions you plan to hold
- **⚡ Trading** — active trades with stricter risk rules

### Views
- **Chart** — donut charts showing sector allocation for Total, Long Term, and Trading accounts
- **Sectors** — breakdown by sector with target allocation drift bars
- **Holdings** — full list with search, sort, edit, and delete
- **Goals** — portfolio value target, long term % target, and monthly savings plan
- **Warnings** — automatic alerts for oversized positions, overweight sectors, and missing stop losses
- **Settings** — warning thresholds, cloud sync, target allocations, and snapshot history

### Key features
- **Live prices** via Yahoo Finance — add a ticker symbol to any holding and prices refresh automatically during market hours
- **Risk mode vs Market mode** — toggle between market value and stop-loss-adjusted risk value across all views
- **Stop loss tracking** — set a stop loss price to calculate your maximum risk per holding
- **Notes** — add a short note to any holding (e.g. "DCA position", "waiting for earnings")
- **CSV import** — import directly from an Avanza export; smart merge keeps your manual holdings intact
- **JSON export & backup** — full backup includes holdings and goals; auto-backup runs weekly
- **Cloud sync** — sign in with Google to sync your portfolio across all your devices via Firebase

### Currencies supported
Prices are fetched in the original currency and automatically converted to SEK using live exchange rates. Supported: USD, EUR, CAD, GBP (including LSE pence).

---

## How to use

1. Open the HTML file in a browser, or visit your hosted URL
2. Tap **+** to add your first holding, or import an Avanza CSV
3. Add ticker symbols to holdings for automatic price updates
4. Tap **🔄 Prices** to refresh, or prices refresh automatically every 15 minutes during market hours
5. Go to **Settings → Cloud Sync** and sign in with Google to sync across devices

---

## Hosting

The app works as a plain HTML file. For cloud sync to work, it must be served over `https://` — not opened from disk. Tested on:
- GitHub Pages
- Netlify
- Any static file host

---

## Data & privacy

- All data is saved locally in your browser's `localStorage`
- Cloud sync is optional and stores data in your own Firebase project
- No ads, no analytics, no third-party data sharing
