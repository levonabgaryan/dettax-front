import { DomainError } from './domain-error';

export class InvalidIdError extends DomainError {
  constructor(value: number) {
    super(`Invalid ID: ${value}. ID must be a number greater than zero.`);
  }
}
