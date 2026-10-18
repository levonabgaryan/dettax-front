import { InjectionToken } from '@angular/core';
import type { IRecipeRepository } from '../../core/application/ports/repositories/recipe-repository';
import type { ICategoryRepository } from '../../core/application/ports/repositories/category-repository';

// Since interfaces are erased during compilation to JavaScript,
// Angular cannot use them as runtime keys. That's why we create a real
// runtime object — an InjectionToken like RECIPE_REPOSITORY — to act as a
// unique key. The interface itself (IRecipeRepository) is only used by
// TypeScript for type-checking, so we pass the token instead of the
// interface name.

export const RECIPE_REPOSITORY =
  new InjectionToken<IRecipeRepository>('RECIPE_REPOSITORY');

export const CATEGORY_REPOSITORY =
  new InjectionToken<ICategoryRepository>('CATEGORY_REPOSITORY');
