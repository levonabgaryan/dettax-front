import { InjectionToken } from '@angular/core';
import { IRecipeQueryService } from '../../core/application/ports/query-services/recipe-query-service';
import { ICategoryQueryService } from '../../core/application/ports/query-services/category-query-service';

export const RECIPE_QUERY_SERVICE = new InjectionToken<IRecipeQueryService>('RECIPE_QUERY_SERVICE');
export const CATEGORY_QUERY_SERVICE = new InjectionToken<ICategoryQueryService>(
  'CATEGORY_QUERY_SERVICE',
);
