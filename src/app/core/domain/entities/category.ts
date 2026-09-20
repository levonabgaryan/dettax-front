import { Entity } from './entity';

export class Category extends Entity {
  private name: string;
  private description: string;
  private imgUrl: string;

  constructor(id: number, name: string, description: string, imgUrl: string) {
    super(id);
    this.name = name;
    this.description = description;
    this.imgUrl = imgUrl;
  }
  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public getDescription(): string {
    return this.description;
  }
  public setDescription(description: string): void {
    this.description = description;
  }
  public getImgUrl(): string {
    return this.imgUrl;
  }
  public setImgUrl(imgUrl: string): void {
    this.imgUrl = imgUrl;
  }
}
