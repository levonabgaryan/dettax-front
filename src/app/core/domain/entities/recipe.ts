import { EntityBase } from './entityBase';
import { Category } from './category';
import { Ingredient } from '../value-objects/ingredient';
import { Author } from './author';

export class Recipe extends EntityBase {
  private name: string;
  private country: string;
  private description: string | null;
  private imgUrl: string | null;

  private readonly author: Author | null;

  private readonly categories: Set<Category>;
  private readonly ingredients: Ingredient[];

  constructor(
    id: string,
    name: string,
    country: string,
    categories: Set<Category>,
    author: Author | null,
    description: string | null,
    ingredients: Ingredient[],
    imgUrl: string | null = null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.country = country;
    this.description = description;
    this.imgUrl = imgUrl;
    this.author = author;

    this.categories = new Set(categories);
    this.ingredients = [...ingredients];
  }

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.name = newName;
  }

  public getAuthor(): Author | null {
    return this.author;
  }

  public getCategories(): ReadonlySet<Category> {
    return this.categories;
  }

  public addCategory(category: Category): void {
    this.categories.add(category);
  }
  public removeCategory(category: Category): void {
    this.categories.delete(category);
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
    const ingredient = this.ingredients.find((i) => i.name === name);
    if (ingredient) {
      const index = this.ingredients.indexOf(ingredient);
      this.ingredients[index] = new Ingredient(ingredient.name, newAmount, ingredient.unit);
    }
  }
  public updateIngredientUnit(name: string, newUnit: string): void {
    const ingredient = this.ingredients.find((i) => i.name === name);
    if (ingredient) {
      const index = this.ingredients.indexOf(ingredient);
      this.ingredients[index] = new Ingredient(ingredient.name, ingredient.amount, newUnit);
    }
  }
}
