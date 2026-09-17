class Recipe {
  private readonly id: number;
  private readonly name: string;
  private readonly category: string;
  private readonly description: string;
  private area: string; // The name of the country
  private imgUrl: string | null = null;
  private ingredients: string[];

  constructor(
    id: number,
    name: string,
    category: string,
    description: string,
    area: string,
    imgUrl: string | null,
    ingredients: string[],
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.area = area;
    this.imgUrl = imgUrl;
    this.ingredients = ingredients;
  }
}
