import { z } from 'zod';

export const RecipeSchema = z.object({
  // Required fields
  idMeal: z.coerce.number().int().positive(),
  strMeal: z.string().min(1), // name
  strCategory: z.string().min(1),
  strCountry: z.string().min(2),
  strInstructions: z.string().min(3), // description

  // The recipe is supposed to at least contain one ingredient with its measurement
  strIngredient1: z.string().min(1),
  strMeasure1: z.string().min(1),

  strMealAlternate: z.string().nullable(),
  strMealThumb: z.string().nullable(), // imgUrl
  strTags: z.string().nullable(),
  strYoutube: z.string().nullable(),

  strIngredient2: z.string().nullable(),
  strIngredient3: z.string().nullable(),
  strIngredient4: z.string().nullable(),
  strIngredient5: z.string().nullable(),
  strIngredient6: z.string().nullable(),
  strIngredient7: z.string().nullable(),
  strIngredient8: z.string().nullable(),
  strIngredient9: z.string().nullable(),
  strIngredient10: z.string().nullable(),
  strIngredient11: z.string().nullable(),
  strIngredient12: z.string().nullable(),
  strIngredient13: z.string().nullable(),
  strIngredient14: z.string().nullable(),
  strIngredient15: z.string().nullable(),
  strIngredient16: z.string().nullable(),
  strIngredient17: z.string().nullable(),
  strIngredient18: z.string().nullable(),
  strIngredient19: z.string().nullable(),
  strIngredient20: z.string().nullable(),

  strMeasure2: z.string().nullable(),
  strMeasure3: z.string().nullable(),
  strMeasure4: z.string().nullable(),
  strMeasure5: z.string().nullable(),
  strMeasure6: z.string().nullable(),
  strMeasure7: z.string().nullable(),
  strMeasure8: z.string().nullable(),
  strMeasure9: z.string().nullable(),
  strMeasure10: z.string().nullable(),
  strMeasure11: z.string().nullable(),
  strMeasure12: z.string().nullable(),
  strMeasure13: z.string().nullable(),
  strMeasure14: z.string().nullable(),
  strMeasure15: z.string().nullable(),
  strMeasure16: z.string().nullable(),
  strMeasure17: z.string().nullable(),
  strMeasure18: z.string().nullable(),
  strMeasure19: z.string().nullable(),
  strMeasure20: z.string().nullable(),

  strSource: z.string().nullable(),
  strImageSource: z.string().nullable(),
  strCreativeCommonsConfirmed: z.string().nullable(),
  dateModified: z.string().nullable(),
});

export const RecipeResponseContentSchema = z.object({
  meals: z.array(RecipeSchema).nullable(),
});

export const CategorySchema = z.object({
  idCategory: z.coerce.number().int().positive(),
  strCategory: z.string(),
  strCategoryThumb: z.url(),
  strCategoryDescription: z.string(),
});

export const AllCategoriesSchema = z.object({
  categories: z.array(CategorySchema),
});

export type RecipeSchemaType = z.infer<typeof RecipeSchema>;
export type RecipeResponseContentType = z.infer<typeof RecipeResponseContentSchema>;

export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type AllCategoriesSchemaType = z.infer<typeof AllCategoriesSchema>;
