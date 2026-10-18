// core/application/ports/repositories/recipe-categorization-repository.ts

export interface IRecipeCategorizationRepository {
  /**
   * Attaches categories to a recipe via the JSON:API relationship endpoint.
   * The API returns 204 No Content — no domain objects come back.
   */
  createManyAsync(dto: CreateRecipeCategorizationDTO): Promise<void>;

  /**
   * Removes categories from a recipe via the JSON:API relationship endpoint.
   */
  deleteManyByRecipeCategoryUuids(recipeId: string, categoryUuids: string[]): Promise<void>;
}

export type CreateRecipeCategorizationDTO = Readonly<{
  recipeId: string;
  categoryIds: string[];
}>;
