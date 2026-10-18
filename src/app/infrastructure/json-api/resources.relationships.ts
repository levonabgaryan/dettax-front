import { JsonApi } from 'devour-client-ts';
import { LogLevel } from 'devour-client-ts/lib/logger';

/**
 * Creates and configures the JsonApi client with all resource definitions.
 * Called once from app.config.ts as a DI provider (singleton).
 */
export function createJsonApi(): JsonApi {
  const jsonApi = new JsonApi({
    apiUrl: 'http://localhost:5247',
    loglevel: LogLevel.WARN,
  });

  jsonApi.define('authors', {
    firstName: '',
    lastName: '',
    email: '',
    createdAt: '',
    updatedAt: '',
    recipes: {
      jsonApi: 'hasMany',
      type: 'recipes',
    },
  });

  jsonApi.define('categories', {
    title: '',
    imgUrl: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    recipes: {
      jsonApi: 'hasMany',
      type: 'recipes',
    },
  });

  jsonApi.define('recipes', {
    title: '',
    country: '',
    description: '',
    imageUrl: '',
    createdAt: '',
    updatedAt: '',
    ingredients: [],
    author: {
      jsonApi: 'hasOne',
      type: 'authors',
    },
    categories: {
      jsonApi: 'hasMany',
      type: 'categories',
    },
  });

  return jsonApi;
}
