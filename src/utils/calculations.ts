// Financial math calculations for Trader Risk Dashboard

export interface Trade {
  id: string;
  asset: string;
  type: 'Long' | 'Short';
  pnl: number;
}

export interface EquityPoint {
  index: number;
  tradeName: string;
  pnl: number;
  balance: number;
  peak: number;
  drawdown: number;
}

export interface CalculatedMetrics {
  startingBalance: number;
  currentBalance: number;
  totalPnl: number;
  winRate: number;
  winningTradesCount: number;
  losingTradesCount: number;
  totalTradesCount: number;
  largestWin: number;
  largestLoss: number;
  peakBalance: number;
  currentDrawdown: number;
  maxDrawdown: number;
  remainingDrawdown: number;
  currentDayLoss: number;
  remainingDailyLossLimit: number;
  riskStatus: 'Safe' | 'Approaching Limit' | 'At Risk';
  equityHistory: EquityPoint[];
}

/**
 * Calculates trading performance metrics and risk indicator limits
 * 
 * @param trades Array of trades in chronological order
 * @param startingBalance Starting balance (default: $100,000)
 * @param maxDrawdownLimit Limit for maximum drawdown (default: $10,000)
 * @param dailyLossLimit Limit for daily losses (default: $5,000)
 */
export function calculateMetrics(
  trades: Trade[],
  startingBalance: number = 100000,
  maxDrawdownLimit: number = 10000,
  dailyLossLimit: number = 5000
): CalculatedMetrics {
  const totalTradesCount = trades.length;

  // 1. Core performance stats
  let winningTradesCount = 0;
  let losingTradesCount = 0;
  let totalPnl = 0;
  let largestWin = 0;
  let largestLoss = 0;

  // 2. Track chronological balance and drawdowns
  const equityHistory: EquityPoint[] = [
    {
      index: 0,
      tradeName: 'Start',
      pnl: 0,
      balance: startingBalance,
      peak: startingBalance,
      drawdown: 0,
    },
  ];

  let runningBalance = startingBalance;
  let runningPeak = startingBalance;
  let maxDrawdown = 0;

  // Process trades in order to construct the equity curve and drawdown metrics
  trades.forEach((trade, i) => {
    // Basic trade counts and P&L
    totalPnl += trade.pnl;
    runningBalance += trade.pnl;

    if (trade.pnl > 0) {
      winningTradesCount++;
      if (trade.pnl > largestWin) {
        largestWin = trade.pnl;
      }
    } else if (trade.pnl < 0) {
      losingTradesCount++;
      if (trade.pnl < largestLoss) {
        largestLoss = trade.pnl; // Note: keeping as negative representation, e.g. -450
      }
    }

    // Peak balance tracking
    if (runningBalance > runningPeak) {
      runningPeak = runningBalance;
    }

    // Drawdown calculation at this point: drop from the running peak
    const currentDd = runningPeak - runningBalance;
    if (currentDd > maxDrawdown) {
      maxDrawdown = currentDd;
    }

    equityHistory.push({
      index: i + 1,
      tradeName: `${trade.asset} ${trade.type}`,
      pnl: trade.pnl,
      balance: runningBalance,
      peak: runningPeak,
      drawdown: currentDd,
    });
  });

  const currentBalance = startingBalance + totalPnl;
  const winRate = totalTradesCount > 0 ? (winningTradesCount / totalTradesCount) * 100 : 0;

  // 3. Drawdown metrics at current final state
  const currentDrawdown = runningPeak - currentBalance;
  const remainingDrawdown = Math.max(0, maxDrawdownLimit - currentDrawdown);

  // 4. Daily Loss Calculation (Sum of all losing trades only, per user definition)
  const currentDayLoss = trades
    .filter((t) => t.pnl < 0)
    .reduce((sum, t) => sum + Math.abs(t.pnl), 0);

  const remainingDailyLossLimit = Math.max(0, dailyLossLimit - currentDayLoss);

  // 5. Risk Indicator status
  // Approaching Limit threshold: remaining limit is less than or equal to 30% of the maximum limit
  const drawdownThreshold = maxDrawdownLimit * 0.3;
  const dailyLossThreshold = dailyLossLimit * 0.3;

  let riskStatus: 'Safe' | 'Approaching Limit' | 'At Risk' = 'Safe';

  if (remainingDrawdown <= 0 || remainingDailyLossLimit <= 0) {
    riskStatus = 'At Risk';
  } else if (
    remainingDrawdown <= drawdownThreshold ||
    remainingDailyLossLimit <= dailyLossThreshold
  ) {
    riskStatus = 'Approaching Limit';
  }

  return {
    startingBalance,
    currentBalance,
    totalPnl,
    winRate,
    winningTradesCount,
    losingTradesCount,
    totalTradesCount,
    largestWin,
    largestLoss,
    peakBalance: runningPeak,
    currentDrawdown,
    maxDrawdown,
    remainingDrawdown,
    currentDayLoss,
    remainingDailyLossLimit,
    riskStatus,
    equityHistory,
  };
}
