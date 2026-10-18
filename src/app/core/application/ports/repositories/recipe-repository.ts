import { Recipe } from '../../../domain/entities/recipe';
import { Ingredient } from '../../../domain/value-objects/ingredient';

export interface IRecipeRepository {
  create(dto: CreateRecipeDTO): Promise<Recipe>;
  update(updatedRecipe: Recipe): Promise<Recipe>;
}

export type CreateRecipeDTO = Readonly<{
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  authorId: string;
}>;
