import { InjectionToken } from '@angular/core';
import { IRecipeRepository } from '../../../core/application/ports/repositories/recipe-repository';

export const RECIPE_REPOSITORY = new InjectionToken<IRecipeRepository>('RECIPE_REPOSITORY');
// Since interfaces are erased during compilation to JavaScript,
// Angular cannot use them as runtime keys. That's why we create a real runtime object — an InjectionToken
// like RECIPE_REPOSITORY — to act as a unique key. The interface itself (IRecipeRepository) is only used
// by TypeScript for type‑checking, so we pass the token instead of the interface name.
