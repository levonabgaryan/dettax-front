import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { RECIPE_REPOSITORY } from './infrastructure/di/repositories/recipe';
import { HttpRecipeRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/http-recipe-repository';
import { RecipeCRUDService } from './core/application/crud-services/recipe-crud-service';
import { IRecipeRepository } from './core/application/ports/repositories/recipe-repository';
import { RecipeQueryServices } from './core/application/query-services/recipe-query-services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: RECIPE_REPOSITORY, useClass: HttpRecipeRepository }, // UseClass tells Angular, create an instance of this class
    {
      provide: RecipeCRUDService,
      useFactory: (repo: IRecipeRepository) => new RecipeCRUDService(repo), // useFactory tells Angular, use my custom class
      deps: [RECIPE_REPOSITORY], // deps is a place where are located class realisations.
    },
    {
      provide: RecipeQueryServices,
      useFactory: (repo: IRecipeRepository) => new RecipeQueryServices(repo),
      deps: [RECIPE_REPOSITORY],
    },
  ],
};
