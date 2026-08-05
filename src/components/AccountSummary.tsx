import React from 'react';
import type { CalculatedMetrics } from '../utils/calculations';
import { DollarSign, TrendingUp, TrendingDown, Percent, Target } from 'lucide-react';

interface AccountSummaryProps {
  metrics: CalculatedMetrics;
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({ metrics }) => {
  const formatCurrency = (val: number) => {
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(absVal);
    return isNegative ? `-${formatted}` : formatted;
  };

  const formatPercent = (val: number) => {
    return `${val.toFixed(1)}%`;
  };

  return (
    <div className="account-summary-grid">
      {/* 1. Current Balance */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title text-muted">Current Balance</span>
          <DollarSign size={16} className="card-icon text-muted" />
        </div>
        <div className="card-value number-display">
          {formatCurrency(metrics.currentBalance)}
        </div>
        <div className="card-footer-info">
          <span className="text-muted">Starting balance:</span>
          <span className="number-display text-muted-val">{formatCurrency(metrics.startingBalance)}</span>
        </div>
      </div>

      {/* 2. Total P&L */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title text-muted">Total Net P&L</span>
          {metrics.totalPnl >= 0 ? (
            <TrendingUp size={16} className="card-icon text-success" />
          ) : (
            <TrendingDown size={16} className="card-icon text-danger" />
          )}
        </div>
        <div className={`card-value number-display ${metrics.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
          {metrics.totalPnl > 0 ? '+' : ''}
          {formatCurrency(metrics.totalPnl)}
        </div>
        <div className="card-footer-info">
          <span className="text-muted">Across</span>
          <span className="number-display number-highlight">{metrics.totalTradesCount}</span>
          <span className="text-muted">trades logged</span>
        </div>
      </div>

      {/* 3. Win Rate */}
      <div className="card summary-card">
        <div className="card-header">
          <span className="card-title text-muted">Win Rate</span>
          <Percent size={16} className="card-icon text-muted" />
        </div>
        <div className="card-value number-display">
          {formatPercent(metrics.winRate)}
        </div>
        <div className="card-footer-info">
          <span className="text-success font-weight-bold">{metrics.winningTradesCount} W</span>
          <span className="footer-separator">/</span>
          <span className="text-danger font-weight-bold">{metrics.losingTradesCount} L</span>
        </div>
      </div>

      {/* 4. Largest Trades */}
      <div className="card summary-card largest-trades-card">
        <div className="card-header">
          <span className="card-title text-muted">Trade Extremes</span>
          <Target size={16} className="card-icon text-muted" />
        </div>
        <div className="extremes-wrapper">
          <div className="extreme-row">
            <span className="text-muted text-xs">Largest Win:</span>
            <span className="number-display text-success font-weight-bold">
              +{formatCurrency(metrics.largestWin)}
            </span>
          </div>
          <div className="extreme-row">
            <span className="text-muted text-xs">Largest Loss:</span>
            <span className="number-display text-danger font-weight-bold">
              {metrics.largestLoss < 0 ? '' : '-'}
              {formatCurrency(metrics.largestLoss)}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .account-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .summary-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 120px;
          border-radius: var(--border-radius-md);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .card-title {
          font-size: 0.725rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        
        .card-icon {
          flex-shrink: 0;
        }
        
        .card-value {
          font-size: 1.6rem;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }
        
        .card-footer-info {
          font-size: 0.75rem;
          display: flex;
          gap: 4px;
          align-items: center;
          color: var(--text-muted);
        }

        .text-muted-val {
          color: var(--text-main);
          font-weight: 500;
        }

        .number-highlight {
          color: var(--text-main);
          font-weight: 600;
        }

        .footer-separator {
          color: var(--border-color);
        }
        
        .extremes-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 2px;
        }
        
        .extreme-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .text-xs {
          font-size: 0.725rem;
        }

        @media (max-width: 600px) {
          .account-summary-grid {
            grid-template-columns: 1fr 1fr;
          }
          .largest-trades-card {
            grid-column: span 2;
          }
        }

        @media (max-width: 400px) {
          .account-summary-grid {
            grid-template-columns: 1fr;
          }
          .largest-trades-card {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};
