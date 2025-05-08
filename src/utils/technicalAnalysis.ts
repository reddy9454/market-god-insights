
import { StockData } from './dataHelpers';

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
        sum += data[i - j].close!;
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
  // Relative Strength Index calculation
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
      changes.push(data[i].close! - data[i - 1].close!);
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
  // Moving Average Convergence Divergence
  const closePrices = data.map(d => d.close || 0);
  
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
  for (let i = 0; i < period && i < data.length; i++) {
    sum += data[i] || 0;
  }
  ema.push(parseFloat((sum / period).toFixed(2)));
  
  // Calculate remaining EMAs
  for (let i = period; i < data.length; i++) {
    ema.push(parseFloat(((data[i] || 0) * multiplier + ema[ema.length - 1] * (1 - multiplier)).toFixed(2)));
  }
  
  return ema;
};

// Advanced technical indicators
export const calculateBollingerBands = (data: StockData[], period: number = 20, stdDev: number = 2): {
  upper: number[],
  middle: number[],
  lower: number[]
} => {
  const middle = calculateSMA(data, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  // Calculate standard deviation and Bollinger Bands
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    let count = 0;
    
    for (let j = 0; j < period; j++) {
      if (data[i - j] && typeof data[i - j].close === 'number') {
        const diff = data[i - j].close! - middle[i - period + 1];
        sum += diff * diff;
        count++;
      }
    }
    
    const stdDeviation = Math.sqrt(sum / (count > 0 ? count : 1));
    upper.push(parseFloat((middle[i - period + 1] + (stdDev * stdDeviation)).toFixed(2)));
    lower.push(parseFloat((middle[i - period + 1] - (stdDev * stdDeviation)).toFixed(2)));
  }
  
  return { upper, middle, lower };
};

// Volume analysis
export const calculateVolumeProfile = (data: StockData[], priceLevels: number = 10): {
  price: number,
  volume: number
}[] => {
  // Extract valid price and volume data
  const validData = data.filter(d => 
    typeof d.close === 'number' && typeof d.volume === 'number' && d.volume > 0
  );
  
  if (validData.length === 0) return [];
  
  // Find min and max price
  const prices = validData.map(d => d.close!);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  const priceStep = (maxPrice - minPrice) / priceLevels;
  const volumeProfile: {price: number, volume: number}[] = [];
  
  // Create price levels
  for (let i = 0; i < priceLevels; i++) {
    const lowerBound = minPrice + (priceStep * i);
    const upperBound = minPrice + (priceStep * (i + 1));
    const midPrice = (lowerBound + upperBound) / 2;
    
    // Sum volume at this price level
    const volumeAtPrice = validData.reduce((sum, d) => {
      if (d.close! >= lowerBound && d.close! < upperBound) {
        return sum + (d.volume || 0);
      }
      return sum;
    }, 0);
    
    volumeProfile.push({
      price: parseFloat(midPrice.toFixed(2)),
      volume: volumeAtPrice
    });
  }
  
  return volumeProfile;
};
