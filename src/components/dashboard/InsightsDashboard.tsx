
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { StockData } from '@/utils/dataHelpers';
import { analyzeSentiment } from '@/utils/analysisUtils';

interface InsightsDashboardProps {
  stockData: {
    data: StockData[];
    dataType?: 'marketData' | 'documentAnalysis';
  };
  insights: string[];
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ 
  stockData,
  insights
}) => {
  const isDocumentAnalysis = stockData?.dataType === 'documentAnalysis';
  
  // Get sentiment analysis for document data
  const sentimentAnalysis = isDocumentAnalysis ? 
    analyzeSentiment(stockData.data) : 
    { overallSentiment: 0, trend: 'stable' as const, keyInsights: [] };
  
  return (
    <div className="space-y-6">
      {/* Key Insights Section */}
      {insights && insights.length > 0 && (
        <Alert className="bg-market-accent/10 border-market-accent">
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
      
      {/* Enhanced Document Analysis Section */}
      {isDocumentAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-market-primary" />
                <h3 className="text-lg font-medium">Document Sentiment</h3>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">
                      {Math.round(sentimentAnalysis.overallSentiment * 100)}%
                    </span>
                  </div>
                  <svg className="h-32 w-32" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={sentimentAnalysis.overallSentiment > 0.6 ? "#4ade80" : 
                              sentimentAnalysis.overallSentiment > 0.4 ? "#facc15" : "#f87171"}
                      strokeWidth="3"
                      strokeDasharray={`${sentimentAnalysis.overallSentiment * 100}, 100`}
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-center">
                {sentimentAnalysis.trend === 'improving' ? (
                  <div className="flex items-center text-market-success">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Improving sentiment</span>
                  </div>
                ) : sentimentAnalysis.trend === 'declining' ? (
                  <div className="flex items-center text-market-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>Declining sentiment</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Stable sentiment</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Document Analysis Insights</h3>
              <ul className="space-y-3">
                {sentimentAnalysis.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-market-accent/10 flex items-center justify-center text-market-accent mr-2 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Based on natural language processing of the document content.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard;
