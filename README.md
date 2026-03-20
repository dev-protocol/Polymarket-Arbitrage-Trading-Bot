# Polymarket Arbitrage Trading Bot

An automated prediction market trading bot that operates on Polymarket’s short-duration Up/Down markets using real-time orderbook data and adaptive price prediction.

---

## Prove of work



https://github.com/user-attachments/assets/dc0c18df-bdcb-4fcf-9b81-e4620fbed6bb



## Private version bot profile

[![Prevaite version Bot Profile](https://github.com/user-attachments/assets/cae20e42-cb84-4385-9558-91a770b00c98)](https://polymarket.com/@MangoTrolley7)

## Overview

This bot uses an **artificial trading strategy** to trade on Polymarket’s CLOB (Central Limit Order Book). It connects to live orderbook feeds, derives directional signals from price movements, places limit orders, and manages hedges with configurable risk controls.

**Key features:**
- Real-time WebSocket orderbook integration
- Adaptive price prediction with confidence scoring
- Configurable markets, position sizes, and risk limits
- Graceful shutdown with balance, allowance, and market status checks

---

## Requirements

- **Node.js** 18 or newer
- **Polygon wallet** funded with USDC
- **Polygon RPC** endpoint (for approvals and redemptions)

---

## Installation

```bash
git clone https://github.com/dev-protocol/Polymarket-Arbitrage-Trading-Bot
cd Polymarket-Arbitrage-Trading-Bot
npm install
```

---

## Configuration

Create a `.env` file in the project root. You can copy from any existing template and configure at least your private key and target markets.

### Core Environment Variables

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Polygon wallet private key. **Never share this.** |
| `BOT_MARKETS` | Comma-separated market slugs (e.g. `btc`, `eth`). |
| `BOT_SHARES_PER_SIDE` | Shares per side per trade. |
| `BOT_TICK_SIZE` | Price precision (e.g. `0.01`). |
| `BOT_PRICE_BUFFER` | Optional execution buffer (cents). |
| `BOT_WAIT_FOR_NEXT_MARKET_START` | Align start with the next 15‑minute boundary. |
| `BOT_MAX_BUY_COUNTS_PER_SIDE` | Max buys per side per market (`0` = unlimited). |
| `CHAIN_ID` | EVM chain ID (Polygon mainnet: `137`). |
| `CLOB_API_URL` | Base URL for the CLOB API. |
| `RPC_URL` / `RPC_TOKEN` | RPC endpoint for approvals and redemptions. |
| `BOT_MIN_USDC_BALANCE` | Minimum USDC balance required to start. |
| `LOG_DIR` / `LOG_FILE_PREFIX` / `LOG_FILE_PATH` | Logging configuration. |

> **Backward compatibility:** The bot still supports the legacy `COPYTRADE_*` variable names. New setups should use the `BOT_*` names above.

API credentials are created on first run and stored under `src/data/`.

---

## Running the Bot

Start the trading runtime:

```bash
npm start
```

Redeem resolved markets and manage holdings:

```bash
npm run redeem
npm run redeem:holdings
```

---

## Development

```bash
npx tsc --noEmit
npx ts-node src/index.ts
```

---

## Architecture

The runtime is organized into three layers:

### Application Runtime
- **`src/app/runner.ts`** — Orchestration: config validation, credentials, balance checks, allowance sync, and trading engine startup.
- **`src/index.ts`** — Entrypoint that delegates to the runner.

### Infrastructure & Integration
- **`src/config/`** — Loads `.env` and provides typed configuration.
- **`src/providers/`** — Polymarket CLOB (HTTP/WebSocket) and other external services.
- **`src/security/`** — Wallet checks, minimum balance validation, and allowance management.
- **`src/utils/`** — Balance polling, logging, and redemption helpers.
- **`src/data/`** — Local JSON state and credentials.

### Strategy Engine
- **`src/order-builder/trading.ts`** — Arbitrage trading strategy: market slug resolution, price prediction, and order placement.

---

## Disclaimer

This software is experimental. Use at your own risk and only with funds you can afford to lose. Maintainers are not responsible for financial losses, misconfiguration, or downtime.
