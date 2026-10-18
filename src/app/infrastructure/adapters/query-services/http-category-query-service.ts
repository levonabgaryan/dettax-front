import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Jsona } from 'jsona';
import { ICategoryQueryService } from '../../../core/application/ports/query-services/category-query-service';
import { Category } from '../../../core/domain/entities/category';

export class HttpCategoryQueryService implements ICategoryQueryService {
  private static readonly baseUrl = 'http://localhost:5247/categories';
  private static readonly headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });

  private readonly httpClient: HttpClient;
  private readonly jsona: Jsona;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.jsona = new Jsona();
  }

  public async getAllPaged(pageSize: number, pageNumber: number): Promise<Category[]> {
    let params = new HttpParams();
    params = params.append('page[number]', pageNumber.toString());
    params = params.append('page[size]', pageSize.toString());

    const rawResponse = await firstValueFrom(
      this.httpClient.get<Record<string, unknown>>(HttpCategoryQueryService.baseUrl, {
        headers: HttpCategoryQueryService.headers,
        params: params,
      }),
    );

    const deserialized = this.jsona.deserialize(rawResponse) as
      DeserializedCategory[] | { collection: DeserializedCategory[] };

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
