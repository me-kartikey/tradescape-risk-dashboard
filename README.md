# Tradescape — Trader Risk Dashboard

This repository contains the Trader Risk Dashboard built for the Tradescape Full Stack Developer Assignment. It is a modern, responsive single-page web terminal that calculates and visualizes key risk metrics, balance trajectories, and performance statistics from active trading data.

---

## What I Built & Product Features

* **Real-Time KPIs:** Accounts metrics derived dynamically:
  * Current Balance & Net P&L.
  * Win Rate, Winning vs. Losing counts.
  * Extremes (Largest winning and largest losing trades).
* **Visual Risk Indicators:** A glowing status panel reflecting **Safe / Approaching Limit / At Risk** status. It tracks:
  * **Daily Loss Limit Check:** Sums all negative trades only (`$450 + $300 = $750`) and computes the remaining allowance out of `$5,000`.
  * **Drawdown Limit Check:** Compares the current peak-to-trough decline against the `$10,000` drawdown allowance.
* **SVG Equity Curve Chart:** A custom-built, fully responsive line graph that plots account balance changes chronologically. Hovering over dots displays tooltip tooltips with exact balance and P&L details.
* **Interactive Mock Trade Manager (Additional Product Feature):**
  * Added a form to **Add custom trades** and table actions to **Delete trades**.
  * The entire dashboard, equity chart, asset grouping, and risk status recalculate in real-time when the dataset shifts.
  * Includes a **Reset Defaults** button to instantly restore the original 5 assignment trades.
* **Performance by Asset:** Automatically clusters trades by token (e.g. BTC, ETH, SOL) showing win counts and net performance per asset.

---

## Answers to Product Questions

### 1. What is drawdown in trading?
Drawdown is the decline in account balance from its highest historical peak to its subsequent lowest point. 
It measures the absolute worst-case drop and paper losses an account has experienced. For example:
* Starting balance: `$100,000`
* Grows to peak: `$105,000`
* Drops to trough: `$102,000`
* **Drawdown = $3,000** (`$105,000 - $102,000`), despite the account being up `$2,000` overall from the initial starting capital.

### 2. Why would a trader care about remaining drawdown rather than just current P&L?
* **Account Survival:** Exceeding the maximum drawdown limit leads to immediate account liquidation or challenge failure (a hard rule in prop firms).
* **Position Sizing:** Remaining drawdown tells the trader how much buffer they have left. If remaining drawdown is low, they must reduce contract/lot sizes to protect their account.
* **Drawdown vs. Profit:** An account can have positive net P&L but still be very close to its drawdown limit if it recently dropped from a high peak.

### 3. If you had another day to work on this, what would you improve?
1. **State Persistence:** Connect the trade manager to `localStorage` so changes persist across page reloads.
2. **Midnight Reset for Daily Loss:** Add timestamps to trades to allow the daily loss limit to reset automatically at the end of each trading day.
3. **Advanced Charts:** Integrate a charting library (like Recharts) for grid hover cursors and zoom/pan functionality.
4. **Multiple Accounts Simulator:** Allow users to simulate and switch between different account sizes (e.g., $50k, $100k, $200k) and custom rules.

---

## How to Run the Project Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (comes with Node.js)

### Step-by-Step Instructions
1. **Navigate to the project directory:**
   ```bash
   cd tradescape-risk-dashboard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Open the local host URL printed in the terminal (usually `http://localhost:5173`).
