import { EntityBase } from './entityBase';

export class Author extends EntityBase {
  private firstName: string;
  private lastName: string;
  private readonly email: string;

  constructor(
    id: string,
    name: string,
    lastName: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.firstName = name;
    this.lastName = lastName;
    this.email = email;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public setName(newName: string): void {
    this.firstName = newName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public setLastName(newLastName: string): void {
    this.lastName = newLastName;
  }

  public getEmail(): string {
    return this.email;
  }
}
