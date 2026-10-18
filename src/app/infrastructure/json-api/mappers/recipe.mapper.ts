// infrastructure/mappers/recipe.mapper.ts

import { Recipe } from '../../../core/domain/entities/recipe';
import { RecipeResource } from '../resources/recipe';

export class RecipeMapper {
  /**
   * Maps a JSON:API RecipeResource to the domain Recipe.
   *
   * `authorIdOverride` is used when the source resource does not include
   * the `author` relationship (e.g. responses from POST/PATCH, which don't
   * accept `include`). Falls back to `resource.author?.id` when omitted.
   */
  public static toDomain(resource: RecipeResource, authorIdOverride?: string | null): Recipe {
    return new Recipe(
      resource.id,
      authorIdOverride ?? resource.author?.id ?? '',
      resource.title,
      resource.country,
      resource.description,
      resource.ingredients,
      resource.imageUrl,
      new Date(resource.createdAt),
      new Date(resource.updatedAt),
    );
  }
}
