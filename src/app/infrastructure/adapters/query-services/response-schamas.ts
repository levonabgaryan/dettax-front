import { z } from 'zod';

export const RecipeByCategoryNameSchema = z.object({
  idMeal: z.coerce.number().int().positive(),
  strMeal: z.string(),
  strCountry: z.string(),
  strMealThumb: z.string(), // imgUrl
});

export const RecipesByCategoryNameSchema = z.object({
  meals: z.array(RecipeByCategoryNameSchema).nullable(),
});

export type RecipesByCategoryNameSchemaType = z.infer<typeof RecipesByCategoryNameSchema>;
export type RecipeByCategoryNameSchemaType = z.infer<typeof RecipeByCategoryNameSchema>;
