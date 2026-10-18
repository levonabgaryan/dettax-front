// infrastructure/adapters/json-api/resources/author.resource.ts

import { RecipeResource } from './recipe';

/**
 * - Attributes: firstName, lastName, email, createdAt, updatedAt
 * - Relationship: recipes (hasMany) — present only when `?include=recipes`
 */
export interface AuthorResource {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
  recipes?: RecipeResource[];
}
