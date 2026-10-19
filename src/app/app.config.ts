import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JsonApi } from 'devour-client-ts';

import { routes } from './app.routes';
import { createJsonApi } from './infrastructure/json-api/resources.relationships';
import { DevourRecipeRepository } from './infrastructure/adapters/repositories/devour-recipe.repository';
import { RECIPE_REPOSITORY } from './infrastructure/di/repositories';
import { DevourRecipeQueryService } from './infrastructure/json-api/query-services/recipe-query.service';
import { DevourCategoryQueryService } from './infrastructure/json-api/query-services/category-query.service';
import { DevourAuthorQueryService } from './infrastructure/json-api/query-services/author-query.service';
import {
  RECIPE_QUERY_SERVICE,
  CATEGORY_QUERY_SERVICE,
  AUTHOR_QUERY_SERVICE,
} from './infrastructure/di/query-services';

import { HttpUserService } from './infrastructure/services/http-user-service';
import { authInterceptor } from './infrastructure/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // ─── JsonApi (singleton) ──────────────────────────────────
    {
      provide: JsonApi,
      useFactory: createJsonApi,
    },

    // ─── Repositories (write) ─────────────────────────────────
    {
      provide: RECIPE_REPOSITORY,
      useFactory: (jsonApi: JsonApi) => new DevourRecipeRepository(jsonApi),
      deps: [JsonApi],
    },

    // ─── Query services (read) ────────────────────────────────
    {
      provide: RECIPE_QUERY_SERVICE,
      useFactory: (httpClient: HttpClient) => new DevourRecipeQueryService(httpClient),
      deps: [HttpClient],
    },
    {
      provide: CATEGORY_QUERY_SERVICE,
      useFactory: (httpClient: HttpClient) => new DevourCategoryQueryService(httpClient),
      deps: [HttpClient],
    },
    {
      provide: AUTHOR_QUERY_SERVICE,
      useFactory: (httpClient: HttpClient) => new DevourAuthorQueryService(httpClient),
      deps: [HttpClient],
    },

    // ─── User service (registration) ──────────────────────────
    {
      provide: HttpUserService,
      useFactory: (httpClient: HttpClient) => new HttpUserService(httpClient),
      deps: [HttpClient],
    },
  ],
};
