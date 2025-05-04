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
  return (
    <div className="grid gap-4 w-full max-w-2xl mx-auto">
      {results.map((item, index) => (
        <Card key={index} className="transition-smooth hover:shadow-lg hover:scale-[1.02]">
          <CardContent className="p-6 flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate mb-2">{item.name}</h3>
              <Badge
                variant={getConfidenceBadgeVariant(item.confidence)}
                className="text-xs px-4 py-1.5 rounded-full font-medium shadow transition-smooth hover:scale-105"
                aria-label={`Confidence level: ${formatConfidence(item.confidence)}`}
              >
                {formatConfidence(item.confidence)} confidence
              </Badge>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Flame className="h-7 w-7 text-calorie-accent transition-smooth hover:scale-110 hover:rotate-12" />
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-calorie-accent tracking-tight">
                  {item.calories > 0 ? item.calories : '-'}
                </span>
                {item.calories > 0 && <span className="text-sm text-muted-foreground">kcal</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
