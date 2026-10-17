import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { JsonApiRecipeRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/json-api-recipe-repository';
import { CATEGORY_REPOSITORY, RECIPE_REPOSITORY } from './infrastructure/di/repositories';
import { HttpCategoryRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/http-category-repository';
import { HttpRecipeQueryService } from './infrastructure/adapters/query-services/http-recipe-query-service';
import { IRecipeRepository } from './core/application/ports/repositories/recipe-repository';
import { HTTP_USER_SERVICE } from './infrastructure/di';
import { HttpUserService } from './infrastructure/services/http-user-service';
import { HttpClient } from '@angular/common/http';
import { RECIPE_QUERY_SERVICE } from './infrastructure/di/query-services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: RECIPE_REPOSITORY, useClass: JsonApiRecipeRepository }, // UseClass tells Angular, create an instance of this class
    { provide: CATEGORY_REPOSITORY, useClass: HttpCategoryRepository },
    {
      provide: RECIPE_QUERY_SERVICE,
      useFactory: (recipeRepository: IRecipeRepository) =>
        new HttpRecipeQueryService(recipeRepository),
      deps: [RECIPE_REPOSITORY],
    },
    {
      provide: HTTP_USER_SERVICE,
      useFactory: (httpClient: HttpClient) => new HttpUserService(httpClient),
    },
  ],
};
