import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { JsonApiRecipeRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/json-api-recipe-repository';
import { JsonApiCategoryRepository } from './infrastructure/adapters/repositories/http-repositories/category-repository/json-api-category-repository';
import { HttpRecipeQueryService } from './infrastructure/adapters/query-services/http-recipe-query-service';
import { HttpCategoryQueryService } from './infrastructure/adapters/query-services/http-category-query-service';
import { HttpUserService } from './infrastructure/services/http-user-service';

import { RECIPE_REPOSITORY, CATEGORY_REPOSITORY } from './infrastructure/di/repositories';
import { RECIPE_QUERY_SERVICE, CATEGORY_QUERY_SERVICE } from './infrastructure/di/query-services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    {
      provide: RECIPE_REPOSITORY,
      useFactory: (httpClient: HttpClient) => new JsonApiRecipeRepository(httpClient),
      deps: [HttpClient],
    },
    {
      provide: CATEGORY_REPOSITORY,
      useFactory: (httpClient: HttpClient) => new JsonApiCategoryRepository(httpClient),
      deps: [HttpClient],
    },

    {
      provide: RECIPE_QUERY_SERVICE,
      useFactory: (httpClient: HttpClient) => new HttpRecipeQueryService(httpClient),
      deps: [HttpClient],
    },
    {
      provide: CATEGORY_QUERY_SERVICE,
      useFactory: (httpClient: HttpClient) => new HttpCategoryQueryService(httpClient),
      deps: [HttpClient],
    },
    {
      provide: HttpUserService,
      useFactory: (httpClient: HttpClient) => new HttpUserService(httpClient),
      deps: [HttpClient],
    },
  ],
};
