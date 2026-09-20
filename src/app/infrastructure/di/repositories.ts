import { InjectionToken } from '@angular/core';
import { IRecipeRepository } from '../../core/application/ports/repositories/recipe-repository';
import { ICategoryRepository } from '../../core/application/ports/repositories/category-repository';
import { IRecipeQueryService } from '../../core/application/ports/query-services/recipe-query-service';

// Since interfaces are erased during compilation to JavaScript,
// Angular cannot use them as runtime keys. That's why we create a real runtime object — an InjectionToken
// like RECIPE_REPOSITORY — to act as a unique key. The interface itself (IRecipeRepository) is only used
// by TypeScript for type‑checking, so we pass the token instead of the interface name.

export const RECIPE_REPOSITORY = new InjectionToken<IRecipeRepository>('RECIPE_REPOSITORY');
export const CATEGORY_REPOSITORY = new InjectionToken<ICategoryRepository>('CATEGORY_REPOSITORY');
export const RECIPE_QUERY_SERVICE = new InjectionToken<IRecipeQueryService>('RECIPE_QUERY_SERVICE');
