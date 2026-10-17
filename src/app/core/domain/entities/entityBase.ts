import { IdValueObject } from '../value-objects/id';

export abstract class EntityBase {
  protected readonly idValueObject: IdValueObject;
  protected readonly createdAt: Date;
  protected readonly updatedAt: Date;

  protected constructor(id: string, createdAt: Date, updatedAt: Date) {
    this.idValueObject = new IdValueObject(id);

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getId(): string {
    return this.idValueObject.getValue();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public equals(other: EntityBase): boolean {
    if (this === other) return true;
    if (!(other instanceof this.constructor)) return false;
    return this.idValueObject.equals(other.idValueObject);
  }
}
