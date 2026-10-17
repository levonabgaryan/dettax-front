import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  CreateRecipeDTO,
  IRecipeRepository,
} from '../../../../../core/application/ports/repositories/recipe-repository';
import { Recipe } from '../../../../../core/domain/entities/recipe';
import { Ingredient } from '../../../../../core/domain/value-objects/ingredient';
import { Category } from '../../../../../core/domain/entities/category';

export class JsonApiRecipeRepository implements IRecipeRepository {
  private static readonly baseUrl = 'http://localhost:5247/recipes';
  private static readonly headers = new HttpHeaders({
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  });

  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async create(dto: CreateRecipeDTO): Promise<Recipe> {
    // ─── Step 1: Create the recipe base entity ──────────────────────
    // JSON:API requires creating the resource first without to-many relationships.
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

    // ─── Step 2: Attach categories (if any) ─────────────────────────
    // Because the backend does not support adding categories during recipe creation,
    // we have to make a separate request to the relationships' endpoint.
    if (dto.categoriesIds && dto.categoriesIds.size > 0) {
      const categoriesPayload = {
        data: Array.from(dto.categoriesIds).map((categoryId) => ({
          type: 'categories',
          id: categoryId,
        })),
      };

      // This request returns 204 No Content on success
      await firstValueFrom(
        this.httpClient.post(
          `${JsonApiRecipeRepository.baseUrl}/${createdRecipeId}/relationships/categories`,
          categoriesPayload,
          { headers: JsonApiRecipeRepository.headers },
        ),
      );
    }

    // ─── Step 3: Map to Domain Entity ───────────────────────────────
    // We pass the categoriesIds to the mapper so the returned Recipe object
    // already knows about its categories, even though the server didn't return them.
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

    // If we just created a recipe, we use the IDs we sent to construct stub categories.
    // If we are updating, we keep the existing ones.
    const categories = new Set<Category>(existing ? existing.getCategories() : []);

    if (newCategoriesIds) {
      for (const catId of newCategoriesIds) {
        // We create a stub Category with only the ID.
        // If the UI needs the full category name/img, it should call getById() later.
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
