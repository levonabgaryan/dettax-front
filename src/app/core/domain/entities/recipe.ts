import { Entity } from './entity';
import { Category } from './category';

export class Recipe extends Entity {
  private readonly name: string;
  private readonly category: Category;
  private readonly description: string;
  private readonly area: string; // The name of the country
  private readonly imgUrl: string | null = null;
  private readonly ingredients: Set<string>;

  constructor(
    id: number,
    name: string,
    area: string,
    category: Category,
    description: string,
    ingredients: Set<string>,
    imgUrl: string | null = null,
  ) {
    super(id);
    this.name = name;
    this.area = area;
    this.category = category;
    this.description = description;
    this.ingredients = ingredients;
    this.imgUrl = imgUrl;
  }

  public getName(): string {
    return this.name;
  }

  public getCategory(): Category {
    return this.category;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCountry(): string {
    return this.area;
  }

  public getImageUrl(): string | null {
    return this.imgUrl;
  }

  public getIngredients(): ReadonlySet<string> {
    return new Set(this.ingredients);
  }

  public addIngredient(ingredient: string): void {
    this.ingredients.add(ingredient);
  }
}
