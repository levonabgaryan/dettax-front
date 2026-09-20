import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpRecipeRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/http-recipe-repository';
import {
  CATEGORY_REPOSITORY,
  RECIPE_QUERY_SERVICE,
  RECIPE_REPOSITORY,
} from './infrastructure/di/repositories';
import { HttpCategoryRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/http-category-repository';
import { HttpRecipeQueryService } from './infrastructure/adapters/query-services/http-recipe-query-service';
import { IRecipeRepository } from './core/application/ports/repositories/recipe-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: RECIPE_REPOSITORY, useClass: HttpRecipeRepository }, // UseClass tells Angular, create an instance of this class
    { provide: CATEGORY_REPOSITORY, useClass: HttpCategoryRepository },
    {
      provide: RECIPE_QUERY_SERVICE,
      useFactory: (recipeRepository: IRecipeRepository) =>
        new HttpRecipeQueryService(recipeRepository),
      deps: [RECIPE_REPOSITORY],
    },
  ],
};
