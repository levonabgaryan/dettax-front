import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { RECIPE_REPOSITORY } from './infrastructure/di/repositories/recipe';
import { HttpRecipeRepository } from './infrastructure/adapters/repositories/http-recipe-repository';
import { RecipeCRUDService } from './core/application/crud-services/recipe-crud-service';
import { IRecipeRepository } from './core/application/ports/repositories/recipe-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: RECIPE_REPOSITORY, useClass: HttpRecipeRepository },
    {
      provide: RecipeCRUDService,
      useFactory: (repo: IRecipeRepository) => new RecipeCRUDService(repo),
      deps: [RECIPE_REPOSITORY],
    },
  ],
};
