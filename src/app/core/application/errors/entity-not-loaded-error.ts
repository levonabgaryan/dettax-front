import { ApplicationError } from './application-error';

export interface EntityNotLoadedErrorOptions {
  cause?: unknown;
}

export class EntityNotLoadedError extends ApplicationError {
  constructor(entityType: string, entityId: number, cause: unknown | null = null) {
    super(`The ${entityType} with id: ${entityId} could not be loaded`, cause);
  }
}
