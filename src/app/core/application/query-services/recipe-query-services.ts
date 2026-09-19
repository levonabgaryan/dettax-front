import { IRecipeRepository } from '../ports/repositories/recipe-repository';
import { CategoryValueObject } from '../../domain/value-objects/category-value-object';

export class RecipeQueryServices {
  private recipeRepository: IRecipeRepository;

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  public async getAllCategoryValueObjects(): Promise<CategoryValueObject[]> {
    return await this.recipeRepository.getAllCategoryValueObjects();
  }
}
