import { IRecipeRepository } from '../../../../../core/application/ports/repositories/recipe-repository';
import { Recipe } from '../../../../../core/domain/entities/recipe';
import { EntityNotLoadedError } from '../../../../../core/application/errors/entity-not-loaded-error';
import { HttpError } from '../../../../errors/http-error';
import { Injectable } from '@angular/core';
import {
  AllCategoriesSchema,
  AllCategoriesSchemaType,
  CategorySchemaType,
  RecipeResponseContentSchema,
  RecipeSchemaType,
} from './response-schemas';
import { CategoriesAreNotLoadedError } from '../../../../../core/application/errors/categories-are-not-loaded-error';
import { Category } from '../../../../../core/domain/entities/category';

@Injectable()
export class HttpRecipeRepository implements IRecipeRepository {
  private static readonly apiBaseUrl = '/api/json/v1/1/';

  private static readonly getByIdUrl = `${HttpRecipeRepository.apiBaseUrl}lookup.php?i=`;
  private static readonly getAllCategoriesUrl = `${HttpRecipeRepository.apiBaseUrl}categories.php`;

  public async getById(id: number): Promise<Recipe | null> {
    // Since the public API is a bit mixed up, we have to combine some apis responses to have clean Entities.
    const url = `${HttpRecipeRepository.getByIdUrl}${id}`;

    let recipeResponse: Response;
    try {
      recipeResponse = await fetch(url);
    } catch (cause) {
      throw new EntityNotLoadedError('Recipe', id, cause);
    }

    if (!recipeResponse.ok) {
      throw new EntityNotLoadedError('Recipe', id, new HttpError(recipeResponse.status));
    }
    const parsedRecipeContent = RecipeResponseContentSchema.safeParse(await recipeResponse.json());
    if (!parsedRecipeContent.success) {
      throw new EntityNotLoadedError('Recipe', id, parsedRecipeContent.error);
    }

    if (!parsedRecipeContent.data.meals?.length) {
      return null;
    }

    let allCategoriesResponse: Response;

    try {
      allCategoriesResponse = await fetch(HttpRecipeRepository.getAllCategoriesUrl);
    } catch (cause) {
      throw new CategoriesAreNotLoadedError(cause);
    }
    if (!allCategoriesResponse.ok) {
      throw new CategoriesAreNotLoadedError(new HttpError(allCategoriesResponse.status));
    }

    const allParsedCategoriesContent = AllCategoriesSchema.safeParse(
      await allCategoriesResponse.json(),
    );
    if (!allParsedCategoriesContent.success) {
      throw new CategoriesAreNotLoadedError(allParsedCategoriesContent.error);
    }

    return this.toEntity(parsedRecipeContent.data.meals[0], allParsedCategoriesContent.data);
  }

  private toEntity(
    recipeSchema: RecipeSchemaType,
    allCategoriesSchema: AllCategoriesSchemaType,
  ): Recipe {
    const ingredientWithMeasurementSet = this.buildIngredientWithMeasurementSet(recipeSchema);
    const categorySchema = this.findNeededCategory(recipeSchema.strCategory, allCategoriesSchema);
    if (categorySchema === null) {
      throw new EntityNotLoadedError('Recipe', recipeSchema.idMeal);
    }
    const category = new Category(
      categorySchema.idCategory,
      categorySchema.strCategory,
      categorySchema.strCategoryDescription,
      categorySchema.strCategoryThumb,
    );
    return new Recipe(
      recipeSchema.idMeal,
      recipeSchema.strMeal,
      recipeSchema.strCountry,
      category,
      recipeSchema.strInstructions,
      ingredientWithMeasurementSet,
      recipeSchema.strMealThumb,
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

  private findNeededCategory(
    categoryName: string,
    allCategoriesSchema: AllCategoriesSchemaType,
  ): CategorySchemaType | null {
    const found = allCategoriesSchema.categories.find((c) => c.strCategory === categoryName);
    if (!found) {
      return null;
    }
    return found;
  }
}
