// Mock utility functions for stock analysis
// In a real application, these would contain actual analysis logic

export interface StockData {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number; // Changed from required to optional
  volume?: number;
  sentiment?: number; // Added to support sentiment data
  confidence?: number; // Added to support confidence data
  keywords?: string[]; // Added to support keywords
}

export interface StockInfo {
  stockName: string;
  ticker: string;
  data: StockData[];
}

// Technical Analysis Utils
export const calculateSMA = (data: StockData[], period: number): number[] => {
  // Simple Moving Average calculation
  const sma: number[] = [];
  
  if (!data || data.length < period) {
    return sma;
  }
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    let validPoints = 0;
    
    for (let j = 0; j < period; j++) {
      if (data[i - j] && typeof data[i - j].close === 'number') {
        sum += data[i - j].close;
        validPoints++;
      }
    }
    
    if (validPoints > 0) {
      sma.push(parseFloat((sum / validPoints).toFixed(2)));
    }
  }
  
  return sma;
};

export const calculateRSI = (data: StockData[], period: number = 14): number[] => {
  // Relative Strength Index calculation (simplified for demo)
  const rsi: number[] = [];
  const changes: number[] = [];
  
  if (!data || data.length <= period) {
    return rsi;
  }
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    if (data[i] && data[i-1] && 
        typeof data[i].close === 'number' && 
        typeof data[i-1].close === 'number') {
      changes.push(data[i].close - data[i - 1].close);
    } else {
      changes.push(0); // Default for invalid data
    }
  }
  
  // Calculate RSI for each point after the period
  for (let i = period; i <= changes.length; i++) {
    const changesSlice = changes.slice(i - period, i);
    const gains = changesSlice.filter(change => change > 0);
    const losses = changesSlice.filter(change => change < 0).map(loss => Math.abs(loss));
    
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
    }
  }
  
  return rsi;
};

export const calculateMACD = (data: StockData[]): {macd: number[], signal: number[], histogram: number[]} => {
  // Moving Average Convergence Divergence (simplified for demo)
  const closePrices = data.map(d => d.close);
  
  // Calculate EMAs
  const ema12 = calculateEMA(closePrices, 12);
  const ema26 = calculateEMA(closePrices, 26);
  
  // Calculate MACD Line
  const macd: number[] = [];
  for (let i = 0; i < ema12.length; i++) {
    if (i >= ema26.length - ema12.length) {
      macd.push(parseFloat((ema12[i] - ema26[i + (ema26.length - ema12.length)]).toFixed(2)));
    }
  }
  
  // Calculate Signal Line (9-period EMA of MACD Line)
  const signal = calculateEMA(macd, 9);
  
  // Calculate Histogram
  const histogram: number[] = [];
  for (let i = 0; i < signal.length; i++) {
    histogram.push(parseFloat((macd[i + (macd.length - signal.length)] - signal[i]).toFixed(2)));
  }
  
  return { macd, signal, histogram };
};

export const calculateEMA = (data: number[], period: number): number[] => {
  // Exponential Moving Average calculation
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  ema.push(parseFloat((sum / period).toFixed(2)));
  
  // Calculate remaining EMAs
  for (let i = period; i < data.length; i++) {
    ema.push(parseFloat((data[i] * multiplier + ema[ema.length - 1] * (1 - multiplier)).toFixed(2)));
  }
  
  return ema;
};

// Fundamental Analysis Utils
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

// Investment recommendation engine
export const generateRecommendation = (
  technicalData: StockData[], 
  fundamentalData: FundamentalData
): {
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  confidence: number;
  positivePoints: string[];
  negativePoints: string[];
  summary: string;
} => {
  // Check for valid input data
  if (!technicalData || technicalData.length === 0 || !fundamentalData) {
    return {
      recommendation: 'HOLD',
      confidence: 0.5,
      positivePoints: [],
      negativePoints: ['Insufficient data for analysis'],
      summary: 'Unable to analyze due to insufficient data.'
    };
  }

  try {
    // Calculate scores
    const { overallScore } = calculateFundamentalScores(fundamentalData);
    
    // Calculate recent price trend (last 20 days or less if not enough data)
    const dataLength = technicalData.length;
    const periodLength = Math.min(20, dataLength);
    const recentData = technicalData.slice(-periodLength);
    
    // Safely calculate price change with checks for undefined/null values
    let priceChange = 0;
    if (recentData.length >= 2 && 
        typeof recentData[recentData.length-1]?.close === 'number' && 
        typeof recentData[0]?.close === 'number' && 
        recentData[0].close !== 0) {
      priceChange = ((recentData[recentData.length-1].close / recentData[0].close) - 1) * 100;
    }
    
    // Safely calculate RSI
    let rsi = 50; // default neutral value
    const rsiValues = calculateRSI(technicalData);
    if (rsiValues.length > 0) {
      rsi = rsiValues[rsiValues.length - 1];
    }
    
    // Generate recommendation based on scores and technical indicators
    let recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL' = 'HOLD';
    let confidence = 0.5;
    const positivePoints: string[] = [];
    const negativePoints: string[] = [];
    
    // Fundamental analysis factors
    if (overallScore > 7) {
      positivePoints.push("Strong fundamental indicators");
      confidence += 0.1;
    } else if (overallScore > 5) {
      positivePoints.push("Decent fundamental health");
      confidence += 0.05;
    } else if (overallScore < 4) {
      negativePoints.push("Weak fundamental indicators");
      confidence -= 0.1;
    }
    
    if (fundamentalData.pe < 15 && fundamentalData.pe > 0) {
      positivePoints.push(`Attractive P/E ratio of ${fundamentalData.pe}`);
      confidence += 0.05;
    } else if (fundamentalData.pe > 30) {
      negativePoints.push(`High P/E ratio of ${fundamentalData.pe}`);
      confidence -= 0.05;
    }
    
    if (fundamentalData.debtToEquity < 0.5) {
      positivePoints.push("Low debt-to-equity ratio");
      confidence += 0.05;
    } else if (fundamentalData.debtToEquity > 1.2) {
      negativePoints.push("High debt-to-equity ratio");
      confidence -= 0.05;
    }
    
    if (fundamentalData.dividendYield > 0.04) {
      positivePoints.push(`Strong dividend yield of ${(fundamentalData.dividendYield * 100).toFixed(2)}%`);
      confidence += 0.05;
    }
    
    // Technical analysis factors - safely check each calculation
    if (priceChange > 10) {
      positivePoints.push(`Strong recent uptrend (${priceChange.toFixed(2)}% in ${periodLength} days)`);
      confidence += 0.1;
    } else if (priceChange > 5) {
      positivePoints.push(`Positive price momentum (${priceChange.toFixed(2)}% in ${periodLength} days)`);
      confidence += 0.05;
    } else if (priceChange < -10) {
      negativePoints.push(`Sharp recent decline (${priceChange.toFixed(2)}% in ${periodLength} days)`);
      confidence -= 0.1;
    } else if (priceChange < -5) {
      negativePoints.push(`Negative price action (${priceChange.toFixed(2)}% in ${periodLength} days)`);
      confidence -= 0.05;
    }
    
    if (rsi > 70) {
      negativePoints.push(`Overbought conditions (RSI: ${rsi.toFixed(1)})`);
      confidence -= 0.1;
    } else if (rsi < 30) {
      positivePoints.push(`Oversold conditions (RSI: ${rsi.toFixed(1)})`);
      confidence += 0.1;
    }
    
    // Determine final recommendation
    const score = overallScore / 10 + (priceChange / 100) - (rsi > 70 ? 0.2 : 0) + (rsi < 30 ? 0.2 : 0);
    
    if (score > 0.8) recommendation = 'STRONG BUY';
    else if (score > 0.3) recommendation = 'BUY';
    else if (score < -0.8) recommendation = 'STRONG SELL';
    else if (score < -0.3) recommendation = 'SELL';
    else recommendation = 'HOLD';
    
    // Ensure confidence is between 0.3 and 0.9
    confidence = Math.max(0.3, Math.min(0.9, confidence));
    
    // Generate summary
    let summary = `Based on ${positivePoints.length} positive and ${negativePoints.length} negative factors, `;
    summary += `we ${recommendation.toLowerCase()} this stock with ${(confidence * 100).toFixed(0)}% confidence.`;
    
    return {
      recommendation,
      confidence,
      positivePoints,
      negativePoints,
      summary
    };
  } catch (error) {
    console.error("Error in generateRecommendation:", error);
    return {
      recommendation: 'HOLD',
      confidence: 0.5,
      positivePoints: [],
      negativePoints: ['Error during analysis'],
      summary: 'An error occurred while analyzing the data.'
    };
  }
};

// Add a safety utility to ensure data has close property when needed
export const ensureValidData = (data: StockData[]): StockData[] => {
  return data.map(item => {
    // If the item doesn't have a close property but has a sentiment property,
    // use the sentiment as the close value for chart display
    if (item.close === undefined && item.sentiment !== undefined) {
      return {
        ...item,
        close: item.sentiment
      };
    }
    // Fallback value if neither close nor sentiment exists
    if (item.close === undefined) {
      return {
        ...item,
        close: 0
      };
    }
    return item;
  });
};
