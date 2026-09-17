import { ApplicationError } from './application-error';

export interface EntityNotLoadedErrorOptions {
  message?: string;
  cause?: unknown;
}

export class EntityNotLoadedError extends ApplicationError {
  constructor(entityType: string, entityId: number, options: EntityNotLoadedErrorOptions = {}) {
    const reason = options.message ? ` Reason: ${options.message}` : '';
    super(`The ${entityType} with id: ${entityId} not loaded.${reason}`, options.cause);
  }
}
