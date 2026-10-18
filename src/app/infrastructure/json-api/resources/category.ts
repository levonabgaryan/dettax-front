import { RecipeResource } from './recipe';

/**
 * - Attributes: title, imgUrl, description, createdAt, updatedAt
 * - Relationship: recipes (hasMany) — present only when `?include=recipes`
 */
export interface CategoryResource {
  id: string;
  title: string;
  imgUrl: string | null;
  description: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string;
  recipes?: RecipeResource[];
}
