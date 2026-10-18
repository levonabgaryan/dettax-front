import { EntityBase } from './entityBase';

/**
 * Represents the fact that a recipe belongs to a category.
 * Think of it as a catalog card linking a recipe to a category.
 */
export class RecipeCategorization extends EntityBase {
  private readonly recipeId: string;
  private readonly categoryId: string;

  constructor(id: string, recipeId: string, categoryId: string, createdAt: Date, updatedAt: Date) {
    super(id, createdAt, updatedAt);
    this.recipeId = recipeId;
    this.categoryId = categoryId;
  }
  public getRecipeId(): string {
    return this.recipeId;
  }
  public getCategoryId(): string {
    return this.categoryId;
  }
}
