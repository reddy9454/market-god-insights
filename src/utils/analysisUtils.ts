
// Import all necessary types from their respective modules
import { StockData } from './dataHelpers';
import { FundamentalData } from './fundamentalAnalysis';

// Re-export the interfaces explicitly so they can be imported from analysisUtils
export type { StockData } from './dataHelpers';
export type { FundamentalData } from './fundamentalAnalysis';

// Re-export the functions that are needed from other modules
export { calculateSMA, calculateRSI, calculateMACD, calculateBollingerBands } from './technicalAnalysis';
export { calculateFundamentalScores } from './fundamentalAnalysis';

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
    // Import calculation functions from other modules
    const { calculateRSI } = require('./technicalAnalysis');
    const { calculateFundamentalScores } = require('./fundamentalAnalysis');
    
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
      priceChange = ((recentData[recentData.length-1].close! / recentData[0].close!) - 1) * 100;
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

// Added: Advanced sentiment analysis utility for document analysis
export const analyzeSentiment = (data: StockData[]): {
  overallSentiment: number;
  trend: 'improving' | 'declining' | 'stable';
  keyInsights: string[];
} => {
  if (!data || data.length === 0 || !data.some(d => d.sentiment !== undefined)) {
    return {
      overallSentiment: 0.5,
      trend: 'stable',
      keyInsights: ['Insufficient sentiment data for analysis']
    };
  }

  try {
    // Filter valid sentiment data
    const sentimentData = data
      .filter(d => d.sentiment !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (sentimentData.length === 0) {
      return {
        overallSentiment: 0.5,
        trend: 'stable',
        keyInsights: ['No valid sentiment data found']
      };
    }
    
    // Calculate overall sentiment
    const totalSentiment = sentimentData.reduce((sum, item) => sum + (item.sentiment || 0), 0);
    const overallSentiment = totalSentiment / sentimentData.length;
    
    // Calculate trend
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (sentimentData.length >= 3) {
      const firstHalf = sentimentData.slice(0, Math.floor(sentimentData.length / 2));
      const secondHalf = sentimentData.slice(Math.floor(sentimentData.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, item) => sum + (item.sentiment || 0), 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, item) => sum + (item.sentiment || 0), 0) / secondHalf.length;
      
      const change = secondHalfAvg - firstHalfAvg;
      if (change > 0.1) trend = 'improving';
      else if (change < -0.1) trend = 'declining';
    }
    
    // Extract key insights based on sentiment and keywords
    const keyInsights: string[] = [];
    
    if (overallSentiment > 0.7) {
      keyInsights.push('Document shows strongly positive sentiment');
    } else if (overallSentiment > 0.55) {
      keyInsights.push('Document shows moderately positive sentiment');
    } else if (overallSentiment < 0.35) {
      keyInsights.push('Document shows negative sentiment - exercise caution');
    } else {
      keyInsights.push('Document shows neutral sentiment');
    }
    
    if (trend === 'improving') {
      keyInsights.push('Sentiment is improving throughout the document');
    } else if (trend === 'declining') {
      keyInsights.push('Sentiment is declining throughout the document');
    }
    
    // Analyze keywords if available
    const keywordMap: Record<string, number> = {};
    sentimentData.forEach(item => {
      if (item.keywords) {
        item.keywords.forEach(keyword => {
          keywordMap[keyword] = (keywordMap[keyword] || 0) + 1;
        });
      }
    });
    
    const topKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([keyword]) => keyword);
      
    if (topKeywords.length > 0) {
      keyInsights.push(`Key topics: ${topKeywords.join(', ')}`);
    }
    
    return {
      overallSentiment,
      trend,
      keyInsights
    };
  } catch (error) {
    console.error("Error in analyzeSentiment:", error);
    return {
      overallSentiment: 0.5,
      trend: 'stable',
      keyInsights: ['Error occurred during sentiment analysis']
    };
  }
};
