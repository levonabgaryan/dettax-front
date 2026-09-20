import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Recipe } from '../../../core/domain/entities/recipe';
import { EntityNotLoadedError } from '../../../core/application/errors/entity-not-loaded-error';
import { NgOptimizedImage } from '@angular/common';
import { AsyncState } from '../../shared/async-state/async-state';
import { IRecipeRepository } from '../../../core/application/ports/repositories/recipe-repository';
import { RECIPE_REPOSITORY } from '../../../infrastructure/di/repositories';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgOptimizedImage, AsyncState],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  private recipeRepository: IRecipeRepository;

  public readonly recipe: WritableSignal<Recipe | null>; // Success
  public readonly isLoading: WritableSignal<boolean>;
  public readonly errorMessage: WritableSignal<string | null>;

  constructor(@Inject(RECIPE_REPOSITORY) recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository;

    // Use following variables with brackets within the component's html. Always use `()` in html -> recipe().
    this.recipe = signal<Recipe | null>(null); // null, since before loading there is no data
    this.isLoading = signal(false); // state is loading or not
    this.errorMessage = signal<string | null>(null); // error message or null
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const recipe = await this.recipeRepository.getById(52772);
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
