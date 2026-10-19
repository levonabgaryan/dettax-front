import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Jsona } from 'jsona';

import type { JsonApiEnvelope, PaginatedResult } from './json-api-envelope';
import type { RecipeResource } from '../resources/recipe';

export class DevourRecipeQueryService {
  private static readonly baseUrl = 'http://localhost:5247';
  private static readonly headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });
  private static readonly DEFAULT_INCLUDE = 'author,categories';

  private readonly httpClient: HttpClient;
  private readonly jsona: Jsona;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.jsona = new Jsona();
  }

  public async getById(id: string): Promise<RecipeResource> {
    const raw = await firstValueFrom(
      this.httpClient.get<JsonApiEnvelope>(`${DevourRecipeQueryService.baseUrl}/recipes/${id}`, {
        headers: DevourRecipeQueryService.headers,
        params: new HttpParams().append('include', DevourRecipeQueryService.DEFAULT_INCLUDE),
      }),
    );

    return this.jsona.deserialize(raw as never) as RecipeResource;
  }

  public async getAllPaged(page: number, size: number): Promise<PaginatedResult<RecipeResource>> {
    return this.fetchPaged(`${DevourRecipeQueryService.baseUrl}/recipes`, page, size);
  }

  public async getByCategoryId(
    categoryId: string,
    page: number,
    size: number,
  ): Promise<PaginatedResult<RecipeResource>> {
    return this.fetchPaged(
      `${DevourRecipeQueryService.baseUrl}/categories/${categoryId}/recipes`,
      page,
      size,
    );
  }

  public async getByAuthorId(
    authorId: string,
    page: number,
    size: number,
  ): Promise<PaginatedResult<RecipeResource>> {
    return this.fetchPaged(
      `${DevourRecipeQueryService.baseUrl}/authors/${authorId}/recipes`,
      page,
      size,
    );
  }

  private async fetchPaged(
    url: string,
    page: number,
    size: number,
  ): Promise<PaginatedResult<RecipeResource>> {
    const params = new HttpParams()
      .append('page[number]', page.toString())
      .append('page[size]', size.toString())
      .append('include', DevourRecipeQueryService.DEFAULT_INCLUDE);

    const raw = await firstValueFrom(
      this.httpClient.get<JsonApiEnvelope>(url, {
        headers: DevourRecipeQueryService.headers,
        params,
      }),
    );

    const deserialized = this.jsona.deserialize(raw as never) as RecipeResource | RecipeResource[];
    const data = Array.isArray(deserialized) ? deserialized : [deserialized];

    return {
      data,
      total: raw.meta?.total ?? data.length,
      page,
      pageSize: size,
    };
  }
}
