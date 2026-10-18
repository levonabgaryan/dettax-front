import { Recipe } from '../../../domain/entities/recipe';
import { Category } from '../../../domain/entities/category';
import { Author } from '../../../domain/entities/author';

export interface IRecipeQueryService {
  getAllByCategoryPaged(
    category: Category,
    pageSize: number,
    pageNumber: number,
  ): Promise<Recipe[]>;

  getAllByAuthorPaged(author: Author, pageSize: number, pageNumber: number): Promise<Recipe[]>;
  getAllPaged(pageSize: number, pageNumber: number): Promise<PaginatedRecipes>;
}

export interface PaginatedRecipes {
  data: Recipe[];
  total: number;
}
