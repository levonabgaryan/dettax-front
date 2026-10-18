import { Category } from '../../../domain/entities/category';

export interface ICategoryQueryService {
  getAllPaged(pageSize: number, pageNumber: number): Promise<Category[]>;
}
