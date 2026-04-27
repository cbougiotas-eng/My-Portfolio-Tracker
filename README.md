# 📊 Portfolio Tracker

![License: MIT](https://img.shields.io/badge/License-MIT-7B68EE.svg)
![Single File](https://img.shields.io/badge/single--file-HTML-4A90D9.svg)
![No Install](https://img.shields.io/badge/no%20install-just%20open-5BA85B.svg)
![Firebase Sync](https://img.shields.io/badge/sync-Firebase-F7931A.svg)

A single-file HTML app for tracking your Swedish stock and investment portfolio. No installation, no dependencies, no build step — just open the file in any browser or host it online.

> 🇸🇪 Built for Swedish investors using Avanza, with SEK as the base currency and USD/EUR/GBP/CAD conversion built in.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📈 **Live prices** | Auto-fetches from Yahoo Finance during market hours (every 15 min) |
| 💱 **Live FX rates** | USD/SEK, EUR/SEK, CAD/SEK, GBP/SEK — fetched independently, visible in Settings |
| 🌍 **Currency toggle** | Switch display between SEK and USD at any time |
| ⚡ **Risk mode** | Toggle between market value and stop-loss-adjusted risk across all views |
| 🛑 **Stop losses** | Set a stop price to track max risk per holding |
| 🗂 **Two accounts** | Separate Long Term and Trading accounts with different risk rules |
| ⚠️ **Warnings** | Flags oversized positions, overweight sectors, missing stop losses, and more |
| 🎯 **Goals** | Portfolio target, long term % target, and monthly savings plan |
| 📂 **Avanza CSV import** | Smart merge — keeps your manual holdings, updates prices from CSV |
| ☁️ **Cloud sync** | Google sign-in syncs your portfolio via Firebase across all devices |
| 💾 **Auto-backup** | Weekly JSON backup to your Downloads folder |
| 📝 **Notes** | Add a short note to any holding |

---

## 📱 Screenshots

> _Charts, holdings list, and warnings on mobile and desktop_

_(add your own screenshots here)_

---

## 🚀 Getting started

1. **Open** the HTML file in any browser, or visit your hosted URL
2. Tap **+** to add your first holding — or import an **Avanza CSV**
3. Add **ticker symbols** to holdings (e.g. `NEM`, `BTC-USD`, `ERIC-B.ST`) for live prices
4. Tap **🔄 Prices** to refresh, or wait — prices refresh automatically every 15 min during market hours
5. Go to **Settings → Cloud Sync** and sign in with Google to sync across devices

---

## 🗂 Views

**Chart** — donut charts for Total, Long Term, and Trading. Click a sector to filter. Swipe on mobile, side-by-side on desktop.

**Sectors** — sector breakdown with target allocation drift bars. Set your targets in Settings to see how far off you are.

**Holdings** — full list with search, sort (by value, %, name, P&L, risk), and per-holding edit/delete. Shows P&L vs buy price, freshness indicator for live prices, and stop loss risk.

**Goals** — portfolio value goal with deadline and progress bar, long term % target, and monthly savings plan.

**Warnings** — automatic alerts for:
- Individual trading positions exceeding your size limit
- Overweight sectors in the trading account
- Trading holdings with no stop loss set
- Trading account too large relative to long term
- Long term group limits (stocks, crypto, metals, cash)

**Settings** — warning thresholds, cloud sync status, target allocations, FX rate display, snapshot history, and backup.

---

## 💱 Currencies

All data is stored in SEK internally. Prices are fetched in the asset's native currency and converted automatically using live rates. Supported:

- USD → SEK
- EUR → SEK
- CAD → SEK
- GBP → SEK (including LSE pence quotes)

The live FX rate is fetched on startup and refreshed every 30 minutes — independent of price refreshes. The current rate is always visible in **Settings → Currency & FX Rate**.

---

## 📂 CSV import (Avanza)

1. In Avanza, go to your portfolio → export as CSV
2. In the app, go to **Holdings** → tap **📂 CSV**
3. The smart merge will:
   - Update values for existing holdings
   - Add new ones
   - Keep any manual holdings not in the CSV
   - Remember sector assignments for future imports

---

## ☁️ Hosting

The app is a plain HTML file. For cloud sync to work it must be served over `https://` (not opened from disk). Works great on:

- **GitHub Pages** — free, permanent URL, source visible to community
- **Netlify** — drag-and-drop deploy at [app.netlify.com/drop](https://app.netlify.com/drop)
- Any static file host

---

## 🔒 Data & privacy

- All data is saved locally in your browser's `localStorage`
- Cloud sync is optional — data goes to your own Firebase project, not a shared server
- No ads, no analytics, no third-party data sharing
- The Firebase config in the code is a **public client config** — it's safe to share and cannot be used to access your data without your Google login

---

## 🛠 Built with

- Vanilla HTML, CSS, and JavaScript — zero dependencies, zero build tools
- [Yahoo Finance API](https://finance.yahoo.com) for live prices and FX rates (via CORS proxy)
- [Firebase](https://firebase.google.com) for optional cloud sync
- [Google Identity Services](https://developers.google.com/identity) for sign-in

---

## 🤝 Contributing

Found a bug or have an idea? Open an issue or a pull request — contributions welcome!

The entire app lives in a single `index.html` file. No build step, no package manager. Just edit and open in a browser.

---

## ☕ Support

If this app helps you manage your investments, consider [buying me a coffee](https://buymeacoffee.com/chcronlund)!
