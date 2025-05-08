
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import UploadSection from '@/components/dashboard/UploadSection';
import AnalysisDashboard from '@/components/dashboard/AnalysisDashboard';

const Index = () => {
  const [stockData, setStockData] = useState<any | null>(null);
  
  const handleFileUploaded = (data: any) => {
    setStockData(data);
  };

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
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center text-market-primary mb-6">
                Powerful Stock Market Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-market-primary">Technical Analysis</h3>
                  <p className="text-gray-600">
                    Comprehensive technical indicators including moving averages, RSI, MACD, and more.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-market-primary">Fundamental Analysis</h3>
                  <p className="text-gray-600">
                    Detailed assessment of financial health, valuation metrics, and business performance.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-market-primary">Smart Recommendations</h3>
                  <p className="text-gray-600">
                    Get clear invest/avoid recommendations with comprehensive supporting evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AnalysisDashboard stockData={stockData} />
        )}
      </div>
      
      <footer className="bg-market-primary text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">MarketGod Insights - Advanced Stock Market Analysis</p>
            <p className="text-sm text-gray-300">
              Disclaimer: This tool provides analysis for informational purposes only. 
              Not financial advice. Invest at your own risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
