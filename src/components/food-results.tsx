import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface IdentifiedFoodItem {
  name: string;
  calories: number;
  confidence: number;
}

interface FoodResultsProps {
  results: IdentifiedFoodItem[];
}

// Helper to determine badge variant based on confidence
const getConfidenceBadgeVariant = (confidence: number): "default" | "secondary" | "outline" => {
  if (confidence > 0.8) return "default"; // High confidence - primary style
  if (confidence > 0.5) return "secondary"; // Medium confidence - secondary style
  return "outline"; // Low confidence - outline style
};

// Helper to format confidence percentage
const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(0)}%`;
};

export function FoodResults({ results }: FoodResultsProps) {
  if (!results || results.length === 0) {
    return <p className="text-center text-muted-foreground">No food items identified yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Identified Food Items</h3>
      {results.map((item, index) => (
        <Card key={`${item.name}-${index}`} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex-grow">
              <CardTitle className="text-base font-medium mb-1">{item.name}</CardTitle>
              <Badge
                variant={getConfidenceBadgeVariant(item.confidence)}
                className="text-xs"
                aria-label={`Confidence level: ${formatConfidence(item.confidence)}`}
              >
                {formatConfidence(item.confidence)} confidence
              </Badge>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 text-right">
              <Flame className="h-5 w-5 text-calorie-accent" />
              <span className="text-lg font-bold text-calorie-accent">
                {item.calories > 0 ? item.calories : '-'}
              </span>
              {item.calories > 0 && <span className="text-sm text-muted-foreground">kcal</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
