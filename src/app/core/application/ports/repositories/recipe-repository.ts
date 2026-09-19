import { Recipe } from '../../../domain/entities/recipe';
import { CategoryValueObject } from '../../../domain/value-objects/category-value-object';
/**
 * This class is just supposed to have CRUD methods, complex searching things is supposed to implement
 * into query-services
 */
export interface IRecipeRepository {
  getById(id: number): Promise<Recipe | null>;
  getAllCategoryValueObjects(): Promise<CategoryValueObject[]>;
}
