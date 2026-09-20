import { Recipe } from '../../../domain/entities/recipe';

export interface IRecipeQueryService {
  getByCategoryName(categoryName: string): Promise<Recipe[]>;
}
