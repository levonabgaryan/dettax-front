import { Entity } from './entity';
import { CategoryValueObject } from '../value-objects/category-value-object';

export class Recipe extends Entity {
  private readonly name: string;
  private readonly category: CategoryValueObject;
  private readonly description: string;
  private readonly area: string; // The name of the country
  private readonly imgUrl: string | null = null;
  private readonly ingredients: Set<string>;

  constructor(
    id: number,
    name: string,
    area: string,
    category: CategoryValueObject,
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

  public getCategoryName(): string {
    return this.category.getName();
  }

  public getDescription(): string {
    return this.description;
  }

  public getArea(): string {
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
