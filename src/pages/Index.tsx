
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import UploadSection from '@/components/dashboard/UploadSection';
import AnalysisDashboard from '@/components/dashboard/AnalysisDashboard';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stockData, setStockData] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  
  const handleFileUploaded = (data: any) => {
    setIsAnalyzing(true);
    
    // Simulate a short delay before showing the analysis to improve UX
    setTimeout(() => {
      setStockData(data);
      setIsAnalyzing(false);
      setShowTutorial(false);
      toast.success("Analysis ready", {
        description: "Scroll down to view detailed insights and recommendations"
      });
    }, 800);
  };

  // Display welcome toast on first load
  useEffect(() => {
    toast("Welcome to MarketGod Insights", { 
      description: "Upload your financial data for detailed analysis and recommendations."
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {!stockData ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-market-primary mb-4">MarketGod Insights</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload your stock market data for comprehensive analysis and investment recommendations
              </p>
            </div>
            
            <UploadSection onFileUploaded={handleFileUploaded} />
            
            {showTutorial && (
              <div className="mt-12 fade-in">
                <h2 className="text-2xl font-bold text-center text-market-primary mb-6">
                  Powerful Stock Market Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover-scale">
                    <div className="h-12 w-12 rounded-full bg-market-primary/10 mb-4 flex items-center justify-center">
                      <span className="text-market-primary text-xl font-bold">1</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-market-primary">Technical Analysis</h3>
                    <p className="text-gray-600">
                      Comprehensive technical indicators including moving averages, RSI, MACD, and Bollinger Bands.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover-scale">
                    <div className="h-12 w-12 rounded-full bg-market-primary/10 mb-4 flex items-center justify-center">
                      <span className="text-market-primary text-xl font-bold">2</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-market-primary">Fundamental Analysis</h3>
                    <p className="text-gray-600">
                      Detailed assessment of financial health, valuation metrics, and business performance.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover-scale">
                    <div className="h-12 w-12 rounded-full bg-market-primary/10 mb-4 flex items-center justify-center">
                      <span className="text-market-primary text-xl font-bold">3</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-market-primary">Smart Recommendations</h3>
                    <p className="text-gray-600">
                      Get clear invest/avoid recommendations with comprehensive supporting evidence.
                    </p>
                  </div>
                </div>
                
                <div className="mt-12 text-center">
                  <Button
                    onClick={() => {
                      // Demo data for quick testing
                      handleFileUploaded({
                        stockName: "Demo Company Inc",
                        ticker: "DEMO",
                        dataType: 'marketData',
                        data: Array(31).fill(0).map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (30 - i));
                          const baseValue = 100 + Math.sin(i * 0.3) * 20 + i * 0.5;
                          return {
                            date: date.toISOString().split('T')[0],
                            open: baseValue - 2 + Math.random() * 4,
                            high: baseValue + 2 + Math.random() * 2,
                            low: baseValue - 2 - Math.random() * 2,
                            close: baseValue + Math.random() * 3,
                            volume: Math.floor(500000 + Math.random() * 500000)
                          };
                        }),
                        fundamentalData: {
                          pe: 16.8,
                          eps: 4.2,
                          roe: 0.15,
                          debtToEquity: 0.45,
                          currentRatio: 2.1,
                          quickRatio: 1.7,
                          profitMargin: 0.14,
                          dividendYield: 0.025
                        }
                      })
                    }}
                  >
                    View Demo Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex space-x-4 items-center">
              <div className="rounded-full bg-market-primary/20 h-12 w-12"></div>
              <div className="h-4 bg-market-primary/20 rounded w-36"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600">Analyzing your data...</p>
          </div>
        ) : (
          <>
            <AnalysisDashboard stockData={stockData} />
            <div className="my-8 text-center">
              <button 
                onClick={() => {
                  setStockData(null);
                  setShowTutorial(true);
                }}
                className="text-market-primary hover:text-market-accent underline"
              >
                Upload a different file
              </button>
            </div>
          </>
        )}
      </div>
      
      <footer className="bg-market-primary text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center md:flex md:justify-between md:text-left">
            <div>
              <p className="font-bold mb-2">MarketGod Insights - Advanced Stock Market Analysis</p>
              <p className="text-sm text-gray-300">
                Disclaimer: This tool provides analysis for informational purposes only. 
                Not financial advice. Invest at your own risk.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} MarketGod Insights. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
