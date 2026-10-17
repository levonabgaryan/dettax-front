import { EntityBase } from './entityBase';
import { Recipe } from './recipe';

export class Author extends EntityBase {
  private name: string;
  private lastName: string;
  private readonly email: string;
  private readonly recipes: Set<Recipe>;

  constructor(
    id: string,
    name: string,
    lastName: string,
    email: string,
    recipes: Set<Recipe>,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.recipes = new Set(recipes);
  }

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.name = newName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public setLastName(newLastName: string): void {
    this.lastName = newLastName;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRecipes(): ReadonlySet<Recipe> {
    return this.recipes;
  }

  public addNewRecipe(recipe: Recipe): void {
    this.recipes.add(recipe);
  }

  public removeRecipeById(recipeId: string): void {
    const recipeToRemove = Array.from(this.recipes).find((recipe) => recipe.getId() === recipeId);

    if (recipeToRemove) {
      this.recipes.delete(recipeToRemove);
    }
  }
}
