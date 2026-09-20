import { Recipe } from '../../../domain/entities/recipe';

export interface IRecipeQueryService {
  findByCategoryName(categoryName: string): Promise<Recipe[]>;
}
