import { IdValueObject } from '../value-objects/id';

export abstract class Entity {
  protected readonly idValueObject: IdValueObject;

  protected constructor(id: number) {
    this.idValueObject = new IdValueObject(id);
  }

  public getId(): number {
    return this.idValueObject.getValue();
  }

  public equals(other: Entity): boolean {
    if (this === other) return true;
    if (!(other instanceof this.constructor)) return false;
    return this.idValueObject.equals(other.idValueObject);
  }
}
