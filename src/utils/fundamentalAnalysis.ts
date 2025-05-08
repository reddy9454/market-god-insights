
// Fundamental Analysis Utilities

export interface FundamentalData {
  pe: number;
  eps: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  profitMargin: number;
  dividendYield: number;
}

export const calculateFundamentalScores = (data: FundamentalData): {
  valueScore: number;
  growthScore: number;
  stabilityScore: number;
  overallScore: number;
} => {
  // These are simplified scoring mechanisms for demo purposes
  // In a real app, you'd have more sophisticated analysis
  
  const valueScore = calculateValueScore(data);
  const growthScore = calculateGrowthScore(data);
  const stabilityScore = calculateStabilityScore(data);
  
  const overallScore = (valueScore + growthScore + stabilityScore) / 3;
  
  return {
    valueScore: parseFloat(valueScore.toFixed(1)),
    growthScore: parseFloat(growthScore.toFixed(1)),
    stabilityScore: parseFloat(stabilityScore.toFixed(1)),
    overallScore: parseFloat(overallScore.toFixed(1))
  };
};

const calculateValueScore = (data: FundamentalData): number => {
  // Sample value scoring (0-10 scale)
  let score = 5; // Neutral starting point
  
  // PE ratio scoring (lower is better for value)
  if (data.pe < 10) score += 2;
  else if (data.pe < 15) score += 1;
  else if (data.pe > 30) score -= 1;
  else if (data.pe > 50) score -= 2;
  
  // EPS scoring (higher is better)
  if (data.eps > 5) score += 1;
  if (data.eps > 10) score += 0.5;
  
  // Dividend yield scoring
  if (data.dividendYield > 0.05) score += 1.5;
  else if (data.dividendYield > 0.03) score += 1;
  else if (data.dividendYield > 0.01) score += 0.5;
  
  return Math.max(0, Math.min(10, score));
};

const calculateGrowthScore = (data: FundamentalData): number => {
  // Sample growth scoring (0-10 scale)
  let score = 5; // Neutral starting point
  
  // ROE scoring (higher is better for growth)
  if (data.roe > 0.20) score += 2;
  else if (data.roe > 0.15) score += 1.5;
  else if (data.roe > 0.10) score += 1;
  else if (data.roe < 0.05) score -= 1;
  
  // Profit margin scoring
  if (data.profitMargin > 0.20) score += 2;
  else if (data.profitMargin > 0.10) score += 1;
  else if (data.profitMargin < 0.05) score -= 0.5;
  else if (data.profitMargin < 0) score -= 1.5;
  
  return Math.max(0, Math.min(10, score));
};

const calculateStabilityScore = (data: FundamentalData): number => {
  // Sample stability scoring (0-10 scale)
  let score = 5; // Neutral starting point
  
  // Debt-to-Equity scoring (lower is better for stability)
  if (data.debtToEquity < 0.3) score += 2;
  else if (data.debtToEquity < 0.5) score += 1;
  else if (data.debtToEquity > 1.0) score -= 1;
  else if (data.debtToEquity > 1.5) score -= 2;
  
  // Current ratio scoring (higher is better for stability)
  if (data.currentRatio > 2) score += 1.5;
  else if (data.currentRatio > 1.5) score += 1;
  else if (data.currentRatio < 1) score -= 1;
  
  // Quick ratio scoring
  if (data.quickRatio > 1.5) score += 1.5;
  else if (data.quickRatio > 1) score += 1;
  else if (data.quickRatio < 0.7) score -= 1;
  
  return Math.max(0, Math.min(10, score));
};

// Additional fundamental analysis utilities
export const calculateIntrinsicValue = (data: FundamentalData, growthRate: number = 0.07, discountRate: number = 0.09): number => {
  // A simple DCF-based intrinsic value calculation
  const projectionYears = 10;
  const terminalMultiple = 15;
  
  // Project future EPS
  let presentValue = 0;
  for (let year = 1; year <= projectionYears; year++) {
    const projectedEPS = data.eps * Math.pow(1 + growthRate, year);
    const discountedEPS = projectedEPS / Math.pow(1 + discountRate, year);
    presentValue += discountedEPS;
  }
  
  // Terminal value calculation
  const terminalEPS = data.eps * Math.pow(1 + growthRate, projectionYears);
  const terminalValue = terminalEPS * terminalMultiple;
  const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);
  
  // Intrinsic value is the sum of discounted cash flows plus terminal value
  return parseFloat((presentValue + discountedTerminalValue).toFixed(2));
};

// Dividend analysis
export const analyzeDividendGrowth = (history: {year: number, dividend: number}[]): {
  growthRate: number,
  sustainableRate: number,
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
} => {
  if (!history || history.length < 2) {
    return {
      growthRate: 0,
      sustainableRate: 0,
      rating: 'Poor'
    };
  }
  
  // Calculate average annual growth rate
  const years = history.length - 1;
  const initialDividend = history[0].dividend;
  const finalDividend = history[history.length - 1].dividend;
  
  if (initialDividend <= 0) {
    return {
      growthRate: 0,
      sustainableRate: 0,
      rating: 'Poor'
    };
  }
  
  // CAGR formula
  const growthRate = Math.pow(finalDividend / initialDividend, 1 / years) - 1;
  
  // Estimate sustainable dividend rate (simplified)
  let sustainableRate = growthRate;
  if (growthRate > 0.15) {
    sustainableRate = 0.15; // Cap at reasonable long-term growth
  }
  
  // Rate the dividend growth
  let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  if (growthRate > 0.08) rating = 'Excellent';
  else if (growthRate > 0.05) rating = 'Good';
  else if (growthRate > 0.02) rating = 'Fair';
  else rating = 'Poor';
  
  return {
    growthRate: parseFloat(growthRate.toFixed(4)),
    sustainableRate: parseFloat(sustainableRate.toFixed(4)),
    rating
  };
};
