import React, { useState } from 'react';
import type { Trade } from '../utils/calculations';
import { PlusCircle, RotateCcw, Trash2 } from 'lucide-react';

interface TradeManagerProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onDeleteTrade: (id: string) => void;
  onResetTrades: () => void;
}

export const TradeManager: React.FC<TradeManagerProps> = ({
  trades,
  onAddTrade,
  onDeleteTrade,
  onResetTrades,
}) => {
  const [asset, setAsset] = useState('');
  const [type, setType] = useState<'Long' | 'Short'>('Long');
  const [pnlInput, setPnlInput] = useState('');
  const [isLosing, setIsLosing] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!asset.trim()) {
      setError('Specify asset (e.g. BTC).');
      return;
    }

    const numericPnl = parseFloat(pnlInput);
    if (isNaN(numericPnl) || numericPnl <= 0) {
      setError('Enter positive numeric amount.');
      return;
    }

    const finalPnl = isLosing ? -numericPnl : numericPnl;

    onAddTrade({
      asset: asset.toUpperCase().trim(),
      type,
      pnl: finalPnl,
    });

    setAsset('');
    setPnlInput('');
    setIsLosing(false);
  };

  return (
    <div className="card manager-card">
      <div className="manager-header">
        <div>
          <h3>Trade Book</h3>
          <p className="text-muted text-xs">Simulate or manage custom transactions</p>
        </div>
        <button className="btn-secondary reset-btn" onClick={onResetTrades} title="Restore initial 5 trades">
          <RotateCcw size={13} />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="manager-grid">
        {/* Form to Add New Trade */}
        <div className="form-container">
          <h4 className="section-title">Record Trade</h4>
          
          <form onSubmit={handleSubmit} className="trade-form">
            <div className="form-group">
              <label htmlFor="asset-input">Token Symbol</label>
              <input
                id="asset-input"
                type="text"
                placeholder="e.g. BTC"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                maxLength={8}
                autoComplete="off"
              />
            </div>

            <div className="form-group-row">
              <div className="form-group flex-1">
                <label htmlFor="type-select">Position</label>
                <select
                  id="type-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'Long' | 'Short')}
                >
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Outcome</label>
                <div className="toggle-outcome-buttons">
                  <button
                    type="button"
                    className={`outcome-toggle btn-win ${!isLosing ? 'active' : ''}`}
                    onClick={() => setIsLosing(false)}
                  >
                    Profit (+)
                  </button>
                  <button
                    type="button"
                    className={`outcome-toggle btn-loss ${isLosing ? 'active' : ''}`}
                    onClick={() => setIsLosing(true)}
                  >
                    Loss (-)
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pnl-input">Profit/Loss ($ USD)</label>
              <div className="pnl-input-wrapper">
                <span className={`pnl-sign ${isLosing ? 'text-danger' : 'text-success'}`}>
                  {isLosing ? '-' : '+'}
                </span>
                <input
                  id="pnl-input"
                  type="number"
                  placeholder="0"
                  value={pnlInput}
                  onChange={(e) => setPnlInput(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-primary submit-btn">
              <PlusCircle size={14} />
              <span>Record Trade</span>
            </button>
          </form>
        </div>

        {/* List of active trades */}
        <div className="log-container">
          <h4 className="section-title">Transactions ({trades.length})</h4>

          {trades.length === 0 ? (
            <div className="empty-state text-muted text-xs">
              No active trades recorded. Use the form to record custom trades.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="trades-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>P&L</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, idx) => (
                    <tr key={trade.id} className="trade-row">
                      <td className="number-display text-muted text-xs">{idx + 1}</td>
                      <td className="font-weight-bold">{trade.asset}</td>
                      <td>
                        <span className={`badge ${trade.type === 'Long' ? 'badge-long' : 'badge-short'}`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`number-display font-weight-bold ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {trade.pnl >= 0 ? '+' : ''}
                        {formatCurrency(trade.pnl)}
                      </td>
                      <td className="text-center">
                        <button
                          className="delete-action-btn"
                          onClick={() => onDeleteTrade(trade.id)}
                          title="Delete trade"
                          type="button"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .manager-card {
          margin-bottom: 0px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .manager-header h3 {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .text-xs {
          font-size: 0.725rem;
        }

        .manager-grid {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        /* Buttons styles (Clean, flat) */
        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .btn-primary {
          background: var(--color-primary);
          color: var(--text-inverse);
        }

        .btn-primary:hover {
          background: #4796ff;
        }

        .btn-secondary {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-main);
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
          background: #242d3d;
        }

        /* Form styles */
        .trade-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group-row {
          display: flex;
          gap: 10px;
        }

        .flex-1 {
          flex: 1;
        }

        label {
          font-size: 0.675rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
          font-weight: 600;
        }

        input[type="text"], input[type="number"], select {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 7px 10px;
          border-radius: var(--border-radius-sm);
          font-family: inherit;
          font-size: 0.8rem;
          transition: var(--transition-normal);
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .toggle-outcome-buttons {
          display: flex;
          background: var(--bg-tertiary);
          border-radius: var(--border-radius-sm);
          padding: 2px;
          border: 1px solid var(--border-color);
        }

        .outcome-toggle {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 5px;
          border-radius: 2px;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition-normal);
        }

        .outcome-toggle.active.btn-win {
          background: var(--color-success-bg);
          color: var(--color-success);
        }

        .outcome-toggle.active.btn-loss {
          background: var(--color-danger-bg);
          color: var(--color-danger);
        }

        .pnl-input-wrapper {
          display: flex;
          position: relative;
          align-items: center;
        }

        .pnl-sign {
          position: absolute;
          left: 10px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .pnl-input-wrapper input {
          width: 100%;
          padding-left: 22px;
        }

        .form-error {
          font-size: 0.725rem;
          color: var(--color-danger);
          background: var(--color-danger-bg);
          border: 1px solid rgba(248, 81, 73, 0.2);
          padding: 6px 10px;
          border-radius: var(--border-radius-sm);
        }

        .submit-btn {
          width: 100%;
        }

        /* Log table styles */
        .log-container {
          display: flex;
          flex-direction: column;
        }

        .empty-state {
          border: 1px dashed var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 2rem;
          text-align: center;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-wrapper {
          max-height: 220px;
          overflow-y: auto;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          background: var(--bg-tertiary);
        }

        .trades-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.775rem;
        }

        .trades-table th, .trades-table td {
          padding: 8px 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .trades-table th {
          background: var(--bg-primary);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .trade-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }

        .badge {
          display: inline-block;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 1px 4px;
          border-radius: 2px;
          letter-spacing: 0.025em;
        }

        .badge-long {
          background: rgba(56, 139, 253, 0.1);
          color: var(--color-primary);
          border: 1px solid rgba(56, 139, 253, 0.15);
        }

        .badge-short {
          background: rgba(139, 92, 246, 0.1);
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .delete-action-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-normal);
        }

        .delete-action-btn:hover {
          color: var(--color-danger);
          background: var(--color-danger-bg);
        }

        .text-center {
          text-align: center;
        }

        @media (max-width: 768px) {
          .manager-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
