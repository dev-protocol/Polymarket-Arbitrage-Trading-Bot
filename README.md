## Overview

- **Core idea**: Automated market-making and copytrading on short-duration prediction markets using Polymarket’s CLOB.
- **Execution loop**: Connects to the orderbook, derives a directional signal, places a lead order, then manages the opposite side as a hedge with configurable risk parameters.
- **Runtime**: Long‑lived process that continuously monitors balances, allowances and market status, and exits gracefully on shutdown.

## Requirements

- Node.js 18+ (recommended)
- Polygon wallet funded with USDC
- Polygon RPC endpoint (for approvals/redemptions)

## Installation

Clone or copy this repository into your own workspace (no external remote is required):

```bash
cd polymarket-copytrade-bot
npm install
```

## Configuration

Create a `.env` file in the project root (you can base it on any existing template you have) and set at least your private key and the markets you want to participate in.

### Important environment variables

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Polygon wallet private key (never share this). |
| `COPYTRADE_MARKETS` | Comma‑separated markets (e.g. `btc`). |
| `COPYTRADE_SHARES` | Shares per side per trade. |
| `COPYTRADE_TICK_SIZE` | Price precision. |
| `COPYTRADE_PRICE_BUFFER` | Optional execution buffer. |
| `COPYTRADE_WAIT_FOR_NEXT_MARKET_START` | Whether to align with the next 15‑minute boundary before starting. |
| `COPYTRADE_MAX_BUY_COUNTS_PER_SIDE` | Max buys per side per market (`0` = unlimited). |
| `CHAIN_ID` | EVM chain id (Polygon mainnet is `137`). |
| `CLOB_API_URL` | Base URL for the CLOB API. |
| `RPC_URL` / `RPC_TOKEN` | RPC endpoint details for approvals/redemptions. |
| `BOT_MIN_USDC_BALANCE` | Minimum USDC balance required to start trading. |
| `LOG_DIR` / `LOG_FILE_PREFIX` / `LOG_FILE_PATH` | Logging configuration for local files. |

API credentials are generated on first run and stored locally under `src/data/`.

## Running the bot

Start the trading runtime:

```bash
npm start
```

Redeem resolved markets and manage holdings using the provided scripts:

```bash
npm run redeem
npm run redeem:holdings
```

## Development workflow

```bash
npx tsc --noEmit
npx ts-node src/index.ts
```

## Architecture

At a high level the runtime is split into three layers:

- **Application runtime**
  - `src/app/runner.ts`: High‑level orchestration. Validates configuration and credentials, ensures minimum USDC balance, synchronizes allowances with the CLOB API, and starts the trading engine. This is the main place to look if you want to understand the boot sequence.
  - `src/index.ts`: Thin entrypoint that just delegates to the application runner.

- **Infrastructure & integration**
  - `src/config/…`: Loads `.env` and exposes strongly‑typed configuration for the rest of the app.
  - `src/providers/…`: Connectivity to Polymarket CLOB (HTTP/WebSocket) and other external services.
  - `src/security/…`: Wallet safety checks, minimum balance validation and allowance management.
  - `src/utils/…`: Shared utilities such as balance polling, logging helpers and redemption helpers.
  - `src/data/…`: Local JSON state and credentials written at runtime.

- **Strategy engine**
  - `src/order-builder/copytrade.ts`: Implements the copytrade arbitrage strategy, including market slug resolution, price prediction and order placement.

## Disclaimer

This software is experimental trading infrastructure. Use it at your own risk and only with funds you can afford to lose. The maintainers are not responsible for any financial losses, misconfigurations or downtime.
