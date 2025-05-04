'use server';

/**
 * @fileOverview Identifies food items from an image and provides a ranked list.
 *
 * - identifyFoodFromImage - A function that handles the food identification process.
 * - IdentifyFoodFromImageInput - The input type for the identifyFoodFromImage function.
 * - IdentifyFoodFromImageOutput - The return type for the identifyFoodFromImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyFoodFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFoodFromImageInput = z.infer<typeof IdentifyFoodFromImageInputSchema>;

const IdentifyFoodFromImageOutputSchema = z.object({
  foodItems: z
    .array(
      z.object({
        name: z.string().describe('The name of the identified food item.'),
        confidence: z.number().describe('The confidence level of the identification (0-1).'),
      })
    )
    .describe('A ranked list of identified food items, sorted by confidence.'),
});
export type IdentifyFoodFromImageOutput = z.infer<typeof IdentifyFoodFromImageOutputSchema>;

export async function identifyFoodFromImage(input: IdentifyFoodFromImageInput): Promise<IdentifyFoodFromImageOutput> {
  return identifyFoodFromImageFlow(input);
}

const identifyFoodPrompt = ai.definePrompt({
  name: 'identifyFoodPrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      foodItems: z
        .array(
          z.object({
            name: z.string().describe('The name of the identified food item.'),
            confidence: z.number().describe('The confidence level of the identification (0-1).'),
          })
        )
        .describe('A ranked list of identified food items, sorted by confidence.'),
    }),
  },
  prompt: `You are an AI trained to identify food items in images. Analyze the image and provide a ranked list of possible food items, sorted by your confidence level. Respond in JSON format.

Image: {{media url=photoDataUri}}
`,
});

const identifyFoodFromImageFlow = ai.defineFlow<
  typeof IdentifyFoodFromImageInputSchema,
  typeof IdentifyFoodFromImageOutputSchema
>(
  {
    name: 'identifyFoodFromImageFlow',
    inputSchema: IdentifyFoodFromImageInputSchema,
    outputSchema: IdentifyFoodFromImageOutputSchema,
  },
  async input => {
    const {output} = await identifyFoodPrompt(input);
    return output!;
  }
);
