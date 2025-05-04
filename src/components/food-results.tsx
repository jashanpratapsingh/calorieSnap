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
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center mb-6 tracking-tight">Identified Food Items</h3>
      {results.map((item, index) => (
        <Card
          key={`${item.name}-${index}`}
          className={`overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl bg-white/90 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-[${index * 100}ms]`}
          style={{ willChange: 'transform, opacity' }}
        >
          <CardContent className="p-6 flex items-center justify-between gap-6">
            <div className="flex-grow">
              <CardTitle className="text-lg font-semibold mb-2 text-gray-900">{item.name}</CardTitle>
              <Badge
                variant={getConfidenceBadgeVariant(item.confidence)}
                className="text-xs px-4 py-2 rounded-full font-semibold shadow-sm"
                aria-label={`Confidence level: ${formatConfidence(item.confidence)}`}
              >
                {formatConfidence(item.confidence)} confidence
              </Badge>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 text-right">
              <Flame className="h-6 w-6 text-calorie-accent" />
              <span className="text-2xl font-bold text-calorie-accent">
                {item.calories > 0 ? item.calories : '-'}
              </span>
              {item.calories > 0 && <span className="text-base text-muted-foreground">kcal</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
