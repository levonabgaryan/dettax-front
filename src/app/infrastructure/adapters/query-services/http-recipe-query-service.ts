import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Jsona } from 'jsona';
import {
  IRecipeQueryService,
  PaginatedRecipes,
} from '../../../core/application/ports/query-services/recipe-query-service';
import { Category } from '../../../core/domain/entities/category';
import { Author } from '../../../core/domain/entities/author';
import { Recipe } from '../../../core/domain/entities/recipe';
import { Ingredient } from '../../../core/domain/value-objects/ingredient';

interface JsonApiMeta {
  total?: number;
}

export class HttpRecipeQueryService implements IRecipeQueryService {
  private static readonly baseUrl = 'http://localhost:5247';
  private static readonly headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });

  private readonly httpClient: HttpClient;
  private readonly jsona: Jsona;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.jsona = new Jsona();
  }

  public async getAllPaged(pageSize: number, pageNumber: number): Promise<PaginatedRecipes> {
    const url = `${HttpRecipeQueryService.baseUrl}/recipes`;
    return this.fetchAndMapRecipes(url, pageSize, pageNumber);
  }

  public async getAllByCategoryPaged(
    category: Category,
    pageSize: number,
    pageNumber: number,
  ): Promise<Recipe[]> {
    const url = `${HttpRecipeQueryService.baseUrl}/categories/${category.getId()}/recipes`;
    const result = await this.fetchAndMapRecipes(url, pageSize, pageNumber);
    return result.data;
  }

  public async getAllByAuthorPaged(
    author: Author,
    pageSize: number,
    pageNumber: number,
  ): Promise<Recipe[]> {
    const url = `${HttpRecipeQueryService.baseUrl}/authors/${author.getId()}/recipes`;
    const result = await this.fetchAndMapRecipes(url, pageSize, pageNumber);
    return result.data;
  }

  // Общий метод для загрузки
  private async fetchAndMapRecipes(
    url: string,
    pageSize: number,
    pageNumber: number,
  ): Promise<PaginatedRecipes> {
    let params = new HttpParams();
    params = params.append('page[number]', pageNumber.toString());
    params = params.append('page[size]', pageSize.toString());
    params = params.append('include', 'author,categories');

    const rawResponse = await firstValueFrom(
      this.httpClient.get<Record<string, unknown>>(url, {
        headers: HttpRecipeQueryService.headers,
        params: params,
      }),
    );

    const total = (rawResponse['meta'] as JsonApiMeta)?.total || 0;

    const deserialized = this.jsona.deserialize(rawResponse as unknown as never) as
      DeserializedRecipe[] | { collection: DeserializedRecipe[] };

    const items: DeserializedRecipe[] = Array.isArray(deserialized)
      ? deserialized
      : deserialized.collection || [];

    return {
      data: items.map((item) => this.mapToDomain(item)),
      total: total,
    };
  }

  private mapToDomain(item: DeserializedRecipe): Recipe {
    const author = item.author
      ? new Author(
          item.author.id,
          item.author.firstName,
          item.author.lastName,
          item.author.email,
          new Set(),
          new Date(item.author.createdAt || Date.now()),
          new Date(item.author.updatedAt || Date.now()),
        )
      : null;

    const categories = new Set<Category>();
    if (item.categories && Array.isArray(item.categories)) {
      for (const cat of item.categories) {
        categories.add(
          new Category(
            cat.id,
            cat.title,
            cat.description,
            cat.imgUrl,
            new Date(cat.createdAt),
            new Date(cat.updatedAt),
          ),
        );
      }
    }

    const ingredients = (item.ingredients || []).map(
      (i) => new Ingredient(i.name, i.amount, i.unit),
    );

    return new Recipe(
      item.id,
      item.title,
      item.country,
      categories,
      author,
      item.description,
      ingredients,
      item.imageUrl,
      new Date(item.createdAt),
      new Date(item.updatedAt),
    );
  }
}

interface DeserializedRecipe {
  id: string;
  title: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: { name: string; amount: number; unit: string }[];
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  categories?: {
    id: string;
    title: string;
    description: string | null;
    imgUrl: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
}
