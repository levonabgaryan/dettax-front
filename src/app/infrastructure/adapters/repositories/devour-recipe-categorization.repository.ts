import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  CreateRecipeCategorizationDTO,
  IRecipeCategorizationRepository,
} from '../../../core/application/ports/repositories/recipe-categorization-repository';

const JSON_API_HEADERS = new HttpHeaders({
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
});

export class DevourRecipeCategorizationRepository implements IRecipeCategorizationRepository {
  private readonly httpClient: HttpClient;
  private readonly baseUrl: string;

  constructor(httpClient: HttpClient, baseUrl = 'http://localhost:5247') {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  public async createManyAsync(dto: CreateRecipeCategorizationDTO): Promise<void> {
    if (dto.categoryIds.length === 0) return;

    await firstValueFrom(
      this.httpClient.post(
        `${this.baseUrl}/recipes/${dto.recipeId}/relationships/categories`,
        {
          data: dto.categoryIds.map((id) => ({ type: 'categories', id })),
        },
        { headers: JSON_API_HEADERS },
      ),
    );
  }

  public async deleteManyByRecipeCategoryUuids(
    recipeId: string,
    categoryUuids: string[],
  ): Promise<void> {
    if (categoryUuids.length === 0) return;

    // JSON:API allows a body in DELETE — Angular HttpClient supports it
    // via the `body` option in the request config.
    await firstValueFrom(
      this.httpClient.delete(`${this.baseUrl}/recipes/${recipeId}/relationships/categories`, {
        headers: JSON_API_HEADERS,
        body: {
          data: categoryUuids.map((id) => ({ type: 'categories', id })),
        },
      }),
    );
  }
}
