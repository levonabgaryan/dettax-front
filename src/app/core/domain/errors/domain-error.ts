import { DettaxFrontError } from '../../../dettax-front-error';

export abstract class DomainError extends DettaxFrontError {
  protected constructor(message: string, cause: unknown | null) {
    super(message, cause);
  }
}
