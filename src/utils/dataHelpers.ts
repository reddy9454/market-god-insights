
// Helper utilities for data processing and formatting

export interface StockData {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;  // Making close optional to fix type errors
  volume?: number;
  sentiment?: number;
  confidence?: number;
  keywords?: string[];
}

export interface StockInfo {
  stockName: string;
  ticker: string;
  data: StockData[];
  fileType?: string; // Added to track file type
}

// Safe number formatting utility
export const formatNumber = (num?: number | null, decimals = 2): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return 'N/A';
  }
  return num.toFixed(decimals);
};

// Safe percentage calculation utility
export const calculatePercentageChange = (current?: number | null, previous?: number | null): string => {
  if (current === undefined || current === null || 
      previous === undefined || previous === null || 
      previous === 0) {
    return '';
  }
  
  try {
    const change = ((current / previous - 1) * 100);
    return isNaN(change) ? '' : formatNumber(change) + '%';
  } catch (error) {
    console.error("Error calculating percentage:", error);
    return '';
  }
};

// Add a safety utility to ensure data has close property when needed
export const ensureValidData = (data: StockData[]): StockData[] => {
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid data provided to ensureValidData");
    return [];
  }

  return data.map(item => {
    if (!item) return { date: new Date().toISOString().split('T')[0], close: 0 };
    
    // If the item doesn't have a date, add one
    const newItem = { 
      ...item,
      date: item.date || new Date().toISOString().split('T')[0]
    };
    
    // If the item doesn't have a close property but has a sentiment property,
    // use the sentiment as the close value for chart display
    if (newItem.close === undefined && newItem.sentiment !== undefined) {
      newItem.close = newItem.sentiment;
    }
    
    // Fallback value if neither close nor sentiment exists
    if (newItem.close === undefined) {
      newItem.close = 0;
    }
    
    return newItem;
  });
};

// Data validation utility
export const isValidDataPoint = (dataPoint: any): boolean => {
  return dataPoint && typeof dataPoint === 'object' && 'date' in dataPoint;
};
