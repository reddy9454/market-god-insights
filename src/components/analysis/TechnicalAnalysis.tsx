
import React from 'react';
import { StockData } from '@/utils/dataHelpers';
import { calculateSMA, calculateRSI, calculateMACD } from '@/utils/analysisUtils';
import StockChart from '../common/StockChart';
import AnalysisCard from '../common/AnalysisCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TechnicalAnalysisProps {
  stockData: StockData[];
  stockName: string;
  ticker: string;
}

const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ 
  stockData, 
  stockName, 
  ticker 
}) => {
  // Calculate technical indicators
  const sma20 = calculateSMA(stockData, 20);
  const sma50 = calculateSMA(stockData, 50);
  const sma200 = calculateSMA(stockData, 200);
  
  const rsiValues = calculateRSI(stockData);
  const { macd, signal, histogram } = calculateMACD(stockData);
  
  // Prepare data for MACD chart
  const macdChartData = histogram.map((value, index) => ({
    date: stockData[stockData.length - histogram.length + index]?.date || '',
    macd: macd[macd.length - histogram.length + index],
    signal: signal[index],
    histogram: value
  }));
  
  // Prepare data for RSI chart
  const rsiChartData = rsiValues.map((value, index) => ({
    date: stockData[stockData.length - rsiValues.length + index]?.date || '',
    rsi: value
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-market-primary">{stockName} ({ticker}) - Technical Analysis</h2>
          <p className="text-gray-600">
            Analysis based on historical price action and technical indicators
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="price">
        <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md">
          <TabsTrigger value="price">Price Action</TabsTrigger>
          <TabsTrigger value="oscillators">Oscillators</TabsTrigger>
          <TabsTrigger value="momentum">Momentum</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="space-y-4">
          <AnalysisCard 
            title="Price with Moving Averages" 
            description="Stock price with 20, 50 and 200-day Simple Moving Averages"
          >
            <StockChart 
              data={stockData}
              indicators={[
                { name: 'SMA20', values: sma20, color: '#22c55e' },
                { name: 'SMA50', values: sma50, color: '#0ea5e9' },
                { name: 'SMA200', values: sma200, color: '#ef4444' },
              ]}
              type="area"
              showVolume={true}
            />
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium mb-2">Moving Average Analysis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Current price ({stockData.slice(-1)[0]?.close?.toFixed(2) || 'N/A'}) is 
                  {stockData.slice(-1)[0]?.close && sma20.slice(-1)[0] ? 
                    (stockData.slice(-1)[0]?.close > sma20.slice(-1)[0] ? ' above ' : ' below ') : 
                    ' compared to '}
                  20-day SMA ({sma20.slice(-1)[0]?.toFixed(2) || 'N/A'})
                </li>
                <li>
                  {sma20.slice(-1)[0] && sma50.slice(-1)[0] ? 
                    (sma20.slice(-1)[0] > sma50.slice(-1)[0] ?
                      'Short-term trend is bullish (20-day SMA above 50-day)' :
                      'Short-term trend is bearish (20-day SMA below 50-day)') :
                    'Short-term trend data unavailable'}
                </li>
                <li>
                  {sma50.slice(-1)[0] && sma200.slice(-1)[0] ?
                    (sma50.slice(-1)[0] > sma200.slice(-1)[0] ?
                      'Long-term trend is bullish (50-day SMA above 200-day)' :
                      'Long-term trend is bearish (50-day SMA below 200-day)') :
                    'Long-term trend data unavailable'}
                </li>
              </ul>
            </div>
          </AnalysisCard>
        </TabsContent>
        
        <TabsContent value="oscillators" className="space-y-4">
          <AnalysisCard 
            title="Relative Strength Index (RSI)" 
            description="Momentum oscillator that measures speed and change of price movements"
          >
            <div className="h-64">
              <StockChart 
                data={rsiChartData.map(d => ({ date: d.date, close: d.rsi }))}
                height={250}
              />
            </div>
            
            <div className="flex my-2">
              <div className="h-6 bg-market-danger text-xs text-white flex items-center justify-center w-1/4 rounded-l-md">
                Oversold (&lt;30)
              </div>
              <div className="h-6 bg-market-neutral text-xs text-white flex items-center justify-center w-2/4">
                Neutral (30-70)
              </div>
              <div className="h-6 bg-market-success text-xs text-white flex items-center justify-center w-1/4 rounded-r-md">
                Overbought (&gt;70)
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium mb-2">RSI Analysis:</p>
              <p>Current RSI: <span className="font-mono">{rsiValues.slice(-1)[0]?.toFixed(2) || 'N/A'}</span></p>
              <p>
                {rsiValues.slice(-1)[0] ?
                  (rsiValues.slice(-1)[0] > 70
                    ? 'The stock is currently overbought, suggesting a potential pullback.'
                    : rsiValues.slice(-1)[0] < 30
                    ? 'The stock is currently oversold, suggesting a potential bounce.'
                    : 'The stock is currently in a neutral RSI range.')
                  : 'RSI data unavailable for analysis.'}
              </p>
            </div>
          </AnalysisCard>
        </TabsContent>
        
        <TabsContent value="momentum" className="space-y-4">
          <AnalysisCard 
            title="Moving Average Convergence Divergence (MACD)" 
            description="Trend-following momentum indicator showing relationship between two moving averages"
          >
            <div className="h-64">
              <StockChart 
                data={macdChartData.map(d => ({ date: d.date, close: d.macd, signal: d.signal }))}
                indicators={[
                  { name: 'signal', values: signal, color: '#ef4444' },
                ]}
                height={250}
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium mb-2">MACD Analysis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  MACD Line: <span className="font-mono">{macd.slice(-1)[0]?.toFixed(2) || 'N/A'}</span>
                </li>
                <li>
                  Signal Line: <span className="font-mono">{signal.slice(-1)[0]?.toFixed(2) || 'N/A'}</span>
                </li>
                <li>
                  Histogram: <span className="font-mono">{histogram.slice(-1)[0]?.toFixed(2) || 'N/A'}</span>
                </li>
                <li>
                  {macd.slice(-1)[0] && signal.slice(-1)[0] ?
                    (macd.slice(-1)[0] > signal.slice(-1)[0]
                      ? 'MACD above signal line suggests bullish momentum'
                      : 'MACD below signal line suggests bearish momentum')
                    : 'MACD/Signal comparison unavailable'}
                </li>
              </ul>
            </div>
          </AnalysisCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalAnalysis;
