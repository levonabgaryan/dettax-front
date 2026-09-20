import { ApplicationError } from './application-error';

export class CategoriesAreNotLoadedError extends ApplicationError {
  constructor(cause: unknown | null) {
    super('Error while loading all of the category value objects', cause);
  }
}
