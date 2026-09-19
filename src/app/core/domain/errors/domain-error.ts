import { RecipeStoreError } from '../../../recipe-store-error';

export abstract class DomainError extends RecipeStoreError {
  protected constructor(message: string, cause: unknown | null) {
    super(message, cause);
  }
}
