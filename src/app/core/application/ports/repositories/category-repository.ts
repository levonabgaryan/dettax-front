import { Category } from '../../../domain/entities/category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
}
