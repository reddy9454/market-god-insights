
import React, { useState, useEffect } from 'react';
import StockChart from '../common/StockChart';
import RecommendationCard from '../common/RecommendationCard';
import TechnicalAnalysis from '../analysis/TechnicalAnalysis';
import FundamentalAnalysis from '../analysis/FundamentalAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateRecommendation } from '@/utils/analysisUtils';
import { Button } from '@/components/ui/button';
import { Save, Share, FileDown, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AnalysisDashboardProps {
  stockData: {
    stockName: string;
    ticker: string;
    dataType?: 'marketData' | 'documentAnalysis';
    data: {
      date: string;
      close?: number;
      open?: number;
      high?: number;
      low?: number;
      volume?: number;
      sentiment?: number;
      confidence?: number;
      keywords?: string[];
    }[];
    fundamentalData?: {
      pe: number;
      eps: number;
      roe: number;
      debtToEquity: number;
      currentRatio: number;
      quickRatio: number;
      profitMargin: number;
      dividendYield: number;
    };
  };
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ stockData }) => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  
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

  // Mock fundamental data if not provided (in a real app, this would come from an API or user input)
  const fundamentalData = stockData.fundamentalData || {
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
  const hasMarketData = stockData.dataType !== 'documentAnalysis';
  const lastDataPoint = stockData.data.slice(-1)[0];
  const previousDataPoint = stockData.data.length > 1 ? stockData.data.slice(-2)[0] : null;
  
  // Generate recommendation - safely wrap with try/catch to prevent crashes
  let recommendation;
  try {
    // Only generate stock recommendation for market data
    recommendation = hasMarketData ? 
      generateRecommendation(stockData.data, fundamentalData) : 
      {
        recommendation: 'HOLD',
        confidence: 0.6,
        positivePoints: ['Document sentiment analysis is positive'],
        negativePoints: ['Limited market data for comprehensive analysis'],
        summary: 'Based on document analysis, the outlook is cautiously optimistic.'
      };
  } catch (error) {
    console.error("Error generating recommendation:", error);
    recommendation = {
      recommendation: 'HOLD',
      confidence: 0.5,
      positivePoints: ['Unable to generate detailed analysis'],
      negativePoints: [],
      summary: 'Analysis unavailable due to data issues.'
    };
  }
  
  // Safe number formatting utility
  const formatNumber = (num?: number | null, decimals = 2): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return 'N/A';
    }
    return num.toFixed(decimals);
  };
  
  // Safe percentage calculation utility
  const calculatePercentageChange = (current?: number | null, previous?: number | null): string => {
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
  
  // Generate insights based on the data
  useEffect(() => {
    const generateInsights = () => {
      const generatedInsights: string[] = [];
      
      try {
        if (hasMarketData) {
          // Market data insights
          const prices = stockData.data.map(d => d.close || 0).filter(p => p > 0);
          if (prices.length > 0) {
            const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
            const max = Math.max(...prices);
            const min = Math.min(...prices);
            
            // Price trend insights
            if (prices[prices.length - 1] > avg) {
              generatedInsights.push("Current price is above the average price, indicating potential strength.");
            } else {
              generatedInsights.push("Current price is below the average price, indicating potential weakness.");
            }
            
            // Volatility insights
            const volatility = (max - min) / avg * 100;
            if (volatility > 20) {
              generatedInsights.push(`High price volatility detected (${volatility.toFixed(1)}%), suggesting increased risk.`);
            } else if (volatility < 5) {
              generatedInsights.push(`Low price volatility detected (${volatility.toFixed(1)}%), suggesting stable price action.`);
            }
            
            // Volume insights if available
            const volumes = stockData.data.map(d => d.volume || 0).filter(v => v > 0);
            if (volumes.length > 0) {
              const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
              const lastVolume = volumes[volumes.length - 1];
              
              if (lastVolume > avgVolume * 1.5) {
                generatedInsights.push("Recent volume is significantly higher than average, indicating increased interest.");
              } else if (lastVolume < avgVolume * 0.5) {
                generatedInsights.push("Recent volume is significantly lower than average, indicating decreased interest.");
              }
            }
          }
        } else {
          // Document analysis insights
          const sentiments = stockData.data.map(d => d.sentiment || 0).filter(s => s > 0);
          
          if (sentiments.length > 0) {
            const avgSentiment = sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length;
            
            if (avgSentiment > 0.7) {
              generatedInsights.push("Document analysis reveals strong positive sentiment in the content.");
            } else if (avgSentiment < 0.4) {
              generatedInsights.push("Document analysis reveals cautious or negative sentiment in the content.");
            } else {
              generatedInsights.push("Document analysis reveals balanced sentiment in the content.");
            }
            
            // Extract common keywords if available
            const keywordsMap: Record<string, number> = {};
            stockData.data.forEach(item => {
              if (item.keywords) {
                item.keywords.forEach(keyword => {
                  keywordsMap[keyword] = (keywordsMap[keyword] || 0) + 1;
                });
              }
            });
            
            const topKeywords = Object.entries(keywordsMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([keyword]) => keyword);
              
            if (topKeywords.length > 0) {
              generatedInsights.push(`Frequently mentioned topics include: ${topKeywords.join(', ')}.`);
            }
          }
        }
        
        // Add fundamental analysis insights
        if (fundamentalData) {
          if (fundamentalData.pe < 15) {
            generatedInsights.push(`P/E ratio of ${fundamentalData.pe.toFixed(2)} suggests the stock may be undervalued.`);
          } else if (fundamentalData.pe > 25) {
            generatedInsights.push(`P/E ratio of ${fundamentalData.pe.toFixed(2)} suggests the stock may be overvalued.`);
          }
          
          if (fundamentalData.dividendYield > 0.03) {
            generatedInsights.push(`Dividend yield of ${(fundamentalData.dividendYield * 100).toFixed(2)}% is above average.`);
          }
        }
      } catch (error) {
        console.error("Error generating insights:", error);
        generatedInsights.push("Insights generation encountered an error. Please check your data.");
      }
      
      // Always have at least one insight
      if (generatedInsights.length === 0) {
        generatedInsights.push("Analysis complete. Review the detailed metrics for more information.");
      }
      
      setInsights(generatedInsights);
      setAnalysisComplete(true);
      toast.success("Insights generated successfully", {
        description: "Detailed analysis is ready to review."
      });
    };
    
    // Simulate analysis time
    const timer = setTimeout(() => {
      generateInsights();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [stockData, hasMarketData, fundamentalData]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-market-primary">
            {stockData.stockName} ({stockData.ticker})
          </h1>
          {hasMarketData && lastDataPoint && (
            <p className="text-gray-600">
              {lastDataPoint.close !== undefined && (
                <>
                  Last Price: ${formatNumber(lastDataPoint.close)}
                  {previousDataPoint && previousDataPoint.close !== undefined && (
                    <>
                      {' • '}
                      <span className={
                        lastDataPoint.close > previousDataPoint.close
                          ? "text-market-success" 
                          : "text-market-danger"
                      }>
                        {lastDataPoint.close > previousDataPoint.close ? "▲" : "▼"} 
                        {calculatePercentageChange(lastDataPoint.close, previousDataPoint.close)}
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          )}
          {!hasMarketData && (
            <p className="text-gray-600">
              Document Analysis • Sentiment: {lastDataPoint.sentiment !== undefined ? 
                `${(lastDataPoint.sentiment * 100).toFixed(0)}% positive` : 
                'N/A'}
            </p>
          )}
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
      
      {/* Auto-generated insights section */}
      {analysisComplete && insights.length > 0 && (
        <Alert className="mb-6 bg-market-accent/10 border-market-accent">
          <AlertTriangle className="h-4 w-4 text-market-accent" />
          <AlertTitle>Key Insights</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-8">
        {hasMarketData ? (
          <StockChart 
            data={stockData.data}
            type="area"
            height={350}
          />
        ) : (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Document Sentiment Analysis</h3>
              <StockChart 
                data={stockData.data.map(d => ({
                  date: d.date,
                  close: d.sentiment || 0
                }))}
                type="line"
                height={250}
              />
              <div className="mt-4 text-sm text-gray-600">
                Document sentiment analysis tracks positive or negative tone in the analyzed text over time.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {recommendation && (
        <div className="mb-8">
          <RecommendationCard {...recommendation} />
        </div>
      )}
      
      <div className="mb-8">
        <Tabs defaultValue={hasMarketData ? "technical" : "fundamental"}>
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="technical" disabled={!hasMarketData}>Technical Analysis</TabsTrigger>
            <TabsTrigger value="fundamental" className="flex-1">Fundamental Analysis</TabsTrigger>
          </TabsList>
          
          {hasMarketData && (
            <TabsContent value="technical" className="mt-6">
              <TechnicalAnalysis
                stockData={stockData.data}
                stockName={stockData.stockName}
                ticker={stockData.ticker}
              />
            </TabsContent>
          )}
          
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
