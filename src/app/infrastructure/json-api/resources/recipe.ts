import { AuthorResource } from './author';
import { CategoryResource } from './category';

/**
 * - Attributes: title, country, description, imageUrl, ingredients, createdAt, updatedAt
 * - Relationship: author (hasOne)    — present only when `?include=author`
 * - Relationship: categories (hasMany) — present only when `?include=categories`
 */
export interface RecipeResource {
  id: string;
  title: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: IngredientResource[];
  createdAt: string; // ISO 8601
  updatedAt: string;
  author?: AuthorResource | null; // null means author was deleted
  categories?: CategoryResource[];
}

export interface IngredientResource {
  name: string;
  amount: number;
  unit: string;
}
