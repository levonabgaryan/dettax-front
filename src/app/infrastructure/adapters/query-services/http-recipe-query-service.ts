import { IRecipeQueryService } from '../../../core/application/ports/query-services/recipe-query-service';
import { Recipe } from '../../../core/domain/entities/recipe';
import { EntitiesNotLoadedError } from '../../../core/application/errors/entities-not-loaded-error';
import { HttpError } from '../../errors/http-error';
import { IRecipeRepository } from '../../../core/application/ports/repositories/recipe-repository';
import { RecipesByCategoryNameSchema } from './response-schamas';

export class HttpRecipeQueryService implements IRecipeQueryService {
  private static readonly apiBaseUrl = 'https://www.themealdb.com/api/json/v1/1/';
  private static readonly getByCategoryNameUrl = `${HttpRecipeQueryService.apiBaseUrl}/filter.php?c=`;

  private readonly recipeRepository: IRecipeRepository;

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  public async findByCategoryName(categoryName: string): Promise<Recipe[]> {
    let recipesByCategoryNameResponse: Response;
    try {
      recipesByCategoryNameResponse = await fetch(
        `${HttpRecipeQueryService.getByCategoryNameUrl}${categoryName}`,
      );
    } catch (cause) {
      throw new EntitiesNotLoadedError('Recipe', cause);
    }
    if (!recipesByCategoryNameResponse.ok) {
      throw new EntitiesNotLoadedError(
        'Recipe',
        new HttpError(recipesByCategoryNameResponse.status),
      );
    }
    const parsedRecipesByCategoryNameContent = RecipesByCategoryNameSchema.safeParse(
      await recipesByCategoryNameResponse.json(),
    );
    if (!parsedRecipesByCategoryNameContent.success) {
      throw new EntitiesNotLoadedError('Recipe', parsedRecipesByCategoryNameContent.error);
    }
    if (parsedRecipesByCategoryNameContent.data.meals === null) {
      return [];
    }
    const results = await Promise.allSettled(
      parsedRecipesByCategoryNameContent.data.meals.map((meal) =>
        this.recipeRepository.getById(meal.idMeal),
      ),
    );
    const recipes: Recipe[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        recipes.push(result.value);
      }
    }
    return recipes;
  }
}
