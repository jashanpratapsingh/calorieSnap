"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { FoodResults } from '@/components/food-results';
import { identifyFoodFromImage, type IdentifyFoodFromImageOutput } from '@/ai/flows/identify-food-from-image';
import { getCalories, type FoodItem } from '@/services/nutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdentifiedFoodItem extends FoodItem {
  confidence: number;
}

export default function Home() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [identifiedFoods, setIdentifiedFoods] = useState<IdentifyFoodFromImageOutput['foodItems'] | null>(null);
  const [calorieResults, setCalorieResults] = useState<IdentifiedFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setImageDataUri(null);
    setIdentifiedFoods(null);
    setCalorieResults([]);
    setError(null);
    setIsLoading(false);
  };

  const handleImageUpload = (dataUri: string) => {
    resetState(); // Reset when a new image is uploaded
    setImageDataUri(dataUri);
    setError(null); // Clear previous errors
  };

  const fetchCaloriesForItems = useCallback(async (items: IdentifyFoodFromImageOutput['foodItems']) => {
    setIsLoading(true);
    setError(null);
    try {
      const caloriePromises = items.map(async (item) => {
        // In a real app, you might want more robust error handling per item
        try {
          const calorieData = await getCalories(item.name);
          return {
            ...calorieData,
            confidence: item.confidence,
          };
        } catch (calorieError) {
          console.error(`Error fetching calories for ${item.name}:`, calorieError);
          // Return item with default/error calories or null
          return {
            name: item.name,
            calories: 0, // Or indicate error state, e.g., -1
            confidence: item.confidence,
          };
        }
      });

      const results = await Promise.all(caloriePromises);
      // Filter out any potential nulls if error handling returns null
      setCalorieResults(results.filter(Boolean) as IdentifiedFoodItem[]);
    } catch (err) {
      console.error('Error fetching calorie data:', err);
      setError('Failed to fetch calorie information for some items. Please try again.');
      setCalorieResults([]); // Clear results on general error
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Effect to trigger food identification when image is ready
  useEffect(() => {
    if (imageDataUri) {
      setIsLoading(true);
      setError(null);
      setIdentifiedFoods(null); // Clear previous identification results
      setCalorieResults([]); // Clear previous calorie results

      identifyFoodFromImage({ photoDataUri: imageDataUri })
        .then((output) => {
          if (output && output.foodItems && output.foodItems.length > 0) {
            setIdentifiedFoods(output.foodItems);
            // Automatically fetch calories for identified items
            fetchCaloriesForItems(output.foodItems);
          } else {
            setError('Could not identify any food items in the image.');
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error('Error identifying food:', err);
          setError('An error occurred during food identification. Please try again.');
          setIsLoading(false);
        });
    }
  }, [imageDataUri, fetchCaloriesForItems]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Snap Your Calories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} currentImage={imageDataUri} disabled={isLoading} />

          {isLoading && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Analyzing food...</span>
            </div>
          )}

          {error && (
             <Alert variant="destructive">
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
                <Button variant="link" onClick={resetState} className="mt-2">Try again</Button>
             </Alert>
           )}


          {!isLoading && calorieResults.length > 0 && (
            <FoodResults results={calorieResults} />
          )}

           {!isLoading && identifiedFoods && calorieResults.length === 0 && !error && (
             <p className="text-center text-muted-foreground">
               Identified food items, but couldn't fetch calorie data.
             </p>
           )}

           {!isLoading && !imageDataUri && !error && (
            <p className="text-center text-muted-foreground">
              Upload an image to get started!
            </p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
