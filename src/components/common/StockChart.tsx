
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
import { StockData } from '@/utils/analysisUtils';

interface StockChartProps {
  data: StockData[];
  indicators?: {
    name: string;
    values: number[];
    color: string;
  }[];
  type?: 'line' | 'area';
  height?: number | string;
  showVolume?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  indicators = [],
  type = 'line',
  height = 400,
  showVolume = false,
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
    
    return result;
  });
  
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
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
