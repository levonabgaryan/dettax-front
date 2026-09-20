import { ApplicationError } from './application-error';

export class EntitiesNotLoadedError extends ApplicationError {
  constructor(entityType: string, cause: unknown | null = null) {
    super(`Error while loading ${entityType} list`, cause);
  }
}
