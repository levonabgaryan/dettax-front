import { Recipe } from '../../../domain/entities/recipe';
import { Category } from '../../../domain/entities/category';

export interface IRecipeQueryService {
  getAllByCategoryPaged(
    category: Category,
    pageSize: number,
    pageNumber: number,
  ): Promise<Recipe[]>;
}
