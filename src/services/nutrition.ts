/**
 * Represents a food item with its name and calorie count.
 */
export interface FoodItem {
  /**
   * The name of the food item.
   */
  name: string;
  /**
   * The calorie count of the food item.
   */
  calories: number;
}

/**
 * Asynchronously retrieves calorie information for a given food item name.
 *
 * @param foodName The name of the food item to lookup.
 * @returns A promise that resolves to a FoodItem object containing the calorie count.
 */
export async function getCalories(foodName: string): Promise<FoodItem> {
  // TODO: Implement this by calling an API.
  return {
    name: foodName,
    calories: 200,
  };
}
