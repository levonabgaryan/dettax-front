import { InjectionToken } from '@angular/core';
import { IRecipeRepository } from '../../../core/application/ports/repositories/recipe-repository';

export const RECIPE_REPOSITORY = new InjectionToken<IRecipeRepository>('RECIPE_REPOSITORY');
