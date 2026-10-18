import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Jsona } from 'jsona';
import { ICategoryRepository } from '../../../../../core/application/ports/repositories/category-repository';
import { Category } from '../../../../../core/domain/entities/category';

export class JsonApiCategoryRepository implements ICategoryRepository {
  private static readonly baseUrl = 'http://localhost:5247/categories';
  private static readonly headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });

  private readonly httpClient: HttpClient;
  private readonly jsona: Jsona;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.jsona = new Jsona();
  }

  public async getById(id: string): Promise<Category> {
    const url = `${JsonApiCategoryRepository.baseUrl}/${id}`;

    const rawResponse = await firstValueFrom(
      this.httpClient.get<Record<string, unknown>>(url, {
        headers: JsonApiCategoryRepository.headers,
      }),
    );

    const deserialized = this.jsona.deserialize(rawResponse) as DeserializedCategory;

    return this.mapToDomain(deserialized);
  }

  public async getAll(): Promise<Category[]> {
    const rawResponse = await firstValueFrom(
      this.httpClient.get<Record<string, unknown>>(JsonApiCategoryRepository.baseUrl, {
        headers: JsonApiCategoryRepository.headers,
      }),
    );

    const deserialized = this.jsona.deserialize(rawResponse) as
      | DeserializedCategory[]
      | { collection: DeserializedCategory[] };

    const items: DeserializedCategory[] = Array.isArray(deserialized)
      ? deserialized
      : deserialized.collection || [];

    return items.map((item) => this.mapToDomain(item));
  }

  private mapToDomain(item: DeserializedCategory): Category {
    return new Category(
      item.id,
      item.title,
      item.description,
      item.imgUrl,
      new Date(item.createdAt),
      new Date(item.updatedAt),
    );
  }
}


interface DeserializedCategory {
  id: string;
  title: string;
  description: string | null;
  imgUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
