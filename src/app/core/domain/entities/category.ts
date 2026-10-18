import { EntityBase } from './entityBase';

export class Category extends EntityBase {
  private title: string;
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
    this.title = name;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(newName: string): void {
    this.title = newName;
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
