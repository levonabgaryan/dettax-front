import { z } from 'zod';

import { IRecipeRepository } from '../../../core/application/ports/repositories/recipe-repository';
import { Recipe } from '../../../core/domain/entities/recipe';
import { EntityNotLoadedError } from '../../../core/application/errors/entity-not-loaded-error';
import { HttpError } from '../../errors/http-error';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpRecipeRepository implements IRecipeRepository {
  private static readonly baseUrl: string = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

  public async getById(id: number): Promise<Recipe | null> {
    const url = `${HttpRecipeRepository.baseUrl}${id}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (cause) {
      throw new EntityNotLoadedError('Recipe', id, { cause: cause });
    }

    if (!response.ok) {
      throw new EntityNotLoadedError('Recipe', id, { cause: new HttpError(response.status) });
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch (cause) {
      throw new EntityNotLoadedError('Recipe', id, { cause: cause });
    }

    const parsed = RecipeResponseContentSchema.safeParse(body);
    if (!parsed.success) {
      throw new EntityNotLoadedError('Recipe', id, { cause: parsed.error });
    }

    if (!parsed.data.meals?.length) {
      return null;
    }

    return this.toDomain(parsed.data.meals[0]);
  }

  private toDomain(responseContent: RecipeSchemaType): Recipe {
    const ingredientWithMeasurementSet = this.buildIngredientWithMeasurementSet(responseContent);
    return new Recipe(
      responseContent.idMeal,
      responseContent.strMeal,
      responseContent.strArea,
      responseContent.strCategory,
      responseContent.strInstructions,
      ingredientWithMeasurementSet,
      responseContent.strMealThumb,
    );
  }

  private buildIngredientWithMeasurementSet(responseContent: RecipeSchemaType): Set<string> {
    const ingredientWithMeasurementSet = new Set<string>();
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}` as keyof RecipeSchemaType;
      const measurementKey = `strMeasure${i}` as keyof RecipeSchemaType;
      const ingredient: string | null | number = responseContent[ingredientKey];
      const measurement: string | null | number = responseContent[measurementKey];

      if (
        typeof ingredient !== 'string' ||
        typeof measurement !== 'string' ||
        ingredient === '' ||
        measurement === ''
      ) {
        continue;
      }
      ingredientWithMeasurementSet.add(`${ingredient} ${measurement}`);
    }
    return ingredientWithMeasurementSet;
  }
}

export const RecipeSchema = z.object({
  // Required fields
  idMeal: z.coerce.number().int().positive(),
  strMeal: z.string().min(1), // name
  strCategory: z.string().min(1),
  strArea: z.string().min(2), // country name
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

export type RecipeResponseContentType = z.infer<typeof RecipeResponseContentSchema>;
export type RecipeSchemaType = z.infer<typeof RecipeSchema>;
