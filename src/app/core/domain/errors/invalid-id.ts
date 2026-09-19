import { DomainError } from './domain-error';

export class InvalidIdError extends DomainError {
  constructor(value: number, cause: unknown | null = null) {
    super(`Invalid ID: ${value}. ID must be a number greater than zero.`, cause);
  }
}
