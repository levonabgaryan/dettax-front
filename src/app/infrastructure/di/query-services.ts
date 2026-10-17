import { InjectionToken } from '@angular/core';
import { IRecipeQueryService } from '../../core/application/ports/query-services/recipe-query-service';

export const RECIPE_QUERY_SERVICE = new InjectionToken<IRecipeQueryService>('RECIPE_QUERY_SERVICE');
