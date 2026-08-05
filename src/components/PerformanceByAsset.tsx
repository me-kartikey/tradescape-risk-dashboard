import React from 'react';
import type { Trade } from '../utils/calculations';
import { Briefcase } from 'lucide-react';

interface PerformanceByAssetProps {
  trades: Trade[];
}

interface AssetStats {
  asset: string;
  totalTrades: number;
  wins: number;
  losses: number;
  netPnl: number;
}

export const PerformanceByAsset: React.FC<PerformanceByAssetProps> = ({ trades }) => {
  const getAssetStats = (): AssetStats[] => {
    const map: Record<string, AssetStats> = {};

    trades.forEach((trade) => {
      if (!map[trade.asset]) {
        map[trade.asset] = {
          asset: trade.asset,
          totalTrades: 0,
          wins: 0,
          losses: 0,
          netPnl: 0,
        };
      }

      const stats = map[trade.asset];
      stats.totalTrades++;
      stats.netPnl += trade.pnl;

      if (trade.pnl > 0) {
        stats.wins++;
      } else if (trade.pnl < 0) {
        stats.losses++;
      }
    });

    return Object.values(map).sort((a, b) => b.netPnl - a.netPnl);
  };

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

  const statsList = getAssetStats();

  return (
    <div className="card asset-card">
      <div className="asset-header">
        <Briefcase size={16} className="text-muted" />
        <h3>Performance by Asset</h3>
      </div>

      {statsList.length === 0 ? (
        <div className="empty-state text-muted text-xs">
          No trades logged to analyze asset distributions.
        </div>
      ) : (
        <div className="asset-grid">
          {statsList.map((stat) => {
            const winRate = stat.totalTrades > 0 ? (stat.wins / stat.totalTrades) * 100 : 0;
            return (
              <div key={stat.asset} className="asset-stat-box">
                <div className="asset-title-row">
                  <span className="asset-badge">{stat.asset}</span>
                  <span className={`number-display font-weight-bold ${stat.netPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    {stat.netPnl >= 0 ? '+' : ''}
                    {formatCurrency(stat.netPnl)}
                  </span>
                </div>
                <div className="asset-details-row">
                  <div className="asset-detail-col">
                    <span className="text-muted text-xxs">Trades</span>
                    <span className="number-display text-xs font-weight-bold">{stat.totalTrades}</span>
                  </div>
                  <div className="asset-detail-col">
                    <span className="text-muted text-xxs">Win Rate</span>
                    <span className="number-display text-xs font-weight-bold">{winRate.toFixed(0)}%</span>
                  </div>
                  <div className="asset-detail-col text-right">
                    <span className="text-muted text-xxs">Record</span>
                    <span className="number-display text-xxs text-muted">
                      {stat.wins}W - {stat.losses}L
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .asset-card {
          margin-bottom: 0px;
        }

        .asset-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.25rem;
        }

        .asset-header h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive horizontal layout grid */
        .asset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .asset-stat-box {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: var(--transition-normal);
        }

        .asset-stat-box:hover {
          border-color: var(--border-hover);
        }

        .asset-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .asset-badge {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 2px;
          letter-spacing: 0.05em;
        }

        .asset-details-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border-top: 1px solid var(--border-color);
          padding-top: 6px;
        }

        .asset-detail-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .text-xxs {
          font-size: 0.65rem;
        }

        .text-xs {
          font-size: 0.75rem;
        }

        .text-right {
          text-align: right;
        }
      `}</style>
    </div>
  );
};
