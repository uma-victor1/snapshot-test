# Snapshot Test

SmartUI-ready React demo that showcases Jest snapshot testing, LambdaTest SmartUI visual regression, and Selenium-driven workflows. The project ships with a direct SmartUI client (no SDK import issues) and helper scripts so you can capture local baselines or cloud builds quickly.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Setup](#setup)
5. [Environment Variables](#environment-variables)
6. [Running the App](#running-the-app)
7. [Testing](#testing)
   - [Unit & Snapshot Tests](#unit--snapshot-tests)
   - [LambdaTest SmartUI Visual Tests](#lambdatest-smartui-visual-tests)
8. [Project Structure](#project-structure)
9. [Troubleshooting](#troubleshooting)
10. [Helpful Links](#helpful-links)

---

## Features

- React user card showcase with both light and dark themes
- Jest-based unit + snapshot coverage (`UserCard` component and mocks)
- Direct SmartUI integration (`src/smartui-direct.js`) that talks to the SmartUI CLI via HTTP
- Scripts for running SmartUI tests via CLI or convenience batch/PowerShell wrappers
- LambdaTest Selenium setup for capturing snapshots locally or on LT grid

## Tech Stack

- **React 19 / CRA 5** for the UI
- **Jest + Testing Library** for unit & snapshot tests
- **Selenium WebDriver** for end-to-end SmartUI captures
- **LambdaTest SmartUI CLI** for visual regression management
- **Node 18+** (recommended) to match SmartUI CLI requirements

## Prerequisites

- Node.js (>= 18) & npm
- Chrome browser (used for local SmartUI snapshots)
- LambdaTest account with SmartUI access
- SmartUI CLI installed globally or available via `npx` (`@lambdatest/smartui-cli`)

## Setup

### Quick Start (All Platforms)

```bash
git clone https://github.com/Sammex45/snapshot-test.git
cd snapshot-test
npm install
```

### Environment Setup

**Option 1: Automated Setup**

**macOS/Linux:**

```bash
./setup.sh
```

**Windows (Command Prompt):**

```cmd
copy .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Option 2: Manual Setup**

1. Copy `.env.example` to `.env`
2. Edit `.env` and add your credentials:

| Variable        | Description                                          |
| --------------- | ---------------------------------------------------- |
| `LT_USERNAME`   | Your LambdaTest username                             |
| `LT_ACCESS_KEY` | LambdaTest access key                                |
| `PROJECT_TOKEN` | SmartUI project token (dashboard → Settings)         |
| `APP_URL`       | URL SmartUI should load (defaults to CRA dev server) |

Get your credentials from: https://accounts.lambdatest.com/security

## Running the App

| Command         | Description                                        |
| --------------- | -------------------------------------------------- |
| `npm start`     | Launches CRA dev server at `http://localhost:3000` |
| `npm run build` | Production build in `build/`                       |

## Testing

### Unit & Snapshot Tests

| Command                 | Description           |
| ----------------------- | --------------------- |
| `npm test`              | Jest in watch mode    |
| `npm run test:watch`    | Alias for watch mode  |
| `npm run test:coverage` | Coverage report       |
| `npm run test:update`   | Update Jest snapshots |

### LambdaTest SmartUI Visual Tests

There are two primary workflows:

1. **Direct CLI + Jest spec (recommended)**

   ```bash
   npm start              # in another terminal
   npm run test:smartui   # runs SmartUI CLI + jest src/lambdatest.spec.js
   ```

2. **Helper scripts (Windows)**

   - `run-smartui-tests.bat`
   - `run-smartui-tests.ps1`

   These scripts:

   - Check if the CRA dev server is running (start it if missing on PowerShell version)
   - Export `LT_USERNAME`, `LT_ACCESS_KEY`, `PROJECT_TOKEN`
   - Execute `npm run test:smartui`
   - Provide colorized logging on completion

   #### `run-smartui-tests.bat`

   Windows batch wrapper that automates the full SmartUI workflow when double-clicked:

   1. Sets all required LambdaTest / SmartUI environment variables
   2. Verifies `http://localhost:3000` responds before continuing
   3. Calls `npm run test:smartui` to run the CLI + Jest spec
   4. Prints the dashboard URL reminder on success

   Use this if you prefer a repeatable, hands‑off flow without manually exporting variables each time.

> `src/lambdatest.spec.js` automatically detects if SmartUI CLI is running on `localhost:49152` and falls back to LambdaTest cloud capabilities when needed.

## Project Structure

```
src/
├── App.js / App.css               # Demo layout + themed background
├── Components/UserCard/           # Reusable card + CSS + snapshots
├── lambdatest.spec.js             # SmartUI Selenium test suite
├── smartui-direct.js              # Direct SmartUI CLI HTTP client
└── __mocks__/testData.js          # Sample users for demos/tests

public/
├── index.html / manifest.json / robots.txt
└── assets for CRA

scripts & docs:
├── run-smartui-tests.(bat|ps1)    # Windows helpers
├── verify-setup.ps1               # Environment diagnostics
└── QUICK_START.md                 # Extended notes
```

## Troubleshooting

- **SmartUI CLI not detected**: Ensure `npx smartui server` (or `npm run test:smartui`) is running; the test checks port `49152`.
- **"No snapshots processed"**: Wait a second between snapshots (already added) and confirm the CLI console shows upload logs.
- **Module import errors**: `smartui-direct.js` eliminates ESM issues by using Node's native HTTP client; keep SmartUI CLI updated.
- **Authentication skipped**: Double-check the three environment variables and confirm the project token matches the SmartUI dashboard.

## Helpful Links

- [LambdaTest SmartUI Docs](https://www.lambdatest.com/support/docs/smart-ui-overview/)
- [SmartUI CLI GitHub](https://github.com/LambdaTest/smartui-cli)
- [Jest Snapshot Testing](https://jestjs.io/docs/snapshot-testing)
- [Create React App Docs](https://create-react-app.dev/docs/getting-started/)

---

Happy testing and ship visually consistent UIs!
