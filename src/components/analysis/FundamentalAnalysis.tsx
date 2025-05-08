
import React from 'react';
import { FundamentalData, calculateFundamentalScores } from '@/utils/analysisUtils';
import AnalysisCard from '../common/AnalysisCard';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface FundamentalAnalysisProps {
  fundamentalData: FundamentalData;
  stockName: string;
  ticker: string;
}

const FundamentalAnalysis: React.FC<FundamentalAnalysisProps> = ({
  fundamentalData,
  stockName,
  ticker
}) => {
  const scores = calculateFundamentalScores(fundamentalData);
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-market-success';
    if (score >= 5) return 'text-market-accent';
    if (score >= 3) return 'text-market-warning';
    return 'text-market-danger';
  };
  
  // Get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 7) return 'bg-market-success';
    if (score >= 5) return 'bg-market-accent';
    if (score >= 3) return 'bg-market-warning';
    return 'bg-market-danger';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-market-primary">{stockName} ({ticker}) - Fundamental Analysis</h2>
        <p className="text-gray-600">
          Analysis based on key financial metrics and business fundamentals
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisCard title="Company Health Scores">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Overall Score</span>
                <span className={`font-bold ${getScoreColor(scores.overallScore)}`}>
                  {scores.overallScore}/10
                </span>
              </div>
              <Progress 
                value={scores.overallScore * 10} 
                className="h-2" 
                indicatorClassName={getProgressColor(scores.overallScore)} 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Value Score</span>
                  <span className={`font-medium ${getScoreColor(scores.valueScore)}`}>
                    {scores.valueScore}/10
                  </span>
                </div>
                <Progress 
                  value={scores.valueScore * 10} 
                  className="h-1.5" 
                  indicatorClassName={getProgressColor(scores.valueScore)} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span>Growth Score</span>
                  <span className={`font-medium ${getScoreColor(scores.growthScore)}`}>
                    {scores.growthScore}/10
                  </span>
                </div>
                <Progress 
                  value={scores.growthScore * 10} 
                  className="h-1.5" 
                  indicatorClassName={getProgressColor(scores.growthScore)} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span>Stability Score</span>
                  <span className={`font-medium ${getScoreColor(scores.stabilityScore)}`}>
                    {scores.stabilityScore}/10
                  </span>
                </div>
                <Progress 
                  value={scores.stabilityScore * 10} 
                  className="h-1.5" 
                  indicatorClassName={getProgressColor(scores.stabilityScore)} 
                />
              </div>
            </div>
          </div>
        </AnalysisCard>
        
        <AnalysisCard title="Key Financial Metrics">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">P/E Ratio</div>
              <div className="text-lg font-mono font-semibold">
                {fundamentalData.pe.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {fundamentalData.pe < 15 
                  ? 'Potentially undervalued' 
                  : fundamentalData.pe > 30
                    ? 'Above industry average'
                    : 'Within normal range'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-600">EPS</div>
              <div className="text-lg font-mono font-semibold">
                ${fundamentalData.eps.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {fundamentalData.eps > 0 
                  ? 'Company is profitable' 
                  : 'Company is not profitable'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-600">ROE</div>
              <div className="text-lg font-mono font-semibold">
                {(fundamentalData.roe * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">
                {fundamentalData.roe > 0.15 
                  ? 'Strong returns on equity' 
                  : fundamentalData.roe > 0.1
                    ? 'Decent returns on equity'
                    : 'Below average returns'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Debt to Equity</div>
              <div className="text-lg font-mono font-semibold">
                {fundamentalData.debtToEquity.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {fundamentalData.debtToEquity < 0.5 
                  ? 'Low leverage' 
                  : fundamentalData.debtToEquity > 1.5
                    ? 'High leverage'
                    : 'Moderate leverage'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Profit Margin</div>
              <div className="text-lg font-mono font-semibold">
                {(fundamentalData.profitMargin * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">
                {fundamentalData.profitMargin > 0.2 
                  ? 'Excellent profitability' 
                  : fundamentalData.profitMargin > 0.1
                    ? 'Good profitability'
                    : 'Low margins'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Dividend Yield</div>
              <div className="text-lg font-mono font-semibold">
                {(fundamentalData.dividendYield * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">
                {fundamentalData.dividendYield > 0.04 
                  ? 'High dividend yield' 
                  : fundamentalData.dividendYield > 0.02
                    ? 'Moderate dividend yield'
                    : fundamentalData.dividendYield > 0
                      ? 'Low dividend yield'
                      : 'No dividend'}
              </div>
            </div>
          </div>
        </AnalysisCard>
        
        <AnalysisCard 
          title="Liquidity Analysis"
          className="md:col-span-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium">Current Ratio</span>
                  <span className="font-mono font-medium">{fundamentalData.currentRatio.toFixed(2)}</span>
                </div>
                <Progress 
                  value={Math.min(fundamentalData.currentRatio / 3 * 100, 100)} 
                  className="h-2" 
                  indicatorClassName={
                    fundamentalData.currentRatio > 2 
                      ? 'bg-market-success' 
                      : fundamentalData.currentRatio > 1 
                        ? 'bg-market-accent' 
                        : 'bg-market-danger'
                  } 
                />
                <div className="mt-1 text-xs text-gray-500">
                  {fundamentalData.currentRatio > 2 
                    ? 'Strong short-term liquidity' 
                    : fundamentalData.currentRatio > 1 
                      ? 'Adequate short-term liquidity'
                      : 'Potential short-term liquidity issues'}
                </div>
              </div>
              
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium">Quick Ratio</span>
                  <span className="font-mono font-medium">{fundamentalData.quickRatio.toFixed(2)}</span>
                </div>
                <Progress 
                  value={Math.min(fundamentalData.quickRatio / 2 * 100, 100)} 
                  className="h-2" 
                  indicatorClassName={
                    fundamentalData.quickRatio > 1.5 
                      ? 'bg-market-success' 
                      : fundamentalData.quickRatio > 1 
                        ? 'bg-market-accent' 
                        : 'bg-market-danger'
                  } 
                />
                <div className="mt-1 text-xs text-gray-500">
                  {fundamentalData.quickRatio > 1.5 
                    ? 'Excellent immediate liquidity' 
                    : fundamentalData.quickRatio > 1 
                      ? 'Good immediate liquidity'
                      : 'Possible immediate liquidity issues'}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Interpretation:</h4>
              <p className="text-sm text-gray-700">
                {fundamentalData.currentRatio > 1.5 && fundamentalData.quickRatio > 1
                  ? 'This company maintains healthy liquidity levels, indicating a strong ability to meet short-term obligations. The robust current and quick ratios suggest effective working capital management.'
                  : fundamentalData.currentRatio > 1 && fundamentalData.quickRatio > 0.8
                    ? 'This company has adequate liquidity to meet short-term obligations, though there is room for improvement in working capital efficiency.'
                    : 'This company shows potential liquidity concerns that could impact its ability to meet short-term obligations. Investors should monitor cash flow trends carefully.'}
              </p>
            </div>
          </div>
        </AnalysisCard>
      </div>
    </div>
  );
};

export default FundamentalAnalysis;
