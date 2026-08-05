import { useState } from 'react';
import { calculateMetrics, type Trade } from './utils/calculations';
import { AccountSummary } from './components/AccountSummary';
import { RiskIndicator } from './components/RiskIndicator';
import { EquityChart } from './components/EquityChart';
import { TradeManager } from './components/TradeManager';
import { PerformanceByAsset } from './components/PerformanceByAsset';
import { Shield } from 'lucide-react';

const DEFAULT_TRADES: Trade[] = [
  { id: '1', asset: 'BTC', type: 'Long', pnl: 1200 },
  { id: '2', asset: 'ETH', type: 'Short', pnl: -450 },
  { id: '3', asset: 'BTC', type: 'Short', pnl: 800 },
  { id: '4', asset: 'SOL', type: 'Long', pnl: -300 },
  { id: '5', asset: 'ETH', type: 'Long', pnl: 2000 },
];

const STARTING_BALANCE = 100000;
const MAX_DRAWDOWN_LIMIT = 10000;
const DAILY_LOSS_LIMIT = 5000;

function App() {
  const [trades, setTrades] = useState<Trade[]>(DEFAULT_TRADES);

  const metrics = calculateMetrics(
    trades,
    STARTING_BALANCE,
    MAX_DRAWDOWN_LIMIT,
    DAILY_LOSS_LIMIT
  );

  const handleAddTrade = (newTradeData: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...newTradeData,
      id: Date.now().toString(),
    };
    setTrades((prev) => [...prev, newTrade]);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetTrades = () => {
    setTrades(DEFAULT_TRADES);
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-brand">
          <Shield size={20} className="brand-logo" />
          <h1>TRADESCAPE <span className="header-separator">/</span> <span className="brand-subtitle">RISK TERMINAL</span></h1>
        </div>
        <div className="account-badge number-display">
          ACC #TS-9481
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="dashboard-grid">
        {/* Top summary row: KPIs */}
        <section className="col-span-full">
          <AccountSummary metrics={metrics} />
        </section>

        {/* Left column: Risk Gauge and Equity Chart */}
        <section className="left-column">
          <RiskIndicator
            metrics={metrics}
            maxDrawdownLimit={MAX_DRAWDOWN_LIMIT}
            dailyLossLimit={DAILY_LOSS_LIMIT}
          />
          <EquityChart history={metrics.equityHistory} />
        </section>

        {/* Right column: Trade list/creator & Asset Breakdown */}
        <section className="right-column">
          <TradeManager
            trades={trades}
            onAddTrade={handleAddTrade}
            onDeleteTrade={handleDeleteTrade}
            onResetTrades={handleResetTrades}
          />
          <PerformanceByAsset trades={trades} />
        </section>
      </main>

      <footer className="dashboard-footer">
        <p className="text-muted text-xs">
          Tradescape Developer Assessment • Built with React, TypeScript & Vanilla CSS.
        </p>
      </footer>

      <style>{`
        .app-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo {
          color: var(--color-primary);
        }

        .header-brand h1 {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-separator {
          color: var(--border-color);
          font-weight: normal;
        }

        .brand-subtitle {
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .account-badge {
          font-size: 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: var(--border-radius-sm);
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 1.5rem;
          flex-grow: 1;
          align-items: start;
        }

        .col-span-full {
          grid-column: span 2;
        }

        .left-column, .right-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dashboard-footer {
          margin-top: 4rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .text-xs {
          font-size: 0.725rem;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .col-span-full {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
