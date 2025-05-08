
import React from 'react';
import StockChart from '../common/StockChart';
import RecommendationCard from '../common/RecommendationCard';
import TechnicalAnalysis from '../analysis/TechnicalAnalysis';
import FundamentalAnalysis from '../analysis/FundamentalAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateRecommendation } from '@/utils/analysisUtils';
import { Button } from '@/components/ui/button';
import { Save, Share, FileDown } from 'lucide-react';

interface AnalysisDashboardProps {
  stockData: {
    stockName: string;
    ticker: string;
    data: {
      date: string;
      close: number;
      open?: number;
      high?: number;
      low?: number;
      volume?: number;
    }[]
  };
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ stockData }) => {
  // Make sure stockData and stockData.data exist and have elements
  if (!stockData || !stockData.data || stockData.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-market-primary mb-4">No Data Available</h1>
          <p className="text-gray-600">
            There is no stock data available for analysis. Please upload a different file.
          </p>
        </div>
      </div>
    );
  }

  // Mock fundamental data (in a real app, this would come from an API or user input)
  const fundamentalData = {
    pe: 18.5,
    eps: 3.75,
    roe: 0.14,
    debtToEquity: 0.65,
    currentRatio: 1.8,
    quickRatio: 1.2,
    profitMargin: 0.12,
    dividendYield: 0.03
  };
  
  // Ensure we have valid data points for comparison
  const lastDataPoint = stockData.data.slice(-1)[0];
  const previousDataPoint = stockData.data.length > 1 ? stockData.data.slice(-2)[0] : null;
  
  // Generate recommendation
  const recommendation = generateRecommendation(stockData.data, fundamentalData);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-market-primary">
            {stockData.stockName} ({stockData.ticker})
          </h1>
          <p className="text-gray-600">
            {lastDataPoint && (
              <>
                Last Price: ${lastDataPoint.close.toFixed(2)} • 
                {previousDataPoint && (
                  <span className={
                    lastDataPoint.close > previousDataPoint.close 
                      ? "text-market-success" 
                      : "text-market-danger"
                  }>
                    {lastDataPoint.close > previousDataPoint.close ? "▲" : "▼"} 
                    {Math.abs((lastDataPoint.close / previousDataPoint.close - 1) * 100).toFixed(2)}%
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <StockChart 
          data={stockData.data}
          type="area"
          height={350}
        />
      </div>
      
      <div className="mb-8">
        <RecommendationCard {...recommendation} />
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="technical">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="technical" className="flex-1">Technical Analysis</TabsTrigger>
            <TabsTrigger value="fundamental" className="flex-1">Fundamental Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="mt-6">
            <TechnicalAnalysis
              stockData={stockData.data}
              stockName={stockData.stockName}
              ticker={stockData.ticker}
            />
          </TabsContent>
          
          <TabsContent value="fundamental" className="mt-6">
            <FundamentalAnalysis
              fundamentalData={fundamentalData}
              stockName={stockData.stockName}
              ticker={stockData.ticker}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
