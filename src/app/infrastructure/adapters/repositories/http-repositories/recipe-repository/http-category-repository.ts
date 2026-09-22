import { ICategoryRepository } from '../../../../../core/application/ports/repositories/category-repository';
import { Category } from '../../../../../core/domain/entities/category';
import { CategoriesAreNotLoadedError } from '../../../../../core/application/errors/categories-are-not-loaded-error';
import { HttpError } from '../../../../errors/http-error';
import { AllCategoriesSchema, CategorySchemaType } from './response-schemas';

export class HttpCategoryRepository implements ICategoryRepository {
  private static readonly apiBaseUrl = '/api/json/v1/1/';
  private static readonly getAllCategoriesUrl = `${HttpCategoryRepository.apiBaseUrl}categories.php`;

  public async getAll(): Promise<Category[]> {
    let allCategoriesResponse: Response;

    try {
      allCategoriesResponse = await fetch(HttpCategoryRepository.getAllCategoriesUrl);
    } catch (cause) {
      throw new CategoriesAreNotLoadedError(cause);
    }
    if (!allCategoriesResponse.ok) {
      throw new CategoriesAreNotLoadedError(new HttpError(allCategoriesResponse.status));
    }

    const allParsedCategoriesContent = AllCategoriesSchema.safeParse(
      await allCategoriesResponse.json(),
    );
    if (!allParsedCategoriesContent.success) {
      throw new CategoriesAreNotLoadedError(allParsedCategoriesContent.error);
    }

    return allParsedCategoriesContent.data.categories.map((c) => this.toEntity(c));
  }
  public async getById(id: number): Promise<Category | null> {
    // Since API doesn't provide an API for this case, we will get all of the categories and filter by specific id
    const allCategories = await this.getAll();

    const foundCategories = allCategories.filter((c) => c.getId() === id); // filter is supposed to return array with one element, since id is unique
    if (foundCategories.length === 0) {
      return null;
    }
    return foundCategories[0];
  }

  private toEntity(categorySchema: CategorySchemaType): Category {
    return new Category(
      categorySchema.idCategory,
      categorySchema.strCategory,
      categorySchema.strCategoryDescription,
      categorySchema.strCategoryThumb,
    );
  }
}
