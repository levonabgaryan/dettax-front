import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { JsonApiRecipeRepository } from './infrastructure/adapters/repositories/http-repositories/recipe-repository/json-api-recipe-repository';
import { HttpRecipeQueryService } from './infrastructure/adapters/query-services/http-recipe-query-service';
import { HTTP_USER_SERVICE, RECIPE_REPOSITORY } from './infrastructure/di';
import { HttpUserService } from './infrastructure/services/http-user-service';
import { HttpClient } from '@angular/common/http';
import { RECIPE_QUERY_SERVICE } from './infrastructure/di/query-services';
import {
  JsonApiCategoryRepository
} from './infrastructure/adapters/repositories/http-repositories/category-repository/json-api=category-repository';
import { CATEGORY_REPOSITORY } from './infrastructure/di/repositories';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: RECIPE_REPOSITORY, useClass: JsonApiRecipeRepository }, // UseClass tells Angular, create an instance of this class
    { provide: CATEGORY_REPOSITORY, useClass: JsonApiCategoryRepository },
    {
      provide: RECIPE_QUERY_SERVICE,
      useFactory: (httpClient: HttpClient) => new HttpRecipeQueryService(httpClient),
    },
    {
      provide: HTTP_USER_SERVICE,
      useFactory: (httpClient: HttpClient) => new HttpUserService(httpClient),
    },
  ],
};
