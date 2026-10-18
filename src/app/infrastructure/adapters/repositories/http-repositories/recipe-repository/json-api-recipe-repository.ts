import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Jsona } from 'jsona';
import {
  CreateRecipeDTO,
  IRecipeRepository,
} from '../../../../../core/application/ports/repositories/recipe-repository';
import { Recipe } from '../../../../../core/domain/entities/recipe';
import { Ingredient } from '../../../../../core/domain/value-objects/ingredient';
import { Category } from '../../../../../core/domain/entities/category';
import { Author } from '../../../../../core/domain/entities/author';

export class JsonApiRecipeRepository implements IRecipeRepository {
  private static readonly baseUrl = 'http://localhost:5247/recipes';
  private static readonly headers = new HttpHeaders({
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  });

  private readonly httpClient: HttpClient;
  private readonly jsona: Jsona;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.jsona = new Jsona();
  }

  public async getById(id: string): Promise<Recipe> {
    const url = `${JsonApiRecipeRepository.baseUrl}/${id}`;

    const params = new HttpParams().append('include', 'author,categories');

    const rawResponse = await firstValueFrom(
      this.httpClient.get<Record<string, unknown>>(url, {
        headers: JsonApiRecipeRepository.headers,
        params: params,
      }),
    );

    const deserialized = this.jsona.deserialize(rawResponse) as DeserializedRecipe;

    return this.mapJsonaToDomain(deserialized);
  }

  public async create(dto: CreateRecipeDTO): Promise<Recipe> {
    const payload = {
      data: {
        type: 'recipes',
        attributes: {
          title: dto.name,
          country: dto.country,
          description: dto.description ?? null,
          imageUrl: dto.imageUrl ?? null,
          ingredients: dto.ingredients.map((i) => ({
            name: i.name,
            amount: i.amount,
            unit: i.unit,
          })),
        },
        relationships: {
          author: {
            data: { type: 'authors', id: dto.authorId },
          },
        },
      },
    };

    const response = await firstValueFrom(
      this.httpClient.post<RecipeDocumentJsonApi>(JsonApiRecipeRepository.baseUrl, payload, {
        headers: JsonApiRecipeRepository.headers,
      }),
    );

    const createdRecipeId = response.data.id;

    if (dto.categoriesIds && dto.categoriesIds.size > 0) {
      const categoriesPayload = {
        data: Array.from(dto.categoriesIds).map((categoryId) => ({
          type: 'categories',
          id: categoryId,
        })),
      };

      await firstValueFrom(
        this.httpClient.post(
          `${JsonApiRecipeRepository.baseUrl}/${createdRecipeId}/relationships/categories`,
          categoriesPayload,
          { headers: JsonApiRecipeRepository.headers },
        ),
      );
    }

    return this.mapResponseToDomain(response.data, undefined, dto.categoriesIds);
  }

  public async update(updatedRecipe: Recipe): Promise<Recipe> {
    const id = updatedRecipe.getId();
    const url = `${JsonApiRecipeRepository.baseUrl}/${id}`;

    const payload = {
      data: {
        type: 'recipes',
        id: id,
        attributes: {
          title: updatedRecipe.getName(),
          country: updatedRecipe.getCountry(),
          description: updatedRecipe.getDescription(),
          imageUrl: updatedRecipe.getImageUrl(),
          ingredients: updatedRecipe.getIngredients().map((i) => ({
            name: i.name,
            amount: i.amount,
            unit: i.unit,
          })),
        },
      },
    };

    const response = await firstValueFrom(
      this.httpClient.patch<RecipeDocumentJsonApi>(url, payload, {
        headers: JsonApiRecipeRepository.headers,
      }),
    );

    return this.mapResponseToDomain(response.data, updatedRecipe);
  }

  private mapResponseToDomain(
    data: RecipeResourceJsonApi,
    existing?: Recipe,
    newCategoriesIds?: Set<string>,
  ): Recipe {
    const attrs = data.attributes;
    const ingredients = attrs.ingredients.map((i) => new Ingredient(i.name, i.amount, i.unit));
    const author = existing ? existing.getAuthor() : null;
    const categories = new Set<Category>(existing ? existing.getCategories() : []);

    if (newCategoriesIds) {
      for (const catId of newCategoriesIds) {
        categories.add(new Category(catId, '', null, null, new Date(), new Date()));
      }
    }

    return new Recipe(
      data.id,
      attrs.title,
      attrs.country,
      categories as Set<Category>,
      author,
      attrs.description,
      ingredients,
      attrs.imageUrl,
      new Date(attrs.createdAt),
      new Date(attrs.updatedAt),
    );
  }

  private mapJsonaToDomain(item: DeserializedRecipe): Recipe {
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


export interface IngredientJsonApi {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeAttributesJsonApi {
  title: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: IngredientJsonApi[];
  createdAt: string;
  updatedAt: string;
}

export interface JsonApiRelationshipLinks {
  self: string;
  related: string;
}

export interface RecipeRelationshipsJsonApi {
  author: { links: JsonApiRelationshipLinks };
  categories: { links: JsonApiRelationshipLinks };
}

export interface RecipeResourceJsonApi {
  type: 'recipes';
  id: string;
  attributes: RecipeAttributesJsonApi;
  relationships: RecipeRelationshipsJsonApi;
  links: { self: string };
}

export interface RecipeDocumentJsonApi {
  links: { self: string };
  data: RecipeResourceJsonApi;
}


interface DeserializedRecipe {
  id: string;
  title: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: IngredientJsonApi[];
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
