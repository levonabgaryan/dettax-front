import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RecipeQueryServices } from '../../core/application/query-services/recipe-query-services';
import { CategoryValueObject } from '../../core/domain/value-objects/category-value-object';
import { CategoryValueObjectsAreNotLoadedError } from '../../core/application/errors/category-value-objects-are-not-loaded-error';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly recipeQueryService: RecipeQueryServices;

  public allCategoryValueObjects: WritableSignal<CategoryValueObject[]>;
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;

  constructor(recipeQueryService: RecipeQueryServices) {
    this.recipeQueryService = recipeQueryService;

    this.allCategoryValueObjects = signal<CategoryValueObject[]>([]);
    this.isLoading = signal(false);
    this.errorMessage = signal<string | null>(null);
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.allCategoryValueObjects.set(await this.recipeQueryService.getAllCategoryValueObjects());
    } catch (e) {
      this.errorMessage.set(
        e instanceof CategoryValueObjectsAreNotLoadedError
          ? 'Failed to load categories'
          : 'Unknown error',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected readonly console = console;
}
