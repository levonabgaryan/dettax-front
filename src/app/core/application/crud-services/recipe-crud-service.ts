import { IRecipeRepository } from '../ports/repositories/recipe-repository';
import { Recipe } from '../../domain/entities/recipe';

export class RecipeCRUDService {
  private recipeRepository: IRecipeRepository;

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  public async getById(recipeId: number): Promise<Recipe | null> {
    return await this.recipeRepository.getById(recipeId);
  }
}
