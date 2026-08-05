import React from 'react';
import type { CalculatedMetrics } from '../utils/calculations';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RiskIndicatorProps {
  metrics: CalculatedMetrics;
  maxDrawdownLimit: number;
  dailyLossLimit: number;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  metrics,
  maxDrawdownLimit,
  dailyLossLimit,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusIcon = () => {
    switch (metrics.riskStatus) {
      case 'Safe':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'Approaching Limit':
        return <AlertCircle size={16} className="text-warning" />;
      case 'At Risk':
        return <ShieldAlert size={16} className="text-danger" />;
    }
  };

  const getStatusClass = () => {
    switch (metrics.riskStatus) {
      case 'Safe':
        return 'status-safe';
      case 'Approaching Limit':
        return 'status-warning';
      case 'At Risk':
        return 'status-danger';
    }
  };

  const getStatusDescription = () => {
    switch (metrics.riskStatus) {
      case 'Safe':
        return 'Risk parameters are normal. Trading boundaries are well maintained.';
      case 'Approaching Limit':
        return 'Warning: Drawdown or daily loss limits are approaching thresholds.';
      case 'At Risk':
        return 'Breach warning: Account limits have been exceeded or are fully utilized.';
    }
  };

  const drawdownPct = Math.min(100, (metrics.currentDrawdown / maxDrawdownLimit) * 100);
  const dailyLossPct = Math.min(100, (metrics.currentDayLoss / dailyLossLimit) * 100);

  return (
    <div className="card risk-card">
      {/* Top Banner Status (High Prominence, Muted Colors) */}
      <div className={`risk-banner ${getStatusClass()}`}>
        <div className="banner-left">
          {getStatusIcon()}
          <div>
            <span className="banner-title">
              RISK STATE: {metrics.riskStatus.toUpperCase()}
            </span>
            <p className="banner-desc">{getStatusDescription()}</p>
          </div>
        </div>
      </div>

      <div className="risk-metrics-layout">
        {/* Maximum Drawdown Section */}
        <div className="risk-metric-row">
          <div className="metric-header">
            <div className="metric-info">
              <span className="metric-label">Max Drawdown Check</span>
              <div className="metric-main-val number-display">
                {formatCurrency(metrics.currentDrawdown)}
                <span className="metric-limit"> / {formatCurrency(maxDrawdownLimit)}</span>
              </div>
            </div>
            <div className="metric-remaining text-right">
              <span className="metric-label">Remaining Buffer</span>
              <div className="metric-buffer-val number-display font-weight-bold">
                {formatCurrency(metrics.remainingDrawdown)}
              </div>
            </div>
          </div>

          {/* Clean Flat Progress Bar */}
          <div className="progress-bar-track">
            <div 
              className={`progress-bar-fill ${drawdownPct > 70 ? 'bg-danger' : drawdownPct > 40 ? 'bg-warning' : 'bg-primary'}`}
              style={{ width: `${drawdownPct}%` }}
            ></div>
          </div>
          
          <div className="metric-footer">
            <span>Peak Balance reached: {formatCurrency(metrics.peakBalance)}</span>
            <span>{drawdownPct.toFixed(0)}% utilized</span>
          </div>
        </div>

        {/* Daily Loss Section */}
        <div className="risk-metric-row">
          <div className="metric-header">
            <div className="metric-info">
              <span className="metric-label">Daily Loss Check</span>
              <div className="metric-main-val number-display">
                {formatCurrency(metrics.currentDayLoss)}
                <span className="metric-limit"> / {formatCurrency(dailyLossLimit)}</span>
              </div>
            </div>
            <div className="metric-remaining text-right">
              <span className="metric-label">Remaining Buffer</span>
              <div className="metric-buffer-val number-display font-weight-bold">
                {formatCurrency(metrics.remainingDailyLossLimit)}
              </div>
            </div>
          </div>

          {/* Clean Flat Progress Bar */}
          <div className="progress-bar-track">
            <div 
              className={`progress-bar-fill ${dailyLossPct > 70 ? 'bg-danger' : dailyLossPct > 40 ? 'bg-warning' : 'bg-primary'}`}
              style={{ width: `${dailyLossPct}%` }}
            ></div>
          </div>

          <div className="metric-footer">
            <span>Daily Limit: {formatCurrency(dailyLossLimit)}</span>
            <span>{dailyLossPct.toFixed(0)}% utilized</span>
          </div>
        </div>
      </div>

      <style>{`
        .risk-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Prominent Status Banner */
        .risk-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
        }

        .banner-left {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .banner-left svg {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .banner-title {
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          display: block;
        }

        .banner-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
          margin-top: 1px;
          line-height: 1.35;
        }

        /* Banner Status Colors (Muted, Flat border/bg) */
        .status-safe {
          border-color: rgba(87, 171, 90, 0.2);
          background: rgba(87, 171, 90, 0.05);
          color: var(--color-success);
        }

        .status-warning {
          border-color: rgba(198, 144, 38, 0.2);
          background: rgba(198, 144, 38, 0.05);
          color: var(--color-warning);
        }

        .status-danger {
          border-color: rgba(248, 81, 73, 0.2);
          background: rgba(248, 81, 73, 0.05);
          color: var(--color-danger);
        }

        /* Layout Grid */
        .risk-metrics-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .risk-metric-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .metric-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          display: block;
          margin-bottom: 1px;
        }

        .metric-main-val {
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .metric-limit {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: normal;
        }

        .metric-buffer-val {
          font-size: 1.15rem;
        }

        .status-safe .metric-buffer-val { color: var(--color-success); }
        .status-warning .metric-buffer-val { color: var(--color-warning); }
        .status-danger .metric-buffer-val { color: var(--color-danger); }

        /* Progress Bar Track and Fills */
        .progress-bar-track {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 1px;
          overflow: hidden;
          width: 100%;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 1px;
          transition: width 0.3s ease;
        }

        .bg-primary {
          background-color: var(--color-primary);
        }

        .bg-warning {
          background-color: var(--color-warning);
        }

        .bg-danger {
          background-color: var(--color-danger);
        }

        .metric-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .text-right {
          text-align: right;
        }
      `}</style>
    </div>
  );
};
