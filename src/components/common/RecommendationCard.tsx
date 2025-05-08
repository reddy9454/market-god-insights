
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  confidence: number;
  positivePoints: string[];
  negativePoints: string[];
  summary: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  confidence,
  positivePoints,
  negativePoints,
  summary,
}) => {
  // Determine colors and styles based on recommendation
  const getRecommendationColor = () => {
    switch (recommendation) {
      case 'STRONG BUY': return 'bg-market-success text-white';
      case 'BUY': return 'bg-market-success/80 text-white';
      case 'HOLD': return 'bg-market-warning text-white';
      case 'SELL': return 'bg-market-danger/80 text-white';
      case 'STRONG SELL': return 'bg-market-danger text-white';
      default: return 'bg-market-neutral text-white';
    }
  };
  
  return (
    <Card className="shadow-lg border-t-4 animate-fade-in" style={{ borderTopColor: recommendation.includes('BUY') ? '#4CAF50' : recommendation === 'HOLD' ? '#F97316' : '#D32F2F' }}>
      <CardHeader className={`${getRecommendationColor()} rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{recommendation}</CardTitle>
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {Math.round(confidence * 100)}% confidence
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-lg font-medium text-gray-800 mb-4">
          {summary}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center text-market-success font-medium gap-2">
              <CheckCircle className="h-5 w-5" />
              Positive Factors
            </h3>
            <ul className="space-y-1 text-sm ml-7">
              {positivePoints.map((point, index) => (
                <li key={index} className="list-disc text-gray-700">
                  {point}
                </li>
              ))}
              {positivePoints.length === 0 && (
                <li className="text-gray-500 italic">No significant positive factors identified</li>
              )}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="flex items-center text-market-danger font-medium gap-2">
              <XCircle className="h-5 w-5" />
              Risk Factors
            </h3>
            <ul className="space-y-1 text-sm ml-7">
              {negativePoints.map((point, index) => (
                <li key={index} className="list-disc text-gray-700">
                  {point}
                </li>
              ))}
              {negativePoints.length === 0 && (
                <li className="text-gray-500 italic">No significant risk factors identified</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 text-market-warning" />
          <span className="text-gray-600">
            This is an automated analysis. Always conduct your own research before making investment decisions.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
