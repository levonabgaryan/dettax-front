import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RecipeCRUDService } from '../../../core/application/crud-services/recipe-crud-service';
import { Recipe } from '../../../core/domain/entities/recipe';
import { EntityNotLoadedError } from '../../../core/application/errors/entity-not-loaded-error';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  private readonly recipeCRUDService: RecipeCRUDService;

  public readonly recipe: WritableSignal<Recipe | null>; // Success
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;

  constructor(recipeCRUDService: RecipeCRUDService) {
    this.recipeCRUDService = recipeCRUDService;

    // Use following variables with brackets within the component's html. Always use `()` in html -> recipe().
    this.recipe = signal<Recipe | null>(null); // null, since before loading there is no data
    this.isLoading = signal(false); // state is loading or not
    this.errorMessage = signal<string | null>(null); // error message or null
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const recipe = await this.recipeCRUDService.getById(52772);
      this.recipe.set(recipe);
    } catch (e) {
      this.errorMessage.set(
        e instanceof EntityNotLoadedError ? 'Failed to load recipe' : 'Unknown error',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
