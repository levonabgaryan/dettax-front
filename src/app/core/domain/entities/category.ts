import { EntityBase } from './entityBase';

export class Category extends EntityBase {
  private name: string;
  private description: string | null;
  private imgUrl: string | null;

  constructor(
    id: string,
    name: string,
    description: string | null,
    imgUrl: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.name = newName;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public appendToDescription(text: string): void {
    if (this.description) {
      this.description = `${this.description} ${text}`;
    } else {
      this.description = text;
    }
  }

  public getImgUrl(): string | null {
    return this.imgUrl;
  }

  public setImgUrl(newImgUrl: string | null): void {
    this.imgUrl = newImgUrl;
  }
}
