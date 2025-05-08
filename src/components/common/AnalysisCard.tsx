
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnalysisCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <Card className={cn("shadow-sm border border-gray-200", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-market-primary">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
