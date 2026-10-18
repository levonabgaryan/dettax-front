import { Category } from '../../../domain/entities/category';

export interface ICategoryRepository {
  getById(id: string): Promise<Category>;
}
