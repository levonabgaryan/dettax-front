export class CategoryValueObject {
  private readonly name: string;
  private readonly imgUrl: string | null;
  private readonly description: string | null;

  constructor(name: string, imgUrl: string | null = null, description: string | null = null) {
    this.name = name;
    this.imgUrl = imgUrl;
    this.description = description;
  }

  public getName(): string {
    return this.name;
  }

  public getImgUrl(): string | null {
    return this.imgUrl;
  }

  public getDescription(): string | null {
    return this.description;
  }
}
