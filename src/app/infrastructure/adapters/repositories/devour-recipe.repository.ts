import { firstValueFrom } from 'rxjs';
import type { JsonApi } from 'devour-client-ts';

import {
  CreateRecipeDTO,
  IRecipeRepository,
} from '../../../core/application/ports/repositories/recipe-repository';
import { Recipe } from '../../../core/domain/entities/recipe';
import { RecipeResource } from '../../json-api/resources/recipe';
import { RecipeMapper } from '../../json-api/mappers/recipe.mapper';

export class DevourRecipeRepository implements IRecipeRepository {
  private readonly jsonApi: JsonApi;

  constructor(jsonApi: JsonApi) {
    this.jsonApi = jsonApi;
  }

  // ─── CREATE ─────────────────────────────────────────────────────

  public async create(dto: CreateRecipeDTO): Promise<Recipe> {
    // POST /recipes accepts the recipe attributes and the author relationship.
    // Categories are managed separately (via the relationships endpoint)
    // and are intentionally not part of this DTO.
    const resource = (await firstValueFrom(
      this.jsonApi.create('recipes', {
        title: dto.name,
        country: dto.country,
        description: dto.description ?? null,
        imageUrl: dto.imageUrl ?? null,
        ingredients: dto.ingredients.map((i) => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit,
        })),
        author: { id: dto.authorId },
      }),
    )) as RecipeResource;

    // The POST response does not include the `author` object,
    // so we pass `dto.authorId` explicitly to the mapper.
    return RecipeMapper.toDomain(resource, dto.authorId);
  }

  // ─── UPDATE ─────────────────────────────────────────────────────

  public async update(recipe: Recipe): Promise<Recipe> {
    // PATCH /recipes/{id} accepts only attributes.
    // The author cannot be changed here — there is a separate endpoint.
    const resource = (await firstValueFrom(
      this.jsonApi.update('recipes', recipe.getId(), {
        title: recipe.getName(),
        country: recipe.getCountry(),
        description: recipe.getDescription(),
        imageUrl: recipe.getImageUrl(),
        ingredients: recipe.getIngredients().map((i) => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit,
        })),
      }),
    )) as RecipeResource;

    // The PATCH response does not include the `author` object,
    // so we preserve `authorId` from the input recipe.
    return RecipeMapper.toDomain(resource, recipe.getAuthorId());
  }
}
