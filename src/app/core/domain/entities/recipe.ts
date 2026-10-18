import { EntityBase } from './entityBase';
import { Ingredient } from '../value-objects/ingredient';

export class Recipe extends EntityBase {
  private readonly authorId: string;
  private title: string;
  private country: string;
  private description: string | null;
  private imgUrl: string | null;
  private readonly ingredients: Ingredient[];

  constructor(
    id: string,
    authorId: string,
    name: string,
    country: string,
    description: string | null,
    ingredients: Ingredient[],
    imgUrl: string | null = null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.authorId = authorId;
    this.title = name;
    this.country = country;
    this.description = description;
    this.imgUrl = imgUrl;
    this.ingredients = [...ingredients];
  }

  public getName(): string {
    return this.title;
  }

  public setName(newName: string): void {
    this.title = newName;
  }

  public getAuthorId(): string {
    return this.authorId;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public setDescription(newDescription: string | null): void {
    this.description = newDescription;
  }

  public appendToDescription(text: string): void {
    if (this.description) {
      this.description = `${this.description} ${text}`;
    } else {
      this.description = text;
    }
  }

  public getCountry(): string {
    return this.country;
  }

  public setCountry(newCountry: string): void {
    this.country = newCountry;
  }

  public getImageUrl(): string | null {
    return this.imgUrl;
  }

  public setImageUrl(url: string): void {
    this.imgUrl = url;
  }

  public getIngredients(): readonly Ingredient[] {
    return this.ingredients;
  }

  public addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

  public removeIngredientByName(name: string): void {
    const index = this.ingredients.findIndex((ingredient) => ingredient.name === name);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }
  }

  public updateIngredientAmount(name: string, newAmount: number): void {
    const index = this.ingredients.findIndex((i) => i.name === name);
    if (index !== -1) {
      this.ingredients[index] = {
        ...this.ingredients[index],
        amount: newAmount,
      };
    }
  }

  public updateIngredientUnit(name: string, newUnit: string): void {
    const index = this.ingredients.findIndex((i) => i.name === name);
    if (index !== -1) {
      this.ingredients[index] = {
        ...this.ingredients[index],
        unit: newUnit,
      };
    }
  }
}
