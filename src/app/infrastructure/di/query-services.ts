import { InjectionToken } from '@angular/core';

import type { DevourRecipeQueryService } from '../json-api/query-services/recipe-query.service';
import type { DevourCategoryQueryService } from '../json-api/query-services/category-query.service';
import type { DevourAuthorQueryService } from '../json-api/query-services/author-query.service';

/**
 * DI tokens for query services.
 *
 * Query services are read-only — they fetch resources from the API
 * without going through the domain layer. There is no interface on
 * purpose: the resource shape (RecipeResource, CategoryResource, ...)
 * is the contract, and it lives next to the service implementation.
 */
export const RECIPE_QUERY_SERVICE =
  new InjectionToken<DevourRecipeQueryService>('RECIPE_QUERY_SERVICE');

export const CATEGORY_QUERY_SERVICE =
  new InjectionToken<DevourCategoryQueryService>('CATEGORY_QUERY_SERVICE');

export const AUTHOR_QUERY_SERVICE =
  new InjectionToken<DevourAuthorQueryService>('AUTHOR_QUERY_SERVICE');
