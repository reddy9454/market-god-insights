
import React from 'react';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { StockData } from '@/utils/dataHelpers';

interface StockChartProps {
  data: StockData[];
  indicators?: {
    name: string;
    values: number[];
    color: string;
  }[];
  type?: 'line' | 'area' | 'candle' | 'bar';  // Updated to include 'candle' and 'bar'
  height?: number | string;
  showVolume?: boolean;
  overlay?: {
    upperBand?: { date: string; value: number }[];
    lowerBand?: { date: string; value: number }[];
  };
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  indicators = [],
  type = 'line',
  height = 400,
  showVolume = false,
  overlay
}) => {
  // Prepare data with indicators
  const chartData = data.map((point, index) => {
    const result: any = { ...point };
    
    // Add indicators to data points
    indicators.forEach(indicator => {
      if (index >= data.length - indicator.values.length) {
        const adjustedIndex = index - (data.length - indicator.values.length);
        result[indicator.name] = indicator.values[adjustedIndex];
      }
    });
    
    // Add overlay data like Bollinger Bands if available
    if (overlay) {
      if (overlay.upperBand) {
        const upperBandPoint = overlay.upperBand.find(b => b.date === point.date);
        if (upperBandPoint) {
          result.upperBand = upperBandPoint.value;
        }
      }
      
      if (overlay.lowerBand) {
        const lowerBandPoint = overlay.lowerBand.find(b => b.date === point.date);
        if (lowerBandPoint) {
          result.lowerBand = lowerBandPoint.value;
        }
      }
    }
    
    return result;
  });
  
  // Since we don't have actual candlestick or bar chart implementations,
  // we'll fallback to line or area for those types
  const effectiveType = type === 'candle' || type === 'bar' ? 'line' : type;
  
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <ResponsiveContainer width="100%" height={height}>
        {effectiveType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (typeof value === 'string') {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }
                return value;
              }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`} 
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={(label) => {
                if (typeof label === 'string') {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }
                return label;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#0EA5E9" 
              dot={false} 
              strokeWidth={2} 
              name="Price"
            />
            
            {/* Add Bollinger Bands if available */}
            {overlay && overlay.upperBand && (
              <Line
                type="monotone"
                dataKey="upperBand"
                stroke="#22c55e"
                dot={false}
                strokeDasharray="3 3"
                name="Upper Band"
              />
            )}
            
            {overlay && overlay.lowerBand && (
              <Line
                type="monotone"
                dataKey="lowerBand"
                stroke="#ef4444"
                dot={false}
                strokeDasharray="3 3"
                name="Lower Band"
              />
            )}
            
            {indicators.map((indicator, i) => (
              <Line
                key={indicator.name}
                type="monotone"
                dataKey={indicator.name}
                stroke={indicator.color}
                dot={false}
                strokeDasharray={i % 2 === 1 ? "5 5" : undefined}
                name={indicator.name}
              />
            ))}
          </LineChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (typeof value === 'string') {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }
                return value;
              }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`} 
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={(label) => {
                if (typeof label === 'string') {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }
                return label;
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#0EA5E9" 
              fill="#0EA5E9" 
              fillOpacity={0.2}
              name="Price" 
            />
            
            {showVolume && data[0].volume && (
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#9b87f5"
                fill="#9b87f5"
                fillOpacity={0.1}
                name="Volume"
                yAxisId={1}
              />
            )}
            
            {/* Add Bollinger Bands if available */}
            {overlay && overlay.upperBand && (
              <Line
                type="monotone"
                dataKey="upperBand"
                stroke="#22c55e"
                dot={false}
                strokeDasharray="3 3"
                name="Upper Band"
              />
            )}
            
            {overlay && overlay.lowerBand && (
              <Line
                type="monotone"
                dataKey="lowerBand"
                stroke="#ef4444"
                dot={false}
                strokeDasharray="3 3"
                name="Lower Band"
              />
            )}
            
            {indicators.map((indicator, i) => (
              <Line
                key={indicator.name}
                type="monotone"
                dataKey={indicator.name}
                stroke={indicator.color}
                dot={false}
                strokeDasharray={i % 2 === 1 ? "5 5" : undefined}
                name={indicator.name}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
