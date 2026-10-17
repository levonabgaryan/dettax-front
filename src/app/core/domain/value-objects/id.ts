import { InvalidIdError } from '../errors/invalid-id';

export class IdValueObject {
  private readonly value: string;

  constructor(id: string) {
    this.validateNotEmpty(id);
    this.value = id;
  }

  private validateNotEmpty(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidIdError(value);
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: IdValueObject): boolean {
    return this.value === other.value;
  }
}
