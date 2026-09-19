import { IRecipeRepository } from '../../../../../core/application/ports/repositories/recipe-repository';
import { Recipe } from '../../../../../core/domain/entities/recipe';
import { EntityNotLoadedError } from '../../../../../core/application/errors/entity-not-loaded-error';
import { HttpError } from '../../../../errors/http-error';
import { Injectable } from '@angular/core';
import {
  AllCategoriesSchema,
  CategoryValueObjectSchemaType,
  RecipeResponseContentSchema,
  RecipeSchemaType,
} from './response-schemas';
import { CategoryValueObject } from '../../../../../core/domain/value-objects/category-value-object';
import { CategoryValueObjectsAreNotLoadedError } from '../../../../../core/application/errors/category-value-objects-are-not-loaded-error';

@Injectable()
export class HttpRecipeRepository implements IRecipeRepository {
  private static readonly apiBaseUrl = 'https://www.themealdb.com/api/json/v1/1/';

  private static readonly getByIdUrl = `${HttpRecipeRepository.apiBaseUrl}lookup.php?i=`;
  private static readonly getAllCategoriesUrl = `${HttpRecipeRepository.apiBaseUrl}categories.php`;

  public async getById(id: number): Promise<Recipe | null> {
    const url = `${HttpRecipeRepository.getByIdUrl}${id}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (cause) {
      throw new EntityNotLoadedError('Recipe', id, cause);
    }

    if (!response.ok) {
      throw new EntityNotLoadedError('Recipe', id, new HttpError(response.status));
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch (cause) {
      throw new EntityNotLoadedError('Recipe', id, cause);
    }

    const parsed = RecipeResponseContentSchema.safeParse(body);
    if (!parsed.success) {
      throw new EntityNotLoadedError('Recipe', id, parsed.error);
    }

    if (!parsed.data.meals?.length) {
      return null;
    }

    return this.toEntity(parsed.data.meals[0]);
  }

  public async getAllCategoryValueObjects(): Promise<CategoryValueObject[]> {
    let response: Response;

    try {
      response = await fetch(HttpRecipeRepository.getAllCategoriesUrl);
    } catch (cause) {
      throw new CategoryValueObjectsAreNotLoadedError(cause);
    }
    if (!response.ok) {
      throw new CategoryValueObjectsAreNotLoadedError(new HttpError(response.status));
    }

    const parsed = AllCategoriesSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new CategoryValueObjectsAreNotLoadedError(parsed.error);
    }
    return parsed.data.categories.map((c) => this.toCategoryValueObject(c));
  }

  private toCategoryValueObject(
    categoryValueObjectSchema: CategoryValueObjectSchemaType,
  ): CategoryValueObject {
    return new CategoryValueObject(
      categoryValueObjectSchema.strCategory,
      categoryValueObjectSchema.strCategoryThumb,
      categoryValueObjectSchema.strCategoryDescription,
    );
  }

  private toEntity(recipeSchema: RecipeSchemaType): Recipe {
    const ingredientWithMeasurementSet = this.buildIngredientWithMeasurementSet(recipeSchema);
    const categoryValueObject = new CategoryValueObject(recipeSchema.strCategory);
    return new Recipe(
      recipeSchema.idMeal,
      recipeSchema.strMeal,
      recipeSchema.strArea,
      categoryValueObject,
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
}
