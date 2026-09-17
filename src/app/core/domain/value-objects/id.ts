import { InvalidIdError } from '../errors/invalid-id';
export class IdValueObject {
  private readonly value: number;

  constructor(id: number) {
    this.validateGreaterThanZero(id);
    this.value = id;
  }

  private validateGreaterThanZero(value: number): void {
    if (isNaN(value) || value <= 0) {
      throw new InvalidIdError(value);
    }
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: IdValueObject): boolean {
    return this.value === other.value;
  }
}
