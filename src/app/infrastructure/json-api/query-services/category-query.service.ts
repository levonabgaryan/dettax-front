import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Jsona } from 'jsona';

import type { JsonApiEnvelope, PaginatedResult } from './json-api-envelope';
import type { CategoryResource } from '../resources/category';

export class DevourCategoryQueryService {
  private static readonly baseUrl = 'http://localhost:5247/categories';
  private static readonly headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });

  private readonly httpClient: HttpClient;
  private readonly jsona: Jsona;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.jsona = new Jsona();
  }

  public async getById(id: string): Promise<CategoryResource> {
    const raw = await firstValueFrom(
      this.httpClient.get<JsonApiEnvelope>(`${DevourCategoryQueryService.baseUrl}/${id}`, {
        headers: DevourCategoryQueryService.headers,
        params: new HttpParams().append('include', 'recipes'),
      }),
    );

    return this.jsona.deserialize(raw as never) as CategoryResource;
  }

  public async getAllPaged(page: number, size: number): Promise<PaginatedResult<CategoryResource>> {
    const params = new HttpParams()
      .append('page[number]', page.toString())
      .append('page[size]', size.toString());

    const raw = await firstValueFrom(
      this.httpClient.get<JsonApiEnvelope>(DevourCategoryQueryService.baseUrl, {
        headers: DevourCategoryQueryService.headers,
        params,
      }),
    );

    const deserialized = this.jsona.deserialize(raw as never) as
      | CategoryResource
      | CategoryResource[];
    const data = Array.isArray(deserialized) ? deserialized : [deserialized];

    return {
      data,
      total: raw.meta?.total ?? data.length,
      page,
      pageSize: size,
    };
  }
}
