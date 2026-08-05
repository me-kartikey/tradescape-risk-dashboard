import React, { useState } from 'react';
import type { EquityPoint } from '../utils/calculations';
import { AreaChart, TrendingUp } from 'lucide-react';

interface EquityChartProps {
  history: EquityPoint[];
}

export const EquityChart: React.FC<EquityChartProps> = ({ history }) => {
  const [hoveredPoint, setHoveredPoint] = useState<EquityPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  if (history.length === 0) return null;

  // Chart dimension definitions
  const width = 600;
  const height = 240;
  const paddingLeft = 65;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Auto scaling Y-Axis
  const balances = history.map((pt) => pt.balance);
  let minBal = Math.min(...balances);
  let maxBal = Math.max(...balances);

  // Buffer so chart doesn't touch edges
  const diff = maxBal - minBal;
  const buffer = Math.max(1000, diff * 0.15);
  minBal = minBal - buffer;
  maxBal = maxBal + buffer;

  // If completely flat, set default scale
  if (minBal === maxBal) {
    minBal = minBal - 5000;
    maxBal = maxBal + 5000;
  }

  // Helper functions to map data coordinates to SVG space
  const getX = (index: number) => {
    if (history.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (history.length - 1)) * chartWidth;
  };

  const getY = (balance: number) => {
    const pct = (balance - minBal) / (maxBal - minBal);
    return paddingTop + chartHeight - pct * chartHeight;
  };

  // Generate SVG paths
  let linePath = '';
  let areaPath = '';

  history.forEach((pt, i) => {
    const x = getX(i);
    const y = getY(pt.balance);
    if (i === 0) {
      linePath = `M ${x} ${y}`;
      areaPath = `M ${x} ${paddingTop + chartHeight} L ${x} ${y}`;
    } else {
      linePath += ` L ${x} ${y}`;
      areaPath += ` L ${x} ${y}`;
    }

    if (i === history.length - 1) {
      areaPath += ` L ${x} ${paddingTop + chartHeight} Z`;
    }
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate Y-axis gridlines (4 ticks)
  const ticks = 4;
  const gridTicks = Array.from({ length: ticks }).map((_, i) => {
    const val = minBal + (i / (ticks - 1)) * (maxBal - minBal);
    return val;
  });

  const handlePointHover = (pt: EquityPoint, e: React.MouseEvent<SVGCircleElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgEl = e.currentTarget.ownerSVGElement;
    if (svgEl) {
      const svgRect = svgEl.getBoundingClientRect();
      const x = rect.left - svgRect.left + rect.width / 2;
      const y = rect.top - svgRect.top - 80;
      setTooltipPos({ x, y });
    }
    setHoveredPoint(pt);
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div className="chart-header-title">
          <AreaChart size={16} className="text-muted" />
          <h3>Account Equity Curve</h3>
        </div>
        <div className="chart-metric text-muted">
          <TrendingUp size={14} style={{ marginRight: '4px' }} />
          <span>Balance History</span>
        </div>
      </div>

      <div className="svg-container">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="equity-svg" 
          width="100%" 
          height="100%"
        >
          <defs>
            {/* Minimalist gradient under line */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridTicks.map((val, i) => {
            const y = getY(val);
            return (
              <g key={i} className="grid-group">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  className="grid-line" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3} 
                  className="grid-label" 
                  textAnchor="end"
                >
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Start line indicator (X axis bottom boundary) */}
          <line 
            x1={paddingLeft} 
            y1={paddingTop + chartHeight} 
            x2={width - paddingRight} 
            y2={paddingTop + chartHeight} 
            className="grid-line-axis" 
          />

          {/* Area Path */}
          {history.length > 1 && (
            <path d={areaPath} fill="url(#areaGrad)" />
          )}

          {/* Line Path */}
          {history.length > 1 && (
            <path d={linePath} fill="none" className="line-path" />
          )}

          {/* Interactive circles */}
          {history.map((pt, i) => {
            const x = getX(i);
            const y = getY(pt.balance);
            const isHovered = hoveredPoint?.index === pt.index;

            return (
              <circle
                key={pt.index}
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3.5}
                className={`chart-dot ${isHovered ? 'dot-hovered' : ''}`}
                onMouseEnter={(e) => handlePointHover(pt, e)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* X-axis labels */}
          <text 
            x={getX(0)} 
            y={height - 8} 
            className="axis-label" 
            textAnchor="middle"
          >
            Start
          </text>
          {history.length > 2 && (
            <text 
              x={getX(Math.floor((history.length - 1) / 2))} 
              y={height - 8} 
              className="axis-label" 
              textAnchor="middle"
            >
              Mid
            </text>
          )}
          {history.length > 1 && (
            <text 
              x={getX(history.length - 1)} 
              y={height - 8} 
              className="axis-label" 
              textAnchor="middle"
            >
              Current
            </text>
          )}
        </svg>

        {/* Floating Tooltip (Flat, clean, premium style) */}
        {hoveredPoint && (
          <div 
            className="chart-tooltip" 
            style={{ 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y}px` 
            }}
          >
            <div className="tooltip-title">{hoveredPoint.tradeName}</div>
            <div className="tooltip-row">
              <span className="tooltip-label">Balance:</span>
              <span className="number-display tooltip-value">{formatCurrency(hoveredPoint.balance)}</span>
            </div>
            {hoveredPoint.index > 0 && (
              <div className="tooltip-row">
                <span className="tooltip-label">P&L:</span>
                <span className={`number-display tooltip-value ${hoveredPoint.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                  {hoveredPoint.pnl >= 0 ? '+' : ''}
                  {formatCurrency(hoveredPoint.pnl)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .chart-card {
          margin-bottom: 0px; /* layout handle margin */
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .chart-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-header-title h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .chart-metric {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .svg-container {
          position: relative;
          width: 100%;
          overflow: visible;
        }

        .equity-svg {
          overflow: visible;
        }

        .grid-line {
          stroke: rgba(255, 255, 255, 0.04);
          stroke-width: 1;
        }

        .grid-line-axis {
          stroke: var(--border-color);
          stroke-width: 1;
        }

        .grid-label {
          font-size: 0.625rem;
          font-family: var(--font-mono);
          fill: var(--text-muted);
        }

        .axis-label {
          font-size: 0.65rem;
          fill: var(--text-muted);
        }

        .line-path {
          stroke: var(--color-primary);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .chart-dot {
          fill: var(--bg-secondary);
          stroke: var(--color-primary);
          stroke-width: 1.5;
          cursor: pointer;
          transition: r 0.15s ease, fill 0.15s ease;
        }

        .chart-dot:hover {
          fill: var(--color-primary);
          r: 5px;
        }

        .dot-hovered {
          fill: var(--color-primary);
          stroke-width: 2;
        }

        /* Floating Tooltip (Flat GitHub/Linear style) */
        .chart-tooltip {
          position: absolute;
          padding: 6px 10px;
          border-radius: var(--border-radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          z-index: 100;
          pointer-events: none;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 120px;
        }

        .tooltip-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: 0.025em;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 2px;
          margin-bottom: 2px;
        }

        .tooltip-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          align-items: center;
        }

        .tooltip-label {
          color: var(--text-muted);
        }

        .tooltip-value {
          color: var(--text-main);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
